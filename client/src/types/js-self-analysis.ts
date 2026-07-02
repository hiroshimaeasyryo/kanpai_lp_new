/** /js_self_analysis 専用コンテンツ（ContentPayload.jsSelfAnalysis） */

import seed from "../../public/content/js_self_analysis.json";
import { normalizeCtaUrlInJsa } from "@/lib/content-manager/shared-lp-cta";
import { mergeLpFieldStylesFromRaw, type HomeCopyFieldStyles } from "@/types/home-copy-style";

export const JSA_ASSETS = {
  favicon: "/js_self_analysis/favicon.png",
  lineIcon: "/js_self_analysis/line-icon.png",
} as const;

export type LabelValueRow = { label: string; value: string };

export type ScheduleStep = { label: string; title: string; desc: string };

export type VoiceItem = { who: string; text: string };

export type FaqItem = { q: string; a: string };

export type JsSelfAnalysisContent = {
  fieldStyles?: HomeCopyFieldStyles;
  /** 全 CTA ボタン共通の遷移先 URL（4 LP 間でも共有） */
  ctaUrl?: string;
  seo: { title: string; description: string };
  header: { logoUrl: string; logoAlt: string };
  floatingCta: { label: string; ctaHref: string };
  hero: {
    imageUrl: string;
    imageAlt: string;
    infoRows: LabelValueRow[];
    ctaLabel: string;
    ctaHref: string;
    micro: string;
  };
  empathy: {
    label: string;
    titleHtml: string;
    items: string[];
    closeHtml: string;
    ctaLabel: string;
    ctaHref: string;
  };
  problem: {
    label: string;
    titleHtml: string;
    bodyHtml: string;
    closeHtml: string;
  };
  solution: {
    label: string;
    title: string;
    bodyHtml: string;
    outcomeTitle: string;
    outcomes: string[];
  };
  schedule: {
    label: string;
    title: string;
    steps: ScheduleStep[];
    notes: string[];
    ctaLabel: string;
    ctaHref: string;
    micro: string;
  };
  facilitator: {
    label: string;
    title: string;
    imageUrl: string;
    name: string;
    role: string;
    tag: string;
    bio: string[];
    quote: string;
  };
  voices: { label: string; title: string; items: VoiceItem[] };
  eventInfo: {
    label: string;
    title: string;
    rows: LabelValueRow[];
    ctaLabel: string;
    ctaHref: string;
  };
  forWho: { label: string; title: string; items: string[] };
  faq: { label: string; title: string; items: FaqItem[] };
  finalCta: {
    label: string;
    title: string;
    bodyHtml: string;
    ctaLabel: string;
    ctaHref: string;
    note: string;
  };
  footer: { copyright: string };
};

export const DEFAULT_JSA_CONTENT: JsSelfAnalysisContent =
  seed.jsSelfAnalysis as JsSelfAnalysisContent;

function cloneDefault(): JsSelfAnalysisContent {
  return JSON.parse(JSON.stringify(DEFAULT_JSA_CONTENT)) as JsSelfAnalysisContent;
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

export function mergeJsSelfAnalysisContent(raw: unknown): JsSelfAnalysisContent {
  const d = cloneDefault();
  if (!raw || typeof raw !== "object") return d;
  const rawObj = raw as Record<string, unknown>;
  mergeDeep(d as unknown as Record<string, unknown>, rawObj);
  const mergedStyles = mergeLpFieldStylesFromRaw(rawObj.fieldStyles, d.fieldStyles);
  if (mergedStyles) d.fieldStyles = mergedStyles;
  return normalizeCtaUrlInJsa(d);
}
