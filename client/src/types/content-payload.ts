/**
 * リポジトリ配下の content.json / 端末間同期用のペイロード型。
 * すべてのコンテンツ管理項目を1つのJSONで扱う。
 */
import type { EventImage, FeatureItem } from "@/lib/content-settings";
import type { KanpaiEvent } from "@/types/events";

export interface ContentPayload {
  /** ブランドロゴ画像 URL。未設定時は null */
  logo?: string | null;
  /** ヒーロー画像（PC）URL */
  hero?: string | null;
  /** ヒーロー画像（モバイル）URL。未設定時は null */
  heroMobile?: string | null;
  /** イベントフロー用画像1〜3枚＋ラベル */
  eventImages?: EventImage[];
  /** 次回イベント一覧（表示順で先頭3件をLPで表示） */
  events?: KanpaiEvent[];
  /** Unique Features 3件 */
  features?: FeatureItem[];
  /** テーマパレットID（管理画面用。LPでは未使用） */
  paletteId?: string | null;
}

/** content.json のパス（配信時は /content.json） */
export const CONTENT_JSON_PATH = "/content.json";

/** リポジトリ内でのコンテンツファイル相対パス（GitHub API 更新用） */
export const CONTENT_JSON_REPO_PATH = "client/public/content.json";
