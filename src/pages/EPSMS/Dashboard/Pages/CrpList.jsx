import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LOOKUP_API } from '../../../../api/axios.js';
import CrpFiltersExport from '../components/CrpFiltersExport';

const CrpList = ({ isOpen, crps = [], title, loading = false, error = '', onSelectDistrict }) => {
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  const resetFilters = () => {
    setSelectedDistrict('');
    setSelectedBlock('');
  };

  useEffect(() => {
    async function loadDistricts() {
      try {
        const res = await LOOKUP_API.districts.list({ page_size: 1000 });
        const payload = res.data?.results || res.data || [];
        setDistricts(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error('Failed to load districts for CRP filters', err);
        setDistricts([]);
      }
    }

    loadDistricts();
  }, []);

  useEffect(() => {
    if (!selectedDistrict) {
      setBlocks([]);
      setSelectedBlock('');
      return;
    }

    async function loadBlocks() {
      try {
        const res = await LOOKUP_API.blocksByDistrict(selectedDistrict);
        const payload = res.data?.results || res.data || [];
        setBlocks(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error('Failed to load blocks for selected district', err);
        setBlocks([]);
      }
    }

    loadBlocks();
  }, [selectedDistrict]);

  if (!isOpen) return null;

  const crpList = Array.isArray(crps) ? crps : [];
  const heading = title || 'DISTRICT WISE CRP ONBOARDING REPORT';

  // Pagination: show 15 rows per page for mapped CRP list
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const findFieldValue = (source, fieldNames = []) => {
    if (!source || typeof source !== 'object') return '';
    if (Array.isArray(source)) {
      for (const item of source) {
        const nested = findFieldValue(item, fieldNames);
        if (nested) return nested;
      }
      return '';
    }

    for (const field of fieldNames) {
      const value = source[field];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }

    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object') {
        const nested = findFieldValue(value, fieldNames);
        if (nested) return nested;
      }
    }

    return '';
  };

  const filteredCrps = crpList.filter((crp) => {
    if (!crp || typeof crp !== 'object') return false;

    if (selectedDistrict) {
      const rowDistrictId = findFieldValue(crp, [
        'district_id',
        'districtId',
        'district_id_value',
        'district_code',
        'districtCode',
        'dmmu_id',
        'dmmuId',
      ]);
      const rowDistrictName = findFieldValue(crp, [
        'district_name',
        'district',
        'districtName',
        'district_name_en',
        'district_name_hi',
        'districtNameHindi',
        'districtNameEnglish',
      ]);
      if (
        rowDistrictId !== String(selectedDistrict) &&
        rowDistrictName !== String(selectedDistrict)
      ) {
        return false;
      }
    }

    if (selectedBlock) {
      const rowBlockId = findFieldValue(crp, [
        'block_id',
        'blockId',
        'block_code',
        'blockCode',
      ]);
      const rowBlockName = findFieldValue(crp, [
        'block_name',
        'block',
        'blockName',
        'block_name_en',
        'block_name_hi',
      ]);
      if (
        rowBlockId !== String(selectedBlock) &&
        rowBlockName !== String(selectedBlock)
      ) {
        return false;
      }
    }

    return true;
  });

  const parseNumericValue = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const cleaned = value.replace(/,/g, '').trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.reduce((sum, item) => sum + parseNumericValue(item), 0);
      }
      return parseNumericValue(value.value ?? value.count ?? value.total ?? value.number ?? value.amount ?? value.value_ ?? value.count_value);
    }
    return 0;
  };

  const findDistrictName = (source) => {
    if (!source || typeof source !== 'object') return '-';

    if (Array.isArray(source)) {
      for (const item of source) {
        const nested = findDistrictName(item);
        if (nested && nested !== '-') return nested;
      }
      return '-';
    }

    const directFieldNames = [
      'district_name',
      'district',
      'districtName',
      'district_name_en',
      'district_name_hi',
      'districtNameHindi',
      'districtNameEnglish',
      'district_title',
      'district_label',
      'district_code',
      'name',
    ];

    for (const field of directFieldNames) {
      const value = source[field];
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number') return String(value);
    }

    for (const [key, value] of Object.entries(source)) {
      const keyLower = String(key).toLowerCase();
      if (/(district|block|city|tehsil|name|title|label)/i.test(keyLower)) {
        if (typeof value === 'string' && value.trim()) return value.trim();
        if (typeof value === 'number') return String(value);
      }

      if (value && typeof value === 'object') {
        const nested = findDistrictName(value);
        if (nested && nested !== '-') return nested;
      }
    }

    return '-';
  };

  const findCountValue = (source) => {
    if (!source || typeof source !== 'object') return 0;

    if (Array.isArray(source)) {
      return source.reduce((sum, item) => sum + findCountValue(item), 0);
    }

    for (const [key, value] of Object.entries(source)) {
      const keyLower = String(key).toLowerCase();
      if (/(count|total|crp|num|value|amount)/i.test(keyLower)) {
        const numericValue = parseNumericValue(value);
        if (numericValue > 0) {
          return numericValue;
        }
      }
    }

    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object') {
        const nested = findCountValue(value);
        if (nested > 0) {
          return nested;
        }
      }
    }

    return 0;
  };

  const rows = filteredCrps.map((crp, index) => {
    if (Array.isArray(crp)) {
      const districtName = crp.district_name_en || crp.district_name || crp.name || crp.label || crp.label_en || crp.districtName || crp.district_name_hi || crp.districtNameEnglish || crp.districtNameHindi || '-';
      const countValue = crp.created_crp_count || crp.total_crp_count || crp.crp_count || crp.count || crp.total || crp.value || 0;
      const targetValue = crp.district_target_count || crp.target_count || crp.target || 0;
      return {
        id: index + 1,
        districtName: districtName ? String(districtName) : '-',
        totalCrpCount: parseNumericValue(countValue),
        target: parseNumericValue(targetValue),
      };
    }

    if (crp && typeof crp === 'object' && !Array.isArray(crp)) {
      const districtName = findFieldValue(crp, [
        'district_name',
        'district',
        'districtName',
        'district_name_en',
        'district_name_hi',
        'districtNameHindi',
        'districtNameEnglish',
        'name',
      ]) || '-';
      const totalCrpCount = crp.created_crp_count || crp.total_crp_count || crp.crp_count || crp.count || crp.total || crp.value || 0;
      const targetValue = crp.district_target_count || crp.target_count || crp.target || 0;

      return {
        id: index + 1,
        districtName: String(districtName),
        totalCrpCount,
        target: parseNumericValue(targetValue),
        raw: crp,
      };
    }

    return {
      id: index + 1,
      districtName: '-',
      totalCrpCount: 0,
      target: parseNumericValue(targetValue),
      raw: crp,
    };
  });

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paginatedRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDistrict, selectedBlock, crps]);

  const columns = [
    { key: 'id', label: 'Sr No' },
    { key: 'districtName', label: 'District Name' },
    { key: 'target', label: 'Target' },
    { key: 'totalCrpCount', label: 'Total CRP Count' },
    { key: 'action', label: 'Action' },
  ];

  const columnWidths = {
    id: 70,
    districtName: 240,
    target: 160,
    totalCrpCount: 160,
    action: 100,
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const exportToExcel = () => {
    const exportRows = rows.map((row, index) => {
      const exportRow = {};

      columns.forEach((column) => {
        exportRow[column.label] = formatValue(row[column.key]);
      });

      return {
        'Sr No': index + 1,
        'District Name': exportRow['District Name'],
        'Total CRP Count': exportRow['Total CRP Count'],
        
        Target: exportRow.Target,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mapped CRP List');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(file, `${heading.replace(/\s+/g, '_') || 'Mapped_CRP_List'}.xlsx`);
  };

  return (
    <div style={{ marginTop: '0px', padding: '14px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
      {loading ? (
        <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>Loading mapped CRP data...</p>
      ) : error ? (
        <p style={{ color: '#b91c1c', fontSize: '13px', margin: 0 }}>{error}</p>
      ) : rows.length === 0 ? (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button
              type="button"
              onClick={resetFilters}
              style={{
                height: '36px',
                width: '79px',
                marginTop: '-20px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #084b2c',
                background: 'linear-gradient(135deg, #f59e0b 0%, #feae24 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Back
            </button>
          </div>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0, paddingTop: '4px' }}>No mapped CRP data available for the selected district/block.</p>
        </div>
      ) : (
        <div>
          <CrpFiltersExport
            heading={heading}
            districts={districts}
            blocks={blocks}
            selectedDistrict={selectedDistrict}
            selectedBlock={selectedBlock}
            onDistrictChange={(val) => { setSelectedDistrict(val); setSelectedBlock(''); }}
            onBlockChange={(val) => setSelectedBlock(val)}
            onClearFilters={resetFilters}
            onExport={exportToExcel}
            exportDisabled={rows.length === 0}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px', backgroundColor: '#ffffff', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#ffffff' }}>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{
                        padding: '12px 14px',
                        border: '1px solid #e2e8f0',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                        width: columnWidths[column.key] || 'auto',
                        minWidth: columnWidths[column.key] || 'auto',
                        textAlign: 'center',
                      }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        style={{
                          padding: '12px 14px',
                          border: '1px solid #e2e8f0',
                          color: '#0f172a',
                          verticalAlign: 'middle',
                          backgroundColor: '#ffffff',
                          width: columnWidths[column.key] || 'auto',
                          minWidth: columnWidths[column.key] || 'auto',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {column.key === 'action' ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              try {
                                event.stopPropagation();
                                const originalIndex = (currentPage - 1) * PAGE_SIZE + index;
                                console.log('CRP List: View clicked', filteredCrps[originalIndex]);
                                onSelectDistrict?.(filteredCrps[originalIndex]);
                              } catch (e) {
                                console.error('Error handling View click', e);
                              }
                            }}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #2563eb',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              color: '#ffffff',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 700,
                            }}
                          >
                            View
                          </button>
                        ) : (
                          formatValue(row[column.key])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#097e3a', fontSize: '13px' }}>
              Showing {rows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, rows.length)} of {rows.length} records
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrpList;