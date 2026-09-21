// src/pages/HeroComponents/HeroBottomBanner.jsx
import React from "react";
import {
  FaCertificate,
  FaChartPie,
  FaHandsHelping,
  FaLeaf,
} from "react-icons/fa";

import heroLog from "../../assets/NewHero/heroLog.png";

export default function HeroBottomBanner() {
  const pillars = [
    { icon: <FaCertificate size={16} />, text: "Transparent Systems" },
    { icon: <FaChartPie size={16} />, text: "Data-Driven Governance" },
    { icon: <FaHandsHelping size={16} />, text: "Inclusive Growth" },
    { icon: <FaLeaf size={16} />, text: "Sustainable Livelihoods" },
  ];

  return (
    <div className="hero-bottom-banner">
      {/* ================= PILLARS ================= */}
      <div className="pillars-container">
        {pillars.map((pillar, idx) => (
          <React.Fragment key={idx}>
            <div className="pillar-item">
              <span className="pillar-icon">{pillar.icon}</span>

              <span className="pillar-text">{pillar.text}</span>
            </div>

            {idx !== pillars.length - 1 && (
              <span className="pillar-divider">|</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ================= FLOATING HINDI LOGO (WITH 3D SHINE) ================= */}
      <div className="script-text">
        <div className="coin-wrapper">
          {/* The actual image */}
          <img src={heroLog} alt="महिला सशक्तिकरण से समृद्ध उत्तर प्रदेश" />

          {/* The masked overlay where the shine animation happens */}
          <div
            className="shine-swipe"
            style={{
              WebkitMaskImage: `url(${heroLog})`,
              maskImage: `url(${heroLog})`,
            }}
          ></div>
        </div>
      </div>

      <style>{`

        /* =====================================================
           BOTTOM BANNER
        ===================================================== */

        .hero-bottom-banner {
          position: absolute;
          bottom: 0;
          left: 0;
          line-height: 3;
          width: 100%;

          background: #0f172a;
          color: #ffffff;

          display: flex;
          align-items: center;

          padding: 12px 40px;

          z-index: 10;

          /*
           * IMPORTANT:
           * The banner itself controls the width.
           */
          box-sizing: border-box;
        }


        /* =====================================================
           PILLARS
        ===================================================== */

        .pillars-container {
          display: flex;
          align-items: center;

          gap: 24px;

          /*
           * This is the actual content of the banner.
           */
          position: relative;

          z-index: 2;
        }


        .pillar-item {
          display: flex;
          align-items: center;
          gap: 8px;

          white-space: nowrap;
        }


        .pillar-icon {
          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }


        .pillar-text {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;

          white-space: nowrap;
        }


        .pillar-divider {
          color: rgba(255, 255, 255, 0.4);

          font-size: 18px;

          flex-shrink: 0;
        }


        /* =====================================================
           FLOATING HINDI IMAGE & 3D SHINE ANIMATION
        ===================================================== */

        .script-text {
          position: absolute;
          right: 10px;
          bottom: 150%;
          transform: translateY(50%) rotate(-3deg);
          width: 260px;
          z-index: 20;
          pointer-events: none;
        }

        .coin-wrapper {
          position: relative;
          display: inline-block;
          width: 80%;
        }

        .coin-wrapper img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.18));
        }

        .shine-swipe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          -webkit-mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;
          pointer-events: none;
          z-index: 10;
        }

        /* The actual light beam */
        .shine-swipe::after {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: coinShine 15s infinite;
        }

        @keyframes coinShine {
          0% { left: -150%; }
          20% { left: 200%; }
          100% { left: 200%; } /* Pauses out of frame before repeating */
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1100px) {

          .hero-bottom-banner {
            padding: 12px 24px;
          }

          .pillars-container {
            gap: 12px;
          }

          .pillar-divider {
            display: none;
          }

          .pillar-text {
            font-size: 13px;
          }

          .script-text {
            width: 210px;
            right: 15px;
          }
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 768px) {

          .hero-bottom-banner {
            min-height: 90px;

            padding: 12px 20px;

            align-items: flex-start;
          }


          .pillars-container {
            width: 100%;

            flex-wrap: wrap;

            gap: 10px 18px;

            padding-right: 100px;
          }


          .pillar-text {
            font-size: 11px;
          }


          .script-text {
            width: 130px;

            right: 10px;

            bottom: 50%;

            transform:
              translateY(50%)
              rotate(-3deg);
          }
        }

      `}</style>
    </div>
  );
}
