//src/pages/TMS/TP/components/UPMap.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import UPMapSVG from "../../Maps/UP Map/UPMap";

export default function UPMapWrapper({ metricType, data, batchesFilter }) {
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
    // SURGICAL ADDITION: Helper boolean to check active filter
    const isCreatedFilter = batchesFilter === "created";

    switch (metricType) {
      case "district_tp_performance":
        return {
          headers: [
            "Rank",
            "District",
            "TP Username",
            "Batch Created",
            // SURGICAL: Hide "Batch Closed" header if filter is "created"
            ...(isCreatedFilter ? [] : ["Batch Closed"]),
          ],
          renderRow: (d) => (
            <>
              <td>
                <strong>#{d.performance_rank}</strong>
              </td>
              <td>{d.district_name_en}</td>
              <td>{d.district_tp_username || "—"}</td>
              <td>{d.batches_created}</td>
              {/* SURGICAL: Hide "Batch Closed" data cell if filter is "created" */}
              {!isCreatedFilter && <td>{d.batches_closed}</td>}
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
              {!isCreatedFilter && (
                <div>Batches Closed: {d.batches_closed}</div>
              )}
            </>
          ),
        };
      case "district_wise_metrics":
        return {
          headers: [
            "#",
            "District",
            "Assigned Targets",
            // SURGICAL: Rename header based on filter
            isCreatedFilter ? "Created Batches" : "Closed Batches",
          ],
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
              <div>
                {isCreatedFilter ? "Created Batches" : "Achieved Batches"}:{" "}
                {d.achieved_batches}
              </div>
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
        .fy-selector-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          padding: 10px 16px;
          width: 100%;
          border-radius: 6px;
          border: 3px solid #00217442; /* Slate 300 */
        }

        .fy-label {
          font-weight: 700;
          color: #334155; /* Slate 700 */
          font-size: 14px;
          font-family: 'Inter', system-ui, sans-serif;
          margin: 0;
        }

        .fy-select {
          padding: 8px 36px 8px 14px;
          border-radius: 6px;
          border: 1px solid #cbd5e1; /* Slate 300 */
          font-size: 14px;
          font-weight: 600;
          color: #0f172a; /* Slate 900 */
          outline: none;
          background-color: #f8fafc; /* Slate 50 */
          /* Custom sleek dropdown arrow */
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          appearance: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .fy-select:hover {
          border-color: #94a3b8;
        }

        .fy-select:focus {
          border-color: #3b82f6; /* TMS Primary Blue */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .tms-map-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          height: 520px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .map-section {
          position: relative;
          height: 100%;
          border: 3px solid #00217442;; 
          border-radius: 12px;
          background: #f8fafc; /* Very light slate background for contrast */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .map-section:hover {
          border-color: #93c5fd;
          box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.2);
        }

        .map-section svg path:hover {
          fill: #3b82f6 !important; /* TMS Primary Blue */
          cursor: default !important; /* Disabled pointer cursor */
          stroke: #1d4ed8 !important; /* Darker blue border on hover */
          stroke-width: 1.5px;
        }

        .map-tooltip {
          position: absolute;
          background: #ffffff;
          border: 1px solid #93c5fd; 
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13px;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.15);
          color: #1e3a8a; /* Deep blue text */
          pointer-events: none;
          z-index: 50;
          min-width: 180px;
          line-height: 1.5;
        }

        .table-section {
          border: 3px solid #0093E1;
          border-radius: 12px;
          background: #ffffff;
          height: 100%;
          overflow-y: auto;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
        }

        .table-section table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .table-section th {
          position: sticky;
          top: 0;
          background: #0093E1;
          color: #ffffff;
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          z-index: 10;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .table-section td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: middle;
        }

        /* Target the rank column specifically if needed */
        .table-section td strong {
          color: #0f172a;
          font-size: 14px;
        }

        .table-section tr {
          transition: background-color 0.15s ease;
        }

        .table-section tr:hover {
          background-color: #f8fafc;
        }

        .table-section tr.active-row {
          background: #eff6ff; /* Soft blue highlight matching the map hover */
        }

        .table-section tr.active-row td {
          color: #1e40af;
          font-weight: 600;
          border-bottom-color: #bfdbfe;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .tms-map-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          .map-section {
            height: 450px;
          }
          .table-section {
            max-height: 450px;
          }
          .fy-selector-wrapper {
            width: 100%; /* Full width on mobile */
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
