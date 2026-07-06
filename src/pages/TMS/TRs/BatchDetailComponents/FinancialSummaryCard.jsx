// src/pages/TMS/TRs/BatchDetailComponents/FinancialSummaryCard.jsx
import React from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";

export default function FinancialSummaryCard({ batchCosting }) {
  if (!batchCosting) {
    return null;
  }

  return (
    <div className="financial-card">
      <h3 className="financial-title">
        <FaFileInvoiceDollar style={{ marginRight: "8px" }} /> Financial Summary
      </h3>

      <div className="financial-grid">
        <div className="financial-item">
          <div className="financial-label">Field Visit Cost</div>
          <div className="financial-value">
            ₹ {batchCosting.field_visit_cost || 0}
          </div>
        </div>

        <div className="financial-item highlight-item">
          <div className="financial-label highlight-label">
            Grand Total Cost
          </div>
          <div className="financial-value highlight-value">
            ₹ {batchCosting.grand_total_cost || 0}
          </div>
        </div>
      </div>

      <style>{`
        .financial-card {
          background: #f8fafc;
          border: 2px solid #a7c6ed;
          border-radius: 10px;
          padding: 18px;
          margin-top: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .financial-title {
          margin-bottom: 16px;
          color: #2b4e72;
          font-weight: 700;
          margin-top: 0;
          display: flex;
          align-items: center;
        }
        .financial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }
        .financial-item {
          background: #e4ecf5;
          border: 1px solid #a7c6ed;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .financial-label {
          font-size: 12px;
          color: #5a8cc2;
          margin-bottom: 4px;
        }
        .financial-value {
          font-size: 15px;
          font-weight: 600;
          color: #2b4e72;
        }
        .highlight-item {
          background: #e0e7ff;
          border-color: #c7d2fe;
        }
        .highlight-label {
          color: #4338ca;
        }
        .highlight-value {
          color: #3730a3;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
}
