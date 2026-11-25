import React, { useState } from "react";

const StaffBatchCounter = ({
  selectedCount = 0,
  minRequired = 20,
  maxAllowed = 60,
  trTargets = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isSelectionExceeded = selectedCount > maxAllowed;

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
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
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
          fontSize: 13,
          fontWeight: 700,
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

      {/* COLLAPSIBLE CONTENT */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isCollapsed ? "0fr" : "1fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ minHeight: 0, overflow: "hidden" }}>
          {/* SELECTED PARTICIPANTS */}
          <div
            style={{
              height: 100,
              marginTop: 8,
              padding: "14px 16px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 10,
              color: "#ffffff",
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
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Selected Participants
              </span>

              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  background: "rgba(0,0,0,0.2)",
                  padding: "3px 7px",
                  borderRadius: 12,
                }}
              >
                Min: {minRequired}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {selectedCount}
              </span>

              <span
                style={{
                  fontSize: 21,
                  fontWeight: 600,
                }}
              >
                / {maxAllowed}
              </span>
            </div>
          </div>

          {/* SELECTION WARNING */}
          {isSelectionExceeded && (
            <div
              style={{
                marginTop: 7,
                padding: 8,
                borderRadius: 8,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Maximum allowed participants are {maxAllowed}.
            </div>
          )}

          {/* DISTRICT TARGETS */}
          {trTargets.length > 0 && (
            <div style={{ marginTop: 11 }}>
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
                  paddingRight: 2,
                }}
              >
                {trTargets.map(
                  ({
                    trId,
                    districtName,
                    achievement = 0,
                    target,
                    selected = 0,
                  }) => {
                    const missing = target == null;

                    const exceeded =
                      !missing &&
                      Number(achievement) + Number(selected) > Number(target);

                    return (
                      <div
                        key={trId}
                        title={`${districtName} | Achievement: ${achievement} | Target: ${
                          target ?? "Unavailable"
                        }`}
                        style={{
                          padding: "8px 6px",
                          minWidth: 0,
                          minHeight: 52,
                          boxSizing: "border-box",
                          borderRadius: 8,
                          color: "#ffffff",
                          background: missing
                            ? "#64748b"
                            : exceeded
                              ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        }}
                      >
                        {/* DISTRICT NAME */}
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {districtName || "District"}
                        </div>

                        {/* ACHIEVEMENT / TARGET */}
                        <div
                          style={{
                            fontSize: 17,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            marginTop: 3,
                            lineHeight: 1.2,
                          }}
                        >
                          {achievement}

                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {" "}
                            / {missing ? "—" : target}
                          </span>
                        </div>

                        {/* SELECTION COUNT */}
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Selected : {selected || 0}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* NO DISTRICT DATA */}
          {!trTargets.length && (
            <div
              style={{
                marginTop: 10,
                padding: 10,
                textAlign: "center",
                fontSize: 11,
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: 8,
              }}
            >
              No district target data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffBatchCounter;
