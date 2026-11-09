import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="frame">
      <div className="notice" data-reveal>
        <p className="notice__code" aria-hidden="true">
          404
        </p>
        <h1 className="title-lg">This page doesn&apos;t exist.</h1>
        <p>The link may be old, or the page may have moved. Everything I&apos;ve published is on the work and writing pages.</p>
        <div className="notice__actions">
          <Link className="pill pill--dark" href="/projects">
            Browse work <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link className="pill" href="/writing">
            Browse writing
          </Link>
        </div>
      </div>
    </div>
  );
}
