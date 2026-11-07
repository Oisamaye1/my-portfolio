import type { Field } from "./collections";
import { slugify } from "../format";

export type ParseResult =
  | { ok: true; values: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

/** Turns submitted form data into column values, using the field definitions. */
export function parseFields(fields: Field[], form: FormData): ParseResult {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const raw = form.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";

    switch (field.type) {
      case "boolean":
        values[field.name] = raw === "on" || raw === "true";
        break;
      case "number": {
        if (!text) {
          values[field.name] = null;
          break;
        }
        const n = Number(text);
        if (!Number.isFinite(n)) errors[field.name] = "Enter a number.";
        else values[field.name] = Math.round(n);
        break;
      }
      case "date":
        values[field.name] = text || null;
        break;
      case "datetime":
        values[field.name] = text ? new Date(text).toISOString() : null;
        break;
      case "tags":
        values[field.name] = text
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "lines":
        values[field.name] = text
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "slug": {
        const source = field.from ? String(form.get(field.from) ?? "") : "";
        values[field.name] = slugify(text || source);
        if (!values[field.name]) errors[field.name] = "Enter a web address using letters, numbers and dashes.";
        break;
      }
      case "url":
        if (text && !/^(https?:\/\/|mailto:|\/)/i.test(text)) {
          errors[field.name] = "Start the address with https://";
        }
        values[field.name] = text;
        break;
      case "email":
        if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) errors[field.name] = "Enter a valid email address.";
        values[field.name] = text;
        break;
      case "markdown":
      case "textarea":
        // Keep the author's line breaks, but drop trailing whitespace.
        values[field.name] = typeof raw === "string" ? raw.replace(/\s+$/, "") : "";
        break;
      default:
        values[field.name] = text;
    }

    if (field.required && !errors[field.name]) {
      const v = values[field.name];
      if (v === "" || v === null || (Array.isArray(v) && v.length === 0)) {
        errors[field.name] = `Enter ${field.label.toLowerCase()}.`;
      }
    }
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}
