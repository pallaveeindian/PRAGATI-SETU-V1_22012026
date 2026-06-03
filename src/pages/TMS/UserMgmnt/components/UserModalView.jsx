// UserMgmnt/components/UserModalView.jsx
import React, { useEffect } from "react";
import {
  FaTimes,
  FaUserCircle,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaHistory,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function UserModalView({ open, user, onClose, targetRole }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !user) return null;

  // Safe date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isActive = user.is_active === 1 || user.is_active === true;
  const isLocked = user.is_locked === 1 || user.is_locked === true;
  const isSuspended = user.is_suspended === 1 || user.is_suspended === true;

  return (
    <div className="nic-modal-backdrop" onClick={onClose}>
      <div
        className="nic-modal-container"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="nic-modal-header">
          <h3 className="nic-modal-title">
            <FaUserCircle style={{ marginRight: "8px", fontSize: "1.2em" }} />
            {targetRole === "bmmu" ? "BMMU" : "DMMU"} User Profile Details
          </h3>
          <button
            className="nic-modal-close-btn"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="nic-modal-body">
          {/* SECTION: Account Information */}
          <div className="nic-detail-section">
            <h4 className="nic-section-title">
              <FaUserCircle className="nic-section-icon" /> Account Information
            </h4>
            <div className="nic-detail-grid">
              <div className="nic-detail-group">
                <span className="nic-detail-label">Username</span>
                <span
                  className="nic-detail-value"
                  style={{ fontWeight: "700", color: "#1e3a8a" }}
                >
                  {user.username || "—"}
                </span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">System User ID</span>
                <span className="nic-detail-value">{user.user_id || "—"}</span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">
                  <FaEnvelope style={{ marginRight: "4px" }} /> Recovery Email
                </span>
                <span className="nic-detail-value">
                  {user.recovery_email || "Not Provided"}
                </span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">
                  <FaPhoneAlt style={{ marginRight: "4px" }} /> Recovery Mobile
                </span>
                <span className="nic-detail-value">
                  {user.recovery_mobile || "Not Provided"}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: Jurisdictional Location */}
          <div className="nic-detail-section">
            <h4 className="nic-section-title">
              <FaMapMarkerAlt className="nic-section-icon" /> Jurisdictional
              Assignment
            </h4>
            <div className="nic-detail-grid">
              <div className="nic-detail-group">
                <span className="nic-detail-label">District</span>
                <span className="nic-detail-value">
                  {user.district_name_en || "—"}
                </span>
              </div>
              {targetRole === "bmmu" && (
                <div className="nic-detail-group">
                  <span className="nic-detail-label">Block</span>
                  <span className="nic-detail-value">
                    {user.block_name_en || "—"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION: Security & Status */}
          <div className="nic-detail-section">
            <h4 className="nic-section-title">
              <FaShieldAlt className="nic-section-icon" /> Security & Status
            </h4>
            <div className="nic-detail-grid">
              <div className="nic-detail-group">
                <span className="nic-detail-label">Account Status</span>
                <span className="nic-detail-value">
                  <span
                    className={`nic-status-badge ${isActive ? "badge-success" : "badge-danger"}`}
                  >
                    {isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">Lock State</span>
                <span className="nic-detail-value">
                  {isLocked ? (
                    <span className="nic-status-badge badge-warning">
                      LOCKED
                    </span>
                  ) : (
                    <span className="nic-status-badge badge-success">
                      UNLOCKED
                    </span>
                  )}
                </span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">Suspension State</span>
                <span className="nic-detail-value">
                  {isSuspended ? (
                    <span className="nic-status-badge badge-danger">
                      SUSPENDED
                    </span>
                  ) : (
                    <span className="nic-status-badge badge-success">
                      NORMAL
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: Activity Logs */}
          <div className="nic-detail-section" style={{ borderBottom: "none" }}>
            <h4 className="nic-section-title">
              <FaHistory className="nic-section-icon" /> System Activity
            </h4>
            <div className="nic-detail-grid">
              <div className="nic-detail-group">
                <span className="nic-detail-label">Last Active On</span>
                <span className="nic-detail-value">
                  {formatDate(user.last_active_on)}
                </span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">Locked On</span>
                <span className="nic-detail-value">
                  {formatDate(user.locked_on)}
                </span>
              </div>
              <div className="nic-detail-group">
                <span className="nic-detail-label">Suspended On</span>
                <span className="nic-detail-value">
                  {formatDate(user.suspended_on)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="nic-modal-footer">
          <button className="nic-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* STYLES: NIC GOV STANDARD */}
      <style>{`
        .nic-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
          box-sizing: border-box;
        }

        .nic-modal-container {
          background-color: #ffffff;
          width: 100%;
          max-width: 750px;
          max-height: 90vh;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideIn 0.2s ease-out;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nic-modal-header {
          background-color: #1e3a8a; /* Gov Deep Blue */
          color: #ffffff;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nic-modal-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          letter-spacing: 0.5px;
        }

        .nic-modal-close-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .nic-modal-close-btn:hover {
          opacity: 1;
        }

        .nic-modal-body {
          padding: 24px;
          overflow-y: auto;
          background-color: #f8fafc;
        }

        .nic-detail-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .nic-section-title {
          margin: 0 0 16px 0;
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 8px;
        }

        .nic-section-icon {
          color: #3b82f6;
          margin-right: 8px;
        }

        .nic-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 30px;
        }

        @media (max-width: 600px) {
          .nic-detail-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .nic-detail-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nic-detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
        }

        .nic-detail-value {
          font-size: 15px;
          color: #1e293b;
          word-break: break-word;
        }

        /* Status Badges */
        .nic-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .badge-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-warning { background: #fef9c3; color: #9a3412; border: 1px solid #fde047; }

        .nic-modal-footer {
          padding: 16px 24px;
          background-color: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }

        .nic-btn-close {
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 8px 24px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-btn-close:hover {
          background-color: #e2e8f0;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
