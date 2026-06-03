// UserMgmnt/components/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUserEdit,
  FaSave,
  FaShieldAlt,
  FaExclamationTriangle,
  FaKey,
  FaUnlockAlt,
} from "react-icons/fa";

export default function UserFormModal({
  open,
  userInstance,
  onClose,
  onSave,
  submitting,
}) {
  const [formData, setFormData] = useState({
    username: "",
    recovery_email: "",
    recovery_mobile: "",
    is_active: 1,
    unlock_account: false,
    reset_password: false,
  });

  const [error, setError] = useState(null);
  // SURGICAL ADDITION: Track password string returned by API
  const [resetPasswordStr, setResetPasswordStr] = useState(null);

  // Populate form when modal opens with a specific user
  useEffect(() => {
    if (open && userInstance) {
      setFormData({
        username: userInstance.username || "",
        recovery_email: userInstance.recovery_email || "",
        recovery_mobile: userInstance.recovery_mobile || "",
        is_active:
          userInstance.is_active === 1 || userInstance.is_active === true
            ? 1
            : 0,
        unlock_account: false, // Default to false every time we open
        reset_password: false, // Default to false every time we open
      });
      setError(null);
      setResetPasswordStr(null); // SURGICAL FIX: Clear previous success screens
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, userInstance]);

  if (!open || !userInstance) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Build payload exactly as the API expects
    const payload = {
      username: formData.username,
      recovery_email: formData.recovery_email,
      recovery_mobile: formData.recovery_mobile,
      is_active: Number(formData.is_active),
    };

    // Only attach security flags if they were explicitly checked
    if (formData.unlock_account) payload.unlock_account = true;
    if (formData.reset_password) payload.reset_password = true;

    // Execute mutation from the hook
    const res = await onSave(userInstance.user_id, payload);

    if (res.success) {
      // SURGICAL FIX: Extract password and show BIG TEXT screen if reset was triggered
      // Adapts to standard API response keys (default_password, new_password, or password)
      const returnedPassword =
        res?.data?.default_password ||
        res?.data?.new_password ||
        res?.data?.password;

      if (formData.reset_password && returnedPassword) {
        setResetPasswordStr(returnedPassword);
      } else {
        onClose();
      }
    } else {
      setError(res.error);
    }
  };

  const isCurrentlyLocked =
    userInstance.is_locked === 1 || userInstance.is_locked === true;

  return (
    <div className="nic-modal-backdrop">
      <div
        className="nic-modal-container"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* MODAL HEADER */}
        <div className="nic-modal-header">
          <h3 id="modal-title" className="nic-modal-title">
            <FaUserEdit style={{ marginRight: "8px", fontSize: "1.1em" }} />
            Modify User Profile: {userInstance.username}
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

        {/* MODAL BODY */}
        {/* MODAL BODY OR SUCCESS SCREEN */}
        {resetPasswordStr ? (
          <div
            className="nic-modal-body"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <div style={{ marginBottom: "20px" }}>
              <FaShieldAlt style={{ fontSize: "56px", color: "#16a34a" }} />
            </div>
            <h2
              style={{
                color: "#166534",
                marginBottom: "12px",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              Password Reset Successful!
            </h2>
            <p
              style={{
                color: "#475569",
                marginBottom: "28px",
                fontSize: "15px",
                lineHeight: "1.5",
              }}
            >
              Please copy and share this <strong>DEFAULT</strong> password securely with{" "}
              <strong>{userInstance.username}</strong>.<br />
              They will be required to change it upon their next login.
            </p>
            <div
              style={{
                background: "#f8fafc",
                border: "3px dashed #1e3a8a",
                padding: "24px 40px",
                borderRadius: "12px",
                display: "inline-block",
                marginBottom: "36px",
              }}
            >
              <span
                style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  color: "#1e3a8a",
                  letterSpacing: "4px",
                  fontFamily: "monospace",
                  userSelect: "all", // Allows 1-click highlighting for easy copying
                }}
              >
                {resetPasswordStr}
              </span>
            </div>
            <div>
              <button
                type="button"
                className="nic-btn-primary"
                onClick={onClose}
                style={{
                  margin: "0 auto",
                  padding: "10px 32px",
                  fontSize: "16px",
                }}
              >
                Close & Finish
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="nic-modal-body">
              {error && (
                <div className="nic-alert-danger">
                  <FaExclamationTriangle style={{ marginRight: "8px" }} />
                  {error}
                </div>
              )}

              <form id="user-management-form" onSubmit={handleSubmit}>
                {/* Core Identity Section */}
                <div className="nic-form-section">
                  <h4 className="nic-section-title">Identity & Contact</h4>
                  <div className="nic-form-grid">
                    <div className="nic-form-group">
                      <label className="nic-label">Username</label>

                      <div
                        className="nic-input"
                        style={{
                          background: "#f5f5f5",
                          cursor: "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          minHeight: "42px",
                        }}
                      >
                        {formData.username || "-"}
                      </div>
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label" htmlFor="is_active">
                        Account Status <span className="nic-required">*</span>
                      </label>
                      <div
                        className="nic-input"
                        style={{
                          background: "#f5f5f5",
                          cursor: "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          minHeight: "42px",
                        }}
                      >
                        {formData.is_active === 1 ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label" htmlFor="recovery_email">
                        Recovery Email
                      </label>
                      <input
                        type="email"
                        id="recovery_email"
                        name="recovery_email"
                        className="nic-input"
                        value={formData.recovery_email}
                        onChange={handleChange}
                        placeholder="e.g., user@gov.in"
                      />
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label" htmlFor="recovery_mobile">
                        Recovery Mobile
                      </label>
                      <input
                        type="text"
                        id="recovery_mobile"
                        name="recovery_mobile"
                        className="nic-input"
                        value={formData.recovery_mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        pattern="\d{10}"
                        title="Please enter exactly 10 digits"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Actions Section */}
                <div className="nic-form-section nic-security-section">
                  <h4 className="nic-section-title text-danger">
                    <FaShieldAlt style={{ marginRight: "6px" }} /> Security
                    Actions
                  </h4>

                  <div className="nic-security-toggles">
                    {/* Only show unlock option if the account is actually locked */}
                    {isCurrentlyLocked && (
                      <label className="nic-checkbox-label alert-warning">
                        <input
                          type="checkbox"
                          name="unlock_account"
                          checked={formData.unlock_account}
                          onChange={handleChange}
                          className="nic-checkbox"
                        />
                        <div className="nic-checkbox-text">
                          <strong>
                            <FaUnlockAlt /> Unlock Account
                          </strong>
                          <span>
                            This user is currently locked out. Check this to
                            restore access.
                          </span>
                        </div>
                      </label>
                    )}

                    <label className="nic-checkbox-label alert-danger">
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
                        <span>
                          This user password will be reset to DEFAULT.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* MODAL FOOTER */}
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
                form="user-management-form"
                className="nic-btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  "Saving Changes..."
                ) : (
                  <>
                    <FaSave style={{ marginRight: "6px" }} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* STYLES: NIC GOV STANDARD */}
      <style>{`
        .nic-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
          box-sizing: border-box;
        }

        .nic-modal-container {
          background-color: #ffffff;
          width: 100%;
          max-width: 650px;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .nic-modal-header {
          background-color: #1e3a8a; /* Deep Gov Blue */
          color: #ffffff;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 8px 8px 0 0;
        }

        .nic-modal-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          letter-spacing: 0.3px;
        }

        .nic-modal-close-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .nic-modal-close-btn:hover:not(:disabled) {
          opacity: 1;
        }

        .nic-modal-body {
          padding: 24px;
          overflow-y: auto;
          background-color: #f8fafc;
        }

        .nic-alert-danger {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .nic-form-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }

        .nic-security-section {
          border-color: #fca5a5;
          background: #fffbfa;
        }

        .nic-section-title {
          margin: 0 0 16px 0;
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
          display: flex;
          align-items: center;
        }

        .text-danger {
          color: #b91c1c;
          border-bottom-color: #fecaca;
        }

        .nic-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
        }

        @media (max-width: 500px) {
          .nic-form-grid {
            grid-template-columns: 1fr;
          }
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
        }

        .nic-required {
          color: #ef4444;
          margin-left: 2px;
        }

        .nic-input,
        .nic-select {
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #94a3b8;
          border-radius: 4px;
          background-color: #ffffff;
          color: #1e293b;
          transition: all 0.2s;
        }

        .nic-input:focus,
        .nic-select:focus {
          outline: none;
          border-color: #1e3a8a;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
        }

        .nic-input:disabled {
          background-color: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }

        /* Checkbox Toggles */
        .nic-security-toggles {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nic-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          background: #ffffff;
          transition: all 0.2s;
        }

        .nic-checkbox-label.alert-warning {
          border-color: #fde047;
          background: #fefce8;
        }
        .nic-checkbox-label.alert-warning:hover { background: #fef9c3; }

        .nic-checkbox-label.alert-danger {
          border-color: #fecaca;
          background: #fef2f2;
        }
        .nic-checkbox-label.alert-danger:hover { background: #fee2e2; }

        .nic-checkbox {
          margin-top: 3px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #1e3a8a;
        }

        .nic-checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nic-checkbox-text strong {
          font-size: 14px;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nic-checkbox-text span {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Footer */
        .nic-modal-footer {
          padding: 16px 24px;
          background-color: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-radius: 0 0 8px 8px;
        }

        .nic-btn-secondary {
          background-color: #ffffff;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-btn-secondary:hover:not(:disabled) {
          background-color: #f1f5f9;
          color: #0f172a;
        }

        .nic-btn-primary {
          background-color: #1e3a8a;
          color: #ffffff;
          border: 1px solid #1e3a8a;
          padding: 8px 20px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .nic-btn-primary:hover:not(:disabled) {
          background-color: #1e40af;
          border-color: #1e40af;
          box-shadow: 0 4px 6px rgba(30, 58, 138, 0.2);
        }

        .nic-btn-primary:disabled,
        .nic-btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
