import React, { useContext, useEffect, useState, useRef } from "react";
import TopNav from "../layout/tms_TopNav";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

/* ===================================================== */

const TP_SELF_PARTNER_KEY = "tp_self_partner_id";

/* ---------------- partner resolver ---------------- */

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  try {
    const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
    if (cached) return Number(cached);
  } catch {}

  try {
    const resp = await TMS_API.trainingPartners.list({
      search: userId,
      fields: "id",
    });
    const pid = resp?.data?.results?.[0]?.id || null;

    if (pid) {
      localStorage.setItem(TP_SELF_PARTNER_KEY, String(pid));
    }
    return pid;
  } catch {
    return null;
  }
}

/* ===================================================== */

export default function TpDashboard() {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [partnerId, setPartnerId] = useState(null);

  const [counts, setCounts] = useState({
    centres: 0,
    contactPersons: 0,
    batches: 0,
    pendingRequests: 0,
  });

  const didInitRef = useRef(false);

  /* ===================================================== */
  /* ---------------- resolve TP + fetch counts ---------------- */

  useEffect(() => {
    if (role !== "training_partner" || !user?.id || didInitRef.current) return;

    didInitRef.current = true;

    (async () => {
      setLoading(true);

      const pid = await resolveTrainingPartnerIdForUser(user.id);
      if (!pid) {
        setLoading(false);
        return;
      }

      setPartnerId(pid);

      try {
        const [centresRes, cpRes, batchesRes, pendingReqRes] =
          await Promise.all([
            TMS_API.trainingPartnerCentres.list({
              partner: pid,
              page_size: 1,
            }),
            TMS_API.trainingPartnerContactPersons.list({
              page_size: 1,
            }),
            TMS_API.batches.list({
              partner_id: pid,
              page_size: 1,
            }),
            TMS_API.trainingRequests.list({
              partner_id: pid,
              status: "BATCHING",
              page_size: 1,
            }),
          ]);

        setCounts({
          centres: centresRes?.data?.count || 0,
          contactPersons: cpRes?.data?.count || 0,
          batches: batchesRes?.data?.count || 0,
          pendingRequests: pendingReqRes?.data?.count || 0,
        });
      } catch (e) {
        console.error("TP dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [role, user?.id]);

  /* ===================================================== */

  return (
    <div className="app-shell">
      <LeftNav
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((v) => !v)}
      />

      <div className="main-area">
        <TopNav />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
          <h2>Training Partner Dashboard</h2>

          <div className="muted" style={{ marginBottom: 20 }}>
            Overview of training centres, contact persons, requests and batches.
          </div>

          {loading ? (
            <div className="muted">Loading dashboard…</div>
          ) : (
            <div className="grid grid-2" style={{ gap: 16 }}>
              {/* Training Centres */}
              <div className="card">
                <h4>Training Centres</h4>
                <p className="muted">
                  Total centres registered under your organisation.
                </p>
                <div className="stat-value">{counts.centres}</div>
              </div>

              {/* Contact Persons */}
              <div className="card">
                <h4>Contact Persons</h4>
                <p className="muted">Centre-level contact person accounts.</p>
                <div className="stat-value">{counts.contactPersons}</div>
              </div>

              {/* Pending Requests */}
              <div className="card">
                <h4>Pending Training Requests</h4>
                <p className="muted">Requests awaiting batch creation.</p>
                <div className="stat-value warning">
                  {counts.pendingRequests}
                </div>
              </div>

              {/* Batches */}
              <div className="card">
                <h4>Batches</h4>
                <p className="muted">
                  All batches created under your organisation.
                </p>
                <div className="stat-value success">{counts.batches}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
