// src/pages/LakhpatiDidi.jsx

import React, { useEffect } from "react";
import { useLang } from "../pages/LanguageContext"; // ✅ use language
import up_logo from "../assets/upgov_logo.jpg";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/Lakhpati-didi.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";

export default function LakhpatiDidi() {
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
      title1: "Lakhpati",
      title2: "Didi",
      p1: `Lakhpati Didi is an initiative targeting SHG members whose households earn over Rs. 1 lakh annually, aiming to improve livelihoods through sustainable farming, non-farm activities, and enhanced living standards. It leverages SHGs as platforms for collective action, financial literacy, skill development, and entrepreneurial empowerment.`,
      p2: `The program identifies eligible members, provides cascading training via Master Trainers and Community Resource Persons, and supports livelihood planning using digital tools and value chain linkages. Financial support includes revolving and community investment funds, bank linkages, women enterprise acceleration funds, and targeted grants for producer groups, enterprises, and FPOs, alongside schemes like SVEP, MED, and block-level business facilitation.`,
      p3: `Livelihood diversification is promoted through integrated farming, artisan, and sectoral clusters, combining training, market development, and common facility centers, with up to Rs. 5 crore support per cluster and convergence with other government programs.`,
    },

    hi: {
      title1: "लखपति",
      title2: "दीदी",
      p1: `लखपति दीदी एक पहल है जो स्वयं सहायता समूह (SHG) की उन महिलाओं को लक्षित करती है जिनके परिवार की वार्षिक आय 1 लाख रुपये से अधिक है। इसका उद्देश्य सतत कृषि, गैर-कृषि गतिविधियों और बेहतर जीवन स्तर के माध्यम से आजीविका में सुधार करना है।`,
      p2: `यह कार्यक्रम पात्र सदस्यों की पहचान करता है, मास्टर ट्रेनर और सामुदायिक संसाधन व्यक्तियों के माध्यम से प्रशिक्षण प्रदान करता है, और डिजिटल उपकरणों के माध्यम से आजीविका योजना को समर्थन देता है। इसमें वित्तीय सहायता जैसे सामुदायिक निवेश निधि, बैंक लिंकिंग और उद्यमिता समर्थन शामिल हैं।`,
      p3: `आजीविका विविधीकरण को एकीकृत कृषि, हस्तशिल्प और विभिन्न क्षेत्रों के क्लस्टरों के माध्यम से बढ़ावा दिया जाता है, जिसमें प्रशिक्षण, बाजार विकास और साझा सुविधाओं का समर्थन शामिल है।`,
    },
  };

  const t = content[lang]; // ✅ active language

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
          {/* LEFT CONTENT */}
          <div className="about-left">
            <h1 className="hero-title">
              <span className="contrast-color-two">{t.title1}</span>{" "}
              <span className="contrast-color-one">{t.title2}</span>
            </h1>

            <div className="hero-content">
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

            {/* CTA BUTTON */}
            <div className="aboutus-wrapper">
              <a
                href="https://lokos.dord.gov.in/lakhpatiDidiImpact"
                target="_blank"
                rel="noopener noreferrer"
                className="aboutus-btn"
              >
                About Lakhpati Didi Initiative
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="about-right">
            <img src={aboutImg} alt="Lakhpati Didi Initiative" />
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

/* LEFT CONTENT */
.about-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.about-left h1 {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 10px;
  color: #0f172a;
}

.about-left p {
  font-size: 17px;
  line-height: 1.8;
  color: #334155;
  margin: 0;
}

/* IMAGE */
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

/* COLORS */
.contrast-color-one {
  color: #ff7a00;
}

.contrast-color-two {
  color: #0f172a;
}

/* ===== CARDS ===== */
.pragati-card {
  max-width: 100%;
  padding: 22px 24px;
  background: #ffffff;
  border: 2px solid #ff7a00;
  border-radius: 14px;
  margin: 12px 0;
  box-shadow: 0 4px 10px rgba(255, 122, 0, 0.18);
  transition: all 0.25s ease;
}

.pragati-card p {
  font-size: 17px;
  line-height: 1.7;
  color: #333;
}

.pragati-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(255, 122, 0, 0.25);
}

/* ===== BUTTON FIX ===== */
.aboutus-wrapper {
  display: flex;
  justify-content: flex-start; /* left aligned (cleaner) */
  margin-top: 10px;
}

.aboutus-btn {
  text-decoration: none;
  background: linear-gradient(135deg, #c95835, #a94428);
  color: white;
  padding: 12px 22px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  display: inline-block;
}

.aboutus-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.2);
}

.aboutus-btn:active {
  transform: translateY(0);
}

/* ===== ROOT ===== */
.home-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #fff6f8 35%,
    #f9e3e6 60%,
    #f4cfd6 75%,
    #ebb8c4 100%
  );
}

/* FONT SCALE */
:root {
  --font-scale: 1;
}

body {
  font-size: calc(16px * var(--font-scale));
}

/* HERO */
.home-hero {
  width: 100%;
}

/* FOOTER */
.home-footer {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .about-section {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0 10px;
  }

  .about-left {
    align-items: center;
    text-align: center;
  }

  .about-left h1 {
    font-size: 28px;
  }

  .about-left p {
    font-size: 16px;
  }

  .pragati-card {
    margin: 10px 0;
    padding: 20px;
  }

  .pragati-card p {
    font-size: 16px;
  }

  .aboutus-wrapper {
    justify-content: center; /* center on mobile */
  }
}

@media (max-width: 480px) {
  .pragati-card {
    padding: 16px;
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
