// src/pages/LoginComps/ThemeSelectLogin.jsx
import React from "react";

export default function ThemeSelectLogin() {
  return (
    <section className="theme-selector-wrapper">
      <div className="theme-selector-content">
        <h2>Theme Selector Component</h2>
        <p>
          Buttons to toggle Blue, Red, Green, and Purple themes will go here.
        </p>
      </div>

      <style>{`
        .theme-selector-wrapper {
          width: 100%;
          padding: 30px 20px;
          background-color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 2px solid #cbd5e1;
        }

        .theme-selector-content {
          text-align: center;
          color: #1e293b;
        }

        .theme-selector-content h2 {
          margin-bottom: 8px;
          font-size: 18px;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
