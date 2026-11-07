import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <Link href="/" className="wordmark">
          <span className="wordmark__dot" aria-hidden="true" />
          {name}
        </Link>
        <nav className="site-nav" aria-label="Main">
          <NavLinks />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
