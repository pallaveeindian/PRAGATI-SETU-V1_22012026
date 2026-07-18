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
          params: { financial_year: financialYear },
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
  }, [role, user?.id, financialYear]);

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
          <main className="tp-page tp-dashboard">
            {/* TOP CONTROLS & HEADER */}
            <div className="dashboard-top-section">
              {/* Financial Year Selector (Top Left) */}
              <div className="fy-selector-wrapper">
                <label htmlFor="fy-select" className="fy-label">
                  Financial Year:
                </label>
                <select
                  id="fy-select"
                  className="fy-select"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                >
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                </select>
              </div>

              {/* Big Clean Partner Name Heading */}
              {/* {dashboardData?.training_partner_name && !loading && (
                <div className="partner-heading-container">
                  <h1 className="partner-main-heading">
                    {dashboardData.training_partner_name}
                  </h1>
                  <div className="partner-sub-heading">
                    Executive Performance Dashboard
                  </div>
                </div>
              )} */}
            </div>

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
                {/* 1. KPI Cards */}
                <DashKPI data={dashboardData.kpi_card_info} />
                {/* 2. District Analytics Dropdown & Map Layout */}
                <div
                  className="district-metric-section"
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <div
                    className="fy-selector-wrapper"
                    style={{
                      marginBottom: "20px",
                      boxShadow: "none",
                      border: "1px solid #cbd5e1",
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
                    data={dashboardData[selectedDistrictMetric]}
                  />
                </div>

                {/* 3. Theme Wise Metrics */}
                <DashThemeChart data={dashboardData.theme_wise_metrics} />
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
          background: #f4f7fb;
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
          padding: 24px 32px;
          overflow-y: auto;
        }
        footer {
          flex-shrink: 0;
          margin-top: auto;
        }

        /* Dashboard Specific Styles */
        .dashboard-top-section {
          margin-bottom: 32px;
        }
        
        .fy-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          background: #fff;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          width: fit-content;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .fy-label {
          font-weight: 600;
          color: #4b5563;
          font-size: 14px;
        }
        .fy-select {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          outline: none;
          background: #f9fafb;
          cursor: pointer;
        }
        .fy-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .partner-heading-container {
          border-left: 5px solid #2563eb;
          padding-left: 16px;
        }
        .partner-main-heading {
          font-size: 32px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 8px 0;
          line-height: 1.2;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        .partner-sub-heading {
          font-size: 16px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dashboard-content-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Placeholder Styles */
        .placeholder-box {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .placeholder-box h4 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 18px;
        }
        .placeholder-box .muted {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 16px;
        }
        .data-dump {
          background: #1e293b;
          color: #a5b4fc;
          padding: 16px;
          border-radius: 8px;
          font-size: 12px;
          overflow-x: auto;
          margin: 0;
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
