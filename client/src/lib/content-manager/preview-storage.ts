import { applyContentToLocalStorage } from "@/lib/content-loader";
import { getLpKind } from "@/lib/content-manager/cm-preview";
import { mergeBtobSeminarContent } from "@/types/btob-seminar";
import type { ContentPayload } from "@/types/content-payload";
import { mergeSelfStanceContent } from "@/types/self-stance";
import { mergeStartingJobHuntingContent } from "@/types/starting-job-hunting";
import { mergeJsSelfAnalysisContent } from "@/types/js-self-analysis";

const STORAGE_KEYS: Partial<Record<string, string>> = {
  btob_seminar: "btob_seminar_content_v1",
  "self-reflection": "self_reflection_content_v1",
  starting_job_hunting: "starting_job_hunting_content_v1",
  "self-stance": "self_stance_content_v1",
  js_self_analysis: "js_self_analysis_content_v1",
};

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* QuotaExceededError 等 */
  }
}

/** ContentsManager の draft をプレビュー iframe が読める localStorage に反映する */
export function applyDraftToPreviewStorage(slug: string, payload: ContentPayload): void {
  const kind = getLpKind(slug);
  if (kind === "home") {
    applyContentToLocalStorage(payload);
    return;
  }

  const key = STORAGE_KEYS[slug];
  if (!key) return;

  if (kind === "btob_seminar" && payload.btobSeminar) {
    const merged = mergeBtobSeminarContent(payload.btobSeminar);
    safeSetItem(key, JSON.stringify(merged));
    return;
  }
  if (kind === "self_reflection" && payload.selfReflection) {
    safeSetItem(key, JSON.stringify(payload.selfReflection));
    return;
  }
  if (kind === "starting_job_hunting" && payload.startingJobHunting) {
    const merged = mergeStartingJobHuntingContent(payload.startingJobHunting);
    safeSetItem(key, JSON.stringify(merged));
    return;
  }
  if (kind === "self_stance" && payload.selfStance) {
    const merged = mergeSelfStanceContent(payload.selfStance);
    safeSetItem(key, JSON.stringify(merged));
    return;
  }
  if (kind === "js_self_analysis" && payload.jsSelfAnalysis) {
    const merged = mergeJsSelfAnalysisContent(payload.jsSelfAnalysis);
    safeSetItem(key, JSON.stringify(merged));
  }
}
