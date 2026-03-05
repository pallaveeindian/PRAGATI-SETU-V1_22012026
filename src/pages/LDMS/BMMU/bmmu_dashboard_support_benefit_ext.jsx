// src/pages/LDMS/BMMU/bmmu_dashboard_support_benefit_ext.jsx
import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

/**
 * BMMU – Support & Benefit Extension (Hypothetical)
 * Theme: White + Red
 */

export default function SupportBenefitExt() {
  /* ---------------------------
     Constants
  --------------------------- */
  const SUPPORT_TYPES = [
    "Subsidy",
    "Grant",
    "Credit Linkages",
    "Trainings",
    "Raw Materials",
    "Infrastructure",
  ];

  const DEPARTMENTS = [
    "Rural Development",
    "Agriculture",
    "Animal Husbandry",
    "MSME",
    "Horticulture",
    "Skill Development",
    "Women & Child Welfare",
  ];

  const SCHEMES = [
    "UPSRLM Subsidy Scheme",
    "Mukhyamantri Swarozgar Yojana",
    "NRLM Credit Support",
    "State Infrastructure Aid",
    "Rural Enterprise Grant",
  ];

  const TRAININGS = [
    "Enterprise Development Training",
    "Financial Literacy Module",
    "Agri Business Training",
    "Skill Upgradation Program",
    "Market Readiness Workshop",
  ];

  /* ---------------------------
     Department Selector
  --------------------------- */
  const [department, setDepartment] = useState(DEPARTMENTS[0]);

  /* ---------------------------
     PIE: Needs vs Support
  --------------------------- */
  const pieData = [
    { name: "Subsidy", value: 22 },
    { name: "Grant", value: 18 },
    { name: "Credit Linkages", value: 20 },
    { name: "Trainings", value: 16 },
    { name: "Raw Materials", value: 14 },
    { name: "Infrastructure", value: 10 },
  ];

  const PIE_COLORS = [
    "#b71c1c",
    "#000000",
    "#075025",
    "#ff8a80",
    "#ffcdd2",
    "#81c784",
  ];

  /* ---------------------------
     AREA: Department-wise %
  --------------------------- */
  const areaData = useMemo(
    () =>
      DEPARTMENTS.map((d, i) => ({
        department: d,
        percentage: Math.floor(20 + ((i * 33) % 53)), // max 53%
      })),
    [],
  );

  /* ---------------------------
     BAR: Support Type % (Dept-wise)
  --------------------------- */
  const barData = useMemo(
    () =>
      SUPPORT_TYPES.map((s, i) => ({
        name: s,
        value: Math.floor(18 + ((i * 29) % 53)),
      })),
    [department],
  );

  /* ---------------------------
     TABLE DATA
  --------------------------- */
  const tableData = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const type = SUPPORT_TYPES[i % SUPPORT_TYPES.length];
      const isTraining = type === "Trainings";

      return {
        sn: i + 1,
        type,
        scheme: isTraining
          ? TRAININGS[i % TRAININGS.length]
          : SCHEMES[i % SCHEMES.length],
        amount: Math.floor(20000 + ((i * 13789) % 80000)),
        plan: i % 2 === 0 ? "AEP" : "VPRP",
      };
    });
  }, []);

  const totalAmount = tableData.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="ldms-support-analytics">
      {/* ================= PIE ================= */}
      <div className="ldms-chart-card">
        <h4>Needs vs Support Extension</h4>

        <div className="pie-layout">
          {/* ===== LEFT : PIE ===== */}
          <div className="pie-left">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ value }) => `${value}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ===== RIGHT : LEGEND + TABLE ===== */}
          <div className="pie-right">
            <table className="legend-table">
              <thead>
                <tr>
                  <th>Support Type</th>
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

      {/* ================= AREA ================= */}
      <div className="ldms-chart-card">
        <h4>Department-wise Support Coverage (%)</h4>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c62828" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#c62828" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#c62828"
              fill="url(#areaGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BAR + TABLE ================= */}
      <div className="ldms-bottom-grid">
        {/* -------- BAR -------- */}
        <div className="ldms-chart-card">
          <div className="chart-header">
            <h4>Support Type Distribution (%)</h4>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap={26}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" fill="#c62828" barSize={26}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* -------- TABLE -------- */}
        <div className="ldms-chart-card">
          <h4>Support Benefit Details</h4>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Support Type</th>
                  <th>Scheme / Training Module</th>
                  <th>Benefit Amount (₹)</th>
                  <th>Plan</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((r) => (
                  <tr key={r.sn}>
                    <td>{r.sn}</td>
                    <td>{r.type}</td>
                    <td>{r.scheme}</td>
                    <td>{r.amount.toLocaleString()}</td>
                    <td>{r.plan}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Total</td>
                  <td colSpan="2">₹ {totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .ldms-support-analytics {
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
          overflow: hidden;
        }

        /* ===== GRID ===== */
        .ldms-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          width: 100%;
        }

        /* ===== CARD ===== */
        .ldms-chart-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 22px 24px;
          border: 1px solid #f3d6d6;
          box-shadow: 0 4px 18px rgba(139, 0, 0, 0.04);
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        /* Hover polish */
        .ldms-chart-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 32px rgba(139, 0, 0, 0.1);
        }

        /* subtle red bottom accent animation */
        .ldms-chart-card::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 3px;
          background: #c62828;
          transition: width 0.4s ease;
        }

        .ldms-chart-card:hover::after {
          width: 100%;
        }

        /* ===== HEADINGS ===== */
        .ldms-chart-card h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 700;
          color: #8b0000;
          text-align: center;
          letter-spacing: 0.5px;
        }

        /* ===== CHART HEADER ===== */
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* ===== SELECT ===== */
        select {
          padding: 6px 10px;
          font-size: 13px;
          border-radius: 8px;
          border: 1px solid #e5bcbc;
          color: #8b1d1d;
          background: #ffffff;
          transition: all 0.3s ease;
        }

        select:hover {
          border-color: #c62828;
        }

        select:focus {
          outline: none;
          border-color: #c62828;
          box-shadow: 0 0 0 2px rgba(198, 40, 40, 0.15);
        }

        /* ===== TABLE ===== */
        .table-wrap {
          max-height: 420px;
          overflow-y: auto;
          border-radius: 10px;
          border: 1px solid #f1d0d0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          background: #ffffff;
        }

        /* HEADER */
        .table-wrap thead th {
          background: #c62828;
          color: #ffffff;
          padding: 12px 8px;
          font-weight: 700;
          text-align: center;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        /* ROWS */
        tbody td {
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
          text-align: center;
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: #fff5f5;
        }

        /* FOOTER */
        tfoot {
          position: sticky;
          bottom: 0;
          background: #fdecea;
          font-weight: 700;
          text-align: center;
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

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .ldms-bottom-grid {
            grid-template-columns: 1fr;
          }

          .pie-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .pie-right {
            width: 100%;
          }          
        }

        @media (max-width: 768px) {
          .ldms-chart-card {
            padding: 18px;
          }

          .ldms-chart-card h4 {
            font-size: 15px;
          }

          table {
            font-size: 12px;
          }

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

        @media (max-width: 480px) {
          .ldms-support-analytics {
            gap: 22px;
          }

          .ldms-chart-card {
            padding: 14px;
          }

          .ldms-chart-card h4 {
            font-size: 14px;
          }

          .table-wrap {
            max-height: 320px;
          }

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
