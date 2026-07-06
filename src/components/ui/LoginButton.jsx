import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LoginButton({ closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    if (closeMenu) closeMenu();
  };

  const portals = [
    {
      path: "/login?module=tms",
      label: "TMS Portal",
      color: "#2a56cf",
      delay: "0s",
    },
    {
      path: "/login?module=ldms",
      label: "LDMS Portal",
      color: "#b91c1c",
      delay: "0.18s",
    },
    {
      path: "/login?module=crp",
      label: "CRP-EP Mapping",
      color: "#f59e0b",
      delay: "0.36s",
    },
    {
      path: "/login?module=mou",
      label: "MOU Portal",
      color: "#9333ea",
      delay: "0.54s",
    },
  ];

  return (
    <li className="menu-item login-wrapper" ref={dropdownRef}>
      <button
        className="cta-login"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>LOGIN</span>
        <span className="arrow-wrap">
          <svg width="52px" height="34px" viewBox="0 0 66 43">
            <g fill="none">
              <path
                className="one"
                d="M40.15 3.89L43.97.14 65.69 20.78c.39.39.39 1.02 0 1.41L43.97 42.86 40.15 39.11 56.99 21.86z"
                fill="#fff"
              />
              <path
                className="two"
                d="M20.15 3.89L23.97.14 45.69 20.78c.39.39.39 1.02 0 1.41L23.97 42.86 20.15 39.11 36.99 21.86z"
                fill="#fff"
              />
              <path
                className="three"
                d="M.15 3.89L3.97.14 25.69 20.78c.39.39.39 1.02 0 1.41L3.97 42.86.15 39.11 16.99 21.86z"
                fill="#fff"
              />
            </g>
          </svg>
        </span>
      </button>

      {/* Renamed from .dropdown-menu to avoid crashing the TopNav */}
      <ul className={`login-dropdown-list ${isOpen ? "show" : ""}`}>
        {portals.map((portal) => (
          <li
            key={portal.path}
            className={`login-dropdown-item ${isOpen ? "animate-in" : ""}`}
            style={{
              "--animation-delay": portal.delay,
              "--hover-color": portal.color,
            }}
          >
            <Link
              to={portal.path}
              className="cta-login sub-cta"
              onClick={handleLinkClick}
            >
              <span>{portal.label}</span>
              <span className="arrow-wrap">
                <svg width="38px" height="25px" viewBox="0 0 66 43">
                  <g fill="none">
                    <path
                      className="one"
                      d="M40.15 3.89L43.97.14 65.69 20.78c.39.39.39 1.02 0 1.41L43.97 42.86 40.15 39.11 56.99 21.86z"
                      fill="#fff"
                    />
                    <path
                      className="two"
                      d="M20.15 3.89L23.97.14 45.69 20.78c.39.39.39 1.02 0 1.41L23.97 42.86 20.15 39.11 36.99 21.86z"
                      fill="#fff"
                    />
                    <path
                      className="three"
                      d="M.15 3.89L3.97.14 25.69 20.78c.39.39.39 1.02 0 1.41L3.97 42.86.15 39.11 16.99 21.86z"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        /* ========================================================= */
        /* EXACT CSS FROM YOUR WORKING VERSION (Restored)            */
        /* ========================================================= */
        
        .cta-login {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 22px;
          background: #0f172a;
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
          transform: skewX(-15deg);
          box-shadow: 5px 5px 0 #000;
          transition: all 0.4s ease;
          /* Resets for <button> element */
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .cta-login span {
          transform: skewX(15deg);
          display: inline-flex;
          align-items: center;
        }

        .cta-login:hover {
          box-shadow: 8px 8px 0 #fd7301;
        }

        .arrow-wrap {
          transition: margin-right 0.4s ease;
        }

        .cta-login:hover .arrow-wrap {
          margin-right: 18px;
        }

        /* SVG ARROWS */
        .cta-login path.one {
          transform: translateX(-60%);
          transition: 0.4s;
        }

        .cta-login path.two {
          transform: translateX(-30%);
          transition: 0.5s;
        }

        .cta-login:hover path.one,
        .cta-login:hover path.two {
          transform: translateX(0);
        }

        .cta-login:hover path.one {
          animation: arrowPulse 1s infinite 0.4s;
        }

        .cta-login:hover path.two {
          animation: arrowPulse 1s infinite 0.2s;
        }

        .cta-login:hover path.three {
          animation: arrowPulse 1s infinite;
        }

        /* COLOR PULSE */
        @keyframes arrowPulse {
          0% { fill: #ffffff; }
          50% { fill: #fd7301; }
          100% { fill: #ffffff; }
        }

        @media (max-width: 992px) {
          .cta-login {
            width: fit-content;
            padding: 10px 15px;
          }
        }

        /* ========================================================= */
        /* SAFELY SCOPED DROPDOWN CSS (No Header Clashes!)           */
        /* ========================================================= */
        
        .login-wrapper {
          position: relative;
          list-style: none;
        }

        /* Replaced .dropdown-menu with .login-dropdown-list to fix header crash */
        .login-dropdown-list {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          min-width: 200px;
          padding: 0;
          margin: 0;
          pointer-events: none;
          z-index: 100;
        }

        .login-dropdown-list.show {
          pointer-events: auto;
        }

        .login-dropdown-item {
          opacity: 0;
          transform: translateY(-10px);
          visibility: hidden;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          padding: 0;
        }

        .login-dropdown-item.animate-in {
          visibility: visible;
          animation: slideFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--animation-delay);
        }

        /* Sub-button specific adjustments */
        .sub-cta {
          padding: 8px 16px;
          font-size: 13px;
          box-shadow: 4px 4px 0 #000;
          width: 100%;
          min-width: 160px;
          justify-content: space-between;
        }

        .sub-cta:hover, .sub-cta:focus {
          box-shadow: 6px 6px 0 var(--hover-color, #fd7301);
          transform: skewX(-15deg) translateX(-4px);
        }

        @keyframes slideFadeIn {
          0%   { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .login-dropdown-list {
            right: auto;
            left: 0;
            align-items: flex-start;
            position: relative;
            top: 0;
            margin-top: 15px;
          }
          
          .login-dropdown-item {
            justify-content: flex-start;
          }
        }
      `}</style>
    </li>
  );
}
