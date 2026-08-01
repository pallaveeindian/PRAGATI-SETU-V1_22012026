import React, { useState } from "react";
import SHGTable from "./SHGTable";
import SHGSubmission from "./SHGSubmission";
import PDUButton from "../../components/PDUButton";

/**
 * SHGPointer - Main Container for Pointer 1 (Indicator 0511)
 * Manages tab views for Data Inspection vs. API Submission
 */
export default function SHGPointer() {
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'submission'

  return (
    <div className="pdu-shg-pointer-container">
      {/* Header Banner */}
      <div className="pdu-shg-pointer-header">
        <div>
          <span className="pdu-indicator-badge">Indicator Code: 0511</span>
          <h1 className="pdu-shg-title">Total Households Added to SHGs</h1>
          <p className="pdu-shg-subtitle">
            Planning Department Indicator 0511 • Rural Development Department •
            Monthly Reporting
          </p>
        </div>

        {/* Tab Controls using PDUButton */}
        <div className="pdu-shg-tab-controls">
          <PDUButton
            variant={activeTab === "table" ? "action" : "outline"}
            onClick={() => setActiveTab("table")}
          >
            📊 View 108 Blocks Data
          </PDUButton>
          <PDUButton
            variant={activeTab === "submission" ? "action" : "outline"}
            onClick={() => setActiveTab("submission")}
          >
            🚀 API Upload & Verification
          </PDUButton>
        </div>
      </div>

      {/* Dynamic Content View based on activeTab */}
      <div className="pdu-shg-pointer-body">
        {activeTab === "table" ? (
          <div className="pdu-shg-view-wrapper">
            <div className="pdu-view-callout">
              <p>
                <strong>Verification Notice:</strong> Review the household
                counts (<code>memberCount</code>) fetched live from Lokos for
                all 108 Aspirational Blocks before triggering the external push.
              </p>
            </div>
            <SHGTable />
          </div>
        ) : (
          <div className="pdu-shg-view-wrapper">
            <SHGSubmission />
          </div>
        )}
      </div>

      {/* Scoped Styles */}
      <style>{`
        .pdu-shg-pointer-container {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: calc(100vh - 114px);
        }

        .pdu-shg-pointer-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          background: #ffffff;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .pdu-indicator-badge {
          display: inline-block;
          background-color: #e0f2fe;
          color: #0369a1;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pdu-shg-title {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
        }

        .pdu-shg-subtitle {
          margin: 6px 0 0 0;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .pdu-shg-tab-controls {
          display: flex;
          gap: 12px;
        }

        .pdu-shg-view-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pdu-view-callout {
          background-color: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 14px 20px;
          border-radius: 6px;
          color: #15803d;
          font-size: 0.9rem;
        }

        .pdu-view-callout code {
          background: rgba(22, 163, 74, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .pdu-shg-pointer-header {
            flex-direction: column;
            align-items: stretch;
          }
          .pdu-shg-tab-controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
