import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { getProjects, getSettings } from "@/lib/data";
import { ProjectLinks } from "./ProjectLinks";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Projects", description: s.projects_intro || undefined };
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      <header className="page-head">
        <h1>Projects</h1>
        {settings.projects_intro ? <p>{settings.projects_intro}</p> : null}
      </header>

      {projects.length === 0 ? <p className="empty">No projects to show yet.</p> : null}

      {featured.map((project, i) => (
        <section key={project.id} className="feature" aria-labelledby={`p-${project.id}`}>
          <div>
            <h2 id={`p-${project.id}`}>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </h2>
            <p className="feature__summary">{project.summary}</p>
            {project.tags.length ? (
              <ul className="tags">
                {project.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="links">
              {project.body ? <Link href={`/projects/${project.slug}`}>Read the write-up</Link> : null}
            </p>
            <ProjectLinks project={project} />
          </div>
          {project.cover_url ? (
            <div className="shot">
              <Image
                src={project.cover_url}
                alt={`Screenshot of ${project.title}`}
                width={1200}
                height={750}
                sizes="(max-width: 52rem) 100vw, 40rem"
                priority={i === 0}
              />
            </div>
          ) : (
            <div className="feature__aside">
              <Markdown className="feature__excerpt prose">{leadIn(project.body)}</Markdown>
            </div>
          )}
        </section>
      ))}

      {rest.length ? (
        <>
          <h2 className="subhead">More projects</h2>
          <ul className="project-grid">
            {rest.map((project) => (
              <li key={project.id}>
                {project.cover_url ? (
                  <div className="shot">
                    <Image
                      src={project.cover_url}
                      alt={`Screenshot of ${project.title}`}
                      width={800}
                      height={500}
                      sizes="(max-width: 40rem) 100vw, 24rem"
                    />
                  </div>
                ) : null}
                <h3>
                  {project.body ? <Link href={`/projects/${project.slug}`}>{project.title}</Link> : project.title}
                </h3>
                <p>{project.summary}</p>
                <ProjectLinks project={project} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

/** The opening of a write-up, without headings, long enough to say what the project is. */
function leadIn(markdown: string) {
  const blocks = markdown
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith("#"));
  const picked: string[] = [];
  let length = 0;
  for (const block of blocks) {
    picked.push(block);
    length += block.length;
    if (length > 320) break;
  }
  return picked.join("\n\n");
}
