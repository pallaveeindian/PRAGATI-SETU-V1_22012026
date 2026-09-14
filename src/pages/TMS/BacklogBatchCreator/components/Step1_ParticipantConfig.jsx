// src\pages\TMS\BacklogBatchCreator\components\Step1_ParticipantConfig.jsx
import React, { useState, useEffect, useMemo } from "react";
import api, { LOOKUP_API, TMS_API } from "../../../../api/axios";

export default function Step1_ParticipantConfig({
  batchData,
  updateBatchData,
  aggregatedPool,
  loadingPool,
  onNext,
}) {
  // --- Lookups ---
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [partners, setPartners] = useState([]);
  const [centres, setCentres] = useState([]);
  const [plans, setPlans] = useState([]);

  // --- TR Search State ---
  const [availableTrs, setAvailableTrs] = useState([]);
  const [loadingTrs, setLoadingTrs] = useState(false);

  // ==========================================
  // INITIAL LOOKUP FETCHES
  // ==========================================
  useEffect(() => {
    LOOKUP_API.districts
      .list({ page_size: 100 })
      .then((res) => setDistricts(res?.data?.results || []));
    TMS_API.trainingPartners
      .list({ page_size: 100 })
      .then((res) => setPartners(res?.data?.results || []));
    TMS_API.trainingPlans
      .list({ page_size: 500 })
      .then((res) => setPlans(res?.data?.results || []));
  }, []);

  // Fetch Blocks based on District
  useEffect(() => {
    if (batchData.districtId) {
      LOOKUP_API.blocks
        .list({ district_id: batchData.districtId, page_size: 100 })
        .then((res) => setBlocks(res?.data?.results || []));
    } else {
      setBlocks([]);
    }
  }, [batchData.districtId]);

  // Fetch Centres based on District & Partner
  useEffect(() => {
    if (batchData.districtId && batchData.partnerId) {
      TMS_API.trainingPartnerCentres
        .list({
          district: batchData.districtId,
          partner: batchData.partnerId,
          page_size: 100,
        })
        .then((res) => setCentres(res?.data?.results || []));
    } else {
      setCentres([]);
    }
  }, [batchData.districtId, batchData.partnerId]);

  // ==========================================
  // CONSTRAINT HANDLERS (Rules 6, 7, 8, 9)
  // ==========================================
  const handleLevelOrTypeChange = (key, value) => {
    const updates = { [key]: value };

    // Evaluate constraints based on future state
    const futureBatchType = key === "batchType" ? value : batchData.batchType;
    const futureLevel = key === "level" ? value : batchData.level;

    // Rule: If DISTRICT level -> NO blocks allowed
    if (futureLevel === "DISTRICT" || futureLevel === "STATE") {
      updates.blockIds = [];
    }

    // Clear selections if structural context changes
    updates.selectedTrIds = [];
    updates.selectedParticipants = [];

    updateBatchData(updates);
  };

  const handleBlockSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    if (batchData.batchType === "SEPARATE" && selectedOptions.length > 1) {
      alert("SEPARATE batches can only have EXACTLY 1 block.");
      return;
    }

    updateBatchData({
      blockIds: selectedOptions,
      selectedTrIds: [],
      selectedParticipants: [],
    });
  };

  // ==========================================
  // DATE HANDLERS (Rule 2: Past Dates Only)
  // ==========================================
  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const handleStartDateChange = (e) => {
    const sDate = e.target.value;
    let eDate = "";

    if (sDate && batchData.trainingPlanId) {
      const plan = plans.find(
        (p) => String(p.id) === String(batchData.trainingPlanId),
      );
      if (plan && plan.no_of_days) {
        const start = new Date(sDate);
        start.setDate(start.getDate() + Number(plan.no_of_days) - 1);
        eDate = start.toISOString().split("T")[0];
      }
    }
    updateBatchData({ startDate: sDate, endDate: eDate });
  };

  // ==========================================
  // TR SEARCH (Rule 3: is_old = True)
  // ==========================================
  const fetchTrainingRequests = async () => {
    if (
      !batchData.financialYear ||
      !batchData.trainingPlanId ||
      !batchData.participantType
    ) {
      alert(
        "Select Financial Year, Training Plan, and Participant Type to fetch requests.",
      );
      return;
    }

    setLoadingTrs(true);
    try {
      const params = {
        is_old: true, // STRICT RULE 3
        status: "BATCHING",
        financial_year: batchData.financialYear,
        training_plan_id: batchData.trainingPlanId,
        training_type: batchData.participantType.toUpperCase(),
        district_id: batchData.districtId || undefined,
        page_size: 100,
      };

      const resp = await TMS_API.trainingRequestsList.list(params);
      let results = resp?.data?.results || [];

      // Filter locally for blocks if necessary since list API might not strictly support multi-block arrays
      if (batchData.level === "BLOCK" && batchData.blockIds.length > 0) {
        results = results.filter((tr) =>
          batchData.blockIds.includes(String(tr.block_id || tr.block)),
        );
      }

      setAvailableTrs(results);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch training requests.");
    } finally {
      setLoadingTrs(false);
    }
  };

  const toggleTrSelection = (trId) => {
    const current = batchData.selectedTrIds;
    if (current.includes(trId)) {
      updateBatchData({ selectedTrIds: current.filter((id) => id !== trId) });
    } else {
      updateBatchData({ selectedTrIds: [...current, trId] });
    }
  };

  const toggleParticipantSelection = (pObj) => {
    const current = batchData.selectedParticipants;
    const exists = current.some((p) => p.id === pObj.id);

    if (exists) {
      updateBatchData({
        selectedParticipants: current.filter((p) => p.id !== pObj.id),
      });
    } else {
      if (current.length >= 50) {
        alert("Maximum 50 participants allowed per batch.");
        return;
      }
      updateBatchData({ selectedParticipants: [...current, pObj] });
    }
  };

  const selectAllParticipants = (e) => {
    if (e.target.checked) {
      const availableSpace = 50 - batchData.selectedParticipants.length;
      if (availableSpace <= 0) return;

      const toAdd = aggregatedPool
        .filter(
          (ap) => !batchData.selectedParticipants.some((sp) => sp.id === ap.id),
        )
        .slice(0, availableSpace);

      updateBatchData({
        selectedParticipants: [...batchData.selectedParticipants, ...toAdd],
      });
    } else {
      updateBatchData({ selectedParticipants: [] });
    }
  };

  // ==========================================
  // STRICT VALIDATION FOR NEXT BUTTON
  // ==========================================
  const isBlockValid = useMemo(() => {
    if (batchData.level !== "BLOCK") return true;
    if (batchData.batchType === "SEPARATE")
      return batchData.blockIds.length === 1;
    if (batchData.batchType === "COMBINED")
      return batchData.blockIds.length >= 2;
    return false;
  }, [batchData.level, batchData.batchType, batchData.blockIds]);

  const pCount = batchData.selectedParticipants.length;
  const isParticipantValid = pCount >= 20 && pCount <= 50;

  const isNextEnabled =
    batchData.participantType &&
    batchData.batchType &&
    batchData.level &&
    batchData.districtId &&
    batchData.partnerId &&
    batchData.centreId &&
    batchData.trainingPlanId &&
    batchData.startDate &&
    isBlockValid &&
    isParticipantValid;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* --- CONFIGURATION SECTION --- */}
      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{ margin: "0 0 16px 0", color: "#1e3a8a", fontSize: "16px" }}
        >
          1. Structural Configuration
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <label style={styles.label}>Participant Type *</label>
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
          </div>

          <div>
            <label style={styles.label}>Batch Type *</label>
            <select
              style={styles.select}
              value={batchData.batchType}
              onChange={(e) =>
                handleLevelOrTypeChange("batchType", e.target.value)
              }
            >
              <option value="SEPARATE">Separate</option>
              <option value="COMBINED">Combined</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Batch Level *</label>
            <select
              style={styles.select}
              value={batchData.level}
              onChange={(e) => handleLevelOrTypeChange("level", e.target.value)}
            >
              <option value="BLOCK">Block</option>
              <option value="DISTRICT">District</option>
              <option value="STATE">State</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>District *</label>
            <select
              style={styles.select}
              value={batchData.districtId}
              onChange={(e) =>
                updateBatchData({
                  districtId: e.target.value,
                  blockIds: [],
                  centreId: "",
                })
              }
            >
              <option value="">-- Select --</option>
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.district_name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>
              Block(s) {batchData.level !== "BLOCK" ? "(Disabled)" : "*"}
            </label>
            <select
              multiple
              style={{ ...styles.select, height: "80px" }}
              value={batchData.blockIds}
              onChange={handleBlockSelection}
              disabled={batchData.level !== "BLOCK"}
            >
              {blocks.map((b) => (
                <option key={b.block_id} value={b.block_id}>
                  {b.block_name_en}
                </option>
              ))}
            </select>
            {batchData.level === "BLOCK" &&
              batchData.batchType === "COMBINED" && (
                <small style={{ color: "#b45309", fontSize: "11px" }}>
                  Hold Ctrl/Cmd to select min 2 blocks.
                </small>
              )}
          </div>

          <div>
            <label style={styles.label}>Training Partner *</label>
            <select
              style={styles.select}
              value={batchData.partnerId}
              onChange={(e) =>
                updateBatchData({ partnerId: e.target.value, centreId: "" })
              }
            >
              <option value="">-- Select --</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>Centre *</label>
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
          </div>

          <div>
            <label style={styles.label}>Training Plan *</label>
            <select
              style={styles.select}
              value={batchData.trainingPlanId}
              onChange={(e) => {
                updateBatchData({
                  trainingPlanId: e.target.value,
                  selectedTrIds: [],
                  selectedParticipants: [],
                  startDate: "",
                  endDate: "",
                });
              }}
            >
              <option value="">-- Select --</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.training_name} ({p.no_of_days} Days)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>Financial Year</label>
            <select
              style={styles.select}
              value={batchData.financialYear}
              onChange={(e) =>
                updateBatchData({ financialYear: e.target.value })
              }
            >
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Start Date (Past Only) *</label>
            <input
              type="date"
              style={styles.input}
              max={getYesterday()}
              value={batchData.startDate}
              onChange={handleStartDateChange}
            />
          </div>

          <div>
            <label style={styles.label}>Calculated End Date 🔒</label>
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
          </div>
        </div>
      </div>

      {/* --- TR POOL SEARCH --- */}
      <div
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            padding: "16px",
            borderBottom: "1px solid #cbd5e1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "#0f172a" }}>
              Select Backlog Training Requests
            </h4>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Must be marked as Backlog by BMMU/DMMU. Fetch to see matching requests.
            </span>
          </div>
          <button
            onClick={fetchTrainingRequests}
            disabled={loadingTrs}
            style={styles.btnPrimary}
          >
            {loadingTrs ? "Fetching..." : "Fetch TRs"}
          </button>
        </div>

        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <table style={styles.table}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#e4ecf5",
                zIndex: 10,
              }}
            >
              <tr>
                <th style={{ padding: "10px", textAlign: "center" }}>Pool</th>
                <th style={{ padding: "10px", textAlign: "left" }}>TR ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>District</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Block</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Pax</th>
              </tr>
            </thead>
            <tbody>
              {availableTrs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    No requests fetched yet.
                  </td>
                </tr>
              ) : (
                availableTrs.map((tr) => (
                  <tr
                    key={tr.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: batchData.selectedTrIds.includes(tr.id)
                        ? "#eff6ff"
                        : "#fff",
                    }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={batchData.selectedTrIds.includes(tr.id)}
                        onChange={() => toggleTrSelection(tr.id)}
                      />
                    </td>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>
                      #{tr.id}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {tr.district_name || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>{tr.block_name || "-"}</td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        color: "#2563eb",
                        fontWeight: "600",
                      }}
                    >
                      {tr.participant_count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PARTICIPANT AGGREGATION TABLE --- */}
      <div
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            padding: "16px",
            borderBottom: "1px solid #cbd5e1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "#0f172a" }}>
              Select Participants for Batch
            </h4>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Select between 20 and 50 participants.
            </span>
          </div>
          <div
            style={{
              fontWeight: "700",
              color: isParticipantValid ? "#16a34a" : "#dc2626",
            }}
          >
            Selected: {pCount} / 50
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
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#e4ecf5",
                zIndex: 10,
              }}
            >
              <tr>
                <th style={{ padding: "10px", textAlign: "center" }}>
                  <input type="checkbox" onChange={selectAllParticipants} />
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>S.No</th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Source TR
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Participant Name
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Identifier
                </th>
              </tr>
            </thead>
            <tbody>
              {aggregatedPool.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#64748b",
                    }}
                  >
                    Select TRs above to view participants.
                  </td>
                </tr>
              ) : (
                aggregatedPool.map((p, idx) => {
                  const isSelected = batchData.selectedParticipants.some(
                    (sp) => sp.id === p.id,
                  );
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: isSelected ? "#eff6ff" : "#fff",
                      }}
                      onClick={() => toggleParticipantSelection(p)}
                    >
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" checked={isSelected} readOnly />
                      </td>
                      <td style={{ padding: "10px" }}>{idx + 1}</td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "600",
                          color: "#3b82f6",
                        }}
                      >
                        #{p.source_tr_id}
                      </td>
                      <td style={{ padding: "10px", fontWeight: "600" }}>
                        {p.member_name || p.full_name || "-"}
                      </td>
                      <td style={{ padding: "10px" }}>
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

      {/* --- FOOTER ACTION --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 0",
          borderTop: "1px solid #e2e8f0",
        }}
      >
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

const styles = {
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "6px",
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  btnPrimary: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
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
