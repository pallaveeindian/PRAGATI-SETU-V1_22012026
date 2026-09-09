// src\pages\PlanningDeptUpdate\components\PDUBarChart.jsx
import * as React from "react";
import { useTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAnimate, useAnimateBar, useDrawingArea } from "@mui/x-charts/hooks";
import { PiecewiseColorLegend } from "@mui/x-charts/ChartsLegend";
import { interpolateObject } from "@mui/x-charts-vendor/d3-interpolate";
import Box from "@mui/material/Box";

/**
 * PDUBarChart - A highly visual, horizontal bar chart with shaded backgrounds
 * and piecewise color mapping (Exact match to ShinyBarChartHorizontal).
 *
 * @param {string} title - The title of the chart
 * @param {Array} dataset - Array of objects containing the data
 * @param {string} yAxisKey - The object key for the Y-axis labels (e.g., 'country' or 'blockName')
 * @param {string} seriesKey - The object key for the values (e.g., 'turnout' or 'percentage')
 * @param {Array<number>} thresholds - Where the colors change (e.g., [50, 85])
 * @param {Array<string>} colors - The colors for the thresholds
 * @param {Array<string>} legendLabels - Labels for the legend
 */
export default function PDUBarChart({
  title = "European countries with lowest & highest voter turnout",
  dataset = defaultDataset,
  yAxisKey = "country",
  seriesKey = "turnout",
  height = 350,
  thresholds = [50, 85],
  colors = ["#d32f2f", "#78909c", "#1976d2"],
  legendLabels = ["lowest turnout", "average", "highest turnout"],
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <Typography sx={{ marginBottom: 2, fontWeight: 500, color: "#1f2937" }}>
          {title}
        </Typography>
      )}
      <BarChart
        height={height}
        dataset={dataset}
        series={[
          {
            id: "seriesData",
            dataKey: seriesKey,
            stack: "stackData",
            valueFormatter: (value) => `${value}`,
            barLabel: (v) => `${v.value}`,
          },
        ]}
        layout="horizontal"
        xAxis={[
          {
            id: "color",
            min: 0,
            max: 100,
            colorMap: {
              type: "piecewise",
              thresholds: thresholds,
              colors: colors,
            },
            valueFormatter: (value) => `${value}%`,
          },
        ]}
        yAxis={[
          {
            scaleType: "band",
            dataKey: yAxisKey,
            width: 140,
          },
        ]}
        slots={{
          legend: PiecewiseColorLegend,
          barLabel: BarLabelAtBase,
          bar: BarShadedBackground,
        }}
        slotProps={{
          legend: {
            axisDirection: "x",
            markType: "square",
            labelPosition: "inline-start",
            labelFormatter: ({ index }) => {
              return legendLabels[index] || "";
            },
          },
        }}
      />
    </Box>
  );
}

export function BarShadedBackground(props) {
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
  const theme = useTheme();

  const animatedProps = useAnimateBar(props);
  const { width } = useDrawingArea();

  return (
    <React.Fragment>
      <rect
        {...other}
        fill={(theme.vars || theme).palette.text.primary}
        opacity={theme.palette.mode === "dark" ? 0.05 : 0.1}
        x={other.x}
        width={width}
      />
      <rect
        {...other}
        filter={ownerState.isHighlighted ? "brightness(120%)" : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        data-highlighted={ownerState.isHighlighted || undefined}
        data-faded={ownerState.isFaded || undefined}
        {...animatedProps}
      />
    </React.Fragment>
  );
}

const Text = styled("text")(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: "none",
  fill: (theme.vars || theme).palette.common.white,
  transition: "opacity 0.2s ease-in, fill 0.2s ease-in",
  textAnchor: "start",
  dominantBaseline: "central",
  pointerEvents: "none",
  fontWeight: 600,
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

const defaultDataset = [
  { country: "UP", turnout: 33.2 },
  { country: "Delhi", turnout: 33.4 },
];
