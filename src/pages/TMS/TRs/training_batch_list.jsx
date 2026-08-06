// src/pages/TMS/TRs/TrainingBatchList.jsx
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
import BatchListExport from "./BatchListExport";
import BatchRescheduleModal from "./BatchRescheduleModal";

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
  const [search, setSearch] = useState("");
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  // SURGICAL ADDITION: Reschedule Modal States
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleBatchId, setRescheduleBatchId] = useState(null);

  const [tpPartnerId, setTpPartnerId] = useState(null);
  const [tpPartnerName, setTpPartnerName] = useState(null);
  const [dtpDistrictId, setDtpDistrictId] = useState(null);
  const [dtpPartnerId, setDtpPartnerId] = useState(null);
  const [dtpPartnerName, setDtpPartnerName] = useState("");
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

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
    level: "",
    status: "",
    training_type: "",
    batch_type: "",
    theme: "",
    training_plan: "",
    financial_year: "2026-27",
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
    if (role === "smmu" && filters.theme) return { theme_id: filters.theme };
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

        const allThemes = tRes?.data?.results || [];
        setDistricts(dRes?.data?.results || []);

        if (role === "smmu") {
          const myTheme = allThemes.find(
            (t) => Number(t.expert) === Number(user?.id),
          );

          if (myTheme) {
            // dropdown me sirf meri theme dikhegi
            setThemes([myTheme]);

            // theme auto select
            setFilters((prev) => ({
              ...prev,
              theme: String(myTheme.id),
              training_plan: "",
            }));
          } else {
            setThemes([]);
          }
        } else {
          setThemes(allThemes);
        }
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
          search,
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

    if (role === "smmu" && !filters.theme) return;

    didInitRef.current = true;

    const cached = loadCache(getScopeKey());
    if (cached?.payload) setBatches(cached.payload);
    else fetchBatches();
  }, [user?.id, role, requestId, filters.theme]);

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
        <div className="main-area">
          <main style={{ padding: 18, minHeight: "100vh" }}>
            <div style={{ width: "100%", margin: "10px 0" }}>
              {!isRequestScoped && (
                <div
                  style={{
                    background: "#e4ecf5",
                    padding: 16,
                    borderRadius: 10,
                    marginBottom: 14,
                    border: "2px solid #3d6ba6",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="filter-row"
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: 12,
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "auto",
                    }}
                  >
                    {role === "smmu" && (
                      <>
                        <select
                          className="filter-input"
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
                          className="filter-input"
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
                        className="filter-input"
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
                        className="aspirational-box"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 14,
                          color: "#2b4e72",
                          background: "#fff",
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #a7c6ed",
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
                        className="filter-input"
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
                        className="filter-input"
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
                          className="filter-input"
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
                        className="filter-input"
                        value={filters.partner}
                        disabled
                      >
                        <option value={filters.partner}>
                          {dtpPartnerName}
                        </option>
                      </select>
                    )}

                    <select
                      className="filter-input"
                      value={filters.theme}
                      disabled={role === "smmu"}
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

                    <select
                      className="filter-input"
                      value={filters.financial_year}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          financial_year: e.target.value,
                        }))
                      }
                    >
                      <option value="">Financial Year</option>
                      {["2025-26", "2026-27"].map((fy) => (
                        <option key={fy} value={fy}>
                          {fy}
                        </option>
                      ))}
                    </select>

                    {plans.length > 0 && (
                      <select
                        className="filter-input"
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
                      className="filter-input"
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, level: e.target.value }))
                      }
                    >
                      <option value="">Level</option>
                      {["BLOCK", "DISTRICT", "STATE"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <select
                      className="filter-input"
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
                      className="filter-input"
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
                      <option value="STAFF">Staff</option>
                    </select>

                    <select
                      className="filter-input"
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
                  </div>

                  <input
                    type="text"
                    placeholder="Search Batch Code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="..."
                  />

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 16,
                    }}
                  >
                    <button className="fetch-btn" onClick={fetchBatches}>
                      Fetch Batches
                    </button>
                  </div>
                </div>
              )}

              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  borderBottom: "2px solid #a7c6ed",
                  paddingBottom: 8,
                }}
              >
                <h2 style={{ margin: 0, color: "#2b4e72" }}>
                  Training Batches
                </h2>
                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                >
                  <BatchListExport batches={visibleBatches} />
                </div>
              </div>

              {/* TABLE CARD */}
              <div
                style={{
                  background: "#fff",
                  padding: 14,
                  borderRadius: 10,
                  border: "2px solid #3d6ba6",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ maxHeight: "100%", overflow: "auto" }}>
                  <table className="training-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Batch Code</th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Level</th>
                        <th>Type</th>
                        <th>Theme</th>
                        <th>Training Plan</th>
                        <th>Partner</th>
                        <th>Block</th>
                        <th>District</th>
                        <th>Assigned Trainers</th>
                        <th>Count</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={14}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            Loading data...
                          </td>
                        </tr>
                      ) : visibleBatches.length === 0 ? (
                        <tr>
                          <td
                            colSpan={14}
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
                            <td>{formatDate(b.start_date)}</td>
                            <td>{formatDate(b.end_date)}</td>
                            <td>{b.level}</td>
                            <td>{b.batch_type}</td>
                            <td>{b.training_plan.theme.theme_name}</td>
                            <td>{b.training_plan.training_name}</td>
                            <td>{b.centre?.partner?.name || "-"}</td>
                            <td>{b.block?.block_name_en || "-"}</td>
                            <td>{b.district?.district_name_en || "-"}</td>
                            <td>
                              {Array.isArray(b.master_trainers) &&
                              b.master_trainers.length > 0
                                ? b.master_trainers.map((trainer) => (
                                    <div
                                      key={trainer.id}
                                      style={{ marginBottom: 4 }}
                                    >
                                      <strong>{trainer.full_name}</strong>
                                      <br />
                                      <span>
                                        {trainer.designation} (
                                        {trainer.mobile_no})
                                      </span>
                                    </div>
                                  ))
                                : "-"}
                            </td>
                            <td
                              style={{ textAlign: "center", fontWeight: "600" }}
                            >
                              {b.pax_count || 0}
                            </td>

                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  className="btnView"
                                  onClick={() => handleViewBatch(b.id)}
                                >
                                  View
                                </button>

                                {/* SURGICAL ADDITION: Reschedule Button logic */}
                                {((role === "dmmu" &&
                                  String(b.level).toUpperCase() !== "STATE") ||
                                  (role === "smmu" &&
                                    String(b.level).toUpperCase() ===
                                      "STATE")) &&
                                  ["ONGOING", "SCHEDULED", "PENDING"].includes(
                                    String(b.status).toUpperCase(),
                                  ) && (
                                    <button
                                      className="btnView"
                                      style={{ background: "#f59e0b" }}
                                      onClick={() => {
                                        setRescheduleBatchId(b.id);
                                        setRescheduleModalOpen(true);
                                      }}
                                    >
                                      Reschedule
                                    </button>
                                  )}

                                {role === "dtp" &&
                                  (String(b.status).toUpperCase() === "DRAFT" ||
                                    (String(b.status).toUpperCase() ===
                                      "REJECTED" &&
                                      String(b.batch_type).toUpperCase() ===
                                        "SEPARATE")) && (
                                    <button
                                      className="btnView"
                                      onClick={() =>
                                        navigate("/tms/batch-creator/", {
                                          state: {
                                            resume: true,
                                            batchId: b.id,
                                          },
                                        })
                                      }
                                    >
                                      Resume
                                    </button>
                                  )}
                                {((role === "dmmu" &&
                                  String(b.level).toUpperCase() !== "STATE") ||
                                  (role === "smmu" &&
                                    String(b.level).toUpperCase() ===
                                      "STATE")) &&
                                  String(b.status).toUpperCase() ===
                                    "PENDING" && (
                                    <button
                                      className="btnView"
                                      onClick={() =>
                                        navigate(
                                          `/tms/dmmu/batch-review/${b.id}`,
                                        )
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
                                      className="btnDelete"
                                      onClick={() => handleDeleteBatch(b.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                {(role === "training_partner" ||
                                  (role === "dtp" &&
                                    String(b.participant_type).toUpperCase() !==
                                      "STAFF")) &&
                                  ["COMPLETED", "REVIEW"].includes(
                                    String(b.status).toUpperCase(),
                                  ) && (
                                    <button
                                      className="btnView"
                                      onClick={() =>
                                        navigate(`/tms/tp/tr-closure/${b.id}`)
                                      }
                                    >
                                      Closure
                                    </button>
                                  )}
                                {["bmmu", "dmmu", "smmu"].includes(role) && (
                                  <>
                                    {(role === "dmmu" &&
                                      String(b.level).toUpperCase() !==
                                        "STATE") ||
                                    (role === "smmu" &&
                                      String(b.level).toUpperCase() ===
                                        "STATE" &&
                                      String(b.status).toUpperCase() ===
                                        "REVIEW") ? (
                                      <button
                                        className="btnView"
                                        onClick={() =>
                                          role === "dmmu" || role === "smmu"
                                            ? navigate(
                                                `/tms/dmmu/tr-closure/${b.id}`,
                                              )
                                            : navigate(
                                                `/tms/batch-certificate/${b.id}`,
                                              )
                                        }
                                      >
                                        {role === "dmmu" || role === "smmu"
                                          ? "Closure"
                                          : "Certificate"}
                                      </button>
                                    ) : null}
                                    {String(b.status).toUpperCase() ===
                                      "CLOSED" && (
                                      <button
                                        className="btnView"
                                        onClick={() =>
                                          navigate(
                                            `/tms/batch-certificate/${b.id}`,
                                          )
                                        }
                                      >
                                        Certificate
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  <div style={{ color: "#2b4e72", fontSize: 14 }}>
                    Page {currentPage} of {totalPages || 1}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btnPage"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Prev
                    </button>
                    <button
                      className="btnPage"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <BatchRescheduleModal
              isOpen={rescheduleModalOpen}
              batchId={rescheduleBatchId}
              onClose={() => {
                setRescheduleModalOpen(false);
                setRescheduleBatchId(null);
              }}
              onSuccess={() => fetchBatches()}
            />

            <style>{`
              /* LAYOUT FIXES */
              .content-area {
                display: flex;
                flex: 1;
                width: 100%;
              }
              .main-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0; /* Critical: Prevents table from stretching off-screen */
                background-color: #f8fafc;
              }

              /* BUTTON */
              .btnPrimary{
                background:#3d6ba6;
                color:#fff;
                border:none;
                border-radius:6px;
                padding:6px 14px;
                cursor:pointer;
                transition:all .25s ease;
              }

              .btnPrimary:hover{
                transform:translateY(-3px);
                box-shadow:0 6px 12px rgba(0,0,0,0.15);
              }

              /* VIEW BUTTON */
              .btnView{
                background:#5a8cc2;
                color:#fff;
                border:none;
                border-radius:6px;
                padding:5px 12px;
                cursor:pointer;
                  transition:all .25s ease;
              }

              .btnView:hover{
                transform: translateY(-6px);
                box-shadow: 0 10px 18px rgba(0,0,0,0.15);
              }

              /* TABLE */
              .training-table{
                width:100%;
                border-collapse:collapse;
                font-size:14px;
              }

              /* HEADER */
              .training-table thead{
                background:#3d6ba6;
                color:white;
              }

              .training-table th{
                padding:10px;
                text-align:left;
                font-weight:600;
                text-align:center;
                justify-content:center;  
              }

              /* BODY */
              .training-table td{
                padding:10px;
                border-bottom:1px solid #e4ecf5;
                text-align:center;
                justify-content:center;  
              }

              /* ROW BACKGROUND */
              .training-table tbody tr{
                background:#f8fbff;
              }

              /* ALTERNATE ROW */
              .training-table tbody tr:nth-child(even){
                background:#edf4fb;
              }

              /* HOVER */
              .training-table tbody tr:hover{
                background:#a7c6ed;
                transition:background .2s;
              }

              /* LOADING / EMPTY */
              .training-table tbody td{
                color:#1f2937;
              }

              /* DELETE BUTTON */
              .btnDelete{
                background:#ef4444;
                color:#fff;
                border:none;
                border-radius:6px;
                padding:5px 12px;
                cursor:pointer;
                transition:all .25s ease;
              }

              .btnDelete:hover{
                transform: translateY(-3px);
                box-shadow: 0 6px 12px rgba(239, 68, 68, 0.25);
              }

              /* PAGINATION BUTTON */
              .btnPage{
                background:#e4ecf5;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
                color:#2b4e72;
                transition:all .2s ease;
              }

              .btnPage:hover:not(:disabled){
                background:#a7c6ed;
              }

              .btnPage:disabled{
                opacity:0.5;
                cursor:not-allowed;
              }

              /* ACTIVE PAGE */
              .activePage{
                background:#3d6ba6 !important;
                color:#fff !important;
              }

              .status-badge{
                display:inline-block;
                padding:6px 12px;
                border-radius:999px;
                font-size:12px;
                font-weight:700;
                letter-spacing:.3px;
                text-transform:uppercase;
                min-width:95px;
                text-align:center;
                border:1px solid transparent;
              }

              /* DRAFT */
              .status-draft{
                background:#f3f4f6;
                color:#4b5563;
                border-color:#d1d5db;
              }

              /* PENDING */
              .status-pending{
                background:#fef3c7;
                color:#92400e;
                border-color:#fcd34d;
              }

              /* REJECTED */
              .status-rejected{
                background:#fee2e2;
                color:#b91c1c;
                border-color:#fca5a5;
              }

              /* ONGOING */
              .status-ongoing{
                background:#D0E3CC;
                color:#1C881B;
                border-color:#1C881B;
              }

              /* SCHEDULED */
              .status-scheduled{
                background:#ede9fe;
                color:#6d28d9;
                border-color:#c4b5fd;
              }

              /* COMPLETED */
              .status-completed{
                background:#dcfce7;
                color:#166534;
                border-color:#86efac;
              }

              /* REVIEW */
              .status-review{
                background:#ffedd5;
                color:#c2410c;
                border-color:#fdba74;
              }

              /* CLOSED */
              .status-closed{
                background:#cffafe;
                color:#155e75;
                border-color:#67e8f9;
              }

              /* FILTER STYLES */
              .filter-input{
                border:1px solid #3d6ba6;
                border-radius:6px;
                padding:7px 10px;
                background:#fff;
                outline:none;
                font-size:14px;
                min-width:160px;
                transition:all .2s ease;
              }

              .filter-input:focus{
                border-color:#5a8cc2;
                box-shadow:0 0 0 2px rgba(61,107,166,0.2);
              }

              .filter-input:disabled {
                background-color: #f1f5f9;
                color: #64748b;
                cursor: not-allowed;
                border-color: #cbd5e1;
              }

              .fetch-btn{
                background:#3d6ba6;
                color:#fff;
                border:none;
                padding:8px 18px;
                border-radius:6px;
                font-weight:500;
                cursor:pointer;
                transition:all .25s ease;
                white-space: nowrap;
              }

              .fetch-btn:hover{
                background:#5a8cc2;
                transform:translateY(-2px);
                box-shadow:0 6px 14px rgba(0,0,0,0.12);
              }

              @media (max-width: 1200px){
                .filter-row{
                  flex-wrap: wrap !important;
                  white-space: normal !important;
                }
              }

              @media (max-width: 768px){
                .filter-input{
                  min-width: 140px;
                  flex: 1 1 45%; 
                }
                .aspirational-box{
                  flex: 1 1 45%;
                  justify-content: center;
                }
              }

              @media (max-width: 480px){
                .filter-input{
                  flex: 1 1 100%;
                  min-width: unset;
                }
                .aspirational-box{
                  flex: 1 1 100%;
                }
                .fetch-btn{
                  width: 100%;
                }
              }
          `}</style>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
