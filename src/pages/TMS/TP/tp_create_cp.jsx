import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";

/* ---------------- helpers ---------------- */

function generateThUrid() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  for (let i = 0; i < 11; i++) {
    body += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TH_${body}`;
}

/* ================= VALIDATIONS ================= */

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;

function validateUserForm({ username, password }) {
  const errors = {};

  if (!username || username.length < 10 || username.length > 20) {
    errors.username = "Username must be 10–20 characters";
  }

  if (password && !passwordRegex.test(password)) {
    errors.password =
      "Password must be 8–12 chars, include uppercase, lowercase, number & special character. No spaces allowed.";
  }

  return errors;
}

function validateCPForm({ name, mobile_number, email, address }) {
  const errors = {};

  // Name: only alphabets and spaces, max 50 chars
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
  const [cpExists, setCpExists] = useState(false);
  const [partnerId, setPartnerId] = useState(null);

  /* ================= NEW STATES ================= */

  const [masterUsers, setMasterUsers] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */

  useEffect(() => {
    if (!isEditMode) return;

    async function preload() {
      setLoading(true);
      try {
        const { data: cp } =
          await TMS_API.trainingPartnerContactPersons.retrieve(cpId);

        setCpExists(true);
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
        navigate("/tms/tp/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    preload();
  }, [cpId, isEditMode]);

  /* ================= FETCH MASTER USERS ================= */
  /* created_by = logged-in user */

  async function fetchMasterUsers() {
    if (!user?.id) return;

    setLoadingMasters(true);
    try {
      const resp = await api.get("/lookups/master-users/", {
        params: {
          created_by: user.id,
        },
      });

      setMasterUsers(resp.data?.results || []);
    } catch (e) {
      console.error("Failed to fetch master users", e);
    } finally {
      setLoadingMasters(false);
    }
  }

  /* Fetch master users on create mode */

  useEffect(() => {
    if (!isEditMode) {
      fetchMasterUsers();
    }
  }, [user.id, isEditMode]);

  async function fetchContactPersonByMaster(masterUserId) {
    try {
      const resp = await TMS_API.trainingPartnerContactPersons.list({
        master_user: masterUserId,
        page_size: 1,
      });

      const cp = resp?.data?.results?.[0];

      if (cp) {
        setCpExists(true);
        setPartnerId(cp.partner);
        setCpForm({
          name: cp.name || "",
          mobile_number: cp.mobile_number || "",
          email: cp.email || "",
          address: cp.address || "",
        });
      } else {
        setCpExists(false);

        setCpForm({
          name: "",
          mobile_number: "",
          email: "",
          address: "",
        });
      }
    } catch (e) {
      console.error("Failed to fetch contact person", e);
    }
  }

  /* ================= MASTER USER SELECT ================= */

  function handleMasterSelect(u) {
    setMasterUserId(u.id);

    setUserForm({
      username: u.username || "",
      password: "",
    });
    fetchContactPersonByMaster(u.id);
  }

  /* ---------------- CREATE / UPDATE USER ---------------- */

  async function handleUserSubmit() {
    const errors = validateUserForm(userForm);
    setUserErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus("Please fix validation errors");
      return;
    }

    setStatus(isEditMode ? "Updating user…" : "Creating user…");

    try {
      if (masterUserId) {
        const payload = {
          username: userForm.username,
          TH_urid: generateThUrid(),
          updated_by: user.id,
        };

        if (userForm.password) {
          payload.password = userForm.password;
          payload.pass_updated_by = user.id;
        }

        await api.put(`/lookups/users/${masterUserId}/`, payload);
      } else {
        const resp = await api.post("/lookups/users/create/", {
          username: userForm.username,
          password: userForm.password,
          role: 11,
          TH_urid: generateThUrid(),
          is_active: 1,
          is_suspended: 0,
          is_locked: 0,
          created_by: user.id,
        });

        setMasterUserId(resp.data.id);
        await fetchMasterUsers();
      }

      setStatus("User saved successfully ✓");
    } catch (e) {
      console.error(e);
      alert("User operation failed");
    }
  }

  /* ---------------- CREATE / UPDATE CP ---------------- */

  async function handleCPSubmit() {
    const errors = validateCPForm(cpForm);
    setCpErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus("Please fix validation errors");
      return;
    }

    if (!masterUserId) {
      setStatus("Please select or create a user before saving Contact Person");
      return;
    }

    setStatus(
      isEditMode ? "Updating contact person…" : "Creating contact person…",
    );

    try {
      if (isEditMode) {
        await TMS_API.trainingPartnerContactPersons.update(cpId, {
          ...cpForm,
          partner: partnerId,
          master_user: masterUserId,
          updated_by: user.id,
        });
      } else {
        const tpResp = await TMS_API.trainingPartners.list({
          search: user.id,
          fields: "id",
        });

        const tpId = tpResp?.data?.results?.[0]?.id;

        await TMS_API.trainingPartnerContactPersons.create({
          ...cpForm,
          partner: tpId,
          master_user: masterUserId,
          created_by: user.id,
        });

        await fetchContactPersonByMaster(masterUserId);
      }

      setStatus("Contact Person saved successfully ✓");
    } catch (e) {
      console.error(e);
      alert("Contact Person operation failed");
    }
  }

  const isUserInvalid = Object.keys(validateUserForm(userForm)).length > 0;
  const isCPInvalid = Object.keys(validateCPForm(cpForm)).length > 0;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />
      <div className="main-area">
        <TopNav
          left={
            <div className="app-title">
              Pragati Setu — {isEditMode ? "Edit" : "Create"} Contact Person
            </div>
          }
        />

        <main style={{ padding: 18 }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {loading ? (
              <p>Loading contact person…</p>
            ) : (
              <>
                {!isEditMode && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <h3 style={{ margin: 0 }}>Master Users</h3>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={fetchMasterUsers}
                      disabled={loadingMasters}
                    >
                      {loadingMasters ? "Refreshing…" : "Refresh"}
                    </button>
                  </div>
                )}

                {/* ================= MASTER USER LIST ================= */}
                {!isEditMode && (
                  <>
                    {/* <h3>Master Users</h3> */}

                    {loadingMasters ? (
                      <p>Loading users…</p>
                    ) : masterUsers.length === 0 ? (
                      <p>No users created by you</p>
                    ) : (
                      <div style={{ marginBottom: 16 }}>
                        {masterUsers.map((u) => (
                          <label
                            key={u.id}
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                              marginBottom: 6,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              // type="checkbox"
                              type="radio"
                              name="masterUser"
                              checked={masterUserId === u.id}
                              onChange={() => handleMasterSelect(u)}
                            />
                            <span>{u.username}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    <hr style={{ margin: "24px 0" }} />
                  </>
                )}

                <h3>Login Details</h3>

                <input
                  className="input"
                  placeholder="Username"
                  value={userForm.username}
                  disabled={isEditMode}
                  onChange={(e) => {
                    if (isEditMode) return;
                    const updated = { ...userForm, username: e.target.value };
                    setUserForm(updated);
                    setUserErrors(validateUserForm(updated));
                  }}
                />
                {userErrors.username && (
                  <div className="error-text">{userErrors.username}</div>
                )}

                <input
                  type="text"
                  className="input"
                  placeholder={
                    isEditMode ? "Reset password (optional)" : "Password"
                  }
                  value={userForm.password}
                  onChange={(e) => {
                    const updated = { ...userForm, password: e.target.value };
                    setUserForm(updated);
                    setUserErrors(validateUserForm(updated));
                  }}
                  style={{ marginTop: 8 }}
                />
                {userErrors.password && (
                  <div className="error-text">{userErrors.password}</div>
                )}

                <button
                  className="btn"
                  disabled={isUserInvalid}
                  onClick={handleUserSubmit}
                >
                  {masterUserId ? "Update User" : "Create User"}
                </button>

                <hr style={{ margin: "24px 0" }} />

                <h3>Contact Person Details</h3>

                <input
                  className="input"
                  placeholder="Name"
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
                    if (!/^[A-Za-z\s]+$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}                  
                />
                {cpErrors.name && (
                  <div className="error-text">{cpErrors.name}</div>
                )}

                <input
                  className="input"
                  placeholder="Mobile"
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
                />
                {cpErrors.mobile_number && (
                  <div className="error-text">{cpErrors.mobile_number}</div>
                )}

                <input
                  className="input"
                  placeholder="Email"
                  value={cpForm.email}
                  onChange={(e) => {
                    const updated = { ...cpForm, email: e.target.value };
                    setCpForm(updated);
                    setCpErrors(validateCPForm(updated));
                  }}
                />
                {cpErrors.email && (
                  <div className="error-text">{cpErrors.email}</div>
                )}

                <textarea
                  className="input"
                  placeholder="Address"
                  value={cpForm.address}
                  onChange={(e) => {
                    const updated = { ...cpForm, address: e.target.value };
                    setCpForm(updated);
                    setCpErrors(validateCPForm(updated));
                  }}
                />
                {cpErrors.address && (
                  <div className="error-text">{cpErrors.address}</div>
                )}

                <button
                  className="btn"
                  disabled={isCPInvalid || !masterUserId}
                  onClick={handleCPSubmit}
                >
                  {isEditMode
                    ? "Update Contact Person"
                    : "Create Contact Person"}
                </button>
                {status && (
                  <div style={{ marginTop: 10, fontSize: 13 }}>{status}</div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
