// src/pages/TMS/TP/components/UserModalView.jsx

import React, { useState } from "react";
import { FaCopy, FaCheck, FaTimes, FaKey } from "react-icons/fa";

export default function UserModalView({ open, user, resetData, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!open || !user) return null;

  const handleCopy = () => {
    if (resetData) {
      const textToCopy = `Username: ${resetData.username}\nPassword: ${resetData.newPassword}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDTP = user.role_id === 13;
  const isTPCP = user.role_id === 11;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>User Details</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <FaTimes />
          </button>
        </div>

        <div style={styles.body}>
          {/* RESET PASSWORD SUCCESS HIGHLIGHT */}
          {resetData && (
            <div style={styles.resetBox}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <FaKey style={{ color: "#047857", fontSize: "18px" }} />
                <h4 style={{ margin: 0, color: "#064e3b", fontSize: "16px" }}>
                  Password Reset Successful
                </h4>
              </div>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  color: "#065f46",
                }}
              >
                The user's First Login Tracker has been removed. They must use
                the credentials below to log in and set a new password.
              </p>
              <div style={styles.credentialsBlock}>
                <div>
                  <div style={styles.credLabel}>Username</div>
                  <div style={styles.credValue}>{resetData.username}</div>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <div style={styles.credLabel}>New Password</div>
                  <div style={styles.credValue}>{resetData.newPassword}</div>
                </div>
              </div>
              <button onClick={handleCopy} style={styles.copyBtn(copied)}>
                {copied ? (
                  <>
                    <FaCheck /> Copied!
                  </>
                ) : (
                  <>
                    <FaCopy /> Copy Credentials
                  </>
                )}
              </button>
            </div>
          )}

          {/* USER INFO SECTION */}
          <div style={styles.infoGrid}>
            <div style={styles.infoGroup}>
              <label style={styles.label}>System ID</label>
              <div style={styles.value}>#{user.id}</div>
            </div>

            <div style={styles.infoGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.value}>{user.username || "—"}</div>
            </div>

            <div style={styles.infoGroup}>
              <label style={styles.label}>Role</label>
              <div style={styles.value}>
                <span style={styles.roleBadge(isDTP)}>
                  {isDTP ? "District TP" : "Contact Person (TPCP)"}
                </span>
              </div>
            </div>

            {/* DTP SPECIFIC INFO */}
            {isDTP && (
              <>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Assigned District</label>
                  <div style={styles.value}>{user.district_name_en || "—"}</div>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Active Status</label>
                  <div style={styles.value}>
                    {user.is_active_dtp ? "Active" : "Inactive"}
                  </div>
                </div>
              </>
            )}

            {/* TPCP SPECIFIC INFO */}
            {isTPCP && (
              <>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.value}>{user.name || "—"}</div>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.value}>{user.email || "—"}</div>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Mobile Number</label>
                  <div style={styles.value}>{user.mobile_number || "—"}</div>
                </div>
                <div style={{ ...styles.infoGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Address</label>
                  <div style={styles.value}>{user.address || "—"}</div>
                </div>
              </>
            )}
          </div>

          {/* TPCP ASSIGNED CENTRES */}
          {isTPCP && (
            <div style={styles.centresSection}>
              <label style={styles.label}>Assigned Centres</label>
              {user.assigned_centres && user.assigned_centres.length > 0 ? (
                <ul style={styles.centreList}>
                  {user.assigned_centres.map((c, idx) => (
                    <li key={idx} style={styles.centreListItem}>
                      <strong>{c.venue_name}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {" "}
                        ({c.district__district_name_en})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={styles.noCentres}>
                  No centres currently assigned to this contact person.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.btnOutline}>
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  },
  modal: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "550px",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
    overflow: "hidden",
  },
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
  },
  title: { margin: 0, color: "#1e293b", fontSize: "18px", fontWeight: "700" },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
  },
  body: { padding: "24px", overflowY: "auto" },
  resetBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  credentialsBlock: {
    background: "#ffffff",
    border: "1px solid #d1fae5",
    borderRadius: "6px",
    padding: "12px",
  },
  credLabel: {
    fontSize: "12px",
    color: "#065f46",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  credValue: {
    fontSize: "15px",
    color: "#064e3b",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  copyBtn: (copied) => ({
    marginTop: "12px",
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: copied ? "#059669" : "#10b981",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s",
  }),
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  infoGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  value: { fontSize: "15px", color: "#1e293b", fontWeight: "500" },
  roleBadge: (isDtp) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background: isDtp ? "#fef3c7" : "#e0e7ff",
    color: isDtp ? "#d97706" : "#4f46e5",
  }),
  centresSection: {
    marginTop: "24px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "20px",
  },
  centreList: {
    margin: "10px 0 0 0",
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  centreListItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#334155",
  },
  noCentres: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#94a3b8",
    fontStyle: "italic",
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "6px",
    textAlign: "center",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #e2e8f0",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "flex-end",
  },
  btnOutline: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontWeight: "600",
    cursor: "pointer",
  },
};
