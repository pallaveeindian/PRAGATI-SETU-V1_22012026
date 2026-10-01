// src/pages/PublicReports.jsx

import React, { useEffect, useContext, useState, useCallback } from "react";
import up_logo from "../assets/upgov_logo.jpg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext";
import ReportHeader from "./PRComponents/ReportHeader.jsx";
import AnalyticsSection from "./PRComponents/AnalyticsSection.jsx";

const content = {
  en: {
    title1: "Portal Activity",
    title2: "Reports",
    subtitle: "View and analyze Pragati Setu portal activity, progress, and performance reports.",
  },
  hi: {
    title1: "पोर्टल गतिविधि",
    title2: "रिपोर्ट",
    subtitle: "प्रगति सेतु पोर्टल की गतिविधि, प्रगति और प्रदर्शन रिपोर्ट देखें और विश्लेषण करें।",
  },
};

export default function PublicReports() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  const [currentReport, setCurrentReport] = useState({ tab: "overview", subTab: null });

  const handleNavSelection = useCallback((tab, subTab) => {
    setCurrentReport((prev) => {
      // avoid unnecessary state updates
      if (prev.tab === tab && prev.subTab === subTab) return prev;
      return { tab, subTab };
    });
  }, []);

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="public-reports-page">
      <GovHeader logo={up_logo} title="Government Of Uttar Pradesh" onFontChange={setFontScale} />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="reports-page-main">
        <section className="reports-title-section">
          <div className="reports-dots reports-dots-left"></div>
          <div className="reports-dots reports-dots-right"></div>

          <div className="reports-title-inner">
            <div className="reports-heading-line">
              <span></span>
              <span></span>
            </div>

            <h1 className="reports-page-title">
              <span className="reports-title-blue">{t.title1}</span>
              <span className="reports-title-orange"> {t.title2}</span>
            </h1>

            <p className="reports-page-subtitle">{t.subtitle}</p>
          </div>
        </section>

        <section className="reports-content-section">
          <div className="reports-container">
            <div className="reports-header-wrapper">
              <ReportHeader onSelectionChange={handleNavSelection} />
            </div>

            <div className="reports-analytics-wrapper">
              <AnalyticsSection currentReport={currentReport} />
            </div>
          </div>
        </section>
      </main>

      <footer className="reports-footer">
        <Footer />
      </footer>

      <style>{`
        .public-reports-page, .public-reports-page * {
          box-sizing: border-box;
        }
        :root { --font-scale: 1; }
        .public-reports-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          background: #fffaf7;
        }

        .reports-page-main {
          position: relative;
          flex: 1;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #fffaf7 24%, #fff5f0 55%, #fde8e4 100%);
        }

        /* title section */
        .reports-title-section {
          position: relative;
          width: 100%;
          padding: 34px 20px 28px;
          overflow: hidden;
          background: linear-gradient(110deg, #fffdfb 0%, #fff7f2 55%, #ffede1 100%);
          border-bottom: 1px solid #f2e3da;
        }
        .reports-title-inner {
          position: relative;
          z-index: 2;
          width: 92%;
          max-width: 1450px;
          margin: 0 auto;
          text-align: center;
        }

        .reports-heading-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .reports-heading-line span:first-child {
          width: 48px;
          height: 4px;
          border-radius: 10px;
          background: #ff5b0b;
        }
        .reports-heading-line span:last-child {
          width: 42px;
          height: 4px;
          border-radius: 10px;
          background: #ffdcca;
        }

        .reports-page-title {
          margin: 0 0 10px;
          font-size: calc(48px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.1;
        }
        .reports-title-blue { color: #07275d; }
        .reports-title-orange { color: #ff5b0b; }
        .reports-page-subtitle {
          max-width: 760px;
          margin: 0 auto;
          color: #536987;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.6;
        }

        .reports-dots {
          position: absolute;
          width: 130px;
          height: 100px;
          opacity: 0.25;
          pointer-events: none;
          background-image: radial-gradient(#ff9863 2px, transparent 2px);
          background-size: 14px 14px;
        }
        .reports-dots-left { left: 4%; top: 18px; }
        .reports-dots-right { right: 4%; bottom: 0; }

        /* content section */
        .reports-content-section {
          position: relative;
          width: 100%;
          padding: 28px 3% 60px;
        }
        .reports-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .reports-header-wrapper {
          width: 100%;
          position: relative;
          z-index: 3;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #eee5de;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(69, 47, 31, 0.07);
          overflow: visible;
        }

        .reports-analytics-wrapper {
          width: 100%;
          min-width: 0;
          position: relative;
          z-index: 2;
          padding: 18px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #eee7e2;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(59, 43, 32, 0.07);
          overflow-x: auto;
          overflow-y: visible;
        }

        /* keep header/analytics children from overflowing on small screens */
        .reports-header-wrapper > *, .reports-analytics-wrapper > * { max-width: 100%; }
        .reports-analytics-wrapper table { max-width: 100%; }
        .reports-analytics-wrapper img, .reports-analytics-wrapper svg, .reports-analytics-wrapper canvas { max-width: 100%; }

        .reports-footer {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .reports-title-inner, .reports-container { max-width: 1550px; }
          .reports-title-section { padding: 40px 20px 32px; }
          .reports-page-title { font-size: calc(54px * var(--font-scale, 1)); }
          .reports-page-subtitle { font-size: calc(16px * var(--font-scale, 1)); }
          .reports-content-section { padding-top: 32px; }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .reports-title-inner { width: 94%; }
          .reports-content-section { padding: 25px 2.5% 52px; }
          .reports-page-title { font-size: calc(43px * var(--font-scale, 1)); }
          .reports-page-subtitle { font-size: calc(14px * var(--font-scale, 1)); }
          .reports-analytics-wrapper { padding: 15px; }
        }

        /* 1024px small laptop */
        @media (max-width: 1024px) {
          .reports-title-section { padding: 30px 18px 24px; }
          .reports-page-title { font-size: calc(38px * var(--font-scale, 1)); }
          .reports-content-section { padding: 22px 18px 48px; }
          .reports-container { gap: 20px; }
          .reports-header-wrapper { border-radius: 15px; }
          .reports-analytics-wrapper {
            padding: 13px;
            border-radius: 16px;
          }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .reports-title-section { padding: 26px 16px 22px; }
          .reports-page-title { font-size: calc(35px * var(--font-scale, 1)); }
          .reports-page-subtitle {
            max-width: 650px;
            font-size: calc(13px * var(--font-scale, 1));
          }
          .reports-content-section { padding: 20px 14px 42px; }
          .reports-container { gap: 17px; }
          .reports-header-wrapper {
            overflow-x: auto;
            overflow-y: visible;
          }
          .reports-analytics-wrapper { width: 100%; overflow-x: auto; }
          .reports-dots { opacity: 0.18; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .reports-title-section { padding: 22px 10px 19px; }
          .reports-title-inner { width: 100%; }
          .reports-heading-line { margin-bottom: 9px; }
          .reports-heading-line span:first-child {
            width: 38px;
            height: 3px;
          }
          .reports-heading-line span:last-child {
            width: 31px;
            height: 3px;
          }
          .reports-page-title {
            margin-bottom: 8px;
            font-size: calc(30px * var(--font-scale, 1));
            line-height: 1.15;
          }
          .reports-page-subtitle {
            max-width: 95%;
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .reports-content-section { padding: 15px 9px 35px; }
          .reports-container { gap: 14px; }
          .reports-header-wrapper {
            width: 100%;
            border-radius: 12px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .reports-analytics-wrapper {
            width: 100%;
            padding: 9px;
            border-radius: 13px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          /* prevent long tables/charts from widening the whole page */
          .reports-header-wrapper > *, .reports-analytics-wrapper > * {
            min-width: 0;
            max-width: 100%;
          }
          .reports-dots-left { left: -30px; }
          .reports-dots-right { right: -35px; }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .reports-title-section { padding: 19px 8px 17px; }
          .reports-page-title { font-size: calc(26px * var(--font-scale, 1)); }
          .reports-page-subtitle { font-size: calc(11px * var(--font-scale, 1)); }
          .reports-content-section { padding: 12px 6px 30px; }
          .reports-header-wrapper { border-radius: 10px; }
          .reports-analytics-wrapper {
            padding: 6px;
            border-radius: 10px;
          }
          .reports-container { gap: 11px; }
        }
      `}</style>
    </div>
  );
}
