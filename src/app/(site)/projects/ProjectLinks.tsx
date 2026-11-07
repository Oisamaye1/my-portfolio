import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { hostOf } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectLinks({ project }: { project: Project }) {
  if (!project.live_url && !project.repo_url) return null;
  return (
    <p className="links">
      {project.live_url ? (
        <a className="arrow-link" href={project.live_url} target="_blank" rel="noopener noreferrer">
          Visit {hostOf(project.live_url)}
          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </a>
      ) : null}
      {project.repo_url ? (
        <a className="arrow-link" href={project.repo_url} target="_blank" rel="noopener noreferrer">
          <GithubLogo size={16} aria-hidden="true" />
          Source code
        </a>
      ) : null}
    </p>
  );
}
