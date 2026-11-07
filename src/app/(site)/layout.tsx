import type { Metadata } from "next";
import { BackToTop, RevealObserver } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSettings, getSocialLinks } from "@/lib/data";

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
  const [settings, links] = await Promise.all([getSettings(), getSocialLinks()]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader name={settings.short_name || settings.full_name} />
      <main id="main" className="site-main" tabIndex={-1}>
        <div className="page">{children}</div>
      </main>
      <SiteFooter settings={settings} links={links} />
      <BackToTop />
      <RevealObserver />
    </>
  );
}
