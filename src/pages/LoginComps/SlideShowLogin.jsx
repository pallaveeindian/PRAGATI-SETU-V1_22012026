// src/pages/LoginComps/SlideShowLogin.jsx
import React, { useState, useEffect } from "react";

// Importing local assets
import farmlhImg from "../../assets/LoginThemes/FARMLH.jpg";
import mfifImg from "../../assets/LoginThemes/MFIF.jpg";
import nonFarmImg from "../../assets/LoginThemes/NON-FARM.jpg";
import sisdImg from "../../assets/LoginThemes/SISD.jpg";
import tncbImg from "../../assets/LoginThemes/TNCB.jpg";

export default function SlideShowLogin({ activeTheme }) {
  const slides = [
    { id: "default", title: "Pragati Setu", img: nonFarmImg },
    { id: "tms", title: "Training Module", img: tncbImg },
    { id: "ldms", title: "Lakhpati Didi", img: farmlhImg },
    { id: "crp", title: "CRP-EP Mapping", img: sisdImg },
    { id: "mou", title: "Enterprise MOU", img: mfifImg },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If an active theme is passed (user clicked a specific portal), lock the slider
    if (activeTheme && activeTheme !== "") {
      const foundIdx = slides.findIndex((s) => s.id === activeTheme);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      }
      return; // Do not start the interval
    }

    // Default auto-transition behavior (10 seconds per slide)
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [activeTheme]);

  return (
    <section className="slideshow-wrapper">
      <div className="slideshow">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`item ${isActive ? "slick-active" : ""}`}
            >
              <div className="img-fill">
                <img src={slide.img} alt={slide.title} />

                {/* Glass Overlay */}
                <div className="slide-overlay">
                  <h1 className="slide-title">Active Modules</h1>
                </div>
              </div>
            </div>
          );
        })}

        {/* Progress Dots mapped manually to replace Slick Slider JS behavior */}
        <ul className="slick-dots">
          {slides.map((_, index) => (
            <li
              key={index}
              className={index === currentIndex ? "slick-active" : ""}
              style={{
                width: `${100 / slides.length}%`,
                left: `${(100 / slides.length) * index}%`,
              }}
            >
              {/* The progress bar fills this <li> */}
            </li>
          ))}
        </ul>
      </div>

      {/* 
        ======================================================================
        HOW TO CROP THE HEIGHT WITHOUT REDUCING/SQUISHING THE IMAGE:
        ======================================================================
        1. Find the `.slideshow` class below. 
        2. Change `height: 50vh;` to whatever height you want (e.g., 400px, 60vh).
        3. The image uses `object-fit: cover;` which guarantees the WHOLE width 
           will stretch across the screen, and any excess top/bottom height 
           is perfectly cropped out without squishing the image. 
        4. If you want the literal entire image to show with blank spaces 
           on the sides, change `object-fit: cover;` to `object-fit: contain;`.
        ======================================================================
      */}
      <style>{`
        .slideshow-wrapper {
          width: 100%;
          background: #0f172a;
        }

        .slideshow {
          position: relative;
          width: 100%;
          /* ----- ADJUST CROP HEIGHT HERE ----- */
          height: 10vh; 
          min-height: 300px;
          overflow: hidden;
          background: rgba(182,148,64,.50);
        }

        .slide-overlay {
          position: absolute;
          inset: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          padding: 2rem;
          text-align: center;

          background: rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);

          transition: all 0.4s ease;
        }

        .slide-title {
          font-size: clamp(2rem, 5vw, 4.5rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;

          color: rgba(255, 255, 255, 0.18);
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.9);

          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

          margin-bottom: 1rem;
        }

        .slide-subtitle {
          max-width: 850px;
          color: rgba(255, 255, 255, 0.95);
          font-size: clamp(1rem, 2vw, 1.35rem);
          line-height: 1.6;
          font-weight: 400;
        }

        .slideshow .item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.9s linear, visibility 0.9s;
          z-index: 1;
        }

        .slideshow .item.slick-active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
        }

        .img-fill {
          width: 100%;
          height: 100%;
          display: block;
          overflow: hidden;
          position: relative;
          text-align: center;
        }

        .img-fill img {
          height: 100%;
          width: 100%;
          position: relative;
          display: inline-block;
          max-width: none;
          
          /* ----- THIS PREVENTS SQUISHING AND CROPS PERFECTLY ----- */
          object-fit: cover; 
          object-position: center;
          
          -webkit-animation: fadeOut 1s both;
                  animation: fadeOut 1s both;
        }

        .slideshow .item.slick-active img {
          -webkit-animation: fadeIn 1s both;
                  animation: fadeIn 1s both;
        }

        .slideshow .item .info {
          position: absolute;
          min-width: 100%;
          height: 100%;
          right: 5%;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          z-index: 3;
        }

        .slideshow .item .info > div {
          display: inline-block !important;
          background: rgba(15, 23, 42, 0.6);
          padding: 20px 40px;
          border-left: 5px solid #B6944C;
        }

        .slideshow .item h3 {
          font-family: 'Century Gothic', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #B6944C;
          margin: 0;
          padding: 0;
          opacity: 0;
        }

        .slideshow .item.slick-active h3 {
          -webkit-animation: fadeIn 1s both 0.5s;
                  animation: fadeIn 1s both 0.5s;
        }

        /* ==== Progress Dots Styling ==== */
        .slideshow .slick-dots {
          position: absolute;
          height: 5px;
          background: rgba(255,255,255,.20);
          bottom: 0px;
          width: 100%;
          left: 0px;
          padding: 0px;
          margin: 0px;
          list-style-type: none;
          z-index: 10;
        }

        .slideshow .slick-dots li {
          float: left;
          height: 5px;
          position: absolute;
          bottom: 0px;
        }

        .slideshow .slick-dots li::after {
          content: "";
          display: block;
          width: 0%;
          height: 100%;
          background: #B6944C;
        }

        .slideshow .slick-dots li.slick-active::after {
          /* Synced to the 10 second interval */
          -webkit-animation: ProgressDots 10s linear both; 
                  animation: ProgressDots 10s linear both;
        }

        @-webkit-keyframes ProgressDots { from { width: 0%; } to { width: 100%; } }
        @keyframes ProgressDots { from { width: 0%; } to { width: 100%; } }

        @-webkit-keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @-webkit-keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        @media (max-width: 768px) {
          .slideshow {
            height: 35vh;
            min-height: 250px;
          }
          .slideshow .item h3 {
            font-size: 1.5rem;
          }
          .slideshow .item .info > div {
            padding: 15px 25px;
          }
        }
      `}</style>
    </section>
  );
}
