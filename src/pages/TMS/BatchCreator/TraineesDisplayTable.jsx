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

// import React, { useMemo } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
// }) => {
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//     ];

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatus = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];
//     const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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



// import React, { useMemo } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
// }) => {
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//     ];

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatus = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];
//     const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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



// import React, { useMemo, useState } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
// }) => {
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha", pldStatus: "Completed" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//     ];

//     const [selectedRows, setSelectedRows] = useState([]);

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatusList = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];
//     const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRows(filteredData.map(row => row.id));
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleSelectRow = (id) => {
//         setSelectedRows(prev =>
//             prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
//             <div style={{ maxHeight: "650px", overflowY: "auto" }}>
//                 <ParticipantTableFilters
//                     filters={filters}
//                     handleChange={handleChange}
//                     genders={genders}
//                     designations={designations}
//                     pldStatus={pldStatusList}
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
//                             <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
//                                 <input
//                                     type="checkbox"
//                                     onChange={handleSelectAll}
//                                     checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
//                                 />
//                             </th>
//                             <th style={thStyle}>S.no / ID</th>
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
//                             filteredData.map((row) => {
//                                 // Checking if row is PLD
//                                 const isPLD = row.pldStatus === "Completed" || row.pldStatus === "PLD Completed";
//                                 // Checking if row is SC or ST
//                                 const isSCST = row.socialCategory === "SC" || row.socialCategory === "ST";
//                                 const hasBadges = isPLD || isSCST;

//                                 return (
//                                     <tr key={row.id} style={{ background: selectedRows.includes(row.id) ? "#f8fafc" : "transparent" }}>
//                                         <td style={{ ...tdStyle, textAlign: "center" }}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedRows.includes(row.id)}
//                                                 onChange={() => handleSelectRow(row.id)}
//                                             />
//                                         </td>
//                                         <td style={tdStyle}>{row.id}</td>

//                                         {/* Name cell with relative positioning to hold the badges at the top */}
//                                         <td style={{
//                                             ...tdStyle,
//                                             position: "relative",
//                                             paddingTop: hasBadges ? "26px" : "12px", // Shift text down if badges exist
//                                             minWidth: "120px"
//                                         }}>
//                                             {hasBadges && (
//                                                 <div style={{ position: "absolute", top: "4px", left: "12px", display: "flex", gap: "6px" }}>
//                                                     {isPLD && (
//                                                         <span style={greenBadgeStyle}>PLD</span>
//                                                     )}
//                                                     {isSCST && (
//                                                         <span style={yellowBadgeStyle}>{row.socialCategory}</span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             <span style={{ display: "block" }}>{row.name}</span>
//                                         </td>

//                                         <td style={tdStyle}>{row.participantType}</td>
//                                         <td style={tdStyle}>{row.block || "-"}</td>
//                                         <td style={tdStyle}>{row.gender || "-"}</td>
//                                         <td style={tdStyle}>{row.designation || "-"}</td>
//                                         <td style={tdStyle}>{row.religion || "-"}</td>
//                                         <td style={tdStyle}>{row.socialCategory || "-"}</td>
//                                         <td style={tdStyle}>{row.pldStatus || "-"}</td>
//                                         <td style={tdStyle}>{row.panchayat || "-"}</td>
//                                         <td style={tdStyle}>{row.village || "-"}</td>
//                                         <td style={tdStyle}>{row.ageGroup || "-"}</td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
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

// // Styles
// const thStyle = { padding: "12px", borderBottom: "1px solid #ddd", textAlign: "left", fontSize: "13px", fontWeight: 600 };
// const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

// const greenBadgeStyle = {
//     backgroundColor: "#dcfce7",
//     color: "#166534",
//     border: "1px solid #bbf7d0",
//     padding: "2px 6px",
//     borderRadius: "4px", // slightly sharper corners to look like a top-tab
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// const yellowBadgeStyle = {
//     backgroundColor: "#fef08a",
//     color: "#854d0e",
//     border: "1px solid #fde047",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// export default ParticipantTable;


// import React, { useMemo, useState } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
// }) => {
//     // Large dataset to ensure the vertical scrollbar triggers
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha", pldStatus: "Completed" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//         { id: 6, participantType: "Beneficiary", name: "Kiran Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "ST", pldStatus: "Completed", block: "Block Beta", panchayat: "Panchayat C", village: "Village D", ageGroup: "26-35" },
//         { id: 7, participantType: "Trainer", name: "Rajesh Verma", designation: "Master Trainer", block: "Block Delta", pldStatus: "Pending" },
//         { id: 8, participantType: "Beneficiary", name: "Sunita Rao", gender: "Female", designation: "Book Keeper", religion: "Christian", socialCategory: "SC", pldStatus: "Ongoing", block: "Block Alpha", panchayat: "Panchayat B", village: "Village A", ageGroup: "36-45" },
//         { id: 9, participantType: "Beneficiary", name: "Vikram Singh", gender: "Male", designation: "CRP", religion: "Sikh", socialCategory: "OBC", pldStatus: "Completed", block: "Block Gamma", panchayat: "Panchayat D", village: "Village B", ageGroup: "46-55" },
//         { id: 10, participantType: "Trainer", name: "Pooja Hegde", designation: "Field Trainer", block: "Block Beta", pldStatus: "Completed" }
//     ];

//     const [selectedRows, setSelectedRows] = useState([]);

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatusList = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];
//     const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRows(filteredData.map(row => row.id));
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleSelectRow = (id) => {
//         setSelectedRows(prev =>
//             prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>

//             {/* Top filter component remains strictly fixed */}
//             <ParticipantTableFilters
//                 filters={filters}
//                 handleChange={handleChange}
//                 genders={genders}
//                 designations={designations}
//                 pldStatus={pldStatusList}
//                 socialCategories={socialCategories}
//                 religions={religions}
//                 panchayats={panchayats}
//                 villages={villages}
//                 ageRanges={ageRanges}
//                 blocks={blocksList}
//             />

//             {/* Scroll container limits table height & manages isolated vertical scrolling */}
//             <div style={{ maxHeight: "380px", overflowY: "auto", overflowX: "auto", position: "relative" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
//                                 <input
//                                     type="checkbox"
//                                     onChange={handleSelectAll}
//                                     checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
//                                 />
//                             </th>
//                             <th style={thStyle}>S.no / ID</th>
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
//                             filteredData.map((row) => {
//                                 const isPLD = row.pldStatus === "Completed" || row.pldStatus === "PLD Completed";
//                                 const isSCST = row.socialCategory === "SC" || row.socialCategory === "ST";
//                                 const hasBadges = isPLD || isSCST;

//                                 return (
//                                     <tr key={row.id} style={{ background: selectedRows.includes(row.id) ? "#f8fafc" : "transparent" }}>
//                                         <td style={{ ...tdStyle, textAlign: "center" }}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedRows.includes(row.id)}
//                                                 onChange={() => handleSelectRow(row.id)}
//                                             />
//                                         </td>
//                                         <td style={tdStyle}>{row.id}</td>

//                                         {/* Relative cell handles absolute positioning layout for top border badges */}
//                                         <td style={{
//                                             ...tdStyle,
//                                             position: "relative",
//                                             paddingTop: hasBadges ? "26px" : "12px",
//                                             minWidth: "145px"
//                                         }}>
//                                             {hasBadges && (
//                                                 <div style={{ position: "absolute", top: "4px", left: "12px", display: "flex", gap: "6px" }}>
//                                                     {isPLD && (
//                                                         <span style={greenBadgeStyle}>PLD</span>
//                                                     )}
//                                                     {isSCST && (
//                                                         <span style={yellowBadgeStyle}>{row.socialCategory}</span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             <span style={{ display: "block" }}>{row.name}</span>
//                                         </td>

//                                         <td style={tdStyle}>{row.participantType}</td>
//                                         <td style={tdStyle}>{row.block || "-"}</td>
//                                         <td style={tdStyle}>{row.gender || "-"}</td>
//                                         <td style={tdStyle}>{row.designation || "-"}</td>
//                                         <td style={tdStyle}>{row.religion || "-"}</td>
//                                         <td style={tdStyle}>{row.socialCategory || "-"}</td>
//                                         <td style={tdStyle}>{row.pldStatus || "-"}</td>
//                                         <td style={tdStyle}>{row.panchayat || "-"}</td>
//                                         <td style={tdStyle}>{row.village || "-"}</td>
//                                         <td style={tdStyle}>{row.ageGroup || "-"}</td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
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

// // Sticky Headers declaration to lock the blue/gray row at top of container view
// const thStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #ddd",
//     textAlign: "left",
//     fontSize: "13px",
//     fontWeight: 600,
//     position: "sticky",
//     top: 0,
//     backgroundColor: "#f3f4f6",
//     zIndex: 20
// };

// const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

// const greenBadgeStyle = {
//     backgroundColor: "#dcfce7",
//     color: "#166534",
//     border: "1px solid #bbf7d0",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// const yellowBadgeStyle = {
//     backgroundColor: "#fef08a",
//     color: "#854d0e",
//     border: "1px solid #fde047",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// export default ParticipantTable;


// import React, { useMemo, useState, useEffect } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
//     onSelectionChange, // Added callback to pass count back to parent dashboard
// }) => {
//     // Large dataset to ensure the vertical scrollbar triggers
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha", pldStatus: "Completed" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//         { id: 6, participantType: "Beneficiary", name: "Kiran Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "ST", pldStatus: "Completed", block: "Block Beta", panchayat: "Panchayat C", village: "Village D", ageGroup: "26-35" },
//         { id: 7, participantType: "Trainer", name: "Rajesh Verma", designation: "Master Trainer", block: "Block Delta", pldStatus: "Pending" },
//         { id: 8, participantType: "Beneficiary", name: "Sunita Rao", gender: "Female", designation: "Book Keeper", religion: "Christian", socialCategory: "SC", pldStatus: "Ongoing", block: "Block Alpha", panchayat: "Panchayat B", village: "Village A", ageGroup: "36-45" },
//         { id: 9, participantType: "Beneficiary", name: "Vikram Singh", gender: "Male", designation: "CRP", religion: "Sikh", socialCategory: "OBC", pldStatus: "Completed", block: "Block Gamma", panchayat: "Panchayat D", village: "Village B", ageGroup: "46-55" },
//         { id: 10, participantType: "Trainer", name: "Pooja Hegde", designation: "Field Trainer", block: "Block Beta", pldStatus: "Completed" }
//     ];

//     const [selectedRows, setSelectedRows] = useState([]);

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatusList = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];
//     const blocksList = [...new Set(dummyData.map(i => i.block).filter(Boolean))];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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

//     // Push changes to dashboard parent state whenever chosen items alter
//     useEffect(() => {
//         if (onSelectionChange) {
//             onSelectionChange(selectedRows.length);
//         }
//     }, [selectedRows, onSelectionChange]);

//     // Clear selection cleanly when participantType filter toggles or changes
//     useEffect(() => {
//         setSelectedRows([]);
//     }, [filters.participantType]);

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRows(filteredData.map(row => row.id));
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleSelectRow = (id) => {
//         setSelectedRows(prev =>
//             prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>

//             {/* Top filter component remains strictly fixed */}
//             <ParticipantTableFilters
//                 filters={filters}
//                 handleChange={handleChange}
//                 genders={genders}
//                 designations={designations}
//                 pldStatus={pldStatusList}
//                 socialCategories={socialCategories}
//                 religions={religions}
//                 panchayats={panchayats}
//                 villages={villages}
//                 ageRanges={ageRanges}
//                 blocks={blocksList}
//             />

//             {/* Scroll container limits table height & manages isolated vertical scrolling */}
//             <div style={{ maxHeight: "380px", overflowY: "auto", overflowX: "auto", position: "relative" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
//                                 <input
//                                     type="checkbox"
//                                     onChange={handleSelectAll}
//                                     checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
//                                 />
//                             </th>
//                             <th style={thStyle}>S.no / ID</th>
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
//                             filteredData.map((row) => {
//                                 const isPLD = row.pldStatus === "Completed" || row.pldStatus === "PLD Completed";
//                                 const isSCST = row.socialCategory === "SC" || row.socialCategory === "ST";
//                                 const hasBadges = isPLD || isSCST;

//                                 return (
//                                     <tr key={row.id} style={{ background: selectedRows.includes(row.id) ? "#f8fafc" : "transparent" }}>
//                                         <td style={{ ...tdStyle, textAlign: "center" }}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedRows.includes(row.id)}
//                                                 onChange={() => handleSelectRow(row.id)}
//                                             />
//                                         </td>
//                                         <td style={tdStyle}>{row.id}</td>

//                                         {/* Relative cell handles absolute positioning layout for top border badges */}
//                                         <td style={{
//                                             ...tdStyle,
//                                             position: "relative",
//                                             paddingTop: hasBadges ? "26px" : "12px",
//                                             minWidth: "145px"
//                                         }}>
//                                             {hasBadges && (
//                                                 <div style={{ position: "absolute", top: "4px", left: "12px", display: "flex", gap: "6px" }}>
//                                                     {isPLD && (
//                                                         <span style={greenBadgeStyle}>PLD</span>
//                                                     )}
//                                                     {isSCST && (
//                                                         <span style={yellowBadgeStyle}>{row.socialCategory}</span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             <span style={{ display: "block" }}>{row.name}</span>
//                                         </td>

//                                         <td style={tdStyle}>{row.participantType}</td>
//                                         <td style={tdStyle}>{row.block || "-"}</td>
//                                         <td style={tdStyle}>{row.gender || "-"}</td>
//                                         <td style={tdStyle}>{row.designation || "-"}</td>
//                                         <td style={tdStyle}>{row.religion || "-"}</td>
//                                         <td style={tdStyle}>{row.socialCategory || "-"}</td>
//                                         <td style={tdStyle}>{row.pldStatus || "-"}</td>
//                                         <td style={tdStyle}>{row.panchayat || "-"}</td>
//                                         <td style={tdStyle}>{row.village || "-"}</td>
//                                         <td style={tdStyle}>{row.ageGroup || "-"}</td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
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
//     position: "sticky",
//     top: 0,
//     backgroundColor: "#f3f4f6",
//     zIndex: 20
// };

// const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

// const greenBadgeStyle = {
//     backgroundColor: "#dcfce7",
//     color: "#166534",
//     border: "1px solid #bbf7d0",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// const yellowBadgeStyle = {
//     backgroundColor: "#fef08a",
//     color: "#854d0e",
//     border: "1px solid #fde047",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// export default ParticipantTable;


// import React, { useMemo, useState, useEffect } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";
// import { LOOKUP_API } from "./path-to-your-api-file"; // Make sure to replace this path with your actual api file path

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
//     onSelectionChange,
// }) => {
//     // Large dataset to ensure the vertical scrollbar triggers
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha", pldStatus: "Completed" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//         { id: 6, participantType: "Beneficiary", name: "Kiran Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "ST", pldStatus: "Completed", block: "Block Beta", panchayat: "Panchayat C", village: "Village D", ageGroup: "26-35" },
//         { id: 7, participantType: "Trainer", name: "Rajesh Verma", designation: "Master Trainer", block: "Block Delta", pldStatus: "Pending" },
//         { id: 8, participantType: "Beneficiary", name: "Sunita Rao", gender: "Female", designation: "Book Keeper", religion: "Christian", socialCategory: "SC", pldStatus: "Ongoing", block: "Block Alpha", panchayat: "Panchayat B", village: "Village A", ageGroup: "36-45" },
//         { id: 9, participantType: "Beneficiary", name: "Vikram Singh", gender: "Male", designation: "CRP", religion: "Sikh", socialCategory: "OBC", pldStatus: "Completed", block: "Block Gamma", panchayat: "Panchayat D", village: "Village B", ageGroup: "46-55" },
//         { id: 10, participantType: "Trainer", name: "Pooja Hegde", designation: "Field Trainer", block: "Block Beta", pldStatus: "Completed" }
//     ];

//     const [selectedRows, setSelectedRows] = useState([]);
//     const [dynamicBlocks, setDynamicBlocks] = useState([]); // State to hold real dynamic blocks data

//     // Fetch dynamic blocks on component mount for districtId 31012
//     useEffect(() => {
//         const fetchBlocks = async () => {
//             try {
//                 const response = await LOOKUP_API.blocksByDistrict(31012);
//                 // Check if response contains array format data layout directly or within response.data
//                 if (response && response.data) {
//                     setDynamicBlocks(response.data);
//                 } else if (Array.isArray(response)) {
//                     setDynamicBlocks(response);
//                 }
//             } catch (error) {
//                 console.error("Error loading blocks for district 31012:", error);
//             }
//         };

//         fetchBlocks();
//     }, []);

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatusList = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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

//     // Push changes to dashboard parent state whenever chosen items alter
//     useEffect(() => {
//         if (onSelectionChange) {
//             onSelectionChange(selectedRows.length);
//         }
//     }, [selectedRows, onSelectionChange]);

//     // Clear selection cleanly when participantType filter toggles or changes
//     useEffect(() => {
//         setSelectedRows([]);
//     }, [filters.participantType]);

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRows(filteredData.map(row => row.id));
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleSelectRow = (id) => {
//         setSelectedRows(prev =>
//             prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>

//             {/* Top filter component remains strictly fixed */}
//             <ParticipantTableFilters
//                 filters={filters}
//                 handleChange={handleChange}
//                 genders={genders}
//                 designations={designations}
//                 pldStatus={pldStatusList}
//                 socialCategories={socialCategories}
//                 religions={religions}
//                 panchayats={panchayats}
//                 villages={villages}
//                 ageRanges={ageRanges}
//                 blocks={dynamicBlocks} // Replaced standard blocks list with your dynamically fetched database records array
//             />

//             {/* Scroll container limits table height & manages isolated vertical scrolling */}
//             <div style={{ maxHeight: "380px", overflowY: "auto", overflowX: "auto", position: "relative" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
//                                 <input
//                                     type="checkbox"
//                                     onChange={handleSelectAll}
//                                     checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
//                                 />
//                             </th>
//                             <th style={thStyle}>S.no / ID</th>
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
//                             filteredData.map((row) => {
//                                 const isPLD = row.pldStatus === "Completed" || row.pldStatus === "PLD Completed";
//                                 const isSCST = row.socialCategory === "SC" || row.socialCategory === "ST";
//                                 const hasBadges = isPLD || isSCST;

//                                 return (
//                                     <tr key={row.id} style={{ background: selectedRows.includes(row.id) ? "#f8fafc" : "transparent" }}>
//                                         <td style={{ ...tdStyle, textAlign: "center" }}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedRows.includes(row.id)}
//                                                 onChange={() => handleSelectRow(row.id)}
//                                             />
//                                         </td>
//                                         <td style={tdStyle}>{row.id}</td>

//                                         {/* Relative cell handles absolute positioning layout for top border badges */}
//                                         <td style={{
//                                             ...tdStyle,
//                                             position: "relative",
//                                             paddingTop: hasBadges ? "26px" : "12px",
//                                             minWidth: "145px"
//                                         }}>
//                                             {hasBadges && (
//                                                 <div style={{ position: "absolute", top: "4px", left: "12px", display: "flex", gap: "6px" }}>
//                                                     {isPLD && (
//                                                         <span style={greenBadgeStyle}>PLD</span>
//                                                     )}
//                                                     {isSCST && (
//                                                         <span style={yellowBadgeStyle}>{row.socialCategory}</span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             <span style={{ display: "block" }}>{row.name}</span>
//                                         </td>

//                                         <td style={tdStyle}>{row.participantType}</td>
//                                         <td style={tdStyle}>{row.block || "-"}</td>
//                                         <td style={tdStyle}>{row.gender || "-"}</td>
//                                         <td style={tdStyle}>{row.designation || "-"}</td>
//                                         <td style={tdStyle}>{row.religion || "-"}</td>
//                                         <td style={tdStyle}>{row.socialCategory || "-"}</td>
//                                         <td style={tdStyle}>{row.pldStatus || "-"}</td>
//                                         <td style={tdStyle}>{row.panchayat || "-"}</td>
//                                         <td style={tdStyle}>{row.village || "-"}</td>
//                                         <td style={tdStyle}>{row.ageGroup || "-"}</td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
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
//     position: "sticky",
//     top: 0,
//     backgroundColor: "#f3f4f6",
//     zIndex: 20
// };

// const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

// const greenBadgeStyle = {
//     backgroundColor: "#dcfce7",
//     color: "#166534",
//     border: "1px solid #bbf7d0",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// const yellowBadgeStyle = {
//     backgroundColor: "#fef08a",
//     color: "#854d0e",
//     border: "1px solid #fde047",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// export default ParticipantTable;


// import React, { useMemo, useState, useEffect } from "react";
// import ParticipantTableFilters from "./ParticipantsTableFilter";
// import { LOOKUP_API } from "../../../api/axios";

// const ParticipantTable = ({
//     filters = {},
//     handleChange = () => { },
//     onSelectionChange,
// }) => {
//     // Large dataset to ensure the vertical scrollbar triggers
//     const dummyData = [
//         { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
//         { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
//         { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha", pldStatus: "Completed" },
//         { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
//         { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
//         { id: 6, participantType: "Beneficiary", name: "Kiran Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "ST", pldStatus: "Completed", block: "Block Beta", panchayat: "Panchayat C", village: "Village D", ageGroup: "26-35" },
//         { id: 7, participantType: "Trainer", name: "Rajesh Verma", designation: "Master Trainer", block: "Block Delta", pldStatus: "Pending" },
//         { id: 8, participantType: "Beneficiary", name: "Sunita Rao", gender: "Female", designation: "Book Keeper", religion: "Christian", socialCategory: "SC", pldStatus: "Ongoing", block: "Block Alpha", panchayat: "Panchayat B", village: "Village A", ageGroup: "36-45" },
//         { id: 9, participantType: "Beneficiary", name: "Vikram Singh", gender: "Male", designation: "CRP", religion: "Sikh", socialCategory: "OBC", pldStatus: "Completed", block: "Block Gamma", panchayat: "Panchayat D", village: "Village B", ageGroup: "46-55" },
//         { id: 10, participantType: "Trainer", name: "Pooja Hegde", designation: "Field Trainer", block: "Block Beta", pldStatus: "Completed" }
//     ];

//     const [selectedRows, setSelectedRows] = useState([]);
//     const [dynamicBlocks, setDynamicBlocks] = useState([]); // Base structural default array

//     // Fetch dynamic blocks on component mount for districtId 31012
//     useEffect(() => {
//         const fetchBlocks = async () => {
//             try {
//                 const response = await LOOKUP_API.blocksByDistrict(31012);

//                 // DRF Routers often wrap results inside standard arrays, objects, or nested payload data nodes
//                 if (response && Array.isArray(response.data)) {
//                     setDynamicBlocks(response.data);
//                 } else if (response && response.data && Array.isArray(response.data.results)) {
//                     // Standard Django REST Framework Pagination fallback schema
//                     setDynamicBlocks(response.data.results);
//                 } else if (Array.isArray(response)) {
//                     setDynamicBlocks(response);
//                 } else {
//                     console.error("API response structure unrecognized as an array:", response);
//                     setDynamicBlocks([]); // Fallback safety valve to prevent rendering runtime crashes
//                 }
//             } catch (error) {
//                 console.error("Error loading blocks for district 31012:", error);
//                 setDynamicBlocks([]); // Graceful recovery layout strategy on networking failures
//             }
//         };

//         fetchBlocks();
//     }, []);

//     const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
//     const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
//     const pldStatusList = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
//     const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
//     const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
//     const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
//     const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
//     const ageRanges = ["18-35", "36-50", "50+"];

//     const filteredData = useMemo(() => {
//         return dummyData.filter((item) => {
//             if (filters.participantType && item.participantType !== filters.participantType) {
//                 return false;
//             }

//             if (filters.block && filters.block.length > 0) {
//                 if (Array.isArray(filters.block)) {
//                     if (!filters.block.includes(item.block)) return false;
//                 } else {
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

//     // Push changes to dashboard parent state whenever chosen items alter
//     useEffect(() => {
//         if (onSelectionChange) {
//             onSelectionChange(selectedRows.length);
//         }
//     }, [selectedRows, onSelectionChange]);

//     // Clear selection cleanly when participantType filter toggles or changes
//     useEffect(() => {
//         setSelectedRows([]);
//     }, [filters.participantType]);

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRows(filteredData.map(row => row.id));
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleSelectRow = (id) => {
//         setSelectedRows(prev =>
//             prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>

//             {/* Top filter component remains strictly fixed */}
//             <ParticipantTableFilters
//                 filters={filters}
//                 handleChange={handleChange}
//                 genders={genders}
//                 designations={designations}
//                 pldStatus={pldStatusList}
//                 socialCategories={socialCategories}
//                 religions={religions}
//                 panchayats={panchayats}
//                 villages={villages}
//                 ageRanges={ageRanges}
//                 // Defensively guarantee an array layout mapping signature is provided to children tree nodes
//                 blocks={Array.isArray(dynamicBlocks) ? dynamicBlocks : []}
//             />

//             {/* Scroll container limits table height & manages isolated vertical scrolling */}
//             <div style={{ maxHeight: "380px", overflowY: "auto", overflowX: "auto", position: "relative" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                         <tr style={{ background: "#f3f4f6" }}>
//                             <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
//                                 <input
//                                     type="checkbox"
//                                     onChange={handleSelectAll}
//                                     checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
//                                 />
//                             </th>
//                             <th style={thStyle}>S.no / ID</th>
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
//                             filteredData.map((row) => {
//                                 const isPLD = row.pldStatus === "Completed" || row.pldStatus === "PLD Completed";
//                                 const isSCST = row.socialCategory === "SC" || row.socialCategory === "ST";
//                                 const hasBadges = isPLD || isSCST;

//                                 return (
//                                     <tr key={row.id} style={{ background: selectedRows.includes(row.id) ? "#f8fafc" : "transparent" }}>
//                                         <td style={{ ...tdStyle, textAlign: "center" }}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedRows.includes(row.id)}
//                                                 onChange={() => handleSelectRow(row.id)}
//                                             />
//                                         </td>
//                                         <td style={tdStyle}>{row.id}</td>

//                                         {/* Relative cell handles absolute positioning layout for top border badges */}
//                                         <td style={{
//                                             ...tdStyle,
//                                             position: "relative",
//                                             paddingTop: hasBadges ? "26px" : "12px",
//                                             minWidth: "145px"
//                                         }}>
//                                             {hasBadges && (
//                                                 <div style={{ position: "absolute", top: "4px", left: "12px", display: "flex", gap: "6px" }}>
//                                                     {isPLD && (
//                                                         <span style={greenBadgeStyle}>PLD</span>
//                                                     )}
//                                                     {isSCST && (
//                                                         <span style={yellowBadgeStyle}>{row.socialCategory}</span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             <span style={{ display: "block" }}>{row.name}</span>
//                                         </td>

//                                         <td style={tdStyle}>{row.participantType}</td>
//                                         <td style={tdStyle}>{row.block || "-"}</td>
//                                         <td style={tdStyle}>{row.gender || "-"}</td>
//                                         <td style={tdStyle}>{row.designation || "-"}</td>
//                                         <td style={tdStyle}>{row.religion || "-"}</td>
//                                         <td style={tdStyle}>{row.socialCategory || "-"}</td>
//                                         <td style={tdStyle}>{row.pldStatus || "-"}</td>
//                                         <td style={tdStyle}>{row.panchayat || "-"}</td>
//                                         <td style={tdStyle}>{row.village || "-"}</td>
//                                         <td style={tdStyle}>{row.ageGroup || "-"}</td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
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
//     position: "sticky",
//     top: 0,
//     backgroundColor: "#f3f4f6",
//     zIndex: 20
// };

// const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

// const greenBadgeStyle = {
//     backgroundColor: "#dcfce7",
//     color: "#166534",
//     border: "1px solid #bbf7d0",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// const yellowBadgeStyle = {
//     backgroundColor: "#fef08a",
//     color: "#854d0e",
//     border: "1px solid #fde047",
//     padding: "2px 6px",
//     borderRadius: "4px",
//     fontSize: "10px",
//     fontWeight: "bold",
//     textTransform: "uppercase"
// };

// export default ParticipantTable;


import React, { useMemo, useState, useEffect } from "react";
import ParticipantTableFilters from "./ParticipantsTableFilter";
import { LOOKUP_API } from "../../../api/axios";

const ParticipantTable = ({
    filters = {},
    handleChange = () => { },
    onSelectionChange,
}) => {
    // Large dataset to ensure the vertical scrollbar triggers
    const dummyData = [
        { id: 1, participantType: "Beneficiary", name: "Ramesh Kumar", gender: "Male", designation: "Farmer", religion: "Hindu", socialCategory: "OBC", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village A", ageGroup: "18-35" },
        { id: 2, participantType: "Beneficiary", name: "Sita Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "SC", pldStatus: "Pending", block: "Block Beta", panchayat: "Panchayat B", village: "Village B", ageGroup: "36-50" },
        { id: 3, participantType: "Trainer", name: "Ajay Singh", designation: "Master Trainer", block: "Block Alpha", pldStatus: "Completed" },
        { id: 4, participantType: "Trainer", name: "Neha Sharma", designation: "Field Trainer", block: "Block Gamma" },
        { id: 5, participantType: "Beneficiary", name: "Mohd Arif", gender: "Male", designation: "Entrepreneur", religion: "Muslim", socialCategory: "General", pldStatus: "Completed", block: "Block Alpha", panchayat: "Panchayat A", village: "Village C", ageGroup: "18-35" },
        { id: 6, participantType: "Beneficiary", name: "Kiran Devi", gender: "Female", designation: "SHG Member", religion: "Hindu", socialCategory: "ST", pldStatus: "Completed", block: "Block Beta", panchayat: "Panchayat C", village: "Village D", ageGroup: "26-35" },
        { id: 7, participantType: "Trainer", name: "Rajesh Verma", designation: "Master Trainer", block: "Block Delta", pldStatus: "Pending" },
        { id: 8, participantType: "Beneficiary", name: "Sunita Rao", gender: "Female", designation: "Book Keeper", religion: "Christian", socialCategory: "SC", pldStatus: "Ongoing", block: "Block Alpha", panchayat: "Panchayat B", village: "Village A", ageGroup: "36-45" },
        { id: 9, participantType: "Beneficiary", name: "Vikram Singh", gender: "Male", designation: "CRP", religion: "Sikh", socialCategory: "OBC", pldStatus: "Completed", block: "Block Gamma", panchayat: "Panchayat D", village: "Village B", ageGroup: "46-55" },
        { id: 10, participantType: "Trainer", name: "Pooja Hegde", designation: "Field Trainer", block: "Block Beta", pldStatus: "Completed" }
    ];

    const [selectedRows, setSelectedRows] = useState([]);
    const [dynamicBlocks, setDynamicBlocks] = useState([]); // Base structural default array

    // Fetch dynamic blocks on component mount for districtId 31012
    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const response = await LOOKUP_API.blocksByDistrict(31012);
                let rawBlocks = [];

                // DRF Routers often wrap results inside standard arrays, objects, or nested payload data nodes
                if (response && Array.isArray(response.data)) {
                    rawBlocks = response.data;
                } else if (response && response.data && Array.isArray(response.data.results)) {
                    // Standard Django REST Framework Pagination fallback schema
                    rawBlocks = response.data.results;
                } else if (Array.isArray(response)) {
                    rawBlocks = response;
                } else {
                    console.error("API response structure unrecognized as an array:", response);
                    setDynamicBlocks([]);
                    return;
                }

                /* FIX: Instead of passing raw objects down to <option> tags, map them into simple strings 
                  that match your dummyData schema (e.g. "Block Alpha"). This guarantees React will not crash.
                */
                const parsedBlockNames = rawBlocks
                    .map(blockObj => blockObj?.block_name_en || blockObj?.block_name_local)
                    .filter(Boolean);

                setDynamicBlocks(parsedBlockNames);

            } catch (error) {
                console.error("Error loading blocks for district 31012:", error);
                setDynamicBlocks([]); // Graceful recovery layout strategy on networking failures
            }
        };

        fetchBlocks();
    }, []);

    const genders = [...new Set(dummyData.map(i => i.gender).filter(Boolean))];
    const designations = [...new Set(dummyData.map(i => i.designation).filter(Boolean))];
    const pldStatusList = [...new Set(dummyData.map(i => i.pldStatus).filter(Boolean))];
    const socialCategories = [...new Set(dummyData.map(i => i.socialCategory).filter(Boolean))];
    const religions = [...new Set(dummyData.map(i => i.religion).filter(Boolean))];
    const panchayats = [...new Set(dummyData.map(i => i.panchayat).filter(Boolean))];
    const villages = [...new Set(dummyData.map(i => i.village).filter(Boolean))];
    const ageRanges = ["18-35", "36-50", "50+"];

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

    // Push changes to dashboard parent state whenever chosen items alter
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedRows.length);
        }
    }, [selectedRows, onSelectionChange]);

    // Clear selection cleanly when participantType filter toggles or changes
    useEffect(() => {
        setSelectedRows([]);
    }, [filters.participantType]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredData.map(row => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>

            {/* Top filter component remains strictly fixed */}
            <ParticipantTableFilters
                filters={filters}
                handleChange={handleChange}
                genders={genders}
                designations={designations}
                pldStatus={pldStatusList}
                socialCategories={socialCategories}
                religions={religions}
                panchayats={panchayats}
                villages={villages}
                ageRanges={ageRanges}
                blocks={Array.isArray(dynamicBlocks) ? dynamicBlocks : []}
            />

            {/* Scroll container limits table height & manages isolated vertical scrolling */}
            <div style={{ maxHeight: "380px", overflowY: "auto", overflowX: "auto", position: "relative" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                                />
                            </th>
                            <th style={thStyle}>S.no / ID</th>
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
                            filteredData.map((row) => {
                                const isPLD = row.pldStatus === "Completed" || row.pldStatus === "PLD Completed";
                                const isSCST = row.socialCategory === "SC" || row.socialCategory === "ST";
                                const hasBadges = isPLD || isSCST;

                                return (
                                    <tr key={row.id} style={{ background: selectedRows.includes(row.id) ? "#f8fafc" : "transparent" }}>
                                        <td style={{ ...tdStyle, textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleSelectRow(row.id)}
                                            />
                                        </td>
                                        <td style={tdStyle}>{row.id}</td>

                                        {/* Relative cell handles absolute positioning layout for top border badges */}
                                        <td style={{
                                            ...tdStyle,
                                            position: "relative",
                                            paddingTop: hasBadges ? "26px" : "12px",
                                            minWidth: "145px"
                                        }}>
                                            {hasBadges && (
                                                <div style={{ position: "absolute", top: "4px", left: "12px", display: "flex", gap: "6px" }}>
                                                    {isPLD && (
                                                        <span style={greenBadgeStyle}>PLD</span>
                                                    )}
                                                    {isSCST && (
                                                        <span style={yellowBadgeStyle}>{row.socialCategory}</span>
                                                    )}
                                                </div>
                                            )}
                                            <span style={{ display: "block" }}>{row.name}</span>
                                        </td>

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
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
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

const thStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    position: "sticky",
    top: 0,
    backgroundColor: "#f3f4f6",
    zIndex: 20
};

const tdStyle = { padding: "12px", borderBottom: "1px solid #f1f1f1", fontSize: "13px" };

const greenBadgeStyle = {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase"
};

const yellowBadgeStyle = {
    backgroundColor: "#fef08a",
    color: "#854d0e",
    border: "1px solid #fde047",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase"
};

export default ParticipantTable;