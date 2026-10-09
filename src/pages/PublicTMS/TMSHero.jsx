// src/pages/PublicTMS/TMSHero.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../LanguageContext.jsx";
import tmsHeroBg from "../../assets/TMS/tms_hero_bg.png";
import tmsHeroImgEn from "../../assets/TMS/tms_hero_right_en.png";
import tmsHeroImgHi from "../../assets/TMS/tms_hero_right_hi.png";

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
  const rightHeroImage = lang === "hi" ? tmsHeroImgHi : tmsHeroImgEn;

  return (
    <section className="tms-hero">
      {/* RIGHT INFOGRAPHIC */}
      <div className="tms-right-section">
        <img
          src={rightHeroImage}
          alt={
            lang === "hi"
              ? "प्रशिक्षण प्रबंधन प्रणाली"
              : "Training Management System"
          }
          className="tms-right-image"
        />
      </div>

      {/* LEFT DECORATIVE BACKGROUND */}
      <div className="tms-left-visual">
        <img
          src={tmsHeroBg}
          alt=""
          aria-hidden="true"
          className="tms-left-bg"
        />
      </div>

      {/* LEFT CONTENT */}
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

      <style>{`
        .tms-hero, .tms-hero * { box-sizing: border-box; }
        .tms-hero { position: relative; width: 100%; aspect-ratio: 2960 / 940; margin: 0; padding: 0; overflow: hidden; background: #fff8f2; }
        .tms-right-section { position: absolute; z-index: 1; top: 0; right: 0; bottom: 0; left: 43.5%; width: 56.5%; height: 100%; overflow: hidden; background: transparent; }
        .tms-right-image { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; background: transparent; }
        .tms-left-visual { position: absolute; z-index: 2; top: 0; left: 0; bottom: 0; width: 46.5%; height: 100%; overflow: hidden; clip-path: polygon(0 0, 100% 0, 93.55% 100%, 0 100%); filter: drop-shadow(4px 0 5px rgba(14, 52, 92, 0.08)); }
        .tms-left-bg { position: absolute; inset: 0; display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: left center; transform: scale(1.025); transform-origin: center; }
        .tms-hero-content { position: absolute; z-index: 5; top: 0; left: 0; width: 45%; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 26px clamp(45px, 4.5vw, 75px) 26px clamp(42px, 5.5vw, 95px); }
        .tms-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 13px; color: #e95d0f; font-size: calc(11px * var(--font-scale, 1)); font-weight: 700; }
        .tms-breadcrumb-line { width: 24px; height: 2px; flex-shrink: 0; background: #f97316; border-radius: 10px; }
        .tms-breadcrumb-arrow { color: #f97316; font-size: 15px; }
        .tms-title { margin: 0 0 12px; color: #071b4d; font-size: calc(45px * var(--font-scale, 1)); font-weight: 900; line-height: 1.04; letter-spacing: -1px; }
        .tms-description { width: 100%; max-width: 540px; margin: 0 0 21px; color: #17375e; font-size: calc(14px * var(--font-scale, 1)); font-weight: 500; line-height: 1.5; }
        .tms-buttons { display: flex; align-items: center; gap: 13px; flex-wrap: wrap; }
        .tms-primary-btn, .tms-secondary-btn { height: 43px; padding: 0 22px; border-radius: 6px; font-family: inherit; font-size: calc(12px * var(--font-scale, 1)); font-weight: 800; cursor: pointer; transition: 0.25s ease; }
        .tms-primary-btn { min-width: 185px; display: inline-flex; align-items: center; justify-content: space-between; gap: 20px; border: none; background: #ff5b0b; color: #ffffff; box-shadow: 0 5px 14px rgba(255, 91, 11, 0.24); }
        .tms-primary-btn:hover { background: #e94e00; transform: translateY(-2px); box-shadow: 0 7px 18px rgba(255, 91, 11, 0.30); }
        .tms-btn-arrow { font-size: 16px; transition: transform 0.25s ease; }
        .tms-primary-btn:hover .tms-btn-arrow { transform: translateX(4px); }
        .tms-secondary-btn { min-width: 135px; border: 1.5px solid #193d70; background: #ffffff; color: #08275c; }
        .tms-secondary-btn:hover { background: #f8fafc; transform: translateY(-2px); }

        @media (min-width: 1400px) {
          .tms-hero-content { padding-left: clamp(55px, 6vw, 105px); padding-right: clamp(45px, 5vw, 80px); }
          .tms-title { font-size: calc(50px * var(--font-scale, 1)); }
          .tms-description { max-width: 570px; font-size: calc(15px * var(--font-scale, 1)); }
          .tms-primary-btn, .tms-secondary-btn { height: 45px; font-size: calc(13px * var(--font-scale, 1)); }
        }
        @media (max-width: 1200px) {
          .tms-hero-content { padding: 22px 38px 22px 34px; }
          .tms-title { font-size: calc(38px * var(--font-scale, 1)); }
          .tms-description { max-width: 470px; margin-bottom: 17px; font-size: calc(12px * var(--font-scale, 1)); line-height: 1.43; }
          .tms-primary-btn, .tms-secondary-btn { height: 39px; padding: 0 16px; font-size: calc(10.5px * var(--font-scale, 1)); }
          .tms-primary-btn { min-width: 160px; }
          .tms-secondary-btn { min-width: 110px; }
        }
        @media (max-width: 1024px) {
          .tms-hero-content { padding: 18px 30px 18px 25px; }
          .tms-breadcrumb { gap: 6px; margin-bottom: 8px; font-size: calc(9px * var(--font-scale, 1)); }
          .tms-breadcrumb-line { width: 18px; }
          .tms-title { margin-bottom: 8px; font-size: calc(31px * var(--font-scale, 1)); }
          .tms-description { margin-bottom: 13px; font-size: calc(10.5px * var(--font-scale, 1)); line-height: 1.4; }
          .tms-primary-btn, .tms-secondary-btn { height: 35px; padding: 0 12px; font-size: calc(9px * var(--font-scale, 1)); }
          .tms-primary-btn { min-width: 140px; }
          .tms-secondary-btn { min-width: 95px; }
        }
        @media (max-width: 900px) {
          .tms-hero { aspect-ratio: auto; min-height: 420px; }
          .tms-right-section { display: none !important; }
          .tms-left-visual { position: absolute; inset: 0; width: 100%; height: 100%; clip-path: none; filter: none; z-index: 1; }
          .tms-left-bg { transform: none; }
          .tms-hero-content { position: relative; top: auto; left: auto; z-index: 5; width: 100%; min-height: 420px; padding: 46px 40px; align-items: flex-start; }
          .tms-breadcrumb { margin-bottom: 13px; font-size: calc(11px * var(--font-scale, 1)); }
          .tms-title { max-width: 520px; margin-bottom: 14px; font-size: calc(42px * var(--font-scale, 1)); line-height: 1.08; }
          .tms-description { max-width: 650px; margin-bottom: 24px; font-size: calc(14px * var(--font-scale, 1)); line-height: 1.55; }
          .tms-buttons { gap: 12px; }
          .tms-primary-btn, .tms-secondary-btn { height: 42px; font-size: calc(11px * var(--font-scale, 1)); }
          .tms-primary-btn { min-width: 175px; }
          .tms-secondary-btn { min-width: 125px; }
        }
        @media (max-width: 600px) {
          .tms-hero, .tms-hero-content { min-height: 430px; }
          .tms-left-bg { object-position: 20% center; }
          .tms-hero-content { padding: 44px 22px 38px; }
          .tms-breadcrumb { gap: 6px; margin-bottom: 12px; font-size: calc(10px * var(--font-scale, 1)); }
          .tms-breadcrumb-line { width: 20px; }
          .tms-title { max-width: 380px; margin-bottom: 14px; font-size: calc(35px * var(--font-scale, 1)); letter-spacing: -0.6px; }
          .tms-description { max-width: 520px; margin-bottom: 23px; font-size: calc(13px * var(--font-scale, 1)); line-height: 1.5; }
          .tms-buttons { width: 100%; gap: 10px; flex-wrap: nowrap; }
          .tms-primary-btn, .tms-secondary-btn { height: 42px; font-size: calc(10.5px * var(--font-scale, 1)); }
          .tms-primary-btn { flex: 1; min-width: 0; max-width: 190px; }
          .tms-secondary-btn { flex: 1; min-width: 0; max-width: 145px; }
        }
        @media (max-width: 400px) {
          .tms-left-bg { object-position: 25% center; }
          .tms-hero-content { padding: 38px 16px 32px; }
          .tms-breadcrumb { gap: 5px; margin-bottom: 10px; font-size: calc(9px * var(--font-scale, 1)); }
          .tms-breadcrumb-line { width: 17px; }
          .tms-title { max-width: 320px; margin-bottom: 12px; font-size: calc(30px * var(--font-scale, 1)); letter-spacing: -0.5px; }
          .tms-description { margin-bottom: 20px; font-size: calc(11.5px * var(--font-scale, 1)); }
          .tms-buttons { gap: 8px; }
          .tms-primary-btn, .tms-secondary-btn { height: 40px; padding: 0 10px; font-size: calc(9px * var(--font-scale, 1)); }
          .tms-primary-btn { max-width: none; gap: 7px; }
          .tms-secondary-btn { max-width: none; }
        }
      `}</style>
    </section>
  );
}
