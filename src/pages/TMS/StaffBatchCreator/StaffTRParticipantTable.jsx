// src\pages\TMS\StaffBatchCreator\StaffTRParticipantTable.jsx
import React, { useState, useMemo, useEffect } from "react";

export default function StaffTRParticipantTable({
  staffPool = [], // SURGICAL ADDITION: Now fully accepts the globally aggregated pool
  loading = false,
  baseTrId,
  selectedStaffIds = [],
  onStaffSelectionChange,
  maxAllowed = 40,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1. Local Search Filter
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
      const trIdMatch = String(staff.source_tr_id).includes(lowerSearch);

      return nameMatch || empIdMatch || trIdMatch;
    });
  }, [staffPool, searchTerm]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStaff.slice(start, end);
  }, [filteredStaff, currentPage]);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 3. Checkbox Handlers
  const isMaxReached = selectedStaffIds.length >= maxAllowed;
  const isAllOnPageSelected =
    paginatedStaff.length > 0 &&
    paginatedStaff.every((s) => selectedStaffIds.includes(s.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentAvailableSpace = maxAllowed - selectedStaffIds.length;
      if (currentAvailableSpace <= 0) return;

      const pageIdsToAdd = paginatedStaff
        .map((s) => s.id)
        .filter((id) => !selectedStaffIds.includes(id));

      const safeIdsToAdd = pageIdsToAdd.slice(0, currentAvailableSpace);
      onStaffSelectionChange([...selectedStaffIds, ...safeIdsToAdd]);
    } else {
      const pageIds = paginatedStaff.map((s) => s.id);
      const newSelected = selectedStaffIds.filter(
        (id) => !pageIds.includes(id),
      );
      onStaffSelectionChange(newSelected);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedStaffIds.includes(id)) {
      onStaffSelectionChange(selectedStaffIds.filter((rowId) => rowId !== id));
    } else {
      if (isMaxReached) {
        alert(
          `You cannot select more than ${maxAllowed} participants per batch.`,
        );
        return;
      }
      onStaffSelectionChange([...selectedStaffIds, id]);
    }
  };

  return (
    <div className="p-table-wrapper">
      <div className="p-table-header">
        <div>
          <h4 style={{ margin: 0, color: "#1e293b", fontSize: "15px" }}>
            Aggregated Staff Participants
          </h4>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing unallocated staff from all selected Training Requests
          </span>
        </div>
        <input
          type="text"
          placeholder="Search Name, Emp ID, or TR ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-search-input"
        />
      </div>

      <div style={{ overflowX: "auto", position: "relative" }}>
        {loading && (
          <div className="loading-overlay">
            <div className="spinner-large"></div>
            <p>Aggregating participants...</p>
          </div>
        )}
        <table className="p-table">
          <thead>
            <tr>
              <th style={{ width: "40px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllOnPageSelected}
                  disabled={
                    filteredStaff.length === 0 ||
                    (isMaxReached && !isAllOnPageSelected)
                  }
                  style={{
                    cursor:
                      isMaxReached && !isAllOnPageSelected
                        ? "not-allowed"
                        : "pointer",
                    transform: "scale(1.1)",
                  }}
                />
              </th>
              <th>Source TR ID</th>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Designation</th>
              <th>District</th>
            </tr>
          </thead>
          <tbody>
            {!loading && paginatedStaff.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  {staffPool.length === 0
                    ? "No unallocated staff available in selected requests."
                    : "No staff matches your search."}
                </td>
              </tr>
            ) : (
              paginatedStaff.map((staff) => {
                const isSelected = selectedStaffIds.includes(staff.id);
                const isDisabled = isMaxReached && !isSelected;
                const isFromBaseTr = staff.source_tr_id === baseTrId;

                return (
                  <tr
                    key={staff.id}
                    className={isSelected ? "selected-row" : ""}
                    onClick={() => !isDisabled && handleSelectRow(staff.id)}
                    style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(staff.id)}
                        disabled={isDisabled}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          transform: "scale(1.1)",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        fontWeight: "700",
                        color: isFromBaseTr ? "#10b981" : "#3b82f6",
                      }}
                    >
                      #{staff.source_tr_id}
                      {isFromBaseTr && (
                        <span
                          style={{
                            fontSize: "10px",
                            marginLeft: "6px",
                            color: "#64748b",
                          }}
                        >
                          (Base)
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: "600", color: "#0f172a" }}>
                      {staff.employee_id || "-"}
                    </td>
                    <td>{staff.full_name || "-"}</td>
                    <td>{staff.designation || "-"}</td>
                    <td>
                      {staff.district_name_en || staff.district_id || "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-table-footer">
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            Showing {paginatedStaff.length} of {filteredStaff.length} results
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-indicator">
              {currentPage} / {totalPages}
            </span>
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <style>{`
        .p-table-wrapper { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; }
        .p-table-header { padding: 16px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .p-search-input { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; width: 260px; outline: none; transition: border-color 0.2s; }
        .p-search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
        .p-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .p-table thead th { background: #f1f5f9; color: #475569; padding: 12px 16px; text-align: left; font-weight: 600; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 10; }
        .p-table tbody td { padding: 12px 16px; color: #334155; border-bottom: 1px solid #f1f5f9; }
        .p-table tbody tr:hover:not(.selected-row) { background: #f8fafc; }
        .selected-row { background: #eff6ff !important; }
        .empty-state { text-align: center; padding: 40px; color: #64748b; font-style: italic; }
        .p-table-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
        .page-btn { padding: 6px 12px; font-size: 13px; font-weight: 600; color: #3b82f6; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; }
        .page-btn:disabled { color: #94a3b8; cursor: not-allowed; background: #f8fafc; }
        .page-indicator { font-size: 13px; font-weight: 600; padding: 4px 8px; color: #334155; }
        .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20; color: #3b82f6; font-weight: 600; }
        .spinner-large { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 12px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
