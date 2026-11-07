import { requireAdmin } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";

export default async function AccountPage() {
  const { user } = await requireAdmin();
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Account</h1>
          <p>Signed in as {user.email}.</p>
        </div>
      </div>
      <section className="admin-section" style={{ marginTop: 0 }}>
        <h2>Change password</h2>
        <PasswordForm />
      </section>
    </>
  );
}
