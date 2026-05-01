import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LDMS_API } from "../../../api/axios";
import {
  FaUpload,
  FaArrowLeft,
  FaSpinner,
  FaCalendarCheck,
} from "react-icons/fa";

export default function DLCCMeetUpload() {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieves the specific meeting ID from the URL

  const [meetingDate, setMeetingDate] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic frontend validation matching your backend magic bytes check
      const validExtensions = ["pdf", "doc", "docx", "png", "jpg", "jpeg"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        setMessage({
          type: "error",
          text: "Invalid file type. Please upload a PDF, Word document, or Image.",
        });
        setFile(null);
        e.target.value = null; // Clear the input
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File is too large. Maximum allowed size is 5MB.",
        });
        setFile(null);
        e.target.value = null;
        return;
      }

      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meetingDate && !file) {
      setMessage({
        type: "error",
        text: "Please provide either a Meeting Date or a MoM file to update.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Since we are sending files, we MUST use FormData
      const formData = new FormData();

      if (meetingDate) {
        formData.append("meeting_date", meetingDate);
      }
      if (file) {
        formData.append("mom", file);
      }

      await LDMS_API.UpdateDLCCMeetSchedule(id, formData);

      setMessage({
        type: "success",
        text: "Meeting details updated securely!",
      });

      setTimeout(() => {
        navigate(-1); // Go back to the list
      }, 1500);
    } catch (error) {
      console.error("Failed to update meeting:", error);

      // Extract the strict backend error messages (like Magic Bytes validation failures)
      let errorText = "An error occurred while updating.";
      if (error?.response?.data) {
        if (typeof error.response.data === "object") {
          // DRF usually returns field-specific errors
          const fieldErrors = Object.values(error.response.data).flat();
          errorText = fieldErrors[0] || errorText;
        } else {
          errorText = error.response.data;
        }
      }

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
            <FaCalendarCheck className="title-icon" />
            <h2>Update Meeting Schedule & Upload MoM</h2>
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
              <label>Actual Meeting Date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="nic-input"
                disabled={loading}
              />
              <small className="help-text">
                Leave blank if you are only uploading a file.
              </small>
            </div>

            <div className="nic-form-group">
              <label>Minutes of Meeting (MoM) Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="nic-input nic-file-input"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                disabled={loading}
              />
              <small className="help-text">
                Max 5MB. Strict security check enabled. Allowed: PDF, DOC, DOCX,
                JPG, PNG.
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
                  <FaSpinner className="nic-spinner" /> Securely Uploading...
                </>
              ) : (
                <>
                  <FaUpload /> Update Record
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
          max-width: 800px;
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
          display: flex;
          flex-direction: column;
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

        .nic-file-input {
          padding: 8px 12px;
        }
        
        .nic-file-input::file-selector-button {
          background: #e5e7eb;
          border: 1px solid #d1d5db;
          padding: 4px 12px;
          border-radius: 4px;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          margin-right: 12px;
          transition: background 0.2s;
        }
        .nic-file-input::file-selector-button:hover {
          background: #d1d5db;
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
