// src/pages/StateLoginPortal/Dashboards/KpiCards.jsx
"use client";

import React, { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  const data = {
    labels: stats.map((item) => item.label),

    datasets: [
      {
        data: stats.map((item) => item.value),

        backgroundColor: stats.map(
          (_, index) => chartColor[index % chartColor.length],
        ),

        borderColor: "rgba(255,255,255,0.95)",

        borderWidth: 2,

        hoverBorderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 1400,

      easing: "easeOutQuart",

      animateRotate: true,

      animateScale: true,
    },

    interaction: {
      intersect: false,
      mode: "nearest",
    },

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,

          pointStyle: "circle",

          padding: 18,

          color: "#475569",

          font: {
            size: 12,
            weight: "600",
          },
        },
      },

      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.94)",

        titleColor: "#ffffff",

        bodyColor: "#e2e8f0",

        borderColor: "rgba(255,255,255,0.12)",

        borderWidth: 1,

        padding: 12,

        cornerRadius: 10,

        displayColors: true,

        titleFont: {
          size: 13,
          weight: "700",
        },

        bodyFont: {
          size: 12,
          weight: "500",
        },

        callbacks: {
          label: function (context) {
            return ` ${context.label}: ${context.raw}`;
          },
        },
      },
    },

    scales: {
      r: {
        beginAtZero: true,

        ticks: {
          display: false,
        },

        grid: {
          color: "rgba(148,163,184,0.14)",

          circular: true,
        },

        angleLines: {
          color: "rgba(148,163,184,0.12)",
        },

        pointLabels: {
          display: false,
        },

        suggestedMin: 0,
      },
    },

    elements: {
      arc: {
        borderRadius: 5,
      },
    },
  };

  return (
    <>
      <div className={`kpi-card ${mounted ? "kpi-mounted" : ""}`}>
        {/* Animated border */}
        <div className="card-border-animation"></div>

        {/* Decorative glow */}
        <div className="card-glow"></div>

        {/* Top decorative line */}
        <div className="top-accent"></div>

        {/* Header */}
        <div className="card-header">
          <div className="title-wrapper">
            <div className="title-icon">
              <span></span>
            </div>

            <div>
              <h3 className="card-title">{title}</h3>

              <div className="title-subtitle">Performance Overview</div>
            </div>
          </div>

          <div className="card-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-section">
          <div className="chart-glow"></div>

          <div className="chart-wrapper">
            {stats.length > 0 ? (
              <PolarArea data={data} options={options} />
            ) : (
              <div className="empty-chart">
                <div className="empty-chart-icon">◌</div>

                <span>No data available</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider">
          <span></span>
          <div className="divider-dot"></div>
          <span></span>
        </div>

        {/* Metrics */}
        <div className="kpi-details">
          {stats.length > 0 ? (
            stats.map((item, index) => (
              <div
                className="metric-row"
                key={index}
                style={{
                  "--row-delay": `${0.12 + index * 0.08}s`,
                }}
              >
                <div className="metric-label-wrapper">
                  <span
                    className="metric-dot"
                    style={{
                      backgroundColor: chartColor[index % chartColor.length],
                    }}
                  ></span>

                  <span className="metric-label">{item.label}</span>
                </div>

                <div className="metric-value-wrapper">
                  <strong className="metric-value">{item.value}</strong>

                  <span className="metric-arrow">↗</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-metrics">No metrics available</div>
          )}
        </div>

        {/* Bottom status */}
        <div className="card-footer">
          <div className="live-indicator">
            <span className="live-dot"></span>
            Live Data
          </div>

          <span className="footer-label">Updated automatically</span>
        </div>
      </div>

      <style>{`

        /* =====================================================
           BASE
        ===================================================== */

        .kpi-card {
          position: relative;

          width: 100%;
          height: 100%;

          min-height: 520px;

          padding: 24px;

          overflow: hidden;

          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.98),
              rgba(248,250,252,0.96)
            );

          border: 1px solid rgba(226,232,240,0.85);

          box-shadow:
            0 12px 30px rgba(15,23,42,0.07),
            0 2px 8px rgba(15,23,42,0.04);

          isolation: isolate;

          opacity: 0;

          transform:
            translateY(35px)
            scale(0.96);

          transition:
            opacity 0.7s ease,
            transform 0.8s cubic-bezier(
              0.16,
              1,
              0.3,
              1
            ),
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }


        /* =====================================================
           MOUNTING ANIMATION
        ===================================================== */

        .kpi-card.kpi-mounted {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          animation:
            cardBreathing 6s ease-in-out
            1s infinite;
        }


        @keyframes cardBreathing {

          0%,
          100% {
            box-shadow:
              0 12px 30px rgba(15,23,42,0.07),
              0 2px 8px rgba(15,23,42,0.04);
          }

          50% {
            box-shadow:
              0 18px 42px rgba(15,23,42,0.10),
              0 5px 15px rgba(15,23,42,0.05);
          }
        }


        /* =====================================================
           HOVER
        ===================================================== */

        .kpi-card:hover {
          transform:
            translateY(-7px)
            scale(1.005);

          border-color:
            rgba(148,163,184,0.5);

          box-shadow:
            0 25px 55px rgba(15,23,42,0.12),
            0 8px 20px rgba(15,23,42,0.06);
        }


        /* =====================================================
           ANIMATED BORDER
        ===================================================== */

        .card-border-animation {
          position: absolute;

          inset: -2px;

          z-index: -1;

          border-radius: 26px;

          background:
            linear-gradient(
              120deg,
              transparent,
              rgba(59,130,246,0.20),
              transparent,
              rgba(99,102,241,0.15),
              transparent
            );

          background-size: 300% 300%;

          opacity: 0;

          animation:
            borderFlow 7s linear infinite;

          transition:
            opacity 0.4s ease;
        }


        .kpi-card:hover
        .card-border-animation {
          opacity: 1;
        }


        @keyframes borderFlow {

          0% {
            background-position:
              0% 50%;
          }

          50% {
            background-position:
              100% 50%;
          }

          100% {
            background-position:
              0% 50%;
          }
        }


        /* =====================================================
           GLOW
        ===================================================== */

        .card-glow {
          position: absolute;

          width: 220px;
          height: 220px;

          top: -120px;
          right: -100px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(59,130,246,0.12),
              transparent 70%
            );

          filter: blur(8px);

          pointer-events: none;

          animation:
            glowFloat 7s ease-in-out infinite;
        }


        @keyframes glowFloat {

          0%,
          100% {
            transform:
              translate(0,0)
              scale(1);
          }

          50% {
            transform:
              translate(-20px,25px)
              scale(1.15);
          }
        }


        /* =====================================================
           TOP ACCENT
        ===================================================== */

        .top-accent {
          position: absolute;

          top: 0;
          left: 28px;
          right: 28px;

          height: 3px;

          border-radius:
            0 0 10px 10px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #3b82f6,
              #60a5fa,
              transparent
            );

          background-size: 200% 100%;

          animation:
            accentMove 4s linear infinite;
        }


        @keyframes accentMove {

          0% {
            background-position:
              100% 50%;
          }

          100% {
            background-position:
              -100% 50%;
          }
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .card-header {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 8px;
        }


        .title-wrapper {
          display: flex;

          align-items: center;

          gap: 12px;

          min-width: 0;
        }


        .title-icon {
          position: relative;

          width: 40px;
          height: 40px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #dbeafe
            );

          border:
            1px solid #dbeafe;

          overflow: hidden;
        }


        .title-icon::before {
          content: "";

          position: absolute;

          width: 18px;
          height: 18px;

          border-radius: 50%;

          border:
            3px solid #3b82f6;

          border-right-color:
            transparent;

          animation:
            iconRotate 3s linear infinite;
        }


        .title-icon span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #3b82f6;

          box-shadow:
            0 0 8px
            rgba(59,130,246,0.45);
        }


        @keyframes iconRotate {

          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }


        .card-title {
          margin: 0;

          color: #0f172a;

          font-size: 20px;

          font-weight: 800;

          line-height: 1.2;

          letter-spacing:
            -0.025em;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        .title-subtitle {
          margin-top: 4px;

          color: #94a3b8;

          font-size: 10px;

          font-weight: 600;

          letter-spacing:
            0.08em;

          text-transform:
            uppercase;
        }


        /* =====================================================
           MENU DOTS
        ===================================================== */

        .card-menu {
          display: flex;

          gap: 3px;

          padding: 7px;

          border-radius: 8px;

          transition:
            background 0.25s ease;
        }


        .card-menu:hover {
          background: #f1f5f9;
        }


        .card-menu span {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #94a3b8;

          transition:
            transform 0.25s ease;
        }


        .card-menu:hover span {
          transform:
            translateY(-2px);
        }


        /* =====================================================
           CHART
        ===================================================== */

        .chart-section {
          position: relative;

          margin-top: 4px;

          border-radius: 18px;

          background:
            radial-gradient(
              circle at center,
              rgba(239,246,255,0.8),
              rgba(248,250,252,0.2)
            );
        }


        .chart-glow {
          position: absolute;

          width: 150px;
          height: 150px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          background:
            rgba(59,130,246,0.08);

          filter: blur(30px);

          pointer-events: none;
        }


        .chart-wrapper {
          position: relative;

          z-index: 1;

          height: 280px;

          margin-bottom: 8px;

          padding: 8px;

          animation:
            chartEntrance 1s
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            0.15s both;
        }


        @keyframes chartEntrance {

          from {
            opacity: 0;

            transform:
              scale(0.8)
              translateY(15px);
          }

          to {
            opacity: 1;

            transform:
              scale(1)
              translateY(0);
          }
        }


        /* =====================================================
           EMPTY CHART
        ===================================================== */

        .empty-chart {
          width: 100%;
          height: 100%;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 8px;

          color: #94a3b8;

          font-size: 12px;
        }


        .empty-chart-icon {
          width: 55px;
          height: 55px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #f8fafc;

          color: #cbd5e1;

          font-size: 30px;
        }


        /* =====================================================
           DIVIDER
        ===================================================== */

        .section-divider {
          display: flex;

          align-items: center;

          gap: 8px;

          margin:
            5px 0 5px;
        }


        .section-divider span {
          flex: 1;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #e2e8f0
            );
        }


        .section-divider span:last-child {
          background:
            linear-gradient(
              90deg,
              #e2e8f0,
              transparent
            );
        }


        .divider-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #3b82f6;

          box-shadow:
            0 0 7px
            rgba(59,130,246,0.35);
        }


        /* =====================================================
           KPI DETAILS
        ===================================================== */

        .kpi-details {
          position: relative;

          z-index: 2;

          margin-top: 2px;
        }


        .metric-row {
          display: flex;

          align-items: center;

          justify-content: space-between;

          min-height: 48px;

          padding: 9px 10px;

          border-bottom:
            1px dashed #e2e8f0;

          border-radius: 10px;

          opacity: 0;

          transform:
            translateX(-15px);

          animation:
            metricEntrance
            0.55s
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            var(--row-delay)
            forwards;

          transition:
            background 0.25s ease,
            transform 0.25s ease,
            padding 0.25s ease;
        }


        .metric-row:last-child {
          border-bottom: none;
        }


        .metric-row:hover {
          background:
            rgba(248,250,252,0.9);

          padding-left: 14px;

          transform:
            translateX(3px);
        }


        @keyframes metricEntrance {

          from {
            opacity: 0;

            transform:
              translateX(-15px);
          }

          to {
            opacity: 1;

            transform:
              translateX(0);
          }
        }


        .metric-label-wrapper {
          display: flex;

          align-items: center;

          gap: 9px;

          min-width: 0;
        }


        .metric-dot {
          width: 8px;
          height: 8px;

          flex-shrink: 0;

          border-radius: 50%;

          box-shadow:
            0 0 7px
            rgba(59,130,246,0.2);
        }


        .metric-label {
          color: #475569;

          font-size: 13px;

          font-weight: 600;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        .metric-value-wrapper {
          display: flex;

          align-items: center;

          gap: 6px;

          flex-shrink: 0;
        }


        .metric-value {
          color: #2563eb;

          font-size: 19px;

          font-weight: 800;

          letter-spacing:
            -0.02em;
        }


        .metric-arrow {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 18px;
          height: 18px;

          border-radius: 50%;

          background: #eff6ff;

          color: #3b82f6;

          font-size: 10px;

          opacity: 0;

          transform:
            translateX(-4px);

          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }


        .metric-row:hover
        .metric-arrow {
          opacity: 1;

          transform:
            translateX(0);
        }


        .no-metrics {
          padding: 20px;

          text-align: center;

          color: #94a3b8;

          font-size: 12px;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .card-footer {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-top: 13px;

          padding-top: 13px;

          border-top:
            1px solid #f1f5f9;
        }


        .live-indicator {
          display: flex;

          align-items: center;

          gap: 6px;

          color: #64748b;

          font-size: 10px;

          font-weight: 700;

          text-transform:
            uppercase;

          letter-spacing:
            0.06em;
        }


        .live-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px
            rgba(34,197,94,0.10);

          animation:
            livePulse 2s
            ease-in-out
            infinite;
        }


        @keyframes livePulse {

          0%,
          100% {
            transform:
              scale(1);

            opacity: 1;
          }

          50% {
            transform:
              scale(1.35);

            opacity: 0.65;
          }
        }


        .footer-label {
          color: #cbd5e1;

          font-size: 10px;

          font-weight: 500;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 768px) {

          .kpi-card {
            min-height: 480px;

            padding: 20px;

            border-radius: 20px;
          }


          .card-title {
            font-size: 18px;
          }


          .title-icon {
            width: 36px;
            height: 36px;

            border-radius: 10px;
          }


          .chart-wrapper {
            height: 250px;
          }


          .metric-value {
            font-size: 17px;
          }
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .kpi-card {
            min-height: auto;

            padding: 17px;

            border-radius: 18px;
          }


          .card-header {
            margin-bottom: 5px;
          }


          .card-title {
            font-size: 16px;
          }


          .title-subtitle {
            font-size: 8px;
          }


          .title-icon {
            width: 34px;
            height: 34px;
          }


          .card-menu {
            display: none;
          }


          .chart-wrapper {
            height: 225px;

            padding: 0;
          }


          .metric-row {
            min-height: 44px;

            padding:
              8px 6px;
          }


          .metric-label {
            max-width: 170px;

            font-size: 12px;
          }


          .metric-value {
            font-size: 16px;
          }


          .metric-arrow {
            display: none;
          }


          .card-footer {
            margin-top: 10px;

            padding-top: 10px;
          }
        }


        /* =====================================================
           VERY SMALL DEVICES
        ===================================================== */

        @media (max-width: 360px) {

          .kpi-card {
            padding: 14px;
          }


          .title-icon {
            width: 30px;
            height: 30px;
          }


          .card-title {
            font-size: 15px;
          }


          .chart-wrapper {
            height: 200px;
          }


          .metric-label {
            max-width: 130px;
          }


          .footer-label {
            display: none;
          }
        }


        /* =====================================================
           REDUCED MOTION ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .kpi-card,
          .kpi-card.kpi-mounted,
          .card-border-animation,
          .card-glow,
          .top-accent,
          .title-icon::before,
          .chart-wrapper,
          .metric-row,
          .live-dot {

            animation: none !important;

            transition: none !important;
          }

          .kpi-card {
            opacity: 1;

            transform: none;
          }

          .metric-row {
            opacity: 1;

            transform: none;
          }
        }

      `}</style>
    </>
  );
};

export default KPICard;
