import React, { useEffect, useRef } from "react";
import PDUButton from "./PDUButton";
import PDUProgressBar from "./PDUProgressBar";
import "./styles/PDUStatusModal.css";

/**
 * PDUStatusModal - A modal overlay to track the block-by-block data upload.
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to close the modal
 * @param {number} currentBlock - The number of blocks processed so far
 * @param {number} totalBlocks - Total number of blocks (Default 108)
 * @param {boolean} isUploading - Whether the upload process is currently active
 * @param {boolean} isComplete - Whether the entire batch process has finished
 * @param {Array<Object>} logs - Array of log objects: { id, status: 'success'|'error', message: '...' }
 * @param {function} onStartPush - Function to trigger the upload process
 */
const PDUStatusModal = ({
  isOpen,
  onClose,
  currentBlock = 0,
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

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  // Determine the header title based on state
  let titleText = "Ready to Push Data";
  if (isUploading) titleText = "Pushing Data to Planning Dept...";
  if (isComplete) titleText = "Upload Process Complete";

  return (
    <div className="pdu-modal-overlay">
      <div className="pdu-modal-content">
        {/* Header */}
        <div className="pdu-modal-header">
          <h3 className="pdu-modal-title">{titleText}</h3>
        </div>

        {/* Body */}
        <div className="pdu-modal-body">
          <PDUProgressBar
            current={currentBlock}
            total={totalBlocks}
            label="Overall Progress"
          />

          <div className="pdu-modal-logs-container">
            <p className="pdu-logs-title">Live Transaction Logs:</p>
            <div className="pdu-logs-window">
              {logs.length === 0 && (
                <span className="pdu-log-empty">Waiting to start...</span>
              )}
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`pdu-log-entry pdu-log-${log.status}`}
                >
                  <span className="pdu-log-icon">
                    {log.status === "success" ? "✅" : "❌"}
                  </span>
                  <span className="pdu-log-text">{log.message}</span>
                </div>
              ))}
              {/* Invisible div to target for auto-scrolling */}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pdu-modal-footer">
          {/* Only show Start button if we haven't started and haven't completed */}
          {!isUploading && !isComplete && (
            <>
              <PDUButton variant="outline" onClick={onClose}>
                Cancel
              </PDUButton>
              <PDUButton variant="action" onClick={onStartPush}>
                Start Upload
              </PDUButton>
            </>
          )}

          {/* Show a disabled button while uploading */}
          {isUploading && (
            <PDUButton variant="action" disabled>
              Uploading...
            </PDUButton>
          )}

          {/* Show Done/Close button when finished */}
          {isComplete && (
            <PDUButton variant="default" onClick={onClose}>
              Finish & Close
            </PDUButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDUStatusModal;
