import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import api, { TMS_API } from '../../../api/axios';
import CenterView from './CenterView';

const CenterDetail = () => {
    const navigate = useNavigate();
    const [groupedCenters, setGroupedCenters] = useState({});
    const [expandedDistrict, setExpandedDistrict] = useState(null);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // PAGINATION STATES 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; 

    const fetchCenterDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/tms/training-partner-centres/');
            const results = response?.data?.results || response?.data || [];
            
            // Data ko District ke hisaab se group karna
            const grouped = results.reduce((acc, center) => {
                const districtName = center.district_full?.district_name_en || 'N/A';
                if (!acc[districtName]) {
                    acc[districtName] = [];
                }
                acc[districtName].push(center);
                return acc;
            }, {});

            setGroupedCenters(grouped);

        } catch (err) {
            console.error('Error fetching center details:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCenterDetails();
    }, []);

    const toggleDetails = (districtName) => {
        setExpandedDistrict((current) => current === districtName ? null : districtName);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading Center Details... ⏳</div>;
    }

    const districtNames = Object.keys(groupedCenters);
    const totalPages = Math.ceil(districtNames.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDistricts = districtNames.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setExpandedDistrict(null);
        }
    };

    const handleView = (center) => {
        setSelectedCenter(center);
    };

    const handleDelete = async (center) => {
        if (!window.confirm(`Are you sure you want to delete "${center.venue_name}"?`)) return;

        try {
            await TMS_API.trainingPartnerCentres.destroy(center.id);
            setGroupedCenters((current) => {
                const updated = { ...current };
                const district = center.district_full?.district_name_en || 'N/A';
                updated[district] = (updated[district] || []).filter((item) => item.id !== center.id);
                if (updated[district].length === 0) delete updated[district];
                return updated;
            });
            alert('Centre deleted successfully.');
        } catch (err) {
            alert(err?.response?.data?.detail || 'Failed to delete centre. Please try again.');
        }
    };

    return (
        /* 🟢 YAHAN PADDING ADD KI GAYI HAI (0 20px) TAARI DONO TARAF SE GAP RAHE */
        <div className="table-card" style={{ padding: '0 20px', margin: '0 auto', maxWidth: '1400px' }}>
            {/* HEADER */}
            <div className="dash-header" style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center', alignItems: 'center', border: '2px solid #2f629e', background: 'transparent', padding: '12px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                <h2 className="dash-title" style={{ color: '#2f629e', margin: 0 }}>Center Details Dashboard</h2>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fecaca' }}>Failed to load center details. Please check console.</div>}

            <div className="table-responsive" style={{ marginTop: '20px', border: '2px solid #2f629e', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                <table className="tms-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #2f629e' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Sr. No</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>District</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Total Centers</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Center Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDistricts.length > 0 ? (
                            currentDistricts.map((district, index) => (
                                <React.Fragment key={district}>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}> 
                                        <td style={{ padding: '12px' }}>{indexOfFirstItem + index + 1}</td>
                                        <td style={{ padding: '12px' }}><strong>{district}</strong></td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ background: '#e2e8f0', padding: '2px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                                                {groupedCenters[district].length}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button 
                                                className="export-btn" 
                                                style={{ 
                                                    padding: '6px 12px', 
                                                    background: expandedDistrict === district ? '#dc2626' : '#2f629e',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => toggleDetails(district)}
                                            >
                                                {expandedDistrict === district ? 'Hide Details' : 'View Details'}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Sub Table for Centers Details */}
                                    {expandedDistrict === district && (
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #2f629e' }}>
                                            <td colSpan="4" style={{ padding: '20px' }}>
                                                <h4 style={{ margin: '0 0 10px 0', color: '#2f629e' }}> Centers in {district}</h4>
                                                
                                                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                                                    <table className="tms-table" style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ background: '#e2e8f0', borderBottom: '1px solid #cbd5e1' }}>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>Venue Name</th>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>Address</th>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>Capacity</th>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                                                                <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {groupedCenters[district].map((center, cIdx) => (
                                                                <tr key={center.id} style={{ borderBottom: cIdx !== groupedCenters[district].length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                                                    <td style={{ padding: '10px' }}>{center.venue_name}</td>
                                                                    <td style={{ padding: '10px' }}>{center.venue_address}</td>
                                                                    <td style={{ padding: '10px' }}>{center.training_hall_capacity || 'N/A'}</td>
                                                                    <td style={{ padding: '10px' }}>{center.centre_type || 'N/A'}</td>
                                                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                                            <button
                                                                                type="button"
                                                                                title="View centre"
                                                                                aria-label={`View ${center.venue_name}`}
                                                                                onClick={() => handleView(center)}
                                                                                style={{ padding: '6px 9px', border: '1px solid #2f629e', borderRadius: '4px', background: '#fff', color: '#2f629e', cursor: 'pointer' }}
                                                                            >
                                                                                <FaEye />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                title="Edit centre"
                                                                                aria-label={`Edit ${center.venue_name}`}
                                                                                onClick={() => navigate(`/admin/tms/tp/centre/${center.id}`)}
                                                                                style={{ padding: '6px 9px', border: '1px solid #2f629e', borderRadius: '4px', background: '#2f629e', color: '#fff', cursor: 'pointer' }}
                                                                            >
                                                                                <FaEdit />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                title="Delete centre"
                                                                                aria-label={`Delete ${center.venue_name}`}
                                                                                onClick={() => handleDelete(center)}
                                                                                style={{ padding: '6px 9px', border: '1px solid #dc2626', borderRadius: '4px', background: '#fff', color: '#dc2626', cursor: 'pointer' }}
                                                                            >
                                                                                <FaTrash />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                    No center details available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CONTROLS UI */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px 0' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, districtNames.length)} of {districtNames.length} Districts
                    </span>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '6px 14px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                background: currentPage === 1 ? '#f1f5f9' : '#fff',
                                color: currentPage === 1 ? '#94a3b8' : '#334155',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ◀ Previous
                        </button>

                        <span style={{ fontSize: '14px', fontWeight: '600', padding: '0 8px' }}>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '6px 14px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                background: currentPage === totalPages ? '#f1f5f9' : '#fff',
                                color: currentPage === totalPages ? '#94a3b8' : '#334155',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next ▶
                        </button>
                    </div>
                </div>
            )}

            {selectedCenter && <CenterView center={selectedCenter} onClose={() => setSelectedCenter(null)} />}
        </div>
    );
};

export default CenterDetail;