// src/pages/StateLoginPortal/Dashboards/HomeDashboard.jsx
import React, { useState } from "react";
import KPICard from "../Dashboards/KpiCards";
import TMSDashHeader from "../../TMS/layout/TMSDashHeader";

const HomeDashboard = () => {
  const [loading, setLoading] = useState(false);

  // State for Financial Year (Defaulting to upcoming/current)
  const [financialYear, setFinancialYear] = useState("2026-27");

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
          <KPICard
            title="KPI Cards"
            stats={[
              {
                label: "Total Batch",
                value: 250,
              },
              {
                label: "Training Completed",
                value: 180,
              },
              {
                label: "Training Pending",
                value: 70,
              },
              {
                label: "Training Ongoing",
                value: 100,
              },
            ]}
          />

          <KPICard
            title="Forms"
            chartColor={["#10b981", "#34d399", "#6ee7b7"]}
            stats={[
              {
                label: "Existing Forms",
                value: 1250,
              },
              {
                label: "New Enterprise Form",
                value: 540,
              },
              {
                label: "Non Enterprise Form",
                value: 710,
              },
              {
                label: "Total Forms",
                value: 3350,
              },
            ]}
          />

          <KPICard
            title="LDMS"
            chartColor={["#f59e0b", "#fbbf24", "#fde68a"]}
            stats={[
              {
                label: "Potential Lakhpati Didi",
                value: 320,
              },
              {
                label: "Potential Non Lakhpati Didis",
                value: 180,
              },
              {
                label: "Total Support Form",
                value: 500,
              },
            ]}
          />

          <KPICard
            title="MOU"
            chartColor={["#ef4444", "#f87171", "#fca5a5"]}
            stats={[
              {
                label: "State MOU",
                value: 450,
              },
              {
                label: "District MOU",
                value: 280,
              },
              {
                label: "Block MOU",
                value: 170,
              },
              {
                label: "CLF MOU",
                value: 150,
              },
              {
                label: "VO MOU",
                value: 100,
              },
              {
                label: "SHG MOU",
                value: 200,
              },
            ]}
          />
        </div>
      </div>

      <style>{`
        .home-dashboard{
          background:#fff;
          min-height:100vh;
        }

        .dashboard-title{
          font-size:28px;
          font-weight:700;
          margin-bottom:25px;
          color:#1e293b;
        }

        .dashboard-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:24px;
        }

        @media(max-width:900px){
          .dashboard-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </>
  );
};

export default HomeDashboard;
