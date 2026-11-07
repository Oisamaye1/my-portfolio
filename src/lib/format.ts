const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function formatMonthYear(date: string | null) {
  return date ? monthYear.format(new Date(date)) : "";
}

export function formatDate(date: string | null) {
  return date ? fullDate.format(new Date(date)) : "";
}

export function formatDayMonth(date: string | null) {
  return date ? shortDate.format(new Date(date)) : "";
}

export function yearOf(date: string | null) {
  return date ? new Date(date).getUTCFullYear() : null;
}

export function dateRange(start: string | null, end: string | null, current: boolean) {
  const from = formatMonthYear(start);
  const to = current ? "Present" : formatMonthYear(end);
  if (!from) return to;
  if (!to) return from;
  return `${from} – ${to}`;
}

export function yearRange(start: number | null, end: number | null, inProgress: boolean) {
  const to = inProgress ? "Present" : end ? String(end) : "";
  if (!start) return to;
  if (!to || String(start) === to) return String(start);
  return `${start} – ${to}`;
}

export function readingMinutes(markdown: string) {
  const words = markdown.replace(/[#*_>`\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
