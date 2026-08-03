// src/pages/StateLoginPortal/CommonUiComp/TablePagination.jsx
import React from "react";

const TablePagination = ({
  page = 1,
  totalPages = 1,
  rowsPerPage = 25,
  setRowsPerPage,
  setPage,
  totalRecords = 0,
}) => {
  return (
    <>
      <div className="table-pagination">
        {/* Left Section */}
        <div className="pagination-left">
          <span className="label">Rows per page</span>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rows-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span className="record-count">Total: {totalRecords}</span>
        </div>

        {/* Right Section */}
        <div className="pagination-right">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Previous
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      <style>{`
                .table-pagination{
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:16px 20px;
                    border-top:1px solid #e5e7eb;
                    background:#fff;
                    flex-wrap:wrap;
                    gap:16px;
                }

                .pagination-left{
                    display:flex;
                    align-items:center;
                    gap:12px;
                    flex-wrap:wrap;
                }

                .label{
                    font-size:14px;
                    font-weight:600;
                    color:#374151;
                }

                .rows-select{
                    padding:8px 12px;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    min-width:90px;
                    outline:none;
                    cursor:pointer;
                    background:#fff;
                    font-size:14px;
                }

                .rows-select:focus{
                    border-color:#f59e0b;
                }

                .record-count{
                    color:#6b7280;
                    font-size:14px;
                }

                .pagination-right{
                    display:flex;
                    align-items:center;
                    gap:12px;
                }

                .page-btn{
                    border:none;
                    background:#fef3c7;
                    color:#92400e;
                    padding:10px 18px;
                    border-radius:10px;
                    font-size:14px;
                    font-weight:600;
                    cursor:pointer;
                    transition:all 0.2s ease;
                }

                .page-btn:hover:not(:disabled){
                    background:#f59e0b;
                    color:#fff;
                    transform:translateY(-1px);
                }

                .page-btn:disabled{
                    opacity:0.5;
                    cursor:not-allowed;
                    transform:none;
                }

                .page-info{
                    font-size:14px;
                    font-weight:600;
                    color:#374151;
                    min-width:100px;
                    text-align:center;
                }

                @media(max-width:768px){
                    .table-pagination{
                        flex-direction:column;
                        align-items:flex-start;
                    }

                    .pagination-right{
                        width:100%;
                        justify-content:space-between;
                    }
                }
            `}</style>
    </>
  );
};

export default TablePagination;
