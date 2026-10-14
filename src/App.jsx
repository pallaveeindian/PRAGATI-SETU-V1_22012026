// src\App.jsx
import React, { useState, useEffect, useRef } from "react";
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
import TMSLayout from "./pages/PublicTMS/TMSLayout.jsx";
import LakhpatiDidi from "./pages/LakhpatiDidi";
import LDMSLayout from "./pages/PublicLDMS/LDMSLayout.jsx";
import BMSLayout from "./pages/PublicBMS/BMSLayout.jsx";
import EnterpriseSakhiDigital from "./pages/PublicEnterpriseSakhi/EnterpriseSakhiDigital.jsx";
import MonitoringandAnlytics from "./pages/MonitoringandAnlytics";
import PowerBIAnalytics from "./pages/PowerBiAnalytics";
import UserManual from "./pages/UserManual";
import FrequentlyAskedQuestions from "./pages/FrequentlyAskedQuestions";
import PublicReports from "./pages/PublicReports";
import WhatsNew from "./pages/WhatsNew";
import ContactDetails from "./pages/ContactDetails.jsx";
import NewsUpdates from "./pages/NewsUpdates";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Accessibility from "./pages/Accessibility";
import missionBg from "./assets/mission_bg.png";

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
import StateLogin from "./pages/LoginComps/StateLogin";
// Planning Dept Integration portal
import PDULogin from "./pages/PlanningDeptUpdate/Pages/PDULogin.jsx";

// Dashboard / Error Pages
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ErrorPage from "./components/ErrorPages/ErrorPage";
import SiteDevErrorPage from "./components/ErrorPages/SiteDevErrorPage";
import ServerMaintenance from "./components/ErrorPages/ServerMaintenance.jsx";

// Modular Routes
import MasterRoutes from "./routes/MasterRoutes.jsx";
import TmsRoutes from "./routes/TmsRoutes";
import LdmsRoutes from "./routes/LdmsRoutes";
import CrpEpRoutes from "./routes/CrpEpRoutes";
import MouRoutes from "./routes/MouRoutes";
import SupportRoutes from "./routes/SupportRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import EPSMSRoutes from "./routes/EPSMSRoutes.jsx";
import UPPLDRoutes from "./routes/UPPLDRoutes.jsx";

export default function App() {
  const { authReady, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navType = useNavigationType();
  const PORTAL_TAB_LOCK = "pragati-setu-portal-single-tab";

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Reset possible custom scroll containers also
      const scrollContainers = document.querySelectorAll(
        "main, #root, .home-shell, .page-main, .public-reports-page",
      );

      scrollContainers.forEach((element) => {
        element.scrollTop = 0;
      });
    };

    resetScroll();

    const frame = requestAnimationFrame(() => {
      resetScroll();
    });

    const timer = setTimeout(() => {
      resetScroll();
    }, 50);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Route Blocking & Timer State
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update time for real-time route restoration
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [tabAccess, setTabAccess] = useState("checking");
  const lockRequestStartedRef = useRef(false);
  const lockEffectActiveRef = useRef(false);
  const releaseLockRef = useRef(null);

  useEffect(() => {
    lockEffectActiveRef.current = true;

    const cleanup = () => {
      lockEffectActiveRef.current = false;

      // Deferring cleanup lets React StrictMode's development-only
      // effect replay reuse this tab's lock.
      queueMicrotask(() => {
        if (!lockEffectActiveRef.current) {
          releaseLockRef.current?.();
          releaseLockRef.current = null;
        }
      });
    };

    if (lockRequestStartedRef.current) {
      return cleanup;
    }
    lockRequestStartedRef.current = true;

    if (
      typeof navigator === "undefined" ||
      !navigator.locks ||
      typeof navigator.locks.request !== "function"
    ) {
      setTabAccess("unsupported");
      return cleanup;
    }

    navigator.locks
      .request(
        PORTAL_TAB_LOCK,
        { mode: "exclusive", ifAvailable: true },
        async (lock) => {
          if (!lock) {
            if (lockEffectActiveRef.current) {
              setTabAccess("duplicate");
            }
            return;
          }

          if (!lockEffectActiveRef.current) return;

          setTabAccess("active");

          // Keep the lock until this tab is closed or the App unmounts.
          await new Promise((resolve) => {
            releaseLockRef.current = resolve;

            if (!lockEffectActiveRef.current) {
              releaseLockRef.current = null;
              resolve();
            }
          });

          releaseLockRef.current = null;
        },
      )
      .catch((error) => {
        console.error("Could not acquire the portal tab lock:", error);
        if (lockEffectActiveRef.current) {
          setTabAccess("unsupported");
        }
      });

    return cleanup;
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
      location.pathname.startsWith("/upsrlm-planning") ||
      location.pathname.startsWith("/master") ||
      location.pathname.startsWith("/error");

    if (navType === "POP" && !isPortalRoute) {
      if (logout) logout();
    }
  }, [location.pathname, navType, authReady, isAuthenticated, logout]);

  if (!authReady) {
    return <div>Restoring session…</div>;
  }

  if (tabAccess === "duplicate") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: "clamp(16px, 4vw, 32px)",
          backgroundColor: "#fff8f2",
          backgroundImage: `linear-gradient(rgba(255, 248, 242, 0.42), rgba(255, 248, 242, 0.42)), url(${missionBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 9999999,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(640px, 100%)",
            padding: "48px clamp(24px, 5vw, 40px) 34px",
            borderRadius: 18,
            background: "rgba(255, 255, 255, 0.97)",
            border: "1px solid rgba(244, 91, 22, 0.14)",
            boxShadow: "0 24px 60px rgba(29, 42, 65, 0.16)",
            textAlign: "center",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: "linear-gradient(90deg, #f45b16, #ff7627)",
            }}
          />

          <div
            style={{
              width: 88,
              height: 88,
              margin: "0 auto 20px",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              background: "#fff0e5",
            }}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 10V7a5 5 0 0 1 10 0v3"
                stroke="#10264a"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
                fill="#fff"
                stroke="#10264a"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="15" r="1.4" fill="#f45b16" />
              <path
                d="M12 16.5V18"
                stroke="#f45b16"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            style={{
              marginBottom: 12,
              color: "#f45b16",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.2em",
            }}
          >
            SECURE ACCESS
          </div>

          <h2
            style={{
              margin: "0 0 16px",
              color: "#10264a",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(29px, 4vw, 38px)",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            Portal already open
          </h2>

          <p
            style={{
              maxWidth: 520,
              margin: "0 auto 28px",
              color: "#4b5568",
              fontSize: 17,
              lineHeight: 1.65,
            }}
          >
            The portal is already open in another tab or window. Close this tab
            and continue in the existing one. If you have closed the other
            window, retry here.
          </p>

          <button
            type="button"
            onClick={async () => {
              try {
                const acquired = await navigator.locks.request(
                  PORTAL_TAB_LOCK,
                  { mode: "exclusive", ifAvailable: true },
                  async (lock) => {
                    if (!lock) return false;

                    const clearTasks = [
                      () => localStorage.clear(),
                      () => sessionStorage.clear(),

                      async () => {
                        if (!("caches" in window)) return;
                        const cacheNames = await window.caches.keys();
                        await Promise.all(
                          cacheNames.map((name) => window.caches.delete(name)),
                        );
                      },

                      async () => {
                        if (!("serviceWorker" in navigator)) return;
                        const registrations =
                          await navigator.serviceWorker.getRegistrations();
                        await Promise.all(
                          registrations.map((registration) =>
                            registration.unregister(),
                          ),
                        );
                      },

                      async () => {
                        if (typeof indexedDB.databases !== "function") return;
                        const databases = await indexedDB.databases();

                        await Promise.all(
                          databases
                            .filter((database) => database.name)
                            .map(
                              (database) =>
                                new Promise((resolve) => {
                                  const request = indexedDB.deleteDatabase(
                                    database.name,
                                  );
                                  request.onsuccess = resolve;
                                  request.onerror = resolve;
                                  request.onblocked = resolve;
                                }),
                            ),
                        );
                      },
                    ];

                    // Attempt every cleanup even if one storage type fails.
                    await Promise.allSettled(
                      clearTasks.map((clear) => Promise.resolve().then(clear)),
                    );

                    await new Promise((resolve) => {
                      let timeoutId;

                      const finish = () => {
                        window.clearTimeout(timeoutId);
                        window.removeEventListener("pagehide", finish);
                        resolve();
                      };

                      window.addEventListener("pagehide", finish, {
                        once: true,
                      });
                      timeoutId = window.setTimeout(finish, 1500);
                      window.location.replace("/");
                    });

                    return true;
                  },
                );

                if (!acquired) {
                  alert(
                    "The other portal tab is still open. Close it, then retry.",
                  );
                }
              } catch (error) {
                console.error(
                  "Could not clear portal data or retry access:",
                  error,
                );
                alert(
                  "Could not clear portal data. Please close this tab and reopen the portal.",
                );
              }
            }}
            style={{
              width: "100%",
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "14px 20px",
              border: 0,
              borderRadius: 10,
              background: "linear-gradient(90deg, #f45b16, #ff681b)",
              boxShadow: "0 8px 18px rgba(244, 91, 22, 0.2)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 7v5h-5M4 17v-5h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.6 9a7 7 0 0 1 11.7-2L20 9M4 15l2.7 2a7 7 0 0 0 11.7-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Retry access
          </button>

          <div
            style={{
              marginTop: 22,
              color: "#657087",
              fontSize: 14,
            }}
          >
            Pragati Setu <span style={{ padding: "0 6px" }}>•</span> Secure
            session
          </div>
        </div>
      </div>
    );
  }

  // if (tabAccess === "unsupported") {
  //   return (
  //     <div style={{ padding: 32, color: "#17365d", textAlign: "center" }}>
  //       <h2>Cannot verify a single active portal tab</h2>
  //       <p>
  //         Open the portal over HTTPS in a current browser, then reload. Access
  //         is blocked here to protect your session data.
  //       </p>
  //     </div>
  //   );
  // }

  if (!authReady || tabAccess === "checking") {
    return <div>Checking portal session…</div>;
  }

  return (
    <LanguageProvider>
      <Routes>
        {/* ----- Public Routes ----- */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/training-management" element={<TMSLayout />} />
        <Route path="/Lakhpati-Didi" element={<LDMSLayout />} />
        <Route
          path="/Enterprise-Tracking"
          element={<EnterpriseSakhiDigital />}
        />
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
        <Route path="/news-updates" element={<NewsUpdates />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/beneficiary-profiling" element={<BMSLayout />} />

        <Route path="/contact-us" element={<ContactDetails />} />
        <Route path="/what's-new" element={<WhatsNew />} />
        {/* <Route path="/public-reports" element={<PublicReports />} /> */}
        <Route path="/future-updates" element={<SiteDevErrorPage />} />

        {/* Grievance Portal Routes */}
        <Route path="/register-grievance" element={<RegisterGrievance />} />

        {/* ----- Login Routes ----- */}
        <Route path="/upsrlm-planning/login" element={<PDULogin />} />
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
        {isModuleActive("masteradmin") && (
          <Route path="/module-login?module=admin" element={<StateLogin />} />
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

          <Route path="/upsrlm-planning/*" element={<UPPLDRoutes />} />

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
          {isModuleActive("masteradmin") && (
            <Route path="/master/*" element={<MasterRoutes />} />
          )}
          <Route path="/error" element={<ErrorPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </LanguageProvider>
  );
}
