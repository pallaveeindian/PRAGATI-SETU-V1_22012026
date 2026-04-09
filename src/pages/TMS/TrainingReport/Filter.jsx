import React, { useEffect, useState } from "react";
import { LOOKUP_API } from "../../../api/axios";
import { decryptPayload } from "../../../api/axios";

const Filters = ({ type, filters, setFilters }) => {

    // ================= STATE =================
    const [districts, setDistricts] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [panchayats, setPanchayats] = useState([]);
    const [villages, setVillages] = useState([]);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "district_id") {
            setFilters({
                ...filters,
                district_id: value,
                block_id: "",
                panchayat_id: "",
                village_id: "",
            });

            // 🔥 clear child data
            setBlocks([]);
            setPanchayats([]);
            setVillages([]);

        } else if (name === "block_id") {
            setFilters({
                ...filters,
                block_id: value,
                panchayat_id: "",
                village_id: "",
            });

            setPanchayats([]);
            setVillages([]);

        } else if (name === "panchayat_id") {
            setFilters({
                ...filters,
                panchayat_id: value,
                village_id: "",
            });

            setVillages([]);

        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    // ================= DISTRICTS =================
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await LOOKUP_API.districts.list({
                    params: { page_size: 5000 }
                });
                const data = decryptPayload(res.data);
                setDistricts(data.results || data);
            } catch (err) {
                console.error("District error", err);
            }
        };
        fetch();
    }, []);

    // ================= BLOCKS =================
    useEffect(() => {
        if (!filters.district_id) {
            setBlocks([]);   // 🔥 clear when empty
            return;
        }

        const fetch = async () => {
            try {
                const res = await LOOKUP_API.blocks.list({
                    params: {
                        district_id: filters.district_id,
                        page_size: 5000
                    }
                });
                const data = decryptPayload(res.data);
                setBlocks(data.results || data);
            } catch (err) {
                console.error("Block error", err);
            }
        };
        fetch();
    }, [filters.district_id]);

    // ================= PANCHAYATS =================
    useEffect(() => {
        if (!filters.block_id) {
            setPanchayats([]);
            return;
        }

        const fetch = async () => {
            try {
                const res = await LOOKUP_API.panchayats.list({
                    params: {
                        block_id: filters.block_id,
                        page_size: 5000
                    }
                });
                const data = decryptPayload(res.data);
                setPanchayats(data.results || data);
            } catch (err) {
                console.error("Panchayat error", err);
            }
        };
        fetch();
    }, [filters.block_id]);

    // ================= VILLAGES =================
    useEffect(() => {
        if (!filters.panchayat_id) {
            setVillages([]);
            return;
        }

        const fetch = async () => {
            try {
                const res = await LOOKUP_API.villages.list({
                    params: {
                        panchayat_id: filters.panchayat_id,
                        page_size: 5000
                    }
                });
                const data = decryptPayload(res.data);
                setVillages(data.results || data);
            } catch (err) {
                console.error("Village error", err);
            }
        };
        fetch();
    }, [filters.panchayat_id]);

    return (
        <div className="filters">

            {/* ================= LOCATION ================= */}

            <select
                name="district_id"
                value={filters.district_id || ""}
                onChange={handleChange}
            >
                <option value="">Select District</option>
                {districts.map((d, i) => (
                    <option key={d.id || i} value={d.id}>
                        {d.district_name_en}
                    </option>
                ))}
            </select>

            <select
                name="block_id"
                value={filters.block_id || ""}
                onChange={handleChange}
                disabled={!filters.district_id}   // 🔥 disable
            >
                <option value="">Select Block</option>
                {blocks.map((b, i) => (
                    <option key={b.block_id || i} value={b.block_id}>
                        {b.block_name_en}
                    </option>
                ))}
            </select>

            {type === "BENEFICIARY" && (
                <select
                    name="panchayat_id"
                    value={filters.panchayat_id || ""}
                    onChange={handleChange}
                    disabled={!filters.block_id}   // 🔥 disable
                >
                    <option value="">Select Panchayat</option>
                    {panchayats.map((p, i) => (
                        <option key={p.id || i} value={p.id}>
                            {p.panchayat_name_en}
                        </option>
                    ))}
                </select>
            )}

            {type === "BENEFICIARY" && (
                <select
                    name="village_id"
                    value={filters.village_id || ""}
                    onChange={handleChange}
                    disabled={!filters.panchayat_id}  // 🔥 disable
                >
                    <option value="">Select Village</option>
                    {villages.map((v, i) => (
                        <option key={v.id || i} value={v.id}>
                            {v.village_name_english}
                        </option>
                    ))}
                </select>
            )}

            {/* ================= COMMON ================= */}

            <input name="training_plan_id" placeholder="Training Plan ID" value={filters.training_plan_id || ""} onChange={handleChange} />
            <input name="training_partner_id" placeholder="Training Partner ID" value={filters.training_partner_id || ""} onChange={handleChange} />
            <input name="level" placeholder="Level" value={filters.level || ""} onChange={handleChange} />
            <input name="batch_status" placeholder="Batch Status" value={filters.batch_status || ""} onChange={handleChange} />

            <input type="date" name="start_date" value={filters.start_date || ""} onChange={handleChange} />
            <input type="date" name="end_date" value={filters.end_date || ""} onChange={handleChange} />

            {/* ================= BENEFICIARY ================= */}

            {type === "BENEFICIARY" && (
                <>
                    <select name="gender" value={filters.gender || ""} onChange={handleChange}>
                        <option value="">Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>

                    <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
                    <input name="pld_status" placeholder="PLD Status" value={filters.pld_status || ""} onChange={handleChange} />
                    <input name="social_category" placeholder="Social Category" value={filters.social_category || ""} onChange={handleChange} />
                    <input name="religion" placeholder="Religion" value={filters.religion || ""} onChange={handleChange} />
                </>
            )}

            {/* ================= TRAINER ================= */}

            {type === "TRAINER" && (
                <>
                    <input name="batch_code" placeholder="Batch Code" value={filters.batch_code || ""} onChange={handleChange} />
                    <input name="trainer_name" placeholder="Trainer Name" value={filters.trainer_name || ""} onChange={handleChange} />
                    <input name="designation" placeholder="Designation" value={filters.designation || ""} onChange={handleChange} />
                </>
            )}

        </div>
    );
};

export default Filters;