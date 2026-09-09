// src\pages\PlanningDeptUpdate\Pages\PushHistory\PushExport.jsx
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import api from "../../../../api/axios";
import { usePDUContext } from "../../context/PDUContext";

export default function PushExport({ filters }) {
  const [isExporting, setIsExporting] = useState(false);
  const { aspirationalBlocks } = usePDUContext();

  const monthMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const getMappedNames = (apiBlockCode) => {
    const block = aspirationalBlocks.find(
      (b) => String(b.api_block_code) === String(apiBlockCode),
    );
    return {
      blockName: block?.block_name || apiBlockCode,
      districtName: block?.districtName || "Unknown",
    };
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all data matching current filters (passing a large limit to bypass pagination)
      const response = await api.get("/uppld/achievements/", {
        params: { ...filters, limit: 10000 },
      });
      const data = response.data?.results || response.data || [];

      if (data.length === 0) {
        alert("No data available to export based on current filters.");
        setIsExporting(false);
        return;
      }

      // Separate datasets by indicator
      const df_0511 = data.filter((d) => String(d.prog_code).endsWith("511"));
      const df_0512 = data.filter((d) => String(d.prog_code).endsWith("512"));

      const workbook = new ExcelJS.Workbook();
      const reportDate = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

      // Helper to generate a styled sheet
      const createSheet = (sheetName, dataset, indicatorCode) => {
        const worksheet = workbook.addWorksheet(sheetName);

        // --- MASTER TITLE ---
        const titleRow = worksheet.addRow([
          `PRAGATI SETU UPPLD PUSH REPORT AS OF ${reportDate}  |  INDICATOR ${indicatorCode}`,
        ]);
        worksheet.mergeCells(1, 1, 1, 11);
        titleRow.height = 40;
        titleRow.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0F3057" },
        };
        titleRow.getCell(1).font = {
          bold: true,
          size: 16,
          color: { argb: "FFFFFFFF" },
        };
        titleRow.getCell(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        titleRow.getCell(1).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (dataset.length === 0) {
          worksheet.addRow(["No Data Available"]);
          return;
        }

        // --- HEADERS ---
        const headers = [
          "S.No.",
          "Year",
          "Month Name",
          "District Name",
          "Block Name",
          "Program Name",
          "Program Head Name",
          "Period Name",
          "Lead Department Name",
          "Achievement (mon_ach)",
          "Disclaimer",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 30;

        headerRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF38A3C5" },
          };
          cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // --- COLUMNS WIDTHS ---
        worksheet.getColumn(1).width = 8; // S.No
        worksheet.getColumn(2).width = 12; // Year
        worksheet.getColumn(3).width = 12; // Month
        worksheet.getColumn(4).width = 20; // District
        worksheet.getColumn(5).width = 20; // Block
        worksheet.getColumn(6).width = 38; // Program Name
        worksheet.getColumn(7).width = 20; // Head
        worksheet.getColumn(8).width = 15; // Period
        worksheet.getColumn(9).width = 22; // Dept
        worksheet.getColumn(10).width = 25; // Achievement
        worksheet.getColumn(11).width = 75; // Disclaimer

        // --- POPULATE DATA ---
        dataset.forEach((row, index) => {
          const names = getMappedNames(row.block_code);
          const progName =
            indicatorCode === "0511"
              ? "Total Households added to SHGs"
              : "SHGs receiving Revolving Fund";
          const monthName = monthMap[row.month] || row.month;

          const dataRow = worksheet.addRow([
            index + 1,
            row.year,
            monthName,
            names.districtName,
            names.blockName,
            progName,
            row.prog_head_code,
            row.period_name_id,
            row.lead_dept_name_id,
            row.mon_ach,
            row.disclaimer,
          ]);

          dataRow.height = 45; // Taller row for disclaimer wrapping
          const isEven = index % 2 === 0;
          const rowBgColor = isEven ? "FFF9FAFB" : "FFFFFFFF";

          dataRow.eachCell((cell, colNumber) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: rowBgColor },
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            if (colNumber === 11) {
              // Disclaimer column alignment
              cell.alignment = {
                vertical: "middle",
                horizontal: "left",
                wrapText: true,
              };
              cell.font = { size: 9 };
            } else {
              cell.alignment = { vertical: "middle", horizontal: "center" };
            }
          });
        });
      };

      // Generate the two tabs
      createSheet("Pointer 0511 - SHG HHs", df_0511, "0511");
      createSheet("Pointer 0512 - RF", df_0512, "0512");

      // Save file
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `Pragati_Setu_UPPLD_Report_${reportDate}.xlsx`;
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName,
      );
    } catch (error) {
      console.error("Export Failed:", error);
      alert("Failed to generate Excel report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className="btn-export"
      onClick={handleExport}
      disabled={isExporting}
    >
      <div
        className="pdubtn-export-content"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <div className="btn-export-text-wrap">
          <span className="btn-export-text">
            {isExporting ? "Generating..." : "Download UPPLD Excel Report"}
          </span>
        </div>
      </div>
    </button>
  );
}
