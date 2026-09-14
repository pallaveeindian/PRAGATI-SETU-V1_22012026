// src\pages\TMS\BacklogBatchCreator\BacklogBatchDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import TmsLeftNav from "../layout/tms_LeftNav";
import api from "../../../api/axios";

import StepWizardHeader from "./components/StepWizardHeader";
import Step1_ParticipantConfig from "./components/Step1_ParticipantConfig";
import Step2_EkycConfig from "./components/Step2_EkycConfig";
import Step3_AttendanceMatrix from "./components/Step3_AttendanceMatrix";
import Step4_MediaUploads from "./components/Step4_MediaUploads";
import Step5_FinancialCosts from "./components/Step5_FinancialCosts";
import Step6_FinalReview from "./components/Step6_FinalReview";

export default function BacklogBatchDashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // ==========================================
  // CENTRALIZED MASSIVE STATE (Preserves all steps)
  // ==========================================
  const [batchData, setBatchData] = useState({
    // Step 1: Base Configuration
    participantType: "", // "BENEFICIARY", "TRAINER", "STAFF"
    batchType: "SEPARATE", // "SEPARATE", "COMBINED"
    level: "BLOCK", // "BLOCK", "DISTRICT", "STATE"
    districtId: "",
    blockIds: [], // Array for COMBINED support
    trainingPlanId: "",
    partnerId: "",
    centreId: "",
    financialYear: "2026-27",
    startDate: "", // MUST BE PAST DATE
    endDate: "",

    // Step 1: Pools & Selections
    selectedTrIds: [], // STRICTLY is_old = True TRs
    selectedParticipants: [], // Array of participant objects

    // Step 2: Duration & EKYC Verification
    masterTrainers: [], // Array of assigned Master Trainer objects
    timeOfTraining: "",
    ekycList: [],

    // Future Steps State Placeholders
    attendanceMatrix: {},
    mediaUploads: [],
    participantCosts: {},
    batchCost: {
      is_field_visit: false,
      field_visit_cost: 0,
      is_exposure_visit: false,
      exposure_visit_cost: 0,
      grand_total_cost: 0,
    },
    certificates_issued: true,
  });

  // Global Participant Pool (Fetched dynamically based on selectedTrIds)
  const [aggregatedPool, setAggregatedPool] = useState([]);
  const [loadingPool, setLoadingPool] = useState(false);

  // ==========================================
  // GLOBAL PARTICIPANT AGGREGATOR
  // ==========================================
  useEffect(() => {
    if (batchData.selectedTrIds.length === 0) {
      setAggregatedPool([]);
      // Auto-clear selected participants if TRs are cleared
      if (batchData.selectedParticipants.length > 0) {
        setBatchData((prev) => ({ ...prev, selectedParticipants: [] }));
      }
      return;
    }

    const fetchAggregatedParticipants = async () => {
      setLoadingPool(true);
      try {
        const responses = await Promise.all(
          batchData.selectedTrIds.map((id) =>
            api.get(`/tms/tr/${id}/participants/`),
          ),
        );

        let mergedPool = [];
        responses.forEach((resp, index) => {
          const sourceTrId = batchData.selectedTrIds[index];
          const participants = resp?.data?.results || resp?.data || [];

          participants.forEach((p) => {
            // Include unselected, or those already in our local selection state
            if (
              !p.CB_selected ||
              batchData.selectedParticipants.some((sel) => sel.id === p.id)
            ) {
              mergedPool.push({
                ...p,
                source_tr_id: sourceTrId, // Traceability tag
              });
            }
          });
        });

        setAggregatedPool(mergedPool);

        // Cleanup: Remove participants from selected state if their TR was unchecked
        const validPoolIds = new Set(mergedPool.map((p) => p.id));
        setBatchData((prev) => ({
          ...prev,
          selectedParticipants: prev.selectedParticipants.filter((sp) =>
            validPoolIds.has(sp.id),
          ),
        }));
      } catch (error) {
        console.error("Failed to aggregate participants:", error);
      } finally {
        setLoadingPool(false);
      }
    };

    fetchAggregatedParticipants();
  }, [batchData.selectedTrIds]);

  // ==========================================
  // NAVIGATION HANDLERS
  // ==========================================
  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const updateBatchData = (updates) => {
    setBatchData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="app-shell">
      <Header />
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f1f5f9",
        }}
      >
        <TmsLeftNav
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          style={{
            flex: 1,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Offline Backlog Batch Creator
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Digitize and formally upload completed historical training
              batches.
            </p>
          </div>

          <StepWizardHeader currentStep={currentStep} totalSteps={totalSteps} />

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
              flex: 1,
            }}
          >
            {/* --- STEP RENDERER --- */}
            {currentStep === 1 && (
              <Step1_ParticipantConfig
                batchData={batchData}
                updateBatchData={updateBatchData}
                aggregatedPool={aggregatedPool}
                loadingPool={loadingPool}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <Step2_EkycConfig
                batchData={batchData}
                updateBatchData={updateBatchData}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 3 && (
              <Step3_AttendanceMatrix
                batchData={batchData}
                updateBatchData={updateBatchData}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 4 && (
              <Step4_MediaUploads
                batchData={batchData}
                updateBatchData={updateBatchData}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 5 && (
              <Step5_FinancialCosts
                batchData={batchData}
                updateBatchData={updateBatchData}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 6 && (
              <Step6_FinalReview batchData={batchData} onPrev={handlePrev} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
