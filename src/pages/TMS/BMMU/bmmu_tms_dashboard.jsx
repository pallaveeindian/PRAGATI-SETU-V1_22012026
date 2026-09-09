// src/pages/TMS/BMMU/bmmu_tms_dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import TMSDashHeader from "../layout/TMSDashHeader";
import AdminDashKPI from "../layout/AdminDashKPI";
import AdminThemeChart from "../layout/AdminThemeChart";
import AdminParticipantDemographics from "../layout/AdminParticipantDemographics";

import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

export default function BmmuTmsDashboard() {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [dashboardData, setDashboardData] = useState(null);

  /* ---------------- Fetch Unified Admin Metrics ---------------- */
  useEffect(() => {
    // Only proceed if user is BMMU
    if (role !== "bmmu" || !user?.id) return;

    const fetchDashboardMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/tms/admin/dashboard-metrics/", {
          params: { financial_year: financialYear },
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to load BMMU dashboard metrics:", err);
        setError(
          "Failed to load dashboard metrics. Please try again or verify your geoscope mappings.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [role, user?.id, financialYear]);

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
              partnerName="BMMU Performance Dashboard"
              username={user?.first_name || user?.username || "BMMU Officer"}
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
              ) : loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Compiling block-level analytics for {financialYear}...</p>
                </div>
              ) : dashboardData ? (
                <div className="admin-grid-layout">
                  {/* 1. KPI Cards */}
                  <AdminDashKPI data={dashboardData} />

                  {/* 2. Theme Wise Performance Chart */}
                  <AdminThemeChart
                    data={dashboardData.theme_wise_performance}
                  />

                  {/* 3. Demographics Bifurcation */}
                  <AdminParticipantDemographics
                    data={dashboardData.participant_bifurcation}
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
        
        .admin-grid-layout { display: flex; flex-direction: column; gap: 20px; }

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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
