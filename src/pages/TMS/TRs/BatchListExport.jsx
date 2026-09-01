// src/pages/TMS/TRs/BatchListExport.jsx
import React, { useState } from "react";
import { FaFileExcel, FaSpinner } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function BatchListExport({ batches }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!batches || batches.length === 0) {
      alert("No data available to export.");
      return;
    }

    setExporting(true);
    try {
      // 1. Initialize Workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Batch List");

      // 2. Define Header Rows
      // Row 1: Super Header
      const titleRow = worksheet.addRow(["PRAGATI SETU - TMS BATCH LIST"]);

      // Row 2: Column Headers
      const headerRow = worksheet.addRow([
        "S.No.",
        "Batch Code",
        "Status",
        "Participant Type",
        "Start Date",
        "End Date",
        "Batch Type",
        "Centre",
        "Partner",
        "Block",
        "District",
        "Pendency Status",
        "Count",
      ]);

      // 3. Merge Super Header across all 13 columns (A to M)
      worksheet.mergeCells("A1:M1");

      // 4. Apply Exact Image Styling
      // Super Header Style (Dark Blue background, White Text)
      titleRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F3057" }, // Deep Blue
      };
      titleRow.getCell(1).font = {
        color: { argb: "FFFFFFFF" },
        size: 14,
        bold: true,
      };
      titleRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      titleRow.height = 35;

      // Column Header Style (Light Blue background, Borders, Bold)
      const lightBlueFill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6D9F1" },
      };
      const thinBorder = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };

      const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
      cols.forEach((col) => {
        const cell = worksheet.getCell(`${col}2`);
        cell.fill = lightBlueFill;
        cell.border = thinBorder;
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
      headerRow.height = 20;

      // 5. Set Optimal Column Widths
      worksheet.columns = [
        { key: "sno", width: 8 },
        { key: "code", width: 22 },
        { key: "status", width: 16 },
        { key: "participant_type", width: 18 },
        { key: "start_date", width: 15 },
        { key: "end_date", width: 15 },
        { key: "batch_type", width: 16 },
        { key: "centre", width: 30 },
        { key: "partner", width: 25 },
        { key: "block", width: 20 },
        { key: "district", width: 20 },
        { key: "pendency_status", width: 40 },
        { key: "count", width: 10 },
      ];

      // 6. Add Data Rows
      batches.forEach((b, index) => {
        const centreName =
          b.centre?.venue_name || b.centre?.partner?.name || "-";
        const partnerName = b.centre?.partner?.name || "-";
        const blockName = b.block?.block_name_en || "-";
        const districtName = b.district?.district_name_en || "-";

        const row = worksheet.addRow([
          index + 1,
          b.code || "-",
          b.status || "-",
          b.participant_type || "-",
          b.start_date || "-",
          b.end_date || "-",
          b.batch_type || "-",
          centreName,
          partnerName,
          blockName,
          districtName,
          b.pendency_status,
          b.pax_count || 0,
        ]);

        // Apply borders and alignment to data cells
        row.eachCell((cell) => {
          cell.border = thinBorder;
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // 7. Download File
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Batch_List_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to export data to Excel.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-export-excel"
        onClick={handleExport}
        disabled={exporting || !batches || batches.length === 0}
        title="Export Data to Excel"
      >
        {exporting ? (
          <>
            <FaSpinner
              className="nic-spin"
              style={{
                marginRight: "6px",
                animation: "spin 1s linear infinite",
              }}
            />{" "}
            Exporting...
          </>
        ) : (
          <>
            <FaFileExcel style={{ marginRight: "6px" }} /> Export Excel
          </>
        )}
      </button>

      <style>{`
        .btn-export-excel {
          background-color: #16a34a;
          color: #ffffff;
          border: 1px solid #15803d;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s;
          height: 32px;
        }
        .btn-export-excel:hover:not(:disabled) {
          background-color: #15803d;
          box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2);
          transform: translateY(-1px);
        }
        .btn-export-excel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
