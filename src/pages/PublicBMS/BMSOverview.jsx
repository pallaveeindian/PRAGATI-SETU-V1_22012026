// src/pages/PublicBMS/BMSOverview.jsx

import React, { useContext } from "react";
import { FiDatabase, FiShield, FiBarChart2 } from "react-icons/fi";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    headingOne: "Overview of",
    headingTwo: "Beneficiary Profiling",
    cards: [
      { type: "orange", title: "Centralized Beneficiary Database", description: "Maintains accurate and up-to-date beneficiary information across all rural livelihood schemes and programmes.", icon: "database" },
      { type: "blue", title: "Transparent & Efficient System", description: "Helps in streamlined data management, reduces duplication, and ensures transparency in scheme implementation.", icon: "shield" },
      { type: "green", title: "Data-Driven Decision Making", description: "Provides real-time insights to support effective planning, monitoring, and evidence-based decision making.", icon: "analytics" },
    ],
  },
  hi: {
    headingOne: "लाभार्थी प्रोफाइलिंग का",
    headingTwo: "अवलोकन",
    cards: [
      { type: "orange", title: "केंद्रीकृत लाभार्थी डेटाबेस", description: "सभी ग्रामीण आजीविका योजनाओं और कार्यक्रमों में लाभार्थियों की सटीक और अद्यतन जानकारी का प्रबंधन करता है।", icon: "database" },
      { type: "blue", title: "पारदर्शी एवं कुशल प्रणाली", description: "डेटा प्रबंधन को सुव्यवस्थित करने, दोहराव कम करने और योजना क्रियान्वयन में पारदर्शिता सुनिश्चित करने में सहायता करता है।", icon: "shield" },
      { type: "green", title: "डेटा आधारित निर्णय", description: "प्रभावी योजना, निगरानी और प्रमाण-आधारित निर्णय लेने के लिए वास्तविक समय की जानकारी उपलब्ध कराता है।", icon: "analytics" },
    ],
  },
};

const ICONS = { shield: <FiShield />, analytics: <FiBarChart2 /> };
const getIcon = (icon) => ICONS[icon] || <FiDatabase />;

export default function BMSOverview() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section id="bms-overview" className="bms-overview">
      <div className="bms-overview-container">
        <div className="bms-overview-heading">
          <span className="bms-overview-line"></span>
          <h2>
            <span className="bms-overview-heading-blue">{t.headingOne}</span> <span className="bms-overview-heading-orange">{t.headingTwo}</span>
          </h2>
        </div>

        <div className="bms-overview-grid">
          {t.cards.map((card, index) => (
            <article className={`bms-overview-card bms-overview-card-${card.type}`} key={`${card.title}-${index}`}>
              <div className={`bms-overview-icon-wrap bms-overview-icon-${card.type}`}>
                <div className="bms-overview-icon">{getIcon(card.icon)}</div>
              </div>

              <div className="bms-overview-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="bms-overview-decoration bms-overview-decoration-left"></div>
      <div className="bms-overview-decoration bms-overview-decoration-right"></div>

      <style>{`
        .bms-overview, .bms-overview * {
          box-sizing: border-box;
        }

        .bms-overview {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 14px 0 22px;
          background: linear-gradient(110deg, #fffdfb 0%, #fff9f6 55%, #fff4ef 100%);
        }

        .bms-overview-container {
          position: relative;
          z-index: 2;
          width: 86%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .bms-overview-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .bms-overview-line {
          width: 38px;
          height: 3px;
          flex-shrink: 0;
          border-radius: 20px;
          background: #ff5207;
        }
        .bms-overview-heading h2 {
          margin: 0;
          font-size: calc(22px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.2;
        }
        .bms-overview-heading-blue { color: #082c5a; }
        .bms-overview-heading-orange { color: #ff5207; }

        .bms-overview-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .bms-overview-card {
          position: relative;
          min-width: 0;
          min-height: 122px;
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          padding: 14px 18px 14px 14px;
          border-radius: 10px;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .bms-overview-card:hover { transform: translateY(-3px); }

        .bms-overview-card-orange {
          border: 1px solid #ffb481;
          background: linear-gradient(135deg, #fffdfb 0%, #fff5ec 100%);
          box-shadow: 0 5px 15px rgba(255, 111, 30, 0.08);
        }
        .bms-overview-card-orange:hover { box-shadow: 0 8px 20px rgba(255, 111, 30, 0.15); }

        .bms-overview-card-blue {
          border: 1px solid #8fc9f5;
          background: linear-gradient(135deg, #f8fcff 0%, #eaf6ff 100%);
          box-shadow: 0 5px 15px rgba(34, 142, 220, 0.08);
        }
        .bms-overview-card-blue:hover { box-shadow: 0 8px 20px rgba(34, 142, 220, 0.15); }

        .bms-overview-card-green {
          border: 1px solid #8ce1ad;
          background: linear-gradient(135deg, #f6fff9 0%, #e8faef 100%);
          box-shadow: 0 5px 15px rgba(34, 197, 94, 0.08);
        }
        .bms-overview-card-green:hover { box-shadow: 0 8px 20px rgba(34, 197, 94, 0.15); }

        .bms-overview-icon-wrap {
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          justify-self: center;
          border-radius: 50%;
        }
        .bms-overview-icon-orange { background: linear-gradient(135deg, #fff0e2, #ffe0c3); }
        .bms-overview-icon-blue { background: linear-gradient(135deg, #dbf1ff, #bce4ff); }
        .bms-overview-icon-green { background: linear-gradient(135deg, #d7ffe6, #baf5d1); }

        .bms-overview-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 46px;
        }
        .bms-overview-icon-orange .bms-overview-icon { color: #ff5709; }
        .bms-overview-icon-blue .bms-overview-icon { color: #1d8ff0; }
        .bms-overview-icon-green .bms-overview-icon { color: #06b94f; }

        .bms-overview-card-content { min-width: 0; }
        .bms-overview-card-content h3 {
          margin: 0 0 7px;
          color: #082c5a;
          font-size: calc(16px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.25;
        }
        .bms-overview-card-content p {
          margin: 0;
          color: #536b89;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.42;
        }

        .bms-overview-decoration {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          opacity: 0.18;
        }
        .bms-overview-decoration-left {
          left: -80px;
          bottom: -100px;
          width: 200px;
          height: 200px;
          background: #ffd7c2;
        }
        .bms-overview-decoration-right {
          right: -80px;
          top: 20px;
          width: 220px;
          height: 220px;
          background: #ffe2d5;
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .bms-overview-container {
            width: 86%;
            max-width: 1560px;
          }
          .bms-overview-heading h2 { font-size: calc(24px * var(--font-scale, 1)); }
          .bms-overview-card {
            min-height: 128px;
            grid-template-columns: 105px minmax(0, 1fr);
            padding: 15px 20px 15px 15px;
          }
          .bms-overview-icon-wrap { width: 86px; height: 86px; }
          .bms-overview-icon { font-size: 48px; }
          .bms-overview-card-content h3 { font-size: calc(17px * var(--font-scale, 1)); }
          .bms-overview-card-content p { font-size: calc(14px * var(--font-scale, 1)); }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .bms-overview-container { width: 90%; }
          .bms-overview-card {
            min-height: 120px;
            grid-template-columns: 86px minmax(0, 1fr);
            padding: 12px 14px;
          }
          .bms-overview-icon-wrap { width: 72px; height: 72px; }
          .bms-overview-icon { font-size: 39px; }
          .bms-overview-card-content h3 { font-size: calc(14px * var(--font-scale, 1)); }
          .bms-overview-card-content p { font-size: calc(12px * var(--font-scale, 1)); }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .bms-overview { padding: 16px 0 22px; }
          .bms-overview-container { width: 92%; }
          .bms-overview-heading h2 { font-size: calc(20px * var(--font-scale, 1)); }
          .bms-overview-grid { gap: 10px; }
          .bms-overview-card {
            grid-template-columns: 70px minmax(0, 1fr);
            gap: 8px;
            padding: 12px 10px;
          }
          .bms-overview-icon-wrap { width: 62px; height: 62px; }
          .bms-overview-icon { font-size: 34px; }
          .bms-overview-card-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-overview-card-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .bms-overview-container { width: 92%; }
          .bms-overview-heading {
            justify-content: center;
            margin-bottom: 14px;
          }
          .bms-overview-heading h2 { font-size: calc(22px * var(--font-scale, 1)); }
          .bms-overview-grid { grid-template-columns: 1fr; }
          .bms-overview-card {
            width: 100%;
            min-height: 110px;
            grid-template-columns: 90px 1fr;
            padding: 14px 18px;
          }
          .bms-overview-icon-wrap { width: 74px; height: 74px; }
          .bms-overview-icon { font-size: 41px; }
          .bms-overview-card-content h3 { font-size: calc(15px * var(--font-scale, 1)); }
          .bms-overview-card-content p { font-size: calc(12px * var(--font-scale, 1)); }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .bms-overview { padding: 18px 0 22px; }
          .bms-overview-container { width: calc(100% - 24px); }
          .bms-overview-heading {
            justify-content: flex-start;
            align-items: flex-start;
            gap: 9px;
          }
          .bms-overview-line {
            width: 28px;
            margin-top: 12px;
          }
          .bms-overview-heading h2 { font-size: calc(20px * var(--font-scale, 1)); }
          .bms-overview-grid { gap: 10px; }
          .bms-overview-card {
            min-height: 0;
            grid-template-columns: 70px minmax(0, 1fr);
            gap: 10px;
            padding: 13px 12px;
            border-radius: 9px;
          }
          .bms-overview-icon-wrap { width: 62px; height: 62px; }
          .bms-overview-icon { font-size: 34px; }
          .bms-overview-card-content h3 {
            margin-bottom: 5px;
            font-size: calc(14px * var(--font-scale, 1));
          }
          .bms-overview-card-content p {
            font-size: calc(11px * var(--font-scale, 1));
            line-height: 1.4;
          }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .bms-overview-container { width: calc(100% - 18px); }
          .bms-overview-heading h2 { font-size: calc(18px * var(--font-scale, 1)); }
          .bms-overview-card {
            grid-template-columns: 58px minmax(0, 1fr);
            padding: 11px 9px;
          }
          .bms-overview-icon-wrap { width: 52px; height: 52px; }
          .bms-overview-icon { font-size: 29px; }
          .bms-overview-card-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-overview-card-content p { font-size: calc(10px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
