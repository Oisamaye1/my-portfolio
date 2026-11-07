"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FormState } from "@/app/admin/actions";
import type { Field } from "@/lib/cms/collections";
import { slugify } from "@/lib/format";
import { MarkdownEditor } from "./MarkdownEditor";
import { MediaField } from "./MediaField";

type Section = { title?: string; description?: string; fields: Field[] };

type Props = {
  sections: Section[];
  initial: Record<string, unknown>;
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  submitLabel: string;
  viewHref?: string;
  /** Extra controls on the right of the save bar, e.g. a delete button. */
  extra?: ReactNode;
};

type Values = Record<string, string | boolean>;

function toFormValue(field: Field, value: unknown): string | boolean {
  if (field.type === "boolean") return Boolean(value);
  if (value === null || value === undefined) return "";
  if (field.type === "tags" && Array.isArray(value)) return value.join(", ");
  if (field.type === "lines" && Array.isArray(value)) return value.join("\n");
  if (field.type === "datetime" && typeof value === "string") {
    const d = new Date(value);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }
  if (field.type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
}

export function RecordForm({ sections, initial, action, submitLabel, viewHref, extra }: Props) {
  const fields = useMemo(() => sections.flatMap((s) => s.fields), [sections]);
  const start = useMemo(() => {
    const v: Values = {};
    for (const f of fields) v[f.name] = toFormValue(f, initial[f.name]);
    return v;
  }, [fields, initial]);

  const [values, setValues] = useState<Values>(start);
  const [baseline, setBaseline] = useState<Values>(start);
  const [slugTouched, setSlugTouched] = useState(() =>
    Object.fromEntries(fields.filter((f) => f.type === "slug").map((f) => [f.name, Boolean(initial[f.name])])),
  );
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState);

  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(baseline), [values, baseline]);

  useEffect(() => {
    if (state.status === "saved") setBaseline(values);
    // Only react to a new save result, not to every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function set(name: string, value: string | boolean) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Keep generated web addresses in step with the title until someone edits them.
      for (const f of fields) {
        if (f.type === "slug" && f.from === name && !slugTouched[f.name]) {
          next[f.name] = slugify(String(value));
        }
      }
      return next;
    });
  }

  const errors = state.status === "error" ? state.errors ?? {} : {};

  let statusText = dirty ? "Unsaved changes" : "All changes saved";
  if (pending) statusText = "Saving…";
  else if (state.status === "error") statusText = state.message ?? "Fix the highlighted fields.";
  else if (state.status === "saved" && !dirty) statusText = state.message ?? "Saved.";
  const statusKind = pending ? "idle" : state.status === "error" ? "error" : state.status === "saved" && !dirty ? "saved" : "idle";

  return (
    <form action={formAction} className="aform" noValidate>
      {sections.map((section, si) => {
        const grid = (
          <div className="aform__grid">
            {section.fields.map((field) => (
              <FieldControl
                key={field.name}
                field={field}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={(v) => {
                  if (field.type === "slug") setSlugTouched((t) => ({ ...t, [field.name]: true }));
                  set(field.name, v);
                }}
              />
            ))}
          </div>
        );
        return section.title ? (
          <section key={si} className="settings-section" aria-labelledby={`sec-${si}`}>
            <header>
              <h2 id={`sec-${si}`}>{section.title}</h2>
              {section.description ? <p>{section.description}</p> : null}
            </header>
            {grid}
          </section>
        ) : (
          <div key={si}>{grid}</div>
        );
      })}

      <div className="savebar">
        <button type="submit" className="button" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
        <span className="savebar__status" data-status={statusKind} role="status">
          {statusText}
        </span>
        <span className="savebar__spacer" />
        {viewHref ? (
          <Link href={viewHref} target="_blank" className="button button--quiet button--small">
            View on site
          </Link>
        ) : null}
        {extra}
      </div>
    </form>
  );
}

function FieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: string | boolean;
  error?: string;
  onChange: (value: string | boolean) => void;
}) {
  const id = `f-${field.name}`;
  const helpId = field.help ? `${id}-help` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(" ") || undefined;
  const full = !field.half;
  const str = typeof value === "string" ? value : "";

  let control: ReactNode;
  switch (field.type) {
    case "boolean":
      return (
        <div className={`afield${full ? " afield--full" : ""}`}>
          <label className="check" htmlFor={id}>
            <input id={id} type="checkbox" name={field.name} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} aria-describedby={describedBy} />
            {field.label}
          </label>
          {field.help ? <span id={helpId} className="afield__help">{field.help}</span> : null}
        </div>
      );
    case "markdown":
      control = <MarkdownEditor id={id} name={field.name} value={str} rows={field.rows} onChange={onChange} invalid={!!error} describedBy={describedBy} />;
      break;
    case "image":
    case "file":
      control = <MediaField id={id} name={field.name} value={str} kind={field.type} onChange={onChange} describedBy={describedBy} />;
      break;
    case "textarea":
    case "lines":
      control = (
        <textarea id={id} name={field.name} rows={field.rows ?? 3} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} />
      );
      break;
    case "select":
      control = (
        <select id={id} name={field.name} value={str} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "slug":
      control = (
        <div className="slug-input">
          <span aria-hidden="true">/</span>
          <input id={id} type="text" name={field.name} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} />
        </div>
      );
      break;
    default: {
      const type =
        field.type === "url" ? "url" : field.type === "email" ? "email" : field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";
      control = (
        <input id={id} type={type} name={field.name} value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} />
      );
    }
  }

  return (
    <div className={`afield${full ? " afield--full" : ""}`} data-invalid={!!error}>
      <label htmlFor={id}>
        {field.label}
        {field.required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {control}
      {field.help ? <span id={helpId} className="afield__help">{field.help}</span> : null}
      {error ? <span id={errId} className="afield__error">{error}</span> : null}
    </div>
  );
}
