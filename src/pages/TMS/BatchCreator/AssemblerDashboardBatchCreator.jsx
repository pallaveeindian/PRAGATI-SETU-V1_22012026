// src/pages/TMS/BatchCreator/AssemblerDashboardBatchCreator
import React, { useEffect, useState, useCallback } from "react";
import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
import ParticipantCount from "./ParticipantCount";
import FilterComponent from "./FilterComponent";
import ParticipantTable from "./TraineesDisplayTable";
import TmsLeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import { TMS_API } from "../../../api/axios";
import { getUser } from "../../../utils/storage";
import { useLocation } from "react-router-dom";

const AssemblerDashboardBatchCreator = () => {
  const [filters, setFilters] = useState({
    financialYear: "",
    trainingTheme: "",
    trainingPlan: "",
    trainingPlanDays: "",
    participantType: "",
    gender: "",
    designation: "",
    religion: "",
    socialCategory: "",
    pldStatus: "",
    panchayat: "",
    village: "",
    ageRange: "",
    searchValue: "",
    startDate: "",
    endDate: "",
    trainingCenter: "",
    block: "",
    districtId: "",
    batchType: "Separate",
  });

  // Strategy Mode Switcher State: "SEPARATE" or "COMBINED"
  const [batchType, setBatchType] = useState("SEPARATE");
  const [achievementData, setAchievementData] = useState({
    achievement: 0,
    target: 0,
  });

  // Store selected row objects containing details like: { id, block_id, tr_id }
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [participantData, setParticipantData] = useState({
    selectedParticipants: [],
    totalLimit: 0,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeBatchId, setResumeBatchId] = useState(null);
  const [resumeBeneficiary, setResumeBeneficiary] = useState(null);
  const [isResumeMode, setIsResumeMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const location = useLocation();
  const user = getUser();

  // ===========================
  // FILTER CHANGE HANDLER
  // ===========================
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "batchType") {
      setBatchType(value.toUpperCase());
    }
  };

  // ===========================
  // ACHIEVEMENT CARD DYNAMICS
  // ===========================
  useEffect(() => {
    if (
      filters.financialYear &&
      filters.trainingTheme &&
      filters.trainingPlan
    ) {
      setAchievementData({ achievement: 285, target: 440 });
    } else {
      setAchievementData({ achievement: 0, target: 0 });
    }
  }, [filters.financialYear, filters.trainingTheme, filters.trainingPlan]);

  // ===========================
  // PARTICIPANT LIMIT DYNAMICS
  // ===========================
  useEffect(() => {
    if (
      filters.participantType === "Trainer" ||
      filters.participantType === "Beneficiary"
    ) {
      setParticipantData((prev) => ({
        ...prev,
        totalLimit: 40,
      }));
    } else {
      setParticipantData({ selectedParticipants: [], totalLimit: 0 });
    }
  }, [filters.participantType]);

  const handleSelectionChange = useCallback(
    (selectedRowsOrIds) => {
      const standardizedRows = selectedRowsOrIds.map((item) => {
        if (typeof item === "object" && item !== null) {
          const rawBlock =
            item.block_id || item.blockId || item.block || item.block_code;
          const explicitBlockId =
            rawBlock && typeof rawBlock === "object"
              ? rawBlock.id || rawBlock.block_id
              : rawBlock;

          const trId =
            item.tr_id ||
            item.trId ||
            item.training_request_id ||
            item.training_request ||
            40;

          const fallbackBlock = Array.isArray(filters.block)
            ? filters.block[0] || 313581
            : filters.block || 313581;

          return {
            id: item.id || item.participant_id || item.participantId,
            block_id: explicitBlockId
              ? Number(explicitBlockId)
              : Number(fallbackBlock),
            tr_id: Number(trId),
          };
        } else {
          const fallbackBlock = Array.isArray(filters.block)
            ? filters.block[0] || 313581
            : filters.block || 313581;

          return {
            id: item,
            block_id: Number(fallbackBlock),
            tr_id: 40,
          };
        }
      });

      setSelectedTrainees(standardizedRows);
      setParticipantData((prev) => ({
        ...prev,
        selectedParticipants: standardizedRows.map((r) => r.id),
      }));
    },
    [filters.block],
  );

  const handleConfirmAndSave = async (status = "SCHEDULED") => {
    setIsSubmitting(true);

    try {
      const resolvedBatchType = (
        filters.batchType ||
        batchType ||
        ""
      ).toUpperCase();

      const basePayload = {
        financial_year: filters.financialYear || "2026-27",
        participant_type:
          filters.participantType?.toUpperCase() || "BENEFICIARY",
        batch_type: resolvedBatchType === "COMBINED" ? "COMBINED" : "SEPARATE",
        training_plan_id: Number(filters.trainingPlan) || 5,
        district_tp_user_id: user?.id || 1050,
        centre_id: Number(filters.trainingCenter),
        district_id: Number(filters.districtId),
        start_date: filters.startDate || "2026-07-10",
        end_date: filters.endDate || "2026-07-15",
        status: status, // DRAFT, PENDING, SCHEDULED
      };

      let finalPayload;

      // ======================================================
      // 🔴 SEPARATE BATCH LOGIC
      // ======================================================
      if (resolvedBatchType === "SEPARATE") {
        const participantIds = selectedTrainees
          .map((t) => t?.id)
          .filter(Boolean);

        const blockId =
          selectedTrainees.find((t) => t?.block_id)?.block_id ||
          (Array.isArray(filters.block) ? filters.block[0] : filters.block);

        if (!blockId) {
          alert("Block Id not found.");
          setIsSubmitting(false);
          return;
        }

        if (!participantIds.length) {
          alert("Please select participants.");
          setIsSubmitting(false);
          return;
        }

        finalPayload = {
          ...basePayload,
          batch_type: "SEPARATE",
          block_id: Number(blockId),
          participant_ids: participantIds,
        };
      }
      // ======================================================
      // 🔵 COMBINED BATCH LOGIC
      // ======================================================
      else {
        const blockGroupMap = {};

        const filterBlockArray = Array.isArray(filters.block)
          ? filters.block.map(Number)
          : [];

        selectedTrainees.forEach((t, idx) => {
          let blockId = t?.block_id || t?.blockId;
          const trId = t?.tr_id || t?.trId || 40;
          const id = t?.id;

          if (!id) return;

          if ((!blockId || blockId === 313581) && filterBlockArray.length > 0) {
            blockId = filterBlockArray[idx % filterBlockArray.length];
          }

          if (!blockId) {
            blockId = filterBlockArray[0] || 313581;
          }

          if (!blockGroupMap[blockId]) {
            blockGroupMap[blockId] = {};
          }

          if (!blockGroupMap[blockId][trId]) {
            blockGroupMap[blockId][trId] = [];
          }

          if (!blockGroupMap[blockId][trId].includes(id)) {
            blockGroupMap[blockId][trId].push(id);
          }
        });

        const blocks = Object.keys(blockGroupMap).map((bId) => ({
          block_id: Number(bId),
          training_requests: Object.keys(blockGroupMap[bId]).map((tId) => ({
            tr_id: Number(tId),
            participant_ids: blockGroupMap[bId][tId],
          })),
        }));

        if (!blocks.length) {
          alert("No valid combined selection found.");
          setIsSubmitting(false);
          return;
        }

        finalPayload = {
          ...basePayload,
          batch_type: "COMBINED",
          blocks,
        };
      }

      // Route execution depending on Resume Mode
      if (isResumeMode && resumeBatchId) {
        await TMS_API.batchCreator.update(resumeBatchId, finalPayload);
        alert(`Batch successfully updated as ${status}.`);
      } else {
        await TMS_API.batchCreator.create(finalPayload);
        alert(`Batch successfully created as ${status}.`);
      }

      // Optional: Close the preview modal or redirect user after success
      setIsPreviewOpen(false);
    } catch (error) {
      console.error("API ERROR:", error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to process batch.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const batchId = location.state?.batchId;

    if (batchId) {
      setResumeBatchId(batchId);
      setIsResumeMode(true);
      loadResumeBatch(batchId);
    }
  }, [location.state]);

  const loadResumeBatch = async (batchId) => {
    try {
      const response = await TMS_API.batchDetailV2(batchId);
      const data = response.data;
      const selectedIds =
        data?.participant_type === "TRAINER"
          ? data?.trainer || []
          : data?.beneficiary || [];

      setResumeBeneficiary(selectedIds);
      setBatchType("SEPARATE");
      setRejectionReason(data?.rejection_reason || "");
      setFilters((prev) => ({
        ...prev,

        batchType: "Separate",

        financialYear: data?.financial_year || "",

        trainingTheme: data?.training_plan?.theme?.theme_name || "",

        trainingThemeId: String(data?.training_plan?.theme?.id || ""),

        trainingPlan: String(data?.training_plan?.id || ""),

        trainingPlanDays: String(data?.training_plan?.no_of_days || ""),

        participantType:
          data?.participant_type === "BENEFICIARY"
            ? "Beneficiary"
            : data?.participant_type === "TRAINER"
              ? "Trainer"
              : "",

        startDate: data?.start_date || "",

        endDate: data?.end_date || "",

        trainingCenter: String(data?.centre?.id || ""),

        districtId: String(data?.district || ""),

        block: String(data?.block || ""),
      }));
    } catch (error) {
      console.error("Failed to load resume batch:", error);
      console.error("Response:", error?.response);
      console.error("Data:", error?.response?.data);
    }
  };

  const handleResumeTrainees = useCallback(
    (traineesResp) => {
      if (!Array.isArray(resumeBeneficiary) || resumeBeneficiary.length === 0) {
        return;
      }

      const trainees = traineesResp
        .filter(
          (item) =>
            item?.CB_selected === true && resumeBeneficiary.includes(item?.id),
        )
        .map((item) => ({
          id: item.id,
          block_id: item.block,
          tr_id: item.training_request,
        }));

      setSelectedTrainees(trainees);

      setParticipantData((prev) => ({
        ...prev,
        selectedParticipants: trainees.map((t) => t.id),
      }));
    },
    [resumeBeneficiary],
  );

  const resumeSelectedIds = React.useMemo(
    () => selectedTrainees.map((t) => t.id),
    [selectedTrainees],
  );

  return (
    <>
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
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            margin: "24px",
            boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* SURGICAL FIX 3: Display Rejection Reason Banner if available in Resume Mode */}
          {isResumeMode && rejectionReason && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderLeft: "4px solid #ef4444",
                borderRadius: "8px",
                padding: "16px 20px",
                marginBottom: "24px",
                color: "#991b1b",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ⚠️ Batch Rejected
              </div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                <strong>Reason:</strong> {rejectionReason}
              </div>
            </div>
          )}

          {/* Top Panel - Stats Indicators Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "stretch",
              gap: "16px",
              marginBottom: "24px",
              width: "100%",
            }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <AcheivenmentVsTarget
                achievement={achievementData.achievement}
                target={achievementData.target}
              />
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FilterComponent filters={filters} handleChange={handleChange} />
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <ParticipantCount
                selectedParticipants={
                  participantData.selectedParticipants.length
                }
                totalLimit={participantData.totalLimit}
              />
            </div>
          </div>

          {/* Operational Parameter Safeguard Notice Banner */}
          {(!filters.financialYear ||
            !filters.trainingPlan ||
            !filters.participantType) && (
            <div
              style={{
                backgroundColor: "#fffbeb",
                border: "1px solid #fef3c7",
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "20px",
                color: "#b45309",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              💡 <strong>Required Configurations Missing:</strong> Please select
              a <strong>Financial Year</strong>, <strong>Training Plan</strong>,
              and <strong>Participant Type</strong> to extract eligible
              workspace data layers.
            </div>
          )}

          {/* Main Display Selection Table Element */}
          <div style={{ width: "100%", flex: 1, marginBottom: "20px" }}>
            {filters.participantType ? (
              <ParticipantTable
                filters={filters}
                handleChange={handleChange}
                onSelectionChange={handleSelectionChange}
                batchId={resumeBatchId}
                resumeSelectedIds={resumeSelectedIds}
                onTraineesLoaded={handleResumeTrainees}
                isResumeMode={isResumeMode}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#94a3b8",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                }}
              >
                Select Apply Filter
              </div>
            )}
          </div>

          {/* Bottom Execution Layout Action Row Bar Wrapper */}
          {filters.participantType && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                paddingTop: "16px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                onClick={() => setIsPreviewOpen(true)}
                disabled={participantData.selectedParticipants.length === 0}
                style={{
                  background:
                    participantData.selectedParticipants.length === 0
                      ? "#cbd5e1"
                      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color:
                    participantData.selectedParticipants.length === 0
                      ? "#94a3b8"
                      : "#ffffff",
                  padding: "12px 32px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow:
                    participantData.selectedParticipants.length === 0
                      ? "none"
                      : "0 4px 12px rgba(37, 99, 235, 0.15)",
                  cursor:
                    participantData.selectedParticipants.length === 0
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Confirm & Submit ({batchType}) Batch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW CONFIGURATION OVERLAY MODAL */}
      {isPreviewOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(15, 23, 42, 0.5)",
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
              maxWidth: "540px",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
              padding: "32px",
              border: "1px solid #e2e8f0",
            }}
          >
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
                Batch Processing Details Preview
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
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
                  {batchType} Batch
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: "10px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#64748b" }}>
                  Selected Targets Pool:
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#0f172a",
                    fontWeight: "600",
                  }}
                >
                  {participantData.selectedParticipants.length} Trainees
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: "10px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#64748b" }}>
                  Training Theme:
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#0f172a",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  {filters.trainingTheme || "Not Specified"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: "10px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#64748b" }}>
                  Financial Year:
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#0f172a",
                    fontWeight: "600",
                  }}
                >
                  {filters.financialYear || "Not Specified"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setIsPreviewOpen(false)}
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
                onClick={() => handleConfirmAndSave("DRAFT")}
                disabled={isSubmitting}
                style={{
                  background: "#f59e0b",
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleConfirmAndSave("PENDING")}
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
                }}
              >
                {isSubmitting ? "Processing..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssemblerDashboardBatchCreator;
