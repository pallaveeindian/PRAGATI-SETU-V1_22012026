// src/pages/TMS/TP/components/DashKPI.jsx
import React, { useMemo } from "react";
import {
  FaLayerGroup,
  FaSyncAlt,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaUserGraduate,
  FaArrowUp,
  FaStopCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DashKPI({ data, batchesFilter }) {
  const navigate = useNavigate();
  if (!data) return null;

  // Extract relevant sections from the full dashboard API response
  // Fallback to data itself in case parent prop hasn't been updated yet
  const kpi = data.kpi_card_info || data || {};
  const themes = data.theme_wise_metrics || [];

  // 1. Calculate Overall Target & Onboarded Aggregations
  const { totalTarget, totalOnboarded, achievementPercentage } = useMemo(() => {
    let targetSum = 0;
    let onboardedSum = 0;

    themes.forEach((t) => {
      targetSum += t.target || 0;
      onboardedSum += t.onboarded || 0;
    });

    const percentage =
      targetSum > 0 ? ((onboardedSum / targetSum) * 100).toFixed(1) : 0.0;

    return {
      totalTarget: targetSum,
      totalOnboarded: onboardedSum,
      achievementPercentage: percentage,
    };
  }, [themes]);

  // 2. Extract Batch/Participant KPI Metrics
  const {
    total_batches_created = 0,
    pending_batches = 0,
    scheduled_batches = 0,
    ongoing_batches = 0,
    completed_batches = 0,
    review_batches = 0,
    closed_batches = 0,
    rejected_batches = 0,
    total_participants_allotted = 0,
    total_participants_trained = 0,
  } = kpi;

  // Navigate to batch list with status filter
  const handleCardClick = (status) => {
    if (!status) return;

    if (status === "ALL") {
      navigate("/tms/batches-list/");
      return;
    }

    navigate(`/tms/batches-list/?status=${encodeURIComponent(status)}`);
  };

  // 3. Define KPI Cards
  const cards = [
    {
      title: "Total Batches Created",
      value: total_batches_created,
      icon: <FaLayerGroup />,
      iconBg: "#e0e7ff",
      color: "#3b82f6",
      trendText: "Active",
      trendSuffix: "in current FY",
      status: "ALL",
    },
    {
      title: "Scheduled Batches",
      value: scheduled_batches,
      icon: <FaClock />,
      iconBg: "#fef08a",
      color: "#ca8a04",
      trendText: "Awaiting",
      trendSuffix: "approvals",
      status: "SCHEDULED",
    },
    {
      title: "Pending Batches",
      value: pending_batches,
      icon: <FaClock />,
      iconBg: "#fef08a",
      color: "#ca8a04",
      trendText: "Awaiting",
      trendSuffix: "approvals",
      status: "PENDING",
    },
    {
      title: "Ongoing Batches",
      value: ongoing_batches,
      icon: <FaSyncAlt />,
      iconBg: "#ffedd5",
      color: "#f97316",
      trendText: "In Progress",
      trendSuffix: "training active",
      status: "ONGOING",
    },
    {
      title: "Completed Batches",
      value: completed_batches,
      icon: <FaCheckCircle />,
      iconBg: "#dcfce7",
      color: "#22c55e",
      trendText: "Completed",
      trendSuffix: "successfully",
      status: "COMPLETED",
    },
    {
      title: "Batches in Review",
      value: review_batches,
      icon: <FaClock />,
      iconBg: "#fef08a",
      color: "#ca8a04",
      trendText: "Awaiting",
      trendSuffix: "approvals",
      status: "REVIEW",
    },
    {
      title: "Closed Batches",
      value: closed_batches,
      icon: <FaCheckCircle />,
      iconBg: "#dcfce7",
      color: "#22c55e",
      trendText: "Completed",
      trendSuffix: "successfully",
      status: "CLOSED",
    },
    {
      title: "Rejected Batches",
      value: rejected_batches,
      icon: <FaStopCircle />,
      iconBg: "#fcdcdc",
      color: "#c52222",
      trendText: "Requires",
      trendSuffix: "attention",
      status: "REJECTED",
    },
    {
      title: "Participants Onboarded",
      value: total_participants_allotted.toLocaleString(),
      icon: <FaUsers />,
      iconBg: "#f3e8ff",
      color: "#a855f7",
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
      iconBg: "#ccfbf1",
      color: "#14b8a6",
      trendText: batchesFilter === "closed" ? "Certified" : "Future",
      trendSuffix: "graduates",
    },
  ];

  return (
    <div className="admin-kpi-wrapper">
      {/* BATCH WISE STATS HEADER */}
      <h3 className="kpi-section-title">Batch & Training Metrics Overview</h3>

      {/* KPI GRID */}
      <div className="admin-kpi-grid">
        {" "}
        {cards.map((card, idx) => {
          const isClickable = Object.prototype.hasOwnProperty.call(
            card,
            "status",
          );
          return (
            <div
              className={`admin-kpi-card ${isClickable ? "admin-kpi-card-clickable" : ""}`}
              key={idx}
              onClick={() => isClickable && handleCardClick(card.status)}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleCardClick(card.status);
                }
              }}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              title={
                isClickable
                  ? card.status
                    ? `View ${card.status.toLowerCase()} batches`
                    : "View all batches"
                  : undefined
              }
            >
              {" "}
              <div className="kpi-header">
                {" "}
                <div
                  className="kpi-icon"
                  style={{ background: card.iconBg, color: card.color }}
                >
                  {" "}
                  {card.icon}{" "}
                </div>{" "}
                <div className="kpi-title">{card.title}</div>{" "}
              </div>{" "}
              <div className="kpi-value">{card.value}</div>{" "}
              <div className="kpi-trend">
                {" "}
                <FaArrowUp
                  style={{ color: "#22c55e", fontSize: 15, marginTop: 2 }}
                />{" "}
                <div>
                  {" "}
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>
                    {" "}
                    {card.trendText}{" "}
                  </span>{" "}
                  <span style={{ color: "#94a3b8" }}>
                    {" "}
                    {card.trendSuffix}{" "}
                  </span>{" "}
                </div>{" "}
              </div>
            </div>
          );
        })}{" "}
      </div>

      {/* STYLES */}
      <style>{`
        .admin-kpi-wrapper { width: 100%; margin-bottom: 24px; }
        .tb-left { display: flex; flex-direction: column; gap: 8px; }
        .tb-title { margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #bfdbfe; }
        .tb-numbers { display: flex; align-items: baseline; gap: 10px; font-family: 'Inter', sans-serif; }
        .tb-onboarded { font-size: 40px; font-weight: 800; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .tb-divider { font-size: 28px; font-weight: 300; opacity: 0.5; }
        .tb-target { font-size: 24px; font-weight: 600; opacity: 0.9; }

        .tb-right { flex: 1; min-width: 250px; max-width: 400px; display: flex; flex-direction: column; align-items: flex-end; }
        .tb-progress-text { font-size: 20px; font-weight: 800; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .tb-progress-bar-bg { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.2); border-radius: 999px; overflow: hidden; margin-bottom: 8px; }
        .tb-progress-bar-fill { height: 100%; background: #4ade80; border-radius: 999px; transition: width 1s ease-out; box-shadow: 0 0 10px rgba(74, 222, 128, 0.5); }
        .tb-subtitle { font-size: 13px; font-weight: 500; color: #bfdbfe; }

        .kpi-section-title {
            position: relative;
            font-size: 23px;
            font-weight: 800;
            color: #163A63;
            padding-bottom: 13px;
            text-align: center;
            letter-spacing: 0.4px;
            line-height: 1.3;
            border-bottom: 2px solid #dbe5f0;

            text-shadow:
                0 1px 2px rgba(255, 255, 255, 0.95),
                0 2px 5px rgba(30, 58, 138, 0.12);
        }

        /* Standard KPI Grid Styles */
        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(220px, 1fr));
          gap: 16px;
        }
        .admin-kpi-card {
          background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px;
          padding: 16px; display: flex; flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: all 0.2s ease;
        }

        .admin-kpi-card-clickable { cursor: pointer; }

        .admin-kpi-card:hover { transform: translateY(-3px); border-color: #cbd5e1; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .admin-kpi-card-clickable:hover { border-color: #3b82f6; box-shadow: 0 12px 20px -5px rgba(59, 130, 246, 0.18); } .admin-kpi-card-clickable:active { transform: translateY(-1px); } .admin-kpi-card-clickable:focus-visible { outline: 3px solid rgba(59, 130, 246, 0.35); outline-offset: 2px; }
        
        .kpi-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; min-height: 40px; }
        .kpi-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .kpi-title { font-size: 13px; font-weight: 700; color: #475569; line-height: 1.3; }
        .kpi-value { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 8px; font-family: 'Inter', sans-serif; letter-spacing: -0.5px; }
        .kpi-trend { display: flex; align-items: flex-start; gap: 6px; font-size: 15px; line-height: 1.3; }

        @media (max-width: 640px) {
          .target-highlight-banner { flex-direction: column; align-items: flex-start; }
          .tb-right { width: 100%; max-width: 100%; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
