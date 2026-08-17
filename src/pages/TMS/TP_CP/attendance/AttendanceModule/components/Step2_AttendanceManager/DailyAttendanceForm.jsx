// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/DailyAttendanceForm.jsx
import React, { useState, useMemo } from "react";
import api from "../../../../../../../api/axios";

import BeneficiaryAttendanceTable from "./AttendanceTables/BeneficiaryAttendanceTable";
import MasterTrainerAttendanceTable from "./AttendanceTables/MasterTrainerAttendanceTable";
import StaffAttendanceTable from "./AttendanceTables/StaffAttendanceTable";

export default function DailyAttendanceForm({
  batchId,
  today,
  participants,
  attendanceToday,
  canShowForm,
  currentUserId,
  getOrCreateBatchAttendanceForDate,
  getExistingParticipantAttendanceIds,
  fetchAttendanceList,
  setAttendanceToday,
  batch,
}) {
  const [participantPresence, setParticipantPresence] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  const [csvError, setCsvError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formattedToday = new Date(today).toLocaleDateString("en-GB");

  // -------------------------
  // Categorize Participants for Tables
  // -------------------------
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

    return { beneficiaries: b, masterTrainers: mt, staff: s };
  }, [participants]);

  // -------------------------
  // Calculate Total Present
  // -------------------------
  const totalPresentCount = useMemo(() => {
    return participants.filter((p) => !!participantPresence[p.key]).length;
  }, [participants, participantPresence]);

  // -------------------------
  // Quick Actions (Mark All)
  // -------------------------
  const setAllPresence = (status) => {
    const newState = {};
    participants.forEach((p) => {
      newState[p.key] = status;
    });
    setParticipantPresence(newState);
  };

  const handleTogglePresence = (key, val) => {
    setParticipantPresence((prev) => ({ ...prev, [key]: val }));
  };

  // -------------------------
  // CSV Validation
  // -------------------------
  const validateCsvFile = (file) => {
    if (!file) return null;
    if (file.size === 0) return "CSV file is empty (0 KB)";
    if (!file.name.toLowerCase().endsWith(".csv"))
      return "Only CSV files are allowed";
    return null;
  };

  // -------------------------
  // Completion Checker
  // -------------------------
  async function markBatchCompletedIfNeeded() {
    try {
      if (!batch || !batchId || !batch.end_date) return;
      if (today < batch.end_date) return;
      if ((batch.status || "").toUpperCase() !== "ONGOING") return;

      await api.patch(`/tms/batches/${batchId}/`, { status: "COMPLETED" });
    } catch (e) {
      console.error("Failed to mark batch as COMPLETED", e);
    }
  }

  // -------------------------
  // Submit Handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchId || !participants.length) return;

    setIsSubmitting(true);
    try {
      // 1. Get or Create Daily Master Record
      let rec = await getOrCreateBatchAttendanceForDate(today);

      // 2. Attach CSV if provided
      if (csvFile && rec?.id) {
        const patchForm = new FormData();
        patchForm.append("csv_upload", csvFile);
        const patchResp = await api.patch(
          `/tms/batch-attendance/${rec.id}/`,
          patchForm,
        );
        rec = patchResp?.data ?? patchResp ?? rec;
      }

      setAttendanceToday(rec);

      if (!rec?.id)
        throw new Error(
          "Cannot create participant attendance without a master record ID.",
        );

      // 3. Prevent Duplicate Submissions
      const existingKeys = await getExistingParticipantAttendanceIds(rec.id);

      // 4. Submit Participant Level Data
      for (const p of participants) {
        const key = `${p.participant_role}-${p.participant_id}`;
        if (existingKeys.has(key)) continue; // Skip already submitted

        const present = !!participantPresence[p.key];

        await api.post("/tms/participant-attendance/", {
          attendance: rec.id,
          participant_id: p.participant_id,
          participant_name: p.name,
          participant_role: p.participant_role,
          present,
          is_active: true,
          created_by: currentUserId,
        });
      }

      // 5. Cleanup & Refresh
      await fetchAttendanceList();
      await markBatchCompletedIfNeeded();
      alert("Today's attendance recorded successfully.");
    } catch (error) {
      console.error("Attendance submission failed", error);
      alert("Failed to record attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // Render Locks
  // -------------------------
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
        <h5 style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
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
        <h5 style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
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
        <h4 style={{ margin: 0, color: "#0f172a" }}>
          Record Attendance for Today ({formattedToday})
        </h4>

        {/* QUICK ACTIONS UI */}
        <div style={{ display: "flex", gap: 8 }}>
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
        {/* CSV Upload Section */}
        <div
          style={{
            marginBottom: 24,
            padding: 16,
            background: "#f8fafc",
            borderRadius: 8,
            border: "1px dashed #cbd5e1",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              display: "block",
              marginBottom: 8,
              color: "#334155",
            }}
          >
            Upload Punch Machine Data (Optional)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              const error = validateCsvFile(file);
              setCsvError(error || "");
              setCsvFile(error ? null : file);
            }}
            style={{ display: "block", marginBottom: 4 }}
          />
          {csvError && (
            <div style={{ color: "#dc2626", fontSize: 12, fontWeight: 500 }}>
              {csvError}
            </div>
          )}
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Only .csv files generated by standard punch machines are supported.
          </div>
        </div>

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
            style={{ minWidth: 160, fontWeight: 600, padding: "10px 24px" }}
            disabled={isSubmitting || participants.length === 0 || !!csvError}
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
              style={{ marginBottom: 12 }}
            ></div>
            <h5 style={{ margin: 0, color: "#0f172a" }}>
              Saving Attendance...
            </h5>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>
              Please wait while records are updated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
