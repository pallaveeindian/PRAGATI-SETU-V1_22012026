// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step1_EkycManager/EkycTables/MasterTrainerEkycTable.jsx
import React from "react";

export default function MasterTrainerEkycTable({
  rows,
  recordingFor,
  verifyingFor,
  hasSchedule,
  onRecord,
  onVerify,
}) {
  if (!rows || rows.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <h5
        style={{
          color: "#002174",
          marginBottom: 12,
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: 8,
        }}
      >
        Trainers / Master Trainers ({rows.length})
      </h5>
      <div
        className="table-responsive"
        style={{ maxHeight: 420, overflow: "auto" }}
      >
        <table
          className="table table-striped align-middle table-sm"
          style={{ fontSize: "13px" }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "#f8fafc",
              zIndex: 1,
            }}
          >
            <tr>
              <th style={{ width: 60, textAlign: "center" }}>S.No.</th>
              <th>Name</th>
              <th>Guardian / Spouse</th>
              <th>Designation</th>
              <th>Mobile</th>
              <th>EKYC Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              // Extract deeply nested trainer info if it's a regular trainer
              const mt =
                row.original?.master_trainer ||
                row.original?.trainer?.trainer ||
                row.original?.trainer ||
                {};

              const isMasterTrainer = !!row.original?.master_trainer;

              // Format Designation with Theme Name
              const themeName = mt.theme?.theme_name;
              const displayDesignation = themeName
                ? `${mt.designation || "MT"} - ${themeName}`
                : mt.designation || "MT";

              const status = (row.ekyc_status || "PENDING").toUpperCase();
              const isVerified = status === "VERIFIED";
              const isRecording = recordingFor === row.key;
              const isVerifying = verifyingFor === row.key;

              return (
                <React.Fragment key={row.key}>
                  {isMasterTrainer && (
                    <tr className="master-trainer-badge-row">
                      <td colSpan={7}>
                        <span className="master-trainer-badge">
                          ★ MASTER TRAINER
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr className={isMasterTrainer ? "master-trainer-row" : ""}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>
                      {mt.full_name || row.name}
                    </td>
                    <td>{mt.parent_or_spouse_name || "—"}</td>
                    <td>
                      <span
                        style={{
                          background: "#e0e7ff",
                          color: "#3730a3",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {displayDesignation}
                      </span>
                    </td>
                    <td>{mt.mobile_no || row.mobile || "-"}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: isVerified ? "#dcfce7" : "#fef3c7",
                          color: isVerified ? "#166534" : "#92400e",
                        }}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled={isVerified || isRecording}
                          onClick={() => onRecord(row)}
                          style={{ minWidth: 120 }}
                        >
                          {isRecording ? "Recording..." : "Record Fingerprint"}
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={isVerified || isVerifying || !hasSchedule}
                          onClick={() => onVerify(row)}
                          style={{ minWidth: 70 }}
                        >
                          {isVerifying ? "Verifying..." : "Verify!"}
                        </button>
                        {isVerified && (
                          <span
                            className="text-success"
                            style={{ fontSize: 16 }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
