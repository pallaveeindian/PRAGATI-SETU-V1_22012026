// src/pages/PLanningDeptUpdate/Pages/Dashboard/PDUDashboard.jsx
import React, { useMemo } from "react";
import { usePDUContext } from "../../context/PDUContext";
import PDUStatCard from "../../components/PDUStatCard";
import PDUBarChart from "../../components/PDUBarChart";
import PDULoader from "../../components/PDULoader";
import PDUWaveChart from "../../components/PDUWaveChart";
import DistrictOverview from "./DistrictOverview";
import "./styles/PDUDashboard.css";

export default function PDUDashboard() {
  const { stateOverview, isLoading, error } = usePDUContext();

  // 1. Data Transformation for Charts (Memoized for performance)
  const chartData = useMemo(() => {
    if (!stateOverview || !stateOverview.districts) return [];

    // Convert the districts object into an array
    const districtsArray = Object.values(stateOverview.districts).map(
      (dist) => ({
        districtName: dist.districtName,
        shgCount: dist.districtCumulativeCounts.shgCount || 0,
        memberCount: dist.districtCumulativeCounts.memberCount || 0,
        potentialDidiCount:
          dist.districtCumulativeCounts.potentialDidiCount || 0,
      }),
    );

    // Sort by SHG Count descending and take the Top 10 for the Bar Chart
    const sortedBySHG = [...districtsArray].sort(
      (a, b) => b.shgCount - a.shgCount,
    );
    return sortedBySHG.slice(0, 10);
  }, [stateOverview]);

  // 2. Loading & Error States
  if (isLoading) {
    return (
      <div className="pdu-dashboard-center">
        <PDULoader text="Fetching Lokos State Overview Data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdu-dashboard-center">
        <div className="pdu-error-box">
          <h2>Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stateOverview) return null;

  // 3. Extract UP State Counts
  const counts = stateOverview.stateCumulativeCounts || {};

  return (
    <div className="pdu-dashboard-container">
      {/* Dashboard Header */}
      <div className="pdu-dashboard-header">
        <div>
          <h1 className="pdu-dashboard-title">Uttar Pradesh State Overview</h1>
          <p className="pdu-dashboard-subtitle">
            Live snapshot of Lakhpati Didi & SHG data from Lokos across{" "}
            {counts.districtCount || 75} Districts.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="pdu-dashboard-kpi-grid">
        <PDUStatCard
          title="Total SHGs"
          value={counts.shgCount}
          color="#8b5cf6"
          trend={`Across ${counts.blockCount || 827} Blocks`}
          trendDirection="neutral"
        />
        <PDUStatCard
          title="Total Members"
          value={counts.memberCount}
          color="#10b981"
          trend="Household Level"
          trendDirection="up"
        />
        <PDUStatCard
          title="Potential Lakhpati Didis"
          value={counts.potentialDidiCount}
          color="#f59e0b"
          trend="Identified targets"
          trendDirection="up"
        />
        <PDUStatCard
          title="Aspirational Blocks"
          value={108}
          color="#ec4899"
          trend="Pending API Push"
          trendDirection="neutral"
        />
      </div>

      {/* Charts Row */}
      <div className="pdu-dashboard-charts-grid">
        {/* Top 10 Districts Bar Chart */}
        <div className="pdu-chart-card">
          <PDUBarChart
            title="Top 10 Districts by SHG Count"
            dataset={chartData}
            yAxisKey="districtName"
            seriesKey="shgCount"
            height={400}
            // Dynamic thresholds based on general UP data spread
            thresholds={[10000, 20000]}
            colors={["#ef4444", "#f59e0b", "#3b82f6"]} // Red, Yellow, Blue
            legendLabels={["< 10k SHGs", "10k - 20k SHGs", "> 20k SHGs"]}
          />
        </div>

        <div className="pdu-chart-card">
          <PDUWaveChart
            dataset={Object.values(stateOverview.districts).map((dist) => ({
              districtName: dist.districtName,
              shgCount: dist.districtCumulativeCounts.shgCount || 0,
              potentialDidiCount:
                dist.districtCumulativeCounts.potentialDidiCount || 0,
            }))}
          />
        </div>
      </div>

      {/* District Breakdown Table / Overview */}
      <div className="pdu-dashboard-section">
        <h2 className="pdu-section-title">District-Wise Breakdown</h2>
        <DistrictOverview districtsData={stateOverview.districts} />
      </div>
    </div>
  );
}
