/**
 * Every editable thing on the site is described here. The admin builds its lists and forms
 * from these definitions, and the save action uses them to parse and validate form input.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "url"
  | "email"
  | "image"
  | "file"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "tags"
  | "lines"
  | "select"
  | "slug";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** For slug fields: the field the slug is generated from. */
  from?: string;
  /** Layout hint: half-width fields sit side by side on wide screens. */
  half?: boolean;
  rows?: number;
};

export type Collection = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  /** Column shown as the row title in the list. */
  titleField: string;
  /** Column shown under the title in the list. */
  subtitleField?: string;
  /** Column used to show a draft/hidden badge. */
  visibilityField?: { name: string; offLabel: string };
  orderBy: { column: string; ascending: boolean }[];
  sortable: boolean;
  fields: Field[];
  /** Public paths to refresh after a save. */
  paths: string[];
};

export const collections: Collection[] = [
  {
    key: "posts",
    table: "posts",
    label: "Posts",
    singular: "post",
    description: "Blog posts on the Writing page. Drafts stay hidden until you publish them.",
    titleField: "title",
    subtitleField: "published_at",
    visibilityField: { name: "published", offLabel: "Draft" },
    orderBy: [
      { column: "published", ascending: true },
      { column: "published_at", ascending: false },
      { column: "created_at", ascending: false },
    ],
    sortable: false,
    paths: ["/", "/writing"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Web address", type: "slug", from: "title", required: true, help: "The last part of the post's URL, e.g. /writing/my-post." },
      { name: "excerpt", label: "Summary", type: "textarea", rows: 2, help: "One or two sentences shown in post lists and link previews." },
      { name: "body", label: "Post", type: "markdown", required: true, rows: 24 },
      { name: "cover_url", label: "Cover image", type: "image" },
      { name: "tags", label: "Tags", type: "tags", help: "Separate with commas." },
      { name: "published", label: "Published", type: "boolean", half: true, help: "Visible on the site." },
      { name: "published_at", label: "Publish date", type: "datetime", half: true, help: "Leave empty to use the moment you publish. A future date schedules the post." },
    ],
  },
  {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "project",
    description: "Research systems and web applications on the Projects page. Featured ones also appear on the home page.",
    titleField: "title",
    subtitleField: "summary",
    visibilityField: { name: "published", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/", "/projects"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Web address", type: "slug", from: "title", required: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true },
      { name: "body", label: "Write-up", type: "markdown", rows: 16, help: "Optional. With a write-up, the project gets its own page." },
      { name: "cover_url", label: "Screenshot or cover", type: "image" },
      { name: "tags", label: "Technologies", type: "tags", help: "Separate with commas." },
      { name: "live_url", label: "Live site", type: "url", half: true },
      { name: "repo_url", label: "Source code", type: "url", half: true },
      { name: "year", label: "Year", type: "number", half: true },
      { name: "featured", label: "Feature on home page", type: "boolean", half: true },
      { name: "published", label: "Show on site", type: "boolean", half: true },
    ],
  },
  {
    key: "experience",
    table: "experiences",
    label: "Experience",
    singular: "role",
    description: "Research, teaching and industry roles on the CV page.",
    titleField: "role",
    subtitleField: "organization",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/cv"],
    fields: [
      { name: "role", label: "Role", type: "text", required: true, half: true },
      { name: "organization", label: "Organisation", type: "text", required: true, half: true },
      { name: "location", label: "Location", type: "text", half: true },
      {
        name: "kind",
        label: "Type",
        type: "select",
        half: true,
        options: [
          { value: "research", label: "Research" },
          { value: "teaching", label: "Teaching" },
          { value: "industry", label: "Industry" },
        ],
      },
      { name: "start_date", label: "Started", type: "date", half: true },
      { name: "end_date", label: "Ended", type: "date", half: true },
      { name: "is_current", label: "I work here now", type: "boolean" },
      { name: "summary", label: "Summary", type: "textarea", rows: 2 },
      { name: "highlights", label: "Highlights", type: "lines", rows: 6, help: "One per line." },
      { name: "tags", label: "Skills used", type: "tags", help: "Separate with commas." },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
  {
    key: "education",
    table: "education",
    label: "Education",
    singular: "qualification",
    description: "Degrees and diplomas on the CV page.",
    titleField: "degree",
    subtitleField: "institution",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/cv"],
    fields: [
      { name: "degree", label: "Qualification", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true, half: true },
      { name: "location", label: "Location", type: "text", half: true },
      { name: "start_year", label: "Start year", type: "number", half: true },
      { name: "end_year", label: "End year", type: "number", half: true },
      { name: "in_progress", label: "In progress", type: "boolean" },
      { name: "thesis", label: "Thesis title", type: "textarea", rows: 2 },
      { name: "highlights", label: "Details", type: "lines", rows: 5, help: "One per line." },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
  {
    key: "publications",
    table: "publications",
    label: "Publications",
    singular: "publication",
    description: "Papers, manuscripts and talks on the Research page.",
    titleField: "title",
    subtitleField: "status",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/", "/research"],
    fields: [
      { name: "title", label: "Title", type: "textarea", rows: 2, required: true },
      { name: "authors", label: "Authors", type: "text", half: true },
      { name: "venue", label: "Journal, conference or venue", type: "text", half: true },
      { name: "year", label: "Year", type: "number", half: true },
      { name: "status", label: "Status", type: "text", half: true, placeholder: "Published, Under peer review…" },
      { name: "doi", label: "DOI", type: "text", half: true, placeholder: "10.xxxx/xxxxx" },
      { name: "url", label: "Link", type: "url", half: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 4 },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
  {
    key: "skills",
    table: "skill_groups",
    label: "Skills",
    singular: "skill group",
    description: "Groups of skills on the CV page.",
    titleField: "name",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/cv"],
    fields: [
      { name: "name", label: "Group name", type: "text", required: true },
      { name: "items", label: "Skills", type: "tags", help: "Separate with commas." },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
  {
    key: "certifications",
    table: "certifications",
    label: "Certifications",
    singular: "certification",
    description: "Certificates on the CV page.",
    titleField: "name",
    subtitleField: "issuer",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/cv"],
    fields: [
      { name: "name", label: "Certificate", type: "text", required: true },
      { name: "issuer", label: "Issued by", type: "text", half: true },
      { name: "year", label: "Year", type: "number", half: true },
      { name: "url", label: "Credential link", type: "url" },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    description: "Quotes from people you've worked with, shown on the CV page.",
    titleField: "author",
    subtitleField: "quote",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/cv"],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 3, required: true },
      { name: "author", label: "Name", type: "text", required: true, half: true },
      { name: "role", label: "Role", type: "text", half: true },
      { name: "organization", label: "Organisation", type: "text" },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
  {
    key: "links",
    table: "social_links",
    label: "Social links",
    singular: "link",
    description: "Profiles shown in the footer and on the Contact page.",
    titleField: "label",
    subtitleField: "url",
    visibilityField: { name: "visible", offLabel: "Hidden" },
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    paths: ["/"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true, half: true, placeholder: "GitHub" },
      {
        name: "platform",
        label: "Platform",
        type: "select",
        half: true,
        options: [
          { value: "github", label: "GitHub" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "x", label: "X / Twitter" },
          { value: "scholar", label: "Google Scholar" },
          { value: "orcid", label: "ORCID" },
          { value: "researchgate", label: "ResearchGate" },
          { value: "youtube", label: "YouTube" },
          { value: "instagram", label: "Instagram" },
          { value: "medium", label: "Medium" },
          { value: "website", label: "Other website" },
        ],
      },
      { name: "url", label: "Address", type: "url", required: true },
      { name: "visible", label: "Show on site", type: "boolean" },
    ],
  },
];

export function getCollection(key: string) {
  return collections.find((c) => c.key === key);
}

/** The site settings form: one row, grouped into sections. */
export const settingsSections: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "Identity",
    description: "Your name and photo, used across the site.",
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true, half: true },
      { name: "short_name", label: "Short name", type: "text", half: true, help: "Shown in the site header." },
      { name: "avatar_url", label: "Portrait", type: "image" },
    ],
  },
  {
    title: "Home page",
    description: "The first things visitors read.",
    fields: [
      { name: "headline", label: "Headline (for search and sharing)", type: "textarea", rows: 2, required: true },
      { name: "roles", label: "Rotating roles", type: "lines", rows: 5, help: "One per line. The hero cycles through these." },
      { name: "intro", label: "Introduction", type: "textarea", rows: 4 },
      { name: "now_text", label: "What you're doing now", type: "textarea", rows: 2 },
      { name: "availability", label: "Availability", type: "text", help: "e.g. Open to research collaborations." },
      { name: "statement", label: "Statement", type: "textarea", rows: 3, help: "The large sentence under the organisations you've worked with." },
      { name: "quote_text", label: "Closing quote", type: "textarea", rows: 2 },
      { name: "quote_author", label: "Quote author", type: "text" },
    ],
  },
  {
    title: "About",
    description: "The longer biography at the top of the CV page.",
    fields: [
      { name: "about_headline", label: "About headline", type: "text" },
      { name: "bio", label: "Biography", type: "markdown", rows: 14 },
    ],
  },
  {
    title: "Contact details",
    description: "Shown on the Contact page and in the footer.",
    fields: [
      { name: "email", label: "Email", type: "email", half: true },
      { name: "location", label: "Location", type: "text", half: true },
      { name: "phone", label: "Phone", type: "text", half: true },
      { name: "show_phone", label: "Show phone number publicly", type: "boolean", half: true },
      { name: "resume_url", label: "CV / resume file", type: "file", help: "Upload a PDF. A download link appears on the CV page." },
    ],
  },
  {
    title: "Research page",
    description: "The introduction and interests on the Research page.",
    fields: [
      { name: "research_intro", label: "Introduction", type: "textarea", rows: 3 },
      { name: "research_primary", label: "Primary interests", type: "lines", rows: 4, help: "One per line." },
      { name: "research_secondary", label: "Other interests", type: "lines", rows: 5, help: "One per line." },
    ],
  },
  {
    title: "Page introductions",
    description: "The short line under each page title.",
    fields: [
      { name: "writing_intro", label: "Writing", type: "textarea", rows: 2 },
      { name: "projects_intro", label: "Projects", type: "textarea", rows: 2 },
      { name: "cv_intro", label: "CV", type: "textarea", rows: 2 },
      { name: "contact_intro", label: "Contact", type: "textarea", rows: 2 },
      { name: "footer_note", label: "Footer note", type: "text" },
    ],
  },
  {
    title: "Search and sharing",
    description: "How the site appears in search results and link previews.",
    fields: [
      { name: "seo_title", label: "Site title", type: "text" },
      { name: "seo_description", label: "Site description", type: "textarea", rows: 3 },
      { name: "og_image_url", label: "Link preview image", type: "image", help: "Shown when the site is shared on social media. 1200×630 works best." },
    ],
  },
];

export const settingsFields = settingsSections.flatMap((s) => s.fields);
