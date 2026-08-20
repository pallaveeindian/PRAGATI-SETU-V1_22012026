// src/pages/TMS/TP_CP/attendance/AttendanceModule/components/Step2_AttendanceManager/AttendanceTables/BeneficiaryAttendanceTable.jsx
import React, { useMemo, useState } from "react";
import { EPSAKHI_API } from "../../../../../../../../api/axios";
import {
  FaUserCircle,
  FaTimes,
  FaSpinner,
  FaIdCard,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaVenusMars,
  FaBirthdayCake,
  FaGraduationCap,
  FaUsers,
  FaUniversity,
  FaCalendarAlt,
  FaLeaf,
} from "react-icons/fa";

export default function BeneficiaryAttendanceTable({
  rows,
  participantPresence,
  onTogglePresence,
}) {
  // Modal & API State
  const [modalState, setModalState] = useState({
    isOpen: false,
    loading: false,
    data: null,
    error: null,
  });

  // Calculate exactly how many participants are marked as present
  const presentCount = useMemo(() => {
    return rows.filter((row) => !!participantPresence[row.key]).length;
  }, [rows, participantPresence]);

  // Handle LokOS click to fetch complete details
  const handleLokosClick = async (shgCode, memberCode, fallbackData) => {
    if (!shgCode || !memberCode) return;

    setModalState({ isOpen: true, loading: true, data: null, error: null });

    try {
      const res = await EPSAKHI_API.upsrlmShgMembers(shgCode, {
        search: memberCode,
      });

      // Extract data safely from standard Django/DRF or custom paginated responses
      const fetchedData =
        res?.data?.data?.[0] || res?.data?.results?.[0] || res?.data || null;

      if (fetchedData) {
        setModalState({
          isOpen: true,
          loading: false,
          data: fetchedData,
          error: null,
        });
      } else {
        setModalState({
          isOpen: true,
          loading: false,
          data: fallbackData,
          error:
            "Detailed profile not found in EPSAKHI. Showing basic cached data.",
        });
      }
    } catch (err) {
      console.error("Failed to fetch LokOS details:", err);
      setModalState({
        isOpen: true,
        loading: false,
        data: fallbackData,
        error: "Failed to connect to LokOS server. Showing basic cached data.",
      });
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // --- Safe Data Extractors for the Profile UI ---
  const d = modalState.data || {};

  // Header Info
  const fullName = d.member_name || d.full_name || d.name || "Unknown Member";
  const memberCode =
    d.member_code || d.lokos_member_code || d.nic_member_code || "N/A";

  // Designations
  let designations = "Member";
  if (
    Array.isArray(d.member_designations) &&
    d.member_designations.length > 0
  ) {
    designations = d.member_designations
      .map((des) => des?.designation)
      .filter(Boolean)
      .join(", ");
  } else if (d.designation) {
    designations = d.designation;
  }

  // Phone
  let phone = d.mobile || d.phone_no || "-";
  if (Array.isArray(d.member_phones) && d.member_phones.length > 0) {
    phone =
      d.member_phones
        .map((p) => p?.phone_no)
        .filter(Boolean)
        .join(", ") || phone;
  }

  // Address Extraction
  let fullAddress = d.address || "Location data unavailable";
  if (Array.isArray(d.member_addresses) && d.member_addresses.length > 0) {
    const addr = d.member_addresses[0];
    fullAddress = [
      addr?.village_name,
      addr?.panchayat_name,
      addr?.block_name,
      addr?.district_name,
      addr?.state_name,
    ]
      .filter(Boolean)
      .join(", ");
  } else if (d.village_name_english || d.district_name_en) {
    fullAddress = [
      d.village_name_english,
      d.panchayat_name_en,
      d.block_name_en,
      d.district_name_en,
    ]
      .filter(Boolean)
      .join(", ");
  }

  // Bank Extraction
  let bankDetails = "No bank details linked";
  if (Array.isArray(d.member_banks) && d.member_banks.length > 0) {
    const bank = d.member_banks[0];
    bankDetails = `${bank?.bank_name || "Bank"} - ${bank?.branch_name || "Branch"}`;
  }

  // Demographics
  const gender = d.gender || "-";
  const relation = d.father_husband || "-";
  const relation_name = d.relation_name || "-";
  const dob = d.dob || "-";
  const age = d.age ? `${d.age} Years` : dob !== "-" ? `DOB: ${dob}` : "-";
  const category = d.social_category || d.socialCategory || "-";
  const religion = d.religion || "-";
  const education = d.education || "-";

  // Livelihood
  const occupation =
    d.primary_occupation || d.secondary_occupation || "Not Specified";
  const pldStatus =
    d.pld_status === true || d.pld_status === "YES"
      ? "Yes"
      : d.pld_status === false || d.pld_status === "NO"
        ? "No"
        : "-";
  const joinDate = d.joining_date || d.created_date || "-";

  // --- End Extractors ---

  if (!rows || rows.length === 0) return null;

  return (
    <div style={{ marginBottom: 24, position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: 8,
        }}
      >
        <h5 style={{ color: "#1e3a8a", margin: 0, fontWeight: 800 }}>
          Beneficiaries / Trainees ({rows.length})
        </h5>

        <div className="attendance-tracker-pill pulse-soft">
          {presentCount} / {rows.length} Present
        </div>
      </div>

      <div className="table-responsive elegant-scrollbar">
        <table className="table align-middle table-sm mb-0 ben-table">
          <thead>
            <tr>
              <th style={{ width: 70, textAlign: "center" }}>Present</th>
              <th style={{ width: 60, textAlign: "center" }}>S.No.</th>
              <th>Name</th>
              <th>LokOS Info (Click to View)</th>
              <th style={{ textAlign: "center" }}>Age</th>
              <th style={{ textAlign: "center" }}>Gender</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const b =
                row.original?.beneficiary || row.original?.trainer || {};
              const isPresent = !!participantPresence[row.key];

              return (
                <tr
                  key={row.key}
                  className={`ben-row ${isPresent ? "is-present" : ""}`}
                >
                  <td style={{ textAlign: "center" }}>
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isPresent}
                        onChange={(e) =>
                          onTogglePresence(row.key, e.target.checked)
                        }
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    className="fw-bold"
                    style={{ color: isPresent ? "#15803d" : "#0f172a" }}
                  >
                    {b.member_name || b.full_name || row.name || "-"}
                  </td>
                  <td>
                    {b.lokos_member_code ? (
                      <div className="lokos-info-cell">
                        <button
                          type="button" /* SURGICAL FIX: Prevent Form Submit */
                          className="lokos-link"
                          onClick={() =>
                            handleLokosClick(
                              b.lokos_shg_code,
                              b.lokos_member_code,
                              b,
                            )
                          }
                          title="Click to view full LokOS profile"
                        >
                          <FaIdCard
                            style={{ marginRight: "4px", opacity: 0.7 }}
                          />
                          <strong>{b.lokos_member_code}</strong>
                        </button>
                        <div className="lokos-subtext">
                          SHG Code: {b.lokos_shg_code || "-"}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 500 }}>
                    {b.age ? `${b.age} Yrs` : "-"}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 500 }}>
                    {b.gender ? String(b.gender).charAt(0).toUpperCase() : "-"}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#334155" }}>
                      {b.district_name_en || "-"}
                    </div>
                    {b.block_name_en && (
                      <div
                        style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}
                      >
                        {b.block_name_en}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* BEAUTIFUL BENEFICIARY PROFILE MODAL          */}
      {/* ========================================== */}
      {modalState.isOpen && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div
            className="profile-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Buttons */}
            <button
              className="profile-modal-close"
              onClick={closeModal}
              title="Close Profile"
            >
              <FaTimes />
            </button>

            {modalState.loading ? (
              <div className="profile-modal-loading">
                <FaSpinner className="spin-icon" size={36} color="#3b82f6" />
                <p>Syncing live profile from LokOS...</p>
              </div>
            ) : (
              <>
                {/* Image-Inspired Header Banner */}
                <div className="profile-header-banner">
                  <div className="profile-avatar-container">
                    <FaUserCircle className="profile-avatar-icon" />
                  </div>
                  <h2 className="profile-name">{fullName}</h2>
                  <h4 className="profile-designation">{designations}</h4>
                  <div className="profile-code-pill">
                    Member Code: {memberCode}
                    <br></br>
                    <span className="mini-pill">PLD: {pldStatus}</span>
                  </div>
                </div>

                <div className="profile-body-scroll">
                  {modalState.error && (
                    <div className="profile-error-alert">
                      ⚠ {modalState.error}
                    </div>
                  )}

                  <div className="profile-cards-grid">
                    {/* Phone Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper red-tint">
                        <FaPhoneAlt />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">Phone Number</div>
                        <div className="card-value">{phone}</div>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper red-tint">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">{relation}</div>
                        <div className="card-value">{relation_name}</div>
                      </div>
                    </div>

                    {/* Gender & Age Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper purple-tint">
                        <FaVenusMars />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">Gender & Age</div>
                        <div className="card-value">
                          {gender} • {age}
                        </div>
                      </div>
                    </div>

                    {/* Education & Religion Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper green-tint">
                        <FaGraduationCap />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">Education & Category</div>
                        <div className="card-value">
                          {education} • {category} ({religion})
                        </div>
                      </div>
                    </div>

                    {/* Livelihood / PLD Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper orange-tint">
                        <FaLeaf />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">Primary Livelihood</div>
                        <div className="card-value">{occupation}</div>
                      </div>
                    </div>

                    {/* Bank Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper teal-tint">
                        <FaUniversity />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">Bank Information</div>
                        <div className="card-value">{bankDetails}</div>
                      </div>
                    </div>

                    {/* Join Date Card */}
                    <div className="profile-info-card">
                      <div className="card-icon-wrapper slate-tint">
                        <FaCalendarAlt />
                      </div>
                      <div className="card-text-content">
                        <div className="card-label">Date of Joining</div>
                        <div className="card-value">{joinDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- STYLES --- */}
      <style>{`
        /* Table Styles */
        .elegant-scrollbar {
          max-height: 450px;
          overflow: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .elegant-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .elegant-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .elegant-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .elegant-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .ben-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; margin: 0; }
        .ben-table thead th {
          position: sticky; top: 0; background: #f8fafc; color: #334155; font-weight: 700;
          text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; padding: 12px;
          border-bottom: 2px solid #e2e8f0; z-index: 2;
        }
        .ben-row { transition: all 0.2s ease; }
        .ben-row td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .ben-row:hover { background: #f8fafc; }
        .ben-row.is-present { background: #f0fdf4; }
        .ben-row.is-present td { border-bottom-color: #dcfce7; }

        /* Custom Checkbox */
        .checkbox-wrapper { display: flex; align-items: center; justify-content: center; }
        .custom-checkbox {
          appearance: none; width: 22px; height: 22px; border: 2px solid #cbd5e1;
          border-radius: 6px; outline: none; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: #fff; position: relative;
        }
        .custom-checkbox:hover { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); transform: scale(1.05); }
        .custom-checkbox:checked { background: #16a34a; border-color: #16a34a; animation: popIn 0.3s ease forwards; }
        .custom-checkbox:checked::after {
          content: '✓'; position: absolute; color: white; font-size: 14px; font-weight: 900;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        /* LokOS Link Styling */
        .lokos-info-cell { display: flex; flex-direction: column; gap: 2px; }
        .lokos-link {
          background: none; border: none; padding: 4px 8px; margin: -4px -8px; border-radius: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 14px; font-weight: 700; color: #2563eb; cursor: pointer;
          display: inline-flex; align-items: center; transition: all 0.2s ease; text-align: left;
        }
        .lokos-link:hover { background: #eff6ff; color: #1d4ed8; }
        .lokos-subtext { font-size: 11px; color: #64748b; font-weight: 500; }

        /* Pill */
        .attendance-tracker-pill {
          background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 6px 16px;
          border-radius: 999px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
          box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3);
        }

        /* Animations */
        @keyframes popIn { 0% { transform: scale(0.8); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes fadeInOverlay { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(4px); } }
        @keyframes slideUpBouncy { 0% { opacity: 0; transform: translateY(40px) scale(0.95); } 70% { transform: translateY(-10px) scale(1.02); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .pulse-soft { animation: pulseSoft 2s infinite; }
        @keyframes pulseSoft { 0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); } 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); } }

        /* ------------------------------------------- */
        /* BEAUTIFUL PROFILE MODAL STYLES (TMS THEME)  */
        /* ------------------------------------------- */
        .profile-modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); z-index: 99999;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadeInOverlay 0.3s ease-out forwards; backdrop-filter: blur(4px);
        }
        
        .profile-modal-content {
          background: #f8fafc; width: 100%; max-width: 550px; max-height: 90vh;
          border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          display: flex; flex-direction: column; overflow: hidden; position: relative;
          animation: slideUpBouncy 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .profile-modal-close {
          position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.2); 
          border: none; width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          color: white; transition: all 0.2s; z-index: 10; font-size: 18px;
        }
        .profile-modal-close:hover { background: rgba(255,255,255,0.4); transform: rotate(90deg); }

        /* Banner Header */
        .profile-header-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 40px 20px 30px; text-align: center; color: white;
          position: relative;
        }
        
        .profile-avatar-container {
          width: 100px; height: 100px; background: #fff; border-radius: 50%;
          margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2); padding: 4px;
        }
        
        .profile-avatar-icon { width: 100%; height: 100%; color: #cbd5e1; border-radius: 50%; }
        
        .profile-name { margin: 0 0 4px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .profile-designation { margin: 0 0 16px 0; font-size: 15px; font-weight: 500; opacity: 0.9; }
        
        .profile-code-pill {
          display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px;
          border-radius: 999px; font-family: monospace; font-size: 14px; font-weight: 700;
          letter-spacing: 1px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.3);
        }

        /* Body & Cards */
        .profile-body-scroll {
          padding: 24px; overflow-y: auto; flex: 1;
        }

        .profile-error-alert {
          background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c;
          padding: 12px 16px; border-radius: 10px; font-weight: 600; margin-bottom: 20px; font-size: 14px;
        }

        .profile-cards-grid {
          display: grid; grid-template-columns: 1fr; gap: 14px;
        }

        .profile-info-card {
          background: #ffffff; border-radius: 14px; padding: 16px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .profile-info-card:hover {
          transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); border-color: #cbd5e1;
        }

        .card-icon-wrapper {
          width: 48px; height: 48px; border-radius: 12px; display: flex;
          align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
        }
        /* Icon Tints */
        .red-tint { background: #fee2e2; color: #ef4444; }
        .blue-tint { background: #dbeafe; color: #3b82f6; }
        .purple-tint { background: #f3e8ff; color: #a855f7; }
        .green-tint { background: #dcfce7; color: #22c55e; }
        .orange-tint { background: #ffedd5; color: #f97316; }
        .teal-tint { background: #ccfbf1; color: #14b8a6; }
        .slate-tint { background: #f1f5f9; color: #64748b; }

        .card-text-content { flex: 1; min-width: 0; }
        .card-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .card-value { font-size: 15px; font-weight: 700; color: #1e293b; line-height: 1.4; word-break: break-word; }

        .mini-pill {
          display: inline-block; background: #f1f5f9; color: #475569; padding: 2px 8px;
          border-radius: 6px; font-size: 11px; margin-left: 8px; border: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .profile-modal-loading {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 80px 0; color: #3b82f6; font-weight: 600; font-size: 16px;
        }
        .spin-icon { animation: spin 1s linear infinite; margin-bottom: 16px; }

      `}</style>
    </div>
  );
}
