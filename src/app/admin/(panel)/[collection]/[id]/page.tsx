import Link from "next/link";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { RecordForm } from "@/components/admin/RecordForm";
import { requireAdmin } from "@/lib/auth";
import { getCollection } from "@/lib/cms/collections";
import { deleteRecord, saveRecord } from "../../../actions";

function publicHref(key: string, row: Record<string, unknown>) {
  if (key === "posts") return row.published ? `/writing/${row.slug}` : undefined;
  if (key === "projects") return row.published ? `/projects/${row.slug}` : undefined;
  if (key === "publications") return "/research";
  if (key === "links") return "/contact";
  return "/cv";
}

export default async function EditRecordPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { collection: key, id } = await params;
  const { created } = await searchParams;
  const collection = getCollection(key);
  if (!collection) notFound();

  const { supabase } = await requireAdmin();
  const { data } = await supabase.from(collection.table).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as Record<string, unknown>;
  const title = String(row[collection.titleField] || "Untitled");

  return (
    <>
      <Link className="crumb" href={`/admin/${collection.key}`}>
        {collection.label}
      </Link>
      <div className="admin-head">
        <h1>{title.length > 80 ? `${title.slice(0, 80)}…` : title}</h1>
      </div>
      {created ? (
        <p className="flash" data-kind="ok" role="status">
          Created. {collection.key === "posts" && !row.published ? "It's a draft until you tick Published and save." : "It's on the site now."}
        </p>
      ) : null}
      <RecordForm
        sections={[{ fields: collection.fields }]}
        initial={row}
        action={saveRecord.bind(null, collection.key, id)}
        submitLabel="Save changes"
        viewHref={publicHref(collection.key, row)}
        extra={
          <ConfirmButton
            formAction={deleteRecord.bind(null, collection.key, id)}
            question={`Delete “${title}”? This can't be undone.`}
            pendingLabel="Deleting…"
          >
            <Trash size={15} weight="bold" aria-hidden="true" />
            Delete
          </ConfirmButton>
        }
      />
    </>
  );
}
