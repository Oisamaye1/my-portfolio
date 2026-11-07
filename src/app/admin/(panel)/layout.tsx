import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { requireAdmin } from "@/lib/auth";
import { collections } from "@/lib/cms/collections";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const { count: unread } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  const byKey = Object.fromEntries(collections.map((c) => [c.key, c]));
  const groups = [
    {
      title: "Site",
      items: [
        { href: "/admin", label: "Overview" },
        { href: "/admin/settings", label: "Pages & profile" },
        { href: "/admin/messages", label: "Messages", count: unread ?? 0 },
        { href: "/admin/media", label: "Media library" },
      ],
    },
    {
      title: "Writing and work",
      items: ["posts", "projects", "publications"].map((k) => ({ href: `/admin/${k}`, label: byKey[k].label })),
    },
    {
      title: "CV",
      items: ["experience", "education", "skills", "certifications", "testimonials", "links"].map((k) => ({
        href: `/admin/${k}`,
        label: byKey[k].label,
      })),
    },
  ];

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-side__brand">
          <Link href="/admin">Site admin</Link>
          <ThemeToggle />
        </div>
        <AdminNav groups={groups} />
        <div className="admin-side__foot">
          <Link href="/" target="_blank">
            View site
          </Link>
          <Link href="/admin/account">Account</Link>
          <form action={signOut}>
            <button type="submit" title={user.email ?? undefined}>
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main" id="main">
        {children}
      </main>
    </div>
  );
}
