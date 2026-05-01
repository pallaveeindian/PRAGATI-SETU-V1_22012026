// src/pages/LDMS/SMMU/smmu_up_map.jsx
import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { LDMS_API } from "../../../api/axios";
import UPMap from "../UP Map/UPMap";
import {
  FaUsers,
  FaLayerGroup,
  FaPeopleCarry,
  FaHome,
  FaMapMarkedAlt,
  FaTable,
} from "react-icons/fa";

/* --------------------------------------------------
   Small helper for animated numbers
-------------------------------------------------- */
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value || 0);
    if (end === 0) {
      setDisplay(0);
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * end);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

/* ==================================================
   SMMU – UP STATE MAP + ANALYTICS
================================================== */
export default function SmmuUpMap({ onDistrictSelect }) {
  const { user } = useContext(AuthContext) || {};

  /* ------------------ STATE ------------------ */
  const [districts, setDistricts] = useState([]);
  const [stateTotals, setStateTotals] = useState(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const tableContainerRef = useRef(null);
  const rowRefs = useRef({});

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* ---------------------------
     STEP 1: Load STATE TOTALS
  --------------------------- */
  useEffect(() => {
    LDMS_API.upsrlmAnalytics({ state_total: 1 })
      .then((res) => setStateTotals(res?.data?.state))
      .catch((e) => console.error("State totals failed", e));
  }, []);

  /* ---------------------------
     STEP 2: Load DISTRICT TOTALS (ONE CALL)
  --------------------------- */
  useEffect(() => {
    setLoading(true);

    LDMS_API.upsrlmAnalytics({ districts_total: 1 })
      .then((res) => {
        const data = res?.data?.districts || res?.data?.data?.districts || [];
        setDistricts(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("District totals failed", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ---------------------------
     TOOLTIP DATA
  --------------------------- */
  const tooltipData = useMemo(() => {
    if (!hoveredDistrictId) return null;
    return districts.find((d) => d.district_id === hoveredDistrictId);
  }, [hoveredDistrictId, districts]);

  /* ---------------------------
     AUTO-SCROLL TABLE ON MAP HOVER
  --------------------------- */
  useEffect(() => {
    if (!hoveredDistrictId) return;

    const row = rowRefs.current[hoveredDistrictId];
    const container = tableContainerRef.current;

    if (!row || !container) return;

    const rowTop = row.offsetTop;
    const rowHeight = row.offsetHeight;
    const containerHeight = container.clientHeight;

    const targetScroll = rowTop - containerHeight / 2 + rowHeight / 2;

    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, [hoveredDistrictId]);

  /* ---------------------------
     LOADER
  --------------------------- */
  if (loading) {
    return <div>Loading State Analytics…</div>;
  }

  return (
    <div className="smmu-wrapper">
      {/* ================= KPI CARDS ================= */}
      <div className="kpi-row">
        <div className="kpi-card">
          <FaUsers className="kpi-icon red" />
          <div>
            <div className="kpi-label">Total VOs</div>
            <div className="kpi-value">
              <AnimatedNumber value={stateTotals?.total_vos} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <FaLayerGroup className="kpi-icon red" />
          <div>
            <div className="kpi-label">Total CLFs</div>
            <div className="kpi-value">
              <AnimatedNumber value={stateTotals?.total_clfs} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <FaPeopleCarry className="kpi-icon red" />
          <div>
            <div className="kpi-label">Total SHGs</div>
            <div className="kpi-value">
              <AnimatedNumber value={stateTotals?.total_shgs} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <FaHome className="kpi-icon green" />
          <div>
            <div className="kpi-label">Total Rural Households</div>
            <div className="kpi-value">
              <AnimatedNumber value={stateTotals?.total_rural_hh} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <FaHome className="kpi-icon green" />
          <div>
            <div className="kpi-label">Households under SHGs</div>
            <div className="kpi-value">
              <AnimatedNumber value={stateTotals?.total_hh_under_shgs} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAP + TABLE ================= */}
      <div className="smmu-map-layout">
        {/* ============ MAP ============ */}
        <div
          className="map-section"
          ref={mapContainerRef}
          onMouseMove={(e) => {
            const rect = mapContainerRef.current?.getBoundingClientRect();
            if (!rect) return;
            setMousePos({
              x: e.clientX - rect.left + 14,
              y: e.clientY - rect.top + 14,
            });
          }}
        >
          <UPMap
            onHover={(data) => {
              setHoveredDistrictId(data ? Number(data.id) : null);
            }}
            onDistrictSelect={onDistrictSelect}
          />

          {tooltipData && (
            <div
              className="map-tooltip"
              style={{
                left: mousePos.x,
                top: mousePos.y,
              }}
            >
              <strong>{tooltipData.district_name}</strong>
              <div>VOs: {tooltipData.total_vos}</div>
              <div>CLFs: {tooltipData.total_clfs}</div>
              <div>SHGs: {tooltipData.total_shgs}</div>
              <div>Rural Households: {tooltipData.total_rural_hh ?? "—"}</div>
              <div>
                Households under SHGs: {tooltipData.total_hh_under_shgs ?? "—"}
              </div>
            </div>
          )}
        </div>

        {/* ============ TABLE ============ */}
        <div className="table-section" ref={tableContainerRef}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>District</th>
                <th>VOs</th>
                <th>CLFs</th>
                <th>SHGs</th>
                <th>Rural Households</th>
                <th>Households under SHGs</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d, i) => (
                <tr
                  key={d.district_id}
                  ref={(el) => (rowRefs.current[d.district_id] = el)}
                  className={
                    hoveredDistrictId === d.district_id ? "active-row" : ""
                  }
                >
                  <td>{i + 1}</td>
                  <td>{d.district_name}</td>
                  <td>{d.total_vos}</td>
                  <td>{d.total_clfs}</td>
                  <td>{d.total_shgs}</td>
                  <td>{d.total_rural_hh ?? "—"}</td>
                  <td>{d.total_hh_under_shgs ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .smmu-wrapper {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
        }

        /* KPI CARDS */

        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
          gap: 14px;
        }

        .kpi-card {
          background: #b71c1c;
          border-radius: 12px;
          padding: 14px 16px;
          border: 2px solid #b71c1c;

          display: flex;
          align-items: center;
          gap: 12px;

          transition: all 0.2s ease;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .kpi-icon {
          font-size: 24px;
        }

        .kpi-icon.red {
          color: #ffffff;
        }

        .kpi-icon.green {
          color: #ffffff;
        }

        .kpi-label {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }

        /* MAP + TABLE LAYOUT */

        .smmu-map-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 16px;
        }

        /* MAP */

        .map-section {
          position: relative;
          height: 520px;
          border: 2px solid #b71c1c;
          border-radius: 12px;
          background: #ffffff;
          overflow: hidden;
          padding-top: 40px;
        }

        .map-title {
          position: absolute;
          top: 8px;
          left: 12px;

          display: flex;
          align-items: center;
          gap: 6px;

          font-weight: 700;
          color: #b71c1c;
          font-size: 14px;
        }

        /* TOOLTIP */

        .map-tooltip {
          position: absolute;
          background: #ffffff;
          border: 1px solid #b71c1c;
          border-radius: 10px;
          padding: 10px 12px;

          font-size: 13px;
          line-height: 1.5;

          box-shadow: 0 10px 22px rgba(0,0,0,0.18);

          color: #333;

          pointer-events: none;
          z-index: 50;
          min-width: 160px;
        }

        /* TABLE */

        .table-section {
          border: 2px solid #b71c1c;
          border-radius: 12px;
          background: #ffffff;
          max-height: 520px;
          overflow-y: auto;
        }

        .table-title {
          display: flex;
          align-items: center;
          gap: 6px;

          padding: 10px 12px;

          font-weight: 700;
          color: #b71c1c;

          border-bottom: 1px solid #f1c0c0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        th {
          position: sticky;
          top: 0;

          background: #b71c1c;
          color: #ffffff;

          padding: 9px 8px;
          font-weight: 700;
        }

        td {
          padding: 8px;
          border-bottom: 1px solid #eee;
        }

        tbody tr:hover {
          background: #fff4f4;
        }

        .active-row {
          background: #fde3e3;
          font-weight: 600;
        }

        /* SCROLLBAR */

        .table-section::-webkit-scrollbar {
          width: 6px;
        }

        .table-section::-webkit-scrollbar-thumb {
          background: #b71c1c;
          border-radius: 10px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {

          .smmu-map-layout {
            grid-template-columns: 1fr;
          }

          .map-section {
            height: 420px;
          }

        }

        @media (max-width: 600px) {

          .kpi-value {
            font-size: 20px;
          }

          table {
            font-size: 12px;
          }

        }
      `}</style>
    </div>
  );
}
