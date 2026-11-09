"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Article, ArrowRight, Briefcase, CaretDown, FileText, Flask, House, User } from "@phosphor-icons/react";
import { DotsMark } from "./DotsMark";
import { MediaTile } from "./MediaTile";

export type NavProject = { slug: string; title: string; summary: string; year: number | null; cover_url: string; tags: string[] };
export type NavPaper = { id: string; title: string; status: string; venue: string; year: number | null; url: string };

type MenuKey = "work" | "research";

const ITEMS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/projects", label: "Work", Icon: Briefcase, menu: "work" as MenuKey },
  { href: "/research", label: "Research", Icon: Flask, menu: "research" as MenuKey },
  { href: "/writing", label: "Writing", Icon: Article },
  { href: "/cv", label: "About", Icon: User },
];

export function SiteNav({ projects, papers }: { projects: NavProject[]; papers: NavPaper[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [compact, setCompact] = useState(false);
  const [preview, setPreview] = useState(0);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  // Fold to icons once the page is scrolled.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setCompact(window.scrollY > 140);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation, Escape, or a click elsewhere.
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        navRef.current?.querySelector<HTMLElement>(`[data-menu-trigger="${open}"]`)?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hoverOpen = (key: MenuKey) => {
    if (!window.matchMedia("(hover: hover) and (min-width: 48rem)").matches) return;
    window.clearTimeout(closeTimer.current);
    if (open !== key) setPreview(0);
    setOpen(key);
  };
  const hoverClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <nav ref={navRef} className="nav" aria-label="Main" data-compact={compact}>
      <ul className="nav__bar" role="list">
        {ITEMS.map(({ href, label, Icon, menu }) => {
          const active = isActive(href);
          return (
            <li
              key={href}
              className="nav__item"
              data-open={menu ? open === menu : undefined}
              onPointerEnter={menu ? () => hoverOpen(menu) : undefined}
              onPointerLeave={menu ? hoverClose : undefined}
            >
              <Link href={href} className="nav__link" aria-current={active ? "page" : undefined}>
                <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                <span className="nav__label">{label}</span>
              </Link>
              {menu ? (
                <>
                  <button
                    type="button"
                    className="nav__caret"
                    data-menu-trigger={menu}
                    aria-expanded={open === menu}
                    aria-controls={`menu-${menu}`}
                    aria-label={`Show ${label.toLowerCase()} menu`}
                    onClick={() => {
                      setPreview(0);
                      setOpen((o) => (o === menu ? null : menu));
                    }}
                  >
                    <CaretDown size={12} weight="bold" aria-hidden="true" />
                  </button>
                  <div id={`menu-${menu}`} className="menu" aria-hidden={open !== menu} inert={open !== menu}>
                    {menu === "work" ? (
                      <WorkMenu projects={projects} preview={preview} setPreview={setPreview} />
                    ) : (
                      <ResearchMenu papers={papers} preview={preview} setPreview={setPreview} />
                    )}
                  </div>
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
      <Link href="/contact" className="pill pill--dark nav__cta" aria-current={isActive("/contact") ? "page" : undefined}>
        <DotsMark />
        <span className="nav__cta-label">Get in touch</span>
      </Link>
    </nav>
  );
}

function WorkMenu({ projects, preview, setPreview }: { projects: NavProject[]; preview: number; setPreview: (i: number) => void }) {
  const list = projects.slice(0, 6);
  const p = list[preview] ?? list[0];
  return (
    <>
      <div className="menu__preview">
        {p ? (
          <>
            <MediaTile src={p.cover_url || undefined} alt="" title={p.title} kicker={p.tags[0]} strip={p.slug === "compactids"} sizes="13rem" />
            <p>{p.summary}</p>
            <span className="mono">
              <span>{p.tags[0] ?? ""}</span>
              <span>{p.year ?? ""}</span>
            </span>
          </>
        ) : null}
      </div>
      <div>
        <p className="menu__label">Projects</p>
        <ul className="menu__list">
          {list.map((item, i) => (
            <li key={item.slug}>
              <Link
                href={`/projects/${item.slug}`}
                className="menu__row"
                data-active={i === preview}
                onPointerEnter={() => setPreview(i)}
                onFocus={() => setPreview(i)}
              >
                <span className="menu__icon" aria-hidden="true">
                  <Briefcase size={15} />
                </span>
                <span>
                  <span className="menu__title">{item.title}</span>
                  <span className="menu__meta">
                    {[item.tags[0], item.year].filter(Boolean).join(", ")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="menu__foot">
        <span>{projects.length} projects</span>
        <Link href="/projects">
          Browse all work <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

function ResearchMenu({ papers, preview, setPreview }: { papers: NavPaper[]; preview: number; setPreview: (i: number) => void }) {
  const p = papers[preview] ?? papers[0];
  return (
    <>
      <div className="menu__preview">
        <MediaTile alt="" title="Intrusion detection" kicker="Research" strip sizes="13rem" />
        {p ? (
          <>
            <p>{p.title}</p>
            <span className="mono">
              <span>{p.status}</span>
              <span>{p.year ?? ""}</span>
            </span>
          </>
        ) : null}
      </div>
      <div>
        <p className="menu__label">Publications</p>
        <ul className="menu__list">
          {papers.slice(0, 5).map((item, i) => (
            <li key={item.id}>
              <Link href="/research" className="menu__row" data-active={i === preview} onPointerEnter={() => setPreview(i)} onFocus={() => setPreview(i)}>
                <span className="menu__icon" aria-hidden="true">
                  <FileText size={15} />
                </span>
                <span>
                  <span className="menu__title">{item.title.length > 60 ? `${item.title.slice(0, 58)}…` : item.title}</span>
                  <span className="menu__meta">{[item.status, item.year].filter(Boolean).join(", ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="menu__foot">
        <span>{papers.length} publications</span>
        <Link href="/research">
          See research interests <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
