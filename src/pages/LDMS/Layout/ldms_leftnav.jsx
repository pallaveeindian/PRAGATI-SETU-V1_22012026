// src/pages/LDMS/Layout/ldms_leftnav.jsx
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_API } from "../../../api/axios";
import { clearAuth } from "../../../utils/storage";
import logo from "../../../assets/LDMS/logo.png";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaBook,
  FaHandsHelping,
  FaDatabase,
  FaAddressBook,
  FaClipboardCheck,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

/**
 * LDMS Left Navigation
 * - Fully responsive
 * - Layout-aware (no fixed positioning)
 * - Icon-only when collapsed
 */

const MENU = {
  bmmu: [
    { label: "Dashboard", to: "/ldms/bmmu/dashboard", icon: FaTachometerAlt },
    { label: "Meetings", to: "/ldms/meetings-list", icon: FaUsers },
    {
      label: "Demand Analytics",
      to: "/ldms/demand-analytics",
      icon: FaChartBar,
    },
    { label: "Scheme Dictionary", to: "/ldms/scheme-dictionary", icon: FaBook },
    {
      label: "Support Mapping",
      to: "/ldms/support-capture",
      icon: FaHandsHelping,
    },
    {
      label: "Support Bucket List",
      to: "/ldms/support-map-list",
      icon: FaAddressBook,
    },
    { label: "PLD Database", to: "/ldms/supported-pld-list", icon: FaDatabase },
    { label: "Reports", to: "/ldms/reports", icon: FaClipboardCheck },
  ],
  dmmu: [
    { label: "Dashboard", to: "/ldms/dmmu/dashboard", icon: FaTachometerAlt },
    { label: "Meetings", to: "/ldms/meetings-list", icon: FaUsers },
    { label: "Demand Analytics", to: "#", icon: FaChartBar },
    { label: "Scheme Dictionary", to: "/ldms/scheme-dictionary", icon: FaBook },
    {
      label: "Support Bucket List",
      to: "/ldms/support-map-list",
      icon: FaAddressBook,
    },
    { label: "Support benefit Extension", to: "#", icon: FaHandsHelping },
    { label: "PLD Database", to: "/ldms/supported-pld-list", icon: FaDatabase },
    { label: "Reports", to: "/ldms/reports", icon: FaClipboardCheck },
  ],
  smmu: [
    { label: "Dashboard", to: "/ldms/smmu/dashboard", icon: FaTachometerAlt },
    { label: "Scheme Dictionary", to: "/ldms/scheme-dictionary", icon: FaBook },
    {
      label: "Support Bucket List",
      to: "/ldms/support-map-list",
      icon: FaAddressBook,
    },
    { label: "Meetings", to: "/ldms/meetings-list", icon: FaUsers },
    { label: "Support benefit Extension", to: "#", icon: FaHandsHelping },
    { label: "PLD Database", to: "/ldms/supported-pld-list", icon: FaDatabase },
    { label: "Reports", to: "/ldms/reports", icon: FaClipboardCheck },
  ],
};

function getRoleKey(user) {
  const id = Number(user?.role_id ?? user?.role);
  if (id === 1) return "bmmu";
  if (id === 2) return "dmmu";
  if (id === 3) return "smmu";
  return "bmmu";
}

export default function LdmsLeftNav({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}) {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const roleKey = getRoleKey(user);
  const menu = MENU[roleKey] || [];

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const username = user?.username || user?.name || user?.email || "User";
  const avatarLetter = username.charAt(0).toUpperCase();

  const notifications = [
    "New AEP plan submitted in your block",
    "VPRP data updated for FY 2024",
    "15 new PLDs registered today",
    "Support benefits synced successfully",
  ];

  const handleLogout = async () => {
    try {
      await AUTH_API.logout();
    } catch (e) {
    } finally {
      clearAuth();
      window.location.href = "/";
    }
  };

  return (
    <aside
      className={`ldms-leftnav ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <button
        className={`ldms-burger ${mobileOpen ? "open" : ""}`}
        onClick={() => (mobileOpen ? onCloseMobile() : onToggle())}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* LOGO
      <div className="ldms-logo" onClick={() => navigate("/dashboard")}>
        <img src={logo} alt="LDMS" />
        <span className="logo-text">Benefica</span>
      </div> */}

      {/* NAV */}
      <nav className="ldms-nav">
        {menu.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              "ldms-nav-item" + (isActive ? " active" : "")
            }
          >
            <span className="nav-icon">
              <item.icon size={20} />
            </span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* MOBILE ONLY SECTION */}
      <div className="ldms-mobile-extra">
        {/* Profile */}
        <div
          className="ldms-nav-item mobile-item"
          onClick={() => {
            setShowUserMenu((v) => !v);
            setShowNotifications(false);
          }}
        >
          <span className="nav-icon">
            <FaUserCircle size={18} />
          </span>
          <span className="nav-label">{username}</span>
        </div>

        {/* Notifications */}
        <div
          className="ldms-nav-item mobile-item"
          onClick={() => {
            setShowNotifications((v) => !v);
            setShowUserMenu(false);
          }}
        >
          <span className="nav-icon">
            <FaBell size={18} />
          </span>
          <span className="nav-label">Notifications</span>
        </div>

        {/* Notification Panel */}
        {showNotifications && (
          <div className="ldms-mobile-panel">
            {notifications.map((n, i) => (
              <div key={i} className="ldms-mobile-panel-item">
                {n}
              </div>
            ))}
          </div>
        )}

        {/* Logout */}
        <div
          className="ldms-nav-item mobile-item logout"
          onClick={handleLogout}
        >
          <span className="nav-icon">
            <FaSignOutAlt size={18} />
          </span>
          <span className="nav-label">Logout</span>
        </div>
      </div>

      {/* TOGGLE */}
      <button className="ldms-toggle" onClick={onToggle}>
        {collapsed ? "→" : "←"}
      </button>

      {/* STYLES */}
      <style>{`
        .ldms-leftnav {
          width: 220px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: width 0.25s ease;
          overflow: hidden; 
        }

        .ldms-leftnav.collapsed {
          width: 64px;
        }

        /* Logo */
        .ldms-logo {
          height: 56px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          font-weight: 700;
          color: #c62828;
          white-space: nowrap;
        }

        .ldms-logo img {
          height: 45px;
          width: auto;
        }

        .logo-text {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .ldms-leftnav.collapsed .logo-text {
          opacity: 0;
          transform: translateX(-8px);
          pointer-events: none;
        }

        /* Nav */
        .ldms-nav {
          flex: 1;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .ldms-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
          font-size: 14px;
          transition: background 0.2s ease;
          white-space: nowrap;
        }

        .ldms-nav-item .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c62828;
          flex-shrink: 0;
        }

        /* Label animation */
        .nav-label {
          transition: opacity 0.2s ease, max-width 0.25s ease;
          overflow: hidden;
          white-space: nowrap;
          max-width: 160px;
        }

        .ldms-leftnav.collapsed .nav-label {
          opacity: 0;
          max-width: 0;
        }

        .ldms-nav-item:hover {
          background: #fdecea;
          transform: translateX(3px);
        }

        .ldms-nav-item.active {
          background: #c62828;
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(198,40,40,0.25);
        }

        .ldms-nav-item.active .dot {
          background: #ffffff;
        }

        /* Toggle */
        .ldms-toggle {
          width: 100%;
          height: 48px;
          border: none;
          background: #c62828;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #fff;
          margin: 0;
          display: block;
        }
        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          color: #c62828;
          transition: color 0.2s ease;
        }

        .ldms-nav-item.active .nav-icon {
          color: #ffffff;
        }

        /* Center icon when collapsed */
        .ldms-leftnav.collapsed .ldms-nav-item {
          justify-content: center;
          padding: 12px 0;
          gap: 0;
        }

        .ldms-leftnav.collapsed .nav-icon {
          margin: 0 auto;
        }      

        .ldms-mobile-extra {
          display: none;
        }

        .logout {
          color: #c62828;
        }

        /* MOBILE MODE */
        @media (max-width: 768px) {

          .ldms-nav {
            margin-top: 50px;
          }

          .ldms-mobile-panel {
            background: #ffffff;
            border: 1px solid #f1c0c0;
            border-radius: 8px;
            margin: 6px 0 12px 0;
            overflow: hidden;
            animation: fadeSlide 0.2s ease;
          }

          .ldms-mobile-panel-item {
            padding: 10px 12px;
            font-size: 13px;
            color: #1f2937;
            border-top: 1px solid #f3f4f6;
            transition: background 0.15s ease;
          }

          .ldms-mobile-panel-item:hover {
            background: #fdecea;
          }          

          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .ldms-mobile-extra {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px 10px 16px 10px;
            border-top: 1px solid #f1f1f1;
            background: #ffffff;
          }

          .ldms-leftnav {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 270px;
            background: #ffffff;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 100;
            box-shadow: 6px 0 24px rgba(0,0,0,0.18);
            border-right: 2px solid #c62828;
          }

          .ldms-leftnav.mobile-open {
            transform: translateX(0);
          }

          .mobile-item {
            background: #fafafa;
            border: 1px solid #f3f4f6;
          }

          .mobile-item:hover {
            background: #fdecea;
          }

          /* Logout special (green accent) */
          .logout {
            color: #1b5e20;
          }

          .logout .nav-icon {
            color: #2e7d32;
          }

          .logout:hover {
            background: #e8f5e9;
          }          
        }        
      `}</style>
    </aside>
  );
}
