/**
 * The home page's signature image: a band of network flows that a detector scans once,
 * flagging a few as attacks. The flows are generated from a fixed seed, so the picture is
 * the same on every render and needs no client JavaScript.
 */

const WIDTH = 1200;
const HEIGHT = 120;
const BASELINE = 92;
const COUNT = 230;

// Attack categories from the UNSW-NB15 dataset, placed so the middle of the strip
// (what a phone shows) always has some.
const FLAGS: { index: number; label: string }[] = [
  { index: 18, label: "Reconnaissance" },
  { index: 62, label: "Fuzzers" },
  { index: 96, label: "DoS" },
  { index: 121, label: "Exploits" },
  { index: 168, label: "Backdoor" },
  { index: 207, label: "Shellcode" },
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Timing matches the CSS: the strip draws in, then the scan line sweeps across.
const SCAN_START = 1.35;
const SCAN_DURATION = 2.6;

export function TrafficStrip() {
  const rand = mulberry32(20231001);
  const step = WIDTH / COUNT;
  const flagged = new Map(FLAGS.map((f) => [f.index, f.label]));

  const ticks: { x: number; h: number; label?: string }[] = [];
  for (let i = 0; i < COUNT; i++) {
    const x = Math.round((i + 0.5) * step * 10) / 10;
    // Mostly short, bursty flows with a long tail, like real packet sizes.
    const r = rand();
    let h = 6 + Math.pow(r, 2.4) * 46;
    if (rand() > 0.93) h += 10;
    const label = flagged.get(i);
    if (label) h = 52 + rand() * 14;
    ticks.push({ x, h: Math.round(h * 10) / 10, label });
  }

  return (
    <svg
      className="strip"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-labelledby="strip-title"
    >
      <title id="strip-title">{`Illustration: a row of network flows, with six flagged as attacks: ${FLAGS.map((f) => f.label).join(", ")}.`}</title>
      <line className="strip__baseline" x1="0" x2={WIDTH} y1={BASELINE + 0.5} y2={BASELINE + 0.5} />
      <g className="strip__ticks">
      {ticks.map((t, i) =>
        t.label ? null : (
          <line key={i} className="strip__tick" x1={t.x} x2={t.x} y1={BASELINE} y2={BASELINE - t.h} />
        ),
      )}
      {ticks.map((t, i) => {
        if (!t.label) return null;
        const delay = SCAN_START + (t.x / WIDTH) * SCAN_DURATION;
        const anchor = t.x < 80 ? "start" : t.x > WIDTH - 80 ? "end" : "middle";
        return (
          <g key={i} className="strip__flag" style={{ ["--d" as string]: `${delay.toFixed(2)}s` }}>
            <line x1={t.x} x2={t.x} y1={BASELINE} y2={BASELINE - t.h} />
            <circle cx={t.x} cy={BASELINE - t.h - 7} r="4.5" />
            <text x={t.x} y={BASELINE + 21} textAnchor={anchor}>
              {t.label}
            </text>
          </g>
        );
      })}
      </g>
      <line className="strip__scan" x1="0" x2="0" y1="4" y2={BASELINE + 4} />
    </svg>
  );
}
