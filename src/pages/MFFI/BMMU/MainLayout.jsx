import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
// Navigate aur useNavigate dono import kiye gaye hain
import { useOutlet, useLocation, useParams, useNavigate, Navigate } from "react-router-dom"; 
import { getCanonicalRole } from "../../../utils/roleUtils";
import MCCYBackground from "../../../assets/MCCYBackground.png";

// Layout Components
import Header from "./layout/Header.jsx";
import Sidebaar from "./layout/Sidebaar.jsx";
import Footer from "./layout/Footer.jsx";

// Pages
import DashboardPage from "./Dashboard/DashboardPage.jsx";

export default function MainLayout() {
  
  const { user, logout } = useAuth(); 
  const navigate = useNavigate(); 
  
  // Agar page refresh ho aur user logged in na ho, toh error se bachne ke liye
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const displayName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.username || user?.name || 'Admin User';
  const roleKey = String(getCanonicalRole(user) || "bmmu").toLowerCase();
  
  const [activeMenu, setActiveMenu] = useState("Dashboard"); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const { roleId } = useParams();
  const outlet = useOutlet();

  // Sync activeMenu with URL so direct navigation shows correct menu
  useEffect(() => {
    const path = location.pathname || '';
    if (path.includes('/applications')) setActiveMenu('Application List');
    else if (path.includes('/reports')) setActiveMenu('Report Section');
    else setActiveMenu('Dashboard');
  }, [location.pathname]);

  // Aapka update kiya hua handleLogout function
  const handleLogout = async () => {                       
    try {
      await logout(); // if logout is async; if not, this still works
    } catch (e) {
      // ignore or console.error(e);
      console.log("Silent logout error handled:", e);
    } finally {
      navigate('/', { replace: true });
    }
  };                                                       

  return (
    <div style={styles.mainLayout}>
      
      {/* 3. Header ko calculated displayName pass kar diya */}
      <Header 
        onLogout={handleLogout}                              
        displayName={displayName} 
      />
      
      <div style={styles.middleSection}>
        <Sidebaar 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          isCollapsed={isCollapsed} 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          onLogout={handleLogout}                            
          currentRole={roleKey}
        />
        
        <div style={styles.contentWrapper}>
          <div style={styles.contentContainer}>
            {outlet || <DashboardPage />}
          </div>
          <Footer />
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