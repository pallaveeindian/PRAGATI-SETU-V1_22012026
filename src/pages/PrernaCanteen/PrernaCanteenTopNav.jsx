import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUtensils,
    faSignOutAlt,
    faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

export const AuthContext = React.createContext(null);

export default function PrernaCanteenTopNav({ left = null, right = null, onLogoutSuccess, onBackClick }) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log("AUTH USER:", user);
    const [geoScope, setGeoScope] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const getHeaderLabel = () => {
        if (!user) return "";

        if (user.username) {
            return user.username
                .replace(/^BMM_LU_/, "BMM_")
                .replace(/_/g, "-");
        }

        return "";
    };
    const loadScopeAndUser = () => {
        try {
            const cachedGeo = localStorage.getItem("ps_user_geoscope");
            if (cachedGeo) {
                setGeoScope(JSON.parse(cachedGeo));
            } else {
                setGeoScope(null);
            }
        } catch (e) {
            console.error("Failed to parse ps_user_geoscope", e);
            setGeoScope(null);
        }

        if (auth?.user) {
            setCurrentUser(auth.user);
        } else {
            try {
                const cachedUser = localStorage.getItem("ps_user_info");
                if (cachedUser) {
                    setCurrentUser(JSON.parse(cachedUser));
                } else {
                    setCurrentUser({ username: "Kavyanshi" });
                }
            } catch {
                setCurrentUser({ username: "Kavyanshi" });
            }
        }
    };

    useEffect(() => {
        loadScopeAndUser();

        window.addEventListener("storage", loadScopeAndUser);
        window.addEventListener("ps_geoscope_updated", loadScopeAndUser);

        return () => {
            window.removeEventListener("storage", loadScopeAndUser);
            window.removeEventListener("ps_geoscope_updated", loadScopeAndUser);
        };
    }, [auth]);


    let scopeLabel = "";
    let scopeStyle = { backgroundColor: "#fffbeb", color: "#b45309", borderColor: "#fde68a" };

    if (geoScope) {
        if (geoScope.role === "bmmu" && Array.isArray(geoScope.blocks) && geoScope.blocks.length > 0) {
            scopeLabel = `Block: ${geoScope.blocks[0]}`;
            scopeStyle = { backgroundColor: "#fff5f5", color: "#c53030", borderColor: "rgba(254, 178, 178, 0.6)" };
        } else if ((geoScope.role === "dmmu" || geoScope.role === "dcnrlm") && Array.isArray(geoScope.districts) && geoScope.districts.length > 0) {
            scopeLabel = `District: ${geoScope.districts[0]}`;
            scopeStyle = { backgroundColor: "#fffbeb", color: "#92400e", borderColor: "rgba(253, 230, 138, 0.6)" };
        } else if (geoScope.role === "smmu") {
            scopeLabel = "STATE LEVEL (SMMU)";
            scopeStyle = { backgroundColor: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" };
        } else if (geoScope.role) {
            scopeLabel = geoScope.role.toUpperCase();
            scopeStyle = { backgroundColor: "#f5f5f4", color: "#44403c", borderColor: "#e7e5e4" };
        }
    }

    const handleLogout = async () => {
        try {
            if (auth?.logout) {
                await auth.logout();
            } else {
                localStorage.removeItem("ps_user_info");
                window.dispatchEvent(new Event("ps_geoscope_updated"));
            }

            if (onLogoutSuccess) {
                onLogoutSuccess();
            }
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            navigate("/", { replace: true });
        }
    };

    const defaultLeft = (
        <div className="pc-flex pc-items-center pc-gap-4">
            <div className="pc-logo-box">
                <FontAwesomeIcon icon={faUtensils} className="pc-logo-icon" />
            </div>
            <div>
                <h1 className="pc-brand-title">
                    PRERNA <span className="pc-brand-red">CANTEEN</span>
                </h1>
                <p className="pc-brand-subtitle">
                    Institutional Food Management System
                </p>
            </div>
        </div>
    );


    const defaultRight = (
        <div className="pc-flex pc-items-center pc-gap-6">
            <div className="pc-user-info-box">
                <div className="pc-flex pc-items-center pc-gap-2">
                    <span className="pc-username">
                        {getHeaderLabel()
                            ? `Hi, ${getHeaderLabel()}`
                            : currentUser?.username
                                ? `Hi, ${currentUser.username}`
                                : "Hi, Admin"}
                    </span>
                </div>
                {/* {scopeLabel ? (
                    <span className="pc-scope-badge" style={scopeStyle}>
                        {scopeLabel}
                    </span>
                ) : (
                    <span className="pc-scope-badge" style={{ backgroundColor: "#f3f4f6", color: "#1f2937" }}>
                        Loading Scope...
                    </span>
                )} */}
            </div>

            <div className="pc-actions-vertical">
                <button onClick={handleLogout} className="pc-logout-btn" title="Logout from portal">
                    <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: "8px" }} />
                    Logout
                </button>

                <button onClick={onBackClick} className="pc-back-nav-btn" title="Back to Gallery">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "8px" }} />
                    Back
                </button>
            </div>
        </div>
    );

    return (
        <header className="pc-header">
            <style>{`
                .pc-header {
                    width: 100%;
                    height: 95px; 
                    background-color: #ffffff;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-left: 32px;
                    padding-right: 32px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
                    z-index: 50;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .pc-flex { display: flex; }
                .pc-items-center { align-items: center; }
                .pc-gap-4 { gap: 16px; }
                .pc-gap-6 { gap: 24px; }
                .pc-gap-2 { gap: 8px; }
                .pc-logo-box {
                    width: 40px;
                    height: 40px;
                    background-color: #dc2626;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2), 0 2px 4px -2px rgba(220, 38, 38, 0.2);
                    transition: all 0.3s ease;
                }
                .pc-logo-box:hover { transform: scale(1.05); }
                .pc-logo-icon { width: 20px; height: 20px; color: #ffffff; }
                .pc-brand-title { font-size: 20px; font-weight: 800; letter-spacing: -0.025em; color: #1e293b; text-transform: uppercase; margin: 0; }
                .pc-brand-red { color: #dc2626; }
                .pc-brand-subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; color: #94a3b8; margin: 0; margin-top: 2px; }
                
                .pc-user-info-box {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    border-right: 1px solid #e2e8f0;
                    padding-right: 24px;
                }
                .pc-username { font-size: 14px; font-weight: 500; color: #475569; }
                .pc-pulse-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #22c55e;
                    animation: pc-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .pc-scope-badge {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-top: 4px;
                    padding: 2px 8px;
                    border-radius: 4px;
                    border: 1px solid transparent;
                }
                .pc-actions-vertical { display: flex; flex-direction: column; gap: 6px; align-items: stretch; }
                .pc-logout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #dc2626;
                    color: #ffffff;
                    padding: 6px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 13px;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: background-color 0.2s ease, transform 0.1s ease;
                }
                .pc-logout-btn:hover { background-color: #b91c1c; }
                .pc-logout-btn:active { transform: scale(0.98); }
                
                .pc-back-nav-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #ffffff;
                    color: #dc2626;
                    padding: 4px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 12px;
                    border: 1px solid #f3f4f6;
                    cursor: pointer;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    transition: all 0.2s ease;
                }
                .pc-back-nav-btn:hover { background-color: #fef2f2; border-color: #fca5a5; }
                .pc-back-nav-btn:active { transform: scale(0.98); }
                
                @keyframes pc-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>

            <div>
                {left || defaultLeft}
            </div>
            <div>
                {right || defaultRight}
            </div>
        </header>
    );
}