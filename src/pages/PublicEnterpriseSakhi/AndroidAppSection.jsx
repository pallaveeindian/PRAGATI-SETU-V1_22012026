// src/pages/EnterpriseSakhi/AndroidAppSection.jsx

import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";
import {
  FaAndroid,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaDatabase,
  FaMapMarkerAlt,
} from "react-icons/fa";

// change this path only if your image name is different
import mobileImage from "../../assets/EPSMS/udhyam_sakhi_mobile.png";
import qrImage from "../../assets/EPSMS/udhyam_sakhi_qr.jpg";
const APP_LINK =
  "https://play.google.com/store/apps/details?id=com.crp_ep_demo";

const content = {
  en: {
    label: "MOBILE APPLICATION",
    title: "Udhyam Sakhi App",
    subtitle: "Empowering Rural Women Entrepreneurs under UPSRLM",
    p1: "Transforming Rural Livelihoods through Digital Innovation EPSMS (Enterprise Sakhi Management System) is the dedicated digital tool for Community Resource Persons (CRP-EPs) and Micro-Enterprise Sakhis under the Non-Farm Livelihood Theme of the Uttar Pradesh State Rural Livelihood Mission (UPSRLM).",
    p2: "This application is designed to replace manual, paper-based processes with a unified automated workflow, enabling the growth of over 6.5 lakh rural women entrepreneurs across Uttar Pradesh.",
    features: [
      "Field-level CRP Data",
      "Digital Data Collection",
      "Enterprise Surveys",
    ],
  },
  hi: {
    label: "मोबाइल एप्लिकेशन",
    title: "उद्यम सखी ऐप",
    subtitle: "UPSRLM के अंतर्गत ग्रामीण महिला उद्यमियों को सशक्त बनाना",
    p1: "डिजिटल नवाचार के माध्यम से ग्रामीण आजीविका को सशक्त बनाने के लिए EPSMS (Enterprise Sakhi Management System) Community Resource Persons (CRP-EPs) और Micro-Enterprise Sakhis के लिए एक समर्पित डिजिटल टूल है। यह उत्तर प्रदेश राज्य ग्रामीण आजीविका मिशन (UPSRLM) के Non-Farm Livelihood कार्यक्रम के अंतर्गत कार्य करता है।",
    p2: "यह एप्लिकेशन मैनुअल और कागज आधारित प्रक्रियाओं को एकीकृत स्वचालित डिजिटल कार्यप्रवाह से बदलने के लिए विकसित किया गया है, जिससे उत्तर प्रदेश की 6.5 लाख से अधिक ग्रामीण महिला उद्यमियों के विकास को समर्थन मिलता है।",
    features: ["फील्ड स्तर CRP डेटा", "डिजिटल डेटा संग्रह", "उद्यम सर्वेक्षण"],
  },
};

// icon + position for the floating icons around the phone (order fixed, not translated)
const FLOATING_ICONS = [
  { icon: <FaClipboardList />, position: "top" },
  { icon: <FaUsers />, position: "left" },
  { icon: <FaChartBar />, position: "right" },
];

// icon + color for each feature card, paired with content.features by index
const FEATURE_META = [
  { icon: <FaUsers />, color: "orange" },
  { icon: <FaDatabase />, color: "blue" },
  { icon: <FaMapMarkerAlt />, color: "green" },
];

function Leaf({ side }) {
  return (
    <div className={`android-leaf android-leaf-${side}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

export default function AndroidAppSection() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="android-app-section">
      <div className="android-visual">
        <div className="android-circle android-circle-one"></div>
        <div className="android-circle android-circle-two"></div>
        <div className="android-dashed-circle"></div>

        {FLOATING_ICONS.map(({ icon, position }) => (
          <div
            className={`android-floating-icon android-float-${position}`}
            key={position}
          >
            {icon}
          </div>
        ))}

        <Leaf side="left" />
        <Leaf side="right" />

        <img
          src={mobileImage}
          alt="Udhyam Sakhi Mobile Application"
          className="android-phone-image"
        />
      </div>

      <div className="android-info">
        <div className="android-label">
          <FaAndroid />
          <span>{t.label}</span>
        </div>

        <div className="android-title-row">
          <h2 className="android-title">{t.title}</h2>

          <a
            href={APP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="android-qr-link"
            title="Open Udhyam Sakhi App"
          >
            <img
              src={qrImage}
              alt="Udhyam Sakhi App QR Code"
              className="android-qr-image"
            />
          </a>
        </div>

        <h3 className="android-subtitle">{t.subtitle}</h3>

        <p className="android-description">{t.p1}</p>
        <p className="android-description">{t.p2}</p>

        <div className="android-feature-grid">
          {t.features.map((feature, index) => {
            const meta = FEATURE_META[index];
            return (
              <div
                className={`android-feature-card feature-${meta.color}`}
                key={feature}
              >
                <div className="android-feature-icon">{meta.icon}</div>
                <h4>{feature}</h4>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .android-app-section, .android-app-section * {
          box-sizing: border-box;
        }

        .android-app-section {
          position: relative;
          width: 94%;
          max-width: 1450px;
          min-height: 515px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 44% 56%;
          align-items: stretch;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(240, 211, 198, 0.75);
          border-radius: 22px;
          box-shadow: 0 12px 35px rgba(63, 40, 27, 0.08);
        }

        .android-visual {
          position: relative;
          min-height: 515px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #fff8f4 0%, #fffdfb 100%);
        }

        .android-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .android-circle-one {
          width: 430px;
          height: 430px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255, 223, 206, 0.28) 0%, rgba(255, 237, 229, 0.18) 55%, transparent 70%);
        }
        .android-circle-two {
          width: 330px;
          height: 330px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 236, 226, 0.34);
        }

        .android-dashed-circle {
          position: absolute;
          width: 380px;
          height: 380px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 2px dashed rgba(255, 119, 49, 0.48);
          border-radius: 50%;
        }

        .android-phone-image {
          position: relative;
          z-index: 5;
          display: block;
          width: auto;
          max-width: 67%;
          height: 470px;
          object-fit: contain;
          filter: drop-shadow(0 14px 15px rgba(20, 33, 49, 0.18));
        }

        .android-floating-icon {
          position: absolute;
          z-index: 6;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff;
          font-size: 28px;
          box-shadow: 0 8px 25px rgba(32, 49, 69, 0.12);
        }
        .android-float-top {
          top: 82px;
          left: 13%;
          color: #ff620d;
          border: 5px solid #ffe1d1;
        }
        .android-float-left {
          left: 11%;
          bottom: 145px;
          color: #3098ed;
          border: 5px solid #d9edff;
        }
        .android-float-right {
          right: 10%;
          bottom: 145px;
          color: #1daf68;
          border: 5px solid #d5f4e3;
        }

        .android-leaf {
          position: absolute;
          z-index: 2;
          bottom: 32px;
          width: 80px;
          height: 130px;
        }
        .android-leaf-left { left: 24%; }
        .android-leaf-right { right: 14%; }
        .android-leaf::before {
          content: "";
          position: absolute;
          left: 39px;
          bottom: 0;
          width: 4px;
          height: 120px;
          border-radius: 10px;
          background: #5da562;
          transform: rotate(-7deg);
        }
        .android-leaf span {
          position: absolute;
          width: 35px;
          height: 60px;
          border-radius: 80% 0 80% 0;
          background: linear-gradient(145deg, #67ad66, #438d50);
        }
        .android-leaf span:nth-child(1) { left: 0; top: 12px; transform: rotate(-25deg); }
        .android-leaf span:nth-child(2) { right: 0; top: 40px; transform: rotate(35deg) scale(0.88); }
        .android-leaf span:nth-child(3) { left: 5px; top: 72px; transform: rotate(-15deg) scale(0.75); }

       .android-info{
  position:relative;
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding:38px 42px 38px 30px;
}

        .android-label {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding: 9px 24px;
          border-radius: 30px;
          background: #fff0e7;
          color: #ff5b0b;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 900;
          letter-spacing: 0.3px;
        }
        .android-label svg { font-size: 20px; }
      .android-title-row{
  display:block;
  margin-bottom:5px;
  padding-right:170px;
}

.android-title-row .android-title{
  margin:0;
}

.android-qr-link{
  position:absolute;
  top:15px;
  right:35px;

  width:150px;
  height:150px;

  display:block;
  padding:4px;

  background:#fff;
  // border:2px solid #ff5b0b;
  border-radius:4px;

  z-index:10;
  cursor:pointer;

  transition:transform .25s ease,box-shadow .25s ease;
}

.android-qr-link:hover{
  transform:scale(1.04);
  box-shadow:0 6px 16px rgba(15,23,42,.15);
}

.android-qr-image{
  display:block;
  width:100%;
  height:100%;
  object-fit:contain;
}

        .android-title {
          margin: 0 0 5px;
          color: #06275e;
          font-size: calc(40px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.08;
        }
        .android-subtitle {
          margin: 0 0 14px;
          color: #ff5b0b;
          font-size: calc(17px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.35;
        }
        .android-description {
          width: 100%;
          max-width: 750px;
          margin: 0 0 13px;
          color: #526783;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.6;
        }

        .android-feature-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 23px;
        }
        .android-feature-card {
          min-height: 135px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 12px;
          border-radius: 14px;
          text-align: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .android-feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 20px rgba(35, 53, 75, 0.08);
        }

        .feature-orange { background: linear-gradient(135deg, #fffaf7, #fff0e7); }
        .feature-blue { background: linear-gradient(135deg, #f6fbff, #e5f4ff); }
        .feature-green { background: linear-gradient(135deg, #f5fff8, #e2f8ea); }

        .android-feature-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 23px;
        }
        .feature-orange .android-feature-icon { color: #ff5b0b; background: #ffe2d1; }
        .feature-blue .android-feature-icon { color: #1683da; background: #d9edff; }
        .feature-green .android-feature-icon { color: #17ad62; background: #cff2dd; }

        .android-feature-card h4 {
          max-width: 150px;
          margin: 0;
          color: #06265c;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.35;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .android-app-section {
            max-width: 1500px;
            min-height: 540px;
          }
          .android-visual { min-height: 540px; }
          .android-phone-image { height: 495px; }
          .android-info { padding: 42px 50px 42px 32px; }
          .android-title { font-size: calc(42px * var(--font-scale, 1)); }
          .android-description { font-size: calc(15px * var(--font-scale, 1)); }
          .android-qr-link{
  top:18px;
  right:35px;
  width:155px;
  height:155px;
}

.android-title-row{
  padding-right:175px;
}
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .android-app-section {
            grid-template-columns: 43% 57%;
            min-height: 500px;
          }
          .android-visual { min-height: 500px; }
          .android-phone-image { height: 450px; }
          .android-info { padding: 32px 28px; }
          .android-title { font-size: calc(36px * var(--font-scale, 1)); }
          .android-description { font-size: calc(13.5px * var(--font-scale, 1)); }
          .android-qr-link{
  top:15px;
  right:25px;
  width:125px;
  height:125px;
}

.android-title-row{
  padding-right:140px;
}
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .android-app-section { grid-template-columns: 42% 58%; }
          .android-phone-image {
            max-width: 75%;
            height: 420px;
          }
          .android-dashed-circle { width: 330px; height: 330px; }
          .android-circle-one { width: 370px; height: 370px; }
          .android-circle-two { width: 290px; height: 290px; }
          .android-floating-icon {
            width: 64px;
            height: 64px;
            font-size: 23px;
          }
          .android-title { font-size: calc(32px * var(--font-scale, 1)); }
          .android-subtitle { font-size: calc(15px * var(--font-scale, 1)); }
          .android-feature-grid { gap: 10px; }
          .android-feature-card { min-height: 120px; }
          .android-qr-link{
  top:14px;
  right:20px;
  width:105px;
  height:105px;
}

.android-title-row{
  padding-right:120px;
}
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .android-app-section { grid-template-columns: 1fr; }
          .android-visual { min-height: 475px; }
          .android-phone-image { height: 435px; }
          .android-info { padding: 32px 28px 38px; }
          .android-title { font-size: calc(36px * var(--font-scale, 1)); }
          .android-qr-link{
  top:20px;
  right:28px;
  width:100px;
  height:100px;
}

.android-title-row{
  padding-right:115px;
}
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .android-app-section {
            width: calc(100% - 24px);
            border-radius: 17px;
          }
          .android-visual { min-height: 410px; }
          .android-phone-image {
            max-width: 75%;
            height: 375px;
          }
          .android-circle-one { width: 330px; height: 330px; }
          .android-circle-two { width: 255px; height: 255px; }
          .android-dashed-circle { width: 300px; height: 300px; }
          .android-floating-icon {
            width: 56px;
            height: 56px;
            font-size: 20px;
          }
          .android-float-top { top: 65px; }
          .android-info { padding: 26px 17px 30px; }
          .android-label {
            padding: 8px 16px;
            font-size: calc(10px * var(--font-scale, 1));
          }
          .android-title { font-size: calc(29px * var(--font-scale, 1)); }
          .android-subtitle { font-size: calc(14px * var(--font-scale, 1)); }
          .android-description {
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.55;
          }
          .android-feature-grid { grid-template-columns: 1fr; }
          .android-feature-card {
            min-height: 92px;
            flex-direction: row;
            justify-content: flex-start;
            padding: 14px 18px;
            text-align: left;
          }
          .android-feature-card h4 { max-width: none; }
          .android-qr-link{
  top:18px;
  right:16px;
  width:72px;
  height:72px;
  padding:2px;
}

.android-title-row{
  padding-right:80px;
}
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .android-app-section { width: calc(100% - 18px); }
          .android-visual { min-height: 355px; }
          .android-phone-image { height: 325px; }
          .android-circle-one { width: 290px; height: 290px; }
          .android-circle-two { width: 225px; height: 225px; }
          .android-dashed-circle { width: 265px; height: 265px; }
          .android-floating-icon { display: none; }
          .android-leaf { display: none; }
          .android-title { font-size: calc(26px * var(--font-scale, 1)); }
          .android-feature-icon {
            width: 46px;
            height: 46px;
            font-size: 19px;
          }
          .android-feature-card h4 { font-size: calc(12.5px * var(--font-scale, 1)); }
          .android-qr-link{
  top:14px;
  right:10px;
  width:58px;
  height:58px;
  padding:2px;
}

.android-title-row{
  padding-right:65px;
}
        }
      `}</style>
    </section>
  );
}
