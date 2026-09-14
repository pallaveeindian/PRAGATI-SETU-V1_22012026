// src\pages\TMS\BacklogBatchCreator\components\StepWizardHeader.jsx
import React from "react";

export default function StepWizardHeader({ currentStep, totalSteps }) {
  const steps = [
    "Config & Participants",
    "Duration & E-KYC",
    "Attendance Matrix",
    "Media Uploads",
    "Financial Costs",
    "Final Review",
  ];

  return (
    <div style={{ marginBottom: "32px", padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Background connecting line */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "0",
            right: "0",
            height: "4px",
            background: "#e2e8f0",
            zIndex: 0,
            borderRadius: "2px",
          }}
        ></div>

        {/* Active connecting line */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "0",
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            height: "4px",
            background: "#2563eb",
            zIndex: 1,
            borderRadius: "2px",
            transition: "width 0.4s ease",
          }}
        ></div>

        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div
              key={stepNum}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
                width: "120px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                  background: isActive
                    ? "#2563eb"
                    : isCompleted
                      ? "#10b981"
                      : "#ffffff",
                  color: isActive || isCompleted ? "#ffffff" : "#64748b",
                  border: `2px solid ${isActive ? "#2563eb" : isCompleted ? "#10b981" : "#cbd5e1"}`,
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(37, 99, 235, 0.2)"
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  textAlign: "center",
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? "#1e293b" : "#64748b",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
