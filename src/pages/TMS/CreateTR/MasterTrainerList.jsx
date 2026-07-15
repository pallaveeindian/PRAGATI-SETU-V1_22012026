// src/pages/TMS/CreateTR/MasterTrainerList.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";

// Internal TrainerRow Component
const TrainerRow = React.memo(function TrainerRow({
  row,
  isSelected,
  onToggle,
}) {
  const handleChange = useCallback(
    (e) => {
      if (typeof onToggle === "function") onToggle(row, e.target.checked);
    },
    [onToggle, row],
  );

  return (
    <tr key={row.id} className={isSelected ? "row-selected" : ""}>
      <td>
        <input type="checkbox" checked={!!isSelected} onChange={handleChange} />
      </td>
      <td>{row.full_name || row.name || "-"}</td>
      <td>
        {row.designation || "-"}-{row.theme_name || "N/A"}
      </td>
      <td>{row.district_name_en || "-"}</td>
      <td>{row.mobile_no || "-"}</td>
      <td>{row.induction ? "Yes" : "No"}</td>
    </tr>
  );
});

export default React.memo(function MasterTrainerList({
  filters = {},
  onToggleTrainer,
  selectedIds = new Set(),
  preloadedTrainers = null,
  preloadReloadToken = 0,
  onRequestReload = null,
}) {
  const [trainersCache, setTrainersCache] = useState(
    Array.isArray(preloadedTrainers) ? preloadedTrainers : [],
  );

  const [loading, setLoading] = useState(false);
  const [designation, setDesignation] = useState(filters.designation || "");
  const [search, setSearch] = useState("");
  const [localReloadToken, setLocalReloadToken] = useState(0);

  useEffect(() => {
    if (Array.isArray(preloadedTrainers)) {
      setTrainersCache(preloadedTrainers);
    } else {
      setTrainersCache([]);
    }
    setLocalReloadToken((t) => t + 1);
  }, [preloadedTrainers, preloadReloadToken]);

  const filteredRows = useMemo(() => {
    if (!Array.isArray(trainersCache)) return [];
    const s = String(search || "")
      .trim()
      .toLowerCase();
    const dLower = String(designation || "").toLowerCase();

    return trainersCache.filter((t) => {
      if (designation && String(t.designation || "").toLowerCase() !== dLower)
        return false;
      if (
        filters.district &&
        String(t.empanel_district) !== String(filters.district)
      )
        return false;
      if (filters.block && String(t.empanel_block) !== String(filters.block))
        return false;

      if (s.length > 0) {
        const hay = `${t.full_name || t.name || ""}
          ${t.mobile_no || ""}
          ${t.TH_urid || ""}
          ${t.theme_name || ""}
          ${t.block_name_en || ""}
          ${t.district_name_en || ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [trainersCache, designation, filters.district, filters.block, search]);

  const PAGE_SIZE = 10;
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [trainersCache, designation, search]);

  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const rows = filteredRows.slice(
    (pageSafe - 1) * PAGE_SIZE,
    pageSafe * PAGE_SIZE,
  );

  const handleReload = useCallback(() => {
    if (typeof onRequestReload === "function") {
      setLoading(true);
      Promise.resolve(onRequestReload()).finally(() => setLoading(false));
    }
  }, [onRequestReload]);

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="header-row space-between">
        <div>
          <h3>Master Trainers</h3>
          <p className="muted" style={{ marginTop: 4 }}>
            Select trainers for this request.
          </p>
        </div>
        <div>
          <button
            className="btn-sm btn-flat"
            onClick={handleReload}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="filters-row" style={{ gap: 8 }}>
        <input
          className="input"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value || "");
            setPage(1);
          }}
          style={{
            width: 180,
            border: "2px solid #3d6ba6",
            borderRadius: 6,
            outline: "none",
            padding: 6,
          }}
        />
        <p style={{ marginLeft: 10, fontSize: 12, color: "#6c757d" }}>
          You can search for trainers by name, mobile, theme, empanelled block
          or district.
        </p>
        <select
          className="input"
          value={designation}
          onChange={(e) => {
            setDesignation(e.target.value);
            setPage(1);
          }}
          style={{ outline: "2px solid #3d6ba6" }}
        >
          <option value="">All designations</option>
          <option value="BRP">BRP</option>
          <option value="DRP">DRP</option>
          <option value="SRP">SRP</option>
        </select>
      </div>

      {loading ? (
        <div className="table-spinner">Loading trainers…</div>
      ) : rows.length === 0 ? (
        <p className="muted">No trainers found.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table table-compact">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>District</th>
                  <th>Mobile</th>
                  <th>Induction</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const id = r.id;
                  const isSel = selectedIds && selectedIds.has(id);
                  return (
                    <TrainerRow
                      key={id}
                      row={r}
                      isSelected={!!isSel}
                      onToggle={onToggleTrainer}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {total > PAGE_SIZE && (
            <div className="pagination" style={{ marginTop: 8 }}>
              <button
                className="btn-sm btn-flat"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span>
                Page {pageSafe} of {totalPages}
              </span>
              <button
                className="btn-sm btn-flat"
                disabled={pageSafe >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#6c757d" }}>
              Showing {filteredRows.length} trainers
            </div>
          </div>
        </>
      )}
    </div>
  );
});
