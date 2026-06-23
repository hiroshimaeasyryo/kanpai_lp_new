import { getLpKind, type LpKind } from "@/lib/content-manager/cm-preview";
import type { ElementDefinition } from "@/lib/content-manager/content-element-registry";
import {
  buildDynamicFieldDef,
  buildHomeDynamicElementDef,
  getArrayItemLabel,
  parseArrayItemId,
} from "@/lib/content-manager/array-item-registry";
import { BTOB_LP_FIELDS } from "@/lib/content-manager/generated/btob-lp-fields";
import { SJH_LP_FIELDS } from "@/lib/content-manager/generated/sjh-lp-fields";
import { SR_LP_FIELDS } from "@/lib/content-manager/generated/sr-lp-fields";
import { SS_LP_FIELDS } from "@/lib/content-manager/generated/ss-lp-fields";
import { JSA_LP_FIELDS } from "@/lib/content-manager/generated/jsa-lp-fields";
import { toElementDefinition, type LpFieldDef } from "@/lib/content-manager/lp-field-types";

const FIELDS_BY_KIND: Record<Exclude<LpKind, "home">, LpFieldDef[]> = {
  btob_seminar: BTOB_LP_FIELDS,
  self_reflection: SR_LP_FIELDS,
  starting_job_hunting: SJH_LP_FIELDS,
  self_stance: SS_LP_FIELDS,
  js_self_analysis: JSA_LP_FIELDS,
};

const FIELD_MAP_BY_KIND = Object.fromEntries(
  Object.entries(FIELDS_BY_KIND).map(([kind, fields]) => [
    kind,
    new Map(fields.map((f) => [f.id, f])),
  ]),
) as Record<Exclude<LpKind, "home">, Map<string, LpFieldDef>>;

export function findLpField(slug: string, id: string): LpFieldDef | undefined {
  const kind = getLpKind(slug);
  if (kind === "home") return undefined;
  const exact = FIELD_MAP_BY_KIND[kind].get(id);
  if (exact) return exact;
  const built = buildDynamicFieldDef(id, slug);
  if (!built) return undefined;
  return { ...built, kind: "text" };
}

export function getLpFieldElements(slug: string): ElementDefinition[] {
  const kind = getLpKind(slug);
  if (kind === "home") return [];
  return FIELDS_BY_KIND[kind].map(toElementDefinition);
}

export function isRegisteredLpField(slug: string, id: string): boolean {
  return findLpField(slug, id) != null;
}

export function findArrayItemElementDefinition(
  slug: string,
  id: string,
): ElementDefinition | undefined {
  const parsed = parseArrayItemId(id, slug);
  if (!parsed) return undefined;
  return {
    id: parsed.id,
    label: getArrayItemLabel(parsed.def, parsed.index),
    editorSection: parsed.id,
  };
}
