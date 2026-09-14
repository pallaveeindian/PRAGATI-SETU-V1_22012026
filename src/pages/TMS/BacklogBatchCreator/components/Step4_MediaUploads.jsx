// src\pages\TMS\BacklogBatchCreator\components\Step4_MediaUploads.jsx
import React, { useState, useMemo } from "react";

const CATEGORY_OPTIONS = [
  { value: "FOODING", label: "Fooding" },
  { value: "CLASS", label: "Classroom" },
  { value: "TRAINING", label: "Pictures with Ongoing Training" },
  { value: "PARTICIPANTS", label: "Pictures with all Participants" },
  { value: "ATTENDANCE", label: "Pictures while Attendance" },
  { value: "OTHER", label: "Other" },
];

export default function Step4_MediaUploads({
  batchData,
  updateBatchData,
  onNext,
  onPrev,
}) {
  const { startDate, endDate, mediaUploads = [] } = batchData;

  // Local State for the Input Form
  const [selectedDate, setSelectedDate] = useState("");
  const [category, setCategory] = useState("CLASS");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

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

  // Set default selected date to the first day if available
  useMemo(() => {
    if (trainingDates.length > 0 && !selectedDate) {
      setSelectedDate(trainingDates[0]);
    }
  }, [trainingDates, selectedDate]);

  // ==========================================
  // 2. MEDIA UPLOAD LOGIC
  // ==========================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Optional: Basic validation (size < 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be under 10MB");
        setFile(null);
        e.target.value = null; // Clear input
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleAddMedia = () => {
    if (!selectedDate || !category || !file) {
      setError("Please select a date, category, and attach a file.");
      return;
    }

    const newMedia = {
      id: Date.now() + Math.random(), // Unique temporary ID
      date: selectedDate,
      category: category,
      notes: notes,
      file: file, // Store the raw File object to append to FormData later
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + " KB",
    };

    updateBatchData({ mediaUploads: [...mediaUploads, newMedia] });

    // Reset Form
    setFile(null);
    setNotes("");
    setError("");
    document.getElementById("mediaFileInput").value = null;
  };

  const handleRemoveMedia = (idToRemove) => {
    updateBatchData({
      mediaUploads: mediaUploads.filter((m) => m.id !== idToRemove),
    });
  };

  // ==========================================
  // 3. RENDERERS
  // ==========================================
  const getCategoryLabel = (val) =>
    CATEGORY_OPTIONS.find((c) => c.value === val)?.label || val;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* --- MEDIA UPLOAD FORM --- */}
      <div
        style={{
          background: "#f8fafc",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#1e3a8a", fontSize: "16px" }}>
          4. Upload Batch Media Evidence
        </h3>
        <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "13px" }}>
          Attach photos or PDFs to document the training. You can group them by
          specific days of the batch.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          {/* Date Selector */}
          <div>
            <label style={styles.label}>Training Date *</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.select}
            >
              {trainingDates.map((d, idx) => (
                <option key={d} value={d}>
                  Day {idx + 1} - {new Date(d).toLocaleDateString("en-GB")}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label style={styles.label}>Media Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Input */}
          <div>
            <label style={styles.label}>Attach File (Image/PDF) *</label>
            <input
              id="mediaFileInput"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              style={styles.input}
            />
          </div>

          {/* Notes (Spans full width) */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={styles.label}>Notes / Description (Optional)</label>
            <input
              type="text"
              placeholder="E.g., Morning tea session with participants"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: "12px",
              color: "#dc2626",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleAddMedia}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
            }}
          >
            + Add Media to Batch
          </button>
        </div>
      </div>

      {/* --- STAGED UPLOADS TABLE --- */}
      <div
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            padding: "16px",
            borderBottom: "1px solid #cbd5e1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0, color: "#0f172a", fontSize: "15px" }}>
            Staged Media Uploads
          </h4>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#2563eb",
              background: "#eff6ff",
              padding: "4px 10px",
              borderRadius: "12px",
              border: "1px solid #bfdbfe",
            }}
          >
            {mediaUploads.length} File(s) Staged
          </span>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
                  style={{ ...styles.th, width: "50px", textAlign: "center" }}
                >
                  S.No
                </th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>File Name</th>
                <th style={styles.th}>Notes</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mediaUploads.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#64748b",
                      fontStyle: "italic",
                    }}
                  >
                    No media added yet. Use the form above to attach evidence.
                  </td>
                </tr>
              ) : (
                mediaUploads.map((media, idx) => (
                  <tr
                    key={media.id}
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
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      {new Date(media.date).toLocaleDateString("en-GB")}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#b45309",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        {getCategoryLabel(media.category)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: "#2563eb", fontWeight: "600" }}>
                        {media.fileName}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        {media.fileSize}
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: "#475569" }}>
                      {media.notes || "-"}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        onClick={() => handleRemoveMedia(media.id)}
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
          ← Back to Attendance
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
          Proceed to Financial Costs →
        </button>
      </div>
    </div>
  );
}

const styles = {
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
    color: "#0f172a",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    color: "#0f172a",
    fontWeight: "500",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "700",
    color: "#1e3a8a",
    borderBottom: "2px solid #cbd5e1",
  },
  td: { padding: "12px 16px" },
};
