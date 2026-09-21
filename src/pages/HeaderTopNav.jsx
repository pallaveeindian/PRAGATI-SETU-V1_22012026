// src/components/layout/TopNavigation.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import nav_logo from "../assets/top_nav_banner.png";
import ps_banner from "../assets/top_nav_banner_ps.png";
import LoginButton from "../components/ui/LoginButton";
import Login from "../pages/Login";

export default function TopNavigation() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // NEW: State for Login Modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  const closeMenu = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  /* BODY SCROLL LOCK (Handles both mobile menu and login modal) */
  useEffect(() => {
    if (open || isLoginOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, isLoginOpen]);

  useEffect(() => {
    if (!open) setActiveDropdown(null);
  }, [open]);

  return (
    <>
      <nav className="home-topnav">
        <div className="topnav-inner">
          {/* DESKTOP LOGO */}
          <div className="topnav-left desktop-logo">
            <Link to="/">
              <img src={nav_logo} alt="Pragati Setu" className="nav-logo" />
            </Link>
          </div>

          {/* MOBILE LOGO */}
          <div className="topnav-left mobile-logo">
            <Link to="/">
              <img
                src={ps_banner}
                alt="Pragati Setu Banner"
                className="nav-logo-img"
              />
            </Link>
          </div>

          {/* HAMBURGER */}
          <div className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* OVERLAY */}
          <div
            className={`nav-overlay ${open ? "active" : ""}`}
            onClick={closeMenu}
          />

          {/* MENU */}
          <ul className={`topnav-menu ${open ? "open" : ""}`}>
            <li className="close-btn">
              <span onClick={closeMenu}>✕</span>
            </li>

            {/* ABOUT US */}
            <li
              className={`menu-item dropdown ${activeDropdown === "about" ? "active" : ""}`}
            >
              <span onClick={() => toggleDropdown("about")}>
                About Us <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <a
                    href="https://srlm.up.gov.in/en"
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeMenu}
                  >
                    UPSRLM
                  </a>
                </li>
                <li>
                  <Link to="/about-us" onClick={closeMenu}>
                    Our Mission
                  </Link>
                </li>
              </ul>
            </li>

            {/* OUR SERVICES */}
            <li
              className={`menu-item dropdown ${activeDropdown === "services" ? "active" : ""}`}
            >
              <span onClick={() => toggleDropdown("services")}>
                Our Services <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/upsrlm-planning/login" onClick={closeMenu}>
                    UP Aspirational Blocks Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/beneficiary-profiling" onClick={closeMenu}>
                    Beneficiary Profiling
                  </Link>
                </li>
                <li>
                  <Link to="/user-management" onClick={closeMenu}>
                    User Management
                  </Link>
                </li>
                <li>
                  <Link to="/training-management" onClick={closeMenu}>
                    Training Management (TMS)
                  </Link>
                </li>
                <li>
                  <Link to="/Lakhpati-Didi" onClick={closeMenu}>
                    Lakhpati Didi (LDMS)
                  </Link>
                </li>
                <li>
                  <Link to="/Enterprise-Tracking" onClick={closeMenu}>
                    Enterprise Tracking (SU-Sakhi)
                  </Link>
                </li>
                <li>
                  <Link to="/Monitoring-and-Anlytics" onClick={closeMenu}>
                    Monitoring and Analytics
                  </Link>
                </li>
              </ul>
            </li>

            {/* DASHBOARDS */}
            <li
              className={`menu-item dropdown ${activeDropdown === "dashboard" ? "active" : ""}`}
            >
              <span onClick={() => toggleDropdown("dashboard")}>
                Dashboards <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/" onClick={closeMenu}>
                    Pragati Setu
                  </Link>
                </li>
                <li>
                  <Link to="/Power-BI-Analytics" onClick={closeMenu}>
                    Power BI Analytics
                  </Link>
                </li>
              </ul>
            </li>

            {/* REPORT */}
            <li className="menu-item">
              <Link
                to="/Public-Reports"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Reports
              </Link>
            </li>

            {/* RESOURCE CENTRE */}
            <li
              className={`menu-item dropdown ${activeDropdown === "resource" ? "active" : ""}`}
            >
              <span onClick={() => toggleDropdown("resource")}>
                Resource Centre <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/User-Manual" onClick={closeMenu}>
                    User Manual
                  </Link>
                </li>
                <li>
                  <Link to="/Frequently-Asked-Questions" onClick={closeMenu}>
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link to="/What's-New" onClick={closeMenu}>
                    What's New
                  </Link>
                </li>
              </ul>
            </li>

            {/* LOGIN BUTTON */}
            <li>
              <LoginButton
                closeMenu={closeMenu}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            </li>
          </ul>
        </div>

        <style>{`
        .home-topnav,
        .home-topnav * {
            box-sizing: border-box;
        }

        /* Wrap the entire nav in a transparent container to hold the floating notch */
        .home-topnav {
            position: relative;
            z-index: 50;
            background: transparent;
            padding: 12px 0; /* Spacing above/below the notch */
        }

        /* THE FLOATING NOTCH / PILL */
        .topnav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 auto;
            width: 95%;
            max-width: 1400px;
            padding: 8px 32px;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 100px; /* Fully rounded borders */
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.03);
            border: 1px solid rgba(226, 232, 240, 0.8);
            transition: all 0.3s ease;
        }

        /* LEFT LOGO */
        .desktop-logo {
            display: block;
        }

        .mobile-logo {
            display: none;
        }

        .nav-logo {
            height: 52px;
            width: auto;
            transition: transform 0.3s ease;
        }

        .nav-logo:hover {
            transform: scale(1.02);
        }

        .nav-logo-img {
            height: 44px;
            width: auto;
            object-fit: contain;
        }

        /* MENU */
        .topnav-menu {
            list-style: none;
            display: flex;
            align-items: center;
            gap: 32px;
            margin: 0;
            padding: 0;
        }

        /* MENU ITEMS */
        .menu-item {
            position: relative;
            font-weight: 700;
            font-size: 14.5px;
            color: #1e293b;
            cursor: pointer;
            padding: 8px 0;
            transition: color 0.2s ease;
        }

        .menu-item:hover {
            color: #ea580c;
        }

        /* TEXT + ARROW */
        .menu-item span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .arrow {
            transition: transform 0.3s ease;
            font-size: 12px;
        }

        /* DROPDOWN */
        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(15px);
            background: #ffffff;
            border: 1px solid #f1f5f9;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
            min-width: 240px;
            opacity: 0;
            visibility: hidden;
            border-radius: 16px;
            padding: 8px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 100;
            list-style: none;
        }

        /* Subtle upward pointer arrow for dropdowns */
        .dropdown-menu::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-left: 1px solid #f1f5f9;
            border-top: 1px solid #f1f5f9;
        }

        .dropdown-menu li {
            border-radius: 8px;
            margin-bottom: 2px;
            transition: background 0.2s ease;
        }

        .dropdown-menu li:last-child {
            margin-bottom: 0;
        }

        .dropdown-menu li a {
            display: block;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            text-decoration: none;
            white-space: nowrap;
            transition: color 0.2s ease;
        }

        .dropdown-menu li:hover {
            background: #f8fafc;
        }

        .dropdown-menu li:hover a {
            color: #ea580c;
        }

        /* SHOW DROPDOWN */
        .menu-item:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(5px);
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

        /* HAMBURGER */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 4px;
        }

        .hamburger span {
            width: 24px;
            height: 3px;
            background: #0f172a;
            border-radius: 4px;
            transition: all 0.3s;
        }

        /* OVERLAY */
        .nav-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(4px);
            opacity: 0;
            visibility: hidden;
            transition: 0.3s;
            z-index: 999;
        }

        .nav-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* CLOSE BUTTON */
        .close-btn {
            display: none;
        }

        /* ================== MOBILE ================== */
        @media (max-width: 992px) {

            .home-topnav {
                padding: 10px 0;
            }

            .topnav-inner {
                width: 92%;
                padding: 8px 20px;
                border-radius: 30px; /* Slightly less rounded on mobile to save space */
            }

            .desktop-logo {
                display: none;
            }

            .mobile-logo {
                display: flex;
                align-items: center;
            }

            .hamburger {
                display: flex;
            }

            .topnav-menu {
                position: fixed;
                top: 0;
                right: -10px;
                width: 320px;
                max-width: 90%;
                height: 100vh;
                background: #ffffff;
                list-style: none;
                padding: 24px 20px;
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0;
                transform: translateX(100%);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                overflow-y: auto;
                z-index: 1000;
                border-radius: 24px 0 0 24px;
                box-shadow: -10px 0 40px rgba(0,0,0,0.1);
            }

            .topnav-menu.open {
                transform: translateX(0);
            }

            .close-btn {
                display: flex;
                align-self: flex-end;
                margin-bottom: 24px;
                font-size: 20px;
                font-weight: bold;
                color: #64748b;
                cursor: pointer;
                padding: 8px;
            }

            .menu-item {
                width: 100%;
                border-bottom: 1px solid #f1f5f9;
                font-size: 16px;
                padding: 0;
            }

            .menu-item>span,
            .menu-item>a {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 8px;
                width: 100%;
            }

            .dropdown-menu {
                position: static;
                transform: none;
                box-shadow: none;
                border: none;
                opacity: 1;
                visibility: visible;
                max-height: 0;
                padding: 0;
                border-radius: 0;
                transition: max-height 0.35s ease;
            }

            .dropdown-menu::before {
                display: none;
            }

            .menu-item.active .dropdown-menu {
                max-height: 600px;
                padding: 0 0 16px 16px;
            }

            .dropdown-menu li a {
                padding: 12px 8px;
                font-size: 15px;
                color: #475569;
                border-left: 2px solid transparent;
            }

            .dropdown-menu li a:hover {
                color: #ea580c;
                border-left: 2px solid #ea580c;
                background: transparent;
            }

            .menu-item:hover .dropdown-menu {
                transform: none;
            }
        }`}</style>
      </nav>

      {/* NEW: RENDER MODAL OUTSIDE NAV SO IT COVERS EVERYTHING */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}