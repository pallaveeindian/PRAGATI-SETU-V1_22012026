// src/pages/LoginComps/CanteenLogin.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaUtensils } from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthContext";
import RoleSelector from "../../components/auth/RoleSelector";
import { getUser } from "../../utils/storage";
import { AUTH_API } from "../../api/axios";
import esmLogo from "../../assets/ems_logo.png";

const ROLE_CANTEEN_ROUTE = {
  bmmu: "/canteen/form",
  dmmu: "/canteen/form",
  smmu: "/canteen/form",
  default: "/canteen/form",
};

const ROLE_ID_TO_KEY = {
  1: "bmmu",
  2: "dmmu",
  3: "smmu",
  4: "training_partner",
  5: "crp_ld",
  6: "crp_ep",
  7: "master_trainer",
  8: "state_admin",
  9: "pmu_admin",
  10: "dcnrlm",
  11: "tp_contact_person",
  13: "dtp",
};

const ALLOWED_CANTEEN_ROLES = new Set(["bmmu", "dmmu", "smmu"]);

const schema = yup.object({
  userType: yup.string().required("Select user type"),
  role: yup.string().required("Select role"),
  username: yup.string().required("Enter username"),
  password: yup.string().required("Enter password"),
});

export default function CanteenLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: "Admin", role: "" },
  });

  const currentUserType = watch("userType");
  const currentRole = watch("role");

  const loadCaptcha = async () => {
    try {
      const res = await AUTH_API.captcha();
      setCaptchaImage(res.data.image);
    } catch (err) {
      console.error("Captcha load failed", err);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = async (data) => {
    setCaptchaError("");
    const result = await login({ ...data, captcha: captchaValue });

    if (!result?.success) {
      const errorDetail =
        result?.error?.detail || "Login failed. Please try again.";
      const isCaptchaIssue = errorDetail.toLowerCase().includes("captcha");

      if (!isCaptchaIssue) setFailedAttempts((prev) => prev + 1);

      setCaptchaError(errorDetail);
      setCaptchaValue("");
      loadCaptcha();
      return;
    }

    setFailedAttempts(0);
    const backendUser = getUser();
    const backendRoleKey = ROLE_ID_TO_KEY[Number(backendUser?.role_id)];

    if (backendRoleKey !== data.role) {
      alert(
        "Role mismatch detected. Please select the correct role assigned to your account.",
      );
      return;
    }

    if (!ALLOWED_CANTEEN_ROLES.has(backendRoleKey)) {
      alert(
        "Unauthorized access: Prerna Canteen module is accessible to authorized Admin cadres only.",
      );
      return;
    }

    navigate(ROLE_CANTEEN_ROUTE[backendRoleKey] || ROLE_CANTEEN_ROUTE.default, {
      replace: true,
    });
  };

  return (
    <form
      className="login-form canteen-theme"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="logo-header">
        <div className="canteen-logo-badge">
          <img src={esmLogo} alt="Prerna Canteen" className="app-logo" />
        </div>
      </div>

      <div className="form-header-text">
        <h2>
          <FaUtensils style={{ marginRight: 8, verticalAlign: "middle" }} />
          Prerna Canteen Login
        </h2>
        <p>Enter your credentials to access Canteen Management</p>
      </div>

      <label className="block-label">User Type</label>
      <div className="radio-row">
        <label className="radio-label">
          <input
            type="radio"
            value="Admin"
            checked={currentUserType === "Admin"}
            {...register("userType")}
            onChange={() => {
              setValue("userType", "Admin");
              setValue("role", "");
            }}
          />
          Admin
        </label>
      </div>

      <label className="block-label">Role</label>
      <RoleSelector
        userType={currentUserType}
        value={currentRole}
        onChange={(val) => setValue("role", val)}
      />
      {errors.role && <p className="error">{errors.role.message}</p>}

      <label className="block-label">Username</label>
      <input
        className="form-input"
        placeholder="Enter your registered username"
        autoComplete="username"
        {...register("username")}
      />
      {errors.username && <p className="error">{errors.username.message}</p>}

      <label className="block-label">Password</label>
      <div className="password-wrapper">
        <input
          className="form-input"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
        />
        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          role="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {errors.password && <p className="error">{errors.password.message}</p>}

      {failedAttempts > 0 &&
        failedAttempts < MAX_ATTEMPTS &&
        !captchaError?.toLowerCase().includes("captcha") && (
          <div className="error alert-badge">
            Wrong password. Attempts left: {MAX_ATTEMPTS - failedAttempts}
          </div>
        )}

      <label className="block-label">Captcha</label>
      <div className="captcha-wrapper">
        <div className="captcha-image">
          <img
            src={captchaImage || undefined}
            alt="Security captcha"
            style={{ width: 180, height: 50, objectFit: "contain" }}
          />
          <button
            type="button"
            onClick={loadCaptcha}
            className="captcha-refresh-btn"
          >
            Refresh
          </button>
        </div>
        <input
          type="text"
          className="form-input captcha-input"
          placeholder="ENTER CAPTCHA"
          style={{ textTransform: "uppercase" }}
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
        />
      </div>

      {captchaError && <p className="error alert-badge">{captchaError}</p>}

      {failedAttempts >= MAX_ATTEMPTS &&
        !captchaError?.toLowerCase().includes("captcha") && (
          <div className="error alert-badge">
            Password incorrect. Account temporarily locked due to too many
            failed attempts.
          </div>
        )}

      <button className="log-in canteen-btn" type="submit">
        Log In to Canteen Portal
      </button>

      <style>{`
        .login-form.canteen-theme {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .canteen-theme .logo-header {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .canteen-logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 18px;
          background: #fff5f5;
          border: 2px solid #ef4444;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.15);
        }

        .canteen-theme .app-logo {
          max-height: 52px;
          width: auto;
          object-fit: contain;
        }

        .canteen-theme .form-header-text {
          text-align: center;
          margin-bottom: 22px;
        }

        .canteen-theme .form-header-text h2 {
          margin: 0 0 6px 0;
          color: #dc2626;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .canteen-theme .form-header-text p {
          margin: 0;
          color: #6b7280;
          font-size: 13.5px;
        }

        .canteen-theme .block-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 6px;
          margin-top: 10px;
        }

        .canteen-theme .radio-row {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }

        .canteen-theme .radio-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }

        .canteen-theme .radio-label input[type="radio"] {
          accent-color: #dc2626;
          width: 17px;
          height: 17px;
        }

        .canteen-theme .form-input {
          width: 100%;
          padding: 11px 14px;
          font-size: 14px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          background-color: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .canteen-theme .form-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }

        .canteen-theme .password-wrapper {
          position: relative;
          width: 100%;
        }

        .canteen-theme .password-wrapper .form-input {
          padding-right: 42px;
        }

        .canteen-theme .eye-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .canteen-theme .eye-icon:hover {
          color: #dc2626;
        }

        .canteen-theme .captcha-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 8px;
        }

        .canteen-theme .captcha-image {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fef2f2;
          padding: 6px;
          border-radius: 8px;
          border: 1px dashed #fca5a5;
        }

        .canteen-theme .captcha-refresh-btn {
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 700;
          color: #b91c1c;
          background: #ffffff;
          border: 1.5px solid #ef4444;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .canteen-theme .captcha-refresh-btn:hover {
          background: #dc2626;
          color: #ffffff;
        }

        .canteen-theme .captcha-input {
          letter-spacing: 2px;
          font-weight: 700;
        }

        .canteen-theme .error {
          color: #b91c1c;
          font-size: 12px;
          font-weight: 600;
          margin: 4px 0 0 0;
        }

        .canteen-theme .alert-badge {
          background: #fef2f2;
          border-left: 3.5px solid #dc2626;
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .canteen-theme .log-in.canteen-btn {
          margin-top: 18px;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 15.5px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .canteen-theme .log-in.canteen-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.45);
        }

        .canteen-theme .log-in.canteen-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        }
      `}</style>
    </form>
  );
}
