import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { MediaTile } from "@/components/MediaTile";
import { getPublications, getSettings } from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Research", description: s.research_intro || undefined };
}

/** "Authors. Venue. Year." without doubling the full stop after initials. */
function citation(...parts: (string | number | null)[]) {
  const clean = parts.filter(Boolean).map((p) => String(p).trim().replace(/\.+$/, ""));
  return clean.length ? `${clean.join(". ")}.` : "";
}

export default async function ResearchPage() {
  const [settings, publications] = await Promise.all([getSettings(), getPublications()]);
  return (
    <div className="frame">
      <header className="page-head" data-reveal>
        <h1 className="title-xl">Research.</h1>
        {settings.research_intro ? <p className="lede">{settings.research_intro}</p> : null}
        {settings.research_primary.length || settings.research_secondary.length ? (
          <ul className="interests" style={{ marginTop: "2rem" }} aria-label="Research interests">
            {settings.research_primary.map((i) => (
              <li key={i} data-primary="true">
                {i}
              </li>
            ))}
            {settings.research_secondary.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <section className="section" aria-labelledby="pubs">
        <h2 id="pubs" className="title-lg" style={{ marginBottom: "2rem" }} data-reveal>
          Publications and manuscripts
        </h2>
        {publications.length === 0 ? (
          <p className="empty-card">No publications listed yet.</p>
        ) : (
          <ul className="cards">
            {publications.map((p, i) => (
              <li key={p.id} className="paper" data-reveal style={{ ["--i" as string]: i % 3 }}>
                <MediaTile alt="" title={p.venue || p.status || "Manuscript"} kicker={p.year ? String(p.year) : undefined} strip={i === 0} />
                <h3>{p.title}</h3>
                <p>{citation(p.authors, p.venue, p.year)}</p>
                {p.summary ? <p style={{ color: "var(--ink-2)" }}>{p.summary}</p> : null}
                <div className="paper__foot">
                  {p.status ? <span className="status">{p.status}</span> : <span />}
                  {p.url || p.doi ? (
                    <a className="pill pill--sm" href={p.url || `https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                      {p.doi ? "Read via DOI" : "Read it"} <ArrowUpRight size={14} className="nudge" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
