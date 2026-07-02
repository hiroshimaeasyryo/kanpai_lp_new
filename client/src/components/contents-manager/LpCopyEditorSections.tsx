import { TextElementEditor } from "@/components/contents-manager/TextElementEditor";
import { getFieldPath, setFieldPath } from "@/lib/content-manager/lp-field-path";
import type { LpFieldDef } from "@/lib/content-manager/lp-field-types";
import {
  applyCtaUrlToJsa,
  applyCtaUrlToSelfReflection,
  applyCtaUrlToSelfStance,
  applyCtaUrlToStartingJobHunting,
  isSharedCtaHrefPath,
} from "@/lib/content-manager/shared-lp-cta";
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
  /** 4 LP 共通 CTA URL の変更時（hrefPath が ctaUrl のとき） */
  onSharedCtaUrlChange?: (url: string) => void;
};

export function LpCopyEditorSections<T extends WithLpFieldStyles>({
  content,
  onChange,
  sectionId,
  field,
  onSharedCtaUrlChange,
}: Props<T>) {
  const text = getFieldPath(content, field.path);
  const href = field.hrefPath ? getFieldPath(content, field.hrefPath) : undefined;

  const handleHrefChange =
    field.hrefPath
      ? (value: string) => {
          onChange((prev) => {
            let next = setFieldPath(prev, field.hrefPath!, value) as T;
            if (isSharedCtaHrefPath(field.hrefPath)) {
              next = applySharedCtaUrlToCurrentLp(next, value) as T;
            }
            return next;
          });
          if (isSharedCtaHrefPath(field.hrefPath)) {
            onSharedCtaUrlChange?.(value);
          }
        }
      : undefined;

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
      onHrefChange={handleHrefChange}
      multiline={field.multiline}
      rows={field.rows ?? 4}
    />
  );
}

function applySharedCtaUrlToCurrentLp<T>(content: T, url: string): T {
  const c = content as Record<string, unknown>;
  if ("floatingCta" in c && "hero" in c && "empathy" in c) {
    return applyCtaUrlToJsa(content as Parameters<typeof applyCtaUrlToJsa>[0], url) as T;
  }
  if ("stickyCta" in c && "solution" in c && "detail" in c) {
    return applyCtaUrlToSelfStance(content as Parameters<typeof applyCtaUrlToSelfStance>[0], url) as T;
  }
  if ("midCta" in c && "info" in c && "recommend" in c) {
    return applyCtaUrlToStartingJobHunting(
      content as Parameters<typeof applyCtaUrlToStartingJobHunting>[0],
      url,
    ) as T;
  }
  if ("floatingCtaLabel" in c || ("hero" in c && "closingCta" in c)) {
    return applyCtaUrlToSelfReflection(
      content as Parameters<typeof applyCtaUrlToSelfReflection>[0],
      url,
    ) as T;
  }
  return setFieldPath(content as object, "ctaUrl", url) as T;
}
