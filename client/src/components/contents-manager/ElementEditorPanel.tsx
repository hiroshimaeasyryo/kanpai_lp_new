import { HomeElementEditor, type HomeElementEditorProps } from "@/components/contents-manager/HomeElementEditor";
import { LpElementEditor } from "@/components/contents-manager/LpElementEditor";
import { getLpKind } from "@/lib/content-manager/cm-preview";
import type { Dispatch, SetStateAction } from "react";
import type { SelfReflectionContent } from "@/components/SelfReflectionEditor";
import type { BtobSeminarContent } from "@/types/btob-seminar";
import type { StartingJobHuntingContent } from "@/types/starting-job-hunting";
import type { SelfStanceContent } from "@/types/self-stance";

export interface ElementEditorPanelProps {
  selectedSlug: string;
  editorSection: string;
  homeProps: HomeElementEditorProps | null;
  btobSeminarContent: BtobSeminarContent | null;
  onBtobSeminarChange: Dispatch<SetStateAction<BtobSeminarContent | null>>;
  selfReflectionContent: SelfReflectionContent | null;
  onSelfReflectionChange: Dispatch<SetStateAction<SelfReflectionContent | null>>;
  startingJobHuntingContent: StartingJobHuntingContent | null;
  onStartingJobHuntingChange: Dispatch<SetStateAction<StartingJobHuntingContent | null>>;
  selfStanceContent: SelfStanceContent | null;
  onSelfStanceChange: Dispatch<SetStateAction<SelfStanceContent | null>>;
}

export function ElementEditorPanel({
  selectedSlug,
  editorSection,
  homeProps,
  btobSeminarContent,
  onBtobSeminarChange,
  selfReflectionContent,
  onSelfReflectionChange,
  startingJobHuntingContent,
  onStartingJobHuntingChange,
  selfStanceContent,
  onSelfStanceChange,
}: ElementEditorPanelProps) {
  const kind = getLpKind(selectedSlug);

  if (kind === "home" && homeProps) {
    return <HomeElementEditor {...homeProps} sectionId={editorSection} />;
  }

  if (kind === "btob_seminar" && btobSeminarContent) {
    return (
      <LpElementEditor
        kind={kind}
        slug={selectedSlug}
        sectionId={editorSection}
        content={btobSeminarContent}
        onChange={(next) =>
          onBtobSeminarChange((prev) => {
            const base = prev ?? btobSeminarContent;
            return typeof next === "function" ? next(base) : next;
          })
        }
      />
    );
  }

  if (kind === "self_reflection" && selfReflectionContent) {
    return (
      <LpElementEditor
        kind={kind}
        slug={selectedSlug}
        sectionId={editorSection}
        content={selfReflectionContent}
        onChange={(next) =>
          onSelfReflectionChange((prev) => {
            const base = prev ?? selfReflectionContent;
            return typeof next === "function" ? next(base) : next;
          })
        }
      />
    );
  }

  if (kind === "starting_job_hunting" && startingJobHuntingContent) {
    return (
      <LpElementEditor
        kind={kind}
        slug={selectedSlug}
        sectionId={editorSection}
        content={startingJobHuntingContent}
        onChange={(next) =>
          onStartingJobHuntingChange((prev) => {
            const base = prev ?? startingJobHuntingContent;
            return typeof next === "function" ? next(base) : next;
          })
        }
      />
    );
  }

  if (kind === "self_stance" && selfStanceContent) {
    return (
      <LpElementEditor
        kind={kind}
        slug={selectedSlug}
        sectionId={editorSection}
        content={selfStanceContent}
        onChange={(next) =>
          onSelfStanceChange((prev) => {
            const base = prev ?? selfStanceContent;
            return typeof next === "function" ? next(base) : next;
          })
        }
      />
    );
  }

  return <p className="text-sm text-[#5C3E2A]">コンテンツを読み込み中…</p>;
}
