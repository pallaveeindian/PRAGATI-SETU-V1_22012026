// src\pages\TMS\BacklogBatchCreator\components\Step2_EkycConfig.jsx
import React, { useState, useEffect, useMemo } from "react";
import { TMS_API } from "../../../../api/axios";

export default function Step2_EkycConfig({
  batchData,
  updateBatchData,
  onNext,
  onPrev,
}) {
  // SURGICAL FIX: Safely default arrays to empty [] to prevent .map() crashes
  const {
    selectedParticipants = [],
    masterTrainers = [],
    ekycList = [],
    timeOfTraining = "",
  } = batchData;

  // ==========================================
  // MASTER TRAINER FETCH & FILTER STATE
  // ==========================================
  const [mtList, setMtList] = useState([]);
  const [mtTotal, setMtTotal] = useState(0);
  const [mtPage, setMtPage] = useState(1);
  const [mtPageSize] = useState(5);
  const [mtLoading, setMtLoading] = useState(false);
  const [mtSearch, setMtSearch] = useState("");
  const [mtThemeFilter, setMtThemeFilter] = useState("");
  const [mtDesignationFilter, setMtDesignationFilter] = useState("");
  const [availableThemes, setAvailableThemes] = useState([]);

  // Fetch Themes for dropdown
  useEffect(() => {
    TMS_API.trainingThemes
      .list({ page_size: 100 })
      .then((res) => setAvailableThemes(res?.data?.results || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Master Trainers with Debounce
  useEffect(() => {
    const fetchMTs = async () => {
      setMtLoading(true);
      try {
        const params = { page: mtPage, page_size: mtPageSize };
        if (mtSearch.trim()) params.search = mtSearch.trim();
        if (mtThemeFilter) params.theme = mtThemeFilter;
        if (mtDesignationFilter) params.designation = mtDesignationFilter;

        const response = await TMS_API.masterTrainers.list(params);
        setMtList(response?.data?.results || []);
        setMtTotal(response?.data?.count || 0);
      } catch (err) {
        console.error("Failed to fetch master trainers:", err);
      } finally {
        setMtLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMTs();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [mtPage, mtPageSize, mtSearch, mtThemeFilter, mtDesignationFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setMtPage(1);
  }, [mtSearch, mtThemeFilter, mtDesignationFilter]);

  const mtTotalPages = Math.max(1, Math.ceil(mtTotal / mtPageSize));

  // Handle MT Selection
  const handleToggleMT = (trainer) => {
    const exists = masterTrainers.some((t) => t.id === trainer.id);
    if (exists) {
      updateBatchData({
        masterTrainers: masterTrainers.filter((t) => t.id !== trainer.id),
        // Remove from EKYC list if unselected
        ekycList: ekycList.filter(
          (k) =>
            !(
              k.participant_id === trainer.id &&
              k.participant_role === "trainer"
            ),
        ),
      });
    } else {
      updateBatchData({ masterTrainers: [...masterTrainers, trainer] });
    }
  };

  // ==========================================
  // UNIFIED E-KYC TOGGLE LOGIC
  // ==========================================

  // Combine Trainees and Trainers for the Verification Table
  const combinedEkycPool = useMemo(() => {
    // SURGICAL FIX: Add safety checks before spreading/mapping
    const safeTrainers = Array.isArray(masterTrainers) ? masterTrainers : [];
    const safeParticipants = Array.isArray(selectedParticipants)
      ? selectedParticipants
      : [];

    return [
      ...safeTrainers.map((mt) => ({
        ...mt,
        _role: "trainer",
        _id: mt.id,
        _name: mt.full_name,
        _identifier: mt.mobile_no || mt.aadhaar_no || "-",
      })),
      ...safeParticipants.map((p) => ({
        ...p,
        _role: "trainee",
        _id: p.id,
        _name: p.member_name || p.full_name || "-",
        _identifier:
          p.lokos_member_code || p.employee_id || p.aadhaar_no || "-",
      })),
    ];
  }, [masterTrainers, selectedParticipants]);

  const verifiedCount = ekycList.filter(
    (k) => k.ekyc_status === "VERIFIED",
  ).length;
  const isAllVerified =
    verifiedCount === combinedEkycPool.length && combinedEkycPool.length > 0;

  const handleMasterCheckbox = (e) => {
    if (e.target.checked) {
      const allVerified = combinedEkycPool.map((p) => ({
        participant_id: p._id,
        participant_role: p._role,
        ekyc_status: "VERIFIED",
      }));
      updateBatchData({ ekycList: allVerified });
    } else {
      updateBatchData({ ekycList: [] });
    }
  };

  const handleRowCheckbox = (p, isChecked) => {
    if (isChecked) {
      const newEkyc = {
        participant_id: p._id,
        participant_role: p._role,
        ekyc_status: "VERIFIED",
      };
      updateBatchData({ ekycList: [...ekycList, newEkyc] });
    } else {
      updateBatchData({
        ekycList: ekycList.filter(
          (k) =>
            !(k.participant_id === p._id && k.participant_role === p._role),
        ),
      });
    }
  };

  // ==========================================
  // VALIDATION FOR NEXT BUTTON
  // ==========================================
  const isNextEnabled =
    timeOfTraining && isAllVerified && masterTrainers.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* --- TIME CONFIGURATION --- */}
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
          1. Daily Schedule Setting
        </h3>
        <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "13px" }}>
          Set the standard daily commencement time for this backlog batch.
        </p>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
          <div style={{ width: "250px" }}>
            <label style={styles.label}>
              Time of Training <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="time"
              value={timeOfTraining}
              onChange={(e) =>
                updateBatchData({ timeOfTraining: e.target.value })
              }
              style={styles.input}
            />
          </div>
          <div
            style={{
              paddingBottom: "10px",
              color: timeOfTraining ? "#16a34a" : "#ef4444",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {timeOfTraining ? "✓ Time Set" : "⚠ Time is required"}
          </div>
        </div>
      </div>

      {/* --- MASTER TRAINER ASSIGNMENT --- */}
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
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px" }}>
              2. Assign Master Trainers
            </h4>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Select at least 1 Master Trainer for this batch.
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              style={styles.filterSelect}
              value={mtThemeFilter}
              onChange={(e) => setMtThemeFilter(e.target.value)}
            >
              <option value="">All Themes</option>
              {availableThemes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.theme_name}
                </option>
              ))}
            </select>
            <select
              style={styles.filterSelect}
              value={mtDesignationFilter}
              onChange={(e) => setMtDesignationFilter(e.target.value)}
            >
              <option value="">All Designations</option>
              <option value="BRP">BRP</option>
              <option value="DRP">DRP</option>
              <option value="SRP">SRP</option>
              <option value="TSA">TSA</option>
            </select>
            <input
              type="text"
              placeholder="Search name or mobile..."
              value={mtSearch}
              onChange={(e) => setMtSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto", position: "relative" }}>
          {mtLoading && <div style={styles.overlay}>Fetching Trainers...</div>}
          <table style={styles.table}>
            <thead style={{ background: "#e4ecf5" }}>
              <tr>
                <th
                  style={{ width: "50px", textAlign: "center", ...styles.th }}
                >
                  Select
                </th>
                <th style={styles.th}>Master Trainer Name</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Designation</th>
              </tr>
            </thead>
            <tbody>
              {mtList.length === 0 && !mtLoading ? (
                <tr>
                  <td colSpan="4" style={styles.emptyState}>
                    No Master Trainers found.
                  </td>
                </tr>
              ) : (
                mtList.map((mt) => {
                  const isSelected = masterTrainers.some((t) => t.id === mt.id);
                  return (
                    <tr
                      key={mt.id}
                      style={{
                        background: isSelected ? "#eff6ff" : "#fff",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                      onClick={() => handleToggleMT(mt)}
                    >
                      <td style={{ textAlign: "center", ...styles.td }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMT(mt)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ cursor: "pointer", transform: "scale(1.1)" }}
                        />
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {mt.full_name || "-"}
                      </td>
                      <td style={styles.td}>{mt.mobile_no || "-"}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {mt.designation || "N/A"} - {mt.theme_name || "N/A"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {mtTotalPages > 1 && (
          <div style={styles.paginationFooter}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Showing page {mtPage} of {mtTotalPages}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={styles.pageBtn(mtPage <= 1)}
                disabled={mtPage <= 1}
                onClick={() => setMtPage((p) => p - 1)}
              >
                Prev
              </button>
              <button
                style={styles.pageBtn(mtPage >= mtTotalPages)}
                disabled={mtPage >= mtTotalPages}
                onClick={() => setMtPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- E-KYC VERIFICATION TABLE --- */}
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
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px" }}>
              3. Combined E-KYC Verification
            </h4>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Because this is a backlog batch, physical biometrics are bypassed.
              Verify participants manually.
            </span>
          </div>

          <div
            style={{
              background: isAllVerified ? "#dcfce7" : "#fef2f2",
              color: isAllVerified ? "#166534" : "#991b1b",
              border: `1px solid ${isAllVerified ? "#bbf7d0" : "#fecaca"}`,
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            Verified: {verifiedCount} / {combinedEkycPool.length}
          </div>
        </div>

        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
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
                <th
                  style={{
                    padding: "12px",
                    width: "100px",
                    textAlign: "center",
                    borderRight: "1px solid #cbd5e1",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      cursor: "pointer",
                      margin: 0,
                      color: "#1e3a8a",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isAllVerified}
                      onChange={handleMasterCheckbox}
                      style={{ transform: "scale(1.2)", cursor: "pointer" }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "800",
                      }}
                    >
                      Mark All
                    </span>
                  </label>
                </th>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Identifier</th>
                <th style={styles.th}>Participant Name</th>
              </tr>
            </thead>
            <tbody>
              {combinedEkycPool.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyState}>
                    No participants or trainers selected yet.
                  </td>
                </tr>
              ) : (
                combinedEkycPool.map((p, idx) => {
                  const isVerified = ekycList.some(
                    (k) =>
                      k.participant_id === p._id &&
                      k.participant_role === p._role,
                  );
                  return (
                    <tr
                      key={`${p._role}-${p._id}`}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: isVerified ? "#f0fdf4" : "#fff",
                        transition: "background 0.2s",
                      }}
                    >
                      <td
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #f1f5f9",
                          padding: "12px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isVerified}
                          onChange={(e) =>
                            handleRowCheckbox(p, e.target.checked)
                          }
                          style={{ transform: "scale(1.2)", cursor: "pointer" }}
                        />
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                          color: "#475569",
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            background:
                              p._role === "trainer" ? "#fdf4ff" : "#eff6ff",
                            color:
                              p._role === "trainer" ? "#a21caf" : "#2563eb",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                          }}
                        >
                          {p._role}
                        </span>
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {p._identifier}
                      </td>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {p._name}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: "1px solid #e2e8f0",
          marginTop: "10px",
        }}
      >
        <button
          onClick={onPrev}
          style={{
            background: "#ffffff",
            color: "#475569",
            border: "1px solid #cbd5e1",
            padding: "10px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Back to Participants
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isNextEnabled && (
            <span
              style={{ fontSize: "13px", color: "#ef4444", fontWeight: "600" }}
            >
              ⚠ Missing Requirements:
              {!timeOfTraining && " Set Time."}
              {masterTrainers.length === 0 && " Select MT."}
              {!isAllVerified && " Verify All."}
            </span>
          )}
          <button
            onClick={onNext}
            disabled={!isNextEnabled}
            style={{
              background: isNextEnabled ? "#2563eb" : "#cbd5e1",
              color: "#fff",
              border: "none",
              padding: "10px 32px",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: isNextEnabled ? "pointer" : "not-allowed",
              boxShadow: isNextEnabled
                ? "0 4px 12px rgba(37, 99, 235, 0.2)"
                : "none",
            }}
          >
            Proceed to Attendance Matrix →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontWeight: "600",
    color: "#0f172a",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "700",
    color: "#1e3a8a",
    borderBottom: "2px solid #cbd5e1",
  },
  td: { padding: "12px 16px" },
  filterSelect: {
    padding: "6px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  searchInput: {
    padding: "6px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    width: "180px",
  },
  badge: {
    background: "#f1f5f9",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    border: "1px solid #cbd5e1",
    color: "#475569",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    fontStyle: "italic",
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
  paginationFooter: {
    padding: "12px 20px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
  },
  pageBtn: (disabled) => ({
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "600",
    color: disabled ? "#94a3b8" : "#3b82f6",
    background: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
  }),
};
