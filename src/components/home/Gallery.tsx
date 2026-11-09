import Image from "next/image";
import Link from "next/link";

/** A framed column of screenshots that scrolls itself; pauses when pointed at or focused. */
export function Gallery({ shots }: { shots: { slug: string; title: string; src: string }[] }) {
  if (shots.length < 3) return null;
  const doubled = [...shots, ...shots];
  return (
    <div className="gallery">
      <div className="gallery__track">
        {doubled.map((s, i) => {
          const hidden = i >= shots.length;
          return (
            <Link
              key={`${s.slug}-${i}`}
              href={`/projects/${s.slug}`}
              className="gallery__item"
              aria-label={hidden ? undefined : `${s.title} project`}
              aria-hidden={hidden || undefined}
              tabIndex={hidden ? -1 : undefined}
            >
              <Image src={s.src} alt="" width={600} height={450} sizes="(max-width: 48rem) 50vw, 24rem" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
