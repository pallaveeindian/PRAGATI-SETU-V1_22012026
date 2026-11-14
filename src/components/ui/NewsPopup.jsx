// src/components/ui/NewsPopup.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Fireworks } from "fireworks-js";
import bannerImg from "../../assets/NewsPopup/banner.png";

export default function NewsPopup({ onClose }) {
  const navigate = useNavigate();
  const fireworksContainerRef = useRef(null);

  useEffect(() => {
    if (!fireworksContainerRef.current) return;

    const fireworks = new Fireworks(fireworksContainerRef.current, {
      autoresize: true,
      opacity: 0.75,
      acceleration: 1.05,
      friction: 0.96,
      gravity: 1.5,
      particles: 80,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 6,
      intensity: 35,
      flickering: 50,
      lineStyle: "round",
      hue: {
        min: 0,
        max: 360,
      },
      delay: {
        min: 20,
        max: 45,
      },
      // Concentrates rocket launches in the bottom-left corner
      rocketsPoint: {
        min: 10,
        max: 35,
      },
      lineWidth: {
        explosion: {
          min: 1.5,
          max: 3.5,
        },
        trace: {
          min: 1,
          max: 2,
        },
      },
      brightness: {
        min: 55,
        max: 85,
      },
      decay: {
        min: 0.015,
        max: 0.03,
      },
      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    });

    fireworks.start();

    return () => {
      fireworks.stop(true);
    };
  }, []);

  // Close modal if the user clicks exactly on the blurred background
  const handleOverlayClick = (e) => {
    if (e.target.id === "news-popup-overlay") {
      onClose();
    }
  };

  // Redirect to TMS Login if the user clicks anywhere on the banner
  const handleBannerClick = () => {
    onClose();
    navigate("/module-login?module=tms");
  };

  return (
    <div
      id="news-popup-overlay"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999999, // Renders on top of absolutely everything
        overflow: "hidden",
      }}
    >
      {/* Bottom-Left Corner Fireworks Overlay (Over the backdrop & modal corner) */}
      <div
        ref={fireworksContainerRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "clamp(300px, 48vw, 620px)",
          height: "clamp(300px, 60vh, 620px)",
          pointerEvents: "none", // Ensures clicks pass right through to the banner or backdrop
          zIndex: 15,
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "90%",
          maxHeight: "90%",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#dc2626", // Red background
            color: "white",
            border: "2px solid white",
            fontWeight: "bold",
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            zIndex: 20,
          }}
          title="Close"
        >
          ✕
        </button>

        {/* Clickable Banner Image */}
        <img
          src={bannerImg}
          alt="Important Notice"
          onClick={handleBannerClick}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            cursor: "pointer", // Indicates the banner is clickable
          }}
        />
      </div>
    </div>
  );
}
