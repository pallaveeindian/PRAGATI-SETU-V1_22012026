// src/pages/EPSMS/RecordForm/CRPForm.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import GeoFilters from "./FormComponents/GeoFilters";
import SHGList from "./FormComponents/SHGList";
import api, { LOOKUP_API, EPSAKHI_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  FaUser,
  FaPhoneAlt,
  FaIdCard,
  FaUsers,
  FaLayerGroup,
  FaCheckCircle,
  FaLock,
  FaSpinner,
  FaBuilding,
  FaTags,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaList,
} from "react-icons/fa";
import PanchayatsList from "./FormComponents/PanchayatsList";

// Password for CRP Account Validation
function validatePassword(pass) {
  return {
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    lower: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[!@#$%^&*]/.test(pass),
  };
}

function generateThUrid() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  for (let i = 0; i < 11; i++) {
    body += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TH_${body}`;
}

export default function CRPForm() {
  const { user } = useContext(AuthContext) || {};
  const [geoFilters, setGeoFilters] = useState({
    district_id: null,
    block_id: null,
  });

  const [selectedMember, setSelectedMember] = useState(null);
  const [password, setPassword] = useState("");
  const [clf_code, setCLFCode] = useState("");
  const [subcat, setSubCat] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [creating, setCreating] = useState(false);

  const [successData, setSuccessData] = useState(null);
  const [errorData, setErrorData] = useState(null);

  const panchayatSection = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [clfLoading, setClfLoading] = useState(false);
  const [clfDisplay, setClfDisplay] = useState("");
  const [clfError, setClfError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Live CLF Options data table states when auto-fetch yields 404
  const [fallbackClfOptions, setFallbackClfOptions] = useState([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // FETCH FALLBACK CLF LIST
  async function fetchFallbackClfs(blockId) {
    if (!blockId) return;
    try {
      setFallbackLoading(true);
      const res = await LOOKUP_API.upsrlmClfList(blockId);

      // Handle standard DRF arrays or paginated results safely
      const clfs = Array.isArray(res.data)
        ? res.data
        : res.data?.results || res.data?.data || [];

      // Map live data into the structural format required by the fallback table
      const mappedCLFs = clfs.map((clf, index) => ({
        srNo: index + 1,
        name: clf.name || clf.clf_name || "Unknown CLF",
        code: clf.clf_code || clf.code || "",
      }));

      setFallbackClfOptions(mappedCLFs);
    } catch (err) {
      console.error("Failed to fetch fallback CLFs", err);
      setFallbackClfOptions([]);
    } finally {
      setFallbackLoading(false);
    }
  }

  // AUTO FETCH CRP
  async function autoFetchCLF(member) {
    if (!member || !geoFilters.block_id) return;

    try {
      setClfLoading(true);
      setClfError("");
      setClfDisplay("");
      setCLFCode("");
      setFallbackClfOptions([]); // Reset fallback options on new search

      const res = await LOOKUP_API.upsrlmFindClf({
        block_id: geoFilters.block_id,
        member_code: member.member_code,
      });

      const data = res.data;

      setCLFCode(data.clf_code);
      setClfDisplay(`${data.name} | ${data.clfCategory}`);
    } catch (err) {
      if (err.response?.status === 404) {
        setClfError("No CLF found for this member");
        // SURGICAL INJECTION: Trigger fallback list fetch on 404
        fetchFallbackClfs(geoFilters.block_id);
      } else {
        setClfError("Failed to fetch CLF");
      }
    } finally {
      setClfLoading(false);
    }
  }

  // -------------------------------------------------
  // CREATE CRP FLOW
  // -------------------------------------------------
  async function handleCreateCRP() {
    if (creating) return;
    const rules = validatePassword(password);
    setPasswordRules(rules);

    if (!Object.values(rules).every(Boolean)) {
      return;
    }

    if (!selectedMember) {
      alert("Select a member first");
      return;
    }

    if (!clf_code) {
      alert("CLF Code is mandatory");
      return;
    }

    try {
      setCreating(true);

      // -----------------------------------
      // CHECK DUPLICATE CRP
      // -----------------------------------

      const existing = await EPSAKHI_API.crp.list({
        lokos_member_code: selectedMember.member_code,
      });

      if (existing.data?.count > 0) {
        throw new Error("CRP already exists for this member");
      }

      const mobile = selectedMember.mobile_number || mobileInput;

      if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        alert("Enter a valid 10 digit mobile number");
        setCreating(false);
        return;
      }

      // -----------------------------------
      // CREATE master_user
      // -----------------------------------
      const userPayload = {
        username: `crp_${selectedMember.member_code}`,
        password: password,
        role: 6,
        TH_urid: generateThUrid(),
        is_active: 1,
        is_suspended: 0,
        is_locked: 0,
        created_by: user?.id,
      };
      const userRes = await api.post("/lookups/users/create/", {
        username: `crp_${selectedMember.member_code}`,
        password: password,
        role: 6,
        TH_urid: generateThUrid(),
        is_active: 1,
        is_suspended: 0,
        is_locked: 0,
        created_by: user?.id,
      });

      const masterUserId = userRes.data?.id;

      if (!masterUserId) throw new Error("Master user creation failed");

      // -----------------------------------
      // CREATE CRP PROFILE
      // -----------------------------------

      const crpPayload = {
        name: selectedMember.member_name,
        mobile_number: selectedMember.mobile_number || mobileInput,
        category: selectedMember.social_category,

        district_write: selectedMember.district_id,
        block_write: selectedMember.block_id,
        panchayat_write: selectedMember.panchayat_id,

        lokos_shg_code: selectedMember.shg_code,
        lokos_member_code: selectedMember.member_code,

        nodal_clf: clf_code,
        subcategory: subcat,

        master_user_id: masterUserId,

        created_by: user?.id,
      };

      const crpRes = await EPSAKHI_API.crp.create(crpPayload);

      const data = {
        username: userPayload.username,
        password: userPayload.password,
        crp: crpRes.data,
      };

      setSuccessData(data);
      setShowSuccessModal(true);

      setPassword("");
      setSelectedMember(null);
      setMobileInput("");
      setCLFCode("");
      setSubCat("");
      setPasswordRules({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
      });
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
        err.message;

      setErrorData(apiError);
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (successData && panchayatSection.current) {
      panchayatSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [successData]);

  return (
    <div className="crpform-epsms-dashboard">
      {/* Row 1 */}
      <div className="epsms-grid-row one-col">
        <div className="epsms-card">
          <GeoFilters onChange={setGeoFilters} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="epsms-grid-row three-col">
        <div className="epsms-card">
          <SHGList
            blockId={geoFilters.block_id}
            panchayatId={geoFilters.panchayat_id}
            villageId={geoFilters.village_id}
            onSelectMember={(memberData) => {
              setSelectedMember(memberData);
              autoFetchCLF(memberData);
            }}
          />
        </div>
      </div>

      {/* Conditional Row: Alternate CLF Table when Auto Fetch fails with 404 */}
      {selectedMember && clfError === "No CLF found for this member" && (
        <div className="epsms-grid-row one-col fallback-clf-container">
          <div className="epsms-card fallback-clf-card">
            <h3 className="crp-title generic-amber-title">
              <FaList /> Select Nodal CLF Manually
            </h3>
            <div className="fallback-table-wrapper">
              {fallbackLoading ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  <FaSpinner className="spin" style={{ marginRight: "8px" }} />{" "}
                  Fetching CLF list...
                </div>
              ) : fallbackClfOptions.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No CLFs found in this block.
                </div>
              ) : (
                <table className="fallback-clf-table">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>CLF Name</th>
                      <th>CLF Code</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fallbackClfOptions.map((clf) => (
                      <tr
                        key={clf.code}
                        className={clf_code === clf.code ? "selected-row" : ""}
                      >
                        <td>{clf.srNo}</td>
                        <td>{clf.name}</td>
                        <td>
                          <span className="clf-code-badge">{clf.code}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="clf-select-btn"
                            onClick={() => {
                              setCLFCode(clf.code);
                              setClfDisplay(`${clf.name} (Selected Manually)`);
                              setClfError("");
                            }}
                          >
                            {clf_code === clf.code ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Row 3 */}
      <div className="epsms-grid-row one-col">
        <div className="epsms-card selected-crp-card">
          <h3 className="crp-title">
            <FaCheckCircle /> Selected CRP
          </h3>

          {!selectedMember && (
            <div className="crp-placeholder">
              Select a member from the SHG list to create CRP
            </div>
          )}

          {selectedMember && (
            <div className="crp-details-grid">
              <div className="crp-detail">
                <FaUser className="crp-icon" />
                <div>
                  <span className="crp-label">Name</span>
                  <span className="crp-value">
                    {selectedMember.member_name}
                  </span>
                </div>
              </div>

              <div className="crp-detail">
                <FaPhoneAlt className="crp-icon" />
                <div>
                  <span className="crp-label">Mobile Number</span>
                  <span className="crp-value">
                    {selectedMember?.mobile_number ||
                      mobileInput ||
                      "Not Available"}
                  </span>
                </div>
              </div>

              <div className="crp-detail">
                <FaLayerGroup className="crp-icon" />
                <div>
                  <span className="crp-label">Social Category</span>
                  <span className="crp-value">
                    {selectedMember.social_category}
                  </span>
                </div>
              </div>

              <div className="crp-detail">
                <FaIdCard className="crp-icon" />
                <div>
                  <span className="crp-label">Member Code</span>
                  <span className="crp-value">
                    {selectedMember.member_code}
                  </span>
                </div>
              </div>

              <div className="crp-detail">
                <FaUsers className="crp-icon" />
                <div>
                  <span className="crp-label">SHG Code</span>
                  <span className="crp-value">{selectedMember.shg_code}</span>
                </div>
              </div>
            </div>
          )}

          <div className="crp-extra-inputs">
            {/* Mobile Input only if missing */}
            {selectedMember && !selectedMember.mobile_number && (
              <div className="crp-input-group">
                <label>
                  <FaPhoneAlt /> Mobile Number
                </label>

                <input
                  type="tel"
                  maxLength="10"
                  pattern="[6-9]{1}[0-9]{9}"
                  placeholder="Enter mobile number of CRP"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                />
              </div>
            )}

            {/* Nodal CLF Code */}
            <div className="crp-input-group">
              <label>
                <FaBuilding /> Nodal CLF Code{" "}
                <span className="required">*</span>
              </label>

              <div className="clf-input-wrapper">
                <input
                  type="text"
                  placeholder="Auto fetching CLF..."
                  value={clf_code}
                  readOnly
                />

                {clfLoading && <FaSpinner className="spin clf-spinner" />}
              </div>

              {/* CLF DISPLAY */}
              {clfDisplay && (
                <div className="clf-display">
                  <FaCheckCircle /> {clfDisplay}
                </div>
              )}

              {/* ERROR */}
              {clfError && <div className="clf-error">⚠ {clfError}</div>}
            </div>

            {/* Subcategory */}
            <div className="crp-input-group">
              <label>
                <FaTags /> CRP Subcategory
              </label>
              <select
                value={subcat}
                onChange={(e) => setSubCat(e.target.value)}
              >
                <option value="">Please select</option>
                <option value="WIDOW">Widow</option>
                <option value="DIVYANG">Divyang</option>
                <option value="NONE">None</option>
              </select>
            </div>
            {/* Alt Number */}
            <div className="crp-input-group">
              <label>
                <FaPhoneAlt /> Alternate Mobile Number
              </label>

              <input
                type="tel"
                maxLength="10"
                pattern="[6-9]{1}[0-9]{9}"
                placeholder="Enter mobile number of CRP"
              />
            </div>
          </div>
          <div className="crp-password-box">
            <label className="password-label">
              <FaLock /> Set CRP Account Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  setPasswordRules(validatePassword(val));
                }}
                placeholder="Enter secure password"
                className="password-input"
                style={{ paddingRight: "40px" }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {password && (
              <div className="password-rules">
                {!passwordRules.length && <div>• At least 8 characters</div>}
                {!passwordRules.upper && <div>• One uppercase letter</div>}
                {!passwordRules.lower && <div>• One lowercase letter</div>}
                {!passwordRules.number && <div>• One number</div>}
                {!passwordRules.special && <div>• One special character</div>}
              </div>
            )}

            <button
              className="create-crp-btn"
              onClick={handleCreateCRP}
              disabled={creating || !selectedMember}
            >
              {creating ? (
                <>
                  <FaSpinner className="spin" /> Creating...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Create CRP Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Row 4 */}
      <div className="epsms-grid-row one-col">
        <div ref={panchayatSection} className="epsms-card">
          {successData && (
            <h3 className="crp-title">
              <FaMapMarkerAlt /> Assign Panchayats to CRP
            </h3>
          )}
          {successData && (
            <PanchayatsList
              crpData={successData}
              blockId={geoFilters.block_id}
            />
          )}
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && successData && (
        <div className="crp-success-modal">
          <div className="crp-success-card">
            <h3 className="crp-title">
              <FaCheckCircle /> CRP Account Created!
            </h3>

            <div className="success-details">
              <div>
                <b>Username:</b> {successData.username}
              </div>
              <div>
                <b>Password:</b> {successData.password}
              </div>
              <div>
                <b>Name:</b> {successData.crp.name}
              </div>
              <div>
                <b>Mobile:</b> {successData.crp.mobile_number}
              </div>
              <div>
                <b>Category:</b> {successData.crp.category}
              </div>
              <div>
                <b>SHG Code:</b> {successData.crp.lokos_shg_code}
              </div>
              <div>
                <b>Member Code:</b> {successData.crp.lokos_member_code}
              </div>
            </div>

            <button
              className="close-success-btn"
              onClick={() => {
                setShowSuccessModal(false);

                setTimeout(() => {
                  panchayatSection.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      {errorData && (
        <div className="crp-success-modal">
          <div className="crp-success-card">
            <h3 style={{ color: "red" }}>❌ CRP Creation Failed</h3>

            <div className="success-details">{errorData}</div>

            <button
              className="close-success-btn"
              onClick={() => setErrorData(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---- styles ---- */}
      <style>{`
        .crpform-epsms-dashboard {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .epsms-grid-row {
          display: grid;
          gap: 16px;
        }

        .epsms-grid-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .epsms-grid-row.one-col {
          grid-template-columns: 1fr;
        }

        .epsms-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .epsms-card h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 700;
          color: #400b0b;
        }

        /* Selected CRP Card */
        .selected-crp-card {
          border-left: 5px solid var(--epsms-red);
          animation: crpFade 0.4s ease;
        }

        /* Title */
        .crp-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--epsms-red);
          font-size: 20px;
          margin-bottom: 14px;
        }

        .generic-amber-title {
          color: #d97706 !important;
        }

        /* Placeholder */
        .crp-placeholder {
          color: var(--epsms-text-muted);
          font-size: 15px;
          padding: 20px;
          text-align: center;
          background: #fafafa;
          border-radius: 8px;
        }

        /* Grid Layout */
        .crp-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        /* Detail Box */
        .crp-detail {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px 14px;
          border-radius: 8px;
          background: #fafafa;
          border: 1px solid var(--epsms-muted);
          transition: all 0.25s ease;
        }

        .crp-detail:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-color: var(--epsms-border);
        }

        /* Icons */
        .crp-icon {
          font-size: 20px;
          color: var(--epsms-red);
          min-width: 20px;
        }

        /* Label */
        .crp-label {
          display: block;
          font-size: 12px;
          color: var(--epsms-text-muted);
        }

        /* Value */
        .crp-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--epsms-text-dark);
        }

        /* Fallback Manual Table Structural Styles */
        .fallback-clf-card {
          border-left: 5px solid #d97706;
          animation: crpFade 0.35s ease;
        }

        .fallback-table-wrapper {
          overflow-x: auto;
          margin-top: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .fallback-clf-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .fallback-clf-table th {
          background-color: #f8fafc;
          color: #334155;
          font-weight: 600;
          padding: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .fallback-clf-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #475569;
        }

        .fallback-clf-table tr:last-child td {
          border-bottom: none;
        }

        .fallback-clf-table tr:hover {
          background-color: #fdfdfd;
        }

        .fallback-clf-table tr.selected-row {
          background-color: #fef3c7;
        }

        .clf-code-badge {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 600;
          color: #1e293b;
        }

        .clf-select-btn {
          background-color: #d97706;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: background-color 0.2s ease;
        }

        .fallback-clf-table tr.selected-row .clf-select-btn {
          background-color: #059669;
        }

        .clf-select-btn:hover {
          opacity: 0.9;
        }

        /* Animation */
        @keyframes crpFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile */
        @media (max-width: 640px) {

          .crp-details-grid {
            grid-template-columns: 1fr;
          }

          .crp-detail {
            padding: 10px;
          }

          .fallback-clf-table th, 
          .fallback-clf-table td {
            padding: 8px;
            font-size: 13px;
          }
        }

        @media (max-width: 1024px) {
          .epsms-grid-row.two-col {
            grid-template-columns: 1fr;
          }
        }

        /* PASSWORD BOX */

        .crp-password-box{
          margin-top:20px;
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .password-label{
          font-weight:600;
          color:var(--epsms-text-dark);
          display:flex;
          gap:6px;
          align-items:center;
        }

        .password-input{
          padding:10px;
          border:1px solid var(--epsms-border);
          border-radius:6px;
          font-size:14px;
        }

        .password-input:focus{
          outline:none;
          border-color:var(--epsms-red);
        }

        .password-error{
          color:#dc2626;
          font-size:13px;
        }

        /* CREATE BUTTON */

        .create-crp-btn{
          background:var(--epsms-green);
          border:none;
          padding:10px 16px;
          border-radius:6px;
          color:white;
          font-weight:600;
          cursor:pointer;
          display:flex;
          gap:8px;
          align-items:center;
          justify-content:center;
          transition:all .25s ease;
        }

        .create-crp-btn:hover{
          transform:translateY(-1px);
          box-shadow:0 6px 12px rgba(0,0,0,0.15);
        }

        .create-crp-btn:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        /* LOADER */

        .spin{
          animation:spin 1s linear infinite;
        }

        @keyframes spin{
          from{transform:rotate(0deg)}
          to{transform:rotate(360deg)}
        }

        /* SUCCESS MODAL */

        .crp-success-modal{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.45);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
        }

        .crp-success-card{
          background:white;
          padding:24px;
          border-radius:10px;
          width:min(420px,90vw);
          animation:crpFade .3s ease;
        }

        .success-details{
          margin-top:16px;
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .close-success-btn{
          margin-top:16px;
          padding:8px 14px;
          border:none;
          background:var(--epsms-red);
          color:white;
          border-radius:6px;
          cursor:pointer;
        }        

        /* EXTRA INPUT SECTION */

        .crp-extra-inputs{
          margin-top:18px;
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:14px;
        }

        /* INPUT GROUP */

        .crp-input-group{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .crp-input-group label{
          font-size:13px;
          font-weight:600;
          color:var(--epsms-text-dark);
          display:flex;
          align-items:center;
          gap:6px;
        }

        /* INPUT */

        .crp-input-group input,
        .crp-input-group select{
          padding:10px;
          border-radius:6px;
          border:1px solid var(--epsms-border);
          font-size:14px;
          transition:all .25s ease;
          background:white;
        }

        .crp-input-group input:focus,
        .crp-input-group select:focus{
          outline:none;
          border-color:var(--epsms-red);
          box-shadow:0 0 0 2px rgba(201,88,53,.15);
        }

        .password-rules{
          font-size:13px;
          color:#dc2626;
          display:flex;
          flex-direction:column;
          gap:3px;
        }

        .required {
          color: red;
          margin-left: 4px;
        }

        /* CLF INPUT WRAPPER */
        .clf-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .clf-input-wrapper input {
          width: 100%;
          padding-right: 40px;
          background: #f9fafb;
          font-weight: 600;
        }

        /* SPINNER */
        .clf-spinner {
          position: absolute;
          right: 10px;
          color: var(--epsms-red);
        }

        /* CLF DISPLAY */
        .clf-display {
          margin-top: 6px;
          font-size: 13px;
          color: var(--epsms-green);
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeSlide 0.3s ease;
        }

        /* ERROR */
        .clf-error {
          margin-top: 6px;
          font-size: 13px;
          color: #dc2626;
          animation: fadeSlide 0.3s ease;
        }

        /* ANIMATION */
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .clf-display,
          .clf-error {
            font-size: 12px;
          }
        }

        /* HOVER */

        .crp-input-group input:hover,
        .crp-input-group select:hover{
          border-color:var(--epsms-red);
        }

        /* MOBILE */

        @media (max-width:640px){

          .crp-extra-inputs{
            grid-template-columns:1fr;
          }

        }        
      `}</style>
    </div>
  );
}
