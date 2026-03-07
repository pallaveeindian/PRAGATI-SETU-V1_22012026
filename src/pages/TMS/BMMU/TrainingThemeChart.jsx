// import React, { useEffect, useState, useContext } from "react";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Tooltip,
//     Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { TMS_API } from "../../../api/axios";
// import { AuthContext } from "../../../contexts/AuthContext";

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Tooltip,
//     Legend
// );

// export default function TrainingThemeChart() {
//     const { user } = useContext(AuthContext) || {};
//     const [chartData, setChartData] = useState(null);

//     useEffect(() => {
//         if (user?.id) {
//             fetchData();
//         }
//     }, [user]);

//     async function fetchData() {
//         try {
//             //  Fetch trainings created by logged-in user
//             const res = await TMS_API.trainingRequests.list({
//                 created_by: user.id,
//                 limit: 1000,
//             });

//             const trainings =
//                 res?.data?.results ?? res?.results ?? [];

//             //  Group by theme
//             const themeMap = {};

//             trainings.forEach((item) => {
//                 const themeId = item.theme_id;
//                 const themeName = item.theme_name;

//                 if (!themeMap[themeId]) {
//                     themeMap[themeId] = {
//                         name: themeName,
//                         count: 0,
//                     };
//                 }

//                 themeMap[themeId].count += 1;
//             });

//             const labels = Object.values(themeMap).map(
//                 (t) => t.name
//             );
//             const data = Object.values(themeMap).map(
//                 (t) => t.count
//             );

//             setChartData({
//                 labels,
//                 datasets: [
//                     {
//                         label: "Trainings Created",
//                         data,
//                         backgroundColor: "rgba(0, 123, 255, 0.5)", // translucent blue
//                         borderColor: "rgba(0, 123, 255, 1)",
//                         borderWidth: 1,
//                         borderRadius: 6,
//                     },
//                 ],
//             });
//         } catch (err) {
//             console.error("Theme training chart error:", err);
//         }
//     }

//     const options = {
//         indexAxis: "y", // horizontal
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: { display: false },
//         },
//         scales: {
//             x: {
//                 beginAtZero: true,
//                 ticks: { precision: 0 },
//                 grid: {
//                     color: "rgba(0,0,0,0.05)",
//                 },
//             },
//             y: {
//                 grid: { display: false },
//             },
//         },
//     };

//     return (
//         <div
//             style={{
//                 background: "#fff",
//                 borderRadius: 8,
//                 padding: 20,
//                 border: "3px solid #3d6ba6", // Rose-900 border
//                 boxShadow: "0 2px 2px #a7c6ed",
//                 height: 400,

//             }}
//         >
//             <h3 style={{ marginTop: 0, color: "#0f766e" }}>
//                 Trainings by Theme (Your Created)
//             </h3>

//             {chartData && <Bar data={chartData} options={options} />}
//         </div>
//     );
// }

import React, { useEffect, useState, useContext } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TMS_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TrainingThemeChart() {
    const { user } = useContext(AuthContext) || {};
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user]);

    async function fetchData() {
        try {
            const res = await TMS_API.trainingRequests.list({
                created_by: user.id,
                limit: 1000,
            });

            const trainings = res?.data?.results ?? res?.results ?? [];

            const themeMap = {};

            trainings.forEach((item) => {
                const themeId = item.theme_id;
                const themeName = item.theme_name;

                if (!themeMap[themeId]) {
                    themeMap[themeId] = { name: themeName, count: 0 };
                }
                themeMap[themeId].count += 1;
            });

            const labels = Object.values(themeMap).map((t) => t.name);
            const data = Object.values(themeMap).map((t) => t.count);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Trainings Created",
                        data,
                        backgroundColor: "rgba(0, 123, 255, 0.5)", // translucent blue
                        borderColor: "rgba(0, 123, 255, 1)",
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                ],
            });
        } catch (err) {
            console.error("Theme training chart error:", err);
        }
    }

    const options = {
        indexAxis: "y", // horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { precision: 0 },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            y: {
                grid: { display: false },
            },
        },
    };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 8,
                padding: 20,
                border: "3px solid #3d6ba6", // Rose-900 border
                boxShadow: "0 2px 2px #a7c6ed",
                height: 400,
            }}
        >
            <h3 style={{ marginTop: 0, color: "#111827" }}>
                Trainings by Theme (Your Created)
            </h3>

            {chartData ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Loading chart data…</p>
            )}
        </div>
    );
}