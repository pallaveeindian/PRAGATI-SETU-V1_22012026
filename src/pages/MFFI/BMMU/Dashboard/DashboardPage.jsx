import React from "react";

export default function DashboardPage() {
  return (
    <div style={{
      backgroundColor: "white",
      padding: "40px 60px",
      borderRadius: "10px",
      border: "1px solid #C7D7F3",
      boxShadow: "0 4px 12px rgba(31, 60, 136, 0.1)",
      width: "100%", // Page ko poori width lene ke liye
    }}>
      <h1 style={{ color: "#1F3C88", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
        Dashboard 🎉
      </h1>
      <p style={{ color: "#2F5FB3", fontSize: "1.2rem", fontWeight: "500" }}>
        welcome to the MFFI Dashboard! Here you can manage applications, view reports, and monitor system performance. Use the sidebar to navigate through different sections of the dashboard.
      </p>
    </div>
  );
}