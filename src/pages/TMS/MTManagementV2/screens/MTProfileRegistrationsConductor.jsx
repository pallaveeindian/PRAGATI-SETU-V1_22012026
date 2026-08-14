// src/pages/TMS/MTManagementV2/screens/MTProfileRegistrationsConductor.jsx
import React, { useState, useEffect } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import LeftNav from "../../layout/tms_LeftNav";
import {
  FaUserPlus,
  FaSyncAlt,
  FaSearch,
  FaTimes,
  FaLock,
} from "react-icons/fa";

// Import Hooks & Presentational Components
import { useMTProfileApprovals } from "../hooks/useMTProfileApprovals";
import MTProfileApprovalsTable from "../components/MTProfileApprovalsTable";
import MTApprovalActionModal from "../components/MTApprovalActionModal";
import MTDetailViewer from "../components/MTDetailViewer";
import { LOOKUP_API } from "../../../../api/axios";

export default function MTProfileRegistrationsConductor() {
  const [navCollapsed, setNavCollapsed] = useState(false);

  // --------------------------------------------------------
  // Hook Initialization
  // --------------------------------------------------------
  const {
    approvals,
    loading,
    actionLoading,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filters,
    setFilters,
    isSMMU,
    isDMMU,
    isBMMU,
    lockedDistrict,
    lockedBlock,
    triggerRefresh,
    handleVerifyProfile,
  } = useMTProfileApprovals();

  // --------------------------------------------------------
  // Lookup States for Local Filters
  // --------------------------------------------------------
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (isSMMU || isDMMU) {
      LOOKUP_API.districts
        .list({ page_size: 5000 })
        .then((res) => setDistricts(res?.data?.results || []))
        .catch(console.error);
    }
  }, [isSMMU, isDMMU]);

  useEffect(() => {
    const targetDistrict = filters.district_id || lockedDistrict;
    if (!targetDistrict) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocks
      .list({ district_id: targetDistrict, page_size: 200 })
      .then((res) => setBlocks(res?.data?.results || []))
      .catch(console.error);
  }, [filters.district_id, lockedDistrict]);

  // --------------------------------------------------------
  // Modal & View States
  // --------------------------------------------------------
  const [viewTrainer, setViewTrainer] = useState(null); // For MTDetailViewer
  const [actionModalConfig, setActionModalConfig] = useState({
    open: false,
    trainer: null,
    type: null, // 'VERIFIED' or 'REJECTED'
  });

  // --------------------------------------------------------
  // Handlers
  // --------------------------------------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "district_id") next.block_id = ""; // Reset block on district change
      return next;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      district_id: isDMMU ? lockedDistrict : "",
      block_id: isBMMU ? lockedBlock : "",
      designation: "",
      status: "PENDING",
      theme: "", // Cleared unless locked by hook
    });
  };

  const handleOpenActionModal = (trainer, actionType) => {
    setActionModalConfig({
      open: true,
      trainer,
      type: actionType,
    });
  };

  const handleConfirmAction = async (remarks) => {
    const { trainer, type } = actionModalConfig;
    const res = await handleVerifyProfile(trainer.id, type, remarks);
    if (res.success) {
      setActionModalConfig({ open: false, trainer: null, type: null });
    }
  };

  const hasActiveClearableFilters = Boolean(
    (!isDMMU && filters.district_id) ||
    (!isBMMU && filters.block_id) ||
    filters.designation ||
    filters.status !== "PENDING",
  );

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
              {/* PAGE HEADER */}
              <div className="nic-page-header">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <h2 className="nic-page-title">
                    <FaUserPlus className="nic-title-icon" />
                    Trainer Registration Requests
                  </h2>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      marginLeft: "34px",
                    }}
                  >
                    Track, review, and verify new Master Trainer profile
                    registrations.
                  </span>
                </div>

                <div className="nic-header-actions">
                  <button
                    className="nic-btn-outline"
                    onClick={triggerRefresh}
                    disabled={loading}
                    title="Refresh Registration List"
                  >
                    <FaSyncAlt
                      className={loading ? "nic-spin" : ""}
                      style={{ marginRight: "6px" }}
                    />
                    Refresh
                  </button>
                </div>
              </div>

              {/* DEDICATED FILTER PANEL */}
              <div className="nic-filter-panel">
                <div className="nic-filter-header">
                  <h4 className="nic-filter-title">
                    <FaSearch
                      style={{ marginRight: "8px", color: "#1e3a8a" }}
                    />
                    Filter Registrations
                  </h4>
                  {hasActiveClearableFilters && (
                    <button
                      className="nic-btn-clear"
                      onClick={handleClearFilters}
                      type="button"
                    >
                      <FaTimes style={{ marginRight: "4px" }} /> Clear Filters
                    </button>
                  )}
                </div>

                <div className="nic-filter-grid">
                  {/* Status Filter */}
                  <div className="nic-form-group">
                    <label className="nic-label">Verification Status</label>
                    <select
                      name="status"
                      className="nic-select"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="PENDING">Pending (Action Required)</option>
                      <option value="VERIFIED">Verified (Approved)</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="">All Statuses</option>
                    </select>
                  </div>

                  {/* Designation Filter */}
                  <div className="nic-form-group">
                    <label className="nic-label">Designation</label>
                    <select
                      name="designation"
                      className="nic-select"
                      value={filters.designation}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Designations</option>
                      <option value="BRP">BRP</option>
                      <option value="DRP">DRP</option>
                      <option value="SRP">SRP</option>
                    </select>
                  </div>

                  {/* District Filter (Hidden for BMMU) */}
                  {!isBMMU && (
                    <div className="nic-form-group">
                      <label className="nic-label">
                        District
                        {isDMMU && lockedDistrict && (
                          <FaLock
                            style={{
                              marginLeft: "6px",
                              color: "#ef4444",
                              fontSize: "11px",
                            }}
                            title="Locked to your district"
                          />
                        )}
                      </label>
                      <select
                        name="district_id"
                        className="nic-select"
                        value={filters.district_id}
                        onChange={handleFilterChange}
                        disabled={isDMMU}
                      >
                        <option value="">All Districts</option>
                        {districts.map((d) => (
                          <option key={d.district_id} value={d.district_id}>
                            {d.district_name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Block Filter */}
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Block
                      {isBMMU && lockedBlock && (
                        <FaLock
                          style={{
                            marginLeft: "6px",
                            color: "#ef4444",
                            fontSize: "11px",
                          }}
                          title="Locked to your block"
                        />
                      )}
                    </label>
                    <select
                      name="block_id"
                      className="nic-select"
                      value={filters.block_id}
                      onChange={handleFilterChange}
                      disabled={isBMMU || (!isDMMU && !filters.district_id)}
                    >
                      <option value="">All Blocks</option>
                      {blocks.map((b) => (
                        <option key={b.block_id} value={b.block_id}>
                          {b.block_name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* DATA TABLE */}
              <div className="nic-table-section">
                <MTProfileApprovalsTable
                  profiles={approvals}
                  loading={loading}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  onViewClick={(trainer) => setViewTrainer(trainer)}
                  onActionClick={handleOpenActionModal}
                  isSMMU={isSMMU}
                  isDMMU={isDMMU}
                  isBMMU={isBMMU}
                />
              </div>

              {/* PAGINATION CONTROLS */}
              {!loading && approvals.length > 0 && (
                <div className="nic-pagination-bar">
                  <div className="nic-page-info">
                    Showing page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages || 1}</strong>
                  </div>
                  <div className="nic-page-controls">
                    <button
                      className="nic-btn-page"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <span className="nic-page-dots">...</span>
                    <button
                      className="nic-btn-page"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* --------------------------------------------------------
          MODAL RENDERERS 
      -------------------------------------------------------- */}

      {/* 1. Approval / Rejection Action Modal */}
      <MTApprovalActionModal
        open={actionModalConfig.open}
        trainer={actionModalConfig.trainer}
        actionType={actionModalConfig.type}
        submitting={actionLoading}
        onClose={() =>
          !actionLoading &&
          setActionModalConfig({ open: false, trainer: null, type: null })
        }
        onConfirm={handleConfirmAction}
      />

      {/* 2. Detailed View Modal (Read-Only) */}
      {viewTrainer && (
        <MTDetailViewer
          open={Boolean(viewTrainer)}
          trainerId={viewTrainer.id}
          onClose={() => setViewTrainer(null)}
        />
      )}

      {/* STYLES: NIC GOV STANDARD LAYOUT */}
      <style>{`
        .content-area { display: flex; flex: 1; min-height: 0; background-color: #f1f5f9; }
        .main-area { display: flex; flex-direction: column; flex: 1; overflow-y: auto; }
        .nic-main-content { flex: 1; padding: 24px; }
        .nic-container { max-width: 1300px; margin: 0 auto; }

        .nic-page-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; background: #ffffff; padding: 16px 24px;
          border-radius: 8px; border-left: 5px solid #1e3a8a; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .nic-page-title { margin: 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; letter-spacing: 0.5px; }
        .nic-title-icon { color: #1e3a8a; margin-right: 12px; font-size: 22px; }
        .nic-header-actions { display: flex; gap: 12px; }

        .nic-btn-outline {
          display: inline-flex; align-items: center; background: #ffffff; color: #1e3a8a;
          border: 1px solid #1e3a8a; padding: 8px 16px; border-radius: 4px; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .nic-btn-outline:hover:not(:disabled) { background: #eff6ff; box-shadow: 0 2px 4px rgba(30, 58, 138, 0.1); }
        .nic-btn-outline:disabled { color: #94a3b8; border-color: #cbd5e1; cursor: not-allowed; }

        /* Filter Panel Styles */
        .nic-filter-panel { background: #ffffff; border: 1px solid #cbd5e1; border-top: 4px solid #1e3a8a; border-radius: 6px; padding: 16px 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); }
        .nic-filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
        .nic-filter-title { margin: 0; font-size: 15px; font-weight: 600; color: #334155; display: flex; align-items: center; text-transform: uppercase; letter-spacing: 0.5px; }
        .nic-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; align-items: flex-end; }
        .nic-form-group { display: flex; flex-direction: column; gap: 6px; }
        .nic-label { font-size: 13px; font-weight: 600; color: #475569; letter-spacing: 0.2px; display: flex; align-items: center; }
        .nic-select { padding: 9px 12px; font-size: 14px; color: #1e293b; border: 1px solid #94a3b8; border-radius: 4px; background-color: #f8fafc; transition: all 0.2s ease; width: 100%; box-sizing: border-box; min-height: 40px; }
        .nic-select:focus { outline: none; border-color: #1e3a8a; background-color: #ffffff; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }
        .nic-select:disabled { background-color: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
        .nic-btn-clear { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; transition: all 0.2s; }
        .nic-btn-clear:hover { background: #fef2f2; color: #b91c1c; border-color: #b91c1c; }

        .nic-table-section { background: #ffffff; padding: 0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden; }

        /* PAGINATION */
        .nic-pagination-bar { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-top: none; border-radius: 0 0 8px 8px; }
        .nic-page-info { font-size: 13px; color: #475569; }
        .nic-page-controls { display: flex; gap: 4px; align-items: center; }
        .nic-btn-page { background: #ffffff; border: 1px solid #cbd5e1; color: #1e3a8a; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .nic-btn-page:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; }
        .nic-btn-page:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
        .nic-page-dots { color: #64748b; font-weight: bold; padding: 0 4px; }

        .nic-spin { animation: nic-spin 1s linear infinite; }
        @keyframes nic-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
