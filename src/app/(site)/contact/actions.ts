"use server";

import { createPublicClient } from "@/lib/supabase/public";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "body", string>>;
};

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Bots fill in every field, including this hidden one. Pretend it worked.
  if (String(form.get("website") ?? "")) return { status: "sent", message: "Message sent." };

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const subject = String(form.get("subject") ?? "").trim().slice(0, 200);
  const body = String(form.get("body") ?? "").trim();

  const errors: ContactState["errors"] = {};
  if (!name) errors.name = "Enter your name.";
  else if (name.length > 120) errors.name = "Use 120 characters or fewer.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter an email address I can reply to.";
  if (!body) errors.body = "Write a message.";
  else if (body.length > 5000) errors.body = "Keep the message under 5,000 characters.";
  if (Object.keys(errors).length) return { status: "error", errors };

  const db = createPublicClient();
  const { error } = await db.from("messages").insert({ name, email, subject, body });
  if (error) {
    return { status: "error", message: "The message didn't send. Try again, or email me directly." };
  }
  return { status: "sent", message: "Message sent. I'll reply to the address you gave." };
}
