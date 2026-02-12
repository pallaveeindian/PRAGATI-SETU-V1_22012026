// src/utils/useCaptcha.js
import { useRef, useState } from "react";

export function useCaptcha(length = 6) {
  const canvasRef = useRef(null);
  const [value, setValue] = useState("");

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const text = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");

    setValue(text);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "26px monospace";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(text, 20, 35);
  };

  return { canvasRef, value, generate };
}
