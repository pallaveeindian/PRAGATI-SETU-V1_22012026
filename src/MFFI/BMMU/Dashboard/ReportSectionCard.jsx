import React from "react";

// Top Stats Card Component
export const StatCard = ({ title, count, color, textColor = "white" }) => (
  <div style={{ flex: 1, backgroundColor: color, color: textColor, padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
    <h4 style={{ margin: "0 0 10px 0", fontSize: "16px", opacity: 0.9 }}>{title}</h4>
    <h2 style={{ margin: 0, fontSize: "32px" }}>{count}</h2>
  </div>
);

// Pipeline Process Step Component
export const PipelineStep = ({ step, title, subtitle, count, active }) => (
  <div style={{ textAlign: "center", flex: 1, padding: "15px", backgroundColor: active ? "#FFf2E3" : "#f8fafc", border: active ? "2px solid #FF961C" : "1px solid #e2e8f0", borderRadius: "10px" }}>
    <div style={{ backgroundColor: active ? "#FF961C" : "#94a3b8", color: "white", width: "30px", height: "30px", borderRadius: "15px", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 10px auto", fontWeight: "bold" }}>
      {step}
    </div>
    <h4 style={{ color: "#1F3C88", margin: "0 0 5px 0" }}>{title}</h4>
    <p style={{ color: "#64748b", margin: "0 0 10px 0", fontSize: "12px" }}>{subtitle}</p>
    <strong style={{ fontSize: "20px", color: "#0f172a" }}>{count}</strong>
  </div>
);