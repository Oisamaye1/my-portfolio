import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { dateRange, yearRange } from "@/lib/format";
import type { Education, Experience } from "@/lib/types";

const KIND = { research: "Research", teaching: "Teaching", industry: "Industry" } as const;

/** Roles and qualifications as a compact table; each row opens to show its details. */
export function Journey({ experiences, education, detailed = false }: { experiences: Experience[]; education: Education[]; detailed?: boolean }) {
  return (
    <table className="journey">
      <caption className="sr-only">Roles and education</caption>
      <thead>
        <tr>
          <th scope="col">Role</th>
          <th scope="col">Organisation</th>
          <th scope="col">Location</th>
          <th scope="col" style={{ textAlign: "right" }}>
            Years
          </th>
        </tr>
      </thead>
      <tbody>
        {experiences.map((r) => (
          <tr key={r.id}>
            <th scope="row">
              {r.role}
              <span className="kind">{KIND[r.kind]}</span>
              {detailed && (r.summary || r.highlights.length) ? (
                <details>
                  <summary>
                    <CaretRight size={12} aria-hidden="true" /> Details
                  </summary>
                  <ul>
                    {r.summary ? <li>{r.summary}</li> : null}
                    {r.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </th>
            <td className="org">{r.organization}</td>
            <td className="place">{r.location}</td>
            <td className="when">{dateRange(r.start_date, r.end_date, r.is_current).replace(/ – /, "–")}</td>
          </tr>
        ))}
        {education.map((e) => (
          <tr key={e.id}>
            <th scope="row">
              {e.degree}
              <span className="kind">Education</span>
              {detailed && (e.thesis || e.highlights.length) ? (
                <details>
                  <summary>
                    <CaretRight size={12} aria-hidden="true" /> Details
                  </summary>
                  <ul>
                    {e.thesis ? <li>Thesis: {e.thesis}</li> : null}
                    {e.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </th>
            <td className="org">{e.institution}</td>
            <td className="place">{e.location}</td>
            <td className="when">{yearRange(e.start_year, e.end_year, e.in_progress).replace(/ – /, "–")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
