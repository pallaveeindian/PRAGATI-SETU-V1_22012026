import React from "react";
import "./styles/PDUCard.css";

/**
 * PDUCard - A highly reusable container card for the PDU Module.
 *
 * @param {string} title - Optional header title
 * @param {ReactNode} footer - Optional footer content (buttons, extra info)
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Optional click handler (makes card interactive)
 */
const PDUCard = ({ title, children, footer, className = "", onClick }) => {
  const isInteractive = !!onClick;

  return (
    <div
      className={`pdu-card ${isInteractive ? "pdu-card-interactive" : ""} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="pdu-card-header">
          <h3 className="pdu-card-title">{title}</h3>
        </div>
      )}

      <div className="pdu-card-body">{children}</div>

      {footer && <div className="pdu-card-footer">{footer}</div>}
    </div>
  );
};

export default PDUCard;
