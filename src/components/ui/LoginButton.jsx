// src/components/ui/LoginButton.jsx
import React from "react";

export default function LoginButton({ closeMenu, onOpenLogin }) {
  const handleClick = () => {
    if (closeMenu) closeMenu();
    if (onOpenLogin) onOpenLogin();
  };

  return (
    <li className="menu-item login-wrapper">
      <button className="cta-login" onClick={handleClick}>
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

      <style>{`
        /* ========================================================= */
        /* EXACT CSS FROM YOUR WORKING VERSION                       */
        /* ========================================================= */
        
        .login-wrapper {
          position: relative;
          list-style: none;
        }

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
      `}</style>
    </li>
  );
}
