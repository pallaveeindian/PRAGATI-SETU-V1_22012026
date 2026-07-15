// src/pages/TMS/MTManagementV2/hooks/useMTForm.js
import { useState, useCallback } from "react";
import { TMS_API } from "../../../../api/axios";

/**
 * Custom Hook for handling Master Trainer Creation and Updating
 * Validates payload (Aadhaar, Mobile, etc.) and manages API submission states.
 * * @param {object} options
 * @param {function} options.onSuccess - Callback triggered upon successful mutation
 */
export function useMTForm({ onSuccess } = {}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null); // Stores credentials like generated username/password

  /**
   * Internal Validation Engine
   * Strictly enforces data integrity before hitting the Django backend.
   */
  const validatePayload = (payload, isUpdate) => {
    const errors = [];

    // 1. Core Identity (Only validate if it's a new creation OR if the field was edited)
    if (!isUpdate || payload.full_name !== undefined) {
      if (!payload.full_name || payload.full_name.trim().length < 3) {
        errors.push("Full Name is required and must be at least 3 characters.");
      }
    }

    if (
      !isUpdate &&
      (!payload.username || payload.username.trim().length < 4)
    ) {
      errors.push(
        "Username is required for new Master Trainers (min 4 chars).",
      );
    }

    // 2. Sensitive Numbers
    if (!isUpdate || payload.mobile_no !== undefined) {
      if (!payload.mobile_no || !/^\d{10}$/.test(payload.mobile_no)) {
        errors.push("Mobile Number must be exactly 10 digits.");
      }
    }

    if (payload.aadhaar_no && payload.aadhaar_no.trim() !== "") {
      if (!/^\d{12}$/.test(payload.aadhaar_no)) {
        errors.push("Aadhaar Number must be exactly 12 digits if provided.");
      }
    }

    // 3. Operational Requirements
    if (!isUpdate || payload.empanel_district !== undefined) {
      if (!payload.empanel_district) {
        errors.push("Empanel District is required.");
      }
    }

    if (!isUpdate || payload.designation !== undefined) {
      if (!payload.designation) {
        errors.push("Designation (BRP/DRP/SRP) is required.");
      }
    }

    // 4. Bank Information
    const hasBankInfo =
      payload.bank_account_number || payload.ifsc || payload.bank_name;
    if (hasBankInfo) {
      if (!payload.bank_account_number)
        errors.push("Bank Account Number is missing.");
      if (!payload.ifsc) errors.push("Bank IFSC code is missing.");
    }

    return errors;
  };
  /**
   * Universal Submit Handler (Creates or Updates)
   * Converts payload to FormData if files exist, otherwise sends JSON.
   * * @param {string|number|null} trainerId - ID of the Master Trainer (null for creation)
   * @param {object} formDataObj - The raw form data dictionary
   */
  const submitForm = useCallback(
    async (trainerId, formDataObj) => {
      setSubmitting(true);
      setError(null);
      setSuccessData(null);

      const isUpdate = Boolean(trainerId);

      // 1. Run Validations
      const validationErrors = validatePayload(formDataObj, isUpdate);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(" "));
        setSubmitting(false);
        return { success: false, error: validationErrors.join(" ") };
      }

      try {
        // 2. Format Payload for Axios
        // If profile_picture is a File object, we MUST use FormData to support multipart/form-data
        let finalPayload;
        const hasFile = formDataObj.profile_picture instanceof File;

        if (hasFile) {
          finalPayload = new FormData();
          Object.keys(formDataObj).forEach((key) => {
            const value = formDataObj[key];
            if (value !== null && value !== undefined && value !== "") {
              finalPayload.append(key, value);
            }
          });
        } else {
          // Standard JSON payload
          finalPayload = { ...formDataObj };
          // Remove empty profile_picture string so backend doesn't crash on ImageField
          if (!finalPayload.profile_picture) {
            delete finalPayload.profile_picture;
          }
        }

        // 3. Execute Mutation API
        let response;
        if (isUpdate) {
          response = await TMS_API.mtV2.update(trainerId, finalPayload);
        } else {
          response = await TMS_API.mtV2.create(finalPayload);
        }

        // 4. Handle Success
        const responseData = response.data || {};

        // Capture generated credentials or reset passwords if returned by API
        if (responseData.password || responseData.new_password) {
          setSuccessData({
            username: responseData.username || formDataObj.username,
            password: responseData.password || responseData.new_password,
            message: responseData.message,
          });
        }

        if (typeof onSuccess === "function") {
          onSuccess(responseData);
        }

        return { success: true, data: responseData };
      } catch (err) {
        console.error("Master Trainer Submission Error:", err);

        // Extract DRF generic error messages
        let errorMsg = "Failed to process Master Trainer request.";
        if (err?.response?.data) {
          const respData = err.response.data;
          if (respData.error) {
            errorMsg = respData.error;
          } else if (respData.message) {
            errorMsg = respData.message;
          } else if (typeof respData === "object") {
            // Flatten Django dict errors (e.g. {"mobile_no": ["Already exists"]})
            const errArray = Object.values(respData).flat();
            if (errArray.length > 0 && typeof errArray[0] === "string") {
              errorMsg = errArray.join(" ");
            }
          }
        }

        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setSubmitting(false);
      }
    },
    [onSuccess],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    submitForm,
    submitting,
    error,
    clearError,
    successData,
  };
}
