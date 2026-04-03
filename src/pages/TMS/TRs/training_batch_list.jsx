import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils"; // or same file
/* ===================================================== */

const CACHE_KEY = "tms_training_batches_cache_v1";
const GEOSCOPE_KEY = "ps_user_geoscope";

function getTpPartnerCacheKey(userId) {
  return `tp_self_partner_id_${userId}`;
}

function getCacheKey(scope) {
  return `${CACHE_KEY}_${scope || "default"}`;
}

function saveCache(scope, payload) {
  try {
    localStorage.setItem(
      getCacheKey(scope),
      JSON.stringify({ ts: Date.now(), payload }),
    );
  } catch {}
}

function loadCache(scope) {
  try {
    const raw = localStorage.getItem(getCacheKey(scope));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ---------------- partner resolver ---------------- */

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  const cacheKey = `tp_self_partner_id_${userId}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return Number(cached);
  } catch {}

  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });

    const pid = resp?.data?.results?.[0]?.id || null;

    if (pid) {
      localStorage.setItem(cacheKey, String(pid));
    }
    return pid;
  } catch {
    return null;
  }
}

/* ===================================================== */

export default function TrainingBatchList() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";
  const role = getCanonicalRole(user || {});
  const { id: requestId } = useParams();
  const isRequestScoped = Boolean(requestId);
  const navigate = useNavigate();

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  const [tpPartnerId, setTpPartnerId] = useState(null);
  const [tpPartnerName, setTpPartnerName] = useState(null);
  // ⭐ PAGINATION CHANGE
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ⭐ PAGINATION CHANGE
  const totalPages = Math.ceil(batches.length / rowsPerPage);

  // ⭐ PAGINATION CHANGE
  const paginatedBatches = batches.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  /* ---------------- filters ---------------- */

  const [filters, setFilters] = useState({
    mandal_id: "",
    district_category_id: "",
    district_id: "",
    block_id: "",
    aspirational_only: false,

    centre_id: "",
    partner: "",

    status: "",
    training_type: "",
    batch_type: "",

    theme: "",
    training_plan: "",
  });

  /* ---------------- lookups ---------------- */

  const [mandals, setMandals] = useState([]);
  const [districtCategories, setDistrictCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [centres, setCentres] = useState([]);
  const [partners, setPartners] = useState([]);
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);

  const didInitRef = useRef(false);

  /* ===================================================== */
  /* ---------------- geoscope helpers ---------------- */

  function getGeoscope() {
    try {
      const raw = localStorage.getItem(GEOSCOPE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function safeFirst(arr) {
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  }

  function getDefaultScopeParams() {
    if (requestId) return { request: requestId };

    const geo = getGeoscope() || {};
    const blockId = geo.block_id || safeFirst(geo.blocks);
    const districtId = geo.district_id || safeFirst(geo.districts);

    // 🔒 BMMU → BLOCK-LOCKED
    if (role === "bmmu" && blockId) {
      return { block_id: blockId };
    }

    // 🔒 DMMU → DISTRICT-LOCKED
    if (role === "dmmu" && districtId) {
      return { district_id: districtId };
    }

    // 🔒 TRAINING PARTNER → SELF-CREATED ONLY
    if (role === "training_partner") {
      return {
        created_by: user?.id,
      };
    }

    return {};
  }

  function getScopeKey() {
    if (requestId) return `req_${requestId}`;
    if (role === "training_partner") return `tp_${user?.id}`;
    if (role === "bmmu") return "bmmu";
    if (role === "dmmu") return "dmmu";
    return role || "global";
  }

  /* ===================================================== */
  /* ---------------- load lookups ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const [dRes, tRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 100 }),
          TMS_API.trainingThemes.list({ page_size: 100 }),
        ]);
        setDistricts(dRes?.data?.results || []);
        setThemes(tRes?.data?.results || []);

        if (role === "smmu") {
          const [mRes, dcRes] = await Promise.all([
            LOOKUP_API.mandals.list({ page_size: 100 }),
            LOOKUP_API.district_categories.list(),
          ]);
          setMandals(mRes?.data?.results || []);
          setDistrictCategories(dcRes?.data?.results || []);
        }

        if (role !== "training_partner" && role !== "tpcp") {
          const pRes = await TMS_API.trainingPartners.list({ page_size: 100 });
          setPartners(pRes?.data?.results || []);
        }

        if (role === "training_partner") {
          const pid = await resolveTrainingPartnerIdForUser(user.id);

          if (pid) {
            setTpPartnerId(pid);

            // OPTIONAL: fetch partner name explicitly
            try {
              const pRes = await TMS_API.trainingPartners.retrieve(pid);
              setTpPartnerName(pRes?.data?.name || "Your Organisation");
            } catch {
              setTpPartnerName("Your Organisation");
            }

            const cRes = await TMS_API.trainingPartnerCentres.list({
              partner: pid,
            });
            setCentres(cRes?.data?.results || []);

            setFilters((f) => ({
              ...f,
              partner: String(pid),
              centre_id: "",
            }));
          }
        }
      } catch (e) {
        console.error("Lookup load failed", e);
      }
    })();
  }, [role, user]);

  useEffect(() => {
    if (role !== "dmmu") return;

    const geo = getGeoscope() || {};
    const dmmuDistrictId = geo.district_id || safeFirst(geo.districts);

    if (!dmmuDistrictId) return;

    setFilters((f) => {
      // do not override if already set
      if (f.district_id) return f;

      return {
        ...f,
        district_id: dmmuDistrictId,
        block_id: "",
        aspirational_only: false,
      };
    });
  }, [role]);

  /* ---------------- cascading ---------------- */

  useEffect(() => {
    if (role === "bmmu") return;
    if (!filters.district_id) {
      setBlocks([]);
      return;
    }

    LOOKUP_API.blocksByDistrict(filters.district_id)
      .then((r) => {
        let data = r?.data?.results || [];
        if (filters.aspirational_only) {
          data = data.filter((b) => b.is_aspirational === 1);
        }
        setBlocks(data);
      })
      .catch(() => setBlocks([]));
  }, [filters.district_id, filters.aspirational_only]);

  useEffect(() => {
    if (!filters.theme) {
      setPlans([]);
      return;
    }

    TMS_API.trainingPlans
      .list({ theme: filters.theme })
      .then((r) => setPlans(r?.data?.results || []))
      .catch(() => setPlans([]));
  }, [filters.theme]);

  /* ===================================================== */
  /* ---------------- fetch batches ---------------- */

  async function fetchBatches() {
    if (!user?.id) return;

    setLoading(true);
    try {
      let finalParams = {};

      // ✅ REQUEST-SCOPED MODE (NO FILTERS, NO ROLE LOGIC)
      if (isRequestScoped) {
        finalParams = {
          request_id: requestId,
          page_size: 500,
        };
      } else {
        const baseParams = getDefaultScopeParams();
        let effectiveFilters = filters;

        // 🔒 HARD ROLE LOCKS (unchanged)
        if (role === "bmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(
              ([k]) =>
                ![
                  "district_id",
                  "block_id",
                  "mandal_id",
                  "district_category_id",
                ].includes(k),
            ),
          );
        }

        if (role === "dmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([k]) => k !== "district_id"),
          );
        }

        if (role === "training_partner") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([k]) => k !== "partner"),
          );
        }

        finalParams = {
          ...baseParams,
          ...Object.fromEntries(
            Object.entries(effectiveFilters).filter(
              ([, v]) => v !== "" && v !== false,
            ),
          ),
          page_size: 500,
        };
      }

      const qs = new URLSearchParams(finalParams).toString();
      const resp = await api.get(`/tms/batches-list/?${qs}`);
      const items = resp?.data?.results || [];

      setBatches(items);
      setCurrentPage(1);
      // ❌ DO NOT CACHE request-scoped results
      if (!isRequestScoped) {
        saveCache(getScopeKey(), items);
      }
    } catch (e) {
      console.error("Batch fetch failed", e);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  // 🚀 Auto-fetch for BMMU (no geographical filters, block-scoped only)
  useEffect(() => {
    if (role === "bmmu") {
      fetchBatches();
    }
  }, [role]);

  useEffect(() => {
    if (role === "training_partner" && tpPartnerId) {
      fetchBatches();
    }
  }, [role, tpPartnerId]);

  /* ---------------- initial load ---------------- */

  useEffect(() => {
    if (!user?.id || didInitRef.current || isRequestScoped) return;

    // 🚫 BMMU & TP are auto-fetched elsewhere
    if (role === "bmmu" || role === "training_partner") return;

    didInitRef.current = true;

    const cached = loadCache(getScopeKey());
    if (cached?.payload) setBatches(cached.payload);
    else fetchBatches();
  }, [user?.id, role, requestId]);

  useEffect(() => {
    if (!requestId || !user?.id) return;
    fetchBatches();
  }, [requestId, user?.id]);

  /* ===================================================== */
  /* ---------------- render helpers ---------------- */

  const renderCentreName = (c) => c?.venue_name || c?.partner?.name || "-";

  /* ===================================================== */

  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />

      <div className="main-area">
        {/* <TopNav
          left={
            <div className="app-title">Pragati Setu — Training Batches</div>
          }
        /> */}

        <div className="dashboard-header">
          <h2 className="dashboard-title">{roleMessage}</h2>
        </div>

        <main style={{ padding: 18 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* ================= FILTERS ================= */}

            {!isRequestScoped && (
              // ⭐ CHANGE: filter-panel class added
              <div className="filter-panel">
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap", // ✅ force single row
                      gap: 12,
                      alignItems: "center",
                      whiteSpace: "nowrap", // ✅ prevent breaking
                    }}
                  >
                    {role === "smmu" && (
                      <>
                        <select
                          className="input"
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              mandal_id: e.target.value,
                            }))
                          }
                        >
                          <option value="">Mandal</option>
                          {mandals.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>

                        <select
                          className="input"
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              district_category_id: e.target.value,
                            }))
                          }
                        >
                          <option value="">District Category</option>
                          {districtCategories.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {role !== "bmmu" && (
                      <select
                        className="input"
                        value={filters.district_id}
                        disabled={role === "dmmu"}
                        onChange={(e) => {
                          if (role === "dmmu") return;

                          setBlocks([]);
                          setFilters((f) => ({
                            ...f,
                            district_id: e.target.value,
                            block_id: "",
                            aspirational_only: false,
                          }));
                        }}
                      >
                        <option value="">District</option>
                        {districts.map((d) => (
                          <option key={d.district_id} value={d.district_id}>
                            {d.district_name_en}
                          </option>
                        ))}
                      </select>
                    )}

                    {role !== "bmmu" && (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.aspirational_only}
                          onChange={(e) =>
                            setFilters((f) => ({
                              ...f,
                              aspirational_only: e.target.checked,
                              block_id: "",
                            }))
                          }
                        />
                        Aspirational
                      </label>
                    )}

                    {role !== "bmmu" && filters.district_id && (
                      <select
                        key={filters.district_id}
                        className="input"
                        value={filters.block_id}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            block_id: e.target.value,
                          }))
                        }
                      >
                        <option value="">Block</option>
                        {blocks.map((b) => (
                          <option key={b.block_id} value={b.block_id}>
                            {b.block_name_en}
                          </option>
                        ))}
                      </select>
                    )}

                    {role === "training_partner" && (
                      <select
                        className="input"
                        value={filters.centre_id}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            centre_id: e.target.value,
                          }))
                        }
                      >
                        <option value="">Centre</option>
                        {centres.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.venue_name}
                          </option>
                        ))}
                      </select>
                    )}
                    {role !== "training_partner" && role !== "tpcp" && (
                      <select
                        className="input"
                        value={filters.partner}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, partner: e.target.value }))
                        }
                      >
                        <option value="">Training Partner</option>
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap", //  force single row
                      gap: 12,
                      alignItems: "center",
                      whiteSpace: "nowrap", //  prevent breaking
                    }}
                  >
                    <select
                      className="input"
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          theme: e.target.value,
                          training_plan: "",
                        }))
                      }
                    >
                      <option value="">Training Theme</option>
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.theme_name}
                        </option>
                      ))}
                    </select>

                    {plans.length > 0 && (
                      <select
                        className="input"
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            training_plan: e.target.value,
                          }))
                        }
                      >
                        <option value="">Training Plan</option>
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.training_name}
                          </option>
                        ))}
                      </select>
                    )}

                    <select
                      className="input"
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      <option value="">Status</option>
                      {[
                        "DRAFT",
                        "PENDING",
                        "ONGOING",
                        "SCHEDULED",
                        "COMPLETED",
                        "REJECTED",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <select
                      className="input"
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          training_type: e.target.value,
                        }))
                      }
                    >
                      <option value="">Participant</option>
                      <option value="BENEFICIARY">Beneficiary</option>
                      <option value="TRAINER">Trainer</option>
                    </select>

                    <select
                      className="input"
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          batch_type: e.target.value,
                        }))
                      }
                    >
                      <option value="">Batch Type</option>
                      <option value="SEPARATE">Separate</option>
                      <option value="COMBINED">Combined</option>
                    </select>
                  </div>
                  <div
                    style={{
                      flexBasis: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button className="btn btn-primary" onClick={fetchBatches}>
                      Fetch Batches
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TABLE ================= */}

            {/* ⭐ CHANGE: table-wrapper class */}
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Batch Code</th>
                    <th>Status</th>
                    <th>Participant</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Type</th>
                    <th>Centre</th>
                    <th>Partner</th>
                    <th>Block</th>
                    <th>District</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={12}>Loading…</td>
                    </tr>
                  ) : batches.length === 0 ? (
                    <tr>
                      <td colSpan={12}>No batches found</td>
                    </tr>
                  ) : (
                    // batches.map((b, i) => (
                    // ⭐ PAGINATION CHANGE
                    paginatedBatches.map((b, i) => (
                      <tr key={b.id}>
                        <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
                        <td>{b.code}</td>

                        {/* ⭐ CHANGE: status badge */}
                        <td>
                          <span
                            className={`status-badge status-${String(
                              b.status,
                            ).toLowerCase()}`}
                          >
                            {b.status}
                          </span>
                        </td>

                        <td>{b.request?.training_type}</td>
                        <td>{b.start_date}</td>
                        <td>{b.end_date}</td>
                        <td>{b.batch_type}</td>
                        <td>{renderCentreName(b.centre)}</td>
                        <td>{b.centre?.partner?.name || "-"}</td>
                        <td>{b.request?.block?.block_name_en || "-"}</td>
                        <td>{b.request?.district?.district_name_en || "-"}</td>

                        <td>
                          <button
                            className="btn-sm btn-flat"
                            onClick={() =>
                              navigate(`/tms/batch-detail/${b.id}`)
                            }
                          >
                            View
                          </button>

                          {String(b.status).toUpperCase() === "COMPLETED" && (
                            <button
                              className="btn-sm btn-flat"
                              onClick={() =>
                                navigate(`/tms/batch-certificate/${b.id}`)
                              }
                            >
                              Closure
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* ⭐ PAGINATION CHANGE */}
            <div className="pagination">
              <button
                className="btn-sm btn-flat"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              <span className="pagination-info">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                className="btn-sm btn-flat"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
      <style>{`
/* ================= FILTER PANEL ================= */

.filter-panel{
  background:#fff;
  padding:16px;
  border-radius:10px;
  border:2px solid #3d6ba6;
  box-shadow:0 6px 16px rgba(0,0,0,0.05);
  margin-bottom: 20px
}

.input{
  padding:7px 10px;
  border-radius:6px;
  border:1px solid #a7c6ed;
  background:#f8fbff;
  min-width:140px;
  transition:all .25s ease;
}

.input:focus{
  outline:none;
  border-color:#3d6ba6;
  box-shadow:0 0 0 2px rgba(61,107,166,0.15);
}


/* ================= BUTTONS ================= */

.btn{
  padding:7px 14px;
  border-radius:6px;
  cursor:pointer;
  border:none;
  font-weight:600;
  transition:all .25s ease;
}

.btn-primary{
  background:#3d6ba6;
  color:#fff;
}

.btn-primary:hover{
  background:#5a8cc2;
  transform:translateY(-2px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}

.btn-sm{
  padding:5px 10px;
  font-size:13px;
}

.btn-flat{
  background:#5a8cc2;
  color:#fff;
  border-radius:5px;
  margin-bottom:6px
}

.btn-flat:hover{
  background:#3d6ba6;
  transform:translateY(-2px);
  box-shadow:0 4px 10px rgba(0,0,0,0.15);
}


/* ================= TABLE ================= */

.table{
  width:100%;
  border-collapse:collapse;
  font-size:14px;
}

.table thead{
  background:#3d6ba6;
  color:#fff;
  position:sticky;
  top:0;
}

.table th{
  padding:10px;
  text-align:left;
  border-right:1px solid rgba(255,255,255,0.2);
}

.table th:last-child{
  border-right:none;
}

.table td{
  padding:10px;
  border-bottom:1px solid #e4ecf5;
  border-right:1px solid #e4ecf5;
}

.table td:last-child{
  border-right:none;
}

.table tbody tr:nth-child(even){
  background:#f7fbff;
}

.table tbody tr:hover{
  background:#e4ecf5;
  transition:background .2s ease;
}


/* ================= TABLE CONTAINER ================= */

.table-wrapper{
  background:#fff;
  border-radius:10px;
  border:2px solid #3d6ba6;
  box-shadow:0 6px 16px rgba(0,0,0,0.05);
  overflow:auto;
  max-height:600px;
}


/* ================= STATUS BADGES ================= */

.status-badge{
  padding:3px 8px;
  border-radius:5px;
  font-weight:600;
  font-size:12px;
}

.status-draft{
  background: #e7d63d;
  color:#2b4e72;
}

.status-pending{
  background: #ec1414;
  color: #ffffff;
}

.status-ongoing{
  background: #FFF000;
  color:#155724;
}

.status-scheduled{
  background: #33bbd3;
  color:#0c5460;
}

.status-completed{
  background: #50ec74;
  color:#155724;
}

.status-rejected{
  background: #3556eb;
  color:#721c24;
}
/* ================= PAGINATION ================= */

.pagination{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:14px;
  padding:12px;
}

.pagination-info{
  font-weight:600;
  color:#2b4e72;
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

/* ================= FILTER RESPONSIVE FIX (CSS ONLY) ================= */

/* TARGET BOTH FILTER ROWS WITHOUT ADDING CLASS */
.filter-panel > div > div {
  width: 100%;
}

/*  TABLET VIEW */
@media (max-width: 1024px){

  /* override inline flex nowrap */
  .filter-panel > div > div {
    flex-wrap: wrap !important;           /*  CHANGE */
    white-space: normal !important;       /*  CHANGE */
    gap: 10px !important;                /*  CHANGE */
  }

  .input{
    flex: 1 1 160px;                     /*  CHANGE */
    min-width: 160px;
  }

}

/*  MOBILE VIEW */
@media (max-width: 768px){

  .input{
    height: 36px !important;        /*  FIX: control height */
    padding: 4px 8px !important;    /*  FIX: reduce padding */
    line-height: 1.2;               /*  FIX */
  }

  select.input{
    height: 36px !important;        /*  FIX for dropdown */
  }

  /* prevent stretching */
  .filter-panel > div > div > *{
    flex: unset !important;         /*  FIX: stop stretching */
  }

}

/*  SMALL MOBILE */
@media (max-width: 480px){

  .filter-panel{
                     /*  CHANGE */
  }

  .input{
    font-size: 13px; /*  CHANGE */
  }

}
`}</style>
    </div>
  );
}
