// src\pages\HeaderTopNav.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiHeadphones, FiArrowRight } from "react-icons/fi";
import { LanguageContext } from "./LanguageContext.jsx";
import nav_logo_en from "../assets/top_nav_banner1.png";
import ps_banner_en from "../assets/top_nav_banner_ps.png";
import nav_logo_hi from "../assets/top_nav_banner1_hi.png";
import ps_banner_hi from "../assets/top_nav_banner_ps_hi.png";
import Login from "./Login.jsx";

const content = {
  en: {
    login: "LOGIN",
    complaint: "COMPLAINT & SUPPORT",
    grievance: "(Grievance Portal)",
    desktopAlt: "UP State Rural Livelihoods Mission - Pragati Setu",
    mobileAlt: "Pragati Setu",
  },
  hi: {
    login: "लॉगिन",
    complaint: "शिकायत एवं सहायता",
    grievance: "(शिकायत पोर्टल)",
    desktopAlt: "उत्तर प्रदेश राज्य ग्रामीण आजीविका मिशन - प्रगति सेतु",
    mobileAlt: "प्रगति सेतु",
  },
};

// language-specific banner images
const logos = {
  en: { desktop: nav_logo_en, mobile: ps_banner_en },
  hi: { desktop: nav_logo_hi, mobile: ps_banner_hi },
};

export default function TopNavigation() {
  const { lang } = useContext(LanguageContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const t = content[lang] || content.en;
  const logo = logos[lang] || logos.en;

  // lock page scroll while the login modal is open
  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);

  return (
    <>
      <nav className="ps-topbar">
        <div className="ps-topbar-inner">
          <div className="ps-topbar-logo">
            <Link to="/">
              <img
                src={logo.desktop}
                alt={t.desktopAlt}
                className="ps-desktop-logo"
              />
              <img
                src={logo.mobile}
                alt={t.mobileAlt}
                className="ps-mobile-logo"
              />
            </Link>
          </div>

          <div className="ps-topbar-actions">
            <button
              type="button"
              className="ps-login-btn"
              onClick={() => setIsLoginOpen(true)}
            >
              {/* arrow visible before hover */}
              <FiArrowRight className="login-arr login-arr-1" />
              <FiUser className="ps-action-icon" />
              <span className="login-text">{t.login}</span>
              <span className="login-circle"></span>
              {/* arrow comes in from the left on hover */}
              <FiArrowRight className="login-arr login-arr-2" />
            </button>

            <Link to="/register-grievance" className="ps-complaint-btn">
              {/* starts in LOGIN's hover state, returns to LOGIN's default state on hover */}
              <FiArrowRight className="complaint-arr complaint-arr-1" />
              <FiHeadphones className="ps-complaint-icon" />
              <div className="ps-complaint-text">
                <strong>{t.complaint}</strong>
                <small>{t.grievance}</small>
              </div>
              <span className="complaint-circle"></span>
              <FiArrowRight className="complaint-arr complaint-arr-2" />
            </Link>
          </div>
        </div>

        <style>{`
          .ps-topbar, .ps-topbar * {
            box-sizing: border-box;
          }
          .ps-topbar {
            position: relative;
            z-index: 100;
            width: 100%;
            background: #fff;
            border-bottom: 1px solid #edf0f4;
            box-shadow: 0 2px 8px rgba(15, 23, 42, .04);
          }
          .ps-topbar-inner {
            width: 100%;
            max-width: 1540px;
            min-height: 105px;
            margin: 0 auto;
            padding: 10px 35px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
          }
          .ps-topbar-logo { flex: 1; min-width: 0; display: flex; align-items: center; }
          .ps-topbar-logo a { display: inline-flex; align-items: center; text-decoration: none; }

          .ps-desktop-logo {
            display: block;
            width: auto;
            height: 82px;
            max-width: 760px;
            object-fit: contain;
            object-position: left center;
          }
          .ps-mobile-logo {
            display: none;
            width: auto;
            height: 52px;
            object-fit: contain;
          }

          .ps-topbar-actions {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 14px;
          }

          /* login */
          .ps-login-btn {
            position: relative;
            width: 190px;
            height: 58px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 0 38px;
            border: 2px solid #132E4F;
            border-radius: 100px;
            background: #132E4F;
            color: #fff;
            font-family: inherit;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 0 0 2px #132E4F;
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          /* content stays above the circle */
          .ps-login-btn .ps-action-icon, .ps-login-btn .login-text, .ps-login-btn .login-arr {
            position: relative;
            z-index: 3;
          }
          .ps-action-icon { flex-shrink: 0; font-size: 24px; stroke-width: 2; }
          .login-text {
            position: relative;
            z-index: 3;
            transform: translateX(-12px);
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          .login-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            transform: translate(-50%, -50%);
            background: #ff5b0b;
            border-radius: 50%;
            opacity: 0;
            z-index: 1;
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          .login-arr {
            position: absolute !important;
            width: 22px;
            height: 22px;
            color: #fff;
            z-index: 4;
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          .login-arr-1 { right: 16px; }  /* visible on the right */
          .login-arr-2 { left: -25%; }   /* hidden on the left */

          .ps-login-btn:hover {
            border-color: #ff5b0b;
            border-radius: 12px;
            box-shadow: 0 0 0 12px transparent;
            color: #fff;
          }
          .ps-login-btn:hover .login-arr-1 { right: -25%; }
          .ps-login-btn:hover .login-arr-2 { left: 16px; }
          .ps-login-btn:hover .login-text { transform: translateX(12px); }
          .ps-login-btn:hover .login-circle { width: 260px; height: 260px; opacity: 1; }
          .ps-login-btn:active { transform: scale(.95); }

          /* complaint & support — default = LOGIN's hover state, hover = LOGIN's default state */
          .ps-complaint-btn {
            position: relative;
            min-width: 295px;
            height: 58px;
            display: inline-flex;
            align-items: center;
            gap: 14px;
            padding: 0 42px;
            border: 2px solid #ff5b0b;
            border-radius: 12px;
            background: #fff;
            color: #fff;
            text-decoration: none;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 0 0 12px transparent;
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          /* content stays above the circle */
          .ps-complaint-btn .ps-complaint-icon, .ps-complaint-btn .ps-complaint-text, .ps-complaint-btn .complaint-arr {
            position: relative;
            z-index: 3;
          }
          /* starts expanded (LOGIN's hover state) */
          .complaint-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 380px;
            height: 380px;
            transform: translate(-50%, -50%);
            background: #ff5b0b;
            border-radius: 50%;
            opacity: 1;
            z-index: 1;
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          .ps-complaint-icon {
            flex-shrink: 0;
            color: #fff;
            font-size: 29px;
            stroke-width: 2;
            transition: color .8s cubic-bezier(.23, 1, .32, 1);
          }
          .ps-complaint-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1.15;
            transform: translateX(12px);
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          .ps-complaint-text strong {
            color: #fff;
            font-size: 15px;
            font-weight: 800;
            white-space: nowrap;
            transition: color .8s cubic-bezier(.23, 1, .32, 1);
          }
          .ps-complaint-text small {
            margin-top: 4px;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            transition: color .8s cubic-bezier(.23, 1, .32, 1);
          }
          .complaint-arr {
            position: absolute !important;
            width: 22px;
            height: 22px;
            color: #fff;
            z-index: 4;
            transition: all .8s cubic-bezier(.23, 1, .32, 1);
          }
          .complaint-arr-1 { right: -25%; }  /* starts outside (LOGIN hover) */
          .complaint-arr-2 { left: 16px; }   /* starts visible on the left (LOGIN hover) */

          /* hover returns to LOGIN's default state */
          .ps-complaint-btn:hover {
            border-color: #132E4F;
            border-radius: 100px;
            background: #fff;
            color: #132E4F;
            box-shadow: 0 0 0 2px #132E4F;
          }
          .ps-complaint-btn:hover .complaint-circle { width: 20px; height: 20px; opacity: 0; }
          .ps-complaint-btn:hover .ps-complaint-text { transform: translateX(-12px); }
          .ps-complaint-btn:hover .complaint-arr-1 { right: 16px; }
          .ps-complaint-btn:hover .complaint-arr-2 { left: -25%; }
          .ps-complaint-btn:hover .ps-complaint-icon,
          .ps-complaint-btn:hover .ps-complaint-text strong,
          .ps-complaint-btn:hover .ps-complaint-text small,
          .ps-complaint-btn:hover .complaint-arr { color: #132E4F; }
          .ps-complaint-btn:active { transform: scale(.95); }

          /* 1400px+ large desktop */
          @media (min-width: 1400px) {
            .ps-topbar-inner {
              max-width: 1600px;
              min-height: 112px;
              padding: 10px 40px;
            }
            .ps-desktop-logo { height: 88px; max-width: 790px; }
            .ps-login-btn { width: 195px; height: 60px; font-size: 16px; }
            .ps-complaint-btn { min-width: 305px; height: 60px; }
          }

          /* 1200px laptop — animated arrows removed from here downward */
          @media (max-width: 1200px) {
            .ps-topbar-inner {
              min-height: 92px;
              padding: 9px 25px;
              gap: 18px;
            }
            .ps-desktop-logo { height: 68px; max-width: 580px; }
            .ps-topbar-actions { gap: 9px; }

            .login-arr, .complaint-arr { display: none !important; }

            /* remove desktop text shift */
            .login-text, .ps-login-btn:hover .login-text { transform: none !important; }
            .ps-complaint-text, .ps-complaint-btn:hover .ps-complaint-text { transform: none !important; }

            .ps-login-btn {
              width: 145px;
              height: 50px;
              padding: 0 18px;
              gap: 8px;
              justify-content: center;
              font-size: 13px;
            }
            .ps-action-icon { font-size: 21px; }

            .ps-complaint-btn {
              min-width: 230px;
              height: 50px;
              padding: 0 16px;
              gap: 9px;
              justify-content: center;
            }
            .ps-complaint-icon { font-size: 22px; }
            .ps-complaint-text { flex: 0 1 auto; min-width: 0; }
            .ps-complaint-text strong { font-size: 11px; white-space: nowrap; }
            .ps-complaint-text small { font-size: 8.5px; white-space: nowrap; }
          }

          /* 1024px small laptop */
          @media (max-width: 1024px) {
            .ps-topbar-inner {
              min-height: 82px;
              padding: 8px 18px;
              gap: 10px;
            }
            .ps-desktop-logo { height: 58px; max-width: 480px; }
            .ps-topbar-actions { gap: 7px; }

            .ps-login-btn {
              width: 120px;
              height: 45px;
              padding: 0 12px;
              gap: 7px;
              font-size: 11px;
            }
            .ps-action-icon { font-size: 19px; }

            .ps-complaint-btn {
              min-width: 195px;
              height: 45px;
              padding: 0 10px;
              gap: 7px;
            }
            .ps-complaint-icon { font-size: 19px; }
            .ps-complaint-text strong { font-size: 9.5px; }
            .ps-complaint-text small { font-size: 7.5px; }
          }

          /* 900px tablet */
          @media (max-width: 900px) {
            .ps-topbar-inner {
              width: 100%;
              min-height: 68px;
              padding: 8px 12px;
              gap: 8px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .ps-desktop-logo { display: none; }
            .ps-mobile-logo {
              display: block;
              width: auto;
              height: 46px;
              max-width: 155px;
              object-fit: contain;
            }
            .ps-topbar-logo { flex: 1; min-width: 0; overflow: hidden; }
            .ps-topbar-actions {
              flex: 0 0 auto;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 6px;
            }

            .ps-login-btn {
              width: auto;
              min-width: 98px;
              height: 42px;
              padding: 0 11px;
              gap: 6px;
              font-size: 10px;
            }
            .ps-action-icon { font-size: 18px; }

            .ps-complaint-btn {
              min-width: 160px;
              height: 42px;
              padding: 0 8px;
              gap: 6px;
            }
            .ps-complaint-icon { font-size: 17px; }
            .ps-complaint-text strong { font-size: 8.5px; }
            .ps-complaint-text small { font-size: 6.8px; }
          }

          /* 600px mobile */
          @media (max-width: 600px) {
            .ps-topbar-inner {
              min-height: 58px;
              padding: 7px 8px;
              gap: 5px;
            }
            .ps-topbar-logo { flex: 1; min-width: 0; }
            .ps-mobile-logo {
              display: block;
              width: auto;
              height: 37px;
              max-width: 115px;
              object-fit: contain;
            }
            .ps-topbar-actions { flex-shrink: 0; gap: 5px; }

            .ps-login-btn {
              width: auto;
              min-width: 78px;
              height: 39px;
              padding: 0 8px;
              gap: 5px;
              justify-content: center;
              border-radius: 7px;
              font-size: 9px;
            }
            .ps-action-icon { font-size: 16px; }

            .ps-complaint-btn {
              min-width: 128px;
              height: 39px;
              padding: 0 6px;
              gap: 5px;
              justify-content: center;
            }
            .ps-complaint-icon { font-size: 15px; }
            .ps-complaint-text strong { font-size: 7.5px; white-space: nowrap; }
            .ps-complaint-text small { font-size: 6px; white-space: nowrap; }
          }

          /* 400px small mobile */
          @media (max-width: 400px) {
            .ps-topbar-inner {
              min-height: 54px;
              padding: 6px;
              gap: 4px;
            }
            .ps-mobile-logo { height: 31px; max-width: 88px; }
            .ps-topbar-actions { gap: 4px; }

            .ps-login-btn {
              min-width: 68px;
              height: 36px;
              padding: 0 6px;
              gap: 4px;
              font-size: 8px;
              border-radius: 6px;
            }
            .ps-action-icon { font-size: 14px; }

            .ps-complaint-btn {
              min-width: 108px;
              height: 36px;
              padding: 0 5px;
              gap: 4px;
            }
            .ps-complaint-icon { font-size: 14px; }
            .ps-complaint-text strong { font-size: 7px; }
            /* on very small screens hide the second line rather than make it unreadably small */
            .ps-complaint-text small { display: none; }
          }
        `}</style>
      </nav>

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
