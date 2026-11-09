"use client";

import { useEffect, useState } from "react";

/**
 * A row of short lines on the left edge, one per section of the page. The line for the
 * section you're reading is longer; hovering shows its name; clicking jumps there.
 */
export function SectionRail({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections on this page">
      <ul className="rail">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined} style={{ ["--w" as string]: `${0.6 + ((i * 7) % 5) * 0.12}rem` }}>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
