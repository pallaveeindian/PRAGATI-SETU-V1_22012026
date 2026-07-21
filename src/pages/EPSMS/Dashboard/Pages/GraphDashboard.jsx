import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from '../../../../api/axios.js';
import CountUp from "./CountUp.jsx";
import styled from "styled-components";

// --- Animated Card Styled Component ---
// We use $glowColor to pass dynamic non-blue colors to each card
const AnimatedCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px; /* Controls the thickness of the animated border */
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: #e2e8f0; /* Default static border color */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 14px; /* Slightly less than wrapper to fit perfectly */
    background: #ffffff;
    z-index: 1;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .content h3 {
    margin: 0 0 10px 0;
    color: #334155;
  }

  .content h1 {
    margin: 0;
  }

  /* The hidden gradient that will spin on hover */
  &::before {
    content: "";
    position: absolute;
    height: 160%;
    width: 160%;
    border-radius: inherit;
    /* Custom non-blue glowing gradient based on prop */
    background: linear-gradient(to right, transparent, ${(props) => props.$glowColor}, transparent);
    transform-origin: center;
    animation: moving 3s linear infinite paused;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    opacity: 0; 
  }

  /* Hover logic matching your snippet */
  &:hover::before {
    animation-play-state: running;
    opacity: 1;
    width: 30%; /* Creates the sweeping laser effect */
  }

  &:hover {
    transform: translateY(-8px);
    background: transparent;
    /* Glow shadow matches the card's theme color */
    box-shadow: 0 12px 24px ${(props) => props.$glowColor}40; 
  }

  @keyframes moving {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const GraphDashboard = ({ onShowMappedCrpList }) => {
  const [dashboardData, setDashboardData] = useState({
    target: 0,
    totalCrpCount: 0,
    completedCrpCount: 0,
    pendingCrpCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseNumericValue = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.reduce((sum, item) => sum + parseNumericValue(item), 0);
      }
      return parseNumericValue(value.value ?? value.count ?? value.total ?? value.number ?? value.amount ?? value.value_ ?? value.count_value);
    }
    return 0;
  };

  const normalizeRows = (payload, visited = new WeakSet()) => {
    if (Array.isArray(payload)) {
      return payload.filter((item) => item !== null && item !== undefined);
    }

    if (!payload || typeof payload !== "object") {
      return [];
    }

    if (visited.has(payload)) {
      return [];
    }
    visited.add(payload);

    const candidateArrays = [
      payload.results,
      payload.data,
      payload.items,
      payload.rows,
      payload.list,
      payload.crps,
      payload.records,
      payload.detail,
      payload.response,
      payload.payload,
      payload.result,
    ];

    for (const candidate of candidateArrays) {
      if (Array.isArray(candidate)) {
        return candidate.filter((item) => item !== null && item !== undefined);
      }
    }

    for (const value of Object.values(payload)) {
      if (value && typeof value === "object") {
        const nestedRows = normalizeRows(value, visited);
        if (nestedRows.length) {
          return nestedRows;
        }
      }
    }

    return [];
  };

  const findFieldValue = (source, fieldNames = [], visited = new WeakSet()) => {
    if (!source || typeof source !== "object") return "";
    if (visited.has(source)) return "";
    visited.add(source);

    if (Array.isArray(source)) {
      for (const item of source) {
        const nested = findFieldValue(item, fieldNames, visited);
        if (nested) return nested;
      }
      return "";
    }

    for (const field of fieldNames) {
      const value = source[field];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }

    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === "object") {
        const nested = findFieldValue(value, fieldNames, visited);
        if (nested) return nested;
      }
    }

    return "";
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await EPSAKHI_API.mappedCrpList();
      const payload = response?.data ?? response ?? {};
      const rows = normalizeRows(payload);

      let target = 0;
      let totalCrpCount = 0;
      let completedCrpCount = 0;

      rows.forEach((row) => {
        target += parseNumericValue(findFieldValue(row, ["target", "district_target_count", "target_count", "target_value"]));
        totalCrpCount += parseNumericValue(findFieldValue(row, ["total_crp_count", "created_crp_count", "crp_count", "count", "total", "value"]));
        completedCrpCount += parseNumericValue(findFieldValue(row, ["completed_crp_count", "completedCrpCount", "completed_count", "completed"]));
      });

      const pendingCrpCount = Math.max(target - totalCrpCount, 0);

      setDashboardData({
        target,
        totalCrpCount,
        completedCrpCount,
        pendingCrpCount,
      });
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(err?.response?.data?.detail || err?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const { target, totalCrpCount, pendingCrpCount } = dashboardData;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#0f172a" }}>
        Dashboard Analytics
      </h2>

      {loading && <p style={{ textAlign: "center", color: "#64748b" }}>Loading dashboard data...</p>}
      {error && <p style={{ textAlign: "center", color: "#b91c1c" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Card 1: Orange Glow */}
        <AnimatedCard $glowColor="#f97316" onClick={onShowMappedCrpList}>
          <div className="content">
            <h3>🎯 Total Target</h3>
            <h1 style={{ color: "#f97316" }}>
              <CountUp end={target} />
            </h1>
          </div>
        </AnimatedCard>

        {/* Card 2: Emerald Green Glow (Replaced Blue) */}
        <AnimatedCard $glowColor="#10b981" onClick={onShowMappedCrpList}>
          <div className="content">
            <h3>👥 Onboarded CRP Count</h3>
            <h1 style={{ color: "#10b981" }}>
              <CountUp end={totalCrpCount} />
            </h1>
          </div>
        </AnimatedCard>

        {/* Card 3: Red Glow */}
        <AnimatedCard $glowColor="#dc2626" onClick={onShowMappedCrpList}>
          <div className="content">
            <h3>⏳ Pending CRP</h3>
            <h1 style={{ color: "#dc2626" }}>
              <CountUp end={pendingCrpCount} />
            </h1>
          </div>
        </AnimatedCard>
      </div>

      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        Auto Refresh: Every 30 Seconds
      </div>
    </div>
  );
};

export default GraphDashboard;