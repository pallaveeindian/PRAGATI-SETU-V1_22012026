// src/pages/TMS/TP_CP/cp_batch_media.jsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import TmsLeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import api from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";

function fmtDate(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString("en-IN");
}

function getBatchDates(startDate, endDate) {
  const start = String(startDate || "").slice(0, 10);
  const end = String(endDate || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start > end) {
    return [];
  }

  const dates = [];
  const current = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (current <= last) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

const MEDIA_CATEGORIES = [
  { value: "FOODING", label: "Fooding" },
  { value: "CLASS", label: "Classroom" },
  { value: "TRAINING", label: "Ongoing Training" },
  { value: "PARTICIPANTS", label: "All Participants" },
  { value: "ATTENDANCE", label: "Attendance" },
  { value: "OTHER", label: "Other" },
];

export default function CpBatchMedia() {
  const { id: batchId } = useParams();
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [batch, setBatch] = useState(null);
  const [media, setMedia] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("OTHER");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [deletingMediaId, setDeletingMediaId] = useState(null);

  const batchDates = useMemo(
    () => getBatchDates(batch?.start_date, batch?.end_date),
    [batch?.start_date, batch?.end_date],
  );
  const selectedDateMedia = useMemo(
    () => media.filter((item) => String(item.date || "").slice(0, 10) === selectedDate),
    [media, selectedDate],
  );

  const fetchBatchMedia = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await api.get(
        `/tms/batches/comprehensive-detail/${encodeURIComponent(batchId)}/`,
      );
      const batchData = response?.data;
      setBatch(batchData || null);
      setMedia(
        Array.isArray(batchData?.batch_pictures) ? batchData.batch_pictures : [],
      );
      setSelectedDate((currentDate) => {
        const dates = getBatchDates(batchData?.start_date, batchData?.end_date);
        return dates.includes(currentDate) ? currentDate : dates[0] || "";
      });
    } catch (requestError) {
      console.error("Fetch batch media failed", requestError);
      setError("Could not load attached media. Please try again.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchBatchMedia();
  }, [fetchBatchMedia]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("No valid training date is available for this batch.");
      return;
    }
    if (!uploadFile) {
      alert("Please select a photo to upload.");
      return;
    }
    if (!user?.id) {
      alert("User authentication error.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("batch", batchId);
      formData.append("date", selectedDate);
      formData.append("category", uploadCategory);
      formData.append("file", uploadFile);
      if (uploadNotes) formData.append("notes", uploadNotes);
      formData.append("created_by", String(user.id));
      formData.append("is_active", "1");

      await api.post("/tms/batch-media/", formData);
      setUploadFile(null);
      setUploadNotes("");
      setFileInputKey((key) => key + 1);
      await fetchBatchMedia(false);
      alert("Media uploaded successfully!");
    } catch (e) {
      console.error("Media upload failed", e);
      alert("Failed to upload batch media. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm("Are you sure you want to delete this media file?")) {
      return;
    }

    setDeletingMediaId(mediaId);
    try {
      await api.delete(`/tms/batch-media/${mediaId}/`);
      setMedia((prevMedia) => prevMedia.filter((item) => item.id !== mediaId));
    } catch (e) {
      console.error("Failed to delete media", e);
      alert("Failed to delete media. Please try again.");
    } finally {
      setDeletingMediaId(null);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((value) => !value)}
        />
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            <div className="media-page">
              
              {/* HEADER */}
              <div className="media-header">
                <div>
                  <h2>Manage Batch Media</h2>
                  <p>
                    Batch Code: {batch?.code || batchId}
                    {batch?.start_date && batch?.end_date && (
                      <>
                        {" "}· {fmtDate(batch.start_date)} – {fmtDate(batch.end_date)}
                      </>
                    )}
                  </p>
                </div>
                <button className="media-button" onClick={() => navigate(-1)}>
                  Back
                </button>
              </div>

              {loading ? (
                <p className="media-message">Loading attached media…</p>
              ) : error ? (
                <p className="media-message media-error" role="alert">
                  {error}
                </p>
              ) : (
                <>
                  {batchDates.length === 0 ? (
                    <p className="media-message media-error" role="alert">
                      Batch start and end dates are unavailable.
                    </p>
                  ) : (
                    <>
                      <section className="date-section" aria-label="Batch dates">
                        <h3>Training Dates</h3>
                        <div className="date-list">
                          {batchDates.map((date) => {
                            const count = media.filter(
                              (item) => String(item.date || "").slice(0, 10) === date,
                            ).length;
                            return (
                              <button
                                type="button"
                                key={date}
                                className={`date-button ${selectedDate === date ? "selected" : ""}`}
                                aria-pressed={selectedDate === date}
                                onClick={() => {
                                  setSelectedDate(date);
                                  setUploadFile(null);
                                  setFileInputKey((key) => key + 1);
                                }}
                              >
                                {fmtDate(date)} <span>{count} photos</span>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      <section className="upload-section">
                        <h3>Add Photo · {fmtDate(selectedDate)}</h3>
                        <form onSubmit={handleUploadSubmit} className="upload-form">
                          <select
                            className="upload-input"
                            value={uploadCategory}
                            onChange={(event) => setUploadCategory(event.target.value)}
                            aria-label="Photo category"
                          >
                            {MEDIA_CATEGORIES.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                          <input
                            key={fileInputKey}
                            type="file"
                            className="upload-input"
                            onChange={(event) =>
                              setUploadFile(event.target.files?.[0] || null)
                            }
                            accept="image/*"
                            aria-label="Choose a photo"
                            required
                          />
                          <input
                            type="text"
                            className="upload-input"
                            placeholder="Notes (optional)"
                            value={uploadNotes}
                            onChange={(event) => setUploadNotes(event.target.value)}
                          />
                          <button
                            type="submit"
                            className="media-button"
                            disabled={uploading || !uploadFile}
                          >
                            {uploading ? "Uploading..." : "Add Photo"}
                          </button>
                        </form>
                      </section>

                      <h3 className="gallery-heading">
                        Photos for {fmtDate(selectedDate)}
                      </h3>
                      {selectedDateMedia.length === 0 ? (
                        <p className="media-message">
                          No photos for this date yet. You can add one above.
                        </p>
                      ) : (
                        <div className="media-grid">
                          {selectedDateMedia.map((item) => {
                            const fileUrl = item.file || "";
                            const isPdf = fileUrl.split("?")[0].toLowerCase().endsWith(".pdf");

                            return (
                              <article className="media-card" key={item.id}>
                                <button
                                  type="button"
                                  className="delete-media-btn"
                                  onClick={() => handleDeleteMedia(item.id)}
                                  disabled={deletingMediaId === item.id}
                                  title="Delete this photo"
                                >
                                  {deletingMediaId === item.id ? "…" : "×"}
                                </button>
                                <a
                                  className="media-file"
                                  href={fileUrl || undefined}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`Open ${item.category || "attached"} media`}
                                >
                                  {fileUrl && !isPdf ? (
                                    <img
                                      src={fileUrl}
                                      alt={item.category || "Batch photo"}
                                    />
                                  ) : (
                                    <span>
                                      {fileUrl ? "Open attached file" : "File unavailable"}
                                    </span>
                                  )}
                                </a>
                                <div className="media-details">
                                  <strong>{item.category || "Attachment"}</strong>
                                  {item.notes && <p className="media-notes">{item.notes}</p>}
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`
        .content-area { display: flex; flex: 1; width: 100%; }
        .main-area { display: flex; flex: 1; flex-direction: column; min-width: 0; background: #f8fafc; }
        .media-page { max-width: 1200px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #dbeafe; border-radius: 10px; }
        
        .media-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;}
        .media-header h2 { margin: 0; color: #2b4e72; }
        .media-header p { margin: 6px 0 0; color: #64748b; }
        .media-button { padding: 8px 16px; border: 0; border-radius: 6px; background: #3d6ba6; color: white; cursor: pointer; font-weight: 500;}
        .media-button:disabled { background: #94a3b8; cursor: not-allowed; }
        .media-button:hover:not(:disabled) { background: #2a4e7c; }

        /* Upload Section Styles */
        .upload-section { background: #f1f5f9; padding: 16px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .upload-section h3 { margin-top: 0; color: #334155; font-size: 16px; margin-bottom: 12px; }
        .upload-form { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .upload-input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px; flex: 1; min-width: 150px; }
        .date-section { margin: 20px 0; }
        .date-section h3, .gallery-heading { color: #334155; }
        .date-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .date-button { display: flex; flex-direction: column; gap: 4px; padding: 10px 14px; border: 1px solid #a7c6ed; border-radius: 8px; background: #fff; color: #2b4e72; cursor: pointer; }
        .date-button span { font-size: 12px; color: #64748b; }
        .date-button.selected { background: #3d6ba6; color: #fff; }
        .date-button.selected span { color: #e2e8f0; }
        .gallery-heading { margin-top: 24px; }
        .media-message { padding: 24px; text-align: center; color: #475569; }
        .media-error { color: #b91c1c; }
        
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 10px; }
        
        /* Media Card Styles */
        .media-card { 
          position: relative; 
          display: flex; 
          flex-direction: column; 
          padding: 10px; 
          border: 1px solid #dbeafe; 
          border-radius: 8px; 
          color: #2b4e72; 
          overflow-wrap: anywhere;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .delete-media-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 10;
        }
        .delete-media-btn:disabled { opacity: 0.6; cursor: wait; }
        .delete-media-btn:hover { background: #dc2626; transform: scale(1.1); }

        .media-file { display: grid; place-items: center; min-height: 140px; background: #f8fafc; border-radius: 6px; color: #2563eb; text-decoration: none; overflow: hidden; border: 1px solid #e2e8f0;}
        .media-file img { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; }
        
        .media-details strong { display: block; margin-top: 8px; }
        .media-notes { margin: 6px 0 0 0; font-size: 12px; color: #475569; font-style: italic; border-top: 1px dashed #cbd5e1; padding-top: 6px;}
      `}</style>
    </div>
  );
}