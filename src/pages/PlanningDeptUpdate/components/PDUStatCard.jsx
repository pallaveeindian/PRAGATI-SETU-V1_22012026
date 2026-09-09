// src\pages\PlanningDeptUpdate\components\PDUStatCard.jsx
import React from "react";
import "./styles/PDUStatCard.css";

/**
 * PDUStatCard - A reusable card for displaying dashboard statistics.
 *
 * @param {string} title - The label for the stat (e.g., "Total SHGs")
 * @param {string|number} value - The main numeric value (e.g., "969,177")
 * @param {ReactNode} icon - Optional SVG icon to display on the right
 * @param {string} trend - Optional subtitle or trend text (e.g., "Active this month")
 * @param {string} trendDirection - 'up' | 'down' | 'neutral' (determines trend color)
 * @param {string} color - Hex color for the accent line and icon background (default is blue)
 */
const PDUStatCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection = "neutral",
  color = "#3b82f6", // Default Blue
}) => {
  // Format the value with commas if it's a number
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-IN").format(value)
      : value;

  return (
    <div className="pdu-stat-card" style={{ borderBottomColor: color }}>
      <div className="pdu-stat-card-content">
        <div className="pdu-stat-card-info">
          <p className="pdu-stat-card-title">{title}</p>
          <h3 className="pdu-stat-card-value">{formattedValue}</h3>

          {trend && (
            <p className={`pdu-stat-card-trend pdu-trend-${trendDirection}`}>
              {trendDirection === "up" && "↑ "}
              {trendDirection === "down" && "↓ "}
              {trend}
            </p>
          )}
        </div>

        {icon && (
          <div
            className="pdu-stat-card-icon"
            style={{
              backgroundColor: `${color}1A`, // Adds 10% opacity to the hex color
              color: color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDUStatCard;
