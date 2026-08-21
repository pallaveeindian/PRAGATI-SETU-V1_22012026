// src/pages/TMS/MTManagementV2/components/MTFormModal.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  FaTimes,
  FaUserEdit,
  FaSave,
  FaShieldAlt,
  FaExclamationTriangle,
  FaKey,
  FaSpinner,
  FaUserPlus,
} from "react-icons/fa";
import { LOOKUP_API, TMS_API } from "../../../../api/axios";
import { useMTForm } from "../hooks/useMTForm";
import { AuthContext } from "../../../../contexts/AuthContext";

const INITIAL_FORM_STATE = {
  username: "",
  full_name: "",
  mobile_no: "",
  aadhaar_no: "",
  date_of_birth: "",
  gender: "",
  social_category: "",
  marital_status: "",
  parent_or_spouse_name: "",
  education: "",
  designation: "",
  theme: "",
  empanel_district: "",
  empanel_block: "",
  skills: "",
  thematic_expert_recommendation: "",
  success_rate: "",
  any_other_tots: "",
  other_achievements: "",
  recommended_tots_by_dmmu: "",
  success_story_publications: "",
  bank_account_number: "",
  ifsc: "",
  branch_name: "",
  bank_name: "",
  reset_password: false,
  profile_picture: null,
};

export default function MTFormModal({
  open,
  trainerId,
  onClose,
  onSuccessRefresh,
  isDMMU,
  isSMMU,
  lockedDistrict,
  lockedTheme,
}) {
  const isUpdate = Boolean(trainerId);

  // SURGICAL ADDITION: Role context for form restrictions
  const { user } = useContext(AuthContext) || {};
  const role = user?.role_name?.toLowerCase() || "";
  const isCurrentBMMU = role === "bmmu" || role === "1";
  const isCurrentDMMU = role === "dmmu" || role === "2";

  // 1. Form & UI State
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE });
  const [originalData, setOriginalData] = useState(null); // <-- SURGICAL ADDITION
  const [fetchingDetail, setFetchingDetail] = useState(false);

  // 2. Lookup States
  const [themes, setThemes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);

  // 3. Initialize Submission Hook
  const { submitForm, submitting, error, clearError, successData } = useMTForm({
    onSuccess: () => {
      onSuccessRefresh();
    },
  });

  // 4. Fetch Lookups on Mount
  useEffect(() => {
    if (!open) return;

    TMS_API.trainingThemes
      .list()
      .then((res) => {
        setThemes(res?.data?.results || res?.data || []);
      })
      .catch(console.error);

    LOOKUP_API.districts
      .list({ page_size: 100 })
      .then((res) => {
        setDistricts(res?.data?.results || []);
      })
      .catch(console.error);
  }, [open]);

  // 5. Fetch Blocks when District changes
  useEffect(() => {
    if (!formData.empanel_district) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocks
      .list({ district_id: formData.empanel_district, page_size: 200 })
      .then((res) => setBlocks(res?.data?.results || []))
      .catch(console.error);
  }, [formData.empanel_district]);

  // 6. Populate Form Data on Open
  useEffect(() => {
    if (!open) return;
    clearError();

    if (isUpdate && trainerId) {
      setFetchingDetail(true);
      TMS_API.mtV2
        .detail(trainerId)
        .then((res) => {
          const data = res.data;
          const mappedData = {
            username: data.master_user?.username || "",
            full_name: data.full_name || "",
            mobile_no: data.mobile_no || "",
            aadhaar_no: data.aadhaar_no || "",
            date_of_birth: data.date_of_birth || "",
            gender: data.gender || "",
            social_category: data.social_category || "",
            marital_status: data.marital_status || "",
            parent_or_spouse_name: data.parent_or_spouse_name || "",
            education: data.education || "",
            designation: data.designation || "",
            theme: data.theme?.id || data.theme || "",
            empanel_district:
              data.empanel_district?.district_id || data.empanel_district || "",
            empanel_block:
              data.empanel_block?.block_id || data.empanel_block || "",
            skills: data.skills || "",
            thematic_expert_recommendation:
              data.thematic_expert_recommendation || "",
            success_rate: data.success_rate || "",
            any_other_tots: data.any_other_tots || "",
            other_achievements: data.other_achievements || "",
            recommended_tots_by_dmmu: data.recommended_tots_by_dmmu || "",
            success_story_publications: data.success_story_publications || "",
            bank_account_number: data.bank_account_number || "",
            ifsc: data.ifsc || "",
            branch_name: data.branch_name || "",
            bank_name: data.bank_name || "",
            reset_password: false,
            profile_picture: null,
          };
          setFormData(mappedData);
          setOriginalData(mappedData);
        })
        .catch((err) => console.error("Failed to fetch MT detail", err))
        .finally(() => setFetchingDetail(false));
    } else {
      // Creation Mode Initialization
      setFormData({
        ...INITIAL_FORM_STATE,
        empanel_district: isDMMU || isCurrentBMMU ? lockedDistrict : "",
        empanel_block: isCurrentBMMU ? user?.block_id : "", // Assuming block_id is in user object, otherwise fetched via geoscope
        theme: isSMMU ? lockedTheme : "",
      });
    }

    // Scroll lock
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    open,
    isUpdate,
    trainerId,
    isDMMU,
    lockedDistrict,
    lockedTheme,
    clearError,
  ]);

  // 7. Auto-scroll to top on validation or API error
  useEffect(() => {
    if (error) {
      const modalBody = document.querySelector(".nic-modal-body");
      if (modalBody) {
        modalBody.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [error]);

  if (!open) return null;

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((p) => ({ ...p, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...formData };
    if (isDMMU && lockedDistrict) {
      payload.empanel_district = lockedDistrict;
    }
    if (isSMMU && lockedTheme) {
      payload.theme = lockedTheme;
    }

    // SURGICAL FIX: Calculate dirty fields (Only send what changed)
    if (isUpdate && originalData) {
      const dirtyPayload = {};
      let hasChanges = false;

      Object.keys(payload).forEach((key) => {
        // Always include files if they were newly selected
        if (key === "profile_picture" && payload[key] instanceof File) {
          dirtyPayload[key] = payload[key];
          hasChanges = true;
        }
        // Compare primitives against the original baseline
        else if (payload[key] !== originalData[key]) {
          dirtyPayload[key] = payload[key];
          hasChanges = true;
        }
      });

      // If absolutely nothing changed, just close the modal and save a network request
      if (!hasChanges) {
        onClose();
        return;
      }

      payload = dirtyPayload;
    }

    const res = await submitForm(trainerId, payload);
    if (res.success && !res.data.password && !res.data.new_password) {
      // If success and no credentials generated (standard update), close modal
      onClose();
    }
  };

  // SUCCESS SCREEN (Credentials Generated)
  if (successData) {
    return (
      <div className="nic-modal-backdrop">
        <div className="nic-modal-container" style={{ maxWidth: "600px" }}>
          <div
            className="nic-modal-header"
            style={{ backgroundColor: "#16a34a" }}
          >
            <h3 className="nic-modal-title">
              <FaShieldAlt style={{ marginRight: "8px" }} /> Setup Successful
            </h3>
          </div>
          <div
            className="nic-modal-body"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <h2
              style={{
                color: "#166534",
                marginBottom: "12px",
                fontSize: "24px",
              }}
            >
              {successData.message || "Operation Completed Successfully!"}
            </h2>
            <p style={{ color: "#475569", marginBottom: "28px" }}>
              Please copy these system credentials securely.
              {isUpdate
                ? " The password has been reset."
                : " The Master User account has been provisioned."}
            </p>
            <div
              style={{
                background: "#f8fafc",
                border: "3px dashed #16a34a",
                padding: "24px",
                borderRadius: "12px",
                display: "inline-block",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              <div style={{ marginBottom: "12px", fontSize: "16px" }}>
                <strong>Username: </strong>
                <span
                  style={{
                    fontFamily: "monospace",
                    color: "#1e3a8a",
                    fontSize: "18px",
                    userSelect: "all",
                  }}
                >
                  {successData.username}
                </span>
              </div>
              <div style={{ fontSize: "16px" }}>
                <strong>Password: </strong>
                <span
                  style={{
                    fontFamily: "monospace",
                    color: "#e11d48",
                    fontSize: "22px",
                    fontWeight: "900",
                    userSelect: "all",
                    letterSpacing: "2px",
                  }}
                >
                  {successData.password}
                </span>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="nic-btn-primary"
                onClick={onClose}
                style={{ margin: "0 auto", padding: "10px 32px" }}
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nic-modal-backdrop">
      <div className="nic-modal-container" style={{ maxWidth: "900px" }}>
        {/* HEADER */}
        <div className="nic-modal-header">
          <h3 className="nic-modal-title">
            {isUpdate ? (
              <FaUserEdit style={{ marginRight: "8px" }} />
            ) : (
              <FaUserPlus style={{ marginRight: "8px" }} />
            )}
            {isUpdate
              ? `Modify Master Trainer: ${formData.full_name}`
              : "Register New Master Trainer"}
          </h3>
          <button
            type="button"
            className="nic-modal-close-btn"
            onClick={onClose}
            disabled={submitting}
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="nic-modal-body">
          {fetchingDetail ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#64748b" }}
            >
              <FaSpinner
                className="nic-spin"
                style={{ fontSize: "24px", marginBottom: "12px" }}
              />
              <p>Loading Trainer Profile...</p>
            </div>
          ) : (
            <form id="mt-form" onSubmit={handleSubmit}>
              {error && (
                <div className="nic-alert-danger">
                  <FaExclamationTriangle style={{ marginRight: "8px" }} />{" "}
                  {error}
                </div>
              )}

              {/* 1. Account Configuration */}
              <div
                className="nic-form-section"
                style={{ borderLeft: "4px solid #1e3a8a" }}
              >
                <h4 className="nic-section-title">1. System Account</h4>
                <div className="nic-form-grid">
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Username (MANDATORY){" "}
                      {!isUpdate && (
                        <span className="text-muted">(Min 4 chars)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="nic-input"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={isUpdate}
                      placeholder={
                        isUpdate ? "" : "Please enter Username for Trainer ID"
                      }
                    />
                  </div>

                  {isUpdate && (
                    <div
                      className="nic-form-group"
                      style={{ justifyContent: "center" }}
                    >
                      <label
                        className="nic-checkbox-label alert-danger"
                        style={{ marginTop: "18px" }}
                      >
                        <input
                          type="checkbox"
                          name="reset_password"
                          checked={formData.reset_password}
                          onChange={handleChange}
                          className="nic-checkbox"
                        />
                        <div className="nic-checkbox-text">
                          <strong>
                            <FaKey /> Force Password Reset
                          </strong>
                          <span>Reset to default system password.</span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Personal Identity */}
              <div className="nic-form-section">
                <h4 className="nic-section-title">2. Personal Details</h4>
                <div className="nic-form-grid">
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Full Name <span className="nic-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      className="nic-input"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Parent / Spouse Name</label>
                    <input
                      type="text"
                      name="parent_or_spouse_name"
                      className="nic-input"
                      value={formData.parent_or_spouse_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Mobile Number <span className="nic-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile_no"
                      className="nic-input"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      pattern="\d{10}"
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadhaar_no"
                      className="nic-input"
                      value={formData.aadhaar_no}
                      onChange={handleChange}
                      maxLength="12"
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      className="nic-input"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Gender</label>
                    <select
                      name="gender"
                      className="nic-select"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Social Category</label>
                    <select
                      name="social_category"
                      className="nic-select"
                      value={formData.social_category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="OBC">OBC</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Marital Status</label>
                    <select
                      name="marital_status"
                      className="nic-select"
                      value={formData.marital_status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Professional & Empanelment */}
              <div className="nic-form-section">
                <h4 className="nic-section-title">
                  3. Professional & Empanelment
                </h4>
                <div className="nic-form-grid">
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Designation <span className="nic-required">*</span>
                    </label>
                    <select
                      name="designation"
                      className="nic-select"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      disabled={isUpdate && !isSMMU}
                    >
                      <option value="">Select Designation</option>
                      {/* SURGICAL REPLACEMENT: RBAC Restricted Designation Selection */}
                      {isCurrentBMMU && <option value="BRP">BRP</option>}
                      {isCurrentDMMU && <option value="DRP">DRP</option>}
                      {!isCurrentBMMU && !isCurrentDMMU && (
                        <>
                          <option value="BRP">BRP</option>
                          <option value="DRP">DRP</option>
                          <option value="SRP">SRP</option>
                          <option value="TSA">TSA</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Primary Theme</label>
                    <select
                      name="theme"
                      className="nic-select"
                      value={formData.theme}
                      onChange={handleChange}
                      disabled={isUpdate && !isSMMU}
                    >
                      <option value="">Select Theme</option>
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.theme_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Empanel District <span className="nic-required">*</span>
                    </label>
                    <select
                      name="empanel_district"
                      className="nic-select"
                      value={formData.empanel_district}
                      onChange={handleChange}
                      required
                      disabled={
                        isDMMU || isCurrentBMMU || (isUpdate && !isSMMU)
                      }
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.district_id} value={d.district_id}>
                          {d.district_name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Empanel Block</label>
                    <select
                      name="empanel_block"
                      className="nic-select"
                      value={formData.empanel_block}
                      onChange={handleChange}
                      disabled={
                        !formData.empanel_district ||
                        isCurrentBMMU ||
                        (isUpdate && !isSMMU)
                      }
                    >
                      <option value="">Select Block</option>
                      {blocks.map((b) => (
                        <option key={b.block_id} value={b.block_id}>
                          {b.block_name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Education</label>
                    <input
                      type="text"
                      name="education"
                      className="nic-input"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Success Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      max="100"
                      name="success_rate"
                      className="nic-input"
                      value={formData.success_rate}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="nic-form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label className="nic-label">
                      Skills / Thematic Sectors
                    </label>
                    <textarea
                      name="skills"
                      className="nic-input"
                      rows="2"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Bank Details */}
              <div className="nic-form-section">
                <h4 className="nic-section-title">4. Bank Information</h4>
                <div className="nic-form-grid">
                  <div className="nic-form-group">
                    <label className="nic-label">Account Number</label>
                    <input
                      type="text"
                      name="bank_account_number"
                      className="nic-input"
                      value={formData.bank_account_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc"
                      className="nic-input"
                      value={formData.ifsc}
                      onChange={handleChange}
                      style={{ textTransform: "uppercase" }}
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Bank Name</label>
                    <input
                      type="text"
                      name="bank_name"
                      className="nic-input"
                      value={formData.bank_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">Branch Name</label>
                    <input
                      type="text"
                      name="branch_name"
                      className="nic-input"
                      value={formData.branch_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* 5. Achievements & Recommendations */}
              <div className="nic-form-section">
                <h4 className="nic-section-title">5. Achievements & Records</h4>
                <div className="nic-form-grid">
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Thematic Expert Recommendation
                    </label>
                    <input
                      type="text"
                      name="thematic_expert_recommendation"
                      className="nic-input"
                      value={formData.thematic_expert_recommendation}
                      onChange={handleChange}
                      placeholder="Yes/No or Expert Name"
                    />
                  </div>
                  <div className="nic-form-group">
                    <label className="nic-label">
                      Recommended TOTs by DMMU
                    </label>
                    <input
                      type="text"
                      name="recommended_tots_by_dmmu"
                      className="nic-input"
                      value={formData.recommended_tots_by_dmmu}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="nic-form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label className="nic-label">
                      Success Story Publications
                    </label>
                    <textarea
                      name="success_story_publications"
                      className="nic-input"
                      rows="2"
                      value={formData.success_story_publications}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="nic-form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label className="nic-label">Any Other TOTs</label>
                    <textarea
                      name="any_other_tots"
                      className="nic-input"
                      rows="2"
                      value={formData.any_other_tots}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="nic-form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label className="nic-label">Other Achievements</label>
                    <textarea
                      name="other_achievements"
                      className="nic-input"
                      rows="2"
                      value={formData.other_achievements}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="nic-form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label className="nic-label">Update Profile Picture</label>
                    <input
                      type="file"
                      name="profile_picture"
                      className="nic-input"
                      onChange={handleChange}
                      accept="image/jpeg,image/png,image/jpg"
                      style={{ padding: "6px" }}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="nic-modal-footer">
          <button
            type="button"
            className="nic-btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="mt-form"
            className="nic-btn-primary"
            disabled={submitting || fetchingDetail}
          >
            {submitting ? (
              <>
                <FaSpinner
                  className="nic-spin"
                  style={{ marginRight: "6px" }}
                />{" "}
                Saving...
              </>
            ) : (
              <>
                <FaSave style={{ marginRight: "6px" }} />{" "}
                {isUpdate ? "Update Profile" : "Register Trainer"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .nic-modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; padding: 20px; box-sizing: border-box;
        }

        .nic-modal-container {
          background-color: #ffffff;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          display: flex; flex-direction: column;
          max-height: 90vh;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .nic-modal-header {
          background-color: #1e3a8a;
          color: #ffffff;
          padding: 16px 24px;
          display: flex; justify-content: space-between; align-items: center;
          border-radius: 8px 8px 0 0;
        }

        .nic-modal-title { margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; }
        .nic-modal-close-btn { background: transparent; border: none; color: #ffffff; font-size: 18px; cursor: pointer; opacity: 0.8; }
        .nic-modal-close-btn:hover { opacity: 1; }

        .nic-modal-body { padding: 24px; overflow-y: auto; background-color: #f8fafc; }

        .nic-alert-danger {
          background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b;
          padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;
          font-size: 14px; font-weight: 500; display: flex; align-items: center;
        }

        .nic-form-section {
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;
          padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }

        .nic-section-title {
          margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #334155;
          border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;
        }

        .nic-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
        @media (max-width: 600px) { .nic-form-grid { grid-template-columns: 1fr; } }

        .nic-form-group { display: flex; flex-direction: column; gap: 6px; }
        .nic-label { font-size: 13px; font-weight: 600; color: #475569; }
        .nic-required { color: #ef4444; margin-left: 2px; }

        .nic-input, .nic-select {
          padding: 10px 12px; font-size: 14px; border: 1px solid #94a3b8; border-radius: 4px;
          background-color: #ffffff; color: #1e293b; width: 100%; box-sizing: border-box;
        }
        .nic-input:focus, .nic-select:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }
        .nic-input:disabled, .nic-select:disabled { background-color: #e2e8f0; color: #94a3b8; cursor: not-allowed; }

        /* Security Toggles */
        .nic-checkbox-label {
          display: flex; align-items: flex-start; gap: 12px; padding: 14px;
          border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;
          background: #ffffff; transition: all 0.2s;
        }
        .nic-checkbox-label.alert-danger { border-color: #fecaca; background: #fef2f2; }
        .nic-checkbox { margin-top: 3px; width: 18px; height: 18px; cursor: pointer; accent-color: #1e3a8a; }
        .nic-checkbox-text { display: flex; flex-direction: column; gap: 4px; }
        .nic-checkbox-text strong { font-size: 14px; color: #0f172a; display: flex; align-items: center; gap: 6px; }
        .nic-checkbox-text span { font-size: 12px; color: #64748b; }

        .nic-modal-footer {
          padding: 16px 24px; background-color: #ffffff; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 8px 8px;
        }

        .nic-btn-secondary {
          background-color: #ffffff; color: #475569; border: 1px solid #cbd5e1;
          padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .nic-btn-secondary:hover:not(:disabled) { background-color: #f1f5f9; color: #0f172a; }

        .nic-btn-primary {
          background-color: #1e3a8a; color: #ffffff; border: 1px solid #1e3a8a;
          padding: 8px 20px; border-radius: 4px; font-size: 14px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
        }
        .nic-btn-primary:hover:not(:disabled) { background-color: #1e40af; }
        .nic-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .nic-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
