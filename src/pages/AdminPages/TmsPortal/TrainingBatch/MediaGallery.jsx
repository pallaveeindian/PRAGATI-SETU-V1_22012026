// src/pages/TMS/TRs/BatchDetailComponents/BatchMediaGallery.jsx
import React from "react";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch (e) {
    return iso || "-";
  }
}

function normalizeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("/media/")) return url;
  if (url.startsWith("http")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname;
    } catch (error) {
      return url;
    }
  }
  return url;
}

export default function BatchMediaGallery({ batchMedia = [], onOpenMedia }) {
  if (!batchMedia || batchMedia.length === 0) {
    return null;
  }

  return (
    <div className="training-section" style={{ marginTop: 24 }}>
      <h3 className="section-title">🖼️ All Batch Media</h3>

      <div className="media-grid">
        {batchMedia.map((m) => {
          const src = normalizeMediaUrl(m.file);
          const isImage = src && !src.toLowerCase().endsWith(".pdf");

          return (
            <div key={m.id} className="media-card">
              {isImage ? (
                <img
                  src={src}
                  alt={m.category}
                  onClick={() => onOpenMedia && onOpenMedia(src)}
                  title="Click to preview"
                />
              ) : (
                <div
                  className="pdf-placeholder"
                  onClick={() => window.open(src, "_blank")}
                  title="Open PDF in new tab"
                >
                  📄 PDF
                </div>
              )}

              <div className="media-category">{m.category}</div>

              {m.date && <div className="media-date">{fmtDate(m.date)}</div>}

              {m.notes && (
                <div className="media-notes" title={m.notes}>
                  {m.notes.length > 20
                    ? m.notes.substring(0, 20) + "..."
                    : m.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .section-title {
          margin-bottom: 16px;
          color: #2b4e72;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          margin-top: 0;
        }
        .media-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .media-card {
          background: #e4ecf5;
          border: 1px solid #a7c6ed;
          border-radius: 6px;
          padding: 6px;
          text-align: center;
          width: 110px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          transition: transform 0.2s ease;
        }
        .media-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .media-card img {
          width: 100%;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
        }
        .pdf-placeholder {
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          color: #3d6ba6;
          font-weight: 600;
          font-size: 13px;
          border: 1px dashed #a7c6ed;
        }
        .pdf-placeholder:hover {
          background: #f8fafc;
        }
        .media-category {
          font-size: 11px;
          margin-top: 6px;
          color: #2b4e72;
          font-weight: 700;
          word-wrap: break-word;
          line-height: 1.2;
        }
        .media-date {
          font-size: 10px;
          color: #64748b;
          margin-top: 4px;
        }
        .media-notes {
          font-size: 10px;
          color: #475569;
          margin-top: 4px;
          font-style: italic;
        }
        .training-section {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
