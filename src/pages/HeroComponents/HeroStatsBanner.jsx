// src\pages\HeroComponents\HeroStatsBanner.jsx
import React, { useState, useEffect } from "react";
import { FaUsers, FaMapMarkedAlt, FaCity, FaStore } from "react-icons/fa";

// Component to handle the running numbers animation
const AnimatedNumber = ({ end, decimals, suffix }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000; // 2 seconds animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function (easeOutExpo) for a natural fast-to-slow deceleration
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = end * easeOut;

      setVal(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setVal(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [end]);

  return (
    <>
      {val.toFixed(decimals)}
      {suffix}
    </>
  );
};

export default function HeroStatsBanner() {
  // Separated numeric values, decimals, and suffixes for the animation
  const stats = [
    {
      icon: <FaUsers color="#ea580c" />,
      end: 30.5,
      decimals: 1,
      suffix: " L+",
      label: "SHG Women",
    },
    {
      icon: <FaMapMarkedAlt color="#ea580c" />,
      end: 75,
      decimals: 0,
      suffix: "",
      label: "Districts",
    },
    {
      icon: <FaCity color="#ea580c" />,
      end: 826,
      decimals: 0,
      suffix: "",
      label: "Blocks",
    },
    {
      icon: <FaStore color="#ea580c" />,
      end: 1.2,
      decimals: 1,
      suffix: " L+",
      label: "Enterprises",
    },
  ];

  return (
    <div className="hero-stats-banner">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`stat-item ${idx !== stats.length - 1 ? "border-right" : ""}`}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-text">
            <h3 className="stat-val">
              <AnimatedNumber
                end={stat.end}
                decimals={stat.decimals}
                suffix={stat.suffix}
              />
            </h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        </div>
      ))}
      <style>{`
        /* =========================================
           PC / DESKTOP VIEW (LARGE BANNER - 5% SMALLER)
           ========================================= */
        .hero-stats-banner {
          display: flex;
          align-items: center;
          background: #ffffff;
          padding: 22px 34px;          /* Scaled down ~5% */
          border-radius: 14px;         
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12); 
          width: fit-content;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 14px;                   /* Scaled down ~5% */
          padding: 0 38px;             /* Scaled down ~5% */
        }
        
        .stat-item:first-child { padding-left: 0; }
        .stat-item:last-child { padding-right: 0; }
        .border-right { border-right: 2px solid #e2e8f0; }
        
        /* Scaled down ~5% */
        .stat-icon svg {
          width: 36px;
          height: 36px;
        }

        /* Scaled down ~5% */
        .stat-val { 
          margin: 0; 
          font-size: 30px;             
          font-weight: 900;            
          color: #0f172a; 
          line-height: 1; 
        }
        
        .stat-label { 
          margin: 5px 0 0 0; 
          font-size: 14px;             /* Scaled down ~5% */
          color: #64748b; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
        }

        /* =========================================
           MOBILE & TABLET VIEW (COMPACT BANNER)
           ========================================= */
        @media (max-width: 900px) {
          .hero-stats-banner { 
            flex-wrap: wrap; 
            justify-content: center; 
            gap: 16px; 
            padding: 16px; 
            border-radius: 12px;
          }
          .stat-item { 
            padding: 0 12px; 
            gap: 10px;
          }
          .border-right { border-right: none; }
          
          /* Scale down for mobile */
          .stat-icon svg {
            width: 24px;
            height: 24px;
          }
          .stat-val { 
            font-size: 20px; 
          }
          .stat-label { 
            font-size: 12px; 
          }
        }
      `}</style>
    </div>
  );
}
