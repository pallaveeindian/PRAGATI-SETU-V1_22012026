import React from "react";

const TablePagination = ({
  page = 1,
  totalPages = 1,
  rowsPerPage = 15,
  setRowsPerPage,
  setPage,
  totalRecords = 0,
}) => {
  return (
    <>
      <div className="table-pagination-wrapper">
        <div className="table-pagination">
          {/* Left Section: Controls */}
          <div className="pagination-left">
            <span className="label">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1); // Always reset to page 1 on resize
              }}
              className="rows-select"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <div className="divider"></div>

            <span className="record-count">
              Total Records:{" "}
              <strong className="glow-text">{totalRecords}</strong>
            </span>
          </div>

          {/* Right Section: Navigation */}
          <div className="pagination-right">
            <button
              className="page-btn prev-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <span className="arrow">←</span> Previous
            </button>

            <div className="page-info-pill">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>

            <button
              className="page-btn next-btn"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Next <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .table-pagination-wrapper {
          margin-top: 24px;
          animation: slideUp 0.5s ease-out;
        }

        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          flex-wrap: wrap;
          gap: 16px;
        }

        /* --- Left Side --- */
        .pagination-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .label {
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rows-select {
          appearance: none;
          padding: 8px 36px 8px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          cursor: pointer;
          background: #f8fafc url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          transition: all 0.2s ease;
        }

        .rows-select:focus, .rows-select:hover {
          border-color: #08398A;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(8, 57, 138, 0.1);
        }

        .divider {
          width: 2px;
          height: 24px;
          background: #e2e8f0;
          border-radius: 2px;
        }

        .record-count {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .glow-text {
          color: #08398A;
          font-weight: 800;
        }

        /* --- Right Side --- */
        .pagination-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .page-info-pill {
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .page-info-pill strong {
          color: #0f172a;
          font-weight: 800;
        }

        .page-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #083A8B 0%, #002174 100%);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(8, 58, 139, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .page-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(8, 58, 139, 0.35);
          background: linear-gradient(135deg, #0b5cb8 0%, #083A8B 100%);
        }

        .page-btn:active:not(:disabled) {
          transform: scale(0.96);
        }

        .page-btn:disabled {
          background: #f1f5f9;
          color: #94a3b8;
          box-shadow: none;
          cursor: not-allowed;
          border: 1px solid #e2e8f0;
        }

        .arrow {
          font-size: 16px;
          transition: transform 0.2s ease;
        }

        .prev-btn:hover:not(:disabled) .arrow {
          transform: translateX(-3px);
        }
        
        .next-btn:hover:not(:disabled) .arrow {
          transform: translateX(3px);
        }

        /* --- Animations & Responsiveness --- */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .table-pagination {
            flex-direction: column;
            align-items: stretch;
          }

          .pagination-left {
            justify-content: space-between;
          }

          .divider {
            display: none;
          }

          .pagination-right {
            width: 100%;
            justify-content: space-between;
          }
          
          .page-info-pill {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default TablePagination;
