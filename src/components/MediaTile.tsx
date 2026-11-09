import Image from "next/image";
import { TrafficStrip } from "./TrafficStrip";

type Props = {
  src?: string;
  alt: string;
  title: string;
  kicker?: string;
  /** Show the network-traffic illustration instead of a plain tile. */
  strip?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * The visual for a project or paper. Uses its screenshot when there is one, otherwise a dark
 * tile with the title, so cards line up whether or not an image exists.
 */
export function MediaTile({ src, alt, title, kicker, strip, sizes = "(max-width: 48rem) 100vw, 33vw", priority, className = "" }: Props) {
  return (
    <div className={`media ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      ) : (
        <div className="tile" aria-hidden="true">
          <span className="tile__kicker">{kicker}</span>
          {strip ? <TrafficStrip decorative /> : null}
          <span className="tile__title">{title}</span>
        </div>
      )}
    </div>
  );
}
