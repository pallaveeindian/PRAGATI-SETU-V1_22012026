// src\pages\TMS\BacklogBatchCreator\components\Step5_FinancialCosts.jsx
import React, { useMemo } from "react";

export default function Step5_FinancialCosts({
  batchData,
  updateBatchData,
  onNext,
  onPrev,
}) {
  const {
    selectedParticipants = [],
    masterTrainers = [],
    participantCosts = {},
    batchCost = {},
  } = batchData;

  // ==========================================
  // 1. COMBINE PARTICIPANTS
  // ==========================================
  const combinedPool = useMemo(() => {
    const safeTrainers = Array.isArray(masterTrainers) ? masterTrainers : [];
    const safeParticipants = Array.isArray(selectedParticipants)
      ? selectedParticipants
      : [];

    return [
      ...safeTrainers.map((mt) => ({
        _role: "trainer",
        _id: mt.id,
        _name: mt.full_name,
        _identifier: mt.mobile_no || mt.aadhaar_no || "-",
        _key: `trainer-${mt.id}`,
      })),
      ...safeParticipants.map((p) => ({
        _role: "trainee",
        _id: p.id,
        _name: p.member_name || p.full_name || "-",
        _identifier:
          p.lokos_member_code || p.employee_id || p.aadhaar_no || "-",
        _key: `trainee-${p.id}`,
      })),
    ];
  }, [masterTrainers, selectedParticipants]);

  // ==========================================
  // 2. COST HANDLERS
  // ==========================================
  const handleTaDaChange = (participantKey, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");

    updateBatchData({
      participantCosts: {
        ...participantCosts,
        [participantKey]: {
          ...participantCosts[participantKey],
          ta_da: numericValue,
          total_cost: numericValue, // In this module, TA/DA is the only component, so total = ta_da
        },
      },
    });
  };

  const handleBatchCostChange = (field, value) => {
    updateBatchData({
      batchCost: {
        ...batchCost,
        [field]: value,
      },
    });
  };

  // ==========================================
  // 3. COMPUTATIONS
  // ==========================================
  const participantSubtotal = useMemo(() => {
    let t = 0;
    Object.values(participantCosts).forEach((c) => {
      t += parseFloat(c.total_cost) || 0;
    });
    return t;
  }, [participantCosts]);

  const grandTotal = useMemo(() => {
    let t = participantSubtotal;
    if (batchCost.is_exposure_visit)
      t += parseFloat(batchCost.exposure_visit_cost) || 0;
    if (batchCost.is_field_visit)
      t += parseFloat(batchCost.field_visit_cost) || 0;

    // Auto-sync the grand total to state for the final payload
    if (t !== batchCost.grand_total_cost) {
      handleBatchCostChange("grand_total_cost", t);
    }

    return t;
  }, [
    participantSubtotal,
    batchCost.is_exposure_visit,
    batchCost.exposure_visit_cost,
    batchCost.is_field_visit,
    batchCost.field_visit_cost,
  ]);

  // ==========================================
  // 4. VALIDATION
  // ==========================================
  const isNextEnabled = useMemo(() => {
    // 1. Every participant must have a defined TA/DA (even if 0)
    const allParticipantsPriced = combinedPool.every((p) => {
      const c = participantCosts[p._key];
      return c && c.ta_da !== "" && !isNaN(parseFloat(c.ta_da));
    });

    // 2. If visits are toggled, their costs must be valid numbers > 0
    const isExposureValid =
      !batchCost.is_exposure_visit ||
      (batchCost.exposure_visit_cost !== "" &&
        parseFloat(batchCost.exposure_visit_cost) > 0);
    const isFieldValid =
      !batchCost.is_field_visit ||
      (batchCost.field_visit_cost !== "" &&
        parseFloat(batchCost.field_visit_cost) > 0);

    return allParticipantsPriced && isExposureValid && isFieldValid;
  }, [combinedPool, participantCosts, batchCost]);

  // Format Helper
  const fmt = (val) => {
    const n = parseFloat(val);
    return isNaN(n)
      ? "0.00"
      : n.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ margin: "0 0 4px 0", color: "#1e3a8a", fontSize: "16px" }}>
          5. Financial Cost Breakup
        </h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
          Provide the Travel Allowance & Dearness Allowance (TA/DA) for each
          participant. Values must be non-negative.
        </p>
      </div>

      {/* --- PARTICIPANTS COST TABLE --- */}
      <div
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <table style={styles.table}>
          <thead
            style={{
              background: "#e4ecf5",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              <th style={{ ...styles.th, width: "50px", textAlign: "center" }}>
                S.No
              </th>
              <th style={{ ...styles.th, width: "80px", textAlign: "center" }}>
                Role
              </th>
              <th style={styles.th}>Participant Name</th>
              <th style={{ ...styles.th, width: "150px" }}>TA / DA (₹) *</th>
              <th style={{ ...styles.th, width: "150px", textAlign: "right" }}>
                Row Total (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {combinedPool.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                    fontStyle: "italic",
                  }}
                >
                  No participants available to price.
                </td>
              </tr>
            ) : (
              combinedPool.map((p, idx) => {
                const c = participantCosts[p._key] || {
                  ta_da: "",
                  total_cost: "",
                };
                const hasValue = c.ta_da !== "" && !isNaN(parseFloat(c.ta_da));

                return (
                  <tr
                    key={p._key}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: "#fff",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#475569",
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <span
                        style={{
                          background:
                            p._role === "trainer" ? "#fdf4ff" : "#eff6ff",
                          color: p._role === "trainer" ? "#a21caf" : "#2563eb",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {p._role}
                      </span>
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "600",
                        color: "#0f172a",
                      }}
                    >
                      {p._name}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          fontWeight: "500",
                        }}
                      >
                        {p._identifier}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={c.ta_da}
                        onChange={(e) =>
                          handleTaDaChange(p._key, e.target.value)
                        }
                        style={{
                          ...styles.input,
                          borderColor: hasValue ? "#cbd5e1" : "#fca5a5",
                          background: hasValue ? "#fff" : "#fef2f2",
                        }}
                      />
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "14px",
                          minWidth: "80px",
                          background:
                            parseFloat(c.total_cost) > 0
                              ? "#dcfce7"
                              : "#f1f5f9",
                          color:
                            parseFloat(c.total_cost) > 0
                              ? "#166534"
                              : "#475569",
                        }}
                      >
                        ₹{fmt(c.total_cost || 0)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f8fafc" }}>
              <td
                colSpan="4"
                style={{
                  textAlign: "right",
                  padding: "12px",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                Participant Subtotal:
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "right",
                  fontWeight: "800",
                  color: "#1e3a8a",
                  fontSize: "16px",
                }}
              >
                ₹{fmt(participantSubtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* --- EXTRA VISIT COSTS --- */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h4
          style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "15px" }}
        >
          🚙 Additional Visit Costs
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: "600",
                color: "#334155",
                fontSize: "14px",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={batchCost.is_exposure_visit}
                onChange={(e) => {
                  handleBatchCostChange("is_exposure_visit", e.target.checked);
                  if (!e.target.checked)
                    handleBatchCostChange("exposure_visit_cost", "");
                }}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#3b82f6",
                  cursor: "pointer",
                }}
              />
              Did this batch include an Exposure Visit?
            </label>

            {batchCost.is_exposure_visit && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  Cost (₹):
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={batchCost.exposure_visit_cost}
                  onChange={(e) =>
                    handleBatchCostChange("exposure_visit_cost", e.target.value)
                  }
                  style={{ ...styles.input, width: "120px" }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: "600",
                color: "#334155",
                fontSize: "14px",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={batchCost.is_field_visit}
                onChange={(e) => {
                  handleBatchCostChange("is_field_visit", e.target.checked);
                  if (!e.target.checked)
                    handleBatchCostChange("field_visit_cost", "");
                }}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#3b82f6",
                  cursor: "pointer",
                }}
              />
              Did this batch include a Field Visit?
            </label>

            {batchCost.is_field_visit && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  Cost (₹):
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={batchCost.field_visit_cost}
                  onChange={(e) =>
                    handleBatchCostChange("field_visit_cost", e.target.value)
                  }
                  style={{ ...styles.input, width: "120px" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MASTER INVOICE SUMMARY CARD --- */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b, #334155)",
          borderRadius: "12px",
          padding: "24px",
          color: "#f8fafc",
          boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.3)",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            opacity: 0.8,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "16px",
          }}
        >
          Master Invoice Summary
        </div>

        <div style={styles.grandTotalRow}>
          <span>Participant Costs ({combinedPool.length} participants)</span>
          <span>₹{fmt(participantSubtotal)}</span>
        </div>

        {batchCost.is_exposure_visit && (
          <div style={styles.grandTotalRow}>
            <span>Exposure Visit Cost</span>
            <span>₹{fmt(batchCost.exposure_visit_cost || 0)}</span>
          </div>
        )}

        {batchCost.is_field_visit && (
          <div style={styles.grandTotalRow}>
            <span>Field Visit Cost</span>
            <span>₹{fmt(batchCost.field_visit_cost || 0)}</span>
          </div>
        )}

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            margin: "12px 0",
          }}
        />

        <div
          style={{
            ...styles.grandTotalRow,
            fontSize: "22px",
            fontWeight: "800",
            opacity: 1,
            color: "#fff",
          }}
        >
          <span>Grand Total</span>
          <span>₹{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: "1px solid #e2e8f0",
          marginTop: "10px",
        }}
      >
        <button
          onClick={onPrev}
          style={{
            background: "#ffffff",
            color: "#475569",
            border: "1px solid #cbd5e1",
            padding: "10px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Back to Media Uploads
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isNextEnabled && (
            <span
              style={{ fontSize: "13px", color: "#ef4444", fontWeight: "600" }}
            >
              ⚠ Missing Requirements: Ensure all TA/DA amounts and Visit costs
              are filled.
            </span>
          )}
          <button
            onClick={onNext}
            disabled={!isNextEnabled}
            style={{
              background: isNextEnabled ? "#2563eb" : "#cbd5e1",
              color: "#fff",
              border: "none",
              padding: "10px 32px",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: isNextEnabled ? "pointer" : "not-allowed",
              boxShadow: isNextEnabled
                ? "0 4px 12px rgba(37, 99, 235, 0.2)"
                : "none",
            }}
          >
            Proceed to Final Review →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "12px",
    color: "#1e3a8a",
    borderBottom: "2px solid #cbd5e1",
    verticalAlign: "bottom",
  },
  td: { padding: "8px 12px", verticalAlign: "middle" },
  input: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  grandTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: "15px",
    opacity: 0.9,
  },
};
