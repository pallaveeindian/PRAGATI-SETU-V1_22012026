// src/pages/TMS/StaffBatchCreator/StaffPreviewModal.jsx
import React from "react";

const StaffPreviewModal = ({
  trDetails,
  selectedCount,
  centre,
  startDate,
  endDate,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  // Safe fallbacks for display
  const planName =
    trDetails?.training_plan_name ||
    trDetails?.training_plan?.training_name ||
    trDetails?.training_plan ||
    "N/A";

  const financialYear = trDetails?.financial_year || "N/A";

  const centreName = centre?.venue_name || "N/A";
  const centreDistrict =
    centre?.district?.district_name_en || centre?.district_name || "";
  const centreDisplay = centreDistrict
    ? `${centreName} (${centreDistrict})`
    : centreName;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "580px",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          padding: "32px",
          border: "1px solid #e2e8f0",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "16px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            Staff Batch Preview & Confirmation
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              color: "#94a3b8",
            }}
          >
            &times;
          </button>
        </div>

        {/* Highlighted Strategy Block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "12px 14px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#166534",
                fontWeight: "600",
              }}
            >
              Selected Strategy:
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#14532d",
                fontWeight: "800",
              }}
            >
              STAFF SEPARATE BATCH
            </span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Total Participants:</span>
            <span style={{ ...styles.value, color: "#2563eb" }}>
              {selectedCount} Staff Members
            </span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Training Plan:</span>
            <span style={styles.value}>{planName}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Financial Year:</span>
            <span style={styles.value}>{financialYear}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Training Centre:</span>
            <span style={styles.value}>{centreDisplay}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Timeline:</span>
            <span style={styles.value}>
              {startDate} <span style={{ color: "#94a3b8" }}>to</span> {endDate}
            </span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Locked Parameters:</span>
            <span style={styles.value}>
              Level: <strong style={{ color: "#ef4444" }}>STATE</strong> |
              Block: <strong style={{ color: "#ef4444" }}>NULL</strong>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "32px",
            paddingTop: "16px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#475569",
              padding: "10px 18px",
              borderRadius: "8px",
              fontWeight: "500",
              fontSize: "14px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            Back to Edit
          </button>

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              background: isSubmitting
                ? "#cbd5e1"
                : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              border: "none",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: isSubmitting
                ? "none"
                : "0 4px 12px rgba(22, 163, 74, 0.2)",
            }}
          >
            {isSubmitting ? "Processing Request..." : "Confirm & Create Batch"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "10px",
  },
  label: {
    fontSize: "14px",
    color: "#64748b",
  },
  value: {
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "600",
    textAlign: "right",
    maxWidth: "60%",
    wordWrap: "break-word",
  },
};

export default StaffPreviewModal;
