import React, { useContext, useEffect, useState } from "react";
import { FaChartPie } from "react-icons/fa";
import { AuthContext } from "../../../../contexts/AuthContext";
import { TMS_API } from "../../../../api/axios";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const TP_SELF_PARTNER_KEY = "tp_self_partner_id";

/* resolve partner */

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

export default function TPLeftPanel() {
  const { user } = useContext(AuthContext) || {};

  const [beneficiaries, setBeneficiaries] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;

      setLoading(true);

      try {
        const partnerId = await resolveTrainingPartnerIdForUser(user.id);

        if (!partnerId) return;

        const [benRes, trRes] = await Promise.all([
          TMS_API.trBeneficiaries.list({
            training__partner: partnerId,
            page_size: 1,
          }),
          TMS_API.trTrainers.list({
            training__partner: partnerId,
            page_size: 1,
          }),
        ]);

        setBeneficiaries(benRes?.data?.count || 0);
        setTrainers(trRes?.data?.count || 0);
      } catch (e) {
        console.error("Chart fetch failed", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  const data = {
    labels: ["Beneficiaries", "Trainers"],
    datasets: [
      {
        data: [beneficiaries, trainers],
        backgroundColor: ["#3d6ba6", "#a7c6ed"],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#2b4e72",
          font: {
            size: 12,
            weight: "600",
          },
          padding: 20,
        },
      },

      tooltip: {
        backgroundColor: "#2b4e72",
        padding: 10,
      },
    },

    cutout: "55%",
  };

  return (
    <div className="tp-big-card">
      <div className="tp-big-header">
        <FaChartPie />
        Training Activity
      </div>

      {loading ? (
        <div className="muted">Loading chart...</div>
      ) : (
        <div className="tp-chart-wrapper">
          <Doughnut data={data} options={options} />
        </div>
      )}
    </div>
  );
}
