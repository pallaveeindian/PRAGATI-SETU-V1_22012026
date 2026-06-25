// FilterComponent.jsx

import React, { useState, useEffect } from "react";

const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
};

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
};

const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#374151",
};

const FilterComponent = ({ onFilterChange }) => {
    const financialYears = [
        "2022-23",
        "2023-24",
        "2024-25",
        "2025-26",
        "2026-27",
    ];

    const trainingThemes = [
        "Financial Literacy",
        "Livelihood",
        "Agriculture",
        "Digital Literacy",
        "Skill Development",
        "Health & Nutrition",
    ];

    const trainingPlans = [
        "Annual Plan",
        "Quarterly Plan",
        "Monthly Plan",
        "Special Campaign",
    ];

    const participantTypes = ["Beneficiary", "Trainer"];

    const genders = ["Male", "Female", "Transgender"];

    const designations = [
        "SHG Member",
        "Village Organization Member",
        "CLF Member",
        "Book Keeper",
        "CRP",
        "Master Trainer",
    ];

    const pldStatus = [
        "PLD Completed",
        "PLD Ongoing",
        "PLD Pending",
    ];

    const socialCategories = [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS",
    ];

    const religions = [
        "Hindu",
        "Muslim",
        "Sikh",
        "Christian",
        "Jain",
        "Buddhist",
        "Others",
    ];

    const panchayats = [
        "Rampur",
        "Shivpur",
        "Rajapur",
        "Kalyanpur",
        "Bhawanipur",
    ];

    const villages = [
        "Village A",
        "Village B",
        "Village C",
        "Village D",
        "Village E",
    ];

    const beneficiarySearchTypes = [
        "Lokos SHG Code",
        "Lokos Member Code",
    ];

    const trainerSearchTypes = [
        "Mobile No",
        "Full Name",
    ];

    const ageGroups = [
        "18-25",
        "26-35",
        "36-45",
        "46-55",
        "56-65",
        "65+",
    ];

    const [filters, setFilters] = useState({
        financialYear: "2026-27",
        trainingTheme: "",
        trainingPlan: "",
        participantType: "Beneficiary",

        gender: "",
        designation: "",
        pldStatus: "",
        socialCategory: "",
        religion: "",
        panchayat: "",
        village: "",

        searchType: "Lokos SHG Code",
        searchValue: "",

        ageGroup: "",
    });

    useEffect(() => {
        if (filters.participantType === "Beneficiary") {
            setFilters((prev) => ({
                ...prev,
                searchType: "Lokos SHG Code",
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                searchType: "Mobile No",
            }));
        }
    }, [filters.participantType]);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange(filters);
        }
    }, [filters, onFilterChange]);

    const handleChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleTrainingPlanChange = (planId) => {
        // Update Training Plan
        handleValueChange("trainingPlanId", planId);

        // Get latest start date from filters
        const startDate = filters?.startDate;

        // If start date is not selected, do nothing
        if (!startDate || !planId) return;

        // Find selected plan
        const selectedPlan = trainingPlans.find(
            (plan) => plan.id === planId
        );

        if (!selectedPlan) return;

        // Calculate End Date
        const start = new Date(startDate);
        start.setDate(start.getDate() + (selectedPlan.days - 1));

        const endDate = start.toISOString().split("T")[0];

        // Update End Date
        handleValueChange("endDate", endDate);
    };

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
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "16px",
                }}
            >
                {/* Financial Year */}

                <div>
                    <label style={labelStyle}>Financial Year</label>

                    <select
                        style={selectStyle}
                        value={filters.financialYear}
                        onChange={(e) =>
                            handleChange("financialYear", e.target.value)
                        }
                    >
                        <option>None</option>
                        {financialYears.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {/* Training Theme */}

                <div>
                    <label style={labelStyle}>Training Theme</label>

                    <select
                        style={selectStyle}
                        value={filters.trainingTheme}
                        onChange={(e) =>
                            handleChange("trainingTheme", e.target.value)
                        }
                    >
                        <option value="">None</option>

                        {trainingThemes.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {/* Training Plan */}

                <div>
                    <label style={labelStyle}>Training Plan</label>

                    <select
                        style={selectStyle}
                        value={filters.trainingPlan}
                        onChange={(e) =>
                            handleChange("trainingPlan", e.target.value)
                        }
                    >
                        <option value="">None</option>

                        {trainingPlans.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {/* Participant Type */}

                <div>
                    <label style={labelStyle}>Participant Type</label>

                    <select
                        style={selectStyle}
                        value={filters.participantType}
                        onChange={(e) =>
                            handleChange("participantType", e.target.value)
                        }
                    >
                        <option value="">None</option>
                        {participantTypes.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>
                </div>

                {/* BENEFICIARY FILTERS */}

                {/* {filters.participantType === "Beneficiary" && (
                    <>
                        <div>
                            <label style={labelStyle}>Gender</label>

                            <select
                                style={selectStyle}
                                value={filters.gender}
                                onChange={(e) =>
                                    handleChange("gender", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {genders.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Designation</label>

                            <select
                                style={selectStyle}
                                value={filters.designation}
                                onChange={(e) =>
                                    handleChange("designation", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {designations.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>PLD Status</label>

                            <select
                                style={selectStyle}
                                value={filters.pldStatus}
                                onChange={(e) =>
                                    handleChange("pldStatus", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {pldStatus.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Social Category</label>

                            <select
                                style={selectStyle}
                                value={filters.socialCategory}
                                onChange={(e) =>
                                    handleChange("socialCategory", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {socialCategories.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Religion</label>

                            <select
                                style={selectStyle}
                                value={filters.religion}
                                onChange={(e) =>
                                    handleChange("religion", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {religions.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Panchayat</label>

                            <select
                                style={selectStyle}
                                value={filters.panchayat}
                                onChange={(e) =>
                                    handleChange("panchayat", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {panchayats.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Village</label>

                            <select
                                style={selectStyle}
                                value={filters.village}
                                onChange={(e) =>
                                    handleChange("village", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {villages.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Search By</label>

                            <select
                                style={selectStyle}
                                value={filters.searchType}
                                onChange={(e) =>
                                    handleChange("searchType", e.target.value)
                                }
                            >
                                {beneficiarySearchTypes.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Search Value</label>

                            <input
                                style={inputStyle}
                                placeholder="Enter value"
                                value={filters.searchValue}
                                onChange={(e) =>
                                    handleChange("searchValue", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Age Group</label>

                            <select
                                style={selectStyle}
                                value={filters.ageGroup}
                                onChange={(e) =>
                                    handleChange("ageGroup", e.target.value)
                                }
                            >
                                <option value="">All</option>

                                {ageGroups.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )} */}

                {/* TRAINER FILTERS */}

                {/* {filters.participantType === "Trainer" && (
                    <>
                        <div>
                            <label style={labelStyle}>Search By</label>

                            <select
                                style={selectStyle}
                                value={filters.searchType}
                                onChange={(e) =>
                                    handleChange("searchType", e.target.value)
                                }
                            >
                                {trainerSearchTypes.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Search Value</label>

                            <input
                                style={inputStyle}
                                placeholder="Enter value"
                                value={filters.searchValue}
                                onChange={(e) =>
                                    handleChange("searchValue", e.target.value)
                                }
                            />
                        </div>
                    </>
                )} */}
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
                    }}
                    onClick={() =>
                        setFilters({
                            financialYear: "2026-27",
                            trainingTheme: "",
                            trainingPlan: "",
                            participantType: "Beneficiary",
                            gender: "",
                            designation: "",
                            pldStatus: "",
                            socialCategory: "",
                            religion: "",
                            panchayat: "",
                            village: "",
                            searchType: "Lokos SHG Code",
                            searchValue: "",
                            ageGroup: "",
                        })
                    }
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default FilterComponent;