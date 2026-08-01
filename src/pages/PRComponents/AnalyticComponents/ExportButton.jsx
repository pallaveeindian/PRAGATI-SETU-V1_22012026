// src/pages/PRComponents/AnalyticComponents/ExportButton.jsx
import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ExportButton({ data, headers, filename }) {
  const handleExport = async () => {
    if (!data || data.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      // ===== Title =====
      const title = worksheet.addRow(["PRAGATI SETU REPORT"]);
      worksheet.mergeCells(1, 1, 1, headers.length);

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
      const headerRow = worksheet.addRow(headers.map((h) => h.label));

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
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      // ===== Column Width =====
      worksheet.columns = headers.map((h) => ({
        key: h.key,
        width: Math.max(h.label.length + 8, 18),
      }));

      // ===== Data =====
      data.forEach((item) => {
        const row = worksheet.addRow(headers.map((h) => item[h.key] ?? ""));

        row.eachCell((cell) => {
          cell.border = thinBorder;
          cell.alignment = {
            horizontal: "center",
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
        filename?.replace(".csv", ".xlsx") || "Report.xlsx",
      );
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel.");
    }
  };
  return (
    <button className="btn-export" onClick={handleExport}>
      <div className="btn-export-content">
        {/* ICON LAYER */}
        <div className="btn-export-icon-wrap">
          <svg
            className="btn-export-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z" />
          </svg>
        </div>

        {/* TEXT LAYER */}
        <div className="btn-export-text-wrap">
          <span className="btn-export-text">Export Excel</span>
        </div>
      </div>
    </button>
  );
}
