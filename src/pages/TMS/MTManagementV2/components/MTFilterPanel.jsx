// src/pages/TMS/MTManagementV2/components/MTFilterPanel.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaLock } from "react-icons/fa";
import { LOOKUP_API, TMS_API } from "../../../../api/axios";

export default function MTFilterPanel({
  filters,
  setFilters,
  targetRole, // Expected "dmmu" or "smmu"
  lockedDistrict, // Passed down from useMTList if DMMU
  lockedBlock,
  lockedTheme, // Passed down from useMTList if SMMU
}) {
  const isDMMU = targetRole === "dmmu";
  const isSMMU = targetRole === "smmu";

  // Data States
  const [mandals, setMandals] = useState([]);
  const [districtCategories, setDistrictCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [themes, setThemes] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const isBMMU = targetRole === "bmmu";

  useEffect(() => {
    if (!filters.district) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocksByDistrict(filters.district, {
      params: { page_size: 5000 },
    })
      .then((res) => setBlocks(res?.data?.results || res?.data || []))
      .catch(console.error);
  }, [filters.district]);

  // Load Filter Options
  useEffect(() => {
    async function fetchLookupData() {
      // SMMU gets the global geographic filters
      if (isSMMU) {
        try {
          const [mandalRes, categoryRes, districtRes] = await Promise.all([
            LOOKUP_API.mandals.list({ page_size: 200 }),
            LOOKUP_API.district_categories.list(),
            LOOKUP_API.districts.list({ page_size: 100 }),
          ]);
          setMandals(mandalRes.data?.results || []);
          setDistrictCategories(categoryRes.data?.results || []);
          setDistricts(districtRes.data?.results || []);
        } catch (e) {
          console.error("Failed to load geographic filters:", e);
        }
      }

      // Both roles need Themes
      try {
        const themeRes = await TMS_API.trainingThemes.list();
        setThemes(themeRes.data?.results || themeRes.data || []);
      } catch (e) {
        console.error("Failed to load themes:", e);
      }
    }

    fetchLookupData();
  }, [isSMMU]);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    // Preserve the locked district for DMMU
    setFilters({
      mandal: "",
      district_category: "",
      district: isDMMU || isBMMU ? lockedDistrict || "" : "", // <-- SURGICAL REPLACEMENT
      block: isBMMU ? lockedBlock || "" : "", // <-- SURGICAL ADDITION
      theme: isSMMU ? lockedTheme || "" : "",
      designation: "",
      gender: "",
      smmu_recommended: "",
      search: "",
    });
  };

  // Determine if clear button should show
  const hasActiveFilters = Boolean(
    filters.mandal ||
    filters.district_category ||
    (isSMMU && filters.district) || // DMMU district isn't counted as an active "clearable" filter
    filters.theme ||
    filters.designation ||
    filters.gender ||
    filters.smmu_recommended ||
    filters.search,
  );

  return (
    <div className="nic-filter-panel">
      <div className="nic-filter-header">
        <h4 className="nic-filter-title">
          <FaSearch style={{ marginRight: "8px", color: "#1e3a8a" }} />
          Search & Filter Master Trainers
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
        {/* ROW 1: Geographic Filters (SMMU sees all, DMMU sees locked District only) */}
        {isSMMU && (
          <>
            <div className="nic-form-group">
              <label className="nic-label" htmlFor="mandal">
                Mandal
              </label>
              <select
                id="mandal"
                name="mandal"
                className="nic-select"
                value={filters.mandal}
                onChange={handleFilterChange}
                disabled={Boolean(filters.district)} // Disable if district selected
              >
                <option value="">All Mandals</option>
                {mandals.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="nic-form-group">
              <label className="nic-label" htmlFor="district_category">
                District Category
              </label>
              <select
                id="district_category"
                name="district_category"
                className="nic-select"
                value={filters.district_category}
                onChange={handleFilterChange}
                disabled={Boolean(filters.district)}
              >
                <option value="">All Categories</option>
                {districtCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="nic-form-group">
          <label className="nic-label" htmlFor="district">
            District
            {isDMMU && lockedDistrict && (
              <FaLock
                style={{
                  marginLeft: "6px",
                  color: "#ef4444",
                  fontSize: "11px",
                }}
                title="Locked to your assigned district"
              />
            )}
          </label>
          {isDMMU ? (
            <div
              className="nic-input"
              style={{ background: "#f1f5f9", cursor: "not-allowed" }}
            >
              {lockedDistrict
                ? `District Code: ${lockedDistrict}`
                : "Resolging Geoscope..."}
            </div>
          ) : (
            <select
              id="district"
              name="district"
              className="nic-select"
              value={filters.district}
              onChange={handleFilterChange}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.district_name_en}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ROW 1.5: Block Filter (SURGICAL ADDITION) */}
        <div className="nic-form-group">
          <label className="nic-label" htmlFor="block">
            Block
            {isBMMU && (
              <FaLock
                style={{
                  marginLeft: "6px",
                  color: "#ef4444",
                  fontSize: "11px",
                }}
                title="Locked to your assigned block"
              />
            )}
          </label>
          {isBMMU ? (
            <div
              className="nic-input"
              style={{ background: "#f1f5f9", cursor: "not-allowed" }}
            >
              {lockedBlock
                ? `Block Code: ${lockedBlock}`
                : "Resolving Geoscope..."}
            </div>
          ) : (
            <select
              id="block"
              name="block"
              className="nic-select"
              value={filters.block || ""}
              onChange={handleFilterChange}
              disabled={!filters.district}
            >
              <option value="">All Blocks</option>
              {blocks.map((b) => (
                <option key={b.block_id} value={b.block_id}>
                  {b.block_name_en}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ROW 2: Trainer Demographics & Attributes */}
        <div className="nic-form-group">
          <label className="nic-label" htmlFor="theme">
            Theme
            {/* SURGICAL ADDITION: Show lock icon if SMMU is restricted to a specific theme */}
            {isSMMU && lockedTheme && (
              <FaLock
                style={{
                  marginLeft: "6px",
                  color: "#ef4444",
                  fontSize: "11px",
                }}
                title="Locked to your assigned thematic expertise"
              />
            )}
          </label>
          <select
            id="theme"
            name="theme"
            className="nic-select"
            value={filters.theme}
            onChange={handleFilterChange}
            disabled={isSMMU && Boolean(lockedTheme)} // SURGICAL ADDITION: Disable the dropdown
          >
            <option value="">
              {isSMMU && lockedTheme ? "Resolving Theme..." : "All Themes"}
            </option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.theme_name}
              </option>
            ))}
          </select>
        </div>

        <div className="nic-form-group">
          <label className="nic-label" htmlFor="designation">
            Designation
          </label>
          <select
            id="designation"
            name="designation"
            className="nic-select"
            value={filters.designation}
            onChange={handleFilterChange}
          >
            <option value="">All Designations</option>
            <option value="BRP">BRP</option>
            <option value="DRP">DRP</option>
            <option value="SRP">SRP</option>
          </select>
        </div>

        <div className="nic-form-group">
          <label className="nic-label" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="nic-select"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="nic-form-group">
          <label className="nic-label" htmlFor="smmu_recommended">
            SMMU Recommendation
          </label>
          <select
            id="smmu_recommended"
            name="smmu_recommended"
            className="nic-select"
            value={filters.smmu_recommended}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="Yes">Recommended</option>
          </select>
        </div>

        {/* ROW 3: Text Search */}
        <div className="nic-form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="nic-label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            className="nic-input"
            placeholder="Search by Name, Mobile No, or Aadhaar No..."
            value={filters.search}
            onChange={handleFilterChange}
            autoComplete="off"
          />
        </div>
      </div>

      <style>{`
        .nic-filter-panel {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-top: 4px solid #1e3a8a;
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
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          align-items: flex-end;
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
          display: flex;
          align-items: center;
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
          min-height: 40px;
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
