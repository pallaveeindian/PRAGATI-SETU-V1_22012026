// src/pages/StateLoginPortal/TMSStateLoginDashboard/DmmuCertificatePendency.jsx
import React, { useState, useMemo } from "react";
import TablePagination from "../CommonUiComp/TablePagination";

// Core Chart.js configuration modules for visualization
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

// High-fidelity Mock dataset structured for DMMU Certificate Pendencies
const CERTIFICATE_MOCK_DATA = [
  {
    id: 1,
    dmmuDistrict: "Patna",
    totalBatchesCompleted: 45,
    certificatesUploaded: 12,
    pendingCertificates: 33,
    lastCompletionDate: "2026-05-10",
  },
  {
    id: 2,
    dmmuDistrict: "Gaya",
    totalBatchesCompleted: 38,
    certificatesUploaded: 35,
    pendingCertificates: 3,
    lastCompletionDate: "2026-06-01",
  },
  {
    id: 3,
    dmmuDistrict: "Muzaffarpur",
    totalBatchesCompleted: 50,
    certificatesUploaded: 10,
    pendingCertificates: 40,
    lastCompletionDate: "2026-04-18",
  },
  {
    id: 4,
    dmmuDistrict: "Bhagalpur",
    totalBatchesCompleted: 28,
    certificatesUploaded: 28,
    pendingCertificates: 0,
    lastCompletionDate: "2026-05-25",
  },
  {
    id: 5,
    dmmuDistrict: "Darbhanga",
    totalBatchesCompleted: 32,
    certificatesUploaded: 5,
    pendingCertificates: 27,
    lastCompletionDate: "2026-03-12",
  },
  {
    id: 6,
    dmmuDistrict: "Purnia",
    totalBatchesCompleted: 22,
    certificatesUploaded: 20,
    pendingCertificates: 2,
    lastCompletionDate: "2026-05-30",
  },
  {
    id: 7,
    dmmuDistrict: "Saran",
    totalBatchesCompleted: 19,
    certificatesUploaded: 0,
    pendingCertificates: 19,
    lastCompletionDate: "2026-02-24",
  },
];

const DmmuCertificatePendency = () => {
  // --- Operational States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [hideClearDistricts, setHideClearDistricts] = useState(false);

  // --- Tabular Pagination States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Baseline threshold date matching our current calendar era (June 2026)
  // Any DMMU with pending uploads older than 45 days gets flagged as a critical warning
  const CRITICAL_DATE_LINE = useMemo(() => new Date("2026-05-04"), []);

  // Extract unique districts for dropdown filter selection
  const uniqueDistricts = useMemo(() => {
    return [...new Set(CERTIFICATE_MOCK_DATA.map((item) => item.dmmuDistrict))];
  }, []);

  // ==========================================
  // DATA PROCESSSING & EXCEPTION SORTING MATRIX
  // ==========================================
  const processedAndFilteredData = useMemo(() => {
    const filtered = CERTIFICATE_MOCK_DATA.filter((item) => {
      const matchesDistrict = selectedDistrict
        ? item.dmmuDistrict === selectedDistrict
        : true;
      const matchesPendencyOnly = hideClearDistricts
        ? item.pendingCertificates > 0
        : true;
      return matchesDistrict && matchesPendencyOnly;
    });

    // Map operational exception metrics inline
    const mappedData = filtered.map((item) => {
      const lastDate = new Date(item.lastCompletionDate);
      // Critical Exception condition: Has high pendency and oldest date is over 45 days behind current scale
      const isSeverelyOverdue =
        item.pendingCertificates > 15 && lastDate < CRITICAL_DATE_LINE;

      return {
        ...item,
        isCriticalPendency: isSeverelyOverdue,
      };
    });

    // High priority sorting rank: Push districts with critical backlogs to the top
    return mappedData.sort((a, b) => {
      if (a.isCriticalPendency && !b.isCriticalPendency) return -1;
      if (!a.isCriticalPendency && b.isCriticalPendency) return 1;
      return b.pendingCertificates - a.pendingCertificates; // Secondary sort by total quantity
    });
  }, [selectedDistrict, hideClearDistricts, CRITICAL_DATE_LINE]);

  // ==========================================
  // TOTAL METRICS SUMMATION REDUCTIONS
  // ==========================================
  const dynamicTotals = useMemo(() => {
    return processedAndFilteredData.reduce(
      (acc, curr) => {
        acc.batches += curr.totalBatchesCompleted;
        acc.uploaded += curr.certificatesUploaded;
        acc.pending += curr.pendingCertificates;
        return acc;
      },
      { batches: 0, uploaded: 0, pending: 0 },
    );
  }, [processedAndFilteredData]);

  // ==========================================
  // CHART ANALYTICS LIFECYCLE HOOK
  // ==========================================
  const chartConfigData = useMemo(() => {
    const labels = processedAndFilteredData.map((item) => item.dmmuDistrict);
    const uploadedData = processedAndFilteredData.map(
      (item) => item.certificatesUploaded,
    );
    const pendingData = processedAndFilteredData.map(
      (item) => item.pendingCertificates,
    );

    return {
      labels,
      datasets: [
        {
          label: "Certificates Uploaded",
          data: uploadedData,
          backgroundColor: "rgba(16, 185, 129, 0.85)", // Success Green
          borderRadius: 4,
        },
        {
          label: "Pending Verification",
          data: pendingData,
          backgroundColor: "rgba(239, 68, 68, 0.85)", // Alert Crimson
          borderRadius: 4,
        },
      ],
    };
  }, [processedAndFilteredData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          color: "#475569",
          font: { size: 12, weight: "500" },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        stacked: true,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b" },
      },
    },
  };

  // ==========================================
  // PAGINATION SLICING FRAME
  // ==========================================
  const totalPages = useMemo(() => {
    const pages = Math.ceil(processedAndFilteredData.length / rowsPerPage);
    return pages === 0 ? 1 : pages;
  }, [processedAndFilteredData.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return processedAndFilteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedAndFilteredData, page, rowsPerPage]);

  return (
    <>
      <div className="report-container">
        <div className="report-header">
          <p>
            Identify, evaluate, and audit District Mission Management Units
            lagging on closed batch certification uploads.
          </p>
        </div>

        {/* Filters Row Component */}
        <div className="filter-card">
          {/* District Dropdown Selector */}
          <div className="filter-group">
            <label htmlFor="district-select">Filter by DMMU District</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Boolean Exception Checkbox toggle */}
          <div className="filter-group checkbox-group-wrapper">
            <label className="checkbox-container-label">
              <input
                type="checkbox"
                checked={hideClearDistricts}
                onChange={(e) => {
                  setHideClearDistricts(e.target.checked);
                  setPage(1);
                }}
                className="styled-checkbox-node"
              />
              Hide Completely Clear DMMUs
            </label>
          </div>

          {(selectedDistrict || hideClearDistricts) && (
            <button
              className="clear-btn"
              onClick={() => {
                setSelectedDistrict("");
                setHideClearDistricts(false);
                setPage(1);
              }}
            >
              Clear View Filters
            </button>
          )}
        </div>

        {/* --- Chart Graphic Card Block --- */}
        <div className="chart-card">
          <h3>Certificate Backlog Breakdown per DMMU Node</h3>
          <div className="chart-inner-boundary">
            {processedAndFilteredData.length > 0 ? (
              <Bar data={chartConfigData} options={chartOptions} />
            ) : (
              <div className="chart-empty-placeholder">
                No active metrics found to plot coordinates.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Data Grid Table */}
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: "95px" }}>Rank Rank</th>
                <th>DMMU District Title</th>
                <th className="num-col">Total Completed Batches</th>
                <th className="num-col">Certificates Uploaded</th>
                <th className="num-col">Pending Backlog</th>
                <th>Oldest Uncertified Batch Date</th>
                <th style={{ textAlign: "center" }}>Performance Track</th>
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
                        row.isCriticalPendency ? "critical-alert-row" : ""
                      }
                    >
                      <td>
                        {row.isCriticalPendency ? (
                          <span
                            className="overdue-tag-node"
                            title="Critical Backlog: Oldest batch completion predates 45 days with significant pending units."
                          >
                            ⚠️ High Risk
                          </span>
                        ) : (
                          serialNumber
                        )}
                      </td>
                      <td>
                        <strong>{row.dmmuDistrict} DMMU</strong>
                      </td>
                      <td className="num-col text-slate-600">
                        {row.totalBatchesCompleted}
                      </td>
                      <td className="num-col text-emerald-600 font-medium">
                        {row.certificatesUploaded}
                      </td>
                      <td
                        className={`num-col font-bold ${row.pendingCertificates > 0 ? "text-rose-600" : "text-slate-400"}`}
                      >
                        {row.pendingCertificates} batches
                      </td>
                      <td>
                        <span
                          className={
                            row.isCriticalPendency
                              ? "date-highlight-warning"
                              : "date-neutral"
                          }
                        >
                          {row.lastCompletionDate}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div
                          className={`status-pill ${row.pendingCertificates === 0 ? "status-clean" : row.isCriticalPendency ? "status-severe" : "status-warning"}`}
                        >
                          {row.pendingCertificates === 0
                            ? "100% Uploaded"
                            : row.isCriticalPendency
                              ? "Action Required"
                              : "In Progress"}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No certification logs match your chosen query filters matrix
                    combination.
                  </td>
                </tr>
              )}
            </tbody>
            {processedAndFilteredData.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="2" className="text-right-label">
                    DMMU Aggregated Totals:
                  </td>
                  <td className="num-col summary-total-value">
                    {dynamicTotals.batches}
                  </td>
                  <td className="num-col summary-total-value text-emerald-600">
                    {dynamicTotals.uploaded}
                  </td>
                  <td className="num-col summary-total-value text-rose-600">
                    {dynamicTotals.pending} pending
                  </td>
                  <td colSpan="2"></td>
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
          totalRecords={processedAndFilteredData.length}
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
                    gap: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    flex-wrap: wrap;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    min-width: 220px;
                    justify-content: flex-end;
                }
                .checkbox-group-wrapper {
                    height: 41px;
                    justify-content: center;
                }
                .checkbox-container-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #334155;
                    cursor: pointer;
                    user-select: none;
                }
                .styled-checkbox-node {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                .filter-group label:not(.checkbox-container-label) {
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

                /* Analytics Visual Containers */
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
                    height: 280px;
                    width: 100%;
                }
                .chart-empty-placeholder {
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

                /* Critical Exception Backlog Rows styling overrides */
                .critical-alert-row {
                    background-color: #fffafb !important;
                    border-left: 4px solid #ef4444;
                }
                .critical-alert-row:hover {
                    background-color: #fff1f2 !important;
                }
                .overdue-tag-node {
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
                .date-highlight-warning {
                    color: #b91c1c;
                    font-weight: 600;
                }
                .date-neutral {
                    color: #4b5563;
                }

                /* Performance Track Status Pills */
                .status-pill {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .status-clean { background: #dcfce7; color: #15803d; }
                .status-warning { background: #fef3c7; color: #b45309; }
                .status-severe { background: #fee2e2; color: #b91c1c; }

                .num-col { text-align: right; }
                .text-slate-600 { color: #475569; }
                .text-emerald-600 { color: #059669; }
                .text-rose-600 { color: #dc2626; }
                .text-slate-400 { color: #94a3b8; }
                .text-right-label {
                    text-align: right;
                    font-weight: 600;
                    color: #475569;
                }
                .font-bold { font-weight: 700; }
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
                .summary-total-value {
                    font-size: 15px;
                    color: #0f172a !important;
                }
            `}</style>
    </>
  );
};

export default DmmuCertificatePendency;
