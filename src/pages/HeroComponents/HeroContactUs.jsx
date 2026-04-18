import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";

/**
 * HeroContactUs
 */

export default function HeroContactUs() {
  const { lang } = useContext(LanguageContext);

  const content = {
    en: {
      title: "Need Support for Pragati Setu?",
      highlight: "Contact Us!",
      subtitle:
        "Our technical support team is available over Phone and Email to assist you with any issues.",

      callTitle: "Call Us",
      callTime: "Monday through Friday",
      callTime2: "10:30 AM to 6:30 PM",

      writeTitle: "Write to us",
      writeDesc:
        "Mail us your queries and our support team will get back to you within 24 hours.",
    },

    hi: {
      title: "प्रगति सेतु के लिए सहायता चाहिए?",
      highlight: "संपर्क करें!",
      subtitle:
        "हमारी तकनीकी सहायता टीम आपकी किसी भी समस्या में फोन और ईमेल के माध्यम से मदद के लिए उपलब्ध है।",

      callTitle: "हमें कॉल करें",
      callTime: "सोमवार से शुक्रवार",
      callTime2: "सुबह 10:30 बजे से शाम 6:30 बजे तक",

      writeTitle: "हमें लिखें",
      writeDesc:
        "अपनी समस्याएं हमें मेल करें, हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी।",
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="hero-contact-wrapper">
      {/* HEADER */}
      <div className="contact-header">
        <h2 className="contact-title">
          {t.title} <span>{t.highlight}</span>
        </h2>
        <p className="contact-subtitle">{t.subtitle}</p>
      </div>

      {/* CARDS */}
      <div className="contact-cards">
        {/* CALL US */}
        <div className="contact-card">
          <div className="contact-icon orange">📞</div>

          <h3>{t.callTitle}</h3>
          <p className="contact-time">
            <strong>{t.callTime}</strong>
            <br />
            {t.callTime2}
          </p>

          <p className="contact-link">
            <a href="tel:+9101205202521">+91-XXX-XXXXXXX</a>
          </p>
        </div>

        {/* WRITE TO US */}
        <div className="contact-card">
          <div className="contact-icon orange">📝</div>

          <h3>{t.writeTitle}</h3>
          <p className="contact-desc">{t.writeDesc}</p>

          <p className="contact-link">
            <a href="#">support.psetu.gov.in</a>
          </p>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        /* ===== WRAPPER ===== */
        .hero-contact-wrapper {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ===== HEADER ===== */
        .contact-header {
          margin-bottom: 40px;
        }

        .contact-title {
          font-size: 36px;
          font-weight: 800;
          color: #0f172a;
        }

        .contact-title span {
          color: #fd7301;
        }

        .contact-subtitle {
          margin-top: 10px;
          font-size: 16px;
          color: #475569;
          max-width: 800px;
        }

        /* ===== CARDS ===== */
        .contact-cards {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        .contact-card {
          flex: 1;
          min-width: 320px;
          background: #ffffff;
          border-radius: 14px;
          padding: 28px 30px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          position: relative;
          overflow: hidden;
        }

        /* dotted corner effect */
        .contact-card::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 120px;
          height: 120px;
          background: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.6;
        }

        /* ICON */
        .contact-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 16px;
          background: #fff7ed;
          color: #fd7301;
        }

        /* TEXT */
        .contact-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #0f172a;
        }

        .contact-time,
        .contact-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 18px;
        }

        .contact-link a {
          font-size: 15px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }

        .contact-link a:hover {
          text-decoration: underline;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .contact-title {
            font-size: 28px;
          }

          .contact-cards {
            gap: 24px;
          }
            .hero-contact-wrapper {
          margin-left: 10px;
          margin-right: 10px
        }
        }
      `}</style>
    </div>
  );
}
