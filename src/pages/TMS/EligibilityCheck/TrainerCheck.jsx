import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { TMS_API } from "../../../api/axios";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaTimesCircle,
  FaUserTie,
} from "react-icons/fa";

// Table Row Component (Profile icon removed)
const TrainerRow = React.memo(function TrainerRow({ row, srNo }) {
  return (
    <tr>
     
      <td><strong>{row.id || row.TH_urid || "-"}</strong></td>
      <td><strong>{row.full_name || row.name || "-"}</strong></td>
      <td>{row.designation || "-"}{row.theme_name ? ` - ${row.theme_name}` : ""}</td>
      <td>{row.district_name_en || "-"}</td>
      <td>{row.mobile_no || "-"}</td>
      
    </tr>
  );
});

const TrainerCheck = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- States for the Status Search (Engaged/Available) ---
  const [formData, setFormData] = useState({ trainer_id: '', name: '', mobile_no: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // --- States for Default Master Trainer List (Table) ---
  const [trainersCache, setTrainersCache] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  // Fetch Default List on Mount
  useEffect(() => {
    const fetchTrainersList = async () => {
      setLoadingTable(true);
      try {
        const baseParams = { page_size: 5000 };
        const resp = await TMS_API.masterTrainers.list({ ...baseParams });
        if (resp && resp.data) {
          const dataArray = Array.isArray(resp.data) ? resp.data : (resp.data.results || []);
          setTrainersCache(dataArray);
        }
      } catch (err) {
        console.error("Failed to load full trainers list", err);
      } finally {
        setLoadingTable(false);
      }
    };
    fetchTrainersList();
  }, []);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Check Availability Search
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchParams = Object.fromEntries(
      Object.entries(formData)
        .map(([key, value]) => [
          key,
          key === "name" ? value.trim().replace(/\s+/g, " ") : value.trim(),
        ])
        .filter(([, value]) => value),
    );

    if (Object.keys(searchParams).length === 0) {
      setError("Please enter at least one field (ID, Name, or Mobile).");
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);
    setHasSearched(true);

    try {
      const response = await TMS_API.participantStatus({
        type: "trainer",
        ...searchParams,
      });

      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong! Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Clear Form
  const handleClear = () => {
    setFormData({ trainer_id: "", name: "", mobile_no: "" });
    setSearchResults([]);
    setError("");
    setHasSearched(false);
    setPage(1);
  };

  // Pagination Logic
  const total = trainersCache.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const rows = trainersCache.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  return (
    <div className="app-container trainer-eligibility">
      <Header />
      <div className="d-flex trainer-eligibility__layout">
        <LeftNav />
        <main className="trainer-eligibility__main">
          <div className="trainer-eligibility__content">
            
            {/* Intro Header */}
            <section className="trainer-eligibility__intro">
              <div className="trainer-eligibility__intro-icon">
                <FaUserTie aria-hidden="true" />
              </div>
              <div>
                <p className="trainer-eligibility__eyebrow">TRAINING MANAGEMENT SYSTEM</p>
                <h1>Trainer Availability</h1>
                <p>Check whether a master trainer is available or currently assigned to a batch or request.</p>
              </div>
            </section>

            {/* Search Form */}
            <section className="trainer-eligibility__search">
              <div className="trainer-eligibility__section-heading">
                <div>
                  <h2>Find a trainer</h2>
                  <p>Enter any one detail to check availability.</p>
                </div>
                <span className="trainer-eligibility__hint">At least one field</span>
              </div>

              <form onSubmit={handleSearch}>
                <div className="trainer-eligibility__fields">
                  <label className="trainer-eligibility__field">
                    <span><FaIdCard aria-hidden="true" /> Trainer ID</span>
                    <input
                      type="text"
                      name="trainer_id"
                      placeholder="Enter Trainer ID"
                      value={formData.trainer_id}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="trainer-eligibility__field">
                    <span><FaUserTie aria-hidden="true" /> Trainer name</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="trainer-eligibility__field">
                    <span><FaPhoneAlt aria-hidden="true" /> Mobile number</span>
                    <input
                      type="tel"
                      name="mobile_no"
                      placeholder="Enter 10-digit number"
                      value={formData.mobile_no}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                {error && (
                  <div className="trainer-eligibility__error" role="alert">
                    <FaTimesCircle aria-hidden="true" />
                    {error}
                  </div>
                )}

                <div className="trainer-eligibility__actions">
                  <button
                    type="button"
                    className="trainer-eligibility__reset"
                    onClick={handleClear}
                    disabled={isSearching}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="trainer-eligibility__submit"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="trainer-eligibility__spinner" />
                    ) : (
                      <FaSearch aria-hidden="true" />
                    )}
                    {isSearching ? "Checking..." : "Check availability"}
                  </button>
                </div>
              </form>
            </section>

            {/* Search Results */}
            {hasSearched && !isSearching && !error && searchResults.length === 0 && (
              <section className="trainer-eligibility__empty">
                <FaSearch aria-hidden="true" />
                <h2>No trainers found for this search</h2>
                <p>Try another trainer ID, name, or mobile number.</p>
              </section>
            )}

            {hasSearched && searchResults.length > 0 && (
              <section className="trainer-eligibility__results">
                <div className="trainer-eligibility__results-heading">
                  <div>
                    <p className="trainer-eligibility__eyebrow">SEARCH RESULTS</p>
                    <h2>Trainer status</h2>
                  </div>
                  <span className="trainer-eligibility__hint">{searchResults.length} {searchResults.length === 1 ? "trainer" : "trainers"}</span>
                </div>

                {searchResults.map((item, index) => {
                  const detail = item.engaged_in === "BATCH" ? item.batch_data : item.request_data;
                  const batchDetails = item.engaged_in === "BATCH"
                    ? [...(Array.isArray(item.batch_history) ? item.batch_history : []), ...(item.batch_data ? [item.batch_data] : [])]
                        .filter((batch, batchIndex, batches) => {
                          const batchKey = batch.id ?? batch.batch_id ?? batch.batch_code ?? batch.code;
                          return batchKey == null
                            ? batches.indexOf(batch) === batchIndex
                            : batches.findIndex((candidate) =>
                                (candidate.id ?? candidate.batch_id ?? candidate.batch_code ?? candidate.code) === batchKey,
                              ) === batchIndex;
                        })
                    : [];
                  const detailItems = item.engaged_in === "BATCH"
                    ? [
                        ["Batch code", detail?.batch_code],
                        ["Status", detail?.status],
                        ["Training plan", detail?.training_plan],
                        ["Training partner", detail?.training_partner],
                        ["Duration", [detail?.start_date, detail?.end_date].filter(Boolean).join(" – "), <FaCalendarAlt aria-hidden="true" />],
                        ["Location", detail?.location, <FaMapMarkerAlt aria-hidden="true" />],
                        ["District / Block", [detail?.district, detail?.block].filter(Boolean).join(" / "), <FaMapMarkerAlt aria-hidden="true" />],
                      ]
                    : [
                        ["Request ID", detail?.request_id],
                        ["Status", detail?.status],
                        ["Training plan", detail?.training_plan],
                        ["Training partner", detail?.training_partner],
                        ["Level", detail?.level],
                        ["District / Block", [detail?.district, detail?.block].filter(Boolean).join(" / "), <FaMapMarkerAlt aria-hidden="true" />],
                      ];

                  return (
                    <article className={`trainer-eligibility__result ${item.is_busy ? "is-busy" : "is-free"}`} key={item.trainer_id || item.id || index}>
                      <div className="trainer-eligibility__result-top">
                        <div className="trainer-eligibility__person-icon">
                          <FaUserTie aria-hidden="true" />
                        </div>
                        <div className="trainer-eligibility__person">
                          <h3>{item.trainer_name || "Trainer"}</h3>
                          <span>
                            <FaPhoneAlt aria-hidden="true" />
                            {item.mobile_no || "Mobile number not available"}
                          </span>
                        </div>
                        <span className="trainer-eligibility__status">
                          {item.is_busy ? (
                            <><FaTimesCircle aria-hidden="true" /> Engaged</>
                          ) : (
                            <><FaCheckCircle aria-hidden="true" /> Available</>
                          )}
                        </span>
                      </div>

                      <p className="trainer-eligibility__message">
                        {item.message ||
                          (item.is_busy
                            ? `Currently assigned to a ${item.engaged_in === "BATCH" ? "training batch" : "training request"}.`
                            : "This trainer is available for assignment.")}
                      </p>

                      {item.is_busy && item.engaged_in === "BATCH" && batchDetails.length > 0 ? (
                        <div className="trainer-eligibility__batch-list">
                          <div className="trainer-eligibility__batch-list-heading">
                            <h4>Assigned batches</h4>
                            <span>{item.batch_count ?? batchDetails.length} total</span>
                          </div>
                          {batchDetails.map((batch, batchIndex) => {
                            const venueDetails = batch.centre_details || {};
                            const batchItems = [
                              ["Batch code", batch.batch_code || batch.code],
                              ["Status", batch.status],
                              ["Training plan", batch.training_plan],
                              ["Training plan ID", batch.training_plan_id],
                              ["Training partner", batch.training_partner],
                              ["Level", batch.level],
                              ["Participant type", batch.participant_type],
                              ["Batch type", batch.batch_type],
                              ["Financial year", batch.financial_year],
                              ["Duration", [batch.start_date, batch.end_date].filter(Boolean).join(" – "), <FaCalendarAlt aria-hidden="true" />],
                              ["Location", batch.location || venueDetails.venue_name, <FaMapMarkerAlt aria-hidden="true" />],
                              ["Venue", venueDetails.venue_name],
                              ["Venue address", venueDetails.venue_address, <FaMapMarkerAlt aria-hidden="true" />],
                              ["District / Block", [batch.district, batch.block].filter(Boolean).join(" / "), <FaMapMarkerAlt aria-hidden="true" />],
                              ["Beneficiaries", Array.isArray(batch.beneficiary) ? batch.beneficiary.length : null],
                            ];

                            return (
                              <div
                                className="trainer-eligibility__batch"
                                key={batch.id || batch.batch_id || batch.batch_code || batch.code || batchIndex}
                              >
                                <h5>Batch {batchIndex + 1}</h5>
                                <div className="trainer-eligibility__details">
                                  {batchItems.map(([label, value, icon]) => (
                                    <div className="trainer-eligibility__detail" key={label}>
                                      <span>{icon || <FaIdCard aria-hidden="true" />}{label}</span>
                                      <strong>{value || "—"}</strong>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : item.is_busy && item.engaged_in !== "BATCH" && detail ? (
                        <div className="trainer-eligibility__details">
                          {detailItems.map(([label, value, icon]) => (
                            <div className="trainer-eligibility__detail" key={label}>
                              <span>{icon || <FaIdCard aria-hidden="true" />}{label}</span>
                              <strong>{value || "—"}</strong>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </section>
            )}

            {/* Default Master List Table */}
            {!hasSearched && (
              <section className="trainer-eligibility__search" style={{ marginTop: 24, padding: 0, overflow: 'hidden' }}>
                <div className="trainer-eligibility__results-heading" style={{ padding: '24px 24px 16px' }}>
                  <div>
                    <p className="trainer-eligibility__eyebrow">DIRECTORY</p>
                    <h2 style={{ fontSize: '22px' }}>All Master Trainers</h2>
                  </div>
                  {loadingTable ? (
                    <span className="trainer-eligibility__hint">Loading Data...</span>
                  ) : (
                    <span className="trainer-eligibility__hint" style={{ fontSize: '14px', padding: '8px 14px' }}>Total: {total}</span>
                  )}
                </div>

                {loadingTable ? (
                   <div style={{ padding: '60px', textAlign: 'center' }}>
                     <div className="trainer-eligibility__spinner" style={{ margin: "0 auto", borderColor: "rgba(11, 61, 130, 0.2)", borderTopColor: "#0b3d82", width: 40, height: 40, borderWidth: 4 }} />
                   </div>
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table className="tms-table">
                        <thead>
                          <tr>
                           
                            <th>Trainer ID</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>District</th>
                            <th>Mobile</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r, index) => {
                            const serialNumber = (pageSafe - 1) * PAGE_SIZE + index + 1;
                            return (
                              <TrainerRow 
                                key={r.id || Math.random()} 
                                row={r} 
                                srNo={serialNumber} 
                              />
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div className="tms-pagination">
                        <button
                          className="trainer-eligibility__reset"
                          disabled={pageSafe <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          Prev
                        </button>
                        <span className="pagination-info">
                          Page <strong>{pageSafe}</strong> of {totalPages}
                        </span>
                        <button
                          className="trainer-eligibility__reset"
                          disabled={pageSafe >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
        .trainer-eligibility__layout {
          display: flex;
          align-items: flex-start;
          min-height: calc(100vh - 120px);
          background: #ffffff; /* Gray background removed */
        }
        .trainer-eligibility__main {
          flex: 1;
          min-width: 0;
          padding: clamp(18px, 2.5vw, 28px) clamp(22px, 4vw, 40px);
          background: #ffffff; /* Gradient and gray removed */
        }
        .trainer-eligibility__content { 
          width: 100%; 
          max-width: 100%;
          margin: 0 auto; 
        }
        
        /* --- HEADERS & INTRO --- */
        .trainer-eligibility__intro { display: flex; align-items: center; gap: 20px; margin-bottom: 26px; }
        .trainer-eligibility__intro-icon {
          display: grid; flex: 0 0 64px; width: 64px; height: 64px; place-items: center;
          border-radius: 18px; background: linear-gradient(145deg, #0b3d82, #1686ce);
          box-shadow: 0 10px 22px rgba(11, 61, 130, .2); color: white; font-size: 27px;
        }
        .trainer-eligibility__eyebrow { margin: 0 0 5px; color: #52739b; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .trainer-eligibility__intro h1 { margin: 0; color: #172b49; font-size: clamp(25px, 3vw, 34px); font-weight: 750; letter-spacing: -.035em; }
        .trainer-eligibility__intro p:last-child { margin: 6px 0 0; color: #64748b; font-size: 14px; }
        
        /* --- CARDS & SEARCH AREA --- */
        .trainer-eligibility__search, .trainer-eligibility__empty, .trainer-eligibility__result {
          border: 1px solid #e2e9f2; border-radius: 16px; background: #fff; 
          box-shadow: 0 4px 20px rgba(28, 55, 90, .04);
          transition: box-shadow 0.2s ease;
        }
        .trainer-eligibility__search:hover { box-shadow: 0 8px 28px rgba(28, 55, 90, .08); }
        .trainer-eligibility__search { padding: clamp(20px, 3vw, 30px); }
        
        .trainer-eligibility__section-heading, .trainer-eligibility__results-heading {
          display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 22px;
        }
        .trainer-eligibility__section-heading h2, .trainer-eligibility__results-heading h2 { margin: 0; color: #1b2f4b; font-size: 20px; font-weight: 700; }
        .trainer-eligibility__section-heading p { margin: 5px 0 0; color: #718096; font-size: 14px; }
        .trainer-eligibility__hint, .trainer-eligibility__results-heading > span {
          padding: 7px 11px; border-radius: 999px; background: #edf4fc; color: #315f92; font-size: 12px; font-weight: 650; white-space: nowrap;
        }
        
        /* --- FORM FIELDS --- */
        .trainer-eligibility__fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .trainer-eligibility__field { display: flex; flex-direction: column; gap: 8px; color: #34445b; font-size: 13px; font-weight: 650; }
        .trainer-eligibility__field > span { display: flex; align-items: center; gap: 8px; }
        .trainer-eligibility__field > span svg { color: #3978b9; }
        .trainer-eligibility__field input {
          width: 100%; min-height: 48px; padding: 0 16px; border: 1.5px solid #d8e1ed; border-radius: 10px; outline: none; background: #fbfcfe; color: #1d2d43; font-size: 15px; transition: all .2s ease;
        }
        .trainer-eligibility__field input:focus { border-color: #4386c8; background: #fff; box-shadow: 0 0 0 4px rgba(67, 134, 200, .1); }
        
        /* --- BUTTONS --- */
        .trainer-eligibility__actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 28px; }
        .trainer-eligibility__reset, .trainer-eligibility__submit {
          display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 9px; padding: 0 24px; border: 0; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700; transition: all .2s ease;
        }
        .trainer-eligibility__reset { border: 1.5px solid #d8e1ed; background: #fff; color: #53657c; }
        .trainer-eligibility__submit { background: linear-gradient(110deg, #0b3d82, #087bbd); box-shadow: 0 6px 16px rgba(11, 61, 130, .2); color: #fff; }
        .trainer-eligibility__submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(11, 61, 130, .3); }
        .trainer-eligibility__reset:hover:not(:disabled) { background: #f0f4f8; border-color: #c0cddf; }
        .trainer-eligibility__submit:disabled, .trainer-eligibility__reset:disabled { cursor: not-allowed; opacity: .6; transform: none; box-shadow: none; }
        
        .trainer-eligibility__spinner {
          width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: white; border-radius: 50%; animation: trainer-spin .7s linear infinite;
        }
        @keyframes trainer-spin { to { transform: rotate(360deg); } }
        
        .trainer-eligibility__error { display: flex; align-items: center; gap: 9px; margin-top: 20px; padding: 12px 16px; border: 1px solid #f2caca; border-radius: 10px; background: #fff5f5; color: #a33232; font-size: 14px; }
        
        /* --- SEARCH RESULTS CARDS --- */
        .trainer-eligibility__results { margin-top: 30px; }
        .trainer-eligibility__results-heading { margin-bottom: 16px; }
        .trainer-eligibility__result { margin-bottom: 16px; padding: 24px; border-left: 5px solid #25a36f; }
        .trainer-eligibility__result.is-busy { border-left-color: #e39a35; }
        .trainer-eligibility__result-top { display: flex; align-items: center; gap: 16px; }
        .trainer-eligibility__person-icon { display: grid; flex: 0 0 48px; width: 48px; height: 48px; place-items: center; border-radius: 14px; background: #edf4fc; color: #2466a5; font-size: 22px; }
        .trainer-eligibility__person { min-width: 0; flex: 1; }
        .trainer-eligibility__person h3 { margin: 0 0 6px; color: #1b2f4b; font-size: 18px; font-weight: 700; }
        .trainer-eligibility__person > span { display: inline-flex; align-items: center; gap: 6px; color: #64748b; font-size: 13px; font-weight: 500; }
        .trainer-eligibility__status { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #e9f7ef; color: #218153; font-size: 13px; font-weight: 750; white-space: nowrap; }
        .is-busy .trainer-eligibility__status { background: #fff3df; color: #a86a12; }
        .trainer-eligibility__message { margin: 20px 0 0; color: #53657c; font-size: 14px; line-height: 1.6; }
        .trainer-eligibility__batch-list { display: grid; gap: 14px; margin-top: 20px; }
        .trainer-eligibility__batch-list-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .trainer-eligibility__batch-list-heading h4 { margin: 0; color: #1b2f4b; font-size: 16px; font-weight: 700; }
        .trainer-eligibility__batch-list-heading span { color: #64748b; font-size: 13px; font-weight: 600; }
        .trainer-eligibility__batch { padding: 16px; border: 1px solid #e7edf5; border-radius: 12px; background: #fff; }
        .trainer-eligibility__batch h5 { margin: 0; color: #315f92; font-size: 14px; font-weight: 700; }
        .trainer-eligibility__details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; padding: 20px; border: 1px solid #e7edf5; border-radius: 12px; background: #f8fafd; }
        .trainer-eligibility__batch .trainer-eligibility__details { margin-top: 12px; }
        .trainer-eligibility__detail > span { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: #75849a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .trainer-eligibility__detail > span svg { color: #4c82b4; }
        .trainer-eligibility__detail strong { display: block; overflow-wrap: anywhere; color: #1e293b; font-size: 14px; font-weight: 600; }
        
        .trainer-eligibility__empty { margin-top: 24px; padding: 40px 20px; text-align: center; }
        .trainer-eligibility__empty > svg { color: #7b9bbd; font-size: 32px; margin-bottom: 10px; }
        .trainer-eligibility__empty h2 { margin: 12px 0 8px; color: #1e293b; font-size: 18px; }
        .trainer-eligibility__empty p { margin: 0; color: #64748b; font-size: 14px; }

        /* --- POLISHED FULL WIDTH TABLE --- */
        .table-wrapper { width: 100%; overflow-x: auto; border-top: 1px solid #edf2f7; }
        .tms-table { width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; }
        .tms-table th { 
          background: #f8fafd; padding: 18px 16px; font-size: 12px; color: #52739b; 
          font-weight: 750; text-transform: uppercase; letter-spacing: 0.05em; 
          border-bottom: 2px solid #e2e8f0; white-space: nowrap;
        }
        .tms-table td { 
          padding: 16px; font-size: 14px; color: #334155; 
          border-bottom: 1px solid #f1f5f9; vertical-align: middle; 
        }
        .tms-table tr { transition: background-color 0.15s ease; }
        .tms-table tr:hover td { background: #f8fafc; }
        .tms-table tr:last-child td { border-bottom: none; }
        
        .trainer-status-badge { 
          padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 650; 
          background: #f1f5f9; color: #64748b; display: inline-block; text-align: center;
        }
        .trainer-status-badge.active { background: #ecfdf5; color: #10b981; }
        
        /* --- PAGINATION --- */
        .tms-pagination { 
          display: flex; align-items: center; justify-content: flex-end; gap: 16px; 
          padding: 20px 24px; background: #fff; border-top: 1px solid #e2e8f0; 
          border-radius: 0 0 16px 16px;
        }
        .pagination-info { font-size: 14px; color: #64748b; }
        .pagination-info strong { color: #0f172a; font-weight: 700; }

        @media (max-width: 1024px) {
          .trainer-eligibility__fields { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .trainer-eligibility__fields { grid-template-columns: 1fr; }
          .trainer-eligibility__actions { flex-direction: column-reverse; }
          .trainer-eligibility__reset, .trainer-eligibility__submit { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TrainerCheck;