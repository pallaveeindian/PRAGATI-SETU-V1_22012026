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
export default function FrequentlyAskedQuestions() {
  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    // default font scale
    setFontScale(1);
  }, []);

  return (
    <div className="home-shell">
      {/* ================= ACCESSIBILITY HEADER ================= */}

      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      {/* ================= TOP NAV ================= */}
      <TopNavigation />

      {/* CONTENT */}
      <main className="home-hero">
        <div className="">
          <div className="about-left">
            <div>
              <div className="wrapperHeadding">
                <div className="textAlignH1">
                  <h1 ><span className="contrast-color-two">Frequently Asked</span><span className="contrast-color-one"> Questions</span></h1>
                  <p>
                    <strong>Frequently Asked Questions (FAQs) – Pragati Setu</strong>
                  </p>
                </div>

                <div className="about-right">
                  <img src={aboutImg2} alt="FAQ Image 2" />
                </div>
              </div>
            </div>

            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>What is Pragati Setu?</strong>
                  <br />
                  Pragati Setu is a government-grade digital platform designed to
                  strengthen and manage Self Help Group (SHG)–related activities
                  across the state. It acts as a digital bridge connecting rural
                  women, SHGs, Community-Based Organizations, and government systems
                  through structured data and transparent workflows.
                </p>
              </div>
              <div className="pragati-card">
                <p>
                  <strong>What is the purpose of Pragati Setu?</strong>
                  <br />
                  Pragati Setu aims to enable livelihood-based empowerment of SHG
                  women by capturing beneficiary and enterprise data, supporting
                  skill-based employment, financial inclusion, and continuous
                  livelihood monitoring for informed decision-making and targeted
                  interventions.
                </p>
              </div>
            </div>
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>What kind of data is captured in Pragati Setu?</strong>
                  <br />
                  The platform captures comprehensive data including beneficiary
                  profiles, SHG and enterprise details, livelihood activities, skill
                  mapping, training interventions, financial inclusion status, and
                  progress indicators to support sustainable livelihood planning.
                </p>
              </div>
              <div className="pragati-card">
                <p>
                  <strong>Who uses Pragati Setu?</strong>
                  <br />
                  Pragati Setu is used by field functionaries, Community-Based
                  Organizations, and government officials at block, district, and
                  state levels for monitoring, planning, and implementation of
                  livelihood and empowerment initiatives.
                </p>
              </div>
            </div>
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>How does Pragati Setu empower SHG women?</strong>
                  <br />
                  By organizing and analyzing livelihood data, Pragati Setu enables
                  targeted skill training, access to financial services, enterprise
                  support, and continuous monitoring, helping SHG women transition
                  towards sustainable income generation and economic self-reliance.
                </p>
              </div>
              <div className="pragati-card">
                <p>
                  <strong>How do I navigate to the dashboard?</strong>
                  <br />
                  To access the dashboard, click on the Login button available in
                  the top navigation bar. After successful authentication, you will
                  be redirected to your role-based dashboard.
                </p>
              </div>
            </div>
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>Is Pragati Setu secure and reliable?</strong>
                  <br />
                  Pragati Setu follows government-approved security standards and
                  implements role-based access control, authentication mechanisms,
                  and audit logs to ensure that only authorized users can access or
                  modify information.
                </p>
              </div>
              <div className="pragati-card">
                <p>
                  <strong>Can Pragati Setu be accessed on mobile phones?</strong>
                  <br />
                  Yes. Pragati Setu is a web-based platform accessible through
                  modern browsers on desktops, laptops, tablets, and smartphones.
                  For large data entry or administrative tasks, desktop access is
                  recommended for better usability.
                </p>
              </div>
            </div>
            <div className="wrapper">
              <div className="pragati-card">
                <p>
                  <strong>How frequently is data updated in Pragati Setu?</strong>
                  <br />
                  Data is updated in near real-time whenever authorized users enter
                  or modify records. Dashboards and analytical reports automatically
                  reflect the most recent validated information available in the
                  system.
                </p>
              </div>
              <div className="pragati-card">
                <p>
                  <strong>
                    Can reports be downloaded or exported from Pragati Setu?
                  </strong>
                  <br />
                  Yes. Depending on user roles and permissions, reports and datasets
                  can be exported in formats such as <strong>CSV</strong> or{" "}
                  <strong>Excel</strong> for reviews, audits, planning exercises,
                  and official documentation.
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
