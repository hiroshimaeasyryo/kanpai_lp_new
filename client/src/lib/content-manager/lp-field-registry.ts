import { getLpKind, type LpKind } from "@/lib/content-manager/cm-preview";
import type { ElementDefinition } from "@/lib/content-manager/content-element-registry";
import { BTOB_LP_FIELDS } from "@/lib/content-manager/generated/btob-lp-fields";
import { SJH_LP_FIELDS } from "@/lib/content-manager/generated/sjh-lp-fields";
import { SR_LP_FIELDS } from "@/lib/content-manager/generated/sr-lp-fields";
import { SS_LP_FIELDS } from "@/lib/content-manager/generated/ss-lp-fields";
import { toElementDefinition, type LpFieldDef } from "@/lib/content-manager/lp-field-types";

const FIELDS_BY_KIND: Record<Exclude<LpKind, "home">, LpFieldDef[]> = {
  btob_seminar: BTOB_LP_FIELDS,
  self_reflection: SR_LP_FIELDS,
  starting_job_hunting: SJH_LP_FIELDS,
  self_stance: SS_LP_FIELDS,
};

const FIELD_MAP_BY_KIND = Object.fromEntries(
  Object.entries(FIELDS_BY_KIND).map(([kind, fields]) => [
    kind,
    new Map(fields.map((f) => [f.id, f])),
  ]),
) as Record<Exclude<LpKind, "home">, Map<string, LpFieldDef>>;

/** 動的インデックス（FAQ 追加行など）向けフォールバック */
const DYNAMIC_FIELD_PATTERNS: Partial<
  Record<Exclude<LpKind, "home">, { re: RegExp; build: (m: RegExpMatchArray) => LpFieldDef | null }[]>
> = {
  btob_seminar: [
    {
      re: /^btob-faq-item-(\d+)-(q|a)$/,
      build: (m) => ({
        id: m[0],
        label: `FAQ ${Number(m[1]) + 1} · ${m[2] === "q" ? "質問" : "回答"}`,
        path: `faq.items[${m[1]}].${m[2]}`,
        kind: "text",
        multiline: m[2] === "a",
        rows: m[2] === "a" ? 4 : undefined,
      }),
    },
  ],
  self_reflection: [
    {
      re: /^sr-faq-item-(\d+)-(q|a)$/,
      build: (m) => ({
        id: m[0],
        label: `FAQ ${Number(m[1]) + 1} · ${m[2] === "q" ? "質問" : "回答"}`,
        path: `faq.items[${m[1]}].${m[2]}`,
        kind: "text",
        multiline: m[2] === "a",
        rows: m[2] === "a" ? 4 : undefined,
      }),
    },
  ],
  starting_job_hunting: [
    {
      re: /^sjh-faq-item-(\d+)-(q|a)$/,
      build: (m) => ({
        id: m[0],
        label: `FAQ ${Number(m[1]) + 1} · ${m[2] === "q" ? "質問" : "回答"}`,
        path: `faq.items[${m[1]}].${m[2]}`,
        kind: "text",
        multiline: m[2] === "a",
        rows: m[2] === "a" ? 4 : undefined,
      }),
    },
  ],
  self_stance: [
    {
      re: /^ss-faq-item-(\d+)-(q|a)$/,
      build: (m) => ({
        id: m[0],
        label: `FAQ ${Number(m[1]) + 1} · ${m[2] === "q" ? "質問" : "回答"}`,
        path: `faq.items[${m[1]}].${m[2]}`,
        kind: "text",
        multiline: m[2] === "a",
        rows: m[2] === "a" ? 4 : undefined,
      }),
    },
  ],
};

export function findLpField(slug: string, id: string): LpFieldDef | undefined {
  const kind = getLpKind(slug);
  if (kind === "home") return undefined;
  const exact = FIELD_MAP_BY_KIND[kind].get(id);
  if (exact) return exact;
  for (const { re, build } of DYNAMIC_FIELD_PATTERNS[kind] ?? []) {
    const m = id.match(re);
    if (m) {
      const built = build(m);
      if (built) return built;
    }
  }
  return undefined;
}

export function getLpFieldElements(slug: string): ElementDefinition[] {
  const kind = getLpKind(slug);
  if (kind === "home") return [];
  return FIELDS_BY_KIND[kind].map(toElementDefinition);
}

export function isRegisteredLpField(slug: string, id: string): boolean {
  return findLpField(slug, id) != null;
}
