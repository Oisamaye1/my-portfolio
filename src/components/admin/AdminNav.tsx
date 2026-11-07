"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; count?: number };

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
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined}>
                    {item.label}
                    {item.count ? (
                      <span className="count" aria-label={`${item.count} unread`}>
                        {item.count}
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
