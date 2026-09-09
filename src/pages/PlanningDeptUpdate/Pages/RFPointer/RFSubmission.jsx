// src\pages\PlanningDeptUpdate\Pages\RFPointer\RFSubmission.jsx
import React, { useState, useEffect } from "react";
import { usePDUContext } from "../../context/PDUContext";
import { buildPlanningApiPayload } from "../../Codes/payloadBuilder";
import { pushBulkDataToPlanningDept } from "../../services/planningDeptApi";
import { syncLocalAspirationalData } from "../../services/uppldApi";

// Reusable Components
import PDUCard from "../../components/PDUCard";
import PDUButton from "../../components/PDUButton";
import PDUOfficerForm from "../../components/PDUOfficerForm";
import PDUStatusModal from "../../components/PDUStatusModal";

export default function RFSubmission() {
  const {
    aspirationalBlocks,
    officerDetails,
    updateOfficerDetails,
    loadAspirationalBlocksData,
    isInitialized,
  } = usePDUContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [generatedPayloads, setGeneratedPayloads] = useState(null);

  useEffect(() => {
    if (isInitialized && aspirationalBlocks.length === 0) {
      loadAspirationalBlocksData();
    }
  }, [isInitialized]);

  const isOfficerDataReady =
    officerDetails?.name &&
    officerDetails?.designation &&
    officerDetails?.department &&
    officerDetails?.mobile;

  const handleSaveOfficer = (data) => {
    updateOfficerDetails(data);
    setGeneratedPayloads(null); // Reset preview if officer details change
  };

  // STEP 1: Generate and Preview Payload
  const handleGeneratePreview = () => {
    if (!isOfficerDataReady || aspirationalBlocks.length === 0) return;

    const payloads = aspirationalBlocks.map((block) => {
      return buildPlanningApiPayload({
        lokosDistrictId: block.lokos_district_id,
        lokosBlockId: block.lokos_block_id,
        indicatorCode: "0512", // Pointer 2 Code
        cumulativeAchievement: block.rfReceivedCount || 0, // Mapping the requested RF field
        officerDetails: officerDetails,
      });
    });

    setGeneratedPayloads(payloads);
  };

  // STEP 2: Execute Push after Confirmation
  const handleStartPush = async () => {
    if (!generatedPayloads) return;

    setIsModalOpen(true);
    setLogs([
      {
        status: "info",
        message: "Initiating secure bulk transmission for 0512...",
      },
    ]);
    setIsUploading(true);
    setIsComplete(false);

    try {
      // 3. Execute Bulk Push to UP Planning Dept
      const response = await pushBulkDataToPlanningDept(generatedPayloads);
      setLogs((prev) => [
        ...prev,
        { status: "success", message: `[0512] PLANNING DEPT API SUCCESS.` },
      ]);

      // 4. Sync exact same payload to our Local Django Backend
      setLogs((prev) => [
        ...prev,
        {
          status: "info",
          message: "Synchronizing identical payload to Local Server...",
        },
      ]);
      const localResponse = await syncLocalAspirationalData(generatedPayloads);

      setLogs((prev) => [
        ...prev,
        {
          status: "success",
          message: `[0512] LOCAL DB SUCCESS. ${localResponse.message || "Stored successfully."}`,
        },
      ]);
    } catch (error) {
      setLogs((prev) => [
        ...prev,
        { status: "error", message: `CRITICAL ERROR: ${error.message}` },
      ]);
    } finally {
      setIsUploading(false);
      setIsComplete(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isComplete) {
      setLogs([]);
      setIsComplete(false);
      setGeneratedPayloads(null); // Reset preview after successful push
    }
  };

  // Generate a live sample payload using the 1st block in the array
  const samplePayload =
    isOfficerDataReady && aspirationalBlocks.length > 0
      ? buildPlanningApiPayload({
          lokosDistrictId: aspirationalBlocks[0].lokos_district_id,
          lokosBlockId: aspirationalBlocks[0].lokos_block_id,
          indicatorCode: "0512",
          cumulativeAchievement: aspirationalBlocks[0].rfReceivedCount || 0,
          officerDetails: officerDetails,
        })
      : null;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1f2937", marginBottom: "8px" }}
        >
          Pointer 2: RF Received Verification & Upload
        </h2>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Indicator 0512 - Percentage of SHGs that have received Revolving Fund
          against total SHGs.
          <br />
          <em>* API Payload transmits the raw number of SHGs receiving RF.</em>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        }}
      >
        <div>
          <PDUOfficerForm
            initialData={officerDetails}
            onSubmit={handleSaveOfficer}
            isLoading={isUploading}
          />
        </div>

        <div>
          <PDUCard title="Upload Control Panel">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span style={{ color: "#4b5563", fontWeight: 600 }}>
                  Target API:
                </span>
                <span style={{ color: "#1f2937" }}>
                  Planning Department (0512)
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span style={{ color: "#4b5563", fontWeight: 600 }}>
                  Total Blocks to Sync:
                </span>
                <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                  {aspirationalBlocks.length > 0
                    ? aspirationalBlocks.length
                    : "Loading..."}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span style={{ color: "#4b5563", fontWeight: 600 }}>
                  Officer Status:
                </span>
                {isOfficerDataReady ? (
                  <span style={{ color: "#10b981", fontWeight: "bold" }}>
                    ✅ Verified
                  </span>
                ) : (
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                    ❌ Missing Details
                  </span>
                )}
              </div>

              {/* Dynamic UI: Show Generate Button OR Show Preview+Confirm */}
              {!generatedPayloads ? (
                <div style={{ marginTop: "12px" }}>
                  {!isOfficerDataReady ? (
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#fef2f2",
                        color: "#991b1b",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                      }}
                    >
                      Please fill and save the Officer Verification Details on
                      the left before initiating the data push.
                    </div>
                  ) : (
                    <PDUButton
                      variant="action"
                      style={{
                        width: "100%",
                        padding: "14px",
                        fontSize: "1.1rem",
                      }}
                      onClick={handleGeneratePreview}
                      disabled={aspirationalBlocks.length === 0}
                    >
                      Generate JSON Payload Preview
                    </PDUButton>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* JSON Preview Window */}
                  <div>
                    <span
                      style={{
                        color: "#4b5563",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Payload Preview (All {generatedPayloads.length} Blocks):
                    </span>
                    <pre
                      style={{
                        backgroundColor: "#0f172a",
                        color: "#34d399", // Matrix green
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        height: "250px",
                        overflowY: "auto",
                        overflowX: "auto",
                        margin: 0,
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      {JSON.stringify(generatedPayloads, null, 2)}
                    </pre>
                  </div>

                  {/* Confirmation Box */}
                  <div
                    style={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #10b981",
                      padding: "16px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <h4
                      style={{
                        color: "#065f46",
                        margin: "0 0 12px 0",
                        fontSize: "1.1rem",
                      }}
                    >
                      Are you sure?
                    </h4>
                    <p
                      style={{
                        color: "#166534",
                        margin: "0 0 16px 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      You are about to transmit the above data array to both the
                      Planning Department API and our Local Database. This
                      action cannot be undone.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "center",
                      }}
                    >
                      <PDUButton
                        variant="outline"
                        onClick={() => setGeneratedPayloads(null)}
                      >
                        Cancel
                      </PDUButton>
                      <PDUButton variant="action" onClick={handleStartPush}>
                        Confirm & Push Data
                      </PDUButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PDUCard>
        </div>
      </div>

      <PDUStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        totalBlocks={aspirationalBlocks.length || 108}
        isUploading={isUploading}
        isComplete={isComplete}
        logs={logs}
        onStartPush={handleStartPush}
      />
    </div>
  );
}
