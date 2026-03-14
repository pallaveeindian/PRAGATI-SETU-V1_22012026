// src/pages/TMS/TP/tp_cp_assignment.jsx
import React, { useContext, useEffect, useState } from "react";
// import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";

/* ---------------- TP resolver ---------------- */

const TP_SELF_PARTNER_KEY = "tms_self_partner_id_v1";

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
  if (cached) return Number(cached);

  const resp = await TMS_API.trainingPartners.list({
    search: userId,
    fields: "id",
  });

  const pid = resp?.data?.results?.[0]?.id || null;
  if (pid) localStorage.setItem(TP_SELF_PARTNER_KEY, String(pid));
  return pid;
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
        display: "flex", // UPDATED UI: center modal vertically
        alignItems: "center", // UPDATED UI
        justifyContent: "center", // UPDATED UI
        padding: 16, // UPDATED UI for mobile spacing
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%", // UPDATED UI: responsive
          maxWidth: 520,
          borderRadius: 12, // UPDATED UI
          padding: 22, // UPDATED UI
          boxShadow: "0 10px 25px rgba(0,0,0,0.18)", // UPDATED UI
          borderTop: "5px solid #3d6ba6", // UPDATED UI accent
        }}
      >
        {/* HEADER */}
        <h3
          style={{
            marginTop: 0,
            marginBottom: 16,
            color: "#2b4e72", // UPDATED UI
          }}
        >
          {initialData ? "Edit Assignment" : "Assign Centre to Contact Person"}
        </h3>

        {/* CONTACT PERSON */}
        <label
          style={{
            fontWeight: 600, // UPDATED UI
            color: "#2b4e72", // UPDATED UI
          }}
        >
          Contact Person
        </label>

        {loadingCP ? (
          <p style={{ fontSize: 13, color: "#5a8cc2" }}>
            Loading contact persons…
          </p>
        ) : (
          <select
            className="input"
            disabled={saving}
            value={form.contact_person}
            onChange={(e) =>
              setForm({ ...form, contact_person: e.target.value })
            }
            style={{
              marginTop: 6, // UPDATED UI
            }}
          >
            <option value="">Select Contact Person</option>

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
            display: "block", // UPDATED UI
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
            justifyContent: "flex-end", // UPDATED UI
            flexWrap: "wrap", // UPDATED UI for mobile
          }}
        >
          <button
            className="btn"
            disabled={saving}
            onClick={handleSubmit}
            style={{
              background: "#3d6ba6", // UPDATED UI
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
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
              border: "1px solid #3d6ba6", // UPDATED UI
              color: "#3d6ba6",
              padding: "8px 16px",
              borderRadius: 6,
              background: "#fff",
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

    const tpId = await resolveTrainingPartnerIdForUser(user.id);
    if (!tpId) return;

    const [linksResp, cpResp, centreResp] = await Promise.all([
      TMS_API.tpcpCentreDetails.list({ created_by: user.id }),
      TMS_API.trainingPartnerContactPersons.list(),
      TMS_API.trainingPartnerCentres.list({ partner: tpId }),
    ]);

    setLinks(linksResp?.data?.results || []);
    setContactPersons(cpResp?.data?.results || []);
    setCentres(centreResp?.data?.results || []);

    setLoading(false);
    setLoadingCP(false);
    setLoadingCentres(false);
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  async function handleSave(form) {
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
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this assignment?")) return;
    await TMS_API.tpcpCentreLinks.destroy(id);
    loadAll();
  }

  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />
      <div className="main-area">
        {/* <TopNav
          left={
            <div className="app-title">
              Pragati Setu — Contact Person Centre Assignment
            </div>
          }
        /> */}

        <main
          style={{
            padding: 18,
            minHeight: "100vh", // UPDATED UI
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
                flexWrap: "wrap", // UPDATED UI: mobile friendly
                gap: 10, // UPDATED UI
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#2b4e72", // UPDATED UI
                }}
              >
                Centre Assignments
              </h2>

              <button
                className="btn btnPrimary"
                style={{
                  marginLeft: "auto",
                  background: "#3d6ba6", // UPDATED UI
                  border: "none",
                  color: "#fff",
                }}
                onClick={() => {
                  setEditRow(null);
                  setModalOpen(true);
                }}
              >
                + Assign Centre to Contact Person
              </button>
            </div>

            {/* TABLE CARD WRAPPER */}
            <div
              className="card"
              style={{
                background: "#fff", // UPDATED UI
                borderRadius: 10, // UPDATED UI
                padding: 18, // UPDATED UI
                boxShadow: "0 6px 14px rgba(0,0,0,0.08)", // UPDATED UI
                borderLeft: "6px solid #3d6ba6", // UPDATED UI accent
              }}
            >
              <div style={{ overflowX: "auto" }}>
                {/* UPDATED UI: mobile scroll */}
                <table className="table table-compact">
                  <thead
                    style={{
                      background: "#f4f8fd", // UPDATED UI
                    }}
                  >
                    <tr>
                      <th>S.No</th>
                      <th>Centre</th>
                      <th>Contact Person</th>
                      <th>Action</th> {/* UPDATED UI */}
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4}>Loading assignments…</td>
                      </tr>
                    ) : links.length === 0 ? (
                      <tr>
                        <td colSpan={4}>No assignments found</td>
                      </tr>
                    ) : (
                      links.map((l, i) => (
                        <tr
                          key={l.id}
                          style={{
                            borderBottom: "1px solid #e4ecf5", // UPDATED UI
                          }}
                        >
                          <td>{i + 1}</td>

                          <td
                            style={{
                              color: "#3d6ba6", // UPDATED UI
                              fontWeight: 500,
                            }}
                          >
                            {l.allocated_centre?.venue_name}
                          </td>

                          <td>{l.contact_person?.name}</td>

                          <td>
                            <button
                              className="btn-sm btn-flat"
                              style={{
                                color: "#3d6ba6", // UPDATED UI
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
                                background: "#2b4e72", // UPDATED UI
                                border: "none",
                                color: "#fff",
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
`}</style>
    </div>
  );
}
