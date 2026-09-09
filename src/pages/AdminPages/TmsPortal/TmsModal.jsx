import React from 'react';
import { createPortal } from 'react-dom';

const TmsModal = ({
  isOpen,
  modalView,
  modalTitle,
  selectedYear,
  modalBatches,
  modalParticipants,
  onClose
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  const renderBatchField = (value) => {
    if (value == null) return 'N/A';
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (Array.isArray(value)) return value.map((item) => renderBatchField(item)).join(', ');
    if (typeof value === 'object') {
      return (
        value.block_name_en || value.block_name_local ||
        value.district_name_en || value.district_name ||
        value.district || value.name || value.title ||
        JSON.stringify(value)
      );
    }
    return String(value);
  };

  const renderParticipantName = (p) => {
    if (!p) return 'N/A';
    return (
      p.name || p.full_name || p.beneficiary_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.member_name || 'N/A'
    );
  };

  const getDistrictNameFromBatch = (batch) => {
    if (!batch) return 'N/A';
    if (batch.district_name) return batch.district_name;
    if (batch.district_name_en) return batch.district_name_en;
    const d = batch.district || batch.districts;
    if (d) {
      if (Array.isArray(d)) {
        return d.map(item => item.district_name_en || item.district_name || item.name || item.title).filter(Boolean).join(', ');
      }
      return d.district_name_en || d.district_name || d.name || d.title || d.district_short_name_en || d.district_id || 'N/A';
    }
    if (batch.district_id) return String(batch.district_id);
    return 'N/A';
  };

  const getBlockNameFromBatch = (batch) => {
    if (!batch) return 'N/A';
    if (batch.block_name) return batch.block_name;
    if (batch.block_name_en) return batch.block_name_en;
    if (batch.block_name_local) return batch.block_name_local;
    const b = batch.block || batch.blocks;
    if (b) {
      if (Array.isArray(b)) {
        return b.map(item => item.block_name_en || item.block_name_local || item.name || item.title).filter(Boolean).join(', ');
      }
      return b.block_name_en || b.block_name_local || b.block_name || b.name || b.title || b.block_id || 'N/A';
    }
    if (batch.block_id) return String(batch.block_id);
    return 'N/A';
  };

  const getDistrictNameFromPerson = (p) => {
    if (!p) return 'N/A';
    if (p.district_name) return p.district_name;
    if (p.district_name_en) return p.district_name_en;
    const d = p.district || p.districts;
    if (d) {
      if (Array.isArray(d)) return d.map(x => x.district_name_en || x.district_name || x.name).filter(Boolean).join(', ');
      return d.district_name_en || d.district_name || d.name || d.title || 'N/A';
    }
    if (p.district_id) return String(p.district_id);
    return 'N/A';
  };

  const getBlockNameFromPerson = (p) => {
    if (!p) return 'N/A';
    if (p.block_name) return p.block_name;
    if (p.block_name_en) return p.block_name_en;
    if (p.block_name_local) return p.block_name_local;
    const b = p.block || p.blocks;
    if (b) {
      if (Array.isArray(b)) return b.map(x => x.block_name_en || x.block_name_local || x.name).filter(Boolean).join(', ');
      return b.block_name_en || b.block_name_local || b.block_name || b.name || 'N/A';
    }
    if (p.block_id) return String(p.block_id);
    return 'N/A';
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{modalTitle}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {modalView === 'batches' ? (
            <>
              <div className="modal-summary">
                Showing {modalBatches.length} batch{modalBatches.length === 1 ? '' : 'es'} for {selectedYear}.
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Batch Code</th>
                      <th>Status</th>
                      <th>District</th>
                      <th>Block</th>
                      <th>Enrolled</th>
                      <th>Batch Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalBatches.length > 0 ? (
                      modalBatches.map((batch, index) => (
                        <tr key={batch.id || batch.batch_code || index}>
                          <td>{index + 1}</td>
                          <td>{renderBatchField(batch.batch_code || batch.batchName || batch.name)}</td>
                          <td>{renderBatchField(batch.status || batch.batch_status)}</td>
                          <td>{getDistrictNameFromBatch(batch)}</td>
                          <td>{getBlockNameFromBatch(batch)}</td>
                          <td>{renderBatchField(Number(batch.pax_count || batch.participant_count || batch.participants || 0).toLocaleString())}</td>
                          <td>{renderBatchField(batch.batch_type || batch.training_type || batch.batchType)}</td>
                          <td>{renderBatchField(batch.batch_start_date || batch.start_date || batch.from_date)}</td>
                          <td>{renderBatchField(batch.batch_end_date || batch.end_date || batch.to_date)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          No batch details available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="modal-summary">
                Showing {modalParticipants.length} participant{modalParticipants.length === 1 ? '' : 's'} across {modalBatches.length} batch{modalBatches.length === 1 ? '' : 'es'} for {selectedYear}.
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Gender</th>
                      <th>District</th>
                      <th>Block</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {modalParticipants.length > 0 ? (
                      modalParticipants.map((p, idx) => (
                        <tr key={p.id || p.participation_id || idx}>
                          <td>{idx + 1}</td>
                          <td>{renderParticipantName(p)}</td>
                          <td>{renderBatchField(p.mobile || p.phone || p.contact_number || p.mobile_number)}</td>
                          <td>{renderBatchField(p.gender || p.sex)}</td>
                          <td>{getDistrictNameFromPerson(p)}</td>
                          <td>{getBlockNameFromPerson(p)}</td>
                          <td>{renderBatchField(p._batchCode)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          Loading participants...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TmsModal;