// src/pages/EnterpriseSakhi/WebPortalSection.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../LanguageContext.jsx";
import { FaDatabase, FaMapMarkedAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";

// change this path only if your image name is different
import portalImage from "../../assets/EPSMS/epsms_portal_laptop.png";

const content = {
  en: {
    epsmsLabel: "MANAGEMENT PORTAL",
    epsmsTitle: "EPSMS Portal",
    epsmsSubtitle: "Enterprise Sakhi Management System",
    epsmsDescription: "Securely manage and monitor Enterprise Sakhi data submitted by field-level CRPs using the Udhyam Sakhi Android App.",
    epsmsPoints: ["Centralized data management", "Monitor enterprise progress", "Real-time analytics and reports", "Secure and role-based access"],
    epsmsButton: "Explore EPSMS",

    mappingLabel: "ENTERPRISE TRACKING",
    mappingTitle: "CRP-EP Mapping",
    mappingSubtitle: "Enterprise Tracking",
    mappingDescription: "Create Community Resource Person accounts and map their respective Panchayat coverage for Udhyam Sakhi App survey filling effectively.",
    mappingPoints: ["Create and manage CRP accounts", "Map Panchayat coverage", "Track enterprise data", "Ensure effective field operations"],
    mappingButton: "Explore Mapping",
  },
  hi: {
    epsmsLabel: "प्रबंधन पोर्टल",
    epsmsTitle: "EPSMS पोर्टल",
    epsmsSubtitle: "एंटरप्राइज सखी मैनेजमेंट सिस्टम",
    epsmsDescription: "उद्यम सखी एंड्रॉयड ऐप के माध्यम से फील्ड स्तर के CRPs द्वारा जमा किए गए एंटरप्राइज सखी डेटा को सुरक्षित रूप से प्रबंधित और मॉनिटर करें।",
    epsmsPoints: ["केंद्रीकृत डेटा प्रबंधन", "उद्यम प्रगति की निगरानी", "रियल-टाइम एनालिटिक्स एवं रिपोर्ट", "सुरक्षित और भूमिका आधारित एक्सेस"],
    epsmsButton: "EPSMS देखें",

    mappingLabel: "एंटरप्राइज ट्रैकिंग",
    mappingTitle: "CRP-EP मैपिंग",
    mappingSubtitle: "एंटरप्राइज ट्रैकिंग",
    mappingDescription: "Community Resource Person खाते बनाएं और उद्यम सखी ऐप सर्वे के लिए उनकी संबंधित पंचायत कवरेज को प्रभावी रूप से मैप करें।",
    mappingPoints: ["CRP खाते बनाएं और प्रबंधित करें", "पंचायत कवरेज मैप करें", "उद्यम डेटा ट्रैक करें", "प्रभावी फील्ड संचालन सुनिश्चित करें"],
    mappingButton: "मैपिंग देखें",
  },
};

// icon + color + content keys for each portal card, in render order
const PORTAL_CARDS = [
  { color: "orange", icon: <FaDatabase />, labelKey: "epsmsLabel", titleKey: "epsmsTitle", subtitleKey: "epsmsSubtitle", descKey: "epsmsDescription", pointsKey: "epsmsPoints", buttonKey: "epsmsButton",loginRoute: "/module-login?module=epsms",},
  { color: "blue", icon: <FaMapMarkedAlt />, labelKey: "mappingLabel", titleKey: "mappingTitle", subtitleKey: "mappingSubtitle", descKey: "mappingDescription", pointsKey: "mappingPoints", buttonKey: "mappingButton", loginRoute: "/module-login?module=crp", },
];

export default function WebPortalSection() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="web-portal-section">
      <div className="web-portal-image">
        <img src={portalImage} alt="EPSMS Enterprise Sakhi Management System Portal" />
      </div>

      {PORTAL_CARDS.map((card) => (
        <div className={`portal-card portal-card-${card.color}`} key={card.color}>
          <div className="portal-card-top">
            <div className={`portal-main-icon ${card.color}-icon`}>{card.icon}</div>
            <div className={`portal-label ${card.color}-label`}>{t[card.labelKey]}</div>
          </div>

          <h2>{t[card.titleKey]}</h2>
          <h3>{t[card.subtitleKey]}</h3>
          <p className="portal-description">{t[card.descKey]}</p>

          <div className={`portal-points ${card.color}-points`}>
            {t[card.pointsKey].map((point, index) => (
              <div className="portal-point" key={index}>
                <FaCheckCircle />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <button type="button" className={`portal-button ${card.color}-button`}
            onClick={() => navigate(card.loginRoute)}>
            <span>{t[card.buttonKey]}</span>
            <FaArrowRight />
          </button>
        </div>
      ))}

      <style>{`
        .web-portal-section, .web-portal-section * {
          box-sizing: border-box;
        }

        .web-portal-section {
          position: relative;
          width: 94%;
          max-width: 1450px;
          min-height: 520px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 53% 23.5% 23.5%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(240, 211, 198, 0.7);
          border-radius: 22px;
          box-shadow: 0 12px 35px rgba(63, 40, 27, 0.08);
        }

        .web-portal-image {
          position: relative;
          min-width: 0;
          overflow: hidden;
          background: #f7f4f1;
        }
        .web-portal-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 520px;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s ease;
        }
        .web-portal-image:hover img { transform: scale(1.02); }

        .portal-card {
          position: relative;
          margin: 17px 8px;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e8edf3;
          border-radius: 18px;
          box-shadow: 0 5px 16px rgba(15, 23, 42, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .portal-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
        }

        .portal-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .portal-main-icon {
          width: 62px;
          height: 62px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 25px;
        }
        .orange-icon {
          color: #ff5b0b;
          background: linear-gradient(135deg, #fff4ed, #ffe0cf);
        }
        .blue-icon {
          color: #1478e8;
          background: linear-gradient(135deg, #f0f8ff, #dceeff);
        }

        .portal-label {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: calc(9px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.2;
        }
        .orange-label { color: #ff5b0b; background: #fff3ec; }
        .blue-label { color: #1478e8; background: #eef7ff; }

        .portal-card h2 {
          margin: 0 0 4px;
          color: #07275d;
          font-size: calc(26px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.1;
        }
        .portal-card h3 {
          margin: 0 0 16px;
          color: #405573;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.35;
        }
        .portal-description {
          margin: 0 0 16px;
          color: #536987;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.58;
        }

        .portal-points {
          margin-top: auto;
          padding: 14px 13px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          border-radius: 12px;
        }
        .orange-points { background: linear-gradient(135deg, #fff8f4, #fff1e9); }
        .blue-points { background: linear-gradient(135deg, #f5faff, #eaf5ff); }

        .portal-point {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #435773;
          font-size: calc(11px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.35;
        }
        .portal-point svg {
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 14px;
        }
        .orange-points .portal-point svg { color: #ff5b0b; }
        .blue-points .portal-point svg { color: #1478e8; }

        .portal-button {
          width: 100%;
          height: 45px;
          margin-top: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 9px;
          background: #ffffff;
          font-family: inherit;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }
        .orange-button {
          border: 1.5px solid #ff5b0b;
          color: #ff5b0b;
        }
        .orange-button:hover {
          background: #ff5b0b;
          color: #ffffff;
        }
        .blue-button {
          border: 1.5px solid #1478e8;
          color: #1478e8;
        }
        .blue-button:hover {
          background: #1478e8;
          color: #ffffff;
        }
        .portal-button svg { transition: transform 0.25s ease; }
        .portal-button:hover svg { transform: translateX(4px); }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .web-portal-section {
            max-width: 1500px;
            min-height: 540px;
            grid-template-columns: 53% 23.5% 23.5%;
          }
          .web-portal-image img { min-height: 540px; }
          .portal-card {
            margin: 18px 8px;
            padding: 22px 19px;
          }
          .portal-card h2 { font-size: calc(27px * var(--font-scale, 1)); }
          .portal-description { font-size: calc(13.5px * var(--font-scale, 1)); }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .web-portal-section {
            grid-template-columns: 50% 25% 25%;
            min-height: 500px;
          }
          .web-portal-image img { min-height: 500px; }
          .portal-card {
            margin: 14px 6px;
            padding: 16px 14px;
          }
          .portal-main-icon {
            width: 55px;
            height: 55px;
            font-size: 22px;
          }
          .portal-card h2 { font-size: calc(22px * var(--font-scale, 1)); }
          .portal-card h3 { font-size: calc(12.5px * var(--font-scale, 1)); }
          .portal-description { font-size: calc(12px * var(--font-scale, 1)); }
        }

        /* 1024px small laptop */
        @media (max-width: 1024px) {
          .web-portal-section { grid-template-columns: 48% 26% 26%; }
          .portal-card { padding: 14px 12px; }
          .portal-card-top {
            gap: 9px;
            margin-bottom: 14px;
          }
          .portal-main-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
          .portal-label {
            padding: 6px 9px;
            font-size: calc(8px * var(--font-scale, 1));
          }
          .portal-card h2 { font-size: calc(19px * var(--font-scale, 1)); }
          .portal-description { font-size: calc(11px * var(--font-scale, 1)); }
          .portal-point { font-size: calc(10px * var(--font-scale, 1)); }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .web-portal-section {
            grid-template-columns: 1fr 1fr;
            min-height: auto;
          }
          .web-portal-image { grid-column: 1 / -1; }
          .web-portal-image img {
            width: 100%;
            min-height: 380px;
            max-height: 470px;
            object-fit: cover;
          }
          .portal-card {
            margin: 12px;
            padding: 22px 18px;
          }
          .portal-card h2 { font-size: calc(24px * var(--font-scale, 1)); }
          .portal-description { font-size: calc(13px * var(--font-scale, 1)); }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .web-portal-section {
            width: calc(100% - 24px);
            grid-template-columns: 1fr;
            border-radius: 17px;
          }
          .web-portal-image { grid-column: auto; }
          .web-portal-image img {
            min-height: 280px;
            max-height: 340px;
            object-fit: cover;
          }
          .portal-card {
            margin: 8px 12px;
            padding: 20px 17px;
          }
          .portal-card-top { margin-bottom: 13px; }
          .portal-card h2 { font-size: calc(23px * var(--font-scale, 1)); }
          .portal-card h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .portal-description { font-size: calc(12px * var(--font-scale, 1)); }
          .portal-point { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .web-portal-section { width: calc(100% - 18px); }
          .web-portal-image img {
            min-height: 230px;
            max-height: 280px;
          }
          .portal-card {
            margin: 7px 9px;
            padding: 18px 14px;
          }
          .portal-main-icon {
            width: 47px;
            height: 47px;
            font-size: 18px;
          }
          .portal-card h2 { font-size: calc(21px * var(--font-scale, 1)); }
          .portal-button {
            height: 42px;
            font-size: calc(11px * var(--font-scale, 1));
          }
        }
      `}</style>
    </section>
  );
}
