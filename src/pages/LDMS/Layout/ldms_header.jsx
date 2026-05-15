import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_API, LDMS_API } from "../../../api/axios"; // Imported LDMS_API
import { clearAuth } from "../../../utils/storage";
import ldmsLogo from "../../../assets/ldms_logo.png";
import NotifNew from "../../../assets/SiteAssets/new.gif";
import NotificationModal from "./NotificationModal";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";

export default function LdmsHeader({ onBurgerClick }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useContext(AuthContext) || {};
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);

  // --- NEW: Notification State ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedNotif, setModalSelectedNotif] = useState(null);

  const handleBurger = () => {
    setBurgerOpen(!burgerOpen);
    onBurgerClick();
  };

  const username = user?.username || user?.name || user?.email || "User";
  const avatarLetter = username.charAt(0).toUpperCase();

  // --- NEW: Fetch Notifications Logic ---
  const fetchNotifications = async () => {
    try {
      // Fetch the first page of notifications
      const res = await LDMS_API.NotificationsList({ page: 1 });
      const data = res?.data?.results || res?.data || [];

      // Keep only top 5 for the dropdown
      const top5 = data.slice(0, 5);
      setNotifications(top5);

      // Calculate unread count (from the visible dropdown items)
      setUnreadCount(top5.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // --- NEW: Auto-Refresh Interval (5 seconds) ---
  useEffect(() => {
    if (user) {
      fetchNotifications(); // Initial fetch
      const intervalId = setInterval(fetchNotifications, 5000);
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [user]);

  // --- NEW: Handle Mark as Read ---
  const handleNotificationClick = async (notif) => {
    // 1. Mark as read instantly in the dropdown
    if (!notif.is_read) {
      try {
        await LDMS_API.MarkNotificationRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }

    // 2. Open Modal and pass the clicked notification
    setModalSelectedNotif({ ...notif, is_read: true }); // Ensure it passes as read
    setIsModalOpen(true);
    setShowNotifications(false); // Close the dropdown
  };

  // --- NEW: Handle "Show All" click ---
  const handleShowAllClick = (e) => {
    e.preventDefault();
    setModalSelectedNotif(null); // No specific notification selected
    setIsModalOpen(true);
    setShowNotifications(false); // Close the dropdown
  };

  // Helper to strip/truncate long descriptions
  const truncateText = (text, maxLength = 45) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

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
    <>
      <header className="ldms-header">
        {/* -------- LEFT -------- */}
        <div className="ldms-header-left">
          <img src={ldmsLogo} className="ldms-applogo" alt="LDMS Logo" />
          <span className="ldms-govt-badge" />
          <h1 className="ldms-title">
            Lakhpati Didi <span>Management System</span>
          </h1>
        </div>

        {/* Mobile Burger */}
        <button
          className={`ldms-burger ${burgerOpen ? "open" : ""}`}
          onClick={handleBurger}
        >
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </button>

        {/* -------- RIGHT -------- */}
        <div
          className={`ldms-header-right ${showMobileMenu ? "mobile-open" : ""}`}
        >
          {/* Notifications */}
          <div className="ldms-notification-wrapper">
            <button
              className="ldms-icon-btn"
              onClick={() => {
                setShowNotifications((v) => !v);
                setShowUserMenu(false);
              }}
              title="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="ldms-notification-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="ldms-notification-panel pop-animate">
                <div className="ldms-notification-header">Notifications</div>

                <div className="ldms-notification-list">
                  {notifications.length === 0 ? (
                    <div className="ldms-notif-empty">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`ldms-notification-item ${!n.is_read ? "unread" : ""}`}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div className="ldms-notif-content">
                          <strong className="ldms-notif-title">
                            {n.title}
                          </strong>
                          <span className="ldms-notif-text">
                            {truncateText(n.message)}
                          </span>
                        </div>

                        {/* ONLY show new.gif if it is UNREAD */}
                        {!n.is_read && (
                          <img
                            src={NotifNew}
                            className="ldms-notif-new"
                            alt="new"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Show More Link */}
                <div className="ldms-notif-footer">
                  <a href="#" onClick={handleShowAllClick}>
                    Show all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="ldms-user-wrapper">
            <button
              className="ldms-user-info"
              onClick={() => {
                setShowUserMenu((v) => !v);
                setShowNotifications(false);
              }}
            >
              <div className="ldms-user-avatar">{avatarLetter}</div>
              <span className="ldms-user-name">{username}</span>
            </button>

            {showUserMenu && (
              <div className="ldms-user-menu pop-animate">
                <button onClick={handleLogout} className="ldms-logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* -------- STYLES -------- */}
        <style>{`
        :root {
          --ldms-red: #c62828;
          --ldms-red-light: #fdecea;
          --ldms-border: #f1c0c0;
          --ldms-text-dark: #1f2937;
          --ldms-text-muted: #6b7280;
          --ldms-green: #189218;
        }

        .ldms-header {
          height: 60px;
          background: var(--ldms-red);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 50;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .ldms-applogo {
          height: 40px;
          width: 40px;                 
          margin-right: -5px;
          margin-left: -7px;
          background: #ffffff;         
          border-radius: 50%;          
          padding: 1px;                
          box-shadow: 0 2px 6px rgba(0,0,0,0.15); 
        }

        .ldms-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ldms-govt-badge {
          width: 6px;
          height: 32px;
          background: #ffffff;
          border-radius: 4px;
        }

        .ldms-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.3px;
        }

        .ldms-title span {
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .ldms-header-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* Buttons */
        .ldms-icon-btn,
        .ldms-user-info {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .ldms-icon-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
          background: #f9fafb;
          color: var(--ldms-red);
        }

        .ldms-user-info:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(198,40,40,0.15);
        }

        .ldms-icon-btn:active,
        .ldms-user-info:active {
          transform: scale(0.96);
        }

        .ldms-icon-btn {
          position: relative;
          background: var(--ldms-red);
          border: 1px solid #fff;
          font-size: 18px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
          color: #fff;
        }

        .ldms-notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--ldms-green);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }

        /* Panels */
        .ldms-notification-panel,
        .ldms-user-menu {
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

        .ldms-notification-panel {
          position: absolute;
          right: 0;
          top: 44px;
          width: 320px;
          background: #ffffff;
          border: 1px solid var(--ldms-border);
          border-radius: 10px;
          box-shadow: 0 14px 36px rgba(0,0,0,0.16);
          overflow: hidden;
          z-index: 100;
        }

        .ldms-notification-header {
          padding: 12px 16px;
          font-weight: 800;
          font-size: 14px;
          background: var(--ldms-red-light);
          color: var(--ldms-red);
          border-bottom: 1px solid var(--ldms-border);
        }

        .ldms-notification-list {
          max-height: 350px;
          overflow-y: auto;
        }

        .ldms-notif-empty {
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: var(--ldms-text-muted);
        }

        .ldms-notification-item {
          position: relative;
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.15s ease;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .ldms-notification-item:last-child {
          border-bottom: none;
        }

        .ldms-notification-item:hover {
          background: #f9fafb;
        }

        .ldms-notification-item.unread {
          background: #fff5f5;
        }
        .ldms-notification-item.unread:hover {
          background: #fdecea;
        }

        .ldms-notif-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .ldms-notif-title {
          font-size: 13px;
          color: var(--ldms-red);
          line-height: 1.2;
        }

        .ldms-notif-text {
          font-size: 12px;
          color: var(--ldms-text-dark);
          line-height: 1.4;
        }

        .ldms-notif-new {
          width: 28px;
          flex-shrink: 0;
          border-radius: 4px;  
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);                 
        }

        .ldms-notif-footer {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          padding: 10px;
          text-align: center;
        }

        .ldms-notif-footer a {
          color: var(--ldms-red);
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .ldms-notif-footer a:hover {
          text-decoration: underline;
        }

        /* User */
        .ldms-user-wrapper {
          position: relative;
        }

        .ldms-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          min-width: 0;  
        }

        .ldms-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          color: var(--ldms-red);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }

        .ldms-user-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ldms-user-menu {
          position: absolute;
          right: 0;
          top: 44px;
          background: #ffffff;
          border: 1px solid var(--ldms-border);
          border-radius: 10px;
          box-shadow: 0 14px 36px rgba(0,0,0,0.16);
          overflow: hidden;
          z-index: 100;
        }

        .ldms-logout-btn {
          width: 100%;
          padding: 10px 24px;
          background: #ffffff;
          border: none;
          color: var(--ldms-red);
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .ldms-logout-btn:hover {
          background: var(--ldms-red-light);
        }

        /* ---------------- BURGER BUTTON ---------------- */
        .ldms-burger {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 2px solid var(--ldms-red);
          background: #ffffff;
          cursor: pointer;
          position: relative;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .ldms-burger span {
          width: 20px;
          height: 3px;
          background: var(--ldms-red);
          border-radius: 3px;
          transition: transform 0.32s cubic-bezier(.4,.0,.2,1), opacity 0.2s ease;
        }

        .ldms-burger:hover {
          background: var(--ldms-red);
          box-shadow: 0 6px 16px rgba(0,0,0,0.25);
        }

        .ldms-burger:hover span {
          background: #ffffff;
        }

        .ldms-burger:active {
          transform: scale(0.92);
        }

        /* Top line */
        .ldms-burger.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        /* Middle line */
        .ldms-burger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        /* Bottom line */
        .ldms-burger.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* ---------------- MOBILE ONLY ---------------- */
        @media (max-width: 768px) {
          .ldms-burger {
            display: flex;
          }
          .ldms-header-right {
            display: none;
          }
        } 
      `}</style>
      </header>

      {/* Render the Modal Outside the Header Flow */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSelectedNotif={modalSelectedNotif}
      />
    </>
  );
}
