// src/pages/LoginComps/TmsLogin.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthContext";
import RoleSelector from "../../components/auth/RoleSelector";
import { getUser } from "../../utils/storage";
import { AUTH_API } from "../../api/axios";
import tmsLogo from "../../assets/TMS/tms_logo.png";

const ROLE_TMS_ROUTE = {
  bmmu: "/tms/bmmu/dashboard",
  dmmu: "/tms/dmmu/dashboard",
  smmu: "/tms/smmu/dashboard",
  training_partner: "/tms/tp/dashboard",
  dtp: "/tms/dtp/dashboard",
  tp_contact_person: "/tms/cp/dashboard",
  master_trainer: "/tms/mt/dashboard",
  default: "/tms",
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

const ADMIN_ROLE_KEYS = new Set([
  "state_admin",
  "bmmu",
  "dmmu",
  "dcnrlm",
  "smmu",
  "pmu_admin",
]);
const GENERAL_ROLE_KEYS = new Set([
  "training_partner",
  "dtp",
  "master_trainer",
  "crp_ep",
  "crp_ld",
  "tp_contact_person",
]);

const schema = yup.object({
  userType: yup.string().required("Select user type"),
  role: yup.string().required("Select role"),
  username: yup.string().required("Enter username"),
  password: yup.string().required("Enter password"),
});

export default function TmsLogin() {
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
    const backendRoleKey = ROLE_ID_TO_KEY[Number(backendUser.role_id)];

    if (backendRoleKey !== data.role) {
      alert("Role mismatch");
      return;
    }

    if (
      (data.userType === "Admin" && !ADMIN_ROLE_KEYS.has(backendRoleKey)) ||
      (data.userType === "General" && !GENERAL_ROLE_KEYS.has(backendRoleKey))
    ) {
      alert("User type mismatch");
      return;
    }

    navigate(ROLE_TMS_ROUTE[backendRoleKey] || ROLE_TMS_ROUTE.default, {
      replace: true,
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="logo-header">
        <img src={tmsLogo} alt="TMS" className="app-logo" />
      </div>

      <div className="form-header-text">
        <h2>TMS Portal</h2>
        <p>Enter your credentials to continue</p>
      </div>

      <label className="block-label">User Type</label>
      <div className="radio-row">
        <label>
          <input
            type="radio"
            value="Admin"
            {...register("userType")}
            onChange={() => {
              setValue("userType", "Admin");
              setValue("role", "");
            }}
          />{" "}
          Admin
        </label>
        <label>
          <input
            type="radio"
            value="General"
            {...register("userType")}
            onChange={() => {
              setValue("userType", "General");
              setValue("role", "");
            }}
          />{" "}
          General
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
      <input className="form-input" {...register("username")} />

      <label className="block-label">Password</label>
      <div className="password-wrapper">
        <input
          className="form-input"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          {...register("password")}
        />
        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {failedAttempts > 0 &&
        failedAttempts < MAX_ATTEMPTS &&
        !captchaError?.toLowerCase().includes("captcha") && (
          <div className="error">
            Wrong password. Attempts left: {MAX_ATTEMPTS - failedAttempts}
          </div>
        )}

      <label className="block-label">Captcha</label>
      <div className="captcha-wrapper">
        <div className="captcha-image">
          <img
            src={captchaImage || undefined}
            alt="captcha"
            style={{ width: 180, height: 50 }}
          />
          <button type="button" onClick={loadCaptcha}>
            Refresh
          </button>
        </div>
        <input
          type="text"
          className="form-input captcha-input"
          placeholder="Enter captcha"
          style={{ textTransform: "uppercase" }}
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
        />
      </div>

      {captchaError && <p className="error">{captchaError}</p>}

      {failedAttempts >= MAX_ATTEMPTS &&
        !captchaError?.toLowerCase().includes("captcha") && (
          <div className="error">
            Password incorrect. Too many failed attempts.
          </div>
        )}

      <button className="log-in" type="submit">
        Log In
      </button>
    </form>
  );
}
