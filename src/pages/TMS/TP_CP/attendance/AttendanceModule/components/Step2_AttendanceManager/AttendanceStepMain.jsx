// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/AttendanceStepMain.jsx
import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import api from "../../../../../../../api/axios";
import { AuthContext } from "../../../../../../../contexts/AuthContext";

// Step 2 Sub-components
import MissingDaysAlert from "./MissingDaysAlert";
import DailyAttendanceForm from "./DailyAttendanceForm";
import HistoricalRecords from "./HistoricalRecords";

// -------------------------
// Time & Date Helpers
// -------------------------
function parseHHMM(timeStr) {
  if (!timeStr) return { h: 0, m: 0 };
  const [h, m] = timeStr.split(":");
  return { h: parseInt(h || "0", 10), m: parseInt(m || "0", 10) };
}

function computeDayStart(scheduleObj, dateStr) {
  if (!scheduleObj?.start_time) return null;
  const { h, m } = parseHHMM(scheduleObj.start_time);
  const d = new Date(dateStr + "T00:00:00");
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0);
}

export default function AttendanceStepMain({
  batchId,
  batchData,
  schedule,
  today,
  participants,
  attendances,
  attendanceToday,
  missingDates,
  refreshData,
}) {
  const { user } = useContext(AuthContext) || {};
  const currentUserId = user?.id || user?.pk || null;

  const [submittingMissing, setSubmittingMissing] = useState(false);
  const [canShowForm, setCanShowForm] = useState(false);
  const timeCheckIntervalRef = useRef(null);

  // -------------------------
  // Bulletproof EKYC Checker
  // -------------------------
  const isEkycComplete = useMemo(() => {
    if (!batchData || participants.length === 0) return false;
    const verifications = batchData.ekyc_verifications || [];

    return participants.every((p) => {
      return verifications.some(
        (v) =>
          String(v.participant_id) === String(p.participant_id) &&
          (v.participant_role || "").toLowerCase() ===
            (p.participant_role || "").toLowerCase() &&
          (v.ekyc_status || "").toUpperCase() === "VERIFIED",
      );
    });
  }, [batchData, participants]);

  // -------------------------
  // Auto-Absent Logic for Missed Days
  // -------------------------
  async function getOrCreateBatchAttendanceForDate(dateStr) {
    try {
      const resp = await api.get(
        `/tms/batch-attendance/?batch=${batchId}&date=${dateStr}`,
      );
      const data = resp?.data ?? resp ?? {};
      const rec = (data.results || data || [])[0] || null;
      if (rec && rec.id) return rec;
    } catch (e) {
      console.warn("GET batch-attendance failed for", dateStr);
    }

    // If not exists, POST to create it
    try {
      const formData = new FormData();
      formData.append("batch", batchId);
      formData.append("date", dateStr);
      formData.append("is_active", "true");
      if (currentUserId) formData.append("created_by", String(currentUserId));

      const postResp = await api.post("/tms/batch-attendance/", formData);
      return postResp?.data ?? postResp ?? null;
    } catch (e) {
      // Race condition check: Did someone else create it instantly?
      const nonFieldErrors = e?.response?.data?.non_field_errors || [];
      if (nonFieldErrors.some((msg) => String(msg).includes("unique set"))) {
        const resp2 = await api.get(
          `/tms/batch-attendance/?batch=${batchId}&date=${dateStr}`,
        );
        const data2 = resp2?.data ?? resp2 ?? {};
        return (data2.results || data2 || [])[0] || null;
      }
      throw e;
    }
  }

  async function getExistingParticipantAttendanceIds(attendanceId) {
    const resp = await api.get(
      `/tms/participant-attendance/?attendance=${attendanceId}`,
    );
    const data = resp?.data ?? resp ?? {};
    const recs = data.results || data || [];
    return new Set(
      recs.map(
        (r) =>
          `${(r.participant_role || "").toLowerCase()}-${String(r.participant_id)}`,
      ),
    );
  }

  async function markBatchCompletedIfNeeded() {
    try {
      if (!batchData || !batchId || !batchData.end_date) return;
      if (today < batchData.end_date) return;
      if ((batchData.status || "").toUpperCase() !== "ONGOING") return;

      await api.patch(`/tms/batches/${batchId}/`, { status: "COMPLETED" });
    } catch (e) {
      console.error("Failed to mark batch as COMPLETED", e);
    }
  }

  const handleAutoMarkMissingAbsent = async () => {
    if (!batchId || missingDates.length === 0) return;

    setSubmittingMissing(true);
    try {
      for (const dateStr of missingDates) {
        const attRec = await getOrCreateBatchAttendanceForDate(dateStr);
        if (!attRec?.id) continue;

        const existingKeys = await getExistingParticipantAttendanceIds(
          attRec.id,
        );

        for (const p of participants) {
          const key = `${p.participant_role}-${p.participant_id}`;
          if (existingKeys.has(key)) continue;

          await api.post("/tms/participant-attendance/", {
            attendance: attRec.id,
            participant_id: p.participant_id,
            participant_name: p.name,
            participant_role: p.participant_role,
            present: false, // Strictly false for missed historical days
            is_active: true,
            created_by: currentUserId,
          });
        }
      }
      // Check if closing these past dates finalized the batch
      await markBatchCompletedIfNeeded();

      // Trigger full Live Data sync
      await refreshData();
    } catch (e) {
      console.error("Bulk auto-mark absent failed", e);
      alert(
        "Failed to auto-mark some past days. Please check your connection and try again.",
      );
    } finally {
      setSubmittingMissing(false);
    }
  };

  // -------------------------
  // Time Window Evaluator (Unlocks form)
  // -------------------------
  const evaluateTimeWindow = () => {
    if (!batchData || !schedule || !isEkycComplete) return false;
    if (attendanceToday?.id) return false;
    if (missingDates.length > 0) return false;

    const startDateTime = computeDayStart(schedule, today);
    if (!startDateTime) return false;

    return new Date() >= startDateTime;
  };

  // Poll time in background if waiting for the scheduled start time
  useEffect(() => {
    const isReadyNow = evaluateTimeWindow();
    setCanShowForm(isReadyNow);

    if (attendanceToday?.id || isReadyNow) {
      if (timeCheckIntervalRef.current)
        clearInterval(timeCheckIntervalRef.current);
      return;
    }

    timeCheckIntervalRef.current = setInterval(() => {
      if (evaluateTimeWindow()) {
        setCanShowForm(true);
        clearInterval(timeCheckIntervalRef.current);
      }
    }, 15000); // Check every 15s

    return () => {
      if (timeCheckIntervalRef.current)
        clearInterval(timeCheckIntervalRef.current);
    };
  }, [
    batchData,
    schedule,
    isEkycComplete,
    attendanceToday,
    today,
    missingDates.length,
  ]);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* 1. Global Blockers */}
      {!isEkycComplete && (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            marginBottom: 24,
          }}
        >
          <h5 style={{ marginTop: 0, marginBottom: 8, color: "#7f1d1d" }}>
            E-KYC Incomplete
          </h5>
          <p style={{ margin: 0, fontSize: 14 }}>
            Attendance cannot be recorded until all participants and trainers
            are verified via E-KYC. Please return to Step 1 and complete the
            verifications.
          </p>
        </div>
      )}

      {/* 2. Missing Days Alert (Top Priority Intercept) */}
      {isEkycComplete && missingDates.length > 0 && (
        <MissingDaysAlert
          missingDates={missingDates}
          participantCount={participants.length}
          isSubmitting={submittingMissing}
          onAutoMarkAbsent={handleAutoMarkMissingAbsent}
        />
      )}

      {/* 3. Today's Attendance Form */}
      {isEkycComplete &&
        missingDates.length === 0 &&
        (!batchData.end_date || today <= batchData.end_date) && (
          <DailyAttendanceForm
            batchId={batchId}
            today={today}
            participants={participants}
            attendanceToday={attendanceToday}
            canShowForm={canShowForm}
            currentUserId={currentUserId}
            getOrCreateBatchAttendanceForDate={
              getOrCreateBatchAttendanceForDate
            }
            getExistingParticipantAttendanceIds={
              getExistingParticipantAttendanceIds
            }
            fetchAttendanceList={refreshData}
            setAttendanceToday={() => refreshData()}
            batch={batchData}
          />
        )}

      {/* 4. Historical Reference View */}
      <HistoricalRecords batchId={batchId} attendanceList={attendances} />
    </div>
  );
}
