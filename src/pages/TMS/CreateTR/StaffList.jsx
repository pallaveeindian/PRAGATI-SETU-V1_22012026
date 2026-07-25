// src/pages/TMS/CreateTR/StaffList.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

// ----------------------------------------------------
// Internal StaffRow Component
// ----------------------------------------------------
const StaffRow = React.memo(function StaffRow({ row, isSelected, onToggle }) {
  const handleChange = useCallback(
    (e) => {
      if (typeof onToggle === "function") onToggle(row, e.target.checked);
    },
    [onToggle, row],
  );

  return (
    <tr key={row.id} className={isSelected ? "row-selected" : ""}>
      <td>
        <input type="checkbox" checked={!!isSelected} onChange={handleChange} />
      </td>
      <td>
        <div style={{ fontWeight: 600 }}>{row.full_name || "-"}</div>
        <div style={{ fontSize: 12, color: "#6c757d" }}>{row.employee_id}</div>
      </td>
      <td>
        {row.designation || "-"}
        {row.theme_name ? ` - ${row.theme_name}` : ""}
        <div style={{ fontSize: 11, color: "#6c757d" }}>
          {row.employment_type || ""}
        </div>
      </td>
      <td>{row.social_category || "-"}</td>
      <td>
        {row.district_name || "-"}
        {row.block_name ? ` / ${row.block_name}` : ""}
      </td>
      <td>{row.mobile || "-"}</td>
      <td>{row.gender || "-"}</td>
    </tr>
  );
});

// ----------------------------------------------------
// Main StaffList Component
// ----------------------------------------------------
export default React.memo(function StaffList({
  user,
  selectedIds = new Set(),
  onToggleStaff,
}) {
  const role = getCanonicalRole(user || {});

  // Rule Checks
  const isSmmuLocked = role === "smmu" && Number(user?.id) !== 11452;
  const isDmmuLocked = role === "dmmu";

  // --- Data States ---
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // --- Lookup States ---
  const [themes, setThemes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  // Dynamic Filter Options State
  const [designationOptions, setDesignationOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [socialCatOptions, setSocialCatOptions] = useState([]);

  // --- Filter States ---
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [gender, setGender] = useState("");
  const [socialCategory, setSocialCategory] = useState("");
  const [themeId, setThemeId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");

  // 1. Initial Lookups (Themes & Districts & Filter Options)
  useEffect(() => {
    if (!user?.id) return;

    // Fetch Dynamic Filter Options
    api
      .get("/tms/staff/filter-options/")
      .then((res) => {
        const data = res?.data || {};
        setDesignationOptions(data.designations || []);
        setEmpTypeOptions(data.employment_types || []);
        setSocialCatOptions(data.social_categories || []);
      })
      .catch((err) => console.error("Failed to load filter options", err));

    // Fetch Themes
    TMS_API.trainingThemes.list({ page_size: 100 }).then((res) => {
      const allThemes = res?.data?.results || [];
      if (isSmmuLocked) {
        const myTheme = allThemes.find(
          (t) => Number(t.expert) === Number(user?.id),
        );
        if (myTheme) {
          setThemes([myTheme]);
          setThemeId(String(myTheme.id));
        } else {
          setThemes([]);
        }
      } else {
        setThemes(allThemes);
      }
    });

    // Fetch Districts
    LOOKUP_API.districts.list({ page_size: 100 }).then((res) => {
      setDistricts(res?.data?.results || []);
    });

    // DMMU Auto-Lock District
    if (isDmmuLocked) {
      try {
        const geo = JSON.parse(
          localStorage.getItem("ps_user_geoscope") || "{}",
        );
        const dmmuDistrict =
          geo.district_id || (geo.districts && geo.districts[0]);
        if (dmmuDistrict) {
          setDistrictId(String(dmmuDistrict));
        }
      } catch (e) {
        // ignore
      }
    }
  }, [user?.id, isSmmuLocked, isDmmuLocked]);

  // 2. Fetch Blocks when District Changes
  useEffect(() => {
    if (!districtId) {
      setBlocks([]);
      setBlockId("");
      return;
    }
    LOOKUP_API.FULLblocksByDistrict(districtId, {
      limit: 200,
      page_size: 200,
    }).then((res) => {
      setBlocks(res?.data?.results || res?.data || []);
    });
  }, [districtId]);

  // 3. Fetch Staff Data
  const fetchStaffData = useCallback(async () => {
    setLoading(true);
    try {
      // Send parameters directly to your backend filters
      const params = {
        limit: 5000, // Fetch up to 5000 to paginate locally, matching MasterTrainerList UX
        search: search || undefined,
        designation: designation || undefined,
        employment_type: employmentType || undefined,
        gender: gender || undefined,
        social_category: socialCategory || undefined,
        theme: themeId || undefined,
        district: districtId || undefined,
        block: blockId || undefined,
      };

      const res = await TMS_API.staff.list(params);
      const data = res?.data?.results || res?.data || [];
      setStaffList(data);
      setPage(1); // Reset page on new data
    } catch (err) {
      console.error("Failed to fetch staff list", err);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    designation,
    employmentType,
    gender,
    socialCategory,
    themeId,
    districtId,
    blockId,
  ]);

  // Fetch when filters change
  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  // --- Pagination Logic (Local, just like MasterTrainerList) ---
  const PAGE_SIZE = 10;
  const total = staffList.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const rows = staffList.slice(
    (pageSafe - 1) * PAGE_SIZE,
    pageSafe * PAGE_SIZE,
  );

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="header-row space-between">
        <div>
          <h3>Staff List</h3>
          <p className="muted" style={{ marginTop: 4 }}>
            Select staff members for this training request.
          </p>
        </div>
        <div>
          <button
            className="btn-sm btn-flat"
            onClick={fetchStaffData}
            disabled={loading}
          >
            Refresh List
          </button>
        </div>
      </div>

      {/* --- FILTERS GRID --- */}
      <div
        className="filters-row"
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          paddingBottom: 12,
          borderBottom: "1px solid #eef2f6",
        }}
      >
        {/* Search */}
        <input
          className="input"
          placeholder="Search Name, Mobile, Emp ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220, border: "2px solid #3d6ba6", outline: "none" }}
        />

        {/* Designation */}
        <select
          className="input"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          style={{ outline: "2px solid #3d6ba6" }}
        >
          <option value="">All Designations</option>
          {designationOptions.map((desig, idx) => (
            <option key={idx} value={desig}>
              {desig}
            </option>
          ))}
        </select>

        {/* Employment Type */}
        <select
          className="input"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          style={{ outline: "2px solid #3d6ba6" }}
        >
          <option value="">All Emp. Types</option>
          {empTypeOptions.map((emp, idx) => (
            <option key={idx} value={emp}>
              {emp}
            </option>
          ))}
        </select>

        {/* Gender */}
        <select
          className="input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ outline: "2px solid #3d6ba6" }}
        >
          <option value="">All Genders</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>

        {/* Social Category */}
        <select
          className="input"
          value={socialCategory}
          onChange={(e) => setSocialCategory(e.target.value)}
          style={{ outline: "2px solid #3d6ba6" }}
        >
          <option value="">All Categories</option>
          {socialCatOptions.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Theme (Locked for SMMU unless ID 11452) */}
        <select
          className="input"
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          disabled={isSmmuLocked}
          style={{
            outline: "2px solid #3d6ba6",
            background: isSmmuLocked ? "#e2e8f0" : "#fff",
            cursor: isSmmuLocked ? "not-allowed" : "pointer",
          }}
        >
          <option value="">All Themes</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.theme_name}
            </option>
          ))}
        </select>

        {/* District (Locked for DMMU) */}
        <select
          className="input"
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          disabled={isDmmuLocked}
          style={{
            outline: "2px solid #3d6ba6",
            background: isDmmuLocked ? "#e2e8f0" : "#fff",
            cursor: isDmmuLocked ? "not-allowed" : "pointer",
          }}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name_en}
            </option>
          ))}
        </select>

        {/* Block */}
        <select
          className="input"
          value={blockId}
          onChange={(e) => setBlockId(e.target.value)}
          disabled={!districtId || blocks.length === 0}
          style={{
            outline: "2px solid #3d6ba6",
            background: !districtId || blocks.length === 0 ? "#e2e8f0" : "#fff",
          }}
        >
          <option value="">All Blocks</option>
          {blocks.map((b) => (
            <option key={b.block_id} value={b.block_id}>
              {b.block_name_en}
            </option>
          ))}
        </select>
      </div>

      {/* --- TABLE AREA --- */}
      {loading ? (
        <div className="table-spinner" style={{ padding: "40px 0" }}>
          Loading staff list…
        </div>
      ) : rows.length === 0 ? (
        <p className="muted" style={{ padding: "20px 0" }}>
          No staff members found matching the selected filters.
        </p>
      ) : (
        <>
          <div className="table-wrapper" style={{ marginTop: 12 }}>
            <table className="table table-compact">
              <thead>
                <tr>
                  <th></th>
                  <th>Name & ID</th>
                  <th>Designation</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const id = r.id;
                  const isSel = selectedIds && selectedIds.has(id);
                  return (
                    <StaffRow
                      key={id}
                      row={r}
                      isSelected={!!isSel}
                      onToggle={onToggleStaff}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > PAGE_SIZE && (
            <div className="pagination" style={{ marginTop: 12 }}>
              <button
                className="btn-sm btn-flat"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span>
                Page {pageSafe} of {totalPages}
              </span>
              <button
                className="btn-sm btn-flat"
                disabled={pageSafe >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#6c757d" }}>
              Showing {staffList.length} staff members
            </div>
          </div>
        </>
      )}
    </div>
  );
});
