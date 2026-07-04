import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import up_logo from "../assets/upgov_logo.jpg";
import aboutImg from "../assets/User-manual.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext";

// Importing PDF files
import TRCreationGuide from "../assets/UserManuals/TRCreationGuide.pdf";
import CRPEPMappingFormGuide from "../assets/UserManuals/CRPEPMappingFormGuide.pdf";
import MOUGuide from "../assets/UserManuals/MOUGuide.pdf";

export default function UserManual() {
  const { lang } = useContext(LanguageContext);

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= CONTENT ================= */
  const content = {
    en: {
      title1: "User",
      title2: " Manuals & Guides",
      intro:
        "Welcome to the Pragati Setu User Manuals section. Below you will find comprehensive guides to assist you in navigating and operating various portals and modules effectively.",
      tableHeaders: ["S.No", "Document Name", "Description", "Action"],
      manuals: [
        {
          id: 1,
          name: "Training Request Creation",
          desc: "Cadre Selection Process and Training Request creation guidelines on the TMS Portal.",
          file: TRCreationGuide,
        },
        {
          id: 2,
          name: "CRP-EP Account & Mapping",
          desc: "CRP-EP Account creation and panchayat mapping process for Udhyam Sakhi App login on the CRP-EP Mapping portal.",
          file: CRPEPMappingFormGuide,
        },
        {
          id: 3,
          name: "SHG-MOU Registration",
          desc: "Complete step-by-step SHG-MOU Registration process on the Enterprise MOU portal.",
          file: MOUGuide,
        },
      ],
      download: "Download PDF",
    },
    hi: {
      title1: "उपयोगकर्ता",
      title2: " मैनुअल और गाइड",
      intro:
        "प्रगति सेतु उपयोगकर्ता मैनुअल अनुभाग में आपका स्वागत है। नीचे आपको विभिन्न पोर्टल्स और मॉड्यूल को प्रभावी ढंग से संचालित करने में सहायता के लिए विस्तृत मार्गदर्शिकाएँ मिलेंगी।",
      tableHeaders: ["क्र.सं.", "दस्तावेज़ का नाम", "विवरण", "कार्रवाई"],
      manuals: [
        {
          id: 1,
          name: "प्रशिक्षण अनुरोध निर्माण",
          desc: "TMS पोर्टल पर कैडर चयन प्रक्रिया और प्रशिक्षण अनुरोध निर्माण के दिशा-निर्देश।",
          file: TRCreationGuide,
        },
        {
          id: 2,
          name: "CRP-EP खाता और मैपिंग",
          desc: "CRP-EP मैपिंग पोर्टल पर उद्यम सखी ऐप लॉगिन के लिए CRP-EP खाता निर्माण और पंचायत मैपिंग प्रक्रिया।",
          file: CRPEPMappingFormGuide,
        },
        {
          id: 3,
          name: "SHG-MOU पंजीकरण",
          desc: "एंटरप्राइज MOU पोर्टल पर संपूर्ण चरण-दर-चरण SHG-MOU पंजीकरण प्रक्रिया।",
          file: MOUGuide,
        },
      ],
      download: "PDF डाउनलोड करें",
    },
  };

  const t = content[lang];

  return (
    <div className="home-shell">
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      <main className="home-hero">
        <div className="about-section">
          {/* Top Intro Section */}
          <div className="about-intro-grid">
            <div className="about-left">
              <h1>
                <span className="contrast-color-two">{t.title1}</span>
                <span className="contrast-color-one">{t.title2}</span>
              </h1>
              <p className="intro-text">{t.intro}</p>
            </div>
            <div className="about-right">
              <img src={aboutImg} alt="Pragati Setu Diagram" />
            </div>
          </div>

          {/* Table Section */}
          <div className="table-wrapper">
            <table className="manual-table">
              <thead>
                <tr>
                  <th width="8%">{t.tableHeaders[0]}</th>
                  <th width="25%">{t.tableHeaders[1]}</th>
                  <th width="52%">{t.tableHeaders[2]}</th>
                  <th width="15%" style={{ textAlign: "center" }}>
                    {t.tableHeaders[3]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.manuals.map((manual) => (
                  <tr key={manual.id}>
                    <td className="center-cell">
                      <strong>{manual.id}</strong>
                    </td>
                    <td className="doc-name">{manual.name}</td>
                    <td className="doc-desc">{manual.desc}</td>
                    <td className="center-cell">
                      <a
                        href={manual.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-btn"
                        download
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginRight: "6px" }}
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        {t.download}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
        /* ===== Root shell ===== */
        .home-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(180deg,
            #ffffff 0%,
            #fff6f8 35%,
            #f9e3e6 60%,
            #f4cfd6 75%,
            #ebb8c4 100%);
        }

        /* ================= GLOBAL FONT SCALING ================= */
        :root {
          --font-scale: 1;
        }

        body {
          font-size: calc(16px * var(--font-scale));
        }

        /* ===== HERO ===== */
        .home-hero {
          width: 100%;
          overflow-x: visible;
        }

        /* ===== ABOUT LAYOUT ===== */
        .about-section {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .about-intro-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 50px;
        }

        .about-left h1 {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 18px;
          color: #0f172a;
        }

        .intro-text {
          font-size: 18px;
          line-height: 1.8;
          color: #334155;
          background: #ffffff;
          padding: 24px;
          border-left: 5px solid #ff7a00;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .contrast-color-one {
          color: #ff7a00;
        }

        .contrast-color-two {
          color: #0f172a;
        }

        .about-right img {
          width: 100%;
          max-width: 500px;
          height: auto;
          object-fit: contain;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        /* ===== TABLE STYLES ===== */
        .table-wrapper {
          background: #ffffff;
          border-radius: 12px;
          padding: 1px;
          box-shadow: 0 10px 30px rgba(255, 122, 0, 0.15);
          overflow-x: auto;
          margin-bottom: 40px;
          border: 1px solid rgba(255, 122, 0, 0.3);
        }

        .manual-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .manual-table th {
          background: linear-gradient(90deg, #ff7a00, #e86b00);
          color: #ffffff;
          font-size: 17px;
          font-weight: 700;
          padding: 18px;
          text-align: left;
        }
        
        .manual-table th:first-child {
          border-top-left-radius: 11px;
        }
        
        .manual-table th:last-child {
          border-top-right-radius: 11px;
        }

        .manual-table td {
          padding: 20px 18px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: middle;
        }

        .manual-table tr:last-child td {
          border-bottom: none;
        }

        .manual-table tr:hover {
          background-color: #fffaf6;
        }

        .center-cell {
          text-align: center;
        }

        .doc-name {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .doc-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
        }

        /* ===== DOWNLOAD BUTTON ===== */
        .download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          color: #ffffff;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          white-space: nowrap;
        }

        .download-btn:hover {
          background: #ffffff;
          color: #ff7a00;
          border-color: #ff7a00;
          box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);
          transform: translateY(-2px);
        }

        /* ===== FOOTER ===== */
        .home-footer {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          margin-top: auto;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 992px) {
          .about-intro-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .intro-text {
            border-left: none;
            border-top: 5px solid #ff7a00;
            text-align: left;
          }

          .about-right {
            display: flex;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .about-left h1 {
            font-size: 32px;
          }
          
          .manual-table th, .manual-table td {
            padding: 15px 12px;
          }
        }
      `}</style>
    </div>
  );
}
