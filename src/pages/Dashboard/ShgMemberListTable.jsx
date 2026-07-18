// src/pages/Dashboard/ShgMemberListTable.jsx
import React, { useEffect, useState, useMemo } from "react";
import { EPSAKHI_API } from "../../api/axios";

// Cache for SHG member lists per (shgCode + filters)
const shgMembersCache = new Map();

function calculateAge(dob) {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * Member list for a selected SHG.
 *
 * Props:
 *  - shg                  (object)  -> may contain shg_code or code or id
 *  - shgId                (string|number) -> optional fallback id/code when shg doesn't contain shg_code
 *  - onSelectMember(member) -> called when user clicks "View Detail" (legacy)
 *  - onToggleMember(member, checked) -> called for checkbox selection/unselection (new)
 *  - selectedMemberCodes  (Set|Array) -> optional controlled selection (member_code values)
 *  - selectedMemberCode   -> optional single-code highlight (backwards compatibility)
 *
 * Notes:
 *  - When checkbox is checked we call both `onToggleMember(member, true)` and also `onSelectMember(member)` (to maintain existing behavior that expects a full member object).
 *  - When checkbox is unchecked we call `onToggleMember(member, false)`.
 */
export default function ShgMemberListTable({
  shg,
  shgId, // new optional prop (surgical)
  onSelectMember,
  onToggleMember,
  selectedMemberCodes,
  selectedMemberCode, // legacy single highlight prop
}) {
  // compute a stable SHG key to call API with and for caching.
  // Prefer shg.code -> shg.shg_code -> shgId prop -> shg.id
  const shgKey = shg?.code || shg?.shg_code || shgId || shg?.id || null;

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [onlyPld, setOnlyPld] = useState(false); // working PLD filter
  const [reloadToken, setReloadToken] = useState(0);

  // internal selected set (if parent doesn't control selection)
  const [internalSelected, setInternalSelected] = useState(() => new Set());

  // compute a Set from selectedMemberCodes prop for quick lookup
  const controlledSelectedSet = useMemo(() => {
    if (!selectedMemberCodes) return null;
    // SURGICAL SAFETY: Force all IDs to strictly be strings to prevent number/string mismatch bugs
    if (selectedMemberCodes instanceof Set)
      return new Set(Array.from(selectedMemberCodes).map(String));
    if (Array.isArray(selectedMemberCodes))
      return new Set(selectedMemberCodes.map(String));
    // fallback: single code string
    return new Set([String(selectedMemberCodes)]);
  }, [selectedMemberCodes]);

  // helper: is a given member considered selected (controlled -> prop, else internal)
  function isMemberSelected(member) {
    const code = member?.member_code || member?.lokos_member_code || member?.id;
    if (!code) return false;
    if (controlledSelectedSet) return controlledSelectedSet.has(String(code));
    return internalSelected.has(String(code));
  }

  async function load(page = 1, { force = false } = {}) {
    if (!shgKey) return;

    const pageSize = meta.page_size || 20;
    const cacheKey = JSON.stringify({
      shgKey,
      page,
      page_size: pageSize,
      search: search || "",
      ordering: ordering || "",
      onlyPld: !!onlyPld,
    });

    if (!force && shgMembersCache.has(cacheKey)) {
      const cached = shgMembersCache.get(cacheKey);
      setRows(cached.rows || []);
      setMeta(cached.meta || { page, page_size: pageSize, total: 0 });
      return;
    }

    setLoading(true);
    setError("");

    try {
      // upsrlmShgMembers expects an identifier (shg code or id depending on backend)
      const res = await EPSAKHI_API.upsrlmShgMembers(shgKey, {
        page,
        page_size: pageSize,
        search: search || undefined,
        ordering: ordering || undefined,
        pld_status: onlyPld ? "true" : undefined,
      });

      const payload = res?.data || {};
      const data = Array.isArray(payload.data) ? payload.data : [];
      const m = payload.meta || {
        page,
        page_size: pageSize,
        total: data.length,
      };

      const newMeta = {
        page: m.page || page,
        page_size: m.page_size || pageSize,
        total: m.total ?? m.count ?? data.length,
      };

      setRows(data);
      setMeta(newMeta);
      shgMembersCache.set(cacheKey, { rows: data, meta: newMeta });
    } catch (e) {
      console.error(
        "Failed to load SHG members",
        e?.response?.data || e.message || e,
      );
      setError(
        e?.response?.data?.detail ||
          e.message ||
          "Failed to load SHG members from UPSRLM.",
      );
    } finally {
      setLoading(false);
    }
  }

  // reload whenever shgKey / filters / reloadToken change
  useEffect(() => {
    setRows([]);
    setMeta({ page: 1, page_size: 20, total: 0 });
    // reset internal selection ONLY if uncontrolled
    if (!controlledSelectedSet) {
      setInternalSelected(new Set());
    }

    if (shgKey) {
      load(1, { force: reloadToken > 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shgKey, search, ordering, onlyPld, reloadToken]);

  if (!shgKey) {
    return (
      <div className="card" style={{ marginTop: 16 }}>
        <p className="muted">Select an SHG to view its members.</p>
      </div>
    );
  }

  const totalPages =
    meta && meta.page_size > 0
      ? Math.max(1, Math.ceil((meta.total || 0) / meta.page_size))
      : 1;

  function handleToggleRow(member, checked) {
    const code = member?.member_code || member?.lokos_member_code || member?.id;
    if (!code) return;

    if (controlledSelectedSet) {
      if (onToggleMember) onToggleMember(member, !!checked);

      // 🔥 FIX: handle unselect
      if (onSelectMember) {
        if (checked) onSelectMember(member);
        else onSelectMember(null); // ✅ IMPORTANT
      }
      return;
    }

    setInternalSelected((prev) => {
      const copy = new Set(prev);
      if (checked) copy.add(String(code));
      else copy.delete(String(code));
      return copy;
    });

    if (onToggleMember) onToggleMember(member, !!checked);

    // 🔥 FIX HERE ALSO
    if (onSelectMember) {
      if (checked) onSelectMember(member);
      else onSelectMember(null); // ✅ IMPORTANT
    }
  }
  return (
    <div
      className="card"
      style={{
        marginTop: 16,
        background: "#fff",
        border: "2px solid #3d6ba6",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 4px 10px rgba(43,78,114,0.15)",
      }}
    >
      {/* HEADER */}
      <div
        className="header-row space-between"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#2b4e72" }}>
            Members in SHG:{" "}
            <span style={{ color: "#111827", fontWeight: 600 }}>
              {shg?.shg_name ||
                shg?.name ||
                shg?.shg_code ||
                shg?.code ||
                String(shgKey)}
            </span>
          </h3>
        </div>

        <button
          className="btnPrimaryHover"
          onClick={() => setReloadToken((t) => t + 1)}
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

      {/* FILTERS */}
      <div
        className="filters-row"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          className="search-input"
          placeholder="Search member name / code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "1px solid #3d6ba6",
            borderRadius: 6,
            padding: "7px 12px",
            minWidth: 200,
            outline: "none",
          }}
        />

        <select
          className="search-input"
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          style={{
            border: "1px solid #3d6ba6",
            borderRadius: 6,
            padding: "7px 12px",
            outline: "none",
          }}
        >
          <option value="">Order by…</option>
          <option value="member_name">Name (A–Z)</option>
          <option value="-member_name">Name (Z–A)</option>
          <option value="dob">Age (Youngest first)</option>
          <option value="-dob">Age (Oldest first)</option>
        </select>

        <label
          className="small-muted"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#2b4e72",
          }}
        >
          <input
            type="checkbox"
            checked={onlyPld}
            onChange={(e) => setOnlyPld(e.target.checked)}
          />
          Only working PLD status
        </label>

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

      {/* LOADING */}
      {loading ? (
        <div
          className="table-spinner"
          style={{ padding: 20, textAlign: "center", color: "#2b4e72" }}
        >
          <span>Loading members…</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ marginTop: 8 }}>
          {error}
        </div>
      ) : rows.length === 0 ? (
        <p className="muted" style={{ marginTop: 8, color: "#6b7280" }}>
          No members found for this SHG.
        </p>
      ) : (
        <>
          {/* TABLE */}
          <div
            className="table-wrapper"
            style={{
              overflowX: "auto",
              border: "1px solid #e4ecf5",
              borderRadius: 8,
            }}
          >
            <table
              className="table table-compact"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
                fontSize: 14,
              }}
            >
              <thead style={{ background: "#3d6ba6", color: "#fff" }}>
                <tr>
                  <th style={{ width: 40, padding: 10 }}> </th>
                  <th style={{ padding: 10 }}>Member Name</th>
                  <th style={{ padding: 10 }}>Member Code</th>
                  <th style={{ padding: 10 }}>Age</th>
                  <th style={{ padding: 10 }}>Gender</th>
                  <th style={{ padding: 10 }}>Marital Status</th>
                  <th style={{ padding: 10 }}>Designation</th>
                  <th style={{ padding: 10 }}>Mobile</th>
                  <th style={{ padding: 10 }}>Religion</th>
                  <th style={{ padding: 10 }}>Social Category</th>
                  <th style={{ padding: 10 }}>Aadhaar No</th>
                  <th style={{ padding: 10 }}>Aadhaar Verified</th>
                  <th style={{ padding: 10 }}>PLD Status</th>
                  <th style={{ padding: 10 }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((m) => {
                  const code = m.member_code || m.lokos_member_code || m.id;

                  const isSelected = isMemberSelected(m);
                  const age = calculateAge(m.dob);

                  const phone =
                    (Array.isArray(m.member_phones) &&
                      m.member_phones.find((p) => p.is_default)?.phone_no) ||
                    (Array.isArray(m.member_phones) &&
                      m.member_phones[0]?.phone_no) ||
                    m.mobile ||
                    m.phone_no ||
                    "-";

                  const designation =
                    (Array.isArray(m.member_designations) &&
                      m.member_designations[0]?.designation) ||
                    "";

                  return (
                    <tr
                      key={code || `${m.member_name}-${Math.random()}`}
                      className={isSelected ? "row-selected" : ""}
                      style={{
                        background: isSelected ? "#a7c6ed" : "",
                        borderBottom: "1px solid #e4ecf5",
                      }}
                    >
                      <td style={{ padding: 8 }}>
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={(e) => handleToggleRow(m, e.target.checked)}
                        />
                      </td>

                      <td style={{ padding: 8 }}>{m.member_name || "-"}</td>
                      <td style={{ padding: 8 }}>{code || "-"}</td>
                      <td style={{ padding: 8 }}>{age || "-"}</td>
                      <td style={{ padding: 8 }}>{m.gender || "-"}</td>
                      <td style={{ padding: 8 }}>{m.marital_status || "-"}</td>
                      <td style={{ padding: 8 }}>{designation || "-"}</td>
                      <td style={{ padding: 8 }}>{phone}</td>
                      <td style={{ padding: 8 }}>{m.religion || "-"}</td>
                      <td style={{ padding: 8 }}>{m.social_category || "-"}</td>
                      <td style={{ padding: 8 }}>{m.aadhar_no || "-"}</td>
                      <td style={{ padding: 8 }}>
                        {m.aadhar_verified ? "Yes" : "No"}
                      </td>
                      <td style={{ padding: 8 }}>
                        {m.pld_status ? "Yes" : "No"}
                      </td>

                      <td style={{ padding: 8 }}>
                        <button
                          className="btn-sm btn-outline"
                          onClick={() => onSelectMember && onSelectMember(m)}
                          style={{
                            padding: "5px 10px",
                            border: "1px solid #3d6ba6",
                            background: "#fff",
                            color: "#2b4e72",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {meta && meta.total > meta.page_size && (
            <div
              className="pagination"
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                className="btn-sm btn-flat"
                disabled={meta.page <= 1}
                onClick={() => load(meta.page - 1)}
                style={{
                  padding: "6px 12px",
                  background: "#5a8cc2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Prev
              </button>

              <span style={{ color: "#2b4e72", fontWeight: 500 }}>
                Page {meta.page} of {totalPages}
              </span>

              <button
                className="btn-sm btn-flat"
                disabled={meta.page >= totalPages}
                onClick={() => load(meta.page + 1)}
                style={{
                  padding: "6px 12px",
                  background: "#5a8cc2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <style>{`.table-wrapper{
  border-radius:8px;
  overflow:hidden;
}

/* Table base */
.table{
  width:100%;
  border-collapse:collapse;
  background:#e4ecf5;
  font-size:14px;
}

/* Header */
.table thead{
  background:#3d6ba6;
  color:#fff;
}

.table th{
  padding:10px;
  text-align:left;
  font-weight:600;
}

/* Body rows */
.table tbody tr{
  background:#f8fbff;
  border-bottom:1px solid #d3e2f3;
}

/* Alternate row color */
.table tbody tr:nth-child(even){
  background:#edf4fb;
}

/* Hover effect */
.table tbody tr:hover{
  background:#a7c6ed;
  transition:background 0.2s ease;
}

/* Selected row */
.row-selected{
  background:#a7c6ed !important;
}

/* Table cells */
.table td{
  padding:10px;
  color:#1f2937;
}
.btnPrimaryHover:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.15);
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
`}</style>
    </div>
  );
}
