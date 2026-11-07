"use client";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { slugify } from "@/lib/format";

/** Uploads a file to the public media bucket and returns its public address. */
export async function uploadMedia(file: File): Promise<string> {
  const supabase = createBrowserSupabase();
  const dot = file.name.lastIndexOf(".");
  const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "bin";
  const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "file";
  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const path = `${folder}/${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
