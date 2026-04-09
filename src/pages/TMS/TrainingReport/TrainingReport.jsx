import React, { useState } from "react";
import Filters from "./Filter";
import TableView from "./TableView";
import Loader from "./Loader";
import "./trainingReport.css";

import api from "../../../api/axios";


const TrainingReport = () => {
    const [type, setType] = useState("");
    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ CLEAN EMPTY VALUES
    const cleanFilters = (obj) => {
        return Object.fromEntries(
            Object.entries(obj).filter(
                ([_, v]) => v !== "" && v !== null && v !== undefined
            )
        );
    };

    // const handleFetch = async () => {
    //     if (!type) return alert("Select report type");

    //     setLoading(true);
    //     try {
    //         const cleaned = cleanFilters(filters);

    //         const query = new URLSearchParams({
    //             training_type: type,
    //             ...cleaned,
    //         }).toString();

    //         const url = `${BASE_URL}/cmp-training-report/?${query}`;
    //         console.log("🔥 API URL:", url);

    //         const res = await fetch(url);
    //         const json = await res.json();

    //         console.log("🔥 RESPONSE:", json);

    //         setData(json.results || json || []);
    //     } catch (err) {
    //         console.error(err);
    //         alert("Error fetching data");
    //     }
    //     setLoading(false);
    // };

    const handleFetch = async () => {
        if (!type) return alert("Select report type");

        setLoading(true);

        try {
            const res = await api.get("/tms/cmp-training-report/", {
                params: {
                    training_type: type,
                    page_size: 5000,
                    ...filters,
                },
            });

            console.log("✅ DATA:", res.data);

            setData(res.data.results || res.data);

        } catch (err) {
            console.error("❌ ERROR:", err);
            alert("Backend not reachable");
        }

        setLoading(false);
    };
    const handleExport = () => {
        if (!type) return alert("Select report type");

        const query = new URLSearchParams({
            training_type: type,
            export: "excel",
            page_size: 5000,
            ...filters,
        }).toString();

        window.open(`${baseURL}/tms/cmp-training-report/?${query}`)
    };
    return (
        <div className="container">
            <h2>TMS Training Report</h2>

            <select
                value={type}
                onChange={(e) => {
                    setType(e.target.value);
                    setFilters({});
                    setData([]);
                }}
            >
                <option value="">Select Report Type</option>
                <option value="BENEFICIARY">Beneficiary</option>
                <option value="TRAINER">Trainer</option>
            </select>

            {type && (
                <Filters type={type} filters={filters} setFilters={setFilters} />
            )}

            {type && (
                <div className="actions">
                    <button onClick={handleFetch}>Search</button>
                    <button onClick={handleExport}>Export Excel</button>
                </div>
            )}

            {loading && <Loader />}
            {!loading && <TableView data={data} />}
        </div>
    );
};

export default TrainingReport;