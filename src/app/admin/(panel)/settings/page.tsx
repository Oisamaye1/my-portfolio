import { RecordForm } from "@/components/admin/RecordForm";
import { requireAdmin } from "@/lib/auth";
import { settingsSections } from "@/lib/cms/collections";
import { saveSettings } from "../../actions";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const row = (data ?? {}) as Record<string, unknown>;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Pages & profile</h1>
          <p>Your name, photo, contact details and the text on each page.</p>
        </div>
      </div>
      <RecordForm
        sections={settingsSections}
        initial={row}
        action={saveSettings}
        submitLabel="Save changes"
        viewHref="/"
      />
    </>
  );
}
