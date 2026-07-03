// import React from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";

// const AssemblerDashboardBatchCreator = () => {
//     return (
//         <div className="dashboard-page">
//             <div
//                 style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "12px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     minHeight: "calc(100vh - 120px)",
//                 }}
//             >
//                 {/* Top Section */}
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     {/* Achievement Card */}
//                     <div
//                         style={{
//                             flexShrink: 0,
//                         }}
//                     >
//                         <AcheivenmentVsTarget
//                             achievement={285}
//                             target={440}
//                         />
//                     </div>

//                     {/* Filters */}
//                     <div
//                         style={{
//                             flex: 1,
//                         }}
//                     >
//                         <FilterComponent />
//                     </div>

//                     {/* Participant Card */}
//                     <div
//                         style={{
//                             flexShrink: 0,
//                         }}
//                     >
//                         <ParticipantCount
//                             selectedParticipants={20}
//                             totalLimit={40}
//                         />
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div
//                     style={{
//                         background: "#fafafa",
//                         border: "1px dashed #d1d5db",
//                         borderRadius: "14px",
//                         minHeight: "360px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         color: "#9ca3af",
//                         fontSize: "18px",
//                         fontWeight: "600",
//                     }}
//                 >
//                     Batch Creator Module Coming Soon
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AssemblerDashboardBatchCreator;



// import React, { useEffect, useState } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         participantType: "",
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     // Dummy Achievement Data
//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     // Dummy Participant Data
//     useEffect(() => {
//         if (filters.participantType === "Trainer") {
//             setParticipantData({
//                 selectedParticipants: 20,
//                 totalLimit: 40,
//             });
//         } else if (filters.participantType === "Beneficiary") {
//             setParticipantData({
//                 selectedParticipants: 28,
//                 totalLimit: 40,
//             });
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     return (
//         <div className="dashboard-page">
//             <div
//                 style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "12px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     minHeight: "calc(100vh - 120px)",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     <div style={{ flexShrink: 0 }}>
//                         <AcheivenmentVsTarget
//                             achievement={achievementData.achievement}
//                             target={achievementData.target}
//                         />
//                     </div>

//                     <div style={{ flex: 1 }}>
//                         <FilterComponent
//                             filters={filters}
//                             onFilterChange={setFilters}
//                         />
//                     </div>

//                     <div style={{ flexShrink: 0 }}>
//                         <ParticipantCount
//                             selectedParticipants={
//                                 participantData.selectedParticipants
//                             }
//                             totalLimit={participantData.totalLimit}
//                         />
//                     </div>
//                     <ParticipantTable />
//                 </div>

//                 <div
//                     style={{
//                         background: "#fafafa",
//                         border: "1px dashed #d1d5db",
//                         borderRadius: "14px",
//                         minHeight: "360px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         color: "#9ca3af",
//                         fontSize: "18px",
//                         fontWeight: "600",
//                     }}
//                 >
//                     Batch Creator Module Coming Soon
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AssemblerDashboardBatchCreator;



// import React, { useEffect, useState } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         participantType: "",
//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageGroup: "",
//         searchValue: "",
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     useEffect(() => {
//         if (filters.participantType === "Trainer") {
//             setParticipantData({
//                 selectedParticipants: 20,
//                 totalLimit: 40,
//             });
//         } else if (filters.participantType === "Beneficiary") {
//             setParticipantData({
//                 selectedParticipants: 28,
//                 totalLimit: 40,
//             });
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     return (
//         <div className="dashboard-page">
//             <div
//                 style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "12px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     minHeight: "calc(100vh - 120px)",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     <div style={{ flexShrink: 0 }}>
//                         <AcheivenmentVsTarget
//                             achievement={achievementData.achievement}
//                             target={achievementData.target}
//                         />
//                     </div>

//                     <div style={{ flex: 1 }}>
//                         <FilterComponent
//                             filters={filters}
//                             onFilterChange={setFilters}
//                         />
//                     </div>

//                     <div style={{ flexShrink: 0 }}>
//                         <ParticipantCount
//                             selectedParticipants={
//                                 participantData.selectedParticipants
//                             }
//                             totalLimit={participantData.totalLimit}
//                         />
//                     </div>
//                 </div>

//                 <ParticipantTable filters={filters} />
//             </div>
//         </div>
//     );
// };

// export default AssemblerDashboardBatchCreator;

// import React, { useEffect, useState } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",

//         participantType: "",

//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",

//         searchValue: "",
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================

//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD
//     // ===========================

//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     // ===========================
//     // PARTICIPANT COUNT
//     // ===========================

//     useEffect(() => {
//         if (filters.participantType === "Trainer") {
//             setParticipantData({
//                 selectedParticipants: 20,
//                 totalLimit: 40,
//             });
//         } else if (filters.participantType === "Beneficiary") {
//             setParticipantData({
//                 selectedParticipants: 28,
//                 totalLimit: 40,
//             });
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     return (
//         <div className="dashboard-page">
//             <div
//                 style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "12px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     minHeight: "calc(100vh - 120px)",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     <div style={{ flexShrink: 0 }}>
//                         <AcheivenmentVsTarget
//                             achievement={achievementData.achievement}
//                             target={achievementData.target}
//                         />
//                     </div>

//                     <div style={{ flex: 1 }}>
//                         <FilterComponent
//                             filters={filters}
//                             onFilterChange={setFilters}
//                         />
//                     </div>

//                     <div style={{ flexShrink: 0 }}>
//                         <ParticipantCount
//                             selectedParticipants={
//                                 participantData.selectedParticipants
//                             }
//                             totalLimit={participantData.totalLimit}
//                         />
//                     </div>
//                 </div>

//                 {/* Participant Table */}

//                 <ParticipantTable
//                     filters={filters}
//                     handleChange={handleChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default AssemblerDashboardBatchCreator;


// import React, { useEffect, useState } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",

//         participantType: "",

//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",

//         searchValue: "",
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================

//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD
//     // ===========================

//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     // ===========================
//     // PARTICIPANT COUNT
//     // ===========================

//     useEffect(() => {
//         if (filters.participantType === "Trainer") {
//             setParticipantData({
//                 selectedParticipants: 20,
//                 totalLimit: 40,
//             });
//         } else if (filters.participantType === "Beneficiary") {
//             setParticipantData({
//                 selectedParticipants: 28,
//                 totalLimit: 40,
//             });
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     return (
//         <div className="dashboard-page">
//             <div
//                 style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "12px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     minHeight: "calc(100vh - 120px)",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     <div style={{ flexShrink: 0 }}>
//                         <AcheivenmentVsTarget
//                             achievement={achievementData.achievement}
//                             target={achievementData.target}
//                         />
//                     </div>

//                     <div style={{ flex: 1 }}>
//                         <FilterComponent
//                             filters={filters}
//                             onFilterChange={setFilters}
//                             handleChange={handleChange} // Agar dynamic key change chahiye ho child mein
//                         />
//                     </div>

//                     <div style={{ flexShrink: 0 }}>
//                         <ParticipantCount
//                             selectedParticipants={
//                                 participantData.selectedParticipants
//                             }
//                             totalLimit={participantData.totalLimit}
//                         />
//                     </div>
//                 </div>

//                 {/* Conditional Rendering: Table tabhi dikhegi jab type "Trainer" ya "Beneficiary" ho */}
//                 {filters.participantType ? (
//                     <ParticipantTable
//                         filters={filters}
//                         handleChange={handleChange}
//                         participantType={filters.participantType} // Table ke andar data filter karne ke liye useful rahega
//                     />
//                 ) : (
//                     <div
//                         style={{
//                             textAlign: 'center',
//                             padding: '40px',
//                             color: '#8c8c8c',
//                             border: '1px dashed #d9d9d9',
//                             borderRadius: '8px',
//                             marginTop: '20px'
//                         }}
//                     >
//                         Please select a Participant Type (Trainer or Beneficiary) to view the trainees list.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AssemblerDashboardBatchCreator;


// import React, { useEffect, useState, useCallback } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";
// import TmsLeftNav from "../layout/tms_LeftNav";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         participantType: "",
//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",
//         searchValue: "",
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================
//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD
//     // ===========================
//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     // ===========================
//     // PARTICIPANT COUNT LIMIT INITIALIZATION
//     // ===========================
//     useEffect(() => {
//         if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
//             setParticipantData((prev) => ({
//                 ...prev,
//                 totalLimit: 40, // Set target limit dynamically based on selection layout
//             }));
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     // ===========================
//     // SELECTION UPDATE HANDLER
//     // ===========================
//     // Wrapped in useCallback to prevent unnecessary hook re-triggers in Child Component
//     const handleSelectionChange = useCallback((count) => {
//         setParticipantData((prev) => ({
//             ...prev,
//             selectedParticipants: count,
//         }));
//     }, []);

//     return (
//         <div style={{ display: "flex", width: "100%" }}>
//             <TmsLeftNav />
//             <div
//                 style={{
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "12px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     minHeight: "calc(100vh - 120px)",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     <div style={{ flexShrink: 0 }}>
//                         <AcheivenmentVsTarget
//                             achievement={achievementData.achievement}
//                             target={achievementData.target}
//                         />
//                     </div>

//                     <div style={{ flex: 1 }}>
//                         <FilterComponent
//                             filters={filters}
//                             onFilterChange={setFilters}
//                             handleChange={handleChange}
//                         />
//                     </div>

//                     <div style={{ flexShrink: 0 }}>
//                         <ParticipantCount
//                             selectedParticipants={participantData.selectedParticipants}
//                             totalLimit={participantData.totalLimit}
//                         />
//                     </div>
//                 </div>

//                 {/* Conditional Rendering: Table with selection capability synced back */}
//                 {filters.participantType ? (
//                     <ParticipantTable
//                         filters={filters}
//                         handleChange={handleChange}
//                         participantType={filters.participantType}
//                         onSelectionChange={handleSelectionChange}
//                     />
//                 ) : (
//                     <div
//                         style={{
//                             textAlign: 'center',
//                             padding: '40px',
//                             color: '#8c8c8c',
//                             border: '1px dashed #d9d9d9',
//                             borderRadius: '8px',
//                             marginTop: '20px'
//                         }}
//                     >
//                         Please select a Participant Type (Trainer or Beneficiary) to view the trainees list.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AssemblerDashboardBatchCreator;


// import React, { useEffect, useState, useCallback } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";
// import TmsLeftNav from "../layout/tms_LeftNav";
// import Header from "../layout/header";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         trainingPlanDays: "",
//         participantType: "",
//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",
//         searchValue: "",
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================
//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD
//     // ===========================
//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     // ===========================
//     // PARTICIPANT COUNT LIMIT INITIALIZATION
//     // ===========================
//     useEffect(() => {
//         if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
//             setParticipantData((prev) => ({
//                 ...prev,
//                 totalLimit: 40,
//             }));
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     // ===========================
//     // SELECTION UPDATE HANDLER
//     // ===========================
//     const handleSelectionChange = useCallback((count) => {
//         setParticipantData((prev) => ({
//             ...prev,
//             selectedParticipants: count,
//         }));
//     }, []);

//     return (
//         <><Header /><div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#f8fafc" }}>
//             {/* Sidebar navigation panel */}
//             <TmsLeftNav />

//             {/* Main content view dashboard container */}
//             <div
//                 style={{
//                     flex: 1,
//                     minWidth: 0, // Critical: stops large inner elements like wide tables from breaking the width layout
//                     background: "#fff",
//                     borderRadius: "12px",
//                     padding: "16px",
//                     margin: "16px", // Adds a uniform edge spacing away from borders cleanly
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                     display: "flex",
//                     flexDirection: "column",
//                 }}
//             >
//                 {/* Header row area (Metrics widgets + filters) */}
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "16px",
//                         marginBottom: "16px",
//                         width: "100%",
//                     }}
//                 >
//                     <div style={{ flexShrink: 0 }}>
//                         <AcheivenmentVsTarget
//                             achievement={achievementData.achievement}
//                             target={achievementData.target} />
//                     </div>

//                     <div style={{ flex: 1 }}>
//                         <FilterComponent
//                             filters={filters}
//                             onFilterChange={setFilters}
//                             handleChange={handleChange} />
//                     </div>

//                     <div style={{ flexShrink: 0 }}>
//                         <ParticipantCount
//                             selectedParticipants={participantData.selectedParticipants}
//                             totalLimit={participantData.totalLimit} />
//                     </div>
//                 </div>

//                 {/* Main Data Table Display Section */}
//                 <div style={{ width: "100%", flex: 1 }}>
//                     {filters.participantType ? (
//                         <ParticipantTable
//                             filters={filters}
//                             handleChange={handleChange}
//                             participantType={filters.participantType}
//                             onSelectionChange={handleSelectionChange} />
//                     ) : (
//                         <div
//                             style={{
//                                 textAlign: 'center',
//                                 padding: '40px',
//                                 color: '#8c8c8c',
//                                 border: '1px dashed #d9d9d9',
//                                 borderRadius: '8px',
//                                 marginTop: '20px'
//                             }}
//                         >
//                             Please select a Participant Type (Trainer or Beneficiary) to view the trainees list.
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div></>
//     );
// };

// export default AssemblerDashboardBatchCreator;


// import React, { useEffect, useState, useCallback } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";
// import TmsLeftNav from "../layout/tms_LeftNav";
// import Header from "../layout/header";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         trainingPlanDays: "",
//         participantType: "",
//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",
//         searchValue: "",
//         startDate: "",
//         endDate: "",
//         trainingCenter: "", // Added placeholder for center details
//     });

//     const [achievementData, setAchievementData] = useState({
//         achievement: 0,
//         target: 0,
//     });

//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: 0,
//         totalLimit: 0,
//     });

//     // Modal view status visibility toggle variables
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================
//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD
//     // ===========================
//     useEffect(() => {
//         if (
//             filters.financialYear &&
//             filters.trainingTheme &&
//             filters.trainingPlan
//         ) {
//             setAchievementData({
//                 achievement: 285,
//                 target: 440,
//             });
//         } else {
//             setAchievementData({
//                 achievement: 0,
//                 target: 0,
//             });
//         }
//     }, [
//         filters.financialYear,
//         filters.trainingTheme,
//         filters.trainingPlan,
//     ]);

//     // ===========================
//     // PARTICIPANT COUNT LIMIT INITIALIZATION
//     // ===========================
//     useEffect(() => {
//         if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
//             setParticipantData((prev) => ({
//                 ...prev,
//                 totalLimit: 40,
//             }));
//         } else {
//             setParticipantData({
//                 selectedParticipants: 0,
//                 totalLimit: 0,
//             });
//         }
//     }, [filters.participantType]);

//     // ===========================
//     // SELECTION UPDATE HANDLER
//     // ===========================
//     const handleSelectionChange = useCallback((count) => {
//         setParticipantData((prev) => ({
//             ...prev,
//             selectedParticipants: count,
//         }));
//     }, []);

//     // ===========================
//     // CONFIRM & SAVE SUBMITTER
//     // ===========================
//     const handleConfirmAndSave = () => {
//         // Prepare data state package payload context
//         const batchPayload = {
//             selectedTraineesCount: participantData.selectedParticipants,
//             trainingTheme: filters.trainingTheme || "Not Selected",
//             trainingCenter: filters.trainingCenter || "Default Center - Hall A",
//             financialYear: filters.financialYear || "Not Selected",
//             dates: {
//                 start: filters.startDate || "Not Set",
//                 end: filters.endDate || "Not Set"
//             },
//             status: "Draft"
//         };

//         console.log("Saving form state to local draft buffers...", batchPayload);

//         // Simulating writing state downstream into a draft persistence engine
//         localStorage.setItem("tms_batch_draft", JSON.stringify({ filters, participantData }));

//         alert("Progress successfully synchronized! The batch state has been saved as a draft.");
//         setIsPreviewOpen(false);
//     };

//     return (
//         <>
//             <Header />
//             <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#f8fafc" }}>
//                 {/* Sidebar navigation panel */}
//                 <TmsLeftNav />

//                 {/* Main content view dashboard container */}
//                 <div
//                     style={{
//                         flex: 1,
//                         minWidth: 0,
//                         background: "#fff",
//                         borderRadius: "12px",
//                         padding: "16px",
//                         margin: "16px",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                         display: "flex",
//                         flexDirection: "column",
//                     }}
//                 >
//                     {/* Header row area (Metrics widgets + filters) */}
//                     <div
//                         style={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             gap: "16px",
//                             marginBottom: "16px",
//                             width: "100%",
//                         }}
//                     >
//                         <div style={{ flexShrink: 0 }}>
//                             <AcheivenmentVsTarget
//                                 achievement={achievementData.achievement}
//                                 target={achievementData.target} />
//                         </div>

//                         <div style={{ flex: 1 }}>
//                             <FilterComponent
//                                 filters={filters}
//                                 onFilterChange={setFilters}
//                                 handleChange={handleChange} />
//                         </div>

//                         <div style={{ flexShrink: 0 }}>
//                             <ParticipantCount
//                                 selectedParticipants={participantData.selectedParticipants}
//                                 totalLimit={participantData.totalLimit} />
//                         </div>
//                     </div>

//                     {/* Main Data Table Display Section */}
//                     <div style={{ width: "100%", flex: 1, marginBottom: "60px" }}>
//                         {filters.participantType ? (
//                             <ParticipantTable
//                                 filters={filters}
//                                 handleChange={handleChange}
//                                 participantType={filters.participantType}
//                                 onSelectionChange={handleSelectionChange} />
//                         ) : (
//                             <div
//                                 style={{
//                                     textAlign: 'center',
//                                     padding: '40px',
//                                     color: '#8c8c8c',
//                                     border: '1px dashed #d9d9d9',
//                                     borderRadius: '8px',
//                                     marginTop: '20px'
//                                 }}
//                             >
//                                 Please select a Participant Type (Trainer or Beneficiary) to view the trainees list.
//                             </div>
//                         )}
//                     </div>

//                     {/* FLOATING ACTION BOTTOM BAR CONTAINER */}
//                     {/* {filters.participantType && (

//                         <button
//                             onClick={() => setIsPreviewOpen(true)}
//                             disabled={participantData.selectedParticipants === 0}
//                             style={{
//                                 background: participantData.selectedParticipants === 0 ? "#94a3b8" : "#2563eb",
//                                 color: "#ffffff",
//                                 padding: "10px 24px",
//                                 border: "none",
//                                 borderRadius: "6px",
//                                 fontWeight: "600",
//                                 fontSize: "14px",
//                                 cursor: participantData.selectedParticipants === 0 ? "not-allowed" : "pointer",
//                                 transition: "background 0.2s ease"
//                             }}
//                         >
//                             Confirm & Submit
//                         </button>

//                     )} */}

//                     {filters.participantType && (
//                         <div style={{
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             width: "100%",
//                             marginTop: "16px"
//                         }}>
//                             <button
//                                 onClick={() => setIsPreviewOpen(true)}
//                                 disabled={participantData.selectedParticipants === 0}
//                                 style={{
//                                     background: participantData.selectedParticipants === 0 ? "#94a3b8" : "#2563eb",
//                                     color: "#ffffff",
//                                     padding: "10px 24px",
//                                     border: "none",
//                                     borderRadius: "6px",
//                                     fontWeight: "600",
//                                     fontSize: "14px",
//                                     cursor: participantData.selectedParticipants === 0 ? "not-allowed" : "pointer",
//                                     transition: "background 0.2s ease"
//                                 }}
//                             >
//                                 Confirm & Submit
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* PREVIEW MODAL OVERLAY COMPONENT */}
//             {isPreviewOpen && (
//                 <div style={{
//                     position: "fixed",
//                     top: 0,
//                     left: 0,
//                     width: "100vw",
//                     height: "100vh",
//                     background: "rgba(15, 23, 42, 0.6)",
//                     backdropFilter: "blur(4px)",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     zIndex: 1000
//                 }}>
//                     <div style={{
//                         background: "#ffffff",
//                         width: "100%",
//                         maxWidth: "540px",
//                         borderRadius: "12px",
//                         boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
//                         padding: "24px",
//                         animation: "fadeIn 0.2s ease"
//                     }}>
//                         {/* Modal Top Header Bar */}
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
//                             <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>Batch Preview Details</h3>
//                             <button
//                                 onClick={() => setIsPreviewOpen(false)}
//                                 style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         {/* Modal Body Info Stack Fields */}
//                         <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "10px 14px", borderRadius: "6px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>Selected Trainees Count:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>{participantData.selectedParticipants} Trainees</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Training Theme:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600", textAlign: "right" }}>{filters.trainingTheme || "Not Specified"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Selected Training Center:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.trainingCenter || "Main Academic Hub Center"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Financial Year:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.financialYear || "Not Specified"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Scheduled Batch Dates:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>
//                                     {filters.startDate ? `${filters.startDate} to ${filters.endDate || 'N/A'}` : "Dates Not Selected"}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Informative Help Context Box */}
//                         <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "10px 14px", borderRadius: "4px", marginBottom: "24px" }}>
//                             <p style={{ margin: 0, fontSize: "12px", color: "#1e3a8a", lineHeight: "1.5" }}>
//                                 * Clicking <strong>Confirm & Save</strong> preserves this operational data buffer block status as a draft file instance to prevent losing pipeline changes.
//                             </p>
//                         </div>

//                         {/* Modal Actions Footer Bar Buttons */}
//                         <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
//                             <button
//                                 onClick={() => setIsPreviewOpen(false)}
//                                 style={{
//                                     background: "#ffffff",
//                                     border: "1px solid #cbd5e1",
//                                     color: "#475569",
//                                     padding: "8px 16px",
//                                     borderRadius: "6px",
//                                     fontWeight: "500",
//                                     fontSize: "14px",
//                                     cursor: "pointer"
//                                 }}
//                             >
//                                 Back to Edit
//                             </button>
//                             <button
//                                 onClick={handleConfirmAndSave}
//                                 style={{
//                                     background: "#16a34a",
//                                     border: "none",
//                                     color: "#ffffff",
//                                     padding: "8px 20px",
//                                     borderRadius: "6px",
//                                     fontWeight: "600",
//                                     fontSize: "14px",
//                                     cursor: "pointer"
//                                 }}
//                             >
//                                 Confirm & Save (Draft)
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AssemblerDashboardBatchCreator;


// import React, { useEffect, useState, useCallback } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";
// import TmsLeftNav from "../layout/tms_LeftNav";
// import Header from "../layout/header";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         trainingPlanDays: "",
//         participantType: "",
//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",
//         searchValue: "",
//         startDate: "",
//         endDate: "",
//         trainingCenter: "",
//     });

//     const [achievementData, setAchievementData] = useState({ achievement: 0, target: 0 });
//     const [participantData, setParticipantData] = useState({ selectedParticipants: 0, totalLimit: 0 });
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================
//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD DYNAMICS
//     // ===========================
//     useEffect(() => {
//         if (filters.financialYear && filters.trainingTheme && filters.trainingPlan) {
//             setAchievementData({ achievement: 285, target: 440 });
//         } else {
//             setAchievementData({ achievement: 0, target: 0 });
//         }
//     }, [filters.financialYear, filters.trainingTheme, filters.trainingPlan]);

//     // ===========================
//     // PARTICIPANT LIMIT DYNAMICS
//     // ===========================
//     useEffect(() => {
//         if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
//             setParticipantData((prev) => ({
//                 ...prev,
//                 totalLimit: 40,
//             }));
//         } else {
//             setParticipantData({ selectedParticipants: 0, totalLimit: 0 });
//         }
//     }, [filters.participantType]);

//     // ===========================
//     // SELECTION UPDATE HANDLER
//     // ===========================
//     const handleSelectionChange = useCallback((count) => {
//         setParticipantData((prev) => ({
//             ...prev,
//             selectedParticipants: count,
//         }));
//     }, []);

//     // ===========================
//     // CONFIRM & SAVE SUBMITTER
//     // ===========================
//     const handleConfirmAndSave = () => {
//         const batchPayload = {
//             selectedTraineesCount: participantData.selectedParticipants,
//             trainingTheme: filters.trainingTheme || "Not Selected",
//             trainingCenter: filters.trainingCenter || "Default Center - Hall A",
//             financialYear: filters.financialYear || "Not Selected",
//             dates: {
//                 start: filters.startDate || "Not Set",
//                 end: filters.endDate || "Not Set"
//             },
//             status: "Draft"
//         };

//         localStorage.setItem("tms_batch_draft", JSON.stringify({ filters, participantData }));
//         alert("Progress successfully synchronized! The batch state has been saved as a draft.");
//         setIsPreviewOpen(false);
//     };

//     return (
//         <>
//             <Header />
//             <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
//                 <TmsLeftNav />

//                 <div style={{
//                     flex: 1,
//                     minWidth: 0,
//                     backgroundColor: "#ffffff",
//                     borderRadius: "16px",
//                     padding: "24px",
//                     margin: "24px",
//                     boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
//                     display: "flex",
//                     flexDirection: "column",
//                 }}>

//                     {/* Top Panel - Stats Indicators Grid */}
//                     <div style={{
//                         display: "grid",
//                         gridTemplateColumns: "auto 1fr auto",
//                         alignItems: "stretch",
//                         gap: "16px",
//                         marginBottom: "24px",
//                         width: "100%",
//                     }}>
//                         <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
//                             <AcheivenmentVsTarget achievement={achievementData.achievement} target={achievementData.target} />
//                         </div>

//                         <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center" }}>
//                             <FilterComponent filters={filters} onFilterChange={setFilters} handleChange={handleChange} />
//                         </div>

//                         <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
//                             <ParticipantCount selectedParticipants={participantData.selectedParticipants} totalLimit={participantData.totalLimit} />
//                         </div>
//                     </div>

//                     {/* Operational Parameter Safeguard Notice Banner */}
//                     {(!filters.financialYear || !filters.trainingPlan || !filters.participantType) && (
//                         <div style={{
//                             backgroundColor: "#fffbeb",
//                             border: "1px solid #fef3c7",
//                             borderRadius: "8px",
//                             padding: "14px 16px",
//                             marginBottom: "20px",
//                             color: "#b45309",
//                             fontSize: "14px",
//                             fontWeight: "500"
//                         }}>
//                             💡 <strong>Required Configurations Missing:</strong> Please select a <strong>Financial Year</strong>, <strong>Training Plan</strong>, and <strong>Participant Type</strong> to extract eligible workspace data layers.
//                         </div>
//                     )}

//                     {/* Main Display Selection Table Element */}
//                     <div style={{ width: "100%", flex: 1, marginBottom: "20px" }}>
//                         {filters.participantType ? (
//                             <ParticipantTable
//                                 filters={filters}
//                                 handleChange={handleChange}
//                                 onSelectionChange={handleSelectionChange}
//                             />
//                         ) : (
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '60px 20px',
//                                 color: '#94a3b8',
//                                 border: '2px dashed #cbd5e1',
//                                 borderRadius: '12px',
//                                 backgroundColor: '#f8fafc'
//                             }}>
//                                 Selection grid placeholder. Choose configuration parameters on the selection deck above to view data rows.
//                             </div>
//                         )}
//                     </div>

//                     {/* Bottom Execution Layout Action Row Bar Wrapper */}
//                     {filters.participantType && (
//                         <div style={{
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             width: "100%",
//                             paddingTop: "16px",
//                             borderTop: "1px solid #f1f5f9"
//                         }}>
//                             <button
//                                 onClick={() => setIsPreviewOpen(true)}
//                                 disabled={participantData.selectedParticipants === 0}
//                                 style={{
//                                     background: participantData.selectedParticipants === 0 ? "#cbd5e1" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
//                                     color: participantData.selectedParticipants === 0 ? "#94a3b8" : "#ffffff",
//                                     padding: "12px 32px",
//                                     border: "none",
//                                     borderRadius: "8px",
//                                     fontWeight: "600",
//                                     fontSize: "14px",
//                                     boxShadow: participantData.selectedParticipants === 0 ? "none" : "0 4px 12px rgba(37, 99, 235, 0.15)",
//                                     cursor: participantData.selectedParticipants === 0 ? "not-allowed" : "pointer",
//                                     transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
//                                 }}
//                             >
//                                 Confirm & Submit Batch
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* PREVIEW CONFIGURATION OVERLAY MODAL */}
//             {isPreviewOpen && (
//                 <div style={{
//                     position: "fixed",
//                     top: 0,
//                     left: 0,
//                     width: "100vw",
//                     height: "100vh",
//                     background: "rgba(15, 23, 42, 0.5)",
//                     backdropFilter: "blur(4px)",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     zIndex: 1000
//                 }}>
//                     <div style={{
//                         background: "#ffffff",
//                         width: "100%",
//                         maxWidth: "540px",
//                         borderRadius: "16px",
//                         boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
//                         padding: "32px",
//                         border: "1px solid #e2e8f0"
//                     }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
//                             <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Batch Processing Details Preview</h3>
//                             <button
//                                 onClick={() => setIsPreviewOpen(false)}
//                                 style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94a3b8" }}
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 14px", borderRadius: "8px" }}>
//                                 <span style={{ fontSize: "14px", color: "#166534", fontWeight: "600" }}>Selected Targets Pool:</span>
//                                 <span style={{ fontSize: "14px", color: "#14532d", fontWeight: "800" }}>{participantData.selectedParticipants} Trainees</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Training Theme:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600", textAlign: "right" }}>{filters.trainingTheme || "Not Specified"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Selected Training Center:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.trainingCenter || "Main Academic Hub Center"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Financial Year:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.financialYear || "Not Specified"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Scheduled Batch Dates:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>
//                                     {filters.startDate ? `${filters.startDate} to ${filters.endDate || 'N/A'}` : "Dates Not Selected"}
//                                 </span>
//                             </div>
//                         </div>

//                         <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "12px", borderRadius: "6px", marginBottom: "24px" }}>
//                             <p style={{ margin: 0, fontSize: "12.5px", color: "#1e40af", lineHeight: "1.5" }}>
//                                 * Clicking <strong>Confirm & Save</strong> preserves workspace target structures into a persistent local storage configuration draft layer.
//                             </p>
//                         </div>

//                         <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
//                             <button
//                                 onClick={() => setIsPreviewOpen(false)}
//                                 style={{
//                                     background: "#ffffff",
//                                     border: "1px solid #cbd5e1",
//                                     color: "#475569",
//                                     padding: "10px 18px",
//                                     borderRadius: "8px",
//                                     fontWeight: "500",
//                                     fontSize: "14px",
//                                     cursor: "pointer"
//                                 }}
//                             >
//                                 Back to Edit
//                             </button>
//                             <button
//                                 onClick={handleConfirmAndSave}
//                                 style={{
//                                     background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
//                                     border: "none",
//                                     color: "#ffffff",
//                                     padding: "10px 24px",
//                                     borderRadius: "8px",
//                                     fontWeight: "600",
//                                     fontSize: "14px",
//                                     cursor: "pointer"
//                                 }}
//                             >
//                                 Confirm & Save Draft
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AssemblerDashboardBatchCreator;

// import React, { useEffect, useState, useCallback } from "react";
// import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
// import ParticipantCount from "./ParticipantCount";
// import FilterComponent from "./FilterComponent";
// import ParticipantTable from "./TraineesDisplayTable";
// import TmsLeftNav from "../layout/tms_LeftNav";
// import Header from "../layout/header";
// import { TMS_API } from "../../../api/axios";

// const AssemblerDashboardBatchCreator = () => {
//     const [filters, setFilters] = useState({
//         financialYear: "",
//         trainingTheme: "",
//         trainingPlan: "",
//         trainingPlanDays: "",
//         participantType: "",
//         gender: "",
//         designation: "",
//         religion: "",
//         socialCategory: "",
//         pldStatus: "",
//         panchayat: "",
//         village: "",
//         ageRange: "",
//         searchValue: "",
//         startDate: "",
//         endDate: "",
//         trainingCenter: "",
//     });

//     const [achievementData, setAchievementData] = useState({ achievement: 0, target: 0 });
//     // const [participantData, setParticipantData] = useState({ selectedParticipants: 0, totalLimit: 0 });
//     const [participantData, setParticipantData] = useState({
//         selectedParticipants: [],
//         totalLimit: 0,
//     });
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false); // API सबमिशन के लिए लोडिंग स्टेट

//     // ===========================
//     // FILTER CHANGE HANDLER
//     // ===========================
//     const handleChange = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     // ===========================
//     // ACHIEVEMENT CARD DYNAMICS
//     // ===========================
//     useEffect(() => {
//         if (filters.financialYear && filters.trainingTheme && filters.trainingPlan) {
//             setAchievementData({ achievement: 285, target: 440 });
//         } else {
//             setAchievementData({ achievement: 0, target: 0 });
//         }
//     }, [filters.financialYear, filters.trainingTheme, filters.trainingPlan]);

//     // ===========================
//     // PARTICIPANT LIMIT DYNAMICS
//     // ===========================
//     useEffect(() => {
//         if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
//             setParticipantData((prev) => ({
//                 ...prev,
//                 totalLimit: 40,
//             }));
//         } else {
//             setParticipantData({ selectedParticipants: 0, totalLimit: 0 });
//         }
//     }, [filters.participantType]);

//     // ===========================
//     // SELECTION UPDATE HANDLER
//     // ===========================
//     // const handleSelectionChange = useCallback((count) => {
//     //     setParticipantData((prev) => ({
//     //         ...prev,
//     //         selectedParticipants: count,
//     //     }));
//     // }, []);

//     const handleSelectionChange = useCallback((selectedIds) => {
//         setParticipantData((prev) => ({
//             ...prev,
//             selectedParticipants: selectedIds,
//         }));
//     }, []);


//     // ===========================
//     // LIVE API SUBMISSION HANDLER (MODAL ACTION)
//     // ===========================
//     const handleConfirmAndSave = async () => {
//         setIsSubmitting(true);

//         // API के लिए पेलोड स्ट्रक्चर तैयार करना
//         const batchPayload = {
//             financial_year: filters.financialYear,
//             training_theme: filters.trainingTheme,
//             training_plan_id: filters.trainingPlan,
//             participant_type: filters.participantType?.toLowerCase(),
//             start_date: filters.startDate || null,
//             end_date: filters.endDate || null,
//             training_center: filters.trainingCenter || "Default Center - Hall A",
//             total_selected_trainees: participantData.selectedParticipants,
//             filters_context: filters
//         };

//         // FIX: Displaying the compiled API payload on the console
//         console.log("Submitting Batch Payload Context:", batchPayload);

//         try {
//             // 1. लाइव सर्वर पर बैच क्रिएट करने के लिए API हिट
//             const response = await TMS_API.batchCreator.create(batchPayload);

//             // 2. बैकअप के लिए लोकल स्टोरेज में भी ड्राफ्ट सिंक करना
//             localStorage.setItem("tms_batch_draft", JSON.stringify({ filters, participantData }));

//             alert("Batch successfully created and synchronized with the server!");
//             setIsPreviewOpen(false);

//         } catch (error) {
//             console.error("Error creating batch via API:", error);
//             alert(error?.response?.data?.message || "Failed to create batch on server. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
//                 <TmsLeftNav />

//                 <div style={{
//                     flex: 1,
//                     minWidth: 0,
//                     backgroundColor: "#ffffff",
//                     borderRadius: "16px",
//                     padding: "24px",
//                     margin: "24px",
//                     boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
//                     display: "flex",
//                     flexDirection: "column",
//                 }}>

//                     {/* Top Panel - Stats Indicators Grid */}
//                     <div style={{
//                         display: "grid",
//                         gridTemplateColumns: "auto 1fr auto",
//                         alignItems: "stretch",
//                         gap: "16px",
//                         marginBottom: "24px",
//                         width: "100%",
//                     }}>
//                         <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
//                             <AcheivenmentVsTarget achievement={achievementData.achievement} target={achievementData.target} />
//                         </div>

//                         <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center" }}>
//                             <FilterComponent filters={filters} onFilterChange={setFilters} handleChange={handleChange} />
//                         </div>

//                         <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
//                             <ParticipantCount selectedParticipants={participantData.selectedParticipants.length} totalLimit={participantData.totalLimit} />
//                         </div>
//                     </div>

//                     {/* Operational Parameter Safeguard Notice Banner */}
//                     {(!filters.financialYear || !filters.trainingPlan || !filters.participantType) && (
//                         <div style={{
//                             backgroundColor: "#fffbeb",
//                             border: "1px solid #fef3c7",
//                             borderRadius: "8px",
//                             padding: "14px 16px",
//                             marginBottom: "20px",
//                             color: "#b45309",
//                             fontSize: "14px",
//                             fontWeight: "500"
//                         }}>
//                             💡 <strong>Required Configurations Missing:</strong> Please select a <strong>Financial Year</strong>, <strong>Training Plan</strong>, and <strong>Participant Type</strong> to extract eligible workspace data layers.
//                         </div>
//                     )}

//                     {/* Main Display Selection Table Element */}
//                     <div style={{ width: "100%", flex: 1, marginBottom: "20px" }}>
//                         {filters.participantType ? (
//                             <ParticipantTable
//                                 filters={filters}
//                                 handleChange={handleChange}
//                                 onSelectionChange={handleSelectionChange}
//                             />
//                         ) : (
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '60px 20px',
//                                 color: '#94a3b8',
//                                 border: '2px dashed #cbd5e1',
//                                 borderRadius: '12px',
//                                 backgroundColor: '#f8fafc'
//                             }}>
//                                 Selection grid placeholder. Choose configuration parameters on the selection deck above to view data rows.
//                             </div>
//                         )}
//                     </div>

//                     {/* Bottom Execution Layout Action Row Bar Wrapper */}
//                     {filters.participantType && (
//                         <div style={{
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             width: "100%",
//                             paddingTop: "16px",
//                             borderTop: "1px solid #f1f5f9"
//                         }}>
//                             <button
//                                 onClick={() => setIsPreviewOpen(true)}
//                                 disabled={participantData.selectedParticipants.length === 0}
//                                 style={{
//                                     background: participantData.selectedParticipants === 0 ? "#cbd5e1" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
//                                     color: participantData.selectedParticipants === 0 ? "#94a3b8" : "#ffffff",
//                                     padding: "12px 32px",
//                                     border: "none",
//                                     borderRadius: "8px",
//                                     fontWeight: "600",
//                                     fontSize: "14px",
//                                     boxShadow: participantData.selectedParticipants === 0 ? "none" : "0 4px 12px rgba(37, 99, 235, 0.15)",
//                                     cursor: participantData.selectedParticipants === 0 ? "not-allowed" : "pointer",
//                                     transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
//                                 }}
//                             >
//                                 Confirm & Submit Batch
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* PREVIEW CONFIGURATION OVERLAY MODAL */}
//             {isPreviewOpen && (
//                 <div style={{
//                     position: "fixed",
//                     top: 0,
//                     left: 0,
//                     width: "100vw",
//                     height: "100vh",
//                     background: "rgba(15, 23, 42, 0.5)",
//                     backdropFilter: "blur(4px)",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     zIndex: 1000
//                 }}>
//                     <div style={{
//                         background: "#ffffff",
//                         width: "100%",
//                         maxWidth: "540px",
//                         borderRadius: "16px",
//                         boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
//                         padding: "32px",
//                         border: "1px solid #e2e8f0"
//                     }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
//                             <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Batch Processing Details Preview</h3>
//                             <button
//                                 onClick={() => setIsPreviewOpen(false)}
//                                 disabled={isSubmitting}
//                                 style={{ background: "none", border: "none", fontSize: "24px", cursor: isSubmitting ? "not-allowed" : "pointer", color: "#94a3b8" }}
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 14px", borderRadius: "8px" }}>
//                                 <span style={{ fontSize: "14px", color: "#166534", fontWeight: "600" }}>Selected Targets Pool:</span>
//                                 <span style={{ fontSize: "14px", color: "#14532d", fontWeight: "800" }}>{participantData.selectedParticipants.length} Trainees</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Training Theme:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600", textAlign: "right" }}>{filters.trainingTheme || "Not Specified"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Selected Training Center:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.trainingCenter || "Main Academic Hub Center"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Financial Year:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.financialYear || "Not Specified"}</span>
//                             </div>

//                             <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
//                                 <span style={{ fontSize: "14px", color: "#64748b" }}>Scheduled Batch Dates:</span>
//                                 <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>
//                                     {filters.startDate ? `${filters.startDate} to ${filters.endDate || 'N/A'}` : "Dates Not Selected"}
//                                 </span>
//                             </div>
//                         </div>

//                         <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "12px", borderRadius: "6px", marginBottom: "24px" }}>
//                             <p style={{ margin: 0, fontSize: "12.5px", color: "#1e40af", lineHeight: "1.5" }}>
//                                 * Clicking <strong>Confirm & Save</strong> will permanently transmit this setup configuration and generate a new live active batch.
//                             </p>
//                         </div>

//                         <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
//                             <button
//                                 onClick={() => setIsPreviewOpen(false)}
//                                 disabled={isSubmitting}
//                                 style={{
//                                     background: "#ffffff",
//                                     border: "1px solid #cbd5e1",
//                                     color: "#475569",
//                                     padding: "10px 18px",
//                                     borderRadius: "8px",
//                                     fontWeight: "500",
//                                     fontSize: "14px",
//                                     cursor: isSubmitting ? "not-allowed" : "pointer"
//                                 }}
//                             >
//                                 Back to Edit
//                             </button>
//                             <button
//                                 onClick={handleConfirmAndSave}
//                                 disabled={isSubmitting}
//                                 style={{
//                                     background: isSubmitting ? "#cbd5e1" : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
//                                     border: "none",
//                                     color: "#ffffff",
//                                     padding: "10px 24px",
//                                     borderRadius: "8px",
//                                     fontWeight: "600",
//                                     fontSize: "14px",
//                                     cursor: isSubmitting ? "not-allowed" : "pointer"
//                                 }}
//                             >
//                                 {isSubmitting ? "Processing..." : "Confirm & Save Draft"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AssemblerDashboardBatchCreator;


import React, { useEffect, useState, useCallback } from "react";
import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
import ParticipantCount from "./ParticipantCount";
import FilterComponent from "./FilterComponent";
import ParticipantTable from "./TraineesDisplayTable";
import TmsLeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";
import { TMS_API } from "../../../api/axios";
import { getUser } from "../../../utils/storage";

const AssemblerDashboardBatchCreator = () => {
    const [filters, setFilters] = useState({
        financialYear: "",
        trainingTheme: "",
        trainingPlan: "",
        trainingPlanDays: "",
        participantType: "",
        gender: "",
        designation: "",
        religion: "",
        socialCategory: "",
        pldStatus: "",
        panchayat: "",
        village: "",
        ageRange: "",
        searchValue: "",
        startDate: "",
        endDate: "",
        trainingCenter: "",
        block: "", // Make sure your context fills this
        districtId: "",   // <-- ADD THIS
    });

    // Strategy Mode Switcher State: "SEPARATE" or "COMBINED"
    const [batchType, setBatchType] = useState("SEPARATE");
    const [achievementData, setAchievementData] = useState({ achievement: 0, target: 0 });

    // Store selected row objects containing details like: { id, block_id, tr_id }
    const [selectedTrainees, setSelectedTrainees] = useState([]);
    const [participantData, setParticipantData] = useState({
        selectedParticipants: [],
        totalLimit: 0,
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = getUser();
    // ===========================
    // FILTER CHANGE HANDLER
    // ===========================
    const handleChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // ===========================
    // ACHIEVEMENT CARD DYNAMICS
    // ===========================
    useEffect(() => {
        if (filters.financialYear && filters.trainingTheme && filters.trainingPlan) {
            setAchievementData({ achievement: 285, target: 440 });
        } else {
            setAchievementData({ achievement: 0, target: 0 });
        }
    }, [filters.financialYear, filters.trainingTheme, filters.trainingPlan]);

    // ===========================
    // PARTICIPANT LIMIT DYNAMICS
    // ===========================
    useEffect(() => {
        if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
            setParticipantData((prev) => ({
                ...prev,
                totalLimit: 40,
            }));
        } else {
            setParticipantData({ selectedParticipants: [], totalLimit: 0 });
        }
    }, [filters.participantType]);

    // ===========================
    // SELECTION UPDATE HANDLER
    // ===========================
    // Make sure your ParticipantTable passes down row metadata objects: [{id: 101, block_id: 313581, tr_id: 40}]
    const handleSelectionChange = useCallback((selectedRowsOrIds) => {
        // Safe check if array is primitive IDs or complete row data records
        const standardizedRows = selectedRowsOrIds.map(item =>
            typeof item === 'object' ? item : { id: item, block_id: Number(filters.block || 313581), tr_id: 40 }
        );

        setSelectedTrainees(standardizedRows);
        setParticipantData((prev) => ({
            ...prev,
            selectedParticipants: standardizedRows.map(r => r.id),
        }));
    }, [filters.block]);


    // ===========================
    // LIVE API SUBMISSION HANDLER
    // ===========================
    // const handleConfirmAndSave = async () => {
    //     setIsSubmitting(true);

    //     // Core base layout required fields
    //     const basePayload = {
    //         financial_year: filters.financialYear || "2026-27",
    //         participant_type: filters.participantType ? filters.participantType.toUpperCase() : "BENEFICIARY",
    //         batch_type: batchType,
    //         training_plan_id: Number(filters.trainingPlan) || 5,
    //         district_tp_user_id: user.id, // Static context or map dynamically if needed
    //         centre_id: userInfo?.centre_id,
    //         district_id: userInfo?.district_id,
    //         start_date: filters.startDate || "2026-07-10",
    //         end_date: filters.endDate || "2026-07-15",
    //         status: "SCHEDULED"
    //     };

    //     let finalPayload = {};

    //     if (batchType === "SEPARATE") {
    //         finalPayload = {
    //             ...basePayload,
    //             block_id: Number(filters.block) || (selectedTrainees[0]?.block_id) || 313581,
    //             participant_ids: selectedTrainees.map(t => t.id)
    //         };
    //     } else {
    //         // "COMBINED" Mode: Dynamically group selected entries by block_id & tr_id
    //         const blockGroupMap = {};

    //         selectedTrainees.forEach((trainee) => {
    //             const bId = trainee.block_id || Number(filters.block) || 313581;
    //             const trId = trainee.tr_id || 40;

    //             if (!blockGroupMap[bId]) {
    //                 blockGroupMap[bId] = {};
    //             }
    //             if (!blockGroupMap[bId][trId]) {
    //                 blockGroupMap[bId][trId] = [];
    //             }
    //             blockGroupMap[bId][trId].push(trainee.id);
    //         });

    //         // Convert map setup back into your exact backend schema structure
    //         const blocksArray = Object.keys(blockGroupMap).map((bId) => ({
    //             block_id: Number(bId),
    //             training_requests: Object.keys(blockGroupMap[bId]).map((trId) => ({
    //                 tr_id: Number(trId),
    //                 participant_ids: blockGroupMap[bId][trId]
    //             }))
    //         }));

    //         finalPayload = {
    //             ...basePayload,
    //             blocks: blocksArray
    //         };
    //     }

    //     console.log("Submitting Perfected Batch Payload Context:", finalPayload);

    //     try {
    //         const response = await TMS_API.batchCreator.create(finalPayload);
    //         localStorage.setItem("tms_batch_draft", JSON.stringify({ filters, participantData, batchType }));
    //         alert("Batch successfully created and synchronized with the server!");
    //         setIsPreviewOpen(false);
    //     } catch (error) {
    //         console.error("Error creating batch via API:", error);
    //         alert(error?.response?.data?.message || "Failed to create batch on server. Please try again.");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    useEffect(() => {
        console.log("Parent filters:", filters);
    }, [filters]);


    console.log("filters =", filters);
    console.log("filters.districtId =", filters.districtId);
    console.log("Number(filters.districtId) =", Number(filters.districtId));

    // const handleConfirmAndSave = async () => {
    //     setIsSubmitting(true);

    //     const basePayload = {
    //         financial_year: filters.financialYear || "2026-27",
    //         participant_type: filters.participantType
    //             ? filters.participantType.toUpperCase()
    //             : "BENEFICIARY",
    //         batch_type: batchType,
    //         training_plan_id: Number(filters.trainingPlan) || 5,
    //         district_tp_user_id: user?.id,
    //         centre_id: Number(filters.trainingCenter),
    //         district_id: Number(filters.districtId),
    //         start_date: filters.startDate || "2026-07-10",
    //         end_date: filters.endDate || "2026-07-15",
    //         status: "SCHEDULED",
    //     };

    const handleConfirmAndSave = async (status = "SCHEDULED") => {
        setIsSubmitting(true);

        const basePayload = {
            financial_year: filters.financialYear || "2026-27",
            participant_type: filters.participantType
                ? filters.participantType.toUpperCase()
                : "BENEFICIARY",
            batch_type: batchType,
            training_plan_id: Number(filters.trainingPlan) || 5,
            district_tp_user_id: user?.id,
            centre_id: Number(filters.trainingCenter),
            district_id: Number(filters.districtId),
            start_date: filters.startDate || "2026-07-10",
            end_date: filters.endDate || "2026-07-15",
            status,   // <-- Dynamic
        };

        console.clear();

        console.log("======================================");
        console.log("CONFIRM & SAVE CLICKED");
        console.log("======================================");

        console.log("USER");
        console.log(user);

        console.log("USER INFO");
        console.log(user);

        console.log("FILTERS");
        console.table(filters);

        console.log("SELECTED TRAINEES");
        console.table(selectedTrainees);

        console.log("BASE PAYLOAD");
        console.log(basePayload);

        let finalPayload = {};

        // ============================
        // SEPARATE BATCH PAYLOAD
        // ============================
        if (batchType === "SEPARATE") {
            finalPayload = {
                ...basePayload,
                block_id:
                    Number(filters.block) ||
                    selectedTrainees[0]?.block_id,
                participant_ids: selectedTrainees.map((t) => t.id),
            };
        }

        // ============================
        // COMBINED BATCH PAYLOAD
        // ============================
        else {
            const blockGroupMap = {};

            selectedTrainees.forEach((trainee) => {
                const blockId =
                    trainee.block_id ||
                    Number(filters.block);

                const trId =
                    trainee.tr_id || 40;

                if (!blockGroupMap[blockId]) {
                    blockGroupMap[blockId] = {};
                }

                if (!blockGroupMap[blockId][trId]) {
                    blockGroupMap[blockId][trId] = [];
                }

                blockGroupMap[blockId][trId].push(trainee.id);
            });

            finalPayload = {
                ...basePayload,
                blocks: Object.keys(blockGroupMap).map((blockId) => ({
                    block_id: Number(blockId),
                    training_requests: Object.keys(blockGroupMap[blockId]).map(
                        (trId) => ({
                            tr_id: Number(trId),
                            participant_ids: blockGroupMap[blockId][trId],
                        })
                    ),
                })),
            };
        }

        console.log("FINAL PAYLOAD");
        console.log(finalPayload);

        console.log("FINAL PAYLOAD JSON");
        console.log(JSON.stringify(finalPayload, null, 2));

        console.log("======================================");
        console.log("SENDING PAYLOAD TO API...");
        console.log("======================================");

        try {
            const response = await TMS_API.batchCreator.create(finalPayload);

            console.log("API RESPONSE");
            console.log(response);

            console.log("RESPONSE DATA");
            console.log(response.data);

            localStorage.setItem(
                "tms_batch_draft",
                JSON.stringify({
                    filters,
                    participantData,
                    batchType,
                })
            );

            alert("Batch successfully created.");
        } catch (error) {
            console.log("API ERROR");
            console.log(error);

            console.log("ERROR RESPONSE");
            console.log(error.response);

            console.log("ERROR DATA");
            console.log(error.response?.data);

            alert(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to create batch."
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Header />
            <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
                <TmsLeftNav />

                <div style={{
                    flex: 1,
                    minWidth: 0,
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px",
                    margin: "24px",
                    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                }}>

                    {/* Top Panel - Stats Indicators Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        alignItems: "stretch",
                        gap: "16px",
                        marginBottom: "24px",
                        width: "100%",
                    }}>
                        <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <AcheivenmentVsTarget achievement={achievementData.achievement} target={achievementData.target} />
                        </div>

                        <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
                            {/* Strategy Select Dropdown Switch */}
                            {/* <FilterComponent filters={filters} onFilterChange={setFilters} handleChange={handleChange} /> */}
                            <FilterComponent
                                filters={filters}
                                handleChange={handleChange}
                            />
                        </div>

                        <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <ParticipantCount selectedParticipants={participantData.selectedParticipants.length} totalLimit={participantData.totalLimit} />
                        </div>
                    </div>

                    {/* Operational Parameter Safeguard Notice Banner */}
                    {(!filters.financialYear || !filters.trainingPlan || !filters.participantType) && (
                        <div style={{
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fef3c7",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            marginBottom: "20px",
                            color: "#b45309",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}>
                            💡 <strong>Required Configurations Missing:</strong> Please select a <strong>Financial Year</strong>, <strong>Training Plan</strong>, and <strong>Participant Type</strong> to extract eligible workspace data layers.
                        </div>
                    )}

                    {/* Main Display Selection Table Element */}
                    <div style={{ width: "100%", flex: 1, marginBottom: "20px" }}>
                        {filters.participantType ? (
                            <ParticipantTable
                                filters={filters}
                                handleChange={handleChange}
                                onSelectionChange={handleSelectionChange}
                            />
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#94a3b8',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '12px',
                                backgroundColor: '#f8fafc'
                            }}>
                                Select Apply Filter
                            </div>
                        )}
                    </div>

                    {/* Bottom Execution Layout Action Row Bar Wrapper */}
                    {filters.participantType && (
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                            paddingTop: "16px",
                            borderTop: "1px solid #f1f5f9"
                        }}>
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                disabled={participantData.selectedParticipants.length === 0}
                                style={{
                                    background: participantData.selectedParticipants.length === 0 ? "#cbd5e1" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                    color: participantData.selectedParticipants.length === 0 ? "#94a3b8" : "#ffffff",
                                    padding: "12px 32px",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    boxShadow: participantData.selectedParticipants.length === 0 ? "none" : "0 4px 12px rgba(37, 99, 235, 0.15)",
                                    cursor: participantData.selectedParticipants.length === 0 ? "not-allowed" : "pointer",
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                            >
                                Confirm & Submit ({batchType}) Batch
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW CONFIGURATION OVERLAY MODAL */}
            {isPreviewOpen && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(15, 23, 42, 0.5)",
                    backdropFilter: "blur(4px)",
                    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                    <div style={{
                        background: "#ffffff",
                        width: "100%",
                        maxWidth: "540px",
                        borderRadius: "16px",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                        padding: "32px",
                        border: "1px solid #e2e8f0"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Batch Processing Details Preview</h3>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                disabled={isSubmitting}
                                style={{ background: "none", border: "none", fontSize: "24px", cursor: isSubmitting ? "not-allowed" : "pointer", color: "#94a3b8" }}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 14px", borderRadius: "8px" }}>
                                <span style={{ fontSize: "14px", color: "#166534", fontWeight: "600" }}>Selected Strategy:</span>
                                <span style={{ fontSize: "14px", color: "#14532d", fontWeight: "800" }}>{batchType} Batch</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Selected Targets Pool:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{participantData.selectedParticipants.length} Trainees</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Training Theme:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600", textAlign: "right" }}>{filters.trainingTheme || "Not Specified"}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Financial Year:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.financialYear || "Not Specified"}</span>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                disabled={isSubmitting}
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    color: "#475569",
                                    padding: "10px 18px",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    cursor: isSubmitting ? "not-allowed" : "pointer"
                                }}
                            >
                                Back to Edit
                            </button>
                            <button
                                onClick={() => handleConfirmAndSave("DRAFT")}
                                disabled={isSubmitting}
                                style={{
                                    background: "#f59e0b",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 24px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={() => handleConfirmAndSave("PENDING")}
                                disabled={isSubmitting}
                                style={{
                                    background: isSubmitting
                                        ? "#cbd5e1"
                                        : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                                    border: "none",
                                    color: "#ffffff",
                                    padding: "10px 24px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: isSubmitting ? "not-allowed" : "pointer",
                                }}
                            >
                                {isSubmitting ? "Processing..." : "Confirm & Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssemblerDashboardBatchCreator;