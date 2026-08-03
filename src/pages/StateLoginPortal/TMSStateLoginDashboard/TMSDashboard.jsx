// src/pages/StateLoginPortal/TMSStateLoginDashboard/TMSDashboard.jsx
import React, { useState } from "react";
import TrainingRequestDashboard from "./TrainingRequestDashboard";
import TargetVsAchievement from "../TMSStateLoginDashboard/TargetVsAchievementPage";
import CadreSelectionCountPage from "./CadreSelectionCountPage";
import TrainingCenterPendencyPage from "./TrainingCenterPendencyPage";
import BatchProgressDashboard from "./BatchProgressDashboard";
import DmmuCertificatePendency from "./DmmuCertificatePendency";
import BeneficiaryAttendanceRatioPage from "./BeneficiaryAttendanceRatioPage";

const TMSDashboard = () => {
  const [activeTab, setActiveTab] = useState("target_vs_achievement");

  return (
    <>
      <div className="tms-dashboard">
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "target_vs_achievement" ? "active" : ""}`}
            onClick={() => setActiveTab("target_vs_achievement")}
          >
            Target vs Achievement
          </button>

          <button
            className={`tab-btn ${activeTab === "cadre_selection_count" ? "active" : ""}`}
            onClick={() => setActiveTab("cadre_selection_count")}
          >
            Cadre Selection Count
          </button>

          <button
            className={`tab-btn ${activeTab === "training_centre_pendencies" ? "active" : ""}`}
            onClick={() => setActiveTab("training_centre_pendencies")}
          >
            Training Centre Pendencies
          </button>

          <button
            className={`tab-btn ${activeTab === "batch_progress" ? "active" : ""}`}
            onClick={() => setActiveTab("batch_progress")}
          >
            Batch Progress
          </button>

          <button
            className={`tab-btn ${activeTab === "batch_certificate_pendency" ? "active" : ""}`}
            onClick={() => setActiveTab("batch_certificate_pendency")}
          >
            Batch Certificate Pendency
          </button>

          <button
            className={`tab-btn ${activeTab === "beneficiary_eligibility_attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("beneficiary_eligibility_attendance")}
          >
            Beneficiary Eligibility Attendance Ratio
          </button>

          <button
            className={`tab-btn ${activeTab === "training_request" ? "active" : ""}`}
            onClick={() => setActiveTab("training_request")}
          >
            Training Request Created
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "target_vs_achievement" && (
            <div className="placeholder-card">
              <h2>Target vs Achievement</h2>
              <TargetVsAchievement />
            </div>
          )}

          {activeTab === "cadre_selection_count" && (
            <div className="placeholder-card">
              <h2>Cadre Selection Count</h2>
              <CadreSelectionCountPage />
            </div>
          )}

          {activeTab === "training_centre_pendencies" && (
            <div className="placeholder-card">
              <h2>Training Centre Pendencies</h2>
              <TrainingCenterPendencyPage />
            </div>
          )}

          {activeTab === "batch_progress" && (
            <div className="placeholder-card">
              <h2>Batch Progress</h2>
              <BatchProgressDashboard />
            </div>
          )}

          {activeTab === "batch_certificate_pendency" && (
            <div className="placeholder-card">
              <h2>Batch Certificate Pendency</h2>
              <DmmuCertificatePendency />
            </div>
          )}

          {activeTab === "beneficiary_eligibility_attendance" && (
            <div className="placeholder-card">
              <h2>Beneficiary Eligibility Attendance Ratio</h2>
              <BeneficiaryAttendanceRatioPage />
            </div>
          )}

          {activeTab === "training_request" && <TrainingRequestDashboard />}
        </div>
      </div>

      <style>{`
                .tms-dashboard {
             /* Removed top padding to pull tabs up tight */
                    width: 100%;
                }

                .dashboard-title {
                    font-size: 30px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 20px;
                }

                .tabs-container {
                    display: inline-flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    padding: 4px;
                    background: #fef3c7;
                    border-radius: 14px;
                    margin: 0px 0px 24px 0px; /* Explicitly cleared top, left, and right margins */
                }

                .tab-btn {
                    border: none;
                    outline: none;
                    background: transparent;
                    padding: 10px 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    color: #92400e;
                    transition: all 0.25s ease;
                }

                .tab-btn:hover {
                    background: #fde68a;
                }

                .tab-btn.active {
                    background: #f59e0b;
                    color: white;
                    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
                }

                .tab-content {
                    margin-top: 10px;
                }

                .placeholder-card {
                    background: #fff;
                    padding: 30px;
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                }

                .placeholder-card h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 10px;
                }

                .placeholder-card p {
                    color: #64748b;
                    font-size: 15px;
                }

                @media (max-width: 768px) {
                    .tabs-container {
                        width: 100%;
                    }

                    .tab-btn {
                        flex: 1 1 100%;
                        text-align: center;
                    }

                    .dashboard-title {
                        font-size: 24px;
                    }
                }
            `}</style>
    </>
  );
};

export default TMSDashboard;
