import React, { useState, useEffect } from "react";
import { usePDUContext } from "../../context/PDUContext";
import { buildPlanningApiPayload } from "../../Codes/payloadBuilder";
import { pushBulkDataToPlanningDept } from "../../services/planningDeptApi"; // Changed to Bulk API

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

  const handleSaveOfficer = (data) => updateOfficerDetails(data);

  const handleStartPush = async () => {
    if (!isOfficerDataReady || aspirationalBlocks.length === 0) return;

    // 1. Initialize Log state for Bulk Push
    setLogs([
      {
        status: "info",
        message: "Preparing bulk payload matrix for Indicator 0512...",
      },
    ]);
    setIsUploading(true);
    setIsComplete(false);

    try {
      // 2. Build exactly 108 Payloads for Indicator 0512 (RF Received)
      const payloads = aspirationalBlocks.map((block) => {
        return buildPlanningApiPayload({
          lokosDistrictId: block.lokos_district_id,
          lokosBlockId: block.lokos_block_id,
          indicatorCode: "0512", // Pointer 2 Code
          cumulativeAchievement: block.rfReceivedCount || 0, // Mapping the requested RF field
          officerDetails: officerDetails,
        });
      });

      setLogs((prev) => [
        ...prev,
        {
          status: "info",
          message: `Generated ${payloads.length} block schemas. Initiating secure transmission.`,
        },
      ]);

      // 3. Execute Bulk Push (Single API Call)
      const response = await pushBulkDataToPlanningDept(payloads);

      // 4. Log Success
      setLogs((prev) => [
        ...prev,
        {
          status: "success",
          message: `[0512] SUCCESS. Server Response: ${JSON.stringify(response)}`,
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
                    Please fill and save the Officer Verification Details on the
                    left before initiating the data push.
                  </div>
                ) : (
                  <PDUButton
                    variant="action"
                    style={{
                      width: "100%",
                      padding: "14px",
                      fontSize: "1.1rem",
                    }}
                    onClick={() => setIsModalOpen(true)}
                    disabled={aspirationalBlocks.length === 0}
                  >
                    Initiate API Synchronization
                  </PDUButton>
                )}
              </div>

              {/* --- Sample Payload Preview --- */}
              {samplePayload && (
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span
                    style={{
                      color: "#4b5563",
                      fontWeight: 600,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Sample Payload Preview (Block 1):
                  </span>
                  <pre
                    style={{
                      backgroundColor: "#1f2937",
                      color: "#a78bfa" /* futuristic purple text */,
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      overflowX: "auto",
                      margin: 0,
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {JSON.stringify(samplePayload, null, 2)}
                  </pre>
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
