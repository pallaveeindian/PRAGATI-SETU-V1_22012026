import React, { useState, useEffect } from "react";
// useNavigate aur Navigate add kiya gaya hai
import { useOutlet, useLocation, useNavigate, Navigate } from "react-router-dom"; 
import { useAuth } from "../../contexts/AuthContext.jsx";

import BankHeader from "./Dashboard/layout/BankHeader.jsx";
import BankSidebar from "./Dashboard/layout/BankSidebar.jsx";
import BankFooter from "./Dashboard/layout/BankFooter.jsx";
import BankDashboardPage from "./Dashboard/BankDashboardPage.jsx";
import MCCYBackground from "../../assets/MCCYBackground.png";

export default function BankLayoutMain() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Agar user logout ho gaya hai toh automatically aur safely redirect karega
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const displayName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ") || user?.username || user?.name || "Admin User";

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    const path = location.pathname || "";
    if (path.includes("/reports")) setActiveMenu("Report Section");
    else if (path.includes("/applications")) setActiveMenu("Bank Application ");
    else setActiveMenu("Dashboard");
  }, [location.pathname]);

  // Ye handleLogout function error chupayega aur safely home page par bhejega
  const handleLogout = async () => {                       
    try {
      await logout();
    } catch (e) {
      console.log("Silent logout error handled:", e);
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <div style={styles.mainLayout}>
      <BankHeader onLogout={handleLogout} displayName={displayName} />

      <div style={styles.middleSection}>
        <BankSidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          onLogout={handleLogout} 
        />

        <div style={styles.contentWrapper}>
          <div style={styles.contentContainer}>
            {outlet || <BankDashboardPage />}
          </div>
          <BankFooter />
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainLayout: { 
    display: "flex", 
    flexDirection: "column", 
    height: "100vh", 
    overflow: "hidden",
    backgroundColor: "transparent",
    backgroundImage: `url(${MCCYBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  },
  middleSection: { 
    display: "flex", 
    flex: 1, 
    backgroundColor: "transparent",
    overflow: "hidden",
    alignItems: "stretch", 
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  contentContainer: { 
    flex: 1, 
    display: "block", 
    backgroundColor: "transparent",
    padding: "20px", 
    overflowY: "auto" 
  }
};