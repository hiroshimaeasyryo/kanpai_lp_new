# contents-manager 保存用 API（GCP Cloud Functions）

LP のコンテンツ管理画面から「保存してデプロイ」を、**GitHub PAT をブラウザで入力せずに**実行するための API です。[worksLp](https://github.com/hiroshimaeasyryo/worksLp) の gcp-save-api と同様の仕組みで、GCP の Cloud Functions（Gen2）に 1 回だけデプロイして利用します。編集者は**アクセスコードだけで入室**し、**保存時もトークン入力は不要**です。

## 必要な環境変数

| 変数名 | 説明 |
|--------|------|
| `GITHUB_TOKEN` | GitHub Personal Access Token（repo スコープ、または Contents: Read and write） |
| `CONTENTS_SAVE_SECRET` | ブラウザから API を呼ぶときの合言葉。`client/public/repo-config.json` の `saveApiSecret` と同一の値にする |

## デプロイ手順

1. [Google Cloud のドキュメント](https://cloud.google.com/functions/docs/deploy) に従い、gcloud CLI でプロジェクトを選択・認証する。

2. このディレクトリで次を実行（プレースホルダーを実際の値に置き換える）。

```bash
gcloud functions deploy saveContent \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region asia-northeast1 \
  --set-env-vars "GITHUB_TOKEN=ghp_xxxx,CONTENTS_SAVE_SECRET=あなたの共有シークレット"
```

3. デプロイ後に表示される URL（例: `https://asia-northeast1-PROJECT_ID.cloudfunctions.net/saveContent`）を、LP リポジトリの **`client/public/repo-config.json`** に設定する。

**チェック**:

`saveApiUrl` と `saveApiSecret` を設定すると、管理画面では **GitHub トークン入力欄は表示されず**、「保存してデプロイ」だけで反映されます（非エンジニアでも利用しやすくなります）。

## PAT を Secret Manager で扱う場合

---

```bash
echo -n "ghp_xxxx" | gcloud secrets create github-token --data-file=-

gcloud functions deploy saveContent \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region asia-northeast1 \
  --set-secrets="GITHUB_TOKEN=github-token:latest" \
  --set-env-vars "CONTENTS_SAVE_SECRET=あなたの共有シークレット"
```

## API 契約（フロント・バック共通）

---

## Step 4：repo-config.json に URL とシークレットを書く

**今やること**

1. リポジトリの **`client/public/repo-config.json`** を開く（なければ `client/public/repo-config.json.example` をコピーして `repo-config.json` を作成）。

2. 次の 5 項目が正しく入っているか確認・編集する：

| キー | 値 |
|------|-----|
| `owner` | GitHub のユーザー名または組織名 |
| `repo` | この LP のリポジトリ名（例: `kanpai_lp_new`） |
| `branch` | 対象ブランチ（通常は `main`） |
| `saveApiUrl` | **Step 3 でメモした Cloud Functions の URL**（そのまま貼り付け） |
| `saveApiSecret` | **Step 2 で決めた「共有シークレット」**（デプロイ時に渡した値と完全に同じ） |

例:

```json
{
  "owner": "your-org",
  "repo": "kanpai_lp_new",
  "branch": "main",
  "saveApiUrl": "https://asia-northeast1-xxxxx.cloudfunctions.net/saveContent",
  "saveApiSecret": "my-secret-abc123xyz"
}
```

3. 保存して、必要ならコミット・push する（本番サイトにデプロイされていれば、次回の読み込みから反映される）。

```json
{
  "owner": "your-org",
  "repo": "kanpai_lp_new",
  "branch": "main",
  "saveApiUrl": "https://asia-northeast1-PROJECT_ID.cloudfunctions.net/saveContent",
  "saveApiSecret": "あなたの共有シークレット"
}
```

- `saveApiUrl` の末尾が `/saveContent` になっているか。
- `saveApiSecret` が Step 2 と Step 3 で使った値と **完全に同じ** か（余計なスペースや改行がないか）。

ここまでできたら **Step 5** へ。

PAT を環境変数に直接書かない場合は、Secret Manager に登録してからマウントする。

## Step 5：動作確認する

**今やること**

1. 本番（またはプレビュー）の **コンテンツ管理画面**（`/contents-manager`）を開く。
2. **アクセスコード** で入室する。
3. 画面上部の「保存して反映」ブロックを確認する。
   - **期待**: 「保存 API が設定されています。トークン入力は不要です。」と表示され、**GitHub トークン入力欄が出ていない**こと。
4. テスト用に、何か 1 つだけ編集する（例: 特徴のテキストを少し変える）。
5. **「保存してデプロイ」** をクリックする。
6. 「保存しました。push により数分以内にサイトに反映されます。」と出るか確認する。
7. （任意）GitHub のリポジトリで、直近のコミットに `contents-manager: update client/public/content.json` のようなメッセージが付いているか確認する。
8. 数分待ってから LP を開き、編集した内容が反映されているか確認する。

**チェック**:

- 保存時にエラーが出ず、LP に変更が反映されれば完了。

---

## うまくいかないとき

| 症状 | 確認すること |
|------|----------------|
| デプロイでエラーになる | `gcloud config set project` で正しいプロジェクトか、課金が有効か、`--region` が利用可能なリージョンか確認する。 |
| 管理画面で「保存に失敗しました」 | `saveApiSecret` と GCP の `CONTENTS_SAVE_SECRET` が完全に同じか、`saveApiUrl` が正しいか確認する。 |
| 401 Unauthorized | 共有シークレットが 1 文字でも違っていないか、前後にスペースが入っていないか確認する。 |
| GitHub 側のエラー（404 / 403 など） | PAT に repo（または Contents）権限があるか、`owner` / `repo` / `branch` が実際のリポジトリと一致しているか確認する。 |

Cloud Functions のログは、GCP コンソールの「Cloud Functions」→ 該当関数 → 「ログ」で確認できる。

---

## 参考：API の仕様（フロント・バック共通）

- **メソッド**: POST
- **認証**: リクエスト body の `secret`、または `Authorization: Bearer <saveApiSecret>`。いずれも `CONTENTS_SAVE_SECRET` と一致すること。
- **Body**: `{ path, content, owner, repo, branch? }`
  - `path`: リポジトリ内のファイルパス（本プロジェクトでは `client/public/content.json`）
  - `content`: 更新する内容。オブジェクトの場合は JSON 文字列化して base64 する
  - `owner`, `repo`, `branch`: GitHub のリポジトリ情報
