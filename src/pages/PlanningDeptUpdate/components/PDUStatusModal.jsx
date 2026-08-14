import React, { useEffect, useRef } from "react";
import PDUButton from "./PDUButton";
import "./styles/PDUStatusModal.css";

/**
 * PDUStatusModal - A modal overlay to track the bulk data upload to the Planning Dept.
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to close the modal
 * @param {number} totalBlocks - Total number of blocks to be pushed (e.g., 108)
 * @param {boolean} isUploading - Whether the upload request is currently active
 * @param {boolean} isComplete - Whether the bulk push has finished
 * @param {Array<Object>} logs - Array of log objects: { status: 'success'|'error', message: '...' }
 * @param {function} onStartPush - Function to trigger the upload process
 */
const PDUStatusModal = ({
  isOpen,
  onClose,
  totalBlocks = 108,
  isUploading = false,
  isComplete = false,
  logs = [],
  onStartPush,
}) => {
  const logsEndRef = useRef(null);

  // Auto-scroll to the bottom of the logs window whenever a new log is added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  if (!isOpen) return null;

  // Determine the header title based on state
  let titleText = "Ready to Push Data";
  if (isUploading) titleText = "Transmitting to Planning Dept...";
  if (isComplete) titleText = "Transmission Complete";

  return (
    <div className="pdu-modal-overlay">
      <div className="pdu-modal-content">
        {/* Header */}
        <div className="pdu-modal-header">
          <h3 className="pdu-modal-title">{titleText}</h3>
        </div>

        {/* Body */}
        <div className="pdu-modal-body">
          {/* Status Indicator Area */}
          <div className="pdu-modal-status-area">
            {!isUploading && !isComplete && (
              <div className="pdu-status-idle">
                <span style={{ fontSize: "2rem" }}>📤</span>
                <p>
                  Ready to transmit <strong>{totalBlocks}</strong> blocks via
                  encrypted Base64 payload.
                </p>
              </div>
            )}

            {isUploading && (
              <div className="pdu-status-loading">
                <div className="pdu-spinner"></div>
                <p>Awaiting response from API.up.gov.in...</p>
              </div>
            )}

            {isComplete && logs.some((l) => l.status === "success") && (
              <div className="pdu-status-success">
                <span style={{ fontSize: "2rem" }}>✅</span>
                <p>Data successfully transmitted.</p>
              </div>
            )}

            {isComplete && !logs.some((l) => l.status === "success") && (
              <div className="pdu-status-failed">
                <span style={{ fontSize: "2rem" }}>❌</span>
                <p>Transmission Failed.</p>
              </div>
            )}
          </div>

          {/* Terminal / Logs Console */}
          <div className="pdu-modal-logs-container">
            <p className="pdu-logs-title">System Console:</p>
            <div className="pdu-logs-window">
              {logs.length === 0 && (
                <span className="pdu-log-empty">Waiting for execution...</span>
              )}
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`pdu-log-entry pdu-log-${log.status}`}
                >
                  <span className="pdu-log-icon">
                    {log.status === "success" ? ">>" : "!!"}
                  </span>
                  <span className="pdu-log-text">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pdu-modal-footer">
          {!isUploading && !isComplete && (
            <>
              <PDUButton variant="outline" onClick={onClose}>
                Cancel
              </PDUButton>
              <PDUButton variant="action" onClick={onStartPush}>
                Confirm & Push Data
              </PDUButton>
            </>
          )}

          {isUploading && (
            <PDUButton variant="action" disabled>
              Transmitting...
            </PDUButton>
          )}

          {isComplete && (
            <PDUButton variant="default" onClick={onClose}>
              Close Window
            </PDUButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDUStatusModal;
