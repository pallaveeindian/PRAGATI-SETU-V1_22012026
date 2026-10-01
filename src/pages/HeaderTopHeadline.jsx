// src/pages/HeaderTopHeadline.jsx

import React from "react";

const HEADLINES = [
    `Pragati Setu Portal में आपका स्वागत है।`,

    `⚙️ तकनीकी समस्या होने पर कृपया होमपेज पर उपलब्ध "Complaint & Support" अनुभाग में अपनी शिकायत दर्ज करें।`,

    `📖 पोर्टल के संचालन संबंधी किसी भी जानकारी के लिए कृपया Pragati Setu Resource Centre में उपलब्ध User Manuals देखें।`,

    `🙏 आपके सहयोग के लिए धन्यवाद।`,

    `Welcome to the Pragati Setu Portal.`,

    `⚙️ In case of any technical issue, please register your grievance using the Complaint & Support section on the homepage.`,

    `📖 For any guidance regarding the portal, please refer to the User Manuals available in the Pragati Setu Resource Centre.`,

    `🙏 Thank you for your support.`,
];


export default function HeaderTopHeadline() {
    return (
        <div className="headline-bar">

            {/* LEFT LABEL */}

            <div className="headline-label">
                <span className="headline-dot"></span>
                <span>Latest Updates</span>
            </div>


            {/* MARQUEE AREA */}

            <div className="headline-marquee">

                <div className="headline-track">

                    {/* FIRST COPY */}

                    {HEADLINES.map((headline, index) => (
                        <React.Fragment key={`first-${index}`}>

                            <span className="headline-item">
                                {headline}
                            </span>

                            <span className="headline-separator">
                                ●
                            </span>

                        </React.Fragment>
                    ))}


                    {/* SECOND COPY FOR SMOOTH LOOP */}

                    {HEADLINES.map((headline, index) => (
                        <React.Fragment key={`second-${index}`}>

                            <span className="headline-item">
                                {headline}
                            </span>

                            <span className="headline-separator">
                                ●
                            </span>

                        </React.Fragment>
                    ))}

                </div>

            </div>


            <style>{`

        /* =========================================
           MAIN BAR
        ========================================= */

        .headline-bar {
          width: 100%;

          min-height: 38px;

          display: flex;

          align-items: center;

          overflow: hidden;

        //   background: #fff7f2;
        background: #f6f6ee;

          border-bottom: 1px solid #f3d8c8;
        // border-bottom: 1px solid #f9630c;

          font-family: inherit;
        }


        /* =========================================
           LEFT LABEL
        ========================================= */

        .headline-label {
          position: relative;

          z-index: 3;

          height: 38px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          gap: 8px;

          padding: 0 20px;

          background: #ff5b0b;

          color: #ffffff;

          font-size: 12px;

          font-weight: 800;

          white-space: nowrap;

          box-shadow:
            5px 0 12px
            rgba(255, 91, 11, 0.12);
        }


        .headline-dot {
          width: 7px;
          height: 7px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #ffffff;

          animation:
            headlinePulse
            1.5s
            infinite;
        }


        @keyframes headlinePulse {

          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.4;
          }

        }


        /* =========================================
           MARQUEE WRAPPER
        ========================================= */

        .headline-marquee {
          position: relative;

          flex: 1;

          min-width: 0;

          overflow: hidden;
        }


        /* SOFT LEFT/RIGHT EDGE */

        .headline-marquee::before,
        .headline-marquee::after {
          content: "";

          position: absolute;

          z-index: 2;

          top: 0;
          bottom: 0;

          width: 35px;

          pointer-events: none;
        }


        .headline-marquee::before {
          left: 0;

          background:
            linear-gradient(
              90deg,
              #fff7f2,
              transparent
            );
        }


        .headline-marquee::after {
          right: 0;

          background:
            linear-gradient(
              270deg,
              #fff7f2,
              transparent
            );
        }


        /* =========================================
           MOVING TRACK
        ========================================= */

        .headline-track {
          width: max-content;

          display: flex;

          align-items: center;

          white-space: nowrap;

          animation:
            headlineScroll
            85s
            linear
            infinite;

          will-change: transform;
        }


        .headline-marquee:hover
        .headline-track {
          animation-play-state: paused;
        }


        @keyframes headlineScroll {

          from {
            transform:
              translateX(0);
          }

          to {
            transform:
              translateX(-50%);
          }

        }


        /* =========================================
           HEADLINE
        ========================================= */

        .headline-item {
          display: inline-flex;

          align-items: center;

          min-height: 38px;

          padding: 0 16px;

          color: #28364a;

          font-size: 12px;

          font-weight: 600;

          line-height: 1.4;
        }


        .headline-separator {
          color: #ff5b0b;

          font-size: 6px;

          opacity: 0.9;
        }


        /* =========================================
           1400px+
        ========================================= */

        @media (min-width: 1400px) {

          .headline-bar,
          .headline-label {
            min-height: 40px;
            height: 40px;
          }


          .headline-label {
            padding: 0 24px;

            font-size: 12.5px;
          }


          .headline-item {
            min-height: 40px;

            font-size: 12.5px;

            padding: 0 18px;
          }

        }


        /* =========================================
           1200px
        ========================================= */

        @media (max-width: 1200px) {

          .headline-label {
            padding: 0 17px;
          }


          .headline-item {
            font-size: 11.5px;
          }

        }


        /* =========================================
           1024px
        ========================================= */

        @media (max-width: 1024px) {

          .headline-label {
            padding: 0 14px;

            font-size: 11px;
          }


          .headline-item {
            padding: 0 13px;

            font-size: 11px;
          }

        }


        /* =========================================
           900px
        ========================================= */

        @media (max-width: 900px) {

          .headline-bar {
            min-height: 36px;
          }


          .headline-label {
            height: 36px;

            padding: 0 12px;

            font-size: 10.5px;
          }


          .headline-item {
            min-height: 36px;

            font-size: 10.5px;
          }


          .headline-track {
            animation-duration: 75s;
          }

        }


        /* =========================================
           600px
        ========================================= */

        @media (max-width: 600px) {

          .headline-label {
            padding: 0 9px;

            font-size: 9px;
          }


          .headline-label span:last-child {
            display: none;
          }


          .headline-dot {
            width: 8px;
            height: 8px;
          }


          .headline-item {
            padding: 0 10px;

            font-size: 10px;
          }


          .headline-track {
            animation-duration: 70s;
          }

        }


        /* =========================================
           400px
        ========================================= */

        @media (max-width: 400px) {

          .headline-bar {
            min-height: 34px;
          }


          .headline-label {
            width: 25px;
            height: 34px;

            justify-content: center;

            padding: 0;
          }


          .headline-item {
            min-height: 34px;

            padding: 0 8px;

            font-size: 9px;
          }


          .headline-track {
            animation-duration: 65s;
          }

        }

      `}</style>

        </div>
    );
}