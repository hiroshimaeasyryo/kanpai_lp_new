/**
 * コンテンツ設定の localStorage 管理
 * 画像配列の保存・読み込み・旧フォーマットからの移行を提供
 */

export interface EventImage {
  id: string;
  url: string;
}

const EVENT_IMAGES_KEY = "kanpai_event_images";

/** localStorage からイベント画像配列を取得 */
export function getStoredEventImages(): EventImage[] | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(EVENT_IMAGES_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/** イベント画像配列を localStorage に保存 */
export function setStoredEventImages(images: EventImage[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENT_IMAGES_KEY, JSON.stringify(images));
}

/**
 * 旧フォーマット (kanpai_scene1/2/3) からの移行を試みる。
 * 見つかれば EventImage[] を返し、なければ null。
 */
export function migrateOldImageFormat(): EventImage[] | null {
  if (typeof window === "undefined") return null;
  const s1 = localStorage.getItem("kanpai_scene1");
  const s2 = localStorage.getItem("kanpai_scene2");
  const s3 = localStorage.getItem("kanpai_scene3");
  if (!s1 && !s2 && !s3) return null;

  const images: EventImage[] = [];
  if (s1) images.push({ id: "migrated-0", url: s1 });
  if (s2) images.push({ id: "migrated-1", url: s2 });
  if (s3) images.push({ id: "migrated-2", url: s3 });
  return images;
}

/** 画像の一意 ID を生成 */
export function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
