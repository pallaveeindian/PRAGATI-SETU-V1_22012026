import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";

import contactBg from "../../assets/Hero/About/contactus.png";

export default function HeroContactUs() {
  const { lang } = useContext(LanguageContext);

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

  const t = content[lang] || content.en;

  return (
    <section
      className="support-section"
      style={{
        backgroundImage: `url(${contactBg})`,
      }}
    >
      <div className="support-content">

        {/* ================= HEADING ================= */}

        <div className="support-heading">

          <h2>
            {t.title}
          </h2>

          <h3>
            {t.highlight}
          </h3>

        </div>


        {/* ================= CONTACT ROW ================= */}

        <div className="support-info-row">


          {/* CALL */}

          <div className="support-info-item">

            <div className="support-icon">
              ☎
            </div>

            <div className="support-text">

              <h4>
                {t.callTitle}
              </h4>

              <p>
                {t.callDay}
              </p>

              <p>
                {t.callTime}
              </p>

              <a href="tel:+919236434631">
                +91-9236434631
              </a>

              <a href="tel:+918840961627">
                +91-8840961627
              </a>

            </div>

          </div>



          {/* EMAIL */}

          <div className="support-info-item">

            <div className="support-icon">
              ✉
            </div>

            <div className="support-text">

              <h4>
                {t.emailTitle}
              </h4>

              <p>
                {t.emailDesc}
              </p>

              <a href="mailto:bdopmuit@gmail.com">
                bdopmuit@gmail.com
              </a>

            </div>

          </div>

        </div>

      </div>



      <style>{`

        /* =========================================
           MAIN SECTION
        ========================================= */

        .support-section {
          width: 100%;

          min-height: 420px;

          position: relative;

          display: flex;

          align-items: center;

          background-size: cover;

          background-position: center right;

          background-repeat: no-repeat;

          box-sizing: border-box;

          overflow: hidden;
        }



        /* =========================================
           CONTENT
        ========================================= */

        .support-content {
          width: 100%;

          max-width: 1500px;

          margin: 0 auto;

          padding:
            55px
            50px;

          box-sizing: border-box;

          position: relative;

          z-index: 2;
        }



        /* =========================================
           HEADING
        ========================================= */

        .support-heading {
          margin-bottom: 30px;

          max-width: 520px;
        }


        .support-heading h2 {
          margin: 0;

          color: #123d75;

          font-size: 36px;

          font-weight: 800;

          line-height: 1.1;
        }


        .support-heading h3 {
          margin:
            5px
            0
            0;

          color: #f97316;

          font-size: 34px;

          font-weight: 800;

          line-height: 1.1;
        }



        /* =========================================
           INFO ROW
        ========================================= */

        .support-info-row {
          display: flex;

          align-items: flex-start;

          gap: 45px;

          max-width: 650px;
        }



        /* =========================================
           INFO ITEM
        ========================================= */

        .support-info-item {
          display: flex;

          align-items: flex-start;

          gap: 13px;

          min-width: 0;
        }



        /* =========================================
           ICON
        ========================================= */

        .support-icon {
          width: 42px;

          height: 42px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #f97316;

          font-size: 18px;

          box-shadow:
            0 4px 15px
            rgba(15, 23, 42, 0.10);
        }



        /* =========================================
           TEXT
        ========================================= */

        .support-text h4 {
          margin:
            0
            0
            4px;

          color: #123d75;

          font-size: 14px;

          font-weight: 800;
        }


        .support-text p {
          margin: 0;

          color: #64748b;

          font-size: 11px;

          line-height: 1.45;
        }


        .support-text a {
          display: block;

          margin-top: 3px;

          color: #2563eb;

          font-size: 11px;

          font-weight: 800;

          text-decoration: none;
        }


        .support-text a:hover {
          text-decoration: underline;
        }



        /* =========================================
           1400+
        ========================================= */

        @media (min-width: 1400px) {

          .support-section {
            min-height: 450px;
          }


          .support-content {
            padding:
              65px
              70px;
          }


          .support-heading h2 {
            font-size: 40px;
          }


          .support-heading h3 {
            font-size: 38px;
          }


          .support-info-row {
            gap: 55px;
          }

        }



        /* =========================================
           1200
        ========================================= */

        @media (max-width: 1200px) {

          .support-section {
            min-height: 390px;

            background-position:
              65% center;
          }


          .support-content {
            padding:
              45px
              35px;
          }


          .support-heading h2 {
            font-size: 32px;
          }


          .support-heading h3 {
            font-size: 30px;
          }


          .support-info-row {
            gap: 35px;

            max-width: 600px;
          }

        }



        /* =========================================
           1024
        ========================================= */

        @media (max-width: 1024px) {

          .support-section {
            min-height: 360px;

            background-position:
              62% center;
          }


          .support-content {
            padding:
              40px
              28px;
          }


          .support-heading {
            max-width: 450px;
          }


          .support-heading h2 {
            font-size: 28px;
          }


          .support-heading h3 {
            font-size: 27px;
          }


          .support-info-row {
            gap: 28px;

            max-width: 540px;
          }

        }



        /* =========================================
           900
        ========================================= */

        @media (max-width: 900px) {

          .support-section {
            min-height: 340px;

            background-position:
              68% center;
          }


          .support-content {
            padding:
              35px
              24px;
          }


          .support-heading h2 {
            font-size: 26px;
          }


          .support-heading h3 {
            font-size: 25px;
          }


          .support-info-row {
            gap: 22px;
          }


          .support-text h4 {
            font-size: 13px;
          }


          .support-text p,
          .support-text a {
            font-size: 10.5px;
          }

        }



        /* =========================================
           600
        ========================================= */

        @media (max-width: 600px) {

          .support-section {
            min-height: 500px;

            align-items: flex-start;

            background-size: auto 100%;

            background-position:
              75% center;
          }


          /*
            Add a soft light overlay on mobile
            so text stays readable.
          */

          .support-section::before {
            content: "";

            position: absolute;

            inset: 0;

            background:
              linear-gradient(
                90deg,
                rgba(255,255,255,0.98) 0%,
                rgba(255,255,255,0.92) 50%,
                rgba(255,255,255,0.15) 100%
              );

            z-index: 1;
          }


          .support-content {
            padding:
              35px
              18px;

            z-index: 2;
          }


          .support-heading {
            max-width: 310px;

            margin-bottom: 25px;
          }


          .support-heading h2 {
            font-size: 24px;
          }


          .support-heading h3 {
            font-size: 23px;
          }


          .support-info-row {
            flex-direction: column;

            gap: 22px;

            max-width: 300px;
          }


          .support-icon {
            width: 38px;

            height: 38px;

            font-size: 16px;
          }


          .support-text h4 {
            font-size: 13px;
          }


          .support-text p,
          .support-text a {
            font-size: 11px;
          }

        }



        /* =========================================
           400
        ========================================= */

        @media (max-width: 400px) {

          .support-section {
            min-height: 460px;

            background-position:
              77% center;
          }


          .support-content {
            padding:
              28px
              14px;
          }


          .support-heading h2 {
            font-size: 21px;
          }


          .support-heading h3 {
            font-size: 20px;
          }


          .support-heading {
            margin-bottom: 22px;
          }


          .support-info-row {
            gap: 18px;
          }


          .support-icon {
            width: 34px;

            height: 34px;

            font-size: 14px;
          }


          .support-text h4 {
            font-size: 12px;
          }


          .support-text p,
          .support-text a {
            font-size: 10px;
          }

        }

      `}</style>

    </section>
  );
}