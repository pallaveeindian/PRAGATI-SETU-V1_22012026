// src/pages/TMS/SMMU/smmu_tp_tva.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";
import {
  getCanonicalRole,
  ROLE_WELCOME_MESSAGES,
} from "../../../utils/roleUtils";

export default function SmmuTargetAchievement() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "SMMU Dashboard";

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetsData, setTargetsData] = useState([]);

  // Filter States
  const [financialYear, setFinancialYear] = useState("2023-24");
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // Dropdown Options State
  const [districts, setDistricts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [userThemes, setUserThemes] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  /* ---------------- API Fetch ---------------- */
  async function fetchTargetsWithAchievements(e) {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Using the deeply nested API view you just updated
      // limit=5000 ensures we get a broad dataset for local filtering/exporting
      const resp = await TMS_API.trainingPartnerTargets.list({
        ach: 1,
        year: financialYear,
        district: selectedDistrict || undefined,
        training_plan: selectedPlan || undefined,
        limit: 5000,
      });

      const items = resp?.data?.results || resp?.data || [];
      setTargetsData(items);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch targets vs achievements:", error);
      setTargetsData([]);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchTargetsWithAchievements();

    // Fetch Districts
    LOOKUP_API.districts
      .list({ page_size: 500 })
      .then((res) => {
        setDistricts(res?.data?.results || []);
      })
      .catch(() => setDistricts([]));

    // Fetch Plans for this SMMU user (leveraging user.id)
    const expert = user?.id || user?.user_id || null;
    if (expert) {
      TMS_API.trainingThemes
        .list({ expert, limit: 200 })
        .then(async (themesResp) => {
          const themeResults = themesResp?.data?.results || [];
          setUserThemes(themeResults.map((th) => th.theme_name));
          const collected = [];
          for (const th of themeResults) {
            try {
              const pResp = await TMS_API.trainingPlans.list({
                theme: th.id,
                limit: 500,
              });
              const pResults = pResp?.data?.results || pResp?.data || [];
              pResults.forEach((p) => {
                collected.push(p);
              });
            } catch (e) {
              console.warn("Failed to fetch plans for theme", th.id);
            }
          }
          setPlans(collected);
        })
        .catch(() => setPlans([]));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Data Processing & Filtering ---------------- */

  const processedData = useMemo(() => {
    return targetsData.map((row) => {
      // Safely extract nested data due to depth=1
      const partnerName = row.partner?.name || "Unknown Partner";
      const planName = row.training_plan?.training_name || "—";
      const districtName = row.district?.district_name_en || "—";

      // Sum batches_completed from the nested achievements array
      const achievedCount =
        row.achievements?.reduce(
          (sum, a) => sum + (a.batches_completed || 0),
          0,
        ) || 0;

      // Calculate Percentage
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

  const filteredData = useMemo(() => {
    const q = searchPartner.trim().toLowerCase();
    return processedData.filter((r) => {
      if (q && !r.partnerName.toLowerCase().includes(q)) return false;
      // SURGICAL ADDITION: Ensure SMMU experts ONLY see their themes
      if (roleKey === "smmu") {
        if (userThemes === null) return false; // Prevent flickering before themes load
        if (!userThemes.includes(r.theme)) return false;
      }
      return true;
    });
  }, [processedData, searchPartner]);

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage]);

  /* ---------------- Export CSV ---------------- */
  function exportToCSV() {
    if (filteredData.length === 0) return alert("No data to export.");

    const headers = [
      "ID",
      "Financial Year",
      "Training Partner",
      "Target Type",
      "Module/Plan",
      "District",
      "Theme",
      "Target Count",
      "Achieved Count",
      "Progress (%)",
    ];

    const rows = filteredData.map((r) => [
      r.id,
      r.financial_year || "-",
      `"${r.partnerName}"`,
      r.target_type || "-",
      `"${r.planName}"`,
      `"${r.districtName}"`,
      `"${r.theme || "-"}"`,
      r.targetCount,
      r.achievedCount,
      `${r.progressPct}%`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Target_vs_Achievement_${financialYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ---------------- UI Render ---------------- */
  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />
      <div className="main-area">
        <main
          style={{
            padding: 18,
            minHeight: "100vh",
          }}
        >
          <div className="dashboard-header">
            <h2 className="dashboard-title">{roleMessage}</h2>
          </div>

          <div
            style={{
              maxWidth: 1200,
              margin: "20px auto",
            }}
          >
            {/* ========================================== */}
            {/* 1. FILTERS & EXPORT PLACEHOLDER COMPONENT  */}
            {/* ========================================== */}
            <div
              style={{
                marginBottom: 14,
                background: "#fff",
                padding: "16px",
                borderRadius: "10px",
                border: "2px solid #a7c6ed",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <h4 style={{ margin: "0 0 12px 0", color: "#2b4e72" }}>
                Filters & Export
              </h4>
              <form
                onSubmit={fetchTargetsWithAchievements}
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#2b4e72",
                      marginBottom: "4px",
                    }}
                  >
                    Financial Year
                  </label>
                  <select
                    className="palette-input"
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                    style={{
                      width: "160px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #a7c6ed",
                    }}
                  >
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#2b4e72",
                      marginBottom: "4px",
                    }}
                  >
                    District
                  </label>
                  <select
                    className="palette-input"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      width: "180px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #a7c6ed",
                    }}
                  >
                    <option value="">-- All Districts --</option>
                    {districts.map((d) => (
                      <option
                        key={d.id || d.district_id}
                        value={d.id || d.district_id}
                      >
                        {d.district_name_en || d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#2b4e72",
                      marginBottom: "4px",
                    }}
                  >
                    Module / Plan
                  </label>
                  <select
                    className="palette-input"
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    style={{
                      width: "220px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #a7c6ed",
                    }}
                  >
                    <option value="">-- All Modules --</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.training_name || p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#2b4e72",
                      marginBottom: "4px",
                    }}
                  >
                    Search Partner
                  </label>
                  <input
                    type="text"
                    className="palette-input"
                    placeholder="Partner name..."
                    value={searchPartner}
                    onChange={(e) => {
                      setSearchPartner(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      width: "220px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #a7c6ed",
                    }}
                  />
                </div>

                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                >
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
                    onClick={exportToCSV}
                    style={{ background: "#10b981" }} // Green for export
                  >
                    Export CSV
                  </button>
                </div>
              </form>
            </div>

            {/* HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
                borderBottom: "2px solid #a7c6ed",
                paddingBottom: 8,
              }}
            >
              <h2 style={{ margin: 0, color: "#2b4e72" }}>
                Training Partners - Targets vs Achievement
              </h2>
            </div>

            {/* ========================================== */}
            {/* 2. DATA TABLE & MOBILE CARDS               */}
            {/* ========================================== */}
            <div
              style={{
                background: "#fff",
                padding: 14,
                borderRadius: 10,
                border: "2px solid #3d6ba6",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  maxHeight: 520,
                  overflow: "auto",
                }}
              >
                <table className="training-table">
                  <thead>
                    <tr>
                      <th>Partner</th>
                      <th>Module / Plan</th>
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
                    ) : filteredData.length === 0 ? (
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
                          <td style={{ fontWeight: "600", color: "#1e293b" }}>
                            {r.partnerName}
                          </td>
                          <td>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>
                              {r.planName}
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              Theme: {r.theme || "—"}
                            </div>
                          </td>
                          <td>{r.districtName}</td>
                          <td style={{ fontWeight: "bold", color: "#3d6ba6" }}>
                            {r.targetCount}
                          </td>
                          <td style={{ fontWeight: "bold", color: "#10b981" }}>
                            {r.achievedCount}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  padding: "3px 8px",
                                  borderRadius: "99px",
                                  background:
                                    r.progressPct >= 100
                                      ? "#dcfce7"
                                      : r.progressPct > 0
                                        ? "#fef3c7"
                                        : "#f1f5f9",
                                  color:
                                    r.progressPct >= 100
                                      ? "#166534"
                                      : r.progressPct > 0
                                        ? "#92400e"
                                        : "#475569",
                                }}
                              >
                                {r.progressPct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* MOBILE CARD VIEW */}
                <div className="mobile-card-list">
                  {loading ? (
                    <div
                      className="mobile-card"
                      style={{ textAlign: "center" }}
                    >
                      Loading...
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div
                      className="mobile-card"
                      style={{ textAlign: "center" }}
                    >
                      No targets found
                    </div>
                  ) : (
                    paginatedData.map((r) => (
                      <div key={r.id} className="mobile-card">
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            marginBottom: "8px",
                          }}
                        >
                          {r.partnerName}
                        </div>
                        <div>
                          <strong>Plan:</strong> {r.planName}
                        </div>
                        <div>
                          <strong>District:</strong> {r.districtName}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "8px",
                            paddingTop: "8px",
                            borderTop: "1px solid #e2e8f0",
                          }}
                        >
                          <div>
                            <strong>Target:</strong> {r.targetCount}
                          </div>
                          <div>
                            <strong>Achieved:</strong> {r.achievedCount}
                          </div>
                          <div>
                            <strong>Progress:</strong> {r.progressPct}%
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* PAGINATION CONTROLS */}
                {!loading && filteredData.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
                    }}
                  >
                    <div style={{ color: "#2b4e72", fontSize: 14 }}>
                      Page {currentPage} of {totalPages || 1}
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btnPage"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        Prev
                      </button>

                      {/* Display a simplified window of pages if there are many */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              className={`btnPage ${currentPage === pageNum ? "activePage" : ""}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNum}
                              style={{ alignSelf: "center", color: "#64748b" }}
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        className="btnPage"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CSS */}
          <style>{`
          /* BUTTON */
          .btnPrimary{
            background:#3d6ba6;
            color:#fff;
            border:none;
            border-radius:6px;
            padding:6px 14px;
            cursor:pointer;
            transition:all .25s ease;
          }

          .btnPrimary:hover{
            transform:translateY(-2px);
            box-shadow:0 4px 8px rgba(0,0,0,0.15);
          }

          /* VIEW/EXPORT BUTTON */
          .btnView{
            background:#5a8cc2;
            color:#fff;
            border:none;
            border-radius:6px;
            padding:6px 14px;
            cursor:pointer;
            transition:all .25s ease;
          }

          .btnView:hover{
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }

          /* TABLE */
          .training-table{
            width:100%;
            border-collapse:collapse;
            font-size:14px;
          }

          /* HEADER */
          .training-table thead{
            background:#3d6ba6;
            color:white;
          }

          .training-table th{
            padding:10px;
            text-align:left;
            font-weight:600;
          }

          /* BODY */
          .training-table td{
            padding:12px 10px;
            border-bottom:1px solid #e4ecf5;
          }

          /* ROW BACKGROUND */
          .training-table tbody tr{
            background:#f8fbff;
          }

          /* ALTERNATE ROW */
          .training-table tbody tr:nth-child(even){
            background:#edf4fb;
          }

          /* HOVER */
          .training-table tbody tr:hover{
            background:#e4ecf5;
            transition:background .2s;
          }

          /* PAGINATION BUTTON */
          .btnPage{
            background:#e4ecf5;
            border:none;
            padding:6px 10px;
            border-radius:6px;
            cursor:pointer;
            color:#2b4e72;
            transition:all .2s ease;
          }

          .btnPage:hover:not(:disabled){
            background:#a7c6ed;
          }

          .btnPage:disabled{
            opacity:0.5;
            cursor:not-allowed;
          }

          /* ACTIVE PAGE */
          .activePage{
            background:#3d6ba6;
            color:#fff;
          }

          /* HEADER */
          .dashboard-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }

          .dashboard-title {
            margin-top: 25px;
            margin-left: 30px;
            color: #2b4e72;
          }

          /* ========================= */
          /* MOBILE CARD SYSTEM */
          /* ========================= */
          .mobile-card-list{
            display:none;
          }

          @media (max-width: 768px){
            .training-table{
              display:none !important; 
            }

            .mobile-card-list{
              display:block;
            }

            .mobile-card{
              background:#f8fbff;
              border:1px solid #a7c6ed;
              border-radius:10px;
              padding:14px;
              margin-bottom:12px;
              box-shadow:0 4px 10px rgba(0,0,0,0.05);
              font-size:14px;
              color:#2b4e72;
            }

            .mobile-card div{
              margin-bottom:6px;
            }

            .btnPage{
              padding:6px 8px;
              font-size:12px;
            }

            .dashboard-title{
              margin-left:10px;
              font-size:18px; 
            }
          }
          `}</style>
        </main>
      </div>
    </div>
  );
}
