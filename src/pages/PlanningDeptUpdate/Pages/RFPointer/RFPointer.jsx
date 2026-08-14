// src\pages\PlanningDeptUpdate\Pages\RFPointer\RFPointer.jsx
import React, { useState } from "react";
import RFTable from "./RFTable";
import RFSubmission from "./RFSubmission";
import PDUButton from "../../components/PDUButton";

export default function RFPointer() {
  const [activeTab, setActiveTab] = useState("table");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "20px",
          background: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#dcfce7",
              color: "#166534",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Indicator Code: 0512
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            SHGs Received Revolving Fund
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: "0.95rem",
              color: "#6b7280",
            }}
          >
            Planning Department Indicator 0512 • Rural Development Department •
            Monthly Reporting
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: "12px" }}>
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

      {/* View Switcher */}
      <div>
        {activeTab === "table" ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                backgroundColor: "#f0fdf4",
                borderLeft: "4px solid #16a34a",
                padding: "14px 20px",
                borderRadius: "6px",
                color: "#15803d",
                fontSize: "0.9rem",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Verification Notice:</strong> Review the RF distribution
                counts fetched live from Lokos for all 108 Aspirational Blocks
                before triggering the external push.
              </p>
            </div>
            <RFTable />
          </div>
        ) : (
          <RFSubmission />
        )}
      </div>
    </div>
  );
}
