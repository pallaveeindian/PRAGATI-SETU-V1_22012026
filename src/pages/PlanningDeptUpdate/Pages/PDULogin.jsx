import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_API } from "../../../api/axios";

// Reusable UI Components
import PDUButton from "../components/PDUButton";
import PDUCard from "../components/PDUCard";

// Specific Styles for Login Page
import "./PDULogin.css";

// Logo (Adjust path as needed)
import psLogo from "../../../assets/PS_LOGO_SQUARED.jpg";

// Optional: Import your background theme images
import theme1 from "../../../assets/LoginThemes/theme1.jpg";
import theme2 from "../../../assets/LoginThemes/theme2.jpg";
import theme3 from "../../../assets/LoginThemes/theme3.jpg";

const ROLE_SMMU_ROUTE = {
  dashboard: "/planning-dept-update/dashboard",
};

const schema = yup.object({
  username: yup.string().required("Enter username"),
  password: yup.string().required("Enter password"),
});

// Array of slideshow images
const bgImages = [theme1, theme2, theme3];

export default function PDULogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // State Management
  const [bgIndex, setBgIndex] = useState(0);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 4;

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  // Background Slideshow Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch Captcha
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

    // Inject the specific userType for mapping - Locked to SMMU
    const result = await login({
      ...data,
      userType: "Aspirational Blocks SMMU",
      role: "SMMU",
      captcha: captchaValue,
    });

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
    navigate(ROLE_SMMU_ROUTE.dashboard, { replace: true });
  };

  return (
    <div className="pdu-login-container">
      {/* Background Slideshow Elements */}
      {bgImages.map((img, index) => (
        <div
          key={index}
          className={`pdu-login-bg ${index === bgIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      {/* Dark/Blur Overlay for futuristic glass effect */}
      <div className="pdu-login-overlay"></div>

      {/* Login Card wrapper */}
      <div className="pdu-login-content">
        <PDUCard className="pdu-futuristic-card">
          <form className="pdu-login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="pdu-logo-header">
              <img src={psLogo} alt="Pragati Setu" className="pdu-app-logo" />
            </div>

            <div className="pdu-form-header-text">
              <h2>Aspirational Blocks Update Portal</h2>
              <p className="pdu-smmu-lock-text">Secure SMMU Access Node</p>
            </div>

            {/* Username */}
            <div className="pdu-input-group">
              <label className="pdu-block-label">Username</label>
              <input
                className="pdu-form-input"
                {...register("username")}
                placeholder="Enter SMMU Username"
              />
            </div>

            {/* Password */}
            <div className="pdu-input-group">
              <label className="pdu-block-label">Password</label>
              <div className="pdu-password-wrapper">
                <input
                  className="pdu-form-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Enter Password"
                  {...register("password")}
                />
                <span
                  className="pdu-eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Password Error */}
            {failedAttempts > 0 &&
              failedAttempts < MAX_ATTEMPTS &&
              !captchaError?.toLowerCase().includes("captcha") && (
                <div className="pdu-error">
                  Wrong password. Attempts left: {MAX_ATTEMPTS - failedAttempts}
                </div>
              )}

            {/* Captcha */}
            <div className="pdu-input-group">
              <label className="pdu-block-label">Security Captcha</label>
              <div className="pdu-captcha-wrapper">
                <div className="pdu-captcha-image-box">
                  <img src={captchaImage || undefined} alt="captcha" />
                  <button
                    type="button"
                    className="pdu-captcha-refresh"
                    onClick={loadCaptcha}
                  >
                    ↻
                  </button>
                </div>
                <input
                  type="text"
                  className="pdu-form-input pdu-captcha-input"
                  placeholder="Enter characters"
                  style={{ textTransform: "uppercase" }}
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                />
              </div>
            </div>

            {/* Captcha / Max Attempts Error */}
            {captchaError && <p className="pdu-error">{captchaError}</p>}
            {failedAttempts >= MAX_ATTEMPTS &&
              !captchaError?.toLowerCase().includes("captcha") && (
                <div className="pdu-error">
                  Access Locked. Too many failed attempts.
                </div>
              )}

            {/* Using our reusable button component with the diagonal swipe effect */}
            <div className="pdu-submit-wrapper">
              <PDUButton variant="login" type="submit">
                Initialize Session
              </PDUButton>
            </div>
          </form>
        </PDUCard>
      </div>
    </div>
  );
}
