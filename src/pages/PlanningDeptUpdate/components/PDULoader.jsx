import React from "react";
import "./styles/PDULoader.css";
import psLogo from "../../../assets/PS_LOGO_SQUARED.jpg";

/**
 * PDULoader - A centered spinning ring loader with a pulsing logo in the middle.
 *
 * @param {string} text - Optional loading text to display below the spinner
 * @param {boolean} fullScreen - If true, centers the loader on the entire screen
 */
const PDULoader = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div
      className={`pdu-loader-wrapper ${fullScreen ? "pdu-loader-fullscreen" : ""}`}
    >
      <div className="pdu-loader-container">
        {/* The spinning outer ring */}
        <div className="pdu-spinner-ring"></div>

        {/* The static/pulsing logo in the exact center */}
        <img src={psLogo} alt="Pragati Setu Logo" className="pdu-loader-logo" />
      </div>

      {text && <p className="pdu-loader-text">{text}</p>}
    </div>
  );
};

export default PDULoader;
