// src/pages/StateLoginPortal/TMSStateLoginDashboard/TargetVsAchievementPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import TablePagination from "../CommonUiComp/TablePagination";

// 1. Core Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Import your system lookup configurations and custom hooks
import { LOOKUP_API, TMS_API } from "../../../api/axios";
import useUserGeoscope, {
  useCanteenFilters,
} from "../../../Hooks/useUserGeoscope";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Mock operational targets array remains for internal table data structural mappings
const MOCK_DATA = [
  {
    id: 1,
    plan: "Plan A (Skills Dev)",
    districtId: "1",
    district: "Patna",
    blockId: "101",
    block: "Phulwari Sharif",
    target: 150,
    achievement: 120,
  },
  {
    id: 2,
    plan: "Plan A (Skills Dev)",
    districtId: "1",
    district: "Patna",
    blockId: "102",
    block: "Sampatchak",
    target: 100,
    achievement: 95,
  },
  {
    id: 3,
    plan: "Plan A (Skills Dev)",
    districtId: "2",
    district: "Gaya",
    blockId: "201",
    block: "Bodhgaya",
    target: 200,
    achievement: 185,
  },
  {
    id: 4,
    plan: "Plan B (Livelihood)",
    districtId: "2",
    district: "Gaya",
    blockId: "202",
    block: "Sherghati",
    target: 120,
    achievement: 110,
  },
  {
    id: 5,
    plan: "Plan B (Livelihood)",
    districtId: "3",
    district: "Muzaffarpur",
    blockId: "301",
    block: "Mushahari",
    target: 180,
    achievement: 140,
  },
  {
    id: 6,
    plan: "Plan B (Livelihood)",
    districtId: "3",
    district: "Muzaffarpur",
    blockId: "302",
    block: "Kanti",
    target: 130,
    achievement: 135,
  },
];

// Helper to extract DRF router array lists gracefully
const extractListing = (res) => {
  if (!res) return [];
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.results)) return res.data.results;
  return [];
};

const TargetVsAchievementPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  // API State for training plans
  const [apiTrainingPlans, setApiTrainingPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);

  // Pagination Settings
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Contextual User Authorization Geoscope Hooks Initialization
  const { geoScope, loading: geoLoading } = useUserGeoscope();

  const {
    districts: apiDistricts,
    blocks: apiBlocks,
    isBMM,
    isDMM,
    loading: filtersLoading,
  } = useCanteenFilters({
    district: selectedDistrict,
    setDistrict: setSelectedDistrict,
    block: selectedBlock,
    setBlock: setSelectedBlock,
    geoScope,
    geoLoading,
    extractListing,
  });

  // Fetch Training Plans from TMS API
  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        setPlansLoading(true);
        // Passing a larger page size to fetch master list values under DRF pagination limits
        const response = await TMS_API.trainingPlans.list({ page_size: 500 });
        const fetchedPlans = extractListing(response);
        setApiTrainingPlans(fetchedPlans);
      } catch (err) {
        console.error("Error fetching master training plans list scope:", err);
        setApiTrainingPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchTrainingPlans();
  }, []);

  // Action handling on primary configuration elements
  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
    if (!isDMM && !isBMM) setSelectedDistrict("");
    if (!isBMM) setSelectedBlock("");
    setPage(1);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedBlock("");
    setPage(1);
  };

  // Matrix calculation engine
  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      // Evaluates matches based on name or potential ID relations mapping values
      const matchesPlan = selectedPlan
        ? item.plan === selectedPlan ||
          String(item.planId) === String(selectedPlan)
        : true;

      const matchesDistrict = selectedDistrict
        ? String(item.districtId) === String(selectedDistrict) ||
          item.district === selectedDistrict
        : true;

      const matchesBlock = selectedBlock
        ? String(item.blockId) === String(selectedBlock) ||
          item.block === selectedBlock
        : true;

      return matchesPlan && matchesDistrict && matchesBlock;
    });
  }, [selectedPlan, selectedDistrict, selectedBlock]);

  // Dynamic Pagination Processing
  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    return pages === 0 ? 1 : pages;
  }, [filteredData.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.target += curr.target;
        acc.achievement += curr.achievement;
        return acc;
      },
      { target: 0, achievement: 0 },
    );
  }, [filteredData]);

  const calculatePercentage = (achieved, target) => {
    if (!target) return 0;
    return ((achieved / target) * 100).toFixed(1);
  };

  // Chart Data Transformation Matrix Setup
  const chartConfigData = useMemo(() => {
    const labels = filteredData.map(
      (item) => `${item.district} - ${item.block}`,
    );
    const targets = filteredData.map((item) => item.target);
    const achievements = filteredData.map((item) => item.achievement);

    return {
      labels,
      datasets: [
        {
          label: "Target Metrics",
          data: targets,
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
        {
          label: "Achievement Metrics",
          data: achievements,
          backgroundColor: "#f59e0b",
          borderRadius: 6,
        },
      ],
    };
  }, [filteredData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <>
      <div className="report-container">
        <div className="report-header">
          <p>
            Monitor your development targets against operational completions
            verified via location scopes.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="filter-card">
          {/* API Linked Training Plan Dropdown */}
          <div className="filter-group">
            <label htmlFor="plan-select">Training Plan</label>
            <select
              id="plan-select"
              value={selectedPlan}
              onChange={handlePlanChange}
              className="filter-select"
              disabled={plansLoading}
            >
              <option value="">
                {plansLoading ? "Loading Plans..." : "All Training Plans"}
              </option>
              {apiTrainingPlans.map((plan) => {
                // Fallback structures depending on DB layout configurations (name vs title)
                const planLabel =
                  plan.name || plan.title || plan.training_name || plan.plan;
                const planVal = plan.id || plan.plan_id || planLabel;
                return (
                  <option key={planVal} value={planVal}>
                    {planLabel}
                  </option>
                );
              })}
            </select>
          </div>

          {/* API Linked District Dropdown */}
          <div className="filter-group">
            <label htmlFor="district-select">District</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="filter-select"
              disabled={geoLoading || isDMM || isBMM}
            >
              <option value="">All Districts</option>
              {apiDistricts.map((dist) => (
                <option key={dist.district_id} value={dist.district_id}>
                  {dist.district_name_en || dist.name || dist.district}
                </option>
              ))}
            </select>
          </div>

          {/* Cascading Block Dropdown (Populates automatically on district selection) */}
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
              disabled={!selectedDistrict || isBMM}
            >
              <option value="">All Blocks</option>
              {apiBlocks.map((blk) => (
                <option key={blk.block_id} value={blk.block_id}>
                  {blk.block_name_en || blk.name || blk.block}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {(selectedPlan ||
            (!isDMM && !isBMM && selectedDistrict) ||
            (!isBMM && selectedBlock)) && (
            <button
              className="clear-btn"
              onClick={() => {
                setSelectedPlan("");
                if (!isDMM && !isBMM) setSelectedDistrict("");
                if (!isBMM) setSelectedBlock("");
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Chart Integration Section */}
        <div className="chart-card">
          <h3>Analytics Visualization</h3>
          <div className="chart-inner-container">
            {filteredData.length > 0 ? (
              <Bar data={chartConfigData} options={chartOptions} />
            ) : (
              <div className="chart-empty-state">
                No matrix data found to compile visual chart plots.
              </div>
            )}
          </div>
        </div>

        {/* Data Visual Table Grid */}
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Training Plan</th>
                <th>District</th>
                <th>Block</th>
                <th className="num-col">Target</th>
                <th className="num-col">Achievement</th>
                <th className="num-col">Achievement %</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const percent = calculatePercentage(
                    row.achievement,
                    row.target,
                  );
                  const serialNumber = (page - 1) * rowsPerPage + index + 1;

                  return (
                    <tr key={row.id}>
                      <td>{serialNumber}</td>
                      <td>
                        <span className="plan-tag">{row.plan}</span>
                      </td>
                      <td>
                        <strong>{row.district}</strong>
                      </td>
                      <td>{row.block}</td>
                      <td className="num-col">{row.target}</td>
                      <td className="num-col">{row.achievement}</td>
                      <td className="num-col">
                        <span
                          className={`status-badge ${percent >= 90 ? "high" : "mid"}`}
                        >
                          {percent}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No metrics match your current filtering matrix.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right">
                    Total Aggregate:
                  </td>
                  <td className="num-col">{totals.target}</td>
                  <td className="num-col">{totals.achievement}</td>
                  <td className="num-col font-bold">
                    {calculatePercentage(totals.achievement, totals.target)}%
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination Controls Component */}
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRecords={filteredData.length}
        />
      </div>
    </>
  );
};

export default TargetVsAchievementPage;
