// src/pages/TMS/TRs/BatchDetailComponents/BatchHeaderActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BatchHeaderActions({
  batchId,
  batchCode,
  batchStatus,
  loadingClosureInfo,
  closureRequest,
  onRefresh,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="batch-header">
        <h2 className="batch-page-title">
          Batch #{batchId}
          {batchCode ? <span className="batch-code">({batchCode})</span> : ""}
        </h2>

        <div className="batch-header-actions">
          {batchStatus === "CLOSED" && (
            <button
              className="btn-primary"
              onClick={() => navigate(`/tms/download-certificate/${batchId}`)}
              style={{ background: "#16a34a" }}
            >
              📄 Download Certificate
            </button>
          )}

          <button className="btn-primary" onClick={onRefresh}>
            Refresh
          </button>

          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      {/* CLOSURE BANNER */}
      {loadingClosureInfo ? (
        <div className="closure-banner loading">
          Checking batch closure status…
        </div>
      ) : closureRequest ? (
        <div className="closure-banner closed">
          <strong>This batch is now closed.</strong> A closure request has been
          submitted for this batch and is under review / processing.
        </div>
      ) : null}
    </>
  );
}
