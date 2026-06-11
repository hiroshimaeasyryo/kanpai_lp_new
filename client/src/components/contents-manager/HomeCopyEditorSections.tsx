import { Button } from "@/components/ui/button";
import { TextElementEditor } from "@/components/contents-manager/TextElementEditor";
import { resolveHomeTextBinding } from "@/lib/content-manager/home-copy-text-bindings";
import type { HomeCopy } from "@/types/home-copy";
import { DEFAULT_HOME_COPY } from "@/types/home-copy";
import { patchFieldStyle } from "@/types/home-copy-style";

const HOME_CTA_SECTION_IDS = new Set([
  "nav-header-cta",
  "hero-cta",
  "about-cta",
  "hero-sticky-cta",
]);

type Props = {
  copy: HomeCopy;
  onChange: (updater: HomeCopy | ((prev: HomeCopy) => HomeCopy)) => void;
  sectionId: string;
  defaultLineHref?: string;
};

export function HomeCopyEditorSections({ copy, onChange, sectionId, defaultLineHref }: Props) {
  const binding = resolveHomeTextBinding(sectionId, copy);
  if (!binding) return null;

  const isCta = HOME_CTA_SECTION_IDS.has(sectionId);
  const href = isCta
    ? copy.fieldStyles?.[sectionId]?.href?.trim() || defaultLineHref || ""
    : undefined;

  return (
    <div className="space-y-4">
      <TextElementEditor
        text={binding.text}
        onTextChange={(v) => onChange((prev) => binding.applyText(prev, v))}
        style={copy.fieldStyles?.[sectionId]}
        onStyleChange={(partial) =>
          onChange((prev) => ({
            ...prev,
            fieldStyles: patchFieldStyle(prev.fieldStyles, sectionId, partial),
          }))
        }
        href={href}
        onHrefChange={
          isCta
            ? (value) =>
                onChange((prev) => ({
                  ...prev,
                  fieldStyles: patchFieldStyle(prev.fieldStyles, sectionId, { href: value }),
                }))
            : undefined
        }
        multiline={binding.multiline}
        rows={binding.rows}
      />
      {sectionId === "faq-heading" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-[#d4844b] text-[#d4844b]"
          onClick={() => onChange((prev) => ({ ...prev, faq: DEFAULT_HOME_COPY.faq }))}
        >
          FAQをデフォルトに戻す
        </Button>
      )}
    </div>
  );
}
