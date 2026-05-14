import React from "react";

// Filtered Role Mapping (Strictly as requested)
const ALLOWED_ROLES = [
  { value: "bmmu", label: "BMMU" },
  { value: "dmmu", label: "DMMU" },
  { value: "smmu", label: "SMMU" },
  { value: "training_partner", label: "TRAINING PARTNER" },
  { value: "master_trainer", label: "MASTER TRAINER" },
  { value: "tp_contact_person", label: "TRAINING CENTRE" },
];

export default function AnalyticsFilters({
  activeTab,
  activeSubTab,
  filters,
  districts,
  blocks,
  onFilterChange,
  onApply,
}) {
  // ==========================================
  // HIDE FILTERS COMPLETELY FOR THESE VIEWS
  // ==========================================
  if (
    activeTab === "overview" ||
    (activeTab === "tms" && activeSubTab === "tms_users")
  ) {
    return null;
  }

  // ==========================================
  // 1. HIDE FILTERS COMPLETELY FOR DEMOGRAPHICS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_users") {
    return null;
  }

  // ==========================================
  // 2. SHOW INFO BAR FOR GLOBAL OVERVIEW
  // ==========================================
  if (activeTab === "overview") {
    return (
      <div
        className="analytics-module filters-module overview-info-bar"
        style={{ background: "transparent", padding: 0, boxShadow: "none" }}
      >
        <div
          style={{
            background: "#eff6ff",
            color: "#1e3a8a",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Data Context:</strong> Live Global Platform Snapshot
        </div>
        <div
          style={{
            background: "#ffffff",
            color: "#334155",
            border: "1px solid #cbd5e1",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Scope:</strong> State of Uttar Pradesh
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. SHOW DROPDOWNS FOR EVERYTHING ELSE
  // ==========================================
  return (
    <div className="analytics-module filters-module">
      {/* --- STANDARD GEOGRAPHY FILTERS --- */}
      <div className="filter-group">
        <label>District</label>
        <select
          value={filters.district_id || ""}
          onChange={(e) => onFilterChange("district_id", e.target.value)}
        >
          <option value="">-- All Districts --</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name_en}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Block</label>
        <select
          value={filters.block_id || ""}
          onChange={(e) => onFilterChange("block_id", e.target.value)}
          disabled={!filters.district_id}
        >
          <option value="">-- All Blocks --</option>
          {blocks.map((b) => (
            <option key={b.block_id} value={b.block_id}>
              {b.block_name_en}
            </option>
          ))}
        </select>
      </div>

      {/* --- EXTRA FILTERS ONLY FOR LOGIN STATUS --- */}
      {activeTab === "tms" && activeSubTab === "tms_training" && (
        <>
          {/* Role Dropdown */}
          <div className="filter-group">
            <label>Role / Cadre</label>
            <select
              value={filters.role_name || ""}
              onChange={(e) => onFilterChange("role_name", e.target.value)}
            >
              <option value="">-- All Roles --</option>
              {ALLOWED_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exact Date */}
          <div className="filter-group">
            <label>Exact Date</label>
            <input
              type="date"
              className="date-input"
              value={filters.date || ""}
              onChange={(e) => {
                onFilterChange("date", e.target.value);
                // UX logic: Clear range if user selects exact date
                if (e.target.value) {
                  onFilterChange("start_date", "");
                  onFilterChange("end_date", "");
                }
              }}
            />
          </div>

          {/* Date Range: Start */}
          <div className="filter-group">
            <label>From Date</label>
            <input
              type="date"
              className="date-input"
              value={filters.start_date || ""}
              onChange={(e) => {
                onFilterChange("start_date", e.target.value);
                if (e.target.value) onFilterChange("date", ""); // Clear exact date
              }}
            />
          </div>

          {/* Date Range: End */}
          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              className="date-input"
              value={filters.end_date || ""}
              onChange={(e) => {
                onFilterChange("end_date", e.target.value);
                if (e.target.value) onFilterChange("date", ""); // Clear exact date
              }}
            />
          </div>
        </>
      )}

      <button className="btn-apply-filters" onClick={onApply}>
        Apply Filters
      </button>

      {/* Inline styles for the native HTML date inputs to match your theme */}
      <style>{`
        .date-input {
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          font-family: inherit;
        }
        .date-input:focus {
          border-color: #ff7a00;
          box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
