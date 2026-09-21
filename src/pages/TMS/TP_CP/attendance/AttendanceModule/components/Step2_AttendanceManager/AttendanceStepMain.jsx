// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/AttendanceStepMain.jsx

import React, { useState, useEffect, useRef } from "react";

import { TMS_API } from "../../../../../../../api/axios";

// Step 2 Sub-components
import MissingDaysAlert from "./MissingDaysAlert";
import DailyAttendanceForm from "./DailyAttendanceForm";
import HistoricalRecords from "./HistoricalRecords";
import ScheduleSetup from "../Step1_EkycManager/ScheduleSetup";

// -------------------------
// Time & Date Helpers
// -------------------------
function parseHHMM(timeStr) {
  if (!timeStr) {
    return {
      h: 0,
      m: 0,
    };
  }

  const [h, m] = timeStr.split(":");

  return {
    h: parseInt(h || "0", 10),
    m: parseInt(m || "0", 10),
  };
}

function computeDayStart(scheduleObj, dateStr) {
  if (!scheduleObj?.start_time) {
    return null;
  }

  const { h, m } = parseHHMM(scheduleObj.start_time);

  const d = new Date(`${dateStr}T00:00:00`);

  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0);
}

export default function AttendanceStepMain({
  batchId,
  batchData,
  schedule,
  today,
  participants = [],
  attendances = [],
  attendanceToday,
  missingDates = [],
  refreshData,
}) {
  const [canShowForm, setCanShowForm] = useState(false);

  const [submittingMissing, setSubmittingMissing] = useState(false);

  const timeCheckIntervalRef = useRef(null);

  const hasSchedule = !!schedule;

  // ========================================================
  // MISSING DAYS
  // Mark ONLY missing dates absent
  // ========================================================
  const handleAutoMarkMissingAbsent = async () => {
    if (!batchId || missingDates.length === 0 || participants.length === 0) {
      return;
    }

    setSubmittingMissing(true);

    try {
      /*
       * We do NOT submit today's attendance here.
       *
       * First missed date becomes the main `date`.
       * Remaining missed dates are passed as
       * `missing_dates`.
       *
       * Everyone is absent.
       */

      const firstMissingDate = missingDates[0];

      const remainingMissingDates = missingDates.slice(1);

      const participantRecords = participants.map((p) => {
        const role = String(p.participant_role || "").toLowerCase();

        return {
          participant_id: String(p.participant_id),

          participant_role: role === "trainer" ? "trainer" : "trainee",

          participant_name: p.name || "",

          present: false,
        };
      });

      const payload = {
        batch_id: Number(batchId),

        date: firstMissingDate,

        missing_dates: remainingMissingDates,

        participant_records: participantRecords,
      };

      console.log("MISSING DAYS ONE-SHOT PAYLOAD:", payload);

      const response = await TMS_API.batchAttendanceOneShot(payload);

      console.log("MISSING DAYS ONE-SHOT RESPONSE:", response?.data);

      // Refresh batch so missingDates becomes []
      if (refreshData) {
        await refreshData();
      }

      alert(
        `${missingDates.length} missing day${
          missingDates.length > 1 ? "s" : ""
        } marked absent successfully.`,
      );
    } catch (error) {
      console.error("MISSING DAYS ATTENDANCE FAILED:", error);

      console.error("HTTP STATUS:", error?.response?.status);

      console.error("BACKEND RESPONSE:", error?.response?.data);

      const backendError = error?.response?.data;

      if (backendError?.detail) {
        alert(backendError.detail);
      } else if (backendError?.message) {
        alert(backendError.message);
      } else if (backendError) {
        alert(JSON.stringify(backendError, null, 2));
      } else {
        alert("Failed to mark missing days absent.");
      }
    } finally {
      setSubmittingMissing(false);
    }
  };

  // ========================================================
  // TODAY'S TIME WINDOW
  // ========================================================
  const evaluateTimeWindow = () => {
    if (!batchData || !schedule) {
      return false;
    }

    if (attendanceToday?.id) {
      return false;
    }

    const startDateTime = computeDayStart(schedule, today);

    if (!startDateTime) {
      return false;
    }

    return new Date() >= startDateTime;
  };

  // ========================================================
  // POLL START TIME
  // ========================================================
  useEffect(() => {
    const isReadyNow = evaluateTimeWindow();

    setCanShowForm(isReadyNow);

    if (attendanceToday?.id || isReadyNow) {
      if (timeCheckIntervalRef.current) {
        clearInterval(timeCheckIntervalRef.current);

        timeCheckIntervalRef.current = null;
      }

      return;
    }

    timeCheckIntervalRef.current = setInterval(() => {
      if (evaluateTimeWindow()) {
        setCanShowForm(true);

        clearInterval(timeCheckIntervalRef.current);

        timeCheckIntervalRef.current = null;
      }
    }, 15000);

    return () => {
      if (timeCheckIntervalRef.current) {
        clearInterval(timeCheckIntervalRef.current);

        timeCheckIntervalRef.current = null;
      }
    };
  }, [batchData, schedule, attendanceToday, today]);

  // ========================================================
  // RENDER
  // ========================================================
  return (
    <div
      style={{
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* 1. Batch Start Time */}

      <ScheduleSetup
        batchId={batchId}
        hasSchedule={hasSchedule}
        refreshData={refreshData}
        schedule={schedule}
      />

      {/* 2. Missing Days */}

      {missingDates.length > 0 && (
        <MissingDaysAlert
          missingDates={missingDates}
          participantCount={participants.length}
          isSubmitting={submittingMissing}
          onAutoMarkAbsent={handleAutoMarkMissingAbsent}
        />
      )}

      {/* 3. Today's Attendance
          Only open after missing days are cleared
      */}

      {missingDates.length === 0 &&
        (!batchData?.end_date || today <= batchData.end_date) && (
          <DailyAttendanceForm
            batchId={batchId}
            today={today}
            participants={participants}
            attendanceToday={attendanceToday}
            canShowForm={canShowForm}
            missingDates={[]}
            fetchAttendanceList={refreshData}
          />
        )}

      {/* 4. Historical Records */}

      <HistoricalRecords batchId={batchId} attendanceList={attendances} />
    </div>
  );
}
