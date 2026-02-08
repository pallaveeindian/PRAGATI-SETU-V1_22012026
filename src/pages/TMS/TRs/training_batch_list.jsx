import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

/* ===================================================== */

const CACHE_KEY = "tms_training_batches_cache_v1";
const GEOSCOPE_KEY = "ps_user_geoscope";
const TP_SELF_PARTNER_KEY = "tp_self_partner_id";

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

  try {
    const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
    if (cached) return Number(cached);
  } catch {}

  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });
    const pid = resp?.data?.results?.[0]?.id || null;

    if (pid) {
      localStorage.setItem(TP_SELF_PARTNER_KEY, String(pid));
    }
    return pid;
  } catch {
    return null;
  }
}

/* ===================================================== */

export default function TrainingBatchList() {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});
  const { id: requestId } = useParams();
  const isRequestScoped = Boolean(requestId);
  const navigate = useNavigate();

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  const tpInitRef = useRef(false);
  const [tpPartnerId, setTpPartnerId] = useState(null); 
  const [tpPartnerName, setTpPartnerName] = useState(null); 

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
          const cRes = await TMS_API.trainingPartnerCentres.list({
            partner: user?.partner,
          });
          setCentres(cRes?.data?.results || []);
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

    setFilters(f => {
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

  useEffect(() => {
    if (role !== "training_partner" || !user?.id || tpInitRef.current) return;

    tpInitRef.current = true;

    (async () => {
      const pid = await resolveTrainingPartnerIdForUser(user.id);
      if (!pid) return;

      setTpPartnerId(pid);

      // get name from already-loaded partners list
      const pname =
        partners.find(p => String(p.id) === String(pid))?.name ||
        "Your Organisation";

      setTpPartnerName(pname);

      setFilters(f => ({
        ...f,
        partner: String(pid),
        centre_id: "",
      }));
    })();
  }, [role, user?.id, partners]);

  /* ---------------- cascading ---------------- */

  useEffect(() => {
    if (role === "bmmu") return;
    if (!filters.district_id) {
      setBlocks([]);
      return;
    }

    LOOKUP_API.blocksByDistrict(filters.district_id).then((r) => {
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
                !["district_id", "block_id", "mandal_id", "district_category_id"].includes(k)
            )
          );
        }

        if (role === "dmmu") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([k]) => k !== "district_id")
          );
        }

        if (role === "training_partner") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(([k]) => k !== "partner")
          );
        }

        finalParams = {
          ...baseParams,
          ...Object.fromEntries(
            Object.entries(effectiveFilters).filter(
              ([, v]) => v !== "" && v !== false
            )
          ),
          page_size: 500,
        };
      }

      const qs = new URLSearchParams(finalParams).toString();
      const resp = await api.get(`/tms/batches-list/?${qs}`);
      const items = resp?.data?.results || [];

      setBatches(items);

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

  const renderCentreName = (c) =>
    c?.venue_name || c?.partner?.name || "-";

  /* ===================================================== */

  return (
    <div className="app-shell">
      <LeftNav collapsed={navCollapsed} onToggle={() => setNavCollapsed(v => !v)} />

      <div className="main-area">
        <TopNav left={<div className="app-title">Pragati Setu — Training Batches</div>} />

        <main style={{ padding: 18 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            {/* ================= FILTERS ================= */}
            {!isRequestScoped && (
              <div style={{ background: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>

                  {role === "smmu" && (
                    <>
                      <select className="input" onChange={e => setFilters(f => ({ ...f, mandal_id: e.target.value }))}>
                        <option value="">Mandal</option>
                        {mandals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>

                      <select className="input" onChange={e => setFilters(f => ({ ...f, district_category_id: e.target.value }))}>
                        <option value="">District Category</option>
                        {districtCategories.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </>
                  )}

                  {role !== "bmmu" && (
                    <select
                      className="input"
                      value={filters.district_id}
                      disabled={role === "dmmu"}
                      onChange={e => {
                        if (role === "dmmu") return;

                        setBlocks([]);
                        setFilters(f => ({
                          ...f,
                          district_id: e.target.value,
                          block_id: "",
                          aspirational_only: false,
                        }));
                      }}
                    >
                      <option value="">District</option>
                      {districts.map(d => (
                        <option key={d.district_id} value={d.district_id}>
                          {d.district_name_en}
                        </option>
                      ))}
                    </select>
                  )}

                  {role !== "bmmu" && (
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="checkbox"
                      checked={filters.aspirational_only}
                      onChange={e => setFilters(f => ({ ...f, aspirational_only: e.target.checked, block_id: "", }))} />
                    Aspirational
                  </label>
                  )}

                  {role !== "bmmu" && filters.district_id && (
                    <select
                      key={filters.district_id}
                      className="input"
                      value={filters.block_id}
                      onChange={e =>
                        setFilters(f => ({ ...f, block_id: e.target.value }))
                      }
                    >
                      <option value="">Block</option>
                      {blocks.map(b => (
                        <option key={b.block_id} value={b.block_id}>
                          {b.block_name_en}
                        </option>
                      ))}
                    </select>
                  )}

                  {role === "training_partner" && (
                    <select className="input" onChange={e => setFilters(f => ({ ...f, centre_id: e.target.value }))}>
                      <option value="">Centre</option>
                      {centres.map(c => <option key={c.id} value={c.id}>{c.venue_name}</option>)}
                    </select>
                  )}

                  {/* Training Partner filter */}
                  {role !== "training_partner" && role !== "tpcp" && (
                    <select
                      className="input"
                      value={filters.partner}
                      onChange={e =>
                        setFilters(f => ({ ...f, partner: e.target.value }))
                      }
                    >
                      <option value="">Training Partner</option>
                      {partners.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <select className="input" onChange={e => setFilters(f => ({ ...f, theme: e.target.value, training_plan: "" }))}>
                    <option value="">Training Theme</option>
                    {themes.map(t => <option key={t.id} value={t.id}>{t.theme_name}</option>)}
                  </select>

                  {plans.length > 0 && (
                    <select className="input" onChange={e => setFilters(f => ({ ...f, training_plan: e.target.value }))}>
                      <option value="">Training Plan</option>
                      {plans.map(p => <option key={p.id} value={p.id}>{p.training_name}</option>)}
                    </select>
                  )}

                  <select className="input" onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                    <option value="">Status</option>
                    {["DRAFT","PENDING","ONGOING","SCHEDULED","COMPLETED","REJECTED"].map(s =>
                      <option key={s} value={s}>{s}</option>
                    )}
                  </select>

                  <select className="input" onChange={e => setFilters(f => ({ ...f, training_type: e.target.value }))}>
                    <option value="">Participant</option>
                    <option value="BENEFICIARY">Beneficiary</option>
                    <option value="TRAINER">Trainer</option>
                  </select>

                  <select className="input" onChange={e => setFilters(f => ({ ...f, batch_type: e.target.value }))}>
                    <option value="">Batch Type</option>
                    <option value="SEPARATE">Separate</option>
                    <option value="COMBINED">Combined</option>
                  </select>

                  <div style={{ flexBasis: "100%", display: "flex", justifyContent: "center" }}>
                    <button className="btn btn-primary" onClick={fetchBatches}>
                      Fetch Batches
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TABLE ================= */}

            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <table className="table table-compact">
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
                    <tr><td colSpan={12}>Loading…</td></tr>
                  ) : batches.length === 0 ? (
                    <tr><td colSpan={12}>No batches found</td></tr>
                  ) : (
                    batches.map((b, i) => (
                      <tr key={b.id}>
                        <td>{i + 1}</td>
                        <td>{b.code}</td>
                        <td>{b.status}</td>
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
                            onClick={() => navigate(`/tms/batch-detail/${b.id}`)}
                          >
                            View
                          </button>

                          {String(b.status).toUpperCase() === "COMPLETED" && (
                            <button
                              className="btn-sm btn-flat"
                              onClick={() => navigate(`/tms/batch-certificate/${b.id}`)}
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

          </div>
        </main>
      </div>
    </div>
  );
}
