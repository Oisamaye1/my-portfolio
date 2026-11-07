import Link from "next/link";
import { CaretDown, CaretUp, Plus } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCollection } from "@/lib/cms/collections";
import { formatDate } from "@/lib/format";
import { moveRecord } from "../../actions";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { collection: key } = await params;
  const { deleted } = await searchParams;
  const collection = getCollection(key);
  if (!collection) notFound();

  const { supabase } = await requireAdmin();
  let query = supabase.from(collection.table).select("*");
  for (const o of collection.orderBy) query = query.order(o.column, { ascending: o.ascending, nullsFirst: false });
  const { data, error } = await query;
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>{collection.label}</h1>
          <p>{collection.description}</p>
        </div>
        <Link className="button" href={`/admin/${collection.key}/new`}>
          <Plus size={16} weight="bold" aria-hidden="true" />
          Add {collection.singular}
        </Link>
      </div>

      {deleted ? (
        <p className="flash" data-kind="ok" role="status">
          Deleted.
        </p>
      ) : null}
      {error ? (
        <p className="flash" data-kind="error" role="alert">
          Couldn&apos;t load {collection.label.toLowerCase()}: {error.message}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <div className="admin-empty">
          <p>No {collection.label.toLowerCase()} yet.</p>
          <Link className="button" href={`/admin/${collection.key}/new`}>
            Add your first {collection.singular}
          </Link>
        </div>
      ) : (
        <ul className="rows">
          {rows.map((row, i) => {
            const id = String(row.id);
            const visible = collection.visibilityField ? Boolean(row[collection.visibilityField.name]) : true;
            const sub = collection.subtitleField ? row[collection.subtitleField] : null;
            const subText =
              collection.subtitleField === "published_at"
                ? sub
                  ? new Date(String(sub)) > new Date()
                    ? `Scheduled for ${formatDate(String(sub))}`
                    : `Published ${formatDate(String(sub))}`
                  : `Last edited ${formatDate(String(row.updated_at))}`
                : sub
                  ? String(sub)
                  : "";
            return (
              <li key={id} className="row">
                <div style={{ minWidth: 0 }}>
                  <Link className="row__title" href={`/admin/${collection.key}/${id}`}>
                    {String(row[collection.titleField] || "Untitled")}
                  </Link>
                  {collection.visibilityField ? (
                    visible ? (
                      collection.key === "posts" ? <span className="badge badge--live">Live</span> : null
                    ) : (
                      <span className="badge">{collection.visibilityField.offLabel}</span>
                    )
                  ) : null}
                  {subText ? <div className="row__sub">{subText}</div> : null}
                </div>
                {collection.sortable ? (
                  <div className="row__tools">
                    <form action={moveRecord.bind(null, collection.key, id, "up")}>
                      <button className="icon-btn" type="submit" disabled={i === 0} aria-label={`Move ${String(row[collection.titleField])} up`} title="Move up">
                        <CaretUp size={16} weight="bold" aria-hidden="true" />
                      </button>
                    </form>
                    <form action={moveRecord.bind(null, collection.key, id, "down")}>
                      <button className="icon-btn" type="submit" disabled={i === rows.length - 1} aria-label={`Move ${String(row[collection.titleField])} down`} title="Move down">
                        <CaretDown size={16} weight="bold" aria-hidden="true" />
                      </button>
                    </form>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
