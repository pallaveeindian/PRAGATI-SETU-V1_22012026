import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import HeaderBg from "../../../assets/Rural-Women-Entrepreneurs.jpeg";

export default function TMSDashHeader({
  partnerName = "Training Partner Dashboard",
  username = "User",
  financialYear,
  setFinancialYear,
  loading,
  theme = "tms",
}) {
  const overlayThemes = {
    tms: "linear-gradient(135deg, #002174, #0092e194)",

    home: "linear-gradient(135deg, #632f05, rgba(249,115,22,.60))",

    ldms: "linear-gradient(135deg, #4A0410, rgba(220,38,38,.60))",

    epsms: "linear-gradient(135deg, #14532D, rgba(22,163,74,.60))",
  };

  const overlayBackground =
    overlayThemes[theme] || overlayThemes.tms;

  const waveThemes = {
    tms: [
      "rgba(37,99,235,.25)",
      "rgba(59,130,246,.45)",
    ],

    home: [
      "rgba(249,115,22,.25)",
      "rgba(251,146,60,.45)",
    ],

    ldms: [
      "rgba(185,28,28,.25)",
      "rgba(239,68,68,.45)",
    ],

    epsms: [
      "rgba(22,163,74,.25)",
      "rgba(34,197,94,.45)",
    ],
  };

  const waveColors = waveThemes[theme] || waveThemes.tms;

  return (
    <div
      className="dashboard-header-wrapper"
      style={{ backgroundImage: `url(${HeaderBg})` }}
    >
      {/* TMS BLUE OVERLAY */}
      <div
        className="header-overlay"
        style={{ background: overlayBackground }}
      />

      <div className="header-content">
        {/* Top Right: User Info */}
        <div className="user-info-top">
          <FontAwesomeIcon icon={faUserCircle} />
          <span>Welcome, {username}</span>
        </div>

        {/* Center: Partner Name & Subtitle */}
        <h1>
          <FontAwesomeIcon icon={faChartColumn} />
          {loading ? "Loading Dashboard..." : partnerName}
        </h1>
        <div className="partner-sub-heading">
          Executive Performance Dashboard
        </div>

        {/* Bottom Center: Financial Year Selector */}
        <div className="fy-controls">
          <label htmlFor="fy-select" className="fy-label">
            Financial Year:
          </label>
          <select
            id="fy-select"
            className="fy-select"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
          >
            <option value="2025-26">2025-26</option>
            <option value="2026-27">2026-27</option>
          </select>
        </div>
      </div>

      {/* SVG PARALLAX WAVE (TMS BLUE THEME) */}
      <div className="ondebox">
        <svg
          className="onde"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="onda"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352Z"
            />
          </defs>

          <g className="parallaxonde">
            {/* TMS Blue Wave Accents */}
            <use
              href="#onda"
              x="48"
              y="0"
              fill={waveColors[0]}
            />{" "}
            {/* Primary Blue */}
            <use
              href="#onda"
              x="48"
              y="3"
              fill={waveColors[1]}
            />{" "}
            {/* Lighter Blue */}
            <use href="#onda" x="48" y="5" fill="rgba(255, 255, 255, 0.6)" />
            {/* FINAL WHITE WAVE matching the body background */}
            <use href="#onda" x="48" y="7" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <style>{`
        .dashboard-header-wrapper {
          position: relative;
          width: 100%;
          background-size: cover;
          background-position: center 25%;
          background-repeat: no-repeat;
          overflow: hidden;
          color: #ffffff;
          margin-bottom: 15px;
        }

        /* BLUE TRANSPARENT OVERLAY */
        .header-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* CONTENT */
        .header-content {
          position: relative;
          z-index: 2;
          padding: 60px 20px 100px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .user-info-top {
          position: absolute;
          top: 24px;
          right: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content h1 {
          font-size: 36px;
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          margin: 0;
          letter-spacing: 0.5px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .partner-sub-heading {
          font-size: 16px;
          font-weight: 500;
          color: #bfdbfe; /* Light blue text */
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 8px;
          margin-bottom: 24px;
        }

        /* FINANCIAL YEAR SELECTOR IN HEADER */
        .fy-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.95);
          padding: 8px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255,255,255,0.5);
          color: #1e293b;
        }

        .fy-label {
          font-weight: 700;
          font-size: 14px;
          color: #334155;
        }

        .fy-select {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          background: #f8fafc;
          cursor: pointer;
        }

        .fy-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        /* ===== ICONS ===== */
        .header-content h1 svg {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
        }

        /* WAVE */
        .ondebox {
          position: absolute;
          bottom: 0;
          width: 100%;
          line-height: 0;
          z-index: 2;
        }

        .onde {
          width: 100%;
          height: 90px;
          min-height: 60px;
          max-height: 120px;
        }

        /* WAVE ANIMATION */
        .parallaxonde > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }
        .parallaxonde > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
        .parallaxonde > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
        .parallaxonde > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
        .parallaxonde > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }

        @keyframes move-forever {
          0% { transform: translate3d(-90px,0,0); }
          100% { transform: translate3d(85px,0,0); }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .header-content { padding: 50px 15px 70px 15px; }
          .header-content h1 { font-size: 24px; flex-direction: column; gap: 8px;}
          .user-info-top { top: 12px; right: 12px; font-size: 13px; }
          .onde { height: 50px; }
        }
      `}</style>
    </div>
  );
}
