// src/pages/StateLoginPortal/Dashboards/KpiCards.jsx
"use client";

import React from "react";
import { PolarArea } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const KPICard = ({
  title,
  stats = [],
  chartColor = ["#3b82f6", "#60a5fa", "#93c5fd"],
}) => {
  const data = {
    labels: stats.map((item) => item.label),
    datasets: [
      {
        data: stats.map((item) => item.value),
        backgroundColor: chartColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <div className="kpi-card">
        <h3 className="card-title">{title}</h3>

        <div className="chart-wrapper">
          <PolarArea data={data} options={options} />
        </div>

        <div className="kpi-details">
          {stats.map((item, index) => (
            <div className="metric-row" key={index}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .kpi-card{
          background:#fff;
          border-radius:18px;
          padding:24px;
          box-shadow:0 6px 18px rgba(0,0,0,0.08);
          border:1px solid #e5e7eb;
          height:100%;
        }

        .card-title{
          font-size:22px;
          font-weight:700;
          margin-bottom:16px;
          color:#0f172a;
        }

        .chart-wrapper{
          height:280px;
          margin-bottom:20px;
        }

        .metric-row{
          display:flex;
          justify-content:space-between;
          padding:12px 0;
          border-bottom:1px dashed #cbd5e1;
        }

        .metric-row:last-child{
          border-bottom:none;
        }

        .metric-row span{
          color:#475569;
        }

        .metric-row strong{
          color:#2563eb;
          font-size:20px;
        }
      `}</style>
    </>
  );
};

export default KPICard;
