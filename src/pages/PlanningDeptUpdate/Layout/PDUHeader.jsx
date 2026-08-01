import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_API } from "../../../api/axios";
import { clearAuth } from "../../../utils/storage";
import PDUButton from "../components/PDUButton";
import psLogo from "../../../assets/PS_LOGO_SQUARED.jpg";

export default function PDUHeader({ onBurgerClick }) {
  const { user } = useContext(AuthContext) || {};
  const [burgerOpen, setBurgerOpen] = useState(false);
  const location = useLocation();

  const handleBurger = () => {
    setBurgerOpen(!burgerOpen);
    if (onBurgerClick) onBurgerClick();
  };

  const username = user?.username || user?.name || user?.email || "SMMU Admin";
  const avatarLetter = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await AUTH_API.logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      clearAuth();
      window.location.href = "/";
    }
  };

  return (
    <header className="pdu-header-wrapper">
      {/* ================= MAIN TOP HEADER ================= */}
      <div className="pdu-main-header">
        {/* -------- LEFT -------- */}
        <div className="pdu-header-left">
          <img src={psLogo} alt="Pragati Setu" className="pdu-applogo" />
          <span className="pdu-theme-badge" />
          <h1 className="pdu-title">
            <span>UP Aspirational Blocks</span> Monitoring Dashboard
          </h1>
        </div>

        {/* Mobile Burger */}
        <button
          className={`pdu-burger ${burgerOpen ? "open" : ""}`}
          onClick={handleBurger}
        >
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </button>

        {/* -------- RIGHT -------- */}
        <div className="pdu-header-right">
          <div className="pdu-user-wrapper">
            <div className="pdu-user-info">
              <div className="pdu-user-avatar">{avatarLetter}</div>
              <span className="pdu-user-name">{username}</span>
            </div>
          </div>

          {/* Custom Logout Button from PDUButton */}
          <div className="pdu-logout-wrapper">
            <PDUButton variant="logout" onClick={handleLogout} />
          </div>
        </div>
      </div>

      {/* ================= SECONDARY GRADIENT NAV ================= */}
      <nav className="pdu-sub-nav">
        <div className="pdu-sub-nav-links">
          <Link
            to="/upsrlm-planning/state/dashboard"
            className={`pdu-nav-item ${location.pathname.includes("dashboard") ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/upsrlm-planning/state/shg-pointer"
            className={`pdu-nav-item ${location.pathname.includes("shg-pointer") ? "active" : ""}`}
          >
            Pointer 1: SHG Households (0511)
          </Link>
          <Link to="#" className="pdu-nav-item">
            Pointer 2: RF Received (0512)
          </Link>
        </div>
      </nav>

      {/* -------- STYLES -------- */}
      <style>{`
        :root {
          --pdu-cyan: #38A3C5;
          --pdu-navy: #353F7C;
          --pdu-white: #ffffff;
          --pdu-text-dark: #1f2937;
          --pdu-border: #e5e7eb;
        }

        /* Wrapper for both header rows */
        .pdu-header-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
          z-index: 50;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        }

        /* --- Main Header Row --- */
        .pdu-main-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background-color: var(--pdu-white);
          border-bottom: 1px solid var(--pdu-border);
        }

        .pdu-applogo {
          height: 45px;
          width: auto;
          border-radius: 8px;
        }

        .pdu-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pdu-theme-badge {
          width: 4px;
          height: 32px;
          background: var(--pdu-cyan);
          border-radius: 4px;
        }

        .pdu-title {
          font-size: 18px;
          font-weight: 500;
          color: var(--pdu-text-dark);
          margin: 0;
          letter-spacing: 0.3px;
        }

        .pdu-title span {
          font-weight: 800;
          color: var(--pdu-navy);
        }

        .pdu-header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* User Info */
        .pdu-user-wrapper {
          display: flex;
          align-items: center;
        }

        .pdu-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pdu-user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--pdu-navy);
          color: var(--pdu-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 2px 6px rgba(53, 63, 124, 0.3);
        }

        .pdu-user-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--pdu-navy);
        }

        .pdu-logout-wrapper {
          margin-left: 8px;
          border-left: 1px solid var(--pdu-border);
          padding-left: 20px;
        }

        /* --- Secondary Gradient Nav Row --- */
        .pdu-sub-nav {
          height: 44px;
          background: linear-gradient(90deg, var(--pdu-cyan) 0%, var(--pdu-navy) 100%);
          display: flex;
          align-items: center;
          padding: 0 24px;
        }

        .pdu-sub-nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .pdu-nav-item {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 4px 0;
          position: relative;
          transition: color 0.2s ease;
        }

        .pdu-nav-item:hover,
        .pdu-nav-item.active {
          color: var(--pdu-white);
          font-weight: 600;
        }

        /* Underline effect on hover/active */
        .pdu-nav-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: var(--pdu-white);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .pdu-nav-item:hover::after,
        .pdu-nav-item.active::after {
          width: 100%;
        }

        /* ---------------- BURGER BUTTON ---------------- */
        .pdu-burger {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 8px;
          border: 1px solid var(--pdu-border);
          background: var(--pdu-white);
          cursor: pointer;
          position: relative;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }

        .pdu-burger span {
          width: 20px;
          height: 3px;
          background: var(--pdu-navy);
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .pdu-burger {
            display: flex;
          }
          .pdu-header-right, .pdu-sub-nav {
            display: none; /* Hide standard navs on mobile, handle via sidebar if needed */
          }
        } 
      `}</style>
    </header>
  );
}
