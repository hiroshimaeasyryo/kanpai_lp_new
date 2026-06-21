import { DualImageElementEditor } from "@/components/contents-manager/DualImageElementEditor";
import { FieldStyleEditor } from "@/components/contents-manager/FieldStyleEditor";
import { LpCopyEditorSections, type WithLpFieldStyles } from "@/components/contents-manager/LpCopyEditorSections";
import type { LpKind } from "@/lib/content-manager/cm-preview";
import { findLpField } from "@/lib/content-manager/lp-field-registry";
import { getFieldPath, setFieldPath } from "@/lib/content-manager/lp-field-path";
import { patchFieldStyle } from "@/types/home-copy-style";

type Props<T extends WithLpFieldStyles> = {
  kind: LpKind;
  slug: string;
  sectionId: string;
  content: T;
  onChange: (next: T | ((prev: T) => T)) => void;
};

export function LpElementEditor<T extends WithLpFieldStyles>({
  kind,
  slug,
  sectionId,
  content,
  onChange,
}: Props<T>) {
  if (kind === "home") return null;

  const field = findLpField(slug, sectionId);
  if (!field) {
    return <p className="text-sm text-[#5C3E2A]">この要素のエディタは未設定です。</p>;
  }

  if (field.kind === "style") {
    return (
      <FieldStyleEditor
        style={content.fieldStyles?.[sectionId]}
        onStyleChange={(partial) =>
          onChange((prev) => ({
            ...prev,
            fieldStyles: patchFieldStyle(prev.fieldStyles, sectionId, partial),
          }))
        }
        containerOnly={field.containerOnly}
        showHref={false}
      />
    );
  }

  if (field.kind === "image") {
    const raw = getFieldPath(content, field.path);
    const pcUrl = raw?.trim() ? raw : null;
    return (
      <DualImageElementEditor
        pcUrl={pcUrl}
        mobileUrl={null}
        showMobile={false}
        pcLabel={field.label}
        onPcUpload={(url) => onChange((prev) => setFieldPath(prev, field.path, url) as T)}
        onMobileUpload={() => {}}
        onPcDelete={() => onChange((prev) => setFieldPath(prev, field.path, "") as T)}
        onMobileDelete={() => {}}
        onResetDefault={
          field.imageDefault
            ? () => onChange((prev) => setFieldPath(prev, field.path, field.imageDefault!) as T)
            : undefined
        }
      />
    );
  }

  return (
    <LpCopyEditorSections
      content={content}
      onChange={onChange}
      sectionId={sectionId}
      field={field}
    />
  );
}
