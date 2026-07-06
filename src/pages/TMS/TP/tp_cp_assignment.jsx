// src/pages/TMS/TP/tp_cp_assignment.jsx
import React, { useContext, useEffect, useState } from "react";
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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 520,
          borderRadius: 12,
          padding: 22,
          boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
          borderTop: "5px solid #3d6ba6",
        }}
      >
        {/* HEADER */}
        <h3
          style={{
            marginTop: 0,
            marginBottom: 16,
            color: "#2b4e72",
          }}
        >
          {initialData ? "Edit Assignment" : "Assign Centre to TC ID"}
        </h3>

        {/* CONTACT PERSON */}
        <label
          style={{
            fontWeight: 600,
            color: "#2b4e72",
          }}
        >
          TC
        </label>

        {loadingCP ? (
          <p style={{ fontSize: 13, color: "#5a8cc2" }}>Loading TC IDs…</p>
        ) : (
          <select
            className="input"
            disabled={saving}
            value={form.contact_person}
            onChange={(e) =>
              setForm({ ...form, contact_person: e.target.value })
            }
            style={{
              marginTop: 6,
              width: "100%",
            }}
          >
            <option value="">Select TC ID</option>
            {contactPersons.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {cp.name}
              </option>
            ))}
          </select>
        )}

        {/* CENTRE */}
        <label
          style={{
            marginTop: 14,
            display: "block",
            fontWeight: 600,
            color: "#2b4e72",
          }}
        >
          Centre
        </label>

        {loadingCentres ? (
          <p style={{ fontSize: 13, color: "#5a8cc2" }}>Loading centres…</p>
        ) : (
          <select
            className="input"
            disabled={saving}
            value={form.allocated_centre}
            onChange={(e) =>
              setForm({ ...form, allocated_centre: e.target.value })
            }
            style={{
              marginTop: 6,
              width: "100%",
            }}
          >
            <option value="">Select Centre</option>
            {centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.venue_name}
              </option>
            ))}
          </select>
        )}

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn"
            disabled={saving}
            onClick={handleSubmit}
            style={{
              background: "#3d6ba6",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving
              ? initialData
                ? "Updating…"
                : "Assigning…"
              : initialData
                ? "Update"
                : "Assign"}
          </button>

          <button
            className="btn-outline"
            disabled={saving}
            onClick={onClose}
            style={{
              border: "1px solid #3d6ba6",
              color: "#3d6ba6",
              padding: "8px 16px",
              borderRadius: 6,
              background: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Cancel
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
    const cpParams = { partner: currentPartnerId };
    const centreParams = { partner: currentPartnerId };
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
                            padding: "10px",
                            textAlign: "left",
                            borderBottom: "1px solid #e4ecf5",
                          }}
                        >
                          S.No
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            borderBottom: "1px solid #e4ecf5",
                          }}
                        >
                          Centre
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            borderBottom: "1px solid #e4ecf5",
                          }}
                        >
                          TC
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            borderBottom: "1px solid #e4ecf5",
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
                              padding: "10px",
                              textAlign: "center",
                              color: "#64748b",
                            }}
                          >
                            Loading assignments…
                          </td>
                        </tr>
                      ) : links.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              color: "#64748b",
                            }}
                          >
                            No assignments found
                          </td>
                        </tr>
                      ) : (
                        links.map((l, i) => (
                          <tr
                            key={l.id}
                            style={{
                              borderBottom: "1px solid #e4ecf5",
                            }}
                          >
                            <td style={{ padding: "10px" }}>{i + 1}</td>

                            <td
                              style={{
                                padding: "10px",
                                color: "#3d6ba6",
                                fontWeight: 500,
                              }}
                            >
                              {l.allocated_centre?.venue_name}
                            </td>

                            <td style={{ padding: "10px" }}>
                              {l.contact_person?.name}
                            </td>

                            <td style={{ padding: "10px" }}>
                              <button
                                className="btn-sm btn-flat"
                                style={{
                                  color: "#3d6ba6",
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
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
                                  background: "#2b4e72",
                                  border: "none",
                                  color: "#fff",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
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
.content-area {
  display: flex;
  flex: 1;
  min-height: 0;
}
.input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
}
.input:focus {
  border-color: #3d6ba6;
  box-shadow: 0 0 0 2px rgba(61, 107, 166, 0.2);
}
`}</style>
    </div>
  );
}
