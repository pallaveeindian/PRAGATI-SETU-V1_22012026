// src\pages\newsModal.jsx
import React from "react";
import {
  FaBullhorn,
  FaTimes,
  FaCalendarAlt,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function NewsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="news-modal-header">
          <div className="header-left">
            <div className="megaphone-icon-wrapper">
              <FaBullhorn size={28} className="megaphone-icon" />
            </div>
            <div>
              <h2 className="header-title">Important Update</h2>
              <p className="header-subtitle">
                From Uttar Pradesh State Rural Livelihoods Mission
              </p>
            </div>
          </div>

          <button className="close-btn" onClick={onClose} aria-label="Close">
            <FaTimes size={18} />
          </button>

          {/* Decorative Dots matching the reference image */}
          <div className="decorative-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* BODY */}
        <div className="news-modal-body">
          <div className="body-left">
            <FaShieldAlt
              size={80}
              color="#ea580c"
              style={{ marginBottom: "10px" }}
            />
            <h3
              style={{
                margin: 0,
                color: "#ea580c",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Security SSL
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#64748b",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Certificate Renewal
            </p>
          </div>

          <div className="body-right">
            <h3 className="alert-title">
              <FaExclamationTriangle
                size={18}
                color="#dc2626"
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Your connection is not private
            </h3>
            <div className="alert-box">
              Attackers might be trying to steal your information from{" "}
              <strong>upsrlmtms.upsdc.gov.in</strong> (for example, passwords,
              messages or credit cards).
              <br />
              <br />
              <span
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  fontSize: "14px",
                }}
              >
                net::ERR_CERT_DATE_INVALID
              </span>
              <br />
              <br />
              <em>
                Turn on enhanced protection to get Chrome's highest level of
                security.
              </em>
            </div>

            <p className="update-message">
              <strong>Dear Users,</strong>
              <br />
              If you are seeing the error above, please do not panic. Our
              portal's SSL Certificate is undergoing a scheduled renewal and
              will be updated <strong>today between 1:00 PM to 4:00 PM</strong>.
              <br />
              <br />
              Please adjust your portal work accordingly. Services will
              automatically resume normal secure operations once the renewal is
              complete.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="news-modal-footer">
          <div className="date-pill">
            <FaCalendarAlt color="#ea580c" />
            <span>Date: 21 September 2026</span>
          </div>

          <button className="action-btn" onClick={onClose}>
            Acknowledge & Close
            <svg
              style={{ marginLeft: "8px" }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .news-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease-out;
        }

        .news-modal-content {
          background: #ffffff;
          width: 90%;
          max-width: 650px;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          position: relative;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* HEADER */
        .news-modal-header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 2;
        }

        .megaphone-icon-wrapper {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .header-title {
          margin: 0;
          color: white;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .header-subtitle {
          margin: 4px 0 0 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 500;
        }

        .close-btn {
          background: white;
          border: none;
          color: #ea580c;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .close-btn:hover {
          transform: scale(1.1);
        }

        .decorative-dots {
          position: absolute;
          right: 80px;
          top: 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          opacity: 0.3;
        }
        .dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
        }

        /* BODY */
        .news-modal-body {
          display: flex;
          padding: 30px;
          gap: 30px;
          background: #ffffff;
        }

        .body-left {
          flex: 0 0 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-right: 24px;
          border-right: 2px dashed #fed7aa;
        }

        .body-right {
          flex: 1;
        }

        .alert-title {
          margin: 0 0 12px 0;
          color: #b91c1c;
          font-size: 18px;
          font-weight: 700;
        }

        .alert-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 16px;
          border-radius: 8px;
          color: #7f1d1d;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .update-message {
          margin: 0;
          font-size: 14px;
          color: #334155;
          line-height: 1.6;
        }

        /* FOOTER */
        .news-modal-footer {
          padding: 16px 30px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .date-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffedd5;
          color: #9a3412;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #fed7aa;
        }

        .action-btn {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px -1px rgba(234, 88, 12, 0.4);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 600px) {
          .news-modal-body {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }
          .body-left {
            flex: none;
            border-right: none;
            border-bottom: 2px dashed #fed7aa;
            padding-right: 0;
            padding-bottom: 20px;
          }
          .news-modal-header { padding: 20px; }
          .news-modal-footer { flex-direction: column; gap: 16px; padding: 20px; }
          .action-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
