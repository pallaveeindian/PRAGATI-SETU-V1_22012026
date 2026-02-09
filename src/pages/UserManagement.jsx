// src/pages/UserManagement.jsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ps_logo from "../assets/PS_TRANS.png";
import up_logo from "../assets/upgov_logo.jpg";
import nav_logo from "../assets/top_nav_banner.png";
import HeroLayout from "./HeroComponents/HeroLayout.jsx";
import Footer from "../components/layout/Footer.jsx";
import aboutImg from "../assets/remote-management-of-business-teamwork.jpeg";

export default function UserManagement() {
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
      <header className="gov-header">
        <div className="gov-header-inner">
          {/* LEFT : LOGO + TEXT */}
          <div className="gov-header-left">
            <img src={up_logo} alt="Government Logo" className="gov-logo" />
            <span className="gov-text">Government Of Uttar Pradesh</span>
          </div>

          {/* RIGHT : ACCESSIBILITY CONTROLS */}
          <div className="gov-header-right">
            <button onClick={() => setFontScale(0.9)}>A-</button>
            <button onClick={() => setFontScale(1)}>A</button>
            <button onClick={() => setFontScale(1.1)}>A+</button>

            <span className="divider">|</span>

            <button className="lang-btn">English</button>
            <span className="divider">|</span>
            <button className="lang-btn">हिंदी</button>
          </div>
        </div>
      </header>

      {/* ================= TOP NAV ================= */}
      <nav className="home-topnav">
        <div className="topnav-inner">
          {/* LEFT : PRAGATI SETU LOGO */}
          <div className="topnav-left">
            <Link to="/">
              <img src={nav_logo} alt="Pragati Setu" className="nav-logo" />
            </Link>
          </div>

          {/* RIGHT : MENUS */}
          <ul className="topnav-menu">
            {/* ABOUT US */}
            <li className="menu-item dropdown">
              <span>
                About Us <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <a
                    href="https://srlm.up.gov.in/en"
                    target="_blank"
                    rel="noreferrer"
                  >
                    UPSRLM
                  </a>
                </li>
                <li>
                  <Link to="/about-us">Our Mission</Link>
                </li>
              </ul>
            </li>

            {/* OUR SERVICES */}
            <li className="menu-item dropdown">
              <span>
                Our Services <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/beneficiary-profiling">Beneficiary Profiling</Link>
                </li>
                <li>
                  <Link to="/user-management">User Management</Link>
                </li>
                <li>
                  <Link to="/training-management">
                    Training Management (TMS)
                  </Link>
                </li>
                <li>
                  <Link to="/Lakhpati-Didi">Lakhpati Didi (LDMS)</Link>
                </li>

                <li>
                  <Link to="/Enterprise-Tracking">
                    Enterprise Tracking (SU-Sakhi)
                  </Link>
                </li>

                <li>
                  <Link to="/Monitoring-and-Anlytics">
                    Monitoring and Anlytics
                  </Link>
                </li>
              </ul>
            </li>

            {/* DASHBOARDS */}
            <li className="menu-item dropdown">
              <span>
                Dashboards <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/">Pragati Setu</Link>
                </li>
                <li>
                  <Link to="/Power-BI-Analytics">Power BI Analytics</Link>
                </li>
              </ul>
            </li>

            {/* REPORT */}
            <li className="menu-item">
              <span>Report</span>
              <ul className="dropdown-menu single">
                <li>Coming Soon</li>
              </ul>
            </li>

            {/* RESOURCE CENTRE */}
            <li className="menu-item dropdown">
              <span>
                Resource Centre <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/User-Manual">User Manual</Link>
                </li>
                <li>
                  <Link to="/Frequently-Asked-Questions">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link to="/What's-New">What's New</Link>
                </li>
              </ul>
            </li>

            {/* LOGIN BUTTON */}
            <li className="menu-item">
              <Link to="/login" className="cta-login">
                <span>LOGIN</span>
                <span className="arrow-wrap">
                  <svg width="52px" height="34px" viewBox="0 0 66 43">
                    <g fill="none">
                      <path
                        className="one"
                        d="M40.15 3.89L43.97.14 65.69 20.78c.39.39.39 1.02 0 1.41L43.97 42.86 40.15 39.11 56.99 21.86z"
                        fill="#fff"
                      />
                      <path
                        className="two"
                        d="M20.15 3.89L23.97.14 45.69 20.78c.39.39.39 1.02 0 1.41L23.97 42.86 20.15 39.11 36.99 21.86z"
                        fill="#fff"
                      />
                      <path
                        className="three"
                        d="M.15 3.89L3.97.14 25.69 20.78c.39.39.39 1.02 0 1.41L3.97 42.86.15 39.11 16.99 21.86z"
                        fill="#fff"
                      />
                    </g>
                  </svg>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="home-hero">
        <div className="about-section">
          <div className="about-left">
            <h1>User Management</h1>

            <p>
              User Management is a critical module of Pragati Setu that enables
              secure creation, modification, and monitoring of system users
              across different administrative levels. It ensures that only
              authorized individuals can access specific modules and data.
            </p>

            <p>
              The system is organized across multiple administrative units for
              effective governance. The Block Monitoring and Management Unit
              (BMMU) manages users at the block level, overseeing local
              activities and compliance. The Sub-District Monitoring and
              Management Unit (SMMU) coordinates users at the sub-district
              level, ensuring smooth operations between blocks and districts.
              The District Monitoring and Management Unit (DMMU) supervises
              district-wide operations, manages user roles, and ensures
              adherence to standardized procedures. Each user is assigned
              specific roles and permissions based on their responsibilities,
              enabling controlled access and streamlined workflow.
            </p>

            <p>
              This module strengthens governance transparency, prevents
              unauthorized access, and ensures efficient digital operations
              across all departments.
            </p>
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
                   }
                           /* ===== Root shell ===== */
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
                             margin-left: 350px; 
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
                             margin-right: 350px; 
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
                           .topnav-left {
                             margin-left: 38px;
                           }
                   
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
                             border-top: 2px solid #334155;
                           }
                         `}</style>
    </div>
  );
}
