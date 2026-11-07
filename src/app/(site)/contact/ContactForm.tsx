"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };
type Key = "name" | "email" | "subject" | "body";

function check(k: Key, value: string): string | undefined {
  const v = value.trim();
  if (k === "name" && !v) return "Enter your name.";
  if (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter an email address I can reply to.";
  if (k === "body" && !v) return "Write a message.";
  return undefined;
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  // Controlled so a validation error never wipes what the visitor typed.
  const [v, setV] = useState({ name: "", email: "", subject: "", body: "" });
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Errors appear once a field has been left, not while typing; the server's answer wins after a submit.
  const errorFor = (k: Key) => (touched[k] ? check(k, v[k]) : undefined) ?? state.errors?.[k as "name" | "email" | "body"];

  useEffect(() => {
    if (state.status === "sent") successRef.current?.focus();
    if (state.status === "error" && state.errors) {
      const first = (["name", "email", "body"] as const).find((k) => state.errors?.[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
    }
  }, [state]);

  if (state.status === "sent") {
    return (
      <div className="sent" ref={successRef} tabIndex={-1} role="status">
        <svg className="sent__check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27l7 7 15-16" />
        </svg>
        <div>
          <p className="sent__title">Message sent</p>
          <p className="meta">I&apos;ll reply to {v.email || "the address you gave"}.</p>
        </div>
      </div>
    );
  }

  const field = (k: Key) => ({
    id: k,
    name: k,
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [k]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    "aria-invalid": !!errorFor(k),
    "aria-describedby": errorFor(k) ? `${k}-error` : undefined,
  });

  return (
    <form ref={formRef} action={action} className="form" noValidate>
      <div className="form__row">
        <div className="field" data-invalid={!!errorFor("name")}>
          <label htmlFor="name">
            Name <span aria-hidden="true">*</span>
          </label>
          <input {...field("name")} autoComplete="name" required />
          {errorFor("name") ? <span id="name-error" className="field__error">{errorFor("name")}</span> : null}
        </div>
        <div className="field" data-invalid={!!errorFor("email")}>
          <label htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input {...field("email")} type="email" inputMode="email" autoComplete="email" required />
          {errorFor("email") ? <span id="email-error" className="field__error">{errorFor("email")}</span> : null}
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input {...field("subject")} maxLength={200} />
      </div>
      <div className="field" data-invalid={!!errorFor("body")}>
        <label htmlFor="body">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea {...field("body")} required maxLength={5000} />
        <span className="field__count meta" aria-live="off">
          {v.body.length.toLocaleString()} / 5,000
        </span>
        {errorFor("body") ? <span id="body-error" className="field__error">{errorFor("body")}</span> : null}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button className="button" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? <span className="spinner" aria-hidden="true" /> : <PaperPlaneTilt size={17} weight="bold" aria-hidden="true" />}
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
      {state.status === "error" && state.message ? (
        <p className="form__status" data-status="error" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
