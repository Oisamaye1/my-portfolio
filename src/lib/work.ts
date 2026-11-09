import type { WorkItem } from "@/components/home/Works";
import type { Project } from "./types";

/** The opening paragraph of a write-up, without markdown. */
export function excerpt(markdown: string) {
  const para = markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^(#|-|\*\s|>|```|\|)/.test(p));
  return (para ?? "").replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
}

export function toWorkItem(p: Project): WorkItem {
  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    excerpt: excerpt(p.body),
    cover_url: p.cover_url,
    tags: p.tags,
    year: p.year,
    live_url: p.live_url,
    repo_url: p.repo_url,
    hasBody: Boolean(p.body),
  };
}
