import { Button } from "@/components/ui/button";
import { TextElementEditor } from "@/components/contents-manager/TextElementEditor";
import { resolveHomeTextBinding } from "@/lib/content-manager/home-copy-text-bindings";
import type { HomeCopy } from "@/types/home-copy";
import { DEFAULT_HOME_COPY } from "@/types/home-copy";
import { patchFieldStyle } from "@/types/home-copy-style";

type Props = {
  copy: HomeCopy;
  onChange: (updater: HomeCopy | ((prev: HomeCopy) => HomeCopy)) => void;
  sectionId: string;
};

export function HomeCopyEditorSections({ copy, onChange, sectionId }: Props) {
  const binding = resolveHomeTextBinding(sectionId, copy);
  if (!binding) return null;

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
