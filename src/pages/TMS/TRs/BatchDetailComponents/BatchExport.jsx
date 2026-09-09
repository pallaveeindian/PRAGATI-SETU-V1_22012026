// src/pages/TMS/TRs/BatchDetailComponents/BatchExport.jsx
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function fmtDate(iso) {
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso;
  }
}

export default function BatchExport({ batchData }) {
  const [exporting, setExporting] = useState(false);

  const applyHeaderStyle = (row) => {
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2B4E72" }, // Beautiful TMS Blue/Navy
      };
      cell.font = {
        color: { argb: "FFFFFFFF" },
        bold: true,
        size: 12,
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  };

  const applyDataStyle = (row, isAlt) => {
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isAlt ? "FFF8FAFC" : "FFFFFFFF" }, // Alternating rows
      };
      cell.font = { color: { argb: "FF1E293B" }, size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        left: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
        right: { style: "thin", color: { argb: "FFCBD5E1" } },
      };
    });
  };

  const exportToExcel = async () => {
    if (!batchData) return;
    setExporting(true);

    try {
      const wb = new ExcelJS.Workbook();
      wb.creator = "Pragati Setu TMS";
      wb.created = new Date();

      // ==========================================
      // SHEET 1: BATCH OVERVIEW
      // ==========================================
      const wsOverview = wb.addWorksheet("Batch Overview", {
        views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
      });
      wsOverview.columns = [
        { header: "Attribute", key: "attr", width: 30 },
        { header: "Details", key: "val", width: 60 },
      ];

      const overviewData = [
        ["Batch Code", batchData.code || "N/A"],
        ["Status", batchData.status || "N/A"],
        ["Participant Type", batchData.participant_type || "N/A"],
        ["Batch Type", batchData.batch_type || "N/A"],
        ["Start Date", fmtDate(batchData.start_date)],
        ["End Date", fmtDate(batchData.end_date)],
        ["Training Plan", batchData.training_plan?.training_name || "N/A"],
        ["Theme", batchData.training_plan?.theme?.theme_name || "N/A"],
        [
          "Training Level",
          batchData.level ||
            batchData.training_plan?.level_of_training ||
            "N/A",
        ],
        ["Duration (Days)", batchData.training_plan?.no_of_days || "N/A"],
        ["District", batchData.district_name_en || "N/A"],
        ["Block", batchData.block_name_en || "N/A"],
        ["Training Partner", batchData.partner?.name || "N/A"],
        ["Centre Venue", batchData.centre?.venue_name || "N/A"],
        ["Centre Address", batchData.centre?.venue_address || "N/A"],
      ];

      wsOverview.addRows(overviewData);
      applyHeaderStyle(wsOverview.getRow(1));
      wsOverview.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          applyDataStyle(row, rowNumber % 2 === 0);
          row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
          row.getCell(1).font = { bold: true, color: { argb: "FF2B4E72" } };
          row.getCell(2).alignment = { horizontal: "left", vertical: "middle" };
        }
      });

      // ==========================================
      // SHEET 2: MASTER TRAINERS
      // ==========================================
      if (batchData.master_trainer_participations?.length > 0) {
        const wsMT = wb.addWorksheet("Master Trainers", {
          views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
        });
        wsMT.columns = [
          { header: "S.No", key: "sno", width: 10 },
          { header: "Trainer Name", key: "name", width: 35 },
          { header: "Designation", key: "desig", width: 25 },
          { header: "Mobile", key: "mob", width: 20 },
          { header: "Participation Status", key: "status", width: 25 },
          { header: "eKYC Status", key: "ekyc", width: 20 },
        ];

        batchData.master_trainer_participations.forEach((mtp, i) => {
          const mt = mtp.master_trainer || {};
          const ekyc = (batchData.ekyc_verifications || []).find(
            (k) =>
              String(k.participant_id) === String(mtp.id) &&
              k.participant_role === "trainer",
          );
          wsMT.addRow([
            i + 1,
            mt.full_name || "N/A",
            mt.designation || "N/A",
            mt.mobile_no || "N/A",
            mtp.status || "N/A",
            ekyc?.ekyc_status || "PENDING",
          ]);
        });

        applyHeaderStyle(wsMT.getRow(1));
        wsMT.eachRow((row, rowNumber) => {
          if (rowNumber > 1) applyDataStyle(row, rowNumber % 2 === 0);
        });
      }

      // ==========================================
      // SHEET 3: PARTICIPANTS
      // ==========================================
      const wsParts = wb.addWorksheet("Participants", {
        views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
      });

      const isStaff = batchData.participant_type === "STAFF";
      const isTrainer = batchData.participant_type === "TRAINER";

      wsParts.columns = [
        { header: "S.No", key: "sno", width: 10 },
        { header: "Participant Name", key: "name", width: 35 },
        { header: "Role/Designation", key: "role", width: 25 },
        { header: isStaff ? "Emp ID" : "Age", key: "age_emp", width: 20 },
        { header: "Gender", key: "gender", width: 15 },
        { header: "Mobile", key: "mob", width: 20 },
        { header: "Category", key: "cat", width: 20 },
        { header: "District", key: "dist", width: 25 },
        { header: "Block", key: "block", width: 25 },
        { header: "Attendance %", key: "att", width: 20 },
        { header: "eKYC Status", key: "ekyc", width: 20 },
        { header: "TA/DA (₹)", key: "tada", width: 15 },
        { header: "Total Cost (₹)", key: "cost", width: 20 },
      ];

      // Unify Participants
      let partsList = [];
      if (batchData.batch_type === "COMBINED") {
        (batchData.combined_batch_details || []).forEach((d) => {
          (d.participants || []).forEach((p) => partsList.push(p));
        });
      } else if (isStaff) {
        partsList = batchData.staff_participations || [];
      } else if (isTrainer) {
        partsList = batchData.trainer_participations || [];
      } else {
        partsList = batchData.beneficiary_participations || [];
      }

      partsList.forEach((p, i) => {
        const person = p.beneficiary || p.trainer || p.staff || p;

        // EKYC
        const ekyc = (batchData.ekyc_verifications || []).find(
          (k) =>
            String(k.participant_id) === String(p.id) &&
            k.participant_role === "trainee",
        );

        // Cost
        const costLine =
          (batchData.participant_costs || []).find(
            (c) =>
              c.batch_beneficiary === p.id ||
              c.batch_trainer === p.id ||
              c.batch_staff === p.id,
          ) || {};

        wsParts.addRow([
          i + 1,
          person.member_name || person.full_name || "N/A",
          person.designation || "Trainee",
          isStaff ? person.employee_id || "N/A" : person.age || "N/A",
          person.gender || "N/A",
          person.mobile || person.mobile_no || "N/A",
          person.social_category || "N/A",
          person.district_name_en || "N/A",
          person.block_name_en || "N/A",
          `${p.attendance_summary?.attendance_percentage || "0.00"}%`,
          ekyc?.ekyc_status || "PENDING",
          costLine.ta_da || 0,
          costLine.total_cost || 0,
        ]);
      });

      applyHeaderStyle(wsParts.getRow(1));
      wsParts.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          applyDataStyle(row, rowNumber % 2 === 0);
          row.getCell(2).alignment = { horizontal: "left", vertical: "middle" }; // Name left aligned
          // Money formatting
          row.getCell(12).numFmt = "₹#,##0.00";
          row.getCell(13).numFmt = "₹#,##0.00";
        }
      });

      // ==========================================
      // SHEET 4: DAILY ATTENDANCE
      // ==========================================
      if (batchData.attendances?.length > 0) {
        const wsAtt = wb.addWorksheet("Daily Attendance", {
          views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
        });
        wsAtt.columns = [
          { header: "Date", key: "date", width: 20 },
          { header: "Participant Name", key: "name", width: 35 },
          { header: "Role", key: "role", width: 20 },
          { header: "Status", key: "status", width: 20 },
        ];

        batchData.attendances.forEach((att) => {
          (att.participant_records || []).forEach((pr) => {
            wsAtt.addRow([
              fmtDate(att.date),
              pr.participant_name || "N/A",
              pr.participant_role || "N/A",
              pr.present ? "Present" : "Absent",
            ]);
          });
        });

        applyHeaderStyle(wsAtt.getRow(1));
        wsAtt.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            applyDataStyle(row, rowNumber % 2 === 0);
            const statusCell = row.getCell(4);
            if (statusCell.value === "Present") {
              statusCell.font = { color: { argb: "FF166534" }, bold: true };
            } else {
              statusCell.font = { color: { argb: "FF991B1B" }, bold: true };
            }
          }
        });
      }

      // ==========================================
      // SHEET 5: FINANCIAL SUMMARY
      // ==========================================
      if (batchData.batch_costing) {
        const wsFin = wb.addWorksheet("Financial Summary", {
          views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
        });
        wsFin.columns = [
          { header: "Component", key: "item", width: 40 },
          { header: "Amount (₹)", key: "cost", width: 25 },
        ];

        // Calculate participant subtotal
        let subtotal = 0;
        (batchData.participant_costs || []).forEach((c) => {
          subtotal += parseFloat(c.total_cost || 0);
        });

        const bc = batchData.batch_costing;
        wsFin.addRows([
          ["Participants Subtotal (TA/DA/HRA)", subtotal],
          [
            "Exposure Visit Cost",
            bc.is_exposure_visit ? parseFloat(bc.exposure_visit_cost || 0) : 0,
          ],
          [
            "Field Visit Cost",
            bc.is_field_visit ? parseFloat(bc.field_visit_cost || 0) : 0,
          ],
          ["Grand Total Request", parseFloat(bc.grand_total_cost || 0)],
        ]);

        applyHeaderStyle(wsFin.getRow(1));
        wsFin.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            applyDataStyle(row, rowNumber % 2 === 0);
            row.getCell(1).alignment = {
              horizontal: "left",
              vertical: "middle",
            };
            row.getCell(2).numFmt = "₹#,##0.00";
            row.getCell(2).font = { bold: true, color: { argb: "FF1E293B" } };

            // Highlight Grand Total
            if (rowNumber === 5) {
              row.getCell(1).font = {
                bold: true,
                size: 12,
                color: { argb: "FF1E40AF" },
              };
              row.getCell(2).font = {
                bold: true,
                size: 13,
                color: { argb: "FF1E40AF" },
              };
              row.getCell(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDBEAFE" },
              };
              row.getCell(2).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDBEAFE" },
              };
            }
          }
        });
      }

      // Trigger Download
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Batch_Detail_${batchData.code || batchData.id}.xlsx`);
    } catch (error) {
      console.error("Export to Excel failed:", error);
      alert("Failed to export Excel file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className="btn-excel"
      onClick={exportToExcel}
      disabled={exporting || !batchData}
    >
      {exporting ? "⏳ Exporting..." : "📊 Export Excel"}
      <style>{`
        .btn-excel {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
        }
        .btn-excel:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(16, 185, 129, 0.3);
        }
        .btn-excel:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </button>
  );
}
