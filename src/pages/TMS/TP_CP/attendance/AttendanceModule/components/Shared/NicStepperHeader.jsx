// // src/pages/TMS/TP_CP/attendance/AttendanceModule/BatchAttendanceStepper.jsx

import React from "react";
import { FaClipboardCheck } from "react-icons/fa";

export default function NicStepperHeader() {
  return (
    <div className="nic-stepper-container">
      {/* Attendance Only */}
      <div className="stepper-item active">
        <div className="stepper-icon">
          <FaClipboardCheck />
        </div>

        <div className="stepper-text">
          <span className="step-label">Attendance Management</span>
          <span className="step-title">Daily Attendance</span>
        </div>
      </div>

      <style>{`
        .nic-stepper-container {
          display: flex;
          align-items: center;
          justify-content: center;
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
          padding: 10px 20px;
          border-radius: 8px;
        }

        .stepper-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: #002174;
          color: #ffffff;
          border: 2px solid #002174;
          box-shadow: 0 0 0 4px rgba(0, 33, 116, 0.1);
        }

        .stepper-text {
          display: flex;
          flex-direction: column;
        }

        .step-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #0092e0;
          letter-spacing: 0.5px;
        }

        .step-title {
          font-size: 16px;
          font-weight: 600;
          color: #002174;
        }
      `}</style>
    </div>
  );
}
