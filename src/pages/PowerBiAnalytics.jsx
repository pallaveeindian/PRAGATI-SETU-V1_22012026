// src/pages/PowerBiAnalytics.jsx

import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/analytics-dashboards.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import { LanguageContext } from "./LanguageContext";

export default function PowerBIAnlytics() {

  const { lang } = useContext(LanguageContext);

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= FULL CONTENT (UNCHANGED) ================= */
  const content = {
    en: {
      title1: "Power BI ",
      title2: "Analytics",
      p1: `The UPSRLM Progress Tracking Dashboard is a centralized Power BI
      platform that provides real-time, reliable, and standardized
      visibility into programme implementation across districts and
      blocks in Uttar Pradesh. It replaces fragmented manual
      reporting, paper registers, and ad-hoc communication channels,
      consolidating data into a single authoritative digital view to
      support evidence-based decision-making.`,
      p2: `The system integrates data from multiple thematic verticals,
      enabling accurate monitoring of field-level operations,
      supervision, and reporting. It automates KPIs, alerts, and
      drill-down analytics, improving data quality, reducing errors,
      and ensuring timely insights for block, district, and state
      administrators. Each user role is defined to control access
      while maintaining accountability and transparency.`,
      p3: `By replacing manual workflows with structured, visual, and
      data-driven monitoring, the dashboard strengthens governance,
      enhances performance tracking, and supports informed
      decision-making across all administrative levels.`
    },
    hi: {
      title1: "पावर BI ",
      title2: "एनालिटिक्स",
      p1: `UPSRLM प्रोग्रेस ट्रैकिंग डैशबोर्ड एक केंद्रीकृत Power BI
      प्लेटफॉर्म है जो उत्तर प्रदेश के जिलों और ब्लॉकों में कार्यक्रम
      कार्यान्वयन की वास्तविक समय, विश्वसनीय और मानकीकृत दृश्यता
      प्रदान करता है। यह बिखरी हुई मैनुअल रिपोर्टिंग, कागजी रजिस्टर
      और अनौपचारिक संचार तरीकों को समाप्त करके डेटा को एक एकीकृत
      डिजिटल प्लेटफॉर्म में प्रस्तुत करता है जिससे बेहतर निर्णय लेने
      में सहायता मिलती है।`,
      p2: `यह सिस्टम विभिन्न थीमैटिक वर्टिकल्स से डेटा को एकीकृत करता है,
      जिससे फील्ड-लेवल ऑपरेशन्स, मॉनिटरिंग और रिपोर्टिंग को सटीक बनाया
      जा सकता है। यह KPIs, अलर्ट और एनालिटिक्स को ऑटोमेट करता है,
      जिससे डेटा की गुणवत्ता बेहतर होती है और त्रुटियाँ कम होती हैं।`,
      p3: `मैनुअल प्रक्रियाओं को हटाकर और डेटा-ड्रिवन डैशबोर्ड लागू करके,
      यह सिस्टम गवर्नेंस को मजबूत करता है, प्रदर्शन ट्रैकिंग को बेहतर
      बनाता है और सभी प्रशासनिक स्तरों पर सूचित निर्णय लेने में मदद करता है।`
    }
  };

  const t = content[lang];

  return (
    <div className="home-shell">

      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      <main className="home-hero">
        <div className="about-section">
          <div className="about-left">
            <h1>
              <span className="contrast-color-two">{t.title1}</span>
              <span className="contrast-color-one">{t.title2}</span>
            </h1>

            <div className="pragati-card">
              <p>{t.p1}</p>
            </div>

            <div className="pragati-card">
              <p>{t.p2}</p>
            </div>

            <div className="pragati-card">
              <p>{t.p3}</p>
            </div>
          </div>

          <div className="about-right">
            <img src={aboutImg} alt="Pragati Setu Diagram" />
          </div>
        </div>
      </main>
      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
                         /* ===== ABOUT LAYOUT ===== */
                   .about-section {
                     max-width: 1400px;
                     margin: 60px auto;
                     display: grid;
                     grid-template-columns: 1.1fr 0.9fr;
                     gap: 40px;
                     align-items: center;
                   }
                   
                   .about-left h1 {
                     font-size: 38px;
                     font-weight: 800;
                     margin-bottom: 18px;
                     color: #0f172a;
                   }
                   
                   .about-left p {
                     font-size: 17px;
                     line-height: 1.8;
                     color: #334155;
                     margin-bottom: 14px;
                   }
                   
                   /* IMAGE SIZE FIX */
                   .about-right {
                     display: flex;
                     justify-content: center;
                   }
                   
                   .about-right img {
                     width: 100%;
                     max-width: 780px;
                     height: auto;
                     object-fit: contain;
                     border-radius: 16px;
                   }
                     .contrast-color-one {
      color: #ff7a00;
  }

  .contrast-color-two {
      color: #0f172a;
  }
                      .pragati-card {
      max-width: 900px;
      margin: 40px auto;
      padding: 30px 35px;
      background: #ffffff;
      border: 2px solid #ff7a00;
      /* Orange Border */
      border-radius: 16px;
      box-shadow: 0 5px 5px rgba(255, 122, 0, 0.25);
      /* Orange Shadow */
      transition: all 0.3s ease;
  }

  .pragati-card p {
      font-size: 18px;
      line-height: 1.7;
      color: #333;
      margin: 0; 
  }

  /* Hover Effect */
  .pragati-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 2px 5px rgba(255, 122, 0, 0.35);
  }
                           /* ===== Root shell ===== */
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
                   
                           /* ================= GLOBAL FONT SCALING ================= */
                           :root {
                             --font-scale: 1;
                           }
                   
                           body {
                             font-size: calc(16px * var(--font-scale));
                           }
                   
                           
                           /* ===== HERO ===== */
                           .home-hero {
                             width: 100%;
                             overflow-x: visible;
                           }
                   
                           .hero-inner {
                             width: 100%;
                           }
                   
                           /* ===== FOOTER ===== */
                           .home-footer {
                             text-align: center;
                             font-size: 28px;
                             font-weight: 800;
                           }
                              @media (max-width: 992px) {
      .about-section {
          grid-template-columns: 1fr;
          gap: 30px;
          padding-left: 5px;
          padding-right: 5px
      }

      .about-left h1 {
          font-size: 28px;
          text-align: center;
      }

      .about-left h3 {
          font-size: 20px;
      }

      .about-left p {
          font-size: 16px;
      }
           .pragati-card {
    margin: 20px;
    padding: 22px;
  }

  .pragati-card p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .pragati-card {
    padding: 18px;
    border-radius: 12px;
  }

  .pragati-card p {
    font-size: 15px;
  }
      }
                         `}</style>
    </div>
  );
}
