// src/pages/FrequentlyAskedQuestions.jsx

import React, {
  useEffect,
  useState,
} from "react";

import up_logo from "../assets/upgov_logo.jpg";

/* NEW FAQ IMAGE WE CREATED */
import faqHero from "../assets/faq_hero.png";

import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";

import Footer from "../components/layout/Footer.jsx";

import { useLang } from "./LanguageContext";

import {
  FaFileAlt,
  FaBullseye,
  FaDatabase,
  FaUsers,
  FaShieldAlt,
  FaMobileAlt,
  FaSyncAlt,
  FaDownload,
  FaTachometerAlt,
  FaLock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";


/* =====================================================
   ICONS FOR FAQ ITEMS
===================================================== */

const FAQ_ICONS = [
  <FaFileAlt />,
  <FaBullseye />,
  <FaDatabase />,
  <FaUsers />,
  <FaShieldAlt />,
  <FaTachometerAlt />,
  <FaLock />,
  <FaMobileAlt />,
  <FaSyncAlt />,
  <FaDownload />,
];


export default function FrequentlyAskedQuestions() {

  const { lang } = useLang();

  const [openIndex, setOpenIndex] =
    useState(0);


  /* =====================================================
     FONT SIZE
  ===================================================== */

  const setFontScale = (scale) => {

    document.documentElement.style.setProperty(
      "--font-scale",
      scale
    );

  };


  useEffect(() => {

    setFontScale(1);

  }, []);



  /* =====================================================
     CONTENT
  ===================================================== */

  const content = {

    en: {

      eyebrow:
        "PRAGATI SETU",

      title1:
        "Frequently Asked",

      title2:
        " Questions",

      subtitle:
        "Frequently Asked Questions (FAQs) – Pragati Setu",

      faq: [

        {
          question:
            "What is Pragati Setu?",

          answer:
            "Pragati Setu is a government-grade digital platform designed to strengthen and manage Self Help Group (SHG)–related activities across the state. It acts as a digital bridge connecting rural women, SHGs, Community-Based Organizations, and government systems through structured data and transparent workflows.",
        },

        {
          question:
            "What is the purpose of Pragati Setu?",

          answer:
            "Pragati Setu aims to enable livelihood-based empowerment of SHG women by capturing beneficiary and enterprise data, supporting skill-based employment, financial inclusion, and continuous livelihood monitoring for informed decision-making and targeted interventions.",
        },

        {
          question:
            "What kind of data is captured in Pragati Setu?",

          answer:
            "The platform captures comprehensive data including beneficiary profiles, SHG and enterprise details, livelihood activities, skill mapping, training interventions, financial inclusion status, and progress indicators to support sustainable livelihood planning.",
        },

        {
          question:
            "Who uses Pragati Setu?",

          answer:
            "Pragati Setu is used by field functionaries, Community-Based Organizations, and government officials at block, district, and state levels for monitoring, planning, and implementation of livelihood and empowerment initiatives.",
        },

        {
          question:
            "How does Pragati Setu empower SHG women?",

          answer:
            "By organizing and analyzing livelihood data, Pragati Setu enables targeted skill training, access to financial services, enterprise support, and continuous monitoring, helping SHG women transition towards sustainable income generation and economic self-reliance.",
        },

        {
          question:
            "How do I navigate to the dashboard?",

          answer:
            "To access the dashboard, click on the Login button available in the top navigation bar. After successful authentication, you will be redirected to your role-based dashboard.",
        },

        {
          question:
            "Is Pragati Setu secure and reliable?",

          answer:
            "Pragati Setu follows government-approved security standards and implements role-based access control, authentication mechanisms, and audit logs to ensure that only authorized users can access or modify information.",
        },

        {
          question:
            "Can Pragati Setu be accessed on mobile phones?",

          answer:
            "Yes. Pragati Setu is a web-based platform accessible through modern browsers on desktops, laptops, tablets, and smartphones. For large data entry or administrative tasks, desktop access is recommended for better usability.",
        },

        {
          question:
            "How frequently is data updated in Pragati Setu?",

          answer:
            "Data is updated in near real-time whenever authorized users enter or modify records. Dashboards and analytical reports automatically reflect the most recent validated information available in the system.",
        },

        {
          question:
            "Can reports be downloaded or exported from Pragati Setu?",

          answer:
            "Yes. Depending on user roles and permissions, reports and datasets can be exported in formats such as CSV or Excel for reviews, audits, planning exercises, and official documentation.",
        },

      ],

    },


    hi: {

      eyebrow:
        "प्रगति सेतु",

      title1:
        "अक्सर पूछे जाने वाले",

      title2:
        " प्रश्न",

      subtitle:
        "अक्सर पूछे जाने वाले प्रश्न (FAQs) – प्रगति सेतु",

      faq: [

        {
          question:
            "प्रगति सेतु क्या है?",

          answer:
            "प्रगति सेतु एक सरकारी-स्तरीय डिजिटल प्लेटफॉर्म है जिसे राज्य भर में स्वयं सहायता समूह (SHG) से संबंधित गतिविधियों को मजबूत करने और प्रबंधित करने के लिए बनाया गया है। यह ग्रामीण महिलाओं, SHG, सामुदायिक आधारित संगठनों (CBOs) और सरकारी प्रणालियों को संरचित डेटा और पारदर्शी कार्यप्रवाह के माध्यम से जोड़ने वाला एक डिजिटल सेतु है।",
        },

        {
          question:
            "प्रगति सेतु का उद्देश्य क्या है?",

          answer:
            "प्रगति सेतु का उद्देश्य SHG महिलाओं के आजीविका-आधारित सशक्तिकरण को सक्षम बनाना है। यह लाभार्थी और उद्यम से संबंधित डेटा को एकत्रित करके, कौशल-आधारित रोजगार को बढ़ावा देकर, वित्तीय समावेशन को समर्थन देकर तथा सतत आजीविका निगरानी के माध्यम से सूचित निर्णय लेने और लक्षित हस्तक्षेप को संभव बनाता है।",
        },

        {
          question:
            "प्रगति सेतु में किस प्रकार का डेटा संग्रहित किया जाता है?",

          answer:
            "यह प्लेटफॉर्म व्यापक डेटा एकत्रित करता है, जिसमें लाभार्थी प्रोफाइल, SHG और उद्यम से संबंधित विवरण, आजीविका गतिविधियाँ, कौशल मानचित्रण, प्रशिक्षण हस्तक्षेप, वित्तीय समावेशन की स्थिति और प्रगति संकेतक शामिल हैं, ताकि सतत आजीविका योजना को समर्थन मिल सके।",
        },

        {
          question:
            "प्रगति सेतु का उपयोग कौन करता है?",

          answer:
            "प्रगति सेतु का उपयोग फील्ड कार्यकर्ताओं, सामुदायिक आधारित संगठनों (CBOs) तथा ब्लॉक, जिला और राज्य स्तर के सरकारी अधिकारियों द्वारा आजीविका और सशक्तिकरण से जुड़ी पहलों की निगरानी, योजना निर्माण और क्रियान्वयन के लिए किया जाता है।",
        },

        {
          question:
            "यह SHG महिलाओं को कैसे सशक्त बनाता है?",

          answer:
            "आजीविका से संबंधित डेटा को व्यवस्थित और विश्लेषित करके, प्रगति सेतु लक्षित कौशल प्रशिक्षण, वित्तीय सेवाओं तक पहुंच, उद्यम समर्थन और निरंतर निगरानी को सक्षम बनाता है, जिससे SHG महिलाएं सतत आय अर्जन और आर्थिक आत्मनिर्भरता की ओर अग्रसर हो सकें।",
        },

        {
          question:
            "डैशबोर्ड कैसे एक्सेस करें?",

          answer:
            "डैशबोर्ड तक पहुंचने के लिए, शीर्ष नेविगेशन बार में उपलब्ध लॉगिन बटन पर क्लिक करें। सफल प्रमाणीकरण के बाद, आपको आपके भूमिका-आधारित डैशबोर्ड पर पुनः निर्देशित कर दिया जाएगा।",
        },

        {
          question:
            "क्या यह सुरक्षित है?",

          answer:
            "प्रगति सेतु सरकारी-स्वीकृत सुरक्षा मानकों का पालन करता है और भूमिका-आधारित एक्सेस नियंत्रण, प्रमाणीकरण तंत्र तथा ऑडिट लॉग्स को लागू करता है, ताकि केवल अधिकृत उपयोगकर्ता ही जानकारी तक पहुंच सकें या उसे संशोधित कर सकें।",
        },

        {
          question:
            "क्या यह मोबाइल पर चल सकता है?",

          answer:
            "हाँ। प्रगति सेतु एक वेब-आधारित प्लेटफॉर्म है जिसे डेस्कटॉप, लैपटॉप, टैबलेट और स्मार्टफोन पर आधुनिक ब्राउज़रों के माध्यम से एक्सेस किया जा सकता है। बड़े डेटा एंट्री या प्रशासनिक कार्यों के लिए बेहतर उपयोगिता हेतु डेस्कटॉप का उपयोग करने की सलाह दी जाती है।",
        },

        {
          question:
            "डेटा कितनी बार अपडेट होता है?",

          answer:
            "डेटा लगभग रियल-टाइम में अपडेट होता है जब भी अधिकृत उपयोगकर्ता रिकॉर्ड दर्ज या संशोधित करते हैं। डैशबोर्ड और विश्लेषणात्मक रिपोर्ट सिस्टम में उपलब्ध नवीनतम सत्यापित जानकारी को स्वतः प्रतिबिंबित करते हैं।",
        },

        {
          question:
            "क्या रिपोर्ट डाउनलोड कर सकते हैं?",

          answer:
            "हाँ। उपयोगकर्ता की भूमिकाओं और अनुमतियों के आधार पर, रिपोर्ट और डेटासेट को CSV या Excel जैसे प्रारूपों में निर्यात किया जा सकता है, जिसका उपयोग समीक्षा, ऑडिट, योजना निर्माण और आधिकारिक दस्तावेज़ीकरण के लिए किया जाता है।",
        },

      ],

    },

  };


  const t =
    content[lang] || content.en;



  /* =====================================================
     ACCORDION
  ===================================================== */

  const toggleFAQ = (index) => {

    setOpenIndex((current) =>
      current === index
        ? -1
        : index
    );

  };



  return (

    <div className="faq-page">


      {/* =====================================================
          GOVERNMENT HEADER
      ===================================================== */}

      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />



      {/* =====================================================
          TOP LOGO / LOGIN
      ===================================================== */}

      <TopNavigation />



      {/* =====================================================
          MAIN MENU
      ===================================================== */}

      <HeaderTopMenu />



      {/* =====================================================
          HEADLINE
      ===================================================== */}

      <HeaderTopHeadline />



      {/* =====================================================
          FAQ PAGE
      ===================================================== */}

      <main className="faq-main">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="faq-hero">


          {/* DECORATIVE WAVES */}

          <div className="faq-wave faq-wave-left"></div>

          <div className="faq-wave faq-wave-right"></div>


          {/* DOTS */}

          <div className="faq-dots faq-dots-one"></div>

          <div className="faq-dots faq-dots-two"></div>



          <div className="faq-hero-inner">


            {/* =============================================
                LEFT
            ============================================= */}

            <div className="faq-hero-content">


              <div className="faq-eyebrow">

                <span>
                  {t.eyebrow}
                </span>

                <span className="faq-eyebrow-line"></span>

              </div>



              <h1>

                <span className="faq-title-blue">

                  {t.title1}

                </span>


                <span className="faq-title-orange">

                  {t.title2}

                </span>

              </h1>



              <p>

                {t.subtitle}

              </p>


            </div>



            {/* =============================================
                RIGHT IMAGE
            ============================================= */}

            <div className="faq-hero-image">

              <img
                src={faqHero}
                alt="Pragati Setu FAQ"
              />

            </div>


          </div>

        </section>



        {/* =================================================
            FAQ ACCORDION
        ================================================= */}

        <section className="faq-content-section">


          <div className="faq-content-inner">


            {t.faq.map((item, index) => {

              const isOpen =
                openIndex === index;


              return (

                <article
                  className={`faq-card ${
                    isOpen
                      ? "faq-card-open"
                      : ""
                  }`}
                  key={index}
                >


                  {/* =======================================
                      QUESTION BUTTON
                  ======================================= */}

                  <button
                    type="button"
                    className="faq-question"
                    onClick={() =>
                      toggleFAQ(index)
                    }
                    aria-expanded={isOpen}
                  >


                    {/* ICON */}

                    <span className="faq-item-icon">

                      {FAQ_ICONS[index]}

                    </span>



                    {/* QUESTION */}

                    <span className="faq-question-text">

                      {item.question}

                    </span>



                    {/* ARROW */}

                    <span
                      className={`faq-toggle-icon ${
                        isOpen
                          ? "active"
                          : ""
                      }`}
                    >

                      {isOpen ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}

                    </span>


                  </button>



                  {/* =======================================
                      ANSWER
                  ======================================= */}

                  <div
                    className={`faq-answer-wrapper ${
                      isOpen
                        ? "open"
                        : ""
                    }`}
                  >

                    <div className="faq-answer">

                      <p>
                        {item.answer}
                      </p>

                    </div>

                  </div>


                </article>

              );

            })}


          </div>

        </section>


      </main>



      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="faq-footer">

        <Footer />

      </footer>



      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           RESET
        ===================================================== */

        .faq-page,
        .faq-page * {
          box-sizing: border-box;
        }


        :root {
          --font-scale: 1;
        }


        .faq-page {
          width: 100%;

          min-height: 100vh;

          overflow-x: hidden;

          background: #fff8f5;
        }



        /* =====================================================
           MAIN
        ===================================================== */

        .faq-main {
          position: relative;

          width: 100%;

          overflow: hidden;

          background:
            linear-gradient(
              180deg,
              #fffaf7 0%,
              #fff5f0 45%,
              #fde9e7 100%
            );
        }



        /* =====================================================
           HERO
        ===================================================== */

        .faq-hero {
          position: relative;

          width: 100%;

          min-height: 225px;

          overflow: hidden;

          background:
            linear-gradient(
              110deg,
              #fffdfb 0%,
              #fff4ec 55%,
              #ffe8dc 100%
            );
        }


        .faq-hero-inner {
          position: relative;

          z-index: 3;

          width: 80%;

          max-width: 1250px;

          min-height: 225px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            55%
            45%;

          align-items: center;

          gap: 35px;
        }



        /* =====================================================
           HERO CONTENT
        ===================================================== */

        .faq-hero-content {
          position: relative;

          z-index: 4;
        }


        .faq-eyebrow {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-bottom: 12px;

          color: #ff5b0b;

          font-size:
            calc(
              13px *
              var(--font-scale, 1)
            );

          font-weight: 900;

          letter-spacing: 2px;
        }


        .faq-eyebrow-line {
          width: 84px;

          height: 2px;

          background: #ff5b0b;
        }


        .faq-hero-content h1 {
          margin:
            0
            0
            9px;

          font-size:
            calc(
              48px *
              var(--font-scale, 1)
            );

          line-height: 1.05;

          font-weight: 900;
        }


        .faq-title-blue {
          color: #07275d;
        }


        .faq-title-orange {
          color: #ff5b0b;
        }


        .faq-hero-content p {
          margin: 0;

          color: #526886;

          font-size:
            calc(
              16px *
              var(--font-scale, 1)
            );

          font-weight: 600;

          line-height: 1.5;
        }



        /* =====================================================
           HERO IMAGE
        ===================================================== */

        .faq-hero-image {
          position: relative;

          min-height: 210px;

          display: flex;

          align-items: flex-end;

          justify-content: center;
        }


        .faq-hero-image img {
          display: block;

          width: 100%;

          max-width: 500px;

          max-height: 215px;

          object-fit: contain;

          object-position: center bottom;

          filter:
            drop-shadow(
              0
              10px
              14px
              rgba(
                34,
                60,
                93,
                0.12
              )
            );
        }



        /* =====================================================
           BACKGROUND WAVES
        ===================================================== */

        .faq-wave {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;
        }


        .faq-wave-left {
          width: 650px;
          height: 250px;

          left: -330px;
          bottom: -140px;

          border:
            52px solid
            rgba(
              255,
              166,
              110,
              0.13
            );

          transform:
            rotate(10deg);
        }


        .faq-wave-right {
          width: 630px;
          height: 280px;

          right: -290px;
          top: -180px;

          border:
            55px solid
            rgba(
              255,
              166,
              110,
              0.12
            );

          transform:
            rotate(-8deg);
        }



        /* =====================================================
           DOT PATTERN
        ===================================================== */

        .faq-dots {
          position: absolute;

          width: 140px;
          height: 100px;

          opacity: 0.30;

          background-image:
            radial-gradient(
              #ff9a63 2px,
              transparent 2px
            );

          background-size:
            14px
            14px;
        }


        .faq-dots-one {
          left: 7%;

          top: 22px;
        }


        .faq-dots-two {
          right: 4%;

          bottom: 5px;
        }



        /* =====================================================
           FAQ CONTENT SECTION
        ===================================================== */

        .faq-content-section {
          position: relative;

          width: 100%;

          padding:
            0
            20px
            65px;

          margin-top: -5px;
        }


        .faq-content-inner {
          position: relative;

          z-index: 5;

          width: 80%;

          max-width: 1250px;

          margin: 0 auto;

          padding:
            15px
            24px
            26px;

          background:
            rgba(
              255,
              255,
              255,
              0.70
            );

          border:
            1px solid
            rgba(
              244,
              224,
              211,
              0.75
            );

          border-radius: 22px;

          box-shadow:
            0
            12px
            35px
            rgba(
              108,
              67,
              43,
              0.08
            );
        }



        /* =====================================================
           FAQ CARD
        ===================================================== */

        .faq-card {
          width: 100%;

          margin-bottom: 12px;

          overflow: hidden;

          background:
            rgba(
              255,
              255,
              255,
              0.97
            );

          border:
            1px solid
            #f0e4dc;

          border-radius: 14px;

          box-shadow:
            0
            5px
            15px
            rgba(
              56,
              46,
              38,
              0.05
            );

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }


        .faq-card:last-child {
          margin-bottom: 0;
        }


        .faq-card:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0
            8px
            20px
            rgba(
              56,
              46,
              38,
              0.09
            );
        }


        .faq-card-open {
          border:
            1.5px solid
            #ff6a00;

          box-shadow:
            0
            7px
            20px
            rgba(
              255,
              106,
              0,
              0.13
            );
        }



        /* =====================================================
           QUESTION
        ===================================================== */

        .faq-question {
          width: 100%;

          min-height: 78px;

          display: grid;

          grid-template-columns:
            72px
            1fr
            55px;

          align-items: center;

          gap: 18px;

          padding:
            10px
            16px
            10px
            12px;

          border: none;

          background: transparent;

          font-family: inherit;

          text-align: left;

          cursor: pointer;
        }



        /* =====================================================
           FAQ ITEM ICON
        ===================================================== */

        .faq-item-icon {
          width: 58px;
          height: 58px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #fff5ee,
              #ffe4d3
            );

          color: #ff5b0b;

          font-size: 25px;

          transition:
            0.25s ease;
        }


        .faq-card-open
        .faq-item-icon {
          background:
            linear-gradient(
              135deg,
              #ff8a31,
              #ff5b0b
            );

          color: #ffffff;
        }



        /* =====================================================
           QUESTION TEXT
        ===================================================== */

        .faq-question-text {
          color: #07275d;

          font-size:
            calc(
              17px *
              var(--font-scale, 1)
            );

          font-weight: 900;

          line-height: 1.35;
        }



        /* =====================================================
           TOGGLE
        ===================================================== */

        .faq-toggle-icon {
          width: 36px;
          height: 36px;

          display: flex;

          align-items: center;
          justify-content: center;

          justify-self: end;

          border:
            2px solid
            #ff6900;

          border-radius: 50%;

          background: #ffffff;

          color: #ff6900;

          font-size: 15px;

          transition:
            0.25s ease;
        }


        .faq-toggle-icon.active {
          background: #ff6900;

          color: #ffffff;
        }



        /* =====================================================
           ANSWER ANIMATION
        ===================================================== */

        .faq-answer-wrapper {
          max-height: 0;

          overflow: hidden;

          opacity: 0;

          transition:
            max-height 0.35s ease,
            opacity 0.25s ease;
        }


        .faq-answer-wrapper.open {
          max-height: 350px;

          opacity: 1;
        }


        .faq-answer {
          padding:
            0
            90px
            18px
            102px;
        }


        .faq-answer p {
          margin: 0;

          color: #52647e;

          font-size:
            calc(
              14px *
              var(--font-scale, 1)
            );

          font-weight: 500;

          line-height: 1.65;
        }



        /* =====================================================
           FOOTER
        ===================================================== */

        .faq-footer {
          width: 100%;

          margin: 0;

          padding: 0;
        }



        /* =====================================================
           1400+
        ===================================================== */

        @media (min-width: 1400px) {

          .faq-hero-inner,
          .faq-content-inner {
            max-width: 1350px;
          }


          .faq-hero-content h1 {
            font-size:
              calc(
                52px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-image img {
            max-width: 540px;
          }


          .faq-question {
            min-height: 82px;
          }


          .faq-question-text {
            font-size:
              calc(
                18px *
                var(--font-scale, 1)
              );
          }

        }



        /* =====================================================
           1200
        ===================================================== */

        @media (max-width: 1200px) {

          .faq-hero-inner,
          .faq-content-inner {
            width: 88%;
          }


          .faq-hero-inner {
            grid-template-columns:
              58%
              42%;
          }


          .faq-hero-content h1 {
            font-size:
              calc(
                43px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-image img {
            max-width: 430px;

            max-height: 200px;
          }

        }



        /* =====================================================
           1024
        ===================================================== */

        @media (max-width: 1024px) {

          .faq-hero-inner,
          .faq-content-inner {
            width: 92%;
          }


          .faq-hero-content h1 {
            font-size:
              calc(
                38px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-content p {
            font-size:
              calc(
                14px *
                var(--font-scale, 1)
              );
          }


          .faq-question {
            grid-template-columns:
              62px
              1fr
              46px;

            gap: 13px;
          }


          .faq-item-icon {
            width: 52px;
            height: 52px;

            font-size: 22px;
          }


          .faq-question-text {
            font-size:
              calc(
                15px *
                var(--font-scale, 1)
              );
          }


          .faq-answer {
            padding-left: 87px;
            padding-right: 70px;
          }

        }



        /* =====================================================
           900 TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .faq-hero {
            padding:
              30px
              0
              12px;
          }


          .faq-hero-inner {
            grid-template-columns: 1fr;

            gap: 15px;

            text-align: center;
          }


          .faq-eyebrow {
            justify-content: center;
          }


          .faq-hero-image {
            min-height: 150px;
          }


          .faq-hero-image img {
            max-width: 480px;

            max-height: 165px;
          }


          .faq-content-section {
            margin-top: 0;
          }


          .faq-content-inner {
            width:
              calc(
                100% - 35px
              );
          }

        }



        /* =====================================================
           600 MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .faq-hero {
            padding-top: 25px;
          }


          .faq-hero-inner {
            width:
              calc(
                100% - 28px
              );
          }


          .faq-eyebrow {
            font-size:
              calc(
                10px *
                var(--font-scale, 1)
              );

            letter-spacing: 1.2px;
          }


          .faq-eyebrow-line {
            width: 45px;
          }


          .faq-hero-content h1 {
            font-size:
              calc(
                32px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-content p {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-image {
            min-height: 125px;
          }


          .faq-hero-image img {
            max-height: 130px;
          }


          .faq-content-section {
            padding:
              0
              10px
              40px;
          }


          .faq-content-inner {
            width: 100%;

            padding:
              10px
              8px
              15px;

            border-radius: 15px;
          }


          .faq-card {
            margin-bottom: 10px;

            border-radius: 12px;
          }


          .faq-question {
            min-height: 68px;

            grid-template-columns:
              46px
              1fr
              36px;

            gap: 9px;

            padding:
              9px
              10px;
          }


          .faq-item-icon {
            width: 42px;
            height: 42px;

            font-size: 18px;
          }


          .faq-question-text {
            font-size:
              calc(
                13px *
                var(--font-scale, 1)
              );
          }


          .faq-toggle-icon {
            width: 32px;
            height: 32px;

            font-size: 12px;
          }


          .faq-answer {
            padding:
              0
              15px
              15px
              65px;
          }


          .faq-answer p {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );

            line-height: 1.55;
          }

        }



        /* =====================================================
           400 SMALL MOBILE
        ===================================================== */

        @media (max-width: 400px) {

          .faq-hero-inner {
            width:
              calc(
                100% - 18px
              );
          }


          .faq-hero-content h1 {
            font-size:
              calc(
                27px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-content p {
            font-size:
              calc(
                11px *
                var(--font-scale, 1)
              );
          }


          .faq-hero-image img {
            max-height: 110px;
          }


          .faq-question {
            grid-template-columns:
              40px
              1fr
              30px;

            gap: 7px;

            padding:
              8px;
          }


          .faq-item-icon {
            width: 38px;
            height: 38px;

            font-size: 16px;
          }


          .faq-question-text {
            font-size:
              calc(
                12px *
                var(--font-scale, 1)
              );
          }


          .faq-toggle-icon {
            width: 28px;
            height: 28px;
          }


          .faq-answer {
            padding:
              0
              10px
              13px
              55px;
          }


          .faq-answer p {
            font-size:
              calc(
                11px *
                var(--font-scale, 1)
              );
          }

        }

      `}</style>


    </div>

  );

}