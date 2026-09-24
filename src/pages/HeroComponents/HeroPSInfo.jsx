import React from "react";
import PragatiPurposeGraphic from "./PragatiPurposeGraphic";

export default function Info() {
  return (
    <div className="hero-ps-info-only-image">
      <PragatiPurposeGraphic />

      <style>{`
        .hero-ps-info-only-image {
        background: #FEF3EB;
          width: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}