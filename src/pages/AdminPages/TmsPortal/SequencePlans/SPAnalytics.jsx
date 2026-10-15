// src/pages/AdminPages/TmsPortal/SequencePlans/SPAnalytics.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaProjectDiagram, FaFileExcel, FaSyncAlt } from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthContext";
import api, { TMS_API } from "../../../../api/axios";
import { getCanonicalRole } from "../../../../utils/roleUtils";

export default function SPAnalytics() {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  // Data & Loading States
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [themes, setThemes] = useState([]);
  const [themesLoading, setThemesLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [financialYear, setFinancialYear] = useState("2026-27");

  // Server-Side Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 1. Load Themes (and lock if logged-in user is SMMU)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setThemesLoading(true);
      try {
        const res = await TMS_API.trainingThemes.list({ page_size: 200 });
        const allThemes = res?.data?.results || res?.data || [];
        if (!isMounted) return;

        if (role === "smmu" && user?.id) {
          const myTheme = allThemes.find(
            (t) => Number(t.expert) === Number(user?.id),
          );
          if (myTheme) {
            setThemes([myTheme]);
            setSelectedTheme(String(myTheme.id));
          } else {
            setThemes(allThemes);
          }
        } else {
          setThemes(allThemes);
        }
      } catch (err) {
        console.error("Failed to load training themes:", err);
      } finally {
        if (isMounted) setThemesLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [role, user?.id]);

  // 2. Server-Side Fetch Function
  const fetchSequenceAnalytics = useCallback(
    async (pageToFetch = 1, sizeToFetch = pageSize) => {
      if (role === "smmu" && themesLoading) return;

      setLoading(true);
      setError(null);
      try {
        const params = {
          page: pageToFetch,
          page_size: sizeToFetch,
          financial_year: financialYear || undefined,
          theme_id: selectedTheme || undefined,
        };

        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== undefined && v !== null && v !== "",
          ),
        );

        const response = await api.get("/tms/reports/sequence-analytics/", {
          params: cleanParams,
        });

        const data = response?.data || {};
        setRows(data.results || []);
        setTotalCount(data.count || 0);
        setCurrentPage(pageToFetch);
      } catch (err) {
        console.error("Failed to fetch sequence analytics:", err);
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.error ||
            "Failed to load sequence analytics report.",
        );
        setRows([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [financialYear, selectedTheme, pageSize, role, themesLoading],
  );

  // Trigger initial fetch once themes/role lock are ready
  useEffect(() => {
    if (role === "smmu" && themesLoading) return;
    fetchSequenceAnalytics(1, pageSize);
  }, [fetchSequenceAnalytics, role, themesLoading, pageSize]);

  // Handle Page Size Change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    fetchSequenceAnalytics(1, newSize);
  };

  // 3. Full Excel Export (Fetches max page_size so all filtered rows export)
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params = {
        page: 1,
        page_size: 100, // Matches backend max_page_size = 100
        financial_year: financialYear || undefined,
        theme_id: selectedTheme || undefined,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => v !== undefined && v !== null && v !== "",
        ),
      );

      const response = await api.get("/tms/reports/sequence-analytics/", {
        params: cleanParams,
      });

      const exportItems = response?.data?.results || [];
      if (!exportItems.length) {
        alert("No sequence analytics records available to export.");
        return;
      }

      const escapeCell = (value) =>
        String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

      const headers = [
        "Sr No",
        "Sequence Group",
        "Step",
        "Plan Name",
        "Theme Name",
        "Target",
        "Onboarded",
        "Descended Entries",
        "Successful Descendants",
        "Dropout Descendants",
        "Lateral Entries",
      ];

      const tableRows = exportItems.map((r, idx) => [
        idx + 1,
        r.sequence_group_name || "-",
        `Step ${r.step_order || 1}`,
        r.plan_name || "-",
        r.theme_name || "-",
        r.target ?? 0,
        r.onboarded ?? 0,
        r.descended_entries ?? 0,
        r.successful_descendants ?? 0,
        r.dropout_descendants ?? 0,
        r.lateral_entries ?? 0,
      ]);

      const tableHTML = [
        '<table border="1"><thead><tr style="background:#3d6ba6;color:#ffffff;font-weight:bold;">',
        headers.map((h) => `<th>${escapeCell(h)}</th>`).join(""),
        "</tr></thead><tbody>",
        tableRows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeCell(cell)}</td>`).join("")}</tr>`,
          )
          .join(""),
        "</tbody></table>",
      ].join("");

      const blob = new Blob(
        [
          `<html><head><meta charset="UTF-8"></head><body>${tableHTML}</body></html>`,
        ],
        { type: "application/vnd.ms-excel;charset=utf-8;" },
      );

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Sequence_Plan_Analytics_${financialYear || "All"}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export sequence analytics.");
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="app-shell">
      <div className="content-area">
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            <div
              style={{ width: "100%", maxWidth: "none", margin: "0 auto" }}
              className="training-request-page"
            >
              {/* FILTER BAR */}
              <div
                style={{
                  background: "#e4ecf5",
                  padding: 16,
                  borderRadius: 10,
                  marginBottom: 14,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <select
                    className="filter-input"
                    value={selectedTheme}
                    disabled={role === "smmu"}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                  >
                    <option value="">All Themes</option>
                    {themes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.theme_name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="filter-input"
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                  >
                    <option value="">All Financial Years</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>

                  <button
                    className="btnPrimary"
                    onClick={() => fetchSequenceAnalytics(1, pageSize)}
                    disabled={loading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      fontWeight: 600,
                    }}
                  >
                    <FaSyncAlt className={loading ? "spin-icon" : ""} />
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 12,
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 8,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#2b4e72",
                    fontSize: 20,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FaProjectDiagram /> Recurring Plan Analytics
                </h2>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="btnPrimary"
                    onClick={handleExportExcel}
                    disabled={loading || isExporting || rows.length === 0}
                    style={{
                      backgroundColor: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 600,
                    }}
                  >
                    <FaFileExcel />
                    {isExporting ? "Exporting..." : "Export to Excel"}
                  </button>
                </div>
              </div>

              {/* ERROR BANNER */}
              {error && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #f87171",
                    color: "#b91c1c",
                    padding: "12px 16px",
                    borderRadius: 8,
                    marginBottom: 14,
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {/* TABLE CARD */}
              <div
                style={{
                  background: "#fff",
                  padding: 12,
                  borderRadius: 10,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
                className="admin-training-table-card"
              >
                <div
                  className="training-table-scroll"
                  style={{
                    height: "auto",
                    minHeight: 0,
                    overflowX: "auto",
                  }}
                >
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Plan Name</th>
                        <th>Theme Name</th>
                        <th>Target</th>
                        <th>Onboarded</th>
                        <th>Descended Entries</th>
                        <th>Successful Descendants</th>
                        <th>Dropout Descendants</th>
                        <th>Lateral Entries</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={9} style={{ padding: 24 }}>
                            Loading sequence analytics…
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ padding: 24 }}>
                            No sequence plans found
                          </td>
                        </tr>
                      ) : (
                        rows.map((r) => (
                          <tr key={`${r.plan_id}-${r.step_order}`}>
                            <td style={{ fontWeight: 700 }}>{r.sr_no}</td>
                            <td style={{ textAlign: "left" }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: "#1e3a8a",
                                  marginBottom: 3,
                                }}
                              >
                                {r.plan_name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#475569",
                                  display: "flex",
                                  gap: 6,
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span>{r.sequence_group_name}</span>
                                <span className="step-pill">
                                  Step {r.step_order}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="theme-pill">
                                {r.theme_name || "—"}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>
                              {(r.target ?? 0).toLocaleString()}
                            </td>
                            <td style={{ fontWeight: 700, color: "#1d4ed8" }}>
                              {(r.onboarded ?? 0).toLocaleString()}
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                background: "#eff6ff",
                                color: "#1e40af",
                              }}
                            >
                              {(r.descended_entries ?? 0).toLocaleString()}
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                background: "#f0fdf4",
                                color: "#15803d",
                              }}
                            >
                              {(r.successful_descendants ?? 0).toLocaleString()}
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                background: "#fef2f2",
                                color: "#dc2626",
                              }}
                            >
                              {(r.dropout_descendants ?? 0).toLocaleString()}
                            </td>
                            <td
                              style={{
                                fontWeight: 700,
                                background: "#fffbeb",
                                color: "#b45309",
                              }}
                            >
                              {(r.lateral_entries ?? 0).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* MOBILE CARD VIEW */}
                  <div className="mobile-card-list">
                    {loading ? (
                      <div className="mobile-card">
                        Loading sequence analytics…
                      </div>
                    ) : rows.length === 0 ? (
                      <div className="mobile-card">No sequence plans found</div>
                    ) : (
                      rows.map((r) => (
                        <div
                          key={`${r.plan_id}-${r.step_order}`}
                          className="mobile-card"
                        >
                          <div>
                            <strong>Sr No:</strong> {r.sr_no}
                          </div>
                          <div>
                            <strong>Sequence:</strong> {r.sequence_group_name}{" "}
                            (Step {r.step_order})
                          </div>
                          <div>
                            <strong>Plan Name:</strong> {r.plan_name}
                          </div>
                          <div>
                            <strong>Theme Name:</strong> {r.theme_name || "—"}
                          </div>
                          <div>
                            <strong>Target:</strong>{" "}
                            {(r.target ?? 0).toLocaleString()}
                          </div>
                          <div>
                            <strong>Onboarded:</strong>{" "}
                            {(r.onboarded ?? 0).toLocaleString()}
                          </div>
                          <div>
                            <strong>Descended Entries:</strong>{" "}
                            {(r.descended_entries ?? 0).toLocaleString()}
                          </div>
                          <div>
                            <strong>Successful Descendants:</strong>{" "}
                            {(r.successful_descendants ?? 0).toLocaleString()}
                          </div>
                          <div>
                            <strong>Dropout Descendants:</strong>{" "}
                            {(r.dropout_descendants ?? 0).toLocaleString()}
                          </div>
                          <div>
                            <strong>Lateral Entries:</strong>{" "}
                            {(r.lateral_entries ?? 0).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SERVER-SIDE PAGINATION CONTROLS */}
                <div
                  className="training-pagination"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    paddingTop: 12,
                    marginTop: 8,
                    minHeight: 42,
                  }}
                >
                  <div
                    style={{ color: "#2b4e72", fontSize: 14, fontWeight: 500 }}
                  >
                    Showing{" "}
                    <strong>
                      {(currentPage - 1) * pageSize + (rows.length > 0 ? 1 : 0)}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(currentPage * pageSize, totalCount)}
                    </strong>{" "}
                    of <strong>{totalCount}</strong> sequence plans
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Page Size Selector */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 13,
                          color: "#2b4e72",
                          fontWeight: 600,
                        }}
                      >
                        Rows per page:
                      </label>
                      <select
                        value={pageSize}
                        onChange={(e) =>
                          handlePageSizeChange(Number(e.target.value))
                        }
                        style={{
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: "1px solid #3d6ba6",
                          outline: "none",
                          cursor: "pointer",
                          background: "#fff",
                          color: "#2b4e72",
                          fontWeight: 600,
                        }}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    {/* Page Navigation Buttons */}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btnPage"
                        disabled={currentPage === 1 || loading}
                        onClick={() =>
                          fetchSequenceAnalytics(currentPage - 1, pageSize)
                        }
                      >
                        Prev
                      </button>

                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          className={`btnPage ${
                            currentPage === pageNum ? "activePage" : ""
                          }`}
                          disabled={loading}
                          onClick={() =>
                            fetchSequenceAnalytics(pageNum, pageSize)
                          }
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        className="btnPage"
                        disabled={
                          currentPage === totalPages ||
                          totalPages === 0 ||
                          loading
                        }
                        onClick={() =>
                          fetchSequenceAnalytics(currentPage + 1, pageSize)
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              .content-area {
                display: flex;
                flex: 1;
              }
              .main-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0;
              }

              .btnPrimary {
                background: #3d6ba6;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 6px 14px;
                cursor: pointer;
                transition: all .25s ease;
              }
              .btnPrimary:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.15);
              }
              .btnPrimary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }

              .filter-input {
                border: 1px solid #3d6ba6;
                border-radius: 6px;
                padding: 7px 12px;
                background: #fff;
                outline: none;
                font-size: 14px;
                min-width: 180px;
                color: #1e3a5f;
                font-weight: 600;
              }
              .filter-input:disabled {
                background-color: #f1f5f9;
                color: #64748b;
                cursor: not-allowed;
              }

              .training-table {
                width: 100%;
                height: auto;
                border-collapse: collapse;
                table-layout: fixed;
                font-size: 13px;
              }
              .training-table thead {
                background: #3d6ba6;
                color: white;
              }
              .training-table th {
                padding: 10px 7px;
                font-weight: 600;
                text-align: center;
                white-space: normal;
                line-height: 1.25;
              }
              .training-table td {
                padding: 9px 7px;
                border-bottom: 1px solid #e4ecf5;
                text-align: center;
                vertical-align: middle;
                line-height: 1.25;
                overflow-wrap: anywhere;
                color: #1f2937;
              }

              .training-table th:nth-child(1),
              .training-table td:nth-child(1) { width: 6%; }
              .training-table th:nth-child(2),
              .training-table td:nth-child(2) { width: 22%; }
              .training-table th:nth-child(3),
              .training-table td:nth-child(3) { width: 10%; }
              .training-table th:nth-child(4),
              .training-table td:nth-child(4) { width: 10%; }
              .training-table th:nth-child(5),
              .training-table td:nth-child(5) { width: 10%; }
              .training-table th:nth-child(6),
              .training-table td:nth-child(6) { width: 10%; }
              .training-table th:nth-child(7),
              .training-table td:nth-child(7) { width: 11%; }
              .training-table th:nth-child(8),
              .training-table td:nth-child(8) { width: 11%; }
              .training-table th:nth-child(9),
              .training-table td:nth-child(9) { width: 10%; }

              .training-table tbody tr {
                background: #f8fbff;
              }
              .training-table tbody tr:nth-child(even) {
                background: #edf4fb;
              }
              .training-table tbody tr:hover {
                background: #dbeafe;
                transition: background .2s;
              }

              .step-pill {
                background: #dbeafe;
                color: #1e40af;
                padding: 2px 7px;
                border-radius: 999px;
                font-weight: 700;
                font-size: 10px;
              }
              .theme-pill {
                background: #e2e8f0;
                color: #1e293b;
                padding: 3px 8px;
                border-radius: 6px;
                font-weight: 700;
                font-size: 11px;
                display: inline-block;
              }

              .training-pagination {
                border-top: 1px solid #e4ecf5;
                color: #2b4e72;
              }

              .btnPage {
                background: #e4ecf5;
                border: none;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                color: #2b4e72;
                font-weight: 600;
                transition: all .2s ease;
              }
              .btnPage:hover:not(:disabled) {
                background: #a7c6ed;
              }
              .btnPage:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }
              .activePage {
                background: #3d6ba6 !important;
                color: #fff !important;
              }

              .spin-icon {
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                100% { transform: rotate(360deg); }
              }

              .mobile-card-list {
                display: none;
              }

              @media (max-width: 768px) {
                .training-request-page {
                  padding: 0 !important;
                }
                .training-table {
                  display: none !important;
                }
                .mobile-card-list {
                  display: block;
                }
                .mobile-card {
                  background: #f8fbff;
                  border: 1px solid #a7c6ed;
                  border-radius: 10px;
                  padding: 12px;
                  margin-bottom: 12px;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                  font-size: 13px;
                  color: #2b4e72;
                }
                .mobile-card div {
                  margin-bottom: 4px;
                }
              }
            `}</style>
          </main>
        </div>
      </div>
    </div>
  );
}
