// src/pages/TMS/TP/tp_tr_closure.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNav from "../layout/tms_LeftNav";
import { AuthContext } from "../../../contexts/AuthContext";
import api, { TMS_API } from "../../../api/axios";
import { getCanonicalRole } from "../../../utils/roleUtils";

function fmtDate(iso) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN");
  } catch {
    return iso || "-";
  }
}

export default function TpTrainingRequestClosure() {
  const { user } = useContext(AuthContext) || {};
  const { id: requestId } = useParams();
  const navigate = useNavigate();
  const role = getCanonicalRole(user || {});
  
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [trInfo, setTrInfo] = useState(null);
  
  // State for tracking closures submitted
  const [closures, setClosures] = useState({});
  const [submittingBatch, setSubmittingBatch] = useState(null);

  // Dynamic form state per batch
  const [costForms, setCostForms] = useState({});

  const inFlightRef = useRef(false);

  /* ---------------- 1. Fetch TR Info ---------------- */
  useEffect(() => {
    async function fetchTr() {
      if (!requestId) return;
      try {
        const resp = await api.get(`/tms/training-requests/${requestId}/detail/`);
        setTrInfo(resp?.data || null);
      } catch (e) {
        console.error("fetch training request failed", e);
      }
    }
    fetchTr();
  }, [requestId]);

  /* ---------------- 2. Fetch Batches & Closures ---------------- */
  async function fetchData() {
    if (!requestId || !user?.id) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);
    try {
      // Fetch Batches
      const bResp = await TMS_API.batches.list({ request: requestId, page_size: 500 });
      const batchList = bResp?.data?.results || bResp?.data || [];
      setBatches(batchList);

      // Fetch Closure Requests to lock UI
      const cResp = await api.get(`/tms/batch-closure-requests/?batch__request=${requestId}`);
      const closureList = cResp?.data?.results || cResp?.data || [];
      const closureMap = {};
      closureList.forEach(c => {
        closureMap[c.batch] = c; // Maps batch ID to its closure request
      });
      setClosures(closureMap);

      // Initialize Cost Forms for Batches without closures
      const initialForms = {};
      batchList.forEach(b => {
        if (!closureMap[b.id]) {
          const parts = {};
          
          // Successful Beneficiaries
          (b.beneficiary_participations || []).forEach(p => {
            if (p.attended) parts[`BENEFICIARY_${p.id}`] = { hra: "", tada: "", type: "BENEFICIARY", obj: p };
          });
          
          // Successful Trainers
          (b.trainer_participations || []).forEach(p => {
            if (p.attended) parts[`TRAINER_${p.id}`] = { hra: "", tada: "", type: "TRAINER", obj: p };
          });

          initialForms[b.id] = {
            participants: parts,
            visits: { is_exposure: false, exp_cost: "", is_field: false, field_cost: "" }
          };
        }
      });
      setCostForms(prev => ({ ...prev, ...initialForms }));

    } catch (e) {
      console.error("fetch batches/closures failed", e);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);


  /* ---------------- Form Handlers ---------------- */
  const handlePartCostChange = (batchId, partKey, field, val) => {
    setCostForms(prev => ({
      ...prev,
      [batchId]: {
        ...prev[batchId],
        participants: {
          ...prev[batchId].participants,
          [partKey]: {
            ...prev[batchId].participants[partKey],
            [field]: val
          }
        }
      }
    }));
  };

  const handleVisitChange = (batchId, field, val) => {
    setCostForms(prev => ({
      ...prev,
      [batchId]: {
        ...prev[batchId],
        visits: {
          ...prev[batchId].visits,
          [field]: val
        }
      }
    }));
  };

  /* ---------------- Submit Batch Closure ---------------- */
  const submitBatchClosure = async (batchId) => {
    const form = costForms[batchId];
    if (!form) return;

    if (!window.confirm("Are you sure you want to submit the closure request for this batch? This action cannot be undone.")) return;

    setSubmittingBatch(batchId);
    try {
      // 1. Submit Line-Item Costs (TPBatchCostBreakup)
      const partKeys = Object.keys(form.participants);
      for (const key of partKeys) {
        const pData = form.participants[key];
        const hraAmt = parseFloat(pData.hra) || 0;
        const tadaAmt = parseFloat(pData.tada) || 0;
        
        await api.post('/tms/tp-batch-cost-breakups/', {
          batch: batchId,
          batch_beneficiary: pData.type === 'BENEFICIARY' ? pData.obj.id : null,
          batch_trainer: pData.type === 'TRAINER' ? pData.obj.id : null,
          participant_type: pData.type,
          hra: hraAmt,
          ta_da: tadaAmt,
          is_active: 1,
          created_by: user.id
        });
      }

      // 2. Submit Master Invoice (BatchCost)
      const costResp = await api.post('/tms/batch-costs/', {
        batch: batchId,
        training: requestId,
        is_exposure_visit: form.visits.is_exposure,
        exposure_visit_cost: form.visits.is_exposure ? (parseFloat(form.visits.exp_cost) || 0) : 0,
        is_field_visit: form.visits.is_field,
        field_visit_cost: form.visits.is_field ? (parseFloat(form.visits.field_cost) || 0) : 0,
        is_active: 1,
        created_by: user.id
      });
      
      const masterCostId = costResp.data.id;

      // 3. Submit Closure Request
      await api.post('/tms/batch-closure-requests/', {
        batch: batchId,
        batch_costing: masterCostId,
        certificates_issued: false,
        is_active: 1,
        created_by: user.id
      });

      alert(`Closure request for Batch #${batchId} submitted successfully.`);
      fetchData(); // Refresh UI to lock the batch
    } catch (e) {
      console.error("Batch closure submit failed", e);
      alert("An error occurred while submitting the closure request. Please try again.");
    } finally {
      setSubmittingBatch(null);
    }
  };

  /* ---------------- Calculation Helpers ---------------- */
  const getBatchGrandTotal = (batchId) => {
    const form = costForms[batchId];
    if (!form) return 0;
    
    let sum = 0;
    Object.values(form.participants).forEach(p => {
      sum += (parseFloat(p.hra) || 0) + (parseFloat(p.tada) || 0);
    });
    
    if (form.visits.is_exposure) sum += parseFloat(form.visits.exp_cost) || 0;
    if (form.visits.is_field) sum += parseFloat(form.visits.field_cost) || 0;

    return sum.toFixed(2);
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="app-shell">
      <LeftNav collapsed={navCollapsed} onToggle={() => setNavCollapsed((v) => !v)} />
      <div className="main-area">
        <main style={{ padding: 18 }}>
          <div style={{ maxWidth: 1200, margin: "20px auto" }}>
            
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20, gap: 8 }}>
              <h2 style={{ margin: 0 }}>Batch Closures — TR #{requestId}</h2>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
              </div>
            </div>

            {/* TR Info Card */}
            <div style={{ marginBottom: 20, padding: 16, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              {trInfo ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  <div><strong>Plan:</strong> {trInfo.training_plan?.training_name || "-"}</div>
                  <div><strong>Type:</strong> {trInfo.training_type || "-"}</div>
                  <div><strong>Status:</strong> <span style={{ fontWeight: 700, color: "#1d4ed8" }}>{trInfo.status || "-"}</span></div>
                  <div><strong>District:</strong> {trInfo.district?.district_name_en || "-"}</div>
                  <div><strong>Block:</strong> {trInfo.block?.block_name_en || "-"}</div>
                </div>
              ) : (
                <div className="muted">Loading training request details...</div>
              )}
            </div>

            {/* Batches Loop */}
            {loading ? (
              <div className="table-spinner">Loading batches...</div>
            ) : batches.length === 0 ? (
              <div className="muted">No batches found for this training request.</div>
            ) : (
              batches.map(batch => {
                const isClosed = !!closures[batch.id];
                const form = costForms[batch.id];
                const isCompleted = (batch.status || "").toUpperCase() === "COMPLETED";

                return (
                  <div key={batch.id} style={{ background: "#fff", border: "2px solid #e2e8f0", borderRadius: 10, padding: 20, marginBottom: 24, boxShadow: "0 4px 10px rgba(0,0,0,0.03)" }}>
                    
                    {/* Batch Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
                      <h3 style={{ margin: 0, color: "#0f172a" }}>
                        Batch #{batch.id} {batch.code ? `(${batch.code})` : ""}
                      </h3>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ fontSize: 13, background: "#f1f5f9", padding: "4px 10px", borderRadius: 20 }}>
                          Status: <strong>{batch.status}</strong>
                        </div>
                        {isClosed && (
                          <div style={{ fontSize: 13, background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: 20, fontWeight: "bold" }}>
                            ✅ Closure Submitted
                          </div>
                        )}
                      </div>
                    </div>

                    {!isCompleted ? (
                      <div style={{ padding: 16, background: "#fffbeb", color: "#b45309", borderRadius: 8, border: "1px solid #fde68a" }}>
                        <strong>Note:</strong> This batch must be marked as COMPLETED before you can submit a closure request.
                      </div>
                    ) : isClosed ? (
                      <div className="muted" style={{ padding: "20px 0", textAlign: "center" }}>
                        The closure request for this batch has been submitted to the DMMU for review.
                      </div>
                    ) : form ? (
                      <div>
                        {/* Section 1: Participant Costs */}
                        <h4 style={{ color: "#334155", marginBottom: 12 }}>1. Successful Participants Cost Breakup</h4>
                        {Object.keys(form.participants).length === 0 ? (
                          <div className="muted" style={{ padding: 12, background: "#f8fafc", borderRadius: 6 }}>
                            No successful participants found for this batch.
                          </div>
                        ) : (
                          <div style={{ overflowX: "auto", marginBottom: 24, border: "1px solid #e2e8f0", borderRadius: 8 }}>
                            <table className="table table-compact" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                              <thead style={{ background: "#f1f5f9" }}>
                                <tr>
                                  <th style={{ padding: 10, borderBottom: "2px solid #cbd5e1" }}>Participant Name</th>
                                  <th style={{ padding: 10, borderBottom: "2px solid #cbd5e1" }}>Role</th>
                                  <th style={{ padding: 10, borderBottom: "2px solid #cbd5e1" }}>HRA Amount (₹)</th>
                                  <th style={{ padding: 10, borderBottom: "2px solid #cbd5e1" }}>TA/DA Amount (₹)</th>
                                  <th style={{ padding: 10, borderBottom: "2px solid #cbd5e1" }}>Total (₹)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(form.participants).map(key => {
                                  const pData = form.participants[key];
                                  const name = pData.type === 'BENEFICIARY' ? pData.obj.beneficiary?.member_name : pData.obj.trainer?.full_name;
                                  const rowTotal = (parseFloat(pData.hra) || 0) + (parseFloat(pData.tada) || 0);

                                  return (
                                    <tr key={key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                      <td style={{ padding: 10, fontWeight: 500 }}>{name || "-"}</td>
                                      <td style={{ padding: 10 }}>{pData.type === 'BENEFICIARY' ? 'Trainee' : 'Trainer'}</td>
                                      <td style={{ padding: 10 }}>
                                        <input 
                                          type="number" min="0" step="0.01" className="form-control" placeholder="0.00"
                                          value={pData.hra} onChange={(e) => handlePartCostChange(batch.id, key, 'hra', e.target.value)}
                                        />
                                      </td>
                                      <td style={{ padding: 10 }}>
                                        <input 
                                          type="number" min="0" step="0.01" className="form-control" placeholder="0.00"
                                          value={pData.tada} onChange={(e) => handlePartCostChange(batch.id, key, 'tada', e.target.value)}
                                        />
                                      </td>
                                      <td style={{ padding: 10, fontWeight: "bold", color: "#0f172a" }}>
                                        ₹ {rowTotal.toFixed(2)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Section 2: Visit Costs */}
                        <h4 style={{ color: "#334155", marginBottom: 12 }}>2. Additional Batch Visit Costs</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
                          
                          {/* Exposure Visit */}
                          <div style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, background: form.visits.is_exposure ? "#eff6ff" : "#fff" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, cursor: "pointer", marginBottom: form.visits.is_exposure ? 12 : 0 }}>
                              <input 
                                type="checkbox" 
                                checked={form.visits.is_exposure} 
                                onChange={(e) => handleVisitChange(batch.id, 'is_exposure', e.target.checked)}
                                style={{ width: 16, height: 16 }}
                              />
                              Did this batch include an Exposure Visit?
                            </label>
                            {form.visits.is_exposure && (
                              <div>
                                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Exposure Visit Cost (₹)</label>
                                <input 
                                  type="number" min="0" step="0.01" className="form-control" placeholder="0.00" style={{ width: "100%" }}
                                  value={form.visits.exp_cost} onChange={(e) => handleVisitChange(batch.id, 'exp_cost', e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                          {/* Field Visit */}
                          <div style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, background: form.visits.is_field ? "#eff6ff" : "#fff" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, cursor: "pointer", marginBottom: form.visits.is_field ? 12 : 0 }}>
                              <input 
                                type="checkbox" 
                                checked={form.visits.is_field} 
                                onChange={(e) => handleVisitChange(batch.id, 'is_field', e.target.checked)}
                                style={{ width: 16, height: 16 }}
                              />
                              Did this batch include a Field Visit?
                            </label>
                            {form.visits.is_field && (
                              <div>
                                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Field Visit Cost (₹)</label>
                                <input 
                                  type="number" min="0" step="0.01" className="form-control" placeholder="0.00" style={{ width: "100%" }}
                                  value={form.visits.field_cost} onChange={(e) => handleVisitChange(batch.id, 'field_cost', e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Grand Total & Submit */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 18 }}>
                            Master Invoice Total: <strong style={{ color: "#1d4ed8" }}>₹ {getBatchGrandTotal(batch.id)}</strong>
                          </div>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: "10px 24px", fontSize: 15 }}
                            disabled={submittingBatch === batch.id}
                            onClick={() => submitBatchClosure(batch.id)}
                          >
                            {submittingBatch === batch.id ? "Submitting..." : "Submit Batch Closure"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}

          </div>
        </main>
      </div>

      <style>{`
        .form-control { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; transition: border-color 0.2s; }
        .form-control:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .btn { border-radius: 6px; padding: 6px 12px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.2s; }
        .btn:hover:not(:disabled) { opacity: 0.9; }
        .btn:disabled { cursor: not-allowed; opacity: 0.6; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
        .muted { color: #64748b; }
        .table-spinner { padding: 20px; text-align: center; color: #64748b; }
      `}</style>
    </div>
  );
}