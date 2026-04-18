// src/pages/TMS/SMMU/smmu_tms_dashboard.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import TmsLeftNav from "../layout/tms_LeftNav";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { useNavigate } from "react-router-dom";

import { getCanonicalRole } from "../../../utils/roleUtils";
import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils"; // or same file

const GEOSCOPE_KEY = "ps_user_geoscope";
const DASHBOARD_CACHE_KEY = "tms_smmu_dashboard_cache_v1";

/**
 * Resolve an "effective" user id:
 *  - prefer user.id from AuthContext
 *  - then check localStorage geoscope.user_id (DashboardHome pattern)
 *  - fallback: return null (server-side will use token user)
 */
async function resolveEffectiveUserId(user) {
  if (user && (user.id || user.user_id)) {
    return user.id ?? user.user_id;
  }
  try {
    const raw = window.localStorage.getItem(GEOSCOPE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user_id) return parsed.user_id;
    }
  } catch (e) {
    // ignore
  }
  try {
    const uid = user?.id ?? user?.user_id ?? null;
    if (uid) {
      const res = await LOOKUP_API.userGeoscopeByUserId(uid);
      const payload = res?.data ?? res;
      if (payload) {
        try {
          window.localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(payload));
        } catch (e) { }
        if (payload.user_id) return payload.user_id;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Simple "random step" number animation hook.
 * Animates from 0 (or from fromVal) to toVal with small random increments.
 */
function useAnimatedNumber(toVal, ms = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // animate only when toVal is number
    if (typeof toVal !== "number" || Number.isNaN(toVal)) {
      setDisplay(toVal);
      return;
    }
    // small no-op if value hasn't changed
    if (display === toVal && startedRef.current) return;

    const start = Date.now();
    const duration = ms;
    const from = Number(display) || 0;
    startedRef.current = true;

    function step() {
      const t = Math.min(1, (Date.now() - start) / duration);
      // ease-out-ish — use sqrt
      const eased = Math.sqrt(t);
      const current = Math.round(from + (toVal - from) * eased);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // ensure final
        setDisplay(toVal);
      }
    }
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toVal]);

  return display;
}

/**
 * SMMU Dashboard — KPIs + paginated Assigned Targets with progress column
 *
 * Only displays targets created by this SMMU user (uses created_by filter).
 * Uses caching for KPIs / lists in localStorage; a Refresh button forces re-fetch.
 */
export default function SmmuTmsDashboard() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  const [effectiveUserId, setEffectiveUserId] = useState(null);

  // real values
  const [kpis, setKpis] = useState({
    themes: 0,
    plans: 0,
    partners: 0,
    targets: 0,
  });
  const [loadingKpis, setLoadingKpis] = useState(false);

  // animated displays
  const animThemes = useAnimatedNumber(kpis.themes, 900);
  const animPlans = useAnimatedNumber(kpis.plans, 900);
  const animPartners = useAnimatedNumber(kpis.partners, 900);
  const animTargets = useAnimatedNumber(kpis.targets, 900);

  // Assigned targets table
  const [targets, setTargets] = useState([]);
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTargets, setTotalTargets] = useState(0);

  // helpers: local cache of partners/plans/themes to map ids -> names
  const [partnersMap, setPartnersMap] = useState({});
  const [plansMap, setPlansMap] = useState({});
  const [themesList, setThemesList] = useState([]);

  // cache control state
  const [usingCache, setUsingCache] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // load effective user on mount, then load dashboard data (preferring cache)
  useEffect(() => {
    (async () => {
      const uid = await resolveEffectiveUserId(user);
      setEffectiveUserId(uid);

      // try read cache
      const cacheRaw = localStorage.getItem(DASHBOARD_CACHE_KEY);
      if (cacheRaw) {
        try {
          const parsed = JSON.parse(cacheRaw);
          if (parsed && parsed.kpis) {
            setKpis(parsed.kpis);
            setPartnersMap(parsed.partnersMap || {});
            setPlansMap(parsed.plansMap || {});
            setThemesList(parsed.themesList || []);
            setUsingCache(true);
          }
        } catch (e) {
          console.warn("dashboard cache corrupted — ignoring");
          localStorage.removeItem(DASHBOARD_CACHE_KEY);
        }
      }

      // fetch targets (scoped) always (so table is fresh) but KPIs may use cache
      await fetchTargets(page, pageSize, uid);
      // If we didn't load cache, fetch Kpis now
      if (!cacheRaw) {
        await fetchKpis(uid, true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // re-fetch targets when page / pageSize changes
  useEffect(() => {
    fetchTargets(page, pageSize, effectiveUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, effectiveUserId]);

  // ---------- API data fetching / caching ----------

  // fetch Kpis and supporting lists; if saveCache=true store results in localStorage
  async function fetchKpis(uidForTargets = null, saveCache = false) {
    setLoadingKpis(true);
    try {
      // 1) themes list (we need theme ids to call plans per-theme)
      const themesRes = await TMS_API.trainingThemes.list({ limit: 500 }); // get all themes
      const themes =
        (themesRes?.data?.results ?? themesRes?.results ?? []) || [];
      // 2) for each theme fetch plans (theme-specific)
      const plansCollected = [];
      for (const th of themes) {
        try {
          const resp = await TMS_API.trainingPlans.list({
            theme: th.id,
            limit: 500,
          });
          const arr = (resp?.data?.results ?? resp?.results ?? []) || [];
          arr.forEach((p) => plansCollected.push(p));
        } catch (e) {
          console.warn("trainingPlans for theme", th.id, e);
        }
      }

      // 3) training partners (full list) to map ids->names and also count
      const partnersResp = await TMS_API.trainingPartners.list({
        limit: 10000,
      });
      const partnersArr =
        (partnersResp?.data?.results ?? partnersResp?.results ?? []) || [];

      // 4) targets count (scoped to this smmu user)
      const targetsParams = uidForTargets
        ? { created_by: uidForTargets, limit: 1 }
        : { limit: 1 };
      const targetsRes =
        await TMS_API.trainingPartnerTargets.list(targetsParams);

      const newKpis = {
        themes: themes.length,
        plans: plansCollected.length,
        partners:
          partnersResp?.data?.count ??
          partnersResp?.count ??
          partnersArr.length,
        targets: targetsRes?.data?.count ?? targetsRes?.count ?? 0,
      };

      // build maps
      const pMap = {};
      partnersArr.forEach((p) => {
        pMap[p.id] = p;
      });
      const plMap = {};
      plansCollected.forEach((p) => {
        plMap[p.id] = p;
      });

      setKpis(newKpis);
      setPartnersMap(pMap);
      setPlansMap(plMap);
      setThemesList(themes);

      if (saveCache) {
        try {
          localStorage.setItem(
            DASHBOARD_CACHE_KEY,
            JSON.stringify({
              ts: Date.now(),
              kpis: newKpis,
              partnersMap: pMap,
              plansMap: plMap,
              themesList: themes,
            }),
          );
          setUsingCache(true);
        } catch (e) {
          console.warn("failed to write dashboard cache", e);
        }
      } else {
        // if we're refreshing explicitly, replace cache with latest
        try {
          localStorage.setItem(
            DASHBOARD_CACHE_KEY,
            JSON.stringify({
              ts: Date.now(),
              kpis: newKpis,
              partnersMap: pMap,
              plansMap: plMap,
              themesList: themes,
            }),
          );
          setUsingCache(false);
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error("fetchKpis", err);
    } finally {
      setLoadingKpis(false);
    }
  }

  // fetch paginated targets (only those created_by effectiveUser)
  async function fetchTargets(pageToFetch = 1, limit = 10, uid = null) {
    setLoadingTargets(true);
    try {
      const offset = (pageToFetch - 1) * limit;
      const params = { limit, offset };
      if (uid) params.created_by = uid;

      const res = await TMS_API.trainingPartnerTargets.list(params);
      const data = res?.data ?? res;
      const results = data?.results ?? res?.results ?? [];

      // hydrate partner name & plan name from our maps (fallback to embedded fields)
      const hydrated = results.map((t) => {
        const partnerObj = partnersMap[t.partner] || t.partner_obj || null;
        const planObj =
          plansMap[t.training_plan] || t.training_plan_obj || null;
        return {
          ...t,
          partner_name:
            partnerObj?.name ||
            t.partner_name ||
            (partnerObj && partnerObj.name) ||
            String(t.partner),
          training_plan_name:
            planObj?.training_name || t.training_plan_name || null,
        };
      });

      setTargets(hydrated);
      setTotalTargets(data?.count ?? res?.count ?? 0);
    } catch (err) {
      console.error("fetchTargets", err);
      setTargets([]);
      setTotalTargets(0);
    } finally {
      setLoadingTargets(false);
    }
  }

  // Refresh button: force re-fetch of APIs and update cache
  async function handleRefresh() {
    setRefreshing(true);
    try {
      const uid = effectiveUserId;
      // refetch everything and save into cache
      await fetchKpis(uid, true);
      // after kpis/partners/plans updated, fetch paginated targets so table is consistent
      await fetchTargets(page, pageSize, uid);
      setUsingCache(false);
    } catch (e) {
      console.error("dashboard refresh failed", e);
    } finally {
      setRefreshing(false);
    }
  }

  // small helper to compute progress column
  function computeProgress(t) {
    const achieved =
      t.achieved_count ?? t.achieved_batches ?? t.achieved ?? null;
    const target = t.target_count ?? null;
    if (achieved == null || target == null || target === 0) return "—";
    const pct = Math.round((Number(achieved) / Number(target)) * 100);
    return `${achieved}/${target} (${pct}%)`;
  }

  // UI variables
  const totalPages = Math.max(1, Math.ceil(totalTargets / pageSize));
  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 18,
    boxShadow: "0 2px 8px rgba(10,20,40,0.04)",
    minWidth: 160,
  };
  const small = { color: "#6c757d", fontSize: 13 };

  // render partner cell: prefer partner_name set on target, otherwise map lookup
  function renderPartnerName(t) {
    if (t.partner_name) return t.partner_name;
    const pid = t.partner;
    if (partnersMap && partnersMap[pid])
      return partnersMap[pid].name || String(pid);
    return String(pid);
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav
          left={<div className="app-title">Pragati Setu — TMS (SMMU)</div>}
        /> */}

          <main className="dashboard-main">
            <div className="dashboard-container">
              {/* HEADER */}
              <div className="dashboard-header">
                {/* <h2 className="dashboard-title">{roleMessage}</h2> */}

                <div className="dashboard-user">
                  <div>
                    {user?.first_name ? `Welcome, ${user.first_name}` : "Welcome"}
                  </div>

                  <button
                    className="btn primary-btn"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing
                      ? "Refreshing…"
                      : usingCache
                        ? "Refresh Dashboard"
                        : "Refresh"}
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-number">
                    {loadingKpis ? "…" : animTargets}
                  </div>
                  <div className="kpi-title">My Partner Targets</div>
                  <div className="kpi-desc">Targets created by you</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-number">
                    {loadingKpis ? "…" : animPlans}
                  </div>
                  <div className="kpi-title">Training Plans</div>
                  <div className="kpi-desc">
                    Available modules (theme-specific)
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-number">
                    {loadingKpis ? "…" : animThemes}
                  </div>
                  <div className="kpi-title">Training Themes</div>
                  <div className="kpi-desc">Theme categories</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-number">
                    {loadingKpis ? "…" : animPartners}
                  </div>
                  <div className="kpi-title">Training Partners</div>
                  <div className="kpi-desc">Registered partners</div>
                </div>
              </div>

              {/* MAIN GRID */}
              <div className="dashboard-grid">
                {/* QUICK ACTIONS */}
                <div className="dashboard-card">
                  <h3>Quick Actions</h3>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => navigate("/tms/smmu/partner-targets")}
                      className="btn primary-btn"
                    >
                      Create Partner Targets
                    </button>

                    <button
                      onClick={() => navigate("/tms/batches-list/")}
                      className="btn primary-btn"
                    >
                      All Training Batches
                    </button>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <h4>Recent activity</h4>
                    <div className="small-text">
                      No recent activity tracked yet — use the Create Partner
                      Targets screen to assign targets to partners.
                    </div>
                  </div>
                </div>

                {/* TARGET LIST */}
                <aside className="dashboard-card">
                  <h4>My Assigned Targets</h4>

                  <div className="small-text" style={{ marginBottom: 12 }}>
                    Paginated list of targets created by you (progress = targets
                    vs achieved).
                  </div>

                  <div style={{ maxHeight: 360, overflow: "auto" }}>
                    {loadingTargets ? (
                      <div className="small-text">Loading targets…</div>
                    ) : targets.length ? (
                      <table className="targets-table">
                        <thead>
                          <tr>
                            <th>Partner</th>
                            <th>Scope</th>
                            <th style={{ width: 120 }}>FY</th>
                            <th style={{ width: 140 }}>Progress</th>
                          </tr>
                        </thead>

                        <tbody>
                          {targets.map((t) => (
                            <tr key={t.id}>
                              <td>{renderPartnerName(t)}</td>

                              <td>
                                {t.target_type}

                                {t.target_type === "MODULE" &&
                                  (t.training_plan_name ||
                                    (plansMap[t.training_plan] &&
                                      plansMap[t.training_plan].training_name))
                                  ? ` — ${t.training_plan_name ||
                                  plansMap[t.training_plan].training_name
                                  }`
                                  : t.theme
                                    ? ` — ${t.theme}`
                                    : ""}

                                {t.target_type === "DISTRICT" && t.district_name
                                  ? ` — ${t.district_name}`
                                  : ""}
                              </td>

                              <td>{t.financial_year || "—"}</td>

                              <td>{computeProgress(t)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="small-text">No assigned targets.</div>
                    )}
                  </div>

                  {/* PAGINATION */}
                  <div className="pagination">
                    <button
                      className="btn primary-btn"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Prev
                    </button>

                    <div className="small-text">
                      Page {page} / {totalPages}
                    </div>

                    <button
                      className="btn primary-btn"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>

                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="input-outline"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                    </select>
                  </div>
                </aside>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`/* MAIN DASHBOARD */

 .content-area {
  display: flex;
  flex: 1;              /*  pushes footer down */
  min-width: 0;         /*  prevents overflow bug */
}

.dashboard-main {
  padding: 18px;
  flex: 1;
}

.dashboard-container {
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 16px;
}

/* HEADER */
.dashboard-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.dashboard-title {
  margin: 0;
  color: #2b4e72;
}

.dashboard-user {
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
  color: #5a8cc2;
  font-size: 13px;
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.kpi-card {
  background: #fff;
  border: 2px solid #a7c6ed;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s ease;
}

.kpi-card:hover {
  background: #e4ecf5;
}

.kpi-number {
  font-size: 28px;
  font-weight: 700;
  color: #2b4e72;
}

.kpi-title {
  margin-top: 6px;
  font-weight: 700;
  color: #3d6ba6;
}

.kpi-desc {
  font-size: 12px;
  color: #5a8cc2;
}

/* MAIN GRID */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
}

/* CARDS */
.dashboard-card {
  background: #fff;
  border-radius: 10px;
  border: 2px solid #a7c6ed;
  padding: 16px;
}

/* QUICK ACTION BUTTON */
.primary-btn {
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.primary-btn:hover {
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}

/* TABLE */
.targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.targets-table thead {
  background: #e4ecf5;
}

.targets-table th {
  text-align: left;
  padding: 8px 6px;
  border-bottom: 2px solid #a7c6ed;
  color: #2b4e72;
}

.targets-table td {
  padding: 8px 6px;
  border-bottom: 1px solid #e4ecf5;
}

.targets-table tr:hover {
  background: #e4ecf5;
}

/* PAGINATION */
.pagination {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
}

.pagination select {
  margin-left: auto;
  padding: 6px;
}

/* SMALL TEXT */
.small-text {
  font-size: 13px;
  color: #5a8cc2;
}

.input-outline{
border: 2px solid #3d6ba6;
outline: 'none'
}
`}</style>
    </div>
  );
}
