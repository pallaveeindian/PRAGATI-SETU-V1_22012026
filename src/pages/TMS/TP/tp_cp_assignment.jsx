// src/pages/TMS/TP/tp_cp_assignment.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

/* ---------------- TP resolver ---------------- */

const TP_SELF_PARTNER_KEY = "tms_self_partner_id_v1";

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
  if (cached) return Number(cached);

  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });

    const pid = resp?.data?.results?.[0]?.id || null;
    if (pid) localStorage.setItem(TP_SELF_PARTNER_KEY, String(pid));
    return pid;
  } catch (err) {
    console.error("Failed to resolve TP ID", err);
    return null;
  }
}

/* ================= SEARCHABLE SELECT COMPONENT ================= */

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  labelKey,
  valueKey,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const selectedOption = options.find(
    (opt) => String(opt[valueKey]) === String(value),
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    String(opt[labelKey]).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%", marginTop: 6 }}
    >
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          padding: "10px 14px",
          border: isOpen
            ? "2px solid rgba(61, 107, 166, 0.5)"
            : "1px solid #d1d5db",
          borderRadius: 8,
          cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#f3f4f6" : "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? "0 0 0 3px rgba(61, 107, 166, 0.1)" : "none",
        }}
      >
        <span
          style={{
            color: selectedOption ? "#1f2937" : "#9ca3af",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {selectedOption ? selectedOption[labelKey] : placeholder}
        </span>
        <svg
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            minWidth: 16,
          }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div
          className="fade-in"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            zIndex: 9999,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            maxHeight: 280,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #f3f4f6",
              background: "#f9fafb",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
              autoFocus
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                outline: "none",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
            />
          </div>
          <div style={{ overflowY: "auto", padding: "4px" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt[valueKey]}
                  onClick={() => {
                    onChange(opt[valueKey]);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="dropdown-item"
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderRadius: 6,
                    background:
                      String(value) === String(opt[valueKey])
                        ? "#eff6ff"
                        : "transparent",
                    color:
                      String(value) === String(opt[valueKey])
                        ? "#1d4ed8"
                        : "#374151",
                    fontWeight:
                      String(value) === String(opt[valueKey]) ? "600" : "400",
                    transition: "background 0.15s ease",
                  }}
                >
                  {opt[labelKey]}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "16px",
                  color: "#9ca3af",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                No results matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= ASSIGN MODAL ================= */

function AssignModal({
  open,
  onClose,
  onSave,
  initialData,
  contactPersons,
  centres,
  loadingCP,
  loadingCentres,
}) {
  const [form, setForm] = useState({
    contact_person: "",
    allocated_centre: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        contact_person: initialData.contact_person?.id || "",
        allocated_centre: initialData.allocated_centre?.id || "",
      });
    } else {
      setForm({ contact_person: "", allocated_centre: "" });
    }
  }, [initialData]);

  if (!open) return null;

  async function handleSubmit() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div
      className="fade-in"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="scale-up"
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 700, // Increased modal width
          borderRadius: 16,
          padding: "32px 36px", // Generous padding
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          borderTop: "6px solid #3d6ba6",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#1e3a8a",
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            {initialData ? "Edit Assignment" : "Assign Centre to TC ID"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: "24px",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#dc2626")}
            onMouseOut={(e) => (e.target.style.color = "#9ca3af")}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* CONTACT PERSON */}
          <div>
            <label
              style={{
                fontWeight: 600,
                color: "#374151",
                fontSize: "15px",
              }}
            >
              Contact Person (TC)
            </label>

            {loadingCP ? (
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: "#f3f4f6",
                  borderRadius: 8,
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                Loading TC IDs…
              </div>
            ) : (
              <SearchableSelect
                options={contactPersons}
                value={form.contact_person}
                onChange={(val) => setForm({ ...form, contact_person: val })}
                placeholder="Search and Select TC..."
                disabled={saving}
                labelKey="name"
                valueKey="id"
              />
            )}
          </div>

          {/* CENTRE */}
          <div>
            <label
              style={{
                fontWeight: 600,
                color: "#374151",
                fontSize: "15px",
              }}
            >
              Allocated Centre
            </label>

            {loadingCentres ? (
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: "#f3f4f6",
                  borderRadius: 8,
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                Loading centres…
              </div>
            ) : (
              <SearchableSelect
                options={centres}
                value={form.allocated_centre}
                onChange={(val) => setForm({ ...form, allocated_centre: val })}
                placeholder="Search and Select Centre..."
                disabled={saving}
                labelKey="venue_name"
                valueKey="id"
              />
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 10,
            justifyContent: "flex-end",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            className="btn-outline"
            disabled={saving}
            onClick={onClose}
            style={{
              border: "1px solid #d1d5db",
              color: "#4b5563",
              padding: "10px 20px",
              borderRadius: 8,
              background: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </button>

          <button
            className="btnPrimary"
            disabled={saving}
            onClick={handleSubmit}
            style={{
              background: "#3d6ba6",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: 8,
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
              boxShadow: "0 4px 6px -1px rgba(61, 107, 166, 0.4)",
            }}
          >
            {saving ? (
              <>
                <svg
                  className="spinner"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                {initialData ? "Updating…" : "Assigning…"}
              </>
            ) : initialData ? (
              "Update Assignment"
            ) : (
              "Confirm Assignment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function TpCpAssignment() {
  const { user } = useContext(AuthContext);
  const [navCollapsed, setNavCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);

  const [contactPersons, setContactPersons] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loadingCP, setLoadingCP] = useState(false);
  const [loadingCentres, setLoadingCentres] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  async function loadAll() {
    if (!user?.id) return;

    setLoading(true);
    setLoadingCP(true);
    setLoadingCentres(true);

    const role = getCanonicalRole(user || {});
    let currentPartnerId = null;
    let currentDistrictId = null;

    // 1) RESOLVE SCOPE DEPENDING ON ROLE
    if (role === "dtp") {
      try {
        const partnerRes = await TMS_API.parentPartner();
        currentPartnerId = partnerRes?.data?.partner_id;
      } catch (err) {
        console.error("Failed to load parent partner", err);
      }

      try {
        const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
        currentDistrictId =
          geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;
      } catch (err) {
        console.error("Failed to load DTP geoscope", err);
      }
    } else {
      // Fallback for regular Training Partner role
      currentPartnerId = await resolveTrainingPartnerIdForUser(user.id);
    }

    if (!currentPartnerId) {
      setLoading(false);
      setLoadingCP(false);
      setLoadingCentres(false);
      return;
    }

    // 2) CONSTRUCT PARAMS
    const cpParams = { partner: currentPartnerId, page_size: 5000 };
    const centreParams = { partner: currentPartnerId, page_size: 5000 };
    const linkParams = {};

    if (role === "dtp") {
      linkParams.partner = currentPartnerId;
      if (currentDistrictId) {
        cpParams.district_id = currentDistrictId;
        cpParams.created_by = user.id;
        centreParams.district = currentDistrictId;
        linkParams.district_id = currentDistrictId;
      }
    } else {
      // Regular Training Partner only queries their own created assignments
      linkParams.created_by = user.id;
    }

    try {
      const [linksResp, cpResp, centreResp] = await Promise.all([
        TMS_API.tpcpCentreDetails.list(linkParams),
        TMS_API.trainingPartnerContactPersons.list(cpParams),
        TMS_API.trainingPartnerCentres.list(centreParams),
      ]);

      setLinks(linksResp?.data?.results || []);
      setContactPersons(cpResp?.data?.results || []);
      setCentres(centreResp?.data?.results || []);
    } catch (e) {
      console.error("Failed to fetch assignment data", e);
    } finally {
      setLoading(false);
      setLoadingCP(false);
      setLoadingCentres(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  async function handleSave(form) {
    try {
      if (editRow) {
        await TMS_API.tpcpCentreLinks.update(editRow.id, {
          ...form,
          updated_by: user.id,
        });
      } else {
        await TMS_API.tpcpCentreLinks.create({
          ...form,
          created_by: user.id,
        });
      }

      setModalOpen(false);
      setEditRow(null);
      loadAll();
    } catch (e) {
      console.error("Failed to save assignment", e);
      alert("Failed to save assignment. Please check your inputs.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await TMS_API.tpcpCentreLinks.destroy(id);
      loadAll();
    } catch (e) {
      console.error("Failed to delete assignment", e);
      alert("Failed to delete assignment.");
    }
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          <main
            style={{
              padding: 18,
              minHeight: "100vh",
            }}
          >
            <div
              style={{
                maxWidth: 1100,
                margin: "0 auto",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#2b4e72",
                  }}
                >
                  Centre Assignments
                </h2>

                <button
                  className="btn btnPrimary"
                  style={{
                    marginLeft: "auto",
                    background: "#3d6ba6",
                    border: "none",
                    color: "#fff",
                  }}
                  onClick={() => {
                    setEditRow(null);
                    setModalOpen(true);
                  }}
                >
                  + Assign Centre to TC ID
                </button>
              </div>

              {/* TABLE CARD WRAPPER */}
              <div
                className="card"
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: 18,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                  borderLeft: "6px solid #3d6ba6",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table
                    className="table table-compact"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead
                      style={{
                        background: "#f4f8fd",
                      }}
                    >
                      <tr>
                        <th
                          style={{
                            padding: "12px 10px",
                            textAlign: "left",
                            borderBottom: "2px solid #e4ecf5",
                            color: "#475569",
                          }}
                        >
                          S.No
                        </th>
                        <th
                          style={{
                            padding: "12px 10px",
                            textAlign: "left",
                            borderBottom: "2px solid #e4ecf5",
                            color: "#475569",
                          }}
                        >
                          Allocated Centre
                        </th>
                        <th
                          style={{
                            padding: "12px 10px",
                            textAlign: "left",
                            borderBottom: "2px solid #e4ecf5",
                            color: "#475569",
                          }}
                        >
                          Contact Person (TC)
                        </th>
                        <th
                          style={{
                            padding: "12px 10px",
                            textAlign: "left",
                            borderBottom: "2px solid #e4ecf5",
                            color: "#475569",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              padding: "24px 10px",
                              textAlign: "center",
                              color: "#64748b",
                            }}
                          >
                            <div
                              className="spinner"
                              style={{
                                margin: "0 auto 8px",
                                width: 24,
                                height: 24,
                                border: "3px solid #e2e8f0",
                                borderTopColor: "#3d6ba6",
                                borderRadius: "50%",
                              }}
                            ></div>
                            Loading assignments…
                          </td>
                        </tr>
                      ) : links.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              padding: "32px 10px",
                              textAlign: "center",
                              color: "#64748b",
                            }}
                          >
                            No assignments found. Click the button above to
                            create one.
                          </td>
                        </tr>
                      ) : (
                        links.map((l, i) => (
                          <tr
                            key={l.id}
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f8fafc")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <td
                              style={{ padding: "14px 10px", color: "#64748b" }}
                            >
                              {i + 1}
                            </td>

                            <td
                              style={{
                                padding: "14px 10px",
                                color: "#1e3a8a",
                                fontWeight: 600,
                              }}
                            >
                              {l.allocated_centre?.venue_name}
                            </td>

                            <td
                              style={{
                                padding: "14px 10px",
                                color: "#334155",
                                fontWeight: 500,
                              }}
                            >
                              {l.contact_person?.name}
                            </td>

                            <td style={{ padding: "14px 10px" }}>
                              <button
                                className="btn-sm btn-flat"
                                style={{
                                  color: "#3d6ba6",
                                  border: "none",
                                  background: "#f0f5ff",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontWeight: 500,
                                  transition: "all 0.2s",
                                }}
                                onClick={() => {
                                  setEditRow(l);
                                  setModalOpen(true);
                                }}
                              >
                                Edit
                              </button>

                              <button
                                className="btn-sm btnPrimary"
                                style={{
                                  marginLeft: 8,
                                  background: "#ef4444",
                                  border: "none",
                                  color: "#fff",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontWeight: 500,
                                  transition: "all 0.2s",
                                }}
                                onClick={() => handleDelete(l.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <AssignModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRow(null);
        }}
        onSave={handleSave}
        initialData={editRow}
        contactPersons={contactPersons}
        centres={centres}
        loadingCP={loadingCP}
        loadingCentres={loadingCentres}
      />
      <style>{`
        .btnPrimary {
          transition: all .2s ease;
        }
        .btnPrimary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          filter: brightness(1.05);
        }
        .btn-outline:hover:not(:disabled) {
          background: #f9fafb !important;
          border-color: #9ca3af !important;
        }
        .dropdown-item:hover {
          background: #f3f4f6 !important;
        }
        .content-area {
          display: flex;
          flex: 1;
          min-height: 0;
        }
        /* Animations */
        .fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
