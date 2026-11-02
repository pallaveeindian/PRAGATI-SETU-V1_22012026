// src\pages\AdminPages\Layout\AdminSidebar.jsx
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaChartBar,
  FaFileAlt,
  FaUsers,
  FaClipboardList,
  FaBars,
  FaArrowLeft,
  FaChevronDown,
  FaChevronRight,
  FaBullseye,
  FaBook,
  FaFileSignature,
  FaDatabase,
  FaListAlt,
} from "react-icons/fa";

const ENGAGEMENT_CHILD_NAMES = ["Trainer Check", "Beneficiary Check"];
const MASTER_TRAINER_CHILD_NAMES = [
  "Master Trainer Registration Status",
  "All Trainer List",
];
const TMS_CHILD_NAMES = [
  "TMS Portal Summary",
  "User Management",
  "Training Batch List",
  "Training Request List",
  "Training Target",
  "Learning Material",
  "Center Management",
  ...ENGAGEMENT_CHILD_NAMES,
  "Master Trainer DB",
  ...MASTER_TRAINER_CHILD_NAMES,
];

const AdminSidebar = ({
  activeMenu,
  setActiveMenu,
  isCollapsed,
  onToggleSidebar,
  fixed = false,
  transparent = false,
  currentGradient,
}) => {
  const [openMenus, setOpenMenus] = useState(() => ({
    "TMS Portal": TMS_CHILD_NAMES.includes(activeMenu),
    "Master Trainer DB":
      activeMenu === "Master Trainer DB" ||
      MASTER_TRAINER_CHILD_NAMES.includes(activeMenu),
  }));

  useEffect(() => {
    if (TMS_CHILD_NAMES.includes(activeMenu)) {
      setOpenMenus((menus) => ({ ...menus, "TMS Portal": true }));
    } ;
    if (MASTER_TRAINER_CHILD_NAMES.includes(activeMenu)) {
      setOpenMenus((menus) => ({ ...menus, "Master Trainer DB": true }));
    }
  }, [activeMenu]);

 const menuItems = [
  { name: "Home Dashboard", icon: <FaHome /> },
  { name: "Grievances List", icon: <FaChartBar /> },
  {
    name: "TMS Portal",
    icon: <FaFileAlt />,
    isParent: true,
    children: [
      { name: "TMS Portal Summary", icon: <FaChartBar /> },
      { name: "User Management", icon: <FaUsers /> },
      { name: "Training Batch List", icon: <FaClipboardList /> },
      { name: "Training Request List", icon: <FaFileSignature /> },
      { name: "Training Target", icon: <FaBullseye /> },
      { name: "Learning Material", icon: <FaBook /> },
      { name: "Center Management", icon: <FaClipboardList /> },
      { name: "Trainer Check", icon: <FaClipboardList /> },
      { name: "Beneficiary Check", icon: <FaBullseye /> },
      
      // --- NEW NESTED PARENT ADDED HERE ---
      {
        name: "Master Trainer DB",
        icon: <FaDatabase />, 
        isParent: true,
        children: [
          { name: "Master Trainer Registration Status", icon: <FaClipboardList /> },
          { name: "All Trainer List", icon: <FaListAlt /> },
        ],
      },
      // ------------------------------------
    ],
  },
];


  const handleMenuClick = (item) => {
    if (item.isParent) {
      setOpenMenus((menus) => ({
        ...menus,
        [item.name]: !menus[item.name],
      }));
      return;
    }

    setActiveMenu(item.name);
  };

  // Reusable function to render menu buttons (both parent and children)
  const renderMenuButton = (item, isChild = false) => {
    const isActive = activeMenu === item.name;
    const isOpen = Boolean(openMenus[item.name]);

    return (
      <button
        key={item.name}
        type="button"
        onClick={() => handleMenuClick(item)}
        style={{
          textAlign: "left",
          width: "100%",
          padding: "12px 14px",
          cursor: "pointer",
          borderRadius: "10px",
          // Semi-transparent background for the active state
          background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
          color: "#fff",
          border: isActive
            ? "1px solid rgba(255, 255, 255, 0.4)"
            : "1px solid transparent",
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          alignItems: "center",
          transition: "all 0.2s ease",
          fontWeight: 600,
          fontSize: isChild ? "14px" : "15px", // Slightly smaller font for nested items
          boxShadow: isActive ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
        }}
        title={item.name}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "translateX(2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isActive
            ? "rgba(255, 255, 255, 0.2)"
            : "transparent";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: isCollapsed ? "center" : "flex-start",
            width: "100%",
          }}
        >
          <span
            style={{ fontSize: "16px", display: "flex", alignItems: "center" }}
          >
            {item.icon}
          </span>
          {!isCollapsed && <span>{item.name}</span>}
        </div>

        {/* Show toggle arrow only for parent menus when sidebar is expanded */}
        {!isCollapsed && item.isParent && (
          <span style={{ fontSize: "12px" }}>
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
      </button>
    );
  };

  const renderMenuItems = (items, level = 0) =>
    items.map((item) => (
      <React.Fragment key={item.name}>
        {renderMenuButton(item, level > 0)}
        {item.isParent && openMenus[item.name] && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingLeft: isCollapsed ? "0px" : "25px",
              marginTop: "4px",
              borderLeft: isCollapsed
                ? "none"
                : "2px solid rgba(255, 255, 255, 0.2)",
              marginLeft: isCollapsed ? "0px" : "15px",
            }}
          >
            {renderMenuItems(item.children || [], level + 1)}
          </div>
        )}
      </React.Fragment>
    ));

  return (
    <div
      className={transparent ? "admin-sidebar-transparent" : ""}
      style={{
        width: isCollapsed ? "72px" : "260px",
        minWidth: isCollapsed ? "72px" : "260px",
        height: "calc(100vh - 70px)",

       
        background: transparent ? "rgba(15, 23, 42, 0.38)" : currentGradient,

        color: "#fff",
        padding: isCollapsed ? "16px 8px" : "18px 16px",
        boxSizing: "border-box",
        zIndex: "999",
        overflowY: "auto",
        
        transition:
          "width 0.25s ease, min-width 0.25s ease, background 0.5s ease",
        boxShadow: "2px 0 12px rgba(15, 23, 42, 0.15)",
        flexShrink: 0,
        alignSelf: "flex-start",
        position: fixed ? "fixed" : "sticky",
        top: fixed ? "70px" : 0,
        left: fixed ? 0 : undefined,
      }}
    >
      <style>{`
                .admin-sidebar-transparent {
                    backdrop-filter: blur(7px);
                }
            `}</style>

      {/* Toggle Sidebar Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            width: "100%",
            height: "42px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            background: "rgba(0, 0, 0, 0.15)",
            color: "#fff",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "700",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.15)";
          }}
        >
          {isCollapsed ? (
            <FaBars />
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaArrowLeft /> Close Sidebar
            </span>
          )}
        </button>
      </div>

      {/* Menu Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {renderMenuItems(menuItems)}
      </div>
    </div>
  );
};

export default AdminSidebar;
