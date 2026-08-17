// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/AttendanceTables/MasterTrainerAttendanceTable.jsx
import React, { useMemo } from "react";

export default function MasterTrainerAttendanceTable({
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
          Trainers / Master Trainers ({rows.length})
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
              <th style={{ width: 60, textAlign: "center" }}>S.No.</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Mobile</th>
              <th>Guardian / Spouse</th>
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

              const isPresent = !!participantPresence[row.key];

              return (
                <React.Fragment key={row.key}>
                  {isMasterTrainer && (
                    <tr className="master-trainer-badge-row">
                      <td colSpan={6}>
                        <span className="master-trainer-badge">
                          ★ MASTER TRAINER
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr
                    className={isMasterTrainer ? "master-trainer-row" : ""}
                    style={{
                      background: isPresent
                        ? "#f0fdf4"
                        : isMasterTrainer
                          ? undefined
                          : "transparent",
                    }}
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
                        fontWeight: 600,
                        color: isPresent ? "#166534" : "#0f172a",
                      }}
                    >
                      {mt.full_name || row.name}
                    </td>
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
                    <td style={{ color: "#475569" }}>
                      {mt.parent_or_spouse_name || "—"}
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
