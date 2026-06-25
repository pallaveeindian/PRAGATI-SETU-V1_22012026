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


import React from "react";

const ParticipantTableFilters = ({
    filters = {},
    handleChange,
    genders = [],
    designations = [],
    pldStatus = [],
    socialCategories = [],
    religions = [],
    panchayats = [],
    villages = [],
    ageRanges = [],
    blocks = ["Block Alpha", "Block Beta", "Block Gamma", "Block Delta"],
    trainingPlans = [
        { id: "plan1", name: "Basic Orientation (3 Days)", days: 3 },
        { id: "plan2", name: "Technical Training (5 Days)", days: 5 },
        { id: "plan3", name: "Advanced Workshop (7 Days)", days: 7 },
    ]
}) => {

    const handleValueChange = (key, value) => {
        if (typeof handleChange === "function") {
            handleChange(key, value);
        } else {
            console.error(
                `CRITICAL: 'handleChange' handler was not passed down as a function prop. Received:`,
                typeof handleChange
            );
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

    // Helper to calculate the minimum valid start date (Today + 7 Days)
    const getMinStartDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        return today.toISOString().split("T")[0]; // Formats to YYYY-MM-DD
    };

    // Helper to lock the upper bound selection to selected date + 1 week
    const getMaxStartDate = () => {
        if (!filters.startDate) return undefined;
        const currentStart = new Date(filters.startDate);
        currentStart.setDate(currentStart.getDate() + 7);
        return currentStart.toISOString().split("T")[0];
    };

    // Automatically calculate End Date based on Start Date and selected training plan length
    const handleStartDateChange = (dateValue) => {
        handleValueChange("startDate", dateValue);

        if (dateValue && filters.trainingPlanId) {
            const selectedPlan = trainingPlans.find(p => p.id === filters.trainingPlanId);
            if (selectedPlan) {
                calculateAndSetEndDate(dateValue, selectedPlan.days);
            }
        }
    };

    const calculateAndSetEndDate = (startDateStr, days) => {
        const start = new Date(startDateStr);
        // Ex: If a plan takes 3 days and starts on 1st, it completes on 1st + (3 - 1) = 3rd.
        start.setDate(start.getDate() + (days - 1));
        const endDateStr = start.toISOString().split("T")[0];
        handleValueChange("endDate", endDateStr);
    };

    const containerStyle = {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "16px",
    };

    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        marginBottom: "6px",
        color: "#374151",
    };

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
        background: "#fff",
    };

    const isCombined = filters.batchType === "Combined";

    return (
        <div style={containerStyle}>
            <div style={gridStyle}>

                {/* BATCH TYPE SELECTOR */}
                <div>
                    <label style={labelStyle}>Batch Type</label>
                    <select
                        style={selectStyle}
                        value={filters.batchType || "Separate"}
                        onChange={(e) => {
                            handleValueChange("block", e.target.value === "Combined" ? [] : "");
                            handleValueChange("batchType", e.target.value);
                        }}
                    >
                        <option value="Separate">Separate Batch (Single Block)</option>
                        <option value="Combined">Combined Batch (Multiple Blocks)</option>
                    </select>
                </div>

                {/* BLOCK SELECTOR BASED ON BATCH TYPE */}
                <div>
                    <label style={labelStyle}>
                        Select Block {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
                    </label>
                    {isCombined ? (
                        <select
                            multiple
                            style={{ ...selectStyle, height: "80px", padding: "4px" }}
                            value={Array.isArray(filters.block) ? filters.block : []}
                            onChange={(e) => handleMultipleSelectChange("block", e.target.options)}
                        >
                            {blocks.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    ) : (
                        <select
                            style={selectStyle}
                            value={typeof filters.block === "string" ? filters.block : ""}
                            onChange={(e) => handleValueChange("block", e.target.value)}
                        >
                            <option value="">All Blocks</option>
                            {blocks.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* START DATE SELECTOR */}
                <div>
                    <label style={labelStyle}>Start Date</label>
                    <input
                        type="date"
                        style={inputStyle}
                        min={getMinStartDate()}
                        max={getMaxStartDate()}
                        value={filters.startDate || ""}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                </div>

                {/* END DATE DISPLAY (AUTO CALCULATION) */}
                <div>
                    <label style={labelStyle}>Calculated End Date</label>
                    <input
                        type="date"
                        style={{ ...inputStyle, background: "#f3f4f6", cursor: "not-allowed" }}
                        value={filters.endDate || ""}
                        disabled
                        placeholder="Auto calculated"
                    />
                </div>

                {/* BENEFICIARY FILTERS */}
                {filters.participantType === "Beneficiary" && (
                    <>
                        <div>
                            <label style={labelStyle}>Gender</label>
                            <select
                                style={selectStyle}
                                value={filters.gender || ""}
                                onChange={(e) => handleValueChange("gender", e.target.value)}
                            >
                                <option value="">All</option>
                                {genders.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Designation</label>
                            <select
                                style={selectStyle}
                                value={filters.designation || ""}
                                onChange={(e) => handleValueChange("designation", e.target.value)}
                            >
                                <option value="">All</option>
                                {designations.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>PLD Status</label>
                            <select
                                style={selectStyle}
                                value={filters.pldStatus || ""}
                                onChange={(e) => handleValueChange("pldStatus", e.target.value)}
                            >
                                <option value="">All</option>
                                {pldStatus.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Social Category</label>
                            <select
                                style={selectStyle}
                                value={filters.socialCategory || ""}
                                onChange={(e) => handleValueChange("socialCategory", e.target.value)}
                            >
                                <option value="">All</option>
                                {socialCategories.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Religion</label>
                            <select
                                style={selectStyle}
                                value={filters.religion || ""}
                                onChange={(e) => handleValueChange("religion", e.target.value)}
                            >
                                <option value="">All</option>
                                {religions.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Panchayat</label>
                            <select
                                style={selectStyle}
                                value={filters.panchayat || ""}
                                onChange={(e) => handleValueChange("panchayat", e.target.value)}
                            >
                                <option value="">All</option>
                                {panchayats.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Village</label>
                            <select
                                style={selectStyle}
                                value={filters.village || ""}
                                onChange={(e) => handleValueChange("village", e.target.value)}
                            >
                                <option value="">All</option>
                                {villages.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Search SHG / Member Code</label>
                            <input
                                style={inputStyle}
                                placeholder="Search Lokos Code..."
                                value={filters.searchValue || ""}
                                onChange={(e) => handleValueChange("searchValue", e.target.value)}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Age Range</label>
                            <select
                                style={selectStyle}
                                value={filters.ageRange || ""}
                                onChange={(e) => handleValueChange("ageRange", e.target.value)}
                            >
                                <option value="">All</option>
                                {ageRanges.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* TRAINER FILTERS */}
                {filters.participantType === "Trainer" && (
                    <div>
                        <label style={labelStyle}>Search Trainer</label>
                        <input
                            style={inputStyle}
                            placeholder="Search by Mobile No / Full Name"
                            value={filters.searchValue || ""}
                            onChange={(e) => handleValueChange("searchValue", e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantTableFilters;