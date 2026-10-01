// src/pages/PublicLDMS/LDMSModules.jsx

import React, { useContext } from "react";

import {
  FaRegFileAlt,
  FaUsers,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import { LanguageContext } from "../LanguageContext.jsx";

/*
  CHANGE ONLY THESE IMAGE NAMES
  IF YOUR FILE NAMES ARE DIFFERENT
*/

import incomePlanningImg from "../../assets/LDMS/income_planning.png";
import skillEnterpriseImg from "../../assets/LDMS/skill_enterprise.png";
import progressTrackingImg from "../../assets/LDMS/progress_tracking.png";


export default function LDMSModules() {

  const { lang } = useContext(LanguageContext);


  /* =====================================================
     LANGUAGE CONTENT
  ===================================================== */

  const content = {

    en: {

      heading: "Core Lakhpati Didi Modules",

      viewAll: "View All Modules",

      modules: [

        {
          id: 1,

          title: "Income Planning",

          description:
            "Support members in creating livelihood plans, diversifying income sources and linking with financial services.",

          icon: <FaRegFileAlt />,

          image: incomePlanningImg,
        },


        {
          id: 2,

          title: "Skill & Enterprise Support",

          description:
            "Provide access to training, capacity building, enterprise development and market linkages for sustainable livelihoods.",

          icon: <FaUsers />,

          image: skillEnterpriseImg,
        },


        {
          id: 3,

          title: "Progress Tracking",

          description:
            "Monitor member progress, income growth and convergence with government programs using digital tools.",

          icon: <FaChartLine />,

          image: progressTrackingImg,
        },

      ],
    },


    hi: {

      heading: "मुख्य लखपति दीदी मॉड्यूल",

      viewAll: "सभी मॉड्यूल देखें",

      modules: [

        {
          id: 1,

          title: "आय योजना",

          description:
            "सदस्यों को आजीविका योजना तैयार करने, आय के स्रोतों में विविधता लाने और वित्तीय सेवाओं से जुड़ने में सहायता प्रदान करता है।",

          icon: <FaRegFileAlt />,

          image: incomePlanningImg,
        },


        {
          id: 2,

          title: "कौशल एवं उद्यम सहायता",

          description:
            "सतत आजीविका के लिए प्रशिक्षण, क्षमता निर्माण, उद्यम विकास और बाजार संपर्क की सुविधाएँ प्रदान करता है।",

          icon: <FaUsers />,

          image: skillEnterpriseImg,
        },


        {
          id: 3,

          title: "प्रगति निगरानी",

          description:
            "डिजिटल उपकरणों के माध्यम से सदस्यों की प्रगति, आय वृद्धि और सरकारी योजनाओं के साथ अभिसरण की निगरानी करता है।",

          icon: <FaChartLine />,

          image: progressTrackingImg,
        },

      ],
    },

  };


  const t = content[lang] || content.en;


  return (

    <section className="ldms-modules">

      <div className="ldms-modules-container">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="ldms-modules-header">


          <div className="ldms-modules-title">

            <span className="ldms-modules-line"></span>

            <h2>
              {t.heading}
            </h2>

          </div>


          <button className="ldms-view-modules-btn">

            <span>
              {t.viewAll}
            </span>

            <FaArrowRight />

          </button>


        </div>


        {/* =====================================================
            MODULE CARDS
        ===================================================== */}

        <div className="ldms-modules-grid">


          {t.modules.map((module) => (

            <div
              className="ldms-module-card"
              key={module.id}
            >


              {/* ================= CONTENT ================= */}

              <div className="ldms-module-content">


                <div className="ldms-module-icon">

                  {module.icon}

                </div>


                <h3>
                  {module.title}
                </h3>


                <p>
                  {module.description}
                </p>


              </div>


              {/* ================= IMAGE ================= */}

              <div className="ldms-module-image">

                <img
                  src={module.image}
                  alt={module.title}
                />

              </div>


            </div>

          ))}


        </div>


      </div>


      <style>{`

        /* =====================================================
           SECTION
        ===================================================== */

        .ldms-modules {
          width: 100%;

          padding:
            18px
            0
            24px;

          background: #ffffff;
        }


        .ldms-modules-container {
          width: 92%;
          max-width: 1400px;

          margin: 0 auto;
        }



        /* =====================================================
           HEADER
        ===================================================== */

        .ldms-modules-header {
          width: 100%;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 14px;
        }


        .ldms-modules-title {
          display: flex;

          align-items: center;

          gap: 12px;
        }


        .ldms-modules-line {
          width: 24px;
          height: 3px;

          flex-shrink: 0;

          background: #ff5b0b;

          border-radius: 20px;
        }


        .ldms-modules-title h2 {
          margin: 0;

          color: #071b4d;

          font-size:
            calc(
              21px *
              var(--font-scale, 1)
            );

          font-weight: 900;

          line-height: 1.2;
        }



        /* =====================================================
           VIEW ALL BUTTON
        ===================================================== */

        .ldms-view-modules-btn {
          min-height: 32px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          padding:
            0
            17px;

          border:
            1.5px solid
            #ff5b0b;

          border-radius: 18px;

          background: #ffffff;

          color: #ff5b0b;

          font-size:
            calc(
              10px *
              var(--font-scale, 1)
            );

          font-weight: 800;

          white-space: nowrap;

          cursor: pointer;

          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }


        .ldms-view-modules-btn svg {
          font-size: 10px;

          transition:
            transform 0.25s ease;
        }


        .ldms-view-modules-btn:hover {
          background: #ff5b0b;

          color: #ffffff;

          transform:
            translateY(-1px);
        }


        .ldms-view-modules-btn:hover svg {
          transform:
            translateX(3px);
        }



        /* =====================================================
           GRID
        ===================================================== */

        .ldms-modules-grid {
          width: 100%;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 16px;
        }



        /* =====================================================
           CARD
        ===================================================== */

        .ldms-module-card {
          position: relative;

          width: 100%;
          min-height: 150px;

          display: flex;

          overflow: hidden;

          background: #ffffff;

          border:
            1px solid
            #e2e8f0;

          border-radius: 8px;

          box-shadow:
            0 4px 12px
            rgba(15, 23, 42, 0.05);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }


        .ldms-module-card:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 8px 18px
            rgba(15, 23, 42, 0.1);
        }



        /* =====================================================
           LEFT CONTENT
        ===================================================== */

        .ldms-module-content {
          position: relative;

          z-index: 4;

          width: 62%;

          padding:
            13px
            10px
            13px
            18px;

          background: #ffffff;
        }


        .ldms-module-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 7px;

          border-radius: 50%;

          background: #fff0e7;

          color: #ff5b0b;

          font-size: 19px;
        }


        .ldms-module-content h3 {
          margin:
            0
            0
            5px;

          color: #071b4d;

          font-size:
            calc(
              14px *
              var(--font-scale, 1)
            );

          font-weight: 900;

          line-height: 1.2;
        }


        .ldms-module-content p {
          width: 100%;
          max-width: 245px;

          margin: 0;

          color: #334155;

          font-size:
            calc(
              15px *
              var(--font-scale, 1)
            );

          font-weight: 500;

          line-height: 1.35;
        }



        /* =====================================================
           RIGHT IMAGE
        ===================================================== */

        .ldms-module-image {
          position: absolute;

          top: 0;
          right: 0;

          width: 44%;
          height: 100%;

          overflow: hidden;
        }


        .ldms-module-image img {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: cover;

          object-position: center;
        }



        /* =====================================================
           WHITE CURVE
        ===================================================== */

        .ldms-module-image::before {
          content: "";

          position: absolute;

          z-index: 2;

          top: -15%;
          left: -48px;

          width: 90px;
          height: 130%;

          background: #ffffff;

          border-radius:
            0
            100%
            100%
            0;

          pointer-events: none;
        }



        /* =====================================================
           1400px+ LARGE DESKTOP
        ===================================================== */

        @media (min-width: 1400px) {

          .ldms-modules-container {
            max-width: 1420px;
          }


          .ldms-modules-title h2 {
            font-size:
              calc(
                22px *
                var(--font-scale, 1)
              );
          }


          .ldms-module-card {
            min-height: 155px;
          }


          .ldms-module-content {
            padding:
              15px
              12px
              14px
              20px;
          }


          .ldms-module-content h3 {
            font-size:
              calc(
                14px *
                var(--font-scale, 1)
              );
          }


          .ldms-module-content p {
            font-size:
              calc(
                14px *
                var(--font-scale, 1)
              );
          }

        }



        /* =====================================================
           1200px LAPTOP
        ===================================================== */

        @media (max-width: 1200px) {

          .ldms-modules-container {
            width: 94%;
          }


          .ldms-modules-grid {
            gap: 13px;
          }


          .ldms-module-card {
            min-height: 148px;
          }


          .ldms-module-content {
            width: 63%;

            padding:
              13px
              8px
              12px
              15px;
          }


          .ldms-module-image {
            width: 43%;
          }


          .ldms-module-icon {
            width: 37px;
            height: 37px;

            font-size: 17px;
          }


          .ldms-module-content h3 {
            font-size:
              calc(
                13px *
                var(--font-scale, 1)
              );
          }


          .ldms-module-content p {
            font-size:
              calc(
                13px *
                var(--font-scale, 1)
              );
          }

        }



        /* =====================================================
           1024px SMALL LAPTOP
        ===================================================== */

        @media (max-width: 1024px) {

          .ldms-modules-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }


          .ldms-module-card:last-child {
            grid-column:
              1 / -1;
          }


          .ldms-module-card:last-child
          .ldms-module-content {
            width: 55%;
          }


          .ldms-module-card:last-child
          .ldms-module-image {
            width: 48%;
          }

        }



        /* =====================================================
           900px TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .ldms-modules {
            padding:
              20px
              0
              24px;
          }


          .ldms-modules-grid {
            grid-template-columns:
              1fr;

            gap: 12px;
          }


          .ldms-module-card:last-child {
            grid-column: auto;
          }


          .ldms-module-card {
            min-height: 155px;
          }


          .ldms-module-content,
          .ldms-module-card:last-child
          .ldms-module-content {
            width: 58%;
          }


          .ldms-module-image,
          .ldms-module-card:last-child
          .ldms-module-image {
            width: 46%;
          }

        }



        /* =====================================================
           600px MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .ldms-modules-container {
            width:
              calc(
                100% - 30px
              );
          }


          .ldms-modules-header {
            align-items: flex-start;
          }


          .ldms-modules-title {
            gap: 9px;
          }


          .ldms-modules-line {
            width: 18px;
          }


          .ldms-modules-title h2 {
            font-size:
              calc(
                17px *
                var(--font-scale, 1)
              );
          }


          .ldms-view-modules-btn {
            min-height: 29px;

            padding:
              0
              11px;

            font-size:
              calc(
                9px *
                var(--font-scale, 1)
              );
          }


          .ldms-module-card {
            min-height: 145px;
          }


          .ldms-module-content,
          .ldms-module-card:last-child
          .ldms-module-content {
            width: 62%;

            padding:
              12px
              7px
              11px
              12px;
          }


          .ldms-module-image,
          .ldms-module-card:last-child
          .ldms-module-image {
            width: 42%;
          }


          .ldms-module-image::before {
            left: -34px;

            width: 64px;
          }


          .ldms-module-icon {
            width: 34px;
            height: 34px;

            margin-bottom: 6px;

            font-size: 16px;
          }


          .ldms-module-content h3 {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );
          }


          .ldms-module-content p {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );

            line-height: 1.35;
          }

        }



        /* =====================================================
           400px SMALL MOBILE
        ===================================================== */

        @media (max-width: 400px) {

          .ldms-modules-container {
            width:
              calc(
                100% - 24px
              );
          }


          .ldms-modules-header {
            flex-direction: column;

            gap: 9px;
          }


          .ldms-view-modules-btn {
            align-self: flex-end;
          }


          /*
            On very small screens:
            content on top + image below.
          */

          .ldms-module-card {
            min-height: 220px;

            flex-direction: column;
          }


          .ldms-module-content,
          .ldms-module-card:last-child
          .ldms-module-content {
            width: 100%;

            padding:
              12px
              12px
              10px;
          }


          .ldms-module-content p {
            max-width: 100%;
          }


          .ldms-module-image,
          .ldms-module-card:last-child
          .ldms-module-image {
            position: absolute;

            top: auto;
            right: 0;
            bottom: 0;

            width: 100%;
            height: 90px;
          }


          .ldms-module-image::before {
            display: none;
          }

        }

      `}</style>

    </section>

  );
}