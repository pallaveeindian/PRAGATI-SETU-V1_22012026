// src/pages/HeaderTopMenu.jsx

import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { FiSearch } from "react-icons/fi";


/* =====================================================
   NAVIGATION ITEMS
===================================================== */

const NAV_ITEMS = [
  {
    type: "link",
    label: "Home",
    to: "/",
  },

  {
    type: "dropdown",
    key: "about",
    label: "About Us",

    items: [
      {
        label: "UPSRLM",
        href: "https://srlm.up.gov.in/en",
        external: true,
      },

      {
        label: "Our Mission",
        to: "/about-us",
      },
    ],
  },

  {
    type: "dropdown",
    key: "schemes",
    label: "Modules",

    items: [
      {
        label: "Beneficiary Profiling",
        to: "/beneficiary-profiling",
      },

      {
        label: "User Management",
        to: "/user-management",
      },

      {
        label: "Lakhpati Didi",
        to: "/Lakhpati-Didi",
      },

      {
        label: "Enterprise Tracking",
        to: "/Enterprise-Tracking",
      },
    ],
  },

  {
    type: "dropdown",
    key: "dashboard",
    label: "Dashboard",

    items: [
      {
        label: "Pragati Setu",
        to: "/",
      },

      {
        label: "UP Aspirational Blocks Dashboard",
        to: "/upsrlm-planning/login",
      },
    ],
  },

  {
    type: "dropdown",
    key: "guidelines",
    label: "Guidelines",

    items: [
      {
        label: "User Manual",
        to: "/User-Manual",
      },

      {
        label: "Frequently Asked Questions",
        to: "/Frequently-Asked-Questions",
      },
    ],
  },

  {
    type: "dropdown",
    key: "training",
    label: "Training",

    items: [
      {
        label: "Training Management (TMS)",
        to: "/training-management",
      },
    ],
  },

  {
    type: "dropdown",
    key: "resources",
    label: "Resources",

    items: [
      {
        label: "User Manual",
        to: "/User-Manual",
      },

      {
        label: "Frequently Asked Questions",
        to: "/Frequently-Asked-Questions",
      },

      // {
      //   label: "What's New",
      //   to: "/What's-New",
      // },
    ],
  },

  /* ================= REPORTS ================= */

{
  type: "link",
  label: "Reports",
  to: "/public-reports",
},

  {
    type: "link",
    label: "Contact Us",
    to: "/contact-us",
  },
];


export default function HeaderTopMenu() {

  const [open, setOpen] =
    useState(false);

  const [activeDropdown, setActiveDropdown] =
    useState(null);

  const [search, setSearch] =
    useState("");


  /* =====================================================
     LOCK PAGE SCROLL WHEN MOBILE MENU IS OPEN
  ===================================================== */

  useEffect(() => {

    if (open) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "auto";

    }


    return () => {

      document.body.style.overflow =
        "auto";

    };

  }, [open]);


  /* =====================================================
     MENU CONTROLS
  ===================================================== */

  const toggleMenu = () => {

    setOpen((previous) =>
      !previous
    );

  };


  const closeMenu = () => {

    setOpen(false);

    setActiveDropdown(null);

  };


  const toggleDropdown = (menu) => {

    setActiveDropdown((previous) =>
      previous === menu
        ? null
        : menu
    );

  };


  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (event) => {

    event.preventDefault();


    const searchValue =
      search.trim();


    if (!searchValue) return;


    console.log(
      "Search:",
      searchValue
    );

  };


  return (

    <nav className="ps-main-navigation">


      {/* =====================================================
          NAVIGATION BAR
      ===================================================== */}

      <div className="ps-navigation-inner">


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="ps-menu-toggle"
          onClick={toggleMenu}
          aria-label={
            open
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={open}
        >

          <span></span>

          <span></span>

          <span></span>

        </button>



        {/* =================================================
            NAVIGATION LINKS
        ================================================= */}

        <ul
          className={`ps-nav-menu ${
            open
              ? "open"
              : ""
          }`}
        >


          {/* =================================================
              MOBILE CLOSE
          ================================================= */}

          <li className="ps-mobile-close">

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation"
            >

              ✕

            </button>

          </li>



          {/* =================================================
              MENU ITEMS
          ================================================= */}

          {NAV_ITEMS.map((item) => {


            /* =============================================
               NORMAL LINK
            ============================================= */

            if (item.type === "link") {

              return (

                <li
                  key={item.label}
                  className={`ps-nav-item ${
                    item.label === "Home"
                      ? "ps-home-item"
                      : ""
                  }`}
                >

                  <Link
                    to={item.to}
                    onClick={closeMenu}
                  >

                    {item.label}

                  </Link>

                </li>

              );

            }



            /* =============================================
               DROPDOWN
            ============================================= */

            return (

              <li
                key={item.key}
                className={`ps-nav-item ps-dropdown ${
                  activeDropdown === item.key
                    ? "active"
                    : ""
                }`}
              >


                <button
                  type="button"
                  className="ps-dropdown-trigger"
                  onClick={() =>
                    toggleDropdown(
                      item.key
                    )
                  }
                >

                  <span>
                    {item.label}
                  </span>


                  <span className="ps-dropdown-arrow">

                    ▾

                  </span>

                </button>



                <ul className="ps-dropdown-menu">


                  {item.items.map(
                    (subItem) => (

                      <li
                        key={
                          subItem.label
                        }
                      >


                        {subItem.external ? (

                          <a
                            href={
                              subItem.href
                            }
                            target="_blank"
                            rel="noreferrer"
                            onClick={closeMenu}
                          >

                            {
                              subItem.label
                            }

                          </a>

                        ) : (

                          <Link
                            to={
                              subItem.to
                            }
                            onClick={closeMenu}
                          >

                            {
                              subItem.label
                            }

                          </Link>

                        )}


                      </li>

                    )
                  )}


                </ul>


              </li>

            );

          })}


        </ul>



        {/* =================================================
            SEARCH
        ================================================= */}

        <form
          className="ps-nav-search"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search here..."
            aria-label="Search"
          />


          <button
            type="submit"
            aria-label="Search"
          >

            <FiSearch />

          </button>

        </form>


      </div>



      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      <div
        className={`ps-nav-overlay ${
          open
            ? "show"
            : ""
        }`}
        onClick={closeMenu}
      ></div>



      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           RESET
        ===================================================== */

        .ps-main-navigation,
        .ps-main-navigation * {
          box-sizing: border-box;
        }


        /* =====================================================
           MAIN NAVIGATION
        ===================================================== */

        .ps-main-navigation {
          position: relative;

          z-index: 90;

          width: 100%;

          margin: 0;

          padding: 0;

          background:
            linear-gradient(
              90deg,
              #0b2c50 0%,
              #24334b 8%,
              #56353f 22%,
              #793838 38%,
              #9b3f32 54%,
              #bd4828 70%,
              #d9501d 84%,
              #f15a0a 100%
            );

          box-shadow:
            0
            2px
            6px
            rgba(
              15,
              23,
              42,
              0.16
            );
        }


        /* =====================================================
           INNER BAR
        ===================================================== */

        .ps-navigation-inner {
          width: 100%;

          max-width: 1500px;

          height: 52px;

          margin: 0 auto;

          padding:
            0
            25px;

          display: flex;

          align-items: stretch;

          justify-content:
            space-between;

          gap: 20px;
        }


        /* =====================================================
           NAVIGATION MENU
        ===================================================== */

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

          color: #ffffff;
        }


        /* =====================================================
           NORMAL NAVIGATION LINKS
        ===================================================== */

        .ps-nav-item > a {
          height: 52px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding:
            0
            22px;

          color: #ffffff;

          font-size: 13px;

          font-weight: 700;

          text-decoration: none;

          white-space: nowrap;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }


        .ps-nav-item > a:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.08
            );

          color: #ffffff;
        }


        /* =====================================================
           HOME
        ===================================================== */

        .ps-home-item > a {
          min-width: 92px;

          color: #ffffff;

          font-weight: 800;

          box-shadow:
            inset
            0
            -3px
            0
            rgba(
              255,
              255,
              255,
              0.12
            );
        }


        .ps-home-item > a:hover {
          background: #eb5000;

          color: #ffffff;
        }


        /* =====================================================
           DROPDOWN TRIGGER
        ===================================================== */

        .ps-dropdown-trigger {
          height: 52px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          padding:
            0
            20px;

          border: none;

          outline: none;

          background: transparent;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;

          font-weight: 700;

          white-space: nowrap;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }


        .ps-dropdown-trigger:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.08
            );

          color: #ffffff;
        }


        .ps-dropdown-arrow {
          position: relative;

          top: -1px;

          font-size: 10px;

          transition:
            transform 0.25s ease;
        }


        /* =====================================================
           DROPDOWN MENU
        ===================================================== */

        .ps-dropdown-menu {
          position: absolute;

          top: 100%;

          left: 0;

          width: max-content;

          min-width: 230px;

          margin: 0;

          padding: 7px;

          list-style: none;

          background: #ffffff;

          border:
            1px solid
            #e8edf3;

          border-radius:
            0
            0
            9px
            9px;

          box-shadow:
            0
            10px
            26px
            rgba(
              15,
              23,
              42,
              0.14
            );

          opacity: 0;

          visibility: hidden;

          transform:
            translateY(8px);

          transition:
            opacity 0.2s ease,
            visibility 0.2s ease,
            transform 0.2s ease;

          z-index: 150;
        }


        .ps-dropdown-menu li {
          margin: 0;

          border-radius: 5px;
        }


        .ps-dropdown-menu li a {
          display: block;

          padding:
            10px
            13px;

          color: #334155;

          font-size: 12.5px;

          font-weight: 600;

          text-decoration: none;

          white-space: nowrap;

          border-radius: 5px;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }


        .ps-dropdown-menu li a:hover {
          background: #fff2e9;

          color: #f15a0a;
        }


        /* =====================================================
           DESKTOP DROPDOWN
        ===================================================== */

        @media (min-width: 901px) {

          .ps-dropdown:hover
          .ps-dropdown-menu {
            opacity: 1;

            visibility: visible;

            transform:
              translateY(0);
          }


          .ps-dropdown:hover
          .ps-dropdown-arrow {
            transform:
              rotate(180deg);
          }

        }


        /* =====================================================
           SEARCH BAR
        ===================================================== */

        .ps-nav-search {
          width: 220px;

          height: 34px;

          flex-shrink: 0;

          align-self: center;

          display: flex;

          overflow: hidden;

          background: #ffffff;

          border-radius: 3px;

          box-shadow:
            0
            1px
            3px
            rgba(
              15,
              23,
              42,
              0.12
            );
        }


        .ps-nav-search input {
          flex: 1;

          min-width: 0;

          height: 100%;

          padding:
            0
            11px;

          border: none;

          outline: none;

          background: #ffffff;

          color: #334155;

          font-family: inherit;

          font-size: 18px;
        }


        .ps-nav-search
        input::placeholder {
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

          background: #ffffff;

          color: #ff5b0b;

          font-size: 20px;

          cursor: pointer;

          transition:
            background 0.2s ease;
        }


        .ps-nav-search button:hover {
          border:
            2px
            #ff5b0b
            solid;

          border-radius: 100%;

          background: #ff5b0b;

          color: #ffffff;
        }


        /* =====================================================
           MOBILE HAMBURGER
        ===================================================== */

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

          margin:
            4px
            0;

          background: #ffffff;

          border-radius: 5px;
        }


        /* =====================================================
           MOBILE CLOSE
        ===================================================== */

        .ps-mobile-close {
          display: none;
        }


        /* =====================================================
           OVERLAY DEFAULT
        ===================================================== */

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


        /* =====================================================
           1400px+
        ===================================================== */

        @media (min-width: 1400px) {

          .ps-navigation-inner {
            max-width: 1540px;

            height: 54px;

            padding:
              0
              30px;
          }


          .ps-nav-item > a,
          .ps-dropdown-trigger {
            height: 54px;

            padding:
              0
              24px;

            font-size: 13.5px;
          }


          .ps-nav-search {
            width: 235px;

            height: 35px;
          }


          .ps-nav-search button {
            height: 35px;
          }

        }


        /* =====================================================
           1200px
        ===================================================== */

        @media (max-width: 1200px) {

          .ps-navigation-inner {
            padding:
              0
              18px;

            gap: 12px;
          }


          .ps-nav-item > a,
          .ps-dropdown-trigger {
            padding:
              0
              14px;

            font-size: 12px;
          }


          .ps-home-item > a {
            min-width: 78px;
          }


          .ps-nav-search {
            width: 180px;
          }

        }


        /* =====================================================
           1024px
        ===================================================== */

        @media (max-width: 1024px) {

          .ps-navigation-inner {
            padding:
              0
              12px;

            gap: 8px;
          }


          .ps-nav-item > a,
          .ps-dropdown-trigger {
            padding:
              0
              10px;

            font-size: 11px;
          }


          .ps-home-item > a {
            min-width: 68px;
          }


          .ps-nav-search {
            width: 150px;
          }


          .ps-nav-search input {
            padding:
              0
              8px;

            font-size: 10px;
          }

        }


        /* =====================================================
           900px TABLET / MOBILE
        ===================================================== */

        @media (max-width: 900px) {

          /* ===============================================
             MENU BAR
          =============================================== */

          .ps-main-navigation {
            background:
              linear-gradient(
                90deg,
                #0b2c50 0%,
                #7a3837 55%,
                #f15a0a 100%
              );
          }


          .ps-navigation-inner {
            position: relative;

            z-index: 1002;

            height: 52px;

            padding:
              0
              16px;

            align-items: center;
          }


          .ps-menu-toggle {
            display: block;
          }


          /* ===============================================
             SIDE MENU
             IMPORTANT FIX:
             STARTS BELOW HEADER TOP MENU
          =============================================== */

          .ps-nav-menu {
            position: absolute;

            top: 52px;

            left: 0;

            z-index: 1001;

            width: 310px;

            max-width: 88%;

            height:
              calc(
                100vh - 52px
              );

            height:
              calc(
                100dvh - 52px
              );

            display: flex;

            flex-direction: column;

            align-items: stretch;

            margin: 0;

            padding:
              12px
              15px
              30px;

            overflow-x: hidden;

            overflow-y: auto;

            overscroll-behavior:
              contain;

            background:
              linear-gradient(
                180deg,
                #0b2c50 0%,
                #58353e 42%,
                #933d33 70%,
                #d9511d 100%
              );

            box-shadow:
              8px
              12px
              24px
              rgba(
                15,
                23,
                42,
                0.24
              );

            transform:
              translateX(-105%);

            transition:
              transform
              0.35s
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );
          }


          .ps-nav-menu.open {
            transform:
              translateX(0);
          }


          /* ===============================================
             CLOSE BUTTON
          =============================================== */

          .ps-mobile-close {
            width: 100%;

            height: 40px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content:
              flex-end;

            margin: 0;

            padding:
              0
              4px
              5px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.12
              );
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

            color: #ffffff;

            font-size: 20px;

            line-height: 1;

            cursor: pointer;
          }


          /* ===============================================
             MOBILE NAV ITEMS
          =============================================== */

          .ps-nav-item {
            width: 100%;

            display: block;

            flex-shrink: 0;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.12
              );
          }


          .ps-nav-item > a,
          .ps-dropdown-trigger {
            width: 100%;

            height: 48px;

            display: flex;

            align-items: center;

            justify-content:
              space-between;

            padding:
              0
              12px;

            font-size: 13px;

            text-align: left;
          }


          /* ===============================================
             HOME
          =============================================== */

          .ps-home-item > a {
            min-width: 0;

            background: #ff5b0b;

            justify-content:
              flex-start;
          }


          /* ===============================================
             MOBILE DROPDOWN
          =============================================== */

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

            background:
              rgba(
                0,
                0,
                0,
                0.13
              );

            border: none;

            border-radius: 0;

            box-shadow: none;

            transition:
              max-height
              0.3s ease;
          }


          .ps-dropdown.active
          .ps-dropdown-menu {
            max-height: 500px;

            padding:
              5px
              8px
              10px;
          }


          .ps-dropdown.active
          .ps-dropdown-arrow {
            transform:
              rotate(180deg);
          }


          .ps-dropdown-menu li {
            width: 100%;
          }


          .ps-dropdown-menu li a {
            width: 100%;

            color: #ffffff;

            white-space: normal;

            font-size: 12px;
          }


          .ps-dropdown-menu li a:hover {
            background:
              rgba(
                255,
                255,
                255,
                0.10
              );

            color: #ffffff;
          }


          /* ===============================================
             MOBILE SEARCH
          =============================================== */

          .ps-nav-search {
            width: 230px;

            margin-left: auto;
          }


          /* ===============================================
             OVERLAY
             ALSO STARTS BELOW MENU BAR
          =============================================== */

          .ps-nav-overlay {
            position: absolute;

            top: 52px;

            left: 0;

            z-index: 999;

            width: 100vw;

            height:
              calc(
                100vh - 52px
              );

            height:
              calc(
                100dvh - 52px
              );

            background:
              rgba(
                15,
                23,
                42,
                0.45
              );

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

            transition:
              opacity 0.3s ease,
              visibility 0.3s ease;
          }


          .ps-nav-overlay.show {
            opacity: 1;

            visibility: visible;

            pointer-events: auto;
          }

        }


        /* =====================================================
           600px MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .ps-navigation-inner {
            padding:
              0
              12px;
          }


          .ps-nav-search {
            width: 190px;
          }


          .ps-nav-menu {
            width: 280px;
          }

        }


        /* =====================================================
           400px SMALL MOBILE
        ===================================================== */

        @media (max-width: 400px) {

          .ps-navigation-inner {
            height: 48px;

            padding:
              0
              8px;
          }


          .ps-menu-toggle {
            width: 34px;

            height: 34px;

            padding: 7px;
          }


          .ps-nav-search {
            width: 160px;

            height: 31px;
          }


          .ps-nav-search button {
            width: 34px;

            height: 31px;
          }


          /* NAV IS 48px HERE */

          .ps-nav-menu {
            top: 48px;

            width: 265px;

            height:
              calc(
                100vh - 48px
              );

            height:
              calc(
                100dvh - 48px
              );

            padding:
              10px
              12px
              25px;
          }


          .ps-nav-overlay {
            top: 48px;

            height:
              calc(
                100vh - 48px
              );

            height:
              calc(
                100dvh - 48px
              );
          }


          .ps-mobile-close {
            height: 36px;
          }


          .ps-mobile-close button {
            width: 30px;

            height: 30px;

            font-size: 18px;
          }


          .ps-nav-item > a,
          .ps-dropdown-trigger {
            height: 45px;

            padding:
              0
              10px;

            font-size: 12px;
          }

        }

      `}</style>

    </nav>

  );

}