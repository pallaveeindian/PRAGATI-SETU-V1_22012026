import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import LdmsLeftNav from "./ldms_leftnav";
import LdmsHeader from "./ldms_header";
import LdmsFooter from "./ldms_footer";
import bgImage from "../../../assets/LDMS/background_vector.jpg";

export default function LdmsLayout() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="ldms-app-shell">
      {/* ---------------- HEADER ---------------- */}
      <LdmsHeader onBurgerClick={() => setMobileNavOpen(true)} />

      {/* ---------------- BODY ---------------- */}
      <div className="ldms-body">
        {/* Overlay for mobile */}
        {mobileNavOpen && (
          <div
            className="ldms-mobile-overlay"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* LEFT NAV */}
        <LdmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {/* MAIN / HERO */}
        <main className="ldms-main">
          <div className="ldms-hero">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <LdmsFooter />

      {/* ---------------- STYLES ---------------- */}
      <style>{`
        /* App shell */
        .ldms-app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8fafc;
          overflow: hidden;
        }

        /* Body */
        .ldms-body {
          display: flex;
          flex: 1;
          min-height: 0; /* CRITICAL: prevents header overlap */
        }

        /* Main content */
        .ldms-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .ldms-hero {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          background-image: background-image: url(${bgImage});
          background-repeat: no-repeat;
          background-position: center bottom;
          background-size: cover;
        }

        .ldms-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 80;
        }        
      `}</style>
    </div>
  );
}
