// src\pages\StateLoginPortal\TMSStateLoginDashboard\TMSSummaryExport.jsx
import React from "react";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

export default function TMSSummaryExport({
  reportData,
  financialYear,
  disabled,
}) {
  const handleExportDirectExcel = () => {
    if (!reportData) return;
    const { report_date, state_wide_summary, district_summaries } = reportData;

    // Helper to safely extract values
    const val = (v) => (v !== null && v !== undefined ? v : 0);

    // Prepare rows array
    const rows = [];

    // Row 1: Title
    rows.push([
      `PRAGATI SETU-TMS PORTAL SUMMARY REPORT - DATED: ${report_date} - FY: ${financialYear}`,
    ]);

    // Row 2: Empty for spacing
    rows.push([]);

    // Row 3: Main Headers
    rows.push([
      "S. No.",
      "District / State Name",
      "Total batches Created",
      "Created Batches Participant Count",
      "Scheduled Batches",
      "Scheduled Batches Participant Count",
      "Batches Pending At DMM",
      "Batches Pending At DMM Participant Count",
      "Ongoing Batches",
      "Ongoing Batches Participant Count",
      "Completed Batches",
      "Completed Batches Participant Count",
      "Completed Batches for Verification",
      "Completed Batches for Verification Participant Count",
      "Completed batch Closed",
      "Completed batch Closed Participant Count",
      "Batches Rejected By DMM",
      "Batches Rejected By DMM Participant Count",
      "Total Batches Completed (10+12+14)",
      "Total Batches Completed Participant Count",
      "Total Target (Slot 1+2)",
      "Participants Onboarded",
      "Participants Enrolled In Batches",
      "Remaining Participants for Enrollment",
      "Achievement %",
    ]);

    // Row 4: Numbered Sub-headers
    rows.push([
      "",
      "",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "10",
      "11",
      "12",
      "13",
      "14",
    ]);

    // Helper to map an individual summary object into the flattened 25-column array
    const extractRowData = (sno, name, summary) => {
      const b = summary.batch_counts || {};
      const p = summary.participant_counts || {};
      return [
        sno,
        name,
        val(b["1_total_batches_created"]),
        val(p["1_total_batches_created"]),
        val(b["2_scheduled_batches"]),
        val(p["2_scheduled_batches"]),
        val(b["3_batches_pending_at_dmm"]),
        val(p["3_batches_pending_at_dmm"]),
        val(b["4_ongoing_batches"]),
        val(p["4_ongoing_batches"]),
        val(b["5_completed_batches"]),
        val(p["5_completed_batches"]),
        val(b["6_completed_batches_for_verification"]),
        val(p["6_completed_batches_for_verification"]),
        val(b["7_completed_batch_closed"]),
        val(p["7_completed_batch_closed"]),
        val(b["8_batches_rejected_by_dmm"]),
        val(p["8_batches_rejected_by_dmm"]),
        val(b["9_total_batches_completed"]),
        val(p["9_total_batches_completed"]),
        val(b["10_total_target"]),
        val(p["11_participants_onboarded"]),
        val(p["12_participants_enrolled_in_batches"]),
        val(p["13_remaining_participants_for_enrollment"]),
        val(b["14_achievement_percentage"]),
      ];
    };

    // Row 5: State Wide Summary (Forced to "Uttar Pradesh" per requirements)
    rows.push(extractRowData("—", "Uttar Pradesh", state_wide_summary));

    // Rows 6+: District Summaries
    if (district_summaries && district_summaries.length > 0) {
      district_summaries.forEach((dist, idx) => {
        rows.push(extractRowData(idx + 1, dist.district_name, dist.summary));
      });
    }

    // Convert arrays to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Auto-size columns slightly for readability
    const wscols = [{ wch: 6 }, { wch: 25 }];
    for (let i = 2; i < 25; i++) wscols.push({ wch: 18 });
    worksheet["!cols"] = wscols;

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TMS Summary");

    // Trigger Download
    XLSX.writeFile(workbook, `TMS_Portal_Summary_Report_${financialYear}.xlsx`);
  };

  return (
    <button
      className="btn-export"
      onClick={handleExportDirectExcel}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#10b981",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(16,185,129,0.2)",
      }}
    >
      <FaFileExcel /> Export Excel
    </button>
  );
}
