import Link from "next/link";
import { TrafficStrip } from "@/components/TrafficStrip";
import { getProjects, getPublications, getPublishedPosts, getSettings } from "@/lib/data";
import { formatDate, readingMinutes } from "@/lib/format";

export const revalidate = 3600;

export default async function HomePage() {
  const [settings, posts, projects, publications] = await Promise.all([
    getSettings(),
    getPublishedPosts(5),
    getProjects(),
    getPublications(),
  ]);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 4);
  const leadPaper = publications[0];

  return (
    <>
      <section className="hero" aria-labelledby="headline">
        <h1 id="headline" className="hero__headline">
          {settings.headline || settings.full_name}
        </h1>
        {settings.intro ? <p className="hero__intro">{settings.intro}</p> : null}

        <div className="hero__strip">
          <TrafficStrip />
        </div>
        <p className="hero__caption meta">
          <span>Each mark is a network flow. An intrusion detector&apos;s job is to find the few that are attacks.</span>
          <Link href="/projects/compactids">How CompactIDS does it</Link>
        </p>

        {settings.now_text ? (
          <div className="now">
            <span className="now__label">Now</span>
            <p className="now__text">
              {settings.now_text}
              {settings.availability ? <span className="meta">{settings.availability}</span> : null}
            </p>
          </div>
        ) : null}
      </section>

      <div className="split">
        <section aria-labelledby="writing-heading">
          <div className="section-head">
            <h2 id="writing-heading">Writing</h2>
            {posts.length ? <Link href="/writing">All posts</Link> : null}
          </div>
          {posts.length ? (
            <ul className="entry-list">
              {posts.map((post) => (
                <li key={post.id} className="entry">
                  <h3 className="entry__title">
                    <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt ? <p className="entry__body">{post.excerpt}</p> : null}
                  <p className="meta">
                    <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
                    <span>{readingMinutes(post.body)} min read</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">
              No posts yet. Until the first one is up, the <Link href="/research">research page</Link> has what I&apos;m
              working on.
            </p>
          )}
        </section>

        <section aria-labelledby="work-heading">
          <div className="section-head">
            <h2 id="work-heading">Selected work</h2>
            <Link href="/projects">All projects</Link>
          </div>
          <ul className="entry-list">
            {featured.map((project) => (
              <li key={project.id} className="entry">
                <div className="entry__top">
                  <h3 className="entry__title">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  {project.year ? <span className="meta">{project.year}</span> : null}
                </div>
                <p className="entry__body">{project.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {leadPaper ? (
        <section className="lead-paper" aria-labelledby="research-heading">
          <div>
            <h2 id="research-heading">Research</h2>
            {settings.research_intro ? <p className="meta" style={{ marginTop: "0.75rem" }}>{settings.research_intro}</p> : null}
          </div>
          <div>
            <p className="lead-paper__title">{leadPaper.title}</p>
            <p className="meta" style={{ marginTop: "0.5rem" }}>
              {leadPaper.authors}
              {leadPaper.status ? (
                <span className="status" style={{ marginLeft: "0.75rem" }}>
                  {leadPaper.status}
                </span>
              ) : null}
            </p>
            {leadPaper.summary ? <p className="lead-paper__summary">{leadPaper.summary}</p> : null}
            <Link href="/research" className="lead-paper__more">
              Publications and research interests
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
