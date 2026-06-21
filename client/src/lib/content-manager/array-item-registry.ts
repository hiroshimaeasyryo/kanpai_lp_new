import { getLpKind, type LpKind } from "@/lib/content-manager/cm-preview";
import type { ElementDefinition } from "@/lib/content-manager/content-element-registry";

/** 配列1件分のフィールド定義（オブジェクト型配列） */
export type ArrayObjectField = {
  suffix: string;
  label: string;
  multiline?: boolean;
  rows?: number;
};

export type ArrayItemStorage =
  | { bucket: "homeCopy"; path: string }
  | { bucket: "features" }
  | { bucket: "btobSeminar"; path: string }
  | { bucket: "selfReflection"; path: string }
  | { bucket: "startingJobHunting"; path: string }
  | { bucket: "selfStance"; path: string }
  | { bucket: "jsSelfAnalysis"; path: string };

export type ArrayItemDefinition = {
  prefix: string;
  label: string;
  storage: ArrayItemStorage;
  /** string = 文字列配列, object = オブジェクト配列 */
  itemKind: "string" | "object";
  fields?: ArrayObjectField[];
  createDefault: () => unknown;
  minItems?: number;
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Home LP ───
const HOME_ARRAYS: ArrayItemDefinition[] = [
  {
    prefix: "values-card",
    label: "Values",
    storage: { bucket: "homeCopy", path: "values.items" },
    itemKind: "object",
    fields: [
      { suffix: "label", label: "ラベル" },
      { suffix: "title", label: "見出し" },
      { suffix: "body", label: "本文", multiline: true, rows: 4 },
      { suffix: "note", label: "補足", multiline: true, rows: 3 },
    ],
    createDefault: () => ({ label: "", title: "", body: "", note: "" }),
  },
  {
    prefix: "event-flow-step",
    label: "フロー",
    storage: { bucket: "homeCopy", path: "eventFlow.steps" },
    itemKind: "object",
    fields: [
      { suffix: "title", label: "タイトル" },
      { suffix: "time", label: "時間" },
      { suffix: "description", label: "説明", multiline: true, rows: 3 },
    ],
    createDefault: () => ({ title: "", time: "", description: "" }),
  },
  {
    prefix: "feature",
    label: "特徴",
    storage: { bucket: "features" },
    itemKind: "object",
    fields: [
      { suffix: "title", label: "見出し" },
      { suffix: "body", label: "本文", multiline: true, rows: 4 },
    ],
    createDefault: () => ({ title: "", body: "", imageUrl: null }),
  },
  {
    prefix: "voices-card",
    label: "声",
    storage: { bucket: "homeCopy", path: "voices.items" },
    itemKind: "object",
    fields: [
      { suffix: "quote", label: "引用", multiline: true, rows: 4 },
      { suffix: "attribution", label: "属性" },
    ],
    createDefault: () => ({ quote: "", attribution: "" }),
  },
  {
    prefix: "screening-criterion",
    label: "Screening 基準",
    storage: { bucket: "homeCopy", path: "screening.criteria" },
    itemKind: "string",
    createDefault: () => "",
  },
  {
    prefix: "safety-item",
    label: "安全",
    storage: { bucket: "homeCopy", path: "safety.items" },
    itemKind: "object",
    fields: [
      { suffix: "title", label: "タイトル" },
      { suffix: "description", label: "説明", multiline: true, rows: 3 },
    ],
    createDefault: () => ({ title: "", description: "" }),
  },
  {
    prefix: "faq-item",
    label: "FAQ",
    storage: { bucket: "homeCopy", path: "faq.items" },
    itemKind: "object",
    fields: [
      { suffix: "question", label: "質問" },
      { suffix: "answer", label: "回答", multiline: true, rows: 4 },
    ],
    createDefault: () => ({ question: "", answer: "" }),
  },
];

function objDef(
  prefix: string,
  label: string,
  bucket: ArrayItemStorage["bucket"],
  path: string,
  fields: ArrayObjectField[],
  createDefault: () => unknown,
): ArrayItemDefinition {
  const storage =
    bucket === "homeCopy"
      ? { bucket, path }
      : bucket === "btobSeminar"
        ? { bucket, path }
        : bucket === "selfReflection"
          ? { bucket, path }
          : bucket === "startingJobHunting"
            ? { bucket, path }
            : bucket === "selfStance"
              ? { bucket, path }
              : { bucket, path };
  return { prefix, label, storage, itemKind: "object", fields, createDefault };
}

function strDef(
  prefix: string,
  label: string,
  bucket: ArrayItemStorage["bucket"],
  path: string,
): ArrayItemDefinition {
  const storage =
    bucket === "homeCopy"
      ? { bucket, path }
      : bucket === "btobSeminar"
        ? { bucket, path }
        : bucket === "selfReflection"
          ? { bucket, path }
          : bucket === "startingJobHunting"
            ? { bucket, path }
            : bucket === "selfStance"
              ? { bucket, path }
              : { bucket, path };
  return { prefix, label, storage, itemKind: "string", createDefault: () => "" };
}

// ─── BTOB ───
const BTOB_ARRAYS: ArrayItemDefinition[] = [
  objDef("btob-hero-info", "ヒーロー情報", "btobSeminar", "hero.info", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ], () => ({ label: "", value: "" })),
  strDef("btob-empathy-checklist", "共感 · チェック", "btobSeminar", "empathy.checklist"),
  objDef("btob-structure-step", "ループ", "btobSeminar", "structure.steps", [
    { suffix: "num", label: "番号" },
    { suffix: "label", label: "ラベル" },
    { suffix: "desc", label: "説明" },
  ], () => ({ num: "", label: "", desc: "" })),
  objDef("btob-experience-item", "体験", "btobSeminar", "experience.items", [
    { suffix: "num", label: "番号" },
    { suffix: "name", label: "名前" },
    { suffix: "descHtml", label: "説明", multiline: true, rows: 4 },
  ], () => ({ num: "", name: "", descHtml: "" })),
  objDef("btob-takeaway-card", "持ち帰り", "btobSeminar", "takeaway.cards", [
    { suffix: "icon", label: "アイコン" },
    { suffix: "titleHtml", label: "タイトル", multiline: true, rows: 2 },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ], () => ({ icon: "", titleHtml: "", desc: "" })),
  strDef("btob-audience-item", "対象者", "btobSeminar", "audience.items"),
  objDef("btob-hosts-card", "主催", "btobSeminar", "hosts.cards", [
    { suffix: "role", label: "役割" },
    { suffix: "roleJp", label: "役割（日）" },
    { suffix: "name", label: "名前" },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ], () => ({ role: "", roleJp: "", name: "", desc: "" })),
  objDef("btob-details-row", "概要", "btobSeminar", "details.rows", [
    { suffix: "th", label: "項目" },
    { suffix: "tdHtml", label: "内容", multiline: true, rows: 3 },
  ], () => ({ th: "", tdHtml: "" })),
  objDef("btob-faq-item", "FAQ", "btobSeminar", "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ], () => ({ q: "", a: "" })),
];

// ─── Self Reflection ───
const SR_ARRAYS: ArrayItemDefinition[] = [
  strDef("sr-event-info-tag", "イベント · タグ", "selfReflection", "eventInfo.tags"),
  strDef("sr-issue-item", "課題", "selfReflection", "issue.items"),
  strDef("sr-concept-tag", "コンセプト · タグ", "selfReflection", "concept.tagsHtml"),
  objDef("sr-steps-item", "ステップ", "selfReflection", "steps.items", [
    { suffix: "num", label: "番号" },
    { suffix: "min", label: "時間" },
    { suffix: "title", label: "タイトル" },
    { suffix: "tagline", label: "タグライン" },
    { suffix: "desc", label: "説明", multiline: true, rows: 4 },
  ], () => ({ num: "", min: "", title: "", tagline: "", desc: "" })),
  objDef("sr-voices-card", "体験者", "selfReflection", "voices.cards", [
    { suffix: "change", label: "変化", multiline: true, rows: 2 },
    { suffix: "quote", label: "引用", multiline: true, rows: 4 },
  ], () => ({ change: "", quote: "" })),
  objDef("sr-safety-item", "安心", "selfReflection", "safety.items", [
    { suffix: "label", label: "ラベル" },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ], () => ({ label: "", desc: "" })),
  strDef("sr-advisor-bio", "アドバイザー · 経歴", "selfReflection", "advisor.bio"),
  objDef("sr-faq-item", "FAQ", "selfReflection", "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ], () => ({ q: "", a: "" })),
];

// ─── Starting Job Hunting ───
const SJH_ARRAYS: ArrayItemDefinition[] = [
  objDef("sjh-event-info-row", "イベント", "startingJobHunting", "eventInfo.rows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
    { suffix: "sub", label: "補足" },
  ], () => ({ label: "", value: "", sub: "" })),
  strDef("sjh-problem-item", "Problem", "startingJobHunting", "problem.items"),
  strDef("sjh-insight-paragraph", "Insight", "startingJobHunting", "insight.paragraphs"),
  objDef("sjh-solution-deliverable", "Solution", "startingJobHunting", "solution.deliverables", [
    { suffix: "num", label: "番号" },
    { suffix: "text", label: "内容", multiline: true, rows: 3 },
  ], () => ({ num: "", text: "" })),
  objDef("sjh-program-row", "Program", "startingJobHunting", "program.rows", [
    { suffix: "step", label: "ステップ" },
    { suffix: "content", label: "内容", multiline: true, rows: 3 },
  ], () => ({ step: "", content: "" })),
  strDef("sjh-program-point", "Program · ポイント", "startingJobHunting", "program.points"),
  strDef("sjh-facilitator-bio", "Facilitator · 経歴", "startingJobHunting", "facilitator.bio"),
  objDef("sjh-voices-item", "参加者の声", "startingJobHunting", "voices.items", [
    { suffix: "school", label: "学校" },
    { suffix: "comment", label: "コメント", multiline: true, rows: 4 },
  ], () => ({ school: "", comment: "" })),
  objDef("sjh-info-row", "開催情報", "startingJobHunting", "info.scheduleRows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
    { suffix: "sub", label: "補足" },
  ], () => ({ label: "", value: "", sub: "" })),
  strDef("sjh-recommend-item", "おすすめ", "startingJobHunting", "recommend.items"),
  objDef("sjh-faq-item", "FAQ", "startingJobHunting", "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ], () => ({ q: "", a: "" })),
  strDef("sjh-final-cta-meta", "最終CTA · メタ", "startingJobHunting", "finalCta.metaItems"),
  strDef("sjh-footer-line", "フッター", "startingJobHunting", "footer.lines"),
];

// ─── Self Stance ───
const SS_ARRAYS: ArrayItemDefinition[] = [
  objDef("ss-event-info-row", "イベント", "selfStance", "eventInfo.rows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ], () => ({ label: "", value: "" })),
  strDef("ss-problem-item", "悩み", "selfStance", "empathy.items"),
  strDef("ss-solution-benefit", "メリット", "selfStance", "solution.benefits"),
  objDef("ss-program-step", "Program", "selfStance", "program.steps", [
    { suffix: "num", label: "番号" },
    { suffix: "nameHtml", label: "名前", multiline: true, rows: 2 },
    { suffix: "description", label: "説明", multiline: true, rows: 3 },
  ], () => ({ num: "", nameHtml: "", description: "" })),
  strDef("ss-program-point", "Program · ポイント", "selfStance", "program.points"),
  strDef("ss-facilitator-bio", "Facilitator · 経歴", "selfStance", "facilitator.bio"),
  objDef("ss-voices-item", "参加者の声", "selfStance", "voices.items", [
    { suffix: "who", label: "属性" },
    { suffix: "text", label: "コメント", multiline: true, rows: 4 },
  ], () => ({ who: "", text: "" })),
  objDef("ss-detail-row", "開催情報", "selfStance", "detail.scheduleRows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ], () => ({ label: "", value: "" })),
  strDef("ss-target-item", "おすすめ", "selfStance", "target.items"),
  objDef("ss-faq-item", "FAQ", "selfStance", "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ], () => ({ q: "", a: "" })),
  strDef("ss-final-cta-paragraph", "最終CTA", "selfStance", "finalCta.paragraphs"),
  strDef("ss-footer-line", "フッター", "selfStance", "footer.lines"),
];

// ─── JS Self Analysis ───
const JSA_ARRAYS: ArrayItemDefinition[] = [
  objDef("jsa-hero-info-row", "FV情報", "jsSelfAnalysis", "hero.infoRows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ], () => ({ label: "", value: "" })),
  strDef("jsa-empathy-item", "共感", "jsSelfAnalysis", "empathy.items"),
  strDef("jsa-solution-outcome", "得られるもの", "jsSelfAnalysis", "solution.outcomes"),
  objDef("jsa-schedule-step", "ワーク", "jsSelfAnalysis", "schedule.steps", [
    { suffix: "label", label: "ラベル" },
    { suffix: "title", label: "タイトル" },
    { suffix: "desc", label: "説明", multiline: true, rows: 3 },
  ], () => ({ label: "", title: "", desc: "" })),
  strDef("jsa-schedule-note", "当日の流れ · 注記", "jsSelfAnalysis", "schedule.notes"),
  strDef("jsa-facilitator-bio", "Facilitator · 経歴", "jsSelfAnalysis", "facilitator.bio"),
  objDef("jsa-voices-item", "参加者の声", "jsSelfAnalysis", "voices.items", [
    { suffix: "who", label: "属性" },
    { suffix: "text", label: "コメント", multiline: true, rows: 4 },
  ], () => ({ who: "", text: "" })),
  objDef("jsa-event-info-row", "開催情報", "jsSelfAnalysis", "eventInfo.rows", [
    { suffix: "label", label: "ラベル" },
    { suffix: "value", label: "値" },
  ], () => ({ label: "", value: "" })),
  strDef("jsa-forwho-item", "おすすめ", "jsSelfAnalysis", "forWho.items"),
  objDef("jsa-faq-item", "FAQ", "jsSelfAnalysis", "faq.items", [
    { suffix: "q", label: "質問" },
    { suffix: "a", label: "回答", multiline: true, rows: 4 },
  ], () => ({ q: "", a: "" })),
];

const ARRAYS_BY_KIND: Record<LpKind, ArrayItemDefinition[]> = {
  home: HOME_ARRAYS,
  btob_seminar: BTOB_ARRAYS,
  self_reflection: SR_ARRAYS,
  starting_job_hunting: SJH_ARRAYS,
  self_stance: SS_ARRAYS,
  js_self_analysis: JSA_ARRAYS,
};

/** prefix 長い順（より具体的なマッチを優先） */
function sortedDefs(slug: string): ArrayItemDefinition[] {
  return [...(ARRAYS_BY_KIND[getLpKind(slug)] ?? [])].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );
}

export type ParsedArrayItem = {
  def: ArrayItemDefinition;
  index: number;
  id: string;
};

/** `values-card-0` 形式の配列項目 ID を解析 */
export function parseArrayItemId(id: string, slug: string): ParsedArrayItem | null {
  for (const def of sortedDefs(slug)) {
    const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)$`);
    const m = id.match(re);
    if (!m) continue;
    const index = parseInt(m[1], 10);
    if (Number.isNaN(index) || index < 0) return null;
    return { def, index, id };
  }
  return null;
}

/**
 * 表形式・リスト形式など余白クリックが難しい配列。
 * 文言フィールド選択時に編集パレットへ行操作を併設する。
 */
export const COMPACT_ARRAY_ITEM_PREFIXES = new Set([
  "btob-empathy-checklist",
  "btob-audience-item",
  "btob-details-row",
  "sr-event-info-tag",
  "sr-concept-tag",
  "sjh-program-row",
  "sjh-info-row",
  "ss-program-step",
  "ss-detail-row",
  "ss-final-cta-paragraph",
]);

export function isCompactArrayItemPrefix(prefix: string): boolean {
  return COMPACT_ARRAY_ITEM_PREFIXES.has(prefix);
}

/** コンパクト配列のフィールド ID から所属項目を特定（該当しない場合は null） */
export function parseCompactArrayItemFromFieldId(
  id: string,
  slug: string,
): ParsedArrayItem | null {
  const parsed = parseArrayItemFromFieldId(id, slug);
  if (!parsed || !isCompactArrayItemPrefix(parsed.def.prefix)) return null;
  return parsed;
}

export function parseArrayItemFromFieldId(id: string, slug: string): ParsedArrayItem | null {
  for (const def of sortedDefs(slug)) {
    if (def.itemKind === "string") {
      const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)$`);
      const m = id.match(re);
      if (m) {
        const index = parseInt(m[1], 10);
        if (!Number.isNaN(index) && index >= 0) return { def, index, id: m[0] };
      }
      continue;
    }
    for (const f of def.fields ?? []) {
      const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)-${escapeRegex(f.suffix)}$`);
      const m = id.match(re);
      if (m) {
        const index = parseInt(m[1], 10);
        if (!Number.isNaN(index) && index >= 0) {
          return { def, index, id: `${def.prefix}-${index}` };
        }
      }
    }
  }
  return null;
}

export function getArrayItemLabel(def: ArrayItemDefinition, index: number): string {
  return `${def.label} ${index + 1}`;
}

export function getArrayDefsForKind(kind: LpKind): ArrayItemDefinition[] {
  return ARRAYS_BY_KIND[kind] ?? [];
}

/** 動的インデックスのフィールド定義（LpFieldDef 互換） */
export function buildDynamicFieldDef(
  id: string,
  slug: string,
): { id: string; label: string; path: string; multiline?: boolean; rows?: number } | null {
  for (const def of sortedDefs(slug)) {
    if (def.itemKind === "string") continue;
    for (const f of def.fields ?? []) {
      const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)-${escapeRegex(f.suffix)}$`);
      const m = id.match(re);
      if (!m) continue;
      const index = parseInt(m[1], 10);
      if (Number.isNaN(index) || index < 0) return null;
      return {
        id,
        label: `${def.label} ${index + 1} · ${f.label}`,
        path: `${def.storage.path}[${index}].${f.suffix}`,
        multiline: f.multiline,
        rows: f.rows,
      };
    }
  }
  for (const def of sortedDefs(slug)) {
    if (def.itemKind !== "string") continue;
    const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)$`);
    const m = id.match(re);
    if (!m) continue;
    const index = parseInt(m[1], 10);
    if (Number.isNaN(index) || index < 0) return null;
    return {
      id,
      label: `${def.label} ${index + 1}`,
      path: `${def.storage.path}[${index}]`,
    };
  }
  return null;
}

/** Home LP 向け動的 ElementDefinition */
export function buildHomeDynamicElementDef(id: string): ElementDefinition | null {
  for (const def of HOME_ARRAYS) {
    if (def.itemKind === "string") {
      const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)$`);
      const m = id.match(re);
      if (m) {
        const index = parseInt(m[1], 10);
        return { id, label: `${def.label} ${index + 1}`, editorSection: id };
      }
      continue;
    }
    for (const f of def.fields ?? []) {
      const re = new RegExp(`^${escapeRegex(def.prefix)}-(\\d+)-${escapeRegex(f.suffix)}$`);
      const m = id.match(re);
      if (m) {
        const index = parseInt(m[1], 10);
        return { id, label: `${def.label} ${index + 1} · ${f.label}`, editorSection: id };
      }
    }
  }
  return null;
}
