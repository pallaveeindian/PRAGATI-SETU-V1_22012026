// import React from "react";

// const ParticipantTableFilters = ({
//     filters,
//     handleChange,

//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
// }) => {
//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>
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
//                         <option value="">All</option>
//                         <option value="Beneficiary">Beneficiary</option>
//                         <option value="Trainer">Trainer</option>
//                     </select>
//                 </div>

//                 {/* BENEFICIARY FILTERS */}

//                 {filters.participantType === "Beneficiary" && (
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation}
//                                 onChange={(e) =>
//                                     handleChange(
//                                         "designation",
//                                         e.target.value
//                                     )
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>
//                                 Social Category
//                             </label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory}
//                                 onChange={(e) =>
//                                     handleChange(
//                                         "socialCategory",
//                                         e.target.value
//                                     )
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>
//                                 Search SHG / Member Code
//                             </label>

//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos SHG Code / Lokos Member Code"
//                                 value={filters.searchValue}
//                                 onChange={(e) =>
//                                     handleChange(
//                                         "searchValue",
//                                         e.target.value
//                                     )
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>

//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange}
//                                 onChange={(e) =>
//                                     handleChange("ageRange", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>

//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}

//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>
//                             Search Trainer
//                         </label>

//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue}
//                             onChange={(e) =>
//                                 handleChange(
//                                     "searchValue",
//                                     e.target.value
//                                 )
//                             }
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React from "react";

// const ParticipantTableFilters = ({
//     filters,
//     handleChange,

//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
// }) => {
//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>
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
//                         <option value="">All</option>
//                         <option value="Beneficiary">Beneficiary</option>
//                         <option value="Trainer">Trainer</option>
//                     </select>
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation}
//                                 onChange={(e) =>
//                                     handleChange(
//                                         "designation",
//                                         e.target.value
//                                     )
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory}
//                                 onChange={(e) =>
//                                     handleChange(
//                                         "socialCategory",
//                                         e.target.value
//                                     )
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
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
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>
//                                 Search SHG / Member Code
//                             </label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos SHG Code / Lokos Member Code"
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) =>
//                                     handleChange(
//                                         "searchValue",
//                                         e.target.value
//                                     )
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange}
//                                 onChange={(e) =>
//                                     handleChange("ageRange", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) =>
//                                 handleChange(
//                                     "searchValue",
//                                     e.target.value
//                                 )
//                             }
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters; 



// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,

//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
// }) => {
//     // Defensive check handler to intercept call crashes if prop is missing
//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop to <ParticipantTableFilters />. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>
//                 {/* Participant Type */}
//                 {/* <div>
//                     <label style={labelStyle}>Participant Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.participantType || ""}
//                         onChange={(e) =>
//                             handleValueChange("participantType", e.target.value)
//                         }
//                     >
//                         <option value="">All</option>
//                         <option value="Beneficiary">Beneficiary</option>
//                         <option value="Trainer">Trainer</option>
//                     </select>
//                 </div> */}

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("gender", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("designation", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("pldStatus", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("socialCategory", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("religion", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("panchayat", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("village", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>
//                                 Search SHG / Member Code
//                             </label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos SHG Code / Lokos Member Code"
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("searchValue", e.target.value)
//                                 }
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) =>
//                                     handleValueChange("ageRange", e.target.value)
//                                 }
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>
//                                         {item}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) =>
//                                 handleValueChange("searchValue", e.target.value)
//                             }
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;



// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,

//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"], // Dummy Blocks List
// }) => {

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     // Combined/Multiple select ke values ko array mein extract karne ke liye helper
//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             // Reset block selection whenever batch type changes to avoid array/string type clash
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>
//                                     {b}
//                                 </option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>
//                                     {b}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
//     trainingPlans = [
//         { id: "plan1", name: "Basic Orientation (3 Days)", days: 3 },
//         { id: "plan2", name: "Technical Training (5 Days)", days: 5 },
//         { id: "plan3", name: "Advanced Workshop (7 Days)", days: 7 },
//     ] // Dummy Training Plans
// }) => {

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     // Helper to calculate the minimum valid start date (Today + 7 Days)
//     const getMinStartDate = () => {
//         const today = new Date();
//         today.setDate(today.getDate() + 7);
//         return today.toISOString().split("T")[0]; // Formats to YYYY-MM-DD
//     };

//     // Automatically calculate End Date based on Start Date and selected training plan length
//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);

//         if (dateValue && filters.trainingPlanId) {
//             const selectedPlan = trainingPlans.find(p => p.id === filters.trainingPlanId);
//             if (selectedPlan) {
//                 calculateAndSetEndDate(dateValue, selectedPlan.days);
//             }
//         }
//     };

//     const handleTrainingPlanChange = (planId) => {
//         handleValueChange("trainingPlanId", planId);

//         if (filters.startDate && planId) {
//             const selectedPlan = trainingPlans.find(p => p.id === planId);
//             if (selectedPlan) {
//                 calculateAndSetEndDate(filters.startDate, selectedPlan.days);
//             }
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         // Ex: If a plan takes 3 days and starts on 1st, it completes on 1st + (3 - 1) = 3rd.
//         start.setDate(start.getDate() + (days - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* TRAINING PLAN SELECTOR */}
//                 {/* <div>
//                     <label style={labelStyle}>Training Plan</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingPlanId || ""}
//                         onChange={(e) => handleTrainingPlanChange(e.target.value)}
//                     >
//                         <option value="">Select Training Plan</option>
//                         {trainingPlans.map((plan) => (
//                             <option key={plan.id} value={plan.id}>
//                                 {plan.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div> */}

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()} // Restricts dates within today + 1 week
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
//     trainingPlans = [
//         { id: "plan1", name: "Basic Orientation (3 Days)", days: 3 },
//         { id: "plan2", name: "Technical Training (5 Days)", days: 5 },
//         { id: "plan3", name: "Advanced Workshop (7 Days)", days: 7 },
//     ] // Dummy Training Plans
// }) => {

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     // Helper to calculate the minimum valid start date (Today + 7 Days)
//     const getMinStartDate = () => {
//         const today = new Date();
//         today.setDate(today.getDate() + 7);
//         return today.toISOString().split("T")[0]; // Formats to YYYY-MM-DD
//     };

//     // Helper to lock the upper bound of the selected date to selected date + 1 week
//     const getMaxStartDate = () => {
//         if (!filters.startDate) return undefined;
//         const currentStart = new Date(filters.startDate);
//         currentStart.setDate(currentStart.getDate() + 7);
//         return currentStart.toISOString().split("T")[0];
//     };

//     // Automatically calculate End Date based on Start Date and selected training plan length
//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);

//         if (dateValue && filters.trainingPlanId) {
//             const selectedPlan = trainingPlans.find(p => p.id === filters.trainingPlanId);
//             if (selectedPlan) {
//                 calculateAndSetEndDate(dateValue, selectedPlan.days);
//             }
//         }
//     };

//     const handleTrainingPlanChange = (planId) => {
//         handleValueChange("trainingPlanId", planId);

//         if (filters.startDate && planId) {
//             const selectedPlan = trainingPlans.find(p => p.id === planId);
//             if (selectedPlan) {
//                 calculateAndSetEndDate(filters.startDate, selectedPlan.days);
//             }
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         // Ex: If a plan takes 3 days and starts on 1st, it completes on 1st + (3 - 1) = 3rd.
//         start.setDate(start.getDate() + (days - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* TRAINING PLAN SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Training Plan</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.trainingPlanId || ""}
//                         onChange={(e) => handleTrainingPlanChange(e.target.value)}
//                     >
//                         <option value="">Select Training Plan</option>
//                         {trainingPlans.map((plan) => (
//                             <option key={plan.id} value={plan.id}>
//                                 {plan.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()} // Dynamically locks calendar view up to selected date + 1 week
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
//     trainingPlans = [
//         { id: "plan1", name: "Basic Orientation (3 Days)", days: 3 },
//         { id: "plan2", name: "Technical Training (5 Days)", days: 5 },
//         { id: "plan3", name: "Advanced Workshop (7 Days)", days: 7 },
//     ]
// }) => {

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const today = new Date();
//         today.setDate(today.getDate() + 7);
//         return today.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         if (!filters.startDate) return undefined;
//         const currentStart = new Date(filters.startDate);
//         currentStart.setDate(currentStart.getDate() + 7);
//         return currentStart.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);

//         if (dateValue && filters.trainingPlanId) {
//             const selectedPlan = trainingPlans.find(p => p.id === filters.trainingPlanId);
//             if (selectedPlan) {
//                 calculateAndSetEndDate(dateValue, selectedPlan.days);
//             }
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (days - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()}
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;



// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
//     // Matches the updated ones in FilterComponent
//     trainingPlans = [
//         { id: "plan1", name: "Annual Plan", days: 365 },
//         { id: "plan2", name: "Quarterly Plan", days: 90 },
//         { id: "plan3", name: "Monthly Plan", days: 30 },
//         { id: "plan4", name: "Special Campaign", days: 5 },
//     ]
// }) => {

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     // Min date is +1 day from today (After today)
//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     // Max date is +7 days from today (+1 week from today)
//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);

//         // If both Start Date and Training Plan are present, auto-calc End Date
//         if (dateValue && filters.trainingPlan) {
//             const selectedPlan = trainingPlans.find(p => p.name === filters.trainingPlan);
//             if (selectedPlan) {
//                 calculateAndSetEndDate(dateValue, selectedPlan.days);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (days - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()}
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React from "react";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
//     // Uses structural objects mirroring FilterComponent schema checks
//     trainingPlans = []
// }) => {

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         // Auto-calculates validation threshold bounds if target data structure properties are selected
//         if (dateValue && filters.trainingPlan) {
//             console.log("DAYS AAGAYE", filters.trainingPlanDays);
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 console.log(planDays);
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()}
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;

// import React, { useState, useEffect } from "react";
// import { LOOKUP_API } from "../../../api/axios";
// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats = [],
//     villages = [],
//     ageRanges = [],
//     // Fallback defaults if geoscope or parent arrays are not populated
//     blocks: initialBlocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
//     trainingPlans = []
// }) => {
//     const [blocks, setBlocks] = useState(initialBlocks);

//     // Dynamic scope detection using the explicit User Geoscope mapping
//     useEffect(() => {
//         const fetchScopedLocationData = async () => {
//             try {
//                 const userRoleId = localStorage.getItem("user_role_id");
//                 const userId = localStorage.getItem("user_id");

//                 // Strict check: Intercept if the logged-in user is a DTP (Role ID: 13)
//                 if (String(userRoleId) === "13" && userId) {
//                     if (typeof LOOKUP_API?.userGeoscopeByUserId === "function") {
//                         const response = await LOOKUP_API.userGeoscopeByUserId(userId);

//                         if (response?.data) {
//                             // Extract blocks list from the geoscope payload structural schema
//                             const geoBlocks = response.data.blocks || response.data.geoscope?.blocks;

//                             if (Array.isArray(geoBlocks)) {
//                                 const scopedBlocks = geoBlocks.map(b =>
//                                     typeof b === "object" ? (b.block_name || b.name || b.block_code) : b
//                                 );
//                                 setBlocks(scopedBlocks);
//                             }
//                         }
//                     }
//                 } else {
//                     // Fallback to initial props if not a restricted DTP profile
//                     setBlocks(initialBlocks);
//                 }
//             } catch (error) {
//                 console.error("Failed pulling geoscope location configurations:", error);
//             }
//         };

//         fetchScopedLocationData();
//     }, [initialBlocks]);

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         // Auto-calculates validation threshold bounds if target data structure properties are selected
//         if (dateValue && filters.trainingPlan) {
//             console.log("DAYS AAGAYE", filters.trainingPlanDays);
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 console.log(planDays);
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block_name_en) ? filters.block_name_en : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b) => (
//                                 <option key={b} value={b}>{b}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()}
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React, { useState, useEffect } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats: propPanchayats = [],
//     villages: propVillages = [],
//     ageRanges = [],
//     blocks: initialBlocks = [],
//     trainingPlans = []
// }) => {
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState(propPanchayats);
//     const [villages, setVillages] = useState(propVillages);

//     // 1. Fetch blocks filtered by DTP Geoscope or fall back to properties
//     useEffect(() => {
//         const fetchScopedLocationData = async () => {
//             try {
//                 const userRoleId = localStorage.getItem("user_role_id");
//                 const userId = localStorage.getItem("user_id");

//                 // If logged in user is a DTP (Role ID: 13)
//                 if (String(userRoleId) === "13" && userId) {
//                     if (typeof LOOKUP_API?.userGeoscopeByUserId === "function") {
//                         const response = await LOOKUP_API.userGeoscopeByUserId(userId);
//                         const geoBlocks = response?.data?.blocks || response?.data?.geoscope?.blocks;

//                         if (Array.isArray(geoBlocks)) {
//                             setBlocks(geoBlocks);
//                             return;
//                         }
//                     }
//                 }

//                 // General fallback if not a DTP or if API didn't return an array
//                 if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
//                     setBlocks(initialBlocks);
//                 } else if (typeof LOOKUP_API?.blocks?.list === "function") {
//                     const response = await LOOKUP_API.blocks.list();
//                     setBlocks(response?.data || []);
//                 }
//             } catch (error) {
//                 console.error("Failed pulling geoscope location configurations:", error);
//                 setBlocks(initialBlocks);
//             }
//         };

//         fetchScopedLocationData();
//     }, [initialBlocks]);

//     // 2. Cascade Chain: Fetch Panchayats automatically when a single Block is selected
//     useEffect(() => {
//         const fetchPanchayats = async () => {
//             const selectedBlock = filters.block;
//             if (selectedBlock && typeof LOOKUP_API?.panchayatsByBlock === "function") {
//                 try {
//                     // Handles passing either block ID/code or string text depending on your lookup design
//                     const blockId = typeof selectedBlock === "object" ? (selectedBlock.id || selectedBlock.block_code) : selectedBlock;
//                     const response = await LOOKUP_API.panchayatsByBlock(blockId);
//                     setPanchayats(response?.data || []);
//                 } catch (err) {
//                     console.error("Error fetching dependent panchayats:", err);
//                 }
//             } else {
//                 setPanchayats(propPanchayats);
//             }
//             // Reset lower down values down the branch
//             setVillages(propVillages);
//         };

//         if (filters.batchType !== "Combined") {
//             fetchPanchayats();
//         }
//     }, [filters.block, filters.batchType, propPanchayats, propVillages]);

//     // 3. Cascade Chain: Fetch Villages automatically when a Panchayat is selected
//     useEffect(() => {
//         const fetchVillages = async () => {
//             const selectedPanchayat = filters.panchayat;
//             if (selectedPanchayat && typeof LOOKUP_API?.villagesByPanchayat === "function") {
//                 try {
//                     const panchayatId = typeof selectedPanchayat === "object" ? (selectedPanchayat.id || selectedPanchayat.panchayat_code) : selectedPanchayat;
//                     const response = await LOOKUP_API.villagesByPanchayat(panchayatId);
//                     setVillages(response?.data || []);
//                 } catch (err) {
//                     console.error("Error fetching dependent villages:", err);
//                 }
//             } else {
//                 setVillages(propVillages);
//             }
//         };

//         fetchVillages();
//     }, [filters.panchayat, propVillages]);

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         if (dateValue && filters.trainingPlan) {
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     // Helper utilities to parse naming values uniformly out of objects vs strings
//     const getBlockValue = (b) => typeof b === "object" ? (b.block_code || b.block_name_en || b.block_name || b.name) : b;
//     const getBlockLabel = (b) => typeof b === "object" ? (b.block_name_en || b.block_name || b.name) : b;

//     const getPanchayatValue = (p) => typeof p === "object" ? (p.panchayat_code || p.panchayat_name || p.name) : p;
//     const getPanchayatLabel = (p) => typeof p === "object" ? (p.panchayat_name || p.name) : p;

//     const getVillageValue = (v) => typeof v === "object" ? (v.village_code || v.village_name || v.name) : v;
//     const getVillageLabel = (v) => typeof v === "object" ? (v.village_name || v.name) : v;

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block_name_en) ? filters.block_name_en : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>{getBlockLabel(b)}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>{getBlockLabel(b)}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()}
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item, idx) => (
//                                     <option key={idx} value={getPanchayatValue(item)}>{getPanchayatLabel(item)}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item, idx) => (
//                                     <option key={idx} value={getVillageValue(item)}>{getVillageLabel(item)}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React, { useState, useEffect } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats: propPanchayats = [],
//     villages: propVillages = [],
//     ageRanges = [],
//     blocks: initialBlocks = [],
//     trainingPlans = []
// }) => {
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState(propPanchayats);
//     const [villages, setVillages] = useState(propVillages);

//     // 1. Fetch blocks using LOOKUP_API.blocksByDistrict with the DTP's district ID
//     useEffect(() => {
//         const fetchScopedLocationData = async () => {
//             try {
//                 const userRoleId = localStorage.getItem("user_role_id");

//                 // Fetch and parse the user metadata object from localStorage
//                 const userSessionString = localStorage.getItem("user");
//                 let districtId = null;

//                 if (userSessionString) {
//                     const parsedUser = JSON.parse(userSessionString);
//                     // Adjust key names to fit your precise database model property (e.g., district_id or district)
//                     districtId = parsedUser?.district_id || parsedUser?.district;
//                 }

//                 // If logged in user is a DTP (Role ID: 13) and has a valid district ID
//                 if (String(userRoleId) === "13" && districtId) {
//                     if (typeof LOOKUP_API?.blocksByDistrict === "function") {
//                         const response = await LOOKUP_API.blocksByDistrict(districtId);
//                         const mappedBlocks = response?.data;

//                         if (Array.isArray(mappedBlocks)) {
//                             setBlocks(mappedBlocks);
//                             return;
//                         }
//                     }
//                 }

//                 // General fallback if not a DTP user profile or if district metadata is missing
//                 if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
//                     setBlocks(initialBlocks);
//                 } else if (typeof LOOKUP_API?.blocks?.list === "function") {
//                     const response = await LOOKUP_API.blocks.list();
//                     setBlocks(response?.data || []);
//                 }
//             } catch (error) {
//                 console.error("Failed pulling district scoped location configurations:", error);
//                 setBlocks(initialBlocks);
//             }
//         };

//         fetchScopedLocationData();
//     }, [initialBlocks]);

//     // 2. Cascade Chain: Fetch Panchayats automatically when a single Block is selected
//     useEffect(() => {
//         const fetchPanchayats = async () => {
//             const selectedBlock = filters.block;
//             if (selectedBlock && typeof LOOKUP_API?.panchayatsByBlock === "function") {
//                 try {
//                     const blockId = typeof selectedBlock === "object" ? (selectedBlock.id || selectedBlock.block_code) : selectedBlock;
//                     const response = await LOOKUP_API.panchayatsByBlock(blockId);
//                     setPanchayats(response?.data || []);
//                 } catch (err) {
//                     console.error("Error fetching dependent panchayats:", err);
//                 }
//             } else {
//                 setPanchayats(propPanchayats);
//             }
//             setVillages(propVillages);
//         };

//         if (filters.batchType !== "Combined") {
//             fetchPanchayats();
//         }
//     }, [filters.block, filters.batchType, propPanchayats, propVillages]);

//     // 3. Cascade Chain: Fetch Villages automatically when a Panchayat is selected
//     useEffect(() => {
//         const fetchVillages = async () => {
//             const selectedPanchayat = filters.panchayat;
//             if (selectedPanchayat && typeof LOOKUP_API?.villagesByPanchayat === "function") {
//                 try {
//                     const panchayatId = typeof selectedPanchayat === "object" ? (selectedPanchayat.id || selectedPanchayat.panchayat_code) : selectedPanchayat;
//                     const response = await LOOKUP_API.villagesByPanchayat(panchayatId);
//                     setVillages(response?.data || []);
//                 } catch (err) {
//                     console.error("Error fetching dependent villages:", err);
//                 }
//             } else {
//                 setVillages(propVillages);
//             }
//         };

//         fetchVillages();
//     }, [filters.panchayat, propVillages]);

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         } else {
//             console.error(
//                 `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
//                 typeof handleChange
//             );
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         if (dateValue && filters.trainingPlan) {
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = {
//         background: "#fff",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         padding: "20px",
//         marginBottom: "20px",
//     };

//     const gridStyle = {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//         gap: "16px",
//     };

//     const labelStyle = {
//         display: "block",
//         fontSize: "13px",
//         fontWeight: "600",
//         marginBottom: "6px",
//         color: "#374151",
//     };

//     const selectStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const inputStyle = {
//         width: "100%",
//         padding: "10px 12px",
//         border: "1px solid #d1d5db",
//         borderRadius: "8px",
//         outline: "none",
//         fontSize: "14px",
//         background: "#fff",
//     };

//     const isCombined = filters.batchType === "Combined";

//     // Dynamic key extractors ensuring uniform option binding
//     const getBlockValue = (b) => typeof b === "object" ? (b.block_code || b.id || b.block_name_en || b.block_name || b.name) : b;
//     const getBlockLabel = (b) => typeof b === "object" ? (b.block_name_en || b.block_name || b.name) : b;

//     const getPanchayatValue = (p) => typeof p === "object" ? (p.panchayat_code || p.id || p.panchayat_name || p.name) : p;
//     const getPanchayatLabel = (p) => typeof p === "object" ? (p.panchayat_name || p.name) : p;

//     const getVillageValue = (v) => typeof v === "object" ? (v.village_code || v.id || v.village_name || v.name) : v;
//     const getVillageLabel = (v) => typeof v === "object" ? (v.village_name || v.name) : v;

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>

//                 {/* BATCH TYPE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
//                 <div>
//                     <label style={labelStyle}>
//                         Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
//                     </label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {blocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>{getBlockLabel(b)}</option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => handleValueChange("block", e.target.value)}
//                         >
//                             <option value="">All Blocks</option>
//                             {blocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>{getBlockLabel(b)}</option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 {/* START DATE SELECTOR */}
//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input
//                         type="date"
//                         style={inputStyle}
//                         min={getMinStartDate()}
//                         max={getMaxStartDate()}
//                         value={filters.startDate || ""}
//                         onChange={(e) => handleStartDateChange(e.target.value)}
//                     />
//                 </div>

//                 {/* END DATE DISPLAY (AUTO CALCULATION) */}
//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input
//                         type="date"
//                         style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
//                         value={filters.endDate || ""}
//                         disabled
//                         placeholder="Auto calculated"
//                     />
//                 </div>

//                 {/* BENEFICIARY FILTERS */}
//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.gender || ""}
//                                 onChange={(e) => handleValueChange("gender", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {genders.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.designation || ""}
//                                 onChange={(e) => handleValueChange("designation", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {designations.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.pldStatus || ""}
//                                 onChange={(e) => handleValueChange("pldStatus", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.socialCategory || ""}
//                                 onChange={(e) => handleValueChange("socialCategory", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.religion || ""}
//                                 onChange={(e) => handleValueChange("religion", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {religions.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.panchayat || ""}
//                                 onChange={(e) => handleValueChange("panchayat", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {panchayats.map((item, idx) => (
//                                     <option key={idx} value={getPanchayatValue(item)}>{getPanchayatLabel(item)}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.village || ""}
//                                 onChange={(e) => handleValueChange("village", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {villages.map((item, idx) => (
//                                     <option key={idx} value={getVillageValue(item)}>{getVillageLabel(item)}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input
//                                 style={inputStyle}
//                                 placeholder="Search Lokos Code..."
//                                 value={filters.searchValue || ""}
//                                 onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select
//                                 style={selectStyle}
//                                 value={filters.ageRange || ""}
//                                 onChange={(e) => handleValueChange("ageRange", e.target.value)}
//                             >
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => (
//                                     <option key={item} value={item}>{item}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {/* TRAINER FILTERS */}
//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input
//                             style={inputStyle}
//                             placeholder="Search by Mobile No / Full Name"
//                             value={filters.searchValue || ""}
//                             onChange={(e) => handleValueChange("searchValue", e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;

// import React, { useState, useEffect } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats: propPanchayats = [],
//     villages: propVillages = [],
//     ageRanges = [],
//     blocks: initialBlocks = [],
//     trainingPlans = []
// }) => {
//     // Force initialization to a guaranteed empty array
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState([]);
//     const [villages, setVillages] = useState([]);

//     // Sync prop changes for panchayats and villages safely
//     useEffect(() => {
//         setPanchayats(Array.isArray(propPanchayats) ? propPanchayats : []);
//     }, [propPanchayats]);

//     useEffect(() => {
//         setVillages(Array.isArray(propVillages) ? propVillages : []);
//     }, [propVillages]);

//     // 1. Core Scoped Retrieval via blocksByDistrict API with rigorous array type guardrails
//     useEffect(() => {
//         const fetchScopedLocationData = async () => {
//             try {
//                 const userRoleId = localStorage.getItem("user_role_id");
//                 const userSessionString = localStorage.getItem("user_id");
//                 let districtId = null;

//                 if (userSessionString) {
//                     const response = await LOOKUP_API.userGeoscopeByUserId(userSessionString);
//                     console.log("Fetched user geoscope data:", response);
//                     districtId = response?.data?.districts[0] || response?.data?.district;
//                 }

//                 // Default check: Trigger blocksByDistrict if role matches DTP (13)
//                 if (String(userRoleId) === "13" && districtId) {
//                     if (typeof LOOKUP_API?.blocksByDistrict === "function") {
//                         const response = await LOOKUP_API.blocksByDistrict(districtId);

//                         // Handle all variations of API response payloads safely
//                         const rawData = response?.data?.results || response?.data || response;
//                         if (Array.isArray(rawData)) {
//                             setBlocks(rawData);
//                             return;
//                         }
//                     }
//                 }

//                 // Generalized safety fallbacks if not a DTP user profile
//                 if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
//                     setBlocks(initialBlocks);
//                 } else if (typeof LOOKUP_API?.blocks?.list === "function") {
//                     const response = await LOOKUP_API.blocks.list();
//                     const listData = response?.data?.results || response?.data || response;
//                     setBlocks(Array.isArray(listData) ? listData : []);
//                 } else {
//                     setBlocks([]);
//                 }
//             } catch (error) {
//                 console.error("Failed pulling district scoped location configurations:", error);
//                 setBlocks(Array.isArray(initialBlocks) ? initialBlocks : []);
//             }
//         };

//         fetchScopedLocationData();
//     }, [initialBlocks]);

//     // 2. Cascade Chain: Fetch Panchayats automatically when a single Block is selected
//     // useEffect(() => {
//     //     const fetchPanchayats = async () => {
//     //         const selectedBlock = filters.block;
//     //         if (selectedBlock && typeof LOOKUP_API?.panchayatsByBlock === "function") {
//     //             try {
//     //                 const blockId = typeof selectedBlock === "object" ? (selectedBlock.id || selectedBlock.block_code) : selectedBlock;
//     //                 const response = await LOOKUP_API.panchayatsByBlock(blockId);
//     //                 const resData = response?.data?.results || response?.data || response;
//     //                 setPanchayats(Array.isArray(resData) ? resData : []);
//     //             } catch (err) {
//     //                 console.error("Error fetching dependent panchayats:", err);
//     //                 setPanchayats([]);
//     //             }
//     //         } else {
//     //             setPanchayats(Array.isArray(propPanchayats) ? propPanchayats : []);
//     //         }
//     //         setVillages(Array.isArray(propVillages) ? propVillages : []);
//     //     };

//     //     if (filters.batchType !== "Combined") {
//     //         fetchPanchayats();
//     //     }
//     // }, [filters.block, filters.batchType, propPanchayats, propVillages]);

//     useEffect(() => {
//         const fetchPanchayats = async () => {

//             if (!filters.block || filters.batchType === "Combined") {
//                 setPanchayats([]);
//                 setVillages([]);
//                 return;
//             }

//             try {

//                 const response = await LOOKUP_API.panchayatsByBlock(filters.block);
//                 console.log(response);
//                 console.log(response.data);
//                 const data =
//                     response?.data?.results ||
//                     response?.data ||
//                     [];

//                 console.log("Panchayat API", data);

//                 setPanchayats(Array.isArray(data) ? data : []);
//                 setVillages([]);

//             } catch (err) {
//                 console.error(err);
//                 setPanchayats([]);
//                 setVillages([]);
//             }
//         };

//         fetchPanchayats();

//     }, [filters.block, filters.batchType]);

//     // 3. Cascade Chain: Fetch Villages automatically when a Panchayat is selected
//     // useEffect(() => {
//     //     const fetchVillages = async () => {
//     //         const selectedPanchayat = filters.panchayat;
//     //         if (selectedPanchayat && typeof LOOKUP_API?.villagesByPanchayat === "function") {
//     //             try {
//     //                 const panchayatId = typeof selectedPanchayat === "object" ? (selectedPanchayat.id || selectedPanchayat.panchayat_code) : selectedPanchayat;
//     //                 const response = await LOOKUP_API.villagesByPanchayat(panchayatId);
//     //                 const resData = response?.data?.results || response?.data || response;
//     //                 setVillages(Array.isArray(resData) ? resData : []);
//     //             } catch (err) {
//     //                 console.error("Error fetching dependent villages:", err);
//     //                 setVillages([]);
//     //             }
//     //         } else {
//     //             setVillages(Array.isArray(propVillages) ? propVillages : []);
//     //         }
//     //     };

//     //     fetchVillages();
//     // }, [filters.panchayat, propVillages]);

//     useEffect(() => {

//         const fetchVillages = async () => {

//             if (!filters.panchayat) {
//                 setVillages([]);
//                 return;
//             }

//             try {

//                 const response = await LOOKUP_API.villagesByPanchayat(filters.panchayat);
//                 console.log(response);
//                 console.log(response.data);
//                 const data =
//                     response?.data?.results ||
//                     response?.data ||
//                     [];

//                 console.log("Village API", data);

//                 setVillages(Array.isArray(data) ? data : []);

//             } catch (err) {
//                 console.error(err);
//                 setVillages([]);
//             }

//         };

//         fetchVillages();

//     }, [filters.panchayat]);

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         if (dateValue && filters.trainingPlan) {
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "20px" };
//     const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" };
//     const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" };
//     const selectStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };
//     const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };

//     const isCombined = filters.batchType === "Combined";

//     // const getBlockValue = (b) => typeof b === "object" ? (b.block_code || b.id || b.block_name_en || b.block_name || b.name) : b;
//     const getBlockValue = (b) =>
//         typeof b === "object"
//             ? (
//                 b.id ??
//                 b.block_id ??
//                 b.block_code ??
//                 b.value
//             )
//             : b;
//     const getBlockLabel = (b) => typeof b === "object" ? (b.block_name_en || b.block_name || b.name) : b;
//     // const getPanchayatValue = (p) => typeof p === "object" ? (p.panchayat_code || p.id || p.panchayat_name || p.name) : p;
//     const getPanchayatValue = (p) =>
//         typeof p === "object"
//             ? (
//                 p.id ??
//                 p.panchayat_id ??
//                 p.panchayat_code ??
//                 p.value
//             )
//             : p;
//     const getPanchayatLabel = (p) => typeof p === "object" ? (p.panchayat_name || p.name) : p;
//     // const getVillageValue = (v) => typeof v === "object" ? (v.village_code || v.id || v.village_name || v.name) : v;
//     const getVillageValue = (v) =>
//         typeof v === "object"
//             ? (
//                 v.id ??
//                 v.village_id ??
//                 v.village_code ??
//                 v.value
//             )
//             : v;
//     const getVillageLabel = (v) => typeof v === "object" ? (v.village_name || v.name) : v;

//     // Safety rendering wrapper to guarantee execution even during race conditions
//     const verifiedBlocks = Array.isArray(blocks) ? blocks : [];
//     const verifiedPanchayats = Array.isArray(panchayats) ? panchayats : [];
//     const verifiedVillages = Array.isArray(villages) ? villages : [];

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}</label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {verifiedBlocks.map((b, idx) => (
//                                 // <option key={idx} value={getBlockValue(b)}>{getBlockLabel(b)}</option>
//                                 <option
//                                     key={idx}
//                                     value={getBlockValue(b)}
//                                 >
//                                     {getBlockLabel(b)}
//                                 </option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             // onChange={(e) => handleValueChange("block", e.target.value)}
//                             onChange={(e) => {
//                                 handleValueChange("block", e.target.value);
//                                 handleValueChange("panchayat", "");
//                                 handleValueChange("village", "");
//                             }}
//                         >
//                             <option value="">All Blocks</option>
//                             {verifiedBlocks.map((b, idx) => (
//                                 // <option key={idx} value={getBlockValue(b)}>{getBlockLabel(b)}</option>
//                                 <option
//                                     key={idx}
//                                     value={getBlockValue(b)}
//                                 >
//                                     {getBlockLabel(b)}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input type="date" style={inputStyle} min={getMinStartDate()} max={getMaxStartDate()} value={filters.startDate || ""} onChange={(e) => handleStartDateChange(e.target.value)} />
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input type="date" style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }} value={filters.endDate || ""} disabled placeholder="Auto calculated" />
//                 </div>

//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select style={selectStyle} value={filters.gender || ""} onChange={(e) => handleValueChange("gender", e.target.value)}>
//                                 <option value="">All</option>
//                                 {genders.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select style={selectStyle} value={filters.designation || ""} onChange={(e) => handleValueChange("designation", e.target.value)}>
//                                 <option value="">All</option>
//                                 {designations.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select style={selectStyle} value={filters.pldStatus || ""} onChange={(e) => handleValueChange("pldStatus", e.target.value)}>
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select style={selectStyle} value={filters.socialCategory || ""} onChange={(e) => handleValueChange("socialCategory", e.target.value)}>
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select style={selectStyle} value={filters.religion || ""} onChange={(e) => handleValueChange("religion", e.target.value)}>
//                                 <option value="">All</option>
//                                 {religions.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select style={selectStyle} value={filters.panchayat_name_en || ""} onChange={(e) => handleValueChange("panchayat", e.target.value)}>
//                                 <option value="">All</option>
//                                 {verifiedPanchayats.map((item, idx) => <option key={idx} value={getPanchayatValue(item)}>{getPanchayatLabel(item)}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select style={selectStyle} value={filters.village_name_en || ""} onChange={(e) => handleValueChange("village", e.target.value)}>
//                                 <option value="">All</option>
//                                 {verifiedVillages.map((item, idx) => <option key={idx} value={getVillageValue(item)}>{getVillageLabel(item)}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input style={inputStyle} placeholder="Search Lokos Code..." value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select style={selectStyle} value={filters.ageRange || ""} onChange={(e) => handleValueChange("ageRange", e.target.value)}>
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input style={inputStyle} placeholder="Search by Mobile No / Full Name" value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;


// import React, { useState, useEffect } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats: propPanchayats = [],
//     villages: propVillages = [],
//     ageRanges = [],
//     blocks: initialBlocks = []
// }) => {
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState([]);
//     const [villages, setVillages] = useState([]);

//     // 1. Fetch blocks on mount based on User Role or initial fallback
//     useEffect(() => {
//         const fetchScopedLocationData = async () => {
//             try {
//                 const userRoleId = localStorage.getItem("user_role_id");
//                 const userSessionString = localStorage.getItem("user_id");
//                 let districtId = null;

//                 if (userSessionString) {
//                     const response = await LOOKUP_API.userGeoscopeByUserId(userSessionString);
//                     districtId = response?.data?.districts[0] || response?.data?.district;
//                 }

//                 if (String(userRoleId) === "13" && districtId) {
//                     if (typeof LOOKUP_API?.blocksByDistrict === "function") {
//                         const response = await LOOKUP_API.blocksByDistrict(districtId);
//                         const rawData = response?.data?.results || response?.data || response;
//                         if (Array.isArray(rawData)) {
//                             setBlocks(rawData);
//                             return;
//                         }
//                     }
//                 }

//                 if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
//                     setBlocks(initialBlocks);
//                 } else if (typeof LOOKUP_API?.blocks?.list === "function") {
//                     const response = await LOOKUP_API.blocks.list();
//                     const listData = response?.data?.results || response?.data || response;
//                     setBlocks(Array.isArray(listData) ? listData : []);
//                 } else {
//                     setBlocks([]);
//                 }
//             } catch (error) {
//                 console.error("Failed pulling district scoped location configurations:", error);
//                 setBlocks(Array.isArray(initialBlocks) ? initialBlocks : []);
//             }
//         };

//         fetchScopedLocationData();
//     }, [initialBlocks]);

//     // 2. Cascade Chain: Block select hone par Panchayats load karna
//     useEffect(() => {
//         const fetchPanchayats = async () => {
//             // Agar single block selected nahi hai ya Combined batch hai, list khali rakhein
//             if (!filters.block || Array.isArray(filters.block) || filters.batchType === "Combined") {
//                 setPanchayats([]);
//                 setVillages([]);
//                 return;
//             }

//             try {
//                 const response = await LOOKUP_API.panchayatsByBlock(filters.block);
//                 const data = response?.data?.results || response?.data || [];
//                 setPanchayats(Array.isArray(data) ? data : []);
//                 setVillages([]); // Reset villages since block/panchayat changed
//             } catch (err) {
//                 console.error("Error fetching dependent panchayats:", err);
//                 setPanchayats([]);
//                 setVillages([]);
//             }
//         };

//         fetchPanchayats();
//     }, [filters.block, filters.batchType]);

//     // 3. Cascade Chain: Panchayat select hone par Villages load karna
//     useEffect(() => {
//         const fetchVillages = async () => {
//             if (!filters.panchayat) {
//                 setVillages([]);
//                 return;
//             }

//             try {
//                 const response = await LOOKUP_API.villagesByPanchayat(filters.panchayat);
//                 const data = response?.data?.results || response?.data || [];
//                 setVillages(Array.isArray(data) ? data : []);
//             } catch (err) {
//                 console.error("Error fetching dependent villages:", err);
//                 setVillages([]);
//             }
//         };

//         fetchVillages();
//     }, [filters.panchayat]);

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         if (dateValue && filters.trainingPlan) {
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "20px" };
//     const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" };
//     const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" };
//     const selectStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };
//     const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };

//     const isCombined = filters.batchType === "Combined";

//     // Value और Label Map करने के लिए Helpers
//     const getBlockValue = (b) => typeof b === "object" ? (b.id ?? b.block_id ?? b.block_code ?? b.value) : b;
//     const getBlockLabel = (b) => typeof b === "object" ? (b.block_name_en || b.block_name || b.name) : b;

//     const getPanchayatValue = (p) => typeof p === "object" ? (p.id ?? p.panchayat_id ?? p.panchayat_code ?? p.value) : p;
//     const getPanchayatLabel = (p) => typeof p === "object" ? (p.panchayat_name || p.panchayat_name_en || p.name) : p;

//     const getVillageValue = (v) => typeof v === "object" ? (v.id ?? v.village_id ?? v.village_code ?? v.value) : v;
//     const getVillageLabel = (v) => typeof v === "object" ? (v.village_name || v.village_name_english || v.name) : v;

//     const verifiedBlocks = Array.isArray(blocks) ? blocks : [];
//     const verifiedPanchayats = Array.isArray(panchayats) ? panchayats : [];
//     const verifiedVillages = Array.isArray(villages) ? villages : [];

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("panchayat", "");
//                             handleValueChange("village", "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}</label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {verifiedBlocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>
//                                     {getBlockLabel(b)}
//                                 </option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => {
//                                 handleValueChange("block", e.target.value);
//                                 handleValueChange("panchayat", "");
//                                 handleValueChange("village", "");
//                             }}
//                         >
//                             <option value="">All Blocks</option>
//                             {verifiedBlocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>
//                                     {getBlockLabel(b)}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input type="date" style={inputStyle} min={getMinStartDate()} max={getMaxStartDate()} value={filters.startDate || ""} onChange={(e) => handleStartDateChange(e.target.value)} />
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input type="date" style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }} value={filters.endDate || ""} disabled placeholder="Auto calculated" />
//                 </div>

//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select style={selectStyle} value={filters.gender || ""} onChange={(e) => handleValueChange("gender", e.target.value)}>
//                                 <option value="">All</option>
//                                 {genders.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select style={selectStyle} value={filters.designation || ""} onChange={(e) => handleValueChange("designation", e.target.value)}>
//                                 <option value="">All</option>
//                                 {designations.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select style={selectStyle} value={filters.pldStatus || ""} onChange={(e) => handleValueChange("pldStatus", e.target.value)}>
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select style={selectStyle} value={filters.socialCategory || ""} onChange={(e) => handleValueChange("socialCategory", e.target.value)}>
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select style={selectStyle} value={filters.religion || ""} onChange={(e) => handleValueChange("religion", e.target.value)}>
//                                 <option value="">All</option>
//                                 {religions.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select style={selectStyle} value={filters.panchayat || ""} size={6}
//                                 onChange={(e) => {
//                                     handleValueChange("panchayat", e.target.value);
//                                     handleValueChange("village", "");
//                                 }}>
//                                 <option value="">All</option>
//                                 {verifiedPanchayats.map((item, idx) => (
//                                     <option key={idx} value={getPanchayatValue(item)}>
//                                         {getPanchayatLabel(item)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             {/* यहाँ Controlled value को सही Key (filters.village) असाइन की गयी है */}
//                             <select style={selectStyle} value={filters.village || ""} onChange={(e) => handleValueChange("village", e.target.value)}>
//                                 <option value="">All</option>
//                                 {verifiedVillages.map((item, idx) => (
//                                     <option key={idx} value={getVillageValue(item)}>
//                                         {getVillageLabel(item)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input style={inputStyle} placeholder="Search Lokos Code..." value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select style={selectStyle} value={filters.ageRange || ""} onChange={(e) => handleValueChange("ageRange", e.target.value)}>
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input style={inputStyle} placeholder="Search by Mobile No / Full Name" value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;



// import React, { useState, useEffect } from "react";
// import { LOOKUP_API } from "../../../api/axios";

// const ParticipantTableFilters = ({
//     filters = {},
//     handleChange,
//     genders = [],
//     designations = [],
//     pldStatus = [],
//     socialCategories = [],
//     religions = [],
//     panchayats: propPanchayats = [],
//     villages: propVillages = [],
//     ageRanges = [],
//     blocks: initialBlocks = []
// }) => {
//     const [blocks, setBlocks] = useState([]);
//     const [panchayats, setPanchayats] = useState([]);
//     const [villages, setVillages] = useState([]);

//     // 1. Fetch blocks on mount based on User Role or initial fallback
//     useEffect(() => {
//         const fetchScopedLocationData = async () => {
//             try {
//                 const userRoleId = localStorage.getItem("user_role_id");
//                 const userSessionString = localStorage.getItem("user_id");
//                 let districtId = null;

//                 if (userSessionString) {
//                     const response = await LOOKUP_API.userGeoscopeByUserId(userSessionString);
//                     districtId = response?.data?.districts[0] || response?.data?.district;
//                 }

//                 if (String(userRoleId) === "13" && districtId) {
//                     if (typeof LOOKUP_API?.blocksByDistrict === "function") {
//                         const response = await LOOKUP_API.blocksByDistrict(districtId);
//                         const rawData = response?.data?.results || response?.data || response;
//                         if (Array.isArray(rawData)) {
//                             setBlocks(rawData);
//                             return;
//                         }
//                     }
//                 }

//                 if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
//                     setBlocks(initialBlocks);
//                 } else if (typeof LOOKUP_API?.blocks?.list === "function") {
//                     const response = await LOOKUP_API.blocks.list();
//                     const listData = response?.data?.results || response?.data || response;
//                     setBlocks(Array.isArray(listData) ? listData : []);
//                 } else {
//                     setBlocks([]);
//                 }
//             } catch (error) {
//                 console.error("Failed pulling district scoped location configurations:", error);
//                 setBlocks(Array.isArray(initialBlocks) ? initialBlocks : []);
//             }
//         };

//         fetchScopedLocationData();
//     }, [initialBlocks]);

//     // 2. Cascade Chain: Block select hone par Panchayats load karna
//     useEffect(() => {
//         const fetchPanchayats = async () => {
//             // Agar single block selected nahi hai ya Combined batch hai, list khali rakhein
//             if (!filters.block || Array.isArray(filters.block) || filters.batchType === "Combined") {
//                 setPanchayats([]);
//                 setVillages([]);
//                 return;
//             }

//             try {
//                 const response = await LOOKUP_API.panchayatsByBlock(filters.block);
//                 const data = response?.data?.results || response?.data || [];
//                 setPanchayats(Array.isArray(data) ? data : []);
//                 setVillages([]); // Reset villages since block/panchayat changed
//             } catch (err) {
//                 console.error("Error fetching dependent panchayats:", err);
//                 setPanchayats([]);
//                 setVillages([]);
//             }
//         };

//         fetchPanchayats();
//     }, [filters.block, filters.batchType]);

//     // 3. Cascade Chain: Panchayat select hone par Villages load karna
//     useEffect(() => {
//         const fetchVillages = async () => {
//             if (!filters.panchayat) {
//                 setVillages([]);
//                 return;
//             }

//             try {
//                 const response = await LOOKUP_API.villagesByPanchayat(filters.panchayat);
//                 const data = response?.data?.results || response?.data || [];
//                 setVillages(Array.isArray(data) ? data : []);
//             } catch (err) {
//                 console.error("Error fetching dependent villages:", err);
//                 setVillages([]);
//             }
//         };

//         fetchVillages();
//     }, [filters.panchayat]);

//     const handleValueChange = (key, value) => {
//         if (typeof handleChange === "function") {
//             handleChange(key, value);
//         }
//     };

//     const handleMultipleSelectChange = (key, options) => {
//         const selectedValues = [];
//         for (let i = 0; i < options.length; i++) {
//             if (options[i].selected) {
//                 selectedValues.push(options[i].value);
//             }
//         }
//         handleValueChange(key, selectedValues);
//     };

//     const getMinStartDate = () => {
//         const minDate = new Date();
//         minDate.setDate(minDate.getDate() + 1);
//         return minDate.toISOString().split("T")[0];
//     };

//     const getMaxStartDate = () => {
//         const maxDate = new Date();
//         maxDate.setDate(maxDate.getDate() + 7);
//         return maxDate.toISOString().split("T")[0];
//     };

//     const handleStartDateChange = (dateValue) => {
//         handleValueChange("startDate", dateValue);
//         if (dateValue && filters.trainingPlan) {
//             if (filters.trainingPlanDays) {
//                 const planDays = filters.trainingPlanDays || 1;
//                 calculateAndSetEndDate(dateValue, planDays);
//             }
//         } else if (!dateValue) {
//             handleValueChange("endDate", "");
//         }
//     };

//     const calculateAndSetEndDate = (startDateStr, days) => {
//         const start = new Date(startDateStr);
//         start.setDate(start.getDate() + (Number(days) - 1));
//         const endDateStr = start.toISOString().split("T")[0];
//         handleValueChange("endDate", endDateStr);
//     };

//     const containerStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "20px" };
//     const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" };
//     const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" };
//     const selectStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };
//     const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };

//     const isCombined = filters.batchType === "Combined";

//     // Value aur Label Map karne ke liye Helpers
//     const getBlockValue = (b) => typeof b === "object" ? (b.id ?? b.block_id ?? b.block_code ?? b.value) : b;
//     const getBlockLabel = (b) => typeof b === "object" ? (b.block_name_en || b.block_name || b.name) : b;

//     const getPanchayatValue = (p) => typeof p === "object" ? (p.id ?? p.panchayat_id ?? p.panchayat_code ?? p.value) : p;
//     const getPanchayatLabel = (p) => typeof p === "object" ? (p.panchayat_name || p.panchayat_name_en || p.name) : p;

//     const getVillageValue = (v) => typeof v === "object" ? (v.id ?? v.village_id ?? v.village_code ?? v.value) : v;
//     const getVillageLabel = (v) => typeof v === "object" ? (v.village_name || v.village_name_english || v.name) : v;

//     const verifiedBlocks = Array.isArray(blocks) ? blocks : [];
//     const verifiedPanchayats = Array.isArray(panchayats) ? panchayats : [];
//     const verifiedVillages = Array.isArray(villages) ? villages : [];

//     return (
//         <div style={containerStyle}>
//             <div style={gridStyle}>
//                 <div>
//                     <label style={labelStyle}>Batch Type</label>
//                     <select
//                         style={selectStyle}
//                         value={filters.batchType || "Separate"}
//                         onChange={(e) => {
//                             handleValueChange("block", e.target.value === "Combined" ? [] : "");
//                             handleValueChange("panchayat", "");
//                             handleValueChange("village", "");
//                             handleValueChange("batchType", e.target.value);
//                         }}
//                     >
//                         <option value="Separate">Separate Batch (Single Block)</option>
//                         <option value="Combined">Combined Batch (Multiple Blocks)</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}</label>
//                     {isCombined ? (
//                         <select
//                             multiple
//                             style={{ ...selectStyle, height: "80px", padding: "4px" }}
//                             value={Array.isArray(filters.block) ? filters.block : []}
//                             onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
//                         >
//                             {verifiedBlocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>
//                                     {getBlockLabel(b)}
//                                 </option>
//                             ))}
//                         </select>
//                     ) : (
//                         <select
//                             style={selectStyle}
//                             value={typeof filters.block === "string" ? filters.block : ""}
//                             onChange={(e) => {
//                                 handleValueChange("block", e.target.value);
//                                 handleValueChange("panchayat", "");
//                                 handleValueChange("village", "");
//                             }}
//                         >
//                             <option value="">All Blocks</option>
//                             {verifiedBlocks.map((b, idx) => (
//                                 <option key={idx} value={getBlockValue(b)}>
//                                     {getBlockLabel(b)}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Start Date</label>
//                     <input type="date" style={inputStyle} min={getMinStartDate()} max={getMaxStartDate()} value={filters.startDate || ""} onChange={(e) => handleStartDateChange(e.target.value)} />
//                 </div>

//                 <div>
//                     <label style={labelStyle}>Calculated End Date</label>
//                     <input type="date" style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }} value={filters.endDate || ""} disabled placeholder="Auto calculated" />
//                 </div>

//                 {filters.participantType === "Beneficiary" && (
//                     <>
//                         <div>
//                             <label style={labelStyle}>Gender</label>
//                             <select style={selectStyle} value={filters.gender || ""} onChange={(e) => handleValueChange("gender", e.target.value)}>
//                                 <option value="">All</option>
//                                 {genders.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Designation</label>
//                             <select style={selectStyle} value={filters.designation || ""} onChange={(e) => handleValueChange("designation", e.target.value)}>
//                                 <option value="">All</option>
//                                 {designations.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>PLD Status</label>
//                             <select style={selectStyle} value={filters.pldStatus || ""} onChange={(e) => handleValueChange("pldStatus", e.target.value)}>
//                                 <option value="">All</option>
//                                 {pldStatus.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Social Category</label>
//                             <select style={selectStyle} value={filters.socialCategory || ""} onChange={(e) => handleValueChange("socialCategory", e.target.value)}>
//                                 <option value="">All</option>
//                                 {socialCategories.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Religion</label>
//                             <select style={selectStyle} value={filters.religion || ""} onChange={(e) => handleValueChange("religion", e.target.value)}>
//                                 <option value="">All</option>
//                                 {religions.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Panchayat</label>
//                             <select
//                                 style={{
//                                     ...selectStyle,
//                                     background: isCombined ? "#f3f4f6" : "#fff",
//                                     cursor: isCombined ? "not-allowed" : "default"
//                                 }}
//                                 value={filters.panchayat || ""}
//                                 disabled={isCombined}
//                                 onChange={(e) => {
//                                     handleValueChange("panchayat", e.target.value);
//                                     handleValueChange("village", "");
//                                 }}>
//                                 <option value="">{isCombined ? "Not Available for Combined Batch" : "All"}</option>
//                                 {verifiedPanchayats.map((item, idx) => (
//                                     <option key={idx} value={getPanchayatValue(item)}>
//                                         {getPanchayatLabel(item)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Village</label>
//                             <select style={selectStyle} value={filters.village || ""} onChange={(e) => handleValueChange("village", e.target.value)}>
//                                 <option value="">All</option>
//                                 {verifiedVillages.map((item, idx) => (
//                                     <option key={idx} value={getVillageValue(item)}>
//                                         {getVillageLabel(item)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Search SHG / Member Code</label>
//                             <input style={inputStyle} placeholder="Search Lokos Code..." value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
//                         </div>
//                         <div>
//                             <label style={labelStyle}>Age Range</label>
//                             <select style={selectStyle} value={filters.ageRange || ""} onChange={(e) => handleValueChange("ageRange", e.target.value)}>
//                                 <option value="">All</option>
//                                 {ageRanges.map((item) => <option key={item} value={item}>{item}</option>)}
//                             </select>
//                         </div>
//                     </>
//                 )}

//                 {filters.participantType === "Trainer" && (
//                     <div>
//                         <label style={labelStyle}>Search Trainer</label>
//                         <input style={inputStyle} placeholder="Search by Mobile No / Full Name" value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ParticipantTableFilters;



import React, { useState, useEffect, useRef } from "react";
import { LOOKUP_API } from "../../../api/axios";

const ParticipantTableFilters = ({
    filters = {},
    handleChange,
    genders = [],
    designations = [],
    pldStatus = [],
    socialCategories = [],
    religions = [],
    panchayats: propPanchayats = [],
    villages: propVillages = [],
    ageRanges = [],
    blocks: initialBlocks = []
}) => {
    const [blocks, setBlocks] = useState([]);
    const [panchayats, setPanchayats] = useState([]);
    const [villages, setVillages] = useState([]);

    // Custom Dropdown states for Panchayat
    const [isPanchayatOpen, setIsPanchayatOpen] = useState(false);
    const [panchayatPageSize, setPanchayatPageSize] = useState(5000);
    const panchayatRef = useRef(null);

    // Close custom dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panchayatRef.current && !panchayatRef.current.contains(event.target)) {
                setIsPanchayatOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 1. Fetch blocks on mount based on User Role or initial fallback
    useEffect(() => {
        const fetchScopedLocationData = async () => {
            try {
                const userRoleId = localStorage.getItem("user_role_id");
                const userSessionString = localStorage.getItem("user_id");
                let districtId = null;

                if (userSessionString) {
                    const response = await LOOKUP_API.userGeoscopeByUserId(userSessionString);
                    districtId = response?.data?.districts[0] || response?.data?.district;
                }

                if (String(userRoleId) === "13" && districtId) {
                    if (typeof LOOKUP_API?.blocksByDistrict === "function") {
                        const response = await LOOKUP_API.blocksByDistrict(districtId);
                        const rawData = response?.data?.results || response?.data || response;
                        if (Array.isArray(rawData)) {
                            setBlocks(rawData);
                            return;
                        }
                    }
                }

                if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
                    setBlocks(initialBlocks);
                } else if (typeof LOOKUP_API?.blocks?.list === "function") {
                    const response = await LOOKUP_API.blocks.list();
                    const listData = response?.data?.results || response?.data || response;
                    setBlocks(Array.isArray(listData) ? listData : []);
                } else {
                    setBlocks([]);
                }
            } catch (error) {
                console.error("Failed pulling district scoped location configurations:", error);
                setBlocks(Array.isArray(initialBlocks) ? initialBlocks : []);
            }
        };

        fetchScopedLocationData();
    }, [initialBlocks]);

    // 2. Cascade Chain: Block select hone par Panchayats load karna
    useEffect(() => {
        const fetchPanchayats = async () => {
            if (!filters.block || Array.isArray(filters.block) || filters.batchType === "Combined") {
                setPanchayats([]);
                setVillages([]);
                return;
            }

            try {
                const response = await LOOKUP_API.panchayatsByBlock(filters.block);
                const data = response?.data?.results || response?.data || [];
                setPanchayats(Array.isArray(data) ? data : []);
                setPanchayatPageSize(5000);
                setVillages([]);
            } catch (err) {
                console.error("Error fetching dependent panchayats:", err);
                setPanchayats([]);
                setVillages([]);
            }
        };

        fetchPanchayats();
    }, [filters.block, filters.batchType]);

    // 3. Cascade Chain: Panchayat select hone par Villages load karna
    useEffect(() => {
        const fetchVillages = async () => {
            if (!filters.panchayat) {
                setVillages([]);
                return;
            }

            try {
                const response = await LOOKUP_API.villagesByPanchayat(filters.panchayat);
                const data = response?.data?.results || response?.data || [];
                setVillages(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching dependent villages:", err);
                setVillages([]);
            }
        };

        fetchVillages();
    }, [filters.panchayat]);

    const handleValueChange = (key, value) => {
        if (typeof handleChange === "function") {
            handleChange(key, value);
        }
    };

    const handleMultipleSelectChange = (key, options) => {
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        handleValueChange(key, selectedValues);
    };

    const getMinStartDate = () => {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        return minDate.toISOString().split("T")[0];
    };

    const getMaxStartDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        return maxDate.toISOString().split("T")[0];
    };

    const handleStartDateChange = (dateValue) => {
        handleValueChange("startDate", dateValue);
        if (dateValue && filters.trainingPlan) {
            if (filters.trainingPlanDays) {
                const planDays = filters.trainingPlanDays || 1;
                calculateAndSetEndDate(dateValue, planDays);
            }
        } else if (!dateValue) {
            handleValueChange("endDate", "");
        }
    };

    const calculateAndSetEndDate = (startDateStr, days) => {
        const start = new Date(startDateStr);
        start.setDate(start.getDate() + (Number(days) - 1));
        const endDateStr = start.toISOString().split("T")[0];
        handleValueChange("endDate", endDateStr);
    };

    const containerStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "20px" };
    const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" };
    const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" };
    const selectStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };
    const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontSize: "14px", background: "#fff" };

    const isCombined = filters.batchType === "Combined";

    const getBlockValue = (b) => typeof b === "object" ? (b.id ?? b.block_id ?? b.block_code ?? b.value) : b;
    const getBlockLabel = (b) => typeof b === "object" ? (b.block_name_en || b.block_name || b.name) : b;

    const getPanchayatValue = (p) => typeof p === "object" ? (p.id ?? p.panchayat_id ?? p.panchayat_code ?? p.value) : p;
    const getPanchayatLabel = (p) => typeof p === "object" ? (p.panchayat_name || p.panchayat_name_en || p.name) : p;

    const getVillageValue = (v) => typeof v === "object" ? (v.id ?? v.village_id ?? v.village_code ?? v.value) : v;
    const getVillageLabel = (v) => typeof v === "object" ? (v.village_name || v.village_name_english || v.name) : v;

    const verifiedBlocks = Array.isArray(blocks) ? blocks : [];
    const verifiedPanchayats = Array.isArray(panchayats) ? panchayats : [];
    const verifiedVillages = Array.isArray(villages) ? villages : [];

    // Slice for large page display handling
    const paginatedPanchayats = verifiedPanchayats.slice(0, panchayatPageSize);

    // Finding active label to display inside fake select input box
    const currentSelectedPanchayatObj = verifiedPanchayats.find(p => String(getPanchayatValue(p)) === String(filters.panchayat));
    const selectedPanchayatLabel = currentSelectedPanchayatObj ? getPanchayatLabel(currentSelectedPanchayatObj) : "All";

    return (
        <div style={containerStyle}>
            <div style={gridStyle}>
                <div>
                    <label style={labelStyle}>Batch Type</label>
                    <select
                        style={selectStyle}
                        value={filters.batchType || "Separate"}
                        onChange={(e) => {
                            handleValueChange("block", e.target.value === "Combined" ? [] : "");
                            handleValueChange("panchayat", "");
                            handleValueChange("village", "");
                            handleValueChange("batchType", e.target.value);
                        }}
                    >
                        <option value="Separate">Separate Batch (Single Block)</option>
                        <option value="Combined">Combined Batch (Multiple Blocks)</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}</label>
                    {isCombined ? (
                        <select
                            multiple
                            style={{ ...selectStyle, height: "80px", padding: "4px" }}
                            value={Array.isArray(filters.block) ? filters.block : []}
                            onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
                        >
                            {verifiedBlocks.map((b, idx) => (
                                <option key={idx} value={getBlockValue(b)}>
                                    {getBlockLabel(b)}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <select
                            style={selectStyle}
                            value={typeof filters.block === "string" ? filters.block : ""}
                            onChange={(e) => {
                                handleValueChange("block", e.target.value);
                                handleValueChange("panchayat", "");
                                handleValueChange("village", "");
                            }}
                        >
                            <option value="">All Blocks</option>
                            {verifiedBlocks.map((b, idx) => (
                                <option key={idx} value={getBlockValue(b)}>
                                    {getBlockLabel(b)}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" style={inputStyle} min={getMinStartDate()} max={getMaxStartDate()} value={filters.startDate || ""} onChange={(e) => handleStartDateChange(e.target.value)} />
                </div>

                <div>
                    <label style={labelStyle}>Calculated End Date</label>
                    <input type="date" style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }} value={filters.endDate || ""} disabled placeholder="Auto calculated" />
                </div>

                {filters.participantType === "Beneficiary" && (
                    <>
                        <div>
                            <label style={labelStyle}>Gender</label>
                            <select style={selectStyle} value={filters.gender || ""} onChange={(e) => handleValueChange("gender", e.target.value)}>
                                <option value="">All</option>
                                {genders.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Designation</label>
                            <select style={selectStyle} value={filters.designation || ""} onChange={(e) => handleValueChange("designation", e.target.value)}>
                                <option value="">All</option>
                                {designations.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>PLD Status</label>
                            <select style={selectStyle} value={filters.pldStatus || ""} onChange={(e) => handleValueChange("pldStatus", e.target.value)}>
                                <option value="">All</option>
                                {pldStatus.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Social Category</label>
                            <select style={selectStyle} value={filters.socialCategory || ""} onChange={(e) => handleValueChange("socialCategory", e.target.value)}>
                                <option value="">All</option>
                                {socialCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Religion</label>
                            <select style={selectStyle} value={filters.religion || ""} onChange={(e) => handleValueChange("religion", e.target.value)}>
                                <option value="">All</option>
                                {religions.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>

                        {/* REFACTORED CUSTOM SCROLLABLE & CLOSABLE PANCHAYAT DROPDOWN */}
                        <div ref={panchayatRef} style={{ position: "relative" }}>
                            <label style={labelStyle}>Panchayat ({verifiedPanchayats.length})</label>
                            <div
                                style={{
                                    ...selectStyle,
                                    background: isCombined ? "#f3f4f6" : "#fff",
                                    cursor: isCombined ? "not-allowed" : "pointer",
                                    display: "flex",
                                    justifyContent: "between",
                                    alignItems: "center"
                                }}
                                onClick={() => !isCombined && setIsPanchayatOpen(!isPanchayatOpen)}
                            >
                                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {isCombined ? "Not Available for Combined Batch" : selectedPanchayatLabel}
                                </span>
                                <span style={{ fontSize: "10px", color: "#6b7280", marginLeft: "4px" }}>▼</span>
                            </div>

                            {isPanchayatOpen && !isCombined && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    zIndex: 50,
                                    background: "#fff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    marginTop: "4px"
                                }}>
                                    <div
                                        style={{ padding: "8px 12px", cursor: "pointer", fontSize: "14px", background: !filters.panchayat ? "#f3f4f6" : "transparent" }}
                                        onClick={() => {
                                            handleValueChange("panchayat", "");
                                            handleValueChange("village", "");
                                            setIsPanchayatOpen(false);
                                        }}
                                    >
                                        All
                                    </div>
                                    {paginatedPanchayats.map((item, idx) => {
                                        const val = getPanchayatValue(item);
                                        const label = getPanchayatLabel(item);
                                        const isSelected = String(filters.panchayat) === String(val);
                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: "8px 12px",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    background: isSelected ? "#2563eb" : "transparent",
                                                    color: isSelected ? "#fff" : "#000"
                                                }}
                                                onClick={() => {
                                                    handleValueChange("panchayat", val);
                                                    handleValueChange("village", "");
                                                    setIsPanchayatOpen(false); // Closes right after click
                                                }}
                                            >
                                                {label}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={labelStyle}>Village</label>
                            <select style={selectStyle} value={filters.village || ""} onChange={(e) => handleValueChange("village", e.target.value)}>
                                <option value="">All</option>
                                {verifiedVillages.map((item, idx) => (
                                    <option key={idx} value={getVillageValue(item)}>
                                        {getVillageLabel(item)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Search SHG / Member Code</label>
                            <input style={inputStyle} placeholder="Search Lokos Code..." value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}>Age Range</label>
                            <select style={selectStyle} value={filters.ageRange || ""} onChange={(e) => handleValueChange("ageRange", e.target.value)}>
                                <option value="">All</option>
                                {ageRanges.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                    </>
                )}

                {filters.participantType === "Trainer" && (
                    <div>
                        <label style={labelStyle}>Search Trainer</label>
                        <input style={inputStyle} placeholder="Search by Mobile No / Full Name" value={filters.searchValue || ""} onChange={(e) => handleValueChange("searchValue", e.target.value)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantTableFilters;