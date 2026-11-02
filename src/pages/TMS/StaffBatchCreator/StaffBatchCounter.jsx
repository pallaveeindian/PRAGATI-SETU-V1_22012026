// src/pages/TMS/StaffBatchCreator/StaffBatchCounter.jsx
import React, { useState } from "react";

const StaffBatchCounter = ({
  selectedCount = 0,
  minRequired = 20,
  maxAllowed = 60,
  trTargets = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isValid = selectedCount >= minRequired && selectedCount <= maxAllowed;
  const gradient = (valid) =>
    valid
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";

  return (
    <div
      style={{
        minWidth: 220,
        width: "100%",
        padding: 8,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-expanded={!isCollapsed}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 8px",
          cursor: "pointer",
          border: 0,
          borderRadius: 8,
          background: isCollapsed ? "#f8fafc" : "transparent",
          color: "#334155",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Selection Status
        <span
          style={{
            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            fontSize: 12,
            color: "#64748b",
          }}
        >
          ▼
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: isCollapsed ? "0fr" : "1fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ minHeight: 0, overflow: "hidden" }}>
          <div
            style={{
              height: 110,
              marginTop: 8,
              padding: "16px 18px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 10,
              color: "white",
              background: gradient(isValid),
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>Selected</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(0,0,0,0.2)",
                  padding: "3px 8px",
                  borderRadius: 12,
                }}
              >
                Min: {minRequired}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
                {selectedCount}
              </span>
              <span style={{ fontSize: 22, fontWeight: 600 }}>
                / {maxAllowed}
              </span>
            </div>
          </div>

          {trTargets.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 7,
                }}
              >
                District Targets
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 6,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {trTargets.map(({ trId, districtName, selected, target }) => {
                  const missing = target == null;
                  const exceeded = !missing && selected > target;
                  return (
                    <div
                      key={trId}
                      title={districtName}
                      style={{
                        padding: "8px 6px",
                        minWidth: 0,
                        borderRadius: 8,
                        color: "#fff",
                        background: missing ? "#64748b" : gradient(!exceeded),
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {districtName}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          marginTop: 3,
                        }}
                      >
                        {selected}
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                          {" "}
                          / {missing ? "—" : target}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffBatchCounter;
