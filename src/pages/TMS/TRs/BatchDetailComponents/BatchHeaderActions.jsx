// src/pages/TMS/TRs/BatchDetailComponents/BatchHeaderActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import BatchExport from "./BatchExport";

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

            {/* SURGICAL ADDITION: Excel Export Button */}
            {batchData && <BatchExport batchData={batchData} />}

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
