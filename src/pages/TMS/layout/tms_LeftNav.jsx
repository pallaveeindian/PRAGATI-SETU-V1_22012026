// src/pages/TMS/layout/tms_LeftNav.jsx
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import logo from "../../../assets/TMS/tms_logo.png";
import TopNav from "./tms_TopNav";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaBook,
  FaHandsHelping,
  FaDatabase,
  FaAddressBook,
  FaClipboardCheck,
  FaBullseye,
  FaIndustry,
  FaBuilding,
  FaChalkboardTeacher,
  FaUserCheck,
  FaUserEdit,
} from "react-icons/fa";

/**
 * TMS Left Navigation
 * - Fully responsive
 * - Layout-aware (no fixed positioning)
 * - Icon-only when collapsed
 */

const MENU = {
  bmmu: [
    { label: "Dashboard", to: "/tms/bmmu/dashboard", icon: FaTachometerAlt },
    {
      label: "Create Training Request",
      to: "/tms/create-training-request",
      icon: FaBook,
    },
    {
      label: "Training Requests",
      to: "/tms/training-requests",
      icon: FaChartBar,
    },
    // {
    //   label: "Propose Training Plan",
    //   to: "/tms/tms/bmmu/create-training-plan",
    //   icon: FaBook,
    // },
    // {
    //   label: "Training Batches",
    //   to: "/tms/batches-list/",
    //   icon: FaBook,
    // },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
        },
      ],
    },
    { label: "Reports", to: "#", icon: FaClipboardCheck },
  ],
  dmmu: [
    { label: "Dashboard", to: "/tms/dmmu/dashboard", icon: FaTachometerAlt },
    {
      label: "Create Training Request",
      to: "/tms/create-training-request",
      icon: FaBook,
    },
    {
      label: "Training Requests",
      to: "/tms/training-requests",
      icon: FaChartBar,
    },
    // {
    //   label: "Training Batches",
    //   to: "/tms/batches-list/",
    //   icon: FaBook,
    // },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
        },
      ],
    },
    { label: "Reports", to: "#", icon: FaClipboardCheck },
  ],
  smmu: [
    { label: "Dashboard", to: "/tms/smmu/dashboard", icon: FaTachometerAlt },
    {
      label: "Target Assignment",
      to: "/tms/smmu/partner-targets",
      icon: FaBullseye,
    },
    {
      label: "Training Requests",
      to: "/tms/training-requests",
      icon: FaChartBar,
    },
    // {
    //   label: "Training Batches",
    //   to: "/tms/batches-list/",
    //   icon: FaBook,
    // },

    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
        },
      ],
    },
    { label: "Reports", to: "#", icon: FaClipboardCheck },
  ],
  training_partner: [
    {
      label: "Dashboard",
      to: "/tms/tp/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "Centre Management",
      to: "/tms/tp/centre-list",
      icon: FaIndustry,
    },
    {
      label: "Register New Centre",
      to: "/tms/tp/centre/new",
      icon: FaBuilding,
    },
    {
      label: "Training Requests",
      to: "/tms/training-requests",
      icon: FaChartBar,
    },
    // {
    //   label: "Training Batches",
    //   to: "/tms/batches-list/",
    //   icon: FaBook,
    // },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
        },
      ],
    },
    {
      label: "Contact Persons",
      to: "/tms/tp/cp-list",
      icon: FaUsers,
    },
    {
      label: "Register Contact Persons",
      to: "/tms/tp/cp/create",
      icon: FaUserEdit,
    },
    {
      label: "Assign Contact Persons",
      to: "/tms/tp/cp/assign",
      icon: FaUserCheck,
    },
  ],
  master_trainer: [
    {
      label: "Dashboard",
      to: "/tms/mt/dashboard",
      icon: FaTachometerAlt,
    },
  ],
  tp_contact_person: [
    {
      label: "Dashboard",
      to: "/tms/cp/dashboard",
      icon: FaTachometerAlt,
    },
    // {
    //   label: "Training Batches",
    //   to: "/tms/cp/batch-list",
    //   icon: FaBook,
    // },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/cp/batch-list",
        },
      ],
    },
  ],
  state_admin: [
    {
      label: "Dashboard",
      to: "/tms/state-admin/dashboard",
      icon: FaTachometerAlt,
    },
  ],
  pmu_admin: [
    {
      label: "Dashboard",
      to: "/tms/pmu-admin/dashboard",
      icon: FaTachometerAlt,
    },
  ],
};

function getRoleKey(user) {
  const id = Number(user?.role_id ?? user?.role);
  if (id === 1) return "bmmu";
  if (id === 2) return "dmmu";
  if (id === 3) return "smmu";
  if (id === 4) return "training_partner";
  if (id === 7) return "master_trainer";
  if (id === 8) return "state_admin";
  if (id === 9) return "pmu_admin";
  if (id === 11) return "tp_contact_person";
  return "bmmu";
}

export default function TmsLeftNav({ collapsed, onToggle }) {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleKey = getRoleKey(user);
  const menu = MENU[roleKey] || [];
  // ✅ NEW
  const [openDropdown, setOpenDropdown] = useState(null);
  return (
    <>
      <button className="tms-mobile-burger" onClick={() => setMobileOpen(true)}>
        ☰
      </button>
      <aside
        className={`tms-leftnav 
  ${collapsed ? "collapsed" : ""} 
  ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* LOGO */}
        <div className="tms-logo" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="TMS" />
          <span className="logo-text">Training Management System</span>
        </div>

        {/* NAV */}
        <nav className="tms-nav">
          {/* {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                "tms-nav-item" + (isActive ? " active" : "")
              }
            >
              <span className="nav-icon">
                <item.icon size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))} */}

          {menu.map((item) => {
            // ✅ NEW: HANDLE DROPDOWN MENU
            if (item.children) {
              const isOpen = openDropdown === item.label;

              return (
                <div key={item.label}>
                  {/* Parent */}
                  <div
                    className="tms-nav-item"
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                  >
                    <span className="nav-icon">
                      <item.icon size={20} />
                    </span>
                    <span className="nav-label">
                      {item.label}
                      <span style={{ marginLeft: "auto" }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </span>
                  </div>

                  {/* Children */}
                  {isOpen && (
                    <div className="tms-submenu">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.label}
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            "tms-submenu-item" + (isActive ? " active" : "")
                          }
                        >
                          <span className="dot" />
                          <item.icon size={20} />
                          <span>{sub.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            //
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  "tms-nav-item" + (isActive ? " active" : "")
                }
              >
                <span className="nav-icon">
                  <item.icon size={20} />
                </span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
          <TopNav />
        </nav>

        {/* TOGGLE */}
        <button className="tms-toggle" onClick={onToggle}>
          {collapsed ? "→" : "←"}
        </button>

        {/* STYLES */}
        <style>{`
.tms-leftnav {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
}

.tms-leftnav.collapsed {
  width: 64px;
}

/* Logo */
.tms-logo {
  height: 56px;
  display: flex;
  align-items: center; 
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px; 
  color: #061b46;
  padding: 0 8px; 
}

.tms-logo img {
  height: 42px; 
  width: auto;
}

.logo-text {
  transition: opacity 0.2s ease, transform 0.2s ease;
  align-self: center;
  line-height: 1.2;
}

.tms-leftnav.collapsed .logo-text {
  display: none;
}

/* Nav */
.tms-nav {
  flex: 1;
  padding: 12px 6px; 
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  scrollbar-width: thin; 
}

/*  scrollbar */
.tms-nav::-webkit-scrollbar {
  width: 6px;
}
.tms-nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 6px;
}

.tms-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #061b46;
  font-size: 14px;
  transition: all 0.2s ease; 
  white-space: nowrap;
  cursor: pointer; 
}

.tms-nav-item .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #061b46;
  flex-shrink: 0;
}

/* Label animation */
.nav-label {
  display: flex; 
  align-items: center;
  width: 100%;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tms-leftnav.collapsed .nav-label {
  opacity: 0;
  width: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  pointer-events: none;
}

.tms-nav-item:hover {
  background: #e8f0f8; 
}

.tms-nav-item.active {
  background: #061b46;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15); 
}

.tms-nav-item.active .dot {
  background: #ffffff;
}

/* Toggle */
.tms-toggle {
  height: 40px;
  border: none;
  background: #061b46;
  border-top: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  transition: background 0.2s ease; ]
}

.tms-toggle:hover {
  background: #0a2a6b; ]
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  color: #061b46;
  transition: color 0.2s ease;
}

.tms-nav-item.active .nav-icon {
  color: #ffffff;
}

/* Center icon when collapsed */
.tms-leftnav.collapsed .tms-nav-item {
  justify-content: center;
  padding: 10px 0;
  gap: 0;
}

.tms-leftnav.collapsed .nav-icon {
  margin: 0 auto;
}

.tms-leftnav.collapsed .tms-logo {
  justify-content: center;
  padding: 0;
}

.tms-leftnav.collapsed .tms-logo img {
  margin: 0 auto;
  display: block;
}

/* SUBMENU */
.tms-submenu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 32px; 
  margin-top: 2px;
}

.tms-submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 6px;
  text-decoration: none;
  color: #061b46;
  transition: all 0.2s ease; 
}

.tms-submenu-item:hover {
  background: #f1f5f9; 
}

.tms-submenu-item.active {
  background: #061b46;
  color: white;
}

.tms-submenu-item .dot {
  width: 5px;
  height: 5px;
  background: currentColor;
  border-radius: 50%;
}
`}</style>
      </aside>
      {mobileOpen && (
        <div
          className="tms-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <style>{`
/* MOBILE BURGER */
.tms-mobile-burger {
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1200;
  background: #061b46;
  color: white;
  border: none;
  padding: 8px 10px;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
}

/* MOBILE OVERLAY */
.tms-mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4); 
  z-index: 1100;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {

  .tms-mobile-burger {
    display: block;
  }

  .tms-leftnav {
    position: fixed;
    top: 0;
    left: -240px;
    width: 240px;
    height: 100dvh;
    background: #ffffff;
    z-index: 1201;
    transition: left 0.3s ease;
    box-shadow: 2px 0 12px rgba(0,0,0,0.2); 
  }

  .tms-leftnav.mobile-open {
    left: 0;
  }

}
`}</style>
    </>
  );
}
