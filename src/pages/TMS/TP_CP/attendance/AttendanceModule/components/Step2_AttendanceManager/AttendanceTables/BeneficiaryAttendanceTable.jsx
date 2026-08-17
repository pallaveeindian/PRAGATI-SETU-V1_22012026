// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/AttendanceTables/BeneficiaryAttendanceTable.jsx
import React, { useMemo } from "react";

export default function BeneficiaryAttendanceTable({
  rows,
  participantPresence,
  onTogglePresence,
}) {
  // Calculate exactly how many participants are marked as present
  const presentCount = useMemo(() => {
    return rows.filter((row) => !!participantPresence[row.key]).length;
  }, [rows, participantPresence]);

  if (!rows || rows.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: 8,
        }}
      >
        <h5 style={{ color: "#002174", margin: 0 }}>
          Beneficiaries / Trainees ({rows.length})
        </h5>

        {/* SURGICAL ADDITION: Highlighted Present Count Tracker */}
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "700",
            border: "1px solid #bbf7d0",
            boxShadow: "0 2px 4px rgba(22, 101, 52, 0.1)",
          }}
        >
          {presentCount} / {rows.length} Present
        </div>
      </div>

      <div
        className="table-responsive"
        style={{
          maxHeight: 420,
          overflow: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
        }}
      >
        <table
          className="table table-striped align-middle table-sm mb-0"
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
              <th style={{ width: 60, textAlign: "center" }}>Present</th>
              <th style={{ textAlign: "center" }}>S.No.</th>
              <th>Name</th>
              <th>LokOS Info</th>
              <th style={{ textAlign: "center" }}>Age</th>
              <th style={{ textAlign: "center" }}>Gender</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const b =
                row.original?.beneficiary || row.original?.trainer || {}; // Support pure trainers
              const isPresent = !!participantPresence[row.key];

              return (
                <tr
                  key={row.key}
                  style={{ background: isPresent ? "#f0fdf4" : "transparent" }}
                >
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) =>
                        onTogglePresence(row.key, e.target.checked)
                      }
                      style={{ transform: "scale(1.3)", cursor: "pointer" }}
                    />
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      fontWeight: 500,
                      color: isPresent ? "#166534" : "inherit",
                    }}
                  >
                    {b.member_name || b.full_name || row.name}
                  </td>
                  <td>
                    {b.lokos_member_code ? (
                      <div>
                        <div style={{ fontFamily: "monospace", fontSize: 15 }}>
                          <strong>{b.lokos_member_code}</strong>
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          SHG Code: {b.lokos_shg_code || "-"}
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
                  <td>
                    {b.district_name_en || "-"}
                    {b.block_name_en && (
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {b.block_name_en}
                      </div>
                    )}
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
