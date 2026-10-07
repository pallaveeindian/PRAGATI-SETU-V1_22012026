// src/pages/PublicTMS/TMSHero.jsx

import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";
import { useNavigate } from "react-router-dom";
import tmsHeroBg from "../../assets/TMS/tms_hero_bg.png";
import tmsHeroImg from "../../assets/TMS/tms_hero_right2.png";

const content = {
  en: {
    breadcrumb1: "Our Services",
    breadcrumb2: "Training Management",
    title: "Training Management",
    description:
      "A digital Training Management System (TMS) to plan, manage and monitor trainings under UPSRLM, enabling stronger skills, empowered women and sustainable livelihoods across Uttar Pradesh.",
    explore: "Explore Features",
    knowMore: "Know More",
  },
  hi: {
    breadcrumb1: "हमारी सेवाएं",
    breadcrumb2: "प्रशिक्षण प्रबंधन",
    title: "प्रशिक्षण प्रबंधन",
    description:
      "UPSRLM के अंतर्गत प्रशिक्षण की योजना, प्रबंधन और निगरानी के लिए एक डिजिटल प्रशिक्षण प्रबंधन प्रणाली, जो बेहतर कौशल, महिला सशक्तिकरण और सतत ग्रामीण आजीविका को बढ़ावा देती है।",
    explore: "विशेषताएं देखें",
    knowMore: "और जानें",
  },
};

const scrollToSection = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function TMSHero() {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const t = content[lang] || content.en;

  return (
    <section className="tms-hero">
      <div className="tms-left-image">
        <img src={tmsHeroBg} alt="" aria-hidden="true" />
      </div>

      <div className="tms-hero-content">
        <div className="tms-breadcrumb">
          <span className="tms-breadcrumb-line"></span>
          <span>{t.breadcrumb1}</span>
          <span className="tms-breadcrumb-arrow">›</span>
          <span>{t.breadcrumb2}</span>
        </div>

        <h1 className="tms-title">{t.title}</h1>
        <p className="tms-description">{t.description}</p>

        <div className="tms-buttons">
          <button
            type="button"
            className="tms-primary-btn"
            onClick={() => navigate("/module-login?module=tms")}
          >
            <span>{t.explore}</span>
            <span className="tms-btn-arrow">→</span>
          </button>

          <button
            type="button"
            className="tms-secondary-btn"
            onClick={() => scrollToSection("tms-overview")}
          >
            {t.knowMore}
          </button>
        </div>
      </div>

      <div className="tms-hero-image">
        <img src={tmsHeroImg} alt="Training Management System" />
      </div>

      <style>{`
        .tms-hero, .tms-hero * {
          box-sizing: border-box;
        }

        /* no margin-top: the nav above is in normal flow, hero starts right below it */
        .tms-hero {
          position: relative;
          width: 100%;
          height: 430px;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #fff8f2;
        }

        /* both image containers fill the full hero height */
        .tms-left-image, .tms-hero-image {
          position: absolute;
          top: 0;
          bottom: 0;
          height: 100%;
          overflow: hidden;
        }

        .tms-left-image {
          z-index: 1;
          left: 0;
          width: 52%;
          background: #fff8f2;
        }
        .tms-left-image img {
          display: block;
          width: 100%;
          height: 100%;
          /* shows the complete image; switch to "contain" if it looks stretched */
          object-fit: fill;
          object-position: left center;
        }

        .tms-hero-content {
          position: relative;
          z-index: 5;
          width: 48%;
          max-width: 720px;
          padding: 55px 25px 35px clamp(45px, 6vw, 95px);
        }

        .tms-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #e95d0f;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 700;
        }
        .tms-breadcrumb-line {
          width: 24px;
          height: 2px;
          flex-shrink: 0;
          background: #f97316;
          border-radius: 10px;
        }
        .tms-breadcrumb-arrow { color: #f97316; font-size: 16px; }

        .tms-title {
          margin: 0 0 12px;
          color: #071b4d;
          font-size: calc(50px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1px;
        }

        .tms-description {
          width: 100%;
          max-width: 600px;
          margin: 0 0 24px;
          color: #17375e;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.5;
        }

        .tms-buttons {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .tms-primary-btn, .tms-secondary-btn {
          height: 44px;
          padding: 0 24px;
          border-radius: 6px;
          font-family: inherit;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .tms-primary-btn {
          min-width: 190px;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border: none;
          background: #ff5b0b;
          color: #ffffff;
          box-shadow: 0 5px 14px rgba(255, 91, 11, 0.24);
        }
        .tms-primary-btn:hover {
          background: #e94e00;
          transform: translateY(-2px);
          box-shadow: 0 7px 18px rgba(255, 91, 11, 0.3);
        }
        .tms-btn-arrow { font-size: 16px; transition: transform 0.25s ease; }
        .tms-primary-btn:hover .tms-btn-arrow { transform: translateX(4px); }

        .tms-secondary-btn {
          min-width: 140px;
          border: 1.5px solid #193d70;
          background: #ffffff;
          color: #08275c;
        }
        .tms-secondary-btn:hover {
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .tms-hero-image {
          z-index: 2;
          right: 0;
          width: 54%;
          background: #fff8f2;
          /* angled transition */
          clip-path: polygon(9% 0, 100% 0, 100% 100%, 0 100%);
        }
        .tms-hero-image img {
          display: block;
          width: 100%;
          height: 100%;
          /* full image, no cropping; switch to "contain" if it looks stretched */
          object-fit: fill;
          object-position: right center;
        }
        /* soft transition */
        .tms-hero-image::before {
          content: "";
          position: absolute;
          z-index: 3;
          top: 0;
          bottom: 0;
          left: 0;
          width: 65px;
          background: linear-gradient(90deg, rgba(255, 248, 242, 0.7), rgba(255, 248, 242, 0.15), transparent);
          pointer-events: none;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .tms-hero { height: 450px; }
          .tms-left-image { width: 50%; }
          .tms-hero-image { width: 55%; }
          .tms-hero-content {
            width: 47%;
            padding: 58px 30px 38px clamp(70px, 7vw, 120px);
          }
          .tms-title { font-size: calc(54px * var(--font-scale, 1)); }
          .tms-description {
            max-width: 620px;
            font-size: calc(16px * var(--font-scale, 1));
          }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .tms-hero { height: 410px; }
          .tms-left-image { width: 53%; }
          .tms-hero-image { width: 53%; }
          .tms-hero-content {
            width: 50%;
            padding: 50px 25px 32px 42px;
          }
          .tms-title { font-size: calc(42px * var(--font-scale, 1)); }
          .tms-description {
            max-width: 520px;
            font-size: calc(14px * var(--font-scale, 1));
          }
          .tms-primary-btn, .tms-secondary-btn {
            height: 42px;
            font-size: calc(12px * var(--font-scale, 1));
          }
        }

        /* 1024px small laptop / tablet */
        @media (max-width: 1024px) {
          .tms-hero { height: 390px; }
          .tms-left-image { width: 55%; }
          .tms-hero-image { width: 51%; }
          .tms-hero-content {
            width: 52%;
            padding: 45px 20px 28px 28px;
          }
          .tms-title { font-size: calc(36px * var(--font-scale, 1)); }
          .tms-description {
            max-width: 470px;
            font-size: calc(13px * var(--font-scale, 1));
            line-height: 1.45;
          }
          .tms-primary-btn, .tms-secondary-btn {
            height: 39px;
            padding: 0 17px;
            font-size: calc(11px * var(--font-scale, 1));
          }
          .tms-primary-btn { min-width: 160px; }
          .tms-secondary-btn { min-width: 115px; }
        }

        /* 900px tablet — right image removed */
        @media (max-width: 900px) {
          .tms-hero {
            height: auto;
            min-height: 385px;
          }
          .tms-left-image { width: 100%; left: 0; }
          .tms-left-image img {
            object-fit: fill;
            object-position: center;
          }
          .tms-hero-image { display: none; }
          .tms-hero-content {
            width: 100%;
            max-width: 730px;
            padding: 48px 28px 38px;
          }
          .tms-title { font-size: calc(40px * var(--font-scale, 1)); }
          .tms-description {
            max-width: 650px;
            font-size: calc(14px * var(--font-scale, 1));
          }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .tms-hero { min-height: 380px; }
          .tms-left-image { width: 100%; }
          .tms-hero-image { display: none; }
          .tms-hero-content { padding: 42px 16px 30px; }
          .tms-breadcrumb {
            gap: 6px;
            margin-bottom: 10px;
            font-size: calc(10px * var(--font-scale, 1));
          }
          .tms-breadcrumb-line { width: 18px; }
          .tms-title {
            font-size: calc(32px * var(--font-scale, 1));
            letter-spacing: -0.5px;
          }
          .tms-description {
            max-width: 520px;
            margin-bottom: 20px;
            font-size: calc(13px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .tms-buttons { gap: 10px; }
          .tms-primary-btn, .tms-secondary-btn {
            height: 40px;
            font-size: calc(11px * var(--font-scale, 1));
          }
          .tms-primary-btn { min-width: 160px; }
          .tms-secondary-btn { min-width: 110px; }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .tms-hero { min-height: 400px; }
          .tms-left-image { width: 100%; }
          .tms-hero-image { display: none; }
          .tms-hero-content { padding: 38px 13px 26px; }
          .tms-title { font-size: calc(28px * var(--font-scale, 1)); }
          .tms-description { font-size: calc(12px * var(--font-scale, 1)); }
          .tms-buttons { width: 100%; gap: 8px; }
          .tms-primary-btn, .tms-secondary-btn {
            flex: 1;
            min-width: 0;
            padding: 0 10px;
          }
          .tms-primary-btn { gap: 8px; }
        }
      `}</style>
    </section>
  );
}
