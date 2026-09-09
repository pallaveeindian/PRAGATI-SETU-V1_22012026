// src/pages/TMS/TP_CP/attendance/AttendanceModule/hooks/useLiveBatchData.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { TMS_API } from "../../../../../../api/axios";

// Helper: get YYYY-MM-DD using local time (not UTC)
function todayLocalISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Helper: Add days to ISO string
function addDaysISO(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function useLiveBatchData(batchId) {
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = useMemo(() => todayLocalISO(), []);

  // --------------------------------------------------------
  // 1. ATOMIC DATA FETCH
  // --------------------------------------------------------
  const fetchBatchData = useCallback(
    async (showLoader = true) => {
      if (!batchId) return;
      if (showLoader) setLoading(true);
      setError(null);
      try {
        // V2 endpoint contains EVERYTHING: plan, ekyc, attendance, schedules, participants
        const resp = await TMS_API.batchDetailV2(batchId);
        setBatchData(resp?.data || null);
      } catch (err) {
        console.error("Failed to fetch live batch data:", err);
        setError("Failed to load live batch details. Please try again.");
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [batchId],
  );

  // Initial mount fetch
  useEffect(() => {
    fetchBatchData();
  }, [fetchBatchData]);

  // --------------------------------------------------------
  // 2. DERIVED STATE: UNIFIED PARTICIPANTS
  // --------------------------------------------------------
  const participants = useMemo(() => {
    if (!batchData) return [];
    const rows = [];

    // Master Trainers -> Role: 'trainer'
    (batchData.master_trainer_participations || []).forEach((mtp) => {
      const person =
        mtp.master_trainer ||
        (batchData.master_trainers || []).find(
          (m) => m.id === mtp.master_trainer,
        ) ||
        {};
      rows.push({
        key: `trainer-${mtp.id}`,
        participation_id: mtp.id,
        participant_id: String(mtp.id),
        participant_role: "trainer",
        name: person.full_name || `MasterTrainer #${mtp.id}`,
        mobile: person.mobile_no || "-",
        designation: person.designation || "-",
        original: mtp,
      });
    });

    // Beneficiaries -> Role: 'trainee'
    (batchData.beneficiary_participations || []).forEach((bp) => {
      const person =
        bp.beneficiary ||
        (batchData.beneficiary || []).find((x) => x.id === bp.beneficiary) ||
        {};
      rows.push({
        key: `trainee-${bp.id}`,
        participation_id: bp.id,
        participant_id: String(bp.id),
        participant_role: "trainee",
        name: person.member_name || `Beneficiary #${bp.id}`,
        mobile: person.mobile || "-",
        age: person.age || "-",
        social_category: person.social_category || "-",
        pld_status: person.pld_status || "-",
        original: bp,
      });
    });

    // Regular Trainers -> Role: 'trainee'
    (batchData.trainer_participations || []).forEach((tp) => {
      const person =
        tp.trainer ||
        (batchData.trainer || []).find((x) => x.id === tp.trainer) ||
        {};
      rows.push({
        key: `trainee-${tp.id}`,
        participation_id: tp.id,
        participant_id: String(tp.id),
        participant_role: "trainee",
        name: person.full_name || person.member_name || `Trainer #${tp.id}`,
        mobile: person.mobile_no || "-",
        designation: person.designation || "-",
        original: tp,
      });
    });

    // Staff -> Role: 'trainee'
    (batchData.staff_participations || []).forEach((sp) => {
      const person =
        sp.staff ||
        (batchData.staff || []).find((x) => x.id === sp.staff) ||
        {};
      rows.push({
        key: `trainee-${sp.id}`,
        participation_id: sp.id,
        participant_id: String(sp.id),
        participant_role: "trainee",
        name: person.full_name || person.member_name || `Staff #${sp.id}`,
        mobile: person.mobile || "-",
        designation: person.designation || "-",
        employee_id: person.employee_id || "-",
        original: sp,
      });
    });

    return rows;
  }, [batchData]);

  // --------------------------------------------------------
  // 3. DERIVED STATE: EKYC ROWS & STATUS
  // --------------------------------------------------------
  const ekycRows = useMemo(() => {
    if (!batchData) return [];

    // Map existing verifications from the server
    const serverEkycMap = new Map();
    (batchData.ekyc_verifications || []).forEach((srv) => {
      const key = `${(srv.participant_role || "").toLowerCase()}-${String(srv.participant_id)}`;
      serverEkycMap.set(key, srv);
    });

    // Build the final array by merging base participants with their server EKYC data
    return participants.map((p) => {
      const existingServerData = serverEkycMap.get(p.key);
      return {
        ...p,
        id: existingServerData?.id || null,
        ekyc_status: existingServerData?.ekyc_status || "PENDING",
        verified_on: existingServerData?.verified_on || null,
        remarks: existingServerData?.remarks || "",
        ekyc_document: existingServerData?.ekyc_document || null,
      };
    });
  }, [participants, batchData]);

  const allEkycVerified = useMemo(() => {
    if (ekycRows.length === 0) return false;
    return ekycRows.every((r) => r.ekyc_status === "VERIFIED");
  }, [ekycRows]);

  // --------------------------------------------------------
  // 4. DERIVED STATE: SCHEDULE & ATTENDANCE
  // --------------------------------------------------------
  const schedule = useMemo(() => {
    return batchData?.schedules && batchData.schedules.length > 0
      ? batchData.schedules[0]
      : null;
  }, [batchData]);

  const attendances = useMemo(() => {
    return batchData?.attendances || [];
  }, [batchData]);

  const attendanceToday = useMemo(() => {
    return attendances.find((a) => a.date === today) || null;
  }, [attendances, today]);

  // --------------------------------------------------------
  // 5. DERIVED STATE: MISSING DATES (Requires Auto-Absent)
  // --------------------------------------------------------
  const missingDates = useMemo(() => {
    if (!batchData || !batchData.start_date) return [];

    const startDate = batchData.start_date;
    const endLimit =
      batchData.end_date && batchData.end_date < today
        ? batchData.end_date
        : today;
    const yesterday = addDaysISO(today, -1);
    const stop = yesterday < endLimit ? yesterday : endLimit;

    if (startDate > stop) return []; // Batch hasn't started or started today

    const recordedDates = new Set(attendances.map((a) => a.date));

    const toMark = [];
    let cursor = startDate;
    while (cursor <= stop) {
      if (!recordedDates.has(cursor)) {
        toMark.push(cursor);
      }
      cursor = addDaysISO(cursor, 1);
    }

    return toMark;
  }, [batchData, attendances, today]);

  // --------------------------------------------------------
  // 6. RETURN API
  // --------------------------------------------------------
  return {
    // State
    batchData,
    loading,
    error,
    today,

    // Derived Participants & EKYC
    participants,
    ekycRows,
    allEkycVerified,

    // Derived Schedule & Attendance
    schedule,
    attendances,
    attendanceToday,
    missingDates,

    // Actions
    refreshData: fetchBatchData,
  };
}
