// src/pages/TMS/TP_CP/cp_batch_detail.jsx
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TmsLeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import Header from "../layout/header";
import Footer from "../layout/footer";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

function statusBadgeColor(status) {
  const s = (status || "").toUpperCase();
  if (s === "ONGOING") return "linear-gradient(135deg, #16a34a, #15803d)";
  if (s === "SCHEDULED") return "linear-gradient(135deg, #0ea5e9, #0369a1)";
  if (s === "COMPLETED") return "linear-gradient(135deg, #64748b, #475569)";
  if (s === "REJECTED") return "linear-gradient(135deg, #ef4444, #b91c1c)";
  return "linear-gradient(135deg, #94a3b8, #64748b)";
}

function parseHHMMToParts(value) {
  if (!value) return { h: "", m: "" };
  const [h, m] = String(value).split(":");
  return { h: h ?? "", m: m ?? "" };
}

export default function CpBatchDetail() {
  const { id: batchId } = useParams();
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  // LIVE data state (no local storage cache)
  const [batch, setBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(false);

  // time_of_training controls
  const [durationMode, setDurationMode] = useState("1"); // "1","2","3","custom"
  const [customHours, setCustomHours] = useState("");
  const [customMinutes, setCustomMinutes] = useState("");
  const [savingDuration, setSavingDuration] = useState(false);
  const [openingManager, setOpeningManager] = useState(false);

  const didInitRef = useRef(false);

  async function fetchBatch() {
    if (!batchId) return;
    setLoadingBatch(true);
    try {
      const resp = await api.get(
        `/tms/batches/comprehensive-detail/${batchId}/`,
      );
      const data = resp?.data || null;
      setBatch(data);

      if (data?.time_of_training) {
        const { h, m } = parseHHMMToParts(data.time_of_training);
        setDurationMode("custom");
        setCustomHours(h);
        setCustomMinutes(m);
      }
    } catch (e) {
      console.error("cp fetch batch detail failed", e);
      setBatch(null);
    } finally {
      setLoadingBatch(false);
    }
  }

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    fetchBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  function handleRefreshAll() {
    fetchBatch();
  }

  function computeTimeOfTrainingPayload() {
    if (durationMode === "1" || durationMode === "2" || durationMode === "3") {
      const hours = parseInt(durationMode, 10);
      const hh = hours.toString().padStart(2, "0");
      return `${hh}:00`;
    }
    const h = parseInt(customHours || "0", 10);
    const m = parseInt(customMinutes || "0", 10);
    const safeH = Math.min(Math.max(h, 0), 8);
    const safeM = Math.min(Math.max(m, 0), 59);
    const hh = safeH.toString().padStart(2, "0");
    const mm = safeM.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  async function patchTimeOfTraining() {
    if (!batchId) return null;
    const payloadTime = computeTimeOfTrainingPayload();
    try {
      await api.patch(`/tms/batches/${batchId}/`, {
        time_of_training: payloadTime,
      });
      setBatch((prev) => ({
        ...(prev || {}),
        time_of_training: payloadTime,
      }));
      return payloadTime;
    } catch (e) {
      console.error("patch time_of_training failed", e);
      throw e;
    }
  }

  async function handleSaveDuration() {
    if (!batchId) return;
    setSavingDuration(true);
    try {
      await patchTimeOfTraining();
      alert("Session duration saved.");
    } catch {
      alert("Failed to save duration. Please try again.");
    } finally {
      setSavingDuration(false);
    }
  }

  async function handleOpenAttendanceManager() {
    if (!batchId) return;
    setOpeningManager(true);
    try {
      await patchTimeOfTraining();
      navigate(`/tms/cp/batch-attendance-ekyc/${batchId}`);
    } catch {
      alert(
        "Could not save session duration. Please check and try opening the manager again.",
      );
    } finally {
      setOpeningManager(false);
    }
  }

  let isBatchEnded = false;
  if (
    batch?.status === "COMPLETED" ||
    batch?.status === "CLOSED" ||
    batch?.status === "REVIEW" ||
    batch?.status === "REJECTED"
  ) {
    isBatchEnded = true;
  }

  // SURGICAL ADDITION: Date Range Validation for Attendance Manager
  const isDateInRange = useMemo(() => {
    if (!batch || !batch.start_date || !batch.end_date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    const startDate = new Date(batch.start_date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(batch.end_date);
    endDate.setHours(0, 0, 0, 0);

    // Return true if today is >= start_date AND today is <= end_date
    return today >= startDate && today <= endDate;
  }, [batch]);

  const disableAttendanceManager =
    isBatchEnded || !isDateInRange || openingManager;

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: "24px 18px", background: "#f8fafc" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {/* Top Header */}
              <div className="page-header-row">
                <h2 className="page-title">
                  <span className="text-muted">Batch Detail</span>{" "}
                  <span style={{ color: "#cbd5e1", margin: "0 8px" }}>/</span> #
                  {batchId}
                </h2>
                <div className="header-actions">
                  <button
                    className="btn-tms-outline"
                    onClick={handleRefreshAll}
                    disabled={loadingBatch}
                  >
                    {loadingBatch ? "Refreshing…" : "Refresh Data"}
                  </button>
                  <button
                    className="btn-tms-outline"
                    onClick={() => navigate("/tms/cp/batch-list")}
                  >
                    &larr; Back to List
                  </button>
                </div>
              </div>

              {/* Main Card */}
              <div className="tms-main-card fade-in">
                {loadingBatch && !batch ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading comprehensive batch details…</p>
                  </div>
                ) : !batch ? (
                  <div className="empty-state">
                    Batch not found or could not be loaded.
                  </div>
                ) : (
                  <>
                    {/* Batch Identity Header */}
                    <div className="batch-identity-box">
                      <div className="identity-left">
                        <div className="batch-code-label">BATCH CODE</div>
                        <div className="batch-code-value">
                          {batch.code || batch.id}
                        </div>
                      </div>
                      <div className="identity-right">
                        <span
                          className="status-pill pulse-slow"
                          style={{ background: statusBadgeColor(batch.status) }}
                        >
                          {(batch.status || "-").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">Centre Venue</div>
                        <div className="info-value">
                          {batch.centre?.venue_name || "—"}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Timeline</div>
                        <div className="info-value">
                          <span className="date-chip">
                            {fmtDate(batch.start_date)}
                          </span>
                          <span style={{ color: "#94a3b8", margin: "0 6px" }}>
                            to
                          </span>
                          <span className="date-chip">
                            {fmtDate(batch.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="divider" />

                    {/* Training Plan Info */}
                    <div className="plan-info-box">
                      <h4 className="section-subtitle">
                        Training Plan Details
                      </h4>
                      {!batch.training_plan ? (
                        <div className="empty-state sm">
                          Training plan details missing for this batch.
                        </div>
                      ) : (
                        <div className="plan-grid">
                          <div className="plan-cell">
                            <span className="p-label">Plan Name</span>
                            <span className="p-value highlight">
                              {batch.training_plan.training_name || "-"}
                            </span>
                          </div>
                          <div className="plan-cell">
                            <span className="p-label">Duration</span>
                            <span className="p-value">
                              {batch.training_plan.no_of_days || "-"} Days
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Session Duration Config */}
                    <div className="duration-config-box">
                      <div className="duration-header">
                        <h4>Daily Session Duration Configurator</h4>
                        <p>
                          Set the exact duration for one training session. This
                          calculates the active attendance window.
                        </p>
                      </div>

                      <div className="duration-controls">
                        <div className="control-group">
                          <label>Duration Mode</label>
                          <div className="select-wrapper">
                            <select
                              className="tms-input"
                              value={durationMode}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDurationMode(val);
                                if (val === "1" || val === "2" || val === "3") {
                                  setCustomHours("");
                                  setCustomMinutes("");
                                }
                              }}
                              disabled={isBatchEnded}
                            >
                              <option value="1">1 Hour Standard</option>
                              <option value="2">2 Hours Standard</option>
                              <option value="3">3 Hours Standard</option>
                              <option value="custom">Custom Time</option>
                            </select>
                          </div>
                        </div>

                        {durationMode === "custom" && (
                          <div className="custom-time-group slide-down">
                            <div className="time-input">
                              <label>
                                Hours <span className="hint">(0-8)</span>
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={8}
                                className="tms-input text-center"
                                placeholder="HH"
                                value={customHours}
                                disabled={isBatchEnded}
                                onChange={(e) =>
                                  setCustomHours(e.target.value.slice(0, 2))
                                }
                              />
                            </div>
                            <div className="time-colon">:</div>
                            <div className="time-input">
                              <label>
                                Minutes <span className="hint">(0-59)</span>
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={59}
                                className="tms-input text-center"
                                placeholder="MM"
                                value={customMinutes}
                                disabled={isBatchEnded}
                                onChange={(e) =>
                                  setCustomMinutes(e.target.value.slice(0, 2))
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="duration-actions">
                        <div className="current-duration">
                          {batch?.time_of_training ? (
                            <>
                              Active Duration:{" "}
                              <strong>{batch.time_of_training}</strong>
                            </>
                          ) : (
                            <span style={{ color: "#ef4444" }}>
                              Duration not set
                            </span>
                          )}
                        </div>
                        <button
                          className="btn-tms-secondary"
                          onClick={handleSaveDuration}
                          disabled={savingDuration || isBatchEnded}
                        >
                          {savingDuration ? "Saving..." : "Lock Duration"}
                        </button>
                      </div>
                    </div>

                    {/* Attendance Manager Entry */}
                    <div className="attendance-entry-box">
                      <div className="entry-left">
                        {isBatchEnded ? (
                          <div className="status-message error">
                            <span className="icon">✖</span> Batch has ended.
                            Attendance recording is disabled.
                          </div>
                        ) : !isDateInRange ? (
                          <div className="status-message warning">
                            <span className="icon">⏳</span> Attendance Manager
                            is locked. Today's date is outside the batch
                            schedule ({fmtDate(batch.start_date)} to{" "}
                            {fmtDate(batch.end_date)}).
                          </div>
                        ) : (
                          <div className="status-message success">
                            <span className="icon">✓</span> Batch is currently
                            active. You may record attendance.
                          </div>
                        )}
                      </div>

                      <div className="entry-right">
                        <button
                          className={`btn-tms-primary ${disableAttendanceManager ? "disabled" : "glow"}`}
                          onClick={handleOpenAttendanceManager}
                          disabled={disableAttendanceManager}
                        >
                          {openingManager
                            ? "Initializing..."
                            : "Open Attendance Manager"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* --- STYLES --- */}
      <style>{`
        .content-area { display: flex; flex: 1; min-width: 0; }
        .main-area { display: flex; flex-direction: column; flex: 1; min-height: 100vh; }
        .main-area main { flex: 1; }
        footer { margin-top: auto; }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
        .pulse-slow { animation: pulse 2s infinite; }

        /* Typography & Layout */
        .page-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-title { margin: 0; font-size: 26px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
        .text-muted { color: #64748b; font-weight: 500; }
        .header-actions { display: flex; gap: 12px; }

        .tms-main-card { background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
        
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .section-subtitle { margin: 0 0 16px 0; font-size: 16px; color: #334155; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

        /* Identity Box */
        .batch-identity-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 20px 24px; border-radius: 12px; border-left: 4px solid #2563eb; margin-bottom: 24px; }
        .batch-code-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
        .batch-code-value { font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; }
        .status-pill { display: inline-block; padding: 6px 16px; border-radius: 999px; color: #fff; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }

        /* Grid Info */
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .info-item { display: flex; flex-direction: column; gap: 6px; }
        .info-label { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; }
        .info-value { font-size: 16px; font-weight: 600; color: #0f172a; }
        .date-chip { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1; color: #334155; }

        /* Plan Info */
        .plan-info-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
        .plan-grid { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; }
        .plan-cell { display: flex; flex-direction: column; gap: 6px; }
        .p-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .p-value { font-size: 16px; font-weight: 600; color: #334155; }
        .p-value.highlight { color: #2563eb; font-size: 18px; }

        /* Duration Config */
        .duration-config-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin-bottom: 28px; position: relative; overflow: hidden; }
        .duration-config-box::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #3b82f6; }
        .duration-header h4 { margin: 0 0 6px 0; color: #1e3a8a; font-size: 16px; }
        .duration-header p { margin: 0; color: #475569; font-size: 13px; margin-bottom: 20px; }
        
        .duration-controls { display: flex; gap: 24px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 24px; }
        .control-group label { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; }
        
        .tms-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-weight: 600; color: #0f172a; outline: none; transition: all 0.2s; background: #fff; }
        .tms-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
        .text-center { text-align: center; }
        
        .custom-time-group { display: flex; align-items: flex-end; gap: 12px; }
        .time-input label { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .time-input .hint { font-weight: 500; color: #94a3b8; text-transform: none; }
        .time-colon { font-size: 24px; font-weight: 800; color: #94a3b8; padding-bottom: 6px; }

        .duration-actions { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dbeafe; padding-top: 16px; }
        .current-duration { font-size: 14px; color: #475569; }
        .current-duration strong { color: #1e3a8a; font-size: 16px; background: #dbeafe; padding: 2px 8px; border-radius: 4px; margin-left: 6px; }

        /* Attendance Entry Area */
        .attendance-entry-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; flex-wrap: wrap; gap: 20px; }
        
        .status-message { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; padding: 12px 16px; border-radius: 8px; width: 100%; max-width: 500px; }
        .status-message .icon { font-size: 18px; }
        .status-message.error { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
        .status-message.warning { background: #fffbeb; color: #b45309; border: 1px solid #fde047; }
        .status-message.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }

        /* Buttons */
        .btn-tms-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .btn-tms-primary.glow:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
        .btn-tms-primary.disabled { background: #cbd5e1; color: #f8fafc; box-shadow: none; cursor: not-allowed; }
        
        .btn-tms-secondary { background: #ffffff; color: #2563eb; border: 2px solid #2563eb; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; }
        .btn-tms-secondary:hover:not(:disabled) { background: #eff6ff; }
        .btn-tms-secondary:disabled { border-color: #cbd5e1; color: #94a3b8; cursor: not-allowed; }

        .btn-tms-outline { background: transparent; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-tms-outline:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }

        /* Utilities */
        .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: #64748b; font-weight: 500; }
        .empty-state.sm { padding: 30px 20px; background: #f8fafc; border-radius: 8px; }
        .spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }

        @media (max-width: 768px) {
          .attendance-entry-box { flex-direction: column; align-items: stretch; }
          .entry-right button { width: 100%; }
          .plan-grid { grid-template-columns: 1fr; }
          .duration-actions { flex-direction: column; align-items: stretch; gap: 16px; text-align: center; }
        }
      `}</style>
    </div>
  );
}
