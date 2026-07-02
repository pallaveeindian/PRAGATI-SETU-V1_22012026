// src/pages/GovHeader.jsx
import React, { useContext } from "react";
import { LanguageContext } from "../pages/LanguageContext"; // ⚠️ path check karo

export default function GovHeader({ logo, title, onFontChange }) {

  const { setLang, lang } = useContext(LanguageContext);

  return (
    <header className="gov-header">
      <div className="gov-header-inner">
        {/* LEFT */}
        <div className="gov-header-left">
          <img src={logo} alt="Government Logo" className="gov-logo" />
          <span className="gov-text">{title}</span>
        </div>

        {/* RIGHT */}
        <div className="gov-header-right">
          <button onClick={() => onFontChange(0.9)}>A-</button>
          <button onClick={() => onFontChange(1)}>A</button>
          <button onClick={() => onFontChange(1.1)}>A+</button>

          <span className="divider">|</span>

          {/*  ENGLISH */}
          <button
            className="lang-btn"
            onClick={() => setLang("en")}
            style={{ fontWeight: lang === "en" ? "700" : "500" }}
          >
            English
          </button>

          <span className="divider">|</span>

          {/* ✅ HINDI */}
          <button
            className="lang-btn"
            onClick={() => setLang("hi")}
            style={{ fontWeight: lang === "hi" ? "700" : "500" }}
          >
            हिंदी
          </button>
        </div>
      </div>

      <style>{`
        .gov-header {
          background: #0f172a;
          color: #fff;
          width: 100%;
        }

        .gov-header-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 20px;
        }

        .gov-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        .gov-logo {
          height: 36px;
          width: 36px;
          object-fit: cover;
          border-radius: 50%;
        }

        .gov-text {
          font-size: 15px;
          white-space: nowrap;
        }

        .gov-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gov-header-right button {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 6px;
        }

        .gov-header-right button:hover {
          text-decoration: underline;
        }

        .divider {
          opacity: 0.6;
        }

        .lang-btn {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .gov-header-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .gov-header-left {
            width: 100%;
            justify-content: center;
            margin-bottom: 8px;
          }

          .gov-text {
            white-space: normal;
          }

          .gov-header-right {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.2);
          }

          .divider {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .gov-logo {
            height: 32px;
            width: 32px;
          }

          .gov-text {
            font-size: 13px;
          }

          .gov-header-right button {
            font-size: 12px;
          }
        }
      `}</style>
    </header>
  );
}