import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const CenterDetail = () => {
    const [groupedCenters, setGroupedCenters] = useState({});
    const [expandedDistrict, setExpandedDistrict] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // PAGINATION STATES ADD KI HAIN
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Ek page par 15 districts dikhenge

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
        if (expandedDistrict === districtName) {
            setExpandedDistrict(null);
        } else {
            setExpandedDistrict(districtName);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading Center Details... ⏳</div>;
    }

    //  PAGINATION LOGIC
    const districtNames = Object.keys(groupedCenters);
    const totalPages = Math.ceil(districtNames.length / itemsPerPage);

    // Current Page ke 15 districts calculate karna
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDistricts = districtNames.slice(indexOfFirstItem, indexOfLastItem);

    // Page change handler
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setExpandedDistrict(null); // Page change hone par open details close kar dein
        }
    };

    return (
        <div className="table-card">
            {/* Header with White Text */}
            <div 
                className="dash-header" 
                style={{ 
                    marginBottom: '20px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%)', 
                    padding: '12px 20px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    color: '#ffffff',
                    
                }}
            >  
                <h2 className="dash-title" style={{ color: '#ffffff', margin: 0 }}>
                     Center Details Dashboard
                </h2>
            </div>

            {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fecaca' }}>
                    ⚠️ Failed to load center details. Please check console.
                </div>
            )}
            
            <div className="table-responsive">
                <table className="tms-table">
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>District</th>
                            <th>Total Centers</th>
                            <th>Center Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDistricts.length > 0 ? (
                            currentDistricts.map((district, index) => (
                                <React.Fragment key={district}>
                                    <tr>
                                        {/* Serial number current page ke acc calculate hoga */}
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td><strong>{district}</strong></td>
                                        <td>
                                            <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                                                {groupedCenters[district].length}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="export-btn" 
                                                style={{ 
                                                    padding: '6px 12px', 
                                                    background: expandedDistrict === district ? '#dc2626' : '#2563eb',
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
                                        <tr style={{ background: '#f8fafc' }}>
                                            <td colSpan="4" style={{ padding: '20px', border: '1px solid #e2e8f0' }}>
                                                <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}> Centers in {district}</h4>
                                                <table className="tms-table" style={{ width: '100%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                                    <thead>
                                                        <tr style={{ background: '#e2e8f0' }}>
                                                            <th>Venue Name</th>
                                                            <th>Address</th>
                                                            <th>Capacity</th>
                                                            <th>Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groupedCenters[district].map((center) => (
                                                            <tr key={center.id}>
                                                                <td>{center.venue_name}</td>
                                                                <td>{center.venue_address}</td>
                                                                <td>{center.training_hall_capacity || 'N/A'}</td>
                                                                <td>{center.centre_type || 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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

            {/* 3️⃣ PAGINATION CONTROLS UI */}
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
        </div>
    );
};

export default CenterDetail;