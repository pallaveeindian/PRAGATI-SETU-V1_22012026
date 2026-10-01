// src\pages\TMS\StaffBatchCreator\StaffBatchCreatorDashboard.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import TmsLeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";

import TRSummaryHeader from "./TRSummaryHeader";
import StaffTRSearch from "./StaffTRSearch";
import StaffTRParticipantTable from "./StaffTRParticipantTable";
import StaffSelectionTable from "./StaffSelectionTable";
import CentreSelectionTable from "./CentreSelectionTable";
import BatchDateConfig from "./BatchDateConfig";
import StaffBatchCounter from "./StaffBatchCounter";
import StaffPreviewModal from "./StaffPreviewModal";

export default function StaffBatchCreatorDashboard() {
  const { id: paramTrId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fallback to extract Base TR ID from router state or URL params
  const baseTrId = Number(paramTrId || location.state?.trId);

  // --- Core States ---
  const [loadingBase, setLoadingBase] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- Left Navigation State ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // --- Context & Aggregation Data ---
  const [baseTrDetails, setBaseTrDetails] = useState(null);
  const [trainingPlanDays, setTrainingPlanDays] = useState(0);
  const [trainingPlanName, setTrainingPlanName] = useState("");

  // SURGICAL FIX: Dynamic participant type extraction
  const [participantType, setParticipantType] = useState("STAFF");

  // Multi-TR Aggregation States
  const [selectedTrIds, setSelectedTrIds] = useState([]);
  const [unallocatedStaff, setUnallocatedStaff] = useState([]);

  // --- User Selection States ---
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const initialSelectDoneRef = useRef(false);
  const maxAllowed = 60;

  // ==========================================
  // 1. BASE DATA INITIALIZATION (Runs Once)
  // ==========================================
  useEffect(() => {
    if (!baseTrId) {
      alert("No Training Request ID provided.");
      navigate(-1);
      return;
    }

    const fetchBaseDashboardData = async () => {
      setLoadingBase(true);
      try {
        // A. Fetch Parent (Base) TR Details
        const trResp = await TMS_API.trainingRequests.retrieve(baseTrId);
        const trData = trResp?.data ?? trResp;
        setBaseTrDetails(trData);

        // SURGICAL FIX: Extract Participant Type directly from Base TR
        setParticipantType(trData?.training_type || "STAFF");

        // B. Fetch Plan Details to get "no_of_days"
        if (trData?.training_plan) {
          const planResp = await TMS_API.trainingPlans.retrieve(
            trData.training_plan,
          );
          const planData = planResp?.data ?? planResp;
          setTrainingPlanDays(planData?.no_of_days || 1);
          setTrainingPlanName(planData?.training_name || "");
        }

        // C. Initialize TR Selection pool with the base TR
        setSelectedTrIds([baseTrId]);
      } catch (error) {
        console.error("Failed to load Base TR context:", error);
        alert("Failed to load required data. Returning to previous page.");
        navigate(-1);
      } finally {
        setLoadingBase(false);
      }
    };

    fetchBaseDashboardData();
  }, [baseTrId, navigate]);

  // =======================================================
  // 2. THE GLOBAL PARTICIPANT AGGREGATOR (Runs on TR Change)
  // =======================================================
  useEffect(() => {
    if (selectedTrIds.length === 0) {
      setUnallocatedStaff([]);
      return;
    }

    const fetchAggregatedParticipants = async () => {
      setLoadingParticipants(true);
      try {
        // Concurrently fetch participants for ALL selected TRs
        const responses = await Promise.all(
          selectedTrIds.map((id) => api.get(`/tms/tr/${id}/participants/`)),
        );

        let mergedPool = [];

        // Flatten responses and dynamically inject the Source TR ID for traceability
        responses.forEach((resp, index) => {
          const sourceTrId = selectedTrIds[index];
          const participants = resp?.data?.results || resp?.data || [];

          participants.forEach((p) => {
            // ONLY strictly unallocated participants
            if (!p.CB_selected) {
              mergedPool.push({
                ...p,
                source_tr_id: sourceTrId,
              });
            }
          });
        });

        setUnallocatedStaff(mergedPool);

        // Auto-select Base TR participants only on the very first load
        if (!initialSelectDoneRef.current && mergedPool.length > 0) {
          const baseTrParticipants = mergedPool
            .filter((p) => p.source_tr_id === baseTrId)
            .map((p) => p.id);

          const safeInitialSelection = baseTrParticipants.slice(0, maxAllowed);
          if (safeInitialSelection.length > 0) {
            setSelectedStaffIds(safeInitialSelection);
          }
          initialSelectDoneRef.current = true;
        } else {
          // Cleanup: Remove selected IDs that no longer exist in the pool
          const validPoolIds = new Set(mergedPool.map((p) => p.id));
          setSelectedStaffIds((prev) =>
            prev.filter((id) => validPoolIds.has(id)),
          );
        }
      } catch (error) {
        console.error("Failed to aggregate participants:", error);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchAggregatedParticipants();
  }, [selectedTrIds, baseTrId]);

  // ==========================================
  // 3. VALIDATION LOGIC
  // ==========================================
  // Dynamic minimum: 20, OR the exact remaining pool if less than 20 participants are left globally
  const minRequired = Math.min(20, unallocatedStaff.length);
  const currentSelectedCount = selectedStaffIds.length;

  const isSelectionValid =
    currentSelectedCount >= minRequired && currentSelectedCount <= maxAllowed;
  const isFormComplete =
    isSelectionValid && selectedCentre?.id && startDate && endDate;

  // ==========================================
  // 4. SUBMISSION HANDLER
  // ==========================================
  const handleConfirmAndSave = async () => {
    if (!isFormComplete) return;

    setIsSubmitting(true);
    try {
      // SURGICAL FIX: Send dynamic participant_type (STAFF or TRAINER)
      const payload = {
        participant_type: participantType,
        batch_type: "SEPARATE",
        district_tp_user_id: user?.id,
        participant_ids: selectedStaffIds,
        block_id: null, // Strictly null for STAFF/TRAINER
        training_plan_id: baseTrDetails.training_plan,
        centre_id: selectedCentre.id,
        district_id: null,
        level: "STATE", // Strictly locked for STAFF/TRAINER
        status: "PENDING",
        financial_year: baseTrDetails.financial_year,
        start_date: startDate,
        end_date: endDate,
      };

      await TMS_API.batchCreator.create(payload);

      alert(`Aggregated ${participantType} Batch created successfully!`);
      setIsPreviewOpen(false);
      navigate(`/tms/tr-detail/${baseTrId}`);
    } catch (error) {
      console.error("Batch Creation Failed:", error);
      alert(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to create batch. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 5. RENDER ORCHESTRATION
  // ==========================================
  if (loadingBase) {
    return (
      <div className="app-shell">
        <Header />
        <div
          className="content-area"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
          }}
        >
          <h2>Loading Batch Workspace...</h2>
        </div>
      </div>
    );
  }

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
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Floating Counter Validator */}
          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "40px",
              zIndex: 900,
            }}
          >
            <StaffBatchCounter
              selectedCount={currentSelectedCount}
              minRequired={minRequired}
              maxAllowed={maxAllowed}
            />
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
              flex: 1,
            }}
          >
            {/* Context Banner */}
            <TRSummaryHeader
              trDetails={baseTrDetails}
              totalUnallocated={unallocatedStaff.length}
              trainingPlanName={trainingPlanName}
              participantType={participantType} // PROP DRILLING
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              <StaffTRSearch
                baseTrDetails={baseTrDetails}
                selectedTrIds={selectedTrIds}
                onTrSelectionChange={setSelectedTrIds}
                participantType={participantType} // PROP DRILLING
              />

              <StaffTRParticipantTable
                staffPool={unallocatedStaff}
                loading={loadingParticipants}
                baseTrId={baseTrId}
                selectedStaffIds={selectedStaffIds}
                onStaffSelectionChange={setSelectedStaffIds}
                maxAllowed={maxAllowed}
                participantType={participantType} // PROP DRILLING
              />

              <StaffSelectionTable
                staffPool={unallocatedStaff}
                selectedIds={selectedStaffIds}
                onSelectionChange={setSelectedStaffIds}
                maxAllowed={maxAllowed}
                participantType={participantType} // PROP DRILLING
              />

              {/* Centre Selection (Pass Partner ID from Base TR to fetch centres) */}
              <CentreSelectionTable
                partnerId={baseTrDetails?.partner}
                selectedCentre={selectedCentre}
                onSelectCentre={setSelectedCentre}
              />

              {/* Date Configuration */}
              <BatchDateConfig
                trainingDays={trainingPlanDays}
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            </div>

            {/* Action Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "32px",
                paddingTop: "16px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  color: isFormComplete ? "#16a34a" : "#ef4444",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {!isSelectionValid
                  ? `⚠ Please select between ${minRequired} and ${maxAllowed} participants.`
                  : !selectedCentre?.id
                    ? "⚠ Please select a Training Centre."
                    : !startDate
                      ? "⚠ Please select a Start Date."
                      : "✓ Configuration is valid and ready."}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    padding: "10px 24px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#475569",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  disabled={!isFormComplete}
                  style={{
                    padding: "10px 24px",
                    background: !isFormComplete
                      ? "#cbd5e1"
                      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: !isFormComplete ? "#94a3b8" : "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: !isFormComplete ? "not-allowed" : "pointer",
                    boxShadow: !isFormComplete
                      ? "none"
                      : "0 4px 12px rgba(37, 99, 235, 0.15)",
                  }}
                >
                  Preview & Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Flight Modal */}
      {isPreviewOpen && (
        <StaffPreviewModal
          trDetails={baseTrDetails}
          selectedTrIds={selectedTrIds}
          selectedCount={currentSelectedCount}
          centre={selectedCentre}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setIsPreviewOpen(false)}
          onConfirm={handleConfirmAndSave}
          isSubmitting={isSubmitting}
          participantType={participantType} // PROP DRILLING
        />
      )}
    </div>
  );
}
