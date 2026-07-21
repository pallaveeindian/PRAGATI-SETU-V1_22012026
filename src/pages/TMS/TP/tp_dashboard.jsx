// src/pages/TMS/TP/tp_dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import "../../../tp_styles.css";

import DashKPI from "./components/DashKPI";
import DashThemeChart from "./components/DashThemeChart";
import UPMapWrapper from "./components/UPMap";
import TMSDashHeader from "../layout/TMSDashHeader";

/* ===================================================== */
/* MAIN DASHBOARD COMPONENT                              */
/* ===================================================== */

export default function TpDashboard() {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for Financial Year (Defaulting to upcoming/current)
  const [financialYear, setFinancialYear] = useState("2026-27");

  // SURGICAL ADDITION: State for Batches Filter
  const [batchesFilter, setBatchesFilter] = useState("closed");

  // SURGICAL ADDITION: State for District Metric Selection
  const [selectedDistrictMetric, setSelectedDistrictMetric] = useState(
    "district_tp_performance",
  );

  // State for the Unified API Data
  const [dashboardData, setDashboardData] = useState(null);
  /* ---------------- Fetch Unified Metrics ---------------- */
  useEffect(() => {
    if (role !== "training_partner" || !user?.id) return;

    const fetchDashboardMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/tms/tp/dashboard-metrics/", {
          // SURGICAL REPLACEMENT: Pass the new batches filter to the API
          params: {
            financial_year: financialYear,
            batches: batchesFilter,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to load TP dashboard metrics:", err);
        setError("Failed to load dashboard metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
    // SURGICAL REPLACEMENT: Added batchesFilter to dependencies
  }, [role, user?.id, financialYear, batchesFilter]);

  /* ===================================================== */

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main className="tp-dashboard">
            {/* SURGICAL REPLACEMENT: New Parallax Header Component */}
            <TMSDashHeader
              partnerName={
                dashboardData?.training_partner_name ||
                "Training Partner Dashboard"
              }
              username={user?.username || "User"}
              financialYear={financialYear}
              setFinancialYear={setFinancialYear}
              loading={loading}
            />

            {/* DASHBOARD CONTENT */}
            {error ? (
              <div className="alert-danger">{error}</div>
            ) : loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Compiling metrics for {financialYear}...</p>
              </div>
            ) : dashboardData ? (
              <div className="dashboard-content-grid">
                {/* SURGICAL ADDITION: Global Batches Evaluation Toggle */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "12px",
                  }}
                >
                  <div className="fy-selector-wrapper" style={{ margin: 0 }}>
                    <label
                      htmlFor="batches-select"
                      className="fy-label"
                      style={{ marginRight: "8px" }}
                    >
                      Dashboard Evaluation:
                    </label>
                    <select
                      id="batches-select"
                      className="fy-select"
                      value={batchesFilter}
                      onChange={(e) => setBatchesFilter(e.target.value)}
                    >
                      <option value="closed">Closed Batches Only</option>
                      <option value="created">All Active Batches</option>
                    </select>
                  </div>
                </div>

                {/* 1. KPI Cards */}
                <DashKPI data={dashboardData.kpi_card_info} />
                {/* 2. District Analytics Dropdown & Map Layout */}
                <div
                  className="district-metric-section"
                  style={{
                    background: "#fff",
                    padding: "24px",
                  }}
                >
                  <div
                    className="fy-selector-wrapper"
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <label htmlFor="metric-select" className="fy-label">
                      District Analytics View:
                    </label>
                    <select
                      id="metric-select"
                      className="fy-select"
                      value={selectedDistrictMetric}
                      onChange={(e) =>
                        setSelectedDistrictMetric(e.target.value)
                      }
                    >
                      <option value="district_tp_performance">
                        TP Performance Ranking
                      </option>
                      <option value="district_wise_metrics">
                        Targets vs Achieved Batches
                      </option>
                      <option value="district_wise_centres">
                        Registered Training Centres
                      </option>
                    </select>
                  </div>

                  <UPMapWrapper
                    metricType={selectedDistrictMetric}
                    batchesFilter={batchesFilter}
                    data={dashboardData[selectedDistrictMetric]}
                  />
                </div>

                {/* 3. Theme Wise Metrics */}
                <DashThemeChart
                  data={dashboardData.theme_wise_metrics}
                  batchesFilter={batchesFilter}
                />
              </div>
            ) : null}
          </main>
          <Footer />
        </div>
      </div>

      <style>{`
        .content-area {
          display: flex;
          flex: 1;
          min-height: 0;
          background: #ffffff;
        }
        .tms-leftnav {
          flex-shrink: 0;
        }
        .main-area {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        .tp-page {
          flex: 1;
          overflow-y: auto;
        }
        footer {
          flex-shrink: 0;
          margin-top: auto;
        }

        .dashboard-content-grid {
          display: flex;
          flex-direction: column;
        }

        /* Utils */
        .alert-danger {
          background: #fef2f2;
          border: 1px solid #f87171;
          color: #b91c1c;
          padding: 16px;
          border-radius: 8px;
          font-weight: 500;
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: #6b7280;
          font-weight: 500;
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
