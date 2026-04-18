// src/pages/WhatsNew.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/Su-sakhi.png";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import { useLang } from "./LanguageContext"; //  ADD

export default function WhatsNew() {

  const { lang } = useLang(); //  LANGUAGE HOOK

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="home-shell">

      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* CONTENT */}
      <main className="home-hero">
        <div className="about-section">
          <div className="about-left">

            <h1>
              <span className="contrast-color-two">
                {lang === "hi" ? "क्या नया है" : "What's"}
              </span>
              <span className="contrast-color-one">
                {lang === "hi" ? " नया" : " New"}
              </span>
            </h1>

            {/* CARD 1 */}
            <div className="pragati-card">
              <p>
                {lang === "hi"
                  ? <>
                    हम आगामी <strong>सुक्ष्म उद्योग सखी एंड्रॉयड एप्लिकेशन</strong> को प्रस्तुत करने के लिए उत्साहित हैं, जो प्रगति सेतु के तहत <strong>उद्यम सर्वेक्षण और जागरूकता गतिविधियों</strong> को मजबूत करने के लिए एक शक्तिशाली डिजिटल उपकरण है। यह ऐप भविष्य में <strong>Google Play Store</strong> के माध्यम से डाउनलोड के लिए उपलब्ध होगा।
                  </>
                  : <>
                    We are excited to introduce the upcoming{" "}
                    <strong>Suksham Udyam Sakhi Android Application</strong>, a powerful digital tool designed to strengthen{" "}
                    <strong>Enterprise Survey and Awareness activities under Pragati Setu</strong>. The application will be available for download in the future through the <strong>Google Play Store</strong>, making it easily accessible for authorized users across the state.
                  </>}
              </p>
            </div>

            {/* CARD 2 */}
            <div className="pragati-card">
              <p>
                {lang === "hi"
                  ? <>
                    सुक्ष्म उद्योग सखी एक मोबाइल एप्लिकेशन है जिसे <strong>उद्यम सर्वेक्षण, जागरूकता और आजीविका योजना</strong> को समर्थन देने के लिए बनाया गया है। यह SHG सदस्यों के लिए गांव स्तर पर उद्यम जानकारी को डिजिटल रूप में एकत्र और प्रबंधित करने में मदद करता है।
                  </>
                  : <>
                    Suksham Udyam Sakhi is a mobile application created to support{" "}
                    <strong>enterprise survey, awareness, and livelihood planning</strong> for Self-Help Group (SHG) members at the village level. It helps field workers and community members collect and manage enterprise information in a simple digital format.
                  </>}
              </p>
            </div>

            {/* CARD 3 */}
            <div className="pragati-card">
              <p>
                {lang === "hi"
                  ? <>
                    यह ऐप <strong>मौजूदा व्यवसायों, नए उद्यम विचारों, विस्तार योजनाओं, वित्तीय आवश्यकताओं और कौशल/प्रशिक्षण आवश्यकताओं</strong> को रिकॉर्ड करने में सक्षम बनाता है। यह SHG सदस्यों की चुनौतियों को भी दर्ज करता है और उपयुक्त सहायता प्रदान करने में मदद करता है।
                  </>
                  : <>
                    The app enables users to record details of{" "}
                    <strong>existing businesses, new enterprise ideas, expansion plans, financial needs, and skill or training requirements</strong>. It also captures challenges faced by SHG members and helps identify suitable support.
                  </>}
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE (UNCHANGED) */}
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
      <style>
        {" "}
        {`
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
      }`}
      </style>
    </div>
  );
}
