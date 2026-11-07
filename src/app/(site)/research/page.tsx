import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getPublications, getSettings } from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Research", description: s.research_intro || undefined };
}

export default async function ResearchPage() {
  const [settings, publications] = await Promise.all([getSettings(), getPublications()]);

  return (
    <>
      <header className="page-head" data-reveal>
        <h1>Research</h1>
        {settings.research_intro ? <p>{settings.research_intro}</p> : null}
      </header>

      {settings.research_primary.length || settings.research_secondary.length ? (
        <div className="interests" data-reveal>
          {settings.research_primary.length ? (
            <section className="interests--primary" aria-labelledby="primary-interests">
              <h2 id="primary-interests">Focus</h2>
              <ul>
                {settings.research_primary.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {settings.research_secondary.length ? (
            <section aria-labelledby="secondary-interests">
              <h2 id="secondary-interests">Also interested in</h2>
              <ul>
                {settings.research_secondary.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      <section aria-labelledby="pubs-heading">
        <h2 id="pubs-heading" className="subhead" style={{ marginTop: 0 }} data-reveal>
          Publications and manuscripts
        </h2>
        {publications.length === 0 ? (
          <p className="empty">No publications listed yet.</p>
        ) : (
          <ol className="pubs">
            {publications.map((pub, i) => (
              <li key={pub.id} className="pub" data-reveal style={{ ["--i" as string]: i }}>
                <div>
                  <h3>{pub.title}</h3>
                  <p className="pub__cite">
                    {citation(pub.authors, pub.venue, pub.year)}
                  </p>
                  {pub.summary ? <p className="pub__summary">{pub.summary}</p> : null}
                  <p className="pub__foot">
                    {pub.status ? <span className="status">{pub.status}</span> : null}
                    {pub.doi ? (
                      <a className="arrow-link" href={pub.url || `https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                        DOI {pub.doi}
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                      </a>
                    ) : pub.url ? (
                      <a className="arrow-link" href={pub.url} target="_blank" rel="noopener noreferrer">
                        Read it
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                      </a>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="meta" style={{ marginTop: "2.5rem" }}>
        The systems behind these papers are on the <Link href="/projects">projects page</Link>.
      </p>
    </>
  );
}

/** "Authors. Venue. Year." without doubling the full stop after initials. */
function citation(...parts: (string | number | null)[]) {
  const clean = parts.filter(Boolean).map((p) => String(p).trim().replace(/\.+$/, ""));
  return clean.length ? `${clean.join(". ")}.` : "";
}
