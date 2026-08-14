// src/pages/TMS/MTManagementV2/components/MTApprovalActionModal.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";

export default function MTApprovalActionModal({
  open,
  onClose,
  onConfirm, // Function: (remarks) => void
  actionType, // 'VERIFIED' or 'REJECTED'
  trainer,
  submitting,
}) {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setRemarks("");
      setError("");
    }
  }, [open]);

  if (!open || !trainer) return null;

  const isReject = actionType === "REJECTED";
  const headerColor = isReject ? "#ef4444" : "#16a34a";
  const icon = isReject ? <FaTimesCircle /> : <FaCheckCircle />;
  const title = isReject
    ? "Reject Registration Request"
    : "Approve Registration Request";

  const handleConfirm = () => {
    // Remarks are mandatory for rejection
    if (isReject && remarks.trim().length < 5) {
      setError(
        "Please provide a detailed reason for rejection (min 5 characters).",
      );
      return;
    }
    setError("");
    onConfirm(remarks);
  };

  return (
    <div className="nic-modal-backdrop">
      <div className="nic-modal-container" style={{ maxWidth: "550px" }}>
        {/* HEADER */}
        <div
          className="nic-modal-header"
          style={{ backgroundColor: headerColor }}
        >
          <h3 className="nic-modal-title">
            <span
              style={{ marginRight: "8px", fontSize: "1.2em", display: "flex" }}
            >
              {icon}
            </span>
            {title}
          </h3>
          <button
            type="button"
            className="nic-modal-close-btn"
            onClick={onClose}
            disabled={submitting}
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="nic-modal-body">
          <div className="nic-alert-info">
            You are about to <strong>{isReject ? "REJECT" : "APPROVE"}</strong>{" "}
            the registration request for Master Trainer{" "}
            <strong>
              {trainer.full_name} ({trainer.designation})
            </strong>
            .
          </div>

          <div className="nic-form-group" style={{ marginTop: "20px" }}>
            <label className="nic-label">
              Remarks / Comments{" "}
              {isReject ? (
                <span className="nic-required">*</span>
              ) : (
                <span className="text-muted">(Optional)</span>
              )}
            </label>
            <textarea
              className="nic-input"
              rows={4}
              placeholder={
                isReject
                  ? "Please specify the reason for rejection..."
                  : "Add any approval notes here..."
              }
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (error) setError("");
              }}
              disabled={submitting}
              style={{ resize: "none" }}
            />
            {error && (
              <span
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                  fontWeight: "600",
                }}
              >
                {error}
              </span>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="nic-modal-footer">
          <button
            type="button"
            className="nic-btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="nic-btn-action-primary"
            style={{ backgroundColor: headerColor, borderColor: headerColor }}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FaSpinner
                  className="nic-spin"
                  style={{ marginRight: "6px" }}
                />{" "}
                Processing...
              </>
            ) : (
              <>
                {icon}{" "}
                <span style={{ marginLeft: "6px" }}>
                  Confirm {isReject ? "Rejection" : "Approval"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .nic-modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(2px);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; padding: 20px; box-sizing: border-box;
        }
        .nic-modal-container {
          background-color: #ffffff; width: 100%; border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          display: flex; flex-direction: column; max-height: 90vh;
          animation: modalFadeIn 0.2s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nic-modal-header {
          color: #ffffff; padding: 16px 24px;
          display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;
        }
        .nic-modal-title { margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; }
        .nic-modal-close-btn { background: transparent; border: none; color: #ffffff; font-size: 18px; cursor: pointer; opacity: 0.8; }
        .nic-modal-close-btn:hover { opacity: 1; }
        .nic-modal-body { padding: 24px; overflow-y: auto; background-color: #f8fafc; }
        
        .nic-alert-info {
          background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #334155;
          padding: 12px 16px; border-radius: 6px; font-size: 14px; line-height: 1.5;
        }

        .nic-form-group { display: flex; flex-direction: column; gap: 6px; }
        .nic-label { font-size: 13px; font-weight: 600; color: #475569; }
        .nic-required { color: #ef4444; margin-left: 4px; }
        .text-muted { color: #94a3b8; font-weight: 400; font-size: 12px; margin-left: 4px; }
        
        .nic-input {
          padding: 10px 12px; font-size: 14px; border: 1px solid #94a3b8; border-radius: 4px;
          background-color: #ffffff; color: #1e293b; width: 100%; box-sizing: border-box;
          font-family: inherit;
        }
        .nic-input:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }
        .nic-input:disabled { background-color: #f1f5f9; cursor: not-allowed; opacity: 0.7; }

        .nic-modal-footer {
          padding: 16px 24px; background-color: #ffffff; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 8px 8px;
        }
        .nic-btn-secondary { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .nic-btn-secondary:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
        
        .nic-btn-action-primary {
          color: #ffffff; padding: 8px 20px; border-radius: 4px; font-size: 14px; font-weight: 600;
          cursor: pointer; display: inline-flex; align-items: center; transition: all 0.2s;
        }
        .nic-btn-action-primary:hover:not(:disabled) { filter: brightness(0.9); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .nic-btn-action-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .nic-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
