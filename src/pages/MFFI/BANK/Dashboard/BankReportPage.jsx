import React, { useState } from "react";

export default function BankReportPage() {
  // 🟢 Mock Data (Demo ke liye kuch Approved/Rejected bhi add kiye hain)
  const [applications] = useState([
    {
      id: "MCCY1001",
      status: "PENDING",
      revertReason: "",
      memberName: "Sita Devi",
      fatherHusbandName: "Ramesh Kumar",
      maritalStatus: "Married",
      socialCategory: "OBC",
      religion: "Hindu",
      dob: "15/08/1990",
      mobileNumber: "9876543210",
      shgId: "SHG-88291",
      shgJoiningDate: "12/01/2018",
      voName: "Jai Ambe VO",
      clfName: "Pragati CLF",
      enterpriseName: "Devi Dairy & Organic Products",
      enterpriseNature: "Processing & Sales",
      enterpriseType: "Individual Enterprise",
      sector: "Agriculture & Allied",
      businessActivity: "Milk Processing & Paneer Supply",
      monthlySale: "₹45,000",
      monthlyExpense: "₹20,000",
      udhyamRegNo: "UDYAM-UP-12-0034567",
      sellArea: "Local GP & Nearby District Market",
      purposeOfLoan: "Dairy Expansion & Chilling Unit Purchase",
      requiredAmount: "₹2,00,000",
      bankName: "State Bank of India",
      branchName: "Gosainganj",
      accountNumber: "34567890123",
      ifscCode: "SBIN000987",
      district: "Lucknow",
      block: "Gosainganj",
      panchayat: "Amethi",
      village: "Amethi Khurd",
    },
    {
      id: "MCCY1002",
      status: "PENDING",
      revertReason: "",
      memberName: "Geeta Rani",
      fatherHusbandName: "Suresh Chandra",
      maritalStatus: "Widow",
      socialCategory: "SC",
      religion: "Hindu",
      dob: "10/04/1986",
      mobileNumber: "9123456780",
      shgId: "SHG-45120",
      shgJoiningDate: "05/06/2019",
      voName: "Laxmi VO",
      clfName: "Uday CLF",
      enterpriseName: "Rani Tailoring & Garments",
      enterpriseNature: "Manufacturing",
      enterpriseType: "Micro Enterprise",
      sector: "Textiles / Apparel",
      businessActivity: "School Uniform & Ready-made Tailoring",
      monthlySale: "₹30,000",
      monthlyExpense: "₹12,000",
      udhyamRegNo: "UDYAM-UP-12-0098214",
      sellArea: "Block Panchayats & Local Schools",
      purposeOfLoan: "Heavy Duty Stitching Machines Purchase",
      requiredAmount: "₹1,50,000",
      bankName: "Bank of Baroda",
      branchName: "Mohanlalganj Branch",
      accountNumber: "98765432109",
      ifscCode: "BARB0MOHAN",
      district: "Lucknow",
      block: "Mohanlalganj",
      panchayat: "Sissendi",
      village: "Sissendi",
    },
    {
      id: "MCCY1003",
      status: "APPROVED",
      revertReason: "",
      memberName: "Pooja Sharma",
      fatherHusbandName: "Amit Sharma",
      maritalStatus: "Married",
      socialCategory: "General",
      religion: "Hindu",
      dob: "20/05/1988",
      mobileNumber: "9000111222",
      shgId: "SHG-11223",
      shgJoiningDate: "10/02/2020",
      voName: "Saraswati VO",
      clfName: "Nari Shakti CLF",
      enterpriseName: "Pooja Beauty Parlour",
      enterpriseNature: "Services",
      enterpriseType: "Micro Enterprise",
      sector: "Beauty & Wellness",
      businessActivity: "Salon Services",
      monthlySale: "₹25,000",
      monthlyExpense: "₹10,000",
      udhyamRegNo: "UDYAM-UP-12-1122334",
      sellArea: "Local Market",
      purposeOfLoan: "Parlour Setup & Equipment",
      requiredAmount: "₹1,00,000",
      bankName: "Bank of India",
      branchName: "Alambagh",
      accountNumber: "112233445566",
      ifscCode: "BKID000123",
      district: "Lucknow",
      block: "Sarojini Nagar",
      panchayat: "Bijnor",
      village: "Bijnor",
    },
    {
      id: "MCCY1004",
      status: "REJECTED",
      revertReason: "Applicant has an existing overdue loan from another MFI.",
      memberName: "Kavita Yadav",
      fatherHusbandName: "Raju Yadav",
      maritalStatus: "Married",
      socialCategory: "OBC",
      religion: "Hindu",
      dob: "12/12/1992",
      mobileNumber: "9988776655",
      shgId: "SHG-99887",
      shgJoiningDate: "15/07/2021",
      voName: "Ganga VO",
      clfName: "Mahila Vikas CLF",
      enterpriseName: "Kavita Kirana Store",
      enterpriseNature: "Retail",
      enterpriseType: "Micro Enterprise",
      sector: "Retail & Trading",
      businessActivity: "Grocery Store",
      monthlySale: "₹15,000",
      monthlyExpense: "₹8,000",
      udhyamRegNo: "UDYAM-UP-12-998877",
      sellArea: "Village",
      purposeOfLoan: "Stock Purchase",
      requiredAmount: "₹50,000",
      bankName: "HDFC Bank",
      branchName: "BKT Branch",
      accountNumber: "998877665544",
      ifscCode: "HDFC000456",
      district: "Lucknow",
      block: "Bakshi Ka Talab",
      panchayat: "Asthi",
      village: "Asthi",
    },
  ]);

  // 🟢 Report Filters State
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterBlock, setFilterBlock] = useState("");

  // Filter Logic
  const filteredApps = applications.filter((app) => {
    return (
      (filterStatus === "" || app.status === filterStatus) &&
      (filterDistrict === "" ||
        app.district.toLowerCase().includes(filterDistrict.toLowerCase())) &&
      (filterBlock === "" ||
        app.block.toLowerCase().includes(filterBlock.toLowerCase()))
    );
  });

  // Calculate Metrics
  const summary = {
    total: filteredApps.length,
    pending: filteredApps.filter((app) => app.status === "PENDING").length,
    approved: filteredApps.filter((app) => app.status === "APPROVED").length,
    reverted: filteredApps.filter((app) => app.status === "REVERTED").length,
    rejected: filteredApps.filter((app) => app.status === "REJECTED").length,
  };

  // 🟢 HTML TO EXCEL LOGIC (Pragati Setu Format)
  const exportToExcelWithStyles = () => {
    const headers = [
      "Sr No.",
      "Application ID",
      "Current Status",
      "Member Name",
      "Father/Husband Name",
      "Social Category",
      "Mobile Number",
      "SHG ID",
      "Enterprise Name",
      "Sector",
      "Monthly Sale",
      "Required Amount",
      "Bank Name",
      "Account Number",
      "IFSC Code",
      "District",
      "Block",
      "Panchayat",
      "Bank Remarks/Reason",
    ];

    let tableHTML = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="utf-8"></head>
      <body>
        <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">`;

    tableHTML += `
      <tr>
        <th colspan="${headers.length}" style="background-color: #1F3C88; color: #FFFFFF; font-size: 24px; font-weight: bold; text-align: center; height: 50px;">
          Pragati Setu - Bank Application Report
        </th>
      </tr>`;

    tableHTML += `<tr>`;
    headers.forEach((header) => {
      tableHTML += `<th style="background-color: #475569; color: #FFFFFF; font-weight: bold; padding: 10px;">${header}</th>`;
    });
    tableHTML += `</tr>`;

    filteredApps.forEach((app, index) => {
      const rowData = [
        index + 1,
        app.id,
        app.status,
        app.memberName,
        app.fatherHusbandName,
        app.socialCategory,
        app.mobileNumber,
        app.shgId,
        app.enterpriseName,
        app.sector,
        app.monthlySale,
        app.requiredAmount,
        app.bankName,
        app.accountNumber,
        app.ifscCode,
        app.district,
        app.block,
        app.panchayat,
        app.revertReason || "N/A",
      ];

      tableHTML += `<tr>`;
      rowData.forEach((val) => {
        tableHTML += `<td style="padding: 5px; mso-number-format:'\\@';">${val}</td>`;
      });
      tableHTML += `</tr>`;
    });

    tableHTML += `</table></body></html>`;

    const blob = new Blob([tableHTML], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Pragati_Setu_Bank_Report_${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#1F3C88", margin: 0 }}>
          {" "}
          Bank Analytics & Report
        </h2>
        <button onClick={exportToExcelWithStyles} style={styles.exportBtn}>
          Download Excel Report
        </button>
      </div>

      {/* 🟢 SUMMARY CARDS */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderLeft: "5px solid #1F3C88" }}>
          <span style={styles.cardTitle}>Total Applications</span>
          <span style={{ ...styles.cardValue, color: "#1F3C88" }}>
            {summary.total}
          </span>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "5px solid #0284c7" }}>
          <span style={styles.cardTitle}>Pending at Bank</span>
          <span style={{ ...styles.cardValue, color: "#0284c7" }}>
            {summary.pending}
          </span>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "5px solid #16a34a" }}>
          <span style={styles.cardTitle}>Sanctioned / Approved</span>
          <span style={{ ...styles.cardValue, color: "#16a34a" }}>
            {summary.approved}
          </span>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "5px solid #f59e0b" }}>
          <span style={styles.cardTitle}>Reverted to DMMU</span>
          <span style={{ ...styles.cardValue, color: "#f59e0b" }}>
            {summary.reverted}
          </span>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "5px solid #dc2626" }}>
          <span style={styles.cardTitle}>Rejected</span>
          <span style={{ ...styles.cardValue, color: "#dc2626" }}>
            {summary.rejected}
          </span>
        </div>
      </div>

      {/* 🟢 REPORT FILTERS */}
      <div style={styles.filterCard}>
        <h4 style={{ margin: "0 0 10px 0", color: "#2F5FB3" }}>
          Filter Report Data
        </h4>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <select
            style={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending at Bank</option>
            <option value="APPROVED">Approved</option>
            <option value="REVERTED">Reverted</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Search by District"
            style={styles.input}
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by Block"
            style={styles.input}
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
          />

          <button
            style={styles.resetBtn}
            onClick={() => {
              setFilterStatus("");
              setFilterDistrict("");
              setFilterBlock("");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* 🟢 DETAILED DATA TABLE */}
      <div style={styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1F3C88", color: "white" }}>
                <th style={styles.th}>S.No.</th>
                <th style={styles.th}>App ID</th>
                <th style={styles.th}>Member Name</th>
                <th style={styles.th}>SHG & Location</th>
                <th style={styles.th}>Enterprise Activity</th>
                <th style={styles.th}>Req Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app, index) => {
                // Status Label Mapping
                let statusLabel = "";
                if (app.status === "PENDING") statusLabel = "Pending";
                if (app.status === "APPROVED") statusLabel = "Approved";
                if (app.status === "REVERTED") statusLabel = "Reverted";
                if (app.status === "REJECTED") statusLabel = "Rejected";

                return (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: "white",
                    }}
                  >
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "bold",
                        color: "#475569",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "bold",
                        color: "#475569",
                      }}
                    >
                      {app.id}
                    </td>

                    <td style={styles.td}>
                      <span style={{ color: "#1F3C88", fontWeight: "bold" }}>
                        {app.memberName}
                      </span>
                      <br />
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        Mob: {app.mobileNumber}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <strong>{app.shgId}</strong>
                      <br />
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {app.block}, {app.district}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span style={{ color: "#0f766e", fontWeight: "600" }}>
                        {app.enterpriseName}
                      </span>
                      <br />
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {app.businessActivity}
                      </span>
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        color: "#059669",
                        fontWeight: "bold",
                      }}
                    >
                      {app.requiredAmount}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...getStatusStyle(app.status),
                          padding: "3px 8px",
                          fontSize: "10px",
                        }}
                      >
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              No records found for the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "15px",
    fontWeight: "700",
    textTransform: "uppercase",
  };
  if (status === "PENDING")
    return {
      ...baseStyle,
      backgroundColor: "#e0f2fe",
      color: "#0369a1",
      border: "1px solid #bae6fd",
    };
  if (status === "APPROVED")
    return {
      ...baseStyle,
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  if (status === "REVERTED")
    return {
      ...baseStyle,
      backgroundColor: "#fffbeb",
      color: "#b45309",
      border: "1px solid #fcd34d",
    };
  if (status === "REJECTED")
    return {
      ...baseStyle,
      backgroundColor: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fca5a5",
    };
  return {
    ...baseStyle,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
  };
};

const styles = {
  exportBtn: {
    backgroundColor: "#059669",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 2px 4px rgba(5, 150, 105, 0.2)",
    transition: "all 0.2s",
  },

  // Grid For Cards
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },
  summaryCard: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  cardValue: { fontSize: "28px", fontWeight: "bold", margin: 0 },

  filterCard: {
    backgroundColor: "white",
    padding: "15px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    borderLeft: "4px solid #1F3C88",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#f9fafb",
    color: "#333",
    fontSize: "14px",
    flex: 1,
    minWidth: "150px",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#f9fafb",
    color: "#333",
    fontSize: "14px",
    flex: 1,
    minWidth: "150px",
  },
  resetBtn: {
    padding: "8px 15px",
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#475569",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: "0",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(31, 60, 136, 0.1)",
    overflow: "hidden",
  },
  th: {
    padding: "12px 15px",
    textAlign: "left",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  td: { padding: "12px 15px", verticalAlign: "middle" },
};
