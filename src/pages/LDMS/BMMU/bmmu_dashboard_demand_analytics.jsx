// src/pages/LDMS/BMMU/bmmu_dashboard_demand_analytics.jsx
import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function DemandAnalytics() {
  /* ---------------------------
     Survey Year Selectors
  --------------------------- */
  const [vprpYear, setVprpYear] = useState("2024");
  const [aepYear, setAepYear] = useState("2024");

  const surveyYears = ["2022", "2023", "2024"];

  /* ---------------------------
     PIE: PLD Registration Status
     (Better colors + spacing)
  --------------------------- */
  const pieData = [
    { name: "Enrolled under AEP", value: 34 },
    { name: "Enrolled under VPRP", value: 46 },
    { name: "Not enrolled in any Plan", value: 20 },
  ];

  const PIE_COLORS = ["#b71c1c", "#298f29", "#130103"];

  /* ---------------------------
     BAR: VPRP (Percentages)
  --------------------------- */
  const vprpBarData = useMemo(
    () => [
      { name: "Livelihood Support", count: 82 },
      { name: "Skill Training", count: 68 },
      { name: "Credit Linkage", count: 54 },
      { name: "Market Access", count: 46 },
      { name: "Govt Scheme Mapping", count: 61 },
    ],
    [vprpYear],
  );

  /* ---------------------------
     BAR: AEP (Percentages)
  --------------------------- */
  const aepBarData = useMemo(
    () => [
      { name: "Agri Enterprise", count: 78 },
      { name: "Dairy & Livestock", count: 64 },
      { name: "Handicraft", count: 52 },
      { name: "Food Processing", count: 59 },
      { name: "Retail & Trade", count: 71 },
    ],
    [aepYear],
  );

  return (
    <div className="ldms-analytics">
      {/* ================= PIE ================= */}
      <div className="ldms-chart-card">
        <h4>PLD Enrollment Status (%)</h4>

        <div className="pie-layout">
          {/* ===== LEFT : PIE ===== */}
          <div className="pie-left">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ value }) => `${value}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ===== RIGHT : CUSTOM LEGEND TABLE ===== */}
          <div className="pie-right">
            <table className="legend-table">
              <thead>
                <tr>
                  <th>Enrollment Type</th>
                  <th style={{ textAlign: "center" }}>%</th>
                </tr>
              </thead>
              <tbody>
                {pieData.map((item, i) => (
                  <tr key={item.name}>
                    <td>
                      <span
                        className="legend-dot"
                        style={{ background: PIE_COLORS[i] }}
                      />
                      {item.name}
                    </td>
                    <td>{item.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= BAR SECTION ================= */}
      <div className="ldms-bar-grid">
        {/* -------- VPRP -------- */}
        <div className="ldms-chart-card">
          <div className="chart-header">
            <h4>VPRP Demand Analytics (%)</h4>

            <div className="year-select">
              <span>Survey Year:</span>
              <select
                value={vprpYear}
                onChange={(e) => setVprpYear(e.target.value)}
              >
                {surveyYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={vprpBarData} barCategoryGap={28}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="count" fill="#c62828" barSize={24}>
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* -------- AEP -------- */}
        <div className="ldms-chart-card">
          <div className="chart-header">
            <h4>AEP Demand Analytics (%)</h4>

            <div className="year-select">
              <span>Survey Year:</span>
              <select
                value={aepYear}
                onChange={(e) => setAepYear(e.target.value)}
              >
                {surveyYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={aepBarData} barCategoryGap={28}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="count" fill="#c62828" barSize={24}>
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .ldms-analytics {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .ldms-bar-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .ldms-chart-card {
          background: #ffffff;
          border: 1px solid #f1c0c0;
          border-radius: 12px;
          padding: 16px 18px;
        }

        .ldms-chart-card h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #c62828;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .year-select {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #8b1d1d;
          font-weight: 600;
        }

        select {
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 6px;
          border: 1px solid #f1c0c0;
          color: #8b1d1d;
          background: #ffffff;
          cursor: pointer;
        }

        /* ===== PIE LAYOUT ===== */
        .pie-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: center;
        }

        .pie-left {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pie-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* ===== LEGEND TABLE ===== */
        .legend-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          border: 1px solid #f1d0d0;
          border-radius: 10px;
          overflow: hidden;
        }

        .legend-table thead th {
          background: #c62828;
          color: #ffffff;
          padding: 12px;
          font-weight: 700;
        }

        .legend-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #f3e1e1;
          text-align: center;
          font-weight: 500;
        }

        .legend-table tbody tr:hover {
          background: #fff5f5;
        }

        .legend-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .legend-table td:first-child {
          text-align: left;
          font-weight: 600;
          color: #111;
        }

        @media (max-width: 1024px) {
          .ldms-bar-grid {
            grid-template-columns: 1fr;
          }

          .pie-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }         

        }

        @media (max-width: 480px) {
          .legend-table {
            font-size: 12px;
          }

          .legend-table thead th {
            padding: 8px;
          }

          .legend-table td {
            padding: 8px;
          }
        }          
      `}</style>
    </div>
  );
}
