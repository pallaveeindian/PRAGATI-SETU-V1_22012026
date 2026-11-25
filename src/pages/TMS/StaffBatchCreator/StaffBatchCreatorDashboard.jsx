// src/pages/TMS/StaffBatchCreator/StaffBatchCreatorDashboard.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import Header from "../layout/header";
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
import ScreenLoader from "./components/common/ScreenLoader";

export default function StaffBatchCreatorDashboard() {
  const { id: paramTrId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Base Training Request ID
  const baseTrId = Number(paramTrId || location.state?.trId);

  // Core States
  const [loadingBase, setLoadingBase] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Navigation
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Base TR and Training Plan
  const [baseTrDetails, setBaseTrDetails] = useState(null);
  const [trainingPlanDays, setTrainingPlanDays] = useState(0);
  const [trainingPlanName, setTrainingPlanName] = useState("");

  // Participant Type
  const [participantType, setParticipantType] = useState("STAFF");

  // Multi-TR Aggregation
  const [selectedTrIds, setSelectedTrIds] = useState([]);
  const [unallocatedStaff, setUnallocatedStaff] = useState([]);
  const [trDetails, setTrDetails] = useState({});
  const [targetsLoading, setTargetsLoading] = useState(false);

  // User Selection
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Engagement Conflict
  const [engagedParticipants, setEngagedParticipants] = useState([]);
  const [showEngagementModal, setShowEngagementModal] = useState(false);

  const initialSelectDoneRef = useRef(false);

  // Participant Limits
  const minRequired = 20;
  const maxAllowed = 60;

  // ==========================================
  // 1. BASE DATA INITIALIZATION
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
        // A. Fetch Base Training Request
        const trResp = await TMS_API.trainingRequests.retrieve(baseTrId);
        const trData = trResp?.data ?? trResp;

        setBaseTrDetails(trData);

        // Extract Participant Type
        setParticipantType(trData?.training_type || "STAFF");

        // B. Fetch Training Plan Details
        if (trData?.training_plan) {
          const planResp = await TMS_API.trainingPlans.retrieve(
            trData.training_plan,
          );

          const planData = planResp?.data ?? planResp;

          setTrainingPlanDays(planData?.no_of_days || 1);
          setTrainingPlanName(planData?.training_name || "");
        }

        // C. Initialize Selected TR Pool
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

  // ==========================================
  // 2. GLOBAL PARTICIPANT AGGREGATOR
  // ==========================================

  useEffect(() => {
    if (selectedTrIds.length === 0) {
      setUnallocatedStaff([]);
      setSelectedStaffIds([]);
      return;
    }

    let active = true;

    const fetchAggregatedParticipants = async () => {
      setLoadingParticipants(true);

      try {
        const responses = await Promise.all(
          selectedTrIds.map((id) => api.get(`/tms/tr/${id}/participants/`)),
        );

        let mergedPool = [];

        responses.forEach((resp, index) => {
          const sourceTrId = selectedTrIds[index];

          const participants = resp?.data?.results || resp?.data || [];

          participants.forEach((p) => {
            if (!p.CB_selected) {
              mergedPool.push({
                ...p,
                source_tr_id: sourceTrId,
              });
            }
          });
        });

        if (!active) return;

        setUnallocatedStaff(mergedPool);

        // Initial selection: Base TR participants only
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
          // Remove selections that no longer exist
          const validPoolIds = new Set(mergedPool.map((p) => String(p.id)));

          setSelectedStaffIds((prev) =>
            prev.filter((id) => validPoolIds.has(String(id))),
          );
        }
      } catch (error) {
        console.error("Failed to aggregate participants:", error);
      } finally {
        if (active) setLoadingParticipants(false);
      }
    };

    fetchAggregatedParticipants();

    return () => {
      active = false;
    };
  }, [selectedTrIds, baseTrId]);

  // ==========================================
  // 3. FETCH TARGET AND ACHIEVEMENT
  // ONLY ONE API: /tms/dtp/target-count/
  // ==========================================

  useEffect(() => {
    let active = true;

    if (!baseTrDetails || !selectedTrIds.length) {
      setTrDetails({});
      setTargetsLoading(false);
      return;
    }

    setTargetsLoading(true);

    const targetRequests = new Map();

    const fetchTargets = async () => {
      try {
        const rows = await Promise.all(
          selectedTrIds.map(async (id) => {
            let key = String(id);
            let districtName = "District unavailable";

            try {
              // Fetch TR details
              const response =
                Number(id) === baseTrId
                  ? baseTrDetails
                  : await TMS_API.trainingRequests.retrieve(id);

              const tr = response?.data ?? response;

              key = `${tr.financial_year}:${tr.training_plan}:${tr.partner}:${tr.district}`;

              districtName = tr.district_name_en || districtName;

              // Reuse one target API request for identical
              // financial year, plan, partner and district.
              if (!targetRequests.has(key)) {
                targetRequests.set(
                  key,
                  api
                    .get("/tms/dtp/target-count/", {
                      params: {
                        financial_year: tr.financial_year,
                        training_plan_id: tr.training_plan,
                        partner_id: tr.partner,
                        district_id: tr.district,
                      },
                    })
                    .then(({ data }) => {
                      const items = Array.isArray(data)
                        ? data
                        : Array.isArray(data?.results)
                          ? data.results
                          : Array.isArray(data?.data)
                            ? data.data
                            : [data?.data ?? data];

                      // Match the exact district, partner,
                      // training plan and financial year.
                      const matches = items.filter((item) => {
                        const meta = item?.meta ?? item;

                        return (
                          meta &&
                          [
                            [meta.district_id ?? meta.district, tr.district],
                            [meta.partner_id ?? meta.partner, tr.partner],
                            [
                              meta.training_plan_id ?? meta.training_plan,
                              tr.training_plan,
                            ],
                            [meta.financial_year, tr.financial_year],
                          ].every(
                            ([value, expected]) =>
                              value == null ||
                              String(value) === String(expected),
                          )
                        );
                      });

                      return matches.length === 1 ? matches[0] : null;
                    }),
                );
              }

              const item = await targetRequests.get(key);

              // Total allocated target
              const value =
                item?.total_target_count ??
                item?.target_count ??
                item?.target ??
                item?.participant_target ??
                null;

              const target =
                value !== null && value !== "" && Number.isFinite(Number(value))
                  ? Number(value)
                  : null;

              // Actual existing achievement
              const achievementValue =
                item?.achievement_count ??
                item?.total_achievement_count ??
                item?.achievement ??
                0;

              const achievement = Number.isFinite(Number(achievementValue))
                ? Number(achievementValue)
                : 0;

              return [
                String(id),
                {
                  target,
                  achievement,
                  districtName:
                    item?.district_name_en ||
                    item?.meta?.district_name ||
                    item?.district_name ||
                    districtName,
                  key,
                },
              ];
            } catch (error) {
              console.error(`Failed to fetch target for TR ${id}:`, error);

              return [
                String(id),
                {
                  target: null,
                  achievement: 0,
                  districtName,
                  key,
                },
              ];
            }
          }),
        );

        if (active) {
          setTrDetails(Object.fromEntries(rows));
        }
      } catch (error) {
        console.error("Target fetching failed:", error);
      }
    };

    fetchTargets().finally(() => {
      if (active) setTargetsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [selectedTrIds, baseTrId, baseTrDetails]);

  // ==========================================
  // 4. VALIDATION AND TARGET CALCULATIONS
  // ==========================================

  const currentSelectedCount = selectedStaffIds.length;

  const selectedSet = new Set(selectedStaffIds.map(String));

  // Count selected participants by target group
  const selectedByTarget = {};

  unallocatedStaff.forEach((p) => {
    if (selectedSet.has(String(p.id))) {
      const key =
        trDetails[String(p.source_tr_id)]?.key ?? String(p.source_tr_id);

      selectedByTarget[key] = (selectedByTarget[key] || 0) + 1;
    }
  });

  // One district card per unique target group
  const trTargets = Object.values(
    selectedTrIds.reduce((groups, trId) => {
      const details = trDetails[String(trId)] || {};
      const key = details.key || String(trId);

      if (
        !groups[key] ||
        (groups[key].target == null && details.target != null)
      ) {
        groups[key] = {
          trId,
          districtName: details.districtName || "Loading...",
          target: details.target ?? null,
          achievement: details.achievement ?? 0,
          selected: selectedByTarget[key] || 0,
        };
      }

      return groups;
    }, {}),
  );

  // Target exceeded only when existing achievement
  // plus currently selected participants exceeds target.
  const exceededTR = trTargets.find(
    (tr) =>
      tr.target !== null &&
      Number(tr.achievement) + Number(tr.selected) > Number(tr.target),
  );

  // Check missing target
  const missingTargetTR = trTargets.find((tr) => tr.target === null);

  // Participant selection validation
  const isSelectionValid =
    currentSelectedCount > 0 &&
    currentSelectedCount >= minRequired &&
    currentSelectedCount <= maxAllowed;

  // Overall form validation
  const isFormComplete = Boolean(
    isSelectionValid &&
    selectedCentre?.id &&
    startDate &&
    endDate &&
    !targetsLoading &&
    !loadingParticipants &&
    trTargets.length &&
    !missingTargetTR &&
    !exceededTR,
  );

  // ==========================================
  // 5. BATCH SUBMISSION
  // ==========================================

  const handleConfirmAndSave = async () => {
    if (!isFormComplete) return;

    setIsSubmitting(true);

    try {
      const payload = {
        participant_type: participantType,
        batch_type: "SEPARATE",
        district_tp_user_id: user?.id,
        participant_ids: selectedStaffIds,
        block_id: null,
        training_plan_id: baseTrDetails.training_plan,
        centre_id: selectedCentre.id,
        district_id: null,
        level: "STATE",
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

      // Handle 409 Engagement Conflict
      if (
        error?.response?.status === 409 &&
        error?.response?.data?.engaged_participants
      ) {
        setEngagedParticipants(error.response.data.engaged_participants);

        setShowEngagementModal(true);
      } else {
        alert(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Failed to create batch. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 6. RENDER
  // ==========================================

  if (loadingBase) return <ScreenLoader />;

  return (
    <div className="app-shell">
      {(loadingParticipants || targetsLoading || isSubmitting) && (
        <ScreenLoader />
      )}

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
          {/* FLOATING COUNTER */}
          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "40px",
              zIndex: 900,
              width: 240,
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            <StaffBatchCounter
              selectedCount={currentSelectedCount}
              minRequired={minRequired}
              maxAllowed={maxAllowed}
              trTargets={targetsLoading ? [] : trTargets}
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
            {/* CONTEXT BANNER */}
            <TRSummaryHeader
              trDetails={baseTrDetails}
              totalUnallocated={unallocatedStaff.length}
              trainingPlanName={trainingPlanName}
              participantType={participantType}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
                marginTop: "24px",
              }}
            >
              {/* TRAINING REQUEST SEARCH */}
              <StaffTRSearch
                baseTrDetails={baseTrDetails}
                selectedTrIds={selectedTrIds}
                onTrSelectionChange={setSelectedTrIds}
                participantType={participantType}
              />

              {/* PARTICIPANT TABLE */}
              <StaffTRParticipantTable
                staffPool={unallocatedStaff}
                loading={loadingParticipants}
                baseTrId={baseTrId}
                selectedStaffIds={selectedStaffIds}
                onStaffSelectionChange={setSelectedStaffIds}
                maxAllowed={maxAllowed}
                participantType={participantType}
                engagedParticipants={engagedParticipants}
              />

              {/* SELECTED PARTICIPANTS */}
              <StaffSelectionTable
                staffPool={unallocatedStaff}
                selectedIds={selectedStaffIds}
                onSelectionChange={setSelectedStaffIds}
                maxAllowed={maxAllowed}
                participantType={participantType}
                engagedParticipants={engagedParticipants}
              />

              {/* CENTRE SELECTION */}
              <CentreSelectionTable
                partnerId={baseTrDetails?.partner}
                selectedCentre={selectedCentre}
                onSelectCentre={setSelectedCentre}
              />

              {/* DATE CONFIGURATION */}
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

            {/* ACTION FOOTER */}
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
                {targetsLoading || loadingParticipants
                  ? "⚠ Loading selected Training Requests and targets."
                  : !selectedTrIds.length
                    ? "⚠ Please select a Training Request."
                    : exceededTR
                      ? `⚠ ${exceededTR.districtName}: Achievement (${exceededTR.achievement}) + Selected (${exceededTR.selected}) exceeds target (${exceededTR.target}).`
                      : missingTargetTR
                        ? `⚠ Target unavailable for ${missingTargetTR.districtName}.`
                        : !isSelectionValid
                          ? `⚠ Please select between ${minRequired} and ${maxAllowed} participants.`
                          : !selectedCentre?.id
                            ? "⚠ Please select a Training Centre."
                            : !startDate
                              ? "⚠ Please select a Start Date."
                              : !endDate
                                ? "⚠ Please select an End Date."
                                : "✓ Configuration is valid and ready."}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
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

      {/* PRE-FLIGHT PREVIEW MODAL */}
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
          participantType={participantType}
        />
      )}

      {/* ENGAGEMENT CONFLICT MODAL */}
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

            <div
              style={{
                overflowY: "auto",
                flex: 1,
                paddingRight: "8px",
              }}
            >
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
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {ep.name || "-"}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                          color: "#475569",
                        }}
                      >
                        {ep.employee_id || ep.mobile_no || "-"}
                      </td>

                      <td
                        style={{
                          padding: "10px",
                          color: "#b91c1c",
                        }}
                      >
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
}
