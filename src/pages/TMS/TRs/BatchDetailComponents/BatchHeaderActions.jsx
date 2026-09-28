import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import BatchExport from "./BatchExport";
import BatchExportPDF from "./BatchExportPDF";
import { TMS_API } from "../../../../api/axios";

export default function BatchHeaderActions({
  batchId,
  batchCode,
  batchStatus,
  loadingClosureInfo,
  closureRequest,
  onRefresh,
  batchData,
}) {
  const navigate = useNavigate();

  // --- SURGICAL ADDITION: Recalculate State & Anti-Spam Timer ---
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Initialize Cooldown from LocalStorage on mount
  useEffect(() => {
    if (!batchId) return;
    const lastClicked = localStorage.getItem(`recalc_cooldown_${batchId}`);
    if (lastClicked) {
      const elapsed = Date.now() - parseInt(lastClicked, 10);
      const fiveMinutes = 5 * 60 * 1000;
      if (elapsed < fiveMinutes) {
        setCooldown(Math.ceil((fiveMinutes - elapsed) / 1000));
      }
    }
  }, [batchId]);

  // Tick the cooldown timer down every second
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    } else if (cooldown === 0) {
      localStorage.removeItem(`recalc_cooldown_${batchId}`);
    }
    return () => clearInterval(timer);
  }, [cooldown, batchId]);

  const formatCooldown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRecalculate = async () => {
    if (cooldown > 0 || isRecalculating) return;

    setIsRecalculating(true);
    try {
      await TMS_API.recalculateAttendance(batchId);

      // Set the 5 minute (300 seconds) cooldown
      localStorage.setItem(`recalc_cooldown_${batchId}`, Date.now().toString());
      setCooldown(300);

      alert(
        "Attendance recalculated successfully based on strict matrix rules.",
      );
      if (onRefresh) onRefresh(); // Refresh the parent view to show new data
    } catch (error) {
      console.error("Recalculation failed:", error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Failed to recalculate attendance.",
      );
    } finally {
      setIsRecalculating(false);
    }
  };
  // -----------------------------------------------------------------

  return (
    <>
      <div className="batch-header-card">
        <div className="batch-header-content">
          {batchCode && (
            <div className="batch-code">
              <h2 className="batch-page-title">
                <strong> Batch: {batchCode}</strong>
              </h2>
            </div>
          )}
          <div className="batch-header-actions">
            {batchStatus === "CLOSED" && (
              <button
                className="btn-success"
                onClick={() => navigate(`/tms/download-certificate/${batchId}`)}
              >
                📄 Download Certificate
              </button>
            )}

            {/* SURGICAL ADDITION: Excel & PDF Export Buttons */}
            {batchData && (
              <>
                <BatchExport batchData={batchData} />
                <BatchExportPDF batchData={batchData} />
              </>
            )}

            {/* SURGICAL ADDITION: Recalculate Attendance Button */}
            {batchStatus === "COMPLETED" && (
              <button
                className="btn-warning"
                onClick={handleRecalculate}
                disabled={isRecalculating || cooldown > 0}
              >
                {isRecalculating ? (
                  <>
                    <span className="btn-spinner"></span> Recalculating...
                  </>
                ) : cooldown > 0 ? (
                  `⏳ Wait ${formatCooldown(cooldown)}`
                ) : (
                  "📊 Recalculate Attendance"
                )}
              </button>
            )}

            <button className="btn-primary" onClick={onRefresh}>
              🔄 Refresh
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate(`/tms/batches/${batchId}/history`)}
            >
              <FontAwesomeIcon
                icon={faStopwatch}
                style={{ marginRight: "8px" }}
              />
              Batch History
            </button>
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Closure Status */}
      {loadingClosureInfo ? (
        <div className="closure-banner loading">
          <div className="closure-icon">⏳</div>

          <div>
            <h4>Checking Batch Status</h4>
            <p>Please wait while we verify the closure request...</p>
          </div>
        </div>
      ) : closureRequest ? (
        <div className="closure-banner closed">
          <div className="closure-icon">✓</div>

          <div>
            <h4>Batch Closure Submitted Successfully</h4>

            <p>
              This batch has been closed successfully. The closure request is
              currently under review / processing by the concerned authority.
            </p>
          </div>
        </div>
      ) : null}

      <style>{`
/* ======================================================
   HEADER CARD
====================================================== */

.batch-header-card{
    background:#ffffff;
    border-radius:18px;
    border:1px solid #dce7f3;
    box-shadow:0 12px 30px rgba(0,0,0,.08);
    margin-bottom:26px;
    overflow:hidden;
}

.batch-header-content{
    padding:34px 28px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
}

/* ======================================================
   TITLE
====================================================== */

.batch-page-title{
    margin:0;
    font-size:34px;
    font-weight:700;
    color:#1e3a5f;
    letter-spacing:.4px;
    text-align:center;
}

.batch-code{
    margin-top:14px;
    background:#eef6ff;
    border:1px solid #bfd9ff;
    color:#1d4f91;
    padding:10px 22px;
    border-radius:999px;
    font-size:16px;
    font-weight:600;
    text-align:center;
}

/* ======================================================
   ACTIONS
====================================================== */

.batch-header-actions{
    margin-top:30px;

    display:flex;
    justify-content:center;
    align-items:center;
    gap:18px;

    flex-wrap:wrap;
}

/* ======================================================
   BUTTONS
====================================================== */

.batch-header-actions button{

    min-width:210px;

    padding:13px 24px;

    border-radius:10px;

    border:none;

    cursor:pointer;

    font-size:15px;

    font-weight:600;

    transition:all .25s ease;

    box-shadow:0 5px 14px rgba(0,0,0,.08);
    
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.btn-primary{
    background:#2563eb;
    color:white;
}

.btn-primary:hover{
    background:#1d4ed8;
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(37,99,235,.25);
}

.btn-secondary{
    background:#ffffff;
    color:#334155;
    border:1px solid #d1d5db !important;
}

.btn-secondary:hover{
    background:#f8fafc;
    transform:translateY(-2px);
}

.btn-success{
    background:#16a34a;
    color:white;
}

.btn-success:hover{
    background:#15803d;
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(22,163,74,.25);
}

/* SURGICAL ADDITION: Warning Button Styles for Recalculate */
.btn-warning{
    background:#f59e0b;
    color:white;
}

.btn-warning:hover:not(:disabled){
    background:#d97706;
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(245,158,11,.25);
}

.btn-warning:disabled{
    background:#fcd34d;
    cursor:not-allowed;
    box-shadow:none;
    transform:none;
}

.btn-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
    to { transform: rotate(360deg); }
}

/* ======================================================
   CLOSURE BANNER
====================================================== */

.closure-banner{

    max-width:1000px;

    margin:24px auto;

    border-radius:16px;

    display:flex;
    align-items:center;
    gap:20px;

    padding:24px 28px;

    box-shadow:0 8px 20px rgba(0,0,0,.06);
}

.closure-banner.loading{

    background:#eff6ff;
    border-left:6px solid #2563eb;
    color:#1d4ed8;
}

.closure-banner.closed{

    background:#ecfdf5;
    border-left:6px solid #16a34a;
    color:#166534;
}

.closure-icon{

    width:60px;
    height:60px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    flex-shrink:0;

    font-size:28px;

    font-weight:bold;

    color:white;
}

.loading .closure-icon{
    background:#2563eb;
}

.closed .closure-icon{
    background:#16a34a;
}

.closure-banner h4{
    margin:0 0 8px;
    font-size:20px;
    font-weight:700;
}

.closure-banner p{
    margin:0;
    font-size:15px;
    line-height:1.6;
}

/* ======================================================
   RESPONSIVE
====================================================== */

@media (max-width:768px){

.batch-header-content{
    padding:24px 16px;
}

.batch-page-title{
    font-size:28px;
}

.batch-code{
    width:100%;
    border-radius:10px;
}

.batch-header-actions{
    flex-direction:column;
    width:100%;
}

.batch-header-actions button{
    width:100%;
    min-width:unset;
}

.closure-banner{
    flex-direction:column;
    text-align:center;
}

.closure-banner h4{
    font-size:18px;
}

}
      `}</style>
    </>
  );
}
