// src/pages/UserManagement.jsx

import React, { useEffect, useContext } from "react";
import { LanguageContext } from "./LanguageContext.jsx";

import up_logo from "../assets/upgov_logo.jpg";
import aboutImg from "../assets/remote-management-of-business-teamwork.jpeg";

import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function UserManagement() {
  const { lang } = useContext(LanguageContext);

  /* ================= FONT SIZE ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= CONTENT ================= */
  const content = {
    en: {
      title1: "User",
      title2: "Management",

      p1: `User Management is a critical module of Pragati Setu that enables secure creation, modification, and monitoring of system users across different administrative levels. It ensures that only authorized individuals can access specific modules and data.`,

      p2: `The system is organized across multiple administrative units for effective governance. The Block Monitoring and Management Unit (BMMU) manages users at the block level, overseeing local activities and compliance. The Sub-District Monitoring and Management Unit (SMMU) coordinates users at the sub-district level, ensuring smooth operations between blocks and districts. The District Monitoring and Management Unit (DMMU) supervises district-wide operations, manages user roles, and ensures adherence to standardized procedures. Each user is assigned specific roles and permissions based on their responsibilities, enabling controlled access and streamlined workflow.`,

      p3: `This module strengthens governance transparency, prevents unauthorized access, and ensures efficient digital operations across all departments.`,
    },

    hi: {
      title1: "उपयोगकर्ता",
      title2: "प्रबंधन",

      p1: `यूज़र मैनेजमेंट प्रगति सेतु का एक महत्वपूर्ण मॉड्यूल है, जो विभिन्न प्रशासनिक स्तरों पर सिस्टम उपयोगकर्ताओं के सुरक्षित निर्माण, संशोधन और निगरानी को सक्षम बनाता है। यह सुनिश्चित करता है कि केवल अधिकृत व्यक्ति ही विशेष मॉड्यूल और डेटा तक पहुंच सकें।`,

      p2: `यह प्रणाली प्रभावी शासन के लिए विभिन्न प्रशासनिक इकाइयों में संगठित है। ब्लॉक मॉनिटरिंग एंड मैनेजमेंट यूनिट (BMMU) ब्लॉक स्तर पर उपयोगकर्ताओं का प्रबंधन करती है। सब-डिस्ट्रिक्ट मॉनिटरिंग एंड मैनेजमेंट यूनिट (SMMU) उप-जिला स्तर पर समन्वय सुनिश्चित करती है। जिला मॉनिटरिंग एंड मैनेजमेंट यूनिट (DMMU) जिला स्तर पर संचालन की निगरानी करती है और उपयोगकर्ता भूमिकाओं का प्रबंधन करती है। प्रत्येक उपयोगकर्ता को उसकी जिम्मेदारियों के अनुसार विशिष्ट भूमिकाएं और अनुमतियां दी जाती हैं, जिससे नियंत्रित पहुंच और सुव्यवस्थित कार्यप्रवाह सुनिश्चित होता है।`,

      p3: `यह मॉड्यूल पारदर्शिता को मजबूत करता है, अनधिकृत पहुंच को रोकता है और सभी विभागों में कुशल डिजिटल संचालन सुनिश्चित करता है।`,
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="home-shell">
      {/* HEADER */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* CONTENT */}
      <main className="home-hero">
        <div className="about-section">
          {/* LEFT */}
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

          {/* RIGHT IMAGE */}
          <div className="about-right">
            <img src={aboutImg} alt="User Management" />
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
