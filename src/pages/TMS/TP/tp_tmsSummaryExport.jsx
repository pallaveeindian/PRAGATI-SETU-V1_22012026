// src\pages\TMS\TP\tp_tmsSummaryExport.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import ExcelJS from "exceljs";
import { FaFileExcel } from "react-icons/fa";
import api from "../../../api/axios";

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
  green: "FFE8F5EC",
  red: "FFFCE9E9",
  orange: "FFFFF2DB",
};

const METRICS = [
  { key: "1_total_batches_created", label: "1 — Total batches created" },
  { key: "2_scheduled_batches", label: "2 — Scheduled batches" },
  { key: "3_batches_pending_at_dmm", label: "3 — Batches pending at DMM" },
  { key: "4_ongoing_batches", label: "4 — Ongoing batches" },
  { key: "5_completed_batches", label: "5 — Completed batches" },
  {
    key: "6_completed_batches_for_verification",
    label: "6 — Completed batches for verification",
  },
  { key: "7_completed_batch_closed", label: "7 — Completed batches closed" },
  { key: "8_batches_rejected_by_dmm", label: "8 — Batches rejected by DMM" },
  { key: "9_total_batches_completed", label: "9 — Total batches completed" },
  { key: "9a_participants_trained", label: "9A — Participants trained" },
  { key: "9b_participants_dropout", label: "9B — Participants dropped out" },
  { key: "10_total_target", label: "10 — Total target" },
  { key: "11_participants_onboarded", label: "11 — Participants onboarded" },
  {
    key: "12_participants_enrolled_in_batches",
    label: "12 — Participants enrolled in batches",
  },
  {
    key: "13_remaining_participants_for_enrollment",
    label: "13 — Participants remaining for enrollment",
  },
  { key: "14_achievement_percentage", label: "14 — Achievement %" },
];

const numberValue = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const metricValue = (report, group, key) =>
  numberValue(report?.state_wide_summary?.[group]?.[key]);

const comparisonMetricValue = (report, key) => {
  const batchValue = report?.state_wide_summary?.batch_counts?.[key];

  if (batchValue !== null && batchValue !== undefined && batchValue !== "") {
    return numberValue(batchValue);
  }

  if (key.includes("participants")) {
    return numberValue(report?.state_wide_summary?.participant_counts?.[key]);
  }

  return 0;
};

const planName = (plan) =>
  String(
    plan?.training_name || plan?.name || `Training Plan ${plan?.id ?? ""}`,
  ).trim();

const yieldToBrowser = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });

const styleTitle = (sheet, title, subtitle, columnCount) => {
  sheet.mergeCells(1, 1, 1, columnCount);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = {
    name: "Aptos Display",
    size: 19,
    bold: true,
    color: { argb: COLORS.white },
  };
  titleCell.alignment = { vertical: "middle", indent: 1 };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.navy },
  };
  sheet.getRow(1).height = 38;

  sheet.mergeCells(2, 1, 2, columnCount);
  const subtitleCell = sheet.getCell(2, 1);
  subtitleCell.value = subtitle;
  subtitleCell.font = {
    name: "Aptos",
    size: 10,
    color: { argb: COLORS.muted },
  };
  subtitleCell.alignment = { vertical: "middle", indent: 1 };
  subtitleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.lightBlue },
  };
  sheet.getRow(2).height = 24;
  sheet.getRow(3).height = 9;
};

const styleSectionTitle = (sheet, rowNumber, title, columnCount) => {
  sheet.mergeCells(rowNumber, 1, rowNumber, columnCount);
  const cell = sheet.getCell(rowNumber, 1);
  cell.value = title;
  cell.font = {
    name: "Aptos",
    size: 11,
    bold: true,
    color: { argb: COLORS.white },
  };
  cell.alignment = { vertical: "middle", indent: 1 };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.blue },
  };
  sheet.getRow(rowNumber).height = 27;
};

const styleColumnHeaders = (sheet, rowNumber, startColumn, labels) => {
  labels.forEach((label, index) => {
    const cell = sheet.getCell(rowNumber, startColumn + index);
    cell.value = label;
    cell.font = {
      name: "Aptos",
      size: 9,
      bold: true,
      color: { argb: COLORS.white },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.mediumBlue },
    };
    cell.border = {
      bottom: { style: "medium", color: { argb: COLORS.navy } },
    };
  });

  sheet.getRow(rowNumber).height = 34;
};

const styleDataRow = (row, rowIndex, options = {}) => {
  const background =
    options.background || (rowIndex % 2 === 0 ? COLORS.white : COLORS.paleBlue);

  row.height = options.height || 23;

  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    cell.font = {
      name: "Aptos",
      size: 10,
      color: { argb: COLORS.text },
      bold: Boolean(options.bold),
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: background },
    };
    cell.border = {
      bottom: { style: "hair", color: { argb: COLORS.border } },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: columnNumber === 1 ? "left" : "center",
      wrapText: columnNumber === 2,
    };
  });
};

const addDetailedReportSheet = (
  workbook,
  { sheetName, title, subtitle, report, tabColor = COLORS.blue },
) => {
  const sheet = workbook.addWorksheet(sheetName);
  sheet.properties.tabColor = { argb: tabColor };
  sheet.views = [
    {
      state: "frozen",
      xSplit: 2,
      ySplit: 5,
      topLeftCell: "C6",
      showGridLines: false,
    },
  ];

  const finalColumn = 2 + METRICS.length * 2;
  const finalColumnLetter = sheet.getColumn(finalColumn).letter;

  sheet.columns = [
    { width: 9 },
    { width: 30 },
    ...METRICS.flatMap(() => [{ width: 16 }, { width: 18 }]),
  ];

  styleTitle(sheet, title, subtitle, finalColumn);

  sheet.mergeCells(4, 1, 4, 2);
  const locationGroup = sheet.getCell(4, 1);
  locationGroup.value = "LOCATION";
  locationGroup.font = {
    name: "Aptos",
    size: 9,
    bold: true,
    color: { argb: COLORS.white },
  };
  locationGroup.alignment = { horizontal: "center", vertical: "middle" };
  locationGroup.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.navy },
  };

  METRICS.forEach((metric, index) => {
    const firstColumn = 3 + index * 2;
    const lastColumn = firstColumn + 1;

    sheet.mergeCells(4, firstColumn, 4, lastColumn);
    const groupCell = sheet.getCell(4, firstColumn);
    groupCell.value = metric.label;
    groupCell.font = {
      name: "Aptos",
      size: 9,
      bold: true,
      color: { argb: COLORS.white },
    };
    groupCell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    groupCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.navy },
    };

    [firstColumn, lastColumn].forEach((column) => {
      sheet.getCell(5, column).font = {
        name: "Aptos",
        size: 9,
        bold: true,
        color: { argb: COLORS.white },
      };
      sheet.getCell(5, column).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      sheet.getCell(5, column).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLORS.mediumBlue },
      };
    });

    sheet.getCell(5, firstColumn).value = "Batch count";
    sheet.getCell(5, lastColumn).value = "Participant count";
  });

  sheet.getCell(5, 1).value = "S. No.";
  sheet.getCell(5, 2).value = "District / State Name";

  [1, 2].forEach((column) => {
    const cell = sheet.getCell(5, column);
    cell.font = {
      name: "Aptos",
      size: 9,
      bold: true,
      color: { argb: COLORS.white },
    };
    cell.alignment = {
      horizontal: column === 1 ? "center" : "left",
      vertical: "middle",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.mediumBlue },
    };
  });

  sheet.getRow(4).height = 42;
  sheet.getRow(5).height = 36;

  const records = [
    {
      serial: "—",
      name: "STATE WIDE SUMMARY",
      summary: report?.state_wide_summary || {},
      isState: true,
    },
    ...(Array.isArray(report?.district_summaries)
      ? report.district_summaries.map((district, index) => ({
          serial: index + 1,
          name: district?.district_name || "—",
          summary: district?.summary || {},
          isState: false,
        }))
      : []),
  ];

  records.forEach((record, rowIndex) => {
    const values = [record.serial, record.name];

    METRICS.forEach((metric) => {
      values.push(
        numberValue(record.summary?.batch_counts?.[metric.key]),
        numberValue(record.summary?.participant_counts?.[metric.key]),
      );
    });

    const row = sheet.addRow(values);
    styleDataRow(row, rowIndex, {
      background: record.isState ? COLORS.lightBlue : undefined,
      bold: record.isState,
      height: record.isState ? 28 : 24,
    });

    row.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    row.getCell(2).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };

    METRICS.forEach((metric, index) => {
      const firstColumn = 3 + index * 2;
      row.getCell(firstColumn).numFmt =
        metric.key === "14_achievement_percentage" ? "0.00" : "#,##0.##";
      row.getCell(firstColumn + 1).numFmt =
        metric.key === "14_achievement_percentage" ? "0.00" : "#,##0.##";
    });
  });

  sheet.autoFilter = {
    from: { row: 5, column: 1 },
    to: { row: Math.max(5, sheet.rowCount), column: finalColumn },
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
  sheet.headerFooter.oddFooter = `&LPragati Setu TMS&CPage &P of &N&R${finalColumnLetter}`;

  return sheet;
};

const addExecutiveSummarySheet = (
  workbook,
  themeReport,
  planReports,
  details,
) => {
  const sheet = workbook.addWorksheet("Executive Summary");
  sheet.properties.tabColor = { argb: COLORS.navy };
  sheet.views = [{ showGridLines: false }];
  sheet.columns = Array.from({ length: 10 }, () => ({ width: 18 }));

  styleTitle(
    sheet,
    "TMS PORTAL SUMMARY — THEME ANALYSIS",
    `${details.themeName}  •  FY ${details.financialYear}  •  Report date: ${
      themeReport?.report_date || "—"
    }`,
    10,
  );

  const cards = [
    {
      label: "TOTAL BATCHES CREATED",
      value: metricValue(
        themeReport,
        "batch_counts",
        "1_total_batches_created",
      ),
    },
    {
      label: "BATCHES COMPLETED",
      value: metricValue(
        themeReport,
        "batch_counts",
        "9_total_batches_completed",
      ),
    },
    {
      label: "PARTICIPANTS TRAINED",
      value: comparisonMetricValue(themeReport, "9a_participants_trained"),
    },
    {
      label: "PARTICIPANT DROPOUTS",
      value: comparisonMetricValue(themeReport, "9b_participants_dropout"),
    },
    { label: "TRAINING PLANS ANALYSED", value: planReports.length },
  ];

  cards.forEach((card, index) => {
    const startColumn = index * 2 + 1;
    const endColumn = startColumn + 1;

    sheet.mergeCells(4, startColumn, 4, endColumn);
    sheet.mergeCells(5, startColumn, 6, endColumn);

    const labelCell = sheet.getCell(4, startColumn);
    labelCell.value = card.label;
    labelCell.font = {
      name: "Aptos",
      size: 8,
      bold: true,
      color: { argb: COLORS.blue },
    };
    labelCell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    labelCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.lightBlue },
    };

    const valueCell = sheet.getCell(5, startColumn);
    valueCell.value = card.value;
    valueCell.font = {
      name: "Aptos Display",
      size: 21,
      bold: true,
      color: { argb: COLORS.navy },
    };
    valueCell.alignment = { horizontal: "center", vertical: "middle" };
    valueCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.paleBlue },
    };
    valueCell.numFmt = "#,##0.##";
  });

  sheet.getRow(4).height = 30;
  sheet.getRow(5).height = 30;
  sheet.getRow(6).height = 12;

  styleSectionTitle(sheet, 8, "TOP TRAINING PLANS", 10);

  const planHeaders = [
    "Training Plan",
    "Batches Created",
    "Batches Completed",
    "Participants Trained",
    "Dropouts",
    "Total Target",
    "Participants Onboarded",
    "Participants Enrolled",
    "Achievement %",
    "Share of Theme Trained",
  ];
  styleColumnHeaders(sheet, 9, 1, planHeaders);

  const rankedPlans = [...planReports].sort(
    (a, b) =>
      comparisonMetricValue(b.report, "9a_participants_trained") -
      comparisonMetricValue(a.report, "9a_participants_trained"),
  );
  const topPlans = rankedPlans.slice(0, 10);

  if (!topPlans.length) {
    sheet.mergeCells(10, 1, 10, 10);
    sheet.getCell(10, 1).value = "No training plans were found for this theme.";
    sheet.getCell(10, 1).font = {
      name: "Aptos",
      italic: true,
      color: { argb: COLORS.muted },
    };
  } else {
    const themeTrained = comparisonMetricValue(
      themeReport,
      "9a_participants_trained",
    );

    topPlans.forEach((entry, index) => {
      const report = entry.report;
      const trained = comparisonMetricValue(report, "9a_participants_trained");

      const row = sheet.addRow([
        entry.name,
        comparisonMetricValue(report, "1_total_batches_created"),
        comparisonMetricValue(report, "9_total_batches_completed"),
        trained,
        comparisonMetricValue(report, "9b_participants_dropout"),
        comparisonMetricValue(report, "10_total_target"),
        comparisonMetricValue(report, "11_participants_onboarded"),
        comparisonMetricValue(report, "12_participants_enrolled_in_batches"),
        comparisonMetricValue(report, "14_achievement_percentage"),
        themeTrained ? trained / themeTrained : 0,
      ]);

      styleDataRow(row, index);
      row.getCell(1).alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };
      for (let column = 2; column <= 9; column += 1) {
        row.getCell(column).numFmt = column === 9 ? "0.00" : "#,##0.##";
      }
      row.getCell(10).numFmt = "0.0%";
    });
  }

  const reconciliationTitleRow = 12 + Math.max(topPlans.length, 1);
  styleSectionTitle(
    sheet,
    reconciliationTitleRow,
    "THEME TOTAL VS SUM OF TRAINING PLAN REPORTS",
    10,
  );

  const reconciliationHeaderRow = reconciliationTitleRow + 1;
  styleColumnHeaders(sheet, reconciliationHeaderRow, 1, [
    "Metric",
    "All Theme Data",
    "Sum of Plan Reports",
    "Theme Minus Plans",
  ]);

  const reconciliationMetrics = [
    { key: "1_total_batches_created", label: "Total batches created" },
    { key: "9_total_batches_completed", label: "Total batches completed" },
    { key: "9a_participants_trained", label: "Participants trained" },
    { key: "9b_participants_dropout", label: "Participants dropped out" },
    { key: "10_total_target", label: "Total target" },
    {
      key: "12_participants_enrolled_in_batches",
      label: "Participants enrolled in batches",
    },
  ];

  reconciliationMetrics.forEach((metric, index) => {
    const themeValue = comparisonMetricValue(themeReport, metric.key);
    const plansValue = planReports.reduce(
      (sum, entry) => sum + comparisonMetricValue(entry.report, metric.key),
      0,
    );
    const row = sheet.addRow([
      metric.label,
      themeValue,
      plansValue,
      themeValue - plansValue,
    ]);

    styleDataRow(row, index);
    row.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };
    for (let column = 2; column <= 4; column += 1) {
      row.getCell(column).numFmt = "#,##0.##";
    }

    const differenceCell = row.getCell(4);
    differenceCell.font = {
      name: "Aptos",
      size: 10,
      bold: true,
      color: {
        argb: themeValue === plansValue ? COLORS.blue : COLORS.text,
      },
    };
    differenceCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor:
        themeValue === plansValue
          ? { argb: COLORS.green }
          : { argb: COLORS.orange },
    };
  });

  const noteRow = reconciliationHeaderRow + reconciliationMetrics.length + 2;
  sheet.mergeCells(noteRow, 1, noteRow, 10);
  sheet.getCell(noteRow, 1).value =
    "Variance is calculated as All Theme Data minus the sum of the training-plan reports. A non-zero variance can indicate records that are not assigned to a training plan.";
  sheet.getCell(noteRow, 1).font = {
    name: "Aptos",
    size: 9,
    italic: true,
    color: { argb: COLORS.muted },
  };
  sheet.getCell(noteRow, 1).alignment = {
    vertical: "middle",
    wrapText: true,
  };
  sheet.getRow(noteRow).height = 34;

  return sheet;
};

const addPlanComparisonSheet = (workbook, themeReport, planReports) => {
  const sheet = workbook.addWorksheet("Plan Comparison");
  sheet.properties.tabColor = { argb: COLORS.mediumBlue };
  sheet.views = [
    {
      state: "frozen",
      ySplit: 4,
      topLeftCell: "A5",
      showGridLines: false,
    },
  ];

  const headers = [
    "Rank",
    "Training Plan",
    "Plan ID",
    "Batches Created",
    "Scheduled",
    "Pending at DMM",
    "Ongoing",
    "Batches Completed",
    "Rejected",
    "Participants Trained",
    "Dropouts",
    "Total Target",
    "Onboarded",
    "Enrolled",
    "Remaining for Enrollment",
    "Achievement %",
    "Share of Theme Batches",
    "Share of Theme Trained",
  ];
  const widths = [
    9, 30, 12, 17, 15, 17, 14, 18, 13, 21, 14, 16, 16, 16, 23, 15, 20, 20,
  ];
  sheet.columns = widths.map((width) => ({ width }));

  styleTitle(
    sheet,
    "TRAINING PLAN COMPARISON",
    "Theme-level training plan reports • Sort or filter the header row to compare plans",
    headers.length,
  );
  styleColumnHeaders(sheet, 4, 1, headers);

  const themeCreated = comparisonMetricValue(
    themeReport,
    "1_total_batches_created",
  );
  const themeTrained = comparisonMetricValue(
    themeReport,
    "9a_participants_trained",
  );

  const sortedPlans = [...planReports].sort(
    (a, b) =>
      comparisonMetricValue(b.report, "9a_participants_trained") -
      comparisonMetricValue(a.report, "9a_participants_trained"),
  );

  if (!sortedPlans.length) {
    sheet.mergeCells(5, 1, 5, headers.length);
    sheet.getCell(5, 1).value = "No training plans were found for this theme.";
    sheet.getCell(5, 1).font = {
      name: "Aptos",
      italic: true,
      color: { argb: COLORS.muted },
    };
  } else {
    sortedPlans.forEach((entry, index) => {
      const report = entry.report;
      const created = comparisonMetricValue(report, "1_total_batches_created");
      const trained = comparisonMetricValue(report, "9a_participants_trained");

      const row = sheet.addRow([
        index + 1,
        entry.name,
        entry.plan?.id ?? "—",
        created,
        comparisonMetricValue(report, "2_scheduled_batches"),
        comparisonMetricValue(report, "3_batches_pending_at_dmm"),
        comparisonMetricValue(report, "4_ongoing_batches"),
        comparisonMetricValue(report, "9_total_batches_completed"),
        comparisonMetricValue(report, "8_batches_rejected_by_dmm"),
        trained,
        comparisonMetricValue(report, "9b_participants_dropout"),
        comparisonMetricValue(report, "10_total_target"),
        comparisonMetricValue(report, "11_participants_onboarded"),
        comparisonMetricValue(report, "12_participants_enrolled_in_batches"),
        comparisonMetricValue(
          report,
          "13_remaining_participants_for_enrollment",
        ),
        comparisonMetricValue(report, "14_achievement_percentage"),
        themeCreated ? created / themeCreated : 0,
        themeTrained ? trained / themeTrained : 0,
      ]);

      styleDataRow(row, index);
      row.getCell(2).alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };
      for (let column = 4; column <= 16; column += 1) {
        row.getCell(column).numFmt = column === 16 ? "0.00" : "#,##0.##";
      }
      row.getCell(17).numFmt = "0.0%";
      row.getCell(18).numFmt = "0.0%";
    });
  }

  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: Math.max(4, sheet.rowCount), column: headers.length },
  };
  sheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  return sheet;
};

const addKpiMatrixSheet = (
  workbook,
  planReports,
  themeReport,
  group,
  config,
) => {
  const sheet = workbook.addWorksheet(config.sheetName);
  sheet.properties.tabColor = { argb: config.tabColor };
  sheet.views = [
    {
      state: "frozen",
      ySplit: 4,
      xSplit: 1,
      topLeftCell: "B5",
      showGridLines: false,
    },
  ];

  const headers = [
    "Metric",
    "All Theme",
    "Sum of Plans",
    "Theme Minus Plans",
    ...planReports.map((entry) => entry.name.slice(0, 30)),
  ];
  sheet.columns = [
    { width: 42 },
    { width: 17 },
    { width: 18 },
    { width: 20 },
    ...planReports.map(() => ({ width: 20 })),
  ];

  styleTitle(
    sheet,
    config.title,
    "Each row is one API metric. Training plan columns show the matching plan-scoped report.",
    headers.length,
  );
  styleColumnHeaders(sheet, 4, 1, headers);

  METRICS.forEach((metric, index) => {
    const themeValue = metricValue(themeReport, group, metric.key);
    const planValues = planReports.map((entry) =>
      metricValue(entry.report, group, metric.key),
    );
    const isAdditive = metric.key !== "14_achievement_percentage";
    const planSum = isAdditive
      ? planValues.reduce((sum, value) => sum + value, 0)
      : "—";
    const variance = isAdditive ? themeValue - planSum : "—";

    const row = sheet.addRow([
      metric.label,
      themeValue,
      planSum,
      variance,
      ...planValues,
    ]);
    styleDataRow(row, index);
    row.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };

    for (let column = 2; column <= row.cellCount; column += 1) {
      row.getCell(column).numFmt =
        metric.key === "14_achievement_percentage" ? "0.00" : "#,##0.##";
    }

    if (isAdditive && typeof variance === "number") {
      const varianceCell = row.getCell(4);
      varianceCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: variance === 0 ? COLORS.green : COLORS.orange,
      };
      varianceCell.font = {
        name: "Aptos",
        size: 10,
        bold: true,
        color: { argb: COLORS.text },
      };
    }
  });

  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: Math.max(4, sheet.rowCount), column: headers.length },
  };
  sheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  return sheet;
};

const districtKey = (district) =>
  String(district?.district_name || "")
    .trim()
    .toLocaleLowerCase();

const districtSummaryMap = (report) => {
  const result = new Map();
  const districts = Array.isArray(report?.district_summaries)
    ? report.district_summaries
    : [];

  districts.forEach((district) => {
    const key = districtKey(district);
    if (key) result.set(key, district?.summary || {});
  });

  return result;
};

const addDistrictComparisonSheet = (workbook, themeReport, planReports) => {
  const sheet = workbook.addWorksheet("District Comparison");
  sheet.properties.tabColor = { argb: "FF4F83B8" };
  sheet.views = [
    {
      state: "frozen",
      ySplit: 4,
      xSplit: 1,
      topLeftCell: "B5",
      showGridLines: false,
    },
  ];

  const headers = [
    "District / State",
    "Scope",
    "Training Plan",
    "Batches Created",
    "Scheduled",
    "Pending at DMM",
    "Ongoing",
    "Batches Completed",
    "Rejected",
    "Participants Trained",
    "Dropouts",
    "Total Target",
    "Participants Enrolled",
    "Remaining for Enrollment",
    "Achievement %",
  ];
  sheet.columns = [
    { width: 27 },
    { width: 16 },
    { width: 30 },
    ...Array.from({ length: 12 }, () => ({ width: 19 })),
  ];

  styleTitle(
    sheet,
    "DISTRICT AND TRAINING PLAN COMPARISON",
    "One row per district and report scope. Includes the theme total and every training-plan report.",
    headers.length,
  );
  styleColumnHeaders(sheet, 4, 1, headers);

  const allDistricts = new Map();
  const collectDistricts = (report) => {
    const districts = Array.isArray(report?.district_summaries)
      ? report.district_summaries
      : [];
    districts.forEach((district) => {
      const key = districtKey(district);
      if (key && !allDistricts.has(key)) {
        allDistricts.set(key, district.district_name || "—");
      }
    });
  };

  collectDistricts(themeReport);
  planReports.forEach((entry) => collectDistricts(entry.report));

  const themeDistricts = districtSummaryMap(themeReport);
  const plansByDistrict = planReports.map((entry) => ({
    entry,
    districts: districtSummaryMap(entry.report),
  }));

  const comparisonKeys = [
    "1_total_batches_created",
    "2_scheduled_batches",
    "3_batches_pending_at_dmm",
    "4_ongoing_batches",
    "9_total_batches_completed",
    "8_batches_rejected_by_dmm",
    "9a_participants_trained",
    "9b_participants_dropout",
    "10_total_target",
    "12_participants_enrolled_in_batches",
    "13_remaining_participants_for_enrollment",
    "14_achievement_percentage",
  ];

  const makeValues = (summary) =>
    comparisonKeys.map((key) => {
      const value = summary?.batch_counts?.[key];
      if (value !== null && value !== undefined && value !== "") {
        return numberValue(value);
      }
      if (key.includes("participants")) {
        return numberValue(summary?.participant_counts?.[key]);
      }
      return 0;
    });

  const records = [
    {
      district: "STATE WIDE SUMMARY",
      scope: "All Theme",
      trainingPlan: "All training plans",
      values: makeValues(themeReport?.state_wide_summary),
      isTheme: true,
    },
    ...planReports.map((entry) => ({
      district: "STATE WIDE SUMMARY",
      scope: "Training Plan",
      trainingPlan: entry.name,
      values: makeValues(entry.report?.state_wide_summary),
      isTheme: false,
    })),
  ];

  [...allDistricts.entries()].forEach(([key, name]) => {
    const themeSummary = themeDistricts.get(key);
    if (themeSummary) {
      records.push({
        district: name,
        scope: "All Theme",
        trainingPlan: "All training plans",
        values: makeValues(themeSummary),
        isTheme: true,
      });
    }

    plansByDistrict.forEach(({ entry, districts }) => {
      records.push({
        district: name,
        scope: "Training Plan",
        trainingPlan: entry.name,
        values: makeValues(districts.get(key) || {}),
        isTheme: false,
      });
    });
  });

  records.forEach((record, index) => {
    const row = sheet.addRow([
      record.district,
      record.scope,
      record.trainingPlan,
      ...record.values,
    ]);
    styleDataRow(row, index, {
      background: record.isTheme ? COLORS.lightBlue : undefined,
      bold: record.isTheme,
    });
    row.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };
    row.getCell(3).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };
    for (let column = 4; column <= headers.length; column += 1) {
      row.getCell(column).numFmt =
        column === headers.length ? "0.00" : "#,##0.##";
    }
  });

  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: Math.max(4, sheet.rowCount), column: headers.length },
  };
  sheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  return sheet;
};

const createUniqueSheetName = (workbook, candidate) => {
  const base =
    String(candidate || "Plan Details")
      .replace(/[\\/?*:\[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 31) || "Plan Details";

  let name = base;
  let suffix = 2;
  const existing = () =>
    workbook.worksheets.some(
      (sheet) => sheet.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );

  while (existing()) {
    const ending = ` (${suffix})`;
    name = `${base.slice(0, 31 - ending.length)}${ending}`;
    suffix += 1;
  }

  return name;
};

const fetchPlanReports = async (
  plans,
  financialYear,
  selectedTheme,
  setProgress,
) => {
  const reports = new Array(plans.length);
  const failures = [];
  let nextIndex = 0;
  let completed = 0;

  const workerCount = Math.min(4, plans.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= plans.length) return;

      const plan = plans[index];

      try {
        const response = await api.get("/tms/reports/portal-summary/", {
          params: {
            financial_year: financialYear,
            theme: selectedTheme,
            training_plan: plan.id,
          },
        });

        if (response.data?.status !== "success") {
          throw new Error(
            response.data?.error ||
              "The report API returned an unsuccessful response.",
          );
        }

        reports[index] = response.data;
      } catch (error) {
        failures.push({
          name: planName(plan),
          message:
            error?.response?.data?.error ||
            error?.message ||
            "Unknown API error",
        });
      } finally {
        completed += 1;
        setProgress(
          8 + Math.round((completed / Math.max(plans.length, 1)) * 60),
        );
        await yieldToBrowser();
      }
    }
  });

  await Promise.all(workers);

  if (failures.length) {
    const firstFailure = failures[0];
    const remaining =
      failures.length > 1 ? ` (${failures.length - 1} more failed)` : "";
    throw new Error(
      `Could not load every training-plan report. ${firstFailure.name}: ${firstFailure.message}${remaining}. No workbook was generated so the analysis is not incomplete.`,
    );
  }

  return reports;
};

const downloadWorkbook = (workbook, filename) =>
  workbook.xlsx.writeBuffer().then((buffer) => {
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
  });

export default function TpTmsSummaryExport({
  reportData,
  financialYear,
  disabled,
  role,
  selectedTheme,
  selectedPlan,
  themeName,
  trainingPlans = [],
  trainingPlansLoading = false,
  trainingPlansLoadError = false,
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");

  const handleExport = async () => {
    if (!reportData) return;

    const isSmmuAllPlansExport =
      String(role || "").toLowerCase() === "smmu" && !selectedPlan;

    if (isSmmuAllPlansExport && !selectedTheme) {
      alert(
        "The SMMU theme could not be identified. Please refresh the page and try again.",
      );
      return;
    }

    if (isSmmuAllPlansExport && trainingPlansLoading) {
      alert("Training plans are still loading. Please try again in a moment.");
      return;
    }

    if (isSmmuAllPlansExport && trainingPlansLoadError) {
      alert(
        "Training plans could not be loaded. Please refresh the page and try again.",
      );
      return;
    }

    setIsExporting(true);
    setProgress(2);
    setPhase("Preparing the export…");

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Pragati Setu TMS";
      workbook.subject = "TMS Portal Summary";
      workbook.created = new Date();

      if (!isSmmuAllPlansExport) {
        setPhase("Formatting the summary workbook…");
        setProgress(20);
        await yieldToBrowser();

        addDetailedReportSheet(workbook, {
          sheetName: "TMS Summary",
          title: "PRAGATI SETU TMS PORTAL SUMMARY REPORT",
          subtitle: `FY ${financialYear}  •  Report date: ${
            reportData.report_date || "—"
          }`,
          report: reportData,
          tabColor: COLORS.blue,
        });
      } else {
        const plans = trainingPlans.filter(
          (plan) => plan?.id !== null && plan?.id !== undefined,
        );
        const resolvedThemeName = themeName || `Theme ${selectedTheme}`;

        setPhase("Refreshing all-theme data…");
        setProgress(5);
        await yieldToBrowser();

        const themeResponse = await api.get("/tms/reports/portal-summary/", {
          params: {
            financial_year: financialYear,
            theme: selectedTheme,
          },
        });

        if (themeResponse.data?.status !== "success") {
          throw new Error(
            themeResponse.data?.error ||
              "The all-theme summary could not be loaded.",
          );
        }

        const themeReport = themeResponse.data;
        setProgress(8);

        let planData = [];
        if (plans.length) {
          setPhase(`Loading reports for ${plans.length} training plans…`);
          planData = await fetchPlanReports(
            plans,
            financialYear,
            selectedTheme,
            setProgress,
          );
        }

        const planReports = plans.map((plan, index) => ({
          plan,
          name: planName(plan),
          report: planData[index],
        }));

        setPhase("Building theme-wide analysis sheets…");
        setProgress(70);
        await yieldToBrowser();

        addExecutiveSummarySheet(workbook, themeReport, planReports, {
          themeName: resolvedThemeName,
          financialYear,
        });

        addDetailedReportSheet(workbook, {
          sheetName: "All Theme Data",
          title: "PRAGATI SETU TMS — ALL THEME DATA",
          subtitle: `${resolvedThemeName}  •  FY ${financialYear}  •  Report date: ${
            themeReport.report_date || "—"
          }  •  Includes state and district summaries`,
          report: themeReport,
          tabColor: COLORS.navy,
        });

        addPlanComparisonSheet(workbook, themeReport, planReports);

        addKpiMatrixSheet(workbook, planReports, themeReport, "batch_counts", {
          sheetName: "Batch KPI Matrix",
          title: "BATCH KPI COMPARISON",
          tabColor: COLORS.blue,
        });

        addKpiMatrixSheet(
          workbook,
          planReports,
          themeReport,
          "participant_counts",
          {
            sheetName: "Participant KPI Matrix",
            title: "PARTICIPANT KPI COMPARISON",
            tabColor: "FF4F83B8",
          },
        );

        addDistrictComparisonSheet(workbook, themeReport, planReports);

        for (let index = 0; index < planReports.length; index += 1) {
          const entry = planReports[index];
          const sheetName = createUniqueSheetName(
            workbook,
            `Plan ${entry.plan?.id} ${entry.name}`,
          );

          setPhase(
            `Formatting training plan ${index + 1} of ${planReports.length}…`,
          );
          setProgress(78 + Math.round(((index + 1) / planReports.length) * 16));
          await yieldToBrowser();

          addDetailedReportSheet(workbook, {
            sheetName,
            title: `TRAINING PLAN — ${entry.name}`,
            subtitle: `${resolvedThemeName}  •  FY ${financialYear}  •  Plan ID: ${
              entry.plan?.id ?? "—"
            }  •  Report date: ${entry.report?.report_date || "—"}`,
            report: entry.report,
            tabColor: COLORS.mediumBlue,
          });
        }
      }

      setPhase("Preparing your Excel download…");
      setProgress(97);
      await yieldToBrowser();

      const safeYear = String(financialYear || "export").replace(
        /[^a-z0-9_-]/gi,
        "_",
      );
      const filename = isSmmuAllPlansExport
        ? `TMS_Theme_Analysis_${safeYear}.xlsx`
        : `TMS_Portal_Summary_Report_${safeYear}.xlsx`;

      await downloadWorkbook(workbook, filename);
      setPhase("Excel workbook ready");
      setProgress(100);
      await yieldToBrowser();
    } catch (error) {
      console.error("Excel export failed:", error);
      alert(
        error?.message ||
          "Failed to export the Excel workbook. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-export"
        onClick={handleExport}
        disabled={disabled || isExporting}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: disabled || isExporting ? "#94a3b8" : "#2563a6",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: 8,
          fontWeight: 700,
          cursor: disabled || isExporting ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          boxShadow: "0 3px 8px rgba(37,99,166,0.22)",
        }}
      >
        <FaFileExcel />
        {isExporting ? "Preparing Excel…" : "Export Excel"}
      </button>

      {isExporting &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <style>{`
              @keyframes tms-export-spin {
                to { transform: rotate(360deg); }
              }
              @keyframes tms-export-pulse {
                0%, 100% { opacity: 0.55; transform: scale(0.96); }
                50% { opacity: 1; transform: scale(1.04); }
              }
              @keyframes tms-export-shimmer {
                0% { transform: translateX(-120%); }
                100% { transform: translateX(320%); }
              }
              .tms-export-backdrop {
                position: fixed;
                inset: 0;
                z-index: 2147483000;
                display: grid;
                place-items: center;
                padding: 20px;
                background: rgba(15, 35, 62, 0.30);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
              }
              .tms-export-card {
                width: min(440px, 100%);
                padding: 34px 36px 30px;
                border: 1px solid #d7e6f5;
                border-radius: 20px;
                background: linear-gradient(145deg, #ffffff 0%, #f4f9ff 100%);
                box-shadow: 0 28px 80px rgba(14, 42, 75, 0.25);
                text-align: center;
                animation: tms-export-pulse 2.8s ease-in-out infinite;
              }
              .tms-export-icon {
                width: 70px;
                height: 70px;
                margin: 0 auto 18px;
                display: grid;
                place-items: center;
                border-radius: 22px;
                color: #fff;
                font-size: 27px;
                background: linear-gradient(145deg, #327bc0, #173f75);
                box-shadow: 0 10px 22px rgba(37, 99, 166, 0.25);
              }
              .tms-export-spinner {
                width: 19px;
                height: 19px;
                margin: 0 auto 10px;
                border: 2px solid #c6d9ec;
                border-top-color: #2563a6;
                border-radius: 50%;
                animation: tms-export-spin 0.8s linear infinite;
              }
              .tms-export-progress-track {
                position: relative;
                height: 9px;
                margin-top: 22px;
                overflow: hidden;
                border-radius: 99px;
                background: #e1ebf5;
              }
              .tms-export-progress-fill {
                position: relative;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #2563a6, #63a5e3);
                transition: width 300ms ease;
                overflow: hidden;
              }
              .tms-export-progress-fill::after {
                content: "";
                position: absolute;
                inset: 0 auto 0 0;
                width: 35%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
                animation: tms-export-shimmer 1.5s ease-in-out infinite;
              }
              .tms-export-meta {
                display: flex;
                justify-content: space-between;
                margin-top: 9px;
                color: #64788d;
                font-size: 12px;
                font-weight: 600;
              }
              @media (prefers-reduced-motion: reduce) {
                .tms-export-card,
                .tms-export-spinner,
                .tms-export-progress-fill::after {
                  animation-duration: 4s;
                }
              }
            `}</style>

            <div
              className="tms-export-backdrop"
              role="presentation"
              aria-live="polite"
            >
              <div
                className="tms-export-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tms-export-title"
                aria-describedby="tms-export-phase"
              >
                <div className="tms-export-icon">
                  <FaFileExcel />
                </div>

                <div className="tms-export-spinner" aria-hidden="true" />

                <h2
                  id="tms-export-title"
                  style={{
                    margin: "0 0 8px",
                    color: "#17365d",
                    fontSize: 21,
                    fontWeight: 800,
                  }}
                >
                  Preparing your Excel workbook
                </h2>

                <p
                  id="tms-export-phase"
                  style={{
                    margin: 0,
                    color: "#60758b",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {phase}
                </p>

                <div
                  className="tms-export-progress-track"
                  role="progressbar"
                  aria-label="Excel export progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div
                    className="tms-export-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="tms-export-meta">
                  <span>Keep this window open</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
