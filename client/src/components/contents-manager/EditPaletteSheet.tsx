import { ElementEditorPanel } from "@/components/contents-manager/ElementEditorPanel";
import { ArrayItemEditorPanel } from "@/components/contents-manager/ArrayItemEditorPanel";
import { ReadOnlyElementPanel } from "@/components/contents-manager/ReadOnlyElementPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { findElementDefinition } from "@/lib/content-manager/content-element-registry";
import {
  parseArrayItemId,
  parseCompactArrayItemFromFieldId,
} from "@/lib/content-manager/array-item-registry";
import {
  applyArrayMutation,
  getArrayLength,
  type ArrayMutationContext,
} from "@/lib/content-manager/array-item-ops";
import { isAutoSelectableId } from "@/lib/content-manager/cm-preview-select";
import type { HomeElementEditorProps } from "@/components/contents-manager/HomeElementEditor";
import type { Dispatch, SetStateAction } from "react";
import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import type { BtobSeminarContent } from "@/types/btob-seminar";
import type { StartingJobHuntingContent } from "@/types/starting-job-hunting";
import type { SelfStanceContent } from "@/types/self-stance";
import type { JsSelfAnalysisContent } from "@/types/js-self-analysis";

export interface EditPaletteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlug: string;
  elementId: string | null;
  elementLabel?: string | null;
  selectKind?: "field" | "array" | "auto";
  homeProps: HomeElementEditorProps | null;
  arrayMutationContext: ArrayMutationContext | null;
  btobSeminarContent: BtobSeminarContent | null;
  onBtobSeminarChange: Dispatch<SetStateAction<BtobSeminarContent | null>>;
  selfReflectionContent: SelfReflectionContent | null;
  onSelfReflectionChange: Dispatch<SetStateAction<SelfReflectionContent | null>>;
  startingJobHuntingContent: StartingJobHuntingContent | null;
  onStartingJobHuntingChange: Dispatch<SetStateAction<StartingJobHuntingContent | null>>;
  selfStanceContent: SelfStanceContent | null;
  onSelfStanceChange: Dispatch<SetStateAction<SelfStanceContent | null>>;
  jsSelfAnalysisContent: JsSelfAnalysisContent | null;
  onJsSelfAnalysisChange: Dispatch<SetStateAction<JsSelfAnalysisContent | null>>;
  onSharedCtaUrlChange?: (url: string) => void;
}

export function EditPaletteSheet({
  open,
  onOpenChange,
  selectedSlug,
  elementId,
  elementLabel,
  selectKind,
  homeProps,
  arrayMutationContext,
  btobSeminarContent,
  onBtobSeminarChange,
  selfReflectionContent,
  onSelfReflectionChange,
  startingJobHuntingContent,
  onStartingJobHuntingChange,
  selfStanceContent,
  onSelfStanceChange,
  jsSelfAnalysisContent,
  onJsSelfAnalysisChange,
  onSharedCtaUrlChange,
}: EditPaletteSheetProps) {
  const arraySelection =
    elementId && selectKind === "array" && arrayMutationContext
      ? parseArrayItemId(elementId, selectedSlug)
      : null;
  const compactFieldArray =
    elementId && selectKind === "field" && arrayMutationContext
      ? parseCompactArrayItemFromFieldId(elementId, selectedSlug)
      : null;
  const def =
    elementId && !arraySelection ? findElementDefinition(selectedSlug, elementId) : undefined;
  const tall = def?.tall ?? false;
  const title =
    def?.label ??
    (arraySelection
      ? `${arraySelection.def.label} ${arraySelection.index + 1}`
      : null) ??
    elementLabel ??
    "要素を編集";
  const isReadOnly = Boolean(elementId && !def && !arraySelection && isAutoSelectableId(elementId));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={`max-h-[${tall ? "85" : "60"}vh] overflow-y-auto rounded-t-2xl px-4 pb-8 sm:px-6`}
        style={{ maxHeight: tall ? "85vh" : "60vh" }}
      >
        <div className="mx-auto w-full max-w-3xl">
        <SheetHeader className="border-b border-[#ffd7c3] pb-4 mb-4 px-0">
          <SheetTitle
            className="text-[#3D281E] text-lg"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            {title}
          </SheetTitle>
        </SheetHeader>
        {arraySelection && arrayMutationContext && (
          <ArrayItemEditorPanel
            parsed={arraySelection}
            canRemove={getArrayLength(arrayMutationContext, arraySelection) > (arraySelection.def.minItems ?? 1)}
            onMutate={(op) => applyArrayMutation(arrayMutationContext, arraySelection, op)}
          />
        )}
        {elementId && def && !isReadOnly && !arraySelection && (
          <div className="space-y-6">
            <ElementEditorPanel
              selectedSlug={selectedSlug}
              editorSection={def.editorSection}
              homeProps={homeProps}
              btobSeminarContent={btobSeminarContent}
              onBtobSeminarChange={onBtobSeminarChange}
              selfReflectionContent={selfReflectionContent}
              onSelfReflectionChange={onSelfReflectionChange}
              startingJobHuntingContent={startingJobHuntingContent}
              onStartingJobHuntingChange={onStartingJobHuntingChange}
              selfStanceContent={selfStanceContent}
              onSelfStanceChange={onSelfStanceChange}
              jsSelfAnalysisContent={jsSelfAnalysisContent}
              onJsSelfAnalysisChange={onJsSelfAnalysisChange}
              onSharedCtaUrlChange={onSharedCtaUrlChange}
            />
            {compactFieldArray && arrayMutationContext && (
              <>
                <div className="border-t border-[#ffd7c3]" />
                <ArrayItemEditorPanel
                  variant="inline"
                  parsed={compactFieldArray}
                  canRemove={
                    getArrayLength(arrayMutationContext, compactFieldArray) >
                    (compactFieldArray.def.minItems ?? 1)
                  }
                  onMutate={(op) =>
                    applyArrayMutation(arrayMutationContext, compactFieldArray, op)
                  }
                />
              </>
            )}
          </div>
        )}
        {elementId && isReadOnly && <ReadOnlyElementPanel label={title} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
