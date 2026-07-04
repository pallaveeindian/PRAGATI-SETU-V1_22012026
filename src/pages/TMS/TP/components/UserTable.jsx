// src/pages/TMS/TP/components/UserTable.jsx

import React from "react";
import { FaEye, FaEdit } from "react-icons/fa";

export default function UserTable({
  users,
  loading,
  currentPage,
  rowsPerPage,
  totalPages,
  onPageChange,
  onViewClick,
  onEditClick,
  filters,
}) {
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#64748b",
          fontWeight: "600",
        }}
      >
        Loading directory data...
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#64748b",
          fontWeight: "600",
        }}
      >
        No users found matching your criteria.
      </div>
    );
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + rowsPerPage);
  const isDTP = filters.type === "dtp";

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr
            style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}
          >
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>

            {/* Conditional Columns based on view type */}
            {isDTP ? (
              <>
                <th style={styles.th}>District</th>
                <th style={styles.th}>Centres Count</th>
              </>
            ) : (
              <>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Assigned Centres</th>
              </>
            )}
            <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={styles.td}>#{user.id}</td>
              <td style={styles.td}>
                <span
                  style={{
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  {user.username || "—"}
                </span>
              </td>

              {/* Conditional Row Data */}
              {isDTP ? (
                <>
                  <td style={styles.td}>{user.district_name_en || "—"}</td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: "600", color: "#475569" }}>
                      {user.centre_count ?? 0}
                    </span>
                  </td>
                </>
              ) : (
                <>
                  <td style={styles.td}>{user.name || "—"}</td>
                  <td style={styles.td}>
                    {user.assigned_centres &&
                    user.assigned_centres.length > 0 ? (
                      user.assigned_centres.map((c) => c.venue_name).join(", ")
                    ) : (
                      <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                        No Centres Assigned
                      </span>
                    )}
                  </td>
                </>
              )}

              <td style={{ ...styles.td, textAlign: "center" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onViewClick(user);
                  }}
                  style={styles.actionBtn}
                >
                  <FaEye /> View
                </a>
              </td>
              <td style={{ ...styles.td, textAlign: "center" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditClick(user);
                  }}
                  style={styles.actionBtn}
                >
                  <FaEdit /> Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={styles.paginationContainer}>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + rowsPerPage, users.length)} of {users.length}{" "}
            entries
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              style={styles.pageBtn(currentPage === 1)}
            >
              Prev
            </button>
            <span
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              style={styles.pageBtn(currentPage === totalPages)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  th: {
    padding: "14px 16px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "14px 16px",
    color: "#1e293b",
    fontSize: "14px",
    verticalAlign: "middle",
  },
  actionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "#f1f5f9",
    color: "#1e3a8a",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
    transition: "background 0.2s",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #e2e8f0",
  },
  pageBtn: (disabled) => ({
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: disabled ? "#f8fafc" : "#ffffff",
    color: disabled ? "#94a3b8" : "#1e3a8a",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s",
  }),
};
