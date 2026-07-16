// src/pages/TMS/MTManagementV2/components/MTExport.jsx
import React, { useState } from "react";
import { FaFileExcel, FaSpinner } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function MTExport({ trainers, isSMMU, lockedTheme }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!trainers || trainers.length === 0) {
      alert("No data available to export.");
      return;
    }

    setExporting(true);
    try {
      // 1. Determine Theme Name for Header
      let themeNameText = "All Themes";
      if (isSMMU && lockedTheme) {
        // Since the list is filtered, all trainers will share the same theme name.
        // We can cleanly extract it from the first trainer in the array.
        themeNameText = trainers[0]?.theme_name || "Assigned Theme";
      }

      // 2. Initialize Workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Master Trainers");

      // 3. Define Header Rows
      // Row 1: Super Header
      const titleRow = worksheet.addRow([
        `PRAGATI SETU - TMS MASTER TRAINER LIST (${themeNameText})`,
      ]);

      // Row 2: Category Headers (We add empty strings to account for merged cells later)
      const headerRow1 = worksheet.addRow([
        "S.NO.",
        "Name",
        "Phone No.",
        "District",
        "Designation",
        "Theme",
        "Certifications",
        "",
        "",
        "",
        "",
        "",
        "",
        "", // Placeholders for merged certification columns
      ]);

      // Row 3: Sub-headers for Certifications
      const headerRow2 = worksheet.addRow([
        "",
        "",
        "",
        "",
        "",
        "", // Placeholders for merged main columns
        "Induction",
        "SMCB",
        "MF&FI",
        "SISD",
        "FarmLH",
        "Non-FarmLH",
        "ModelCLF",
        "LokOS",
      ]);

      // 4. Merge Cells to match your exact image
      worksheet.mergeCells("A1:N1"); // Super Header spans all 14 columns
      worksheet.mergeCells("A2:A3"); // S.NO.
      worksheet.mergeCells("B2:B3"); // Name
      worksheet.mergeCells("C2:C3"); // Phone No.
      worksheet.mergeCells("D2:D3"); // District
      worksheet.mergeCells("E2:E3"); // Designation
      worksheet.mergeCells("F2:F3"); // Theme
      worksheet.mergeCells("G2:N2"); // Certifications super header spans 8 columns

      // 5. Apply Exact Styling
      // Super Header Style (Dark Blue, White Text)
      titleRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F3057" }, // Hex #0F3057
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

      // Sub Header Style (Light Blue, Black Text, Borders)
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

      const columnsToStyle = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
      ];
      columnsToStyle.forEach((col) => {
        [2, 3].forEach((rowNum) => {
          const cell = worksheet.getCell(`${col}${rowNum}`);
          cell.fill = lightBlueFill;
          cell.border = thinBorder;
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      headerRow1.height = 20;
      headerRow2.height = 20;

      // 6. Set Column Widths
      worksheet.columns = [
        { key: "sno", width: 8 },
        { key: "name", width: 25 },
        { key: "phone", width: 15 },
        { key: "district", width: 18 },
        { key: "designation", width: 15 },
        { key: "theme", width: 18 },
        { key: "ind", width: 12 },
        { key: "smcb", width: 12 },
        { key: "mffi", width: 12 },
        { key: "sisd", width: 12 },
        { key: "farm", width: 12 },
        { key: "nonfarm", width: 12 },
        { key: "modelclf", width: 12 },
        { key: "lokos", width: 12 },
      ];

      // 7. Add Data Rows
      trainers.forEach((t, index) => {
        const row = worksheet.addRow([
          index + 1,
          t.full_name || "",
          t.mobile_no || "",
          t.district_name_en || "",
          t.designation || "",
          t.theme_name || "",
          t.induction ? "Yes" : "",
          t.tot_smcb ? "Yes" : "",
          t.tot_mffi ? "Yes" : "",
          t.tot_sisd ? "Yes" : "",
          t.tot_farm_lh ? "Yes" : "",
          t.tot_non_farm_lh ? "Yes" : "",
          t.tot_model_clf ? "Yes" : "",
          t.tot_lokos ? "Yes" : "",
        ]);

        // Apply borders and alignment to data cells
        row.eachCell((cell) => {
          cell.border = thinBorder;
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // 8. Generate and Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `Master_Trainers_${themeNameText.replace(/\s+/g, "_")}.xlsx`,
      );
    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to export data to Excel.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className="nic-btn-export"
      onClick={handleExport}
      disabled={exporting || !trainers || trainers.length === 0}
      title="Export EXACT format to Excel"
    >
      {exporting ? (
        <>
          <FaSpinner className="nic-spin" style={{ marginRight: "6px" }} />{" "}
          Exporting...
        </>
      ) : (
        <>
          <FaFileExcel style={{ marginRight: "6px" }} /> Export Excel
        </>
      )}
    </button>
  );
}
