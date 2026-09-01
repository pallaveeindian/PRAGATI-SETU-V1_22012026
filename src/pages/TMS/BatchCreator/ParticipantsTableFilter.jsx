import React, { useState, useEffect, useRef, useContext } from "react";
import api, { LOOKUP_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";

const ParticipantTableFilters = ({
  filters = {},
  handleChange,
  onFetch, // Parent से Fetch function
  isLoading = false,
  // genders = [],
  // designations = [],
  pldStatus = [],
  socialCategories = [],
  // religions = [],
  ageRanges = [],
  blocks: initialBlocks = [],
  isResumeMode = false,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);

  // Custom Dropdown states for Panchayat
  const [isPanchayatOpen, setIsPanchayatOpen] = useState(false);
  const [panchayatPageSize, setPanchayatPageSize] = useState(5000);
  const panchayatRef = useRef(null);
  const { user } = useContext(AuthContext);

  // =====================================================================
  // SURGICAL ADDITION: STRICT SYSTEM TIME VERIFICATION (ANTI-TAMPERING)
  // =====================================================================
  const [isTimeTampered, setIsTimeTampered] = useState(false);
  const [actualDateStr, setActualDateStr] = useState("");

  useEffect(() => {
    const verifySystemTime = async () => {
      try {
        // SURGICAL UPDATE: Fetch trusted IST time from internal backend to bypass CORS
        const response = await api.get("/tms/server-time/");
        const data = response.data;

        // Extract strict YYYY-MM-DD from the trusted server
        const serverDateStr = data.date_time.substring(0, 10);

        // Get local PC date strictly formatted to YYYY-MM-DD in IST
        const localDate = new Date();
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const parts = formatter.formatToParts(localDate);
        const localYear = parts.find((p) => p.type === "year").value;
        const localMonth = parts.find((p) => p.type === "month").value;
        const localDay = parts.find((p) => p.type === "day").value;
        const localFormattedStr = `${localYear}-${localMonth}-${localDay}`;

        if (serverDateStr !== localFormattedStr) {
          setIsTimeTampered(true);
          setActualDateStr(serverDateStr);
        } else {
          setIsTimeTampered(false);
        }
      } catch (error) {
        console.warn(
          "Time verification API blocked or failed. Proceeding cautiously.",
        );
      }
    };

    // Check immediately on mount, then continuously poll every 5 seconds
    verifySystemTime();
    const interval = setInterval(verifySystemTime, 5000);
    return () => clearInterval(interval);
  }, []);
  // =====================================================================

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panchayatRef.current &&
        !panchayatRef.current.contains(event.target)
      ) {
        setIsPanchayatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchedBlocksRef = useRef(false);

  useEffect(() => {
    if (fetchedBlocksRef.current) return;
    fetchedBlocksRef.current = true;

    const fetchScopedLocationData = async () => {
      try {
        const userRoleId = user.role_id;
        const userId = user.id;
        let districtId = null;

        if (userId) {
          const response = await LOOKUP_API.userGeoscopeByUserId(userId);

          districtId =
            response?.data?.districts?.[0] ?? response?.data?.district ?? null;

          if (districtId) {
            handleValueChange("districtId", districtId);
          }
        }
        if (
          String(userRoleId) === "13" &&
          districtId &&
          typeof LOOKUP_API.blocksByDistrict === "function"
        ) {
          const response = await LOOKUP_API.FULLblocksByDistrict(districtId, {
            page_size: 5000,
          });
          const rawData = response?.data?.results || response?.data || [];

          setBlocks(rawData);
          return;
        }

        if (Array.isArray(initialBlocks) && initialBlocks.length) {
          setBlocks(initialBlocks);
          return;
        }

        if (typeof LOOKUP_API.blocks?.list === "function") {
          const response = await LOOKUP_API.blocks.list();
          setBlocks(response?.data?.results || response?.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchScopedLocationData();
  }, []);

  // 2. Cascade Chain: Block select hone par Panchayats load karna
  useEffect(() => {
    const fetchPanchayats = async () => {
      if (
        !filters.block ||
        Array.isArray(filters.block) ||
        filters.batchType === "Combined"
      ) {
        if (panchayats.length) setPanchayats([]);
        if (villages.length) setVillages([]);
        return;
      }

      try {
        const response = await LOOKUP_API.panchayatsByBlock(filters.block, {
          params: { page_size: 500 },
        });
        setPanchayats(response?.data?.results || response?.data || []);
        setVillages([]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPanchayats();
  }, [filters.block, filters.batchType]);

  // 3. Cascade Chain: Panchayat select hone par Villages load karna
  useEffect(() => {
    const fetchVillages = async () => {
      if (!filters.panchayat) {
        if (villages.length) setVillages([]);
        return;
      }

      try {
        const response = await LOOKUP_API.villagesByPanchayat(
          filters.panchayat,
        );
        setVillages(response?.data?.results || response?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVillages();
  }, [filters.panchayat]);

  const handleValueChange = (key, value) => {
    if (typeof handleChange === "function") {
      handleChange(key, value);
    }
  };

  const handleMultipleSelectChange = (key, options) => {
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    handleValueChange(key, selectedValues);
  };

  const getMinStartDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split("T")[0];
  };

  const handleStartDateChange = (dateValue) => {
    handleValueChange("startDate", dateValue);

    if (!dateValue) {
      handleValueChange("endDate", "");
      return;
    }

    if (filters.trainingPlanDays) {
      const start = new Date(dateValue);
      start.setDate(start.getDate() + Number(filters.trainingPlanDays) - 1);

      handleValueChange("endDate", start.toISOString().split("T")[0]);
    }
  };

  const calculateAndSetEndDate = (startDateStr, days) => {
    const start = new Date(startDateStr);
    start.setDate(start.getDate() + (Number(days) - 1));
    const endDateStr = start.toISOString().split("T")[0];
    handleValueChange("endDate", endDateStr);
  };

  const containerStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  };
  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#374151",
  };
  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
  };
  const buttonStyle = {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const isCombined = filters.batchType === "Combined";

  const getBlockValue = (b) =>
    typeof b === "object" ? (b.id ?? b.block_id ?? b.block_code ?? b.value) : b;
  const getBlockLabel = (b) =>
    typeof b === "object" ? b.block_name_en || b.block_name || b.name : b;

  const getPanchayatValue = (p) =>
    typeof p === "object"
      ? (p.id ?? p.panchayat_id ?? p.panchayat_code ?? p.value)
      : p;
  const getPanchayatLabel = (p) =>
    typeof p === "object"
      ? p.panchayat_name || p.panchayat_name_en || p.name
      : p;

  const getVillageValue = (v) =>
    typeof v === "object"
      ? (v.id ?? v.village_id ?? v.village_code ?? v.value)
      : v;
  const getVillageLabel = (v) =>
    typeof v === "object"
      ? v.village_name || v.village_name_english || v.name
      : v;

  const verifiedBlocks = Array.isArray(blocks) ? blocks : [];
  const verifiedPanchayats = Array.isArray(panchayats) ? panchayats : [];
  const verifiedVillages = Array.isArray(villages) ? villages : [];

  const paginatedPanchayats = verifiedPanchayats.slice(0, panchayatPageSize);
  const currentSelectedPanchayatObj = verifiedPanchayats.find(
    (p) => String(getPanchayatValue(p)) === String(filters.panchayat),
  );
  const selectedPanchayatLabel = currentSelectedPanchayatObj
    ? getPanchayatLabel(currentSelectedPanchayatObj)
    : "All";

  return (
    <div style={containerStyle}>
      {/* ============================================== */}
      {/* SURGICAL ADDITION: TIME TAMPERING BLOCKER MODAL */}
      {/* ============================================== */}
      {isTimeTampered && (
        <div className="time-lock-overlay">
          <div className="time-lock-modal">
            <div className="pulse-icon">⚠️</div>
            <h2 style={{ color: "#dc2626", marginTop: 0, fontSize: "22px" }}>
              System Clock Mismatch Detected!
            </h2>
            <p
              style={{ color: "#334155", fontSize: "15px", lineHeight: "1.5" }}
            >
              Security protocols require your system clock to match the current{" "}
              <strong>Uttar Pradesh (IST)</strong> date to create batches and
              assign participants.
            </p>
            <div className="date-compare">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Actual Live Date:</strong>
                <span style={{ color: "#16a34a", fontWeight: "700" }}>
                  {actualDateStr}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Your PC Date:</strong>
                <span style={{ color: "#dc2626", fontWeight: "700" }}>
                  {new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
              </div>
            </div>
            <p
              style={{ fontSize: "13px", color: "#64748b", marginTop: "20px" }}
            >
              Please update your PC's Date and Time settings to sync with the
              automatic internet time.
              <br />
              <br />
              <strong>
                This screen will disappear automatically once fixed.
              </strong>
            </p>
          </div>
          <style>{`
            .time-lock-overlay {
              position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
              display: flex; align-items: center; justify-content: center; z-index: 999999;
            }
            .time-lock-modal {
              background: white; border-top: 6px solid #dc2626; border-radius: 12px;
              padding: 30px; max-width: 500px; text-align: left; 
              box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
              animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .pulse-icon { 
              font-size: 48px; margin-bottom: 16px; text-align: center; 
              animation: pulseRed 1.5s infinite; 
            }
            .date-compare { 
              background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 20px; 
              font-size: 15px; display: flex; flex-direction: column; gap: 10px; 
              border: 1px dashed #cbd5e1; 
            }
            @keyframes popIn { 
              from { opacity: 0; transform: scale(0.8); } 
              to { opacity: 1; transform: scale(1); } 
            }
            @keyframes pulseRed { 
              0% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0 rgba(220, 38, 38, 0)); } 
              50% { transform: scale(1.15); opacity: 0.8; filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.6)); } 
              100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0 rgba(220, 38, 38, 0)); } 
            }
          `}</style>
        </div>
      )}
      {/* ============================================== */}

      {/* ============================================== */}
      {/* SECTION 1: BATCH STRUCTURAL SELECTABLES        */}
      {/* ============================================== */}
      <h4
        style={{
          margin: "0 0 16px 0",
          color: "#2563eb",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Batch Configuration
      </h4>
      <div style={{ ...gridStyle, marginBottom: "32px" }}>
        {filters.participantType !== "Trainer" && (
          <>
            <div>
              <label style={labelStyle}>Batch Type</label>
              <select
                value={
                  isResumeMode ? "Separate" : filters.batchType || "Separate"
                }
                disabled={isResumeMode}
                style={{
                  ...selectStyle,
                  background: isResumeMode ? "#f3f4f6" : "#fff",
                  cursor: isResumeMode ? "not-allowed" : "pointer",
                  opacity: isResumeMode ? 0.6 : 1,
                }}
                onChange={(e) => {
                  handleValueChange(
                    "block",
                    e.target.value === "Combined" ? [] : "",
                  );
                  handleValueChange("panchayat", "");
                  handleValueChange("village", "");
                  handleValueChange("batchType", e.target.value);
                }}
              >
                <option value="Separate">Separate Batch (Single Block)</option>
                {!isResumeMode && (
                  <option value="Combined">
                    Combined Batch (Multiple Blocks)
                  </option>
                )}
              </select>
            </div>
          </>
        )}

        <div>
          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            style={inputStyle}
            min={getMinStartDate()}
            value={filters.startDate || ""}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Calculated End Date</label>
          <input
            type="date"
            style={{
              ...inputStyle,
              background: "#f3f4f6",
              cursor: "not-allowed",
            }}
            value={filters.endDate || ""}
            disabled
            placeholder="Auto calculated"
          />
        </div>
      </div>

      {/* ============================================== */}
      {/* SECTION 2: PARTICIPANT QUERY FILTERS           */}
      {/* ============================================== */}
      <div style={gridStyle}>
        {filters.participantType !== "Trainer" && (
          <>
            <h4
              style={{
                gridColumn: "1 / -1",
                margin: "0 0 16px 0",
                color: "#2563eb",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "8px",
              }}
            >
              Participant Trainee Filters
            </h4>
            <div>
              <label style={labelStyle}>
                Select Block{" "}
                {isCombined ? "(Hold Ctrl/Cmd to select multi)" : ""}
              </label>
              {isCombined ? (
                <select
                  multiple
                  style={{ ...selectStyle, height: "80px", padding: "4px" }}
                  value={Array.isArray(filters.block) ? filters.block : []}
                  onChange={(e) =>
                    handleMultipleSelectChange("block", e.target.options)
                  }
                >
                  {verifiedBlocks.map((b, idx) => (
                    <option key={idx} value={getBlockValue(b)}>
                      {getBlockLabel(b)}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  style={selectStyle}
                  value={typeof filters.block === "string" ? filters.block : ""}
                  onChange={(e) => {
                    handleValueChange("block", e.target.value);
                    handleValueChange("panchayat", "");
                    handleValueChange("village", "");
                  }}
                >
                  <option value="">All Blocks</option>
                  {verifiedBlocks.map((b, idx) => (
                    <option key={idx} value={getBlockValue(b)}>
                      {getBlockLabel(b)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </>
        )}

        {filters.participantType === "Beneficiary" && (
          <>
            <div>
              <label style={labelStyle}>Age Range</label>
              <select
                style={selectStyle}
                value={filters.ageRange || ""}
                onChange={(e) => handleValueChange("ageRange", e.target.value)}
              >
                <option value="">All</option>
                {ageRanges.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* ============================================== */}
      {/* SECTION 3: PARTICIPANT SEARCH                  */}
      {/* ============================================== */}

      <h4
        style={{
          margin: "32px 0 16px 0",
          color: "#2563eb",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "8px",
        }}
      >
        Search by Training Request ID
      </h4>

      <div style={gridStyle}>
        {filters.participantType === "Beneficiary" && (
          <div>
            <label style={labelStyle}>
              Available searches : SHG Code / Member Code / Member Name
            </label>
            <input
              style={inputStyle}
              placeholder="Search..."
              value={filters.searchValue || ""}
              onChange={(e) => handleValueChange("searchValue", e.target.value)}
            />
          </div>
        )}

        {filters.participantType === "Trainer" && (
          <div>
            <label style={labelStyle}>
              Available searches : Mobile No / Full Name / Aadhaar
            </label>
            <input
              style={inputStyle}
              placeholder="Search..."
              value={filters.searchValue || ""}
              onChange={(e) => handleValueChange("searchValue", e.target.value)}
            />
          </div>
        )}
      </div>
      {/* FETCH ACTION CONTAINER */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          borderTop: "1px solid #f3f4f6",
          paddingTop: "15px",
        }}
      >
        <button
          type="button"
          style={{
            ...buttonStyle,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onClick={onFetch}
          disabled={isLoading}
        >
          {isLoading ? "Fetching..." : "Fetch Trainees"}
        </button>
      </div>
    </div>
  );
};

export default ParticipantTableFilters;
