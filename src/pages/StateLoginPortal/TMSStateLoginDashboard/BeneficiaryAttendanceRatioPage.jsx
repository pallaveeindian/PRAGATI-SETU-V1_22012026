//  src/pages/StateLoginPortal/TMSStateLoginDashboard/BeneficiaryAttendanceRatioPage.jsx
import React, { useState, useMemo } from "react";
import TablePagination from "../CommonUiComp/TablePagination";

// Core Chart.js configuration modules for metrics visualization
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// High-fidelity structured Mock Data matching programmatic attendance parameters
const ATTENDANCE_MOCK_DATA = [
  {
    id: 1,
    district: "Patna",
    block: "Phulwari Sharif",
    totalBeneficiaries: 120,
    eligibleDays: 30,
    totalDaysAttended: 28,
    attendanceRatio: 93.3,
  },
  {
    id: 2,
    district: "Patna",
    block: "Sampatchak",
    totalBeneficiaries: 95,
    eligibleDays: 30,
    totalDaysAttended: 22,
    attendanceRatio: 73.3,
  }, // Below 80%
  {
    id: 3,
    district: "Gaya",
    block: "Bodhgaya",
    totalBeneficiaries: 150,
    eligibleDays: 26,
    totalDaysAttended: 24,
    attendanceRatio: 92.3,
  },
  {
    id: 4,
    district: "Gaya",
    block: "Sherghati",
    totalBeneficiaries: 110,
    eligibleDays: 26,
    totalDaysAttended: 19,
    attendanceRatio: 73.1,
  }, // Below 80%
  {
    id: 5,
    district: "Muzaffarpur",
    block: "Mushahari",
    totalBeneficiaries: 140,
    eligibleDays: 28,
    totalDaysAttended: 25,
    attendanceRatio: 89.3,
  },
  {
    id: 6,
    district: "Muzaffarpur",
    block: "Kanti",
    totalBeneficiaries: 130,
    eligibleDays: 28,
    totalDaysAttended: 21,
    attendanceRatio: 75.0,
  }, // Below 80%
  {
    id: 7,
    district: "Bhagalpur",
    block: "Jagdishpur",
    totalBeneficiaries: 105,
    eligibleDays: 30,
    totalDaysAttended: 26,
    attendanceRatio: 85.7,
  },
];

const BeneficiaryAttendanceRatioPage = () => {
  // --- Dynamic Regional Filters States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [ratioThreshold, setRatioThreshold] = useState("all"); // 'all', 'above_80', 'below_80'

  // --- Tabular Pagination Navigation ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ==========================================
  // CASCADING DRILLDOWN LOGIC
  // ==========================================
  const uniqueDistricts = useMemo(() => {
    return [...new Set(ATTENDANCE_MOCK_DATA.map((item) => item.district))];
  }, []);

  const availableBlocks = useMemo(() => {
    if (!selectedDistrict) return [];
    const filtered = ATTENDANCE_MOCK_DATA.filter(
      (item) => item.district === selectedDistrict,
    );
    return [...new Set(filtered.map((item) => item.block))];
  }, [selectedDistrict]);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedBlock(""); // Wipe lower block levels on change
    setPage(1);
  };

  // ==========================================
  // DATA MATRIX SEGMENTATION RULES INTERACTION
  // ==========================================
  const filteredData = useMemo(() => {
    return ATTENDANCE_MOCK_DATA.filter((item) => {
      const matchesDistrict = selectedDistrict
        ? item.district === selectedDistrict
        : true;
      const matchesBlock = selectedBlock ? item.block === selectedBlock : true;

      // Threshold categorization rules evaluated directly inline
      let matchesThreshold = true;
      if (ratioThreshold === "above_80") {
        matchesThreshold = item.attendanceRatio >= 80.0;
      } else if (ratioThreshold === "below_80") {
        matchesThreshold = item.attendanceRatio < 80.0;
      }

      return matchesDistrict && matchesBlock && matchesThreshold;
    });
  }, [selectedDistrict, selectedBlock, ratioThreshold]);

  // Calculate aggregated overall average ratio
  const overallAggregates = useMemo(() => {
    if (filteredData.length === 0) return { totalBens: 0, avgRatio: "0.0" };
    const totalBens = filteredData.reduce(
      (acc, curr) => acc + curr.totalBeneficiaries,
      0,
    );
    const sumRatios = filteredData.reduce(
      (acc, curr) => acc + curr.attendanceRatio,
      0,
    );
    const avgRatio = (sumRatios / filteredData.length).toFixed(1);
    return { totalBens, avgRatio };
  }, [filteredData]);

  // ==========================================
  // GRAPH COORDINATE ASSIGNMENTS PIPELINE
  // ==========================================
  const chartConfigData = useMemo(() => {
    const labels = filteredData.map((item) => item.block);
    const ratios = filteredData.map((item) => item.attendanceRatio);

    // Dynamically assign warning colors to chart bar nodes based on performance
    const backgroundColors = filteredData.map((item) =>
      item.attendanceRatio >= 80.0
        ? "rgba(16, 185, 129, 0.8)"
        : "rgba(239, 68, 68, 0.8)",
    );

    return {
      labels,
      datasets: [
        {
          label: "Attendance Ratio (%)",
          data: ratios,
          backgroundColor: backgroundColors,
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    };
  }, [filteredData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Ratio: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b", callback: (val) => `${val}%` },
      },
    },
  };

  // ==========================================
  // PAGINATION MATRICES
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
            Track local attendance trends, evaluate compliance baselines, and
            isolate blocks dropping below the required 80% mark.
          </p>
        </div>

        {/* Filter Matrix Configuration Sheet */}
        <div className="filter-card">
          {/* District Dropdown */}
          <div className="filter-group">
            <label htmlFor="district-select">District Scope</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="filter-select"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Block Dropdown */}
          <div className="filter-group">
            <label htmlFor="block-select">Block Boundary</label>
            <select
              id="block-select"
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              disabled={!selectedDistrict}
            >
              <option value="">All Blocks</option>
              {availableBlocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Specialized 80% Conditional Ratio Filter */}
          <div className="filter-group broad-conditional-select">
            <label htmlFor="threshold-select">
              Attendance Threshold Matrix
            </label>
            <select
              id="threshold-select"
              value={ratioThreshold}
              onChange={(e) => {
                setRatioThreshold(e.target.value);
                setPage(1);
              }}
              className="filter-select ratio-focus-indicator"
            >
              <option value="all">Show All Attendance Values</option>
              <option value="above_80">
                Satisfactory Levels (80% & Above)
              </option>
              <option value="below_80">Attention Required (Below 80%)</option>
            </select>
          </div>

          {(selectedDistrict || selectedBlock || ratioThreshold !== "all") && (
            <button
              className="clear-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedBlock("");
                setRatioThreshold("all");
                setPage(1);
              }}
            >
              Reset Portal Filters
            </button>
          )}
        </div>

        {/* --- Chart Graphic Data Analytics Visualization Container --- */}
        <div className="chart-card">
          <div className="chart-title-legend-block">
            <h3>Attendance Ratio Comparison Plot</h3>
            <div className="legend-pills-row">
              <span className="legend-dot dot-green">80% & Above</span>
              <span className="legend-dot dot-red">Below 80%</span>
            </div>
          </div>
          <div className="chart-inner-boundary">
            {filteredData.length > 0 ? (
              <Bar data={chartConfigData} options={chartOptions} />
            ) : (
              <div className="chart-empty-message">
                No matching variables found to re-draw chart plots.
              </div>
            )}
          </div>
        </div>

        {/* Core Visual Tabular Grid */}
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: "85px" }}>Sl. No.</th>
                <th>District</th>
                <th>Block Area</th>
                <th className="num-col">Total Beneficiaries</th>
                <th className="num-col">Total Mandays Allotted</th>
                <th className="num-col">Mandays Attended</th>
                <th className="num-col" style={{ width: "200px" }}>
                  Net Attendance Ratio
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const serialNumber = (page - 1) * rowsPerPage + index + 1;
                  const isSubStandard = row.attendanceRatio < 80.0;

                  return (
                    <tr
                      key={row.id}
                      className={isSubStandard ? "under-performing-row" : ""}
                    >
                      <td>{serialNumber}</td>
                      <td>
                        <strong>{row.district}</strong>
                      </td>
                      <td>{row.block}</td>
                      <td className="num-col text-slate-600">
                        {row.totalBeneficiaries}
                      </td>
                      <td className="num-col text-slate-600">
                        {row.eligibleDays} days
                      </td>
                      <td className="num-col text-slate-700">
                        {row.totalDaysAttended} days
                      </td>
                      <td className="num-col">
                        <div className="ratio-badge-flex-alignment">
                          <span
                            className={`ratio-pill ${isSubStandard ? "pill-danger" : "pill-success"}`}
                          >
                            {row.attendanceRatio}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No tracking metrics match your selected eligibility
                    parameters combination.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right-label">
                    Dynamic Aggregate Metrics:
                  </td>
                  <td className="num-col final-sum-text">
                    {overallAggregates.totalBens} users
                  </td>
                  <td colSpan="2"></td>
                  <td className="num-col final-sum-text text-blue-600">
                    Mean: {overallAggregates.avgRatio}%
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Standard Reusable Pagination Component Integration */}
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
                    min-width: 180px;
                    flex: 1;
                }
                .broad-conditional-select {
                    min-width: 280px !important;
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
                }
                .filter-select:focus {
                    border-color: #2563eb;
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

                /* Analytics Visual Containers styles */
                .chart-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .chart-title-legend-block {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .chart-card h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #1e293b;
                    font-weight: 600;
                }
                .legend-pills-row {
                    display: flex;
                    gap: 16px;
                }
                .legend-dot {
                    font-size: 12px;
                    font-weight: 500;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .legend-dot::before {
                    content: "";
                    width: 12px;
                    height: 12px;
                    border-radius: 3px;
                    display: inline-block;
                }
                .dot-green::before { background: rgba(16, 185, 129, 0.8); }
                .dot-red::before { background: rgba(239, 68, 68, 0.8); }

                .chart-inner-boundary {
                    position: relative;
                    height: 260px;
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

                /* Conditional Row Background Indicators */
                .under-performing-row {
                    background-color: #fffafb;
                }
                .under-performing-row:hover {
                    background-color: #fff1f2 !important;
                }

                .ratio-badge-flex-alignment {
                    display: flex;
                    justify-content: flex-end;
                }
                .ratio-pill {
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 700;
                    text-align: right;
                }
                .pill-success {
                    background: #dcfce7;
                    color: #166534;
                }
                .pill-danger {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .num-col { text-align: right; }
                .text-slate-600 { color: #475569; }
                .text-slate-700 { color: #334155; }
                .text-right-label {
                    text-align: right;
                    font-weight: 600;
                    color: #475569;
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
                .final-sum-text {
                    font-size: 15px;
                    color: #0f172a !important;
                }
                .text-blue-600 {
                    color: #2563eb !important;
                }
            `}</style>
    </>
  );
};

export default BeneficiaryAttendanceRatioPage;
