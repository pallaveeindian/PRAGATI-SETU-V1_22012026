// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

import psLogo from "../assets/PS_lolo.png";
import bmsLogo from "../assets/bms_logo.png";
import tmsLogo from "../assets/tms_logo.png";
import ldmsLogo from "../assets/ldms_logo.png";
import esmLogo from "../assets/ems_logo.png";

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
  bmmu: "/ldms/bmmu/dashboard",
  dmmu: "/ldms/dmmu/dashboard",
  smmu: "/ldms/smmu/dashboard",
  default: "/ldms",
};

const ROLE_EPSMS_ROUTE = {
  crp_record: "/epsms/crp-form/",
  default: "/epsms",
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
  12: "crp_record",  
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

const schema = yup.object({
  module: yup.string().required(),
  userType: yup.string().required("Select user type"),
  role: yup.string().when("userType", {
    is: "CRP-EP Mapping",
    then: (s) => s.notRequired(),
    otherwise: (s) => s.required("Select role"),
  }),
  username: yup.string().required("Enter username"),
  password: yup.string().required("Enter password"),
});

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [captchaImage, setCaptchaImage] = useState("");

  const [module, setModule] = useState("tms");
  const [theme, setTheme] = useState("yellow");

  const [userType, setUserType] = useState("Admin");
  const [role, setRole] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: "Admin", role: "" },
  });

  // Server side Captcha
  const loadCaptcha = async () => {
    try {
      const res = await AUTH_API.captcha();
      setCaptchaImage(res.data.image);
    } catch (err) {
      console.error("Captcha load failed", err);
    }
  };

  useEffect(() => setValue("module", module), [module, setValue]);
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
      setFailedAttempts((prev) => prev + 1);

      setCaptchaError(
        result?.error?.detail || "Login failed. Please try again.",
      );

      setCaptchaValue("");
      loadCaptcha();
      return;
    }
    setFailedAttempts(0);
    const backendUser = getUser();
    const backendRoleKey = ROLE_ID_TO_KEY[Number(backendUser.role_id)];

    /* ---- BYPASS FOR CRP-EP FORM ---- */
    if (data.userType === "CRP-EP Mapping") {
      navigate(ROLE_EPSMS_ROUTE.crp_record, { replace: true });
      return;
    }    

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
    if (module === "bms") {
      navigate("/dashboard", { replace: true });
    }

    if (module === "tms") {
      navigate(ROLE_TMS_ROUTE[backendRoleKey] || ROLE_TMS_ROUTE.default, {
        replace: true,
      });
    }

    if (module === "ldms") {
      navigate(ROLE_LDMS_ROUTE[backendRoleKey] || ROLE_LDMS_ROUTE.default, {
        replace: true,
      });
    }

    if (module === "esm") {
      alert("EMS dashboard coming soon");
    }
  };

  return (
    <div className={`login-page theme-${theme}`}>
      <LoadingModal open={loading} title="Logging in" />

      <div className="overlay">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="logo-header">
            <img src={psLogo} alt="Pragati Setu" />
          </div>

          {/* MODULE SELECTOR */}
          <div className="module-row">
            <div
              className="module-card blue"
              onMouseEnter={() => setTheme("blue")}
              onClick={() => setModule("bms")}
            >
              <img src={bmsLogo} />
              <span>BMS</span>
            </div>

            <div
              className="module-card yellow"
              onMouseEnter={() => setTheme("yellow")}
              onClick={() => setModule("tms")}
            >
              <img src={tmsLogo} />
              <span>TMS</span>
            </div>

            <div
              className="module-card red"
              onMouseEnter={() => setTheme("red")}
              onClick={() => setModule("ldms")}
            >
              <img src={ldmsLogo} />
              <span>LDMS</span>
            </div>

            <div
              className="module-card green"
              onMouseEnter={() => setTheme("green")}
              onClick={() => setModule("esm")}
            >
              <img src={esmLogo} />
              <span>EMS</span>
            </div>
          </div>

          {/* USER TYPE */}
          <label className="block-label">User Type</label>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                value="Admin"
                {...register("userType")}
                defaultChecked
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
                onChange={() => {
                  setUserType("General");
                  setRole("");
                }}
              />{" "}
              General
            </label>
            <label>
              <input
                type="radio"
                value="CRP-EP Mapping"
                {...register("userType")}
                onChange={() => {
                  setUserType("CRP-EP Mapping");
                  setRole("");
                }}
              />{" "}
              CRP-EP Mapping
            </label>
          </div>

          <label className="block-label">Role</label>
          <RoleSelector
            userType={userType}
            value={role}
            onChange={setRole}
            disabled={userType === "CRP-EP Mapping"}
          />

          <label className="block-label">Username</label>
          <input className="form-input" {...register("username")} />

          <label className="block-label">Password</label>
          <input
            className="form-input"
            type="password"
            autoComplete="off"
            {...register("password")}
          />
          {failedAttempts > 0 && failedAttempts < MAX_ATTEMPTS && (
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

              <button
                type="button"
                onClick={loadCaptcha}
                style={{ marginTop: 6 }}
              >
                Refresh
              </button>
            </div>

            <input
              type="text"
              className="form-input captcha-input"
              placeholder="Enter captcha"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
            />
          </div>

          {captchaError && <p className="error">{captchaError}</p>}

          {failedAttempts >= MAX_ATTEMPTS && (
            <div className="error">
              Password incorrect. Too many failed attempts.
            </div>
          )}
          <button className="log-in" type="submit">
            Log In
          </button>
        </form>
      </div>

      {/* ===== UI STYLES ONLY ===== */}
      <style>{`
      .login-page {
        min-height: 100vh;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Abel', sans-serif;
        background: #0f172a;
      }

      /* BACKGROUND IMAGE */
      .login-bg-image {
        position: absolute;
        inset: 0;
        background-image: url("/assets/login_bg.jpg"); /* 🔁 replace with actual bg */
        background-size: cover;
        background-position: center;
        filter: brightness(0.55);
        z-index: 0;
      }

      .overlay {
        z-index: 2;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .login-form {
        width: 460px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        padding: 36px 32px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.45);
        color: #0f172a;
      }

      .logo-header {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }

      .logo-header img {
        height:90px;
        object-fit: contain;
      }

      .con {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .block-label {
        font-size: 14px;
        font-weight: 600;
        margin-top: 6px;
        color: #0f172a;
      }

      .radio-row {
        display: flex;
        gap: 18px;
        font-size: 14px;
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
      }

      .form-input::placeholder {
        color: #64748b;
      }

      .log-in {
        margin-top: 18px;
        height: 38px;
        background: #0f172a;
        color: #ffffff;
        font-weight: 700;
        justify-content: center;
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .log-in:hover {
        background: #1e293b;
        transform: translateY(1px);
      }

      .other {
        text-align: center;
        margin-top: 12px;
      }

      .frgt-pass {
        background: transparent;
        color: #2563eb;
        font-size: 13px;
        cursor: pointer;
      }

      .frgt-pass:hover {
        text-decoration: underline;
      }

      .error {
        font-size: 12px;
        color: #dc2626;
      }
        
      .module-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-bottom: 18px;
      }

      .module-card {
        border-radius: 10px;
        padding: 12px 6px;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        transition: all 0.25s ease;

        /* --- FONT POLISH --- */
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.4px;
        color: #0f172a;

        /* soft text depth (real alternative to font-shading) */
        text-shadow: 0 1px 1px rgba(0,0,0,0.08);
      }

      .module-card img {
        height: 32px;
        margin-bottom: 4px;
      }

      .module-card svg {
        font-size: 18px;
        margin-bottom: 2px;
      }

      .module-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        text-shadow: 0 2px 4px rgba(0,0,0,0.15);
      }
        .captcha-wrapper {
  margin-top: 10px;
}

.captcha-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5f5;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
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


      /* ---- THEME BACKGROUND SWITCH ---- */
      .theme-blue.login-page {
        background: linear-gradient(135deg, #1e3a8a, #0f172a);
      }

      .theme-yellow.login-page {
        background: linear-gradient(135deg, #f59e0b, #78350f);
      }

      .theme-red.login-page {
        background: linear-gradient(135deg, #991b1b, #450a0a);
      }

      .theme-green.login-page {
        background: linear-gradient(135deg, #166534, #052e16);
      }
      .theme-blue .log-in { background: #2563eb; }
      .theme-yellow .log-in { background: #f59e0b; }
      .theme-red .log-in { background: #b91c1c; }
      .theme-green .log-in { background: #15803d; }
      
      @media (max-width: 520px) {
        .login-form {
          width: 92%;
        }
      }
    `}</style>
    </div>
  );
}
