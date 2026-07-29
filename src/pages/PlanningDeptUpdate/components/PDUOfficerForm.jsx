import React, { useState, useEffect } from "react";
import PDUButton from "./PDUButton";
import "./styles/PDUOfficerForm.css";

/**
 * PDUOfficerForm - A form component to collect officer details for the API Disclaimer.
 *
 * @param {Object} initialData - Optional initial state { name, designation, department, mobile }
 * @param {function} onSubmit - Callback function triggered with form data on successful submit
 * @param {boolean} isLoading - Disables the form while submitting/saving
 */
const PDUOfficerForm = ({
  initialData = { name: "", designation: "", department: "", mobile: "" },
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(initialData);

  // Update local state if initialData changes (e.g., loaded from Context)
  useEffect(() => {
    if (initialData.name || initialData.mobile) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="pdu-officer-form-container">
      <div className="pdu-officer-form-header">
        <h3 className="pdu-form-title">Officer Verification Details</h3>
        <p className="pdu-form-subtitle">
          These details are legally required to generate the verification
          disclaimer when pushing data to the UP Planning Department.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pdu-officer-form">
        <div className="pdu-form-grid">
          {/* Name Input */}
          <div className="pdu-form-group">
            <label htmlFor="name" className="pdu-form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="pdu-form-input"
              placeholder="e.g., Rahul Singh"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Designation Input */}
          <div className="pdu-form-group">
            <label htmlFor="designation" className="pdu-form-label">
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              className="pdu-form-input"
              placeholder="e.g., BDO / CDO"
              value={formData.designation}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Department Input */}
          <div className="pdu-form-group">
            <label htmlFor="department" className="pdu-form-label">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              className="pdu-form-input"
              placeholder="e.g., Rural Development"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Mobile Input */}
          <div className="pdu-form-group">
            <label htmlFor="mobile" className="pdu-form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="pdu-form-input"
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
              disabled={isLoading}
              maxLength="10"
            />
          </div>
        </div>

        <div className="pdu-form-footer">
          <PDUButton variant="action" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Officer Details"}
          </PDUButton>
        </div>
      </form>
    </div>
  );
};

export default PDUOfficerForm;
