// src\pages\AdminPages\TmsPortal\TmsPortal.jsx
import React, { useState, useEffect } from "react";
import api, { TMS_API } from "../../../api/axios";
import KpiCards from "./KpiCards";
import TmsStyles from "./TmsStyles";
import { FaChartBar, FaSearch } from "react-icons/fa";

const StackedCell = ({ bVal, pVal, className }) => (
  <td className={className}>
    <div className="val-batch">
      {bVal !== null && bVal !== undefined ? bVal : 0}
    </div>
    <div className="val-pax">
      {pVal !== null && pVal !== undefined ? pVal : 0}
    </div>
  </td>
);

const TmsPortal = () => {
  const [activeTab, setActiveTab] = useState("tms");

  const [kpiData, setKpiData] = useState({
    batch_counts: {},
    participant_counts: {},
  });
  const [districtSummaries, setDistrictSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availableYears, setAvailableYears] = useState(["2025-26", "2026-27"]);
  const [selectedYear, setSelectedYear] = useState("2026-27");

  const [themes, setThemes] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [themeResp, planResp] = await Promise.all([
          TMS_API.trainingThemes.list({ page_size: 500 }),
          TMS_API.trainingPlans.list({ page_size: 500 }),
        ]);

        const getItems = (response) =>
          Array.isArray(response?.data)
            ? response.data
            : response?.data?.results || [];

        setThemes(getItems(themeResp));
        setTrainingPlans(getItems(planResp));
      } catch (err) {
        console.error("Error fetching themes or plans:", err);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchPortalSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = { financial_year: selectedYear };
        if (selectedTheme) queryParams.theme = selectedTheme;
        if (selectedPlan) queryParams.training_plan = selectedPlan;

        const resp = await api.get("/tms/reports/portal-summary/", {
          params: queryParams,
          headers: {
            "X-App-Client": "TMS_WEB",
          },
        });
        const data = resp.data;

        if (data.state_wide_summary) {
          setKpiData(data.state_wide_summary);
        }

        if (data.district_summaries) {
          setDistrictSummaries(data.district_summaries);
        }
      } catch (err) {
        console.error("Error fetching portal summary:", err);
        const responseError = err?.response?.data;
        setError(
          responseError?.error ||
            responseError?.detail ||
            responseError?.message ||
            (err?.response?.status === 401
              ? "Your session has expired or you do not have permission to view this summary."
              : "Failed to fetch dashboard summary"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortalSummary();
  }, [selectedYear, selectedTheme, selectedPlan]);

  // Search Logic
  const filteredDistricts = districtSummaries.filter((dist) => {
    if (!searchQuery) return true;
    return dist.district_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const handleExport = () => {
    if (filteredDistricts.length === 0) {
      alert("No data available to export!");
      return;
    }

    const csvCell = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };
    const headers = [
      "S. No.",
      "District Name",
      "Total Batches Created - Batch Count",
      "Total Batches Created - Participant Count",
      "Scheduled Batches - Batch Count",
      "Scheduled Batches - Participant Count",
      "Batches Pending At DMM - Batch Count",
      "Batches Pending At DMM - Participant Count",
      "Ongoing Batches - Batch Count",
      "Ongoing Batches - Participant Count",
      "Completed Batches - Batch Count",
      "Completed Batches - Participant Count",
      "Completed Batches for Verification - Batch Count",
      "Completed Batches for Verification - Participant Count",
      "Completed Batch Closed - Batch Count",
      "Completed Batch Closed - Participant Count",
      "Batches Rejected By DMM - Batch Count",
      "Batches Rejected By DMM - Participant Count",
      "Total Batches Completed (5+6+7) - Batch Count",
      "Total Batches Completed (5+6+7) - Participant Count",
      "Total Target (Slot 1+2) - Batch Count",
      "Total Target (Slot 1+2) - Participant Count",
      "Participants Onboarded - Batch Count",
      "Participants Onboarded - Participant Count",
      "Participants Enrolled In Batches - Batch Count",
      "Participants Enrolled In Batches - Participant Count",
      "Remaining Participants for Enrollment - Batch Count",
      "Remaining Participants for Enrollment - Participant Count",
      "Achievement % - Batch Count",
      "Achievement % - Participant Count",
    ];
    const metricKeys = [
      "1_total_batches_created",
      "2_scheduled_batches",
      "3_batches_pending_at_dmm",
      "4_ongoing_batches",
      "5_completed_batches",
      "6_completed_batches_for_verification",
      "7_completed_batch_closed",
      "8_batches_rejected_by_dmm",
      "9_total_batches_completed",
      "10_total_target",
      "11_participants_onboarded",
      "12_participants_enrolled_in_batches",
      "13_remaining_participants_for_enrollment",
      "14_achievement_percentage",
    ];
    const rows = filteredDistricts.map((dist, index) => {
      const batchCounts = dist.summary?.batch_counts || {};
      const participantCounts = dist.summary?.participant_counts || {};
      const values = metricKeys.flatMap((key) => [
        batchCounts[key] ?? 0,
        participantCounts[key] ?? 0,
      ]);
      return [index + 1, dist.district_name, ...values];
    });
    const csvContent = [
      headers.map(csvCell).join(","),
      ...rows.map((row) => row.map(csvCell).join(",")),
    ].join("\r\n");
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `TMS_Summary_Report_${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabBtnStyle = (isActive) => ({
    padding: "10px 24px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    background: isActive
      ? "linear-gradient(135deg, #2563eb 0%, #e11d48 100%)"
      : "#e2e8f0",
    color: isActive ? "#ffffff" : "#334155",
    border: "none",
    borderRadius: "6px",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <>
      <TmsStyles />
      <div className="tms-dashboard">
        {activeTab === "tms" && (
          <>
            {/* TOP HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #cbd5e1",
                padding: "16px 20px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                marginBottom: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <FaChartBar size={24} color="#1e3a8a" />
                <h2
                  style={{
                    margin: 0,
                    color: "#1e3a8a",
                    fontWeight: 800,
                    fontSize: "20px",
                  }}
                >
                  TMS Portal Summary Report
                </h2>
              </div>

              <div
                className="summary-filter-controls"
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexWrap: "nowrap",
                  flex: "1 1 auto",
                  minWidth: 0,
                }}
              >
                {availableYears.length > 0 && (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "5px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                      width: "180px",
                    }}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    width: "220px",
                  }}
                >
                  <option value="">All Themes</option>
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.theme_name || t.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    width: "220px",
                  }}
                >
                  <option value="">All Training Plans</option>
                  {trainingPlans.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.training_name || tp.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExport}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Export to Excel
                </button>
              </div>
            </div>

            {error && <div className="alert-danger">⚠️ {error}</div>}

            {loading ? (
              <div className="loading-state">
                <h4>Loading Data...</h4>
              </div>
            ) : (
              <>
                <KpiCards kpiData={kpiData} />

                {/* NAYA DISTRICT WISE COMBINED TABLE */}
                <div className="report-table-wrapper district-wrapper">
                  <div className="report-table-header">
                    <h3 className="rt-title">
                      PRAGATI SETU-TMS PORTAL SUMMARY REPORT (DISTRICT WISE)
                    </h3>
                    <div className="district-search-box">
                      <FaSearch className="ds-icon" />
                      <input
                        type="text"
                        placeholder="Search by District Name..."
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
                            const originalIdx = districtSummaries.findIndex(
                              (d) => d.district_id === dist.district_id,
                            );
                            const b = dist.summary?.batch_counts || {};
                            const p = dist.summary?.participant_counts || {};

                            return (
                              <tr key={dist.district_id}>
                                <td
                                  style={{ fontWeight: 800, color: "#475569" }}
                                >
                                  {originalIdx + 1}
                                </td>
                                <td
                                  className="stacked-label-cell"
                                  style={{
                                    textAlign: "left",
                                    minWidth: "150px",
                                  }}
                                >
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
              </>
            )}
          </>
        )}
      </div>

      {/* Aapki di hui CSS Styling */}
      <style>{`
        /* Top Bar */
        .summary-top-bar {
          display: flex; justify-content: space-between; align-items: center;
          background: #ffffff; padding: 16px 24px; border-radius: 12px;
          border: 2px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
        }

        .summary-filter-controls select {
          flex: 0 1 auto;
          max-width: 220px;
        }

        @media (max-width: 900px) {
          .summary-filter-controls {
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
          }
        }

        /* Report Tables */
        .report-table-wrapper {
          background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1;
          overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          margin-top: 24px;
        }
        
        .report-table-header {
          display: flex; justify-content: space-between; align-items: center;
          background: #f1f5f9; padding: 16px 20px; border-bottom: 1px solid #cbd5e1; flex-wrap: wrap; gap: 12px;
        }
        .rt-title { margin: 0; font-size: 16px; font-weight: 800; color: inherit; letter-spacing: 0.5px; }

        /* Search Box */
        .district-search-box {
          display: flex; align-items: center; background: #ffffff; border: 1px solid #cbd5e1;
          border-radius: 8px; padding: 8px 12px; width: 300px; transition: all 0.2s;
        }
        .district-search-box:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .ds-icon { color: #94a3b8; margin-right: 8px; }
        .district-search-box input {
          border: none; outline: none; width: 100%; font-size: 14px; color: #0f172a;
        }

        .table-responsive {
          position: relative;
          overflow: auto;
          width: 100%;
          max-height: 800px;
        }
        
        .tms-summary-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: center;
          font-size: 13px;
          min-width: 1400px;
        }
        .tms-summary-table th, .tms-summary-table td { border: 1px solid #cbd5e1; padding: 10px; vertical-align: middle; }
        
        /* Sticky Headers for District Table */
        .district-table thead th {
          position: sticky;
          z-index: 20;
        }
        .district-table .col-names-row th {
          top: 0;
          height: 76px;
          background: #f8fafc !important;
        }
        .district-table .col-numbers-row th {
          top: 76px;
          height: 38px;
          background: #e2e8f0 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.12);
        }

        .col-names-row th { background: #f8fafc; color: #0f172a; font-weight: 700; white-space: normal; line-height: 1.4; vertical-align: bottom; }
        .col-numbers-row th { background: #e2e8f0; color: #475569; font-weight: 800; font-size: 12px; }
        
        /* Stacked Cells */
        .stacked-label-cell { background: #f8fafc; white-space: nowrap; line-height: 1.6; }
        .dist-name { font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;}
        .val-batch { color: #1d4ed8; font-weight: 700; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; display: block; }
        .val-pax { color: #0f766e; font-weight: 700; display: block; }

        .highlight-col { background: #eff6ff !important; color: #1d4ed8; }
        .highlight-col-alt { background: #fdf4ff !important; color: #a21caf; }
        .highlight-col-success { background: #f0fdf4 !important; color: #15803d; }
        
        .highlight-cell { background: #eff6ff !important; color: #1d4ed8; }
        .highlight-cell-alt { background: #fdf4ff !important; color: #a21caf; }
        .highlight-cell-success { background: #f0fdf4 !important; color: #15803d; font-weight: bold; }
        
        .text-danger { color: #dc2626 !important; }
        .text-danger .val-batch { color: #dc2626; } 
        .text-warning { color: #b45309 !important; }

        .tms-summary-table tbody tr:hover td { background-color: #f8fafc; transition: background 0.2s; }
        .empty-state { padding: 60px !important; color: #64748b; font-style: italic; font-size: 15px; }

        /* Loading & Alert State */
        .loading-state { display: flex; flex-direction: column; align-items: center; padding: 80px 20px; color: #3b82f6; font-weight: 600; text-align: center; }
        .alert-danger { background: #fef2f2; border: 1px solid #f87171; color: #b91c1c; padding: 16px 20px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 12px; }
      `}</style>
    </>
  );
};

export default TmsPortal;
