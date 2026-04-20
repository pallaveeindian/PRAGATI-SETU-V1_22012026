// src/pages/TMS/TP_CP/cp_batch_closure.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TmsLeftNav from "../layout/tms_LeftNav";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

// simple YYYY-MM-DD traverser
function addDaysISO(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// map dropdown label -> BatchMedia CATEGORY_CHOICES value
const CATEGORY_OPTIONS = [
  { value: "FOODING", label: "Fooding" },
  { value: "CLASS", label: "Classroom" },
  { value: "TRAINING", label: "Pictures with Ongoing Training" },
  { value: "PARTICIPANTS", label: "Pictures with all Participants" },
  { value: "ATTENDANCE", label: "Pictures while Attendance" },
  { value: "OTHER", label: "Other" },
];

export default function CpBatchClosure() {
  const { user } = useContext(AuthContext) || {};
  const { id: batchId } = useParams(); // /tms/cp/batch-closure/:id
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [batch, setBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  // closure request existence
  const [checkingClosure, setCheckingClosure] = useState(false);
  const [closureExists, setClosureExists] = useState(false);

  // mediaRows is a map: dateStr -> array of rows
  const [mediaByDate, setMediaByDate] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("Submitting closure request…");

  // compute date list from batch start_date to end_date
  const dateList = useMemo(() => {
    if (!batch?.start_date || !batch?.end_date) return [];
    const start = batch.start_date; // assume YYYY-MM-DD
    const end = batch.end_date;
    if (!start || !end || start > end) return [];
    const dates = [];
    let cursor = start;
    while (cursor <= end) {
      dates.push(cursor);
      cursor = addDaysISO(cursor, 1);
    }
    return dates;
  }, [batch?.start_date, batch?.end_date]);

  // initialize media rows per date (1 blank row each)
  useEffect(() => {
    if (!dateList.length) return;
    setMediaByDate((prev) => {
      const next = { ...prev };
      dateList.forEach((d) => {
        if (!next[d] || !next[d].length) {
          next[d] = [
            {
              id: Date.now() + Math.random(),
              category: "OTHER",
              file: null,
              notes: "",
            },
          ];
        }
      });
      return next;
    });
  }, [dateList]);

  async function fetchBatch() {
    if (!batchId) return;
    setLoadingBatch(true);
    try {
      const resp = await api.get(`/tms/batches/${batchId}/detail/`);
      setBatch(resp?.data || null);
    } catch (e) {
      console.error("cp batch closure: fetch batch failed", e);
      setBatch(null);
    } finally {
      setLoadingBatch(false);
    }
  }

  // check if media already exists for this batch
  async function checkExistingClosure() {
    if (!batchId) return;
    setCheckingClosure(true);
    try {
      // SURGICAL CHANGE: Now we check if media was uploaded
      const resp = await api.get(`/tms/batch-media/?batch=${batchId}`);
      const results = resp?.data?.results || [];
      setClosureExists(results.length > 0);
    } catch (e) {
      console.error("cp batch closure: check existing media failed", e);
      setClosureExists(false);
    } finally {
      setCheckingClosure(false);
    }
  }
  useEffect(() => {
    fetchBatch();
    checkExistingClosure();
  }, [batchId]);

  function handleAddMediaRow(dateStr) {
    setMediaByDate((prev) => {
      const rows = prev[dateStr] || [];
      return {
        ...prev,
        [dateStr]: [
          ...rows,
          {
            id: Date.now() + Math.random(),
            category: "OTHER",
            file: null,
            notes: "",
          },
        ],
      };
    });
  }

  function handleRemoveMediaRow(dateStr, rowId) {
    setMediaByDate((prev) => {
      const rows = prev[dateStr] || [];
      const filtered = rows.filter((r) => r.id !== rowId);
      return {
        ...prev,
        [dateStr]: filtered.length ? filtered : [],
      };
    });
  }

  function handleMediaChange(dateStr, rowId, field, value) {
    setMediaByDate((prev) => {
      const rows = prev[dateStr] || [];
      const updated = rows.map((r) =>
        r.id === rowId ? { ...r, [field]: value } : r,
      );
      return { ...prev, [dateStr]: updated };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!batchId || !user?.id) return;

    // simple validation: at least one media row with file
    const hasAnyFile = Object.values(mediaByDate || {})
      .flat()
      .some((r) => r.file);

    if (!hasAnyFile) {
      alert("Please upload at least one media file before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitMsg("Uploading media…");

    try {
      // 1) POST all batch-media
      const mediaPayloads = [];
      for (const dateStr of dateList) {
        const rows = mediaByDate[dateStr] || [];
        for (const r of rows) {
          if (!r.file) continue; // skip empty rows
          const formData = new FormData();
          formData.append("batch", batchId);
          formData.append("date", dateStr);
          formData.append("category", r.category || "OTHER");
          formData.append("file", r.file);
          if (r.notes) formData.append("notes", r.notes);
          formData.append("created_by", String(user.id));
          formData.append("is_active", "1");
          mediaPayloads.push(formData);
        }
      }

      for (const fd of mediaPayloads) {
        await api.post("/tms/batch-media/", fd);
      }

      // SURGICAL CHANGE: Removed steps 2 (Costing) and 3 (Closure Request)

      alert(
        "Batch media uploaded successfully. Your Training Partner Org will now process the closure.",
      );
      navigate(-1);
    } catch (e) {
      console.error("cp batch media submit failed", e);
      alert("Failed to upload batch media. Please try again.");
    } finally {
      setSubmitting(false);
      setSubmitMsg("Uploading media…");
    }
  }

  const heading =
    batch && batch.code
      ? `Batch Closure Request for Batch #${batch.code}`
      : `Batch Closure Request for Batch #${batchId}`;

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav left={<div className="app-title">{heading}</div>} /> */}
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 8,
                }}
              >
                <h2 style={{ margin: 0 }}>{heading}</h2>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                </div>
              </div>

              {loadingBatch && !batch ? (
                <div className="table-spinner">Loading batch details…</div>
              ) : !batch ? (
                <div className="muted">
                  Batch not found. Please go back and try again.
                </div>
              ) : checkingClosure ? (
                <div className="table-spinner">Checking closure status…</div>
              ) : closureExists ? (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: "#ecfdf5",
                    border: "1px solid #bbf7d0",
                    color: "#166534",
                    fontSize: 14,
                  }}
                >
                  Media has already been uploaded. This batch is now under the
                  closure process by your Training Partner Org.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Batch summary */}
                  <div
                    style={{
                      marginBottom: 16,
                      padding: 12,
                      borderRadius: 8,
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <strong>Batch Code:</strong>{" "}
                      <span style={{ fontWeight: 700, color: "#1d4ed8" }}>
                        {batch.code}
                      </span>
                    </div>
                    <div>
                      <strong>Status:</strong> {batch.status}
                    </div>
                    <div>
                      <strong>Start Date:</strong> {fmtDate(batch.start_date)}{" "}
                      &nbsp;|&nbsp;
                      <strong>End Date:</strong> {fmtDate(batch.end_date)}
                    </div>
                  </div>

                  {/* 1. Batch Media section */}
                  <div
                    style={{
                      marginBottom: 20,
                      padding: 16,
                      borderRadius: 8,
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>Batch Media</h3>
                    <p className="muted" style={{ fontSize: 13 }}>
                      Upload photos or a PDF for each day of the batch. Use the
                      category dropdown to tag each media item appropriately.
                    </p>

                    {dateList.length === 0 ? (
                      <div className="muted">
                        No date range available for this batch.
                      </div>
                    ) : (
                      dateList.map((dateStr) => {
                        const rows = mediaByDate[dateStr] || [];
                        return (
                          <div
                            key={dateStr}
                            style={{
                              marginBottom: 16,
                              padding: 12,
                              borderRadius: 6,
                              background: "#f9fafb",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                            >
                              <strong>{fmtDate(dateStr)}</strong>
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{ marginLeft: "auto" }}
                                onClick={() => handleAddMediaRow(dateStr)}
                              >
                                + Add Media
                              </button>
                            </div>

                            {rows.length === 0 ? (
                              <div className="muted" style={{ fontSize: 13 }}>
                                No media rows yet. Click &quot;Add Media&quot; to
                                add the first item.
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 8,
                                }}
                              >
                                {rows.map((row) => (
                                  <div
                                    key={row.id}
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "160px minmax(0, 1fr) 120px",
                                      gap: 8,
                                      alignItems: "center",
                                      padding: 8,
                                      borderRadius: 4,
                                      background: "#ffffff",
                                      border: "1px solid #e5e7eb",
                                    }}
                                  >
                                    <div>
                                      <label
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 600,
                                          marginBottom: 4,
                                          display: "block",
                                        }}
                                      >
                                        Category
                                      </label>
                                      <select
                                        value={row.category || "OTHER"}
                                        onChange={(e) =>
                                          handleMediaChange(
                                            dateStr,
                                            row.id,
                                            "category",
                                            e.target.value,
                                          )
                                        }
                                        style={{
                                          width: "100%",
                                          fontSize: 13,
                                          padding: "4px 6px",
                                        }}
                                      >
                                        {CATEGORY_OPTIONS.map((opt) => (
                                          <option
                                            key={opt.value}
                                            value={opt.value}
                                          >
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 600,
                                          marginBottom: 4,
                                          display: "block",
                                        }}
                                      >
                                        File &amp; Notes
                                      </label>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 4,
                                        }}
                                      >
                                        <input
                                          type="file"
                                          accept="image/*,.pdf"
                                          onChange={(e) =>
                                            handleMediaChange(
                                              dateStr,
                                              row.id,
                                              "file",
                                              e.target.files?.[0] || null,
                                            )
                                          }
                                        />
                                        <textarea
                                          rows={2}
                                          placeholder="Notes (optional)…"
                                          value={row.notes || ""}
                                          onChange={(e) =>
                                            handleMediaChange(
                                              dateStr,
                                              row.id,
                                              "notes",
                                              e.target.value,
                                            )
                                          }
                                          style={{
                                            fontSize: 12,
                                            resize: "vertical",
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline"
                                        onClick={() =>
                                          handleRemoveMediaRow(dateStr, row.id)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Submit */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => navigate(-1)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={submitting}
                    >
                      {submitting
                        ? submitMsg || "Submitting closure request…"
                        : "Upload Batch Media"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
          <Footer />
          {submitting && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 8,
                  padding: "16px 24px",
                  minWidth: 260,
                  textAlign: "center",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.25)",
                }}
              >
                <div
                  className="spinner-border"
                  role="status"
                  style={{ width: 24, height: 24, marginBottom: 8 }}
                >
                  <span className="visually-hidden">Loading…</span>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Submitting Closure Request
                </div>
                <div style={{ fontSize: 13, color: "#4b5563" }}>{submitMsg}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{` .content-area {
  display: flex;
  flex: 1;              
  min-width: 0;
}

/* Sidebar (Left Nav) */
.content-area > *:first-child {
  flex-shrink: 0;
}

/* Main right side */
.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* Main content should grow */
.main-area main {
  flex: 1;
}

/* ===== Footer ===== */
.app-footer {
  margin-top: auto;     
  flex-shrink: 0;
} `}</style>
    </div>
  );
}
