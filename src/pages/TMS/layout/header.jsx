import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import prernaLogo from "../../../assets/prernaHd.png";
import upGovtLogo from "../../../assets/UpgovNoBgImg.png";
import emblemLogo from "../../../assets/EmblemOfndia.png";
import TopNav from "./tms_TopNav";
import { TMS_API } from "../../../api/axios";

/* ================= VALIDATION ================= */

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;

const Header = () => {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [mustChange, setMustChange] = useState(false);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  /* ================= GET STATUS ================= */

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await TMS_API.firstLogin.status(); // ✅ GET API

        if (res?.data?.must_change_password) {
          setMustChange(true);
          setShowModal(true); // auto open
        }
      } catch (err) {
        console.error("Status error:", err);
      }
    };

    fetchStatus();
  }, []);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    /* live validation */
    if (e.target.name === "newPassword") {
      if (!passwordRegex.test(updated.newPassword)) {
        setErrors({
          ...errors,
          newPassword:
            "8–12 chars, uppercase, lowercase, number & special char required",
        });
      } else {
        setErrors({ ...errors, newPassword: "" });
      }
    }

    if (e.target.name === "confirmPassword") {
      if (updated.confirmPassword !== updated.newPassword) {
        setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      } else {
        setErrors({ ...errors, confirmPassword: "" });
      }
    }
  };

  /* ================= VERIFY OLD PASSWORD ================= */

  const verifyOldPassword = async () => {
    if (!form.oldPassword) {
      alert("Enter old password");
      return;
    }

    try {
      await TMS_API.firstLogin.verifyPassword({
        old_password: form.oldPassword,
      });

      alert("Old password verified");
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Old password incorrect");
    }
  };

  /* ================= CHANGE PASSWORD ================= */

  const handleSubmit = async () => {
    const newErrors = {};

    if (!passwordRegex.test(form.newPassword)) {
      newErrors.newPassword =
        "8–12 chars, uppercase, lowercase, number & special char required";
    }

    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await TMS_API.firstLogin.changePassword({
        new_password: form.newPassword,
      });

      alert("Password changed successfully");

      setShowModal(false);
      setStep(1);
      setMustChange(false);

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <header className="header">
      {/* LEFT */}
      <div className="header-left">
        <img src={prernaLogo} alt="" className="prerna-logo" />
        <div className="gov-text">
          <span className="pragati-text">PRAGATI SETU</span>
          <span className="header-title">Training Management System</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="header-right-container">
        <div className="bottom-row">
          <div className="logo-group">
            <img src={upGovtLogo} alt="" className="up-logo" />
            <img src={emblemLogo} alt="" className="stumb" />
          </div>

          <div className="nav-actions">
            <TopNav />

            {/* ✅ ONLY WHEN TRUE */}
            {mustChange && (
              <button
                className="change-pass-btn"
                onClick={() => setShowModal(true)}
              >
                Change Password
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>

            {step === 1 && (
              <>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  value={form.oldPassword}
                  onChange={handleChange}
                />

                <div className="modal-actions">
                  <button onClick={verifyOldPassword}>Verify</button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && (
                  <div className="error-text">{errors.newPassword}</div>
                )}

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="error-text">{errors.confirmPassword}</div>
                )}

                <div className="modal-actions">
                  <button onClick={handleSubmit}>Submit</button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= STYLES ================= */}

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 24px;
          color: white;
          background: linear-gradient(90deg,#002073,#0093e1);
          min-height: 70px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .prerna-logo {
          height: 50px;
        }

        .gov-text {
          display: flex;
          flex-direction: column;
        }

        .pragati-text {
          color: #ffd700;
          font-size: 13px;
        }

        .header-title {
          font-size: 20px;
        }

        .bottom-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-group img {
          height: 48px;
          width: 48px;
          background: white;
          border-radius: 50%;
          padding: 5px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .change-pass-btn {
          background: #fd7302;
          color: #fff;
          border: none;
          padding: 7px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
        }

        .modal {
          background: white;
          padding: 16px;
          border-radius: 10px;
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal input {
          padding: 9px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .modal-actions button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .modal-actions button:first-child {
          background: #fd7302;
          color: #fff;
        }

        .modal-actions button:last-child {
          background: #ccc;
        }

        .error-text {
          font-size: 12px;
          color: red;
        }
      `}</style>
    </header>
  );
};

export default Header;
