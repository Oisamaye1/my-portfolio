-- Content schema for the site and its admin. Applied to the Supabase project "oisamaye-site".
-- Public visitors can read published content; only users listed in public.admins can write.

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

-- Single-row site settings: every piece of page copy lives here.
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  full_name text not null default '',
  short_name text not null default '',
  headline text not null default '',
  intro text not null default '',
  now_text text not null default '',
  bio text not null default '',
  location text not null default '',
  email text not null default '',
  phone text not null default '',
  show_phone boolean not null default false,
  avatar_url text not null default '',
  resume_url text not null default '',
  availability text not null default '',
  research_intro text not null default '',
  research_primary text[] not null default '{}',
  research_secondary text[] not null default '{}',
  writing_intro text not null default '',
  projects_intro text not null default '',
  cv_intro text not null default '',
  contact_intro text not null default '',
  footer_note text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  og_image_url text not null default '',
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  platform text not null default 'website',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  organization text not null,
  location text not null default '',
  kind text not null default 'industry' check (kind in ('research','teaching','industry')),
  start_date date,
  end_date date,
  is_current boolean not null default false,
  summary text not null default '',
  highlights text[] not null default '{}',
  tags text[] not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text not null default '',
  start_year int,
  end_year int,
  in_progress boolean not null default false,
  thesis text not null default '',
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text not null default '',
  venue text not null default '',
  year int,
  status text not null default '',
  doi text not null default '',
  url text not null default '',
  summary text not null default '',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text not null default '',
  cover_url text not null default '',
  tags text[] not null default '{}',
  live_url text not null default '',
  repo_url text not null default '',
  year int,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_url text not null default '',
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_idx on public.posts (published, published_at desc);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  items text[] not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null default '',
  year int,
  url text not null default '',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  role text not null default '',
  organization text not null default '',
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null default '' check (char_length(subject) <= 200),
  body text not null check (char_length(body) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['site_settings','social_links','experiences','education','publications','projects','posts','skill_groups','certifications','testimonials']
  loop
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

alter table public.admins enable row level security;
create policy "admins read self" on public.admins for select to authenticated using (user_id = (select auth.uid()));

do $$
declare t text;
begin
  foreach t in array array['site_settings','social_links','experiences','education','publications','skill_groups','certifications','testimonials']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

create policy "public read" on public.site_settings for select to anon, authenticated using (true);
create policy "public read" on public.social_links for select to anon, authenticated using (visible or (select public.is_admin()));
create policy "public read" on public.experiences for select to anon, authenticated using (visible or (select public.is_admin()));
create policy "public read" on public.education for select to anon, authenticated using (visible or (select public.is_admin()));
create policy "public read" on public.publications for select to anon, authenticated using (visible or (select public.is_admin()));
create policy "public read" on public.skill_groups for select to anon, authenticated using (visible or (select public.is_admin()));
create policy "public read" on public.certifications for select to anon, authenticated using (visible or (select public.is_admin()));
create policy "public read" on public.testimonials for select to anon, authenticated using (visible or (select public.is_admin()));

alter table public.projects enable row level security;
create policy "public read" on public.projects for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admin write" on public.projects for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

alter table public.posts enable row level security;
create policy "public read" on public.posts for select to anon, authenticated using ((published and published_at <= now()) or (select public.is_admin()));
create policy "admin write" on public.posts for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

alter table public.messages enable row level security;
create policy "anyone can send" on public.messages for insert to anon, authenticated with check (is_read = false);
create policy "admin read" on public.messages for select to authenticated using ((select public.is_admin()));
create policy "admin update" on public.messages for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete" on public.messages for delete to authenticated using ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/avif','application/pdf'])
on conflict (id) do nothing;

create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin list" on storage.objects for select to authenticated using (bucket_id = 'media' and (select public.is_admin()));
