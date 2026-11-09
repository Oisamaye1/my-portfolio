"use client";

import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, type SimulationLinkDatum, type SimulationNodeDatum } from "d3-force";
import { useEffect, useRef, useState } from "react";

type Node = SimulationNodeDatum & { id: string; label: string; kind: "group" | "item" };
type Link = SimulationLinkDatum<Node>;

/**
 * Skills as a web: each group is a hub and its skills hang off it. Drag any node and the
 * web follows. Under reduced motion it settles once and stays still.
 */
export function SkillGraph({ groups }: { groups: { name: string; items: string[] }[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 900, h: 520 });
  const [, setFrame] = useState(0);
  const sim = useRef<ReturnType<typeof forceSimulation<Node>> | null>(null);
  const data = useRef<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const ids = new Set<string>();
    groups.forEach((g) => {
      const gid = `g:${g.name}`;
      nodes.push({ id: gid, label: g.name, kind: "group" });
      g.items.forEach((it) => {
        const id = `i:${it}`;
        if (!ids.has(id)) {
          ids.add(id);
          nodes.push({ id, label: it, kind: "item" });
        }
        links.push({ source: gid, target: id });
      });
    });
    // Link the hubs in a loop so the web holds together.
    groups.forEach((g, i) => links.push({ source: `g:${g.name}`, target: `g:${groups[(i + 1) % groups.length].name}` }));
    data.current = { nodes, links };

    const small = size.w < 640;
    const s = forceSimulation<Node>(nodes)
      .force(
        "link",
        forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance((l) => {
            const hubToHub = (l.source as Node).kind === "group" && (l.target as Node).kind === "group";
            return hubToHub ? (small ? 140 : 230) : small ? 62 : 95;
          })
          .strength((l) => ((l.source as Node).kind === "group" && (l.target as Node).kind === "group" ? 0.25 : 0.7)),
      )
      .force("charge", forceManyBody<Node>().strength((d) => (d.kind === "group" ? (small ? -260 : -420) : small ? -60 : -110)))
      .force("center", forceCenter(size.w / 2, size.h / 2))
      // Items keep room for their labels, which sit to the right of the dot.
      .force("collide", forceCollide<Node>((d) => (d.kind === "group" ? 40 : Math.min(48, 10 + d.label.length * 2.4))).strength(0.9));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      s.stop();
      for (let i = 0; i < 300; i++) s.tick();
      setFrame((f) => f + 1);
    } else {
      s.on("tick", () => setFrame((f) => f + 1));
    }
    sim.current = s;
    return () => {
      s.stop();
    };
  }, [groups, size.w, size.h]);

  // Keep nodes inside the box.
  const clamp = (n: Node) => {
    n.x = Math.max(20, Math.min(size.w - 20, n.x ?? 0));
    n.y = Math.max(16, Math.min(size.h - 16, n.y ?? 0));
  };
  data.current.nodes.forEach(clamp);

  const dragStart = (n: Node, e: React.PointerEvent<SVGGElement>) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    sim.current?.alphaTarget(0.25).restart();
    n.fx = n.x;
    n.fy = n.y;
  };
  const dragMove = (n: Node, e: React.PointerEvent<SVGGElement>) => {
    if (n.fx == null) return;
    const svg = (e.currentTarget as SVGGElement).ownerSVGElement!;
    const r = svg.getBoundingClientRect();
    n.fx = e.clientX - r.left;
    n.fy = e.clientY - r.top;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      n.x = n.fx;
      n.y = n.fy;
      setFrame((f) => f + 1);
    }
  };
  const dragEnd = (n: Node) => {
    sim.current?.alphaTarget(0);
    n.fx = null;
    n.fy = null;
  };

  const { nodes, links } = data.current;
  return (
    <div className="graph" ref={wrap}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} role="img" aria-label={`Skills web: ${groups.map((g) => `${g.name} (${g.items.join(", ")})`).join("; ")}`}>
        <g aria-hidden="true">
          {links.map((l, i) => {
            const s = l.source as Node;
            const t = l.target as Node;
            return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} />;
          })}
        </g>
        <g aria-hidden="true">
          {nodes.map((n) => (
            <g
              key={n.id}
              data-kind={n.kind}
              transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
              onPointerDown={(e) => dragStart(n, e)}
              onPointerMove={(e) => dragMove(n, e)}
              onPointerUp={() => dragEnd(n)}
              onPointerCancel={() => dragEnd(n)}
            >
              <circle r={n.kind === "group" ? 5 : 2.5} />
              <text x={n.kind === "group" ? 9 : 6} y={4}>
                {n.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <span className="graph__hint" aria-hidden="true">
        Drag the web
      </span>
    </div>
  );
}
