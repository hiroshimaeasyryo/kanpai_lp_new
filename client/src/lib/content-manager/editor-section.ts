export function shouldShowEditorSection(
  sectionId: string | null | undefined,
  key: string,
): boolean {
  if (!sectionId) return true;
  return sectionId === key;
}
