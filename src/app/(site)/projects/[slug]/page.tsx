import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Markdown } from "@/components/Markdown";
import { MediaTile } from "@/components/MediaTile";
import { getProject, getProjects } from "@/lib/data";
import { hostOf } from "@/lib/format";
import { excerpt } from "@/lib/work";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary, openGraph: { images: project.cover_url ? [{ url: project.cover_url }] : undefined } };
}

const hashtag = (t: string) => `#${t.replace(/[^A-Za-z0-9]+/g, "")}`;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  const i = all.findIndex((p) => p.id === project.id);
  const next = all.length > 1 ? all[(i + 1) % all.length] : null;

  return (
    <div className="frame">
      <article className="page-head">
        <Link href="/projects" className="back-link">
          <ArrowLeft size={14} aria-hidden="true" /> All work
        </Link>
        <h1 className="show__title" style={{ fontSize: "clamp(1.9rem, 1.3rem + 2.4vw, 3rem)" }} data-reveal>
          <strong>{project.title}.</strong> {project.summary}
        </h1>
        <ul className="hashtags" style={{ marginTop: "1rem" }} data-reveal>
          {project.tags.map((t) => (
            <li key={t}>{hashtag(t)}</li>
          ))}
        </ul>

        <div className="show__card detail__card" data-reveal>
          <div className="show__media" style={{ aspectRatio: "16 / 10", borderRadius: "var(--r-lg)", border: "1px solid var(--line)" }}>
            <MediaTile src={project.cover_url || undefined} alt={`Screenshot of ${project.title}`} title={project.title} kicker={project.tags[0]} strip={project.slug === "compactids"} sizes="(max-width: 48rem) 100vw, 44rem" priority />
          </div>
          <div className="show__info">
            <p className="show__excerpt">{excerpt(project.body) || project.summary}</p>
            <dl className="show__meta">
              {project.year ? (
                <div>
                  <dt className="sr-only">Year</dt>
                  <dd style={{ margin: 0 }}>
                    Year: <b>{project.year}</b>
                  </dd>
                </div>
              ) : null}
              {project.tags.length ? (
                <div>
                  <dt className="sr-only">Built with</dt>
                  <dd style={{ margin: 0 }}>
                    Built with: <b>{project.tags.join(", ")}</b>
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="show__actions">
              {project.live_url ? (
                <a className="pill pill--dark" href={project.live_url} target="_blank" rel="noopener noreferrer">
                  Visit {hostOf(project.live_url)} <ArrowUpRight size={15} className="nudge" aria-hidden="true" />
                </a>
              ) : null}
              {project.repo_url ? (
                <a className="pill" href={project.repo_url} target="_blank" rel="noopener noreferrer">
                  <GithubLogo size={16} aria-hidden="true" /> Source code
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="detail__body">
          {project.body ? <Markdown>{project.body}</Markdown> : <p className="muted">A full write-up for this project is coming.</p>}
          <dl className="facts">
            {next ? (
              <div>
                <dt>Next project</dt>
                <dd>
                  <Link className="text-link" href={`/projects/${next.slug}`}>
                    {next.title}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </article>
    </div>
  );
}
