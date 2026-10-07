import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { LanguageContext } from "./LanguageContext.jsx";

const NAV_ITEMS = [
  { type: "link", key: "home", label: { en: "Home", hi: "होम" }, to: "/" },
  {
    type: "dropdown",
    key: "about",
    label: { en: "About Us", hi: "हमारे बारे में" },
    items: [
      {
        key: "upsrlm",
        label: { en: "UPSRLM", hi: "UPSRLM" },
        href: "https://srlm.up.gov.in/en",
        external: true,
      },
      {
        key: "mission",
        label: { en: "Our Mission", hi: "हमारा मिशन" },
        to: "/about-us",
      },
    ],
  },
  {
    type: "dropdown",
    key: "schemes",
    label: { en: "Modules", hi: "मॉड्यूल" },
    items: [
      {
        key: "beneficiary",
        label: { en: "Beneficiary Profiling", hi: "लाभार्थी प्रोफाइलिंग" },
        to: "/beneficiary-profiling",
      },
      {
        key: "user-management",
        label: { en: "User Management", hi: "उपयोगकर्ता प्रबंधन" },
        to: "/user-management",
      },
      {
        key: "lakhpati-didi",
        label: { en: "Lakhpati Didi", hi: "लखपति दीदी" },
        to: "/Lakhpati-Didi",
      },
      {
        key: "enterprise",
        label: { en: "Enterprise Tracking", hi: "उद्यम ट्रैकिंग" },
        to: "/Enterprise-Tracking",
      },
    ],
  },
  {
    type: "dropdown",
    key: "dashboard",
    label: { en: "Dashboard", hi: "डैशबोर्ड" },
    items: [
      {
        key: "pragati-setu",
        label: { en: "Pragati Setu", hi: "प्रगति सेतु" },
        to: "/",
      },
      {
        key: "aspirational-dashboard",
        label: {
          en: "UP Aspirational Blocks Dashboard",
          hi: "यूपी आकांक्षी ब्लॉक डैशबोर्ड",
        },
        to: "/upsrlm-planning/login",
      },
    ],
  },
  {
    type: "dropdown",
    key: "guidelines",
    label: { en: "Guidelines", hi: "दिशानिर्देश" },
    items: [
      {
        key: "guidelines-user-manual",
        label: { en: "User Manual", hi: "उपयोगकर्ता पुस्तिका" },
        to: "/User-Manual",
      },
      {
        key: "guidelines-faq",
        label: {
          en: "Frequently Asked Questions",
          hi: "अक्सर पूछे जाने वाले प्रश्न",
        },
        to: "/Frequently-Asked-Questions",
      },
    ],
  },
  {
    type: "dropdown",
    key: "training",
    label: { en: "Training", hi: "प्रशिक्षण" },
    items: [
      {
        key: "training-management",
        label: {
          en: "Training Management (TMS)",
          hi: "प्रशिक्षण प्रबंधन (TMS)",
        },
        to: "/training-management",
      },
    ],
  },
  {
    type: "dropdown",
    key: "resources",
    label: { en: "Resources", hi: "संसाधन" },
    items: [
      {
        key: "resources-user-manual",
        label: { en: "User Manual", hi: "उपयोगकर्ता पुस्तिका" },
        to: "/User-Manual",
      },
      {
        key: "resources-faq",
        label: {
          en: "Frequently Asked Questions",
          hi: "अक्सर पूछे जाने वाले प्रश्न",
        },
        to: "/Frequently-Asked-Questions",
      },
    ],
  },
  {
    type: "link",
    key: "reports",
    label: { en: "Reports", hi: "रिपोर्ट" },
    to: "/public-reports",
  },
  {
    type: "link",
    key: "contact",
    label: { en: "Contact Us", hi: "संपर्क करें" },
    to: "/contact-us",
  },
];

const text = {
  en: {
    search: "Search here...",
    searchLabel: "Search",
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
  },
  hi: {
    search: "यहाँ खोजें...",
    searchLabel: "खोजें",
    openNavigation: "नेविगेशन खोलें",
    closeNavigation: "नेविगेशन बंद करें",
  },
};

export default function HeaderTopMenu() {
  const { lang } = useContext(LanguageContext);
  const t = text[lang] || text.en;
  const getLabel = (label) => label?.[lang] || label?.en || "";

  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [search, setSearch] = useState("");

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const toggleMenu = () => setOpen((previous) => !previous);
  const closeMenu = () => {
    setOpen(false);
    setActiveDropdown(null);
  };
  const toggleDropdown = (menu) =>
    setActiveDropdown((previous) => (previous === menu ? null : menu));

  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = search.trim();
    if (!searchValue) return;
    console.log("Search:", searchValue);
  };

  return (
    <nav className={`ps-main-navigation ${lang === "hi" ? "ps-lang-hi" : ""}`}>
      <div className="ps-navigation-inner">
        <button
          type="button"
          className="ps-menu-toggle"
          onClick={toggleMenu}
          aria-label={open ? t.closeNavigation : t.openNavigation}
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`ps-nav-menu ${open ? "open" : ""}`}>
          <li className="ps-mobile-close">
            <button
              type="button"
              onClick={closeMenu}
              aria-label={t.closeNavigation}
            >
              ✕
            </button>
          </li>

          {NAV_ITEMS.map((item) => {
            if (item.type === "link") {
              return (
                <li
                  key={item.key}
                  className={`ps-nav-item ${item.key === "home" ? "ps-home-item" : ""}`}
                >
                  <Link to={item.to} onClick={closeMenu}>
                    {getLabel(item.label)}
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={item.key}
                className={`ps-nav-item ps-dropdown ${activeDropdown === item.key ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="ps-dropdown-trigger"
                  onClick={() => toggleDropdown(item.key)}
                >
                  <span>{getLabel(item.label)}</span>
                  <span className="ps-dropdown-arrow">▾</span>
                </button>

                <ul className="ps-dropdown-menu">
                  {item.items.map((subItem) => (
                    <li key={subItem.key}>
                      {subItem.external ? (
                        <a
                          href={subItem.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={closeMenu}
                        >
                          {getLabel(subItem.label)}
                        </a>
                      ) : (
                        <Link to={subItem.to} onClick={closeMenu}>
                          {getLabel(subItem.label)}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <form className="ps-nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            aria-label={t.searchLabel}
          />
          <button type="submit" aria-label={t.searchLabel}>
            <FiSearch />
          </button>
        </form>
      </div>

      <div
        className={`ps-nav-overlay ${open ? "show" : ""}`}
        onClick={closeMenu}
      ></div>

      <style>{`
        .ps-main-navigation, .ps-main-navigation * {
          box-sizing: border-box;
        }

        .ps-main-navigation {
          position: relative;
          z-index: 90;
          width: 100%;
          margin: 0;
          padding: 0;
          background: linear-gradient(90deg, #0b2c50 0%, #24334b 8%, #56353f 22%, #793838 38%, #9b3f32 54%, #bd4828 70%, #d9501d 84%, #f15a0a 100%);
          box-shadow: 0 2px 6px rgba(15, 23, 42, .16);
        }
        .ps-navigation-inner {
          width: 100%;
          max-width: 1500px;
          height: 52px;
          margin: 0 auto;
          padding: 0 25px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 20px;
        }

        /* navigation menu */
        .ps-nav-menu {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: stretch;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ps-nav-item {
          position: relative;
          display: flex;
          align-items: stretch;
          margin: 0;
          color: #fff;
        }

        /* normal links */
        .ps-nav-item > a {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background .2s ease, color .2s ease;
        }
        .ps-nav-item > a:hover {
          background: rgba(255, 255, 255, .08);
          color: #fff;
        }

        /* home */
        .ps-home-item > a {
          min-width: 92px;
          color: #fff;
          font-weight: 800;
          box-shadow: inset 0 -3px 0 rgba(255, 255, 255, .12);
        }
        .ps-home-item > a:hover {
          background: #eb5000;
          color: #fff;
        }

        /* dropdown trigger */
        .ps-dropdown-trigger {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 20px;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }
        .ps-dropdown-trigger:hover {
          background: rgba(255, 255, 255, .08);
          color: #fff;
        }
        .ps-dropdown-arrow {
          position: relative;
          top: -1px;
          font-size: 10px;
          transition: transform .25s ease;
        }

        /* dropdown menu */
        .ps-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: max-content;
          min-width: 230px;
          margin: 0;
          padding: 7px;
          list-style: none;
          background: #fff;
          border: 1px solid #e8edf3;
          border-radius: 0 0 9px 9px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, .14);
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: opacity .2s ease, visibility .2s ease, transform .2s ease;
          z-index: 150;
        }
        .ps-dropdown-menu li { margin: 0; border-radius: 5px; }
        .ps-dropdown-menu li a {
          display: block;
          padding: 10px 13px;
          color: #334155;
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          border-radius: 5px;
          transition: background .2s ease, color .2s ease;
        }
        .ps-dropdown-menu li a:hover {
          background: #fff2e9;
          color: #f15a0a;
        }

        /* desktop dropdown */
        @media (min-width: 901px) {
          .ps-dropdown:hover .ps-dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          .ps-dropdown:hover .ps-dropdown-arrow { transform: rotate(180deg); }
        }

        /* search */
        .ps-nav-search {
          width: 220px;
          height: 34px;
          flex-shrink: 0;
          align-self: center;
          display: flex;
          overflow: hidden;
          background: #fff;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, .12);
        }
        .ps-nav-search input {
          flex: 1;
          min-width: 0;
          height: 100%;
          padding: 0 11px;
          border: none;
          outline: none;
          background: #fff;
          color: #334155;
          font-family: inherit;
          font-size: 18px;
          text-align: center;
          margin-top:-1px;
        }
        .ps-nav-search input::placeholder {
          color: #94a3b8;
          font-family: inherit;
          font-size: 18px;
        }
        .ps-nav-search button {
          width: 38px;
          height: 34px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: #fff;
          color: #ff5b0b;
          font-size: 20px;
          cursor: pointer;
          transition: background .2s ease;
        }
        .ps-nav-search button:hover {
          border: 2px #ff5b0b solid;
          border-radius: 100%;
          background: #ff5b0b;
          color: #fff;
        }

        /* hamburger */
        .ps-menu-toggle {
          display: none;
          align-self: center;
          width: 38px;
          height: 38px;
          padding: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .ps-menu-toggle span {
          display: block;
          width: 100%;
          height: 2px;
          margin: 4px 0;
          background: #fff;
          border-radius: 5px;
        }

        .ps-mobile-close { display: none; }

        /* overlay, default (hidden desktop state) */
        .ps-nav-overlay {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 0;
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* hindi desktop adjustment */
        @media (min-width: 901px) {
          .ps-lang-hi .ps-nav-item > a, .ps-lang-hi .ps-dropdown-trigger {
            padding-left: 14px;
            padding-right: 14px;
            font-size: 12px;
          }
          .ps-lang-hi .ps-home-item > a { min-width: 72px; }
        }

        /* 1400px+ */
        @media (min-width: 1400px) {
          .ps-navigation-inner {
            max-width: 1540px;
            height: 54px;
            padding: 0 30px;
          }
          .ps-nav-item > a, .ps-dropdown-trigger {
            height: 54px;
            padding: 0 24px;
            font-size: 13.5px;
          }
          .ps-nav-search { width: 235px; height: 35px; }
          .ps-nav-search button { height: 35px; }
          .ps-lang-hi .ps-nav-item > a, .ps-lang-hi .ps-dropdown-trigger {
            padding-left: 16px;
            padding-right: 16px;
            font-size: 12.5px;
          }
        }

        /* 1200px */
        @media (max-width: 1200px) {
          .ps-navigation-inner { padding: 0 18px; gap: 12px; }
          .ps-nav-item > a, .ps-dropdown-trigger {
            padding: 0 14px;
            font-size: 12px;
          }
          .ps-home-item > a { min-width: 78px; }
          .ps-nav-search { width: 180px; }
          .ps-lang-hi .ps-nav-item > a, .ps-lang-hi .ps-dropdown-trigger {
            padding-left: 10px;
            padding-right: 10px;
            font-size: 11px;
          }
        }

        /* 1024px */
        @media (max-width: 1024px) {
          .ps-navigation-inner { padding: 0 12px; gap: 8px; }
          .ps-nav-item > a, .ps-dropdown-trigger {
            padding: 0 10px;
            font-size: 11px;
          }
          .ps-home-item > a { min-width: 68px; }
          .ps-nav-search { width: 150px; }
          .ps-nav-search input { padding: 0 8px; font-size: 10px; }
          .ps-nav-search input::placeholder { font-size: 10px; }
          .ps-lang-hi .ps-nav-item > a, .ps-lang-hi .ps-dropdown-trigger {
            padding-left: 7px;
            padding-right: 7px;
            font-size: 10px;
          }
        }

        /* 900px tablet / mobile */
        @media (max-width: 900px) {
          .ps-main-navigation {
            background: linear-gradient(90deg, #0b2c50 0%, #7a3837 55%, #f15a0a 100%);
          }
          .ps-navigation-inner {
            position: relative;
            z-index: 1002;
            height: 52px;
            padding: 0 16px;
            align-items: center;
          }
          .ps-menu-toggle { display: block; }

          /* side menu */
          .ps-nav-menu {
            position: absolute;
            top: 52px;
            left: 0;
            z-index: 1001;
            width: 310px;
            max-width: 88%;
            height: calc(100vh - 52px);
            height: calc(100dvh - 52px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin: 0;
            padding: 12px 15px 30px;
            overflow-x: hidden;
            overflow-y: auto;
            overscroll-behavior: contain;
            background: linear-gradient(180deg, #0b2c50 0%, #58353e 42%, #933d33 70%, #d9511d 100%);
            box-shadow: 8px 12px 24px rgba(15, 23, 42, .24);
            transform: translateX(-105%);
            transition: transform .35s cubic-bezier(.16, 1, .3, 1);
          }
          .ps-nav-menu.open { transform: translateX(0); }

          /* close */
          .ps-mobile-close {
            width: 100%;
            height: 40px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 0;
            padding: 0 4px 5px;
            border-bottom: 1px solid rgba(255, 255, 255, .12);
          }
          .ps-mobile-close button {
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: none;
            background: transparent;
            color: #fff;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
          }

          /* mobile items */
          .ps-nav-item {
            width: 100%;
            display: block;
            flex-shrink: 0;
            border-bottom: 1px solid rgba(255, 255, 255, .12);
          }
          .ps-nav-item > a, .ps-dropdown-trigger {
            width: 100%;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            font-size: 13px;
            text-align: left;
          }
          .ps-lang-hi .ps-nav-item > a, .ps-lang-hi .ps-dropdown-trigger {
            padding: 0 12px;
            font-size: 13px;
          }
          .ps-home-item > a {
            min-width: 0;
            background: #ff5b0b;
            justify-content: flex-start;
          }

          /* mobile dropdown */
          .ps-dropdown-menu {
            position: static;
            width: 100%;
            min-width: 0;
            max-height: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
            opacity: 1;
            visibility: visible;
            transform: none;
            background: rgba(0, 0, 0, .13);
            border: none;
            border-radius: 0;
            box-shadow: none;
            transition: max-height .3s ease;
          }
          .ps-dropdown.active .ps-dropdown-menu { max-height: 500px; padding: 5px 8px 10px; }
          .ps-dropdown.active .ps-dropdown-arrow { transform: rotate(180deg); }
          .ps-dropdown-menu li { width: 100%; }
          .ps-dropdown-menu li a {
            width: 100%;
            color: #fff;
            white-space: normal;
            font-size: 12px;
          }
          .ps-dropdown-menu li a:hover {
            background: rgba(255, 255, 255, .10);
            color: #fff;
          }

          /* mobile search */
          .ps-nav-search { width: 230px; margin-left: auto; }

          /* overlay */
          .ps-nav-overlay {
            position: absolute;
            top: 52px;
            left: 0;
            z-index: 999;
            width: 100vw;
            height: calc(100vh - 52px);
            height: calc(100dvh - 52px);
            background: rgba(15, 23, 42, .45);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity .3s ease, visibility .3s ease;
          }
          .ps-nav-overlay.show { opacity: 1; visibility: visible; pointer-events: auto; }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .ps-navigation-inner { padding: 0 12px; }
          .ps-nav-search { width: 190px; }
          .ps-nav-menu { width: 280px; }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .ps-navigation-inner { height: 48px; padding: 0 8px; }
          .ps-menu-toggle { width: 34px; height: 34px; padding: 7px; }
          .ps-nav-search { width: 160px; height: 31px; }
          .ps-nav-search button { width: 34px; height: 31px; }
          .ps-nav-menu {
            top: 48px;
            width: 265px;
            height: calc(100vh - 48px);
            height: calc(100dvh - 48px);
            padding: 10px 12px 25px;
          }
          .ps-nav-overlay {
            top: 48px;
            height: calc(100vh - 48px);
            height: calc(100dvh - 48px);
          }
          .ps-mobile-close { height: 36px; }
          .ps-mobile-close button { width: 30px; height: 30px; font-size: 18px; }
          .ps-nav-item > a, .ps-dropdown-trigger {
            height: 45px;
            padding: 0 10px;
            font-size: 12px;
          }
          .ps-lang-hi .ps-nav-item > a, .ps-lang-hi .ps-dropdown-trigger { font-size: 12px; }
        }
      `}</style>
    </nav>
  );
}
