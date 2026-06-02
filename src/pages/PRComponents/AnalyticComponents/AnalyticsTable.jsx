import React, { useState, useEffect } from "react";
import ExportButton from "./ExportButton";

const ROWS_PER_PAGE = 15;

export default function AnalyticsTable({
  activeTab,
  activeSubTab,
  overviewData,
  loginData,
  cadreData,
  mouData, // --- SURGICAL ADDITION ---
  loading,
  filters,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the tab or sub-tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeSubTab]);

  if (loading) return null;

  // Helper to format date "14 May 2026, 01:51 PM"
  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // HIDE TABLE COMPLETELY FOR GLOBAL OVERVIEW
  // ==========================================
  if (activeTab === "overview") {
    return null;
  }

  // ==========================================
  // VIEW: GLOBAL OVERVIEW (Fallbacks)
  // ==========================================
  if (activeTab === "overview") {
    const tms = overviewData?.platform_overview?.TMS;
    const partnerData = tms?.training_partners?.centres_breakdown || [];

    // Pagination
    const totalPages = Math.ceil(partnerData.length / ROWS_PER_PAGE);
    const paginatedData = partnerData.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE,
    );

    // Export mapping
    const exportData = partnerData.map((row, i) => ({
      sno: i + 1,
      name: row.name,
      short_name: row.tp_short_name,
      centres: row.centre_count,
      status: row.centre_count > 0 ? "Active" : "Pending Centres",
    }));
    const exportHeaders = [
      { label: "S.No.", key: "sno" },
      { label: "Partner Name", key: "name" },
      { label: "Short Name", key: "short_name" },
      { label: "Registered Centres", key: "centres" },
      { label: "Status", key: "status" },
    ];

    return (
      <div className="analytics-module table-module">
        <div className="table-header">
          <h3>TMS Training Partners & Centres</h3>
          <ExportButton
            data={exportData}
            headers={exportHeaders}
            filename="Training_Partners.csv"
          />
        </div>
        <div className="table-responsive">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Partner Name</th>
                <th>Short Name</th>
                <th>Registered Centres</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                  <td className="fw-bold">{row.name}</td>
                  <td>
                    <span className="short-name-pill">{row.tp_short_name}</span>
                  </td>
                  <td>{row.centre_count}</td>
                  <td>
                    <span
                      className={`status-badge ${row.centre_count > 0 ? "success" : "warning"}`}
                    >
                      {row.centre_count > 0 ? "Active" : "Pending Centres"}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: EPSAKHI -> MOU ANALYTICS (SURGICAL ADDITION)
  // ==========================================
  if (activeTab === "mou_analytics" || activeSubTab === "mou_analytics") {
    const isSummaryView = filters?.district_wise_summary === "1";

    // Depending on the endpoint logic, data could be in .results or .data
    const records = mouData?.results || mouData?.data || [];

    const totalPages = Math.ceil(records.length / ROWS_PER_PAGE);
    const paginatedData = records.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE,
    );

    // Dynamic Export Mapping Based on View Mode
    const exportData = records.map((row, idx) => {
      const base = {
        sno: idx + 1,
        district: row.district_name_en || row.district_name || "Unknown",
      };

      if (isSummaryView) {
        base.blocks_involved = row.blocks || 0;
        base.achieved_mou = row.total_achieved_mou || 0;
      } else {
        const target = Number(row.mou_target) || 0;
        const achieved = Number(row.achieved_mou) || 0;
        base.fy = row.financial_year || "-";
        base.target = target;
        base.achieved = achieved;
        base.percent =
          target > 0 ? ((achieved / target) * 100).toFixed(1) + "%" : "0%";
      }
      return base;
    });

    const exportHeaders = isSummaryView
      ? [
          { label: "S.No.", key: "sno" },
          { label: "District", key: "district" },
          { label: "Blocks Involved", key: "blocks_involved" },
          { label: "Total Achieved MOUs", key: "achieved_mou" },
        ]
      : [
          { label: "S.No.", key: "sno" },
          { label: "District", key: "district" },
          { label: "Financial Year", key: "fy" },
          { label: "MOU Target", key: "target" },
          { label: "Achieved MOUs", key: "achieved" },
          { label: "Achievement %", key: "percent" },
        ];

    return (
      <div className="analytics-module table-module">
        <div className="table-header">
          <h3>
            {isSummaryView
              ? "District & Block Wise MOU Summary"
              : "District MOU Target & Achievement"}
          </h3>
          <ExportButton
            data={exportData}
            headers={exportHeaders}
            filename={isSummaryView ? "MOU_Summary.csv" : "MOU_Achievement.csv"}
          />
        </div>
        <div className="table-responsive">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>District</th>
                {isSummaryView ? (
                  <>
                    <th>Blocks Involved</th>
                    <th>Total Achieved MOUs</th>
                  </>
                ) : (
                  <>
                    <th>Financial Year</th>
                    <th>MOU Target</th>
                    <th>Achieved MOUs</th>
                    <th>Achievement %</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => {
                const target = Number(row.mou_target) || 0;
                const achieved = isSummaryView
                  ? Number(row.total_achieved_mou) || 0
                  : Number(row.achieved_mou) || 0;
                const percent =
                  target > 0 ? ((achieved / target) * 100).toFixed(1) : 0;

                return (
                  <tr key={index}>
                    <td className="fw-bold">
                      {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                    </td>
                    <td className="fw-bold">
                      {row.district_name_en || row.district_name || "-"}
                    </td>

                    {isSummaryView ? (
                      <>
                        <td>{row.blocks || 0}</td>
                        <td>
                          <span
                            className="status-badge success"
                            style={{ background: "#dcfce7", color: "#166534" }}
                          >
                            {achieved}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.financial_year || "-"}</td>
                        <td>{target.toLocaleString("en-IN")}</td>
                        <td>
                          <span
                            className={`status-badge ${achieved >= target && target > 0 ? "success" : "warning"}`}
                          >
                            {achieved.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td>
                          <strong
                            style={{
                              color:
                                percent >= 100
                                  ? "#16a34a"
                                  : percent > 0
                                    ? "#ea580c"
                                    : "#64748b",
                            }}
                          >
                            {percent}%
                          </strong>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={isSummaryView ? "4" : "6"}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#64748b",
                    }}
                  >
                    No MOU Target or Achievement records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: TMS -> LOGIN STATUS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_training") {
    const isSummaryView = filters?.district_wise_summary === "1";
    const isNotLoggedIn = filters?.not_logged_in === "1";

    if (isSummaryView) {
      // ----------------------------------------
      // DISTRICT & BLOCK SUMMARY TABLE
      // ----------------------------------------
      const summaryData = loginData?.district_wise_summary || [];

      // Map the data to only get the district name and the count of blocks
      const flatData = summaryData.map((d) => ({
        district: d.district_name_en,
        blockCount: d.blocks ? d.blocks.length : 0,
      }));

      const totalPages = Math.ceil(flatData.length / ROWS_PER_PAGE);
      const paginatedData = flatData.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
      );

      const exportData = flatData.map((row, idx) => ({
        sno: (currentPage - 1) * ROWS_PER_PAGE + idx + 1,
        district: row.district || "-",
        blockCount: row.blockCount,
      }));

      const exportHeaders = [
        { label: "S.No.", key: "sno" },
        { label: "District", key: "district" },
        { label: "Block Count", key: "blockCount" },
      ];

      return (
        <div className="analytics-module table-module">
          <div className="table-header">
            <h3>District Wise Block Count</h3>
            <ExportButton
              data={exportData}
              headers={exportHeaders}
              filename="District_Summary.csv"
            />
          </div>
          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>District</th>
                  <th>Block Count</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>
                    <td>{row.district}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: "#dbeafe", color: "#1e40af" }}
                      >
                        {row.blockCount}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No summary data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    } else {
      // ----------------------------------------
      // DETAILED RECORDS TABLE
      // ----------------------------------------
      const records = loginData?.all_records || [];
      const totalPages = Math.ceil(records.length / ROWS_PER_PAGE);
      const paginatedData = records.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
      );

      const exportData = records.map((row, idx) => {
        const base = {
          sno: (currentPage - 1) * ROWS_PER_PAGE + idx + 1,
          username: row.username,
          role: row.role_name.replace(/_/g, " ").toUpperCase(),
          district: row.district_name_en || "-",
          block: row.block_name_en || "-",
        };
        if (!isNotLoggedIn) {
          base.login_time = formatDateTime(row.first_login_at);
          base.status = row.must_change_password ? "Pending Change" : "Changed";
        }
        return base;
      });

      const exportHeaders = [
        { label: "S.No.", key: "sno" },
        { label: "Username", key: "username" },
        { label: "Role", key: "role" },
        { label: "District", key: "district" },
        { label: "Block", key: "block" },
      ];
      if (!isNotLoggedIn) {
        exportHeaders.push({ label: "First Login Time", key: "login_time" });
        exportHeaders.push({ label: "Password Status", key: "status" });
      }

      return (
        <div className="analytics-module table-module">
          <div className="table-header">
            <h3>
              {isNotLoggedIn ? "Not Logged In Users" : "Recent First Logins"}
            </h3>
            <ExportButton
              data={exportData}
              headers={exportHeaders}
              filename={
                isNotLoggedIn ? "Not_Logged_In.csv" : "Login_Status.csv"
              }
            />
          </div>
          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>District</th>
                  <th>Block</th>
                  {!isNotLoggedIn && <th>First Login Time</th>}
                  {!isNotLoggedIn && <th>Password Status</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>
                    <td>{row.username}</td>
                    <td>{row.role_name.replace(/_/g, " ").toUpperCase()}</td>
                    <td>{row.district_name_en || "-"}</td>
                    <td>{row.block_name_en || "-"}</td>
                    {!isNotLoggedIn && (
                      <td>{formatDateTime(row.first_login_at)}</td>
                    )}
                    {!isNotLoggedIn && (
                      <td>
                        <span
                          className={`status-badge ${row.must_change_password ? "danger" : "success"}`}
                        >
                          {row.must_change_password
                            ? "Pending Change"
                            : "Changed"}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={isNotLoggedIn ? "5" : "7"}
                      style={{ textAlign: "center" }}
                    >
                      No records found for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    }
  }

  // ==========================================
  // VIEW: TMS -> CADRE SELECTION STATUS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_software") {
    const isCadreSummaryView = filters?.district_wise_cadre_summary === "1";

    if (isCadreSummaryView) {
      // ----------------------------------------
      // DISTRICT WISE CADRE SUMMARY TABLE
      // ----------------------------------------
      const summaryData = cadreData?.district_wise_cadre_summary || [];
      const totalPages = Math.ceil(summaryData.length / ROWS_PER_PAGE);
      const paginatedData = summaryData.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
      );

      const exportData = summaryData.map((row, idx) => ({
        sno: (currentPage - 1) * ROWS_PER_PAGE + idx + 1,
        district: row.district_name_en || "-",
        total_beneficiaries: row.total_beneficiaries,
        total_trainers: row.total_trainers,
      }));

      const exportHeaders = [
        { label: "S.No.", key: "sno" },
        { label: "District", key: "district" },
        { label: "Total Beneficiaries", key: "total_beneficiaries" },
        { label: "Total Trainers", key: "total_trainers" },
      ];

      return (
        <div className="analytics-module table-module">
          <div className="table-header">
            <h3>District Wise Cadre Summary</h3>
            <ExportButton
              data={exportData}
              headers={exportHeaders}
              filename="Cadre_Summary.csv"
            />
          </div>
          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>District</th>
                  <th>Total Beneficiaries</th>
                  <th>Total Trainers</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>
                    <td>{row.district_name_en || "-"}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: "#dbeafe", color: "#1e40af" }}
                      >
                        {row.total_beneficiaries}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: "#ffedd5", color: "#9a3412" }}
                      >
                        {row.total_trainers}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No summary data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    } else {
      // ----------------------------------------
      // DETAILED RECORDS TABLE
      // ----------------------------------------
      const records = cadreData?.data || [];
      const totalPages = Math.ceil(records.length / ROWS_PER_PAGE);
      const paginatedData = records.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
      );

      const exportData = records.map((row, idx) => ({
        sno: (currentPage - 1) * ROWS_PER_PAGE + idx + 1,
        username: row.username,
        district: row.district_name_en || "-",
        block: row.block_name_en || "-",
        program: row.training_name,
        beneficiaries: row.beneficiary_count,
        trainers: row.trainer_count,
      }));

      const exportHeaders = [
        { label: "S.No.", key: "sno" },
        { label: "Created By", key: "username" },
        { label: "District", key: "district" },
        { label: "Block", key: "block" },
        { label: "Training Program", key: "program" },
        { label: "Beneficiaries Selected", key: "beneficiaries" },
        { label: "Trainers Selected", key: "trainers" },
      ];

      return (
        <div className="analytics-module table-module">
          <div className="table-header">
            <h3>Cadre Selection Requests</h3>
            <ExportButton
              data={exportData}
              headers={exportHeaders}
              filename="Cadre_Selection.csv"
            />
          </div>
          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Created By</th>
                  <th>District</th>
                  <th>Block</th>
                  <th>Training Program</th>
                  <th>Beneficiaries Selected</th>
                  <th>Trainers Selected</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">
                      {(currentPage - 1) * ROWS_PER_PAGE + idx + 1}
                    </td>
                    <td className="fw-bold">{row.username}</td>
                    <td>{row.district_name_en || "-"}</td>
                    <td>{row.block_name_en || "-"}</td>
                    <td>{row.training_name}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: "#dbeafe", color: "#1e40af" }}
                      >
                        {row.beneficiary_count}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: "#ffedd5", color: "#9a3412" }}
                      >
                        {row.trainer_count}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No records found for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    }
  }
  
  // ==========================================
  // VIEW: TMS -> OVERALL DEMOGRAPHICS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_users") {
    const curriculum = overviewData?.platform_overview?.TMS?.curriculum;
    const plansData = curriculum?.plans_breakdown || [];

    // Pagination
    const totalPages = Math.ceil(plansData.length / ROWS_PER_PAGE);
    const paginatedData = plansData.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE,
    );

    // Export mapping
    const exportData = plansData.map((row, idx) => ({
      sno: (currentPage - 1) * ROWS_PER_PAGE + idx + 1,
      theme: row.theme_name,
      modules: row.plan_count,
      status: row.plan_count > 0 ? "Active Plans" : "No Plans",
    }));
    const exportHeaders = [
      { label: "S.No.", key: "sno" },
      { label: "Theme Name", key: "theme" },
      { label: "Number of Modules", key: "modules" },
      { label: "Status", key: "status" },
    ];

    return (
      <div className="analytics-module table-module">
        <div className="table-header">
          <h3>Training Themes & Modules Breakdown</h3>
          <ExportButton
            data={exportData}
            headers={exportHeaders}
            filename="Themes_Breakdown.csv"
          />
        </div>
        <div className="table-responsive">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Theme Name</th>
                <th>Number of Modules</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                  <td className="fw-bold">{row.theme_name}</td>
                  <td>
                    <span
                      style={{
                        background: "#f8fafc",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      {row.plan_count}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${row.plan_count > 0 ? "success" : "warning"}`}
                    >
                      {row.plan_count > 0 ? "Active Plans" : "No Plans"}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No Training Modules data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
