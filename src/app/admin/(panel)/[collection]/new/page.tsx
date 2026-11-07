import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordForm } from "@/components/admin/RecordForm";
import { getCollection } from "@/lib/cms/collections";
import { saveRecord } from "../../../actions";

export default async function NewRecordPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: key } = await params;
  const collection = getCollection(key);
  if (!collection) notFound();

  // Sensible starting values: new things are visible, posts start as drafts.
  const initial: Record<string, unknown> = { visible: true, published: collection.key !== "posts", kind: "industry", platform: "website" };

  return (
    <>
      <Link className="crumb" href={`/admin/${collection.key}`}>
        {collection.label}
      </Link>
      <div className="admin-head">
        <h1>New {collection.singular}</h1>
      </div>
      <RecordForm
        sections={[{ fields: collection.fields }]}
        initial={initial}
        action={saveRecord.bind(null, collection.key, null)}
        submitLabel={`Create ${collection.singular}`}
      />
    </>
  );
}
