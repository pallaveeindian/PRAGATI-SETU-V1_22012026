// src/pages/TMS/StaffBatchCreator/StaffSelectionTable.jsx
import React, { useState, useMemo } from "react";

const StaffSelectionTable = ({
  staffPool = [],
  selectedIds = [],
  onSelectionChange,
  maxAllowed = 40,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1. Handle Search Filtering Locally
  const filteredStaff = useMemo(() => {
    if (!searchTerm) return staffPool;
    const lowerSearch = searchTerm.toLowerCase();

    return staffPool.filter((staff) => {
      const nameMatch = (staff.full_name || "")
        .toLowerCase()
        .includes(lowerSearch);
      const empIdMatch = (staff.employee_id || "")
        .toLowerCase()
        .includes(lowerSearch);
      const designationMatch = (staff.designation || "")
        .toLowerCase()
        .includes(lowerSearch);
      return nameMatch || empIdMatch || designationMatch;
    });
  }, [staffPool, searchTerm]);

  // 2. Handle Pagination
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStaff.slice(start, end);
  }, [filteredStaff, currentPage]);

  // 3. Selection Handlers
  const isMaxReached = selectedIds.length >= maxAllowed;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Only select up to the maxAllowed limit
      const currentAvailableSpace = maxAllowed - selectedIds.length;

      if (currentAvailableSpace <= 0) return;

      // Grab IDs from current page that are NOT already selected
      const pageIdsToAdd = paginatedStaff
        .map((s) => s.id)
        .filter((id) => !selectedIds.includes(id));

      // Slice it to not exceed the absolute limit
      const safeIdsToAdd = pageIdsToAdd.slice(0, currentAvailableSpace);

      onSelectionChange([...selectedIds, ...safeIdsToAdd]);
    } else {
      // Uncheck all from CURRENT PAGE
      const pageIds = paginatedStaff.map((s) => s.id);
      const newSelected = selectedIds.filter((id) => !pageIds.includes(id));
      onSelectionChange(newSelected);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      // Remove
      onSelectionChange(selectedIds.filter((rowId) => rowId !== id));
    } else {
      // Add (if space permits)
      if (isMaxReached) {
        alert(
          `You cannot select more than ${maxAllowed} participants per batch.`,
        );
        return;
      }
      onSelectionChange([...selectedIds, id]);
    }
  };

  // Determine if all items on the *current page* are selected
  const isAllOnPageSelected =
    paginatedStaff.length > 0 &&
    paginatedStaff.every((s) => selectedIds.includes(s.id));

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
        }}
      >
        <h4 style={{ margin: 0, color: "#1e293b", fontSize: "15px" }}>
          Staff Participant Pool
        </h4>
        <input
          type="text"
          placeholder="Search Name, Emp ID, Designation..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
          style={{
            padding: "8px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "13px",
            width: "260px",
            outline: "none",
          }}
        />
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
              <th style={{ ...styles.th, width: "40px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllOnPageSelected}
                  disabled={
                    filteredStaff.length === 0 ||
                    (isMaxReached && !isAllOnPageSelected)
                  }
                  style={{ cursor: isMaxReached ? "not-allowed" : "pointer" }}
                />
              </th>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Location (Dist/Block)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#64748b",
                  }}
                >
                  {staffPool.length === 0
                    ? "No unallocated staff available."
                    : "No staff matches your search."}
                </td>
              </tr>
            ) : (
              paginatedStaff.map((staff) => {
                const isSelected = selectedIds.includes(staff.id);
                const isDisabled = isMaxReached && !isSelected;

                return (
                  <tr
                    key={staff.id}
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : "transparent",
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(staff.id)}
                        disabled={isDisabled}
                        style={{
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                      />
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
            Showing {paginatedStaff.length} of {filteredStaff.length} results
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
