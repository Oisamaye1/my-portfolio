import { hostOf } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectLinks({ project }: { project: Project }) {
  if (!project.live_url && !project.repo_url) return null;
  return (
    <p className="links">
      {project.live_url ? (
        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
          Visit {hostOf(project.live_url)}
        </a>
      ) : null}
      {project.repo_url ? (
        <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      ) : null}
    </p>
  );
}
