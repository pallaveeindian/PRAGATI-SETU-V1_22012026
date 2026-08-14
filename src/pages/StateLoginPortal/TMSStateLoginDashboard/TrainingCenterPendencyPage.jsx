// src/pages/StateLoginPortal/TMSStateLoginDashboard/TrainingCenterPendencyPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import TableUI from "../CommonUiComp/TableUI";
import { FaDownload, FaImages } from "react-icons/fa";
import CentreGallery from "./CentreGallery";

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

export default function TrainingCenterPendencyPage({ financialYear }) {
  // --- UI & Filter State ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");

  // --- Lookup Data State ---
  const [apiDistricts, setApiDistricts] = useState([]);
  const [apiPartners, setApiPartners] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  // --- Main Data State ---
  const [apiData, setApiData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // --- Gallery Modal State ---
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeCentreId, setActiveCentreId] = useState(null);
  const [activeCentreName, setActiveCentreName] = useState("");

  // ==========================================
  // 1. FETCH LOOKUPS (Districts & Partners)
  // ==========================================
  useEffect(() => {
    const fetchLookups = async () => {
      setLookupsLoading(true);
      try {
        const [distRes, partnerRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 5000 }),
          TMS_API.trainingPartners.list({ page_size: 500 }), // Assuming TMS_API has this
        ]);

        setApiDistricts(
          Array.isArray(distRes?.data)
            ? distRes.data
            : distRes?.data?.results || [],
        );
        setApiPartners(
          Array.isArray(partnerRes?.data)
            ? partnerRes.data
            : partnerRes?.data?.results || [],
        );
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
    setDataLoading(true);
    setApiData([]);
    setPage(1);

    const queryParams = new URLSearchParams();
    if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
    if (selectedPartner) queryParams.append("partner_id", selectedPartner);
    queryParams.append("financial_year", financialYear);
    queryParams.append("page_size", 1000);

    try {
      const res = await api.get(
        `/tms/reports/centre-summary/?${queryParams.toString()}`,
      );
      // Assuming DRF pagination returns data inside .results
      const results = res.data?.results || res.data?.data || res.data || [];
      setApiData(results);
    } catch (err) {
      console.error("Error fetching centre summary report:", err);
    } finally {
      setDataLoading(false);
    }
  }, [selectedDistrict, selectedPartner]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ==========================================
  // 3. PAGINATION & DATA MAPPING
  // ==========================================
  const totalPages = Math.ceil(apiData.length / rowsPerPage) || 1;

  // ==========================================
  // 4. CHART CONFIGURATION (Aggregated by Partner)
  // ==========================================
  // ==========================================
  // 4. CHART CONFIGURATION (Aggregated by Partner)
  // ==========================================
  const chartConfigData = useMemo(() => {
    const summaryMap = {};
    const processedTargets = new Set(); // Tracks unique Partner + District combos

    apiData.forEach((item) => {
      const partner = item.partner_name || "Unknown Partner";
      const districtId = item.district_id || "Unknown District";
      const uniqueTargetKey = `${partner}_${districtId}`;

      if (!summaryMap[partner]) {
        summaryMap[partner] = { allocated: 0, activeBatches: 0, tcs: 0 };
      }

      // SURGICAL FIX: Only add allocated target ONCE per district for each partner
      if (!processedTargets.has(uniqueTargetKey)) {
        summaryMap[partner].allocated += Number(item.allocated_target || 0);
        processedTargets.add(uniqueTargetKey);
      }

      // TCs and Active Batches are per-centre, so we sum them for every row
      summaryMap[partner].activeBatches += Number(item.batch_count || 0);
      summaryMap[partner].tcs += Number(item.tpcp_count || 0);
    });

    const labels = Object.keys(summaryMap);
    const allocatedData = labels.map((l) => summaryMap[l].allocated);
    const tcsData = labels.map((l) => summaryMap[l].tcs);
    const batchesData = labels.map((l) => summaryMap[l].activeBatches);

    return {
      labels,
      datasets: [
        {
          label: "Allocated Target",
          data: allocatedData,
          backgroundColor: "#3b82f6",
          borderRadius: 4,
        },
        {
          label: "TCs Created",
          data: tcsData,
          backgroundColor: "#f59e0b",
          borderRadius: 4,
        },
        {
          label: "Active Batches",
          data: batchesData,
          backgroundColor: "#16a34a",
          borderRadius: 4,
        },
      ],
    };
  }, [apiData]);

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
  // 5. TABLE COLUMNS SETUP
  // ==========================================
  const columns = [
    {
      header: "Training Partner",
      key: "partner_name",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {row.partner_name || "-"}
        </span>
      ),
    },
    {
      header: "District",
      key: "district_name",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#475569" }}>
          {row.district_name || "-"}
        </span>
      ),
    },
    {
      header: "Allocated Target",
      key: "allocated_target",
      render: (row) => <div className="num-col">{row.allocated_target}</div>,
    },
    {
      header: "Centre Name",
      key: "venue_name",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "#083A8B" }}>
          {row.venue_name || "-"}
        </span>
      ),
    },
    {
      header: "TCs Created",
      key: "tpcp_count",
      render: (row) => (
        <div className="num-col">
          <span
            className={`badge ${row.tpcp_count > 0 ? "state-green" : "state-amber"}`}
          >
            {row.tpcp_count}
          </span>
        </div>
      ),
    },
    {
      header: "Active Batches",
      key: "batch_count",
      render: (row) => (
        <div className="num-col" style={{ fontWeight: 600, color: "#0f172a" }}>
          {row.batch_count}
        </div>
      ),
    },
    {
      header: "Uploaded Assets",
      key: "asset_count",
      sortable: false,
      render: (row) => (
        <div className="num-col">
          <button
            className={`asset-btn ${row.asset_count > 0 ? "has-assets" : "no-assets"}`}
            onClick={() => {
              setActiveCentreId(row.id);
              setActiveCentreName(row.venue_name || `Centre #${row.id}`);
              setIsGalleryOpen(true);
            }}
          >
            <FaImages /> View {row.asset_count} Assets
          </button>
        </div>
      ),
    },
  ];

  // ==========================================
  // 6. CSV EXPORT LOGIC
  // ==========================================
  const exportToCSV = () => {
    if (!apiData || apiData.length === 0) return;

    let csvContent =
      "S.No.,Training Partner Name,District,Allocated Target,Centre Name,TCs Created,Batches,Uploaded Assets\n";
    apiData.forEach((row, i) => {
      csvContent += `"${i + 1}","${row.partner_name || "-"}","${row.district_name || "-"}","${row.allocated_target}","${row.venue_name || "-"}","${row.tpcp_count}","${row.batch_count}","${row.asset_count}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Training_Centre_Pendency.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-white-card">
      <div className="report-header">
        <h2>Training Centre Pendencies & Asset Tracking</h2>
        <p>
          Review and audit training space initialization, missing geo-tagged
          assets, and valid uploads.
        </p>
      </div>

      {/* --- FILTERS ROW --- */}
      <div className="filters-row">
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

        <div className="filter-group">
          <label>Training Partner</label>
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            disabled={lookupsLoading}
          >
            <option value="">-- All Partners --</option>
            {apiPartners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {(selectedDistrict || selectedPartner) && (
          <div
            className="filter-group"
            style={{ justifyContent: "flex-end", paddingBottom: "2px" }}
          >
            <button
              className="reset-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedPartner("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* --- CHART SECTION --- */}
      <div className="chart-card">
        <h3>Programmatic Visual Analysis Flow</h3>
        <div className="chart-inner-container">
          {dataLoading ? (
            <div className="empty-state">Loading Chart Data...</div>
          ) : apiData.length > 0 ? (
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
        <h3>Centre Progress Details</h3>
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

      {/* --- GALLERY MODAL --- */}
      <CentreGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        centreId={activeCentreId}
        centreName={activeCentreName}
      />

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
          display: flex; flex-wrap: wrap; gap: 20px; background: #08398A; padding: 20px;
          border-radius: 12px; margin-bottom: 24px;
        }

        .filter-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 220px; }
        .filter-group label { font-size: 13px; font-weight: 700; color: #ffffff; text-transform: uppercase; }
        .filter-group select {
          padding: 12px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px;
          font-weight: 600; color: #0f172a; outline: none; transition: all 0.2s ease;
        }
        .filter-group select:focus { border-color: #0092E0; box-shadow: 0 0 0 3px rgba(0, 146, 224, 0.15); }

        .reset-btn { background: #f1f5f9; color: #ef4444; border: 1px solid #fecaca; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .reset-btn:hover { background: #ef4444; color: #fff; }

        .chart-card { background: #ffffff; border: 3px solid #08398A; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
        .chart-card h3 { margin: 0 0 20px 0; color: #0f172a; font-size: 16px; }
        .chart-inner-container { height: 350px; width: 100%; display: flex; justify-content: center; }

        .table-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .table-header-flex h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 800; }
        .export-btn { display: flex; align-items: center; gap: 8px; background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .export-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-2px); }

        .num-col { text-align: center; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .state-green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .state-amber { background: #fef08a; color: #854d0e; border: 1px solid #fde047; }

        .asset-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
          padding: 8px 12px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease;
        }
        .asset-btn.has-assets { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .asset-btn.has-assets:hover { background: #dbeafe; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(29, 78, 216, 0.1); }
        .asset-btn.no-assets { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; border: 1px solid #e2e8f0; }

        .empty-state { text-align: center; padding: 48px; color: #94a3b8; font-size: 15px; font-style: italic; width: 100%; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
