// src/pages/AdminPages/AdminGreivancesList.jsx
import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTimes,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { SUPPORT_API } from "../../api/axios";
import { AuthContext } from "../../contexts/AuthContext";
import AdminHeader from "../AdminPages/AdminHeader";
import AdminSidebar from "../AdminPages/AdminSidebar";
import AdminFooter from "../AdminPages/AdminFooter";
import TmsPortal from "../AdminPages/TmsPortal";

export default function AdminGreivancesList() {
  const { user } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Admin Dashboard');
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

    // Ticket Number Filter
    if (ticketCode.trim()) {
      data = data.filter((x) =>
        x.ticket_code.toLowerCase().includes(ticketCode.toLowerCase()),
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      data = data.filter((x) =>
        statusFilter === "pending" ? !x.is_solved : x.is_solved,
      );
    }

    setFilteredTickets(data);
  };

  useEffect(() => {
    searchTicket();
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
    // Prevent non-PMU users
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

  return (
   
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
    
      <AdminHeader />

     
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        
      <AdminSidebar 
    isCollapsed={isCollapsed} 
    onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
    activeMenu={activeMenu}
    setActiveMenu={setActiveMenu}
/>
     

        {/* Right Side: Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", backgroundColor: "#f8fafc" }}>
          
          {/* Conditional Rendering Based on Active Menu */}
          {activeMenu === 'TMS Portal' ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
              <TmsPortal />
            </div>
          ) : (
            <div className="grievances-page" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
            <style>{`
              .grievances-page { padding: 0 1rem 1rem; background: transparent; font-family: sans-serif; }
              .card { background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 1.25rem; }
              .search-section { display: flex; gap: 1rem; margin-bottom: 2rem; }
              .search-input { flex: 1; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
              .btn-search { padding: 0.75rem 2rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
              .btn-clearfilter {
    padding: 0.75rem 1.5rem; 
    background: #16534b; 
    color: #fff; 
    border: 1px solid #cbd5e1; 
    border-radius: 8px; 
    cursor: pointer; 
    font-weight: 600;
    transition: 0.2s;
}
.btn-clearfilter:hover {
    background: #e2e8f0;
    color: #1e293b;
}
             table { 
    width: 100%; 
    border-collapse: collapse; 
    table-layout: auto; /* Auto size rakhega */
}

thead th {
    position: sticky;
    top: 0;
    z-index: 20;
    background: #ffffff;
    padding: 1rem;
    text-align: left;
    font-size: 0.80rem;
    color: #64748b;
    text-transform: uppercase;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,0.05);
    background-clip: padding-box;
}

td { 
    padding: 0.75rem; 
    border-bottom: 1px solid #e2e8f0; 
    font-size: 0.9rem; 
    color: #334155; 
    white-space: normal; 
    word-break: break-word; 
    overflow-wrap: break-word; 
}

table td:nth-child(2),
    table td:nth-child(4) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
              table td:nth-child(7) {
                text-align: center;
              }
              .chip-pending, .chip-solved {
                display: inline-block;
                white-space: nowrap;
                padding: 0.2rem 0.55rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600;
              }
              .chip-pending { background: #fef3c7; color: #92400e; }
              .chip-solved { background: #dcfce7; color: #166534; }
            
/* 1. Modal Overlay */
.modal-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.5); 
    display: flex; 
    align-items: center; 
    justify-content: center;
    padding: 2rem; 
    z-index: 9999; 
}

/* 2. Modal Box */
.modal { 
    background: white; 
    width: 100%; 
    max-width: 900px; 
  
    max-height: calc(100vh - 4rem);
    border-radius: 12px; 
    padding: 1.5rem; 
    box-shadow: -4px 0 25px rgba(0,0,0,0.15); 
    overflow-y: auto; 
    
   
    animation: slideInRight 0.3s ease-out; 
}


.modal-header { 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    margin-bottom: 1.5rem; 
    position: sticky; 
    top: -1.5rem; 
    background: white;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
    z-index: 10;
    border-bottom: 1px solid #e2e8f0;
}


@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
              .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
              .info-box { border: 1px solid #e2e8f0; padding: 1rem; border-radius: 8px; }
              .info-title { font-size: 0.7rem; color: #64748b; font-weight: 800; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
              .info-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: #334155; }
              .section-label { font-size: 0.7rem; color: #64748b; font-weight: 800; text-transform: uppercase; margin: 1.5rem 0 0.5rem 0; letter-spacing: 0.05em; }
              .box-container { border: 1px solid #e2e8f0; padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: #334155; }
              .textarea-response { width: 100%; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; min-height: 120px; box-sizing: border-box; margin-top: 0.5rem; }
              .footer-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
              .btn-cancel { background: transparent; border: none; cursor: pointer; color: #64748b; font-weight: 600; padding: 0.75rem 1.5rem; }
              .btn-resolve { padding: 0.75rem 2rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
              .error-placeholder { width: 100px; height: 75px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: bold; border-radius: 4px; }
              .pagination { display:flex; justify-content:center; align-items:center; gap:8px; margin-top:20px; flex-wrap:wrap; }
              .pagination button { min-width:38px; height:38px; border:1px solid #d1d5db; background:#fff; color:#334155; border-radius:8px; cursor:pointer; transition:.2s; font-weight:600; }
              .pagination button:hover:not(:disabled) { background:#2563eb; color:#fff; border-color:#2563eb; }
              .pagination button.active { background:#2563eb; color:#fff; border-color:#2563eb; }
              .pagination button:disabled { opacity:.5; cursor:not-allowed; }
              .search-section { display: flex; gap: 1rem; margin-bottom: 2rem; }
              .search-input, .status-select { flex: 1; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }
              .search-input:focus, .status-select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
              .btn-search { min-width: 140px; padding: 0.75rem 2rem; background: #2563eb; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
              .image-preview-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.85); display:flex; justify-content:center; align-items:center; z-index:99999; }
              .image-preview-box { position:relative; max-width:90vw; max-height:90vh; }
              .image-preview-box img { max-width:90vw; max-height:90vh; object-fit:contain; border-radius:8px; background:#fff; }
              .image-preview-close { position:absolute; top:-15px; right:-15px; width:38px; height:38px; border:none; border-radius:50%; cursor:pointer; font-size:18px; font-weight:bold; }
            `}</style>
            
            <div className="card">
              <div className="search-section">
                <input
                  className="search-input"
                  placeholder="Search Ticket Number..."
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                />

                <select
                  className="status-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="solved">Solved</option>
                </select>

                <button className="btn-search" onClick={searchTicket}>
                  Search
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
      Clear Filters
    </button>
              </div>
              

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
                  {paginatedTickets.map((ticket, i) => (
                    <tr key={ticket.id}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                      <td>{ticket.ticket_code}</td>
                      <td>{ticket.ticket_body?.username || "N/A"}</td>
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
                          {ticket.is_solved ? "Solved" : "Pending"}
                        </span>
                      </td>
                      <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleView(ticket.ticket_code)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            cursor: "pointer",
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
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
                  Next
                </button>
              </div>
            </div>

            {open && selectedTicket && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3 style={{ margin: 0 }}>Ticket Overview</h3>
                    <button
                      onClick={() => setOpen(false)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <div className="grid-info">
                    <div className="info-box">
                      <div className="info-title">Ticket Information</div>
                      <div className="info-row">
                        <span>Ticket Number</span>{" "}
                        <b>{selectedTicket.ticket_code}</b>
                      </div>
                      <div className="info-row">
                        <span>Status</span>{" "}
                        <span
                          className={
                            selectedTicket.is_solved
                              ? "chip-solved"
                              : "chip-pending"
                          }
                        >
                          {selectedTicket.is_solved ? "Solved" : "Pending"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span>Created On</span>{" "}
                        {new Date(selectedTicket.created_at).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-title">User Information</div>
                      <div className="info-row">
                        <span>Username</span>{" "}
                        <b>{selectedTicket.ticket_body?.username || "N/A"}</b>
                      </div>
                      <div className="info-row">
                        <span>Mobile No</span>{" "}
                        {selectedTicket.ticket_body?.mobile_no || "N/A"}
                      </div>
                      <div className="info-row">
                        <span>District</span>{" "}
                        {selectedTicket.ticket_body?.district_obj
                          ?.district_name_en || "N/A"}
                      </div>
                      <div className="info-row">
                        <span>Block</span>{" "}
                        {selectedTicket.ticket_body?.block_obj?.block_name_en ||
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="section-label">Problem Description</div>
                  <div className="box-container" style={{ background: "#f8fafc" }}>
                    {selectedTicket.ticket_body?.problem_message ||
                      "No description provided."}
                  </div>

                  <div className="section-label">Attached Screenshots</div>
                  <div className="box-container">
                    {selectedTicket.ticket_media &&
                    selectedTicket.ticket_media.length > 0 ? (
                      selectedTicket.ticket_media.map((img, i) => (
                        <img
                          key={i}
                          src={img.screenshot}
                          alt="Screenshot"
                          onClick={() => setPreviewImage(img.screenshot)}
                          style={{
                            width: "100px",
                            height: "75px",
                            objectFit: "cover",
                            cursor: "pointer",
                            borderRadius: "6px",
                          }}
                        />
                      ))
                    ) : (
                      <div className="error-placeholder">Error</div>
                    )}
                  </div>

                  {isPMUUser ? (
                    <>
                      <div className="section-label">PMU Response</div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPmuResponse(`Dear User,\n\n\nThank you.\n\nRegards,\nPragati Setu Grievance Portal`)
                          }
                          style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Type Response
                        </button>
                      </div>

                      <textarea
                        className="textarea-response"
                        placeholder="Enter official resolution or troubleshooting steps here..."
                        value={pmuResponse}
                        onChange={(e) => setPmuResponse(e.target.value)}
                      />
                    </>
                  ) : (
                    selectedTicket?.pmu_response && (
                      <>
                        <div className="section-label">PMU Response</div>
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
                        Resolve Ticket
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
          )}
        </div>
      </div>
      
      {/* 3. Footer sabse neeche */}
      <AdminFooter />

    </div>
  );
}