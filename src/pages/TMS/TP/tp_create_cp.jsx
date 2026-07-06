// src/pages/TMS/TP/tp_cp_create.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import { FaUserEdit } from "react-icons/fa";

/* ---------------- helpers ---------------- */

const TP_SELF_PARTNER_KEY = "tms_self_partner_id_v1";

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;
  const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
  if (cached) return Number(cached);

  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });
    const pid = resp?.data?.results?.[0]?.id || null;
    if (pid) localStorage.setItem(TP_SELF_PARTNER_KEY, String(pid));
    return pid;
  } catch (err) {
    console.error("Failed to resolve TP ID", err);
    return null;
  }
}

/* ================= VALIDATIONS ================= */

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;

function validateUserForm({ username, password }, isEditMode) {
  const errors = {};

  if (!username || username.length < 5 || username.length > 20) {
    errors.username = "Username must be 5–20 characters";
  }

  if (!isEditMode && !password) {
    errors.password = "Password is strictly required for new accounts.";
  }

  if (password && !passwordRegex.test(password)) {
    errors.password =
      "Password must be 8–12 chars, include uppercase, lowercase, number & special character. No spaces allowed.";
  }

  return errors;
}

function validateCPForm({ name, mobile_number, email, address }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (name.length > 50) {
    errors.name = "Name must be max 50 characters";
  } else if (!/^[A-Za-z\s]+$/.test(name)) {
    errors.name = "Only alphabets (A–Z, a–z) and spaces are allowed";
  }

  if (!mobileRegex.test(mobile_number)) {
    errors.mobile_number = "Mobile number must be exactly 10 digits";
  }

  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format (example@domain.com)";
  }

  if (address && address.length > 150) {
    errors.address = "Address must be max 150 characters";
  }

  return errors;
}

export default function TpCreateCP() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cpId } = useParams();
  const isEditMode = Boolean(cpId);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const role = getCanonicalRole(user || {});

  const [userErrors, setUserErrors] = useState({});
  const [cpErrors, setCpErrors] = useState({});

  /* ---------------- STATES ---------------- */

  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
  });

  const [cpForm, setCpForm] = useState({
    name: "",
    mobile_number: "",
    email: "",
    address: "",
  });

  const [masterUserId, setMasterUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [partnerId, setPartnerId] = useState(null);

  /* ---------------- INIT (DTP / TP RESOLUTION) ---------------- */
  useEffect(() => {
    async function initScope() {
      if (role === "dtp") {
        try {
          const res = await TMS_API.parentPartner();
          if (res?.data?.partner_id) setPartnerId(res.data.partner_id);
        } catch (e) {
          console.error("Failed to load DTP parent partner", e);
        }
      } else {
        const pid = await resolveTrainingPartnerIdForUser(user?.id);
        setPartnerId(pid);
      }
    }

    // Only strictly needed on Create. Edit mode infers it from CP record.
    if (!isEditMode) {
      initScope();
    }
  }, [role, user, isEditMode]);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */

  useEffect(() => {
    if (!isEditMode) return;

    async function preload() {
      setLoading(true);
      try {
        const { data: cp } =
          await TMS_API.trainingPartnerContactPersons.retrieve(cpId);

        setPartnerId(cp.partner);
        setMasterUserId(cp.master_user);

        setCpForm({
          name: cp.name || "",
          mobile_number: cp.mobile_number || "",
          email: cp.email || "",
          address: cp.address || "",
        });

        if (cp.master_user) {
          const { data: mu } = await api.get(
            `/lookups/users/${cp.master_user}/`,
          );
          setUserForm({
            username: mu.username || "",
            password: "", // NEVER prefill password
          });
        }
      } catch (e) {
        console.error("Failed to preload edit data", e);
        navigate("/tms/tp/cp", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    preload();
  }, [cpId, isEditMode, navigate]);

  /* ---------------- CREATE (ONE-SHOT API) ---------------- */

  async function handleOneShotSubmit() {
    const uErrors = validateUserForm(userForm, isEditMode);
    const cErrors = validateCPForm(cpForm);
    setUserErrors(uErrors);
    setCpErrors(cErrors);

    if (Object.keys(uErrors).length > 0 || Object.keys(cErrors).length > 0) {
      setStatus("Please fix validation errors before submitting.");
      return;
    }

    if (!partnerId) {
      setStatus("Error: Training Partner Scope not resolved.");
      return;
    }

    setStatus("Creating TC ID...");
    setLoading(true);

    try {
      const payload = {
        username: userForm.username,
        password: userForm.password,
        role: 11, // Map to TC ID role
        name: cpForm.name,
        mobile_number: cpForm.mobile_number,
        email: cpForm.email,
        address: cpForm.address,
        partner: partnerId,
      };

      await api.post("/tms/tpcp/create-oneshot/", payload);

      setStatus("TC ID created successfully ✓");
      setTimeout(() => navigate("/tms/tp/cp-list"), 1500);
    } catch (e) {
      console.error(e);
      setStatus(e?.response?.data?.error || "TC ID creation failed.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UPDATE (EDIT MODE API) ---------------- */

  async function handleUserSubmit() {
    const errors = validateUserForm(userForm, isEditMode);
    setUserErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus("Please fix validation errors");
      return;
    }

    setStatus("Updating user login details…");
    try {
      const payload = {
        username: userForm.username,
        updated_by: user.id,
      };

      if (userForm.password) {
        payload.password = userForm.password;
        payload.pass_updated_by = user.id;
      }

      await api.patch(`/lookups/users/${masterUserId}/`, payload);
      setStatus("Login details updated successfully ✓");
    } catch (e) {
      console.error(e);
      setStatus("User update failed.");
    }
  }

  async function handleCPSubmit() {
    const errors = validateCPForm(cpForm);
    setCpErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus("Please fix validation errors");
      return;
    }

    setStatus("Updating TC details…");
    try {
      await TMS_API.trainingPartnerContactPersons.update(cpId, {
        ...cpForm,
        partner: partnerId,
        master_user: masterUserId,
        updated_by: user.id,
      });

      setStatus("TC details updated successfully ✓");
      setTimeout(() => navigate("/tms/tp/cp-list"), 1500);
    } catch (e) {
      console.error(e);
      setStatus("TC details update failed.");
    }
  }

  const isUserInvalid =
    Object.keys(validateUserForm(userForm, isEditMode)).length > 0;
  const isCPInvalid = Object.keys(validateCPForm(cpForm)).length > 0;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h2
                className="tp-title"
                style={{
                  color: "#2b4e72",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <FaUserEdit />
                TC ID {isEditMode ? "Update" : "Registration"} Section
              </h2>

              <div
                className="tp-card"
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "24px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  borderTop: "4px solid #3d6ba6",
                  width: "100%",
                }}
              >
                {loading ? (
                  <p style={{ color: "#64748b" }}>Processing data...</p>
                ) : (
                  <>
                    <h3
                      style={{
                        color: "#3d6ba6",
                        marginTop: 0,
                        marginBottom: "16px",
                        borderBottom: "1px solid #e4ecf5",
                        paddingBottom: "8px",
                      }}
                    >
                      Login Details
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <input
                          className="input"
                          placeholder="Username (5-20 characters)"
                          value={userForm.username}
                          disabled={isEditMode}
                          onChange={(e) => {
                            if (isEditMode) return;
                            const updated = {
                              ...userForm,
                              username: e.target.value,
                            };
                            setUserForm(updated);
                            setUserErrors(
                              validateUserForm(updated, isEditMode),
                            );
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                        {userErrors.username && (
                          <div
                            className="error-text"
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {userErrors.username}
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          className="input"
                          placeholder={
                            isEditMode
                              ? "Reset password (optional)"
                              : "Password (Required)"
                          }
                          value={userForm.password}
                          onChange={(e) => {
                            const updated = {
                              ...userForm,
                              password: e.target.value,
                            };
                            setUserForm(updated);
                            setUserErrors(
                              validateUserForm(updated, isEditMode),
                            );
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                        {userErrors.password && (
                          <div
                            className="error-text"
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {userErrors.password}
                          </div>
                        )}
                      </div>

                      {isEditMode && (
                        <button
                          className="tp-btn"
                          disabled={isUserInvalid}
                          onClick={handleUserSubmit}
                          style={{
                            alignSelf: "flex-start",
                            background: "#3d6ba6",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: isUserInvalid ? "not-allowed" : "pointer",
                            opacity: isUserInvalid ? 0.6 : 1,
                          }}
                        >
                          Update Login Details
                        </button>
                      )}
                    </div>

                    <h3
                      style={{
                        color: "#3d6ba6",
                        marginTop: "32px",
                        marginBottom: "16px",
                        borderBottom: "1px solid #e4ecf5",
                        paddingBottom: "8px",
                      }}
                    >
                      TC Profile Details
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <input
                          className="input"
                          placeholder="Full Name"
                          value={cpForm.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!/^[A-Za-z\s]*$/.test(value)) return;
                            const updated = { ...cpForm, name: e.target.value };
                            setCpForm(updated);
                            setCpErrors(validateCPForm(updated));
                          }}
                          onPaste={(e) => {
                            const pastedText = e.clipboardData.getData("text");
                            if (!/^[A-Za-z\s]+$/.test(pastedText))
                              e.preventDefault();
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                        {cpErrors.name && (
                          <div
                            className="error-text"
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {cpErrors.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          className="input"
                          placeholder="Mobile Number"
                          inputMode="numeric"
                          pattern="\d*"
                          value={cpForm.mobile_number}
                          onChange={(e) => {
                            const updated = {
                              ...cpForm,
                              mobile_number: e.target.value,
                            };
                            setCpForm(updated);
                            setCpErrors(validateCPForm(updated));
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                        {cpErrors.mobile_number && (
                          <div
                            className="error-text"
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {cpErrors.mobile_number}
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          className="input"
                          placeholder="Email Address"
                          value={cpForm.email}
                          onChange={(e) => {
                            const updated = {
                              ...cpForm,
                              email: e.target.value,
                            };
                            setCpForm(updated);
                            setCpErrors(validateCPForm(updated));
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                        {cpErrors.email && (
                          <div
                            className="error-text"
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {cpErrors.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <textarea
                          className="input"
                          placeholder="Residential/Office Address"
                          value={cpForm.address}
                          rows={3}
                          onChange={(e) => {
                            const updated = {
                              ...cpForm,
                              address: e.target.value,
                            };
                            setCpForm(updated);
                            setCpErrors(validateCPForm(updated));
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            resize: "none",
                          }}
                        />
                        {cpErrors.address && (
                          <div
                            className="error-text"
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {cpErrors.address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color:
                            status.includes("fail") || status.includes("error")
                              ? "#ef4444"
                              : "#16a34a",
                        }}
                      >
                        {status}
                      </div>

                      {isEditMode ? (
                        <button
                          className="tp-btn"
                          disabled={isCPInvalid}
                          onClick={handleCPSubmit}
                          style={{
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "6px",
                            cursor: isCPInvalid ? "not-allowed" : "pointer",
                            opacity: isCPInvalid ? 0.6 : 1,
                            fontWeight: "600",
                          }}
                        >
                          Update TC Profile
                        </button>
                      ) : (
                        <button
                          className="tp-btn"
                          disabled={isUserInvalid || isCPInvalid}
                          onClick={handleOneShotSubmit}
                          style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "6px",
                            cursor:
                              isUserInvalid || isCPInvalid
                                ? "not-allowed"
                                : "pointer",
                            opacity: isUserInvalid || isCPInvalid ? 0.6 : 1,
                            fontWeight: "600",
                          }}
                        >
                          Register TC ID
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`
        .content-area { display: flex; flex: 1; min-height: 0; }
        .main-area { flex: 1; display: flex; flex-direction: column; background: #f8fafc; min-width: 0; }
        .input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
      `}</style>
    </div>
  );
}
