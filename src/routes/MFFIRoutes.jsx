// src/routes/MFFIRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import BmmuMainLayout from "../MFFI/BMMU/MainLayout.jsx";
import DmmuMainLayout from "../MFFI/DMMU/DmmLayoutMain.jsx";
import BankMainLayout from "../MFFI/BANK/BankMainLayout.jsx";

// BMMU PAGES
import DashboardPage from "../MFFI/BMMU/Dashboard/DashboardPage.jsx";
import ApplicationListPage from "../MFFI/BMMU/Dashboard/ApplicationListPage.jsx";
import ReportSectionPage from "../MFFI/BMMU/Dashboard/ReportSectionPage.jsx";

// DMMU PAGES
import DmmDashboardPage from "../MFFI/DMMU/Dashboard/DmmDashboardpage.jsx"; 
import DmmApplicationPage from "../MFFI/DMMU/Dashboard/DmmApplicationPage.jsx";
import DmmReportPage from "../MFFI/DMMU/Dashboard/DmmReportPage.jsx";

// BANK PAGES
import BankDashboardPage from "../MFFI/BANK/Dashboard/BankDashboardPage.jsx";
import BankApplicationPage from "../MFFI/BANK/Dashboard/BankApplicationPage.jsx";
import BankReportPage from "../MFFI/BANK/Dashboard/BankReportPage.jsx";

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