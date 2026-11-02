// src/components/ui/NewsPopup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../../assets/NewsPopup/banner.png";

export default function NewsPopup({ onClose }) {
  const navigate = useNavigate();

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
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "90%",
          maxHeight: "90%",
          display: "flex",
          justifyContent: "center",
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
            zIndex: 10,
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
