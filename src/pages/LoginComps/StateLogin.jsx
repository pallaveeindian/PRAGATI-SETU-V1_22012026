// src/pages/StateLoginPortal/StateLogin.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";
import { getUser } from "../../utils/storage";
import { AUTH_API } from "../../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PrernaLogo from "../../assets/prerna.png";

const StateLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loadCaptcha = async () => {
    try {
      const res = await AUTH_API.captcha();
      setCaptchaImage(res.data.image);
    } catch (err) {
      console.error(
        "Core Session: Captcha configuration failed to initialize.",
        err,
      );
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = async (data) => {
    setCaptchaError("");

    const loginPayload = {
      username: data.username,
      password: data.password,
      captcha: captchaValue,
      userType: "Admin",
      role: "state_admin",
    };

    const result = await login(loginPayload);

    if (!result?.success) {
      const errorDetail =
        result?.error?.detail || "Authorization rejected. Review parameters.";
      const isCaptchaIssue = errorDetail.toLowerCase().includes("captcha");

      if (!isCaptchaIssue) {
        setFailedAttempts((prev) => prev + 1);
      }

      setCaptchaError(errorDetail);
      setCaptchaValue("");
      loadCaptcha();
      return;
    }

    setFailedAttempts(0);
    const backendUser = getUser();

    if (backendUser && Number(backendUser.role_id) === 8) {
      localStorage.setItem("user_role_id", "8");
      if (backendUser.id)
        localStorage.setItem("user_id", String(backendUser.id));

      navigate("/master/state-dashboard", { replace: true });
    } else {
      setCaptchaError(
        "Access Denied: Account profile missing State Administrator privileges.",
      );
      loadCaptcha();
    }
  };

  return (
    <div className="md-login-card">
      <div className="logo-section">
        <img src={PrernaLogo} alt="Prerna Logo" className="logo" />
      </div>

      <h2>Mission Director Login</h2>
      <p className="subtitle">Enter your credentials to continue</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            {...register("username", {
              required: "Username field is mandatory.",
            })}
          />
          {errors.username && (
            <p className="inline-error-text">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              autoComplete="off"
              {...register("password", {
                required: "Password field is mandatory.",
              })}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="inline-error-text">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Captcha Verification</label>
          <div className="captcha-box">
            <div className="captcha-image-wrapper">
              <img
                src={captchaImage || undefined}
                alt="verification captcha stream"
                className="dynamic-captcha-frame"
              />
            </div>
            <button type="button" className="refresh-btn" onClick={loadCaptcha}>
              Refresh
            </button>
          </div>

          <input
            type="text"
            placeholder="ENTER CAPTCHA"
            className="captcha-input"
            style={{ textTransform: "uppercase" }}
            value={captchaValue}
            onChange={(e) => setCaptchaValue(e.target.value)}
          />
        </div>

        {captchaError && (
          <p className="inline-error-text highlight-box-alert">
            {captchaError}
          </p>
        )}

        {failedAttempts > 0 &&
          failedAttempts < MAX_ATTEMPTS &&
          !captchaError?.toLowerCase().includes("captcha") && (
            <p className="inline-error-text highlight-box-alert">
              Wrong password credentials. Attempts remaining:{" "}
              {MAX_ATTEMPTS - failedAttempts}
            </p>
          )}

        {failedAttempts >= MAX_ATTEMPTS &&
          !captchaError?.toLowerCase().includes("captcha") && (
            <p className="inline-error-text highlight-box-alert">
              Account suspended: Maximum entry verification attempts exceeded.
            </p>
          )}

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <style>{`
        .md-login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 430px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.35);
          border-top: 6px solid #fb8500;
          color: #0f172a;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 18px;
        }

        .logo {
          width: 110px;
          height: 110px;
          object-fit: contain;
        }

        .md-login-card h2 {
          margin: 0;
          text-align: center;
          color: #0f172a;
          font-size: 30px;
          font-weight: 800;
        }

        .subtitle {
          text-align: center;
          color: #64748b;
          margin-top: 8px;
          margin-bottom: 28px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .md-login-card input {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid #dbe2ea;
          border-radius: 12px;
          background: #f8fafc;
          font-size: 14px;
          color: #0f172a;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }

        .md-login-card input:focus {
          outline: none;
          border-color: #fb8500;
          box-shadow: 0 0 0 4px rgba(251, 133, 0, 0.12);
          background: white;
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          padding-right: 50px;
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .eye-btn:hover {
          color: #fb8500;
        }

        .captcha-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          border: 1px solid #dbe2ea;
          border-radius: 12px;
          background: #f8fafc;
          margin-bottom: 12px;
        }

        .captcha-image-wrapper {
          display: flex;
          align-items: center;
          height: 45px;
          overflow: hidden;
        }

        .dynamic-captcha-frame {
          height: 100%;
          width: auto;
          object-fit: contain;
          border-radius: 6px;
        }

        .refresh-btn {
          border: none;
          background: #fb8500;
          color: white;
          padding: 9px 14px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .captcha-input {
          text-align: center;
          letter-spacing: 3px;
          font-weight: 600;
        }

        .inline-error-text {
          font-size: 12px;
          color: #dc2626;
          margin: 6px 0 0 2px;
          font-weight: 500;
        }

        .highlight-box-alert {
          font-size: 13px;
          font-weight: 600;
          color: #991b1b;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          padding: 10px 12px;
          border-radius: 8px;
          text-align: center;
          margin-top: 14px;
        }

        .login-btn {
          width: 100%;
          border: none;
          background: linear-gradient(135deg, #84a98c, #72d788);
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(114, 215, 136, 0.4);
        }

        @media (max-width: 576px) {
          .md-login-card {
            padding: 24px;
            width: 92%;
          }
          .logo {
            width: 90px;
            height: 90px;
          }
          .md-login-card h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default StateLogin;
