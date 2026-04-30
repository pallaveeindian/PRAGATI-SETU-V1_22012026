// src/pages/EPSMS/Layout/EpsmsLeftnav.jsx
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_API } from "../../../api/axios";
import { clearAuth } from "../../../utils/storage";
import logo from "../../../assets/ems_logo.png";
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
 * EPSMS Left Navigation
 * - Fully responsive
 * - Layout-aware (no fixed positioning)
 * - Icon-only when collapsed
 */

const MENU = {
    crp_record: [
        {
            label: "CRP-EP Form",
            to: "/epsms/crp-form",
            icon: FaAddressBook,
        },
        { label: "Recorded CRPs", to: "/epsms/recorded-crps", icon: FaDatabase },
    ],
};

function getRoleKey(user) {
    const id = Number(user?.role_id ?? user?.role);
    if (id === 12) return "crp_record";
    return "crp_record";
}

export default function EpsmsLeftnav({
    collapsed,
    onToggle,
    mobileOpen,
    onCloseMobile,
}) {
    const { user } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const roleKey = getRoleKey(user);
    const menu = MENU[roleKey] || [];

    const username = user?.username || user?.name || user?.email || "User";
    const avatarLetter = username.charAt(0).toUpperCase();

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
            className={`epsms-leftnav ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        >
            <button
                className={`epsms-burger ${mobileOpen ? "open" : ""}`}
                onClick={() => (mobileOpen ? onCloseMobile() : onToggle())}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* LOGO
      <div className="epsms-logo" onClick={() => navigate("/dashboard")}>
        <img src={logo} alt="EPSMS" />
        <span className="logo-text">Benefica</span>
      </div> */}

            {/* NAV */}
            <nav className="epsms-nav">
                {menu.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) =>
                            "epsms-nav-item" + (isActive ? " active" : "")
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
            <div className="epsms-mobile-extra">
                {/* Profile */}
                <div
                    className="epsms-nav-item mobile-item"
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

                {/* Logout */}
                <div
                    className="epsms-nav-item mobile-item logout"
                    onClick={handleLogout}
                >
                    <span className="nav-icon">
                        <FaSignOutAlt size={18} />
                    </span>
                    <span className="nav-label">Logout</span>
                </div>
            </div>

            {/* TOGGLE */}
            <button className="epsms-toggle" onClick={onToggle}>
                {collapsed ? "→" : "←"}
            </button>

            {/* STYLES */}
            <style>{`
        .epsms-leftnav {
          width: 220px;
          background: var(--epsms-red-light);
          border-right: 1px solid var(--epsms-muted);
          display: flex;
          flex-direction: column;
          transition: width 0.25s ease;
          overflow: hidden; 
          margin-top: 20px;
        }

        .epsms-leftnav.collapsed {
          width: 64px;
        }

        /* Logo */
        .epsms-logo {
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

        .epsms-logo img {
          height: 45px;
          width: auto;
        }

        .logo-text {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .epsms-leftnav.collapsed .logo-text {
          opacity: 0;
          transform: translateX(-8px);
          pointer-events: none;
        }

        /* Nav */
        .epsms-nav {
          flex: 1;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .epsms-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--epsms-text-dark);
          font-size: 14px;
          transition: background 0.2s ease;
          white-space: nowrap;
        }

        .epsms-nav-item .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--epsms-red);
          flex-shrink: 0;
        }

        /* Label animation */
        .nav-label {
          transition: opacity 0.2s ease, max-width 0.25s ease;
          overflow: hidden;
          white-space: nowrap;
          max-width: 160px;
        }

        .epsms-leftnav.collapsed .nav-label {
          opacity: 0;
          max-width: 0;
        }

        .epsms-nav-item:hover {
          background: var(--epsms-red-light);
          transform: translateX(3px);
        }

        .epsms-nav-item.active {
          background: var(--epsms-red);
          color: var(--epsms-red-light);
          box-shadow: 0 6px 14px var(--epsms-red);
        }

        .epsms-nav-item.active .dot {
          background: var(--epsms-white);
        }

        /* Toggle */
        .epsms-toggle {
          height: 40px;
          border: none;
          width: 100%; 
          background: var(--epsms-red);
          border-top: 1px solid var(--epsms-muted);
          cursor: pointer;
          font-size: 14px;
          color: var(--epsms-white);
          border-radius: 0px;
        }
        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          color: var(--epsms-red);
          transition: color 0.2s ease;
        }

        .epsms-nav-item.active .nav-icon {
          color: var(--epsms-white);
        }

        /* Center icon when collapsed */
        .epsms-leftnav.collapsed .epsms-nav-item {
          justify-content: center;
          padding: 12px 0;
          gap: 0;
        }

        .epsms-leftnav.collapsed .nav-icon {
          margin: 0 auto;
        }      

        .epsms-mobile-extra {
          display: none;
        }

        .logout {
          color: var(--epsms-red);
        }

        /* MOBILE MODE */
        @media (max-width: 768px) {

          .epsms-nav {
            margin-top: 50px;
          }

          .epsms-mobile-panel {
            background: var(--epsms-white);
            border: 1px solid var(--epsms-muted);
            border-radius: 8px;
            margin: 6px 0 12px 0;
            overflow: hidden;
            animation: fadeSlide 0.2s ease;
          }

          .epsms-mobile-panel-item {
            padding: 10px 12px;
            font-size: 13px;
            color: var(--epsms-text-dark);
            border-top: 1px solid var(--epsms-muted);
            transition: background 0.15s ease;
          }

          .epsms-mobile-panel-item:hover {
            background: var(--epsms-red-light);
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

          .epsms-mobile-extra {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px 10px 16px 10px;
            border-top: 1px solid var(--epsms-muted);
            background: var(--epsms-white);
          }

          .epsms-leftnav {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 270px;
            background: var(--epsms-white);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 100;
            box-shadow: 6px 0 24px var(--epsms-muted);
            border-right: 2px solid var(--epsms-red);
          }

          .epsms-leftnav.mobile-open {
            transform: translateX(0);
          }

          .mobile-item {
            background: var(--epsms-white);
            border: 1px solid var(--epsms-muted);
          }

          .mobile-item:hover {
            background: var(--epsms-red-light);
          }

          /* Logout special (green accent) */
          .logout {
            color: var(--epsms-green);
          }

          .logout .nav-icon {
            color: var(--epsms-green);
          }

          .logout:hover {
            background: var(--epsms-green);
          }          
        }        
      `}</style>
        </aside>
    );
}