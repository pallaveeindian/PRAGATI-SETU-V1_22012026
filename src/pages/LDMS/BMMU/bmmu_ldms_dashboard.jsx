// bmmu_ldms_dashboard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import DashboardHeader from "../Layout/ldms_dash_header";
import BlockMap from "./bmmu_dashboard_blk_map";
import Meetings from "./bmmu_dashboard_meetings";
import DemandAnalytics from "./bmmu_dashboard_demand_analytics";
import SupportBenefitExt from "./bmmu_dashboard_support_benefit_ext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faUsers,
  faChartColumn,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";

export default function BmmuLdmsDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bmmu-dashboard-wrapper">
      {/* Page Header */}
      <DashboardHeader title="BMMU LDMS Dashboard" username={user?.username} />

      {/* Grid */}
      <div className="dashboard-grid">
        {/* Village Analytics */}
        <div className="dashboard-card">
          <div className="card-header red">
            <FontAwesomeIcon icon={faMapLocationDot} />
            <h3>Village Level Analytics</h3>
          </div>
          <div className="card-body">
            <BlockMap />
          </div>
        </div>

        {/* Meetings */}
        <div className="dashboard-card">
          <div className="card-header black">
            <FontAwesomeIcon icon={faUsers} />
            <h3>BLCC Meetings</h3>
          </div>
          <div className="card-body">
            <Meetings />
          </div>
        </div>

        {/* Demand */}
        <div className="dashboard-card">
          <div className="card-header green">
            <FontAwesomeIcon icon={faChartColumn} />
            <h3>Demand Analytics</h3>
          </div>
          <div className="card-body">
            <DemandAnalytics />
          </div>
        </div>

        {/* Support */}
        <div className="dashboard-card">
          <div className="card-header red">
            <FontAwesomeIcon icon={faHandHoldingHeart} />
            <h3>Support Benefit Map</h3>
          </div>
          <div className="card-body">
            <SupportBenefitExt />
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .bmmu-dashboard-wrapper {
          padding: 0;
          background: #ffffff;
          min-height: 100vh;
        }

        /* ===== GRID ===== */
        .dashboard-grid {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* ===== CARD ===== */
        .dashboard-card {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
          border-bottom: 1px solid #f2f2f2;
          transition: all 0.35s ease;
          position: relative;
        }

        /* Smooth hover lift */
        .dashboard-card:hover {
          box-shadow: 0 8px 30px rgba(139, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        /* Red accent line on hover */
        .dashboard-card::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0%;
          height: 3px;
          background: #8b0000;
          transition: width 0.4s ease;
        }

        .dashboard-card:hover::after {
          width: 100%;
        }

        /* ===== CARD HEADER ===== */
        .card-header {
          display: flex;
          justify-content: center;   /* CENTER CONTENT */
          align-items: center;
          gap: 12px;
          padding: 22px 16px;
          font-weight: 700;
          font-size: 18px;
          text-align: center;
          letter-spacing: 0.5px;
          position: relative;
        }

        .card-header h3 {
          margin: 0;
          font-size: 20px;
        }

        /* subtle icon animation */
        .card-header svg {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .dashboard-card:hover .card-header svg {
          transform: scale(1.15);
        }

        /* Theme Colors */
        .card-header.red {
          color: #8b0000;
        }

        .card-header.black {
          color: #111;
        }

        .card-header.green {
          color: #0a7f2e;
        }

        /* ===== BODY ===== */
        .card-body {
          padding: 25px 40px;
          flex: 1;
          overflow-x: auto;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .card-header {
            padding: 16px 12px;
            font-size: 16px;
          }

          .card-header h3 {
            font-size: 17px;
          }

          .card-body {
            padding: 18px;
          }
        }

        @media (max-width: 480px) {
          .card-header {
            font-size: 15px;
            gap: 8px;
          }

          .card-header h3 {
            font-size: 15px;
          }

          .card-body {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}
