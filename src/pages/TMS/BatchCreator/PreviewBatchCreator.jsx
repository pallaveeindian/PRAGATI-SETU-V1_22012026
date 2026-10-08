// src\pages\TMS\BatchCreator\PreviewBatchCreator.jsx
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

  // SURGICAL ADDITION
  const [engagedParticipants, setEngagedParticipants] = useState([]);
  const [showEngagementModal, setShowEngagementModal] = useState(false);

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
      // SURGICAL ADDITION: Handle 409 Engagement Conflict
      if (
        error?.response?.status === 409 &&
        error?.response?.data?.engaged_participants
      ) {
        setEngagedParticipants(error.response.data.engaged_participants);
        setShowEngagementModal(true);
        setActionMessage({
          type: "error",
          text: "Update failed: Participant conflicts detected.",
        });
      } else {
        setActionMessage({
          type: "error",
          text:
            error?.response?.data?.error ||
            "Failed to update batch context data.",
        });
      }
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
            engagedParticipants={engagedParticipants}
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
      {/* SURGICAL ADDITION: Engagement Conflict Modal */}
      {showEngagementModal && (
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
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "90%",
              maxWidth: "700px",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠️ Conflict: Participants Already Engaged
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                margin: "0 0 16px 0",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "16px",
              }}
            >
              One or more selected participants have either already successfully
              completed this training plan in this financial year, or their
              dates overlap with an active batch.
            </p>
            <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                    }}
                  >
                    <th style={{ padding: "10px" }}>Name</th>
                    <th style={{ padding: "10px" }}>Identifier</th>
                    <th style={{ padding: "10px" }}>Conflict Reason</th>
                    <th style={{ padding: "10px" }}>Batch Code</th>
                  </tr>
                </thead>
                <tbody>
                  {engagedParticipants.map((ep, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", fontWeight: "600" }}>
                        {ep.name || "-"}
                      </td>
                      <td style={{ padding: "10px", color: "#475569" }}>
                        {ep.lokos_member_code ||
                          ep.mobile_no ||
                          ep.employee_id ||
                          "-"}
                      </td>
                      <td style={{ padding: "10px", color: "#b91c1c" }}>
                        {ep.reason}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {ep.batch_code || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setShowEngagementModal(false)}
                style={{
                  padding: "10px 24px",
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Close & Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewBatchCreator;
