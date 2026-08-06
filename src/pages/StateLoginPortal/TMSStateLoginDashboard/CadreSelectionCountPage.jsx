// src/pages/StateLoginPortal/TMSStateLoginDashboard/CadreSelectionCountPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import TableUI from "../CommonUiComp/TableUI";
import { FaBoxes, FaDownload } from "react-icons/fa";

// Core Chart.js imports for Pie layout structure
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import api, { LOOKUP_API, TMS_API } from "../../../api/axios";

import {
  FaBullseye,
  FaUsers,
  FaDropbox,
  FaGraduationCap
} from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CadreSelectionCountPage({ financialYear }) {
  // --- UI & Filter State ---
  const [viewMode, setViewMode] = useState("theme"); // "theme" | "plan"
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // --- Lookup Data State ---
  const [apiDistricts, setApiDistricts] = useState([]);
  const [apiThemes, setApiThemes] = useState([]);
  const [apiPlans, setApiPlans] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  // --- Main Data State ---
  const [apiData, setApiData] = useState([]);
  const [totals, setTotals] = useState(null); // Extracted from API first row
  const [dataLoading, setDataLoading] = useState(false);

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // ==========================================
  // 1. INITIAL LOOKUPS FETCHING
  // ==========================================
  useEffect(() => {
    const fetchInitialLookups = async () => {
      setLookupsLoading(true);
      try {
        const [distRes, themeRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 5000 }),
          api.get("/tms/public/training-themes/", { params: { page_size: 100 } }),
        ]);
        setApiDistricts(Array.isArray(distRes?.data) ? distRes.data : distRes?.data?.results || []);
        setApiThemes(themeRes?.data?.results || themeRes?.data || []);
      } catch (err) {
        console.error("Error fetching lookups:", err);
      } finally {
        setLookupsLoading(false);
      }
    };
    fetchInitialLookups();
  }, []);

  // Fetch Plans conditionally based on theme
  useEffect(() => {
    if (!selectedTheme) {
      setApiPlans([]);
      return;
    }
    const fetchPlans = async () => {
      try {
        const res = await api.get("/tms/public/training-plans/", {
          params: { theme: selectedTheme, page_size: 500 },
        });
        setApiPlans(res?.data?.results || res?.data || []);
      } catch (err) {
        console.error("Error fetching dependent plans:", err);
      }
    };
    fetchPlans();
  }, [selectedTheme]);

  // ==========================================
  // 2. MAIN REPORT DATA FETCH ENGINE
  // ==========================================
  const fetchReportData = useCallback(async () => {
    if (!financialYear) {
      setApiData([]);
      setTotals(null);
      return;
    }
    setDataLoading(true);
    setApiData([]);
    setTotals(null);
    setPage(1);

    const queryParams = new URLSearchParams();
    queryParams.append("financial_year", financialYear);
    queryParams.append("report_type", viewMode); // Triggers python 'theme' or 'plan' logic

    if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
    if (selectedTheme) queryParams.append("theme_id", selectedTheme);
    if (viewMode === "plan" && selectedPlan) queryParams.append("plan_id", selectedPlan);

    try {
      const res = await api.get(`/tms/reports/master-progress/?${queryParams.toString()}`);
      if (res.data?.status === "success" && Array.isArray(res.data.data)) {
        const rawData = res.data.data;
        if (rawData.length > 0) {
          // The Python backend is programmed to return the TOTAL AGGREGATE row at index 0
          setTotals(rawData[0]);
          setApiData(rawData.slice(1));
        }
      }
    } catch (err) {
      console.error("Error fetching master progress report:", err);
    } finally {
      setDataLoading(false);
    }
  }, [financialYear, viewMode, selectedDistrict, selectedTheme, selectedPlan]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ==========================================
  // 3. CHART CONFIGURATION (PIE)
  // ==========================================
  const chartConfigData = useMemo(() => {
    // Group all data by Theme/Plan to show cadre distribution
    const groupSummary = {};

    apiData.forEach((item) => {
      const groupName = item.group_name || "Unknown";
      const onboarded = Number(item.total_onboarded || 0);

      if (!groupSummary[groupName]) {
        groupSummary[groupName] = 0;
      }
      groupSummary[groupName] += onboarded;
    });

    const labels = Object.keys(groupSummary);
    const values = labels.map((label) => groupSummary[label]);

    return {
      labels,
      datasets: [
        {
          label: "Total Onboarded",
          data: values,
          backgroundColor: [
            "#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
            "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#14b8a6",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [apiData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { color: "#334155", font: { family: "inherit", weight: "600" } } },
      tooltip: { padding: 12, cornerRadius: 8, titleFont: { size: 14 }, bodyFont: { size: 13 } },
    },
  };

  // ==========================================
  // 4. TABLE COLUMNS SETUP
  // ==========================================
  const columns = [
    { header: "District", key: "district_name", render: (row) => <span style={{ fontWeight: 700, color: "#0f172a" }}>{row.district_name || "-"}</span> },
    { header: viewMode === "theme" ? "Theme" : "Training Plan", key: "group_name", render: (row) => <span style={{ fontWeight: 700, color: "#3b82f6" }}>{row.group_name || "-"}</span> },
    { header: "Target", key: "target", render: (row) => <div className="num-col">{row.target.toLocaleString('en-IN')}</div> },
    { header: "Total Onboarded", key: "total_onboarded", render: (row) => <div className="num-col" style={{ color: "#0f172a", fontWeight: 700 }}>{row.total_onboarded.toLocaleString('en-IN')}</div> },
    { header: "Total Batches", key: "total_batches", render: (row) => <div className="num-col">{row.total_batches.toLocaleString('en-IN')}</div> },
    { header: "DMMU Approved Batches", key: "dmmu_approved_batches", render: (row) => <div className="num-col">{row.dmmu_approved_batches.toLocaleString('en-IN')}</div> },
    { header: "Ongoing Batches", key: "ongoing_batches", render: (row) => <div className="num-col" style={{ color: "#f59e0b", fontWeight: 600 }}>{row.ongoing_batches.toLocaleString('en-IN')}</div> },
    { header: "Completed Batches", key: "completed_batches", render: (row) => <div className="num-col" style={{ color: "#16a34a", fontWeight: 600 }}>{row.completed_batches.toLocaleString('en-IN')}</div> },
    { header: "Total Participants Trained", key: "total_participants_trained", render: (row) => <div className="num-col" style={{ color: "#083A8B", fontWeight: 800 }}>{row.total_participants_trained.toLocaleString('en-IN')}</div> },
    {
      header: "%age (Trained / Onboarded)",
      key: "percentage",
      render: (row) => (
        <div className="num-col">
          <span style={{ fontWeight: 700, color: row.percentage >= 100 ? "#16a34a" : row.percentage > 0 ? "#ea580c" : "#64748b" }}>
            {row.percentage}%
          </span>
        </div>
      ),
    },
  ];

  // ==========================================
  // 5. CSV EXPORT LOGIC
  // ==========================================
  const exportToCSV = () => {
    if (!apiData || apiData.length === 0) return;

    let csvContent = "S.No.,District," + (viewMode === "theme" ? "Theme" : "Training Plan") + ",Target,Total Onboarded,Total Batches,DMMU Approved Batches,Ongoing Batches,Completed Batches,Total Participants Trained,%age\n";

    apiData.forEach((row, i) => {
      csvContent += `"${i + 1}","${row.district_name || "-"}","${row.group_name || "-"}","${row.target}","${row.total_onboarded}","${row.total_batches}","${row.dmmu_approved_batches}","${row.ongoing_batches}","${row.completed_batches}","${row.total_participants_trained}","${row.percentage}%"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cadre_Selection_Progress_${viewMode.toUpperCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>Batch-wise Cadre Selection & Progress</h2>
        <p>Monitor end-to-end programmatic progress from participant onboarding to final training completions.</p>
      </div>

      {/* --- OVERALL STATS CARDS --- */}
      {totals && (
        <div className="metrics-grid">
          <div className="metric-card gradient-blue">
            <div className="metric-icon"><FaBullseye /></div>
            <div className="metric-info">
              <span className="metric-label">Total Target</span>
              <span className="metric-value">{totals.target.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="metric-card gradient-blue">
            <div className="metric-icon"><FaUsers /></div>
            <div className="metric-info">
              <span className="metric-label">Total Onboarded</span>
              <span className="metric-value">{totals.total_onboarded.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="metric-card gradient-blue">
            <div className="metric-icon"><FaBoxes /></div>
            <div className="metric-info">
              <span className="metric-label">Total Batches</span>
              <span className="metric-value">{totals.total_batches.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="metric-card gradient-blue">
            <div className="metric-icon"><FaGraduationCap /></div>
            <div className="metric-info">
              <span className="metric-label">Participants Trained</span>
              <span className="metric-value">{totals.total_participants_trained.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* --- FILTERS ROW --- */}
      <div className="filters-row">
        <div className="filter-group">
          <label>View Mode</label>
          <select
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value);
              setSelectedPlan(""); // Reset plan when switching modes
            }}
          >
            <option value="theme">Theme Wise Analytics</option>
            <option value="plan">Training Plan Wise Analytics</option>
          </select>
        </div>

        <div className="filter-group">
          <label>District</label>
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={lookupsLoading}>
            <option value="">-- All Districts --</option>
            {apiDistricts.map((d) => (
              <option key={d.district_id} value={d.district_id}>{d.district_name_en}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Training Theme</label>
          <select
            value={selectedTheme}
            onChange={(e) => {
              setSelectedTheme(e.target.value);
              setSelectedPlan("");
            }}
            disabled={lookupsLoading}
          >
            <option value="">-- All Themes --</option>
            {apiThemes.map((t) => (
              <option key={t.id} value={t.id}>{t.theme_name}</option>
            ))}
          </select>
        </div>

        {viewMode === "plan" && (
          <div className="filter-group">
            <label>Training Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              disabled={!selectedTheme}
            >
              <option value="">-- All Plans --</option>
              {apiPlans.map((p) => (
                <option key={p.id} value={p.id}>{p.training_name || p.title || p.plan_name}</option>
              ))}
            </select>
          </div>
        )}

        {(selectedDistrict || selectedTheme || selectedPlan) && (
          <div className="filter-group" style={{ justifyContent: "flex-end", paddingBottom: "2px" }}>
            <button
              className="reset-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedTheme("");
                setSelectedPlan("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* --- CHART SECTION --- */}
      <div className="chart-card">
        <h3>Distribution of Onboarded Cadre ({viewMode === "theme" ? "Theme-wise" : "Plan-wise"})</h3>
        <div className="chart-inner-container">
          {dataLoading ? (
            <div className="empty-state">Loading Chart Data...</div>
          ) : apiData.length > 0 ? (
            <Pie data={chartConfigData} options={chartOptions} />
          ) : (
            <div className="empty-state">No data available to plot chart.</div>
          )}
        </div>
      </div>

      {/* --- TABLE HEADER & EXPORT --- */}
      <div className="table-header-flex">
        <h3>{viewMode === "theme" ? "Theme Wise Analytics" : "Training Plan Wise Analytics"}</h3>
        <button className="export-btn" onClick={exportToCSV} disabled={apiData.length === 0 || dataLoading}>
          <FaDownload /> Export Excel
        </button>
      </div>

      {/* --- TABLE UI --- */}
      <TableUI
        data={apiData}
        columns={columns}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={dataLoading}
      />

      {/* --- PAGINATION --- */}
      {!dataLoading && apiData.length > 0 && (
        <TablePagination
          page={page}
          totalPages={Math.ceil(apiData.length / rowsPerPage)}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={apiData.length}
        />
      )}

      {/* --- COMPONENT STYLES --- */}
      <style>{`
        .analytics-white-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          animation: fadeIn 0.4s ease-in-out;
        }

        .report-header {
          margin-bottom: 24px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 16px;
        }

        .report-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #083A8B;
          margin: 0 0 8px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          margin: 0;
          letter-spacing: 0.5px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .report-header p {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;          
        }

        /* --- Metric Cards --- */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .metric-card {
          padding: 20px;
          border-radius: 14px;
          color: white;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .metric-card:hover { transform: translateY(-4px); }
        .metric-icon { font-size: 32px; background: rgba(255,255,255,0.2); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .metric-info { display: flex; flex-direction: column; }
        .metric-label { font-size: 12px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 28px; font-weight: 800; line-height: 1.2; }

        .gradient-blue { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }
        .gradient-orange { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
        .gradient-purple { background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); }
        .gradient-green { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); }

        /* --- Filters --- */
        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          background: #08398A;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 220px;
        }

        .filter-group label {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-group select {
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .filter-group select:focus {
          border-color: #0092E0;
          box-shadow: 0 0 0 3px rgba(0, 146, 224, 0.15);
        }

        .reset-btn {
          background: #f1f5f9;
          color: #ef4444;
          border: 1px solid #fecaca;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover { background: #ef4444; color: #fff; }

        /* --- Chart --- */
        .chart-card {
          background: #ffffff;
          border: 3px solid #08398A;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .chart-card h3 {
          margin: 0 0 20px 0;
          color: #0f172a;
          font-size: 16px;
        }

        .chart-inner-container {
          height: 350px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .table-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .table-header-flex h3 {
          margin: 0;
          color: #0f172a;
          font-size: 18px;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #16a34a;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);
        }

        .export-btn:hover:not(:disabled) {
          background: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
        }

        .export-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          box-shadow: none;
        }

        .empty-state {
          text-align: center;
          color: #64748b;
          font-size: 15px;
          font-style: italic;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .num-col {
          text-align: right;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}