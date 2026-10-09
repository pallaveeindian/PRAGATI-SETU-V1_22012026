// src/pages/HeroComponents/HeroStatsBanner.jsx
import React, { useContext, useEffect, useState } from "react";
import { FaUsers, FaMapMarkedAlt, FaCity, FaStore } from "react-icons/fa";
import { LanguageContext } from "../../pages/LanguageContext";

const AnimatedNumber = ({ end, decimals, suffix }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(end * easeOut);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setVal(end);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end]);

  return (
    <>
      {val.toFixed(decimals)}
      {suffix}
    </>
  );
};

export default function HeroStatsBanner() {
  const { lang } = useContext(LanguageContext);

  const content = {
    en: {
      shgWomen: "SHG Women",
      districts: "Districts",
      blocks: "Blocks",
      enterprises: "Enterprises",
    },
    hi: {
      shgWomen: "एसएचजी महिलाएं",
      districts: "जिले",
      blocks: "ब्लॉक",
      enterprises: "उद्यम",
    },
  };

  const t = content[lang] || content.en;

  const stats = [
    {
      icon: <FaUsers />,
      end: 30.5,
      decimals: 1,
      suffix: " L+",
      label: t.shgWomen,
    },
    {
      icon: <FaMapMarkedAlt />,
      end: 75,
      decimals: 0,
      suffix: "",
      label: t.districts,
    },
    { icon: <FaCity />, end: 826, decimals: 0, suffix: "", label: t.blocks },
    {
      icon: <FaStore />,
      end: 1.2,
      decimals: 1,
      suffix: " L+",
      label: t.enterprises,
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
        .hero-stats-banner{display:flex;align-items:center;width:fit-content;padding:22px 34px;background:#fff;border-radius:14px;box-shadow:0 10px 25px rgba(0,0,0,.12)}
        .stat-item{display:flex;align-items:center;gap:14px;padding:0 38px}
        .stat-item:first-child{padding-left:0}
        .stat-item:last-child{padding-right:0}
        .border-right{border-right:2px solid #e2e8f0}
        .stat-icon,.stat-icon svg{display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#ea580c;width:36px;height:36px}
        .stat-text{display:flex;flex-direction:column;justify-content:center}
        .stat-val{margin:0;color:#0f172a;font-size:calc(30px*var(--font-scale,1));font-weight:900;line-height:1}
        .stat-label{margin:5px 0 0;color:#64748b;font-size:calc(14px*var(--font-scale,1));font-weight:700;line-height:1.2;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}

        @media(max-width:1200px){
          .hero-stats-banner{padding:18px 26px}
          .stat-item{gap:11px;padding:0 25px}
          .stat-icon svg{width:30px;height:30px}
          .stat-val{font-size:calc(25px*var(--font-scale,1))}
          .stat-label{font-size:calc(11px*var(--font-scale,1))}
        }
        @media(max-width:1024px){
          .hero-stats-banner{padding:16px 20px}
          .stat-item{gap:9px;padding:0 18px}
          .stat-icon svg{width:27px;height:27px}
          .stat-val{font-size:calc(22px*var(--font-scale,1))}
          .stat-label{font-size:calc(10px*var(--font-scale,1))}
        }
        @media(max-width:900px){
          .hero-stats-banner{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:0;padding:16px;border-radius:12px}
          .stat-item{width:100%;padding:14px;gap:10px;justify-content:flex-start}
          .border-right{border-right:none}
          .stat-item:nth-child(1),.stat-item:nth-child(2){border-bottom:1px solid #e2e8f0}
          .stat-item:nth-child(1),.stat-item:nth-child(3){border-right:1px solid #e2e8f0}
          .stat-icon svg{width:25px;height:25px}
          .stat-val{font-size:calc(21px*var(--font-scale,1))}
          .stat-label{font-size:calc(10px*var(--font-scale,1))}
        }
        @media(max-width:600px){
          .hero-stats-banner{padding:10px;border-radius:10px}
          .stat-item{min-width:0;padding:11px 8px;gap:8px}
          .stat-icon svg{width:22px;height:22px}
          .stat-val{font-size:calc(18px*var(--font-scale,1))}
          .stat-label{font-size:calc(8.5px*var(--font-scale,1));letter-spacing:.2px;white-space:normal}
        }
        @media(max-width:400px){
          .hero-stats-banner{padding:8px}
          .stat-item{padding:9px 6px;gap:6px}
          .stat-icon svg{width:19px;height:19px}
          .stat-val{font-size:calc(16px*var(--font-scale,1))}
          .stat-label{font-size:calc(7.5px*var(--font-scale,1))}
        }
      `}</style>
    </div>
  );
}
