// src/pages/PlanningDeptUpdate/components/PDUDataTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./styles/PDUDataTable.css";

/**
 * PDUDataTable - A highly reusable, paginated, and exportable data table.
 * Supports single-row headers as well as two-tier headers (when columns include `subLabel`).
 *
 * @param {Array<Object>} columns - Definition of table columns [{ key: 'id', label: 'Name', subLabel: 'Optional', render: (row) => ... }]
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

  // Reset to page 1 whenever data changes
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
  const enrichedColumns = useMemo(
    () => [
      { key: "sno", label: "Sno", align: "center", width: "60px" },
      ...columns,
    ],
    [columns],
  );

  const hasSubHeaders = useMemo(
    () => enrichedColumns.some((col) => Boolean(col.subLabel)),
    [enrichedColumns],
  );

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

  // --- Export to Excel Logic ---
  const handleExport = async () => {
    if (!data || data.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      const thinBorder = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      if (hasSubHeaders) {
        // ===== Two-Tier Header Export (Matches UPPLD Format) =====
        const topRowValues = enrichedColumns.map((c) => c.label);
        const subRowValues = enrichedColumns.map((c) => c.subLabel || "");

        const headerRow1 = worksheet.addRow(topRowValues);
        const headerRow2 = worksheet.addRow(subRowValues);

        headerRow1.height = 110;
        headerRow2.height = 24;

        enrichedColumns.forEach((col, idx) => {
          const colNum = idx + 1;
          if (!col.subLabel) {
            worksheet.mergeCells(1, colNum, 2, colNum);
          }
        });

        headerRow1.eachCell((cell) => {
          cell.font = { bold: true, size: 11 };
          cell.border = thinBorder;
          cell.alignment = {
            horizontal: "center",
            vertical: "top",
            wrapText: true,
          };
        });

        headerRow2.eachCell((cell) => {
          cell.font = { bold: true, size: 11 };
          cell.border = thinBorder;
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
        });

        worksheet.columns = enrichedColumns.map((h) => ({
          key: h.key,
          width: 18,
        }));
      } else {
        // ===== Standard Single-Header Export =====
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

        const headerRow = worksheet.addRow(enrichedColumns.map((h) => h.label));
        const lightBlueFill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC6D9F1" },
        };

        headerRow.eachCell((cell) => {
          cell.fill = lightBlueFill;
          cell.font = { bold: true };
          cell.border = thinBorder;
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        worksheet.columns = enrichedColumns.map((h) => ({
          key: h.key,
          width: Math.max(h.label.length + 8, 18),
        }));
      }

      // ===== Data Rows =====
      data.forEach((item, index) => {
        const rowData = enrichedColumns.map((col) => {
          if (col.key === "sno") return index + 1;
          return item[col.key] ?? "";
        });

        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          const column = enrichedColumns[colNumber - 1];

          cell.border = thinBorder;
          cell.alignment = {
            horizontal: column?.align === "left" ? "left" : "center",
            vertical: "middle",
            wrapText: true,
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
          <div className="pdubtn-export-content">
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
                  rowSpan={hasSubHeaders && !col.subLabel ? 2 : 1}
                  className={`pdu-table-th ${col.align ? `pdu-align-${col.align}` : "pdu-align-left"}`}
                  style={{
                    width: col.width || "auto",
                    verticalAlign: hasSubHeaders ? "top" : "middle",
                    whiteSpace: "normal",
                    lineHeight: 1.35,
                    border: hasSubHeaders ? "1px solid #cbd5e1" : undefined,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>

            {hasSubHeaders && (
              <tr>
                {enrichedColumns
                  .filter((col) => Boolean(col.subLabel))
                  .map((col, idx) => (
                    <th
                      key={`${col.key}-sub-${idx}`}
                      className={`pdu-table-th ${col.align ? `pdu-align-${col.align}` : "pdu-align-center"}`}
                      style={{
                        backgroundColor: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: "#fff",
                        border: "1px solid #cbd5e1",
                        padding: "8px 10px",
                      }}
                    >
                      {col.subLabel}
                    </th>
                  ))}
              </tr>
            )}
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

                      return (
                        <td
                          key={col.key || colIndex}
                          className={`pdu-table-td ${col.align ? `pdu-align-${col.align}` : "pdu-align-left"}`}
                        >
                          {colIndex === 1 && highlightTopThree && emoji && (
                            <span className="pdu-medal-emoji">{emoji}</span>
                          )}

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
