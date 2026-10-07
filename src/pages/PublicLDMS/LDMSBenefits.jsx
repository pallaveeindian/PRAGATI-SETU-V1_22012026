// src/pages/PublicLDMS/LDMSBenefits.jsx

import React, { useContext } from "react";
import { FaCoins, FaUsers, FaSeedling, FaChartBar } from "react-icons/fa";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    heading: "Key Benefits",
    benefits: [
      {
        id: 1,
        title: "Higher Household Income",
        description:
          "Increase annual household income and improve living standards.",
        icon: <FaCoins />,
        type: "blue",
      },
      {
        id: 2,
        title: "Women-led Enterprises",
        description:
          "Support formation and growth of women-led producer groups, enterprises and FPOs.",
        icon: <FaUsers />,
        type: "orange",
      },
      {
        id: 3,
        title: "Guided Livelihood Growth",
        description:
          "Access to training, market linkages and convergent government schemes like SVEP and MED.",
        icon: <FaSeedling />,
        type: "green",
      },
      {
        id: 4,
        title: "Better Monitoring",
        description:
          "Track progress with digital tools, ensure transparency and enable evidence-based support.",
        icon: <FaChartBar />,
        type: "peach",
      },
    ],
  },
  hi: {
    heading: "प्रमुख लाभ",
    benefits: [
      {
        id: 1,
        title: "अधिक पारिवारिक आय",
        description:
          "वार्षिक पारिवारिक आय बढ़ाने और जीवन स्तर में सुधार करने में सहायता।",
        icon: <FaCoins />,
        type: "blue",
      },
      {
        id: 2,
        title: "महिला-नेतृत्व वाले उद्यम",
        description:
          "महिला-नेतृत्व वाले उत्पादक समूहों, उद्यमों और FPOs के गठन एवं विकास को बढ़ावा।",
        icon: <FaUsers />,
        type: "orange",
      },
      {
        id: 3,
        title: "मार्गदर्शित आजीविका विकास",
        description:
          "प्रशिक्षण, बाजार संपर्क और SVEP एवं MED जैसी सरकारी योजनाओं तक पहुँच।",
        icon: <FaSeedling />,
        type: "green",
      },
      {
        id: 4,
        title: "बेहतर निगरानी",
        description:
          "डिजिटल उपकरणों से प्रगति की निगरानी, पारदर्शिता और बेहतर निर्णय आधारित सहायता।",
        icon: <FaChartBar />,
        type: "peach",
      },
    ],
  },
};

export default function LDMSBenefits() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="ldms-benefits">
      <div className="ldms-benefits-container">
        <div className="ldms-benefits-heading">
          <span className="ldms-benefits-line"></span>
          <h2>{t.heading}</h2>
        </div>

        <div className="ldms-benefits-grid">
          {t.benefits.map((benefit) => (
            <div
              className={`ldms-benefit-card ${benefit.type}`}
              key={benefit.id}
            >
              <div className="ldms-benefit-icon">{benefit.icon}</div>
              <div className="ldms-benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ldms-benefits {
          width: 100%;
          padding: 16px 0 24px;
          background: #ffffff;
        }
        .ldms-benefits-container {
          width: 92%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .ldms-benefits-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .ldms-benefits-line {
          width: 24px;
          height: 3px;
          flex-shrink: 0;
          background: #ff5b0b;
          border-radius: 20px;
        }
        .ldms-benefits-heading h2 {
          margin: 0;
          color: #071b4d;
          font-size: calc(21px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.2;
        }

        .ldms-benefits-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .ldms-benefit-card {
          min-height: 86px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 15px;
          border-radius: 7px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ldms-benefit-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 16px rgba(15, 23, 42, 0.08);
        }

        .ldms-benefit-card.blue { background: linear-gradient(90deg, #edf6ff 0%, #e6f2ff 100%); }
        .ldms-benefit-card.orange { background: linear-gradient(90deg, #fff5ed 0%, #fff0e7 100%); }
        .ldms-benefit-card.green { background: linear-gradient(90deg, #ecfbf1 0%, #e5f8eb 100%); }
        .ldms-benefit-card.peach { background: linear-gradient(90deg, #fff5ed 0%, #fff1e8 100%); }

        .ldms-benefit-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 21px;
        }
        .blue .ldms-benefit-icon { background: #d9ebff; color: #0874e8; }
        .orange .ldms-benefit-icon { background: #ffe3d2; color: #ff5b0b; }
        .green .ldms-benefit-icon { background: #d8f3df; color: #14a044; }
        .peach .ldms-benefit-icon { background: #ffe1cf; color: #ff5b0b; }

        .ldms-benefit-content { min-width: 0; flex: 1; }
        .ldms-benefit-content h3 {
          margin: 0 0 4px;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.2;
        }
        .blue .ldms-benefit-content h3 { color: #0755b5; }
        .orange .ldms-benefit-content h3 { color: #f45b16; }
        .green .ldms-benefit-content h3 { color: #16853a; }
        .peach .ldms-benefit-content h3 { color: #f45b16; }
        .ldms-benefit-content p {
          margin: 0;
          color: #334155;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.35;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .ldms-benefits-container { max-width: 1420px; }
          .ldms-benefits-heading h2 { font-size: calc(22px * var(--font-scale, 1)); }
          .ldms-benefit-card {
            min-height: 90px;
            padding: 13px 17px;
          }
          .ldms-benefit-icon {
            width: 50px;
            height: 50px;
            font-size: 22px;
          }
          .ldms-benefit-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .ldms-benefit-content p { font-size: calc(14px * var(--font-scale, 1)); }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .ldms-benefits-container { width: 94%; }
          .ldms-benefits-grid { gap: 11px; }
          .ldms-benefit-card {
            min-height: 84px;
            gap: 11px;
            padding: 11px 12px;
          }
          .ldms-benefit-icon {
            width: 42px;
            height: 42px;
            font-size: 19px;
          }
          .ldms-benefit-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .ldms-benefit-content p { font-size: calc(13px * var(--font-scale, 1)); }
        }

        /* 1024px small laptop / tablet */
        @media (max-width: 1024px) {
          .ldms-benefits-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .ldms-benefit-card { min-height: 82px; }
        }

        /* 900px tablet */
        @media (max-width: 900px) {
          .ldms-benefits { padding: 18px 0 22px; }
          .ldms-benefits-heading h2 { font-size: calc(18px * var(--font-scale, 1)); }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .ldms-benefits-container { width: calc(100% - 30px); }
          .ldms-benefits-heading {
            gap: 9px;
            margin-bottom: 12px;
          }
          .ldms-benefits-line { width: 18px; }
          .ldms-benefits-heading h2 { font-size: calc(17px * var(--font-scale, 1)); }
          .ldms-benefits-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .ldms-benefit-card {
            min-height: 74px;
            gap: 11px;
            padding: 11px 13px;
          }
          .ldms-benefit-icon {
            width: 39px;
            height: 39px;
            font-size: 17px;
          }
          .ldms-benefit-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .ldms-benefit-content p { font-size: calc(12px * var(--font-scale, 1)); }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .ldms-benefits-container { width: calc(100% - 24px); }
          .ldms-benefit-card {
            gap: 9px;
            padding: 10px 11px;
          }
          .ldms-benefit-icon {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
          .ldms-benefit-content h3 { font-size: calc(11.5px * var(--font-scale, 1)); }
          .ldms-benefit-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
