// src/pages/ContactDetails.jsx

import React, { useContext, useEffect } from "react";
import { LanguageContext } from "./LanguageContext.jsx";
import upLogo from "../assets/upgov_logo.jpg";
import contactBg from "../assets/contact_bg.png";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import { FaUsers, FaUser, FaEnvelope, FaPhoneAlt, FaHashtag } from "react-icons/fa";

const content = {
  en: {
    title1: "Contact",
    title2: "Details",
    introTitle: "For support and official communication, please connect with the concerned officers below.",
    introText: "You may reach out to the respective officers for queries related to Pragati Setu and Rural Development initiatives.",
    headers: ["Sr. No.", "Name", "Email ID", "Telephone No."],
  },
  hi: {
    title1: "संपर्क",
    title2: "विवरण",
    introTitle: "सहायता एवं आधिकारिक संवाद के लिए नीचे दिए गए संबंधित अधिकारियों से संपर्क करें।",
    introText: "प्रगति सेतु एवं ग्रामीण विकास से संबंधित प्रश्नों के लिए संबंधित अधिकारियों से संपर्क किया जा सकता है।",
    headers: ["क्र. सं.", "नाम", "ईमेल आईडी", "टेलीफोन नंबर"],
  },
};

// icon for each table header column, in order
const HEADER_ICONS = [FaHashtag, FaUser, FaEnvelope, FaPhoneAlt];

const contacts = [
  { id: 1, name: "Sh. Rajesh Kumar", designation: "Principal Secretary", department: "Rural Development, GoUP", email: "officer1@example.gov.in", phone: "0522-0000001" },
  { id: 2, name: "Ms. Anjali Verma, IAS", designation: "Commissioner", department: "Rural Development, GoUP", email: "officer2@example.gov.in", phone: "0522-0000002" },
  { id: 3, name: "Sh. Amit Singh, IAS", designation: "Mission Director", department: "UPSRLM", email: "officer3@example.gov.in", phone: "9000000000" },
];

const telHref = (phone) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

function ContactLink({ href, icon, text, className }) {
  return (
    <a href={href} className={className}>
      <span className="contact-cell-icon">{icon}</span>
      <span>{text}</span>
    </a>
  );
}

export default function ContactDetails() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="contact-details-page">
      <GovHeader logo={upLogo} title="Government Of Uttar Pradesh" onFontChange={setFontScale} />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="contact-main" style={{ backgroundImage: `url(${contactBg})` }}>
        <div className="contact-container">
          <div className="contact-title-wrapper">
            <div className="contact-title-lines">
              <span></span>
              <span></span>
            </div>
            <h1>
              <span className="contact-orange">{t.title1}</span> <span className="contact-blue">{t.title2}</span>
            </h1>
          </div>

          <section className="contact-intro-card">
            <div className="contact-intro-icon">
              <FaUsers />
            </div>

            <div className="contact-intro-content">
              <h2>{t.introTitle}</h2>
              <p>{t.introText}</p>
            </div>

            <div className="contact-intro-decoration">
              <div className="contact-circle circle-1"></div>
              <div className="contact-circle circle-2"></div>
            </div>
          </section>

          <section className="contact-table-card">
            <div className="contact-table-wrapper">
              <table className="contact-table">
                <colgroup>
                  <col className="contact-col-number" />
                  <col className="contact-col-name" />
                  <col className="contact-col-email" />
                  <col className="contact-col-phone" />
                </colgroup>

                <thead>
                  <tr>
                    {t.headers.map((label, index) => {
                      const Icon = HEADER_ICONS[index];
                      return (
                        <th key={label} className={index === 0 ? "contact-header-number" : undefined}>
                          <span className="contact-header-icon">
                            <Icon />
                          </span>
                          <span>{label}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="contact-number-cell">
                        <span className="contact-number">{contact.id}</span>
                      </td>
                      <td>
                        <div className="contact-officer-name">{contact.name}</div>
                        <div className="contact-designation">{contact.designation}</div>
                        <div className="contact-department">{contact.department}</div>
                      </td>
                      <td>
                        <ContactLink href={`mailto:${contact.email}`} icon={<FaEnvelope />} text={contact.email} className="contact-link" />
                      </td>
                      <td>
                        <ContactLink href={telHref(contact.phone)} icon={<FaPhoneAlt />} text={contact.phone} className="contact-link contact-phone-link" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="contact-mobile-list">
              {contacts.map((contact) => (
                <div className="contact-mobile-card" key={contact.id}>
                  <div className="mobile-contact-top">
                    <span className="mobile-contact-number">{contact.id}</span>
                    <div>
                      <h3>{contact.name}</h3>
                      <p>{contact.designation}</p>
                      <p>{contact.department}</p>
                    </div>
                  </div>

                  <ContactLink href={`mailto:${contact.email}`} icon={<FaEnvelope />} text={contact.email} className="mobile-contact-detail" />
                  <ContactLink href={telHref(contact.phone)} icon={<FaPhoneAlt />} text={contact.phone} className="mobile-contact-detail" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="contact-footer">
        <Footer />
      </footer>

      <style>{`
        .contact-details-page, .contact-details-page * {
          box-sizing: border-box;
        }
        :root { --font-scale: 1; }
        .contact-details-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #ffffff;
        }

        .contact-main {
          position: relative;
          width: 100%;
          min-height: 700px;
          padding: 38px 0 60px;
          background-color: #fffaf6;
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
        }
        /* lighter overlay so contact_bg.png stays visible */
        .contact-main::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(255,250,246,0.72) 100%);
          pointer-events: none;
        }

        .contact-container {
          position: relative;
          z-index: 2;
          width: 92%;
          max-width: 1420px;
          margin: 0 auto;
        }

        /* title */
        .contact-title-wrapper { margin-bottom: 25px; }
        .contact-title-lines {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .contact-title-lines span:first-child {
          width: 46px;
          height: 4px;
          border-radius: 10px;
          background: #ff5b0b;
        }
        .contact-title-lines span:last-child {
          width: 42px;
          height: 4px;
          border-radius: 10px;
          background: #ffe0cb;
        }
        .contact-title-wrapper h1 {
          margin: 0;
          font-size: calc(54px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.05;
        }
        .contact-orange { color: #ff5b0b; }
        .contact-blue { color: #07275d; }

        /* intro card */
        .contact-intro-card {
          position: relative;
          width: 100%;
          min-height: 128px;
          margin-bottom: 23px;
          padding: 24px 38px;
          display: grid;
          grid-template-columns: 100px 1fr 190px;
          align-items: center;
          gap: 22px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #f4dfd0;
          border-left: 6px solid #ff5b0b;
          border-radius: 18px;
          box-shadow: 0 7px 25px rgba(108, 65, 34, 0.07);
        }
        .contact-intro-icon {
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #fff7f0, #ffe8d7);
          color: #ff5b0b;
          font-size: 31px;
        }
        .contact-intro-content { position: relative; z-index: 3; }
        .contact-intro-content h2 {
          margin: 0 0 7px;
          color: #07275d;
          font-size: calc(18px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.4;
        }
        .contact-intro-content p {
          margin: 0;
          color: #536987;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.55;
        }
        .contact-intro-decoration { position: relative; height: 100%; }
        .contact-circle { position: absolute; border-radius: 50%; }
        .circle-1 {
          width: 180px;
          height: 180px;
          top: -58px;
          right: -15px;
          border: 35px solid rgba(255, 190, 145, 0.20);
        }
        .circle-2 {
          width: 95px;
          height: 95px;
          right: 52px;
          bottom: -44px;
          background: rgba(255, 225, 205, 0.33);
        }

        /* table card */
        .contact-table-card {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #edf0f4;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(31, 48, 74, 0.08);
        }
        .contact-table-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          border: 1px solid #dfe6ee;
          border-radius: 14px;
        }
        .contact-table {
          width: 100%;
          min-width: 900px;
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
        }
        .contact-col-number { width: 13%; }
        .contact-col-name { width: 38%; }
        .contact-col-email { width: 27%; }
        .contact-col-phone { width: 22%; }

        .contact-table thead, .contact-table thead tr {
          background: linear-gradient(90deg, #173f70 0%, #103b6b 50%, #082f5c 100%) !important;
        }
        /* background on TH directly so global table CSS can't make the header white */
        .contact-table thead th {
          height: 62px;
          padding: 0 27px;
          background: #103b6b !important;
          color: #ffffff !important;
          border-top: none !important;
          border-bottom: none !important;
          border-right: 1px solid rgba(255, 255, 255, 0.20) !important;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 800;
          text-align: left;
          vertical-align: middle;
          white-space: nowrap;
        }
        .contact-table thead th:first-child { border-top-left-radius: 12px; }
        .contact-table thead th:last-child {
          border-top-right-radius: 12px;
          border-right: none !important;
        }
        .contact-header-number { text-align: center !important; }
        .contact-header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 11px;
          color: #ff690f !important;
          font-size: 18px;
          vertical-align: middle;
        }

        .contact-table tbody tr {
          background: #ffffff;
          transition: background 0.2s ease;
        }
        .contact-table tbody tr:nth-child(even) { background: #fbfcfd; }
        .contact-table tbody tr:hover { background: #fff8f3; }
        .contact-table tbody td {
          padding: 18px 28px;
          background: inherit;
          border-right: 1px solid #e4e9ef;
          border-bottom: 1px solid #e4e9ef;
          color: #405675;
          vertical-align: middle;
        }
        .contact-table tbody td:last-child { border-right: none; }
        .contact-table tbody tr:last-child td { border-bottom: none; }

        .contact-number-cell { text-align: center; }
        .contact-number {
          width: 45px;
          height: 45px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ff5b0b;
          background: linear-gradient(135deg, #fff7f0, #ffe9da);
          font-size: calc(16px * var(--font-scale, 1));
          font-weight: 900;
        }

        .contact-officer-name {
          margin-bottom: 4px;
          color: #07275d;
          font-size: calc(16px * var(--font-scale, 1));
          font-weight: 900;
        }
        .contact-designation, .contact-department {
          color: #536987;
          font-size: calc(13px * var(--font-scale, 1));
          line-height: 1.45;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          color: #0874dc;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 600;
          line-height: 1.4;
          text-decoration: none;
          word-break: break-word;
        }
        .contact-phone-link { color: #07275d; }
        .contact-link:hover { color: #ff5b0b; }
        .contact-cell-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff4ec;
          color: #ff5b0b;
          font-size: 14px;
        }

        .contact-mobile-list { display: none; }

        .contact-footer {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .contact-container { max-width: 1500px; }
          .contact-title-wrapper h1 { font-size: calc(58px * var(--font-scale, 1)); }
          .contact-intro-card { min-height: 135px; }
          .contact-table thead th { font-size: calc(16px * var(--font-scale, 1)); }
          .contact-officer-name { font-size: calc(17px * var(--font-scale, 1)); }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .contact-container { width: 94%; }
          .contact-title-wrapper h1 { font-size: calc(48px * var(--font-scale, 1)); }
          .contact-intro-card {
            grid-template-columns: 85px 1fr 140px;
            padding: 22px 28px;
          }
          .contact-table thead th, .contact-table tbody td {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .contact-main { padding-top: 35px; }
          .contact-title-wrapper h1 { font-size: calc(42px * var(--font-scale, 1)); }
          .contact-intro-card {
            grid-template-columns: 72px 1fr;
            gap: 18px;
          }
          .contact-intro-decoration { display: none; }
          .contact-intro-icon {
            width: 64px;
            height: 64px;
            font-size: 27px;
          }
          .contact-intro-content h2 { font-size: calc(16px * var(--font-scale, 1)); }
          .contact-intro-content p { font-size: calc(13px * var(--font-scale, 1)); }
        }

        /* 900px */
        @media (max-width: 900px) {
          .contact-container { width: calc(100% - 32px); }
          .contact-title-wrapper { text-align: center; }
          .contact-title-lines { justify-content: center; }
          .contact-title-wrapper h1 { font-size: calc(38px * var(--font-scale, 1)); }
          .contact-intro-card {
            grid-template-columns: 64px 1fr;
            padding: 20px 24px;
          }
          .contact-table-card { padding: 12px; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .contact-main {
            padding: 28px 0 40px;
            background-size: auto 100%;
          }
          .contact-container { width: calc(100% - 20px); }
          .contact-title-wrapper { margin-bottom: 20px; }
          .contact-title-wrapper h1 { font-size: calc(32px * var(--font-scale, 1)); }
          .contact-intro-card {
            grid-template-columns: 1fr;
            padding: 20px;
            text-align: center;
            border-left: 1px solid #f4dfd0;
            border-top: 5px solid #ff5b0b;
          }
          .contact-intro-icon { margin: 0 auto; }
          .contact-intro-content h2 { font-size: calc(15px * var(--font-scale, 1)); }
          .contact-intro-content p { font-size: calc(12px * var(--font-scale, 1)); }
          /* desktop table off, mobile cards on */
          .contact-table-wrapper { display: none; }
          .contact-mobile-list {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .contact-table-card {
            padding: 0;
            border: none;
            background: transparent;
            box-shadow: none;
          }
          .contact-mobile-card {
            padding: 18px;
            background: #ffffff;
            border: 1px solid #e8edf3;
            border-radius: 15px;
            box-shadow: 0 5px 17px rgba(31, 48, 74, 0.07);
          }
          .mobile-contact-top {
            display: flex;
            align-items: flex-start;
            gap: 13px;
            padding-bottom: 13px;
            margin-bottom: 13px;
            border-bottom: 1px solid #edf0f4;
          }
          .mobile-contact-number {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff0e5;
            color: #ff5b0b;
            font-weight: 900;
          }
          .mobile-contact-top h3 {
            margin: 0 0 4px;
            color: #07275d;
            font-size: calc(15px * var(--font-scale, 1));
            font-weight: 900;
          }
          .mobile-contact-top p {
            margin: 0;
            color: #536987;
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.45;
          }
          .mobile-contact-detail {
            display: flex;
            align-items: center;
            gap: 11px;
            margin-top: 10px;
            color: #174d91;
            text-decoration: none;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 600;
            word-break: break-word;
          }
          .mobile-contact-detail .contact-cell-icon {
            width: 34px;
            height: 34px;
          }
        }

        /* 400px */
        @media (max-width: 400px) {
          .contact-container { width: calc(100% - 14px); }
          .contact-title-wrapper h1 { font-size: calc(28px * var(--font-scale, 1)); }
          .contact-title-lines span:first-child { width: 35px; }
          .contact-title-lines span:last-child { width: 28px; }
          .contact-intro-card { padding: 17px 14px; }
          .contact-mobile-card { padding: 15px 13px; }
          .mobile-contact-top h3 { font-size: calc(14px * var(--font-scale, 1)); }
        }
      `}</style>
    </div>
  );
}
