// src/pages/TMS/CreateTR/Step1PlanSelection.jsx
import React from "react";
import { TMS_API } from "../../../api/axios";

export default function Step1PlanSelection({
  plans,
  selectedPlan,
  setSelectedPlan,
  setSelectedTheme,
  setAutoPartnerAssigned,
  setForm,
  form,
  districtId,
  user,
  geoscopeCached,
  preloadThemes,
  partners,
  goToNext,
}) {
  const selectedPlanTitle =
    selectedPlan &&
    (selectedPlan.training_name ||
      selectedPlan.training_plan_name ||
      selectedPlan.trainingTitle ||
      selectedPlan.name ||
      `Plan ${selectedPlan.id}`);

  async function handlePlanSelect(plan) {
    setSelectedPlan(plan);
    setSelectedTheme(null);
    setAutoPartnerAssigned(false);
    setForm((f) => ({ ...f, partner: "" })); // reset partner

    if (!plan) return;

    // Resolve Theme for display
    let resolvedThemeName = plan?.theme_name || null;
    if (plan?.theme) {
      try {
        const cachedTheme = (preloadThemes || []).find(
          (t) => String(t.id) === String(plan.theme),
        );
        if (cachedTheme) {
          setSelectedTheme(cachedTheme);
          resolvedThemeName =
            resolvedThemeName || cachedTheme.theme_name || cachedTheme.name;
        } else {
          const resp = await TMS_API.trainingThemes.retrieve(plan.theme);
          const t = resp?.data ?? resp ?? null;
          setSelectedTheme(t);
          resolvedThemeName = resolvedThemeName || t?.theme_name || t?.name;
        }
      } catch (e) {
        setSelectedTheme(null);
      }
    }

    // New Direct Backend Partner Assignment
    if (plan?.id) {
      try {
        const currentDistrict =
          districtId ??
          geoscopeCached?.districts?.[0] ??
          geoscopeCached?.district_id ??
          user?.district_id ??
          null;

        if (!currentDistrict) {
          console.warn("Cannot auto-assign partner: User district unknown.");
          setAutoPartnerAssigned(false);
          return;
        }

        // Adjust 'financial_year' logic here based on your app's actual requirement.
        // Hardcoding for now based on your prompt example.
        const response = await TMS_API.trainingPartnerByTarget({
          district_id: currentDistrict,
          financial_year: form.financial_year,
          training_plan_id: plan.id,
        });

        const data = response?.data ?? response;

        if (Array.isArray(data) && data.length > 0 && data[0].id) {
          setForm((f) => ({ ...f, partner: String(data[0].id) }));
          setAutoPartnerAssigned(true);
        } else {
          setAutoPartnerAssigned(false);
        }
      } catch (e) {
        console.warn("failed to auto-assign training partner", e);
        setAutoPartnerAssigned(false);
      }
    }
  }

  const headerGradient = {
    background: "linear-gradient(90deg, #e4ecf5, #a7c6ed)",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
    border: "2px solid #3d6ba6",
  };

  const btnPrimary = {
    background: "linear-gradient(20deg, #e4ecf5, #5a8cc2)",
    border: "2px solid #3d6ba6",
    color: "#111827",
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

  return (
    <>
      <h3 style={headerGradient}>1 — Choose Training Plan</h3>

      {/* NEW: Financial Year Dropdown */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Select Financial Year <span style={{ color: "red" }}>*</span>
        </label>
        <select
          value={form.financial_year}
          onChange={(e) => {
            setForm((f) => ({
              ...f,
              financial_year: e.target.value,
              partner: "",
            }));
            setSelectedPlan(null); // Reset plan if year changes
            setAutoPartnerAssigned(false);
          }}
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "2px solid #3d6ba6",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <option value="">-- select financial year --</option>
          <option value="2024-25">2024-25</option>
          <option value="2025-26">2025-26</option>
          <option value="2026-27">2026-27</option>
        </select>
      </div>

      <div style={{ marginBottom: 12, opacity: form.financial_year ? 1 : 0.5 }}>
        <label
          style={{
            display: "block",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Training Plan (allowed for your role)
        </label>

        <select
          disabled={!form.financial_year}
          value={selectedPlan?.id || ""}
          onChange={(e) => {
            const id = e.target.value;
            const pl = plans.find((p) => String(p.id) === String(id));
            handlePlanSelect(pl || null);
          }}
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "2px solid #3d6ba6",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <option value="">-- select training plan --</option>
          {plans.map((p) => {
            const title =
              p.training_name ||
              p.training_plan_name ||
              p.trainingTitle ||
              p.name ||
              `Plan ${p.id}`;

            return (
              <option key={p.id} value={p.id}>
                {title} {p.level_of_training ? `(${p.level_of_training})` : ""}
              </option>
            );
          })}
        </select>
      </div>

      {selectedPlan ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #eef2f6",
            borderRadius: 6,
          }}
        >
          <h3 style={{ margin: "6px 0" }}>{selectedPlanTitle}</h3>
          <div style={{ color: "#6c757d", marginBottom: 8 }}>
            {selectedPlan.training_objective || selectedPlan.description || ""}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>Duration:</strong> {selectedPlan.no_of_days ?? "—"} days
            </div>
            <div>
              <strong>Type:</strong> {selectedPlan.type_of_training || "—"}
            </div>
            <div>
              <strong>Level:</strong> {selectedPlan.level_of_training || "—"}
            </div>
            <div>
              <strong>Theme:</strong>{" "}
              {selectedPlan.theme_name || selectedPlan.theme || "—"}
            </div>
          </div>
        </div>
      ) : (
        <div className="muted">
          Select a training plan to preview details and choose participants.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          className="btnPrimaryHover"
          style={btnPrimary}
          onClick={goToNext}
          disabled={!selectedPlan}
        >
          Next
        </button>
      </div>
    </>
  );
}
