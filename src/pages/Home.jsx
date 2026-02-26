// src/pages/Home.jsx
// APP RECEIEVED 04-02-2026
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import upsrlm_banner from "../assets/top_nav_banner_UPSRLM.png";
import ps_banner from "../assets/top_nav_banner_ps.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import GovHeader from "./GovtHeader.jsx";
export default function Home() {
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
      <nav className="home-topnav">
        <div className="topnav-inner">
          {/* LEFT : PRAGATI SETU LOGO */}

          {/* DESKTOP LOGO */}
          <div className="topnav-left desktop-logo">
            <Link to="/">
              <img src={nav_logo} alt="Pragati Setu" className="nav-logo" />
            </Link>
          </div>

          {/* MOBILE BANNER */}
          <div className="topnav-left mobile-logo">
            <Link to="/" className="logo-container">
              <img
                src={ps_banner}
                alt="Pragati Setu Banner"
                className="nav-logo-img"
              />
            </Link>
          </div>
          <TopNavigation />
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <main className="home-hero">
        <div className="hero-inner">
          <HeroLayout />
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <Footer />
      </footer>

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
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                }

                /* ================= GLOBAL FONT SCALING ================= */
                :root {
                  --font-scale: 1;
                }

                body {
                  font-size: calc(16px * var(--font-scale));
                }

                /* ================= GOV HEADER ================= */
                .gov-header {
                  background: #0f172a; /* #fd7301 */
                  color: #fff;
                  font-size: 14px;
                }

                .gov-header-inner {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 6px 16px;
                }

                /* LEFT */
                .gov-header-left {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-weight: 600;
                
                }

                .gov-logo {
                  height: 35px;
                  border-radius: 25px;
                  border: 2px solid #0f172a;
                  width: auto;
                }

                .gov-text {
                  font-size: 15px;
                }

                /* RIGHT */
                .gov-header-right {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  
                }

                .gov-header-right button {
                  background: transparent;
                  border: none;
                  color: #fff;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  padding: 2px 4px;
                }

                .gov-header-right button:hover {
                  text-decoration: underline;
                }

                .divider {
                  opacity: 0.7;
                  padding: 0 4px;
                }

                .lang-btn {
                  font-weight: 500;
                }

                /* ======= TOP NAV ======== */
                /* Default: Desktop */
        .desktop-logo {
          display: block;
        }

        .mobile-logo {
          display: none;
        }

                .home-topnav {
                  background: #ffffff;
                  border-bottom: none;                    
                  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15); 
                  position: relative;                     
                  z-index: 50;                            
                }

                .topnav-inner {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 2px 24px;
                }

                /* LEFT */
              

                .nav-logo {
                  height: 72px;
                }

                /* RIGHT MENU */
                .topnav-menu {
                  list-style: none;
                  display: flex;
                  align-items: center;
                  gap: 28px;
                  margin-right: 10px;
                  padding: 0;
                }

                /* MENU ITEMS */
                .menu-item {
                  position: relative;
                  font-weight: 600;
                  color: #0f172a;
                  cursor: pointer;
                }

                /* TEXT + ARROW */
                .menu-item span {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                }

                .arrow {
                  transition: transform 0.3s ease;
                }

                /* DROPDOWN */
                .dropdown-menu {
                  position: absolute;
                  top: 130%;
                  left: 0;
                  background: #ffffff;
                  border: 1px solid #e5e7eb;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                  min-width: 240px;
                  opacity: 0;
                  visibility: hidden;
                  transform: translateY(10px);
                  transition: all 0.25s ease;
                  z-index: 100;
                  list-style: none;     
                  padding-left: 0;             
                }

                .dropdown-menu li {
                  padding: 10px 14px;
                  font-size: 14px;
                  white-space: nowrap;
                }

                .dropdown-menu li:hover {
                  background: #f1f5f9;
                }

                .dropdown-menu li::marker {
                  content: none;
                }

                /* SHOW DROPDOWN */
                .menu-item:hover .dropdown-menu {
                  opacity: 1;
                  visibility: visible;
                  transform: translateY(0);
                }

                /* ARROW ROTATE */
                .menu-item:hover .arrow {
                  transform: rotate(180deg);
                }

                /* LINKS */
                .dropdown-menu a {
                  text-decoration: none;
                  color: #0f172a;
                }

                /* LOGIN BUTTON */
                .login-btn {
                  background: #0f172a;
                  color: #ffffff;
                  padding: 8px 18px;
                  border-radius: 4px;
                  text-decoration: none;
                  font-weight: 700;
                }

                .login-btn:hover {
                  opacity: 0.9;
                }

                .logo-container {
          display: flex;
          flex-direction: row; /*  Places images side-by-side */
          align-items: center;
          gap: 15px;
          text-decoration: none;
        }

        /*  NEW: Standardizes height for both images */
        .nav-logo-img {
          height: 60px; 
          width: auto;
          object-fit: contain;
        }
                /* ===== ANIMATED LOGIN CTA ===== */
                .cta-login {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  padding: 10px 22px;
                  background: #0f172a;
                  color: #fff;
                  font-weight: 800;
                  font-size: 14px;
                  text-decoration: none;
                  transform: skewX(-15deg);
                  box-shadow: 5px 5px 0 #000;
                  transition: all 0.4s ease;
                }

                .cta-login span {
                  transform: skewX(15deg);
                  display: inline-flex;
                  alignwrk-items: center;
                }

                .cta-login:hover {
                  box-shadow: 8px 8px 0 #fd7301;
                }

                .arrow-wrap {
                  transition: margin-right 0.4s ease;
                }

                .cta-login:hover .arrow-wrap {
                  margin-right: 18px;
                }

                /* SVG ARROWS */
                .cta-login path.one {
                  transform: translateX(-60%);
                  transition: 0.4s;
                }

                .cta-login path.two {
                  transform: translateX(-30%);
                  transition: 0.5s;
                }

                .cta-login:hover path.one,
                .cta-login:hover path.two {
                  transform: translateX(0);
                }

                .cta-login:hover path.one {
                  animation: arrowPulse 1s infinite 0.4s;
                }

                .cta-login:hover path.two {
                  animation: arrowPulse 1s infinite 0.2s;
                }

                .cta-login:hover path.three {
                  animation: arrowPulse 1s infinite;
                }

                /* COLOR PULSE */
                @keyframes arrowPulse {
                  0% { fill: #ffffff; }
                  50% { fill: #fd7301; }
                  100% { fill: #ffffff; }
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
                  border-top: 2px solid #334155;
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
