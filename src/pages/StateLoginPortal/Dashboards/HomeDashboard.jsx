// import React from "react";

// const Dashboard = () => {
//     return (
//         <>
//             <div className="home-dashboard">

//                 <h2 className="dashboard-title">
//                     State Dashboard Overview
//                 </h2>

//                 <div className="dashboard-grid">

//                     {/* Top Left */}
//                     <div className="dashboard-card">
//                         <h3>KPI Cards</h3>

//                         <div className="metric">
//                             <span>Total Batch</span>
//                             <strong>250</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Total Training Completed</span>
//                             <strong>180</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Training Pending</span>
//                             <strong>70</strong>
//                         </div>
//                     </div>

//                     {/* Top Right */}
//                     <div className="dashboard-card">
//                         <h3>Forms</h3>

//                         <div className="metric">
//                             <span>Existing Forms</span>
//                             <strong>1250</strong>
//                         </div>

//                         <div className="metric">
//                             <span>New Enterprise Form</span>
//                             <strong>540</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Non Enterprise Form</span>
//                             <strong>710</strong>
//                         </div>
//                     </div>

//                     {/* Bottom Left */}
//                     <div className="dashboard-card">
//                         <h3>LDMS</h3>

//                         <div className="metric">
//                             <span>Potential Lakhpati Didi</span>
//                             <strong>320</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Potential Non Lakhpati Didis</span>
//                             <strong>180</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Total Data</span>
//                             <strong>500</strong>
//                         </div>
//                     </div>

//                     {/* Bottom Right */}
//                     <div className="dashboard-card">
//                         <h3>MOU</h3>

//                         <div className="metric">
//                             <span>Total MOU</span>
//                             <strong>450</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Lakhpati Didi MOU</span>
//                             <strong>280</strong>
//                         </div>

//                         <div className="metric">
//                             <span>Non Lakhpati Didi MOU</span>
//                             <strong>170</strong>
//                         </div>
//                     </div>

//                 </div>
//             </div>

//             <style>{`
//                 .home-dashboard{
//                     padding:30px;
//                     background:#f8fafc;
//                     min-height:100vh;
//                 }

//                 .dashboard-title{
//                     font-size:28px;
//                     font-weight:700;
//                     color:#1e293b;
//                     margin-bottom:25px;
//                 }

//                 .dashboard-grid{
//                     display:grid;
//                     grid-template-columns:1fr 1fr;
//                     gap:24px;
//                 }

//                 .dashboard-card{
//                     background:#fff;
//                     border-radius:18px;
//                     padding:24px;
//                     box-shadow:0 6px 18px rgba(0,0,0,0.08);
//                     border:1px solid #e5e7eb;
//                     min-height:260px;
//                 }

//                 .dashboard-card h3{
//                     margin:0 0 20px;
//                     color:#0f172a;
//                     font-size:22px;
//                     border-bottom:1px solid #e5e7eb;
//                     padding-bottom:12px;
//                 }

//                 .metric{
//                     display:flex;
//                     justify-content:space-between;
//                     align-items:center;
//                     padding:14px 0;
//                     border-bottom:1px dashed #cbd5e1;
//                 }

//                 .metric:last-child{
//                     border-bottom:none;
//                 }

//                 .metric span{
//                     color:#475569;
//                     font-size:15px;
//                     font-weight:500;
//                 }

//                 .metric strong{
//                     font-size:22px;
//                     color:#2563eb;
//                     font-weight:700;
//                 }

//                 @media(max-width:900px){
//                     .dashboard-grid{
//                         grid-template-columns:1fr;
//                     }
//                 }
//             `}</style>
//         </>
//     );
// };

// export default Dashboard;


import React from "react";
import KPICard from "../Dashboards/KpiCards";

const Dashboard = () => {
    return (
        <>
            <div className="home-dashboard">
                <h2 className="dashboard-title">
                    State Dashboard Overview
                </h2>

                <div className="dashboard-grid">

                    <KPICard
                        title="KPI Cards"
                        stats={[
                            {
                                label: "Total Batch",
                                value: 250,
                            },
                            {
                                label: "Training Completed",
                                value: 180,
                            },
                            {
                                label: "Training Pending",
                                value: 70,
                            },
                        ]}
                    />

                    <KPICard
                        title="Forms"
                        chartColor={[
                            "#10b981",
                            "#34d399",
                            "#6ee7b7",
                        ]}
                        stats={[
                            {
                                label: "Existing Forms",
                                value: 1250,
                            },
                            {
                                label: "New Enterprise Form",
                                value: 540,
                            },
                            {
                                label: "Non Enterprise Form",
                                value: 710,
                            },
                        ]}
                    />

                    <KPICard
                        title="LDMS"
                        chartColor={[
                            "#f59e0b",
                            "#fbbf24",
                            "#fde68a",
                        ]}
                        stats={[
                            {
                                label: "Potential Lakhpati Didi",
                                value: 320,
                            },
                            {
                                label: "Potential Non Lakhpati Didis",
                                value: 180,
                            },
                            {
                                label: "Total Data",
                                value: 500,
                            },
                        ]}
                    />

                    <KPICard
                        title="MOU"
                        chartColor={[
                            "#ef4444",
                            "#f87171",
                            "#fca5a5",
                        ]}
                        stats={[
                            {
                                label: "Total MOU",
                                value: 450,
                            },
                            {
                                label: "Lakhpati Didi MOU",
                                value: 280,
                            },
                            {
                                label: "Non Lakhpati Didi MOU",
                                value: 170,
                            },
                        ]}
                    />

                </div>
            </div>

            <style>{`
        .home-dashboard{
          padding:30px;
          background:#f8fafc;
          min-height:100vh;
        }

        .dashboard-title{
          font-size:28px;
          font-weight:700;
          margin-bottom:25px;
          color:#1e293b;
        }

        .dashboard-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:24px;
        }

        @media(max-width:900px){
          .dashboard-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>
        </>
    );
};

export default Dashboard;