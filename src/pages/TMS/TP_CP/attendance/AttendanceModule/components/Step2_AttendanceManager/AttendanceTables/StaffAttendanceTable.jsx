// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/AttendanceTables/StaffAttendanceTable.jsx
import React, { useMemo } from "react";

export default function StaffAttendanceTable({
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
          Government Staff ({rows.length})
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
              <th style={{ width: 55, textAlign: "center" }}>S.No.</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const staff = row.original?.staff || {};
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
                  <td
                    style={{
                      fontWeight: 500,
                      color: isPresent ? "#166534" : "inherit",
                    }}
                  >
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
