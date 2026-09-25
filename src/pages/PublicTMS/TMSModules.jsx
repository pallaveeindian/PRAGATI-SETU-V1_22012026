// src/pages/PublicTMS/TMSModules.jsx

import React, { useContext } from "react";
import { FaRegFileAlt, FaUsers, FaRegCalendarCheck, FaArrowRight } from "react-icons/fa";
import { LanguageContext } from "../LanguageContext.jsx";

// change only image names if your file names are different
import trainingRequestImg from "../../assets/TMS/training_request.png";
import batchCreationImg from "../../assets/TMS/batch_creation.png";
import attendanceImg from "../../assets/TMS/attendance.png";

const content = {
  en: {
    heading: "Core TMS Modules",
    viewAll: "View All Modules",
    modules: [
      { id: 1, title: "Training Request Creation", description: "Create and manage training requests based on identified needs, with approvals and tracking at multiple levels.", icon: <FaRegFileAlt />, image: trainingRequestImg },
      { id: 2, title: "Batch Creation", description: "Create and manage training batches with trainer allocation, venue details and beneficiary enrollment.", icon: <FaUsers />, image: batchCreationImg },
      { id: 3, title: "Attendance", description: "Track daily attendance using biometric eKYC, with real-time monitoring and validation.", icon: <FaRegCalendarCheck />, image: attendanceImg },
    ],
  },
  hi: {
    heading: "मुख्य टीएमएस मॉड्यूल",
    viewAll: "सभी मॉड्यूल देखें",
    modules: [
      { id: 1, title: "प्रशिक्षण अनुरोध निर्माण", description: "पहचानी गई आवश्यकताओं के आधार पर प्रशिक्षण अनुरोध बनाएँ और प्रबंधित करें तथा विभिन्न स्तरों पर अनुमोदन और ट्रैकिंग सुनिश्चित करें।", icon: <FaRegFileAlt />, image: trainingRequestImg },
      { id: 2, title: "प्रशिक्षण बैच निर्माण", description: "प्रशिक्षक आवंटन, प्रशिक्षण स्थल विवरण और लाभार्थी नामांकन के साथ प्रशिक्षण बैच बनाएँ और प्रबंधित करें।", icon: <FaUsers />, image: batchCreationImg },
      { id: 3, title: "उपस्थिति", description: "बायोमेट्रिक eKYC के माध्यम से दैनिक उपस्थिति दर्ज करें तथा रियल-टाइम निगरानी और सत्यापन करें।", icon: <FaRegCalendarCheck />, image: attendanceImg },
    ],
  },
};

export default function TMSModules() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section className="tms-modules">
      <div className="tms-modules-container">
        <div className="tms-modules-header">
          <div className="tms-modules-title">
            <span className="modules-title-line"></span>
            <h2>{t.heading}</h2>
          </div>

          <button className="modules-view-btn">
            {t.viewAll}
            <FaArrowRight />
          </button>
        </div>

        <div className="tms-modules-grid">
          {t.modules.map((module) => (
            <div className="tms-module-card" key={module.id}>
              <div className="tms-module-content">
                <div className="tms-module-icon">{module.icon}</div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>

              <div className="tms-module-image">
                <img src={module.image} alt={module.title} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* MODULE SECTION */
        .tms-modules {
          width: 100%;
          padding: 18px 0 24px;
          background: #ffffff;
        }
        .tms-modules-container {
          width: 92%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADER */
        .tms-modules-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 14px;
        }
        .tms-modules-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modules-title-line {
          width: 22px;
          height: 3px;
          background: #f15a24;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .tms-modules-title h2 {
          margin: 0;
          color: #08275c;
          font-size: calc(20px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.2;
        }

        /* VIEW BUTTON */
        .modules-view-btn {
          min-height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 17px;
          border: 1.5px solid #ff6b21;
          border-radius: 20px;
          background: #ffffff;
          color: #f25b17;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }
        .modules-view-btn svg { font-size: 10px; }
        .modules-view-btn:hover {
          background: #f25b17;
          color: #ffffff;
        }

        /* GRID */
        .tms-modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }

        /* MODULE CARD */
        .tms-module-card {
          position: relative;
          min-height: 150px;
          display: flex;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .tms-module-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.09);
        }

        /* LEFT CONTENT */
        .tms-module-content {
          position: relative;
          z-index: 4;
          width: 62%;
          padding: 15px 10px 14px 20px;
          background: #ffffff;
        }
        .tms-module-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          border-radius: 50%;
          background: #fff0e7;
          color: #ff661f;
          font-size: 20px;
        }
        .tms-module-content h3 {
          margin: 0 0 6px;
          color: #062a67;
          font-size: calc(14px * var(--font-scale, 1));
          font-weight: 800;
          line-height: 1.25;
        }
        .tms-module-content p {
          max-width: 250px;
          margin: 0;
          color: #334155;
          font-size: calc(11px * var(--font-scale, 1));
          font-weight: 500;
          line-height: 1.4;
        }

        /* RIGHT IMAGE */
        .tms-module-image {
          position: absolute;
          top: 0;
          right: 0;
          width: 43%;
          height: 100%;
          overflow: hidden;
        }
        .tms-module-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }
        /* white curved shape like reference */
        .tms-module-image::before {
          content: "";
          position: absolute;
          z-index: 2;
          top: -15%;
          left: -45px;
          width: 85px;
          height: 130%;
          background: #ffffff;
          border-radius: 0 100% 100% 0;
          pointer-events: none;
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .tms-module-card { min-height: 155px; }
          .tms-module-content { padding: 17px 12px 15px 22px; }
          .tms-module-content h3 { font-size: calc(14px * var(--font-scale, 1)); }
          .tms-module-content p { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .tms-modules-container { width: 94%; }
          .tms-modules-grid { gap: 13px; }
          .tms-module-card { min-height: 145px; }
          .tms-module-content {
            width: 64%;
            padding: 14px 8px 13px 16px;
          }
          .tms-module-image { width: 42%; }
          .tms-module-icon {
            width: 37px;
            height: 37px;
            font-size: 18px;
          }
          .tms-module-content h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .tms-module-content p { font-size: calc(10.5px * var(--font-scale, 1)); }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .tms-modules-grid { grid-template-columns: repeat(2, 1fr); }
          .tms-module-card:last-child { grid-column: 1 / -1; }
          .tms-module-card:last-child .tms-module-content { width: 55%; }
          .tms-module-card:last-child .tms-module-image { width: 48%; }
        }

        /* 900px */
        @media (max-width: 900px) {
          .tms-modules { padding: 20px 0 24px; }
          .tms-modules-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .tms-module-card:last-child { grid-column: auto; }
          .tms-module-card { min-height: 155px; }
          .tms-module-content, .tms-module-card:last-child .tms-module-content { width: 58%; }
          .tms-module-image, .tms-module-card:last-child .tms-module-image { width: 46%; }
        }

        /* 600px */
        @media (max-width: 600px) {
          .tms-modules-container { width: calc(100% - 30px); }
          .tms-modules-header { align-items: flex-start; }
          .tms-modules-title { gap: 9px; }
          .modules-title-line { width: 18px; }
          .tms-modules-title h2 { font-size: calc(17px * var(--font-scale, 1)); }
          .modules-view-btn {
            min-height: 30px;
            padding: 0 12px;
            font-size: 9px;
          }
          .tms-module-card { min-height: 145px; }
          .tms-module-content, .tms-module-card:last-child .tms-module-content {
            width: 62%;
            padding: 13px 7px 12px 13px;
          }
          .tms-module-image, .tms-module-card:last-child .tms-module-image { width: 42%; }
          .tms-module-image::before {
            left: -35px;
            width: 65px;
          }
          .tms-module-icon {
            width: 34px;
            height: 34px;
            font-size: 16px;
            margin-bottom: 6px;
          }
          .tms-module-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .tms-module-content p {
            font-size: calc(10px * var(--font-scale, 1));
            line-height: 1.35;
          }
        }

        /* 400px */
        @media (max-width: 400px) {
          .tms-modules-container { width: calc(100% - 24px); }
          .tms-modules-header {
            flex-direction: column;
            gap: 10px;
          }
          .modules-view-btn { align-self: flex-end; }
          .tms-module-card {
            min-height: 210px;
            flex-direction: column;
          }
          .tms-module-content, .tms-module-card:last-child .tms-module-content {
            width: 100%;
            padding: 13px 13px 10px;
          }
          .tms-module-image, .tms-module-card:last-child .tms-module-image {
            position: relative;
            width: 100%;
            height: 95px;
          }
          .tms-module-image::before { display: none; }
          .tms-module-content p { max-width: 100%; }
        }
      `}</style>
    </section>
  );
}
