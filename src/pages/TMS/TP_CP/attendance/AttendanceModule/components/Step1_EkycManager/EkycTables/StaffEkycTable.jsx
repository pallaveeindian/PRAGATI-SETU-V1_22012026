// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step1_EkycManager/EkycTables/
import React from "react";

export default function StaffEkycTable({
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
        Government Staff ({rows.length})
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
              <th>Employee ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Location</th>
              <th>Mobile</th>
              <th>EKYC Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const staff = row.original?.staff || {};
              const status = (row.ekyc_status || "PENDING").toUpperCase();
              const isVerified = status === "VERIFIED";
              const isRecording = recordingFor === row.key;
              const isVerifying = verifyingFor === row.key;

              return (
                <tr key={row.key}>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td>
                    <span
                      style={{
                        background: "#f1f5f9",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontFamily: "monospace",
                        fontWeight: 600,
                      }}
                    >
                      {staff.employee_id || "—"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {staff.full_name || row.name}
                  </td>
                  <td>{staff.designation || "—"}</td>
                  <td>
                    {staff.district_name_en || "-"}
                    {staff.block_name_en && (
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {staff.block_name_en}
                      </div>
                    )}
                  </td>
                  <td>{staff.mobile || row.mobile || "-"}</td>
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
                        <span className="text-success" style={{ fontSize: 16 }}>
                          ✓
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
