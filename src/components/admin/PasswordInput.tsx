"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

/** A password field with a show/hide button. Works with password managers and paste. */
export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [shown, setShown] = useState(false);
  return (
    <div className="password">
      <input {...props} type={shown ? "text" : "password"} />
      <button
        type="button"
        className="password__toggle"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
      >
        {shown ? <EyeSlash size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
