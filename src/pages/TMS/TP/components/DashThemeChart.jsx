// src/pages/TMS/TP/components/DashThemeChart.jsx
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAnimate, useAnimateBar } from "@mui/x-charts/hooks";
import { interpolateObject } from "@mui/x-charts-vendor/d3-interpolate";

/* ====================================================================
    CUSTOM RENDERERS (Matches Reference EXACTLY)
    ==================================================================== */

// Custom animated label that sits at the base (left side) of the horizontal bar
const Text = styled("text")(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: "none",
  fill: "#ffffff", // White text inside the dark blue bar
  transition: "opacity 0.2s ease-in, fill 0.2s ease-in",
  textAnchor: "start",
  dominantBaseline: "central",
  pointerEvents: "none",
  fontWeight: 600,
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 12,
}));

function BarLabelAtBase(props) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  // We ONLY want to label the foreground (Achieved/Created) layer
  if (seriesId !== "achieved" || !otherProps.children) return null;

  const animatedProps = useAnimate(
    { x: xOrigin + 8, y: y + height / 2 },
    {
      initialProps: { x: xOrigin, y: y + height / 2 },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element, p) => {
        element.setAttribute("x", p.x.toString());
        element.setAttribute("y", p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return <Text {...otherProps} {...animatedProps} />;
}

// Custom Bar shape to add rounded corners and hover effects
export function CustomBarElement(props) {
  const {
    ownerState,
    skipAnimation,
    id,
    dataIndex,
    xOrigin,
    yOrigin,
    seriesId,
    ...other
  } = props;

  const animatedProps = useAnimateBar(props);
  // Apply a distinct stripe pattern to the remaining targets background
  const fill =
    seriesId === "remaining" ? "url(#remaining-stripe-pattern)" : props.color;

  return (
    <rect
      {...other}
      {...animatedProps}
      fill={fill}
      rx={4} // Gentle rounding
      style={{
        filter: ownerState.isHighlighted ? "brightness(1.1)" : "none",
        opacity: ownerState.isFaded ? 0.3 : 1,
        transition: "opacity 0.2s ease, filter 0.2s ease",
        cursor: "pointer",
      }}
    />
  );
}

/* ====================================================================
   MAIN COMPONENT
   ==================================================================== */

export default function DashThemeChart({ data, batchesFilter }) {
  // Determine dynamic labeling based on the batchesFilter prop
  const isCreated = batchesFilter === "created";
  const achievedLabel = isCreated ? "Created Batches" : "Achieved Batches";

  // Process data for the overlapping illusion
  // By stacking 'achieved' and 'remaining', the total bar visually represents 'assigned'
  const chartData =
    data && data.length > 0
      ? data.map((d) => ({
          ...d,
          // Calculate the empty space left in the target
          remaining_targets: Math.max(
            0,
            d.assigned_targets - d.achieved_batches,
          ),
        }))
      : [];

  if (!chartData.length) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          border: "1px dashed #cbd5e1",
          borderRadius: "16px",
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
          No theme metrics available for this selection.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="theme-chart-container">
      {/* CHART SECTION */}
      <Box
        sx={{
          width: "100%",
          background: "#ffffff",
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#002073",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Theme Metrics Overview
          </Typography>
          <Box sx={{ display: "flex", gap: "3px" }}>
            <Box
              sx={{
                width: 4,
                height: 4,
                bgcolor: "#94a3b8",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                width: 4,
                height: 4,
                bgcolor: "#94a3b8",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                width: 4,
                height: 4,
                bgcolor: "#94a3b8",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Box>

        <BarChart
          height={350}
          dataset={chartData}
          layout="horizontal"
          margin={{ top: 40, right: 30, bottom: 20 }}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "theme_name",
              width: "auto",
              tickLabelStyle: {
                fill: "#0f172a",
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 13,
              },
            },
          ]}
          xAxis={[
            {
              tickLabelStyle: {
                fill: "#64748b",
                fontFamily: "Inter",
                fontSize: 12,
              },
            },
          ]}
          series={[
            {
              id: "achieved",
              dataKey: "achieved_batches",
              stack: "total",
              label: achievedLabel,
              color: "#002073", // TMS Dark Blue foreground
              barLabel: (v) => `${v.value}`, // Value shown inside the base of the bar
            },
            {
              id: "remaining",
              dataKey: "remaining_targets",
              stack: "total",
              label: "Unachieved Targets",
              color: "#0092E0", // Light slate background
            },
          ]}
          slots={{
            bar: CustomBarElement,
            barLabel: BarLabelAtBase, // Injects the custom internal label
          }}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "right" },
              labelStyle: {
                fontFamily: "Inter",
                fontWeight: 500,
                fill: "#475569",
                fontSize: 13,
              },
              itemMarkWidth: 10,
              itemMarkHeight: 10,
            },
            tooltip: { trigger: "item" },
          }}
          sx={{
            "& .MuiChartsAxis-line": { stroke: "#cbd5e1" },
            "& .MuiChartsAxis-tick": { stroke: "#cbd5e1" },
          }}
        >
          {/* Subtle diagonal stripe pattern for the background 'Remaining' layer */}
          <defs>
            <pattern
              id="remaining-stripe-pattern"
              width="6"
              height="6"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill="#0092E0" />
            </pattern>
          </defs>
        </BarChart>
      </Box>

      {/* TABLE SECTION */}
      <div className="tms-theme-table-wrapper">
        <table className="tms-theme-table">
          <thead>
            <tr>
              <th>Theme Name</th>
              <th className="num-col">Assigned Targets</th>
              {/* Dynamic Header based on Filter */}
              <th className="num-col">{achievedLabel}</th>
              <th className="num-col">Completion</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => {
              const completionRate =
                row.assigned_targets > 0
                  ? Math.round(
                      (row.achieved_batches / row.assigned_targets) * 100,
                    )
                  : 0;

              return (
                <tr key={i}>
                  <td className="theme-name-cell">
                    <span className="theme-dot"></span>
                    {row.theme_name}
                  </td>
                  <td className="num-col font-medium">
                    {row.assigned_targets.toLocaleString()}
                  </td>
                  <td className="num-col font-medium text-blue">
                    {row.achieved_batches.toLocaleString()}
                  </td>
                  <td className="num-col">
                    <div className="progress-cell">
                      <span className="progress-text">{completionRate}%</span>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(completionRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {/* Totals Row */}
            <tr className="totals-row">
              <td>
                <strong>Total Overview</strong>
              </td>
              <td className="num-col font-bold">
                {chartData
                  .reduce((acc, curr) => acc + curr.assigned_targets, 0)
                  .toLocaleString()}
              </td>
              <td className="num-col font-bold text-blue">
                {chartData
                  .reduce((acc, curr) => acc + curr.achieved_batches, 0)
                  .toLocaleString()}
              </td>
              <td className="num-col">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        .theme-chart-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .tms-theme-table-wrapper {
          width: 100%;
          background: #ffffff;
          padding: 14px 20px;
          overflow: hidden;
          border-radius: 12px;
        }

        .tms-theme-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #002073;
          text-align: left;
        }

        .tms-theme-table th {
          background-color: #002073; /* TMS Primary Blue */
          color: #ffffff;
          font-weight: 600;
          font-size: 13px;
          padding: 14px 20px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .tms-theme-table td {
          padding: 14px 20px;
          font-size: 14px;
          color: #334155;
          vertical-align: middle;
        }

        .tms-theme-table tbody tr {
          transition: background-color 0.2s ease;
        }

        .tms-theme-table tbody tr:hover:not(.totals-row) {
          background-color: #eff6ff;
        }

        .theme-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: #0f172a !important;
        }

        .theme-dot {
          width: 8px;
          height: 8px;
          background-color: #002073;
          border-radius: 50%;
          display: inline-block;
        }

        .num-col {
          text-align: right;
        }

        .font-medium {
          font-weight: 500;
        }
        
        .font-bold {
          font-weight: 700;
        }

        .text-blue {
          color: #002073 !important;
        }

        .progress-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .progress-text {
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          min-width: 35px;
        }

        .progress-bar-bg {
          width: 80px;
          height: 6px;
          background-color: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: #22c55e; /* Green for completion */
          border-radius: 999px;
          transition: width 0.5s ease-out;
        }

        .totals-row {
          background-color: #f8fafc;
        }

        .totals-row td {
          color: #0f172a;
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
