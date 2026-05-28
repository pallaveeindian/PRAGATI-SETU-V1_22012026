// src/pages/MOU/MOULayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import MOUHeader from "./Layout/MOUHeader";
import MOUFooter from "./Layout/MOUFooter";

import bgImage from "../../../assets/EPSMS/rform_bg.jpg";

export default function MOULayout() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="mou-app-shell">
      {/* ---------------- HEADER ---------------- */}
      <MOUHeader onBurgerClick={() => setMobileNavOpen(true)} />

      {/* ---------------- BODY ---------------- */}
      <div className="mou-body">
        {/* ---------------- MAIN ---------------- */}
        <main className="mou-main">
          <div className="mou-hero">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <MOUFooter />

      {/* ---------------- STYLES ---------------- */}
      <style>{`
                .mou-app-shell {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background: #f8fafc;
                    overflow: hidden;
                }

                .mou-body {
                    display: flex;
                    flex: 1;
                    min-height: 0;
                }

                .mou-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    overflow: hidden;
                }

                .mou-hero {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0;
                    background-image: url(${bgImage});
                    background-repeat: no-repeat;
                    background-position: center bottom;
                    background-size: cover;
                }

                .mou-mobile-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: 80;
                }
            `}</style>
    </div>
  );
}
