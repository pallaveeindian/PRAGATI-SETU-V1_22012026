// src/pages/StateLoginPortal/TMSStateLoginDashboard/BatchProgressDashboard.jsx
import React, { useState, useMemo } from "react";
import TablePagination from "../CommonUiComp/TablePagination";

// Core Chart.js configuration modules
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

// High-fidelity Mock dataset aligned with your official workflow status criteria
const BATCH_MOCK_DATA = [
  {
    id: 1,
    batchCode: "B-PAT-2026-004",
    district: "Patna",
    block: "Phulwari Sharif",
    scheme: "DDU-GKY",
    currentStatus: "BATCHING",
    totalTrainees: 30,
    windowExpiryDate: "2026-03-15",
  }, // Overdue Expiry Exception
  {
    id: 2,
    batchCode: "B-PAT-2026-009",
    district: "Patna",
    block: "Sampatchak",
    scheme: "SVEP",
    currentStatus: "COMPLETED",
    totalTrainees: 25,
    windowExpiryDate: "2026-05-01",
  },
  {
    id: 3,
    batchCode: "B-GAY-2026-012",
    district: "Gaya",
    block: "Bodhgaya",
    scheme: "DDU-GKY",
    currentStatus: "REVIEW",
    totalTrainees: 28,
    windowExpiryDate: "2026-02-10",
  }, // Overdue Expiry Exception
  {
    id: 4,
    batchCode: "B-GAY-2026-088",
    district: "Gaya",
    block: "Sherghati",
    scheme: "NRLM",
    currentStatus: "ONGOING",
    totalTrainees: 35,
    windowExpiryDate: "2026-08-30",
  },
  {
    id: 5,
    batchCode: "B-MUZ-2026-031",
    district: "Muzaffarpur",
    block: "Mushahari",
    scheme: "MKSP",
    currentStatus: "PENDING",
    totalTrainees: 20,
    windowExpiryDate: "2026-04-05",
  }, // Overdue Expiry Exception
  {
    id: 6,
    batchCode: "B-MUZ-2026-077",
    district: "Muzaffarpur",
    block: "Kanti",
    scheme: "SVEP",
    currentStatus: "REJECTED",
    totalTrainees: 32,
    windowExpiryDate: "2026-05-20",
  },
];

const BatchProgressDashboard = () => {
  // --- Cascading Structural Filter States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // --- Tabular Pagination Local States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Dynamic current tracking baseline matching the context calendar era
  const SIMULATED_TODAY = useMemo(() => new Date("2026-06-18"), []);

  // ==========================================
  // CASCADING REGIONAL CONFIGURATIONS
  // ==========================================
  const uniqueDistricts = useMemo(() => {
    return [...new Set(BATCH_MOCK_DATA.map((item) => item.district))];
  }, []);

  const availableBlocks = useMemo(() => {
    if (!selectedDistrict) return [];
    const filtered = BATCH_MOCK_DATA.filter(
      (item) => item.district === selectedDistrict,
    );
    return [...new Set(filtered.map((item) => item.block))];
  }, [selectedDistrict]);

  // Explicit Status Flow derived from your image selection criteria
  const uniqueStatuses = [
    "BATCHING",
    "PENDING",
    "ONGOING",
    "REVIEW",
    "COMPLETED",
    "REJECTED",
  ];

  // Reset Child downstream states when top-level district undergoes updates
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedBlock("");
    setPage(1);
  };

  // ==========================================
  // EXCEPTION SORTING & DATA EVALUATION LAYER
  // ==========================================
  const processedAndSortedBatches = useMemo(() => {
    // 1. Initial Filtering Operation Pass
    const filtered = BATCH_MOCK_DATA.filter((item) => {
      const matchesDistrict = selectedDistrict
        ? item.district === selectedDistrict
        : true;
      const matchesBlock = selectedBlock ? item.block === selectedBlock : true;
      const matchesStatus = selectedStatus
        ? item.currentStatus === selectedStatus
        : true;
      return matchesDistrict && matchesBlock && matchesStatus;
    });

    // 2. Determine structural expiration exceptions and map flag elements inline
    const markedBatches = filtered.map((batch) => {
      const expiry = new Date(batch.windowExpiryDate);
      // Exception Test: Expiry timeline window has passed but state is still not completely finalized
      const isExpiredAndPending =
        expiry < SIMULATED_TODAY &&
        batch.currentStatus !== "COMPLETED" &&
        batch.currentStatus !== "REJECTED";

      return {
        ...batch,
        isOverdueException: isExpiredAndPending,
      };
    });

    // 3. Force sorting rank prioritization pass: items with `isOverdueException` move to index top
    return markedBatches.sort((a, b) => {
      if (a.isOverdueException && !b.isOverdueException) return -1;
      if (!a.isOverdueException && b.isOverdueException) return 1;
      // Fallback chronological arrangement for balanced layout symmetry
      return new Date(a.windowExpiryDate) - new Date(b.windowExpiryDate);
    });
  }, [selectedDistrict, selectedBlock, selectedStatus, SIMULATED_TODAY]);

  // ==========================================
  // CHART ANALYTICS AGGREGATIONS
  // ==========================================
  const chartConfigData = useMemo(() => {
    const countsMap = {
      BATCHING: 0,
      PENDING: 0,
      ONGOING: 0,
      REVIEW: 0,
      COMPLETED: 0,
      REJECTED: 0,
    };
    processedAndSortedBatches.forEach((batch) => {
      if (countsMap[batch.currentStatus] !== undefined) {
        countsMap[batch.currentStatus] += 1;
      }
    });

    return {
      labels: Object.keys(countsMap),
      datasets: [
        {
          label: "Active Batches Volume",
          data: Object.values(countsMap),
          backgroundColor: [
            "rgba(37, 99, 235, 0.85)", // BATCHING: Corporate Blue
            "rgba(100, 116, 139, 0.85)", // PENDING: Muted Slate
            "rgba(245, 158, 11, 0.85)", // ONGOING: Vibrant Amber
            "rgba(168, 85, 247, 0.85)", // REVIEW: Purple
            "rgba(16, 185, 129, 0.85)", // COMPLETED: Success Emerald
            "rgba(239, 68, 68, 0.85)", // REJECTED: Alarming Red
          ],
          borderRadius: 6,
          barThickness: 35,
        },
      ],
    };
  }, [processedAndSortedBatches]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b", stepSize: 1 },
      },
    },
  };

  // ==========================================
  // STANDARD PAGE FRACTION COMPUTATION
  // ==========================================
  const totalPages = useMemo(() => {
    const pages = Math.ceil(processedAndSortedBatches.length / rowsPerPage);
    return pages === 0 ? 1 : pages;
  }, [processedAndSortedBatches.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return processedAndSortedBatches.slice(
      startIndex,
      startIndex + rowsPerPage,
    );
  }, [processedAndSortedBatches, page, rowsPerPage]);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p>
            Track live execution tracks, status lifecycle shifts, and critical
            window expiration exceptions.
          </p>
        </div>

        {/* Filter Matrix Controls Core Card */}
        <div className="filter-card">
          {/* District Dropdown Selector */}
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

          {/* Dependent Block Cascading Selector */}
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

          {/* Batch Lifecycle Status Dropdown */}
          <div className="filter-group">
            <label htmlFor="status-select">Current Execution Status</label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Status Layers</option>
              {uniqueStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {(selectedDistrict || selectedBlock || selectedStatus) && (
            <button
              className="clear-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedBlock("");
                setSelectedStatus("");
                setPage(1);
              }}
            >
              Reset Parameter Matrix
            </button>
          )}
        </div>

        {/* --- Chart Graphic Presentation Section --- */}
        <div className="chart-card">
          <h3>Volume Distribution by Workflow Tracking Phase</h3>
          <div className="chart-inner-envelope">
            {processedAndSortedBatches.length > 0 ? (
              <Bar data={chartConfigData} options={chartOptions} />
            ) : (
              <div className="chart-fallback-empty">
                No active items match to compile chart plot coordinates.
              </div>
            )}
          </div>
        </div>

        {/* Main Process Grid Table Framework */}
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Sl. No.</th>
                <th>Batch Code Reference</th>
                <th>Regional Center Domain</th>
                <th>Scheme Group</th>
                <th style={{ textAlign: "center" }}>Current Status</th>
                <th>Window Expiry Date</th>
                <th className="num-col">Trainee Count</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const serialNumber = (page - 1) * rowsPerPage + index + 1;

                  return (
                    <tr
                      key={row.id}
                      className={
                        row.isOverdueException ? "exception-overdue-row" : ""
                      }
                    >
                      <td>
                        {row.isOverdueException ? (
                          <span
                            className="warning-indicator-pill"
                            title="Critical Exception Rule: Training window has expired but batch remains unclosed. Action required."
                          >
                            ! Overdue
                          </span>
                        ) : (
                          serialNumber
                        )}
                      </td>
                      <td>
                        <strong>{row.batchCode}</strong>
                      </td>
                      <td>
                        <div className="geo-text-block">
                          <span>{row.block}</span>
                          <small>{row.district}</small>
                        </div>
                      </td>
                      <td>
                        <span className="scheme-tag">{row.scheme}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`status-badge-node stage-${row.currentStatus.toLowerCase()}`}
                        >
                          {row.currentStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            row.isOverdueException
                              ? "expiry-date-alert-text"
                              : "expiry-date-normal"
                          }
                        >
                          {row.windowExpiryDate}
                        </span>
                      </td>
                      <td className="num-col font-bold">
                        {row.totalTrainees} slots
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No active operational batches match your current filter
                    query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Retained Standard Pagination Engine Module */}
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={processedAndSortedBatches.length}
        />
      </div>

      <style>{`
                .dashboard-container {
                    padding: 32px;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .dashboard-header h2 {
                    font-size: 24px;
                    color: #0f172a;
                    margin: 0 0 6px 0;
                    font-weight: 700;
                }
                .dashboard-header p {
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
                .filter-select:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
                }
                .filter-select:disabled {
                    background-color: #f1f5f9;
                    color: #94a3b8;
                    cursor: not-allowed;
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

                /* Analytics Graphic Elements */
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
                .chart-inner-envelope {
                    position: relative;
                    height: 240px;
                    width: 100%;
                }
                .chart-fallback-empty {
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

                /* Exception Row Overrides styling features */
                .exception-overdue-row {
                    background-color: #fffafb !important;
                    border-left: 4px solid #ef4444;
                }
                .exception-overdue-row:hover {
                    background-color: #fff1f2 !important;
                }
                .warning-indicator-pill {
                    display: inline-block;
                    background: #fee2e2;
                    color: #991b1b;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 6px;
                    border: 1px solid #fca5a5;
                    white-space: nowrap;
                }
                .expiry-date-alert-text {
                    color: #dc2626;
                    font-weight: 600;
                }
                .expiry-date-normal {
                    color: #4b5563;
                }

                .geo-text-block {
                    display: flex;
                    flex-direction: column;
                }
                .geo-text-block small {
                    font-size: 11px;
                    color: #64748b;
                    margin-top: 2px;
                }
                .scheme-tag {
                    background: #f1f5f9;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 13px;
                    color: #475569;
                    font-weight: 500;
                }

                /* Custom Status Node Badges aligned with Image specifications */
                .status-badge-node {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .stage-batching { background: #e0f2fe; color: #0369a1; }
                .stage-pending { background: #f1f5f9; color: #475569; }
                .stage-ongoing { background: #fef3c7; color: #b45309; }
                .stage-review { background: #fae8ff; color: #6b21a8; }
                .stage-completed { background: #dcfce7; color: #166534; }
                .stage-rejected { background: #fee2e2; color: #991b1b; }

                .num-col { text-align: right; }
                .font-bold { font-weight: 700; }
                .empty-state {
                    text-align: center;
                    padding: 48px !important;
                    color: #94a3b8;
                    font-size: 14px;
                }
            `}</style>
    </>
  );
};

export default BatchProgressDashboard;
