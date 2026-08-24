// src/pages/TMS/LearnMat/AddLM.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSpinner,
  FaBookOpen,
} from "react-icons/fa";

export default function AddLM() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [materialLevel, setMaterialLevel] = useState("THEME"); // "THEME" or "PLAN"
  const [planId, setPlanId] = useState("");

  // Context State
  const [themeId, setThemeId] = useState("");
  const [themeName, setThemeName] = useState("");
  const [plans, setPlans] = useState([]);

  // UI State
  const [loadingContext, setLoadingContext] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 1. Initial Load: Resolve SMMU Theme
  useEffect(() => {
    const fetchSMMUTheme = async () => {
      setLoadingContext(true);
      setError(null);
      try {
        const tRes = await TMS_API.trainingThemes.list({ page_size: 100 });
        const allThemes = tRes?.data?.results || [];

        // Find the theme where this SMMU user is the expert
        const myTheme = allThemes.find(
          (t) => Number(t.expert) === Number(user?.id),
        );

        if (myTheme) {
          setThemeId(String(myTheme.id));
          setThemeName(myTheme.theme_name);
        } else {
          setError(
            "No Training Theme is mapped to your account. You cannot upload materials.",
          );
        }
      } catch (err) {
        console.error("Failed to resolve theme:", err);
        setError("Failed to connect to the server to verify your theme.");
      } finally {
        setLoadingContext(false);
      }
    };

    if (user?.id) fetchSMMUTheme();
  }, [user?.id]);

  // 2. Fetch Plans if "Training Plan" level is selected
  useEffect(() => {
    if (materialLevel === "PLAN" && themeId) {
      TMS_API.trainingPlans
        .list({ theme: themeId, page_size: 200 })
        .then((r) => setPlans(r?.data?.results || []))
        .catch((err) => console.error("Failed to load plans", err));
    } else {
      setPlans([]);
      setPlanId("");
    }
  }, [materialLevel, themeId]);

  // 3. Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      alert("Title and File are mandatory.");
      return;
    }
    if (materialLevel === "PLAN" && !planId) {
      alert("Please select a Training Plan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      formData.append("file", file);

      // Attach Theme (Mandatory for SMMU)
      if (themeId) formData.append("theme", themeId);

      // Attach Plan if applicable
      if (materialLevel === "PLAN" && planId) {
        formData.append("training_plan", planId);
      }

      // Using the multipart endpoint from our makeCrud factory
      await TMS_API.learningMaterials.createMultipart(formData);

      alert("Learning Material uploaded successfully!");
      navigate("/tms/learning-materials/list");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to upload learning material.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main
            style={{
              padding: "24px 18px",
              minHeight: "100vh",
              background: "#f8fafc",
            }}
          >
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {/* Header */}
              <div className="page-header-row">
                <h2 className="page-title">
                  <FaBookOpen
                    style={{
                      marginRight: 10,
                      color: "#2563eb",
                      verticalAlign: "middle",
                    }}
                  />
                  Upload Learning Material
                </h2>
                <button
                  className="btn-tms-outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  <FaArrowLeft style={{ marginRight: 6 }} /> Back
                </button>
              </div>

              {/* Main Form Card */}
              <div className="tms-main-card fade-in">
                {loadingContext ? (
                  <div className="loading-state">
                    <FaSpinner
                      className="spin-icon"
                      size={32}
                      color="#3b82f6"
                    />
                    <p>Verifying user authority and theme mapping...</p>
                  </div>
                ) : error ? (
                  <div className="error-state">
                    <span className="error-icon">⚠</span>
                    <h3>Access Denied</h3>
                    <p>{error}</p>
                    <button
                      className="btn-tms-outline mt-3"
                      onClick={() => navigate(-1)}
                    >
                      Go Back
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="tms-form">
                    {/* Theme Lock Banner */}
                    <div className="locked-theme-banner">
                      <div className="banner-label">Your Assigned Theme</div>
                      <div className="banner-value">
                        {themeName || "Unknown"}
                      </div>
                      <div className="banner-hint">
                        All uploaded materials will be locked to this theme.
                      </div>
                    </div>

                    {/* Material Level Toggle */}
                    <div className="form-group">
                      <label className="form-label">
                        What is this material for?
                      </label>
                      <div className="radio-group-modern">
                        <label
                          className={`radio-card ${materialLevel === "THEME" ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name="materialLevel"
                            value="THEME"
                            checked={materialLevel === "THEME"}
                            onChange={(e) => setMaterialLevel(e.target.value)}
                          />
                          <div className="rc-content">
                            <strong>General Theme Resource</strong>
                            <span>Applies to the entire {themeName} theme</span>
                          </div>
                        </label>
                        <label
                          className={`radio-card ${materialLevel === "PLAN" ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name="materialLevel"
                            value="PLAN"
                            checked={materialLevel === "PLAN"}
                            onChange={(e) => setMaterialLevel(e.target.value)}
                          />
                          <div className="rc-content">
                            <strong>Specific Training Plan</strong>
                            <span>Applies only to a single training plan</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Conditional: Training Plan Dropdown */}
                    {materialLevel === "PLAN" && (
                      <div className="form-group slide-down">
                        <label className="form-label required">
                          Select Training Plan
                        </label>
                        <select
                          className="tms-input"
                          value={planId}
                          onChange={(e) => setPlanId(e.target.value)}
                          required
                        >
                          <option value="">-- Choose a Training Plan --</option>
                          {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.training_name}
                            </option>
                          ))}
                        </select>
                        {plans.length === 0 && (
                          <div className="field-hint warning">
                            No training plans found for this theme.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <div className="form-group">
                      <label className="form-label required">
                        Material Title
                      </label>
                      <input
                        type="text"
                        className="tms-input"
                        placeholder="e.g., Intro to Financial Inclusion Guidelines"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={250}
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                      <label className="form-label">
                        Description (Optional)
                      </label>
                      <textarea
                        className="tms-input"
                        placeholder="Briefly describe what this material covers..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                      <label className="form-label required">Upload File</label>
                      <div className="file-upload-box">
                        <input
                          type="file"
                          className="file-input-native"
                          onChange={(e) => setFile(e.target.files[0])}
                          required
                          id="lm-file"
                        />
                        <label htmlFor="lm-file" className="file-upload-label">
                          <FaCloudUploadAlt
                            size={32}
                            color="#94a3b8"
                            style={{ marginBottom: 10 }}
                          />
                          {file ? (
                            <span className="file-name-success">
                              {file.name}
                            </span>
                          ) : (
                            <span>
                              Click to browse or drag and drop a file here
                              <br />
                              <small>(PDF, DOCX, Image, or Video)</small>
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="form-actions">
                      <button
                        type="submit"
                        className={`btn-tms-primary ${isSubmitting ? "disabled" : "glow"}`}
                        disabled={
                          isSubmitting ||
                          (materialLevel === "PLAN" && plans.length === 0)
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner
                              className="spin-icon"
                              style={{ marginRight: 8, marginBottom: 0 }}
                            />{" "}
                            Uploading...
                          </>
                        ) : (
                          "Upload Material"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* --- STYLES --- */}
      <style>{`
        .content-area { display: flex; flex: 1; min-width: 0; }
        .main-area { display: flex; flex-direction: column; flex: 1; min-height: 100vh; }
        footer { margin-top: auto; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
        .spin-icon { animation: spin 1s linear infinite; }

        .page-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-title { margin: 0; font-size: 24px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
        
        .tms-main-card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }

        /* Lock Banner */
        .locked-theme-banner { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; border-left: 4px solid #16a34a; }
        .banner-label { font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .banner-value { font-size: 20px; font-weight: 800; color: #14532d; }
        .banner-hint { font-size: 12px; color: #15803d; margin-top: 4px; }

        /* Form Components */
        .form-group { margin-bottom: 24px; }
        .form-label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .form-label.required::after { content: " *"; color: #ef4444; }
        
        .tms-input { width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none; transition: all 0.2s; background: #fff; font-family: inherit; box-sizing: border-box; }
        .tms-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }
        textarea.tms-input { resize: vertical; min-height: 100px; }

        .field-hint { font-size: 12px; margin-top: 6px; color: #64748b; }
        .field-hint.warning { color: #b45309; font-weight: 600; }

        /* Radio Cards */
        .radio-group-modern { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .radio-card { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
        .radio-card:hover { border-color: #cbd5e1; background: #f1f5f9; }
        .radio-card.active { border-color: #2563eb; background: #eff6ff; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.1); }
        .radio-card input[type="radio"] { margin-top: 4px; transform: scale(1.2); accent-color: #2563eb; }
        .rc-content { display: flex; flex-direction: column; }
        .rc-content strong { color: #0f172a; font-size: 15px; margin-bottom: 2px; }
        .rc-content span { color: #64748b; font-size: 13px; }

        /* File Upload */
        .file-upload-box { position: relative; width: 100%; }
        .file-input-native { position: absolute; width: 0; height: 0; opacity: 0; overflow: hidden; z-index: -1; }
        .file-upload-label { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; border: 2px dashed #cbd5e1; border-radius: 10px; background: #f8fafc; cursor: pointer; transition: all 0.2s; text-align: center; color: #64748b; font-size: 14px; }
        .file-upload-label:hover { background: #f1f5f9; border-color: #94a3b8; }
        .file-name-success { color: #16a34a; font-weight: 700; font-size: 16px; word-break: break-all; }

        /* Actions */
        .form-actions { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; }
        
        .btn-tms-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); display: inline-flex; align-items: center; justify-content: center; min-width: 180px; }
        .btn-tms-primary.glow:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
        .btn-tms-primary.disabled { background: #cbd5e1; color: #f8fafc; box-shadow: none; cursor: not-allowed; }
        
        .btn-tms-outline { background: transparent; color: #475569; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; }
        .btn-tms-outline:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }

        /* States */
        .loading-state, .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
        .loading-state p { color: #64748b; margin-top: 16px; font-weight: 500; }
        .error-state .error-icon { font-size: 48px; color: #ef4444; margin-bottom: 16px; }
        .error-state h3 { color: #0f172a; margin: 0 0 8px 0; font-size: 24px; }
        .error-state p { color: #64748b; font-size: 15px; max-width: 400px; margin: 0 auto; }
        .mt-3 { margin-top: 24px; }

        @media (max-width: 640px) {
          .radio-group-modern { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
