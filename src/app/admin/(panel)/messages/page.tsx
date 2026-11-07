import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/auth";
import type { Message } from "@/lib/types";
import { deleteMessage, setMessageRead } from "../../actions";

const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Messages</h1>
          <p>What people send from the Contact page. Reply by email; it opens your mail app with their address filled in.</p>
        </div>
      </div>
      {messages.length === 0 ? (
        <div className="admin-empty">
          <p>No messages yet.</p>
        </div>
      ) : (
        <ul className="rows">
          {messages.map((m) => (
            <li key={m.id} className="message" data-unread={!m.is_read}>
              <div className="message__head">
                <span className="message__from">
                  {m.name} <span className="row__sub" style={{ display: "inline" }}>&lt;{m.email}&gt;</span>
                </span>
                <time className="row__sub" dateTime={m.created_at}>
                  {when.format(new Date(m.created_at))}
                </time>
              </div>
              {m.subject ? <p style={{ fontWeight: 600, marginTop: "0.375rem" }}>{m.subject}</p> : null}
              <p className="message__body">{m.body}</p>
              <div className="message__tools">
                <a
                  className="button button--small"
                  href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "your message"}`)}`}
                >
                  Reply by email
                </a>
                <form action={setMessageRead.bind(null, m.id, !m.is_read)}>
                  <button className="button button--quiet button--small" type="submit">
                    {m.is_read ? "Mark as unread" : "Mark as read"}
                  </button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <ConfirmButton question={`Delete the message from ${m.name}?`} pendingLabel="Deleting…">
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
