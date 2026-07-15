// src/pages/TMS/MTManagementV2/components/MTDetailViewer.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUserCircle,
  FaIdCard,
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaUniversity,
  FaFileContract,
  FaSpinner,
  FaDownload,
} from "react-icons/fa";
import { TMS_API } from "../../../../api/axios";

export default function MTDetailViewer({ open, trainerId, onClose }) {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && trainerId) {
      setLoading(true);
      setError(null);

      TMS_API.mtV2
        .detail(trainerId)
        .then((res) => {
          setTrainer(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch Master Trainer details:", err);
          setError("Failed to load trainer details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });

      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    } else {
      setTrainer(null);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, trainerId]);

  if (!open) return null;

  // Formatting Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return "—";
    const str = String(aadhaar);
    if (str.length <= 4) return str;
    return "********" + str.slice(-4);
  };

  const renderTotBadge = (label, value) => {
    const isActive = value === 1 || value === true;
    return (
      <div
        className={`nic-tot-card ${isActive ? "tot-active" : "tot-inactive"}`}
      >
        {isActive ? (
          <FaCheckCircle className="tot-icon" />
        ) : (
          <FaTimesCircle className="tot-icon" />
        )}
        <span className="tot-label">{label}</span>
      </div>
    );
  };

  return (
    <div className="nic-modal-backdrop" onClick={onClose}>
      <div
        className="nic-modal-container"
        style={{ maxWidth: "1000px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="nic-modal-header">
          <h3 className="nic-modal-title">
            <FaUserCircle style={{ marginRight: "8px", fontSize: "1.2em" }} />
            Master Trainer Comprehensive Profile
          </h3>
          <button
            className="nic-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="nic-modal-body">
          {loading ? (
            <div
              style={{ padding: "60px", textAlign: "center", color: "#64748b" }}
            >
              <FaSpinner
                className="nic-spin"
                style={{ fontSize: "32px", marginBottom: "16px" }}
              />
              <p>Fetching full profile...</p>
            </div>
          ) : error ? (
            <div className="nic-alert-danger">{error}</div>
          ) : !trainer ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#64748b" }}
            >
              No data available.
            </div>
          ) : (
            <div className="nic-detail-wrapper">
              {/* SECTION 1: Identity & Contact */}
              <div className="nic-detail-section">
                <h4 className="nic-section-title">
                  <FaIdCard className="nic-section-icon" /> Personal Identity &
                  Contact
                </h4>

                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Profile Picture */}
                  <div className="nic-profile-pic-container">
                    {trainer.profile_picture ? (
                      <img
                        src={trainer.profile_picture}
                        alt="Profile"
                        className="nic-profile-img"
                      />
                    ) : (
                      <div className="nic-profile-placeholder">
                        <FaUserCircle />
                      </div>
                    )}
                  </div>

                  <div className="nic-detail-grid" style={{ flex: 1 }}>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Full Name</span>
                      <span
                        className="nic-detail-value text-primary"
                        style={{ fontWeight: 700, fontSize: "16px" }}
                      >
                        {trainer.full_name || "—"}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">System Username</span>
                      <span
                        className="nic-detail-value"
                        style={{ fontFamily: "monospace", color: "#475569" }}
                      >
                        {trainer.master_user?.username || "—"}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Mobile Number</span>
                      <span className="nic-detail-value">
                        {trainer.mobile_no || "—"}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Aadhaar Number</span>
                      <span className="nic-detail-value">
                        {maskAadhaar(trainer.aadhaar_no)}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">
                        Parent / Spouse Name
                      </span>
                      <span className="nic-detail-value">
                        {trainer.parent_or_spouse_name || "—"}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Date of Birth</span>
                      <span className="nic-detail-value">
                        {formatDate(trainer.date_of_birth)}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Gender</span>
                      <span className="nic-detail-value">
                        {trainer.gender || "—"}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Social Category</span>
                      <span className="nic-detail-value">
                        {trainer.social_category || "—"}
                      </span>
                    </div>
                    <div className="nic-detail-group">
                      <span className="nic-detail-label">Marital Status</span>
                      <span className="nic-detail-value">
                        {trainer.marital_status || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Professional & Empanelment */}
              <div className="nic-detail-section">
                <h4 className="nic-section-title">
                  <FaBriefcase className="nic-section-icon" /> Professional &
                  Empanelment
                </h4>
                <div className="nic-detail-grid">
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Designation</span>
                    <span className="nic-detail-value">
                      <span className="nic-badge badge-neutral">
                        {trainer.designation || "—"}
                      </span>
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Primary Theme</span>
                    <span
                      className="nic-detail-value"
                      style={{ fontWeight: 600 }}
                    >
                      {trainer.theme?.theme_name || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">
                      Empanelled District
                    </span>
                    <span className="nic-detail-value">
                      {trainer.empanel_district?.district_name_en || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Empanelled Block</span>
                    <span className="nic-detail-value">
                      {trainer.empanel_block?.block_name_en || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">
                      Education Qualification
                    </span>
                    <span className="nic-detail-value">
                      {trainer.education || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Success Rate</span>
                    <span className="nic-detail-value">
                      {trainer.success_rate ? `${trainer.success_rate}%` : "—"}
                    </span>
                  </div>
                  <div
                    className="nic-detail-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <span className="nic-detail-label">
                      Skills / Thematic Sectors
                    </span>
                    <span className="nic-detail-value">
                      {trainer.skills || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Certifications (TOTs) */}
              <div className="nic-detail-section">
                <h4 className="nic-section-title">
                  <FaCheckCircle
                    className="nic-section-icon"
                    style={{ color: "#16a34a" }}
                  />
                  Verified Training of Trainers (TOT)
                </h4>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {renderTotBadge("Induction", trainer.induction)}
                  {renderTotBadge("SMCB", trainer.tot_smcb)}
                  {renderTotBadge("MF&FI", trainer.tot_mffi)}
                  {renderTotBadge("SISD", trainer.tot_sisd)}
                  {renderTotBadge("Farm Livelihood", trainer.tot_farm_lh)}
                  {renderTotBadge(
                    "Non-Farm Livelihood",
                    trainer.tot_non_farm_lh,
                  )}
                  {renderTotBadge("Model CLF", trainer.tot_model_clf)}
                  {renderTotBadge("LOKOS", trainer.tot_lokos)}
                </div>
              </div>

              {/* SECTION 4: Achievements & Records */}
              <div className="nic-detail-section">
                <h4 className="nic-section-title">
                  <FaTrophy
                    className="nic-section-icon"
                    style={{ color: "#ca8a04" }}
                  />
                  Achievements & Recommendations
                </h4>
                <div
                  className="nic-detail-grid"
                  style={{ gridTemplateColumns: "1fr" }}
                >
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">
                      Thematic Expert Recommendation
                    </span>
                    <span className="nic-detail-value">
                      {trainer.thematic_expert_recommendation || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">
                      Recommended TOTs by DMMU
                    </span>
                    <span className="nic-detail-value">
                      {trainer.recommended_tots_by_dmmu || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">
                      Success Story Publications
                    </span>
                    <span className="nic-detail-value">
                      {trainer.success_story_publications || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Any Other TOTs</span>
                    <span className="nic-detail-value">
                      {trainer.any_other_tots || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Other Achievements</span>
                    <span className="nic-detail-value">
                      {trainer.other_achievements || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Bank Details */}
              <div className="nic-detail-section">
                <h4 className="nic-section-title">
                  <FaUniversity
                    className="nic-section-icon"
                    style={{ color: "#4f46e5" }}
                  />
                  Bank Information
                </h4>
                <div className="nic-detail-grid">
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Account Number</span>
                    <span
                      className="nic-detail-value"
                      style={{ fontFamily: "monospace", letterSpacing: "1px" }}
                    >
                      {trainer.bank_account_number || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">IFSC Code</span>
                    <span
                      className="nic-detail-value"
                      style={{ textTransform: "uppercase" }}
                    >
                      {trainer.ifsc || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Bank Name</span>
                    <span className="nic-detail-value">
                      {trainer.bank_name || "—"}
                    </span>
                  </div>
                  <div className="nic-detail-group">
                    <span className="nic-detail-label">Branch Name</span>
                    <span className="nic-detail-value">
                      {trainer.branch_name || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 6: Uploaded Certificates */}
              <div
                className="nic-detail-section"
                style={{ borderBottom: "none" }}
              >
                <h4 className="nic-section-title">
                  <FaFileContract
                    className="nic-section-icon"
                    style={{ color: "#0ea5e9" }}
                  />
                  Uploaded Certificate Documents (
                  {trainer.certificates?.length || 0})
                </h4>

                {trainer.certificates && trainer.certificates.length > 0 ? (
                  <div className="nic-table-responsive">
                    <table className="nic-table">
                      <thead>
                        <tr>
                          <th>Document</th>
                          <th>Certificate No.</th>
                          <th>Theme</th>
                          <th>Plan</th>
                          <th>Issued On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainer.certificates.map((cert) => (
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
                                  View
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>{cert.certificate_no || "—"}</td>
                            <td>{cert.theme.theme_name || "—"}</td>
                            <td>{cert.training_plan.training_name || "—"}</td>
                            <td>{formatDate(cert.issued_on)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="nic-muted-text" style={{ margin: 0 }}>
                    No certificates have been uploaded for this trainer.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="nic-modal-footer">
          <button className="nic-btn-close" onClick={onClose}>
            Close Profile
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
          animation: modalSlideIn 0.2s ease-out;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nic-modal-header {
          background-color: #1e3a8a; color: #ffffff; padding: 16px 24px;
          display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;
        }

        .nic-modal-title { margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; }
        .nic-modal-close-btn { background: transparent; border: none; color: #ffffff; font-size: 18px; cursor: pointer; opacity: 0.8; transition: 0.2s; }
        .nic-modal-close-btn:hover { opacity: 1; }

        .nic-modal-body { padding: 24px; overflow-y: auto; background-color: #f8fafc; }
        .nic-detail-wrapper { display: flex; flex-direction: column; gap: 20px; }

        .nic-alert-danger {
          background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b;
          padding: 12px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;
        }

        .nic-detail-section {
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;
          padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .nic-section-title {
          margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #334155;
          display: flex; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;
        }
        .nic-section-icon { color: #3b82f6; margin-right: 8px; }

        /* Profile Pic */
        .nic-profile-pic-container {
          width: 100px; height: 100px; border-radius: 8px; overflow: hidden;
          border: 2px solid #e2e8f0; background: #f1f5f9; flex-shrink: 0;
        }
        .nic-profile-img { width: 100%; height: 100%; object-fit: cover; }
        .nic-profile-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; color: #94a3b8; }

        .nic-detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px 24px; }
        .nic-detail-group { display: flex; flex-direction: column; gap: 4px; }
        .nic-detail-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .nic-detail-value { font-size: 14px; color: #1e293b; word-break: break-word; line-height: 1.4; }
        .text-primary { color: #1e3a8a; }
        .nic-muted-text { color: #64748b; font-size: 13px; font-style: italic; }

        /* Badges */
        .nic-badge {
          display: inline-flex; align-items: center; padding: 3px 8px;
          border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
        }
        .badge-neutral { background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; }

        /* TOT Cards */
        .nic-tot-card {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
          border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid transparent;
        }
        .tot-active { background-color: #f0fdf4; color: #166534; border-color: #bbf7d0; }
        .tot-inactive { background-color: #fef2f2; color: #991b1b; border-color: #fecaca; }
        .tot-icon { font-size: 14px; }

        /* Tables inside modal */
        .nic-table-responsive { overflow-x: auto; border: 1px solid #cbd5e1; border-radius: 4px; }
        .nic-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .nic-table thead th { background: #f1f5f9; color: #475569; padding: 10px; text-align: left; font-weight: 600; border-bottom: 1px solid #cbd5e1; }
        .nic-table tbody td { padding: 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
        .nic-table tbody tr:hover { background: #f8fafc; }
        .nic-link-btn { color: #2563eb; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; }
        .nic-link-btn:hover { text-decoration: underline; color: #1d4ed8; }

        .nic-modal-footer {
          padding: 16px 24px; background-color: #ffffff; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; border-radius: 0 0 8px 8px;
        }
        .nic-btn-close {
          background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;
          padding: 8px 24px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .nic-btn-close:hover { background-color: #e2e8f0; color: #0f172a; }
        
        .nic-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
