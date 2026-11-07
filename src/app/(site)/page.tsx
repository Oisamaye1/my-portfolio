import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TrafficStrip } from "@/components/TrafficStrip";
import { getProjects, getPublications, getPublishedPosts, getSettings } from "@/lib/data";
import { formatDate, readingMinutes } from "@/lib/format";

export const revalidate = 3600;

/** Splits a headline into words so they can rise in one after another on load. */
function Words({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word" style={{ ["--i" as string]: i }}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export default async function HomePage() {
  const [settings, posts, projects, publications] = await Promise.all([
    getSettings(),
    getPublishedPosts(5),
    getProjects(),
    getPublications(),
  ]);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 4);
  const leadPaper = publications[0];
  const headline = settings.headline || settings.full_name;

  return (
    <>
      <section className="hero" aria-labelledby="headline">
        <h1 id="headline" className="hero__headline" aria-label={headline}>
          <span aria-hidden="true">
            <Words text={headline} />
          </span>
        </h1>
        {settings.intro ? <p className="hero__intro">{settings.intro}</p> : null}

        <div className="hero__strip">
          <TrafficStrip />
        </div>
        <p className="hero__caption meta">
          <span>Each mark is a network flow. An intrusion detector&apos;s job is to find the few that are attacks.</span>
          <Link className="arrow-link" href="/projects/compactids">
            How CompactIDS does it
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </p>

        {settings.now_text ? (
          <div className="now" data-reveal>
            <span className="now__label">
              <span className="live-dot" aria-hidden="true" />
              Now
            </span>
            <p className="now__text">
              {settings.now_text}
              {settings.availability ? <span className="meta">{settings.availability}</span> : null}
            </p>
          </div>
        ) : null}
      </section>

      <div className="split">
        <section aria-labelledby="writing-heading">
          <div className="section-head" data-reveal>
            <h2 id="writing-heading">Writing</h2>
            {posts.length ? (
              <Link className="arrow-link" href="/writing">
                All posts
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          {posts.length ? (
            <ul className="entry-list">
              {posts.map((post, i) => (
                <li key={post.id} className="entry" data-reveal style={{ ["--i" as string]: i }}>
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
            <p className="empty" data-reveal>
              No posts yet. Until the first one is up, the <Link href="/research">research page</Link> has what I&apos;m
              working on.
            </p>
          )}
        </section>

        <section aria-labelledby="work-heading">
          <div className="section-head" data-reveal>
            <h2 id="work-heading">Selected work</h2>
            <Link className="arrow-link" href="/projects">
              All projects
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
          <ul className="entry-list">
            {featured.map((project, i) => (
              <li key={project.id} className="entry" data-reveal style={{ ["--i" as string]: i }}>
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
        <section className="lead-paper" aria-labelledby="research-heading" data-reveal>
          <div>
            <h2 id="research-heading">Research</h2>
            {settings.research_intro ? <p className="meta lead-paper__intro">{settings.research_intro}</p> : null}
          </div>
          <div>
            <p className="lead-paper__title">{leadPaper.title}</p>
            <p className="meta lead-paper__byline">
              <span>{leadPaper.authors}</span>
              {leadPaper.status ? <span className="status">{leadPaper.status}</span> : null}
            </p>
            {leadPaper.summary ? <p className="lead-paper__summary">{leadPaper.summary}</p> : null}
            <Link href="/research" className="arrow-link lead-paper__more">
              Publications and research interests
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
            {leadPaper.url ? (
              <a className="arrow-link lead-paper__more" href={leadPaper.url} target="_blank" rel="noopener noreferrer">
                Read the paper
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
