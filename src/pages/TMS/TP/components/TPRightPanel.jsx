import React, { useContext, useEffect, useState } from "react";
import { FaTasks, FaClock } from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthContext";
import { TMS_API } from "../../../../api/axios";

const TP_SELF_PARTNER_KEY = "tp_self_partner_id";

/* resolve partner id (same logic used elsewhere) */

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

    const partnerId = resp?.data?.results?.[0]?.id || null;

    if (partnerId) {
      localStorage.setItem(TP_SELF_PARTNER_KEY, String(partnerId));
    }

    return partnerId;
  } catch {
    return null;
  }
}

export default function TPRightPanel() {
  const { user } = useContext(AuthContext) || {};

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;

      setLoading(true);

      try {
        const partnerId = await resolveTrainingPartnerIdForUser(user.id);

        if (!partnerId) {
          setRequests([]);
          setLoading(false);
          return;
        }

        const resp = await TMS_API.trainingRequestsList.list({
          partner_id: partnerId,
          ordering: "-created_at",
          status: "BATCHING",
          page_size: 5,
        });

        setRequests(resp?.data?.results || []);
      } catch (e) {
        console.error("Dashboard recent requests failed", e);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  return (
    <div className="tp-big-card">
      <div className="tp-big-header">
        <FaTasks />
        Recent Training Requests
      </div>

      <div className="tp-scroll">
        {loading ? (
          <div className="muted">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="muted">No recent requests</div>
        ) : (
          <table className="tp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Theme</th>
                <th>Plan</th>
                <th>District</th>
                <th>Block</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.theme_name}</td>
                  <td>{r.training_plan_name}</td>
                  <td>{r.district_name}</td>
                  <td>{r.block_name}</td>
                  <td>
                    <FaClock style={{ marginRight: 6 }} />
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
