-- Fields for the redesigned home page: rotating roles, a statement, an about headline and a quote.
alter table public.site_settings
  add column if not exists roles text[] not null default '{}',
  add column if not exists statement text not null default '',
  add column if not exists about_headline text not null default '',
  add column if not exists quote_text text not null default '',
  add column if not exists quote_author text not null default '';
