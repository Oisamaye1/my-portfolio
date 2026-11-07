import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";

/** Returns a session client for a signed-in admin, or sends the visitor to the sign-in page. */
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");

  return { supabase, user };
}
