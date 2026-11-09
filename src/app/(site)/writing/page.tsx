import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getPublishedPosts, getSettings } from "@/lib/data";
import { formatDate, readingMinutes } from "@/lib/format";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Writing", description: s.writing_intro || undefined };
}

export default async function WritingPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const [settings, all] = await Promise.all([getSettings(), getPublishedPosts()]);
  const counts = new Map<string, number>();
  all.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const posts = tag ? all.filter((p) => p.tags.includes(tag)) : all;

  return (
    <div className="frame">
      <header className="page-head" data-reveal>
        <h1 className="title-xl">Writing.</h1>
        {settings.writing_intro ? <p className="lede">{settings.writing_intro}</p> : null}
      </header>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Posts">
        {tags.length > 1 ? (
          <nav className="works__filters" aria-label="Filter posts by tag" style={{ marginBottom: "2rem" }} data-reveal>
            <Link className="chip" href="/writing" aria-current={!tag ? "true" : undefined}>
              All <span className="count">{all.length}</span>
            </Link>
            {tags.map(([t, n]) => (
              <Link key={t} className="chip" href={`/writing?tag=${encodeURIComponent(t)}`} aria-current={tag === t ? "true" : undefined}>
                {t} <span className="count">{n}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        {posts.length === 0 ? (
          <div className="empty-card" data-reveal>
            {tag ? (
              <>
                <span>No posts tagged {tag}.</span>
                <Link className="pill pill--sm" href="/writing">
                  Show all posts
                </Link>
              </>
            ) : (
              <>
                <span>The first post is on its way. Meanwhile, the research page has what I&apos;m working on.</span>
                <Link className="pill pill--sm" href="/research">
                  See research <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul className="posts">
            {posts.map((post, i) => (
              <li key={post.id} className="post-row" data-reveal style={{ ["--i" as string]: i % 5 }}>
                <time className="mono" dateTime={post.published_at ?? undefined}>
                  {formatDate(post.published_at)}
                </time>
                <div>
                  <h2 style={{ fontSize: "1.1875rem" }}>
                    <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt ? <p>{post.excerpt}</p> : null}
                  {post.tags.length ? (
                    <ul className="hashtags" style={{ marginTop: "0.6rem" }}>
                      {post.tags.map((t) => (
                        <li key={t}>#{t.replace(/[^A-Za-z0-9]+/g, "")}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <span className="mono" style={{ display: "inline-flex", gap: "0.75rem", alignItems: "center" }}>
                  {readingMinutes(post.body)} min
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
