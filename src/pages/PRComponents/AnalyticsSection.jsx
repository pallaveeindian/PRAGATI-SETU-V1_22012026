// src/components/reports/AnalyticsSection.jsx
import React, { useState } from "react";

/* =========================================================
   1. CHARTS COMPONENT (Renders First)
   ========================================================= */
const AnalyticsCharts = ({ activeTab, activeSubTab }) => {
  return (
    <div className="analytics-module charts-module">
      <div className="chart-card">
        <h4>Overview Metrics</h4>
        <div className="mock-chart bar-chart">
          {/* Placeholder for actual chart library like Recharts or Chart.js */}
          <div className="bar" style={{ height: "60%" }}></div>
          <div className="bar" style={{ height: "80%" }}></div>
          <div className="bar" style={{ height: "40%" }}></div>
          <div className="bar" style={{ height: "90%" }}></div>
          <div className="bar" style={{ height: "50%" }}></div>
        </div>
      </div>
      <div className="chart-card">
        <h4>Distribution Analysis</h4>
        <div className="mock-chart pie-chart">
          <div className="pie-placeholder"></div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   2. FILTERS COMPONENT (Renders Second)
   ========================================================= */
const AnalyticsFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="analytics-module filters-module">
      <div className="filter-group">
        <label>District</label>
        <select
          value={filters.district}
          onChange={(e) => onFilterChange("district", e.target.value)}
        >
          <option value="all">All Districts</option>
          <option value="lucknow">Lucknow</option>
          <option value="kanpur">Kanpur</option>
          <option value="varanasi">Varanasi</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Block</label>
        <select
          value={filters.block}
          onChange={(e) => onFilterChange("block", e.target.value)}
        >
          <option value="all">All Blocks</option>
          <option value="block_a">Block A</option>
          <option value="block_b">Block B</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Financial Year</label>
        <select
          value={filters.year}
          onChange={(e) => onFilterChange("year", e.target.value)}
        >
          <option value="2025-2026">2025-2026</option>
          <option value="2024-2025">2024-2025</option>
        </select>
      </div>

      <button className="btn-apply-filters">Apply Filters</button>
    </div>
  );
};

/* =========================================================
   3. TABLE COMPONENT (Renders Third)
   ========================================================= */
const AnalyticsTable = ({ activeTab }) => {
  // Mock data - in reality, this would be fetched based on activeTab & filters
  const mockData = [
    {
      id: 1,
      location: "Lucknow",
      target: 12000,
      achieved: 10500,
      progress: "87%",
    },
    {
      id: 2,
      location: "Kanpur",
      target: 15000,
      achieved: 14200,
      progress: "94%",
    },
    {
      id: 3,
      location: "Varanasi",
      target: 9000,
      achieved: 6000,
      progress: "66%",
    },
    {
      id: 4,
      location: "Agra",
      target: 11000,
      achieved: 10800,
      progress: "98%",
    },
  ];

  return (
    <div className="analytics-module table-module">
      <div className="table-header">
        <h3>Detailed Data Report</h3>
        <button className="btn-export">Export to Excel</button>
      </div>
      <div className="table-responsive">
        <table className="gov-data-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>District / Location</th>
              <th>Assigned Target</th>
              <th>Achieved</th>
              <th>Progress (%)</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td className="fw-bold">{row.location}</td>
                <td>{row.target.toLocaleString("en-IN")}</td>
                <td>{row.achieved.toLocaleString("en-IN")}</td>
                <td>
                  <span
                    className={`status-badge ${parseInt(row.progress) > 80 ? "success" : "warning"}`}
                  >
                    {row.progress}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN PARENT COMPONENT
   ========================================================= */
export default function AnalyticsSection({ currentReport }) {
  // State to hold filter values, passed down to Filters and Table
  const [filters, setFilters] = useState({
    district: "all",
    block: "all",
    year: "2025-2026",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Extract tab info safely
  const activeTab = currentReport?.tab || "overview";
  const activeSubTab = currentReport?.subTab || "";

  return (
    <div className="analytics-section-wrapper">
      {/* 1. CHARTS */}
      <AnalyticsCharts activeTab={activeTab} activeSubTab={activeSubTab} />

      {/* 2. FILTERS */}
      <AnalyticsFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* 3. DATA TABLE */}
      <AnalyticsTable activeTab={activeTab} filters={filters} />

      {/* ================= STYLES ================= */}
      <style>{`
        .analytics-section-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeIn 0.4s ease-in-out;
        }

        .analytics-module {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          padding: 24px;
        }

        /* --- 1. Charts Styling --- */
        .charts-module {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        .chart-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .chart-card h4 {
          margin-top: 0;
          color: #0f172a;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .mock-chart {
          height: 250px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
        }
        .bar-chart .bar {
          width: 40px;
          background: #ff7a00;
          border-radius: 4px 4px 0 0;
          opacity: 0.8;
          transition: height 0.5s ease;
        }
        .pie-chart {
          align-items: center;
          justify-content: center;
        }
        .pie-placeholder {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(#ff7a00 0% 40%, #0f172a 40% 75%, #cbd5e1 75% 100%);
        }

        /* --- 2. Filters Styling --- */
        .filters-module {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: flex-end;
          background: #f8fafc;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 200px;
        }
        .filter-group label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .filter-group select {
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 14px;
          color: #0f172a;
          background-color: #ffffff;
          outline: none;
        }
        .filter-group select:focus {
          border-color: #ff7a00;
          box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
        }
        .btn-apply-filters {
          background-color: #0f172a;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          height: 42px; /* matches select input height */
        }
        .btn-apply-filters:hover {
          background-color: #1e293b;
        }

        /* --- 3. Table Styling --- */
        .table-module {
          padding: 0;
          overflow: hidden;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .table-header h3 {
          margin: 0;
          color: #0f172a;
          font-size: 18px;
        }
        .btn-export {
          background-color: #f1f5f9;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-export:hover {
          background-color: #e2e8f0;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .gov-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .gov-data-table th, 
        .gov-data-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          font-size: 14px;
        }
        .gov-data-table th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .gov-data-table tbody tr:hover {
          background-color: #f1f5f9;
        }
        .fw-bold {
          font-weight: 600;
          color: #0f172a !important;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .status-badge.success {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-badge.warning {
          background-color: #fef08a;
          color: #854d0e;
        }

        /* --- Animations & Responsive --- */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .charts-module {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .filters-module {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-apply-filters {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
