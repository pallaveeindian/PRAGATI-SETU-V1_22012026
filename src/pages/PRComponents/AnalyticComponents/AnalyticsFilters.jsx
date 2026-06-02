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
  passwd_status,
  onFilterChange,
  onApply,
}) {
  // Helper booleans for routing filters
  const isMouAnalytics =
    activeTab === "mou_analytics" || activeSubTab === "mou_analytics";
  const isTmsTraining = activeTab === "tms" && activeSubTab === "tms_training";
  const showViewMode = isTmsTraining || isMouAnalytics; // Both APIs support district_wise_summary

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

      {/* --- VIEW MODE (Shared by TMS Login & MOU Analytics) --- */}
      {showViewMode && (
        <div className="filter-group">
          <label>View Mode</label>
          <select
            value={filters.district_wise_summary || "0"}
            onChange={(e) =>
              onFilterChange("district_wise_summary", e.target.value)
            }
          >
            <option value="0">Detailed Records</option>
            <option value="1">District Wise Block Count</option>
          </select>
        </div>
      )}

      {/* --- EXTRA FILTERS ONLY FOR TMS LOGIN STATUS --- */}
      {isTmsTraining && (
        <>
          {/* Login Status Filter */}
          <div className="filter-group">
            <label>Login Status</label>
            <select
              value={filters.not_logged_in || "0"}
              onChange={(e) => {
                onFilterChange("not_logged_in", e.target.value);
                // Reset password status if switching to Not Logged In
                if (e.target.value === "1") {
                  onFilterChange("passwd_status", "");
                }
              }}
            >
              <option value="0">Logged In Users</option>
              <option value="1">Not Logged In Users</option>
            </select>
          </div>

          {/* Password Status (Only show if looking at Logged In Users) */}
          {filters.not_logged_in !== "1" && (
            <div className="filter-group">
              <label>Password Status</label>
              <select
                value={filters.passwd_status || ""}
                onChange={(e) =>
                  onFilterChange("passwd_status", e.target.value)
                }
              >
                <option value="">-- All --</option>
                <option value="Pending Change">Pending Change</option>
                <option value="Changed">Changed</option>
              </select>
            </div>
          )}

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

      {/* --- EXTRA FILTERS ONLY FOR TMS CADRE SELECTION (SOFTWARE) --- */}
      {activeSubTab === "tms_software" && (
        <div
          className="filter-group checkbox-group"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <input
            type="checkbox"
            id="district_wise_cadre_summary"
            checked={filters.district_wise_cadre_summary === "1"}
            onChange={(e) =>
              onFilterChange(
                "district_wise_cadre_summary",
                e.target.checked ? "1" : "0",
              )
            }
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <label
            htmlFor="district_wise_cadre_summary"
            style={{ margin: 0, cursor: "pointer" }}
          >
            View District-Wise Summary
          </label>
        </div>
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
