// src/pages/TMS/TRs/BatchDetailComponents/BatchHTML.js
function fmtDate(iso) {
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso;
  }
}

export const generateBatchHTML = (batchData) => {
  if (!batchData) return "<h2>No Data Provided</h2>";

  const isStaff = batchData.participant_type === "STAFF";
  const isTrainer = batchData.participant_type === "TRAINER";

  // 1. Build Unified Participants List
  let partsList = [];

  // Master Trainers
  (batchData.master_trainer_participations || []).forEach((mt) => {
    partsList.push({
      id: mt.id,
      name: mt.master_trainer?.full_name || mt.full_name || "Unknown",
      role: "Master Trainer",
      mobile: mt.master_trainer?.mobile_no || "-",
      district: mt.master_trainer?.district_name_en || "-",
    });
  });

  // Regular Participants
  if (batchData.batch_type === "COMBINED") {
    (batchData.combined_batch_details || []).forEach((d) => {
      (d.participants || []).forEach((p) => {
        // SURGICAL FIX: Extract the underlying person object first
        const person = p.beneficiary || p.trainer || p.staff || p;

        partsList.push({
          id: p.id,
          name:
            person.name || person.full_name || person.member_name || "Unknown",
          role: "Participant",
          mobile: person.mobile || person.mobile_no || "-",
          district: person.district_name_en || "-",
          block: person.block_name_en || "-",
          panchayat: person.panchayat_name_en || "-",
        });
      });
    });
  } else if (isStaff) {
    (batchData.staff_participations || []).forEach((p) =>
      partsList.push({
        id: p.id,
        name: p.staff?.full_name || p.full_name || "Unknown",
        role: "Staff",
        mobile: p.staff?.mobile || "-",
        district: p.staff?.district_name_en || "-",
      }),
    );
  } else if (isTrainer) {
    (batchData.trainer_participations || []).forEach((p) =>
      partsList.push({
        id: p.id,
        name: p.trainer?.full_name || p.full_name || "Unknown",
        role: "Trainer",
        mobile: p.trainer?.mobile_no || "-",
        district: p.trainer?.district_name_en || "-",
      }),
    );
  } else {
    (batchData.beneficiary_participations || []).forEach((p) =>
      partsList.push({
        id: p.id,
        name: p.beneficiary?.member_name || p.member_name || "Unknown",
        role: "Beneficiary",
        mobile: p.beneficiary?.mobile || "-",
        district: p.beneficiary?.district_name_en || "-",
        block: p.beneficiary?.block_name_en || "-",
        panchayat: p.beneficiary?.panchayat_name_en || "-",
      }),
    );
  }

  // 2. Financial Totals
  let subtotal = 0;
  (batchData.participant_costs || []).forEach((c) => {
    subtotal += parseFloat(c.total_cost || 0);
  });
  const bc = batchData.batch_costing || {};

  // 3. Attendance Matrix Processing
  const attDates = [
    ...new Set((batchData.attendances || []).map((a) => a.date)),
  ].sort();
  const attHeadersHtml = attDates.map((d) => `<th>${fmtDate(d)}</th>`).join("");

  const attRowsHtml = partsList
    .map((p, i) => {
      const colsHtml = attDates
        .map((d) => {
          const dayAtt = batchData.attendances.find((a) => a.date === d);
          const pRec = dayAtt?.participant_records?.find(
            (pr) => String(pr.participant_id) === String(p.id),
          );
          let statusHtml = '<span style="color:#94a3b8;">-</span>';
          if (pRec) {
            statusHtml = pRec.present
              ? '<span style="color:#16a34a; font-weight:900; font-size:14px;">P</span>'
              : '<span style="color:#ef4444; font-weight:900; font-size:14px;">A</span>';
          }
          return `<td>${statusHtml}</td>`;
        })
        .join("");

      return `
      <tr>
        <td>${i + 1}</td>
        <td class="text-left font-bold">
          ${p.name}
          <div style="font-size: 10px; color: #64748b; font-weight: normal;">${p.role}</div>
        </td>
        ${colsHtml}
      </tr>
    `;
    })
    .join("");

  // 4. Media Processing
  let mediaHtml = (batchData.batch_pictures || [])
    .map(
      (pic) => `
    <div class="media-card">
      <img src="${pic.file}" alt="${pic.category}" onerror="this.style.display='none'"/>
      <div class="media-label">${pic.category || "Photo"} - ${fmtDate(pic.date)}</div>
    </div>
  `,
    )
    .join("");
  if (!mediaHtml)
    mediaHtml = `<div class="muted-box">No media assets uploaded.</div>`;

  // 5. Build HTML
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Batch Detail - ${batchData.code || "N/A"}</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0; padding: 0; color: #0f172a;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .page-border {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          border: 4px solid #1e3a8a; pointer-events: none; z-index: -1;
        }
        
        /* COVER PAGE */
        .cover-page {
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          height: 95vh; page-break-after: always; text-align: center; padding: 0 40px;
        }
        .cover-header-row { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 50px; }
        .logo-placeholder { width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; }
        .logo-placeholder img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cover-main-text { flex: 1; padding: 0 20px; }
        .cover-main-text h3 { color: #b45309; font-size: 22px; margin: 0 0 12px 0; font-weight: 700; }
        .cover-main-text h1 { color: #1e3a8a; font-size: 34px; margin: 0; font-weight: 800; line-height: 1.3; }
        .cover-title-box { margin-top: 40px; padding: 30px; border-top: 3px solid #cbd5e1; border-bottom: 3px solid #cbd5e1; width: 80%; }
        .cover-title-box h2 { font-size: 28px; color: #334155; margin: 0 0 10px 0; }
        .cover-title-box h4 { font-size: 20px; color: #64748b; margin: 0; }
        .cover-batch-info { margin-top: 60px; background: #f1f5f9; padding: 20px 40px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .cover-batch-info p { margin: 8px 0; font-size: 18px; font-weight: 600; }

        /* CONTENT PAGES */
        .content-section { margin-bottom: 30px; page-break-inside: avoid; }
        .section-title {
          font-size: 18px; color: #ffffff; background: #1e3a8a;
          padding: 8px 12px; margin-bottom: 16px; margin-top: 20px; border-radius: 6px;
        }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; vertical-align: middle; }
        th { background-color: #f1f5f9 !important; color: #1e293b !important; font-weight: 700; text-transform: uppercase; font-size: 11px; }
        tbody tr:nth-child(even) { background-color: #f8fafc !important; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .muted-box { background: #f1f5f9; color: #64748b; padding: 16px; text-align: center; border-radius: 6px; border: 1px dashed #cbd5e1;}
        
        .badge { padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: bold; background: #e2e8f0; }
        .badge-success { background: #dcfce7 !important; color: #166534 !important; border: 1px solid #bbf7d0;}
        .badge-warning { background: #fef3c7 !important; color: #b45309 !important; border: 1px solid #fde047;}
        .badge-danger { background: #fee2e2 !important; color: #991b1b !important; border: 1px solid #fca5a5;}
        
        /* Media Grid */
        .media-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .media-card { width: 31%; border: 1px solid #cbd5e1; padding: 6px; border-radius: 8px; background: #fff; page-break-inside: avoid; }
        .media-card img { width: 100%; height: 180px; object-fit: cover; border-radius: 4px; }
        .media-label { text-align: center; font-size: 11px; font-weight: bold; margin-top: 6px; color: #334155; }
      </style>
    </head>
    <body>
      <div class="page-border"></div>

      <!-- COVER PAGE -->
      <div class="cover-page">
        <div class="cover-header-row">
          <div class="logo-placeholder">
            <img src="https://srlm.up.gov.in/images/uplogo.png" alt="UP Gov" onerror="this.style.display='none'">
          </div>
          <div class="cover-main-text">
            <h3>दीनदयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन</h3>
            <h1>उत्तर प्रदेश राज्य ग्रामीण आजीविका मिशन</h1>
          </div>
          <div class="logo-placeholder">
            <img src="https://upsrlmtms.upsdc.gov.in/assets/prerna-RkcM7kqZ.png" alt="NRLM" onerror="this.style.display='none'">
          </div>
        </div>

        <div class="cover-title-box">
          <h2>Complete Batch Report & Analytics</h2>
          <h4>Financial Year ${batchData.financial_year || "2026-27"}</h4>
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

      <!-- CONTENT PAGES -->
      <div style="padding: 20px;">
        
        <!-- 1. BATCH OVERVIEW -->
        <div class="content-section">
          <h2 class="section-title">1. Batch Overview</h2>
          <table>
            <tbody>
              <tr>
                <td class="text-left font-bold" style="width: 25%;">Batch Code</td>
                <td class="text-left" style="width: 25%; color: #1e3a8a; font-weight: bold;">${batchData.code || "N/A"}</td>
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

        <!-- 2. PARTICIPANTS ROSTER -->
        <div class="content-section">
          <h2 class="section-title">2. Unified Participants Roster</h2>
          ${
            partsList.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 5%">S.No</th>
                  <th class="text-left">Participant Name</th>
                  <th>Role</th>
                  <th>Mobile</th>
                  <th>District</th>
                  <th>Block</th>
                  <th>Panchayat</th>
                </tr>
              </thead>
              <tbody>
                ${partsList
                  .map(
                    (p, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td class="text-left font-bold">${p.name}</td>
                    <td>${p.role}</td>
                    <td>${p.mobile}</td>
                    <td>${p.district}</td>
                    <td>${p.block || "-"}</td>
                    <td>${p.panchayat || "-"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : `<div class="muted-box">No participants found in this batch.</div>`
          }
        </div>

        <!-- 3. SCHEDULES -->
        <div class="content-section">
          <h2 class="section-title">3. Batch Schedules</h2>
          ${
            batchData.schedules && batchData.schedules.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 10%">S.No</th>
                  <th style="width: 30%">Schedule Date</th>
                  <th style="width: 30%">Start Time</th>
                  <th class="text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${batchData.schedules
                  .map(
                    (s, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${fmtDate(s.schedule_date)}</td>
                    <td>${s.start_time || "-"}</td>
                    <td class="text-left">${s.remarks || "-"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : `<div class="muted-box">No schedules created yet.</div>`
          }
        </div>

        <!-- 4. EKYC VERIFICATIONS -->
        <div class="content-section">
          <h2 class="section-title">4. eKYC Verification Status</h2>
          ${
            batchData.ekyc_verifications &&
            batchData.ekyc_verifications.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 5%">S.No</th>
                  <th class="text-left">Participant Name</th>
                  <th>System Role</th>
                  <th>Status</th>
                  <th>Verified On</th>
                </tr>
              </thead>
              <tbody>
                ${batchData.ekyc_verifications
                  .map((k, i) => {
                    const p = partsList.find(
                      (pt) => String(pt.id) === String(k.participant_id),
                    ) || { name: "Unknown" };
                    const badge =
                      k.ekyc_status === "VERIFIED"
                        ? "badge-success"
                        : k.ekyc_status === "FAILED"
                          ? "badge-danger"
                          : "badge-warning";
                    return `
                  <tr>
                    <td>${i + 1}</td>
                    <td class="text-left font-bold">${p.name}</td>
                    <td>${(k.participant_role || "").toUpperCase()}</td>
                    <td><span class="badge ${badge}">${k.ekyc_status}</span></td>
                    <td>${fmtDate(k.verified_on)}</td>
                  </tr>
                `;
                  })
                  .join("")}
              </tbody>
            </table>
          `
              : `<div class="muted-box">No eKYC verifications performed yet.</div>`
          }
        </div>

        <!-- 5. ATTENDANCE MATRIX -->
        <div class="content-section">
          <h2 class="section-title">5. Attendance Matrix</h2>
          ${
            attDates.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 5%">S.No</th>
                  <th class="text-left">Participant</th>
                  ${attHeadersHtml}
                </tr>
              </thead>
              <tbody>
                ${attRowsHtml}
              </tbody>
            </table>
          `
              : `<div class="muted-box">No attendance records have been submitted for this batch.</div>`
          }
        </div>

        <!-- 6. FINANCIAL SUMMARY -->
        <div class="content-section">
          <h2 class="section-title">6. Financial Summary</h2>
          <table style="width: 70%; margin: 0 auto;">
            <thead>
              <tr>
                <th class="text-left">Component</th>
                <th style="text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left">Participants Subtotal (TA/DA/HRA)</td>
                <td style="text-align: right; font-weight: bold;">₹ ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
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
                <td class="text-left font-bold" style="color: #1e3a8a; font-size: 14px;">Grand Total Request</td>
                <td style="text-align: right; color: #1e3a8a; font-weight: bold; font-size: 14px;">₹ ${parseFloat(bc.grand_total_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
};
