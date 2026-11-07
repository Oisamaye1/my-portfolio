"use client";

import { useFormStatus } from "react-dom";

/**
 * A submit button that asks before doing something that can't be undone.
 * Pass formAction to run a different action from the surrounding form's.
 */
export function ConfirmButton({
  children,
  question,
  className = "button button--danger button--small",
  pendingLabel = "Working…",
  formAction,
}: {
  children: React.ReactNode;
  question: string;
  className?: string;
  pendingLabel?: string;
  formAction?: (form: FormData) => void | Promise<void>;
}) {
  const status = useFormStatus();
  const mine = status.pending && (!formAction || status.action === formAction);
  return (
    <button
      type="submit"
      className={className}
      disabled={status.pending}
      formAction={formAction}
      formNoValidate
      onClick={(e) => {
        if (!window.confirm(question)) e.preventDefault();
      }}
    >
      {mine ? pendingLabel : children}
    </button>
  );
}
