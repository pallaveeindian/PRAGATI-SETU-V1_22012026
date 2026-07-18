// src/pages/TMS/layout/tms_LeftNav.jsx
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";
import logo from "../../../assets/TMS/tms_logo.png";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaBook,
  FaHandsHelping,
  FaDatabase,
  FaCalendar,
  FaAddressBook,
  FaClipboardCheck,
  FaBullseye,
  FaIndustry,
  FaBuilding,
  FaChalkboardTeacher,
  FaUser,
  FaUserCheck,
  FaUserEdit,
  FaChalkboard,
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
    {
      label: "Targets vs Achievement",
      to: "/tms/bmmu/tp-TvA",
      icon: FaChalkboard,
    },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
          icon: FaAddressBook,
        },
      ],
    },
    { label: "Reports", to: "/tms/training-report", icon: FaClipboardCheck },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  dmmu: [
    { label: "Dashboard", to: "/tms/dmmu/dashboard", icon: FaTachometerAlt },
    // {
    //   label: "Master Trainer DB",
    //   to: "/tms/dmmu/master-trainers",
    //   icon: FaBuilding,
    // },
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
    {
      label: "Targets vs Achievement",
      to: "/tms/dmmu/tp-TvA",
      icon: FaChalkboard,
    },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
          icon: FaAddressBook,
        },
      ],
    },
    { label: "Reports", to: "/tms/training-report", icon: FaClipboardCheck },
    {
      label: "User Management",
      to: "/tms/dmmu/bmmu-users",
      icon: FaUsers,
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  smmu: [
    { label: "Dashboard", to: "/tms/smmu/dashboard", icon: FaTachometerAlt },
    {
      label: "Target Assignment",
      to: "/tms/smmu/partner-targets",
      icon: FaBullseye,
    },
    {
      label: "Training Modules",
      icon: FaChalkboardTeacher,
      children: [
        {
          label: "All Modules list",
          to: "/tms/smmu/list-training-plans",
          icon: FaAddressBook,
        },
        {
          label: "Add New Module",
          to: "/tms/smmu/create-training-plan",
          icon: FaBook,
        },
      ],
    },
    {
      label: "Master Trainer DB",
      icon: FaBuilding,
      children: [
        {
          label: "All Trainer list",
          to: "/tms/smmu/master-trainers",
          icon: FaAddressBook,
        },
        {
          label: "Pending Certificate Approval",
          to: "/tms/smmu/master-trainers/approvals",
          icon: FaBook,
        },
      ],
    },
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
    {
      label: "Targets vs Achievement",
      to: "/tms/smmu/tp-TvA",
      icon: FaChalkboard,
    },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
          icon: FaAddressBook,
        },
      ],
    },
    { label: "Reports", to: "/tms/training-report", icon: FaClipboardCheck },
    {
      label: "User Management",
      to: "/tms/smmu/dmmu-users",
      icon: FaUsers,
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
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
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/batches-list/",
          icon: FaAddressBook,
        },
        {
          label: "Batch Calendar",
          to: "/tms/batches-list/",
          icon: FaCalendar,
        },
      ],
    },
    {
      label: "User Management",
      to: "/tms/tp/users",
      icon: FaUsers,
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  dtp: [
    {
      label: "Dashboard",
      to: "/tms/dtp/dashboard",
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
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch Creator",
          to: "/tms/batch-creator/",
          icon: FaBook,
        },
        {
          label: "Batch List",
          to: "/tms/batches-list/",
          icon: FaAddressBook,
        },
      ],
    },
    {
      label: "TC Management",
      icon: FaUsers,
      children: [
        {
          label: "TC-ID List",
          to: "/tms/tp/cp-list",
          icon: FaUser,
        },
        {
          label: "Register TC-ID",
          to: "/tms/tp/cp/create",
          icon: FaUserEdit,
        },
        {
          label: "Assign Centre to TC-ID",
          to: "/tms/tp/cp/assign",
          icon: FaUserCheck,
        },
      ],
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  master_trainer: [
    {
      label: "Dashboard",
      to: "/tms/mt/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  tp_contact_person: [
    {
      label: "Dashboard",
      to: "/tms/cp/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "Training Batches",
      icon: FaBook,
      children: [
        {
          label: "Batch List",
          to: "/tms/cp/batch-list",
          icon: FaAddressBook,
        },
      ],
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  state_admin: [
    {
      label: "Dashboard",
      to: "/tms/state-admin/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
  pmu_admin: [
    {
      label: "Dashboard",
      to: "/tms/pmu-admin/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "Grievances",
      to: "/admin/grievances",
      icon: FaHandsHelping,
    },
  ],
};

function getRoleKey(user) {
  const id = Number(user?.role_id ?? user?.role);
  if (id === 8) return "state_admin";
  if (id === 9) return "pmu_admin";
  if (id === 1) return "bmmu";
  if (id === 2) return "dmmu";
  if (id === 3) return "smmu";
  if (id === 4) return "training_partner";
  if (id === 13) return "dtp";
  if (id === 11) return "tp_contact_person";
  if (id === 7) return "master_trainer";
  return "bmmu";
}

export default function TmsLeftNav({ collapsed, onToggle }) {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleKey = getRoleKey(user);
  const menu = MENU[roleKey] || [];
  const username = user?.username || user?.name || "Guest";
  const initial = username.charAt(0).toUpperCase();
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // 👈 NEW: State to hold Organization Name
  const [orgName, setOrgName] = useState(() => {
    return sessionStorage.getItem(`tp_org_name_${user?.id}`) || "";
  });

  useEffect(() => {
    const handleClick = () => setShowUserPopup(false);

    if (showUserPopup) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showUserPopup]);

  // Fetch Organization Name if the user is a Training Partner
  useEffect(() => {
    if (roleKey === "training_partner" && user?.id && !orgName) {
      const fetchOrgName = async () => {
        try {
          // Passing user ID to filter/search.
          const res = await TMS_API.trainingPartners.list({ search: user.id });
          const partner = res?.data?.results?.find(
            (p) => p.master_user === user.id,
          );

          if (partner?.name) {
            setOrgName(partner.name);
            sessionStorage.setItem(`tp_org_name_${user.id}`, partner.name);
          }
        } catch (error) {
          console.error("Failed to fetch organization name:", error);
        }
      };
      fetchOrgName();
    }
  }, [roleKey, user?.id, orgName]);

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

        {/* LEFT: LOGO CLICK ONLY */}
        <div className="logo-click" onClick={() => navigate("/dashboard")}>
          {/* <img src={logo} alt="logo" /> */}
        </div>

        {/* RIGHT: USER SECTION */}
        <div className="user-wrapper">
          <button
            className="user-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowUserPopup((prev) => !prev);
            }}
          >
            <div className="avatar">{initial}</div>

            {/* 👈 NEW: Render Username + Org Name seamlessly */}
            <div
              className="username-text"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {username}
              </span>
              {orgName && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "400",
                    opacity: 0.9,
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "wrap",
                  }}
                >
                  {orgName}
                </span>
              )}
            </div>
          </button>

          {showUserPopup && (
            <div className="user-popup" onClick={(e) => e.stopPropagation()}>
              <div style={{ fontWeight: "bold" }}>{username}</div>
              {/* 👈 NEW: Show Org Name in the popup dropdown */}
              {orgName && (
                <div
                  style={{ fontSize: "12px", marginTop: "4px", color: "#666" }}
                >
                  {orgName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="tms-nav">
          {menu.map((item) => {
            // HANDLE DROPDOWN MENU
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
                          <sub.icon size={20} />
                          <span>{sub.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Standard NavItem
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
        </nav>

        {/* TOGGLE */}
        <button className="tms-toggle" onClick={onToggle}>
          {collapsed ? "→" : "←"}
        </button>

        {/* STYLES */}
        <style>{`
.tms-leftnav {
  width: 220px;
  background: linear-gradient(
    180deg,
    #002073 0%,
    #0167b6 52%,
    #0093e1 100%
  );
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
}

.tms-leftnav.collapsed {
  width: 64px;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff8c00, #ff5e00);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  width: 100%;          /* fit inside sidebar */
  max-width: 100%;
  overflow: hidden;
  margin: 6px 0;        /* remove side overflow */
}

.username-text {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* ... */
}

.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: white;
  color: #ff5e00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.user-wrapper {
  position: relative;
  width: 100%;
}

.user-popup {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: white;
  color: #002073;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2000;
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

/* scrollbar */
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
  color: #ffffff;
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
  color: #002073;
}

.tms-nav-item.active {
  background: #0093e1;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15); 
}

.tms-nav-item.active .dot {
  background: #ffffff;
}

/* Toggle */
.tms-toggle {
  height: 40px;
  width: 100%;             /* IMPORTANT */
  border: none;
  background: #002073;
  border-top: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  transition: background 0.2s ease;
  display: flex;           /* center alignment */
  align-items: center;
  justify-content: center;
}

.tms-toggle:hover {
  background: #0a2a6b; 
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  color:  #ffffff;
  transition: color 0.2s ease;
}

.tms-nav-item:hover .nav-icon {
  color: #002073;
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
  color: #ffffff;
  transition: all 0.2s ease; 
}

.tms-submenu-item:hover {
  background: #f1f5f9; 
color: #002073;
  
}

.tms-submenu-item.active {
  background:  #0093e1;
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
