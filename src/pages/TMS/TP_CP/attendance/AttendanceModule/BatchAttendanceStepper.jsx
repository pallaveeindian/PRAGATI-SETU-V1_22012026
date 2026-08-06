// src/pages/TMS/TP_CP/attendance/AttendanceModule/BatchAttendanceStepper.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../layout/header";
import Footer from "../../../layout/footer";
import TmsLeftNav from "../../../layout/tms_LeftNav";

import useLiveBatchData from "./hooks/useLiveBatchData";
import LiveDataLoader from "./components/Shared/LiveDataLoader";
import NicStepperHeader from "./components/Shared/NicStepperHeader";
import NicStatsCards from "./components/Shared/NicStatsCards";

// Controllers for the actual steps
import EkycStepMain from "./components/Step1_EkycManager/EkycStepMain";
import AttendanceStepMain from "./components/Step2_AttendanceManager/AttendanceStepMain";

export default function BatchAttendanceStepper({ activeStep = 1 }) {
  const { id: batchId } = useParams();
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Initialize the central Live Data Engine
  const {
    batchData,
    loading,
    error,
    today,
    participants,
    ekycRows,
    allEkycVerified,
    schedule,
    attendances,
    attendanceToday,
    missingDates,
    refreshData,
  } = useLiveBatchData(batchId);

  // Auto-Redirect Protection:
  // If user tries to access Step 2 (Attendance) but Step 1 (EKYC) is NOT complete,
  // we warn them and force them back to Step 1.
  if (!loading && activeStep === 2 && !allEkycVerified) {
    alert(
      "E-KYC is not complete. You must verify all participants before taking attendance.",
    );
    navigate(`/tms/cp/batch-attendance-ekyc/${batchId}`);
  }

  return (
    <div
      className="app-shell"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      <Header />
      <div
        className="content-area"
        style={{ display: "flex", flex: 1, minWidth: 0 }}
      >
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />

        <div
          className="main-area"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <main style={{ padding: 24 }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              {/* PAGE HEADER & ACTIONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#002174",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    Batch Management Hub
                  </h2>
                  {batchData && (
                    <div
                      style={{
                        color: "#64748b",
                        marginTop: 4,
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Batch Code:{" "}
                      <span style={{ color: "#0092E0" }}>
                        {batchData.code || batchData.id}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => refreshData()}
                    style={{
                      background: "#fff",
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🔄 Refresh Data
                  </button>
                  <button
                    onClick={() => navigate("/tms/cp/batch-list")}
                    style={{
                      background: "#002174",
                      border: "none",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,33,116,0.2)",
                    }}
                  >
                    ← Back
                  </button>
                </div>
              </div>

              {/* CORE LOGIC WRAPPER */}
              {loading ? (
                <LiveDataLoader message="Syncing Live Batch Details..." />
              ) : error ? (
                <div
                  style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: 20,
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <h4>Error Loading Batch</h4>
                  <p>{error}</p>
                  <button
                    onClick={() => refreshData()}
                    style={{
                      padding: "8px 16px",
                      background: "#991b1b",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginTop: 10,
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : !batchData ? (
                <div
                  style={{
                    background: "#fff",
                    color: "#64748b",
                    padding: 40,
                    borderRadius: 8,
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  Batch not found or you do not have permission to view it.
                </div>
              ) : (
                <>
                  {/* NIC-Themed Stepper Header */}
                  <NicStepperHeader
                    activeStep={activeStep}
                    allEkycVerified={allEkycVerified}
                    batchId={batchId}
                    navigate={navigate}
                  />

                  {/* Top Statistics Cards */}
                  <NicStatsCards
                    batchData={batchData}
                    participants={participants}
                    ekycRows={ekycRows}
                    schedule={schedule}
                    today={today}
                  />

                  {/* DYNAMIC STEP RENDERING */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "10px",
                      padding: "24px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {activeStep === 1 && (
                      <EkycStepMain
                        batchId={batchId}
                        batchData={batchData}
                        schedule={schedule}
                        today={today}
                        participants={participants}
                        ekycRows={ekycRows}
                        allEkycVerified={allEkycVerified}
                        refreshData={refreshData}
                      />
                    )}

                    {activeStep === 2 && (
                      <AttendanceStepMain
                        batchId={batchId}
                        batchData={batchData}
                        schedule={schedule}
                        today={today}
                        participants={participants}
                        attendances={attendances}
                        attendanceToday={attendanceToday}
                        missingDates={missingDates}
                        refreshData={refreshData}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
