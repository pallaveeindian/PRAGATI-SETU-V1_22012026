import React, { useState, useEffect } from "react";
import KPICard from "../Dashboards/KpiCards";
import TMSDashHeader from "../../TMS/layout/TMSDashHeader";
import api from "../../../api/axios";

const HomeDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // State for Financial Year (Defaulting to upcoming/current)
  const [financialYear, setFinancialYear] = useState("2026-27");

  // Fetch Global Dashboard Stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tms/reports/global-dashboard-stats/");
        if (res.data?.status === "success") {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch global dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, []); // Only fetch once on mount for the global overview

  return (
    <>
      <div className="home-dashboard">
        <TMSDashHeader
          partnerName={"UP State Dashboard"}
          username={"UPSRLM Admin"}
          financialYear={financialYear}
          setFinancialYear={setFinancialYear}
          loading={loading}
          theme="home"
        />

        <div className="dashboard-grid">
          {/* 1. TMS (Training Management System) */}
          <KPICard
            title="Training Management System"
            stats={[
              {
                label: "Total Batches",
                value: stats?.tms_total_batches || 0,
              },
              {
                label: "Training Completed",
                value: stats?.tms_completed || 0,
              },
              {
                label: "Training Pending",
                value: stats?.tms_pending || 0,
              },
              {
                label: "Training Ongoing",
                value: stats?.tms_ongoing || 0,
              },
            ]}
          />

          {/* 2. EPSMS (Enterprise Management System) */}
          <KPICard
            title="Enterprise Management System"
            chartColor={["#10b981", "#34d399", "#6ee7b7"]}
            stats={[
              {
                label: "Existing Forms",
                value: stats?.epsms_existing || 0,
              },
              {
                label: "New Enterprise Form",
                value: stats?.epsms_new || 0,
              },
              {
                label: "Non Enterprise Form",
                value: stats?.epsms_non_ep || 0,
              },
              {
                label: "Total Forms",
                value: stats?.epsms_total_forms || 0,
              },
            ]}
          />

          {/* 3. LDMS (Lakhpati Didi Management System) */}
          <KPICard
            title="Lakhpati Didi Management System"
            chartColor={["#ef4444", "#f87171", "#fca5a5"]}
            stats={[
              {
                label: "Potential Lakhpati Didi",
                value: stats?.ldms_pld || 0,
              },
              {
                label: "Potential Non Lakhpati Didis",
                value: stats?.ldms_non_pld || 0,
              },
              {
                label: "Total Support Form",
                value: stats?.ldms_total_support || 0,
              },
            ]}
          />

          {/* 4. SHG-MOU Management System */}
          <KPICard
            title="SHG-MOU Management System"
            chartColor={["#f59e0b", "#fbbf24", "#fde68a"]}
            stats={[
              {
                label: "State MOU",
                value: stats?.mou_state || 0,
              },
              {
                label: "District MOU",
                value: stats?.mou_district || 0,
              },
              {
                label: "Block MOU",
                value: stats?.mou_block || 0,
              },
              {
                label: "CLF MOU",
                value: stats?.mou_clf || 0,
              },
              {
                label: "VO MOU",
                value: stats?.mou_vo || 0,
              },
              {
                label: "SHG MOU",
                value: stats?.mou_shg || 0,
              },
            ]}
          />
        </div>
      </div>

      <style>{`
        .home-dashboard {
          background: #fff;
          min-height: 100vh;
          margin-bottom: 40px;
        }

        .dashboard-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 25px;
          color: #1e293b;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          padding: 0 15px;
          margin-top: 10px;
        }

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default HomeDashboard;
