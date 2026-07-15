// src/pages/TMS/MTManagementV2/hooks/useMTCertificates.js
import { useState, useCallback, useContext } from "react";
import { TMS_API } from "../../../../api/axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { getCanonicalRole } from "../../../../utils/roleUtils";

/**
 * Custom Hook for managing Master Trainer Certificates.
 * Handles Bulk Uploads, Deletions, and SMMU-specific auto-approvals (flipping tot_* fields).
 * * @param {object} options
 * @param {function} options.onSuccess - Callback triggered upon successful mutation
 */
export function useMTCertificates({ onSuccess } = {}) {
  const { user } = useContext(AuthContext) || {};
  const role = getCanonicalRole(user || {});

  // Identify if user is SMMU (adjust exact role constants as per your core/utils)
  const isSMMU =
    role === "smmu" || role === "1" || String(user?.role_id) === "12";

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Helper to format generic errors
   */
  const extractError = (err, fallback) => {
    if (err?.response?.data) {
      const data = err.response.data;
      if (data.error) return data.error;
      if (data.message) return data.message;
      if (typeof data === "object") {
        const errArray = Object.values(data).flat();
        if (errArray.length > 0 && typeof errArray[0] === "string") {
          return errArray.join(" ");
        }
      }
    }
    return fallback;
  };

  /**
   * Bulk Upload Certificates
   * @param {string|number} trainerId - The ID of the Master Trainer
   * @param {Array} certificatesData - Array of cert objects: { file, training_plan_id, theme_id, certificate_no, issued_on, target_tot_field }
   * @param {boolean} autoApprove - If true AND user is SMMU, will automatically flip the associated `tot_*` field to true
   */
  const uploadCertificates = useCallback(
    async (trainerId, certificatesData, autoApprove = true) => {
      if (!trainerId || !certificatesData || certificatesData.length === 0) {
        setError("Invalid upload parameters.");
        return { success: false, error: "Invalid upload parameters." };
      }

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        const totFieldsToFlip = {};

        // Append lists to FormData exactly as Django API expects
        certificatesData.forEach((cert) => {
          formData.append("files", cert.file);
          formData.append("training_plans", cert.training_plan_id || "");
          formData.append("themes", cert.theme_id || "");
          formData.append("certificate_nos", cert.certificate_no || "");
          formData.append("issued_ons", cert.issued_on || "");

          // Track which TOT boolean fields need to be flipped if this is an SMMU direct upload
          if (cert.target_tot_field) {
            totFieldsToFlip[cert.target_tot_field] = true;
          }
        });

        // 1. Upload the files
        const uploadResponse = await TMS_API.mtV2.uploadCertificates(
          trainerId,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        // 2. SMMU Auto-Approval Chain
        // If SMMU uploads, it acts as an immediate approval, so we update the trainer's boolean fields.
        if (isSMMU && autoApprove && Object.keys(totFieldsToFlip).length > 0) {
          try {
            await TMS_API.mtV2.update(trainerId, totFieldsToFlip);
          } catch (updateErr) {
            console.warn(
              "Certificates uploaded, but failed to auto-update TOT flags.",
              updateErr,
            );
            // We don't fail the whole operation since files uploaded successfully,
            // but we might want to alert the user.
          }
        }

        if (typeof onSuccess === "function") {
          onSuccess(uploadResponse.data);
        }

        return { success: true, data: uploadResponse.data };
      } catch (err) {
        const errorMsg = extractError(err, "Failed to upload certificates.");
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setUploading(false);
      }
    },
    [isSMMU, onSuccess],
  );

  /**
   * Delete a specific Certificate
   * Used for general deletion OR when SMMU rejects a DMMU upload.
   * @param {string|number} trainerId
   * @param {string|number} certId
   */
  const deleteCertificate = useCallback(
    async (trainerId, certId) => {
      setDeleting(true);
      setError(null);

      try {
        const response = await TMS_API.mtV2.deleteCertificate(
          trainerId,
          certId,
        );

        if (typeof onSuccess === "function") {
          onSuccess(response.data);
        }

        return { success: true, data: response.data };
      } catch (err) {
        const errorMsg = extractError(err, "Failed to delete certificate.");
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setDeleting(false);
      }
    },
    [onSuccess],
  );

  /**
   * Explicitly Approve a Certificate / Training (SMMU Only)
   * Used in the "Pending Approvals" screen when SMMU clicks "Approve".
   * Simply flips the targeted `tot_*` boolean fields to true.
   * @param {string|number} trainerId
   * @param {object} fieldsToFlip - e.g. { tot_smcb: true, tot_mffi: true }
   */
  const approveTrainerTOT = useCallback(
    async (trainerId, fieldsToFlip) => {
      if (!isSMMU) {
        setError("Unauthorized: Only SMMU can approve TOT certifications.");
        return { success: false, error: "Unauthorized." };
      }

      if (
        !trainerId ||
        !fieldsToFlip ||
        Object.keys(fieldsToFlip).length === 0
      ) {
        setError("Invalid approval parameters.");
        return { success: false, error: "Invalid approval parameters." };
      }

      setApproving(true);
      setError(null);

      try {
        const response = await TMS_API.mtV2.update(trainerId, fieldsToFlip);

        if (typeof onSuccess === "function") {
          onSuccess(response.data);
        }

        return { success: true, data: response.data };
      } catch (err) {
        const errorMsg = extractError(err, "Failed to approve certificate.");
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setApproving(false);
      }
    },
    [isSMMU, onSuccess],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    uploadCertificates,
    deleteCertificate,
    approveTrainerTOT,
    uploading,
    deleting,
    approving,
    error,
    clearError,
    isSMMU, // Exposed so the UI components can conditionally render Approve/Reject buttons
  };
}
