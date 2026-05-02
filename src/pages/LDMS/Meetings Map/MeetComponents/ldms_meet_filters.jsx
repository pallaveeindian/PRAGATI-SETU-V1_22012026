// src/pages/LDMS/Meetings Map/MeetComponents/ldms_meet_filters.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUndo, FaPlus } from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthContext";

export default function MeetFilters({ filters, setFilters }) {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [localMonth, setLocalMonth] = useState(filters.meetingMonth || "");
  const [localDate, setLocalDate] = useState(filters.notifDate || "");

  const role = user?.role_id;
  const isBMMU = role == 1;
  const isDMMU = role == 2;
  const isSMMU = role == 3;

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      meetingMonth: localMonth,
      notifDate: localDate,
    }));
  };

  const handleReset = () => {
    setLocalMonth("");
    setLocalDate("");
    setFilters((prev) => ({
      ...prev,
      meetingMonth: "",
      notifDate: "",
    }));
  };

  return (
    <div className="nic-filter-bar">
      {/* LEFT SIDE: Filters */}
      <div className="filter-left-group">
        <div className="nic-form-group">
          <label>Meeting Month</label>
          <input
            type="month"
            value={localMonth}
            onChange={(e) => setLocalMonth(e.target.value)}
            className="nic-input"
          />
        </div>

        <div className="nic-form-group">
          <label>Notification Date</label>
          <input
            type="date"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className="nic-input"
          />
        </div>

        <div className="nic-filter-actions">
          <button className="nic-btn nic-btn-primary" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
          <button className="nic-btn nic-btn-secondary" onClick={handleReset}>
            <FaUndo /> Reset
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="filter-right-group">
        {(isDMMU || isSMMU) && (
          <button
            className="nic-btn nic-btn-success"
            onClick={() =>
              navigate("/ldms/meetings-dlcc/create")
            } /* Adjust this route path to match your App.js routing */
          >
            <FaPlus /> Create DLCC Appointment
          </button>
        )}
      </div>

      <style>{`
        .nic-filter-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-end;
          background: #fafafa;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          gap: 16px;
        }

        .filter-left-group {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: flex-end;
        }

        .filter-right-group {
          display: flex;
          align-items: flex-end;
        }

        .nic-btn-success {
          background: #15803d;
          color: #fff;
          border: 1px solid #15803d;
        }

        .nic-btn-success:hover {
          background: #166534;
        }

        .nic-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nic-form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #400b0b;
        }

        .nic-input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          min-width: 200px;
          background: #fff;
        }

        .nic-input:focus {
          outline: none;
          border-color: #7a0c0c;
          box-shadow: 0 0 0 2px rgba(122,12,12,0.1);
        }

        .nic-filter-actions {
          display: flex;
          gap: 12px;
        }

        .nic-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-btn-primary {
          background: #7a0c0c;
          color: #fff;
          border: 1px solid #7a0c0c;
        }

        .nic-btn-primary:hover {
          background: #5c0909;
        }

        .nic-btn-secondary {
          background: #fff;
          color: #4b5563;
          border: 1px solid #d1d5db;
        }

        .nic-btn-secondary:hover {
          background: #f3f4f6;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}
