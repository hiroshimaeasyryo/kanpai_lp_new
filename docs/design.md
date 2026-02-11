# KANPAI就活 LP 設計書

**版**: 1.0  
**前提**: 要件定義書（requirements.md）を満たす構築を行う。

---

## 1. システム構成

### 1.1 全体像

```
[運用者] → [Contents Manager (GUI)] → [設定の保存]
                                              ↓
[リポジトリ] ← 設定ファイル(JSON/YAML) + 画像(assets) ← [保存フロー]
     ↓
[GitHub Actions など] → ビルド → [Github Pages] → [公開LP]
     ↑
[媒体別URL] 同一LP + ?from=free / ?from=saiyocom 等
```

- **編集**: ブラウザ上の Contents Manager のみ。編集対象はすべてここに集約する。
- **永続化**: 設定はリポジトリ内の設定ファイル（例: `content/settings.json`）および画像は `public/assets/images/` 等に保存する形を想定。
- **公開**: 同一ビルド成果物を Github Pages で配信。媒体別は URL クエリのみで区別する。

### 1.2 技術スタック（現状との整合）

| レイヤー | 技術 | 備考 |
|----------|------|------|
| フロント（LP） | React, Vite, TypeScript, Tailwind | 現行 client をベースに拡張 |
| 管理画面 | Contents Manager（同一アプリ内のルート） | Image Manager は廃止し機能を統合済み（/image-manager → /contents-manager リダイレクト） |
| ビルド | Vite | `vite build` で静的成果物を出力 |
| ホスティング | Github Pages | 静的サイトとして配信 |
| データ | 設定ファイル（JSON） + 画像ファイル | リポジトリに含める、またはビルド時に注入 |

### 1.3 Github Pages 向けのビルド出力

- **ビルド成果物**: SPA のため、`index.html` と JS/CSS アセットに加え、**設定データ**を組み込む方式を推奨。
  - 方式 A: ビルド前に `content/settings.json` 等を読み込み、環境変数や `import` でバンドルに含める。
  - 方式 B: 設定を `public/settings.json` に置き、LP は fetch で読み込む（初回表示のわずかな遅延とキャッシュの考慮が必要）。
- **ベースパス**: Github Pages でリポジトリ名をパスに含める場合は、`vite.config.ts` の `base` を `'/リポジトリ名/'` に設定する。

---

## 2. データモデル・設定構造

### 2.1 設定ファイルのスキーマ（案）

編集対象を Contents Manager に集約するため、**1 つの設定オブジェクト**で以下を表現する。

```ts
// 設定の全体像（TypeScript 型のイメージ）
interface LPContentSettings {
  /** メタ・テーマ */
  themeId: string;                    // カラーパレット識別子（例: "default", "forest"）
  
  /** ブランドロゴ */
  logo: {
    url: string | null;               // 正規化後のファイル名または URL。null はデフォルト表示
  };
  
  /** イベント画像（枚数可変） */
  eventImages: Array<{
    id: string;                       // 一意ID（UUID 等）
    url: string;                      // 正規化後のファイル名または URL
    order: number;                    // 表示順
  }>;
  
  /** イベント一覧 */
  events: Array<KanpaiEvent>;         // 既存の KanpaiEvent 型を流用
}
```

- **themeId**: 5〜10 種類のカラーパレットを定義し、ここで選択する。
- **logo.url**: アップロード時は「プログラムで付与したファイル名」または「保存先 URL」のみを格納する。
- **eventImages**: 固定 3 枚ではなく配列にし、GUI で追加・削除・並び替え可能にする（要件 F-11 に対応）。

### 2.2 既存型との対応

- **KanpaiEvent**: `client/src/types/events.ts` の `KanpaiEvent` をそのまま利用する。
- 現行の「localStorage にイベント・画像 URL を保存」する仕様は、**Github Pages 運用時**には「設定ファイルをビルドに組み込む」方式に移行する。Contents Manager の「保存」は、この設定ファイルを更新するフローに接続する。

---

## 3. Contents Manager の画面・機能設計

### 3.1 画面構成（一元化）

- **1 画面で完結**: ロゴ、イベント画像、イベント一覧、テーマ選択をすべて同一画面（またはタブ/セクション）で編集する。
- **Image Manager** は廃止し、`/image-manager` は `/contents-manager` へリダイレクトする（既存の実装を維持）。
- **セクション例**:
  1. アクセスコード入力（未解除時）
  2. ブランドロゴ
  3. イベント画像（枚数可変・並び替え可能）
  4. イベント管理（一覧・追加・編集・削除・並び替え）
  5. テーマ（カラーパレット）選択
  6. 保存・プレビュー・エクスポート

### 3.2 画像の扱い（ファイル名の正規化・GUI 完結）

**方針**: ユーザーは「ファイルを選ぶ」だけ。ファイル名はすべてプログラム側で統一する。

- **正規化ルール（案）**
  - ロゴ: 拡張子を抽出し、`logo.{ext}` に統一（例: `logo.png`, `logo.webp`）。形式は許可リスト（png, jpg, jpeg, webp, svg）に限定。
  - イベント画像: スロットまたは連番で一意にし、`event-{id}.{ext}` または `scene-{order}.{ext}` のように保存する。`id` は UUID や order で付与。
- **実装オプション**
  - **クライアントのみ（現状に近い）**: アップロード時に File を Data URL または Blob にし、表示用のキー（`scene1`, `scene2` や `eventImages[i].id`）と対応付けてメモリ/localStorage で保持。ファイル名は「スロット名 + 拡張子」をプログラムで生成し、**エクスポート時や API 送信時にその名前で保存**する。
  - **サーバー/API 経由**: アップロード API でファイルを受け取り、サーバー側で正規化したファイル名で保存し、返却された URL またはファイル名を設定に書き込む。Github Pages のみの場合は、**ビルド時にリポジトリ内の画像を参照する**ため、保存先は「リポジトリ内の `public/assets/images/`」を想定し、API は「GitHub API でファイルをコミットする」か「一時アップロード → 手動でリポジトリに配置」のいずれかで実現する。
- **推奨（フェーズ 1）**: 
  - 編集時はクライアント側で Data URL または Blob を保持し、**エクスポート**で「設定 JSON + 画像を ZIP または個別ファイルでダウンロード」する。画像ファイル名はプログラムで `logo.png`, `event-0.png`, `event-1.png` のように付与する。
  - 運用側は「エクスポートした設定と画像をリポジトリの決まった場所に配置し、コミット → デプロイ」する手順で公開する。完全 GUI 完結ではないが、**ファイル名をユーザーが考えずに済む**点で運用負荷を下げる。
- **推奨（フェーズ 2）**: 
  - GitHub API（または GitHub Actions の workflow_dispatch + アーティファクト）を使い、Contents Manager の「保存」でリポジトリ内の設定ファイルと画像を更新する。この場合、画像は Base64 またはバイナリで API に送り、サーバー/Actions 側で正規化したファイル名でコミットする。

### 3.3 テーマ（カラーパレット）

- **定義場所**: CSS 変数または Tailwind のテーマ拡張で、5〜10 パターンを定義する（例: `index.css` または `theme/*.css`）。
- **選択 UI**: Contents Manager でラジオまたはカード一覧から `themeId` を選択する。選択結果は設定の `themeId` に保存する。
- **LP 側**: ビルド時に `settings.themeId` を読み、対応する CSS クラスや data-theme をルートに付与する。

---

## 4. 画像保存先とファイル名戦略（詳細）

### 4.1 ディレクトリ構成（リポジトリ内の案）

```
（リポジトリルート）
├── client/
├── content/
│   └── settings.json          # 設定（ロゴ・イベント画像の参照・イベント一覧・themeId）
├── public/
│   └── assets/
│       └── images/
│           ├── logo.png       # 正規化後のロゴ
│           ├── event-0.png    # イベント画像 1
│           ├── event-1.png
│           └── event-2.png
├── docs/
└── ...
```

- 設定ファイルには **ファイル名のみ**（例: `"logo": "logo.png"`）または **パス**（例: `"/assets/images/logo.png"`）を保存する。絶対 URL の場合は外部ストレージ用。

### 4.2 正規化の具体例（プログラムで強制するファイル名）

| 種別 | ユーザーが選ぶファイル | プログラムが付与する名前 |
|------|------------------------|---------------------------|
| ロゴ | 任意（例: `会社ロゴ_2024.png`） | `logo.png` または `logo.{ext}`（拡張子は許可リストから） |
| イベント画像 1 | 任意 | `event-0.{ext}` または `scene-1.{ext}` |
| イベント画像 2 | 任意 | `event-1.{ext}` |
| 追加分 | 任意 | `event-2.{ext}` ... |

- 拡張子は元ファイルの MIME から判定し、`.png` / `.jpg` / `.jpeg` / `.webp` / `.svg` のみ許可。それ以外は既定で `.png` などに変換するか、エラー表示する。
- 日本語・スペース・特殊文字は一切使わず、ASCII とハイフンのみに限定する。

### 4.3 他案（参考）

- **外部ストレージ（S3, Cloudinary 等）**: アップロード先で一意キー（UUID）の URL を返し、設定にはその URL のみを保存する。ファイル名の心配は不要だが、コスト・運用が増える。
- **GitHub API でコミット**: 選択したファイルを Base64 で GitHub Contents API に送り、`public/assets/images/logo.png` 等のパスでコミットする。トークン管理と権限設定が必要。

---

## 5. 媒体別 URL・流入分析

- **LP 側**: 同一ビルド・同一オリジン。特別な分岐は不要。
- **URL 例**: `https://example.com/`, `https://example.com/?from=free`, `https://example.com/?from=saiyocom`
- **分析**: 計測タグ（Google Analytics 等）で `location.search` や `from` を読み、イベントやカスタムディメンションで送信する。設計書のスコープでは「クエリを付けた URL を配布できること」までを保証し、分析基盤の詳細は別途定義する。

---

## 6. デプロイ・CI

### 6.1 Github Pages の公開ブランチ

- 通常は `main` の `docs/` または `gh-pages` ブランチにビルド成果物を出力する方式を採用する。
- **Vite の出力先**: `base` を合わせた上で、`vite build` の `outDir` を `docs`（または GitHub Pages のルートに合わせる）にすると、そのまま Pages で配信できる。

### 6.2 ビルドと設定の取り込み

- ビルド前に `content/settings.json` が存在する場合、それを読み込み、LP のランタイムまたはビルド時に注入する。
- 開発時は、`content/settings.json` が無い場合はデフォルト設定（または localStorage のフォールバック）で動作させる。

### 6.3 編集反映フロー（推奨）

1. **フェーズ 1（手動反映）**
   - Contents Manager で編集 → 「エクスポート」で `settings.json` と画像ファイル（正規化済み名前）をダウンロード。
   - 担当者がリポジトリの `content/settings.json` と `public/assets/images/` を更新し、コミット・プッシュ。
   - CI（GitHub Actions）でビルド・Github Pages にデプロイ。

2. **フェーズ 2（半自動〜自動、任意）**
   - Contents Manager の「保存」で GitHub API を呼び、設定ファイルと画像をコミットする。
   - または、Actions の `workflow_dispatch` で「アーティファクトから設定・画像を取得してコミット → ビルド」する。

---

## 7. 既存コードとの整合・移行

### 7.1 Contents Manager の拡張

- **既存**: `ContentsManager.tsx` でロゴ・3 枚の画像・イベント一覧を編集し、localStorage に保存している。
- **移行**: 
  - データソースを「localStorage」から「設定ファイル（ビルド時に読み込んだオブジェクト）＋ 編集時はメモリ/localStorage」に切り替える。
  - イベント画像を「3 枚固定」から「配列で可変」に変更する。
  - テーマ選択セクションを追加する。
  - 画像アップロード時、送信・エクスポート時にファイル名を正規化する処理を追加する。

### 7.2 Image Manager

- 既に `/image-manager` は `/contents-manager` にリダイレクトしているため、**Image Manager ページの実装は削除してよい**（または残しても未使用）。編集はすべて Contents Manager に集約する。

### 7.3 ImageUploader の拡張

- 現在は `FileReader.readAsDataURL` で Data URL を渡している。Github Pages 運用では次のいずれかが必要:
  - **エクスポート時**: File または Blob を「正規化したファイル名」でダウンロードする。
  - **API 送信時**: FormData で送る際、ファイル名を `logo.png` 等に差し替える（`File` のコンストラクタや `File` を継承したラップで名前だけ変更する）。

### 7.4 データ永続化の切り替え

- **開発・プレビュー**: 従来どおり localStorage でも可。
- **本番（Github Pages）**: ビルド時に `content/settings.json` を読み、LP の初期状態として注入する。編集結果を「その場で永続化」するには、エクスポート → リポジトリ更新、または API 経由のコミットが必要。

---

## 8. セキュリティ・運用上の注意

- Contents Manager のアクセスコードは、推測困難な文字列にし、必要に応じて環境変数で注入する。
- GitHub API を使う場合は、**最小権限の Personal Access Token または GitHub App** を使い、Secrets で管理する。
- 画像の MIME タイプ・拡張子のホワイトリストを必ずチェックし、実行可能ファイル等が混入しないようにする。

---

## 9. ドキュメント・次のアクション

- **運用マニュアル**: 「設定のエクスポート → リポジトリへの配置 → コミット・プッシュ」までを手順書にまとめる。
- **構築フェーズ**: 本設計書に沿って、(1) 設定スキーマと保存先の確定、(2) Contents Manager の拡張（画像可変・テーマ・正規化）、(3) ビルドへの設定取り込み、(4) Github Pages デプロイ、の順で実装する。

---

*本設計書は要件定義書（requirements.md）とあわせて構築の入力とする。*
