// src\pages\StateLoginPortal\TMSStateLoginDashboard\TMSSummaryExport.jsx
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { FaFileExcel } from "react-icons/fa";

const COLORS = {
  navy: "FF17365D",
  blue: "FF2563A6",
  mediumBlue: "FF3D78B8",
  lightBlue: "FFEAF3FC",
  paleBlue: "FFF5F9FE",
  white: "FFFFFFFF",
  text: "FF24364B",
  muted: "FF66788A",
  border: "FFD8E4F0",
};

// dual: true  -> two columns (Batch count + Participant count)
// dual: false -> one column (same as on-screen table for 9A to 14)
const METRICS = [
  {
    key: "1_total_batches_created",
    label: "1 — Total batches created",
    dual: true,
  },
  { key: "2_scheduled_batches", label: "2 — Scheduled batches", dual: true },
  {
    key: "3_batches_pending_at_dmm",
    label: "3 — Batches pending at DMM",
    dual: true,
  },
  { key: "4_ongoing_batches", label: "4 — Ongoing batches", dual: true },
  { key: "5_completed_batches", label: "5 — Completed batches", dual: true },
  {
    key: "6_completed_batches_for_verification",
    label: "6 — Completed batches for verification",
    dual: true,
  },
  {
    key: "7_completed_batch_closed",
    label: "7 — Completed batch closed",
    dual: true,
  },
  {
    key: "8_batches_rejected_by_dmm",
    label: "8 — Batches rejected by DMM",
    dual: true,
  },
  {
    key: "9_total_batches_completed",
    label: "9 — Total batches completed (5+6+7)",
    dual: true,
  },
  {
    key: "9a_participants_trained",
    label: "9A — Participants trained",
    dual: false,
  },
  {
    key: "9b_participants_dropout",
    label: "9B — Participants dropout",
    dual: false,
  },
  {
    key: "10_total_target",
    label: "10 — Total target (Slot 1+2)",
    dual: false,
  },
  {
    key: "11_participants_onboarded",
    label: "11 — Participants onboarded",
    dual: false,
  },
  {
    key: "12_participants_enrolled_in_batches",
    label: "12 — Participants enrolled in batches",
    dual: false,
  },
  {
    key: "13_remaining_participants_for_enrollment",
    label: "13 — Remaining participants for enrollment",
    dual: false,
  },
  {
    key: "14_achievement_percentage",
    label: "14 — Achievement %",
    dual: false,
    percent: true,
  },
];

const solid = (argb) => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});

// Safe number (also handles strings like "0.02%" or "1,186")
const toNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const cleaned = typeof v === "string" ? v.replace(/[%,\s]/g, "") : v;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const styleHeaderCell = (cell, { fill, size = 9 } = {}) => {
  cell.font = {
    name: "Aptos",
    size,
    bold: true,
    color: { argb: COLORS.white },
  };
  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };
  cell.fill = solid(fill);
};

const downloadWorkbook = async (workbook, filename) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function TMSSummaryExport({
  reportData,
  financialYear,
  disabled,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportDirectExcel = async () => {
    if (!reportData || isExporting) return;
    setIsExporting(true);

    try {
      const { report_date, state_wide_summary, district_summaries } =
        reportData;

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Pragati Setu TMS";
      workbook.subject = "TMS Portal Summary";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("TMS Summary");
      sheet.properties.tabColor = { argb: COLORS.blue };

      // ---- Column layout ----
      let nextCol = 3;
      const layout = METRICS.map((m) => {
        const start = nextCol;
        nextCol += m.dual ? 2 : 1;
        return { ...m, start, end: nextCol - 1 };
      });
      const lastCol = nextCol - 1;

      sheet.columns = [
        { width: 8 },
        { width: 30 },
        ...layout.flatMap((m) =>
          m.dual ? [{ width: 15 }, { width: 18 }] : [{ width: 18 }],
        ),
      ];

      sheet.views = [
        {
          state: "frozen",
          xSplit: 2,
          ySplit: 5,
          topLeftCell: "C6",
          showGridLines: false,
        },
      ];

      // ---- Row 1: Title ----
      sheet.mergeCells(1, 1, 1, lastCol);
      const titleCell = sheet.getCell(1, 1);
      titleCell.value = "PRAGATI SETU-TMS PORTAL SUMMARY REPORT";
      titleCell.font = {
        name: "Aptos Display",
        size: 19,
        bold: true,
        color: { argb: COLORS.white },
      };
      titleCell.alignment = { vertical: "middle", indent: 1 };
      titleCell.fill = solid(COLORS.navy);
      sheet.getRow(1).height = 38;

      // ---- Row 2: Subtitle ----
      sheet.mergeCells(2, 1, 2, lastCol);
      const subtitleCell = sheet.getCell(2, 1);
      subtitleCell.value = `FY ${financialYear}  •  DATED: ${report_date || "—"}`;
      subtitleCell.font = {
        name: "Aptos",
        size: 10,
        color: { argb: COLORS.muted },
      };
      subtitleCell.alignment = { vertical: "middle", indent: 1 };
      subtitleCell.fill = solid(COLORS.lightBlue);
      sheet.getRow(2).height = 24;

      // ---- Row 3: spacer ----
      sheet.getRow(3).height = 9;

      // ---- Row 4: Group headers (numbered metrics) ----
      sheet.mergeCells(4, 1, 4, 2);
      const locationCell = sheet.getCell(4, 1);
      locationCell.value = "LOCATION";
      styleHeaderCell(locationCell, { fill: COLORS.navy });

      layout.forEach((m) => {
        if (m.dual) sheet.mergeCells(4, m.start, 4, m.end);
        const cell = sheet.getCell(4, m.start);
        cell.value = m.label;
        styleHeaderCell(cell, { fill: COLORS.navy });
      });
      sheet.getRow(4).height = 42;

      // ---- Row 5: Sub headers ----
      sheet.getCell(5, 1).value = "S. No.";
      sheet.getCell(5, 2).value = "District / State Name";
      [1, 2].forEach((c) => {
        const cell = sheet.getCell(5, c);
        styleHeaderCell(cell, { fill: COLORS.mediumBlue });
        if (c === 2) cell.alignment = { ...cell.alignment, horizontal: "left" };
      });

      layout.forEach((m) => {
        if (m.dual) {
          sheet.getCell(5, m.start).value = "Batch count";
          sheet.getCell(5, m.end).value = "Participant count";
        } else {
          sheet.getCell(5, m.start).value = m.percent ? "%" : "Count";
        }
        for (let c = m.start; c <= m.end; c += 1) {
          styleHeaderCell(sheet.getCell(5, c), { fill: COLORS.mediumBlue });
        }
      });
      sheet.getRow(5).height = 30;

      // ---- Data rows ----
      const records = [
        {
          serial: "—",
          name: "Uttar Pradesh",
          summary: state_wide_summary || {},
          isState: true,
        },
        ...(Array.isArray(district_summaries)
          ? district_summaries.map((dist, idx) => ({
              serial: idx + 1,
              name: dist?.district_name || "—",
              summary: dist?.summary || {},
              isState: false,
            }))
          : []),
      ];

      records.forEach((record, rowIndex) => {
        const b = record.summary.batch_counts || {};
        const p = record.summary.participant_counts || {};

        const values = [record.serial, record.name];
        layout.forEach((m) => {
          values.push(toNumber(b[m.key]));
          if (m.dual) values.push(toNumber(p[m.key]));
        });

        const row = sheet.addRow(values);
        const background = record.isState
          ? COLORS.lightBlue
          : rowIndex % 2 === 0
            ? COLORS.white
            : COLORS.paleBlue;

        row.height = record.isState ? 28 : 24;

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.font = {
            name: "Aptos",
            size: 10,
            bold: record.isState,
            color: { argb: COLORS.text },
          };
          cell.fill = solid(background);
          cell.border = {
            bottom: { style: "hair", color: { argb: COLORS.border } },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: colNumber === 2 ? "left" : "center",
            wrapText: colNumber === 2,
          };
        });

        layout.forEach((m) => {
          for (let c = m.start; c <= m.end; c += 1) {
            row.getCell(c).numFmt = m.percent ? '0.00"%"' : "#,##0";
          }
        });
      });

      // ---- Filter + print setup ----
      sheet.autoFilter = {
        from: { row: 5, column: 1 },
        to: { row: Math.max(5, sheet.rowCount), column: lastCol },
      };
      sheet.pageSetup = {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.25,
          right: 0.25,
          top: 0.5,
          bottom: 0.5,
          header: 0.2,
          footer: 0.2,
        },
      };

      const safeYear = String(financialYear || "export").replace(
        /[^a-z0-9_-]/gi,
        "_",
      );
      await downloadWorkbook(
        workbook,
        `TMS_Portal_Summary_Report_${safeYear}.xlsx`,
      );
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export the Excel file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = disabled || isExporting;

  return (
    <button
      className="btn-export"
      onClick={handleExportDirectExcel}
      disabled={isDisabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: isDisabled ? "#94a3b8" : "#10b981",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(16,185,129,0.2)",
      }}
    >
      <FaFileExcel /> {isExporting ? "Preparing Excel…" : "Export Excel"}
    </button>
  );
}
