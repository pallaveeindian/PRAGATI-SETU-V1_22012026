// src/pages/TMS/DMMU/dmmu_tms_dashboard.jsx
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

import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API } from "../../../api/axios";

const GEOSCOPE_KEY = "ps_user_geoscope";

export default function DmmuTmsDashboard() {
  const { user } = useContext(AuthContext) || {};

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Scoping & Filters
  const [districtId, setDistrictId] = useState(null);
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [selectedBlockId, setSelectedBlockId] = useState(null); // Enables Drill-down filtering

  const [dashboardData, setDashboardData] = useState(null);

  // 1. Resolve DMMU District Geoscope
  useEffect(() => {
    const resolveGeoscope = async () => {
      if (!user?.id) return;
      try {
        // Try local cache first
        const raw = localStorage.getItem(GEOSCOPE_KEY);
        if (raw) {
          const geo = JSON.parse(raw);
          if (geo?.districts?.[0]) {
            setDistrictId(geo.districts[0]);
            return;
          }
        }
        // Fetch Fresh
        const res = await LOOKUP_API.userGeoscopeByUserId(user.id);
        const geo = res?.data || res;
        if (geo?.districts?.[0]) {
          localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(geo));
          setDistrictId(geo.districts[0]);
        } else {
          setError("No District mapping found for your account.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Geoscope fetch failed:", err);
        setError("Failed to resolve geographical scope.");
        setLoading(false);
      }
    };
    resolveGeoscope();
  }, [user]);

  // 2. Fetch Unified Dashboard Metrics
  useEffect(() => {
    if (!districtId || !user?.id) return;

    const fetchDashboardMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { financial_year: financialYear };
        if (selectedBlockId) params.block_id = selectedBlockId; // Apply drill-down filter if active

        const response = await api.get("/tms/admin/dashboard-metrics/", {
          params,
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to load DMMU dashboard metrics:", err);
        setError("Failed to compile district analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [districtId, user?.id, financialYear, selectedBlockId]);

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
              partnerName="DMMU Executive Dashboard"
              username={user?.first_name || user?.username || "DMMU Officer"}
              financialYear={financialYear}
              setFinancialYear={setFinancialYear}
              loading={loading}
              theme="tms"
            />

            <div className="dashboard-content-pad">
              {/* Context Action Bar (For Drill-down state) */}
              {selectedBlockId && (
                <div className="drilldown-banner slide-down">
                  <div className="banner-text">
                    <strong>Currently viewing Block-Level Analytics.</strong>{" "}
                    Metrics are filtered to the selected block.
                  </div>
                  <button
                    className="btn-clear-filter"
                    onClick={() => setSelectedBlockId(null)}
                  >
                    &larr; Clear Filter & Return to District View
                  </button>
                </div>
              )}

              {error ? (
                <div className="alert-danger">
                  <span style={{ fontSize: 20, marginRight: 8 }}>⚠</span>
                  {error}
                </div>
              ) : loading && !dashboardData ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>
                    Compiling comprehensive district analytics for{" "}
                    {financialYear}...
                  </p>
                </div>
              ) : dashboardData ? (
                <div className="admin-grid-layout fade-in">
                  {/* 1. KPI Cards */}
                  <AdminDashKPI data={dashboardData} />

                  {/* 2. District Map & Block Metrics */}
                  <div className="dashboard-card-wrapper">
                    <div className="card-header">
                      <h3>District Map & Block Distribution</h3>
                      <p>
                        Click on a block to drill down and filter the entire
                        dashboard by that block.
                      </p>
                    </div>
                    <div className="card-body">
                      <AdminDistrictMap
                        districtId={districtId}
                        data={dashboardData.block_wise_stats || []}
                      />
                    </div>
                  </div>

                  {/* 3. Demographics Bifurcation */}
                  <AdminParticipantDemographics
                    data={dashboardData.participant_bifurcation}
                  />

                  {/* 4. Theme Wise Performance Chart */}
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
          padding: 80px 20px; color: #64748b; font-weight: 500;
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
