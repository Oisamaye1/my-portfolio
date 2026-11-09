"use client";

import { useEffect, useState } from "react";

/** Cycles through roles, each blurring into focus. Screen readers get the full list once. */
export function Roles({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (roles.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % roles.length);
    }, 2800);
    return () => window.clearInterval(t);
  }, [roles.length]);

  return (
    <span className="roles" aria-hidden="true">
      {roles.map((r, n) => (
        <span key={r} data-on={n === i}>
          {r}
        </span>
      ))}
    </span>
  );
}
