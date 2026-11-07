import Link from "next/link";
import { ArrowSquareOut, SignOut, UserCircle } from "@phosphor-icons/react/dist/ssr";
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
        { href: "/admin", label: "Overview", icon: "overview" as const },
        { href: "/admin/settings", label: "Pages & profile", icon: "settings" as const },
        { href: "/admin/messages", label: "Messages", icon: "messages" as const, count: unread ?? 0 },
        { href: "/admin/media", label: "Media library", icon: "media" as const },
      ],
    },
    {
      title: "Writing and work",
      items: (["posts", "projects", "publications"] as const).map((k) => ({ href: `/admin/${k}`, label: byKey[k].label, icon: k })),
    },
    {
      title: "CV",
      items: (["experience", "education", "skills", "certifications", "testimonials", "links"] as const).map((k) => ({
        href: `/admin/${k}`,
        label: byKey[k].label,
        icon: k,
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
            <ArrowSquareOut size={16} aria-hidden="true" />
            View site
          </Link>
          <Link href="/admin/account">
            <UserCircle size={16} aria-hidden="true" />
            Account
          </Link>
          <form action={signOut}>
            <button type="submit" title={user.email ?? undefined}>
              <SignOut size={16} aria-hidden="true" />
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
