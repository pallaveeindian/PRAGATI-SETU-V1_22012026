import React from "react";
import { Link } from "react-router-dom";
import nav_logo from "../../assets/top_nav_banner.png";

export default function TopNavigation() {
  return (
    <nav className="home-topnav">
      <div className="topnav-inner">
        <Link to="/">
          <img src={nav_logo} alt="Pragati Setu" className="nav-logo" />
        </Link>
      </div>

      <style>{`
        .home-topnav {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .topnav-inner {
          display: flex;
          justify-content: center; 
          align-items: center;
          padding: 10px 0;
        }

        .nav-logo {
          height: 70px;
          width: auto;
          object-fit: contain;
        }

        @media (max-width: 768px) {
          .nav-logo {
            height: 50px;
          }
        }
      `}</style>
    </nav>
  );
}
