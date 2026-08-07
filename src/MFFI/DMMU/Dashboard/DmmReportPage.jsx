import React, { useState } from "react";

// --- MOCK REPORT DATA ---
const blockWiseReport = [
  { id: 1, block: "A", totalApps: 150, pendingDmm: 45, forwardedBank: 100, revertedBmm: 5 },
  { id: 2, block: "B", totalApps: 120, pendingDmm: 30, forwardedBank: 85, revertedBmm: 5 },
  { id: 3, block: "C", totalApps: 210, pendingDmm: 50, forwardedBank: 150, revertedBmm: 10 },
  { id: 4, block: "D", totalApps: 90, pendingDmm: 15, forwardedBank: 70, revertedBmm: 5 },
  { id: 5, block: "E", totalApps: 180, pendingDmm: 40, forwardedBank: 135, revertedBmm: 5 },
];

export default function DmmReportSectionPage() {
  const [filterMonth, setFilterMonth] = useState("October 2023");

  // Calculate Totals for Top Cards
  const totalApplications = blockWiseReport.reduce((acc, curr) => acc + curr.totalApps, 0);
  const totalPending = blockWiseReport.reduce((acc, curr) => acc + curr.pendingDmm, 0);
  const totalForwarded = blockWiseReport.reduce((acc, curr) => acc + curr.forwardedBank, 0);
  const totalReverted = blockWiseReport.reduce((acc, curr) => acc + curr.revertedBmm, 0);

  const handleExport = () => {
    alert("Report downloading as CSV... (Dummy Action)");
  };

  return (
    <div style={{ padding: "15px", fontFamily: "'Inter', sans-serif", backgroundColor: "#fff", height: "100vh", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      
      {/* 🟢 Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div>
          <h2 style={{ color: "#1e293b", margin: 0, fontSize: "20px", fontWeight: "700" }}>DMM Reports & Analytics</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "13px" }}>District wide application summary</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={styles.selectInput}>
            <option value="All Time">All Time</option>
            <option value="October 2023">October 2023</option>
            <option value="September 2023">September 2023</option>
          </select>
          <button style={styles.exportBtn} onClick={handleExport}>
             Export CSV
          </button>
        </div>
      </div>

      {/* 🟢 Summary Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "15px" }}>
        
        <div style={{...styles.card, borderTop: "4px solid #3b82f6"}}>
          <div style={styles.cardTitle}>Total Received from BMM</div>
          <div style={{...styles.cardValue, color: "#1e293b"}}>{totalApplications}</div>
        </div>
        
        <div style={{...styles.card, borderTop: "4px solid #eab308"}}>
          <div style={styles.cardTitle}>Pending at DMM</div>
          <div style={{...styles.cardValue, color: "#a16207"}}>{totalPending}</div>
        </div>

        <div style={{...styles.card, borderTop: "4px solid #22c55e"}}>
          <div style={styles.cardTitle}>Forwarded to Banks</div>
          <div style={{...styles.cardValue, color: "#15803d"}}>{totalForwarded}</div>
        </div>

        <div style={{...styles.card, borderTop: "4px solid #ef4444"}}>
          <div style={styles.cardTitle}>Reverted to BMM</div>
          <div style={{...styles.cardValue, color: "#b91c1c"}}>{totalReverted}</div>
        </div>

      </div>

      {/* 🟢 Block-Wise Report Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <div style={{ padding: "12px 15px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#334155", fontSize: "14px", fontWeight: "600" }}>Block-Wise Performance Report</h3>
        </div>
        
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8fafc", zIndex: 1 }}>
              <tr style={{ textAlign: "left" }}>
                <th style={{...styles.th, width: "60px"}}>Sr No.</th>
                <th style={styles.th}>Block Name</th>
                <th style={{...styles.th, textAlign: "center"}}>Total Received</th>
                <th style={{...styles.th, textAlign: "center"}}>Pending (DMM)</th>
                <th style={{...styles.th, textAlign: "center"}}>Forwarded (Bank)</th>
                <th style={{...styles.th, textAlign: "center"}}>Reverted (BMM)</th>
                <th style={styles.th}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {blockWiseReport.map((row, index) => {
                // Calculate completion percentage
                const progressPercentage = Math.round((row.forwardedBank / row.totalApps) * 100);

                return (
                  <tr key={row.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={{ color: "#64748b", fontWeight: "600", fontSize: "13px" }}>{index + 1}</div>
                    </td>
                    
                    <td style={styles.td}>
                      <div style={{ color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>Block {row.block}</div>
                      <div style={{ color: "#64748b", fontSize: "11px" }}>Lucknow District</div>
                    </td>

                    <td style={{...styles.td, textAlign: "center"}}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>{row.totalApps}</div>
                    </td>

                    <td style={{...styles.td, textAlign: "center"}}>
                      <span style={{ backgroundColor: "#fef9c3", color: "#a16207", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                        {row.pendingDmm}
                      </span>
                    </td>

                    <td style={{...styles.td, textAlign: "center"}}>
                      <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                        {row.forwardedBank}
                      </span>
                    </td>

                    <td style={{...styles.td, textAlign: "center"}}>
                      <span style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                        {row.revertedBmm}
                      </span>
                    </td>

                    {/* Progress Bar Column */}
                    <td style={{...styles.td, width: "150px"}}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${progressPercentage}%`, height: "100%", backgroundColor: "#22c55e", borderRadius: "3px" }}></div>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", width: "30px" }}>{progressPercentage}%</span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const styles = {
  // Cards
  card: { backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "center" },
  cardTitle: { color: "#64748b", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", marginBottom: "5px", letterSpacing: "0.5px" },
  cardValue: { fontSize: "24px", fontWeight: "700" },

  // Buttons & Inputs
  selectInput: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px", color: "#334155", backgroundColor: "#fff", cursor: "pointer" },
  exportBtn: { backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)" },

  // Table
  th: { padding: "12px 15px", color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "600", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px 15px", verticalAlign: "middle" },
  tableRow: { borderBottom: "1px solid #f1f5f9" },
};