// src/pages/TMS/TRs/training_req_list.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../../api/axios";
import { getCanonicalRole } from "../../../../utils/roleUtils";
import TrainingRequestFilter from "./TrainingRequestFiliter";
import { FaFileSignature } from "react-icons/fa";

const CACHE_KEY = "tms_training_requests_cache_v1";
const TP_SELF_PARTNER_KEY = "tms_self_partner_id_v1";

/* ---------------- cache helpers ---------------- */

function saveCache(payload, meta = {}) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), payload, meta }),
    );
  } catch {
    return null;
  }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function fetchTrainingRequestsOnce(params = {}) {
  const response = await TMS_API.trainingRequestsList.list({
    ...params,
    page_size: 5000,
  });
  const responseData = response?.data;
  return Array.isArray(responseData)
    ? responseData
    : responseData?.results || [];
}

/* ---------------- partner resolver (SAFE & CACHED) ---------------- */

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  try {
    const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
    if (cached) return Number(cached);
  } catch {
    return null;
  }

  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });

    const results = resp?.data?.results || [];
    const partnerId = results[0]?.id || null;

    if (partnerId) {
      try {
        localStorage.setItem(TP_SELF_PARTNER_KEY, String(partnerId));
      } catch {
        // Ignore storage failures; the resolved partner remains usable.
      }
    }

    return partnerId;
  } catch {
    console.warn("Partner resolution failed (will retry on refresh)");
    return null;
  }
}

/* ========================================================= */

export default function TrainingRequestList() {
  const { user } = useContext(AuthContext) || {};

  const role = getCanonicalRole(user || {});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(() => loadCache()?.payload || []);
  // PAGINATION CHANGE START
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  // PAGINATION CHANGE END
  const [filters] = useState({
    status: "",
    level: "",
    training_type: "",
  });
  const [requestIdSearch, setRequestIdSearch] = useState("");

  const fetchKeyRef = useRef("");

  /* ---------------- geoscope ---------------- */

  async function ensureUserGeoscope() {
    try {
      const cached = JSON.parse(
        localStorage.getItem("ps_user_geoscope") || "null",
      );
      if (cached) return cached;
    } catch {
      // Use the API fallback when cached geoscope data is invalid.
    }

    try {
      const resp = await LOOKUP_API.userGeoscopeByUserId(user?.id);
      if (resp?.data) {
        localStorage.setItem("ps_user_geoscope", JSON.stringify(resp.data));
        return resp.data;
      }
    } catch {
      // Return no geoscope when the lookup is unavailable.
    }
    return null;
  }

  async function resolvePartnerId(userId) {
    if (!userId) return null;

    try {
      const resp = await TMS_API.parentPartner();
      if (resp?.data) {
        const partnerId = resp.data.partner_id;
        return partnerId;
      }
    } catch {
      // Return no parent partner when the lookup is unavailable.
    }
    return null;
  }

  /* ---------------- main fetch ---------------- */

  async function fetchRequests() {
    if (!user?.id) return;

    setLoading(true);
    try {
      const params = { page_size: 5000 };
      const geoscope = await ensureUserGeoscope();

      if (role === "bmmu" && geoscope?.blocks?.[0])
        params.block_id = geoscope.blocks[0];

      if (role === "dmmu" && geoscope?.districts?.[0])
        params.district_id = geoscope.districts[0];

      if (role === "training_partner") {
        const partnerId = await resolveTrainingPartnerIdForUser(user.id);
        if (!partnerId) {
          setRequests([]);
          setLoading(false);
          return;
        }
        params.partner_id = partnerId;
      }

      if (role === "dtp" && geoscope?.districts?.[0]) {
        const partnerId = await resolvePartnerId(user.id);
        if (!partnerId) {
          setRequests([]);
          setLoading(false);
          return;
        }
        params.district_id = geoscope.districts[0];
        params.partner_id = partnerId;
      }
      const items = await fetchTrainingRequestsOnce(params);

      setRequests(items);
      saveCache(items, { userId: user.id, role });
    } catch (e) {
      console.error("fetch training requests failed", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchKey = `${user?.id || ""}:${role}`;
    if (role !== "smmu" && user?.id && fetchKeyRef.current !== fetchKey) {
      fetchKeyRef.current = fetchKey;
      fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, user?.id]);

  /* training req list */
  async function fetchRequestsWithFilters(appliedFilters = {}) {
    if (!user?.id) return;

    setLoading(true);
    try {
      let params = {
        page_size: 5000,
        ...Object.fromEntries(
          Object.entries(appliedFilters).filter(
            ([, v]) => v !== "" && v !== false,
          ),
        ),
      };

      const geoscope = await ensureUserGeoscope();

      if (role === "bmmu" && geoscope?.blocks?.[0])
        params.block_id = geoscope.blocks[0];

      if (role === "dmmu" && geoscope?.districts?.[0])
        params.district_id = geoscope.districts[0];

      if (role === "training_partner") {
        const partnerId = await resolveTrainingPartnerIdForUser(user.id);
        if (!partnerId) {
          setRequests([]);
          setLoading(false);
          return;
        }
        params.partner_id = partnerId;
      }
      if (role === "dtp" && geoscope?.districts?.[0]) {
        const partnerId = await resolvePartnerId(user.id);
        if (!partnerId) {
          setRequests([]);
          setLoading(false);
          return;
        }
        params.district_id = geoscope.districts[0];
        params.partner_id = partnerId;
      }

      // ✅ theme_id now passes straight through
      const items = await fetchTrainingRequestsOnce(params);

      setRequests(items);
    } catch (e) {
      console.error("Filtered fetch failed", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- filtered view ---------------- */

  // const filtered = useMemo(() => {
  //   return requests.filter((r) => {
  //     if (filters.status && r.status !== filters.status) return false;
  //     if (filters.level && r.level !== filters.level) return false;
  //     if (filters.training_type && r.training_type !== filters.training_type)
  //       return false;
  //     return true;
  //   });
  // }, [requests, filters]);

  const filtered = useMemo(() => {
    const result = requests.filter((r) => {
      if (
        requestIdSearch.trim() &&
        !String(r.id || "")
          .toLowerCase()
          .includes(requestIdSearch.trim().toLowerCase())
      )
        return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.level && r.level !== filters.level) return false;
      if (filters.training_type && r.training_type !== filters.training_type)
        return false;
      return true;
    });

    // PAGINATION CHANGE
    setCurrentPage(1);

    return result;
  }, [requests, filters, requestIdSearch]);

  // PAGINATION CHANGE START

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  /* ---------------- render helpers ---------------- */

  const handleExportExcel = () => {
    if (!filtered.length) {
      alert("No training requests available to export.");
      return;
    }

    const escapeCell = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const headers = [
      "ID",
      "Theme",
      "Plan",
      "Level",
      "Status",
      "Partner",
      "District",
      "Block",
      "Participant Count",
      "Financial Year",
    ];
    const rows = filtered.map((r) => [
      r.id,
      r.theme_name,
      r.training_plan_name,
      r.level,
      r.status,
      r.partner_name,
      r.district_name,
      r.block_name,
      r.participant_count,
      r.financial_year,
    ]);
    const table = [
      "<table><thead><tr>",
      headers.map((header) => `<th>${escapeCell(header)}</th>`).join(""),
      "</tr></thead><tbody>",
      rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td>${escapeCell(cell)}</td>`)
              .join("")}</tr>`,
        )
        .join(""),
      "</tbody></table>",
    ].join("");
    const blob = new Blob(
      [`<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`],
      { type: "application/vnd.ms-excel;charset=utf-8;" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Training_Requests.xls";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="app-shell">
      <div className="content-area">
        <div className="main-area">
          {/* <TopNav
          left={
            <div className="app-title">Pragati Setu — Training Requests</div>
          }
        /> */}

          <main
            style={{
              padding: 18,
              minHeight: "100vh",
            }}
          >
            {/* <div className="dashboard-header">
            <h2 className="dashboard-title">{roleMessage}</h2>
          </div> */}

            <div
              style={{
                width: "100%",
                maxWidth: "none",
                margin: "0 auto",
              }}
              className="training-request-page"
            >
              {/* FILTER */}
              <div style={{ marginBottom: 14 }}>
                <TrainingRequestFilter
                  user={user}
                  lockedTheme={role === "smmu"}
                  onApply={fetchRequestsWithFilters}
                />
              </div>

              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 12,
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 8,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#2b4e72",
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  <FaFileSignature /> Training Requests
                </h2>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#2b4e72",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Search by ID
                    <input
                      type="search"
                      value={requestIdSearch}
                      onChange={(event) =>
                        setRequestIdSearch(event.target.value)
                      }
                      placeholder="Enter Training Request ID No."
                      aria-label="Search training request by ID"
                      style={{
                        width: 190,
                        minHeight: 36,
                        padding: "8px 10px",
                        border: "1px solid #9db9d8",
                        borderRadius: 6,
                        color: "#1e3a5f",
                        outline: "none",
                      }}
                    />
                  </label>
                  <button className="btnPrimary" onClick={handleExportExcel}>
                    Export to Excel
                  </button>
                </div>
              </div>

              {/* TABLE CARD */}
              <div
                style={{
                  background: "#fff",
                  padding: 12,
                  borderRadius: 10,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
                className="admin-training-table-card"
              >
                <div
                  className="training-table-scroll"
                  style={{
                    height: "auto",
                    minHeight: 0,
                    overflow: "visible",
                  }}
                >
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Theme</th>
                        <th>Plan</th>
                        <th>Level</th>
                        <th>Status</th>
                        <th>Partner</th>
                        <th>District</th>
                        <th>Block</th>
                        <th>Participant Count</th>
                        <th>Financial Year</th>
                        <th>Actions</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={10}>Loading…</td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={10}>No training requests</td>
                        </tr>
                      ) : (
                        // filtered.map((r) => (
                        paginatedData.map((r) => (
                          <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.theme_name}</td>
                            <td>{r.training_plan_name}</td>
                            <td>{r.level}</td>
                            <td>{r.status}</td>
                            <td>{r.partner_name}</td>
                            <td>{r.district_name}</td>
                            <td>{r.block_name}</td>
                            <td>{r.participant_count}</td>
                            <td>{r.financial_year}</td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  className="btnView"
                                  onClick={() =>
                                    navigate(
                                      `/admin/trainingrequestdetail/${r.id}?from=training-requests`,
                                    )
                                  }
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* ========================= */}
                  {/* 🔽 ADDED: MOBILE CARD VIEW */}
                  {/* ========================= */}

                  <div className="mobile-card-list">
                    {loading ? (
                      <div className="mobile-card">Loading…</div>
                    ) : filtered.length === 0 ? (
                      <div className="mobile-card">No training requests</div>
                    ) : (
                      paginatedData.map((r) => (
                        <div key={r.id} className="mobile-card">
                          <div>
                            <strong>ID:</strong> {r.id}
                          </div>
                          <div>
                            <strong>Theme:</strong> {r.theme_name}
                          </div>
                          <div>
                            <strong>Plan:</strong> {r.training_plan_name}
                          </div>
                          <div>
                            <strong>Status:</strong> {r.status}
                          </div>
                          <div>
                            <strong>Partner:</strong> {r.partner_name}
                          </div>
                          <div>
                            <strong>District:</strong> {r.district_name}
                          </div>
                          <div>
                            <strong>Block:</strong> {r.block_name}
                          </div>
                          <div>
                            <strong>Participant Count:</strong>{" "}
                            {r.participant_count}
                          </div>
                          <div>
                            <strong>Financial Year:</strong> {r.financial_year}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              marginTop: "8px",
                            }}
                          >
                            <button
                              className="btnView"
                              onClick={() =>
                                navigate(
                                  `/admin/trainingrequestdetail/${r.id}?from=training-requests`,
                                )
                              }
                              style={{ flex: 1, marginTop: 0 }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {/* PAGINATION CONTROLS */}
                <div
                  className="training-pagination"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 12,
                    minHeight: 42,
                  }}
                >
                  <div style={{ color: "#2b4e72", fontSize: 14 }}>
                    Page {currentPage} of {totalPages || 1}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btnPage"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`btnPage ${currentPage === i + 1 ? "activePage" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className="btnPage"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS */}
            <style>{`

/* BUTTON */
.btnPrimary{
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnPrimary:hover{
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}

/* VIEW BUTTON */
.btnView{
  background:#5a8cc2;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:5px 12px;
  cursor:pointer;
    transition:all .25s ease;
}

.btnView:hover{
  transform: translateY(-6px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.15);
}

/* TABLE */
.training-table{
  width:100%;
  height:auto;
  border-collapse:collapse;
  table-layout:fixed;
  font-size:13px;
}

/* HEADER */
.training-table thead{
  background:#3d6ba6;
  color:white;
}

.training-table th{
  padding:9px 7px;
  text-align:left;
  font-weight:600;
  text-align:center;
  justify-content:center;
  white-space:normal;
  line-height:1.2;
}

/* BODY */
.training-table td{
  padding:8px 7px;
  border-bottom:1px solid #e4ecf5;
  text-align:center;
  justify-content:center;
  vertical-align:middle;
  line-height:1.2;
  overflow-wrap:anywhere;
}

.training-table th:nth-child(1),
.training-table td:nth-child(1){ width:5%; }
.training-table th:nth-child(2),
.training-table td:nth-child(2){ width:10%; }
.training-table th:nth-child(3),
.training-table td:nth-child(3){ width:14%; }
.training-table th:nth-child(4),
.training-table td:nth-child(4){ width:8%; }
.training-table th:nth-child(5),
.training-table td:nth-child(5){ width:10%; }
.training-table th:nth-child(6),
.training-table td:nth-child(6){ width:19%; }
.training-table th:nth-child(7),
.training-table td:nth-child(7){ width:10%; }
.training-table th:nth-child(8),
.training-table td:nth-child(8){ width:10%; }
.training-table th:nth-child(9),
.training-table td:nth-child(9){ width:7%; }
.training-table th:nth-child(10),
.training-table td:nth-child(10){ width:9%; }
.training-table th:nth-child(11),
.training-table td:nth-child(11){ width:8%; }
.training-table th:nth-child(12),
.training-table td:nth-child(12){ display:none; }

/* ROW BACKGROUND */
.training-table tbody tr{
  background:#f8fbff;
}

/* ALTERNATE ROW */
.training-table tbody tr:nth-child(even){
  background:#edf4fb;
}

/* HOVER */
.training-table tbody tr:hover{
  background:#dbeafe;
  transition:background .2s;
}

.training-table td:nth-child(6){
  font-size:12px;
}

.admin-training-table-card{
  width:100%;
}

.training-pagination{
  border-top:1px solid #e4ecf5;
  color:#2b4e72;
}

/* LOADING / EMPTY */
.training-table tbody td{
  color:#1f2937;
}

/* DELETE BUTTON */
.btnDelete{
  background:#ef4444;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:5px 12px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnDelete:hover{
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.25);
}

/* PAGINATION BUTTON */
.btnPage{
  background:#e4ecf5;
  border:none;
  padding:6px 10px;
  border-radius:6px;
  cursor:pointer;
  color:#2b4e72;
  transition:all .2s ease;
}

.btnPage:hover{
  background:#a7c6ed;
}

.btnPage:disabled{
  opacity:0.5;
  cursor:not-allowed;
}

/* ACTIVE PAGE */
.activePage{
  background:#3d6ba6;
  color:#fff;
}

/* HEADER */
.dashboard-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.dashboard-title {
  margin-top: 25px;
  margin-left: 30px;
  color: #2b4e72;
}

/* ========================= */
/* 🔽 ADDED: MOBILE CARD SYSTEM */
/* ========================= */

/* Hide cards on desktop */
.mobile-card-list{
  display:none;
}

.content-area {
  display: flex;
  flex: 1;
}

/* ========================= */
/* 🔽 MOBILE RESPONSIVE */
/* ========================= */

@media (max-width: 768px){

  .training-request-page{
    padding:0 !important;
  }

  .training-table-scroll{
    height:auto !important;
    min-height:0 !important;
    overflow:visible !important;
  }

  .training-pagination{
    flex-wrap:wrap;
    justify-content:center !important;
  }

  /* 🔥 FORCE HIDE TABLE COMPLETELY */
  .training-table{
    display:none !important; /* 🔽 IMPORTANT FIX */
  }

  /* SHOW CARD VIEW */
  .mobile-card-list{
    display:block;
  }

  .mobile-card{
    background:#f8fbff;
    border:1px solid #a7c6ed;
    border-radius:10px;
    padding:12px;
    margin-bottom:12px;
    box-shadow:0 4px 10px rgba(0,0,0,0.05);
    font-size:13px;
    color:#2b4e72;
  }

  .mobile-card div{
    margin-bottom:4px;
  }

  /* full width button in card */
  .mobile-card .btnView{
    width:100%;
    margin-top:8px;
  }

  /* pagination stacking */
  .btnPage{
    padding:6px 8px;
    font-size:12px;
  }

  /* header adjust */
  .dashboard-title{
    margin-left:10px; /* 🔽 ADDED */
    font-size:18px;   /* 🔽 ADDED */
  }
}

`}</style>
          </main>
        </div>
      </div>
    </div>
  );
}
