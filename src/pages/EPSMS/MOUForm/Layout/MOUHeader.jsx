// src/pages/EPSMS/Layout/MOUHeader.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { AUTH_API } from "../../../../api/axios";
import { clearAuth } from "../../../../utils/storage";
import EpsmsLogo from "../../../../assets/ems_logo.png";
import bgImage from "../../../../assets/EPSMS/header_bg.jpg";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";

export default function MOUHeader({ onBurgerClick }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { user } = useContext(AuthContext) || {};
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [burgerOpen, setBurgerOpen] = useState(false);

    const handleBurger = () => {
        setBurgerOpen(!burgerOpen);
        onBurgerClick();
    };

    const username = user?.username || user?.name || user?.email || "User";
    const avatarLetter = username.charAt(0).toUpperCase();

    const handleLogout = async () => {
        try {
            await AUTH_API.logout();
        } catch (e) {
        } finally {
            clearAuth();
            window.location.href = "/";
        }
    };

    return (
        <header className="epsms-header">
            {/* -------- LEFT -------- */}
            <div className="epsms-header-left">
                <img src={EpsmsLogo} className="epsms-applogo" />
                <span className="epsms-govt-badge" />
                <h1 className="epsms-title">
                    <span>Enterprise Sakhi Management System</span> (EPSMS)
                </h1>
            </div>

            {/* Mobile Burger */}
            <button
                className={`epsms-burger ${burgerOpen ? "open" : ""}`}
                onClick={handleBurger}
            >
                <span className="line line1"></span>
                <span className="line line2"></span>
                <span className="line line3"></span>
            </button>

            {/* -------- RIGHT -------- */}
            <div
                className={`epsms-header-right ${showMobileMenu ? "mobile-open" : ""}`}
            >

                {/* User Menu */}
                <div className="epsms-user-wrapper">
                    <button
                        className="epsms-user-info"
                        onClick={() => {
                            setShowUserMenu((v) => !v);
                            setShowNotifications(false);
                        }}
                    >
                        <div className="epsms-user-avatar">{avatarLetter}</div>
                        <span className="epsms-user-name">{username}</span>
                    </button>

                    {showUserMenu && (
                        <div className="epsms-user-menu pop-animate">
                            <button onClick={handleLogout} className="epsms-logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* -------- STYLES -------- */}
            <style>{`
        :root {
          --epsms-red: #c95835;
          --epsms-red-light: #ffffff;
          --epsms-border: #c47744;
          --epsms-text-dark: #1f2937;
          --epsms-text-muted: #6b7280;
          --epsms-green: #189218;
          --epsms-white: #ffffff;
          --epsms-muted: #e5e7eb;
        }

        .epsms-header {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 50;
          border-bottom: 2px solid var(--epsms-border);
          background:
            linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)),
            url(${bgImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          /* subtle depth */
          box-shadow: 0 4px 12px var(--epsms-border);

          /* smoother UI feel */
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .epsms-applogo {
          height: 40px;
          width: auto;
          margin-right: -5px;
          margin-left: -7px;
        }

        .epsms-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .epsms-govt-badge {
          width: 6px;
          height: 32px;
          background: var(--epsms-green);
          border-radius: 4px;
        }

        .epsms-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--epsms-green);
          margin: 0;
          letter-spacing: 0.3px;
        }

        .epsms-title span {
          font-weight: 600;
          color: var(--epsms-red);
        }

        .epsms-header-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* Buttons */
        .epsms-icon-btn,
        .epsms-user-info {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .epsms-icon-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
          background: var(--epsms-red-light);
          color: var(--epsms-red);
        }

        .epsms-user-info:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px var(--epsms-border);
        }

        .epsms-icon-btn:active,
        .epsms-user-info:active {
          transform: scale(0.96);
        }

        .epsms-icon-btn {
          position: relative;
          background: var(--epsms-red);
          border: 1px solid var(--epsms-border);
          font-size: 18px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;

          display: flex;
          align-items: center;
          justify-content: center;

          transition: 
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.2s ease;
        }

        /* Panels */
        .epsms-user-menu {
          animation: popIn 0.18s ease-out;
          backdrop-filter: blur(2px);
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* User */
        .epsms-user-wrapper {
          position: relative;
        }

        .epsms-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          min-width: 0;  
        }

        .epsms-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--epsms-red);
          color: var(--epsms-red-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;

          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }

        .epsms-user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--epsms-text-dark);
          max-width: 140px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .epsms-user-menu {
          position: absolute;
          right: 0;
          top: 44px;
          background: var(--epsms-red-light);
          border: 1px solid var(--epsms-border);
          border-radius: 10px;
          box-shadow: 0 14px 36px rgba(0,0,0,0.16);
          overflow: hidden;
          z-index: 100;
        }

        .epsms-logout-btn {
          width: 100%;
          padding: 10px 14px;
          background: var(--epsms-red-light);
          border: none;
          color: var(--epsms-red);
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .epsms-logout-btn:hover {
          background: var(--epsms-red);
          color: var(--epsms-red-light);
        }

        /* ---------------- BURGER BUTTON ---------------- */

        .epsms-burger {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 2px solid var(--epsms-red);
          background: #ffffff;
          cursor: pointer;
          position: relative;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          transition: 
            transform 0.15s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        /* Burger lines */

        .epsms-burger span {
          width: 20px;
          height: 3px;
          background: var(--epsms-red);
          border-radius: 3px;
          transition: transform 0.32s cubic-bezier(.4,.0,.2,1),
                      opacity 0.2s ease;
        }

        /* Hover */

        .epsms-burger:hover {
          background: var(--epsms-red);
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
        }

        .epsms-burger:hover span {
          background: #ffffff;
        }

        .epsms-burger:active {
          transform: scale(0.92);
        }

        /* ---------------- OPEN ANIMATION ---------------- */

        /* Top line */

        .epsms-burger.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        /* Middle line */

        .epsms-burger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        /* Bottom line */

        .epsms-burger.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* ---------------- MOBILE ONLY ---------------- */

        @media (max-width: 768px) {

          .epsms-burger {
            display: flex;
          }

          .epsms-header-right {
            display: none;
          }

        } 
      `}</style>
        </header>
    );
}