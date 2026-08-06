// src/pages/TMS/TP_CP/attendance/cpad_per_batch_ekyc.jsx
import React, { useState, useEffect } from "react";
import api from "../../../../../../../api/axios";

export default function BulkVerifyModal({
  isOpen,
  onClose,
  pendingRows,
  batchId,
  onSuccess,
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({ success: 0, failed: 0 });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsVerifying(false);
      setProgress(0);
      setCurrentIndex(0);
      setResults({ success: 0, failed: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = pendingRows.length;

  const handleStartBulkVerification = async () => {
    setIsVerifying(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < total; i++) {
      setCurrentIndex(i + 1);
      const row = pendingRows[i];

      try {
        const payload = {
          ekyc_status: "VERIFIED",
          verified_on: new Date().toISOString(),
        };

        if (row.id) {
          // Exists in DB, just PATCH
          await api.patch(`/tms/batch-ekyc/${row.id}/`, payload);
        } else {
          // Doesn't exist, POST new record
          await api.post("/tms/batch-ekyc/", {
            batch: batchId,
            participant_id: row.participant_id,
            participant_role: row.participant_role,
            ...payload,
          });
        }
        successCount++;
      } catch (error) {
        console.error(
          `Failed to verify participant ${row.participant_id}`,
          error,
        );
        failCount++;
      }

      // Update progress bar
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setResults({ success: successCount, failed: failCount });
    setIsVerifying(false);
  };

  const handleClose = () => {
    if (results.success > 0 || results.failed > 0) {
      onSuccess(); // Trigger parent refresh if any action was taken
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 450,
          borderRadius: 12,
          padding: 24,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
          Bulk Verify E-KYC
        </h4>
        <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b" }}>
          You are about to automatically verify <strong>{total}</strong> pending
          participants. Ensure you have physically confirmed their presence.
        </p>

        {/* Progress Section */}
        {(isVerifying || progress > 0) && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              <span style={{ color: "#002174" }}>
                {isVerifying
                  ? `Verifying... (${currentIndex} / ${total})`
                  : "Verification Complete"}
              </span>
              <span>{progress}%</span>
            </div>
            <div
              style={{
                height: 10,
                background: "#e2e8f0",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: progress === 100 ? "#16a34a" : "#0092E0",
                  width: `${progress}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Results Summary */}
            {!isVerifying && progress === 100 && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 6,
                }}
              >
                <div style={{ color: "#16a34a", fontWeight: 600 }}>
                  ✓ {results.success} Successfully Verified
                </div>
                {results.failed > 0 && (
                  <div
                    style={{ color: "#dc2626", fontWeight: 600, marginTop: 4 }}
                  >
                    ✕ {results.failed} Failed
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClose}
            disabled={isVerifying}
          >
            {progress === 100 ? "Close" : "Cancel"}
          </button>

          {progress < 100 && (
            <button
              className="btn btn-primary"
              onClick={handleStartBulkVerification}
              disabled={isVerifying || total === 0}
              style={{ background: "#002174", borderColor: "#002174" }}
            >
              {isVerifying ? "Processing..." : "Start Bulk Verification"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
