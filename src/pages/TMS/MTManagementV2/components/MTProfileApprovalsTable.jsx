// src/pages/TMS/MTManagementV2/components/MTProfileApprovalsTable.jsx
import React from "react";
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function MTProfileApprovalsTable({
  profiles,
  loading,
  currentPage,
  rowsPerPage,
  onViewClick,
  onActionClick, // Triggered when clicking Approve/Reject: (trainerId, 'VERIFIED' or 'REJECTED')
  isSMMU,
  isDMMU,
  isBMMU,
}) {
  // --------------------------------------------------------
  // RBAC Action Logic Evaluator
  // --------------------------------------------------------
  const canPerformAction = (status, designation) => {
    if (status !== "PENDING") return false;

    const desigUpper = String(designation).toUpperCase();
    if (isDMMU && desigUpper === "BRP") return true;
    if (isSMMU && (desigUpper === "BRP" || desigUpper === "DRP")) return true;

    // BMMU has no approval authority, SMMU cannot approve SRPs (SRPs auto-verify)
    return false;
  };

  // --------------------------------------------------------
  // Status Badge Renderer
  // --------------------------------------------------------
  const renderStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span
            className="nic-badge"
            style={{
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
            }}
          >
            <FaCheckCircle style={{ marginRight: "4px" }} /> Verified
          </span>
        );
      case "REJECTED":
        return (
          <span
            className="nic-badge"
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
            }}
          >
            <FaTimesCircle style={{ marginRight: "4px" }} /> Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span
            className="nic-badge"
            style={{
              background: "#fef3c7",
              color: "#b45309",
              border: "1px solid #fde047",
            }}
          >
            <FaClock style={{ marginRight: "4px" }} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="nic-table-wrapper">
      <div className="nic-table-responsive">
        <table className="nic-table">
          <thead>
            <tr>
              <th style={{ width: "60px", textAlign: "center" }}>S.No.</th>
              <th style={{ width: "220px" }}>Trainer Identity</th>
              <th style={{ width: "160px" }}>Location (Dist / Block)</th>
              <th style={{ width: "160px" }}>Role & Theme</th>
              <th style={{ width: "140px", textAlign: "center" }}>
                Current Status
              </th>
              <th style={{ width: "240px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="nic-td-center">
                  Loading Registration Requests...
                </td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={6} className="nic-td-center">
                  No registration requests found matching the current filters.
                </td>
              </tr>
            ) : (
              profiles.map((profile, index) => {
                const serialNo = (currentPage - 1) * rowsPerPage + index + 1;
                const trainer = profile.trainer || {};

                // Safely extract nested relations
                const districtName =
                  trainer.empanel_district?.district_name_en || "N/A";
                const blockName = trainer.empanel_block?.block_name_en || "N/A";
                const themeName = trainer.theme?.theme_name || "Unassigned";

                const showActionButtons = canPerformAction(
                  profile.status,
                  trainer.designation,
                );

                return (
                  <tr key={profile.id}>
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
                          {trainer.full_name || "—"}
                        </strong>
                        <span className="text-muted">
                          📞 {trainer.mobile_no || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="nic-cell-stack">
                        <strong>{districtName}</strong>
                        <span className="text-muted">{blockName}</span>
                      </div>
                    </td>

                    <td>
                      <div className="nic-cell-stack">
                        <span
                          className="nic-badge badge-neutral"
                          style={{ width: "fit-content" }}
                        >
                          {trainer.designation || "N/A"}
                        </span>
                        <span
                          className="text-muted"
                          style={{ marginTop: "4px" }}
                        >
                          {themeName}
                        </span>
                      </div>
                    </td>

                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      {renderStatusBadge(profile.status)}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <div className="nic-action-group">
                        <button
                          className="nic-btn-action btn-view"
                          onClick={() => onViewClick(trainer)}
                          title="View Profile Details"
                        >
                          <FaEye /> View
                        </button>

                        {showActionButtons && (
                          <>
                            <button
                              className="nic-btn-action btn-activate"
                              onClick={() => onActionClick(trainer, "VERIFIED")}
                              title="Approve Registration"
                            >
                              <FaCheckCircle /> Approve
                            </button>
                            <button
                              className="nic-btn-action btn-suspend"
                              onClick={() => onActionClick(trainer, "REJECTED")}
                              title="Reject Registration"
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
          border-radius: 4px;
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
        .nic-table thead th:last-child { border-right: none; }
        .nic-table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          border-right: 1px solid #f8fafc;
          vertical-align: top;
          color: #334155;
        }
        .nic-table tbody tr:nth-child(even) { background-color: #f8fafc; }
        .nic-table tbody tr:hover { background-color: #eff6ff; }
        .nic-td-center {
          text-align: center !important;
          padding: 40px !important;
          color: #64748b !important;
          font-weight: 500;
          font-size: 14px;
        }
        .nic-cell-stack { display: flex; flex-direction: column; gap: 4px; }
        .text-primary { color: #1e3a8a; font-size: 14px; }
        .text-muted { color: #64748b; font-size: 12px; }
        .nic-badge {
          display: inline-flex; align-items: center; padding: 4px 10px;
          border-radius: 6px; font-size: 11px; font-weight: 700;
          text-transform: uppercase;
        }
        .badge-neutral { background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; }
        
        .nic-action-group { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
        .nic-btn-action {
          display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px;
          border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;
          border: 1px solid transparent; transition: 0.2s;
        }
        .btn-view { background: #f1f5f9; color: #475569; border-color: #cbd5e1; }
        .btn-view:hover { background: #e2e8f0; color: #1e293b; }
        .btn-activate { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
        .btn-activate:hover { background: #dcfce7; }
        .btn-suspend { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
        .btn-suspend:hover { background: #ffe4e6; }
      `}</style>
    </div>
  );
}
