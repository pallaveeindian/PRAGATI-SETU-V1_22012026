// src/components/layout/Footer.jsx
import React, { useContext } from "react";
import { LanguageContext } from "../../pages/LanguageContext";
import { Link } from "react-router-dom";
import psLogo from "../../assets/PS_TRANS.png";
import bdoLogo from "../../assets/BDO_logo.png";
import footerBg from "../../assets/Hero/footer_bg2.png";

const content = {
  en: {
    description:
      "A Digital Bridge for a Stronger Rural and Prosperous Uttar Pradesh.",
    quickLinks: "Quick Links",
    quickLinksItems: [
      { label: "About Us", to: "/about-us" },
      { label: "Contact Us", to: "/contact-us" },
      { label: "Dashboards", to: "/" },
      { label: "Resource Centre", to: "/user-manual" },
    ],
    services: "Our Services",
    serviceItems: [
      { label: "Beneficiary Management", to: "/beneficiary-profiling" },
      { label: "Training Management", to: "/training-management" },
      { label: "Enterprise Sakhi", to: "/Enterprise-Tracking" },
      { label: "Lakhpati Didi", to: "/Lakhpati-Didi" },
    ],
    support: "Help & Support",
    supportItems: [
      { label: "FAQs", to: "/frequently-asked-questions" },
      { label: "Release Notes", to: "/frequently-asked-questionss" },
      { label: "Guidelines", to: "/user-manual" },
      { label: "Grievance Redressal", to: "/register-grievance" },
    ],
    powered: "Powered by",
    rights: "All rights reserved.",
    copyright:
      "© 2026 Pragati Setu | Uttar Pradesh State Rural Livelihoods Mission",
    bottomLinks: [
      {
        label: "Privacy Policy",
        to: "/privacy-policy",
      },
      {
        label: "Terms of Use",
        to: "/terms-of-use",
      },
      {
        label: "Accessibility",
        to: "/accessibility",
      },
    ],
  },
  hi: {
    description: "सशक्त ग्रामीण और समृद्ध उत्तर प्रदेश के लिए एक डिजिटल सेतु।",
    quickLinks: "त्वरित लिंक",
    quickLinksItems: [
      { label: "हमारे बारे में", to: "/about-us" },
      { label: "संपर्क करें", to: "/contact-us" },
      { label: "डैशबोर्ड", to: "/" },
      { label: "संसाधन केंद्र", to: "/user-manual" },
    ],
    services: "हमारी सेवाएं",
    serviceItems: [
      { label: "लाभार्थी प्रबंधन", to: "/beneficiary-profiling" },
      { label: "प्रशिक्षण प्रबंधन", to: "/training-management" },
      { label: "एंटरप्राइज सखी", to: "/Enterprise-Tracking" },
      { label: "लखपति दीदी", to: "/Lakhpati-Didi" },
    ],
    support: "सहायता एवं समर्थन",
    supportItems: [
      {
        label: "अक्सर पूछे जाने वाले प्रश्न",
        to: "/frequently-asked-questions",
      },
      { label: "रिलीज नोट्स", to: "/what's-new" },
      { label: "दिशानिर्देश", to: "/user-manual" },
      { label: "शिकायत निवारण", to: "/register-grievance" },
    ],
    powered: "द्वारा संचालित",
    rights: "सभी अधिकार सुरक्षित।",
    copyright: "© 2026 प्रगति सेतु | उत्तर प्रदेश राज्य ग्रामीण आजीविका मिशन",
    bottomLinks: [
      {
        label: "गोपनीयता नीति",
        to: "/privacy-policy",
      },
      {
        label: "उपयोग की शर्तें",
        to: "/terms-of-use",
      },
      {
        label: "सुगम्यता",
        to: "/accessibility",
      },
    ],
  },
};

const SOCIAL_LINKS = [
  { label: "Facebook", text: "f" },
  { label: "X", text: "X" },
  { label: "YouTube", text: "▶" },
  { label: "LinkedIn", text: "in" },
];

function FooterColumn({ title, items }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <footer className="ps-footer">
      <div
        className="ps-footer-main"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <div className="footer-content">
          <div className="footer-brand">
            <img src={psLogo} alt="Pragati Setu" className="footer-ps-logo" />
            <p>{t.description}</p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((item) => (
                <a key={item.label} href="#" aria-label={item.label}>
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t.quickLinks} items={t.quickLinksItems} />
          <FooterColumn title={t.services} items={t.serviceItems} />
          <FooterColumn title={t.support} items={t.supportItems} />

          <div className="footer-powered">
            <span>{t.powered}</span>
            <img src={bdoLogo} alt="BDO India LLP" />
            <strong>BDO India LLP</strong>
            <small>{t.rights}</small>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p>{t.copyright}</p>
            <div className="footer-bottom-links">
              {t.bottomLinks.map((item) => (
                <Link key={item.to} to={item.to} className="footer-policy-box">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ps-footer, .ps-footer * {
          box-sizing: border-box;
        }
        .ps-footer {
          width: 100%;
          margin: 0;
          font-family: inherit;
        }

        /* main footer — desktop shows the full background image, no cropping */
        .ps-footer-main {
          width: 100%;
          background-color: #06345e;
          background-size: 100% 100%;
          background-position: center bottom;
          background-repeat: no-repeat;
          color: #ffffff;
        }

        .footer-content {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 18px 350px 18px 42px;
          display: grid;
          grid-template-columns: 180px 120px 155px 145px 95px;
          gap: 24px;
          align-items: start;
          text-align: left;
        }

        .footer-brand { min-width: 0; }
        .footer-ps-logo {
          display: block;
          width: 85px;
          height: auto;
          margin-bottom: 6px;
        }
        .footer-brand p {
          max-width: 185px;
          margin: 0 0 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          font-weight: 600;
          line-height: 1.4;
        }

        .footer-social { display: flex; gap: 8px; }
        .footer-social a {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 50%;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s ease;
        }
        .footer-social a:hover {
          background: #ffffff;
          color: #06345e;
        }

        .footer-column { min-width: 0; }
        .footer-column h4 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.2;
        }
        .footer-column ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .footer-column li {
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }
        .footer-column a {
          display: inline-block;
          color: rgba(255, 255, 255, 0.88);
          font-size: 10.5px;
          font-weight: 600;
          line-height: 1.2;
          text-decoration: none;
        }
        .footer-column a:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .footer-powered {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .footer-powered > span {
          margin-bottom: 2px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 9px;
        }
        .footer-powered img {
          width: 58px;
          height: auto;
          margin-bottom: 2px;
        }
        .footer-powered strong {
          margin-bottom: 2px;
          font-size: 10px;
          color: #ffffff;
          white-space: nowrap;
        }
        .footer-powered small {
          color: rgba(255, 255, 255, 0.8);
          font-size: 8px;
        }

        /* bottom footer — inside the same background image, no middle divider line */
        .footer-bottom {
          width: 100%;
          background: transparent;
          border-top: none;
        }
        .footer-bottom-inner {
          width: 100%;
          max-width: 1500px;
          min-height: 36px;
          margin: 0 auto;
          padding: 4px 45px 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .footer-bottom p {
          margin: 0;
          color: rgba(255, 255, 255, .92);
          font-size: 9px;
          font-weight: 600;
        }
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        /* each policy link is its own box */
        .footer-policy-box {
          min-height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 12px;
          border: 1px solid rgba(255, 255, 255, .45);
          border-radius: 5px;
          background: #ffffff;
          color: #000000;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background .25s ease, color .25s ease, border-color .25s ease, transform .25s ease;
        }
        .footer-policy-box:hover {
          background: #ffffff;
          color: #06345e;
          border-color: #ffffff;
          transform: translateY(-2px);
          text-decoration: none;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .ps-footer-main {
            background-size: 100% 100%;
            background-position: center bottom;
          }
          .footer-content {
            max-width: 1600px;
            padding: 16px 260px 14px 55px;
            grid-template-columns: 200px 145px 185px 165px 115px;
            gap: 32px;
          }
          .footer-column h4 { font-size: 14px; }
          .footer-column a { font-size: 11px; }
          .footer-bottom-inner {
            max-width: 1600px;
            min-height: 36px;
            padding: 4px 55px;
          }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .ps-footer-main {
            background-size: 100% 100%;
            background-position: center bottom;
          }
          .footer-content {
            padding: 20px 155px 22px 30px;
            grid-template-columns: 165px 115px 150px 135px 95px;
            gap: 20px;
          }
          .footer-ps-logo { width: 85px; }
          .footer-brand p {
            max-width: 160px;
            font-size: 10px;
          }
          .footer-column h4 { font-size: 12px; }
          .footer-column a { font-size: 9.5px; }
        }

        /* 1024px small laptop — still shows the image */
        @media (max-width: 1024px) {
          .ps-footer-main {
            background-size: 100% 100%;
            background-position: center bottom;
          }
          .footer-content {
            padding: 22px 65px 45px 24px;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 28px;
            row-gap: 16px;
          }
          .footer-brand { grid-row: 1 / span 2; }
          .footer-column h4 {
            font-size: 12px;
            margin-bottom: 7px;
          }
          .footer-column ul { gap: 5px; }
          .footer-column a { font-size: 9.5px; }
        }

        /* 900px tablet — background image removed */
        @media (max-width: 900px) {
          .ps-footer-main {
            background-image: none !important;
            background-color: #06345e;
          }
          .footer-content {
            padding: 22px 20px 24px;
            grid-template-columns: 1fr 1fr;
            column-gap: 30px;
            row-gap: 18px;
          }
          .footer-brand {
            grid-column: 1 / -1;
            grid-row: auto;
          }
          .footer-brand p {
            max-width: 280px;
            font-size: 10px;
          }
          .footer-column, .footer-powered { padding-top: 2px; }
          .footer-column h4 {
            margin-bottom: 7px;
            font-size: 12px;
          }
          .footer-column ul { gap: 5px; }
          .footer-column a { font-size: 10px; }
          .footer-bottom-inner {
            padding: 8px 16px;
            flex-direction: column;
            justify-content: center;
            gap: 4px;
            text-align: center;
          }
          .footer-bottom-links { justify-content: center; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .ps-footer-main {
            background-image: none !important;
            background-color: #06345e;
          }
          .footer-content {
            padding: 20px 16px 22px;
            grid-template-columns: 1fr 1fr;
            column-gap: 18px;
            row-gap: 16px;
          }
          .footer-brand { grid-column: 1 / -1; }
          .footer-ps-logo { width: 85px; }
          .footer-brand p {
            max-width: 250px;
            margin-bottom: 9px;
            font-size: 10px;
          }
          .footer-social a {
            width: 27px;
            height: 27px;
            font-size: 9px;
          }
          .footer-column, .footer-powered {
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
          }
          .footer-column h4 {
            margin-bottom: 7px;
            font-size: 11.5px;
          }
          .footer-column ul { gap: 5px; }
          .footer-column a {
            font-size: 9.5px;
            line-height: 1.4;
          }
          .footer-powered > span { font-size: 8.5px; }
          .footer-powered img { width: 52px; }
          .footer-powered strong { font-size: 9.5px; }
          .footer-powered small { font-size: 7.5px; }
          .footer-bottom p, .footer-bottom-links a { font-size: 8px; }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .ps-footer-main {
            background-image: none !important;
            background-color: #06345e;
          }
          .footer-content {
            padding: 18px 12px 20px;
            grid-template-columns: 1fr 1fr;
            column-gap: 12px;
            row-gap: 14px;
          }
          .footer-ps-logo { width: 80px; }
          .footer-brand p {
            max-width: 235px;
            font-size: 9.5px;
          }
          .footer-social a {
            width: 25px;
            height: 25px;
          }
          .footer-column, .footer-powered { padding-top: 8px; }
          .footer-column h4 { font-size: 11px; }
          .footer-column ul { gap: 4px; }
          .footer-column a { font-size: 9px; }
          .footer-powered img { width: 48px; }
          .footer-bottom-inner { padding: 7px 9px; }
          .footer-bottom-links { gap: 5px; }
          .footer-bottom p, .footer-bottom-links a { font-size: 7.5px; }
        }
      `}</style>
    </footer>
  );
}
