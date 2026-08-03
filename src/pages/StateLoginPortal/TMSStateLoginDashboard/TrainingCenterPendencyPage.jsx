// src/pages/StateLoginPortal/TMSStateLoginDashboard/TrainingCenterPendencyPage.jsx
import React, { useState, useMemo } from "react";
import TablePagination from "../CommonUiComp/TablePagination";

// 1. Import Chart.js core framework layout modules
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

// 2. Explicitly register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// High-fidelity structured Mock Data matching the exact training pendency fields
const PENDENCY_MOCK_DATA = [
  {
    id: 1,
    partnerName: "Vision IT Skills Ltd",
    district: "Patna",
    allocatedTarget: 500,
    centerCreated: false,
    geoMediaUploaded: false,
    uploadCount: 0,
  },
  {
    id: 2,
    partnerName: "Vision IT Skills Ltd",
    district: "Gaya",
    allocatedTarget: 300,
    centerCreated: true,
    geoMediaUploaded: false,
    uploadCount: 0,
  },
  {
    id: 3,
    partnerName: "Vision IT Skills Ltd",
    district: "Muzaffarpur",
    allocatedTarget: 250,
    centerCreated: true,
    geoMediaUploaded: true,
    uploadCount: 14,
  },
  {
    id: 4,
    partnerName: "Apex Global Development",
    district: "Patna",
    allocatedTarget: 400,
    centerCreated: false,
    geoMediaUploaded: false,
    uploadCount: 0,
  },
  {
    id: 5,
    partnerName: "Apex Global Development",
    district: "Bhagalpur",
    allocatedTarget: 600,
    centerCreated: true,
    geoMediaUploaded: true,
    uploadCount: 22,
  },
  {
    id: 6,
    partnerName: "Indo-European Tech Foundation",
    district: "Darbhanga",
    allocatedTarget: 150,
    centerCreated: false,
    geoMediaUploaded: false,
    uploadCount: 0,
  },
  {
    id: 7,
    partnerName: "Indo-European Tech Foundation",
    district: "Gaya",
    allocatedTarget: 350,
    centerCreated: true,
    geoMediaUploaded: false,
    uploadCount: 0,
  },
  {
    id: 8,
    partnerName: "Alpha Skillcraft Academy",
    district: "Purnia",
    allocatedTarget: 200,
    centerCreated: true,
    geoMediaUploaded: true,
    uploadCount: 8,
  },
];

const TrainingCenterPendencyPage = () => {
  // --- Operational Dynamic Filter States ---
  const [pendencyCategory, setPendencyCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // --- Tabular Pagination Navigation Hooks ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ==========================================
  // EXTRACT UNIQUE FILTER PARAMETERS (MEMOS)
  // ==========================================
  const uniqueDistricts = useMemo(() => {
    return [...new Set(PENDENCY_MOCK_DATA.map((item) => item.district))];
  }, []);

  // ==========================================
  // DATA MATRIX SEGMENTATION RULES INTERACTION
  // ==========================================
  const filteredData = useMemo(() => {
    return PENDENCY_MOCK_DATA.filter((item) => {
      // First check the static district selector match criteria
      const matchesDistrict = selectedDistrict
        ? item.district === selectedDistrict
        : true;

      // Secondary structural breakdown evaluations corresponding directly to user selection matrices
      let matchesCategory = true;
      if (pendencyCategory === "target_no_center") {
        // 1) Training partner target allotted but training centre not created yet
        matchesCategory =
          item.allocatedTarget > 0 && item.centerCreated === false;
      } else if (pendencyCategory === "center_no_media") {
        // 2) Centers which have not uploaded geo-tagged media (Requires center to exist first)
        matchesCategory =
          item.centerCreated === true && item.geoMediaUploaded === false;
      } else if (pendencyCategory === "center_with_media") {
        // 3) Total centers uploaded media
        matchesCategory =
          item.centerCreated === true && item.geoMediaUploaded === true;
      }

      return matchesDistrict && matchesCategory;
    });
  }, [pendencyCategory, selectedDistrict]);

  // ==========================================
  // TOTAL METRICS SUMMARY AGGREGATIONS
  // ==========================================
  const summaryAggregations = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.totalAllocatedTarget += curr.allocatedTarget;
        acc.totalMediaUploadCount += curr.uploadCount;
        if (curr.centerCreated) acc.totalCentersCreated += 1;
        return acc;
      },
      {
        totalAllocatedTarget: 0,
        totalMediaUploadCount: 0,
        totalCentersCreated: 0,
      },
    );
  }, [filteredData]);

  // ==========================================
  // DYNAMIC GRAPH CONFIGURATION PIPELINE
  // ==========================================
  const chartConfigData = useMemo(() => {
    // Group and structure performance metrics across specific partners dynamically
    const summaryMap = {};

    filteredData.forEach((item) => {
      if (!summaryMap[item.partnerName]) {
        summaryMap[item.partnerName] = { target: 0, mediaCount: 0 };
      }
      summaryMap[item.partnerName].target += item.allocatedTarget;
      summaryMap[item.partnerName].mediaCount += item.uploadCount;
    });

    const labels = Object.keys(summaryMap);
    const targets = labels.map((k) => summaryMap[k].target);
    const uploads = labels.map((k) => summaryMap[k].mediaCount);

    return {
      labels,
      datasets: [
        {
          label: "Allotted Targets Matrix",
          data: targets,
          backgroundColor: "rgba(59, 130, 246, 0.85)", // Clean Blue-500
          borderRadius: 6,
        },
        {
          label: "Uploaded Geo Media Count",
          data: uploads,
          backgroundColor: "rgba(16, 185, 129, 0.85)", // Success Emerald-500
          borderRadius: 6,
        },
      ],
    };
  }, [filteredData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          font: { size: 13, sansSerif: true },
          color: "#475569",
        },
      },
      tooltip: { padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b" },
      },
    },
  };

  // ==========================================
  // PAGINATION SLICING LAYER
  // ==========================================
  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    return pages === 0 ? 1 : pages;
  }, [filteredData.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <>
      <div className="report-container">
        <div className="report-header">
          <p>
            Review and audit training space initialization blocks, missing
            geo-tagged assets, and valid uploads.
          </p>
        </div>

        {/* Filter Matrix Controller Box */}
        <div className="filter-card">
          {/* Pendency Focus Segment Dropdown */}
          <div className="filter-group unique-broad-select">
            <label htmlFor="category-select">Pendency Focus Category</label>
            <select
              id="category-select"
              value={pendencyCategory}
              onChange={(e) => {
                setPendencyCategory(e.target.value);
                setPage(1);
              }}
              className="filter-select operational-focus-theme"
            >
              <option value="all">
                Display General Master Records Overview
              </option>
              <option value="target_no_center">
                1. Target Allotted (TC Not Created Yet)
              </option>
              <option value="center_no_media">
                2. TC Created (Missing Geo-Tagged Media)
              </option>
              <option value="center_with_media">
                3. TC Created (Geo-Tagged Media Uploaded Successfully)
              </option>
            </select>
          </div>

          {/* Regional District Boundary Dropdown */}
          <div className="filter-group">
            <label htmlFor="district-select">District Filter</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Regions / Districts</option>
              {uniqueDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {(pendencyCategory !== "all" || selectedDistrict) && (
            <button
              className="clear-btn"
              onClick={() => {
                setPendencyCategory("all");
                setSelectedDistrict("");
                setPage(1);
              }}
            >
              Reset Dashboard Filters
            </button>
          )}
        </div>

        {/* --- Interactive Graphics Canvas Card Wrapper --- */}
        <div className="chart-card">
          <h3>Programmatic Visual Analysis Flow</h3>
          <div className="chart-inner-boundary">
            {filteredData.length > 0 ? (
              <Bar data={chartConfigData} options={chartOptions} />
            ) : (
              <div className="chart-empty-message">
                No records fell inside this current filtering slice to render
                visual graph scales.
              </div>
            )}
          </div>
        </div>

        {/* Data Collection Grid Table Sheet */}
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Sl. No.</th>
                <th>Training Partner Name</th>
                <th>District Domain</th>
                <th className="num-col">Allocated Target</th>
                <th style={{ textAlign: "center" }}>TC Creation State</th>
                <th style={{ textAlign: "center" }}>Geo-Media State</th>
                <th className="num-col">Uploaded Assets</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const serialIndexNumber =
                    (page - 1) * rowsPerPage + index + 1;
                  return (
                    <tr key={row.id}>
                      <td>{serialIndexNumber}</td>
                      <td>
                        <strong>{row.partnerName}</strong>
                      </td>
                      <td>{row.district}</td>
                      <td className="num-col text-slate-700">
                        {row.allocatedTarget}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`badge ${row.centerCreated ? "state-green" : "state-red"}`}
                        >
                          {row.centerCreated ? "Created" : "Pending Center"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`badge ${row.geoMediaUploaded ? "state-green" : "state-amber"}`}
                        >
                          {row.geoMediaUploaded
                            ? "Media Live"
                            : "Pending Upload"}
                        </span>
                      </td>
                      <td
                        className={`num-col font-bold ${row.uploadCount > 0 ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {row.uploadCount} units
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No training centers or partner target listings matched your
                    specified parameters matrix.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right-label">
                    Dynamic Aggregated Summaries:
                  </td>
                  <td className="num-col summary-sum-highlight">
                    {summaryAggregations.totalAllocatedTarget}
                  </td>
                  <td style={{ textAlign: "center", color: "#475569" }}>
                    Active TCs: {summaryAggregations.totalCentersCreated}
                  </td>
                  <td></td>
                  <td className="num-col summary-sum-highlight text-emerald-600">
                    {summaryAggregations.totalMediaUploadCount} items
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Table Control Pagination Integration */}
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={filteredData.length}
        />
      </div>

      <style>{`
                .report-container {
                    padding: 32px;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .report-header h2 {
                    font-size: 24px;
                    color: #0f172a;
                    margin: 0 0 6px 0;
                    font-weight: 700;
                }
                .report-header p {
                    color: #64748b;
                    margin: 0 0 28px 0;
                    font-size: 14px;
                }
                .filter-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    align-items: flex-end;
                    gap: 16px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    flex-wrap: wrap;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    min-width: 200px;
                    flex: 1;
                }
                .unique-broad-select {
                    min-width: 380px !important;
                    flex: 2;
                }
                .filter-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                }
                .filter-select {
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 1px solid #cbd5e1;
                    background-color: #ffffff;
                    font-size: 14px;
                    color: #1e293b;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .operational-focus-theme {
                    font-weight: 500;
                    border-color: #cbd5e1;
                }
                .filter-select:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
                }
                .clear-btn {
                    padding: 10px 16px;
                    background: transparent;
                    border: 1px dashed #cbd5e1;
                    color: #64748b;
                    font-weight: 500;
                    font-size: 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    height: 41px;
                    transition: all 0.2s ease;
                }
                .clear-btn:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                    border-color: #94a3b8;
                }

                /* Visual Graphic Interface Elements Styling */
                .chart-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .chart-card h3 {
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    color: #1e293b;
                    font-weight: 600;
                }
                .chart-inner-boundary {
                    position: relative;
                    height: 320px;
                    width: 100%;
                }
                .chart-empty-message {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #94a3b8;
                    font-size: 14px;
                }

                .table-wrapper {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    margin-bottom: 24px;
                }
                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    font-size: 14px;
                }
                .report-table th {
                    background: #f1f5f9;
                    color: #475569;
                    font-weight: 600;
                    padding: 14px 20px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .report-table td {
                    padding: 14px 20px;
                    color: #334155;
                    border-bottom: 1px solid #f1f5f9;
                }
                .report-table tbody tr:hover {
                    background-color: #f8fafc;
                }
                
                /* State Badges */
                .badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .state-green {
                    background: #dcfce7;
                    color: #166534;
                }
                .state-amber {
                    background: #fef9c3;
                    color: #854d0e;
                }
                .state-red {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .num-col {
                    text-align: right;
                }
                .text-slate-700 {
                    color: #334155;
                }
                .text-emerald-600 {
                    color: #059669;
                }
                .text-slate-400 {
                    color: #94a3b8;
                }
                .text-right-label {
                    text-align: right;
                    font-weight: 600;
                    color: #475569;
                }
                .font-bold {
                    font-weight: 700;
                }
                .empty-state {
                    text-align: center;
                    padding: 48px !important;
                    color: #94a3b8;
                    font-size: 14px;
                }
                .report-table tfoot tr {
                    background: #f8fafc;
                    border-top: 2px solid #e2e8f0;
                }
                .report-table tfoot td {
                    padding: 16px 20px;
                    color: #0f172a;
                    font-weight: 700;
                }
                .summary-sum-highlight {
                    font-size: 15px;
                    color: #1e3a8a !important;
                }
            `}</style>
    </>
  );
};

export default TrainingCenterPendencyPage;
