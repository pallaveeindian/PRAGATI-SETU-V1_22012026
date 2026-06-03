import React, { useState } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { FaUserShield, FaSyncAlt } from "react-icons/fa";

// Import the hook and components
import { useUsers } from "./hooks/useUsers";
import UserFilterPanel from "./components/UserFilterPanel";
import UserTable from "./components/UserTable";
import UserModalView from "./components/UserModalView";
import UserFormModal from "./components/UserFormModal";

/**
 * Core Layout Conductor for User Management
 * @param {string} targetRole - Pass "bmmu" when used on DMMU screen, or "dmmu" when used on SMMU screen.
 */
export default function UserMgmnt({ targetRole = "bmmu" }) {
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Tracking which user is active in the floating modals
  const [activeViewUser, setActiveViewUser] = useState(null);
  const [activeEditUser, setActiveEditUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize the central orchestrator hook
  const hook = useUsers(targetRole);

  const displayTitle =
    targetRole === "dmmu" ? "DMMU User Directory" : "BMMU User Directory";

  return (
    <div className="app-shell">
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
                targetRole={targetRole}
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
                  onViewClick={setActiveViewUser}
                  onEditClick={(targetUser) => {
                    setActiveEditUser(targetUser);
                    setIsFormOpen(true);
                  }}
                  onStatusToggle={(userId, updates) =>
                    hook.manageUserMutation(userId, updates)
                  }
                  targetRole={targetRole}
                />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* Floating Detailed Viewer Frame Context Drawer */}
      <UserModalView
        open={!!activeViewUser}
        user={activeViewUser}
        onClose={() => setActiveViewUser(null)}
        targetRole={targetRole}
      />

      {/* Shared Profile Dynamic Context Form Modification Frame */}
      <UserFormModal
        open={isFormOpen}
        userInstance={activeEditUser}
        submitting={hook.submitting}
        onSave={hook.manageUserMutation}
        onClose={() => {
          setIsFormOpen(false);
          setActiveEditUser(null);
        }}
      />

      {/* STYLES: NIC GOV STANDARD LAYOUT */}
      <style>{`
        .content-area { 
          display: flex; 
          flex: 1; 
          min-height: 0; 
          background-color: #f1f5f9;
        }
        
        .main-area {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
        }

        .nic-main-content {
          flex: 1;
          padding: 24px;
        }

        .nic-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .nic-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          background: #ffffff;
          padding: 16px 24px;
          border-radius: 8px;
          border-left: 5px solid #1e3a8a; /* Gov Blue Accent */
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .nic-page-title {
          margin: 0;
          color: #1e293b;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          letter-spacing: 0.5px;
        }

        .nic-title-icon {
          color: #1e3a8a;
          margin-right: 12px;
          font-size: 24px;
        }

        .nic-header-actions {
          display: flex;
          gap: 12px;
        }

        .nic-btn-outline {
          display: flex;
          align-items: center;
          background: #ffffff;
          color: #1e3a8a;
          border: 1px solid #1e3a8a;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-btn-outline:hover:not(:disabled) {
          background: #eff6ff;
          box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1);
        }

        .nic-btn-outline:disabled {
          color: #94a3b8;
          border-color: #cbd5e1;
          cursor: not-allowed;
        }

        .nic-table-section {
          background: #ffffff;
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        /* Utility classes */
        .nic-spin {
          animation: nic-spin 1s linear infinite;
        }

        @keyframes nic-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .nic-main-content {
            padding: 16px;
          }
          .nic-page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .nic-header-actions {
            width: 100%;
          }
          .nic-btn-outline {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
