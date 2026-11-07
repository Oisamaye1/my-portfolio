"use client";

import { useActionState, useState } from "react";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { signIn, type FormState } from "../actions";

export function LoginForm({ notice }: { notice?: string }) {
  const [state, action, pending] = useActionState(signIn, { status: "idle" } as FormState);
  // Controlled so a failed attempt keeps the email (React resets uncontrolled fields after submit).
  const [email, setEmail] = useState("");
  const message = state.status === "error" ? state.message : notice;
  return (
    <form action={action} noValidate>
      <div className="afield">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="afield">
        <label htmlFor="password">Password</label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </div>
      {message ? (
        <p className="afield__error" role="alert">
          {message}
        </p>
      ) : null}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
