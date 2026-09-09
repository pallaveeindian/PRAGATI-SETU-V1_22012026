// src\pages\PlanningDeptUpdate\Pages\PushHistory\PushListFilter.jsx
import React, { useMemo } from "react";
import PDUButton from "../../components/PDUButton";
import { usePDUContext } from "../../context/PDUContext";

export default function PushListFilter({
  filters,
  setFilters,
  onApply,
  onReset,
  loading,
}) {
  const { aspirationalBlocks } = usePDUContext();

  // ==========================================
  // DYNAMIC DROPDOWN MAPPING LOGIC
  // ==========================================

  // 1. Extract Unique Districts from the loaded 108 blocks
  const uniqueDistricts = useMemo(() => {
    if (!aspirationalBlocks || aspirationalBlocks.length === 0) return [];

    const distMap = new Map();
    aspirationalBlocks.forEach((block) => {
      if (
        block.api_district_code &&
        block.districtName &&
        block.districtName !== "Unknown"
      ) {
        distMap.set(String(block.api_district_code), block.districtName);
      }
    });

    // Convert to array and sort alphabetically
    return Array.from(distMap.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [aspirationalBlocks]);

  // 2. Extract Blocks dependent on the selected District
  const availableBlocks = useMemo(() => {
    if (!filters.dist_code || !aspirationalBlocks) return [];

    const blockMap = new Map();
    aspirationalBlocks.forEach((block) => {
      if (String(block.api_district_code) === String(filters.dist_code)) {
        if (block.api_block_code && (block.block_name || block.blockNameEn)) {
          blockMap.set(
            String(block.api_block_code),
            block.block_name || block.blockNameEn,
          );
        }
      }
    });

    // Convert to array and sort alphabetically
    return Array.from(blockMap.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [aspirationalBlocks, filters.dist_code]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If District changes, automatically clear the selected Block
    if (name === "dist_code") {
      setFilters((prev) => ({ ...prev, dist_code: value, block_code: "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="pdu-filter-card">
      <div className="pdu-filter-card-header">
        <div className="pdu-filter-title-wrapper">
          <div className="pdu-filter-icon-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </div>
          <div>
            <h2 className="pdu-filter-title">Advanced Ledger Filters</h2>
            <p className="pdu-filter-subtitle">
              Isolate synchronized API payloads by timeline, exact geographical
              location, and programmatic indicator.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onApply();
        }}
        className="pdu-filter-form"
      >
        <div className="pdu-filter-grid">
          {/* FINANCIAL YEAR */}
          <div className="pdu-filter-field anim-delay-1">
            <label>Financial Year</label>
            <div className="pdu-select-wrapper">
              <select name="year" value={filters.year} onChange={handleChange}>
                <option value="">All Years</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
              </select>
            </div>
          </div>

          {/* MONTH */}
          <div className="pdu-filter-field anim-delay-2">
            <label>Month</label>
            <div className="pdu-select-wrapper">
              <select
                name="month"
                value={filters.month}
                onChange={handleChange}
              >
                <option value="">All Months</option>
                <option value="4">April (4)</option>
                <option value="5">May (5)</option>
                <option value="6">June (6)</option>
                <option value="7">July (7)</option>
                <option value="8">August (8)</option>
                <option value="9">September (9)</option>
                <option value="10">October (10)</option>
                <option value="11">November (11)</option>
                <option value="12">December (12)</option>
                <option value="1">January (1)</option>
                <option value="2">February (2)</option>
                <option value="3">March (3)</option>
              </select>
            </div>
          </div>

          {/* INDICATOR */}
          <div className="pdu-filter-field anim-delay-3">
            <label>Indicator / Pointer</label>
            <div className="pdu-select-wrapper">
              <select
                name="prog_code"
                value={filters.prog_code}
                onChange={handleChange}
              >
                <option value="">All Pointers</option>
                <option value="0511">0511 - SHG Households</option>
                <option value="0512">0512 - RF Received</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC DISTRICT SELECTOR */}
          <div className="pdu-filter-field anim-delay-4">
            <label>Aspirational District</label>
            <div className="pdu-select-wrapper">
              <select
                name="dist_code"
                value={filters.dist_code}
                onChange={handleChange}
              >
                <option value="">All Districts</option>
                {uniqueDistricts.map((dist) => (
                  <option key={dist.code} value={dist.code}>
                    {dist.name} (Code: {dist.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DYNAMIC BLOCK SELECTOR */}
          <div className="pdu-filter-field anim-delay-5">
            <label>Aspirational Block</label>
            <div className="pdu-select-wrapper">
              <select
                name="block_code"
                value={filters.block_code}
                onChange={handleChange}
                disabled={!filters.dist_code}
                className={!filters.dist_code ? "disabled-select" : ""}
              >
                <option value="">
                  {!filters.dist_code
                    ? "Select a District First"
                    : "All Blocks"}
                </option>
                {availableBlocks.map((block) => (
                  <option key={block.code} value={block.code}>
                    {block.name} (Code: {block.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pdu-filter-actions anim-delay-6">
          <PDUButton
            type="submit"
            variant="action"
            disabled={loading}
            style={{ padding: "10px 28px", fontSize: "0.95rem" }}
          >
            {loading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className="pdu-btn-spinner" /> Searching...
              </span>
            ) : (
              "Apply Filters"
            )}
          </PDUButton>
          <PDUButton
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={loading}
            style={{ marginLeft: "12px", padding: "10px 24px" }}
          >
            ↻ Reset Grid
          </PDUButton>
        </div>
      </form>

      {/* STYLES */}
      <style>{`
        .pdu-filter-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 8px -2px rgba(15, 23, 42, 0.02);
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .pdu-filter-card-header {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px dashed #e2e8f0;
        }

        .pdu-filter-title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pdu-filter-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #2563eb;
        }

        .pdu-filter-icon-box svg {
          width: 24px;
          height: 24px;
        }

        .pdu-filter-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .pdu-filter-subtitle {
          margin: 4px 0 0 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .pdu-filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .pdu-filter-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pdu-filter-field label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pdu-select-wrapper {
          position: relative;
        }

        .pdu-select-wrapper select {
          width: 100%;
          appearance: none;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 12px 36px 12px 14px;
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }

        .pdu-select-wrapper select:hover:not(:disabled) {
          border-color: #94a3b8;
          background-color: #ffffff;
        }

        .pdu-select-wrapper select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background-color: #ffffff;
        }

        .pdu-select-wrapper select.disabled-select {
          background-color: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
          border-color: #e2e8f0;
        }

        .pdu-filter-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px dashed #e2e8f0;
        }

        .pdu-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: btnSpin 0.8s linear infinite;
        }

        /* Animations */
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes btnSpin {
          to { transform: rotate(360deg); }
        }

        .anim-delay-1 { animation: slideUpFade 0.4s ease backwards 0.05s; }
        .anim-delay-2 { animation: slideUpFade 0.4s ease backwards 0.10s; }
        .anim-delay-3 { animation: slideUpFade 0.4s ease backwards 0.15s; }
        .anim-delay-4 { animation: slideUpFade 0.4s ease backwards 0.20s; }
        .anim-delay-5 { animation: slideUpFade 0.4s ease backwards 0.25s; }
        .anim-delay-6 { animation: slideUpFade 0.4s ease backwards 0.30s; }
      `}</style>
    </div>
  );
}
