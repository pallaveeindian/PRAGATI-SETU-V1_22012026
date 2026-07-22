// src/pages/EPSMS/ViewRecordedCRPs/VRCComponents/CRPTable.jsx
import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from "../../../../api/axios";
import {
  FaUser,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaMap,
  FaLocationArrow,
  FaSpinner,
  FaMapMarkerAlt,
} from "react-icons/fa";
import CRPDetails from "./CRPDetail";
export default function CRPTable({ filters, itemsPerPage = 15, }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCRP, setSelectedCRP] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleView = (crp) => {
    setSelectedCRP(crp);
    setShowModal(true);
  };

  useEffect(() => {
    // SURGICAL FIX: Strictly prevent API call if district is missing.
    // Clears the table data instead of fetching the entire unrestricted database.
    if (!filters || !filters.district) {
      setData([]);
      return;
    }

    async function load() {
      setLoading(true);
      setCurrentPage(1);

      try {
        const res = await EPSAKHI_API.crpPanchList({
          ...filters,
          limit:1000,
          page_size: 1000,
        });

        const payload = res.data?.data ? res.data.data : res.data;
        const results = Array.isArray(payload)
          ? payload
          : payload?.results || [];

        results.sort((a, b) =>
          (a.district_name_en || "").localeCompare(b.district_name_en || ""),
        );

        setData(results);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    load();
  }, [filters, refreshTrigger]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="crp-table-wrapper">
      {/* LOADER */}

      {loading && (
        <div className="table-loader">
          <FaSpinner className="spin" /> Loading CRPs...
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="table-empty">
          <FaMapMarkerAlt />
          No CRPs found for selected filters
        </div>
      )}

      {!loading && data.length > 0 && (
        <table className="crp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <FaUser /> Name
              </th>
              <th>
                <FaPhoneAlt /> Mobile
              </th>
              <th>
                <FaMapMarkedAlt /> District
              </th>
              <th>
                <FaMap /> Block
              </th>
              <th>
                <FaLocationArrow /> Panchayat
              </th>
              <th>
                <FaMapMarkerAlt /> Allocated Panchayats
              </th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((crp, index) => {
              const allocated = crp.allocated_panchayats || [];

              return (
                <tr key={crp.id}>
                  <td data-label="S.No">{startIndex + index + 1}</td>

                  <td data-label="Name">{crp.name}</td>

                  <td data-label="Mobile">{crp.mobile_number}</td>

                  <td data-label="District">{crp.district_name_en}</td>

                  <td data-label="Block">{crp.block_name_en}</td>

                  <td data-label="Panchayat">{crp.panchayat_name_en}</td>

                  <td data-label="Allocated Panchayats">
                    <div className="panch-badges">
                      {allocated.map((p) => (
                        <span key={p.panchayat_id} className="panch-badge">
                          {p.panchayat_name_en}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td data-label="Action">
                    <button
                      className="view-btn"
                      // ⭐ CHANGE 3: Fixed the payload passed to handleView.
                      // Changed from `onClick={() => handleView({ crp: crp })}`
                      // to `onClick={() => handleView(crp)}` so the data isn't accidentally nested.
                      onClick={() => handleView(crp)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
        {showModal && (
          <CRPDetails
            crpData={selectedCRP}
            onClose={() => {
              setShowModal(false);
              setSelectedCRP(null);
            }}
            onRefresh={() => {
              // ⭐ CHANGE 5: Updated the refreshTrigger state.
              // When the modal calls onRefresh() after a successful update/delete,
              // this triggers the table to re-fetch its data.
              setRefreshTrigger((prev) => prev + 1);
            }}
          />
        )}
      </div>
      <style>{`
.view-btn{
    background:var(--epsms-green);
    color:#fff;
    border:none;
    border-radius:6px;
    padding:6px 14px;
    cursor:pointer;
    font-weight:600;
    transition:.3s;
}

.view-btn:hover{
    background:var(--epsms-red);
}
      .crp-table-wrapper{
        width:100%;
        overflow-x:auto;
        animation:fadeIn .35s ease;
      }


      /* TABLE */

      .crp-table{
        width:100%;
        border-collapse:collapse;
        font-size:14px;
        min-width:900px;
      }

      .crp-table thead{
        background:var(--epsms-red);
        color:white;
      }

      .crp-table th{

        padding:10px;
        text-align:left;
        font-weight:600;
        white-space:nowrap;
        background:var(--epsms-white);
        color:var(--epsms-red);
      }

      .crp-table td{
        padding:10px;
        border-bottom:1px solid var(--epsms-muted);
        vertical-align:top;
      }

      .crp-table tbody tr{
        transition:.25s ease;
      }

      .crp-table tbody tr:hover{
        background:#fff7f5;
      }


      /* ICONS */

      .cell-icon{
        margin-right:6px;
        color:var(--epsms-red);
      }


      /* PANCHAYAT BADGES */

      .panch-badges{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }

      .panch-badge{
        background:var(--epsms-green);
        color:white;
        padding:4px 8px;
        border-radius:20px;
        font-size:12px;
        white-space:nowrap;
        animation:badgePop .25s ease;
      }


      /* LOADER */

      .table-loader{

        display:flex;
        align-items:center;
        gap:10px;
        color:var(--epsms-text-muted);
        padding:20px;

      }


      /* EMPTY */

      .table-empty{

        display:flex;
        align-items:center;
        gap:10px;
        padding:20px;
        color:var(--epsms-text-muted);

      }


      /* SPIN */

      .spin{
        animation:spin 1s linear infinite;
      }

      @keyframes spin{
        from{transform:rotate(0)}
        to{transform:rotate(360deg)}
      }


      /* BADGE POP */

      @keyframes badgePop{
        from{
          opacity:0;
          transform:scale(.8);
        }
        to{
          opacity:1;
          transform:scale(1);
        }
      }


      /* MOBILE CARD MODE */

    @media(max-width:768px){
  .crp-table{
    border:0;
    min-width:100%;
  }

  .crp-table thead{
    display: table-header-group;
  }

  .crp-table tr{
    display:block;
    margin-bottom:14px;
    border:1px solid var(--epsms-muted);
    border-radius:8px;
    padding:10px;
  }

  .crp-table td{
    display:flex;
    justify-content:space-between;
    padding:6px 0;
    border:none;
  }

  .crp-table td::before{
    content:attr(data-label);
    font-weight:600;
    color:var(--epsms-text-dark);
  }
}

      /* ANIMATION */

      @keyframes fadeIn{
        from{
          opacity:0;
          transform:translateY(6px);
        }
        to{
          opacity:1;
          transform:translateY(0);
        }
      }

      .pagination{
        display:flex;
        justify-content:center;
        align-items:center;
        gap:12px;
        margin-top:14px;
      }

      .pagination button{
        padding:6px 12px;
        background:var(--epsms-green);
        cursor:pointer;
        font-weight:600;
      }

      .pagination button:hover{
        background:var(--epsms-red);
        color:white;
      }

      .pagination button:disabled{
        opacity:.5;
        cursor:not-allowed;
      }

      `}</style>
    </div>
  );
}
