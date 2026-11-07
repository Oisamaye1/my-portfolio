import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Markdown } from "@/components/Markdown";
import {
  getCertifications,
  getEducation,
  getExperiences,
  getSettings,
  getSkillGroups,
  getTestimonials,
} from "@/lib/data";
import { dateRange, yearRange } from "@/lib/format";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "CV", description: s.cv_intro || undefined };
}

const KIND_LABEL = { research: "Research", teaching: "Teaching", industry: "Industry" } as const;

export default async function CvPage() {
  const [settings, experiences, education, skills, certifications, testimonials] = await Promise.all([
    getSettings(),
    getExperiences(),
    getEducation(),
    getSkillGroups(),
    getCertifications(),
    getTestimonials(),
  ]);

  return (
    <>
      <header className="page-head" data-reveal>
        <h1>{settings.full_name || "CV"}</h1>
        {settings.cv_intro ? <p>{settings.cv_intro}</p> : null}
      </header>

      <section className="about" aria-label="About me" data-reveal>
        {settings.avatar_url ? (
          <div className="about__portrait">
            <Image src={settings.avatar_url} alt={`Portrait of ${settings.full_name}`} width={448} height={560} sizes="14rem" priority />
          </div>
        ) : (
          <div />
        )}
        <div>
          {settings.bio ? <Markdown>{settings.bio}</Markdown> : null}
          <div className="about__actions">
            {settings.resume_url ? (
              <a className="button" href={settings.resume_url} target="_blank" rel="noopener noreferrer">
                <DownloadSimple size={17} weight="bold" aria-hidden="true" />
                Download CV (PDF)
              </a>
            ) : null}
            <Link className="button button--quiet" href="/contact">
              <EnvelopeSimple size={17} weight="bold" aria-hidden="true" />
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {experiences.length ? (
        <section className="cv-section" aria-labelledby="experience-heading">
          <h2 id="experience-heading" data-reveal>Experience</h2>
          <ol className="timeline">
          {experiences.map((role) => (
            <li key={role.id} className="role" data-current={role.is_current} data-kind={role.kind} data-reveal>
              <p className="role__when">
                {dateRange(role.start_date, role.end_date, role.is_current)}
                <span className="role__kind" data-kind={role.kind}>
                  {KIND_LABEL[role.kind]}
                </span>
              </p>
              <div>
                <h3>{role.role}</h3>
                <p className="role__org">
                  {[role.organization, role.location].filter(Boolean).join(", ")}
                </p>
                {role.summary ? <p className="role__summary">{role.summary}</p> : null}
                {role.highlights.length ? (
                  <ul>
                    {role.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : null}
                {role.tags.length ? (
                  <ul className="tags">
                    {role.tags.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
          </ol>
        </section>
      ) : null}

      {education.length ? (
        <section className="cv-section" aria-labelledby="education-heading">
          <h2 id="education-heading" data-reveal>Education</h2>
          <ol className="timeline">
          {education.map((ed) => (
            <li key={ed.id} className="role" data-current={ed.in_progress} data-kind="education" data-reveal>
              <p className="role__when">{yearRange(ed.start_year, ed.end_year, ed.in_progress)}</p>
              <div>
                <h3>{ed.degree}</h3>
                <p className="role__org">{[ed.institution, ed.location].filter(Boolean).join(", ")}</p>
                {ed.thesis ? <p className="role__thesis">Thesis: {ed.thesis}</p> : null}
                {ed.highlights.length ? (
                  <ul>
                    {ed.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
          </ol>
        </section>
      ) : null}

      {skills.length ? (
        <section className="cv-section" aria-labelledby="skills-heading">
          <h2 id="skills-heading" data-reveal>Skills</h2>
          <dl className="skills">
            {skills.map((group, i) => (
              <div key={group.id} data-reveal style={{ ["--i" as string]: i % 4 }}>
                <dt>{group.name}</dt>
                <dd>
                  <ul className="tags">
                    {group.items.map((item) => (
                      <li key={item} className="tag">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {certifications.length ? (
        <section className="cv-section" aria-labelledby="cert-heading">
          <h2 id="cert-heading" data-reveal>Certifications</h2>
          {certifications.map((c) => (
            <div key={c.id} className="role" data-reveal>
              <p className="role__when">{c.year ?? ""}</p>
              <div>
                <h3>{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a> : c.name}</h3>
                {c.issuer ? <p className="role__org">{c.issuer}</p> : null}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="cv-section" aria-labelledby="quotes-heading">
          <h2 id="quotes-heading" data-reveal>What people say</h2>
          <ul className="quotes">
            {testimonials.map((t, i) => (
              <li key={t.id} data-reveal style={{ ["--i" as string]: i }}>
                <figure style={{ margin: 0 }}>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <strong>{t.author}</strong>
                    {t.role || t.organization ? `, ${[t.role, t.organization].filter(Boolean).join(", ")}` : ""}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
