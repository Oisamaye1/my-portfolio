"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "clear" | "rain" | "snow" | "sun";
const MODES: Mode[] = ["clear", "rain", "snow", "sun"];
const HOLD_MS = 9000;

/**
 * The sky behind the hero. It moves slowly through clear, rain, snow and sun, with a canvas
 * for falling particles. It pauses when off screen or in a background tab, and stays still
 * for people who prefer reduced motion.
 */
export function Atmosphere() {
  const [mode, setMode] = useState<Mode>("clear");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("clear");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = root.clientWidth;
      h = root.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    type P = { x: number; y: number; v: number; s: number; d: number };
    const count = Math.round(Math.min(160, (w * h) / 9000));
    const parts: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      v: 0.4 + Math.random(),
      s: 0.6 + Math.random() * 1.8,
      d: Math.random() * Math.PI * 2,
    }));

    // Particle colour follows the theme.
    const ink = () => (document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "255,255,255"
      : "70,80,95");

    let visible = true;
    let raf = 0;
    let fade = 0; // particles fade in/out as the weather changes
    let last = performance.now();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(root);

    function tick(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(48, now - last) / 16.7;
      last = now;
      const m = modeRef.current;
      const wantsParticles = m === "rain" || m === "snow";
      fade = Math.max(0, Math.min(1, fade + (wantsParticles ? 0.02 : -0.02) * dt));
      ctx!.clearRect(0, 0, w, h);
      if (fade > 0) {
        const c = ink();
        for (const p of parts) {
          if (m === "rain") {
            p.y += (7 + p.v * 6) * dt;
            p.x += 0.6 * dt;
            if (p.y > h) {
              p.y = -20;
              p.x = Math.random() * w;
            }
            ctx!.strokeStyle = `rgba(${c},${0.28 * fade})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p.x - 1.5, p.y - 12 - p.v * 8);
            ctx!.stroke();
          } else {
            p.d += 0.01 * dt;
            p.y += (0.4 + p.v * 0.6) * dt;
            p.x += Math.sin(p.d) * 0.4 * dt;
            if (p.y > h) {
              p.y = -5;
              p.x = Math.random() * w;
            }
            ctx!.fillStyle = `rgba(${c},${0.45 * fade})`;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (!document.hidden && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    let i = 0;
    const timer = window.setInterval(() => {
      if (document.hidden || !visible) return;
      i = (i + 1) % MODES.length;
      modeRef.current = MODES[i];
      setMode(MODES[i]);
    }, HOLD_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={rootRef} className="atmo" aria-hidden="true">
      {MODES.map((m) => (
        <div key={m} className={`atmo__sky atmo__sky--${m}`} data-on={mode === m} />
      ))}
      {mode === "clear" || mode === "sun" ? (
        <>
          <span className="atmo__cloud" style={{ top: "12%", animationDuration: "90s", animationDelay: "-20s" }} />
          <span className="atmo__cloud" style={{ top: "28%", width: "16rem", animationDuration: "120s", animationDelay: "-70s" }} />
          <span className="atmo__cloud" style={{ top: "6%", width: "12rem", animationDuration: "105s", animationDelay: "-45s" }} />
        </>
      ) : null}
      <canvas ref={canvasRef} />
    </div>
  );
}
