// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/DailyAttendanceForm.jsx
import React, { useState, useMemo } from "react";
import { TMS_API } from "../../../../../../../api/axios";
import BeneficiaryAttendanceTable from "./AttendanceTables/BeneficiaryAttendanceTable";
import MasterTrainerAttendanceTable from "./AttendanceTables/MasterTrainerAttendanceTable";
import StaffAttendanceTable from "./AttendanceTables/StaffAttendanceTable";

export default function DailyAttendanceForm({
  batchId,
  today,
  participants = [],
  attendanceToday,
  canShowForm,
  missingDates = [],
  fetchAttendanceList,
}) {
  const [participantPresence, setParticipantPresence] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedToday = new Date(`${today}T00:00:00`).toLocaleDateString(
    "en-GB",
  );
  // Categorize Participants for Tables
  const { beneficiaries, masterTrainers, staff } = useMemo(() => {
    const b = [];
    const mt = [];
    const s = [];
    participants.forEach((p) => {
      if (p.original?.master_trainer || p.original?.trainer) {
        mt.push(p);
      } else if (p.original?.staff) {
        s.push(p);
      } else {
        b.push(p);
      }
    });
    return {
      beneficiaries: b,
      masterTrainers: mt,
      staff: s,
    };
  }, [participants]);
  // Calculate Total Present
  const totalPresentCount = useMemo(() => {
    return participants.filter((p) => !!participantPresence[p.key]).length;
  }, [participants, participantPresence]);
  // Quick Actions (Mark All)
  const setAllPresence = (status) => {
    const newState = {};
    participants.forEach((p) => {
      newState[p.key] = status;
    });

    setParticipantPresence(newState);
  };

  const handleTogglePresence = (key, val) => {
    setParticipantPresence((prev) => ({
      ...prev,
      [key]: val,
    }));
  };
  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!batchId) {
      alert("Batch ID is missing.");
      return;
    }

    if (!today) {
      alert("Attendance date is missing.");
      return;
    }

    if (!participants.length) {
      alert("No participants configured for this batch.");
      return;
    }

    setIsSubmitting(true);

    try {
      // -------------------------
      // Build participant records
      // -------------------------
      const participantRecords = participants.map((p) => {
        const originalRole = String(p.participant_role || "").toLowerCase();

        // Backend strictly accepts only:
        // "trainer" or "trainee"
        const participantRole =
          originalRole === "trainer" ? "trainer" : "trainee";

        return {
          participant_id: String(p.participant_id),

          participant_role: participantRole,

          participant_name: p.name || "",

          present: !!participantPresence[p.key],
        };
      });

      // -------------------------
      // Required Payload
      // -------------------------
      const payload = {
        batch_id: Number(batchId),

        date: today,

        missing_dates: Array.isArray(missingDates) ? missingDates : [],

        participant_records: participantRecords,
      };

      const response = await TMS_API.batchAttendanceOneShot(payload);

      if (fetchAttendanceList) {
        await fetchAttendanceList();
      }

      const responseData = response?.data || {};

      let successMessage =
        responseData.message || "Attendance successfully recorded.";

      if (
        Array.isArray(responseData.dates_processed) &&
        responseData.dates_processed.length > 0
      ) {
        successMessage += `\n\nDates Processed: ${responseData.dates_processed.join(
          ", ",
        )}`;
      }

      if (responseData.batch_status) {
        successMessage += `\nBatch Status: ${responseData.batch_status}`;
      }

      alert(successMessage);
    } catch (error) {
      console.error("ONE-SHOT ATTENDANCE FAILED:", error);

      console.error("HTTP STATUS:", error?.response?.status);

      console.error("BACKEND RESPONSE:", error?.response?.data);

      const backendError = error?.response?.data;

      // Show actual backend error
      if (backendError?.detail) {
        alert(backendError.detail);
      } else if (backendError?.message) {
        alert(backendError.message);
      } else if (backendError) {
        alert(JSON.stringify(backendError, null, 2));
      } else {
        alert(error?.message || "Failed to record attendance.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //Render Locks

  if (attendanceToday && attendanceToday.id) {
    return (
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
          marginBottom: 24,
        }}
      >
        <h5
          style={{
            margin: "0 0 4px 0",
            fontWeight: 700,
          }}
        >
          Attendance Complete ✅
        </h5>

        <span style={{ fontSize: 14 }}>
          Attendance for today ({formattedToday}) has been successfully
          submitted and locked.
        </span>
      </div>
    );
  }

  if (!canShowForm) {
    return (
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: "#e0f2fe",
          color: "#1e3a8a",
          border: "1px solid #bae6fd",
          marginBottom: 24,
        }}
      >
        <h5
          style={{
            margin: "0 0 4px 0",
            fontWeight: 700,
          }}
        >
          Window Locked 🔒
        </h5>

        <span style={{ fontSize: 14 }}>
          Attendance recording will be enabled when today's scheduled start time
          is reached.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              color: "#0f172a",
            }}
          >
            Record Attendance for Today ({formattedToday})
          </h4>

          {missingDates.length > 0 && (
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#b45309",
                fontWeight: 600,
              }}
            >
              {missingDates.length} missing training day
              {missingDates.length > 1 ? "s" : ""} will automatically be marked
              absent when attendance is submitted.
            </div>
          )}
        </div>

        {/* QUICK ACTIONS UI */}
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            onClick={() => setAllPresence(true)}
          >
            Mark All Present
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => setAllPresence(false)}
          >
            Mark All Absent
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Modular Tables */}

        {participants.length === 0 ? (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              color: "#64748b",
              background: "#f1f5f9",
              borderRadius: 8,
            }}
          >
            No participants configured for this batch.
          </div>
        ) : (
          <>
            <MasterTrainerAttendanceTable
              rows={masterTrainers}
              participantPresence={participantPresence}
              onTogglePresence={handleTogglePresence}
            />

            <BeneficiaryAttendanceTable
              rows={beneficiaries}
              participantPresence={participantPresence}
              onTogglePresence={handleTogglePresence}
            />

            <StaffAttendanceTable
              rows={staff}
              participantPresence={participantPresence}
              onTogglePresence={handleTogglePresence}
            />

            {/* OVERALL PRESENT COUNT SUMMARY BADGE */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <div
                style={{
                  background: "#ecfdf5",
                  color: "#065f46",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "700",
                  border: "2px solid #a7f3d0",
                  boxShadow: "0 2px 4px rgba(6, 95, 70, 0.1)",
                }}
              >
                Overall Present Today: {totalPresentCount} /{" "}
                {participants.length}
              </div>

              <div
                style={{
                  background: "#fdf1ec",
                  color: "#5f0606",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "700",
                  border: "2px solid #f3b2a7",
                  boxShadow: "0 2px 4px rgba(6, 95, 70, 0.1)",
                }}
              >
                Overall Absent Today: {participants.length - totalPresentCount}{" "}
                / {participants.length}
              </div>
            </div>
          </>
        )}

        {/* Form Actions */}

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e2e8f0",
            paddingTop: 16,
          }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              minWidth: 160,
              fontWeight: 600,
              padding: "10px 24px",
            }}
            disabled={isSubmitting || participants.length === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Final Attendance"}
          </button>
        </div>
      </form>

      {/* Submitting Overlay */}

      {isSubmitting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              textAlign: "center",
              minWidth: 250,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="spinner-border text-primary"
              style={{
                marginBottom: 12,
              }}
            ></div>

            <h5
              style={{
                margin: 0,
                color: "#0f172a",
              }}
            >
              Saving Attendance...
            </h5>

            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Please wait while records are updated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
