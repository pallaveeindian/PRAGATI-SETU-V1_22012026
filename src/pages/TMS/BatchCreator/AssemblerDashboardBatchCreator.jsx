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


import React, { useEffect, useState, useCallback } from "react";
import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
import ParticipantCount from "./ParticipantCount";
import FilterComponent from "./FilterComponent";
import ParticipantTable from "./TraineesDisplayTable";
import TmsLeftNav from "../layout/tms_LeftNav";
import Header from "../layout/header";

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
        trainingCenter: "", // Added placeholder for center details
    });

    const [achievementData, setAchievementData] = useState({
        achievement: 0,
        target: 0,
    });

    const [participantData, setParticipantData] = useState({
        selectedParticipants: 0,
        totalLimit: 0,
    });

    // Modal view status visibility toggle variables
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    // ACHIEVEMENT CARD
    // ===========================
    useEffect(() => {
        if (
            filters.financialYear &&
            filters.trainingTheme &&
            filters.trainingPlan
        ) {
            setAchievementData({
                achievement: 285,
                target: 440,
            });
        } else {
            setAchievementData({
                achievement: 0,
                target: 0,
            });
        }
    }, [
        filters.financialYear,
        filters.trainingTheme,
        filters.trainingPlan,
    ]);

    // ===========================
    // PARTICIPANT COUNT LIMIT INITIALIZATION
    // ===========================
    useEffect(() => {
        if (filters.participantType === "Trainer" || filters.participantType === "Beneficiary") {
            setParticipantData((prev) => ({
                ...prev,
                totalLimit: 40,
            }));
        } else {
            setParticipantData({
                selectedParticipants: 0,
                totalLimit: 0,
            });
        }
    }, [filters.participantType]);

    // ===========================
    // SELECTION UPDATE HANDLER
    // ===========================
    const handleSelectionChange = useCallback((count) => {
        setParticipantData((prev) => ({
            ...prev,
            selectedParticipants: count,
        }));
    }, []);

    // ===========================
    // CONFIRM & SAVE SUBMITTER
    // ===========================
    const handleConfirmAndSave = () => {
        // Prepare data state package payload context
        const batchPayload = {
            selectedTraineesCount: participantData.selectedParticipants,
            trainingTheme: filters.trainingTheme || "Not Selected",
            trainingCenter: filters.trainingCenter || "Default Center - Hall A",
            financialYear: filters.financialYear || "Not Selected",
            dates: {
                start: filters.startDate || "Not Set",
                end: filters.endDate || "Not Set"
            },
            status: "Draft"
        };

        console.log("Saving form state to local draft buffers...", batchPayload);

        // Simulating writing state downstream into a draft persistence engine
        localStorage.setItem("tms_batch_draft", JSON.stringify({ filters, participantData }));

        alert("Progress successfully synchronized! The batch state has been saved as a draft.");
        setIsPreviewOpen(false);
    };

    return (
        <>
            <Header />
            <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#f8fafc" }}>
                {/* Sidebar navigation panel */}
                <TmsLeftNav />

                {/* Main content view dashboard container */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "16px",
                        margin: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header row area (Metrics widgets + filters) */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "16px",
                            marginBottom: "16px",
                            width: "100%",
                        }}
                    >
                        <div style={{ flexShrink: 0 }}>
                            <AcheivenmentVsTarget
                                achievement={achievementData.achievement}
                                target={achievementData.target} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <FilterComponent
                                filters={filters}
                                onFilterChange={setFilters}
                                handleChange={handleChange} />
                        </div>

                        <div style={{ flexShrink: 0 }}>
                            <ParticipantCount
                                selectedParticipants={participantData.selectedParticipants}
                                totalLimit={participantData.totalLimit} />
                        </div>
                    </div>

                    {/* Main Data Table Display Section */}
                    <div style={{ width: "100%", flex: 1, marginBottom: "60px" }}>
                        {filters.participantType ? (
                            <ParticipantTable
                                filters={filters}
                                handleChange={handleChange}
                                participantType={filters.participantType}
                                onSelectionChange={handleSelectionChange} />
                        ) : (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#8c8c8c',
                                    border: '1px dashed #d9d9d9',
                                    borderRadius: '8px',
                                    marginTop: '20px'
                                }}
                            >
                                Please select a Participant Type (Trainer or Beneficiary) to view the trainees list.
                            </div>
                        )}
                    </div>

                    {/* FLOATING ACTION BOTTOM BAR CONTAINER */}
                    {/* {filters.participantType && (

                        <button
                            onClick={() => setIsPreviewOpen(true)}
                            disabled={participantData.selectedParticipants === 0}
                            style={{
                                background: participantData.selectedParticipants === 0 ? "#94a3b8" : "#2563eb",
                                color: "#ffffff",
                                padding: "10px 24px",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: participantData.selectedParticipants === 0 ? "not-allowed" : "pointer",
                                transition: "background 0.2s ease"
                            }}
                        >
                            Confirm & Submit
                        </button>

                    )} */}

                    {filters.participantType && (
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                            marginTop: "16px"
                        }}>
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                disabled={participantData.selectedParticipants === 0}
                                style={{
                                    background: participantData.selectedParticipants === 0 ? "#94a3b8" : "#2563eb",
                                    color: "#ffffff",
                                    padding: "10px 24px",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: participantData.selectedParticipants === 0 ? "not-allowed" : "pointer",
                                    transition: "background 0.2s ease"
                                }}
                            >
                                Confirm & Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW MODAL OVERLAY COMPONENT */}
            {isPreviewOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#ffffff",
                        width: "100%",
                        maxWidth: "540px",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                        padding: "24px",
                        animation: "fadeIn 0.2s ease"
                    }}>
                        {/* Modal Top Header Bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>Batch Preview Details</h3>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body Info Stack Fields */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "10px 14px", borderRadius: "6px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>Selected Trainees Count:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>{participantData.selectedParticipants} Trainees</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Training Theme:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600", textAlign: "right" }}>{filters.trainingTheme || "Not Specified"}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Selected Training Center:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.trainingCenter || "Main Academic Hub Center"}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Financial Year:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{filters.financialYear || "Not Specified"}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                                <span style={{ fontSize: "14px", color: "#64748b" }}>Scheduled Batch Dates:</span>
                                <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>
                                    {filters.startDate ? `${filters.startDate} to ${filters.endDate || 'N/A'}` : "Dates Not Selected"}
                                </span>
                            </div>
                        </div>

                        {/* Informative Help Context Box */}
                        <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "10px 14px", borderRadius: "4px", marginBottom: "24px" }}>
                            <p style={{ margin: 0, fontSize: "12px", color: "#1e3a8a", lineHeight: "1.5" }}>
                                * Clicking <strong>Confirm & Save</strong> preserves this operational data buffer block status as a draft file instance to prevent losing pipeline changes.
                            </p>
                        </div>

                        {/* Modal Actions Footer Bar Buttons */}
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    color: "#475569",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    cursor: "pointer"
                                }}
                            >
                                Back to Edit
                            </button>
                            <button
                                onClick={handleConfirmAndSave}
                                style={{
                                    background: "#16a34a",
                                    border: "none",
                                    color: "#ffffff",
                                    padding: "8px 20px",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: "pointer"
                                }}
                            >
                                Confirm & Save (Draft)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssemblerDashboardBatchCreator;