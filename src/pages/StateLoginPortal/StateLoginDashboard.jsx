// src/pages/StateLoginPortal/StateLoginDashboard.jsx
import React, { useState } from "react";
import TMSDashboard from "../StateLoginPortal/TMSStateLoginDashboard/TMSDashboard";
import LakhpatiDashboard from "./Dashboards/LakhpatiDashboard";
import CRPEPFormDashboard from "./Dashboards/CRPEPFormDashboard";
import MOUFormDashboard from "./Dashboards/MOUFormDashboard";
import StateLoginHeader from "./StateLoginHeader";
import HomeDashboard from "./Dashboards/HomeDashboard";
import DashboardSidebar from "./DashboardSidebar";

const StateLoginDashboard = () => {
  const [activeTab, setActiveTab] = useState("home-dashboard");

  const renderDashboard = () => {
    switch (activeTab) {
      case "home-dashboard":
        return <HomeDashboard />;
      case "tms":
        return <TMSDashboard />;
      case "lakhpati":
        return <LakhpatiDashboard />;
      case "crpep":
        return <CRPEPFormDashboard />;
      case "mou":
        return <MOUFormDashboard />;
      default:
        return <TMSDashboard />;
    }
  };

  return (
    <>
      <StateLoginHeader activeTab={activeTab} />

      <div className="state-dashboard-layout">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="dashboard-content">{renderDashboard()}</div>
      </div>

      <style>{`
        .state-dashboard-layout {
          display: flex;
          min-height: calc(100vh - 64px); /* Assuming header is around 64px */
          background: #fff; /* Light modern background for the whole page */
        }

        .dashboard-content {
          flex: 1;
          overflow-y: auto;
          height: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .state-dashboard-layout {
            flex-direction: column; /* Stack the horizontal mobile sidebar above content */
          }
          
          .dashboard-content {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default StateLoginDashboard;
