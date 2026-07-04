// src/pages/TMS/TRs/BatchDetailComponents/CentreDetailFetcherCard.jsx
import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";

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

export default function CentreDetailFetcherCard({ centreId, onOpenMedia }) {
  const [centreDetail, setCentreDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!centreId) return;

    let isMounted = true;

    async function fetchCentre() {
      setLoading(true);
      setError(false);
      try {
        const resp = await api.get(
          `/tms/training-partner-centres/${centreId}/detail/`,
        );
        if (isMounted) {
          setCentreDetail(resp?.data || null);
        }
      } catch (err) {
        console.error("Failed to fetch centre details:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCentre();

    return () => {
      isMounted = false;
    };
  }, [centreId]);

  if (!centreId) return null;

  if (loading) {
    return (
      <div className="centre-card">
        <h3 className="centre-title">🏢 Centre Details</h3>
        <div style={{ color: "#64748b", padding: "20px 0" }}>
          Loading deep centre details...
        </div>
      </div>
    );
  }

  if (error || !centreDetail) {
    return (
      <div className="centre-card">
        <h3 className="centre-title">🏢 Centre Details</h3>
        <div style={{ color: "#dc2626", padding: "20px 0" }}>
          Failed to load centre details.
        </div>
      </div>
    );
  }

  return (
    <div className="centre-card">
      <h3 className="centre-title">🏢 Centre Details</h3>

      <div className="centre-grid">
        {/* LEFT SIDE */}
        <div className="centre-left">
          <div className="centre-name">{centreDetail.venue_name}</div>

          <div className="centre-address">{centreDetail.venue_address}</div>

          <div className="centre-meta">
            <div>
              <strong>Serial:</strong> {centreDetail.serial_number || "-"}
            </div>
            <div>
              <strong>Type:</strong> {centreDetail.centre_type || "-"}
            </div>
            <div>
              <strong>Halls:</strong> {centreDetail.training_hall_count || 0}{" "}
              (Capacity: {centreDetail.training_hall_capacity || 0})
            </div>
          </div>

          {centreDetail.rooms?.length > 0 && (
            <div className="centre-halls">
              <h4>Training Halls</h4>

              <table className="centre-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {centreDetail.rooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.room_name}</td>
                      <td>{room.room_capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="centre-right">
          <h4 className="facility-title">Facilities</h4>

          <div className="facility-grid">
            <div className="facility-item">
              Security
              <span>{centreDetail.security_arrangements || "-"}</span>
            </div>

            <div className="facility-item">
              Toilets
              <span>{centreDetail.toilets_bathrooms || "-"}</span>
            </div>

            <div className="facility-item">
              Power/Water
              <span>{centreDetail.power_water_facility || "-"}</span>
            </div>

            <div className="facility-item">
              Medical Kit
              <span>{centreDetail.medical_kit ? "✅" : "❌"}</span>
            </div>

            <div className="facility-item">
              Open Space
              <span>{centreDetail.open_space ? "✅" : "❌"}</span>
            </div>

            <div className="facility-item">
              Field Visit
              <span>{centreDetail.field_visit_facility ? "✅" : "❌"}</span>
            </div>

            <div className="facility-item">
              Transport
              <span>{centreDetail.transport_facility ? "✅" : "❌"}</span>
            </div>

            <div className="facility-item">
              Dining
              <span>{centreDetail.dining_facility ? "✅" : "❌"}</span>
            </div>
          </div>

          <div className="centre-other">
            <strong>Other:</strong> {centreDetail.other_details || "-"}
          </div>

          {centreDetail.submissions?.length > 0 && (
            <div className="media-section">
              <h4>Media</h4>

              <div className="media-grid">
                {centreDetail.submissions.map((submission) => {
                  const src = normalizeMediaUrl(submission.file);
                  const isImage = src && !src.toLowerCase().endsWith(".pdf");

                  return (
                    <div key={submission.id} className="media-card">
                      {isImage ? (
                        <img
                          src={src}
                          alt={submission.category}
                          onClick={() => onOpenMedia && onOpenMedia(src)}
                        />
                      ) : (
                        <div
                          className="pdf-placeholder"
                          onClick={() => window.open(src, "_blank")}
                        >
                          View PDF
                        </div>
                      )}
                      <div className="media-category">
                        {submission.category}
                      </div>
                      {submission.notes && (
                        <div className="media-notes">{submission.notes}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .centre-card {
          background: #fff;
          border: 2px solid #a7c6ed;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .centre-title {
          margin-top: 0;
          margin-bottom: 18px;
          color: #2b4e72;
          font-weight: 700;
        }
        .centre-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .centre-name {
          font-size: 20px;
          font-weight: 700;
          color: #3d6ba6;
          margin-bottom: 6px;
        }
        .centre-address {
          color: #5a8cc2;
          margin-bottom: 14px;
        }
        .centre-meta div {
          margin-bottom: 6px;
          color: #2b4e72;
        }
        .centre-halls h4 {
          margin-top: 20px;
          margin-bottom: 10px;
          color: #3d6ba6;
        }
        .centre-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .centre-table th {
          background: #e4ecf5;
          color: #2b4e72;
          padding: 8px;
          text-align: left;
        }
        .centre-table td {
          border-top: 1px solid #a7c6ed;
          padding: 8px;
        }
        .facility-title {
          margin-top: 0;
          margin-bottom: 10px;
          color: #3d6ba6;
        }
        .facility-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .facility-item {
          background: #e4ecf5;
          border: 1px solid #a7c6ed;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 13px;
          display: flex;
          justify-content: space-between;
          color: #2b4e72;
        }
        .centre-other {
          margin-top: 12px;
          font-size: 13px;
          color: #2b4e72;
        }
        .media-section {
          margin-top: 16px;
        }
        .media-section h4 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #3d6ba6;
        }
        .media-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .media-card {
          width: 150px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          padding: 8px;
          background: #fff;
          font-size: 12px;
        }
        .media-card img {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
        }
        .pdf-placeholder {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border-radius: 4px;
          cursor: pointer;
          color: #3d6ba6;
          font-weight: 600;
        }
        .media-category {
          margin-top: 4px;
          font-weight: 600;
          color: #2b4e72;
        }
        .media-notes {
          margin-top: 2px;
          color: #4b5563;
        }
        @media (max-width: 768px) {
          .centre-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
