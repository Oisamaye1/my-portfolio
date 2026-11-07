import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="login">
      <div className="login__card">
        <Link href="/" className="wordmark">
          <span className="wordmark__dot" aria-hidden="true" />
          Site admin
        </Link>
        <h1>Sign in to edit your site</h1>
        <p>Changes you save here go live straight away.</p>
        <LoginForm notice={error === "not-admin" ? "This account can't edit the site." : undefined} />
      </div>
    </main>
  );
}
