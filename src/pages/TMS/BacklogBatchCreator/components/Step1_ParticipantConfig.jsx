// src\pages\TMS\BacklogBatchCreator\components\Step1_ParticipantConfig.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import api, { LOOKUP_API, TMS_API } from "../../../../api/axios";
import AcheivenmentVsTarget from "../../BatchCreator/AcheivenmentVsTarget";
import { getCanonicalRole } from "../../../../utils/roleUtils";
import { getUser } from "../../../../utils/storage";

const isPrimitiveId = (v) => typeof v === "number" || typeof v === "string";

// Extract district id from geoscope response
const extractDistrictId = (data) => {
  if (!data) return null;

  if (Array.isArray(data.districts) && data.districts.length > 0) {
    const first = data.districts[0];
    if (isPrimitiveId(first)) return first;
    if (first && typeof first === "object") {
      return first.district_id ?? first.id ?? first.value ?? null;
    }
  }

  const d = data.district;
  return (
    extractDistrictId(data.data) ??
    extractDistrictId(data.result) ??
    data.district_id ??
    data.districtId ??
    (isPrimitiveId(d) ? d : (d?.district_id ?? d?.id)) ??
    null
  );
};

// Generic lookup loader
const useLookup = (fetcher, setter, label, deps, enabled = true) => {
  useEffect(() => {
    if (!enabled) return setter([]);

    let active = true;

    fetcher()
      .then((res) => active && setter(res?.data?.results || []))
      .catch((err) => {
        console.error(`${label} lookup failed:`, err);
        active && setter([]);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const Field = ({ label, children }) => (
  <div>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

const Auto = () => (
  <span style={{ color: "#64748b", marginLeft: 6 }}>(Auto-assigned)</span>
);

export default function Step1_ParticipantConfig({
  batchData,
  updateBatchData,
  aggregatedPool,
  loadingPool,
  onNext,
}) {
  // ==========================================
  // ACHIEVEMENT VS TARGET STATE
  // ==========================================

  const [achievementData, setAchievementData] = useState({
    achievement: 0,
    target: 0,
  });

  const [targetLoading, setTargetLoading] = useState(false);
  const [targetError, setTargetError] = useState(false);

  // ==========================================
  // EXISTING STATE
  // ==========================================

  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [partners, setPartners] = useState([]);
  const [centres, setCentres] = useState([]);
  const [plans, setPlans] = useState([]);
  const [themes, setThemes] = useState([]);

  const [isBlockDropdownOpen, setIsBlockDropdownOpen] = useState(false);
  const [loadingUserDistrict, setLoadingUserDistrict] = useState(false);
  const [geoscopeDistrictName, setGeoscopeDistrictName] = useState("");

  const [availableTrs, setAvailableTrs] = useState([]);
  const [loadingTrs, setLoadingTrs] = useState(false);

  // Role detection
  const user = useMemo(() => getUser() || {}, []);
  const role = getCanonicalRole(user);

  const normalizedRole = String(role || user?.role_name || user?.role || "")
    .trim()
    .toLowerCase();

  const isDtp = normalizedRole === "dtp";

  // Latest refs
  const updateRef = useRef(updateBatchData);
  const batchRef = useRef(batchData);

  useEffect(() => {
    updateRef.current = updateBatchData;
    batchRef.current = batchData;
  });

  const blockIds = batchData.blockIds || [];
  const selectedTrIds = batchData.selectedTrIds || [];
  const selectedParticipants = batchData.selectedParticipants || [];

  const pCount = selectedParticipants.length;

  // ==========================================
  // ACHIEVEMENT VS TARGET CALCULATIONS
  // ==========================================

  const remainingTarget = Math.max(
    0,
    achievementData.target - achievementData.achievement,
  );

  const projectedAchievement = achievementData.achievement + pCount;

  const isTargetMet =
    achievementData.target > 0 &&
    achievementData.achievement >= achievementData.target;

  const isTargetExceeded =
    achievementData.target > 0 && projectedAchievement > achievementData.target;

  // ==========================================
  // FETCH ACHIEVEMENT VS TARGET
  // ==========================================

  useEffect(() => {
    let active = true;

    const fetchTargetData = async () => {
      if (!batchData.financialYear || !batchData.trainingPlanId) {
        setAchievementData({
          achievement: 0,
          target: 0,
        });
        setTargetError(false);
        setTargetLoading(false);
        return;
      }

      setTargetLoading(true);
      setTargetError(false);

      try {
        const response = await api.get("/tms/dtp/target-count/", {
          params: {
            financial_year: batchData.financialYear,
            training_plan_id: batchData.trainingPlanId,
          },
        });

        if (!active) return;

        setAchievementData({
          achievement: Number(response.data.total_achievement_count || 0),
          target: Number(response.data.total_target_count || 0),
        });
      } catch (error) {
        console.error(
          "Failed to fetch achievement and target:",
          error?.response?.data || error,
        );

        if (active) {
          setTargetError(true);
          setAchievementData({
            achievement: 0,
            target: 0,
          });
        }
      } finally {
        if (active) {
          setTargetLoading(false);
        }
      }
    };

    fetchTargetData();

    return () => {
      active = false;
    };
  }, [batchData.financialYear, batchData.trainingPlanId]);

  // ==========================================
  // LOOKUPS
  // ==========================================

  useLookup(
    () => LOOKUP_API.districts.list({ page_size: 100 }),
    setDistricts,
    "District",
    [],
  );

  useLookup(
    () => TMS_API.trainingPartners.list({ page_size: 100 }),
    setPartners,
    "Training partners",
    [],
  );

  useLookup(
    () => TMS_API.trainingThemes.list({ page_size: 100 }),
    setThemes,
    "Training themes",
    [],
  );

  useLookup(
    () =>
      TMS_API.trainingPlans.list({
        theme: batchData.themeId,
        page_size: 500,
      }),
    setPlans,
    "Training plans",
    [batchData.themeId],
    !!batchData.themeId,
  );

  useLookup(
    () =>
      LOOKUP_API.blocks.list({
        district_id: batchData.districtId,
        page_size: 100,
      }),
    setBlocks,
    "Blocks",
    [batchData.districtId],
    !!batchData.districtId,
  );

  useLookup(
    () =>
      TMS_API.trainingPartnerCentres.list({
        district: batchData.districtId,
        partner: batchData.partnerId,
        page_size: 100,
      }),
    setCentres,
    "Training centres",
    [batchData.districtId, batchData.partnerId],
    !!(batchData.districtId && batchData.partnerId),
  );

  // ==========================================
  // FETCH USER DISTRICT (DTP ONLY)
  // ==========================================

  useEffect(() => {
    if (!isDtp || !user?.id) return;

    let active = true;

    (async () => {
      setLoadingUserDistrict(true);

      try {
        const { data } = await LOOKUP_API.userGeoscopeByUserId(user.id);

        if (!active) return;

        const districtId = extractDistrictId(data);

        if (districtId == null) {
          console.error("District ID could not be extracted.", data);
          return;
        }

        const first = data?.districts?.[0];

        setGeoscopeDistrictName(
          first && typeof first === "object"
            ? first.district_name_en || first.district_name || first.name || ""
            : "",
        );

        const id = String(districtId);

        if (String(batchRef.current?.districtId || "") !== id) {
          updateRef.current({
            districtId: id,
            blockIds: [],
            selectedTrIds: [],
            selectedParticipants: [],
            centreId: "",
          });
        }
      } catch (error) {
        console.error(
          "User geoscope API failed:",
          error?.response?.status,
          error?.response?.data,
        );
      } finally {
        if (active) setLoadingUserDistrict(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isDtp, user?.id]);

  // ==========================================
  // AUTO-ASSIGN TRAINING PARTNER (DTP ONLY)
  // ==========================================

  useEffect(() => {
    if (!isDtp) return;

    let active = true;

    TMS_API.parentPartner()
      .then((resp) => {
        if (!active) return;

        const d = resp?.data;
        const assignedId = d?.partner_id ?? d?.partner?.id ?? d?.id;

        if (!assignedId) return;

        const prevId = batchRef.current.partnerId;

        if (String(prevId || "") !== String(assignedId)) {
          updateRef.current({
            partnerId: String(assignedId),
            ...(prevId ? { centreId: "" } : {}),
          });
        }
      })
      .catch((err) =>
        console.error(
          "Training partner auto-assignment failed:",
          err?.response?.status,
          err?.response?.data,
        ),
      );

    return () => {
      active = false;
    };
  }, [isDtp]);

  // Fallback: only one partner available
  useEffect(() => {
    if (isDtp && !batchData.partnerId && partners.length === 1) {
      updateRef.current({
        partnerId: String(partners[0].id),
      });
    }
  }, [isDtp, partners, batchData.partnerId]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleLevelOrTypeChange = (key, value) => {
    const futureLevel = key === "level" ? value : batchData.level;

    updateBatchData({
      [key]: value,
      ...(futureLevel === "DISTRICT" || futureLevel === "STATE"
        ? { blockIds: [] }
        : {}),
      selectedTrIds: [],
      selectedParticipants: [],
    });
  };

  const setSelectedBlocks = (ids) =>
    updateBatchData({
      blockIds: ids,
      batchType: ids.length > 1 ? "COMBINED" : "SEPARATE",
      selectedTrIds: [],
      selectedParticipants: [],
    });

  const handleBlockCheckboxChange = (blockId) => {
    const id = String(blockId);
    const current = blockIds.map(String);

    setSelectedBlocks(
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
    );
  };

  const removeSelectedBlock = (blockId) =>
    setSelectedBlocks(blockIds.filter((id) => String(id) !== String(blockId)));

  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    let endDate = "";

    const plan = plans.find(
      (p) => String(p.id) === String(batchData.trainingPlanId),
    );

    if (startDate && plan?.no_of_days) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + Number(plan.no_of_days) - 1);
      endDate = start.toISOString().split("T")[0];
    }

    updateBatchData({ startDate, endDate });
  };

  // ==========================================
  // FETCH BACKLOG TRAINING REQUESTS
  // ==========================================

  const fetchTrainingRequests = async (ids) => {
    setLoadingTrs(true);
    setAvailableTrs([]);

    try {
      const requests = await Promise.all(
        ids.map(async (blockId) => {
          const response = await TMS_API.trainingRequestsList.list({
            is_old: true,
            status: "BATCHING",
            financial_year: batchData.financialYear,
            training_plan_id: batchData.trainingPlanId,
            training_type: String(batchData.participantType).toUpperCase(),
            district_id: batchData.districtId,
            block_id: blockId,
            page_size: 100,
          });

          const data = response?.data;

          const results =
            [data, data?.results, data?.data, data?.data?.results].find(
              Array.isArray,
            ) || [];

          return results.filter((tr) => {
            const returned =
              tr.block_id ?? tr.block?.block_id ?? tr.block?.id ?? tr.block;

            return String(returned ?? "") === String(blockId);
          });
        }),
      );

      setAvailableTrs([
        ...new Map(requests.flat().map((tr) => [String(tr.id), tr])).values(),
      ]);
    } catch (err) {
      console.error(
        "Backlog TR fetch failed:",
        err?.response?.status,
        err?.response?.data,
      );

      setAvailableTrs([]);

      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to fetch training requests. Check the browser console and Network tab.",
      );
    } finally {
      setLoadingTrs(false);
    }
  };

  useEffect(() => {
    if (
      batchData.level !== "BLOCK" ||
      !batchData.districtId ||
      !batchData.financialYear ||
      !batchData.trainingPlanId ||
      !batchData.participantType ||
      blockIds.length === 0
    ) {
      setAvailableTrs([]);
      setLoadingTrs(false);
      return;
    }

    fetchTrainingRequests(blockIds.map(String));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    batchData.blockIds,
    batchData.districtId,
    batchData.financialYear,
    batchData.trainingPlanId,
    batchData.participantType,
    batchData.level,
  ]);

  const toggleTrSelection = (trId) =>
    updateBatchData({
      selectedTrIds: selectedTrIds.includes(trId)
        ? selectedTrIds.filter((id) => id !== trId)
        : [...selectedTrIds, trId],
    });

  // ==========================================
  // PARTICIPANT SELECTION WITH TARGET VALIDATION
  // ==========================================

  const toggleParticipantSelection = (pObj) => {
    // Allow deselection at all times
    if (selectedParticipants.some((p) => String(p.id) === String(pObj.id))) {
      return updateBatchData({
        selectedParticipants: selectedParticipants.filter(
          (p) => String(p.id) !== String(pObj.id),
        ),
      });
    }

    // Do not allow selection until target is loaded
    if (targetLoading || targetError || achievementData.target <= 0) {
      return alert(
        "Training target is not available. Please wait or check the selected financial year and training plan.",
      );
    }

    // Maximum batch size
    if (selectedParticipants.length >= 60) {
      return alert("Maximum 60 participants allowed per batch.");
    }

    const projectedCount =
      achievementData.achievement + selectedParticipants.length + 1;

    // Remaining target validation
    if (projectedCount > achievementData.target) {
      return alert(
        `Only ${remainingTarget - selectedParticipants.length} additional participant(s) can be selected within the remaining training target.`,
      );
    }

    updateBatchData({
      selectedParticipants: [...selectedParticipants, pObj],
    });
  };

  // ==========================================
  // SELECT ALL PARTICIPANTS WITH TARGET VALIDATION
  // ==========================================

  const selectAllParticipants = (e) => {
    if (!e.target.checked) {
      return updateBatchData({
        selectedParticipants: [],
      });
    }

    if (targetLoading || targetError || achievementData.target <= 0) {
      return alert(
        "Training target is not available. Please wait or check the selected financial year and training plan.",
      );
    }

    const space = Math.min(
      60 - selectedParticipants.length,
      Math.max(0, remainingTarget - selectedParticipants.length),
    );

    if (space <= 0) {
      return alert(
        "No additional participants can be selected within the remaining training target.",
      );
    }

    const toAdd = aggregatedPool
      .filter(
        (ap) =>
          !selectedParticipants.some((sp) => String(sp.id) === String(ap.id)),
      )
      .slice(0, space);

    updateBatchData({
      selectedParticipants: [...selectedParticipants, ...toAdd],
    });
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const isBlockValid = useMemo(() => {
    if (batchData.level !== "BLOCK") return true;

    if (batchData.batchType === "SEPARATE") {
      return blockIds.length === 1;
    }

    if (batchData.batchType === "COMBINED") {
      return blockIds.length >= 2;
    }

    return false;
  }, [batchData.level, batchData.batchType, blockIds.length]);

  const isParticipantValid = pCount >= 20 && pCount <= 60;

  const isNextEnabled =
    [
      batchData.participantType,
      batchData.batchType,
      batchData.level,
      batchData.districtId,
      batchData.partnerId,
      batchData.centreId,
      batchData.themeId,
      batchData.trainingPlanId,
      batchData.startDate,
    ].every(Boolean) &&
    isBlockValid &&
    isParticipantValid &&
    !targetLoading &&
    !targetError &&
    achievementData.target > 0 &&
    !isTargetMet &&
    !isTargetExceeded;

  const batchTypeLocked = batchData.level === "BLOCK" && blockIds.length > 0;

  const blockPickerDisabled =
    !batchData.districtId || batchData.level !== "BLOCK";

  const lockedSelect = (locked) => ({
    ...styles.select,
    background: locked ? "#f1f5f9" : "#fff",
    cursor: locked ? "not-allowed" : "pointer",
  });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* ====================================== */}
      {/* ACHIEVEMENT VS TARGET SECTION */}
      {/* ====================================== */}

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
          background: "#f8fafc",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            color: "#1e3a8a",
            fontSize: "16px",
          }}
        >
          Achievement vs Target
        </h3>

        {targetLoading ? (
          <p style={{ color: "#2563eb" }}>Loading achievement and target...</p>
        ) : targetError ? (
          <p style={{ color: "#dc2626" }}>
            Unable to fetch achievement and target. Please try again.
          </p>
        ) : !batchData.trainingPlanId ? (
          <p style={{ color: "#64748b" }}>
            Select a training plan to view achievement and target.
          </p>
        ) : achievementData.target <= 0 ? (
          <p style={{ color: "#dc2626" }}>
            No valid training target is available for this financial year and
            training plan.
          </p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <AcheivenmentVsTarget
                  achievement={achievementData.achievement}
                  target={achievementData.target}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                <div>
                  <small style={{ color: "#64748b" }}>Total Target</small>
                  <h3
                    style={{
                      margin: "4px 0",
                      color: "#1e293b",
                    }}
                  >
                    {achievementData.target}
                  </h3>
                </div>

                <div>
                  <small style={{ color: "#64748b" }}>
                    Existing Achievement
                  </small>
                  <h3
                    style={{
                      margin: "4px 0",
                      color: "#16a34a",
                    }}
                  >
                    {achievementData.achievement}
                  </h3>
                </div>

                <div>
                  <small style={{ color: "#64748b" }}>Remaining Target</small>
                  <h3
                    style={{
                      margin: "4px 0",
                      color: "#2563eb",
                    }}
                  >
                    {remainingTarget}
                  </h3>
                </div>

                <div>
                  <small style={{ color: "#64748b" }}>
                    Selected Participants
                  </small>
                  <h3
                    style={{
                      margin: "4px 0",
                      color: "#7c3aed",
                    }}
                  >
                    {pCount}
                  </h3>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <small style={{ color: "#64748b" }}>
                    Projected Achievement After This Batch
                  </small>
                  <h3
                    style={{
                      margin: "4px 0",
                      color: isTargetExceeded ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {projectedAchievement} / {achievementData.target}
                  </h3>
                </div>
              </div>
            </div>

            {isTargetMet && (
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: "600",
                  marginBottom: 0,
                }}
              >
                The training target has already been achieved. You cannot create
                another batch against this target.
              </p>
            )}

            {isTargetExceeded && (
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: "600",
                  marginBottom: 0,
                }}
              >
                Selected participants exceed the remaining training target.
                Please reduce the selection.
              </p>
            )}
          </>
        )}
      </div>

      {/* ====================================== */}
      {/* CONFIGURATION SECTION */}
      {/* ====================================== */}

      <div style={sectionStyle}>
        <h3 style={sectionHeadingStyle}>1. Structural Configuration</h3>

        <div style={gridStyle}>
          <Field label="Participant Type *">
            <select
              style={styles.select}
              value={batchData.participantType}
              onChange={(e) =>
                updateBatchData({
                  participantType: e.target.value,
                  selectedTrIds: [],
                  selectedParticipants: [],
                })
              }
            >
              <option value="">-- Select --</option>
              <option value="BENEFICIARY">Beneficiary</option>
              <option value="TRAINER">Master Trainer</option>
              <option value="STAFF">Staff</option>
            </select>
          </Field>

          <Field label="Batch Type *">
            <select
              style={{
                ...styles.select,
                background: batchTypeLocked ? "#f1f5f9" : "#fff",
              }}
              value={batchData.batchType}
              disabled={batchTypeLocked}
              onChange={(e) =>
                handleLevelOrTypeChange("batchType", e.target.value)
              }
            >
              <option value="SEPARATE">Separate</option>
              <option value="COMBINED">Combined</option>
            </select>
          </Field>

          <Field label="Batch Level *">
            <select
              style={styles.select}
              value={batchData.level}
              onChange={(e) => handleLevelOrTypeChange("level", e.target.value)}
            >
              <option value="BLOCK">Block</option>
              <option value="DISTRICT">District</option>
              <option value="STATE">State</option>
            </select>
          </Field>

          {/* DISTRICT */}
          <div>
            <label style={styles.label}>District *{isDtp && <Auto />}</label>

            <select
              style={lockedSelect(isDtp)}
              value={batchData.districtId || ""}
              disabled={isDtp || loadingUserDistrict}
              onChange={(e) =>
                updateBatchData({
                  districtId: e.target.value,
                  blockIds: [],
                  selectedTrIds: [],
                  selectedParticipants: [],
                  centreId: "",
                })
              }
            >
              <option value="">-- Select District --</option>

              {districts.map((d) => (
                <option key={d.district_id} value={String(d.district_id)}>
                  {d.district_name_en}
                </option>
              ))}

              {batchData.districtId &&
                !districts.some(
                  (d) => String(d.district_id) === String(batchData.districtId),
                ) && (
                  <option value={String(batchData.districtId)}>
                    {geoscopeDistrictName ||
                      `District ID: ${batchData.districtId}`}
                  </option>
                )}
            </select>

            {isDtp && (
              <small
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                }}
              >
                {loadingUserDistrict
                  ? "Loading your assigned district..."
                  : "District is locked for your DTP role."}
              </small>
            )}
          </div>

          {/* BLOCK MULTISELECT */}
          <div>
            <label style={styles.label}>Select Blocks *</label>

            <details
              style={{
                position: "relative",
                width: "100%",
              }}
              onToggle={(e) => setIsBlockDropdownOpen(e.currentTarget.open)}
              open={isBlockDropdownOpen}
            >
              <summary
                style={{
                  ...styles.select,
                  boxSizing: "border-box",
                  cursor: blockPickerDisabled ? "not-allowed" : "pointer",
                  background: blockPickerDisabled ? "#f1f5f9" : "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  listStyle: "none",
                  userSelect: "none",
                }}
                onClick={(e) => blockPickerDisabled && e.preventDefault()}
              >
                <span>
                  {blockIds.length > 0
                    ? `${blockIds.length} block(s) selected`
                    : "-- Select Blocks --"}
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  {isBlockDropdownOpen ? "▲" : "▼"}
                </span>
              </summary>

              {isBlockDropdownOpen && (
                <div style={dropdownStyle}>
                  {blocks.length === 0 ? (
                    <div style={emptyDropdownStyle}>No blocks available.</div>
                  ) : (
                    blocks.map((b) => {
                      const id = String(b.block_id);

                      const isSelected = blockIds.some((x) => String(x) === id);

                      return (
                        <label
                          key={b.block_id}
                          style={{
                            ...blockOptionStyle,
                            background: isSelected ? "#eff6ff" : "#fff",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleBlockCheckboxChange(id)}
                          />
                          {b.block_name_en}
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </details>

            <small style={hintStyle}>
              Click the dropdown and select multiple blocks.
            </small>

            <div style={selectedBlocksStyle}>
              <div style={selectedBlocksHeadingStyle}>
                Selected Blocks ({blockIds.length})
              </div>

              {blockIds.length === 0 ? (
                <span style={hintStyle}>No blocks selected.</span>
              ) : (
                <div style={selectedBlocksListStyle}>
                  {blockIds.map((blockId) => (
                    <span key={blockId} style={selectedBlockStyle}>
                      {blocks.find(
                        (b) => String(b.block_id) === String(blockId),
                      )?.block_name_en || `Block ${blockId}`}

                      <button
                        type="button"
                        onClick={() => removeSelectedBlock(blockId)}
                        title="Remove block"
                        style={removeBlockButtonStyle}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TRAINING PARTNER */}
          <div>
            <label style={styles.label}>
              Training Partner *{isDtp && <Auto />}
            </label>

            <select
              style={lockedSelect(isDtp)}
              value={batchData.partnerId || ""}
              disabled={isDtp}
              onChange={(e) =>
                updateBatchData({
                  partnerId: e.target.value,
                  centreId: "",
                })
              }
            >
              <option value="">-- Select --</option>

              {isDtp &&
                batchData.partnerId &&
                !partners.some(
                  (p) => String(p.id) === String(batchData.partnerId),
                ) && (
                  <option value={batchData.partnerId}>
                    Assigned Partner (ID: {batchData.partnerId})
                  </option>
                )}

              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Field label="Centre *">
            <select
              style={styles.select}
              value={batchData.centreId}
              onChange={(e) => updateBatchData({ centreId: e.target.value })}
            >
              <option value="">-- Select --</option>

              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.venue_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Training Theme *">
            <select
              style={styles.select}
              value={batchData.themeId || ""}
              onChange={(e) =>
                updateBatchData({
                  themeId: e.target.value,
                  trainingPlanId: "",
                  selectedTrIds: [],
                  selectedParticipants: [],
                  startDate: "",
                  endDate: "",
                })
              }
            >
              <option value="">-- Select Theme --</option>

              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.theme_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Training Plan *">
            <select
              style={styles.select}
              value={batchData.trainingPlanId}
              disabled={!batchData.themeId}
              onChange={(e) =>
                updateBatchData({
                  trainingPlanId: e.target.value,
                  selectedTrIds: [],
                  selectedParticipants: [],
                  startDate: "",
                  endDate: "",
                })
              }
            >
              <option value="">
                {batchData.themeId
                  ? "-- Select Training Plan --"
                  : "-- Select Theme First --"}
              </option>

              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.training_name} ({p.no_of_days} Days)
                </option>
              ))}
            </select>
          </Field>

          <Field label="Financial Year">
            <select
              style={styles.select}
              value={batchData.financialYear}
              onChange={(e) =>
                updateBatchData({
                  financialYear: e.target.value,
                  selectedParticipants: [],
                  selectedTrIds: [],
                })
              }
            >
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
          </Field>

          <Field label="Start Date (Past Only) *">
            <input
              type="date"
              style={styles.input}
              max={getYesterday()}
              value={batchData.startDate}
              onChange={handleStartDateChange}
            />
          </Field>

          <Field label="Calculated End Date 🔒">
            <input
              type="date"
              style={{
                ...styles.input,
                background: "#f1f5f9",
                cursor: "not-allowed",
              }}
              value={batchData.endDate}
              disabled
            />
          </Field>
        </div>
      </div>

      {/* ====================================== */}
      {/* TR POOL */}
      {/* ====================================== */}

      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <h4
            style={{
              margin: 0,
              color: "#0f172a",
            }}
          >
            Select Backlog Training Requests
          </h4>

          <span style={hintStyle}>
            Training requests are fetched automatically when you select blocks.
          </span>

          {loadingTrs && (
            <div style={loadingTextStyle}>Fetching training requests...</div>
          )}
        </div>

        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <table style={styles.table}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={centerCell}>Pool</th>
                <th style={cell}>TR ID</th>
                <th style={cell}>District</th>
                <th style={cell}>Block</th>
                <th style={centerCell}>Pax</th>
              </tr>
            </thead>

            <tbody>
              {availableTrs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={emptyTableCellStyle}>
                    {loadingTrs
                      ? "Fetching training requests..."
                      : blockIds.length === 0
                        ? "Select a block to fetch its training requests."
                        : "No training requests found for the selected blocks."}
                  </td>
                </tr>
              ) : (
                availableTrs.map((tr) => {
                  const checked = selectedTrIds.includes(tr.id);

                  return (
                    <tr
                      key={tr.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: checked ? "#eff6ff" : "#fff",
                      }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTrSelection(tr.id)}
                        />
                      </td>

                      <td
                        style={{
                          ...cell,
                          fontWeight: "bold",
                        }}
                      >
                        #{tr.id}
                      </td>

                      <td style={cell}>{tr.district_name || "-"}</td>

                      <td style={cell}>{tr.block_name || "-"}</td>

                      <td style={paxCellStyle}>
                        {Math.max(
                          0,
                          Number(tr.participant_count || 0) -
                            Number(tr.enrolled_count || 0),
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================== */}
      {/* PARTICIPANTS */}
      {/* ====================================== */}

      <div style={panelStyle}>
        <div
          style={{
            ...panelHeaderStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4
              style={{
                margin: 0,
                color: "#0f172a",
              }}
            >
              Select Participants for Batch
            </h4>

            <span style={hintStyle}>
              Select between 20 and 60 participants, subject to the remaining
              target.
            </span>
          </div>

          <div
            style={{
              fontWeight: "700",
              color: isParticipantValid ? "#16a34a" : "#dc2626",
            }}
          >
            Selected: {pCount} / 60
          </div>
        </div>

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {loadingPool && <div style={styles.overlay}>Aggregating...</div>}

          <table style={styles.table}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={centerCell}>
                  <input
                    type="checkbox"
                    checked={
                      aggregatedPool.length > 0 &&
                      aggregatedPool.every((p) =>
                        selectedParticipants.some(
                          (sp) => String(sp.id) === String(p.id),
                        ),
                      )
                    }
                    onChange={selectAllParticipants}
                  />
                </th>

                <th style={cell}>S.No</th>
                <th style={cell}>Source TR</th>
                <th style={cell}>Participant Name</th>
                <th style={cell}>Identifier</th>
              </tr>
            </thead>

            <tbody>
              {aggregatedPool.length === 0 ? (
                <tr>
                  <td colSpan="5" style={emptyTableCellStyle}>
                    Select TRs above to view participants.
                  </td>
                </tr>
              ) : (
                aggregatedPool.map((p, idx) => {
                  const isSelected = selectedParticipants.some(
                    (sp) => String(sp.id) === String(p.id),
                  );

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: isSelected ? "#eff6ff" : "#fff",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleParticipantSelection(p)}
                    >
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" checked={isSelected} readOnly />
                      </td>

                      <td style={cell}>{idx + 1}</td>

                      <td
                        style={{
                          ...cell,
                          fontWeight: "600",
                          color: "#3b82f6",
                        }}
                      >
                        #{p.source_tr_id}
                      </td>

                      <td
                        style={{
                          ...cell,
                          fontWeight: "600",
                        }}
                      >
                        {p.member_name || p.full_name || "-"}
                      </td>

                      <td style={cell}>
                        {p.lokos_member_code ||
                          p.employee_id ||
                          p.aadhaar_no ||
                          "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================== */}
      {/* FOOTER */}
      {/* ====================================== */}

      <div style={footerStyle}>
        <button
          onClick={onNext}
          disabled={!isNextEnabled}
          style={{
            background: isNextEnabled ? "#2563eb" : "#cbd5e1",
            color: "#fff",
            border: "none",
            padding: "12px 32px",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: isNextEnabled ? "pointer" : "not-allowed",
          }}
        >
          Proceed to Duration & E-KYC →
        </button>
      </div>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const cell = {
  padding: "10px",
  textAlign: "left",
};

const centerCell = {
  ...cell,
  textAlign: "center",
};

const sectionStyle = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const sectionHeadingStyle = {
  margin: "0 0 16px 0",
  color: "#1e3a8a",
  fontSize: "16px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const panelStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  overflow: "hidden",
};

const panelHeaderStyle = {
  background: "#f8fafc",
  padding: "16px",
  borderBottom: "1px solid #cbd5e1",
};

const hintStyle = {
  fontSize: "12px",
  color: "#64748b",
};

const loadingTextStyle = {
  marginTop: "8px",
  color: "#2563eb",
  fontSize: "12px",
  fontWeight: "600",
};

const dropdownStyle = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 100,
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  maxHeight: "220px",
  overflowY: "auto",
  boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
};

const emptyDropdownStyle = {
  padding: "12px",
  fontSize: "12px",
  color: "#94a3b8",
};

const blockOptionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "13px",
};

const selectedBlocksStyle = {
  marginTop: "10px",
  minHeight: "48px",
  padding: "10px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  background: "#f8fafc",
};

const selectedBlocksHeadingStyle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#475569",
  marginBottom: "8px",
};

const selectedBlocksListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const selectedBlockStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  borderRadius: "20px",
  background: "#dbeafe",
  color: "#1e40af",
  fontSize: "12px",
  fontWeight: "600",
};

const removeBlockButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#1e40af",
  fontWeight: "700",
  cursor: "pointer",
  padding: 0,
};

const tableHeaderStyle = {
  position: "sticky",
  top: 0,
  background: "#e4ecf5",
  zIndex: 10,
};

const emptyTableCellStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#64748b",
};

const paxCellStyle = {
  ...centerCell,
  color: "#2563eb",
  fontWeight: "600",
};

const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "16px 0",
  borderTop: "1px solid #e2e8f0",
};

const fieldBase = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  background: "#fff",
  outline: "none",
};

const styles = {
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "6px",
  },

  select: fieldBase,

  input: {
    ...fieldBase,
    boxSizing: "border-box",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(255,255,255,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: "#2563eb",
    zIndex: 20,
  },
};
