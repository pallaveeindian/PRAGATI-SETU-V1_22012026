import React, { useState, useEffect } from "react";
import { LDMS_API } from "../../../api/axios";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function NotificationModal({
  isOpen,
  onClose,
  initialSelectedNotif,
}) {
  const [notifications, setNotifications] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize selected notification when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveItem(initialSelectedNotif || null);
      fetchNotifications(1, "");
    }
  }, [isOpen, initialSelectedNotif]);

  // --- NEW: Helper to parse and highlight dates ---
  const formatNotificationMessage = (text) => {
    if (!text) return null;

    // Split the text by the M/YYYY or MM/YYYY pattern
    // The capture group () ensures the date itself is kept in the resulting array
    const parts = text.split(/(\d{1,2}\/\d{4})/);

    return parts.map((part, index) => {
      // Check if this specific part is the date
      const match = part.match(/^(\d{1,2})\/(\d{4})$/);
      if (match) {
        const monthIndex = parseInt(match[1], 10) - 1; // JS months are 0-indexed
        const year = match[2];
        const dateObj = new Date(year, monthIndex);
        const monthName = dateObj.toLocaleString("default", { month: "long" });

        return (
          <span key={index} className="ldms-highlight-date">
            {monthName} {year}
          </span>
        );
      }
      // Return normal text if it's not a date
      return part;
    });
  };

  const fetchNotifications = async (currentPage, searchQuery) => {
    setLoading(true);
    try {
      const res = await LDMS_API.NotificationsList({
        page: currentPage,
        search: searchQuery,
      });
      const data = res?.data?.results || res?.data || [];
      const count = res?.data?.count || 0;

      setNotifications(data);
      setTotalCount(count);
      setPage(currentPage);
    } catch (error) {
      console.error("Failed to fetch modal notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchNotifications(1, e.target.value);
  };

  const handleItemClick = async (notif) => {
    setActiveItem(notif);

    if (!notif.is_read) {
      try {
        await LDMS_API.MarkNotificationRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
        );
        setActiveItem({ ...notif, is_read: true });
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
  };

  if (!isOpen) return null;

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="ldms-modal-overlay">
      {/* Outer container acts as the .card with the animated background */}
      <div className="ldms-modal-container">
        {/* Inner container acts as the .content to block the middle */}
        <div className="ldms-modal-inner">
          {/* Modal Header */}
          <div className="ldms-modal-header">
            <h2>All Notifications</h2>
            <button className="ldms-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Modal Body: 2 Columns */}
          <div className="ldms-modal-body">
            {/* LEFT COLUMN: List */}
            <div className="ldms-notif-sidebar">
              <div className="ldms-search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <div className="ldms-modal-list">
                {loading ? (
                  <div className="ldms-loading">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="ldms-empty">No notifications found.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`ldms-modal-list-item ${!n.is_read ? "unread" : ""} ${activeItem?.id === n.id ? "active" : ""}`}
                      onClick={() => handleItemClick(n)}
                    >
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-date">
                        {new Date(n.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="ldms-pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => fetchNotifications(page - 1, search)}
                  >
                    Prev
                  </button>
                  <span>
                    {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => fetchNotifications(page + 1, search)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Details */}
            <div className="ldms-notif-detail">
              {activeItem ? (
                <div className="notif-detail-content">
                  <div className="detail-header">
                    <h3>{activeItem.title}</h3>
                    <span
                      className={`priority-badge ${activeItem.priority?.toLowerCase()}`}
                    >
                      {activeItem.priority}
                    </span>
                  </div>
                  <div className="detail-meta">
                    Date: {new Date(activeItem.created_at).toLocaleString()} |
                    Type: {activeItem.notification_type}
                  </div>
                  <hr />
                  <div className="detail-message">
                    {/* MODIFIED: Wraps each line in the formatter function */}
                    {activeItem.message.split("\n").map((line, i) => (
                      <p key={i}>{formatNotificationMessage(line)}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ldms-empty-detail">
                  <p>Select a notification from the left to view details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ldms-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        /* -------------------------------------
           CARD ANIMATION STYLES (Adapted)
        -------------------------------------- */
        .ldms-modal-container {
          width: 85%;
          max-width: 1000px;
          height: 80vh;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          border-radius: 12px;
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
          cursor: default; /* Overriding pointer from original card */
        }

        /* The inner white card that blocks the gradient */
        .ldms-modal-inner {
          background: #ffffff;
          width: calc(100% - 6px); /* 3px gap for the glowing border */
          height: calc(100% - 6px);
          border-radius: 9px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden; /* Keeps child corners rounded */
        }

        /* Rotating Gradient Background */
        .ldms-modal-container::before {
          opacity: 0;
          content: " ";
          position: absolute;
          display: block;
          width: 1500px; /* Large enough to cover rotation */
          height: 1500px;
          /* Red/White gradient theme */
          background: linear-gradient(#c62828, #ecc9c6, #ec6262); 
          transition: opacity 300ms;
          animation: rotation_9018 8000ms infinite linear;
          animation-play-state: paused;
          z-index: 0;
        }

/* --- NEW: Date Highlight Style --- */
        .ldms-highlight-date {
          background: #fdecea;
          color: #c62828;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          box-shadow: 0 1px 2px rgba(198,40,40,0.15);
        }

        /* Blur overlay for the glowing border */
        .ldms-modal-container::after {
          position: absolute;
          content: " ";
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(20px);
          z-index: 0;
        }

        /* Trigger animation on hover */
        .ldms-modal-container:hover::before {
          opacity: 1;
          animation-play-state: running;
        }

        @keyframes rotation_9018 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Subtle inner glow for content */
        .ldms-modal-inner::before {
          opacity: 0;
          transition: opacity 300ms;
          content: " ";
          display: block;
          background: #c62828;
          width: 10px;
          height: 150px;
          position: absolute;
          filter: blur(50px);
          overflow: hidden;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ldms-modal-container:hover .ldms-modal-inner::before {
          opacity: 0.15; /* Extremely subtle red bleed inside */
        }

        /* -------------------------------------
           MODAL LAYOUT & CONTENT STYLES
        -------------------------------------- */
        .ldms-modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #fafafa; /* Themed red border */
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #740202;
        }
        .ldms-modal-header h2 {
          margin: 0;
          font-size: 18px;
          color: #ffffff; /* Themed red */
          font-weight: 700;
        }
        .ldms-modal-close {
          background: none; border: none; font-size: 20px; cursor: pointer; color: #ffffff;
        }
        .ldms-modal-close:hover { color: #ffffff; box-shadow: 0 0 5px #e45858; }
        
        .ldms-modal-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        /* Left Column */
        .ldms-notif-sidebar {
          width: 35%;
          border-right: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          background: #fafafa;
        }
        .ldms-search-bar {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          position: relative;
        }
        .ldms-search-bar input {
          width: 100%;
          padding: 10px 10px 10px 36px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ldms-search-bar input:focus {
          border-color: #c62828;
        }
        .ldms-search-bar .search-icon {
          position: absolute;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .ldms-modal-list {
          flex: 1;
          overflow-y: auto;
        }
        .ldms-modal-list-item {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background 0.2s, border-left 0.2s;
          border-left: 4px solid transparent;
        }
        .ldms-modal-list-item:hover { background: #fdf2f2; border-color: #520000; }
        
        /* Themed Active & Unread States */
        .ldms-modal-list-item.unread { 
          background: #fff5f5; 
          border-left: 4px solid #fca5a5; /* Soft Red */
        }
        .ldms-modal-list-item.active { 
          background: #fdecea; 
          border-left: 4px solid #c62828; /* Primary Red */
        }
        
        .notif-title { font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 4px; }
        .ldms-modal-list-item.active .notif-title { color: #c62828; }
        .notif-date { font-size: 12px; color: #6b7280; }
        
        .ldms-pagination {
          padding: 12px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
        }
        .ldms-pagination button {
          padding: 6px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
        }
        .ldms-pagination button:hover:not(:disabled) {
          background: #fdf2f2;
          color: #c62828;
          border-color: #f1c0c0;
        }
        .ldms-pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
        
        /* Right Column */
        .ldms-notif-detail {
          width: 65%;
          padding: 32px;
          overflow-y: auto;
          background: #fff;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .detail-header h3 { margin: 0; font-size: 22px; color: #111827; }
        .priority-badge {
          padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;
        }
        .priority-badge.critical { background: #fee2e2; color: #991b1b; }
        .priority-badge.high { background: #ffedd5; color: #c2410c; }
        
        .detail-meta { font-size: 13px; color: #6b7280; margin-bottom: 24px; }
        .detail-message p { font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 12px; }
        hr { border: none; border-top: 1px solid #f3f4f6; margin-bottom: 24px; }
        
        .ldms-empty, .ldms-loading, .ldms-empty-detail {
          padding: 32px; text-align: center; color: #6b7280;
        }
      `}</style>
    </div>
  );
}
