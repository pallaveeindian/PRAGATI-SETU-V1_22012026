// FilterComponent.jsx

// import React, { useState, useEffect } from "react";

// const selectStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     border: "1px solid #d1d5db",
//     borderRadius: "8px",
//     outline: "none",
//     fontSize: "14px",
//     background: "#fff",
// };

// const inputStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     border: "1px solid #d1d5db",
//     borderRadius: "8px",
//     outline: "none",
//     fontSize: "14px",
// };

// const labelStyle = {
//     fontSize: "13px",
//     fontWeight: "600",
//     marginBottom: "6px",
//     display: "block",
//     color: "#374151",
// };

// const FilterComponent = ({ onFilterChange }) => {
//     const financialYears = [
//         "2022-23",
//         "2023-24",
//         "2024-25",
//         "2025-26",
//         "2026-27",
//     ];

//     const trainingThemes = [
//         "Financial Literacy",
//         "Livelihood",
//         "Agriculture",
//         "Digital Literacy",
//         "Skill Development",
//         "Health & Nutrition",
//     ];

//     const trainingPlans = [
//         "Annual Plan",
//         "Quarterly Plan",
//         "Monthly Plan",
//         "Special Campaign",
//     ];

//     const participantTypes = ["Beneficiary", "Trainer"];

//     const genders = ["Male", "Female", "Transgender"];

//     const designations = [
//         "SHG Member",
//         "Village Organization Member",
//         "CLF Member",
//         "Book Keeper",
//         "CRP",
//         "Master Trainer",
//     ];

//     const pldStatus = [
//         "PLD Completed",
//         "PLD Ongoing",
//         "PLD Pending",
//     ];

//     const socialCategories = [
//         "General",
//         "OBC",
//         "SC",
//         "ST",
//         "EWS",
//     ];

//     const religions = [
//         "Hindu",
//         "Muslim",
//         "Sikh",
//         "Christian",
//         "Jain",
//         "Buddhist",
//         "Others",
//     ];

//     const panchayats = [
//         "Rampur",
//         "Shivpur",
//         "Rajapur",
//         "Kalyanpur",
//         "Bhawanipur",
//     ];

//     const villages = [
//         "Village A",
//         "Village B",
//         "Village C",
//         "Village D",
//         "Village E",
//     ];

//     const beneficiarySearchTypes = [
//         "Lokos SHG Code",
//         "Lokos Member Code",
//     ];

//     const trainerSearchTypes = [
//         "Mobile No",
//         "Full Name",
//     ];

//     const ageGroups = [
//         "18-25",
//         "26-35",
//         "36-45",
//         "46-55",
//         "56-65",
//         "65+",
//     ];

//     const [filters, setFilters] = useState({
//         financialYear: "2026-27",
//         trainingTheme: "",
//         trainingPlan: "",
//         participantType: "Beneficiary",

//         gender: "",
//         designation: "",
//         pldStatus: "",
//         socialCategory: "",
//         religion: "",
//         panchayat: "",
//         village: "",

//         searchType: "Lokos SHG Code",
//         searchValue: "",

//         ageGroup: "",
//     });

//     useEffect(() => {
//         if (filters.participantType === "Beneficiary") {
//             setFilters((prev) => ({
//                 ...prev,
//                 searchType: "Lokos SHG Code",
//             }));
//         } else {
//             setFilters((prev) => ({
//                 ...prev,
//                 searchType: "Mobile No",
//             }));
//         }
//     }, [filters.participantType]);

//     useEffect(() => {
//         if (onFilterChange) {
//             onFilterChange(filters);
//         }
//     }, [filters, onFilterChange]);

//     const handleChange = (field, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };
//     const handleTrainingPlanChange = (planId) => {
//         // Update Training Plan
//         handleValueChange("trainingPlanId", planId);

//         // Get latest start date from filters
//         const startDate = filters?.startDate;

//         // If start date is not selected, do nothing
//         if (!startDate || !planId) return;

//         // Find selected plan
//         const selectedPlan = trainingPlans.find(
//             (plan) => plan.id === planId
//         );

//         if (!selectedPlan) return;

//         // Calculate End Date
//         const start = new Date(startDate);
//         start.setDate(start.getDate() + (selectedPlan.days - 1));

//         const endDate = start.toISOString().split("T")[0];

//         // Update End Date
//         handleValueChange("endDate", endDate);
//     };

//     return (
//         <div
//             style={{
//                 background: "#fff",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                 marginBottom: "20px",
//             }}
//         >
//             <h3 style={{ marginBottom: "20px" }}>Training Filters</h3>

//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//                     gap: "16px",
//                 }}
//             >
//                 {/* Financial Year */}

//                 <div>
//                     <label style={labelStyle}>Financial Year</label>

//                     <select
//                         style={selectStyle}
//                         value={filters.financialYear}
//                         onChange={(e) =>
//                             handleChange("financialYear", e.target.value)
//                         }
//                     >
//                         <option>None</option>
//                         {financialYears.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Training Theme */}

//                 <div>
//                     <label style={labelStyle}>Training Theme</label>

//                     <select
//                         style={selectStyle}
//                         value={filters.trainingTheme}
//                         onChange={(e) =>
//                             handleChange("trainingTheme", e.target.value)
//                         }
//                     >
//                         <option value="">None</option>

//                         {trainingThemes.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Training Plan */}

//                 <div>
//                     <label style={labelStyle}>Training Plan</label>

//                     <select
//                         style={selectStyle}
//                         value={filters.trainingPlan}
//                         onChange={(e) =>
//                             handleChange("trainingPlan", e.target.value)
//                         }
//                     >
//                         <option value="">None</option>

//                         {trainingPlans.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Participant Type */}

//                 <div>
//                     <label style={labelStyle}>Participant Type</label>

//                     <select
//                         style={selectStyle}
//                         value={filters.participantType}
//                         onChange={(e) =>
//                             handleChange("participantType", e.target.value)
//                         }
//                     >
//                         <option value="">None</option>
//                         {participantTypes.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* BENEFICIARY FILTERS */}

//                 {/* {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender}
//                                 onChange={(e) =>
//                                     handleChange("gender", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {genders.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation}
//                                 onChange={(e) =>
//                                     handleChange("designation", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {designations.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus}
//                                 onChange={(e) =>
//                                     handleChange("pldStatus", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {pldStatus.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory}
//                                 onChange={(e) =>
//                                     handleChange("socialCategory", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {socialCategories.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion}
//                                 onChange={(e) =>
//                                     handleChange("religion", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {religions.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat}
//                                 onChange={(e) =>
//                                     handleChange("panchayat", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {panchayats.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.village}
//                                 onChange={(e) =>
//                                     handleChange("village", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {villages.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search By</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.searchType}
//                                 onChange={(e) =>
//                                     handleChange("searchType", e.target.value)
//                                 }
//                             >
//                                 {beneficiarySearchTypes.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search Value</label>

//                             <input
//                                 style={inputStyle}
//                                 placeholder="Enter value"
//                                 value={filters.searchValue}
//                                 onChange={(e) =>
//                                     handleChange("searchValue", e.target.value)
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Group</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageGroup}
//                                 onChange={(e) =>
//                                     handleChange("ageGroup", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {ageGroups.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )} */}

//                 {/* TRAINER FILTERS */}

//                 {/* {filters.participantType === "Trainer" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Search By</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.searchType}
//                                 onChange={(e) =>
//                                     handleChange("searchType", e.target.value)
//                                 }
//                             >
//                                 {trainerSearchTypes.map((item) => (
//                                     <option key={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search Value</label>

//                             <input
//                                 style={inputStyle}
//                                 placeholder="Enter value"
//                                 value={filters.searchValue}
//                                 onChange={(e) =>
//                                     handleChange("searchValue", e.target.value)
//                                 }
//                             />
//                         </div>
//                     </>
//                 )} */}
//             </div>

//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: "10px",
//                     marginTop: "20px",
//                 }}
//             >
//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "none",
//                         borderRadius: "8px",
//                         background: "#2563eb",
//                         color: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() => console.log(filters)}
//                 >
//                     Apply Filters
//                 </button>

//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "1px solid #d1d5db",
//                         borderRadius: "8px",
//                         background: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() =>
//                         setFilters({
//                             financialYear: "2026-27",
//                             trainingTheme: "",
//                             trainingPlan: "",
//                             participantType: "Beneficiary",
//                             gender: "",
//                             designation: "",
//                             pldStatus: "",
//                             socialCategory: "",
//                             religion: "",
//                             panchayat: "",
//                             village: "",
//                             searchType: "Lokos SHG Code",
//                             searchValue: "",
//                             ageGroup: "",
//                         })
//                     }
//                 >
//                     Reset
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default FilterComponent;



// import React, { useState, useEffect } from "react";

// const selectStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     border: "1px solid #d1d5db",
//     borderRadius: "8px",
//     outline: "none",
//     fontSize: "14px",
//     background: "#fff",
// };

// const inputStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     border: "1px solid #d1d5db",
//     borderRadius: "8px",
//     outline: "none",
//     fontSize: "14px",
// };

// const labelStyle = {
//     fontSize: "13px",
//     fontWeight: "600",
//     marginBottom: "6px",
//     display: "block",
//     color: "#374151",
// };

// const FilterComponent = ({ onFilterChange }) => {
//     const financialYears = [
//         "2022-23",
//         "2023-24",
//         "2024-25",
//         "2025-26",
//         "2026-27",
//     ];

//     const trainingThemes = [
//         "Financial Literacy",
//         "Livelihood",
//         "Agriculture",
//         "Digital Literacy",
//         "Skill Development",
//         "Health & Nutrition",
//     ];

//     // Updated to Objects to include 'days' for End Date calculation
//     const trainingPlans = [
//         { id: "plan1", name: "Annual Plan", days: 365 },
//         { id: "plan2", name: "Quarterly Plan", days: 90 },
//         { id: "plan3", name: "Monthly Plan", days: 30 },
//         { id: "plan4", name: "Special Campaign", days: 5 },
//     ];

//     const participantTypes = ["Beneficiary", "Trainer"];

//     const genders = ["Male", "Female", "Transgender"];

//     const designations = [
//         "SHG Member",
//         "Village Organization Member",
//         "CLF Member",
//         "Book Keeper",
//         "CRP",
//         "Master Trainer",
//     ];

//     const pldStatus = [
//         "PLD Completed",
//         "PLD Ongoing",
//         "PLD Pending",
//     ];

//     const socialCategories = [
//         "General",
//         "OBC",
//         "SC",
//         "ST",
//         "EWS",
//     ];

//     const religions = [
//         "Hindu",
//         "Muslim",
//         "Sikh",
//         "Christian",
//         "Jain",
//         "Buddhist",
//         "Others",
//     ];

//     const panchayats = [
//         "Rampur",
//         "Shivpur",
//         "Rajapur",
//         "Kalyanpur",
//         "Bhawanipur",
//     ];

//     const villages = [
//         "Village A",
//         "Village B",
//         "Village C",
//         "Village D",
//         "Village E",
//     ];

//     const beneficiarySearchTypes = [
//         "Lokos SHG Code",
//         "Lokos Member Code",
//     ];

//     const trainerSearchTypes = [
//         "Mobile No",
//         "Full Name",
//     ];

//     const ageGroups = [
//         "18-25",
//         "26-35",
//         "36-45",
//         "46-55",
//         "56-65",
//         "65+",
//     ];

//     const [filters, setFilters] = useState({
//         financialYear: "2026-27",
//         trainingTheme: "",
//         trainingPlan: "",
//         participantType: "Beneficiary",

//         gender: "",
//         designation: "",
//         pldStatus: "",
//         socialCategory: "",
//         religion: "",
//         panchayat: "",
//         village: "",

//         searchType: "Lokos SHG Code",
//         searchValue: "",

//         ageGroup: "",
//         startDate: "",
//         endDate: "",
//     });

//     useEffect(() => {
//         if (filters.participantType === "Beneficiary") {
//             setFilters((prev) => ({
//                 ...prev,
//                 searchType: "Lokos SHG Code",
//             }));
//         } else {
//             setFilters((prev) => ({
//                 ...prev,
//                 searchType: "Mobile No",
//             }));
//         }
//     }, [filters.participantType]);

//     useEffect(() => {
//         if (onFilterChange) {
//             onFilterChange(filters);
//         }
//     }, [filters, onFilterChange]);

//     const handleChange = (field, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     const handleTrainingPlanChange = (planName) => {
//         // Update Training Plan name
//         handleChange("trainingPlan", planName);

//         // Get latest start date from filters
//         const startDate = filters?.startDate;

//         // If start date or plan name is not selected, do nothing else
//         if (!startDate || !planName) {
//             handleChange("endDate", "");
//             return;
//         }

//         // Find selected plan to get the required days
//         const selectedPlan = trainingPlans.find(
//             (plan) => plan.name === planName
//         );

//         if (!selectedPlan) return;

//         // Calculate End Date
//         const start = new Date(startDate);
//         start.setDate(start.getDate() + (selectedPlan.days - 1));

//         const endDate = start.toISOString().split("T")[0];

//         // Update End Date
//         handleChange("endDate", endDate);
//     };

//     return (
//         <div
//             style={{
//                 background: "#fff",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                 marginBottom: "20px",
//             }}
//         >
//             <h3 style={{ marginBottom: "20px" }}>Training Filters</h3>

//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//                     gap: "16px",
//                 }}
//             >
//                 {/* Financial Year */}
//                 <div>
//                     <label style={labelStyle}>Financial Year</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.financialYear}
//                         onChange={(e) =>
//                             handleChange("financialYear", e.target.value)
//                         }
//                     >
//                         <option>None</option>
//                         {financialYears.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Training Theme */}
//                 <div>
//                     <label style={labelStyle}>Training Theme</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingTheme}
//                         onChange={(e) =>
//                             handleChange("trainingTheme", e.target.value)
//                         }
//                     >
//                         <option value="">None</option>
//                         {trainingThemes.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Training Plan */}
//                 <div>
//                     <label style={labelStyle}>Training Plan</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingPlan}
//                         onChange={(e) =>
//                             handleTrainingPlanChange(e.target.value)
//                         }
//                     >
//                         <option value="">None</option>
//                         {trainingPlans.map((item) => (
//                             <option key={item.id} value={item.name}>{item.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Participant Type */}
//                 <div>
//                     <label style={labelStyle}>Participant Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.participantType}
//                         onChange={(e) =>
//                             handleChange("participantType", e.target.value)
//                         }
//                     >
//                         <option value="">None</option>
//                         {participantTypes.map((item) => (
//                             <option key={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: "10px",
//                     marginTop: "20px",
//                 }}
//             >
//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "none",
//                         borderRadius: "8px",
//                         background: "#2563eb",
//                         color: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() => console.log(filters)}
//                 >
//                     Apply Filters
//                 </button>

//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "1px solid #d1d5db",
//                         borderRadius: "8px",
//                         background: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() =>
//                         setFilters({
//                             financialYear: "2026-27",
//                             trainingTheme: "",
//                             trainingPlan: "",
//                             participantType: "Beneficiary",
//                             gender: "",
//                             designation: "",
//                             pldStatus: "",
//                             socialCategory: "",
//                             religion: "",
//                             panchayat: "",
//                             village: "",
//                             searchType: "Lokos SHG Code",
//                             searchValue: "",
//                             ageGroup: "",
//                             startDate: "",
//                             endDate: "",
//                         })
//                     }
//                 >
//                     Reset
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default FilterComponent;


// import React, { useState, useEffect } from "react";
// import { TMS_API } from "../../../api/axios";

// const selectStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     border: "1px solid #d1d5db",
//     borderRadius: "8px",
//     outline: "none",
//     fontSize: "14px",
//     background: "#fff",
// };

// const labelStyle = {
//     fontSize: "13px",
//     fontWeight: "600",
//     marginBottom: "6px",
//     display: "block",
//     color: "#374151",
// };

// const FilterComponent = ({ onFilterChange }) => {
//     const financialYears = [
//         "2022-23",
//         "2023-24",
//         "2024-25",
//         "2025-26",
//         "2026-27",
//     ];

//     const fallbackThemes = [
//         "Financial Literacy",
//         "Livelihood",
//         "Agriculture",
//         "Digital Literacy",
//         "Skill Development",
//         "Health & Nutrition",
//     ];

//     const fallbackPlans = [
//         { id: "plan1", name: "Annual Plan", days: 365 },
//         { id: "plan2", name: "Quarterly Plan", days: 90 },
//         { id: "plan3", name: "Monthly Plan", days: 30 },
//         { id: "plan4", name: "Special Campaign", days: 5 },
//     ];

//     const participantTypes = ["Beneficiary", "Trainer"];

//     const [apiThemes, setApiThemes] = useState([]);
//     const [apiPlans, setApiPlans] = useState([]);

//     const [filters, setFilters] = useState({
//         financialYear: "2026-27",
//         trainingTheme: "",
//         trainingThemeId: "",
//         trainingPlan: "",
//         participantType: "Beneficiary",
//         gender: "",
//         designation: "",
//         pldStatus: "",
//         socialCategory: "",
//         religion: "",
//         panchayat: "",
//         village: "",
//         searchType: "Lokos SHG Code",
//         searchValue: "",
//         ageGroup: "",
//         startDate: "",
//         endDate: "",
//     });

//     // 1. Initial load for all themes
//     useEffect(() => {
//         const fetchInitialThemes = async () => {
//             try {
//                 const themeResponse = await TMS_API.trainingThemes.list();
//                 if (themeResponse && Array.isArray(themeResponse.data)) {
//                     setApiThemes(themeResponse.data);
//                 } else if (themeResponse && Array.isArray(themeResponse.data?.results)) {
//                     setApiThemes(themeResponse.data.results);
//                 } else if (Array.isArray(themeResponse)) {
//                     setApiThemes(themeResponse);
//                 }
//             } catch (err) {
//                 console.error("Failed to load training themes:", err);
//             }
//         };
//         fetchInitialThemes();
//     }, []);

//     // 2. Fetch Training Plans when selected Theme shifts
//     useEffect(() => {
//         const fetchDependentPlans = async () => {
//             if (!filters.trainingThemeId) {
//                 setApiPlans([]);
//                 return;
//             }

//             try {
//                 /* We pass multiple variations of theme parameter keys contextually 
//                    to try and hit the correct backend query parameter.
//                 */
//                 const planResponse = await TMS_API.trainingPlans.list({
//                     params: {
//                         theme_id: filters.trainingThemeId,
//                         theme: filters.trainingThemeId,
//                         training_theme_id: filters.trainingThemeId,
//                         training_theme: filters.trainingThemeId
//                     }
//                 });

//                 if (planResponse && Array.isArray(planResponse.data)) {
//                     setApiPlans(planResponse.data);
//                 } else if (planResponse && Array.isArray(planResponse.data?.results)) {
//                     setApiPlans(planResponse.data.results);
//                 } else if (Array.isArray(planResponse)) {
//                     setApiPlans(planResponse);
//                 }
//             } catch (err) {
//                 console.error(`Failed to load filtered training plans for theme ID ${filters.trainingThemeId}:`, err);
//                 setApiPlans([]);
//             }
//         };

//         fetchDependentPlans();
//     }, [filters.trainingThemeId]);

//     // Client-Side Safe Filter: Used if the backend ignores query parameters and returns everything
//     const displayedPlans = useMemo(() => {
//         if (!filters.trainingThemeId) {
//             return fallbackPlans; // Show generic fallback configurations if no theme is picked
//         }

//         return apiPlans.filter((plan) => {
//             // Check every common foreign key property shape returned by Django REST Framework fields
//             const planThemeId = String(plan.theme_id || plan.theme || plan.training_theme_id || plan.training_theme || "");
//             const selectedThemeId = String(filters.trainingThemeId);

//             return planThemeId === selectedThemeId;
//         });
//     }, [apiPlans, filters.trainingThemeId]);

//     useEffect(() => {
//         if (filters.participantType === "Beneficiary") {
//             setFilters((prev) => ({ ...prev, searchType: "Lokos SHG Code" }));
//         } else {
//             setFilters((prev) => ({ ...prev, searchType: "Mobile No" }));
//         }
//     }, [filters.participantType]);

//     useEffect(() => {
//         if (onFilterChange) {
//             onFilterChange(filters);
//         }
//     }, [filters, onFilterChange]);

//     const handleChange = (field, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     const handleThemeChange = (e) => {
//         const selectedOption = e.target.options[e.target.selectedIndex];
//         const themeId = selectedOption.getAttribute("data-id") || "";
//         const themeValue = e.target.value;

//         setFilters((prev) => ({
//             ...prev,
//             trainingTheme: themeValue,
//             trainingThemeId: themeId,
//             trainingPlan: "", // Clear out active plan selection when switching themes
//             endDate: "",
//         }));
//     };

//     const handleTrainingPlanChange = (planIdentifier) => {
//         handleChange("trainingPlan", planIdentifier);

//         const startDate = filters?.startDate;
//         if (!startDate || !planIdentifier) {
//             handleChange("endDate", "");
//             return;
//         }

//         const selectedPlan = displayedPlans.find(
//             (plan) => plan.name === planIdentifier || plan.id === planIdentifier || plan.training_name === planIdentifier || plan.plan_name === planIdentifier
//         );

//         const planDays = selectedPlan?.days || selectedPlan?.duration_days || 1;

//         const start = new Date(startDate);
//         start.setDate(start.getDate() + (planDays - 1));

//         const endDate = start.toISOString().split("T")[0];
//         handleChange("endDate", endDate);
//     };

//     return (
//         <div
//             style={{
//                 background: "#fff",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                 marginBottom: "20px",
//             }}
//         >
//             <h3 style={{ marginBottom: "20px" }}>Training Filters</h3>

//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//                     gap: "16px",
//                 }}
//             >
//                 {/* Financial Year */}
//                 <div>
//                     <label style={labelStyle}>Financial Year</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.financialYear}
//                         onChange={(e) => handleChange("financialYear", e.target.value)}
//                     >
//                         <option value="">None</option>
//                         {financialYears.map((item) => (
//                             <option key={item} value={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Training Theme */}
//                 <div>
//                     <label style={labelStyle}>Training Theme</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingTheme}
//                         onChange={handleThemeChange}
//                     >
//                         <option value="" data-id="">None</option>
//                         {apiThemes.length > 0
//                             ? apiThemes.map((item) => {
//                                 const themeValue = item.theme_name || item.name || item;
//                                 const themeId = item.id || "";
//                                 return (
//                                     <option key={themeId} value={themeValue} data-id={themeId}>
//                                         {themeValue}
//                                     </option>
//                                 );
//                             })
//                             : fallbackThemes.map((item) => (
//                                 <option key={item} value={item} data-id="">
//                                     {item}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>

//                 {/* Training Plan */}
//                 <div>
//                     <label style={labelStyle}>Training Plan</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingPlan}
//                         onChange={(e) => handleTrainingPlanChange(e.target.value)}
//                         disabled={filters.trainingThemeId && displayedPlans.length === 0}
//                     >
//                         <option value="">None</option>
//                         {displayedPlans.length > 0 ? (
//                             displayedPlans.map((item) => {
//                                 const planValue = item.training_name || item.name || item.plan_name;
//                                 const planId = item.id || planValue;
//                                 return (
//                                     <option key={planId} value={planValue}>
//                                         {planValue}
//                                     </option>
//                                 );
//                             })
//                         ) : null}
//                     </select>
//                 </div>

//                 {/* Participant Type */}
//                 <div>
//                     <label style={labelStyle}>Participant Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.participantType}
//                         onChange={(e) => handleChange("participantType", e.target.value)}
//                     >
//                         <option value="">None</option>
//                         {participantTypes.map((item) => (
//                             <option key={item} value={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: "10px",
//                     marginTop: "20px",
//                 }}
//             >
//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "none",
//                         borderRadius: "8px",
//                         background: "#2563eb",
//                         color: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() => console.log(filters)}
//                 >
//                     Apply Filters
//                 </button>

//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "1px solid #d1d5db",
//                         borderRadius: "8px",
//                         background: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() =>
//                         setFilters({
//                             financialYear: "2026-27",
//                             trainingTheme: "",
//                             trainingThemeId: "",
//                             trainingPlan: "",
//                             participantType: "Beneficiary",
//                             gender: "",
//                             designation: "",
//                             pldStatus: "",
//                             socialCategory: "",
//                             religion: "",
//                             panchayat: "",
//                             village: "",
//                             searchType: "Lokos SHG Code",
//                             searchValue: "",
//                             ageGroup: "",
//                             startDate: "",
//                             endDate: "",
//                         })
//                     }
//                 >
//                     Reset
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default FilterComponent;


// import React, { useState, useEffect, useMemo } from "react";
// import { TMS_API } from "../../../api/axios";

// const selectStyle = {
//     width: "100%",
//     padding: "10px 12px",
//     border: "1px solid #d1d5db",
//     borderRadius: "8px",
//     outline: "none",
//     fontSize: "14px",
//     background: "#fff",
// };

// const labelStyle = {
//     fontSize: "13px",
//     fontWeight: "600",
//     marginBottom: "6px",
//     display: "block",
//     color: "#374151",
// };

// const FilterComponent = ({ onFilterChange }) => {
//     const financialYears = [
//         "2022-23",
//         "2023-24",
//         "2024-25",
//         "2025-26",
//         "2026-27",
//     ];

//     const fallbackThemes = [
//         "Financial Literacy",
//         "Livelihood",
//         "Agriculture",
//         "Digital Literacy",
//         "Skill Development",
//         "Health & Nutrition",
//     ];

//     const fallbackPlans = [
//         { id: "plan1", name: "Annual Plan", days: 365 },
//         { id: "plan2", name: "Quarterly Plan", days: 90 },
//         { id: "plan3", name: "Monthly Plan", days: 30 },
//         { id: "plan4", name: "Special Campaign", days: 5 },
//     ];

//     const participantTypes = ["Beneficiary", "Trainer"];

//     const [apiThemes, setApiThemes] = useState([]);
//     const [apiPlans, setApiPlans] = useState([]);

//     const [filters, setFilters] = useState({
//         financialYear: "2026-27",
//         trainingTheme: "",
//         trainingThemeId: "",
//         trainingPlan: "",
//         participantType: "Beneficiary",
//         gender: "",
//         designation: "",
//         pldStatus: "",
//         socialCategory: "",
//         religion: "",
//         panchayat: "",
//         village: "",
//         searchType: "Lokos SHG Code",
//         searchValue: "",
//         ageGroup: "",
//         startDate: "",
//         endDate: "",
//     });

//     // 1. Initial load for all themes
//     useEffect(() => {
//         const fetchInitialThemes = async () => {
//             try {
//                 const themeResponse = await TMS_API.trainingThemes.list();
//                 if (themeResponse && Array.isArray(themeResponse.data)) {
//                     setApiThemes(themeResponse.data);
//                 } else if (themeResponse && Array.isArray(themeResponse.data?.results)) {
//                     setApiThemes(themeResponse.data.results);
//                 } else if (Array.isArray(themeResponse)) {
//                     setApiThemes(themeResponse);
//                 }
//             } catch (err) {
//                 console.error("Failed to load training themes:", err);
//             }
//         };
//         fetchInitialThemes();
//     }, []);

//     // 2. Fetch Training Plans when selected Theme shifts
//     useEffect(() => {
//         const fetchDependentPlans = async () => {
//             if (!filters.trainingThemeId) {
//                 setApiPlans([]);
//                 return;
//             }

//             try {
//                 const planResponse = await TMS_API.trainingPlans.list({
//                     params: {
//                         theme_id: filters.trainingThemeId,
//                         theme: filters.trainingThemeId,
//                         training_theme_id: filters.trainingThemeId,
//                         training_theme: filters.trainingThemeId
//                     }
//                 });

//                 if (planResponse && Array.isArray(planResponse.data)) {
//                     setApiPlans(planResponse.data);
//                 } else if (planResponse && Array.isArray(planResponse.data?.results)) {
//                     setApiPlans(planResponse.data.results);
//                 } else if (Array.isArray(planResponse)) {
//                     setApiPlans(planResponse);
//                 }
//             } catch (err) {
//                 console.error(`Failed to load filtered training plans for theme ID ${filters.trainingThemeId}:`, err);
//                 setApiPlans([]);
//             }
//         };

//         fetchDependentPlans();
//     }, [filters.trainingThemeId]);

//     // Client-Side Safe Filter: Ensures plans are bounded by selected theme
//     const displayedPlans = useMemo(() => {
//         if (!filters.trainingThemeId) {
//             return fallbackPlans;
//         }

//         return apiPlans.filter((plan) => {
//             const planThemeId = String(plan.theme_id || plan.theme || plan.training_theme_id || plan.training_theme || "");
//             const selectedThemeId = String(filters.trainingThemeId);

//             return planThemeId === selectedThemeId;
//         });
//     }, [apiPlans, filters.trainingThemeId, fallbackPlans]);

//     useEffect(() => {
//         if (filters.participantType === "Beneficiary") {
//             setFilters((prev) => ({ ...prev, searchType: "Lokos SHG Code" }));
//         } else {
//             setFilters((prev) => ({ ...prev, searchType: "Mobile No" }));
//         }
//     }, [filters.participantType]);

//     useEffect(() => {
//         if (onFilterChange) {
//             onFilterChange(filters);
//         }
//     }, [filters, onFilterChange]);

//     const handleChange = (field, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     const handleThemeChange = (e) => {
//         const selectedOption = e.target.options[e.target.selectedIndex];
//         const themeId = selectedOption.getAttribute("data-id") || "";
//         const themeValue = e.target.value;

//         setFilters((prev) => ({
//             ...prev,
//             trainingTheme: themeValue,
//             trainingThemeId: themeId,
//             trainingPlan: "",
//             endDate: "",
//         }));
//     };

//     const handleTrainingPlanChange = (planIdentifier) => {
//         handleChange("trainingPlan", planIdentifier);

//         const startDate = filters?.startDate;
//         if (!startDate || !planIdentifier) {
//             handleChange("endDate", "");
//             return;
//         }

//         const selectedPlan = displayedPlans.find(
//             (plan) => plan.name === planIdentifier || plan.id === planIdentifier || plan.training_name === planIdentifier || plan.plan_name === planIdentifier
//         );

//         const planDays = selectedPlan?.days || selectedPlan?.duration_days || 1;

//         const start = new Date(startDate);
//         start.setDate(start.getDate() + (planDays - 1));

//         const endDate = start.toISOString().split("T")[0];
//         handleChange("endDate", endDate);
//     };

//     return (
//         <div
//             style={{
//                 background: "#fff",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                 marginBottom: "20px",
//             }}
//         >
//             <h3 style={{ marginBottom: "20px" }}>Training Filters</h3>

//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//                     gap: "16px",
//                 }}
//             >
//                 {/* Financial Year */}
//                 <div>
//                     <label style={labelStyle}>Financial Year</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.financialYear}
//                         onChange={(e) => handleChange("financialYear", e.target.value)}
//                     >
//                         <option value="">None</option>
//                         {financialYears.map((item) => (
//                             <option key={item} value={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Training Theme */}
//                 <div>
//                     <label style={labelStyle}>Training Theme</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingTheme}
//                         onChange={handleThemeChange}
//                     >
//                         <option value="" data-id="">None</option>
//                         {apiThemes.length > 0
//                             ? apiThemes.map((item) => {
//                                 const themeValue = item.theme_name || item.name || item;
//                                 const themeId = item.id || "";
//                                 return (
//                                     <option key={themeId} value={themeValue} data-id={themeId}>
//                                         {themeValue}
//                                     </option>
//                                 );
//                             })
//                             : fallbackThemes.map((item) => (
//                                 <option key={item} value={item} data-id="">
//                                     {item}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>

//                 {/* Training Plan */}
//                 <div>
//                     <label style={labelStyle}>Training Plan</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingPlan}
//                         onChange={(e) => handleTrainingPlanChange(e.target.value)}
//                         disabled={filters.trainingThemeId && displayedPlans.length === 0}
//                     >
//                         <option value="">None</option>
//                         {displayedPlans.length > 0 ? (
//                             displayedPlans.map((item) => {
//                                 const planValue = item.training_name || item.name || item.plan_name;
//                                 const planId = item.id || planValue;
//                                 return (
//                                     <option key={planId} value={planValue}>
//                                         {planValue}
//                                     </option>
//                                 );
//                             })
//                         ) : null}
//                     </select>
//                 </div>

//                 {/* Participant Type */}
//                 <div>
//                     <label style={labelStyle}>Participant Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.participantType}
//                         onChange={(e) => handleChange("participantType", e.target.value)}
//                     >
//                         <option value="">None</option>
//                         {participantTypes.map((item) => (
//                             <option key={item} value={item}>{item}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: "10px",
//                     marginTop: "20px",
//                 }}
//             >
//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "none",
//                         borderRadius: "8px",
//                         background: "#2563eb",
//                         color: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() => console.log(filters)}
//                 >
//                     Apply Filters
//                 </button>

//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         border: "1px solid #d1d5db",
//                         borderRadius: "8px",
//                         background: "#fff",
//                         cursor: "pointer",
//                     }}
//                     onClick={() =>
//                         setFilters({
//                             financialYear: "2026-27",
//                             trainingTheme: "",
//                             trainingThemeId: "",
//                             trainingPlan: "",
//                             participantType: "Beneficiary",
//                             gender: "",
//                             designation: "",
//                             pldStatus: "",
//                             socialCategory: "",
//                             religion: "",
//                             panchayat: "",
//                             village: "",
//                             searchType: "Lokos SHG Code",
//                             searchValue: "",
//                             ageGroup: "",
//                             startDate: "",
//                             endDate: "",
//                         })
//                     }
//                 >
//                     Reset
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default FilterComponent;



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

    // const [filters, setFilters] = useState({
    //     financialYear: "2026-27",
    //     trainingTheme: "",
    //     trainingThemeId: "",
    //     trainingPlan: "",
    //     trainingPlanDays: "",
    //     participantType: "Beneficiary",
    //     gender: "",
    //     designation: "",
    //     pldStatus: "",
    //     socialCategory: "",
    //     religion: "",
    //     panchayat: "",
    //     village: "",
    //     searchType: "Lokos SHG Code",
    //     searchValue: "",
    //     ageGroup: "",
    //     startDate: "",
    //     endDate: "",
    // });

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

                if (planResponse && Array.isArray(planResponse.data)) {
                    setApiPlans(planResponse.data);
                } else if (planResponse && Array.isArray(planResponse.data?.results)) {
                    setApiPlans(planResponse.data.results);
                } else if (Array.isArray(planResponse)) {
                    setApiPlans(planResponse);
                }
            } catch (err) {
                console.error(`Failed to load training plans for theme ID ${filters.trainingThemeId}:`, err);
                setApiPlans([]);
            }
        };

        fetchDependentPlans();
    }, [filters.trainingThemeId]);

    // 3. Client-side isolation filter loop map matching selected theme key
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

    // useEffect(() => {
    //     if (filters.participantType === "Beneficiary") {
    //         setFilters((prev) => ({ ...prev, searchType: "Lokos SHG Code" }));
    //     } else {
    //         setFilters((prev) => ({ ...prev, searchType: "Mobile No" }));
    //     }
    // }, [filters.participantType]);




    // useEffect(() => {
    //     if (onFilterChange) {
    //         onFilterChange(filters);
    //     }
    // }, [filters, onFilterChange]);

    // const handleChange = (field, value) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         [field]: value,
    //     }));
    // };

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

        // setFilters((prev) => ({
        //     ...prev,
        //     trainingTheme: themeValue,
        //     trainingThemeId: themeId,
        //     trainingPlan: "",
        //     trainingPlanDays: "",
        //     endDate: "",
        // }));
    };

    const handleTrainingPlanChange = (planIdentifier) => {
        const NewselectedPlan = displayedPlans.find(
            (plan) => String(plan.id) === String(planIdentifier)
        );

        console.log(NewselectedPlan);

        console.log(planIdentifier);
        // handleChange("trainingPlan", NewselectedPlan.id);
        // handleChange("trainingPlanDays", NewselectedPlan.no_of_days);

        updateFilter("trainingPlan", NewselectedPlan.id);
        updateFilter("trainingPlanDays", NewselectedPlan.no_of_days);

        const startDate = filters?.startDate;
        if (!startDate || !NewselectedPlan) {
            handleChange("endDate", "");
            return;
        }

        const selectedPlan = displayedPlans.find(
            (plan) => plan.name === planIdentifier.training_name || plan.id === planIdentifier.id || plan.training_name === planIdentifier.training_name || plan.plan_name === planIdentifier
        );

        // Checked explicitly by backend key property parameter layout: no_of_days
        const planDays = NewselectedPlan?.no_of_days || 1;
        handleChange("trainingPlanDays", planDays);

        const start = new Date(startDate);
        start.setDate(start.getDate() + (Number(planDays) - 1));

        const endDate = start.toISOString().split("T")[0];
        handleChange("endDate", endDate);
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

                {/* <button
                    style={{
                        padding: "10px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: "#fff",
                        cursor: "pointer",
                        color: "#c00202",
                    }}
                    onClick={() =>
                        setFilters({
                            // financialYear: "2026-27",
                            // trainingTheme: "",
                            // trainingThemeId: "",
                            // trainingPlan: "",
                            // participantType: "Beneficiary",
                            // gender: "",
                            // designation: "",
                            // pldStatus: "",
                            // socialCategory: "",
                            // religion: "",
                            // panchayat: "",
                            // village: "",
                            // searchType: "Lokos SHG Code",
                            // searchValue: "",
                            // ageGroup: "",
                            // startDate: "",
                            // endDate: "",
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
                handleChange("panchayat", "");
                handleChange("village", "");
                handleChange("searchType", "Lokos SHG Code");
                handleChange("searchValue", "");
                handleChange("ageGroup", "");
                handleChange("startDate", "");
                handleChange("endDate", "");
                        })
                    }
                >
                Reset
            </button> */}

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