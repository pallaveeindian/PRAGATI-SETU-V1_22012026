// src/pages/AboutUs.jsx

import React, { useEffect, useContext } from "react";
import up_logo from "../assets/upgov_logo.jpg";
import missionInfographic from "../assets/mission_infographic.png";
import missionBg from "../assets/mission_bg.png";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext.jsx";
import { FaBullseye, FaChartBar, FaCog } from "react-icons/fa";

const content = {
  en: {
    title1: "Our",
    title2: "Mission",
    subtitle: "A Bridge from Skill to Enterprise, Towards Prosperity",
    p1: "Pragati Setu is a comprehensive digital governance platform designed to strengthen rural development initiatives under the State Rural Livelihood Mission. The platform connects government departments, field officials, and beneficiaries through a single integrated system to ensure transparency, efficiency, and accountability in service delivery.",
    p2: "It enables real-time data collection, monitoring, and analytics for various welfare schemes and livelihood programs. By digitizing manual processes, Pragati Setu reduces delays, improves accuracy, and helps decision-makers track progress effectively across districts and villages.",
    p3: "Key features of Pragati Setu include Beneficiary Profiling, Lakhpati Didi Management, Training Management System (TMS), Enterprise Tracking, User Management, and Performance Dashboards.",
  },
  hi: {
    title1: "हमारा",
    title2: "मिशन",
    subtitle: "कौशल से उद्यम तक, समृद्धि की ओर एक सेतु",
    p1: "प्रगति सेतु एक व्यापक डिजिटल गवर्नेंस प्लेटफॉर्म है, जिसे राज्य ग्रामीण आजीविका मिशन के अंतर्गत ग्रामीण विकास पहलों को मजबूत करने के लिए विकसित किया गया है। यह प्लेटफॉर्म सरकारी विभागों, फील्ड अधिकारियों और लाभार्थियों को एकीकृत प्रणाली के माध्यम से जोड़ता है, जिससे सेवा वितरण में पारदर्शिता, दक्षता और जवाबदेही सुनिश्चित होती है।",
    p2: "यह विभिन्न कल्याणकारी योजनाओं और आजीविका कार्यक्रमों के लिए रियल-टाइम डेटा संग्रह, निगरानी और विश्लेषण को सक्षम बनाता है। मैनुअल प्रक्रियाओं को डिजिटाइज़ करके, प्रगति सेतु देरी को कम करता है, सटीकता बढ़ाता है और निर्णय लेने वालों को जिलों और गांवों में प्रगति को प्रभावी ढंग से ट्रैक करने में मदद करता है।",
    p3: "प्रगति सेतु की प्रमुख विशेषताओं में लाभार्थी प्रोफाइलिंग, लखपति दीदी प्रबंधन, प्रशिक्षण प्रबंधन प्रणाली (TMS), एंटरप्राइज ट्रैकिंग, यूज़र मैनेजमेंट और प्रदर्शन डैशबोर्ड शामिल हैं।",
  },
};

function MissionCard({ icon, iconClass, text, className = "" }) {
  return (
    <div className={`mission-card ${className}`}>
      <div className={`mission-card-icon ${iconClass}`}>{icon}</div>
      <div className="mission-card-content">
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function AboutUs() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="mission-page">
      <GovHeader logo={up_logo} title="Government Of Uttar Pradesh" onFontChange={setFontScale} />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="mission-main" style={{ backgroundImage: `url(${missionBg})` }}>
        <div className="mission-container">
          <div className="mission-heading">
            <h1>
              <span className="mission-title-blue">{t.title1}</span> <span className="mission-title-orange">{t.title2}</span>
            </h1>
            <span className="mission-heading-line"></span>
            <h2>{t.subtitle}</h2>
          </div>

          <div className="mission-top-grid">
            <div className="mission-infographic">
              <img src={missionInfographic} alt="Pragati Setu Mission Infographic" />
            </div>

            <MissionCard icon={<FaBullseye />} iconClass="target-icon" text={t.p1} className="mission-card-main" />
          </div>

          <div className="mission-bottom-grid">
            <MissionCard icon={<FaChartBar />} iconClass="chart-icon" text={t.p2} />
            <MissionCard icon={<FaCog />} iconClass="gear-icon" text={t.p3} />
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .mission-page, .mission-page * {
          box-sizing: border-box;
        }
        :root { --font-scale: 1; }
        .mission-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #ffffff;
        }

        .mission-main {
          position: relative;
          width: 100%;
          padding: 30px 0 45px;
          background-color: #fffaf6;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          overflow: hidden;
        }
        .mission-container {
          position: relative;
          z-index: 2;
          width: 94%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .mission-heading {
          width: 100%;
          margin-bottom: 25px;
          text-align: center;
        }
        .mission-heading h1 {
          margin: 0 0 7px;
          font-size: calc(48px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
        }
        .mission-title-blue { color: #071b4d; }
        .mission-title-orange { color: #ff5b0b; }
        .mission-heading-line {
          display: block;
          width: 70px;
          height: 6px;
          margin: 0 auto 15px;
          border-radius: 20px;
          background: linear-gradient(90deg, #ff9f70, #ff5b0b);
        }
        .mission-heading h2 {
          margin: 0;
          color: #071b4d;
          font-size: calc(22px * var(--font-scale, 1));
          font-weight: 700;
          line-height: 1.4;
        }

        .mission-top-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 52% 48%;
          gap: 35px;
          align-items: center;
          margin-bottom: 28px;
        }

        .mission-infographic {
          width: 100%;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mission-infographic img {
          display: block;
          width: 100%;
          max-width: 820px;
          height: auto;
          object-fit: contain;
        }

        .mission-card {
          position: relative;
          width: 100%;
          min-height: 205px;
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 28px 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.94);
          border: 1.7px solid #ff6a14;
          border-radius: 18px;
          box-shadow: 0 8px 20px rgba(255, 91, 11, 0.10);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .mission-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(255, 91, 11, 0.16);
        }
        .mission-card::after {
          content: "";
          position: absolute;
          right: -25px;
          bottom: -35px;
          width: 130px;
          height: 130px;
          border-radius: 60% 40% 55% 45%;
          background: rgba(255, 151, 100, 0.08);
          transform: rotate(25deg);
          pointer-events: none;
        }

        .mission-card-icon {
          position: relative;
          width: 82px;
          height: 82px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 34px;
        }
        .mission-card-icon::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -17px;
          width: 55px;
          height: 4px;
          transform: translateX(-50%);
          border-radius: 10px;
          background: #ff5b0b;
        }
        .target-icon, .chart-icon, .gear-icon {
          color: #ff5b0b;
          background: linear-gradient(135deg, #fff1e8, #ffe2d2);
        }

        .mission-card-content {
          position: relative;
          z-index: 2;
          flex: 1;
          min-width: 0;
        }
        .mission-card-content p {
          margin: 0;
          color: #263956;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.7;
        }

        .mission-card-main { min-height: 250px; padding: 34px 38px; }
        .mission-card-main .mission-card-content p {
          font-size: calc(16px * var(--font-scale, 1));
          line-height: 1.75;
        }

        .mission-bottom-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .mission-main { padding: 35px 0 50px; }
          .mission-container { max-width: 1550px; }
          .mission-heading h1 { font-size: calc(52px * var(--font-scale, 1)); }
          .mission-heading h2 { font-size: calc(24px * var(--font-scale, 1)); }
          .mission-top-grid {
            grid-template-columns: 53% 47%;
            gap: 45px;
          }
          .mission-infographic img { max-width: 860px; }
          .mission-card-main { min-height: 265px; }
          .mission-card-content p { font-size: calc(16px * var(--font-scale, 1)); }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .mission-container { width: 95%; }
          .mission-heading h1 { font-size: calc(44px * var(--font-scale, 1)); }
          .mission-heading h2 { font-size: calc(20px * var(--font-scale, 1)); }
          .mission-top-grid {
            grid-template-columns: 52% 48%;
            gap: 25px;
          }
          .mission-card {
            padding: 24px 25px;
            gap: 22px;
          }
          .mission-card-icon {
            width: 70px;
            height: 70px;
            font-size: 29px;
          }
          .mission-card-content p { font-size: calc(14px * var(--font-scale, 1)); }
        }

        /* 1024px small laptop / tablet */
        @media (max-width: 1024px) {
          .mission-main { padding-top: 28px; }
          .mission-heading h1 { font-size: calc(39px * var(--font-scale, 1)); }
          .mission-top-grid {
            grid-template-columns: 50% 50%;
            gap: 18px;
          }
          .mission-card {
            min-height: 190px;
            padding: 21px 20px;
            gap: 17px;
          }
          .mission-card-main { min-height: 230px; }
          .mission-card-icon {
            width: 62px;
            height: 62px;
            font-size: 25px;
          }
          .mission-card-content p { font-size: calc(13px * var(--font-scale, 1)); }
          .mission-card-main .mission-card-content p { font-size: calc(13.5px * var(--font-scale, 1)); }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .mission-main {
            padding: 28px 0 35px;
            background-size: cover;
            background-position: center top;
          }
          .mission-top-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .mission-infographic { order: 1; }
          .mission-card-main { order: 2; min-height: auto; }
          .mission-infographic img {
            width: 90%;
            max-width: 720px;
          }
          .mission-bottom-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .mission-card { min-height: auto; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .mission-main { padding: 22px 0 28px; }
          .mission-container { width: calc(100% - 24px); }
          .mission-heading { margin-bottom: 20px; }
          .mission-heading h1 { font-size: calc(32px * var(--font-scale, 1)); }
          .mission-heading-line {
            width: 50px;
            height: 4px;
            margin-bottom: 11px;
          }
          .mission-heading h2 {
            font-size: calc(16px * var(--font-scale, 1));
            line-height: 1.45;
          }
          .mission-infographic img { width: 100%; }
          .mission-card {
            align-items: flex-start;
            gap: 15px;
            padding: 20px 17px;
            border-radius: 15px;
          }
          .mission-card-icon {
            width: 52px;
            height: 52px;
            font-size: 21px;
          }
          .mission-card-icon::after {
            bottom: -12px;
            width: 38px;
            height: 3px;
          }
          .mission-card-content p, .mission-card-main .mission-card-content p {
            font-size: calc(12.5px * var(--font-scale, 1));
            line-height: 1.6;
          }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .mission-container { width: calc(100% - 18px); }
          .mission-heading h1 { font-size: calc(28px * var(--font-scale, 1)); }
          .mission-heading h2 { font-size: calc(14px * var(--font-scale, 1)); }
          .mission-card {
            display: block;
            padding: 18px 14px;
          }
          .mission-card-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 25px;
            font-size: 19px;
          }
          .mission-card-content p, .mission-card-main .mission-card-content p {
            font-size: calc(12px * var(--font-scale, 1));
          }
        }
      `}</style>
    </div>
  );
}
