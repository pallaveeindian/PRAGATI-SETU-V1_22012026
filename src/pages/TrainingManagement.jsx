// src/pages/TrainingMangement.jsx

import React, { useEffect, useContext } from "react";
import { LanguageContext } from "./LanguageContext.jsx";

import up_logo from "../assets/upgov_logo.jpg";
import aboutImg from "../assets/training-management.jpeg";

import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function TrainingManagement() {
  const { lang } = useContext(LanguageContext);

  /* ================= FONT SIZE ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  /* ================= CONTENT ================= */
  const content = {
    en: {
      title1: "Training",
      title2: " Management",

      p1: `The Training Management System (TMS) is a role-based Management Information System designed to manage the complete lifecycle of trainings under UPSRLM. It supports creation and approval of training plans, training requests and batches, beneficiary and trainer management, registration of training centers, biometric eKYC and daily attendance tracking, processing of training payments, and training closure with report and certificate generation.`,

      p2: `The system accommodates multiple roles, including BMMU, DMMU, SMMU, Training Partners, and Master Trainers, and integrates data from LokOS, SHG/Beneficiary databases, and state-level training frameworks. Roles and permissions are assigned based on responsibilities, ensuring controlled access and streamlined workflows.`,

      p3: `By centralizing training operations, this module enhances governance transparency, prevents unauthorized access, and ensures efficient digital operations across all administrative levels.`,
    },

    hi: {
      title1: "प्रशिक्षण",
      title2: " प्रबंधन",

      p1: `ट्रेनिंग मैनेजमेंट सिस्टम (TMS) एक भूमिका-आधारित मैनेजमेंट इन्फॉर्मेशन सिस्टम है, जिसे UPSRLM के अंतर्गत प्रशिक्षण के पूरे जीवनचक्र को प्रबंधित करने के लिए डिज़ाइन किया गया है। यह प्रशिक्षण योजनाओं के निर्माण और अनुमोदन, प्रशिक्षण अनुरोध और बैच, लाभार्थी एवं प्रशिक्षक प्रबंधन, प्रशिक्षण केंद्र पंजीकरण, बायोमेट्रिक eKYC, दैनिक उपस्थिति ट्रैकिंग, भुगतान प्रसंस्करण तथा प्रमाणपत्र और रिपोर्ट जनरेशन को सक्षम बनाता है।`,

      p2: `यह प्रणाली BMMU, DMMU, SMMU, प्रशिक्षण भागीदार और मास्टर ट्रेनर्स जैसी विभिन्न भूमिकाओं को समर्थन देती है। यह LokOS, SHG/लाभार्थी डेटा और राज्य स्तरीय प्रशिक्षण ढांचे के साथ एकीकृत होती है। प्रत्येक उपयोगकर्ता को उसकी जिम्मेदारियों के अनुसार भूमिका और अनुमतियां दी जाती हैं, जिससे नियंत्रित पहुंच और सुचारु कार्यप्रवाह सुनिश्चित होता है।`,

      p3: `प्रशिक्षण प्रक्रियाओं के केंद्रीकरण से यह मॉड्यूल शासन में पारदर्शिता बढ़ाता है, अनधिकृत पहुंच को रोकता है और सभी प्रशासनिक स्तरों पर कुशल डिजिटल संचालन सुनिश्चित करता है।`,
    },
  };

  const t = content[lang] || content.en;

  return (
    <div className="home-shell">
      {/* HEADER */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* CONTENT */}
      <main className="home-hero">
        <div className="about-section">
          <div className="about-left">
            <h1>
              <span className="contrast-color-two">{t.title1}</span>
              <span className="contrast-color-one">{t.title2}</span>
            </h1>

            <div className="pragati-card">
              <p>{t.p1}</p>
            </div>

            <div className="pragati-card">
              <p>{t.p2}</p>
            </div>

            <div className="pragati-card">
              <p>{t.p3}</p>
            </div>
          </div>

          {/* IMAGE */}
          <div className="about-right">
            <img src={aboutImg} alt="Training Management" />
          </div>
        </div>
      </main>
      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
                         /* ===== ABOUT LAYOUT ===== */
                   .about-section {
                     max-width: 1400px;
                     margin: 60px auto;
                     display: grid;
                     grid-template-columns: 1.1fr 0.9fr;
                     gap: 40px;
                     align-items: center;
                   }
                   
                   .about-left h1 {
                     font-size: 38px;
                     font-weight: 800;
                     margin-bottom: 18px;
                     color: #0f172a;
                   }
                   
                   .about-left p {
                     font-size: 17px;
                     line-height: 1.8;
                     color: #334155;
                     margin-bottom: 14px;
                   }
                   
                   /* IMAGE SIZE FIX */
                   .about-right {
                     display: flex;
                     justify-content: center;
                   }
                   
                   .about-right img {
                     width: 100%;
                     max-width: 780px;
                     height: auto;
                     object-fit: contain;
                     border-radius: 16px;
                   }

                   .pragati-card {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px 35px;
  background: #ffffff;
  border: 2px solid #ff7a00;          /* Orange Border */
  border-radius: 16px;
    box-shadow: 0 5px 5px rgba(255, 122, 0, 0.25);
  transition: all 0.3s ease;
}

.pragati-card p {
  font-size: 18px;
  line-height: 1.7;
  color: #333;
  margin: 0;
}

/* Hover Effect */
.pragati-card:hover {
  transform: translateY(-5px);
   box-shadow: 0 2px 5px rgba(255, 122, 0, 0.35);
}
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
                   
                           .hero-inner {
                             width: 100%;
                           }
                   
                           /* ===== FOOTER ===== */
                           .home-footer {
                             text-align: center;
                             font-size: 28px;
                             font-weight: 800;
                           }
                             @media (max-width: 768px) {

  .about-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 30px 20px;
  }

  .about-left {
    order: 1;
    text-align: center;
  }

  .about-right {
    order: 2;
  }

  .about-left h1 {
    font-size: 26px;
  }

  .about-left p {
    font-size: 15px;
  }

  .about-right img {
    max-width: 100%;
  }
      .pragati-card {
    margin: 20px;
    padding: 22px;
  }

  .pragati-card p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .pragati-card {
    padding: 18px;
    border-radius: 12px;
  }

  .pragati-card p {
    font-size: 15px;
  }

}

                         `}</style>
    </div>
  );
}
