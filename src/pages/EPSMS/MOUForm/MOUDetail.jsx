// src/pages/MOU/MOUDetail.jsx

import React, { useEffect, useState } from "react";
import { EPSAKHI_API } from "../../../api/axios";

import {
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaFileAlt,
  FaHandshake,
  FaChartLine,
  FaStore,
  FaTags,
  FaDownload,
} from "react-icons/fa";

/* =======================================================
       URL NORMALIZATION UTILITY
======================================================= */
function normalizeMediaUrl(url) {
  if (!url) return "";

  // If the URL already starts with a relative path like /media/, it's perfect.
  if (url.startsWith("/media/")) {
    return url;
  }

  // If it's an absolute URL (http:// or https://), strip the domain completely
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname; // Extracts ONLY the path (e.g., "/media/uploads/file.jpg")
    } catch (error) {
      console.warn("Invalid media URL:", url);
      return url;
    }
  }

  // Fallback for any weird edge cases
  return url;
}

export default function MOUDetail({ id, onBack }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line
  }, [id]);

  async function fetchDetail() {
    try {
      setLoading(true);
      const res = await EPSAKHI_API.mouFormDetail(id);
      const detail = res?.data?.data || res?.data?.results || res?.data || null;
      setData(detail);
    } catch (err) {
      console.error("Failed to fetch MOU detail", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="mou-detail-loading">Loading MOU Details...</div>;
  }

  if (!data) {
    return <div className="mou-detail-loading">No details found.</div>;
  }

  // Safely parse enterprise_type if stored as stringified JSON from the submission view
  let parsedEnterpriseTypes = null;

  if (data.enterprise_type) {
    try {
      parsedEnterpriseTypes =
        typeof data.enterprise_type === "string"
          ? JSON.parse(data.enterprise_type)
          : data.enterprise_type;
    } catch (e) {
      console.error("Failed to parse enterprise_type", e);
      parsedEnterpriseTypes = null;
    }
  }

  return (
    <div className="mou-detail-root">
      {/* HEADER */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <h2>MOU Enterprise Profile</h2>
      </div>

      {/* ==================== SECTION 1: ENTERPRISE ==================== */}
      <div className="detail-card">
        <div className="card-title">
          <FaBuilding /> Enterprise Information
        </div>

        <div className="enterprise-section-layout">
          {/* Left Grid: Data Fields */}
          <div className="detail-grid flex-grow">
            {data.enterprise_name && (
              <div className="info-box">
                <span>Enterprise Name</span>
                <strong>{data.enterprise_name}</strong>
              </div>
            )}
            {data.entrepreneur_name && (
              <div className="info-box">
                <span>Entrepreneur</span>
                <strong>{data.entrepreneur_name}</strong>
              </div>
            )}
            {data.entrepreneur_contact && (
              <div className="info-box">
                <span>Contact</span>
                <strong>{data.entrepreneur_contact}</strong>
              </div>
            )}
            {data.lokos_shg_name && (
              <div className="info-box">
                <span>SHG Name</span>
                <strong>{data.lokos_shg_name}</strong>
              </div>
            )}
            {data.lokos_shg_code && (
              <div className="info-box">
                <span>SHG Code</span>
                <strong>{data.lokos_shg_code}</strong>
              </div>
            )}
            {data.lokos_clf_name && (
              <div className="info-box">
                <span>CLF Name</span>
                <strong>{data.lokos_clf_name}</strong>
              </div>
            )}
            {data.lokos_clf_code && (
              <div className="info-box">
                <span>CLF Code</span>
                <strong>{data.lokos_clf_code}</strong>
              </div>
            )}
            {data.lokos_vo_name && (
              <div className="info-box">
                <span>VO Name</span>
                <strong>{data.lokos_vo_name}</strong>
              </div>
            )}
            {data.lokos_vo_code && (
              <div className="info-box">
                <span>VO Code</span>
                <strong>{data.lokos_vo_code}</strong>
              </div>
            )}
          </div>

          {/* Right Column: Thumbnail Style Image Container */}
          {data.entrepeneur_picture && (
            <div className="image-right-panel">
              <span className="image-panel-label">Entrepreneur Photo</span>
              <a
                href={normalizeMediaUrl(data.entrepeneur_picture)}
                target="_blank"
                rel="noreferrer"
                className="thumb-anchor"
              >
                <img
                  src={normalizeMediaUrl(data.entrepeneur_picture)}
                  alt="Entrepreneur Thumbnail"
                  className="thumb-image"
                />
              </a>
            </div>
          )}
        </div>

        {/* Dynamic Enterprise Type Mapping */}
        {parsedEnterpriseTypes &&
          typeof parsedEnterpriseTypes === "object" &&
          Object.keys(parsedEnterpriseTypes).length > 0 && (
            <div className="enterprise-json-categories">
              <h4 className="sub-heading">
                <FaTags />
                Enterprise Type / Categories
              </h4>

              <div className="enterprise-category-grid">
                {Object.entries(parsedEnterpriseTypes).map(
                  ([parent, children]) => (
                    <div key={parent} className="category-group-block">
                      <div className="parent-category-header">{parent}</div>

                      <div className="child-chips-wrap">
                        {Array.isArray(children) &&
                          children.map((child, idx) => (
                            <div key={idx} className="child-category-card">
                              {child}
                            </div>
                          ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
      </div>

      {/* ==================== SECTION 2: LOCATION ==================== */}
      {(data.district_name ||
        data.block_name ||
        data.panchayat_name ||
        data.village_name) && (
        <div className="detail-card">
          <div className="card-title">
            <FaMapMarkerAlt /> Location Geoscope
          </div>
          <div className="detail-grid">
            {data.district_name && (
              <div className="info-box">
                <span>District</span>
                <strong>{data.district_name}</strong>
              </div>
            )}
            {data.block_name && (
              <div className="info-box">
                <span>Block</span>
                <strong>{data.block_name}</strong>
              </div>
            )}
            {data.panchayat_name && (
              <div className="info-box">
                <span>Panchayat</span>
                <strong>{data.panchayat_name}</strong>
              </div>
            )}
            {data.village_name && (
              <div className="info-box">
                <span>Village</span>
                <strong>{data.village_name}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SECTION 3: PRODUCTS ==================== */}
      {data.products?.length > 0 && (
        <div className="detail-card">
          <div className="card-title">
            <FaTags /> Products Configuration
          </div>
          {data.products.map((prod) => (
            <div key={prod.id} className="nested-card">
              <div className="nested-grid">
                {prod.product_name && (
                  <div className="info-box full-width">
                    <span>Product Name</span>
                    <strong
                      style={{
                        fontSize: "16px",
                        color: "var(--epsms-red, #ea580c)",
                      }}
                    >
                      {prod.product_name}
                    </strong>
                  </div>
                )}
              </div>
              {prod.prod_categories?.length > 0 && (
                <div className="chips-wrap" style={{ marginTop: "14px" }}>
                  {prod.prod_categories.map((cat) => (
                    <div key={cat.id} className="chip">
                      {cat.parent_category} → {cat.child_category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ==================== SECTION 4: MOUs & DOCS ==================== */}
      {data.mous?.length > 0 && (
        <div className="detail-card">
          <div className="card-title">
            <FaHandshake /> Executed MOU Overview
          </div>
          {data.mous.map((mou) => (
            <div key={mou.id} className="nested-card">
              <div className="nested-grid">
                {mou.mou_level && (
                  <div className="info-box">
                    <span>MOU Level</span>
                    <strong>{mou.mou_level}</strong>
                  </div>
                )}
                {mou.mou_status && (
                  <div className="info-box">
                    <span>MOU Status</span>
                    <strong>{mou.mou_status}</strong>
                  </div>
                )}
                {mou.mou_date && (
                  <div className="info-box">
                    <span>Signing Date</span>
                    <strong>{mou.mou_date}</strong>
                  </div>
                )}
                {mou.mou_duration && (
                  <div className="info-box">
                    <span>MOU Term / Duration</span>
                    <strong>{mou.mou_duration}</strong>
                  </div>
                )}
              </div>

              {mou.mou_docs?.length > 0 && (
                <div className="docs-section-container">
                  <div className="sub-heading">
                    <FaFileAlt /> Associated Legal Documents
                  </div>
                  <div className="docs-wrap">
                    {mou.mou_docs.map((doc) => (
                      <a
                        key={doc.id}
                        href={normalizeMediaUrl(doc.doc_file)}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="doc-box"
                      >
                        <FaDownload />
                        <span>{doc.doc_name || "Download Asset File"}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ==================== SECTION 5: ORGS & TRADERS ==================== */}
      {((data.buyer_orgs && data.buyer_orgs.length > 0) ||
        (data.traders && data.traders.length > 0)) && (
        <div className="detail-card">
          <div className="card-title">
            <FaStore /> Commercial Counterpart Info
          </div>

          {/* Buyer Orgs Loop */}
          {data.buyer_orgs?.map((org) => (
            <div key={org.id} className="nested-card border-left-orange">
              <span className="nested-card-badge position-buyer">
                Buyer Organization
              </span>
              <div className="nested-grid">
                {org.buyer_org_name && (
                  <div className="info-box">
                    <span>Organisation Name</span>
                    <strong>{org.buyer_org_name}</strong>
                  </div>
                )}
                {org.org_contact && (
                  <div className="info-box">
                    <span>Official Contact</span>
                    <strong>{org.org_contact}</strong>
                  </div>
                )}
                {org.org_type && (
                  <div className="info-box">
                    <span>Entity Type</span>
                    <strong>{org.org_type}</strong>
                  </div>
                )}
                {org.org_address && (
                  <div className="info-box full-width">
                    <span>Registered Address</span>
                    <strong>{org.org_address}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Traders Loop */}
          {data.traders?.map((trader) => (
            <div key={trader.id} className="nested-card border-left-green">
              <span className="nested-card-badge position-trader">
                Trader Account
              </span>
              <div className="nested-grid">
                {trader.trader_name && (
                  <div className="info-box">
                    <span>Trader Name</span>
                    <strong>{trader.trader_name}</strong>
                  </div>
                )}
                {trader.trader_contact && (
                  <div className="info-box">
                    <span>Contact Number</span>
                    <strong>{trader.trader_contact}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== SECTION 6: SALES ==================== */}
      {data.sales?.length > 0 && (
        <div className="detail-card">
          <div className="card-title">
            <FaChartLine /> Target & Sales Projections
          </div>
          {data.sales.map((sale) => (
            <div key={sale.id} className="nested-card">
              <div className="nested-grid">
                {sale.est_monthly_sales && (
                  <div className="info-box">
                    <span>Est. Monthly Turnover</span>
                    <strong className="text-green">
                      ₹ {Number(sale.est_monthly_sales).toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
                {sale.est_annual_sales && (
                  <div className="info-box">
                    <span>Est. Annual Turnover</span>
                    <strong className="text-green">
                      ₹ {Number(sale.est_annual_sales).toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
                {sale.supply_frequency && (
                  <div className="info-box">
                    <span>Logistics / Supply Frequency</span>
                    <strong>{sale.supply_frequency}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styles Engine */}
      <style>{`
        .mou-detail-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeIn .35s ease forwards;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .detail-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 26px;
          font-weight: 700;
        }

        .back-btn {
          background: var(--epsms-red, #ea580c);
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: #c2410c;
          transform: translateX(-2px);
        }

        .detail-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-top: 4px solid var(--epsms-green, #16a34a);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ea580c;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        /* Side-by-Side Flex Layout for Enterprise */
        .enterprise-section-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .flex-grow {
          flex: 1;
        }

        /* Right Panel Image Thumbnail Layout */
        .image-right-panel {
          flex-shrink: 0;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          padding: 14px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .image-panel-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .thumb-anchor {
          display: block;
          line-height: 0;
        }

        .thumb-image {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid var(--epsms-green, #16a34a);
          transition: all 0.25s ease;
          background: #ffffff;
        }

        .thumb-image:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
        }

        .detail-grid, .nested-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .info-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .info-box span {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .info-box strong {
          color: #1e293b;
          font-size: 15px;
          font-weight: 600;
        }

        .text-green {
          color: #16a34a !important;
          font-weight: 700 !important;
        }

        .nested-card {
          background: #fdfdfd;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 16px;
          position: relative;
        }
        
        .nested-card:last-child {
          margin-bottom: 0;
        }

        .border-left-orange { border-left: 4px solid #ea580c; }
        .border-left-green { border-left: 4px solid #16a34a; }

        .nested-card-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .position-buyer { background: #ffedd5; color: #c2410c; }
        .position-trader { background: #dcfce7; color: #15803d; }

        .enterprise-json-categories {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px dashed #e2e8f0;
        }

        .category-group-block{
          background:#ffffff;
          border:1px solid #e2e8f0;
          border-left:4px solid var(--epsms-red,#ea580c);
          border-radius:12px;
          padding:16px;
          box-shadow:0 2px 6px rgba(0,0,0,0.03);
        }

        .parent-category-header{
          font-size:16px;
          font-weight:700;
          color:#c2410c;
          margin-bottom:14px;
          padding-bottom:8px;
          border-bottom:1px dashed #fed7aa;
        }

        .child-chips-wrap{
          display:flex;
          flex-wrap:wrap;
          gap:12px;
        }

        .child-category-card{
          background:linear-gradient(
            135deg,
            rgba(22,163,74,0.10),
            rgba(234,88,12,0.08)
          );
          border:1px solid rgba(22,163,74,0.18);
          color:#14532d;
          padding:10px 16px;
          border-radius:10px;
          font-size:14px;
          font-weight:600;
          transition:all .2s ease;
        }

        .child-category-card:hover{
          transform:translateY(-2px);
          box-shadow:0 4px 10px rgba(0,0,0,0.06);
        }

        .sub-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 18px 0 10px 0;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
        }

        .chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          background: rgba(22,163,74,0.08);
          color: #15803d;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(22,163,74,0.15);
        }

        .docs-section-container {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px dashed #e5e7eb;
        }

        .docs-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .doc-box {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          background: #fdf2f8;
          border: 1px solid #fbcfe8;
          color: #be185d;
          padding: 10px 14px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.2s;
        }

        .doc-box:hover {
          transform: translateY(-1px);
          background: #fce7f3;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .mou-detail-loading {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 48px;
          text-align: center;
          color: #6b7280;
          font-size: 15px;
          font-weight: 500;
        }

        .enterprise-category-grid{
          display:flex;
          flex-direction:column;
          gap:16px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width: 900px) {
          .enterprise-section-layout {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .image-right-panel {
            align-items: center;
            width: 100%;
          }
          .thumb-image {
            width: 120px;
            height: 120px;
          }
        }

        @media(max-width: 600px) {
          .detail-grid, .nested-grid {
            grid-template-columns: 1fr;
          }
          .detail-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .detail-header h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
