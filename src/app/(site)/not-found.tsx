import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="notice" data-reveal>
      <p className="notice__code" aria-hidden="true">404</p>
      <h1>This page doesn&apos;t exist</h1>
      <p>The link may be old, or the post may have moved. Everything I&apos;ve published is on the writing and projects pages.</p>
      <p>
        <Link className="button" href="/writing">
          Browse writing
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </Link>{" "}
        <Link className="button button--quiet" href="/projects">
          Browse projects
        </Link>
      </p>
    </div>
  );
}
