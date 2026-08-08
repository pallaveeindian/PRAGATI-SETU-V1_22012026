import React, { useState, useEffect } from "react";
// Navigate aur useNavigate dono yahan import kiye hain
import { useOutlet, useLocation, useNavigate, Navigate } from "react-router-dom"; 
import { useAuth } from "../../../contexts/AuthContext.jsx";

import DmmHeader from "./Dashboard/layout/DmmHeader.jsx";
import DmmSidebar from "./Dashboard/layout/DmmSidebar.jsx";
import DmmFooter from "./Dashboard/layout/DmmFooter.jsx";
import DmmDashboardPage from "./Dashboard/DmmDashboardpage.jsx";
import MCCYBackground from "../../../assets/MCCYBackground.png";

export default function DmmLayoutMain() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Agar user null ho gaya hai (logout ho chuka hai), toh safely redirect karega bina error ke
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
    else if (path.includes("/applications")) setActiveMenu("Application Forwarded");
    else setActiveMenu("Dashboard");
  }, [location.pathname]);

  // Aapka naya handleLogout function jo error chupayega aur home pe bhejega
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
      {/* Header ko naya handleLogout pass kiya */}
      <DmmHeader onLogout={handleLogout} displayName={displayName} />

      <div style={styles.middleSection}>
        <DmmSidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          onLogout={handleLogout} /* Agar DmmSidebar me bhi logout ka button ho toh ye kaam aayega */
        />

        <div style={styles.contentWrapper}>
          <div style={styles.contentContainer}>
            {outlet || <DmmDashboardPage />}
          </div>
          <DmmFooter />
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