// src/pages/TMS/SMMU/smmu_tms_dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import TMSDashHeader from "../layout/TMSDashHeader";

// Reusable Components
import AdminDashKPI from "../layout/AdminDashKPI";
import AdminThemeChart from "../layout/AdminThemeChart";
import AdminParticipantDemographics from "../layout/AdminParticipantDemographics";
import AdminDistrictMap from "../layout/AdminDistrictMap";
import AdminUPMap from "../layout/AdminUPMap";

import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";

export default function SmmuTmsDashboard() {
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Scoping & Filters
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [selectedDistrictId, setSelectedDistrictId] = useState(null); // Enables Drill-down filtering

  const [dashboardData, setDashboardData] = useState(null);

  // Fetch Unified Dashboard Metrics
  const fetchDashboardMetrics = async () => {
    // Only execute if user is SMMU
    if (!user?.id || user?.role_id !== 3) return;

    setLoading(true);
    setError(null);

    try {
      const params = { financial_year: financialYear };

      // If a district is clicked on the map, apply it to the API filter!
      if (selectedDistrictId) {
        params.district_id = selectedDistrictId;
      }

      const response = await api.get("/tms/admin/dashboard-metrics/", {
        params,
      });
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to load SMMU dashboard metrics:", err);
      setError(
        "Failed to compile state analytics. Ensure your account is mapped to a Training Theme.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, [user?.id, financialYear, selectedDistrictId]);

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main className="admin-dashboard-main">
            {/* Unified Parallax Header */}
            <TMSDashHeader
              partnerName="SMMU State Executive Dashboard"
              username={user?.first_name || user?.username || "SMMU Officer"}
              financialYear={financialYear}
              setFinancialYear={setFinancialYear}
              loading={loading}
              theme="tms"
            />

            <div className="dashboard-content-pad">
              {error ? (
                <div className="alert-danger">
                  <span style={{ fontSize: 20, marginRight: 8 }}>⚠</span>
                  {error}
                </div>
              ) : loading && !dashboardData ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>
                    Compiling comprehensive state-wide analytics for{" "}
                    {financialYear}...
                  </p>
                  <small>
                    This may take a moment while we aggregate 75 districts.
                  </small>
                </div>
              ) : dashboardData ? (
                <div className="admin-grid-layout fade-in">
                  {/* 1. KPI Cards */}
                  <AdminDashKPI data={dashboardData} />

                  {/* 2. Map & Geographic Distribution */}
                  <div className="dashboard-card-wrapper">
                    <div className="card-header">
                      <h3>
                        {selectedDistrictId
                          ? "District Map & Block Distribution"
                          : "State Map & District Distribution"}
                      </h3>
                      <p>
                        {selectedDistrictId
                          ? "Currently viewing block-level structure for the selected district."
                          : "Click on a district to drill down and filter the entire dashboard by that district."}
                      </p>
                    </div>
                    {selectedDistrictId && (
                      <div className="drilldown-banner slide-down">
                        <div className="banner-text">
                          <strong>
                            Currently viewing District-Level Analytics.
                          </strong>{" "}
                          Metrics are filtered exclusively to the selected
                          district.
                        </div>
                        <button
                          className="btn-clear-filter"
                          onClick={() => setSelectedDistrictId(null)}
                        >
                          &larr; Clear Filter & Return to State View
                        </button>
                      </div>
                    )}
                    <div className="card-body">
                      {selectedDistrictId ? (
                        <AdminDistrictMap
                          districtId={selectedDistrictId}
                          data={dashboardData.block_wise_stats || []}
                        />
                      ) : (
                        <AdminUPMap
                          data={dashboardData.district_wise_stats || []}
                          activeDistrictId={selectedDistrictId}
                          onDistrictSelect={setSelectedDistrictId}
                        />
                      )}
                    </div>
                  </div>

                  {/* 3. Demographics Bifurcation */}
                  <AdminParticipantDemographics
                    data={dashboardData.participant_bifurcation}
                  />

                  <AdminThemeChart
                    data={dashboardData.theme_wise_performance}
                  />
                </div>
              ) : null}
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <style>{`
        .content-area { display: flex; flex: 1; min-height: 0; background: linear-gradient(to bottom, #fff 0%, #fff 35%, #496D9C 90%, #496D9C 100%);}
        .main-area { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .admin-dashboard-main { flex: 1; overflow-y: auto; }
        footer { flex-shrink: 0; margin-top: auto; }

        .dashboard-content-pad { padding: 30px 60px 30px 60px; max-width: 100%px; margin: 0 auto; width: 100%; }
        
        .admin-grid-layout { display: flex; flex-direction: column; gap: 24px; }

        /* Card Wrappers */
        .dashboard-card-wrapper {
          background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; margin-bottom: 8px;
        }
        .card-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: #1e3a8a; }
        .card-header h3 { margin: 0 0 6px 0; font-size: 18px; font-weight: 800; color: #fff; }
        .card-header p { margin: 0; font-size: 13px; color: #fff; font-weight: 500; }
        .card-body { padding: 24px; }

        /* Drill-down Banner */
        .drilldown-banner {
          display: flex; justify-content: space-between; align-items: center;
          background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb;
          padding: 14px 20px; border-radius: 8px; margin-bottom: 24px;
        }
        .banner-text { color: #1e3a8a; font-size: 14px; }
        .btn-clear-filter {
          background: #2563eb; color: #fff; border: none; padding: 8px 16px; border-radius: 6px;
          font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .btn-clear-filter:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(37,99,235,0.2); }

        .alert-danger {
          background: #fef2f2; border: 1px solid #f87171; color: #b91c1c;
          padding: 16px; border-radius: 12px; font-weight: 600; display: flex; align-items: center;
        }
        
        .loading-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 80px 20px; color: #64748b; font-weight: 500; text-align: center;
        }
        .spinner {
          width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #2563eb;
          border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;
        }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
