// src/pages/TMS/TRs/BatchDetailComponents/SharedMediaLightbox.jsx
import React from "react";

export default function SharedMediaLightbox({ mediaPreviewSrc, onClose }) {
  if (!mediaPreviewSrc) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        cursor: "zoom-out",
      }}
    >
      <img
        src={mediaPreviewSrc}
        alt="Preview"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: 6,
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}
