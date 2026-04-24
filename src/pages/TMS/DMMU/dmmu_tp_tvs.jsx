// src/pages/TMS/DMMU/dmmu_tp_tva.jsx

import React, { useContext, useEffect, useMemo, useState } from "react";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";

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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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
  async function fetchTargetsWithAchievements(e) {
    if (e) e.preventDefault();
    if (!filters.district_id) return;

    setLoading(true);

    try {
      const resp = await TMS_API.trainingPartnerTargets.list({
        ach: 1,
        year: financialYear,
        district: filters.district_id,
        training_plan: selectedPlan || undefined,
        limit: 5000,
      });

      const items = resp?.data?.results || resp?.data || [];
      setTargetsData(items);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed:", error);
      setTargetsData([]);
    } finally {
      setLoading(false);
    }
  }

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
      fetchTargetsWithAchievements();
    }
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
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  /* ================= EXPORT ================= */
  function exportToCSV() {
    if (!filteredData.length) return alert("No data");

    const headers = [
      "Partner",
      "Plan",
      "District",
      "Target",
      "Achieved",
      "Progress",
    ];

    const rows = filteredData.map((r) => [
      r.partnerName,
      r.planName,
      r.districtName,
      r.targetCount,
      r.achievedCount,
      r.progressPct + "%",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "DMM_Target_Achievement.csv";
    a.click();
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
                  onSubmit={fetchTargetsWithAchievements}
                >
                  <div>
                    <label>Financial Year</label>
                    <select
                      value={financialYear}
                      onChange={(e) => setFinancialYear(e.target.value)}
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
                      onChange={(e) => setSelectedPlan(e.target.value)}
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
                      onChange={(e) => setSearchPartner(e.target.value)}
                    />
                  </div>

                  <div className="actions">
                    <button type="submit" className="btnPrimary">
                      {loading ? "Fetching..." : "Fetch Data"}
                    </button>

                    <button
                      type="button"
                      className="btnView"
                      onClick={exportToCSV}
                    >
                      Export CSV
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
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((r) => (
                    <tr key={r.id}>
                      <td>{r.partnerName}</td>
                      <td>{r.planName}</td>
                      <td>{r.districtName}</td>
                      <td>{r.targetCount}</td>
                      <td>{r.achievedCount}</td>
                      <td>{r.progressPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div style={{ marginTop: 10 }}>
                Page {currentPage} / {totalPages}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
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
      }

      .training-table td{
        padding:10px;
      }
      `}</style>
    </div>
  );
}
