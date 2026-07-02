/** /starting_job_hunting 専用コンテンツ（ContentPayload.startingJobHunting） */

import seed from "../../public/content/starting_job_hunting.json";
import { normalizeCtaUrlInStartingJobHunting } from "@/lib/content-manager/shared-lp-cta";
import { mergeLpFieldStylesFromRaw, type HomeCopyFieldStyles } from "@/types/home-copy-style";

export const STARTING_JOB_HUNTING_ASSETS = {
  favicon: "/starting_job_hunting/favicon.png",
  lineIcon: "/starting_job_hunting/line-icon.png",
} as const;

export type LabelValueRow = { label: string; value: string; sub?: string };

export type DeliverableItem = { num: string; text: string };

export type ProgramRow = { step: string; content: string };

export type VoiceItem = { school: string; comment: string };

export type FaqItem = { q: string; a: string };

export type StartingJobHuntingContent = {
  fieldStyles?: HomeCopyFieldStyles;
  /** 全 CTA ボタン共通の遷移先 URL（4 LP 間でも共有） */
  ctaUrl?: string;
  seo: { title: string; description: string };
  header: {
    logoUrl: string;
    logoAlt: string;
    ctaLabel: string;
    /** モバイルヘッダーCTA用の短いラベル（未設定時は ctaLabel を折り返し表示） */
    ctaLabelMobile?: string;
    ctaHref: string;
  };
  stickyCta: { label: string; ctaHref: string };
  hero: {
    kicker: string;
    heroImageUrl: string;
    heroImageAlt: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    bodyHtml: string;
  };
  eventInfo: { label: string; rows: LabelValueRow[] };
  problem: { script: string; titleHtml: string; items: string[]; reassurance?: string };
  insight: {
    script: string;
    titleHtml: string;
    paragraphs: string[];
    keyLine: string;
  };
  solution: {
    script: string;
    titleHtml: string;
    lead: string;
    deliverablesHeading: string;
    deliverables: DeliverableItem[];
  };
  midCta: { label: string; ctaHref: string };
  program: {
    script: string;
    titleHtml: string;
    tableHeaders: { step: string; content: string };
    rows: ProgramRow[];
    points: string[];
  };
  facilitator: {
    script: string;
    titleHtml: string;
    imageUrl: string;
    name: string;
    role: string;
    bio: string[];
    quote: string;
  };
  voices: { script: string; titleHtml: string; items: VoiceItem[] };
  info: {
    script: string;
    title: string;
    scheduleRows: LabelValueRow[];
    mapEmbedUrl: string;
    ctaLabel: string;
    ctaHref: string;
  };
  recommend: { script: string; titleHtml: string; items: string[] };
  faq: { script: string; titleHtml: string; items: FaqItem[] };
  finalCta: {
    titleHtml: string;
    subHtml: string;
    metaItems: string[];
    ctaLabel: string;
    ctaHref: string;
    noteHtml: string;
  };
  footer: { lines: string[]; copyright: string };
};

export const DEFAULT_STARTING_JOB_HUNTING_CONTENT: StartingJobHuntingContent =
  seed.startingJobHunting as StartingJobHuntingContent;

function cloneDefault(): StartingJobHuntingContent {
  return JSON.parse(JSON.stringify(DEFAULT_STARTING_JOB_HUNTING_CONTENT)) as StartingJobHuntingContent;
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

export function mergeStartingJobHuntingContent(raw: unknown): StartingJobHuntingContent {
  const d = cloneDefault();
  if (!raw || typeof raw !== "object") return d;
  const rawObj = raw as Record<string, unknown>;
  mergeDeep(d as unknown as Record<string, unknown>, rawObj);
  const mergedStyles = mergeLpFieldStylesFromRaw(rawObj.fieldStyles, d.fieldStyles);
  if (mergedStyles) d.fieldStyles = mergedStyles;
  return normalizeCtaUrlInStartingJobHunting(d);
}
