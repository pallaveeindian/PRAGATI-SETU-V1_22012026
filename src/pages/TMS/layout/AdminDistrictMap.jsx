// src\pages\TMS\layout\AdminDistrictMap.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LOOKUP_API } from "../../../api/axios";
import { FaMapMarkerAlt, FaSpinner, FaTrophy } from "react-icons/fa";

export default function AdminDistrictMap({
  districtId,
  data = [], // Expected: [{ block_id, block_name, onboarded, enrolled, achieved }]
}) {
  const [districtName, setDistrictName] = useState(null);
  const [MapComponent, setMapComponent] = useState(null);
  const [loadingMap, setLoadingMap] = useState(true);

  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);
  const tableContainerRef = useRef(null);
  const rowRefs = useRef({});

  // 1. Resolve District Name from ID
  useEffect(() => {
    if (!districtId) return;
    setLoadingMap(true);
    setDistrictName(null);
    setMapComponent(null);

    LOOKUP_API.districts
      .retrieve(districtId, { fields: "district_name_en" })
      .then((res) => {
        const name = res?.data?.district_name_en;
        if (name) setDistrictName(name.toUpperCase());
      })
      .catch((e) => console.error("Failed to load district name", e));
  }, [districtId]);

  // 2. Lazy Load the Specific District SVG Map
  useEffect(() => {
    if (!districtName) return;

    const loadMap = async () => {
      try {
        const module = await import(
          `../../LDMS/District Maps/${districtName}/${districtName}.jsx`
        );
        setMapComponent(() => module.default);
      } catch (err) {
        console.error(`District map SVG for ${districtName} not found.`, err);
      } finally {
        setLoadingMap(false);
      }
    };

    loadMap();
  }, [districtName]);

  // 3. Auto-scroll table when hovering over the Map
  useEffect(() => {
    if (!hoveredBlockId) return;
    const row = rowRefs.current[hoveredBlockId];
    const container = tableContainerRef.current;

    if (!row || !container) return;

    const rowTop = row.offsetTop;
    const rowHeight = row.offsetHeight;
    const containerHeight = container.clientHeight;
    const targetScroll = rowTop - containerHeight / 2 + rowHeight / 2;

    container.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [hoveredBlockId]);

  // 4. Sort data descending by 'onboarded' and extract Tooltip Data
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    // Create a copy and sort by onboarded descending
    return [...data].sort((a, b) => (b.onboarded || 0) - (a.onboarded || 0));
  }, [data]);

  const tooltipData = useMemo(() => {
    if (!hoveredBlockId || !sortedData) return null;
    return (
      sortedData.find((d) => Number(d.block_id) === hoveredBlockId) || {
        block_id: hoveredBlockId,
        block_name: "Unknown Block",
        onboarded: 0,
        enrolled: 0,
        achieved: 0,
      }
    );
  }, [hoveredBlockId, sortedData]);

  if (!districtId) {
    return (
      <div className="muted-box">
        <FaMapMarkerAlt
          size={24}
          style={{ marginBottom: 10, color: "#cbd5e1" }}
        />
        <p>No district selected to display map.</p>
      </div>
    );
  }

  // Helper for Top 3 Trophies
  const renderTrophy = (index) => {
    if (index === 0) return <FaTrophy color="#fbbf24" title="1st Place" />; // Gold
    if (index === 1) return <FaTrophy color="#94a3b8" title="2nd Place" />; // Silver
    if (index === 2) return <FaTrophy color="#b45309" title="3rd Place" />; // Bronze
    return null;
  };

  return (
    <div className="admin-district-map-wrapper">
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
        {loadingMap ? (
          <div className="map-loader">
            <FaSpinner className="spin-icon" size={28} />
            <span>Loading {districtName || "District"} Map...</span>
          </div>
        ) : MapComponent ? (
          <MapComponent
            onHover={(mapData) => {
              setHoveredBlockId(mapData ? Number(mapData.id) : null);
            }}
            // SURGICAL UPDATE: Disabled block selection click logic entirely
            onSelect={() => {}}
          />
        ) : (
          <div className="map-loader error">
            Map unavailable for {districtName}
          </div>
        )}

        {/* CUSTOM TOOLTIP */}
        {tooltipData && hoveredBlockId && (
          <div
            className="admin-map-tooltip"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <div className="tt-header">{tooltipData.block_name || "Block"}</div>
            <div className="tt-body">
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
          </div>
        )}
      </div>

      {/* RIGHT: TABLE SECTION */}
      <div className="admin-map-table-section" ref={tableContainerRef}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "35%" }}>Block Name</th>
              <th className="num-col">Onboarded</th>
              <th className="num-col">Enrolled</th>
              <th className="num-col">Achieved</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                  }}
                >
                  No block-level metrics available for this district.
                </td>
              </tr>
            ) : (
              sortedData.map((b, i) => {
                const isHovered = hoveredBlockId === Number(b.block_id);
                const isTop3 = i < 3 && (b.onboarded || 0) > 0;

                return (
                  <tr
                    key={b.block_id}
                    ref={(el) => (rowRefs.current[b.block_id] = el)}
                    className={`hover-only-row ${isHovered ? "hovered-row" : ""} ${isTop3 ? "top-3-row" : ""}`}
                    onMouseEnter={() => setHoveredBlockId(Number(b.block_id))}
                    onMouseLeave={() => setHoveredBlockId(null)}
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
                          color: "#0f172a",
                        }}
                      >
                        {b.block_name}
                        {isTop3 && renderTrophy(i)}
                      </div>
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#2563eb" }}
                    >
                      {b.onboarded || 0}
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#d97706" }}
                    >
                      {b.enrolled || 0}
                    </td>
                    <td
                      className="num-col font-bold"
                      style={{ color: "#16a34a" }}
                    >
                      {b.achieved || 0}
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
        .admin-district-map-wrapper {
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; height: 550px; width: 100%;
        }
        
        .admin-map-section {
          position: relative; background: linear-gradient(to bottom, #fff 0%, #fff 35%, #496D9C 90%, #496D9C 100%); border: 2px solid #e2e8f0; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          transition: all 0.3s ease; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
        }
        .admin-map-section:hover { border-color: #93c5fd; }
        
        /* Map SVG Hover Targeting */
        .admin-map-section svg path { transition: fill 0.2s, stroke 0.2s; }
        .admin-map-section svg path:hover { fill: #3b82f6 !important; stroke: #1e3a8a !important; stroke-width: 1.5px; cursor: crosshair !important; }
        
        .map-loader { display: flex; flex-direction: column; align-items: center; color: #3b82f6; font-weight: 600; gap: 12px; }
        .map-loader.error { color: #ef4444; }
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

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

        /* Interactive Rows (Hover Only) */
        .hover-only-row { transition: background-color 0.2s ease; cursor: default; }
        .hover-only-row:hover, .hovered-row { background: #f8fafc; }
        
        /* Top 3 Highlight */
        .top-3-row { background: #fdfaf0; }
        .top-3-row:hover, .top-3-row.hovered-row { background: #fef3c7; }

        .muted-box { padding: 40px; text-align: center; color: #64748b; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }

        @media (max-width: 1024px) {
          .admin-district-map-wrapper { grid-template-columns: 1fr; height: auto; }
          .admin-map-section { height: 400px; }
          .admin-map-table-section { max-height: 400px; }
        }
      `}</style>
    </div>
  );
}
