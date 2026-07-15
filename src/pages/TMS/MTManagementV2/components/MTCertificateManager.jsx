// src/pages/TMS/MTManagementV2/components/MTCertificateManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaTimes,
  FaFileContract,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaDownload,
  FaPlus,
} from "react-icons/fa";
import { TMS_API } from "../../../../api/axios";
import { useMTCertificates } from "../hooks/useMTCertificates";

const TOT_FIELDS = [
  { value: "induction", label: "Induction" },
  { value: "tot_smcb", label: "SMCB" },
  { value: "tot_mffi", label: "MF&FI" },
  { value: "tot_sisd", label: "SISD" },
  { value: "tot_farm_lh", label: "Farm Livelihood" },
  { value: "tot_non_farm_lh", label: "Non-Farm Livelihood" },
  { value: "tot_model_clf", label: "Model CLF" },
  { value: "tot_lokos", label: "LOKOS" },
];

export default function MTCertificateManager({
  open,
  trainer,
  onClose,
  onSuccessRefresh,
  isApprovalMode = false, // True if opened from SMMU Pending Approvals screen
}) {
  // 1. Core States
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);

  // Upload Staging State
  const [stagedCerts, setStagedCerts] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    theme_id: "",
    training_plan_id: "",
    certificate_no: "",
    issued_on: "",
    target_tot_field: "", // Used by SMMU for auto-approval
  });

  // Approval Mode State
  const [approvalSelections, setApprovalSelections] = useState({});

  // 2. Initialize Hook
  const {
    uploadCertificates,
    deleteCertificate,
    approveTrainerTOT,
    uploading,
    deleting,
    approving,
    error,
    clearError,
    isSMMU,
  } = useMTCertificates({
    onSuccess: () => {
      fetchTrainerDetails(); // Refresh internal modal data
      onSuccessRefresh(); // Refresh background table
      setStagedCerts([]); // Clear staging
    },
  });

  // 3. Fetch Data
  const fetchTrainerDetails = useCallback(async () => {
    if (!trainer?.id) return;
    setFetching(true);
    try {
      const res = await TMS_API.mtV2.detail(trainer.id);
      setTrainerDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch trainer details for certs:", err);
    } finally {
      setFetching(false);
    }
  }, [trainer?.id]);

  useEffect(() => {
    if (open && trainer) {
      clearError();
      setStagedCerts([]);
      setApprovalSelections({});
      fetchTrainerDetails();

      // Load Lookups
      TMS_API.trainingThemes
        .list()
        .then((res) => {
          setThemes(res?.data?.results || res?.data || []);
        })
        .catch(console.error);

      // Disable background scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, trainer, clearError, fetchTrainerDetails]);

  // Fetch plans dynamically when theme changes in upload form
  useEffect(() => {
    if (!uploadForm.theme_id) {
      setPlans([]);
      return;
    }
    TMS_API.trainingPlans
      .list({ theme: uploadForm.theme_id, page_size: 500 })
      .then((res) => setPlans(res?.data?.results || res?.data || []))
      .catch(console.error);
  }, [uploadForm.theme_id]);

  if (!open || !trainer) return null;

  // 4. Handlers
  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setUploadForm((p) => ({ ...p, file: files[0] }));
    } else {
      setUploadForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleStageCertificate = () => {
    if (!uploadForm.file) return alert("Please select a file to upload.");

    setStagedCerts((prev) => [...prev, { ...uploadForm }]);

    // Reset form but keep theme/plan if they want to upload multiple for same theme
    setUploadForm((p) => ({
      ...p,
      file: null,
      certificate_no: "",
      issued_on: "",
      target_tot_field: "",
    }));
    // Clear file input UI manually
    const fileInput = document.getElementById("cert_file_input");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveStaged = (index) => {
    setStagedCerts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCommitUploads = async () => {
    if (stagedCerts.length === 0) return;
    await uploadCertificates(trainer.id, stagedCerts, true);
  };

  const handleDeleteExisting = async (certId) => {
    if (!window.confirm("Are you sure you want to delete this certificate?"))
      return;
    await deleteCertificate(trainer.id, certId);
  };

  const handleApproveAction = async (certId) => {
    const selectedField = approvalSelections[certId];
    if (!selectedField)
      return alert("Please select the corresponding TOT field to approve.");

    // 1. Flip the Boolean
    const res = await approveTrainerTOT(trainer.id, { [selectedField]: true });

    // 2. Clear selection on success
    if (res.success) {
      setApprovalSelections((p) => {
        const next = { ...p };
        delete next[certId];
        return next;
      });
      alert("TOT Approved Successfully!");
    }
  };

  // 5. Render Helpers
  const existingCerts = trainerDetails?.certificates || [];

  return (
    <div className="nic-modal-backdrop">
      <div className="nic-modal-container" style={{ maxWidth: "900px" }}>
        {/* HEADER */}
        <div
          className="nic-modal-header"
          style={{ backgroundColor: isApprovalMode ? "#ca8a04" : "#1e3a8a" }}
        >
          <h3 className="nic-modal-title">
            <FaFileContract style={{ marginRight: "8px" }} />
            {isApprovalMode
              ? "Review Pending Certificates"
              : "Manage Certificates"}{" "}
            - {trainer.full_name}
          </h3>
          <button
            type="button"
            className="nic-modal-close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="nic-modal-body">
          {error && (
            <div className="nic-alert-danger" style={{ marginBottom: "16px" }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {fetching ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#64748b" }}
            >
              <FaSpinner
                className="nic-spin"
                style={{ fontSize: "24px", marginBottom: "12px" }}
              />
              <p>Loading Certificates...</p>
            </div>
          ) : (
            <>
              {/* SECTION 1: EXISTING CERTIFICATES */}
              <div className="nic-form-section">
                <h4 className="nic-section-title">
                  Uploaded Certificates ({existingCerts.length})
                </h4>

                {existingCerts.length === 0 ? (
                  <p
                    className="nic-muted-text"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No certificates found for this Master Trainer.
                  </p>
                ) : (
                  <div
                    className="nic-table-responsive"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <table className="nic-table">
                      <thead>
                        <tr>
                          <th>Document</th>
                          <th>Theme / Plan</th>
                          <th>Details</th>
                          {isApprovalMode && isSMMU && (
                            <th>Approve Target TOT</th>
                          )}
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {existingCerts.map((cert) => (
                          <tr key={cert.id}>
                            <td>
                              {cert.certificate_file ? (
                                <a
                                  href={cert.certificate_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="nic-link-btn"
                                >
                                  <FaDownload style={{ marginRight: "4px" }} />{" "}
                                  View File
                                </a>
                              ) : (
                                "No File"
                              )}
                            </td>
                            <td>
                              <div style={{ fontSize: "12px" }}>
                                <strong>Theme:</strong> {cert.theme.theme_name || "N/A"}
                                <br />
                                <strong>Plan:</strong>{" "}
                                {cert.training_plan.training_name || "N/A"}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: "12px" }}>
                                <strong>No:</strong>{" "}
                                {cert.certificate_no || "N/A"}
                                <br />
                                <strong>Issued:</strong>{" "}
                                {cert.issued_on || "N/A"}
                              </div>
                            </td>

                            {/* APPROVAL WORKFLOW (SMMU ONLY) */}
                            {isApprovalMode && isSMMU && (
                              <td>
                                <select
                                  className="nic-select"
                                  style={{ padding: "4px", fontSize: "12px" }}
                                  value={approvalSelections[cert.id] || ""}
                                  onChange={(e) =>
                                    setApprovalSelections((p) => ({
                                      ...p,
                                      [cert.id]: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">
                                    Select TOT to Verify...
                                  </option>
                                  {TOT_FIELDS.map((f) => (
                                    <option
                                      key={f.value}
                                      value={f.value}
                                      disabled={
                                        trainerDetails?.[f.value] === true
                                      }
                                    >
                                      {f.label}{" "}
                                      {trainerDetails?.[f.value] === true
                                        ? "(Already True)"
                                        : ""}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            )}

                            <td style={{ textAlign: "right" }}>
                              <div
                                className="nic-action-group"
                                style={{ justifyContent: "flex-end" }}
                              >
                                {isApprovalMode && isSMMU && (
                                  <button
                                    className="nic-btn-action btn-activate"
                                    onClick={() => handleApproveAction(cert.id)}
                                    disabled={approving}
                                    title="Verify and flip boolean flag"
                                  >
                                    <FaCheckCircle /> Approve
                                  </button>
                                )}
                                <button
                                  className="nic-btn-action btn-suspend"
                                  onClick={() => handleDeleteExisting(cert.id)}
                                  disabled={deleting}
                                  title={
                                    isApprovalMode
                                      ? "Reject and Delete Document"
                                      : "Delete Document"
                                  }
                                >
                                  {isApprovalMode ? (
                                    <FaTimesCircle />
                                  ) : (
                                    <FaTrash />
                                  )}
                                  {isApprovalMode ? " Reject" : " Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 2: UPLOAD NEW CERTIFICATES (Hidden in pure approval mode unless needed) */}
              {!isApprovalMode && (
                <div
                  className="nic-form-section"
                  style={{ borderLeft: "4px solid #10b981" }}
                >
                  <h4 className="nic-section-title text-success">
                    <FaUpload style={{ marginRight: "6px" }} /> Upload New
                    Certificate
                  </h4>

                  <div
                    className="nic-form-grid"
                    style={{ alignItems: "flex-end", marginBottom: "16px" }}
                  >
                    <div className="nic-form-group">
                      <label className="nic-label">
                        File (PDF/Image) <span className="nic-required">*</span>
                      </label>
                      <input
                        id="cert_file_input"
                        type="file"
                        name="file"
                        className="nic-input"
                        style={{ padding: "6px" }}
                        onChange={handleUploadFormChange}
                        accept="application/pdf,image/jpeg,image/png,image/jpg"
                      />
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label">Related Theme</label>
                      <select
                        name="theme_id"
                        className="nic-select"
                        value={uploadForm.theme_id}
                        onChange={handleUploadFormChange}
                      >
                        <option value="">Select Theme</option>
                        {themes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.theme_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label">Related Plan</label>
                      <select
                        name="training_plan_id"
                        className="nic-select"
                        value={uploadForm.training_plan_id}
                        onChange={handleUploadFormChange}
                        disabled={!uploadForm.theme_id}
                      >
                        <option value="">Select Plan</option>
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.training_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label">Certificate Number</label>
                      <input
                        type="text"
                        name="certificate_no"
                        className="nic-input"
                        value={uploadForm.certificate_no}
                        onChange={handleUploadFormChange}
                        placeholder="e.g. CERT-123"
                      />
                    </div>

                    <div className="nic-form-group">
                      <label className="nic-label">Issue Date</label>
                      <input
                        type="date"
                        name="issued_on"
                        className="nic-input"
                        value={uploadForm.issued_on}
                        onChange={handleUploadFormChange}
                      />
                    </div>

                    {isSMMU && (
                      <div className="nic-form-group">
                        <label
                          className="nic-label"
                          style={{ color: "#16a34a" }}
                        >
                          Auto-Approve TOT Field
                        </label>
                        <select
                          name="target_tot_field"
                          className="nic-select"
                          value={uploadForm.target_tot_field}
                          onChange={handleUploadFormChange}
                          style={{ borderColor: "#16a34a" }}
                        >
                          <option value="">None (Just Upload)</option>
                          {TOT_FIELDS.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div
                      className="nic-form-group"
                      style={{
                        gridColumn: isSMMU ? "1 / -1" : "auto",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="nic-btn-outline"
                        onClick={handleStageCertificate}
                      >
                        <FaPlus style={{ marginRight: "6px" }} /> Add to Upload
                        List
                      </button>
                    </div>
                  </div>

                  {/* STAGED CERTS */}
                  {stagedCerts.length > 0 && (
                    <div
                      style={{
                        background: "#f8fafc",
                        border: "1px dashed #cbd5e1",
                        padding: "12px",
                        borderRadius: "6px",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0 0 10px 0",
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        Staged for Upload ({stagedCerts.length})
                      </h5>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "20px",
                          fontSize: "13px",
                          color: "#1e293b",
                          marginBottom: "16px",
                        }}
                      >
                        {stagedCerts.map((cert, idx) => (
                          <li key={idx} style={{ marginBottom: "6px" }}>
                            <strong>File:</strong> {cert.file?.name} |{" "}
                            <strong>No:</strong> {cert.certificate_no || "N/A"}
                            {cert.target_tot_field && (
                              <span
                                style={{ color: "#16a34a", marginLeft: "6px" }}
                              >
                                [Auto-Approve: {cert.target_tot_field}]
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveStaged(idx)}
                              style={{
                                marginLeft: "12px",
                                color: "#ef4444",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="nic-btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={handleCommitUploads}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <FaSpinner
                              className="nic-spin"
                              style={{ marginRight: "6px" }}
                            />{" "}
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaUpload style={{ marginRight: "6px" }} /> Commit
                            All Uploads
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="nic-modal-footer">
          <button
            type="button"
            className="nic-btn-secondary"
            onClick={onClose}
            disabled={uploading || deleting || approving}
          >
            Done & Close
          </button>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .nic-modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(2px);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; padding: 20px; box-sizing: border-box;
        }

        .nic-modal-container {
          background-color: #ffffff; width: 100%; border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          display: flex; flex-direction: column; max-height: 90vh;
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nic-modal-header {
          color: #ffffff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;
        }

        .nic-modal-title { margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; }
        .nic-modal-close-btn { background: transparent; border: none; color: #ffffff; font-size: 18px; cursor: pointer; opacity: 0.8; }
        .nic-modal-close-btn:hover { opacity: 1; }

        .nic-modal-body { padding: 24px; overflow-y: auto; background-color: #f8fafc; }

        .nic-alert-danger {
          background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b;
          padding: 12px 16px; border-radius: 6px; font-size: 14px;
        }

        .nic-form-section {
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;
          padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }

        .nic-section-title { margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        .text-success { color: #047857; border-bottom-color: #a7f3d0; }

        .nic-form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .nic-form-group { display: flex; flex-direction: column; gap: 6px; }
        .nic-label { font-size: 12px; font-weight: 600; color: #475569; }
        .nic-required { color: #ef4444; }

        .nic-input, .nic-select {
          padding: 8px 10px; font-size: 13px; border: 1px solid #94a3b8; border-radius: 4px;
          background-color: #ffffff; width: 100%; box-sizing: border-box;
        }
        .nic-input:focus, .nic-select:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 2px rgba(30,58,138,0.1); }
        .nic-input:disabled, .nic-select:disabled { background-color: #f1f5f9; cursor: not-allowed; }

        .nic-table-responsive { border: 1px solid #cbd5e1; border-radius: 4px; }
        .nic-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .nic-table thead th { background: #f1f5f9; color: #475569; padding: 10px; text-align: left; font-weight: 600; border-bottom: 1px solid #cbd5e1; }
        .nic-table tbody td { padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; vertical-align: middle; }
        .nic-table tbody tr:hover { background: #f8fafc; }

        .nic-link-btn { color: #2563eb; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; }
        .nic-link-btn:hover { text-decoration: underline; color: #1d4ed8; }

        .nic-action-group { display: flex; gap: 6px; }
        .nic-btn-action { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .btn-activate { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
        .btn-activate:hover:not(:disabled) { background: #dcfce7; }
        .btn-suspend { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
        .btn-suspend:hover:not(:disabled) { background: #ffe4e6; }

        .nic-btn-outline { background: #ffffff; border: 1px solid #1e3a8a; color: #1e3a8a; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center;}
        .nic-btn-outline:hover { background: #eff6ff; }

        .nic-modal-footer { padding: 16px 24px; background-color: #ffffff; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; border-radius: 0 0 8px 8px; }
        .nic-btn-secondary { background: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; }
        .nic-btn-secondary:hover { background: #f1f5f9; }
        .nic-btn-primary { background: #1e3a8a; color: #ffffff; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; }
        .nic-btn-primary:hover:not(:disabled) { background: #1e40af; }
        .nic-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .nic-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
