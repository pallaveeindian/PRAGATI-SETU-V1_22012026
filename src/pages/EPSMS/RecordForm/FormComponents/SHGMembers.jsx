// src/pages/EPSMS/RecordForm/FormComponents/SHGMembers.jsx
import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from "../../../../api/axios";
import {
    FaArrowLeft,
    FaSearch,
    FaTimes,
    FaCheckCircle,
} from "react-icons/fa";

export default function SHGMembers({ shg, onBack, onSelectMember }) {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    const [selected, setSelected] = useState(null);

    const pageSize = 10;
    const totalPages = Math.ceil((meta.total || 0) / pageSize);

    useEffect(() => {
        fetchMembers();
    }, [page, query]);

    async function fetchMembers() {
        setLoading(true);

        try {
            const res = await EPSAKHI_API.upsrlmShgMembers(shg.code, {
                page,
                page_size: pageSize,
                search: query || undefined,
            });

            setRows(res.data?.data || []);
            setMeta(res.data?.meta || {});
        } catch (err) {
            console.error("Failed to fetch members", err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        setPage(1);
        setQuery(search);
    }

    function clearSearch() {
        setSearch("");
        setQuery("");
        setPage(1);
    }

    function selectMember(m) {
        setSelected(m.member_code);

        const address = m.member_addresses?.[0] || {};

        const payload = {
            district_id: address.district_id || shg.districtId,
            block_id: address.block_id || shg.blockId,
            panchayat_id: address.panchayat_id || shg.panchayatId,
            member_name: m.member_name,
            mobile_number: m.member_phones?.[0]?.phone_no || null,
            shg_code: shg.code,
            member_code: m.member_code,
            social_category: m.social_category,
        };

        onSelectMember?.(payload);
    }

    return (
        <div className="members-container">

            <div className="members-header">
                <button className="back-btn" onClick={onBack}>
                    <FaArrowLeft /> Back
                </button>

                <h3>{shg.name} Members</h3>

                <div className="search-bar">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search member code / guid / nic code"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                    <button onClick={handleSearch}>
                        <FaSearch />
                    </button>

                    {search && (
                        <button className="clear-btn" onClick={clearSearch}>
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>

            <div className="table-wrapper">
                <table className="epsms-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Sno</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Designation</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Religion</th>
                            <th>Social Category</th>
                            <th>Member Code</th>
                            <th>Marital Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="11" className="loading">
                                    Loading members...
                                </td>
                            </tr>
                        ) : rows.map((m, i) => {
                            const phone = m.member_phones?.[0]?.phone_no || "-";
                            const designation =
                                m.member_designations?.[0]?.designation || "-";

                            return (
                                <tr
                                    key={m.member_code}
                                    className={selected === m.member_code ? "selected-row" : ""}
                                    onClick={() => selectMember(m)}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            className="orangeRadio"
                                            checked={selected === m.member_code}
                                            readOnly
                                        />
                                    </td>

                                    <td>{(page - 1) * pageSize + i + 1}</td>

                                    <td>
                                        {m.member_name}
                                        {m.pld_status && (
                                            <span className="pld-badge">
                                                <FaCheckCircle /> PLD
                                            </span>
                                        )}
                                    </td>

                                    <td>{phone}</td>
                                    <td>{designation}</td>
                                    <td>{m.dob}</td>
                                    <td>{m.gender}</td>
                                    <td>{m.religion}</td>
                                    <td>{m.social_category}</td>
                                    <td>{m.member_code}</td>
                                    <td>{m.marital_status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Prev
                </button>

                <span>
                    Page {meta.page || page} of {totalPages || 1}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            <style>{`

.members-container{
display:flex;
flex-direction:column;
gap:14px;
animation:fadeIn .35s ease;
}

.members-header{
display:flex;
flex-wrap:wrap;
gap:12px;
align-items:center;
justify-content:space-between;
}

.selected-row{
background:rgba(24,146,24,.15);
}

.pld-badge{
margin-left:6px;
font-size:11px;
background:var(--epsms-green);
color:white;
padding:2px 6px;
border-radius:4px;
display:inline-flex;
gap:4px;
align-items:center;
}

.search-bar{
display:flex;
gap:6px;
}

.search-bar input{
padding:7px 10px;
border:1px solid var(--epsms-border);
border-radius:6px;
min-width:360px;
}

.search-bar button{
background:var(--epsms-red);
border:none;
color:white;
padding:7px 10px;
border-radius:6px;
cursor:pointer;
}

.clear-btn{
background:#6b7280;
}

.orangeRadio {
accent-color: var(--epsms-red);
}

.epsms-table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.epsms-table th{
background:var(--epsms-red);
color:white;
padding:8px;
text-align:left;
}

.epsms-table td{
padding:8px;
border-bottom:1px solid var(--epsms-muted);
}

.epsms-table tr:hover{
background:#fafafa;
}

.pagination{
display:flex;
justify-content:center;
gap:12px;
}

.pagination button{
padding:6px 12px;
background:var(--epsms-red);
color:white;
border:none;
border-radius:6px;
}

@keyframes fadeIn{
from{opacity:0;transform:translateY(6px)}
to{opacity:1;transform:translateY(0)}
}

@media(max-width:900px){
.search-bar input{
min-width:200px;
}

.epsms-table{
font-size:12px;
}
}

`}</style>
        </div>
    );
}