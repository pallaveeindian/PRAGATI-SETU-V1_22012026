import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiHeadphones, FiArrowRight } from "react-icons/fi";

import { LanguageContext } from "./LanguageContext.jsx";

/* ENGLISH IMAGES */
import nav_logo_en from "../assets/top_nav_banner1.png";
import ps_banner_en from "../assets/top_nav_banner_ps.png";

/* HINDI IMAGES */
import nav_logo_hi from "../assets/top_nav_banner1_hi.png";
import ps_banner_hi from "../assets/top_nav_banner_ps_hi.png";

import Login from "./Login.jsx";

export default function TopNavigation() {
  const { lang } = useContext(LanguageContext);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

  const t = content[lang] || content.en;

  /* =====================================================
     IMAGE LANGUAGE SWITCHING
  ===================================================== */

  const desktopLogo = lang === "hi" ? nav_logo_hi : nav_logo_en;

  const mobileLogo = lang === "hi" ? ps_banner_hi : ps_banner_en;

  /* =====================================================
     LOGIN MODAL SCROLL LOCK
  ===================================================== */

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
          {/* ================= LOGO ================= */}

          <div className="ps-topbar-logo">
            <Link to="/">
              {/* DESKTOP LANGUAGE IMAGE */}

              <img
                src={desktopLogo}
                alt={t.desktopAlt}
                className="ps-desktop-logo"
              />

              {/* MOBILE LANGUAGE IMAGE */}

              <img
                src={mobileLogo}
                alt={t.mobileAlt}
                className="ps-mobile-logo"
              />
            </Link>
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="ps-topbar-actions">
            {/* LOGIN */}

            <button
              type="button"
              className="ps-login-btn"
              onClick={() => setIsLoginOpen(true)}
            >
              <FiUser className="ps-action-icon" />

              <span>{t.login}</span>

              <FiArrowRight className="ps-action-arrow" />
            </button>

            {/* COMPLAINT */}

            <Link to="/register-grievance" className="ps-complaint-btn">
              <FiHeadphones className="ps-complaint-icon" />

              <div className="ps-complaint-text">
                <strong>{t.complaint}</strong>

                <small>{t.grievance}</small>
              </div>

              <FiArrowRight className="ps-action-arrow" />
            </Link>
          </div>
        </div>

        <style>{`

.ps-topbar,.ps-topbar *{box-sizing:border-box}

.ps-topbar{position:relative;z-index:100;width:100%;background:#fff;border-bottom:1px solid #edf0f4;box-shadow:0 2px 8px rgba(15,23,42,.04)}

.ps-topbar-inner{width:100%;max-width:1540px;min-height:105px;margin:0 auto;padding:10px 35px;display:flex;align-items:center;justify-content:space-between;gap:30px}

.ps-topbar-logo{flex:1;min-width:0;display:flex;align-items:center}

.ps-topbar-logo a{display:inline-flex;align-items:center;text-decoration:none}


/* =====================================================
   DESKTOP LOGO
===================================================== */

.ps-desktop-logo{display:block;width:auto;height:82px;max-width:760px;object-fit:contain;object-position:left center}


/* =====================================================
   MOBILE LOGO
===================================================== */

.ps-mobile-logo{display:none;width:auto;height:52px;object-fit:contain}


/* =====================================================
   ACTIONS
===================================================== */

.ps-topbar-actions{flex-shrink:0;display:flex;align-items:center;gap:14px}


/* =====================================================
   LOGIN
===================================================== */

.ps-login-btn{width:190px;height:58px;display:inline-flex;align-items:center;justify-content:center;gap:15px;padding:0 22px;border:none;border-radius:7px;background:#132E4F;color:#fff;font-family:inherit;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 3px 7px rgba(6,58,114,.18);transition:background .25s ease,transform .25s ease,box-shadow .25s ease}

.ps-login-btn:hover{background:#052e5a;transform:translateY(-1px);box-shadow:0 6px 14px rgba(6,58,114,.22)}


/* =====================================================
   COMPLAINT
===================================================== */

.ps-complaint-btn{min-width:295px;height:58px;display:inline-flex;align-items:center;gap:14px;padding:0 18px;border:1.7px solid #174c88;border-radius:7px;background:#fff;color:#132E4F;text-decoration:none;transition:background .25s ease,transform .25s ease,box-shadow .25s ease}

.ps-complaint-btn:hover{background:#f8fbff;transform:translateY(-1px);box-shadow:0 5px 13px rgba(22,76,136,.12)}


/* =====================================================
   ICONS
===================================================== */

.ps-action-icon{flex-shrink:0;font-size:24px;stroke-width:2}

.ps-complaint-icon{flex-shrink:0;color:#132E4F;font-size:29px;stroke-width:2}

.ps-action-arrow{flex-shrink:0;font-size:21px;transition:transform .25s ease}

.ps-login-btn:hover .ps-action-arrow,
.ps-complaint-btn:hover .ps-action-arrow{transform:translateX(4px)}


/* =====================================================
   COMPLAINT TEXT
===================================================== */

.ps-complaint-text{flex:1;display:flex;flex-direction:column;align-items:flex-start;line-height:1.15}

.ps-complaint-text strong{color:#123d72;font-size:15px;font-weight:800;white-space:nowrap}

.ps-complaint-text small{margin-top:4px;color:#334155;font-size:11px;font-weight:700}


/* =====================================================
   1400+
===================================================== */

@media(min-width:1400px){

.ps-topbar-inner{max-width:1600px;min-height:112px;padding:10px 40px}

.ps-desktop-logo{height:88px;max-width:790px}

.ps-login-btn{width:195px;height:60px;font-size:16px}

.ps-complaint-btn{min-width:305px;height:60px}

}


/* =====================================================
   1200
===================================================== */

@media(max-width:1200px){

.ps-topbar-inner{min-height:92px;padding:9px 25px;gap:20px}

.ps-desktop-logo{height:68px;max-width:600px}

.ps-topbar-actions{gap:10px}

.ps-login-btn{width:160px;height:52px;padding:0 17px;font-size:14px}

.ps-complaint-btn{min-width:255px;height:52px;padding:0 14px;gap:10px}

.ps-complaint-text strong{font-size:13px}

.ps-complaint-text small{font-size:10px}

.ps-complaint-icon{font-size:25px}

}


/* =====================================================
   1024
===================================================== */

@media(max-width:1024px){

.ps-topbar-inner{min-height:82px;padding:8px 20px}

.ps-desktop-logo{height:58px;max-width:500px}

.ps-login-btn{width:135px;height:48px;gap:9px;font-size:12px}

.ps-complaint-btn{min-width:220px;height:48px;padding:0 11px}

.ps-action-icon{font-size:20px}

.ps-complaint-icon{font-size:22px}

.ps-complaint-text strong{font-size:11.5px}

.ps-complaint-text small{font-size:9px}

.ps-action-arrow{font-size:17px}

}


/* =====================================================
   900 TABLET
===================================================== */

@media(max-width:900px){

.ps-topbar-inner{width:100%;min-height:68px;padding:8px 14px;gap:12px;display:flex;align-items:center;justify-content:space-between}


/* CHANGE TO MOBILE LANGUAGE IMAGE */

.ps-desktop-logo{display:none}

.ps-mobile-logo{display:block;width:auto;height:48px;max-width:170px;object-fit:contain}


.ps-topbar-logo{flex:1;min-width:0;overflow:hidden}

.ps-topbar-actions{flex:0 0 auto;display:flex;align-items:center;justify-content:flex-end;gap:8px}


/* LOGIN */

.ps-login-btn{flex:0 0 auto;width:auto;min-width:105px;height:44px;padding:0 12px;gap:8px;font-size:11px}


/* COMPLAINT */

.ps-complaint-btn{flex:0 0 auto;min-width:175px;height:44px;padding:0 9px;gap:7px}

.ps-complaint-text strong{font-size:9px}

.ps-complaint-text small{font-size:7px}

.ps-complaint-icon{font-size:18px}

}


/* =====================================================
   600 MOBILE
===================================================== */

@media(max-width:600px){

.ps-topbar-inner{min-height:58px;padding:8px 10px;gap:7px;display:flex;align-items:center;justify-content:space-between}

.ps-topbar-logo{flex:1;min-width:0}

.ps-mobile-logo{display:block;width:auto;height:38px;max-width:120px;object-fit:contain}

.ps-topbar-actions{flex-shrink:0;display:flex;align-items:center;gap:6px}


/* LOGIN */

.ps-login-btn{display:inline-flex!important;width:auto;min-width:82px;height:40px;padding:0 9px;gap:6px;align-items:center;justify-content:center;border-radius:7px;font-size:10px;font-weight:700}

.ps-login-btn span{display:inline-block!important}

.ps-action-icon{display:block;flex-shrink:0;font-size:18px}

.ps-login-btn .ps-action-arrow{display:none}


/* COMPLAINT */

.ps-complaint-btn{display:inline-flex!important;min-width:138px;height:40px;padding:0 7px;gap:5px}

.ps-complaint-icon{flex-shrink:0;font-size:17px}

.ps-complaint-text{min-width:0}

.ps-complaint-text strong{font-size:7.5px;white-space:nowrap}

.ps-complaint-text small{font-size:6px;white-space:nowrap}

.ps-complaint-btn .ps-action-arrow{display:none}

}


/* =====================================================
   400 SMALL MOBILE
===================================================== */

@media(max-width:400px){

.ps-topbar-inner{min-height:54px;padding:7px;gap:4px}

.ps-mobile-logo{height:32px;max-width:92px}

.ps-topbar-actions{flex-shrink:0;gap:4px}


/* LOGIN */

.ps-login-btn{display:inline-flex!important;width:auto;min-width:72px;height:36px;padding:0 7px;gap:5px;font-size:8px;border-radius:6px}

.ps-login-btn span{display:inline-block!important}

.ps-action-icon{font-size:16px;flex-shrink:0}

.ps-login-btn .ps-action-arrow{display:none}


/* COMPLAINT */

.ps-complaint-btn{display:inline-flex!important;min-width:116px;height:36px;padding:0 5px;gap:4px}

.ps-complaint-icon{font-size:15px}

.ps-complaint-text strong{font-size:6.3px}

.ps-complaint-text small{font-size:5.3px}

.ps-complaint-btn .ps-action-arrow{display:none}

}

        `}</style>
      </nav>

      {/* =====================================================
          LOGIN MODAL
      ===================================================== */}

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
