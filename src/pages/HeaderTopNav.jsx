// src/pages/HeaderTopNavigation.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TopNavigation() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => setOpen(!open);

  const closeMenu = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  /* LOCK BODY SCROLL */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
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
          {" "}
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

        {/* LOGIN */}
        <li>
          <li className="menu-item">
            <Link to="/login" className="cta-login" onClick={closeMenu}>
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
        </li>
      </ul>

      <style>{`

/* GLOBAL RESET */
* {
  box-sizing: border-box;
}
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
#root {
  overflow-x: hidden;
}

/* HAMBURGER */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  z-index: 99;
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
  background: rgba(0,0,0,0.4);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 999;
}
.nav-overlay.active {
  opacity: 1;
  visibility: visible;
}

.close-btn{
visibility: hidden;
}
/* MOBILE STYLES */
@media (max-width: 992px) {

  /* Hamburger */
  .hamburger {
    display: flex;
  }

  /* Mobile menu panel */
  .topnav-menu {
    position: fixed;
    top: 50px;
    right: -10px;
    width: 300px;
    max-width: 90%;
    height: 100vh;
    background: #fff;
    list-style: none;
    padding: 70px 6px 20px 6px;
    margin: 0;
    display: flex; /* STACK MENU ITEMS VERTICALLY */
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.35s ease;
    overflow-y: auto;
    z-index: 1000;
  }

  .topnav-menu.open {
    transform: translateX(0);
  }

  /* Each top-level menu item full width, stacked */
  .menu-item {
    display: block; /* vertical stack */
    width: 100%;
    border-bottom: 1px solid #ddd; /* optional separator */
  }

  /* clickable span inside each menu item */
  .menu-item > span,
  .menu-item > a {
    display: flex;
    justify-content: space-between; /* keeps arrow on right */
    align-items: center;
    width: 100%;
    padding: 12px ;
    cursor: pointer;
  }

  /* Dropdown sub-menu items */
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

  .dropdown-menu li {
    display: block;
    padding: 6px 0;
  }

  .dropdown-menu a {
    text-decoration: none;
    color: #0f172a;
  }

  /* Login button */
  .cta-login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 15px;
    background: #0f172a;
    color: #fff;
    border-radius: 6px;
    text-decoration: none;
    margin-top: 15px;
  }
.close-btn{
 display: flex;
  align-items: flex-start
}
}

      `}</style>
    </>
  );
}
