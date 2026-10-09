// src/pages/AdminPages/Layout/AdminLayout.jsx
import React, { useEffect, useState } from "react";
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
import LearningMaterial from "./TmsPortal/LearningMaterial/Llm";
import CenterDetail from "./TmsPortal/CenterDetail";
import HomeDashboard from "./HomeDashboard";

const tabGradients = {
  "Grievances List":
    "linear-gradient(to bottom, rgb(43, 2, 7) 0%, rgb(74, 4, 16) 12%, rgb(107, 9, 26) 28%, rgb(139, 17, 34) 45%, rgb(185, 28, 28) 60%, rgb(220, 38, 38) 75%, rgb(239, 68, 68) 88%, rgb(252, 165, 165) 100%)",

  "TMS Portal":
    "linear-gradient(to bottom, rgb(2, 19, 46) 0%, rgb(4, 33, 82) 12%, rgb(6, 44, 110) 28%, rgb(8, 57, 138) 45%, rgb(10, 74, 170) 60%, rgb(29, 99, 201) 75%, rgb(61, 130, 224) 88%, rgb(185, 215, 251) 100%)",

  "User Management":
    "linear-gradient(to bottom, rgb(58, 28, 113) 0%, rgb(119, 19, 29) 50%, rgb(100, 48, 14) 100%)",

  "Training Batch List":
    "linear-gradient(to bottom, rgb(46, 17, 3) 0%, rgb(77, 28, 6) 12%, rgb(118, 43, 8) 28%, rgb(161, 62, 10) 45%, rgb(209, 87, 13) 60%, rgb(249, 115, 22) 75%, rgb(253, 164, 99) 88%, rgb(254, 215, 170) 100%)",

  "Training Request List":
    "linear-gradient(to bottom, rgb(5, 46, 22) 0%, rgb(20, 83, 45) 12%, rgb(7, 48, 22) 28%, rgb(13, 87, 40) 45%, rgb(8, 71, 31) 60%, rgb(5, 75, 30) 75%, rgb(7, 61, 27) 88%, rgb(6, 58, 24) 100%)",

  "Training Target":
    "linear-gradient(to bottom, rgb(2, 19, 46) 0%, rgb(4, 33, 82) 12%, rgb(5, 34, 85) 28%, rgb(8, 57, 138) 45%, rgb(10, 74, 170) 60%, rgb(29, 99, 201) 75%, rgb(2, 33, 77) 88%, rgb(52, 113, 188) 100%)",

  "Learning Material":
    "linear-gradient(to bottom, rgb(2, 25, 46) 0%, rgb(4, 33, 82) 12%, rgb(6, 44, 110) 28%, rgb(8, 57, 138) 45%, rgb(10, 74, 170) 60%, rgb(29, 99, 201) 75%, rgb(61, 130, 224) 88%, rgb(16, 25, 35) 100%)",

  Default: "linear-gradient(to bottom, #1d4ed8 0%, #e11d48 100%)",
};

export default function AdminLayout({
  children,
  defaultActiveMenu = "Home Dashboard",
}) {
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenuState] = useState(() => {
    const requestedSection = searchParams.get("section");

    if (children) return defaultActiveMenu;

    const savedMenu = window.sessionStorage.getItem("admin-active-menu");

    if (savedMenu) return savedMenu;
    return requestedSection === "training-requests"
      ? "Training Request List"
      : defaultActiveMenu;
  });
  const setActiveMenu = (menu) => {
    setActiveMenuState(menu);
    window.sessionStorage.setItem("admin-active-menu", menu);
  };

  useEffect(() => {
    if (activeMenu !== "Center Management") {
      window.sessionStorage.removeItem("tms-editing-center-id");
    }
  }, [activeMenu]);

  const isHomeDashboard = activeMenu === "Home Dashboard";

  const currentGradient = tabGradients[activeMenu] || tabGradients["Default"];

  return (
    <div
      className={
        isHomeDashboard ? "admin-layout admin-layout-home" : "admin-layout"
      }
      style={
        isHomeDashboard
          ? { backgroundImage: `url(${homeDashboardImage})` }
          : undefined
      }
    >
      <AdminHeader
        transparent={isHomeDashboard}
        currentGradient={currentGradient}
      />

      <div
        style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}
      >
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          transparent={isHomeDashboard}
          currentGradient={currentGradient}
        />

        <div className="admin-layout-content">
          {children && activeMenu === defaultActiveMenu ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {children}
            </div>
          ) : activeMenu === "TMS Portal" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <TmsPortal />
            </div>
          ) : activeMenu === "User Management" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <UserManagement />
            </div>
          ) : activeMenu === "Training Batch List" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <TrainingBatchList />
            </div>
          ) : activeMenu === "Training Request List" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <TrainingRequestList />
            </div>
          ) : activeMenu === "Training Target" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <TrainingTarget />
            </div>
          ) : activeMenu === "Learning Material" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <LearningMaterial />
            </div>
          ) : activeMenu === "Center Management" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <CenterDetail />
            </div>
          ) : activeMenu === "Home Dashboard" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <HomeDashboard />
            </div>
          ) : activeMenu === "Grievances List" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <AdminGreivancesList />
            </div>
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
        @media print {
          @page { size: auto; margin: 12mm; }
          html, body, #root { height: auto !important; min-height: 0 !important; overflow: visible !important; }
          .admin-layout {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          .admin-layout > header,
          .admin-layout > .admin-header,
          .admin-layout > div > aside,
          .admin-layout > div > nav {
            display: none !important;
          }
          .admin-layout > div,
          .admin-layout-content,
          .admin-layout-content > div {
            display: block !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .admin-layout-content { background: #fff !important; }
          .admin-layout-content .app-shell,
          .admin-layout-content .content-area,
          .admin-layout-content .main-area,
          .admin-layout-content main,
          .admin-layout-content section,
          .admin-layout-content article {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .admin-layout-content .table-container {
            max-height: none !important;
            overflow: visible !important;
          }
          button, .center-detail-actions { display: none !important; }
        }
      `}</style>
    </div>
  );
}
