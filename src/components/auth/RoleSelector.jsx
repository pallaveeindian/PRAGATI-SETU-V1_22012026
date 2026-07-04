// src/components/auth/RoleSelector.jsx
import React from "react";

export const ADMIN_ROLES = [
  { id: "bmmu", label: "BMMU" },
  { id: "dmmu", label: "DMMU" },
  { id: "smmu", label: "SMMU" },
];

export const GENERAL_ROLES = [
  { id: "training_partner", label: "TRAINING PARTNER" },
  { id: "dtp", label: "DISTRICT TC" },
  { id: "tp_contact_person", label: "TRAINING CENTRE" },
];

export default function RoleSelector({
  userType = "Admin",
  value = "",
  onChange = () => {},
}) {
  const roles = userType === "Admin" ? ADMIN_ROLES : GENERAL_ROLES;
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select role</option>
      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.label}
        </option>
      ))}
    </select>
  );
}
