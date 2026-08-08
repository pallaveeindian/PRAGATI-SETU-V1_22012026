import React, { useState } from "react";
import ReactDOM from "react-dom";

export default function BankReviewModal({ app, onClose, onApprove, onRevert, onReject }) {
  const [bankVerified, setBankVerified] = useState(false);
  const [actionType, setActionType] = useState(null); // 'revert' | 'reject' | null
  const [reasonComment, setReasonComment] = useState("");

   const [viewDocUrl, setViewDocUrl] = useState(null);
      const [viewDocTitle, setViewDocTitle] = useState("");

  const handleConfirmAction = () => {
    if (!reasonComment.trim()) return;
    if (actionType === "revert") {
      onRevert(app, reasonComment);
    } else if (actionType === "reject") {
      onReject(app, reasonComment);
    }
  };

   const dummyDocUrls = {
    "Identity Proof": "https://images.moneycontrol.com/static-mcnews/2025/04/20250404112835_Aadhaar-card-generated-using-AI.png",
    "Income Proof": "https://imgv2-2-f.scribdassets.com/img/document/816078655/original/46804c7246/1?v=1",
    "VO Verification Document": "https://imgv2-1-f.scribdassets.com/img/document/883960940/original/e10f721dd8/1?v=1",
    "CLF Verification Document": "https://images.template.net/453709/Verification-Letter-For-Credit-Application-Template-edit-online.png"
  };

  const handleDocView = (docName) => {
    // API se real URL aaye toh yahan change karein (eg. app.docs.idProof)
    const url = dummyDocUrls[docName]; 
    setViewDocUrl(url);
    setViewDocTitle(docName);
  };

  const closeDocumentModal = () => {
    setViewDocUrl(null);
    setViewDocTitle("");
  };

  // 🟢 Helper Function check karne ke liye ki File Image hai ya Iframe/PDF
  const isImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|png|gif)$/i) || url.includes("images.moneycontrol.com") || url.includes("images.template.net");
  };


  const isReadOnly = app.status !== "PENDING";

  return ReactDOM.createPortal(
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        
        {/* Sticky Header */}
        <div style={styles.modalHeader}>
          <div>
            <h3 style={{ margin: 0, color: "#1F3C88" }}>Bank Branch Loan Review - {app.memberName}</h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>App ID: <strong>{app.id}</strong></span>
          </div>
          <button style={styles.closeIconBtn} onClick={onClose}>✖</button>
        </div>

        {/* SECTION 1: Member Personal Details */}
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}> Member Personal Details</h4>
          <div style={styles.gridContainer}>
            <div><span style={styles.label}>Name of Member:</span> <strong>{app.memberName}</strong></div>
            <div><span style={styles.label}>Father / Husband Name:</span> <strong>{app.fatherHusbandName}</strong></div>
            <div><span style={styles.label}>Marital Status:</span> <strong>{app.maritalStatus}</strong></div>
            <div><span style={styles.label}>Social Category:</span> <strong>{app.socialCategory}</strong></div>
            <div><span style={styles.label}>Religion:</span> <strong>{app.religion}</strong></div>
            <div><span style={styles.label}>Date of Birth:</span> <strong>{app.dob}</strong></div>
            <div><span style={styles.label}>Mobile Number:</span> <strong>{app.mobileNumber}</strong></div>
          </div>
        </div>

        {/* SECTION 2: SHG & Institutional Details */}
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}> SHG & Institutional Details</h4>
          <div style={styles.gridContainer}>
            <div><span style={styles.label}>SHG ID:</span> <strong>{app.shgId}</strong></div>
            <div><span style={styles.label}>SHG Joining Date:</span> <strong>{app.shgJoiningDate}</strong></div>
            <div><span style={styles.label}>VO Name:</span> <strong>{app.voName}</strong></div>
            <div><span style={styles.label}>CLF Name:</span> <strong>{app.clfName}</strong></div>
          </div>
        </div>

        {/* SECTION 3: Enterprise & Financial Details */}
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}> Enterprise & Business Information</h4>
          <div style={styles.gridContainer}>
            <div><span style={styles.label}>Name of Enterprise:</span> <strong style={{ color: "#0f766e" }}>{app.enterpriseName}</strong></div>
            <div><span style={styles.label}>Nature of Enterprise:</span> <strong>{app.enterpriseNature}</strong></div>
            <div><span style={styles.label}>Type of Enterprise:</span> <strong>{app.enterpriseType}</strong></div>
            <div><span style={styles.label}>Sector:</span> <strong>{app.sector}</strong></div>
            <div><span style={styles.label}>Business Activity:</span> <strong>{app.businessActivity}</strong></div>
            <div><span style={styles.label}>Udhyam Registration No:</span> <strong style={{ color: "#d97706" }}>{app.udhyamRegNo}</strong></div>
            <div><span style={styles.label}>Monthly Sale:</span> <strong style={{ color: "#059669" }}>{app.monthlySale}</strong></div>
            <div><span style={styles.label}>Monthly Expense:</span> <strong style={{ color: "#dc2626" }}>{app.monthlyExpense}</strong></div>
            <div style={{ gridColumn: "span 2" }}><span style={styles.label}>Work Place / Product Sales Area:</span> <strong>{app.sellArea}</strong></div>
          </div>
        </div>

        {/* SECTION 4: Loan Request & Account Details */}
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}> Loan Request & Bank Details</h4>
          <div style={styles.gridContainer}>
            <div><span style={styles.label}>Required Amount:</span> <strong style={{ color: "#2563eb", fontSize: "16px" }}>{app.requiredAmount}</strong></div>
            <div><span style={styles.label}>Purpose of Loan:</span> <strong>{app.purposeOfLoan}</strong></div>
            <div><span style={styles.label}>Bank Name:</span> <strong>{app.bankName}</strong></div>
            <div><span style={styles.label}>Branch Name:</span> <strong>{app.branchName}</strong></div>
            <div><span style={styles.label}>Account Number:</span> <strong>{app.accountNumber}</strong></div>
            <div><span style={styles.label}>IFSC Code:</span> <strong>{app.ifscCode}</strong></div>
          </div>
        </div>

        {/* SECTION 5: Location Details */}
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}> Residential Location</h4>
          <div style={styles.gridContainer}>
            <div><span style={styles.label}>District:</span> <strong>{app.district}</strong></div>
            <div><span style={styles.label}>Block:</span> <strong>{app.block}</strong></div>
            <div><span style={styles.label}>Panchayat:</span> <strong>{app.panchayat}</strong></div>
            <div><span style={styles.label}>Village:</span> <strong>{app.village}</strong></div>
          </div>
        </div>

        {/* SECTION 6: Uploaded Documents */}
        <div style={{ ...styles.sectionCard, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#1E293B" }}>📂 Verification Documents (4)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
            <button style={styles.docViewBtn} onClick={() => handleDocView("Identity Proof")}>
              👁️ Identity Proof
            </button>
            <button style={styles.docViewBtn} onClick={() => handleDocView("Income Proof")}>
              👁️ Income Proof
            </button>
            <button style={styles.docViewBtn} onClick={() => handleDocView("VO Verification Document")}>
              👁️ VO Verification
            </button>
            <button style={styles.docViewBtn} onClick={() => handleDocView("CLF Verification Document")}>
              👁️ CLF Verification
            </button>
          </div>
        </div>

        {/* Action / Status Workflow Section */}
        {app.status === "APPROVED" ? (
          <div style={styles.approvedBox}>
            <span style={{ fontWeight: "bold", color: "#166534", fontSize: "15px" }}>
              ✓ Loan Sanctioned & Approved by Bank Branch.
            </span>
          </div>
        ) : app.status === "REVERTED" ? (
          <div style={styles.revertBox}>
            <span style={{ fontWeight: "bold", color: "#9a3412", fontSize: "15px" }}>
              ↩️ This application was reverted back to DMMU.
            </span>
            <p style={{ margin: "5px 0 0 0", color: "#7c2d12", fontSize: "13px" }}>
              <strong>Bank Reason:</strong> {app.revertReason}
            </p>
          </div>
        ) : app.status === "REJECTED" ? (
          <div style={styles.revertBox}>
            <span style={{ fontWeight: "bold", color: "#991b1b", fontSize: "15px" }}>
              🚫 This application was Rejected by Bank.
            </span>
            <p style={{ margin: "5px 0 0 0", color: "#7f1d1d", fontSize: "13px" }}>
              <strong>Rejection Reason:</strong> {app.revertReason}
            </p>
          </div>
        ) : actionType ? (
          <div style={styles.revertBox}>
            <label style={{ display: "block", fontWeight: "bold", color: actionType === "reject" ? "#991b1b" : "#b45309", marginBottom: "8px" }}>
              {actionType === "reject" ? "Specify Reason for Rejection:" : "Specify Reason for Reverting to DMMU:"}
            </label>
            <textarea
              value={reasonComment}
              onChange={(e) => setReasonComment(e.target.value)}
              placeholder="Enter detailed comments..."
              style={styles.textArea}
            />
          </div>
        ) : (
          <label style={styles.verificationBox}>
            <input 
              type="checkbox" 
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
              checked={bankVerified}
              onChange={(e) => setBankVerified(e.target.checked)}
            />
            <span style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px" }}>
              All documents & bank account details verified. I approve and sanction this loan.
            </span>
          </label>
        )}

        {/* Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          
          {/* Left Actions (Revert / Reject toggles) */}
          <div style={{ flex: 1 }}>
            {!isReadOnly && !actionType && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={styles.revertToggleBtn} onClick={() => setActionType("revert")}>
                  ↩ Revert to DMMU
                </button>
                <button style={styles.rejectToggleBtn} onClick={() => setActionType("reject")}>
                  🚫 Reject
                </button>
              </div>
            )}

            {!isReadOnly && actionType && (
              <button style={styles.cancelRevertBtn} onClick={() => { setActionType(null); setReasonComment(""); }}>
                Cancel
              </button>
            )}
          </div>

          {/* Right Actions (Close / Approve / Confirm) */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button style={styles.cancelBtn} onClick={onClose}>Close</button>
            
            {!isReadOnly && (
              actionType ? (
                <button 
                  style={reasonComment.trim().length > 0 ? (actionType === "reject" ? styles.confirmRejectBtn : styles.confirmRevertBtn) : styles.disabledBtn} 
                  disabled={reasonComment.trim().length === 0}
                  onClick={handleConfirmAction}
                >
                  {actionType === "reject" ? "Confirm Reject" : "Confirm Revert"}
                </button>
              ) : (
                <button 
                  style={bankVerified ? styles.forwardBtn : styles.disabledBtn} 
                  disabled={!bankVerified}
                  onClick={() => onApprove(app)}
                >
                  Approve & Sanction Loan ➔
                </button>
              )
            )}
          </div>
        </div>

      </div>

        {/* 🟢 Document View Modal with Image Centering logic */}
       {viewDocUrl && (
        <div style={docModalStyles.overlay}>
          <div style={docModalStyles.modalContainer}>
            <div style={docModalStyles.header}>
              <h3 style={{ margin: 0, color: "#1F3C88" }}>{viewDocTitle}</h3>
              <button onClick={closeDocumentModal} style={docModalStyles.closeBtn}>
                ❌ Close
              </button>
            </div>
            
            <div style={docModalStyles.body}>
              {/* Check lagaya hai: Image hai toh <img> tag dikhao varna iframe */}
              {isImageUrl(viewDocUrl) ? (
                <img 
                  src={viewDocUrl} 
                  alt={viewDocTitle} 
                  style={docModalStyles.imageStyle} 
                />
              ) : (
                <iframe 
                  src={viewDocUrl} 
                  style={docModalStyles.iframe} 
                  title={viewDocTitle}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

// Styles
const styles = {
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 },
  modalContent: { backgroundColor: "white", width: "850px", maxWidth: "95%", maxHeight: "90vh", overflowY: "auto", borderRadius: "10px", padding: "20px 25px", boxShadow: "0 15px 30px rgba(0,0,0,0.3)", position: "relative" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px", position: "sticky", top: -20, backgroundColor: "#fff", zIndex: 10 },
  closeIconBtn: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#999" },
  sectionCard: { backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 15px", marginBottom: "15px" },
  sectionTitle: { margin: "0 0 10px 0", fontSize: "14px", color: "#1F3C88", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px 15px", fontSize: "13px" },
  label: { display: "block", fontSize: "11px", color: "#64748b", marginBottom: "2px" },
  docViewBtn: { backgroundColor: "#ffffff", border: "1px solid #93c5fd", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", color: "#1d4ed8", textAlign: "center", fontSize: "13px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  
  approvedBox: { backgroundColor: "#dcfce7", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0", marginTop: "10px", textAlign: "center" },
  verificationBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f0fdf4", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0", cursor: "pointer", marginTop: "10px" },
  revertBox: { backgroundColor: "#fef2f2", padding: "12px", borderRadius: "8px", border: "1px solid #fecaca", marginTop: "10px" },
  textArea: { width: "100%", boxSizing: "border-box", padding: "10px", borderRadius: "6px", border: "1px solid #fca5a5", minHeight: "70px", outline: "none", resize: "vertical" },
  
  cancelBtn: { backgroundColor: "#f1f5f9", color: "#475569", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  forwardBtn: { backgroundColor: "#059669", color: "white", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  disabledBtn: { backgroundColor: "#e2e8f0", color: "#94a3b8", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "not-allowed", fontWeight: "bold" },
  revertToggleBtn: { backgroundColor: "transparent", color: "#d97706", border: "1px solid #d97706", padding: "9px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  rejectToggleBtn: { backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "9px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  cancelRevertBtn: { backgroundColor: "transparent", color: "#64748b", border: "1px solid #cbd5e1", padding: "9px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  confirmRevertBtn: { backgroundColor: "#d97706", color: "white", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  confirmRejectBtn: { backgroundColor: "#ef4444", color: "white", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
};
const docModalStyles = {
  overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 },
  
  modalContainer: { backgroundColor: "#fff", width: "75%", height: "95%", borderRadius: "10px", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.4)" },
  
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1" },
  
  closeBtn: { background: "transparent", border: "none", fontSize: "14px", cursor: "pointer", color: "#dc2626", fontWeight: "bold" },
  
  // Body Style: Ye image ko bilkul center me rakhega aur scroll hone se rokega
  body: { 
    flex: 1, 
    padding: "10px", 
    backgroundColor: "#f8fafc",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    overflow: "hidden" 
  },
  
  // Agar PDF hai toh Iframe use hoga
  iframe: { width: "100%", height: "100%", border: "none", borderRadius: "5px" },
  
  // Agar Image hai toh ye style use hoga (Ye image ko modal se bada nahi hone dega)
  imageStyle: { 
    maxWidth: "100%", 
    maxHeight: "100%", 
    objectFit: "contain", // Isse image shrink ho jayegi lekin kategi nahi
    borderRadius: "5px" 
  }
};