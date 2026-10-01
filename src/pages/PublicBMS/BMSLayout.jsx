// src/pages/PublicBMS/BMSLayout.jsx

import React from "react";

import GovHeader from "../GovHeader.jsx";
import TopNavigation from "../HeaderTopNav.jsx";
import HeaderTopMenu from "../HeaderTopMenu.jsx";
import HeaderTopHeadline from "../HeaderTopHeadline.jsx";

import Footer from "../../components/layout/Footer.jsx";

import upLogo from "../../assets/upgov_logo.jpg";

import BMSHero from "./BMSHero.jsx";
import BMSOverview from "./BMSOverview.jsx";
import BMSFeatures from "./BMSFeatures.jsx";
import BMSPragatiInfo from "./BMSPragatiInfo.jsx";


export default function BMSLayout() {
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty(
      "--font-scale",
      scale
    );
  };

  return (
    <div className="bms-page">

      <GovHeader
        logo={upLogo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />

      <TopNavigation />

      <HeaderTopMenu />

      <HeaderTopHeadline />

      <main className="bms-main">

        <BMSHero />

        <BMSOverview />

        <BMSFeatures />

        <BMSPragatiInfo />

       

      </main>

      <Footer />

    </div>
  );
}