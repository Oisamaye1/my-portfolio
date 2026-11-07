import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPublishedPosts()]);
  if (!post) notFound();

  const index = all.findIndex((p) => p.id === post.id);
  const newer = index > 0 ? all[index - 1] : null;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;

  return (
    <article className="article">
      <Link href="/writing" className="article__back">
        Writing
      </Link>
      <h1 className="article__title">{post.title}</h1>
      {post.excerpt ? <p className="article__lede">{post.excerpt}</p> : null}
      <div className="article__meta meta">
        <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
        <span>{readingMinutes(post.body)} min read</span>
        {post.tags.length ? (
          <ul className="tags">
            {post.tags.map((t) => (
              <li key={t}>
                <Link className="tag" href={`/writing?tag=${encodeURIComponent(t)}`}>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {post.cover_url ? (
        <figure className="article__cover" style={{ margin: "2.5rem 0 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_url} alt="" />
        </figure>
      ) : null}
      <Markdown>{post.body}</Markdown>

      {newer || older ? (
        <nav className="article__footer" aria-label="More posts">
          <div>
            {older ? (
              <Link href={`/writing/${older.slug}`}>
                <span>Previous post</span>
                <strong>{older.title}</strong>
              </Link>
            ) : null}
          </div>
          <div className="next">
            {newer ? (
              <Link href={`/writing/${newer.slug}`}>
                <span>Next post</span>
                <strong>{newer.title}</strong>
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </article>
  );
}
