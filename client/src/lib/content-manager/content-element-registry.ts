import { getLpKind, type LpKind } from "@/lib/content-manager/cm-preview";
import {
  buildHomeDynamicElementDef,
  parseArrayItemId,
} from "@/lib/content-manager/array-item-registry";
import { HOME_COPY_ELEMENTS } from "@/lib/content-manager/home-copy-elements";
import { getLpFieldElements, findLpField, findArrayItemElementDefinition } from "@/lib/content-manager/lp-field-registry";

export type ElementDefinition = {
  id: string;
  label: string;
  /** ElementEditorPanel が editor の sectionId に渡すキー */
  editorSection: string;
  globalOnly?: boolean;
  tall?: boolean;
};

const HOME_ELEMENTS: ElementDefinition[] = HOME_COPY_ELEMENTS;

const REGISTRY_BY_KIND: Record<LpKind, ElementDefinition[]> = {
  home: HOME_ELEMENTS,
  btob_seminar: getLpFieldElements("btob_seminar"),
  self_reflection: getLpFieldElements("self-reflection"),
  starting_job_hunting: getLpFieldElements("starting_job_hunting"),
  self_stance: getLpFieldElements("self-stance"),
  js_self_analysis: getLpFieldElements("js_self_analysis"),
};

export function getElementRegistry(slug: string): ElementDefinition[] {
  const kind = getLpKind(slug);
  const base = REGISTRY_BY_KIND[kind];
  if (kind === "home" && slug !== "campaign2603") {
    return base.filter((el) => el.id !== "campaign2603-notice");
  }
  return base;
}

export function findElementDefinition(slug: string, id: string): ElementDefinition | undefined {
  const arrayDef = findArrayItemElementDefinition(slug, id);
  if (arrayDef) return arrayDef;

  const exact = getElementRegistry(slug).find((el) => el.id === id);
  if (exact) return exact;

  if (getLpKind(slug) === "home") {
    const homeDynamic = buildHomeDynamicElementDef(id);
    if (homeDynamic) return homeDynamic;
    return undefined;
  }

  const lpField = findLpField(slug, id);
  if (lpField) {
    return { id: lpField.id, label: lpField.label, editorSection: lpField.id };
  }
  return undefined;
}
