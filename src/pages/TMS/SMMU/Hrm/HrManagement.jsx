import React, { useEffect, useState, useCallback } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import LeftNav from "../../layout/tms_LeftNav";

import api, { TMS_API, LOOKUP_API } from "../../../../api/axios";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  FaIdCard,
  FaSearch,
  FaTimesCircle,
  FaUserTie,
  FaUsers,
  FaSyncAlt,
  FaFilter,
  FaLock,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaExclamationTriangle
} from "react-icons/fa";

// ==========================================
// TABLE ROW COMPONENT
// ==========================================
const StaffRow = React.memo(function StaffRow({ row, srNo, onView, onEdit, onDelete }) {
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
      <td style={{ textAlign: "center" }}>
        <div className="staff-directory__row-actions">
        <button
          className="staff-directory__view-btn" 
          onClick={() => onView(row)}
          title="View Details"
        >
          <FaEye /> View
        </button>
        <button
          className="staff-directory__edit-btn"
          onClick={() => onEdit(row)}
          title="Edit staff"
          aria-label={`Edit ${row.full_name || row.employee_id || "staff"}`}
        >
          <FaEdit /> 
        </button>
        <button
          className="staff-directory__delete-btn"
          onClick={() => onDelete(row)}
          title="Delete staff"
          aria-label={`Delete ${row.full_name || row.employee_id || "staff"}`}
        >
          <FaTrashAlt />
        </button>
        </div>
      </td>
    </tr>
  );
});

function getRelatedId(value, idKey) {
  if (value && typeof value === "object") {
    return value[idKey] ?? value.id ?? "";
  }
  return value ?? "";
}

function getApiErrorMessage(err, fallback) {
  const errorData = err.response?.data;
  const validationMessages =
    errorData && typeof errorData === "object"
      ? Object.values(errorData)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter((value) => typeof value === "string")
      : [];

  return errorData?.message || validationMessages.join(" ") || fallback;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function HrManagement() {
  const { user } = useAuth(); 
  const userName = user?.username || "";
  const hasHrAccess = userName === "SMM_HR";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- 1. FILTER OPTIONS STATES ---
  const [designationOptions, setDesignationOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [socialCatOptions, setSocialCatOptions] = useState([]);
  const [themes, setThemes] = useState([]);
  
  // Location States
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  // --- 2. SELECTED FILTER STATES ---
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [gender, setGender] = useState("");
  const [socialCategory, setSocialCategory] = useState("");
  const [themeId, setThemeId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");

  // --- 3. TABLE STATES ---
  const [staffList, setStaffList] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 15, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- 4. ADD EMPLOYEE STATES ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const initialFormState = {
    employee_id: "",
    full_name: "",
    designation: "",
    employment_type: "",
    gender: "",
    social_category: "",
    theme_id: "",
    district_id: "",
    block_id: "",
    mobile: "",
    email: "",
    pan: "",
    uan: "",
    epf: "",
    esic: "",
    bank_account_no: "",
    aadhar: "",
    marital_status: "",
    program: "",
    is_active: true
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 5. VIEW EMPLOYEE STATES ---
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ==========================================
  // FETCH FILTER OPTIONS & DISTRICTS ON MOUNT
  // ==========================================
  useEffect(() => {
    if (!hasHrAccess) return;

    // 1. Fetch Form Dropdowns
    api.get("/tms/staff/filter-options/")
      .then((res) => {
        const data = res?.data || {};
        setDesignationOptions(data.designations || []);
        setEmpTypeOptions(data.employment_types || []);
        setSocialCatOptions(data.social_categories || []);
      })
      .catch((err) => console.error("Failed to load filter options", err));

    // 2. Fetch Themes
    TMS_API.trainingThemes.list({ page_size: 100 })
      .then((res) => setThemes(res?.data?.results || []))
      .catch((err) => console.error("Failed to load themes", err));

    // 3. Fetch Districts
    LOOKUP_API.districts.list({ page_size: 200 })
      .then((res) => {
        const payload = res?.data || {};
        const districtArray = Array.isArray(payload.results) ? payload.results 
                            : Array.isArray(payload.data) ? payload.data 
                            : Array.isArray(payload) ? payload : [];
        setDistricts(districtArray);
      })
      .catch((err) => console.error("Failed to load districts", err));

  }, [hasHrAccess]);

  // ==========================================
  // CASCADING DROPDOWN LOGIC (FETCH BLOCKS)
  // ==========================================
  const fetchBlocks = async (distId) => {
    if (!distId) {
      setBlocks([]);
      return;
    }
    try {
      // Fetch Blocks using LOOKUP_API
      const res = await LOOKUP_API.blocksByDistrict(distId); 
      const payload = res?.data || {};
      
      const blockArray = Array.isArray(payload.results) ? payload.results 
                       : Array.isArray(payload.data) ? payload.data 
                       : Array.isArray(payload) ? payload : [];
      setBlocks(blockArray);
    } catch (err) {
      console.error("Failed to load blocks", err);
      setBlocks([]);
    }
  };

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
      setMeta(prev => ({ ...prev, page: 1, total: data.length }));
    } catch (err) {
      console.error("Failed to fetch staff list", err);
      setError("Failed to load staff records. Please try again.");
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, [search, designation, employmentType, gender, socialCategory, themeId, districtId, blockId, hasHrAccess]);

  useEffect(() => {
    loadStaffData();
  }, [loadStaffData]);

  const clearFilters = () => {
    setSearch(""); setDesignation(""); setEmploymentType(""); setGender("");
    setSocialCategory(""); setThemeId(""); setDistrictId(""); setBlockId("");
  };

  // ==========================================
  // HANDLERS FOR ADD MODAL
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "district_id" ? { block_id: "" } : {}),
    }));

    if (name === "district_id") {
      fetchBlocks(value);
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData(initialFormState);
    setFormError("");
    setShowAddModal(true);
  };

  const handleEditStaff = (staff) => {
    const districtId = getRelatedId(staff.district_id ?? staff.district, "district_id");
    const blockId = getRelatedId(staff.block_id ?? staff.block, "block_id");
    const themeId = getRelatedId(staff.theme_id ?? staff.theme, "id");

    setEditingStaff(staff);
    setFormError("");
    setFormData({
      ...initialFormState,
      employee_id: staff.employee_id || "",
      full_name: staff.full_name || staff.name || "",
      designation: staff.designation || "",
      employment_type: staff.employment_type || "",
      gender: staff.gender || "",
      social_category: staff.social_category || "",
      theme_id: String(themeId || ""),
      district_id: String(districtId || ""),
      block_id: String(blockId || ""),
      mobile: staff.mobile || staff.mobile_no || "",
      email: staff.email || "",
      pan: staff.pan || "",
      uan: staff.uan || "",
      epf: staff.epf || "",
      esic: staff.esic || "",
      bank_account_no: staff.bank_account_no || "",
      aadhar: staff.aadhar || "",
      marital_status: staff.marital_status || "",
      program: staff.program || "",
      is_active: staff.is_active !== false,
    });
    if (districtId) {
      fetchBlocks(districtId);
    } else {
      setBlocks([]);
    }
    setShowAddModal(true);
  };

  const closeStaffForm = () => {
    if (isSubmitting) return;
    setShowAddModal(false);
    setEditingStaff(null);
    setFormData(initialFormState);
    setFormError("");
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const { district_id, block_id, theme_id, ...staffData } = formData;
      const payload = {
        ...staffData,
        district: district_id ? Number(district_id) : null,
        block: block_id ? Number(block_id) : null,
        theme: theme_id ? Number(theme_id) : null,
        designation: formData.designation || null,
      };

      if (editingStaff) {
        const employeeId = editingStaff.employee_id || editingStaff.id;
        await TMS_API.update(employeeId, payload);
      } else {
        await api.post("/tms/add/", payload);
      }

      setFormData(initialFormState);
      setShowAddModal(false);
      setEditingStaff(null);
      await loadStaffData();
    } catch (err) {
      setFormError(
        getApiErrorMessage(
          err,
          editingStaff ? "Failed to update employee." : "Failed to add employee.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setError("");
    try {
      const employeeId = deleteTarget.employee_id || deleteTarget.id;
      await TMS_API.delete(employeeId);
      setDeleteTarget(null);
      await loadStaffData();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete employee."));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // HANDLERS FOR VIEW MODAL
  // ==========================================
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setShowViewModal(true);
  };

  // ==========================================
  // ACCESS DENIED RENDER
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
  const visibleStaff = staffList.slice((meta.page - 1) * meta.page_size, meta.page * meta.page_size);

  // ==========================================
  // MAIN RENDER (SMM_HR ROLE)
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
                <span className="staff-directory__intro-icon"><FaUserTie /></span>
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
                <div><h2>Advanced Filters</h2></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={clearFilters} className="staff-directory__reset-btn">Clear All</button>
                  <button onClick={loadStaffData} className="staff-directory__refresh-btn">
                    <FaSyncAlt className={loading ? "spin-icon" : ""} /> Refresh
                  </button>
                  <button onClick={openAddModal} className="staff-directory__add-btn">
                    <FaPlus /> Add Staff
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
                    {designationOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label><FaIdCard /> Employment Type</label>
                  <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                    <option value="">All Types</option>
                    {empTypeOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label><FaUsers /> Social Category</label>
                  <select value={socialCategory} onChange={(e) => setSocialCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {socialCatOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label><FaFilter /> Theme</label>
                  <select value={themeId} onChange={(e) => setThemeId(e.target.value)}>
                    <option value="">All Themes</option>
                    {themes.map(t => <option key={t.id} value={t.id}>{t.name || t.theme_name}</option>)}
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
                <div><h2 style={{ fontSize: '20px' }}>Staff Records</h2></div>
                <span className="staff-directory__count">Total: {meta.total}</span>
              </div>

              {error && <div className="staff-directory__error"><FaTimesCircle /> {error}</div>}

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
                          <th style={{ textAlign: "center" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleStaff.map((r, index) => {
                          const serialNumber = (meta.page - 1) * meta.page_size + index + 1;
                          return (
                            <StaffRow 
                              key={r.id || r.employee_id || serialNumber}
                              row={r} 
                              srNo={serialNumber} 
                              onView={handleViewStaff} 
                              onEdit={handleEditStaff}
                              onDelete={setDeleteTarget}
                            />
                          );
                        })}
                        {staffList.length === 0 && !loading && (
                          <tr>
                            <td colSpan="10" className="staff-directory__no-results">No staff records found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="tms-pagination">
                      <button className="staff-directory__reset-btn" disabled={meta.page <= 1} onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}>Prev</button>
                      <span className="pagination-info">Page <strong>{meta.page}</strong> of {totalPages}</span>
                      <button className="staff-directory__reset-btn" disabled={meta.page >= totalPages} onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}>Next</button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* ---------------- ADD / EDIT EMPLOYEE MODAL ---------------- */}
      {showAddModal && (
        <div className="staff-directory__modal-overlay">
          <div className="staff-directory__modal">
            <div className="modal-header">
              <div>
                <p className="staff-directory__modal-eyebrow">
                  {editingStaff ? "UPDATE STAFF RECORD" : "NEW STAFF RECORD"}
                </p>
                <h2>{editingStaff ? `Edit Staff Details : ${formData.full_name}` : "Add New Staff"}</h2>
              </div>
              <button className="close-btn" onClick={closeStaffForm} disabled={isSubmitting} aria-label="Close form"><FaTimesCircle /></button>
            </div>
            
            <form onSubmit={handleStaffSubmit} className="modal-form">
              {formError && <div className="staff-directory__error">{formError}</div>}
              
              <div className="form-grid">
                <div className="filter-group">
                  <label>Employee ID *</label>
                  <input type="text" name="employee_id" required value={formData.employee_id} onChange={handleInputChange} disabled={Boolean(editingStaff)} />
                </div>
                <div className="filter-group">
                  <label>Full Name *</label>
                  <input type="text" name="full_name" required value={formData.full_name} onChange={handleInputChange} />
                </div>
                <div className="filter-group">
                  <label>Mobile Number *</label>
                  <input type="tel" name="mobile" required value={formData.mobile} onChange={handleInputChange} />
                </div>
                
                <div className="filter-group">
                  <label>District</label>
                  <select name="district_id" value={formData.district_id} onChange={handleInputChange}>
                    <option value="">Select District</option>
                    {Array.isArray(districts) && districts.map((d) => (
                      <option key={d.district_id ?? d.id} value={d.district_id ?? d.id}>
                        {d.district_name_en || d.district_name || d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Block</label>
                  <select name="block_id" value={formData.block_id} onChange={handleInputChange} disabled={!formData.district_id}>
                    <option value="">Select Block</option>
                    {Array.isArray(blocks) && blocks.map((b) => (
                      <option key={b.block_id ?? b.id} value={b.block_id ?? b.id}>
                        {b.block_name_en || b.block_name || b.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Designation *</label>
                  <input type="text" name="designation" required value={formData.designation} onChange={handleInputChange} />
                </div>
                <div className="filter-group">
                  <label>Employment Type</label>
                  <select name="employment_type" value={formData.employment_type} onChange={handleInputChange}>
                    <option value="">Select Type</option>
                    {empTypeOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Theme</label>
                  <select name="theme_id" value={formData.theme_id} onChange={handleInputChange}>
                    <option value="">Select Theme</option>
                    {themes.map(t => <option key={t.id} value={t.id}>{t.name || t.theme_name}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Social Category</label>
                  <select name="social_category" value={formData.social_category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    {socialCatOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
              
              <div className="filter-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} />

              </div>
              <div className="filter-group">
                <label>PAN</label>
                <input type="text" name="pan" value={formData.pan || ""} onChange={handleInputChange} />
              </div>

              <div className="filter-group">
                <label>UAN</label>
                <input type="text" name="uan" value={formData.uan || ""} onChange={handleInputChange} />
              </div>
              <div className="filter-group">  
              <label>EPF</label>
                <input type="text" name="epf" value={formData.epf || ""} onChange={handleInputChange} />
              </div>
              <div className="filter-group">
                <label>ESIC</label>
                <input type="text" name="esic" value={formData.esic || ""} onChange={handleInputChange} />
              </div>
              <div className="filter-group">
                <label>Bank Account Number</label>
                <input type="text" name="bank_account_no" value={formData.bank_account_no || ""} onChange={handleInputChange} />
              </div>
              <div className="filter-group">
                <label>Aadhaar</label>
                <input type="text" name="aadhar" value={formData.aadhar || ""} onChange={handleInputChange} />
              </div>
              <div className="filter-group">
                <label>Marital Status</label>
                <select name="marital_status" value={formData.marital_status || ""} onChange={handleInputChange}>
                  <option value="">Select Status</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>

                <div className="filter-group">
                  <label>Program</label>
                  <input type="text" name="program" value={formData.program || ""} onChange={handleInputChange} />
                </div>
              </div>

              <div className="checkbox-group">
                <label>
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                  Staff is Currently Employed.
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="staff-directory__reset-btn" onClick={closeStaffForm} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="staff-directory__add-btn" disabled={isSubmitting}>
                  {isSubmitting ? (editingStaff ? "Updating..." : "Saving...") : (editingStaff ? "Save Changes" : "Save Employee")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="staff-directory__modal-overlay">
          <section
            className="staff-directory__confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-staff-title"
            aria-describedby="delete-staff-description"
          >
            <div className="staff-directory__confirm-icon"><FaExclamationTriangle /></div>
            <h2 id="delete-staff-title">Delete staff record?</h2>
            <p id="delete-staff-description">
              You are about to delete <strong>{deleteTarget.full_name || deleteTarget.employee_id || "this staff member"}</strong>.
              This action cannot be undone.
            </p>
            <div className="staff-directory__confirm-actions">
              <button
                type="button"
                className="staff-directory__reset-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="staff-directory__danger-btn"
                onClick={handleDeleteStaff}
                disabled={isDeleting}
              >
                <FaTrashAlt /> {isDeleting ? "Deleting..." : "Delete Staff"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ---------------- VIEW EMPLOYEE MODAL ---------------- */}
      {showViewModal && selectedStaff && (
        <div className="staff-directory__modal-overlay">
          <div className="staff-directory__modal">
            <div className="modal-header">
              <h2>Staff Details: {selectedStaff.full_name}</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}><FaTimesCircle /></button>
            </div>
            
            <div className="modal-body" style={{ padding: "24px", overflowY: 'auto' }}>
              <div className="details-grid">
                <div className="detail-item"><strong>Employee ID:</strong> <span>{selectedStaff.employee_id || "-"}</span></div>
                <div className="detail-item"><strong>Full Name:</strong> <span>{selectedStaff.full_name || "-"}</span></div>
                <div className="detail-item"><strong>Mobile:</strong> <span>{selectedStaff.mobile || selectedStaff.mobile_no || "-"}</span></div>
                <div className="detail-item"><strong>Email:</strong> <span>{selectedStaff.email || "-"}</span></div>
                <div className="detail-item"><strong>Designation:</strong> <span>{selectedStaff.designation || "-"}</span></div>
                <div className="detail-item"><strong>Marital Status:</strong> <span>{selectedStaff.marital_status || "-"}</span></div>
                <div className="detail-item"><strong>Program:</strong> <span>{selectedStaff.program || "-"}</span></div>
                <div className="detail-item"><strong>PAN:</strong> <span>{selectedStaff.pan || "-"}</span></div>
                <div className="detail-item"><strong>UAN:</strong> <span>{selectedStaff.uan || "-"}</span></div>
                <div className="detail-item"><strong>EPF:</strong> <span>{selectedStaff.epf || "-"}</span></div>
                <div className="detail-item"><strong>ESIC:</strong> <span>{selectedStaff.esic || "-"}</span></div>
                <div className="detail-item"><strong>Bank Account:</strong> <span>{selectedStaff.bank_account_no || "-"}</span></div>
                <div className="detail-item"><strong>Aadhaar:</strong> <span>{selectedStaff.aadhar || "-"}</span></div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="staff-directory__reset-btn" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

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
        
        .staff-directory__filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 20px 24px; background: #f8fafc; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-group label { display: flex; align-items: center; gap: 6px; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .filter-group input, .filter-group select { width: 100%; min-height: 44px; padding: 0 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #fff; color: #0f172a; font-size: 14px; outline: none; transition: all .2s; }
        .filter-group input:focus, .filter-group select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, .15); }
        
        /* --- BUTTONS --- */
        .staff-directory__reset-btn, .staff-directory__refresh-btn, .staff-directory__add-btn { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; gap: 8px; padding: 0 18px; border-radius: 8px; font-size: 13px; font-weight: 650; cursor: pointer; transition: all .2s; }
        .staff-directory__reset-btn { border: 1.5px solid #cbd5e1; background: #fff; color: #475569; }
        .staff-directory__reset-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; }
        .staff-directory__refresh-btn { border: none; background: #0f172a; color: #fff; }
        .staff-directory__refresh-btn:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); }
        .staff-directory__add-btn { border: none; background: #2563eb; color: #fff; }
        .staff-directory__add-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .staff-directory__reset-btn:disabled, .staff-directory__refresh-btn:disabled, .staff-directory__add-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .spin-icon { animation: staff-spin 1s linear infinite; }
        @keyframes staff-spin { to { transform: rotate(360deg); } }
        
        .staff-directory__count { padding: 6px 12px; border-radius: 999px; background: #f1f5f9; color: #334155; font-size: 13px; font-weight: 700; }
        .staff-directory__error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2; color: #b91c1c; font-size: 14px; margin-bottom: 15px; }
        
        .staff-directory__loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px; color: #64748b; }
        .staff-directory__spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #0f172a; border-radius: 50%; animation: staff-spin .8s linear infinite; margin-bottom: 15px; }
        
        /* --- TABLE --- */
        .table-wrapper { width: 100%; overflow-x: auto; }
        .tms-table { width: 100%; min-width: 900px; border-collapse: separate; border-spacing: 0; text-align: left; }
        .tms-table th { padding: 16px 18px; background: #f8fafc; color: #475569; font-size: 12px; font-weight: 750; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
        .tms-table td { padding: 16px 18px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .tms-table tbody tr:hover td { background: #f8fafc; }
        .staff-directory__no-results { text-align: center; padding: 40px !important; color: #64748b; font-size: 15px; }

        .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .status-badge.active { background: #dcfce7; color: #166534; }
        .status-badge.inactive { background: #fee2e2; color: #991b1b; }
        
        .staff-directory__view-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .staff-directory__view-btn:hover { background: #3b82f6; color: #fff; }
        .staff-directory__row-actions { display: flex; justify-content: center; align-items: center; gap: 7px; min-width: 145px; }
        .staff-directory__edit-btn, .staff-directory__delete-btn { width: 38px; height: 38px; display: inline-grid; place-items: center; border-radius: 8px; cursor: pointer; transition: background .18s ease, color .18s ease, transform .18s ease; }
        .staff-directory__edit-btn { border: 1px solid #bfdbfe; background: #eff6ff; color: #2563eb; }
        .staff-directory__edit-btn:hover { background: #2563eb; color: #fff; transform: translateY(-1px); }
        .staff-directory__delete-btn { border: 1px solid #fecaca; background: #fff1f2; color: #dc2626; }
        .staff-directory__delete-btn:hover { background: #dc2626; color: #fff; transform: translateY(-1px); }

        /* --- PAGINATION --- */
        .tms-pagination { display: flex; align-items: center; justify-content: flex-end; gap: 16px; padding: 16px 24px; background: #fff; border-top: 1px solid #e2e8f0; }
        
        /* --- MODAL --- */
        .staff-directory__modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px); padding: 20px; }
        .staff-directory__modal { background: #fff; width: 100%; max-width: 760px; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 24px 70px rgba(15, 23, 42, .22); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; }
        .modal-header { padding: 20px 26px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(110deg, #fff 0%, #f5f9ff 100%); }
        .modal-header h2 { margin: 0; font-size: 20px; color: #0f172a; }
        .staff-directory__modal-eyebrow { margin: 0 0 4px; color: #2563eb; font-size: 10px; font-weight: 800; letter-spacing: .12em; }
        .close-btn { background: none; border: none; font-size: 20px; color: #64748b; cursor: pointer; }
        .close-btn:hover { color: #e11d48; }
        .close-btn:disabled { opacity: .5; cursor: not-allowed; }
        .modal-form { overflow-y: auto; padding: 26px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
        .checkbox-group { margin-bottom: 24px; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #334155; }
        .checkbox-group input { width: 18px; height: 18px; cursor: pointer; }
        .modal-footer { padding: 20px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; }
        .staff-directory__confirm-modal { width: min(100%, 440px); padding: 30px; border: 1px solid #fee2e2; border-radius: 18px; background: #fff; box-shadow: 0 24px 70px rgba(15, 23, 42, .24); text-align: center; }
        .staff-directory__confirm-icon { width: 54px; height: 54px; margin: 0 auto 16px; display: grid; place-items: center; border-radius: 16px; background: #fff1f2; color: #dc2626; font-size: 22px; }
        .staff-directory__confirm-modal h2 { margin: 0 0 10px; color: #172033; font-size: 21px; }
        .staff-directory__confirm-modal p { margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; }
        .staff-directory__confirm-modal p strong { color: #334155; }
        .staff-directory__confirm-actions { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
        .staff-directory__danger-btn { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; gap: 8px; padding: 0 18px; border: 0; border-radius: 8px; background: #dc2626; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; transition: background .2s, transform .2s; }
        .staff-directory__danger-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
        .staff-directory__danger-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* VIEW DETAILS GRID */
        .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .detail-item { background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 4px; }
        .detail-item strong { color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-item span { color: #0f172a; font-size: 14px; font-weight: 500; word-break: break-all; }

        @media (max-width: 768px) {
          .staff-directory__filters-grid, .form-grid, .details-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}