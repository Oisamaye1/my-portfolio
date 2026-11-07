import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import type { Message, Post } from "@/lib/types";

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();
  const [posts, projects, pubs, unread, recentMessages, drafts] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("publications").select("id", { count: "exact", head: true }),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(3),
    supabase.from("posts").select("id,title,updated_at").eq("published", false).order("updated_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { href: "/admin/posts", n: posts.count ?? 0, label: "published posts" },
    { href: "/admin/projects", n: projects.count ?? 0, label: "projects" },
    { href: "/admin/publications", n: pubs.count ?? 0, label: "publications" },
    { href: "/admin/messages", n: unread.count ?? 0, label: "unread messages" },
  ];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Overview</h1>
          <p>Everything on the site is edited from here. Saved changes go live straight away.</p>
        </div>
      </div>

      <div className="quick">
        <Link className="button" href="/admin/posts/new">
          Write a post
        </Link>
        <Link className="button button--quiet" href="/admin/projects/new">
          Add a project
        </Link>
        <Link className="button button--quiet" href="/admin/settings">
          Edit home page text
        </Link>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <Link key={s.href} href={s.href}>
            <strong>{s.n}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      <section className="admin-section">
        <h2>Drafts</h2>
        {(drafts.data as Pick<Post, "id" | "title" | "updated_at">[] | null)?.length ? (
          <ul className="rows">
            {(drafts.data as Pick<Post, "id" | "title" | "updated_at">[]).map((d) => (
              <li key={d.id} className="row">
                <div>
                  <Link className="row__title" href={`/admin/posts/${d.id}`}>
                    {d.title}
                  </Link>
                  <div className="row__sub">Last edited {formatDate(d.updated_at)}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="afield__help">No drafts. Posts you start but don&apos;t publish appear here.</p>
        )}
      </section>

      <section className="admin-section">
        <h2>Latest messages</h2>
        {(recentMessages.data as Message[] | null)?.length ? (
          <ul className="rows">
            {(recentMessages.data as Message[]).map((m) => (
              <li key={m.id} className="row">
                <div>
                  <Link className="row__title" href="/admin/messages">
                    {m.subject || `Message from ${m.name}`}
                  </Link>
                  <div className="row__sub">
                    {m.name}, {formatDate(m.created_at)}
                    {!m.is_read ? <span className="badge badge--live">New</span> : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="afield__help">No messages yet. Messages sent from the Contact page appear here.</p>
        )}
      </section>
    </>
  );
}
