// src/pages/HeroComponents/HeroLayout.jsx

import React from "react";
import HeroHome from "./HeroHome";
import Info from "./HeroPSInfo";
import app_section from "../../assets/Hero/SCRPEP/section.png";
import Services from "./HeroPSServices";
import FAQ from "./HeroFAQs";
import faqBg from "../../assets/Hero/faq_bg.png";
import Contact from "./HeroContactUs";
import conBg from "../../assets/Hero/con_us_bg.png";
import sectionPotraitMobileScreen from "../../assets/sectionPotraitMobileScreen.png";
import LatestUpdates from "./HeroLatestUpdates";

/**
 * HeroLayout — full landing-page content container
 */
export default function HeroLayout() {
  return (
    <div className="hero-layout">
      <section className="hero-slideshow-section">
        <HeroHome />
      </section>

      <section className="hero-section hero-info">
        <Info />
      </section>

      <section className="hero-section hero-crp">
        <div className="hero-crp-image">
          <img src={app_section} alt="Pragati Setu Overview" className="hero-desktop-img" />
          <img src={sectionPotraitMobileScreen} alt="Pragati Setu Mobile Overview" className="hero-mobile-img" />
        </div>
      </section>

      <section id="services-section" className="hero-section hero-services">
        <Services />
      </section>

      <section className="hero-section hero-faq">
        <FAQ />
      </section>

      <section className="hero-section hero-contact">
        <Contact />
      </section>

      <section className="hero-section hero-updates">
        <LatestUpdates />
      </section>

      <style>{`
        .hero-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .hero-slideshow-section {
          width: 100%;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .hero-info {
          padding: 0;
          width: 100%;
          overflow: hidden;
        }

        /* general */
        .hero-heading {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
        }
        .hero-placeholder {
          font-size: 16px;
          color: #475569;
          max-width: 800px;
          line-height: 1.6;
        }

        /* CRP application — background shows through the transparent part of the
           image fade; the -1px margin removes a hairline seam with the Info section */
        .hero-crp {
          position: relative;
          width: 100%;
          background: linear-gradient(to bottom, #fff8f2 0%, #fef3eb 12%, #fef3eb 100%);
          margin-top: -1px;
          overflow: hidden;
        }
        .hero-crp-image {
          position: relative;
          width: 100%;
          height: 700px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        /* desktop CRP image — top of the image fades from transparent to fully visible */
        .hero-desktop-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 1.5%, rgba(0, 0, 0, 0.35) 3%, rgba(0, 0, 0, 0.55) 5%, rgba(0, 0, 0, 0.75) 7%, rgba(0, 0, 0, 0.9) 9%, #000 12%, #000 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 1.5%, rgba(0, 0, 0, 0.35) 3%, rgba(0, 0, 0, 0.55) 5%, rgba(0, 0, 0, 0.75) 7%, rgba(0, 0, 0, 0.9) 9%, #000 12%, #000 100%);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .hero-mobile-img {
          display: none;
          width: 100%;
          height: auto;
        }

        .hero-services { width: 100%; }

        .hero-faq {
          background-image: url(${faqBg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .hero-contact {
          background-image: url(${conBg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* 1400px+ large desktop */
        @media (min-width: 1400px) {
          .hero-crp-image { height: 720px; }
          .hero-desktop-img {
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.18) 2%, rgba(0, 0, 0, 0.4) 4%, rgba(0, 0, 0, 0.65) 6%, rgba(0, 0, 0, 0.85) 8%, #000 11%, #000 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.18) 2%, rgba(0, 0, 0, 0.4) 4%, rgba(0, 0, 0, 0.65) 6%, rgba(0, 0, 0, 0.85) 8%, #000 11%, #000 100%);
          }
        }

        /* 1200px laptop */
        @media (max-width: 1200px) {
          .hero-crp-image { height: 620px; }
        }

        /* 1024px small laptop */
        @media (max-width: 1024px) {
          .hero-crp-image { height: 540px; }
          .hero-desktop-img {
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 3%, rgba(0, 0, 0, 0.6) 6%, rgba(0, 0, 0, 0.85) 9%, #000 12%, #000 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 3%, rgba(0, 0, 0, 0.6) 6%, rgba(0, 0, 0, 0.85) 9%, #000 12%, #000 100%);
          }
        }

        /* 900px tablet — switch to the mobile image, same fade effect but a shorter transition */
        @media (max-width: 900px) {
          .hero-crp-image { height: auto; }
          .hero-desktop-img { display: none; }
          .hero-mobile-img {
            display: block;
            width: 100%;
            height: auto;
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.35) 2%, rgba(0, 0, 0, 0.7) 4%, #000 7%, #000 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.35) 2%, rgba(0, 0, 0, 0.7) 4%, #000 7%, #000 100%);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
          }
        }

        /* 600px mobile */
        @media (max-width: 600px) {
          .hero-mobile-img {
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 2%, rgba(0, 0, 0, 0.8) 4%, #000 6%, #000 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 2%, rgba(0, 0, 0, 0.8) 4%, #000 6%, #000 100%);
          }
        }

        /* 400px small mobile */
        @media (max-width: 400px) {
          .hero-mobile-img {
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.55) 2%, #000 5%, #000 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.55) 2%, #000 5%, #000 100%);
          }
        }
      `}</style>
    </div>
  );
}
