import React from "react";
import { StatCard, PipelineStep } from "./ReportSectionCard"; // Alag file se import kiya

export default function ReportSectionPage() {
  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ color: "#000", marginBottom: "20px" }}> Block Performance Report</h2>

      {/* Top Stat Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <StatCard title="Total Applications" count="150" color="#2F5FB3" />
        <StatCard title="Pending your Approval" count="45" color="#FF961C" textColor="#fff" />
        <StatCard title="Forwarded to DMM" count="105" color="#10b981" />
      </div>

      {/* Visual Pipeline based on Process Flow PDF */}
      <div style={styles.card}>
        <h3 style={{ color: "#1F3C88", marginTop: 0 }}>Application Process Flow Tracker</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}></p>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Step 1: Mobile App */}
          <PipelineStep step="1" title="Mobile App" subtitle="Applied by Beneficiaries" count="150" />
          <span style={styles.arrow}>➔</span>
          
          {/* Step 2: BMM Portal */}
          <PipelineStep step="2" title="BMM (FI)" subtitle="Verified by VO/CLF" count="105" active={true} />
          <span style={styles.arrow}>➔</span>
          
          {/* Step 3: DMM Portal */}
          <PipelineStep step="3" title="DMM (FI)" subtitle="Pending DMM Approval" count="60" />
          <span style={styles.arrow}>➔</span>

          {/* Step 4: Bank */}
          <PipelineStep step="4" title="Bank Branch" subtitle="Final Loan Approved" count="25" />
          
        </div>
      </div>
    </div>
  );
}

// Main page ke specific styles
const styles = {
  card: { backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(31, 60, 136, 0.1)" },
  arrow: { fontSize: "24px", color: "#cbd5e1" }
};