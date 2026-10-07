// src/pages/Login.jsx
import React from "react";

// --- Module Components ---
// import SlideShowLogin from "./LoginComps/SlideShowLogin";
// import ThemeSelectLogin from "./LoginComps/ThemeSelectLogin";
import ModulesLogin from "./LoginComps/ModulesLogin";

export default function Login({ isOpen, onClose }) {
  if (!isOpen) return null;

  // SURGICAL FIX: Intercept the close button click from the child component
  // to ensure the modal state actually closes instead of just navigating.
  const handleContentClick = (e) => {
    e.stopPropagation();
    if (e.target.closest(".ws-close-btn")) {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content-wrapper" onClick={handleContentClick}>
        {/* 
          SURGICAL FIX: 
          Removed the redundant .login-modal-container box and red close button. 
          ModulesLogin now provides the gorgeous white workspace container.
        */}
        <ModulesLogin />
      </div>

      {/* --- STYLES --- */}
      <style>{`
        /* The Overlay: Fixed, blurred background, allows scrolling */
        .login-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          overflow-y: auto; /* SCROLLABLE MODAL */
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: modalFadeIn 0.3s ease;
          -webkit-overflow-scrolling: touch;
        }

        .login-modal-content-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        /* 
          SURGICAL CSS OVERRIDES: 
          Forces the full-page ModulesLogin wrapper to be transparent 
          so the modal's blurred background shines through beautifully.
        */
        .ws-wrapper {
          background-color: transparent !important;
          padding: 6vh 20px !important;
          min-height: auto !important;
          width: 100%;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .login-modal-overlay {
            padding: 0; 
          }
          .ws-wrapper {
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
