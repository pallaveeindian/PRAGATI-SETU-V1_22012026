import * as React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

const marksMapping = {
  true: true,
  false: false,
  start: "start",
  end: "end",
  "({index})=>index%2===0": ({ index }) => index % 2 === 0,
};

const marksOptions = [
  "true",
  "false",
  "start",
  "end",
  "({index})=>index%2===0",
];
const shapes = [
  "circle",
  "square",
  "diamond",
  "cross",
  "star",
  "triangle",
  "wye",
];

/**
 * PDUWaveChart - A natural curve line chart to visualize trends across districts.
 * Includes interactive controls for data point shapes and marks.
 *
 * @param {Array<Object>} dataset - The array of district data objects
 * @param {string} title - Optional title for the chart section
 */
export default function PDUWaveChart({
  dataset = [],
  title = "District Trend Analysis (SHGs vs Members)",
}) {
  // Default to 'false' so the natural wave looks smooth out of the box
  const [marks, setMarks] = React.useState("false");
  const [shape, setShape] = React.useState("circle");

  // We sort the dataset alphabetically or by a specific metric so the wave flows logically.
  // We'll sort by SHG count descending to create a visually pleasing downward wave.
  const sortedDataset = React.useMemo(() => {
    if (!dataset || dataset.length === 0) return [];
    return [...dataset].sort((a, b) => b.shgCount - a.shgCount);
  }, [dataset]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Title */}
      {title && (
        <Typography
          sx={{
            marginBottom: 2,
            fontWeight: 600,
            color: "#1f2937",
            fontSize: "1.125rem",
          }}
        >
          {title}
        </Typography>
      )}

      {/* Interactive Controls matching your reference */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ marginBottom: 2 }}
      >
        <TextField
          select
          label="Show Marks"
          value={marks}
          onChange={(event) => setMarks(event.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          {marksOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Mark Shape"
          value={shape}
          onChange={(event) => setShape(event.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
          disabled={marks === "false"} // Disable if marks are turned off
        >
          {shapes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* The Wave Chart */}
      <Box sx={{ flexGrow: 1, minHeight: 300, width: "100%" }}>
        <LineChart
          dataset={sortedDataset}
          series={[
            {
              dataKey: "shgCount",
              label: "Total SHGs",
              curve: "natural", // This creates the "Wave"
              showMark: marksMapping[marks],
              shape,
              color: "#8b5cf6", // Theme Purple
            },
            {
              dataKey: "potentialDidiCount",
              label: "Potential Didis",
              curve: "natural",
              showMark: marksMapping[marks],
              shape,
              color: "#10b981", // Theme Green
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "districtName",
              // Adjusting the label style since 75 districts will overlap if horizontal
              tickLabelStyle: {
                angle: -45,
                textAnchor: "end",
                fontSize: 10,
              },
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          margin={{ top: 20, bottom: 80, left: 60, right: 20 }} // Extra bottom margin for angled labels
        />
      </Box>
    </Box>
  );
}
