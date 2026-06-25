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


import React, { useEffect, useState } from "react";
import AcheivenmentVsTarget from "./AcheivenmentVsTarget";
import ParticipantCount from "./ParticipantCount";
import FilterComponent from "./FilterComponent";
import ParticipantTable from "./TraineesDisplayTable";

const AssemblerDashboardBatchCreator = () => {
    const [filters, setFilters] = useState({
        financialYear: "",
        trainingTheme: "",
        trainingPlan: "",

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
    });

    const [achievementData, setAchievementData] = useState({
        achievement: 0,
        target: 0,
    });

    const [participantData, setParticipantData] = useState({
        selectedParticipants: 0,
        totalLimit: 0,
    });

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
    // PARTICIPANT COUNT
    // ===========================

    useEffect(() => {
        if (filters.participantType === "Trainer") {
            setParticipantData({
                selectedParticipants: 20,
                totalLimit: 40,
            });
        } else if (filters.participantType === "Beneficiary") {
            setParticipantData({
                selectedParticipants: 28,
                totalLimit: 40,
            });
        } else {
            setParticipantData({
                selectedParticipants: 0,
                totalLimit: 0,
            });
        }
    }, [filters.participantType]);

    return (
        <div className="dashboard-page">
            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    minHeight: "calc(100vh - 120px)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        marginBottom: "16px",
                    }}
                >
                    <div style={{ flexShrink: 0 }}>
                        <AcheivenmentVsTarget
                            achievement={achievementData.achievement}
                            target={achievementData.target}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <FilterComponent
                            filters={filters}
                            onFilterChange={setFilters}
                            handleChange={handleChange} // Agar dynamic key change chahiye ho child mein
                        />
                    </div>

                    <div style={{ flexShrink: 0 }}>
                        <ParticipantCount
                            selectedParticipants={
                                participantData.selectedParticipants
                            }
                            totalLimit={participantData.totalLimit}
                        />
                    </div>
                </div>

                {/* Conditional Rendering: Table tabhi dikhegi jab type "Trainer" ya "Beneficiary" ho */}
                {filters.participantType ? (
                    <ParticipantTable
                        filters={filters}
                        handleChange={handleChange}
                        participantType={filters.participantType} // Table ke andar data filter karne ke liye useful rahega
                    />
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
        </div>
    );
};

export default AssemblerDashboardBatchCreator;