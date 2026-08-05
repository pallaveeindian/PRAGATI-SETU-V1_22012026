// src/pages/StateLoginPortal/StateLoginDashboard.jsx
import React, { useState } from "react";
import TMSDashboard from "../StateLoginPortal/TMSStateLoginDashboard/TMSDashboard";
import LakhpatiDashboard from "./Dashboards/LakhpatiDashboard";
import CRPEPFormDashboard from "./Dashboards/CRPEPFormDashboard";
import MOUFormDashboard from "./Dashboards/MOUFormDashboard";
import StateLoginHeader from "./StateLoginHeader";
import HomeDashboard from "./Dashboards/HomeDashboard";
const StateLoginDashboard = () => {
  const [activeTab, setActiveTab] = useState("home-dashboard");

  const menuItems = [
    { key: "home-dashboard", label: "Home Dashboard" },
    { key: "tms", label: "TMS Dashboard" },
    { key: "lakhpati", label: "Lakhpati Dashboard" },
    { key: "crpep", label: "CRP-EP Form Dashboard" },
    { key: "mou", label: "MOU Form Dashboard" },
  ];

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
      <StateLoginHeader />
      <div className="state-dashboard-layout">
        <div className="dashboard-sidebar">
          {/* <h3 className="sidebar-title">Dashboards</h3> */}

          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`sidebar-item ${
                  activeTab === item.key ? "active" : ""
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-content">{renderDashboard()}</div>
      </div>

      <style>{`
                .state-dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f8fafc;
                }

                .dashboard-sidebar {
                    width: 280px;
                    background: #ffffff;
                    border-right: 1px solid #e5e7eb;
                    padding: 24px 16px;
                    box-sizing: border-box;
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);

                    display: flex;
                    flex-direction: column;
                }

                .sidebar-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 24px;
                }

                .sidebar-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .sidebar-item {
                    width: 100%;
                    border: none;
                    outline: none;
                    background: #f8fafc;
                    padding: 14px 18px;
                    border-radius: 12px;
                    text-align: left;
                    font-size: 15px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .sidebar-item:hover {
                    background: #eff6ff;
                    color: #2563eb;
                    transform: translateX(4px);
                    outline: #2563eb 1px solid;
                }

                .sidebar-item.active {
                    background: linear-gradient(
                        135deg,
                        #ff9f1c,
                        #f59e0b
                    );
                    color: #ffffff;
                    box-shadow: 0 8px 20px rgba(
                        37,
                        99,
                        235,
                        0.25
                    );
                }

                .sidebar-item.active:hover {
                    transform: none;
                }

                .dashboard-content {
    flex: 1;
    padding-left: 5px;   /* Added missing hyphen */
    padding-right: 5px;  /* Added missing hyphen */
    overflow-y: auto;
}

                @media (max-width: 768px) {
                    .dashboard-sidebar {
                        width: 220px;
                    }

                    .sidebar-item {
                        font-size: 14px;
                        padding: 12px 14px;
                    }
                }
            `}</style>
    </>
  );
};

export default StateLoginDashboard;
