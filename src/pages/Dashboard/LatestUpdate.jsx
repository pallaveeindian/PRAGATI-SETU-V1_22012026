import React from "react";
import { useNavigate } from "react-router-dom";

export default function LatestUpdate() {
  const navigate = useNavigate();

  const portals = [
    {
      title: "CRP-EP Mapping",
      module: "crp",
      description:
        "Manage Community Resource Person and Enterprise Promotion Staff mapping.",
      color: "#f59e0b",
    },
    {
      title: "MOU Portal",
      module: "mou",
      description:
        "Memorandum of Understanding Management Portal.",
      color: "#9333ea",
    },
    {
      title: "Prerna Canteen",
      module: "canteen",
      description:
        "Prerna Canteen Management Portal for BMM, DMM and SMM users.",
      color: "#16a34a",
    },
  ];

  const handleNavigate = (module) => {
    navigate(`/login?module=${module}`);
  };

  return (
    <div className="latest-update-container">
      <div className="latest-update-header">
        <span className="live-dot"></span>
        <h2>Latest Updates</h2>
      </div>

      <div className="vertical-prompter">
        <div className="vertical-track">
          {[...portals, ...portals, ...portals, ...portals].map(
            (portal, index) => (
              <button
                key={`${portal.module}-${index}`}
                className="update-card"
                onClick={() => handleNavigate(portal.module)}
                style={{
                  "--portal-color": portal.color,
                }}
              >
                <div className="card-top">
                  <span className="update-badge">LATEST</span>
                  <span className="portal-name">{portal.title}</span>
                </div>

                <div className="card-body">
                  {portal.description}
                </div>

                <div className="card-footer">
                  Open Portal →
                </div>
              </button>
            )
          )}
        </div>
      </div>

      <style>{`
        .latest-update-container {
          width: 100%;
          max-width: 700px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .latest-update-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .latest-update-header h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
        }

        .live-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: red;
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.4);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .vertical-prompter {
          height: 500px;
          overflow: hidden;
          position: relative;
          border-radius: 20px;
        }

        .vertical-track {
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: scrollUp 18s linear infinite;
        }

        .vertical-prompter:hover .vertical-track {
          animation-play-state: paused;
        }

        .update-card {
          width: 100%;
          background: #0f172a;
          color: white;
          border: none;
          border-left: 6px solid var(--portal-color);
          border-radius: 18px;
          padding: 20px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
        }

        .update-card:hover {
          transform: translateX(8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .update-badge {
          background: var(--portal-color);
          color: white;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }

        .portal-name {
          font-size: 20px;
          font-weight: 700;
        }

        .card-body {
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 16px;
        }

        .card-footer {
          color: var(--portal-color);
          font-weight: 700;
          font-size: 14px;
        }

        @keyframes scrollUp {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-50%);
          }
        }

        @media (max-width: 768px) {
          .vertical-prompter {
            height: 420px;
          }

          .portal-name {
            font-size: 17px;
          }

          .card-body {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

