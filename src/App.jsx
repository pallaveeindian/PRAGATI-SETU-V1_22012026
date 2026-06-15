// src/App.jsx
import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./pages/LanguageContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import BeneficiaryProfiling from "./pages/BeneficiaryProfiling";
import UserManagement from "./pages/UserManagement";
import TrainingManagement from "./pages/TrainingManagement";
import LakhpatiDidi from "./pages/LakhpatiDidi";
import EnterpriseTracking from "./pages/EnterpriseTracking";
import MonitoringandAnlytics from "./pages/MonitoringandAnlytics";
import PowerBIAnalytics from "./pages/PowerBiAnalytics";
import UserManual from "./pages/UserManual";
import FrequentlyAskedQuestions from "./pages/FrequentlyAskedQuestions";
import PublicReports from "./pages/PublicReports";
import WhatsNew from "./pages/WhatsNew";

// Dashboard / Error Pages
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ErrorPage from "./components/ErrorPages/ErrorPage";
import SiteDevErrorPage from "./components/ErrorPages/SiteDevErrorPage";

// Server Maintainance
import ServerMaintenance from "./components/ErrorPages/ServerMaintenance.jsx";

// Modular Routes
import TmsRoutes from "./routes/TmsRoutes";
import LdmsRoutes from "./routes/LdmsRoutes";
import CrpEpRoutes from "./routes/CrpEpRoutes";
import MouRoutes from "./routes/MouRoutes";

export default function App() {
  const { authReady, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navType = useNavigationType();

  // ==========================================
  // SECURITY LOGIC: BROWSER BACK/FORWARD LOGOUT
  // ==========================================
  useEffect(() => {
    if (!authReady || !isAuthenticated) return;

    const isPortalRoute =
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/tms") ||
      location.pathname.startsWith("/ldms") ||
      location.pathname.startsWith("/crp-ep") || // Replaced EPSMS with crp-ep
      location.pathname.startsWith("/mou") ||
      location.pathname.startsWith("/error");

    if (navType === "POP" && !isPortalRoute) {
      if (logout) logout();
    }
  }, [location.pathname, navType, authReady, isAuthenticated, logout]);

  if (!authReady) {
    return <div>Restoring session…</div>;
  }

  return (
    <LanguageProvider>
      <Routes>
        {/* ----- Public Routes ----- */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/beneficiary-profiling"
          element={<BeneficiaryProfiling />}
        />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/training-management" element={<TrainingManagement />} />
        <Route path="/lakhpati-didi" element={<LakhpatiDidi />} />
        <Route path="/enterprise-tracking" element={<EnterpriseTracking />} />
        <Route
          path="/monitoring-and-anlytics"
          element={<MonitoringandAnlytics />}
        />
        <Route path="/power-bi-analytics" element={<PowerBIAnalytics />} />
        <Route path="/user-manual" element={<UserManual />} />
        <Route
          path="/frequently-asked-questions"
          element={<FrequentlyAskedQuestions />}
        />
        <Route path="/what's-new" element={<WhatsNew />} />
        <Route path="/public-reports" element={<PublicReports />} />
        <Route path="/login" element={<ServerMaintenance />} />
        <Route path="/future-updates" element={<SiteDevErrorPage />} />

        {/* RESUMES AFTER MAINTAINANCE */}
        {/* ----- Protected Application Routes ----- */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardHome />} /> */}

          {/* Sub-Software Routing (Delegated to /src/routes/*) */}
          {/* <Route path="/tms/*" element={<TmsRoutes />} />
          <Route path="/ldms/*" element={<LdmsRoutes />} />
          <Route path="/crp-ep/*" element={<CrpEpRoutes />} />
          <Route path="/mou/*" element={<MouRoutes />} />

          <Route path="/error" element={<ErrorPage />} />
        </Route> */}

        {/* Catch-all 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </LanguageProvider>
  );
}
