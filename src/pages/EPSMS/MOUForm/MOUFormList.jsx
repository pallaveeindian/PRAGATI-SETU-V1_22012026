import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from "../../../api/axios";
import { FaEye, FaSearch, FaTimes } from "react-icons/fa";
import MOUDetail from "./MOUDetail";

export default function MOUFormList() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const pageSize = 10;
  const totalPages =
    meta.total_pages ||
    Math.ceil((meta.count || meta.total || 0) / pageSize) ||
    1;
  const [jumpPage, setJumpPage] = useState("");

  useEffect(() => {
    fetchMOUs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  async function fetchMOUs() {
    setLoading(true);
    try {
      // Adjust to match your exact EPSAKHI_API configuration
      const res = await EPSAKHI_API.mouFormList({
        page,
        page_size: pageSize,
        search: query || undefined,
      });

      // Handle standard DRF vs Custom Pagination responses
      const data =
        res?.data?.results?.data || res?.data?.data || res?.data?.results || [];
      const paginationMeta = {
        count: res?.data?.count || 0,
        page,
        total_pages: Math.ceil((res?.data?.count || 0) / pageSize),
      };

      setRows(Array.isArray(data) ? data : []);
      setMeta(paginationMeta);
    } catch (err) {
      console.error("Failed to fetch MOU list", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setPage(1);
    setQuery(search);
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

  if (selectedId) {
    return <MOUDetail id={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="epsms-list-container">
      {/* Header */}
      <div className="epsms-list-header">
        <h3 className="compH3">Active MOU Enterprises</h3>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Enterprise, Entrepreneur, or SHG Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
              <th>S.No.</th>
              <th>Enterprise Name</th>
              <th>Entrepreneur</th>
              <th>Contact</th>
              <th>SHG Name</th>
              <th>District</th>
              <th>Block</th>
              <th>Panchayat</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="loading">
                  Loading Records...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="9" className="loading">
                  No MOUs found
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td className="font-semibold">{r.enterprise_name || "-"}</td>
                  <td>{r.entrepreneur_name || "-"}</td>
                  <td>{r.entrepreneur_contact || "-"}</td>
                  <td>{r.lokos_shg_name || "-"}</td>
                  <td>{r.district_name || "-"}</td>
                  <td>{r.block_name || "-"}</td>
                  <td>{r.panchayat_name || "-"}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedId(r.id)}
                      title="View Details"
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
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <div className="page-info">
          <span>Page {meta.page || page}</span>
          <small>of {totalPages}</small>
        </div>

        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>

        {/* Jump to page */}
        <div className="jump-box">
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="Go"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJump()}
          />
          <button onClick={handleJump}>Go</button>
        </div>
      </div>

      {/* Embedded CSS matching SHGList precisely */}
      <style>{`
                .epsms-list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    animation: fadeIn 0.35s ease;
                    background: #ffffff;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    border-top: 4px solid var(--epsms-red, #ea580c);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }

                .epsms-list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .compH3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .search-bar {
                    display: flex;
                    gap: 6px;
                }

                .search-bar input {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    min-width: 380px;
                    width: 100%;
                    font-size: 14px;
                    transition: all 0.2s;
                }

                .search-bar input:focus {
                    outline: none;
                    border-color: var(--epsms-red, #ea580c);
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
                }

                .search-bar button {
                    background: var(--epsms-red, #ea580c);
                    color: white;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .search-bar button:hover {
                    background: #c2410c;
                    transform: translateY(-1px);
                }

                .clear-btn {
                    background: #6b7280 !important;
                }

                .clear-btn:hover {
                    background: #4b5563 !important;
                }

                .table-wrapper {
                    overflow-x: auto;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                }

                .epsms-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                    white-space: nowrap;
                }

                .epsms-table th {
                    background: var(--epsms-red, #ea580c);
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 12px;
                }

                .epsms-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    color: #374151;
                }

                .epsms-table tr:last-child td {
                    border-bottom: none;
                }

                .epsms-table tr:hover {
                    background: #f9fafb;
                }

                .font-semibold {
                    font-weight: 600;
                    color: #111827 !important;
                }

                .view-btn {
                    background: var(--epsms-green, #16a34a);
                    border: none;
                    padding: 6px 10px;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: 0.2s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .view-btn:hover {
                    background: #15803d;
                    transform: scale(1.05);
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    align-items: center;
                    margin-top: 8px;
                }

                .pagination button {
                    padding: 6px 14px;
                    border: none;
                    background: var(--epsms-red, #ea580c);
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    transition: 0.2s;
                }

                .pagination button:hover:not(:disabled) {
                    background: #c2410c;
                }

                .pagination button:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                .page-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-weight: 600;
                    color: #1f2937;
                }

                .page-info small {
                    font-size: 11px;
                    color: #6b7280;
                }

                .jump-box {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    margin-left: 12px;
                    border-left: 1px solid #e5e7eb;
                    padding-left: 12px;
                }

                .jump-box input {
                    width: 60px;
                    padding: 6px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 13px;
                }

                .jump-box input:focus {
                    outline: none;
                    border-color: var(--epsms-red, #ea580c);
                }

                .jump-box button {
                    background: #374151;
                }
                
                .jump-box button:hover {
                    background: #1f2937;
                }

                .loading {
                    text-align: center;
                    padding: 30px !important;
                    color: #6b7280;
                    font-weight: 500;
                    font-style: italic;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media(max-width: 768px) {
                    .search-bar input {
                        min-width: 200px;
                    }
                    .epsms-table {
                        font-size: 12px;
                    }
                    .epsms-list-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .search-bar {
                        width: 100%;
                    }
                }
            `}</style>
    </div>
  );
}
