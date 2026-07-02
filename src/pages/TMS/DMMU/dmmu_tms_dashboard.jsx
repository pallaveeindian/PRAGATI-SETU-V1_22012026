// src/pages/TMS/DMMU/dmmu_tms_dashboard.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import TmsLeftNav from "../layout/tms_LeftNav";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const GEOSCOPE_KEY = "ps_user_geoscope";
const DASHBOARD_CACHE_KEY = "tms_dmmu_dashboard_cache_v1";

/**
 * Get district_id from user's geoscope
 */
async function getDistrictIdFromGeoscope(user) {
  try {
    // Try cache first
    const raw = localStorage.getItem(GEOSCOPE_KEY);
    if (raw) {
      const geoscope = JSON.parse(raw);
      if (geoscope?.districts?.[0]) {
        return geoscope.districts[0];
      }
    }

    // Fetch fresh geoscope
    if (user?.id) {
      const res = await LOOKUP_API.userGeoscopeByUserId(user.id);
      const geoscope = res?.data || res;
      if (geoscope?.districts?.[0]) {
        localStorage.setItem(GEOSCOPE_KEY, JSON.stringify(geoscope));
        return geoscope.districts[0];
      }
    }
  } catch (e) {
    console.warn("Geoscope fetch failed:", e);
  }
  return null;
}

/**
 * Animated number counter (same as SMMU)
 */
function useAnimatedNumber(toVal, ms = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof toVal !== "number" || Number.isNaN(toVal)) {
      setDisplay(toVal);
      return;
    }
    if (display === toVal && startedRef.current) return;

    const start = Date.now();
    const duration = ms;
    const from = Number(display) || 0;
    startedRef.current = true;

    function step() {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = Math.sqrt(t);
      const current = Math.round(from + (toVal - from) * eased);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(toVal);
      }
    }
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [toVal, display]);

  return display;
}

export default function DmmuTmsDashboard() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);

  const [districtId, setDistrictId] = useState(null);
  const [kpis, setKpis] = useState({
    totalBeneficiaries: 0,
    totalTrainers: 0,
    totalTrainings: 0,
    totalPlds: 0,
  });
  const [loadingKpis, setLoadingKpis] = useState(true);

  // Animated displays
  const animBeneficiaries = useAnimatedNumber(kpis.totalBeneficiaries);
  const animTrainers = useAnimatedNumber(kpis.totalTrainers);
  const animTrainings = useAnimatedNumber(kpis.totalTrainings);
  const animPlds = useAnimatedNumber(kpis.totalPlds);

  // Cache control
  const [usingCache, setUsingCache] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load district and dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    const district = await getDistrictIdFromGeoscope(user);
    setDistrictId(district);

    if (!district) {
      setLoadingKpis(false);
      return;
    }

    // Try cache first
    const cacheRaw = localStorage.getItem(DASHBOARD_CACHE_KEY);
    if (cacheRaw) {
      try {
        const parsed = JSON.parse(cacheRaw);
        if (parsed.districtId === district && parsed.kpis) {
          setKpis(parsed.kpis);
          setUsingCache(true);
          setLoadingKpis(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem(DASHBOARD_CACHE_KEY);
      }
    }

    // Fetch fresh data
    await fetchKpis(district, true);
  }

  async function fetchKpis(district, saveCache = false) {
    setLoadingKpis(true);
    try {

      // Parallel API calls for all metrics
      const [beneficiariesRes, trainersRes, trainingsRes, pldsRes] =
        await Promise.all([
          TMS_API.trainingRequestBeneficiaries.list({ district, page_size: 1 }),
          TMS_API.trainingRequestTrainers.list({ district, page_size: 1 }),
          TMS_API.trainingRequests.list({ district, page_size: 1 }),
          TMS_API.trainingRequestBeneficiaries.list({
            district,
            pld_status: "YES",
            page_size: 1,
          }),
        ]);

      const newKpis = {
        totalBeneficiaries: beneficiariesRes?.data?.count || 0,
        totalTrainers: trainersRes?.data?.count || 0,
        totalTrainings: trainingsRes?.data?.count || 0,
        totalPlds: pldsRes?.data?.count || 0,
      };

      setKpis(newKpis);

      if (saveCache) {
        try {
          localStorage.setItem(
            DASHBOARD_CACHE_KEY,
            JSON.stringify({
              ts: Date.now(),
              districtId: district,
              kpis: newKpis,
            }),
          );
          setUsingCache(true);
        } catch (e) {
          console.warn("Cache save failed:", e);
        }
      }

    } catch (err) {
      console.error("fetchKpis failed:", err);
    } finally {
      setLoadingKpis(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      if (districtId) {
        await fetchKpis(districtId, true);
        setUsingCache(false);
      }
    } catch (e) {
      console.error("Refresh failed:", e);
    } finally {
      setRefreshing(false);
    }
  }

  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 4px 12px rgba(10,20,40,0.08)",
    minWidth: 180,
    textAlign: "center",
  };
  const numberStyle = {
    fontSize: 36,
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.2,
  };
  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    marginTop: 8,
  };
  const small = { color: "#6c757d", fontSize: 13 };

  return (
    <div className="app-shell">

      <Header />
      <div className="content-area">
        <TmsLeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-wrapper">
          {/* <TopNav
          left={<div className="app-title">Pragati Setu — TMS (DMMU)</div>}
        /> */}
          <main className="dmmu-main">
            <div className="dmmu-container">
              {/* HEADER */}
              <div className="dmmu-header">
                {/* <h2 className="dmmu-title">
                  DMMU Dashboard
                  {districtId && (
                    <span className="dmmu-district">
                      — District #{districtId}
                    </span>
                  )}
                </h2> */}

                <div className="dmmu-user">
                  <div className="dmmu-user-text">
                    {user?.first_name ? `Welcome, ${user.first_name}` : "Welcome"}
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleRefresh}
                    disabled={refreshing || !districtId}
                  >
                    {refreshing
                      ? "Refreshing…"
                      : usingCache
                        ? "Refresh Data"
                        : "Updated"}
                  </button>
                </div>
              </div>

              {/* KPI GRID */}
              <div className="dmmu-kpi-grid">
                <div className="dmmu-kpi-card">
                  <div className="dmmu-kpi-number">
                    {loadingKpis ? "…" : animBeneficiaries}
                  </div>
                  <div className="dmmu-kpi-label">Total Beneficiaries</div>
                  <div className="dmmu-kpi-small">Trained in district</div>
                </div>

                <div className="dmmu-kpi-card">
                  <div className="dmmu-kpi-number">
                    {loadingKpis ? "…" : animTrainers}
                  </div>
                  <div className="dmmu-kpi-label">Total Trainers</div>
                  <div className="dmmu-kpi-small">Trained in district</div>
                </div>

                <div className="dmmu-kpi-card">
                  <div className="dmmu-kpi-number">
                    {loadingKpis ? "…" : animTrainings}
                  </div>
                  <div className="dmmu-kpi-label">Total Trainings</div>
                  <div className="dmmu-kpi-small">Requests in district</div>
                </div>

                <div className="dmmu-kpi-card">
                  <div className="dmmu-kpi-number">
                    {loadingKpis ? "…" : animPlds}
                  </div>
                  <div className="dmmu-kpi-label">PLDs Trained</div>
                  <div className="dmmu-kpi-small">
                    Potential Lakhpatis trained in your District
                  </div>
                </div>
              </div>

              {/* GRID */}
              <div className="dmmu-grid">
                {/* LEFT CARD */}
                <div className="dmmu-card">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 16,
                    }}
                  ></div>

                  <div className="dmmu-notes">
                    <h4 className="dmmu-notes-title">Notes</h4>

                    <ul className="dmmu-notes-list">
                      <li>Review pending training requests from BMMUs</li>
                      <li>Monitor batch progress across blocks</li>
                      <li>Verify PLD completion rates</li>
                      <li>Approve/reject training plans</li>
                    </ul>
                  </div>
                </div>

                {/* SIDEBAR */}
                <div className="dmmu-card">
                  <h4 className="dmmu-overview-title">District Overview</h4>

                  <div className="dmmu-overview-text">
                    District #{districtId || "Loading..."} — {kpis.totalTrainings}{" "}
                    active trainings
                    {kpis.totalBeneficiaries > 0 && (
                      <div className="dmmu-pld-box">
                        <strong>PLD Coverage:</strong>{" "}
                        {Math.round(
                          (kpis.totalPlds / kpis.totalBeneficiaries) * 100,
                        ) || 0}
                        %
                        <div className="dmmu-pld-small">
                          {kpis.totalPlds}/{kpis.totalBeneficiaries} beneficiaries
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="dmmu-links">
                    <h5 className="dmmu-links-title">Quick Links</h5>

                    <div className="dmmu-links-list">
                      <button
                        className="btn btn-primary dmmu-link-btn"
                        onClick={() => navigate("/tms/dmmu/batches")}
                      >
                        → View District Batches
                      </button>

                      <button
                        className="btn btn-primary dmmu-link-btn"
                        onClick={() => navigate("/tms/training-requests")}
                      >
                        → All Training Requests
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`/* MAIN */
  .content-area {
  display: flex;
  flex: 1;              /*  pushes footer down */
  min-width: 0;         /*  prevents overflow bug */
}

/* SIDEBAR FIX */
.content-area > *:first-child {
  flex-shrink: 0;
}

/* ================= MAIN WRAPPER ================= */

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;         /*  IMPORTANT */
}

/* ================= MAIN CONTENT ================= */

.main-wrapper main {
  flex: 1;              /*  takes full height */
  width: 100%;
  padding: 18px;        /*  FIXED */
  box-sizing: border-box;
}

.dmmu-main {
  padding: 18px;
}

.dmmu-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
}

/* HEADER */
.dmmu-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.dmmu-title {
  margin: 0;
  color: #2b4e72;
}

.dmmu-district {
  color: #5a8cc2;
  font-weight: 400;
  font-size: 16px;
  margin-left: 12px;
}

.dmmu-user {
  margin-left: auto;
  display: flex;
  justify-content: space-between; /* ✅ correct */
  gap: 12px;
  align-items: center;
  color: #0f766e;
}

.dmmu-user-text {
  font-size: 20px;
}

/* KPI GRID */
.dmmu-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.dmmu-kpi-card {
  background: #fff;
  border: 2px solid #a7c6ed;
  border-radius: 12px;
  padding: 20px;
  transition: 0.2s ease;
}

.dmmu-kpi-card:hover {
  background: #e4ecf5;
}

.dmmu-kpi-number {
  font-size: 30px;
  font-weight: 700;
  color: #2b4e72;
}

.dmmu-kpi-label {
  margin-top: 6px;
  font-weight: 700;
  color: #3d6ba6;
}

.dmmu-kpi-small {
  font-size: 12px;
  color: #5a8cc2;
}

/* MAIN GRID */
.dmmu-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

/* CARDS */
.dmmu-card {
  background: #fff;
  border: 2px solid #a7c6ed;
  border-radius: 12px;
  padding: 24px;
}

/* NOTES */
.dmmu-notes {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4ecf5;
}

.dmmu-notes-title {
  margin: 0 0 12px 0;
  color: #2b4e72;
}

.dmmu-notes-list {
  margin: 0;
  padding-left: 20px;
  color: #5a8cc2;
  font-size: 14px;
}

/* DISTRICT OVERVIEW */
.dmmu-overview-title {
  margin-top: 0;
  color: #2b4e72;
}

.dmmu-overview-text {
  font-size: 13px;
  color: #5a8cc2;
  line-height: 1.5;
  margin-bottom: 20px;
}

/* PLD COVERAGE */
.dmmu-pld-box {
  margin-top: 12px;
  padding: 12px 16px;
  background: #e4ecf5;
  border-radius: 6px;
  border-left: 4px solid #3d6ba6;
}

.dmmu-pld-small {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.8;
}

/* QUICK LINKS */
.dmmu-links {
  border-top: 1px solid #e4ecf5;
  padding-top: 16px;
}

.dmmu-links-title {
  margin: 0 0 12px 0;
  color: #2b4e72;
  font-size: 14px;
}

.dmmu-links-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dmmu-link-btn {
  padding: 10px;
  text-align: left;
  border-radius: 6px;
}
/* base button */
.btn{
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  font-size:13px;
  transition:all .25s ease;
}

/* primary button */
.btn-primary{
  background:#3d6ba6;
  color:#fff;
}

/* hover effect */
.btn-primary:hover{
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}

`}</style>
    </div>
  );
}
