import React from "react";

export default function TrainingBatchFilters({
  role,
  filters,
  setFilters,
  mandals,
  districtCategories,
  districts,
  blocks,
  centres,
  partners,
  themes,
  plans,
  dtpPartnerName,
  onFetch,
}) {
  const update = (key, value, extra = {}) =>
    setFilters((current) => ({ ...current, [key]: value, ...extra }));

  return (
    <div className="filter-panel">
      <div className="filter-row">
        {role === "smmu" && (
          <>
            <select className="input" defaultValue="" onChange={(e) => update("mandal_id", e.target.value)}>
              <option value="">Mandal</option>
              {mandals.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className="input" defaultValue="" onChange={(e) => update("district_category_id", e.target.value)}>
              <option value="">District Category</option>
              {districtCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </>
        )}

        {role !== "bmmu" && (
          <select className="input" value={filters.district_id} disabled={role === "dmmu" || role === "dtp"} onChange={(e) => update("district_id", e.target.value, { block_id: "", aspirational_only: false })}>
            <option value="">District</option>
            {districts.map((item) => <option key={item.district_id} value={item.district_id}>{item.district_name_en}</option>)}
          </select>
        )}

        {role !== "bmmu" && (
          <label className="filter-check">
            <input type="checkbox" checked={filters.aspirational_only} disabled={role === "dtp"} onChange={(e) => update("aspirational_only", e.target.checked, { block_id: "" })} />
            Aspirational
          </label>
        )}

        {role !== "bmmu" && filters.district_id && (
          <select className="input" value={filters.block_id} onChange={(e) => update("block_id", e.target.value)}>
            <option value="">Block</option>
            {blocks.map((item) => <option key={item.block_id} value={item.block_id}>{item.block_name_en}</option>)}
          </select>
        )}

        {role === "training_partner" && (
          <select className="input" value={filters.centre_id} onChange={(e) => update("centre_id", e.target.value)}>
            <option value="">Centre</option>
            {centres.map((item) => <option key={item.id} value={item.id}>{item.venue_name}</option>)}
          </select>
        )}

        {role !== "training_partner" && role !== "dtp" && role !== "tpcp" && (
          <select className="input" value={filters.partner} onChange={(e) => update("partner", e.target.value)}>
            <option value="">Training Partner</option>
            {partners.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        )}

        {role === "dtp" && <select className="input" value={filters.partner} disabled><option value={filters.partner}>{dtpPartnerName}</option></select>}

        <select className="input" value={filters.theme} disabled={role === "smmu"} onChange={(e) => update("theme", e.target.value, { training_plan: "" })}>
          <option value="">Training Theme</option>
          {themes.map((item) => <option key={item.id} value={item.id}>{item.theme_name}</option>)}
        </select>

        {plans.length > 0 && (
          <select className="input" value={filters.training_plan} onChange={(e) => update("training_plan", e.target.value)}>
            <option value="">Training Plan</option>
            {plans.map((item) => <option key={item.id} value={item.id}>{item.training_name}</option>)}
          </select>
        )}

        <select className="input" value={filters.level} onChange={(e) => update("level", e.target.value)}>
          <option value="">Level</option>
          {["BLOCK", "DISTRICT", "STATE"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="input" value={filters.status} onChange={(e) => update("status", e.target.value)}>
          <option value="">Status</option>
          {["DRAFT", "PENDING", "REJECTED", "ONGOING", "SCHEDULED", "COMPLETED", "REVIEW", "CLOSED"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="input" value={filters.training_type} onChange={(e) => update("training_type", e.target.value)}>
          <option value="">Participant</option><option value="BENEFICIARY">Beneficiary</option><option value="TRAINER">Trainer</option>
        </select>
        <select className="input" value={filters.batch_type} onChange={(e) => update("batch_type", e.target.value)}>
          <option value="">Batch Type</option><option value="SEPARATE">Separate</option><option value="COMBINED">Combined</option>
        </select>
        <button className="btn btn-primary fetch-btn" onClick={onFetch}>Fetch Batches</button>
      </div>
    </div>
  );
}
