// src/pages/TMS/MTManagementV2/screens/MTDirectoryConductor.jsx
import React, { useState } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import LeftNav from "../../layout/tms_LeftNav";
import { FaUserTie, FaSyncAlt, FaPlus } from "react-icons/fa";

// Import Hooks & Presentational Components
import { useMTList } from "../hooks/useMTList";
import MTFilterPanel from "../components/MTFilterPanel";
import MTTable from "../components/MTTable";
import MTFormModal from "../components/MTFormModal";
import MTCertificateManager from "../components/MTCertificateManager";
import MTDetailViewer from "../components/MTDetailViewer";

export default function MTDirectoryConductor() {
  const [navCollapsed, setNavCollapsed] = useState(false);

  // --------------------------------------------------------
  // Modal & View States
  // --------------------------------------------------------
  const [viewTrainer, setViewTrainer] = useState(null); // For MTDetailViewer
  const [certTrainer, setCertTrainer] = useState(null); // For MTCertificateManager

  // Form Modal State (Handles both Create and Update)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTrainerId, setFormTrainerId] = useState(null);

  // --------------------------------------------------------
  // Hook Initialization
  // --------------------------------------------------------
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
    isDMMU,
    isBMMU,
    lockedDistrict,
    lockedBlock,
    lockedTheme,
    triggerRefresh,
  } = useMTList();

  // --------------------------------------------------------
  // Handlers
  // --------------------------------------------------------
  const handleOpenCreate = () => {
    setFormTrainerId(null);
    setIsFormOpen(true);
  };

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

  const displayTitle = isDMMU
    ? "District Master Trainer Directory"
    : "State Master Trainer Directory";

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
                <h2 className="nic-page-title">
                  <FaUserTie className="nic-title-icon" />
                  {displayTitle}
                </h2>

                <div className="nic-header-actions">
                  <button
                    className="nic-btn-outline"
                    onClick={triggerRefresh}
                    disabled={loading}
                    title="Refresh Directory Data"
                  >
                    <FaSyncAlt
                      className={loading ? "nic-spin" : ""}
                      style={{ marginRight: "6px" }}
                    />
                    Refresh
                  </button>

                  <button
                    className="nic-btn-primary"
                    onClick={handleOpenCreate}
                    title="Register a new Master Trainer"
                  >
                    <FaPlus style={{ marginRight: "6px" }} />
                    Register Trainer
                  </button>
                </div>
              </div>

              {/* FILTER SYSTEM */}
              <MTFilterPanel
                filters={filters}
                setFilters={setFilters}
                targetRole={isBMMU ? "bmmu" : isDMMU ? "dmmu" : "smmu"}
                lockedDistrict={lockedDistrict}
                lockedBlock={lockedBlock}
                lockedTheme={lockedTheme}
              />

              {/* DATA TABLE */}
              <div className="nic-table-section">
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
                  isSMMU={!isDMMU && !isBMMU}
                  lockedTheme={lockedTheme}
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

      {/* 1. Create / Update Form Modal */}
      <MTFormModal
        open={isFormOpen}
        trainerId={formTrainerId}
        onClose={handleCloseForm}
        onSuccessRefresh={handleSuccessRefresh}
        isDMMU={isDMMU}
        isSMMU={!isDMMU && !isBMMU}
        lockedDistrict={lockedDistrict}
        lockedTheme={lockedTheme}
      />

      {/* 2. Certificate Management Modal */}
      {certTrainer && (
        <MTCertificateManager
          open={Boolean(certTrainer)}
          trainer={certTrainer}
          onClose={() => setCertTrainer(null)}
          onSuccessRefresh={triggerRefresh}
          isApprovalMode={false} // Directory screen is strictly for management/uploading
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

        .nic-btn-primary {
          display: inline-flex;
          align-items: center;
          background-color: #1e3a8a;
          color: #ffffff;
          border: 1px solid #1e3a8a;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-btn-primary:hover {
          background-color: #1e40af;
          border-color: #1e40af;
          box-shadow: 0 4px 6px rgba(30, 58, 138, 0.2);
        }

        .nic-table-section {
          background: #ffffff;
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
            flex-direction: column;
          }
          .nic-btn-outline, .nic-btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
