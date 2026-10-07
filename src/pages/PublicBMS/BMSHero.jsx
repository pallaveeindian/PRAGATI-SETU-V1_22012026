// src/pages/PublicBMS/BMSHero.jsx

import React, { useContext } from "react";
import {
  FiArrowRight,
  FiExternalLink,
  FiInfo,
  FiUsers,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";
import { LanguageContext } from "../LanguageContext.jsx";
import bmsHeroLeft from "../../assets/BMS/bms_hero_left.png";
import bmsHeroRight from "../../assets/BMS/bms_hero_right.png";

const content = {
  en: {
    eyebrow: "Our Modules",
    titleOne: "Beneficiary",
    titleTwo: "Profiling",
    subtitle:
      "Digitizing Beneficiaries for a Stronger, Self-Reliant Rural Uttar Pradesh",
    description:
      "Empowering rural communities through accurate beneficiary data, targeted support, better planning, and effective implementation of livelihood programmes.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    quoteOne: "Empowered",
    quoteTwo: "Beneficiaries",
    quoteThree: "Stronger",
    quoteFour: "Communities",
    benefits: [
      { title: "Accurate Beneficiary Data", icon: "users" },
      { title: "Targeted Support", icon: "growth" },
      { title: "Better Planning", icon: "settings" },
      { title: "Inclusive Growth", icon: "users" },
    ],
  },
  hi: {
    eyebrow: "हमारे मॉड्यूल",
    titleOne: "लाभार्थी",
    titleTwo: "प्रोफाइलिंग",
    subtitle:
      "एक मजबूत और आत्मनिर्भर ग्रामीण उत्तर प्रदेश के लिए लाभार्थियों का डिजिटलीकरण",
    description:
      "सटीक लाभार्थी डेटा, लक्षित सहायता, बेहतर योजना और आजीविका कार्यक्रमों के प्रभावी क्रियान्वयन के माध्यम से ग्रामीण समुदायों को सशक्त बनाना।",
    getStarted: "शुरू करें",
    learnMore: "और जानें",
    quoteOne: "सशक्त",
    quoteTwo: "लाभार्थी",
    quoteThree: "मजबूत",
    quoteFour: "समुदाय",
    benefits: [
      { title: "सटीक लाभार्थी डेटा", icon: "users" },
      { title: "लक्षित सहायता", icon: "growth" },
      { title: "बेहतर योजना", icon: "settings" },
      { title: "समावेशी विकास", icon: "users" },
    ],
  },
};

const BENEFIT_ICONS = { growth: <FiTrendingUp />, settings: <FiSettings /> };
const getBenefitIcon = (icon) => BENEFIT_ICONS[icon] || <FiUsers />;

const scrollToSection = (id) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

// the two hero CTA buttons: style variant, icon, content key, and scroll target
const ACTIONS = [
  {
    variant: "primary",
    icon: <FiExternalLink />,
    labelKey: "getStarted",
    target: "bms-features",
  },
  {
    variant: "secondary",
    icon: <FiInfo className="bms-info-icon" />,
    labelKey: "learnMore",
    target: "bms-overview",
  },
];

export default function BMSHero() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="bms-hero">
      <div
        className="bms-left-background"
        style={{ backgroundImage: `url(${bmsHeroLeft})` }}
      ></div>

      <div className="bms-hero-left">
        <div className="bms-left-inner">
          <div className="bms-eyebrow">
            <span className="bms-eyebrow-line"></span>
            <span>{t.eyebrow}</span>
          </div>

          <h1 className="bms-title">
            <span className="bms-title-blue">{t.titleOne}</span>
            <span className="bms-title-orange">{t.titleTwo}</span>
          </h1>

          <h2 className="bms-subtitle">{t.subtitle}</h2>
          <p className="bms-description">{t.description}</p>

          <div className="bms-actions">
            {ACTIONS.map(({ variant, icon, labelKey, target }) => (
              <button
                type="button"
                key={variant}
                className={`bms-button bms-button-${variant}`}
                onClick={() => scrollToSection(target)}
              >
                {icon}
                <span>{t[labelKey]}</span>
                <FiArrowRight />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bms-hero-right">
        <img
          src={bmsHeroRight}
          alt="Beneficiary Profiling"
          className="bms-right-image"
        />
        <div className="bms-right-gradient"></div>

        <div className="bms-quote">
          <span className="quote-black">{t.quoteOne}</span>
          <span className="quote-black">{t.quoteTwo}</span>
          <span className="quote-orange">{t.quoteThree}</span>
          <span className="quote-black">{t.quoteFour}</span>
          <div className="quote-underline"></div>
        </div>

        <div className="bms-benefits">
          {t.benefits.map((benefit, index) => (
            <div className="bms-benefit" key={`${benefit.title}-${index}`}>
              <div className="bms-benefit-icon">
                {getBenefitIcon(benefit.icon)}
              </div>
              <span className="bms-benefit-title">{benefit.title}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .bms-hero, .bms-hero * {
          box-sizing: border-box;
        }

        .bms-hero {
          position: relative;
          width: 100%;
          height: 365px;
          overflow: hidden;
          background: #fff4ec;
        }

        .bms-left-background {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 56%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .bms-hero-left {
          position: relative;
          z-index: 4;
          width: 52%;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        /* extra right padding only so text stays away from the slanted image */
        .bms-left-inner {
          width: 100%;
          max-width: 800px;
          margin-left: auto;
          padding: 30px 105px 30px max(7vw, 80px);
        }

        .bms-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 7px;
          color: #f15a0a;
          font-size: calc(17px * var(--font-scale, 1));
          font-weight: 700;
        }
        .bms-eyebrow-line {
          width: 38px;
          height: 3px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #ff5207;
        }

        .bms-title {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 13px;
          width: 100%;
          max-width: 100%;
          margin: 0 0 9px;
          font-size: clamp(49px, 4.2vw, 70px);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -2px;
        }
        .bms-title-blue { color: #082c5a; }
        .bms-title-orange { color: #ff5207; }

        .bms-subtitle {
          width: 100%;
          max-width: 100%;
          margin: 0 0 9px;
          color: #082d5c;
          font-size: calc(16px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.45;
          overflow-wrap: break-word;
          word-break: normal;
        }
        .bms-description {
          width: 100%;
          max-width: 100%;
          margin: 0 0 18px;
          color: #455c76;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.55;
          overflow-wrap: break-word;
          word-break: normal;
        }

        .bms-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }
        .bms-button {
          height: 47px;
          min-width: 170px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 18px;
          border-radius: 7px;
          font-family: inherit;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 800;
          cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .bms-button-primary {
          border: 1px solid #ff5609;
          background: linear-gradient(135deg, #ff620f, #ff4800);
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(255, 82, 7, .20);
        }
        .bms-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 18px rgba(255, 82, 7, .28);
        }
        .bms-button-secondary {
          border: 1.5px solid #ff5b0b;
          background: rgba(255, 255, 255, .92);
          color: #082c5a;
        }
        .bms-button-secondary:hover {
          transform: translateY(-2px);
          background: #ffffff;
        }
        .bms-info-icon {
          width: 15px !important;
          height: 15px !important;
          min-width: 15px;
          flex-shrink: 0;
          color: #ff5207;
          font-size: 15px !important;
          stroke-width: 2.4;
        }

        .bms-hero-right {
          position: absolute;
          z-index: 3;
          top: 0;
          right: 0;
          width: 57%;
          height: 100%;
          overflow: hidden;
          isolation: isolate;
          clip-path: polygon(11% 0, 100% 0, 100% 100%, 0 100%);
        }
        .bms-right-image {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
        }
        .bms-right-gradient {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(90deg, transparent 42%, rgba(8, 28, 31, .02) 60%, rgba(8, 28, 31, .22) 100%);
        }

        .bms-quote {
          position: absolute;
          z-index: 6;
          top: 18px;
          right: 23%;
          width: 190px;
          min-height: 145px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px 18px;
          text-align: center;
          transform: rotate(-5deg);
          background: rgba(255, 255, 255, .94);
          clip-path: polygon(4% 8%, 94% 0, 100% 17%, 96% 35%, 100% 50%, 94% 69%, 98% 88%, 82% 96%, 61% 92%, 37% 100%, 12% 92%, 1% 72%, 6% 54%, 0 37%);
          box-shadow: 0 7px 22px rgba(0, 0, 0, .11);
        }
        .bms-quote span { display: block; }
        .quote-black {
          color: #0c1d33;
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
        }
        .quote-orange {
          margin: 2px 0;
          color: #ff5207;
          font-size: 25px;
          font-weight: 900;
          line-height: 1;
        }
        .quote-underline {
          width: 74px;
          height: 4px;
          margin-top: 8px;
          border-radius: 10px;
          background: #ff5207;
        }

        .bms-benefits {
          position: absolute;
          z-index: 7;
          top: 50%;
          right: 15px;
          width: 195px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          transform: translateY(-50%);
        }
        .bms-benefit {
          min-height: 54px;
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          gap: 9px;
        }
        .bms-benefit-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, .96);
          color: #ff5609;
          font-size: 23px;
          box-shadow: 0 5px 12px rgba(0, 0, 0, .14);
        }
        .bms-benefit-title {
          color: #fafeff;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.25;
          text-shadow: 0 2px 5px rgba(0, 0, 0, .65);
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .bms-hero { height: 385px; }
          /* keep content away from image */
          .bms-left-inner {
            max-width: 850px;
            padding-left: max(8vw, 110px);
            padding-right: 115px;
          }
          .bms-eyebrow { font-size: calc(18px * var(--font-scale, 1)); }
          .bms-subtitle { font-size: calc(17px * var(--font-scale, 1)); }
          .bms-description { font-size: calc(15px * var(--font-scale, 1)); }
          .bms-button { font-size: calc(14px * var(--font-scale, 1)); }
          .bms-quote { width: 205px; right: 24%; }
          .quote-black { font-size: 19px; }
          .quote-orange { font-size: 27px; }
          .bms-benefits { width: 210px; right: 22px; }
          .bms-benefit-title { font-size: calc(12.5px * var(--font-scale, 1)); }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .bms-hero { height: 355px; }
          .bms-hero-left { width: 53%; }
          .bms-left-background { width: 57%; }
          .bms-left-inner { padding: 28px 82px 28px 45px; }
          .bms-eyebrow { font-size: calc(16px * var(--font-scale, 1)); }
          .bms-title { font-size: 52px; }
          .bms-subtitle { font-size: calc(15px * var(--font-scale, 1)); }
          .bms-description { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-button { font-size: calc(12px * var(--font-scale, 1)); }
          .bms-hero-right {
            width: 55%;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
          }
          .bms-quote {
            right: 24%;
            width: 165px;
            min-height: 124px;
          }
          .quote-black { font-size: 15px; }
          .quote-orange { font-size: 21px; }
          .bms-benefits { width: 165px; }
          .bms-benefit-title { font-size: 10px; }
        }

        /* 1024px small laptop */
        @media (max-width: 1024px) {
          .bms-hero { height: 345px; }
          .bms-left-inner { padding: 26px 68px 26px 30px; }
          .bms-eyebrow { font-size: 14px; }
          .bms-title { font-size: 44px; gap: 8px; }
          .bms-subtitle { font-size: 13px; }
          .bms-description { font-size: 12px; }
          .bms-actions { gap: 10px; }
          .bms-button {
            min-width: 145px;
            height: 42px;
            padding: 0 12px;
            font-size: 11px;
          }
          .bms-info-icon {
            width: 14px !important;
            height: 14px !important;
            min-width: 14px;
            font-size: 14px !important;
          }
          .bms-quote {
            right: 20%;
            width: 145px;
            min-height: 108px;
          }
          .quote-black { font-size: 13px; }
          .quote-orange { font-size: 18px; }
          .bms-benefits { width: 145px; gap: 6px; }
          .bms-benefit {
            grid-template-columns: 39px 1fr;
            gap: 5px;
          }
          .bms-benefit-icon {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }
          .bms-benefit-title { font-size: 9px; }
        }

        /* 900px tablet — right image removed */
        @media (max-width: 900px) {
          .bms-hero {
            height: auto;
            min-height: 360px;
            display: block;
            overflow: hidden;
            background: #fff4ec;
          }
          .bms-left-background {
            width: 100%;
            height: 100%;
            min-height: 360px;
            background-size: cover;
            background-position: center center;
          }
          .bms-hero-left {
            width: 100%;
            height: auto;
            min-height: 360px;
            display: flex;
            align-items: center;
            overflow: visible;
          }
          .bms-left-inner {
            width: 100%;
            max-width: 780px;
            margin: 0 auto;
            padding: 32px 28px;
            text-align: center;
          }
          .bms-hero-right { display: none; }
          .bms-eyebrow {
            justify-content: center;
            font-size: calc(15px * var(--font-scale, 1));
          }
          .bms-title {
            justify-content: center;
            font-size: 46px;
            gap: 9px;
            margin-bottom: 10px;
          }
          .bms-subtitle {
            max-width: 680px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 10px;
            font-size: calc(14px * var(--font-scale, 1));
          }
          .bms-description {
            max-width: 680px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 20px;
            font-size: calc(12.5px * var(--font-scale, 1));
          }
          .bms-actions { justify-content: center; }
          .bms-button {
            min-width: 155px;
            height: 44px;
            font-size: calc(12px * var(--font-scale, 1));
          }
          .bms-info-icon {
            width: 14px !important;
            height: 14px !important;
            min-width: 14px;
            font-size: 14px !important;
          }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .bms-hero, .bms-left-background, .bms-hero-left { min-height: 360px; }
          .bms-left-inner { padding: 28px 18px; }
          .bms-eyebrow { font-size: calc(14px * var(--font-scale, 1)); }
          .bms-title { font-size: 38px; line-height: 1; gap: 7px; }
          .bms-subtitle {
            max-width: 95%;
            font-size: calc(13px * var(--font-scale, 1));
          }
          .bms-description {
            max-width: 95%;
            font-size: calc(12px * var(--font-scale, 1));
          }
          .bms-actions { gap: 10px; }
          .bms-button {
            min-width: 145px;
            height: 43px;
            padding: 0 14px;
            font-size: calc(11.5px * var(--font-scale, 1));
          }
          .bms-info-icon {
            width: 13px !important;
            height: 13px !important;
            min-width: 13px;
            font-size: 13px !important;
          }
          .bms-hero-right { display: none; }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .bms-hero, .bms-left-background, .bms-hero-left { min-height: 395px; }
          .bms-left-inner { padding: 25px 12px; }
          .bms-eyebrow { font-size: calc(13px * var(--font-scale, 1)); }
          .bms-title { font-size: 32px; gap: 6px; }
          .bms-subtitle { font-size: calc(12px * var(--font-scale, 1)); }
          .bms-description { font-size: calc(11px * var(--font-scale, 1)); }
          .bms-actions { flex-direction: column; gap: 9px; }
          .bms-button {
            width: 100%;
            max-width: 235px;
            min-width: 0;
            height: 42px;
          }
          .bms-info-icon {
            width: 13px !important;
            height: 13px !important;
            min-width: 13px;
            font-size: 13px !important;
          }
          .bms-hero-right { display: none; }
        }
      `}</style>
    </section>
  );
}
