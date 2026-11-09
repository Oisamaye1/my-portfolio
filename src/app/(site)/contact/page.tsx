import type { Metadata } from "next";
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { SocialIcon } from "@/components/SocialIcon";
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
    <div className="frame">
      <header className="page-head" data-reveal>
        <h1 className="title-xl">Get in touch.</h1>
        {settings.contact_intro ? <p className="lede">{settings.contact_intro}</p> : null}
      </header>
      <section className="section contact" style={{ paddingTop: 0 }}>
        <div data-reveal>
          <ContactForm />
        </div>
        <aside aria-label="Other ways to reach me" data-reveal style={{ ["--i" as string]: 1 }}>
          <ul className="contact-list">
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`}>
                  <span>
                    <EnvelopeSimple size={18} aria-hidden="true" /> Email
                  </span>
                  <small>{settings.email}</small>
                </a>
              </li>
            ) : null}
            {settings.show_phone && settings.phone ? (
              <li>
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>
                  <span>
                    <Phone size={18} aria-hidden="true" /> Phone
                  </span>
                  <small>{settings.phone}</small>
                </a>
              </li>
            ) : null}
            {settings.location ? (
              <li>
                <div>
                  <span>
                    <MapPin size={18} aria-hidden="true" /> Based in
                  </span>
                  <small>{settings.location}</small>
                </div>
              </li>
            ) : null}
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="noopener noreferrer me">
                  <span>
                    <SocialIcon platform={l.platform} /> {l.label}
                  </span>
                  <ArrowUpRight size={16} className="go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          {settings.availability ? (
            <p className="hero__now" style={{ marginTop: "1.5rem" }}>
              <span className="live-dot" aria-hidden="true" />
              <span>{settings.availability}</span>
            </p>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
