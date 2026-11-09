/** Organisations as dark discs that drift past. Hover a disc for its full name. */

const STOP = new Set(["of", "the", "and", "in", "for", "at", "&", "education", "english"]);

function initials(name: string) {
  const words = name
    .replace(/\(.*?\)/g, "")
    .split(/[\s,-]+/)
    .filter((w) => w && !STOP.has(w.toLowerCase()));
  if (words.length === 1) return words[0];
  return words
    .slice(0, 4)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Orgs({ names, label }: { names: string[]; label: string }) {
  const sizes = ["6.5rem", "5.25rem", "6rem", "4.75rem", "5.75rem", "5rem"];
  const discs = (hidden: boolean) =>
    names.map((n, i) => (
      <span
        key={`${hidden ? "b" : "a"}-${n}`}
        className="org-disc"
        style={{ ["--s" as string]: sizes[i % sizes.length], ["--k" as string]: String(Math.min(0.26, 1.45 / initials(n).length)) }}
        title={n}
        aria-hidden={hidden || undefined}
      >
        <span aria-hidden="true">{initials(n)}</span>
        <small>{n}</small>
        {hidden ? null : <span className="sr-only">{n}</span>}
      </span>
    ));
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="marquee">
        <div className="marquee__track">
          {discs(false)}
          {discs(true)}
        </div>
      </div>
    </div>
  );
}
