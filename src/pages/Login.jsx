// src/pages/Login.jsx
import React, { useState } from "react";

// --- Module Components ---
import SlideShowLogin from "./LoginComps/SlideShowLogin";
import ThemeSelectLogin from "./LoginComps/ThemeSelectLogin";
import ModulesLogin from "./LoginComps/ModulesLogin";

export default function Login({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      {/* 
        Stop propagation so clicking inside the modal 
        doesn't close it, only clicking the background overlay does. 
      */}
      <div
        className="login-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          className="login-close-btn"
          onClick={onClose}
          title="Close Login"
        >
          &times;
        </button>

        {/* MAIN CONTENT AREA */}
        <main className="login-main-content">
          {/* SLIDESHOW COMPONENT */}
          {/* <SlideShowLogin /> */}

          {/* THEME SELECTOR COMPONENT (If still needed, otherwise remove) */}
          {/* <ThemeSelectLogin /> */}

          {/* MODULE SELECTOR COMPONENT */}
          <ModulesLogin />
        </main>
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
          padding: 40px 20px;
          animation: modalFadeIn 0.3s ease;
          -webkit-overflow-scrolling: touch;
        }

        /* The Container: Holds the actual content inside the scrollable area */
        .login-modal-container {
          width: 100%;
          max-width: 1400px;
          background-color: #f8fafc;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: visible;
          animation: modalSlideUp 0.4s ease forwards;
        }

        /* Close Button (Fixed relative to the container) */
        .login-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
          background: rgb(255, 0, 0);
          backdrop-filter: blur(4px);
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
          font-size: 28px;
          line-height: 1;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .login-close-btn:hover {
          background: #ffffff;
          border-color: #dc2626;
          color: #dc2626;
          transform: scale(1.1) rotate(90deg);
        }

        .login-main-content {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* Animations */
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .login-modal-overlay {
            padding: 0; /* Full screen on mobile */
          }
          .login-modal-container {
            border-radius: 0;
            min-height: 100vh;
            margin: 0;
          }
          .login-close-btn {
            top: 15px;
            right: 15px;
            background: rgba(0,0,0,0.5); /* Higher contrast on mobile */
          }
        }
      `}</style>
    </div>
  );
}
