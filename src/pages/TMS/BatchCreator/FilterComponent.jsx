import React, { useState, useEffect, useMemo } from "react";
import { TMS_API } from "../../../api/axios";
import { getUser } from "../../../utils/storage";

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

const FilterComponent = ({ filters,
    handleChange, }) => {
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
    const user = getUser();

    useEffect(() => {
        console.log("========== USER OBJECT ==========");
        console.log(user);
        console.log("Partner ID:", user?.id);
        console.log("District ID:", user?.district_id);
        console.log("Centre ID:", user?.centre_id);
        console.log("=================================");
    }, [user]);


    // 1. Fetch all themes on component initialization mount
    useEffect(() => {
        const fetchInitialThemes = async () => {
            try {
                const themeResponse = await TMS_API.trainingThemes.list();
                if (themeResponse && Array.isArray(themeResponse.data)) {
                    setApiThemes(themeResponse.data);
                } else if (themeResponse && Array.isArray(themeResponse.data?.results)) {
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

                console.log("===== Parent Partner API =====");
                console.log(response);
                console.log("Response Data:", response.data);

                const data = response?.data?.results || response?.data;

                console.log("Parsed Data:", data);

                const partner = Array.isArray(data) ? data[0] : data;

                console.log("Selected Partner:", partner);
                console.log("Partner ID:", partner?.id);
                console.log("Partner ID (partner_id):", partner?.partner_id);
                console.log("Parent Partner ID:", partner?.parent_partner_id);

                setParentPartnerId(
                    partner?.id ??
                    partner?.partner_id ??
                    partner?.parent_partner_id ??
                    null
                );
            } catch (err) {
                console.error("Parent Partner API Error", err);
            }
        };

        fetchParentPartner();
    }, []);

    useEffect(() => {
        console.log("Current parentPartnerId =", parentPartnerId);
    }, [parentPartnerId]);

    // useEffect(() => {
    //     const fetchTrainingCenters = async () => {
    //         console.log("District ID :", filters.districtId);
    //         console.log("Parent Partner ID :", parentPartnerId);

    //         if (!filters.districtId || !parentPartnerId) {
    //             console.log("API skipped");
    //             return;
    //         }

    //         try {
    //             const response = await TMS_API.trainingPartnerCentres.list({
    //                 params: {
    //                     district_id: filters.districtId,
    //                     partner_id: parentPartnerId,
    //                 },
    //             });

    //             console.log("Training Centre API Response");
    //             console.log(response);
    //             console.log("Response Data:", response.data);

    //             const data =
    //                 response?.data?.results ||
    //                 response?.data ||
    //                 [];

    //             console.log("Training Centres:", data);

    //             setTrainingCenters(Array.isArray(data) ? data : []);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };

    //     fetchTrainingCenters();
    // }, [filters.districtId, parentPartnerId]);

    // 2. Fetch specific Training Plans matching chosen Theme identifier

    useEffect(() => {
        const fetchTrainingCenters = async () => {
            if (!filters.districtId || !parentPartnerId) {
                setTrainingCenters([]);
                return;
            }

            try {
                const params = {
                    district_id: Number(filters.districtId),
                    partner_id: Number(parentPartnerId),
                };

                console.log("Training Centre Params:", params);

                const response = await TMS_API.trainingPartnerCentres.list({
                    params,
                });

                const data =
                    response?.data?.results ||
                    response?.data ||
                    [];

                console.log("API Response:", data);

                // Extra frontend validation
                const filteredCenters = data.filter((center) => {
                    const district =
                        center.district_id ??
                        center.district ??
                        center.district?.id;

                    const partner =
                        center.partner_id ??
                        center.partner ??
                        center.partner?.id ??
                        center.training_partner ??
                        center.training_partner_id;

                    return (
                        Number(district) === Number(filters.districtId) &&
                        Number(partner) === Number(parentPartnerId)
                    );
                });

                console.log("Filtered Centers:", filteredCenters);

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
                        training_theme: filters.trainingThemeId
                    }
                });

                console.log("========== TRAINING PLAN API RESPONSE ==========");
                console.log("Full Response:", planResponse);
                console.log("Response Data:", planResponse.data);
                console.log(
                    "JSON Response:",
                    JSON.stringify(planResponse.data, null, 2)
                );

                const plans =
                    planResponse?.data?.results ||
                    planResponse?.data ||
                    [];

                console.table(plans);

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
            const planThemeId = String(plan.theme_id || plan.theme || plan.training_theme_id || plan.training_theme || "");
            const selectedThemeId = String(filters.trainingThemeId);
            return planThemeId === selectedThemeId;
        });
    }, [apiPlans, filters.trainingThemeId]);


    useEffect(() => {
        handleChange(
            "searchType",
            filters.participantType === "Beneficiary"
                ? "Lokos SHG Code"
                : "Mobile No"
        );
    }, [filters.participantType]);

    const updateFilter = (field, value) => {
        handleChange(field, value);
    };

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
            (plan) => String(plan.id) === String(planIdentifier)
        );

        if (!selectedPlan) {
            handleChange("trainingPlan", "");
            handleChange("trainingPlanDays", "");
            handleChange("endDate", "");
            return;
        }

        // Save selected training plan
        handleChange("trainingPlan", selectedPlan.id);
        handleChange("trainingPlanDays", selectedPlan.no_of_days);

        // If start date is already selected, calculate end date
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
            p => String(p.id) === String(filters.trainingPlan)
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
                {/* Financial Year */}
                <div style={{
                    flex: "1 1 220px",
                    minWidth: "220px",
                }}>
                    <label style={labelStyle}>Financial Year</label>
                    <select
                        style={selectStyle}
                        value={filters.financialYear}
                        onChange={(e) => handleChange("financialYear", e.target.value)}
                    >
                        <option value="">None</option>
                        {financialYears.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {/* Training Theme */}
                <div style={{
                    flex: "1 1 220px",
                    minWidth: "220px",
                }}>
                    <label style={labelStyle}>Training Theme</label>
                    <select
                        style={selectStyle}
                        value={filters.trainingTheme}
                        onChange={handleThemeChange}
                    >
                        <option value="" data-id="">None</option>
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

                {/* Training Plan */}
                <div style={{
                    flex: "1 1 220px",
                    minWidth: "220px",
                }}>
                    <label style={labelStyle}>Training Plan</label>
                    <select
                        style={selectStyle}
                        value={filters.trainingPlan}
                        onChange={(e) => handleTrainingPlanChange(e.target.value)}
                        disabled={filters.trainingThemeId && displayedPlans.length === 0}
                    >
                        <option value="">None</option>
                        {displayedPlans.length > 0 ? (
                            displayedPlans.map((item) => {
                                const planValue = item;
                                const planId = item.id || planValue;
                                return (
                                    <option key={planId} value={planValue.id}>
                                        {planValue.training_name}
                                    </option>
                                );
                            })
                        ) : null}
                    </select>
                </div>

                {/* Participant Type */}
                <div style={{
                    flex: "1 1 220px",
                    minWidth: "220px",
                }}>
                    <label style={labelStyle}>Participant Type</label>
                    <select
                        style={selectStyle}
                        value={filters.participantType}
                        onChange={(e) => handleChange("participantType", e.target.value)}
                    >
                        <option value="">None</option>
                        {participantTypes.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div style={{
                    flex: "1 1 220px",
                    minWidth: "220px",
                }}>
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
        </div >
    );
};

export default FilterComponent;