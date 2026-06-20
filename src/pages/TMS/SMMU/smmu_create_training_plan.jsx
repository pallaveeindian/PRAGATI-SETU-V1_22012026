// src/pages/TMS/SMMU/smmu_create_training_plan.jsx
import React, { useContext, useEffect, useState } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import TmsLeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getCanonicalRole,
  ROLE_WELCOME_MESSAGES,
} from "../../../utils/roleUtils";

const GEOSCOPE_KEY = "ps_user_geoscope";

export default function SmmuCreateTrainingPlan() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";
  const navigate = useNavigate();
  const location = useLocation();

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [effectiveUserId, setEffectiveUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userTheme, setUserTheme] = useState(null);
  const [message, setMessage] = useState(null);

  // Check if we arrived here to edit an existing plan
  const editPlanData = location.state?.editPlan || null;
  const isEditing = Boolean(editPlanData);

  const [form, setForm] = useState({
    training_name: "",
    type_of_training: "OTHER",
    level_of_training: "",
    no_of_days: "",
    cadre_selection_authority: "",
  });

  // ----------------------------------------
  // RESOLVE USER ID
  // ----------------------------------------
  async function resolveUserId() {
    const candidate = user?.id ?? user?.user_id ?? user?.TH_urid ?? null;
    if (candidate) {
      setEffectiveUserId(candidate);
      return candidate;
    }
    try {
      const raw = window.localStorage.getItem(GEOSCOPE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user_id) {
          setEffectiveUserId(parsed.user_id);
          return parsed.user_id;
        }
      }
    } catch (e) {}

    const uid = user?.id ?? user?.user_id ?? null;
    if (uid) {
      try {
        const res = await LOOKUP_API.userGeoscopeByUserId(uid);
        const payload = res?.data ?? res;
        if (payload) {
          try {
            window.localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(payload));
          } catch (e) {}
          if (payload.user_id) {
            setEffectiveUserId(payload.user_id);
            return payload.user_id;
          }
        }
      } catch (e) {}
    }
    setEffectiveUserId(uid);
    return uid;
  }

  // ----------------------------------------
  // FETCH USER THEME
  // ----------------------------------------
  async function fetchUserTheme(userId) {
    try {
      setLoading(true);
      const resp = await TMS_API.trainingThemes.list({
        expert: userId,
        limit: 1,
      });
      const data = resp?.data ?? resp;
      const results = data?.results || [];
      if (results.length > 0) {
        setUserTheme(results[0]);
      }
    } catch (error) {
      console.error("Failed to fetch theme", error);
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------
  // FETCH EXISTING SCOPE FOR EDIT
  // ----------------------------------------
  async function fetchExistingScope(planId) {
    try {
      const resp = await TMS_API.trpUserScopes.list({
        training_id: planId,
        limit: 1,
      });
      const data = resp?.data ?? resp;
      const results = data?.results || [];
      if (results.length > 0) {
        setForm((f) => ({
          ...f,
          cadre_selection_authority: String(results[0].user_role_id),
        }));
      }
    } catch (error) {
      console.warn("Failed to fetch existing scope", error);
    }
  }

  // ----------------------------------------
  // INITIAL LOAD
  // ----------------------------------------
  useEffect(() => {
    (async () => {
      const uid = await resolveUserId();
      if (uid) {
        fetchUserTheme(uid);
      }

      if (isEditing && editPlanData) {
        // SURGICAL FIX: Force uppercase to match HTML <option> values exactly
        const safeType = editPlanData.type_of_training
          ? editPlanData.type_of_training.toUpperCase().replace("-", " ")
          : "OTHER";

        const safeLevel = editPlanData.level_of_training
          ? editPlanData.level_of_training.toUpperCase().replace("/", "_")
          : "";

        setForm({
          training_name: editPlanData.training_name || "",
          type_of_training: safeType,
          level_of_training: safeLevel,
          no_of_days: editPlanData.no_of_days || "",
          cadre_selection_authority: "", // Wait for secondary fetch below
        });
        await fetchExistingScope(editPlanData.id);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // ----------------------------------------
  // HANDLE INPUT
  // ----------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ----------------------------------------
  // CREATE OR UPDATE TRAINING PLAN
  // ----------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.training_name.trim()) {
      alert("Training name is required");
      return;
    }
    if (!form.level_of_training) {
      alert("Please select level");
      return;
    }
    if (!form.no_of_days) {
      alert("Please enter no of days");
      return;
    }
    if (!form.cadre_selection_authority) {
      alert("Please select who can select cadre for this plan");
      return;
    }
    if (!userTheme?.id && !isEditing) {
      alert("Theme not found for logged in user");
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const planPayload = {
        training_name: form.training_name,
        type_of_training: form.type_of_training,
        level_of_training: form.level_of_training,
        no_of_days: Number(form.no_of_days),
        approval_status: "SANCTIONED",
      };

      let currentPlanId = null;

      if (isEditing) {
        // UPDATE Existing Plan
        planPayload.updated_by = effectiveUserId;
        const res = await TMS_API.trainingPlans.partialUpdate(
          editPlanData.id,
          planPayload,
        );
        const data = res?.data ?? res;
        currentPlanId = data.id || editPlanData.id;

        // Cleanup old scopes before creating new one
        try {
          const scopeResp = await TMS_API.trpUserScopes.list({
            training_id: currentPlanId,
            limit: 100,
          });
          const scopes = scopeResp?.data?.results || scopeResp?.data || [];
          for (const sc of scopes) {
            await TMS_API.trpUserScopes.destroy(sc.id);
          }
        } catch (err) {
          console.warn("Failed deleting old scopes during update", err);
        }
      } else {
        // CREATE New Plan
        planPayload.created_by = effectiveUserId;
        planPayload.theme = userTheme.id;
        const res = await TMS_API.trainingPlans.create(planPayload);
        const data = res?.data ?? res;
        currentPlanId = data.id;
      }

      if (!currentPlanId) throw new Error("Plan ID not returned by API");

      // 2. Create new TRPUserScope row
      const scopePayload = {
        user_role_id: Number(form.cadre_selection_authority),
        training_id: currentPlanId,
        created_by: effectiveUserId,
      };
      await TMS_API.trpUserScopes.create(scopePayload);

      setMessage({
        type: "success",
        text: isEditing
          ? "Training plan updated successfully."
          : "Training plan and Scope created successfully.",
      });

      if (!isEditing) {
        setForm({
          training_name: "",
          type_of_training: "OTHER",
          level_of_training: "",
          no_of_days: "",
          cadre_selection_authority: "",
        });
      }

      setTimeout(() => {
        navigate("/tms/smmu/list-training-plans");
      }, 1200);
    } catch (error) {
      console.error("Failed saving training plan", error);
      setMessage({
        type: "error",
        text: isEditing
          ? "Failed to update training plan."
          : "Failed to create training plan.",
      });
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <>
      <style>{`
        .smmu-page-wrapper {
          min-height: 100vh;
          background: #f4f6f9;
          display: flex;
          flex-direction: column;
        }
        .content-area {
          display: flex;
          flex: 1;
        }
        .main-area {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .smmu-main-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          min-width: 0;
        }
        .page-header {
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          text-align: center;
        }
        .form-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          padding: 24px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .form-input,
        .form-select {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
          background: white;
        }
        .form-input:focus,
        .form-select:focus {
          border-color: #2563eb;
        }
        .theme-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 14px;
          color: #1e3a8a;
          font-weight: 600;
        }
        .submit-btn {
          background: #003385;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #00296d;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .message {
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
        }
        .message.success {
          background: #dcfce7;
          color: #166534;
        }
        .message.error {
          background: #fee2e2;
          color: #991b1b;
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 18px;
          }
          .page-title {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="app-shell smmu-page-wrapper">
        <Header />

        <div className="content-area">
          <TmsLeftNav
            collapsed={navCollapsed}
            onToggle={() => setNavCollapsed((v) => !v)}
          />

          <div className="main-area">
            <main className="smmu-main-content">
              {/* HEADER */}
              <div className="page-header">
                <div className="form-card">
                  <h1 className="page-title">
                    {isEditing
                      ? "Edit Training Module"
                      : "Add NEW Training Module"}
                  </h1>
                </div>
              </div>

              {/* FORM */}
              <div className="form-card">
                {message && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    {/* THEME */}
                    <div className="form-group full-width">
                      <label className="form-label">Assigned Theme</label>
                      <div className="theme-box">
                        {/* SURGICAL FIX: Rely on the freshly fetched userTheme for both Add and Edit */}
                        {loading
                          ? "Loading theme..."
                          : userTheme?.theme_name || "No Theme Assigned"}
                      </div>
                    </div>

                    {/* TRAINING NAME */}
                    <div className="form-group full-width">
                      <label className="form-label">
                        {isEditing
                          ? "Training Module Name"
                          : "New Training Module Name"}
                      </label>
                      <input
                        type="text"
                        name="training_name"
                        className="form-input"
                        placeholder="Please enter the name of Training Module here"
                        value={form.training_name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* TYPE */}
                    <div className="form-group">
                      <label className="form-label">
                        Which Type of Training is this?
                      </label>
                      <select
                        name="type_of_training"
                        className="form-select"
                        value={form.type_of_training}
                        onChange={handleChange}
                      >
                        <option value="RES">Residential</option>
                        <option value="NON RES">Non-residential</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* LEVEL */}
                    <div className="form-group">
                      <label className="form-label">
                        At what Level this module will be implemented?
                      </label>
                      <select
                        name="level_of_training"
                        className="form-select"
                        value={form.level_of_training}
                        onChange={handleChange}
                      >
                        <option value="">Select Level</option>
                        <option value="VILLAGE">Village</option>
                        <option value="SHG">SHG</option>
                        <option value="CLF">CLF</option>
                        <option value="BLOCK">Block</option>
                        <option value="BLOCK_DISTRICT">Block/District</option>
                        <option value="CMTC/BLOCK">CMTC/Block</option>
                        <option value="DISTRICT">District</option>
                        <option value="STATE">State</option>
                        <option value="WITHIN_STATE">Within State</option>
                        <option value="OUTSIDE_STATE">Outside State</option>
                      </select>
                    </div>

                    {/* DAYS */}
                    <div className="form-group">
                      <label className="form-label">
                        What will be the Duration of this Module? (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        name="no_of_days"
                        className="form-input"
                        placeholder="Duration in days"
                        value={form.no_of_days}
                        onChange={handleChange}
                      />
                    </div>

                    {/* CADRE SELECTION AUTHORITY */}
                    <div className="form-group">
                      <label className="form-label">
                        Who has the authority to select Cadre for this Module?
                      </label>
                      <select
                        name="cadre_selection_authority"
                        className="form-select"
                        value={form.cadre_selection_authority}
                        onChange={handleChange}
                      >
                        <option value="">Select Role</option>
                        <option value="1">
                          BMMU (Block Mission Management Unit)
                        </option>
                        <option value="2">
                          DMMU (District Mission Management Unit)
                        </option>
                        <option value="3">
                          SMMU (State Mission Management Unit)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div style={{ marginTop: 24 }}>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : isEditing
                          ? "Update Training Plan"
                          : "Create Training Plan"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="submit-btn"
                        style={{ background: "#6b7280", marginLeft: 12 }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
