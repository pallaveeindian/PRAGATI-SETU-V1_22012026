// src/pages/TMS/SMMU/smmu_list_training_plan.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import TmsLeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { getCanonicalRole } from "../../../utils/roleUtils";
import { ROLE_WELCOME_MESSAGES } from "../../../utils/roleUtils";

const GEOSCOPE_KEY = "ps_user_geoscope";

export default function SmmuListTrainingPlan() {
  const { user } = useContext(AuthContext) || {};
  const roleKey = getCanonicalRole(user);
  const roleMessage = ROLE_WELCOME_MESSAGES[roleKey] || "Dashboard";

  const navigate = useNavigate();

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [effectiveUserId, setEffectiveUserId] = useState(null);

  const [loading, setLoading] = useState({
    plans: false,
    refresh: false,
  });

  const [themes, setThemes] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  // ----------------------------------------
  // RESOLVE USER ID
  // ----------------------------------------

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
    } catch (e) {}

    const uid = user?.id ?? user?.user_id ?? null;

    if (uid) {
      try {
        setLoading((s) => ({
          ...s,
          refresh: true,
        }));

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
      } finally {
        setLoading((s) => ({
          ...s,
          refresh: false,
        }));
      }
    }

    setEffectiveUserId(uid);
    return uid;
  }

  // ----------------------------------------
  // FETCH THEMES + PLANS
  // ----------------------------------------

  async function fetchTrainingPlans() {
    try {
      setLoading((s) => ({
        ...s,
        plans: true,
      }));

      const expert = effectiveUserId || user?.id || user?.user_id || null;

      // --------------------------------
      // FETCH ONLY SMMU THEMES
      // --------------------------------

      const themesResp = await TMS_API.trainingThemes.list({
        expert,
        limit: 200,
      });

      const themesData = themesResp?.data ?? themesResp;
      const themeResults = themesData?.results || [];

      setThemes(themeResults);

      // --------------------------------
      // FETCH PLANS OF THOSE THEMES
      // --------------------------------

      const collectedPlans = [];

      for (const th of themeResults) {
        try {
          const params = {
            theme: th.id,
            page,
            page_size: pageSize,
          };

          if (search && search.trim()) {
            params.search = search.trim();
          }

          const plansResp = await TMS_API.trainingPlans.list(params);
          const plansData = plansResp?.data ?? plansResp;
          const results = plansData?.results || [];

          results.forEach((p) => {
            collectedPlans.push({
              id: p.id,
              training_name: p.training_name,
              type_of_training: p.type_of_training,
              level_of_training: p.level_of_training,
              no_of_days: p.no_of_days,
              theme_name: th.theme_name,
              raw: p,
            });
          });
        } catch (err) {
          console.warn("Failed fetching plans for theme", th.id);
        }
      }

      setTrainingPlans(collectedPlans);
    } catch (error) {
      console.error("Failed to fetch training plans", error);
      setTrainingPlans([]);
    } finally {
      setLoading((s) => ({
        ...s,
        plans: false,
      }));
    }
  }

  // ----------------------------------------
  // DELETE HANDLER (Cascades Scopes then Plan)
  // ----------------------------------------

  async function handleDeletePlan(planId) {
    if (!window.confirm("Are you sure you want to delete this training plan?"))
      return;

    setLoading((s) => ({ ...s, plans: true }));
    try {
      // 1. Delete associated TRPUserScope rows to clean up
      const scopeResp = await TMS_API.trpUserScopes.list({
        training_id: planId,
        limit: 100,
      });
      const scopes = scopeResp?.data?.results || scopeResp?.data || [];
      for (const sc of scopes) {
        await TMS_API.trpUserScopes.destroy(sc.id);
      }

      // 2. Delete the Training Plan
      await TMS_API.trainingPlans.destroy(planId);

      // 3. Refresh list
      fetchTrainingPlans();
    } catch (error) {
      console.error("Failed to delete training plan", error);
      alert("Failed to delete training plan.");
      setLoading((s) => ({ ...s, plans: false }));
    }
  }

  // ----------------------------------------
  // INITIAL LOAD
  // ----------------------------------------

  useEffect(() => {
    (async () => {
      await resolveUserId();
    })();
  }, []);

  useEffect(() => {
    if (effectiveUserId) {
      fetchTrainingPlans();
    }
    // eslint-disable-next-line
  }, [effectiveUserId]);

  // ----------------------------------------
  // API BASED SEARCH + PAGINATION
  // ----------------------------------------

  useEffect(() => {
    if (effectiveUserId) {
      fetchTrainingPlans();
    }
    // eslint-disable-next-line
  }, [search, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(trainingPlans.length / pageSize) || 1;
  }, [trainingPlans]);

  const paginatedPlans = trainingPlans;

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <>
      <style>{`
        .smmu-page-wrapper {
          min-height: 100vh;
          background: #f4f6f9;
          display: flex;
          flex-direction: column;
        }

        .content-area {
        display: flex;
        flex: 1;
        }

        .main-area {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        }

        .smmu-main-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        min-width: 0;
        }

        .smmu-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .smmu-page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .smmu-page-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .create-btn {
          background: #003385;
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: 0.2s;
        }

        .create-btn:hover {
          background: #fff;
          color: #003385;
          border: 1px solid #003385;
        }

        .search-box-wrapper {
          background: white;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }

        .search-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 250px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }

        .search-input:focus {
          border-color: #2563eb;
        }

        .search-btn {
          background: #111827;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 18px;
          cursor: pointer;
          font-weight: 600;
        }

        .search-btn:hover {
          background: black;
        }

        .table-wrapper {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .table-scroll {
          overflow-x: auto;
        }

        .training-table {
          width: 100%;
          border-collapse: collapse;
        }

        .training-table thead {
          background: #f3f4f6;
        }

        .training-table th {
          text-align: left;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .training-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #374151;
        }

        .training-table tbody tr:hover {
          background: #f9fafb;
        }

        .loading-row,
        .empty-row {
          text-align: center;
          padding: 40px !important;
          color: #6b7280;
        }

        .pagination-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
        }

        .pagination-buttons {
          display: flex;
          gap: 10px;
        }

        .pagination-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: #003385;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f3f4f6;
          color: #003385;
        }

        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .action-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .edit-btn {
          background: #eef2ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }
        .edit-btn:hover { background: #dbeafe; }
        .del-btn {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
        }
        .del-btn:hover { background: #fee2e2; }
        .action-flex {
          display: flex;
          gap: 8px;
        }
      `}</style>

      <div className="app-shell smmu-page-wrapper">
        <Header />

        <div className="content-area">
          <TmsLeftNav
            collapsed={navCollapsed}
            onToggle={() => setNavCollapsed((v) => !v)}
          />

          <div className="main-area">
            <main className="smmu-main-content">
              {/* HEADER */}

              <div className="smmu-page-header">
                <div>
                  <h1 className="smmu-page-title">All Training Modules</h1>
                </div>

                <button
                  className="create-btn"
                  onClick={() => navigate("/tms/smmu/create-training-plan")}
                >
                  + Create Training Plan
                </button>
              </div>

              {/* SEARCH */}

              <div className="search-box-wrapper">
                <form
                  className="search-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPage(1);
                    fetchTrainingPlans();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search training name, type, level, theme..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button type="submit" className="search-btn">
                    Search
                  </button>
                </form>
              </div>

              {/* TABLE */}

              <div className="table-wrapper">
                <div className="table-scroll">
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Training Name</th>
                        <th>Theme</th>
                        <th>Type</th>
                        <th>Level</th>
                        <th>No. of Days</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading.plans ? (
                        <tr>
                          <td colSpan="7" className="loading-row">
                            Loading training plans...
                          </td>
                        </tr>
                      ) : trainingPlans.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="empty-row">
                            No training plans found.
                          </td>
                        </tr>
                      ) : (
                        trainingPlans.map((plan, index) => (
                          <tr key={plan.id}>
                            <td>{(page - 1) * pageSize + index + 1}</td>
                            <td>{plan.training_name || "-"}</td>
                            <td>{plan.theme_name || "-"}</td>
                            <td>{plan.type_of_training || "-"}</td>
                            <td>{plan.level_of_training || "-"}</td>
                            <td>{plan.no_of_days || "-"}</td>
                            <td>
                              <div className="action-flex">
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() =>
                                    navigate("/tms/smmu/create-training-plan", {
                                      state: { editPlan: plan.raw },
                                    })
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  className="action-btn del-btn"
                                  onClick={() => handleDeletePlan(plan.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}

                <div className="pagination-wrapper">
                  <div className="pagination-info">
                    Showing page {page} of {totalPages || 1}
                  </div>

                  <div className="pagination-buttons">
                    <button
                      className="pagination-btn"
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      Previous
                    </button>

                    <button
                      className="pagination-btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
      <style>{`.content-area {
        display: flex;
        flex: 1;
      }`}</style>
    </>
  );
}
