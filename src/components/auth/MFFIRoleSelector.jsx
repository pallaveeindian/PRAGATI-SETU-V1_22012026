import React from "react";

// Sirf 4 required roles define kiye gaye hain
export const ADMIN_ROLES = [
  { id: 1, label: "BMM_FI" },
  { id: 2, label: "DMM_FI" },
  { id: 3, label: "SMM_FI" },
  { id: 15, label: "BANK LOGIN" },
];

export default function MFFIRoleSelector({
  value = "",
  onChange = () => {},
}) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      // Agar aapko styles lagane hain toh yahan style ya className add kar sakte hain
    >
      <option value="">Select role</option>
      {ADMIN_ROLES.map((r) => (
        <option key={r.id} value={r.id}>
          {r.label}
        </option>
      ))}
    </select>
  );
}