// src/pages/TMS/StaffBatchCreator/StaffBatchCreatorDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import TmsLeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";

import TRSummaryHeader from "./TRSummaryHeader";
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

  // Fallback to extract TR ID from router state or URL params
  const trId = paramTrId || location.state?.trId;

  // --- Core States ---
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- Context Data ---
  const [trDetails, setTrDetails] = useState(null);
  const [unallocatedStaff, setUnallocatedStaff] = useState([]);
  const [trainingPlanDays, setTrainingPlanDays] = useState(0);
  const [trainingPlanName, setTrainingPlanName] = useState("");

  // --- User Selection States ---
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null); // Holds full centre object for preview
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ==========================================
  // 1. DATA INITIALIZATION
  // ==========================================
  useEffect(() => {
    if (!trId) {
      alert("No Training Request ID provided.");
      navigate(-1);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // A. Fetch Parent TR Details
        const trResp = await TMS_API.trainingRequests.retrieve(trId);
        const trData = trResp?.data ?? trResp;
        setTrDetails(trData);

        // Fetch Plan Details to get "no_of_days"
        if (trData?.training_plan) {
          const planResp = await TMS_API.trainingPlans.retrieve(
            trData.training_plan,
          );
          const planData = planResp?.data ?? planResp;
          setTrainingPlanDays(planData?.no_of_days || 1);
          setTrainingPlanName(planData?.training_name || "");
        }

        // B. Fetch All Participants for this TR
        const participantsResp = await api.get(`/tms/tr/${trId}/participants/`);
        const allParticipants = participantsResp?.data?.results || [];

        // C. Filter out already assigned staff (CB_selected === true)
        const availableStaff = allParticipants.filter((p) => !p.CB_selected);

        if (availableStaff.length === 0) {
          alert(
            "All staff members for this request have already been batched.",
          );
          navigate(`/tms/tr-detail/${trId}`);
        }

        setUnallocatedStaff(availableStaff);
      } catch (error) {
        console.error("Failed to load Staff Batch context:", error);
        alert("Failed to load required data. Returning to previous page.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [trId, navigate]);

  // ==========================================
  // 2. VALIDATION LOGIC
  // ==========================================
  // Dynamic minimum: 20, OR the exact remaining pool if less than 20 staff are left
  const minRequired = Math.min(20, unallocatedStaff.length);
  const maxAllowed = 40;

  const currentSelectedCount = selectedStaffIds.length;

  const isSelectionValid =
    currentSelectedCount >= minRequired && currentSelectedCount <= maxAllowed;
  const isFormComplete =
    isSelectionValid && selectedCentre?.id && startDate && endDate;

  // ==========================================
  // 3. SUBMISSION HANDLER
  // ==========================================
  const handleConfirmAndSave = async () => {
    if (!isFormComplete) return;

    setIsSubmitting(true);
    try {
      // Construct exact payload required by CreateOneShotBatchAPIView
      const payload = {
        participant_type: "STAFF",
        batch_type: "SEPARATE",
        district_tp_user_id: user?.id, // TP creating the batch
        participant_ids: selectedStaffIds,
        block_id: null, // Strictly null for STAFF
        training_plan_id: trDetails.training_plan,
        centre_id: selectedCentre.id,
        district_id: trDetails.district, // Fallback district handled natively by the API if null
        level: "STATE", // Strictly locked for STAFF
        status: "PENDING",
        financial_year: trDetails.financial_year,
        start_date: startDate,
        end_date: endDate,
      };

      await TMS_API.batchCreator.create(payload);

      alert("Staff Batch created successfully!");
      setIsPreviewOpen(false);
      navigate(`/tms/tr-detail/${trId}`); // Send back to TR to view remaining or verify
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
  // 4. RENDER ORCHESTRATION
  // ==========================================
  if (loading) {
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
        <TmsLeftNav />

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
              trDetails={trDetails}
              totalUnallocated={unallocatedStaff.length}
              trainingPlanName={trainingPlanName}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              {/* Table 1: Staff Selection */}
              <StaffSelectionTable
                staffPool={unallocatedStaff}
                selectedIds={selectedStaffIds}
                onSelectionChange={setSelectedStaffIds}
                maxAllowed={maxAllowed}
              />

              {/* Table 2: Centre Selection (Pass Partner ID from TR to fetch centres) */}
              <CentreSelectionTable
                partnerId={trDetails?.partner}
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
                  ? `⚠ Please select between ${minRequired} and ${maxAllowed} staff members.`
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
          trDetails={trDetails}
          selectedCount={currentSelectedCount}
          centre={selectedCentre}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setIsPreviewOpen(false)}
          onConfirm={handleConfirmAndSave}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
