import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_API } from "../../../api/axios";
import { clearAuth } from "../../../utils/storage";
import PDUButton from "../components/PDUButton";
import psLogo from "../../../assets/PS_LOGO_SQUARED.jpg"; // Adjust path if needed

export default function PDUHeader({ onBurgerClick }) {
  const { user } = useContext(AuthContext) || {};
  const [burgerOpen, setBurgerOpen] = useState(false);

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
    <header className="pdu-header">
      {/* -------- LEFT -------- */}
      <div className="pdu-header-left">
        <img src={psLogo} alt="Pragati Setu" className="pdu-applogo" />
        <span className="pdu-govt-badge" />
        <h1 className="pdu-title">
          <span>Pragati Setu</span> Aspirational Blocks
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

      {/* -------- STYLES -------- */}
      <style>{`
                :root {
                    --pdu-primary: #3b82f6;      /* Blue */
                    --pdu-primary-dark: #2563eb; /* Darker Blue */
                    --pdu-accent: #8b5cf6;       /* Purple */
                    --pdu-text-dark: #1f2937;
                    --pdu-text-muted: #6b7280;
                    --pdu-border: #e5e7eb;
                    --pdu-white: #ffffff;
                }

                .pdu-header {
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    z-index: 50;
                    background-color: var(--pdu-white);
                    border-bottom: 1px solid var(--pdu-border);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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

                .pdu-govt-badge {
                    width: 4px;
                    height: 32px;
                    background: var(--pdu-accent);
                    border-radius: 4px;
                }

                .pdu-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--pdu-text-dark);
                    margin: 0;
                    letter-spacing: 0.3px;
                }

                .pdu-title span {
                    font-weight: 800;
                    color: var(--pdu-primary-dark);
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
                    background: var(--pdu-primary);
                    color: var(--pdu-white);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
                }

                .pdu-user-name {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--pdu-text-dark);
                }

                .pdu-logout-wrapper {
                    margin-left: 8px;
                    border-left: 1px solid var(--pdu-border);
                    padding-left: 20px;
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
                    background: var(--pdu-text-dark);
                    border-radius: 3px;
                    transition: all 0.3s ease;
                }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .pdu-burger {
                        display: flex;
                    }
                    .pdu-header-right {
                        display: none; /* Can be toggled via state if mobile menu is implemented */
                    }
                } 
            `}</style>
    </header>
  );
}
