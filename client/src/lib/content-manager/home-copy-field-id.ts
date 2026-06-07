/** `values-card-0-label` 形式の ID をパース */
export function parseIndexedFieldId(
  sectionId: string,
  prefix: string,
): { index: number; field: string } | null {
  const escaped = prefix.replace(/-/g, "\\-");
  const m = sectionId.match(new RegExp(`^${escaped}-(\\d+)-([a-z0-9]+)$`));
  if (!m) return null;
  const index = parseInt(m[1], 10);
  if (Number.isNaN(index) || index < 0) return null;
  return { index, field: m[2] };
}

/** `screening-criterion-2` 形式（フィールド suffix なし） */
export function parseIndexedId(sectionId: string, prefix: string): number | null {
  const escaped = prefix.replace(/-/g, "\\-");
  const m = sectionId.match(new RegExp(`^${escaped}-(\\d+)$`));
  if (!m) return null;
  const index = parseInt(m[1], 10);
  return Number.isNaN(index) || index < 0 ? null : index;
}
