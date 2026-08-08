// src/routes/MFFIRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import BmmuMainLayout from "../pages/MFFI/BMMU/MainLayout.jsx";
import DmmuMainLayout from "../pages/MFFI/DMMU/DmmLayoutMain.jsx";
import BankMainLayout from "../pages/MFFI/BANK/BankMainLayout.jsx";

// BMMU PAGES
import DashboardPage from "../pages/MFFI/BMMU/Dashboard/DashboardPage.jsx";
import ApplicationListPage from "../pages/MFFI/BMMU/Dashboard/ApplicationListPage.jsx";
import ReportSectionPage from "../pages/MFFI/BMMU/Dashboard/ReportSectionPage.jsx";

// DMMU PAGES
import DmmDashboardPage from "../pages/MFFI/DMMU/Dashboard/DmmDashboardpage.jsx";
import DmmApplicationPage from "../pages/MFFI/DMMU/Dashboard/DmmApplicationPage.jsx";
import DmmReportPage from "../pages/MFFI/DMMU/Dashboard/DmmReportPage.jsx";

// BANK PAGES
import BankDashboardPage from "../pages/MFFI/BANK/Dashboard/BankDashboardPage.jsx";
import BankApplicationPage from "../pages/MFFI/BANK/Dashboard/BankApplicationPage.jsx";
import BankReportPage from "../pages/MFFI/BANK/Dashboard/BankReportPage.jsx";

export default function MFFIRoutes() {
  return (
    <Routes>
      {/* =======================================
          BMMU Routes
      ======================================= */}
      <Route element={<ProtectedRoute allowedRoles="bmmu" />}>
        <Route path="bmmu/dashboard" element={<BmmuMainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="applications" element={<ApplicationListPage />} />
          <Route path="reports" element={<ReportSectionPage />} />
        </Route>
      </Route>

      {/* =======================================
          DMMU Routes
      ======================================= */}
      <Route element={<ProtectedRoute allowedRoles="dmmu" />}>
        <Route path="dmmu/dashboard" element={<DmmuMainLayout />}>
          <Route index element={<DmmDashboardPage />} />
          <Route path="applications" element={<DmmApplicationPage />} />
          <Route path="reports" element={<DmmReportPage />} />
          {/* DMMU ke baaki pages yahan aayenge in future */}
        </Route>
      </Route>

      {/* =======================================
          SMMU Routes 
      ======================================= */}
      {/* 
      <Route element={<ProtectedRoute allowedRoles="smmu" />}>
        <Route path="smmu/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardPage />} />
          <Route path="applications" element={<ApplicationListPage />} />
          <Route path="reports" element={<ReportSectionPage />} />
        </Route>
      </Route> 
      */}

      {/* =======================================
          Bank User Routes 
      ======================================= */}
      <Route element={<ProtectedRoute allowedRoles="bank_user" />}>
        <Route path="bank_user/dashboard" element={<BankMainLayout />}>
          <Route index element={<BankDashboardPage />} />
          <Route path="applications" element={<BankApplicationPage />} />
          <Route path="reports" element={<BankReportPage />} />
        </Route>
      </Route>

      {/* =======================================
          Cross-Role Routes 
      ======================================= */}
      {/*
      <Route element={<ProtectedRoute allowedRoles={["bank_user", "dmmu", "bmmu"]} />}>
         <Route path="common-page" element={<SomeCommonComponent />} />
      </Route>
      */}
    </Routes>
  );
}
