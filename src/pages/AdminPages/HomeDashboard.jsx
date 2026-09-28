// src/pages/AdminPages/HomeDashboard.jsx
import React from "react";

export default function HomeDashboard() {
  
  const glassCardStyle = {
    backgroundColor: "rgba(10, 15, 45, 0.4)", 
    backdropFilter: "blur(10px)", 
    border: "1px solid rgba(0, 212, 255, 0.3)", 
    borderRadius: "12px",
    padding: "1.2rem",
    boxShadow: "0 4px 15px rgba(0, 212, 255, 0.15)", 
    color: "#fff", 
  };

  // Common text styles for the KPI cards
  const textCyan = { color: "#00d4ff", fontSize: "0.8rem", fontWeight: "600", letterSpacing: "1px" };
  const textNumber = { fontSize: "1.8rem", fontWeight: "bold", margin: "0.2rem 0" };
  const textGreen = { color: "#10b981", fontSize: "0.8rem" };

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100%",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        justifyContent: "space-between", 
        boxSizing: "border-box"
      }}
    >
      {/* ================= LEFT SECTION (KPI Cards, Bar Chart, Donut Chart) ================= */}
      <div style={{ width: "35%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Top KPI Cards Grid (Total Target, Onboarded, etc.) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ ...glassCardStyle, borderLeft: "4px solid #00d4ff" }}>
            <div style={textCyan}>TOTAL TARGET</div>
            <div style={textNumber}>419</div>
            <div style={textGreen}>↑ 12%</div>
          </div>
          <div style={{ ...glassCardStyle, borderLeft: "4px solid #8b5cf6" }}>
            <div style={{ ...textCyan, color: "#a78bfa" }}>ONBOARDED</div>
            <div style={textNumber}>0</div>
            <div style={textGreen}>↑ 0%</div>
          </div>
          <div style={{ ...glassCardStyle, borderLeft: "4px solid #00d4ff" }}>
            <div style={textCyan}>BATCHES FORMED</div>
            <div style={textNumber}>11</div>
            <div style={textGreen}>↑ 10%</div>
          </div>
          <div style={{ ...glassCardStyle, borderLeft: "4px solid #ec4899" }}>
            <div style={{ ...textCyan, color: "#f472b6" }}>COMPLETED</div>
            <div style={textNumber}>8</div>
            <div style={textGreen}>↑ 33%</div>
          </div>
          <div style={{ ...glassCardStyle, borderLeft: "4px solid #3b82f6" }}>
            <div style={{ ...textCyan, color: "#60a5fa" }}>ACHIEVEMENT</div>
            <div style={textNumber}>0%</div>
            <div style={textGreen}>↑ 0%</div>
          </div>
        </div>

        {/* Progress Drives Impact (Mock Bar Chart) */}
        <div style={glassCardStyle}>
          <div style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "1rem" }}>
            Progress <br /> Drives <br /> Impact
          </div>
          {/* Pure CSS Bar Chart Representation */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
            {[40, 60, 30, 80, 50, 90, 70, 100].map((height, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  backgroundColor: "#3b82f6", 
                  height: `${height}%`, 
                  borderRadius: "4px 4px 0 0", 
                  backgroundImage: "linear-gradient(to top, #1e3a8a, #3b82f6)" 
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Achievement Status (Mock Donut Chart & Legends) */}
        <div style={{ ...glassCardStyle, display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Pure CSS Donut Chart using conic-gradient */}
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "conic-gradient(#00d4ff 0% 76%, #8b5cf6 76% 88%, #ec4899 88% 96%, #06b6d4 96% 100%)",
            display: "flex", justifyContent: "center", alignItems: "center",
            boxShadow: "0 0 15px rgba(0, 212, 255, 0.4)"
          }}>
            {/* Inner dark circle to create the "donut" hole effect */}
            <div style={{ width: "75px", height: "75px", backgroundColor: "#0b102a", borderRadius: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>76%</span>
              <span style={{ fontSize: "0.5rem", color: "#cbd5e1" }}>Achievement</span>
            </div>
          </div>
          
          {/* Chart Legends */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", width: "100%" }}>
            {[ 
              { label: "Completed", val: "76%", color: "#00d4ff" }, 
              { label: "Onboarding", val: "12%", color: "#8b5cf6" },
              { label: "Pending", val: "8%", color: "#ec4899" },
              { label: "Ongoing", val: "4%", color: "#06b6d4" }
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.color }}></span>
                  {item.label}
                </span>
                <span>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT SECTION (Line Chart, Table, Bottom Widget) ================= */}
      <div style={{ width: "35%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "1.5rem", position: "relative", paddingTop: "60px" }}>
        
        
        

        {/* Growth/Efficiency/Impact (Mock Line Chart using SVG) */}
        <div style={{ ...glassCardStyle, display: "flex", gap: "1rem" }}>
           <div style={{ flex: 1, position: "relative", height: "60px", borderBottom: "1px solid rgba(255,255,255,0.1)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
             {/* Simple SVG Zig-Zag Line */}
             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
               <polyline points="0,30 20,20 40,25 60,10 80,15 100,5" fill="none" stroke="#00d4ff" strokeWidth="2" />
               <circle cx="20" cy="20" r="2" fill="#fff" />
               <circle cx="40" cy="25" r="2" fill="#fff" />
               <circle cx="60" cy="10" r="2" fill="#fff" />
               <circle cx="80" cy="15" r="2" fill="#fff" />
               <circle cx="100" cy="5" r="2" fill="#fff" />
             </svg>
           </div>
           {/* Line Chart Legend */}
           <div style={{ fontSize: "0.75rem", display: "flex", flexDirection: "column", gap: "4px", justifyContent: "center" }}>
              <div style={{ color: "#00d4ff" }}>● GROWTH</div>
              <div style={{ color: "#a78bfa" }}>● EFFICIENCY</div>
              <div style={{ color: "#34d399" }}>● IMPACT</div>
           </div>
        </div>

        {/* Top Districts Data Table */}
        <div style={glassCardStyle}>
          <div style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem", letterSpacing: "1px" }}>TOP DISTRICTS</div>
          <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ paddingBottom: "8px" }}>District</th>
                <th style={{ paddingBottom: "8px" }}>Target</th>
                <th style={{ paddingBottom: "8px" }}>Onboarded</th>
                <th style={{ paddingBottom: "8px" }}>Achievement</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Lucknow", target: 120, onb: 98, ach: "81%", width: "81%" },
                { name: "Varanasi", target: 86, onb: 72, ach: "84%", width: "84%" },
                { name: "Gorakhpur", target: 64, onb: 51, ach: "80%", width: "80%" },
                { name: "Kanpur", target: 48, onb: 36, ach: "75%", width: "75%" },
                { name: "Agra", target: 32, onb: 21, ach: "66%", width: "66%" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "8px 0" }}>{row.name}</td>
                  <td>{row.target}</td>
                  <td>{row.onb}</td>
                  {/* Inline progress bar for achievement column */}
                  <td style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0" }}>
                    <span>{row.ach}</span>
                    <div style={{ height: "6px", width: "40px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: row.width, height: "100%", backgroundColor: "#00d4ff", boxShadow: "0 0 5px #00d4ff" }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Towards a Digital India Widget */}
        <div style={{ ...glassCardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Icon Placeholder */}
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #8b5cf6", display: "flex", justifyContent: "center", alignItems: "center", color: "#8b5cf6" }}>
                 <span style={{ fontSize: "1.2rem" }}>📈</span>
              </div>
              <div>
                 <div style={{ fontSize: "0.65rem", color: "#cbd5e1", letterSpacing: "1px" }}>TOWARDS A</div>
                 <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>DIGITAL INDIA</div>
              </div>
           </div>
           {/* Gradient Progress Bar */}
           <div style={{ width: "120px", height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: "70%", height: "100%", background: "linear-gradient(90deg, #8b5cf6, #ec4899)" }}></div>
           </div>
        </div>

      </div>
    </div>
  );
}