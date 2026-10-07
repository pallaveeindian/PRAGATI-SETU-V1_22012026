// src/pages/PublicLDMS/LDMSHero.jsx

import React, { useContext, useState } from "react";
import { LanguageContext } from "../LanguageContext.jsx";

// change only these image paths if your file names are different
import ldmsHeroBg from "../../assets/LDMS/ldmsleft.png";
import ldmsHeroRight from "../../assets/LDMS/ldmsright.png";

const content = {
  en: {
    breadcrumb1: "Our Services",
    breadcrumb2: "Lakhpati Didi",
    title1: "Lakhpati",
    title2: "Didi",
    description:
      "Empowering SHG women to enhance household income, build sustainable livelihoods and achieve a better quality of life through collective action, skills and entrepreneurship.",
    explore: "Explore Features",
    knowMore: "Know More",
    releaseTitle: "To Be Released Soon",
    releaseText: "The Lakhpati Didi module will be available soon.",
    releaseOk: "OK",
  },
  hi: {
    breadcrumb1: "हमारी सेवाएं",
    breadcrumb2: "लखपति दीदी",
    title1: "लखपति",
    title2: "दीदी",
    description:
      "स्वयं सहायता समूह की महिलाओं को घरेलू आय बढ़ाने, सतत आजीविका विकसित करने और सामूहिक प्रयास, कौशल तथा उद्यमिता के माध्यम से बेहतर जीवन स्तर प्राप्त करने हेतु सशक्त बनाना।",
    explore: "विशेषताएं देखें",
    knowMore: "और जानें",
    releaseTitle: "जल्द जारी किया जाएगा",
    releaseText: "लखपति दीदी मॉड्यूल जल्द ही उपलब्ध होगा।",
    releaseOk: "ठीक है",
  },
};

const scrollToSection = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function LDMSHero() {
  const { lang } = useContext(LanguageContext);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const t = content[lang] || content.en;

  return (
    <>
      <section
        className="ldms-hero"
        style={{ backgroundImage: `url(${ldmsHeroBg})` }}
      >
        <div className="ldms-hero-content">
          <div className="ldms-breadcrumb">
            <span className="ldms-breadcrumb-line"></span>
            <span>{t.breadcrumb1}</span>
            <span className="ldms-breadcrumb-arrow">›</span>
            <span>{t.breadcrumb2}</span>
          </div>

          <h1 className="ldms-title">
            <span className="ldms-title-blue">{t.title1}</span>{" "}
            <span className="ldms-title-orange">{t.title2}</span>
          </h1>

          <p className="ldms-description">{t.description}</p>

          <div className="ldms-buttons">
            <button
              type="button"
              className="ldms-primary-btn"
              onClick={() => setShowReleaseModal(true)}
            >
              <span>{t.explore}</span>
              <span className="ldms-btn-arrow">→</span>
            </button>

            <button
              className="ldms-secondary-btn"
              onClick={() => scrollToSection("ldms-overview")}
            >
              {t.knowMore}
            </button>
          </div>
        </div>

        <div className="ldms-hero-image">
          <img src={ldmsHeroRight} alt="Lakhpati Didi" />
        </div>

        <style>{`
          .ldms-hero {
            position: relative;
            width: 100%;
            height: 430px;
            margin-top: 152px;
            padding-top: 95px;
            overflow: hidden;
            background-color: #fff8f2;
            background-size: 52% 100%;
            background-position: left center;
            background-repeat: no-repeat;
          }

          .ldms-hero-content {
            position: relative;
            z-index: 5;
            width: 48%;
            max-width: 720px;
            padding: 35px 25px 35px clamp(45px, 6vw, 95px);
          }

          .ldms-breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            color: #e95d0f;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 700;
          }
          .ldms-breadcrumb-line {
            width: 24px;
            height: 2px;
            flex-shrink: 0;
            background: #f97316;
            border-radius: 10px;
          }
          .ldms-breadcrumb-arrow { color: #f97316; font-size: 16px; }

          .ldms-title {
            margin: 0 0 12px;
            font-size: calc(50px * var(--font-scale, 1));
            font-weight: 900;
            line-height: 1.05;
            letter-spacing: -1px;
          }
          .ldms-title-blue { color: #071b4d; }
          .ldms-title-orange { color: #ff5b0b; }

          .ldms-description {
            width: 100%;
            max-width: 600px;
            margin: 0 0 24px;
            color: #17375e;
            font-size: calc(15px * var(--font-scale, 1));
            font-weight: 500;
            line-height: 1.5;
          }

          .ldms-buttons {
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
          }
          .ldms-primary-btn, .ldms-secondary-btn {
            height: 44px;
            padding: 0 24px;
            border-radius: 6px;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 800;
            cursor: pointer;
            transition: 0.25s ease;
          }

          .ldms-primary-btn {
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
          .ldms-primary-btn:hover {
            background: #e94e00;
            transform: translateY(-2px);
            box-shadow: 0 7px 18px rgba(255, 91, 11, 0.3);
          }
          .ldms-btn-arrow { font-size: 16px; transition: transform 0.25s ease; }
          .ldms-primary-btn:hover .ldms-btn-arrow { transform: translateX(4px); }

          .ldms-secondary-btn {
            min-width: 140px;
            border: 1.5px solid #193d70;
            background: #ffffff;
            color: #08275c;
          }
          .ldms-secondary-btn:hover {
            background: #f8fafc;
            transform: translateY(-2px);
          }

          .ldms-hero-image {
            position: absolute;
            z-index: 2;
            top: 0;
            right: 0;
            bottom: 0;
            width: 54%;
            height: 100%;
            overflow: hidden;
            background: #fff8f2;
            /* angled transition similar to the reference screenshot */
            clip-path: polygon(9% 0, 100% 0, 100% 100%, 0 100%);
          }
          .ldms-hero-image img {
            display: block;
            width: 100%;
            height: 100%;
            /* show the complete right image, no cover cropping */
            object-fit: fill;
            object-position: center;
          }
          .ldms-hero-image::before {
            content: "";
            position: absolute;
            z-index: 3;
            top: 0;
            bottom: 0;
            left: 0;
            width: 65px;
            background: linear-gradient(90deg, rgba(255, 248, 242, 0.65), rgba(255, 248, 242, 0.15), transparent);
            pointer-events: none;
          }

          /* release soon modal */
          .ldms-release-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(15, 23, 42, .35);
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
          }
          .ldms-release-modal {
            position: relative;
            width: min(430px, 100%);
            padding: 38px 32px 30px;
            background: #ffffff;
            border: 1px solid rgba(255, 91, 11, .18);
            border-radius: 18px;
            text-align: center;
            box-shadow: 0 24px 70px rgba(15, 23, 42, .25);
            animation: ldmsModalIn .25s ease;
          }
          .ldms-release-close {
            position: absolute;
            top: 12px;
            right: 15px;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: none;
            border-radius: 50%;
            background: #f8fafc;
            color: #64748b;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
          }
          .ldms-release-close:hover { background: #fff1e8; color: #ff5b0b; }
          .ldms-release-icon {
            width: 66px;
            height: 66px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff1e8;
            font-size: 30px;
          }
          .ldms-release-modal h2 {
            margin: 0 0 10px;
            color: #071b4d;
            font-size: 27px;
            font-weight: 900;
          }
          .ldms-release-modal p {
            margin: 0 0 22px;
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.6;
          }
          .ldms-release-ok {
            min-width: 110px;
            height: 42px;
            padding: 0 24px;
            border: none;
            border-radius: 7px;
            background: #ff5b0b;
            color: #ffffff;
            font-family: inherit;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
          }
          .ldms-release-ok:hover { background: #e94e00; }

          @keyframes ldmsModalIn {
            from { opacity: 0; transform: translateY(12px) scale(.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          @media (max-width: 600px) {
            .ldms-release-overlay { padding: 16px; }
            .ldms-release-modal { padding: 34px 20px 25px; border-radius: 15px; }
            .ldms-release-modal h2 { font-size: 23px; }
            .ldms-release-modal p { font-size: 13px; }
          }

          /* 1400px+ large desktop */
          @media (min-width: 1400px) {
            .ldms-hero {
              height: 450px;
              padding-top: 95px;
              background-size: 50% 100%;
            }
            .ldms-hero-content {
              width: 47%;
              padding: 38px 30px 38px clamp(70px, 7vw, 120px);
            }
            .ldms-title { font-size: calc(54px * var(--font-scale, 1)); }
            .ldms-description {
              max-width: 620px;
              font-size: calc(16px * var(--font-scale, 1));
            }
            .ldms-hero-image { width: 55%; }
          }

          /* 1200px laptop */
          @media (max-width: 1200px) {
            .ldms-hero {
              height: 410px;
              padding-top: 90px;
              background-size: 53% 100%;
            }
            .ldms-hero-content {
              width: 50%;
              padding: 32px 25px 32px 42px;
            }
            .ldms-title { font-size: calc(42px * var(--font-scale, 1)); }
            .ldms-description {
              max-width: 520px;
              font-size: calc(14px * var(--font-scale, 1));
            }
            .ldms-primary-btn, .ldms-secondary-btn {
              height: 42px;
              font-size: calc(12px * var(--font-scale, 1));
            }
            .ldms-hero-image { width: 53%; }
          }

          /* 1024px small laptop / tablet */
          @media (max-width: 1024px) {
            .ldms-hero {
              height: 390px;
              padding-top: 85px;
              background-size: 55% 100%;
            }
            .ldms-hero-content {
              width: 52%;
              padding: 30px 20px 28px 28px;
            }
            .ldms-title { font-size: calc(36px * var(--font-scale, 1)); }
            .ldms-description {
              max-width: 470px;
              font-size: calc(13px * var(--font-scale, 1));
              line-height: 1.45;
            }
            .ldms-primary-btn, .ldms-secondary-btn {
              height: 39px;
              padding: 0 17px;
              font-size: calc(11px * var(--font-scale, 1));
            }
            .ldms-primary-btn { min-width: 160px; }
            .ldms-secondary-btn { min-width: 115px; }
            .ldms-hero-image { width: 51%; }
          }

          /* 900px tablet — right image removed */
          @media (max-width: 900px) {
            .ldms-hero {
              height: auto;
              min-height: 385px;
              padding-top: 85px;
              background-size: cover;
              background-position: center bottom;
            }
            .ldms-hero-image { display: none; }
            .ldms-hero-content {
              width: 100%;
              max-width: 730px;
              padding: 32px 28px 38px;
            }
            .ldms-title { font-size: calc(40px * var(--font-scale, 1)); }
            .ldms-description {
              max-width: 650px;
              font-size: calc(14px * var(--font-scale, 1));
            }
          }

          /* 600px mobile */
          @media (max-width: 600px) {
            .ldms-hero {
              min-height: 380px;
              padding-top: 75px;
              background-size: cover;
              background-position: center bottom;
            }
            .ldms-hero-image { display: none; }
            .ldms-hero-content { padding: 27px 16px 30px; }
            .ldms-breadcrumb {
              gap: 6px;
              margin-bottom: 10px;
              font-size: calc(10px * var(--font-scale, 1));
            }
            .ldms-breadcrumb-line { width: 18px; }
            .ldms-title {
              font-size: calc(32px * var(--font-scale, 1));
              letter-spacing: -0.5px;
            }
            .ldms-description {
              max-width: 520px;
              margin-bottom: 20px;
              font-size: calc(13px * var(--font-scale, 1));
              line-height: 1.5;
            }
            .ldms-buttons { gap: 10px; }
            .ldms-primary-btn, .ldms-secondary-btn {
              height: 40px;
              font-size: calc(11px * var(--font-scale, 1));
            }
            .ldms-primary-btn { min-width: 160px; }
            .ldms-secondary-btn { min-width: 110px; }
          }

          /* 400px small mobile */
          @media (max-width: 400px) {
            .ldms-hero {
              min-height: 400px;
              padding-top: 70px;
              background-position: center bottom;
            }
            .ldms-hero-image { display: none; }
            .ldms-hero-content { padding: 24px 13px 26px; }
            .ldms-title { font-size: calc(28px * var(--font-scale, 1)); }
            .ldms-description { font-size: calc(12px * var(--font-scale, 1)); }
            .ldms-buttons { width: 100%; gap: 8px; }
            .ldms-primary-btn, .ldms-secondary-btn {
              flex: 1;
              min-width: 0;
              padding: 0 10px;
            }
            .ldms-primary-btn { gap: 8px; }
          }
        `}</style>
      </section>

      {showReleaseModal && (
        <div
          className="ldms-release-overlay"
          onClick={() => setShowReleaseModal(false)}
        >
          <div
            className="ldms-release-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="ldms-release-close"
              onClick={() => setShowReleaseModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="ldms-release-icon">🚀</div>
            <h2>{t.releaseTitle}</h2>
            <p>{t.releaseText}</p>

            <button
              type="button"
              className="ldms-release-ok"
              onClick={() => setShowReleaseModal(false)}
            >
              {t.releaseOk}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
