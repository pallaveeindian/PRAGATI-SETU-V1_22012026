// src/pages/TMS/SMMU/smmu_create_tp_targets.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getAccessToken } from "../../../utils/storage"; // used for JWT decode display
import { useNavigate } from "react-router-dom";
import { getCanonicalRole } from "../../../utils/roleUtils";
import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils"; // or same file

const GEOSCOPE_KEY = "ps_user_geoscope";
const PLANS_CACHE_KEY = "tms_plans_cache_v1";

/** Small JWT decoder (non-crypto) to inspect payload client-side */
function decodeJwt(token = "") {
  try {
    const parts = (token || "").split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

export default function SmmuCreatePartnerTargets() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";
  // resolved ids
  const [effectiveUserId, setEffectiveUserId] = useState(null);
  const [tokenUserId, setTokenUserId] = useState(null);
  const accessToken = getAccessToken();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const navigate = useNavigate();

  // lists and state
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [partners, setPartners] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [searchQ, setSearchQ] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState({
    themes: false,
    plans: false,
    partners: false,
    districts: false,
    targets: false,
    refresh: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const [editingTarget, setEditingTarget] = useState(null);

  const [form, setForm] = useState({
    partner_id: "",
    target_type: "MODULE",
    training_plan_id: "",
    district_id: "",
    theme: "",
    target_count: "",
    financial_year: "2026-27",
    notes: "",
  });

  const [assignedTargets, setAssignedTargets] = useState([]);
  const [assignedTargetsFull, setAssignedTargetsFull] = useState([]);
  const [assignedPage, setAssignedPage] = useState(1);
  const [assignedPageSize, setAssignedPageSize] = useState(10);
  const [assignedTotal, setAssignedTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterFY, setFilterFY] = useState("");
  const [filterModule, setFilterModule] = useState("");

  // map helpers
  const plansById = useMemo(() => {
    const m = {};
    plans.forEach((p) => (m[p.id] = p));
    return m;
  }, [plans]);

  const partnersById = useMemo(() => {
    const m = {};
    partners.forEach((p) => (m[p.id] = p));
    return m;
  }, [partners]);

  const assignedPlanMap = useMemo(() => {
    const m = {};

    assignedTargetsFull.forEach((t) => {
      const pid = t.training_plan || t.training_plan_id || null;
      const fy = t.financial_year || "2026-27"; // Fallback to handle legacy targets
      const did = t.district || t.district_id || null;

      if (!pid || !did) return;

      if (!m[pid]) m[pid] = {};
      if (!m[pid][fy]) m[pid][fy] = {};

      m[pid][fy][did] = {
        partnerId: t.partner,
        partnerName: partnersById[t.partner]?.name || t.partner_name || null,
        targetId: t.id,
      };
    });

    return m;
  }, [assignedTargetsFull, partnersById]);

  // decode token on mount (to show token's user)
  useEffect(() => {
    if (accessToken) {
      const decoded = decodeJwt(accessToken);
      const tid = decoded?.user_id ?? decoded?.user ?? decoded?.sub ?? null;
      setTokenUserId(tid != null ? String(tid) : null);
    } else {
      setTokenUserId(null);
    }
  }, [accessToken]);

  // Resolve effective user id (try user object then geoscope -> DashboardHome pattern)
  async function resolveUserId() {
    const candidate = user?.id ?? user?.user_id ?? user?.TH_urid ?? null;
    if (candidate) {
      setEffectiveUserId(candidate);
      return candidate;
    }

    try {
      const raw = window.localStorage.getItem(GEOSCOPE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user_id) {
          setEffectiveUserId(parsed.user_id);
          return parsed.user_id;
        }
      }
    } catch (e) {
      // ignore corrupted localStorage
    }

    const uid = user?.id ?? user?.user_id ?? null;
    if (uid) {
      try {
        setLoading((s) => ({ ...s, refresh: true }));
        const res = await LOOKUP_API.userGeoscopeByUserId(uid);
        const payload = res?.data ?? res;
        if (payload) {
          try {
            window.localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(payload));
          } catch (e) {}
          if (payload.user_id) {
            setEffectiveUserId(payload.user_id);
            return payload.user_id;
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading((s) => ({ ...s, refresh: false }));
      }
    }

    setEffectiveUserId(uid);
    return uid;
  }

  // On mount: try to load cached plans; fetch other small lists and assigned targets
  useEffect(() => {
    (async () => {
      await resolveUserId();

      let loadedThemes = [];

      // load plans cache if present
      const cacheRaw = localStorage.getItem(PLANS_CACHE_KEY);
      if (cacheRaw) {
        try {
          const parsed = JSON.parse(cacheRaw);
          if (parsed && Array.isArray(parsed.plans)) {
            setPlans(parsed.plans);
            setThemes(parsed.themes || []);
            loadedThemes = parsed.themes || [];
            console.debug("Loaded plans/themes from cache");
          }
        } catch (e) {
          console.warn("plans cache corrupted, ignoring", e);
          localStorage.removeItem(PLANS_CACHE_KEY);
        }
      }

      if (!loadedThemes.length) {
        // no cache: fetch themes & plans now (first-time)
        loadedThemes = await fetchThemesAndPlans(); // also writes cache on success
      }

      // fetch partners/districts and assigned targets (for highlighting)
      await Promise.all([
        fetchPartners(),
        fetchDistricts(),
        fetchAssignedTargetsForHighlight(loadedThemes),
      ]);
      // fetch paginated assigned targets for right panel
      await fetchAssignedTargets(1, assignedPageSize, loadedThemes);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered plans when search changes
  useEffect(() => {
    const q = (searchQ || "").trim().toLowerCase();
    setFilteredPlans(
      plans.filter((p) => {
        const txt =
          `${p.training_name || ""} ${p.type_of_training || ""} ${p.level_of_training || ""} ${p.theme_name || ""}`.toLowerCase();
        return !q || txt.includes(q);
      }),
    );
  }, [plans, searchQ]);

  // --- SURGICAL ADDITION: TRIGGER FETCH ON FILTERS & PAGINATION ---
  useEffect(() => {
    // Only fire if themes have been loaded
    if (themes && themes.length > 0) {
      fetchAssignedTargets(assignedPage, assignedPageSize, themes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedPage, assignedPageSize, filterFY, filterModule]);

  /**
   * Fetch themes + plans and write to cache.
   * If `force=false` this is same as before; if `force=true` will re-run regardless.
   */
  async function fetchThemesAndPlans(force = false) {
    setLoading((s) => ({ ...s, themes: true, plans: true }));
    try {
      // If we already have plans in state and force===false, skip (caller chooses)
      if (!force && plans && plans.length > 0) {
        setLoading((s) => ({ ...s, themes: false, plans: false }));
        return themes;
      }

      const expert = effectiveUserId || user?.id || user?.user_id || null;
      const themesResp = await TMS_API.trainingThemes.list({
        expert,
        limit: 200,
      });
      const themesData = themesResp?.data ?? themesResp;
      const themeResults = themesData?.results || [];
      setThemes(themeResults);

      const collected = [];
      for (const th of themeResults) {
        try {
          const pResp = await TMS_API.trainingPlans.list({
            theme: th.id,
            limit: 500,
          });
          const pData = pResp?.data ?? pResp;
          const pResults = pData?.results || [];
          pResults.forEach((p) => {
            collected.push({
              id: p.id,
              training_name: p.training_name,
              type_of_training: p.type_of_training,
              level_of_training: p.level_of_training,
              no_of_days: p.no_of_days,
              theme_id: th.id,
              theme_name: th.theme_name,
              raw: p,
            });
          });
        } catch (e) {
          console.warn("fetchPlans for theme", th?.id, e);
        }
      }
      setPlans(collected);

      // write cache
      try {
        localStorage.setItem(
          PLANS_CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            themes: themeResults,
            plans: collected,
          }),
        );
      } catch (e) {
        console.warn("Failed to write plans cache", e);
      }

      return themeResults;
    } catch (err) {
      console.error("fetchThemesAndPlans", err);
      setThemes([]);
      setPlans([]);
      return [];
    } finally {
      setLoading((s) => ({ ...s, themes: false, plans: false }));
    }
  }

  async function fetchPartners() {
    setLoading((s) => ({ ...s, partners: true }));
    try {
      const res = await TMS_API.trainingPartners.list({ limit: 500 });
      const data = res?.data ?? res;
      setPartners(data?.results || []);
    } catch (err) {
      console.error("fetchPartners", err);
      setPartners([]);
    } finally {
      setLoading((s) => ({ ...s, partners: false }));
    }
  }

  async function fetchDistricts() {
    setLoading((s) => ({ ...s, districts: true }));
    try {
      const res = await LOOKUP_API.districts.list({ page_size: 500 });
      const data = res?.data ?? res;
      setDistricts(data?.results || []);
    } catch (err) {
      console.warn("fetchDistricts", err);
      setDistricts([]);
    } finally {
      setLoading((s) => ({ ...s, districts: false }));
    }
  }

  // --- SURGICAL ADDITION: FETCH TARGETS STRICTLY BY ASSIGNED THEME INSTEAD OF CREATED_BY ---
  async function fetchAssignedTargets(
    page = 1,
    pageSize = 10,
    explicitThemes = null,
  ) {
    setLoading((s) => ({ ...s, targets: true }));

    try {
      const uid = effectiveUserId ?? (await resolveUserId());
      // offset calculation removed because DRF uses page numbers now

      const currentThemes = explicitThemes || themes;
      let themeNameFilter = undefined;

      if (currentThemes && currentThemes.length > 0) {
        themeNameFilter = currentThemes[0].theme_name;
      } else {
        // Fallback fetch if themes not loaded yet
        const thRes = await TMS_API.trainingThemes.list({
          expert: uid,
          limit: 200,
        });
        const thData = thRes?.data?.results || [];
        if (thData.length > 0) {
          themeNameFilter = thData[0].theme_name;
          setThemes(thData);
        }
      }

      const res = await TMS_API.trainingPartnerTargets.list({
        page: page, // SURGICAL FIX: Send 'page' instead of offset for DRF PageNumberPagination
        page_size: pageSize, // SURGICAL FIX: Send dynamic page size
        theme: themeNameFilter, // 🔒 FETCH BY THEME INSTEAD OF CREATED_BY
        financial_year: filterFY || undefined, // Server-side filter
        training_plan: filterModule || undefined, // Server-side filter
      });

      const data = res?.data ?? res;
      const results = data?.results || [];

      const hydrated = results.map((t) => {
        const partnerObj = partnersById[t.partner] || t.partner_obj || null;
        const planObj =
          plansById[t.training_plan] || t.training_plan_obj || null;

        return {
          ...t,
          partner_name: partnerObj?.name || t.partner_name || "",
          training_plan_name:
            planObj?.training_name || t.training_plan_name || null,
        };
      });

      setAssignedTargets(hydrated);
      setAssignedTotal(data?.count || 0);
    } catch (err) {
      console.error("fetchAssignedTargets", err);
      setAssignedTargets([]);
      setAssignedTotal(0);
    } finally {
      setLoading((s) => ({ ...s, targets: false }));
    }
  }

  // --- SURGICAL ADDITION: FULL HIGHLIGHT ARRAY FETCHED BY THEME ---
  async function fetchAssignedTargetsForHighlight(explicitThemes = null) {
    try {
      const uid = effectiveUserId ?? (await resolveUserId());

      const currentThemes = explicitThemes || themes;
      let themeNameFilter = undefined;

      if (currentThemes && currentThemes.length > 0) {
        themeNameFilter = currentThemes[0].theme_name;
      } else {
        const thRes = await TMS_API.trainingThemes.list({
          expert: uid,
          limit: 200,
        });
        const thData = thRes?.data?.results || [];
        if (thData.length > 0) {
          themeNameFilter = thData[0].theme_name;
          setThemes(thData);
        }
      }

      const res = await TMS_API.trainingPartnerTargets.list({
        limit: 10000,
        theme: themeNameFilter, // 🔒 FETCH BY THEME INSTEAD OF CREATED_BY
      });

      const data = res?.data ?? res;
      const results = data?.results || [];

      const hydrated = results.map((t) => {
        const partnerObj = partnersById[t.partner] || t.partner_obj || null;
        const planObj =
          plansById[t.training_plan] || t.training_plan_obj || null;

        return {
          ...t,
          partner_name: partnerObj?.name || t.partner_name || "",
          training_plan_name:
            planObj?.training_name || t.training_plan_name || null,
        };
      });

      setAssignedTargetsFull(hydrated);
    } catch (err) {
      console.warn("fetchAssignedTargetsForHighlight failed", err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === "training_plan_id") {
      const plan = plans.find((p) => String(p.id) === String(value));
      if (plan && plan.theme_name) {
        setForm((f) => ({ ...f, theme: plan.theme_name }));
      }
    }
  }

  // plan click: select plan unless it's assigned for the same FY & District
  function onPlanClick(plan) {
    const currentFY = form.financial_year || "2026-27";
    const currentDistrict = form.district_id;

    if (currentDistrict) {
      const assigned = assignedPlanMap[plan.id]?.[currentFY]?.[currentDistrict];

      // if assigned to this District in this FY and not editing that target, block
      if (
        assigned &&
        (!editingTarget ||
          String(editingTarget.training_plan) !== String(plan.id) ||
          String(editingTarget.district) !== String(currentDistrict) ||
          editingTarget.financial_year !== currentFY)
      ) {
        // show a gentle message
        setMessage({
          type: "error",
          text: `This module is already assigned to ${assigned.partnerName || "another partner"} for this District in FY ${currentFY}.`,
        });
        return;
      }
    }

    setForm((f) => ({
      ...f,
      training_plan_id: plan.id,
      target_type: "MODULE",
      theme: plan.theme_name || "",
    }));
    setEditingTarget(null);
    setMessage(null);
    // keep console debug for devs
    console.debug("Selected plan:", plan.id, plan.training_name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editAssignedTarget(target) {
    setEditingTarget(target);
    setForm({
      partner_id: target.partner || target.partner_id || "",
      target_type: target.target_type || "MODULE",
      training_plan_id: target.training_plan || target.training_plan_id || "",
      district_id: target.district || target.district_id || "",
      theme: target.theme || "",
      target_count:
        target.target_count != null ? String(target.target_count) : "",
      financial_year: target.financial_year || "2023-24",
      notes: target.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMessage(null);
  }

  function resetForm() {
    setEditingTarget(null);
    setForm({
      partner_id: "",
      target_type: "MODULE",
      training_plan_id: "",
      district_id: "",
      theme: "",
      target_count: "",
      financial_year: "2023-24",
      notes: "",
    });
    setMessage(null);
  }

  function buildPayloadForSubmit(uid) {
    const p = {
      partner: Number(form.partner_id),
      target_type: form.target_type,
      target_count: Number(form.target_count),
      financial_year: form.financial_year,
      notes: form.notes || null,
    };
    if (form.training_plan_id) p.training_plan = Number(form.training_plan_id);
    if (form.district_id) p.district = Number(form.district_id);
    if (form.theme) p.theme = form.theme;

    if (uid != null) {
      p.created_by = uid;
      p.updated_by = uid;
    }
    return p;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!form.partner_id)
      return setMessage({
        type: "error",
        text: "Training Partner CANNOT BE EMPTY",
      });
    if (!form.training_plan_id)
      return setMessage({
        type: "error",
        text: "Module / Training Plan SHOULD BE SELECTED",
      });
    if (!form.district_id)
      return setMessage({ type: "error", text: "District CANNOT be empty" });
    if (!form.financial_year)
      return setMessage({ type: "error", text: "Select financial year" });
    if (
      form.target_count === "" ||
      Number.isNaN(Number(form.target_count)) ||
      Number(form.target_count) < 0
    )
      return setMessage({ type: "error", text: "Enter valid batch count" });

    // SURGICAL ADDITION: Final duplicate check before submit
    const currentFY = form.financial_year;
    const currentDistrict = form.district_id;
    const currentPlan = form.training_plan_id;
    const assigned =
      assignedPlanMap[currentPlan]?.[currentFY]?.[currentDistrict];

    if (
      assigned &&
      (!editingTarget || editingTarget.id !== assigned.targetId)
    ) {
      return setMessage({
        type: "error",
        text: `Target already exists for this Module and District (Assigned to ${assigned.partnerName || "another partner"}). Please select a different District or edit the existing target.`,
      });
    }

    setSaving(true);

    try {
      const uid = effectiveUserId ?? (await resolveUserId());
      const payload = buildPayloadForSubmit(uid);

      console.debug("CREATE/PATCH payload (client):", payload);
      if (editingTarget && editingTarget.id) {
        payload.updated_by = uid;
        console.debug("PATCH payload:", payload);
        const res = await TMS_API.trainingPartnerTargets.partialUpdate(
          editingTarget.id,
          payload,
        );
        console.debug("PATCH response:", res);
        setMessage({ type: "success", text: "Target updated" });
        setRecentActivity((r) =>
          [
            `${new Date().toLocaleString()}: Updated ${editingTarget.id}`,
            ...r,
          ].slice(0, 12),
        );
      } else {
        console.debug("CREATE payload:", payload);
        const res = await TMS_API.trainingPartnerTargets.create(payload);
        console.debug("CREATE response:", res);
        setMessage({ type: "success", text: "Target created" });
        setRecentActivity((r) =>
          [`${new Date().toLocaleString()}: Created`, ...r].slice(0, 12),
        );
      }

      // After save: re-fetch assigned highlight map and paginated targets
      await Promise.all([
        fetchAssignedTargetsForHighlight(themes),
        fetchAssignedTargets(assignedPage, assignedPageSize, themes),
      ]);
      setEditingTarget(null);
    } catch (err) {
      console.error("save target", err);
      const errText =
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err?.message ||
        String(err);
      setMessage({ type: "error", text: errText });
    } finally {
      setSaving(false);
    }
  }

  function progressForTarget(t) {
    const achieved =
      t.achieved_count ?? t.achieved_batches ?? t.achieved ?? null;
    const target = t.target_count ?? null;
    if (achieved == null || target == null || target === 0) return "—";
    const pct = Math.round((Number(achieved) / Number(target)) * 100);
    return `${achieved} / ${target} (${pct}%)`;
  }

  // Refresh: force re-run of all api calls and update cache
  async function handleRefresh() {
    setLoading((s) => ({ ...s, refresh: true }));
    try {
      const freshThemes = await fetchThemesAndPlans(true);
      await Promise.all([
        fetchPartners(),
        fetchDistricts(),
        fetchAssignedTargetsForHighlight(freshThemes),
      ]);
      await fetchAssignedTargets(assignedPage, assignedPageSize, freshThemes);
      setMessage({ type: "success", text: "Refreshed" });
    } catch (e) {
      console.error("refresh", e);
      setMessage({ type: "error", text: "Refresh failed" });
    } finally {
      setLoading((s) => ({ ...s, refresh: false }));
    }
  }

  // styles: now plan list and form sit horizontally (responsive)
  const styles = {
    container: { margin: "20px auto", padding: "16px 16px" },
    planColumn: { flex: "1 1 640px" },
    card: {
      background: "#fff",
      borderRadius: 6,
      padding: 16,
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      border: "2px solid #3d6ba6",
    },
    planList: {
      maxHeight: "62vh",
      overflow: "auto",
      borderRadius: 6,
      background: "#fbfdff",
      padding: 6,
    },
    assignedList: {
      maxHeight: "38vh",
      overflow: "auto",
      marginTop: 8,
      borderTop: "1px solid #f1f3f5",
      paddingTop: 8,
    },
    formControl: {
      width: "100%",
      padding: "8px 10px",
      border: "1px solid #dfe4e8",
      borderRadius: 4,
      boxSizing: "border-box",
      fontSize: 14,
      background: "#fff",
    },
    formSelect: {
      width: "100%",
      padding: "8px 10px",
      border: "1px solid #dfe4e8",
      borderRadius: 4,
      boxSizing: "border-box",
      fontSize: 14,
      background: "#fff",
      height: 40,
    },
    smallMuted: { color: "#6c757d", fontSize: 13 },
    badge: {
      display: "inline-block",
      fontSize: 12,
      padding: "3px 8px",
      borderRadius: 999,
      background: "#eef6ff",
      color: "#0b2540",
      marginLeft: 8,
    },
    assignedRowMuted: { background: "#f7f9fb", color: "#7b8794" },
  };

  const totalPages = Math.max(1, Math.ceil(assignedTotal / assignedPageSize));
  function gotoPrevPage() {
    if (assignedPage > 1) setAssignedPage((p) => p - 1);
  }
  function gotoNextPage() {
    if (assignedPage < totalPages) setAssignedPage((p) => p + 1);
  }

  const showDistrictRow =
    form.target_type === "DISTRICT" || form.target_type === "MODULE";
  const showModuleRow = form.target_type === "MODULE";
  const showThemeRow = form.target_type === "THEME";

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main style={{ padding: 18 }}>
            <div style={styles.container}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 12,
                }}
                className="tms-header-row"
              >
                <h3 style={{ margin: 0 }} className="tms-page-title">
                  {editingTarget
                    ? `Edit Target #${editingTarget.id}`
                    : "Create Partner Targets"}
                </h3>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                  className="tms-header-actions"
                >
                  <button
                    className="btn tms-btn-primary"
                    onClick={() => navigate("/tms/smmu/bulk-assign-targets")}
                    style={{ padding: "8px 10px", borderRadius: 6 }}
                  >
                    Bulk Assignment
                  </button>
                  <button
                    className="btn tms-refresh-btn"
                    onClick={handleRefresh}
                    disabled={loading.refresh}
                    style={{ padding: "8px 10px", borderRadius: 6 }}
                  >
                    {loading.refresh ? "Refreshing…" : "Refresh"}
                  </button>
                </div>
              </div>

              <div className="layout-grid">
                {/* Left: plans */}
                <div className="plan-card">
                  <div className="plan-muted">
                    {editingTarget
                      ? "Editing mode — change fields and Save."
                      : "Click a module row to prefill the form on the right."}
                  </div>

                  <div className="plan-search">
                    <input
                      className="plan-search-input"
                      placeholder="Filter modules by name / type / level"
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      aria-label="Search modules"
                    />
                  </div>

                  <div
                    className="plan-table-wrapper"
                    role="table"
                    aria-label="Training plans"
                  >
                    {loading.plans ? (
                      <div className="plan-empty">Loading modules…</div>
                    ) : filteredPlans.length ? (
                      <table className="plan-table">
                        <thead>
                          <tr>
                            <th style={{ width: 70 }}>ID</th>
                            <th>Training name</th>
                            <th style={{ width: 120 }}>Type</th>
                            <th style={{ width: 140 }}>Level</th>
                            <th style={{ width: 90 }}>Days</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredPlans.map((p) => {
                            const currentFY = form.financial_year || "2026-27";
                            const currentDistrict = form.district_id;

                            // Only consider it "assigned" in the UI if a district is selected and matches
                            const assigned = currentDistrict
                              ? assignedPlanMap[p.id]?.[currentFY]?.[
                                  currentDistrict
                                ]
                              : null;
                            const isAssigned = Boolean(assigned);

                            const isAssignedToThisEditingTarget =
                              editingTarget &&
                              String(editingTarget.training_plan) ===
                                String(p.id) &&
                              String(editingTarget.district) ===
                                String(currentDistrict) &&
                              editingTarget.financial_year === currentFY;

                            const rowClickable =
                              !isAssigned || isAssignedToThisEditingTarget;

                            return (
                              <tr
                                key={p.id}
                                role="row"
                                tabIndex={0}
                                onClick={() => rowClickable && onPlanClick(p)}
                                onKeyDown={(e) =>
                                  (e.key === "Enter" || e.key === " ") &&
                                  rowClickable &&
                                  onPlanClick(p)
                                }
                                className={`plan-row 
                  ${rowClickable ? "plan-row-clickable" : "plan-row-blocked"}
                  ${isAssigned && !isAssignedToThisEditingTarget ? "plan-row-disabled" : ""}
                `}
                              >
                                <td className="plan-td plan-td-id">{p.id}</td>

                                <td className="plan-td plan-td-training">
                                  <span>{p.training_name}</span>
                                </td>

                                <td className="plan-td">
                                  {p.type_of_training || "—"}
                                </td>

                                <td className="plan-td">
                                  {p.level_of_training || "—"}
                                </td>

                                <td className="plan-td">
                                  {p.no_of_days != null ? p.no_of_days : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="plan-empty">
                        {themes.length
                          ? "No modules found for your assigned themes."
                          : "No themes found for your SMMU user."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: form + assigned list */}
                <aside style={{ ...styles.card, ...styles.formColumn }}>
                  <div style={styles.smallMuted}>
                    Choose partner, select target type and scope, enter batch
                    count and financial year, then Save.
                  </div>

                  <form id="targetForm" onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                        className="palette-label"
                      >
                        Training Partner
                      </label>
                      <select
                        name="partner_id"
                        value={form.partner_id}
                        onChange={handleChange}
                        style={styles.formSelect}
                        className="palette-input"
                        required
                      >
                        <option value="">-- select partner --</option>
                        {partners.map((tp) => (
                          <option key={tp.id} value={tp.id}>
                            {tp.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {showModuleRow && (
                      <div style={{ marginBottom: 12 }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                          className="palette-label"
                        >
                          Module / Training plan
                        </label>
                        <select
                          name="training_plan_id"
                          value={form.training_plan_id}
                          onChange={handleChange}
                          style={styles.formSelect}
                          className="palette-input"
                          required
                        >
                          <option value="">-- select module --</option>
                          {plans.map((m) => {
                            const currentFY = form.financial_year || "2026-27";
                            const currentDistrict = form.district_id;

                            const assigned = currentDistrict
                              ? assignedPlanMap[m.id]?.[currentFY]?.[
                                  currentDistrict
                                ]
                              : null;
                            const isAssigned = Boolean(assigned);
                            const isAssignedToThisEditingTarget =
                              editingTarget &&
                              String(editingTarget.training_plan) ===
                                String(m.id) &&
                              String(editingTarget.district) ===
                                String(currentDistrict) &&
                              editingTarget.financial_year === currentFY;

                            return (
                              <option
                                key={m.id}
                                value={m.id}
                                disabled={
                                  isAssigned && !isAssignedToThisEditingTarget
                                }
                              >
                                {m.training_name}
                                {isAssigned
                                  ? ` — Assigned for this District to ${assigned.partnerName || "partner"}`
                                  : ""}
                              </option>
                            );
                          })}
                        </select>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#6c757d",
                            marginTop: 6,
                          }}
                          className="palette-muted"
                        >
                          Tip: click a module row on the left to auto-select it
                          here.
                        </div>
                      </div>
                    )}

                    {showDistrictRow && (
                      <div style={{ marginBottom: 12 }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                          className="palette-label"
                        >
                          District
                        </label>
                        <select
                          name="district_id"
                          value={form.district_id}
                          onChange={handleChange}
                          style={styles.formSelect}
                          className="palette-input"
                          required
                        >
                          <option value="">-- select district --</option>
                          {districts.length ? (
                            districts.map((d) => (
                              <option
                                key={d.district_id || d.id}
                                value={d.district_id || d.id}
                              >
                                {d.district_name_en || d.name}
                              </option>
                            ))
                          ) : (
                            <option value="">
                              (No districts loaded — check endpoint)
                            </option>
                          )}
                        </select>
                      </div>
                    )}

                    {showThemeRow && (
                      <div style={{ marginBottom: 12 }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                          className="palette-label"
                        >
                          Theme (optional)
                        </label>
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: 8,
                            borderRadius: 4,
                            border: "1px solid #e9ecef",
                          }}
                        >
                          {form.theme || "(inferred on save)"}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#6c757d",
                            marginTop: 6,
                          }}
                          className="palette-input"
                        >
                          For THEME targets, theme will be auto-inferred from
                          your SMMU assignment or the selected module.
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: 12 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                        className="palette-label"
                      >
                        Batch count (target)
                      </label>
                      <input
                        type="number"
                        name="target_count"
                        min="0"
                        value={form.target_count}
                        onChange={handleChange}
                        style={styles.formControl}
                        required
                        className="palette-input"
                      />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                        className="palette-label"
                      >
                        Financial year
                      </label>
                      <select
                        name="financial_year"
                        value={form.financial_year}
                        onChange={handleChange}
                        style={styles.formSelect}
                        required
                        className="palette-input"
                      >
                        <option value="">-- select financial year --</option>
                        <option>2026-27</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                        className="palette-label"
                      >
                        Notes (finance / rationale)
                      </label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        style={{ ...styles.formControl, height: 80 }}
                        placeholder="Optional notes for finance or rationale"
                        className="palette-input"
                      />
                    </div>

                    <div
                      style={{ display: "flex", gap: 10 }}
                      className="tms-btn-group"
                    >
                      <button
                        type="submit"
                        disabled={saving}
                        style={{ ...styles.btnPrimary, flex: 1 }}
                        className="tms-btn-primary"
                      >
                        {saving
                          ? editingTarget
                            ? "Updating..."
                            : "Saving..."
                          : editingTarget
                            ? "Update Target"
                            : "Save Target"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        style={{ ...styles.btnSecondary, flex: 1 }}
                        className="tms-btn-secondary"
                      >
                        Reset
                      </button>
                    </div>

                    {message && (
                      <div
                        style={{
                          marginTop: 12,
                          color:
                            message.type === "error" ? "#d9534f" : "#28a745",
                        }}
                        className="tms-message"
                      >
                        {message.text}
                      </div>
                    )}
                  </form>

                  {/* ASSIGNED TARGET LIST */}
                  <div
                    style={styles.assignedList}
                    className="tms-assigned-card"
                  >
                    <h6
                      style={{ margin: "8px 0", paddingLeft: "8px" }}
                      className="tms-section-title"
                    >
                      Assigned Targets
                    </h6>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                      }}
                    >
                      <div className="tms-muted-text" style={{ fontSize: 13 }}>
                        Total: {assignedTotal}
                      </div>

                      <button
                        className="btn tms-btn-view"
                        onClick={() => setIsModalOpen(true)}
                        style={{ padding: "6px 12px", borderRadius: 6 }}
                      >
                        View All (Modal)
                      </button>
                    </div>
                  </div>

                  {isModalOpen && (
                    <div className="tms-modal-overlay">
                      <div className="tms-modal">
                        {/* HEADER */}
                        <div className="tms-modal-header">
                          <h5>Assigned Targets</h5>
                          <button onClick={() => setIsModalOpen(false)}>
                            ✖
                          </button>
                        </div>

                        {/* BODY */}
                        <div
                          style={{
                            maxHeight: 400,
                            overflow: "auto",
                            padding: 10,
                          }}
                        >
                          {/* FILTERS */}
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <select
                              value={filterFY}
                              onChange={(e) => {
                                setFilterFY(e.target.value);
                                setAssignedPage(1);
                              }}
                              style={{ flex: 1 }}
                            >
                              <option value="">All Financial Years</option>
                              <option value="2026-27">2026-27</option>
                            </select>

                            <select
                              value={filterModule}
                              onChange={(e) => {
                                setFilterModule(e.target.value);
                                setAssignedPage(1);
                              }}
                              style={{ flex: 1 }}
                            >
                              <option value="">All Modules</option>
                              {plans.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.training_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* TABLE */}
                          {loading.targets ? (
                            <div>Loading targets…</div>
                          ) : assignedTargets.length ? (
                            <table style={{ width: "100%", fontSize: 13 }}>
                              <thead>
                                <tr style={{ background: "#e4ecf5" }}>
                                  <th>S.No</th>
                                  <th>TP Name</th>
                                  <th>Batch</th>
                                  <th>Module</th>
                                  <th>District</th>
                                  <th>FY</th>
                                  <th>Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {assignedTargets.map((t, index) => (
                                  <tr
                                    key={t.id}
                                    style={{ borderBottom: "1px solid #eee" }}
                                  >
                                    <td>
                                      {(assignedPage - 1) * assignedPageSize +
                                        (index + 1)}
                                    </td>

                                    <td>
                                      {t.partner_name ||
                                        t.partner_full?.name ||
                                        "—"}
                                    </td>

                                    <td>{t.target_count}</td>

                                    <td>
                                      {t.training_plan_name ||
                                        t.training_plan_full?.training_name ||
                                        "—"}
                                    </td>

                                    <td>
                                      {t.district_full?.district_name_en || "—"}
                                    </td>

                                    <td>{t.financial_year}</td>

                                    {/* EDIT BUTTON */}
                                    <td>
                                      <button
                                        className="btn tms-btn-edit"
                                        onClick={() => {
                                          editAssignedTarget(t);
                                          setIsModalOpen(false); // modal close + form open
                                        }}
                                      >
                                        Edit
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div>No data found.</div>
                          )}
                        </div>

                        {/* PAGINATION */}
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <button
                            onClick={gotoPrevPage}
                            disabled={assignedPage <= 1}
                          >
                            Prev
                          </button>

                          <span>
                            Page {assignedPage} /{" "}
                            {Math.max(
                              1,
                              Math.ceil(assignedTotal / assignedPageSize),
                            )}
                          </span>

                          <button
                            onClick={gotoNextPage}
                            disabled={
                              assignedPage >=
                              Math.max(
                                1,
                                Math.ceil(assignedTotal / assignedPageSize),
                              )
                            }
                          >
                            Next
                          </button>

                          <select
                            value={assignedPageSize}
                            onChange={(e) => {
                              setAssignedPageSize(Number(e.target.value));
                              setAssignedPage(1);
                            }}
                            style={{ marginLeft: "auto" }}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RECENT ACTIVITY */}
                  <div style={{ marginTop: 12 }} className="tms-activity">
                    <h6
                      style={{ margin: "8px 0" }}
                      className="tms-section-title"
                    >
                      Recent activity
                    </h6>
                    <div className="tms-muted-text" style={{ fontSize: 13 }}>
                      {recentActivity.length ? (
                        <ul style={{ marginTop: 6 }}>
                          {recentActivity.map((r, i) => (
                            <li key={i} style={{ fontSize: 13 }}>
                              {r}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No recent actions yet."
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`/* PAGE BACKGROUND */

.content-area {
  display: flex;
  flex: 1;
}

/* CARD */
.palette-card{
background:#ffffff;
border:1px solid #a7c6ed;
border-radius:8px;
box-shadow:0 4px 10px rgba(43,78,114,0.08);
}


/* LABELS */
.palette-label{
color:#2b4e72;
font-weight:600;
}


/* MUTED TEXT */
.palette-muted{
color:#5a8cc2;
}


/* INPUTS */
.palette-input{
border:1px solid #a7c6ed !important;
border-radius:6px;
padding:8px;
transition:all .2s;
}

.palette-input:focus{
outline:none;
border-color:#3d6ba6 !important;
box-shadow:0 0 0 2px rgba(90,140,194,0.15);
}


/* PRIMARY BUTTON */
.palette-btn-primary{
background:#3d6ba6;
color:white;
border:none;
border-radius:6px;
transition:all .2s;
}

.palette-btn-primary:hover{
background:#2b4e72;
}


/* SECONDARY BUTTON */
.palette-btn-secondary{
background:#a7c6ed;
border:none;
color:#2b4e72;
border-radius:6px;
}

.palette-btn-secondary:hover{
background:#5a8cc2;
color:white;
}

/* SECTION TITLES */
.tms-section-title{
color:#2b4e72;
font-weight:700;
}


/* MUTED TEXT */
.tms-muted-text{
color:#5a8cc2;
}


/* PRIMARY BUTTON */
.tms-btn-primary{
 background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.tms-btn-primary:hover{
 transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}


/* SECONDARY BUTTON */
.tms-btn-secondary{
background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.tms-btn-secondary:hover{
 transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}


/* EDIT BUTTON */
.tms-btn-edit{
background:#5a8cc2;
color:white;
border:none;
  transition:all .25s ease;
}

.tms-btn-edit:hover{
 transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}


/* TARGET LIST CARD */
.tms-assigned-card{
background:white;
border:1px solid #a7c6ed;
border-radius:8px;
}


/* TARGET ROW */
.tms-target-row:hover{
background:#e4ecf5;
}


/* PAGINATION BUTTON */
.tms-page-btn{
background:#a7c6ed;
border:none;
}

.tms-page-btn:hover{
background:#5a8cc2;
color:white;
}


/* PAGE SELECT */
.tms-page-select{
border:1px solid #a7c6ed;
border-radius:4px;
}


/* MESSAGE */
.tms-message{
font-weight:500;
}

/* HEADER CONTAINER */
.tms-header-row{
background:#e4ecf5;
padding:10px 14px;
border-radius:8px;
border:1px solid #a7c6ed;
}


/* PAGE TITLE */
.tms-page-title{
color:#2b4e72;
font-weight:700;
letter-spacing:0.2px;
}


/* HEADER ACTION AREA */
.tms-header-actions{
display:flex;
align-items:center;
gap:8px;
}


/* REFRESH BUTTON */
.tms-refresh-btn{
background:#5a8cc2;
color:white;
border:none;
transition:all .2s ease;
}

.tms-refresh-btn:hover{
background:#3d6ba6;
}

.tms-refresh-btn:disabled{
background:#a7c6ed;
cursor:not-allowed;
}

/* ===============================
PLAN COLUMN CARD
================================*/
.plan-card {
  background: #fff;
  border: 2px solid #a7c6ed;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(43, 78, 114, 0.08);
}

/* muted helper text */
.plan-muted {
  font-size: 13px;
  color: #5a8cc2;
  margin-bottom: 8px;
}

/* search container */
.plan-search {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

/* search input */
.plan-search-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #a7c6ed;
  border-radius: 6px;
  font-size: 13px;
  color: #2b4e72;
  outline: none;
}

.plan-search-input:focus {
  border-color: #3d6ba6;
  box-shadow: 0 0 0 2px #e4ecf5;
}

/* table wrapper */
.plan-table-wrapper{
  max-height: 750px;      
  overflow-y: auto;      
  overflow-x: auto;       
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* table */
.plan-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

/* table head */
.plan-table thead {
  background: #e4ecf5;
}

.plan-table th {
  padding: 10px 8px;
  text-align: left;
  color: #2b4e72;
  font-weight: 700;
  border-bottom: 2px solid #a7c6ed;
}

/* table body rows */
.plan-row {
  border-bottom: 1px solid #e4ecf5;
  transition: background 0.2s ease;
}

.plan-row:hover {
  background: #e4ecf5;
}

/* assigned row */
.plan-row-disabled {
  background: #f8fbff;
  color: #5a8cc2;
}

/* clickable row */
.plan-row-clickable {
  cursor: pointer;
}

/* non clickable */
.plan-row-blocked {
  cursor: not-allowed;
}

/* table cells */
.plan-td {
  padding: 10px 8px;
  color: #2b4e72;
}

.plan-td-id {
  font-weight: 700;
}

/* training name cell */
.plan-td-training {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* assigned badge */
.plan-badge {
  background: #e6f4ea;      /* light green background */
  color: #1b5e20;           /* dark green text */
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid #a5d6a7; /* soft green border */
}
  
/* empty state */
.plan-empty {
  padding: 24px;
  text-align: center;
  color: #5a8cc2;
}

.layout-grid{
  display: grid;
  grid-template-columns: 1fr 1fr; /* desktop side-by-side */
  gap: 20px;
  align-items: center;
}

@media (max-width: 768px){
  .layout-grid{
    grid-template-columns: 1fr; /* mobile stacked */
  }
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
.tms-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.tms-modal {
  background: #fff;
  width: 1000px;
  max-width: 90%;
  border-radius: 10px;
  overflow: hidden;
}

.tms-modal-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
`}</style>
    </div>
  );
}
