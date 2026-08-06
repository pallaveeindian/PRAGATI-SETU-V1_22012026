import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaBook,
  FaHandsHelping,
  FaDatabase,
  FaAddressBook,
  FaClipboardCheck,
  FaBars,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

// Software Logos
import PSLogo from "../../assets/PS_LOGO_SQUARED.jpg";
import TMSLogo from "../../assets/TMS/tms_logo.png";
import LDMSLogo from "../../assets/LDMS/logo.png";
import CRPLogo from "../../assets/ems_logo.png";
import MOULogo from "../../assets/bms_logo.png";

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // Set to TRUE to make it collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);

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

  const handleMenuClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveTab(item.key);
    }
  };

  return (
    <>
      <aside
        className={`modern-sidebar ${isCollapsed ? "collapsed" : "expanded"}`}
      >
        {/* Sidebar Header & Toggle */}
        <div className="sidebar-header">
          <div className="brand-container">
            <div className="brand-logo">
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

        {/* Sidebar Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => handleMenuClick(item)}
                title={isCollapsed ? item.label : ""} // Tooltip when collapsed
              >
                <img src={item.icon} className="item-icon" />
                <span className="item-label">{item.label}</span>

                {/* Active Indicator Dot (Visible when collapsed) */}
                {isActive && isCollapsed && <div className="active-dot" />}
              </button>
            );
          })}
        </nav>
      </aside>

      <style>{`
        /* Sidebar Base container */
        .modern-sidebar {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
          z-index: 50;
          overflow: hidden;
        }

        /* Width States */
        .modern-sidebar.expanded {
          width: 280px;
        }

        .modern-sidebar.collapsed {
          width: 84px;
        }

        /* Header Section */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          border-bottom: 12px solid transparent;
          transition: padding 0.4s ease;
        }

        .collapsed .sidebar-header {
          justify-content: center;
          padding: 24px 0;
        }

        /* Branding */
        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .brand-logo {
          min-width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #002174, #0092E0);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 10px rgba(0, 146, 224, 0.3);
        }

        .brand-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .collapsed .brand-title {
          opacity: 0;
          width: 0;
          display: none;
        }

        .collapsed .brand-logo {
          display: none; /* Hide logo when collapsed to just show toggle button cleanly */
        }

        /* Toggle Button */
        .toggle-btn {
          background: #002174;
          color: #fff;
          font-size: 25px;
          width: 45px;
          height: 45px;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
          transform: scale(1.05);
        }

        /* Menu Container */
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 16px;
        }

        .collapsed .sidebar-menu {
          padding: 0 12px;
        }

        /* Menu Items */
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
        }

        .collapsed .sidebar-item {
          justify-content: center;
          padding: 16px 0;
        }

        .item-icon {
          color: #64748b;
          min-width: 45px;
          max-width: 45px;
          display: flex;
          border-radius: 100%;
          border: 2px solid #fff;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .item-label {
          font-size: 15px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.3s ease, color 0.3s ease;
        }

        .collapsed .item-label {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        /* Hover States */
        .sidebar-item:hover:not(.active) {
          background: #f1f5f9;
        }

        .sidebar-item:hover:not(.active) .item-icon,
        .sidebar-item:hover:not(.active) .item-label {
          color: #0f172a;
        }

        /* Active State - NIC Theme Gradient */
        .sidebar-item.active {
          background: linear-gradient(135deg, #002174, #0092E0);
          box-shadow: 0 4px 15px rgba(0, 146, 224, 0.25);
          transform: translateY(-1px);
        }

        .sidebar-item.active .item-icon,
        .sidebar-item.active .item-label {
          color: #ffffff;
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
          background: #ffffff;
          box-shadow: 0 0 4px rgba(255,255,255,0.8);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .modern-sidebar.expanded,
          .modern-sidebar.collapsed {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .sidebar-header {
             display: flex;
             padding: 16px;
          }
          
          .brand-title, .brand-logo {
             display: flex !important;
             opacity: 1 !important;
          }

          .toggle-btn {
             display: none; /* Hide toggle on top-nav mobile mode */
          }

          .sidebar-menu {
            flex-direction: row;
            overflow-x: auto;
            padding: 12px;
            gap: 12px;
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
