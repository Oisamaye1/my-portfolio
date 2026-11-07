import Link from "next/link";
import { EnvelopeSimple, Rss } from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings, SocialLink } from "@/lib/types";
import { SocialIcon } from "./SocialIcon";

export function SiteFooter({ settings, links }: { settings: SiteSettings; links: SocialLink[] }) {
  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <div>
          {settings.email ? (
            <p>
              <a className="icon-link" href={`mailto:${settings.email}`}>
                <EnvelopeSimple size={18} aria-hidden="true" />
                {settings.email}
              </a>
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
              <a className="icon-link" href={link.url} target="_blank" rel="noopener noreferrer me">
                <SocialIcon platform={link.platform} />
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link className="icon-link" href="/writing/rss.xml">
              <Rss size={18} aria-hidden="true" />
              RSS
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
