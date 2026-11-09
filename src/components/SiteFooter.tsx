import Link from "next/link";
import { ArrowUpRight, EnvelopeSimple, Rss } from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings, SocialLink } from "@/lib/types";
import { SocialIcon } from "./SocialIcon";
import { ThemeToggle } from "./ThemeToggle";

const MENU = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/writing", label: "Writing" },
  { href: "/cv", label: "About me" },
];

export function SiteFooter({ settings, links }: { settings: SiteSettings; links: SocialLink[] }) {
  const word = (settings.short_name || settings.full_name.split(" ")[0] || "").toLowerCase();
  return (
    <footer className="footer">
      <div className="frame">
        <div className="footer__grid">
          <div>
            <ThemeToggle />
          </div>
          <div className="footer__col">
            <h2>Menu</h2>
            <ul>
              {MENU.map((m) => (
                <li key={m.href}>
                  <Link href={m.href}>{m.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2>Contact</h2>
            <ul>
              {settings.email ? (
                <li>
                  <a href={`mailto:${settings.email}`}>
                    <EnvelopeSimple size={16} aria-hidden="true" />
                    Email
                  </a>
                </li>
              ) : null}
              {links.map((l) => (
                <li key={l.id}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer me">
                    <SocialIcon platform={l.platform} size={16} />
                    {l.label}
                    <ArrowUpRight size={12} aria-hidden="true" style={{ marginLeft: "auto" }} />
                  </a>
                </li>
              ))}
              <li>
                <Link href="/writing/rss.xml">
                  <Rss size={16} aria-hidden="true" />
                  RSS
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer__meta">
          <span>
            © {new Date().getFullYear()} {settings.full_name}
          </span>
          {settings.footer_note ? <span>{settings.footer_note}</span> : null}
        </p>
      </div>
      <p className="footer__word" aria-hidden="true">
        {word}
      </p>
    </footer>
  );
}
