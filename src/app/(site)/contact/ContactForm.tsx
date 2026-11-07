"use client";

import { useActionState, useState } from "react";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  // Controlled so a validation error never wipes what the visitor typed.
  const [v, setV] = useState({ name: "", email: "", subject: "", body: "" });
  const bind = (k: keyof typeof v) => ({ value: v[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [k]: e.target.value })) });

  if (state.status === "sent") {
    return (
      <p className="form__status" data-status="sent" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="form" noValidate>
      <div className="form__row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" {...bind("name")} autoComplete="name" required aria-invalid={!!state.errors?.name} aria-describedby={state.errors?.name ? "name-error" : undefined} />
          {state.errors?.name ? <span id="name-error" className="field__error">{state.errors.name}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" {...bind("email")} type="email" autoComplete="email" required aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? "email-error" : undefined} />
          {state.errors?.email ? <span id="email-error" className="field__error">{state.errors.email}</span> : null}
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" {...bind("subject")} maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="body">Message</label>
        <textarea id="body" name="body" {...bind("body")} required maxLength={5000} aria-invalid={!!state.errors?.body} aria-describedby={state.errors?.body ? "body-error" : undefined} />
        {state.errors?.body ? <span id="body-error" className="field__error">{state.errors.body}</span> : null}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button className="button" type="submit" disabled={pending}>
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
