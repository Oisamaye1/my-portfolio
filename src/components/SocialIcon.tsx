import {
  Globe,
  GithubLogo,
  GraduationCap,
  InstagramLogo,
  LinkedinLogo,
  MediumLogo,
  Rss,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

const ICONS = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  x: XLogo,
  scholar: GraduationCap,
  orcid: GraduationCap,
  researchgate: GraduationCap,
  youtube: YoutubeLogo,
  instagram: InstagramLogo,
  medium: MediumLogo,
  rss: Rss,
  website: Globe,
} as const;

/** Decorative platform icon shown beside a visible label. */
export function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const Icon = ICONS[platform as keyof typeof ICONS] ?? Globe;
  return <Icon size={size} weight="regular" aria-hidden="true" />;
}
