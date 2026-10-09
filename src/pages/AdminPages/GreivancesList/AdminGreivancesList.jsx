// src/pages/AdminPages/AdminGreivancesList.jsx
import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTimes,
  faSearch,
  faFilter,
  faTicketAlt,
  faUser,
  faMapMarkerAlt,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faPaperclip,
  faReply,
  faChevronLeft,
  faChevronRight,
  faInbox,
  faChartPie,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { SUPPORT_API } from "../../../api/axios";
import { AuthContext } from "../../../contexts/AuthContext";

export default function AdminGreivancesList() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [pmuResponse, setPmuResponse] = useState("");
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await SUPPORT_API.listTickets();
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setTickets(data);
      setFilteredTickets(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const searchTicket = () => {
    setCurrentPage(1);
    let data = [...tickets];

    if (ticketCode.trim()) {
      data = data.filter((x) =>
        x.ticket_code.toLowerCase().includes(ticketCode.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((x) =>
        statusFilter === "pending" ? !x.is_solved : x.is_solved,
      );
    }

    setFilteredTickets(data);
  };

  useEffect(() => {
    searchTicket();
    // Search is intentionally triggered by status changes; ticket search remains explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleView = async (code) => {
    try {
      setLoading(true);
      const res = await SUPPORT_API.getTicketDetails(code);
      setSelectedTicket(res.data);
      setPmuResponse(res.data.pmu_response || "");
      setOpen(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isPMUUser = Number(user?.role_id) === 9;

  const handleResolve = async () => {
    if (!isPMUUser) {
      alert("You are not authorized to resolve tickets.");
      return;
    }

    try {
      if (!pmuResponse.trim()) {
        alert("Please enter PMU response.");
        return;
      }

      await SUPPORT_API.resolveTicket(selectedTicket.ticket_code, {
        pmu_response: pmuResponse,
      });

      alert("Ticket resolved successfully.");
      setOpen(false);
      setPmuResponse("");
      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to resolve ticket.");
    }
  };

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const pendingCount = tickets.filter((ticket) => !ticket.is_solved).length;
  const solvedCount = tickets.filter((ticket) => ticket.is_solved).length;
  const visibleCount = filteredTickets.length;

  return (
    <div
      className="grievances-page"
      style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}
    >
      <style>{`
          .grievances-page { padding: 0 1rem 1.5rem; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); font-family: Inter, system-ui, -apple-system, sans-serif; color: #172033; }
          .card { background: rgba(255,255,255,.94); padding: 1.35rem; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 14px 35px rgba(30,41,59,.08); margin-top: 1.25rem; }
          .page-intro { display:flex; align-items:center; justify-content:space-between; gap:16px; margin: 0 0 1.15rem; }
          .page-title-wrap { display:flex; align-items:center; gap:12px; }
          .page-icon { width:44px; height:44px; display:grid; place-items:center; border-radius:14px; background:linear-gradient(135deg, #8a0a0a, #720303); color:#fff; box-shadow:0 8px 18px rgb(109, 0, 0); font-size:18px; }
          .page-title { margin:0; font-size:1.2rem; font-weight:800; color:#172033; }
          .page-subtitle { margin:4px 0 0; color:#64748b; font-size:.82rem; }
          .ticket-count { padding:8px 12px; border-radius:999px; background:#eef2ff; color:#4338ca; font-size:.78rem; font-weight:800; white-space:nowrap; }
          .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.85rem; margin-bottom:1.1rem; }
          .stat-card { position:relative; overflow:hidden; display:flex; align-items:center; gap:12px; padding:1rem; border:1px solid #e5eaf1; border-radius:15px; background:#fff; }
          .stat-card::after { content:""; position:absolute; width:75px; height:75px; right:-25px; top:-28px; border-radius:50%;  background:rgba(99,102,241,.08); }
          .stat-icon { width:38px; height:38px; display:grid; place-items:center; border-radius:12px; font-size:15px; }
          .stat-icon.total { background:#eef2ff; color:#4f46e5; } .stat-icon.pending { background:#fff7d6; color:#b45309; } .stat-icon.solved { background:#dcfce9; color:#15803d; }
          .stat-label { display:block; color:#64748b; font-size:.7rem; font-weight:800; text-transform:uppercase; letter-spacing:.05em; } .stat-value { display:block; margin-top:3px; color:#172033; font-size:1.2rem; font-weight:900; }
          .search-section { display: grid; grid-template-columns: minmax(220px, 1.25fr) minmax(170px, .8fr) auto auto; gap: .75rem; margin-bottom: 1.15rem; padding: 1rem; border-radius: 16px; background: #f8fafc; border: 1px solid #e8edf4; }
          .field-wrap { position:relative; display:flex; align-items:center; }
          .field-icon { position:absolute; left:13px; color:#64748b; font-size:13px; pointer-events:none; }
          .search-input, .status-select { width:100%; padding: .72rem .85rem .72rem 2.25rem; border: 1px solid #dbe3ef; background:#fff; border-radius: 10px; font-size: 13px; outline: none; box-sizing: border-box; color:#334155; }
          .search-input:focus, .status-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.13); }
          .btn-search, .btn-clearfilter { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding: .72rem 1.1rem; border:0; border-radius:10px; cursor:pointer; font-weight:800; font-size:13px; transition:transform .2s, box-shadow .2s; white-space:nowrap; }
          .btn-search { background: linear-gradient(135deg, #8a0a0a, #720303); color:#fff; box-shadow:0 6px 14px rgba(109, 0, 0,.2); }
          .btn-search:disabled { opacity:.65; cursor:not-allowed; transform:none; }
          .btn-clearfilter { background:#fff; color:#475569; border:1px solid #dbe3ef; }
          .btn-search:hover, .btn-clearfilter:hover { transform:translateY(-1px); box-shadow:0 7px 15px rgba(30,41,59,.12); }
          .table-shell { overflow-x:auto; border:1px solid #e5eaf1; border-radius:14px; }
          table { width: 100%; min-width: 850px; border-collapse: collapse; table-layout: auto; }
          thead th { position: sticky; top: 0; z-index: 20; background: #f8fafc; padding: .9rem .85rem; text-align: left; font-size: .7rem; color: #64748b; text-transform: uppercase; letter-spacing:.05em; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
          tbody tr { transition:background .18s; }
          tbody tr:hover { background:#f8faff; }
          td { padding: .85rem; border-bottom: 1px solid #edf1f6; font-size: .82rem; color: #334155; white-space: normal; word-break: break-word; overflow-wrap: break-word; }
          table td:nth-child(2), table td:nth-child(4) { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          table td:nth-child(7) { text-align: center; }
          .chip-pending, .chip-solved { display:inline-flex; align-items:center; gap:6px; white-space:nowrap; padding:.35rem .65rem; border-radius:999px; font-size:.7rem; font-weight:800; }
          .chip-pending { background:#fff7d6; color:#a16207; }
          .chip-solved { background:#dcfce9; color:#15803d; }
          .view-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 10px; border:0; border-radius:8px; background:#eef2ff; color:#4338ca; cursor:pointer; font-weight:800; font-size:.76rem; }
          .view-btn:hover { background:#4f46e5; color:#fff; }
          .ticket-code { display:inline-flex; align-items:center; gap:7px; color:#3730a3; font-weight:800; }
          .ticket-code-icon { width:24px; height:24px; display:grid; place-items:center; border-radius:7px; background:#eef2ff; color:#6366f1; font-size:10px; }
          .user-cell { display:flex; align-items:center; gap:8px; min-width:140px; } .user-avatar { width:29px; height:29px; display:grid; place-items:center; flex:none; border-radius:9px; background:linear-gradient(135deg,#e0e7ff,#ede9fe); color:#4338ca; font-size:.65rem; font-weight:900; }
          .empty-state { padding:3rem 1rem; text-align:center; color:#64748b; } .empty-icon { width:48px; height:48px; display:grid; place-items:center; margin:0 auto .7rem; border-radius:15px; background:#f1f5f9; color:#94a3b8; font-size:20px; } .empty-state strong { display:block; color:#334155; margin-bottom:4px; }
          .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.62); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 9999; }
          .modal { background: white; width: 100%; max-width: 900px; max-height: calc(100vh - 2rem); border-radius: 20px; padding: 1.35rem; box-shadow: 0 25px 70px rgba(15,23,42,.28); overflow-y: auto; animation: slideInRight 0.25s ease-out; }
          .modal-header { display:flex; justify-content:space-between; align-items:center; margin:-1.35rem -1.35rem 1.25rem; padding:1.2rem 1.35rem; background:linear-gradient(135deg,#312e81, #b60d0d 55%, #750804); color:#fff; border-radius:20px 20px 0 0; position:sticky; top:-1.35rem; z-index:10; }
          .modal-title-wrap { display:flex; align-items:center; gap:10px; }
          .modal-title-icon { width:38px; height:38px; display:grid; place-items:center; border-radius:11px; background:rgba(255,255,255,.18); }
          .modal-close { display:inline-flex; align-items:center; justify-content:center; gap:7px; min-width:38px; height:38px; padding:0 10px; border:1px solid rgba(255,255,255,.52); border-radius:11px; background:rgba(255,255,255,.14); color:#fff; cursor:pointer; font-size:13px; font-weight:800; transition:background .2s, transform .2s, box-shadow .2s; }
          .modal-close-icon { width:21px; height:21px; display:grid; place-items:center; border-radius:50%; background:rgba(255,255,255,.2); font-size:12px; }
          .modal-close:hover { background:rgba(255,255,255,.28); transform:translateY(-1px); box-shadow:0 5px 12px rgba(15,23,42,.18); }
          .modal-close:focus-visible { outline:3px solid rgba(255,255,255,.8); outline-offset:3px; }
          .modal-close:active { transform:translateY(0); }
          @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
          .grid-info { gap: .9rem; }
          .info-box { position:relative; overflow:hidden; border:1px solid #e3e9f3; padding:1.05rem; border-radius:16px; background:linear-gradient(145deg,#ffffff 0%,#f8faff 100%); box-shadow:0 5px 15px rgba(30,41,59,.035); }
          .info-box::before { content:""; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,#4f46e5,#38bdf8); }
          .info-title { display:flex; align-items:center; gap:7px; font-size: .7rem; color: #4f46e5; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: .07em; }
          .info-row { display:flex; justify-content:space-between; gap:12px; margin-bottom:.65rem; font-size:.82rem; color:#475569; }
          .info-row:last-child { margin-bottom:0; }
          .info-row b { color:#172033; text-align:right; }
          .section-label { display:flex; align-items:center; gap:7px; font-size: .7rem; color: #64748b; font-weight: 900; text-transform: uppercase; margin: 1.35rem 0 .55rem; letter-spacing: .07em; }
          .box-container { border:1px solid #e1e8f2; padding:1rem 1.05rem; border-radius:15px; font-size:.86rem; line-height:1.7; color: #334155; background:linear-gradient(145deg, #fbfdff, #f8fafc); }
          .attachment-box { display:flex; align-items:center; gap:10px; min-height:56px; }
          .attachment-thumb { width:104px; height:70px; object-fit:cover; border-radius:10px; border:1px solid #dbe3ef; background: #f1f5f9; }
          .attachment-fallback { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:9px; background: #f1f5f9; color: #64748b; font-size:.78rem; font-weight:700; }
          .response-panel { padding:1rem; border-radius:15px; background:linear-gradient(145deg, #f5f7ff, #ffffff); border:1px solid #e1e7f5; }
          .response-toolbar { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:.65rem; }
          .response-hint { color:#94a3b8; font-size:.72rem; }
          .textarea-response { width:100%; padding:1rem; border:1px solid #dbe3ef; border-radius:12px; min-height:128px; box-sizing:border-box; margin-top:0; resize:vertical; font:inherit; outline:none; background: #fff; }
          .textarea-response:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(5, 75, 46, 0.12); }
          .footer-actions { display:flex; justify-content:flex-end; gap:.7rem; margin-top:1.35rem; padding-top:1rem; border-top:1px solid #e8edf4; }
          .btn-cancel { background:#fff; border:1px solid #dbe3ef; border-radius:10px; cursor:pointer; color:#475569; font-weight:800; padding:.7rem 1.15rem; }
          .btn-cancel:hover { border-color:#94a3b8; background:#f8fafc; }
          .btn-resolve { display:inline-flex; align-items:center; gap:8px; padding:.7rem 1.25rem; background:linear-gradient(135deg,#16a34a,#15803d); color:white; border:0; border-radius:10px; cursor:pointer; font-weight:800; box-shadow:0 6px 14px rgba(22,163,74,.2); }
          .btn-resolve:hover { transform:translateY(-1px); box-shadow:0 8px 17px rgba(22,163,74,.28); }
          .error-placeholder { width: 100px; height: 75px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: bold; border-radius: 4px; }
          .pagination { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:1rem; flex-wrap:wrap; }
          .page-summary { color:#64748b; font-size:.78rem; font-weight:700; }
          .pagination button { min-width:38px; height:38px; border:1px solid #d1d5db; background:#fff; color:#334155; border-radius:8px; cursor:pointer; transition:.2s; font-weight:600; }
          .pagination button:hover:not(:disabled) { background:#2563eb; color:#fff; border-color:#2563eb; }
          .pagination button.active { background:#2563eb; color:#fff; border-color:#2563eb; }
          .pagination button:disabled { opacity:.5; cursor:not-allowed; }
          .image-preview-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.85); display:flex; justify-content:center; align-items:center; z-index:99999; }
          .image-preview-box { position:relative; max-width:90vw; max-height:90vh; }
          .image-preview-box img { max-width:90vw; max-height:90vh; object-fit:contain; border-radius:8px; background:#fff; }
          .image-preview-close { position:absolute; top:-15px; right:-15px; width:38px; height:38px; border:none; border-radius:50%; cursor:pointer; font-size:18px; font-weight:bold; }
          @media (max-width: 760px) { .grievances-page { padding:0 .65rem 1rem; } .search-section { grid-template-columns:1fr; } .page-intro { align-items:flex-start; } .ticket-count { margin-top:4px; } .grid-info, .stats-grid { grid-template-columns:1fr; } .pagination { justify-content:center; } .page-summary { width:100%; text-align:center; } .modal-close { padding:0 8px; } .modal-close > span:last-child { display:none; } }
        `}</style>

      <div className="card">
        <div className="page-intro">
          <div className="page-title-wrap">
            <div className="page-icon">
              <FontAwesomeIcon icon={faInbox} />
            </div>
            <div>
              <h1 className="page-title">Grievances Management</h1>
              <p className="page-subtitle">
                Review, track and resolve support tickets from one place.
              </p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon total">
                  <FontAwesomeIcon icon={faChartPie} />
                </span>
                <div>
                  <span className="stat-label">Total tickets</span>
                  <span className="stat-value">{tickets.length}</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon pending">
                  <FontAwesomeIcon icon={faHourglassHalf} />
                </span>
                <div>
                  <span className="stat-label">Awaiting action</span>
                  <span className="stat-value">{pendingCount}</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon solved">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </span>
                <div>
                  <span className="stat-label">Resolved tickets</span>
                  <span className="stat-value">{solvedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="search-section">
          <div className="field-wrap">
            <FontAwesomeIcon className="field-icon" icon={faSearch} />
            <input
              className="search-input"
              placeholder="Search by ticket number..."
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
            />
          </div>

          <div className="field-wrap">
            <FontAwesomeIcon className="field-icon" icon={faFilter} />
            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="solved">Solved</option>
            </select>
          </div>

          <button
            className="btn-search"
            onClick={searchTicket}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSearch} /> Search
          </button>
          <button
            className="btn-clearfilter"
            onClick={() => {
              setTicketCode("");
              setStatusFilter("all");
              setCurrentPage(1);
              setFilteredTickets(tickets);
            }}
          >
            <FontAwesomeIcon icon={faTimes} /> Clear
          </button>
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Ticket No.</th>
                <th>Username</th>
                <th>District</th>
                <th>Block</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <FontAwesomeIcon icon={faHourglassHalf} />
                      </div>
                      <strong>Loading tickets...</strong>
                      <span>
                        Please wait while we fetch the latest grievances.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <FontAwesomeIcon icon={faInbox} />
                      </div>
                      <strong>No grievances found</strong>
                      <span>
                        Try changing the search text or status filter.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket, i) => (
                  <tr key={ticket.id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    <td>
                      <span className="ticket-code">
                        <span className="ticket-code-icon">
                          <FontAwesomeIcon icon={faTicketAlt} />
                        </span>
                        {ticket.ticket_code}
                      </span>
                    </td>
                    <td>
                      <span className="user-cell">
                        <span className="user-avatar">
                          {(ticket.ticket_body?.username ||
                            "N")[0].toUpperCase()}
                        </span>
                        <span>{ticket.ticket_body?.username || "N/A"}</span>
                      </span>
                    </td>
                    <td>
                      {ticket.ticket_body?.district_obj?.district_name_en ||
                        "N/A"}
                    </td>
                    <td>
                      {ticket.ticket_body?.block_obj?.block_name_en || "N/A"}
                    </td>
                    <td>
                      <span
                        className={
                          ticket.is_solved ? "chip-solved" : "chip-pending"
                        }
                      >
                        <FontAwesomeIcon
                          icon={ticket.is_solved ? faCheckCircle : faClock}
                        />
                        {ticket.is_solved ? "Solved" : "Pending"}
                      </span>
                    </td>
                    <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleView(ticket.ticket_code)}
                        className="view-btn"
                      >
                        <FontAwesomeIcon icon={faEye} /> View ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="page-summary">
            Showing {visibleCount ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
            {Math.min(currentPage * ITEMS_PER_PAGE, visibleCount)} of{" "}
            {visibleCount}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {open && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-title-icon">
                  <FontAwesomeIcon icon={faTicketAlt} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>
                    Ticket Overview
                  </h3>
                  <small style={{ opacity: 0.78 }}>
                    {selectedTicket.ticket_code}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close ticket overview"
                title="Close ticket overview"
              >
                <span className="modal-close-icon">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <span>Close</span>
              </button>
            </div>

            <div className="grid-info">
              <div className="info-box">
                <div className="info-title">
                  <FontAwesomeIcon icon={faTicketAlt} /> Ticket Information
                </div>
                <div className="info-row">
                  <span>Ticket Number</span> <b>{selectedTicket.ticket_code}</b>
                </div>
                <div className="info-row">
                  <span>Status</span>{" "}
                  <span
                    className={
                      selectedTicket.is_solved ? "chip-solved" : "chip-pending"
                    }
                  >
                    {selectedTicket.is_solved ? "Solved" : "Pending"}
                  </span>
                </div>
                <div className="info-row">
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Created On
                  </span>{" "}
                  {new Date(selectedTicket.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="info-box">
                <div className="info-title">
                  <FontAwesomeIcon icon={faUser} /> User Information
                </div>
                <div className="info-row">
                  <span>Username</span>{" "}
                  <b>{selectedTicket.ticket_body?.username || "N/A"}</b>
                </div>
                <div className="info-row">
                  <span>Mobile No</span>{" "}
                  {selectedTicket.ticket_body?.mobile_no || "N/A"}
                </div>
                <div className="info-row">
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> District
                  </span>{" "}
                  {selectedTicket.ticket_body?.district_obj?.district_name_en ||
                    "N/A"}
                </div>
                <div className="info-row">
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Block
                  </span>{" "}
                  {selectedTicket.ticket_body?.block_obj?.block_name_en ||
                    "N/A"}
                </div>
              </div>
            </div>

            <div className="section-label">
              <FontAwesomeIcon icon={faReply} /> Problem Description
            </div>
            <div className="box-container" style={{ background: "#f8fafc" }}>
              {selectedTicket.ticket_body?.problem_message ||
                "No description provided."}
            </div>

            <div className="section-label">
              <FontAwesomeIcon icon={faPaperclip} /> Attached Screenshots
            </div>
            <div className="box-container attachment-box">
              {selectedTicket.ticket_media &&
              selectedTicket.ticket_media.length > 0 ? (
                selectedTicket.ticket_media.map((img, i) => (
                  <span key={i}>
                    <img
                      className="attachment-thumb"
                      src={img.screenshot}
                      alt={`Screenshot ${i + 1}`}
                      onClick={() => setPreviewImage(img.screenshot)}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling.style.display =
                          "flex";
                      }}
                    />
                    <span
                      className="attachment-fallback"
                      style={{ display: "none" }}
                    >
                      <FontAwesomeIcon icon={faPaperclip} /> Preview unavailable
                    </span>
                  </span>
                ))
              ) : (
                <div className="attachment-fallback">
                  <FontAwesomeIcon icon={faPaperclip} /> No screenshots attached
                </div>
              )}
            </div>

            {isPMUUser ? (
              <>
                <div className="section-label">
                  <FontAwesomeIcon icon={faReply} /> PMU Response
                </div>
                <div className="response-panel">
                  <div className="response-toolbar">
                    <span className="response-hint">
                      Add an official response before resolving this ticket.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPmuResponse(
                          `Dear User,\n\n\nThank you.\n\nRegards,\nPragati Setu Grievance Portal`,
                        )
                      }
                      style={{
                        background: "#198844",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      <FontAwesomeIcon icon={faReply} /> Use template
                    </button>
                  </div>

                  <textarea
                    className="textarea-response"
                    placeholder="Enter official resolution or troubleshooting steps here..."
                    value={pmuResponse}
                    onChange={(e) => setPmuResponse(e.target.value)}
                  />
                </div>
              </>
            ) : (
              selectedTicket?.pmu_response && (
                <>
                  <div className="section-label">
                    <FontAwesomeIcon icon={faReply} /> PMU Response
                  </div>
                  <div
                    className="box-container"
                    style={{ background: "#f8fafc", whiteSpace: "pre-wrap" }}
                  >
                    {selectedTicket.pmu_response}
                  </div>
                </>
              )
            )}

            <div className="footer-actions">
              <button className="btn-cancel" onClick={() => setOpen(false)}>
                Cancel
              </button>

              {isPMUUser && (
                <button className="btn-resolve" onClick={handleResolve}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Resolve Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="image-preview-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-preview-close"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
}
