"use client";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => setTheme(currentTheme()), []);

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the choice then lasts for this page only.
    }
    setTheme(next);
  }

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduce || !ref.current) {
      apply(next);
      return;
    }
    // The new theme spreads out in a circle from the button.
    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => apply(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button ref={ref} type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label} data-theme-state={theme ?? "light"}>
      <Sun className="theme-toggle__sun" size={17} weight="bold" aria-hidden="true" />
      <Moon className="theme-toggle__moon" size={17} weight="bold" aria-hidden="true" />
    </button>
  );
}

/** Runs before paint: applies a saved theme and flags that JavaScript is available. */
export const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t}catch(e){}d.classList.add("js");setTimeout(function(){if(!window.__revealReady)d.classList.remove("js")},4000)})()`;
