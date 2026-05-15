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
      { id: "tms_users", label: "Overall Demographics" },
      { id: "tms_training", label: "Login Status" },
      { id: "tms_software", label: "Cadre Selection Status" },
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

/* =========================================
   SUB NAVIGATION BAR
========================================= */

.sub-report-nav {
  width: 100%;
}

/* =========================================
   NAV CONTAINER
========================================= */

.sub-nav-list {
  position: relative;

  display: flex;
  align-items: center;
  gap: 6px;

  width: 100%;

  padding: 10px;

  margin: 0;
  list-style: none;

  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.96),
    rgba(30, 41, 59, 0.96)
  );

  border: 1px solid rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(14px);

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;
}

.sub-nav-list::-webkit-scrollbar {
  display: none;
}

/* subtle glossy top */
.sub-nav-list::before {
  content: "";
  position: absolute;
  inset: 0;

  border-radius: inherit;

  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    transparent
  );

  pointer-events: none;
}

/* =========================================
   NAV ITEM
========================================= */

.sub-nav-item {
  position: relative;
  list-style: none;
}

/* =========================================
   BUTTON
========================================= */

.sub-nav-btn {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 115px;
  height: 42px;

  padding: 0 20px;

  border: none;
  border-radius: 999px;

  background: transparent;

  color: rgba(255, 255, 255, 0.72);

  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.25px;

  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.2s ease,
    box-shadow 0.25s ease;
}

/* hover */
.sub-nav-btn:hover:not(.disabled):not(.active) {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.08);

  transform: translateY(-1px);
}

/* active */
.sub-nav-btn.active {
  color: #ffffff;

  background: linear-gradient(
    135deg,
    #ff7a00 0%,
    #ff9800 48%,
    #46a839 100%
  );

  box-shadow:
    0 8px 18px rgba(255, 122, 0, 0.28),
    0 4px 12px rgba(70, 168, 57, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);

  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);
}

/* active hover */
.sub-nav-btn.active:hover {
  filter: brightness(1.04);

  transform: translateY(-1px);
}

/* click */
.sub-nav-btn:active:not(.disabled) {
  transform: scale(0.97);
}

/* =========================================
   DISABLED
========================================= */

.sub-nav-btn.disabled,
.sub-nav-btn:disabled {
  opacity: 0.4;

  cursor: not-allowed;

  background: rgba(255, 255, 255, 0.04);

  color: rgba(255, 255, 255, 0.4);

  box-shadow: none;
}

/* =========================================
   FOCUS
========================================= */

.sub-nav-btn:focus-visible {
  outline: 3px solid rgba(255, 122, 0, 0.35);
  outline-offset: 2px;
}

/* =========================================
   ENTRY ANIMATION
========================================= */

.sub-nav-item {
  animation: navFade 0.35s ease backwards;
}

.sub-nav-item:nth-child(1) {
  animation-delay: 0.05s;
}

.sub-nav-item:nth-child(2) {
  animation-delay: 0.1s;
}

.sub-nav-item:nth-child(3) {
  animation-delay: 0.15s;
}

.sub-nav-item:nth-child(4) {
  animation-delay: 0.2s;
}

.sub-nav-item:nth-child(5) {
  animation-delay: 0.25s;
}

@keyframes navFade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
