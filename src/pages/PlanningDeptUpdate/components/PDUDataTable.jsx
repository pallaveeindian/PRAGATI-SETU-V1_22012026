import React, { useState, useMemo, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./styles/PDUDataTable.css";

/**
 * PDUDataTable - A highly reusable, paginated, and exportable data table.
 *
 * @param {Array<Object>} columns - Definition of table columns [{ key: 'id', label: 'Name', render: (row) => ... }]
 * @param {Array<Object>} data - The array of data objects to render
 * @param {boolean} highlightTopThree - If true, highlights the first 3 rows as Gold, Silver, Bronze
 * @param {string} emptyMessage - Message to display if data array is empty
 * @param {string} className - Optional additional CSS classes
 * @param {string} exportFilename - Name of the exported Excel file
 */
const PDUDataTable = ({
  columns = [],
  data = [],
  highlightTopThree = false,
  emptyMessage = "No data available.",
  className = "",
  exportFilename = "Pragati_Setu_Report.xlsx",
}) => {
  const ITEMS_PER_PAGE = 25;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever data changes (e.g., user types in search or changes sort)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // --- Column & SNo. Logic ---
  // Automatically inject SNo. as the first column
  const enrichedColumns = [
    { key: "sno", label: "SNo.", align: "center", width: "60px" },
    ...columns,
  ];

  // Helper to determine the medal class and emoji based on the GLOBAL row index
  const getRowHighlightConfig = (globalIndex) => {
    if (!highlightTopThree) return { className: "", emoji: "" };
    switch (globalIndex) {
      case 0:
        return { className: "pdu-row-gold", emoji: "🥇 " };
      case 1:
        return { className: "pdu-row-silver", emoji: "🥈 " };
      case 2:
        return { className: "pdu-row-bronze", emoji: "🥉 " };
      default:
        return { className: "", emoji: "" };
    }
  };

  // --- Export to Excel Logic (from provided snippet) ---
  const handleExport = async () => {
    if (!data || data.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      // ===== Title =====
      const title = worksheet.addRow(["PRAGATI SETU REPORT"]);
      worksheet.mergeCells(1, 1, 1, enrichedColumns.length);

      title.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F3057" },
      };
      title.getCell(1).font = {
        bold: true,
        size: 14,
        color: { argb: "FFFFFFFF" },
      };
      title.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      title.height = 30;

      // ===== Header =====
      const headerRow = worksheet.addRow(enrichedColumns.map((h) => h.label));
      const lightBlueFill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6D9F1" },
      };
      const thinBorder = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      headerRow.eachCell((cell) => {
        cell.fill = lightBlueFill;
        cell.font = { bold: true };
        cell.border = thinBorder;
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // ===== Column Width =====
      worksheet.columns = enrichedColumns.map((h) => ({
        key: h.key,
        width: Math.max(h.label.length + 8, 18),
      }));

      // ===== Data =====
      // Export ENTIRE dataset, calculating SNo. dynamically
      data.forEach((item, index) => {
        const rowData = enrichedColumns.map((col) => {
          if (col.key === "sno") return index + 1;
          // If the column has a render function but we are exporting to raw Excel,
          // fallback to the raw key value. You can adjust if you need formatted strings.
          return item[col.key] ?? "";
        });

        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          const column = enrichedColumns[colNumber - 1];

          cell.border = thinBorder;
          cell.alignment = {
            horizontal: column?.align === "left" ? "left" : "center",
            vertical: "middle",
          };
        });
      });

      // ===== Download =====
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        exportFilename.replace(".csv", ".xlsx"),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel.");
    }
  };

  return (
    <div className={`pdu-table-wrapper ${className}`}>
      {/* Top Toolbar: Record Count & Export Button */}
      <div className="pdu-table-toolbar">
        <span className="pdu-table-records">
          Total Records: <strong>{data.length}</strong>
        </span>

        {/* PRAGATI SETU EXPORT BUTTON */}
        <button
          className="btn-export"
          onClick={handleExport}
          disabled={data.length === 0}
        >
          <div className="btn-export-content">
            <div className="btn-export-icon-wrap">
              <svg
                className="btn-export-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z" />
              </svg>
            </div>
            <div className="btn-export-text-wrap">
              <span className="btn-export-text">Export Excel</span>
            </div>
          </div>
        </button>
      </div>

      {/* Table Container */}
      <div className="pdu-table-container">
        <table className="pdu-data-table">
          <thead>
            <tr>
              {enrichedColumns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`pdu-table-th ${col.align ? `pdu-align-${col.align}` : "pdu-align-left"}`}
                  style={{ width: col.width || "auto" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={enrichedColumns.length}
                  className="pdu-table-empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                // Calculate actual global index for SNo. and Medal logic
                const globalIndex =
                  (currentPage - 1) * ITEMS_PER_PAGE + rowIndex;
                const { className: highlightClass, emoji } =
                  getRowHighlightConfig(globalIndex);

                return (
                  <tr
                    key={rowIndex}
                    className={`pdu-table-row ${highlightClass}`}
                  >
                    {enrichedColumns.map((col, colIndex) => {
                      // 1. Render Serial Number
                      if (col.key === "sno") {
                        return (
                          <td
                            key="sno"
                            className="pdu-table-td pdu-align-center"
                            style={{ fontWeight: 600, color: "#6b7280" }}
                          >
                            {globalIndex + 1}
                          </td>
                        );
                      }

                      // 2. Render Normal Columns
                      return (
                        <td
                          key={col.key || colIndex}
                          className={`pdu-table-td ${col.align ? `pdu-align-${col.align}` : "pdu-align-left"}`}
                        >
                          {/* Attach medal to the FIRST actual data column (colIndex === 1 because SNo is 0) */}
                          {colIndex === 1 && highlightTopThree && emoji && (
                            <span className="pdu-medal-emoji">{emoji}</span>
                          )}

                          {/* Use custom render if provided, else raw data */}
                          {col.render
                            ? col.render(row, rowIndex)
                            : row[col.key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="pdu-table-pagination">
          <span className="pdu-page-info">
            Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
            <strong>
              {Math.min(currentPage * ITEMS_PER_PAGE, data.length)}
            </strong>{" "}
            of <strong>{data.length}</strong>
          </span>
          <div className="pdu-page-controls">
            <button
              className="pdu-page-btn"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pdu-page-number">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pdu-page-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDUDataTable;
