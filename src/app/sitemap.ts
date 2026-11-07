import type { MetadataRoute } from "next";
import { getProjects, getPublishedPosts } from "@/lib/data";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getProjects()]);
  const pages = ["", "/writing", "/projects", "/research", "/cv", "/contact"].map((p) => ({
    url: `${SITE_URL}${p}`,
  }));
  return [
    ...pages,
    ...posts.map((p) => ({ url: `${SITE_URL}/writing/${p.slug}`, lastModified: p.updated_at })),
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: p.updated_at })),
  ];
}
