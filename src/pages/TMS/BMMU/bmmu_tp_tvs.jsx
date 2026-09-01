// src/pages/TMS/BMMU/bmmu_tp_tva.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";

export default function BmmuTargetAchievement() {
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetsData, setTargetsData] = useState([]);

  const [financialYear, setFinancialYear] = useState("2026-27");
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // NEW: Type of Training filter
  const [selectedTrainingType, setSelectedTrainingType] = useState("");

  const [geoscope, setGeoscope] = useState(null);
  const [isGeoReady, setIsGeoReady] = useState(false);

  const [plans, setPlans] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 25;

  /* ================= FETCH USER GEO FROM API ================= */
  useEffect(() => {
    async function loadGeoscope() {
      const userId = user?.id || user?.user_id;

      if (userId) {
        try {
          const resp = await LOOKUP_API.userGeoscopeByUserId(userId);

          const geoData = resp?.data?.results?.[0] || resp?.data || {};

          setGeoscope(geoData);
        } catch (error) {
          console.error("Failed to fetch Geoscope from API:", error);
        }
      }

      setIsGeoReady(true);
    }

    loadGeoscope();
  }, [user]);

  // Derive district and block from the new state
  const userDistrict = geoscope?.districts?.[0] || user?.district_id || "";

  const userBlock = geoscope?.blocks?.[0] || "";

  /* ================= FETCH DATA ================= */
  async function fetchTargetsWithAchievements(page = 1) {
    setLoading(true);

    try {
      const resp = await TMS_API.trainingPartnerTargets.list({
        ach: 1,
        year: financialYear,

        // 🔒 FORCE FILTER FOR BMM
        district: userDistrict,

        training_plan: selectedPlan || undefined,

        // NEW: Type of Training filter
        training_plan__type_of_training: selectedTrainingType || undefined,

        page: page,
      });

      const items = resp?.data?.results || resp?.data || [];

      const count = resp?.data?.count || items.length;

      setTargetsData(items);
      setTotalItems(count);
    } catch (error) {
      console.error("Failed:", error);

      setTargetsData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }

  /* ================= PAGE CHANGE ================= */
  useEffect(() => {
    fetchTargetsWithAchievements(currentPage);
  }, [currentPage]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    TMS_API.trainingPlans
      .list({ limit: 500 })
      .then((res) => {
        setPlans(res?.data?.results || res?.data || []);
      })
      .catch(() => setPlans([]));
  }, []);

  /* ================= WAIT FOR GEO ================= */
  useEffect(() => {
    if (isGeoReady) {
      fetchTargetsWithAchievements(1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGeoReady]);

  /* ================= PROCESS DATA ================= */
  const processedData = useMemo(() => {
    return targetsData.map((row) => {
      const partnerName = row.partner?.name || "Unknown Partner";
      const planName = row.training_plan?.training_name || "—";
      const districtName = row.district?.district_name_en || "—";
      const themeName = row.theme || "—";
      const fYear = row.financial_year || "—";

      // These are directly provided by the updated backend serializer
      const targetCount = row.target_count || 0;
      const achievedCount = row.achievement_count || 0;
      const batchesCompleted = row.batches_completed || 0;

      const progressPct =
        targetCount > 0
          ? Math.round((batchesCompleted / targetCount) * 100)
          : 0;

      return {
        ...row,
        partnerName,
        planName,
        districtName,
        themeName,
        fYear,
        targetCount,
        achievedCount,
        batchesCompleted,
        progressPct,
      };
    });
  }, [targetsData]);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    const q = searchPartner.toLowerCase().trim();

    return processedData.filter((r) => {
      if (q && !r.partnerName.toLowerCase().includes(q)) {
        return false;
      }

      // 🔒 EXTRA SAFETY FILTER
      if (r.district_id && r.district_id !== userDistrict) {
        return false;
      }

      if (r.block_id && r.block_id !== userBlock) {
        return false;
      }

      return true;
    });
  }, [processedData, searchPartner, userDistrict, userBlock]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  const paginatedData = filteredData;

  /* ================= RESET FILTERS ================= */
  function resetFilters() {
    setFinancialYear("2026-27");
    setSelectedPlan("");
    setSelectedTrainingType("");
    setSearchPartner("");

    if (currentPage === 1) {
      setTimeout(() => {
        fetchTargetsWithAchievements(1);
      }, 0);
    } else {
      setCurrentPage(1);
    }
  }

  /* ================= EXPORT ================= */
  async function exportToExcel() {
    try {
      const endpoint = "/tms/training-partner-targets/";

      const response = await api.get(endpoint, {
        params: {
          ach: 1,
          year: financialYear,

          district: userDistrict,
          block: userBlock,

          training_plan: selectedPlan || undefined,

          // NEW: Type of Training filter
          training_plan__type_of_training: selectedTrainingType || undefined,

          export: "excel",
        },

        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", `BMM_Targets_Export_${financialYear}.xlsx`);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
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
          <main style={{ padding: 18 }}>
            <div
              style={{
                maxWidth: "100%",
                margin: "20px 20px",
              }}
            >
              {/* =====================================================
                  FILTER SECTION
              ===================================================== */}
              <div className="filter-card">
                <div className="filter-card-header">
                  <div>
                    <div className="filter-title">
                      <span className="filter-title-icon">⚙</span>

                      <span>Target & Achievement Filters</span>
                    </div>

                    <div className="filter-subtitle">
                      Filter training targets by year, plan, training type and
                      partner
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (currentPage === 1) {
                      fetchTargetsWithAchievements(1);
                    } else {
                      setCurrentPage(1);
                    }
                  }}
                >
                  <div className="filter-grid">
                    {/* FINANCIAL YEAR */}
                    <div className="filter-field">
                      <label>Financial Year</label>

                      <select
                        value={financialYear}
                        onChange={(e) => {
                          setFinancialYear(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="2026-27">2026-27</option>
                      </select>
                    </div>

                    {/* TRAINING PLAN */}
                    <div className="filter-field">
                      <label>Training Plan</label>

                      <select
                        value={selectedPlan}
                        onChange={(e) => {
                          setSelectedPlan(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Training Plans</option>

                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.training_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* NEW: TYPE OF TRAINING */}
                    <div className="filter-field">
                      <label>Type of Training</label>

                      <select
                        value={selectedTrainingType}
                        onChange={(e) => {
                          setSelectedTrainingType(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Training Types</option>

                        <option value="RES">Residential</option>

                        <option value="NON RES">Non-residential</option>

                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* PARTNER SEARCH */}
                    <div className="filter-field">
                      <label>Training Partner</label>

                      <div className="search-wrapper">
                        <span className="search-icon">🔍</span>

                        <input
                          placeholder="Search partner..."
                          value={searchPartner}
                          onChange={(e) => {
                            setSearchPartner(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FILTER ACTIONS */}
                  <div className="filter-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      <span>{loading ? "Loading..." : "Apply Filters"}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-reset"
                      onClick={resetFilters}
                      disabled={loading}
                    >
                      ↻ Reset
                    </button>

                    <button
                      type="button"
                      className="btn-export"
                      onClick={exportToExcel}
                      disabled={loading}
                    >
                      ↓ Export Excel
                    </button>
                  </div>
                </form>
              </div>

              {/* =====================================================
                  TABLE
              ===================================================== */}
              <div className="table-container">
                <table className="ach-training-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Training Partner</th>
                      <th>Training Plan</th>
                      <th>District</th>
                      <th>Theme</th>
                      <th>Financial Year</th>
                      <th>Target</th>
                      <th>Achievement Count</th>
                      <th>Batches Closed</th>
                      <th>Progress</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: "30px",
                          }}
                        >
                          <div className="loading-state">
                            <div className="spinner"></div>
                            <span>Loading data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : paginatedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: "35px",
                          }}
                        >
                          <div className="empty-state">
                            <div className="empty-icon">📋</div>

                            <div>No targets found.</div>

                            <small>Try changing your filters.</small>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((r, index) => (
                        <tr key={r.id}>
                          <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>

                          <td>
                            <span className="partner-name">
                              {r.partnerName}
                            </span>
                          </td>

                          <td>{r.planName}</td>

                          <td>{r.districtName}</td>

                          <td>{r.themeName}</td>

                          <td>{r.fYear}</td>

                          <td>{r.targetCount}</td>

                          <td>{r.achievedCount}</td>

                          <td>{r.batchesCompleted}</td>

                          <td>
                            <span
                              className={`progress-badge ${
                                r.progressPct >= 80
                                  ? "progress-good"
                                  : r.progressPct > 0
                                    ? "progress-mid"
                                    : "progress-zero"
                              }`}
                            >
                              {r.progressPct}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* =====================================================
                  PAGINATION
              ===================================================== */}
              {!loading && filteredData.length > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </div>

                  <div className="pagination-buttons">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      ← Prev
                    </button>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style>
        {`
          /* =========================================================
             LAYOUT
          ========================================================= */

          .content-area {
            display: flex;
            flex: 1;
          }

          .main-area {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
          }

          .main-area main {
            flex: 1;
          }

          footer {
            margin-top: auto;
          }


          /* =========================================================
             FILTER CARD
          ========================================================= */

          .filter-card {
            background: #ffffff;
            border: 1px solid #dbe7f5;
            border-radius: 14px;
            padding: 20px;
            margin-bottom: 18px;
            box-shadow:
              0 4px 14px rgba(30, 64, 100, 0.07),
              0 1px 3px rgba(30, 64, 100, 0.04);
          }

          .filter-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 17px;
            margin-bottom: 18px;
            border-bottom: 1px solid #edf2f7;
          }

          .filter-title {
            display: flex;
            align-items: center;
            gap: 9px;
            color: #173f6f;
            font-size: 17px;
            font-weight: 700;
          }

          .filter-title-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #eaf2fc;
            color: #3d6ba6;
            font-size: 15px;
          }

          .filter-subtitle {
            margin-top: 5px;
            margin-left: 41px;
            color: #718096;
            font-size: 12px;
          }


          /* =========================================================
             FILTER GRID
          ========================================================= */

          .filter-grid {
            display: grid;
            grid-template-columns:
              minmax(150px, 0.8fr)
              minmax(210px, 1.25fr)
              minmax(190px, 1fr)
              minmax(210px, 1fr);
            gap: 15px;
            align-items: end;
          }

          .filter-field {
            display: flex;
            flex-direction: column;
            gap: 7px;
            min-width: 0;
          }

          .filter-field label {
            color: #334e68;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.2px;
          }

          .filter-field select,
          .filter-field input {
            width: 100%;
            box-sizing: border-box;
            height: 42px;
            padding: 0 12px;
            border-radius: 8px;
            border: 1px solid #cbd9e8;
            background: #fbfdff;
            color: #243b53;
            font-size: 13px;
            outline: none;
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease,
              background 0.2s ease;
          }

          .filter-field select {
            cursor: pointer;
          }

          .filter-field select:hover,
          .filter-field input:hover {
            border-color: #91afd0;
            background: #ffffff;
          }

          .filter-field select:focus,
          .filter-field input:focus {
            border-color: #3d6ba6;
            background: #ffffff;
            box-shadow:
              0 0 0 3px rgba(
                61,
                107,
                166,
                0.12
              );
          }


          /* =========================================================
             SEARCH
          ========================================================= */

          .search-wrapper {
            position: relative;
            width: 100%;
          }

          .search-wrapper input {
            padding-left: 38px;
          }

          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 13px;
            color: #718096;
            pointer-events: none;
            z-index: 1;
          }


          /* =========================================================
             FILTER ACTIONS
          ========================================================= */

          .filter-actions {
            display: flex;
            align-items: center;
            gap: 9px;
            margin-top: 18px;
            padding-top: 16px;
            border-top: 1px solid #edf2f7;
          }

          .filter-actions button {
            height: 39px;
            padding: 0 16px;
            border-radius: 8px;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition:
              transform 0.18s ease,
              box-shadow 0.18s ease,
              background 0.18s ease;
          }

          .filter-actions button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .filter-actions button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
            transform: none;
          }

          .btn-primary {
            background: #3d6ba6;
            color: #ffffff;
            box-shadow:
              0 3px 8px rgba(
                61,
                107,
                166,
                0.22
              );
          }

          .btn-primary:hover:not(:disabled) {
            background: #315b91;
            box-shadow:
              0 5px 12px rgba(
                61,
                107,
                166,
                0.28
              );
          }

          .btn-reset {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #d8e1eb !important;
          }

          .btn-reset:hover:not(:disabled) {
            background: #e7edf4;
          }

          .btn-export {
            margin-left: auto;
            background: #10b981;
            color: #ffffff;
            box-shadow:
              0 3px 8px rgba(
                16,
                185,
                129,
                0.18
              );
          }

          .btn-export:hover:not(:disabled) {
            background: #059669;
            box-shadow:
              0 5px 12px rgba(
                16,
                185,
                129,
                0.25
              );
          }


          /* =========================================================
             TABLE CONTAINER
          ========================================================= */

          .table-container {
            width: 100%;
            overflow-x: auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow:
              0 3px 12px rgba(
                30,
                64,
                100,
                0.06
              );
          }


          /* =========================================================
             TABLE
          ========================================================= */

          .ach-training-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            overflow: hidden;
          }

          .ach-training-table thead {
            background: #3d6ba6;
            color: #ffffff;
          }

          .ach-training-table th {
            padding: 12px 10px;
            background: #3d6ba6;
            color: #ffffff;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            white-space: nowrap;
          }

          .ach-training-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e4ecf5;
            color: #334e68;
          }

          .ach-training-table tbody tr {
            background: #ffffff;
            transition: background 0.15s ease;
          }

          .ach-training-table tbody tr:nth-child(even) {
            background: #f8fbff;
          }

          .ach-training-table tbody tr:hover {
            background: #eef5fc;
          }

          .partner-name {
            font-weight: 600;
            color: #28578e;
          }


          /* =========================================================
             PROGRESS BADGE
          ========================================================= */

          .progress-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 52px;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
          }

          .progress-good {
            background: #dcfce7;
            color: #166534;
          }

          .progress-mid {
            background: #fef3c7;
            color: #92400e;
          }

          .progress-zero {
            background: #f1f5f9;
            color: #475569;
          }


          /* =========================================================
             LOADING
          ========================================================= */

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #64748b;
          }

          .spinner {
            width: 25px;
            height: 25px;
            border: 3px solid #dbe7f5;
            border-top-color: #3d6ba6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }


          /* =========================================================
             EMPTY STATE
          ========================================================= */

          .empty-state {
            color: #64748b;
            font-size: 14px;
          }

          .empty-icon {
            font-size: 26px;
            margin-bottom: 7px;
          }

          .empty-state small {
            display: block;
            margin-top: 5px;
            color: #94a3b8;
            font-size: 12px;
          }


          /* =========================================================
             PAGINATION
          ========================================================= */

          .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 13px;
            padding: 10px 2px;
          }

          .pagination-info {
            color: #64748b;
            font-size: 13px;
          }

          .pagination-info strong {
            color: #334e68;
          }

          .pagination-buttons {
            display: flex;
            gap: 6px;
          }

          .pagination-buttons button {
            background: #eef4fb;
            border: 1px solid #d7e3f0;
            color: #2b4e72;
            padding: 7px 12px;
            border-radius: 7px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition:
              background 0.2s ease,
              border-color 0.2s ease;
          }

          .pagination-buttons button:hover:not(:disabled) {
            background: #dfeaf6;
            border-color: #b9cde3;
          }

          .pagination-buttons button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
          }


          /* =========================================================
             MOBILE
          ========================================================= */

          .mobile-card-list {
            display: none;
          }

          @media (max-width: 1100px) {
            .filter-grid {
              grid-template-columns:
                repeat(2, minmax(200px, 1fr));
            }

            .btn-export {
              margin-left: 0;
            }
          }

          @media (max-width: 768px) {
            .filter-card {
              padding: 15px;
              border-radius: 11px;
            }

            .filter-card-header {
              padding-bottom: 13px;
              margin-bottom: 14px;
            }

            .filter-title {
              font-size: 15px;
            }

            .filter-subtitle {
              margin-left: 0;
              margin-top: 6px;
              line-height: 1.4;
            }

            .filter-grid {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .filter-actions {
              flex-wrap: wrap;
            }

            .filter-actions button {
              flex: 1;
              min-width: 120px;
            }

            .btn-export {
              margin-left: 0;
            }

            .table-container {
              display: block;
              overflow-x: auto;
            }

            .ach-training-table {
              min-width: 700px;
            }

            .pagination-container {
              flex-direction: column;
              gap: 10px;
            }
          }
        `}
      </style>
    </div>
  );
}
