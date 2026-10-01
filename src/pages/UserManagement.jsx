import { useEffect, useContext } from "react";
import { LanguageContext } from "./LanguageContext.jsx";
import up_logo from "../assets/upgov_logo.jpg";
import userManagementHero from "../assets/user_management_hero.png";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import Footer from "../components/layout/Footer.jsx";
import { FaShieldAlt, FaUsers, FaCog, FaCheckCircle } from "react-icons/fa";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";


// Hoisted outside to prevent re-creation on every render
const content = {
  en: {
    title1: "User", title2: "Management",
    description: "User Management is a critical module of Pragati Setu that enables secure creation, modification, and monitoring of system users across different administrative levels. It ensures that only authorized individuals can access specific modules and data.",
    features: [
      { color: "blue", icon: <FaShieldAlt />, title: "Secure Access", text: "Only authorized users" },
      { color: "orange", icon: <FaUsers />, title: "Role Based", text: "Manage roles & permissions" },
      { color: "green", icon: <FaCog />, title: "Better Governance", text: "Controlled and transparent operations" }
    ],
    howItWorks: "How It Works",
    cards: [
      { color: "orange", icon: <FaUsers />, title: "Multi-level Administration", desc: "The system is organized across multiple administrative units for effective governance.", points: ["Block Monitoring and Management Unit (BMMU) manages users at the block level.", "Sub-District Monitoring and Management Unit (SMMU) coordinates users at the sub-district level.", "District Monitoring and Management Unit (DMMU) manages district-wide operations."] },
      { color: "blue", icon: <FaShieldAlt />, title: "Role & Permission Management", desc: "Each user is assigned specific roles and permissions based on their responsibilities, enabling controlled access and streamlined workflow.", points: ["Define user roles such as Admin, Department, Block and District.", "Assign module-wise permissions.", "Ensure users access only relevant data.", "Maintain accountability and transparency."] },
      { color: "green", icon: <FaCog />, title: "Governance & Transparency", desc: "This module strengthens governance transparency, prevents unauthorized access, and ensures efficient digital operations across all departments.", points: ["Monitor user activity and access.", "Ensure adherence to standardized procedures.", "Support audit trails and tracking.", "Enhance data security and system integrity."] }
    ]
  },
  hi: {
    title1: "उपयोगकर्ता", title2: "प्रबंधन",
    description: "यूज़र मैनेजमेंट प्रगति सेतु का एक महत्वपूर्ण मॉड्यूल है, जो विभिन्न प्रशासनिक स्तरों पर सिस्टम उपयोगकर्ताओं के सुरक्षित निर्माण, संशोधन और निगरानी को सक्षम बनाता है। यह सुनिश्चित करता है कि केवल अधिकृत व्यक्ति ही संबंधित मॉड्यूल और डेटा तक पहुँच सकें।",
    features: [
      { color: "blue", icon: <FaShieldAlt />, title: "सुरक्षित पहुँच", text: "केवल अधिकृत उपयोगकर्ताओं के लिए" },
      { color: "orange", icon: <FaUsers />, title: "भूमिका आधारित", text: "भूमिकाओं और अनुमतियों का प्रबंधन" },
      { color: "green", icon: <FaCog />, title: "बेहतर प्रशासन", text: "नियंत्रित और पारदर्शी संचालन" }
    ],
    howItWorks: "यह कैसे काम करता है",
    cards: [
      { color: "orange", icon: <FaUsers />, title: "बहु-स्तरीय प्रशासन", desc: "प्रभावी प्रशासन के लिए प्रणाली विभिन्न प्रशासनिक इकाइयों में संगठित है।", points: ["ब्लॉक मॉनिटरिंग एंड मैनेजमेंट यूनिट (BMMU) ब्लॉक स्तर पर उपयोगकर्ताओं का प्रबंधन करती है।", "सब-डिस्ट्रिक्ट मॉनिटरिंग एंड मैनेजमेंट यूनिट (SMMU) उप-जिला स्तर पर उपयोगकर्ताओं का समन्वय करती है।", "डिस्ट्रिक्ट मॉनिटरिंग एंड मैनेजमेंट यूनिट (DMMU) जिला स्तर पर संचालन का प्रबंधन करती है।"] },
      { color: "blue", icon: <FaShieldAlt />, title: "भूमिका एवं अनुमति प्रबंधन", desc: "प्रत्येक उपयोगकर्ता को उसकी जिम्मेदारियों के अनुसार विशिष्ट भूमिकाएँ और अनुमतियाँ दी जाती हैं, जिससे नियंत्रित पहुँच और सुव्यवस्थित कार्यप्रवाह सुनिश्चित होता है।", points: ["एडमिन, विभाग, ब्लॉक और जिला जैसी उपयोगकर्ता भूमिकाएँ निर्धारित करें।", "मॉड्यूल-वार अनुमतियाँ प्रदान करें।", "उपयोगकर्ताओं को केवल संबंधित डेटा तक पहुँच दें।", "जवाबदेही और पारदर्शिता सुनिश्चित करें।"] },
      { color: "green", icon: <FaCog />, title: "प्रशासन एवं पारदर्शिता", desc: "यह मॉड्यूल प्रशासनिक पारदर्शिता को मजबूत करता है, अनधिकृत पहुँच को रोकता है और सभी विभागों में कुशल डिजिटल संचालन सुनिश्चित करता है।", points: ["उपयोगकर्ता गतिविधि और पहुँच की निगरानी करें।", "मानकीकृत प्रक्रियाओं का पालन सुनिश्चित करें।", "ऑडिट ट्रेल और गतिविधि ट्रैकिंग का समर्थन करें।", "डेटा सुरक्षा और सिस्टम विश्वसनीयता बढ़ाएँ।"] }
    ]
  }
};


export default function UserManagement() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  const setFontScale = (scale) => document.documentElement.style.setProperty("--font-scale", scale);
  useEffect(() => setFontScale(1), []);

  return (
    <div className="um-page">
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      {/* MAIN LOGO / LOGIN HEADER */}
      <TopNavigation />

      {/* NAVIGATION MENU */}
      <HeaderTopMenu />

      {/* MARQUEE / LATEST UPDATES */}
      <HeaderTopHeadline />

      {/* USER MANAGEMENT PAGE */}
      <main className="um-main">
        <section className="um-hero">
          <div className="um-hero-left">
            <span className="um-top-line"></span>
            <h1 className="um-title">
              <span className="um-title-blue">{t.title1}</span>{" "}
              <span className="um-title-orange">{t.title2}</span>
            </h1>
            <p className="um-description">{t.description}</p>

            <div className="um-feature-row">
              {t.features.map((f, i) => (
                <div className="um-mini-feature" key={i}>
                  <div className={`um-mini-icon ${f.color}`}>{f.icon}</div>
                  <div className="um-mini-content">
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="um-hero-right">
            <img src={userManagementHero} alt="User Management" />
          </div>
        </section>

        <section className="um-how-section">
          <div className="um-section-heading">
            <span className="um-section-line"></span>
            <h2>{t.howItWorks}</h2>
          </div>

          <div className="um-how-grid">
            {t.cards.map((card, i) => (
              <div className={`um-how-card ${card.color}-card`} key={i}>
                <div className="um-card-header">
                  <div className={`um-card-icon ${card.color}`}>{card.icon}</div>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
                <div className={`um-points ${card.color}-points`}>
                  {card.points.map((pt, idx) => (
                    <div className="um-point" key={idx}>
                      <FaCheckCircle />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="um-footer"><Footer /></footer>

      <style>{`
        .um-page, .um-page * { box-sizing: border-box; }
        .um-page { width: 100%; min-height: 100vh; overflow-x: hidden; background: linear-gradient(135deg, #ffffff 0%, #fffaf7 48%, #fff0e8 100%); }
        .um-main { position: relative; width: 100%; overflow: hidden; }
        .um-hero { position: relative; width: 100%; min-height: 440px; display: grid; grid-template-columns: 48% 52%; align-items: stretch; background: linear-gradient(125deg, #ffffff 0%, #fffaf7 45%, #fff2e8 100%); overflow: hidden; }
        .um-hero::before { content: ""; position: absolute; z-index: 0; left: -100px; bottom: -190px; width: 720px; height: 430px; border-radius: 50%; background: rgba(255, 227, 214, 0.62); transform: rotate(10deg); pointer-events: none; }
        .um-hero-left { position: relative; z-index: 3; display: flex; flex-direction: column; justify-content: center; padding: 52px 30px 48px clamp(45px, 6vw, 95px); }
        .um-top-line { display: block; width: 42px; height: 4px; margin-bottom: 15px; background: #ff5b0b; border-radius: 10px; }
        .um-title { margin: 0 0 20px; font-size: calc(48px * var(--font-scale, 1)); font-weight: 900; line-height: 1.05; letter-spacing: -1px; }
        .um-title-blue { color: #071b4d; }
        .um-title-orange { color: #ff5b0b; }
        .um-description { max-width: 650px; margin: 0 0 32px; color: #40536d; font-size: calc(50px * var(--font-scale, 1)); font-weight: 500; line-height: 1.65; }
        .um-feature-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 680px; }
        .um-mini-feature { display: flex; align-items: center; gap: 12px; }
        .um-mini-icon { width: 54px; height: 54px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 22px; }
        .um-mini-icon.blue { background: #dcecff; color: #1475e8; }
        .um-mini-icon.orange { background: #ffe5d5; color: #ff5b0b; }
        .um-mini-icon.green { background: #dcf6e6; color: #11a64a; }
        .um-mini-content h3 { margin: 0 0 3px; color: #08275c; font-size: calc(14px * var(--font-scale, 1)); font-weight: 900; }
        .um-mini-content p { margin: 0; color: #475569; font-size: calc(15px * var(--font-scale, 1)); line-height: 1.35; }
        .um-hero-right { position: relative; z-index: 2; width: 100%; height: 100%; overflow: hidden; }
        .um-hero-right img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center center; }
        .um-hero-right::before { content: ""; position: absolute; z-index: 3; top: 0; bottom: 0; left: 0; width: 90px; background: linear-gradient(90deg, #fffaf7 0%, rgba(255, 250, 247, 0.65) 35%, transparent 100%); pointer-events: none; }
        .um-how-section { position: relative; z-index: 5; width: 94%; max-width: 1450px; margin: -20px auto 34px; padding: 26px 30px 30px; background: rgba(255, 255, 255, 0.97); border: 1px solid rgba(255, 138, 74, 0.12); border-radius: 20px; box-shadow: 0 14px 40px rgba(84, 45, 20, 0.08); }
        .um-section-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
        .um-section-line { width: 42px; height: 4px; flex-shrink: 0; background: #ff5b0b; border-radius: 10px; }
        .um-section-heading h2 { margin: 0; color: #071b4d; font-size: calc(32px * var(--font-scale, 1)); font-weight: 900; }
        .um-how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .um-how-card { min-width: 0; padding: 18px 16px 16px; background: #ffffff; border: 1px solid #edf0f4; border-radius: 17px; box-shadow: 0 5px 14px rgba(15, 23, 42, 0.04); transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .um-how-card:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08); }
        .um-card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
        .um-card-icon { width: 50px; height: 50px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 21px; }
        .um-card-icon.orange { background: #ffe7da; color: #ff5b0b; }
        .um-card-icon.blue { background: #ddecff; color: #1475e8; }
        .um-card-icon.green { background: #def6e6; color: #0bab4a; }
        .um-card-header h3 { margin: 2px 0 5px; color: #071b4d; font-size: calc(20px * var(--font-scale, 1)); font-weight: 900; line-height: 1.25; }
        .um-card-header p { margin: 0; color: #475569; font-size: calc(15px * var(--font-scale, 1)); line-height: 1.45; }
        .um-points { padding: 14px 14px; border-radius: 13px; display: flex; flex-direction: column; gap: 10px; }
        .orange-points { background: linear-gradient(135deg, #fff9f5, #fff1e8); }
        .blue-points { background: linear-gradient(135deg, #f6faff, #eaf4ff); }
        .green-points { background: linear-gradient(135deg, #f5fff8, #e8f8ee); }
        .um-point { display: flex; align-items: flex-start; gap: 9px; color: #334155; font-size: calc(14px * var(--font-scale, 1)); font-weight: 500; line-height: 1.4; }
        .um-point svg { margin-top: 2px; flex-shrink: 0; }
        .orange-points .um-point svg { color: #ff5b0b; }
        .blue-points .um-point svg { color: #1475e8; }
        .green-points .um-point svg { color: #0bab4a; }
        .um-footer { width: 100%; }

        /* EXACT MEDIA QUERIES PRESERVED */
        @media (min-width: 1400px) {
          .um-hero { min-height: 470px; grid-template-columns: 49% 51%; }
          .um-hero-left { padding-left: clamp(65px, 7vw, 120px); }
          .um-title { font-size: calc(52px * var(--font-scale, 1)); }
          .um-description { font-size: calc(16px * var(--font-scale, 1)); }
          .um-how-section { max-width: 1480px; }
        }

        @media (max-width: 1200px) {
          .um-hero { min-height: 420px; grid-template-columns: 50% 50%; }
          .um-hero-left { padding: 42px 24px 42px 40px; }
          .um-title { font-size: calc(42px * var(--font-scale, 1)); }
          .um-description { margin-bottom: 25px; font-size: calc(14px * var(--font-scale, 1)); }
          .um-feature-row { gap: 12px; }
          .um-mini-icon { width: 46px; height: 46px; font-size: 19px; }
          .um-how-section { width: 95%; padding: 24px 22px 26px; }
        }

        @media (max-width: 1024px) {
          .um-hero { min-height: 405px; grid-template-columns: 55% 45%; }
          .um-hero-left { padding: 36px 20px 38px 28px; }
          .um-title { font-size: calc(36px * var(--font-scale, 1)); }
          .um-description { font-size: calc(13px * var(--font-scale, 1)); }
          .um-feature-row { grid-template-columns: 1fr 1fr; max-width: 500px; }
          .um-how-grid { grid-template-columns: 1fr 1fr; }
          .um-how-card:last-child { grid-column: 1 / -1; }
        }

        @media (max-width: 900px) {
          .um-hero { display: block; min-height: auto; }
          .um-hero-left { width: 100%; padding: 38px 28px 45px; }
          .um-hero-right { display: none; }
          .um-description { max-width: 720px; }
          .um-feature-row { grid-template-columns: repeat(3, 1fr); max-width: 720px; }
          .um-how-section { margin-top: -10px; width: 94%; }
          .um-how-grid { grid-template-columns: 1fr; }
          .um-how-card:last-child { grid-column: auto; }
        }

        @media (max-width: 600px) {
          .um-hero-left { padding: 30px 16px 38px; }
          .um-top-line { width: 32px; height: 3px; margin-bottom: 12px; }
          .um-title { font-size: calc(31px * var(--font-scale, 1)); margin-bottom: 15px; }
          .um-description { margin-bottom: 24px; font-size: calc(13px * var(--font-scale, 1)); line-height: 1.55; }
          .um-feature-row { grid-template-columns: 1fr; gap: 13px; }
          .um-mini-icon { width: 42px; height: 42px; font-size: 18px; }
          .um-how-section { width: calc(100% - 24px); margin: 0 auto 24px; padding: 20px 13px 18px; border-radius: 16px; }
          .um-section-heading { gap: 10px; margin-bottom: 15px; }
          .um-section-line { width: 28px; height: 3px; }
          .um-section-heading h2 { font-size: calc(21px * var(--font-scale, 1)); }
          .um-how-grid { gap: 12px; }
          .um-how-card { padding: 14px 12px; }
          .um-card-icon { width: 42px; height: 42px; font-size: 18px; }
          .um-card-header h3 { font-size: calc(13px * var(--font-scale, 1)); }
          .um-card-header p, .um-point { font-size: calc(10px * var(--font-scale, 1)); }
        }

        @media (max-width: 400px) {
          .um-hero-left { padding: 26px 13px 32px; }
          .um-title { font-size: calc(27px * var(--font-scale, 1)); }
          .um-description { font-size: calc(12px * var(--font-scale, 1)); }
          .um-mini-content h3 { font-size: calc(12px * var(--font-scale, 1)); }
          .um-mini-content p { font-size: calc(10px * var(--font-scale, 1)); }
          .um-how-section { width: calc(100% - 18px); padding: 18px 10px; }
          .um-card-header { gap: 10px; }
          .um-card-icon { width: 38px; height: 38px; font-size: 16px; }
          .um-points { padding: 12px 10px; }
        }
      `}</style>
    </div>
  );
}