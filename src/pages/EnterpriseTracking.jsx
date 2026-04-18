// src/pages/EnterpriseTracking.jsx

import React, { useEffect } from "react";
import { useLang } from "../pages/LanguageContext"; // ✅ added
import up_logo from "../assets/upgov_logo.jpg";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/Ep-sakhi.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";

export default function EnterpriseTracking() {
  const { lang } = useLang(); // ✅ current language

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= TRANSLATIONS ================= */
  const content = {
    en: {
      title1: "Enterprise",
      title2: "Tracking",
      p1: `The Enterprise Tracking System is designed to streamline and improve the collection, management, and monitoring of enterprise-related data at the village level. It replaces manual registers and fragmented data collection, ensuring accurate, timely, and structured recording of enterprise activities.`,
      p2: `The system enables tracking of existing enterprises, supports new enterprise planning, captures information on wage-employment interest, identifies challenges faced by entrepreneurs, and facilitates access to financial support through CIF fund linkage.`,
      p3: `Its purpose is to enhance decision-making, provide reliable data for monitoring and reporting, support Sakhis in their entrepreneurial activities, and ensure effective implementation of livelihood and enterprise development programs.`,
    },

    hi: {
      title1: "उद्यम",
      title2: "ट्रैकिंग",
      p1: `उद्यम ट्रैकिंग प्रणाली को ग्राम स्तर पर उद्यम से संबंधित डेटा के संग्रह, प्रबंधन और निगरानी को बेहतर और सरल बनाने के लिए डिज़ाइन किया गया है। यह मैनुअल रजिस्टर और बिखरे हुए डेटा संग्रह को हटाकर सटीक, समय पर और संरचित डेटा रिकॉर्डिंग सुनिश्चित करता है।`,
      p2: `यह प्रणाली मौजूदा उद्यमों की ट्रैकिंग, नए उद्यमों की योजना बनाने, रोजगार में रुचि की जानकारी एकत्र करने, उद्यमियों द्वारा सामना की जाने वाली चुनौतियों की पहचान करने और CIF फंड के माध्यम से वित्तीय सहायता तक पहुँच प्रदान करने में मदद करती है।`,
      p3: `इसका उद्देश्य निर्णय लेने की क्षमता को मजबूत करना, निगरानी और रिपोर्टिंग के लिए विश्वसनीय डेटा प्रदान करना, सखियों को उनके उद्यमशील कार्यों में सहायता करना और आजीविका एवं उद्यम विकास कार्यक्रमों के प्रभावी कार्यान्वयन को सुनिश्चित करना है।`,
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

            <div className="pragati-card">
              <p>{t.p3}</p>
            </div>
          </div>

          <div className="about-right">
            <img src={aboutImg} alt="Enterprise Tracking" />
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
