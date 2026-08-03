// src/pages/StateLoginPortal/TMSStateLoginDashboard/CadreSelectionCountPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import TablePagination from "../CommonUiComp/TablePagination";
import api, { LOOKUP_API } from "../../../api/axios";

// 1. Core Chart.js imports for Bar layout structure
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const CadreSelectionCountPage = () => {
  // --- Live API Data States ---
  const [cadreDataList, setCadreDataList] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Filter States ---
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ==========================================
  // 1. INITIAL LOOKUPS FETCHING (DISTRICTS & THEMES)
  // ==========================================
  useEffect(() => {
    const fetchInitialLookups = async () => {
      try {
        const distRes = await LOOKUP_API.districts.list({ page_size: 5000 });
        setDistricts(
          Array.isArray(distRes?.data)
            ? distRes.data
            : distRes?.data?.results || [],
        );

        const themeRes = await api.get("/tms/training-themes/", {
          params: { page_size: 1000 },
        });
        setThemes(
          Array.isArray(themeRes?.data)
            ? themeRes.data
            : themeRes?.data?.results || [],
        );
      } catch (err) {
        console.error("Error loading initial dropdown lookups:", err);
      }
    };
    fetchInitialLookups();
  }, []);

  // ==========================================
  // 2. DEPENDENT LOOKUPS FETCHING (CASCADING)
  // ==========================================
  useEffect(() => {
    if (!selectedDistrict) {
      setBlocks([]);
      return;
    }
    const fetchBlocks = async () => {
      try {
        const res = await LOOKUP_API.blocksByDistrict(selectedDistrict, {
          params: { page_size: 5000 },
        });
        setBlocks(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching dependent blocks:", err);
        setBlocks([]);
      }
    };
    fetchBlocks();
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedTheme) {
      setPlans([]);
      return;
    }
    const fetchPlans = async () => {
      try {
        const res = await api.get("/tms/training-plans/", {
          params: { theme_id: selectedTheme, page_size: 1000 },
        });
        setPlans(
          Array.isArray(res?.data) ? res.data : res?.data?.results || [],
        );
      } catch (err) {
        console.error("Error fetching dependent plans:", err);
        setPlans([]);
      }
    };
    fetchPlans();
  }, [selectedTheme]);

  // ==========================================
  // 3. MAIN LIVE SUMMARY FETCH ENGINE (ALIGNED WITH ANALYTICS)
  // ==========================================
  const fetchCadreSummaryData = useCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();

    // Parameter mapping matching AnalyticsSection query setup
    if (selectedDistrict) queryParams.append("district_id", selectedDistrict);
    if (selectedBlock) queryParams.append("block_id", selectedBlock);
    if (selectedTheme) queryParams.append("theme_id", selectedTheme);
    if (selectedPlan) queryParams.append("plan_id", selectedPlan);

    // Control flags for localized breakdown summaries
    if (selectedDistrict && !selectedBlock) {
      queryParams.append("district_wise_cadre_summary", "1");
    } else if (!selectedDistrict) {
      // If no district is chosen, fall back to general summary structural rules
      queryParams.append("district_wise_summary", "1");
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    try {
      const res = await api.get(
        `/public/cadre-selection-summary/${queryString}`,
      );

      // Checking using the exact standard structural pattern from AnalyticsSection
      if (res.data?.status === "success") {
        // Check where the payload array resides within successful responses
        const rawData =
          res.data.cadre_summary || res.data.data || res.data.results || [];
        setCadreDataList(Array.isArray(rawData) ? rawData : []);
      } else if (Array.isArray(res.data)) {
        setCadreDataList(res.data);
      } else {
        setCadreDataList([]);
      }
    } catch (err) {
      console.error("Error fetching cadre selection summary matrix:", err);
      setCadreDataList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, selectedBlock, selectedTheme, selectedPlan]);

  useEffect(() => {
    fetchCadreSummaryData();
  }, [fetchCadreSummaryData]);

  // ==========================================
  // CONTROL HANDLERS (RESET SUB-ENTITIES)
  // ==========================================
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedBlock("");
    setPage(1);
  };

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
    setSelectedPlan("");
    setPage(1);
  };

  // ==========================================
  // DATA COMPUTATION MATRIX
  // ==========================================
  const totalPages = useMemo(() => {
    const pages = Math.ceil(cadreDataList.length / rowsPerPage);
    return pages === 0 ? 1 : pages;
  }, [cadreDataList.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return cadreDataList.slice(startIndex, startIndex + rowsPerPage);
  }, [cadreDataList, page, rowsPerPage]);

  const aggregateTotalCount = useMemo(() => {
    return cadreDataList.reduce(
      (acc, curr) =>
        acc +
        Number(curr.selectedCount || curr.selected_count || curr.count || 0),
      0,
    );
  }, [cadreDataList]);

  const chartConfigData = useMemo(() => {
    const planSummary = {};

    // Changed dependency path from cadreDataList to paginatedData
    paginatedData.forEach((item) => {
      const plan =
        item.training_name || item.plan_name || item.plan || "Unknown Plan";

      const cadreCount = Number(
        item.beneficiary_count ||
          item.selectedCount ||
          item.selected_count ||
          item.count ||
          0,
      );

      const trainerCount = Number(item.trainer_count || 0);

      if (!planSummary[plan]) {
        planSummary[plan] = {
          cadreCount: 0,
          trainerCount: 0,
        };
      }

      planSummary[plan].cadreCount += cadreCount;
      planSummary[plan].trainerCount += trainerCount;
    });

    const labels = Object.keys(planSummary);

    const values = labels.map((plan) => planSummary[plan].cadreCount);

    return {
      labels,
      datasets: [
        {
          label: "Cadre Count",
          data: values,
          backgroundColor: [
            "#2563eb",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
            "#84cc16",
            "#f97316",
            "#ec4899",
            "#14b8a6",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  }, [paginatedData]); // Added paginatedData here as the driver dependency

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Cadres: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="report-container">
        <div className="report-header">
          <p>
            Track, verify, and monitor localized deployment cadre allocation
            counts filtered by programmatic operations.
          </p>
        </div>

        {/* Filter Controls Matrix Panel */}
        <div className="filter-card">
          {/* District Dropdown */}
          <div className="filter-group">
            <label htmlFor="district-select">District</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="filter-select"
            >
              <option value="">All Districts</option>
              {districts.map((dist) => {
                const id = dist.district_id || dist.id;
                const name =
                  dist.district_name_en || dist.name || dist.district;
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Block Dropdown (Cascaded Dependent) */}
          <div className="filter-group">
            <label htmlFor="block-select">Block</label>
            <select
              id="block-select"
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              disabled={!selectedDistrict}
            >
              <option value="">All Blocks</option>
              {blocks.map((blk) => {
                const id = blk.block_id || blk.id;
                const name = blk.block_name_en || blk.name || blk.block;
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Theme Dropdown */}
          <div className="filter-group">
            <label htmlFor="theme-select">Theme</label>
            <select
              id="theme-select"
              value={selectedTheme}
              onChange={handleThemeChange}
              className="filter-select"
            >
              <option value="">All Themes</option>
              {themes.map((theme) => {
                const id = theme.id || theme.theme_id;
                const name = theme.name || theme.theme_name || theme.title;
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Plan Sub-filter Dropdown */}
          <div className="filter-group">
            <label htmlFor="plan-select">Plan (Sub-Filter)</label>
            <select
              id="plan-select"
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value);
                setPage(1);
              }}
              className="filter-select"
              disabled={!selectedTheme}
            >
              <option value="">All Plans</option>
              {plans.map((plan) => {
                const id = plan.id || plan.plan_id;
                const name =
                  plan.training_name ||
                  plan.title ||
                  plan.plan_name ||
                  plan.name;
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reset Button Action */}
          {(selectedDistrict ||
            selectedBlock ||
            selectedTheme ||
            selectedPlan) && (
            <button
              className="clear-btn"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedBlock("");
                setSelectedTheme("");
                setSelectedPlan("");
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dynamic Visual Insights Graph Section */}
        <div className="chart-card">
          <h3>
            Cadre Metrics Breakdown{" "}
            {selectedDistrict
              ? `for Selected Blocks`
              : "(District Wise Overview)"}
          </h3>
          <div className="chart-wrapper-box">
            {loading ? (
              <div className="chart-empty-state">
                Loading analysis metrics matrix plots...
              </div>
            ) : cadreDataList.length > 0 ? (
              <Pie data={chartConfigData} options={chartOptions} />
            ) : (
              <div className="chart-empty-state">
                No matrix values match to generate graphics plot views.
              </div>
            )}
          </div>
        </div>

        {/* Data Collection Grid Table */}
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Sl. No.</th>
                <th>District</th>
                <th>Block</th>
                <th>Theme</th>
                <th>Plan Framework</th>
                <th className="num-col">Cadre Count</th>
                <th className="num-col">Trainer Count</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Compiling records dashboard summaries...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const serialNumber = (page - 1) * rowsPerPage + index + 1;

                  return (
                    <tr key={index}>
                      <td>{serialNumber}</td>

                      <td>
                        <strong>
                          {row.district_name_en ||
                            row.district_name ||
                            row.district ||
                            "N/A"}
                        </strong>
                      </td>

                      <td>
                        {row.block_name_en ||
                          row.block_name ||
                          row.block ||
                          "N/A"}
                      </td>

                      <td>
                        <span className="theme-tag">
                          {row.theme_name || row.theme || "N/A"}
                        </span>
                      </td>

                      <td className="plan-text-col">
                        {row.training_name ||
                          row.plan_name ||
                          row.plan ||
                          "N/A"}
                      </td>

                      <td className="num-col font-bold value-highlight">
                        {row.beneficiary_count ||
                          row.selectedCount ||
                          row.selected_count ||
                          row.count ||
                          0}
                      </td>
                      {/* Trainer Count */}
                      <td className="num-col font-bold value-highlight">
                        {row.trainer_count || 0}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No metrics found matching the selected evaluation criteria
                    combination.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Engine integration */}
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={cadreDataList.length}
        />
      </div>

      <style>{`
                .report-container { padding: 32px; background: #f8fafc; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
                .report-header h2 { font-size: 24px; color: #0f172a; margin: 0 0 6px 0; font-weight: 700; }
                .report-header p { color: #64748b; margin: 0 0 28px 0; font-size: 14px; }
                .filter-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); flex-wrap: wrap; }
                .filter-group { display: flex; flex-direction: column; gap: 6px; min-width: 220px; flex: 1; }
                .filter-group label { font-size: 13px; font-weight: 600; color: #475569; }
                .filter-select { padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background-color: #ffffff; font-size: 14px; color: #1e293b; outline: none; cursor: pointer; transition: all 0.2s ease; }
                .filter-select:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
                .filter-select:disabled { background-color: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
                .clear-btn { padding: 10px 16px; background: transparent; border: 1px dashed #cbd5e1; color: #64748b; font-weight: 500; font-size: 14px; border-radius: 8px; cursor: pointer; height: 41px; transition: all 0.2s ease; }
                .clear-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }
                .chart-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .chart-card h3 { margin: 0 0 16px 0; font-size: 16px; color: #1e293b; font-weight: 600; }
                .chart-wrapper-box { position: relative; height: 300px; width: 100%; }
                .chart-empty-state { display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8; font-size: 14px; }
                .table-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin-bottom: 24px; }
                .report-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
                .report-table th { background: #f1f5f9; color: #475569; font-weight: 600; padding: 14px 20px; border-bottom: 1px solid #e2e8f0; }
                .report-table td { padding: 14px 20px; color: #334155; border-bottom: 1px solid #f1f5f9; }
                .report-table tbody tr:hover { background-color: #f8fafc; }
                .theme-tag { background: #eff6ff; padding: 4px 10px; border-radius: 6px; font-size: 12px; color: #1e40af; font-weight: 600; border: 1px solid #bfdbfe; }
                .plan-text-col { color: #475569; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .num-col { text-align: right; }
                .value-highlight { color: #0f172a; font-size: 15px; }
                .text-right { text-align: right; font-weight: 600; color: #475569; }
                .font-bold { font-weight: 700; }
                .empty-state { text-align: center; padding: 48px !important; color: #94a3b8; font-size: 14px; }
                .report-table tfoot tr { background: #f8fafc; border-top: 2px solid #e2e8f0; }
                .report-table tfoot td { padding: 16px 20px; color: #0f172a; font-weight: 700; }
                .final-total-sum { font-size: 16px; color: #2563eb !important; }
            `}</style>
    </>
  );
};

export default CadreSelectionCountPage;
