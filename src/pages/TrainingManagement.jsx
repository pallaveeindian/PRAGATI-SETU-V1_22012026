// src/pages/TrainingMangement.jsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/training-management.jpeg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
export default function TrainingManagement() {
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
        <div className="about-section">
          <div className="about-left">
            <h1>
              <span className="contrast-color-two">Training</span>
              <span className="contrast-color-one"> Management</span>
            </h1>
            <div className="pragati-card">
              <p>
                The <strong>Training Management System (TMS)</strong> is a
                role-based Management Information System designed to manage the
                complete lifecycle of trainings under <strong>UPSRLM</strong>.
                It supports creation and approval of training plans, training
                requests and batches, beneficiary and trainer management,
                registration of training centers, biometric eKYC and daily
                attendance tracking, processing of training payments, and
                training closure with report and certificate generation.
              </p>
            </div>
            <div className="pragati-card">
              <p>
                The system accommodates multiple roles, including{" "}
                <strong>BMMU</strong>, <strong>DMMU</strong>,{" "}
                <strong>SMMU</strong>, Training Partners, and Master Trainers,
                and integrates data from <strong>LokOS</strong>, SHG/Beneficiary
                databases, and state-level training frameworks. Roles and
                permissions are assigned based on responsibilities, ensuring
                controlled access and streamlined workflows.
              </p>
            </div>
            <div className="pragati-card">
              <p>
                By centralizing training operations, this module enhances
                governance transparency, prevents unauthorized access, and
                ensures efficient digital operations across all administrative
                levels.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="about-right">
            <img src={aboutImg} alt="Pragati Setu Diagram" />
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
                     display: grid;
                     grid-template-columns: 1.1fr 0.9fr;
                     gap: 40px;
                     align-items: center;
                   }
                   
                   .about-left h1 {
                     font-size: 38px;
                     font-weight: 800;
                     margin-bottom: 18px;
                     color: #0f172a;
                   }
                   
                   .about-left p {
                     font-size: 17px;
                     line-height: 1.8;
                     color: #334155;
                     margin-bottom: 14px;
                   }
                   
                   /* IMAGE SIZE FIX */
                   .about-right {
                     display: flex;
                     justify-content: center;
                   }
                   
                   .about-right img {
                     width: 100%;
                     max-width: 780px;
                     height: auto;
                     object-fit: contain;
                     border-radius: 16px;
                   }

                   .pragati-card {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px 35px;
  background: #ffffff;
  border: 2px solid #ff7a00;          /* Orange Border */
  border-radius: 16px;
    box-shadow: 0 5px 5px rgba(255, 122, 0, 0.25);
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
                             @media (max-width: 768px) {

  .about-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 30px 20px;
  }

  .about-left {
    order: 1;
    text-align: center;
  }

  .about-right {
    order: 2;
  }

  .about-left h1 {
    font-size: 26px;
  }

  .about-left p {
    font-size: 15px;
  }

  .about-right img {
    max-width: 100%;
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
