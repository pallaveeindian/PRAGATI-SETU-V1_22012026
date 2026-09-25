// src/components/layout/TopNavigation.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import nav_logo from "../assets/top_nav_banner.png";
import ps_banner from "../assets/top_nav_banner_ps.png";
import LoginButton from "../components/ui/LoginButton";
import Login from "../pages/Login";

const NAV_ITEMS = [
  {
    type: "dropdown",
    key: "about",
    label: "About Us",
    items: [
      { label: "UPSRLM", href: "https://srlm.up.gov.in/en", external: true },
      { label: "Our Mission", to: "/about-us" },
    ],
  },
  {
    type: "dropdown",
    key: "services",
    label: "Our Services",
    items: [
      { label: "UP Aspirational Blocks Dashboard", to: "/upsrlm-planning/login" },
      { label: "Beneficiary Profiling", to: "/beneficiary-profiling" },
      { label: "User Management", to: "/user-management" },
      { label: "Training Management (TMS)", to: "/training-management" },
      { label: "Lakhpati Didi (LDMS)", to: "/Lakhpati-Didi" },
      { label: "Enterprise Tracking (SU-Sakhi)", to: "/Enterprise-Tracking" },
      { label: "Monitoring and Analytics", to: "/Monitoring-and-Anlytics" },
    ],
  },
  {
    type: "dropdown",
    key: "dashboard",
    label: "Dashboards",
    items: [
      { label: "Pragati Setu", to: "/" },
      { label: "Power BI Analytics", to: "/Power-BI-Analytics" },
    ],
  },
  { type: "link", label: "Reports", to: "/Public-Reports" },
  {
    type: "dropdown",
    key: "resource",
    label: "Resource Centre",
    items: [
      { label: "User Manual", to: "/User-Manual" },
      { label: "Frequently Asked Questions", to: "/Frequently-Asked-Questions" },
      { label: "What's New", to: "/What's-New" },
    ],
  },
];

export default function TopNavigation() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => {
    setOpen(false);
    setActiveDropdown(null);
  };
  const toggleDropdown = (menu) => setActiveDropdown((prev) => (prev === menu ? null : menu));

  // Body scroll lock covers both the mobile menu and the login modal
  useEffect(() => {
    document.body.style.overflow = open || isLoginOpen ? "hidden" : "auto";
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
          <div className="topnav-left desktop-logo">
            <Link to="/">
              <img src={nav_logo} alt="Pragati Setu" className="nav-logo" />
            </Link>
          </div>

          <div className="topnav-left mobile-logo">
            <Link to="/">
              <img src={ps_banner} alt="Pragati Setu Banner" className="nav-logo-img" />
            </Link>
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-overlay ${open ? "active" : ""}`} onClick={closeMenu} />

          <ul className={`topnav-menu ${open ? "open" : ""}`}>
            <li className="close-btn">
              <span onClick={closeMenu}>✕</span>
            </li>

            {NAV_ITEMS.map((item) =>
              item.type === "link" ? (
                <li className="menu-item" key={item.label}>
                  <Link to={item.to} style={{ textDecoration: "none", color: "inherit" }}>
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li
                  className={`menu-item dropdown ${activeDropdown === item.key ? "active" : ""}`}
                  key={item.key}
                >
                  <span onClick={() => toggleDropdown(item.key)}>
                    {item.label} <span className="arrow">▾</span>
                  </span>
                  <ul className="dropdown-menu">
                    {item.items.map((sub) => (
                      <li key={sub.label}>
                        {sub.external ? (
                          <a href={sub.href} target="_blank" rel="noreferrer" onClick={closeMenu}>
                            {sub.label}
                          </a>
                        ) : (
                          <Link to={sub.to} onClick={closeMenu}>
                            {sub.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            )}

            <li>
              <LoginButton closeMenu={closeMenu} onOpenLogin={() => setIsLoginOpen(true)} />
            </li>
          </ul>
        </div>

        <style>{`
          .home-topnav, .home-topnav * { box-sizing: border-box; }

          /* Wrap the entire nav in a transparent container to hold the floating notch */
          .home-topnav { position: relative; z-index: 50; background: transparent; padding: 12px 0; }

          /* THE FLOATING NOTCH / PILL */
          .topnav-inner { display: flex; align-items: center; justify-content: space-between; margin: 0 auto; width: 95%; max-width: 1400px; padding: 8px 32px; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 100px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.03); border: 1px solid rgba(226, 232, 240, 0.8); transition: all 0.3s ease; }

          .desktop-logo { display: block; }
          .mobile-logo { display: none; }
          .nav-logo { height: 68px; width: auto; transition: transform 0.3s ease; }
          .nav-logo:hover { transform: scale(1.02); }
          .nav-logo-img { height: 44px; width: auto; object-fit: contain; }

          .topnav-menu { list-style: none; display: flex; align-items: center; gap: 32px; margin: 0; padding: 0; }

          .menu-item { position: relative; font-weight: 700; font-size: 14.5px; color: #1e293b; cursor: pointer; padding: 8px 0; transition: color 0.2s ease; }
          .menu-item:hover { color: #ea580c; }
          .menu-item span { display: flex; align-items: center; gap: 6px; }
          .arrow { transition: transform 0.3s ease; font-size: 12px; }

          .dropdown-menu { position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(15px); background: #ffffff; border: 1px solid #f1f5f9; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1); min-width: 240px; opacity: 0; visibility: hidden; border-radius: 16px; padding: 8px; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); z-index: 100; list-style: none; }
          /* Subtle upward pointer arrow for dropdowns */
          .dropdown-menu::before { content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 12px; height: 12px; background: #ffffff; border-left: 1px solid #f1f5f9; border-top: 1px solid #f1f5f9; }
          .dropdown-menu li { border-radius: 8px; margin-bottom: 2px; transition: background 0.2s ease; }
          .dropdown-menu li:last-child { margin-bottom: 0; }
          .dropdown-menu li a { display: block; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #334155; text-decoration: none; white-space: nowrap; transition: color 0.2s ease; }
          .dropdown-menu li:hover { background: #f8fafc; }
          .dropdown-menu li:hover a { color: #ea580c; }
          .dropdown-menu a { text-decoration: none; color: #0f172a; }

          .menu-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(5px); }
          .menu-item:hover .arrow { transform: rotate(180deg); }

          .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
          .hamburger span { width: 24px; height: 3px; background: #0f172a; border-radius: 4px; transition: all 0.3s; }

          .nav-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); opacity: 0; visibility: hidden; transition: 0.3s; z-index: 999; }
          .nav-overlay.active { opacity: 1; visibility: visible; }

          .close-btn { display: none; }

          @media (min-width: 1400px) {
            .topnav-inner { max-width: 1400px; }
          }

          @media (max-width: 1200px) {
            .topnav-inner { width: 96%; padding: 8px 22px; }
            .topnav-menu { gap: 20px; }
            .menu-item { font-size: 13.5px; }
            .nav-logo { height: 48px; }
          }

          @media (max-width: 1024px) {
            .topnav-inner { width: 97%; padding: 7px 18px; }
            .topnav-menu { gap: 14px; }
            .menu-item { font-size: 12.5px; }
            .nav-logo { height: 44px; }
          }

          @media (max-width: 900px) {
            .home-topnav { padding: 10px 0; }
            .topnav-inner { width: 92%; padding: 8px 20px; border-radius: 30px; }
            .desktop-logo { display: none; }
            .mobile-logo { display: flex; align-items: center; }
            .hamburger { display: flex; }

            .topnav-menu {
              position: fixed; top: 0; right: 0;
              width: 320px; max-width: 90%; height: 100dvh;
              padding: 24px 20px; margin: 0;
              display: flex; flex-direction: column; align-items: flex-start; gap: 0;
              background: #ffffff;
              transform: translateX(calc(100% + 40px)); /* move completely outside screen */
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s;
              overflow-y: auto; overflow-x: hidden;
              z-index: 1000;
              border-radius: 24px 0 0 24px;
              box-shadow: none; visibility: hidden; pointer-events: none; /* hide everything while closed */
            }
            .topnav-menu.open { transform: translateX(0); visibility: visible; pointer-events: auto; box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15); }

            .close-btn { display: flex; align-self: flex-end; margin-bottom: 20px; padding: 8px; font-size: 20px; color: #64748b; cursor: pointer; }

            .menu-item { width: 100%; padding: 0; font-size: 15px; border-bottom: 1px solid #f1f5f9; }
            .menu-item > span, .menu-item > a { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 15px 8px; }

            .dropdown-menu { position: static; transform: none; width: 100%; min-width: 0; padding: 0; opacity: 1; visibility: visible; max-height: 0; overflow: hidden; border: none; border-radius: 0; box-shadow: none; transition: max-height 0.35s ease; }
            .dropdown-menu::before { display: none; }
            .menu-item.active .dropdown-menu { max-height: 600px; padding: 0 0 14px 16px; }
            .dropdown-menu li a { padding: 11px 8px; font-size: 14px; color: #475569; white-space: normal; }
            .menu-item:hover .dropdown-menu { transform: none; }
          }

          @media (max-width: 600px) {
            .topnav-inner { width: 94%; padding: 7px 15px; }
            .nav-logo-img { height: 38px; }
            .topnav-menu { width: 290px; padding: 20px 16px; }
            .menu-item { font-size: 14px; }
            .menu-item > span, .menu-item > a { padding: 13px 6px; }
            .dropdown-menu li a { font-size: 13px; padding: 10px 7px; }
          }

          @media (max-width: 400px) {
            .topnav-inner { width: 95%; padding: 6px 12px; }
            .nav-logo-img { height: 34px; }
            .hamburger span { width: 22px; height: 2.5px; }
            .topnav-menu { width: 270px; padding: 18px 14px; }
            .menu-item { font-size: 13px; }
            .menu-item > span, .menu-item > a { padding: 12px 5px; }
            .dropdown-menu li a { font-size: 12px; }
          }
        `}</style>
      </nav>

      {/* Login modal rendered outside nav so it covers everything */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
