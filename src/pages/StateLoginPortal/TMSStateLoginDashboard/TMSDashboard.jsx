// src/pages/StateLoginPortal/TMSStateLoginDashboard/TMSDashboard.jsx
import React, { useState } from "react";
import TrainingRequestDashboard from "./TrainingRequestDashboard";
import TargetVsAchievement from "../TMSStateLoginDashboard/TargetVsAchievementPage";
import CadreSelectionCountPage from "./CadreSelectionCountPage";
import TrainingCenterPendencyPage from "./TrainingCenterPendencyPage";
import BatchProgressDashboard from "./BatchProgressDashboard";
import DmmuCertificatePendency from "./DmmuCertificatePendency";
import BeneficiaryAttendanceRatioPage from "./BeneficiaryAttendanceRatioPage";

import TMSDashHeader from "../../TMS/layout/TMSDashHeader";

const TMSDashboard = () => {
  const [loading, setLoading] = useState(false);

  // State for Financial Year (Defaulting to upcoming/current)
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [activeTab, setActiveTab] = useState("target_vs_achievement");

  return (
    <>
      <div className="tms-dashboard">
        <TMSDashHeader
          partnerName={"UP Analytics - TMS"}
          username={"UPSRLM Admin"}
          financialYear={financialYear}
          setFinancialYear={setFinancialYear}
          loading={loading}
          theme="tms"
        />
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "target_vs_achievement" ? "active" : ""}`}
            onClick={() => setActiveTab("target_vs_achievement")}
          >
            Cadre Selection Count
          </button>

          <button
            className={`tab-btn ${activeTab === "cadre_selection_count" ? "active" : ""}`}
            onClick={() => setActiveTab("cadre_selection_count")}
          >
            Batch wise Cadre Selection
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
            Training Requests Created
          </button>
        </div>

        {/* Tab Content */}
        <div className="state-tab-content">
          {activeTab === "target_vs_achievement" && (
            <div className="placeholder-card">
              <TargetVsAchievement financialYear={financialYear} />
            </div>
          )}

          {activeTab === "cadre_selection_count" && (
            <div className="placeholder-card">
              <CadreSelectionCountPage financialYear={financialYear} />
            </div>
          )}

          {activeTab === "training_centre_pendencies" && (
            <div className="placeholder-card">
              <TrainingCenterPendencyPage />
            </div>
          )}

          {activeTab === "batch_progress" && (
            <div className="placeholder-card">
              <BatchProgressDashboard />
            </div>
          )}

          {activeTab === "batch_certificate_pendency" && (
            <div className="placeholder-card">
              <DmmuCertificatePendency />
            </div>
          )}

          {activeTab === "beneficiary_eligibility_attendance" && (
            <div className="placeholder-card">
              <BeneficiaryAttendanceRatioPage />
            </div>
          )}

          {activeTab === "training_request" && <TrainingRequestDashboard />}
        </div>
      </div>

      <style>{`
                .tms-dashboard {
                    width: 100%;
                    background: #fff;
                }

                .dashboard-title {
                    font-size: 30px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 20px;
                }

                .tabs-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    padding: 4px;

                    background: linear-gradient(
                        to top,
                        #083a8c 0%,
                        #0b5cb8 20%,
                        #1293db 45%,
                        #dceffd 75%,
                        #ffffff 100%
                    );

                    border-bottom: 5px solid #083a8c;
                    margin: 2px 0 0px 0;

                    justify-content: center;
                    align-items: center;
                }

                .tab-btn {
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    outline: none;

                    background: rgba(255, 255, 255, 0.18);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);

                    box-shadow:
                        0 4px 12px rgba(8, 58, 140, 0.12),
                        inset 0 1px 1px rgba(255, 255, 255, 0.35);

                    padding: 10px 18px;
                    border-radius: 10px;
                    cursor: pointer;

                    font-size: 14px;
                    font-weight: 600;
                    color: #083a8c;

                    transition: all 0.25s ease;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 14px;
                    text-shadow: 0 4px 12px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .tab-btn:hover {
                    background: #083a8c;
                    color: white;
                    box-shadow: 0 2px 8px rgba(11, 34, 245, 0.35);
                }

                .tab-btn.active {
                    background: #083a8c;
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(11, 34, 245, 0.35);
                }

                .state-tab-content{
                    background: #083a8c;
                }

                .placeholder-card {
                    background: #083a8c;
                    padding: 30px;
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
