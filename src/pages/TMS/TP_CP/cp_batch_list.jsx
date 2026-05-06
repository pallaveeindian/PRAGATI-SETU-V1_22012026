// src/pages/TMS/TP_CP/cp_batch_list.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TmsLeftNav from "../layout/tms_LeftNav";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";

const CP_ROOT_CACHE_KEY = "tms_cp_dashboard_cache_v1";
const CP_CENTRE_CACHE_KEY = "tms_cp_centre_cache_v1";
const CP_BATCHES_CACHE_KEY = "tms_cp_batches_cache_v1";

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveJson(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), payload }));
  } catch { }
}

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

export default function CpBatchList() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loadingCentreChain, setLoadingCentreChain] = useState(false);
  const [cpRecord, setCpRecord] = useState(null);
  const [centreLink, setCentreLink] = useState(null);
  const [centre, setCentre] = useState(
    () => loadJson(CP_CENTRE_CACHE_KEY)?.payload || null,
  );

  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batches, setBatches] = useState(
    () => loadJson(CP_BATCHES_CACHE_KEY)?.payload || [],
  );

  const [filters, setFilters] = useState({
    district_id: "",
    block_id: "",
    status: "",
    training_type: "",
    batch_type: "",
  });

  const [blocks, setBlocks] = useState([]);
  const didRunRef = useRef(false);

  useEffect(() => {
    if (!user?.id) return;

    async function loadCentre() {
      try {
        const cpResp = await api.get(
          `/tms/training-partner-contact-persons/?master_user=${user.id}`
        );
        const cp = cpResp?.data?.results?.[0];
        if (!cp) return;

        const linkResp = await api.get(
          `/tms/tpcp-centre-links/?contact_person=${cp.id}`
        );
        const link = linkResp?.data?.results?.[0];
        if (!link?.allocated_centre) return;

        const centreResp = await api.get(
          `/tms/training-partner-centres/${link.allocated_centre}/detail/`
        );

        const centreData = centreResp?.data;
        setCentre(centreData);

        setFilters((f) => ({
          ...f,
          district_id: centreData?.district?.district_id,
        }));
      } catch (err) {
        console.error("Centre load failed", err);
      }
    }

    loadCentre();
  }, [user?.id]);

  useEffect(() => {
    if (!filters.district_id) return;

    LOOKUP_API.blocksByDistrict(filters.district_id)
      .then((res) => {
        setBlocks(res?.data?.results || []);
      })
      .catch(() => setBlocks([]));
  }, [filters.district_id]);

  /* ⭐ FILTER API (RENAMED) */
  async function fetchFilteredBatches() {
    if (!centre?.id) return;

    setBatchesLoading(true);

    try {
      const params = {
        centre: centre.id,
        page_size: 500,
      };

      // ONLY add if exists
      if (filters.block_id) params.block_id = filters.block_id;
      if (filters.status) params.status = filters.status;
      if (filters.batch_type) params.batch_type = filters.batch_type;

      // ⚠️ IMPORTANT FIX (backend correct field)
      if (filters.training_type) {
        params.request__training_type = filters.training_type;
      }

      console.log("FINAL PARAMS:", params);

      const resp = await api.get(
        `/tms/batches-list/?${new URLSearchParams(params)}`
      );

      const data = resp?.data?.results || [];

      console.log("RESULT COUNT:", data.length);

      setBatches(data);
    } catch (e) {
      console.error("Fetch failed", e);
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }

  // async function fetchFilteredBatches() {
  //   if (!centre?.id) return;

  //   setBatchesLoading(true);

  //   try {
  //     const params = {
  //       centre: centre.id,

  //       // ✅ STANDARDIZED NAMES
  //       block_id: filters.block_id || "",
  //       status: filters.status || "",
  //       batch_type: filters.batch_type || "",
  //       request__training_type: filters.training_type || "",

  //       page_size: 500,
  //     };

  //     const cleanParams = Object.fromEntries(
  //       Object.entries(params).filter(([_, v]) => v)
  //     );

  //     console.log("🚀 SENDING TO API:", cleanParams);

  //     const resp = await api.get(
  //       `/tms/batches-list/?${new URLSearchParams(cleanParams)}`
  //     );

  //     setBatches(resp?.data?.results || []);

  //   } catch (e) {
  //     console.error("❌ Fetch failed", e);
  //     setBatches([]);
  //   } finally {
  //     setBatchesLoading(false);
  //   }
  // }
  // /* ⭐ AUTO LOAD (FIXED) */
  // useEffect(() => {
  //   if (!centre?.id) return;

  //   fetchFilteredBatches();
  // }, [
  //   filters.block_id,
  //   filters.status,
  //   filters.training_type,
  //   filters.batch_type,
  //   centre?.id
  // ]);

  const rows_first = useMemo(() => batches, [batches]);

  useEffect(() => {
    if (!user?.id) return;
    const cached = loadJson(CP_ROOT_CACHE_KEY);
    if (cached?.payload?.cpRecord) {
      setCpRecord(cached.payload.cpRecord);
      setCentreLink(cached.payload.centreLink || null);
    } else {
      fetchCentreChain(false);
    }
  }, [user?.id]);

  async function fetchCentreChain(force = false) {
    if (!user?.id) return;
    if (!force && cpRecord && centreLink) return;

    setLoadingCentreChain(true);
    try {
      const cpResp = await api.get(
        `/tms/training-partner-contact-persons/?master_user=${user.id}`,
      );
      const cp = cpResp?.data?.results?.[0] || null;
      setCpRecord(cp);

      if (!cp) {
        saveJson(CP_ROOT_CACHE_KEY, { cpRecord: null, centreLink: null });
        setCentre(null);
        setBatches([]);
        return;
      }

      const linkResp = await api.get(
        `/tms/tpcp-centre-links/?contact_person=${cp.id}`,
      );
      const link = linkResp?.data?.results?.[0] || null;
      setCentreLink(link);

      if (link?.allocated_centre) {
        const centreResp = await api.get(
          `/tms/training-partner-centres/${link.allocated_centre}/detail/`,
        );
        const centreData = centreResp?.data || null;
        setCentre(centreData);
        saveJson(CP_CENTRE_CACHE_KEY, centreData);
      } else {
        setCentre(null);
      }

      saveJson(CP_ROOT_CACHE_KEY, { cpRecord: cp, centreLink: link });
    } catch (e) {
      console.error("CP centre chain load failed", e);
    } finally {
      setLoadingCentreChain(false);
    }
  }

  /* ⭐ ORIGINAL CACHE API (UNCHANGED) */
  async function fetchBatches(force = false) {
    if (!centre?.id) return;
    if (!force && !filters.block_id && !filters.status && !filters.batch_type && !filters.training_type) {
      const cached = loadJson(CP_BATCHES_CACHE_KEY);
      if (cached?.payload) {
        setBatches(cached.payload || []);
        return;
      }
    }
    setBatchesLoading(true);
    try {
      const resp = await TMS_API.batches.list({
        centre: centre.id,
        page_size: 500,
      });
      const items = (resp?.data?.results || []).filter(b => b.is_active === true);
      setBatches(items);
      saveJson(CP_BATCHES_CACHE_KEY, items);
    } catch (e) {
      console.error("cp batches fetch failed", e);
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }

  useEffect(() => {
    if (centre?.id && !didRunRef.current) {
      didRunRef.current = true;
      fetchBatches(false);
    }
  }, [centre?.id]);

  const hasCentre = !!centre;
  const cpName =
    cpRecord?.name || user?.first_name || user?.username || "TC ID";

  const rows = useMemo(() => batches || [], [batches]);

  function renderAction(batch) {
    const status = (batch.status || "").toUpperCase();
    if (status === "ONGOING") {
      return <button className="btn-sm btn-flat" onClick={() => navigate(`/tms/cp/batch-detail/${batch.id}`)}>View</button>;
    }
    if (status === "PENDING") {
      return <button className="btn-sm btn-flat" onClick={() => navigate(`/tms/batch-detail/${batch.id}`)}>View</button>;
    }
    if (status === "SCHEDULED") {
      return <button className="btn-sm btn-flat" onClick={() => navigate(`/tms/batch-detail/${batch.id}`)}>View</button>;
    }
    if (status === "COMPLETED") {
      return (
        <>
          <button className="btn-sm btn-flat" style={{ marginRight: 6 }} onClick={() => navigate(`/tms/batch-detail/${batch.id}`)}>View</button>
          <button className="btn-sm btn-flat" onClick={() => navigate(`/tms/cp/batch-closure/${batch.id}`)}>Send Closure Request</button>
        </>
      );
    }
    return null;
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
          {/* <TopNav /> */}
          <main
            style={{
              padding: 20, // UPDATED UI
              minHeight: "100vh", // UPDATED UI
            }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <h2
                style={{
                  marginTop: 8,
                  color: "#2b4e72", // UPDATED UI
                  fontWeight: 700,
                }}
              >
                Training Centre — Batches
              </h2>

              <div
                className="muted"
                style={{
                  marginBottom: 18,
                  color: "#5a8cc2", // UPDATED UI
                }}
              >
                List of all training batches mapped to your assigned centre.
              </div>

              {/* ===================== */}
              {/* MY CENTRE CARD */}
              {/* ===================== */}

              <div
                className="card"
                style={{
                  marginBottom: 22,
                  padding: 20, // UPDATED UI
                  borderRadius: 12, // UPDATED UI
                  background: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)", // UPDATED UI
                  borderTop: "4px solid #3d6ba6", // UPDATED UI
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#2b4e72", // UPDATED UI
                    }}
                  >
                    My Centre
                  </h3>

                  <button
                    className="btn btn-sm"
                    style={{
                      marginLeft: "auto",
                      background: "#3d6ba6", // UPDATED UI
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      try {
                        localStorage.removeItem(CP_ROOT_CACHE_KEY);
                        localStorage.removeItem(CP_CENTRE_CACHE_KEY);
                      } catch { }
                      setCpRecord(null);
                      setCentreLink(null);
                      setCentre(null);
                      fetchCentreChain(true);
                    }}
                    disabled={loadingCentreChain}
                  >
                    {loadingCentreChain ? "Refreshing…" : "Refresh Mapping"}
                  </button>
                </div>

                {loadingCentreChain ? (
                  <div className="table-spinner">
                    Loading your TC ID and centre mapping…
                  </div>
                ) : !cpRecord ? (
                  <div className="muted">
                    No TC ID mapping found for this user.
                  </div>
                ) : !centreLink || !hasCentre ? (
                  <div className="muted">
                    No centre is currently linked to your TC ID profile.
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Centre Name:</strong> {centre.venue_name}
                    </div>

                    <div style={{ marginBottom: 6 }}>
                      <strong>Address:</strong> {centre.venue_address}
                    </div>

                    <div style={{ marginBottom: 6 }}>
                      <strong>Type:</strong> {centre.centre_type}
                      &nbsp;|&nbsp;
                      <strong>Halls:</strong> {centre.training_hall_count}
                    </div>
                  </div>
                )}
              </div>

              {/* ===================== */}
              {/* BATCH LIST CARD */}
              {/* ===================== */}

              <div
                className="card"
                style={{
                  background: "#fff",
                  padding: 20, // UPDATED UI
                  borderRadius: 12, // UPDATED UI
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)", // UPDATED UI
                  borderTop: "4px solid #5a8cc2", // UPDATED UI
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#2b4e72", // UPDATED UI
                    }}
                  >
                    Batches for My Centre
                  </h3>

                  <button
                    className="btn btn-sm"
                    style={{
                      marginLeft: "auto",
                      background: "#3d6ba6", // UPDATED UI
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      try {
                        localStorage.removeItem(CP_BATCHES_CACHE_KEY);
                      } catch { }
                      fetchBatches(true);
                    }}
                    disabled={batchesLoading || !hasCentre}
                  >
                    {batchesLoading ? "Refreshing…" : "Refresh"}
                  </button>
                </div>

                {!hasCentre ? (
                  <div className="muted">
                    Link a centre to your TC ID profile to see batches.
                  </div>
                ) : batchesLoading ? (
                  <div className="table-spinner">Loading batches…</div>
                ) : rows.length === 0 ? (
                  <div className="muted">
                    No batches found for your assigned centre.
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: 520,
                      overflow: "auto",
                      border: "1px solid #d6e3f5", // UPDATED UI
                      borderRadius: 8,
                    }}
                  >
                    <div className="filter-panel">

                      {/* ⭐ FILTER: district locked */}
                      <input
                        className="input"
                        value={centre?.district?.district_name_en || ""}
                        disabled
                      />

                      {/* ⭐ FILTER: block dropdown */}
                      <select
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

                      {/* ⭐ FILTER: status */}
                      <select
                        className="input"
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            status: e.target.value,
                          }))
                        }
                      >
                        <option value="">Status</option>
                        <option value="ONGOING">ONGOING</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>

                      {/* ⭐ FILTER: training type */}
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

                      {/* ⭐ FILTER: batch type */}
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

                      {/* ⭐ FILTER: trigger API */}
                      <button
                        className="btn btn-primary"
                        onClick={fetchFilteredBatches}
                      >
                        Fetch Batches
                      </button>
                    </div>
                    <table className="table table-compact">
                      <thead
                        style={{
                          background: "#a7c6ed", // UPDATED UI
                          color: "#2b4e72",
                        }}
                      >
                        <tr>
                          <th>S.No.</th>
                          <th>Batch Code</th>
                          <th>Status</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Batch Type</th>
                          <th>Participants</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((batch, index) => {
                          const participantsCount = Array.isArray(
                            batch.beneficiary,
                          )
                            ? batch.beneficiary.length
                            : "-";

                          return (
                            <tr key={batch.id}>
                              <td>{index + 1}</td>
                              <td>{batch.code}</td>
                              <td>{batch.status}</td>
                              <td>{fmtDate(batch.start_date)}</td>
                              <td>{fmtDate(batch.end_date)}</td>
                              <td>{batch.batch_type}</td>
                              <td>{participantsCount}</td>
                              <td>{renderAction(batch)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style>{`.content-area {
  display: flex;
  flex: 1;              /*  pushes footer down */
  min-width: 0;         /*  prevents overflow bug */
}`}</style>
    </div>
  );
}


