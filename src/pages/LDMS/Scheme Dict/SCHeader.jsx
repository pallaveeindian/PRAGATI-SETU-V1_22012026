// src/pages/LDMS/Scheme Dict/SCHeader.jsx
import React from "react";
import PrernaLogo from "../../../assets/SiteAssets/PrernaLogo.png";
import { FaUniversity, FaBookOpen } from "react-icons/fa";

export default function SCHeader() {
  return (
    <div className="sc-header-wrapper">
      <div className="sc-header">
        <div className="sc-header-content">
          <div className="sc-header-icon">
            <img src={PrernaLogo} alt="Prerna Logo" />
          </div>

          <div className="sc-header-text">
            <h1>
              UPSRLM Departments &<span> Scheme Dictionary</span>
            </h1>

            <p>
              Explore government schemes across departments within UPSRLM. This
              dictionary helps identify available support programs and decide
              which support buckets can best assist SHGs and Lakhpati Didi
              initiatives.
            </p>
          </div>

          <div className="sc-header-side-icon">
            <FaBookOpen size={40} />
          </div>
        </div>
      </div>

      <style>{`

        :root {
          --ldms-red: #c62828;
          --ldms-red-soft: #fdecea;
          --ldms-green: #189218;
          --ldms-dark: #1f2937;
        }

        .sc-header-wrapper {
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        /* Main slanted header */

        .sc-header {
          background: linear-gradient(135deg, #c62828, #8e1b1b);
          color: white;
          padding: 28px 28px 32px 28px;
          position: relative;
          overflow: hidden;
        }

        /* slanted overlay */

        .sc-header::before {
          content: "";
          position: absolute;
          right: -80px;
          top: 0;
          width: 260px;
          height: 100%;
          background: rgba(255,255,255,0.08);
          transform: skewX(-28deg);
        }

        .sc-header-content {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        /* left icon */

        .sc-header-icon {
          width: 156px;
          height: 156px;
          background: white;
          color: var(--ldms-red);
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow: 0 6px 18px rgba(0,0,0,0.18);

          transition: transform 0.25s ease;
        }

        .sc-header-icon:hover {
          transform: translateY(-3px);
        }

        /* title */

        .sc-header-text h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.4px;
        }

        .sc-header-text h1 span {
          color: #ffe9e9;
          font-weight: 700;
        }

        /* subtitle */

        .sc-header-text p {
          margin-top: 6px;
          font-size: 14px;
          line-height: 1.5;
          max-width: 680px;
          color: rgba(255,255,255,0.9);
        }

        /* right decorative icon */

        .sc-header-side-icon {
          margin-left: auto;
          color: rgba(255,255,255,0.25);
          transition: transform 0.3s ease;
        }

        .sc-header-icon img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        }

        .sc-header:hover .sc-header-side-icon {
          transform: translateY(-3px);
        }

        /* responsive */

        @media (max-width: 768px) {

          .sc-header {
            padding: 22px;
          }

          .sc-header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .sc-header-side-icon {
            display: none;
          }

          .sc-header-text h1 {
            font-size: 22px;
          }

        }

      `}</style>
    </div>
  );
}
