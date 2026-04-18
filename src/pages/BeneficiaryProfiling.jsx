// src/pages/AboutPragatiSetu.jsx
import React, { useEffect, useContext } from "react";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import aboutImg from "../assets/Rural-Women-Entrepreneurs.jpeg";
import TopNavigation from "./HeaderTopNav.jsx";
import GovHeader from "./GovHeader.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext"; // ✅ ADD

export default function AboutPragatiSetu() {
  const { lang } = useContext(LanguageContext); // ✅ USE

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
      title1: "Beneficiary",
      title2: "Profiling",
      p1: `Pragati Setu is a comprehensive digital governance platform designed to strengthen rural development initiatives under the State Rural Livelihood Mission. The platform connects government departments, field officials, and beneficiaries through a single integrated system to ensure transparency, efficiency, and accountability in service delivery.`,
      p2: `It enables real-time data collection, monitoring, and analytics for various welfare schemes and livelihood programs. By digitizing manual processes, Pragati Setu reduces delays, improves accuracy, and helps decision-makers track progress effectively across districts and villages.`,
      p3: `Key features of Pragati Setu include Beneficiary Profiling, Lakhpati Didi Management, Training Management System (TMS), Enterprise Tracking, User Management, and Performance Dashboards.`,
    },

    hi: {
      title1: "लाभार्थी",
      title2: "प्रोफाइलिंग",
      p1: `प्रगति सेतु एक व्यापक डिजिटल गवर्नेंस प्लेटफॉर्म है, जिसे राज्य ग्रामीण आजीविका मिशन के अंतर्गत ग्रामीण विकास पहलों को मजबूत करने के लिए विकसित किया गया है। यह प्लेटफॉर्म सरकारी विभागों, फील्ड अधिकारियों और लाभार्थियों को एकीकृत प्रणाली के माध्यम से जोड़ता है, जिससे सेवा वितरण में पारदर्शिता, दक्षता और जवाबदेही सुनिश्चित होती है।`,
      p2: `यह विभिन्न कल्याणकारी योजनाओं और आजीविका कार्यक्रमों के लिए रियल-टाइम डेटा संग्रह, निगरानी और विश्लेषण को सक्षम बनाता है। मैनुअल प्रक्रियाओं को डिजिटाइज़ करके, प्रगति सेतु देरी को कम करता है, सटीकता बढ़ाता है और निर्णय लेने वालों को जिलों और गांवों में प्रगति को प्रभावी ढंग से ट्रैक करने में मदद करता है।`,
      p3: `प्रगति सेतु की प्रमुख विशेषताओं में लाभार्थी प्रोफाइलिंग, लखपति दीदी प्रबंधन, प्रशिक्षण प्रबंधन प्रणाली (TMS), एंटरप्राइज ट्रैकिंग, यूज़र मैनेजमेंट और प्रदर्शन डैशबोर्ड शामिल हैं।`,
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="home-shell">
      {/* ================= HEADER ================= */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* ================= MAIN ================= */}
      <main className="page-main">
        <h1 className="about-left">
          <span className="contrast-color-two">{t.title1}</span>
          <span className="contrast-color-one"> {t.title2}</span>
        </h1>

        <div className="about-section">
          {/* LEFT IMAGE */}
          <div className="about-left">
            <img src={aboutImg} alt="Pragati Setu Diagram" />
          </div>

          {/* RIGHT TEXT */}
          <div className="about-right">
            <div className="pragati-card">
              <p>{t.p1}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom-section">
          <div className="pragati-card">
            <p>{t.p2}</p>
          </div>

          <div className="pragati-card">
            <p>{t.p3}</p>
          </div>
        </div>
      </main>
      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`

        /* ===== ROOT ===== */
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
            .contrast-color-one {
      color: #ff7a00;
  }

  .contrast-color-two {
     color: #0f172a;
  }
.about-left  {
          font-size: 38px;
            font-weight: 800;
            margin-bottom: 18px;
            color: #0f172a;
          }
        :root {
          --font-scale: 1;
        }

        body {
          font-size: calc(16px * var(--font-scale));
        }

        /* ===== MAIN LAYOUT ===== */
        .about-section {
          max-width: 1400px;
          margin: 60px auto 40px auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .about-left {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .about-left img {
          width: 100%;
          max-width: 600px;
          height: auto;
          object-fit: contain;
          border-radius: 18px;
        }

        .about-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* ===== BOTTOM SECTION ===== */
        .bottom-section {
          max-width: 1400px;
          margin: 20px auto 80px auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        /* ===== CARD DESIGN ===== */
        .pragati-card {
          padding: 30px 35px;
          background: #ffffff;
          border: 2px solid #ff7a00;
          border-radius: 18px;
          box-shadow: 0 6px 12px rgba(255, 122, 0, 0.25);
          transition: all 0.3s ease;
        }

        .pragati-card p {
          font-size: 17px;
          line-height: 1.8;
          color: #334155;
          margin: 0;
        }

        .pragati-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 18px rgba(255, 122, 0, 0.35);
        }

        /* ===== FOOTER ===== */
        .home-footer {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 992px) {
          .about-section {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .bottom-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .about-section {
            margin: 30px 20px;
            gap: 30px;
          }

          .bottom-section {
            margin: 10px 20px 60px 20px;
            gap: 25px;
          }

          .pragati-card {
            padding: 22px;
          }

          .pragati-card p {
            font-size: 15px;
          }
        }

      `}</style>
    </div>
  );
}
