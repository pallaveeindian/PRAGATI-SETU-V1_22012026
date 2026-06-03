// UserMgmnt/components/UserFilterPanel.jsx
import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function UserFilterPanel({ filters, setFilters, targetRole }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", lock_status: "" });
  };

  const hasActiveFilters =
    filters.search || filters.status || filters.lock_status;

  return (
    <div className="nic-filter-panel">
      <div className="nic-filter-header">
        <h4 className="nic-filter-title">
          <FaSearch style={{ marginRight: "8px", color: "#1e3a8a" }} />
          Search & Filter Directory
        </h4>
        {hasActiveFilters && (
          <button
            className="nic-btn-clear"
            onClick={clearFilters}
            type="button"
          >
            <FaTimes style={{ marginRight: "4px" }} /> Clear Filters
          </button>
        )}
      </div>

      <div className="nic-filter-grid">
        {/* Search Input */}
        <div className="nic-form-group">
          <label className="nic-label" htmlFor="search">
            Search Users
          </label>
          <input
            id="search"
            name="search"
            type="text"
            className="nic-input"
            placeholder={`Search ${targetRole ? targetRole.toUpperCase() : ""} by Username, Email, or Mobile...`}
            value={filters.search || ""}
            onChange={handleFilterChange}
            autoComplete="off"
          />
        </div>

        {/* Status Dropdown */}
        <div className="nic-form-group">
          <label className="nic-label" htmlFor="status">
            Account Status
          </label>
          <select
            id="status"
            name="status"
            className="nic-select"
            value={filters.status || ""}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Lock Status Dropdown */}
        <div className="nic-form-group">
          <label className="nic-label" htmlFor="lock_status">
            Lock State
          </label>
          <select
            id="lock_status"
            name="lock_status"
            className="nic-select"
            value={filters.lock_status || ""}
            onChange={handleFilterChange}
          >
            <option value="">All Accounts</option>
            <option value="locked">Locked Only</option>
            <option value="unlocked">Unlocked Only</option>
          </select>
        </div>
      </div>

      {/* STYLES: NIC GOV STANDARD */}
      <style>{`
        .nic-filter-panel {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-top: 4px solid #1e3a8a; /* Gov Blue Accent */
          border-radius: 6px;
          padding: 16px 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .nic-filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .nic-filter-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nic-filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
          align-items: flex-end;
        }

        @media (max-width: 768px) {
          .nic-filter-grid {
            grid-template-columns: 1fr;
          }
        }

        .nic-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nic-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          letter-spacing: 0.2px;
        }

        .nic-input,
        .nic-select {
          padding: 9px 12px;
          font-size: 14px;
          color: #1e293b;
          border: 1px solid #94a3b8;
          border-radius: 4px;
          background-color: #f8fafc;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .nic-input:focus,
        .nic-select:focus {
          outline: none;
          border-color: #1e3a8a;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
        }

        .nic-input::placeholder {
          color: #94a3b8;
        }

        .nic-btn-clear {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .nic-btn-clear:hover {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #b91c1c;
        }
      `}</style>
    </div>
  );
}
