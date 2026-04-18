import React, { useContext } from "react";
import { LanguageContext } from "../../pages/LanguageContext";

import ps_logo from "../../assets/PS_TRANS.png";
import bdoLogo from "../../assets/BDO_logo.png";

export default function Footer() {
  const { lang } = useContext(LanguageContext);

  const content = {
    en: {
      brandDesc:
        "Pragati Setu is a unified digital platform for monitoring, analytics, and governance, empowering Self Help Groups and rural institutions across Uttar Pradesh.",
      lastUpdated: "Last Updated: 26 Jan, 2026",

      col1: "Pragati Setu",
      col1Links: [
        "About Pragati Setu",
        "About UPSRLM",
        "Contact Us",
        "Dashboards",
        "Pragati Setu Outreach",
        "Lakhpati Didi Impact",
        "CLF Performance",
        "Community Funds",
      ],

      col2: "Our Services",
      col2Links: [
        "Beneficiary Management System",
        "Training Management System",
        "Enterprise Sakhi",
        "Lakhpati Didi",
        "Monitoring & Analytics",
      ],

      col3: "Help & Support",
      col3Links: [
        "Application Information",
        "Release Notes",
        "Frequently Asked Questions",
        "What’s New",
        "Legal Info",
        "Advisory & Guidelines",
        "Copyright Policy",
      ],

      powered: "Powered by",
      rights: "All rights reserved.",

      bottom:
        "© 2026 – Copyright UPSRLM. Powered by BDO India LLP | Government of Uttar Pradesh. All rights reserved.",

      links: ["Disclaimer", "Terms & Conditions", "Privacy Policy"],
    },

    hi: {
      brandDesc:
        "प्रगति सेतु एक एकीकृत डिजिटल प्लेटफ़ॉर्म है जो निगरानी, विश्लेषण और शासन को सशक्त बनाता है, तथा उत्तर प्रदेश में स्वयं सहायता समूहों और ग्रामीण संस्थाओं को मजबूत करता है।",
      lastUpdated: "अंतिम अपडेट: 26 जनवरी, 2026",

      col1: "प्रगति सेतु",
      col1Links: [
        "प्रगति सेतु के बारे में",
        "UPSRLM के बारे में",
        "संपर्क करें",
        "डैशबोर्ड",
        "प्रगति सेतु आउटरीच",
        "लखपति दीदी प्रभाव",
        "CLF प्रदर्शन",
        "सामुदायिक निधि",
      ],

      col2: "हमारी सेवाएं",
      col2Links: [
        "लाभार्थी प्रबंधन प्रणाली",
        "प्रशिक्षण प्रबंधन प्रणाली",
        "एंटरप्राइज सखी",
        "लखपति दीदी",
        "निगरानी एवं विश्लेषण",
      ],

      col3: "सहायता एवं समर्थन",
      col3Links: [
        "एप्लिकेशन जानकारी",
        "रिलीज नोट्स",
        "अक्सर पूछे जाने वाले प्रश्न",
        "नया क्या है",
        "कानूनी जानकारी",
        "दिशानिर्देश",
        "कॉपीराइट नीति",
      ],

      powered: "द्वारा संचालित",
      rights: "सभी अधिकार सुरक्षित।",

      bottom:
        "© 2026 – कॉपीराइट UPSRLM। BDO इंडिया LLP द्वारा संचालित | उत्तर प्रदेश सरकार। सभी अधिकार सुरक्षित।",

      links: ["अस्वीकरण", "नियम व शर्तें", "गोपनीयता नीति"],
    },
  };

  const t = content[lang] || content.en;

  return (
    <footer className="ps-footer">
      <div className="ps-footer-top">
        {/* COLUMN 1 */}
        <div className="footer-col brand">
          <div className="footer-logo">
            <img src={ps_logo} alt="" className="ps-logo" />
            <span className="brand-name">Pragati Setu</span>
          </div>

          <p className="brand-desc">{t.brandDesc}</p>

          <div className="social-icons">
            <span className="icon">f</span>
            <span className="icon">x</span>
            <span className="icon">▶</span>
          </div>

          <p className="updated">{t.lastUpdated}</p>
        </div>

        {/* COLUMN 2 */}
        <div className="footer-col">
          <h4>{t.col1}</h4>
          <ul>
            {t.col1Links.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="footer-col">
          <h4>{t.col2}</h4>
          <ul>
            {t.col2Links.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4 */}
        <div className="footer-col">
          <h4>{t.col3}</h4>
          <ul>
            {t.col3Links.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* COLUMN 5 */}
        <div className="footer-col right">
          <img src={bdoLogo} alt="" style={{ width: "80px", marginTop: "20px" }} />
          <div className="powered-by">
            <p>
              {t.powered}
              <br />
              BDO India LLP
              <br />
              {t.rights}
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="ps-footer-bottom">
        <span>{t.bottom}</span>

        <div className="footer-links">
          {t.links.map((l, i) => (
            <a key={i} href="#">
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        .ps-footer {
          background: #ffffff;
          color: #334155;
          font-size: 14px;
        }

        .ps-footer-top {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 24px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
          gap: 40px;
          align-items: left;
          text-align: left;
        }

        .footer-col h4 {
          font-size: 16px;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
        }

        .footer-col li {
          margin-bottom: 10px;
          opacity: 0.85;
          cursor: pointer;
        }

        .footer-col li:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .section-gap {
          margin-top: 16px;
        }

        /* BRAND */
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ps-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
        }

        .brand-desc {
          line-height: 1.6;
          opacity: 0.85;
          margin-bottom: 16px;
        }

        .social-icons {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #1e293b;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          cursor: pointer;
        }

        .updated {
          font-size: 12px;
          opacity: 0.7;
        }

        /* RIGHT COL */
        .right {
          text-align: left;
        }

        .di-placeholder,
        .playstore-placeholder {
          width: 160px;
          height: 48px;
          background: #1e293b;
          border-radius: 6px;
          display: flex;
          align-items: left;
          justify-content: left;
          margin: 12px 0;
          font-size: 12px;
        }

        /* BOTTOM BAR */
        .ps-footer-bottom {
          border-top: 1px solid #334155;
          padding: 18px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
          font-size: 13px;
          opacity: 0.9;
        }
        .footer-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
        }          
        .footer-links a {
          color: #334155;
          text-decoration: none;
          font-weight: 500;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        .powered-by p {
          font-size: 13px;
          opacity: 0.9;
          margin-top: 2px;
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .ps-footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .ps-footer-top {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
