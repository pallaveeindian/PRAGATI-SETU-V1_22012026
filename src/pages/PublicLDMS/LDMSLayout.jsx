// src/pages/PublicLDMS/LDMSLayout.jsx

import React, { useEffect } from "react";

import upLogo from "../../assets/upgov_logo.jpg";

import GovHeader from "../GovHeader.jsx";
import TopNavigation from "../HeaderTopNav.jsx";
import Footer from "../../components/layout/Footer.jsx";

import LDMSHero from "./LDMSHero.jsx";
import LDMSOverview from "./LDMSOverview.jsx";
import LDMSModules from "./LDMSModules.jsx";
import LDMSBenefits from "./LDMSBenefits.jsx";
import HeaderTopMenu from "../HeaderTopMenu.jsx";
import HeaderTopHeadline from "../HeaderTopHeadline.jsx";


export default function LDMSLayout() {

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
    <div className="ldms-page">

      {/* ================= GOV HEADER ================= */}

      <GovHeader
        logo={upLogo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />


      {/* ================= MAIN ================= */}

      <main className="ldms-layout">

        {/* HERO + NAVIGATION */}

        <section className="ldms-hero-wrapper">

          <div className="ldms-top-navigation">
            <TopNavigation />
            <HeaderTopMenu />
            <HeaderTopHeadline />
          </div>

          <LDMSHero />

        </section>

      </main>

{/* LDMS OVERVIEW*/}
      <section
  id="ldms-overview"
  className="ldms-overview-section"
>
  <LDMSOverview />
</section>

{/* LDMS MODULES*/}
<section
  id="ldms-modules"
  className="ldms-modules-section"
>
  <LDMSModules />
</section>

{/* LDMS BENEFITS*/}
<section
  id="ldms-benefits"
  className="ldms-benefits-section"
>
  <LDMSBenefits />
</section>


      {/* ================= FOOTER ================= */}

      <Footer />


      <style>{`

        .ldms-page,
        .ldms-page * {
          box-sizing: border-box;
        }


        .ldms-page {
          width: 100%;
          min-height: 100vh;

          margin: 0;

          background: #ffffff;

          overflow-x: hidden;
        }


        .ldms-layout {
          width: 100%;

          margin: 0;
          padding: 0;
        }


        /* ================= HERO ================= */

        .ldms-hero-wrapper {
          position: relative;

          width: 100%;

          margin: 0;
          padding: 0;

          overflow: hidden;
        }


        /* ================= FLOATING NAV ================= */

        .ldms-top-navigation {
          position: absolute;

          top: 0;
          left: 0;

          width: 100%;

          z-index: 50;

          background: transparent;
        
        }


        /* ================= 1400px+ ================= */

        @media (min-width: 1400px) {

          .ldms-page {
            width: 100%;
          }

        }


        /* ================= 1200px ================= */

        @media (max-width: 1200px) {

          .ldms-layout {
            width: 100%;
          }

        }


        /* ================= 1024px ================= */

        @media (max-width: 1024px) {

          .ldms-hero-wrapper {
            width: 100%;
          }

        }


        /* ================= 900px ================= */

        @media (max-width: 900px) {

          .ldms-top-navigation {
            position: absolute;

            top: 0;
            left: 0;

            width: 100%;

            z-index: 50;
          }

        }


        /* ================= 600px ================= */

        @media (max-width: 600px) {

          .ldms-page {
            overflow-x: hidden;
          }

        }


        /* ================= 400px ================= */

        @media (max-width: 400px) {

          .ldms-page {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
}