import type { Metadata } from "next";
import { Works } from "@/components/home/Works";
import { getProjects, getSettings } from "@/lib/data";
import { toWorkItem } from "@/lib/work";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Work", description: s.projects_intro || undefined };
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  return (
    <div className="frame">
      <header className="page-head" data-reveal>
        <h1 className="title-xl">Works.</h1>
        {settings.projects_intro ? <p className="lede">{settings.projects_intro}</p> : null}
      </header>
      <section className="section" style={{ paddingTop: 0 }} aria-label="Projects" data-reveal>
        {projects.length ? <Works items={projects.map(toWorkItem)} initialView="grid" /> : <p className="empty-card">No projects to show yet.</p>}
      </section>
    </div>
  );
}
