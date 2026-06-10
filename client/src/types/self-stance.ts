/** /self-stance 専用コンテンツ（ContentPayload.selfStance） */

import seed from "../../public/content/self-stance.json";
import { mergeFieldStylesFromRaw, type HomeCopyFieldStyles } from "@/types/home-copy-style";

export const SELF_STANCE_ASSETS = {
  favicon: "/self_stance/favicon.png",
  lineIcon: "/self_stance/line-icon.png",
} as const;

export type LabelValueRow = { label: string; value: string };

export type FlowStep = { num: string; nameHtml: string; description: string };

export type VoiceItem = { who: string; text: string };

export type FaqItem = { q: string; a: string };

export type SelfStanceContent = {
  fieldStyles?: HomeCopyFieldStyles;
  seo: { title: string; description: string };
  header: {
    logoUrl: string;
    logoAlt: string;
    ctaLabel: string;
    ctaHref: string;
  };
  stickyCta: { label: string; ctaHref: string };
  hero: {
    eyebrow: string;
    heroImageUrl: string;
    heroImageAlt: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    bodyHtml: string;
  };
  eventInfo: { label: string; rows: LabelValueRow[] };
  empathy: { label: string; title: string; items: string[] };
  solution: {
    label: string;
    titleHtml: string;
    subtitle: string;
    body: string;
    benefitsHeading: string;
    benefits: string[];
    ctaLabel: string;
    ctaHref: string;
  };
  program: {
    label: string;
    titleHtml: string;
    steps: FlowStep[];
    pointsHeading: string;
    points: string[];
  };
  facilitator: {
    label: string;
    title: string;
    imageUrl: string;
    name: string;
    role: string;
    bio: string[];
    quote: string;
  };
  voices: { label: string; title: string; items: VoiceItem[]; note?: string };
  detail: {
    label: string;
    title: string;
    scheduleRows: LabelValueRow[];
    mapEmbedUrl: string;
    ctaLabel: string;
    ctaHref: string;
  };
  target: { label: string; title: string; items: string[] };
  faq: { label: string; title: string; items: FaqItem[] };
  finalCta: {
    titleHtml: string;
    paragraphs: string[];
    ctaLabel: string;
    ctaHref: string;
    note: string;
  };
  footer: { lines: string[]; copyright: string };
};

export const DEFAULT_SELF_STANCE_CONTENT: SelfStanceContent =
  seed.selfStance as SelfStanceContent;

function cloneDefault(): SelfStanceContent {
  return JSON.parse(JSON.stringify(DEFAULT_SELF_STANCE_CONTENT)) as SelfStanceContent;
}

function mergeDeep(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [k, v] of Object.entries(source)) {
    if (!(k in target)) continue;
    const t = target[k];
    if (Array.isArray(v)) {
      target[k] = v;
    } else if (
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      t !== null &&
      typeof t === "object" &&
      !Array.isArray(t)
    ) {
      mergeDeep(t as Record<string, unknown>, v as Record<string, unknown>);
    } else if (v !== undefined) {
      target[k] = v;
    }
  }
}

/**
 * fieldStyles は要素ID（ss-*）をキーにした動的マップ。
 * mergeDeep は `if (!(k in target)) continue` のため、デフォルトseedに無い
 * 新規キー（新たに装飾した要素）を破棄してしまう。そのためここで個別にマージし、
 * 動的キーを保持する（home-copy の mergeFieldStylesFromRaw と同方針）。
 */
export function mergeSelfStanceContent(raw: unknown): SelfStanceContent {
  const d = cloneDefault();
  if (!raw || typeof raw !== "object") return d;
  mergeDeep(d as unknown as Record<string, unknown>, raw as Record<string, unknown>);
  // mergeDeep が動的キーを落とすため、fieldStyles は専用ロジックで上書きマージする
  const merged = mergeFieldStylesFromRaw(
    (raw as Record<string, unknown>).fieldStyles,
    d.fieldStyles,
  );
  if (merged) d.fieldStyles = merged;
  return d;
}
