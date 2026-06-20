// import React, { useMemo, useState } from "react";
// import TablePagination from "../CommonUiComp/TablePagination";

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Filler,
//     Tooltip,
//     Legend,
// } from "chart.js";

// import { Line } from "react-chartjs-2";

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Filler,
//     Tooltip,
//     Legend
// );

// const labels = [
//     "Apr 3", "Apr 10", "Apr 17", "Apr 24", "May 1",
//     "May 8", "May 15", "May 23", "May 31", "Jun 7",
//     "Jun 14", "Jun 21", "Jun 30",
// ];

// const chartData = {
//     labels,
//     datasets: [
//         {
//             label: "Training Requests",
//             data: [30, 55, 40, 80, 62, 95, 70, 45, 60, 88, 76, 90, 85],
//             borderColor: "#f59e0b",
//             backgroundColor: "rgba(245,158,11,0.2)",
//             fill: true,
//             tension: 0.4,
//             pointRadius: 4,
//             pointBackgroundColor: "#f59e0b",
//         },
//     ],
// };

// // Mock data: categorizing districts under regions to replicate the mock style
// const rows = Array.from({ length: 100 }, (_, i) => {
//     let region = "North America";
//     if (i >= 30 && i < 70) region = "Europe & Africa";
//     else if (i >= 70) region = "Asia";

//     return {
//         id: i + 1,
//         region: region,
//         district: `District ${i + 1}`,
//         requests: Math.floor(Math.random() * 500),
//         completed: Math.floor(Math.random() * 200),
//     };
// });

// export default function TrainingRequestDashboard() {
//     const [page, setPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(25);
//     const [selectedDistrict, setSelectedDistrict] = useState("all");
//     const [searchQuery, setSearchQuery] = useState("");

//     // Grouping districts dynamically by region for the categorized <select> dropdown
//     const groupedDistricts = useMemo(() => {
//         const groups = {};
//         rows.forEach((row) => {
//             if (!groups[row.region]) {
//                 groups[row.region] = [];
//             }
//             if (!groups[row.region].includes(row.district)) {
//                 groups[row.region].push(row.district);
//             }
//         });
//         return groups;
//     }, []);

//     // Filter rows based on BOTH the Select dropdown selection and Search input match
//     const filteredRows = useMemo(() => {
//         return rows.filter((row) => {
//             const matchesDropdown = selectedDistrict === "all" || row.district === selectedDistrict;
//             const matchesSearch = row.district.toLowerCase().includes(searchQuery.toLowerCase());
//             return matchesDropdown && matchesSearch;
//         });
//     }, [selectedDistrict, searchQuery]);

//     // Pagination splits
//     const start = (page - 1) * rowsPerPage;
//     const data = filteredRows.slice(start, start + rowsPerPage);
//     const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

//     return (
//         <div className="space-y-6">

//             {/* Chart Card */}
//             <div className="bg-white rounded-2xl p-6 shadow border">
//                 <div className="flex justify-between items-center mb-5">
//                     <div>
//                         <h2 className="text-2xl font-bold text-slate-800">
//                             Total Training Requests
//                         </h2>
//                         <p className="text-gray-500">
//                             Total requests for last 3 months
//                         </p>
//                     </div>
//                 </div>

//                 <div className="h-[350px]">
//                     <Line
//                         data={chartData}
//                         options={{
//                             responsive: true,
//                             maintainAspectRatio: false,
//                             plugins: {
//                                 legend: { display: false },
//                             },
//                             scales: {
//                                 y: { beginAtZero: true },
//                             },
//                         }}
//                     />
//                 </div>
//             </div>

//             {/* Table Card */}
//             {/* Table Card */}
//             {/* <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6"> */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//                     <h3 className="text-xl font-bold text-slate-800">
//                         District Wise Training Data
//                     </h3>

//                     <div className="flex items-center gap-4 flex-wrap">

//                         {/* Search Box */}
//                         <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-amber-400">
//                             <input
//                                 type="text"
//                                 placeholder="Type to search..."
//                                 value={searchQuery}
//                                 onChange={(e) => {
//                                     setSearchQuery(e.target.value);
//                                     setPage(1);
//                                 }}
//                                 className="w-64 px-4 py-2.5 text-sm outline-none"
//                             />

//                             <button
//                                 type="button"
//                                 className="px-5 py-2.5 border-l bg-gray-50 font-medium hover:bg-gray-100"
//                             >
//                                 Search
//                             </button>
//                         </div>

//                         {/* District Dropdown */}
//                         <select
//                             value={selectedDistrict}
//                             onChange={(e) => {
//                                 setSelectedDistrict(e.target.value);
//                                 setPage(1);
//                             }}
//                             className="w-72 px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 outline-none"
//                         >
//                             <option value="all">
//                                 Select District (All)
//                             </option>

//                             {Object.entries(groupedDistricts).map(
//                                 ([region, districts]) => (
//                                     <optgroup
//                                         key={region}
//                                         label={region}
//                                     >
//                                         {districts.map(
//                                             (district) => (
//                                                 <option
//                                                     key={district}
//                                                     value={
//                                                         district
//                                                     }
//                                                 >
//                                                     {district}
//                                                 </option>
//                                             )
//                                         )}
//                                     </optgroup>
//                                 )
//                             )}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Table Wrapper */}
//                 <div className="overflow-x-auto rounded-2xl border border-gray-200">

//                     <table className="w-full">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="p-4 text-left font-semibold text-gray-700">
//                                     District
//                                 </th>

//                                 <th className="p-4 text-left font-semibold text-gray-700">
//                                     Requests
//                                 </th>

//                                 <th className="p-4 text-left font-semibold text-gray-700">
//                                     Completed
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody className="bg-white">
//                             {data.length > 0 ? (
//                                 data.map((row) => (
//                                     <tr
//                                         key={row.id}
//                                         className="border-t hover:bg-amber-50 transition"
//                                     >
//                                         <td className="p-4 font-medium text-gray-800">
//                                             {row.district}
//                                         </td>

//                                         <td className="p-4 text-gray-600">
//                                             {row.requests}
//                                         </td>

//                                         <td className="p-4 text-gray-600">
//                                             {row.completed}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={3}
//                                         className="p-8 text-center text-gray-500"
//                                     >
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="mt-5">
//                     <TablePagination
//                         page={page}
//                         totalPages={totalPages}
//                         rowsPerPage={rowsPerPage}
//                         setRowsPerPage={setRowsPerPage}
//                         setPage={setPage}
//                         totalRecords={filteredRows.length}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }


// import React, { useMemo, useState } from "react";
// import TablePagination from "../CommonUiComp/TablePagination";

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Filler,
//     Tooltip,
//     Legend,
// } from "chart.js";

// import { Line } from "react-chartjs-2";

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Filler,
//     Tooltip,
//     Legend
// );

// // Inline Styles Object Blueprint
// const styles = {
//     dashboardContainer: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "24px",
//         fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         width: "100%",
//     },
//     whiteCard: {
//         backgroundColor: "#ffffff",
//         borderRadius: "16px",
//         padding: "24px",
//         boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
//         border: "1px solid #e5e7eb",
//         width: "100%",
//         boxSizing: "border-box",
//     },
//     cardTitle: {
//         fontSize: "1.25rem",
//         fontWeight: "700",
//         color: "#1e293b",
//         margin: 0,
//     },
//     cardSubtitle: {
//         fontSize: "0.875rem",
//         color: "#6b7280",
//         margin: "4px 0 0 0",
//     },
//     headerWrapper: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         flexWrap: "wrap",
//         gap: "16px",
//         marginBottom: "24px",
//     },
//     controlsWrapper: {
//         display: "flex",
//         alignItems: "center",
//         flexWrap: "wrap",
//         gap: "16px",
//     },
//     searchContainer: {
//         display: "flex",
//         alignItems: "center",
//         border: "1px solid #d1d5db",
//         borderRadius: "12px",
//         overflow: "hidden",
//         backgroundColor: "#ffffff",
//         boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//     },
//     searchContainer: {
//         display: "flex",
//         alignItems: "center",
//         // Base style: rest state gets a light amber border
//         border: "1px solid #fef3c7", // Light amber-100 border
//         borderRadius: "12px",
//         overflow: "hidden",
//         backgroundColor: "#ffffff",
//         boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//         transition: "all 0.15s ease",
//     },
//     searchContainerActive: {
//         // Active style: focused state gets a solid amber border + subtle glow
//         border: "1px solid #f59e0b", // Solid amber-500 border
//         boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.2)", // Amber focus ring
//     },
//     searchInput: {
//         width: "256px",
//         padding: "10px 16px",
//         fontSize: "0.875rem",
//         border: "none",
//         outline: "none", // Keeps default browser ring hidden
//     },
//     // Inside your styles object...
//     searchButton: {
//         padding: "10px 20px",
//         border: "none",
//         borderLeft: "1px solid #e5e7eb",
//         // Linear-gradient needs to be a string
//         background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
//         fontWeight: "500",
//         fontSize: "0.875rem",
//         cursor: "pointer",
//         color: "#ffffff", // Changed base text color to white for readability against blue
//         transition: "all 0.15s ease",
//     },
//     searchButtonHover: {
//         // Overriding the base gradient with an amber gradient
//         background: "linear-gradient(135deg, #f59e0b, #d97706)",
//         color: "#ffffff",
//     },
//     selectDropdown: {
//         width: "288px",
//         padding: "10px 16px",
//         border: "1px solid #d1d5db",
//         borderRadius: "12px",
//         backgroundColor: "#ffffff",
//         boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//         fontSize: "0.875rem",
//         outline: "none",
//         color: "#374151",
//     },
//     tableOverflowContainer: {
//         overflowX: "auto",
//         borderRadius: "16px",
//         border: "1px solid #e5e7eb",
//     },
//     table: {
//         width: "100%",
//         borderCollapse: "collapse",
//         textAlign: "left",
//     },
//     tableHeaderRow: {
//         backgroundColor: "#f9fafb",
//     },
//     th: {
//         padding: "16px",
//         fontWeight: "600",
//         fontSize: "0.75rem",
//         textTransform: "uppercase",
//         letterSpacing: "0.05em",
//         color: "#6b7280",
//         borderBottom: "1px solid #e5e7eb",
//     },
//     tdDistrict: {
//         padding: "16px",
//         fontSize: "0.875rem",
//         fontWeight: "500",
//         color: "#111827",
//         borderBottom: "1px solid #e5e7eb",
//     },
//     tdValue: {
//         padding: "16px",
//         fontSize: "0.875rem",
//         color: "#4b5563",
//         borderBottom: "1px solid #e5e7eb",
//     },
//     tdNoRecords: {
//         padding: "32px",
//         textAlign: "center",
//         fontSize: "0.875rem",
//         color: "#6b7280",
//     },
//     paginationContainer: {
//         marginTop: "20px",
//     },
// };

// const labels = [
//     "Apr 3", "Apr 10", "Apr 17", "Apr 24", "May 1",
//     "May 8", "May 15", "May 23", "May 31", "Jun 7",
//     "Jun 14", "Jun 21", "Jun 30",
// ];

// const chartData = {
//     labels,
//     datasets: [
//         {
//             label: "Training Requests",
//             data: [30, 55, 40, 80, 62, 95, 70, 45, 60, 88, 76, 90, 85],
//             borderColor: "#f59e0b",
//             backgroundColor: "rgba(245,158,11,0.2)",
//             fill: true,
//             tension: 0.4,
//             pointRadius: 4,
//             pointBackgroundColor: "#f59e0b",
//         },
//     ],
// };

// const rows = [
//     { id: 1, region: "North America", district: "District 1", requests: 240, completed: 181 },
//     { id: 2, region: "North America", district: "District 2", requests: 400, completed: 96 },
//     { id: 3, region: "North America", district: "District 3", requests: 434, completed: 163 },
//     { id: 4, region: "North America", district: "District 4", requests: 371, completed: 120 },
//     { id: 5, region: "North America", district: "District 5", requests: 324, completed: 131 },
//     { id: 6, region: "Europe & Africa", district: "District 6", requests: 116, completed: 167 },
//     { id: 7, region: "Europe & Africa", district: "District 7", requests: 168, completed: 5 },
//     { id: 8, region: "Europe & Africa", district: "District 8", requests: 458, completed: 8 },
//     { id: 9, region: "Asia", district: "District 9", requests: 8, completed: 53 },
//     { id: 10, region: "Asia", district: "District 10", requests: 54, completed: 118 },
// ];

// export default function TrainingRequestDashboard() {
//     const [page, setPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(25);
//     const [selectedDistrict, setSelectedDistrict] = useState("all");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [hoveredRowId, setHoveredRowId] = useState(null);
//     const [isButtonHovered, setIsButtonHovered] = useState(false);
//     const [isInputFocused, setIsInputFocused] = useState(false);
//     const [isButtonHovered, setIsButtonHovered] = useState(false);

//     const groupedDistricts = useMemo(() => {
//         const groups = {};
//         rows.forEach((row) => {
//             if (!groups[row.region]) {
//                 groups[row.region] = [];
//             }
//             if (!groups[row.region].includes(row.district)) {
//                 groups[row.region].push(row.district);
//             }
//         });
//         return groups;
//     }, []);

//     const filteredRows = useMemo(() => {
//         return rows.filter((row) => {
//             const matchesDropdown = selectedDistrict === "all" || row.district === selectedDistrict;
//             const matchesSearch = row.district.toLowerCase().includes(searchQuery.toLowerCase());
//             return matchesDropdown && matchesSearch;
//         });
//     }, [selectedDistrict, searchQuery]);

//     const start = (page - 1) * rowsPerPage;
//     const data = filteredRows.slice(start, start + rowsPerPage);
//     const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

//     return (
//         <div style={styles.dashboardContainer}>

//             {/* Chart Container Card */}
//             <div style={styles.whiteCard}>
//                 <div style={{ marginBottom: "20px" }}>
//                     <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>
//                         Total Training Requests
//                     </h2>
//                     <p style={styles.cardSubtitle}>
//                         Total requests for last 3 months
//                     </p>
//                 </div>

//                 <div style={{ height: "350px", position: "relative" }}>
//                     <Line
//                         data={chartData}
//                         options={{
//                             responsive: true,
//                             maintainAspectRatio: false,
//                             plugins: {
//                                 legend: { display: false },
//                             },
//                             scales: {
//                                 y: { beginAtZero: true },
//                             },
//                         }}
//                     />
//                 </div>
//             </div>

//             {/* Table Container Card */}
//             <div style={styles.whiteCard}>
//                 {/* Header configuration */}
//                 <div style={styles.headerWrapper}>
//                     <h3 style={styles.cardTitle}>
//                         District Wise Training Data
//                     </h3>

//                     <div style={styles.controlsWrapper}>
//                         {/* Search Box Component Layout */}
//                         {/* Search Box */}
//                         {/* Search Box Wrapper Container */}
//                         <div
//                             style={{
//                                 ...styles.searchContainer,
//                                 ...(isInputFocused ? styles.searchContainerActive : {})
//                             }}
//                         >
//                             <input
//                                 type="text"
//                                 placeholder="Type to search..."
//                                 value={searchQuery}
//                                 onFocus={() => setIsInputFocused(true)}
//                                 onBlur={() => setIsInputFocused(false)}
//                                 onChange={(e) => {
//                                     setSearchQuery(e.target.value);
//                                     setPage(1);
//                                 }}
//                                 style={styles.searchInput}
//                             />

//                             <button
//                                 type="button"
//                                 onMouseEnter={() => setIsButtonHovered(true)}
//                                 onMouseLeave={() => setIsButtonHovered(false)}
//                                 style={{
//                                     ...styles.searchButton,
//                                     ...(isButtonHovered ? styles.searchButtonHover : {}),
//                                 }}
//                             >
//                                 Search
//                             </button>
//                         </div>

//                         {/* Dropdown Menu Component Selection */}
//                         <select
//                             value={selectedDistrict}
//                             onChange={(e) => {
//                                 setSelectedDistrict(e.target.value);
//                                 setPage(1);
//                             }}
//                             style={styles.selectDropdown}
//                         >
//                             <option value="all">Select District (All)</option>
//                             {Object.entries(groupedDistricts).map(([region, districts]) => (
//                                 <optgroup key={region} label={region}>
//                                     {districts.map((district) => (
//                                         <option key={district} value={district}>
//                                             {district}
//                                         </option>
//                                     ))}
//                                 </optgroup>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Main Tabular View Frame inside the card wrapper */}
//                 <div style={styles.tableOverflowContainer}>
//                     <table style={styles.table}>
//                         <thead>
//                             <tr style={styles.tableHeaderRow}>
//                                 <th style={styles.th}>District</th>
//                                 <th style={styles.th}>Requests</th>
//                                 <th style={styles.th}>Completed</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data.length > 0 ? (
//                                 data.map((row) => {
//                                     const isHovered = hoveredRowId === row.id;
//                                     return (
//                                         <tr
//                                             key={row.id}
//                                             onMouseEnter={() => setHoveredRowId(row.id)}
//                                             onMouseLeave={() => setHoveredRowId(null)}
//                                             style={{
//                                                 backgroundColor: isHovered ? "rgba(245, 158, 11, 0.05)" : "transparent",
//                                                 transition: "background-color 0.15s ease",
//                                             }}
//                                         >
//                                             <td style={styles.tdDistrict}>{row.district}</td>
//                                             <td style={styles.tdValue}>{row.requests}</td>
//                                             <td style={styles.tdValue}>{row.completed}</td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr>
//                                     <td colSpan={3} style={styles.tdNoRecords}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Bottom Pagination controls context */}
//                 <div style={styles.paginationContainer}>
//                     <TablePagination
//                         page={page}
//                         totalPages={totalPages}
//                         rowsPerPage={rowsPerPage}
//                         setRowsPerPage={setRowsPerPage}
//                         setPage={setPage}
//                         totalRecords={filteredRows.length}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }



import React, { useMemo, useState } from "react";
import TablePagination from "../CommonUiComp/TablePagination";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// Inline Styles Object Blueprint
const styles = {
    dashboardContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        width: "100%",
    },
    whiteCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        border: "1px solid #e5e7eb",
        width: "100%",
        boxSizing: "border-box",
    },
    cardTitle: {
        fontSize: "1.25rem",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    cardSubtitle: {
        fontSize: "0.875rem",
        color: "#6b7280",
        margin: "4px 0 0 0",
    },
    headerWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px",
    },
    controlsWrapper: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
    },
    searchContainer: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #fce37d", // Light amber-100 border
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transition: "all 0.15s ease",
    },
    searchContainerActive: {
        border: "1px solid #f59e0b", // Solid amber-500 border
        boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.2)", // Amber focus ring
    },
    searchInput: {
        width: "256px",
        padding: "10px 16px",
        fontSize: "0.875rem",
        border: "none",
        outline: "none",
    },
    searchButton: {
        padding: "10px 20px",
        border: "none",
        borderLeft: "1px solid #e5e7eb",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        fontWeight: "500",
        fontSize: "0.875rem",
        cursor: "pointer",
        color: "#ffffff",
        transition: "all 0.15s ease",
    },
    searchButtonHover: {
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        color: "#ffffff",
    },
    selectDropdown: {
        width: "288px",
        padding: "10px 16px",
        border: "1px solid #fce37d", // Light amber-100 base border matching search input rest state
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        fontSize: "0.875rem",
        outline: "none",
        color: "#374151",
        cursor: "pointer",
        transition: "all 0.15s ease",
    },
    selectDropdownActive: {
        border: "1px solid #f59e0b", // Solid amber-500 active border
        boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.2)", // Amber focus ring
    },
    dropdownOption: {
        padding: "8px",
        borderRadius: "8px", // Native dropdown layout fallback rounding support
    },
    tableOverflowContainer: {
        overflowX: "auto",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
    },
    tableHeaderRow: {
        backgroundColor: "#f9fafb",
    },
    th: {
        padding: "16px",
        fontWeight: "600",
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#6b7280",
        borderBottom: "1px solid #e5e7eb",
    },
    tdDistrict: {
        padding: "16px",
        fontSize: "0.875rem",
        fontWeight: "500",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
    },
    tdValue: {
        padding: "16px",
        fontSize: "0.875rem",
        color: "#4b5563",
        borderBottom: "1px solid #e5e7eb",
    },
    tdNoRecords: {
        padding: "32px",
        textAlign: "center",
        fontSize: "0.875rem",
        color: "#6b7280",
    },
    paginationContainer: {
        marginTop: "20px",
    },
};

const labels = [
    "Apr 3", "Apr 10", "Apr 17", "Apr 24", "May 1",
    "May 8", "May 15", "May 23", "May 31", "Jun 7",
    "Jun 14", "Jun 21", "Jun 30",
];

const chartData = {
    labels,
    datasets: [
        {
            label: "Training Requests",
            data: [30, 55, 40, 80, 62, 95, 70, 45, 60, 88, 76, 90, 85],
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#f59e0b",
        },
    ],
};

const rows = [
    { id: 1, region: "North America", district: "District 1", requests: 240, completed: 181 },
    { id: 2, region: "North America", district: "District 2", requests: 400, completed: 96 },
    { id: 3, region: "North America", district: "District 3", requests: 434, completed: 163 },
    { id: 4, region: "North America", district: "District 4", requests: 371, completed: 120 },
    { id: 5, region: "North America", district: "District 5", requests: 324, completed: 131 },
    { id: 6, region: "Europe & Africa", district: "District 6", requests: 116, completed: 167 },
    { id: 7, region: "Europe & Africa", district: "District 7", requests: 168, completed: 5 },
    { id: 8, region: "Europe & Africa", district: "District 8", requests: 458, completed: 8 },
    { id: 9, region: "Asia", district: "District 9", requests: 8, completed: 53 },
    { id: 10, region: "Asia", district: "District 10", requests: 54, completed: 118 },
];

export default function TrainingRequestDashboard() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isSelectFocused, setIsSelectFocused] = useState(false);

    const groupedDistricts = useMemo(() => {
        const groups = {};
        rows.forEach((row) => {
            if (!groups[row.region]) {
                groups[row.region] = [];
            }
            if (!groups[row.region].includes(row.district)) {
                groups[row.region].push(row.district);
            }
        });
        return groups;
    }, []);

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const matchesDropdown = selectedDistrict === "all" || row.district === selectedDistrict;
            const matchesSearch = row.district.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDropdown && matchesSearch;
        });
    }, [selectedDistrict, searchQuery]);

    const start = (page - 1) * rowsPerPage;
    const data = filteredRows.slice(start, start + rowsPerPage);
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    return (
        <div style={styles.dashboardContainer}>

            {/* Chart Container Card */}
            <div style={styles.whiteCard}>
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                        Total Training Requests
                    </h2>
                    <p style={styles.cardSubtitle}>
                        Total requests for last 3 months
                    </p>
                </div>

                <div style={{ height: "350px", position: "relative" }}>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: { beginAtZero: true },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Table Container Card */}
            <div style={styles.whiteCard}>
                {/* Header configuration */}
                <div style={styles.headerWrapper}>
                    <h3 style={styles.cardTitle}>
                        District Wise Training Data
                    </h3>

                    <div style={styles.controlsWrapper}>
                        {/* Search Box Wrapper Container */}
                        <div
                            style={{
                                ...styles.searchContainer,
                                ...(isInputFocused ? styles.searchContainerActive : {})
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Type to search..."
                                value={searchQuery}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                style={styles.searchInput}
                            />

                            <button
                                type="button"
                                onMouseEnter={() => setIsButtonHovered(true)}
                                onMouseLeave={() => setIsButtonHovered(false)}
                                style={{
                                    ...styles.searchButton,
                                    ...(isButtonHovered ? styles.searchButtonHover : {}),
                                }}
                            >
                                Search
                            </button>
                        </div>

                        {/* Dropdown Menu Component Selection */}
                        <select
                            value={selectedDistrict}
                            onFocus={() => setIsSelectFocused(true)}
                            onBlur={() => setIsSelectFocused(false)}
                            onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setPage(1);
                            }}
                            style={{
                                ...styles.selectDropdown,
                                ...(isSelectFocused ? styles.selectDropdownActive : {})
                            }}
                        >
                            <option value="all" style={styles.dropdownOption}>
                                Select District (All)
                            </option>
                            {Object.entries(groupedDistricts).map(([region, districts]) => (
                                <optgroup key={region} label={region}>
                                    {districts.map((district) => (
                                        <option
                                            key={district}
                                            value={district}
                                            style={styles.dropdownOption}
                                        >
                                            {district}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main Tabular View Frame inside the card wrapper */}
                <div style={styles.tableOverflowContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeaderRow}>
                                <th style={styles.th}>District</th>
                                <th style={styles.th}>Requests</th>
                                <th style={styles.th}>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row) => {
                                    const isHovered = hoveredRowId === row.id;
                                    return (
                                        <tr
                                            key={row.id}
                                            onMouseEnter={() => setHoveredRowId(row.id)}
                                            onMouseLeave={() => setHoveredRowId(null)}
                                            style={{
                                                backgroundColor: isHovered ? "rgba(245, 158, 11, 0.05)" : "transparent",
                                                transition: "background-color 0.15s ease",
                                            }}
                                        >
                                            <td style={styles.tdDistrict}>{row.district}</td>
                                            <td style={styles.tdValue}>{row.requests}</td>
                                            <td style={styles.tdValue}>{row.completed}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} style={styles.tdNoRecords}>
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Pagination controls context */}
                <div style={styles.paginationContainer}>
                    <TablePagination
                        page={page}
                        totalPages={totalPages}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        setPage={setPage}
                        totalRecords={filteredRows.length}
                    />
                </div>
            </div>
        </div>
    );
}