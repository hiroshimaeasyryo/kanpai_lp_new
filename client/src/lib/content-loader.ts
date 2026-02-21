/**
 * 端末間同期用: content.json の取得と localStorage フォールバック
 * - 先に /content.json を fetch し、あればそれを正とする
 * - 失敗時は従来どおり localStorage から構築
 */
import {
  getStoredEventImages,
  getStoredFeatures,
  getStoredHeroImage,
  getStoredHeroImageMobile,
  migrateOldImageFormat,
  setStoredEventImages,
  setStoredFeatures,
  setStoredHeroImage,
  setStoredHeroImageMobile,
} from "@/lib/content-settings";
import { getStoredPaletteId, setStoredPaletteId } from "@/lib/theme-palettes";
import type { ContentPayload } from "@/types/content-payload";
import { CONTENT_JSON_PATH } from "@/types/content-payload";
import { getStoredEvents, setStoredEvents } from "@/types/events";

function isContentPayload(v: unknown): v is ContentPayload {
  return v !== null && typeof v === "object";
}

/**
 * 配信されている /content.json を取得する。
 * 取得成功時は ContentPayload を返し、失敗・不正な形式の場合は null。
 */
export async function fetchContent(): Promise<ContentPayload | null> {
  if (typeof window === "undefined") return null;
  try {
    const base =
      typeof import.meta.env?.BASE_URL === "string" && import.meta.env.BASE_URL !== "/"
        ? import.meta.env.BASE_URL.replace(/\/$/, "")
        : "";
    const res = await fetch(`${base}${CONTENT_JSON_PATH}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return isContentPayload(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * 現在の localStorage の内容から ContentPayload を組み立てる。
 * フォールバック表示や、管理画面の「保存」用に使用。
 */
export function getContentFromLocalStorage(): ContentPayload {
  if (typeof window === "undefined") {
    return {};
  }
  const eventImages = getStoredEventImages() ?? migrateOldImageFormat();
  return {
    logo: localStorage.getItem("kanpai_logo"),
    hero: getStoredHeroImage(),
    heroMobile: getStoredHeroImageMobile(),
    eventImages: eventImages && eventImages.length > 0 ? eventImages : undefined,
    events: getStoredEvents(),
    features: getStoredFeatures(),
    paletteId: getStoredPaletteId(),
  };
}

/**
 * ContentPayload の内容を localStorage に書き込む。
 * 管理画面でリモートを読み込んだあとフォームと同期する場合や、
 * 保存前にローカルプレビューを合わせる場合に使用。
 */
export function applyContentToLocalStorage(payload: ContentPayload): void {
  if (typeof window === "undefined") return;
  if (payload.logo !== undefined) {
    if (payload.logo) localStorage.setItem("kanpai_logo", payload.logo);
    else localStorage.removeItem("kanpai_logo");
  }
  if (payload.hero !== undefined) {
    if (payload.hero) setStoredHeroImage(payload.hero);
    else setStoredHeroImage(null);
  }
  if (payload.heroMobile !== undefined) {
    if (payload.heroMobile) setStoredHeroImageMobile(payload.heroMobile);
    else setStoredHeroImageMobile(null);
  }
  if (payload.eventImages !== undefined && payload.eventImages.length > 0) {
    setStoredEventImages(payload.eventImages);
  }
  if (payload.events !== undefined && payload.events.length > 0) {
    setStoredEvents(payload.events);
  }
  if (payload.features !== undefined && payload.features.length >= 3) {
    setStoredFeatures(payload.features.slice(0, 3));
  }
  if (payload.paletteId !== undefined && payload.paletteId) {
    setStoredPaletteId(payload.paletteId);
  }
}
