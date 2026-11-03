import React, { useState } from "react";

const RecordedPrernaCanteens = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock list of canteens
    const canteensList = [
        { id: 1, district: "LUCKNOW", block: "BAKSHI-KA-TALAB", shg: "MAA LAXMI MAHILA SHG" },
        { id: 2, district: "LUCKNOW", block: "MOHANLALGANJ", shg: "DURGA MAHILA SHG" },
    ];

    return (
        <div className="canteen-container">
            <h2 style={{ marginBottom: "20px", color: "#111", fontSize: "1.5rem" }}>Recorded Prerna Canteens</h2>

            {/* Main Listing View */}
            <div className="table-responsive">
                <table className="canteen-table">
                    <thead>
                        <tr>
                            <th>DISTRICT</th>
                            <th>BLOCK</th>
                            <th>SHG NAME</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {canteensList.map((canteen) => (
                            <tr key={canteen.id}>
                                <td>{canteen.district}</td>
                                <td>{canteen.block}</td>
                                <td>{canteen.shg}</td>
                                <td>
                                    <button className="view-btn" onClick={() => setIsModalOpen(true)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Scrollable Output Modal View */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>

                        <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                            Canteen Details Record
                        </h3>

                        {/* 1. Location Details */}
                        <div className="section-card">
                            <div className="section-title">Location Details</div>
                            <div className="grid-3">
                                <div className="view-group">
                                    <div className="view-label">DISTRICT</div>
                                    <div className="view-value">LUCKNOW</div>
                                </div>
                                <div className="view-group">
                                    <div className="view-label">BLOCK</div>
                                    <div className="view-value">BAKSHI-KA-TALAB</div>
                                </div>
                                <div className="view-group">
                                    <div className="view-label">SHG NAME</div>
                                    <div className="view-value">MAA LAXMI MAHILA SHG</div>
                                </div>
                            </div>

                            <div className="view-group">
                                <div className="view-label">SHG MEMBERS</div>
                                <div className="tag-container">
                                    <span className="tag">RAMA DEVI (310116006739) - CLF</span>
                                    <span className="tag">VEER MATI (310116006760) - CLF</span>
                                    <span className="tag">KUSHMA (310116006702) - CLF</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Canteen Details & AOP */}
                        <div className="section-card">
                            <div className="section-title">Canteen Details</div>
                            <div className="grid-2">
                                <div className="view-group">
                                    <div className="view-label">TYPE OF CANTEEN</div>
                                    <div className="view-value">Model Prerna Canteen</div>
                                </div>
                                <div className="view-group">
                                    <div className="view-label">FOOD TYPE SERVED</div>
                                    <div className="tag-container" style={{ marginTop: '5px' }}>
                                        <span className="tag solid">Lunch</span>
                                        <span className="tag solid">Dinner</span>
                                        <span className="tag solid">Others (Rice)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="view-group">
                                    <div className="view-label">VENUE</div>
                                    <div className="view-value">Government Polytechnic</div>
                                </div>
                                <div className="view-group">
                                    <div className="view-label">COMPLETE ADDRESS</div>
                                    <div className="view-value">Aliganj, Lucknow</div>
                                </div>
                            </div>

                            {/* Sub-section: AOP */}
                            <div className="sub-section-card">
                                <div className="section-title" style={{ fontSize: '1.05rem', marginBottom: '15px' }}>Model Prerna Canteen AOP Details</div>

                                <h5 style={{ margin: '0 0 10px 0', color: '#555' }}>AOP #1</h5>
                                <div className="grid-3">
                                    <div className="view-group"><div className="view-label">NAME OF AOP</div><div className="view-value">Laxmi AOP Group</div></div>
                                    <div className="view-group"><div className="view-label">MEMBERS IN AOP</div><div className="view-value">5</div></div>
                                    <div className="view-group"><div className="view-label">A/C NUMBER</div><div className="view-value">XXXXXXXX4321</div></div>
                                    <div className="view-group"><div className="view-label">IFSC</div><div className="view-value">SBIN0001234</div></div>
                                    <div className="view-group"><div className="view-label">BRANCH</div><div className="view-value">Aliganj Branch</div></div>
                                    <div className="view-group"><div className="view-label">BANK NAME</div><div className="view-value">State Bank of India</div></div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Products and Training */}
                        <div className="grid-2">
                            <div className="section-card">
                                <div className="view-label" style={{ marginBottom: '10px' }}>PACKAGED FOOD PRODUCTS MANUFACTURED BY SHG</div>
                                <div className="view-value" style={{ marginBottom: '10px' }}>Yes</div>

                                <div className="view-label">SELECTED PRODUCTS</div>
                                <div className="tag-container">
                                    <span className="tag">Spices</span>
                                    <span className="tag">Chips</span>
                                    <span className="tag">Pickle</span>
                                    <span className="tag">Sweets</span>
                                    <span className="tag">Others (Special Spice)</span>
                                </div>
                            </div>

                            <div className="section-card">
                                <div className="view-label" style={{ marginBottom: '10px' }}>TRAINING RECEIVED (OPERATING/MANAGING)</div>
                                <div className="view-value" style={{ marginBottom: '15px' }}>Yes</div>

                                <div className="grid-2">
                                    <div className="view-group">
                                        <div className="view-label">TRAINING SOURCE</div>
                                        <div className="view-value">Govt. Workshop</div>
                                    </div>
                                    <div className="view-group">
                                        <div className="view-label">DURATION</div>
                                        <div className="view-value">14 Days</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Financial Details */}
                        <div className="section-card">
                            <div className="section-title">Financial Details</div>
                            <div className="grid-3">
                                <div className="view-group"><div className="view-label">TOTAL INVESTMENT</div><div className="view-value">₹ 58,000</div></div>
                                <div className="view-group"><div className="view-label">MONTHLY SALE</div><div className="view-value">₹ 1,200</div></div>
                                <div className="view-group"><div className="view-label">RENT</div><div className="view-value">₹ 1,200</div></div>

                                <div className="view-group"><div className="view-label">SALARY</div><div className="view-value">₹ 100</div></div>
                                <div className="view-group"><div className="view-label">ELECTRICITY</div><div className="view-value">₹ 1,000</div></div>
                                <div className="view-group"><div className="view-label">MISCELLANEOUS</div><div className="view-value">₹ 1,000</div></div>

                                <div className="view-group"><div className="view-label">OTHER EXPENSE</div><div className="view-value">₹ 1,020</div></div>
                                <div className="view-group"><div className="view-label">TOTAL INCOME</div><div className="view-value" style={{ color: 'green', fontWeight: 'bold' }}>₹ 1,200</div></div>
                                <div className="view-group"><div className="view-label">TOTAL EXPENSE</div><div className="view-value" style={{ color: 'red', fontWeight: 'bold' }}>₹ 4,320</div></div>

                                <div className="view-group"><div className="view-label">PROFIT / LOSS</div><div className="view-value" style={{ color: 'red', fontWeight: 'bold' }}>- ₹ 3,120 (Loss)</div></div>
                            </div>
                        </div>

                        {/* 5. Photos & Documents */}
                        <div className="grid-2">
                            <div className="section-card">
                                <div className="section-title">Canteen Photos</div>
                                <div style={{ marginBottom: '15px' }}>
                                    <div className="view-label">FRONT PHOTOS</div>
                                    <div className="photo-thumbnails">
                                        <div className="thumbnail" style={{ background: '#ccc' }}></div>
                                        <div className="thumbnail" style={{ background: '#ccc' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="view-label">INTERNAL PHOTOS</div>
                                    <div className="photo-thumbnails">
                                        <div className="thumbnail" style={{ background: '#ccc' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="section-card">
                                <div className="section-title">Certificates & Licensing</div>
                                <div className="document-view-box">
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📄</div>
                                    <div style={{ fontWeight: 'bold', color: '#333' }}>FSSAI_Licence_2023.pdf</div>
                                    <a href="#" style={{ display: 'inline-block', marginTop: '10px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                                        ↓ Download / View
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            <style>{`
/* Main Container - Adjusted to allow full width */
.canteen-container { 
    width: 100%; 
    font-family: sans-serif; 
}

/* Table Wrapper for responsiveness */
.table-responsive {
    width: 100%;
    overflow-x: auto;
}

/* Full Width Table Styles */
.canteen-table { 
    width: 100%; 
    border-collapse: collapse; 
    background: #fff; 
    box-shadow: 0 1px 4px rgba(0,0,0,0.1); 
    border-radius: 6px; 
    overflow: hidden; 
    border: 1px solid #e9ecef;
}

.canteen-table th { 
    padding: 16px 20px; 
    text-align: left; 
    background-color: #f8f9fa; /* Light gray background */
    color: #940a0a; /* Dark blue text */
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 2px solid #dee2e6;
}

.canteen-table td { 
    padding: 16px 20px; 
    text-align: left; 
    border-bottom: 1px solid #e9ecef; 
    color: #333;
    font-size: 0.95rem;
}

/* Button */
.view-btn { 
    background-color: #dc2626; 
    color: white; 
    border: none; 
    padding: 8px 16px; 
    border-radius: 4px; 
    cursor: pointer; 
    font-weight: 500;
}
.view-btn:hover { background-color: #940a0a; }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #fff; width: 90%; max-width: 1100px; height: 90vh; overflow-y: auto; border-radius: 10px; padding: 30px; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.close-btn { position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer; background: none; border: none; color: #666; }
.close-btn:hover { color: #000; }

/* Section Layouts */
.section-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.section-title { font-size: 1.15rem; font-weight: bold; margin-bottom: 20px; color: #222; border-left: 4px solid #007bff; padding-left: 10px; }
.sub-section-card { background: #fdfdfd; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-top: 15px; border-left: 4px solid #f5b041; }

/* Grid Layouts */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

/* Read-Only View Elements (Replaces Inputs) */
.view-group { display: flex; flex-direction: column; margin-bottom: 15px; }
.view-label { font-size: 0.75rem; color: #6c757d; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; }
.view-value { font-size: 0.95rem; color: #212529; padding: 10px 12px; background-color: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef; word-break: break-word; }

/* Tags / Pills */
.tag-container { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { background: #eef2ff; color: #2563eb; padding: 6px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 500; border: 1px solid #dbeafe; }
.tag.solid { background: #3b82f6; color: #fff; border: none; }

/* File & Document Views */
.document-view-box { border: 1px dashed #bbb; padding: 30px; text-align: center; background: #fafafa; border-radius: 8px; }
.photo-thumbnails { display: flex; gap: 10px; margin-top: 8px; }
.thumbnail { width: 90px; height: 90px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; }
            `}</style>
        </div>
    );
};

export default RecordedPrernaCanteens;