# Ovioisa Oisamaye Benjamin: portfolio, blog and CMS

A personal site that combines a portfolio (projects, research, CV) with a blog, plus a custom admin for editing all of it.

- **Site:** Next.js 15 (App Router), React 19, hand-written CSS.
- **Content, login and uploads:** Supabase (Postgres with row-level security, Auth, Storage).

## Pages

| Path | What's on it |
| --- | --- |
| `/` | Headline, intro, latest posts, featured projects, lead publication |
| `/writing`, `/writing/[slug]` | Blog index (grouped by year, filterable by tag) and posts |
| `/writing/rss.xml` | RSS feed |
| `/projects`, `/projects/[slug]` | Featured projects with write-ups, then the rest |
| `/research` | Research interests and publications |
| `/cv` | Bio, experience, education, skills, certifications, testimonials |
| `/contact` | Contact form (messages land in the admin) and contact details |
| `/admin` | The CMS. Sign in with the admin account |

## The admin

Everything visitors see comes from the database and is editable at `/admin`:

- **Pages & profile:** name, portrait, headline, intro, bio, contact details, CV file, research interests, the intro line on every page, and search/sharing text.
- **Posts:** markdown editor with preview, image upload, tags, drafts, scheduled publishing.
- **Projects, publications, experience, education, skills, certifications, testimonials, social links:** add, edit, hide, delete and reorder.
- **Messages:** submissions from the contact form.
- **Media library:** upload images and PDFs and copy their links.

Saving in the admin refreshes the public pages right away.

## Running it locally

```bash
cp .env.example .env.local   # then fill in the Supabase URL and publishable key
npm install
npm run dev
```

## Database

`supabase/migrations/0001_cms_schema.sql` creates the tables, access rules and the `media` storage bucket. `supabase/seed.sql` holds the initial content taken from the resumes. Both have already been applied to the Supabase project `oisamaye-site`.

Only users listed in `public.admins` can change content. To give another account admin rights, add its user id there:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'someone@example.com';
```

## Deploying to Vercel

1. Import the repository in Vercel.
2. Add the environment variables from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the site's real address.
3. Deploy.
