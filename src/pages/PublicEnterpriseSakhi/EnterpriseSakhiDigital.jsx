// src/pages/EnterpriseSakhi/EnterpriseSakhiDigital.jsx

import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../LanguageContext.jsx";
import upLogo from "../../assets/upgov_logo.jpg";
import GovHeader from "../GovHeader.jsx";
import TopNavigation from "../HeaderTopNav.jsx";
import HeaderTopMenu from "../HeaderTopMenu.jsx";
import HeaderTopHeadline from "../HeaderTopHeadline.jsx";
import Footer from "../../components/layout/Footer.jsx";
import AndroidAppSection from "./AndroidAppSection.jsx";
import WebPortalSection from "./WebPortalSection.jsx";
import { FaAndroid, FaGlobe } from "react-icons/fa";

const content = {
  en: {
    eyebrow: "ENTERPRISE SAKHI DIGITAL ECOSYSTEM",
    title1: "One Platform.",
    title2: "Two Digital Experiences.",
    description:
      "Supporting rural women entrepreneurs through mobile-based field data collection and centralized enterprise management.",
    android: "Android App",
    web: "Web Portal",
  },
  hi: {
    eyebrow: "एंटरप्राइज सखी डिजिटल इकोसिस्टम",
    title1: "एक प्लेटफॉर्म।",
    title2: "दो डिजिटल अनुभव।",
    description:
      "मोबाइल आधारित फील्ड डेटा संग्रह और केंद्रीकृत उद्यम प्रबंधन के माध्यम से ग्रामीण महिला उद्यमियों को सशक्त बनाना।",
    android: "एंड्रॉयड ऐप",
    web: "वेब पोर्टल",
  },
};

// tab key, icon, content label key, and the section each tab renders
const TABS = [
  {
    key: "android",
    icon: <FaAndroid />,
    labelKey: "android",
    Section: AndroidAppSection,
  },
  { key: "web", icon: <FaGlobe />, labelKey: "web", Section: WebPortalSection },
];

export default function EnterpriseSakhiDigital() {
  const { lang } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("android");
  const t = content[lang] || content.en;

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  const ActiveSection = TABS.find((tab) => tab.key === activeTab)?.Section;

  return (
    <div className="enterprise-sakhi-page">
      <GovHeader
        logo={upLogo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="enterprise-sakhi-main">
        <div className="enterprise-sakhi-container">
          <header className="enterprise-sakhi-heading">
            <span className="enterprise-top-line"></span>
            <div className="enterprise-eyebrow">{t.eyebrow}</div>
            <h1>
              <span className="enterprise-title-blue">{t.title1}</span>{" "}
              <span className="enterprise-title-orange">{t.title2}</span>
            </h1>
            <p className="enterprise-intro">{t.description}</p>
          </header>

          <div className="enterprise-switcher">
            {TABS.map(({ key, icon, labelKey }) => (
              <button
                type="button"
                key={key}
                className={`enterprise-switch-button ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {icon}
                <span>{t[labelKey]}</span>
              </button>
            ))}
          </div>

          <div className="enterprise-dynamic-section">
            {ActiveSection && <ActiveSection />}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .enterprise-sakhi-page, .enterprise-sakhi-page * {
          box-sizing: border-box;
        }
        :root { --font-scale: 1; }

        .enterprise-sakhi-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #ffffff;
        }

        .enterprise-sakhi-main {
          position: relative;
          width: 100%;
          padding: 35px 0 60px;
          overflow: hidden;
          background: radial-gradient(circle at 94% 10%, rgba(255, 208, 184, 0.38), transparent 30%), linear-gradient(180deg, #fffdfc 0%, #fff9f7 45%, #ffe9e8 100%);
        }
        /* large soft right circle */
        .enterprise-sakhi-main::before {
          content: "";
          position: absolute;
          z-index: 0;
          width: 620px;
          height: 620px;
          top: -250px;
          right: -190px;
          border-radius: 50%;
          border: 80px solid rgba(255, 220, 202, 0.24);
          pointer-events: none;
        }
        /* bottom decorative wave */
        .enterprise-sakhi-main::after {
          content: "";
          position: absolute;
          z-index: 0;
          left: -9%;
          bottom: -320px;
          width: 75%;
          height: 480px;
          border-radius: 50% 50% 0 0;
          background: linear-gradient(135deg, rgba(255, 128, 62, 0.36), rgba(255, 188, 160, 0.08));
          transform: rotate(8deg);
          pointer-events: none;
        }

        .enterprise-sakhi-container {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0 auto;
        }

        .enterprise-sakhi-heading {
          width: 92%;
          max-width: 1000px;
          margin: 0 auto 27px;
          text-align: center;
        }
        .enterprise-top-line {
          display: block;
          width: 50px;
          height: 5px;
          margin: 0 auto 14px;
          border-radius: 20px;
          background: #ff5b0b;
        }
        .enterprise-eyebrow {
          margin-bottom: 10px;
          color: #ff5b0b;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 900;
          letter-spacing: 1.7px;
        }
        .enterprise-sakhi-heading h1 {
          margin: 0 0 11px;
          font-size: calc(43px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -0.7px;
        }
        .enterprise-title-blue { color: #07275d; }
        .enterprise-title-orange { color: #ff5b0b; }
        .enterprise-intro {
          max-width: 800px;
          margin: 0 auto;
          color: #536987;
          font-size: calc(16px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.55;
        }

        .enterprise-switcher {
          position: relative;
          z-index: 5;
          width: min(510px, calc(100% - 30px));
          min-height: 55px;
          margin: 0 auto 18px;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #ffffff;
          border: 1px solid rgba(237, 229, 225, 0.8);
          border-radius: 32px;
          box-shadow: 0 8px 24px rgba(165, 75, 29, 0.15);
          overflow: hidden;
        }
        .enterprise-switch-button {
          width: 100%;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 25px;
          border: none;
          border-radius: 30px;
          background: transparent;
          color: #586983;
          font-family: inherit;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 800;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .enterprise-switch-button svg { font-size: 23px; }
        .enterprise-switch-button.active {
          background: linear-gradient(135deg, #ff4f00 0%, #ff7416 100%);
          color: #ffffff;
          box-shadow: 0 8px 18px rgba(255, 91, 11, 0.27);
        }

        .enterprise-dynamic-section {
          position: relative;
          z-index: 3;
          width: 100%;
          animation: enterpriseFade 0.35s ease;
        }
        @keyframes enterpriseFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* child sections currently have width: 94% — keep them centered */
        .enterprise-dynamic-section > section {
          margin-left: auto;
          margin-right: auto;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .enterprise-sakhi-main { padding: 38px 0 65px; }
          .enterprise-sakhi-heading { max-width: 1050px; }
          .enterprise-sakhi-heading h1 { font-size: calc(46px * var(--font-scale, 1)); }
          .enterprise-intro {
            max-width: 840px;
            font-size: calc(17px * var(--font-scale, 1));
          }
          .enterprise-switcher { width: 520px; min-height: 56px; }
          .enterprise-switch-button {
            height: 56px;
            font-size: calc(15px * var(--font-scale, 1));
          }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .enterprise-sakhi-main { padding-top: 32px; }
          .enterprise-sakhi-heading { width: 94%; }
          .enterprise-sakhi-heading h1 { font-size: calc(39px * var(--font-scale, 1)); }
          .enterprise-intro { font-size: calc(15px * var(--font-scale, 1)); }
        }

        /* 1024px small laptop */
        @media (max-width: 1024px) {
          .enterprise-sakhi-main { padding: 30px 0 50px; }
          .enterprise-sakhi-heading h1 { font-size: calc(35px * var(--font-scale, 1)); }
          .enterprise-eyebrow { font-size: calc(11.5px * var(--font-scale, 1)); }
          .enterprise-intro {
            max-width: 720px;
            font-size: calc(14px * var(--font-scale, 1));
          }
          .enterprise-switcher { width: 470px; }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .enterprise-sakhi-main { padding: 27px 0 45px; }
          .enterprise-sakhi-heading { margin-bottom: 22px; }
          .enterprise-sakhi-heading h1 { font-size: calc(33px * var(--font-scale, 1)); }
          .enterprise-intro { max-width: 650px; }
          .enterprise-switcher { width: 450px; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .enterprise-sakhi-main { padding: 22px 0 35px; }
          .enterprise-sakhi-heading {
            width: calc(100% - 28px);
            margin-bottom: 20px;
          }
          .enterprise-top-line {
            width: 42px;
            height: 4px;
            margin-bottom: 11px;
          }
          .enterprise-eyebrow {
            font-size: calc(9.5px * var(--font-scale, 1));
            letter-spacing: 1.2px;
          }
          .enterprise-sakhi-heading h1 {
            font-size: calc(29px * var(--font-scale, 1));
            line-height: 1.15;
          }
          .enterprise-intro {
            font-size: calc(12.5px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .enterprise-switcher {
            width: calc(100% - 28px);
            min-height: 48px;
            border-radius: 27px;
          }
          .enterprise-switch-button {
            height: 48px;
            gap: 8px;
            padding: 0 12px;
            border-radius: 26px;
            font-size: calc(11.5px * var(--font-scale, 1));
          }
          .enterprise-switch-button svg { font-size: 18px; }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .enterprise-sakhi-heading { width: calc(100% - 20px); }
          .enterprise-sakhi-heading h1 { font-size: calc(26px * var(--font-scale, 1)); }
          .enterprise-intro { font-size: calc(11.5px * var(--font-scale, 1)); }
          .enterprise-switcher { width: calc(100% - 18px); }
          .enterprise-switch-button {
            gap: 6px;
            padding: 0 8px;
            font-size: calc(10.5px * var(--font-scale, 1));
          }
          .enterprise-switch-button svg { font-size: 17px; }
        }
      `}</style>
    </div>
  );
}
