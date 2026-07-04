// src/pages/TMS/TRs/BatchDetailComponents/BatchMetaCard.jsx
import React from "react";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch (e) {
    return iso || "-";
  }
}

export default function BatchMetaCard({ batchData }) {
  if (!batchData) return null;

  return (
    <div className="batch-card">
      <h3 className="batch-title">🎯 Batch Details</h3>

      <div className="batch-grid">
        <div className="batch-item">
          <div className="batch-label">Batch Code</div>
          <div className="batch-value highlight">{batchData.code || "-"}</div>
        </div>

        <div className="batch-item">
          <div className="batch-label">Batch Type</div>
          <div className="batch-value">{batchData.batch_type || "-"}</div>
        </div>

        <div className="batch-item">
          <div className="batch-label">Status</div>
          <div className="batch-value status">{batchData.status || "-"}</div>
        </div>

        <div className="batch-item">
          <div className="batch-label">Financial Year</div>
          <div className="batch-value status">
            {batchData.financial_year || "-"}
          </div>
        </div>

        <div className="batch-item">
          <div className="batch-label">Start Date</div>
          <div className="batch-value">{fmtDate(batchData.start_date)}</div>
        </div>

        <div className="batch-item">
          <div className="batch-label">End Date</div>
          <div className="batch-value">{fmtDate(batchData.end_date)}</div>
        </div>
      </div>

      <style>{`
        .batch-card {
          background: #fff;
          border: 2px solid #a7c6ed;
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 24px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .batch-title {
          margin-bottom: 16px;
          color: #2b4e72;
          font-weight: 700;
          margin-top: 0;
        }
        .batch-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
        }
        .batch-item {
          background: #e4ecf5;
          border: 1px solid #a7c6ed;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .batch-label {
          font-size: 12px;
          color: #5a8cc2;
          margin-bottom: 4px;
        }
        .batch-value {
          font-size: 15px;
          font-weight: 600;
          color: #2b4e72;
        }
        .batch-value.highlight {
          color: #3d6ba6;
          font-weight: 700;
        }
        .batch-value.status {
          color: #3d6ba6;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
