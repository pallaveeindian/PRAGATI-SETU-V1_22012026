// src\pages\TMS\BacklogBatchCreator\components\Step3_AttendanceMatrix.jsx
import React, { useMemo, useEffect } from "react";

export default function Step3_AttendanceMatrix({
  batchData,
  updateBatchData,
  onNext,
  onPrev,
}) {
  const {
    startDate,
    endDate,
    selectedParticipants,
    masterTrainers,
    attendanceMatrix,
  } = batchData;

  // ==========================================
  // 1. GENERATE DATE ARRAY
  // ==========================================
  const trainingDates = useMemo(() => {
    if (!startDate || !endDate) return [];

    let dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [startDate, endDate]);

  // ==========================================
  // 2. COMBINE PARTICIPANTS (Staff + MTs)
  // ==========================================
  const combinedPool = useMemo(() => {
    const safeTrainers = Array.isArray(masterTrainers) ? masterTrainers : [];
    const safeParticipants = Array.isArray(selectedParticipants)
      ? selectedParticipants
      : [];

    return [
      ...safeTrainers.map((mt) => ({
        _role: "trainer",
        _id: mt.id,
        _name: mt.full_name,
        _identifier: mt.mobile_no || mt.aadhaar_no || "-",
        _key: `trainer-${mt.id}`,
      })),
      ...safeParticipants.map((p) => ({
        _role: "trainee",
        _id: p.id,
        _name: p.member_name || p.full_name || "-",
        _identifier:
          p.lokos_member_code || p.employee_id || p.aadhaar_no || "-",
        _key: `trainee-${p.id}`,
      })),
    ];
  }, [masterTrainers, selectedParticipants]);

  // ==========================================
  // 3. INITIALIZE ATTENDANCE MATRIX DEFAULTS
  // ==========================================
  useEffect(() => {
    if (trainingDates.length === 0 || combinedPool.length === 0) return;

    // We check if the matrix is completely empty. If so, initialize everyone as Absent (false)
    if (Object.keys(attendanceMatrix).length === 0) {
      const initialMatrix = {};

      trainingDates.forEach((date) => {
        initialMatrix[date] = {};
        combinedPool.forEach((p) => {
          initialMatrix[date][p._key] = false; // Default: Absent
        });
      });

      updateBatchData({ attendanceMatrix: initialMatrix });
    }
  }, [trainingDates, combinedPool, attendanceMatrix]);

  // ==========================================
  // 4. TOGGLE CELL HANDLER
  // ==========================================
  const toggleAttendance = (date, participantKey) => {
    const currentStatus = attendanceMatrix[date]?.[participantKey] || false;

    updateBatchData({
      attendanceMatrix: {
        ...attendanceMatrix,
        [date]: {
          ...attendanceMatrix[date],
          [participantKey]: !currentStatus, // Toggle status
        },
      },
    });
  };

  // Quick Action: Mark an entire column (Date) as Present/Absent
  const markColumn = (date, isPresent) => {
    const newColState = {};
    combinedPool.forEach((p) => {
      newColState[p._key] = isPresent;
    });

    updateBatchData({
      attendanceMatrix: {
        ...attendanceMatrix,
        [date]: newColState,
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{ margin: "0 0 4px 0", color: "#1e3a8a", fontSize: "16px" }}
          >
            3. Historical Attendance Matrix
          </h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
            Click on a cell to toggle Present (
            <span style={{ color: "#16a34a", fontWeight: "bold" }}>P</span>) or
            Absent (
            <span style={{ color: "#dc2626", fontWeight: "bold" }}>A</span>).
          </p>
        </div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
          Duration:{" "}
          <span style={{ color: "#2563eb" }}>{trainingDates.length} Days</span>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          overflowX: "auto",
          position: "relative",
        }}
      >
        <table style={styles.table}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#e4ecf5",
            }}
          >
            <tr>
              <th
                style={{
                  ...styles.th,
                  width: "50px",
                  textAlign: "center",
                  borderRight: "1px solid #cbd5e1",
                }}
              >
                S.No
              </th>
              <th
                style={{
                  ...styles.th,
                  width: "80px",
                  textAlign: "center",
                  borderRight: "1px solid #cbd5e1",
                }}
              >
                Role
              </th>
              <th
                style={{
                  ...styles.th,
                  minWidth: "200px",
                  borderRight: "1px solid #cbd5e1",
                }}
              >
                Participant Name
              </th>

              {/* Render dynamic date columns */}
              {trainingDates.map((date, idx) => (
                <th
                  key={date}
                  style={{
                    ...styles.th,
                    minWidth: "120px",
                    textAlign: "center",
                    borderRight: "1px solid #cbd5e1",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>Day {idx + 1}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      fontWeight: "500",
                      marginBottom: "8px",
                    }}
                  >
                    {new Date(date).toLocaleDateString("en-GB")}
                  </div>
                  {/* Column Quick Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => markColumn(date, true)}
                      style={styles.quickBtn(true)}
                    >
                      All P
                    </button>
                    <button
                      onClick={() => markColumn(date, false)}
                      style={styles.quickBtn(false)}
                    >
                      All A
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {combinedPool.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + trainingDates.length}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                    fontStyle: "italic",
                  }}
                >
                  No participants available.
                </td>
              </tr>
            ) : (
              combinedPool.map((p, idx) => (
                <tr
                  key={p._key}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: "#fff",
                  }}
                >
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#475569",
                      borderRight: "1px solid #f1f5f9",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      borderRight: "1px solid #f1f5f9",
                    }}
                  >
                    <span
                      style={{
                        background:
                          p._role === "trainer" ? "#fdf4ff" : "#eff6ff",
                        color: p._role === "trainer" ? "#a21caf" : "#2563eb",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      {p._role}
                    </span>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "600",
                      color: "#0f172a",
                      borderRight: "1px solid #f1f5f9",
                    }}
                  >
                    {p._name}
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        fontWeight: "500",
                      }}
                    >
                      {p._identifier}
                    </div>
                  </td>

                  {/* Render dynamic attendance cells */}
                  {trainingDates.map((date) => {
                    const isPresent = attendanceMatrix[date]?.[p._key] || false;

                    return (
                      <td
                        key={`${date}-${p._key}`}
                        onClick={() => toggleAttendance(date, p._key)}
                        style={{
                          ...styles.td,
                          textAlign: "center",
                          borderRight: "1px solid #f1f5f9",
                          cursor: "pointer",
                          background: isPresent ? "#f0fdf4" : "#fef2f2",
                          transition: "background 0.2s",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: isPresent ? "#16a34a" : "#dc2626",
                            color: "#fff",
                            fontWeight: "800",
                            fontSize: "14px",
                            boxShadow: isPresent
                              ? "0 2px 4px rgba(22,163,74,0.3)"
                              : "0 2px 4px rgba(220,38,38,0.3)",
                          }}
                        >
                          {isPresent ? "P" : "A"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: "1px solid #e2e8f0",
          marginTop: "10px",
        }}
      >
        <button
          onClick={onPrev}
          style={{
            background: "#ffffff",
            color: "#475569",
            border: "1px solid #cbd5e1",
            padding: "10px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Back to Duration & E-KYC
        </button>

        <button
          onClick={onNext}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 32px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
          }}
        >
          Proceed to Media Uploads →
        </button>
      </div>
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "12px",
    color: "#1e3a8a",
    borderBottom: "2px solid #cbd5e1",
    verticalAlign: "top",
  },
  td: { padding: "8px 12px" },
  quickBtn: (isPresent) => ({
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "700",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    background: isPresent ? "#dcfce7" : "#fee2e2",
    color: isPresent ? "#166534" : "#991b1b",
  }),
};
