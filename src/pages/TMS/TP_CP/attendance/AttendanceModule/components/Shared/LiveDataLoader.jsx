// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Shared/LiveDataLoader.jsx
import React from "react";

export default function LiveDataLoader({ message = "Loading Live Data..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        background: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        minHeight: "400px",
      }}
    >
      <div className="nic-spinner"></div>
      <h3 style={{ marginTop: "20px", color: "#002174", fontWeight: 600 }}>
        {message}
      </h3>
      <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>
        Please wait while we fetch the latest records from the server.
      </p>

      <style>{`
        .nic-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #0092E0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
