// src/pages/AboutUs.jsx
import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import up_logo from "../assets/upgov_logo.jpg";
import aboutImg from "../assets/Hero/About/ps_diag.png";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext"; // ✅ ADD THIS

export default function AboutUs() {
  const { lang } = useContext(LanguageContext); // ✅ USE CONTEXT

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= LANGUAGE CONTENT ================= */
  const content = {
    en: {
      title1: "Our",
      title2: "Mission",
      subtitle: "A Bridge from Skill to Enterprise, Towards Prosperity",
      p1: `Pragati Setu is a comprehensive digital governance platform designed to strengthen rural development initiatives under the State Rural Livelihood Mission. The platform connects government departments, field officials, and beneficiaries through a single integrated system to ensure transparency, efficiency, and accountability in service delivery.`,
      p2: `It enables real-time data collection, monitoring, and analytics for various welfare schemes and livelihood programs. By digitizing manual processes, Pragati Setu reduces delays, improves accuracy, and helps decision-makers track progress effectively across districts and villages.`,
      p3: `Key features of Pragati Setu include Beneficiary Profiling, Lakhpati Didi Management, Training Management System (TMS), Enterprise Tracking, User Management, and Performance Dashboards.`,
    },
    hi: {
      title1: "हमारा",
      title2: "मिशन",
      subtitle: "कौशल से उद्यम तक, समृद्धि की ओर एक सेतु",
      p1: `प्रगति सेतु एक व्यापक डिजिटल गवर्नेंस प्लेटफॉर्म है, जिसे राज्य ग्रामीण आजीविका मिशन के अंतर्गत ग्रामीण विकास पहलों को मजबूत करने के लिए विकसित किया गया है। यह प्लेटफॉर्म सरकारी विभागों, फील्ड अधिकारियों और लाभार्थियों को एकीकृत प्रणाली के माध्यम से जोड़ता है, जिससे सेवा वितरण में पारदर्शिता, दक्षता और जवाबदेही सुनिश्चित होती है।`,
      p2: `यह विभिन्न कल्याणकारी योजनाओं और आजीविका कार्यक्रमों के लिए रियल-टाइम डेटा संग्रह, निगरानी और विश्लेषण को सक्षम बनाता है। मैनुअल प्रक्रियाओं को डिजिटाइज़ करके, प्रगति सेतु देरी को कम करता है, सटीकता बढ़ाता है और निर्णय लेने वालों को जिलों और गांवों में प्रगति को प्रभावी ढंग से ट्रैक करने में मदद करता है।`,
      p3: `प्रगति सेतु की प्रमुख विशेषताओं में लाभार्थी प्रोफाइलिंग, लखपति दीदी प्रबंधन, प्रशिक्षण प्रबंधन प्रणाली (TMS), एंटरप्राइज ट्रैकिंग, यूज़र मैनेजमेंट और प्रदर्शन डैशबोर्ड शामिल हैं।`,
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="about-page-shell">
      {/* ================= HEADER ================= */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      {/* ================= NAV ================= */}
      <TopNavigation />

      {/* ================= HERO ================= */}
      <main>
        <div>
          <div className="about-left">
            <h1>
              <span className="contrast-color-two">{t.title1}</span>{" "}
              <span className="contrast-color-one">{t.title2}</span>
            </h1>

            <h3>{t.subtitle}</h3>

            <main className="about-main">
              <div className="about-custom-layout">

                {/* Row 1 */}
                <div className="row-one">
                  <div className="about-right">
                    <img src={aboutImg} alt="Pragati Setu Diagram" />
                  </div>

                  <div className="pragati-card">
                    <p>{t.p1}</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="row-two">
                  <div className="pragati-card">
                    <p>{t.p2}</p>
                  </div>

                  <div className="pragati-card">
                    <p>{t.p3}</p>
                  </div>
                </div>

              </div>
            </main>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= STYLES ================= */}
      <style>{`  /* ===== PAGE SHELL ===== */
  .about-page-shell {
      background: #ffffff;
  }

  /* ===== FONT SCALING ===== */
  :root {
      --font-scale: 1;
  }

  .about-page-shell {
      font-size: calc(16px * var(--font-scale));

      background: linear-gradient(180deg,
              #ffffff 0%,
              #fff6f8 35%,
              #f9e3e6 60%,
              #f4cfd6 75%,
              #ebb8c4 100%);


  }

  .about-custom-layout {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 40px;
  }

  /* Row 1: Image + Card */
  .row-one {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
  }

  /* Row 2: Two Cards */
  .row-two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
  }

  /* Remove auto centering for side-by-side cards */
  .row-one .pragati-card,
  .row-two .pragati-card {
      margin: 0;
      max-width: 100%;
  }

  /* ===== ABOUT SECTION ===== */


  .about-section {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;

  }

  .about-left h1 {
      font-size: 38px;
      font-weight: 800;
      margin-bottom: 18px;
      color: #ff7a00;
      text-align: center;
  }

  .contrast-color-one {
      color: #ff7a00;
  }

  .contrast-color-two {
      color: #0f172a;
  }

  .about-left h3 {
      font-size: 22px;
      font-weight: 500;
      margin-bottom: 18px;
      color: #0f172a;
      text-align: center;
  }

  .about-left p {
      font-size: 17px;
      line-height: 1.8;
      color: #334155;
      margin-bottom: 14px;
  }

  .about-right {
      display: flex;
      justify-content: center;
  }

  .about-right img {
      width: 100%;
      max-width: 780px;
      height: auto;
      object-fit: contain;
  }

  /* ===== FOOTER ===== */
  footer {
      margin-top: 60px;
      text-align: center;
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

  /* ===== MEDIA QUERIES ===== */
  @media (max-width: 992px) {

      .row-one,
      .row-two {
          grid-template-columns: 1fr;
      }

      .about-section {
          grid-template-columns: 1fr;
          gap: 30px;
      }

      .about-left h1 {
          font-size: 28px;
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
  }`}</style>
    </div>
  );
}
