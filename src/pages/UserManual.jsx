// src/pages/UserManual.jsx

import React, { useContext, useEffect } from "react";
import up_logo from "../assets/upgov_logo.jpg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext.jsx";
import { FaBookOpen, FaFileAlt, FaDownload } from "react-icons/fa";

import TRCreationGuide from "../assets/UserManuals/TRCreationGuide.pdf";
import CRPEPMappingFormGuide from "../assets/UserManuals/CRPEPMappingFormGuide.pdf";
import MOUGuide from "../assets/UserManuals/MOUGuide.pdf";
import UdhyamSakhiAppTutorial from "../assets/UserManuals/UdhyamSakhiAppTutorial.pdf";

const content = {
  en: {
    title1: "User",
    title2: " Manuals & Guides",
    intro: "Welcome to the Pragati Setu User Manuals section. Below you will find comprehensive user guides and manuals to assist you in navigating and operating various portals and modules effectively.",
    tableHeaders: ["S.No", "Document Name", "Description", "Action"],
    manuals: [
      { id: 1, name: "Training Request Creation", desc: "Cadre Selection Process and Training Request creation guidelines on the TMS Portal.", file: TRCreationGuide },
      { id: 2, name: "CRP-EP Account & Mapping", desc: "CRP-EP Account creation and panchayat mapping process for Udhyam Sakhi App login on the CRP-EP Mapping portal.", file: CRPEPMappingFormGuide },
      { id: 3, name: "SHG-MOU Registration", desc: "Complete step-by-step SHG-MOU Registration process on the Enterprise MOU portal.", file: MOUGuide },
      { id: 4, name: "CRP-EP App Recording Tutorial", desc: "Complete step-by-step Udhyam Sakhi App enterprise recording process.", file: UdhyamSakhiAppTutorial },
    ],
    download: "Download PDF",
    available: "User Manuals Available",
  },
  hi: {
    title1: "उपयोगकर्ता",
    title2: " मैनुअल और गाइड",
    intro: "प्रगति सेतु उपयोगकर्ता मैनुअल अनुभाग में आपका स्वागत है। यहां आपको विभिन्न पोर्टल्स और मॉड्यूल को प्रभावी रूप से संचालित करने में सहायता के लिए विस्तृत उपयोगकर्ता मैनुअल और मार्गदर्शिकाएँ मिलेंगी।",
    tableHeaders: ["क्र.सं.", "दस्तावेज़ का नाम", "विवरण", "कार्रवाई"],
    manuals: [
      { id: 1, name: "प्रशिक्षण अनुरोध निर्माण", desc: "TMS पोर्टल पर कैडर चयन प्रक्रिया और प्रशिक्षण अनुरोध निर्माण के दिशा-निर्देश।", file: TRCreationGuide },
      { id: 2, name: "CRP-EP खाता और मैपिंग", desc: "CRP-EP मैपिंग पोर्टल पर उद्यम सखी ऐप लॉगिन के लिए CRP-EP खाता निर्माण और पंचायत मैपिंग प्रक्रिया।", file: CRPEPMappingFormGuide },
      { id: 3, name: "SHG-MOU पंजीकरण", desc: "एंटरप्राइज MOU पोर्टल पर संपूर्ण चरण-दर-चरण SHG-MOU पंजीकरण प्रक्रिया।", file: MOUGuide },
      { id: 4, name: "सीआरपी एंटरप्राइज रिकॉर्डिंग ट्यूटोरियल", desc: "उद्यम सखी ऐप में एंटरप्राइज रिकॉर्डिंग की संपूर्ण चरण-दर-चरण प्रक्रिया।", file: UdhyamSakhiAppTutorial },
    ],
    download: "PDF डाउनलोड करें",
    available: "उपयोगकर्ता मैनुअल उपलब्ध",
  },
};

export default function UserManual() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="user-manual-page">
      <GovHeader logo={up_logo} title="Government Of Uttar Pradesh" onFontChange={setFontScale} />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="manual-page-main">
        <section className="manual-heading-section">
          <div className="manual-bg-circle manual-bg-circle-left"></div>
          <div className="manual-bg-circle manual-bg-circle-right"></div>
          <div className="manual-dots manual-dots-left"></div>
          <div className="manual-dots manual-dots-right"></div>

          <div className="manual-content-wrapper">
            <h1 className="manual-main-title">
              <span className="manual-title-blue">{t.title1}</span>
              <span className="manual-title-orange">{t.title2}</span>
            </h1>

            <div className="manual-intro-card">
              <span className="manual-intro-line"></span>
              <div className="manual-book-icon">
                <FaBookOpen />
              </div>
              <p>{t.intro}</p>
            </div>
          </div>
        </section>

        <section className="manual-table-section">
          <div className="manual-table-card">
            <div className="manual-table-wrapper">
              <table className="manual-table">
                <colgroup>
                  <col className="manual-col-sno" />
                  <col className="manual-col-name" />
                  <col className="manual-col-description" />
                  <col className="manual-col-action" />
                </colgroup>

                <thead>
                  <tr>
                    <th className="manual-sno-heading">{t.tableHeaders[0]}</th>
                    <th>{t.tableHeaders[1]}</th>
                    <th>{t.tableHeaders[2]}</th>
                    <th className="manual-action-heading">{t.tableHeaders[3]}</th>
                  </tr>
                </thead>

                <tbody>
                  {t.manuals.map((manual) => (
                    <tr key={manual.id}>
                      <td className="manual-sno-cell">
                        <span className="manual-sno">{manual.id}</span>
                      </td>
                      <td className="manual-document-cell">
                        <span className="manual-document-name">{manual.name}</span>
                      </td>
                      <td className="manual-description-cell">{manual.desc}</td>
                      <td className="manual-action-cell">
                        <a href={manual.file} target="_blank" rel="noopener noreferrer" download className="manual-download-btn">
                          <FaDownload />
                          <span>{t.download}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="manual-mobile-list">
              {t.manuals.map((manual) => (
                <article className="manual-mobile-card" key={manual.id}>
                  <div className="manual-mobile-top">
                    <span className="manual-mobile-number">{manual.id}</span>
                    <div className="manual-mobile-title">
                      <FaFileAlt />
                      <h3>{manual.name}</h3>
                    </div>
                  </div>

                  <p>{manual.desc}</p>

                  <a href={manual.file} target="_blank" rel="noopener noreferrer" download className="manual-download-btn manual-mobile-download">
                    <FaDownload />
                    <span>{t.download}</span>
                  </a>
                </article>
              ))}
            </div>

            <div className="manual-total">
              <FaFileAlt />
              <strong>{t.manuals.length}</strong>
              <span>{t.available}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="manual-footer">
        <Footer />
      </footer>

      <style>{`
        .user-manual-page, .user-manual-page * {
          box-sizing: border-box;
        }
        :root { --font-scale: 1; }
        .user-manual-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #fff8f4;
        }

        .manual-page-main {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(180deg, #fffaf7 0%, #fff5ef 100%);
        }

        /* heading section */
        .manual-heading-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 26px 0 18px;
        }
        .manual-content-wrapper {
          position: relative;
          z-index: 3;
          width: 82%;
          max-width: 1250px;
          margin: 0 auto;
        }

        .manual-main-title {
          margin: 0 0 20px;
          text-align: center;
          font-size: calc(52px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.1;
        }
        .manual-title-blue { color: #06275c; }
        .manual-title-orange { color: #ff5b0b; }

        .manual-intro-card {
          position: relative;
          width: 100%;
          min-height: 112px;
          display: grid;
          grid-template-columns: 6px 82px 1fr;
          align-items: center;
          gap: 28px;
          padding: 14px 28px 14px 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #f2e4da;
          border-radius: 15px;
          box-shadow: 0 7px 24px rgba(70, 45, 25, 0.05);
        }
        .manual-intro-line {
          width: 6px;
          height: 75px;
          border-radius: 10px;
          background: #ff5b0b;
        }
        .manual-book-icon {
          width: 74px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ff5b0b;
          background: linear-gradient(135deg, #fff7f1, #ffe8d8);
          font-size: 31px;
        }
        .manual-intro-card p {
          margin: 0;
          max-width: 1000px;
          color: #344c78;
          font-size: calc(18px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.65;
        }

        /* decorative background */
        .manual-bg-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .manual-bg-circle-left {
          width: 680px;
          height: 300px;
          left: -330px;
          top: -120px;
          border: 55px solid rgba(255, 184, 142, 0.16);
        }
        .manual-bg-circle-right {
          width: 550px;
          height: 350px;
          right: -240px;
          top: -180px;
          border: 60px solid rgba(255, 184, 142, 0.14);
        }
        .manual-dots {
          position: absolute;
          width: 130px;
          height: 100px;
          opacity: 0.35;
          background-image: radial-gradient(#ffb386 2px, transparent 2px);
          background-size: 14px 14px;
        }
        .manual-dots-left { left: 8%; top: 5px; }
        .manual-dots-right { right: 3%; top: 80px; }

        /* table section */
        .manual-table-section {
          position: relative;
          z-index: 4;
          width: 100%;
          padding: 0 3.5% 55px;
        }
        .manual-table-card {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 16px 18px 16px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #f0e7e0;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(64, 43, 25, 0.08);
        }

        .manual-table-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          border: 1px solid #e5e9ef;
          border-radius: 12px;
        }
        .manual-table {
          width: 100%;
          min-width: 920px;
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
        }
        .manual-col-sno { width: 7%; }
        .manual-col-name { width: 27%; }
        .manual-col-description { width: 49%; }
        .manual-col-action { width: 17%; }

        .manual-table thead, .manual-table thead tr {
          background: linear-gradient(90deg, #ff7900 0%, #ff6200 100%) !important;
        }
        .manual-table thead th {
          height: 46px;
          padding: 0 28px;
          background: #ff6900 !important;
          color: #ffffff !important;
          border: none !important;
          border-right: 1px solid rgba(255, 255, 255, 0.45) !important;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 800;
          text-align: left;
          text-transform: uppercase;
          vertical-align: middle;
          white-space: nowrap;
        }
        .manual-table thead th:first-child {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        .manual-table thead th:last-child {
          border-right: none !important;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .manual-sno-heading, .manual-action-heading { text-align: center !important; }

        .manual-table tbody tr { transition: 0.2s ease; }
        .manual-table tbody tr:nth-child(odd) { background: #ffffff; }
        .manual-table tbody tr:nth-child(even) { background: #fff8f3; }
        .manual-table tbody tr:hover { background: #fff0e5; }
        .manual-table tbody td {
          padding: 11px 28px;
          background: inherit;
          border-right: 1px solid #e7ebef;
          border-bottom: 1px solid #e7ebef;
          vertical-align: middle;
        }
        .manual-table tbody td:last-child { border-right: none; }
        .manual-table tbody tr:last-child td { border-bottom: none; }

        .manual-sno-cell { text-align: center; }
        .manual-sno {
          width: 46px;
          height: 36px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: linear-gradient(135deg, #fff8f2, #ffebdd);
          border: 1px solid #fae5d6;
          color: #06275c;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 900;
        }

        .manual-document-name {
          color: #06275c;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 900;
          line-height: 1.4;
        }

        .manual-description-cell {
          color: #344c78;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.45;
        }

        .manual-action-cell { text-align: center; }
        .manual-download-btn {
          min-width: 160px;
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 16px;
          border: 1px solid #06275c;
          border-radius: 9px;
          background: linear-gradient(135deg, #082e65, #031d45);
          color: #ffffff;
          text-decoration: none;
          font-size: calc(12px * var(--font-scale, 1));
          font-weight: 800;
          white-space: nowrap;
          transition: 0.25s ease;
        }
        .manual-download-btn:hover {
          color: #06275c;
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 39, 92, 0.15);
        }

        .manual-total {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 25px 0;
          color: #06275c;
        }
        .manual-total svg { color: #ff5b0b; font-size: 22px; }
        .manual-total strong {
          color: #ff5b0b;
          font-size: calc(15px * var(--font-scale, 1));
          font-weight: 900;
        }
        .manual-total span {
          color: #06275c;
          font-size: calc(13px * var(--font-scale, 1));
          font-weight: 800;
        }

        .manual-mobile-list { display: none; }

        .manual-footer {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .manual-content-wrapper { max-width: 1300px; }
          .manual-main-title { font-size: calc(56px * var(--font-scale, 1)); }
          .manual-intro-card p { font-size: calc(19px * var(--font-scale, 1)); }
          .manual-table-card { max-width: 1550px; }
          .manual-table tbody td {
            padding-top: 13px;
            padding-bottom: 13px;
          }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .manual-content-wrapper { width: 88%; }
          .manual-main-title { font-size: calc(46px * var(--font-scale, 1)); }
          .manual-intro-card {
            grid-template-columns: 6px 70px 1fr;
            gap: 22px;
          }
          .manual-book-icon {
            width: 66px;
            height: 66px;
            font-size: 27px;
          }
          .manual-intro-card p { font-size: calc(16px * var(--font-scale, 1)); }
          .manual-table thead th, .manual-table tbody td {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .manual-content-wrapper { width: 90%; }
          .manual-main-title { font-size: calc(40px * var(--font-scale, 1)); }
          .manual-table-section {
            padding-left: 2%;
            padding-right: 2%;
          }
          .manual-document-name { font-size: calc(13px * var(--font-scale, 1)); }
          .manual-description-cell { font-size: calc(11.5px * var(--font-scale, 1)); }
          .manual-download-btn {
            min-width: 140px;
            font-size: calc(11px * var(--font-scale, 1));
          }
        }

        /* 900px */
        @media (max-width: 900px) {
          .manual-content-wrapper { width: calc(100% - 40px); }
          .manual-main-title { font-size: calc(37px * var(--font-scale, 1)); }
          .manual-intro-card {
            grid-template-columns: 6px 62px 1fr;
            gap: 18px;
            padding: 14px 20px;
          }
          .manual-book-icon {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }
          .manual-intro-card p { font-size: calc(14px * var(--font-scale, 1)); }
          .manual-table-section { padding: 0 16px 45px; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .manual-heading-section { padding: 24px 0 16px; }
          .manual-content-wrapper { width: calc(100% - 22px); }
          .manual-main-title {
            margin-bottom: 16px;
            font-size: calc(31px * var(--font-scale, 1));
          }
          .manual-intro-card {
            grid-template-columns: 5px 52px 1fr;
            gap: 12px;
            padding: 13px 12px;
          }
          .manual-intro-line {
            width: 5px;
            height: 58px;
          }
          .manual-book-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
          .manual-intro-card p {
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .manual-table-section { padding: 0 10px 35px; }
          .manual-table-card {
            padding: 12px 10px;
            border-radius: 15px;
          }
          /* desktop table off, mobile cards on */
          .manual-table-wrapper { display: none; }
          .manual-mobile-list {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .manual-mobile-card {
            padding: 16px;
            background: #ffffff;
            border: 1px solid #e8edf3;
            border-radius: 13px;
            box-shadow: 0 5px 15px rgba(30, 46, 68, 0.06);
          }
          .manual-mobile-top {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 10px;
          }
          .manual-mobile-number {
            width: 35px;
            height: 35px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #fff0e5;
            color: #06275c;
            font-weight: 900;
          }
          .manual-mobile-title {
            display: flex;
            align-items: center;
            gap: 9px;
          }
          .manual-mobile-title svg { flex-shrink: 0; color: #ff5b0b; }
          .manual-mobile-title h3 {
            margin: 0;
            color: #06275c;
            font-size: calc(14px * var(--font-scale, 1));
            font-weight: 900;
            line-height: 1.35;
          }
          .manual-mobile-card p {
            margin: 0 0 14px;
            color: #536987;
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .manual-mobile-download { width: 100%; min-width: 0; }
          .manual-total {
            justify-content: center;
            padding-left: 0;
            padding-right: 0;
          }
        }

        /* 400px */
        @media (max-width: 400px) {
          .manual-main-title { font-size: calc(27px * var(--font-scale, 1)); }
          .manual-intro-card {
            grid-template-columns: 4px 44px 1fr;
            gap: 9px;
            padding: 11px 9px;
          }
          .manual-intro-line {
            width: 4px;
            height: 54px;
          }
          .manual-book-icon {
            width: 43px;
            height: 43px;
            font-size: 18px;
          }
          .manual-intro-card p { font-size: calc(10.5px * var(--font-scale, 1)); }
          .manual-table-section {
            padding-left: 7px;
            padding-right: 7px;
          }
          .manual-mobile-card { padding: 14px 12px; }
          .manual-mobile-title h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .manual-mobile-card p { font-size: calc(11px * var(--font-scale, 1)); }
          .manual-total span { font-size: calc(11px * var(--font-scale, 1)); }
        }
      `}</style>
    </div>
  );
}
