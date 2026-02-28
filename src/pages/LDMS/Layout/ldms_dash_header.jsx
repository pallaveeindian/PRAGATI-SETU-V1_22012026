// src/pages/LDMS/Layout/ldms_dash_header.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import HeaderBg from "../../../assets/Rural-Women-Entrepreneurs.jpeg";

export default function DashboardHeader({
  title = "Dashboard",
  username = "User",
}) {
  return (
    <div
      className="dashboard-header-wrapper"
      style={{ backgroundImage: `url(${HeaderBg})` }}
    >
      {/* RED OVERLAY */}
      <div className="header-overlay" />

      <div className="header-content">
        <h1>
          <FontAwesomeIcon icon={faChartColumn} />
          {title}
        </h1>

        <div className="user-info">
          <FontAwesomeIcon icon={faUserCircle} />
          <span>Welcome, {username}</span>
        </div>
      </div>

      {/* SVG PARALLAX WAVE */}
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
            {/* subtle green accent */}
            <use href="#onda" x="48" y="0" fill="rgba(10,127,46,0.25)" />
            <use href="#onda" x="48" y="3" fill="rgba(233, 103, 17, 0.47)" />
            <use href="#onda" x="48" y="5" fill="rgba(255, 255, 255, 0.6)" />
            {/* FINAL WHITE WAVE */}
            <use href="#onda" x="48" y="7" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <style>{`
        .dashboard-header-wrapper {
          position: relative;
          width: 100%;
          background-size: center;
          background-position: 120% 25%;
          background-repeat: no-repeat;
          overflow: hidden;
          color: #ffffff;
        }

        /* RED TRANSPARENT OVERLAY */
        .header-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(139,0,0,0.10),
            rgba(198,40,40,0.10)
          );
          z-index: 1;
        }

        /* CONTENT */
        .header-content {
          position: relative;
          z-index: 2;
          padding: 80px 20px 120px 20px;
          text-align: center;
        }

        .header-content h1 {
          font-size: 38px;
          font-weight: 800;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          margin: 0;
          letter-spacing: 1px;

          /* Elegant red glow shadow */
          text-shadow: 
            0 4px 12px rgba(0, 0, 0, 1),
            0 2px 4px rgba(0, 0, 0, 0.45);
        }

        .user-info {
          margin-top: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
          opacity: 0.95;

          /* Soft subtle shadow */
          text-shadow: 
            0 1px 3px rgba(0, 0, 0, 1);
        }

        /* ===== HEADER TITLE ICON ===== */
        .header-content h1 svg {
          filter: 
            drop-shadow(0 4px 10px rgba(0, 0, 0, 1))
            drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45));
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        /* Optional subtle hover pop */
        .header-content h1 svg:hover {
          transform: translateY(-2px) scale(1.05);
        }

        /* ===== USER INFO ICON ===== */
        .user-info svg {
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 1));
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
          height: 110px;
          min-height: 80px;
          max-height: 150px;
        }

        /* WAVE ANIMATION */
        .parallaxonde > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }

        .parallaxonde > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
        }

        .parallaxonde > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
        }

        .parallaxonde > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }

        .parallaxonde > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
        }

        @keyframes move-forever {
          0% { transform: translate3d(-90px,0,0); }
          100% { transform: translate3d(85px,0,0); }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .dashboard-header-wrapper {
            position: relative;
            width: 100%;
            background-size: cover;  
            background-position: 120% 25%;
            background-repeat: no-repeat;
            overflow: hidden;
            color: #ffffff;            
          }

          .header-content {
            padding: 60px 15px 90px 15px;
          }

          .header-content h1 {
            font-size: 24px;
          }

          .user-info {
            font-size: 14px;
          }

          .onde {
            height: 60px;
          }
        }

        @media (max-width: 480px) {
          .header-content h1 {
            font-size: 20px;
          }

          .onde {
            height: 45px;
          }
        }
      `}</style>
    </div>
  );
}
