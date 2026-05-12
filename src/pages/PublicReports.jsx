// src/pages/PublicReports.jsx
import React, { useEffect, useContext, useState } from "react";
import up_logo from "../assets/upgov_logo.jpg";
import TopNavigation from "./HeaderTopNav.jsx";
import GovHeader from "./GovHeader.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext";

import ReportHeader from "./PRComponents/ReportHeader.jsx";
import AnalyticsSection from "./PRComponents/AnalyticsSection.jsx";

// ================= MAIN PARENT COMPONENT =================
export default function PublicReports() {
  const { lang } = useContext(LanguageContext);

  // ADD STATE TO TRACK SELECTION
  const [currentReport, setCurrentReport] = useState({
    tab: "overview",
    subTab: null,
  });

  // Function to pass to ReportHeader
  const handleNavSelection = (tab, subTab) => {
    setCurrentReport({ tab, subTab });
  };

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= LANGUAGE CONTENT ================= */
  const content = {
    en: {
      title2: "Reports",
    },
    hi: {
      title2: "रिपोर्ट",
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="home-shell">
      {/* ================= HEADER ================= */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* ================= MAIN ================= */}
      <main className="page-main">
        <h1 className="page-title">
          <span className="contrast-color-two">{t.title1}</span>
          <span className="contrast-color-one"> {t.title2}</span>
        </h1>

        <div className="reports-container">
          <ReportHeader onSelectionChange={handleNavSelection} />
          <AnalyticsSection currentReport={currentReport} />
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`

        /* ===== ROOT ===== */
        .home-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(180deg,
            #ffffff 0%,
            #fff6f8 35%,
            #f9e3e6 60%,
            #f4cfd6 75%,
            #ebb8c4 100%);
        }

        :root {
          --font-scale: 1;
        }

        body {
          font-size: calc(16px * var(--font-scale));
        }

        /* ===== TYPOGRAPHY ===== */
        .contrast-color-one {
          color: #ff7a00;
        }

        .contrast-color-two {
          color: #0f172a;
        }

        .page-title {
          text-align: center;
          font-size: 38px;
          font-weight: 800;
          margin-top: 40px;
          margin-bottom: 20px;
        }

        /* ===== MAIN LAYOUT ===== */
        .page-main {
          flex: 1; /* Pushes footer to the bottom */
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .reports-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
          margin-bottom: 60px;
        }

        /* ===== PLACEHOLDER STYLES (To be removed later) ===== */
        .placeholder-box {
          padding: 40px;
          background: rgba(255, 255, 255, 0.6);
          border: 2px dashed #ff7a00;
          border-radius: 18px;
          text-align: center;
          color: #334155;
        }

        .placeholder-box h3 {
          margin-top: 0;
          color: #0f172a;
          font-size: 24px;
        }

        /* ===== FOOTER ===== */
        .home-footer {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          margin-top: auto;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .page-title {
            font-size: 30px;
          }
          
          .placeholder-box {
            padding: 20px;
          }
        }

      `}</style>
    </div>
  );
}
