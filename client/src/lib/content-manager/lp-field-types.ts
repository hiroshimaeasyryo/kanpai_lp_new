import type { ElementDefinition } from "@/lib/content-manager/content-element-registry";
import type { LpKind } from "@/lib/content-manager/cm-preview";

export type LpFieldKind = "text" | "image";

export type LpFieldDef = {
  id: string;
  label: string;
  path: string;
  kind?: LpFieldKind;
  multiline?: boolean;
  rows?: number;
  /** 画像フィールドのデフォルトパス */
  imageDefault?: string;
};

export function toElementDefinition(field: LpFieldDef): ElementDefinition {
  return { id: field.id, label: field.label, editorSection: field.id };
}

export type LpFieldsByKind = Record<LpKind, LpFieldDef[]>;

export function text(
  id: string,
  label: string,
  path: string,
  opts?: { multiline?: boolean; rows?: number },
): LpFieldDef {
  return { id, label, path, kind: "text", multiline: opts?.multiline, rows: opts?.rows };
}

export function image(id: string, label: string, path: string, imageDefault?: string): LpFieldDef {
  return { id, label, path, kind: "image", imageDefault };
}

export function indexedFields(
  prefix: string,
  labelPrefix: string,
  count: number,
  arrayPath: string,
  fields: { suffix: string; label: string; multiline?: boolean; rows?: number }[],
): LpFieldDef[] {
  const out: LpFieldDef[] = [];
  for (let i = 0; i < count; i++) {
    for (const f of fields) {
      out.push(
        text(`${prefix}-${i}-${f.suffix}`, `${labelPrefix} ${i + 1} · ${f.label}`, `${arrayPath}[${i}].${f.suffix}`, {
          multiline: f.multiline,
          rows: f.rows,
        }),
      );
    }
  }
  return out;
}

export function indexedSimple(
  prefix: string,
  labelPrefix: string,
  count: number,
  arrayPath: string,
): LpFieldDef[] {
  return Array.from({ length: count }, (_, i) =>
    text(`${prefix}-${i}`, `${labelPrefix} ${i + 1}`, `${arrayPath}[${i}]`),
  );
}
