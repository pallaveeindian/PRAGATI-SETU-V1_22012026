// src/pages/PublicLDMS/LDMSOverview.jsx

import React, { useContext } from "react";

import {
  FaUsers,
  FaSeedling,
} from "react-icons/fa";

import { LanguageContext } from "../LanguageContext.jsx";


export default function LDMSOverview() {
  const { lang } = useContext(LanguageContext);


  /* =====================================================
     LANGUAGE CONTENT
  ===================================================== */

  const content = {
    en: {
      headingPrefix: "Overview of",
      headingHighlight: "Lakhpati Didi",

      cards: [
        {
          id: 1,

          title: "SHG Income Empowerment",

          description:
            "Targets SHG members whose households earn over Rs. 1 lakh annually, aiming to improve livelihoods through sustainable farming, non-farm activities and enhanced living standards.",

          icon: <FaUsers />,
        },

        {
          id: 2,

          title: "Livelihood Planning & Support",

          description:
            "Identifies eligible members, provides cascading training, and supports livelihood planning using digital tools, value chain linkages and market opportunities.",

          icon: <FaSeedling />,
        },

        {
          id: 3,

          title: "Collective Growth & Inclusion",

          description:
            "Leverages SHGs as platforms for collective action, financial literacy, skill development and entrepreneurial empowerment, with support for producer groups, enterprises and convergence schemes.",

          icon: <FaUsers />,
        },
      ],
    },


    hi: {
      headingPrefix: "अवलोकन",
      headingHighlight: "लखपति दीदी",

      cards: [
        {
          id: 1,

          title: "एसएचजी आय सशक्तिकरण",

          description:
            "ऐसे स्वयं सहायता समूह सदस्यों को लक्षित करता है जिनके परिवार की वार्षिक आय 1 लाख रुपये से अधिक हो, तथा सतत कृषि, गैर-कृषि गतिविधियों और बेहतर जीवन स्तर के माध्यम से आजीविका सुधारने में सहायता करता है।",

          icon: <FaUsers />,
        },

        {
          id: 2,

          title: "आजीविका योजना एवं सहायता",

          description:
            "पात्र सदस्यों की पहचान करता है, चरणबद्ध प्रशिक्षण प्रदान करता है तथा डिजिटल उपकरणों, मूल्य श्रृंखला संपर्कों और बाजार अवसरों के माध्यम से आजीविका योजना में सहायता करता है।",

          icon: <FaSeedling />,
        },

        {
          id: 3,

          title: "सामूहिक विकास एवं समावेशन",

          description:
            "स्वयं सहायता समूहों को सामूहिक कार्रवाई, वित्तीय साक्षरता, कौशल विकास और उद्यमिता सशक्तिकरण के मंच के रूप में मजबूत करता है तथा उत्पादक समूहों, उद्यमों और अभिसरण योजनाओं को समर्थन प्रदान करता है।",

          icon: <FaUsers />,
        },
      ],
    },
  };


  const t = content[lang] || content.en;


  return (
    <section className="ldms-overview">

      <div className="ldms-overview-container">


        {/* ================= HEADING ================= */}

        <div className="ldms-overview-heading">

          <span className="ldms-overview-line"></span>

          <h2>
            <span className="ldms-heading-blue">
              {t.headingPrefix}
            </span>

            {" "}

            <span className="ldms-heading-orange">
              {t.headingHighlight}
            </span>
          </h2>

        </div>


        {/* ================= CARDS ================= */}

        <div className="ldms-overview-grid">

          {t.cards.map((card) => (

            <div
              className="ldms-overview-card"
              key={card.id}
            >

              {/* ICON */}

              <div className="ldms-overview-icon">
                {card.icon}
              </div>


              {/* CONTENT */}

              <div className="ldms-overview-content">

                <h3>
                  {card.title}
                </h3>

                <p>
                  {card.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>


      <style>{`

        /* =====================================================
           SECTION
        ===================================================== */

        .ldms-overview {
          width: 100%;

          padding:
            18px
            0
            22px;

          background: #ffffff;
        }


        .ldms-overview-container {
          width: 92%;
          max-width: 1400px;

          margin: 0 auto;
        }


        /* =====================================================
           HEADING
        ===================================================== */

        .ldms-overview-heading {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-bottom: 14px;
        }


        .ldms-overview-line {
          width: 24px;
          height: 3px;

          flex-shrink: 0;

          background: #ff5b0b;

          border-radius: 10px;
        }


        .ldms-overview-heading h2 {
          margin: 0;

          font-size:
            calc(
              21px *
              var(--font-scale, 1)
            );

          font-weight: 900;

          line-height: 1.2;
        }


        .ldms-heading-blue {
          color: #071b4d;
        }


        .ldms-heading-orange {
          color: #ff5b0b;
        }


        /* =====================================================
           GRID
        ===================================================== */

        .ldms-overview-grid {
          width: 100%;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 16px;
        }


        /* =====================================================
           CARD
        ===================================================== */

        .ldms-overview-card {
          min-height: 118px;

          display: flex;

          align-items: flex-start;

          gap: 15px;

          padding:
            14px
            16px;

          background: #ffffff;

          border:
            1.5px solid
            #ff762f;

          border-radius: 8px;

          box-shadow:
            0 3px 8px
            rgba(255, 91, 11, 0.05);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }


        .ldms-overview-card:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 8px 18px
            rgba(15, 23, 42, 0.09);
        }


        /* =====================================================
           ICON
        ===================================================== */

        .ldms-overview-icon {
          width: 50px;
          height: 50px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fff0e8;

          color: #ff5b0b;

          font-size: 24px;
        }


        /* =====================================================
           TEXT
        ===================================================== */

        .ldms-overview-content {
          flex: 1;

          min-width: 0;
        }


        .ldms-overview-content h3 {
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

          line-height: 1.25;
        }


        .ldms-overview-content p {
          margin: 0;

          color: #334155;

          font-size:
            calc(
              15px *
              var(--font-scale, 1)
            );

          font-weight: 500;

          line-height: 1.4;
        }



        /* =====================================================
           1400px+ LARGE DESKTOP
        ===================================================== */

        @media (min-width: 1400px) {

          .ldms-overview-container {
            max-width: 1420px;
          }


          .ldms-overview-heading h2 {
            font-size:
              calc(
                22px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-card {
            min-height: 122px;

            padding:
              15px
              18px;
          }


          .ldms-overview-icon {
            width: 52px;
            height: 52px;

            font-size: 25px;
          }


          .ldms-overview-content h3 {
            font-size:
              calc(
                14px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-content p {
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

          .ldms-overview-container {
            width: 94%;
          }


          .ldms-overview-grid {
            gap: 13px;
          }


          .ldms-overview-card {
            min-height: 120px;

            gap: 12px;

            padding:
              13px
              14px;
          }


          .ldms-overview-icon {
            width: 44px;
            height: 44px;

            font-size: 21px;
          }


          .ldms-overview-content h3 {
            font-size:
              calc(
                13px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-content p {
            font-size:
              calc(
                13px *
                var(--font-scale, 1)
              );
          }

        }



        /* =====================================================
           1024px SMALL LAPTOP / TABLET
        ===================================================== */

        @media (max-width: 1024px) {

          .ldms-overview-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }


          .ldms-overview-card:last-child {
            grid-column:
              1 / -1;
          }


          .ldms-overview-content p {
            max-width: 620px;
          }

        }



        /* =====================================================
           900px TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .ldms-overview {
            padding:
              22px
              0;
          }


          .ldms-overview-heading h2 {
            font-size:
              calc(
                19px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-grid {
            grid-template-columns:
              1fr;

            gap: 12px;
          }


          .ldms-overview-card:last-child {
            grid-column: auto;
          }


          .ldms-overview-card {
            min-height: auto;
          }


          .ldms-overview-content p {
            max-width: none;
          }

        }



        /* =====================================================
           600px MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .ldms-overview-container {
            width:
              calc(
                100% - 30px
              );
          }


          .ldms-overview-heading {
            gap: 9px;

            margin-bottom: 13px;
          }


          .ldms-overview-line {
            width: 18px;
          }


          .ldms-overview-heading h2 {
            font-size:
              calc(
                17px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-card {
            gap: 11px;

            padding:
              13px
              12px;
          }


          .ldms-overview-icon {
            width: 40px;
            height: 40px;

            font-size: 19px;
          }


          .ldms-overview-content h3 {
            font-size:
              calc(
                12.5px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-content p {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );

            line-height: 1.4;
          }

        }



        /* =====================================================
           400px SMALL MOBILE
        ===================================================== */

        @media (max-width: 400px) {

          .ldms-overview-container {
            width:
              calc(
                100% - 24px
              );
          }


          .ldms-overview-heading h2 {
            font-size:
              calc(
                16px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-card {
            gap: 10px;

            padding:
              12px
              10px;
          }


          .ldms-overview-icon {
            width: 36px;
            height: 36px;

            font-size: 17px;
          }


          .ldms-overview-content h3 {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );
          }


          .ldms-overview-content p {
            font-size:
              calc(
                11px *
                var(--font-scale, 1)
              );
          }

        }

      `}</style>

    </section>
  );
}