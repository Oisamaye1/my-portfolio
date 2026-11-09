/** The small turning ring of dots used on call-to-action pills. Decorative. */
export function DotsMark() {
  const dots = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <span className="dots-mark" aria-hidden="true">
      <span>
        {dots.map((a, i) => (
          <i key={a} style={{ ["--a" as string]: `${a}deg`, ["--o" as string]: String(0.3 + (i / dots.length) * 0.7) }} />
        ))}
      </span>
    </span>
  );
}
