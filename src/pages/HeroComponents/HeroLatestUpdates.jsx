import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    heading: "Latest Updates & Announcements",
    viewAll: "View All",

    updates: [
      {
        id: 1,
        title: "Family ID Portal Registration – Important Notice",
        date: "21 Sep 2026",
        link: "#",
      },
      {
        id: 2,
        title: "New Training Calendar for FY 2026-27",
        date: "18 Sep 2026",
        link: "#",
      },
      {
        id: 3,
        title: "Guidelines for Lakhpati Didi Convergence",
        date: "12 Sep 2026",
        link: "#",
      },
      {
        id: 4,
        title: "Enterprise Sakhi App Now Live on Play Store",
        date: "05 Sep 2026",
        link: "#",
      },
    ],
  },

  hi: {
    heading: "नवीनतम अपडेट एवं घोषणाएँ",
    viewAll: "सभी देखें",

    updates: [
      {
        id: 1,
        title: "फैमिली आईडी पोर्टल पंजीकरण – महत्वपूर्ण सूचना",
        date: "21 सितम्बर 2026",
        link: "#",
      },
      {
        id: 2,
        title: "वित्तीय वर्ष 2026-27 के लिए नया प्रशिक्षण कैलेंडर",
        date: "18 सितम्बर 2026",
        link: "#",
      },
      {
        id: 3,
        title: "लखपति दीदी कन्वर्जेन्स के लिए दिशा-निर्देश",
        date: "12 सितम्बर 2026",
        link: "#",
      },
      {
        id: 4,
        title: "एंटरप्राइज सखी ऐप अब प्ले स्टोर पर उपलब्ध",
        date: "05 सितम्बर 2026",
        link: "#",
      },
    ],
  },
};

export default function LatestUpdates() {
  const { lang } = useContext(LanguageContext);

  const t = content[lang] || content.en;

  return (
    <section className="updates-section">

      <div className="updates-container">

        {/* ================= HEADER ================= */}

        <div className="updates-header">

          <div className="updates-heading-wrap">

            {/* Bell Icon */}
            <div className="bell-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2>
              {t.heading}
            </h2>

          </div>


          {/* VIEW ALL */}

          <a
            href="/updates"
            className="view-all-btn"
          >
            {t.viewAll}

            <span>
              →
            </span>
          </a>

        </div>


        {/* ================= UPDATES ================= */}

        <div className="updates-list">

          {t.updates.map((item) => (

            <a
              href={item.link}
              key={item.id}
              className="update-row"
            >

              {/* LEFT */}

              <div className="update-left">

                <div className="update-arrow">
                  ›
                </div>

                <span className="update-title">
                  {item.title}
                </span>

              </div>


              {/* DATE */}

              <time className="update-date">
                {item.date}
              </time>

            </a>

          ))}

        </div>

      </div>


      {/* ================= STYLES ================= */}

      <style>{`

        /* =========================================
           SECTION
        ========================================= */

        .updates-section {
          width: 100%;

          background: #efece9;

          padding:
            35px
            0;

          box-sizing: border-box;
        }


        .updates-container {
          width: 100%;

          max-width: 1500px;

          margin: 0 auto;

          padding:
            0
            30px;

          box-sizing: border-box;
        }


        /* =========================================
           HEADER
        ========================================= */

        .updates-header {
          width: 100%;

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 20px;

          margin-bottom: 18px;
        }


        .updates-heading-wrap {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 13px;
        }


        .bell-icon {
          width: 30px;

          height: 30px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #f97316;
          
        }


        .bell-icon svg {
          width: 28px;

          height: 28px;
        }


        .updates-heading-wrap h2 {
          margin: 0;

          color: #0f2748;

          font-size: 26px;

          font-weight: 800;

          line-height: 1.2;
        }


        /* =========================================
           VIEW ALL
        ========================================= */

        .view-all-btn {
          flex-shrink: 0;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          min-height: 42px;

          padding:
            8px
            18px;

          color: #f97316;

          background: #ffffff;

          border:
            1.5px solid
            #f97316;

          border-radius: 22px;

          text-decoration: none;

          font-size: 13px;

          font-weight: 700;

          white-space: nowrap;

          transition:
            background 0.25s ease,
            color 0.25s ease,
            gap 0.25s ease;
        }


        .view-all-btn:hover {
          color: #ffffff;

          background: #f97316;

          gap: 11px;
        }


        .view-all-btn span {
          font-size: 17px;

          line-height: 1;
        }


        /* =========================================
           LIST
        ========================================= */

        .updates-list {
          width: 100%;

          display: flex;

          flex-direction: column;

          gap: 7px;
        }


        /* =========================================
           UPDATE ROW
        ========================================= */

        .update-row {
          width: 100%;

          min-height: 47px;

          padding:
            9px
            18px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          box-sizing: border-box;

          background:
            linear-gradient(
              90deg,
              #f4f9fd 0%,
              #edf6fc 100%
            );

          border:
            1px solid
            #e5edf4;

          border-radius: 6px;

          text-decoration: none;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }


        .update-row:hover {
          background: #eaf5fc;

          transform: translateX(3px);

          box-shadow:
            0 4px 12px
            rgba(15, 39, 72, 0.06);
        }


        /* =========================================
           LEFT
        ========================================= */

        .update-left {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 12px;
        }


        .update-arrow {
          width: 22px;

          height: 22px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #f97316;

          font-size: 25px;

          font-weight: 800;

          line-height: 1;
        }


        .update-title {
          min-width: 0;

          color: #26496d;

          font-size: 14px;

          font-weight: 600;

          line-height: 1.35;
        }


        /* =========================================
           DATE
        ========================================= */

        .update-date {
          flex-shrink: 0;

          color: #475569;

          font-size: 13px;

          font-weight: 500;

          white-space: nowrap;
        }


        /* =========================================
           LARGE SCREEN - 1400+
        ========================================= */

        @media (min-width: 1400px) {

          .updates-container {
            max-width: 1600px;

            padding:
              0
              50px;
          }


          .updates-heading-wrap h2 {
            font-size: 28px;
          }


          .update-row {
            min-height: 50px;
          }


          .update-title {
            font-size: 14.5px;
          }


          .update-date {
            font-size: 13.5px;
          }

        }


        /* =========================================
           1200px
        ========================================= */

        @media (max-width: 1200px) {

          .updates-container {
            padding:
              0
              24px;
          }


          .updates-heading-wrap h2 {
            font-size: 24px;
          }


          .update-title {
            font-size: 13.5px;
          }

        }


        /* =========================================
           1024px
        ========================================= */

        @media (max-width: 1024px) {

          .updates-container {
            padding:
              0
              20px;
          }


          .updates-heading-wrap h2 {
            font-size: 23px;
          }


          .update-row {
            min-height: 45px;

            padding:
              8px
              15px;
          }

        }


        /* =========================================
           900px
        ========================================= */

        @media (max-width: 900px) {

          .updates-section {
            padding:
              30px
              0;
          }


          .updates-container {
            padding:
              0
              18px;
          }


          .updates-heading-wrap h2 {
            font-size: 22px;
          }


          .update-title {
            font-size: 13px;
          }

        }


        /* =========================================
           600px
        ========================================= */

        @media (max-width: 600px) {

          .updates-section {
            padding:
              25px
              0;
          }


          .updates-container {
            padding:
              0
              14px;
          }


          .updates-header {
            align-items: flex-start;

            gap: 12px;

            margin-bottom: 15px;
          }


          .updates-heading-wrap {
            gap: 8px;
          }


          .bell-icon {
            width: 25px;

            height: 25px;
          }


          .bell-icon svg {
            width: 23px;

            height: 23px;
          }


          .updates-heading-wrap h2 {
            font-size: 18px;
          }


          .view-all-btn {
            min-height: 35px;

            padding:
              6px
              12px;

            font-size: 11px;
          }


          .update-row {
            min-height: 44px;

            padding:
              9px
              11px;

            gap: 10px;
          }


          .update-left {
            gap: 7px;
          }


          .update-arrow {
            width: 18px;

            font-size: 21px;
          }


          .update-title {
            font-size: 12px;
          }


          .update-date {
            font-size: 10.5px;
          }

        }


        /* =========================================
           400px
        ========================================= */

        @media (max-width: 400px) {

          .updates-container {
            padding:
              0
              10px;
          }


          .updates-heading-wrap h2 {
            font-size: 16px;
          }


          .view-all-btn {
            padding:
              5px
              9px;

            font-size: 10px;
          }


          .update-row {
            align-items: flex-start;

            padding:
              9px
              10px;

            gap: 8px;
          }


          .update-title {
            font-size: 11px;
          }


          .update-date {
            font-size: 9.5px;
          }

        }

      `}</style>

    </section>
  );
}