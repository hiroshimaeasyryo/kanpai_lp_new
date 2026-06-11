import { TextElementEditor } from "@/components/contents-manager/TextElementEditor";
import { getFieldPath, setFieldPath } from "@/lib/content-manager/lp-field-path";
import type { LpFieldDef } from "@/lib/content-manager/lp-field-types";
import type { HomeCopyFieldStyles } from "@/types/home-copy-style";
import { patchFieldStyle } from "@/types/home-copy-style";

export type WithLpFieldStyles = {
  fieldStyles?: HomeCopyFieldStyles;
};

type Props<T extends WithLpFieldStyles> = {
  content: T;
  onChange: (updater: T | ((prev: T) => T)) => void;
  sectionId: string;
  field: LpFieldDef;
};

export function LpCopyEditorSections<T extends WithLpFieldStyles>({
  content,
  onChange,
  sectionId,
  field,
}: Props<T>) {
  const text = getFieldPath(content, field.path);
  const href = field.hrefPath ? getFieldPath(content, field.hrefPath) : undefined;

  return (
    <TextElementEditor
      text={text}
      onTextChange={(v) =>
        onChange((prev) => setFieldPath(prev, field.path, v) as T)
      }
      style={content.fieldStyles?.[sectionId]}
      onStyleChange={(partial) =>
        onChange((prev) => ({
          ...prev,
          fieldStyles: patchFieldStyle(prev.fieldStyles, sectionId, partial),
        }))
      }
      href={href}
      onHrefChange={
        field.hrefPath
          ? (value) => onChange((prev) => setFieldPath(prev, field.hrefPath!, value) as T)
          : undefined
      }
      multiline={field.multiline}
      rows={field.rows ?? 4}
    />
  );
}
