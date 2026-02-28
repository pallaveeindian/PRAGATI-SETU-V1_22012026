// // src/pages/BeneficiaryProfiling.jsx
// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import ps_logo from "../assets/PS_TRANS.png";
// import up_logo from "../assets/upgov_logo.jpg";
// import nav_logo from "../assets/top_nav_banner.png";
// import HeroLayout from "./HeroComponents/HeroLayout.jsx";
// import Footer from "../components/layout/Footer.jsx";
// import aboutImg from "../assets/Rural-Women-Entrepreneurs.jpeg";
// import TopNavigation from "./HeaderTopNav.jsx";
// import GovHeader from "./GovHeader.jsx";

// export default function BeneficiaryProfiling() {
//   /* ================= FONT SIZE CONTROLS ================= */
//   const setFontScale = (scale) => {
//     document.documentElement.style.setProperty("--font-scale", scale);
//   };

//   useEffect(() => {
//     // default font scale
//     setFontScale(1);
//   }, []);

//   return (
//     <div className="home-shell">
//       {/* ================= ACCESSIBILITY HEADER ================= */}

//       <GovHeader
//         logo={up_logo}
//         title="Government Of Uttar Pradesh"
//         onFontChange={setFontScale}
//       />
//       {/* ================= TOP NAV ================= */}
//       <TopNavigation />

//       <main className="page-main">
//         <div className="about-section">
//           {/* LEFT TEXT */}
//           <div className="about-left">
//             <h1><span className="contrast-color-two" >Beneficiary</span><span className="contrast-color-one"> Profiling</span></h1>
//             <div className="pragati-card">
//               <p>
//                 Beneficiary Profiling is a centralized digital management system
//                 designed to create a unified and reliable database of
//                 beneficiaries by integrating data from LokOS platforms and
//                 real-time field inputs. It eliminates fragmented Excel sheets,
//                 duplicate beneficiary records across modules, and manual
//                 reconciliation efforts by maintaining a normalized beneficiary
//                 master database.
//               </p>
//             </div>
//             <div className="pragati-card">
//               <p>
//                 The module enables secure API-based synchronization, automatically
//                 filters active Self-Help Groups (SHGs) and members, and provides a
//                 single comprehensive profile view for each beneficiary. Field
//                 officials can enrich records with socio-economic details, skills,
//                 income sources, and livelihood activities, ensuring accuracy and
//                 transparency across all government programs.
//               </p>
//             </div>
//             <div className="pragati-card">
//               <p>
//                 With jurisdiction-based role access, Block, District, and State
//                 authorities can monitor, validate, and analyze beneficiary data
//                 efficiently. Built on a secure web-based architecture, the system
//                 supports reporting, exports, bilingual accessibility, and
//                 compliance with national IT security standards. Overall,
//                 Beneficiary Profiling strengthens data accuracy, enhances
//                 decision-making, and ensures effective delivery of welfare schemes
//                 through a structured and scalable information system.
//               </p>
//             </div>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="about-right">
//             <img src={aboutImg} alt="Pragati Setu Diagram" />
//           </div>
//         </div>
//       </main>

//       {/* ================= FOOTER ================= */}
//       <footer className="home-footer">
//         <Footer />
//       </footer>

//       {/* ================= STYLES ================= */}
//       <style>{`
//                 /* ===== ABOUT LAYOUT ===== */
//           .about-section {
//             max-width: 1400px;
//             margin: 60px auto;
//             display: grid;
//             grid-template-columns: 1.1fr 0.9fr;
//             gap: 40px;
//             align-items: center;
//           }

//           .about-left h1 {
//             font-size: 38px;
//             font-weight: 800;
//             margin-bottom: 18px;
//             color: #0f172a;
//           }

//           .about-left p {
//             font-size: 17px;
//             line-height: 1.8;
//             color: #334155;
//             margin-bottom: 14px;
//           }

//           /* IMAGE SIZE FIX */
//           .about-right {
//             display: flex;
//             justify-content: center;
//           }

//           .about-right img {
//             width: 100%;
//             max-width: 780px;
//             height: auto;
//             object-fit: contain;
//             border-radius: 16px;
//           }
//             .contrast-color-one {
//       color: #ff7a00;
//   }

//   .contrast-color-two {
//       color: #0f172a;
//   }

//                   /* ===== Root shell ===== */
//                   .home-shell {
//                     display: flex;
//                     flex-direction: column;
//                     min-height: 100vh;
//                     background: linear-gradient(180deg,
//               #ffffff 0%,
//               #fff6f8 35%,
//               #f9e3e6 60%,
//               #f4cfd6 75%,
//               #ebb8c4 100%);

//                   }

//                   /* ================= GLOBAL FONT SCALING ================= */
//                   :root {
//                     --font-scale: 1;
//                   }

//                   body {
//                     font-size: calc(16px * var(--font-scale));

//                   }



//                   /* ===== HERO ===== */
//                   .home-hero {
//                     width: 100%;
//                     overflow-x: visible;
//                   }

//                   .hero-inner {
//                     width: 100%;
//                   }

//                   /* ===== FOOTER ===== */
//                   .home-footer {
//                     text-align: center;
//                     font-size: 28px;
//                     font-weight: 800;
//                   }

//                   .pragati-card {
//   max-width: 900px;
//   margin: 40px auto;
//   padding: 30px 35px;
//   background: #ffffff;
//   border: 2px solid #ff7a00;          /* Orange Border */
//   border-radius: 16px;
//   box-shadow: 0 5px 5px rgba(255, 122, 0, 0.25);
//   transition: all 0.3s ease;
// }

// .pragati-card p {
//   font-size: 18px;
//   line-height: 1.7;
//   color: #333;
//   margin: 0;
// }

// /* Hover Effect */
// .pragati-card:hover {
//   transform: translateY(-5px);
//    box-shadow: 0 2px 5px rgba(255, 122, 0, 0.35);
// }
// @media (max-width: 768px) {

//   .about-section {
//     display: flex;
//     flex-direction: column;
//     gap: 24px;
//     margin: 30px 20px;
//   }

//   .about-left {
//     order: 1;
//     text-align: center;
//   }

//   .about-right {
//     order: 2;
//   }

//   .about-left h1 {
//     font-size: 26px;
//   }

//   .about-left p {
//     font-size: 15px;
//   }

//   .about-right img {
//     max-width: 100%;
//   }
//       .pragati-card {
//     margin: 20px;
//     padding: 22px;
//   }

//   .pragati-card p {
//     font-size: 16px;
//   }
// }

// @media (max-width: 480px) {
//   .pragati-card {
//     padding: 18px;
//     border-radius: 12px;
//   }

//   .pragati-card p {
//     font-size: 15px;
//   }

// }

//                 `}</style>
//     </div>
//   );
// }



// src/pages/AboutPragatiSetu.jsx
import React, { useEffect } from "react";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import aboutImg from "../assets/Rural-Women-Entrepreneurs.jpeg";
import TopNavigation from "./HeaderTopNav.jsx";
import GovHeader from "./GovHeader.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function AboutPragatiSetu() {

  /* ================= FONT SIZE CONTROLS ================= */
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="home-shell">

      {/* ================= HEADER ================= */}
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      {/* ================= MAIN SECTION ================= */}
      <main className="page-main">
        <h1 className="about-left "><span className="contrast-color-two" >Beneficiary</span><span className="contrast-color-one"> Profiling</span></h1>
        <div className="about-section">

          {/* LEFT DIAGRAM */}
          <div className="about-left">
            <img src={aboutImg} alt="Pragati Setu Diagram" />
          </div>

          {/* RIGHT TOP CONTENT */}
          <div className="about-right">
            <div className="pragati-card">
              <p>
                Pragati Setu is a comprehensive digital governance platform designed to
                strengthen rural development initiatives under the State Rural Livelihood
                Mission. The platform connects government departments, field officials,
                and beneficiaries through a single integrated system to ensure transparency,
                efficiency, and accountability in service delivery.
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM CARDS */}
        <div className="bottom-section">

          <div className="pragati-card">
            <p>
              It enables real-time data collection, monitoring, and analytics for various
              welfare schemes and livelihood programs. By digitizing manual processes,
              Pragati Setu reduces delays, improves accuracy, and helps decision-makers
              track progress effectively across districts and villages.
            </p>
          </div>

          <div className="pragati-card">
            <p>
              Key features of Pragati Setu include Beneficiary Profiling, Lakhpati Didi
              Management, Training Management System (TMS), Enterprise Tracking,
              User Management, and Performance Dashboards.
            </p>
          </div>

        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`

        /* ===== ROOT ===== */
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
            .contrast-color-one {
      color: #ff7a00;
  }

  .contrast-color-two {
     color: #0f172a;
  }
.about-left  {
          font-size: 38px;
            font-weight: 800;
            margin-bottom: 18px;
            color: #0f172a;
          }
        :root {
          --font-scale: 1;
        }

        body {
          font-size: calc(16px * var(--font-scale));
        }

        /* ===== MAIN LAYOUT ===== */
        .about-section {
          max-width: 1400px;
          margin: 60px auto 40px auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .about-left {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .about-left img {
          width: 100%;
          max-width: 600px;
          height: auto;
          object-fit: contain;
          border-radius: 18px;
        }

        .about-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* ===== BOTTOM SECTION ===== */
        .bottom-section {
          max-width: 1400px;
          margin: 20px auto 80px auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        /* ===== CARD DESIGN ===== */
        .pragati-card {
          padding: 30px 35px;
          background: #ffffff;
          border: 2px solid #ff7a00;
          border-radius: 18px;
          box-shadow: 0 6px 12px rgba(255, 122, 0, 0.25);
          transition: all 0.3s ease;
        }

        .pragati-card p {
          font-size: 17px;
          line-height: 1.8;
          color: #334155;
          margin: 0;
        }

        .pragati-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 18px rgba(255, 122, 0, 0.35);
        }

        /* ===== FOOTER ===== */
        .home-footer {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 992px) {
          .about-section {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .bottom-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .about-section {
            margin: 30px 20px;
            gap: 30px;
          }

          .bottom-section {
            margin: 10px 20px 60px 20px;
            gap: 25px;
          }

          .pragati-card {
            padding: 22px;
          }

          .pragati-card p {
            font-size: 15px;
          }
        }

      `}</style>
    </div>
  );
}