"use client";

import { useActionState } from "react";
import { changePassword, type FormState } from "../../actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, { status: "idle" } as FormState);
  const errors = state.errors ?? {};
  return (
    <form action={action} className="aform" style={{ maxWidth: "24rem" }} noValidate>
      <div className="afield" data-invalid={!!errors.password}>
        <label htmlFor="password">New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
        <span className="afield__help">At least 10 characters.</span>
        {errors.password ? <span className="afield__error">{errors.password}</span> : null}
      </div>
      <div className="afield" data-invalid={!!errors.confirm}>
        <label htmlFor="confirm">Type it again</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
        {errors.confirm ? <span className="afield__error">{errors.confirm}</span> : null}
      </div>
      <div>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Changing…" : "Change password"}
        </button>
      </div>
      {state.message ? (
        <p className={state.status === "error" ? "afield__error" : "savebar__status"} data-status={state.status} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
