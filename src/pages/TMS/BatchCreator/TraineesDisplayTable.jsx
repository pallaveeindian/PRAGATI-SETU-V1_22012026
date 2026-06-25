// import React, { useMemo } from "react";

// const ParticipantTable = ({ filters }) => {
//     const dummyData = [
//         {
//             id: 1,
//             participantType: "Beneficiary",
//             name: "Ramesh Kumar",
//             gender: "Male",
//             designation: "Farmer",
//             religion: "Hindu",
//             socialCategory: "OBC",
//             pldStatus: "Completed",
//             panchayat: "Panchayat A",
//             village: "Village A",
//             ageGroup: "18-35",
//         },
//         {
//             id: 2,
//             participantType: "Beneficiary",
//             name: "Sita Devi",
//             gender: "Female",
//             designation: "SHG Member",
//             religion: "Hindu",
//             socialCategory: "SC",
//             pldStatus: "Pending",
//             panchayat: "Panchayat B",
//             village: "Village B",
//             ageGroup: "36-50",
//         },
//         {
//             id: 3,
//             participantType: "Trainer",
//             name: "Ajay Singh",
//             designation: "Master Trainer",
//         },
//         {
//             id: 4,
//             participantType: "Trainer",
//             name: "Neha Sharma",
//             designation: "Field Trainer",
//         },
//         {
//             id: 5,
//             participantType: "Beneficiary",
//             name: "Mohd Arif",
//             gender: "Male",
//             designation: "Entrepreneur",
//             religion: "Muslim",
//             socialCategory: "General",
//             pldStatus: "Completed",
//             panchayat: "Panchayat A",
//             village: "Village C",
//             ageGroup: "18-35",
//         },
//     ];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (
//                 filters.participantType &&
//                 item.participantType !== filters.participantType
//             )
//                 return false;

//             if (
//                 filters.gender &&
//                 item.gender !== filters.gender
//             )
//                 return false;

//             if (
//                 filters.designation &&
//                 item.designation !== filters.designation
//             )
//                 return false;

//             if (
//                 filters.religion &&
//                 item.religion !== filters.religion
//             )
//                 return false;

//             if (
//                 filters.socialCategory &&
//                 item.socialCategory !== filters.socialCategory
//             )
//                 return false;

//             if (
//                 filters.pldStatus &&
//                 item.pldStatus !== filters.pldStatus
//             )
//                 return false;

//             if (
//                 filters.panchayat &&
//                 item.panchayat !== filters.panchayat
//             )
//                 return false;

//             if (
//                 filters.village &&
//                 item.village !== filters.village
//             )
//                 return false;

//             if (
//                 filters.ageGroup &&
//                 item.ageGroup !== filters.ageGroup
//             )
//                 return false;

//             if (filters.searchValue) {
//                 const searchText =
//                     filters.searchValue.toLowerCase();

//                 if (
//                     !item.name
//                         ?.toLowerCase()
//                         .includes(searchText)
//                 ) {
//                     return false;
//                 }
//             }

//             return true;
//         });
//     }, [filters]);

//     return (
//         <div
//             style={{
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 background: "#fff",
//             }}
//         >
//             <div
//                 style={{
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                 }}
//             >
//                 <table
//                     style={{
//                         width: "100%",
//                         borderCollapse: "collapse",
//                     }}
//                 >
//                     <thead
//                         style={{
//                             position: "sticky",
//                             top: 0,
//                             zIndex: 10,
//                         }}
//                     >
//                         <tr
//                             style={{
//                                 background: "#f3f4f6",
//                             }}
//                         >
//                             <th style={thStyle}>ID</th>
//                             <th style={thStyle}>Name</th>
//                             <th style={thStyle}>Type</th>
//                             <th style={thStyle}>Gender</th>
//                             <th style={thStyle}>Designation</th>
//                             <th style={thStyle}>Religion</th>
//                             <th style={thStyle}>Category</th>
//                             <th style={thStyle}>PLD Status</th>
//                             <th style={thStyle}>Panchayat</th>
//                             <th style={thStyle}>Village</th>
//                             <th style={thStyle}>Age Group</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredData.length > 0 ? (
//                             filteredData.map((row) => (
//                                 <tr key={row.id}>
//                                     <td style={tdStyle}>
//                                         {row.id}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.name}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.participantType}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.gender || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.designation || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.religion || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.socialCategory ||
//                                             "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.pldStatus || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.panchayat || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.village || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.ageGroup || "-"}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan={11}
//                                     style={{
//                                         padding: "20px",
//                                         textAlign: "center",
//                                     }}
//                                 >
//                                     No Records Found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const thStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #ddd",
//     textAlign: "left",
//     fontSize: "13px",
//     fontWeight: 600,
// };

// const tdStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #f1f1f1",
//     fontSize: "13px",
// };

// export default ParticipantTable;



// import React, { useMemo } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";


// const ParticipantTable = ({ filters = {} }) => {
//     const dummyData = [
//         {
//             id: 1,
//             participantType: "Beneficiary",
//             name: "Ramesh Kumar",
//             gender: "Male",
//             designation: "Farmer",
//             religion: "Hindu",
//             socialCategory: "OBC",
//             pldStatus: "Completed",
//             panchayat: "Panchayat A",
//             village: "Village A",
//             ageGroup: "18-35",
//         },
//         {
//             id: 2,
//             participantType: "Beneficiary",
//             name: "Sita Devi",
//             gender: "Female",
//             designation: "SHG Member",
//             religion: "Hindu",
//             socialCategory: "SC",
//             pldStatus: "Pending",
//             panchayat: "Panchayat B",
//             village: "Village B",
//             ageGroup: "36-50",
//         },
//         {
//             id: 3,
//             participantType: "Trainer",
//             name: "Ajay Singh",
//             designation: "Master Trainer",
//         },
//         {
//             id: 4,
//             participantType: "Trainer",
//             name: "Neha Sharma",
//             designation: "Field Trainer",
//         },
//         {
//             id: 5,
//             participantType: "Beneficiary",
//             name: "Mohd Arif",
//             gender: "Male",
//             designation: "Entrepreneur",
//             religion: "Muslim",
//             socialCategory: "General",
//             pldStatus: "Completed",
//             panchayat: "Panchayat A",
//             village: "Village C",
//             ageGroup: "18-35",
//         },
//     ];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (
//                 filters.participantType &&
//                 item.participantType !== filters.participantType
//             ) {
//                 return false;
//             }

//             if (filters.gender && item.gender !== filters.gender) {
//                 return false;
//             }

//             if (
//                 filters.designation &&
//                 item.designation !== filters.designation
//             ) {
//                 return false;
//             }

//             if (
//                 filters.religion &&
//                 item.religion !== filters.religion
//             ) {
//                 return false;
//             }

//             if (
//                 filters.socialCategory &&
//                 item.socialCategory !== filters.socialCategory
//             ) {
//                 return false;
//             }

//             if (
//                 filters.pldStatus &&
//                 item.pldStatus !== filters.pldStatus
//             ) {
//                 return false;
//             }

//             if (
//                 filters.panchayat &&
//                 item.panchayat !== filters.panchayat
//             ) {
//                 return false;
//             }

//             if (
//                 filters.village &&
//                 item.village !== filters.village
//             ) {
//                 return false;
//             }

//             if (
//                 filters.ageGroup &&
//                 item.ageGroup !== filters.ageGroup
//             ) {
//                 return false;
//             }

//             if (filters.searchValue) {
//                 const searchText =
//                     filters.searchValue.toLowerCase();

//                 if (
//                     !item.name
//                         ?.toLowerCase()
//                         .includes(searchText)
//                 ) {
//                     return false;
//                 }
//             }

//             return true;
//         });
//     }, [filters]);

//     return (
//         <div
//             style={{
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 background: "#fff",
//             }}
//         >
//             <div
//                 style={{
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                 }}
//             >
//                 <ParticipantTableFilters
//                     filters={filters}
//                     handleChange={handleChange}
//                 />
//                 <table
//                     style={{
//                         width: "100%",
//                         borderCollapse: "collapse",
//                     }}
//                 >
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={thStyle}>ID</th>
//                             <th style={thStyle}>Name</th>
//                             <th style={thStyle}>Type</th>
//                             <th style={thStyle}>Gender</th>
//                             <th style={thStyle}>Designation</th>
//                             <th style={thStyle}>Religion</th>
//                             <th style={thStyle}>Category</th>
//                             <th style={thStyle}>PLD Status</th>
//                             <th style={thStyle}>Panchayat</th>
//                             <th style={thStyle}>Village</th>
//                             <th style={thStyle}>Age Group</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredData.length > 0 ? (
//                             filteredData.map((row) => (
//                                 <tr key={row.id}>
//                                     <td style={tdStyle}>{row.id}</td>
//                                     <td style={tdStyle}>{row.name}</td>
//                                     <td style={tdStyle}>
//                                         {row.participantType}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.gender || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.designation || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.religion || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.socialCategory || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.pldStatus || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.panchayat || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.village || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.ageGroup || "-"}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan={11}
//                                     style={{
//                                         textAlign: "center",
//                                         padding: "20px",
//                                     }}
//                                 >
//                                     No Records Found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const thStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #ddd",
//     textAlign: "left",
//     fontSize: "13px",
//     fontWeight: 600,
// };

// const tdStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #f1f1f1",
//     fontSize: "13px",
// };

// export default ParticipantTable;



// import React, { useMemo } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },

// }) => {
//     const dummyData = [
//         {
//             id: 1,
//             participantType: "Beneficiary",
//             name: "Ramesh Kumar",
//             gender: "Male",
//             designation: "Farmer",
//             religion: "Hindu",
//             socialCategory: "OBC",
//             pldStatus: "Completed",
//             panchayat: "Panchayat A",
//             village: "Village A",
//             ageGroup: "18-35",
//         },
//         {
//             id: 2,
//             participantType: "Beneficiary",
//             name: "Sita Devi",
//             gender: "Female",
//             designation: "SHG Member",
//             religion: "Hindu",
//             socialCategory: "SC",
//             pldStatus: "Pending",
//             panchayat: "Panchayat B",
//             village: "Village B",
//             ageGroup: "36-50",
//         },
//         {
//             id: 3,
//             participantType: "Trainer",
//             name: "Ajay Singh",
//             designation: "Master Trainer",
//         },
//         {
//             id: 4,
//             participantType: "Trainer",
//             name: "Neha Sharma",
//             designation: "Field Trainer",
//         },
//         {
//             id: 5,
//             participantType: "Beneficiary",
//             name: "Mohd Arif",
//             gender: "Male",
//             designation: "Entrepreneur",
//             religion: "Muslim",
//             socialCategory: "General",
//             pldStatus: "Completed",
//             panchayat: "Panchayat A",
//             village: "Village C",
//             ageGroup: "18-35",
//         },
//     ];

//     // ✅ OPTIONAL IMPROVEMENT: Extract unique values dynamically from dummyData for filters
//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatus = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"]; // Static example or dynamic

//     const filteredData = useMemo(() => {
//         console.log("ParticipantTable handleChange =", handleChange);
//         return dummyData.filter((item) => {
//             if (
//                 filters.participantType &&
//                 item.participantType !== filters.participantType
//             ) {
//                 return false;
//             }

//             if (filters.gender && item.gender !== filters.gender) {
//                 return false;
//             }

//             if (
//                 filters.designation &&
//                 item.designation !== filters.designation
//             ) {
//                 return false;
//             }

//             if (
//                 filters.religion &&
//                 item.religion !== filters.religion
//             ) {
//                 return false;
//             }

//             if (
//                 filters.socialCategory &&
//                 item.socialCategory !== filters.socialCategory
//             ) {
//                 return false;
//             }

//             if (
//                 filters.pldStatus &&
//                 item.pldStatus !== filters.pldStatus
//             ) {
//                 return false;
//             }

//             if (
//                 filters.panchayat &&
//                 item.panchayat !== filters.panchayat
//             ) {
//                 return false;
//             }

//             if (
//                 filters.village &&
//                 item.village !== filters.village
//             ) {
//                 return false;
//             }

//             if (
//                 filters.ageGroup &&
//                 item.ageGroup !== filters.ageGroup
//             ) {
//                 return false;
//             }

//             if (filters.searchValue) {
//                 const searchText =
//                     filters.searchValue.toLowerCase();

//                 if (
//                     !item.name
//                         ?.toLowerCase()
//                         .includes(searchText)
//                 ) {
//                     return false;
//                 }
//             }

//             return true;
//         });
//     }, [filters]);

//     return (
//         <div
//             style={{
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 background: "#fff",
//             }}
//         >
//             <div
//                 style={{
//                     maxHeight: "450px",
//                     overflowY: "auto",
//                 }}
//             >
//                 {/* ✅ FIXED: Passing down all required list arrays along with filters and state updater */}
//                 <ParticipantTableFilters
//                     filters={filters}
//                     handleChange={handleChange}
//                     genders={genders}
//                     designations={designations}
//                     pldStatus={pldStatus}
//                     socialCategories={socialCategories}
//                     religions={religions}
//                     panchayats={panchayats}
//                     villages={villages}
//                     ageRanges={ageRanges}
//                 />
//                 <table
//                     style={{
//                         width: "100%",
//                         borderCollapse: "collapse",
//                     }}
//                 >
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={thStyle}>ID</th>
//                             <th style={thStyle}>Name</th>
//                             <th style={thStyle}>Type</th>
//                             <th style={thStyle}>Gender</th>
//                             <th style={thStyle}>Designation</th>
//                             <th style={thStyle}>Religion</th>
//                             <th style={thStyle}>Category</th>
//                             <th style={thStyle}>PLD Status</th>
//                             <th style={thStyle}>Panchayat</th>
//                             <th style={thStyle}>Village</th>
//                             <th style={thStyle}>Age Group</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredData.length > 0 ? (
//                             filteredData.map((row) => (
//                                 <tr key={row.id}>
//                                     <td style={tdStyle}>{row.id}</td>
//                                     <td style={tdStyle}>{row.name}</td>
//                                     <td style={tdStyle}>
//                                         {row.participantType}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.gender || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.designation || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.religion || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.socialCategory || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.pldStatus || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.panchayat || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.village || "-"}
//                                     </td>
//                                     <td style={tdStyle}>
//                                         {row.ageGroup || "-"}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan={11}
//                                     style={{
//                                         textAlign: "center",
//                                         padding: "20px",
//                                     }}
//                                 >
//                                     No Records Found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const thStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #ddd",
//     textAlign: "left",
//     fontSize: "13px",
//     fontWeight: 600,
// };

// const tdStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #f1f1f1",
//     fontSize: "13px",
// };

// export default ParticipantTable;



// import React, { useMemo } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
// }) => {
//     const dummyData = [
//         {
//             id: 1,
//             participantType: "Beneficiary",
//             name: "Ramesh Kumar",
//             gender: "Male",
//             designation: "Farmer",
//             religion: "Hindu",
//             socialCategory: "OBC",
//             pldStatus: "Completed",
//             block: "Block Alpha",
//             panchayat: "Panchayat A",
//             village: "Village A",
//             ageGroup: "18-35",
//         },
//         {
//             id: 2,
//             participantType: "Beneficiary",
//             name: "Sita Devi",
//             gender: "Female",
//             designation: "SHG Member",
//             religion: "Hindu",
//             socialCategory: "SC",
//             pldStatus: "Pending",
//             block: "Block Beta",
//             panchayat: "Panchayat B",
//             village: "Village B",
//             ageGroup: "36-50",
//         },
//         {
//             id: 3,
//             participantType: "Trainer",
//             name: "Ajay Singh",
//             designation: "Master Trainer",
//             block: "Block Alpha",
//         },
//         {
//             id: 4,
//             participantType: "Trainer",
//             name: "Neha Sharma",
//             designation: "Field Trainer",
//             block: "Block Gamma",
//         },
//         {
//             id: 5,
//             participantType: "Beneficiary",
//             name: "Mohd Arif",
//             gender: "Male",
//             designation: "Entrepreneur",
//             religion: "Muslim",
//             socialCategory: "General",
//             pldStatus: "Completed",
//             block: "Block Alpha",
//             panchayat: "Panchayat A",
//             village: "Village C",
//             ageGroup: "18-35",
//         },
//     ];

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatus = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];

//     // Dynamic blocks extracted from data
//     const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             // --- BLOCK FILTER LOGIC ---
//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     // Combined state processing
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
//                     // Separate batch state processing
//                     if (item.block !== filters.block) return false;
//                 }
//             }

//             if (filters.gender && item.gender !== filters.gender) return false;
//             if (filters.designation && item.designation !== filters.designation) return false;
//             if (filters.religion && item.religion !== filters.religion) return false;
//             if (filters.socialCategory && item.socialCategory !== filters.socialCategory) return false;
//             if (filters.pldStatus && item.pldStatus !== filters.pldStatus) return false;
//             if (filters.panchayat && item.panchayat !== filters.panchayat) return false;
//             if (filters.village && item.village !== filters.village) return false;
//             if (filters.ageGroup && item.ageGroup !== filters.ageGroup) return false;

//             if (filters.searchValue) {
//                 const searchText = filters.searchValue.toLowerCase();
//                 if (!item.name?.toLowerCase().includes(searchText)) {
//                     return false;
//                 }
//             }

//             return true;
//         });
//     }, [filters]);

//     return (
//         <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
//             <div style={{ maxHeight: "650px", overflowY: "auto" }}>
//                 <ParticipantTableFilters
//                     filters={filters}
//                     handleChange={handleChange}
//                     genders={genders}
//                     designations={designations}
//                     pldStatus={pldStatus}
//                     socialCategories={socialCategories}
//                     religions={religions}
//                     panchayats={panchayats}
//                     villages={villages}
//                     ageRanges={ageRanges}
//                     blocks={blocksList}
//                 />
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={thStyle}>ID</th>
//                             <th style={thStyle}>Name</th>
//                             <th style={thStyle}>Type</th>
//                             <th style={thStyle}>Block</th>
//                             <th style={thStyle}>Gender</th>
//                             <th style={thStyle}>Designation</th>
//                             <th style={thStyle}>Religion</th>
//                             <th style={thStyle}>Category</th>
//                             <th style={thStyle}>PLD Status</th>
//                             <th style={thStyle}>Panchayat</th>
//                             <th style={thStyle}>Village</th>
//                             <th style={thStyle}>Age Group</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredData.length > 0 ? (
//                             filteredData.map((row) => (
//                                 <tr key={row.id}>
//                                     <td style={tdStyle}>{row.id}</td>
//                                     <td style={tdStyle}>{row.name}</td>
//                                     <td style={tdStyle}>{row.participantType}</td>
//                                     <td style={tdStyle}>{row.block || "-"}</td>
//                                     <td style={tdStyle}>{row.gender || "-"}</td>
//                                     <td style={tdStyle}>{row.designation || "-"}</td>
//                                     <td style={tdStyle}>{row.religion || "-"}</td>
//                                     <td style={tdStyle}>{row.socialCategory || "-"}</td>
//                                     <td style={tdStyle}>{row.pldStatus || "-"}</td>
//                                     <td style={tdStyle}>{row.panchayat || "-"}</td>
//                                     <td style={tdStyle}>{row.village || "-"}</td>
//                                     <td style={tdStyle}>{row.ageGroup || "-"}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
//                                     No Records Found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const thStyle = { padding: "12px", borderBottom: "1px solid #ddd", textAlign: "left", fontSize: "13px", fontWeight: 600 };
// const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

// export default ParticipantTable;

import React, { useMemo } from "react";
import ParticipantTableFilters from "./ParticipantsTableFilter";

const ParticipantTable = ({
    filters = {},
    handleChange = () => { },
}) => {
    const dummyData = [
        { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
        { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
        { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha" },
        { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
        { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
    ];

    const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
    const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
    const pldStatus = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
    const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
    const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
    const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
    const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
    const ageRanges = ["18-35", "36-50", "50+"];
    const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

    const filteredData = useMemo(() => {
        return dummyData.filter((item) => {
            if (filters.participantType && item.participantType !== filters.participantType) {
                return false;
            }

            if (filters.block && filters.block.length > 0) {
                if (Array.isArray(filters.block)) {
                    if (!filters.block.includes(item.block)) return false;
                } else {
                    if (item.block !== filters.block) return false;
                }
            }

            if (filters.gender && item.gender !== filters.gender) return false;
            if (filters.designation && item.designation !== filters.designation) return false;
            if (filters.religion && item.religion !== filters.religion) return false;
            if (filters.socialCategory && item.socialCategory !== filters.socialCategory) return false;
            if (filters.pldStatus && item.pldStatus !== filters.pldStatus) return false;
            if (filters.panchayat && item.panchayat !== filters.panchayat) return false;
            if (filters.village && item.village !== filters.village) return false;
            if (filters.ageGroup && item.ageGroup !== filters.ageGroup) return false;

            if (filters.searchValue) {
                const searchText = filters.searchValue.toLowerCase();
                if (!item.name?.toLowerCase().includes(searchText)) {
                    return false;
                }
            }

            return true;
        });
    }, [filters]);

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ maxHeight: "650px", overflowY: "auto" }}>
                <ParticipantTableFilters
                    filters={filters}
                    handleChange={handleChange}
                    genders={genders}
                    designations={designations}
                    pldStatus={pldStatus}
                    socialCategories={socialCategories}
                    religions={religions}
                    panchayats={panchayats}
                    villages={villages}
                    ageRanges={ageRanges}
                    blocks={blocksList}
                />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f3f4f6" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Block</th>
                            <th style={thStyle}>Gender</th>
                            <th style={thStyle}>Designation</th>
                            <th style={thStyle}>Religion</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>PLD Status</th>
                            <th style={thStyle}>Panchayat</th>
                            <th style={thStyle}>Village</th>
                            <th style={thStyle}>Age Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row) => (
                                <tr key={row.id}>
                                    <td style={tdStyle}>{row.id}</td>
                                    <td style={tdStyle}>{row.name}</td>
                                    <td style={tdStyle}>{row.participantType}</td>
                                    <td style={tdStyle}>{row.block || "-"}</td>
                                    <td style={tdStyle}>{row.gender || "-"}</td>
                                    <td style={tdStyle}>{row.designation || "-"}</td>
                                    <td style={tdStyle}>{row.religion || "-"}</td>
                                    <td style={tdStyle}>{row.socialCategory || "-"}</td>
                                    <td style={tdStyle}>{row.pldStatus || "-"}</td>
                                    <td style={tdStyle}>{row.panchayat || "-"}</td>
                                    <td style={tdStyle}>{row.village || "-"}</td>
                                    <td style={tdStyle}>{row.ageGroup || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
                                    No Records Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const thStyle = { padding: "12px", borderBottom: "1px solid #ddd", textAlign: "left", fontSize: "13px", fontWeight: 600 };
const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

export default ParticipantTable;