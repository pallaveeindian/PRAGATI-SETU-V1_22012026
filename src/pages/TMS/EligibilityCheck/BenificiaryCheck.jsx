// src\pages\TMS\EligibilityCheck\BenificiaryCheck.jsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { TMS_API, EPSAKHI_API, LOOKUP_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  FaCheckCircle,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaTimesCircle,
  FaUser,
  FaUsers,
  FaSyncAlt,
  FaBuilding,
  FaArrowRight,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";

// In-memory cache for Beneficiary list table
const beneficiaryListCache = new Map();

function formatDetailValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    return (
      value
        .map(formatDetailValue)
        .filter((item) => item !== "—")
        .join(", ") || "—"
    );
  }
  if (typeof value === "object") {
    const displayValue =
      value.training_name ||
      value.batch_name ||
      value.block_name_en ||
      value.block_name ||
      value.district_name_en ||
      value.district_name ||
      value.name ||
      value.title ||
      value.code;
    return displayValue || JSON.stringify(value);
  }
  return String(value);
}

function formatDetailLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Table Row Component for Members
const BeneficiaryRow = React.memo(function BeneficiaryRow({ row, srNo }) {
  const district =
    row.member_addresses?.[0]?.district_name ||
    row.district_name ||
    row.district_name_en ||
    row.district ||
    "-";
  const block =
    row.member_addresses?.[0]?.block_name ||
    row.block_name ||
    row.block_name_en ||
    row.block ||
    "-";
  const mobile =
    row.member_phones?.[0]?.phone_no || row.mobile_no || row.mobile || "-";

  return (
    <tr>
      <td style={{ color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        {srNo}
      </td>
      <td>
        <strong>
          {row.member_code || row.lokos_member_code || row.id || "-"}
        </strong>
      </td>
      <td>
        <strong>{row.member_name || row.name || "-"}</strong>
      </td>
      <td>{district}</td>
      <td>{block}</td>
      <td>{mobile}</td>
    </tr>
  );
});

export default function BeneficiaryCheck() {
  const { user, authReady } = useContext(AuthContext) || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [districtId, setDistrictId] = useState(null);

  // ==========================================
  // 1. STATUS CHECK FORM STATES
  // ==========================================
  const [formData, setFormData] = useState({
    membercode: "",
    name: "",
    mobile_no: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // ==========================================
  // 2. DRILL-DOWN TABLE STATES (Blocks -> SHGs -> Members)
  // ==========================================
  const [viewLevel, setViewLevel] = useState("BLOCKS"); // 'BLOCKS' | 'SHGS' | 'MEMBERS'
  const [activeBlock, setActiveBlock] = useState(null); // { id, name }
  const [activeShg, setActiveShg] = useState(null); // { code, name }

  const [blocks, setBlocks] = useState([]);
  const [shgs, setShgs] = useState([]);
  const [rows, setRows] = useState([]); // Members

  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0 });
  const [loadingTable, setLoadingTable] = useState(true);
  const [tableError, setTableError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Resolve the signed-in user's district before loading the directory.
  useEffect(() => {
    let cancelled = false;
    if (!authReady) return undefined;

    setDistrictId(null);
    setBlocks([]);
    setShgs([]);
    setRows([]);
    setActiveBlock(null);
    setActiveShg(null);
    setViewLevel("BLOCKS");
    setLoadingTable(true);
    setTableError("");

    const resolveDistrict = async () => {
      try {
        const response = user?.id
          ? await LOOKUP_API.userGeoscopeByUserId(user.id)
          : null;
        const geoScope = response?.data || {};
        const assignedDistrictId =
          geoScope.district_id ||
          geoScope.districts?.[0] ||
          geoScope.district ||
          user?.district_id;

        if (!assignedDistrictId) {
          throw new Error("No district mapping found for your account.");
        }

        if (!cancelled) {
          setDistrictId(String(assignedDistrictId));
          setTableError("");
        }
      } catch (e) {
        console.error("Failed to resolve user's district", e);
        if (!cancelled) {
          setDistrictId(null);
          setTableError(
            e.message === "No district mapping found for your account."
              ? e.message
              : "Failed to load your district. Please try again.",
          );
          setLoadingTable(false);
        }
      }
    };

    resolveDistrict();
    return () => {
      cancelled = true;
    };
  }, [authReady, user?.id, user?.district_id]);

  // Load only the blocks assigned to the signed-in user's district.
  useEffect(() => {
    if (!districtId) return undefined;

    let cancelled = false;
    const fetchBlocks = async () => {
      setLoadingTable(true);
      setBlocks([]);
      setShgs([]);
      setRows([]);
      setActiveBlock(null);
      setActiveShg(null);
      setViewLevel("BLOCKS");
      try {
        const res = await LOOKUP_API.blocks.list({
          district: districtId,
          district_id: districtId,
          limit: 500,
        });
        const payload = res?.data || {};
        const data = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];
        if (!cancelled) setBlocks(data);
      } catch (e) {
        console.error("Failed to load blocks", e);
        if (!cancelled)
          setTableError("Failed to load blocks for your district.");
      } finally {
        if (!cancelled) setLoadingTable(false);
      }
    };
    fetchBlocks();
    return () => {
      cancelled = true;
    };
  }, [districtId]);

  // Load SHGs when a Block is selected
  const fetchShgs = async (block) => {
    setLoadingTable(true);
    setTableError("");
    setShgs([]);
    try {
      const res = await EPSAKHI_API.upsrlmShgList(block.id, {
        block_id: block.id,
        page: 1,
        page_size: 5000, // Fetching all SHGs for the block to allow client-side search
      });
      const payload = res?.data || {};
      const data = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.results)
          ? payload.results
          : [];
      setShgs(data);
    } catch (e) {
      console.error("Failed to load SHGs", e);
      setTableError("Failed to load SHGs for the selected block.");
    } finally {
      setLoadingTable(false);
    }
  };

  // Fetch Members when an SHG is selected (Paginated)
  const loadMembersData = useCallback(
    async (shg, page = 1, { force = false } = {}) => {
      if (!shg || !districtId) return;

      const pageSize = meta.page_size || 20;
      const cacheKey = JSON.stringify({
        district: districtId,
        shg: shg.code,
        page,
        page_size: pageSize,
      });

      if (!force && beneficiaryListCache.has(cacheKey)) {
        const cached = beneficiaryListCache.get(cacheKey);
        setRows(cached.rows || []);
        setMeta(cached.meta || { page, page_size: pageSize, total: 0 });
        return;
      }

      setLoadingTable(true);
      setTableError("");

      try {
        const params = { page, page_size: pageSize };
        const res = await EPSAKHI_API.upsrlmShgMembers(shg.code, params);

        const payload = res?.data || {};
        const data =
          Array.isArray(payload.data) && payload.data.length
            ? payload.data
            : Array.isArray(payload.results)
              ? payload.results
              : [];

        const totalFromMeta =
          typeof payload.meta?.total === "number"
            ? payload.meta.total
            : undefined;
        const totalFromCount =
          typeof payload.count === "number" ? payload.count : data.length;

        const newMeta = {
          page: payload.meta?.page ?? page,
          page_size: payload.meta?.page_size ?? pageSize,
          total: totalFromMeta ?? totalFromCount,
        };

        setRows(data);
        setMeta(newMeta);
        beneficiaryListCache.set(cacheKey, { rows: data, meta: newMeta });
      } catch (e) {
        console.error("Failed to load beneficiary list", e);
        setTableError("Failed to load beneficiary list. Please try again.");
      } finally {
        setLoadingTable(false);
      }
    },
    [districtId, meta.page_size],
  );

  // Navigation Handlers
  const handleBlockClick = (block) => {
    const blockId = block.id || block.block_id || block.code;
    const blockName =
      block.name_en ||
      block.name ||
      block.block_name_en ||
      block.block_name ||
      `Block ${blockId}`;

    setActiveBlock({ id: blockId, name: blockName });
    setActiveShg(null);
    setViewLevel("SHGS");
    setSearchKeyword("");
    fetchShgs({ id: blockId, name: blockName });
  };

  const handleShgClick = (shg) => {
    const shgCode = shg.shg_code || shg.code || shg.id;
    const shgName = shg.shg_name || shg.name || `SHG ${shgCode}`;

    setActiveShg({ code: shgCode, name: shgName });
    setViewLevel("MEMBERS");
    setSearchKeyword("");
    loadMembersData({ code: shgCode, name: shgName }, 1);
  };

  const handleBreadcrumbClick = (level) => {
    setViewLevel(level);
    setSearchKeyword("");
    if (level === "BLOCKS") {
      setActiveBlock(null);
      setActiveShg(null);
    } else if (level === "SHGS") {
      setActiveShg(null);
      // Data is already in 'shgs' state
    }
  };

  // ==========================================
  // HANDLERS FOR STATUS CHECK
  // ==========================================
  const handleCheckChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCheckAvailability = async (event) => {
    event.preventDefault();
    const searchParams = Object.fromEntries(
      Object.entries(formData)
        .map(([key, value]) => [
          key,
          key === "name" ? value.trim().replace(/\s+/g, " ") : value.trim(),
        ])
        .filter(([, value]) => value),
    );

    if (Object.keys(searchParams).length === 0) {
      setError("Please enter a member code, name, or mobile number.");
      return;
    }

    setIsSearching(true);
    setError("");
    setSearchResults([]);
    setHasSearched(true);

    try {
      const response = await TMS_API.participantStatus({
        type: "beneficiary",
        ...searchParams,
      });
      if (response.data.success) {
        setSearchResults(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      } else {
        setError(
          response.data.message || "Unable to check beneficiary status.",
        );
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const clearCheckForm = () => {
    setFormData({ membercode: "", name: "", mobile_no: "" });
    setSearchResults([]);
    setError("");
    setHasSearched(false);
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const totalPages =
    meta.page_size > 0
      ? Math.max(1, Math.ceil((meta.total || 0) / meta.page_size))
      : 1;

  // Search filter applied locally based on current view level
  const getFilteredData = () => {
    const keyword = searchKeyword.toLowerCase();
    if (viewLevel === "BLOCKS") {
      return blocks.filter(
        (b) =>
          (b.name_en || b.name || "").toLowerCase().includes(keyword) ||
          String(b.id || b.code || "").includes(keyword),
      );
    }
    if (viewLevel === "SHGS") {
      return shgs.filter(
        (s) =>
          (s.shg_name || s.name || "").toLowerCase().includes(keyword) ||
          String(s.shg_code || s.code || "").includes(keyword),
      );
    }
    if (viewLevel === "MEMBERS") {
      return rows.filter(
        (r) =>
          (r.member_name || "").toLowerCase().includes(keyword) ||
          (r.member_code || "").includes(keyword) ||
          (r.mobile_no || "").includes(keyword),
      );
    }
    return [];
  };

  const currentData = getFilteredData();

  return (
    <div className="app-container beneficiary-eligibility">
      <Header />
      <div className="d-flex beneficiary-eligibility__layout">
        <LeftNav />
        <main className="beneficiary-eligibility__main">
          <div className="beneficiary-eligibility__content">
            {/* ---------------- INTRO ---------------- */}
            <section className="beneficiary-eligibility__intro">
              <div className="beneficiary-eligibility__intro-copy">
                <span className="beneficiary-eligibility__intro-icon">
                  <FaUsers aria-hidden="true" />
                </span>
                <div>
                  <p className="beneficiary-eligibility__eyebrow">
                    TRAINING MANAGEMENT SYSTEM
                  </p>
                  <h1>Beneficiary Availability</h1>
                  <p>
                    Check training availability or browse members through blocks
                    and SHGs.
                  </p>
                </div>
              </div>
              <div className="beneficiary-eligibility__intro-note">
                <FaCheckCircle aria-hidden="true" />
                <span>
                  Quick status check
                  <br />
                  <strong>Available or engaged</strong>
                </span>
              </div>
            </section>

            {/* ---------------- CHECK FORM ---------------- */}
            <section className="beneficiary-eligibility__search">
              <div className="beneficiary-eligibility__section-heading">
                <div>
                  <p className="beneficiary-eligibility__eyebrow">
                    STATUS CHECK
                  </p>
                  <h2>Find a beneficiary</h2>
                  <p>Enter any one detail to check availability.</p>
                </div>
                <span className="beneficiary-eligibility__hint">
                  <FaSearch aria-hidden="true" /> At least one field
                </span>
              </div>

              <form onSubmit={handleCheckAvailability}>
                <div className="beneficiary-eligibility__fields">
                  <label className="beneficiary-eligibility__field">
                    <span>
                      <FaIdCard aria-hidden="true" /> LokOS member code
                    </span>
                    <input
                      type="text"
                      name="membercode"
                      placeholder="Enter member code"
                      value={formData.membercode}
                      onChange={handleCheckChange}
                    />
                  </label>
                  <label className="beneficiary-eligibility__field">
                    <span>
                      <FaUser aria-hidden="true" /> Beneficiary name
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full or partial name"
                      value={formData.name}
                      onChange={handleCheckChange}
                    />
                  </label>
                  <label className="beneficiary-eligibility__field">
                    <span>
                      <FaPhoneAlt aria-hidden="true" /> Mobile number
                    </span>
                    <input
                      type="tel"
                      name="mobile_no"
                      placeholder="e.g. 9876543210"
                      value={formData.mobile_no}
                      onChange={handleCheckChange}
                    />
                  </label>
                </div>

                {error && (
                  <div className="beneficiary-eligibility__error" role="alert">
                    <FaTimesCircle aria-hidden="true" /> {error}
                  </div>
                )}

                <div className="beneficiary-eligibility__actions">
                  <button
                    type="button"
                    className="beneficiary-eligibility__reset"
                    onClick={clearCheckForm}
                    disabled={isSearching}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="beneficiary-eligibility__submit"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="beneficiary-eligibility__spinner" />
                    ) : (
                      <FaSearch aria-hidden="true" />
                    )}
                    {isSearching ? "Checking..." : "Check availability"}
                  </button>
                </div>
              </form>
            </section>

            {/* ---------------- STATUS RESULTS ---------------- */}
            {hasSearched &&
              !isSearching &&
              !error &&
              searchResults.length === 0 && (
                <section className="beneficiary-eligibility__empty">
                  <FaSearch aria-hidden="true" />
                  <h2>No beneficiaries found</h2>
                  <p>Try another member code, name, or mobile number.</p>
                </section>
              )}

            {hasSearched && searchResults.length > 0 && (
              <section className="beneficiary-eligibility__results">
                <div className="beneficiary-eligibility__results-heading">
                  <div>
                    <p className="beneficiary-eligibility__eyebrow">
                      SEARCH RESULTS
                    </p>
                    <h2>Beneficiary status</h2>
                  </div>
                  <span className="beneficiary-eligibility__hint">
                    {searchResults.length}{" "}
                    {searchResults.length === 1
                      ? "beneficiary"
                      : "beneficiaries"}
                  </span>
                </div>

                {searchResults.map((item, index) => (
                  <article
                    className={`beneficiary-eligibility__result ${item.is_busy ? "is-busy" : "is-free"}`}
                    key={item.lokos_member_code || item.id || index}
                  >
                    {(() => {
                      const batchData =
                        item.batch_data || item.batch || item.batch_info || {};
                      const detailEntries = Object.entries(batchData).filter(
                        ([key, value]) =>
                          value !== null &&
                          value !== undefined &&
                          value !== "" &&
                          !["block_id"].includes(key),
                      );

                      return (
                        <>
                          <div className="beneficiary-eligibility__result-top">
                            <div className="beneficiary-eligibility__person-icon">
                              <FaUser aria-hidden="true" />
                            </div>
                            <div className="beneficiary-eligibility__person">
                              <h3>{item.member_name || "Beneficiary"}</h3>
                              <span>
                                <FaIdCard aria-hidden="true" />{" "}
                                {item.lokos_member_code ||
                                  "Member code not available"}
                              </span>
                            </div>
                            <span className="beneficiary-eligibility__status">
                              {item.is_busy ? (
                                <>
                                  <FaTimesCircle aria-hidden="true" /> Engaged
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle aria-hidden="true" /> Available
                                </>
                              )}
                            </span>
                          </div>

                          <div className="beneficiary-eligibility__contact">
                            <FaPhoneAlt aria-hidden="true" />{" "}
                            {item.mobile_no || "Mobile number not available"}
                          </div>
                          <p className="beneficiary-eligibility__message">
                            {item.message ||
                              (item.is_busy
                                ? "This beneficiary is currently assigned to a training batch."
                                : "This beneficiary is available for assignment.")}
                          </p>

                          {item.is_busy && detailEntries.length > 0 && (
                            <div className="beneficiary-eligibility__details">
                              {detailEntries.map(([key, value]) => (
                                <div
                                  className="beneficiary-eligibility__detail"
                                  key={key}
                                >
                                  <span>
                                    {key.toLowerCase().includes("district") ||
                                    key.toLowerCase().includes("block") ? (
                                      <FaMapMarkerAlt aria-hidden="true" />
                                    ) : (
                                      <FaIdCard aria-hidden="true" />
                                    )}
                                    {formatDetailLabel(key)}
                                  </span>
                                  <strong>{formatDetailValue(value)}</strong>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </article>
                ))}
              </section>
            )}

            {/* ---------------- DRILL-DOWN DIRECTORY TABLE ---------------- */}
            {!hasSearched && (
              <section className="beneficiary-eligibility__directory">
                <div className="beneficiary-eligibility__directory-header">
                  <div>
                    <p className="beneficiary-eligibility__eyebrow">
                      DIRECTORY
                    </p>
                    <div className="beneficiary-eligibility__breadcrumbs">
                      <h2
                        onClick={() => handleBreadcrumbClick("BLOCKS")}
                        className={
                          viewLevel !== "BLOCKS"
                            ? "breadcrumb-link"
                            : "breadcrumb-active"
                        }
                      >
                        All Blocks
                      </h2>

                      {activeBlock && (
                        <>
                          <FaChevronRight className="breadcrumb-separator" />
                          <h2
                            onClick={() => handleBreadcrumbClick("SHGS")}
                            className={
                              viewLevel !== "SHGS"
                                ? "breadcrumb-link"
                                : "breadcrumb-active"
                            }
                          >
                            {activeBlock.name}
                          </h2>
                        </>
                      )}

                      {activeShg && (
                        <>
                          <FaChevronRight className="breadcrumb-separator" />
                          <h2 className="breadcrumb-active">
                            {activeShg.name}
                          </h2>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="beneficiary-eligibility__directory-tools">
                    <label className="beneficiary-eligibility__member-search">
                      <FaSearch aria-hidden="true" />
                      <input
                        type="search"
                        placeholder={`Search ${viewLevel.toLowerCase()}...`}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        aria-label="Search"
                      />
                    </label>
                    {viewLevel === "MEMBERS" && (
                      <button
                        type="button"
                        onClick={() =>
                          loadMembersData(activeShg, meta.page, { force: true })
                        }
                        disabled={loadingTable}
                        className="beneficiary-eligibility__reset beneficiary-eligibility__refresh"
                      >
                        <FaSyncAlt
                          className={loadingTable ? "spin-icon" : ""}
                        />{" "}
                        Refresh
                      </button>
                    )}
                    <span className="beneficiary-eligibility__count">
                      {viewLevel === "MEMBERS"
                        ? meta.total
                        : currentData.length}{" "}
                      records
                    </span>
                  </div>
                </div>

                {tableError && (
                  <div className="beneficiary-eligibility__directory-error">
                    <div
                      className="beneficiary-eligibility__error"
                      style={{ marginTop: 20, marginBottom: 0 }}
                    >
                      <FaTimesCircle /> {tableError}
                    </div>
                  </div>
                )}

                {loadingTable ? (
                  <div className="beneficiary-eligibility__directory-state">
                    <div className="beneficiary-eligibility__spinner beneficiary-eligibility__spinner--dark" />
                    <p>Loading data...</p>
                  </div>
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="tms-table">
                        {/* HEADER: Dynamic based on viewLevel */}
                        <thead>
                          <tr>
                            <th className="beneficiary-eligibility__serial">
                              #
                            </th>
                            {viewLevel === "BLOCKS" && (
                              <>
                                <th>Block ID</th>
                                <th>Block Name</th>
                                <th>Action</th>
                              </>
                            )}
                            {viewLevel === "SHGS" && (
                              <>
                                <th>SHG Code</th>
                                <th>SHG Name</th>
                                <th>Social Category</th>
                                <th>Action</th>
                              </>
                            )}
                            {viewLevel === "MEMBERS" && (
                              <>
                                <th>LokOS Member Code</th>
                                <th>Member Name</th>
                                <th>District</th>
                                <th>Block</th>
                                <th>Mobile</th>
                              </>
                            )}
                          </tr>
                        </thead>

                        {/* BODY: Dynamic based on viewLevel */}
                        <tbody>
                          {currentData.map((row, index) => {
                            const srNo =
                              viewLevel === "MEMBERS"
                                ? (meta.page - 1) * meta.page_size + index + 1
                                : index + 1;

                            if (viewLevel === "BLOCKS") {
                              const blockId =
                                row.id || row.block_id || row.code;
                              const blockName =
                                row.name_en ||
                                row.name ||
                                row.block_name_en ||
                                row.block_name ||
                                "-";
                              return (
                                <tr
                                  key={blockId}
                                  className="clickable-row"
                                  onClick={() => handleBlockClick(row)}
                                >
                                  <td className="beneficiary-eligibility__serial">
                                    {srNo}
                                  </td>
                                  <td>
                                    <strong>{blockId}</strong>
                                  </td>
                                  <td>{blockName}</td>
                                  <td>
                                    <button
                                      className="table-action-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleBlockClick(row);
                                      }}
                                    >
                                      View SHGs <FaArrowRight />
                                    </button>
                                  </td>
                                </tr>
                              );
                            }

                            if (viewLevel === "SHGS") {
                              const shgCode =
                                row.shg_code || row.code || row.id;
                              const shgName = row.shg_name || row.name || "-";
                              const category =
                                row.social_category ||
                                row.socialCategory ||
                                "-";
                              return (
                                <tr
                                  key={shgCode}
                                  className="clickable-row"
                                  onClick={() => handleShgClick(row)}
                                >
                                  <td className="beneficiary-eligibility__serial">
                                    {srNo}
                                  </td>
                                  <td>
                                    <strong>{shgCode}</strong>
                                  </td>
                                  <td>{shgName}</td>
                                  <td>{category}</td>
                                  <td>
                                    <button
                                      className="table-action-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShgClick(row);
                                      }}
                                    >
                                      <FaEye /> View Members
                                    </button>
                                  </td>
                                </tr>
                              );
                            }

                            if (viewLevel === "MEMBERS") {
                              return (
                                <BeneficiaryRow
                                  key={`${row.member_id || row.member_code || row.lokos_member_code || row.id || "member"}-${index}`}
                                  row={row}
                                  srNo={srNo}
                                />
                              );
                            }
                            return null;
                          })}

                          {currentData.length === 0 && !loadingTable && (
                            <tr>
                              <td
                                colSpan="6"
                                className="beneficiary-eligibility__no-results"
                              >
                                No records found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination only shown for Members (since API supports it) */}
                    {viewLevel === "MEMBERS" && totalPages > 1 && (
                      <div className="tms-pagination">
                        <button
                          className="beneficiary-eligibility__reset"
                          disabled={meta.page <= 1}
                          onClick={() =>
                            loadMembersData(activeShg, meta.page - 1)
                          }
                        >
                          Prev
                        </button>
                        <span className="pagination-info">
                          Page <strong>{meta.page}</strong> of {totalPages}
                        </span>
                        <button
                          className="beneficiary-eligibility__reset"
                          disabled={meta.page >= totalPages}
                          onClick={() =>
                            loadMembersData(activeShg, meta.page + 1)
                          }
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
      <Footer />

      <style>{`
        /* --- FULL SCREEN LAYOUT CSS --- */
        .beneficiary-eligibility__layout { display: flex; align-items: flex-start; min-height: calc(100vh - 120px); background: #f3f6fb; }
        .beneficiary-eligibility__main { flex: 1; min-width: 0; padding: clamp(20px, 3vw, 40px); background: radial-gradient(ellipse at 92% 0%, rgba(71, 135, 206, .1), transparent 34%), #f3f6fb; }
        .beneficiary-eligibility__content { width: 100%; max-width: 1320px; margin: 0 auto; }
        
        /* --- HEADERS & INTRO --- */
        .beneficiary-eligibility__intro { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin: 0 0 24px; padding: clamp(22px, 3vw, 34px); border: 1px solid rgba(255, 255, 255, .16); border-radius: 20px; background: linear-gradient(120deg, #0b3d82 0%, #1268a8 65%, #1686ce 100%); box-shadow: 0 14px 34px rgba(11, 61, 130, .18); color: #fff; }
        .beneficiary-eligibility__intro-copy { display: flex; align-items: center; gap: 20px; }
        .beneficiary-eligibility__intro-icon { display: grid; flex: 0 0 62px; width: 62px; height: 62px; place-items: center; border: 1px solid rgba(255, 255, 255, .25); border-radius: 18px; background: rgba(255, 255, 255, .14); color: #fff; font-size: 27px; }
        .beneficiary-eligibility__intro .beneficiary-eligibility__eyebrow { color: #c6e4ff; margin: 0 0 5px; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .beneficiary-eligibility__intro h1 { margin: 0; color: #fff; font-size: clamp(25px, 3vw, 34px); font-weight: 750; letter-spacing: -.035em; }
        .beneficiary-eligibility__intro p:last-child { margin: 6px 0 0; color: #fff; opacity: .82; font-size: 14px; }
        .beneficiary-eligibility__intro-note { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border: 1px solid rgba(255, 255, 255, .2); border-radius: 14px; background: rgba(255, 255, 255, .12); color: #d8edff; font-size: 13px; line-height: 1.55; white-space: nowrap; }
        .beneficiary-eligibility__intro-note > svg { font-size: 21px; }
        .beneficiary-eligibility__intro-note strong { color: #fff; font-size: 14px; }
        
        /* --- CARDS & SEARCH AREA --- */
        .beneficiary-eligibility__search, .beneficiary-eligibility__directory, .beneficiary-eligibility__empty, .beneficiary-eligibility__result { border: 1px solid #e4eaf2; border-radius: 16px; background: #fff; box-shadow: 0 8px 24px rgba(31, 56, 88, .045); }
        .beneficiary-eligibility__search { padding: clamp(20px, 2.5vw, 30px); }
        .beneficiary-eligibility__section-heading { margin-bottom: 22px; }
        .beneficiary-eligibility__section-heading .beneficiary-eligibility__eyebrow, .beneficiary-eligibility__directory .beneficiary-eligibility__eyebrow { margin-bottom: 7px; color: #52739b; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .beneficiary-eligibility__section-heading h2 { margin: 0; color: #1b2f4b; font-size: 20px; font-weight: 700; }
        .beneficiary-eligibility__section-heading p { margin: 5px 0 0; color: #718096; font-size: 14px; }
        .beneficiary-eligibility__hint { display: inline-flex; align-items: center; gap: 7px; padding: 7px 11px; border-radius: 999px; background: #edf4fc; color: #315f92; font-size: 12px; font-weight: 650; white-space: nowrap; }
        
        /* --- FORM FIELDS --- */
        .beneficiary-eligibility__fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .beneficiary-eligibility__field { display: flex; flex-direction: column; gap: 8px; color: #34445b; font-size: 13px; font-weight: 650; }
        .beneficiary-eligibility__field > span { display: flex; align-items: center; gap: 8px; }
        .beneficiary-eligibility__field > span svg { color: #3978b9; }
        .beneficiary-eligibility__field input { box-sizing: border-box; width: 100%; min-height: 48px; padding: 0 16px; border: 1px solid #dbe4ef; border-radius: 10px; background: #fbfcfe; color: #1d2d43; font-size: 15px; transition: all .18s ease; outline: none; }
        .beneficiary-eligibility__field input:focus { border-color: #4386c8; background: #fff; box-shadow: 0 0 0 3px rgba(67, 134, 200, .12); }
        
        /* --- BUTTONS --- */
        .beneficiary-eligibility__actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .beneficiary-eligibility__reset, .beneficiary-eligibility__submit { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 9px; padding: 0 24px; border: 1px solid #d8e1ed; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700; transition: all .2s ease; outline: none; }
        .beneficiary-eligibility__reset { background: #fff; color: #53657c; }
        .beneficiary-eligibility__submit { border: 0; background: linear-gradient(110deg, #0b3d82, #087bbd); box-shadow: 0 6px 16px rgba(11, 61, 130, .2); color: #fff; }
        .beneficiary-eligibility__submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(11, 61, 130, .3); }
        .beneficiary-eligibility__reset:hover:not(:disabled) { background: #f0f4f8; border-color: #c0cddf; }
        .beneficiary-eligibility__submit:disabled, .beneficiary-eligibility__reset:disabled { cursor: not-allowed; opacity: .6; transform: none; box-shadow: none; }
        .beneficiary-eligibility__reset:focus-visible, .beneficiary-eligibility__submit:focus-visible { outline: 3px solid rgba(67, 134, 200, .28); outline-offset: 2px; }
        
        .beneficiary-eligibility__spinner { width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: white; border-radius: 50%; animation: beneficiary-spin .7s linear infinite; }
        .beneficiary-eligibility__spinner--dark { width: 32px; height: 32px; border: 3px solid #dce8f5; border-top-color: #0b3d82; }
        @keyframes beneficiary-spin { to { transform: rotate(360deg); } }
        .beneficiary-eligibility__error { display: flex; align-items: center; gap: 9px; margin-top: 20px; padding: 12px 16px; border: 1px solid #f2caca; border-radius: 10px; background: #fff5f5; color: #a33232; font-size: 14px; line-height: 1.5; }
        
        /* --- SEARCH RESULTS CARDS --- */
        .beneficiary-eligibility__results { margin-top: 28px; }
        .beneficiary-eligibility__results-heading { margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;}
        .beneficiary-eligibility__results-heading h2 { margin: 0; color: #1b2f4b; font-size: 20px; font-weight: 700; }
        .beneficiary-eligibility__result { overflow: hidden; margin-bottom: 16px; padding: 24px; border-left: 5px solid #25a36f; }
        .beneficiary-eligibility__result.is-busy { border-left-color: #e39a35; background: linear-gradient(110deg, #fff 0%, #fffaf2 100%); }
        .beneficiary-eligibility__result.is-free { background: linear-gradient(110deg, #fff 0%, #f7fcf9 100%); }
        .beneficiary-eligibility__result-top { display: flex; align-items: center; gap: 16px; }
        .beneficiary-eligibility__person-icon { display: grid; flex: 0 0 48px; width: 48px; height: 48px; place-items: center; border-radius: 14px; background: #edf4fc; color: #2466a5; font-size: 22px; }
        .beneficiary-eligibility__person { min-width: 0; flex: 1; }
        .beneficiary-eligibility__person h3 { margin: 0 0 6px; color: #1b2f4b; font-size: 18px; font-weight: 700; }
        .beneficiary-eligibility__person > span { display: inline-flex; align-items: center; gap: 6px; color: #64748b; font-size: 13px; font-weight: 500; }
        .beneficiary-eligibility__status { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #e9f7ef; color: #218153; font-size: 13px; font-weight: 750; white-space: nowrap; }
        .is-busy .beneficiary-eligibility__status { background: #fff3df; color: #a86a12; }
        .beneficiary-eligibility__contact { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; color: #728198; font-size: 13px; font-weight: 500; }
        .beneficiary-eligibility__message { margin: 12px 0 0; color: #53657c; font-size: 14px; line-height: 1.6; }
        .beneficiary-eligibility__details { display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 16px; margin-top: 20px; padding: 20px; border: 1px solid #e7edf5; border-radius: 12px; background: rgba(255, 255, 255, .75); }
        .beneficiary-eligibility__detail > span { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #75849a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .beneficiary-eligibility__detail > span svg { color: #4c82b4; }
        .beneficiary-eligibility__detail strong { display: block; overflow-wrap: anywhere; color: #1e293b; font-size: 14px; font-weight: 600; }
        .beneficiary-eligibility__empty { margin-top: 24px; padding: 40px 20px; text-align: center; }
        .beneficiary-eligibility__empty > svg { color: #7b9bbd; font-size: 32px; margin-bottom: 10px; }
        .beneficiary-eligibility__empty h2 { margin: 12px 0 8px; color: #1e293b; font-size: 18px; }
        .beneficiary-eligibility__empty p { margin: 0; color: #64748b; font-size: 14px; }

        /* --- BREADCRUMBS & DRILL-DOWN HEADER --- */
        .beneficiary-eligibility__directory { margin-top: 24px; overflow: hidden; }
        .beneficiary-eligibility__directory-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 28px; border-bottom: 1px solid #edf1f6; }
        .beneficiary-eligibility__breadcrumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .breadcrumb-link { font-size: 21px; font-weight: 700; color: #3d6ba6; cursor: pointer; margin: 0; transition: color 0.2s; }
        .breadcrumb-link:hover { color: #1268a8; text-decoration: underline; }
        .breadcrumb-active { font-size: 21px; font-weight: 750; color: #1b2f4b; margin: 0; }
        .breadcrumb-separator { color: #9ca3af; font-size: 14px; margin-top: 3px; }
        
        .beneficiary-eligibility__directory-tools { display: flex; align-items: center; gap: 10px; }
        .beneficiary-eligibility__member-search { display: flex; width: min(250px, 24vw); min-height: 40px; align-items: center; gap: 9px; padding: 0 12px; color: #7890aa; border: 1px solid #dbe4ef; border-radius: 10px; background: #fbfcfe; transition: all .18s ease; }
        .beneficiary-eligibility__member-search:focus-within { border-color: #4386c8; background: #fff; box-shadow: 0 0 0 3px rgba(67, 134, 200, .12); }
        .beneficiary-eligibility__member-search input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: #1d2d43; font: inherit; font-size: 13px; }
        .beneficiary-eligibility__member-search input::placeholder { color: #93a2b5; }
        .beneficiary-eligibility__refresh { min-height: 40px; padding: 0 13px; }
        .beneficiary-eligibility__count { padding: 8px 12px; border-radius: 999px; background: #edf4fc; color: #315f92; font-size: 12px; font-weight: 700; white-space: nowrap; }

        .beneficiary-eligibility__directory-state { display: flex; min-height: 220px; flex-direction: column; align-items: center; justify-content: center; padding: 32px 20px; color: #64748b; text-align: center; }
        .beneficiary-eligibility__directory-state:has(.beneficiary-eligibility__spinner) { min-height: 180px; }

        /* --- TABLE --- */
        .table-wrapper { width: 100%; overflow-x: auto; border-top: 0; }
        .tms-table { width: 100%; min-width: 720px; border-collapse: separate; border-spacing: 0; text-align: left; }
        .tms-table th { padding: 14px 18px; background: #f8fafd; color: #637992; font-size: 11px; font-weight: 750; text-transform: uppercase; letter-spacing: .07em; border-bottom: 1px solid #edf1f6; white-space: nowrap; }
        .tms-table td { padding: 15px 18px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .clickable-row { cursor: pointer; transition: background-color 0.15s ease, transform 0.15s ease; }
        .clickable-row:hover { background-color: #f0f7ff !important; }
        .tms-table tbody tr:hover td { background: #f7faff; }
        .beneficiary-eligibility__serial { width: 56px; text-align: center !important; }
        .beneficiary-eligibility__no-results { padding: 34px !important; color: #718096 !important; text-align: center; }

        /* Table Action Button */
        .table-action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid #cce0f5; border-radius: 6px; background: #eaf3fd; color: #0b3d82; font-size: 12px; font-weight: 650; cursor: pointer; transition: all 0.2s; }
        .table-action-btn:hover { background: #0b3d82; color: #fff; border-color: #0b3d82; }

        /* --- PAGINATION --- */
        .tms-pagination { display: flex; align-items: center; justify-content: flex-end; gap: 16px; padding: 20px 24px; background: #fff; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px; }
        .pagination-info { font-size: 14px; color: #64748b; }
        .pagination-info strong { color: #0f172a; font-weight: 700; }

        /* --- RESPONSIVE --- */
        @media (max-width: 900px) {
          .beneficiary-eligibility__intro-note { display: none; }
          .beneficiary-eligibility__directory-header { align-items: flex-start; flex-direction: column; }
          .beneficiary-eligibility__directory-tools { width: 100%; flex-wrap: wrap;}
          .beneficiary-eligibility__member-search { width: auto; flex: 1; }
        }
        @media (max-width: 768px) {
          .beneficiary-eligibility__main { padding: 18px 14px; }
          .beneficiary-eligibility__intro { padding: 22px 18px; border-radius: 16px; }
          .beneficiary-eligibility__intro-copy { align-items: flex-start; gap: 14px; }
          .beneficiary-eligibility__intro-icon { flex-basis: 48px; width: 48px; height: 48px; border-radius: 14px; font-size: 21px; }
          .beneficiary-eligibility__intro h1 { font-size: 25px; }
          .beneficiary-eligibility__fields { grid-template-columns: 1fr; }
          .beneficiary-eligibility__actions { flex-direction: column-reverse; }
          .beneficiary-eligibility__actions .beneficiary-eligibility__reset, .beneficiary-eligibility__actions .beneficiary-eligibility__submit { width: 100%; }
          .beneficiary-eligibility__directory-header { padding: 20px; }
          .beneficiary-eligibility__count { margin-left: auto; }
          .beneficiary-eligibility__directory-error { padding: 0 16px; }
          .beneficiary-eligibility__result { padding: 18px; }
          .beneficiary-eligibility__result-top { flex-wrap: wrap; }
          .beneficiary-eligibility__status { margin-left: 64px; }
          .beneficiary-eligibility__details { grid-template-columns: 1fr; padding: 16px; }
          .tms-pagination { justify-content: center; gap: 10px; padding: 16px 12px; }
          .breadcrumb-link, .breadcrumb-active { font-size: 16px; }
        }
      `}</style>
    </div>
  );
}
