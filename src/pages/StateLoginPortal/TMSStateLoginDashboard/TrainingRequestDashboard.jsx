// src/pages/StateLoginPortal/TMSStateLogin/Dashboard/TrainingRequestDashboard.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import TableUI from "../CommonUiComp/TableUI";
import { FaDownload } from "react-icons/fa";

// Core Chart.js imports for Line layout structure
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import api, { LOOKUP_API } from "../../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export default function TrainingRequestDashboard({ financialYear }) {
  // --- Filter States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // SURGICAL ADDITION: Date Filters State
  const [exactDate, setExactDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Lookup Data States ---
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  // --- Main Data States ---
  const [apiData, setApiData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // ==========================================
  // 1. FETCH INITIAL LOOKUPS
  // ==========================================
  useEffect(() => {
    const fetchInitialLookups = async () => {
      setLookupsLoading(true);
      try {
        const [distRes, themeRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 5000 }),
          api.get("/tms/public/training-themes/", {
            params: { page_size: 100 },
          }),
        ]);
        setDistricts(
          Array.isArray(distRes?.data)
            ? distRes.data
            : distRes?.data?.results || [],
        );
        setThemes(themeRes?.data?.results || themeRes?.data || []);
      } catch (err) {
        console.error("Error loading lookups:", err);
      } finally {
        setLookupsLoading(false);
      }
    };
    fetchInitialLookups();
  }, []);

  // Fetch Blocks based on District
  useEffect(() => {
    if (!selectedDistrict) {
      setBlocks([]);
      return;
    }
    const fetchBlocks = async () => {
      try {
        const res = await LOOKUP_API.blocksByDistrict(selectedDistrict, {
          params: { page_size: 5000 },
        });
        setBlocks(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching blocks:", err);
        setBlocks([]);
      }
    };
    fetchBlocks();
  }, [selectedDistrict]);

  // Fetch Plans based on Theme
  useEffect(() => {
    if (!selectedTheme) {
      setPlans([]);
      return;
    }
    const fetchPlans = async () => {
      try {
        const res = await api.get("/tms/public/training-plans/", {
          params: { theme: selectedTheme, page_size: 500 },
        });
        setPlans(res?.data?.results || res?.data || []);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setPlans([]);
      }
    };
    fetchPlans();
  }, [selectedTheme]);

  // ==========================================
  // 2. FETCH MAIN ANALYTICS DATA
  // ==========================================
  const fetchReportData = useCallback(async () => {
    if (!financialYear) return;

    setDataLoading(true);
    setApiData([]);
    setPage(1);

    const queryParams = new URLSearchParams();
    queryParams.append("financial_year", financialYear);

    if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
    if (selectedBlock) queryParams.append("block_id", selectedBlock);
    if (selectedTheme) queryParams.append("theme_id", selectedTheme);
    if (selectedPlan) queryParams.append("plan_id", selectedPlan);

    // SURGICAL ADDITION: Append Date Filters
    if (exactDate) queryParams.append("date", exactDate);
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);

    try {
      const res = await api.get(
        `/public/cadre-selection-summary/?${queryParams.toString()}`,
      );
      if (res.data?.status === "success") {
        // Fallbacks based on your standard payload structure
        const rawData =
          res.data.data || res.data.results || res.data.cadre_summary || [];
        setApiData(Array.isArray(rawData) ? rawData : []);
      }
    } catch (err) {
      console.error("Error fetching training request data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [
    financialYear,
    selectedDistrict,
    selectedBlock,
    selectedTheme,
    selectedPlan,
    exactDate, // <-- SURGICAL UPDATE: Added exactDate
    startDate, // <-- SURGICAL UPDATE: Added startDate
    endDate, // <-- SURGICAL UPDATE: Added endDate
  ]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ==========================================
  // 3. CHART CONFIGURATION (LINE CHART)
  // ==========================================
  const chartConfigData = useMemo(() => {
    // Group metrics dynamically based on the current filtering level
    const summaryMap = {};
    const groupKey = selectedDistrict ? "block_name_en" : "district_name_en";

    apiData.forEach((item) => {
      const label = item[groupKey] || item.training_name || "Unknown";
      if (!summaryMap[label]) {
        summaryMap[label] = 0;
      }
      summaryMap[label] +=
        (Number(item.beneficiary_count) || 0) +
        (Number(item.trainer_count) || 0);
    });

    const labels = Object.keys(summaryMap);
    const dataPoints = labels.map((k) => summaryMap[k]);

    return {
      labels,
      datasets: [
        {
          label: "Total Selected Cadre",
          data: dataPoints,
          borderColor: "#f59e0b", // Amber 500
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#f59e0b",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [apiData, selectedDistrict]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b" },
      },
    },
  };

  // ==========================================
  // 4. TABLE COLUMNS SETUP
  // ==========================================
  const columns = [
    {
      header: "Created By",
      key: "username",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {row.username || "-"}
        </span>
      ),
    },
    {
      header: "District",
      key: "district_name_en",
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.district_name_en || "-"}</span>
      ),
    },
    {
      header: "Block",
      key: "block_name_en",
      render: (row) => row.block_name_en || "-",
    },
    { header: "Financial Year", key: "financial_year" },
    {
      header: "Training Program",
      key: "training_name",
      render: (row) => (
        <span style={{ color: "#2563eb", fontWeight: 700 }}>
          {row.training_name || "-"}
        </span>
      ),
    },
    {
      header: "Beneficiaries Selected",
      key: "beneficiary_count",
      render: (row) => (
        <div className="num-col" style={{ fontWeight: 700, color: "#0f172a" }}>
          {row.beneficiary_count || 0}
        </div>
      ),
    },
    {
      header: "Trainers Selected",
      key: "trainer_count",
      render: (row) => (
        <div
          className="num-col"
          style={{
            fontWeight: 700,
            color: "#9a3412",
            background: "#ffedd5",
            padding: "4px 8px",
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          {row.trainer_count || 0}
        </div>
      ),
    },
  ];

  // ==========================================
  // 5. CSV EXPORT LOGIC
  // ==========================================
  const exportToCSV = () => {
    if (!apiData || apiData.length === 0) return;

    let csvContent =
      "S.No.,Created By,District,Block,Financial Year,Training Program,Beneficiaries Selected,Trainers Selected\n";

    apiData.forEach((row, i) => {
      csvContent += `"${i + 1}","${row.username || "-"}","${row.district_name_en || "-"}","${row.block_name_en || "-"}","${row.financial_year || "-"}","${row.training_name || "-"}","${row.beneficiary_count || 0}","${row.trainer_count || 0}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Training_Requests_Created_${financialYear}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(apiData.length / rowsPerPage) || 1;

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>Training Requests Created</h2>
        <p>
          Monitor raw operational capacity allocation and cadre selection
          trajectories filtered by programmatic themes and geographical scopes.
        </p>
      </div>

      {/* --- FILTERS ROW --- */}
      <div className="filters-row">
        <div className="filter-group">
          <label>District Scope</label>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedBlock("");
              setPage(1);
            }}
            disabled={lookupsLoading}
          >
            <option value="">-- All Districts --</option>
            {districts.map((d) => (
              <option key={d.district_id} value={d.district_id}>
                {d.district_name_en}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Block Boundary</label>
          <select
            value={selectedBlock}
            onChange={(e) => {
              setSelectedBlock(e.target.value);
              setPage(1);
            }}
            disabled={!selectedDistrict}
          >
            <option value="">-- All Blocks --</option>
            {blocks.map((b) => (
              <option key={b.block_id} value={b.block_id}>
                {b.block_name_en}
              </option>
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
              setPage(1);
            }}
            disabled={lookupsLoading}
          >
            <option value="">-- All Themes --</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.theme_name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Training Plan</label>
          <select
            value={selectedPlan}
            onChange={(e) => {
              setSelectedPlan(e.target.value);
              setPage(1);
            }}
            disabled={!selectedTheme}
          >
            <option value="">-- All Plans --</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.training_name || p.title || p.plan_name}
              </option>
            ))}
          </select>
        </div>

        {/* SURGICAL ADDITION: Date Filters */}
        <div className="filter-group">
          <label>Exact Date</label>
          <input
            type="date"
            value={exactDate}
            onChange={(e) => {
              setExactDate(e.target.value);
              setStartDate(""); // Clear range if exact date is used
              setEndDate("");
              setPage(1);
            }}
            disabled={lookupsLoading}
          />
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setExactDate(""); // Clear exact date if range is used
              setPage(1);
            }}
            disabled={lookupsLoading}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setExactDate("");
              setPage(1);
            }}
            disabled={lookupsLoading || !startDate}
          />
        </div>

        {/* SURGICAL UPDATE: Include Date states in Reset Logic */}
        {(selectedDistrict ||
          selectedBlock ||
          selectedTheme ||
          selectedPlan ||
          exactDate ||
          startDate ||
          endDate) && (
          <div
            className="filter-group"
            style={{
              justifyContent: "flex-end",
              paddingBottom: "2px",
              flex: "none",
            }}
          >
            <button
              className="reset-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedBlock("");
                setSelectedTheme("");
                setSelectedPlan("");
                setExactDate(""); // <-- SURGICAL ADDITION
                setStartDate(""); // <-- SURGICAL ADDITION
                setEndDate(""); // <-- SURGICAL ADDITION
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* --- CHART SECTION --- */}
      <div className="chart-card">
        <h3>Total Cadre Selection Trajectories</h3>
        <p className="chart-subtitle">
          Aggregated totals evaluated across selected geographical domains.
        </p>
        <div className="chart-inner-container">
          {dataLoading ? (
            <div className="empty-state">Loading analytical metrics...</div>
          ) : apiData.length > 0 ? (
            <Line data={chartConfigData} options={chartOptions} />
          ) : (
            <div className="empty-state">
              No target data found for the selected filter combinations.
            </div>
          )}
        </div>
      </div>

      {/* --- TABLE HEADER & EXPORT --- */}
      <div className="table-header-flex">
        <h3>Detailed Selection Registry</h3>
        <button
          className="export-btn"
          onClick={exportToCSV}
          disabled={apiData.length === 0 || dataLoading}
        >
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
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={apiData.length}
        />
      )}

      {/* --- STYLES --- */}
      <style>{`
        .analytics-white-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          animation: fadeIn 0.4s ease-in-out;
        }

        .report-header { margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; }
        .report-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #000000;
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

        .filters-row {
          display: flex; flex-wrap: wrap; gap: 20px; background: #08398A; padding: 20px;
          border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;
        }

        .filter-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 180px; }
        .filter-group label { font-size: 13px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-group select, .filter-group input[type="date"] {
          padding: 12px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px;
          font-weight: 600; color: #0f172a; outline: none; transition: all 0.2s ease;
          background: #ffffff; font-family: inherit; box-sizing: border-box; min-height: 40px; width: 100%;
        }
        .filter-group select:focus, .filter-group input[type="date"]:focus { border-color: #0092E0; box-shadow: 0 0 0 3px rgba(0, 146, 224, 0.15); }
        .filter-group select:disabled, .filter-group input[type="date"]:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
        .reset-btn { background: #f1f5f9; color: #ef4444; border: 1px solid #fecaca; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; height: 44px; }
        .reset-btn:hover { background: #ef4444; color: #fff; }

        .chart-card { background: #ffffff; border: 3px solid #08398A; border-radius: 12px; padding: 24px; margin-bottom: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .chart-card h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 800; }
        .chart-subtitle { color: #64748b; font-size: 13px; margin: 6px 0 20px 0; }
        .chart-inner-container { height: 350px; width: 100%; display: flex; justify-content: center; }

        .table-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .table-header-flex h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 800; }

        .export-btn { display: flex; align-items: center; gap: 8px; background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3); }
        .export-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4); }
        .export-btn:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }

        .num-col { text-align: center; }
        .empty-state { text-align: center; padding: 48px; color: #94a3b8; font-size: 15px; font-style: italic; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
