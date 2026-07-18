// src/pages/TMS/TP/components/DashKPI.jsx
import React from "react";
import {
  FaLayerGroup,
  FaSyncAlt,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaUserGraduate,
  FaArrowUp,
} from "react-icons/fa";

export default function DashKPI({ data }) {
  if (!data) return null;

  // Destructure with fallbacks to 0
  const {
    total_batches_created = 0,
    ongoing_batches = 0,
    pending_batches = 0,
    closed_batches = 0,
    total_participants_allotted = 0,
    total_participants_trained = 0,
  } = data;

  // Configuration for the cards to keep the JSX clean
  const cards = [
    {
      title: "Total Batches Created",
      value: total_batches_created,
      icon: <FaLayerGroup />,
      iconBg: "#e0e7ff", // Soft Blue
      iconColor: "#3b82f6", // TMS Primary Blue
      trendText: "Active",
      trendSuffix: "in current FY",
    },
    {
      title: "Ongoing Batches",
      value: ongoing_batches,
      icon: <FaSyncAlt />,
      iconBg: "#ffedd5", // Soft Orange
      iconColor: "#f97316", // Orange
      trendText: "In Progress",
      trendSuffix: "training active",
    },
    {
      title: "Pending Batches",
      value: pending_batches,
      icon: <FaClock />,
      iconBg: "#fef08a", // Soft Yellow
      iconColor: "#ca8a04", // Yellow-Brown
      trendText: "Awaiting",
      trendSuffix: "approvals",
    },
    {
      title: "Closed Batches",
      value: closed_batches,
      icon: <FaCheckCircle />,
      iconBg: "#dcfce7", // Soft Green
      iconColor: "#22c55e", // Green
      trendText: "Completed",
      trendSuffix: "successfully",
    },
    {
      title: "Participants Allotted",
      value: total_participants_allotted.toLocaleString(),
      icon: <FaUsers />,
      iconBg: "#f3e8ff", // Soft Purple
      iconColor: "#a855f7", // Purple
      trendText: "Enrolled",
      trendSuffix: "across all batches",
    },
    {
      title: "Participants Trained",
      value: total_participants_trained.toLocaleString(),
      icon: <FaUserGraduate />,
      iconBg: "#ccfbf1", // Soft Mint/Green
      iconColor: "#14b8a6", // Teal
      trendText: "Certified",
      trendSuffix: "graduates",
    },
  ];

  return (
    <div className="kpi-dashboard-wrapper">
      <div className="kpi-grid">
        {cards.map((card, index) => (
          <div className="kpi-card" key={index}>
            {/* Top Row: Icon and Title */}
            <div className="kpi-header">
              <div
                className="kpi-icon-box"
                style={{ backgroundColor: card.iconBg, color: card.iconColor }}
              >
                {card.icon}
              </div>
              <div className="kpi-title">{card.title}</div>
            </div>

            {/* Middle Row: Main Value */}
            <div className="kpi-value">{card.value}</div>

            {/* Bottom Row: Trend Indicator matching image_f0d887.png */}
            <div className="kpi-trend-row">
              <FaArrowUp className="kpi-trend-icon" />
              <span className="kpi-trend-highlight">{card.trendText}</span>
              <span className="kpi-trend-suffix">{card.trendSuffix}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .kpi-dashboard-wrapper {
          width: 100%;
          margin-bottom: 32px;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          width: 100%;
        }

        /* Card exactly matching the uploaded image */
        .kpi-card {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .kpi-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .kpi-title {
          font-size: 15px;
          font-weight: 500;
          color: #64748b; /* Slate 500 */
          font-family: 'Inter', system-ui, sans-serif;
        }

        .kpi-value {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a; /* Slate 900 */
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .kpi-trend-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .kpi-trend-icon {
          color: #22c55e; /* Green 500 */
          font-size: 11px;
        }

        .kpi-trend-highlight {
          color: #22c55e; /* Green 500 */
          font-weight: 600;
        }

        .kpi-trend-suffix {
          color: #94a3b8; /* Slate 400 */
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
