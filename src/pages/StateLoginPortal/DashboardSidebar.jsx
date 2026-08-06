// src/pages/StateLoginPortal/DashboardSidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
} from "react-icons/fa";

// Software Logos
import PSLogo from "../../assets/PS_LOGO_SQUARED.jpg";
import TMSLogo from "../../assets/TMS/tms_logo.png";
import LDMSLogo from "../../assets/LDMS/logo.png";
import CRPLogo from "../../assets/ems_logo.png";
import MOULogo from "../../assets/bms_logo.png";

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Set to TRUE to make it collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      key: "home-dashboard",
      label: "Home Dashboard",
      icon: PSLogo,
    },
    {
      key: "tms",
      label: "TMS Dashboard",
      icon: TMSLogo,
    },
    {
      key: "lakhpati",
      label: "LDMS Dashboard",
      icon: LDMSLogo,
    },
    {
      key: "crpep",
      label: "EPSMS Dashboard",
      icon: CRPLogo,
    },
    // {
    //   key: "mou",
    //   label: "MOU Dashboard",
    //   icon: MOULogo,
    // },
  ];

  const sidebarGradients = {
    "home-dashboard": `linear-gradient(
    to bottom,
    #632f05 0%,
    #EA580C 15%,
    #F97316 40%,
    #FB923C 65%,
    #FDBA74 85%,
    #FED7AA 100%
  )`,

    tms: `linear-gradient(
    to bottom,
    #02132E 0%,
    #042152 12%,
    #062C6E 28%,
    #08398A 45%,
    #0A4AAA 60%,
    #1D63C9 75%,
    #3D82E0 88%,
    #B9D7FB 100%
  )`,

    lakhpati: `linear-gradient(
    to bottom,
    #2B0207 0%,
    #4A0410 12%,
    #6B091A 28%,
    #8B1122 45%,
    #B91C1C 60%,
    #DC2626 75%,
    #EF4444 88%,
    #FCA5A5 100%
  )`,

    crpep: `linear-gradient(
    to bottom,
    #052E16 0%,
    #14532D 12%,
    #166534 28%,
    #15803D 45%,
    #16A34A 60%,
    #22C55E 75%,
    #4ADE80 88%,
    #BBF7D0 100%
  )`,
  };

  const sidebarBackground =
    sidebarGradients[activeTab] || sidebarGradients["home-dashboard"];

  // Optional: Add Ctrl+K / Cmd+K shortcut listener for the search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCollapsed(false);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMenuClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveTab(item.key);
    }
  };

  // Separate Home from Apps to replicate the sectioned look of the reference image
  const homeItem = menuItems.find((i) => i.key === "home-dashboard");
  const appItems = menuItems.filter((i) => i.key !== "home-dashboard");

  // Filter apps based on search query
  const filteredApps = appItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <aside
        className={`modern-sidebar ${isCollapsed ? "collapsed" : "expanded"}`}
        style={{ background: sidebarBackground }}
      >
        {/* Sidebar Header & Toggle */}
        <div className="sidebar-header">
          <div className="brand-container">
            <div className="brand-logo-wrap">
              <FaBook />
            </div>
            <span className="brand-title">Portals</span>
          </div>
          <button
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box" onClick={() => setIsCollapsed(false)}>
            <FaSearch className="search-icon" />
            {!isCollapsed && (
              <>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="shortcut-key">ctrl+K</span>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-scroll-area">
          <nav className="sidebar-menu">
            {/* Home Section */}
            {(!searchQuery ||
              homeItem.label
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) && (
              <button
                className={`sidebar-item ${activeTab === homeItem.key ? "active" : ""}`}
                onClick={() => handleMenuClick(homeItem)}
                title={isCollapsed ? homeItem.label : ""}
              >
                <div className="item-icon-wrapper">
                  <img
                    src={homeItem.icon}
                    alt="Home"
                    className="item-icon-img"
                  />
                </div>
                <span className="item-label">{homeItem.label}</span>
                {activeTab === homeItem.key && isCollapsed && (
                  <div className="active-dot" />
                )}
              </button>
            )}

            <div className="menu-divider" />

            {/* Modules Section */}
            {!isCollapsed && <div className="section-label">Modules</div>}

            {filteredApps.length > 0
              ? filteredApps.map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      className={`sidebar-item ${isActive ? "active" : ""}`}
                      onClick={() => handleMenuClick(item)}
                      title={isCollapsed ? item.label : ""}
                    >
                      <div className="item-icon-wrapper">
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="item-icon-img"
                        />
                      </div>
                      <span className="item-label">{item.label}</span>

                      {isActive && isCollapsed && (
                        <div className="active-dot" />
                      )}
                    </button>
                  );
                })
              : !isCollapsed && (
                  <div className="no-results">No modules found</div>
                )}
          </nav>
        </div>
      </aside>

      <style>{`
        /* Sidebar Base container */
        .modern-sidebar {
          min-height: 100vh;
          border-right: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 4px 0 24px rgba(249, 115, 22, 0.15);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
          z-index: 50;
          overflow: hidden;
        }

        /* Width States */
        .modern-sidebar.expanded {
          width: 280px;
        }

        .modern-sidebar.collapsed {
          width: 80px;
        }

        /* Header Section */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 20px 16px 20px;
          transition: padding 0.3s ease;
        }

        .collapsed .sidebar-header {
          justify-content: center;
          padding: 24px 0 16px 0;
        }

        /* Branding */
        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .brand-logo-wrap {
          min-width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .brand-title {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.3s ease;
          letter-spacing: 0.5px;
        }

        .collapsed .brand-title {
          opacity: 0;
          width: 0;
          display: none;
        }

        .collapsed .brand-logo-wrap {
          display: none; /* Hide logo when collapsed to prioritize toggle button */
        }

        /* Toggle Button */
        .toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          width: 45px;
          height: 45px;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        /* Search Bar (Inspired by image_92e953.png) */
        .search-container {
          padding: 0 16px;
          margin-bottom: 16px;
          transition: padding 0.3s ease;
        }

        .collapsed .search-container {
          padding: 0 16px;
          display: flex;
          justify-content: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 10px 14px;
          gap: 10px;
          color: #ffffff;
          cursor: text;
          transition: all 0.2s ease;
        }
        
        .collapsed .search-box {
          padding: 12px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
        }
        
        .collapsed .search-box:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .search-box:focus-within {
          background: rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .search-icon {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          flex-shrink: 0;
        }

        .search-box input {
          background: transparent;
          border: none;
          color: #ffffff;
          outline: none;
          width: 100%;
          font-size: 14px;
          font-weight: 500;
        }

        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .shortcut-key {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.2);
          padding: 3px 6px;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.9);
          font-family: monospace;
          font-weight: 600;
        }

        /* Scroll Area */
        .sidebar-scroll-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-scroll-area::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        /* Menu Container */
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 16px 24px 16px;
        }

        .collapsed .sidebar-menu {
          padding: 0 12px 24px 12px;
        }

        .menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          margin: 10px 4px;
        }

        .section-label {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin: 8px 12px 4px 12px;
          letter-spacing: 0.8px;
        }

        /* Menu Items */
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          border: 1px solid transparent;
          outline: none;
          background: transparent;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
        }

        .collapsed .sidebar-item {
          justify-content: center;
          padding: 12px 0;
        }

        /* App Icon Styling Wrapper */
        .item-icon-wrapper {
          width: 32px;
          height: 32px;
          background: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          padding: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .item-icon-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .item-label {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.3s ease, color 0.2s ease;
        }

        .collapsed .item-label {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        /* Hover States */
        .sidebar-item:hover:not(.active) {
          background: rgba(255, 255, 255, 0.15);
        }

        .sidebar-item:hover:not(.active) .item-icon-wrapper {
          transform: scale(1.05);
        }

        .sidebar-item:hover:not(.active) .item-label {
          color: #ffffff;
        }

        /* Active State - Crisp White Contrast */
        .sidebar-item.active {
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .sidebar-item.active .item-label {
          color: #F97316; /* Text turns orange on white background */
          font-weight: 700;
        }

        /* Little dot indicator for collapsed active state */
        .active-dot {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #000000;
          box-shadow: 0 0 6px rgba(255,255,255,1);
        }

        .no-results {
          padding: 16px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-style: italic;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .modern-sidebar.expanded,
          .modern-sidebar.collapsed {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          
          .sidebar-header {
             display: flex;
             padding: 16px;
          }
          
          .brand-title, .brand-logo-wrap {
             display: flex !important;
             opacity: 1 !important;
          }

          .toggle-btn {
             display: none;
          }
          
          .search-container {
             padding: 0 16px 12px 16px;
          }
          
          .collapsed .search-box {
             background: rgba(0, 0, 0, 0.15);
             border-color: rgba(255, 255, 255, 0.15);
             cursor: text;
          }

          .sidebar-scroll-area {
            overflow-x: auto;
            overflow-y: hidden;
          }

          .sidebar-menu {
            flex-direction: row;
            padding: 0 12px 16px 12px;
            gap: 12px;
          }
          
          .menu-divider, .section-label {
             display: none;
          }

          .sidebar-item {
             white-space: nowrap;
             padding: 10px 16px;
             width: auto;
          }
          
          .collapsed .sidebar-item {
             justify-content: flex-start;
          }
          
          .collapsed .item-label {
             opacity: 1;
             width: auto;
          }
          
          .active-dot {
             display: none;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;
