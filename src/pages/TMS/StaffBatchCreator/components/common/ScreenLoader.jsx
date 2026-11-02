// src\pages\TMS\StaffBatchCreator\components\common\ScreenLoader.jsx
import React, { useEffect } from "react";

const ScreenLoader = () => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(255, 255, 255, 0.85)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "45px",
          height: "45px",
          border: "5px solid #e5e7eb",
          borderTop: "5px solid #2563eb",
          borderRadius: "50%",
          animation: "screenSpin 0.8s linear infinite",
        }}
      />

      <span style={{ color: "#334155", fontSize: "14px" }}>Loading...</span>

      <style>{`
        @keyframes screenSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScreenLoader;
