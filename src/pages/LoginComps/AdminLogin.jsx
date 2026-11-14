// src/pages/LoginComps/AdminLogin.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api, { AUTH_API } from "../../api/axios"; 
import { setAuth, clearAuth } from "../../utils/storage"; 
import prernaLogo from "../../assets/BDOLogo.png";
import AdminHeader from "../AdminPages/Layout/AdminHeader";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm();

  const loadCaptcha = async () => {
    try {
      const res = await AUTH_API.captcha();
      setCaptchaImage(res.data.image);
    } catch (err) {
      console.error("Captcha load error:", err);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = async (data) => {
    setError("");

    try {
      
      clearAuth();

      
      const res = await api.post("/auth/login/", {
        username: data.username,
        password: data.password,
        captcha: captchaValue,
      }, {
        headers: { "X-App-Client": "TMS_WEB" }
      });

      const { access, user: resUser } = res.data || {};

      if (!access) {
        setError("Login response missing access token");
        setCaptchaValue("");
        loadCaptcha();
        return;
      }

      // 3. Role verify 
      if (Number(resUser?.role_id) !== 9) {
        setError("You are not authorized to access this portal.");
        setCaptchaValue("");
        loadCaptcha();
        return;
      }

      
      setAuth({ access, user: resUser });

      
      window.location.replace("/admin/dashboard");

    } catch (err) {
      const errData = err?.response?.data || { detail: "Login failed" };
      setError(errData.detail || errData.message || "Login failed");
      setCaptchaValue("");
      loadCaptcha();
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="logo-header">
        <img src={prernaLogo} alt="Support Portal" className="app-logo" />
      </div>

      <div className="form-header-text">
        <h2>Support Admin Login</h2>
        <p>PMU Admin Portal</p>
      </div>

      <label>Username</label>
      <input
        className="form-input"
        {...register("username", { required: true })}
      />

      <label>Password</label>

      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          className="form-input"
          autoComplete="off"
          {...register("password", { required: true })}
        />

        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <label>Captcha</label>

      <div className="captcha-wrapper">
        <div className="captcha-image">
          {captchaImage && (
            <img
              src={captchaImage}
              alt="captcha"
              style={{
                width: 180,
                height: 50,
              }}
            />
          )}

          <button type="button" onClick={loadCaptcha}>
            Refresh
          </button>
        </div>

        <input
          className="form-input"
          placeholder="Enter captcha"
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="log-in" type="submit">
        Login
      </button>
      
      {/* ---------- STYLES (NO CHANGES HERE) ---------- */}
      <style>{`
      .login-form {
          width: 100%;
          max-width: 420px;
          margin: 60px auto;
          padding: 32px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
          font-family: Arial, Helvetica, sans-serif;
      }
      .logo-header {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
      }
      .app-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
      }
      .form-header-text {
          text-align: center;
          margin-bottom: 28px;
      }
      .form-header-text h2 {
          margin: 0;
          font-size: 28px;
          color: #1e3a8a;
          font-weight: 700;
      }
      .form-header-text p {
          margin-top: 8px;
          color: #64748b;
          font-size: 14px;
      }
      .login-form label {
          display: block;
          margin-bottom: 8px;
          margin-top: 16px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
      }
      .form-input {
          width: 100%;
          height: 46px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 15px;
          box-sizing: border-box;
          transition: .3s;
      }
      .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,.15);
      }
      .password-wrapper {
          position: relative;
      }
      .eye-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6b7280;
          font-size: 18px;
      }
      .captcha-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
      }
      .captcha-image {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
      }
      .captcha-image img {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #f8fafc;
      }
      .captcha-image button {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: .3s;
      }
      .captcha-image button:hover {
          background: #1d4ed8;
      }
      .log-in {
          width: 100%;
          height: 48px;
          margin-top: 28px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: .3s;
      }
      .log-in:hover {
          background: #1d4ed8;
      }
      .error {
          color: #dc2626;
          font-size: 14px;
          margin-top: 10px;
          font-weight: 600;
          text-align: center;
      }
      @media (max-width: 480px) {
          .login-form {
              margin: 20px;
              padding: 24px;
          }
          .captcha-image {
              flex-direction: column;
              align-items: stretch;
          }
          .captcha-image img {
              width: 100% !important;
              height: auto !important;
          }
      }
      `}</style>
    </form>
  );
}