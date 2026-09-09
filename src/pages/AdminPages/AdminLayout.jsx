// src/pages/AdminPages/Layout/AdminLayout.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import homeDashboardImage from "../../assets/PMU/pmuu.png";
import AdminHeader from "./Layout/AdminHeader";
import AdminSidebar from "./Layout/AdminSidebar";
import TmsPortal from "./TmsPortal/TmsPortal";
import AdminGreivancesList from "./GreivancesList/AdminGreivancesList";
import UserManagement from "./UserManagement";
import TrainingBatchList from "./TmsPortal/TrainingBatch/TrainingBatchList";
import TrainingRequestList from "./TmsPortal/TrainingRequest/TrainingRequestList";
import TrainingTarget from "./TmsPortal/TrainingTarget/TrainigTargetList";
import HomeDashboard from "./HomeDashboard";


const tabGradients = {
  "Grievances List": "linear-gradient(to bottom, rgb(43, 2, 7) 0%, rgb(74, 4, 16) 12%, rgb(107, 9, 26) 28%, rgb(139, 17, 34) 45%, rgb(185, 28, 28) 60%, rgb(220, 38, 38) 75%, rgb(239, 68, 68) 88%, rgb(252, 165, 165) 100%)",
  
  "TMS Portal": "linear-gradient(to bottom, rgb(2, 19, 46) 0%, rgb(4, 33, 82) 12%, rgb(6, 44, 110) 28%, rgb(8, 57, 138) 45%, rgb(10, 74, 170) 60%, rgb(29, 99, 201) 75%, rgb(61, 130, 224) 88%, rgb(185, 215, 251) 100%)",
  
  "User Management": "linear-gradient(to bottom, #3a1c71, #d76d77, #ffaf7b)",
  
  "Training Batch List": "linear-gradient(to bottom, rgb(46, 17, 3) 0%, rgb(77, 28, 6) 12%, rgb(118, 43, 8) 28%, rgb(161, 62, 10) 45%, rgb(209, 87, 13) 60%, rgb(249, 115, 22) 75%, rgb(253, 164, 99) 88%, rgb(254, 215, 170) 100%)",

  "Training Request List": "linear-gradient(to bottom, rgb(5, 46, 22) 0%, rgb(20, 83, 45) 12%, rgb(22, 101, 52) 28%, rgb(21, 128, 61) 45%, rgb(22, 163, 74) 60%, rgb(34, 197, 94) 75%, rgb(74, 222, 128) 88%, rgb(187, 247, 208) 100%)",

  "Training Target": "linear-gradient(to bottom, #1d4ed8 0%, #e11d48 100%)" ,
  
  "Default": "linear-gradient(to bottom, #1d4ed8 0%, #e11d48 100%)" 
};

export default function AdminLayout({ children, defaultActiveMenu = "Home Dashboard" }) {
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() =>
    searchParams.get("section") === "training-requests"
      ? "Training Request List"
      : defaultActiveMenu
  );
  
  const isHomeDashboard = activeMenu === "Home Dashboard";
  
  const currentGradient = tabGradients[activeMenu] || tabGradients["Default"];

  return (
    <div
      className={isHomeDashboard ? "admin-layout admin-layout-home" : "admin-layout"}
      style={isHomeDashboard ? { backgroundImage: `url(${homeDashboardImage})` } : undefined}
    >
      <AdminHeader transparent={isHomeDashboard} currentGradient={currentGradient} />

      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          transparent={isHomeDashboard}
          currentGradient={currentGradient} 
        />

        <div className="admin-layout-content">
          {activeMenu === "TMS Portal" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><TmsPortal /></div>
          ) : activeMenu === "User Management" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><UserManagement /></div>
          ) : activeMenu === "Training Batch List" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><TrainingBatchList /></div>
          ) : activeMenu === "Training Request List" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><TrainingRequestList /></div>
          ) : activeMenu === "Training Target" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><TrainingTarget /></div>
          ) : activeMenu === "Home Dashboard" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><HomeDashboard /></div>
          ) : activeMenu === "Grievances List" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}><AdminGreivancesList /></div>
          ) : (
            children
          )}
        </div>
      </div>

      <style>{`
        .admin-layout { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background-color: #f8fafc; }
        .admin-layout-home { background-size: cover; background-position: center center; background-repeat: no-repeat; background-attachment: fixed; }
        .admin-layout-content { display: flex; flex: 1; flex-direction: column; min-height: 0; overflow: hidden; background: rgba(248, 250, 252, .18); }
        .admin-layout-home .admin-layout-content > div { background: transparent !important; }
      `}</style>
    </div>
  );
}