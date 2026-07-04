// src/pages/TMS/TP/components/UserFormModal.jsx

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { LOOKUP_API, TMS_API } from "../../../../api/axios";
import { FaTimes, FaTrash, FaKey, FaSave } from "react-icons/fa";

export default function UserFormModal({
  open,
  userId,
  onClose,
  onSuccess,
  openViewModalWithReset,
}) {
  const { user: authUser } = useContext(AuthContext);

  /* ---------------- geoscope ---------------- */

  async function ensureUserGeoscope() {
    try {
      const cached = JSON.parse(
        localStorage.getItem("ps_user_geoscope") || "null",
      );
      if (cached) return cached;
    } catch {}

    try {
      const resp = await LOOKUP_API.userGeoscopeByUserId(authUser.id);
      if (resp?.data) {
        localStorage.setItem("ps_user_geoscope", JSON.stringify(resp.data));
        return resp.data;
      }
    } catch {}
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [userDetails, setUserDetails] = useState(null);
  const [availableCentres, setAvailableCentres] = useState([]);

  const [form, setForm] = useState({
    username: "",
    centre_ids: [],
  });

  useEffect(() => {
    if (open && userId) {
      loadUserData();
    } else {
      setUserDetails(null);
      setForm({ username: "", centre_ids: [] });
      setAvailableCentres([]);
    }
  }, [open, userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // 1. Fetch deep user details
      const userResp = await TMS_API.userManagement.detail(userId);
      const data = userResp?.data || userResp;
      setUserDetails(data);

      // Pre-fill form
      const prefilledCentres = data.assigned_centres
        ? data.assigned_centres.map((c) => c.id)
        : [];
      setForm({
        username: data.username || "",
        centre_ids: prefilledCentres,
      });

      // 2. If user is a TPCP (role 11), fetch the list of centres they can be assigned to
      if (data.role_id === 11) {
        let centreParams = { limit: 5000 };

        // Strict Guard: If logged in user is a DTP, ONLY fetch centres for their district
        const isDTP = authUser?.role_id === 13 || authUser?.role === 13;
        if (isDTP) {
          const geoscope = await ensureUserGeoscope();
          centreParams.district = geoscope.districts[0];
        }

        const centreResp =
          await TMS_API.trainingPartnerCentres.list(centreParams);
        setAvailableCentres(
          centreResp?.data?.results || centreResp?.data || [],
        );
      }
    } catch (error) {
      console.error("Failed to load user details", error);
      alert("Failed to load user information.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (centreId, checked) => {
    setForm((prev) => {
      if (checked) {
        return { ...prev, centre_ids: [...prev.centre_ids, centreId] };
      } else {
        return {
          ...prev,
          centre_ids: prev.centre_ids.filter((id) => id !== centreId),
        };
      }
    });
  };

  const handleUpdate = async () => {
    if (!form.username.trim()) return alert("Username cannot be empty.");
    setSaving(true);
    try {
      await TMS_API.userManagement.update(userId, form);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      alert(error?.response?.data?.error || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this user account?",
      )
    )
      return;
    setDeleting(true);
    try {
      await TMS_API.userManagement.destroy(userId);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error?.response?.data?.error || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async () => {
    if (
      !window.confirm(
        "This will overwrite their password and delete their First Login Tracker. Continue?",
      )
    )
      return;
    setResetting(true);
    try {
      const resp = await TMS_API.userManagement.resetPassword(userId);
      const newPwd = resp?.data?.new_password || resp?.new_password;

      // Pass the reset payload up so the parent can render the View Modal with the new credentials
      if (openViewModalWithReset) {
        openViewModalWithReset(userDetails, {
          username: form.username,
          newPassword: newPwd,
        });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Reset failed", error);
      alert(error?.response?.data?.error || "Failed to reset password.");
    } finally {
      setResetting(false);
    }
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Manage User Profile</h3>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            disabled={saving || deleting || resetting}
          >
            <FaTimes />
          </button>
        </div>

        <div style={styles.body}>
          {loading ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              Loading profile data...
            </div>
          ) : userDetails ? (
            <>
              {/* USERNAME FIELD */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Login Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  style={styles.input}
                  disabled={saving || deleting || resetting}
                />
                <small
                  style={{
                    color: "#64748b",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  Changing the username will immediately affect the user's
                  ability to log in.
                </small>
              </div>

              {/* CENTRE ASSIGNMENT (TPCP ONLY) */}
              {userDetails.role_id === 11 && (
                <div style={{ ...styles.formGroup, marginTop: "24px" }}>
                  <label style={styles.label}>Assign Training Centres</label>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      marginBottom: "10px",
                    }}
                  >
                    Select the centres this Contact Person should manage.
                  </div>

                  <div style={styles.checkboxList}>
                    {availableCentres.length === 0 ? (
                      <div
                        style={{
                          padding: "12px",
                          color: "#94a3b8",
                          fontStyle: "italic",
                          textAlign: "center",
                        }}
                      >
                        No centres available for assignment in your
                        jurisdiction.
                      </div>
                    ) : (
                      availableCentres.map((centre) => {
                        const isChecked = form.centre_ids.includes(centre.id);
                        return (
                          <label
                            key={centre.id}
                            style={styles.checkboxItem(isChecked)}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  centre.id,
                                  e.target.checked,
                                )
                              }
                              disabled={saving || deleting || resetting}
                              style={{
                                width: "16px",
                                height: "16px",
                                cursor: "pointer",
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  color: "#1e293b",
                                  fontSize: "14px",
                                }}
                              >
                                {centre.venue_name}
                              </span>
                              {centre.district && (
                                <span
                                  style={{ fontSize: "12px", color: "#64748b" }}
                                >
                                  District ID: {centre.district}
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              style={{ color: "#ef4444", textAlign: "center", padding: "20px" }}
            >
              Failed to load data.
            </div>
          )}
        </div>

        <div style={styles.footer}>
          {/* DANGER ZONE (Left aligned) */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleDelete}
              disabled={
                loading || saving || deleting || resetting || !userDetails
              }
              style={styles.btnDanger}
            >
              <FaTrash /> {deleting ? "Deleting..." : "Delete User"}
            </button>

            <button
              onClick={handleResetPassword}
              disabled={
                loading || saving || deleting || resetting || !userDetails
              }
              style={styles.btnWarning}
            >
              <FaKey /> {resetting ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          {/* SAVE / CANCEL (Right aligned) */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              disabled={saving || deleting || resetting}
              style={styles.btnOutline}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={
                loading || saving || deleting || resetting || !userDetails
              }
              style={styles.btnPrimary}
            >
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  },
  modal: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "650px",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
  },
  title: { margin: 0, color: "#1e293b", fontSize: "18px", fontWeight: "700" },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
  },
  body: { padding: "24px", overflowY: "auto", flex: 1 },
  formGroup: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "700",
    marginBottom: "8px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "2px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    color: "#1e293b",
    transition: "border 0.2s",
  },
  checkboxList: {
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    maxHeight: "250px",
    overflowY: "auto",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
  },
  checkboxItem: (isChecked) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
    cursor: "pointer",
    background: isChecked ? "#eff6ff" : "transparent",
    transition: "background 0.2s",
  }),
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #e2e8f0",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    background: "#1e3a8a",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnOutline: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnDanger: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnWarning: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#fef3c7",
    color: "#d97706",
    fontWeight: "600",
    cursor: "pointer",
  },
};
