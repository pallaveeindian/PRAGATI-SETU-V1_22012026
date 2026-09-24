import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../LanguageContext.jsx";

import bmsImg from "../../assets/Hero/Services/bms.png";
import tmsImg from "../../assets/Hero/Services/tms.png";
import esmImg from "../../assets/Hero/Services/esm.png";
import ldmsImg from "../../assets/Hero/Services/ldms.png";
import bmsVideo from "../../assets/Hero/Services/bms.mp4";
import tmsVideo from "../../assets/Hero/Services/tms.mp4";
import esmVideo from "../../assets/Hero/Services/esm.mp4";
import ldmsVideo from "../../assets/Hero/Services/ldms.mp4";
import bmsLogo from "../../assets/bms_logo.png";
import tmsLogo from "../../assets/tms_logo.png";
import esmLogo from "../../assets/ems_logo.png";
import ldmsLogo from "../../assets/ldms_logo.png";

const content = {
  en: {
    eyebrow: "OUR SERVICES",
    heading: "Digital Solutions for Inclusive Growth",
    subtitle:
      "Integrated systems to strengthen SHGs, enhance livelihoods and drive sustainable development across Uttar Pradesh.",
   services: [
  {
    title: "Beneficiary Management System",
    image: bmsImg,
    video: bmsVideo,
    logo: bmsLogo,
    path: "/beneficiary-profiling",
    short:
      "Record, manage and monitor SHG member profiles across districts, blocks and villages.",
    description:
      "A unified beneficiary management platform designed to capture, maintain and monitor SHG member information across Uttar Pradesh.",
    points: [
      "Centralized SHG beneficiary information",
      "District, block and village-level monitoring",
      "Improved accuracy and transparency",
    ],
  },

  {
    title: "Training Management System",
    image: tmsImg,
    video: tmsVideo,
    logo: tmsLogo,
    path: "/training-management",
    short:
      "Plan, execute and track trainings to build skills and enhance opportunities.",
    description:
      "A comprehensive platform for planning, monitoring and evaluating capacity-building initiatives for SHG members.",
    points: [
      "Training planning and scheduling",
      "Attendance and participation tracking",
      "Training outcome monitoring",
    ],
  },

  {
    title: "Enterprise Sakhi Management System",
    image: esmImg,
    video: esmVideo,
    logo: esmLogo,
    path: "/Enterprise-Tracking",
    short:
      "Monitor enterprises, market linkages, income growth and business development.",
    description:
      "A digital solution that supports enterprise mapping, women-led businesses and livelihood growth.",
    points: [
      "Enterprise and beneficiary mapping",
      "Market linkage monitoring",
      "Income and growth tracking",
    ],
  },

  {
    title: "Lakhpati Didi Management System",
    image: ldmsImg,
    video: ldmsVideo,
    logo: ldmsLogo,
    path: "/Lakhpati-Didi",
    short:
      "Track progress and support SHG women on their journey to becoming Lakhpati Didi.",
    description:
      "A progress-tracking platform designed to identify and support women on their journey towards sustainable higher household income.",
    points: [
      "Income progression monitoring",
      "Livelihood activity tracking",
      "Targeted handholding and support",
    ],
  },
],
  },
  hi: {
    eyebrow: "हमारी सेवाएं",
    heading: "समावेशी विकास के लिए डिजिटल समाधान",
    subtitle: "स्वयं सहायता समूहों को मजबूत करने और ग्रामीण आजीविका को बढ़ाने के लिए एकीकृत डिजिटल प्रणालियां।",
    services: [
  {
    title: "लाभार्थी प्रबंधन प्रणाली",
    image: bmsImg,
    video: bmsVideo,
    logo: bmsLogo,
    path: "/beneficiary-profiling",
    // other properties...
  },

  {
    title: "प्रशिक्षण प्रबंधन प्रणाली",
    image: tmsImg,
    video: tmsVideo,
    logo: tmsLogo,
    path: "/training-management",
    // other properties...
  },

  {
    title: "एंटरप्राइज सखी प्रबंधन प्रणाली",
    image: esmImg,
    video: esmVideo,
    logo: esmLogo,
    path: "/Enterprise-Tracking",
    // other properties...
  },

  {
    title: "लखपति दीदी प्रबंधन प्रणाली",
    image: ldmsImg,
    video: ldmsVideo,
    logo: ldmsLogo,
    path: "/Lakhpati-Didi",
    // other properties...
  },
],
  },
};

export default function HeroPSServices() {
  const { lang } = useContext(LanguageContext);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const t = content[lang] || content.en;

  return (
    <section className="ps-service-section">
      <div className="service-section-header">
        <div className="service-eyebrow"><span></span>{t.eyebrow}</div>
        <h2>{t.heading}</h2>
        <p>{t.subtitle}</p>
      </div>

      <div className="service-card-grid">
        {t.services.map((service, index) => (
          <article
            key={index}
            className={`modern-service-card ${selectedIndex === index ? "active" : ""}`}
            onMouseEnter={() => { setHoveredIndex(index); setSelectedIndex(index); }}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => { setSelectedIndex(index); setHoveredIndex(hoveredIndex === index ? null : index); }}
          >
            <div className="service-media">
              {hoveredIndex === index ? (
                <video src={service.video} autoPlay muted loop playsInline />
              ) : (
                <img src={service.image} alt={service.title} />
              )}
              <div className="service-dark-overlay"></div>
            </div>

            <div className="service-card-heading">
              <img src={service.logo} alt="" />
              <h3>{service.title}</h3>
            </div>

            <div className="service-card-bottom">
  <p>{service.short}</p>

  <button
    type="button"
    className="service-explore-btn"
    onClick={(e) => {
      e.stopPropagation();
      navigate(service.path);
    }}
  >
    Explore →
  </button>
</div>
          </article>
        ))}
      </div>

      <style>{`
        
        .ps-service-section { width: 100%; margin: 0 auto; padding: 20px 30px; box-sizing: border-box; background: #FEF3EB;}
        .service-section-header { margin-bottom: 35px; }
        .service-eyebrow { display: flex; align-items: center; gap: 8px; color: #f97316; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 8px; }
        .service-eyebrow span { width: 22px; height: 2px; background: #f97316; }
        .service-section-header h2 { margin: 0; color: #123d75; font-size: 36px; line-height: 1.2; font-weight: 800; }
        .service-section-header p { max-width: 900px; margin: 8px 0 0; color: #64748b; font-size: 14px; line-height: 1.6; }

        .service-card-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }

        .modern-service-card { position: relative; height: 460px; overflow: hidden; border-radius: 18px; background: #020617; cursor: pointer; transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .modern-service-card:hover { transform: translateY(-7px); box-shadow: 0 20px 45px rgba(15, 23, 42, 0.22); }
        .modern-service-card.active { outline: 2px solid #f97316; outline-offset: 3px; }

        .service-media { position: absolute; inset: 0; }
        .service-media img, .service-media video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .service-media video { animation: serviceVideoFade 0.5s ease; }
        @keyframes serviceVideoFade { from { opacity: 0; } to { opacity: 1; } }

        .service-dark-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.15) 45%, rgba(2,6,23,0.9) 100%); }

        .service-card-heading { position: relative; z-index: 5; padding: 24px 22px; display: flex; align-items: flex-start; gap: 11px; }
        .service-card-heading img { width: 45px; height: 45px; object-fit: contain; flex-shrink: 0; background: white; border-radius: 50%; padding: 4px; }
        .service-card-heading h3 { margin: 0; color: white; font-size: 21px; line-height: 1.2; font-weight: 700; }

        .service-card-bottom { position: absolute; z-index: 5; left: 22px; right: 22px; bottom: 23px; }
        .service-card-bottom p { color: rgba(255,255,255,0.85); font-size: 13px; line-height: 1.5; margin: 0 0 13px; }
        .service-explore-btn {
    padding: 0;
  border: none;
  background: transparent;

  color: #fb923c;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.service-explore-btn:hover {
  color: #f97316;
  transform: translateX(4px);
}

        @media (max-width: 1050px) {
          .service-card-grid { grid-template-columns: repeat(2, 1fr); }
          .modern-service-card { height: 420px; }
        }

        @media (max-width: 700px) {
          .ps-service-section { padding: 15px 14px; }
          .service-section-header h2 { font-size: 27px; }
          .service-card-grid { grid-template-columns: 1fr; gap: 20px; }
          .modern-service-card { height: 420px; }
          .service-detail-card { grid-template-columns: 1fr; }
          .service-detail-media { min-height: 340px; }
          .service-detail-content { padding: 30px 22px; }
          .service-detail-content > h3 { font-size: 24px; }
        }
      `}</style>
    </section>
  );
}
