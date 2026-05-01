import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LDMS_API } from "../../../api/axios"; // Adjust path to your axios.js if needed
import { FaSave, FaArrowLeft, FaSpinner, FaBuilding } from "react-icons/fa";

export default function DLCCMeetCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    notif_date_from: "",
    notif_date_to: "",
    meeting_month: "",
    no_of_meetings: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear message on typing
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.notif_date_from ||
      !formData.notif_date_to ||
      !formData.meeting_month ||
      !formData.no_of_meetings
    ) {
      setMessage({ type: "error", text: "All fields are strictly required." });
      return;
    }

    // Ensure 'To' date is not strictly before 'From' date
    if (new Date(formData.notif_date_from) > new Date(formData.notif_date_to)) {
      setMessage({
        type: "error",
        text: "Notification 'To' date cannot be before 'From' date.",
      });
      return;
    }

    if (parseInt(formData.no_of_meetings) <= 0) {
      setMessage({
        type: "error",
        text: "Number of meetings must be at least 1.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        // Combine into the required "YYYY-MM-DD,YYYY-MM-DD" format
        notif_date: `${formData.notif_date_from},${formData.notif_date_to}`,
        meeting_month: formData.meeting_month,
        no_of_meetings: parseInt(formData.no_of_meetings),
      };

      await LDMS_API.CreateDLCCMeet(payload);

      setMessage({
        type: "success",
        text: "DLCC Meeting appointment scheduled successfully!",
      });

      // Clear form on success, wait briefly, then navigate back
      setFormData({
        notif_date_from: "",
        notif_date_to: "",
        meeting_month: "",
        no_of_meetings: "",
      });
      setTimeout(() => {
        navigate(-1); // Go back to the list
      }, 1500);
    } catch (error) {
      console.error("Failed to create meeting:", error);
      const errorText =
        error?.response?.data?.error ||
        "Failed to schedule meetings. Please check your permissions.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nic-detail-dashboard">
      <div className="nic-detail-card">
        {/* Header Section */}
        <div className="nic-card-header">
          <div className="header-title">
            <FaBuilding className="title-icon" />
            <h2>Schedule DLCC Meeting Notification</h2>
          </div>
          <button
            className="nic-btn nic-btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <FaArrowLeft /> Back to List
          </button>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            className={`nic-alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
          >
            {message.text}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="nic-form">
          <div className="nic-form-row">
            <div className="nic-form-group">
              <label>
                Notice Period (From) <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="notif_date_from"
                value={formData.notif_date_from}
                onChange={handleChange}
                className="nic-input"
                required
                disabled={loading}
              />
              <small className="help-text">
                Start date of the notification window.
              </small>
            </div>

            <div className="nic-form-group">
              <label>
                Notice Period (To) <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="notif_date_to"
                value={formData.notif_date_to}
                min={formData.notif_date_from} // Locks calendar to prevent picking dates before 'From'
                onChange={handleChange}
                className="nic-input"
                required
                disabled={loading}
              />
              <small className="help-text">
                End date of the notification window.
              </small>
            </div>

            <div className="nic-form-group">
              <label>
                Target Meeting Month <span className="text-danger">*</span>
              </label>
              <input
                type="month"
                name="meeting_month"
                value={formData.meeting_month}
                onChange={handleChange}
                className="nic-input"
                required
                disabled={loading}
              />
              <small className="help-text">
                Month when the meetings will occur.
              </small>
            </div>

            <div className="nic-form-group">
              <label>
                Number of Meetings <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="no_of_meetings"
                value={formData.no_of_meetings}
                onChange={handleChange}
                className="nic-input"
                placeholder="e.g., 3"
                min="1"
                max="10"
                required
                disabled={loading}
              />
              <small className="help-text">
                Blank schedules will be auto-generated.
              </small>
            </div>
          </div>

          <div className="nic-form-footer">
            <button
              type="submit"
              className="nic-btn nic-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="nic-spinner" /> Processing...
                </>
              ) : (
                <>
                  <FaSave /> Schedule Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .nic-detail-dashboard {
          padding: 16px;
          background: #f3f4f6;
          min-height: 100vh;
        }

        .nic-detail-card {
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          max-width: 1000px;
          margin: 0 auto;
        }

        .nic-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 2px solid #7a0c0c;
          background: #fafafa;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          font-size: 20px;
          color: #7a0c0c;
        }

        .header-title h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #400b0b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nic-form {
          padding: 24px;
        }

        .nic-form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .nic-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nic-form-group label {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
        }

        .text-danger {
          color: #dc2626;
        }

        .help-text {
          font-size: 12px;
          color: #6b7280;
        }

        .nic-input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          background: #fff;
          transition: border-color 0.2s;
        }

        .nic-input:focus {
          outline: none;
          border-color: #7a0c0c;
          box-shadow: 0 0 0 2px rgba(122,12,12,0.1);
        }

        .nic-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .nic-form-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .nic-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nic-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .nic-btn-primary {
          background: #7a0c0c;
          color: #fff;
          border: 1px solid #7a0c0c;
        }

        .nic-btn-primary:hover:not(:disabled) {
          background: #5c0909;
        }

        .nic-btn-secondary {
          background: #fff;
          color: #4b5563;
          border: 1px solid #d1d5db;
        }

        .nic-btn-secondary:hover:not(:disabled) {
          background: #f3f4f6;
          color: #1f2937;
        }

        .nic-alert {
          margin: 16px 24px 0 24px;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }

        .alert-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .nic-spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .nic-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
