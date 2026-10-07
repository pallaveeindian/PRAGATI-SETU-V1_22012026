// src/pages/PublicBMS/BMSPragatiInfo.jsx

import React, { useContext } from "react";
import { FiMonitor, FiTrendingUp, FiSettings, FiUsers } from "react-icons/fi";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    items: [
      {
        type: "about",
        icon: "monitor",
        titleOne: "About",
        titleTwo: "Pragati Setu",
        description:
          "Pragati Setu is a comprehensive digital governance platform designed to strengthen rural development initiatives under the State Rural Livelihood Mission. The platform connects government departments, field officials, and beneficiaries through a single integrated system to ensure transparency, efficiency, and accountability in service delivery.",
      },
      {
        type: "impact",
        icon: "growth",
        titleOne: "Real-time Data,",
        titleTwo: "Greater Impact",
        description:
          "It enables real-time data collection, monitoring, and analytics for various welfare schemes and livelihood programs. By digitizing manual processes, Pragati Setu reduces delays, improves accuracy, and helps decision-makers track progress effectively across districts and villages.",
      },
      {
        type: "platform",
        icon: "settings",
        titleOne: "A Comprehensive",
        titleTwo: "Platform",
        description:
          "Key features of Pragati Setu include Beneficiary Profiling, Lakhpati Didi Management, Training Management System (TMS), Enterprise Tracking, User Management, and Performance Dashboards.",
      },
    ],
  },
  hi: {
    items: [
      {
        type: "about",
        icon: "monitor",
        titleOne: "प्रगति सेतु",
        titleTwo: "के बारे में",
        description:
          "प्रगति सेतु एक व्यापक डिजिटल गवर्नेंस प्लेटफॉर्म है, जिसे राज्य ग्रामीण आजीविका मिशन के अंतर्गत ग्रामीण विकास पहलों को मजबूत करने के लिए विकसित किया गया है। यह सरकारी विभागों, फील्ड अधिकारियों और लाभार्थियों को एक एकीकृत प्रणाली के माध्यम से जोड़ता है, जिससे सेवा वितरण में पारदर्शिता, दक्षता और जवाबदेही सुनिश्चित होती है।",
      },
      {
        type: "impact",
        icon: "growth",
        titleOne: "रियल-टाइम डेटा,",
        titleTwo: "बेहतर प्रभाव",
        description:
          "यह विभिन्न कल्याणकारी योजनाओं और आजीविका कार्यक्रमों के लिए वास्तविक समय में डेटा संग्रह, निगरानी और विश्लेषण को सक्षम बनाता है। मैनुअल प्रक्रियाओं के डिजिटलीकरण से देरी कम होती है, सटीकता बढ़ती है और निर्णयकर्ताओं को जिलों एवं गांवों में प्रगति की प्रभावी निगरानी में सहायता मिलती है।",
      },
      {
        type: "platform",
        icon: "settings",
        titleOne: "एक व्यापक",
        titleTwo: "प्लेटफॉर्म",
        description:
          "प्रगति सेतु की प्रमुख विशेषताओं में लाभार्थी प्रोफाइलिंग, लखपति दीदी प्रबंधन, प्रशिक्षण प्रबंधन प्रणाली (TMS), एंटरप्राइज ट्रैकिंग, उपयोगकर्ता प्रबंधन और प्रदर्शन डैशबोर्ड शामिल हैं।",
      },
    ],
  },
};

const ICONS = {
  monitor: FiMonitor,
  growth: FiTrendingUp,
  settings: FiSettings,
  users: FiUsers,
};

const getIcon = (icon) => {
  const IconComponent = ICONS[icon] || FiMonitor;

  return <IconComponent className="bms-info-svg" />;
};

export default function BMSPragatiInfo() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="bms-pragati-info">
      <div className="bms-info-decoration bms-info-decoration-left"></div>
      <div className="bms-info-decoration bms-info-decoration-right"></div>

      <div className="bms-pragati-info-container">
        {t.items.map((item, index) => (
          <React.Fragment key={`${item.type}-${index}`}>
            <article className={`bms-info-item bms-info-${item.type}`}>
              <div className={`bms-info-icon-wrap bms-info-icon-${item.type}`}>
                <div className="bms-info-icon">{getIcon(item.icon)}</div>
              </div>

              <div className="bms-info-content">
                <h3>
                  <span className="bms-info-title-blue">{item.titleOne}</span>{" "}
                  <span
                    className={
                      item.type === "platform"
                        ? "bms-info-title-blue"
                        : "bms-info-title-orange"
                    }
                  >
                    {item.titleTwo}
                  </span>
                </h3>
                <p>{item.description}</p>
              </div>
            </article>

            {index < t.items.length - 1 && (
              <div className="bms-info-separator"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        .bms-pragati-info, .bms-pragati-info * {
          box-sizing: border-box;
        }

        .bms-pragati-info {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 10px 0 14px;
          background: linear-gradient(110deg, #fffaf7 0%, #fff7f2 48%, #fff4ed 100%);
        }

        .bms-pragati-info-container {
          position: relative;
          z-index: 2;
          width: 90%;
          max-width: 1550px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) 1px minmax(0, 1fr) 1px minmax(0, 1.05fr);
          align-items: stretch;
          background: rgba(255, 255, 255, 0.90);
          border: 1px solid #f2d6c6;
          border-radius: 10px;
          box-shadow: 0 5px 14px rgba(132, 85, 58, 0.07);
          overflow: hidden;
        }

        .bms-info-item {
          min-width: 0;
          min-height: 128px;
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr);
          align-items: center;
          gap: 13px;
          padding: 14px 20px;
        }

        .bms-info-separator {
          width: 1px;
          height: 75%;
          align-self: center;
          background: linear-gradient(180deg, transparent 0%, #efd6c7 18%, #efd6c7 82%, transparent 100%);
        }

        .bms-info-icon-wrap {
          width: 74px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: center;
          justify-self: center;
          border-radius: 50%;
        }
        .bms-info-icon{
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
}

.bms-info-svg{
  width:52px !important;
  height:52px !important;
  min-width:52px !important;
  min-height:52px !important;
  stroke-width:2.4;
}

        .bms-info-icon-about { background: linear-gradient(135deg, #fff1e8 0%, #ffe2cf 100%); }
        .bms-info-icon-about .bms-info-icon { color: #063466; }
        .bms-info-icon-impact { background: linear-gradient(135deg, #fff0e3 0%, #ffe2cf 100%); }
        .bms-info-icon-impact .bms-info-icon { color: #0a396d; }
        .bms-info-icon-platform { background: linear-gradient(135deg, #fff0e5 0%, #ffe5d4 100%); }
        .bms-info-icon-platform .bms-info-icon { color: #092f5f; }

        .bms-info-content { min-width: 0; }
        .bms-info-content h3 {
          margin: 0 0 7px;
          font-size: calc(16px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.2;
        }
        .bms-info-title-blue { color: #082c5a; }
        .bms-info-title-orange { color: #ff5207; }
        .bms-info-content p {
          margin: 0;
          color: #526a87;
          font-size: calc(11px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.38;
        }

        .bms-info-decoration {
          position: absolute;
          pointer-events: none;
          opacity: 0.17;
          border-radius: 50%;
        }
        .bms-info-decoration-left {
          left: -90px;
          bottom: -120px;
          width: 230px;
          height: 230px;
          background: #ffd6bd;
        }
        .bms-info-decoration-right {
          right: -100px;
          top: -120px;
          width: 260px;
          height: 260px;
          background: #ffe1d1;
        }
   

        /* 1400px+ */
        @media (min-width: 1400px) {
          .bms-pragati-info-container {
            width: 90%;
            max-width: 1600px;
          }
          .bms-info-item {
            min-height: 135px;
            grid-template-columns: 100px minmax(0, 1fr);
            gap: 15px;
            padding: 15px 23px;
          }
          .bms-info-icon-wrap { width: 80px; height: 80px; }
          .bms-info-icon { font-size: 44px; }
          .bms-info-content h3 { font-size: calc(17px * var(--font-scale, 1)); }
          .bms-info-content p { font-size: calc(12px * var(--font-scale, 1)); }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .bms-pragati-info-container { width: 92%; }
          .bms-info-item {
            grid-template-columns: 76px minmax(0, 1fr);
            gap: 10px;
            padding: 13px 14px;
          }
          .bms-info-icon-wrap { width: 65px; height: 65px; }
          .bms-info-icon { font-size: 36px; }
          .bms-info-content h3 { font-size: calc(14px * var(--font-scale, 1)); }
          .bms-info-content p { font-size: calc(9.5px * var(--font-scale, 1)); }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .bms-pragati-info-container {
            width: 92%;
            grid-template-columns: 1fr;
          }
          .bms-info-separator {
            width: calc(100% - 40px);
            height: 1px;
            justify-self: center;
            background: linear-gradient(90deg, transparent 0%, #efd6c7 15%, #efd6c7 85%, transparent 100%);
          }
          .bms-info-item {
            min-height: 105px;
            grid-template-columns: 85px minmax(0, 1fr);
            gap: 12px;
            padding: 14px 20px;
          }
          .bms-info-icon-wrap { width: 68px; height: 68px; }
          .bms-info-icon { font-size: 37px; }
          .bms-info-content h3 { font-size: calc(15px * var(--font-scale, 1)); }
          .bms-info-content p {
            font-size: calc(11px * var(--font-scale, 1));
            line-height: 1.45;
          }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .bms-pragati-info { padding: 14px 0 18px; }
          .bms-pragati-info-container { width: 92%; }
          .bms-info-item {
            min-height: 110px;
            padding: 15px 18px;
          }
          .bms-info-content h3 { font-size: calc(16px * var(--font-scale, 1)); }
          .bms-info-content p { font-size: calc(11.5px * var(--font-scale, 1)); }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .bms-pragati-info { padding: 12px 0 18px; }
          .bms-pragati-info-container {
            width: calc(100% - 24px);
            border-radius: 9px;
          }
          .bms-info-item {
            min-height: 0;
            grid-template-columns: 66px minmax(0, 1fr);
            align-items: flex-start;
            gap: 10px;
            padding: 14px 12px;
          }
          .bms-info-icon-wrap { width: 58px; height: 58px; }
          .bms-info-icon { font-size: 31px; }
          .bms-info-content h3 {
            margin-bottom: 6px;
            font-size: calc(14px * var(--font-scale, 1));
          }
          .bms-info-content p {
            font-size: calc(10.5px * var(--font-scale, 1));
            line-height: 1.45;
          }
          .bms-info-separator { width: calc(100% - 24px); }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .bms-pragati-info-container { width: calc(100% - 18px); }
          .bms-info-item {
            grid-template-columns: 55px minmax(0, 1fr);
            gap: 8px;
            padding: 12px 9px;
          }
          .bms-info-icon-wrap { width: 48px; height: 48px; }
          .bms-info-icon { font-size: 26px; }
          .bms-info-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-info-content p { font-size: calc(9.5px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
