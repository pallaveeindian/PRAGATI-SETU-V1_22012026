import React from "react";

export default function DmmDashboardPage() {
  return (
    <div style={{
      backgroundColor: "white",
      padding: "40px 60px",
      borderRadius: "10px",
      border: "1px solid #C7D7F3",
      boxShadow: "0 4px 12px rgba(31, 60, 136, 0.1)",
      width: "100%",
    }}>
      <h1 style={{ color: "#1F3C88", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
        Welcome to DMMU Dashboard
      </h1>
      <p style={{ color: "#2F5FB3", fontSize: "1.2rem", fontWeight: "500" }}>
        This is the DMMU dashboard view.
      </p>
    </div>
  );
}