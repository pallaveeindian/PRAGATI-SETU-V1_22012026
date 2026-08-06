import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import { FaDownload } from "react-icons/fa";
import TableUI from "../CommonUiComp/TableUI";

// Core Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import api, { LOOKUP_API, TMS_API } from "../../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function TargetVsAchievement({ financialYear }) {
  // --- UI & Filter State ---
  const [viewMode, setViewMode] = useState("target_prcnt"); // "target_prcnt" | "theme_prcnt"
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  // --- Lookup Data State ---
  const [apiDistricts, setApiDistricts] = useState([]);
  const [apiThemes, setApiThemes] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  // --- Main Data State ---
  const [apiData, setApiData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // ==========================================
  // 1. FETCH LOOKUPS (Districts & Themes)
  // ==========================================
  useEffect(() => {
    const fetchLookups = async () => {
      setLookupsLoading(true);
      try {
        const [distRes, themeRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 5000 }),
          api.get("/tms/public/training-themes/", {
            params: { page_size: 100 },
          }),
        ]);
        setApiDistricts(
          Array.isArray(distRes?.data)
            ? distRes.data
            : distRes?.data?.results || [],
        );
        setApiThemes(themeRes?.data?.results || themeRes?.data || []);
      } catch (err) {
        console.error("Error fetching lookups:", err);
      } finally {
        setLookupsLoading(false);
      }
    };
    fetchLookups();
  }, []);

  // ==========================================
  // 2. FETCH MAIN ANALYTICS DATA
  // ==========================================
  const fetchReportData = useCallback(async () => {
    if (!financialYear) {
      setApiData([]);
      return;
    }
    setDataLoading(true);
    setApiData([]);
    setPage(1);

    const queryParams = new URLSearchParams();

    queryParams.append("financial_year", financialYear);
    if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
    if (selectedTheme) queryParams.append("theme_id", selectedTheme);

    if (viewMode === "target_prcnt") {
      queryParams.append("dist_trgt_prcnt", "1");
    } else if (viewMode === "theme_prcnt" || viewMode === "theme_only_prcnt") {
      queryParams.append("dist_theme_prcnt", "1");
    }

    try {
      const res = await api.get(
        `/public/cadre-selection-summary/?${queryParams.toString()}`,
      );
      if (res.data?.status === "success") {
        if (viewMode === "target_prcnt") {
          setApiData(res.data.district_target_percentage || []);
        } else if (viewMode === "theme_prcnt") {
          setApiData(res.data.district_theme_percentage || []);
        } else if (viewMode === "theme_only_prcnt") {
          const rawData = res.data.district_theme_percentage || [];
          const themeMap = {};

          rawData.forEach((row) => {
            const tName = row.theme_name || "Unknown Theme";
            if (!themeMap[tName]) {
              themeMap[tName] = { theme_name: tName, theme_target: 0, total_on_boarded: 0 };
            }
            themeMap[tName].theme_target += Number(row.theme_target) || 0;
            themeMap[tName].total_on_boarded += Number(row.total_on_boarded) || 0;
          });

          // Calculate final percentages
          const aggregatedData = Object.values(themeMap).map((item) => ({
            ...item,
            percentage: item.theme_target > 0
              ? ((item.total_on_boarded / item.theme_target) * 100).toFixed(1)
              : 0
          }));

          setApiData(aggregatedData);
        }
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [financialYear, viewMode, selectedDistrict, selectedTheme]);

  // Fetch data when filters change
  useEffect(() => {
    if (!financialYear) return;

    fetchReportData();
  }, [fetchReportData, financialYear]);

  // ==========================================
  // 3. PAGINATION & DATA MAPPING
  // ==========================================
  const totalPages = Math.ceil(apiData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return apiData.slice(start, start + rowsPerPage);
  }, [apiData, page, rowsPerPage]);

  // ==========================================
  // 4. CHART CONFIGURATION
  // ==========================================
  const chartConfigData = useMemo(() => {
    const labels = paginatedData.map((item) => {
      if (viewMode === "target_prcnt") return item.district_name_en || "Unknown";
      if (viewMode === "theme_only_prcnt") return item.theme_name || "Unknown";
      return `${item.district_name_en || "Unknown"} (${item.theme_name || "-"})`;
    });

    const targets = paginatedData.map((item) =>
      viewMode === "target_prcnt" ? item.total_target : item.theme_target,
    );

    const achievements = paginatedData.map((item) =>
      viewMode === "target_prcnt" ? item.total_cadre : item.total_on_boarded,
    );

    return {
      labels,
      datasets: [
        {
          label: "Target",
          data: targets,
          backgroundColor: "#08398A",
          borderRadius: 4,
        },
        {
          label: "Achievement",
          data: achievements,
          backgroundColor: "#f59e0b",
          borderRadius: 4,
        },
      ],
    };
  }, [paginatedData, viewMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#334155",
          font: { family: "inherit", weight: "600" },
        },
      },
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
  // 5. CSV EXPORT LOGIC
  // ==========================================
  const exportToCSV = () => {
    if (!apiData || apiData.length === 0) return;

    let csvContent = "";
    if (viewMode === "target_prcnt") {
      csvContent += "S.No.,District,Total Target,Cadre Onboarded,Achievement %\n";
      apiData.forEach((row, i) => {
        csvContent += `"${i + 1}","${row.district_name_en || "-"}","${row.total_target}","${row.total_cadre}","${row.percentage}%"\n`;
      });
    } else if (viewMode === "theme_only_prcnt") {
      csvContent += "S.No.,Theme Name,Theme Target,Total Onboarded,Achievement %\n";
      apiData.forEach((row, i) => {
        csvContent += `"${i + 1}","${row.theme_name || "-"}","${row.theme_target}","${row.total_on_boarded}","${row.percentage}%"\n`;
      });
    } else {
      csvContent += "S.No.,District,Theme Name,Theme Target,Total Onboarded,Achievement %\n";
      apiData.forEach((row, i) => {
        csvContent += `"${i + 1}","${row.district_name_en || "-"}","${row.theme_name || "-"}","${row.theme_target}","${row.total_on_boarded}","${row.percentage}%"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      viewMode === "target_prcnt" ? "District_Target_vs_Achievement.csv"
        : viewMode === "theme_only_prcnt" ? "Theme_Wise_Analytics.csv"
          : "District_Theme_Achievement.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let columns = [];

  if (viewMode === "target_prcnt") {
    columns = [
      { header: "District", key: "district_name_en" },
      { header: "Total Target", key: "total_target" },
      { header: "Cadre Onboarded", key: "total_cadre" },
      {
        header: "Achievement %",
        key: "percentage",
        render: (row) => {
          const percent = row.percentage || 0;
          return (
            <span style={{ fontWeight: 700, color: percent >= 100 ? "#16a34a" : percent > 0 ? "#ea580c" : "#64748b" }}>
              {percent}%
            </span>
          );
        },
      },
    ];
  } else if (viewMode === "theme_only_prcnt") {
    columns = [
      {
        header: "Theme Name",
        key: "theme_name",
        render: (row) => (
          <span style={{ fontWeight: 700, color: "#3b82f6" }}>
            {row.theme_name || "-"}
          </span>
        ),
      },
      { header: "Theme Target", key: "theme_target" },
      { header: "Total Onboarded", key: "total_on_boarded" },
      {
        header: "Achievement %",
        key: "percentage",
        render: (row) => {
          const percent = row.percentage || 0;
          return (
            <span style={{ fontWeight: 700, color: percent >= 100 ? "#16a34a" : percent >= 15 ? "#083785" : "#ea0c0c" }}>
              {percent}%
            </span>
          );
        },
      },
    ];
  } else {
    // theme_prcnt
    columns = [
      { header: "District", key: "district_name_en" },
      {
        header: "Theme Name",
        key: "theme_name",
        render: (row) => (
          <span style={{ fontWeight: 700, color: "#3b82f6" }}>
            {row.theme_name || "-"}
          </span>
        ),
      },
      { header: "Theme Target", key: "theme_target" },
      { header: "Total Onboarded", key: "total_on_boarded" },
      {
        header: "Achievement %",
        key: "percentage",
        render: (row) => {
          const percent = row.percentage || 0;
          return (
            <span style={{ fontWeight: 700, color: percent >= 100 ? "#16a34a" : percent >= 15 ? "#083785" : "#ea0c0c" }}>
              {percent}%
            </span>
          );
        },
      },
    ];
  }

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>Cadre Onboarding Target vs Achievement</h2>
        <p>
          Monitor your cadre selection targets against operational completions
          verified via location scopes.
        </p>
      </div>

      {/* --- FILTERS --- */}
      <div className="filters-row">
        <div className="filter-group">
          <label>View Mode</label>
          <select
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value);
              setSelectedDistrict("");
            }}
          >
            <option value="target_prcnt">District Target vs Cadre Achievement</option>
            <option value="theme_prcnt">District & Theme Target vs Achievement</option>
            <option value="theme_only_prcnt">Theme Wise Analytics</option>
          </select>
        </div>

        <div className="filter-group">
          <label>District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={lookupsLoading}
          >
            <option value="">-- All Districts --</option>
            {apiDistricts.map((d) => (
              <option key={d.district_id} value={d.district_id}>
                {d.district_name_en}
              </option>
            ))}
          </select>
        </div>

        {viewMode === "theme_prcnt" && (
          <div className="filter-group">
            <label>Training Theme</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              disabled={lookupsLoading}
            >
              <option value="">-- All Themes --</option>
              {apiThemes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.theme_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {(selectedDistrict || selectedTheme) && (
          <div
            className="filter-group"
            style={{ justifyContent: "flex-end", paddingBottom: "2px" }}
          >
            <button
              className="reset-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedTheme("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* --- CHART --- */}
      <div className="chart-card">
        <h3>Analytics Visualization (Current Page)</h3>
        <div className="chart-inner-container">
          {dataLoading ? (
            <div className="empty-state">Loading Chart Data...</div>
          ) : paginatedData.length > 0 ? (
            <Bar data={chartConfigData} options={chartOptions} />
          ) : (
            <div className="empty-state">
              No matrix data found to compile visual chart plots.
            </div>
          )}
        </div>
      </div>

      {/* --- TABLE HEADER & EXPORT --- */}
      <div className="table-header-flex">
        <h3>
          {viewMode === "target_prcnt" ? "District Target vs Cadre Achievement"
            : viewMode === "theme_only_prcnt" ? "Theme Wise Analytics"
              : "District & Theme Target vs Achievement"}
        </h3>
        <button
          className="export-btn"
          onClick={exportToCSV}
          disabled={apiData.length === 0 || dataLoading}
        >
          <FaDownload /> Export Excel
        </button>
      </div>

      {/* --- TABLE --- */}
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
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Strong shadow to separate from blue background */
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

        .reset-btn:hover {
          background: #ef4444;
          color: #fff;
        }

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
          display: flex;
          gap: 14px;
          margin: 0;
          letter-spacing: 0.5px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
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

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .gov-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background: #ffffff;
        }

        .gov-data-table th, .gov-data-table td {
          padding: 14px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #334155;
        }

        .gov-data-table th {
          background: #08398A;
          border-right: 1px solid #f1f5f9;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .gov-data-table tbody td{
          border-right: 1px solid #f1f5f9;
        }

        .gov-data-table tbody tr:hover {
          background: #f8fafc;
        }

        .num-col {
          text-align: center;
        }

        .fw-bold {
          font-weight: 700;
          color: #0f172a;
        }

        .empty-state {
          text-align: center;
          padding: 40px !important;
          color: #64748b !important;
          font-size: 15px;
          font-style: italic;
          background: #f8fafc;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
