// src/pages/TMS/CreateTR/Step1PlanSelection.jsx
import React, { useState, useEffect } from "react";
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
  setDistrictId,
  districts,
  user,
  geoscopeCached,
  preloadThemes,
  partners,
  goToNext,
}) {
  const isSMMU =
    user?.role_id == 3 || String(user?.role).toLowerCase().includes("smmu");
  const [smmuPlans, setSmmuPlans] = useState([]);
  const [smmuLoading, setSmmuLoading] = useState(false);

  const [themePlans, setThemePlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [autoPartnerName, setAutoPartnerName] = useState("");

  // SURGICAL ADDITION: Fetch plans dynamically strictly for the SMMU's assigned theme
  useEffect(() => {
    if (isSMMU && form.financial_year) {
      const myTheme = (preloadThemes || []).find(
        (t) => Number(t.expert) === Number(user?.id),
      );
      if (myTheme) {
        setSelectedThemeId(String(myTheme.id));
      } else {
        setSelectedThemeId("");
      }
    }
  }, [isSMMU, form.financial_year, preloadThemes, user?.id]);

  useEffect(() => {
    if (!selectedThemeId) {
      setThemePlans([]);
      setPlansLoading(false);
      return undefined;
    }

    let active = true;
    setThemePlans([]);
    setPlansLoading(true);

    TMS_API.trainingPlans
      .list({ theme: selectedThemeId, limit: 500 })
      .then((res) => {
        const data = res?.data?.results || res?.data?.data || res?.data || [];
        if (active) setThemePlans(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Failed to load plans for selected theme", error);
        if (active) setThemePlans([]);
      })
      .finally(() => {
        if (active) setPlansLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedThemeId]);

  const displayPlans = themePlans;

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
    setAutoPartnerName("");
    setForm((f) => ({ ...f, partner: "" }));

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
          setAutoPartnerName(
            data[0].partner_name || data[0].name || data[0].agency_name || "",
          );
        } else {
          setAutoPartnerAssigned(false);
          setAutoPartnerName("");
        }
      } catch (e) {
        console.warn("failed to auto-assign training partner", e);
        setAutoPartnerAssigned(false);
        setAutoPartnerName("");
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
            setAutoPartnerName("");
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
          <option value="2026-27">2026-27</option>
        </select>
      </div>

      {/* Training Theme Dropdown */}
      <div style={{ marginBottom: 16, opacity: form.financial_year ? 1 : 0.5 }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
          Select Training Theme <span style={{ color: "red" }}>*</span>
        </label>
        <select
          disabled={!form.financial_year || isSMMU} // SMMU theme is auto-locked
          value={selectedThemeId}
          onChange={(e) => {
            setSelectedThemeId(e.target.value);
            setSelectedPlan(null);
            setSelectedTheme(null);
            setForm((f) => ({ ...f, partner: "" }));
            setAutoPartnerAssigned(false);
            setAutoPartnerName("");
          }}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "2px solid #3d6ba6",
            outline: "none",
            fontSize: "14px",
            background: isSMMU ? "#f3f4f6" : "#fff",
          }}
        >
          <option value="">-- select training theme --</option>
          {(preloadThemes || []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.theme_name || t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Training Plan Dropdown (Disabled until Theme is selected) */}
      <div style={{ marginBottom: 12, opacity: selectedThemeId ? 1 : 0.5 }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
          {isSMMU
            ? "Training Plan (Locked to your Theme)"
            : "Training Plan (for selected theme)"}
        </label>

        <select
          disabled={!selectedThemeId || plansLoading}
          value={selectedPlan?.id || ""}
          onChange={(e) => {
            const id = e.target.value;
            const pl = displayPlans.find((p) => String(p.id) === String(id));
            handlePlanSelect(pl || null);
            if (isSMMU) setDistrictId(null);
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
          <option value="">
            {plansLoading
              ? "Loading plans..."
              : selectedThemeId && displayPlans.length === 0
                ? "No training plans available for this theme"
                : "-- select training plan --"}
          </option>
          {displayPlans.map((p) => {
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

      {/* Mandatory District Dropdown for SMMU */}
      {isSMMU && selectedPlan && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
            Target District <span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={districtId || ""}
            onChange={(e) => {
              const newDist = e.target.value ? Number(e.target.value) : null;
              setDistrictId(newDist);
              setAutoPartnerAssigned(false);
              setAutoPartnerName("");
              setForm((f) => ({ ...f, partner: "" }));

              if (newDist && selectedPlan) {
                TMS_API.trainingPartnerByTarget({
                  district_id: newDist,
                  financial_year: form.financial_year,
                  training_plan_id: selectedPlan.id,
                })
                  .then((res) => {
                    const data = res?.data ?? res;
                    if (Array.isArray(data) && data.length > 0 && data[0].id) {
                      setForm((f) => ({ ...f, partner: String(data[0].id) }));
                      setAutoPartnerAssigned(true);
                      setAutoPartnerName(
                        data[0].partner_name ||
                          data[0].name ||
                          data[0].agency_name ||
                          "",
                      );
                    }
                  })
                  .catch(() => {
                    setAutoPartnerAssigned(false);
                    setAutoPartnerName("");
                  });
              }
            }}
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "2px solid #3d6ba6",
              outline: "none",
              fontSize: "14px",
              background: "#fff",
            }}
          >
            <option value="">-- select district --</option>
            {(districts || []).map((d) => (
              <option key={d.district_id} value={d.district_id}>
                {d.district_name_en}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPlan ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #eef2f6",
            borderRadius: 6,
            background: "#f8fafd",
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
              marginBottom: 8,
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

          {/* Partner Assignment Display */}
          {form.partner && autoPartnerName ? (
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px dashed #c4d6ec",
                color: "#0c5460",
                fontWeight: 600,
              }}
            >
              ✓ Assigned Training Partner:{" "}
              <span style={{ color: "#111827" }}>{autoPartnerName}</span>
            </div>
          ) : (
            /* Show warning if no partner is assigned (waits for District selection if SMMU) */
            (!isSMMU || districtId) && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px dashed #f5c2c7",
                  color: "#d9534f",
                  fontWeight: 600,
                }}
              >
                ⚠ No Training Partner has been assigned a target for this
                training plan.
              </div>
            )
          )}
        </div>
      ) : (
        <div className="muted" style={{ marginTop: 12 }}>
          Select a training plan to preview details and choose participants.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          className="btnPrimaryHover"
          style={btnPrimary}
          onClick={goToNext}
          disabled={!selectedPlan || (isSMMU && !districtId) || !form.partner}
        >
          Next
        </button>
      </div>
    </>
  );
}
