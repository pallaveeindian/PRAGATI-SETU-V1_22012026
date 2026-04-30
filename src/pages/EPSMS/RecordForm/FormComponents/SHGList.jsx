// src/pages/EPSMS/RecordForm/FormComponents/SHGList.jsx
import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from "../../../../api/axios";
import SHGMembers from "./SHGMembers";
import { FaEye, FaSearch, FaArrowLeft, FaTimes } from "react-icons/fa";

export default function SHGList({ blockId, onSelectMember }) {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    const [selectedSHG, setSelectedSHG] = useState(null);
    const pageSize = 10;
    const totalPages = Math.ceil((meta.total || 0) / pageSize);
    const [jumpPage, setJumpPage] = useState("");

    useEffect(() => {
        if (!blockId) return;

        fetchSHGs();
    }, [blockId, page, query]);

    async function fetchSHGs() {
        setLoading(true);

        try {
            const res = await EPSAKHI_API.upsrlmShgList(blockId, {
                page,
                page_size: 10,
                search: query || undefined,
            });

            const data = res.data?.data || [];
            const meta = res.data?.meta || {};

            setRows(data);
            setMeta(meta);
        } catch (err) {
            console.error("Failed to fetch SHG list", err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        setPage(1);
        setQuery(search);
    }

    if (!blockId) {
        return <div className="epsms-muted">Select a block to view SHGs.</div>;
    }

    function handleClear() {
        setSearch("");
        setQuery("");
        setPage(1);
    }

    function handleJump() {
        const p = parseInt(jumpPage);

        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            setPage(p);
        }

        setJumpPage("");
    }

    // ---------------- MEMBERS VIEW ----------------
    if (selectedSHG) {
        return (
            <SHGMembers
                shg={selectedSHG}
                onBack={() => setSelectedSHG(null)}
                onSelectMember={onSelectMember}
            />
        );
    }

    return (
        <div className="shglist-container">

            {/* Header */}
            <div className="shglist-header">
                <h3 className="compH3">SHG List</h3>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search SHG name, code, nicCode, uuid"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button onClick={handleSearch} title="Search">
                        <FaSearch />
                    </button>

                    {search && (
                        <button
                            className="clear-btn"
                            onClick={handleClear}
                            title="Clear search"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="epsms-table">
                    <thead>
                        <tr>
                            <th>Sno.</th>
                            <th>SHG Name</th>
                            <th>SHG Code</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Social Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="loading">
                                    Loading SHGs...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="loading">
                                    No SHGs found
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, i) => (
                                <tr key={r.code}>
                                    <td>{(page - 1) * 10 + i + 1}</td>
                                    <td>{r.name}</td>
                                    <td>{r.code}</td>
                                    <td>{r.shgCategory}</td>
                                    <td>{r.shgType}</td>
                                    <td>{r.socialCategory}</td>

                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => setSelectedSHG(r)}
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">

                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <div className="page-info">
                    <span>Page {meta.page || page}</span>
                    <small>of {totalPages || 1}</small>
                </div>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

                {/* Jump to page */}
                <div className="jump-box">
                    <input
                        type="number"
                        min="1"
                        max={totalPages || 1}
                        placeholder="Go"
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                    />

                    <button onClick={handleJump}>
                        Go
                    </button>
                </div>

            </div>

            <style>{`
        .shglist-container {
          display:flex;
          flex-direction:column;
          gap:12px;
          animation:fadeIn .35s ease;
        }

        .shglist-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:10px;
        }

        .epsms-card .compH3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--epsms-text-dark);
        }

        .search-bar {
          display:flex;
          gap:6px;
        }

        .search-bar input {
        padding:7px 10px;
        border:1px solid var(--epsms-border);
        border-radius:6px;
        min-width:420px;
        width:100%;
        }
        .search-bar button {
          background:var(--epsms-red);
          color:white;
          border:none;
          padding:7px 12px;
          border-radius:6px;
          cursor:pointer;
          transition:.2s;
        }

        .search-bar button:hover {
          transform:scale(1.05);
        }

        .clear-btn {
        background:#6b7280;
        }

        .clear-btn:hover {
        background:#4b5563;
        }

        .table-wrapper {
          overflow-x:auto;
        }

        .epsms-table {
          width:100%;
          border-collapse:collapse;
          font-size:13px;
        }

        .epsms-table th {
          background:var(--epsms-red);
          color:white;
          padding:8px;
          text-align:left;
        }

        .epsms-table td {
          padding:8px;
          border-bottom:1px solid var(--epsms-muted);
        }

        .epsms-table tr:hover {
          background:#fafafa;
        }

        .view-btn {
          background:var(--epsms-green);
          border:none;
          padding:6px 9px;
          color:white;
          border-radius:5px;
          cursor:pointer;
          transition:.2s;
        }

        .view-btn:hover {
          transform:scale(1.1);
        }

        .pagination {
          display:flex;
          justify-content:center;
          gap:12px;
          align-items:center;
        }

        .pagination button {
          padding:6px 12px;
          border:1px solid var(--epsms-border);
          background:var(--epsms-red);
          border-radius:6px;
          cursor:pointer;
        }

        .pagination button:disabled {
          opacity:.5;
          cursor:not-allowed;
        }

        .page-info {
        display:flex;
        flex-direction:column;
        align-items:center;
        font-weight:600;
        }

        .page-info small {
        font-size:11px;
        color:var(--epsms-text-muted);
        }

        .jump-box {
        display:flex;
        gap:6px;
        align-items:center;
        }

        .jump-box input {
        width:60px;
        padding:5px;
        border:1px solid var(--epsms-border);
        border-radius:5px;
        }

        .jump-box button {
        background:var(--epsms-red);
        color:white;
        border:none;
        padding:5px 10px;
        border-radius:5px;
        cursor:pointer;
        }
        
        .loading {
          text-align:center;
          padding:12px;
        }

        .back-btn {
          display:flex;
          gap:6px;
          align-items:center;
          border:none;
          background:var(--epsms-red);
          color:white;
          padding:7px 12px;
          border-radius:6px;
          cursor:pointer;
        }

        @keyframes fadeIn{
          from{opacity:0;transform:translateY(6px)}
          to{opacity:1;transform:translateY(0)}
        }

        @media(max-width:768px){
          .search-bar input{
            min-width:160px;
          }

          .epsms-table{
            font-size:12px;
          }
        }

      `}</style>
        </div>
    );
}