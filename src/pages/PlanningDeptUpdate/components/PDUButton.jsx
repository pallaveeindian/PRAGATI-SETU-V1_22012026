// src/pages/PlanningDeptUpdate/components/PDUButton.jsx
import React from "react";
import "./styles/PDUButton.css"; // Make sure to create this CSS file next to the JSX

/**
 * PDUButton - A highly reusable button component for the PDU Module.
 *
 * @param {string} variant - 'default' | 'login' | 'logout' | 'action' | 'outline'
 * @param {function} onClick - Click handler function
 * @param {string} type - 'button' | 'submit' | 'reset'
 * @param {boolean} disabled - Disables the button
 * @param {string} className - Extra classes for margin/padding overriding
 */
const PDUButton = ({
  variant = "default",
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  // 1. LOGIN VARIANT (Diagonal Swipe)
  if (variant === "login") {
    return (
      <button
        className={`pdu-btn-login ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  // 2. LOGOUT VARIANT (Expanding Icon)
  if (variant === "logout") {
    return (
      <button
        className={`pdu-btn-logout ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...props}
      >
        <div className="pdu-sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <div className="pdu-text">{children || "Logout"}</div>
      </button>
    );
  }

  // 3. ACTION VARIANT (Custom addition for "Push Data" or standard form submits)
  if (variant === "action") {
    return (
      <button
        className={`pdu-btn-action ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  // 4. OUTLINE VARIANT (Custom addition for "Cancel" or secondary actions)
  if (variant === "outline") {
    return (
      <button
        className={`pdu-btn-outline ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  // 5. DEFAULT VARIANT (3D Pushable CSS Button)
  return (
    <button
      className={`pdu-btn-default ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      <span className="pdu-shadow"></span>
      <span className="pdu-edge"></span>
      <span className="pdu-front text">{children}</span>
    </button>
  );
};

export default PDUButton;
