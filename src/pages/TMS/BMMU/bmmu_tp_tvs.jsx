// src/pages/TMS/BMMU/bmmu_tp_tva.jsx

import React, { useContext, useEffect, useMemo, useState } from "react";
import LeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";

/* ================= GEO SCOPE ================= */
function getGeoscope() {
  try {
    return JSON.parse(localStorage.getItem("ps_user_geoscope"));
  } catch {
    return null;
  }
}

export default function BmmuTargetAchievement() {
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetsData, setTargetsData] = useState([]);

  const [financialYear, setFinancialYear] = useState("2023-24");
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const [plans, setPlans] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  /* ================= USER GEO ================= */
  const geoscope = getGeoscope();
  const userDistrict = geoscope?.district_id || "";
  const userBlock = geoscope?.block_id || "";

  /* ================= FETCH DATA ================= */
  async function fetchTargetsWithAchievements(e) {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const resp = await TMS_API.trainingPartnerTargets.list({
        ach: 1,
        year: financialYear,

        // 🔒 FORCE FILTER FOR BMM
        district: userDistrict,
        block: userBlock,

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

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchTargetsWithAchievements();

    // Fetch plans
    TMS_API.trainingPlans
      .list({ limit: 500 })
      .then((res) => {
        setPlans(res?.data?.results || res?.data || []);
      })
      .catch(() => setPlans([]));
  }, []);

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
  }, [processedData, searchPartner]);

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
    a.download = "BMM_Target_Achievement.csv";
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
          <main style={{ padding: 18 }}>
            <div style={{ maxWidth: 1200, margin: "20px auto" }}>
              {/* FILTER */}
              <div className="card-ui">
                <form
                  onSubmit={fetchTargetsWithAchievements}
                  style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                >
                  <select
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                  >
                    <option value="2025-26">2025-26</option>
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
                    onChange={(e) => setSearchPartner(e.target.value)}
                  />

                  <button type="submit">
                    {loading ? "Loading..." : "Fetch"}
                  </button>

                  <button type="button" onClick={exportToCSV}>
                    Export
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
      <style>{`/* ========================= */
            .content-area {
  display: flex;
  flex: 1;
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
}`}</style>
    </div>
  );
}
