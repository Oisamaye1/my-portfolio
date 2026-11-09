import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, User } from "@phosphor-icons/react/dist/ssr";
import { DotsMark } from "@/components/DotsMark";
import { Markdown } from "@/components/Markdown";
import { MediaTile } from "@/components/MediaTile";
import { SectionRail } from "@/components/SectionRail";
import { Atmosphere } from "@/components/home/Atmosphere";
import { DotWave } from "@/components/home/DotWave";
import { Gallery } from "@/components/home/Gallery";
import { Journey } from "@/components/home/Journey";
import { Orgs } from "@/components/home/Orgs";
import { Roles } from "@/components/home/Roles";
import { SkillGraph } from "@/components/home/SkillGraph";
import { Stack } from "@/components/home/Stack";
import { Works } from "@/components/home/Works";
import {
  getEducation,
  getExperiences,
  getProjects,
  getPublications,
  getPublishedPosts,
  getSettings,
  getSkillGroups,
} from "@/lib/data";
import { formatDate, readingMinutes } from "@/lib/format";
import { toWorkItem } from "@/lib/work";

export const revalidate = 3600;

const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About me" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
];

export default async function HomePage() {
  const [settings, posts, projects, publications, experiences, education, skills] = await Promise.all([
    getSettings(),
    getPublishedPosts(4),
    getProjects(),
    getPublications(),
    getExperiences(),
    getEducation(),
    getSkillGroups(),
  ]);

  const firstName = settings.full_name.split(" ")[0] || settings.short_name;
  const roles = settings.roles.length ? settings.roles : [settings.headline];
  const orgs = [...new Set([...experiences.map((e) => e.organization), ...education.map((e) => e.institution)])];
  const featuredFirst = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
  const shots = projects.filter((p) => p.cover_url).map((p) => ({ slug: p.slug, title: p.title, src: p.cover_url }));
  const bioLead = settings.bio.split(/\n\s*\n/).slice(0, 2).join("\n\n");

  return (
    <>
      <SectionRail sections={SECTIONS} />

      <div className="frame">
        {/* Hero */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <Atmosphere />
          <div className="hero__grid">
            <div className="hero__left">
              <h1 id="hero-title" className="hero__title">
                <span className="sr-only">
                  {settings.full_name}: {roles.join(", ")}
                </span>
                <Roles roles={roles} />
              </h1>
              <div className="hero__ctas">
                <Link className="pill" href="/cv">
                  <User size={16} aria-hidden="true" /> About me
                </Link>
                <Link className="pill pill--dark" href="#work">
                  See my work <ArrowUpRight size={15} className="nudge" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {settings.avatar_url ? (
              <div className="hero__portrait">
                <Image src={settings.avatar_url} alt={`Portrait of ${settings.full_name}`} fill sizes="(max-width: 48rem) 8rem, 19rem" priority />
              </div>
            ) : null}

            <div className="hero__right">
              <p className="hero__hi">Hi, I&apos;m {firstName}</p>
              {settings.intro ? <p className="hero__intro">{settings.intro}</p> : null}
              {settings.now_text ? (
                <p className="hero__now">
                  <span className="live-dot" aria-hidden="true" />
                  <span>{settings.now_text}</span>
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Organisations, statement, screenshots */}
        <section className="section" aria-label="Where I've worked and studied">
          {orgs.length ? <Orgs names={orgs} label="Worked, studied and taught at" /> : null}
          {settings.statement ? (
            <p className="statement" data-reveal style={{ marginTop: "clamp(3rem, 7vw, 5rem)" }}>
              {settings.statement}
            </p>
          ) : null}
          {shots.length >= 3 ? (
            <div data-reveal style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}>
              <Gallery shots={shots} />
            </div>
          ) : null}
        </section>

        {/* Work */}
        <section id="work" className="section" aria-labelledby="work-title">
          <div className="section-head" data-reveal>
            <h2 id="work-title" className="title-xl">
              Works.
            </h2>
            <Link className="text-link" href="/projects">
              All projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div data-reveal>
            <Works items={featuredFirst.map(toWorkItem)} initialView="showcase" showcaseLimit={3} />
          </div>
        </section>

        {/* Research */}
        <section id="research" className="section" aria-labelledby="research-title">
          <div className="section-head" data-reveal>
            <div>
              <h2 id="research-title" className="title-xl">
                Research.
              </h2>
              {settings.research_intro ? <p className="lede">{settings.research_intro}</p> : null}
            </div>
            <Link className="text-link" href="/research">
              Interests and papers <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <ul className="cards">
            {publications.slice(0, 3).map((p, i) => (
              <li key={p.id} className="paper" data-reveal style={{ ["--i" as string]: i }}>
                <MediaTile alt="" title={p.venue || p.status || "Manuscript"} kicker={p.year ? String(p.year) : undefined} strip={i === 0} />
                <h3>{p.title}</h3>
                <p>{p.authors}</p>
                <div className="paper__foot">
                  {p.status ? <span className="status">{p.status}</span> : <span />}
                  {p.url || p.doi ? (
                    <a className="pill pill--sm" href={p.url || `https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                      Read it <ArrowUpRight size={14} className="nudge" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Writing */}
        <section id="writing" className="section" aria-labelledby="writing-title">
          <div className="section-head" data-reveal>
            <div>
              <h2 id="writing-title" className="title-xl">
                Writing.
              </h2>
              {settings.writing_intro ? <p className="lede">{settings.writing_intro}</p> : null}
            </div>
            {posts.length ? (
              <Link className="text-link" href="/writing">
                All posts <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          {posts.length ? (
            <ul className="posts">
              {posts.map((post, i) => (
                <li key={post.id} className="post-row" data-reveal style={{ ["--i" as string]: i }}>
                  <time className="mono" dateTime={post.published_at ?? undefined}>
                    {formatDate(post.published_at)}
                  </time>
                  <div>
                    <h3>
                      <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                  </div>
                  <span className="mono" style={{ display: "inline-flex", gap: "0.75rem", alignItems: "center" }}>
                    {readingMinutes(post.body)} min
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-card" data-reveal>
              <span>The first post is on its way. Meanwhile, the research page has what I&apos;m working on.</span>
              <Link className="pill pill--sm" href="/research">
                See research <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>

        {/* About */}
        <section id="about" className="section" aria-labelledby="about-title">
          <div className="about">
            <div data-reveal>
              <p className="eyebrow">About me</p>
              <h2 id="about-title" className="about__headline">
                {settings.about_headline || settings.full_name}
              </h2>
              {bioLead ? <Markdown>{bioLead}</Markdown> : null}
              <div className="about__actions">
                <Link className="pill pill--dark" href="/cv">
                  <DotsMark /> Read my full CV
                </Link>
                <Link className="pill" href="/contact">
                  Get in touch
                </Link>
              </div>
            </div>
            {settings.avatar_url ? (
              <div className="about__photo" data-reveal style={{ ["--i" as string]: 1 }}>
                <Image src={settings.avatar_url} alt="" width={500} height={625} sizes="(max-width: 48rem) 14rem, 22rem" />
              </div>
            ) : null}
          </div>
        </section>

        {/* Journey */}
        <section id="journey" className="section" aria-labelledby="journey-title">
          <div className="section-head" data-reveal>
            <h2 id="journey-title" className="title-xl">
              Journey.
            </h2>
            <Link className="text-link" href="/cv">
              Full CV <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div data-reveal>
            <Journey experiences={experiences} education={education} />
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="section" aria-labelledby="stack-title">
          <div className="section-head" data-reveal>
            <h2 id="stack-title" className="title-xl">
              My Stack.
            </h2>
          </div>
          <div data-reveal>
            <Stack groups={skills} />
          </div>
          <div data-reveal>
            <SkillGraph groups={skills.map((g) => ({ name: g.name, items: g.items }))} />
          </div>
        </section>
      </div>

      {settings.quote_text ? (
        <figure className="quote" data-reveal>
          <blockquote>“{settings.quote_text}”</blockquote>
          {settings.quote_author ? <figcaption>— {settings.quote_author}</figcaption> : null}
        </figure>
      ) : null}
      <DotWave />
    </>
  );
}
