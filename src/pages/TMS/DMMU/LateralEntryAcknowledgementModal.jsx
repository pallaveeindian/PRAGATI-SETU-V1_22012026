// src\pages\TMS\DMMU\LateralEntryAcknowledgementModal.jsx
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import api, { TMS_API } from "../../../api/axios";

export default function LateralEntryAcknowledgementModal({
  open,
  batchId,
  batchDetail,
  batchStatus,
  createdBy,
  onAcknowledged,
}) {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Rejection modal state
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const participantType = useMemo(() => {
    const rawType = (batchDetail?.participant_type || "").toUpperCase();
    if (
      rawType === "TRAINER" ||
      rawType === "STAFF" ||
      rawType === "BENEFICIARY"
    ) {
      return rawType;
    }
    if ((batchDetail?.trainer_participations || []).length > 0)
      return "TRAINER";
    if ((batchDetail?.staff_participations || []).length > 0) return "STAFF";
    return "BENEFICIARY";
  }, [batchDetail]);

  // Only display participants marked as lateral entries across all 3 batch types.
  const lateralParticipants = useMemo(() => {
    if (participantType === "TRAINER") {
      return (batchDetail?.trainer_participations || []).filter(
        (item) => item?.is_lateral === true,
      );
    }
    if (participantType === "STAFF") {
      return (batchDetail?.staff_participations || []).filter(
        (item) => item?.is_lateral === true,
      );
    }
    return (batchDetail?.beneficiary_participations || []).filter(
      (item) => item?.is_lateral === true,
    );
  }, [batchDetail, participantType]);

  const tableHeadings = useMemo(() => {
    if (participantType === "TRAINER") {
      return [
        "S.No.",
        "Trainer Name",
        "Designation",
        "Theme",
        "District",
        "Block",
        "Mobile",
      ];
    }
    if (participantType === "STAFF") {
      return [
        "S.No.",
        "Staff Name",
        "Employee ID",
        "Designation",
        "District",
        "Block",
        "Mobile",
      ];
    }
    return [
      "S.No.",
      "Participant Name",
      "LOKOS ID",
      "District",
      "Block",
      "Panchayat",
      "Mobile",
    ];
  }, [participantType]);

  const getUsername = () => {
    try {
      const storedUser = sessionStorage.getItem("ps_user");

      if (!storedUser) return "User";

      try {
        const parsed = JSON.parse(storedUser);

        if (typeof parsed === "string") return parsed;

        return parsed?.username || parsed?.user_name || parsed?.name || "User";
      } catch {
        return storedUser;
      }
    } catch {
      return "User";
    }
  };

  const handleCancel = () => {
    navigate("/tms/batches-list/");
  };

  // Acknowledge lateral entries
  const handleAcknowledge = async () => {
    if (saving) return;

    // Validate batch status before submitting acknowledgement.
    if (!batchStatus) {
      setError("Batch status is not available. Please try again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const username = getUsername();
      const now = new Date();

      const date = now.toLocaleDateString("en-IN");
      const time = now.toLocaleTimeString("en-IN");

      const remarks = `Acknowledge and approved by ${username} on ${date} at ${time}`;

      await TMS_API.batchRegisterHistory.create({
        batch: Number(batchId),
        created_by: Number(createdBy),
        status: "PENDING",
        remarks,
      });

      alert("Lateral entry participants acknowledged successfully.");

      if (onAcknowledged) {
        onAcknowledged();
      }
    } catch (err) {
      console.error("Lateral entry acknowledgement failed:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to acknowledge lateral entries. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Open the rejection form. Do not call the API here.
  const openRejectForm = () => {
    setRejectReason("");
    setError("");
    setRejectMode(true);
  };

  const closeRejectForm = () => {
    if (saving) return;

    setRejectMode(false);
    setRejectReason("");
    setError("");
  };

  // Reject only after the user enters a reason and confirms.
  const handleRejectBatch = async () => {
    if (saving) return;

    const reason = rejectReason.trim();

    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.patch(`/tms/batch/${batchId}/approve-reject/`, {
        status: "REJECTED",
        rejection_reason: reason,
      });

      alert("Batch has been rejected and returned to the creator.");

      navigate("/tms/batches-list/");
    } catch (err) {
      console.error("Batch rejection failed:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.response?.data?.rejection_reason?.[0] ||
          "Failed to reject batch. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const modalRoot = document.body;

  const mainModal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lateral-entry-title"
      onClick={handleCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1100px, 98vw)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* Enhanced Important Header */}
        <div
          style={{
            padding: "26px 28px",
            background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)",
            borderBottom: "5px solid #fbbf24",
            borderRadius: "14px 14px 0 0",
            color: "#ffffff",
          }}
        >
          {/* Important Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 15px",
              marginBottom: "16px",
              background: "#fef2f2",
              color: "#991b1b",
              borderRadius: "5px",
              fontWeight: 900,
              fontSize: "13px",
              letterSpacing: "1px",
              border: "1px solid #fecaca",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <span style={{ fontSize: "17px" }}>⚠</span>
            IMPORTANT NOTICE
          </div>

          {/* Main Heading */}
          <h2
            id="lateral-entry-title"
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 900,
              lineHeight: 1.35,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
              textShadow: "0 2px 5px rgba(0,0,0,0.25)",
            }}
          >
            Verify Lateral Entry Participants
          </h2>

          {/* Subheading */}
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "8px 13px",
              background: "rgba(255,255,255,0.15)",
              borderLeft: "4px solid #fbbf24",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.4px",
            }}
          >
            ACTION REQUIRED BEFORE BATCH APPROVAL
          </div>

          {/* English Instruction */}
          <p
            style={{
              margin: "18px 0 0",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 500,
              lineHeight: 1.8,
            }}
          >
            The following candidates do not have previous training records in
            the system. They have been directly enrolled in this module. Please
            verify that these candidates have completed their previous training
            offline before acknowledging.
          </p>

          {/* Hindi Instruction */}
          <div
            style={{
              marginTop: "14px",
              padding: "13px 15px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "7px",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: 1.8,
              }}
            >
              क्या आप पुष्टि करते हैं कि इन प्रतिभागियों ने अपने सभी पिछले
              मॉड्यूलों का प्रशिक्षण पूर्ण कर लिया है?
            </p>
          </div>

          {/* Important Reminder */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px 14px",
              background: "#fef3c7",
              color: "#78350f",
              borderRadius: "7px",
              fontSize: "13px",
              fontWeight: 800,
              lineHeight: 1.6,
            }}
          >
            {/* <span style={{ fontSize: "18px" }}>!</span> */}
            <span>
              Please carefully verify the participant details and confirm
              offline training completion before proceeding with batch approval.
            </span>
          </div>
        </div>

        {/* Participant table */}
        <div style={{ padding: "22px 26px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "15px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "17px",
                color: "#0f172a",
              }}
            >
              Lateral Entry Participants
            </h3>

            <span
              style={{
                background: "#ffedd5",
                color: "#9a3412",
                borderRadius: "20px",
                padding: "6px 13px",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Total: {lateralParticipants.length}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: "9px",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "850px",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  {tableHeadings.map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "13px 12px",
                        textAlign: "left",
                        color: "#334155",
                        borderBottom: "1px solid #cbd5e1",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lateralParticipants.length > 0 ? (
                  lateralParticipants.map((item, index) => {
                    if (participantType === "TRAINER") {
                      const tr = item?.trainer || {};
                      const mt = tr?.trainer || {};

                      return (
                        <tr
                          key={item?.id || tr?.id || index}
                          style={{
                            background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                          }}
                        >
                          <td style={tableCellStyle}>{index + 1}</td>
                          <td style={tableCellStyle}>
                            {tr?.full_name || mt?.full_name || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {mt?.designation || tr?.designation || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {mt?.theme?.theme_name || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {tr?.district_name_en ||
                              batchDetail?.district_name_en ||
                              "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {tr?.block_name_en || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {tr?.mobile_no || mt?.mobile_no || "-"}
                          </td>
                        </tr>
                      );
                    }

                    if (participantType === "STAFF") {
                      const st = item?.staff || {};

                      return (
                        <tr
                          key={item?.id || st?.id || index}
                          style={{
                            background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                          }}
                        >
                          <td style={tableCellStyle}>{index + 1}</td>
                          <td style={tableCellStyle}>{st?.full_name || "-"}</td>
                          <td style={tableCellStyle}>
                            {st?.employee_id || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {st?.designation || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {st?.district_name_en ||
                              batchDetail?.district_name_en ||
                              "-"}
                          </td>
                          <td style={tableCellStyle}>
                            {st?.block_name_en || "-"}
                          </td>
                          <td style={tableCellStyle}>{st?.mobile || "-"}</td>
                        </tr>
                      );
                    }

                    const beneficiary = item?.beneficiary || {};

                    return (
                      <tr
                        key={item?.id || beneficiary?.id || index}
                        style={{
                          background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                        }}
                      >
                        <td style={tableCellStyle}>{index + 1}</td>
                        <td style={tableCellStyle}>
                          {beneficiary?.member_name || "-"}
                        </td>
                        <td style={tableCellStyle}>
                          {beneficiary?.lokos_member_code || "-"}
                        </td>
                        <td style={tableCellStyle}>
                          {beneficiary?.district_name_en || "-"}
                        </td>
                        <td style={tableCellStyle}>
                          {beneficiary?.block_name_en || "-"}
                        </td>
                        <td style={tableCellStyle}>
                          {beneficiary?.panchayat_name_en || "-"}
                        </td>
                        <td style={tableCellStyle}>
                          {beneficiary?.mobile || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={tableHeadings.length}
                      style={{
                        padding: "25px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No lateral entry participants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Confirmation notice */}
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "8px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1e40af",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            <strong>Confirmation:</strong> By clicking "Acknowledge & Continue",
            you confirm that you have verified the above participants and their
            offline training completion.
          </div>

          {error && !rejectMode && <div style={errorStyle}>{error}</div>}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            padding: "17px 26px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
            borderRadius: "0 0 14px 14px",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            style={secondaryButtonStyle}
          >
            Back To Batch List
          </button>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={openRejectForm}
              disabled={saving}
              style={dangerButtonStyle}
            >
              Reject Batch
            </button>

            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={saving || lateralParticipants.length === 0}
              style={{
                ...primaryButtonStyle,
                opacity: saving || lateralParticipants.length === 0 ? 0.6 : 1,
                cursor:
                  saving || lateralParticipants.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {saving ? "Processing..." : "Acknowledge & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the rejection form in a separate portal.
  // This ensures it always appears above the lateral-entry modal.
  const rejectionModal = rejectMode ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-batch-title"
      onClick={closeRejectForm}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100010,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(540px, 95vw)",
          background: "#ffffff",
          borderRadius: "13px",
          padding: "25px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          borderTop: "5px solid #dc2626",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <h3
            id="reject-batch-title"
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#991b1b",
              fontWeight: 800,
            }}
          >
            Reject Batch
          </h3>

          <button
            type="button"
            onClick={closeRejectForm}
            disabled={saving}
            aria-label="Close rejection form"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "27px",
              color: "#64748b",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "18px",
            color: "#991b1b",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          You are about to reject this batch. Please provide a clear reason for
          rejection. The reason will be shared with the batch creator.
        </div>

        <label
          htmlFor="batch-rejection-reason"
          style={{
            display: "block",
            marginBottom: "8px",
            color: "#334155",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          Rejection Reason <span style={{ color: "#dc2626" }}>*</span>
        </label>

        <textarea
          id="batch-rejection-reason"
          value={rejectReason}
          onChange={(e) => {
            setRejectReason(e.target.value);
            setError("");
          }}
          placeholder="Enter the reason for rejecting this batch..."
          rows={5}
          disabled={saving}
          autoFocus
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "14px",
            lineHeight: 1.5,
            outline: "none",
            color: "#0f172a",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "7px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <span>Rejection reason is mandatory.</span>
          <span>{rejectReason.length} characters</span>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "22px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={closeRejectForm}
            disabled={saving}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleRejectBatch}
            disabled={saving || !rejectReason.trim()}
            style={{
              ...dangerButtonStyle,
              opacity: saving || !rejectReason.trim() ? 0.6 : 1,
              cursor:
                saving || !rejectReason.trim() ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Rejecting..." : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {createPortal(mainModal, modalRoot)}
      {rejectMode && createPortal(rejectionModal, modalRoot)}
    </>
  );
}

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
  whiteSpace: "nowrap",
};

const secondaryButtonStyle = {
  padding: "10px 17px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#334155",
  fontWeight: 700,
  fontSize: "13px",
  cursor: "pointer",
};

const primaryButtonStyle = {
  padding: "11px 19px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "13px",
  cursor: "pointer",
};

const dangerButtonStyle = {
  padding: "11px 19px",
  borderRadius: "8px",
  border: "none",
  background: "#dc2626",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "13px",
  cursor: "pointer",
};

const errorStyle = {
  marginTop: "15px",
  padding: "11px 13px",
  background: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  borderRadius: "7px",
  fontSize: "13px",
};
