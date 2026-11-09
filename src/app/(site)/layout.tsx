import type { Metadata } from "next";
import Link from "next/link";
import { BackToTop, RevealObserver } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProjects, getPublications, getSettings, getSocialLinks } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seo_title || s.full_name;
  return {
    title: { default: title, template: `%s | ${s.full_name}` },
    description: s.seo_description,
    authors: [{ name: s.full_name }],
    openGraph: {
      title,
      description: s.seo_description,
      type: "website",
      images: s.og_image_url ? [{ url: s.og_image_url }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description: s.seo_description },
    alternates: { types: { "application/rss+xml": "/writing/rss.xml" } },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, links, projects, papers] = await Promise.all([getSettings(), getSocialLinks(), getProjects(), getPublications()]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Link href="/" className="corner-brand" aria-label={`${settings.full_name}, home`}>
        {settings.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.avatar_url} alt="" width={32} height={32} />
        ) : null}
        <span className="corner-brand__name">{settings.short_name || settings.full_name}</span>
      </Link>
      <SiteNav
        projects={projects.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary, year: p.year, cover_url: p.cover_url, tags: p.tags }))}
        papers={papers.map((p) => ({ id: p.id, title: p.title, status: p.status, venue: p.venue, year: p.year, url: p.url }))}
      />
      <div className="corner-tools">
        <ThemeToggle />
      </div>
      <main id="main" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter settings={settings} links={links} />
      <BackToTop />
      <RevealObserver />
    </>
  );
}
