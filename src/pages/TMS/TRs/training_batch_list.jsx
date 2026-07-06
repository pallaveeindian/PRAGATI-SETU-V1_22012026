// src/pages/TMS/BatchCreator/TrainingBatchList.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { LOOKUP_API, TMS_API } from "../../../api/axios";
import {
  getCanonicalRole,
  ROLE_WELCOME_MESSAGES,
} from "../../../utils/roleUtils";

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
    if (pid) localStorage.setItem(cacheKey, String(pid));
    return pid;
  } catch {
    return null;
  }
}

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
  const [dtpDistrictId, setDtpDistrictId] = useState(null);
  const [dtpPartnerId, setDtpPartnerId] = useState(null);
  const [dtpPartnerName, setDtpPartnerName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const visibleBatches = batches.filter((b) => {
    // Hide DRAFT batches from everyone except DTP
    if (String(b.status).toUpperCase() === "DRAFT" && role !== "dtp") {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(visibleBatches.length / rowsPerPage);

  const paginatedBatches = visibleBatches.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

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

  const [mandals, setMandals] = useState([]);
  const [districtCategories, setDistrictCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [centres, setCentres] = useState([]);
  const [partners, setPartners] = useState([]);
  const [themes, setThemes] = useState([]);
  const [plans, setPlans] = useState([]);

  const didInitRef = useRef(false);

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

    if (role === "bmmu" && blockId) return { block_id: blockId };
    if (role === "dmmu" && districtId) return { district_id: districtId };
    if (role === "training_partner") return { partner: tpPartnerId };
    if (role === "dtp")
      return { district_id: dtpDistrictId, partner: dtpPartnerId };
    return {};
  }

  function getScopeKey() {
    if (requestId) return `req_${requestId}`;
    if (role === "training_partner") return `tp_${user?.id}`;
    if (role === "dtp") return `dtp_${user?.id}`;
    if (role === "bmmu") return "bmmu";
    if (role === "dmmu") return "dmmu";
    return role || "global";
  }

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
            setFilters((f) => ({ ...f, partner: String(pid), centre_id: "" }));
          }
        }

        if (role === "dtp") {
          let districtId = null;
          try {
            const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
            districtId =
              geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;
            if (districtId) {
              setDtpDistrictId(String(districtId));
              setFilters((f) => ({
                ...f,
                district_id: String(districtId),
                block_id: "",
                aspirational_only: false,
              }));
            }
          } catch (err) {
            console.error("Failed to load DTP geoscope", err);
          }

          try {
            const partnerRes = await TMS_API.parentPartner();
            const partnerId = partnerRes?.data?.partner_id;
            if (partnerId) {
              setDtpPartnerId(String(partnerId));
              setFilters((f) => ({ ...f, partner: String(partnerId) }));
              try {
                const pRes = await TMS_API.trainingPartners.retrieve(partnerId);
                setDtpPartnerName(pRes?.data?.name || "");
              } catch (err) {}
            }
          } catch (err) {}
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
    if (role === "bmmu") return;
    if (!filters.district_id) {
      setBlocks([]);
      return;
    }
    LOOKUP_API.blocksByDistrict(filters.district_id)
      .then((r) => {
        let data = r?.data?.results || [];
        if (filters.aspirational_only)
          data = data.filter((b) => b.is_aspirational === 1);
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

  async function fetchBatches() {
    if (!user?.id) return;
    setLoading(true);
    try {
      let finalParams = {};
      if (isRequestScoped) {
        finalParams = { request_id: requestId, page_size: 500 };
      } else {
        const baseParams = getDefaultScopeParams();
        let effectiveFilters = filters;

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
        if (role === "dtp") {
          effectiveFilters = Object.fromEntries(
            Object.entries(filters).filter(
              ([k]) => !["district_id", "partner"].includes(k),
            ),
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
      if (!isRequestScoped) saveCache(getScopeKey(), items);
    } catch (e) {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteBatch = async (batchId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this batch?",
    );
    if (!confirmed) return;
    try {
      await TMS_API.batchCreator.delete(batchId);
      alert("Batch deleted successfully.");
      fetchBatches();
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to delete batch.",
      );
    }
  };

  const handleViewBatch = async (batchId) => {
    try {
      const response = await TMS_API.batchDetailV2(batchId);
      navigate(`/tms/batch-detail/${batchId}`, {
        state: { batchData: response.data },
      });
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to fetch batch details.",
      );
    }
  };

  useEffect(() => {
    if (role === "bmmu") fetchBatches();
  }, [role]);

  useEffect(() => {
    if (role === "training_partner" && tpPartnerId) fetchBatches();
  }, [role, tpPartnerId]);

  useEffect(() => {
    if (role === "dtp" && dtpDistrictId && dtpPartnerId) fetchBatches();
  }, [role, dtpDistrictId, dtpPartnerId]);

  useEffect(() => {
    if (!user?.id || didInitRef.current || isRequestScoped) return;
    if (role === "bmmu" || role === "training_partner" || role === "dtp")
      return;
    didInitRef.current = true;
    const cached = loadCache(getScopeKey());
    if (cached?.payload) setBatches(cached.payload);
    else fetchBatches();
  }, [user?.id, role, requestId]);

  useEffect(() => {
    if (!requestId || !user?.id) return;
    fetchBatches();
  }, [requestId, user?.id]);

  const renderCentreName = (c) => c?.venue_name || c?.partner?.name || "-";

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-wrapper">
          <main style={{ padding: "18px 24px", minHeight: "100vh" }}>
            {/* SURGICAL FIX: Removed horizontal max-width locks to enlarge table fully */}
            <div style={{ width: "100%", margin: "0 auto" }}>
              {!isRequestScoped && (
                <div className="filter-panel">
                  <div>
                    <div className="filter-row">
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
                          disabled={role === "dmmu" || role === "dtp"}
                          onChange={(e) => {
                            if (role === "dmmu" || role === "dtp") return;
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
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#3d6ba6",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={filters.aspirational_only}
                            disabled={role === "dtp"}
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

                      {role !== "training_partner" &&
                        role !== "dtp" &&
                        role !== "tpcp" && (
                          <select
                            className="input"
                            value={filters.partner}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                partner: e.target.value,
                              }))
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

                      {role === "dtp" && (
                        <select
                          className="input"
                          value={filters.partner}
                          disabled
                        >
                          <option value={filters.partner}>
                            {dtpPartnerName}
                          </option>
                        </select>
                      )}

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
                          "REJECTED",
                          "ONGOING",
                          "SCHEDULED",
                          "COMPLETED",
                          "REVIEW",
                          "CLOSED",
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

                      <button
                        className="btn btn-primary fetch-btn"
                        onClick={fetchBatches}
                      >
                        Fetch Batches
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                      <th>Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={13}
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Loading data...
                        </td>
                      </tr>
                    ) : visibleBatches.length === 0 ? (
                      <tr>
                        <td
                          colSpan={13}
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No batches found
                        </td>
                      </tr>
                    ) : (
                      paginatedBatches.map((b, i) => (
                        <tr key={b.id}>
                          <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
                          <td style={{ fontWeight: "600", color: "#2563eb" }}>
                            {b.code}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${String(b.status).toLowerCase()}`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td>{b.participant_type}</td>
                          <td>{b.start_date}</td>
                          <td>{b.end_date}</td>
                          <td>{b.batch_type}</td>
                          <td>{renderCentreName(b.centre)}</td>
                          <td>{b.centre?.partner?.name || "-"}</td>
                          <td>{b.block?.block_name_en || "-"}</td>
                          <td>{b.district?.district_name_en || "-"}</td>

                          {/* SURGICAL FIX: Dynamic participant count logic extraction */}
                          <td
                            style={{ textAlign: "center", fontWeight: "600" }}
                          >
                            {b.pax_count || 0}
                          </td>

                          <td style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="btn-sm btn-flat"
                              onClick={() => handleViewBatch(b.id)}
                            >
                              View
                            </button>
                            {role === "dtp" &&
                              (String(b.status).toUpperCase() === "DRAFT" ||
                                (String(b.status).toUpperCase() ===
                                  "REJECTED" &&
                                  String(b.batch_type).toUpperCase() ===
                                    "SEPARATE")) && (
                                <button
                                  className="btn-sm btn-action-resume"
                                  onClick={() =>
                                    navigate("/tms/batch-creator/", {
                                      state: { resume: true, batchId: b.id },
                                    })
                                  }
                                >
                                  Resume
                                </button>
                              )}
                            {["dmmu"].includes(role) &&
                              String(b.status).toUpperCase() === "PENDING" && (
                                <button
                                  className="btn-sm btn-action-resume"
                                  onClick={() =>
                                    navigate(`/tms/dmmu/batch-review/${b.id}`)
                                  }
                                >
                                  Review
                                </button>
                              )}
                            {role === "dtp" &&
                              ["DRAFT", "REJECTED"].includes(
                                String(b.status).toUpperCase(),
                              ) && (
                                <button
                                  className="btn-sm btn-danger"
                                  onClick={() => handleDeleteBatch(b.id)}
                                >
                                  Delete
                                </button>
                              )}
                            {(role === "dtp" || role === "training_partner") &&
                              ["COMPLETED", "REVIEW"].includes(
                                String(b.status).toUpperCase(),
                              ) && (
                                <button
                                  className="btn-sm btn-flat"
                                  onClick={() =>
                                    navigate(`/tms/tp/tr-closure/${b.id}`)
                                  }
                                >
                                  Closure
                                </button>
                              )}
                            {["bmmu", "dmmu", "smmu"].includes(role) && (
                              <>
                                {String(b.status).toUpperCase() ===
                                  "REVIEW" && (
                                  <button
                                    className="btn-sm btn-flat"
                                    onClick={() =>
                                      role === "dmmu"
                                        ? navigate(
                                            `/tms/dmmu/tr-closure/${b.id}`,
                                          )
                                        : navigate(
                                            `/tms/batch-certificate/${b.id}`,
                                          )
                                    }
                                  >
                                    {role === "dmmu"
                                      ? "Closure"
                                      : "Certificate"}
                                  </button>
                                )}
                                {String(b.status).toUpperCase() ===
                                  "CLOSED" && (
                                  <button
                                    className="btn-sm btn-flat"
                                    onClick={() =>
                                      navigate(`/tms/batch-certificate/${b.id}`)
                                    }
                                  >
                                    Certificate
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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
          <Footer />
        </div>
      </div>
      <style>{`
/* ================= OVERHAULED VISUAL STYLES ================= */
.content-area {
  display: flex;
  flex: 1;
  width: 100%;
}
.content-area > *:first-child { flex-shrink: 0; }
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  background-color: #f8fafc;
}

/* FILTER PANEL */
.filter-panel {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 8px 12px;
  margin-bottom: 12px;

  border: 1px solid #dbe4ef;
  border-radius: 8px;

  display: flex;
  align-items: center;

  overflow-x: auto;
  overflow-y: hidden;

  white-space: nowrap;

  box-shadow: 0 2px 6px rgba(0,0,0,.06);
}
.filter-panel label{
    font-size:12px;
    gap:4px;
}  
.filter-row{
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:nowrap;
    width:max-content;
}
.input{
    height:32px;
    min-width:110px;
    padding:0 8px;
    font-size:12px;
    border-radius:6px;
}
.filter-panel input[type="checkbox"]{
    width:14px;
    height:14px;
}    
.filter-panel::-webkit-scrollbar{
    height:5px;
}

.filter-panel::-webkit-scrollbar-thumb{
    background:#cbd5e1;
    border-radius:20px;
}    
.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background: #ffffff;
}

/* BUTTONS */
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-primary {
  height:32px;
  padding:0 16px;
  font-size:12px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
.fetch-btn{
    margin-left:auto;
    white-space:nowrap;
}  
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
}
.btn-flat {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}
.btn-flat:hover {
  background: #e2e8f0;
  color: #1e293b;
}
.btn-action-resume {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
  border-radius: 6px;
}
.btn-action-resume:hover {
  background: #fde68a;
  color: #92400e;
}
.btn-danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 6px;
}
.btn-danger:hover {
  background: #fee2e2;
  color: #991b1b;
}

/* TABLE OVERHAUL */
.table-wrapper {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  overflow: auto;
  max-height: 82vh;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
.table th {
  background: #f8fafc;
  color: #475569;
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}
.table tbody tr:hover {
  background: #f8fafc;
}

/* STATUS BADGES */
.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  display: inline-block;
  text-align: center;
}
.status-draft { background: #fef3c7; color: #b45309; }
.status-pending { background: #fee2e2; color: #b91c1c; }
.status-ongoing { background: #dbeafe; color: #1d4ed8; }
.status-scheduled { background: #e0e7ff; color: #1e40af; }
.status-completed { background: #dcfce7; color: #15803d; }
.status-rejected { background: #f6f4f3; color: #ff0000; }

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}
.pagination-info {
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
}

/* RESPONSIVE TRIMS */
@media (max-width: 1024px) {
  .filter-panel > div > div { flex-wrap: wrap !important; gap: 10px !important; }
  .input { flex: 1 1 160px; min-width: 160px; }
}
`}</style>
    </div>
  );
}
