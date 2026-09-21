// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import upsrlm_banner from "../assets/top_nav_banner_UPSRLM.png";
import ps_banner from "../assets/top_nav_banner_ps.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import GovHeader from "./GovHeader.jsx";
import NewsModal from "./newsModal.jsx";

export default function Home() {
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(true);

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

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 50,
          }}
        >
          <TopNavigation />
        </div>

        {/* ================= HERO SECTION ================= */}
        <main className="home-hero">
          <div className="hero-inner">
            <HeroLayout />
          </div>
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>
      {/* <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      /> */}

      {/* ================= STYLES ================= */}
      <style>{`
        /* ===== Root shell ===== */
        html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
        .home-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #ffffff;
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
  overflow-x: hidden;
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
          /* ================= MEDIA QUERIES (MOBILE) ================= */
@media (max-width: 768px) {
  
  
     .desktop-logo {
    display: none;
  }

  .mobile-logo {
    display: block;
  }
  
}
      `}</style>
    </div>
  );
}
