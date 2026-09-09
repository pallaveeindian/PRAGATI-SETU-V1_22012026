// src/pages/TMS/TRs/BatchDetailComponents/TrainingPlanInfoCard.jsx
import React from "react";

export default function TrainingPlanInfoCard({ batchData }) {
  if (!batchData) return null;

  const trainingPlan = batchData.training_plan || {};
  const partner = batchData.partner || {};
  const themeName = trainingPlan.theme?.theme_name || "-";

  return (
    <div className="training-section">
      <h3 className="section-title">📋 Training Details</h3>

      <div className="training-grid">
        <div className="info-tile">
          <span className="info-label">Participant Type</span>
          <span className="info-value">
            {batchData.participant_type || "-"}
          </span>
        </div>

        <div className="info-tile">
          <span className="info-label">Level of Training</span>
          <span className="info-value">
            {trainingPlan.level_of_training || "-"}
          </span>
        </div>

        <div className="info-tile">
          <span className="info-label">Training Name</span>
          <span className="info-value">
            {trainingPlan.training_name || "-"}
          </span>
        </div>

        <div className="info-tile">
          <span className="info-label">Type of Training</span>
          <span className="info-value">
            {trainingPlan.type_of_training || "-"}
          </span>
        </div>

        <div className="info-tile">
          <span className="info-label">Theme</span>
          <span className="info-value">{themeName}</span>
        </div>

        <div className="info-tile">
          <span className="info-label">No. of Days</span>
          <span className="info-value">{trainingPlan.no_of_days || "-"}</span>
        </div>

        <div className="info-tile">
          <span className="info-label">Training Partner</span>
          <span className="info-value">{partner.name || "-"}</span>
        </div>
      </div>

      <style>{`
        .section-title {
          margin-bottom: 16px;
          color: #2b4e72;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }
        .training-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }
        .info-tile {
          background: #e4ecf5;
          border: 1px solid #a7c6ed;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 12px;
          color: #5a8cc2;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #2b4e72;
        }
        .info-value.highlight {
          color: #3d6ba6;
          font-weight: 700;
        }
        .training-section {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
