import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notice">
      <h1>This page doesn&apos;t exist</h1>
      <p>The link may be old, or the post may have moved. Everything I&apos;ve published is on the writing and projects pages.</p>
      <p>
        <Link className="button" href="/writing">
          Browse writing
        </Link>{" "}
        <Link className="button button--quiet" href="/projects">
          Browse projects
        </Link>
      </p>
    </div>
  );
}
