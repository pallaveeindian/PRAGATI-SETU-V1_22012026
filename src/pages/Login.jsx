// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthContext";
import RoleSelector from "../components/auth/RoleSelector";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingModal from "../components/ui/LoadingModal";
import { getUser } from "../utils/storage";
import { AUTH_API } from "../api/axios";

import {
  FaDatabase,
  FaChalkboardTeacher,
  FaMapMarkedAlt,
  FaSeedling,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import psLogo from "../assets/PS_lolo.png";
import bmsLogo from "../assets/bms_logo.png";
import tmsLogo from "../assets/TMS/tms_logo.png";
import ldmsLogo from "../assets/ldms_logo.png";
import esmLogo from "../assets/ems_logo.png";
import { text } from "@fortawesome/fontawesome-svg-core";

/* -------------------------------------------------
   ROLE → ROUTES
-------------------------------------------------- */
const ROLE_TMS_ROUTE = {
  bmmu: "/tms/bmmu/dashboard",
  dmmu: "/tms/dmmu/dashboard",
  smmu: "/tms/smmu/dashboard",
  training_partner: "/tms/tp/dashboard",
  master_trainer: "/tms/mt/dashboard",
  tp_contact_person: "/tms/cp/dashboard",
  default: "/tms",
};

const ROLE_LDMS_ROUTE = {
  bmmu: "/future-updates",
  dmmu: "/future-updates",
  smmu: "/future-updates",
  default: "/future-updates",
};

// const ROLE_EPSMS_ROUTE = {
//   crp_record: "/epsms/crp-form/",
//   default: "/epsms",
// };

const ROLE_EPSMS_ROUTE = {
  default: "/mou/dashboard",
};

const ROLE_CRP_ROUTE = {
  crp_record: "/epsms/crp-form/",
};

/* -------------------------------------------------
   ROLE ID MAP
-------------------------------------------------- */
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
  "master_trainer",
  "crp_ep",
  "crp_ld",
  "tp_contact_person",
]);

/* -------------------------------------------------
   🔥 FIXED SCHEMA
-------------------------------------------------- */
const schema = yup.object({
  userType: yup.string().required("Select user type"),
  role: yup.string().when("userType", {
    is: (val) => val !== "CRP-EP Mapping",
    then: (schema) => schema.required("Select role"),
    otherwise: (schema) => schema.notRequired(),
  }),
  username: yup.string().required("Enter username"),
  password: yup.string().required("Enter password"),
});

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeModule = searchParams.get("module") || "tms";

  const [captchaImage, setCaptchaImage] = useState("");
  const [module, setModule] = useState(activeModule);
  const [theme, setTheme] = useState("yellow");

  const [userType, setUserType] = useState("Admin");
  const [role, setRole] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isEPSMS = module === "epsms";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: "Admin", role: "" },
  });

  const loadCaptcha = async () => {
    try {
      const res = await AUTH_API.captcha();
      setCaptchaImage(res.data.image);
    } catch (err) {
      console.error("Captcha load failed", err);
    }
  };

  // Sync state when URL params change
  useEffect(() => {
    setModule(activeModule);
    setValue("module", activeModule);

    switch (activeModule) {
      case "bms":
        setTheme("yellow");
        setUserType("Admin");
        break;
      case "tms":
        setTheme("blue");
        setUserType("Admin");
        break;
      case "ldms":
        setTheme("red");
        setUserType("Admin");
        break;
      case "esm":
        setTheme("green");
        setUserType("Admin");
        break;
      // case "crp":
      //   setTheme("gr-een");
      //   setUserType("CRP-EP Mapping");
      //   break;

      case "crp":
        setTheme("green");
        setUserType("CRP-EP Mapping");
        break;

      // case "epsms":
      //   setTheme("purple");
      //   setUserType("CRP-EP Mapping");
      //   break;
      case "epsms":
        setTheme("purple");
        setUserType("Admin");
        setRole("");
        break;

      default:
        setTheme("yellow");
        setUserType("Admin");
    }
  }, [activeModule, setValue]);

  useEffect(() => setValue("userType", userType), [userType, setValue]);
  useEffect(() => setValue("role", role), [role, setValue]);

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = async (data) => {
    setCaptchaError("");

    const result = await login({
      ...data,
      captcha: captchaValue,
    });

    if (!result?.success) {
      const errorDetail =
        result?.error?.detail || "Login failed. Please try again.";
      const isCaptchaIssue = errorDetail.toLowerCase().includes("captcha");

      // 🔥 EXTREME PRECISION CHANGE: Only increment if NOT a captcha error
      if (!isCaptchaIssue) {
        setFailedAttempts((prev) => prev + 1);
      }

      setCaptchaError(errorDetail);
      setCaptchaValue("");
      loadCaptcha();
      return;
    }

    setFailedAttempts(0);

    // 🔥 CRP-EP DIRECT BYPASS
    // if (data.userType === "CRP-EP Mapping" || module === "crp") {
    //   navigate(ROLE_EPSMS_ROUTE.crp_record, { replace: true });
    //   return;
    // }

    if (module === "crp") {
      navigate(ROLE_CRP_ROUTE.crp_record, {
        replace: true,
      });
      return;
    }

    if (module === "epsms") {
      navigate(ROLE_EPSMS_ROUTE.default, {
        replace: true,
      });
      return;
    }

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

    // Module-specific routing
    if (module === "bms") {
      navigate("/dashboard", { replace: true });
    } else if (module === "tms") {
      navigate(ROLE_TMS_ROUTE[backendRoleKey] || ROLE_TMS_ROUTE.default, {
        replace: true,
      });
    } else if (module === "ldms") {
      navigate(ROLE_LDMS_ROUTE[backendRoleKey] || ROLE_LDMS_ROUTE.default, {
        replace: true,
      });
    } else if (module === "esm") {
      alert("EMS dashboard coming soon");
    }
  };

  return (
    <div className={`login-page theme-${theme}`}>
      <LoadingModal open={loading} title="Logging in" />

      <div className="overlay">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="logo-header">
            {/* <img src={psLogo} alt="Pragati Setu" className="main-logo" /> */}
            {/* Dynamic Module Logo */}
            {module === "bms" && (
              <img src={bmsLogo} alt="BMS" className="app-logo" />
            )}
            {module === "tms" && (
              <img src={tmsLogo} alt="TMS" className="app-logo" />
            )}
            {module === "ldms" && (
              <img src={ldmsLogo} alt="LDMS" className="app-logo" />
            )}
            {module === "esm" && (
              <img src={esmLogo} alt="EMS" className="app-logo" />
            )}
            {/* {module === "crp" && (
              <img src={esmLogo} alt="EMS" className="app-logo" />
            )} */}
            {module === "crp" && (
              <img src={esmLogo} alt="CRP" className="app-logo" />
            )}

            {module === "epsms" && (
              <img src={esmLogo} alt="EPSMS" className="app-logo" />
            )}
          </div>

          <div className="form-header-text">
            {/* <h2>
              {module === "crp"
                ? "CRP-EP Mapping Login"
                : `${module.toUpperCase()} Portal`}
            </h2> */}

            <h2>
              {module === "crp"
                ? "CRP-EP Mapping Login"
                : module === "epsms"
                  ? "EPSMS Portal"
                  : `${module.toUpperCase()} Portal`}
            </h2>

            <p>Enter your credentials to continue</p>
          </div>

          {/* Hide user type and role if CRP is explicitly selected via URL */}
          {/* {module !== "crp" && (
            <>
              <label className="block-label">User Type</label>
              <div className="radio-row">
                <label>
                  <input
                    type="radio"
                    value="Admin"
                    {...register("userType")}
                    checked={userType === "Admin"}
                    onChange={() => {
                      setUserType("Admin");
                      setRole("");
                    }}
                  />{" "}
                  Admin
                </label>
                <label>
                  <input
                    type="radio"
                    value="General"
                    {...register("userType")}
                    checked={userType === "General"}
                    onChange={() => {
                      setUserType("General");
                      setRole("");
                    }}
                  />{" "}
                  General
                </label>
              </div>

              <label className="block-label">Role</label>
              <RoleSelector
                userType={userType}
                value={role}
                onChange={setRole}
                disabled={userType === "CRP-EP Mapping"}
              />

              {errors.role && userType !== "CRP-EP Mapping" && (
                <p className="error">{errors.role.message}</p>
              )}
            </>
          )} */}

          {module !== "crp" && (
            <>
              <label className="block-label">User Type</label>

              <div className="radio-row">
                {/* EPSMS → ONLY ADMIN */}
                <label>
                  <input
                    type="radio"
                    value="Admin"
                    {...register("userType")}
                    checked={userType === "Admin"}
                    onChange={() => {
                      setUserType("Admin");
                      setRole("");
                    }}
                  />{" "}
                  Admin
                </label>

                {!isEPSMS && (
                  <label>
                    <input
                      type="radio"
                      value="General"
                      {...register("userType")}
                      checked={userType === "General"}
                      onChange={() => {
                        setUserType("General");
                        setRole("");
                      }}
                    />{" "}
                    General
                  </label>
                )}
              </div>

              <label className="block-label">Role</label>

              <RoleSelector
                userType={isEPSMS ? "Admin" : userType}
                value={role}
                onChange={setRole}
                disabled={false}
              />

              {errors.role && <p className="error">{errors.role.message}</p>}
            </>
          )}

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
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* 🔥 EXTREME PRECISION CHANGE: Hide wrong password error if the current error is captcha-related */}
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

          {/* 🔥 EXTREME PRECISION CHANGE: Hide wrong password max attempts error if the current error is captcha-related */}
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
      </div>
      <style>{`
      .login-page {
        min-height: 100vh;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Abel', sans-serif;
        background: #0f172a;
        transition: background 0.6s ease;
      }

      .overlay {
        z-index: 2;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      /* BASE FORM STYLES */
      .login-form {
        width: 460px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 36px 32px;
        color: #0f172a;
        transition: all 0.5s ease;
      }

      .logo-header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
      }

      .logo-header .main-logo {
        height: 75px;
      }
      
      .logo-header .app-logo {
        height: 150px;
        object-fit: contain;
        margin-bottom: 20px;
      }

      .form-header-text {
        text-align: center;
        margin-bottom: 24px;
      }

      .form-header-text h2 {
        margin: 0 0 4px 0;
        font-size: 22px;
        font-weight: 700;
        color: #1e293b;
      }

      .form-header-text p {
        margin: 0;
        font-size: 14px;
        color: #64748b;
      }

      .block-label {
        font-size: 14px;
        font-weight: 600;
        margin-top: 12px;
        color: #0f172a;
        display: block;
        margin-bottom: 6px;
      }

      .radio-row {
        display: flex;
        gap: 18px;
        font-size: 14px;
        margin-bottom: 12px;
      }

      .form-input {
        height: 46px;
        width: 100%;
        padding: 0 14px;
        border-radius: 6px;
        border: 1px solid #cbd5f5;
        font-size: 14px;
        color: #0f172a;
        background: #ffffff;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .form-input:focus {
        outline: none;
      }

      .form-input::placeholder {
        color: #64748b;
      }

      .log-in {
        margin-top: 24px;
        height: 44px;
        color: #ffffff;
        font-weight: 700;
        font-size: 16px;
        justify-content: center;
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
      }

      .error {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(135deg, #ff0000, #dc2626);
        margin-top: 8px;
        padding: 12px 16px;
        border-radius: 10px;
        border: 3px solid #7f1d1d;
        box-shadow:
          0 0 12px rgba(255, 0, 0, 0.8),
          0 0 24px rgba(220, 38, 38, 0.7);
        text-align: center;
        letter-spacing: 0.5px;
        animation: errorPulse 1s infinite alternate;
      }

      @keyframes errorPulse {
        from {
          transform: scale(1);
          box-shadow:
            0 0 12px rgba(255, 0, 0, 0.8),
            0 0 24px rgba(220, 38, 38, 0.7);
        }
        to {
          transform: scale(1.03);
          box-shadow:
            0 0 20px rgba(255, 0, 0, 1),
            0 0 35px rgba(220, 38, 38, 0.9);
        }
      }

      .captcha-wrapper {
        margin-top: 10px;
      }

      .captcha-image {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8fafc;
        border: 1px solid #cbd5f5;
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 8px;
      }

      .captcha-image button {
        background: #e2e8f0;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        color: #334155;
        transition: background 0.2s;
      }
      
      .captcha-image button:hover {
        background: #cbd5e1;
      }

      .captcha-input {
        letter-spacing: 3px;
        font-weight: 600;
        text-align: center;
      }

      .captcha-image canvas {
        width: 180px !important;
        height: 50px !important;
        display: block !important;
      }

      /* password wrapper */
      .password-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .eye-icon {
        position: absolute;
        right: 12px;
        cursor: pointer;
        font-size: 16px;
        color: #64748b;
        display: flex;
        align-items: center;
      }

      .password-wrapper .form-input {
        padding-right: 40px;
      }

      .eye-icon:hover {
        color: #0f172a;
      }

      /* =========================================
         🌟 THEME-SPECIFIC CSS (DIVERSE STYLES)
      ========================================= */
      
      /* --- BLUE THEME (BMS) - Corporate & Clean --- */
      .theme-blue.login-page {
        background: linear-gradient(135deg, #1e3a8a, #0f172a);
      }
      .theme-blue .login-form {
        border-radius: 4px; /* Sharper edges */
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        border-top: 6px solid #2563eb;
      }
      .theme-blue .log-in { 
        background: #2563eb; 
        border-radius: 4px;
      }
      .theme-blue .log-in:hover { background: #1d4ed8; transform: translateY(-2px); }
      .theme-blue .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235, 0.2); }

      /* --- YELLOW THEME (TMS) - Warm & Friendly --- */
      .theme-yellow.login-page {
        background: linear-gradient(135deg, #f59e0b, #78350f);
      }
      .theme-yellow .login-form {
        border-radius: 24px; /* Very rounded */
        box-shadow: 0 30px 80px rgba(0,0,0,0.45);
      }
      .theme-yellow .log-in { 
        background: #f59e0b; 
        border-radius: 24px;
      }
      .theme-yellow .log-in:hover { background: #d97706; transform: scale(1.02); }
      .theme-yellow .form-input:focus { border-color: #f59e0b; }

      /* --- RED THEME (LDMS) - Minimalist & Intense --- */
      .theme-red.login-page {
        background: linear-gradient(135deg, #991b1b, #450a0a);
      }
      .theme-red .login-form {
        border-radius: 0px; /* Brutalist block */
        box-shadow: 12px 12px 0px rgba(0,0,0,0.8);
        border: 2px solid #000;
      }
      .theme-red .form-input { border-radius: 0; border: 1px solid #000; }
      .theme-red .log-in { 
        background: #b91c1c; 
        border-radius: 0;
        border: 2px solid #000;
      }
      .theme-red .log-in:hover { background: #991b1b; transform: translate(-2px, -2px); box-shadow: 4px 4px 0 #000;}
      .theme-red .form-input:focus { border-color: #b91c1c; }

      /* --- GREEN THEME (EMS) - Organic / Eco --- */
      .theme-green.login-page {
        background: linear-gradient(135deg, #166534, #052e16);
      }
      .theme-green .login-form {
        border-radius: 40px 10px 40px 10px; /* Leaf shape */
        box-shadow: 0 15px 35px rgba(22, 101, 52, 0.4);
      }
      .theme-green .log-in { 
        background: #15803d; 
        border-radius: 20px 5px 20px 5px;
      }
      .theme-green .log-in:hover { background: #166534; transform: translateY(2px); }
      .theme-green .form-input { border-radius: 10px 4px 10px 4px; }
      .theme-green .form-input:focus { border-color: #15803d; }

      /* --- PURPLE THEME (CRP) - Glassmorphism --- */
      .theme-purple.login-page {
        background: linear-gradient(135deg, #7e22ce, #3b0764);
      }
      .theme-purple .login-form {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.4);
        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      }
      .theme-purple .log-in { 
        background: #9333ea; 
        border-radius: 16px;
      }
      .theme-purple .log-in:hover { background: #7e22ce; box-shadow: 0 8px 20px rgba(147, 51, 234, 0.4); }
      .theme-purple .form-input { background: rgba(255,255,255,0.6); }
      .theme-purple .form-input:focus { border-color: #9333ea; background: #fff;}

      @media (max-width: 520px) {
        .login-form {
          width: 92%;
          padding: 24px 20px;
        }
      }
    `}</style>
    </div>
  );
}
