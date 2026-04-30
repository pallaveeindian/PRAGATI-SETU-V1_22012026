// src/pages/EPSMS/Layout/EpsmsFooter.jsx
import React from "react";

export default function EpsmsFooter() {
    return (
        <footer className="epsms-footer">
            <div className="epsms-footer-inner">
                <span className="epsms-footer-left">
                    © {new Date().getFullYear()} Pragati Setu - Enterprise Sakhi Management System (EPSMS)
                </span>
                <span className="epsms-footer-right">
                    CRP-EP to Panchayats Mapping Form
                </span>
            </div>

            <style>{`
        .epsms-footer {
          flex-shrink: 0;
          height: 44px;
          background: #ffffff;
          border-top: 2px solid var(--epsms-red);
          display: flex;
          align-items: center;
          padding: 0 20px;
          font-size: 12px;
          color: var(--epsms-text-muted);
        }

        .epsms-footer-inner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .epsms-footer-left {
          font-weight: 600;
        }

        .epsms-footer-right {
          font-weight: 500;
          color: #374151;
        }

        /* Mobile-safe */
        @media (max-width: 768px) {
          .epsms-footer-inner {
            flex-direction: column;
            gap: 4px;
            align-items: flex-start;
          }
        }
      `}</style>
        </footer>
    );
}