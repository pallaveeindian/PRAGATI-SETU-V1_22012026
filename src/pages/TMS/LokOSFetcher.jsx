// src/pages/TMS/LokOSFetcher.jsx
// Usage,
// import LokOSFetcher from "src/pages/TMS/LokOSFetcher";

// <LokOSFetcher
//   isOpen={isModalOpen}
//   onClose={() => setIsModalOpen(false)}
//   lokos_shg_code={selectedRow?.lokos_shg_code}
//   lokos_member_code={selectedRow?.lokos_member_code}
//   fallbackData={selectedRow}
// />

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { EPSAKHI_API } from "../../api/axios";
import {
  FaUserCircle,
  FaTimes,
  FaIdCard,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaVenusMars,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaLeaf,
  FaSyncAlt,
  FaCopy,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers,
  FaLayerGroup,
  FaBriefcase,
  FaShieldAlt,
} from "react-icons/fa";

export default function LokOSFetcher({
  lokos_shg_code,
  shgCode,
  lokos_member_code,
  memberCode,
  fallbackData = null,
  isOpen,
  open,
  onClose,
  showTrigger = false,
  triggerClassName = "",
  triggerStyle = {},
  children,
}) {
  // Normalize prop aliases so it works effortlessly anywhere
  const resolvedShgCode =
    lokos_shg_code ||
    shgCode ||
    fallbackData?.lokos_shg_code ||
    fallbackData?.shg_code ||
    "";
  const resolvedMemberCode =
    lokos_member_code ||
    memberCode ||
    fallbackData?.lokos_member_code ||
    fallbackData?.member_code ||
    "";

  // Support both controlled mode (isOpen/open passed) and self-triggered mode
  const isControlled = typeof isOpen === "boolean" || typeof open === "boolean";
  const controlledOpen = Boolean(isOpen ?? open);

  const [internalOpen, setInternalOpen] = useState(false);
  const modalOpen = isControlled ? controlledOpen : internalOpen;

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [shgDetailData, setShgDetailData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedField, setCopiedField] = useState(null);

  const handleClose = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    if (onClose) {
      onClose();
    }
  }, [isControlled, onClose]);

  const fetchLokosProfile = useCallback(async () => {
    if (!resolvedShgCode || !resolvedMemberCode) {
      setProfileData(fallbackData || {});
      setError(
        !resolvedShgCode
          ? "SHG Code is missing for live LokOS lookup. Showing local record."
          : "Member Code is missing for live LokOS lookup.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [memberRes, shgRes] = await Promise.allSettled([
        EPSAKHI_API.upsrlmShgMembers(resolvedShgCode, {
          search: resolvedMemberCode,
        }),
        typeof EPSAKHI_API.upsrlmShgDetail === "function"
          ? EPSAKHI_API.upsrlmShgDetail(resolvedShgCode)
          : Promise.resolve(null),
      ]);

      let fetchedMember = null;
      if (memberRes.status === "fulfilled" && memberRes.value) {
        const raw = memberRes.value?.data;
        const list =
          raw?.data || raw?.results || (Array.isArray(raw) ? raw : null);

        if (Array.isArray(list) && list.length > 0) {
          // Prefer exact member_code match if multiple returned
          fetchedMember =
            list.find(
              (m) =>
                String(m.member_code || m.lokos_member_code) ===
                String(resolvedMemberCode),
            ) || list[0];
        } else if (
          raw &&
          typeof raw === "object" &&
          !Array.isArray(raw) &&
          !raw.results
        ) {
          fetchedMember = raw;
        }
      }

      if (shgRes.status === "fulfilled" && shgRes.value?.data) {
        setShgDetailData(shgRes.value.data);
      }

      if (fetchedMember) {
        setProfileData({ ...(fallbackData || {}), ...fetchedMember });
        setError(null);
      } else {
        setProfileData(fallbackData || {});
        setError(
          "Detailed profile not found in LokOS. Showing cached beneficiary record.",
        );
      }
    } catch (err) {
      console.error("LokOSFetcher error:", err);
      setProfileData(fallbackData || {});
      setError(
        "Unable to reach LokOS server. Showing cached beneficiary record.",
      );
    } finally {
      setLoading(false);
    }
  }, [resolvedShgCode, resolvedMemberCode, fallbackData]);

  // Trigger fetch whenever modal opens with valid codes
  useEffect(() => {
    if (modalOpen) {
      setActiveTab("overview");
      fetchLokosProfile();
    }
  }, [modalOpen, fetchLokosProfile]);

  // Escape key & body scroll lock
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, handleClose]);

  const handleCopy = (text, label) => {
    if (!text || text === "N/A" || text === "-") return;
    navigator.clipboard?.writeText(String(text));
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // =========================================================================
  // SAFE DATA EXTRACTORS
  // =========================================================================
  const d = useMemo(
    () => ({ ...(fallbackData || {}), ...(profileData || {}) }),
    [fallbackData, profileData],
  );

  const fullName = d.member_name || d.full_name || d.name || "Unknown Member";
  const displayMemberCode =
    d.member_code ||
    d.lokos_member_code ||
    d.nic_member_code ||
    resolvedMemberCode ||
    "N/A";
  const displayShgCode =
    d.lokos_shg_code ||
    d.shg_code ||
    shgDetailData?.shg_code ||
    resolvedShgCode ||
    "N/A";
  const displayShgName =
    d.lokos_shg_name ||
    d.shg_name ||
    shgDetailData?.shg_name ||
    shgDetailData?.name ||
    null;

  // Designations
  let designations = "SHG Member";
  if (
    Array.isArray(d.member_designations) &&
    d.member_designations.length > 0
  ) {
    designations =
      d.member_designations
        .map((des) => des?.designation || des?.role_name)
        .filter(Boolean)
        .join(", ") || "SHG Member";
  } else if (d.designation) {
    designations = d.designation;
  }

  // Phone Numbers
  let phone = d.mobile || d.phone_no || d.mobile_no || "-";
  if (Array.isArray(d.member_phones) && d.member_phones.length > 0) {
    phone =
      d.member_phones
        .map((p) => p?.phone_no || p?.mobile_no)
        .filter(Boolean)
        .join(", ") || phone;
  }

  // Relation / Father / Spouse
  const relationType = d.father_husband || d.relation || "Guardian / Relation";
  const relationName =
    d.relation_name || d.parent_or_spouse_name || d.father_husband_name || "-";

  // Address
  let fullAddress = d.address || "";
  if (Array.isArray(d.member_addresses) && d.member_addresses.length > 0) {
    const addr = d.member_addresses[0];
    fullAddress = [
      addr?.address_line1,
      addr?.village_name || addr?.village,
      addr?.panchayat_name || addr?.panchayat,
      addr?.block_name || addr?.block,
      addr?.district_name || addr?.district,
      addr?.state_name,
      addr?.pin_code ? `PIN: ${addr.pin_code}` : null,
    ]
      .filter(Boolean)
      .join(", ");
  }
  if (!fullAddress) {
    fullAddress =
      [
        d.village_name_english || d.village_name,
        d.panchayat_name_en || d.panchayat_name,
        d.block_name_en || d.block_name,
        d.district_name_en || d.district_name,
      ]
        .filter(Boolean)
        .join(", ") || "Location details not specified";
  }

  // Banks
  const bankAccounts = useMemo(() => {
    if (Array.isArray(d.member_banks) && d.member_banks.length > 0) {
      return d.member_banks.map((b) => ({
        bankName: b?.bank_name || "Bank",
        branchName: b?.branch_name || b?.bank_name || "Branch",
        ifsc: b?.ifsc_code || b?.ifsc || "N/A",
        accountNo: b?.account_no || b?.bank_account_no || "N/A",
        isDefault: b?.is_default || b?.primary_account,
      }));
    }
    if (d.bank_name || d.bank_account_number || d.ifsc) {
      return [
        {
          bankName: d.bank_name || "Linked Bank",
          branchName: d.branch_name || "-",
          ifsc: d.ifsc || "-",
          accountNo: d.bank_account_number || "-",
          isDefault: true,
        },
      ];
    }
    return [];
  }, [d]);

  // Demographics
  const gender = d.gender || "-";
  const dob = d.dob || d.date_of_birth || "-";
  const age = d.age ? `${d.age} Years` : dob !== "-" ? `DOB: ${dob}` : "-";
  const category = d.social_category || d.socialCategory || "-";
  const religion = d.religion || "-";
  const education = d.education || "-";
  const maritalStatus = d.marital_status || "-";

  // Livelihood & Statuses
  const priOccupation =
    d.primary_occupation || d.pri_occupation || "Not Specified";
  const secOccupation = d.secondary_occupation || d.sec_occupation || "-";
  const tertOccupation = d.tertiary_occupation || d.tert_occupation || "-";

  const pldStatus =
    d.pld_status === true || String(d.pld_status).toUpperCase() === "YES"
      ? "Yes"
      : d.pld_status === false || String(d.pld_status).toUpperCase() === "NO"
        ? "No"
        : String(d.pld_status || "-");

  const kycVerified =
    d.aadhar_verified === true ||
    String(d.aadhar_verified).toLowerCase() === "true" ||
    d.aadhar_verified === 1;

  const joinDate = d.joining_date || d.created_date || d.registered_on || "-";

  // Additional dynamic attributes from LokOS response for "Complete LokOS Record" tab
  const additionalAttributes = useMemo(() => {
    const skipKeys = new Set([
      "member_addresses",
      "member_banks",
      "member_phones",
      "member_designations",
      "aadhar_no",
      "aadhaar_no",
      "aadhar",
    ]);
    return Object.entries(d)
      .filter(([key, val]) => {
        if (skipKeys.has(key.toLowerCase())) return false;
        if (val === null || val === undefined || val === "") return false;
        if (typeof val === "object") return false;
        return true;
      })
      .map(([key, val]) => ({
        label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: typeof val === "boolean" ? (val ? "Yes" : "No") : String(val),
      }));
  }, [d]);

  // =========================================================================
  // MODAL CONTENT (PORTALED TO DOCUMENT.BODY)
  // =========================================================================
  const modalNode = modalOpen
    ? createPortal(
        <div className="lokos-modal-backdrop" onClick={handleClose}>
          <div
            className="lokos-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Floating Action Bar */}
            <div className="lokos-top-actions">
              <button
                type="button"
                className="lokos-action-btn"
                onClick={fetchLokosProfile}
                disabled={loading}
                title="Re-sync Live Data from LokOS"
              >
                <FaSyncAlt className={loading ? "lokos-spin" : ""} />
              </button>
              <button
                type="button"
                className="lokos-action-btn close-btn"
                onClick={handleClose}
                title="Close Profile (Esc)"
              >
                <FaTimes />
              </button>
            </div>

            {loading ? (
              <div className="lokos-loading-state">
                <div className="lokos-loader-ring">
                  <div className="lokos-loader-core">
                    <FaIdCard size={28} color="#2563eb" />
                  </div>
                </div>
                <h4 className="lokos-loading-title">
                  Syncing Live LokOS Profile
                </h4>
                <p className="lokos-loading-sub">
                  Fetching verified SHG & Member records for{" "}
                  <strong>{resolvedMemberCode}</strong>...
                </p>
              </div>
            ) : (
              <>
                {/* Animated Aurora Hero Banner */}
                <div className="lokos-hero-banner">
                  <div className="lokos-orb orb-1" />
                  <div className="lokos-orb orb-2" />
                  <div className="lokos-orb orb-3" />

                  <div className="lokos-hero-content">
                    <div className="lokos-avatar-ring">
                      <div className="lokos-avatar-inner">
                        <FaUserCircle className="lokos-avatar-svg" />
                      </div>
                      <span
                        className={`lokos-status-dot ${
                          kycVerified ? "verified" : "standard"
                        }`}
                        title={
                          kycVerified
                            ? "eKYC / Profile Verified"
                            : "Active Member"
                        }
                      />
                    </div>

                    <h2 className="lokos-member-name">{fullName}</h2>
                    <div className="lokos-member-role">{designations}</div>

                    {/* Interactive Code & Status Pills */}
                    <div className="lokos-badge-row">
                      <button
                        type="button"
                        className="lokos-glass-pill clickable"
                        onClick={() => handleCopy(displayMemberCode, "member")}
                        title="Click to copy Member Code"
                      >
                        <FaIdCard />
                        <span>Member: {displayMemberCode}</span>
                        {copiedField === "member" ? (
                          <FaCheck className="copy-success" />
                        ) : (
                          <FaCopy className="copy-hint" />
                        )}
                      </button>

                      <button
                        type="button"
                        className="lokos-glass-pill clickable"
                        onClick={() => handleCopy(displayShgCode, "shg")}
                        title="Click to copy SHG Code"
                      >
                        <FaUsers />
                        <span>SHG: {displayShgCode}</span>
                        {copiedField === "shg" ? (
                          <FaCheck className="copy-success" />
                        ) : (
                          <FaCopy className="copy-hint" />
                        )}
                      </button>

                      <span
                        className={`lokos-glass-pill ${
                          pldStatus === "Yes" ? "pill-emerald" : ""
                        }`}
                      >
                        PLD: {pldStatus}
                      </span>

                      {kycVerified && (
                        <span className="lokos-glass-pill pill-verified">
                          <FaCheckCircle /> Verified
                        </span>
                      )}
                    </div>

                    {displayShgName && (
                      <div className="lokos-shg-subtitle">
                        SHG Name: <strong>{displayShgName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Segmented Navigation Tabs */}
                  <div className="lokos-tabs-bar">
                    <button
                      type="button"
                      className={`lokos-tab-btn ${
                        activeTab === "overview" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      className={`lokos-tab-btn ${
                        activeTab === "bank" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("bank")}
                    >
                      Bank & Livelihood
                    </button>
                    <button
                      type="button"
                      className={`lokos-tab-btn ${
                        activeTab === "raw" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("raw")}
                    >
                      All LokOS Fields ({additionalAttributes.length})
                    </button>
                  </div>
                </div>

                {/* Scrollable Modal Body */}
                <div className="lokos-modal-body">
                  {error && (
                    <div className="lokos-warning-banner">
                      <FaExclamationTriangle className="warn-icon" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* TAB 1: OVERVIEW */}
                  {activeTab === "overview" && (
                    <div className="lokos-cards-grid">
                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.04s" }}
                      >
                        <div className="lokos-icon-box tint-blue">
                          <FaPhoneAlt />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">
                            Mobile / Contact
                          </div>
                          <div className="lokos-card-value">{phone}</div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.08s" }}
                      >
                        <div className="lokos-icon-box tint-purple">
                          <FaVenusMars />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">Gender & Age</div>
                          <div className="lokos-card-value">
                            {gender} • {age}
                          </div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.12s" }}
                      >
                        <div className="lokos-icon-box tint-rose">
                          <FaUsers />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">{relationType}</div>
                          <div className="lokos-card-value">{relationName}</div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.16s" }}
                      >
                        <div className="lokos-icon-box tint-emerald">
                          <FaGraduationCap />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">
                            Education & Social Category
                          </div>
                          <div className="lokos-card-value">
                            {education} • {category}{" "}
                            {religion !== "-" ? `(${religion})` : ""}
                          </div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card full-span"
                        style={{ "--delay": "0.20s" }}
                      >
                        <div className="lokos-icon-box tint-amber">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">
                            Registered Address / Geoscope
                          </div>
                          <div className="lokos-card-value">{fullAddress}</div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.24s" }}
                      >
                        <div className="lokos-icon-box tint-teal">
                          <FaCalendarAlt />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">
                            Date of Joining
                          </div>
                          <div className="lokos-card-value">{joinDate}</div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.28s" }}
                      >
                        <div className="lokos-icon-box tint-indigo">
                          <FaShieldAlt />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">Marital Status</div>
                          <div className="lokos-card-value">
                            {maritalStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BANK & LIVELIHOOD */}
                  {activeTab === "bank" && (
                    <div className="lokos-cards-grid">
                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.04s" }}
                      >
                        <div className="lokos-icon-box tint-emerald">
                          <FaLeaf />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">
                            Primary Livelihood
                          </div>
                          <div className="lokos-card-value">
                            {priOccupation}
                          </div>
                        </div>
                      </div>

                      <div
                        className="lokos-info-card"
                        style={{ "--delay": "0.08s" }}
                      >
                        <div className="lokos-icon-box tint-amber">
                          <FaBriefcase />
                        </div>
                        <div className="lokos-card-body">
                          <div className="lokos-card-label">
                            Secondary / Tertiary Activity
                          </div>
                          <div className="lokos-card-value">
                            {secOccupation}
                            {tertOccupation !== "-"
                              ? ` • ${tertOccupation}`
                              : ""}
                          </div>
                        </div>
                      </div>

                      <div
                        className="lokos-section-heading full-span"
                        style={{ "--delay": "0.12s" }}
                      >
                        <FaUniversity /> Linked Bank Accounts (
                        {bankAccounts.length})
                      </div>

                      {bankAccounts.length > 0 ? (
                        bankAccounts.map((b, i) => (
                          <div
                            key={i}
                            className="lokos-info-card full-span bank-card"
                            style={{ "--delay": `${0.16 + i * 0.05}s` }}
                          >
                            <div className="lokos-icon-box tint-teal">
                              <FaUniversity />
                            </div>
                            <div className="lokos-card-body">
                              <div className="lokos-card-label">
                                {b.bankName}{" "}
                                {b.isDefault && (
                                  <span className="bank-primary-tag">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <div className="lokos-card-value">
                                Branch: {b.branchName}
                              </div>
                              <div className="lokos-bank-meta">
                                <span>IFSC: {b.ifsc}</span>
                                <span>A/C: {b.accountNo}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="lokos-empty-box full-span">
                          No bank account details linked in LokOS response.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: COMPLETE LOKOS RECORD */}
                  {activeTab === "raw" && (
                    <div className="lokos-raw-grid">
                      {additionalAttributes.length > 0 ? (
                        additionalAttributes.map((attr, idx) => (
                          <div
                            key={attr.label}
                            className="lokos-raw-item"
                            style={{
                              "--delay": `${Math.min(idx * 0.02, 0.3)}s`,
                            }}
                          >
                            <span className="raw-key">{attr.label}</span>
                            <span className="raw-val">{attr.value}</span>
                          </div>
                        ))
                      ) : (
                        <div className="lokos-empty-box">
                          No additional attributes available.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {/* Render trigger button automatically if uncontrolled or showTrigger=true */}
      {(!isControlled || showTrigger) && (
        <div
          className={`lokos-trigger-wrapper ${triggerClassName}`}
          style={triggerStyle}
        >
          {children ? (
            <span
              onClick={() => setInternalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {children}
            </span>
          ) : resolvedMemberCode ? (
            <div className="lokos-info-cell">
              <button
                type="button"
                className="lokos-trigger-btn"
                onClick={() => setInternalOpen(true)}
                title="Click to view live LokOS profile"
              >
                <FaIdCard style={{ marginRight: 5, opacity: 0.8 }} />
                <strong>{resolvedMemberCode}</strong>
              </button>
              {resolvedShgCode && (
                <div className="lokos-trigger-sub">
                  SHG Code: {resolvedShgCode}
                </div>
              )}
            </div>
          ) : (
            <span style={{ color: "#94a3b8" }}>—</span>
          )}
        </div>
      )}

      {modalNode}

      <style>{`
        /* Trigger Button Styles */
        .lokos-info-cell { display: inline-flex; flex-direction: column; gap: 2px; }
        .lokos-trigger-btn {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe;
          padding: 4px 10px;
          border-radius: 8px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 13px;
          font-weight: 700;
          color: #1d4ed8;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lokos-trigger-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          border-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
        .lokos-trigger-sub { font-size: 11px; color: #64748b; font-weight: 500; padding-left: 2px; }

        /* Modal Backdrop & Container */
        .lokos-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(8px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: lokosFadeIn 0.25s ease-out forwards;
        }

        .lokos-modal-container {
          background: #f8fafc;
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          border-radius: 24px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          animation: lokosModalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Floating Top Right Buttons */
        .lokos-top-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          z-index: 20;
        }

        .lokos-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.25s ease;
        }
        .lokos-action-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        .lokos-action-btn.close-btn:hover {
          background: #ef4444;
          border-color: #ef4444;
          transform: rotate(90deg);
        }

        /* Animated Aurora Hero Banner */
        .lokos-hero-banner {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
          padding: 34px 24px 0;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .lokos-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(35px);
          opacity: 0.45;
          pointer-events: none;
        }
        .orb-1 {
          width: 180px; height: 180px;
          background: #38bdf8;
          top: -50px; left: -40px;
          animation: lokosFloatOrb 7s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 220px; height: 220px;
          background: #6366f1;
          bottom: -70px; right: -40px;
          animation: lokosFloatOrb 9s ease-in-out infinite alternate-reverse;
        }
        .orb-3 {
          width: 120px; height: 120px;
          background: #10b981;
          top: 20%; right: 20%;
          opacity: 0.25;
          animation: lokosFloatOrb 6s ease-in-out infinite alternate;
        }

        .lokos-hero-content {
          position: relative;
          z-index: 5;
        }

        .lokos-avatar-ring {
          width: 92px;
          height: 92px;
          margin: 0 auto 12px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, #38bdf8, #818cf8, #34d399);
          background-size: 200% 200%;
          animation: lokosGradientSpin 4s ease infinite;
          position: relative;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .lokos-avatar-inner {
          width: 100%;
          height: 100%;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lokos-avatar-svg {
          width: 92%;
          height: 92%;
          color: #94a3b8;
        }

        .lokos-status-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid #1e3a8a;
        }
        .lokos-status-dot.verified { background: #22c55e; }
        .lokos-status-dot.standard { background: #38bdf8; }

        .lokos-member-name {
          margin: 0 0 4px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.4px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        .lokos-member-role {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #bae6fd;
          margin-bottom: 14px;
        }

        .lokos-badge-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .lokos-glass-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(6px);
          transition: all 0.2s ease;
        }
        .lokos-glass-pill.clickable { cursor: pointer; }
        .lokos-glass-pill.clickable:hover {
          background: rgba(255, 255, 255, 0.26);
          transform: translateY(-1px);
        }
        .lokos-glass-pill .copy-hint { opacity: 0.65; font-size: 11px; }
        .lokos-glass-pill .copy-success { color: #4ade80; }
        .lokos-glass-pill.pill-emerald {
          background: rgba(16, 185, 129, 0.25);
          border-color: rgba(52, 211, 153, 0.5);
        }
        .lokos-glass-pill.pill-verified {
          background: rgba(34, 197, 94, 0.28);
          border-color: rgba(74, 222, 128, 0.55);
          color: #dcfce7;
        }

        .lokos-shg-subtitle {
          font-size: 12.5px;
          color: #e0f2fe;
          margin-bottom: 14px;
          opacity: 0.95;
        }

        /* Tabs Bar */
        .lokos-tabs-bar {
          display: flex;
          justify-content: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.35);
          padding: 6px 16px 0;
          margin: 14px -24px 0;
          position: relative;
          z-index: 5;
        }

        .lokos-tab-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }
        .lokos-tab-btn:hover { color: #ffffff; }
        .lokos-tab-btn.active {
          color: #ffffff;
          border-bottom-color: #38bdf8;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 8px 8px 0 0;
        }

        /* Body & Cards Grid */
        .lokos-modal-body {
          padding: 22px;
          overflow-y: auto;
          flex: 1;
        }

        .lokos-warning-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #b45309;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          animation: lokosCardSlide 0.3s ease-out forwards;
        }

        .lokos-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (max-width: 540px) {
          .lokos-cards-grid { grid-template-columns: 1fr; }
        }

        .lokos-info-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          animation: lokosCardSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
        }
        .lokos-info-card.full-span { grid-column: 1 / -1; }
        .lokos-info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px -6px rgba(30, 58, 138, 0.12);
          border-color: #cbd5e1;
        }

        .lokos-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .lokos-info-card:hover .lokos-icon-box { transform: scale(1.08) rotate(-4deg); }

        .tint-blue { background: #dbeafe; color: #2563eb; }
        .tint-purple { background: #f3e8ff; color: #9333ea; }
        .tint-rose { background: #ffe4e6; color: #e11d48; }
        .tint-emerald { background: #dcfce7; color: #16a34a; }
        .tint-amber { background: #fef3c7; color: #d97706; }
        .tint-teal { background: #ccfbf1; color: #0d9488; }
        .tint-indigo { background: #e0e7ff; color: #4f46e5; }

        .lokos-card-body { flex: 1; min-width: 0; }
        .lokos-card-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lokos-card-value {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          word-break: break-word;
        }

        .lokos-section-heading {
          font-size: 13px;
          font-weight: 800;
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bank-primary-tag {
          background: #dcfce7;
          color: #15803d;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }
        .lokos-bank-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 6px;
          font-size: 12.5px;
          font-family: monospace;
          color: #475569;
          font-weight: 600;
        }

        /* Complete LokOS Fields Grid */
        .lokos-raw-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (max-width: 540px) {
          .lokos-raw-grid { grid-template-columns: 1fr; }
        }
        .lokos-raw-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          opacity: 0;
          animation: lokosCardSlide 0.35s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
        .raw-key {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .raw-val {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          word-break: break-word;
        }

        .lokos-empty-box {
          padding: 28px;
          text-align: center;
          color: #64748b;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          font-weight: 600;
        }

        /* Loading State */
        .lokos-loading-state {
          padding: 70px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .lokos-loader-ring {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          border: 3px solid #dbeafe;
          border-top-color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lokosSpin 1s linear infinite;
          margin-bottom: 18px;
        }
        .lokos-loader-core {
          animation: lokosSpinReverse 1s linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lokos-loading-title {
          margin: 0 0 6px;
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 800;
        }
        .lokos-loading-sub {
          margin: 0;
          color: #64748b;
          font-size: 13.5px;
        }

        .lokos-spin { animation: lokosSpin 0.9s linear infinite; }

        /* Keyframes */
        @keyframes lokosFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lokosModalPop {
          0% { opacity: 0; transform: translateY(30px) scale(0.94); }
          70% { transform: translateY(-4px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lokosCardSlide {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lokosFloatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(22px, 16px) scale(1.15); }
        }
        @keyframes lokosGradientSpin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes lokosSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes lokosSpinReverse {
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </>
  );
}
