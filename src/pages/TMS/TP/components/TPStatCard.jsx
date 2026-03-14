import React from "react";

export default function TPStatCard({ title, value, icon }) {
  return (
    <div className="tp-stat-card">
      <div className="tp-stat-icon">{icon}</div>

      <div>
        <div className="tp-stat-title">{title}</div>
        <div className="tp-stat-value">{value}</div>
      </div>
    </div>
  );
}
