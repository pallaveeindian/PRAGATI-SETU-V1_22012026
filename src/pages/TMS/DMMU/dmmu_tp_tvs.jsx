// src/pages/TMS/DMMU/dmmu_tp_tva.jsx

import React, { useContext, useEffect, useMemo, useState } from "react";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
// SURGICAL ADDITION: Import default 'api' for the blob export and patch updates
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";

/* ================= GEO ================= */
function getGeoscope() {
  try {
    return JSON.parse(localStorage.getItem("ps_user_geoscope"));
  } catch {
    return null;
  }
}

export default function DmmuTargetAchievement() {
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetsData, setTargetsData] = useState([]);

  const [financialYear, setFinancialYear] = useState("2023-24");
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const [districts, setDistricts] = useState([]);
  const [plans, setPlans] = useState([]);

  const [filters, setFilters] = useState({
    district_id: "",
  });

  // SURGICAL ADDITION: Match pagination state with backend
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 25;

  // ================= SURGICAL ADDITION: INLINE EDIT STATE =================
  const [editingAch, setEditingAch] = useState({ id: null, val: 0 });
  const [isUpdating, setIsUpdating] = useState(false);
  // ========================================================================

  /* ================= AUTO DISTRICT ================= */
  useEffect(() => {
    const geo = getGeoscope() || {};

    let districtId =
      geo.district_id || (Array.isArray(geo.districts) ? geo.districts[0] : "");

    if (user?.district_id) {
      districtId = user.district_id;
    }

    if (!districtId) return;

    setFilters((f) => ({
      ...f,
      district_id: String(districtId),
    }));
  }, [user]);

  /* ================= FETCH ================= */
  // SURGICAL ADDITION: Accept page parameter
  async function fetchTargetsWithAchievements(page = 1) {
    if (!filters.district_id) return;

    setLoading(true);

    try {
      const resp = await TMS_API.trainingPartnerTargets.list({
        ach: 1,
        year: financialYear,
        district: filters.district_id,
        training_plan: selectedPlan || undefined,
        page: page, // SURGICAL ADDITION: Send page param instead of limit
      });

      // SURGICAL ADDITION: Capture backend count for pagination math
      const items = resp?.data?.results || resp?.data || [];
      const count = resp?.data?.count || items.length;

      setTargetsData(items);
      setTotalItems(count);
    } catch (error) {
      console.error("Failed:", error);
      setTargetsData([]);
    } finally {
      setLoading(false);
    }
  }

  // SURGICAL ADDITION: Re-fetch whenever currentPage changes
  useEffect(() => {
    if (filters.district_id) {
      fetchTargetsWithAchievements(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  /* ================= INIT ================= */
  useEffect(() => {
    LOOKUP_API.districts
      .list({ page_size: 500 })
      .then((res) => setDistricts(res?.data?.results || []))
      .catch(() => setDistricts([]));

    TMS_API.trainingPlans
      .list({ limit: 500 })
      .then((res) => setPlans(res?.data?.results || res?.data || []))
      .catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    if (filters.district_id) {
      fetchTargetsWithAchievements(1); // Fetch page 1 when district mounts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.district_id]);

  /* ================= PROCESS ================= */
  const processedData = useMemo(() => {
    return targetsData.map((row) => {
      const achieved =
        row.achievements?.reduce(
          (sum, a) => sum + (a.batches_completed || 0),
          0,
        ) || 0;

      const target = row.target_count || 0;

      return {
        ...row,
        partnerName: row.partner?.name || "-",
        planName: row.training_plan?.training_name || "-",
        districtName: row.district?.district_name_en || "-",
        achievedCount: achieved,
        targetCount: target,
        progressPct: target ? Math.round((achieved / target) * 100) : 0,
      };
    });
  }, [targetsData]);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    const q = searchPartner.toLowerCase();

    return processedData.filter((r) => {
      if (q && !r.partnerName.toLowerCase().includes(q)) return false;

      if (
        r.district_id &&
        String(r.district_id) !== String(filters.district_id)
      )
        return false;

      return true;
    });
  }, [processedData, searchPartner, filters.district_id]);

  /* ================= PAGINATION ================= */
  // SURGICAL ADDITION: Calculate total pages from backend API count
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // SURGICAL ADDITION: Data is already paginated by backend
  const paginatedData = filteredData;

  /* ================= UPDATE ACHIEVEMENT (SURGICAL ADDITION) ================= */
  async function handleUpdateAchievement(targetId) {
    if (editingAch.val < 0) {
      alert("Achievement count cannot be negative.");
      return;
    }

    setIsUpdating(true);
    try {
      // NOTE: Ensure this payload key matches your backend schema for updating achievements
      const endpoint = `/tms/training-partner-targets/${targetId}/`;

      await api.patch(endpoint, {
        // Adjust this payload based on how your backend expects to receive achievement updates
        achieved_count: editingAch.val,
      });

      alert("Achievement updated successfully!");
      setEditingAch({ id: null, val: 0 }); // Close edit mode
      fetchTargetsWithAchievements(currentPage); // Refresh table data
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update achievement.");
    } finally {
      setIsUpdating(false);
    }
  }

  /* ================= EXPORT ================= */
  // SURGICAL ADDITION: Server-Side Excel Export
  async function exportToExcel() {
    try {
      const endpoint = "/tms/training-partner-targets/";

      const response = await api.get(endpoint, {
        params: {
          ach: 1,
          year: financialYear,
          district: filters.district_id,
          training_plan: selectedPlan || undefined,
          export: "excel", // Triggers backend list() override
        },
        responseType: "blob", // CRITICAL for binary files
      });

      // Apply the exact MIME type fix here as well
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `DMM_Targets_Export_${financialYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to download Excel file.");
    }
  }

  /* ================= UI ================= */
  return (
    <div className="app-shell">
      <Header />

      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />

        <div className="main-area">
          <main className="main-content">
            <div className="container">
              {/* FILTER CARD */}
              <div className="card-ui">
                <form
                  className="filter-form"
                  // SURGICAL ADDITION: Form submit resets page to 1
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentPage === 1) {
                      fetchTargetsWithAchievements(1);
                    } else {
                      setCurrentPage(1);
                    }
                  }}
                >
                  <div>
                    <label>Financial Year</label>
                    <select
                      value={financialYear}
                      onChange={(e) => {
                        setFinancialYear(e.target.value);
                        // SURGICAL ADDITION: Blank the table when Year changes
                        setTargetsData([]);
                        setTotalItems(0);
                      }}
                    >
                      <option>2023-24</option>
                      <option>2024-25</option>
                      <option>2025-26</option>
                      <option>2026-27</option>
                    </select>
                  </div>

                  <div>
                    <label>District</label>
                    <select value={filters.district_id} disabled>
                      {districts.map((d) => (
                        <option key={d.district_id} value={d.district_id}>
                          {d.district_name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Plan</label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => {
                        setSelectedPlan(e.target.value);
                        // SURGICAL ADDITION: Blank the table when Plan changes
                        setTargetsData([]);
                        setTotalItems(0);
                      }}
                    >
                      <option value="">All</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.training_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Search Partner</label>
                    <input
                      value={searchPartner}
                      onChange={(e) => {
                        setSearchPartner(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="actions">
                    <button
                      type="submit"
                      className="btnPrimary"
                      disabled={loading}
                    >
                      {loading ? "Fetching..." : "Fetch Data"}
                    </button>

                    <button
                      type="button"
                      className="btnView"
                      onClick={exportToExcel} // SURGICAL ADDITION
                    >
                      Export Excel
                    </button>
                  </div>
                </form>
              </div>

              {/* TABLE */}
              <table className="training-table">
                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Plan</th>
                    <th>District</th>
                    <th>Target</th>
                    <th>Achieved</th>
                    <th>Progress</th>
                    {/* SURGICAL ADDITION: Show Update column ONLY for 2025-26 */}
                    {financialYear === "2025-26" && <th>Update Achieved</th>}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={financialYear === "2025-26" ? 7 : 6}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Loading data...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={financialYear === "2025-26" ? 7 : 6}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No targets found. Please click "Fetch Data" to load.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((r) => (
                      <tr key={r.id}>
                        <td>{r.partnerName}</td>
                        <td>{r.planName}</td>
                        <td>{r.districtName}</td>
                        <td>{r.targetCount}</td>
                        <td>{r.achievedCount}</td>
                        <td>{r.progressPct}%</td>

                        {/* SURGICAL ADDITION: Interactive Edit Counter ONLY for 2025-26 */}
                        {financialYear === "2025-26" && (
                          <td>
                            {editingAch.id === r.id ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="number"
                                  min="0"
                                  value={editingAch.val}
                                  onChange={(e) =>
                                    setEditingAch({
                                      ...editingAch,
                                      val: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  disabled={isUpdating}
                                  style={{
                                    width: "60px",
                                    padding: "4px",
                                    borderRadius: "4px",
                                    border: "1px solid #a7c6ed",
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdateAchievement(r.id)}
                                  disabled={isUpdating}
                                  style={{
                                    background: "#10b981",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    cursor: isUpdating
                                      ? "not-allowed"
                                      : "pointer",
                                  }}
                                  title="Submit"
                                >
                                  {isUpdating ? "..." : "✔️"}
                                </button>
                                <button
                                  onClick={() =>
                                    setEditingAch({ id: null, val: 0 })
                                  }
                                  disabled={isUpdating}
                                  style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    cursor: isUpdating
                                      ? "not-allowed"
                                      : "pointer",
                                  }}
                                  title="Cancel"
                                >
                                  ✖️
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btnPrimary"
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  background: "#3b82f6",
                                }}
                                onClick={() =>
                                  setEditingAch({
                                    id: r.id,
                                    val: r.achievedCount,
                                  })
                                }
                              >
                                Add Achievement
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              {!loading && filteredData.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  Page {currentPage} / {totalPages}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    style={{ marginLeft: 10, marginRight: 5 }}
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <style>{`
            .content-area {
  display: flex;
  flex: 1;
}

.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-content {
  flex: 1;
}

/* CONTAINER */
.container {
  max-width: 1200px;
  margin: 20px auto;
}

      .card-ui{
        background:#fff;
        padding:16px;
        border-radius:10px;
        border:2px solid #a7c6ed;
        margin-bottom:16px;
      }

      .filter-form{
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        align-items:flex-end;
      }

      .filter-form select,
      .filter-form input{
        padding:8px;
        border-radius:6px;
        border:1px solid #a7c6ed;
        min-width:160px;
      }

      .actions{
        margin-left:auto;
        display:flex;
        gap:8px;
      }

      .btnPrimary{
        background:#3d6ba6;
        color:#fff;
        border:none;
        padding:8px 16px;
        border-radius:6px;
        cursor:pointer;
      }

      .btnView{
        background:#10b981;
        color:#fff;
        border:none;
        padding:8px 16px;
        border-radius:6px;
        cursor:pointer;
      }

      .training-table{
        width:100%;
        border-collapse:collapse;
      }

      .training-table th{
        background:#3d6ba6;
        color:#fff;
        padding:10px;
        text-align:left;
      }

      .training-table td{
        padding:10px;
        border-bottom:1px solid #e4ecf5;
      }
      `}</style>
    </div>
  );
}
