// src\pages\StateLoginPortal\TMSStateLoginDashboard\TMSPortalSummary.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaDownload, FaSpinner, FaChartBar, FaSearch } from "react-icons/fa";
import api from "../../../api/axios";

export default function TMSPortalSummary({ financialYear }) {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Report Data
  const fetchReport = useCallback(async () => {
    if (!financialYear) return;

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await api.get("/tms/reports/portal-summary/", {
        params: { financial_year: financialYear },
      });
      if (response.data?.status === "success") {
        setReportData(response.data);
      } else {
        setError("Failed to load report data.");
      }
    } catch (err) {
      console.error("Error fetching Portal Summary Report:", err);
      setError(
        err?.response?.data?.error ||
          "Failed to load the report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [financialYear]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Filtered Districts Logic
  const filteredDistricts = useMemo(() => {
    if (!reportData?.district_summaries) return [];
    if (!searchQuery.trim()) return reportData.district_summaries;

    const query = searchQuery.toLowerCase();
    return reportData.district_summaries.filter((dist, index) => {
      const sno = (index + 1).toString();
      const distName = (dist.district_name || "").toLowerCase();
      return sno.includes(query) || distName.includes(query);
    });
  }, [reportData, searchQuery]);

  // ======================================================================
  // BEAUTIFUL EXCEL EXPORT (HTML to XLS trick for precise styling)
  // ======================================================================
  const handleExportExcel = () => {
    if (!reportData) return;
    const { report_date, state_wide_summary, district_summaries } = reportData;

    // Helper to extract values
    const val = (v) => (v !== null && v !== undefined ? v : "");

    // Helper to generate stacked HTML cells for Excel
    const getStackedCell = (b, p, cls = "") => `
      <td class="${cls}">
        <span class="val-batch">${val(b)}</span>
        <br style="mso-data-placement:same-cell;"/>
        <span class="val-pax">${val(p)}</span>
      </td>
    `;

    // Row Generator
    const generateRow = (sno, name, summary) => {
      const b = summary.batch_counts || {};
      const p = summary.participant_counts || {};
      return `
        <tr>
          <td>${sno}</td>
          <td style="text-align: left;">
            <span class="dist-name">${name}</span><br style="mso-data-placement:same-cell;"/>
            <span class="val-batch">Batch Count</span><br style="mso-data-placement:same-cell;"/>
            <span class="val-pax">Participant Count</span>
          </td>
          ${getStackedCell(b["1_total_batches_created"], p["1_total_batches_created"])}
          ${getStackedCell(b["2_scheduled_batches"], p["2_scheduled_batches"])}
          ${getStackedCell(b["3_batches_pending_at_dmm"], p["3_batches_pending_at_dmm"])}
          ${getStackedCell(b["4_ongoing_batches"], p["4_ongoing_batches"])}
          ${getStackedCell(b["5_completed_batches"], p["5_completed_batches"])}
          ${getStackedCell(b["6_completed_batches_for_verification"], p["6_completed_batches_for_verification"])}
          ${getStackedCell(b["7_completed_batch_closed"], p["7_completed_batch_closed"])}
          ${getStackedCell(b["8_batches_rejected_by_dmm"], p["8_batches_rejected_by_dmm"], "text-danger")}
          ${getStackedCell(b["9_total_batches_completed"], p["9_total_batches_completed"], "highlight-blue")}
          ${getStackedCell(b["10_total_target"], p["10_total_target"], "highlight-purple")}
          ${getStackedCell(b["11_participants_onboarded"], p["11_participants_onboarded"])}
          ${getStackedCell(b["12_participants_enrolled_in_batches"], p["12_participants_enrolled_in_batches"])}
          ${getStackedCell(b["13_remaining_participants_for_enrollment"], p["13_remaining_participants_for_enrollment"], "text-warning")}
          ${getStackedCell(b["14_achievement_percentage"], p["14_achievement_percentage"], "highlight-green")}
        </tr>
      `;
    };

    let tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; }
          th, td { border: 1px solid #94a3b8; text-align: center; vertical-align: middle; padding: 6px; }
          .header-main { background-color: #1e3a8a; color: #ffffff; font-size: 16px; font-weight: bold; padding: 12px; text-transform: uppercase; }
          .col-headers th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; font-size: 12px; }
          .col-nums th { background-color: #e2e8f0; color: #475569; font-weight: bold; font-size: 11px; }
          .highlight-blue { background-color: #eff6ff; }
          .highlight-purple { background-color: #fdf4ff; }
          .highlight-green { background-color: #f0fdf4; }
          .val-batch { color: #1d4ed8; font-weight: bold; }
          .val-pax { color: #0f766e; font-weight: bold; }
          .dist-name { color: #0f172a; font-weight: bold; font-size: 14px; text-transform: uppercase; }
          .text-danger { color: #dc2626; }
          .text-warning { color: #b45309; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <th colspan="16" class="header-main">PRAGATI SETU-TMS PORTAL SUMMARY REPORT - DATED: ${report_date} - FY: ${financialYear}</th>
          </tr>
          <tr class="col-headers">
            <th>S. No.</th>
            <th style="text-align: left;">District / State Name</th>
            <th>Total batches Created</th>
            <th>Scheduled Batches</th>
            <th>Batches Pending At DMM</th>
            <th>Ongoing Batches</th>
            <th>Completed Batches</th>
            <th>Completed Batches for Verification</th>
            <th>Completed batch Closed</th>
            <th>Batches Rejected By DMM</th>
            <th class="highlight-blue">Total Batches Completed (5+6+7)</th>
            <th class="highlight-purple">Total Target (Slot 1+2)</th>
            <th>Participants Onboarded</th>
            <th>Participants Enrolled In Batches</th>
            <th>Remaining Participants for Enrollment</th>
            <th class="highlight-green">Achievement %</th>
          </tr>
          <tr class="col-nums">
            <th></th><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th>
          </tr>
    `;

    // Add State Row
    tableHTML += generateRow("—", "STATE WIDE SUMMARY", state_wide_summary);

    // Add Blank Separator Row
    tableHTML += `<tr><td colspan="16" style="background: #e2e8f0; height: 10px;"></td></tr>`;

    // Add District Rows
    if (district_summaries && district_summaries.length > 0) {
      district_summaries.forEach((dist, idx) => {
        tableHTML += generateRow(idx + 1, dist.district_name, dist.summary);
      });
    }

    tableHTML += `
        </table>
      </body>
      </html>
    `;

    // Download Blob
    const blob = new Blob([tableHTML], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `TMS_Portal_Summary_Report_${financialYear}.xls`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ======================================================================
  // UI HELPER COMPONENTS
  // ======================================================================
  const StackedCell = ({ bVal, pVal, className = "" }) => (
    <td className={className}>
      <div className="val-batch">
        {bVal !== null && bVal !== undefined ? bVal.toLocaleString() : ""}
      </div>
      <div className="val-pax">
        {pVal !== null && pVal !== undefined ? pVal.toLocaleString() : ""}
      </div>
    </td>
  );

  return (
    <div className="app-shell">
      <div className="content-area">
        <div className="main-area">
          <main
            style={{
              padding: "24px",
              minHeight: "100vh",
              background: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            {/* Top Control Bar */}
            <div className="summary-top-bar">
              <div className="st-left">
                <FaChartBar size={24} color="#1e3a8a" />
                <h2 style={{ margin: 0, color: "#1e3a8a", fontWeight: 800 }}>
                  TMS Portal Summary Report
                </h2>
              </div>

              <div className="st-right">
                <button
                  className="btn-export"
                  onClick={handleExportExcel}
                  disabled={loading || !reportData}
                >
                  <FaDownload /> Export Excel
                </button>
              </div>
            </div>

            {/* Content Area */}
            {error ? (
              <div className="alert-danger">
                <span style={{ fontSize: 20 }}>⚠</span> {error}
              </div>
            ) : loading ? (
              <div className="loading-state">
                <FaSpinner className="spin-icon" size={40} color="#3b82f6" />
                <p>
                  Compiling comprehensive portal summary for {financialYear}...
                </p>
                <small>This aggregates data across all 75 districts.</small>
              </div>
            ) : reportData ? (
              <div className="reports-container fade-in">
                {/* 1. STATE WIDE SUMMARY */}
                <div className="report-table-wrapper state-wrapper">
                  <div className="report-table-header">
                    <h3 className="rt-title">
                      PRAGATI SETU-TMS PORTAL SUMMARY REPORT (STATE WIDE)
                    </h3>
                    <span className="rt-date">
                      DATED: {reportData.report_date}
                    </span>
                  </div>
                  <div className="table-responsive">
                    <table className="tms-summary-table">
                      <thead>
                        <tr className="col-names-row">
                          <th>S. No.</th>
                          <th style={{ textAlign: "left" }}>Location Name</th>
                          <th>Total batches Created</th>
                          <th>Scheduled Batches</th>
                          <th>Batches Pending At DMM</th>
                          <th>Ongoing Batches</th>
                          <th>Completed Batches</th>
                          <th>Completed Batches for Verification</th>
                          <th>Completed batch Closed</th>
                          <th>Batches Rejected By DMM</th>
                          <th className="highlight-col">
                            Total Batches Completed (5+6+7)
                          </th>
                          <th className="highlight-col-alt">
                            Total Target (Slot 1+2)
                          </th>
                          <th>Participants Onboarded</th>
                          <th>Participants Enrolled In Batches</th>
                          <th>Remaining Participants for Enrollment</th>
                          <th className="highlight-col-success">
                            Achievement %
                          </th>
                        </tr>
                        <tr className="col-numbers-row">
                          <th></th>
                          <th></th>
                          <th>1</th>
                          <th>2</th>
                          <th>3</th>
                          <th>4</th>
                          <th>5</th>
                          <th>6</th>
                          <th>7</th>
                          <th>8</th>
                          <th>9</th>
                          <th>10</th>
                          <th>11</th>
                          <th>12</th>
                          <th>13</th>
                          <th>14</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const b =
                            reportData.state_wide_summary?.batch_counts || {};
                          const p =
                            reportData.state_wide_summary?.participant_counts ||
                            {};
                          return (
                            <tr>
                              <td style={{ fontWeight: 800, color: "#1e3a8a" }}>
                                —
                              </td>
                              <td className="stacked-label-cell">
                                <div className="dist-name">
                                  STATE WIDE SUMMARY
                                </div>
                                <div className="val-batch">Batch Count</div>
                                <div className="val-pax">Participant Count</div>
                              </td>
                              <StackedCell
                                bVal={b["1_total_batches_created"]}
                                pVal={p["1_total_batches_created"]}
                              />
                              <StackedCell
                                bVal={b["2_scheduled_batches"]}
                                pVal={p["2_scheduled_batches"]}
                              />
                              <StackedCell
                                bVal={b["3_batches_pending_at_dmm"]}
                                pVal={p["3_batches_pending_at_dmm"]}
                              />
                              <StackedCell
                                bVal={b["4_ongoing_batches"]}
                                pVal={p["4_ongoing_batches"]}
                              />
                              <StackedCell
                                bVal={b["5_completed_batches"]}
                                pVal={p["5_completed_batches"]}
                              />
                              <StackedCell
                                bVal={b["6_completed_batches_for_verification"]}
                                pVal={p["6_completed_batches_for_verification"]}
                              />
                              <StackedCell
                                bVal={b["7_completed_batch_closed"]}
                                pVal={p["7_completed_batch_closed"]}
                              />
                              <StackedCell
                                bVal={b["8_batches_rejected_by_dmm"]}
                                pVal={p["8_batches_rejected_by_dmm"]}
                                className="text-danger"
                              />
                              <StackedCell
                                bVal={b["9_total_batches_completed"]}
                                pVal={p["9_total_batches_completed"]}
                                className="highlight-cell"
                              />
                              <StackedCell
                                bVal={b["10_total_target"]}
                                pVal={p["10_total_target"]}
                                className="highlight-cell-alt"
                              />
                              <StackedCell
                                bVal={b["11_participants_onboarded"]}
                                pVal={p["11_participants_onboarded"]}
                              />
                              <StackedCell
                                bVal={b["12_participants_enrolled_in_batches"]}
                                pVal={p["12_participants_enrolled_in_batches"]}
                              />
                              <StackedCell
                                bVal={
                                  b["13_remaining_participants_for_enrollment"]
                                }
                                pVal={
                                  p["13_remaining_participants_for_enrollment"]
                                }
                                className="text-warning"
                              />
                              <StackedCell
                                bVal={b["14_achievement_percentage"]}
                                pVal={p["14_achievement_percentage"]}
                                className="highlight-cell-success"
                              />
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. DISTRICT WISE COMBINED TABLE */}
                <div className="report-table-wrapper district-wrapper">
                  <div className="report-table-header">
                    <h3 className="rt-title">
                      PRAGATI SETU-TMS PORTAL SUMMARY REPORT (DISTRICT WISE)
                    </h3>
                    <div className="district-search-box">
                      <FaSearch className="ds-icon" />
                      <input
                        type="text"
                        placeholder="Search by S.No. or District Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="tms-summary-table district-table">
                      <thead>
                        <tr className="col-names-row">
                          <th>S. No.</th>
                          <th style={{ textAlign: "left" }}>District Name</th>
                          <th>Total batches Created</th>
                          <th>Scheduled Batches</th>
                          <th>Batches Pending At DMM</th>
                          <th>Ongoing Batches</th>
                          <th>Completed Batches</th>
                          <th>Completed Batches for Verification</th>
                          <th>Completed batch Closed</th>
                          <th>Batches Rejected By DMM</th>
                          <th className="highlight-col">
                            Total Batches Completed (5+6+7)
                          </th>
                          <th className="highlight-col-alt">
                            Total Target (Slot 1+2)
                          </th>
                          <th>Participants Onboarded</th>
                          <th>Participants Enrolled In Batches</th>
                          <th>Remaining Participants for Enrollment</th>
                          <th className="highlight-col-success">
                            Achievement %
                          </th>
                        </tr>
                        <tr className="col-numbers-row">
                          <th></th>
                          <th></th>
                          <th>1</th>
                          <th>2</th>
                          <th>3</th>
                          <th>4</th>
                          <th>5</th>
                          <th>6</th>
                          <th>7</th>
                          <th>8</th>
                          <th>9</th>
                          <th>10</th>
                          <th>11</th>
                          <th>12</th>
                          <th>13</th>
                          <th>14</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDistricts.length === 0 ? (
                          <tr>
                            <td colSpan={16} className="empty-state">
                              No districts found matching "{searchQuery}"
                            </td>
                          </tr>
                        ) : (
                          filteredDistricts.map((dist) => {
                            // Find original index to maintain correct S.No regardless of filter
                            const originalIdx =
                              reportData.district_summaries.findIndex(
                                (d) => d.district_id === dist.district_id,
                              );
                            const b = dist.summary.batch_counts || {};
                            const p = dist.summary.participant_counts || {};

                            return (
                              <tr key={dist.district_id}>
                                <td
                                  style={{ fontWeight: 800, color: "#475569" }}
                                >
                                  {originalIdx + 1}
                                </td>
                                <td className="stacked-label-cell">
                                  <div className="dist-name">
                                    {dist.district_name}
                                  </div>
                                  <div className="val-batch">Batch Count</div>
                                  <div className="val-pax">
                                    Participant Count
                                  </div>
                                </td>
                                <StackedCell
                                  bVal={b["1_total_batches_created"]}
                                  pVal={p["1_total_batches_created"]}
                                />
                                <StackedCell
                                  bVal={b["2_scheduled_batches"]}
                                  pVal={p["2_scheduled_batches"]}
                                />
                                <StackedCell
                                  bVal={b["3_batches_pending_at_dmm"]}
                                  pVal={p["3_batches_pending_at_dmm"]}
                                />
                                <StackedCell
                                  bVal={b["4_ongoing_batches"]}
                                  pVal={p["4_ongoing_batches"]}
                                />
                                <StackedCell
                                  bVal={b["5_completed_batches"]}
                                  pVal={p["5_completed_batches"]}
                                />
                                <StackedCell
                                  bVal={
                                    b["6_completed_batches_for_verification"]
                                  }
                                  pVal={
                                    p["6_completed_batches_for_verification"]
                                  }
                                />
                                <StackedCell
                                  bVal={b["7_completed_batch_closed"]}
                                  pVal={p["7_completed_batch_closed"]}
                                />
                                <StackedCell
                                  bVal={b["8_batches_rejected_by_dmm"]}
                                  pVal={p["8_batches_rejected_by_dmm"]}
                                  className="text-danger"
                                />
                                <StackedCell
                                  bVal={b["9_total_batches_completed"]}
                                  pVal={p["9_total_batches_completed"]}
                                  className="highlight-cell"
                                />
                                <StackedCell
                                  bVal={b["10_total_target"]}
                                  pVal={p["10_total_target"]}
                                  className="highlight-cell-alt"
                                />
                                <StackedCell
                                  bVal={b["11_participants_onboarded"]}
                                  pVal={p["11_participants_onboarded"]}
                                />
                                <StackedCell
                                  bVal={
                                    b["12_participants_enrolled_in_batches"]
                                  }
                                  pVal={
                                    p["12_participants_enrolled_in_batches"]
                                  }
                                />
                                <StackedCell
                                  bVal={
                                    b[
                                      "13_remaining_participants_for_enrollment"
                                    ]
                                  }
                                  pVal={
                                    p[
                                      "13_remaining_participants_for_enrollment"
                                    ]
                                  }
                                  className="text-warning"
                                />
                                <StackedCell
                                  bVal={b["14_achievement_percentage"]}
                                  pVal={p["14_achievement_percentage"]}
                                  className="highlight-cell-success"
                                />
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>

      <style>{`
        .content-area { display: flex; flex: 1; min-width: 0; }
        .main-area { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        footer { margin-top: auto; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }

        /* Top Bar */
        .summary-top-bar {
          display: flex; justify-content: space-between; align-items: center;
          background: #ffffff; padding: 16px 24px; border-radius: 12px;
          border: 2px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
        }
        .st-left { display: flex; align-items: center; gap: 12px; }
        .st-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        
        .filter-group { display: flex; align-items: center; gap: 8px; }
        .filter-group label { font-size: 14px; font-weight: 700; color: #475569; text-transform: uppercase; }
        .filter-group select {
          padding: 8px 16px; border-radius: 6px; border: 1px solid #cbd5e1;
          font-weight: 600; color: #0f172a; outline: none; background: #f8fafc; cursor: pointer;
        }
        .filter-group select:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }

        .btn-export {
          display: flex; align-items: center; gap: 8px; background: #16a34a; color: white;
          border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(22,163,74,0.2);
        }
        .btn-export:hover:not(:disabled) { background: #15803d; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(22,163,74,0.3); }
        .btn-export:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

        /* Report Tables */
        .reports-container { display: flex; flex-direction: column; gap: 30px; }
        
        .report-table-wrapper {
          background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1;
          overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .report-table-wrapper.state-wrapper {
          border: 3px solid #1e3a8a; box-shadow: 0 10px 15px -3px rgba(30,58,138,0.1);
        }
        .state-wrapper .report-table-header { background: #1e3a8a; color: #ffffff; }
        .state-wrapper .rt-date { color: #bfdbfe; }

        .report-table-header {
          display: flex; justify-content: space-between; align-items: center;
          background: #f1f5f9; padding: 16px 20px; border-bottom: 1px solid #cbd5e1; flex-wrap: wrap; gap: 12px;
        }
        .rt-title { margin: 0; font-size: 16px; font-weight: 800; color: inherit; letter-spacing: 0.5px; }
        .rt-date { font-size: 14px; font-weight: 700; color: #64748b; }

        /* Search Box */
        .district-search-box {
          display: flex; align-items: center; background: #ffffff; border: 1px solid #cbd5e1;
          border-radius: 8px; padding: 6px 12px; width: 300px; transition: all 0.2s;
        }
        .district-search-box:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .ds-icon { color: #94a3b8; margin-right: 8px; }
        .district-search-box input {
          border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a;
        }

        .table-responsive { overflow-x: auto; width: 100%; max-height: 800px; }
        
        .tms-summary-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 13px; min-width: 1400px; }
        .tms-summary-table th, .tms-summary-table td { border: 1px solid #cbd5e1; padding: 10px; vertical-align: middle; }
        
        /* Sticky Headers for District Table */
        .district-table thead th { position: sticky; z-index: 10; }
        .district-table .col-names-row th { top: 0; }
        .district-table .col-numbers-row th { top: 60px; /* Adjust based on header height */ box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .col-names-row th { background: #f8fafc; color: #0f172a; font-weight: 700; white-space: normal; line-height: 1.4; vertical-align: bottom; }
        .col-numbers-row th { background: #e2e8f0; color: #475569; font-weight: 800; font-size: 12px; }
        
        /* Stacked Cells */
        .stacked-label-cell { text-align: left; background: #f8fafc; white-space: nowrap; line-height: 1.6; }
        .dist-name { font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;}
        .val-batch { color: #1d4ed8; font-weight: 700; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; display: block; }
        .val-pax { color: #0f766e; font-weight: 700; display: block; }

        .highlight-col { background: #eff6ff !important; color: #1d4ed8; }
        .highlight-col-alt { background: #fdf4ff !important; color: #a21caf; }
        .highlight-col-success { background: #f0fdf4 !important; color: #15803d; }
        
        .highlight-cell { background: #eff6ff; color: #1d4ed8; }
        .highlight-cell-alt { background: #fdf4ff; color: #a21caf; }
        .highlight-cell-success { background: #f0fdf4; color: #15803d; }
        
        .text-danger { color: #dc2626 !important; }
        .text-danger .val-batch { color: #dc2626; } /* Override batch color for danger */
        .text-warning { color: #b45309 !important; }

        .tms-summary-table tbody tr:hover td { background-color: #f8fafc; transition: background 0.2s; }
        .empty-state { padding: 60px !important; color: #64748b; font-style: italic; font-size: 15px; }

        /* Loading State */
        .loading-state { display: flex; flex-direction: column; align-items: center; padding: 80px 20px; color: #3b82f6; font-weight: 600; text-align: center; }
        .loading-state p { margin: 16px 0 4px 0; font-size: 16px; }
        .loading-state small { color: #64748b; font-size: 13px; font-weight: 500; }
        .spin-icon { animation: spin 1s linear infinite; }
        .alert-danger { background: #fef2f2; border: 1px solid #f87171; color: #b91c1c; padding: 16px 20px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 12px; }

        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
