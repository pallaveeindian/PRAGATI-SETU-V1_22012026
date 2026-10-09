// src/pages/TMS/TRs/BatchDetailComponents/DailyAttendanceViewer.jsx
import React, { useState, useMemo, useEffect } from "react";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
  onSaveAttendance,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editableRecords, setEditableRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const sortedAttendances = useMemo(() => {
    return [...attendanceList].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );
  }, [attendanceList]);

  const selectedAttendance = useMemo(() => {
    if (!selectedDate) return null;
    return sortedAttendances.find((a) => a.date === selectedDate) || null;
  }, [selectedDate, sortedAttendances]);

  useEffect(() => {
    if (selectedAttendance && selectedAttendance.participant_records) {
      setEditableRecords(
        selectedAttendance.participant_records.map((r) => ({ ...r })),
      );
    } else {
      setEditableRecords([]);
    }
  }, [selectedAttendance]);

  const hasChanges = useMemo(() => {
    if (!selectedAttendance || editableRecords.length === 0) return false;
    return editableRecords.some((record) => {
      const originalRecord = selectedAttendance.participant_records.find(
        (r) => r.id === record.id,
      );
      return originalRecord && originalRecord.present !== record.present;
    });
  }, [editableRecords, selectedAttendance]);

  const presentCount = editableRecords.filter((r) => r.present).length;
  const absentCount = editableRecords.length - presentCount;

  const mediaForDate = useMemo(() => {
    if (!selectedDate) return [];
    return batchMedia.filter((m) => m.date === selectedDate);
  }, [selectedDate, batchMedia]);

  const handleToggleStatus = (recordId) => {
    setEditableRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return { ...r, present: !r.present };
        }
        return r;
      }),
    );
  };

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

  const closeModal = () => {
    setSelectedDate(null);
  };

  if (sortedAttendances.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <h3 className="attendance-title">Daily Attendance & Media</h3>
        <div className="empty-state">
          No daily records found for this batch.
        </div>
        <style>{`
          .attendance-title {
            margin-bottom: 16px;
            color: #1e293b;
            font-weight: 700;
            font-size: 20px;
          }
          .empty-state {
            color: #64748b;
            font-style: italic;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px dashed #cbd5e1;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24, marginTop: 30 }}>
      <h3 className="attendance-title">Daily Attendance & Media</h3>

      {/* DATES TABLE OVERVIEW */}
      <div className="attendance-table-wrapper custom-scrollbar">
        <table className="table attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Created At</th>
              <th>CSV Status</th>
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
                    📅 {fmtDate(att.date)}
                  </button>
                </td>
                <td style={{ color: "#475569" }}>{fmtDate(att.created_at)}</td>
                <td>
                  <span
                    className={`status-badge ${
                      att.csv_upload ? "badge-uploaded" : "badge-not-uploaded"
                    }`}
                  >
                    {att.csv_upload ? "✓ Uploaded" : "⚠ Not Uploaded"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FOR SELECTED DATE DETAILS */}
      {selectedDate && selectedAttendance && (
        <div className="attendance-modal-overlay" onClick={closeModal}>
          <div
            className="attendance-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="attendance-modal-header">
              <div className="modal-header-left">
                <h3 className="modal-title">
                  Attendance Details
                  <span className="modal-date-chip">
                    {fmtDate(selectedDate)}
                  </span>
                </h3>
                <div className="attendance-stats">
                  <div className="stat-pill stat-present">
                    <span className="stat-dot present-dot"></span>
                    Present: <strong>{presentCount}</strong>
                  </div>
                  <div className="stat-pill stat-absent">
                    <span className="stat-dot absent-dot"></span>
                    Absent: <strong>{absentCount}</strong>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {hasChanges && (
                  <button
                    type="button"
                    className={`btn-primary ${isSaving ? "saving" : ""}`}
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  title="Close"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* PARTICIPANTS LIST */}
            {editableRecords.length === 0 ? (
              <div className="empty-state">
                No participant attendance records for this date.
              </div>
            ) : (
              <div className="attendance-participant-wrapper custom-scrollbar">
                <table className="table participant-table">
                  <thead>
                    <tr>
                      <th width="8%">S.No.</th>
                      <th width="45%">Participant Name</th>
                      <th width="20%">Role</th>
                      <th width="27%" style={{ textAlign: "right" }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableRecords.map((r, index) => {
                      return (
                        <tr key={r.id}>
                          <td style={{ color: "#64748b", fontWeight: 500 }}>
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td style={{ fontWeight: 600, color: "#1e293b" }}>
                            {r.participant_name}
                          </td>
                          <td>
                            <span className="role-pill">
                              {r.participant_role === "trainer"
                                ? "Trainer"
                                : "Trainee"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className={`toggle-status-btn ${
                                r.present ? "status-present" : "status-absent"
                              }`}
                              onClick={() => handleToggleStatus(r.id)}
                            >
                              {r.present ? "✓ Present" : "✕ Absent"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* MEDIA SECTION */}
            {mediaForDate.length > 0 && (
              <div className="media-section">
                <h4 className="media-title">Media Uploaded</h4>
                <div className="media-grid">
                  {mediaForDate.map((m) => {
                    const src = normalizeMediaUrl(m.file);
                    const isImage = src && !src.toLowerCase().endsWith(".pdf");

                    return (
                      <div key={m.id} className="media-card">
                        <div className="media-preview">
                          {isImage ? (
                            <img
                              src={src}
                              alt={m.category}
                              onClick={() => onOpenMedia && onOpenMedia(src)}
                            />
                          ) : (
                            <div
                              className="pdf-preview"
                              onClick={() => window.open(src, "_blank")}
                            >
                              📄 View PDF
                            </div>
                          )}
                        </div>
                        <div className="media-info">
                          <div className="media-category">{m.category}</div>
                          {m.notes && (
                            <div className="media-notes">{m.notes}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* --- MAIN PAGE UI --- */
        .attendance-title {
          margin-bottom: 16px;
          color: #0f172a;
          font-weight: 700;
          font-size: 20px;
        }
        .attendance-table-wrapper {
          max-height: 300px;
          overflow: auto;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .attendance-table thead {
          background: #f8fafc;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .attendance-table th {
          font-weight: 600;
          padding: 14px 16px;
          text-align: left;
          color: #475569;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #cbd5e1;
        }
        .attendance-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .attendance-table tbody tr:hover {
          background: #f8fafc;
        }
        .attendance-date-btn {
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #334155;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .attendance-date-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .attendance-date-btn.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        .status-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
        }
        .badge-uploaded { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-not-uploaded { background: #fef08a; color: #854d0e; border: 1px solid #fde047; }

        /* --- MODAL OVERLAY & CONTAINER --- */
        .attendance-modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .attendance-modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        
        /* --- MODAL HEADER --- */
        .attendance-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .modal-header-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .modal-title {
          margin: 0;
          color: #0f172a;
          font-size: 22px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-date-chip {
          font-size: 14px;
          background: #e2e8f0;
          color: #475569;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }
        .attendance-stats {
          display: flex;
          gap: 12px;
        }
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 6px;
          background: #fff;
          border: 1px solid #e2e8f0;
        }
        .stat-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .present-dot { background: #22c55e; }
        .absent-dot { background: #ef4444; }

        .modal-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-primary {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .btn-primary.saving {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-close {
          background: #f1f5f9;
          border: none;
          width: 36px; height: 36px;
          border-radius: 50%;
          font-size: 20px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .btn-close:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        /* --- MODAL TABLE --- */
        .attendance-participant-wrapper {
          padding: 0 24px;
          overflow-y: auto;
          flex-grow: 1;
          margin-top: 16px;
          margin-bottom: 16px;
        }
        .participant-table th {
          position: sticky;
          top: 0;
          background: #ffffff;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 0;
          border-bottom: 2px solid #f1f5f9;
          z-index: 1;
        }
        .participant-table td {
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .role-pill {
          background: #f1f5f9;
          color: #475569;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        /* --- TOGGLE BUTTONS --- */
        .toggle-status-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100px;
          text-align: center;
        }
        .status-present {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .status-present:hover {
          background: #bbf7d0;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(22, 101, 52, 0.1);
        }
        .status-absent {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        .status-absent:hover {
          background: #fecaca;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(153, 27, 27, 0.1);
        }

        /* --- MEDIA SECTION --- */
        .media-section {
          padding: 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        .media-title {
          margin: 0 0 16px 0;
          color: #0f172a;
          font-size: 16px;
        }
        .media-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .media-card {
          width: 160px;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .media-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          border-color: #cbd5e1;
        }
        .media-preview img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
        }
        .pdf-preview {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border-radius: 8px;
          cursor: pointer;
          color: #2563eb;
          font-weight: 600;
          font-size: 13px;
        }
        .pdf-preview:hover {
          background: #e2e8f0;
        }
        .media-info {
          margin-top: 10px;
          padding: 0 4px;
        }
        .media-category {
          font-weight: 600;
          color: #1e293b;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .media-notes {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* --- ANIMATIONS & SCROLLBAR --- */
        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
