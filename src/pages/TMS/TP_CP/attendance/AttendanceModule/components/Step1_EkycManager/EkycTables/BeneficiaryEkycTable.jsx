// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step1_EkycManager/EkycTables
import React from "react";

export default function BeneficiaryEkycTable({
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
        Beneficiaries / Trainees ({rows.length})
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
              <th>LokOS Info</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Category</th>
              <th>Location</th>
              <th>Mobile</th>
              <th>EKYC Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const b =
                row.original?.beneficiary || row.original?.trainer || {}; // Fallback for pure trainers if mixed
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
                  <td style={{ fontWeight: 500 }}>
                    {b.member_name || b.full_name || row.name}
                  </td>
                  <td>
                    {b.lokos_member_code ? (
                      <div>
                        <div>
                          <strong>MemberCode:</strong> {b.lokos_member_code}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          <strong>SHGCode:</strong> {b.lokos_shg_code || "-"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {b.age ? `${b.age} Yrs` : "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {b.gender ? String(b.gender).charAt(0) : "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {b.social_category || "-"}
                  </td>
                  <td>
                    {b.district_name_en || "-"}
                    {b.block_name_en && (
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {b.block_name_en}
                      </div>
                    )}
                  </td>
                  <td>{b.mobile || row.mobile || "-"}</td>
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
