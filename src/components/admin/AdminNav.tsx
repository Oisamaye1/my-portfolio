"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Article,
  Briefcase,
  Certificate,
  Flask,
  Gear,
  Images,
  Kanban,
  LinkSimple,
  Quotes,
  SquaresFour,
  Student,
  Tray,
  Wrench,
} from "@phosphor-icons/react";

const ICONS = {
  overview: SquaresFour,
  settings: Gear,
  messages: Tray,
  media: Images,
  posts: Article,
  projects: Kanban,
  publications: Flask,
  experience: Briefcase,
  education: Student,
  skills: Wrench,
  certifications: Certificate,
  testimonials: Quotes,
  links: LinkSimple,
} as const;

type Item = { href: string; label: string; icon: keyof typeof ICONS; count?: number };

export function AdminNav({ groups }: { groups: { title: string; items: Item[] }[] }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Admin">
      {groups.map((group) => (
        <div key={group.title} className="admin-nav__group">
          <p>{group.title}</p>
          <ul>
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              const Icon = ICONS[item.icon];
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined}>
                    <span className="admin-nav__label">
                      <Icon size={17} weight={active ? "fill" : "regular"} aria-hidden="true" />
                      {item.label}
                    </span>
                    {item.count ? (
                      <span className="count">
                        {item.count}
                        <span className="sr-only"> unread</span>
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
