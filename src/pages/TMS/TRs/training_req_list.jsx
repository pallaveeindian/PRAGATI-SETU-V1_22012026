// src/pages/TMS/TRs/training_req_list.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import TrainingReqListFilter from "./training_req_list_filters";

import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils"; // or same file

const CACHE_KEY = "tms_training_requests_cache_v1";
const USER_MAP_KEY = "tms_user_map_v1";
const PARTNER_MAP_KEY = "tms_partner_map_v1";
const PLAN_MAP_KEY = "tms_plan_map_v1";
const TP_SELF_PARTNER_KEY = "tms_self_partner_id_v1";

/* ---------------- cache helpers ---------------- */
``;
function saveCache(payload, meta = {}) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), payload, meta }),
    );
  } catch {}
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadMap(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function saveMap(key, map) {
  try {
    localStorage.setItem(key, JSON.stringify(map || {}));
  } catch {}
}

/* ---------------- partner resolver (SAFE & CACHED) ---------------- */

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  try {
    const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
    if (cached) return Number(cached);
  } catch {}

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
      } catch {}
    }

    return partnerId;
  } catch (e) {
    console.warn("Partner resolution failed (will retry on refresh)");
    return null;
  }
}

/* ========================================================= */

export default function TrainingRequestList() {
  const { user } = useContext(AuthContext) || {};

  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";

  const role = getCanonicalRole(user || {});
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(() => loadCache()?.payload || []);
  const [refreshToken, setRefreshToken] = useState(0);
  // PAGINATION CHANGE START
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  // PAGINATION CHANGE END
  const [filters, setFilters] = useState({
    status: "",
    level: "",
    training_type: "",
  });

  const [userMap, setUserMap] = useState(() => loadMap(USER_MAP_KEY));
  const [partnerMap, setPartnerMap] = useState(() => loadMap(PARTNER_MAP_KEY));
  const [planMap, setPlanMap] = useState(() => loadMap(PLAN_MAP_KEY));

  const didRunRef = useRef(false);

  /* ---------------- geoscope ---------------- */

  async function ensureUserGeoscope() {
    try {
      const cached = JSON.parse(
        localStorage.getItem("ps_user_geoscope") || "null",
      );
      if (cached) return cached;
    } catch {}

    try {
      const resp = await LOOKUP_API.userGeoscopeByUserId(user?.id);
      if (resp?.data) {
        localStorage.setItem("ps_user_geoscope", JSON.stringify(resp.data));
        return resp.data;
      }
    } catch {}
    return null;
  }

  /* ---------------- lookup maps ---------------- */

  async function fetchAndStoreLookupMaps(items = []) {
    try {
      const userIds = new Set();
      const partnerIds = new Set();
      const planIds = new Set();

      items.forEach((r) => {
        if (r.created_by) userIds.add(r.created_by);
        if (r.partner) partnerIds.add(r.partner);
        if (r.training_plan) planIds.add(r.training_plan);
      });

      const missingUsers = [...userIds].filter((i) => !userMap[i]);
      const missingPartners = [...partnerIds].filter((i) => !partnerMap[i]);
      const missingPlans = [...planIds].filter((i) => !planMap[i]);

      const [users, partners, plans] = await Promise.all([
        Promise.all(
          missingUsers.map(async (id) => {
            const r = await LOOKUP_API.users.list({
              search: id,
              fields: "username",
            });
            return { id, v: r?.data?.results?.[0]?.username };
          }),
        ),
        Promise.all(
          missingPartners.map(async (id) => {
            const r = await TMS_API.trainingPartners.list({
              id,
              fields: "name",
            });
            return { id, v: r?.data?.results?.[0]?.name };
          }),
        ),
        Promise.all(
          missingPlans.map(async (id) => {
            const r = await TMS_API.trainingPlans.list({
              id,
              fields: "training_name",
            });
            return {
              id,
              v: r?.data?.results?.[0]?.training_name,
            };
          }),
        ),
      ]);

      const um = { ...userMap };
      users.forEach((x) => (um[x.id] = x.v));

      const pm = { ...partnerMap };
      partners.forEach((x) => (pm[x.id] = x.v));

      const plm = { ...planMap };
      plans.forEach((x) => (plm[x.id] = x.v));

      setUserMap(um);
      setPartnerMap(pm);
      setPlanMap(plm);

      saveMap(USER_MAP_KEY, um);
      saveMap(PARTNER_MAP_KEY, pm);
      saveMap(PLAN_MAP_KEY, plm);
    } catch {}
  }

  /* ---------------- main fetch ---------------- */

  async function fetchRequests(force = false) {
    if (!user?.id) return;

    setLoading(true);
    try {
      const params = { page_size: 500 };
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

      const resp = await TMS_API.trainingRequestsList.list(params);
      const items = resp?.data?.results || [];

      setRequests(items);
      saveCache(items, { userId: user.id, role });
      await fetchAndStoreLookupMaps(items);
    } catch (e) {
      console.error("fetch training requests failed", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  /* training req list */
  async function fetchRequestsWithFilters(appliedFilters = {}) {
    if (!user?.id) return;

    setLoading(true);
    try {
      let params = {
        page_size: 500,
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

      // ✅ theme_id now passes straight through
      const resp = await TMS_API.trainingRequestsList.list(params);
      const items = resp?.data?.results || [];

      setRequests(items);
      await fetchAndStoreLookupMaps(items);
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
      if (filters.status && r.status !== filters.status) return false;
      if (filters.level && r.level !== filters.level) return false;
      if (filters.training_type && r.training_type !== filters.training_type)
        return false;
      return true;
    });

    // PAGINATION CHANGE
    setCurrentPage(1);

    return result;
  }, [requests, filters]);

  // PAGINATION CHANGE START

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  // PAGINATION CHANGE END

  /* ---------------- TR Deletion Handler Actions ---------------- */
  const handleDeleteRequest = async (requestId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Training Request #${requestId}?`,
      )
    )
      return;
    try {
      await TMS_API.deleteTrainingRequest(requestId);
      alert("Training Request deleted successfully.");
      setRefreshToken((t) => t + 1); // Forces table data to re-fetch
    } catch (error) {
      console.error("Deletion failed:", error);
      alert(
        error?.response?.data?.detail ||
          "Failed to delete the training request.",
      );
    }
  };

  /* ---------------- render helpers ---------------- */

  const renderUsername = (id) => userMap[id] || id || "-";
  const renderPartnerName = (id) => partnerMap[id] || id || "-";
  const renderTrainingName = (id) => planMap[id] || id || "-";

  /* ---------------- UI ---------------- */

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
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
                maxWidth: 1200,
                margin: "20px auto",
              }}
            >
              {/* FILTER */}
              <div style={{ marginBottom: 14 }}>
                <TrainingReqListFilter
                  user={user}
                  onApply={fetchRequestsWithFilters}
                />
              </div>

              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 8,
                }}
              >
                <h2 style={{ margin: 0, color: "#2b4e72" }}>
                  Training Requests
                </h2>

                <div style={{ marginLeft: "auto" }}>
                  <button
                    className="btnPrimary"
                    onClick={() => {
                      localStorage.removeItem(CACHE_KEY);
                      localStorage.removeItem(TP_SELF_PARTNER_KEY);
                      setRefreshToken((t) => t + 1);
                    }}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* TABLE CARD */}
              <div
                style={{
                  background: "#fff",
                  padding: 14,
                  borderRadius: 10,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    maxHeight: 520,
                    overflow: "auto",
                  }}
                >
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Theme</th>
                        <th>Plan</th>
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
                                    navigate(`/tms/tr-detail/${r.id}`)
                                  }
                                >
                                  View
                                </button>
                                {role === "dmmu" && r.status === "BATCHING" && (
                                  <button
                                    className="btnDelete"
                                    onClick={() => handleDeleteRequest(r.id)}
                                  >
                                    Delete
                                  </button>
                                )}
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
                              onClick={() => navigate(`/tms/tr-detail/${r.id}`)}
                              style={{ flex: 1, marginTop: 0 }}
                            >
                              View
                            </button>
                            {role === "dmmu" && r.status === "BATCHING" && (
                              <button
                                className="btnDelete"
                                onClick={() => handleDeleteRequest(r.id)}
                                style={{ flex: 1 }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* PAGINATION CONTROLS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
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
  border-collapse:collapse;
  font-size:14px;
}

/* HEADER */
.training-table thead{
  background:#3d6ba6;
  color:white;
}

.training-table th{
  padding:10px;
  text-align:left;
  font-weight:600;
  text-align:center;
  justify-content:center;  
}

/* BODY */
.training-table td{
  padding:10px;
  border-bottom:1px solid #e4ecf5;
  text-align:center;
  justify-content:center;  
}

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
  background:#a7c6ed;
  transition:background .2s;
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
          <Footer />
        </div>
      </div>
    </div>
  );
}
