import { applyContentToLocalStorage, getContentFromLocalStorage } from "@/lib/content-loader";
import { getLpKind } from "@/lib/content-manager/cm-preview";
import { mergeBtobSeminarContent } from "@/types/btob-seminar";
import type { ContentPayload } from "@/types/content-payload";
import { HOME_COPY_STORAGE_KEY } from "@/types/home-copy";
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

/** Home 系 LP が applyContentToLocalStorage で更新するキー */
const HOME_PREVIEW_STORAGE_KEYS = [
  HOME_COPY_STORAGE_KEY,
  "kanpai_logo",
  "kanpai_hero_image",
  "kanpai_hero_image_mobile",
  "kanpai_event_images",
  "kanpai_events",
  "kanpai_features",
  "kanpai_theme",
  "kanpai_campaign2603_notice",
] as const;

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** プレビュー iframe が監視すべき localStorage キー */
export function getPreviewStorageKeys(slug: string): string[] {
  const kind = getLpKind(slug);
  if (kind === "home") return [...HOME_PREVIEW_STORAGE_KEYS];
  const key = STORAGE_KEYS[slug];
  return key ? [key] : [];
}

/** localStorage から draft を復元（postMessage 失敗時のフォールバック） */
export function readDraftFromPreviewStorage(slug: string): ContentPayload | null {
  const kind = getLpKind(slug);
  if (kind === "home") {
    return getContentFromLocalStorage();
  }

  const key = STORAGE_KEYS[slug];
  if (!key) return null;

  const raw = safeGetItem(key);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    switch (kind) {
      case "btob_seminar":
        return { btobSeminar: mergeBtobSeminarContent(parsed) };
      case "self_reflection":
        return { selfReflection: parsed as ContentPayload["selfReflection"] };
      case "starting_job_hunting":
        return { startingJobHunting: mergeStartingJobHuntingContent(parsed) };
      case "self_stance":
        return { selfStance: mergeSelfStanceContent(parsed) };
      case "js_self_analysis":
        return { jsSelfAnalysis: mergeJsSelfAnalysisContent(parsed) };
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/** 親フレームの localStorage 更新を iframe プレビューが追従 */
export function subscribePreviewStorage(slug: string, onSync: () => void): () => void {
  const keys = new Set(getPreviewStorageKeys(slug));
  if (keys.size === 0) return () => {};

  const handler = (event: StorageEvent) => {
    if (event.key && keys.has(event.key)) {
      onSync();
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

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
