// src/pages/TMS/StaffBatchCreator/StaffBatchCounter.jsx
import React, { useState } from "react";

const StaffBatchCounter = ({
  selectedCount = 0,
  minRequired = 20,
  maxAllowed = 40,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic Validation Check
  const isValid = selectedCount >= minRequired && selectedCount <= maxAllowed;

  // Dynamic Styling based on validity
  const gradient = isValid
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" // Emerald Green (Valid)
    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"; // Red (Invalid)

  const shadow = isValid
    ? "0 8px 20px rgba(16, 185, 129, 0.3)"
    : "0 8px 20px rgba(239, 68, 68, 0.3)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        minWidth: "220px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Clickable Header for Collapse/Expand */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: "8px",
          backgroundColor: isCollapsed ? "#f8fafc" : "transparent",
          transition: "background-color 0.2s ease",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: "600",
            color: "#334155",
          }}
        >
          Selection Status
        </h4>
        <span
          style={{
            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            fontSize: "12px",
            color: "#64748b",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </div>

      {/* Collapsible Content */}
      <div
        style={{
          height: isCollapsed ? "0px" : "110px",
          opacity: isCollapsed ? 0 : 1,
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: gradient,
            borderRadius: "10px",
            padding: "16px 18px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: shadow,
            boxSizing: "border-box",
            transition: "background 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Selected
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                backgroundColor: "rgba(0,0,0,0.2)",
                padding: "3px 8px",
                borderRadius: "12px",
              }}
            >
              Min: {minRequired}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                fontSize: "40px",
                fontWeight: "800",
                lineHeight: 1,
              }}
            >
              {selectedCount}
            </span>

            <span
              style={{
                fontSize: "22px",
                fontWeight: "600",
                marginBottom: "3px",
                marginLeft: "6px",
                opacity: 0.9,
              }}
            >
              / {maxAllowed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffBatchCounter;
