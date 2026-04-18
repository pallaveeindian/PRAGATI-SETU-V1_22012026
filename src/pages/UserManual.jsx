// src/pages/UserManual.jsx

import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/User-manual.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import { LanguageContext } from "./LanguageContext";

export default function UserManual() {

  const { lang } = useContext(LanguageContext);

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= CONTENT (UNCHANGED ENGLISH + HINDI ADDED) ================= */
  const content = {
    en: {
      title1: "User",
      title2: " Manual",
      p1: `The Pragati Setu Login Process provides secure and role-based access to various mission applications including BMS, TMS, LDMS, and EMS. Users begin by opening the official Pragati Setu login page through a supported web browser and selecting the required application module based on their operational needs.`,
      p2: `The system supports multiple User Types such as Admin and General Users, followed by selection of an authorized Role including State IT Admin, PMU IT Admin, SMMU, DMMU, BMMU, and other designated roles. This ensures that each user gains access only to the features and data permitted under their responsibility and administrative level.`,
      p3: `After selecting the application and role, users must enter their registered Username and Password credentials and click the Log In button. Upon successful authentication, the system redirects the user to the respective dashboard. This structured login workflow enhances security, prevents unauthorized access, and ensures controlled and efficient digital operations across all administrative tiers.`
    },
    hi: {
      title1: "यूज़र",
      title2: " मैनुअल",
      p1: `प्रगति सेतु लॉगिन प्रक्रिया विभिन्न मिशन एप्लिकेशनों जैसे BMS, TMS, LDMS और EMS तक सुरक्षित और भूमिका-आधारित पहुँच प्रदान करती है। उपयोगकर्ता सबसे पहले समर्थित वेब ब्राउज़र के माध्यम से आधिकारिक लॉगिन पेज खोलते हैं और अपनी आवश्यकता के अनुसार संबंधित मॉड्यूल का चयन करते हैं।`,
      p2: `यह प्रणाली विभिन्न उपयोगकर्ता प्रकारों जैसे Admin और General Users को सपोर्ट करती है, और अधिकृत भूमिकाओं जैसे State IT Admin, PMU IT Admin, SMMU, DMMU, BMMU आदि का चयन करने की सुविधा देती है। इससे यह सुनिश्चित होता है कि प्रत्येक उपयोगकर्ता को केवल उन्हीं फीचर्स और डेटा तक पहुँच मिले जो उनकी जिम्मेदारी के अनुसार अनुमत हैं।`,
      p3: `एप्लिकेशन और भूमिका चयन के बाद, उपयोगकर्ता को अपना पंजीकृत Username और Password दर्ज करना होता है और Log In बटन पर क्लिक करना होता है। सफल लॉगिन के बाद उपयोगकर्ता को संबंधित डैशबोर्ड पर भेज दिया जाता है। यह प्रक्रिया सुरक्षा बढ़ाती है, अनधिकृत पहुँच को रोकती है और सभी प्रशासनिक स्तरों पर नियंत्रित और कुशल संचालन सुनिश्चित करती है।`
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
