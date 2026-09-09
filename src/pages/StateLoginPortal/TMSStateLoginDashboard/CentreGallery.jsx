// src/pages/StateLoginPortal/TMSStateloginDashboard/CentreGallery.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaFilePdf } from "react-icons/fa";
import api from "../../../api/axios";

export default function CentreGallery({ isOpen, onClose, centreId, centreName }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (isOpen && centreId) {
            fetchGallery();
        } else {
            // Reset state when closed
            setSubmissions([]);
            setActiveIndex(0);
        }
    }, [isOpen, centreId]);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/tms/reports/centre-submissions/${centreId}/`);
            if (res.data?.status === "success") {
                setSubmissions(res.data.data || []);
            }
        } catch (err) {
            console.error("Failed to load gallery assets", err);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const currentAsset = submissions[activeIndex];

    // Helper to determine if file is an image based on extension
    const isImage = (url) => {
        if (!url) return false;
        return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
    };

    return (
        <div className="gallery-overlay" onClick={onClose}>
            <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="gallery-header">
                    <div className="gallery-title">
                        <h3>{centreName}</h3>
                        <span>Uploaded Media Assets</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {/* Content Area */}
                <div className="gallery-content">
                    {loading ? (
                        <div className="gallery-loading">
                            <div className="pulse-loader">Loading Assets...</div>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="gallery-empty">
                            <p>No media assets found for this centre.</p>
                        </div>
                    ) : (
                        <>
                            {/* Main Slideshow Area */}
                            <div className="main-stage">
                                <button
                                    className="nav-btn left"
                                    disabled={activeIndex === 0}
                                    onClick={() => setActiveIndex(prev => prev - 1)}
                                >
                                    <FaChevronLeft />
                                </button>

                                <div className="stage-asset">
                                    {isImage(currentAsset.file) ? (
                                        <img src={currentAsset.file} alt={currentAsset.category} className="main-image" />
                                    ) : (
                                        <div className="pdf-placeholder">
                                            <FaFilePdf size={60} color="#ef4444" />
                                            <p>Document Available</p>
                                            <a href={currentAsset.file} target="_blank" rel="noopener noreferrer" className="download-link">
                                                Click here to view PDF
                                            </a>
                                        </div>
                                    )}

                                    <div className="asset-metadata">
                                        <span className="asset-category">{currentAsset.category.replace(/_/g, " ")}</span>
                                        {currentAsset.notes && <span className="asset-notes">{currentAsset.notes}</span>}
                                    </div>
                                </div>

                                <button
                                    className="nav-btn right"
                                    disabled={activeIndex === submissions.length - 1}
                                    onClick={() => setActiveIndex(prev => prev + 1)}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>

                            {/* Bottom Thumbnail Strip */}
                            <div className="thumbnail-strip">
                                {submissions.map((sub, idx) => (
                                    <div
                                        key={sub.id}
                                        className={`thumbnail-wrap ${idx === activeIndex ? "active" : ""}`}
                                        onClick={() => setActiveIndex(idx)}
                                    >
                                        {isImage(sub.file) ? (
                                            <img src={sub.file} alt="thumbnail" className="thumb-img" />
                                        ) : (
                                            <div className="thumb-doc">PDF</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        .gallery-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: overlayFadeIn 0.3s ease;
        }

        .gallery-modal {
          background: #ffffff;
          width: 100%;
          max-width: 900px;
          height: 85vh;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: modalSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .gallery-title h3 { margin: 0; color: #0f172a; font-size: 18px; font-weight: 800; }
        .gallery-title span { color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; }

        .close-btn {
          background: #e2e8f0; border: none; width: 45px; height: 45px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #475569;
          cursor: pointer; transition: all 0.2s;
        }
        .close-btn:hover { background: #ef4444; color: white; }

        .gallery-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #0f172a;
          position: relative;
        }

        .gallery-loading, .gallery-empty {
          display: flex; align-items: center; justify-content: center; height: 100%;
          color: #94a3b8; font-size: 16px;
        }
        
        .pulse-loader { animation: pulse 1.5s infinite; color: #38bdf8; font-weight: 700; }

        .main-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
          color: white; width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          cursor: pointer; transition: all 0.2s; z-index: 10;
        }
        .nav-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.3); transform: scale(1.1); }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .stage-asset {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .main-image {
          max-width: 100%; max-height: calc(100% - 60px);
          object-fit: contain; border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .pdf-placeholder {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #1e293b; padding: 40px; border-radius: 12px; border: 2px dashed #475569;
        }
        .pdf-placeholder p { color: white; margin: 16px 0 8px 0; font-weight: 600; }
        .download-link { color: #38bdf8; text-decoration: none; font-weight: 700; background: rgba(56, 189, 248, 0.1); padding: 8px 16px; border-radius: 8px; }
        .download-link:hover { background: rgba(56, 189, 248, 0.2); }

        .asset-metadata {
          position: absolute; bottom: 10px; background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px); padding: 10px 20px; border-radius: 20px;
          display: flex; gap: 16px; align-items: center;
        }
        .asset-category { color: #38bdf8; font-weight: 800; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; }
        .asset-notes { color: #f8fafc; font-size: 13px; border-left: 1px solid #475569; padding-left: 16px; }

        .thumbnail-strip {
          height: 90px; background: #020617; border-top: 1px solid #1e293b;
          display: flex; align-items: center; gap: 10px; padding: 0 20px;
          overflow-x: auto; white-space: nowrap;
        }

        .thumbnail-strip::-webkit-scrollbar { height: 6px; }
        .thumbnail-strip::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }

        .thumbnail-wrap {
          width: 60px; height: 60px; flex-shrink: 0; border-radius: 6px; overflow: hidden;
          cursor: pointer; border: 2px solid transparent; opacity: 0.5; transition: all 0.2s;
        }
        .thumbnail-wrap:hover { opacity: 0.8; transform: translateY(-2px); }
        .thumbnail-wrap.active { opacity: 1; border-color: #38bdf8; transform: scale(1.05); box-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }

        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-doc { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #334155; color: white; font-size: 11px; font-weight: 700; }

        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
        </div>
    );
}