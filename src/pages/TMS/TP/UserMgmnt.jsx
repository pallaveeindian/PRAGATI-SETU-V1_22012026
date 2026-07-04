// src/pages/TMS/TP/UserMgmnt.jsx
import React, { useState, useEffect, useContext } from "react";
import { FaUserShield, FaSyncAlt } from "react-icons/fa";

import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import UserFilterPanel from "./components/UserFilterPanel";
import UserTable from "./components/UserTable";
import UserModalView from "./components/UserModalView";
import UserFormModal from "./components/UserFormModal";

import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";

// =====================================================================
// CUSTOM ORCHESTRATOR HOOK
// =====================================================================
const useUsers = () => {
  const { user } = useContext(AuthContext) || {};
  // Check if logged in user is Training Partner (Role 4)
  const isTP = user?.role_id === 4 || user?.role === 4;

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // DTP defaults to 'tpcp' and cannot change it. TP defaults to 'tpcp' but can toggle.
  const [filters, setFilters] = useState({ search: "", type: "tpcp" });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);

  const triggerRefresh = () => setReloadToken((t) => t + 1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Enforce role constraints: Non-TP users (like DTP) are forced to fetch 'tpcp'
        const queryType = isTP ? filters.type : "tpcp";
        const response = await TMS_API.userManagement.list({ type: queryType });
        const data = response?.data ?? response ?? [];

        let filteredData = Array.isArray(data) ? data : [];

        // Apply client-side search filter
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filteredData = filteredData.filter(
            (u) =>
              (u.username || "").toLowerCase().includes(s) ||
              (u.name || "").toLowerCase().includes(s) ||
              (u.district_name_en || "").toLowerCase().includes(s),
          );
        }

        setUsers(filteredData);
        setTotalPages(
          Math.max(1, Math.ceil(filteredData.length / rowsPerPage)),
        );
        setCurrentPage(1); // Reset to page 1 on new data fetch
      } catch (error) {
        console.error("Failed to fetch user list:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters.type, filters.search, reloadToken, isTP]);

  return {
    loading,
    users,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    triggerRefresh,
    submitting: false,
    isTP,
  };
};

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function TPUserMgmnt() {
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Modal States
  const [activeViewUser, setActiveViewUser] = useState(null);
  const [activeEditUser, setActiveEditUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [resetCredentials, setResetCredentials] = useState(null);

  const hook = useUsers();
  const displayTitle = "Training Partner User Management";

  // Handles the handover from Edit Modal -> View Modal upon password reset
  const handleOpenViewWithReset = (userObj, newCreds) => {
    setIsFormOpen(false);
    setActiveEditUser(null);
    setResetCredentials(newCreds);
    setActiveViewUser(userObj);
  };

  return (
    <div
      className="app-shell"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />

        <div className="main-area">
          <main className="nic-main-content">
            <div className="nic-container">
              {/* Dashboard Title & Quick Actions Row */}
              <div className="nic-page-header">
                <h2 className="nic-page-title">
                  <FaUserShield className="nic-title-icon" />
                  {displayTitle}
                </h2>
                <div className="nic-header-actions">
                  <button
                    className="nic-btn-outline"
                    onClick={hook.triggerRefresh}
                    disabled={hook.loading}
                    title="Refresh Directory Data"
                  >
                    <FaSyncAlt
                      className={hook.loading ? "nic-spin" : ""}
                      style={{ marginRight: "6px" }}
                    />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Shared Filter System Context Box */}
              <UserFilterPanel
                filters={hook.filters}
                setFilters={hook.setFilters}
                isTP={hook.isTP}
              />

              {/* Master Structured Grid Container */}
              <div className="nic-table-section">
                <UserTable
                  users={hook.users}
                  loading={hook.loading}
                  currentPage={hook.currentPage}
                  rowsPerPage={hook.rowsPerPage}
                  totalPages={hook.totalPages}
                  onPageChange={hook.setCurrentPage}
                  onViewClick={(user) => {
                    setResetCredentials(null);
                    setActiveViewUser(user);
                  }}
                  onEditClick={(targetUser) => {
                    setActiveEditUser(targetUser);
                    setIsFormOpen(true);
                  }}
                  filters={hook.filters}
                />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <UserModalView
        open={!!activeViewUser}
        user={activeViewUser}
        resetData={resetCredentials}
        onClose={() => {
          setActiveViewUser(null);
          setResetCredentials(null);
        }}
      />

      <UserFormModal
        open={isFormOpen}
        userId={activeEditUser?.master_user_id}
        onSuccess={hook.triggerRefresh}
        openViewModalWithReset={handleOpenViewWithReset}
        onClose={() => {
          setIsFormOpen(false);
          setActiveEditUser(null);
        }}
      />

      {/* STYLES */}
      <style>{`
        .content-area { display: flex; flex: 1; min-height: 0; background-color: #f1f5f9; }
        .main-area { display: flex; flex-direction: column; flex: 1; overflow-y: auto; }
        .nic-main-content { flex: 1; padding: 24px; }
        .nic-container { max-width: 1200px; margin: 0 auto; }
        .nic-page-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; background: #ffffff; padding: 16px 24px;
          border-radius: 8px; border-left: 5px solid #1e3a8a;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .nic-page-title { margin: 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; }
        .nic-title-icon { color: #1e3a8a; margin-right: 12px; font-size: 24px; }
        .nic-header-actions { display: flex; gap: 12px; }
        .nic-btn-outline {
          display: flex; align-items: center; background: #ffffff; color: #1e3a8a;
          border: 1px solid #1e3a8a; padding: 8px 16px; border-radius: 4px;
          font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .nic-btn-outline:hover:not(:disabled) { background: #eff6ff; box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1); }
        .nic-btn-outline:disabled { color: #94a3b8; border-color: #cbd5e1; cursor: not-allowed; }
        .nic-table-section {
          background: #ffffff; padding: 0; border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }
        .nic-spin { animation: nic-spin 1s linear infinite; }
        @keyframes nic-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
