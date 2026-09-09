// src/pages/StateLoginPortal/Dashboards/CRPEPFormDashboard.jsx

import React from "react";

const CRPEPFormDashboard = () => {
  return (
    <>
      <div className="under-development-page">
        {/* ============================================
            FLOATING BACKGROUND PARTICLES
        ============================================ */}

        <div className="floating-bg">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* ============================================
            DEVELOPMENT CARD
        ============================================ */}

        <div className="development-card">
          <div className="gear-wrapper">
            {/* Main Gear */}
            <div className="gear gear-large">⚙</div>

            {/* Small Gear - Bottom Left */}
            <div className="gear gear-small gear-one">⚙</div>

            {/* Small Gear - Top Right */}
            <div className="gear gear-small gear-two">⚙</div>

            {/* Pulse Animation */}
            <div className="pulse-ring"></div>
          </div>

          {/* ============================================
              HEADING
          ============================================ */}

          <h1>Module Under Development</h1>

          <div className="divider"></div>

          {/* ============================================
              DESCRIPTION
          ============================================ */}

          <p>
            We are working hard to build this module with the best experience.
            <br />
            It will be available very soon.
          </p>

          {/* ============================================
              LOADING ANIMATION
          ============================================ */}

          <div className="loader-row">
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* ============================================
              STATUS
          ============================================ */}

          <div className="status-badge">🚀 Coming Soon</div>
        </div>
      </div>

      {/* ================================================
          STYLES
      ================================================ */}

      <style>{`

        /* =====================================================
           GLOBAL
        ===================================================== */

        * {
          box-sizing: border-box;
        }


        /* =====================================================
           MAIN PAGE
        ===================================================== */

        .under-development-page {

          min-height: 100vh;
          width: 100%;

          display: flex;
          justify-content: center;
          align-items: center;

          background:
            radial-gradient(
              circle at top,
              #e8f5e9 0%,
              #f1f8f3 40%,
              #ffffff 100%
            );

          overflow: hidden;

          position: relative;

          padding: 40px;

          font-family:
            Inter,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
        }


        /* =====================================================
           FLOATING BACKGROUND
        ===================================================== */

        .floating-bg {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          overflow: hidden;

          pointer-events: none;
        }


        .floating-bg span {

          position: absolute;

          bottom: -30px;

          width: 12px;
          height: 12px;

          border-radius: 50%;

          background: #22c55e;

          opacity: 0.15;

          animation:
            float 10s linear infinite;
        }


        .floating-bg span:nth-child(1) {
          left: 8%;
          animation-duration: 9s;
        }


        .floating-bg span:nth-child(2) {

          left: 24%;

          width: 18px;
          height: 18px;

          animation-duration: 13s;
          animation-delay: 1s;
        }


        .floating-bg span:nth-child(3) {

          left: 50%;

          animation-duration: 8s;
          animation-delay: 2s;
        }


        .floating-bg span:nth-child(4) {

          left: 76%;

          width: 20px;
          height: 20px;

          animation-duration: 12s;
          animation-delay: 0.5s;
        }


        .floating-bg span:nth-child(5) {

          left: 92%;

          animation-duration: 10s;
          animation-delay: 1.5s;
        }


        @keyframes float {

          0% {
            transform:
              translateY(100vh)
              scale(0.5);

            opacity: 0;
          }

          30% {
            opacity: 0.25;
          }

          100% {

            transform:
              translateY(-120px)
              scale(1.2);

            opacity: 0;
          }
        }


        /* =====================================================
           DEVELOPMENT CARD
        ===================================================== */

        .development-card {

          position: relative;

          z-index: 5;

          width: min(700px, 100%);

          background: rgba(255, 255, 255, 0.96);

          border-radius: 26px;

          padding: 60px 50px;

          text-align: center;

          box-shadow:
            0 25px 60px rgba(22, 101, 52, 0.14);

          border: 2px solid #dcfce7;

          overflow: hidden;

          backdrop-filter: blur(8px);
        }


        /* Animated Green Border */

        .development-card::before {

          content: "";

          position: absolute;

          inset: 0;

          border-radius: 26px;

          padding: 2px;

          background:
            linear-gradient(
              135deg,
              #86efac,
              #16a34a,
              #22c55e,
              #15803d,
              #86efac
            );

          background-size: 300% 300%;

          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);

          -webkit-mask-composite: xor;

          mask-composite: exclude;

          pointer-events: none;

          animation:
            borderAnimation 5s ease infinite;
        }


        @keyframes borderAnimation {

          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }


        /* =====================================================
           GEAR WRAPPER
        ===================================================== */

        .gear-wrapper {

          position: relative;

          width: 220px;
          height: 220px;

          margin: auto;

          display: flex;

          align-items: center;
          justify-content: center;
        }


        /* =====================================================
           PULSE RING
        ===================================================== */

        .pulse-ring {

          position: absolute;

          width: 180px;
          height: 180px;

          left: 20px;
          top: 20px;

          border-radius: 50%;

          border:
            4px solid rgba(22, 163, 74, 0.16);

          animation:
            pulse 2.4s infinite;
        }


        @keyframes pulse {

          0% {

            transform: scale(0.85);

            opacity: 1;
          }

          100% {

            transform: scale(1.25);

            opacity: 0;
          }
        }


        /* =====================================================
           GEARS
        ===================================================== */

        .gear {

          position: absolute;

          color: #16a34a;

          user-select: none;

          line-height: 1;

          filter:
            drop-shadow(
              0 10px 15px
              rgba(22, 101, 52, 0.25)
            );
        }


        /* Main Gear */

        .gear-large {

          font-size: 110px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          animation:
            rotateCW 8s linear infinite;
        }


        /* Bottom Left Gear */

        .gear-one {

          font-size: 62px;

          left: 10px;
          bottom: 25px;

          color: #15803d;

          animation:
            rotateCCW 5s linear infinite;
        }


        /* Top Right Gear */

        .gear-two {

          font-size: 55px;

          right: 18px;
          top: 18px;

          color: #22c55e;

          animation:
            rotateCCW 4s linear infinite;
        }


        /* =====================================================
           GEAR ROTATION
        ===================================================== */

        @keyframes rotateCW {

          from {

            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {

            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }


        @keyframes rotateCCW {

          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }


        /* =====================================================
           HEADING
        ===================================================== */

        .development-card h1 {

          margin-top: 25px;

          color: #166534;

          font-size: 38px;

          font-weight: 800;

          letter-spacing: 0.5px;

          line-height: 1.2;
        }


        /* =====================================================
           DIVIDER
        ===================================================== */

        .divider {

          width: 90px;

          height: 5px;

          border-radius: 30px;

          margin:
            18px auto 25px;

          background:
            linear-gradient(
              90deg,
              #22c55e,
              #15803d
            );

          box-shadow:
            0 3px 10px
            rgba(22, 163, 74, 0.22);
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .development-card p {

          color: #64748b;

          font-size: 18px;

          line-height: 1.8;

          margin: 0;
        }


        .development-card p strong {

          color: #15803d;

          font-weight: 700;
        }


        /* =====================================================
           LOADER
        ===================================================== */

        .loader-row {

          margin-top: 35px;

          display: flex;

          justify-content: center;

          align-items: center;

          gap: 12px;
        }


        .loader-row span {

          width: 12px;
          height: 12px;

          border-radius: 50%;

          background: #16a34a;

          animation:
            bounce 1.3s infinite;

          box-shadow:
            0 3px 8px
            rgba(22, 163, 74, 0.25);
        }


        .loader-row span:nth-child(2) {
          animation-delay: 0.2s;
          background: #22c55e;
        }


        .loader-row span:nth-child(3) {
          animation-delay: 0.4s;
          background: #15803d;
        }


        @keyframes bounce {

          0%,
          80%,
          100% {

            transform: scale(1);

            opacity: 0.4;
          }

          40% {

            transform: scale(1.8);

            opacity: 1;
          }
        }


        /* =====================================================
           STATUS BADGE
        ===================================================== */

        .status-badge {

          margin:
            35px auto 0;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding:
            12px 24px;

          border-radius: 50px;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #15803d
            );

          color: white;

          font-weight: 700;

          letter-spacing: 0.5px;

          box-shadow:
            0 12px 25px
            rgba(22, 163, 74, 0.30);

          animation:
            badgePulse 2.5s ease-in-out infinite;
        }


        @keyframes badgePulse {

          0%,
          100% {

            transform: translateY(0);

            box-shadow:
              0 12px 25px
              rgba(22, 163, 74, 0.30);
          }

          50% {

            transform: translateY(-3px);

            box-shadow:
              0 16px 32px
              rgba(22, 163, 74, 0.38);
          }
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 768px) {

          .under-development-page {

            padding: 25px 15px;

          }


          .development-card {

            padding: 40px 25px;

            border-radius: 22px;

          }


          .development-card h1 {

            font-size: 28px;

          }


          .development-card p {

            font-size: 16px;

          }


          .gear-wrapper {

            width: 170px;
            height: 170px;

          }


          .gear-large {

            font-size: 85px;

          }


          .gear-one {

            font-size: 48px;

          }


          .gear-two {

            font-size: 42px;

          }


          .pulse-ring {

            width: 140px;
            height: 140px;

            left: 15px;
            top: 15px;

          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .under-development-page {

            padding: 20px 12px;

          }


          .development-card {

            padding:
              35px 18px;

          }


          .development-card h1 {

            font-size: 25px;

          }


          .development-card p {

            font-size: 14px;

            line-height: 1.7;

          }


          .gear-wrapper {

            width: 155px;
            height: 155px;

          }


          .gear-large {

            font-size: 76px;

          }


          .gear-one {

            font-size: 42px;

            left: 3px;
            bottom: 18px;

          }


          .gear-two {

            font-size: 38px;

            right: 5px;
            top: 10px;

          }


          .pulse-ring {

            width: 125px;
            height: 125px;

            left: 15px;
            top: 15px;

          }


          .status-badge {

            padding:
              10px 20px;

            font-size: 13px;

          }

        }

      `}</style>
    </>
  );
};

export default CRPEPFormDashboard;
