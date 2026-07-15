// src/pages/TMS/MTManagementV2/screens/MTPendingApprovalsConductor.jsx
import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import LeftNav from "../../layout/tms_LeftNav";
import {
  FaClipboardCheck,
  FaSyncAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import { AuthContext } from "../../../../contexts/AuthContext";
import { getCanonicalRole } from "../../../../utils/roleUtils";

// Import Hooks & Presentational Components
import { useMTList } from "../hooks/useMTList";
import MTFilterPanel from "../components/MTFilterPanel";
import MTTable from "../components/MTTable";
import MTFormModal from "../components/MTFormModal";
import MTCertificateManager from "../components/MTCertificateManager";
import MTDetailViewer from "../components/MTDetailViewer";

export default function MTPendingApprovalsConductor() {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  // SMMU Protection Check
  const isSMMU =
    role === "smmu" || role === "1" || String(user?.role_id) === "12";

  const [navCollapsed, setNavCollapsed] = useState(false);

  // --------------------------------------------------------
  // Modal & View States
  // --------------------------------------------------------
  const [viewTrainer, setViewTrainer] = useState(null); // For MTDetailViewer
  const [certTrainer, setCertTrainer] = useState(null); // For MTCertificateManager

  // Form Modal State (In case SMMU needs to make a quick correction while reviewing)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTrainerId, setFormTrainerId] = useState(null);

  // --------------------------------------------------------
  // Hook Initialization with Strict Internal Filter
  // --------------------------------------------------------
  // By passing `pending_tot_approvals: true`, we instruct the backend to only return
  // trainers who have uploaded certificates but have unverified (False) `tot_*` fields.
  const {
    trainers,
    loading,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filters,
    setFilters,
    triggerRefresh,
  } = useMTList({ pending_tot_approvals: true });

  // --------------------------------------------------------
  // Handlers
  // --------------------------------------------------------
  const handleOpenEdit = (trainer) => {
    setFormTrainerId(trainer.id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormTrainerId(null);
  };

  const handleSuccessRefresh = () => {
    triggerRefresh();
    handleCloseForm();
  };

  // Route Guard: Kick out non-SMMU users immediately
  if (!isSMMU) {
    return (
      <div className="app-shell">
        <Header />
        <div className="content-area">
          <LeftNav
            collapsed={navCollapsed}
            onToggle={() => setNavCollapsed((v) => !v)}
          />
          <div
            className="main-area"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="nic-alert-danger"
              style={{ padding: "24px", fontSize: "16px" }}
            >
              <FaExclamationTriangle
                style={{ marginRight: "12px", fontSize: "24px" }}
              />
              <strong>Unauthorized Access:</strong> Only SMMU administrators can
              review and approve pending TOT certifications.
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {/* PAGE HEADER & QUICK ACTIONS */}
              <div className="nic-page-header">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <h2 className="nic-page-title text-warning">
                    <FaClipboardCheck className="nic-title-icon text-warning" />
                    Pending TOT Approvals
                  </h2>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      marginLeft: "34px",
                    }}
                  >
                    Review certificates uploaded by DMMU and verify Trainer TOT
                    statuses.
                  </span>
                </div>

                <div className="nic-header-actions">
                  <button
                    className="nic-btn-outline"
                    onClick={triggerRefresh}
                    disabled={loading}
                    title="Refresh Approvals Queue"
                  >
                    <FaSyncAlt
                      className={loading ? "nic-spin" : ""}
                      style={{ marginRight: "6px" }}
                    />
                    Refresh Queue
                  </button>
                </div>
              </div>

              {/* FILTER SYSTEM */}
              {/* Target role is strictly SMMU here, meaning they get the full geographic dropdowns */}
              <MTFilterPanel
                filters={filters}
                setFilters={setFilters}
                targetRole="smmu"
                lockedDistrict={null}
              />

              {/* DATA TABLE */}
              <div
                className="nic-table-section"
                style={{ borderTop: "4px solid #ca8a04" }}
              >
                <MTTable
                  trainers={trainers}
                  loading={loading}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onViewClick={(trainer) => setViewTrainer(trainer)}
                  onEditClick={handleOpenEdit}
                  onCertificatesClick={(trainer) => setCertTrainer(trainer)}
                />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* --------------------------------------------------------
          MODAL RENDERERS 
      -------------------------------------------------------- */}

      {/* 1. Update Form Modal (In case SMMU needs to fix a typo) */}
      <MTFormModal
        open={isFormOpen}
        trainerId={formTrainerId}
        onClose={handleCloseForm}
        onSuccessRefresh={handleSuccessRefresh}
        isDMMU={false} // Always SMMU in this view
        lockedDistrict={null}
      />

      {/* 2. Certificate Management Modal (Strictly Approval Mode) */}
      {certTrainer && (
        <MTCertificateManager
          open={Boolean(certTrainer)}
          trainer={certTrainer}
          onClose={() => setCertTrainer(null)}
          onSuccessRefresh={triggerRefresh}
          isApprovalMode={true} // Activates the Approve/Reject UI in the component
        />
      )}

      {/* 3. Detailed View Modal (Read-Only) */}
      {viewTrainer && (
        <MTDetailViewer
          open={Boolean(viewTrainer)}
          trainerId={viewTrainer.id}
          onClose={() => setViewTrainer(null)}
        />
      )}

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
          max-width: 1300px;
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
          border-left: 5px solid #ca8a04; /* Yellow/Gold Accent for Pending items */
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

        .text-warning { color: #a16207 !important; }

        .nic-title-icon {
          color: #1e3a8a;
          margin-right: 12px;
          font-size: 22px;
        }

        .nic-header-actions {
          display: flex;
          gap: 12px;
        }

        .nic-btn-outline {
          display: inline-flex;
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
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .nic-alert-danger {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 6px;
          display: flex;
          align-items: center;
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
            flex-direction: column;
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
