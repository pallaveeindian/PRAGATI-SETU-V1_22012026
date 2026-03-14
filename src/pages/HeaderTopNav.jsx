// src/components/layout/TopNavigation.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import nav_logo from "../assets/top_nav_banner.png";
import ps_banner from "../assets/top_nav_banner_ps.png";
import LoginButton from "../components/ui/LoginButton";
// import './Pagescss/HeaderTopNav.css';
export default function TopNavigation() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  const closeMenu = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  /* BODY SCROLL LOCK */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

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
              <span>Report</span>
              <ul className="dropdown-menu single">
                <li>Coming Soon</li>
              </ul>
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
              <LoginButton onClick={closeMenu} />
            </li>
          </ul>
        </div>
        <style>{`.home-topnav,
.home-topnav * {
    box-sizing: border-box;
}

.home-topnav {
    background: #ffffff;
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

/* LEFT LOGO */
.desktop-logo {
    display: block;
}

.mobile-logo {
    display: none;
}

.nav-logo {
    height: 72px;
    width: auto;
}

.nav-logo-img {
    height: 60px;
    width: auto;
    object-fit: contain;
}

/* MENU */
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

/* HAMBURGER */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background: #0f172a;
}

/* OVERLAY */
.nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
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

/* LOGO CONTAINER (if multiple images) */
.logo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    text-decoration: none;
}

/* ================== MOBILE ================== */
@media (max-width: 992px) {

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
        top: 50px;
        right: -10px;
        width: 300px;
        max-width: 90%;
        height: 100vh;
        background: #fff;
        list-style: none;
        padding: 70px 10px 20px;
        margin: 0;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.35s ease;
        overflow-y: auto;
        z-index: 1000;
    }

    .topnav-menu.open {
        transform: translateX(0);
    }

    .menu-item {
        width: 100%;
        border-bottom: 1px solid #ddd;
    }

    .menu-item>span,
    .menu-item>a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        width: 100%;
    }

    .dropdown-menu {
        list-style: none;
        padding-left: 10px;
        margin: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .menu-item.active .dropdown-menu {
        max-height: 600px;
    }

    .close-btn {
        display: none;
    }
}`}</style>
      </nav>
    </>
  );
}
