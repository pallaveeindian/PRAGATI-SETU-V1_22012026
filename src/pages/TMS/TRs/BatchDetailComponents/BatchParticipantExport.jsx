//  src/pages/TMS/TRs/BatchDetailComponents/BatchParticipantExport.jsx
import React, { useState } from "react";
import { FaFileExcel, FaSpinner } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// SURGICAL FIX: Accept fetchData function instead of static array
export default function BatchParticipantExport({ fetchData }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Fetch all filtered data directly from server with max limit
      const requests = await fetchData();

      if (!requests || requests.length === 0) {
        alert("No data available to export.");
        setExporting(false);
        return;
      }

      // 1. Initialize Workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Training Requests");

      // 2. Define Header Rows
      // Row 1: Super Header
      const titleRow = worksheet.addRow([
        "PRAGATI SETU - TRAINING REQUEST LIST",
      ]);

      // Row 2: Column Headers
      const headerRow = worksheet.addRow([
        "S.No.",
        "Theme",
        "Training Plan",
        "Level",
        "Status",
        "Partner",
        "District",
        "Block",
        "Participant Count",
        "Financial Year",
        "TR ID",
        "Created At",
      ]);

      // 3. Merge Super Header across all 12 columns (A to L)
      worksheet.mergeCells("A1:L1");

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

      const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
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
        { key: "theme", width: 20 },
        { key: "plan", width: 35 },
        { key: "level", width: 15 },
        { key: "status", width: 18 },
        { key: "partner", width: 30 },
        { key: "district", width: 20 },
        { key: "block", width: 20 },
        { key: "count", width: 18 },
        { key: "financial_year", width: 15 },
        { key: "tr_id", width: 10 },
        { key: "created_at", width: 22 },
      ];

      // 6. Add Data Rows
      requests.forEach((r, index) => {
        // Format date string safely
        let formattedDate = "-";
        if (r.created_at) {
          try {
            const dateObj = new Date(r.created_at);
            formattedDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          } catch (e) {
            formattedDate = r.created_at;
          }
        }

        const row = worksheet.addRow([
          index + 1,
          r.theme_name || "-",
          r.training_plan_name || "-",
          r.level || "-",
          r.status || "-",
          r.partner_name || "-",
          r.district_name || "-",
          r.block_name || "-",
          r.participant_count ?? 0,
          r.financial_year || "-",
          r.id || "-",
          formattedDate,
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
      saveAs(
        blob,
        `Training_Requests_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
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
        className="btn-export-excel"
        onClick={handleExport}
        disabled={exporting}
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
