/**
 * 端末間同期用: スラグ別 content/{slug}.json の取得と localStorage フォールバック
 * - 先に /content/{slug}.json を fetch し、あればそれを正とする
 * - fetchContent() はトップ用（root スラグ）、従来の /content.json にフォールバック
 */
import {
  getStoredCampaign2603Notice,
  getStoredEventImages,
  getStoredFeatures,
  getStoredHeroImage,
  getStoredHeroImageMobile,
  migrateOldImageFormat,
  setStoredCampaign2603Notice,
  setStoredEventImages,
  setStoredFeatures,
  setStoredHeroImage,
  setStoredHeroImageMobile,
} from "@/lib/content-settings";
import { getContentPathForSlug, CONTENT_MANIFEST_PATH, TOP_SLUG } from "@/lib/lp-slug";
import type { ContentManifest } from "@/lib/lp-slug";
import { getStoredPaletteId, setStoredPaletteId } from "@/lib/theme-palettes";
import type { ContentPayload } from "@/types/content-payload";
import { CONTENT_JSON_PATH } from "@/types/content-payload";
import { getStoredEvents, setStoredEvents } from "@/types/events";

function isContentPayload(v: unknown): v is ContentPayload {
  return v !== null && typeof v === "object";
}

function getBaseUrl(): string {
  return typeof import.meta.env?.BASE_URL === "string" && import.meta.env.BASE_URL !== "/"
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : "";
}

/**
 * 指定スラグのコンテンツを /content/{slug}.json から取得する。
 */
export async function fetchContentBySlug(slug: string): Promise<ContentPayload | null> {
  if (typeof window === "undefined") return null;
  try {
    const base = getBaseUrl();
    const path = getContentPathForSlug(slug);
    const res = await fetch(`${base}${path}`, {
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
 * 編集可能なLP一覧（manifest）を取得する。
 */
export async function fetchContentManifest(): Promise<ContentManifest | null> {
  if (typeof window === "undefined") return null;
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}${CONTENT_MANIFEST_PATH}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (data !== null && typeof data === "object" && Array.isArray((data as ContentManifest).slugs)) {
      return data as ContentManifest;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * トップ用コンテンツを取得する。
 * 先に /content/root.json を試し、なければ従来の /content.json にフォールバックする。
 */
export async function fetchContent(): Promise<ContentPayload | null> {
  const bySlug = await fetchContentBySlug(TOP_SLUG);
  if (bySlug) return bySlug;
  if (typeof window === "undefined") return null;
  try {
    const base = getBaseUrl();
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

/** QuotaExceededError 等を避けるため localStorage 読み取りを try/catch で保護 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
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
    logo: safeGetItem("kanpai_logo"),
    hero: getStoredHeroImage(),
    heroMobile: getStoredHeroImageMobile(),
    eventImages: eventImages && eventImages.length > 0 ? eventImages : undefined,
    events: getStoredEvents(),
    features: getStoredFeatures(),
    paletteId: getStoredPaletteId(),
    campaign2603Notice: getStoredCampaign2603Notice(),
  };
}

/**
 * ContentPayload の内容を localStorage に書き込む。
 * 管理画面でリモートを読み込んだあとフォームと同期する場合や、
 * 保存前にローカルプレビューを合わせる場合に使用。
 */
function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* QuotaExceededError 等 */
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* 同上 */
  }
}

export function applyContentToLocalStorage(payload: ContentPayload): void {
  if (typeof window === "undefined") return;
  if (payload.logo !== undefined) {
    if (payload.logo) safeSetItem("kanpai_logo", payload.logo);
    else safeRemoveItem("kanpai_logo");
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
  if (payload.campaign2603Notice !== undefined) {
    setStoredCampaign2603Notice(payload.campaign2603Notice);
  }
}
