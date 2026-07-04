import React, { useState, useEffect, useCallback } from "react";
import ParticipantTable from "./TraineesDisplayTable"; // Adjust path if needed
import { TMS_API } from "../../../api/axios"; // Adjust path if needed

const PreviewBatchCreator = ({
  batchId = "some-batch-id-prop",
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState({
    financialYear: initialFilters.financialYear || "",
    trainingPlan: initialFilters.trainingPlan || "",
    participantType: initialFilters.participantType || "",
    block: initialFilters.block || "",
    panchayat: initialFilters.panchayat || "",
    village: initialFilters.village || "",
    gender: initialFilters.gender || "",
    ageRange: initialFilters.ageRange || "",
    searchValue: initialFilters.searchValue || "",
    pldStatus: initialFilters.pldStatus || "",
    socialCategory: initialFilters.socialCategory || "",
    religion: initialFilters.religion || "",
  });

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  // Handle incoming local changes from filters UI inside downstream components
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Callback used by ParticipantTable to communicate selected checkbox items
  const handleSelectionChange = useCallback((count) => {
    setSelectedCount(count);
  }, []);

  // Action 1: On-Shot Update API Caller
  const handleUpdateBatch = async () => {
    if (!batchId) return alert("No valid Batch ID detected for updating.");

    setIsSubmitting(true);
    setActionMessage({ type: "", text: "" });

    try {
      const payload = {
        filters: filters,
        total_selected_trainees: selectedCount,
        // Add any additional body properties required by your backend mapping rule
      };

      await TMS_API.batchCreator.update(batchId, payload);
      setActionMessage({
        type: "success",
        text: "Batch details updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update batch:", error);
      setActionMessage({
        type: "error",
        text: "Failed to update batch context data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action 2: One-Shot Delete API Caller
  const handleDeleteBatch = async () => {
    if (!batchId) return alert("No valid Batch ID found to remove.");
    if (
      !window.confirm(
        "Are you sure you want to completely delete this preview configuration?",
      )
    )
      return;

    setIsSubmitting(true);
    setActionMessage({ type: "", text: "" });

    try {
      await TMS_API.batchCreator.delete(batchId);
      setActionMessage({
        type: "success",
        text: "Batch tracking index dropped successfully!",
      });
      // Optional: Redirect your routing page state here if required
    } catch (error) {
      console.error("Failed to delete batch:", error);
      setActionMessage({
        type: "error",
        text: "Error encountered while removing batch registry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ margin: 0, color: "#002073" }}>Preview Batch Creator</h2>
          <span
            style={{
              fontSize: "14px",
              color: "#64748b",
              background: "#f1f5f9",
              padding: "6px 12px",
              borderRadius: "20px",
              fontWeight: "500",
            }}
          >
            Batch ID: <strong>{batchId}</strong>
          </span>
        </div>

        <p style={{ color: "#555", fontSize: "15px", margin: "0 0 24px 0" }}>
          Review final participant pools, run granular live directory searches,
          and modify or purge the current session safely.
        </p>

        {/* Feedback Toast Notification banner */}
        {actionMessage.text && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor:
                actionMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: actionMessage.type === "success" ? "#166534" : "#991b1b",
              border: `1px solid ${actionMessage.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Primary Integrated Components Engine */}
        <div style={{ marginBottom: "24px" }}>
          <ParticipantTable
            filters={filters}
            handleChange={handleFilterChange}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {/* Live Tracking Actions Summary Drawer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div style={{ color: "#334155", fontSize: "14px" }}>
            Selected Records:{" "}
            <strong style={{ color: "#2563eb", fontSize: "16px" }}>
              {selectedCount}
            </strong>{" "}
            participants
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleDeleteBatch}
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
                transition: "background 0.2s",
              }}
            >
              Delete Batch Registry
            </button>

            <button
              onClick={handleUpdateBatch}
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
                transition: "background 0.2s",
              }}
            >
              {isSubmitting ? "Processing..." : "Save One-Shot Updates"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewBatchCreator;
