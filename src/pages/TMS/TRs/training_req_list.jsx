// src/pages/TMS/TRs/training_req_list.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import TrainingReqListFilter from "./training_req_list_filters";
import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils";
import TRListExport from "./TRListExport";
import TRConvert from "./TRConvert";

const CACHE_KEY = "tms_training_requests_cache_v1";
const USER_MAP_KEY = "tms_user_map_v1";
const PARTNER_MAP_KEY = "tms_partner_map_v1";
const PLAN_MAP_KEY = "tms_plan_map_v1";
const TP_SELF_PARTNER_KEY = "tms_self_partner_id_v1";

/* ---------------- cache helpers ---------------- */
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
  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const [themes, setThemes] = useState([]);
  const rowsPerPage = 10;

  const [filters, setFilters] = useState({
    status: "",
    level: "",
    training_type: "",
    financial_year: "2026-27", // Preselected Default
  });

  const [userMap, setUserMap] = useState(() => loadMap(USER_MAP_KEY));
  const [partnerMap, setPartnerMap] = useState(() => loadMap(PARTNER_MAP_KEY));
  const [planMap, setPlanMap] = useState(() => loadMap(PLAN_MAP_KEY));
  const [convertTrId, setConvertTrId] = useState(null);
  const didRunRef = useRef(false);

  // SURGICAL ADDITION: Multi-select state & handlers
  const [selectedTrs, setSelectedTrs] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTrs(requests.map((r) => r.id));
    } else {
      setSelectedTrs([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedTrs((prev) => [...prev, id]);
    } else {
      setSelectedTrs((prev) => prev.filter((trId) => trId !== id));
    }
  };

  const handleMarkBacklog = async () => {
    if (
      !window.confirm(
        `Are you sure you want to mark ${selectedTrs.length} request(s) as Backlog?`,
      )
    )
      return;
    setLoading(true);
    try {
      // Patch is_old=True for all selected TRs concurrently
      await Promise.all(
        selectedTrs.map((id) =>
          api.patch(`/tms/training-requests/${id}/`, { is_old: true }),
        ),
      );
      alert("Successfully marked as Backlog Batches.");
      setSelectedTrs([]);
      setRefreshToken((t) => t + 1); // Refresh the list automatically
    } catch (error) {
      console.error(error);
      alert("Failed to mark requests as Backlog.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to verify if all selected items are NOT STATE level
  const selectedTrObjects = requests.filter((r) => selectedTrs.includes(r.id));
  const isSelectionValidForBacklog =
    selectedTrs.length > 0 &&
    selectedTrObjects.every((r) => {
      const isNonState = String(r.level).toUpperCase() !== "STATE";
      const isBatching = String(r.status).toUpperCase() === "BATCHING";

      // Roles 1, 2, 3 → Only NON-backlog requests
      if ([1, 2, 3].includes(Number(user?.role_id))) {
        return isNonState && r.is_old === false && isBatching;
      }

      // Role 13 → Only backlog requests
      if (Number(user?.role_id) === 13) {
        return isNonState && r.is_old === true && isBatching;
      }

      // Other roles
      return false;
    });

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

  async function resolvePartnerId(userId) {
    if (!userId) return null;

    try {
      const resp = await TMS_API.parentPartner();
      if (resp?.data) {
        const partnerId = resp.data.partner_id;
        return partnerId;
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
  async function fetchRequestsWithFilters(
    appliedFilters = {},
    overridePage = null,
  ) {
    if (!user?.id) return;

    const targetPage = overridePage !== null ? overridePage : currentPage;

    setLoading(true);
    try {
      let params = {
        limit: rowsPerPage,
        offset: (targetPage - 1) * rowsPerPage,
        ...Object.fromEntries(
          Object.entries(appliedFilters).filter(
            ([, v]) => v !== "" && v !== false,
          ),
        ),
      };

      const geoscope = await ensureUserGeoscope();

      if (role === "smmu") {
        const myTheme = themes.find(
          (t) => Number(t.expert) === Number(user?.id),
        );

        if (myTheme) {
          params.theme_id = myTheme.id;
        }
      }

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

      const resp = await TMS_API.trainingRequestsList.list(params);
      const items = resp?.data?.results || [];

      setTotalCount(resp?.data?.count || 0);
      setRequests(items);
      setSelectedTrs([]);
      await fetchAndStoreLookupMaps(items);
    } catch (e) {
      console.error("Filtered fetch failed", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- fetch all for export ---------------- */
  async function fetchAllForExport() {
    if (!user?.id) return [];
    try {
      let params = {
        limit: 50000, // MAX LIMIT
        offset: 0,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "" && v !== false),
        ),
      };

      const geoscope = await ensureUserGeoscope();

      if (role === "smmu") {
        const myTheme = themes.find(
          (t) => Number(t.expert) === Number(user?.id),
        );
        if (myTheme) params.theme_id = myTheme.id;
      }

      if (role === "bmmu" && geoscope?.blocks?.[0])
        params.block_id = geoscope.blocks[0];

      if (role === "dmmu" && geoscope?.districts?.[0])
        params.district_id = geoscope.districts[0];

      if (role === "training_partner") {
        const partnerId = await resolveTrainingPartnerIdForUser(user.id);
        if (!partnerId) return [];
        params.partner_id = partnerId;
      }
      if (role === "dtp" && geoscope?.districts?.[0]) {
        const partnerId = await resolvePartnerId(user.id);
        if (!partnerId) return [];
        params.district_id = geoscope.districts[0];
        params.partner_id = partnerId;
      }

      const resp = await TMS_API.trainingRequestsList.list(params);
      return resp?.data?.results || [];
    } catch (e) {
      console.error("Export fetch failed", e);
      return [];
    }
  }

  // Trigger API call when page or refresh token changes
  useEffect(() => {
    fetchRequestsWithFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken, currentPage]);

  /* ---------------- pagination helper ---------------- */
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 7) {
        pages.push(1, 2, 3, 4, 5, 6, 7, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          2,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          2,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

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
      setRefreshToken((t) => t + 1);
    } catch (error) {
      console.error("Deletion failed:", error);
      alert(
        error?.response?.data?.detail ||
          "Failed to delete the training request.",
      );
    }
  };

  /* ---------------- render helpers ---------------- */
  useEffect(() => {
    async function loadThemes() {
      try {
        const tRes = await TMS_API.trainingThemes.list({
          page_size: 100,
        });

        const allThemes = tRes?.data?.results || [];

        if (role === "smmu") {
          const myTheme = allThemes.find(
            (t) => Number(t.expert) === Number(user?.id),
          );

          if (myTheme) {
            setThemes([myTheme]);
            setFilters((prev) => ({ ...prev, theme_id: myTheme.id }));
            fetchRequestsWithFilters({ ...filters, theme_id: myTheme.id });
          } else {
            setThemes([]);
          }
        } else {
          setThemes(allThemes);
        }
      } catch (e) {
        console.error("Theme load failed", e);
      }
    }

    if (user?.id) {
      loadThemes();
    }
  }, [user?.id, role]);

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
          <main
            style={{
              padding: 18,
              minHeight: "100vh",
            }}
          >
            <div
              style={{
                width: "100%", // Horizontal stretch
                margin: "10px 0",
              }}
            >
              {/* FILTER */}
              <div style={{ marginBottom: 14 }}>
                <TrainingReqListFilter
                  user={user}
                  themes={themes}
                  lockedTheme={role === "smmu"}
                  onApply={(newFilters) => {
                    const mergedFilters = {
                      ...newFilters,
                      financial_year:
                        newFilters.financial_year ||
                        filters.financial_year ||
                        "2026-27",
                    };
                    setFilters(mergedFilters);
                    setCurrentPage(1);
                    fetchRequestsWithFilters(mergedFilters, 1);
                  }}
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

                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                >
                  {/* SURGICAL ADDITION: Backlog Action Buttons */}
                  {isSelectionValidForBacklog &&
                    [1, 2, 3].includes(Number(user?.role_id)) && (
                      <button
                        className="Backlogbtn"
                        style={{ background: "#f59e0b" }}
                        onClick={handleMarkBacklog}
                      >
                        Mark for Backlog Batches
                      </button>
                    )}

                  {isSelectionValidForBacklog &&
                    Number(user?.role_id) === 13 && (
                      <button
                        className="Backlogbtn"
                        onClick={() => navigate("#")}
                      >
                        Create Backlog batch
                      </button>
                    )}

                  {/* EXPORT BUTTON */}
                  <TRListExport fetchData={fetchAllForExport} />

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
                    maxHeight: "100%",
                    overflow: "auto",
                  }}
                >
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>
                          <input
                            type="checkbox"
                            checked={
                              requests.length > 0 &&
                              selectedTrs.length === requests.length
                            }
                            onChange={handleSelectAll}
                            style={{ cursor: "pointer" }}
                          />
                        </th>
                        <th>S.No.</th>
                        <th>Theme</th>
                        <th>Plan</th>
                        <th>Level</th>
                        <th>Status</th>
                        <th>Partner</th>
                        <th>District</th>
                        <th>Block</th>
                        <th>Onboarded Participant(s)</th>
                        <th>Enrolled Participant(s)</th>
                        <th>Financial Year</th>
                        <th>ID</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={12}>Loading…</td>
                        </tr>
                      ) : requests.length === 0 ? (
                        <tr>
                          <td colSpan={12}>No training requests</td>
                        </tr>
                      ) : (
                        requests.map((r, index) => (
                          <tr
                            key={r.id}
                            className={
                              r.is_old === true ? "backlog-training-row" : ""
                            }
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedTrs.includes(r.id)}
                                onChange={(e) => handleSelectOne(e, r.id)}
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                            <td>
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </td>
                            <td>{r.theme_name}</td>
                            <td>{r.training_plan_name}</td>
                            <td>{r.level}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <span
                                  className={`status-badge status-${String(r.status).toLowerCase()}`}
                                >
                                  {r.status}
                                </span>

                                {r.is_old === true && (
                                  <span className="backlog-badge">
                                    ★ Backlog
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>{r.partner_name}</td>
                            <td>{r.district_name}</td>
                            <td>{r.block_name}</td>
                            <td>{r.participant_count}</td>
                            <td>{r.enrolled_count}</td>
                            <td>{r.financial_year}</td>
                            <td>
                              <strong>{r.id}</strong>
                            </td>
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
                                {r.financial_year === "2025-26" &&
                                  (role === "dmmu" || role === "smmu") &&
                                  r.status === "BATCHING" && (
                                    <button
                                      className="btnConvert"
                                      onClick={() => setConvertTrId(r.id)}
                                    >
                                      Convert
                                    </button>
                                  )}
                                {/* {((role === "dmmu" && r.level !== "STATE") ||
                                  role === "smmu") &&
                                  r.status === "BATCHING" && (
                                    <button
                                      className="btnDelete"
                                      onClick={() => handleDeleteRequest(r.id)}
                                      style={{ flex: 1 }}
                                    >
                                      Delete
                                    </button>
                                  )} */}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* ========================= */}
                  {/* MOBILE CARD VIEW          */}
                  {/* ========================= */}
                  <div className="mobile-card-list">
                    {loading ? (
                      <div className="mobile-card">Loading…</div>
                    ) : requests.length === 0 ? (
                      <div className="mobile-card">No training requests</div>
                    ) : (
                      requests.map((r, index) => (
                        <div
                          key={r.id}
                          className={`mobile-card ${
                            r.is_old === true ? "backlog-mobile-card" : ""
                          }`}
                        >
                          {r.is_old === true && (
                            <div className="backlog-mobile-header">
                              <span className="backlog-badge">★ Backlog</span>
                            </div>
                          )}
                          <div
                            style={{
                              marginBottom: "8px",
                              paddingBottom: "8px",
                              borderBottom: "1px solid #e4ecf5",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTrs.includes(r.id)}
                              onChange={(e) => handleSelectOne(e, r.id)}
                              style={{ transform: "scale(1.2)" }}
                            />
                            <strong>Select Request</strong>
                          </div>
                          <div>
                            <strong>S.No:</strong>{" "}
                            {(currentPage - 1) * rowsPerPage + index + 1}
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
                          <div>
                            <strong>ID:</strong> {r.id}
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
                            {r.financial_year === "2025-26" &&
                              r.status === "BATCHING" && (
                                <button
                                  className="btnConvert"
                                  onClick={() => setConvertTrId(r.id)}
                                  style={{ flex: 1, marginTop: 0 }}
                                >
                                  Convert
                                </button>
                              )}
                            {/* {((role === "dmmu" && r.level !== "STATE") ||
                              role === "smmu") &&
                              r.status === "BATCHING" && (
                                <button
                                  className="btnDelete"
                                  onClick={() => handleDeleteRequest(r.id)}
                                  style={{ flex: 1 }}
                                >
                                  Delete
                                </button>
                              )} */}
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
                      marginTop: 16,
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div style={{ color: "#2b4e72", fontSize: 14 }}>
                      Page <strong>{currentPage}</strong> of{" "}
                      <strong>{totalPages || 1}</strong>
                      <span
                        style={{
                          marginLeft: 8,
                          color: "#6c757d",
                          fontSize: 12,
                        }}
                      >
                        (Total Records: {totalCount})
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="btnPage"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        Prev
                      </button>

                      {getPageNumbers().map((num, i) => (
                        <button
                          key={i}
                          className={`btnPage ${
                            currentPage === num ? "activePage" : ""
                          }`}
                          onClick={() =>
                            typeof num === "number" && setCurrentPage(num)
                          }
                          disabled={num === "..."}
                          style={{
                            cursor: num === "..." ? "default" : "pointer",
                            minWidth: 32,
                          }}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        className="btnPage"
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Next
                      </button>

                      {/* SURGICAL ADDITION: Jump to Page Search */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginLeft: 12,
                        }}
                      >
                        <input
                          type="number"
                          value={jumpPage}
                          onChange={(e) => setJumpPage(e.target.value)}
                          placeholder="Go to"
                          style={{
                            width: 65,
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "1px solid #a7c6ed",
                            outline: "none",
                            fontSize: 13,
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const p = parseInt(jumpPage, 10);
                              if (!isNaN(p) && p >= 1 && p <= totalPages) {
                                setCurrentPage(p);
                                setJumpPage("");
                              }
                            }
                          }}
                        />
                        <button
                          className="btnPrimary"
                          style={{ padding: "6px 12px" }}
                          onClick={() => {
                            const p = parseInt(jumpPage, 10);
                            if (!isNaN(p) && p >= 1 && p <= totalPages) {
                              setCurrentPage(p);
                              setJumpPage("");
                            }
                          }}
                        >
                          Go
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      {/* SURGICAL ADDITION: TR Convert Modal */}
      {convertTrId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => {
            setConvertTrId(null);
            setRefreshToken((t) => t + 1); // Refresh the list automatically when closing
          }}
        >
          <div
            style={{ width: "100%", maxWidth: "800px", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setConvertTrId(null);
                setRefreshToken((t) => t + 1);
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#1e3a8a",
                zIndex: 10,
              }}
              title="Close"
            >
              ✖
            </button>
            <TRConvert trId={convertTrId} />
          </div>
        </div>
      )}
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

/* SURGICAL ADDITION: Convert Button Styles */
.btnConvert {
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
  transition: all .25s ease;
}
.btnConvert:hover {
  background: #059669;
  transform: translateY(-4px);
  box-shadow: 0 8px 14px rgba(16, 185, 129, 0.15);
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

.status-badge{
  display:inline-block;
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  letter-spacing:.3px;
  text-transform:uppercase;
  min-width:100px;
  text-align:center;
  border:1px solid transparent;
}

/* BATCHING - Reddish Orange */
.status-batching{
  background:#ffedd5;
  color:#c2410c;
  border-color:#fb923c;
}

/* COMPLETED - Green */
.status-completed{
  background:#dcfce7;
  color:#166534;
  border-color:#86efac;
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

.btnPage:hover:not(:disabled){
  background:#a7c6ed;
}

.btnPage:disabled{
  opacity:0.5;
  cursor:not-allowed;
}

/* ACTIVE PAGE */
.activePage{
  background:#3d6ba6 !important;
  color:#fff !important;
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
    display:none !important; 
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
    margin-left:10px; 
    font-size:18px;   
  }
}

/* =========================================
   BACKLOG TRAINING REQUEST HIGHLIGHT
========================================= */

/* Desktop table row */
.training-table tbody tr.backlog-training-row {
  background: #fffbeb !important;
  box-shadow: inset 0 0 0 2px #d4a017;
}

/* Gold border for every cell */
.training-table tbody tr.backlog-training-row td {
  border-top: 2px solid #d4a017;
  border-bottom: 2px solid #d4a017;
}

/* Left gold edge */
.training-table tbody tr.backlog-training-row td:first-child {
  border-left: 2px solid #d4a017;
  border-radius: 8px 0 0 8px;
}

/* Right gold edge */
.training-table tbody tr.backlog-training-row td:last-child {
  border-right: 2px solid #d4a017;
  border-radius: 0 8px 8px 0;
}

/* Keep backlog identity visible on hover */
.training-table tbody tr.backlog-training-row:hover {
  background: #fef3c7 !important;
}

/* Backlog Gold Badge */
.backlog-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  padding: 4px 10px;

  background: linear-gradient(
    135deg,
    #fff7cc,
    #facc15,
    #d4a017
  );

  color: #713f12;
  border: 1px solid #b8860b;
  border-radius: 999px;

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  box-shadow: 0 2px 5px rgba(180, 130, 0, 0.2);
}

/* Mobile backlog card */
.backlog-mobile-card {
  background: #fffbeb !important;
  border: 2px solid #d4a017 !important;

  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(212, 160, 23, 0.2);
}

/* Mobile badge positioning */
.backlog-mobile-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.Backlogbtn {
background-color: #16a34a;
color: #ffffff;
border: 1px solid #15803d;
padding: 8px 16px;
border-radius: 6px;
font-size: 13px;
font-weight: 600;
cursor: pointer;
display: inline-flex;
align-items: center;
transition: all 0.2s;
height: 32px;
}

.Backlogbtn:hover:not(:disabled) {
background-color: #15803d;
box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2);
transform: translateY(-1px);
}
`}</style>
    </div>
  );
}
