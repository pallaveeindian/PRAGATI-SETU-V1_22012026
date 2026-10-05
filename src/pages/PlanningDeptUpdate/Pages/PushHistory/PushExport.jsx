// src/pages/PlanningDeptUpdate/Pages/PushHistory/PushExport.jsx
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

  const getMappedNames = (apiBlockCode, apiDistCode) => {
    const block = aspirationalBlocks.find(
      (b) => String(b.api_block_code) === String(apiBlockCode),
    );
    const distFallback = aspirationalBlocks.find(
      (b) =>
        String(b.api_district_code) === String(apiDistCode) &&
        b.districtName &&
        b.districtName !== "Unknown",
    );

    return {
      blockName: block?.block_name || block?.blockNameEn || apiBlockCode || "—",
      districtName:
        block?.districtName && block.districtName !== "Unknown"
          ? block.districtName
          : distFallback?.districtName || apiDistCode || "Unknown",
    };
  };

  const formatTwoDecimals = (val, fallback = "0.00") => {
    if (val === null || val === undefined || val === "") return fallback;
    const num = Number(val);
    return Number.isNaN(num) ? fallback : num.toFixed(2);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return isoString;

      const datePart = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timePart = d
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();

      return `${datePart} ${timePart}`;
    } catch {
      return isoString;
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(filters || {}).filter(([_, v]) => v !== ""),
      );

      // Fetch all data matching current filters
      const response = await api.get("/uppld/achievements/", {
        params: { ...activeParams, limit: 10000 },
      });
      const data = response.data?.results || response.data || [];

      if (data.length === 0) {
        alert("No data available to export based on current filters.");
        setIsExporting(false);
        return;
      }

      // Group records by (year + month + block_code) so 0511 & 0512 sit side-by-side
      const groupedMap = new Map();

      data.forEach((row) => {
        const bCode = row.block_code ?? row.Block_code ?? "";
        const dCode = row.dist_code ?? "";
        const yr = row.year ?? "";
        const mo = row.month ?? "";
        const key = `${yr}_${mo}_${bCode}`;

        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            year: yr,
            month: mo,
            dist_code: dCode,
            block_code: bCode,
            row0511: null,
            row0512: null,
            updated_at: row.updated_at || row.created_at || null,
          });
        }

        const group = groupedMap.get(key);
        const pCode = String(row.prog_code || "");

        if (pCode.endsWith("511")) {
          group.row0511 = row;
        } else if (pCode.endsWith("512")) {
          group.row0512 = row;
        }

        const rowTime = row.updated_at || row.created_at;
        if (
          rowTime &&
          (!group.updated_at || new Date(rowTime) > new Date(group.updated_at))
        ) {
          group.updated_at = rowTime;
        }
      });

      const mergedRows = Array.from(groupedMap.values());

      const workbook = new ExcelJS.Workbook();
      const reportDate = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

      const worksheet = workbook.addWorksheet("UPPLD Push Report");

      // --- 2-ROW HEADER DEFINITIONS (EXACT MATCH TO IMAGE) ---
      const topHeaders = [
        "Sno",
        "District",
        "Block",
        "Month",
        "Financial Year",
        "Total number of elligible households (HHs) added to SHGs",
        "1",
        "5.3 Total number of elligible households (HHs) added to SHGs",
        "Total number of SHGs receiving revolving fund in the block",
        "Total number of SHGs in the block",
        "5.4 Percentage of SHGs that have received Revolving Fund against total SHGs in the block",
        "Timestamp",
      ];

      const subHeaders = [
        "",
        "",
        "",
        "",
        "",
        "Numerator",
        "Denominator",
        "Achievement",
        "Numerator",
        "Denominator",
        "Achievement",
        "",
      ];

      const headerRow1 = worksheet.addRow(topHeaders);
      const headerRow2 = worksheet.addRow(subHeaders);

      headerRow1.height = 115;
      headerRow2.height = 24;

      // Vertically merge columns that span both header rows (Cols 1-5 and Col 12)
      [1, 2, 3, 4, 5, 12].forEach((colIdx) => {
        worksheet.mergeCells(1, colIdx, 2, colIdx);
      });

      const thinBorder = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };

      // Style Header Row 1
      headerRow1.eachCell((cell) => {
        cell.font = { bold: true, size: 11, color: { argb: "FF000000" } };
        cell.alignment = {
          vertical: "top",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = thinBorder;
      });

      // Style Header Row 2
      headerRow2.eachCell((cell) => {
        cell.font = { bold: true, size: 11, color: { argb: "FF000000" } };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = thinBorder;
      });

      // --- COLUMN WIDTHS ---
      worksheet.getColumn(1).width = 8; // Sno
      worksheet.getColumn(2).width = 18; // District
      worksheet.getColumn(3).width = 18; // Block
      worksheet.getColumn(4).width = 15; // Month
      worksheet.getColumn(5).width = 15; // Financial Year
      worksheet.getColumn(6).width = 16; // 0511 Numerator
      worksheet.getColumn(7).width = 15; // 0511 Denominator
      worksheet.getColumn(8).width = 16; // 0511 Achievement
      worksheet.getColumn(9).width = 16; // 0512 Numerator
      worksheet.getColumn(10).width = 18; // 0512 Denominator
      worksheet.getColumn(11).width = 18; // 0512 Achievement
      worksheet.getColumn(12).width = 18; // Timestamp

      // --- POPULATE DATA ROWS ---
      mergedRows.forEach((group, index) => {
        const names = getMappedNames(group.block_code, group.dist_code);
        const monthName = monthMap[Number(group.month)] || group.month || "—";
        const r511 = group.row0511;
        const r512 = group.row0512;

        const dataRow = worksheet.addRow([
          index + 1,
          names.districtName,
          names.blockName,
          monthName,
          group.year || "—",
          r511
            ? formatTwoDecimals(r511.mon_ach_numirator ?? r511.mon_ach, "0.00")
            : "—",
          r511 ? formatTwoDecimals(r511.mon_ach_denominator ?? 1, "1.00") : "—",
          r511 ? formatTwoDecimals(r511.mon_ach, "0.00") : "—",
          r512 ? formatTwoDecimals(r512.mon_ach_numirator ?? 0, "0.00") : "—",
          r512 ? formatTwoDecimals(r512.mon_ach_denominator ?? 0, "0.00") : "—",
          r512 ? formatTwoDecimals(r512.mon_ach, "0.00") : "—",
          formatTimestamp(group.updated_at),
        ]);

        dataRow.height = 32;

        dataRow.eachCell((cell) => {
          cell.font = { size: 11, color: { argb: "FF000000" } };
          cell.border = thinBorder;
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });
      });

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
