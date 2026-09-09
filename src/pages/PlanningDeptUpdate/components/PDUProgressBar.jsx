// src\pages\PlanningDeptUpdate\components\PDUProgressBar.jsx
import React from "react";
import "./styles/PDUProgressBar.css";

/**
 * PDUProgressBar - A dynamic progress bar indicating block upload status.
 *
 * @param {number} current - The number of blocks successfully uploaded.
 * @param {number} total - The total number of blocks to upload (Defaults to 108).
 * @param {string} label - Text label to display above the progress bar.
 */
const PDUProgressBar = ({
  current = 0,
  total = 108,
  label = "Pushing Data to Planning Dept...",
}) => {
  // Calculate the percentage safely
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Dynamic color calculation based on your provided CSS stages
  const getProgressBarColor = (pct) => {
    if (pct < 20) return "#f63a0f"; // 5% state (Red)
    if (pct < 45) return "#f27011"; // 25% state (Dark Orange)
    if (pct < 70) return "#f2b01e"; // 50% state (Orange/Yellow)
    if (pct < 95) return "#f2d31b"; // 75% state (Yellow)
    return "#86e01e"; // 100% state (Green)
  };

  return (
    <div className="pdu-progress-container">
      <div className="pdu-progress-header">
        <span className="pdu-progress-label">{label}</span>
        <span className="pdu-progress-stats">
          {current} / {total} Blocks ({clampedPercentage}%)
        </span>
      </div>

      <div className="pdu-progress-track">
        <div
          className="pdu-progress-fill"
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: getProgressBarColor(clampedPercentage),
          }}
        ></div>
      </div>
    </div>
  );
};

export default PDUProgressBar;
