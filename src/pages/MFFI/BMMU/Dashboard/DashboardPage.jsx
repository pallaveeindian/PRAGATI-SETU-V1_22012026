import React from "react";

export default function DashboardPage() {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "40px 60px",
        borderRadius: "10px",
        border: "1px solid #EF9C6A",
        boxShadow: "0 4px 12px rgba(136, 82, 31, 0.8)",
        width: "100%",
      }}
    >
      <h1
        style={{ color: "#7e3000", fontSize: "2.5rem", margin: "0 0 10px 0" }}
      >
        Dashboard
      </h1>
      <p style={{ color: "#EF9C6A", fontSize: "1.2rem", fontWeight: "500" }}>
        Welcome to the MCCY Dashboard! Here you can manage applications, view
        reports, and monitor system performance. Use the sidebar to navigate
        through different sections of the dashboard.
      </p>
    </div>
  );
}
