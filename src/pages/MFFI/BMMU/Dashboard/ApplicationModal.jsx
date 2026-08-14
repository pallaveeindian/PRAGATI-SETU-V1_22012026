import React, { useState } from "react";
import ReactDOM from "react-dom";

// 🟢 NAYA PROP: isRevertedByDmmu
export default function ApplicationModal({ app, onClose, onForward, onRevert, isForwarded, isReverted, isRevertedByDmmu }) {
  const [isDocVerified, setIsDocVerified] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [revertComment, setRevertComment] = useState("");

  const [viewDocUrl, setViewDocUrl] = useState(null);
  const [viewDocTitle, setViewDocTitle] = useState("");

  const handleForward = () => {
    onForward(app);
  };

  const handleConfirmRevert = () => {
    if (!revertComment.trim()) return;
    onRevert(app, revertComment);
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

  return ReactDOM.createPortal(
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        
        {/* Sticky Header */}
        <div style={styles.modalHeader}>
          <div>
            <h3 style={{ margin: 0, color: "#1F3C88" }}>Application Review - {app.memberName}</h3>
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

        {/* SECTION 4: Loan Details & Bank */}
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
          <h4 style={{ margin: "0 0 12px 0", color: "#1E293B" }}>📂 Uploaded Verification Documents (4)</h4>
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

        {/* 🟢 NAYA: DMMU Revert Reason Box (Sirf tab dikhega jab isRevertedByDmmu true ho) */}
        {isRevertedByDmmu && (
          <div style={styles.revertByDmmuBox}>
            <span style={{ fontWeight: "bold", color: "#9a3412", fontSize: "15px" }}>
              ⚠️ Attention: This application was reverted by DMMU
            </span>
            <p style={{ margin: "5px 0 0 0", color: "#7c2d12", fontSize: "13px" }}>
              <strong>DMMU Remarks:</strong> {app.revertReason}
            </p>
          </div>
        )}

        {/* Action / Status Workflow Section */}
        {isForwarded ? (
          <div style={styles.forwardedBox}>
            <span style={{ fontWeight: "bold", color: "#0a6905", fontSize: "15px" }}>
              ✓ This application has been verified and forwarded to DMMU.
            </span>
          </div>
        ) : isReverted ? (
          <div style={styles.revertBox}>
            <span style={{ fontWeight: "bold", color: "#991b1b", fontSize: "15px" }}>
              ❌ This application was reverted back to the user.
            </span>
            <p style={{ margin: "5px 0 0 0", color: "#7f1d1d", fontSize: "13px" }}>
              <strong>Reason:</strong> {app.revertReason}
            </p>
          </div>
        ) : isReverting ? (
          <div style={styles.revertBox}>
            <label style={{ display: "block", fontWeight: "bold", color: "#991b1b", marginBottom: "8px" }}>
              Specify Reason for Reverting to User:
            </label>
            <textarea
              value={revertComment}
              onChange={(e) => setRevertComment(e.target.value)}
              placeholder="Provide exact details regarding document or info correction..."
              style={styles.textArea}
            />
          </div>
        ) : (
          <label style={styles.verificationBox}>
            <input 
              type="checkbox" 
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
              checked={isDocVerified}
              onChange={(e) => setIsDocVerified(e.target.checked)}
            />
            <span style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px" }}>
              I have checked and verified all enterprise details, location info, and the 4 attached documents.
            </span>
          </label>
        )}

        {/* Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          
          <div style={{ flex: 1 }}>
            {!isForwarded && !isReverted && (
              !isReverting ? (
                <button style={styles.revertToggleBtn} onClick={() => setIsReverting(true)}>
                  ↩ Revert to User
                </button>
              ) : (
                <button style={styles.cancelRevertBtn} onClick={() => { setIsReverting(false); setRevertComment(""); }}>
                  Cancel Revert
                </button>
              )
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button style={styles.cancelBtn} onClick={onClose}>Close</button>
            
            {!isForwarded && !isReverted && (
              isReverting ? (
                <button 
                  style={revertComment.trim().length > 0 ? styles.confirmRevertBtn : styles.disabledBtn} 
                  disabled={revertComment.trim().length === 0}
                  onClick={handleConfirmRevert}
                >
                  Confirm Revert
                </button>
              ) : (
                <button 
                  style={isDocVerified ? styles.forwardBtn : styles.disabledBtn} 
                  disabled={!isDocVerified}
                  onClick={handleForward}
                >
                  Forward to DMMU ➔
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
  modalOverlay: { 
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    backdropFilter: "blur(5px)", 
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 
  },
  modalContent: { 
    backgroundColor: "white", 
    width: "850px", 
    maxWidth: "95%", 
    maxHeight: "90vh", 
    overflowY: "auto", 
    borderRadius: "10px", 
    padding: "20px 25px", 
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)", 
    position: "relative" 
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px",
    position: "sticky", top: -20, backgroundColor: "#fff", zIndex: 10
  },
  closeIconBtn: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#999" },
  
  sectionCard: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "15px"
  },
  sectionTitle: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    color: "#1F3C88",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "4px"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px 15px",
    fontSize: "13px"
  },
  label: { display: "block", fontSize: "11px", color: "#64748b", marginBottom: "2px" },
  docViewBtn: { 
    backgroundColor: "#ffffff", 
    border: "1px solid #93c5fd", 
    padding: "10px", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    color: "#1d4ed8", 
    textAlign: "center",
    fontSize: "13px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)" 
  },
  
  forwardedBox: { backgroundColor: "#e0f2fe", padding: "12px", borderRadius: "8px", border: "1px solid #bae6fd", marginTop: "10px", textAlign: "center" },
  verificationBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f0fdf4", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0", cursor: "pointer", marginTop: "10px" },
  revertBox: { backgroundColor: "#fef2f2", padding: "12px", borderRadius: "8px", border: "1px solid #fecaca", marginTop: "10px" },
  revertByDmmuBox: { backgroundColor: "#fffbeb", padding: "12px", borderRadius: "8px", border: "1px solid #fcd34d", marginBottom: "15px" },
  textArea: { width: "100%", boxSizing: "border-box", padding: "10px", borderRadius: "6px", border: "1px solid #fca5a5", minHeight: "70px", outline: "none", resize: "vertical" },
  
  cancelBtn: { backgroundColor: "#f1f5f9", color: "#475569", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  forwardBtn: { backgroundColor: "#10b981", color: "white", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  disabledBtn: { backgroundColor: "#e2e8f0", color: "#94a3b8", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "not-allowed", fontWeight: "bold" },
  
  revertToggleBtn: { backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "9px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  cancelRevertBtn: { backgroundColor: "transparent", color: "#64748b", border: "1px solid #cbd5e1", padding: "9px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  confirmRevertBtn: { backgroundColor: "#ef4444", color: "white", padding: "9px 18px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
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