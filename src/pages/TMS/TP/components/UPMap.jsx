//src/pages/TMS/TP/components/UPMap.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import UPMapSVG from "../../Maps/UP Map/UPMap";

export default function UPMapWrapper({ metricType, data }) {
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);
  const tableContainerRef = useRef(null);
  const rowRefs = useRef({});

  // Reset scroll and hover when switching metrics
  useEffect(() => {
    setHoveredDistrictId(null);
  }, [metricType]);

  // Extract the hovered district's data from the passed dataset
  const tooltipData = useMemo(() => {
    if (!hoveredDistrictId || !data) return null;
    return data.find((d) => Number(d.district_id) === hoveredDistrictId);
  }, [hoveredDistrictId, data]);

  // Auto-scroll table to keep hovered district in view
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

  // Configuration map for different metric types
  const getConfig = () => {
    switch (metricType) {
      case "district_tp_performance":
        return {
          headers: ["Rank", "District", "TP Username", "Created", "Closed"],
          renderRow: (d) => (
            <>
              <td>
                <strong>#{d.performance_rank}</strong>
              </td>
              <td>{d.district_name_en}</td>
              <td>{d.district_tp_username || "—"}</td>
              <td>{d.batches_created}</td>
              <td>{d.batches_closed}</td>
            </>
          ),
          renderTooltip: (d) => (
            <>
              <strong>
                {d.district_name_en} (Rank #{d.performance_rank})
              </strong>
              <div style={{ marginTop: 4 }}>
                Username: {d.district_tp_username || "—"}
              </div>
              <div>Batches Created: {d.batches_created}</div>
              <div>Batches Closed: {d.batches_closed}</div>
            </>
          ),
        };
      case "district_wise_metrics":
        return {
          headers: ["#", "District", "Assigned Targets", "Achieved Batches"],
          renderRow: (d, i) => (
            <>
              <td>{i + 1}</td>
              <td>{d.district_name_en}</td>
              <td>{d.assigned_targets}</td>
              <td>{d.achieved_batches}</td>
            </>
          ),
          renderTooltip: (d) => (
            <>
              <strong>{d.district_name_en}</strong>
              <div style={{ marginTop: 4 }}>
                Assigned Targets: {d.assigned_targets}
              </div>
              <div>Achieved Batches: {d.achieved_batches}</div>
            </>
          ),
        };
      case "district_wise_centres":
        return {
          headers: ["#", "District", "Registered Centres"],
          renderRow: (d, i) => (
            <>
              <td>{i + 1}</td>
              <td>{d.district_name_en}</td>
              <td>{d.registered_centres_count}</td>
            </>
          ),
          renderTooltip: (d) => (
            <>
              <strong>{d.district_name_en}</strong>
              <div style={{ marginTop: 4 }}>
                Registered Centres: {d.registered_centres_count}
              </div>
            </>
          ),
        };
      default:
        return {
          headers: [],
          renderRow: () => null,
          renderTooltip: () => null,
        };
    }
  };

  const config = getConfig();

  if (!data || data.length === 0) {
    return (
      <div className="muted" style={{ padding: "20px 0" }}>
        No data available for this selection.
      </div>
    );
  }

  return (
    <div className="tms-map-layout">
      {/* ============ MAP SECTION ============ */}
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
        <UPMapSVG
          onHover={(mapData) => {
            setHoveredDistrictId(mapData ? Number(mapData.id) : null);
          }}
          onDistrictSelect={() => {}} // Disabled click as requested
        />

        {tooltipData && (
          <div
            className="map-tooltip"
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
          >
            {config.renderTooltip(tooltipData)}
          </div>
        )}
      </div>

      {/* ============ TABLE SECTION ============ */}
      <div className="table-section" ref={tableContainerRef}>
        <table>
          <thead>
            <tr>
              {config.headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr
                key={d.district_id}
                ref={(el) => (rowRefs.current[d.district_id] = el)}
                className={
                  hoveredDistrictId === Number(d.district_id)
                    ? "active-row"
                    : ""
                }
                onMouseEnter={() => setHoveredDistrictId(Number(d.district_id))}
                onMouseLeave={() => setHoveredDistrictId(null)}
              >
                {config.renderRow(d, i)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .tms-map-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          height: 520px;
        }

        .map-section {
          position: relative;
          height: 100%;
          border: 2px solid #cbd5e1; /* TMS Slate/Blue framing */
          border-radius: 12px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .map-section:hover {
          border-color: #93c5fd;
        }

        /* Override SVG paths on hover using TMS primary blue */
        .map-section svg path:hover {
          fill: #60a5fa !important;
          cursor: default !important; /* Disabled pointer cursor */
        }

        .map-tooltip {
          position: absolute;
          background: #ffffff;
          border: 1px solid #3b82f6; /* TMS Primary Blue */
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15);
          color: #1e3a8a; /* Deep blue text */
          pointer-events: none;
          z-index: 50;
          min-width: 180px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .table-section {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          height: 100%;
          overflow-y: auto;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        }

        .table-section table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
        }

        .table-section th {
          position: sticky;
          top: 0;
          background: #2563eb; /* TMS Primary Blue Header */
          color: #ffffff;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          z-index: 10;
          letter-spacing: 0.02em;
        }

        .table-section td {
          padding: 10px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .table-section tr {
          transition: background-color 0.15s ease;
        }

        .table-section tr.active-row {
          background: #eff6ff; /* Very light blue background */
          color: #1d4ed8; /* Darker blue text */
          font-weight: 600;
        }

        .table-section tr.active-row td {
          color: #1e40af;
          border-bottom-color: #bfdbfe;
        }

        @media (max-width: 1024px) {
          .tms-map-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          .map-section {
            height: 400px;
          }
          .table-section {
            max-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
