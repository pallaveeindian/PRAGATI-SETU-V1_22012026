import React, { useEffect, useState, useCallback } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import LeftNav from "../../layout/tms_LeftNav";
import api, { TMS_API } from "../../../../api/axios";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  FaIdCard,
  FaPhoneAlt,
  FaSearch,
  FaTimesCircle,
  FaUserTie,
  FaUsers,
  FaSyncAlt,
  FaFilter,
  FaLock
} from "react-icons/fa";

// Table Row Component for Staff
const StaffRow = React.memo(function StaffRow({ row, srNo }) {
  const designation = row.designation || "";
  const themeName = row.theme_name || row.theme?.theme_name || "";

  return (
    <tr>
      <td style={{ color: "#64748b", fontWeight: "600", textAlign: "center" }}>{srNo}</td>
      <td><strong>{ row.employee_id || row.id || "-"}</strong></td>
      <td><strong>{row.full_name || row.name || "-"}</strong></td>
      <td>{[designation, themeName].filter(Boolean).join(" / ") || "-"}</td>
      
      <td>{row.district_name ||  "-"}</td>
      
      <td>{row.block_name || "-"}</td>
      <td>{row.employment_type || "-"}</td>
      <td>{row.mobile_no || row.mobile || "-"}</td>
      <td>
        <span className={`status-badge ${row.is_active !== false ? "active" : "inactive"}`}>
          {row.is_active !== false ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
});

export default function HrManagement() {
  const { user } = useAuth(); 
  const userName = user?.username || "";
  const hasHrAccess = userName === "SMM_HR";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ==========================================
  // 1. FILTER OPTIONS STATES
  // ==========================================
  const [designationOptions, setDesignationOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [socialCatOptions, setSocialCatOptions] = useState([]);
  const [themes, setThemes] = useState([]);

  // ==========================================
  // 2. SELECTED FILTER STATES
  // ==========================================
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [gender, setGender] = useState("");
  const [socialCategory, setSocialCategory] = useState("");
  const [themeId, setThemeId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");

  // ==========================================
  // 3. TABLE STATES
  // ==========================================
  const [staffList, setStaffList] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 15, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH FILTER OPTIONS ON MOUNT
  // ==========================================
  useEffect(() => {
    if (!hasHrAccess) return;

    // Fetch Dynamic Filter Options
    api.get("/tms/staff/filter-options/")
      .then((res) => {
        const data = res?.data || {};
        setDesignationOptions(data.designations || []);
        setEmpTypeOptions(data.employment_types || []);
        setSocialCatOptions(data.social_categories || []);
      })
      .catch((err) => console.error("Failed to load filter options", err));

    // Fetch Themes
    TMS_API.trainingThemes.list({ page_size: 100 })
      .then((res) => {
        const allThemes = res?.data?.results || [];
        setThemes(allThemes);
      })
      .catch((err) => console.error("Failed to load themes", err));
  }, [hasHrAccess]);

  // ==========================================
  // FETCH STAFF LIST DATA
  // ==========================================
  const loadStaffData = useCallback(async () => {
    if (!hasHrAccess) return;

    setLoading(true);
    setError("");

    try {
      const params = {
        limit: 5000,
        search: search || undefined,
        designation: designation || undefined,
        employment_type: employmentType || undefined,
        gender: gender || undefined,
        social_category: socialCategory || undefined,
        theme_id: themeId || undefined,
        district_id: districtId || undefined,
        block_id: blockId || undefined,
      };

      const res = await TMS_API.staff.list(params);
      const payload = res?.data || {};
      
      const data = Array.isArray(payload.results) ? payload.results : Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
      
      setStaffList(data);
      setMeta(prev => ({
        ...prev,
        page: 1,
        total: data.length
      }));

    } catch (err) {
      console.error("Failed to fetch staff list", err);
      setError("Failed to load staff records. Please try again.");
      setStaffList([]);
      setMeta(prev => ({ ...prev, page: 1, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [search, designation, employmentType, gender, socialCategory, themeId, districtId, blockId, hasHrAccess]);

  // Auto-fetch data when filters change
  useEffect(() => {
    loadStaffData();
  }, [loadStaffData]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setDesignation("");
    setEmploymentType("");
    setGender("");
    setSocialCategory("");
    setThemeId("");
    setDistrictId("");
    setBlockId("");
  };

  // ==========================================
  // ACCESS DENIED RENDER (If not SMMU-HR)
  // ==========================================
  if (!hasHrAccess) {
    return (
      <div className="app-container staff-directory">
        <Header />
        <div className="d-flex staff-directory__layout">
          <LeftNav />
          <main className="staff-directory__main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="staff-directory__access-denied">
              <FaLock className="lock-icon" />
              <h2>Access Denied</h2>
              <p>This module is restricted to the <strong>SMM_HR</strong> username.</p>
            </div>
          </main>
        </div>
        <Footer />
        <style>{`
          .staff-directory__layout { display: flex; align-items: flex-start; min-height: calc(100vh - 120px); background: #f3f6fb; }
          .staff-directory__main { flex: 1; padding: 40px; background: #f3f6fb; }
          .staff-directory__access-denied { text-align: center; padding: 60px 40px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 500px; margin: 0 auto; border-top: 6px solid #e11d48; }
          .lock-icon { font-size: 60px; color: #e11d48; margin-bottom: 20px; }
          .staff-directory__access-denied h2 { color: #1e293b; margin-bottom: 10px; font-size: 26px; }
          .staff-directory__access-denied p { color: #64748b; line-height: 1.6; }
        `}</style>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(staffList.length / meta.page_size));
  const visibleStaff = staffList.slice(
    (meta.page - 1) * meta.page_size,
    meta.page * meta.page_size,
  );

  // ==========================================
  // MAIN RENDER (SMMU-HR Role)
  // ==========================================
  return (
    <div className="app-container staff-directory">
      <Header />
      <div className="d-flex staff-directory__layout">
        <LeftNav />
        <main className="staff-directory__main">
          <div className="staff-directory__content">
            
            {/* ---------------- INTRO ---------------- */}
            <section className="staff-directory__intro">
              <div className="staff-directory__intro-copy">
                <span className="staff-directory__intro-icon">
                  <FaUserTie aria-hidden="true" />
                </span>
                <div>
                  <p className="staff-directory__eyebrow">HR MANAGEMENT SYSTEM</p>
                  <h1>Staff Directory</h1>
                  <p>View, search, and manage all staff members across districts and blocks.</p>
                </div>
              </div>
            </section>

            {/* ---------------- FILTERS SECTION ---------------- */}
            <section className="staff-directory__filters-container">
              <div className="staff-directory__section-heading">
                <div>
                  <h2>Advanced Filters</h2>
                  <p>Use the options below to narrow down the staff list.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={clearFilters} className="staff-directory__reset-btn">Clear All</button>
                  <button onClick={loadStaffData} className="staff-directory__refresh-btn">
                    <FaSyncAlt className={loading ? "spin-icon" : ""} /> Refresh
                  </button>
                </div>
              </div>

              <div className="staff-directory__filters-grid">
                <div className="filter-group">
                  <label><FaSearch /> Search</label>
                  <input type="text" placeholder="Name, ID or Mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                
                <div className="filter-group">
                  <label><FaUserTie /> Designation</label>
                  <select value={designation} onChange={(e) => setDesignation(e.target.value)}>
                    <option value="">All Designations</option>
                    {designationOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label><FaIdCard /> Employment Type</label>
                  <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                    <option value="">All Types</option>
                    {empTypeOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label><FaUsers /> Social Category</label>
                  <select value={socialCategory} onChange={(e) => setSocialCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {socialCatOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label><FaFilter /> Theme</label>
                  <select value={themeId} onChange={(e) => setThemeId(e.target.value)}>
                    <option value="">All Themes</option>
                    {themes.map(t => (
                      <option key={t.id} value={t.id}>{t.name || t.theme_name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label><FaUsers /> Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* ---------------- TABLE SECTION ---------------- */}
            <section className="staff-directory__table-section">
              <div className="staff-directory__results-heading">
                <div>
                  <h2 style={{ fontSize: '20px' }}>Staff Records</h2>
                </div>
                <span className="staff-directory__count">Total: {meta.total}</span>
              </div>

              {error && (
                <div style={{ padding: '0 20px 20px' }}>
                  <div className="staff-directory__error"><FaTimesCircle /> {error}</div>
                </div>
              )}

              {loading && staffList.length === 0 ? (
                 <div className="staff-directory__loading-state">
                   <div className="staff-directory__spinner" />
                   <p>Fetching staff data...</p>
                 </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="tms-table">
                      <thead>
                        <tr>
                          <th style={{ width: '70px', textAlign: 'center' }}>Sr. No.</th>
                          <th>EMPLOYEE-ID</th>
                          <th>Full Name</th>
                          <th>Designation/theme</th>
                          <th>District</th>
                          <th>Block</th>
                          <th>Emp. Type</th>
                          <th>Mobile</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleStaff.map((r, index) => {
                          const serialNumber = (meta.page - 1) * meta.page_size + index + 1;
                          return (
                            <StaffRow 
                              key={r.id || r.employee_id || r.staff_code || serialNumber}
                              row={r} 
                              srNo={serialNumber} 
                            />
                          );
                        })}
                        {staffList.length === 0 && !loading && (
                          <tr>
                            <td colSpan="9" className="staff-directory__no-results">No staff records found matching your filters.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="tms-pagination">
                      <button
                        className="staff-directory__reset-btn"
                        disabled={meta.page <= 1}
                        onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        Prev
                      </button>
                      <span className="pagination-info">
                        Page <strong>{meta.page}</strong> of {totalPages}
                      </span>
                      <button
                        className="staff-directory__reset-btn"
                        disabled={meta.page >= totalPages}
                        onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>

          </div>
        </main>
      </div>
      <Footer />

      <style>{`
        /* --- FULL SCREEN LAYOUT CSS --- */
        .staff-directory__layout { display: flex; align-items: flex-start; min-height: calc(100vh - 120px); background: #ffffff; }
        .staff-directory__main { flex: 1; min-width: 0; padding: clamp(18px, 2.5vw, 28px) clamp(22px, 4vw, 40px); background: #ffffff; }
        .staff-directory__content { width: 100%; max-width: 100%; margin: 0 auto; }
        
        /* --- HEADERS & INTRO --- */
        .staff-directory__intro { display: flex; align-items: center; gap: 20px; margin: 0 0 24px; padding: 22px 26px; border: 1px solid #dce7f3; border-left: 4px solid #1672b8; border-radius: 14px; background: linear-gradient(110deg, #fff 0%, #f5f9fe 100%); box-shadow: 0 5px 16px rgba(30, 64, 104, .06); }
        .staff-directory__intro-copy { display: flex; align-items: center; gap: 16px; }
        .staff-directory__intro-icon { display: grid; flex: 0 0 50px; width: 50px; height: 50px; place-items: center; border: 1px solid #d8e8f8; border-radius: 14px; background: #eaf4ff; color: #1769aa; font-size: 22px; }
        .staff-directory__eyebrow { color: #3976aa; margin: 0 0 5px; font-size: 10px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
        .staff-directory__intro h1 { margin: 0; color: #1b2f4b; font-size: clamp(23px, 2.4vw, 30px); font-weight: 750; letter-spacing: -.025em; }
        .staff-directory__intro p:last-child { margin: 5px 0 0; color: #687b91; font-size: 13px; line-height: 1.5; }
        
        /* --- FILTERS AREA --- */
        .staff-directory__filters-container, .staff-directory__table-section { border: 1px solid #e2e8f0; border-radius: 16px; background: #fff; box-shadow: 0 4px 20px rgba(15, 23, 42, .04); margin-bottom: 24px; overflow: hidden; }
        .staff-directory__section-heading, .staff-directory__results-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 24px 24px 16px; border-bottom: 1px solid #f1f5f9; }
        .staff-directory__section-heading h2, .staff-directory__results-heading h2 { margin: 0; color: #0f172a; font-size: 20px; font-weight: 700; }
        .staff-directory__section-heading p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
        
        .staff-directory__filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 20px 24px; background: #f8fafc; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-group label { display: flex; align-items: center; gap: 6px; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .filter-group label svg { color: #64748b; }
        .filter-group input, .filter-group select { width: 100%; min-height: 44px; padding: 0 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #fff; color: #0f172a; font-size: 14px; outline: none; transition: all .2s; }
        .filter-group input:focus, .filter-group select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, .15); }
        
        /* --- BUTTONS --- */
        .staff-directory__reset-btn, .staff-directory__refresh-btn { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; gap: 8px; padding: 0 18px; border-radius: 8px; font-size: 13px; font-weight: 650; cursor: pointer; transition: all .2s; }
        .staff-directory__reset-btn { border: 1.5px solid #cbd5e1; background: #fff; color: #475569; }
        .staff-directory__reset-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; }
        .staff-directory__refresh-btn { border: none; background: #0f172a; color: #fff; box-shadow: 0 4px 10px rgba(15, 23, 42, .2); }
        .staff-directory__refresh-btn:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); }
        .staff-directory__reset-btn:disabled, .staff-directory__refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spin-icon { animation: staff-spin 1s linear infinite; }
        @keyframes staff-spin { to { transform: rotate(360deg); } }
        
        .staff-directory__count { padding: 6px 12px; border-radius: 999px; background: #f1f5f9; color: #334155; font-size: 13px; font-weight: 700; }
        .staff-directory__error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2; color: #b91c1c; font-size: 14px; }
        
        .staff-directory__loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px; color: #64748b; }
        .staff-directory__spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #0f172a; border-radius: 50%; animation: staff-spin .8s linear infinite; margin-bottom: 15px; }
        
        /* --- TABLE --- */
        .table-wrapper { width: 100%; overflow-x: auto; }
        .tms-table { width: 100%; min-width: 800px; border-collapse: separate; border-spacing: 0; text-align: left; }
        .tms-table th { padding: 16px 18px; background: #f8fafc; color: #475569; font-size: 12px; font-weight: 750; text-transform: uppercase; letter-spacing: .05em; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
        .tms-table td { padding: 16px 18px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .tms-table tbody tr { transition: background-color 0.15s; }
        .tms-table tbody tr:hover td { background: #f8fafc; }
        .staff-directory__no-results { text-align: center; padding: 40px !important; color: #64748b; font-size: 15px; }

        .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .status-badge.active { background: #dcfce7; color: #166534; }
        .status-badge.inactive { background: #fee2e2; color: #991b1b; }

        /* --- PAGINATION --- */
        .tms-pagination { display: flex; align-items: center; justify-content: flex-end; gap: 16px; padding: 16px 24px; background: #fff; border-top: 1px solid #e2e8f0; }
        .pagination-info { font-size: 14px; color: #64748b; }
        .pagination-info strong { color: #0f172a; }

        /* Responsive */
        @media (max-width: 768px) {
          .staff-directory__section-heading, .staff-directory__results-heading { flex-direction: column; align-items: flex-start; gap: 15px; }
          .staff-directory__intro { padding: 18px; border-radius: 12px; }
          .staff-directory__intro-copy { gap: 13px; }
          .staff-directory__intro-icon { flex-basis: 44px; width: 44px; height: 44px; border-radius: 12px; font-size: 19px; }
          .staff-directory__intro h1 { font-size: 24px; }
          .staff-directory__filters-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}