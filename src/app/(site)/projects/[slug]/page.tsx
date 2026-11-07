import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { getProject, getProjects } from "@/lib/data";
import { ProjectLinks } from "../ProjectLinks";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: project.cover_url ? [{ url: project.cover_url }] : undefined },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article className="article">
      <Link href="/projects" className="article__back">
        Projects
      </Link>
      <h1 className="article__title">{project.title}</h1>
      <p className="article__lede">{project.summary}</p>
      <div className="article__meta meta">
        {project.year ? <span>{project.year}</span> : null}
        {project.tags.length ? (
          <ul className="tags">
            {project.tags.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <ProjectLinks project={project} />
      {project.cover_url ? (
        <div className="article__cover">
          <Image src={project.cover_url} alt={`Screenshot of ${project.title}`} width={1400} height={875} sizes="44rem" priority />
        </div>
      ) : null}
      {project.body ? <Markdown>{project.body}</Markdown> : null}
    </article>
  );
}
