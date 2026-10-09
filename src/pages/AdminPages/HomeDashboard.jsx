// src/pages/AdminPages/HomeDashboard.jsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaBullseye,
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaLayerGroup,
  FaRegSadTear,
  FaSyncAlt,
  FaTasks,
  FaUsers,
  FaUserShield,
  FaChalkboardTeacher,
} from "react-icons/fa";
import api, { SUPPORT_API } from "../../api/axios";
import { AuthContext } from "../../contexts/AuthContext";

const metric = (values, key) => {
  const rawValue = values?.[key];
  if (rawValue === null || rawValue === undefined || rawValue === "") return 0;
  const normalized =
    typeof rawValue === "string"
      ? rawValue.replace(/,/g, "").replace(/%/g, "").trim()
      : rawValue;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const firstMetric = (sources, key) => {
  for (const source of sources) {
    const value = metric(source, key);
    if (value > 0) return value;
  }
  return 0;
};

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

const percentage = (value) => {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
};

export default function HomeDashboard() {
  const { authReady, isAuthenticated } = useContext(AuthContext) || {};
  const [summary, setSummary] = useState(null);
  const [moduleStats, setModuleStats] = useState({
    grievances: { total: 0, pending: 0, resolved: 0 },
    targets: { total: 0, achieved: 0, pending: 0 },
    batches: { total: 0 },
    users: { total: 0, active: 0, inactive: 0 },
  });
  const [selectedYear, setSelectedYear] = useState("2026-27");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const results = await Promise.allSettled([
        api.get("/tms/reports/portal-summary/", {
          params: { financial_year: selectedYear },
          headers: { "X-App-Client": "TMS_WEB" },
        }),
        SUPPORT_API.listTickets(),
      ]);

      const [summaryResult, grievanceResult] = results;
      const unauthorized = results.some(
        (result) =>
          result.status === "rejected" &&
          result.reason?.response?.status === 401,
      );
      if (unauthorized) {
        setSummary({});
        setError("Your session has expired. Please log in again.");
        return;
      }

      const summaryData =
        summaryResult.status === "fulfilled"
          ? summaryResult.value?.data || {}
          : {};
      if (summaryResult.status === "fulfilled") setSummary(summaryData);
      else setSummary({});

      const grievanceData =
        grievanceResult.status === "fulfilled"
          ? grievanceResult.value?.data
          : [];
      const grievances = Array.isArray(grievanceData)
        ? grievanceData
        : grievanceData?.results || [];
      const summaryBatchCounts =
        summaryData?.state_wide_summary?.batch_counts || {};
      const targetTotal = metric(summaryBatchCounts, "10_total_target");
      const targetAchieved = metric(
        summaryBatchCounts,
        "12_participants_enrolled_in_batches",
      );
      const targetPending =
        metric(
          summaryBatchCounts,
          "13_remaining_participants_for_enrollment",
        ) || Math.max(0, targetTotal - targetAchieved);

      setModuleStats({
        grievances: {
          total: Number(grievanceData?.count ?? grievances.length),
          pending: grievances.filter((item) => !item.is_solved).length,
          resolved: grievances.filter((item) => item.is_solved).length,
        },
        targets: {
          total: targetTotal,
          achieved: targetAchieved,
          pending: targetPending,
        },
        batches: {
          total: metric(summaryBatchCounts, "1_total_batches_created"),
        },
        users: { total: 0, active: 0, inactive: 0 },
      });

      if (results.every((result) => result.status === "rejected")) {
        setSummary({});
        setError("Dashboard data could not be loaded right now.");
      }
    } catch (requestError) {
      if (requestError?.response?.status !== 401) {
        console.error("Failed to load home dashboard summary:", requestError);
      }
      setSummary(null);
      setError(
        requestError?.response?.status === 401
          ? "Your session has expired. Please log in again."
          : "Dashboard data could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (authReady && isAuthenticated) loadSummary();
  }, [authReady, isAuthenticated, loadSummary]);

  const stateSummary = useMemo(
    () => summary?.state_wide_summary || {},
    [summary],
  );
  const batches = useMemo(
    () => stateSummary.batch_counts || {},
    [stateSummary],
  );
  const participants = useMemo(
    () => stateSummary.participant_counts || {},
    [stateSummary],
  );
  const districts = summary?.district_summaries || [];
  const onboardedParticipants = metric(
    participants,
    "11_participants_onboarded",
  );
  const enrolledParticipants = metric(
    participants,
    "12_participants_enrolled_in_batches",
  );
  const resolvedOnboarded =
    onboardedParticipants || metric(batches, "11_participants_onboarded");
  const resolvedEnrolled =
    enrolledParticipants ||
    metric(batches, "12_participants_enrolled_in_batches");
  const achievement = percentage(
    participants["14_achievement_percentage"] ||
      batches["14_achievement_percentage"],
  );

  const cards = [
    {
      label: "Total Targets",
      value: moduleStats.targets.total,
      icon: FaBullseye,
      tone: "gold",
      breakdown: [
        { label: "Achieved", value: moduleStats.targets.achieved },
        { label: "Pending", value: moduleStats.targets.pending },
      ],
    },
    {
      label: "Participants Onboarded",
      value: resolvedOnboarded,
      icon: FaUsers,
      tone: "violet",
    },
    {
      label: "Enrolled Participants",
      value: resolvedEnrolled,
      icon: FaUsers,
      tone: "slate",
    },
    {
      label: "Not Enorlled Participants",
      value: Math.max(0, resolvedOnboarded - resolvedEnrolled),
      icon: FaExclamationTriangle,
      tone: "red",
    },
    {
      label: "Eligible Participants",
      value: metric(batches),
      icon: FaClock,
      tone: "yellow",
    },
    {
      label: "Not Eligible Participants",
      value: metric(batches),
      icon: FaExclamationTriangle,
      tone: "rose",
    },
    {
      label: "Batches Created",
      value: metric(batches, "1_total_batches_created"),
      icon: FaLayerGroup,
      tone: "cyan",
    },
    {
      label: "Batches Pending",
      value: metric(batches, "3_batches_pending_at_dmm"),
      icon: FaTasks,
      tone: "amber",
    },
    {
      label: "Batches Scheduled",
      value: metric(batches, "2_scheduled_batches"),
      icon: FaTasks,
      tone: "blue",
    },
    {
      label: "Ongoing Batches",
      value: metric(batches, "4_ongoing_batches"),
      icon: FaTasks,
      tone: "orange",
    },
    {
      label: "Completed Batches",
      value: metric(batches, "5_completed_batches"),
      icon: FaCheckCircle,
      tone: "emerald",
    },
    {
      label: "Batches Under Review",
      value: metric(batches, "6_completed_batches_for_verification"),
      icon: FaTasks,
      tone: "indigo",
    },
    {
      label: "Closed Batches",
      value: metric(batches, "7_completed_batch_closed"),
      icon: FaCheckCircle,
      tone: "green",
    },
    {
      label: "Target Achievement",
      value: `${achievement.toFixed(2)}%`,
      icon: FaChartLine,
      tone: "green",
    },

    {
      label: "Grievances",
      value: moduleStats.grievances.total,
      icon: FaRegSadTear,
      tone: "rose",
    },
  ];

  const statusData = useMemo(
    () => [
      {
        label: "Scheduled",
        value: metric(batches, "2_scheduled_batches"),
        color: "#38bdf8",
      },
      {
        label: "Pending",
        value: metric(batches, "3_batches_pending_at_dmm"),
        color: "#f59e0b",
      },
      {
        label: "Ongoing",
        value: metric(batches, "4_ongoing_batches"),
        color: "#a78bfa",
      },
      {
        label: "Completed",
        value: metric(batches, "5_completed_batches"),
        color: "#34d399",
      },
      {
        label: "Rejected",
        value: metric(batches, "8_batches_rejected_by_dmm"),
        color: "#fb7185",
      },
      {
        label: "Review",
        value: metric(batches, "6_completed_batches_for_verification"),
        color: "#790b1d",
      },
      {
        label: "Closed",
        value: metric(batches, "7_completed_batch_closed"),
        color: "#3117c4",
      },
    ],
    [batches],
  );

  const statusTotal = statusData.reduce((total, item) => total + item.value, 0);
  const overallBatchTotal = Math.max(
    metric(batches, "1_total_batches_created"),
    metric(batches, "9_total_batches_completed"),
    statusTotal,
  );
  const closedBatches = metric(batches, "7_completed_batch_closed");
  const donut = useMemo(() => {
    if (!overallBatchTotal) return "conic-gradient(#334155 0 100%)";
    let start = 0;
    const stops = statusData.map((item) => {
      const end = start + (item.value / overallBatchTotal) * 100;
      const stop = `${item.color} ${start}% ${end}%`;
      start = end;
      return stop;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [overallBatchTotal, statusData]);

  const topDistricts = districts
    .map((district) => {
      const participantCounts =
        district.summary?.participant_counts ||
        district.participant_counts ||
        {};
      const batchCounts =
        district.summary?.batch_counts || district.batch_counts || {};
      return {
        name: district.district_name || "Unknown",
        target: firstMetric(
          [participantCounts, batchCounts],
          "10_total_target",
        ),
        onboarded: firstMetric(
          [participantCounts, batchCounts],
          "11_participants_onboarded",
        ),
        achievement: percentage(
          participantCounts["14_achievement_percentage"] ||
            batchCounts["14_achievement_percentage"],
        ),
      };
    })
    .sort((left, right) => right.achievement - left.achievement)
    .slice(0, 5);

  if (!authReady || loading) {
    return (
      <div className="home-dashboard-loading">
        Loading live dashboard data...
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      <div className="dashboard-heading">
        <div className="dashboard-heading-main">
          <div className="dashboard-heading-icon">
            <FaChalkboardTeacher />
          </div>
          <div>
            <h1>TMS Portal Overview</h1>
            <p>
              Live performance summary for training operations and participant
              progress.
            </p>
          </div>
        </div>
        <div className="dashboard-toolbar">
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            <option value="2026-27">FY 2026-27</option>
            <option value="2025-26">FY 2025-26</option>
          </select>
          <button type="button" onClick={loadSummary} title="Refresh dashboard">
            <FaSyncAlt /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-kpi-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div className={`dashboard-kpi ${card.tone}`} key={card.label}>
              <div className="dashboard-kpi-icon">
                <Icon />
              </div>
              <div>
                <span>{card.label}</span>
                <strong>
                  {typeof card.value === "string"
                    ? card.value
                    : formatNumber(card.value)}
                </strong>
                {card.breakdown && (
                  <div className="dashboard-kpi-breakdown">
                    {card.breakdown.map((item) => (
                      <small key={item.label}>
                        <b>{formatNumber(item.value)}</b> {item.label}
                      </small>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel district-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">PERFORMANCE</span>
              <h2>Top districts</h2>
            </div>
            <span className="panel-badge">{districts.length} districts</span>
          </div>
          {topDistricts.length ? (
            <div className="district-list">
              {topDistricts.map((district) => (
                <div className="district-row" key={district.name}>
                  <div className="district-title">
                    <strong>{district.name}</strong>
                    <span>{district.achievement.toFixed(0)}% achieved</span>
                  </div>
                  <div className="district-track">
                    <i style={{ width: `${district.achievement}%` }} />
                  </div>
                  <div className="district-meta">
                    <span>Target: {formatNumber(district.target)}</span>
                    <span>Onboarded: {formatNumber(district.onboarded)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              District performance data is not available.
            </div>
          )}
        </section>

        <section className="dashboard-panel status-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">TRAINING BATCHES</span>
              <h2>Overall batch overview</h2>
              <p className="panel-description">
                Complete batch count and current workflow status.
              </p>
            </div>
            <FaClipboardList className="panel-heading-icon" />
          </div>
          <div className="batch-total-strip">
            <div>
              <strong>{formatNumber(overallBatchTotal)}</strong>
              <span>Total batches</span>
            </div>
            <div>
              <strong>{formatNumber(statusTotal)}</strong>
              <span>In workflow</span>
            </div>
            <div>
              <strong>{formatNumber(closedBatches)}</strong>
              <span>Closed</span>
            </div>
          </div>
          <div className="status-content">
            <div className="status-donut" style={{ background: donut }}>
              <div>
                <strong>{formatNumber(overallBatchTotal)}</strong>
                <span>Total batches</span>
              </div>
            </div>
            <div className="status-legend">
              {statusData.map((item) => (
                <div key={item.label}>
                  <span>
                    <i style={{ background: item.color }} />
                    {item.label}
                  </span>
                  <strong>{formatNumber(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .home-dashboard { min-height:100%; padding:28px 32px 38px; color:#e2e8f0; font-family:Inter,Segoe UI,sans-serif; background:linear-gradient(145deg,rgba(8,17,48,.92),rgba(21,32,79,.78)); box-sizing:border-box; }
        .home-dashboard-loading { min-height:100%; display:grid; place-items:center; color:#cbd5e1; background:#0b1538; }
        .dashboard-heading { display:flex; justify-content:space-between; align-items:center; gap:22px; max-width:1380px; margin:0 auto 25px; }
        .dashboard-heading-main { display:flex; align-items:center; gap:12px; min-width:0; }
        .dashboard-heading-icon { display:grid; place-items:center; flex:none; width:72px; height:72px; border-radius:14px; color:#67e8f9; background:rgba(56,189,248,.14); font-size:28px; }
        .dashboard-kicker,.panel-eyebrow { color:#67e8f9; font-size:10px; font-weight:900; letter-spacing:.16em; }
        .dashboard-heading h1 { margin:0px; color: #fff; font-size:clamp(1.65rem,3vw,2.25rem); letter-spacing:-.04em;  }
        .dashboard-heading p { margin:0; color:#94a3b8; font-size:.86rem; }
        .dashboard-toolbar { display:flex; gap:9px; }
        .dashboard-toolbar select,.dashboard-toolbar button { min-height:38px; border:1px solid rgba(148,163,184,.25); border-radius:9px; padding:0 12px; color:#e2e8f0; background:rgba(15,23,42,.65); font-weight:700; }
        .dashboard-toolbar button { display:flex; align-items:center; gap:7px; cursor:pointer; background:#2563eb; border-color:#3b82f6; }
        .dashboard-toolbar button:hover { background:#1d4ed8; }
        .dashboard-error { max-width:1380px; margin:0 auto 18px; padding:11px 14px; border:1px solid rgba(251,113,133,.4); border-radius:10px; color:#fecdd3; background:rgba(127,29,29,.35); }
        .dashboard-kpi-grid { max-width:1380px; margin:0 auto 22px; display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:13px; }
        .dashboard-kpi { display:flex; align-items:center; gap:12px; min-height:92px; padding:15px; border:1px solid rgba(148,163,184,.2); border-radius:14px; background:rgba(15,23,55,.65); box-shadow:0 12px 28px rgba(2,6,23,.18); border-top:3px solid #38bdf8; }
        .dashboard-kpi-icon { display:grid; place-items:center; width:38px; height:38px; border-radius:11px; color:#67e8f9; background:rgba(56,189,248,.14); font-size:17px; }
        .dashboard-kpi span { display:block; color:#94a3b8; font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.05em; }
        .dashboard-kpi strong { display:block; margin-top:6px; color:#fff; font-size:1.45rem; line-height:1.1; }
        .dashboard-kpi-breakdown { display:flex; flex-wrap:wrap; gap:4px 10px; margin-top:7px; }
        .dashboard-kpi-breakdown small { color:#94a3b8; font-size:.6rem; white-space:nowrap; }
        .dashboard-kpi-breakdown b { color:#fef08a; font-size:.68rem; }
        .dashboard-kpi.violet { border-color:#a78bfa; }.dashboard-kpi.violet .dashboard-kpi-icon { color:#c4b5fd;background:rgba(167,139,250,.15); }
        .dashboard-kpi.green,.dashboard-kpi.emerald { border-color:#34d399; }.dashboard-kpi.green .dashboard-kpi-icon,.dashboard-kpi.emerald .dashboard-kpi-icon { color:#6ee7b7;background:rgba(52,211,153,.15); }
        .dashboard-kpi.orange { border-color:#f59e0b; }.dashboard-kpi.orange .dashboard-kpi-icon { color:#fbbf24;background:rgba(245,158,11,.15); }
        .dashboard-kpi.rose { border-color:#fb7185; }.dashboard-kpi.rose .dashboard-kpi-icon { color:#fda4af;background:rgba(251,113,133,.15); }
        .dashboard-kpi.indigo { border-color:#818cf8; }.dashboard-kpi.indigo .dashboard-kpi-icon { color:#a5b4fc;background:rgba(129,140,248,.15); }
        .dashboard-kpi.gold { border-color:#facc15; }.dashboard-kpi.gold .dashboard-kpi-icon { color:#fde047;background:rgba(250,204,21,.15); }
        .dashboard-kpi.slate { border-color:#94a3b8; }.dashboard-kpi.slate .dashboard-kpi-icon { color:#cbd5e1;background:rgba(148,163,184,.15); }
        .dashboard-main-grid,.dashboard-bottom-grid { max-width:1380px; margin:0 auto 22px; display:grid; grid-template-columns:1.35fr .9fr; gap:18px; align-items:start; }
        .dashboard-bottom-grid { grid-template-columns:1fr 1fr; }
        .dashboard-panel { padding:20px; border:1px solid rgba(148,163,184,.2); border-radius:16px; background:rgba(15,23,55,.68); box-shadow:0 12px 28px rgba(2,6,23,.18); }
        .panel-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:19px; }.panel-heading h2 { margin:5px 0 0; color:#fff; font-size:1.05rem; }.panel-heading-icon { color:#67e8f9; font-size:19px; }.panel-heading-icon.warning { color:#fbbf24; }.panel-description { margin:5px 0 0; color:#94a3b8; font-size:.72rem; line-height:1.4; }
        .panel-badge { padding:5px 9px; border-radius:999px; color:#bae6fd; background:rgba(14,116,144,.24); font-size:.68rem; font-weight:800; }
        .district-list { display:grid; gap:15px; }.district-title,.district-meta { display:flex; justify-content:space-between; gap:10px; }.district-title strong { color:#f8fafc; font-size:.82rem; }.district-title span,.district-meta { color:#94a3b8; font-size:.72rem; }.district-track { height:7px; margin:8px 0 6px; overflow:hidden; border-radius:9px; background:rgba(148,163,184,.15); }.district-track i { display:block; height:100%; border-radius:9px; background:linear-gradient(90deg,#22d3ee,#3b82f6); }.district-meta { font-size:.68rem; }
        .batch-total-strip { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:-3px 0 18px; }.batch-total-strip div { padding:9px 10px; border:1px solid rgba(148,163,184,.14); border-radius:10px; background:rgba(30,41,75,.55); }.batch-total-strip strong,.batch-total-strip span { display:block; }.batch-total-strip strong { color:#fff; font-size:1rem; }.batch-total-strip span { margin-top:2px; color:#94a3b8; font-size:.62rem; }
        .status-content { display:flex; align-items:center; gap:25px; }.status-donut { display:grid; place-items:center; flex:none; width:150px; height:150px; border-radius:50%; box-shadow:0 0 0 7px rgba(15,23,55,.55); }.status-donut > div { display:grid; place-items:center; align-content:center; width:104px; height:104px; border-radius:50%; background:#111b43; }.status-donut strong { color:#fff; font-size:1.5rem; }.status-donut span { color:#94a3b8; font-size:.7rem; }.status-legend { display:grid; flex:1; gap:10px; }.status-legend div,.status-legend span { display:flex; align-items:center; justify-content:space-between; gap:10px; color:#cbd5e1; font-size:.74rem; }.status-legend i { width:8px; height:8px; margin-right:7px; border-radius:50%; }.status-legend strong { color:#fff; }
        .target-bars { display:grid; gap:16px; }.target-bars > div { display:grid; grid-template-columns:112px 1fr 84px; align-items:center; gap:10px; color:#cbd5e1; font-size:.75rem; }.target-bars > div > div { height:11px; border-radius:10px; background:rgba(148,163,184,.16); overflow:hidden; box-shadow:inset 0 1px 2px rgba(2,6,23,.35); }.target-bars i { display:block; height:100%; border-radius:10px; }.target-bar { background:linear-gradient(90deg,#94a3b8,#cbd5e1); }.onboarded-bar { background:linear-gradient(90deg,#22d3ee,#2563eb); }.enrolled-bar { background:linear-gradient(90deg,#c084fc,#db2777); }.target-bars strong { display:flex; flex-direction:column; align-items:flex-end; gap:2px; color:#fff; font-size:.76rem; }.target-bars strong small { color:#94a3b8; font-size:.62rem; font-weight:700; }.progress-label { display:flex; align-items:center; gap:7px; white-space:nowrap; }.legend-dot { width:8px; height:8px; border-radius:50%; }.target-dot { background:#cbd5e1; }.onboarded-dot { background:#22d3ee; }.enrolled-dot { background:#c084fc; }.progress-note { display:flex; align-items:center; gap:7px; margin-top:20px; color:#94a3b8; font-size:.68rem; }.progress-note svg { color:#67e8f9; }
        .queue-items { display:grid; gap:10px; }.queue-items div { display:flex; align-items:center; gap:10px; padding:11px 12px; border-radius:10px; color:#cbd5e1; background:rgba(30,41,75,.7); font-size:.78rem; }.queue-items svg { flex:none; color:#fbbf24; }.queue-items span { display:block; }.queue-items b,.queue-items small { display:block; }.queue-items b { color:#e2e8f0; font-size:.75rem; font-weight:700; }.queue-items small { margin-top:3px; color:#94a3b8; font-size:.65rem; }.queue-items strong { margin-left:auto; color:#fff; font-size:1rem; }.dashboard-empty { padding:24px 0; color:#94a3b8; font-size:.8rem; }
        .module-overview { max-width:1380px; margin:0 auto 22px; }.module-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; }.module-card { min-height:143px; padding:15px; border:1px solid rgba(148,163,184,.18); border-radius:13px; background:rgba(30,41,75,.62); }.module-card-icon { display:grid; place-items:center; width:34px; height:34px; margin-bottom:12px; border-radius:10px; color:#67e8f9; background:rgba(103,232,249,.12); }.module-card strong,.module-card span { display:block; }.module-card strong { color:#f8fafc; font-size:.82rem; }.module-card span { margin-top:4px; color:#94a3b8; font-size:.69rem; line-height:1.35; }        .module-breakdown { display:flex; gap:14px; margin-top:14px; }.module-breakdown.single { display:block; }.module-breakdown b { color:#f8fafc; font-size:1.02rem; }.module-breakdown small { display:block; margin-top:2px; color:#94a3b8; font-size:.62rem; font-weight:600; }.module-breakdown em { display:block; margin-top:5px; color:#fbbf24; font-size:.62rem; font-style:normal; }.grievance-module .module-card-icon { color:#fda4af;background:rgba(251,113,133,.13); }.request-module .module-card-icon { color:#a5b4fc;background:rgba(129,140,248,.13); }.target-module .module-card-icon { color:#fde047;background:rgba(250,204,21,.13); }.batch-module .module-card-icon { color:#67e8f9;background:rgba(103,232,249,.13); }.user-module .module-card-icon { color:#cbd5e1;background:rgba(148,163,184,.13); }
        @media (max-width:1100px) { .dashboard-kpi-grid { grid-template-columns:repeat(3,1fr); }.module-grid { grid-template-columns:repeat(3,1fr); } }.dashboard-kpi.cyan { border-color:#22d3ee; }
        @media (max-width:720px) { .home-dashboard { padding:20px 14px 28px; }.dashboard-heading { display:block; }.dashboard-heading-main { align-items:flex-start; }.dashboard-toolbar { margin-top:16px; }.dashboard-kpi-grid,.module-grid { grid-template-columns:repeat(2,1fr); }.dashboard-main-grid,.dashboard-bottom-grid { grid-template-columns:1fr; }.status-content { align-items:flex-start; flex-direction:column; }.status-donut { margin:auto; }.target-bars > div { grid-template-columns:100px 1fr 70px; gap:7px; }.target-bars strong small { font-size:.56rem; } }
        @media (max-width:760px) { .home-dashboard { padding:20px 14px 28px; }.dashboard-heading { align-items:stretch; flex-direction:column; }.dashboard-toolbar { width:100%; }.dashboard-toolbar select,.dashboard-toolbar button { flex:1; }.dashboard-kpi-grid,.dashboard-main-grid,.dashboard-bottom-grid { grid-template-columns:1fr; }.dashboard-kpi-grid { gap:10px; }.status-content { justify-content:center; flex-wrap:wrap; }.status-legend { min-width:190px; }.target-bars > div { grid-template-columns:70px 1fr 58px; } }
       
      `}</style>
    </div>
  );
}
