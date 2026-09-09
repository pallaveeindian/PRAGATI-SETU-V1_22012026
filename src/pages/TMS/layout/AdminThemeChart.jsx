import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAnimateBar } from "@mui/x-charts/hooks";
import { autocompleteClasses } from "@mui/material/Autocomplete";

export function CustomBarElement(props) {
  // SURGICAL FIX: Destructure internal MUI props so they aren't spread to the DOM element
  const {
    ownerState,
    seriesId,
    skipAnimation,
    dataIndex,
    xOrigin,
    yOrigin,
    layout,
    ...other
  } = props;

  const animatedProps = useAnimateBar(props);
  const fill =
    seriesId === "remaining" ? "url(#admin-stripe-pattern)" : props.color;

  return (
    <rect
      {...other}
      {...animatedProps}
      fill={fill}
      rx={4}
      style={{
        filter: ownerState?.isHighlighted ? "brightness(1.1)" : "none",
        opacity: ownerState?.isFaded ? 0.3 : 1,
        transition: "opacity 0.2s ease",
      }}
    />
  );
}

export default function AdminThemeChart({ data }) {
  const chartData =
    data && data.length > 0
      ? data.map((d) => ({
          ...d,
          remaining_targets: Math.max(0, d.target - d.achieved),
        }))
      : [];

  if (!chartData.length) {
    return (
      <div className="muted-box">
        No thematic performance metrics available.
      </div>
    );
  }

  return (
    <div className="admin-theme-chart-wrapper">
      <Box
        sx={{
          width: "100%",
          background: "#ffffff",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "23px",
            fontWeight: 800,
            color: "#163A63",
            mb: 3,
            justifyContent: "center",
            textAlign: "center",
            borderBottom: "2px solid #dbe5f0",
            padding: "13px 10px",
            letterSpacing: "0.4px",
            lineHeight: 1.3,
            textShadow: `
              0 1px 2px rgba(255, 255, 255, 0.95),
              0 2px 5px rgba(30, 58, 138, 0.12)
            `,
          }}
        >
          Theme wise Targets vs Achievements
        </Typography>

        <BarChart
          height={350}
          dataset={chartData}
          layout="horizontal"
          margin={{ top: 20, right: 50, bottom: 20, left: 20 }}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "theme_name",
              width: 100,
              tickLabelStyle: {
                fill: "#334155",
                fontWeight: 600,
                fontSize: 12,
              },
            },
          ]}
          series={[
            {
              id: "achieved",
              dataKey: "achieved",
              stack: "total",
              label: "Trained Cadre",
              color: "#2563eb",
            },
            {
              id: "remaining",
              dataKey: "remaining_targets",
              stack: "total",
              label: "Remaining Cadre",
              color: "#cbd5e1",
            },
          ]}
          slots={{ bar: CustomBarElement }}
          slotProps={{
            legend: { position: { vertical: "top", horizontal: "right" } },
          }}
        >
          <defs>
            <pattern
              id="admin-stripe-pattern"
              width="6"
              height="6"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill="#cbd5e1" />
            </pattern>
          </defs>
        </BarChart>
      </Box>

      {/* TABLE */}
      <div className="admin-theme-table-wrapper">
        <table className="admin-theme-table">
          <thead>
            <tr>
              <th>Theme Name</th>
              <th className="num-col">Assigned Target</th>
              <th className="num-col">Cadre Onboarded</th>
              <th className="num-col">Cadre Enrolled in Batches</th>
              <th className="num-col">Trained Cadre</th>
              <th className="num-col">Completion % (Onboarded/Target)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
              <tr key={i}>
                <td className="font-bold theme-label">
                  <span className="dot"></span> {row.theme_name}
                </td>
                <td className="num-col-val">{row.target.toLocaleString()}</td>
                <td
                  className="num-col-val font-bold"
                  style={{ color: "#2563eb" }}
                >
                  {row.onboarded.toLocaleString()}
                </td>
                <td
                  className="num-col-val font-bold"
                  style={{ color: "#2563eb" }}
                >
                  {row.enrolled.toLocaleString()}
                </td>
                <td
                  className="num-col-val font-bold"
                  style={{ color: "#2563eb" }}
                >
                  {row.achieved.toLocaleString()}
                </td>
                <td className="num-col-val">
                  <div className="progress-cell">
                    <span className="p-text">{row.percentage}%</span>
                    <div className="p-bar-bg">
                      <div
                        className="p-bar-fill"
                        style={{ width: `${Math.min(row.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .admin-theme-chart-wrapper { width: 100%; display: flex; flex-direction: column; }
        .muted-box { padding: 40px; text-align: center; color: #64748b; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; }
        .admin-theme-table-wrapper { background: #fff; border-radius: 12px; border: 2px solid #e2e8f0; overflow: hidden; }
        .admin-theme-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
        .admin-theme-table th { background: #f1f5f9; color: #475569; padding: 14px; font-weight: 700; text-transform: uppercase; font-size: 12px; }
        .admin-theme-table td { padding: 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
        .admin-theme-table tr:hover { background: #f8fafc; }
        .theme-label { display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; background: #2563eb; border-radius: 50%; }
        .num-col { text-align: right; }
        .num-col-val { text-align: center; }
        .font-bold { font-weight: 700; }
        .progress-cell { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
        .p-text { font-weight: 600; color: #475569; font-size: 13px; min-width: 45px; }
        .p-bar-bg { width: 80px; height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
        .p-bar-fill { height: 100%; background: #22c55e; border-radius: 999px; }
      `}</style>
    </div>
  );
}
