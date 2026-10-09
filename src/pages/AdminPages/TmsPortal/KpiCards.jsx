// src\pages\AdminPages\TmsPortal\KpiCards.jsx
import React from "react";
import {
  FaBullseye,
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaLayerGroup,
  FaRegCalendarAlt,
  FaTasks,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

const KpiCards = ({ kpiData }) => {
  // API se aane wale batch aur participant counts yahan extract kiye
  const bCounts = kpiData?.batch_counts || {};
  const pCounts = kpiData?.participant_counts || {};

  const formatValue = (value) => {
    if (value === undefined || value === null) return 0;
    return typeof value === "string" ? value : value.toLocaleString();
  };

  // Har card me 'batchLabel' add kiya gaya hai taaki wo specific text dikhaye
  const cards = [
    // --- OVERALL STATS (Single Value) ---
    {
      label: "Total Target",
      value: bCounts["10_total_target"],
      isSingle: true,
      border: "border-blue",
      icon: FaBullseye,
    },
    {
      label: "Total Onboarded",
      value: bCounts["11_participants_onboarded"],
      isSingle: true,
      border: "border-indigo",
      icon: FaUsers,
    },

    // --- BATCH & PARTICIPANT STATS (Dual Values) ---
    {
      label: "Total Batches Created",
      batches: bCounts["1_total_batches_created"],
      pax: pCounts["1_total_batches_created"],
      batchLabel: "Total Batches",
      border: "border-purple",
      icon: FaLayerGroup,
    },
    {
      label: "Pending at DMM",
      batches: bCounts["3_batches_pending_at_dmm"],
      pax: pCounts["3_batches_pending_at_dmm"],
      batchLabel: "Pending Batches",
      border: "border-orange",
      icon: FaClock,
    },
    {
      label: "Scheduled Batches",
      batches: bCounts["2_scheduled_batches"],
      pax: pCounts["2_scheduled_batches"],
      batchLabel: "Scheduled",
      border: "border-teal",
      icon: FaRegCalendarAlt,
    },

    {
      label: "Ongoing Batches",
      batches: bCounts["4_ongoing_batches"],
      pax: pCounts["4_ongoing_batches"],
      batchLabel: "Ongoing Batches",
      border: "border-blue",
      icon: FaTasks,
    },
    {
      label: "Completed Batches",
      batches: bCounts["5_completed_batches"],
      pax: pCounts["5_completed_batches"],
      batchLabel: "Completed Batches",
      border: "border-green",
      icon: FaCheckCircle,
    },
    {
      label: "Pending For Verification",
      batches: bCounts["6_completed_batches_for_verification"],
      pax: pCounts["6_completed_batches_for_verification"],
      batchLabel: "Verification Batches",
      border: "border-pink",
      icon: FaExclamationTriangle,
    },
    {
      label: "Completed & Closed",
      batches: bCounts["7_completed_batch_closed"],
      pax: pCounts["7_completed_batch_closed"],
      batchLabel: "Closed Batches",
      border: "border-teal",
      icon: FaClipboardList,
    },
    {
      label: "Rejected by DMM",
      batches: bCounts["8_batches_rejected_by_dmm"],
      pax: pCounts["8_batches_rejected_by_dmm"],
      batchLabel: "Rejected Batches",
      border: "border-red",
      icon: FaTimesCircle,
    },
    {
      label: "Achievement",
      value: bCounts["14_achievement_percentage"] || "0%",
      isSingle: true,
      highlight: true,
      border: "border-green",
      icon: FaChartLine,
    },
  ];

  return (
    <>
      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          margin-bottom: 26px;
        }
        
        .kpi-card {
          background: #ffffff;
          min-height: 142px;
          padding: 17px 18px 16px;
          border-radius: 16px;
          border: 1px solid #e8edf4;
          border-left-width: 4px;
          box-shadow: 0 7px 20px rgba(30,41,59,.06);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .kpi-card::after { content: ''; position:absolute; width:96px; height:96px; right:-30px; top:-35px; border-radius:50%; background:rgba(99,102,241,.055); pointer-events:none; }
        
        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(30,41,59,.11);
        }

        .kpi-label {
          font-size: 11px;
          font-weight: 800;
          color: #53657d;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: .08em;
          display:flex;
          align-items:center;
          gap:9px;
        }
        .kpi-label::before { content:''; width:7px; height:7px; border-radius:50%; background:currentColor; opacity:.7; }
        
        /* Single value style */
        .kpi-single-value {
          font-size: 28px;
          font-weight: 850;
          color: #1e293b;
          margin-top: 18px;
          letter-spacing: -.02em;
        }

        /* Dual value box container - Jaisa aapki image me hai */
        .kpi-dual-stats {
          display: flex;
          background: linear-gradient(145deg,#f8fafc,#f3f6fa);
          border: 1px solid #edf1f5;
          border-radius: 12px;
          padding: 11px 13px;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          flex: 1; /* Dono columns ko equal width dega */
        }

        .stat-item.right {
          text-align: right; /* Participants right side align honge */
          border-left: 1px solid #e2e8f0; /* Dono ke beech ki line */
          padding-left: 16px;
        }

        .stat-val {
          font-size: 20px;
        font-weight: 850;
          color: #0f172a;
          line-height: 1.2;
        }

        .stat-title {
          font-size: 11px;
          color: #64748b;
          font-weight: 650;
          margin-top: 5px;
          white-space: nowrap; /* Text break nahi hoga */
        }

        .text-success { color: #10b981 !important; }

        /* Left Border colors */
        .border-blue { border-left: 4px solid #3b82f6; }
        .border-indigo { border-left: 4px solid #6366f1; }
        .border-purple { border-left: 4px solid #a855f7; }
        .border-green { border-left: 4px solid #10b981; }
        .border-teal { border-left: 4px solid #14b8a6; }
        .border-orange { border-left: 4px solid #f97316; }
        .border-pink { border-left: 4px solid #ec4899; }
        .border-red { border-left: 4px solid #ef4444; }
        .kpi-icon { position:absolute; right:17px; top:16px; z-index:1; width:29px; height:29px; display:grid; place-items:center; border-radius:10px; background:#f1f5f9; color:#64748b; font-size:13px; }
        .border-blue .kpi-icon { color:#2563eb; background:#eff6ff; } .border-indigo .kpi-icon { color:#4f46e5; background:#eef2ff; } .border-purple .kpi-icon { color:#9333ea; background:#faf5ff; } .border-green .kpi-icon { color:#059669; background:#ecfdf5; } .border-teal .kpi-icon { color:#0d9488; background:#f0fdfa; } .border-orange .kpi-icon { color:#ea580c; background:#fff7ed; } .border-pink .kpi-icon { color:#db2777; background:#fdf2f8; } .border-red .kpi-icon { color:#dc2626; background:#fef2f2; }
        @media (max-width: 640px) { .kpi-grid { grid-template-columns: 1fr; gap:11px; } .kpi-card { min-height:128px; } }
      `}</style>

      <div className="kpi-grid">
        {cards.map((card, index) => (
          <div key={index} className={`kpi-card ${card.border}`}>
            <div className="kpi-label">{card.label}</div>
            <span className="kpi-icon">
              <card.icon />
            </span>

            {card.isSingle ? (
              // Single values (Target, Onboarded, Achievement)
              <div
                className={`kpi-single-value ${card.highlight ? "text-success" : ""}`}
              >
                {formatValue(card.value)}
              </div>
            ) : (
              // Dual values (Batches & Participants) with specific labels
              <div className="kpi-dual-stats">
                <div className="stat-item">
                  <span className="stat-val">{formatValue(card.batches)}</span>
                  <span className="stat-title">{card.batchLabel}</span>
                </div>
                <div className="stat-item right">
                  <span className="stat-val">{formatValue(card.pax)}</span>
                  <span className="stat-title">Participants</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default KpiCards;
