import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HeroStatsBanner from "./HeroStatsBanner";
import HeroBottomBanner from "./HeroBottomBanner";
import { LanguageContext } from "../../pages/LanguageContext";

// Images
import heroBBBG from "../../assets/NewHero/heroBBBG.png";
import womBg from "../../assets/NewHero/wom_bg.png";
import hinLine from "../../assets/NewHero/binge_line.png";

export default function HeroHome() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const scrollToServices = () => {
    document
      .getElementById("services-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };
   const content = {

    en: {
      tagline:
        "Empowered Women | Prosperous Uttar Pradesh",

      heading1:
        "Stronger",

      heading2:
        "Self Help Groups",

      heading3:
        "Brighter Tomorrows",

      description:
        "Pragati Setu is a unified digital platform to strengthen, monitor and support SHG-related activities across Uttar Pradesh, enabling transparent governance and sustainable rural livelihoods.",

      explore:
        "Explore Our Services",

      knowMore:
        "Know More",

      // womenAlt:
      //   "Rural Women Uttar Pradesh",

      // hindiAlt:
      //   "Women Empowerment",
    },


    hi: {
      tagline:
        "सशक्त महिलाएं | समृद्ध उत्तर प्रदेश",

      heading1:
        "सशक्त",

      heading2:
        "स्वयं सहायता समूह",

      heading3:
        "उज्ज्वल भविष्य",

      description:
        "प्रगति सेतु उत्तर प्रदेश में स्वयं सहायता समूहों (SHG) से जुड़ी गतिविधियों को मजबूत करने, उनकी निगरानी करने और सहयोग प्रदान करने के लिए एक एकीकृत डिजिटल प्लेटफ़ॉर्म है, जो पारदर्शी शासन और सतत ग्रामीण आजीविका को बढ़ावा देता है।",

      explore:
        "हमारी सेवाएं देखें",

      knowMore:
        "और जानें",

      // womenAlt:
      //   "उत्तर प्रदेश की ग्रामीण महिलाएं",

      // hindiAlt:
      //   "महिला सशक्तिकरण",
    },

  };


  const t = content[lang] || content.en;


  return (
    <div className="hero-home-wrapper">
      {/* 1. SINGLE BACKGROUND IMAGE (Backest Layer - Right Side) */}
      <div className="hero-background-layer">
        <img
          src={womBg}
          alt="Rural Women Uttar Pradesh"
          className="hero-background-img"
        />
        {/* Dark overlay specifically for the right side to make the white floating card pop */}
        <div className="hero-gradient-overlay"></div>
      </div>

      {/* 2. THE ANGLED CUT BACKGROUND (Middle Layer - Left Side) */}
      <div
        className="hero-angled-bg"
        style={{ backgroundImage: `url(${heroBBBG})` }}
      ></div>

      <img
        src={hinLine}
        alt="Mahila Sashaktikaran"
        className="hero-hindi-text"
        style={{
          width: "280px",
          height: "auto",
          filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))",
        }}
      />

      {/* 3. FOREGROUND CONTENT (Top Layer) */}
      <div className="hero-content-layer">
        <div className="hero-text-content">
          <div className="hero-tagline">
            <span className="red-dash"></span>
             {t.tagline}

          </div>

          <h1 className="hero-h1">
             {t.heading1}
            <br />
            {t.heading2}
            <br />
            <span className="text-orange">{t.heading3}</span>
          </h1>

          <p className="hero-description">
            {t.description}

          </p>

          <div className="hero-actions">
            <button className="btn-explore" onClick={scrollToServices}>
             {t.explore}{" "}
              <FaArrowRight style={{ marginLeft: "8px" }} />
            </button>
            <button
              className="btn-know-more"
              onClick={() => navigate("/about-us")}
            >
              {t.knowMore}
            </button>
          </div>
        </div>
      </div>

      {/* 4. STATS BANNER */}
      <div className="hero-stats-wrapper">
        <HeroStatsBanner />
      </div>

      {/* 5. BOTTOM NAVY BANNER */}
      <HeroBottomBanner />

      <style>{`
        .hero-home-wrapper {
          position: relative;
          width: 100%;
          height: 95vh;
          min-height: 650px;
          overflow: hidden;
          background: #f1f5f9;
        }

        /* 1. Static Background Layer (Right Side) */
        .hero-background-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-background-img {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 55%; /* Restricts stretch to the right side, naturally zooming it out */
          height: 100%;
          object-fit: cover;
          object-position: right center; /* Keeps the women perfectly in frame */
        }
        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to left, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%);
        }

        /* 2. Angled Cut Background (Left Side) */
        .hero-angled-bg {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 65%;
          z-index: 2;
          background-size: cover;
          background-position: left center;
          background-repeat: no-repeat;
          /* The magic arrow cut matching the chevron reference */
          clip-path: polygon(0 0, 75% 0, 87% 35%, 60% 100%, 0 100%);
        }

        /* 3. Floating Hindi Text */
        .hero-hindi-text {
        position: absolute;
        top: 22%;
        left: 42%;
        z-index: 4;

        font-family: 'Brush Script MT', cursive;
        font-size: 26px;
        line-height: 1.2;
        color: #002174;
        font-weight: 800;

        transform: rotate(-8deg);

        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        }

        /* 4. Foreground Content */
        .hero-content-layer {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          padding: 8% 5% 0 5%;
          pointer-events: none; /* Let clicks pass to background if needed */
        }
        .hero-text-content {
          max-width: 600px;
          pointer-events: auto;
        }

        .hero-tagline {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ea580c;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
        }
        .red-dash { width: 24px; height: 3px; background: #ea580c; border-radius: 2px; }

        .hero-h1 {
          font-size: 54px;
          font-weight: 900;
          color: #002174;
          line-height: 1.1;
          margin: 0 0 20px 0;
        }
        .text-orange { color: #ea580c; }

        .hero-description {
          font-size: 16px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 500px;
          font-weight: 500;
        }

        .hero-actions { display: flex; gap: 16px; }
        .btn-explore {
          background: #ea580c; color: #fff; border: none; padding: 14px 28px;
          border-radius: 8px; font-weight: 700; font-size: 15px; display: flex; align-items: center;
          cursor: pointer; box-shadow: 0 4px 12px rgba(234,88,12,0.3); transition: transform 0.2s;
        }
        .btn-explore:hover { transform: translateY(-2px); }
        
        .btn-know-more {
          background: #ffffff; color: #002174; border: 2px solid #cbd5e1; padding: 14px 28px;
          border-radius: 8px; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-know-more:hover { background: #f8fafc; border-color: #94a3b8; }

        /* Floating Right Card */
        .hero-floating-card {
          pointer-events: auto;
          background: #ffffff; padding: 16px 20px; border-radius: 12px;
          display: flex; align-items: center; gap: 16px; height: fit-content;
          margin-top: auto; margin-bottom: 120px; margin-right: 40px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .fc-icon { font-size: 28px; }
        .fc-text { font-size: 14px; color: #0f172a; line-height: 1.4; }
        .fc-arrow-btn {
          background: #ea580c; color: white; border: none; border-radius: 50%;
          width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; cursor: pointer;
        }

        /* 5. Stats Wrapper */
        .hero-stats-wrapper {
        position: absolute;
        bottom: 75px; /* Sits right above the navy banner */
        left: 24%;
        transform: translateX(-50%);
        z-index: 5;
        pointer-events: auto;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1366px){
           .hero-stats-wrapper { display: none; }
        }

        @media (max-width: 1766px) {
            .hero-hindi-text { display: none; }
            .hero-stats-wrapper { display: none; }
        }

        @media (max-width: 1100px) {
          .hero-angled-bg { width: 75%; clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%); }
          .hero-hindi-text { display: none; }
          .hero-h1 { font-size: 42px; }
          .hero-stats-wrapper { display: none; }
        }

        @media (max-width: 768px) {
          .hero-home-wrapper { height: auto; min-height: auto; padding-bottom: 250px; }
          .hero-angled-bg { width: 100%; clip-path: none; background: rgba(255,255,255,0.9); }
          .hero-background-img { opacity: 0.3; } /* Dim background on mobile */
          .hero-gradient-overlay { display: none; }
          .hero-hindi-text { display: none; }
          .hero-content-layer { position: relative; padding: 40px 20px; }
          .hero-h1 { font-size: 36px; }
          .hero-floating-card { display: none; }
          .hero-stats-wrapper { display: none; }
        }
      `}</style>
    </div>
  );
}
