import React from "react";

export default function GovHeader({ logo, title, onFontChange }) {
  return (
    <header className="gov-header">
      <div className="gov-header-inner">
        {/* LEFT */}
        <div className="gov-header-left">
          <img src={logo} alt="Government Logo" className="gov-logo" />
          <span className="gov-text">{title}</span>
        </div>

        {/* RIGHT */}
        <div className="gov-header-right">
          <button onClick={() => onFontChange(0.9)}>A-</button>
          <button onClick={() => onFontChange(1)}>A</button>
          <button onClick={() => onFontChange(1.1)}>A+</button>

          <span className="divider">|</span>

          <button className="lang-btn">English</button>
          <span className="divider">|</span>
          <button className="lang-btn">हिंदी</button>
        </div>
      </div>

      <style>{`
      
        .gov-header {
          background: #0f172a;
          color: #fff;
          width: 100%;
        }

        .gov-header-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 20px;
        }

        .gov-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        .gov-logo {
          height: 36px;
          width: 36px;
          object-fit: cover;
          border-radius: 50%;
        }

        .gov-text {
          font-size: 15px;
          white-space: nowrap;
        }

        .gov-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gov-header-right button {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 6px;
        }

        .gov-header-right button:hover {
          text-decoration: underline;
        }

        .divider {
          opacity: 0.6;
        }

        .lang-btn {
          font-weight: 500;
        }

        /* ================= MOBILE ================= */
        @media (max-width: 768px) {

  .gov-header-inner {
    flex-direction: column;
    align-items: center;        /* center everything */
    text-align: center;
    
  }

  /* TOP SECTION */
  .gov-header-left {
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }

  .gov-text {
    white-space: normal;   /* IMPORTANT */
  }

  /* BOTTOM SECTION */
  .gov-header-right {
    width: 100%;               /* VERY IMPORTANT */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;           /* allow wrapping */
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.2);
  }

  .divider {
    display: none;  /* remove | on mobile */
  }

}

        /* ================= SMALL MOBILE ================= */
        @media (max-width: 480px) {
          .gov-logo {
            height: 32px;
            width: 32px;
          }

          .gov-text {
            font-size: 13px;
          }

          .gov-header-right {
            gap: 4px;
          }

          .gov-header-right button {
            font-size: 12px;
          }
        }
      `}</style>
    </header>
  );
}