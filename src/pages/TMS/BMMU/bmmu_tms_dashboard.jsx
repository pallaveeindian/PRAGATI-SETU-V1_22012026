import React, { useEffect, useState, useRef, useContext } from "react";
import LeftNav from "../layout/tms_LeftNav";
// import TopNav from "../layout/tms_TopNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../../components/ui/LoadingModal";
import TrainingThemeChart from "./TrainingThemeChart";
const GEOSCOPE_KEY = "ps_user_geoscope";
const BMMU_CACHE_KEY = "tms_bmmu_dashboard_cache_v1";

import { getCanonicalRole } from "../../../utils/roleUtils";
import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils"; // or same file

/* ---------------------- resolve effective user ID ---------------------- */
async function resolveEffectiveUserId(user) {
  if (user?.id || user?.user_id) return user.id ?? user.user_id;

  try {
    const raw = localStorage.getItem(GEOSCOPE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.user_id) return parsed.user_id;
    }
  } catch (e) {}

  try {
    if (user?.id || user?.user_id) {
      const uid = user.id ?? user.user_id;
      const res = await LOOKUP_API.userGeoscopeByUserId(uid);
      const payload = res?.data ?? res;
      if (payload?.user_id) {
        try {
          localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(payload));
        } catch (e) {}
        return payload.user_id;
      }
    }
  } catch (e) {}

  return null;
}

/* ---------------------- number animation hook ---------------------- */
function useAnimatedNumber(toVal, ms = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const prevRef = useRef(0);

  useEffect(() => {
    if (typeof toVal !== "number" || Number.isNaN(toVal)) {
      setDisplay(toVal);
      prevRef.current = toVal;
      return;
    }

    const from = Number(prevRef.current) || 0;
    prevRef.current = toVal;
    const start = Date.now();

    function tick() {
      const t = Math.min(1, (Date.now() - start) / ms);
      const eased = Math.sqrt(t);
      const val = Math.round(from + (toVal - from) * eased);
      setDisplay(val);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [toVal, ms]);

  return display;
}

/* ====================================================================== */
/*                     MAIN COMPONENT — BMMU DASHBOARD                     */
/* ====================================================================== */

export default function BmmuTmsDashboard() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";

  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [hover, setHover] = useState(false);
  /* State */
  const [effectiveUserId, setEffectiveUserId] = useState(null);
  const [blockId, setBlockId] = useState(null);

  const [kpis, setKpis] = useState({
    beneficiaries_trained: 0,
    trainers_trained: 0,
    trainings_in_block: 0,
  });

  const [loadingFull, setLoadingFull] = useState(true); // FULL-PAGE LOADER
  const [usingCache, setUsingCache] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* animated numbers */
  const animBeneficiaries = useAnimatedNumber(kpis.beneficiaries_trained, 900);
  const animTrainers = useAnimatedNumber(kpis.trainers_trained, 900);
  const animTrainings = useAnimatedNumber(kpis.trainings_in_block, 900);

  /* ------------------- INITIAL LOAD (ALL APIs before UI) ------------------- */
  useEffect(() => {
    (async () => {
      setLoadingFull(true);

      /* STEP 1 — Resolve user */
      const uid = await resolveEffectiveUserId(user);
      setEffectiveUserId(uid);

      /* STEP 2 — Load geoscope (block ID) */
      let bId = null;
      try {
        const raw = localStorage.getItem(GEOSCOPE_KEY);
        if (raw) {
          const geo = JSON.parse(raw);
          bId = geo?.blocks?.[0] ?? geo?.block_id ?? null;
        }
      } catch (e) {}

      if (!bId && uid) {
        try {
          const geoResp = await LOOKUP_API.userGeoscopeByUserId(uid);
          const payload = geoResp?.data ?? geoResp;
          if (payload) {
            try {
              localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(payload));
            } catch (e) {}
            bId = payload?.blocks?.[0] ?? payload?.block_id ?? null;
          }
        } catch (e) {}
      }
      setBlockId(bId);

      /* STEP 3 — Check cache */
      let loadedFromCache = false;
      try {
        const raw = localStorage.getItem(BMMU_CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.kpis) {
            setKpis(parsed.kpis);
            loadedFromCache = true;
            setUsingCache(true);
          }
        }
      } catch (e) {
        localStorage.removeItem(BMMU_CACHE_KEY);
      }

      /* STEP 4 — Fetch all KPIs fresh BEFORE showing dashboard */
      await fetchKpis(uid, true, bId); // always save cache on full load

      setUsingCache(false); // now showing fresh data

      /* STEP 5 — Now UI can appear */
      setLoadingFull(false);
    })();
  }, [user]);

  /* ---------------------------------------------------------------------- */
  /*                          FETCH KPIS API METHOD                         */
  /* ---------------------------------------------------------------------- */

  async function fetchKpis(uid, saveCache = false, blockOverride = null) {
    const bId = blockOverride ?? blockId;
    let beneficiariesCount = 0;
    let trainersCount = 0;
    let trainingsCount = 0;

    try {
      if (bId) {
        /* #1 beneficiaries trained */
        try {
          const res = await TMS_API.trainingRequestBeneficiaries.list({
            block: bId,
            limit: 1,
          });
          beneficiariesCount = res?.data?.count ?? res?.count ?? 0;
        } catch (e) {}

        /* #2 trainers trained */
        try {
          const res = await TMS_API.trainingRequestTrainers.list({
            block: bId,
            limit: 1,
          });
          trainersCount = res?.data?.count ?? res?.count ?? 0;
        } catch (e) {}
      }

      /* #3 trainings in your block (created_by) */
      try {
        const res = await TMS_API.trainingRequests.list({
          created_by: uid,
          limit: 1,
        });
        trainingsCount = res?.data?.count ?? res?.count ?? 0;
      } catch (e) {}

      const newKpis = {
        beneficiaries_trained: Number(beneficiariesCount),
        trainers_trained: Number(trainersCount),
        trainings_in_block: Number(trainingsCount),
      };

      setKpis(newKpis);

      if (saveCache) {
        localStorage.setItem(
          BMMU_CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            kpis: newKpis,
            blockId: bId,
          }),
        );
      }
    } catch (e) {
      console.error("fetchKpis failed", e);
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                              REFRESH BUTTON                             */
  /* ---------------------------------------------------------------------- */

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await fetchKpis(effectiveUserId, true, blockId);
      setUsingCache(false);
    } catch (e) {
      console.error("refresh error", e);
    }
    setRefreshing(false);
  }

  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 18,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    minWidth: 160,
  };
  const cardStyleTeal = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    flex: "1 1 220px", // RESPONSIVE FIX
    minWidth: 200, // RESPONSIVE FIX
    border: "3px solid #3d6ba6", // Rose-900 border
    boxShadow: "0 2px 2px #a7c6ed",
  };

  const cardStyleAmber = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    flex: "1 1 220px", // RESPONSIVE FIX
    minWidth: 200, // RESPONSIVE FIX
    border: "3px solid #3d6ba6", // Rose-900 border
    boxShadow: "0 2px 2px #a7c6ed",
  };

  const cardStyleRose = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    flex: "1 1 220px", // RESPONSIVE FIX
    minWidth: 200, // RESPONSIVE FIX
    border: "3px solid #3d6ba6", // Rose-900 border
    boxShadow: "0 2px 2px #a7c6ed",
  };
  const small = { color: "#374151", fontSize: 13 };

  /* ====================================================================== */
  /*                                   UI                                   */
  /* ====================================================================== */

  return (
    <>
      {/* FULL PREPARING DASHBOARD LOADER */}
      <LoadingModal
        open={loadingFull}
        title="Preparing Dashboard"
        message="Fetching block details and analytics…"
      />

      <div className="app-shell" style={{ opacity: loadingFull ? 0.15 : 1 }}>
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />

        <div className="main-area">
          {/* <TopNav
            left={<div className="app-title">Pragati Setu — TMS (BMMU)</div>}
          /> */}

          <main className="dashboard-main" style={{ padding: 18 }}>
            <div
              style={{
                width: "100%", // RESPONSIVE FIX
                margin: "20px auto",
                padding: "0 16px",
              }}
            >
              {/* HEADER */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap", // RESPONSIVE FIX
                  justifyContent: "space-between", // RESPONSIVE FIX
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                  padding: "24px 28px",
                  width: "100%",
                  maxWidth: "full", // Increased width
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "3px solid #3d6ba6", // Rose-900 border
                  boxShadow: "0 2px 2px #a7c6ed",
                  transition: "all 0.3s ease",
                }}
              >
                {/* <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#0369a1",
                  }}
                >
                  BMMU — Training Management
                </h2> */}
                <div className="dashboard-header">
                  <h2 className="dashboard-title">{roleMessage}</h2>
                </div>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    flexWrap: "wrap", // RESPONSIVE FIX
                    gap: 16,
                    alignItems: "center",
                    color: "#6c757d",
                  }}
                >
                  <div
                    style={{ fontSize: 20, fontWeight: 500, color: "#0f766e" }}
                  >
                    {user?.first_name
                      ? `Welcome, ${user.first_name}`
                      : "Welcome"}
                  </div>

                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    style={{
                      fontSize: 20,
                      padding: "8px 16px",
                      borderRadius: 10,
                      backgroundColor: "#EB5B00",
                      color: "#ffffff",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      boxShadow: "0 6px 14px #ede9fe",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "rotate(-3deg) translateY(3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "rotate(0deg) translateY(0px)";
                    }}
                  >
                    {refreshing
                      ? "Refreshing…"
                      : usingCache
                        ? "Refresh (reload APIs)"
                        : "Refresh"}
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                {/* Beneficiaries */}
                <div style={cardStyleTeal}>
                  <div
                    style={{ fontSize: 30, fontWeight: 700, color: "#111827" }}
                  >
                    {animBeneficiaries}
                  </div>
                  <div
                    style={{ marginTop: 8, fontWeight: 700, color: "#3d6ba6" }}
                  >
                    Beneficiaries trained
                  </div>
                  <div style={small}>
                    Total beneficiaries trained in your block
                  </div>
                </div>

                {/* Trainers */}
                <div style={cardStyleAmber}>
                  <div
                    style={{ fontSize: 30, fontWeight: 700, color: "#111827" }}
                  >
                    {animTrainers}
                  </div>
                  <div
                    style={{ marginTop: 8, fontWeight: 700, color: "#3d6ba6" }}
                  >
                    Trainers trained
                  </div>
                  <div style={small}>Total trainers trained in your block</div>
                </div>

                {/* Trainings */}
                <div style={cardStyleRose}>
                  <div
                    style={{ fontSize: 30, fontWeight: 700, color: "#111827" }}
                  >
                    {animTrainings}
                  </div>
                  <div
                    style={{ marginTop: 8, fontWeight: 700, color: "#3d6ba6" }}
                  >
                    Trainings (your block)
                  </div>
                  <div style={small}>
                    Training requests created in your block
                  </div>
                </div>
              </div>

              {/* TRAINING THEME CHART */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "2 1 500px" }}>
                  <TrainingThemeChart />
                </div>

                {/* QUICK ACTIONS + NOTES */}

                {/* Quick Actions Card */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    border: "3px solid #3d6ba6", // Rose-900 border
                    boxShadow: "0 2px 2px #a7c6ed",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    flex: "1 1 280px", // RESPONSIVE FIX
                  }}
                >
                  <h3 style={{ marginTop: 0, color: "#111827" }}>
                    Quick Actions
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => navigate("/tms/create-training-request")}
                      onMouseEnter={() => setHover("create")}
                      onMouseLeave={() => setHover(null)}
                      className="btn"
                      style={{
                        background: "linear-gradient(90deg, #5a8cc2, #3d6ba6)",
                        color: "#fff",
                        borderRadius: 12,
                        width: "100%", // RESPONSIVE FIX
                        padding: "24px",
                        border: "none",
                        fontWeight: 600,
                        textAlign: "center",
                        cursor: "pointer",
                        transform:
                          hover === "create"
                            ? "translateY(-6px)"
                            : "translateY(0)",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        boxShadow:
                          hover === "create"
                            ? "0 10px 18px rgba(0,0,0,0.15)"
                            : "none",
                      }}
                    >
                      Create New Training Request
                    </button>
                    <button
                      onClick={() => navigate("/tms/training-requests")}
                      onMouseEnter={() => setHover("view")}
                      onMouseLeave={() => setHover(null)}
                      className="btn"
                      style={{
                        background: "linear-gradient(90deg, #5a8cc2, #a7c6ed)",
                        color: "#fff",
                        padding: "24px",
                        borderRadius: 12,
                        width: "100%", // RESPONSIVE FIX
                        border: "none",
                        fontWeight: 600,
                        textAlign: "center",
                        cursor: "pointer",
                        transform:
                          hover === "view"
                            ? "translateY(-6px)"
                            : "translateY(0)",
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        boxShadow:
                          hover === "view"
                            ? "0 10px 18px rgba(0,0,0,0.15)"
                            : "none",
                      }}
                    >
                      View All Training Requests
                    </button>
                  </div>

                  {/* <div style={{ marginTop: 8 }}>
                    <h4 style={{ margin: "8px 0", color: "#ff8c00" }}>Info</h4>
                    <div style={{ fontSize: 14, color: "#555" }}>
                      Block: {blockId ?? "—"}
                    </div>
                  </div> */}
                </div>

                {/* Notes Card */}
                <aside
                  style={{
                    background: "linear-gradient(90deg,	#a7c6ed, #5a8cc2 )",
                    borderRadius: 12,
                    padding: 16,
                    color: "#fff",
                    border: "3px solid #3d6ba6", // Rose-900 border
                    boxShadow: "0 2px 2px #a7c6ed",
                    gap: 8,
                    flex: "1 1 260px", // RESPONSIVE FIX
                  }}
                >
                  <h4 style={{ marginTop: 0, color: "#111827" }}>Notes</h4>
                  <div style={{ fontSize: 14 }}>
                    This dashboard uses block-scoped analytics based on your
                    geoscope. If block is missing, fallback uses created_by
                    scoping.
                  </div>
                </aside>
              </div>
            </div>
          </main>
        </div>
        <style>{`/* HEADER */
.dashboard-header {
  display: flex;
  align-items: center;
}

.dashboard-title {
  color: #2b4e72;
}`}</style>
      </div>
    </>
  );
}
