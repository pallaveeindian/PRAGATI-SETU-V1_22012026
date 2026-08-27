// src\pages\TMS\layout\AdminDistrictMap.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LOOKUP_API } from "../../../api/axios";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

export default function AdminDistrictMap({
  districtId,
  data = [], // Expected: [{ block_id, block_name_en, total_batches, trained_beneficiaries, ... }]
  activeBlockId,
  onBlockSelect,
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
        // Adjust this path to point to your actual District Maps folder!
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

  // Extract Tooltip Data
  const tooltipData = useMemo(() => {
    if (!hoveredBlockId || !data) return null;
    return (
      data.find((d) => Number(d.block_id) === hoveredBlockId) || {
        block_id: hoveredBlockId,
        block_name_en: "Unknown Block",
      }
    );
  }, [hoveredBlockId, data]);

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
            onSelect={(mapData) => {
              if (mapData?.id && onBlockSelect) {
                // Toggle selection
                onBlockSelect(
                  activeBlockId === Number(mapData.id)
                    ? null
                    : Number(mapData.id),
                );
              }
            }}
          />
        ) : (
          <div className="map-loader error">
            Map unavailable for {districtName}
          </div>
        )}

        {/* CUSTOM TOOLTIP */}
        {tooltipData && (
          <div
            className="admin-map-tooltip"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <div className="tt-header">
              {tooltipData.block_name_en || "Block"}
            </div>
            <div className="tt-body">
              <div className="tt-row">
                <span>Total Batches:</span>
                <strong>{tooltipData.total_batches || 0}</strong>
              </div>
              <div className="tt-row">
                <span>Beneficiaries Trained:</span>
                <strong>{tooltipData.trained_beneficiaries || 0}</strong>
              </div>
            </div>
            {activeBlockId === tooltipData.block_id && (
              <div className="tt-footer">Currently Selected Filter</div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: TABLE SECTION */}
      <div className="admin-map-table-section" ref={tableContainerRef}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>#</th>
              <th style={{ width: "40%" }}>Block Name</th>
              <th className="num-col">Total Batches</th>
              <th className="num-col">Participants Trained</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
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
              data.map((b, i) => {
                const isHovered = hoveredBlockId === Number(b.block_id);
                const isSelected = activeBlockId === Number(b.block_id);

                return (
                  <tr
                    key={b.block_id}
                    ref={(el) => (rowRefs.current[b.block_id] = el)}
                    className={`clickable-row ${isHovered ? "hovered-row" : ""} ${isSelected ? "selected-row" : ""}`}
                    onMouseEnter={() => setHoveredBlockId(Number(b.block_id))}
                    onMouseLeave={() => setHoveredBlockId(null)}
                    onClick={() =>
                      onBlockSelect(isSelected ? null : Number(b.block_id))
                    }
                  >
                    <td>{i + 1}</td>
                    <td
                      style={{
                        fontWeight: 600,
                        color: isSelected ? "#1d4ed8" : "#1e293b",
                      }}
                    >
                      {b.block_name_en}
                    </td>
                    <td className="num-col">{b.total_batches || 0}</td>
                    <td className="num-col font-bold text-green">
                      {(b.trained_beneficiaries || 0) +
                        (b.trained_trainers || 0)}
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
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; height: 500px; width: 100%;
        }
        
        .admin-map-section {
          position: relative; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          transition: all 0.3s ease; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
        }
        .admin-map-section:hover { border-color: #93c5fd; }
        
        /* Map SVG Hover Targeting */
        .admin-map-section svg path { transition: fill 0.2s, stroke 0.2s; }
        .admin-map-section svg path:hover { fill: #3b82f6 !important; stroke: #1e3a8a !important; stroke-width: 1.5px; cursor: pointer; }
        
        .map-loader { display: flex; flex-direction: column; align-items: center; color: #3b82f6; font-weight: 600; gap: 12px; }
        .map-loader.error { color: #ef4444; }
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Custom Absolute Tooltip */
        .admin-map-tooltip {
          position: absolute; background: #ffffff; border: 1px solid #bae6fd; border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2); pointer-events: none; z-index: 50;
          min-width: 180px; overflow: hidden;
        }
        .tt-header { background: #eff6ff; color: #1e3a8a; padding: 8px 12px; font-weight: 800; font-size: 13px; text-transform: uppercase; border-bottom: 1px solid #bfdbfe; }
        .tt-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .tt-row { display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
        .tt-row strong { color: #0f172a; font-size: 13px; }
        .tt-footer { background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; text-align: center; padding: 4px; text-transform: uppercase; border-top: 1px solid #bbf7d0; }

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
        .font-bold { font-weight: 700; }
        .text-green { color: #16a34a !important; }

        /* Interactive Rows */
        .clickable-row { cursor: pointer; transition: background-color 0.2s ease; }
        .clickable-row:hover, .hovered-row { background: #f8fafc; }
        .selected-row { background: #eff6ff !important; border-left: 4px solid #2563eb; }

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
