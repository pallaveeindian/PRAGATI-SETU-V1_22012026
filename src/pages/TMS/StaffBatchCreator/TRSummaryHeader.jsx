// src/pages/TMS/StaffBatchCreator/TRSummaryHeader.jsx
import React from "react";

const TRSummaryHeader = ({ trDetails, totalUnallocated, trainingPlanName }) => {
  if (!trDetails) return null;

  const trId = trDetails.id || "-";
  const financialYear = trDetails.financial_year || "-";

  // Depending on your API serializer, the plan name might be nested or flat.
  // Fallback to Plan ID if the name isn't immediately available on the TR object.
  const planName =
    trainingPlanName ||
    trDetails.training_plan_name ||
    trDetails.training_plan?.training_name ||
    `Plan ID: ${trDetails.training_plan || "-"}`;

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderLeft: "4px solid #2563eb",
        borderRadius: "8px",
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#1e293b",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          Batch Context: Training Request #{trId}
        </h3>
        <span
          style={{
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Available Pool: {totalUnallocated} Unallocated Staff
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        <div style={styles.infoBlock}>
          <span style={styles.label}>Financial Year</span>
          <span style={styles.value}>{financialYear}</span>
        </div>

        <div style={styles.infoBlock}>
          <span style={styles.label}>Training Plan</span>
          <span style={styles.value}>{planName}</span>
        </div>

        {/* LOCKED PARAMETERS */}
        <div style={styles.infoBlock}>
          <span style={styles.label}>Participant Type 🔒</span>
          <span style={styles.lockedValue}>STAFF</span>
        </div>

        <div style={styles.infoBlock}>
          <span style={styles.label}>Batch Level 🔒</span>
          <span style={styles.lockedValue}>STATE</span>
        </div>

        <div style={styles.infoBlock}>
          <span style={styles.label}>Batch Mode 🔒</span>
          <span style={styles.lockedValue}>SEPARATE</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  infoBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  value: {
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "600",
  },
  lockedValue: {
    fontSize: "13px",
    color: "#475569",
    fontWeight: "700",
    backgroundColor: "#e2e8f0",
    padding: "2px 8px",
    borderRadius: "4px",
    display: "inline-block",
    width: "fit-content",
    border: "1px solid #cbd5e1",
  },
};

export default TRSummaryHeader;
