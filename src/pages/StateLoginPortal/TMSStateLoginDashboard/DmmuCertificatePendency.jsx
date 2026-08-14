import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import TableUI from "../CommonUiComp/TableUI";
import { FaDownload } from "react-icons/fa";
import api from "../../../api/axios";

import {
  FaCheck,
  FaDropbox,
  FaHourglass
} from "react-icons/fa";

export default function DmmuCertificatePendency({ financialYear }) {
  // --- Main Data State ---
  const [apiData, setApiData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // ==========================================
  // 1. DATA FETCHING & PROCESSING
  // ==========================================
  const fetchReportData = useCallback(async () => {
    if (!financialYear) return;

    setDataLoading(true);
    setApiData([]);
    setPage(1);

    try {
      const res = await api.get(`/tms/reports/certificate-pendency/`, {
        params: { financial_year: financialYear },
      });

      if (res.data?.status === "success") {
        const rawData = res.data.data || [];

        // Dynamic baseline: 45 days ago from today
        const criticalDateLine = new Date();
        criticalDateLine.setDate(criticalDateLine.getDate() - 45);

        // Process exceptions and statuses
        const processedData = rawData.map((item) => {
          let isCritical = false;
          if (item.pending_backlog > 0 && item.oldest_uncertified_batch_date) {
            const batchDate = new Date(item.oldest_uncertified_batch_date);
            if (batchDate < criticalDateLine) {
              isCritical = true;
            }
          }

          return {
            ...item,
            isCriticalPendency: isCritical,
          };
        });

        setApiData(processedData);
      }
    } catch (err) {
      console.error("Error fetching certificate pendency data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [financialYear]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ==========================================
  // 2. TOTAL METRICS AGGREGATION
  // ==========================================
  const dynamicTotals = useMemo(() => {
    return apiData.reduce(
      (acc, curr) => {
        acc.batches += curr.total_closed_batches || 0;
        acc.uploaded += curr.certificates_uploaded || 0;
        acc.pending += curr.pending_backlog || 0;
        return acc;
      },
      { batches: 0, uploaded: 0, pending: 0 },
    );
  }, [apiData]);

  // ==========================================
  // 3. TABLE COLUMNS SETUP
  // ==========================================
  const columns = [
    {
      header: "DMMU District Title",
      key: "district_name",
      render: (row) => (
        <span style={{ fontWeight: 800, color: "#0f172a" }}>
          DMMU_{row.district_name || "UNKNOWN"}
        </span>
      ),
    },
    {
      header: "Total Closed Batches",
      key: "total_closed_batches",
      render: (row) => (
        <div className="num-col" style={{ color: "#475569", fontWeight: 600 }}>
          {row.total_closed_batches}
        </div>
      ),
    },
    {
      header: "Certificates Uploaded",
      key: "certificates_uploaded",
      render: (row) => (
        <div className="num-col text-emerald-600 font-bold">
          {row.certificates_uploaded}
        </div>
      ),
    },
    {
      header: "Pending Backlog",
      key: "pending_backlog",
      render: (row) => (
        <div
          className={`num-col font-bold ${row.pending_backlog > 0 ? "text-rose-600" : "text-slate-400"}`}
        >
          {row.pending_backlog} batches
        </div>
      ),
    },
    {
      header: "Oldest Uncertified Batch Date",
      key: "oldest_uncertified_batch_date",
      render: (row) => (
        <span
          className={
            row.isCriticalPendency ? "date-highlight-warning" : "date-neutral"
          }
        >
          {row.oldest_uncertified_batch_date || "-"}
        </span>
      ),
    },
    {
      header: "Performance Track",
      key: "status", // Virtual key
      sortable: false,
      render: (row) => {
        if (row.pending_backlog === 0) {
          return (
            <div style={{ textAlign: "center" }}>
              <span className="status-pill status-clean">100% Uploaded</span>
            </div>
          );
        }
        if (row.isCriticalPendency) {
          return (
            <div style={{ textAlign: "center" }}>
              <span className="status-pill status-severe">Action Required</span>
            </div>
          );
        }
        return (
          <div style={{ textAlign: "center" }}>
            <span className="status-pill status-warning">Batches Pending</span>
          </div>
        );
      },
    },
  ];

  // ==========================================
  // 4. CSV EXPORT LOGIC
  // ==========================================
  const exportToCSV = () => {
    if (!apiData || apiData.length === 0) return;

    let csvContent =
      "S.No.,DMMU District,Total Closed Batches,Certificates Uploaded,Pending Backlog,Oldest Uncertified Date,Performance Track\n";

    apiData.forEach((row, i) => {
      let trackStatus = "Batches Pending";
      if (row.pending_backlog === 0) trackStatus = "100% Uploaded";
      else if (row.isCriticalPendency) trackStatus = "Action Required";

      csvContent += `"${i + 1}","DMMU_${row.district_name || "-"}","${row.total_closed_batches}","${row.certificates_uploaded}","${row.pending_backlog}","${row.oldest_uncertified_batch_date || "-"}","${trackStatus}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `DMMU_Certificate_Pendency_${financialYear}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // 5. PAGINATION SLICING
  // ==========================================
  const totalPages = Math.ceil(apiData.length / rowsPerPage) || 1;

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>DMMU Certificate Pendency Audit</h2>
        <p>
          Identify, evaluate, and audit District Mission Management Units
          lagging on closed batch certification uploads.
        </p>
      </div>

      {/* --- OVERALL STATS CARDS --- */}
      <div className="metrics-grid">
        <div className="metric-card gradient-blue">
          <div className="metric-icon"><FaDropbox /></div>
          <div className="metric-info">
            <span className="metric-label">Total Closed Batches</span>
            <span className="metric-value">
              {dynamicTotals.batches.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="metric-card gradient-green">
          <div className="metric-icon"><FaCheck /></div>
          <div className="metric-info">
            <span className="metric-label">Certificates Uploaded</span>
            <span className="metric-value">
              {dynamicTotals.uploaded.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="metric-card gradient-orange">
          <div className="metric-icon"><FaHourglass /></div>
          <div className="metric-info">
            <span className="metric-label">Pending Backlog</span>
            <span className="metric-value">
              {dynamicTotals.pending.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* --- TABLE HEADER & EXPORT --- */}
      <div className="table-header-flex">
        <h3>Pendency Registry</h3>
        <button
          className="export-btn"
          onClick={exportToCSV}
          disabled={apiData.length === 0 || dataLoading}
        >
          <FaDownload /> Export Excel
        </button>
      </div>

      {/* --- REUSABLE TABLE UI --- */}
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          padding: 24px;
          border-radius: 14px;
          color: white;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .metric-card:hover { transform: translateY(-4px); }
        .metric-icon { font-size: 34px; background: rgba(255,255,255,0.2); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .metric-info { display: flex; flex-direction: column; }
        .metric-label { font-size: 13px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 32px; font-weight: 800; line-height: 1.2; }

        .gradient-blue { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }
        .gradient-green { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }
        .gradient-orange { background: linear-gradient(135deg, #08398A 0%, #126af8 100%); }

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
          font-weight: 800;
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

        /* --- Dynamic Cell Styles --- */
        .num-col { text-align: center; }
        .text-emerald-600 { color: #059669; }
        .text-rose-600 { color: #dc2626; }
        .text-slate-400 { color: #94a3b8; }
        .font-bold { font-weight: 700; }

        .date-highlight-warning { color: #dc2626; font-weight: 700; background: #fee2e2; padding: 4px 8px; border-radius: 6px; }
        .date-neutral { color: #475569; font-weight: 600; }

        .status-pill {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        
        .status-clean { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .status-warning { background: #fef3c7; color: #b45309; border: 1px solid #fde047; }
        .status-severe { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
