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
  });

  /* ================= LOOKUPS ================= */
  const [mandals, setMandals] = useState([]);
  const [districtCategories, setDistrictCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [partners, setPartners] = useState([]);
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

        setDistricts(districtRes?.data?.results || []);
        setThemes(themeRes?.data?.results || []);

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
      } catch (err) {
        console.error("Training request filter lookup failed", err);
      }
    })();
  }, [role, user?.id]);

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

  /* ================= UI ================= */
  return (
    <div
      style={{
        background: "#fff",
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {/* ===== Mandal (ONLY SMMU) ===== */}
        {role === "smmu" && (
          <select
            className="input"
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
            className="input"
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
        {/* ===== District (NOT BMMU, LOCKED FOR DMMU) ===== */}
        {role !== "bmmu" && (
          <select
            className="input"
            value={filters.district_id}
            disabled={role === "dmmu"}
            onChange={(e) =>
              role === "dmmu"
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

        {/* ===== Aspirational (NOT BMMU) ===== */}
        {role !== "bmmu" && (
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
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

        {/* ===== Block (NOT BMMU) ===== */}
        {role !== "bmmu" && blocks.length > 0 && (
          <select
            className="input"
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
            className="input"
            value={filters.partner_id}
            onChange={(e) =>
              setFilters((f) => ({ ...f, partner_id: e.target.value }))
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

        {/* ===== Theme ===== */}
        <select
          className="input"
          value={filters.theme_id}
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
            className="input"
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
          className="input"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">Status</option>
          {[
            "BATCHING",
            "PENDING",
            "ONGOING",
            "REVIEW",
            "COMPLETED",
            "REJECTED",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* ===== Participant ===== */}
        <select
          className="input"
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
          className="input"
          value={filters.level}
          onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value }))}
        >
          <option value="">Level</option>
          <option value="STATE">State</option>
          <option value="DISTRICT">District</option>
          <option value="BLOCK">Block</option>
        </select>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <button className="btn btn-primary" onClick={handleFetch}>
            Fetch Training Requests
          </button>
        </div>
      </div>
    </div>
  );
}
