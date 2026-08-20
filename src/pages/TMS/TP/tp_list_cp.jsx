import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API, LOOKUP_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import {
  FaUserPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";

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

/* ================= VIEW MODAL ================= */

function CPViewModal({ open, cp, onClose }) {
  const [userDetail, setUserDetail] = useState(null);
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    if (!cp) return;

    async function loadDetails() {
      if (cp.master_user) {
        const u = await api.get(`/lookups/users/${cp.master_user}/`);
        setUserDetail(u.data);
      }

      const links = await TMS_API.tpcpCentreLinks.list({
        contact_person: cp.id,
      });

      const centreIds =
        links?.data?.results?.map((x) => x.allocated_centre) || [];

      const centreDetails = [];
      for (const cid of centreIds) {
        const c = await api.get(`/tms/training-partner-centres/${cid}/detail/`);
        centreDetails.push(c.data);
      }
      setCentres(centreDetails);
    }

    loadDetails();
  }, [cp]);

  if (!open || !cp) return null;

  return (
    <div className="tp-modal-backdrop">
      <div className="tp-modal" style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>TC Details</h3>
          <button className="tp-btn-outline" onClick={onClose}>
            <FaArrowLeft /> Back
          </button>
        </div>

        <h4>Basic Details</h4>
        <table className="tp-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{cp.name}</td>
            </tr>
            <tr>
              <td>Mobile</td>
              <td>{cp.mobile_number || "-"}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{cp.email || "-"}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{cp.address || "-"}</td>
            </tr>
          </tbody>
        </table>

        <h4>Login Details</h4>
        <table className="tp-table">
          <tbody>
            <tr>
              <td>Username</td>
              <td>{userDetail?.username || "-"}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{userDetail?.is_active ? "Active" : "Inactive"}</td>
            </tr>
          </tbody>
        </table>

        <h4>Assigned Centres</h4>
        {centres.length === 0 ? (
          <p>No centres assigned</p>
        ) : (
          <table className="tp-table">
            <thead>
              <tr>
                <th>Serial</th>
                <th>Centre</th>
                <th>Location</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {centres.map((c) => (
                <tr key={c.id}>
                  <td>{c.serial_number}</td>
                  <td>{c.venue_name}</td>
                  <td>
                    {c.district?.district_name_en} / {c.block?.block_name_en}
                    <br />
                    {c.panchayat?.panchayat_name_en} /{" "}
                    {c.village?.village_name_english}
                  </td>
                  <td>{c.venue_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function TpListCP() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const role = getCanonicalRole(user || {});

  const [loading, setLoading] = useState(false);
  const [cps, setCps] = useState([]);
  const [viewCp, setViewCp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // DTP specific states
  const [dtpPartnerId, setDtpPartnerId] = useState(null);
  const [dtpPartnerName, setDtpPartnerName] = useState("");
  const [dtpDistrictId, setDtpDistrictId] = useState(null);

  const [filters, setFilters] = useState({
    partner: "",
    district_id: "",
    block_id: "",
    aspirational_only: false,
  });

  useEffect(() => {
    async function loadCPs() {
      if (!user?.id) return;
      setLoading(true);

      let currentPartnerId = null;
      let currentDistrictId = null;

      // 1) RESOLVE SCOPE DEPENDING ON ROLE
      if (role === "dtp") {
        try {
          const partnerRes = await TMS_API.parentPartner();
          const partnerId = partnerRes?.data?.partner_id;
          if (partnerId) {
            currentPartnerId = String(partnerId);
            setDtpPartnerId(currentPartnerId);
            setFilters((f) => ({ ...f, partner: currentPartnerId }));
            try {
              const pRes = await TMS_API.trainingPartners.retrieve(partnerId);
              setDtpPartnerName(pRes?.data?.name || "");
            } catch (err) {}
          }
        } catch (err) {
          console.error("Failed to load parent partner", err);
        }

        try {
          const geoRes = await LOOKUP_API.userGeoscopeByUserId(user.id);
          currentDistrictId =
            geoRes?.data?.districts?.[0] ?? geoRes?.data?.district ?? null;
          if (currentDistrictId) {
            currentDistrictId = String(currentDistrictId);
            setDtpDistrictId(currentDistrictId);
            setFilters((f) => ({
              ...f,
              district_id: currentDistrictId,
              block_id: "",
              aspirational_only: false,
            }));
          }
        } catch (err) {
          console.error("Failed to load DTP geoscope", err);
        }
      } else {
        // Fallback for regular Training Partner role
        currentPartnerId = await resolveTrainingPartnerIdForUser(user.id);
        if (currentPartnerId) {
          setFilters((f) => ({ ...f, partner: String(currentPartnerId) }));
        }
      }

      if (!currentPartnerId) {
        setLoading(false);
        return; // Break out if no parent partner is found
      }

      // 2) CONSTRUCT API PARAMS & FETCH
      const params = {
        page_size: 200,
        partner: currentPartnerId,
      };

      if (role === "dtp" && currentDistrictId) {
        params.district_id = currentDistrictId;
        params.created_by = user.id;
      }

      if (role === "training_partner") {
        params.created_by = user.id;
      }

      try {
        const resp = await TMS_API.trainingPartnerContactPersons.list(params);
        setCps(resp?.data?.results || []);
      } catch (e) {
        console.error("Failed to fetch contact persons", e);
      } finally {
        setLoading(false);
      }
    }

    loadCPs();
  }, [user, role]);

  async function handleDelete(cp) {
    const ok = window.confirm(
      `Are you sure you want to delete "${cp.name}"?\n\nThis will also DISABLE their login.`,
    );
    if (!ok) return;

    setDeletingId(cp.id);

    try {
      // 1. Soft delete CP
      await TMS_API.trainingPartnerContactPersons.destroy(cp.id);

      // 2. Deactivate linked master user
      if (cp.master_user) {
        await api.patch(`/lookups/users/${cp.master_user}/`, {
          is_active: 0,
          deleted_by: user.id,
        });
      }

      // 3. Update UI
      setCps((prev) => prev.filter((x) => x.id !== cp.id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete TC ID");
    } finally {
      setDeletingId(null);
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
          {/* <TopNav
          left={<div className="app-title">Pragati Setu — Contact Persons</div>}
        /> */}
          <div className="app-shell-TP-CP">
            <main style={{ padding: 18 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <h2 className="tp-page-title">
                    <FaUser /> TC IDs
                  </h2>

                  <button
                    className="tp-btn"
                    style={{ marginLeft: "auto" }}
                    onClick={() => navigate("/tms/tp/cp/create")}
                  >
                    <FaUserPlus style={{ marginRight: 6 }} /> Register New TC ID
                  </button>
                </div>

                <table className="tp-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>User ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5}>Loading…</td>
                      </tr>
                    ) : cps.length === 0 ? (
                      <tr>
                        <td colSpan={5}>No TC IDs found</td>
                      </tr>
                    ) : (
                      cps.map((cp, i) => (
                        <tr key={cp.id}>
                          <td>{i + 1}</td>
                          <td>{cp.name}</td>
                          <td>{cp.mobile_number || "-"}</td>
                          <td>{cp.master_user || "-"}</td>
                          <td>
                            <button
                              className="tp-btn-outline"
                              onClick={() => setViewCp(cp)}
                            >
                              <FaEye /> View
                            </button>{" "}
                            <button
                              className="tp-btn-outline"
                              onClick={() =>
                                navigate(`/tms/tp/cp/edit/${cp.id}`)
                              }
                            >
                              <FaEdit /> Edit
                            </button>{" "}
                            <button
                              className="tp-btn-outline"
                              disabled={deletingId === cp.id}
                              onClick={() => handleDelete(cp)}
                            >
                              {deletingId === cp.id ? "Deleting…" : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </main>
            <Footer />
          </div>

          <CPViewModal
            open={!!viewCp}
            cp={viewCp}
            onClose={() => setViewCp(null)}
          />
        </div>
      </div>
      <style>{`.content-area {
  display: flex;
  flex: 1;
  min-height: 0;
}
.app-shell-TP-CP {
  display: flex;
  flex-direction: column;
  flex: 1;                
}
  .app-shell-TP-CP main {
  flex: 1;
}
`}</style>
    </div>
  );
}
