// src/pages/TMS/StaffBatchCreator/StaffSelectionTable.jsx
import React, { useState, useMemo, useEffect } from "react";

const StaffSelectionTable = ({
  staffPool = [],
  selectedIds = [],
  onSelectionChange,
  maxAllowed = 40,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1. Isolate ONLY the selected staff members
  const selectedStaffObjects = useMemo(() => {
    return staffPool.filter((staff) => selectedIds.includes(staff.id));
  }, [staffPool, selectedIds]);

  // 2. Handle Search Filtering Locally (Now includes Source TR ID)
  const filteredStaff = useMemo(() => {
    if (!searchTerm) return selectedStaffObjects;
    const lowerSearch = searchTerm.toLowerCase();

    return selectedStaffObjects.filter((staff) => {
      const nameMatch = (staff.full_name || "")
        .toLowerCase()
        .includes(lowerSearch);
      const empIdMatch = (staff.employee_id || "")
        .toLowerCase()
        .includes(lowerSearch);
      const designationMatch = (staff.designation || "")
        .toLowerCase()
        .includes(lowerSearch);
      const trIdMatch = String(staff.source_tr_id || "").includes(lowerSearch);

      return nameMatch || empIdMatch || designationMatch || trIdMatch;
    });
  }, [selectedStaffObjects, searchTerm]);

  // 3. Handle Pagination
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStaff.slice(start, end);
  }, [filteredStaff, currentPage]);

  // Reset pagination if search changes or if last item on page is removed
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 4. Removal Handler
  const handleRemoveRow = (id) => {
    onSelectionChange(selectedIds.filter((rowId) => rowId !== id));
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all selected participants?",
      )
    ) {
      onSelectionChange([]);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Search Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h4 style={{ margin: 0, color: "#1e293b", fontSize: "15px" }}>
            Final Selected Batch Pool
          </h4>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Review and manage the participants assigned to this batch.
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {selectedIds.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: "transparent",
                color: "#ef4444",
                border: "1px solid #fca5a5",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#fef2f2")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Clear All
            </button>
          )}
          <input
            type="text"
            placeholder="Search TR ID, Name, Emp ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontSize: "13px",
              width: "240px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Table Area */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
            <tr>
              <th style={{ ...styles.th, width: "60px", textAlign: "center" }}>
                Action
              </th>
              <th style={styles.th}>Source TR ID</th>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Location (Dist/Block)</th>
            </tr>
          </thead>
          <tbody>
            {selectedIds.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                    fontStyle: "italic",
                  }}
                >
                  No staff members selected yet. Please select participants from
                  the pool above.
                </td>
              </tr>
            ) : paginatedStaff.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                  }}
                >
                  No selected staff matches your search.
                </td>
              </tr>
            ) : (
              paginatedStaff.map((staff, index) => {
                return (
                  <tr
                    key={staff.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        onClick={() => handleRemoveRow(staff.id)}
                        title="Remove from batch"
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          borderRadius: "4px",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontWeight: "bold",
                          margin: "0 auto",
                        }}
                      >
                        &times;
                      </button>
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        color: "#3b82f6",
                      }}
                    >
                      #{staff.source_tr_id || "-"}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "600",
                        color: "#0f172a",
                      }}
                    >
                      {staff.employee_id || "-"}
                    </td>
                    <td style={styles.td}>{staff.full_name || "-"}</td>
                    <td style={styles.td}>{staff.designation || "-"}</td>
                    <td style={styles.td}>
                      {staff.district_name_en || staff.district_id || "-"} /{" "}
                      {staff.block_name_en || staff.block_id || "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            Showing {paginatedStaff.length} of {filteredStaff.length} selected
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={styles.pageBtn(currentPage === 1)}
            >
              Previous
            </button>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                padding: "4px 8px",
              }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={styles.pageBtn(currentPage === totalPages)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "12px 16px",
    color: "#334155",
  },
  pageBtn: (disabled) => ({
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: "600",
    color: disabled ? "#94a3b8" : "#3b82f6",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
  }),
};

export default StaffSelectionTable;
