// src/pages/TMS/TRs/BatchDetailComponents/DailyAttendanceViewer.jsx
import React, { useState, useMemo, useEffect } from "react";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

function normalizeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("/media/")) return url;
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    } catch {
      return url;
    }
  }
  return url;
}

export default function AttendanceViewer({
  attendanceList = [],
  batchMedia = [],
  onOpenMedia,
  onSaveAttendance, // Optional callback: (attendanceId, updatedRecords) => {}
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editableRecords, setEditableRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Safely sort attendances by date
  const sortedAttendances = useMemo(() => {
    return [...attendanceList].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );
  }, [attendanceList]);

  // Find the exact attendance record for the selected date
  const selectedAttendance = useMemo(() => {
    if (!selectedDate) return null;
    return sortedAttendances.find((a) => a.date === selectedDate) || null;
  }, [selectedDate, sortedAttendances]);

  // Sync editable records when selected attendance changes
  useEffect(() => {
    if (selectedAttendance && selectedAttendance.participant_records) {
      setEditableRecords(
        selectedAttendance.participant_records.map((r) => ({ ...r }))
      );
    } else {
      setEditableRecords([]);
    }
  }, [selectedAttendance]);

  // Dynamically check if any record was changed compared to the original data
  const hasChanges = useMemo(() => {
    if (!selectedAttendance || editableRecords.length === 0) return false;
    return editableRecords.some((record) => {
      const originalRecord = selectedAttendance.participant_records.find(
        (r) => r.id === record.id
      );
      return originalRecord && originalRecord.present !== record.present;
    });
  }, [editableRecords, selectedAttendance]);

  // Calculate counts
  const presentCount = editableRecords.filter((r) => r.present).length;
  const absentCount = editableRecords.length - presentCount;

  // Filter media files that belong specifically to the selected date
  const mediaForDate = useMemo(() => {
    if (!selectedDate) return [];
    return batchMedia.filter((m) => m.date === selectedDate);
  }, [selectedDate, batchMedia]);

  // Toggle single participant present/absent status
  const handleToggleStatus = (recordId) => {
    setEditableRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return { ...r, present: !r.present };
        }
        return r;
      })
    );
  };

  // Save changes handler
  const handleSaveChanges = async () => {
    if (!onSaveAttendance || !selectedAttendance || isSaving) return;

    setIsSaving(true);
    try {
      await onSaveAttendance(selectedAttendance.id, editableRecords);
      alert("Attendance changes saved successfully!");
    } catch (error) {
      console.error("Attendance update failed:", error);
      alert("Attendance changes save nahi ho sake. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (sortedAttendances.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <h3 className="attendance-title"> Daily Attendance & Media</h3>
        <div style={{ color: "#64748b", fontStyle: "italic", padding: "12px 0" }}>
          No daily records found for this batch.
        </div>
        <style>{`
          .attendance-title {
            margin-bottom: 16px;
            color: #2b4e72;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24, marginTop: 30 }}>
      <h3 className="attendance-title"> Daily Attendance & Media</h3>

      {/* DATES TABLE OVERVIEW */}
      <div className="attendance-table-wrapper">
        <table className="table table-compact attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Created At</th>
              <th>CSV Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttendances.map((att) => (
              <tr key={att.id}>
                <td>
                  <button
                    type="button"
                    className={`attendance-date-btn ${
                      selectedDate === att.date ? "active" : ""
                    }`}
                    onClick={() => setSelectedDate(att.date)}
                  >
                    {fmtDate(att.date)}
                  </button>
                </td>
                <td>{fmtDate(att.created_at)}</td>
                <td>
                  <span
                    className={`badge ${
                      att.csv_upload ? "badge-uploaded" : "badge-not-uploaded"
                    }`}
                  >
                    {att.csv_upload ? "Uploaded" : "Not Uploaded"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SELECTED DATE DETAILS */}
      {selectedDate && selectedAttendance && (
        <div className="attendance-detail">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 className="attendance-subtitle" style={{ margin: 0 }}>
              Attendance on {fmtDate(selectedDate)}
              <span className="attendance-counts">
                (Present: <strong style={{ color: "#16a34a" }}>{presentCount}</strong> | Absent: <strong style={{ color: "#dc2626" }}>{absentCount}</strong>)
              </span>
            </h4>
            
            {hasChanges && (
              <button
                type="button"
                className="save-attendance-btn"
                onClick={handleSaveChanges}
                 disabled={isSaving}
              >
                 {isSaving ? "Saving..." : "Save Attendance Changes"}
              </button>
            )}
          </div>

          {/* PARTICIPANTS LIST FOR SELECTED DATE */}
          {editableRecords.length === 0 ? (
            <div
              style={{
                color: "#64748b",
                fontStyle: "italic",
                marginBottom: 16,
              }}
            >
              No participant attendance records for this date.
            </div>
          ) : (
            <div className="attendance-participant-table">
              <table className="table table-compact attendance-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status (Click to toggle)</th>
                  </tr>
                </thead>
                <tbody>
                  {editableRecords.map((r, index) => {
                    return (
                      <tr key={r.id}>
                        <td>{index + 1}</td>
                        <td>{r.participant_name}</td>
                        <td>
                          <span className="role-pill">
                            {r.participant_role === "trainer"
                              ? "Trainer"
                              : "Trainee"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`badge status-toggle-btn ${
                              r.present ? "badge-present" : "badge-absent"
                            }`}
                            onClick={() => handleToggleStatus(r.id)}
                            title="Click to toggle status"
                          >
                            {r.present ? "Present ✓" : "Absent ✕"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* MEDIA FOR SELECTED DATE */}
          {mediaForDate.length > 0 && (
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px dashed #cbd5e1",
              }}
            >
              <h4 style={{ margin: "0 0 12px 0", color: "#3d6ba6" }}>
                Media Uploaded on {fmtDate(selectedDate)}
              </h4>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {mediaForDate.map((m) => {
                  const src = normalizeMediaUrl(m.file);
                  const isImage = src && !src.toLowerCase().endsWith(".pdf");

                  return (
                    <div
                      key={m.id}
                      style={{
                        width: 150,
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                        padding: 8,
                        background: "#fff",
                        fontSize: 12,
                      }}
                    >
                      {isImage ? (
                        <img
                          src={src}
                          alt={m.category}
                          style={{
                            width: "100%",
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          onClick={() => onOpenMedia && onOpenMedia(src)}
                        />
                      ) : (
                        <div
                          style={{
                            height: 90,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f8fafc",
                            borderRadius: 4,
                            cursor: "pointer",
                            color: "#3d6ba6",
                            fontWeight: 600,
                          }}
                          onClick={() => window.open(src, "_blank")}
                        >
                          View PDF
                        </div>
                      )}
                      <div
                        style={{
                          marginTop: 6,
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {m.category}
                      </div>
                      {m.notes && (
                        <div style={{ marginTop: 2, color: "#64748b" }}>
                          {m.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .attendance-title {
          margin-bottom: 16px;
          color: #2b4e72;
          font-weight: 700;
        }
        .attendance-table-wrapper {
          max-height: 250px;
          overflow: auto;
          border: 1px solid #a7c6ed;
          border-radius: 8px;
          background: #fff;
        }
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .attendance-table thead {
          background: #e4ecf5;
          color: #2b4e72;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .attendance-table th {
          font-weight: 600;
          padding: 10px 12px;
          text-align: left;
          border-bottom: 2px solid #a7c6ed;
        }
        .attendance-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e4ecf5;
        }
        .attendance-table tbody tr:hover {
          background: #f4f8fd;
        }
        .attendance-date-btn {
          border: 1px solid #a7c6ed;
          background: #e4ecf5;
          color: #2b4e72;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .attendance-date-btn:hover {
          background: #a7c6ed;
        }
        .attendance-date-btn.active {
          background: #3d6ba6;
          color: #fff;
          border-color: #3d6ba6;
        }
        .badge {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 999px;
          font-weight: 600;
          display: inline-block;
        }
        .badge-uploaded {
          background: #dcfce7;
          color: #166534;
        }
        .badge-not-uploaded {
          background: #f1f5f9;
          color: #64748b;
        }
        .badge-present {
          background: #e0e7ff;
          color: #3730a3;
          border: none;
          cursor: pointer;
        }
        .badge-absent {
          background: #fee2e2;
          color: #991b1b;
          border: none;
          cursor: pointer;
        }
        .status-toggle-btn {
          transition: transform 0.1s;
        }
        .status-toggle-btn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }
        .role-pill {
          background: #fef3c7;
          color: #b45309;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        .attendance-detail {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 2px solid #e2e8f0;
        }
        .attendance-subtitle {
          margin-top: 0;
          margin-bottom: 12px;
          color: #3d6ba6;
          font-size: 16px;
        }
        .attendance-counts {
          font-size: 14px;
          color: #64748b;
          margin-left: 12px;
          font-weight: normal;
        }
        .attendance-participant-table {
          max-height: 300px;
          overflow: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .save-attendance-btn {
          background: #16a34a;
          color: #fff;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .save-attendance-btn:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  );
}