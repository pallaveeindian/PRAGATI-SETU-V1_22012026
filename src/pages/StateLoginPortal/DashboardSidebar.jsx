// src/pages/StateLoginPortal/DashboardSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "home-dashboard",
      label: "Home Dashboard",
      route: "/master/state-home-dashboard",
    },
    {
      key: "tms",
      label: "TMS Dashboard",
    },
    {
      key: "lakhpati",
      label: "Lakhpati Dashboard",
    },
    {
      key: "crpep",
      label: "CRP-EP Form Dashboard",
    },
    {
      key: "mou",
      label: "MOU Form Dashboard",
    },
  ];

  const handleMenuClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveTab(item.key);
    }
  };

  return (
    <>
      <div className="dashboard-sidebar">
        {/* <h3 className="sidebar-title">Dashboards</h3> */}

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-item ${
                activeTab === item.key ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
                .dashboard-sidebar {
                    width: 280px;
                    min-height: 100vh;
                    background: #ffffff;
                    border-right: 1px solid #e5e7eb;
                    padding: 24px 16px;
                    box-sizing: border-box;
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.04);
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 24px;
                    padding-left: 8px;
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
                    text-align: left;
                    font-size: 15px;
                    font-weight: 600;
                    color: #475569;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .sidebar-item:hover {
                    background: #e2e8f0;
                    transform: translateX(4px);
                }

                .sidebar-item.active {
                    background: linear-gradient(
                        135deg,
                        #2563eb,
                        #1d4ed8
                    );
                    color: #ffffff;
                    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
                }

                @media (max-width: 768px) {
                    .dashboard-sidebar {
                        width: 100%;
                        min-height: auto;
                        border-right: none;
                        border-bottom: 1px solid #e5e7eb;
                    }
                }
            `}</style>
    </>
  );
};

export default DashboardSidebar;
