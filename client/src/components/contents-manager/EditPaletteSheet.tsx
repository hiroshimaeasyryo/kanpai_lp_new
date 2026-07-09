import { ElementEditorPanel } from "@/components/contents-manager/ElementEditorPanel";
import { ReadOnlyElementPanel } from "@/components/contents-manager/ReadOnlyElementPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { findElementDefinition } from "@/lib/content-manager/content-element-registry";
import { isAutoSelectableId } from "@/lib/content-manager/cm-preview-select";
import type { HomeElementEditorProps } from "@/components/contents-manager/HomeElementEditor";
import type { Dispatch, SetStateAction } from "react";
import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import type { BtobSeminarContent } from "@/types/btob-seminar";
import type { StartingJobHuntingContent } from "@/types/starting-job-hunting";
import type { SelfStanceContent } from "@/types/self-stance";
import type { JsSelfAnalysisContent } from "@/types/js-self-analysis";
import type { WorksRecruitingContent } from "@/types/works-recruiting";

export interface EditPaletteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlug: string;
  elementId: string | null;
  elementLabel?: string | null;
  homeProps: HomeElementEditorProps | null;
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
  worksRecruitingContent: WorksRecruitingContent | null;
  onWorksRecruitingChange: Dispatch<SetStateAction<WorksRecruitingContent | null>>;
}

export function EditPaletteSheet({
  open,
  onOpenChange,
  selectedSlug,
  elementId,
  elementLabel,
  homeProps,
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
  worksRecruitingContent,
  onWorksRecruitingChange,
}: EditPaletteSheetProps) {
  const def = elementId ? findElementDefinition(selectedSlug, elementId) : undefined;
  const tall = def?.tall ?? false;
  const title = def?.label ?? elementLabel ?? "要素を編集";
  const isReadOnly = Boolean(elementId && !def && isAutoSelectableId(elementId));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={`max-h-[${tall ? "85" : "60"}vh] overflow-y-auto rounded-t-2xl px-6 pb-8`}
        style={{ maxHeight: tall ? "85vh" : "60vh" }}
      >
        <SheetHeader className="border-b border-[#ffd7c3] pb-4 mb-4">
          <SheetTitle
            className="text-[#3D281E] text-lg"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            {title}
          </SheetTitle>
        </SheetHeader>
        {elementId && def && !isReadOnly && (
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
            worksRecruitingContent={worksRecruitingContent}
            onWorksRecruitingChange={onWorksRecruitingChange}
          />
        )}
        {elementId && isReadOnly && <ReadOnlyElementPanel label={title} />}
      </SheetContent>
    </Sheet>
  );
}
