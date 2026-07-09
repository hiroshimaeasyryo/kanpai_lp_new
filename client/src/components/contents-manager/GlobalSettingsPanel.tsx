import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePalette } from "@/contexts/PaletteContext";
import { isHomeLp } from "@/lib/content-manager/cm-preview";
import { COLOR_PALETTES } from "@/lib/theme-palettes";
import type { BtobSeminarContent } from "@/types/btob-seminar";
import type { StartingJobHuntingContent } from "@/types/starting-job-hunting";
import type { SelfStanceContent } from "@/types/self-stance";
import type { JsSelfAnalysisContent } from "@/types/js-self-analysis";
import type { WorksRecruitingContent } from "@/types/works-recruiting";

interface GlobalSettingsPanelProps {
  selectedSlug: string;
  btobSeminarContent: BtobSeminarContent | null;
  onBtobSeminarChange: (c: BtobSeminarContent) => void;
  startingJobHuntingContent: StartingJobHuntingContent | null;
  onStartingJobHuntingChange: (c: StartingJobHuntingContent) => void;
  selfStanceContent: SelfStanceContent | null;
  onSelfStanceChange: (c: SelfStanceContent) => void;
  jsSelfAnalysisContent: JsSelfAnalysisContent | null;
  onJsSelfAnalysisChange: (c: JsSelfAnalysisContent) => void;
  worksRecruitingContent: WorksRecruitingContent | null;
  onWorksRecruitingChange: (c: WorksRecruitingContent) => void;
}

export function GlobalSettingsPanel({
  selectedSlug,
  btobSeminarContent,
  onBtobSeminarChange,
  startingJobHuntingContent,
  onStartingJobHuntingChange,
  selfStanceContent,
  onSelfStanceChange,
  jsSelfAnalysisContent,
  onJsSelfAnalysisChange,
  worksRecruitingContent,
  onWorksRecruitingChange,
}: GlobalSettingsPanelProps) {
  const { paletteId, setPaletteId } = usePalette();

  if (isHomeLp(selectedSlug)) {
    return (
      <div>
        <h2
          className="text-lg font-bold text-[#3D281E] mb-2"
          style={{ fontFamily: "'Shippori Mincho', serif" }}
        >
          テーマ（カラーパレット）
        </h2>
        <p className="text-sm text-[#5C3E2A] mb-4">
          LP全体の配色を切り替えます。選択するとプレビューに即時反映されます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.id}
              type="button"
              onClick={() => setPaletteId(palette.id)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                paletteId === palette.id
                  ? "border-[#d4844b] shadow-md ring-1 ring-[#d4844b]/30"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex gap-1.5 mb-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ background: palette.colors.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ background: palette.colors.textHeading }}
                />
              </div>
              <p className="text-xs font-medium text-[#3D281E]">{palette.nameJa}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedSlug === "btob_seminar" && btobSeminarContent) {
    return (
      <SeoFields
        title={btobSeminarContent.seo.title}
        description={btobSeminarContent.seo.description}
        onTitleChange={(title) =>
          onBtobSeminarChange({ ...btobSeminarContent, seo: { ...btobSeminarContent.seo, title } })
        }
        onDescriptionChange={(description) =>
          onBtobSeminarChange({
            ...btobSeminarContent,
            seo: { ...btobSeminarContent.seo, description },
          })
        }
      />
    );
  }

  if (selectedSlug === "starting_job_hunting" && startingJobHuntingContent) {
    return (
      <SeoFields
        title={startingJobHuntingContent.seo.title}
        description={startingJobHuntingContent.seo.description}
        onTitleChange={(title) =>
          onStartingJobHuntingChange({
            ...startingJobHuntingContent,
            seo: { ...startingJobHuntingContent.seo, title },
          })
        }
        onDescriptionChange={(description) =>
          onStartingJobHuntingChange({
            ...startingJobHuntingContent,
            seo: { ...startingJobHuntingContent.seo, description },
          })
        }
      />
    );
  }

  if (selectedSlug === "self-stance" && selfStanceContent) {
    return (
      <SeoFields
        title={selfStanceContent.seo.title}
        description={selfStanceContent.seo.description}
        onTitleChange={(title) =>
          onSelfStanceChange({
            ...selfStanceContent,
            seo: { ...selfStanceContent.seo, title },
          })
        }
        onDescriptionChange={(description) =>
          onSelfStanceChange({
            ...selfStanceContent,
            seo: { ...selfStanceContent.seo, description },
          })
        }
      />
    );
  }

  if (selectedSlug === "js_self_analysis" && jsSelfAnalysisContent) {
    return (
      <SeoFields
        title={jsSelfAnalysisContent.seo.title}
        description={jsSelfAnalysisContent.seo.description}
        onTitleChange={(title) =>
          onJsSelfAnalysisChange({
            ...jsSelfAnalysisContent,
            seo: { ...jsSelfAnalysisContent.seo, title },
          })
        }
        onDescriptionChange={(description) =>
          onJsSelfAnalysisChange({
            ...jsSelfAnalysisContent,
            seo: { ...jsSelfAnalysisContent.seo, description },
          })
        }
      />
    );
  }

  if (selectedSlug === "works_recruiting" && worksRecruitingContent) {
    return (
      <SeoFields
        title={worksRecruitingContent.seo.title}
        description={worksRecruitingContent.seo.description}
        onTitleChange={(title) =>
          onWorksRecruitingChange({
            ...worksRecruitingContent,
            seo: { ...worksRecruitingContent.seo, title },
          })
        }
        onDescriptionChange={(description) =>
          onWorksRecruitingChange({
            ...worksRecruitingContent,
            seo: { ...worksRecruitingContent.seo, description },
          })
        }
      />
    );
  }

  if (selectedSlug === "self-reflection") {
    return (
      <p className="text-sm text-[#5C3E2A]">
        このLPには SEO 設定がありません。CTA 等はプレビュー上の要素から編集できます。
      </p>
    );
  }

  return null;
}

function SeoFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: {
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2
        className="text-lg font-bold text-[#3D281E]"
        style={{ fontFamily: "'Shippori Mincho', serif" }}
      >
        SEO（title / description）
      </h2>
      <div>
        <Label className="text-[#3D281E]">ページタイトル</Label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1 border-[#ffd7c3]"
        />
      </div>
      <div>
        <Label className="text-[#3D281E]">メタ description</Label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="mt-1 border-[#ffd7c3] min-h-[80px]"
          rows={3}
        />
      </div>
    </div>
  );
}
