import React, { useState, useEffect, useMemo, useContext } from "react";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
  background: "#fff",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "6px",
  display: "block",
  color: "#374151",
};

const FilterComponent = ({ filters, handleChange }) => {
  const financialYears = [
    "2022-23",
    "2023-24",
    "2024-25",
    "2025-26",
    "2026-27",
  ];

  const fallbackThemes = [
    "Financial Literacy",
    "Livelihood",
    "Agriculture",
    "Digital Literacy",
    "Skill Development",
    "Health & Nutrition",
  ];

  const fallbackPlans = [
    { id: "plan1", name: "Annual Plan", days: 365, no_of_days: 365 },
    { id: "plan2", name: "Quarterly Plan", days: 90, no_of_days: 90 },
    { id: "plan3", name: "Monthly Plan", days: 30, no_of_days: 30 },
    { id: "plan4", name: "Special Campaign", days: 5, no_of_days: 5 },
  ];

  const participantTypes = ["Beneficiary", "Trainer"];

  const [apiThemes, setApiThemes] = useState([]);
  const [apiPlans, setApiPlans] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [parentPartnerId, setParentPartnerId] = useState(null);
  const { user } = useContext(AuthContext);

  async function ensureUserGeoscope() {
    try {
      const cached = JSON.parse(
        localStorage.getItem("ps_user_geoscope") || "null",
      );
      if (cached) return cached;
    } catch {}

    try {
      const resp = await LOOKUP_API.userGeoscopeByUserId(user?.id);
      if (resp?.data) {
        localStorage.setItem("ps_user_geoscope", JSON.stringify(resp.data));
        return resp.data;
      }
    } catch {}
    return null;
  }

  // 1. Fetch all themes on component initialization mount
  useEffect(() => {
    const fetchInitialThemes = async () => {
      try {
        const themeResponse = await TMS_API.trainingThemes.list();
        if (themeResponse && Array.isArray(themeResponse.data)) {
          setApiThemes(themeResponse.data);
        } else if (
          themeResponse &&
          Array.isArray(themeResponse.data?.results)
        ) {
          setApiThemes(themeResponse.data.results);
        } else if (Array.isArray(themeResponse)) {
          setApiThemes(themeResponse);
        }
      } catch (err) {
        console.error("Failed to load training themes:", err);
      }
    };
    fetchInitialThemes();
  }, []);

  useEffect(() => {
    const fetchParentPartner = async () => {
      try {
        const response = await TMS_API.parentPartner();
        const data = response?.data?.results || response?.data;
        const partner = Array.isArray(data) ? data[0] : data;

        setParentPartnerId(
          partner?.id ??
            partner?.partner_id ??
            partner?.parent_partner_id ??
            null,
        );
      } catch (err) {
        console.error("Parent Partner API Error", err);
      }
    };

    fetchParentPartner();
  }, []);

  // 2. Fetch Training Centers (FIXED Nested Object Mapping logic)
  useEffect(() => {
    const fetchTrainingCenters = async () => {
      const geoscope = await ensureUserGeoscope();
      filters.districtId = filters.districtId || geoscope?.districts?.[0] || "";
      if (!filters.districtId || !parentPartnerId) {
        setTrainingCenters([]);
        return;
      }
      try {
        const params = {
          district_id: Number(filters.districtId),
          partner_id: Number(parentPartnerId),
        };
        const response = await TMS_API.trainingPartnerCentres.list({ params });
        const data = response?.data?.results || response?.data || [];

        // Extra frontend validation - FIXED
        const filteredCenters = data.filter((center) => {
          // Check for .id FIRST to avoid passing entire object strings to Number() causing NaN
          const district =
            center.district?.id ?? center.district_id ?? center.district;

          const partner =
            center.partner?.id ??
            center.training_partner?.id ??
            center.partner_id ??
            center.training_partner_id ??
            center.partner ??
            center.training_partner;

          return (
            Number(district) === Number(filters.districtId) &&
            Number(partner) === Number(parentPartnerId)
          );
        });

        setTrainingCenters(filteredCenters);
      } catch (err) {
        console.error(err);
        setTrainingCenters([]);
      }
    };

    fetchTrainingCenters();
  }, [filters.districtId, parentPartnerId]);

  // 3. Client-side isolation filter loop map matching selected theme key
  useEffect(() => {
    const fetchDependentPlans = async () => {
      if (!filters.trainingThemeId) {
        setApiPlans([]);
        return;
      }

      try {
        const planResponse = await TMS_API.trainingPlans.list({
          params: {
            theme_id: filters.trainingThemeId,
            theme: filters.trainingThemeId,
            training_theme_id: filters.trainingThemeId,
            training_theme: filters.trainingThemeId,
          },
        });

        if (Array.isArray(planResponse.data)) {
          setApiPlans(planResponse.data);
        } else if (Array.isArray(planResponse.data?.results)) {
          setApiPlans(planResponse.data.results);
        } else if (Array.isArray(planResponse)) {
          setApiPlans(planResponse);
        }
      } catch (err) {
        console.error("Failed to load training plans:", err);
        setApiPlans([]);
      }
    };

    fetchDependentPlans();
  }, [filters.trainingThemeId]);

  const displayedPlans = useMemo(() => {
    if (!filters.trainingThemeId) {
      return fallbackPlans;
    }

    return apiPlans.filter((plan) => {
      const planThemeId = String(
        plan.theme_id ||
          plan.theme ||
          plan.training_theme_id ||
          plan.training_theme ||
          "",
      );
      const selectedThemeId = String(filters.trainingThemeId);
      return planThemeId === selectedThemeId;
    });
  }, [apiPlans, filters.trainingThemeId]);

  useEffect(() => {
    handleChange(
      "searchType",
      filters.participantType === "Beneficiary"
        ? "Lokos SHG Code"
        : "Mobile No",
    );
  }, [filters.participantType]);

  const handleThemeChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const themeId = selectedOption.getAttribute("data-id") || "";
    const themeValue = e.target.value;

    handleChange("trainingTheme", themeValue);
    handleChange("trainingThemeId", themeId);
    handleChange("trainingPlan", "");
    handleChange("trainingPlanDays", "");
    handleChange("endDate", "");
  };

  const handleTrainingPlanChange = (planIdentifier) => {
    const selectedPlan = displayedPlans.find(
      (plan) => String(plan.id) === String(planIdentifier),
    );

    if (!selectedPlan) {
      handleChange("trainingPlan", "");
      handleChange("trainingPlanDays", "");
      handleChange("endDate", "");
      return;
    }

    handleChange("trainingPlan", selectedPlan.id);
    handleChange("trainingPlanDays", selectedPlan.no_of_days);

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setDate(start.getDate() + Number(selectedPlan.no_of_days) - 1);

      const endDate = start.toISOString().split("T")[0];
      handleChange("endDate", endDate);
    } else {
      handleChange("endDate", "");
    }
  };

  useEffect(() => {
    if (!filters.trainingThemeId) return;

    const fetchDependentPlans = async () => {
      try {
        const response = await TMS_API.trainingPlans.list({
          params: {
            theme_id: filters.trainingThemeId,
          },
        });

        setApiPlans(response.data.results || response.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDependentPlans();
  }, [filters.trainingThemeId]);

  useEffect(() => {
    if (!filters.trainingPlan || apiPlans.length === 0) return;

    const plan = apiPlans.find(
      (p) => String(p.id) === String(filters.trainingPlan),
    );

    if (plan) {
      handleChange("trainingPlanDays", plan.no_of_days);
    }
  }, [apiPlans]);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Training Filters</h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Financial Year</label>
          <select
            style={selectStyle}
            value={filters.financialYear}
            onChange={(e) => handleChange("financialYear", e.target.value)}
          >
            <option value="">None</option>
            {financialYears.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Training Theme</label>
          <select
            style={selectStyle}
            value={filters.trainingTheme}
            onChange={handleThemeChange}
          >
            <option value="" data-id="">
              None
            </option>
            {apiThemes.length > 0
              ? apiThemes.map((item) => {
                  const themeValue = item.theme_name || item.name || item;
                  const themeId = item.id || "";
                  return (
                    <option key={themeId} value={themeValue} data-id={themeId}>
                      {themeValue}
                    </option>
                  );
                })
              : fallbackThemes.map((item) => (
                  <option key={item} value={item} data-id="">
                    {item}
                  </option>
                ))}
          </select>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Training Plan</label>
          <select
            style={selectStyle}
            value={filters.trainingPlan}
            onChange={(e) => handleTrainingPlanChange(e.target.value)}
            disabled={filters.trainingThemeId && displayedPlans.length === 0}
          >
            <option value="">None</option>
            {displayedPlans.length > 0
              ? displayedPlans.map((item) => {
                  const planValue = item;
                  const planId = item.id || planValue;
                  return (
                    <option key={planId} value={planValue.id}>
                      {planValue.training_name}
                    </option>
                  );
                })
              : null}
          </select>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Participant Type</label>
          <select
            style={selectStyle}
            value={filters.participantType}
            onChange={(e) => handleChange("participantType", e.target.value)}
          >
            <option value="">None</option>
            {participantTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: "220px" }}>
          <label style={labelStyle}>Training Center</label>
          <select
            style={selectStyle}
            value={filters.trainingCenter || ""}
            onChange={(e) => handleChange("trainingCenter", e.target.value)}
          >
            <option value="">Select Training Center</option>
            {trainingCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.venue_name || center.center_name || center.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => console.log(filters)}
        >
          Apply Filters
        </button>
        <button
          style={{
            padding: "10px 20px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
            color: "#c00202",
          }}
          onClick={() => {
            handleChange("financialYear", "2026-27");
            handleChange("trainingTheme", "");
            handleChange("trainingThemeId", "");
            handleChange("trainingPlan", "");
            handleChange("trainingPlanDays", "");
            handleChange("participantType", "Beneficiary");
            handleChange("gender", "");
            handleChange("designation", "");
            handleChange("pldStatus", "");
            handleChange("socialCategory", "");
            handleChange("religion", "");
            handleChange("block", "");
            handleChange("panchayat", "");
            handleChange("village", "");
            handleChange("searchType", "Lokos SHG Code");
            handleChange("searchValue", "");
            handleChange("ageRange", "");
            handleChange("startDate", "");
            handleChange("endDate", "");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
