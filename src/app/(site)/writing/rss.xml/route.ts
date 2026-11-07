import { getPublishedPosts, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 3600;

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), getPublishedPosts(30)]);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}/writing/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${p.slug}</guid>
      <pubDate>${new Date(p.published_at ?? p.created_at).toUTCString()}</pubDate>
      <description>${escape(p.excerpt)}</description>
${p.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${settings.full_name}: Writing`)}</title>
    <link>${SITE_URL}/writing</link>
    <atom:link href="${SITE_URL}/writing/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(settings.writing_intro)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
