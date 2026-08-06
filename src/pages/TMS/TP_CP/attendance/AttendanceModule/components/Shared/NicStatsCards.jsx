// src/pages/TMS/TP_CP/attendance/AttendanceModule/BatchAttendanceStepper.jsx
import React from "react";
import { FaUsers, FaUserCheck, FaUserClock, FaClock } from "react-icons/fa";

export default function NicStatsCards({ participants, ekycRows, schedule }) {
  const totalAssigned = participants?.length || 0;

  const totalVerified =
    ekycRows?.filter((r) => r.ekyc_status === "VERIFIED").length || 0;

  const pendingEkyc = totalAssigned - totalVerified;

  const formatTo12Hour = (time) => {
    if (!time) return "Not Set";
    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    let hh12 = hour % 12;
    if (hh12 === 0) hh12 = 12;
    return `${hh12.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  const startTime = formatTo12Hour(schedule?.start_time);

  return (
    <div className="nic-stats-grid">
      {/* Card 1: Total Participants */}
      <div className="nic-stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: "#e0e7ff", color: "#3730a3" }}
        >
          <FaUsers />
        </div>
        <div className="stat-info">
          <div className="stat-label">Total Assigned</div>
          <div className="stat-value">{totalAssigned}</div>
        </div>
      </div>

      {/* Card 2: E-KYC Verified */}
      <div className="nic-stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: "#dcfce7", color: "#166534" }}
        >
          <FaUserCheck />
        </div>
        <div className="stat-info">
          <div className="stat-label">E-KYC Verified</div>
          <div className="stat-value" style={{ color: "#166534" }}>
            {totalVerified}
          </div>
        </div>
      </div>

      {/* Card 3: Pending E-KYC */}
      <div className="nic-stat-card">
        <div
          className="stat-icon-wrapper"
          style={{
            background: pendingEkyc > 0 ? "#fee2e2" : "#f1f5f9",
            color: pendingEkyc > 0 ? "#991b1b" : "#64748b",
          }}
        >
          <FaUserClock />
        </div>
        <div className="stat-info">
          <div className="stat-label">Pending E-KYC</div>
          <div
            className="stat-value"
            style={{ color: pendingEkyc > 0 ? "#dc2626" : "#475569" }}
          >
            {pendingEkyc}
          </div>
        </div>
      </div>

      {/* Card 4: Daily Start Time */}
      <div className="nic-stat-card">
        <div
          className="stat-icon-wrapper"
          style={{ background: "#e0f2fe", color: "#0369a1" }}
        >
          <FaClock />
        </div>
        <div className="stat-info">
          <div className="stat-label">Daily Start Time</div>
          <div
            className="stat-value"
            style={{ fontSize: "18px", color: "#002174" }}
          >
            {startTime}
          </div>
        </div>
      </div>

      <style>{`
        .nic-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .nic-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nic-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px rgba(0,0,0,0.05);
          border-color: #0092E0;
        }

        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}
