import type { Metadata } from "next";
import GithubSlugger from "github-slugger";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CopyLink, ReadingProgress, TocTracker } from "@/components/Article";
import { Markdown } from "@/components/Markdown";
import { getPost, getPublishedPosts } from "@/lib/data";
import { formatDate, readingMinutes } from "@/lib/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  };
}

/** Section headings in the post, with the same ids rehype-slug gives them. */
function outline(markdown: string) {
  const slugger = new GithubSlugger();
  const items: { id: string; text: string; level: 2 | 3 }[] = [];
  let inCode = false;
  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    items.push({ id: slugger.slug(text), text, level: m[1].length as 2 | 3 });
  }
  return items;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPublishedPosts()]);
  if (!post) notFound();

  const index = all.findIndex((p) => p.id === post.id);
  const newer = index > 0 ? all[index - 1] : null;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const toc = outline(post.body);
  const showToc = toc.filter((t) => t.level === 2).length >= 2;

  return (
    <>
      <ReadingProgress />
      <div className="frame">
      <div className={showToc ? "article-layout page-head" : "page-head"}>
        <article className="article">
          <Link href="/writing" className="back-link">
            <ArrowLeft size={14} aria-hidden="true" />
            All writing
          </Link>
          <h1 className="article__title" data-reveal>
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="article__lede" data-reveal style={{ ["--i" as string]: 1 }}>
              {post.excerpt}
            </p>
          ) : null}
          <div className="article__meta" data-reveal style={{ ["--i" as string]: 2 }}>
            <time className="mono" dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
            <span className="mono">{readingMinutes(post.body)} min read</span>
            {post.tags.length ? (
              <span className="works__filters">
                {post.tags.map((t) => (
                  <Link key={t} className="chip" href={`/writing?tag=${encodeURIComponent(t)}`}>
                    {t}
                  </Link>
                ))}
              </span>
            ) : null}
            <CopyLink />
          </div>
          {post.cover_url ? (
            <figure className="article__cover" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt="" />
            </figure>
          ) : null}
          <Markdown>{post.body}</Markdown>

          {newer || older ? (
            <nav className="article__footer" aria-label="More posts">
              <div>
                {older ? (
                  <Link href={`/writing/${older.slug}`} className="pager">
                    <span>
                      <ArrowLeft size={13} aria-hidden="true" /> Previous post
                    </span>
                    <strong>{older.title}</strong>
                  </Link>
                ) : null}
              </div>
              <div className="next">
                {newer ? (
                  <Link href={`/writing/${newer.slug}`} className="pager">
                    <span>
                      Next post <ArrowRight size={13} aria-hidden="true" />
                    </span>
                    <strong>{newer.title}</strong>
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}
        </article>

        {showToc ? (
          <aside className="toc" aria-label="On this page">
            <p className="toc__title">On this page</p>
            <ol>
              {toc.map((t) => (
                <li key={t.id} data-level={t.level}>
                  <a href={`#${t.id}`}>{t.text}</a>
                </li>
              ))}
            </ol>
            <TocTracker ids={toc.map((t) => t.id)} />
          </aside>
        ) : null}
      </div>
      </div>
    </>
  );
}
