// src/pages/TMS/TRs/BatchDetailComponents/MasterTrainersCard.jsx
import React from "react";

export default function MasterTrainersCard({ masterTrainers }) {
  if (!masterTrainers || masterTrainers.length === 0) {
    return null;
  }

  return (
    <div className="master-trainer-card">
      <div className="master-trainer-heading">
        👨‍🏫 Master Trainer{masterTrainers.length > 1 ? "s" : ""}
      </div>

      <div className="master-trainer-list">
        {masterTrainers.map((trainer, idx) => (
          <div className="master-trainer-info" key={trainer.id || idx}>
            <div>
              <strong>Name:</strong> {trainer.full_name || trainer.name || "-"}
            </div>
            <div>
              <strong>Mobile:</strong>{" "}
              {trainer.mobile_no || trainer.mobile || "-"}
            </div>
            <div>
              <strong>Designation:</strong> {trainer.designation || "-"}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .master-trainer-card {
          background: #e4ecf5;
          border: 2px solid #5a8cc2;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .master-trainer-heading {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 12px;
          color: #3d6ba6;
        }
        .master-trainer-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .master-trainer-info {
          display: flex;
          gap: 24px;
          color: #2b4e72;
          font-size: 14px;
        }
        
        @media (max-width: 600px) {
          .master-trainer-info {
            flex-direction: column;
            gap: 4px;
            border-bottom: 1px dashed #a7c6ed;
            padding-bottom: 10px;
          }
          .master-trainer-info:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
