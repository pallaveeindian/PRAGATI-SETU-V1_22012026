// src/pages/PublicTMS/TMSOverview.jsx

import React, { useContext } from "react";
import { FaClipboardList, FaUsers, FaShieldAlt } from "react-icons/fa";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    heading: "Overview of TMS",
    cards: [
      { id: 1, title: "Role-based Training Management", description: "The Training Management System (TMS) is a role-based Management Information System designed to manage the complete lifecycle of trainings under UPSRLM.", icon: <FaClipboardList /> },
      { id: 2, title: "End-to-End Training Operations", description: "It supports training plans, training requests and batches, beneficiary and trainer management, attendance tracking, processing of training payments, and training closure with report and certificate generation.", icon: <FaUsers /> },
      { id: 3, title: "Multi-Role Access & Governance", description: "The system accommodates multiple roles including BMMU, DMMU, SMMU, Training Partners and Master Trainers, ensuring controlled access, streamlined workflows and efficient governance.", icon: <FaShieldAlt /> },
    ],
  },
  hi: {
    heading: "टीएमएस का अवलोकन",
    cards: [
      { id: 1, title: "भूमिका-आधारित प्रशिक्षण प्रबंधन", description: "प्रशिक्षण प्रबंधन प्रणाली (TMS) एक भूमिका-आधारित प्रबंधन सूचना प्रणाली है, जिसे UPSRLM के अंतर्गत प्रशिक्षण के संपूर्ण जीवनचक्र के प्रबंधन के लिए विकसित किया गया है।", icon: <FaClipboardList /> },
      { id: 2, title: "प्रारंभ से अंत तक प्रशिक्षण संचालन", description: "यह प्रशिक्षण योजनाओं, प्रशिक्षण अनुरोधों और बैचों, लाभार्थी एवं प्रशिक्षक प्रबंधन, उपस्थिति निगरानी, प्रशिक्षण भुगतान प्रक्रिया तथा रिपोर्ट और प्रमाणपत्र निर्माण सहित प्रशिक्षण समापन का समर्थन करती है।", icon: <FaUsers /> },
      { id: 3, title: "बहु-भूमिका पहुँच एवं प्रशासन", description: "यह प्रणाली BMMU, DMMU, SMMU, प्रशिक्षण भागीदारों और मास्टर ट्रेनरों सहित विभिन्न भूमिकाओं का समर्थन करती है, जिससे नियंत्रित पहुँच, सुव्यवस्थित कार्यप्रवाह और प्रभावी प्रशासन सुनिश्चित होता है।", icon: <FaShieldAlt /> },
    ],
  },
};

export default function TMSOverview() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="tms-overview">
      <div className="tms-overview-container">
        <div className="tms-overview-heading">
          <span className="overview-heading-line"></span>
          <h2>{t.heading}</h2>
        </div>

        <div className="tms-overview-grid">
          {t.cards.map((card) => (
            <div className="tms-overview-card" key={card.id}>
              <div className="overview-icon">{card.icon}</div>
              <div className="overview-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* OVERVIEW SECTION */
        .tms-overview {
          width: 100%;
          padding: 22px 0 18px;
          background: #ffffff;
        }
        .tms-overview-container {
          width: 92%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADING */
        .tms-overview-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .overview-heading-line {
          width: 22px;
          height: 3px;
          flex-shrink: 0;
          background: #f15a24;
          border-radius: 10px;
        }
        .tms-overview-heading h2 {
          margin: 0;
          color: #08275c;
          font-size: calc(20px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.2;
        }

        /* GRID */
        .tms-overview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          width: 100%;
        }

        /* CARD */
        .tms-overview-card {
          min-height: 125px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 17px 18px;
          background: #ffffff;
          border: 1.5px solid #ff7a32;
          border-radius: 9px;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .tms-overview-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
        }

        /* ICON */
        .overview-icon {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff1e8;
          color: #ff641f;
          font-size: 23px;
        }

        /* CARD CONTENT */
        .overview-card-content {
          flex: 1;
          min-width: 0;
        }
        .overview-card-content h3 {
          margin: 0 0 5px;
          color: #0b285c;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.25;
        }
        .overview-card-content p {
          margin: 0;
          color: #334155;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.4;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .tms-overview-container { max-width: 1420px; }
          .tms-overview-card {
            min-height: 130px;
            padding: 18px 20px;
          }
          .overview-card-content h3 { font-size: calc(14px * var(--font-scale, 1)); }
          .overview-card-content p { font-size: calc(12px * var(--font-scale, 1)); }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .tms-overview-container { width: 94%; }
          .tms-overview-grid { gap: 14px; }
          .tms-overview-card {
            padding: 15px 14px;
            gap: 12px;
          }
          .overview-icon {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }
          .overview-card-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .overview-card-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 1024px small laptop */
        @media (max-width: 1024px) {
          .tms-overview-grid { grid-template-columns: repeat(2, 1fr); }
          .tms-overview-card:last-child { grid-column: 1 / -1; }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .tms-overview { padding: 24px 0 20px; }
          .tms-overview-heading h2 { font-size: calc(18px * var(--font-scale, 1)); }
          .tms-overview-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .tms-overview-card:last-child { grid-column: auto; }
          .tms-overview-card { min-height: auto; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .tms-overview-container { width: calc(100% - 30px); }
          .tms-overview-heading {
            gap: 9px;
            margin-bottom: 14px;
          }
          .overview-heading-line { width: 18px; }
          .tms-overview-heading h2 { font-size: calc(17px * var(--font-scale, 1)); }
          .tms-overview-card {
            gap: 12px;
            padding: 14px 13px;
          }
          .overview-icon {
            width: 38px;
            height: 38px;
            font-size: 18px;
          }
          .overview-card-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .overview-card-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .tms-overview-container { width: calc(100% - 24px); }
          .tms-overview-card { padding: 13px 11px; }
          .overview-icon {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
          .overview-card-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .overview-card-content p { font-size: calc(10.5px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
