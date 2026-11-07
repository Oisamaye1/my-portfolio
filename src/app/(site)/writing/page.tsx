import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getSettings } from "@/lib/data";
import { formatDayMonth, readingMinutes, yearOf } from "@/lib/format";
import type { Post } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Writing", description: s.writing_intro || undefined };
}

export default async function WritingPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const [settings, all] = await Promise.all([getSettings(), getPublishedPosts()]);
  const tags = [...new Set(all.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
  const posts = tag ? all.filter((p) => p.tags.includes(tag)) : all;

  const byYear = new Map<number, Post[]>();
  for (const post of posts) {
    const y = yearOf(post.published_at) ?? 0;
    byYear.set(y, [...(byYear.get(y) ?? []), post]);
  }

  return (
    <>
      <header className="page-head" data-reveal>
        <h1>Writing</h1>
        {settings.writing_intro ? <p>{settings.writing_intro}</p> : null}
      </header>

      {tags.length > 1 ? (
        <nav className="tag-filter" aria-label="Filter posts by tag" data-reveal style={{ ["--i" as string]: 1 }}>
          <ul className="tags">
            <li>
              <Link className="tag" href="/writing" aria-current={!tag ? "true" : undefined}>
                All
              </Link>
            </li>
            {tags.map((t) => (
              <li key={t}>
                <Link
                  className="tag"
                  href={`/writing?tag=${encodeURIComponent(t)}`}
                  aria-current={tag === t ? "true" : undefined}
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {posts.length === 0 ? (
        <p className="empty">
          {tag ? (
            <>
              No posts tagged {tag}. <Link href="/writing">Show all posts</Link>
            </>
          ) : (
            <>
              No posts yet. Until the first one is up, the <Link href="/research">research page</Link> has what I&apos;m
              working on.
            </>
          )}
        </p>
      ) : (
        [...byYear.entries()].map(([year, items]) => (
          <section key={year} className="year-group" aria-labelledby={`y-${year}`} data-reveal>
            <h2 id={`y-${year}`}>{year}</h2>
            <ul className="entry-list">
              {items.map((post, i) => (
                <li key={post.id} className="entry post-row" data-reveal style={{ ["--i" as string]: i }}>
                  <time className="meta" dateTime={post.published_at ?? undefined}>
                    {formatDayMonth(post.published_at)}
                  </time>
                  <div>
                    <h3 className="entry__title">
                      <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt ? <p className="entry__body">{post.excerpt}</p> : null}
                    <p className="meta">
                      <span>{readingMinutes(post.body)} min read</span>
                      {post.tags.length ? <span>{post.tags.join(", ")}</span> : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
