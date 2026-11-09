"use client";

import { useEffect, useRef } from "react";

/**
 * A field of dots shaped into slow rolling waves, like a halftone print. It only animates
 * while on screen and holds still under reduced motion.
 */
export function DotWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    function draw(t: number) {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#111";
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = color;
      const gap = w < 640 ? 7 : 8;
      const time = t / 2600;
      for (let x = 0; x < w; x += gap) {
        // Two overlapping waves give the crest its shape.
        const u = x / w;
        const crest =
          h * 0.55 +
          Math.sin(u * 5.5 + time) * h * 0.18 +
          Math.sin(u * 13 - time * 1.4) * h * 0.06;
        for (let y = 0; y < h; y += gap) {
          const d = y - crest;
          if (d < -h * 0.12) continue;
          const density = Math.max(0, 1 - Math.abs(d) / (h * 0.5));
          const r = 0.4 + density * 1.25;
          ctx!.globalAlpha = 0.15 + density * 0.55;
          ctx!.fillRect(x, y, r, r);
        }
      }
      ctx!.globalAlpha = 1;
    }

    const loop = (t: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="dotwave" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
