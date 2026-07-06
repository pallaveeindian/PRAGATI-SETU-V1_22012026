// src/pages/TMS/TRs/BatchDetailComponents/ParticipantsSummaryTable.jsx
import React from "react";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch (e) {
    return iso || "-";
  }
}

export default function ParticipantsSummaryTable({
  displayedParticipants,
  isTrainerTraining,
}) {
  return (
    <div>
      <h3 className="participants-title">
        👥 {isTrainerTraining ? "Batch Trainers" : "Participants"} (
        {displayedParticipants.length})
      </h3>

      <div
        style={{
          maxHeight: 400,
          overflow: "auto",
          borderRadius: 8,
          border: "1px solid #a7c6ed",
          background: "#fff",
        }}
      >
        <table
          className="table table-compact"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead
            style={{
              background: "#e4ecf5",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr>
              <th className="thStyle">S.No.</th>
              <th className="thStyle">Name</th>
              <th className="thStyle">Mobile</th>
              <th className="thStyle">Gender</th>
              <th className="thStyle">Attendance</th>
              <th className="thStyle">Status</th>

              {isTrainerTraining ? (
                <>
                  <th className="thStyle">Designation</th>
                  <th className="thStyle">Replaced</th>
                  <th className="thStyle">Total Cost (₹)</th>
                </>
              ) : (
                <>
                  <th className="thStyle">Age</th>
                  <th className="thStyle">PLD</th>
                  <th className="thStyle">Category</th>
                  <th className="thStyle">Total Cost (₹)</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {displayedParticipants.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: 20,
                    color: "#2b4e72",
                    background: "#f8fbff",
                  }}
                >
                  No participants assigned
                </td>
              </tr>
            ) : (
              displayedParticipants.map((p, index) => {
                const attSummary = p.attendance_summary;

                return (
                  <tr
                    key={p.participation_id || p.id || index}
                    style={{
                      borderBottom: "1px solid #e4ecf5",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f4f8fd")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="tdStyle">{index + 1}</td>

                    <td className="table-cell table-cell-bold">
                      {p.full_name || p.member_name || "-"}
                    </td>

                    <td className="tdStyle">
                      {p.mobile_no || p.mobile || "-"}
                    </td>

                    <td className="tdStyle">{p.gender || "-"}</td>

                    <td className="tdStyle">
                      {attSummary ? (
                        <span style={{ fontWeight: 600, color: "#3d6ba6" }}>
                          {attSummary.attendance_fraction || "0/0"} (
                          {attSummary.attendance_percentage || 0}%)
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="tdStyle">
                      {attSummary ? (
                        attSummary.is_dropout ? (
                          <span style={{ color: "#dc2626", fontWeight: 600 }}>
                            Dropout
                          </span>
                        ) : attSummary.is_successful ? (
                          <span style={{ color: "#16a34a", fontWeight: 600 }}>
                            Successful
                          </span>
                        ) : (
                          <span style={{ color: "#d97706", fontWeight: 600 }}>
                            In Progress
                          </span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>

                    {isTrainerTraining ? (
                      <>
                        <td className="tdStyle">{p.designation || "-"}</td>
                        <td
                          className={`table-cell-bold ${
                            p.is_replaced ? "replaced-yes" : "replaced-no"
                          }`}
                        >
                          {p.is_replaced ? "Yes" : "No"}
                        </td>
                        {/* --- SURGICAL ADDITION --- */}
                        <td className="tdStyle">
                          {p.total_cost ? (
                            <strong style={{ color: "#166534" }}>
                              ₹{p.total_cost}
                            </strong>
                          ) : (
                            "-"
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="tdStyle">{p.age || "-"}</td>
                        <td className="tdStyle">{p.pld_status || "-"}</td>
                        <td className="tdStyle">{p.social_category || "-"}</td>
                        {/* --- SURGICAL ADDITION --- */}
                        <td className="tdStyle">
                          {p.total_cost ? (
                            <strong style={{ color: "#166534" }}>
                              ₹{p.total_cost}
                            </strong>
                          ) : (
                            "-"
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table tbody tr:hover {
          background: #e4ecf5;
          transition: background .2s ease;
        }
        .thStyle {
          padding: 10px 12px;
          text-align: left;
          font-weight: 700;
          font-size: 13px;
          color: #2b4e72;
          border-bottom: 2px solid #a7c6ed;
        }
        .tdStyle {
          padding: 10px 12px;
          font-size: 13px;
          color: #2b4e72;
        }
        .table-cell {
          padding: 10px 12px;
          font-size: 13px;
          color: #2b4e72;
        }
        .table-cell-bold {
          font-weight: 600;
        }
        .replaced-yes {
          color: #5a8cc2;
          font-weight: 600;
        }
        .replaced-no {
          color: #3d6ba6;
          font-weight: 600;
        }
        .participants-title {
          color: #2b4e72;
          font-weight: 700;
          margin-bottom: 14px;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
