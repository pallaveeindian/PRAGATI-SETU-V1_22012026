import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import up_logo from "../assets/upgov_logo.jpg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import { LanguageContext } from "./LanguageContext";

// Importing the PDF files
import DRPMFFIThematicTOTTrainingSchedule from "../assets/DownloadUpdates/DRP-MFFI Thematic TOT Training Schedule.pdf";
import CommunityCadresResidentialTrainingTargetsFY202627 from "../assets/DownloadUpdates/Community Cadres Residential Training Targets (FY 2026-27).pdf";
import ResidualResidentialNonResidentialTrainingTargetsFY202627 from "../assets/DownloadUpdates/Residual Residential & Non-Residential Training Targets (FY 2026-27).pdf";

export default function DownloadUpdates() {
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
      title1: "Downloads &",
      title2: " Latest Updates",
      intro:
        "Welcome to the Pragati Setu Updates section. Access official government letters, training schedules, circulars, and notifications issued by UPSRLM.",
      tableHeaders: [
        "S.No",
        "Update Title",
        "Description & Category",
        "Date of Issue",
        "Action",
      ],
      updates: [
        {
          id: 1,
          name: "DRP-MFFI Thematic TOT Training Schedule",
         
          desc: "Official letter regarding the 5-day residential Training of Trainers (TOT) for District Resource Persons (DRP) under Micro Finance & Financial Inclusion (MFFI) theme scheduled from 13.07.2026 to 17.07.2026 at SIRD, Bakshi Ka Talab, Lucknow.",
          date: "03.07.2026",
          file: DRPMFFIThematicTOTTrainingSchedule,
        },
        {
          id: 2,
          name: "Community Cadres Residential Training Targets (FY 2026-27)",
          
          desc: "Official order regarding district-wise and theme-wise residential training targets for various community cadres under UPSRLM for the financial year 2026-27 to be conducted via SIRD and TMS Portal.",
          date: "04.06.2026",
          file: CommunityCadresResidentialTrainingTargetsFY202627,
        },
        {
          id: 3,
          name: "Residual Residential & Non-Residential Training Targets (FY 2026-27)",
          
          desc: "Official order regarding residual residential and non-residential training targets for community cadres (such as SHG BK M1/M2, VO EC members, Gender, and SISD components) under UPSRLM for FY 2026-27.",
          date: "20.08.2026",
          file: ResidualResidentialNonResidentialTrainingTargetsFY202627,
        },
      ],
      download: "Download PDF",
    },
    hi: {
      title1: "डाउनलोड और",
      title2: " नवीनतम अपडेट",
      intro:
        "प्रगति सेतु अपडेट अनुभाग में आपका स्वागत है। UPSRLM द्वारा जारी आधिकारिक पत्र, प्रशिक्षण कार्यक्रम, परिपत्र और सूचनाएं यहाँ प्राप्त करें।",
      tableHeaders: [
        "क्र.सं.",
        "अपडेट शीर्षक",
        "विवरण और श्रेणी",
        "जारी करने की तिथि",
        "कार्रवाई",
      ],
      updates: [
        {
          id: 1,
          name: "DRP-MFFI थीमैटिक TOT प्रशिक्षण कार्यक्रम",
         
          desc: "सूक्ष्म वित्त एवं वित्तीय समावेशन (MFFI) थीम के अंतर्गत डिस्ट्रिक्ट रिसोर्स पर्सन (DRP) हेतु दिनांक 13.07.2026 से 17.07.2026 तक दीनदयाल उपाध्याय राज्य ग्राम्य विकास प्रशिक्षण संस्थान (SIRD), बख्शी का तालाब, लखनऊ में आयोजित होने वाले 5 दिवसीय आवासीय प्रशिक्षण के संबंध में आधिकारिक पत्र।",
          date: "03.07.2026",
          file: DRPMFFIThematicTOTTrainingSchedule,
        },
        {
          id: 2,
          name: "सामुदायिक काडरों के आवासीय प्रशिक्षण लक्ष्य (वित्तीय वर्ष 2026-27)",
         
          desc: "वित्तीय वर्ष 2026-27 हेतु उत्तर प्रदेश राज्य ग्रामीण आजीविका मिशन के अंतर्गत विभिन्न सामुदायिक काडरों के लिए SIRD और TMS पोर्टल के माध्यम से आयोजित होने वाले आवासीय प्रशिक्षण लक्ष्यों से संबंधित आधिकारिक आदेश।",
          date: "04.06.2026",
          file: CommunityCadresResidentialTrainingTargetsFY202627,
        },
        {
          id: 3,
          name: "अवशेष आवासीय एवं गैर-आवासीय प्रशिक्षण लक्ष्य (वित्तीय वर्ष 2026-27)",
         
          desc: "वित्तीय वर्ष 2026-27 हेतु UPSRLM के अंतर्गत विभिन्न सामुदायिक काडरों (जैसे SHG BK M1/M2, VO EC सदस्य, जेंडर, और SISD घटक) के अवशेष आवासीय एवं गैर-आवासीय प्रशिक्षण लक्ष्यों से संबंधित आधिकारिक आदेश।",
          date: "20.08.2026",
          file: ResidualResidentialNonResidentialTrainingTargetsFY202627,
        },
      ],
      download: "PDF डाउनलोड करें",
    },
  };

  const t = content[lang];

  /* ================= SORTING LOGIC (LATEST DATE FIRST) ================= */
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const sortedUpdates = [...t.updates].sort((a, b) => {
    return parseDate(b.date) - parseDate(a.date);
  });

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
          <div className="about-intro-grid-single">
            <div className="about-left-full">
              <h1>
                <span className="contrast-color-two">{t.title1}</span>
                <span className="contrast-color-one">{t.title2}</span>
              </h1>
              <p className="intro-text">{t.intro}</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-wrapper">
            <table className="manual-table">
              <thead>
                <tr>
                  <th width="7%">{t.tableHeaders[0]}</th>
                  <th width="26%">{t.tableHeaders[1]}</th>
                  <th width="40%">{t.tableHeaders[2]}</th>
                  <th width="12%" style={{ textAlign: "center" }}>
                    {t.tableHeaders[3]}
                  </th>
                  <th width="15%" style={{ textAlign: "center" }}>
                    {t.tableHeaders[4]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUpdates.map((item, index) => (
                  <tr key={item.id}>
                    <td className="center-cell">
                      <strong>{index + 1}</strong>
                    </td>
                    <td className="doc-name">
                      {item.name}
                      <span className="badge-category">{item.category}</span>
                    </td>
                    <td className="doc-desc">{item.desc}</td>
                    <td className="center-cell date-cell">
                      <span>{item.date}</span>
                    </td>
                    <td className="center-cell">
                      <a
                        href={item.file}
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

        .about-intro-grid-single {
          display: block;
          margin-bottom: 50px;
        }

        .about-left-full h1 {
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
          min-width: 900px;
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

        .date-cell span {
          display: inline-block;
          font-weight: 600;
          color: #334155;
          background: #f8fafc;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          white-space: nowrap;
        }

        .doc-name {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
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
        @media (max-width: 768px) {
          .about-left-full h1 {
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