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
  FaCross,
  FaRegObjectGroup,
  FaSkullCrossbones,
  FaStopCircle,
} from "react-icons/fa";

export default function DashKPI({ data, batchesFilter }) {
  if (!data) return null;

  // Destructure with fallbacks to 0
  const {
    total_batches_created = 0,
    // draft_batches = 0,
    pending_batches = 0,
    scheduled_batches = 0,
    ongoing_batches = 0,
    completed_batches = 0,
    review_batches = 0,
    closed_batches = 0,
    rejected_batches = 0,
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
    // {
    //   title: "Batches saved as Draft",
    //   value: draft_batches,
    //   icon: <FaClock />,
    //   iconBg: "#fef08a", // Soft Yellow
    //   iconColor: "#ca8a04", // Yellow-Brown
    //   trendText: "Awaiting",
    //   trendSuffix: "approvals",
    // },
    {
      title: "Scheduled Batches",
      value: scheduled_batches,
      icon: <FaClock />,
      iconBg: "#fef08a", // Soft Yellow
      iconColor: "#ca8a04", // Yellow-Brown
      trendText: "Awaiting",
      trendSuffix: "approvals",
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
      title: "Ongoing Batches",
      value: ongoing_batches,
      icon: <FaSyncAlt />,
      iconBg: "#ffedd5", // Soft Orange
      iconColor: "#f97316", // Orange
      trendText: "In Progress",
      trendSuffix: "training active",
    },
    {
      title: "Completed Batches",
      value: completed_batches,
      icon: <FaCheckCircle />,
      iconBg: "#dcfce7", // Soft Green
      iconColor: "#22c55e", // Green
      trendText: "Completed",
      trendSuffix: "successfully",
    },
    {
      title: "Batches in Review",
      value: review_batches,
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
      title: "Rejected Batches",
      value: rejected_batches,
      icon: <FaStopCircle />,
      iconBg: "#fcdcdc", // Soft Red
      iconColor: "#c52222", // Red
      trendText: "Completed",
      trendSuffix: "successfully",
    },
    {
      title: "Participants Onboarded",
      value: total_participants_allotted.toLocaleString(),
      icon: <FaUsers />,
      iconBg: "#f3e8ff", // Soft Purple
      iconColor: "#a855f7", // Purple
      trendText: "Enrolled",
      trendSuffix: "across all batches",
    },
    {
      title:
        batchesFilter === "closed"
          ? "Trained Participants"
          : "Participants Enrolled in Batches",
      value: total_participants_trained.toLocaleString(),
      icon: <FaUserGraduate />,
      iconBg: "#ccfbf1", // Soft Mint/Green
      iconColor: "#14b8a6", // Teal
      trendText: batchesFilter === "closed" ? "Certified" : "Future",
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
              <div className="kpi-trend-text">
                <span className="kpi-trend-highlight">{card.trendText}</span>
                <span className="kpi-trend-suffix">{card.trendSuffix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .kpi-dashboard-wrapper {
          padding: 12px;
          width: 100%;
        }

        /* Switched to flex to force a single row that shrinks dynamically */
        .kpi-grid {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 12px;
          width: 100%;
        }

        /* Cards scaled down, forced to share equal width and shrink */
        .kpi-card {
          background: #ffffff;
          border: 3px solid #00217442;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 5px 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex: 1 1 0;
          min-width: 0; /* Prevents text overflow from breaking the flex container */
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
        }

        .kpi-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
          min-height: 52px; /* Same space reserved for every title */
        }

        /* Shrunk icon box */
        .kpi-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        /* Scaled down text with truncation to prevent wrapping */
        .kpi-title {
          flex: 1;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          font-family: 'Inter', system-ui, sans-serif;
          white-space: wrap;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* Maximum 2 lines */
          min-height: 32px; /* Reserve exactly 2 lines */
        }

        /* Scaled down numbers */
        .kpi-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a; /* Slate 900 */
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Trend row scaling and truncation */
        .kpi-trend-row {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          font-size: 11px;
          font-family: 'Inter', system-ui, sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kpi-trend-icon {
          color: #22c55e; /* Green 500 */
          font-size: 10px;
          flex-shrink: 0;
        }

        .kpi-trend-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          min-width: 0;
        }

        .kpi-trend-highlight {
          color: #22c55e;
          font-size: 11px;
          font-weight: 600;
        }

        .kpi-trend-suffix {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 500;
          white-space: normal;
          word-break: break-word;
        }

        /* Hide the entire KPI section on Mobile */
        @media (max-width: 768px) {
          .kpi-dashboard-wrapper {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
