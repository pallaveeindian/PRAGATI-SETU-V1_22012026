// src/pages/TMS/TRs/training_req_list_filters.jsx
import React, { useEffect, useState } from "react";

import { LOOKUP_API, TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

/* ================= GEO SCOPE HELPERS ================= */
const GEOSCOPE_KEY = "ps_user_geoscope";

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
/* ===================================================== */

export default function TrainingReqListFilter({ user, onApply }) {
  const role = getCanonicalRole(user || {});

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    mandal_id: "",
    district_category_id: "",
    district_id: "",
    block_id: "",
    aspirational_only: false,

    partner_id: "",
    theme_id: "",
    training_plan_id: "",

    status: "",
    training_type: "",
    level: "",
    batch_type: "",

    financial_year: "2026-27",
  });

  /* ================= LOOKUPS ================= */
  const [mandals, setMandals] = useState([]);
  const [districtCategories, setDistrictCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partnerId, setPartnerId] = useState("");
  const [themes, setThemes] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);

  /* ================= INITIAL LOOKUPS ================= */
  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        const [districtRes, themeRes] = await Promise.all([
          LOOKUP_API.districts.list({ page_size: 100 }),
          TMS_API.trainingThemes.list({ page_size: 100 }),
        ]);

        const allThemes = themeRes?.data?.results || [];
        setDistricts(districtRes?.data?.results || []);

        if (role === "smmu") {
          const myTheme = allThemes.find(
            (t) => Number(t.expert) === Number(user?.id),
          );

          if (myTheme) {
            // sirf apni theme dikhao
            setThemes([myTheme]);

            // auto select
            setFilters((prev) => ({
              ...prev,
              theme_id: String(myTheme.id),
              training_plan_id: "",
            }));

            // optional: auto fetch
            onApply({
              theme_id: myTheme.id,
            });
          } else {
            setThemes([]);
          }
        } else {
          setThemes(allThemes);
        }

        if (role === "smmu") {
          const [dcRes, mRes] = await Promise.all([
            LOOKUP_API.district_categories.list(),
            LOOKUP_API.mandals.list({ page_size: 200 }),
          ]);
          setDistrictCategories(dcRes?.data?.results || []);
          setMandals(mRes?.data?.results || []);
        }

        if (role !== "training_partner" && role !== "tpcp") {
          const pRes = await TMS_API.trainingPartners.list({ page_size: 100 });
          setPartners(pRes?.data?.results || []);
        }

        if (role === "dtp") {
          const pRes = await TMS_API.trainingPartners.list({ page_size: 100 });
          setPartners(pRes?.data?.results || []);
          const resp = await TMS_API.parentPartner();
          setPartnerId(resp.data.partner_id);
        }
      } catch (err) {
        console.error("Training request filter lookup failed", err);
      }
    })();
  }, [role, user?.id, partnerId]);

  /* ================= DTP AUTO DISTRICT ================= */
  useEffect(() => {
    if (role !== "dtp") return;

    const geo = getGeoscope() || {};
    const dtpDistrictId = geo.district_id || safeFirst(geo.districts);

    if (!dtpDistrictId) return;

    setFilters((f) => {
      // Ensure it updates both if the partnerId resolves slightly after district
      if (f.district_id === dtpDistrictId && f.partner_id === partnerId)
        return f;
      return {
        ...f,
        district_id: dtpDistrictId,
        partner_id: partnerId,
        mandal_id: "",
        block_id: "",
        district_category_id: "",
        aspirational_only: false,
      };
    });
  }, [role, partnerId]);

  /* ================= DMMU AUTO DISTRICT ================= */
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
        mandal_id: "",
        block_id: "",
        district_category_id: "",
        aspirational_only: false,
      };
    });
  }, [role]);

  /* ================= MANDAL BASED ON DISTRICT ================= */
  useEffect(() => {
    if (!filters.district_id || role !== "smmu") return;

    LOOKUP_API.mandals
      .list({ district: filters.district_id })
      .then((r) => setMandals(r?.data?.results || []))
      .catch(() => {});
  }, [filters.district_id, role]);

  /* ================= BLOCK BASED ON DISTRICT ================= */
  useEffect(() => {
    if (!filters.district_id) {
      setBlocks([]);
      setFilters((f) => ({ ...f, block_id: "" }));
      return;
    }

    LOOKUP_API.blocks
      .list({ district_id: filters.district_id })
      .then((r) => {
        let data = r?.data?.results || [];
        if (filters.aspirational_only) {
          data = data.filter((b) => Number(b.is_aspirational) === 1);
        }
        setBlocks(data);
      })
      .catch(() => setBlocks([]));
  }, [filters.district_id, filters.aspirational_only]);

  /* ================= TRAINING PLAN BASED ON THEME ================= */
  useEffect(() => {
    if (!filters.theme_id) {
      setTrainingPlans([]);
      setFilters((f) => ({ ...f, training_plan_id: "" }));
      return;
    }

    TMS_API.trainingPlans
      .list({ theme: filters.theme_id })
      .then((r) => setTrainingPlans(r?.data?.results || []))
      .catch(() => setTrainingPlans([]));
  }, [filters.theme_id]);

  /* ================= FETCH ================= */
  function handleFetch() {
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v !== false),
    );
    onApply(cleaned);
  }

  return (
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
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap", // original (desktop same)
            gap: 12,
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
          className="filter-row" // 🔽 ADDED for responsive control
        >
          {/* ===== Mandal (ONLY SMMU) ===== */}
          {role === "smmu" && (
            <select
              className="filter-input"
              value={filters.mandal_id}
              onChange={(e) =>
                setFilters((f) => ({ ...f, mandal_id: e.target.value }))
              }
            >
              <option value="">Mandal</option>
              {mandals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}

          {/* ===== District Category (ONLY SMMU) ===== */}
          {role === "smmu" && (
            <select
              className="filter-input"
              value={filters.district_category_id}
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
          )}

          {/* ===== District ===== */}
          {role !== "bmmu" && (
            <select
              className="filter-input"
              value={filters.district_id}
              disabled={role === "dmmu" || role === "dtp"} // UPDATED: Lock for DTP
              onChange={(e) =>
                role === "dmmu" || role === "dtp"
                  ? null
                  : setFilters((f) => ({
                      ...f,
                      district_id: e.target.value,
                      mandal_id: "",
                      block_id: "",
                    }))
              }
            >
              <option value="">District</option>
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {d.district_name_en}
                </option>
              ))}
            </select>
          )}

          {/* ===== Aspirational ===== */}
          {role !== "bmmu" && (
            <label
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
              className="aspirational-box" // 🔽 ADDED
            >
              <input
                type="checkbox"
                checked={filters.aspirational_only}
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

          {/* ===== Block ===== */}
          {role !== "bmmu" && blocks.length > 0 && (
            <select
              className="filter-input"
              value={filters.block_id}
              onChange={(e) =>
                setFilters((f) => ({ ...f, block_id: e.target.value }))
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

          {/* ===== Partner ===== */}
          {role !== "training_partner" && role !== "tpcp" && (
            <select
              className="filter-input"
              value={filters.partner_id}
              disabled={role === "dtp"} // UPDATED: Lock for DTP
              onChange={(e) =>
                role === "dtp"
                  ? null
                  : setFilters((f) => ({ ...f, partner_id: e.target.value }))
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
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: 12,
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
          className="filter-row" // 🔽 ADDED
        >
          {/* ===== Theme ===== */}
          <select
            className="filter-input"
            value={filters.theme_id}
            disabled={role === "smmu"}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                theme_id: e.target.value,
                training_plan_id: "",
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

          {/* ===== Training Plan ===== */}
          {trainingPlans.length > 0 && (
            <select
              className="filter-input"
              value={filters.training_plan_id}
              onChange={(e) =>
                setFilters((f) => ({ ...f, training_plan_id: e.target.value }))
              }
            >
              <option value="">Training Plan</option>
              {trainingPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.training_name}
                </option>
              ))}
            </select>
          )}

          {/* ===== Status ===== */}
          <select
            className="filter-input"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">Status</option>
            {["BATCHING", "COMPLETED"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* ===== Financial Year ===== */}
          <select
            className="filter-input"
            value={filters.financial_year}
            onChange={(e) =>
              setFilters((f) => ({ ...f, financial_year: e.target.value }))
            }
          >
            <option value="">Financial Year</option>
            {["2025-26", "2026-27"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* ===== Participant ===== */}
          <select
            className="filter-input"
            value={filters.training_type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, training_type: e.target.value }))
            }
          >
            <option value="">Participant</option>
            <option value="BENEFICIARY">Beneficiary</option>
            <option value="TRAINER">Trainer</option>
          </select>

          {/* ===== Level ===== */}
          <select
            className="filter-input"
            value={filters.level}
            onChange={(e) =>
              setFilters((f) => ({ ...f, level: e.target.value }))
            }
          >
            <option value="">Level</option>
            <option value="STATE">State</option>
            <option value="DISTRICT">District</option>
            <option value="BLOCK">Block</option>
          </select>
        </div>
      </div>

      {/* BUTTON */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <button className="fetch-btn" onClick={handleFetch}>
          Fetch Training Requests
        </button>
      </div>

      {/* STYLES */}
      <style>{`

/* ORIGINAL */
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
}

.fetch-btn:hover{
  background:#5a8cc2;
  transform:translateY(-2px);
  box-shadow:0 6px 14px rgba(0,0,0,0.12);
}

/* ========================= */
/* 🔽 ADDED: RESPONSIVENESS */
/* ========================= */

@media (max-width: 1200px){
  .filter-row{
    flex-wrap: wrap !important; /* 🔽 allow wrap */
    white-space: normal !important;
  }
}

@media (max-width: 768px){
  .filter-input{
    min-width: 140px;
    flex: 1 1 45%; /* 🔽 2 per row */
  }

  .aspirational-box{
    flex: 1 1 45%;
    justify-content: center;
  }
}

@media (max-width: 480px){
  .filter-input{
    flex: 1 1 100%; /* 🔽 full width */
    min-width: unset;
  }

  .aspirational-box{
    flex: 1 1 100%;
  }

  .fetch-btn{
    width: 100%; /* 🔽 full width button */
  }
}

`}</style>
    </div>
  );
}
