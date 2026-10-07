// src\pages\PublicTMS\TMSLayout.jsx
import React, { useEffect } from "react";

import upLogo from "../../assets/upgov_logo.jpg";

import GovHeader from "../GovHeader.jsx";
import TopNavigation from "../HeaderTopNav.jsx";
import Footer from "../../components/layout/Footer.jsx";

import TMSHero from "./TMSHero.jsx";
import TMSOverview from "./TMSOverview.jsx";
import TMSModules from "./TMSModules.jsx";
import TMSBenefits from "./TMSBenefits.jsx";
import HeaderTopMenu from "../HeaderTopMenu.jsx";
import HeaderTopHeadline from "../HeaderTopHeadline.jsx";

export default function TMSLayout() {
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="tms-page">
      <GovHeader
        logo={upLogo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <main className="tms-layout">
        {/* ================= HERO AREA ================= */}

        <section className="tms-hero-wrapper">
          {/* NAVIGATION (normal flow, so the hero starts below it) */}
          <div className="tms-top-navigation">
            <TopNavigation />
            <HeaderTopMenu />
            <HeaderTopHeadline />
          </div>

          {/* TMS HERO */}
          <TMSHero />
        </section>

        {/* ================= TMS OVERVIEW ================= */}

        <section id="tms-overview" className="tms-overview-section">
          <TMSOverview />
        </section>

        {/* ================= TMS MODULES ================= */}

        <section id="tms-modules">
          <TMSModules />
        </section>

        {/* ================= TMS BENEFITS ================= */}

        <section id="tms-benefits" className="tms-benefits-section">
          <TMSBenefits />
        </section>
      </main>

      <Footer />

      <style>{`

        .tms-page,
        .tms-page * {
          box-sizing: border-box;
        }

        .tms-page {
          width: 100%;
          min-height: 100vh;
          background: #ffffff;
          overflow-x: hidden;
        }

        .tms-layout {
          width: 100%;
        }


        /* =============================
           HERO + NAVIGATION
        ============================= */

        .tms-hero-wrapper {
          position: relative;
          width: 100%;
        }


        /* =============================
           NAVIGATION

           position: relative (NOT absolute) keeps it in
           the normal flow, so the hero sits below it
           instead of hiding behind it.
        ============================= */

        .tms-top-navigation {
          position: relative;
          width: 100%;
          z-index: 50;
          background: transparent;
        }


        /* =============================
           OVERVIEW
        ============================= */

        .tms-overview-section {
          width: 100%;
          background: #ffffff;
        }

      `}</style>
    </div>
  );
}
