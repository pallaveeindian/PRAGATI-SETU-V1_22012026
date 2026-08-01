import React, { useState, useEffect } from "react";
import { usePDUContext } from "../../context/PDUContext";
import { buildPlanningApiPayload } from "../../Codes/payloadBuilder";
import { pushAllBlocksSequentially } from "../../services/planningDeptApi";

// Reusable Components
import PDUCard from "../../components/PDUCard";
import PDUButton from "../../components/PDUButton";
import PDUOfficerForm from "../../components/PDUOfficerForm";
import PDUStatusModal from "../../components/PDUStatusModal";

// import "./styles/SHGSubmission.css";

export default function SHGSubmission() {
  const {
    aspirationalBlocks,
    officerDetails,
    updateOfficerDetails,
    loadAspirationalBlocksData,
    isInitialized,
  } = usePDUContext();

  // Modal & Upload State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState([]);

  // Ensure block data is loaded AFTER app is initialized
  useEffect(() => {
    if (isInitialized && aspirationalBlocks.length === 0) {
      loadAspirationalBlocksData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  // Check if officer details are fully provided
  const isOfficerDataReady =
    officerDetails?.name &&
    officerDetails?.designation &&
    officerDetails?.department &&
    officerDetails?.mobile;

  const handleSaveOfficer = (data) => {
    updateOfficerDetails(data);
  };

  const handleStartPush = async () => {
    if (!isOfficerDataReady || aspirationalBlocks.length === 0) return;

    // 1. Reset Modal State
    setCurrentBlock(0);
    setLogs([]);
    setIsUploading(true);
    setIsComplete(false);

    try {
      // 2. Build exactly 108 Payloads for Indicator 0511 (SHG Households)
      const payloads = aspirationalBlocks.map((block) => {
        return buildPlanningApiPayload({
          lokosDistrictId: block.lokos_district_id,
          lokosBlockId: block.lokos_block_id,
          indicatorCode: "0511", // Total number of eligible households (HHs) added to SHGs
          cumulativeAchievement: block.memberCount || 0, // Mapped from Lokos data
          officerDetails: officerDetails,
        });
      });

      // 3. Execute Sequential Push
      await pushAllBlocksSequentially(
        payloads,
        (current, total, isSuccess, blockCode) => {
          setCurrentBlock(current);
          setLogs((prev) => [
            ...prev,
            {
              status: isSuccess ? "success" : "error",
              message: isSuccess
                ? `[0511] Successfully pushed data for Block Code: ${blockCode}`
                : `[0511] FAILED to push data for Block Code: ${blockCode}`,
            },
          ]);
        },
      );
    } catch (error) {
      setLogs((prev) => [
        ...prev,
        { status: "error", message: `Critical Error: ${error.message}` },
      ]);
    } finally {
      setIsUploading(false);
      setIsComplete(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // If we finished an upload, we might want to reset the state for next time
    if (isComplete) {
      setCurrentBlock(0);
      setLogs([]);
      setIsComplete(false);
    }
  };

  return (
    <div
      className="pdu-shg-submission-container"
      style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1f2937", marginBottom: "8px" }}
        >
          Pointer 1: SHG Households Verification & Upload
        </h2>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Indicator 0511 - Total number of eligible households (HHs) added to
          SHGs.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        }}
      >
        {/* Left Column: Officer Verification Form */}
        <div>
          <PDUOfficerForm
            initialData={officerDetails}
            onSubmit={handleSaveOfficer}
            isLoading={isUploading}
          />
        </div>

        {/* Right Column: Submission Control Panel */}
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
                  Planning Department (Indicator 0511)
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
            </div>
          </PDUCard>
        </div>
      </div>

      {/* The Uploader Modal Overlay */}
      <PDUStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentBlock={currentBlock}
        totalBlocks={aspirationalBlocks.length || 108}
        isUploading={isUploading}
        isComplete={isComplete}
        logs={logs}
        onStartPush={handleStartPush}
      />
    </div>
  );
}
