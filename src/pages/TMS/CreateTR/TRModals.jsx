// src/pages/TMS/CreateTR/TRModals.jsx
import React from "react";

export function PreviewConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  onCheckEngagement,
  engagementStatus,
  hasParticipants,
  submitting,
  previewPayload,
  selectedPlanTitle,
  partnerName,
  engagedParticipants,
  trainingType,
  removeIneligibleParticipants,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 920,
          maxHeight: "88vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 8,
          padding: 18,
        }}
      >
        <h3>Preview Training Request</h3>
        <div style={{ color: "#6c757d", marginBottom: 12 }}>
          Review payload below. Confirm to submit.
        </div>

        <div style={{ gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h4>Details</h4>
            <div
              style={{
                background: "#f7fafc",
                padding: 14,
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {Object.entries(previewPayload || {})
                .filter(
                  ([key]) =>
                    key !== "block" &&
                    key !== "created_by" &&
                    key !== "district",
                )
                .map(([key, value]) => {
                  if (key === "training_plan") value = selectedPlanTitle || "-";
                  if (key === "partner") value = partnerName || value || "-";

                  return (
                    <div
                      key={key}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr",
                        padding: "6px 0",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {key
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      <div>{value ?? "-"}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {engagementStatus === "has_engaged" && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#fef2f2",
              border: "1px solid #f87171",
              borderRadius: 8,
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#b91c1c" }}>
              ⚠️ Ineligible Participants Found
            </h4>
            <div style={{ fontSize: 13, color: "#991b1b", marginBottom: 12 }}>
              The following participants are currently engaged in another
              ongoing/scheduled training and cannot be added.
            </div>
            <div
              style={{
                maxHeight: 150,
                overflow: "auto",
                background: "#fff",
                border: "1px solid #fca5a5",
                borderRadius: 6,
              }}
            >
              <table className="table table-compact" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>
                      {trainingType === "BENEFICIARY"
                        ? "Member Code"
                        : "Designation"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {engagedParticipants.map((p, i) => (
                    <tr key={i}>
                      <td>{p.member_name || p.full_name || p.name || "—"}</td>
                      <td>
                        {trainingType === "BENEFICIARY"
                          ? p.lokos_member_code
                          : p.designation || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button
                className="btn-sm btn-flat"
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                }}
                onClick={removeIneligibleParticipants}
              >
                Remove Ineligible Participants
              </button>
            </div>
          </div>
        )}

        {engagementStatus === "all_clear" && (
          <div
            style={{
              marginTop: 16,
              padding: 10,
              background: "#f0fdf4",
              border: "1px solid #4ade80",
              borderRadius: 8,
              color: "#166534",
              fontWeight: 600,
            }}
          >
            ✅ All selected participants are eligible and available! You can now
            submit.
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={submitting || engagementStatus === "checking"}
          >
            Cancel
          </button>

          {/* NEW: Updated Minimum 15 Warning */}
          {!hasParticipants && (
            <div
              style={{
                color: "#dc3545",
                marginBottom: 8,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
              }}
            >
              ⚠ Participant selection does not meet the minimum requirement.
            </div>
          )}

          {engagementStatus === "idle" || engagementStatus === "has_engaged" ? (
            <button
              className="btn"
              onClick={onCheckEngagement}
              disabled={
                engagementStatus === "checking" ||
                engagementStatus === "has_engaged" ||
                !hasParticipants
              }
              style={{
                opacity:
                  engagementStatus === "checking" || !hasParticipants ? 0.6 : 1,
                cursor:
                  engagementStatus === "checking" || !hasParticipants
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {engagementStatus === "checking"
                ? "Checking Availability..."
                : "Check Availability & Confirm"}
            </button>
          ) : (
            <button
              className="btn"
              onClick={onConfirm}
              disabled={submitting || !hasParticipants}
              style={{
                opacity: submitting || !hasParticipants ? 0.6 : 1,
                cursor:
                  submitting || !hasParticipants ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting…" : "Final Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SubmissionSummaryModal({ summary, onClose }) {
  if (!summary) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
      }}
    >
      <div
        style={{
          width: 760,
          background: "#fff",
          borderRadius: 8,
          padding: 18,
        }}
      >
        <h3>Submission Result</h3>
        <div style={{ marginBottom: 8 }}>
          {summary.trId ? (
            <div>Training Request created!</div>
          ) : (
            <div style={{ color: "#b03a2e" }}>
              Failed to create training request
            </div>
          )}
        </div>

        {summary.failures?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h4>Errors</h4>
            <div
              style={{
                maxHeight: 260,
                overflow: "auto",
                border: "1px solid #f1f3f5",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <ul>
                {summary.failures.map((f, i) => (
                  <li key={i}>
                    <strong>{f.type}</strong>:{" "}
                    {f.error || JSON.stringify(f.row)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 12,
          }}
        >
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export function PreloadModal({ isOpen, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          width: 520,
          background: "#fff",
          borderRadius: 8,
          padding: 18,
          textAlign: "center",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Loading data…</h3>
        <p style={{ color: "#6c757d" }}>
          Preparing training plans and themes. Master trainers and partners are
          loaded only when needed.
        </p>
        <div style={{ marginTop: 12 }}>
          <div className="table-spinner" style={{ padding: 12 }}>
            Loading…
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function PreloadErrorToast({ errors, onDismiss }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 99999,
        background: "#fff4e5",
        border: "1px solid #ffd8a8",
        padding: 12,
        borderRadius: 8,
        maxWidth: 420,
      }}
    >
      <strong>Some data failed to load</strong>
      <div style={{ fontSize: 13, color: "#6c757d", marginTop: 6 }}>
        {errors.join(", ")}
      </div>
      <div style={{ marginTop: 8, textAlign: "right" }}>
        <button className="btn-sm btn-flat" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
