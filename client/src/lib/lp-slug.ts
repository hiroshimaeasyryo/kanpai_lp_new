/**
 * 複数LP運用: スラグ・予約語・コンテンツパス
 * 方式A: スラグ別 JSON（content/{slug}.json）、トップは "root" スラグ
 */

/** トップページ（/）に対応するスラグ。LP名には使わない */
export const TOP_SLUG = "root" as const;

/**
 * LP名（スラグ）に使用できない予約語。
 * ルートと衝突するパスおよび content 配下のパスと紛らわしい名前を禁止する。
 */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  "contents-manager",
  "poprock_redirect",
  "thanks_ks",
  "image-manager",
  "404",
  "content",
  "api",
  "assets",
  "root", // トップ用に使用するため予約
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

/** 配信時のコンテンツディレクトリ（先頭の / は付けない。base と結合する想定） */
export const CONTENT_DIR = "content";

/** 配信時の manifest.json のパス（先頭スラッシュ付き） */
export const CONTENT_MANIFEST_PATH = `/${CONTENT_DIR}/manifest.json`;

/**
 * 指定スラグのコンテンツJSONの配信パス（先頭スラッシュ付き）
 * 例: /content/root.json, /content/main.json
 */
export function getContentPathForSlug(slug: string): string {
  return `/${CONTENT_DIR}/${slug}.json`;
}

/**
 * リポジトリ内でのコンテンツJSONの相対パス（GitHub API / 保存用）
 * 例: client/public/content/root.json
 */
export const CONTENT_DIR_REPO = "client/public/content";

export function getContentRepoPathForSlug(slug: string): string {
  return `${CONTENT_DIR_REPO}/${slug}.json`;
}

/** manifest.json のリポジトリ内パス */
export const CONTENT_MANIFEST_REPO_PATH = `${CONTENT_DIR_REPO}/manifest.json`;

export interface ContentManifest {
  /** 存在するLPのスラグ一覧（表示・編集選択用） */
  slugs: string[];
}
