// src/pages/TMS/layout/AdminDashKPI.jsx
import React from "react";
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

export default function AdminDashKPI({ data }) {
  if (!data) return null;

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
  } = data;

  const cards = [
    {
      title: "Total Batches Created",
      value: total_batches_created,
      icon: <FaLayerGroup />,
      iconBg: "#e0e7ff",
      color: "#3b82f6",
      trendText: "Active",
      trendSuffix: "in current FY",
    },
    {
      title: "Scheduled Batches",
      value: scheduled_batches,
      icon: <FaClock />,
      iconBg: "#fef08a",
      color: "#ca8a04",
      trendText: "Upcoming",
      trendSuffix: "training",
    },
    {
      title: "Ongoing Batches",
      value: ongoing_batches,
      icon: <FaSyncAlt />,
      iconBg: "#ffedd5",
      color: "#f97316",
      trendText: "In Progress",
      trendSuffix: "active now",
    },
    {
      title: "Pending Approval",
      value: pending_batches,
      icon: <FaClock />,
      iconBg: "#fef08a",
      color: "#ca8a04",
      trendText: "Awaiting",
      trendSuffix: "action",
    },
    {
      title: "Under Review",
      value: review_batches,
      icon: <FaClock />,
      iconBg: "#fef08a",
      color: "#ca8a04",
      trendText: "Post-training",
      trendSuffix: "evaluations",
    },
    {
      title: "Completed Batches",
      value: completed_batches,
      icon: <FaCheckCircle />,
      iconBg: "#dcfce7",
      color: "#22c55e",
      trendText: "Awaiting",
      trendSuffix: "closure",
    },
    {
      title: "Closed Batches",
      value: closed_batches,
      icon: <FaCheckCircle />,
      iconBg: "#dcfce7",
      color: "#22c55e",
      trendText: "Finalized",
      trendSuffix: "successfully",
    },
    {
      title: "Rejected Batches",
      value: rejected_batches,
      icon: <FaStopCircle />,
      iconBg: "#fce8e8",
      color: "#ef4444",
      trendText: "Requires",
      trendSuffix: "attention",
    },
    {
      title: "Participants Allotted",
      value: total_participants_allotted.toLocaleString(),
      icon: <FaUsers />,
      iconBg: "#f3e8ff",
      color: "#a855f7",
      trendText: "Enrolled",
      trendSuffix: "across batches",
    },
    {
      title: "Participants Trained",
      value: total_participants_trained.toLocaleString(),
      icon: <FaUserGraduate />,
      iconBg: "#ccfbf1",
      color: "#14b8a6",
      trendText: "Certified",
      trendSuffix: "graduates",
    },
  ];

  return (
    <div className="admin-kpi-wrapper">
      <div className="admin-kpi-grid">
        {cards.map((card, idx) => (
          <div className="admin-kpi-card" key={idx}>
            <div className="kpi-header">
              <div
                className="kpi-icon"
                style={{ background: card.iconBg, color: card.color }}
              >
                {card.icon}
              </div>
              <div className="kpi-title">{card.title}</div>
            </div>
            <div className="kpi-value">{card.value}</div>
            <div className="kpi-trend">
              <FaArrowUp
                style={{ color: "#22c55e", fontSize: 10, marginTop: 2 }}
              />
              <div>
                <span style={{ color: "#22c55e", fontWeight: 600 }}>
                  {card.trendText}
                </span>{" "}
                <span style={{ color: "#94a3b8" }}>{card.trendSuffix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .admin-kpi-wrapper { width: 100%; margin-bottom: 24px; }
        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .admin-kpi-card {
          background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px;
          padding: 16px; display: flex; flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: all 0.2s ease;
        }
        .admin-kpi-card:hover { transform: translateY(-3px); border-color: #cbd5e1; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .kpi-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; min-height: 40px; }
        .kpi-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .kpi-title { font-size: 13px; font-weight: 700; color: #475569; line-height: 1.3; }
        .kpi-value { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 8px; font-family: 'Inter', sans-serif; letter-spacing: -0.5px; }
        .kpi-trend { display: flex; align-items: flex-start; gap: 6px; font-size: 11px; line-height: 1.3; }
      `}</style>
    </div>
  );
}
