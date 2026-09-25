// src/pages/PublicTMS/TMSBenefits.jsx

import React, { useContext } from "react";
import { FaUsers, FaCog, FaCheck, FaChartBar } from "react-icons/fa";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    heading: "Key Benefits",
    benefits: [
      { id: 1, title: "Role-Based Access", description: "Secure access based on roles and responsibilities.", icon: <FaUsers />, type: "blue" },
      { id: 2, title: "Centralized Workflow", description: "Streamlined training processes across all administrative levels.", icon: <FaCog />, type: "orange" },
      { id: 3, title: "Accurate Attendance", description: "Biometric eKYC and real-time attendance tracking.", icon: <FaCheck />, type: "green" },
      { id: 4, title: "Better Reporting", description: "Automated reports and certificate generation.", icon: <FaChartBar />, type: "peach" },
    ],
  },
  hi: {
    heading: "प्रमुख लाभ",
    benefits: [
      { id: 1, title: "भूमिका-आधारित पहुँच", description: "भूमिकाओं और जिम्मेदारियों के आधार पर सुरक्षित पहुँच सुनिश्चित करता है।", icon: <FaUsers />, type: "blue" },
      { id: 2, title: "केंद्रीकृत कार्यप्रवाह", description: "सभी प्रशासनिक स्तरों पर प्रशिक्षण प्रक्रियाओं को सुव्यवस्थित करता है।", icon: <FaCog />, type: "orange" },
      { id: 3, title: "सटीक उपस्थिति", description: "बायोमेट्रिक eKYC के माध्यम से रियल-टाइम उपस्थिति ट्रैकिंग और निगरानी।", icon: <FaCheck />, type: "green" },
      { id: 4, title: "बेहतर रिपोर्टिंग", description: "स्वचालित रिपोर्ट और प्रमाणपत्र तैयार करने की सुविधा।", icon: <FaChartBar />, type: "peach" },
    ],
  },
};

export default function TMSBenefits() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="tms-benefits">
      <div className="tms-benefits-container">
        <div className="tms-benefits-heading">
          <span className="benefits-heading-line"></span>
          <h2>{t.heading}</h2>
        </div>

        <div className="tms-benefits-grid">
          {t.benefits.map((benefit) => (
            <div key={benefit.id} className={`tms-benefit-card ${benefit.type}`}>
              <div className="tms-benefit-icon">{benefit.icon}</div>
              <div className="tms-benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* BENEFITS SECTION */
        .tms-benefits {
          width: 100%;
          padding: 16px 0 22px;
          background: #ffffff;
        }
        .tms-benefits-container {
          width: 92%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADING */
        .tms-benefits-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .benefits-heading-line {
          width: 22px;
          height: 3px;
          flex-shrink: 0;
          background: #f15a24;
          border-radius: 10px;
        }
        .tms-benefits-heading h2 {
          margin: 0;
          color: #08275c;
          font-size: calc(20px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.2;
        }

        /* GRID */
        .tms-benefits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        /* CARD */
        .tms-benefit-card {
          min-height: 78px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 7px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .tms-benefit-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 16px rgba(15, 23, 42, 0.08);
        }

        /* CARD BACKGROUNDS */
        .tms-benefit-card.blue { background: linear-gradient(90deg, #edf6ff, #e6f1ff); }
        .tms-benefit-card.orange { background: linear-gradient(90deg, #fff5ed, #fff0e6); }
        .tms-benefit-card.green { background: linear-gradient(90deg, #ecfbf1, #e4f8eb); }
        .tms-benefit-card.peach { background: linear-gradient(90deg, #fff5ed, #fff0e7); }

        /* ICON */
        .tms-benefit-icon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 21px;
        }
        .blue .tms-benefit-icon { background: #d8ebff; color: #1467d7; }
        .orange .tms-benefit-icon { background: #ffe1cf; color: #ff5c0b; }
        .green .tms-benefit-icon { background: #ccefd8; color: #16953b; }
        .peach .tms-benefit-icon { background: #ffe0cf; color: #ff641f; }

        /* TEXT */
        .tms-benefit-content { min-width: 0; }
        .tms-benefit-content h3 {
          margin: 0 0 4px;
          color: #08275c;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.2;
        }
        .green .tms-benefit-content h3 { color: #16853a; }
        .orange .tms-benefit-content h3, .peach .tms-benefit-content h3 { color: #f25a16; }
        .tms-benefit-content p {
          margin: 0;
          color: #334155;
          font-size: calc(10.5px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.35;
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .tms-benefit-card {
            min-height: 82px;
            padding: 13px 18px;
          }
          .tms-benefit-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .tms-benefit-content p { font-size: calc(10.5px * var(--font-scale, 1)); }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .tms-benefits-container { width: 94%; }
          .tms-benefits-grid { gap: 11px; }
          .tms-benefit-card {
            padding: 11px 13px;
            gap: 11px;
          }
          .tms-benefit-icon {
            width: 41px;
            height: 41px;
            font-size: 19px;
          }
          .tms-benefit-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .tms-benefit-content p { font-size: calc(10px * var(--font-scale, 1)); }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .tms-benefits-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* 900px */
        @media (max-width: 900px) {
          .tms-benefits { padding: 18px 0 22px; }
          .tms-benefits-heading h2 { font-size: calc(18px * var(--font-scale, 1)); }
        }

        /* 600px */
        @media (max-width: 600px) {
          .tms-benefits-container { width: calc(100% - 30px); }
          .tms-benefits-heading {
            gap: 9px;
            margin-bottom: 12px;
          }
          .benefits-heading-line { width: 18px; }
          .tms-benefits-heading h2 { font-size: calc(17px * var(--font-scale, 1)); }
          .tms-benefits-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .tms-benefit-card {
            min-height: 72px;
            padding: 11px 13px;
          }
          .tms-benefit-icon {
            width: 38px;
            height: 38px;
            font-size: 17px;
          }
          .tms-benefit-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .tms-benefit-content p { font-size: calc(10px * var(--font-scale, 1)); }
        }

        /* 400px */
        @media (max-width: 400px) {
          .tms-benefits-container { width: calc(100% - 24px); }
          .tms-benefit-card {
            gap: 10px;
            padding: 10px 11px;
          }
          .tms-benefit-icon {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
          .tms-benefit-content h3 { font-size: calc(11.5px * var(--font-scale, 1)); }
          .tms-benefit-content p { font-size: calc(9.5px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
