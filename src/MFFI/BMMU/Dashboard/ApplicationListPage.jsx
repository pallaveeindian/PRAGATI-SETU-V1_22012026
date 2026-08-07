import React, { useState } from "react";
import ApplicationModal from "./ApplicationModal";
import ApplicationFilters from "./ApplicationFilters"; 

export default function ApplicationListPage() {
  const initialFilters = {
    blockId: "", block: "", panchayatId: "", panchayat: "",
    villageId: "", village: "", socialCategory: "", religion: "",
  };

  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);

  // Active Tab State (PENDING, FORWARDED, REVERTED, REVERTED_BY_DMMU)
  const [activeTab, setActiveTab] = useState("PENDING");

  // Mock Data Array
  const [applications, setApplications] = useState([
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
      enterpriseNature: "New",
      enterpriseType: "Micro",
      sector: "Tarding",
      businessActivity: "Milk Processing & Paneer Supply",
      monthlySale: "₹45,000",
      monthlyExpense: "₹20,000",
      udhyamRegNo: "UDYAM-UP-12-0034567",
      sellArea: "Local GP & Nearby District Market",
      purposeOfLoan: "Dairy Expansion & Chilling Unit Purchase",
      requiredAmount: "₹2,00,000",
      bankName: "State Bank of India ",
      branchName:"Gosainganj ",
      accountNumber:"34567890123",
      ifscCode:"SBIN00987",
      district: "Lucknow",
      block: "Gosainganj",
      panchayat: "Amethi",
      village: "Amethi Khurd",
      docs: { idProof: "id_proof_sita.pdf", incomeProof: "income_proof_sita.pdf", voVerification: "vo_verification_sita.pdf", clfVerification: "clf_verification_sita.pdf" }
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
      accountNumber:"98765432109",
      ifscCode:"BARB0MOHAN",
      district: "Lucknow",
      block: "Mohanlalganj",
      panchayat: "Sissendi",
      village: "Sissendi",
      docs: { idProof: "id_proof_geeta.pdf", incomeProof: "income_proof_geeta.pdf", voVerification: "vo_verification_geeta.pdf", clfVerification: "clf_verification_geeta.pdf" }
    }
  ]);

  const [filteredApps, setFilteredApps] = useState(applications);
  const [selectedApp, setSelectedApp] = useState(null);

  // Filter based on active tab
  const displayedApps = filteredApps.filter(app => app.status === activeTab);

  const openVerificationModal = (app) => setSelectedApp(app);
  const closeModal = () => setSelectedApp(null);

  const handleForwardToDMM = (app) => {
    const updatedApps = applications.map(a => 
      a.id === app.id ? { ...a, status: "FORWARDED" } : a
    );
    setApplications(updatedApps);
    setFilteredApps(updatedApps);
    closeModal();
    alert(`${app.memberName}'s application forwarded to DMMU successfully!`);
  };

  const handleRevert = (app, reason) => {
    const updatedApps = applications.map(a => 
      a.id === app.id ? { ...a, status: "REVERTED", revertReason: reason } : a
    );
    setApplications(updatedApps);
    setFilteredApps(updatedApps);
    closeModal();
    alert(`Application ${app.id} Reverted successfully!`);
  };

  // 🟢 EXPORT TO EXCEL LOGIC (BMMU)
  const exportToExcelWithStyles = () => {
    // 1. Column Headers (added 'Sr No.')
    const headers = [
      "Sr No.", "Application ID", "Current Status", "Member Name", "Father/Husband Name", "Marital Status", 
      "Social Category", "Religion", "DOB", "Mobile Number", "SHG ID", "SHG Joining Date", 
      "VO Name", "CLF Name", "Enterprise Name", "Enterprise Nature", "Enterprise Type", 
      "Sector", "Business Activity", "Udhyam Reg No", "Monthly Sale", "Monthly Expense", 
      "Sell Area", "Required Amount", "Purpose of Loan", "Bank Name", "Branch Name", 
      "Account Number", "IFSC Code", "District", "Block", "Panchayat", "Village", "Revert Reason"
    ];

    // 2. Create HTML Table String
    let tableHTML = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="utf-8"></head>
      <body>
        <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">`;
    
    // 3. Top Title Row ("Pragati Setu")
    tableHTML += `
      <tr>
        <th colspan="${headers.length}" style="background-color: #1F3C88; color: #FFFFFF; font-size: 24px; font-weight: bold; text-align: center; height: 50px;">
          Pragati Setu
        </th>
      </tr>`;
    
    // 4. Data Headers Row
    tableHTML += `<tr>`;
    headers.forEach(header => {
      tableHTML += `<th style="background-color: #475569; color: #FFFFFF; font-weight: bold; padding: 10px;">${header}</th>`;
    });
    tableHTML += `</tr>`;

    // 5. Data Rows
    displayedApps.forEach((app, index) => {
      const rowData = [
        index + 1, // Sr No.
        app.id, app.status, app.memberName, app.fatherHusbandName, app.maritalStatus, 
        app.socialCategory, app.religion, app.dob, app.mobileNumber, app.shgId, app.shgJoiningDate, 
        app.voName, app.clfName, app.enterpriseName, app.enterpriseNature, app.enterpriseType, 
        app.sector, app.businessActivity, app.udhyamRegNo, app.monthlySale, app.monthlyExpense, 
        app.sellArea, app.requiredAmount, app.purposeOfLoan, app.bankName, app.branchName, 
        app.accountNumber, app.ifscCode, app.district, app.block, app.panchayat, app.village, app.revertReason || "N/A"
      ];
      
      tableHTML += `<tr>`;
      rowData.forEach(val => {
        // Prevent scientific notation for large numbers (like Account No / Mobile No)
        tableHTML += `<td style="padding: 5px; mso-number-format:'\\@';">${val}</td>`;
      });
      tableHTML += `</tr>`;
    });

    tableHTML += `</table></body></html>`;

    // 6. Download Trigger
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `Pragati_Setu_Applications_${activeTab}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      
      {/* 🟢 Header with Export Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#1F3C88", margin: 0 }}>Application Verification List</h2>
        
        <button onClick={exportToExcelWithStyles} style={styles.exportBtn}>
           Export to Excel
        </button>
      </div>

      {/* TABS UI */}
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === "PENDING" ? styles.activeTab : styles.inactiveTab} 
          onClick={() => setActiveTab("PENDING")}
        >
           Pending at BMMU
        </button>
       
        <button 
          style={activeTab === "FORWARDED" ? styles.activeTab : styles.inactiveTab} 
          onClick={() => setActiveTab("FORWARDED")}
        >
           Forwarded to DMMU
        </button>

         <button 
          style={activeTab === "REVERTED_BY_DMMU" ? styles.activeTab : styles.inactiveTab} 
          onClick={() => setActiveTab("REVERTED_BY_DMMU")}
        >
           Reverted by DMMU
        </button>
        <button 
          style={activeTab === "REVERTED" ? styles.activeTab : styles.inactiveTab} 
          onClick={() => setActiveTab("REVERTED")}
        >
           Reverted to User
        </button>

        <button
          style={activeTab === "REVERTED_BY_BANK" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab("REVERTED_BY_BANK")}
        >
           Reverted by Bank
        </button>
        <button
          style={activeTab === "REJECTION" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab("REJECTION")}
        >
          Bank Rejection
        </button>
      </div>

      <ApplicationFilters 
        filters={draftFilters} 
        setFilters={setDraftFilters} 
        applications={applications} 
        setFilteredApps={setFilteredApps} 
        onApply={() => setAppliedFilters(draftFilters)}
        onReset={(nextFilters) => {
          setDraftFilters(nextFilters || initialFilters);
          setAppliedFilters(nextFilters || initialFilters);
        }}
      />

      <div style={styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#1F3C88", color: "white" }}>
                <th style={styles.th}>Sr No.</th>
                <th style={styles.th}>Member & Guardian</th>
                <th style={styles.th}>Enterprise & Loan</th>
                <th style={styles.th}>SHG / VO Details</th>
                <th style={styles.th}>Location Details</th>
                <th style={styles.th}>App ID & Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedApps.map((app, index) => {
                const actionBtnText = (app.status === "PENDING" || app.status === "REVERTED_BY_DMMU") 
                  ? "View & Verify" 
                  : "View";

                let statusLabel = "";
                if (app.status === "PENDING") statusLabel = "Pending at BMMU";
                if (app.status === "FORWARDED") statusLabel = "Pending at DMMU";
                if (app.status === "REVERTED") statusLabel = "Reverted to User";
                if (app.status === "REVERTED_BY_DMMU") statusLabel = "Reverted by DMMU";

                return (
                  <tr key={app.id} style={{ borderBottom: "1px solid #eee", backgroundColor: "white" }}>
                    <td style={styles.td}><strong>{index + 1}</strong></td>
                    
                    <td style={styles.td}>
                      <span style={{ color: "#1F3C88", fontSize: "15px", fontWeight: "bold" }}>{app.memberName}</span><br />
                      <span style={{ fontSize: "12px", color: "#666" }}>S/O, W/O: {app.fatherHusbandName}</span><br/>
                      <span style={{ fontSize: "11px", color: "#475569" }}>Mob: {app.mobileNumber}</span>
                    </td>

                    <td style={styles.td}>
                      <strong style={{ color: "#0f766e" }}>{app.enterpriseName}</strong><br />
                      <span style={{ fontSize: "12px", color: "#059669" }}>Req: {app.requiredAmount}</span> | <span style={{ fontSize: "11px", color: "#666" }}>{app.purposeOfLoan}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={{ color: "#334155", fontWeight: "600" }}>{app.shgId}</span><br />
                      <span style={{ fontSize: "12px", color: "#64748b" }}>VO: {app.voName}</span><br />
                      <span style={{ fontSize: "11px", color: "#64748b" }}>CLF: {app.clfName}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={{ color: "#666" }}>Dist:</span> {app.district} | <span style={{ color: "#666" }}>Block:</span> {app.block}<br />
                      <span style={{ color: "#666" }}>GP:</span> {app.panchayat} | <span style={{ color: "#666" }}>Vill:</span> {app.village}
                    </td>
                    
                    <td style={styles.td}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                        <strong style={{ color: "#475569", fontSize: "14px" }}>{app.id}</strong>
                        <span style={{ ...getStatusStyle(app.status), padding: "3px 8px", fontSize: "10px" }}>
                          <span style={{ ...getDotStyle(app.status), width: "4px", height: "4px" }}></span>
                          {statusLabel}
                        </span>
                        
                        {(app.status === "REVERTED" || app.status === "REVERTED_BY_DMMU") && (
                          <span style={{ color: app.status === "REVERTED_BY_DMMU" ? "#b45309" : "#dc2626", fontSize: "11px", marginTop: "4px" }}>
                            <strong>Reason:</strong> {app.revertReason}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <button style={styles.viewBtn} onClick={() => openVerificationModal(app)}>
                        {actionBtnText}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayedApps.length === 0 && (
            <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              No applications found in <strong>{activeTab}</strong> tab.
            </p>
          )}
        </div>
      </div>

      {selectedApp && (
        <ApplicationModal 
          app={selectedApp} 
          onClose={closeModal} 
          onForward={handleForwardToDMM} 
          onRevert={handleRevert}
          isForwarded={selectedApp.status === "FORWARDED"} 
          isReverted={selectedApp.status === "REVERTED"}
          isRevertedByDmmu={selectedApp.status === "REVERTED_BY_DMMU"} 
        />
      )}
    </div>
  );
}

const getStatusStyle = (status) => {
  const baseStyle = { display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "15px", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", textAlign: "center" };
  if (status === "PENDING") return { ...baseStyle, backgroundColor: "#fef9c3", color: "#a16207", border: "1px solid #fde047" };
  if (status === "FORWARDED") return { ...baseStyle, backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" };
  if (status === "REVERTED") return { ...baseStyle, backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fca5a5" };
  if (status === "REVERTED_BY_DMMU") return { ...baseStyle, backgroundColor: "#fffbeb", color: "#b45309", border: "1px solid #fcd34d" };
  return { ...baseStyle, backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" };
};

const getDotStyle = (status) => {
  const baseStyle = { width: "5px", height: "5px", borderRadius: "50%" };
  if (status === "PENDING") return { ...baseStyle, backgroundColor: "#eab308" };
  if (status === "FORWARDED") return { ...baseStyle, backgroundColor: "#0284c7" };
  if (status === "REVERTED") return { ...baseStyle, backgroundColor: "#dc2626" };
  if (status === "REVERTED_BY_DMMU") return { ...baseStyle, backgroundColor: "#f59e0b" };
  return { ...baseStyle, backgroundColor: "#9ca3af" };
};

const styles = {
  card: { backgroundColor: "white", padding: "0", borderRadius: "10px", boxShadow: "0 4px 12px rgba(31, 60, 136, 0.1)", overflow: "hidden" },
  th: { padding: "12px 15px", textAlign: "left", fontWeight: "600", whiteSpace: "nowrap" },
  td: { padding: "12px 15px", verticalAlign: "middle" },
  viewBtn: { backgroundColor: "#ffffff", color: "#2F5FB3", padding: "6px 14px", border: "1px solid #2F5FB3", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", transition: "all 0.2s ease" },
  
  exportBtn: { backgroundColor: "#059669", color: "white", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 4px rgba(5, 150, 105, 0.2)", transition: "all 0.2s" },

  tabContainer: { display: "flex", gap: "1px", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", overflowX: "auto" },
  activeTab: { backgroundColor: "#1F3C88", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap" },
  inactiveTab: { backgroundColor: "transparent", color: "#64748b", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "0.2s", whiteSpace: "nowrap" }
};