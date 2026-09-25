import React, { useEffect } from "react";

import upLogo from "../../assets/upgov_logo.jpg";

import GovHeader from "../GovHeader.jsx";
import TopNavigation from "../HeaderTopNav.jsx";
import Footer from "../../components/layout/Footer.jsx";

import TMSHero from "./TMSHero.jsx";
import TMSOverview from "./TMSOverview.jsx";
import TMSModules from "./TMSModules.jsx"
import TMSBenefits from "./TMSBenefits.jsx";
export default function TMSLayout() {

  const setFontScale = (scale) => {
    document.documentElement.style.setProperty(
      "--font-scale",
      scale
    );
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

          {/* FLOATING NAVIGATION */}
          <div className="tms-top-navigation">
            <TopNavigation />
          </div>

          {/* TMS HERO */}
          <TMSHero />

        </section>


        {/* ================= TMS OVERVIEW ================= */}

        <section
          id="tms-overview"
          className="tms-overview-section"
        >
          <TMSOverview />
        </section>
       {/* ================= TMS MODULES ================= */}
       <section id="tms-modules">
          <TMSModules />
        </section>

  {/* ================= TMS BENEFITS ================= */}
        <section
      id="tms-benefits"
      className="tms-benefits-section"
        >
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
           FLOATING NAVIGATION
        ============================= */

        .tms-top-navigation {
          position: absolute;

          top: 0;
          left: 0;

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


        /* =============================
           TABLET
        ============================= */

        @media (max-width: 900px) {

          .tms-top-navigation {
            position: absolute;

            top: 0;
            left: 0;

            width: 100%;

            z-index: 50;

            background: transparent;
          }

        }

      `}</style>

    </div>
  );
}