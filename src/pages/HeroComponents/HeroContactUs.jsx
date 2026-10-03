import { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";
import contactBg from "../../assets/Hero/About/contactus.png";

// Hoisted outside to prevent re-creation on every render
const content = {
  en: {
    title: "Need Support?",
    highlight: "We Are Here to Help",
    callTitle: "Call Us",
    callDay: "Monday – Friday",
    callTime: "10:30 AM – 6:30 PM",
    emailTitle: "Email Us",
    emailDesc: "Send your queries anytime",
  },
  hi: {
    title: "सहायता चाहिए?",
    highlight: "हम आपकी मदद के लिए हैं",
    callTitle: "हमें कॉल करें",
    callDay: "सोमवार – शुक्रवार",
    callTime: "सुबह 10:30 – शाम 6:30",
    emailTitle: "ईमेल करें",
    emailDesc: "अपनी समस्या कभी भी भेजें",
  },
};

export default function HeroContactUs() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <section
      className="support-section"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      <div className="support-content">
        <div className="support-heading">
          <h2>{t.title}</h2>
          <h3>{t.highlight}</h3>
        </div>

        <div className="support-info-row">
          <div className="support-info-item">
            <div className="support-icon">☎</div>
            <div className="support-text">
              <h4>{t.callTitle}</h4>
              <p>{t.callDay}</p>
              <p>{t.callTime}</p>
              <a href="tel:+919236434631">+91-9236434631</a>
              <a href="tel:+918840961627">+91-8840961627</a>
            </div>
          </div>

          <div className="support-info-item">
            <div className="support-icon">✉</div>
            <div className="support-text">
              <h4>{t.emailTitle}</h4>
              <p>{t.emailDesc}</p>
              <a href="mailto:bdopmuit@gmail.com">bdopmuit@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* BASE STYLES (Increased Font Sizes) */
        .support-section { width: 100%; min-height: 420px; position: relative; display: flex; align-items: center; background-size: cover; background-position: center right; background-repeat: no-repeat; box-sizing: border-box; overflow: hidden; }
        .support-content { width: 100%; max-width: 1500px; margin: 0 auto; padding: 55px 50px; box-sizing: border-box; position: relative; z-index: 2; }
        .support-heading { margin-bottom: 30px; max-width: 520px; }
        .support-heading h2 { margin: 0; color: #123d75; font-size: 55px; font-weight: 800; line-height: 1.1; }
        .support-heading h3 { margin: 5px 0 0; color: #f97316; font-size: 50px; font-weight: 800; line-height: 1.1; }
        .support-info-row { display: flex; align-items: flex-start; gap: 45px; max-width: 650px; }
        .support-info-item { display: flex; align-items: flex-start; gap: 15px; min-width: 0; }
        .support-icon { width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; color: #f97316; font-size: 22px; box-shadow: 0 4px 15px rgba(15,23,42,.1); }
        .support-text h4 { margin: 0 0 6px; color: #123d75; font-size: 17px; font-weight: 800; }
        .support-text p { margin: 0; color: #64748b; font-size: 14px; line-height: 1.45; }
        .support-text a { display: block; margin-top: 4px; color: #2563eb; font-size: 14px; font-weight: 800; text-decoration: none; }
        .support-text a:hover { text-decoration: underline; }

        /* TABLET / SMALL LAPTOP (Replaces 1400, 1200, 1024, 900) */

        /* =========================================
   1400px+ LARGE DESKTOP
========================================= */

@media (min-width:1400px){

  .support-section{
    min-height:460px;
  }

  .support-content{
    max-width:1600px;
    padding:60px 65px;
  }

  .support-heading{
    max-width:620px;
    margin-bottom:34px;
  }

  .support-heading h2{
    font-size:58px;
  }

  .support-heading h3{
    font-size:53px;
  }

  .support-info-row{
    max-width:720px;
    gap:55px;
  }

  .support-icon{
    width:50px;
    height:50px;
    font-size:24px;
  }

  .support-text h4{
    font-size:18px;
  }

  .support-text p,
  .support-text a{
    font-size:15px;
  }
}
        @media (max-width: 1024px) {
          .support-section { min-height: 360px; background-position: 62% center; }
          .support-content { padding: 40px 28px; }
          .support-heading { max-width: 450px; }
          .support-heading h2 { font-size: 32px; }
          .support-heading h3 { font-size: 30px; }
          .support-info-row { gap: 28px; max-width: 540px; }
          .support-icon { width: 42px; height: 42px; font-size: 20px; }
          .support-text h4 { font-size: 15px; }
          .support-text p, .support-text a { font-size: 13px; }
        }

        /* MOBILE (Replaces 600) */
        @media (max-width: 768px) {
          .support-section { min-height: 450px; align-items: flex-start; background-size: auto 100%; background-position: 75% center; }
          .support-section::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.92) 50%, rgba(255,255,255,.15) 100%); z-index: 1; }
          .support-content { padding: 35px 18px; z-index: 2; }
          .support-heading { max-width: 310px; margin-bottom: 25px; }
          .support-heading h2 { font-size: 28px; }
          .support-heading h3 { font-size: 26px; }
          .support-info-row { flex-direction: column; gap: 22px; max-width: 300px; }
          .support-icon { width: 40px; height: 40px; font-size: 18px; }
          .support-text h4 { font-size: 15px; }
          .support-text p, .support-text a { font-size: 13px; }
        }

        /* SMALL MOBILE (Replaces 400) */
        @media (max-width: 480px) {
          .support-section { min-height: 420px; background-position: 77% center; }
          .support-content { padding: 28px 14px; }
          .support-heading { margin-bottom: 22px; }
          .support-heading h2 { font-size: 24px; }
          .support-heading h3 { font-size: 22px; }
          .support-info-row { gap: 18px; }
          .support-icon { width: 36px; height: 36px; font-size: 16px; }
          .support-text h4 { font-size: 14px; }
          .support-text p, .support-text a { font-size: 12px; }
        }
      `}</style>
    </section>
  );
}
