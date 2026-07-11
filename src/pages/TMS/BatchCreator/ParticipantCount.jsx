import React, { useState } from "react";

const ParticipantCount = ({ selectedParticipants = 0, totalLimit = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        minWidth: "220px",
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
          backgroundColor: isCollapsed ? "#f1f5f9" : "transparent",
          transition: "background-color 0.2s ease",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Participant Count
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
          height: isCollapsed ? "0px" : "95px",
          opacity: isCollapsed ? 0 : 1,
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "95px",
            background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
            borderRadius: "16px",
            padding: "16px 18px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 8px 20px rgba(249,115,22,0.22)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Selected
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: "44px",
                fontWeight: "800",
                lineHeight: 1,
              }}
            >
              {selectedParticipants}
            </span>

            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "3px",
              }}
            >
              /{totalLimit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantCount;
