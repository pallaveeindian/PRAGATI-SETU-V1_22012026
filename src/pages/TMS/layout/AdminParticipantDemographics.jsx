// src\pages\TMS\layout\AdminParticipantDemographics.jsx
import React from "react";
import { FaUserFriends, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";

// Helper to render beautiful stat bars
const StatBarList = ({ dataMap, total }) => {
  if (!dataMap || Object.keys(dataMap).length === 0) {
    return (
      <div style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>
        No data available
      </div>
    );
  }

  const entries = Object.entries(dataMap).sort((a, b) => b[1] - a[1]); // Sort descending

  return (
    <div className="stat-bar-list">
      {entries.map(([label, count], idx) => {
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        return (
          <div className="stat-row" key={idx}>
            <div className="stat-labels">
              <span className="stat-name">{label}</span>
              <span className="stat-numbers">
                {count.toLocaleString()} ({percentage}%)
              </span>
            </div>
            <div className="stat-track">
              <div
                className="stat-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function AdminParticipantDemographics({ data }) {
  if (!data) return null;

  const {
    total_trained_beneficiaries,
    beneficiary_breakdown,
    total_trained_trainers,
    trainer_breakdown,
    total_trained_staff,
    staff_breakdown,
  } = data;

  return (
    <div className="demographics-wrapper">
      <h3 className="demo-main-title">Trained Participants Demographics</h3>

      <div className="demo-grid">
        {/* Beneficiaries Card */}
        <div className="demo-card">
          <div className="demo-header" style={{ borderBottomColor: "#bae6fd" }}>
            <div
              className="dh-icon"
              style={{ background: "#e0f2fe", color: "#0ea5e9" }}
            >
              <FaUserFriends />
            </div>
            <div className="dh-text">
              <h4>Beneficiaries</h4>
              <h2>{total_trained_beneficiaries.toLocaleString()}</h2>
            </div>
          </div>

          <div className="demo-section">
            <h5 className="section-title">By Social Category</h5>
            <StatBarList
              dataMap={beneficiary_breakdown?.by_social_category}
              total={total_trained_beneficiaries}
            />
          </div>
          <div className="demo-section">
            <h5 className="section-title">By Religion</h5>
            <StatBarList
              dataMap={beneficiary_breakdown?.by_religion}
              total={total_trained_beneficiaries}
            />
          </div>
          <div className="demo-section border-0">
            <h5 className="section-title">By PLD Status</h5>
            <StatBarList
              dataMap={beneficiary_breakdown?.by_pld_status}
              total={total_trained_beneficiaries}
            />
          </div>
        </div>

        {/* Trainers Card */}
        <div className="demo-card">
          <div className="demo-header" style={{ borderBottomColor: "#fde68a" }}>
            <div
              className="dh-icon"
              style={{ background: "#fef3c7", color: "#d97706" }}
            >
              <FaChalkboardTeacher />
            </div>
            <div className="dh-text">
              <h4>Master Trainers</h4>
              <h2>{total_trained_trainers.toLocaleString()}</h2>
            </div>
          </div>
          <div className="demo-section border-0">
            <h5 className="section-title">By Designation</h5>
            <StatBarList
              dataMap={trainer_breakdown?.by_designation}
              total={total_trained_trainers}
            />
          </div>
        </div>

        {/* Staff Card */}
        <div className="demo-card">
          <div className="demo-header" style={{ borderBottomColor: "#c7d2fe" }}>
            <div
              className="dh-icon"
              style={{ background: "#ede9fe", color: "#6d28d9" }}
            >
              <FaUserTie />
            </div>
            <div className="dh-text">
              <h4>Staff</h4>
              <h2>{total_trained_staff.toLocaleString()}</h2>
            </div>
          </div>
          <div className="demo-section border-0">
            <h5 className="section-title">By Designation</h5>
            <StatBarList
              dataMap={staff_breakdown?.by_designation}
              total={total_trained_staff}
            />
          </div>
        </div>
      </div>

      <style>{`
        .demographics-wrapper { width: 100%; margin-bottom: 30px; }
        .demo-main-title {
            display: table;
            width: 100%;
            margin: 0 auto 18px auto;
            justify-content: center;
            text-align: center;
            font-size: 22px;
            font-weight: 800;
            color: #12365A;
            padding: 8px 16px;
            line-height: 1.3;
            letter-spacing: 0.2px;

            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 10px;

            box-shadow:
                0 3px 10px rgba(24, 55, 91, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.95);

            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
        }
        
        .demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; align-items: start; }
        
        .demo-card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); overflow: hidden; }
        
        .demo-header { display: flex; align-items: center; gap: 16px; padding: 20px; background: #f8fafc; border-bottom: 3px solid #e2e8f0; }
        .dh-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .dh-text h4 { margin: 0 0 4px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; }
        .dh-text h2 { margin: 0; font-size: 28px; color: #0f172a; font-weight: 800; line-height: 1; }

        .demo-section { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
        .demo-section.border-0 { border-bottom: none; }
        .section-title { font-size: 13px; font-weight: 700; color: #475569; margin: 0 0 12px 0; }

        .stat-bar-list { display: flex; flex-direction: column; gap: 12px; }
        .stat-row { display: flex; flex-direction: column; gap: 6px; }
        .stat-labels { display: flex; justify-content: space-between; align-items: flex-end; font-size: 13px; }
        .stat-name { font-weight: 600; color: #334155; }
        .stat-numbers { font-weight: 700; color: #0f172a; }
        
        .stat-track { width: 100%; height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .stat-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 999px; transition: width 0.8s ease-out; }
      `}</style>
    </div>
  );
}
