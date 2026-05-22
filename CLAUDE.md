# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリ

GitHub: https://github.com/hiroshimaeasyryo/kanpai_lp_new

## プロジェクト概要

KANPAI就活のランディングページ（LP）サイト。複数LPをスラグベースで管理でき、コンテンツマネージャー画面からLP内容を編集・デプロイできる。
カスタムドメイン: `l.careerevent.kanpai-hutte.com`

## コマンド

```bash
pnpm install          # 依存インストール
pnpm dev              # 開発サーバー起動 (port 3000)
pnpm build            # Vite でクライアントビルド + esbuild でサーバーバンドル
pnpm start            # 本番サーバー起動 (dist/index.js)
pnpm check            # TypeScript 型チェック (tsc --noEmit)
pnpm format           # Prettier でフォーマット
pnpm optimize-images  # sharp で画像最適化
```

## アーキテクチャ

### クライアント/サーバー分離

- **client/**: React SPA（Vite + React 19 + Tailwind CSS v4 + shadcn/ui）
- **server/**: Express の静的ファイルサーバー（本番用 SPA ホスティング）。API ロジックは持たない
- **shared/**: クライアント・サーバー共通の定数（`const.ts`）

### パスエイリアス

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### 複数LP管理の仕組み

LPコンテンツは `client/public/content/` 配下の JSON ファイルで管理される。ビルド時に `vite.config.ts` の `vitePluginContentManifest` が `manifest.json` を自動生成する。

- `content/root.json` — トップページ (`/`) のコンテンツ
- `content/{slug}.json` — `/:lpSlug` でアクセスされるLP
- コンテンツのロード/保存: `client/src/lib/content-loader.ts`, `client/src/lib/github-content-api.ts`
- スラグの予約判定: `client/src/lib/lp-slug.ts`

### ルーティング（wouter）

- `/` — メインLP（Home）
- `/:lpSlug` — スラグ指定のLP（予約スラグでなければ Home にスラグを渡す）
- `/contents-manager` — コンテンツ管理画面
- `/thanks_ks`, `/poprock_redirect`, `/self-reflection`, `/self-stance` — 固定ページ

### テーマ・カラーパレット

- `PaletteContext` でカラーパレットを動的に切り替え可能（`client/src/lib/theme-palettes.ts`）
- `ThemeContext` でダーク/ライトテーマ管理
- デザイン思想: "Wa-Modern Minimalism"（和モダンミニマリズム）

### デプロイ

GitHub Pages（`.github/workflows/deploy-pages.yml`）。`main` ブランチへの push で自動デプロイ。
- ビルド成果物: `dist/public/`
- SPA対応: ビルド時に `404.html` を `index.html` のコピーとして生成
- `repo-config.json` は Secrets から CI で生成（`.gitignore` 済み）。詳細は `GITHUB_PAGES_REPO_CONFIG.md` 参照

### GCP Save API

`gcp-save-api/` にコンテンツ保存用の Cloud Functions がある。管理画面からトークンなしでコンテンツを保存・デプロイするために使用。
