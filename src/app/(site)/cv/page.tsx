import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { DotsMark } from "@/components/DotsMark";
import { Markdown } from "@/components/Markdown";
import { Journey } from "@/components/home/Journey";
import { Stack } from "@/components/home/Stack";
import {
  getCertifications,
  getEducation,
  getExperiences,
  getSettings,
  getSkillGroups,
  getTestimonials,
} from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "About", description: s.cv_intro || undefined };
}

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
    <div className="frame">
      <section className="page-head about" aria-labelledby="about-title">
        <div data-reveal>
          <p className="eyebrow">About me</p>
          <h1 id="about-title" className="about__headline" style={{ fontSize: "clamp(1.9rem, 1.3rem + 2.2vw, 3rem)" }}>
            {settings.about_headline || settings.full_name}
          </h1>
          {settings.bio ? <Markdown>{settings.bio}</Markdown> : null}
          <div className="about__actions">
            {settings.resume_url ? (
              <a className="pill pill--dark" href={settings.resume_url} target="_blank" rel="noopener noreferrer">
                <DownloadSimple size={16} aria-hidden="true" /> Download CV (PDF)
              </a>
            ) : (
              <Link className="pill pill--dark" href="/contact">
                <DotsMark /> Get in touch
              </Link>
            )}
            {settings.email ? (
              <a className="pill" href={`mailto:${settings.email}`}>
                <EnvelopeSimple size={16} aria-hidden="true" /> {settings.email}
              </a>
            ) : null}
          </div>
        </div>
        {settings.avatar_url ? (
          <div className="about__photo" data-reveal style={{ ["--i" as string]: 1, position: "sticky", top: "6rem" }}>
            <Image src={settings.avatar_url} alt={`Portrait of ${settings.full_name}`} width={500} height={625} sizes="(max-width: 48rem) 14rem, 22rem" priority />
          </div>
        ) : null}
      </section>

      {experiences.length || education.length ? (
        <section className="section" aria-labelledby="journey-title">
          <div className="section-head" data-reveal>
            <div>
              <h2 id="journey-title" className="title-xl">
                Journey.
              </h2>
              {settings.cv_intro ? <p className="lede">{settings.cv_intro}</p> : null}
            </div>
          </div>
          <div data-reveal>
            <Journey experiences={experiences} education={education} detailed />
          </div>
        </section>
      ) : null}

      {skills.length ? (
        <section className="section" aria-labelledby="stack-title">
          <div className="section-head" data-reveal>
            <h2 id="stack-title" className="title-xl">
              My Stack.
            </h2>
          </div>
          <div data-reveal>
            <Stack groups={skills} />
          </div>
          <dl className="skills-list" data-reveal>
            {skills.map((g) => (
              <div key={g.id}>
                <dt>{g.name}</dt>
                <dd>
                  {g.items.map((it) => (
                    <span key={it} className="chip">
                      {it}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {certifications.length ? (
        <section className="section" aria-labelledby="cert-title">
          <h2 id="cert-title" className="title-lg" style={{ marginBottom: "1.5rem" }} data-reveal>
            Certifications
          </h2>
          <table className="journey" data-reveal>
            <caption className="sr-only">Certifications</caption>
            <tbody>
              {certifications.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    {c.url ? (
                      <a className="text-link" href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </th>
                  <td className="org">{c.issuer}</td>
                  <td className="when">{c.year ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="section" aria-labelledby="voices-title">
          <h2 id="voices-title" className="title-lg" style={{ marginBottom: "1.5rem" }} data-reveal>
            What people say
          </h2>
          <ul className="voices">
            {testimonials.map((t, i) => (
              <li key={t.id} data-reveal style={{ ["--i" as string]: i }}>
                <figure style={{ margin: 0 }}>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <b>{t.author}</b>
                    {t.role || t.organization ? `, ${[t.role, t.organization].filter(Boolean).join(", ")}` : ""}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
