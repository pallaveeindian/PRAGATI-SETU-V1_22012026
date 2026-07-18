// src/pages/TMS/TP/components/DashThemeChart.jsx
import React, { useState } from "react";

export default function DashThemeChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Fallback if data is missing or empty
  const chartData = data && data.length > 0 ? data : [];

  // Calculate the maximum Y value to scale the heights
  // We stack assigned_targets + achieved_batches
  const maxVal = chartData.reduce(
    (max, item) => Math.max(max, item.assigned_targets + item.achieved_batches),
    1, // Default to 1 to prevent division by zero
  );

  // Generate 5 grid lines for the background
  const gridLines = [4, 3, 2, 1, 0];

  if (!chartData.length) {
    return (
      <div className="theme-chart-card empty-state">
        <p className="muted">No theme metrics available for this selection.</p>
      </div>
    );
  }

  return (
    <div className="theme-chart-card">
      {/* Header matching the image layout */}
      <div className="chart-header">
        <h3 className="chart-title">Theme Metrics Overview</h3>
        <div className="header-options">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="chart-body">
        {/* Background Dashed Grid Lines */}
        <div className="grid-lines-container">
          {gridLines.map((lineIdx) => (
            <div key={lineIdx} className="grid-line" />
          ))}
        </div>

        {/* Bars Container */}
        <div className="bars-container">
          {chartData.map((item, idx) => {
            const isHovered = hoveredIdx === idx;

            // Calculate percentage heights (leaving a little room at the top so bars don't touch the ceiling)
            const scalingFactor = 85;
            const topHeight = (item.assigned_targets / maxVal) * scalingFactor;
            const bottomHeight =
              (item.achieved_batches / maxVal) * scalingFactor;

            return (
              <div
                className="bar-column"
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Custom Tooltip matching the image */}
                {isHovered && (
                  <div className="chart-tooltip">
                    <div className="tooltip-title">{item.theme_name}</div>
                    <div className="tooltip-row">
                      <div className="tooltip-pill top-pill"></div>
                      <span className="tooltip-label">Targets</span>
                      <span className="tooltip-value">
                        {item.assigned_targets.toLocaleString()}
                      </span>
                    </div>
                    <div className="tooltip-row">
                      <div className="tooltip-pill bottom-pill"></div>
                      <span className="tooltip-label">Achieved</span>
                      <span className="tooltip-value">
                        {item.achieved_batches.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stacked Bar with Gap */}
                <div className="stacked-bar">
                  {item.assigned_targets > 0 && (
                    <div
                      className={`bar-segment top-segment ${isHovered ? "hovered" : ""}`}
                      style={{ height: `${topHeight}%` }}
                    ></div>
                  )}
                  {item.achieved_batches > 0 && (
                    <div
                      className={`bar-segment bottom-segment ${isHovered ? "hovered" : ""}`}
                      style={{ height: `${bottomHeight}%` }}
                    ></div>
                  )}
                </div>

                {/* X-Axis Label */}
                <div
                  className={`x-axis-label ${isHovered ? "hovered-label" : ""}`}
                >
                  {item.theme_name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoped CSS for the exact image reproduction */}
      <style>{`
        .theme-chart-card {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
          width: 100%;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          border: 1px dashed #cbd5e1;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .header-options {
          display: flex;
          gap: 3px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .dot {
          width: 4px;
          height: 4px;
          background-color: #94a3b8;
          border-radius: 50%;
        }

        .chart-body {
          position: relative;
          height: 260px;
          width: 100%;
          display: flex;
          align-items: flex-end;
          padding-bottom: 30px; /* Space for X labels */
        }

        .grid-lines-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 1;
        }

        .grid-line {
          height: 1px;
          width: 100%;
          border-top: 1px dashed #e2e8f0;
        }

        .bars-container {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          width: 100%;
          height: 100%;
          padding: 0 16px;
        }

        .bar-column {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          width: 60px;
          cursor: pointer;
        }

        .stacked-bar {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          width: 36px;
          height: 100%;
          gap: 4px; /* The pill gap shown in the image */
          margin-bottom: 12px;
        }

        .bar-segment {
          width: 100%;
          border-radius: 6px;
          background-color: #e2e8f0; /* Default gray for inactive */
          transition: all 0.2s ease;
        }

        /* Hover States for TMS Blue Theme */
        .top-segment.hovered {
          background-color: #93c5fd; /* Light Blue */
        }

        .bottom-segment.hovered {
          background-color: #3b82f6; /* Primary Blue */
          /* Diagonal Stripes exactly like the orange one in the image */
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.15),
            rgba(255, 255, 255, 0.15) 5px,
            transparent 5px,
            transparent 10px
          );
        }

        .x-axis-label {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          text-align: center;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .x-axis-label.hovered-label {
          color: #0f172a;
          font-weight: 700;
        }

        /* Custom Hover Tooltip */
        .chart-tooltip {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translate(-30%, -100%);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          z-index: 100;
          min-width: 160px;
          pointer-events: none;
          animation: slideUpFade 0.2s ease forwards;
        }

        @keyframes slideUpFade {
          0% { opacity: 0; transform: translate(-30%, -90%); }
          100% { opacity: 1; transform: translate(-30%, -100%); }
        }

        .tooltip-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .tooltip-row {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          font-size: 13px;
        }
        .tooltip-row:last-child {
          margin-bottom: 0;
        }

        .tooltip-pill {
          width: 8px;
          height: 14px;
          border-radius: 4px;
          margin-right: 8px;
        }

        .top-pill {
          background-color: #93c5fd;
        }

        .bottom-pill {
          background-color: #3b82f6;
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.2) 3px,
            transparent 3px,
            transparent 6px
          );
        }

        .tooltip-label {
          color: #64748b;
          flex: 1;
        }

        .tooltip-value {
          font-weight: 600;
          color: #0f172a;
          margin-left: 12px;
        }
      `}</style>
    </div>
  );
}
