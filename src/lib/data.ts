import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import type {
  Certification,
  Education,
  Experience,
  Post,
  Project,
  Publication,
  SiteSettings,
  SkillGroup,
  SocialLink,
  Testimonial,
} from "./types";

const EMPTY_SETTINGS: SiteSettings = {
  id: 1,
  full_name: "",
  short_name: "",
  headline: "",
  intro: "",
  now_text: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  show_phone: false,
  avatar_url: "",
  resume_url: "",
  availability: "",
  research_intro: "",
  research_primary: [],
  research_secondary: [],
  writing_intro: "",
  projects_intro: "",
  cv_intro: "",
  contact_intro: "",
  footer_note: "",
  seo_title: "",
  seo_description: "",
  og_image_url: "",
  updated_at: new Date(0).toISOString(),
};

function must<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`Could not load ${what}: ${result.error.message}`);
  return (result.data ?? ([] as unknown)) as T;
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = createPublicClient();
  const res = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (res.error) throw new Error(`Could not load site settings: ${res.error.message}`);
  return { ...EMPTY_SETTINGS, ...(res.data ?? {}) };
});

export const getSocialLinks = cache(async () => {
  const db = createPublicClient();
  return must<SocialLink[]>(
    await db.from("social_links").select("*").eq("visible", true).order("sort_order"),
    "social links",
  );
});

export const getPublishedPosts = cache(async (limit?: number) => {
  const db = createPublicClient();
  let q = db
    .from("posts")
    .select("id,slug,title,excerpt,cover_url,tags,published,published_at,created_at,updated_at,body")
    .eq("published", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  return must<Post[]>(await q, "posts");
});

export const getPost = cache(async (slug: string) => {
  const db = createPublicClient();
  const res = await db
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (res.error) throw new Error(`Could not load post: ${res.error.message}`);
  return res.data as Post | null;
});

export const getProjects = cache(async () => {
  const db = createPublicClient();
  return must<Project[]>(
    await db.from("projects").select("*").eq("published", true).order("sort_order"),
    "projects",
  );
});

export const getProject = cache(async (slug: string) => {
  const db = createPublicClient();
  const res = await db.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (res.error) throw new Error(`Could not load project: ${res.error.message}`);
  return res.data as Project | null;
});

export const getExperiences = cache(async () => {
  const db = createPublicClient();
  return must<Experience[]>(
    await db
      .from("experiences")
      .select("*")
      .eq("visible", true)
      .order("sort_order")
      .order("start_date", { ascending: false }),
    "experience",
  );
});

export const getEducation = cache(async () => {
  const db = createPublicClient();
  return must<Education[]>(
    await db.from("education").select("*").eq("visible", true).order("sort_order"),
    "education",
  );
});

export const getPublications = cache(async () => {
  const db = createPublicClient();
  return must<Publication[]>(
    await db.from("publications").select("*").eq("visible", true).order("sort_order"),
    "publications",
  );
});

export const getSkillGroups = cache(async () => {
  const db = createPublicClient();
  return must<SkillGroup[]>(
    await db.from("skill_groups").select("*").eq("visible", true).order("sort_order"),
    "skills",
  );
});

export const getCertifications = cache(async () => {
  const db = createPublicClient();
  return must<Certification[]>(
    await db.from("certifications").select("*").eq("visible", true).order("sort_order"),
    "certifications",
  );
});

export const getTestimonials = cache(async () => {
  const db = createPublicClient();
  return must<Testimonial[]>(
    await db.from("testimonials").select("*").eq("visible", true).order("sort_order"),
    "testimonials",
  );
});
