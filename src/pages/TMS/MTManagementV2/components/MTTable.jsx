// src/pages/TMS/MTManagementV2/components/MTTable.jsx
import React from "react";
import {
  FaEye,
  FaEdit,
  FaFileContract,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import MTExport from "./MTExport";

export default function MTTable({
  trainers,
  loading,
  currentPage,
  rowsPerPage,
  totalPages,
  onPageChange,
  onViewClick,
  onEditClick,
  onCertificatesClick,
  isSMMU,
  lockedTheme,
}) {
  // Helper to render a boolean TOT status badge
  const renderTotBadge = (label, value) => {
    const isActive = value === 1 || value === true;
    return (
      <span
        className={`nic-tot-badge ${isActive ? "tot-active" : "tot-inactive"}`}
        title={isActive ? `${label} Certified` : `${label} Pending`}
      >
        {isActive ? (
          <FaCheckCircle className="tot-icon" />
        ) : (
          <FaTimesCircle className="tot-icon" />
        )}
        {label}
      </span>
    );
  };

  return (
    <div className="nic-table-wrapper">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 16px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <MTExport
          trainers={trainers}
          isSMMU={isSMMU}
          lockedTheme={lockedTheme}
        />
      </div>

      <div className="nic-table-responsive">
        <table className="nic-table">
          <thead>
            <tr>
              <th style={{ width: "60px", textAlign: "center" }}>S.No.</th>
              <th style={{ width: "220px" }}>Identity & Contact</th>
              <th style={{ width: "180px" }}>District</th>
              <th style={{ width: "160px" }}>Theme & Designation</th>
              <th style={{ minWidth: "280px" }}>Certifications (TOTs)</th>
              <th style={{ width: "260px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="nic-td-center">
                  Loading Master Trainers...
                </td>
              </tr>
            ) : trainers.length === 0 ? (
              <tr>
                <td colSpan={6} className="nic-td-center">
                  No Master Trainers found matching the current filters.
                </td>
              </tr>
            ) : (
              trainers.map((trainer, index) => {
                const serialNo = (currentPage - 1) * rowsPerPage + index + 1;

                return (
                  <tr key={trainer.id}>
                    <td
                      style={{
                        textAlign: "center",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      {serialNo}
                    </td>

                    <td>
                      <div className="nic-cell-stack">
                        <strong className="text-primary">
                          {trainer.full_name}
                        </strong>
                        <span className="text-muted">
                          📞 {trainer.mobile_no || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="nic-cell-stack">
                        <strong>{trainer.district_name_en || "N/A"}</strong>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: "600", color: "#334155" }}>
                        {trainer.designation || "N/A"}-
                        {trainer.theme_name || "Unassigned"}
                      </span>
                    </td>

                    <td>
                      <div className="nic-tot-grid">
                        {renderTotBadge("Induction", trainer.induction)}
                        {renderTotBadge("SMCB", trainer.tot_smcb)}
                        {renderTotBadge("MF&FI", trainer.tot_mffi)}
                        {renderTotBadge("SISD", trainer.tot_sisd)}
                        {renderTotBadge("Farm LH", trainer.tot_farm_lh)}
                        {renderTotBadge("Non-Farm LH", trainer.tot_non_farm_lh)}
                        {renderTotBadge("Model CLF", trainer.tot_model_clf)}
                        {renderTotBadge("LOKOS", trainer.tot_lokos)}
                      </div>
                    </td>

                    <td>
                      <div className="nic-action-group">
                        <button
                          className="nic-btn-action btn-view"
                          onClick={() => onViewClick(trainer)}
                          title="View Comprehensive Profile"
                        >
                          <FaEye /> View
                        </button>

                        <button
                          className="nic-btn-action btn-edit"
                          onClick={() => onEditClick(trainer)}
                          title="Edit Basic Details"
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          className="nic-btn-action btn-cert"
                          onClick={() => onCertificatesClick(trainer)}
                          title="Manage & Upload Certificates"
                        >
                          <FaFileContract /> Certs
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {!loading && trainers.length > 0 && (
        <div className="nic-pagination-bar">
          <div className="nic-page-info">
            Showing page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages || 1}</strong>
          </div>

          <div className="nic-page-controls">
            <button
              className="nic-btn-page"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>

            {/* Simple Windowing for Pages */}
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    className={`nic-btn-page ${currentPage === p ? "active" : ""}`}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                );
              }
              if (p === currentPage - 2 || p === currentPage + 2) {
                return (
                  <span key={p} className="nic-page-dots">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className="nic-btn-page"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STYLES: NIC GOV STANDARD */}
      <style>{`
        .nic-table-wrapper {
          background: #ffffff;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .nic-table-responsive {
          overflow-x: auto;
          border: 1px solid #cbd5e1;
          border-radius: 4px 4px 0 0;
        }

        .nic-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 13px;
        }

        .nic-table thead th {
          background-color: #1e3a8a; 
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 12px 14px;
          border-right: 1px solid #3b82f6;
          white-space: nowrap;
        }
        .nic-table thead th:last-child {
          border-right: none;
        }

        .nic-table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          border-right: 1px solid #f8fafc;
          vertical-align: top;
          color: #334155;
        }
        
        .nic-table tbody tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .nic-table tbody tr:hover {
          background-color: #eff6ff;
        }

        .nic-td-center {
          text-align: center !important;
          padding: 40px !important;
          color: #64748b !important;
          font-weight: 500;
          font-size: 14px;
        }

        /* Cell Stacking */
        .nic-cell-stack {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .text-primary { color: #1e3a8a; font-size: 14px; }
        .text-muted { color: #64748b; font-size: 12px; }

        /* Badges */
        .nic-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          width: fit-content;
        }
        .badge-neutral { background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; }

        /* TOT Boolean Grid */
        .nic-tot-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .nic-tot-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid transparent;
        }
        .tot-active {
          background-color: #f0fdf4;
          color: #166534;
          border-color: #bbf7d0;
        }
        .tot-inactive {
          background-color: #fef2f2;
          color: #991b1b;
          border-color: #fecaca;
        }
        .tot-icon {
          font-size: 10px;
        }

        /* ACTION BUTTONS */
        .nic-action-group {
          display: flex;
          gap: 6px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nic-btn-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        
        .btn-view { background: #f1f5f9; color: #475569; border-color: #cbd5e1; }
        .btn-view:hover { background: #e2e8f0; color: #1e293b; }
        
        .btn-edit { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
        .btn-edit:hover { background: #dbeafe; color: #1d4ed8; }

        .btn-cert { background: #fefce8; color: #ca8a04; border-color: #fef08a; }
        .btn-cert:hover { background: #fef08a; color: #a16207; }

        /* PAGINATION */
        .nic-pagination-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        .nic-page-info {
          font-size: 13px;
          color: #475569;
        }

        .nic-page-controls {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .nic-btn-page {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e3a8a;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nic-btn-page:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .nic-btn-page.active {
          background: #1e3a8a;
          color: #ffffff;
          border-color: #1e3a8a;
        }
        .nic-btn-page:disabled {
          background: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
        }
        .nic-page-dots {
          color: #64748b;
          font-weight: bold;
          padding: 0 4px;
        }
        .nic-btn-export {
          background-color: #16a34a;
          color: #ffffff;
          border: 1px solid #15803d;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s;
        }
        .nic-btn-export:hover:not(:disabled) {
          background-color: #15803d;
          box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2);
        }
        .nic-btn-export:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }  
      `}</style>
    </div>
  );
}
