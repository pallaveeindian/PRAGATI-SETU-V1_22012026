// src/pages/TMS/StaffBatchCreator/BatchDateConfig.jsx
import React, { useEffect } from "react";

const BatchDateConfig = ({
  trainingDays,
  startDate,
  endDate,
  onDateChange,
}) => {
  // 1. Min/Max Date Constraints
  const getMinStartDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1); // Earliest start is tomorrow
    return minDate.toISOString().split("T")[0];
  };

  const getMaxStartDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60); // Allow scheduling up to 60 days in advance
    return maxDate.toISOString().split("T")[0];
  };

  // 2. Auto-Calculate End Date
  const calculateEndDate = (startStr, days) => {
    if (!startStr || !days) return "";
    const start = new Date(startStr);
    // End date = Start date + (Total Days - 1)
    start.setDate(start.getDate() + Number(days) - 1);
    return start.toISOString().split("T")[0];
  };

  // 3. Keep End Date synced if plan days change (Edge Case Safety)
  useEffect(() => {
    if (startDate && trainingDays) {
      const newEndDate = calculateEndDate(startDate, trainingDays);
      if (newEndDate !== endDate) {
        onDateChange(startDate, newEndDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingDays, startDate]);

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    const newEnd = calculateEndDate(newStart, trainingDays);
    onDateChange(newStart, newEnd);
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0, color: "#1e293b", fontSize: "15px" }}>
          Batch Timeline Configuration
        </h4>
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
          Training Duration:{" "}
          <strong style={{ color: "#2563eb" }}>{trainingDays} Days</strong>
        </span>
      </div>

      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Start Date Selection */}
        <div style={{ flex: "1 1 250px" }}>
          <label style={styles.label}>
            Batch Start Date <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="date"
            value={startDate}
            min={getMinStartDate()}
            max={getMaxStartDate()}
            onChange={handleStartChange}
            style={styles.input}
          />
          <div style={styles.helpText}>
            Select the date the training will commence.
          </div>
        </div>

        {/* End Date (Auto-Calculated & Locked) */}
        <div style={{ flex: "1 1 250px" }}>
          <label style={styles.label}>
            Batch End Date (Auto-calculated) 🔒
          </label>
          <input
            type="date"
            value={endDate}
            disabled
            style={{
              ...styles.input,
              backgroundColor: "#f1f5f9",
              color: "#475569",
              cursor: "not-allowed",
            }}
          />
          <div style={styles.helpText}>
            Calculated automatically based on the {trainingDays}-day training
            plan.
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  helpText: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "6px",
  },
};

export default BatchDateConfig;
