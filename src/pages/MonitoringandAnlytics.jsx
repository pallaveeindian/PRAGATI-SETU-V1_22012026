// src/pages/MonitoringandAnlytics.jsx

import React, { useEffect } from "react";
import { useLang } from "../pages/LanguageContext"; // ✅ added
import up_logo from "../assets/upgov_logo.jpg";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/power-bi.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";

export default function MonitoringandAnlytics() {
  const { lang } = useLang(); // ✅ language

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= TRANSLATIONS ================= */
  const content = {
    en: {
      title1: "Monitoring and",
      title2: "Analytics",
      p1: `The UPSRLM Progress Tracking Dashboard serves as a comprehensive digital monitoring and analytics platform that brings together programme data from districts and blocks into a unified visual interface. It is designed to enhance transparency, consistency, and speed in reviewing mission progress by replacing scattered manual records and informal reporting methods with a structured, technology-driven system.`,
      p2: `Through real-time indicators, automated validations, and interactive scorecards, the dashboard enables administrators to quickly assess performance trends, detect gaps, and take informed corrective actions. Overall, it strengthens governance efficiency, promotes data reliability, and supports timely, evidence-based decision-making across all administrative levels.`,
    },

    hi: {
      title1: "निगरानी एवं",
      title2: "विश्लेषण",
      p1: `UPSRLM प्रगति ट्रैकिंग डैशबोर्ड एक व्यापक डिजिटल निगरानी और विश्लेषण प्लेटफॉर्म है, जो जिलों और ब्लॉकों से प्राप्त कार्यक्रम डेटा को एकीकृत दृश्य इंटरफ़ेस में प्रस्तुत करता है। यह पारदर्शिता, निरंतरता और मिशन प्रगति की समीक्षा की गति को बढ़ाने के लिए डिज़ाइन किया गया है।`,
      p2: `रीयल-टाइम संकेतकों, स्वचालित सत्यापन और इंटरैक्टिव स्कोरकार्ड के माध्यम से, यह डैशबोर्ड प्रशासकों को प्रदर्शन का विश्लेषण करने, कमियों की पहचान करने और समय पर निर्णय लेने में सक्षम बनाता है।`,
    },
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
              <span className="contrast-color-two">{t.title1}</span>{" "}
              <span className="contrast-color-one">{t.title2}</span>
            </h1>

            <div className="pragati-card">
              <p>{t.p1}</p>
            </div>

            <div className="pragati-card">
              <p>{t.p2}</p>
            </div>
          </div>

          <div className="about-right">
            <img src={aboutImg} alt="Monitoring & Analytics" />
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
