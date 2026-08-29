// src/pages/TMS/BMMU/bmmu_tp_tva.jsx

import React, { useContext, useEffect, useMemo, useState } from "react";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
// SURGICAL ADDITION: Import default 'api' for the blob export
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";

export default function BmmuTargetAchievement() {
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetsData, setTargetsData] = useState([]);

  const [financialYear, setFinancialYear] = useState("2026-27");
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const [geoscope, setGeoscope] = useState(null);
  const [isGeoReady, setIsGeoReady] = useState(false);

  const [plans, setPlans] = useState([]);

  // SURGICAL ADDITION: Match pagination state with backend
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const rowsPerPage = 25;

  /* ================= FETCH USER GEO FROM API ================= */
  useEffect(() => {
    async function loadGeoscope() {
      // Adjust .id or .user_id based on your exact AuthContext structure
      const userId = user?.id || user?.user_id;

      if (userId) {
        try {
          const resp = await LOOKUP_API.userGeoscopeByUserId(userId);
          // Handle depending on if your API is paginated or returns a flat object
          const geoData = resp?.data?.results?.[0] || resp?.data || {};
          setGeoscope(geoData);
        } catch (error) {
          console.error("Failed to fetch Geoscope from API:", error);
        }
      }
      setIsGeoReady(true); // Flag that we are done trying to fetch geo
    }

    loadGeoscope();
  }, [user]);

  // Derive district and block from the new state
  const userDistrict = geoscope?.districts?.[0] || user?.district_id || "";
  const userBlock = geoscope?.blocks?.[0] || "";

  /* ================= FETCH DATA ================= */
  // SURGICAL ADDITION: Accept page parameter
  async function fetchTargetsWithAchievements(page = 1) {
    setLoading(true);

    try {
      const resp = await TMS_API.trainingPartnerTargets.list({
        ach: 1,
        year: financialYear,

        // 🔒 FORCE FILTER FOR BMM
        district: userDistrict,

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

  // --- SURGICAL ADDITION: Wait for Geo before fetching targets ---
  useEffect(() => {
    if (isGeoReady) {
      // Only fetch once the geoscope API call is finished
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

      const achievedCount =
        row.achievements?.reduce(
          (sum, a) => sum + (a.batches_completed || 0),
          0,
        ) || 0;

      const targetCount = row.target_count || 0;

      const progressPct =
        targetCount > 0 ? Math.round((achievedCount / targetCount) * 100) : 0;

      return {
        ...row,
        partnerName,
        planName,
        districtName,
        targetCount,
        achievedCount,
        progressPct,
      };
    });
  }, [targetsData]);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    const q = searchPartner.toLowerCase();

    return processedData.filter((r) => {
      if (q && !r.partnerName.toLowerCase().includes(q)) return false;

      // 🔒 EXTRA SAFETY FILTER
      if (r.district_id && r.district_id !== userDistrict) return false;
      if (r.block_id && r.block_id !== userBlock) return false;

      return true;
    });
  }, [processedData, searchPartner, userDistrict, userBlock]);

  /* ================= PAGINATION ================= */
  // SURGICAL ADDITION: Calculate total pages from backend API count
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // SURGICAL ADDITION: Data is already paginated by backend
  const paginatedData = filteredData;

  /* ================= EXPORT ================= */
  // SURGICAL ADDITION: Server-Side Excel Export
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
      link.setAttribute("download", `BMM_Targets_Export_${financialYear}.xlsx`);
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
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1200, margin: "20px auto" }}>
              {/* FILTER */}
              <div className="card-ui">
                <form
                  // SURGICAL ADDITION: Form submit resets page to 1
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentPage === 1) {
                      fetchTargetsWithAchievements(1);
                    } else {
                      setCurrentPage(1);
                    }
                  }}
                  style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                >
                  <select
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                  >
                    <option value="2026-27">2026-27</option>
                  </select>

                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                  >
                    <option value="">All Plans</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.training_name}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Search Partner"
                    value={searchPartner}
                    onChange={(e) => {
                      setSearchPartner(e.target.value);
                      setCurrentPage(1);
                    }}
                  />

                  <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Fetch"}
                  </button>

                  <button type="button" onClick={exportToExcel}>
                    Export Excel
                  </button>
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
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Loading data...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No targets found.
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              {!loading && filteredData.length > 0 && (
                <div style={{ marginTop: 10, justifyContent: "center", textAlign: "center" }}>
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
      <style>
        {
          `/* ========================= */
          .content-area {
            display: flex;
            flex: 1;D
          }

          /* RIGHT SIDE MAIN AREA */
          .main-area {
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          /* MAIN CONTENT PUSHES FOOTER DOWN */
          .main-area main {
            flex: 1;
          }

          /* FOOTER ALWAYS BOTTOM */
          footer {
            margin-top: auto;
          }
          /* CARD UI (FILTER BOX) */
          /* ========================= */
          .card-ui {
            background: #ffffff;
            padding: 16px;
            border-radius: 10px;
            border: 2px solid #a7c6ed;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 16px;
          }

          /* ========================= */
          /* INPUTS / SELECT */
          /* ========================= */
          .card-ui select,
          .card-ui input {
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid #a7c6ed;
            font-size: 14px;
            color: #1e293b;
            outline: none;
            min-width: 160px;
            transition: all 0.2s ease;
          }

          .card-ui input:focus,
          .card-ui select:focus {
            border-color: #3d6ba6;
            box-shadow: 0 0 0 2px rgba(61, 107, 166, 0.15);
          }

          /* ========================= */
          /* BUTTONS */
          /* ========================= */
          .card-ui button {
            background: #3d6ba6;
            color: #fff;
            border: none;
            padding: 7px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.25s ease;
          }

          .card-ui button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }

          /* EXPORT BUTTON (GREEN) */
          .card-ui button:nth-child(5) {
            background: #10b981;
          }

          /* ========================= */
          /* TABLE */
          /* ========================= */
          .training-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 10px;
          }

          /* HEADER */
          .training-table thead {
            background: #3d6ba6;
            color: #fff;
          }

          .training-table th {
            padding: 10px;
            text-align: left;
            font-weight: 600;
          }

          /* BODY */
          .training-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e4ecf5;
          }

          /* ROW COLORS */
          .training-table tbody tr {
            background: #f8fbff;
          }

          .training-table tbody tr:nth-child(even) {
            background: #edf4fb;
          }

          /* HOVER EFFECT */
          .training-table tbody tr:hover {
            background: #e4ecf5;
            transition: background 0.2s;
          }

          /* ========================= */
          /* PROGRESS BADGE */
          /* ========================= */
          .progress-badge {
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

          /* ========================= */
          /* PAGINATION */
          /* ========================= */
          .pagination {
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .pagination button {
            background: #e4ecf5;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            color: #2b4e72;
            margin-left: 4px;
          }

          .pagination button:hover:not(:disabled) {
            background: #a7c6ed;
          }

          .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* ========================= */
          /* MOBILE VIEW */
          /* ========================= */
          .mobile-card-list {
            display: none;
          }

          @media (max-width: 768px) {
            .training-table {
              display: none;
            }

            .mobile-card-list {
              display: block;
            }

            .mobile-card {
              background: #f8fbff;
              border: 1px solid #a7c6ed;
              border-radius: 10px;
              padding: 14px;
              margin-bottom: 12px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.05);
              font-size: 14px;
              color: #2b4e72;
            }

            .mobile-card div {
              margin-bottom: 6px;
            }
          }`
        }
      </style>
    </div>
  );
}
