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
        <h1 className="about-left ">
          <span className="contrast-color-two">Beneficiary</span>
          <span className="contrast-color-one"> Profiling</span>
        </h1>
        <div className="about-section">
          {/* LEFT DIAGRAM */}
          <div className="about-left">
            <img src={aboutImg} alt="Pragati Setu Diagram" />
          </div>

          {/* RIGHT TOP CONTENT */}
          <div className="about-right">
            <div className="pragati-card">
              <p>
                Pragati Setu is a comprehensive digital governance platform
                designed to strengthen rural development initiatives under the
                State Rural Livelihood Mission. The platform connects government
                departments, field officials, and beneficiaries through a single
                integrated system to ensure transparency, efficiency, and
                accountability in service delivery.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM CARDS */}
        <div className="bottom-section">
          <div className="pragati-card">
            <p>
              It enables real-time data collection, monitoring, and analytics
              for various welfare schemes and livelihood programs. By digitizing
              manual processes, Pragati Setu reduces delays, improves accuracy,
              and helps decision-makers track progress effectively across
              districts and villages.
            </p>
          </div>

          <div className="pragati-card">
            <p>
              Key features of Pragati Setu include Beneficiary Profiling,
              Lakhpati Didi Management, Training Management System (TMS),
              Enterprise Tracking, User Management, and Performance Dashboards.
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
