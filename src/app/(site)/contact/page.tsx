import type { Metadata } from "next";
import { getSettings, getSocialLinks } from "@/lib/data";
import { ContactForm } from "./ContactForm";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: "Contact", description: s.contact_intro || undefined };
}

export default async function ContactPage() {
  const [settings, links] = await Promise.all([getSettings(), getSocialLinks()]);
  return (
    <>
      <header className="page-head">
        <h1>Contact</h1>
        {settings.contact_intro ? <p>{settings.contact_intro}</p> : null}
      </header>
      <div className="contact">
        <section aria-label="Send a message">
          <ContactForm />
        </section>
        <aside className="contact-card" aria-label="Other ways to reach me">
          <dl>
            {settings.email ? (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </dd>
              </div>
            ) : null}
            {settings.show_phone && settings.phone ? (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>{settings.phone}</a>
                </dd>
              </div>
            ) : null}
            {settings.location ? (
              <div>
                <dt>Based in</dt>
                <dd>{settings.location}</dd>
              </div>
            ) : null}
            {links.length ? (
              <div>
                <dt>Elsewhere</dt>
                <dd>
                  <ul>
                    {links.map((l) => (
                      <li key={l.id}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer me">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
          {settings.availability ? <p className="meta" style={{ marginTop: "1rem" }}>{settings.availability}</p> : null}
        </aside>
      </div>
    </>
  );
}
