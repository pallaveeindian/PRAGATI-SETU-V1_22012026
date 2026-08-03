// src/pages/LoginParent.jsx
import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingModal from "../../components/ui/LoadingModal";

// Module Components
import TmsLogin from "./TmsLogin";
import LdmsLogin from "./LdmsLogin";
import CrpEpLogin from "./CrpEpLogin";
import MouLogin from "./MouLogin";
import AdminLogin from "./AdminLogin";
import EPSMSLogin from "./EPSMSLogin";
import StateLogin from "./StateLogin";

export default function LoginParent() {
  const { loading } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Read module from URL, default to TMS
  const module = searchParams.get("module") || "tms";

  // Determine theme and component based on the module
  let content;
  let theme = "blue"; // default

  switch (module) {
    case "tms":
      content = <TmsLogin />;
      theme = "blue";
      break;
    case "ldms":
      content = <LdmsLogin />;
      theme = "red";
      break;
    case "crp":
      content = <CrpEpLogin />;
      theme = "green";
      break;
    case "mou":
      content = <MouLogin />;
      theme = "purple";
      break;
    case "epsms":
      content = <EPSMSLogin />;
      theme = "orange";
      break;
    case "pmuadmin":
      content = <AdminLogin />;
      theme = "blue";
      break;
    case "admin":
      content = <StateLogin />;
      theme = "green"; 
      break;
    default:
      content = <TmsLogin />;
      theme = "blue";
      break;
  }

  return (
    <div className={`login-page theme-${theme}`}>
      <LoadingModal open={loading} title="Logging in" />

      <div className="overlay">{content}</div>

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

      /* --- BLUE THEME (TMS) --- */
      .theme-blue.login-page {
        background: linear-gradient(135deg, #1e3a8a, #0f172a);
      }
      .theme-blue .login-form {
        border-radius: 4px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        border-top: 6px solid #2563eb;
      }
      .theme-blue .log-in { background: #2563eb; border-radius: 4px; }
      .theme-blue .log-in:hover { background: #1d4ed8; transform: translateY(-2px); }
      .theme-blue .form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235, 0.2); }

      /* --- RED THEME (LDMS) --- */
      .theme-red.login-page {
        background: linear-gradient(135deg, #991b1b, #450a0a);
      }
      .theme-red .login-form {
        border-radius: 0px;
        box-shadow: 12px 12px 0px rgba(0,0,0,0.8);
        border: 2px solid #000;
      }
      .theme-red .form-input { border-radius: 0; border: 1px solid #000; }
      .theme-red .log-in { background: #b91c1c; border-radius: 0; border: 2px solid #000; }
      .theme-red .log-in:hover { background: #991b1b; transform: translate(-2px, -2px); box-shadow: 4px 4px 0 #000;}
      .theme-red .form-input:focus { border-color: #b91c1c; }

      /* --- GREEN THEME (CRP-EP) --- */
      .theme-green.login-page {
        background: linear-gradient(135deg, #166534, #052e16);
      }
      .theme-green .login-form {
        border-radius: 40px 10px 40px 10px;
        box-shadow: 0 15px 35px rgba(22, 101, 52, 0.4);
      }
      .theme-green .log-in { background: #15803d; border-radius: 20px 5px 20px 5px; }
      .theme-green .log-in:hover { background: #166534; transform: translateY(2px); }
      .theme-green .form-input { border-radius: 10px 4px 10px 4px; }
      .theme-green .form-input:focus { border-color: #15803d; }

      /* --- PURPLE THEME (MOU) --- */
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
      .theme-purple .log-in { background: #9333ea; border-radius: 16px; }
      .theme-purple .log-in:hover { background: #7e22ce; box-shadow: 0 8px 20px rgba(147, 51, 234, 0.4); }
      .theme-purple .form-input { background: rgba(255,255,255,0.6); }
      .theme-purple .form-input:focus { border-color: #9333ea; background: #fff;}

      @media (max-width: 520px) {
        .login-form { width: 92%; padding: 24px 20px; }
      }
        /* --- ORANGE THEME (EPSMS) --- */
      .theme-orange.login-page {
        background: linear-gradient(135deg, #f59e0b 30%, #f97316 70%);
      }
      .theme-orange .login-form {
        border-radius: 40px 10px 40px 10px;
        box-shadow: 0 15px 35px rgba(22, 101, 52, 0.4);
      }
      .theme-orange .log-in { background: #f59e0b; border-radius: 20px 5px 20px 5px; }
      .theme-orange .log-in:hover { background: #f59e0b; transform: translateY(2px); }
      .theme-orange .form-input { border-radius: 10px 4px 10px 4px; }
      .theme-orange .form-input:focus { border-color: #f59e0b; }
      `}</style>
    </div>
  );
}
