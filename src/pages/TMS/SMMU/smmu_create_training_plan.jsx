//src\pages\TMS\SMMU\smmu_create_training_plan.jsx
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

  // Recurring-plan fields
  const [isRecurringPlan, setIsRecurringPlan] = useState("no");
  const [sequenceNo, setSequenceNo] = useState("");
  const [nextPlan, setNextPlan] = useState("");
  const [availableTrainingPlans, setAvailableTrainingPlans] = useState([]);
  const [sequenceGroupName, setSequenceGroupName] = useState("");
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [existingSequence, setExistingSequence] = useState(null);

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
  // RESPONSE HELPER
  // ----------------------------------------

  function getResults(response) {
    const data = response?.data ?? response;

    if (Array.isArray(data)) {
      return data;
    }

    return Array.isArray(data?.results) ? data.results : [];
  }

  // ----------------------------------------
  // FETCH AVAILABLE TRAINING PLANS
  // ----------------------------------------

  async function fetchAvailableTrainingPlans() {
    try {
      setLoadingPlans(true);

      const response = await TMS_API.trainingPlans.list({
        limit: 1000,
      });

      const plans = getResults(response);
      setAvailableTrainingPlans(plans);

      return plans;
    } catch (error) {
      console.error(
        "Failed to fetch training plans:",
        error.response?.data || error,
      );

      setMessage({
        type: "error",
        text: "Failed to load existing training plans.",
      });

      return [];
    } finally {
      setLoadingPlans(false);
    }
  }

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

        if (parsed?.user_id) {
          setEffectiveUserId(parsed.user_id);
          return parsed.user_id;
        }
      }
    } catch (error) {
      console.warn("Could not read saved user geoscope.", error);
    }

    const uid = user?.id ?? user?.user_id ?? null;

    if (uid) {
      try {
        const response = await LOOKUP_API.userGeoscopeByUserId(uid);
        const payload = response?.data ?? response;

        if (payload) {
          try {
            window.localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(payload));
          } catch (error) {
            console.warn("Could not cache user geoscope.", error);
          }

          if (payload.user_id) {
            setEffectiveUserId(payload.user_id);
            return payload.user_id;
          }
        }
      } catch (error) {
        console.warn("Could not resolve user geoscope.", error);
      }
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

      const response = await TMS_API.trainingThemes.list({
        expert: userId,
        limit: 1,
      });

      const results = getResults(response);

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
      const response = await TMS_API.trpUserScopes.list({
        training_id: planId,
        limit: 100,
      });

      const results = getResults(response);

      if (results.length > 0) {
        setForm((previous) => ({
          ...previous,
          cadre_selection_authority: String(results[0].user_role_id ?? ""),
        }));
      }
    } catch (error) {
      console.warn("Failed to fetch existing scope", error);
    }
  }

  // ----------------------------------------
  // FETCH EXISTING RECURRING SEQUENCE
  // ----------------------------------------

  async function fetchExistingSequence(planId) {
    // Reset first so a previous sequence cannot be reused accidentally.
    setExistingSequence(null);
    setIsRecurringPlan("no");
    setSequenceNo("");
    setSequenceGroupName("");
    setNextPlan("");

    try {
      const response = await TMS_API.listTrainingPlanSequences();
      const sequences = getResults(response);

      const sequence = sequences.find((item) => {
        const linkedPlanId =
          typeof item.training_plan === "object"
            ? item.training_plan?.id
            : item.training_plan;

        return (
          Number(linkedPlanId) === Number(planId) && item.is_active !== false
        );
      });

      // No sequence means this plan is currently non-recurring.
      // It is valid to switch it to recurring while editing.
      if (!sequence) {
        return;
      }

      setExistingSequence(sequence);
      setIsRecurringPlan("yes");
      setSequenceNo(String(sequence.step_order ?? ""));
      setSequenceGroupName(sequence.sequence_group_name || "");

      const linkedNextPlan =
        typeof sequence.next_training_plan === "object"
          ? sequence.next_training_plan?.id
          : sequence.next_training_plan;

      setNextPlan(linkedNextPlan != null ? String(linkedNextPlan) : "");

      await fetchAvailableTrainingPlans();
    } catch (error) {
      console.error(
        "Failed to fetch recurring sequence:",
        error.response?.data || error,
      );

      setMessage({
        type: "error",
        text: "Failed to load recurring training plan details.",
      });
    }
  }

  // ----------------------------------------
  // INITIAL LOAD
  // ----------------------------------------

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const uid = await resolveUserId();

      if (!mounted) return;

      if (uid) {
        await fetchUserTheme(uid);
      }

      if (!mounted) return;

      if (isEditing && editPlanData) {
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
          cadre_selection_authority: "",
        });

        await Promise.all([
          fetchExistingScope(editPlanData.id),
          fetchExistingSequence(editPlanData.id),
        ]);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };

    // Run once for the selected plan when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------
  // HANDLE FORM INPUT
  // ----------------------------------------

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ----------------------------------------
  // HANDLE RECURRING PLAN TOGGLE
  // ----------------------------------------

  async function handleRecurringChange(event) {
    const value = event.target.value;

    setIsRecurringPlan(value);
    setMessage(null);

    if (value === "yes") {
      await fetchAvailableTrainingPlans();
    } else {
      setSequenceNo("");
      setSequenceGroupName("");
      setNextPlan("");
    }
  }

  // ----------------------------------------
  // HANDLE SEQUENCE NUMBER
  // ----------------------------------------

  function handleSequenceNoChange(event) {
    setSequenceNo(event.target.value);
  }

  // ----------------------------------------
  // CREATE OR UPDATE TRAINING PLAN
  // ----------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (!form.training_name.trim()) {
      window.alert("Training name is required.");
      return;
    }

    if (!form.level_of_training) {
      window.alert("Please select level.");
      return;
    }

    if (!form.no_of_days || Number(form.no_of_days) < 1) {
      window.alert("Please enter a valid number of days.");
      return;
    }

    if (!form.cadre_selection_authority) {
      window.alert("Please select who can select cadre for this plan.");
      return;
    }

    if (!isEditing && !userTheme?.id) {
      window.alert("Theme not found for logged in user.");
      return;
    }

    // Validate recurring-plan details.
    // Do not require existingSequence here:
    // No -> Yes must create a new sequence.
    if (isRecurringPlan === "yes") {
      if (!sequenceNo || Number(sequenceNo) < 1) {
        window.alert("Please select Sequence No.");
        return;
      }

      if (nextPlan && Number(nextPlan) === Number(editPlanData?.id)) {
        window.alert(
          "A training plan cannot be selected as its own next plan.",
        );
        return;
      }

      if (!sequenceGroupName.trim()) {
        window.alert("Please enter Sequence Group Name.");
        return;
      }
    }

    try {
      setSaving(true);
      setMessage(null);

      const planPayload = {
        training_name: form.training_name.trim(),
        type_of_training: form.type_of_training,
        level_of_training: form.level_of_training,
        no_of_days: Number(form.no_of_days),
        approval_status: "SANCTIONED",
      };

      let currentPlanId;

      // ----------------------------------------
      // UPDATE EXISTING TRAINING PLAN
      // OR CREATE A NEW TRAINING PLAN
      // ----------------------------------------

      if (isEditing) {
        planPayload.updated_by = effectiveUserId;

        const response = await TMS_API.trainingPlans.partialUpdate(
          editPlanData.id,
          planPayload,
        );

        const data = response?.data ?? response;
        currentPlanId = data?.id ?? editPlanData.id;

        // Preserve existing scope-update behavior.
        const scopeResponse = await TMS_API.trpUserScopes.list({
          training_id: currentPlanId,
          limit: 100,
        });

        const scopes = getResults(scopeResponse);

        for (const scope of scopes) {
          await TMS_API.trpUserScopes.destroy(scope.id);
        }
      } else {
        planPayload.created_by = effectiveUserId;
        planPayload.theme = userTheme.id;

        const response = await TMS_API.trainingPlans.create(planPayload);
        const data = response?.data ?? response;

        currentPlanId = data?.id;
      }

      if (!currentPlanId) {
        throw new Error("Training plan ID was not returned by the API.");
      }

      // ----------------------------------------
      // CREATE SCOPE
      // ----------------------------------------

      const scopePayload = {
        user_role_id: Number(form.cadre_selection_authority),
        training_id: currentPlanId,
        created_by: effectiveUserId,
      };

      await TMS_API.trpUserScopes.create(scopePayload);

      // ----------------------------------------
      // CREATE OR UPDATE RECURRING SEQUENCE
      //
      // No -> Yes: create sequence (no existing ID).
      // Yes -> Yes: send existing sequence ID.
      // No -> No: do not create a sequence.
      //
      // Uses POST /tms/tplan-sequence/create/.
      // Backend must update when an existing ID is supplied.
      // ----------------------------------------

      if (isRecurringPlan === "yes") {
        const sequencePayload = {
          sequence_group_name: sequenceGroupName.trim(),
          step_order: Number(sequenceNo),
          next_training_plan: nextPlan ? Number(nextPlan) : null,
          training_plan: Number(currentPlanId),
        };

        if (existingSequence?.id) {
          await TMS_API.createTrainingPlanSequence({
            ...sequencePayload,
            id: existingSequence.id,
          });
        } else {
          await TMS_API.createTrainingPlanSequence(sequencePayload);
        }
      }

      setMessage({
        type: "success",
        text: isEditing
          ? "Training plan updated successfully."
          : "Training plan and scope created successfully.",
      });

      if (!isEditing) {
        setForm({
          training_name: "",
          type_of_training: "OTHER",
          level_of_training: "",
          no_of_days: "",
          cadre_selection_authority: "",
        });

        setIsRecurringPlan("no");
        setSequenceNo("");
        setSequenceGroupName("");
        setNextPlan("");
        setExistingSequence(null);
      }

      window.setTimeout(() => {
        navigate("/tms/smmu/list-training-plans");
      }, 1200);
    } catch (error) {
      console.error(
        "Failed saving training plan:",
        error.response?.data || error,
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          (isEditing
            ? "Failed to update training plan."
            : "Failed to create training plan."),
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
          min-width: 0;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input,
        .form-select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
          background: white;
          color: #111827;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #2563eb;
        }

        .form-select:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
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

        .recurring-box {
          margin-top: 24px;
          padding: 18px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          background: #f9fafb;
        }

        .recurring-title {
          font-size: 17px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px;
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

        .cancel-btn {
          background: #6b7280;
          margin-left: 12px;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #4b5563;
        }

        .message {
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .message.success {
          background: #dcfce7;
          color: #166534;
        }

        .message.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .sequence-help {
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.5;
        }

        .sequence-status {
          margin-bottom: 16px;
          color: #1e3a8a;
          font-size: 13px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .smmu-main-content {
            padding: 14px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-card {
            padding: 18px;
          }

          .page-title {
            font-size: 22px;
          }

          .cancel-btn {
            margin: 12px 0 0;
          }
        }
      `}</style>

      <div className="app-shell smmu-page-wrapper">
        <Header />

        <div className="content-area">
          <TmsLeftNav
            collapsed={navCollapsed}
            onToggle={() => setNavCollapsed((value) => !value)}
          />

          <div className="main-area">
            <main className="smmu-main-content">
              <div className="page-header">
                <div className="form-card">
                  <h1 className="page-title">
                    {isEditing
                      ? "Edit Training Module"
                      : "Add NEW Training Module"}
                  </h1>
                </div>
              </div>

              <div className="form-card">
                {message && (
                  <div className={`message ${message.type}`} role="status">
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    {/* THEME */}
                    <div className="form-group full-width">
                      <label className="form-label">Assigned Theme</label>
                      <div className="theme-box">
                        {loading
                          ? "Loading theme..."
                          : userTheme?.theme_name ||
                            editPlanData?.theme_name ||
                            "No Theme Assigned"}
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
                        required
                      />
                    </div>

                    {/* TRAINING TYPE */}
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

                    {/* TRAINING LEVEL */}
                    <div className="form-group">
                      <label className="form-label">
                        At what Level this module will be implemented?
                      </label>
                      <select
                        name="level_of_training"
                        className="form-select"
                        value={form.level_of_training}
                        onChange={handleChange}
                        required
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

                    {/* DURATION */}
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
                        required
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
                        required
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

                  {/* RECURRING PLAN */}
                  <div className="recurring-box">
                    <h2 className="recurring-title">Recurring Training Plan</h2>

                    <div className="form-group">
                      <label className="form-label">
                        Is this a recurring plan?
                      </label>
                      <select
                        className="form-select"
                        value={isRecurringPlan}
                        onChange={handleRecurringChange}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    {isRecurringPlan === "yes" && (
                      <>
                        {isEditing && existingSequence && (
                          <div className="sequence-status">
                            Editing existing sequence record ID:{" "}
                            <strong>{existingSequence.id}</strong>
                          </div>
                        )}

                        <div className="form-grid" style={{ marginTop: 18 }}>
                          {/* SEQUENCE NUMBER */}
                          <div className="form-group">
                            <label className="form-label">Sequence No.</label>
                            <select
                              className="form-select"
                              value={sequenceNo}
                              onChange={handleSequenceNoChange}
                              required
                            >
                              <option value="">Select Sequence</option>
                              {Array.from(
                                { length: 10 },
                                (_, index) => index + 1,
                              ).map((number) => (
                                <option key={number} value={number}>
                                  {number}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* GROUP NAME */}
                          <div className="form-group">
                            <label className="form-label">
                              Sequence Group Name
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              value={sequenceGroupName}
                              onChange={(event) =>
                                setSequenceGroupName(event.target.value)
                              }
                              placeholder="Enter Sequence Group Name"
                              required
                            />
                          </div>

                          {/* NEXT PLAN */}
                          <div className="form-group">
                            <label className="form-label">
                              Next Training Plan
                            </label>
                            <select
                              className="form-select"
                              value={nextPlan}
                              onChange={(event) =>
                                setNextPlan(event.target.value)
                              }
                              disabled={loadingPlans}
                            >
                              <option value="">
                                {loadingPlans
                                  ? "Loading training plans..."
                                  : "Select Next Training Plan"}
                              </option>

                              {availableTrainingPlans
                                .filter(
                                  (plan) =>
                                    Number(plan.id) !==
                                    Number(editPlanData?.id),
                                )
                                .map((plan) => (
                                  <option key={plan.id} value={String(plan.id)}>
                                    {plan.training_name || `Plan ${plan.id}`}
                                  </option>
                                ))}
                            </select>

                            <div className="sequence-help">
                              Leave this empty if this is the last step in the
                              recurring sequence.
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* BUTTONS */}
                  <div style={{ marginTop: 24 }}>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={saving || loadingPlans}
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
                        className="submit-btn cancel-btn"
                        disabled={saving}
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
