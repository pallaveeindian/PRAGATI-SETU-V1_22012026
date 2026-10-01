// src/components/layout/TopNavigation.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiUser,
  FiHeadphones,
  FiArrowRight,
} from "react-icons/fi";

/* EXISTING IMAGES */
import nav_logo from "../assets/top_nav_banner1.png";
import ps_banner from "../assets/top_nav_banner_ps.png";

/* EXISTING LOGIN */
import Login from "../pages/Login";


export default function TopNavigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);


  /* =====================================================
     BODY SCROLL LOCK
  ===================================================== */

  useEffect(() => {
    document.body.style.overflow =
      isLoginOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);


  return (
    <>

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <nav className="ps-topbar">

        <div className="ps-topbar-inner">


          {/* =================================================
              LEFT LOGO
          ================================================= */}

          <div className="ps-topbar-logo">

            <Link to="/">

              {/* DESKTOP IMAGE */}

              <img
                src={nav_logo}
                alt="UP State Rural Livelihoods Mission - Pragati Setu"
                className="ps-desktop-logo"
              />


              {/* MOBILE IMAGE */}

              <img
                src={ps_banner}
                alt="Pragati Setu"
                className="ps-mobile-logo"
              />

            </Link>

          </div>



          {/* =================================================
              RIGHT BUTTONS
          ================================================= */}

          <div className="ps-topbar-actions">


            {/* ================= LOGIN ================= */}

            <button
              type="button"
              className="ps-login-btn"
              onClick={() => setIsLoginOpen(true)}
            >

              <FiUser className="ps-action-icon" />

              <span>
                LOGIN
              </span>

              <FiArrowRight className="ps-action-arrow" />

            </button>



            {/* ================= COMPLAINT ================= */}

            <Link
              to="/register-grievance"
              className="ps-complaint-btn"
            >

              <FiHeadphones className="ps-complaint-icon" />


              <div className="ps-complaint-text">

                <strong>
                  COMPLAINT & SUPPORT
                </strong>

                <small>
                  (Grievance Portal)
                </small>

              </div>


              <FiArrowRight className="ps-action-arrow" />

            </Link>


          </div>

        </div>



        {/* =====================================================
            STYLES
        ===================================================== */}

        <style>{`

          /* =====================================================
             RESET
          ===================================================== */

          .ps-topbar,
          .ps-topbar * {
            box-sizing: border-box;
          }



          /* =====================================================
             MAIN BAR
          ===================================================== */

          .ps-topbar {
            position: relative;

            z-index: 100;

            width: 100%;

            background: #ffffff;

            border-bottom:
              1px solid
              #edf0f4;

            box-shadow:
              0 2px 8px
              rgba(15, 23, 42, 0.04);
          }



          .ps-topbar-inner {
            width: 100%;
            max-width: 1540px;

            min-height: 105px;

            margin: 0 auto;

            padding:
              10px
              35px;

            display: flex;

            align-items: center;
            justify-content: space-between;

            gap: 30px;
          }



          /* =====================================================
             LOGO
          ===================================================== */

          .ps-topbar-logo {
            flex: 1;

            min-width: 0;

            display: flex;

            align-items: center;
          }


          .ps-topbar-logo a {
            display: inline-flex;

            align-items: center;

            text-decoration: none;
          }


          /*
             EXACT EXISTING DESKTOP IMAGE
          */

          .ps-desktop-logo {
            display: block;

            width: auto;
            height: 82px;

            max-width: 760px;

            object-fit: contain;

            object-position: left center;
          }


          /*
             MOBILE IMAGE
          */

          .ps-mobile-logo {
            display: none;

            width: auto;
            height: 52px;

            object-fit: contain;
          }



          /* =====================================================
             RIGHT ACTIONS
          ===================================================== */

          .ps-topbar-actions {
            flex-shrink: 0;

            display: flex;

            align-items: center;

            gap: 14px;
          }



          /* =====================================================
             LOGIN BUTTON
          ===================================================== */

          .ps-login-btn {
            width: 190px;
            height: 58px;

            display: inline-flex;

            align-items: center;
            justify-content: center;

            gap: 15px;

            padding:
              0
              22px;

            border: none;

            border-radius: 7px;

            background: #132E4F;

            color: #ffffff;

            font-family: inherit;

            font-size: 16px;
            font-weight: 700;

            cursor: pointer;

            box-shadow:
              0 3px 7px
              rgba(6, 58, 114, 0.18);

            transition:
              background 0.25s ease,
              transform 0.25s ease,
              box-shadow 0.25s ease;
          }


          .ps-login-btn:hover {
            background: #052e5a;

            transform:
              translateY(-1px);

            box-shadow:
              0 6px 14px
              rgba(6, 58, 114, 0.22);
          }



          /* =====================================================
             COMPLAINT BUTTON
          ===================================================== */

          .ps-complaint-btn {
            min-width: 295px;
            height: 58px;

            display: inline-flex;

            align-items: center;

            gap: 14px;

            padding:
              0
              18px;

            border:
              1.7px solid
              #174c88;

            border-radius: 7px;

            background: #ffffff;

            color: #132E4F;

            text-decoration: none;

            transition:
              background 0.25s ease,
              transform 0.25s ease,
              box-shadow 0.25s ease;
          }


          .ps-complaint-btn:hover {
            background: #f8fbff;

            transform:
              translateY(-1px);

            box-shadow:
              0 5px 13px
              rgba(22, 76, 136, 0.12);
          }



          /* =====================================================
             ICONS
          ===================================================== */

          .ps-action-icon {
            flex-shrink: 0;

            font-size: 24px;

            stroke-width: 2;
          }


          .ps-complaint-icon {
            flex-shrink: 0;

            color: #132E4F;

            font-size: 29px;

            stroke-width: 2;
          }


          .ps-action-arrow {
            flex-shrink: 0;

            font-size: 21px;

            transition:
              transform 0.25s ease;
          }


          .ps-login-btn:hover
          .ps-action-arrow,
          .ps-complaint-btn:hover
          .ps-action-arrow {
            transform:
              translateX(4px);
          }



          /* =====================================================
             COMPLAINT TEXT
          ===================================================== */

          .ps-complaint-text {
            flex: 1;

            display: flex;

            flex-direction: column;

            align-items: flex-start;

            line-height: 1.15;
          }


          .ps-complaint-text strong {
            color: #123d72;

            font-size: 15px;
            font-weight: 800;

            white-space: nowrap;
          }


          .ps-complaint-text small {
            margin-top: 4px;

            color: #334155;

            font-size: 11px;
            font-weight: 700;
          }



          /* =====================================================
             1400px+ LARGE DESKTOP
          ===================================================== */

          @media (min-width: 1400px) {

            .ps-topbar-inner {
              max-width: 1600px;

              min-height: 112px;

              padding:
                10px
                40px;
            }


            .ps-desktop-logo {
              height: 88px;

              max-width: 790px;
            }


            .ps-login-btn {
              width: 195px;
              height: 60px;

              font-size: 16px;
            }


            .ps-complaint-btn {
              min-width: 305px;
              height: 60px;
            }

          }



          /* =====================================================
             1200px LAPTOP
          ===================================================== */

          @media (max-width: 1200px) {

            .ps-topbar-inner {
              min-height: 92px;

              padding:
                9px
                25px;

              gap: 20px;
            }


            .ps-desktop-logo {
              height: 68px;

              max-width: 600px;
            }


            .ps-topbar-actions {
              gap: 10px;
            }


            .ps-login-btn {
              width: 160px;
              height: 52px;

              padding:
                0
                17px;

              font-size: 14px;
            }


            .ps-complaint-btn {
              min-width: 255px;
              height: 52px;

              padding:
                0
                14px;

              gap: 10px;
            }


            .ps-complaint-text strong {
              font-size: 13px;
            }


            .ps-complaint-text small {
              font-size: 10px;
            }


            .ps-complaint-icon {
              font-size: 25px;
            }

          }



          /* =====================================================
             1024px SMALL LAPTOP / TABLET
          ===================================================== */

          @media (max-width: 1024px) {

            .ps-topbar-inner {
              min-height: 82px;

              padding:
                8px
                20px;
            }


            .ps-desktop-logo {
              height: 58px;

              max-width: 500px;
            }


            .ps-login-btn {
              width: 135px;
              height: 48px;

              gap: 9px;

              font-size: 12px;
            }


            .ps-complaint-btn {
              min-width: 220px;
              height: 48px;

              padding:
                0
                11px;
            }


            .ps-action-icon {
              font-size: 20px;
            }


            .ps-complaint-icon {
              font-size: 22px;
            }


            .ps-complaint-text strong {
              font-size: 11.5px;
            }


            .ps-complaint-text small {
              font-size: 9px;
            }


            .ps-action-arrow {
              font-size: 17px;
            }

          }



         /* =====================================================
   900px TABLET
===================================================== */

@media (max-width: 900px) {

  .ps-topbar-inner {
    width: 100%;
    min-height: 68px;

    padding: 8px 14px;

    gap: 12px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }


  /* HIDE DESKTOP LOGO */

  .ps-desktop-logo {
    display: none;
  }


  /* MOBILE LOGO */

  .ps-mobile-logo {
    display: block;

    width: auto;
    height: 48px;

    max-width: 170px;

    object-fit: contain;
  }


  .ps-topbar-logo {
    flex: 1;

    min-width: 0;

    overflow: hidden;
  }


  /* RIGHT SIDE */

  .ps-topbar-actions {
    flex: 0 0 auto;

    display: flex;

    align-items: center;

    justify-content: flex-end;

    gap: 8px;
  }


  /* LOGIN */

  .ps-login-btn {
    flex: 0 0 auto;

    width: auto;

    min-width: 105px;

    height: 44px;

    padding: 0 12px;

    gap: 8px;

    font-size: 11px;
  }


  /* COMPLAINT */

  .ps-complaint-btn {
    flex: 0 0 auto;

    min-width: 175px;

    height: 44px;

    padding: 0 9px;

    gap: 7px;
  }


  .ps-complaint-text strong {
    font-size: 9px;
  }


  .ps-complaint-text small {
    font-size: 7px;
  }


  .ps-complaint-icon {
    font-size: 18px;
  }

}
/* =====================================================
   600px MOBILE
===================================================== */

@media (max-width: 600px) {

  .ps-topbar-inner {
    min-height: 58px;

    padding:
      8px
      10px;

    gap: 7px;

    display: flex;

    align-items: center;

    justify-content: space-between;
  }


  /* ================= LOGO ================= */

  .ps-topbar-logo {
    flex: 1;

    min-width: 0;
  }


  .ps-mobile-logo {
    display: block;

    width: auto;

    height: 38px;

    max-width: 120px;

    object-fit: contain;
  }


  /* ================= ACTION AREA ================= */

  .ps-topbar-actions {
    flex-shrink: 0;

    display: flex;

    align-items: center;

    gap: 6px;
  }


  /* ================= LOGIN ================= */

  .ps-login-btn {
    display: inline-flex !important;

    width: auto;

    min-width: 82px;

    height: 40px;

    padding:
      0
      9px;

    gap: 6px;

    align-items: center;

    justify-content: center;

    border-radius: 7px;

    font-size: 10px;

    font-weight: 700;
  }


  /* IMPORTANT:
     KEEP LOGIN TEXT VISIBLE */

  .ps-login-btn span {
    display: inline-block !important;
  }


  .ps-action-icon {
    display: block;

    flex-shrink: 0;

    font-size: 18px;
  }


  /* Arrow can be hidden on mobile
     to save space */

  .ps-login-btn
  .ps-action-arrow {
    display: none;
  }


  /* ================= COMPLAINT ================= */

  .ps-complaint-btn {
    display: inline-flex !important;

    min-width: 138px;

    height: 40px;

    padding:
      0
      7px;

    gap: 5px;
  }


  .ps-complaint-icon {
    flex-shrink: 0;

    font-size: 17px;
  }


  .ps-complaint-text {
    min-width: 0;
  }


  .ps-complaint-text strong {
    font-size: 7.5px;

    white-space: nowrap;
  }


  .ps-complaint-text small {
    font-size: 6px;

    white-space: nowrap;
  }


  .ps-complaint-btn
  .ps-action-arrow {
    display: none;
  }

}



/* =====================================================
   400px SMALL MOBILE
===================================================== */

@media (max-width: 400px) {

  .ps-topbar-inner {
    min-height: 54px;

    padding:
      7px
      7px;

    gap: 4px;
  }


  /* ================= LOGO ================= */

  .ps-mobile-logo {
    height: 32px;

    max-width: 92px;
  }


  .ps-topbar-actions {
    flex-shrink: 0;

    gap: 4px;
  }


  /* ================= LOGIN ================= */

  .ps-login-btn {
    display: inline-flex !important;

    width: auto;

    min-width: 72px;

    height: 36px;

    padding:
      0
      7px;

    gap: 5px;

    font-size: 8px;

    border-radius: 6px;
  }


  /* KEEP WORD LOGIN */

  .ps-login-btn span {
    display: inline-block !important;
  }


  .ps-action-icon {
    font-size: 16px;

    flex-shrink: 0;
  }


  .ps-login-btn
  .ps-action-arrow {
    display: none;
  }


  /* ================= COMPLAINT ================= */

  .ps-complaint-btn {
    display: inline-flex !important;

    min-width: 116px;

    height: 36px;

    padding:
      0
      5px;

    gap: 4px;
  }


  .ps-complaint-icon {
    font-size: 15px;
  }


  .ps-complaint-text strong {
    font-size: 6.3px;
  }


  .ps-complaint-text small {
    font-size: 5.3px;
  }


  .ps-complaint-btn
  .ps-action-arrow {
    display: none;
  }

}

        `}</style>

      </nav>



      {/* =====================================================
          EXISTING LOGIN MODAL
      ===================================================== */}

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

    </>
  );
}