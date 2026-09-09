// src\pages\TMS\layout\AdminUPMap.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import UPMapSVG from "../Maps/UP Map/UPMap";
import { FaTrophy } from "react-icons/fa";

export default function AdminUPMap({
  data = [], // Expected: [{ district_id, district_name, target, onboarded, enrolled, achieved }]
  activeDistrictId,
  onDistrictSelect,
}) {
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMapHovering, setIsMapHovering] = useState(false);
  const mapContainerRef = useRef(null);
  const tableContainerRef = useRef(null);
  const rowRefs = useRef({});

  // 1. Auto-scroll table when hovering over the Map
  useEffect(() => {
    if (!isMapHovering || !hoveredDistrictId) return;

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
  }, [hoveredDistrictId, isMapHovering]);

  // 2. Sort data descending by 'onboarded' and extract Tooltip Data
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort((a, b) => (b.onboarded || 0) - (a.onboarded || 0));
  }, [data]);

  const tooltipData = useMemo(() => {
    if (!hoveredDistrictId || !sortedData) return null;
    return (
      sortedData.find((d) => Number(d.district_id) === hoveredDistrictId) || {
        district_id: hoveredDistrictId,
        district_name: "Unknown District",
        target: 0,
        onboarded: 0,
        enrolled: 0,
        achieved: 0,
      }
    );
  }, [hoveredDistrictId, sortedData]);

  // Helper for Top 3 Trophies
  const renderTrophy = (index) => {
    if (index === 0) return <FaTrophy color="#fbbf24" title="1st Place" />; // Gold
    if (index === 1) return <FaTrophy color="#94a3b8" title="2nd Place" />; // Silver
    if (index === 2) return <FaTrophy color="#b45309" title="3rd Place" />; // Bronze
    return null;
  };

  return (
    <div className="admin-upmap-wrapper">
      {/* LEFT: MAP SECTION */}
      <div
        className="admin-map-section"
        ref={mapContainerRef}
        onMouseMove={(e) => {
          const rect = mapContainerRef.current?.getBoundingClientRect();
          if (!rect) return;
          setMousePos({
            x: e.clientX - rect.left + 15,
            y: e.clientY - rect.top + 15,
          });
        }}
      >
        <UPMapSVG
          onHover={(mapData) => {
            setIsMapHovering(!!mapData);
            setHoveredDistrictId(mapData ? Number(mapData.id) : null);
          }}
          onDistrictSelect={(id) => {
            if (id && onDistrictSelect) {
              onDistrictSelect(
                activeDistrictId === Number(id) ? null : Number(id),
              );
            }
          }}
        />

        {/* CUSTOM TOOLTIP */}
        {tooltipData && hoveredDistrictId && (
          <div
            className="admin-map-tooltip"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <div className="tt-header">
              {tooltipData.district_name || "District"}
            </div>
            <div className="tt-body">
              <div className="tt-row">
                <span>Total Target:</span>
                <strong style={{ color: "#0f172a" }}>
                  {tooltipData.target || 0}
                </strong>
              </div>
              <div className="tt-row">
                <span>Onboarded:</span>
                <strong style={{ color: "#3b82f6" }}>
                  {tooltipData.onboarded || 0}
                </strong>
              </div>
              <div className="tt-row">
                <span>Enrolled (Active):</span>
                <strong style={{ color: "#f59e0b" }}>
                  {tooltipData.enrolled || 0}
                </strong>
              </div>
              <div className="tt-row">
                <span>Achieved (Trained):</span>
                <strong style={{ color: "#16a34a" }}>
                  {tooltipData.achieved || 0}
                </strong>
              </div>
            </div>
            <div className="tt-footer">Click to view Block-wise data</div>
          </div>
        )}
      </div>

      {/* RIGHT: TABLE SECTION */}
      <div className="admin-map-table-section" ref={tableContainerRef}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "30%" }}>District</th>
              <th className="num-col">Target</th>
              <th className="num-col">Onboarded</th>
              <th className="num-col">Enrolled</th>
              <th className="num-col">Achieved</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                  }}
                >
                  No district metrics available.
                </td>
              </tr>
            ) : (
              sortedData.map((d, i) => {
                const isHovered = hoveredDistrictId === Number(d.district_id);
                const isSelected = activeDistrictId === Number(d.district_id);
                const isTop3 = i < 3 && (d.onboarded || 0) > 0;

                return (
                  <tr
                    key={d.district_id}
                    ref={(el) => (rowRefs.current[d.district_id] = el)}
                    className={`clickable-row ${isHovered ? "hovered-row" : ""} ${
                      isSelected ? "selected-row" : ""
                    } ${isTop3 ? "top-3-row" : ""}`}
                    onMouseEnter={() =>
                      setHoveredDistrictId(Number(d.district_id))
                    }
                    onMouseLeave={() => setHoveredDistrictId(null)}
                    onClick={() =>
                      onDistrictSelect(
                        isSelected ? null : Number(d.district_id),
                      )
                    }
                  >
                    <td style={{ fontWeight: 800, color: "#475569" }}>
                      {i + 1}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: 700,
                          color: isSelected ? "#1d4ed8" : "#0f172a",
                        }}
                      >
                        {d.district_name}
                        {isTop3 && renderTrophy(i)}
                      </div>
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#64748b" }}
                    >
                      {d.target || 0}
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#2563eb" }}
                    >
                      {d.onboarded || 0}
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#d97706" }}
                    >
                      {d.enrolled || 0}
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#16a34a" }}
                    >
                      {d.achieved || 0}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- STYLES --- */}
      <style>{`
        .admin-upmap-wrapper {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; height: 550px; width: 100%;
        }
        
        .admin-map-section {
          position: relative; background: linear-gradient(to bottom, #fff 0%, #fff 35%, #496D9C 90%, #496D9C 100%); border: 2px solid #e2e8f0; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          transition: all 0.3s ease; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
        }
        .admin-map-section:hover { border-color: #93c5fd; }
        
        /* Map SVG Hover Targeting */
        .admin-map-section svg path { transition: fill 0.2s, stroke 0.2s; }
        .admin-map-section svg path:hover { fill: #3b82f6 !important; stroke: #1e3a8a !important; stroke-width: 1.5px; cursor: pointer !important; }
        
        /* Custom Absolute Tooltip */
        .admin-map-tooltip {
          position: absolute; background: #ffffff; border: 1px solid #bae6fd; border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2); pointer-events: none; z-index: 50;
          min-width: 220px; overflow: hidden;
        }
        .tt-header { background: #eff6ff; color: #1e3a8a; padding: 10px 14px; font-weight: 800; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #bfdbfe; }
        .tt-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
        .tt-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; font-weight: 500; }
        .tt-row strong { font-size: 14px; }
        .tt-footer { background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; text-align: center; padding: 6px; text-transform: uppercase; border-top: 1px solid #bbf7d0; }

        /* Table Section */
        .admin-map-table-section {
          background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px;
          overflow-y: auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .admin-map-table-section table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .admin-map-table-section th {
          position: sticky; top: 0; background: #1e3a8a; color: #ffffff;
          padding: 14px 16px; text-align: left; font-weight: 600; z-index: 10;
          text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;
        }
        .admin-map-table-section td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        
        .num-col { text-align: right !important; }
        .font-bold { font-weight: 800; }

        /* Interactive Rows */
        .clickable-row { transition: background-color 0.2s ease; cursor: pointer; }
        .clickable-row:hover, .hovered-row { background: #f8fafc; }
        .selected-row { background: #eff6ff !important; border-left: 4px solid #2563eb; }
        
        /* Top 3 Highlight */
        .top-3-row { background: #fdfaf0; }
        .top-3-row:hover, .top-3-row.hovered-row { background: #fef3c7; }

        @media (max-width: 1024px) {
          .admin-upmap-wrapper { grid-template-columns: 1fr; height: auto; }
          .admin-map-section { height: 450px; }
          .admin-map-table-section { max-height: 450px; }
        }
      `}</style>
    </div>
  );
}
