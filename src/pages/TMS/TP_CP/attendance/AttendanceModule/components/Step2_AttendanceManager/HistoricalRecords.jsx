// src/pages/TMS/TP_CP/attendance/cpad_per_batch_ekyc.jsx
import React, { useState } from "react";
import api from "../../../../../../../api/axios";

// Helper for formatting
function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function HistoricalRecords({ batchId, attendanceList }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRecords, setSelectedDateRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const fetchParticipantRecords = async (attendanceId, dateStr) => {
    setSelectedDate(dateStr);
    setIsLoadingRecords(true);
    setSelectedDateRecords([]);

    try {
      const resp = await api.get(
        `/tms/participant-attendance/?attendance=${attendanceId}`,
      );
      const data = resp?.data ?? resp ?? {};
      setSelectedDateRecords(data.results || data || []);
    } catch (e) {
      console.error("Failed to fetch historical participant attendance", e);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  if (!attendanceList || attendanceList.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          borderRadius: 8,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
        }}
      >
        <h4 style={{ marginTop: 0, color: "#0f172a" }}>
          Past Attendance Records
        </h4>
        <div
          style={{ textAlign: "center", color: "#64748b", padding: "20px 0" }}
        >
          No historical attendance records found for this batch yet.
        </div>
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
      }}
    >
      <h4 style={{ marginTop: 0, color: "#0f172a", marginBottom: 20 }}>
        Past Attendance Records
      </h4>

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
      >
        {attendanceList.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => fetchParticipantRecords(a.id, a.date)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${selectedDate === a.date ? "#1d4ed8" : "#cbd5e1"}`,
              background: selectedDate === a.date ? "#1d4ed8" : "#f8fafc",
              color: selectedDate === a.date ? "#ffffff" : "#334155",
              fontWeight: selectedDate === a.date ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {fmtDate(a.date)}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div
          style={{
            borderTop: "2px solid #f1f5f9",
            paddingTop: 20,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <h5 style={{ color: "#002174", marginBottom: 16 }}>
            Details for {fmtDate(selectedDate)}
          </h5>

          {isLoadingRecords ? (
            <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
              <div
                className="spinner-border spinner-border-sm text-primary"
                style={{ marginRight: 8 }}
              ></div>
              Loading participants...
            </div>
          ) : selectedDateRecords.length === 0 ? (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: 8,
              }}
            >
              No participant records found for this date.
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{
                maxHeight: 350,
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
                    <th>SNo.</th>
                    <th>Participant Name</th>
                    <th>System Role</th>
                    <th style={{ width: 120, textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDateRecords.map((r, index) => (
                    <tr key={r.id}>
                      <td style={{ textAlign: "centre" }}>{index + 1}</td>
                      <td style={{ fontWeight: 500, color: "#1e293b" }}>
                        {r.participant_name}
                      </td>
                      <td
                        style={{
                          color: "#475569",
                          textTransform: "capitalize",
                        }}
                      >
                        {r.participant_role === "trainer"
                          ? "Master Trainer"
                          : r.participant_role}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: r.present ? "#dcfce7" : "#fee2e2",
                            color: r.present ? "#166534" : "#b91c1c",
                            border: `1px solid ${r.present ? "#bbf7d0" : "#fecaca"}`,
                          }}
                        >
                          {r.present ? "PRESENT" : "ABSENT"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
