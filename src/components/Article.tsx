"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LinkSimple } from "@phosphor-icons/react";

/** A thin bar at the top of the window that fills as you read. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const article = document.querySelector<HTMLElement>(".article");
      if (!article || !bar.current) return;
      const start = article.offsetTop;
      const end = start + article.offsetHeight - window.innerHeight;
      const p = end > start ? (window.scrollY - start) / (end - start) : 1;
      bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div ref={bar} className="progress" aria-hidden="true" />;
}

/** Highlights the table-of-contents entry for the section being read. */
export function TocTracker({ ids }: { ids: string[] }) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const headings = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [ids]);

  useEffect(() => {
    document.querySelectorAll(".toc a").forEach((a) => {
      if (a.getAttribute("href") === `#${active}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }, [active]);
  return null;
}

export function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="chip-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href.split("#")[0]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard can be blocked; nothing else to do.
        }
      }}
    >
      {copied ? <Check size={15} weight="bold" aria-hidden="true" /> : <LinkSimple size={15} weight="bold" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
