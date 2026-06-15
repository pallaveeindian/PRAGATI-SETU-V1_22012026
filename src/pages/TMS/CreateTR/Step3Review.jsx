// src/pages/TMS/CreateTR/Step3Review.jsx
import React from "react";

export default function Step3Review({
  selectedPlan,
  selectedPlanTitle,
  form,
  roleKey,
  autoPartnerAssigned,
  partners,
  selectedBeneficiaries,
  selectedTrainerList,
  goToPrev,
  openPreview,
  removeSelectedBeneficiary,
  removeSelectedTrainer,
}) {
  const btnPrimary = {
    background: "linear-gradient(20deg, #e4ecf5, #5a8cc2)",
    border: "2px solid #3d6ba6",
    color: "#111827",
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>3 — Review & Submit</h3>
          <div className="muted">Preview payload and confirm submission.</div>
        </div>
        <div>
          <button
            className="btnPrimaryHover"
            style={btnPrimary}
            onClick={goToPrev}
          >
            Back
          </button>
          <button
            style={{ ...btnPrimary, marginLeft: 8 }}
            onClick={openPreview}
            className="btnPrimaryHover"
          >
            Preview & Confirm
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 700 }}>
          Financial Year
        </label>
        <div
          style={{
            padding: 8,
            background: "#f8fafc",
            borderRadius: 6,
          }}
        >
          {form.financial_year || "(none selected)"}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 700 }}>
          Training Plan
        </label>
        <div
          style={{
            padding: 8,
            background: "#f8fafc",
            borderRadius: 6,
          }}
        >
          {selectedPlan ? selectedPlanTitle : "(none selected)"}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", fontWeight: 700 }}>Partner</label>
        {roleKey === "bmmu" && autoPartnerAssigned ? (
          <div
            style={{
              padding: 8,
              background: "#fbfdff",
              borderRadius: 6,
            }}
          >
            {partners.find((p) => String(p.id) === String(form.partner))
              ?.name || `Partner ID ${form.partner}`}
          </div>
        ) : (
          <div style={{ marginTop: 10 }}>
            <label style={{ fontWeight: 700 }}>Training Partner</label>
            {form.partner ? (
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #ecfeff, #cffafe)",
                  border: "1px solid #06b6d4",
                  fontWeight: 600,
                  color: "#0c4a6e",
                }}
              >
                {partners.find((p) => String(p.id) === String(form.partner))
                  ?.name || `Partner ID: ${form.partner}`}
              </div>
            ) : (
              <div
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "#fef2f2",
                  border: "1px solid #dc2626",
                  color: "#dc2626",
                  fontWeight: 600,
                }}
              >
                No Training Partner has been assigned a target for this training
                plan.
              </div>
            )}
          </div>
        )}
        {!autoPartnerAssigned && (
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "#dc2626",
              fontWeight: 600,
            }}
          >
            Please wait till all training partners are assigned their targets by
            State.
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Selected Participants</h4>
        {form.training_type === "BENEFICIARY" ? (
          selectedBeneficiaries.length === 0 ? (
            <p className="muted">No beneficiaries selected.</p>
          ) : (
            <div
              className="table-wrapper"
              style={{ maxHeight: 220, overflow: "auto" }}
            >
              <table className="table table-compact">
                <thead>
                  <tr>
                    <th>SHG</th>
                    <th>Member</th>
                    <th>Member Code</th>
                    <th>Age</th>
                    <th>PLD</th>
                    <th>District</th>
                    <th>Block</th>
                    <th>Panchayat</th>
                    <th>Village</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBeneficiaries.map((b, idx) => (
                    <tr
                      key={`${b.lokos_shg_code}|${b.lokos_member_code}|${idx}`}
                    >
                      <td>{b.lokos_shg_code || "—"}</td>
                      <td>{b.member_name || "—"}</td>
                      <td>{b.lokos_member_code || "—"}</td>
                      <td>{b.age ?? "—"}</td>
                      <td>{b.pld_status || "—"}</td>
                      <td>{b.district_id || "—"}</td>
                      <td>{b.block_id || "—"}</td>
                      <td>{b.panchayat_id || "—"}</td>
                      <td>{b.village_id || "—"}</td>
                      <td>
                        <button
                          className="btn-sm btn-flat"
                          onClick={() =>
                            removeSelectedBeneficiary(
                              b.lokos_member_code,
                              b.lokos_shg_code,
                            )
                          }
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : selectedTrainerList.length === 0 ? (
          <p className="muted">No trainers selected.</p>
        ) : (
          <div
            className="table-wrapper"
            style={{ maxHeight: 220, overflow: "auto" }}
          >
            <table className="table table-compact">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>District</th>
                  <th>Block</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedTrainerList.map((t) => (
                  <tr key={t.id}>
                    <td>{t.full_name || t.name}</td>
                    <td>{t.designation || "-"}</td>
                    <td>{t.empanel_district || "-"}</td>
                    <td>{t.empanel_block || "-"}</td>
                    <td>
                      <button
                        className="btn-sm btn-flat"
                        onClick={() => removeSelectedTrainer(t.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
