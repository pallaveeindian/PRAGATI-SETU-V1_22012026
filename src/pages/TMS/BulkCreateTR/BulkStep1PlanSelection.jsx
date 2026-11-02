// src\pages\TMS\BulkCreateTR\BulkStep1PlanSelection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { TMS_API } from "../../../api/axios";

const getList = (response) => {
  const data = response?.data ?? response ?? [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.data)) return data.data;

  return [];
};

export default function BulkStep1PlanSelection({
  selectedPlan,
  setSelectedPlan,
  setSelectedTheme,
  setAutoPartnerAssigned,
  form,
  setForm,
  districtId,
  setDistrictId,
  districts = [],
  user,
  preloadThemes = [],
  partners = [],
  onPlanChanged,
  onDistrictChanged,

  // NEW: Bulk restriction props
  lockedTrainingType = null,
  lockedFinancialYear = "",
  lockedTrainingPlan = null,
  isDistrictReserved = () => false,
}) {
  const [smmuPlans, setSmmuPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerMissing, setPartnerMissing] = useState(false);

  const myTheme = useMemo(
    () =>
      preloadThemes.find((theme) => Number(theme.expert) === Number(user?.id)),
    [preloadThemes, user?.id],
  );

  // The first saved draft decides the participant type.
  const activeTrainingType = lockedTrainingType || form.training_type;

  // District uniqueness applies to TRAINER and STAFF only.
  const restrictDistricts =
    activeTrainingType === "TRAINER" || activeTrainingType === "STAFF";

  const hasSelectedYearAndPlan = Boolean(
    form.financial_year && selectedPlan?.id,
  );

  const batchPlanLocked = Boolean(
    lockedFinancialYear && lockedTrainingPlan != null,
  );

  const yearLocked = hasSelectedYearAndPlan || batchPlanLocked;

  const planLocked =
    hasSelectedYearAndPlan || (batchPlanLocked && Boolean(selectedPlan?.id));

  // ============================================
  // LOAD SMMU TRAINING PLANS
  // ============================================
  useEffect(() => {
    if (!form.financial_year || !myTheme?.id) {
      setSmmuPlans([]);
      setPlansLoading(false);
      return;
    }

    let active = true;

    setPlansLoading(true);

    TMS_API.trainingPlans
      .list({
        theme: myTheme.id,
        limit: 500,
      })
      .then((response) => {
        if (!active) return;
        setSmmuPlans(getList(response));
      })
      .catch((error) => {
        if (!active) return;

        console.error("Failed to load SMMU training plans:", error);
        setSmmuPlans([]);
      })
      .finally(() => {
        if (active) setPlansLoading(false);
      });

    return () => {
      active = false;
    };
  }, [form.financial_year, myTheme?.id]);

  // Include the current plan even if its list is still loading.
  const availablePlans = useMemo(() => {
    const plans = [...smmuPlans];

    if (
      selectedPlan?.id &&
      !plans.some((plan) => String(plan.id) === String(selectedPlan.id))
    ) {
      plans.unshift(selectedPlan);
    }

    return plans;
  }, [smmuPlans, selectedPlan]);

  // ============================================
  // AUTO-ASSIGN TRAINING PARTNER
  // ============================================
  useEffect(() => {
    if (!form.financial_year || !selectedPlan?.id || !districtId) {
      setPartnerLoading(false);
      setPartnerMissing(false);
      return;
    }

    let active = true;

    setPartnerLoading(true);
    setPartnerMissing(false);

    TMS_API.trainingPartnerByTarget({
      district_id: districtId,
      financial_year: form.financial_year,
      training_plan_id: selectedPlan.id,
    })
      .then((response) => {
        if (!active) return;

        const matches = getList(response);
        const partnerId = matches[0]?.id;

        setForm((previous) => ({
          ...previous,
          partner: partnerId ? String(partnerId) : "",
        }));

        setAutoPartnerAssigned(Boolean(partnerId));
        setPartnerMissing(!partnerId);
      })
      .catch((error) => {
        if (!active) return;

        console.error("Failed to auto-assign training partner:", error);

        setForm((previous) => ({
          ...previous,
          partner: "",
        }));

        setAutoPartnerAssigned(false);
        setPartnerMissing(true);
      })
      .finally(() => {
        if (active) setPartnerLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    form.financial_year,
    selectedPlan?.id,
    districtId,
    setForm,
    setAutoPartnerAssigned,
  ]);

  // ============================================
  // FINANCIAL YEAR CHANGE
  // ============================================
  const handleYearChange = (year) => {
    if (yearLocked) return;

    onPlanChanged?.();

    setSelectedPlan(null);
    setSelectedTheme(null);
    setDistrictId(null);
    setAutoPartnerAssigned(false);

    setForm((previous) => ({
      ...previous,
      financial_year: year,
      partner: "",
    }));
  };

  // ============================================
  // TRAINING PLAN CHANGE
  // ============================================
  const handlePlanChange = (id) => {
    if (planLocked) return;

    // After the first saved draft, only its plan is valid.
    if (
      lockedTrainingPlan != null &&
      String(id) !== String(lockedTrainingPlan)
    ) {
      return;
    }

    const plan =
      availablePlans.find((item) => String(item.id) === String(id)) || null;

    if (String(plan?.id ?? "") !== String(selectedPlan?.id ?? "")) {
      onPlanChanged?.();
    }

    setSelectedPlan(plan);
    setDistrictId(null);
    setAutoPartnerAssigned(false);

    setForm((previous) => ({
      ...previous,
      partner: "",
    }));

    const theme = preloadThemes.find(
      (item) => String(item.id) === String(plan?.theme),
    );

    setSelectedTheme(theme || null);
  };

  // ============================================
  // DISTRICT AVAILABILITY
  // ============================================
  const districtAlreadyUsed = (id) => {
    if (!restrictDistricts) return false;

    return isDistrictReserved(id);
  };

  const handleDistrictChange = (id) => {
    if (id && districtAlreadyUsed(id)) {
      alert(
        "This district has already been used in another " +
          "Bulk Training Request. Please select a different district.",
      );
      return;
    }

    const selected = id ? Number(id) : null;

    if (String(selected) !== String(districtId)) {
      onDistrictChanged?.();
    }

    setDistrictId(selected);

    setForm((previous) => ({
      ...previous,
      partner: "",
    }));

    setAutoPartnerAssigned(false);
    setPartnerMissing(false);
  };

  const planName =
    selectedPlan?.training_name ||
    selectedPlan?.training_plan_name ||
    selectedPlan?.name ||
    "";

  const partnerName = partners.find(
    (partner) => String(partner.id) === String(form.partner),
  )?.name;

  const usedDistrictCount = restrictDistricts
    ? districts.filter((district) =>
        districtAlreadyUsed(district.district_id ?? district.id),
      ).length
    : 0;

  return (
    <div className="bulk-plan-panel" aria-label="Choose training plan">
      <div className="bulk-plan-grid">
        {/* FINANCIAL YEAR */}
        <label className="bulk-field">
          <span>
            Financial Year <b>*</b>
          </span>

          <select
            value={form.financial_year || ""}
            disabled={yearLocked}
            onChange={(event) => handleYearChange(event.target.value)}
          >
            <option value="">-- Select Financial Year --</option>

            <option value="2026-27">2026-27</option>
          </select>
        </label>

        {/* TRAINING PLAN */}
        <label className="bulk-field">
          <span>
            Training Plan <b>*</b>
          </span>

          <select
            value={selectedPlan?.id || ""}
            disabled={!form.financial_year || plansLoading || planLocked}
            onChange={(event) => handlePlanChange(event.target.value)}
          >
            <option value="">
              {plansLoading ? "Loading plans..." : "-- Select Training Plan --"}
            </option>

            {availablePlans.map((plan) => {
              const isOtherPlan =
                lockedTrainingPlan != null &&
                String(plan.id) !== String(lockedTrainingPlan);

              return (
                <option key={plan.id} value={plan.id} disabled={isOtherPlan}>
                  {plan.training_name ||
                    plan.training_plan_name ||
                    plan.name ||
                    `Plan ${plan.id}`}
                </option>
              );
            })}
          </select>
        </label>

        {/* TARGET DISTRICT */}
        <label className="bulk-field">
          <span>
            Target District <b>*</b>
          </span>

          <select
            value={districtId || ""}
            disabled={!selectedPlan}
            onChange={(event) => handleDistrictChange(event.target.value)}
          >
            <option value="">-- Select District --</option>

            {districts.map((district) => {
              const id = district.district_id ?? district.id;

              const name =
                district.district_name_en ||
                district.district_name ||
                district.name ||
                `District ${id}`;

              const alreadyUsed = districtAlreadyUsed(id);

              return (
                <option key={id} value={id} disabled={alreadyUsed}>
                  {name}
                  {alreadyUsed ? " (Already used)" : ""}
                </option>
              );
            })}
          </select>
        </label>

        {/* TRAINING PARTNER */}
        <label className="bulk-field">
          <span>Training Partner</span>

          <input
            readOnly
            value={
              partnerLoading
                ? "Finding partner..."
                : partnerName ||
                  (form.partner ? `Partner ID ${form.partner}` : "Not assigned")
            }
            title={
              partnerName || "Automatically assigned by year, plan and district"
            }
          />
        </label>
      </div>

      {/* BULK SELECTION INFORMATION */}
      {restrictDistricts && usedDistrictCount > 0 && (
        <p className="bulk-muted" style={{ marginTop: 10 }}>
          {usedDistrictCount} district(s) already used. Previously selected
          districts are disabled for{" "}
          {activeTrainingType === "TRAINER" ? "Master Trainer" : "Staff"}{" "}
          requests.
        </p>
      )}

      {!restrictDistricts && activeTrainingType === "BENEFICIARY" && (
        <p className="bulk-muted" style={{ marginTop: 10 }}>
          Beneficiary requests may reuse a district. Previously used blocks will
          be disabled in the participant selection section.
        </p>
      )}

      {yearLocked && (
        <p className="bulk-muted" style={{ marginTop: 8 }}>
          Financial Year and Training Plan are locked for this bulk selection.
        </p>
      )}

      {/* TRAINING PLAN INFORMATION */}
      {selectedPlan ? (
        <div className="bulk-plan-info">
          <div className="bulk-plan-symbol" aria-hidden="true">
            ▣
          </div>

          <div className="bulk-plan-description">
            <strong>{planName}</strong>

            <p>
              {selectedPlan.training_objective ||
                selectedPlan.description ||
                "Training plan selected"}
            </p>

            <div className="bulk-plan-metadata">
              <span>
                <b>Duration:</b> {selectedPlan.no_of_days ?? "—"} days
              </span>

              <span>
                <b>Type:</b> {selectedPlan.type_of_training || "—"}
              </span>

              <span>
                <b>Level:</b> {selectedPlan.level_of_training || "—"}
              </span>

              <span>
                <b>Theme:</b>{" "}
                {selectedPlan.theme_name || myTheme?.theme_name || "—"}
              </span>
            </div>
          </div>

          {form.partner && !partnerLoading && (
            <span className="bulk-partner-pill">✓ Partner auto-assigned</span>
          )}
        </div>
      ) : (
        <p className="bulk-muted">
          Select a training plan to view its details and choose participants
          below.
        </p>
      )}

      {partnerMissing && (
        <p className="bulk-warning">
          No training partner has been assigned a target for this plan and
          district.
        </p>
      )}
    </div>
  );
}
