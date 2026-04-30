import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import aboutImg from "../../assets/Hero/About/ps_diag.png";
import aboutMobImg from "../../assets/ps-diag_mob_screen.png";

// 👇 import your Language Context (same one used in header)
import { LanguageContext } from "../LanguageContext.jsx";

export default function Info() {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  
  const content = {
    en: {
      title: "Purpose of Pragati Setu",
      subtitle: "Bridging Progress and Prosperity",
      p1: `Pragati Setu is a comprehensive digital platform developed to strengthen and streamline the management of Self-Help Group (SHG)–related activities across Uttar Pradesh. The platform acts as a digital bridge between rural women, Self Help Groups and government systems, enabling transparent, data-driven, and efficient governance.`,
      p2: `Designed to support the vision of sustainable livelihoods and women-led development, Pragati Setu enables systematic recording and monitoring of beneficiary profiles, SHG enterprises, financial inclusion activities, and progress indicators at the grassroots level. By replacing fragmented and paper-based processes with a unified digital system, the platform ensures accuracy, accountability, and timely decision-making.`,
      p3: `Through Pragati Setu, government departments gain a consolidated view of SHG performance and enterprise growth, enabling targeted interventions, effective resource allocation, and improved policy implementation. The platform empowers rural women by connecting their collective efforts to institutional support mechanisms, thereby fostering inclusive growth, economic self-reliance, and long-term prosperity.`,
      btn: "Know More",
    },

    hi: {
      title: "प्रगति सेतु का उद्देश्य",
      subtitle: "प्रगति और समृद्धि के बीच सेतु",
      p1: `प्रगति सेतु एक व्यापक डिजिटल प्लेटफ़ॉर्म है, जिसे उत्तर प्रदेश में स्वयं सहायता समूह (SHG) से जुड़ी गतिविधियों के प्रबंधन को मजबूत और सुव्यवस्थित करने के लिए विकसित किया गया है। यह प्लेटफ़ॉर्म ग्रामीण महिलाओं, स्वयं सहायता समूहों और सरकारी तंत्र के बीच एक डिजिटल सेतु का कार्य करता है, जिससे पारदर्शी, डेटा-आधारित और प्रभावी प्रशासन संभव होता है।`,
      p2: `सतत आजीविका और महिला-नेतृत्व वाले विकास के उद्देश्य को समर्थन देने के लिए डिज़ाइन किया गया यह प्लेटफ़ॉर्म लाभार्थियों की प्रोफाइल, SHG उद्यम, वित्तीय समावेशन गतिविधियों और प्रगति संकेतकों की व्यवस्थित रिकॉर्डिंग और निगरानी को सक्षम बनाता है। यह कागज़ आधारित प्रक्रियाओं को डिजिटल प्रणाली से बदलकर सटीकता, जवाबदेही और समय पर निर्णय सुनिश्चित करता है।`,
      p3: `प्रगति सेतु के माध्यम से सरकारी विभागों को SHG प्रदर्शन और उद्यम विकास का एक समेकित दृष्टिकोण मिलता है, जिससे लक्षित हस्तक्षेप, संसाधनों का प्रभावी उपयोग और बेहतर नीति कार्यान्वयन संभव होता है। यह प्लेटफ़ॉर्म ग्रामीण महिलाओं को सशक्त बनाता है और उन्हें संस्थागत सहयोग से जोड़कर समावेशी विकास और आर्थिक आत्मनिर्भरता को बढ़ावा देता है।`,
      btn: "और जानें",
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="aboutus-wrapper">
      {/* LEFT */}
      <div className="aboutus-left">
        <h2 className="aboutus-title">
          {t.title} <br />
          <span>{t.subtitle}</span>
        </h2>

        <p className="aboutus-text">{t.p1}</p>
        <p className="aboutus-text">{t.p2}</p>
        <p className="aboutus-text">{t.p3}</p>

        <button className="aboutus-btn" onClick={() => navigate("/about-us")}>
          {t.btn}
        </button>
      </div>

      {/* RIGHT */}
      <div className="aboutus-right">
        <img
          src={aboutImg}
          alt="Pragati Setu Overview"
          className="desktop-img"
        />
        <img
          src={aboutMobImg}
          alt="Pragati Setu Overview Mobile"
          className="mobile-img"
        />
      </div>

      {/* STYLES SAME AS YOURS */}

      {/* ================= STYLES ================= */}
      <style>{`

/* ============================= */
/* DEFAULT DESKTOP (1400px+) */
/* ============================= */

.desktop-img {
  display: block;
  max-width: 800px;
  width: 100%;
  height: auto;
}
.mobile-img {
  display: none;
  width: 100%;
  height: auto;
}

.aboutus-wrapper {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}

/* LEFT */
.aboutus-title {
  font-size: 38px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  line-height: 1.2;
}

.aboutus-title span {
  color: #fd7301;
}

.aboutus-text {
  font-size: 16px;
  color: #334155;
  line-height: 1.7;
  margin-bottom: 18px;
  max-width: 560px;
}

.aboutus-btn {
  margin-top: 12px;
  background: #fd7301;
  color: #ffffff;
  border: none;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.aboutus-btn:hover {
  background: #e86500;
  box-shadow: 0 6px 18px rgba(253, 115, 1, 0.35);
}

/* RIGHT */
.aboutus-right {
  display: flex;
  justify-content: center;
}

.aboutus-right img {
  width: 100%;
  max-width: 800px;
  height: auto;
}


/* ============================= */
/* LARGE LAPTOP (1200px) */
/* ============================= */
@media (max-width: 1200px) {
  .aboutus-wrapper {
    gap: 32px;
  }

  .aboutus-title {
    font-size: 32px;
  }

  .aboutus-text {
    font-size: 15px;
  }
}


/* ============================= */
/* TABLET (1024px) */
/* ============================= */
@media (max-width: 1024px) {

  .aboutus-wrapper {
    grid-template-columns: 1fr 1fr; /* still side-by-side */
    gap: 30px;
  }

  .aboutus-title {
    font-size: 26px;
  }

  .aboutus-text {
    font-size: 14px;
  }

  /* IMPORTANT: keep left alignment on tablet */
  .aboutus-wrapper {
    text-align: left;
  }
}


/* ============================= */
/* SMALL TABLET (900px) */
/* ============================= */
@media (max-width: 900px) {

  /* Stack layout */
  .aboutus-wrapper {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .desktop-img {
    display: none;
  }

  .mobile-img {
    display: block;
    max-width: 450px;
    margin: 0 auto;
  }

  .aboutus-title {
    font-size: 27px;
  }

  .aboutus-text {
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
  }
}


/* ============================= */
/* MOBILE (600px) */
/* ============================= */
@media (max-width: 600px) {

  .aboutus-title {
    font-size: 20px;
  }

  .aboutus-text {
    font-size: 13px;
    padding: 0 10px;
  }

  .mobile-img {
    max-width: 350px;
  }

  .aboutus-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}


/* ============================= */
/* SMALL MOBILE (400px) */
/* ============================= */
@media (max-width: 400px) {

  .aboutus-title {
    font-size: 18px;
  }

  .aboutus-text {
    font-size: 12px;
  }

  .mobile-img {
    max-width: 300px;
  }
}

`}</style>
    </div>
  );
}
