// src/pages/TMS/TP_CP/cp_dashboard.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import TmsLeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";

/* ---------------- cache keys ---------------- */

const CP_ROOT_CACHE_KEY = "tms_cp_dashboard_cache_v1";
const CP_CENTRE_CACHE_KEY = "tms_cp_centre_cache_v1";
const CP_BATCHES_CACHE_KEY = "tms_cp_batches_cache_v1";

/* ---------------- helpers ---------------- */

function normalizeMediaUrl(url) {
  if (!url) return "";

  // If the URL already starts with a relative path like /media/, it's perfect.
  if (url.startsWith("/media/")) {
    return url;
  }

  // If it's an absolute URL (http:// or https://), strip the domain completely
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname; // Extracts ONLY the path (e.g., "/media/uploads/file.jpg")
    } catch (error) {
      console.warn("Invalid media URL:", url);
      return url;
    }
  }

  // Fallback for any weird edge cases
  return url;
}

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveJson(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), payload }));
  } catch {}
}

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

/* ================= IMAGE LIGHTBOX ================= */

function ImageLightbox({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={src}
        alt="Preview"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: 6,
        }}
      />
    </div>
  );
}

/* ================= VIEW MODAL ================= */

function CentreViewModal({ open, data, onClose }) {
  const [zoomImg, setZoomImg] = useState(null);
  const printRef = useRef();

  if (!open || !data) return null;

  const {
    venue_name,
    serial_number,
    centre_type,
    venue_address,
    district,
    block,
    panchayat,
    village,
    security_arrangements,
    toilets_bathrooms,
    power_water_facility,
    medical_kit,
    open_space,
    field_visit_facility,
    transport_facility,
    dining_facility,
    other_details,
    training_hall_count,
    training_hall_capacity,
    rooms = [],
    submissions = [],
  } = data;

  function handlePrint() {
    const printContents = printRef.current.innerHTML;
    const w = window.open("", "", "width=1000,height=800");
    w.document.write(`
      <html>
        <head>
          <title>Centre Details</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            td, th { border: 1px solid #ccc; padding: 8px; }
            h2, h3 { margin-top: 24px; }
            img { max-width: 180px; margin: 6px; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
  }
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  };

  const labelCell = {
    padding: "8px",
    background: "#e4ecf5", // UPDATED UI
    fontWeight: 600,
    width: 220,
  };

  const valueCell = {
    padding: "8px",
    borderBottom: "1px solid #eee",
  };

  const thStyle = {
    padding: "8px",
    textAlign: "left",
  };
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          overflow: "auto",
          padding: 20, // UPDATED UI
        }}
      >
        <div
          style={{
            background: "#fff",
            maxWidth: 1000,
            margin: "20px auto", // UPDATED UI
            borderRadius: 12, // UPDATED UI
            padding: 24, // UPDATED UI
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)", // UPDATED UI
            borderTop: "5px solid #3d6ba6", // UPDATED UI
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center", // UPDATED UI
              marginBottom: 16, // UPDATED UI
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#2b4e72", // UPDATED UI
              }}
            >
              {venue_name}
            </h2>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-outline"
                style={{
                  border: "1px solid #3d6ba6", // UPDATED UI
                  color: "#3d6ba6",
                  borderRadius: 6,
                  padding: "6px 12px",
                }}
                onClick={handlePrint}
              >
                🖨 Print / Save PDF
              </button>

              <button
                className="btn-outline"
                style={{
                  border: "1px solid #5a8cc2", // UPDATED UI
                  color: "#5a8cc2",
                  borderRadius: 6,
                  padding: "6px 12px",
                }}
                onClick={onClose}
              >
                Back
              </button>
            </div>
          </div>

          <div ref={printRef}>
            {/* BASIC INFORMATION */}

            <h3
              style={{
                color: "#2b4e72", // UPDATED UI
                borderBottom: "2px solid #a7c6ed", // UPDATED UI
                paddingBottom: 6,
              }}
            >
              Basic Information
            </h3>

            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={labelCell}>Serial Number</td>
                  <td style={valueCell}>{serial_number}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Centre Type</td>
                  <td style={valueCell}>{centre_type}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Address</td>
                  <td style={valueCell}>{venue_address}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Location</td>
                  <td style={valueCell}>
                    {district?.district_name_en} / {block?.block_name_en}
                    <br />
                    {panchayat?.panchayat_name_en} /{" "}
                    {village?.village_name_english}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* FACILITIES */}

            <h3
              style={{
                color: "#2b4e72",
                borderBottom: "2px solid #a7c6ed",
                paddingBottom: 6,
              }}
            >
              Facilities
            </h3>

            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={labelCell}>Security</td>
                  <td style={valueCell}>{security_arrangements}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Toilets</td>
                  <td style={valueCell}>{toilets_bathrooms}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Power & Water</td>
                  <td style={valueCell}>{power_water_facility}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Medical Kit</td>
                  <td style={valueCell}>{medical_kit ? "Yes" : "No"}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Open Space</td>
                  <td style={valueCell}>{open_space ? "Yes" : "No"}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Field Visit</td>
                  <td style={valueCell}>
                    {field_visit_facility ? "Yes" : "No"}
                  </td>
                </tr>

                <tr>
                  <td style={labelCell}>Transport</td>
                  <td style={valueCell}>{transport_facility ? "Yes" : "No"}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Dining</td>
                  <td style={valueCell}>{dining_facility ? "Yes" : "No"}</td>
                </tr>

                <tr>
                  <td style={labelCell}>Other</td>
                  <td style={valueCell}>{other_details || "-"}</td>
                </tr>
              </tbody>
            </table>

            {/* TRAINING HALLS */}

            <h3
              style={{
                color: "#2b4e72",
                borderBottom: "2px solid #a7c6ed",
                paddingBottom: 6,
              }}
            >
              Training Halls
            </h3>

            <table style={tableStyle}>
              <thead
                style={{
                  background: "#a7c6ed", // UPDATED UI
                  color: "#2b4e72",
                }}
              >
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Capacity</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td style={valueCell}>{r.room_name}</td>
                    <td style={valueCell}>{r.room_capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MEDIA */}

            <h3
              style={{
                color: "#2b4e72",
                borderBottom: "2px solid #a7c6ed",
                paddingBottom: 6,
              }}
            >
              Media
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16, // UPDATED UI
              }}
            >
              {submissions.map((m) => {
                const src = normalizeMediaUrl(m.file);

                return (
                  <div
                    key={m.id}
                    style={{
                      textAlign: "center",
                      padding: 10, // UPDATED UI
                      border: "1px solid #e4ecf5", // UPDATED UI
                      borderRadius: 8, // UPDATED UI
                      background: "#f8fbff", // UPDATED UI
                    }}
                  >
                    <img
                      src={src}
                      alt={m.category}
                      style={{
                        height: 100,
                        cursor: "pointer",
                        borderRadius: 6, // UPDATED UI
                      }}
                      onClick={() => setZoomImg(src)}
                    />

                    <div
                      style={{
                        fontSize: 12,
                        marginTop: 6,
                        color: "#2b4e72",
                      }}
                    >
                      {m.category}
                    </div>

                    <button
                      style={{
                        marginTop: 6,
                        border: "1px solid #3d6ba6", // UPDATED UI
                        color: "#3d6ba6",
                        background: "#fff",
                        borderRadius: 4,
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                      onClick={async () => {
                        try {
                          const response = await api.get(
                            `/tms/submissions/${m.id}/download/`,
                            { responseType: "blob" },
                          );

                          const disposition =
                            response.headers["content-disposition"];
                          let filename = "download";

                          if (disposition) {
                            const match = disposition.match(/filename="(.+)"/);
                            if (match?.[1]) filename = match[1];
                          }

                          const blob = new Blob([response.data]);
                          const url = window.URL.createObjectURL(blob);

                          const link = document.createElement("a");
                          link.href = url;
                          link.download = filename;

                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Download failed", err);
                        }
                      }}
                    >
                      Download existing file
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox src={zoomImg} onClose={() => setZoomImg(null)} />
    </>
  );
}

/* ================= MAIN DASHBOARD ================= */

export default function CpDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loadingCentreChain, setLoadingCentreChain] = useState(false);
  const [cpRecord, setCpRecord] = useState(null);
  const [centreLink, setCentreLink] = useState(null);
  const [centre, setCentre] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  // load root cache (CP + link + centreId)
  useEffect(() => {
    if (!user?.id) return;
    fetchCentreChain();
  }, [user?.id]);

  async function fetchCentreChain() {
    if (!user?.id) return;

    setLoadingCentreChain(true);
    try {
      // 1) Contact Person
      const cpResp = await api.get(
        `/tms/training-partner-contact-persons/?master_user=${user.id}`,
      );
      const cp = cpResp?.data?.results?.[0] || null;
      setCpRecord(cp);

      if (!cp) {
        setCentreLink(null);
        setCentre(null);
        setBatches([]);
        return;
      }

      // 2) Centre Link
      const linkResp = await TMS_API.tpcpCentreLinks.list({
        contact_person: cp.id,
      });
      const link = linkResp?.data?.results?.[0] || null;
      setCentreLink(link);

      // 3) Centre Details
      if (link?.allocated_centre) {
        const centreResp = await api.get(
          `/tms/training-partner-centres/${link.allocated_centre}/detail/`,
        );
        setCentre(centreResp?.data || null);
      } else {
        setCentre(null);
        setBatches([]);
      }
    } catch (e) {
      console.error("CP centre chain load failed", e);
      setCentre(null);
      setCentreLink(null);
    } finally {
      setLoadingCentreChain(false);
    }
  }

  async function handleRefreshCentre() {
    setCpRecord(null);
    setCentreLink(null);
    setCentre(null);
    setBatches([]);
    fetchCentreChain();
  }

  async function handleViewCentre() {
    if (!centre?.id) return;
    setViewLoading(true);
    try {
      const resp = await api.get(
        `/tms/training-partner-centres/${centre.id}/detail/`,
      );
      setViewData(resp.data);
      setViewOpen(true);
    } catch (e) {
      console.error("cp view centre failed", e);
    } finally {
      setViewLoading(false);
    }
  }

  async function fetchBatches() {
    if (!centre?.id) return;

    setBatchesLoading(true);
    try {
      const resp = await TMS_API.batches.list({
        centre: centre.id,
        page_size: 500,
      });
      setBatches(resp?.data?.results || []);
    } catch (e) {
      console.error("cp batches fetch failed", e);
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }

  useEffect(() => {
    if (centre?.id) {
      fetchBatches(false);
    }
  }, [centre?.id]);

  const hasCentre = !!centre;
  const cpName =
    cpRecord?.name || user?.first_name || user?.username || "Contact Person";

  // ONLY SCHEDULED and ONGOING batches for dashboard table
  const visibleBatches = useMemo(
    () =>
      batches.filter((b) => {
        const status = (b.status || "").toUpperCase();
        return status === "SCHEDULED" || status === "ONGOING";
      }),
    [batches],
  );

  const ongoingBatches = useMemo(
    () =>
      visibleBatches.filter(
        (b) => (b.status || "").toUpperCase() === "ONGOING",
      ),
    [visibleBatches],
  );

  return (
    <div className="app-shell">
      <TmsLeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />
      <div className="main-area">
        {/* <TopNav /> */}
        <main
          style={{
            padding: 20, // UPDATED UI
            minHeight: "100vh", // UPDATED UI
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* PAGE TITLE */}
            <h2
              style={{
                marginTop: 8,
                color: "#2b4e72", // UPDATED UI
                fontWeight: 700, // UPDATED UI
              }}
            >
              Welcome, {cpName}
            </h2>

            <div
              className="muted"
              style={{
                marginBottom: 20,
                color: "#5a8cc2", // UPDATED UI
              }}
            >
              Centre-level coordination for batches, logistics, attendance and
              media.
            </div>

            {/* ======================= */}
            {/* MY CENTRE SECTION */}
            {/* ======================= */}

            <div
              className="card"
              style={{
                marginBottom: 22,
                padding: 20, // UPDATED UI
                borderRadius: 12, // UPDATED UI
                background: "#fff", // UPDATED UI
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)", // UPDATED UI
                borderTop: "4px solid #3d6ba6", // UPDATED UI accent
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#2b4e72", // UPDATED UI
                  }}
                >
                  My Centre
                </h3>

                <button
                  className="btn btnPrimary"
                  style={{
                    marginLeft: "auto",
                    background: "#3d6ba6", // UPDATED UI
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                  }}
                  onClick={handleRefreshCentre}
                  disabled={loadingCentreChain}
                >
                  {loadingCentreChain ? "Refreshing…" : "Refresh"}
                </button>
              </div>

              {loadingCentreChain ? (
                <div className="table-spinner">
                  Loading your contact person and centre mapping…
                </div>
              ) : !cpRecord ? (
                <div className="muted">
                  No Contact Person mapping found for this user.
                </div>
              ) : !centreLink || !hasCentre ? (
                <div className="muted">
                  No centre is currently linked to your Contact Person profile.
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Centre Name:</strong> {centre.venue_name}
                  </div>

                  <div style={{ marginBottom: 6 }}>
                    <strong>Address:</strong> {centre.venue_address}
                  </div>

                  <div style={{ marginBottom: 6 }}>
                    <strong>Type:</strong> {centre.centre_type}
                    &nbsp;|&nbsp;
                    <strong>Halls:</strong> {centre.training_hall_count}
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <button
                      className="btn btnPrimary"
                      style={{
                        background: "#5a8cc2", // UPDATED UI
                        color: "#fff",
                        borderRadius: 6,
                        border: "none",
                      }}
                      onClick={handleViewCentre}
                      disabled={viewLoading}
                    >
                      {viewLoading ? "Opening…" : "View Centre Details"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ======================= */}
            {/* BATCH SCHEDULES */}
            {/* ======================= */}

            <div
              className="card"
              style={{
                padding: 20,
                borderRadius: 12, // UPDATED UI
                marginBottom: 20,
                background: "#fff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)", // UPDATED UI
                borderTop: "4px solid #5a8cc2", // UPDATED UI
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#2b4e72", // UPDATED UI
                  }}
                >
                  Batch Schedules for My Centre
                </h3>

                <button
                  className="btn btnPrimary"
                  style={{
                    marginLeft: "auto",
                    background: "#3d6ba6", // UPDATED UI
                    color: "#fff",
                    borderRadius: 6,
                    border: "none",
                  }}
                  onClick={() => {
                    try {
                      localStorage.removeItem(CP_BATCHES_CACHE_KEY);
                    } catch {}
                    fetchBatches(true);
                  }}
                  disabled={batchesLoading || !hasCentre}
                >
                  {batchesLoading ? "Refreshing…" : "Refresh"}
                </button>
              </div>

              <div
                className="muted"
                style={{
                  marginBottom: 10,
                  color: "#5a8cc2", // UPDATED UI
                }}
              >
                Upcoming and ongoing batches scheduled at your centre.
              </div>

              {!hasCentre ? (
                <div className="muted">
                  Link a centre to your Contact Person profile to see batches.
                </div>
              ) : batchesLoading ? (
                <div className="table-spinner">
                  Loading batches for your centre…
                </div>
              ) : visibleBatches.length === 0 ? (
                <div className="muted">
                  No scheduled or ongoing batches found for this centre.
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: 420,
                    overflow: "auto",
                    border: "1px solid #d6e3f5", // UPDATED UI
                    borderRadius: 8,
                  }}
                >
                  <table className="table table-compact">
                    <thead
                      style={{
                        background: "#a7c6ed", // UPDATED UI table header
                        color: "#2b4e72",
                      }}
                    >
                      <tr>
                        <th>S.No.</th>
                        <th>Batch Code</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Type</th>
                        <th>Participants</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleBatches.map((b, idx) => (
                        <tr key={b.id}>
                          <td>{idx + 1}</td>
                          <td>{b.code}</td>
                          <td>{b.status}</td>
                          <td>{fmtDate(b.start_date)}</td>
                          <td>{fmtDate(b.end_date)}</td>
                          <td>{b.batch_type}</td>

                          <td>
                            {Array.isArray(b.beneficiary)
                              ? b.beneficiary.length
                              : "-"}
                          </td>

                          <td>
                            <button
                              className="btn-sm btn-flat"
                              style={{
                                color: "#3d6ba6", // UPDATED UI
                                fontWeight: 600,
                              }}
                              onClick={() =>
                                navigate(`/tms/cp/batch-detail/${b.id}`)
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {ongoingBatches.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 8,
                    background: "#e4ecf5", // UPDATED UI
                    border: "1px solid #a7c6ed", // UPDATED UI
                    fontSize: 13,
                    color: "#2b4e72",
                  }}
                >
                  <strong>Note:</strong> You have {ongoingBatches.length}{" "}
                  ongoing batch(es). Use the View Button to start attendance and
                  eKYC verification.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <CentreViewModal
        open={viewOpen}
        data={viewData || centre}
        onClose={() => setViewOpen(false)}
      />
      <style>{`.btnPrimary{
  background:#3d6ba6;
  color:#fff;
  border:none;
  border-radius:6px;
  padding:6px 14px;
  cursor:pointer;
  transition:all .25s ease;
}

.btnPrimary:hover{
  transform:translateY(-3px);
  box-shadow:0 6px 12px rgba(0,0,0,0.15);
}


`}</style>
    </div>
  );
}
