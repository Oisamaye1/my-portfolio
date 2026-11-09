import {
  siBootstrap,
  siC,
  siChakraui,
  siCplusplus,
  siCss,
  siDocker,
  siFigma,
  siFlask,
  siGit,
  siHtml5,
  siJavascript,
  siMysql,
  siNextdotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPostgresql,
  siPython,
  siPytorch,
  siRaspberrypi,
  siReact,
  siScikitlearn,
  siSqlalchemy,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  siWordpress,
} from "simple-icons";
import type { SkillGroup } from "@/lib/types";

type Icon = { title: string; hex: string; path: string };

// Skill names as written in the CMS, matched to their logos.
const LOGOS: Record<string, Icon> = {
  python: siPython,
  tensorflow: siTensorflow,
  pytorch: siPytorch,
  opencv: siOpencv,
  "scikit-learn": siScikitlearn,
  numpy: siNumpy,
  pandas: siPandas,
  flask: siFlask,
  sqlalchemy: siSqlalchemy,
  typescript: siTypescript,
  javascript: siJavascript,
  "next.js": siNextdotjs,
  react: siReact,
  "tailwind css": siTailwindcss,
  "chakra ui": siChakraui,
  bootstrap: siBootstrap,
  html: siHtml5,
  css: siCss,
  git: siGit,
  docker: siDocker,
  postgresql: siPostgresql,
  mysql: siMysql,
  vercel: siVercel,
  figma: siFigma,
  wordpress: siWordpress,
  "raspberry pi": siRaspberrypi,
  c: siC,
  "c++": siCplusplus,
};

function readable(hex: string) {
  // Very dark brand colours vanish on a dark page; those fall back to the text colour.
  const n = parseInt(hex, 16);
  const lum = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum < 60 ? undefined : `#${hex}`;
}

/** Logos for every tool in the skill list that has one. Monochrome until pointed at. */
export function Stack({ groups }: { groups: SkillGroup[] }) {
  const seen = new Set<string>();
  const tools: { name: string; icon: Icon }[] = [];
  for (const g of groups)
    for (const item of g.items) {
      const icon = LOGOS[item.toLowerCase()];
      if (icon && !seen.has(icon.title)) {
        seen.add(icon.title);
        tools.push({ name: item, icon });
      }
    }
  return (
    <ul className="stack">
      {tools.map(({ name, icon }) => (
        <li key={icon.title} style={readable(icon.hex) ? ({ ["--brand" as string]: readable(icon.hex) } as React.CSSProperties) : undefined}>
          <span className="stack__logo">
            <svg viewBox="0 0 24 24" role="img" aria-label={name}>
              <path d={icon.path} />
            </svg>
          </span>
          <span className="stack__name" aria-hidden="true">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
