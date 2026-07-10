// src/pages/PRComponents/AnalyticComponents/AnalyticsCharts.jsx
import React from "react";

export default function AnalyticsCharts({
  activeTab,
  activeSubTab,
  overviewData,
  loginData,
  cadreData,
  mouData,
  loading,
  filters,
}) {
  if (loading) {
    return <div className="loading-spinner">Crunching Data...</div>;
  }

  // ==========================================
  // VIEW: GLOBAL OVERVIEW
  // ==========================================
  if (activeTab === "overview") {
    const users = overviewData?.global_overview?.users;
    const geo = overviewData?.global_overview?.geography;
    const tms = overviewData?.platform_overview?.TMS;
    const epsakhi = overviewData?.platform_overview?.epSakhi;
    const ldms = overviewData?.platform_overview?.LDMS;

    const maxRoleCount = Math.max(
      ...(users?.role_breakdown.map((r) => r.user_count) || [1]),
    );

    return (
      <div className="charts-container">
        {/* --- ROW 1: GLOBAL METRICS --- */}
        <div className="metrics-grid">
          <div className="metric-card gradient-blue">
            <div className="metric-icon">👥</div>
            <div className="metric-info">
              <span className="metric-label">Total Registered Users</span>
              <span className="metric-value">
                {users?.total_registered_users?.toLocaleString("en-IN") || 0}
              </span>
            </div>
          </div>
          <div className="metric-card gradient-orange">
            <div className="metric-icon">🟢</div>
            <div className="metric-info">
              <span className="metric-label">Active Users</span>
              <span className="metric-value">
                {users?.total_active_users?.toLocaleString("en-IN") || 0}
              </span>
            </div>
          </div>
          <div className="metric-card gradient-dark">
            <div className="metric-icon">🛡️</div>
            <div className="metric-info">
              <span className="metric-label">Total Roles Available</span>
              <span className="metric-value">
                {users?.total_roles_available || 0}
              </span>
            </div>
          </div>
        </div>

        {/* --- ROW 2: GEOGRAPHY & ROLE BREAKDOWN --- */}
        <div className="dashboard-row">
          {/* Geographic Coverage */}
          <div className="dashboard-card geo-card">
            <h4 className="card-title">📍 Geographic Coverage</h4>
            <div className="geo-grid">
              <div className="geo-item">
                <span className="geo-num">
                  {geo?.total_mandals?.toLocaleString("en-IN")}
                </span>
                <span className="geo-text">Mandals</span>
              </div>
              <div className="geo-item">
                <span className="geo-num">
                  {geo?.total_district_categories?.toLocaleString("en-IN")}
                </span>
                <span className="geo-text">District Categories</span>
              </div>
              <div className="geo-item">
                <span className="geo-num">{geo?.total_districts}</span>
                <span className="geo-text">Districts</span>
              </div>
              <div className="geo-item">
                <span className="geo-num">{geo?.total_blocks}</span>
                <span className="geo-text">Blocks</span>
              </div>
              <div className="geo-item">
                <span className="geo-num">
                  {geo?.total_panchayats?.toLocaleString("en-IN")}
                </span>
                <span className="geo-text">Panchayats</span>
              </div>
              <div className="geo-item">
                <span className="geo-num">
                  {geo?.total_villages?.toLocaleString("en-IN")}
                </span>
                <span className="geo-text">Villages</span>
              </div>
            </div>
          </div>

          {/* Role Breakdown Bar Chart */}
          <div className="dashboard-card chart-card">
            <h4 className="card-title">📊 User Role Breakdown</h4>
            <div className="css-bar-chart">
              {[
                "state_admin",
                "smmu",
                "dmmu",
                "bmmu",
                "training_partner",
                "tp_contact_person",
                "master_trainer",
                "crp_ep",
                "pmu_admin",
              ]
                .map((roleKey) =>
                  users?.role_breakdown?.find(
                    (role) => role.role_name === roleKey,
                  ),
                )
                .filter(Boolean)
                .map((role, idx) => (
                  <div
                    className="bar-row"
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "150px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#475569",
                        textAlign: "right",
                      }}
                    >
                      {(role.role_name === "tp_contact_person"
                        ? "TRAINING_CENTRE"
                        : role.role_name
                      )
                        .replace(/_/g, " ")
                        .toUpperCase()}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "#f1f5f9",
                        height: "24px",
                        borderRadius: "4px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${(role.user_count / maxRoleCount) * 100}%`,
                          height: "100%",
                          background: "#ff7a00",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "8px",
                          minWidth: "30px",
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {role.user_count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- ROW 3: PLATFORM SNAPSHOTS --- */}
        <h3
          className="card-title"
          style={{ marginTop: "10px", borderBottom: "none" }}
        >
          Platform Insights
        </h3>
        <div
          className="platform-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* TMS Snapshot */}
          <div
            className="dashboard-card platform-card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                {tms?.platform_name}
              </h5>
              <span
                className={`status-badge ${tms?.status === "Operational" ? "success" : "warning"}`}
              >
                {tms?.status}
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                <span>Trainers:</span>{" "}
                <strong style={{ color: "#0f172a" }}>
                  {tms?.trainers?.total}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                <span>Training Partners:</span>{" "}
                <strong style={{ color: "#0f172a" }}>
                  {tms?.training_partners?.total_partners}
                </strong>
              </div>
            </div>
          </div>

          {/* epSakhi Snapshot */}
          <div
            className="dashboard-card platform-card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                {epsakhi?.platform_name}
              </h5>
              <span
                className={`status-badge ${epsakhi?.status === "Operational" ? "success" : "warning"}`}
              >
                {epsakhi?.status}
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                <span>Entrepreneurs:</span>{" "}
                <strong style={{ color: "#0f172a" }}>
                  {epsakhi?.metrics?.total_entrepreneurs}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                <span>Enterprises Tracked:</span>{" "}
                <strong style={{ color: "#0f172a" }}>
                  {epsakhi?.metrics?.enterprises_tracked}
                </strong>
              </div>
            </div>
          </div>

          {/* LDMS Snapshot */}
          <div
            className="dashboard-card platform-card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                {ldms?.platform_name}
              </h5>
              <span
                className="status-badge"
                style={{ background: "#f1f5f9", color: "#64748b" }}
              >
                {ldms?.status}
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#64748b",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Dashboard integration awaited...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: TMS -> LOGIN STATUS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_training") {
    const metrics = loginData?.metrics;

    // Safety check if no data
    if (!metrics) return null;

    const isNotLoggedIn = filters?.not_logged_in === "1";

    const maxCadreCount = Math.max(
      ...Object.values(metrics.cadre_distribution || { a: 1 }),
    );

    return (
      <div className="charts-container">
        <div className="metrics-grid">
          {isNotLoggedIn ? (
            <div className="metric-card gradient-orange">
              <div className="metric-icon">🚫</div>
              <div className="metric-info">
                <span className="metric-label">Total Not Logged In</span>
                <span className="metric-value">
                  {metrics.total_not_logged_in || 0}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="metric-card gradient-blue">
                <div className="metric-icon">🚀</div>
                <div className="metric-info">
                  <span className="metric-label">Total First Logins</span>
                  <span className="metric-value">
                    {metrics.total_first_logins}
                  </span>
                </div>
              </div>
              <div className="metric-card gradient-green">
                <div className="metric-icon">✅</div>
                <div className="metric-info">
                  <span className="metric-label">Passwords Changed</span>
                  <span className="metric-value">
                    {metrics.passwords_changed}
                  </span>
                </div>
              </div>
              <div className="metric-card gradient-orange">
                <div className="metric-icon">⏳</div>
                <div className="metric-info">
                  <span className="metric-label">Pending Change</span>
                  <span className="metric-value">
                    {metrics.passwords_pending}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-row">
          <div className="dashboard-card">
            <h4 className="card-title">
              📍 Coverage {isNotLoggedIn ? "Not Logged In" : "Logged In"}
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "30px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    display: "block",
                  }}
                >
                  {metrics.unique_districts_represented}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "bold",
                  }}
                >
                  UNIQUE DISTRICTS
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    display: "block",
                  }}
                >
                  {metrics.unique_blocks_represented}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "bold",
                  }}
                >
                  UNIQUE BLOCKS
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h4 className="card-title">📊 Logins by Cadre</h4>

            <div className="css-bar-chart">
              {[
                { key: "SMMU", total: 11, label: "SMMU" },
                { key: "DMMU", total: 75, label: "DMMU" },
                { key: "BMMU", total: 827, label: "BMMU" },
                { key: "Training_Partner", total: 17, label: "TP" },
              ].map((item, idx) => {
                const count = metrics.cadre_distribution?.[item.key] || 0;

                return (
                  <div
                    className="bar-row"
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#475569",
                        textAlign: "right",
                      }}
                    >
                      {item.label}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        background: "#f1f5f9",
                        height: "20px",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: `${(count / maxCadreCount) * 100}%`,
                          height: "100%",
                          background: "#0284c7",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "8px",
                          minWidth: "70px",
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {count} / {item.total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: TMS -> CADRE SELECTION STATUS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_software") {
    const dataList = cadreData?.data || [];

    // Aggregate totals from array
    const totalBeneficiaries = dataList.reduce(
      (acc, curr) => acc + curr.beneficiary_count,
      0,
    );
    const totalTrainers = dataList.reduce(
      (acc, curr) => acc + curr.trainer_count,
      0,
    );
    const totalRequests = dataList.length;

    return (
      <div className="charts-container">
        <div className="metrics-grid">
          <div className="metric-card gradient-purple">
            <div className="metric-icon">📝</div>
            <div className="metric-info">
              <span className="metric-label">Total Requests</span>
              <span className="metric-value">{totalRequests}</span>
            </div>
          </div>
          <div className="metric-card gradient-blue">
            <div className="metric-icon">👩‍🌾</div>
            <div className="metric-info">
              <span className="metric-label">Beneficiaries Selected</span>
              <span className="metric-value">{totalBeneficiaries}</span>
            </div>
          </div>
          <div className="metric-card gradient-orange">
            <div className="metric-icon">👨‍🏫</div>
            <div className="metric-info">
              <span className="metric-label">Trainers Selected</span>
              <span className="metric-value">{totalTrainers}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: TMS -> OVERALL DEMOGRAPHICS
  // ==========================================
  if (activeTab === "tms" && activeSubTab === "tms_users") {
    const tmsData = overviewData?.platform_overview?.TMS;

    // Safety check
    if (!tmsData) return null;

    const trainers = tmsData.trainers;
    const curriculum = tmsData.curriculum;
    const batches = tmsData.batches;
    const participation = tmsData.participation_and_verification;

    // Calculate max values for proportional bar charts
    const maxBatchCount = Math.max(
      batches.ongoing,
      batches.completed,
      batches.pending,
      batches.scheduled,
      batches.rejected,
      1,
    );
    const maxTrainerCount = Math.max(
      trainers.bifurcation.BRP,
      trainers.bifurcation.DRP,
      trainers.bifurcation.SRP,
      1,
    );

    return (
      <div className="charts-container">
        {/* ROW 1: METRICS */}
        <div className="metrics-grid">
          <div className="metric-card gradient-blue">
            <div className="metric-icon">👨‍🏫</div>
            <div className="metric-info">
              <span className="metric-label">Total Trainers</span>
              <span className="metric-value">
                {trainers?.total?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          <div className="metric-card gradient-orange">
            <div className="metric-icon">📚</div>
            <div className="metric-info">
              <span className="metric-label">Total Training Modules</span>
              <span className="metric-value">
                {curriculum?.total_plans?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          <div className="metric-card gradient-green">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <span className="metric-label">E-KYC Verified Trainees</span>
              <span className="metric-value">
                {participation?.ekyc_verified_trainees?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: CHARTS */}
        <div className="dashboard-row">
          {/* Trainer Bifurcation */}
          <div className="dashboard-card chart-card">
            <h4 className="card-title">📊 Trainer Bifurcation</h4>
            <div className="css-bar-chart">
              {Object.entries(trainers?.bifurcation || {}).map(
                ([key, value], idx) => (
                  <div
                    className="bar-row"
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#475569",
                        textAlign: "right",
                      }}
                    >
                      {key}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "#f1f5f9",
                        height: "24px",
                        borderRadius: "4px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${(value / maxTrainerCount) * 100}%`,
                          height: "100%",
                          background: "#0ea5e9",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "8px",
                          minWidth: "30px",
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Batch Status Breakdown */}
          <div className="dashboard-card chart-card">
            <h4 className="card-title">📈 Batch Status Breakdown</h4>
            <div className="css-bar-chart">
              {[
                {
                  label: "Completed",
                  value: batches.completed,
                  color: "#16a34a",
                },
                { label: "Ongoing", value: batches.ongoing, color: "#eab308" },
                { label: "Pending", value: batches.pending, color: "#f97316" },
                {
                  label: "Scheduled",
                  value: batches.scheduled,
                  color: "#3b82f6",
                },
              ].map((item, idx) => (
                <div
                  className="bar-row"
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#475569",
                      textAlign: "right",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "#f1f5f9",
                      height: "24px",
                      borderRadius: "4px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${(item.value / maxBatchCount) * 100}%`,
                        height: "100%",
                        background: item.color,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "8px",
                        minWidth: "30px",
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: EPSAKHI -> MOU ANALYTICS (SURGICAL ADDITION)
  // ==========================================
  if (activeTab === "mou_analytics" || activeSubTab === "mou_analytics") {
    const mouResults = mouData?.results || mouData?.data || [];

    // Calculate aggregated totals
    const totalTarget = mouResults.reduce(
      (acc, curr) => acc + (Number(curr.mou_target) || 0),
      0,
    );
    const totalAchieved = mouResults.reduce(
      (acc, curr) => acc + (Number(curr.achieved_mou) || 0),
      0,
    );
    const achievementPercentage =mouResults.reduce(
      (acc, curr) => acc + (Number(curr.achievement_percentage) || 0),
      0,
    );

    // Get Top 5 Districts by achievement for the chart
    const topDistricts = [...mouResults]
      .sort(
        (a, b) => (Number(b.achieved_mou) || 0) - (Number(a.achieved_mou) || 0),
      )
      .slice(0, 5);

    const maxDistrictAchieved = Math.max(
      ...topDistricts.map((d) => Number(d.achieved_mou) || 0),
      1,
    );

    return (
      <div className="charts-container">
        {/* ROW 1: METRICS */}
        <div className="metrics-grid">
          <div className="metric-card gradient-blue">
            <div className="metric-icon">🎯</div>
            <div className="metric-info">
              <span className="metric-label">Total MOU Target</span>
              <span className="metric-value">
                {totalTarget.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="metric-card gradient-green">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <span className="metric-label">Total MOUs Achieved</span>
              <span className="metric-value">
                {totalAchieved.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="metric-card gradient-orange">
            <div className="metric-icon">📈</div>
            <div className="metric-info">
              <span className="metric-label">State Achievement %</span>
              <span className="metric-value">{achievementPercentage}%</span>
            </div>
          </div>
        </div>

        {/* ROW 2: CHARTS */}
        <div className="dashboard-row" style={{ gridTemplateColumns: "1fr" }}>
          <div className="dashboard-card chart-card">
            <h4 className="card-title">🏆 Top 5 Districts by Achievement</h4>
            <div className="css-bar-chart">
              {topDistricts.length > 0 ? (
                topDistricts.map((dist, idx) => {
                  const achieved = Number(dist.achieved_mou) || 0;
                  return (
                    <div
                      className="bar-row"
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "120px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: "#475569",
                          textAlign: "right",
                        }}
                      >
                        {dist.district_name_en || "UNKNOWN"}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: "#f1f5f9",
                          height: "24px",
                          borderRadius: "4px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: `${(achieved / maxDistrictAchieved) * 100}%`,
                            height: "100%",
                            background: "var(--epsms-green, #16a34a)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "8px",
                            minWidth: "30px",
                          }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {achieved}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No district data available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for others
  return (
    <div className="analytics-module">
      <h3>Visualizations in Progress</h3>
      <p>Data dashboards for this section are currently being assembled.</p>
    </div>
  );
}
