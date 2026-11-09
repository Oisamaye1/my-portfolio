export type SiteSettings = {
  id: number;
  full_name: string;
  short_name: string;
  headline: string;
  roles: string[];
  statement: string;
  about_headline: string;
  quote_text: string;
  quote_author: string;
  intro: string;
  now_text: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  show_phone: boolean;
  avatar_url: string;
  resume_url: string;
  availability: string;
  research_intro: string;
  research_primary: string[];
  research_secondary: string[];
  writing_intro: string;
  projects_intro: string;
  cv_intro: string;
  contact_intro: string;
  footer_note: string;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  updated_at: string;
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  platform: string;
  sort_order: number;
  visible: boolean;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  location: string;
  kind: "research" | "teaching" | "industry";
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  summary: string;
  highlights: string[];
  tags: string[];
  sort_order: number;
  visible: boolean;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_year: number | null;
  end_year: number | null;
  in_progress: boolean;
  thesis: string;
  highlights: string[];
  sort_order: number;
  visible: boolean;
};

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number | null;
  status: string;
  doi: string;
  url: string;
  summary: string;
  sort_order: number;
  visible: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  cover_url: string;
  tags: string[];
  live_url: string;
  repo_url: string;
  year: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SkillGroup = {
  id: string;
  name: string;
  items: string[];
  sort_order: number;
  visible: boolean;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: number | null;
  url: string;
  sort_order: number;
  visible: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  sort_order: number;
  visible: boolean;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
};
