import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/auth";
import { deleteMedia } from "../../actions";
import { CopyButton, MediaUploader } from "./MediaLibrary";

type Entry = { path: string; name: string; url: string; isImage: boolean; size: number };

export default async function MediaPage() {
  const { supabase } = await requireAdmin();
  const bucket = supabase.storage.from("media");

  // Files are stored in year/month folders.
  const entries: Entry[] = [];
  const { data: years } = await bucket.list("", { limit: 100, sortBy: { column: "name", order: "desc" } });
  for (const y of years ?? []) {
    if (y.id) continue; // a file at the root, not a folder
    const { data: months } = await bucket.list(y.name, { limit: 12, sortBy: { column: "name", order: "desc" } });
    for (const m of months ?? []) {
      const { data: files } = await bucket.list(`${y.name}/${m.name}`, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
      for (const f of files ?? []) {
        if (!f.id || f.name === ".emptyFolderPlaceholder") continue;
        const path = `${y.name}/${m.name}/${f.name}`;
        entries.push({
          path,
          name: f.name,
          url: bucket.getPublicUrl(path).data.publicUrl,
          isImage: /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(f.name),
          size: Number(f.metadata?.size ?? 0),
        });
      }
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Media library</h1>
          <p>Images and files you&apos;ve uploaded. Copy a link to use it anywhere, or upload from any image field.</p>
        </div>
      </div>
      <MediaUploader />
      {entries.length === 0 ? (
        <p className="afield__help" style={{ marginTop: "1.5rem" }}>Nothing uploaded yet.</p>
      ) : (
        <ul className="media-grid">
          {entries.map((e) => (
            <li key={e.path}>
              <div className="media-grid__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {e.isImage ? <img src={e.url} alt="" loading="lazy" /> : <span>{e.name.split(".").pop()?.toUpperCase()}</span>}
              </div>
              <div className="media-grid__info">
                <span className="media-grid__name" title={e.name}>
                  {e.name}
                </span>
                <span className="row__sub">{(e.size / 1024).toFixed(0)} KB</span>
                <div className="media-grid__tools">
                  <CopyButton text={e.url} />
                  <form action={deleteMedia.bind(null, e.path)}>
                    <ConfirmButton question={`Delete ${e.name}? Pages that use it will show a broken image.`} pendingLabel="…">
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
