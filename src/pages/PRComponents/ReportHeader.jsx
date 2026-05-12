// src/components/reports/ReportHeader.jsx
import React, { useState, useEffect } from "react";

const NAV_CONFIG = [
  {
    id: "overview",
    label: "UP at a glance",
    subLinks: [],
  },
  {
    id: "tms",
    label: "Training Management Portal (TMS)",
    subLinks: [
      { id: "tms_users", label: "Trainee Demographics" },
      { id: "tms_training", label: "Capacity Building Metrics" },
      { id: "tms_software", label: "System Utilization" },
    ],
  },
  {
    id: "epsms",
    label: "Enterprise Management Portal (EPSMS)",
    subLinks: [
      { id: "epsms_users", label: "Entrepreneur Demographics" },
      { id: "epsms_crp", label: "CRP Mapping Form Analytics" },
      { id: "epsms_software", label: "Platform Adoption" },
    ],
  },
  {
    id: "ldms",
    label: "Lakhpati Management Portal (LDMS)",
    subLinks: [
      { id: "ldms_soon", label: "Dashboard Awaited (Coming Soon...)" },
    ],
  },
];

export default function ReportHeader({ onSelectionChange }) {
  const [activeTab, setActiveTab] = useState(NAV_CONFIG[0].id);
  const [activeSubTab, setActiveSubTab] = useState(null);

  // Handle Main Tab Click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Automatically select the first sub-link if it exists, otherwise null
    const selectedTab = NAV_CONFIG.find((t) => t.id === tabId);
    const initialSub =
      selectedTab.subLinks.length > 0 ? selectedTab.subLinks[0].id : null;

    setActiveSubTab(initialSub);
  };

  // Handle Sub Tab Click
  const handleSubTabClick = (subId) => {
    // Prevent clicking "Coming Soon"
    if (subId !== "ldms_soon") {
      setActiveSubTab(subId);
    }
  };

  // Notify parent component whenever tab/subtab changes to update the Analytics Section
  useEffect(() => {
    onSelectionChange(activeTab, activeSubTab);
  }, [activeTab, activeSubTab, onSelectionChange]);

  const currentTabConfig = NAV_CONFIG.find((t) => t.id === activeTab);

  return (
    <div className="report-header-wrapper">
      {/* ===== MAIN NAVIGATION BAR ===== */}
      <nav className="main-report-nav">
        <ul className="main-nav-list">
          {NAV_CONFIG.map((tab) => (
            <li key={tab.id} className="main-nav-item">
              <button
                className={`main-nav-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== SUB-NAVIGATION BAR (Only shows if subLinks exist) ===== */}
      {currentTabConfig && currentTabConfig.subLinks.length > 0 && (
        <nav className="sub-report-nav">
          <ul className="sub-nav-list">
            {currentTabConfig.subLinks.map((sub) => {
              const isComingSoon = sub.id === "ldms_soon";
              return (
                <li key={sub.id} className="sub-nav-item">
                  <button
                    className={`sub-nav-btn 
                      ${activeSubTab === sub.id ? "active" : ""} 
                      ${isComingSoon ? "disabled" : ""}`}
                    onClick={() => handleSubTabClick(sub.id)}
                    disabled={isComingSoon}
                  >
                    {sub.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* ===== STYLES ===== */}
      <style>{`
        .report-header-wrapper {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          font-family: inherit;
        }

        /* --- Main Nav --- */
        .main-report-nav {
          background-color: #0f172a; /* Professional Navy Blue */
          padding: 0 20px;
        }

        .main-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 30px;
          overflow-x: auto; /* Scrollable on small screens */
        }

        .main-nav-item {
          margin: 0;
        }

        .main-nav-btn {
          background: none;
          border: none;
          color: #cbd5e1;
          font-size: 15px;
          font-weight: 600;
          padding: 16px 4px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .main-nav-btn:hover {
          color: #ffffff;
        }

        .main-nav-btn.active {
          color: #ff7a00; /* Saffron/Orange Accent */
          border-bottom: 3px solid #ff7a00;
        }

        /* --- Sub Nav --- */
        .sub-report-nav {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 20px;
        }

        .sub-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 24px;
          overflow-x: auto;
        }

        .sub-nav-item {
          margin: 0;
        }

        .sub-nav-btn {
          background: none;
          border: none;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          padding: 12px 8px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .sub-nav-btn:hover:not(.disabled) {
          color: #0f172a;
        }

        .sub-nav-btn.active {
          color: #0f172a;
          font-weight: 700;
          border-bottom: 2px solid #0f172a;
        }

        .sub-nav-btn.disabled {
          color: #94a3b8;
          cursor: not-allowed;
          font-style: italic;
        }

        /* --- Scrollbar styling for horizontal scroll --- */
        .main-nav-list::-webkit-scrollbar,
        .sub-nav-list::-webkit-scrollbar {
          height: 4px;
        }
        .main-nav-list::-webkit-scrollbar-thumb,
        .sub-nav-list::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
