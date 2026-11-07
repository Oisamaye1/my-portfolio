import Link from "next/link";
import type { SiteSettings, SocialLink } from "@/lib/types";

export function SiteFooter({ settings, links }: { settings: SiteSettings; links: SocialLink[] }) {
  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <div>
          {settings.email ? (
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          ) : null}
          <p className="site-footer__note">
            © {new Date().getFullYear()} {settings.full_name}
            {settings.footer_note ? `. ${settings.footer_note}` : ""}
          </p>
        </div>
        <ul className="site-footer__links">
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer me">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/writing/rss.xml">RSS</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
