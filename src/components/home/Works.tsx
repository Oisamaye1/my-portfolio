"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Cards,
  Code,
  Eye,
  GithubLogo,
  GridFour,
  Hash,
  PaintBrush,
  ShieldCheck,
  Sparkle,
  SquareHalf,
} from "@phosphor-icons/react";
import { DotsMark } from "../DotsMark";
import { MediaTile } from "../MediaTile";

export type WorkItem = {
  slug: string;
  title: string;
  summary: string;
  excerpt: string;
  cover_url: string;
  tags: string[];
  year: number | null;
  live_url: string;
  repo_url: string;
  hasBody: boolean;
};

type View = "showcase" | "grid" | "deck";

const VIEWS: { key: View; label: string; Icon: typeof GridFour }[] = [
  { key: "showcase", label: "Showcase", Icon: SquareHalf },
  { key: "grid", label: "Grid", Icon: GridFour },
  { key: "deck", label: "Deck", Icon: Cards },
];

function tagIcon(tag: string) {
  const t = tag.toLowerCase();
  if (/(intrusion|security|ids)/.test(t)) return ShieldCheck;
  if (/(learning|tensorflow|pytorch|python|cnn|ml)/.test(t)) return Brain;
  if (/(opencv|vision)/.test(t)) return Eye;
  if (/(css|tailwind|html|design)/.test(t)) return PaintBrush;
  if (/(react|next|typescript|javascript|web3)/.test(t)) return Code;
  return Hash;
}

const hashtag = (t: string) => `#${t.replace(/[^A-Za-z0-9]+/g, "")}`;

export function Works({ items, initialView = "showcase", showcaseLimit }: { items: WorkItem[]; initialView?: View; showcaseLimit?: number }) {
  const [view, setView] = useState<View>(initialView);
  const [tag, setTag] = useState<string | null>(null);

  // Remember the viewer's preferred layout on this device.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("works-view") as View | null;
      if (saved && VIEWS.some((v) => v.key === saved)) setView(saved);
    } catch {
      // Storage can be blocked; keep the default.
    }
  }, []);
  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem("works-view", v);
    } catch {
      // Ignore.
    }
  };

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 7);
  }, [items]);

  const filtered = tag ? items.filter((p) => p.tags.includes(tag)) : items;
  const shown = view === "showcase" && showcaseLimit && !tag ? filtered.slice(0, showcaseLimit) : filtered;

  return (
    <div className="works">
      <div className="works__bar">
        <div className="works__filters" role="group" aria-label="Filter projects">
          <button type="button" className="chip" aria-pressed={tag === null} onClick={() => setTag(null)}>
            <Sparkle size={14} aria-hidden="true" /> All <span className="count">{items.length}</span>
          </button>
          {tags.map(([t, n]) => {
            const Icon = tagIcon(t);
            return (
              <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                <Icon size={14} aria-hidden="true" /> {t} <span className="count">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="segmented" role="group" aria-label="Layout">
          {VIEWS.map(({ key, label, Icon }) => (
            <button key={key} type="button" aria-pressed={view === key} onClick={() => choose(key)}>
              <Icon size={14} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      </div>

      <p className="works__summary" aria-live="polite">
        <span className="works__faces" aria-hidden="true">
          {filtered.slice(0, 4).map((p) =>
            p.cover_url ? (
              <span key={p.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_url} alt="" loading="lazy" />
              </span>
            ) : (
              <span key={p.slug} />
            ),
          )}
        </span>
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {tag ? ` tagged ${tag}` : ""}
        {shown.length < filtered.length ? `, showing ${shown.length}` : ""}
      </p>

      <div className="works__stage" key={`${view}-${tag ?? "all"}`}>
        {view === "showcase" ? <Showcase items={shown} /> : null}
        {view === "grid" ? <Grid items={filtered} /> : null}
        {view === "deck" ? <Deck items={filtered} /> : null}
      </div>

      {view === "showcase" && shown.length < filtered.length ? (
        <p style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link className="pill" href="/projects">
            See all {filtered.length} projects <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function Links({ p }: { p: WorkItem }) {
  return (
    <>
      {p.live_url ? (
        <a className="pill pill--sm" href={p.live_url} target="_blank" rel="noopener noreferrer">
          Visit site <ArrowUpRight size={14} className="nudge" aria-hidden="true" />
        </a>
      ) : null}
      {p.repo_url ? (
        <a className="pill pill--sm" href={p.repo_url} target="_blank" rel="noopener noreferrer">
          <GithubLogo size={15} aria-hidden="true" /> Code
        </a>
      ) : null}
    </>
  );
}

function Showcase({ items }: { items: WorkItem[] }) {
  return (
    <div>
      {items.map((p) => (
        <article key={p.slug} className="show">
          <h3 className="show__title">
            <Link href={`/projects/${p.slug}`}>
              <strong>{p.title}.</strong> {p.summary}
            </Link>
          </h3>
          <ul className="hashtags">
            {p.tags.slice(0, 4).map((t) => (
              <li key={t}>{hashtag(t)}</li>
            ))}
          </ul>
          <div className="show__card">
            <Link href={`/projects/${p.slug}`} className="show__media" tabIndex={-1} aria-hidden="true">
              <MediaTile src={p.cover_url || undefined} alt="" title={p.title} kicker={p.tags[0]} strip={p.slug === "compactids"} sizes="(max-width: 48rem) 100vw, 40rem" className="fill" />
            </Link>
            <div className="show__info">
              <p className="show__excerpt">{p.excerpt || p.summary}</p>
              <dl className="show__meta">
                {p.year ? (
                  <div>
                    <dt className="sr-only">Year</dt>
                    <dd style={{ margin: 0 }}>
                      Year: <b>{p.year}</b>
                    </dd>
                  </div>
                ) : null}
                {p.tags.length ? (
                  <div>
                    <dt className="sr-only">Built with</dt>
                    <dd style={{ margin: 0 }}>
                      Built with: <b>{p.tags.slice(0, 4).join(", ")}</b>
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="show__actions">
                <Link className="pill pill--dark" href={`/projects/${p.slug}`}>
                  <DotsMark /> Learn more
                </Link>
                <Links p={p} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Grid({ items }: { items: WorkItem[] }) {
  return (
    <ul className="cards">
      {items.map((p, i) => (
        <li key={p.slug} className="card">
          <span className="card__num" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <MediaTile src={p.cover_url || undefined} alt="" title={p.title} kicker={p.tags[0]} strip={p.slug === "compactids"} />
          <div className="card__body">
            <div className="card__top">
              <h3 className="card__title">
                <Link href={`/projects/${p.slug}`}>{p.title}</Link>
              </h3>
              {p.year ? <span className="card__year">{p.year}</span> : null}
            </div>
            <p className="card__text">{p.summary}</p>
            <div className="card__foot">
              <ul className="hashtags">
                {p.tags.slice(0, 3).map((t) => (
                  <li key={t}>{hashtag(t)}</li>
                ))}
              </ul>
              <Link className="pill pill--dark pill--sm" href={`/projects/${p.slug}`} tabIndex={-1} aria-hidden="true">
                View project <ArrowUpRight size={14} className="nudge" />
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A stack of cards: drag the top one aside, or use the arrows, to move through. */
function Deck({ items }: { items: WorkItem[] }) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState<{ dx: number; active: boolean }>({ dx: 0, active: false });
  const [throwing, setThrowing] = useState<number>(0);
  const start = useRef<{ x: number; id: number } | null>(null);
  const moved = useRef(false);
  const n = items.length;
  if (!n) return null;

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + n) % n);

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, id: e.pointerId };
    moved.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ dx: 0, active: true });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 4) moved.current = true;
    setDrag({ dx, active: true });
  };
  const onUp = () => {
    if (!start.current) return;
    const dx = drag.dx;
    start.current = null;
    if (Math.abs(dx) > 90) {
      const dir = dx > 0 ? 1 : -1;
      setThrowing(dir);
      setDrag({ dx: 0, active: false });
      window.setTimeout(() => {
        setThrowing(0);
        go(1);
      }, 260);
    } else {
      setDrag({ dx: 0, active: false });
    }
  };

  const visible = Array.from({ length: Math.min(3, n) }, (_, k) => items[(index + k) % n]);

  return (
    <div className="deck">
      <div
        className="deck__stack"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`Project ${index + 1} of ${n}: ${items[index].title}. Use the left and right arrow keys to move.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {visible
          .map((p, depth) => {
            const top = depth === 0;
            const style: React.CSSProperties & Record<string, string | number> = { "--depth": depth, zIndex: 10 - depth };
            if (top && (drag.active || throwing)) {
              const dx = throwing ? throwing * 700 : drag.dx;
              style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
              style.opacity = throwing ? 0 : 1;
            }
            return (
              <div
                key={p.slug}
                className="deck__card"
                data-top={top}
                data-dragging={top && drag.active}
                style={style}
                onPointerDown={top ? onDown : undefined}
                onPointerMove={top ? onMove : undefined}
                onPointerUp={top ? onUp : undefined}
                onPointerCancel={top ? onUp : undefined}
                aria-hidden={!top}
              >
                <MediaTile src={p.cover_url || undefined} alt="" title={p.title} kicker={p.tags[0]} strip={p.slug === "compactids"} sizes="22rem" />
                <div className="deck__caption">
                  <div>
                    <span className="mono">
                      {String(((index + depth) % n) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                    <h3>
                      <Link
                        href={`/projects/${p.slug}`}
                        tabIndex={top ? 0 : -1}
                        onClick={(e) => {
                          if (moved.current) e.preventDefault();
                        }}
                        draggable={false}
                      >
                        {p.title}
                      </Link>
                    </h3>
                  </div>
                  {p.year ? <span className="mono">{p.year}</span> : null}
                </div>
              </div>
            );
          })
          .reverse()}
      </div>
      <div className="deck__controls">
        <button type="button" className="icon-pill" onClick={() => go(-1)} aria-label="Previous project">
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <div className="deck__dots" aria-hidden="true">
          {items.map((p, i) => (
            <span key={p.slug} data-on={i === index} />
          ))}
        </div>
        <button type="button" className="icon-pill" onClick={() => go(1)} aria-label="Next project">
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <p className="deck__hint">Throw the top card aside, or use the arrows.</p>
    </div>
  );
}
