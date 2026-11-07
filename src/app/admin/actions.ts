"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCollection, settingsFields } from "@/lib/cms/collections";
import { parseFields } from "@/lib/cms/parse";
import { createSessionClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "saved" | "error";
  message?: string;
  errors?: Record<string, string>;
};

function refreshSite() {
  // Every public page reads from the database, so refresh them all after any change.
  revalidatePath("/", "layout");
}

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { status: "error", message: "Enter your email and password." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: "That email and password don't match an admin account." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { status: "error", message: "This account can't edit the site." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 10) return { status: "error", errors: { password: "Use at least 10 characters." } };
  if (password !== confirm) return { status: "error", errors: { confirm: "The two passwords don't match." } };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };
  return { status: "saved", message: "Password changed." };
}

export async function saveRecord(
  collectionKey: string,
  id: string | null,
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const collection = getCollection(collectionKey);
  if (!collection) return { status: "error", message: "Unknown content type." };

  const parsed = parseFields(collection.fields, form);
  if (!parsed.ok) return { status: "error", message: "Fix the highlighted fields.", errors: parsed.errors };
  const values = parsed.values;

  // Publishing a post without a date stamps it with the current time.
  if (collection.table === "posts" && values.published && !values.published_at) {
    values.published_at = new Date().toISOString();
  }

  let savedId = id;
  if (id) {
    const { error } = await supabase.from(collection.table).update(values).eq("id", id);
    if (error) return dbError(error);
  } else {
    if (collection.sortable) {
      const { data: last } = await supabase
        .from(collection.table)
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      values.sort_order = ((last?.sort_order as number | undefined) ?? 0) + 1;
    }
    const { data, error } = await supabase.from(collection.table).insert(values).select("id").single();
    if (error) return dbError(error);
    savedId = data.id as string;
  }

  refreshSite();
  if (!id) redirect(`/admin/${collection.key}/${savedId}?created=1`);
  return { status: "saved", message: "Saved. The site is updated." };
}

function dbError(error: { code?: string; message: string }): FormState {
  if (error.code === "23505") {
    return { status: "error", message: "That web address is already used.", errors: { slug: "Choose a different web address." } };
  }
  return { status: "error", message: `The database refused the change: ${error.message}` };
}

export async function deleteRecord(collectionKey: string, id: string) {
  const { supabase } = await requireAdmin();
  const collection = getCollection(collectionKey);
  if (!collection) throw new Error("Unknown content type.");
  const { error } = await supabase.from(collection.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect(`/admin/${collection.key}?deleted=1`);
}

export async function moveRecord(collectionKey: string, id: string, direction: "up" | "down") {
  const { supabase } = await requireAdmin();
  const collection = getCollection(collectionKey);
  if (!collection?.sortable) return;

  const { data: rows, error } = await supabase
    .from(collection.table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error || !rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= rows.length) return;

  // Renumber everything so ties and gaps can't make the order ambiguous.
  const ordered = [...rows];
  [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];
  await Promise.all(
    ordered.map((row, i) =>
      row.sort_order === i + 1
        ? null
        : supabase.from(collection.table).update({ sort_order: i + 1 }).eq("id", row.id),
    ),
  );
  refreshSite();
  revalidatePath(`/admin/${collection.key}`);
}

export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = parseFields(settingsFields, form);
  if (!parsed.ok) return { status: "error", message: "Fix the highlighted fields.", errors: parsed.errors };
  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...parsed.values });
  if (error) return dbError(error);
  refreshSite();
  return { status: "saved", message: "Saved. The site is updated." };
}

export async function setMessageRead(id: string, isRead: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMedia(path: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}
