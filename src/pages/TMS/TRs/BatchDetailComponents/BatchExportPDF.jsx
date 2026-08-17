// src/pages/TMS/TRs/BatchDetailComponents/BatchExportPDF.jsx
import React, { useState } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";

function fmtDate(iso) {
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso;
  }
}

export default function BatchExportPDF({ batchData }) {
  const [exporting, setExporting] = useState(false);

  const generatePDF = () => {
    if (!batchData) return;
    setExporting(true);

    try {
      const isStaff = batchData.participant_type === "STAFF";
      const isTrainer = batchData.participant_type === "TRAINER";

      // 1. Process Participants Data
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

      // 2. Financial Totals
      let subtotal = 0;
      (batchData.participant_costs || []).forEach((c) => {
        subtotal += parseFloat(c.total_cost || 0);
      });
      const bc = batchData.batch_costing || {};

      // 3. Build HTML Content
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Batch Detail - ${batchData.code || "N/A"}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #1e293b;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* FIXED BORDER APPLIED TO EVERY PRINTED PAGE */
            .page-border {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              border: 4px solid #1e3a8a;
              pointer-events: none;
              z-index: -1;
            }
            
            /* COVER PAGE STYLES */
            .cover-page {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 95vh;
              page-break-after: always;
              text-align: center;
              padding: 0 40px;
            }
            .cover-header-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              margin-bottom: 50px;
            }
            .logo-placeholder {
              width: 110px;
              height: 110px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-placeholder img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .cover-main-text {
              flex: 1;
              padding: 0 20px;
            }
            .cover-main-text h3 {
              color: #b45309;
              font-size: 22px;
              margin: 0 0 12px 0;
              font-weight: 700;
            }
            .cover-main-text h1 {
              color: #1e3a8a;
              font-size: 34px;
              margin: 0;
              font-weight: 800;
              line-height: 1.3;
            }
            .cover-title-box {
              margin-top: 40px;
              padding: 30px;
              border-top: 3px solid #cbd5e1;
              border-bottom: 3px solid #cbd5e1;
              width: 80%;
            }
            .cover-title-box h2 {
              font-size: 28px;
              color: #334155;
              margin: 0 0 10px 0;
            }
            .cover-title-box h4 {
              font-size: 20px;
              color: #64748b;
              margin: 0;
            }
            .cover-batch-info {
              margin-top: 60px;
              background: #f1f5f9;
              padding: 20px 40px;
              border-radius: 8px;
              border: 1px solid #cbd5e1;
            }
            .cover-batch-info p {
              margin: 8px 0;
              font-size: 18px;
              font-weight: 600;
            }

            /* CONTENT PAGES STYLES */
            .content-section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 18px;
              color: #1e3a8a;
              border-bottom: 2px solid #1e3a8a;
              padding-bottom: 6px;
              margin-bottom: 16px;
              margin-top: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #94a3b8;
              padding: 8px 10px;
              text-align: center;
              vertical-align: middle;
            }
            th {
              background-color: #1e3a8a !important;
              color: #ffffff !important;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 11px;
            }
            tbody tr:nth-child(even) {
              background-color: #f8fafc !important;
            }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
              background: #e2e8f0;
            }
            .badge-success { background: #dcfce7 !important; color: #166534 !important; border: 1px solid #bbf7d0;}
            .badge-warning { background: #fef3c7 !important; color: #b45309 !important; border: 1px solid #fde047;}
            .badge-danger { background: #fee2e2 !important; color: #991b1b !important; border: 1px solid #fca5a5;}
          </style>
        </head>
        <body>
          <!-- GLOBAL BORDER FOR ALL PRINTED PAGES -->
          <div class="page-border"></div>

          <!-- PAGE 1: COVER PAGE -->
          <div class="cover-page">
            <div class="cover-header-row">
              <div class="logo-placeholder">
                <!-- Using UP Gov standard emblem placeholder -->
                <img src="https://srlm.up.gov.in/images/uplogo.png" alt="UP Gov" onerror="this.style.display='none'">
              </div>
              <div class="cover-main-text">
                <h3>दीनदयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन</h3>
                <h1>उत्तर प्रदेश राज्य ग्रामीण आजीविका मिशन</h1>
              </div>
              <div class="logo-placeholder">
                <!-- Using NRLM/Prerna standard placeholder -->
                <img src="https://upsrlmtms.upsdc.gov.in/assets/prerna-RkcM7kqZ.png" alt="NRLM" onerror="this.style.display='none'">
              </div>
            </div>

            <div class="cover-title-box">
              <h2>जिला स्तरीय प्रशिक्षण कार्यक्रम</h2>
              <h4>वित्तीय वर्ष ${batchData.financial_year || "2026-27"}</h4>
            </div>

            <div class="cover-batch-info">
              <p>Batch Code: <span style="color: #2563eb;">${batchData.code || "N/A"}</span></p>
              <p>Training Plan: ${batchData.training_plan?.training_name || "N/A"}</p>
              <p>District: ${batchData.district_name_en || "N/A"}</p>
              <p style="margin-top: 15px; font-size: 14px; color: #64748b;">
                Generated on: ${new Date().toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <!-- PAGE 2+: CONTENT -->
          <div style="padding: 20px;">
            
            <!-- 1. BATCH OVERVIEW -->
            <div class="content-section">
              <h2 class="section-title">Batch Overview</h2>
              <table>
                <tbody>
                  <tr>
                    <td class="text-left font-bold" style="width: 25%;">Batch Code</td>
                    <td class="text-left" style="width: 25%; color: #1d4ed8; font-weight: bold;">${batchData.code || "N/A"}</td>
                    <td class="text-left font-bold" style="width: 25%;">Status</td>
                    <td class="text-left" style="width: 25%;"><span class="badge ${batchData.status === "CLOSED" ? "badge-success" : "badge-warning"}">${batchData.status || "N/A"}</span></td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">Participant Type</td>
                    <td class="text-left">${batchData.participant_type || "N/A"}</td>
                    <td class="text-left font-bold">Batch Type</td>
                    <td class="text-left">${batchData.batch_type || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">Start Date</td>
                    <td class="text-left">${fmtDate(batchData.start_date)}</td>
                    <td class="text-left font-bold">End Date</td>
                    <td class="text-left">${fmtDate(batchData.end_date)}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">Training Plan</td>
                    <td class="text-left" colspan="3">${batchData.training_plan?.training_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">Theme</td>
                    <td class="text-left">${batchData.training_plan?.theme?.theme_name || "N/A"}</td>
                    <td class="text-left font-bold">Duration</td>
                    <td class="text-left">${batchData.training_plan?.no_of_days || "N/A"} Days</td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">District / Block</td>
                    <td class="text-left" colspan="3">${batchData.district_name_en || "N/A"} / ${batchData.block_name_en || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">Training Partner</td>
                    <td class="text-left" colspan="3">${batchData.partner?.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td class="text-left font-bold">Centre Venue</td>
                    <td class="text-left" colspan="3">${batchData.centre?.venue_name || "N/A"} <br/> <small style="color: #64748b;">${batchData.centre?.venue_address || ""}</small></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 2. MASTER TRAINERS -->
            ${
              batchData.master_trainer_participations?.length > 0
                ? `
              <div class="content-section">
                <h2 class="section-title">Assigned Master Trainers</h2>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 5%">S.No</th>
                      <th class="text-left" style="width: 30%">Trainer Name</th>
                      <th>Designation</th>
                      <th>Mobile</th>
                      <th>Participation Status</th>
                      <th>eKYC Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${batchData.master_trainer_participations
                      .map((mtp, i) => {
                        const mt = mtp.master_trainer || {};
                        const ekyc = (batchData.ekyc_verifications || []).find(
                          (k) =>
                            String(k.participant_id) === String(mtp.id) &&
                            k.participant_role === "trainer",
                        );
                        const isVerified = ekyc?.ekyc_status === "VERIFIED";
                        return `
                        <tr>
                          <td>${i + 1}</td>
                          <td class="text-left font-bold">${mt.full_name || "N/A"}</td>
                          <td>${mt.designation || "N/A"}</td>
                          <td>${mt.mobile_no || "N/A"}</td>
                          <td>${mtp.status || "N/A"}</td>
                          <td><span class="badge ${isVerified ? "badge-success" : "badge-warning"}">${ekyc?.ekyc_status || "PENDING"}</span></td>
                        </tr>
                      `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
                : ""
            }

            <!-- 3. PARTICIPANTS LIST -->
            <div class="content-section">
              <h2 class="section-title">Participants Roster</h2>
              <table>
                <thead>
                  <tr>
                    <th style="width: 5%">S.No</th>
                    <th class="text-left" style="width: 25%">Participant Name</th>
                    <th>Designation</th>
                    <th>Gender</th>
                    <th>Mobile</th>
                    <th>Block</th>
                    <th>Att %</th>
                    <th>eKYC Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${partsList
                    .map((p, i) => {
                      const person = p.beneficiary || p.trainer || p.staff || p;
                      const ekyc = (batchData.ekyc_verifications || []).find(
                        (k) =>
                          String(k.participant_id) === String(p.id) &&
                          k.participant_role === "trainee",
                      );
                      const attPercent =
                        p.attendance_summary?.attendance_percentage || "0.00";
                      const isVerified = ekyc?.ekyc_status === "VERIFIED";
                      return `
                      <tr>
                        <td>${i + 1}</td>
                        <td class="text-left font-bold">${person.member_name || person.full_name || "N/A"}</td>
                        <td>${person.designation || "Trainee"}</td>
                        <td>${person.gender || "N/A"}</td>
                        <td>${person.mobile || person.mobile_no || "N/A"}</td>
                        <td>${person.block_name_en || "N/A"}</td>
                        <td>${attPercent}%</td>
                        <td><span class="badge ${isVerified ? "badge-success" : "badge-danger"}">${ekyc?.ekyc_status || "PENDING"}</span></td>
                      </tr>
                    `;
                    })
                    .join("")}
                  ${partsList.length === 0 ? '<tr><td colspan="8">No participants found.</td></tr>' : ""}
                </tbody>
              </table>
            </div>

            <!-- 4. FINANCIAL SUMMARY -->
            <div class="content-section" style="page-break-inside: avoid;">
              <h2 class="section-title">Financial Summary</h2>
              <table style="width: 60%; margin: 0 auto;">
                <thead>
                  <tr>
                    <th class="text-left">Component</th>
                    <th style="text-align: right;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-left">Participants Subtotal (TA/DA/HRA)</td>
                    <td style="text-align: right;">₹ ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td class="text-left">Exposure Visit Cost</td>
                    <td style="text-align: right;">₹ ${bc.is_exposure_visit ? parseFloat(bc.exposure_visit_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}</td>
                  </tr>
                  <tr>
                    <td class="text-left">Field Visit Cost</td>
                    <td style="text-align: right;">₹ ${bc.is_field_visit ? parseFloat(bc.field_visit_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}</td>
                  </tr>
                  <tr style="background-color: #dbeafe !important;">
                    <td class="text-left font-bold" style="color: #1e40af; font-size: 14px;">Grand Total Request</td>
                    <td style="text-align: right; color: #1e40af; font-weight: bold; font-size: 14px;">₹ ${parseFloat(bc.grand_total_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </body>
        </html>
      `;

      // 4. Open in new window and trigger print
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for images and CSS to load, then print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          setExporting(false);
        }, 1000);
      } else {
        alert("Please allow pop-ups to generate the PDF.");
        setExporting(false);
      }
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
      setExporting(false);
    }
  };

  return (
    <button
      className="btn-pdf"
      onClick={generatePDF}
      disabled={exporting || !batchData}
      title="Open Print Preview to Save as PDF"
    >
      {exporting ? (
        <>
          <FaSpinner className="spin" style={{ marginRight: "6px" }} />{" "}
          Exporting...
        </>
      ) : (
        <>
          <FaFilePdf style={{ marginRight: "6px" }} /> Export PDF
        </>
      )}
      <style>{`
        .btn-pdf {
          background: #ef4444;
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
          box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
        }
        .btn-pdf:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(239, 68, 68, 0.3);
        }
        .btn-pdf:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
