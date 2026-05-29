import React, { useState, useEffect, useCallback } from "react";
import AnalyticsCharts from "./AnalyticComponents/AnalyticsCharts";
import AnalyticsFilters from "./AnalyticComponents/AnalyticsFilters";
import AnalyticsTable from "./AnalyticComponents/AnalyticsTable";
import api from "../../api/axios";
import { LOOKUP_API } from "../../api/axios";

export default function AnalyticsSection({ currentReport }) {
  // --- State for APIs ---
  const [overviewData, setOverviewData] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [cadreData, setCadreData] = useState(null);
  const [mouData, setMouData] = useState(null);

  // --- State for Lookups & Filters ---
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    district_id: "",
    block_id: "",
    role_name: "",
    date: "",
    start_date: "",
    end_date: "",
    not_logged_in: "0",
    district_wise_summary: "0",
  });

  const activeTab = currentReport?.tab || "overview";
  const activeSubTab = currentReport?.subTab || "";

  // ==========================================
  // 1. FETCH GEOGRAPHY LOOKUPS
  // ==========================================
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await LOOKUP_API.districts.list({
          page_size: 5000,
        });

        setDistricts(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching districts", err);
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!filters.district_id) {
        setBlocks([]);
        return;
      }

      try {
        const res = await LOOKUP_API.blocksByDistrict(filters.district_id, {
          params: {
            page_size: 5000,
          },
        });

        setBlocks(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching blocks", err);
        setBlocks([]);
      }
    };

    fetchBlocks();
  }, [filters.district_id]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Reset block if district changes
      if (key === "district_id") newFilters.block_id = "";
      return newFilters;
    });
  };

  // ==========================================
  // 2. FETCH REPORT DATA
  // ==========================================
  const fetchReportData = useCallback(async () => {
    setLoading(true);

    // Build Query String for Filters
    const queryParams = new URLSearchParams();
    if (filters.district_id)
      queryParams.append("district_id", filters.district_id);
    if (filters.block_id) queryParams.append("block_id", filters.block_id);
    if (filters.role_name) queryParams.append("role_name", filters.role_name);
    if (filters.date) queryParams.append("date", filters.date);
    if (filters.start_date)
      queryParams.append("start_date", filters.start_date);
    if (filters.end_date) queryParams.append("end_date", filters.end_date);
    if (filters.not_logged_in === "1") queryParams.append("not_logged_in", "1");
    if (filters.district_wise_summary === "1")
      queryParams.append("district_wise_summary", "1");

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    try {
      if (
        activeTab === "overview" ||
        (activeTab === "tms" && activeSubTab === "tms_users")
      ) {
        // Fetch UP at a glance
        const res = await api.get(`/public/up-at-a-glance/`);
        if (res.data?.status === "success") setOverviewData(res.data);
      } else if (activeTab === "tms" && activeSubTab === "tms_training") {
        // Fetch Login Status
        const res = await api.get(`/public/first-login-summary/${queryString}`);
        if (res.data?.status === "success") setLoginData(res.data);
      } else if (activeTab === "tms" && activeSubTab === "tms_software") {
        // Fetch Cadre Selection
        const res = await api.get(
          `/public/cadre-selection-summary/${queryString}`,
        );
        if (res.data?.status === "success") setCadreData(res.data);
      } else if (activeSubTab === "mou_analytics" || activeTab === "epsms") {
        // --- SURGICAL ADDITION: Fetch MOU Analytics ---
        const res = await api.get(`/public/mou-analytics/?page_size=500`);
        setMouData(res.data);
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    activeSubTab,
    filters.district_id,
    filters.block_id,
    filters.role_name,
    filters.date,
    filters.start_date,
    filters.end_date,
    filters.not_logged_in,
    filters.district_wise_summary,
  ]);

  // Fetch data whenever the tab changes
  useEffect(() => {
    fetchReportData();
  }, [activeTab, activeSubTab, fetchReportData]);

  return (
    <div className="analytics-section-wrapper">
      {/* 1. CHARTS & DASHBOARD */}
      <AnalyticsCharts
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        overviewData={overviewData}
        loginData={loginData}
        cadreData={cadreData}
        mouData={mouData} // --- SURGICAL ADDITION ---
        loading={loading}
        filters={filters}
      />

      {/* 2. FILTERS / INFO BAR */}
      {!(activeTab === "epsms" && activeSubTab === "mou_analytics") && (
        <AnalyticsFilters
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          filters={filters}
          districts={districts}
          blocks={blocks}
          onFilterChange={handleFilterChange}
          onApply={fetchReportData}
        />
      )}

      {/* 3. DATA TABLE */}
      <AnalyticsTable
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        overviewData={overviewData}
        loginData={loginData}
        cadreData={cadreData}
        mouData={mouData} // --- SURGICAL ADDITION ---
        loading={loading}
        filters={filters}
      />

      {/* ================= STYLES (Shared across children) ================= */}
      <style>{`
        .analytics-section-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeIn 0.5s ease-in-out;
        }
        .analytics-module {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
          padding: 24px;
        }
        .loading-spinner {
          text-align: center;
          padding: 60px;
          font-size: 18px;
          color: #ff7a00;
          font-weight: 600;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
        }

        /* --- Metrics & Charts --- */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
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
        .metric-icon {
          font-size: 34px;
          background: rgba(255,255,255,0.2);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .metric-info { display: flex; flex-direction: column; }
        .metric-label { font-size: 13px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 32px; font-weight: 800; line-height: 1.2; }

        .gradient-blue { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); }
        .gradient-orange { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
        .gradient-dark { background: linear-gradient(135deg, #334155 0%, #0f172a 100%); }
        .gradient-green { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); }
        .gradient-purple { background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); }

        .dashboard-row { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; margin-bottom: 24px; }
        .dashboard-card { background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04); }
        .card-title { margin-top: 0; color: #0f172a; font-size: 17px; font-weight: 700; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }

        /* --- Filters --- */
        .filters-module { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-end; background: #f8fafc; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 200px; }
        .filter-group label { font-size: 13px; font-weight: 600; color: #475569; text-transform: uppercase; }
        .filter-group select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; color: #0f172a; background: #ffffff; outline: none; }
        .filter-group select:focus { border-color: #ff7a00; box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1); }
        .btn-apply-filters { background: #0f172a; color: #ffffff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; height: 42px; }
        .btn-apply-filters:hover { background: #1e293b; }

        /* --- Table --- */
        .table-module { padding: 0; overflow: hidden; }
        .table-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .table-header h3 { margin: 0; color: #0f172a; font-size: 18px; }
        .btn-export {
          position: relative;
          height: 46px;
          min-width: 145px;
          padding: 0;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          overflow: hidden;

          background: linear-gradient(
            135deg,
            #ff7a00 0%,
            #ff9100 45%,
            #46a839 100%
          );

          box-shadow:
            0 4px 14px rgba(255, 122, 0, 0.35),
            0 2px 6px rgba(70, 168, 57, 0.25);

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            filter 0.22s ease;
        }

        /* glossy top layer */
        .btn-export::before {
          content: "";
          position: absolute;
          inset: 0;

          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.28),
            rgba(255, 255, 255, 0.04)
          );

          pointer-events: none;
        }

        /* glowing hover effect */
        .btn-export::after {
          content: "";
          position: absolute;
          top: -120%;
          left: -40%;
          width: 60%;
          height: 320%;

          background: rgba(255, 255, 255, 0.2);
          transform: rotate(25deg);
          transition: left 0.7s ease;
        }

        .btn-export:hover::after {
          left: 130%;
        }

        /* =========================
           HOVER / ACTIVE
        ========================= */

        .btn-export:hover {
          transform: translateY(-2px) scale(1.015);

          box-shadow:
            0 8px 24px rgba(255, 122, 0, 0.45),
            0 4px 14px rgba(70, 168, 57, 0.35);

          filter: brightness(1.03);
        }

        .btn-export:active {
          transform: scale(0.97);
        }

        .btn-export:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* =========================
           CONTENT SLIDE SYSTEM
        ========================= */

        .btn-export-content {
          position: relative;
          height: 92px;
          width: 100%;

          transform: translateY(-46px);
          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-export:hover .btn-export-content {
          transform: translateY(0);
        }

        /* =========================
           ICON SECTION
        ========================= */

        .btn-export-icon-wrap,
        .btn-export-text-wrap {
          height: 46px;
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-export-icon {
          width: 24px;
          height: 24px;
          fill: #ffffff;

          opacity: 0;
          transform: scale(0.6);

          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .btn-export:hover .btn-export-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* =========================
           TEXT SECTION
        ========================= */

        .btn-export-text {
          color: #ffffff;
          font-size: 13px;
          font-weight: 1000;
          letter-spacing: 0.4px;

          text-transform: uppercase;

          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .btn-export:hover .btn-export-text {
          opacity: 0;
          transform: translateY(8px);
        }

        /* =========================
           FOCUS ACCESSIBILITY
        ========================= */

        .btn-export:focus-visible {
          outline: 3px solid rgba(255, 255, 255, 0.9);
          outline-offset: 3px;
        }

        /* =========================
           ICON HEARTBEAT
        ========================= */

        .btn-export:hover .btn-export-icon {
          animation: exportPulse 1.2s infinite;
        }

        @keyframes exportPulse {
          0% {
            transform: scale(1);
          }

          20% {
            transform: scale(0.9);
          }

          40% {
            transform: scale(1.08);
          }

          60% {
            transform: scale(0.96);
          }

          100% {
            transform: scale(1);
          }
        }
        .table-responsive { overflow-x: auto; }
        .gov-data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .gov-data-table th, .gov-data-table td { padding: 14px 20px; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 14px; }
        .gov-data-table th { background: #f8fafc; font-weight: 700; color: #0f172a; text-transform: uppercase; font-size: 12px; }
        .gov-data-table tbody tr:hover { background: #f1f5f9; }
        .fw-bold { font-weight: 600; color: #0f172a !important; }
        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .status-badge.success { background-color: #dcfce7; color: #166534; }
        .status-badge.warning { background-color: #fef08a; color: #854d0e; }
        .status-badge.danger { background-color: #fee2e2; color: #991b1b; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- Pagination --- */
        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          padding: 22px 20px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          flex-wrap: wrap;
        }

        .pagination-controls button {
          min-width: 90px;
          height: 40px;
          border: 1px solid #cbd5e1;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          color: #0f172a;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.22s ease;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06);
        }

        .pagination-controls button:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff7a00 0%, #ea580c 100%);
          color: #ffffff;
          border-color: #ea580c;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(234, 88, 12, 0.25);
        }

        .pagination-controls button:active:not(:disabled) {
          transform: scale(0.97);
        }

        .pagination-controls button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          background: #f1f5f9;
          color: #94a3b8;
          box-shadow: none;
        }

        .pagination-controls span {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);
        }

        /* =========================================
           ROW 2 : GEOGRAPHY + ROLE BREAKDOWN
        ========================================= */

        .dashboard-row {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 24px;
          align-items: stretch;
        }

        .dashboard-card {
          background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px;
          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04),
            0 1px 2px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
          position: relative;
          overflow: hidden;
        }

        .dashboard-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(255, 122, 0, 0.03),
              rgba(2, 132, 199, 0.02)
            );
          pointer-events: none;
        }

        .dashboard-card:hover {
          transform: translateY(-3px);
          border-color: #dbeafe;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.08),
            0 2px 8px rgba(15, 23, 42, 0.05);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 22px 0;
          padding-bottom: 14px;
          border-bottom: 1px solid #eef2f7;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.2px;
        }

        /* =========================================
           GEOGRAPHY GRID
        ========================================= */

        .geo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .geo-item {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px 14px;
          text-align: center;
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
        }

        .geo-item::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 3px;
          background: linear-gradient(90deg, #ff7a00, #0284c7);
          opacity: 0;
          transition: opacity 0.22s ease;
        }

        .geo-item:hover {
          transform: translateY(-2px);
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .geo-item:hover::after {
          opacity: 1;
        }

        .geo-num {
          display: block;
          font-size: 30px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 10px;
          color: #0f172a;
        }

        .geo-text {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        /* =========================================
           ROLE BREAKDOWN BARS
        ========================================= */

        .css-bar-chart {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .bar-label {
          width: 160px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-align: right;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .bar-track {
          flex: 1;
          height: 28px;
          background: #eef2f7;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.05);
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff7a00 0%, #ea580c 100%);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          min-width: 42px;
          transition: width 0.5s ease;
          box-shadow:
            inset 0 -1px 0 rgba(255,255,255,0.18),
            0 3px 10px rgba(234, 88, 12, 0.25);
        }

        .bar-value {
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 992px) {
          .dashboard-row {
            grid-template-columns: 1fr;
          }

          .bar-label {
            width: 120px;
            font-size: 11px;
          }
        }

        @media (max-width: 640px) {
          .geo-grid {
            grid-template-columns: 1fr;
          }

          .bar-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .bar-label {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
