// src/components/ui/LeftCornerFireworks.jsx
import React, { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

export default function LeftCornerFireworks() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const fireworks = new Fireworks(containerRef.current, {
      autoresize: true,
      opacity: 0.7,
      acceleration: 1.05,
      friction: 0.96,
      gravity: 1.5,
      particles: 75,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 6,
      intensity: 35,
      flickering: 50,
      lineStyle: "round",
      hue: {
        min: 0,
        max: 360,
      },
      delay: {
        min: 20,
        max: 45,
      },
      // Launch from the left side of the container
      rocketsPoint: {
        min: 10,
        max: 35,
      },
      lineWidth: {
        explosion: {
          min: 1.5,
          max: 3.5,
        },
        trace: {
          min: 1,
          max: 2,
        },
      },
      brightness: {
        min: 55,
        max: 85,
      },
      decay: {
        min: 0.015,
        max: 0.03,
      },
      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    });

    fireworks.start();

    return () => {
      fireworks.stop(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "clamp(280px, 45vw, 550px)",
        height: "clamp(280px, 55vh, 550px)",
        pointerEvents: "none", // Allows clicks to pass through to the banner/overlay
        zIndex: 5,
      }}
    />
  );
}
