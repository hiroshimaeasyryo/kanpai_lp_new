/** /works_recruiting 専用コンテンツ（ContentPayload.worksRecruiting） */

import seed from "../../public/content/works_recruiting.json";
import type { HomeCopyFieldStyles, TextFieldStyle } from "@/types/home-copy-style";

export const WR_ASSETS = {
  lineIcon: "/works_recruiting/line-icon.png",
  markX: "/works_recruiting/mark-x.png",
  markO: "/works_recruiting/mark-o.png",
} as const;

export type ReasonItem = { type: "yes" | "no"; text: string; note: string };

export type StepItem = {
  num: string;
  label: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  text: string;
};

export type CompareRow = {
  label: string;
  num: string;
  target: number;
  fill: "calls" | "meetings";
};

export type StatChip = { value: string; label: string; countUp: boolean };

export type CultureRow = { label: string; general: string; here: string };

export type Testimonial = {
  imageUrl: string;
  imageAlt: string;
  name: string;
  uni: string;
  quotes: string[];
};

export type FlowStep = { num: string; title: string; desc: string };

export type InfoStripItem = { label: string; value: string };

export type WorksRecruitingContent = {
  fieldStyles?: HomeCopyFieldStyles;
  seo: { title: string; description: string };
  hero: { imageUrl: string; imageAlt: string };
  empathy: {
    eyebrow: string;
    title: string;
    items: string[];
    closeHtml: string;
  };
  reason: {
    eyebrow: string;
    title: string;
    lead: string;
    items: ReasonItem[];
  };
  midCta: { label: string; ctaHref: string };
  photoBand1: { imageUrl: string; imageAlt: string };
  partner: {
    text: string;
    logoLeftUrl: string;
    logoLeftAlt: string;
    logoRightUrl: string;
    logoRightAlt: string;
  };
  steps: {
    eyebrow: string;
    title: string;
    items: StepItem[];
    detail: {
      title: string;
      compareRows: CompareRow[];
      caption: string;
      notes: string[];
      statChips: StatChip[];
    };
  };
  culture: {
    eyebrow: string;
    title: string;
    lead: string;
    rows: CultureRow[];
    pullQuote: { textHtml: string; arrowLabel: string; ctaHref: string };
  };
  photoBand2: { imageUrl: string; imageAlt: string };
  proof: {
    eyebrow: string;
    title: string;
    universitiesTitle: string;
    universitiesImageUrl: string;
    universitiesImageAlt: string;
    offersTitle: string;
    offersImageUrl: string;
    offersImageAlt: string;
    voicesTitle: string;
    testimonials: Testimonial[];
  };
  cta: {
    eyebrow: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
    flow: FlowStep[];
    infoStrip: InfoStripItem[];
  };
  stickyCta: { label: string; ctaHref: string };
  footer: { textHtml: string };
};

export const DEFAULT_WR_CONTENT: WorksRecruitingContent =
  seed.worksRecruiting as WorksRecruitingContent;

function cloneDefault(): WorksRecruitingContent {
  return JSON.parse(JSON.stringify(DEFAULT_WR_CONTENT)) as WorksRecruitingContent;
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
 * fieldStyles は要素ID（wr-*）をキーにした動的マップ。
 * mergeDeep は `if (!(k in target)) continue` のため、デフォルトseedに無い
 * 新規キーを破棄してしまう。そのためここで個別にマージし動的キーを保持する
 * （js-self-analysis の mergeFieldStyles と同方針）。
 */
function mergeFieldStyles(
  raw: unknown,
  base?: HomeCopyFieldStyles,
): HomeCopyFieldStyles | undefined {
  if (!raw || typeof raw !== "object") return base;
  const out: HomeCopyFieldStyles = { ...(base ?? {}) };
  for (const [id, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!val || typeof val !== "object") continue;
    const o = val as Record<string, unknown>;
    const prev: TextFieldStyle = out[id] ?? {};
    out[id] = {
      fontSize: typeof o.fontSize === "string" ? o.fontSize : prev.fontSize,
      color: typeof o.color === "string" ? o.color : prev.color,
      fontFamily: typeof o.fontFamily === "string" ? o.fontFamily : prev.fontFamily,
      href: typeof o.href === "string" ? o.href : prev.href,
    };
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function mergeWorksRecruitingContent(raw: unknown): WorksRecruitingContent {
  const d = cloneDefault();
  if (!raw || typeof raw !== "object") return d;
  mergeDeep(d as unknown as Record<string, unknown>, raw as Record<string, unknown>);
  const merged = mergeFieldStyles(
    (raw as Record<string, unknown>).fieldStyles,
    d.fieldStyles,
  );
  if (merged) d.fieldStyles = merged;
  return d;
}
