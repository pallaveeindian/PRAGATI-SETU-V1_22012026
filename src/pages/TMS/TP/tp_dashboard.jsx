import React, { useContext, useEffect, useState, useRef } from "react";
// import TopNav from "../layout/tms_TopNav";
import Header from "../layout/header";
import Footer from "../layout/footer";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import { TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";
import TPStatCard from "./components/TPStatCard";
import TPLeftPanel from "./components/TPLeftPanel";
import TPRightPanel from "./components/TPRightPanel";
import "../../../tp_styles.css";

import { FaBuilding, FaUsers, FaClock, FaLayerGroup } from "react-icons/fa";
/* ===================================================== */

const TP_SELF_PARTNER_KEY = "tp_self_partner_id";

/* ---------------- partner resolver ---------------- */

async function resolveTrainingPartnerIdForUser(userId) {
  if (!userId) return null;

  try {
    const cached = localStorage.getItem(TP_SELF_PARTNER_KEY);
    if (cached) return Number(cached);
  } catch { }

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
      <Header />
      <div className="content-area">
        <LeftNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((v) => !v)}
        />
        <div className="main-area">
          {/* <TopNav /> */}

          <div className="tp-page tp-dashboard">
            <h2 className="tp-title">Training Partner Dashboard</h2>
            <div className="tp-subtitle">
              Overview of training centres, contact persons, requests and batches.
            </div>
            {loading ? (
              <div className="muted">Loading dashboard…</div>
            ) : (
              <>
                {/* ===== TOP KPI CARDS ===== */}

                <div className="tp-stat-grid">
                  <TPStatCard
                    title="Training Centres"
                    value={counts.centres}
                    icon={<FaBuilding />}
                  />

                  <TPStatCard
                    title="Contact Persons"
                    value={counts.contactPersons}
                    icon={<FaUsers />}
                  />

                  <TPStatCard
                    title="Pending Requests"
                    value={counts.pendingRequests}
                    icon={<FaClock />}
                  />

                  <TPStatCard
                    title="Batches"
                    value={counts.batches}
                    icon={<FaLayerGroup />}
                  />
                </div>

                {/* ===== LOWER PANELS ===== */}

                <div className="tp-bottom-grid">
                  <TPLeftPanel />
                  <TPRightPanel />
                </div>
              </>
            )}{" "}
          </div>
          <Footer />
        </div>
      </div>
      <style>{`.content-area {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* SIDEBAR FIX */
.tms-leftnav {
  flex-shrink: 0;
}

/* MAIN RIGHT SIDE */
.main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* PAGE CONTENT SHOULD TAKE AVAILABLE SPACE */
.tp-page {
  flex: 1;
  padding: 16px;
}

/* FOOTER ALWAYS AT BOTTOM */
footer {
  flex-shrink: 0;
  margin-top: auto;
}
`}</style>
    </div>
  );
}
