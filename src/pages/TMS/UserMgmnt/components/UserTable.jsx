// UserMgmnt/components/UserTable.jsx
import React from "react";
import { FaEye, FaEdit, FaPowerOff, FaLock, FaBan } from "react-icons/fa";

export default function UserTable({
  users,
  loading,
  currentPage,
  rowsPerPage,
  totalPages,
  onPageChange,
  onViewClick,
  onEditClick,
  onStatusToggle,
  targetRole, // "bmmu" or "dmmu"
}) {
  // Format dates securely
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="nic-table-wrapper">
      <div className="nic-table-responsive">
        <table className="nic-table">
          <thead>
            <tr>
              <th style={{ width: "60px", textAlign: "center" }}>S.No.</th>
              <th>Username</th>
              <th>{targetRole === "bmmu" ? "Block" : "District"}</th>
              <th style={{ width: "120px" }}>Status</th>
              <th style={{ width: "160px" }}>Account State</th>
              <th style={{ width: "180px" }}>Last Active</th>
              <th style={{ width: "240px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="nic-td-center">
                  Loading directory records...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="nic-td-center">
                  No user records found matching the criteria.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const serialNo = (currentPage - 1) * rowsPerPage + index + 1;
                const isActive =
                  user.is_active === 1 || user.is_active === true;
                const isLocked =
                  user.is_locked === 1 || user.is_locked === true;
                const isSuspended =
                  user.is_suspended === 1 || user.is_suspended === true;

                return (
                  <tr key={user.user_id}>
                    <td
                      style={{
                        textAlign: "center",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      {serialNo}
                    </td>

                    <td style={{ fontWeight: "600", color: "#1e3a8a" }}>
                      {user.username}
                    </td>

                    <td>
                      {targetRole === "bmmu"
                        ? user.block_name_en || "—"
                        : user.district_name_en || "—"}
                    </td>

                    <td>
                      <span
                        className={`nic-badge ${isActive ? "badge-success" : "badge-danger"}`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        {isLocked && (
                          <span
                            className="nic-badge badge-warning"
                            title={`Locked on: ${formatDate(user.locked_on)}`}
                          >
                            <FaLock
                              style={{ fontSize: "10px", marginRight: "4px" }}
                            />{" "}
                            Locked
                          </span>
                        )}
                        {isSuspended && (
                          <span
                            className="nic-badge badge-danger"
                            title={`Suspended on: ${formatDate(user.suspended_on)}`}
                          >
                            <FaBan
                              style={{ fontSize: "10px", marginRight: "4px" }}
                            />{" "}
                            Suspended
                          </span>
                        )}
                        {!isLocked && !isSuspended && (
                          <span className="nic-muted-text">WORKING</span>
                        )}
                      </div>
                    </td>

                    <td style={{ fontSize: "13px", color: "#475569" }}>
                      {formatDate(user.last_active_on)}
                    </td>

                    <td>
                      <div className="nic-action-group">
                        <button
                          className="nic-btn-action btn-view"
                          onClick={() => onViewClick(user)}
                          title="View Full Profile"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          className="nic-btn-action btn-edit"
                          onClick={() => onEditClick(user)}
                          title="Edit Profile / Reset Password"
                        >
                          <FaEdit /> Edit
                        </button>
                        {/* <button
                          className={`nic-btn-action ${isActive ? "btn-suspend" : "btn-activate"}`}
                          onClick={() => {
                            const action = isActive ? "Deactivate" : "Activate";
                            if (
                              window.confirm(
                                `Are you sure you want to ${action} ${user.username}?`,
                              )
                            ) {
                              onStatusToggle(user.user_id, {
                                is_active: !isActive,
                              });
                            }
                          }}
                          title={isActive ? "Deactivate User" : "Activate User"}
                        >
                          <FaPowerOff /> {isActive ? "Deactivate" : "Activate"}
                        </button> */}
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
      {!loading && users.length > 0 && (
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
          font-size: 14px;
          min-width: 900px;
        }

        /* Deep Gov Blue Header */
        .nic-table thead th {
          background-color: #1e3a8a; 
          color: #ffffff;
          font-weight: 600;
          text-align: left;
          padding: 12px 14px;
          border-right: 1px solid #3b82f6;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }
        .nic-table thead th:last-child {
          border-right: none;
        }

        .nic-table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          border-right: 1px solid #f1f5f9;
          vertical-align: middle;
          color: #334155;
        }
        .nic-table tbody td:last-child {
          border-right: none;
        }

        .nic-table tbody tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .nic-table tbody tr:hover {
          background-color: #eff6ff;
        }

        .nic-td-center {
          text-align: center !important;
          padding: 30px !important;
          color: #64748b !important;
          font-weight: 500;
        }

        /* BADGES */
        .nic-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-warning { background: #fef9c3; color: #9a3412; border: 1px solid #fde047; }
        .nic-muted-text { color: #94a3b8; font-size: 13px; font-style: italic; }

        /* ACTION BUTTONS */
        .nic-action-group {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .nic-btn-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
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

        .btn-suspend { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
        .btn-suspend:hover { background: #ffe4e6; color: #be123c; }

        .btn-activate { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
        .btn-activate:hover { background: #dcfce7; color: #15803d; }

        /* PAGINATION */
        .nic-pagination-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-top: none;
          border-radius: 0 0 4px 4px;
        }

        .nic-page-info {
          font-size: 14px;
          color: #475569;
        }

        .nic-page-controls {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .nic-btn-page {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e3a8a;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
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
      `}</style>
    </div>
  );
}
