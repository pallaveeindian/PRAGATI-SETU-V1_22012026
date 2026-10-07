// src\pages\LoginComps\ModulesLogin.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MODULES_CONFIG } from "../../config/modulesConfig";
import login_bg from "../../assets/LoginBG/login_bg.png";
import login_header from "../../assets/LoginBG/login_header.png";
import { FaHome } from "react-icons/fa";

export default function ModulesLogin() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'operational', 'development'
  const [isMounted, setIsMounted] = useState(false);

  // Trigger mount animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer interval to update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to format countdown time
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const h = hours > 0 ? `${hours}h ` : "";
    const m = minutes > 0 ? `${minutes}m ` : "";
    const s = `${seconds}s`;
    return `${h}${m}${s}`;
  };

  // Process and categorize modules
  const { processedModules, activeCount, inactiveCount } = useMemo(() => {
    let aCount = 0;
    let iCount = 0;

    const processed = MODULES_CONFIG.map((mod, index) => {
      let isOperational = true;
      let timeRemaining = 0;
      let isPermanent = false;

      if (mod.maintenanceUntil) {
        if (mod.maintenanceUntil === "permanent") {
          isOperational = false;
          isPermanent = true;
        } else {
          timeRemaining =
            new Date(mod.maintenanceUntil).getTime() - currentTime;
          if (timeRemaining > 0) {
            isOperational = false;
          }
        }
      }

      if (isOperational) aCount++;
      else iCount++;

      return {
        ...mod,
        isOperational,
        timeRemaining,
        isPermanent,
        modCode: `MOD-${String(index + 1).padStart(2, "0")}`,
      };
    });

    return {
      processedModules: processed,
      activeCount: aCount,
      inactiveCount: iCount,
    };
  }, [currentTime]);

  // Apply Search and Tab Filters
  const displayedModules = processedModules.filter((mod) => {
    const s = search.toLowerCase();
    if (
      s &&
      !mod.title.toLowerCase().includes(s) &&
      !mod.desc?.toLowerCase().includes(s)
    ) {
      return false;
    }
    if (filter === "operational" && !mod.isOperational) return false;
    if (filter === "development" && mod.isOperational) return false;
    return true;
  });

  const activeList = displayedModules.filter((m) => m.isOperational);
  const inactiveList = displayedModules.filter((m) => !m.isOperational);

  return (
    <section className="ws-wrapper">
      <div className={`ws-container ${isMounted ? "mounted" : ""}`}>
        {/* TOP BAR: Breadcrumbs & Close */}
        <div className="ws-bg">
          <div className="ws-top-bar">
            <div className="ws-breadcrumbs">
              <span className="ws-home-icon">
                <FaHome style={{ color: "#F97519", fontSize: "24px" }} />
              </span>
              <span className="ws-bc-sep">&gt;</span> Digital Services
              <span className="ws-bc-sep">/</span>{" "}
              <strong>Secure Gateway</strong>
            </div>
            <button className="ws-close-btn" onClick={() => navigate("/")}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* HEADER AREA */}
          <div className="ws-header-area">
            <div className="ws-header-left">
              <h1 className="ws-title">
                Select a <span>workspace</span>
                {/* Constant Spinning Gear Animation */}
                <svg
                  className="ws-spin-gear"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </h1>
              <p className="ws-subtitle">
                Choose the system that matches your role.
              </p>
            </div>
            <div className="ws-header-stats">
              <span className="ws-stat">
                <span className="ws-dot green pulse"></span> {activeCount}{" "}
                operational
              </span>
              <span className="ws-stat-sep">|</span>
              <span className="ws-stat">
                <span className="ws-dot gray"></span> {inactiveCount} in
                development
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS AREA */}
        <div className="ws-content-bg">
          <div className="ws-controls-area">
            <div className="ws-search-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search systems, e.g. Training, Mapping, Sakhi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="ws-filter-group">
              <button
                className={`ws-filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h4v4H4V5zm0 10h4v4H4v-4zm10-10h4v4h-4V5zm0 10h4v4h-4v-4z" />
                </svg>
                All systems
              </button>
              <button
                className={`ws-filter-btn ${filter === "operational" ? "active-green" : ""}`}
                onClick={() => setFilter("operational")}
              >
                <span className="ws-dot green"></span> Operational
              </button>
              <button
                className={`ws-filter-btn ${filter === "development" ? "active-gray" : ""}`}
                onClick={() => setFilter("development")}
              >
                <span className="ws-dot gray"></span> In development
              </button>
            </div>
          </div>

          {/* ACTIVE MODULES GRID */}
          {activeList.length > 0 && (
            <div className="ws-section">
              <h3 className="ws-section-title">
                Operational Systems ({activeList.length})
              </h3>
              <div className="ws-grid">
                {activeList.map((mod, i) => (
                  <div
                    key={mod.id}
                    className="ws-card animate-up"
                    style={{
                      "--delay": `${i * 0.05}s`,
                      backgroundImage: `url(${mod.bg})`,
                    }}
                  >
                    <div className="ws-card-body">
                      <div
                        className="ws-card-icon"
                        style={{
                          backgroundColor: "#fff",
                          color: mod.color,
                        }}
                      >
                        <img src={mod.logo} alt={mod.title} />
                      </div>
                      <div className="ws-card-text">
                        <div className="ws-card-title-row">
                          <h4>{mod.title}</h4>
                          <span className="ws-mod-code">{mod.modCode}</span>
                        </div>
                        <p>{mod.desc}</p>
                      </div>
                    </div>
                    <div className="ws-card-status">
                      <span className="ws-dot green pulse"></span> Operational
                    </div>
                    <div className="ws-card-action">
                      <Link to={mod.path} className="ws-btn ws-btn-active">
                        Open workspace <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INACTIVE MODULES GRID */}
          {inactiveList.length > 0 && (
            <div
              className="ws-section"
              style={{ marginTop: activeList.length > 0 ? "40px" : "0" }}
            >
              <h3 className="ws-section-title dev">
                In development / Maintenance ({inactiveList.length})
              </h3>
              <div className="ws-grid">
                {inactiveList.map((mod, i) => (
                  <div
                    key={mod.id}
                    className="ws-card animate-up inactive"
                    style={{
                      "--delay": `${(activeList.length + i) * 0.05}s`,
                      backgroundImage: `url(${mod.bg})`,
                    }}
                  >
                    <div className="ws-card-body">
                      <div className="ws-card-icon grayscale">
                        <img src={mod.logo} alt={mod.title} />
                      </div>
                      <div className="ws-card-text">
                        <div className="ws-card-title-row">
                          <h4>{mod.title}</h4>
                          <span className="ws-mod-code">{mod.modCode}</span>
                        </div>
                        <p>{mod.desc}</p>
                      </div>
                    </div>
                    <div className="ws-card-status">
                      <span className="ws-dot gray"></span>
                      {mod.isPermanent
                        ? "Coming soon"
                        : `Maintenance: ${formatTime(mod.timeRemaining)}`}
                    </div>
                    <div className="ws-card-action">
                      <button className="ws-btn ws-btn-disabled" disabled>
                        Open workspace <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .ws-wrapper {
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
        }

        .ws-container {
          /* SURGICAL FIX: Make container transparent so internal BGs show */
          background-color: transparent; 
          width: 100%;
          max-width: 1300px;
          border-radius: 24px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2); /* Darker shadow for depth against modal */
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden; /* Ensures inner backgrounds respect border-radius */
          opacity: 0; /* Handled by mounting animation */
        }

        .ws-container.mounted {
          animation: fadeScaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeScaleIn {
          0% { opacity: 0; transform: scale(0.98) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* --- TOP BAR --- */
        .ws-bg {
          /* SURGICAL FIX: Properly format the header background */
          background-image: url(${login_header});
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          padding: 40px 50px 20px 50px; /* Moves padding from container to here */
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .ws-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .ws-breadcrumbs {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ws-home-icon {
          color: #f97316;
          font-size: 14px;
        }

        .ws-bc-sep {
          color: #cbd5e1;
        }

        .ws-breadcrumbs strong {
          color: #0f172a;
          font-weight: 600;
        }

        .ws-close-btn {
          background: #fff;
          border: 1px solid #F97316;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F97316;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ws-close-btn:hover {
          background: #F97316;
          color: #fff;
          transform: rotate(90deg);
        }

        /* --- HEADER --- */
        .ws-header-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .ws-title {
          font-size: 38px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          isolation: isolate;
        }

        .ws-title::before {
          content: "";
          position: absolute;
          inset: -10px -30px;
          background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.65)
          );
          filter: blur(14px);
          z-index: -1;
          pointer-events: none;
        }

        .ws-title span {
          color: #f97316;
        }

        .ws-spin-gear {
          width: 32px;
          height: 32px;
          color: #f97316;
          animation: spin-slow 8s linear infinite;
          opacity: 0.8;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ws-subtitle {
          color: #64686e;
          font-size: 16px;
          margin: 0;
          font-weight: 500;
          position: relative;
          isolation: isolate;
        }

        .ws-subtitle::before {
          content: "";
          position: absolute;
          inset: -10px -25px;
          background: rgba(255, 255, 255, 0.7);
          filter: blur(14px);
          z-index: -1;
          pointer-events: none;
        }

        .ws-header-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          background: #f8fafc;
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
        }

        .ws-stat {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ws-stat-sep {
          color: #cbd5e1;
        }

        .ws-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .ws-dot.green { background-color: #22c55e; }
        .ws-dot.gray { background-color: #94a3b8; }

        .ws-dot.pulse {
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        /* --- CONTROLS (SEARCH & FILTERS) --- */
        .ws-content-bg {
          /* SURGICAL FIX: Properly format the main body background */
          background-image: url(${login_bg});
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
          background-color: #f8fafc; /* Fallback */
          padding: 20px 50px 40px 50px; /* Moves padding from container to here */
          min-height: 500px;
        }

        .ws-controls-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .ws-search-box {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .ws-search-box svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #94a3b8;
        }

        .ws-search-box input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .ws-search-box input:focus {
          border-color: #f97316;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .ws-filter-group {
          display: flex;
          gap: 12px;
        }

        .ws-filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ws-filter-btn svg {
          width: 16px;
          height: 16px;
          color: #f97316;
        }

        .ws-filter-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .ws-filter-btn.active {
          background: #fff7ed;
          border-color: #f97316;
          color: #c2410c;
        }

        .ws-filter-btn.active-green {
          background: #f0fdf4;
          border-color: #22c55e;
          color: #15803d;
        }

        .ws-filter-btn.active-gray {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #334155;
        }

        /* --- SECTIONS --- */
        .ws-section-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 20px 0;
          border-left: 4px solid #f97316;
          padding-left: 12px;
          display: flex;
          align-items: center;
        }

        .ws-section-title.dev {
          border-left-color: #ef4444;
        }

        .ws-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        /* --- CARDS --- */
        .ws-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          overflow: hidden;
          opacity: 0; /* Handled by animate-up */
        }

        .ws-card.animate-up {
          animation: cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay);
        }

        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .ws-card:hover:not(.inactive) {
          border-color: #cbd5e1;
          box-shadow: 0 12px 30px -10px rgba(0,0,0,0.1);
          transform: translateY(-4px);
        }

        .ws-card-body {
          padding: 24px;
          display: flex;
          gap: 20px;
          flex: 1;
        }

        .ws-card-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
        }

        .ws-card-icon img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .ws-card-icon.grayscale img {
          filter: grayscale(100%);
          opacity: 0.6;
        }

        .ws-card-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ws-card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .ws-card-text h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        .ws-mod-code {
          font-size: 11px;
          font-weight: 600;
          color: #000000;
          letter-spacing: 0.5px;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .ws-card-text p {
          margin: 0;
          font-size: 13px;
          color: #fff;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ws-card-status {
          padding: 0 24px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ws-card-action {
          padding: 16px 24px;
          background: #fafaf9; /* Extremely subtle warm gray */
          border-top: 1px solid #f1f5f9;
        }

        .ws-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        .ws-btn span {
          transition: transform 0.2s;
        }

        .ws-btn-active {
          background-color: #fff7ed;
          color: #c2410c;
          border: 1px solid #ffedd5;
        }

        .ws-btn-active:hover {
          background-color: #F9751A;
          color: #fff;
          border-color: #F9751A;
        }

        .ws-btn-active:hover span {
          transform: translateX(4px);
        }

        .ws-btn-disabled {
          background-color: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
          border: 1px solid #e2e8f0;
        }

        /* --- RESPONSIVE DESIGN --- */
        @media (max-width: 900px) {
          .ws-header-area {
            flex-direction: column;
            align-items: flex-start;
          }
          .ws-controls-area {
            flex-direction: column;
            align-items: flex-start;
          }
          .ws-search-box {
            max-width: 100%;
          }
          .ws-filter-group {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          .ws-filter-btn {
            white-space: nowrap;
          }
        }

        @media (max-width: 600px) {
          .ws-wrapper { padding: 20px 10px; }
          .ws-container { border-radius: 16px; }
          /* SURGICAL FIX: Adjust inner padding for mobile */
          .ws-bg { padding: 30px 20px 15px 20px; }
          .ws-content-bg { padding: 15px 20px 30px 20px; }
          
          .ws-title { font-size: 28px; }
          .ws-grid { grid-template-columns: 1fr; }
          .ws-card-body { padding: 20px; }
        }
      `}</style>
    </section>
  );
}
