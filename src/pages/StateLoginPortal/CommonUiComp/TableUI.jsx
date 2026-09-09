import React, { useState, useMemo } from "react";

/**
 * Reusable Table Component
 * @param {Array} data - The complete raw array of data to display and sort.
 * @param {Array} columns - Array of objects: { header: "Name", key: "name", sortable: true, render: (row) => JSX }
 * @param {Number} page - Current active page (from TablePagination).
 * @param {Number} rowsPerPage - Items per page (from TablePagination).
 * @param {Boolean} loading - True if data is still fetching.
 */
export default function TableUI({
  data = [],
  columns = [],
  page = 1,
  rowsPerPage = 15,
  loading = false,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle Header Click for Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort the WHOLE dataset globally before pagination
  const sortedData = useMemo(() => {
    if (!sortConfig.key || data.length === 0) return data;

    return [...data].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle nulls/undefined
      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";

      // Strip common symbols to check if it's a numeric column (like percentages or currency)
      const strA = String(valA).replace(/[%$,]/g, "").trim();
      const strB = String(valB).replace(/[%$,]/g, "").trim();

      const numA = Number(strA);
      const numB = Number(strB);

      // Numeric Sort
      if (!isNaN(numA) && !isNaN(numB) && strA !== "" && strB !== "") {
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      // String/Alphabetical Sort
      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortConfig]);

  // Slice the globally sorted data for the current page
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  return (
    <div className="reusable-table-wrapper">
      <div className="table-responsive">
        <table className="reusable-table">
          <thead>
            <tr>
              {/* Auto S.No. Column */}
              <th className="sno-col">S.No.</th>

              {/* Dynamic Columns */}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    cursor: col.sortable !== false ? "pointer" : "default",
                  }}
                >
                  <div className="th-content">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <span className="sort-arrows">
                        <span
                          className={
                            sortConfig.key === col.key &&
                            sortConfig.direction === "asc"
                              ? "active"
                              : ""
                          }
                        >
                          ▲
                        </span>
                        <span
                          className={
                            sortConfig.key === col.key &&
                            sortConfig.direction === "desc"
                              ? "active"
                              : ""
                          }
                        >
                          ▼
                        </span>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-state">
                  <div className="loader-pulse">Crunching Matrix Data...</div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                // Correct Global S.No based on current page
                const globalSno = (page - 1) * rowsPerPage + index + 1;
                return (
                  <tr key={index}>
                    <td className="sno-col fw-bold">{globalSno}</td>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx}>
                        {/* If a custom render function is passed, use it. Otherwise, render raw data */}
                        {col.render ? col.render(row, globalSno) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="empty-state">
                  No records found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .reusable-table-wrapper {
          width: 100%;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          animation: tableFadeIn 0.5s ease-out;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .reusable-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background: #ffffff;
        }

        .reusable-table th, .reusable-table td {
          padding: 16px 20px;
          font-size: 14px;
        }

        .reusable-table th {
          background: #08398A;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          white-space: nowrap;
          user-select: none;
          transition: background 0.2s;
        }

        .reusable-table th:hover {
          background: #002174;
        }

        .reusable-table th:last-child {
          border-right: none;
        }

        .reusable-table td {
          border-bottom: 1px solid #f1f5f9;
          border-right: 1px solid #f8fafc;
          color: #334155;
          transition: background 0.2s;
        }

        .reusable-table td:last-child {
          border-right: none;
        }

        .reusable-table tbody tr {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .reusable-table tbody tr:hover {
          background: #f8fafc;
        }

        .th-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .sno-col {
          text-align: center;
          width: 60px;
        }

        /* Sorting Arrows UI */
        .sort-arrows {
          display: flex;
          flex-direction: column;
          font-size: 9px;
          line-height: 0.9;
          color: rgba(255, 255, 255, 0.3);
        }

        .sort-arrows span {
          transition: all 0.2s ease;
        }

        .sort-arrows span.active {
          color: #ff9f1c; /* Highlight Saffron/Orange */
          text-shadow: 0 0 6px rgba(255, 159, 28, 0.8);
          transform: scale(1.2);
        }

        .fw-bold {
          font-weight: 700;
          color: #0f172a;
        }

        .empty-state {
          text-align: center;
          padding: 60px !important;
          color: #64748b;
          font-size: 15px;
          font-style: italic;
          background: #f8fafc;
        }

        .loader-pulse {
          animation: pulse 1.5s infinite ease-in-out;
          color: #08398A;
          font-weight: 700;
        }

        @keyframes tableFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
