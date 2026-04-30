// src/pages/EPSMS/EpsmsLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import EpsmsLeftNav from "./Layout/EpsmsLeftnav";
import EpsmsHeader from "./Layout/EpsmsHeader";
import EpsmsFooter from "./Layout/EpsmsFooter";
import bgImage from "../../assets/EPSMS/rform_bg.jpg";

export default function LdmsLayout() {
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="epsms-app-shell">
            {/* ---------------- HEADER ---------------- */}
            <EpsmsHeader onBurgerClick={() => setMobileNavOpen(true)} />

            {/* ---------------- BODY ---------------- */}
            <div className="epsms-body">
                {/* Overlay for mobile */}
                {mobileNavOpen && (
                    <div
                        className="epsms-mobile-overlay"
                        onClick={() => setMobileNavOpen(false)}
                    />
                )}

                {/* LEFT NAV */}
                <EpsmsLeftNav
                    collapsed={navCollapsed}
                    onToggle={() => setNavCollapsed((v) => !v)}
                    mobileOpen={mobileNavOpen}
                    onCloseMobile={() => setMobileNavOpen(false)}
                />

                {/* MAIN / HERO */}
                <main className="epsms-main">
                    <div className="epsms-hero">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* ---------------- FOOTER ---------------- */}
            <EpsmsFooter />

            {/* ---------------- STYLES ---------------- */}
            <style>{`
        /* App shell */
        .epsms-app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8fafc;
          overflow: hidden;
        }

        /* Body */
        .epsms-body {
          display: flex;
          flex: 1;
          min-height: 0; /* CRITICAL: prevents header overlap */
        }

        /* Main content */
        .epsms-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .epsms-hero {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          background-image: url(${bgImage});
          background-repeat: no-repeat;
          background-position: center bottom;
          background-size: cover;
        }

        .epsms-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 80;
        }        
      `}</style>
        </div>
    );
}