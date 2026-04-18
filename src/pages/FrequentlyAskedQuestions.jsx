
// src/pages/FrequentlyAskedQuestions.jsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import aboutImg1 from "../assets/Fre-ask.jpeg";
import aboutImg2 from "../assets/Frequently-Asked.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import { useLang } from "./LanguageContext"; // ✅ ADD

export default function FrequentlyAskedQuestions() {

  const { lang } = useLang(); // ✅ USE LANGUAGE

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="home-shell">

      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* CONTENT */}
      <main className="home-hero">
        <div className="">
          <div className="about-left">

            <div>
              <div className="wrapperHeadding">
                <div className="textAlignH1">
                  <h1>
                    <span className="contrast-color-two">
                      {lang === "hi" ? "अक्सर पूछे जाने वाले" : "Frequently Asked"}
                    </span>
                    <span className="contrast-color-one">
                      {lang === "hi" ? " प्रश्न" : " Questions"}
                    </span>
                  </h1>

                  <p>
                    <strong>
                      {lang === "hi"
                        ? "अक्सर पूछे जाने वाले प्रश्न (FAQs) – प्रगति सेतु"
                        : "Frequently Asked Questions (FAQs) – Pragati Setu"}
                    </strong>
                  </p>
                </div>

                <div className="about-right">
                  <img src={aboutImg2} alt="FAQ Image 2" />
                </div>
              </div>
            </div>

            {/* ===== ROW 1 ===== */}
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi" ? "प्रगति सेतु क्या है?" : "What is Pragati Setu?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "प्रगति सेतु एक सरकारी-स्तरीय डिजिटल प्लेटफॉर्म है जिसे राज्य भर में स्वयं सहायता समूह (SHG) से संबंधित गतिविधियों को मजबूत करने और प्रबंधित करने के लिए बनाया गया है। यह ग्रामीण महिलाओं, SHG, सामुदायिक आधारित संगठनों (CBOs) और सरकारी प्रणालियों को संरचित डेटा और पारदर्शी कार्यप्रवाह के माध्यम से जोड़ने वाला एक डिजिटल सेतु है।"
                    : "Pragati Setu is a government-grade digital platform designed to strengthen and manage Self Help Group (SHG)–related activities across the state. It acts as a digital bridge connecting rural women, SHGs, Community-Based Organizations, and government systems through structured data and transparent workflows."}
                </p>
              </div>

              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "प्रगति सेतु का उद्देश्य क्या है?"
                      : "What is the purpose of Pragati Setu?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "प्रगति सेतु का उद्देश्य SHG महिलाओं के आजीविका-आधारित सशक्तिकरण को सक्षम बनाना है। यह लाभार्थी और उद्यम से संबंधित डेटा को एकत्रित करके, कौशल-आधारित रोजगार को बढ़ावा देकर, वित्तीय समावेशन को समर्थन देकर तथा सतत आजीविका निगरानी के माध्यम से सूचित निर्णय लेने और लक्षित हस्तक्षेप को संभव बनाता है।"
                    : "Pragati Setu aims to enable livelihood-based empowerment of SHG women by capturing beneficiary and enterprise data, supporting skill-based employment, financial inclusion, and continuous livelihood monitoring for informed decision-making and targeted interventions."}
                </p>
              </div>
            </div>

            {/* ===== ROW 2 ===== */}
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "प्रगति सेतु में किस प्रकार का डेटा संग्रहित किया जाता है?"
                      : "What kind of data is captured in Pragati Setu?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "यह प्लेटफॉर्म व्यापक डेटा एकत्रित करता है, जिसमें लाभार्थी प्रोफाइल, SHG और उद्यम से संबंधित विवरण, आजीविका गतिविधियाँ, कौशल मानचित्रण, प्रशिक्षण हस्तक्षेप, वित्तीय समावेशन की स्थिति और प्रगति संकेतक शामिल हैं, ताकि सतत आजीविका योजना को समर्थन मिल सके।"
                    : "The platform captures comprehensive data including beneficiary profiles, SHG and enterprise details, livelihood activities, skill mapping, training interventions, financial inclusion status, and progress indicators to support sustainable livelihood planning."}
                </p>
              </div>

              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "प्रगति सेतु का उपयोग कौन करता है?"
                      : "Who uses Pragati Setu?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "प्रगति सेतु का उपयोग फील्ड कार्यकर्ताओं, सामुदायिक आधारित संगठनों (CBOs) तथा ब्लॉक, जिला और राज्य स्तर के सरकारी अधिकारियों द्वारा आजीविका और सशक्तिकरण से जुड़ी पहलों की निगरानी, योजना निर्माण और क्रियान्वयन के लिए किया जाता है।"
                    : "Pragati Setu is used by field functionaries, Community-Based Organizations, and government officials at block, district, and state levels for monitoring, planning, and implementation of livelihood and empowerment initiatives."}
                </p>
              </div>
            </div>

            {/* ===== ROW 3 ===== */}
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "यह SHG महिलाओं को कैसे सशक्त बनाता है?"
                      : "How does Pragati Setu empower SHG women?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "आजीविका से संबंधित डेटा को व्यवस्थित और विश्लेषित करके, प्रगति सेतु लक्षित कौशल प्रशिक्षण, वित्तीय सेवाओं तक पहुंच, उद्यम समर्थन और निरंतर निगरानी को सक्षम बनाता है, जिससे SHG महिलाएं सतत आय अर्जन और आर्थिक आत्मनिर्भरता की ओर अग्रसर हो सकें।"
                    : "By organizing and analyzing livelihood data, Pragati Setu enables targeted skill training, access to financial services, enterprise support, and continuous monitoring, helping SHG women transition towards sustainable income generation and economic self-reliance."}
                </p>
              </div>

              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "डैशबोर्ड कैसे एक्सेस करें?"
                      : "How do I navigate to the dashboard?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "डैशबोर्ड तक पहुंचने के लिए, शीर्ष नेविगेशन बार में उपलब्ध लॉगिन बटन पर क्लिक करें। सफल प्रमाणीकरण के बाद, आपको आपके भूमिका-आधारित डैशबोर्ड पर पुनः निर्देशित कर दिया जाएगा।"
                    : "To access the dashboard, click on the Login button available in the top navigation bar. After successful authentication, you will be redirected to your role-based dashboard."}
                </p>
              </div>
            </div>

            {/* ===== ROW 4 ===== */}
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "क्या यह सुरक्षित है?"
                      : "Is Pragati Setu secure and reliable?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "प्रगति सेतु सरकारी-स्वीकृत सुरक्षा मानकों का पालन करता है और भूमिका-आधारित एक्सेस नियंत्रण, प्रमाणीकरण तंत्र तथा ऑडिट लॉग्स को लागू करता है, ताकि केवल अधिकृत उपयोगकर्ता ही जानकारी तक पहुंच सकें या उसे संशोधित कर सकें।"
                    : "Pragati Setu follows government-approved security standards and implements role-based access control, authentication mechanisms, and audit logs to ensure that only authorized users can access or modify information."}
                </p>
              </div>

              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "क्या यह मोबाइल पर चल सकता है?"
                      : "Can Pragati Setu be accessed on mobile phones?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "हाँ। प्रगति सेतु एक वेब-आधारित प्लेटफॉर्म है जिसे डेस्कटॉप, लैपटॉप, टैबलेट और स्मार्टफोन पर आधुनिक ब्राउज़रों के माध्यम से एक्सेस किया जा सकता है। बड़े डेटा एंट्री या प्रशासनिक कार्यों के लिए बेहतर उपयोगिता हेतु डेस्कटॉप का उपयोग करने की सलाह दी जाती है।"
                    : "Yes. Pragati Setu is a web-based platform accessible through modern browsers on desktops, laptops, tablets, and smartphones. For large data entry or administrative tasks, desktop access is recommended for better usability."}
                </p>
              </div>
            </div>

            {/* ===== ROW 5 ===== */}
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "डेटा कितनी बार अपडेट होता है?"
                      : "How frequently is data updated in Pragati Setu?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "डेटा लगभग रियल-टाइम में अपडेट होता है जब भी अधिकृत उपयोगकर्ता रिकॉर्ड दर्ज या संशोधित करते हैं। डैशबोर्ड और विश्लेषणात्मक रिपोर्ट सिस्टम में उपलब्ध नवीनतम सत्यापित जानकारी को स्वतः प्रतिबिंबित करते हैं।"
                    : "Data is updated in near real-time whenever authorized users enter or modify records. Dashboards and analytical reports automatically reflect the most recent validated information available in the system."}
                </p>
              </div>

              <div className="pragati-card">
                <p>
                  <strong>
                    {lang === "hi"
                      ? "क्या रिपोर्ट डाउनलोड कर सकते हैं?"
                      : "Can reports be downloaded or exported from Pragati Setu?"}
                  </strong>
                  <br />
                  {lang === "hi"
                    ? "हाँ। उपयोगकर्ता की भूमिकाओं और अनुमतियों के आधार पर, रिपोर्ट और डेटासेट को CSV या Excel जैसे प्रारूपों में निर्यात किया जा सकता है, जिसका उपयोग समीक्षा, ऑडिट, योजना निर्माण और आधिकारिक दस्तावेज़ीकरण के लिए किया जाता है।"
                    : <>Yes. Depending on user roles and permissions, reports and datasets can be exported in formats such as <strong>CSV</strong> or <strong>Excel</strong> for reviews, audits, planning exercises, and official documentation.</>}
                </p>
              </div>
            </div>

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
                    
                     gap: 40px;
                     
                   }
                   
                   .about-left h1 {
                     font-size: 38px;
                     font-weight: 800;
                     margin-bottom: 18px;
                     color: #0f172a;
                     text-align: left
                     
                   }
                   
                   .about-left p {
                     font-size: 17px;
                     line-height: 1.8;
                     color: #334155;
                     margin-bottom: 14px;
                   }
                   
.textAlignH1{
 display: flex;
  flex-direction: column;
  justify-content: center;   /* Y-axis center */
}
           


.about-right img {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  margin-top: 20px;
  border-radius: 16px;
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
                   
                           .contrast-color-one {
      color: #ff7a00;
  }

  .wrapper{
  display: flex ;
  justify-content: space-around;
  flex-wrap: wrap;
  }
   .wrapperHeadding {
  display: flex;
  justify-content: space-between;  
   max-width: 2100px;
  margin: 0 auto;
  padding: 0 20px;
  align-items: center;
  flex-wrap: wrap;
}
  .contrast-color-two {
      color: #0f172a;
  }
                      .pragati-card {
      max-width: 900px;
      margin: 40px auto;
      padding: 30px 35px;
      background: #ffffff;
      border: 2px solid #ff7a00;
      /* Orange Border */
      border-radius: 16px;
      box-shadow: 0 5px 5px rgba(255, 122, 0, 0.25);
      /* Orange Shadow */
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
                              @media (max-width: 992px) {
      .about-section {
          
          gap: 30px;
          padding-left: 5px;
          padding-right: 5px
      }

      .about-left h1 {
          font-size: 28px;
          text-align: center;
      }

      .about-left h3 {
          font-size: 20px;
      }

      .about-left p {
          font-size: 16px;
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
