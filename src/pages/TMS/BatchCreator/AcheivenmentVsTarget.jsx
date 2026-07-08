// src/pages/TMS/BatchCreator/AcheivenmentVsTarget.jsx
import React, { useEffect, useState } from "react";

const AcheivenmentVsTarget = ({ achievement = 0, target = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    if (achievement === 0) {
      setCount(0);
      return;
    }

    const duration = 1000;
    const increment = achievement / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= achievement) {
        setCount(achievement);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [achievement]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
          textAlign: "center",
        }}
      >
        Achievement vs Target
      </h4>

      <div
        style={{
          width: "200px",
          height: "95px",
          background: "linear-gradient(135deg, #2F6FEA 0%, #4B87F8 100%)",
          borderRadius: "16px",
          padding: "16px 18px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 8px 20px rgba(47,111,234,0.22)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Achievement
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: "44px",
              fontWeight: "800",
              lineHeight: 1,
            }}
          >
            {count}
          </span>

          <span
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "3px",
            }}
          >
            /{target}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AcheivenmentVsTarget;
