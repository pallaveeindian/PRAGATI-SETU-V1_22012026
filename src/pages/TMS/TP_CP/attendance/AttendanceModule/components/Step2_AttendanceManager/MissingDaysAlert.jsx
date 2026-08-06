// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/MissingDaysAlert.jsx
import React from "react";

// Helper to gracefully format dates
function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function MissingDaysAlert({
  missingDates,
  onAutoMarkAbsent,
  isSubmitting,
  participantCount,
}) {
  if (!missingDates || missingDates.length === 0) return null;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: "#fee2e2",
        border: "1px solid #fca5a5",
        color: "#991b1b",
        marginBottom: 24,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 24, lineHeight: 1 }}>⚠️</div>
        <div style={{ flex: 1 }}>
          <h5
            style={{
              marginTop: 0,
              marginBottom: 8,
              color: "#7f1d1d",
              fontWeight: 700,
            }}
          >
            Action Required: Pending Past Attendance
          </h5>
          <p style={{ fontSize: 14, margin: "0 0 16px 0", color: "#991b1b" }}>
            Attendance was not recorded for{" "}
            <strong>{missingDates.length}</strong> past training day
            {missingDates.length > 1 ? "s" : ""}
            &nbsp;(from <strong>{fmtDate(missingDates[0])}</strong> to{" "}
            <strong>{fmtDate(missingDates[missingDates.length - 1])}</strong>).
            Because the 24-hour window has expired for those dates, all{" "}
            {participantCount} participants must be marked absent. You must
            close these past records before proceeding with today's attendance.
          </p>
          <button
            className="btn btn-danger"
            disabled={isSubmitting || participantCount === 0}
            onClick={onAutoMarkAbsent}
            style={{ fontWeight: 600, padding: "8px 16px" }}
          >
            {isSubmitting
              ? "Processing Past Records..."
              : `Mark All Absent for ${missingDates.length} Missed Day${missingDates.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
