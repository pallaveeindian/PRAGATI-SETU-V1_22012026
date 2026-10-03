// src/pages/PublicBMS/BMSFeatures.jsx

import React, { useContext } from "react";
import { FiUser, FiFileText, FiMonitor, FiUsers } from "react-icons/fi";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    headingOne: "Key Features of",
    headingTwo: "Beneficiary Profiling",
    cards: [
      { type: "pink", icon: "profile", title: "Beneficiary Registration & Profiling", description: "Digital onboarding and profiling of beneficiaries with detailed socio-economic information." },
      { type: "purple", icon: "scheme", title: "Scheme Mapping", description: "Mapping of beneficiaries with relevant livelihood schemes and interventions." },
      { type: "green", icon: "monitor", title: "Monitoring & Tracking", description: "Real-time tracking of beneficiary progress and scheme benefits across districts and villages." },
      { type: "orange", icon: "users", title: "Improved Service Delivery", description: "Ensures targeted support, better resource utilization, and enhanced impact on rural livelihoods." },
    ],
  },
  hi: {
    headingOne: "लाभार्थी प्रोफाइलिंग की",
    headingTwo: "मुख्य विशेषताएं",
    cards: [
      { type: "pink", icon: "profile", title: "लाभार्थी पंजीकरण एवं प्रोफाइलिंग", description: "लाभार्थियों की विस्तृत सामाजिक-आर्थिक जानकारी के साथ डिजिटल पंजीकरण और प्रोफाइलिंग।" },
      { type: "purple", icon: "scheme", title: "योजना मैपिंग", description: "लाभार्थियों को संबंधित आजीविका योजनाओं और हस्तक्षेपों से जोड़ना।" },
      { type: "green", icon: "monitor", title: "निगरानी एवं ट्रैकिंग", description: "जिलों और गांवों में लाभार्थियों की प्रगति और योजना लाभों की वास्तविक समय में निगरानी।" },
      { type: "orange", icon: "users", title: "बेहतर सेवा वितरण", description: "लक्षित सहायता, बेहतर संसाधन उपयोग और ग्रामीण आजीविका पर अधिक प्रभाव सुनिश्चित करता है।" },
    ],
  },
};

const ICONS = { scheme: <FiFileText />, monitor: <FiMonitor />, users: <FiUsers /> };
const getIcon = (icon) => ICONS[icon] || <FiUser />;

export default function BMSFeatures() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section id="bms-features" className="bms-features">
      <div className="bms-features-container">
        <div className="bms-features-heading">
          <span className="bms-features-line"></span>
          <h2>
            <span className="bms-features-heading-blue">{t.headingOne}</span> <span className="bms-features-heading-orange">{t.headingTwo}</span>
          </h2>
        </div>

        <div className="bms-features-grid">
          {t.cards.map((card, index) => (
            <article className={`bms-feature-card bms-feature-card-${card.type}`} key={`${card.title}-${index}`}>
              <div className="bms-feature-icon-wrap">
                <div className="bms-feature-icon">{getIcon(card.icon)}</div>
              </div>

              <div className="bms-feature-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="bms-features-decoration bms-features-decoration-left"></div>
      <div className="bms-features-decoration bms-features-decoration-right"></div>

      <style>{`
        .bms-features, .bms-features * {
          box-sizing: border-box;
        }

        .bms-features {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 14px 0 22px;
          background: linear-gradient(110deg, #fffaf8 0%, #fff7f4 48%, #fff4ef 100%);
        }

        .bms-features-container {
          position: relative;
          z-index: 2;
          width: 86%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .bms-features-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 9px;
        }
        .bms-features-line {
          width: 38px;
          height: 3px;
          flex-shrink: 0;
          border-radius: 20px;
          background: #ff5207;
        }
        .bms-features-heading h2 {
          margin: 0;
          font-size: calc(22px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.2;
        }
        .bms-features-heading-blue { color: #082c5a; }
        .bms-features-heading-orange { color: #ff5207; }

        .bms-features-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        /* per-color theme tokens — each card type sets these once, the
           shared rules below read them so the border/gradient/shadow/icon
           declarations aren't repeated per color */
        .bms-feature-card-pink {
          --card-border: #f5a7bd;
          --card-bg-a: #fff7fa;
          --card-bg-b: #fdebf1;
          --card-shadow-rgb: 235, 58, 111;
          --icon-bg-a: #ffd7e3;
          --icon-bg-b: #ffc0d2;
          --icon-color: #f01455;
          --title-color: #ed174e;
        }
        .bms-feature-card-purple {
          --card-border: #c8afff;
          --card-bg-a: #fbf8ff;
          --card-bg-b: #f0e8ff;
          --card-shadow-rgb: 102, 46, 240;
          --icon-bg-a: #e9dbff;
          --icon-bg-b: #d7beff;
          --icon-color: #5e18e8;
          --title-color: #3511bf;
        }
        .bms-feature-card-green {
          --card-border: #99e7bc;
          --card-bg-a: #f5fff9;
          --card-bg-b: #e6faef;
          --card-shadow-rgb: 17, 181, 83;
          --icon-bg-a: #d3ffe4;
          --icon-bg-b: #b9f6d1;
          --icon-color: #08b84f;
          --title-color: #082c5a;
        }
        .bms-feature-card-orange {
          --card-border: #f7b892;
          --card-bg-a: #fffaf7;
          --card-bg-b: #fff0e7;
          --card-shadow-rgb: 255, 91, 11;
          --icon-bg-a: #ffe4d1;
          --icon-bg-b: #ffd0b3;
          --icon-color: #ff580b;
          --title-color: #082c5a;
        }

        .bms-feature-card {
          position: relative;
          min-width: 0;
          min-height: 130px;
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          padding: 13px 15px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: linear-gradient(135deg, var(--card-bg-a) 0%, var(--card-bg-b) 100%);
          box-shadow: 0 5px 14px rgba(var(--card-shadow-rgb), 0.08);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .bms-feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(var(--card-shadow-rgb), 0.15);
        }

        .bms-feature-icon-wrap {
          width: 68px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          justify-self: center;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--icon-bg-a), var(--icon-bg-b));
        }
        .bms-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--icon-color);
          font-size: 37px;
          stroke-width: 2.5;
        }

        .bms-feature-content { min-width: 0; }
        .bms-feature-content h3 {
          margin: 0 0 7px;
          color: var(--title-color);
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.23;
        }
        .bms-feature-content p {
          margin: 0;
          color: #536b89;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.42;
        }

        .bms-features-decoration {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          opacity: 0.16;
        }
        .bms-features-decoration-left {
          left: -100px;
          top: 10px;
          width: 230px;
          height: 230px;
          background: #ffd7c2;
        }
        .bms-features-decoration-right {
          right: -90px;
          bottom: -110px;
          width: 250px;
          height: 250px;
          background: #ffddcd;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .bms-features-container { max-width: 1560px; }
          .bms-features-heading h2 { font-size: calc(24px * var(--font-scale, 1)); }
          .bms-feature-card {
            min-height: 136px;
            grid-template-columns: 90px minmax(0, 1fr);
            padding: 14px 17px;
          }
          .bms-feature-icon-wrap { width: 74px; height: 74px; }
          .bms-feature-icon { font-size: 40px; }
          .bms-feature-content h3 { font-size: calc(16px * var(--font-scale, 1)); }
          .bms-feature-content p { font-size: calc(13px * var(--font-scale, 1)); }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .bms-features-container { width: 90%; }
          .bms-features-grid { gap: 10px; }
          .bms-feature-card {
            min-height: 125px;
            grid-template-columns: 72px minmax(0, 1fr);
            gap: 8px;
            padding: 12px 11px;
          }
          .bms-feature-icon-wrap { width: 62px; height: 62px; }
          .bms-feature-icon { font-size: 33px; }
          .bms-feature-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-feature-content p { font-size: calc(10.5px * var(--font-scale, 1)); }
        }

        /* 1024px — two cards per row */
        @media (max-width: 1024px) {
          .bms-features-container { width: 92%; }
          .bms-features-heading h2 { font-size: calc(20px * var(--font-scale, 1)); }
          .bms-features-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 11px;
          }
          .bms-feature-card {
            min-height: 118px;
            grid-template-columns: 76px minmax(0, 1fr);
            padding: 12px 14px;
          }
          .bms-feature-icon-wrap { width: 65px; height: 65px; }
          .bms-feature-icon { font-size: 35px; }
          .bms-feature-content h3 { font-size: calc(14px * var(--font-scale, 1)); }
          .bms-feature-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .bms-features { padding: 18px 0 24px; }
          .bms-features-container { width: 92%; }
          .bms-features-heading {
            justify-content: center;
            margin-bottom: 14px;
          }
          .bms-features-heading h2 { font-size: calc(22px * var(--font-scale, 1)); }
          .bms-features-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .bms-feature-card { min-height: 120px; }
        }

        /* 600px mobile — one card per row */
        @media (max-width: 600px) {
          .bms-features { padding: 18px 0 22px; }
          .bms-features-container { width: calc(100% - 24px); }
          .bms-features-heading {
            justify-content: flex-start;
            align-items: flex-start;
            gap: 9px;
          }
          .bms-features-line {
            width: 28px;
            margin-top: 12px;
          }
          .bms-features-heading h2 { font-size: calc(20px * var(--font-scale, 1)); }
          .bms-features-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .bms-feature-card {
            min-height: 105px;
            grid-template-columns: 70px minmax(0, 1fr);
            gap: 10px;
            padding: 12px 13px;
          }
          .bms-feature-icon-wrap { width: 60px; height: 60px; }
          .bms-feature-icon { font-size: 32px; }
          .bms-feature-content h3 {
            margin-bottom: 5px;
            font-size: calc(14px * var(--font-scale, 1));
          }
          .bms-feature-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .bms-features-container { width: calc(100% - 18px); }
          .bms-features-heading h2 { font-size: calc(18px * var(--font-scale, 1)); }
          .bms-feature-card {
            min-height: 0;
            grid-template-columns: 58px minmax(0, 1fr);
            padding: 11px 9px;
          }
          .bms-feature-icon-wrap { width: 52px; height: 52px; }
          .bms-feature-icon { font-size: 28px; }
          .bms-feature-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-feature-content p { font-size: calc(10px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
