import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./pages/LanguageContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";

// Configuration for Dynamic Maintenance Control
import { MODULES_CONFIG } from "./config/modulesConfig";

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

// Grievance Portal
import RegisterGrievance from "./pages/RegisterGrievance.jsx";
import GrievancesList from "./pages/Dashboard/GreivancesList.jsx";

// All Login Pages
import LoginParent from "./pages/LoginComps/LoginParent";
import TmsLogin from "./pages/LoginComps/TmsLogin";
import LdmsLogin from "./pages/LoginComps/LdmsLogin";
import CrpEpLogin from "./pages/LoginComps/CrpEpLogin";
import MouLogin from "./pages/LoginComps/MouLogin";
import AdminLogin from "./pages/LoginComps/AdminLogin";
import EPSMSLogin from "./pages/LoginComps/EPSMSLogin.jsx";

// Dashboard / Error Pages
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ErrorPage from "./components/ErrorPages/ErrorPage";
import SiteDevErrorPage from "./components/ErrorPages/SiteDevErrorPage";

// Modular Routes
import TmsRoutes from "./routes/TmsRoutes";
import LdmsRoutes from "./routes/LdmsRoutes";
import CrpEpRoutes from "./routes/CrpEpRoutes";
import MouRoutes from "./routes/MouRoutes";
import SupportRoutes from "./routes/SupportRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import EPSMSRoutes from "./routes/EPSMSRoutes.jsx";

export default function App() {
  const { authReady, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navType = useNavigationType();

  // Route Blocking & Timer State
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update time for real-time route restoration
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if a module is Active based on config + timer
  const isModuleActive = (moduleId) => {
    const mod = MODULES_CONFIG.find((m) => m.id === moduleId);
    if (!mod) return false;
    if (!mod.maintenanceUntil) return true;
    if (mod.maintenanceUntil === "permanent") return false;
    // Active if the countdown is strictly over
    return new Date(mod.maintenanceUntil).getTime() <= currentTime;
  };

  // ==========================================
  // SECURITY LOGIC: BROWSER BACK/FORWARD LOGOUT
  // ==========================================
  useEffect(() => {
    if (!authReady || !isAuthenticated) return;

    const isPortalRoute =
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/tms") ||
      location.pathname.startsWith("/ldms") ||
      location.pathname.startsWith("/crp-ep") ||
      location.pathname.startsWith("/mou") ||
      location.pathname.startsWith("/support") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/epsms") ||
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
        <Route path="/future-updates" element={<SiteDevErrorPage />} />

        {/* Grievance Portal Routes */}
        <Route path="/register-grievance" element={<RegisterGrievance />} />

        {/* ----- Login Routes ----- */}
        <Route path="/login" element={<Login />} />
        <Route path="/module-login" element={<LoginParent />} />

        {/* Only render sub-login routes if their module is active */}
        {isModuleActive("tms") && (
          <Route path="/module-login?module=tms" element={<TmsLogin />} />
        )}
        {isModuleActive("ldms") && (
          <Route path="/module-login?module=ldms" element={<LdmsLogin />} />
        )}
        {isModuleActive("crp") && (
          <Route path="/module-login?module=crp-ep" element={<CrpEpLogin />} />
        )}
        {isModuleActive("mou") && (
          <Route path="/module-login?module=mou" element={<MouLogin />} />
        )}
        {isModuleActive("epsms") && (
          <Route path="/module-login?module=epsms" element={<EPSMSLogin />} />
        )}
        {isModuleActive("pmuadmin") && (
          <Route
            path="/module-login?module=pmuadmin"
            element={<AdminLogin />}
          />
        )}

        {/* ----- Protected Application Routes ----- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardHome />} />

          {/* Sub-Software Routing (Conditionally Mounted) */}
          {isModuleActive("tms") && (
            <Route path="/tms/*" element={<TmsRoutes />} />
          )}
          {isModuleActive("ldms") && (
            <Route path="/ldms/*" element={<LdmsRoutes />} />
          )}
          {isModuleActive("crp") && (
            <Route path="/crp-ep/*" element={<CrpEpRoutes />} />
          )}
          {isModuleActive("mou") && (
            <Route path="/mou/*" element={<MouRoutes />} />
          )}
          {isModuleActive("epsms") && (
            <Route path="/epsms/*" element={<EPSMSRoutes />} />
          )}
          {isModuleActive("support") && (
            <Route path="/support/*" element={<SupportRoutes />} />
          )}
          {isModuleActive("pmuadmin") && (
            <Route path="/admin/*" element={<AdminRoutes />} />
          )}

          <Route path="/error" element={<ErrorPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </LanguageProvider>
  );
}
