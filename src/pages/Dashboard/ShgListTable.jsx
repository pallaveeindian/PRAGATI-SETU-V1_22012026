// src/pages/Dashboard/ShgListTable.jsx
import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from "../../api/axios";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Simple in-memory cache for SHG lists (per block + filters)
const shgListCache = new Map();

/**
 * SHG list for a given block.
 * - Uses EPSAKHI_API.upsrlmShgList(blockId, params) → /upsrlm-shg-list/<block_id>/
 * - Correct pagination – supports both {data, meta} and {results, count} shapes.
 *
 * Props:
 *  - blockId           (required)
 *  - onSelectShg(shg)  -> called when user clicks "View"
 *  - selectedShgCode   -> optional, to highlight current selection
 */
export default function ShgListTable({
  blockId,
  onSelectShg,
  selectedShgCode,
}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");

  async function load(page = 1, { force = false } = {}) {
    if (!blockId) return;

    const pageSize = meta.page_size || 20;
    const cacheKey = JSON.stringify({
      blockId,
      page,
      page_size: pageSize,
      search: search || "",
      ordering: ordering || "",
    });

    // Use cached list when not forcing a refresh
    if (!force && shgListCache.has(cacheKey)) {
      const cached = shgListCache.get(cacheKey);
      setRows(cached.rows || []);
      setMeta(cached.meta || { page, page_size: pageSize, total: 0 });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = {
        block_id: blockId,
        page,
        page_size: pageSize,
        search: search || undefined,
        ordering: ordering || undefined,
      };

      const res = await EPSAKHI_API.upsrlmShgList(blockId, params);
      const payload = res?.data || {};

      // Support both shapes:
      // 1) {"data":[...],"meta":{page,page_size,total}}
      // 2) {"results":[...],"count":N}
      const data =
        Array.isArray(payload.data) && payload.data.length
          ? payload.data
          : Array.isArray(payload.results)
            ? payload.results
            : [];

      const totalFromMeta =
        typeof payload.meta?.total === "number"
          ? payload.meta.total
          : undefined;
      const totalFromCount =
        typeof payload.count === "number" ? payload.count : data.length;

      const newMeta = {
        page: payload.meta?.page ?? page,
        page_size: payload.meta?.page_size ?? pageSize,
        total: totalFromMeta ?? totalFromCount,
      };

      setRows(data);
      setMeta(newMeta);
      shgListCache.set(cacheKey, { rows: data, meta: newMeta });
    } catch (e) {
      console.error(
        "Failed to load SHG list",
        e?.response?.data || e.message || e,
      );
      setError(
        e?.response?.data?.detail ||
          e.message ||
          "Failed to load SHG list from UPSRLM.",
      );
    } finally {
      setLoading(false);
    }
  }

  // reload on block / filters change
  useEffect(() => {
    setRows([]);
    setMeta({ page: 1, page_size: 20, total: 0 });
    if (blockId) {
      load(1, { force: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockId, search, ordering]);

  if (!blockId) {
    return (
      <div className="card" style={{ marginTop: 16 }}>
        <p className="muted">Select a block to view SHGs.</p>
      </div>
    );
  }

  const totalPages =
    meta && meta.page_size > 0
      ? Math.max(1, Math.ceil((meta.total || 0) / meta.page_size))
      : 1;

  return (
    <div
      className="card"
      style={{
        marginTop: 16,
        background: "#e4ecf5",
        borderRadius: 10,
        padding: 18,
        border: "2px solid #3d6ba6",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="header-row space-between"
        style={{
          borderBottom: "2px solid #a7c6ed",
          paddingBottom: 10,
          marginBottom: 14,
        }}
      >
        <div>
          <h2 style={{ color: "#2b4e72", margin: 0 }}>
            Self Help Groups (SHGs)
          </h2>
          <p
            className="muted"
            style={{
              marginTop: 4,
              color: "#3d6ba6",
              fontSize: 13,
            }}
          >
            List of SHGs fetched from UPSRLM for the selected block. Use search
            and ordering to narrow down.
          </p>
        </div>
        <button
          className="btnPrimaryHover"
          onClick={() => load(meta.page || 1, { force: true })}
          disabled={loading}
          style={{
            background: "#3d6ba6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          Refresh
        </button>
      </div>

      <div
        className="filters-row"
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <input
          type="text"
          className="search-input"
          style={{
            border: "1px solid #3d6ba6",
            borderRadius: 6,
            padding: "6px 10px",
            outline: "none",
          }}
          placeholder="Search SHG name / code / village"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <select
          className="input"
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          style={{
            border: "1px solid #3d6ba6",
            borderRadius: 6,
            padding: "6px 10px",
            outline: 'none'
          }}
          pla
        >
          <option value="">Order by…</option>
          <option value="shg_name">SHG Name (A–Z)</option>
          <option value="-shg_name">SHG Name (Z–A)</option>
          <option value="village_name">Village (A–Z)</option>
          <option value="-village_name">Village (Z–A)</option>
        </select> */}
        <select
          className="custom-select"
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
        >
          <option value="">Order by…</option>
          <option value="shg_name">SHG Name (A–Z)</option>
          <option value="-shg_name">SHG Name (Z–A)</option>
          <option value="village_name">Village (A–Z)</option>
          <option value="-village_name">Village (Z–A)</option>
        </select>
        <button
          className="btnPrimaryHover"
          onClick={() => load(1, { force: true })}
          style={{
            background: "#5a8cc2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          Apply
        </button>
      </div>

      {loading ? (
        <div className="table-spinner">
          <span>Loading SHGs…</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ marginTop: 8 }}>
          {error}
        </div>
      ) : rows.length === 0 ? (
        <p className="muted" style={{ marginTop: 8 }}>
          No SHGs found for this block.
        </p>
      ) : (
        <>
          <div className="table-wrapper">
            <table
              className="table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead
                style={{
                  background: "#3d6ba6",
                  color: "#fff",
                }}
              >
                <tr>
                  <th style={{ padding: 10, textAlign: "left" }}>SHG Name</th>
                  <th style={{ padding: 10, textAlign: "left" }}>SHG Code</th>
                  <th style={{ padding: 10, textAlign: "left" }}>SHG Type</th>
                  <th style={{ padding: 10, textAlign: "left" }}>
                    Social Category
                  </th>
                  <th style={{ padding: 10, textAlign: "left" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((shg, idx) => {
                  const code =
                    shg.shg_code ||
                    shg.code ||
                    shg.id ||
                    `${shg.shg_name}-${idx}`;
                  const isSelected =
                    selectedShgCode &&
                    (selectedShgCode === shg.shg_code ||
                      selectedShgCode === code);

                  return (
                    <tr
                      key={code}
                      className={isSelected ? "row-selected" : ""}
                      style={{
                        background: isSelected ? "#a7c6ed" : "#fff",
                        borderBottom: "1px solid #e4ecf5",
                      }}
                    >
                      <td style={{ padding: 10 }}>
                        {shg.shg_name || shg.name || "-"}
                      </td>
                      <td style={{ padding: 10 }}>
                        {shg.shg_code || shg.code || "-"}
                      </td>
                      <td style={{ padding: 10 }}>
                        {shg.shg_type || shg.shgType || "-"}
                      </td>
                      <td style={{ padding: 10 }}>
                        {shg.social_category || shg.socialCategory || "-"}
                      </td>
                      <td style={{ padding: 10 }}>
                        <button
                          className="btn-sm"
                          onClick={() => onSelectShg && onSelectShg(shg)}
                          style={{
                            background: "transparent",
                            border: "1px solid #3d6ba6",
                            borderRadius: 6,
                            padding: "5px 10px",
                            cursor: "pointer",
                            color: "#2b4e72",
                            transition: "0.3s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#5a8cc2";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#2b4e72";
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {meta && meta.total > meta.page_size && (
            <div
              className="pagination"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                marginTop: 14,
              }}
            >
              <button
                style={{
                  background: "#3d6ba6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
                disabled={meta.page <= 1}
                onClick={() => load(meta.page - 1)}
              >
                Prev
              </button>
              <span>
                Page {meta.page} of {totalPages}
              </span>
              <button
                style={{
                  background: "#3d6ba6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
                disabled={meta.page >= totalPages}
                onClick={() => load(meta.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <style>{`.custom-select {
  border: 2px solid #3d6ba6;
  border-radius: 8px;
  padding: 6px 30px 6px 10px;
  outline: none;
  background-color: #fff;
  color: #1f2937;
  font-size: 14px;
  appearance: none;
  cursor: pointer;
}
/* Focus state */
.custom-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(61,107,166,0.2);
}
.search-input{
  border: 1px solid #3d6ba6;
  border-radius: 6px;
  padding: 6px 10px;
  outline: none;
  transition: all 0.2s ease;
}

/* Focus effect */
.search-input:focus{
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(61,107,166,0.25);
}
btnPrimary = {
     background: "#3d6ba6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

 .btnPrimaryHover:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.15);
}
`}</style>
    </div>
  );
}
