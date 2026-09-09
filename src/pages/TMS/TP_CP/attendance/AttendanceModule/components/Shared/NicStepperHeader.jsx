// src/pages/TMS/TP_CP/attendance/AttendanceModule/BatchAttendanceStepper.jsx
import React from "react";
import { FaFingerprint, FaClipboardCheck, FaCheck } from "react-icons/fa";

export default function NicStepperHeader({
  activeStep,
  allEkycVerified,
  batchId,
  navigate,
}) {
  const handleNavStep1 = () => {
    if (activeStep !== 1) {
      navigate(`/tms/cp/batch-attendance-ekyc/${batchId}`);
    }
  };

  const handleNavStep2 = () => {
    if (activeStep !== 2) {
      if (allEkycVerified) {
        navigate(`/tms/cp/batch-attendance/${batchId}`);
      } else {
        alert(
          "Please complete E-KYC Verification for all participants before accessing Daily Attendance.",
        );
      }
    }
  };

  return (
    <div className="nic-stepper-container">
      {/* Step 1: E-KYC */}
      <div
        className={`stepper-item ${activeStep === 1 ? "active" : ""} ${allEkycVerified ? "completed" : ""}`}
        onClick={handleNavStep1}
      >
        <div className="stepper-icon">
          {allEkycVerified && activeStep !== 1 ? (
            <FaCheck />
          ) : (
            <FaFingerprint />
          )}
        </div>
        <div className="stepper-text">
          <span className="step-label">Step 1</span>
          <span className="step-title">Day 1 E-KYC Setup</span>
        </div>
      </div>

      {/* Connecting Line */}
      <div
        className={`stepper-line ${allEkycVerified ? "line-completed" : ""}`}
      ></div>

      {/* Step 2: Attendance */}
      <div
        className={`stepper-item ${activeStep === 2 ? "active" : ""} ${!allEkycVerified ? "disabled" : ""}`}
        onClick={handleNavStep2}
      >
        <div className="stepper-icon">
          <FaClipboardCheck />
        </div>
        <div className="stepper-text">
          <span className="step-label">Step 2</span>
          <span className="step-title">Daily Attendance</span>
        </div>
      </div>

      <style>{`
        .nic-stepper-container {
          display: flex;
          align-items: center;
          justifyContent: center;
          background: #ffffff;
          padding: 20px 30px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        
        .stepper-item {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .stepper-item:hover:not(.disabled) {
          background: #f1f5f9;
        }

        .stepper-item.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .stepper-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #cbd5e1;
          transition: all 0.3s ease;
        }

        .stepper-text {
          display: flex;
          flex-direction: column;
        }

        .step-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .step-title {
          font-size: 16px;
          font-weight: 600;
          color: #334155;
        }

        /* Active State */
        .stepper-item.active .stepper-icon {
          background: #002174;
          color: #ffffff;
          border-color: #002174;
          box-shadow: 0 0 0 4px rgba(0, 33, 116, 0.1);
        }
        .stepper-item.active .step-title {
          color: #002174;
        }
        .stepper-item.active .step-label {
          color: #0092E0;
        }

        /* Completed State */
        .stepper-item.completed:not(.active) .stepper-icon {
          background: #0092E0;
          color: #ffffff;
          border-color: #0092E0;
        }

        .stepper-line {
          flex: 1;
          height: 3px;
          background: #e2e8f0;
          margin: 0 20px;
          border-radius: 2px;
          transition: background 0.3s ease;
        }

        .stepper-line.line-completed {
          background: #0092E0;
        }
      `}</style>
    </div>
  );
}
