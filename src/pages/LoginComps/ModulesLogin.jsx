// src/pages/LoginComps/ModulesLogin.jsx
import React from "react";
import { Link } from "react-router-dom";

import tmsLogo from "../../assets/TMS/tms_logo.png";
import esmLogo from "../../assets/ems_logo.png";
import ldmsLogo from "../../assets/ldms_logo.png";

export default function ModulesLogin() {
  const activeModules = [
    {
      id: "tms",
      logo: tmsLogo,
      title: "TMS Portal",
      subtitle: "Training Management System",
      desc: "Manage training programs, capacity building, and skill development workflows efficiently.",
      color: "#2a56cf",
      path: "/module-login?module=tms",
      level: "All",
    },
    {
      id: "crp",
      logo: esmLogo,
      title: "CRP-EP Mapping",
      subtitle: "Enterprise Tracking",
      desc: "Create Community Resource Person accounts and map their respective Panchayat coverage for Udhyam Sakhi App survey filling effectively.",
      color: "#f59e0b",
      path: "/module-login?module=crp",
      level: "District",
    },
  ];

  const inactiveModules = [
    {
      id: "ldms",
      logo: ldmsLogo,
      title: "LDMS Portal",
      subtitle: "Lakhpati Didi",
      desc: "Lakhpati Didi Management System is currently under development.",
      color: "#b91c1c",
      path: "#",
      level: "All",
    },
    {
      id: "mou",
      logo: esmLogo,
      title: "Enterprise MOU",
      subtitle: "Memorandum of Understanding",
      desc: "Securely manage and monitor enterprise MOUs and related institutional agreements.",
      color: "#9333ea",
      path: "/module-login?module=mou",
      level: "Block",
    },
    {
      id: "epsms",
      logo: esmLogo,
      title: "EPSMS Portal",
      subtitle: "Enterprise Sakhi Management System",
      desc: "Securely manage and monitor enterprise Sakhi data submitted by field level CRPs using our Udhyam Sakhi Android App.",
      color: "#ea6733",
      path: "/module-login?module=epsms",
      level: "Block",
    },
    {
      id: "prerna",
      logo: esmLogo,
      title: "Prerna Canteen Portal",
      subtitle: "Portal for Prerna Canteen Management",
      desc: "Portal for Prerna Canteen Managementis currently under development.",
      color: "#ea3333",
      path: "/module-login?module=prerna",
      level: "Block",
    },
  ];

  return (
    <section className="modules-login-wrapper">
      <div className="modules-container">
        {/* HEADER */}
        <div className="modules-header">
          <h2 className="modules-title">
            Portal <span>Access</span>
          </h2>
          <p className="modules-subtitle">
            Select your designated module below to proceed to the secure login
            gateway.
          </p>
        </div>

        {/* ACTIVE MODULES */}
        <div className="module-group">
          <h3 className="group-heading">Active Modules</h3>
          <div className="cards-grid">
            {activeModules.map((mod) => (
              <div
                key={mod.id}
                className="module-card active-card"
                style={{ "--theme-color": mod.color }}
              >
                <div className="card-top-bar"></div>
                <div className="card-content">
                  <div className="card-icon-wrapper">
                    <span className="card-icon-letter">
                      <img
                        src={mod.logo}
                        alt={mod.title}
                        className="card-icon"
                      />
                    </span>
                  </div>
                  <h4>{mod.title}</h4>
                  <h5>{mod.subtitle}</h5>
                  <p>{mod.desc}</p>
                </div>
                <div className="card-footer">
                  <Link to={mod.path} className="card-btn">
                    Proceed to Login
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INACTIVE MODULES */}
        <div className="module-group inactive-group">
          <h3 className="group-heading">Inactive / Upcoming Modules</h3>
          <div className="cards-grid">
            {inactiveModules.map((mod) => (
              <div
                key={mod.id}
                className="module-card inactive-card"
                style={{ "--theme-color": mod.color }}
              >
                <div className="card-top-bar"></div>
                <div className="card-content">
                  <div className="card-icon-wrapper">
                    <span className="card-icon-letter">
                      <img
                        src={mod.logo}
                        alt={mod.title}
                        className="card-icon"
                      />
                    </span>
                  </div>
                  <h4>{mod.title}</h4>
                  <h5>{mod.subtitle}</h5>
                  <p>{mod.desc}</p>
                </div>
                <div className="card-footer">
                  <button className="card-btn disabled-btn" disabled>
                    Currently Unavailable
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .modules-login-wrapper {
          width: 100%;
          background-color: #ffffff;
          padding: 24px;
          font-family: 'Abel', sans-serif;
        }

        .modules-container {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* HEADER */
        .modules-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .modules-title {
          font-size: 38px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .modules-title span {
          color: #fd7301;
        }

        .modules-subtitle {
          font-size: 16px;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        /* GROUPS & GRID */
        .module-group {
          margin-bottom: 50px;
        }

        .group-heading {
          font-size: 22px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 24px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        /* CARD BASE */
        .module-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          transition: all 0.4s ease;
          border: 1px solid #f1f5f9;
        }

        .card-top-bar {
          height: 6px;
          width: 100%;
          background: var(--theme-color);
        }

        .card-content {
          padding: 30px 24px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .card-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: var(--theme-color);
        }

        .card-icon-letter {
          font-size: 24px;
          font-weight: 800;
          font-family: 'Century Gothic', sans-serif;
        }

        .card-content h4 {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .card-content h5 {
          font-size: 14px;
          font-weight: 600;
          color: var(--theme-color);
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content p {
          font-size: 15px;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        .card-footer {
          padding: 20px 24px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }

        /* BUTTONS */
        .card-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 0;
          background: #0f172a;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        /* HOVER EFFECTS FOR ACTIVE CARDS */
        .active-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px rgba(15, 23, 42, 0.1);
          border-color: var(--theme-color);
        }

        .active-card:hover .card-icon-wrapper {
          background: var(--theme-color);
          color: #ffffff;
        }

        .active-card:hover .card-btn {
          background: var(--theme-color);
          box-shadow: 0 8px 20px rgba(0,0,0, 0.15);
        }

        /* INACTIVE / DISABLED LOGIC */
        .inactive-group {
          opacity: 0.75;
        }

        .inactive-card {
          filter: grayscale(100%);
        }
        
        .inactive-card:hover {
          transform: none;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
        }

        .disabled-btn {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .modules-title {
            font-size: 32px;
          }
          .cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .modules-login-wrapper {
            padding: 60px 20px;
          }
          .modules-title {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .card-content h4 {
            font-size: 20px;
          }
        }

        /* Card Icon */
        .card-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          z-index: 5;
          transition: all 0.35s ease;
        }

        .card-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .active-card:hover .card-icon {
          transform: scale(1.08);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.2);
        }
      `}</style>
    </section>
  );
}
