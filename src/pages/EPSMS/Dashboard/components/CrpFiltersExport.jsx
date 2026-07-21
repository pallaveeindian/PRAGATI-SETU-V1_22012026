import React from 'react';

export default function CrpFiltersExport({
    heading,
    districts = [],
    blocks = [],
    selectedDistrict = '',
    selectedBlock = '',
    onDistrictChange = () => { },
    onBlockChange = () => { },
    onClearFilters = () => { },
    onExport = () => { },
    exportDisabled = false,
}) {
    return (
        <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
            <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{heading}</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'flex-end' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#475569' }}>
                        District
                        <select
                            value={selectedDistrict}
                            onChange={(e) => { onDistrictChange(e.target.value); }}
                            style={{ marginTop: '6px', minWidth: '220px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">All Districts</option>
                            {districts.map((district) => (
                                <option key={district.district_id || district.districtCode || district.district_code || district.name} value={district.id || district.district_id || district.districtCode || district.district_code || district.name}>
                                    {district.district_name_en || district.district_name || district.name || district.label || district.label_en || district.districtName || district.district_name_hi || district.districtNameEnglish || district.districtNameHindi}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: '#475569' }}>
                        Block
                        <select
                            value={selectedBlock}
                            onChange={(e) => onBlockChange(e.target.value)}
                            disabled={!selectedDistrict}
                            style={{ marginTop: '6px', minWidth: '220px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict ? '#ffffff' : '#f8fafc' }}
                        >
                            <option value="">All Blocks</option>
                            {blocks.map((block) => (
                                <option key={block.block_id || block.blockCode || block.block_code || block.name} value={block.id || block.block_id || block.blockCode || block.block_code || block.name}>
                                    {block.block_name_en || block.block_name || block.name || block.label || block.blockName || block.block_name_hi}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        onClick={onClearFilters}
                        disabled={!selectedDistrict && !selectedBlock}
                        style={{
                            height: '48px',
                            width: '130px',
                            borderRadius: '8px',
                            border: '1px solid #475569',
                            background: selectedDistrict || selectedBlock ? '#22c55e' : '#f1f5f9',
                            color: selectedDistrict || selectedBlock ? '#ffffff' : '#475569',
                            cursor: selectedDistrict || selectedBlock ? 'pointer' : 'not-allowed',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '0 16px',
                            marginTop: '0px',
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={onExport}
                disabled={exportDisabled}
                style={{
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #16a34a',
                    background: exportDisabled ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#fff',
                    cursor: exportDisabled ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxShadow: exportDisabled ? 'none' : '0 4px 10px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                    if (!exportDisabled) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(22, 163, 74, 0.3)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #34d399 0%, #15803d 100%)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!exportDisabled) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(22, 163, 74, 0.25)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                    }
                }}
            >
                Export to Excel
            </button>
        </div>
    );
}
